// Paste this into Power Query Advanced Editor for a query named AI Anomalies.
// Requires a text parameter named ApiToken.

let
    BaseUrl = "http://localhost:7777",
    Source = Json.Document(
        Web.Contents(
            BaseUrl,
            [
                RelativePath = "api/ai/powerbi/anomalies",
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
            {"expenseId", Int64.Type},
            {"monthDate", type date},
            {"monthLabel", type text},
            {"month", Int64.Type},
            {"year", Int64.Type},
            {"amount", type number},
            {"projectId", Int64.Type},
            {"project", type text},
            {"category", type text},
            {"fournisseur", type text},
            {"isAnomaly", type logical},
            {"anomalyMethod", type text}
        }
    )
in
    Typed
