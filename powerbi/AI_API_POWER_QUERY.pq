// Create a Power BI text parameter named ApiToken first.
// Put the JWT token from login in that parameter, without the word Bearer.

let
    BaseUrl = "http://localhost:7777",
    Token = ApiToken,

    GetApiTable = (RelativePath as text) as table =>
        let
            Source = Json.Document(
                Web.Contents(
                    BaseUrl,
                    [
                        RelativePath = RelativePath,
                        Headers = [
                            Authorization = "Bearer " & Token,
                            Accept = "application/json"
                        ]
                    ]
                )
            ),
            Data = Source[data],
            TableData = Table.FromRecords(Data)
        in
            TableData
in
    GetApiTable
