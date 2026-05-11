// Paste this into Power Query Advanced Editor for a query named AI Forecast.
// Requires a text parameter named ApiToken.

let
    BaseUrl = "http://localhost:7777",
    Source = Json.Document(
        Web.Contents(
            BaseUrl,
            [
                RelativePath = "api/ai/powerbi/forecast",
                Headers = [
                    Authorization = "Bearer " & ApiToken,
                    Accept = "application/json"
                ]
            ]
        )
    ),
    Data = Source[data],
    Rows = Table.FromRecords(Data),
    Typed = Table.TransformColumnTypes(
        Rows,
        {
            {"periodType", type text},
            {"monthDate", type date},
            {"monthLabel", type text},
            {"actualRevenue", type number},
            {"linearRegressionForecast", type number},
            {"arimaForecast", type number}
        }
    )
in
    Typed
