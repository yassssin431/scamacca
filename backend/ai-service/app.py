from flask import Flask, jsonify
import pandas as pd
import numpy as np
from sqlalchemy import create_engine
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import IsolationForest
from statsmodels.tsa.arima.model import ARIMA

app = Flask(__name__)

# PostgreSQL connection
DB_USER = "postgres"
DB_PASSWORD = "postgres123"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "tradrly_db"  # ⚠️ remplace par ton vrai nom de DB

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)


def _next_months(last_date, count):
    start = pd.Timestamp(last_date).to_period("M").to_timestamp()
    return [start + pd.DateOffset(months=i) for i in range(1, count + 1)]

@app.route("/")
def home():
    return "✅ AI microservice is running!"

# -------------------------------
# Forecast Revenue (Trend-based)
# -------------------------------
@app.route("/forecast/revenue")
def forecast_revenue():
    query = '''
        SELECT time_id, amount
        FROM "FactRevenues"
        ORDER BY time_id ASC
        LIMIT 6
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No data available"})

    revenues = df["amount"].tolist()
    growth_rates = [(revenues[i] - revenues[i-1]) / revenues[i-1] for i in range(1, len(revenues))]
    avg_growth = sum(growth_rates) / len(growth_rates)

    last_value = revenues[-1]
    forecast = []
    for i in range(1, 4):
        last_value = last_value * (1 + avg_growth)
        forecast.append({"month": f"Forecast +{i}", "predictedRevenue": round(last_value)})

    return jsonify({
        "growthRate": round(avg_growth, 2),
        "forecast": forecast
    })

# -------------------------------
# Expense Anomalies (Statistical)
# -------------------------------
@app.route("/anomalies/expenses")
def anomalies_expenses():
    query = '''
        SELECT time_id, amount
        FROM "FactExpenses"
        ORDER BY time_id ASC
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No expense data available"})

    avg = df["amount"].mean()
    std_dev = df["amount"].std()
    anomalies = df[df["amount"] > avg + 2 * std_dev]

    return jsonify({
        "averageExpense": round(avg, 2),
        "stdDeviation": round(std_dev, 2),
        "anomalies": anomalies.to_dict(orient="records")
    })

# -------------------------------
# Forecast Revenue (Linear Regression)
# -------------------------------
@app.route("/ml/forecast/revenue")
def ml_forecast_revenue():
    query = '''
        SELECT time_id, amount
        FROM "FactRevenues"
        ORDER BY time_id ASC
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No data available"})

    df["time_index"] = range(len(df))
    X = df[["time_index"]]
    y = df["amount"]

    model = LinearRegression()
    model.fit(X, y)

    future_X = np.array([len(df)+i for i in range(1, 4)]).reshape(-1, 1)
    predictions = model.predict(future_X)

    return jsonify({
        "linearRegressionForecast": predictions.tolist()
    })

# -------------------------------
# Expense Anomalies (Isolation Forest)
# -------------------------------
@app.route("/ml/anomalies/expenses")
def ml_anomalies_expenses():
    query = '''
        SELECT amount
        FROM "FactExpenses"
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No expense data available"})

    model = IsolationForest(contamination=0.1, random_state=42)
    preds = model.fit_predict(df[["amount"]])

    df["anomaly"] = preds
    anomalies = df[df["anomaly"] == -1]

    return jsonify({
        "anomalies": anomalies.to_dict(orient="records")
    })

# -------------------------------
# Forecast Revenue (ARIMA)
# -------------------------------
@app.route("/ml/arima/revenue")
def ml_arima_revenue():
    query = '''
        SELECT amount
        FROM "FactRevenues"
        ORDER BY time_id ASC
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No data available"})

    series = df["amount"]
    model = ARIMA(series, order=(1, 1, 1))
    model_fit = model.fit()

    forecast = model_fit.forecast(steps=3)

    return jsonify({
        "arimaForecast": forecast.tolist()
    })

# -------------------------------
# Power BI Revenue Forecast
# -------------------------------
@app.route("/ml/powerbi/revenue-forecast")
def powerbi_revenue_forecast():
    query = '''
        SELECT
            dt.time_id,
            dt.date,
            dt.month,
            dt.month_name,
            dt.year,
            SUM(fr.amount) AS amount
        FROM "FactRevenues" fr
        JOIN "DimTimes" dt ON dt.time_id = fr.time_id
        GROUP BY dt.time_id, dt.date, dt.month, dt.month_name, dt.year
        ORDER BY dt.date ASC
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No revenue data available", "data": []})

    df["time_index"] = range(len(df))
    X = df[["time_index"]]
    y = df["amount"]

    regression_model = LinearRegression()
    regression_model.fit(X, y)

    future_indexes = np.array([len(df) + i for i in range(1, 4)]).reshape(-1, 1)
    regression_forecast = regression_model.predict(future_indexes)

    arima_model = ARIMA(y, order=(1, 1, 1))
    arima_fit = arima_model.fit()
    arima_forecast = arima_fit.forecast(steps=3).tolist()

    rows = []

    for _, row in df.iterrows():
        rows.append({
            "periodType": "Actual",
            "monthDate": pd.Timestamp(row["date"]).strftime("%Y-%m-%d"),
            "monthLabel": f'{row["month_name"]} {int(row["year"])}',
            "actualRevenue": round(float(row["amount"]), 2),
            "linearRegressionForecast": None,
            "arimaForecast": None,
        })

    for i, month_date in enumerate(_next_months(df["date"].max(), 3)):
        rows.append({
            "periodType": "Forecast",
            "monthDate": month_date.strftime("%Y-%m-%d"),
            "monthLabel": month_date.strftime("%B %Y"),
            "actualRevenue": None,
            "linearRegressionForecast": round(float(regression_forecast[i]), 2),
            "arimaForecast": round(float(arima_forecast[i]), 2),
        })

    return jsonify({
        "data": rows,
        "summary": {
            "actualMonths": len(df),
            "forecastMonths": 3,
            "lastActualRevenue": round(float(df["amount"].iloc[-1]), 2),
            "nextLinearRegressionForecast": round(float(regression_forecast[0]), 2),
            "nextArimaForecast": round(float(arima_forecast[0]), 2),
        }
    })

# -------------------------------
# Power BI Expense Anomalies
# -------------------------------
@app.route("/ml/powerbi/expense-anomalies")
def powerbi_expense_anomalies():
    query = '''
        SELECT
            fe.id AS expense_id,
            fe.amount,
            fe.project_id,
            fe.category_id,
            fe.fournisseur_id,
            dt.date,
            dt.month,
            dt.month_name,
            dt.year,
            dp.name AS project,
            dc.name AS category,
            df.name AS fournisseur
        FROM "FactExpenses" fe
        JOIN "DimTimes" dt ON dt.time_id = fe.time_id
        LEFT JOIN "DimProjects" dp ON dp.project_id = fe.project_id
        LEFT JOIN "DimCategories" dc ON dc.category_id = fe.category_id
        LEFT JOIN "DimFournisseurs" df ON df.fournisseur_id = fe.fournisseur_id
        ORDER BY dt.date ASC
    '''
    df = pd.read_sql(query, engine)

    if df.empty:
        return jsonify({"message": "No expense data available", "data": []})

    model = IsolationForest(contamination=0.1, random_state=42)
    df["anomalyScore"] = model.fit_predict(df[["amount"]])
    df["isAnomaly"] = df["anomalyScore"] == -1

    anomalies = df[df["isAnomaly"]].copy()
    average_expense = df["amount"].mean()
    std_deviation = df["amount"].std()

    rows = []
    for _, row in anomalies.iterrows():
        rows.append({
            "expenseId": int(row["expense_id"]),
            "monthDate": pd.Timestamp(row["date"]).strftime("%Y-%m-%d"),
            "monthLabel": f'{row["month_name"]} {int(row["year"])}',
            "month": int(row["month"]),
            "year": int(row["year"]),
            "amount": round(float(row["amount"]), 2),
            "projectId": int(row["project_id"]) if pd.notna(row["project_id"]) else None,
            "project": row["project"],
            "category": row["category"],
            "fournisseur": row["fournisseur"],
            "isAnomaly": True,
            "anomalyMethod": "Isolation Forest",
        })

    return jsonify({
        "data": rows,
        "summary": {
            "expenseCount": len(df),
            "anomalyCount": len(rows),
            "averageExpense": round(float(average_expense), 2),
            "stdDeviation": round(float(std_deviation), 2),
        }
    })

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
