# Power BI DAX Measures

Create these measures in Power BI Desktop.

```DAX
Total Revenue =
SUM ( FactRevenues[amount] )
```

```DAX
Total Expenses =
SUM ( FactExpenses[amount] )
```

```DAX
Total Salaries =
SUM ( FactSalaries[amount_paid] )
```

```DAX
Profit =
[Total Revenue] - [Total Expenses] - [Total Salaries]
```

```DAX
Profit Margin % =
DIVIDE ( [Profit], [Total Revenue] )
```

```DAX
Predicted Next Revenue =
CALCULATE (
    MAX ( 'AI Forecast'[linearRegressionForecast] ),
    'AI Forecast'[periodType] = "Forecast"
)
```

```DAX
ARIMA Next Revenue =
CALCULATE (
    MAX ( 'AI Forecast'[arimaForecast] ),
    'AI Forecast'[periodType] = "Forecast"
)
```

```DAX
Anomaly Count =
COUNTROWS ( 'AI Anomalies' )
```

```DAX
Average Anomaly Amount =
AVERAGE ( 'AI Anomalies'[amount] )
```

## Day 5 What-If Simulation

Create two Power BI What-If parameters:

- `Revenue Growth %`: minimum `-0.10`, maximum `0.30`, increment `0.01`, default `0`
- `Expense Growth %`: minimum `-0.20`, maximum `0.20`, increment `0.01`, default `0`

Power BI usually creates selected-value measures automatically. If not, add:

```DAX
Revenue Growth % Value =
SELECTEDVALUE ( 'Revenue Growth %'[Revenue Growth %], 0 )
```

```DAX
Expense Growth % Value =
SELECTEDVALUE ( 'Expense Growth %'[Expense Growth %], 0 )
```

Then add:

```DAX
Adjusted Revenue =
[Total Revenue] * ( 1 + [Revenue Growth % Value] )
```

```DAX
Adjusted Expenses =
[Total Expenses] * ( 1 + [Expense Growth % Value] )
```

```DAX
Adjusted Profit =
[Adjusted Revenue] - [Adjusted Expenses] - [Total Salaries]
```

```DAX
Profit Impact =
[Adjusted Profit] - [Profit]
```

```DAX
Profit Impact % =
DIVIDE ( [Profit Impact], [Profit] )
```

```DAX
Scenario Label =
"Revenue "
    & FORMAT ( [Revenue Growth % Value], "+0%;-0%;0%" )
    & " | Expenses "
    & FORMAT ( [Expense Growth % Value], "+0%;-0%;0%" )
```
