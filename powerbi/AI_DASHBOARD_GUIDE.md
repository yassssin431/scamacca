# Tradrly Power BI AI Dashboard Guide

## Recommended Architecture

Use both data sources:

1. PostgreSQL for the analytical model:
   - `FactRevenues`
   - `FactExpenses`
   - `FactSalaries`
   - `DimTimes`
   - `DimProjects`
   - `DimClients`

2. Backend API for AI results:
   - `http://localhost:7777/api/ai/powerbi/forecast`
   - `http://localhost:7777/api/ai/powerbi/anomalies`

This lets the jury see normal BI plus AI exposed through the backend.

## Power BI Tables

Load from PostgreSQL:

- `FactRevenues`
- `FactExpenses`
- `FactSalaries`
- `DimTimes`
- `DimProjects`
- `DimClients`

Load from Web/API:

- `AI Forecast`
- `AI Anomalies`

## Relationships

Create these relationships:

- `FactRevenues[time_id]` -> `DimTimes[time_id]`
- `FactExpenses[time_id]` -> `DimTimes[time_id]`
- `FactSalaries[time_id]` -> `DimTimes[time_id]`
- `FactRevenues[project_id]` -> `DimProjects[project_id]`
- `FactExpenses[project_id]` -> `DimProjects[project_id]`

For the API tables, keep them independent unless Power BI detects a clean date relationship. You can sort `AI Forecast[monthLabel]` by `AI Forecast[monthDate]`.

## Page Layout

Page title:

`AI Decision Support Dashboard`

Top KPI cards:

- Total Revenue
- Total Expenses
- Profit
- Predicted Next Revenue
- Anomaly Count

Main visuals:

- Line chart: `AI Forecast[monthDate]` on axis, with `actualRevenue`, `linearRegressionForecast`, and `arimaForecast` as values.
- Table: `AI Anomalies` with month, project, category, amount, and anomaly method.
- Bar chart: expenses by project/category.
- What-If panel: revenue growth slider, expense growth slider, adjusted profit card.

## Jury Speech

Use this wording:

> Notre module AI ne lit pas directement les donnees operationnelles. Les donnees passent d'abord par un modele analytique PostgreSQL avec des tables de faits et dimensions. Ensuite, le microservice AI calcule les previsions et anomalies. Les resultats sont exposes via API et integres dans Power BI pour aider les managers a prendre des decisions.

For Day 5:

> Nous avons ajoute une simulation What-If. Les decideurs peuvent modifier les revenus ou les depenses avec des sliders et voir immediatement l'impact sur le profit. Le dashboard devient donc descriptif, predictif et prescriptif.
