BEGIN;

-- Deterministic ML demo data for the Python service.
-- It replaces only the analytical fact rows used by:
--   /forecast/revenue
--   /anomalies/expenses
--   /ml/forecast/revenue
--   /ml/anomalies/expenses
--   /ml/arima/revenue

TRUNCATE TABLE "FactRevenues", "FactExpenses" RESTART IDENTITY;

DELETE FROM "DimTimes"
WHERE "time_id" BETWEEN 900001 AND 900024;

INSERT INTO "DimTimes" (
  "time_id",
  "date",
  "day",
  "month",
  "month_name",
  "quarter",
  "year",
  "fiscal_year",
  "fiscal_quarter",
  "is_weekend",
  "createdAt",
  "updatedAt"
)
VALUES
  (900001, '2024-01-01', 1, 1, 'January', 1, 2024, 2024, 1, FALSE, NOW(), NOW()),
  (900002, '2024-02-01', 1, 2, 'February', 1, 2024, 2024, 1, FALSE, NOW(), NOW()),
  (900003, '2024-03-01', 1, 3, 'March', 1, 2024, 2024, 1, FALSE, NOW(), NOW()),
  (900004, '2024-04-01', 1, 4, 'April', 2, 2024, 2024, 2, FALSE, NOW(), NOW()),
  (900005, '2024-05-01', 1, 5, 'May', 2, 2024, 2024, 2, FALSE, NOW(), NOW()),
  (900006, '2024-06-01', 1, 6, 'June', 2, 2024, 2024, 2, TRUE, NOW(), NOW()),
  (900007, '2024-07-01', 1, 7, 'July', 3, 2024, 2024, 3, FALSE, NOW(), NOW()),
  (900008, '2024-08-01', 1, 8, 'August', 3, 2024, 2024, 3, FALSE, NOW(), NOW()),
  (900009, '2024-09-01', 1, 9, 'September', 3, 2024, 2024, 3, TRUE, NOW(), NOW()),
  (900010, '2024-10-01', 1, 10, 'October', 4, 2024, 2024, 4, FALSE, NOW(), NOW()),
  (900011, '2024-11-01', 1, 11, 'November', 4, 2024, 2024, 4, FALSE, NOW(), NOW()),
  (900012, '2024-12-01', 1, 12, 'December', 4, 2024, 2024, 4, TRUE, NOW(), NOW()),
  (900013, '2025-01-01', 1, 1, 'January', 1, 2025, 2025, 1, FALSE, NOW(), NOW()),
  (900014, '2025-02-01', 1, 2, 'February', 1, 2025, 2025, 1, TRUE, NOW(), NOW()),
  (900015, '2025-03-01', 1, 3, 'March', 1, 2025, 2025, 1, TRUE, NOW(), NOW()),
  (900016, '2025-04-01', 1, 4, 'April', 2, 2025, 2025, 2, FALSE, NOW(), NOW()),
  (900017, '2025-05-01', 1, 5, 'May', 2, 2025, 2025, 2, FALSE, NOW(), NOW()),
  (900018, '2025-06-01', 1, 6, 'June', 2, 2025, 2025, 2, TRUE, NOW(), NOW()),
  (900019, '2025-07-01', 1, 7, 'July', 3, 2025, 2025, 3, FALSE, NOW(), NOW()),
  (900020, '2025-08-01', 1, 8, 'August', 3, 2025, 2025, 3, FALSE, NOW(), NOW()),
  (900021, '2025-09-01', 1, 9, 'September', 3, 2025, 2025, 3, FALSE, NOW(), NOW()),
  (900022, '2025-10-01', 1, 10, 'October', 4, 2025, 2025, 4, FALSE, NOW(), NOW()),
  (900023, '2025-11-01', 1, 11, 'November', 4, 2025, 2025, 4, TRUE, NOW(), NOW()),
  (900024, '2025-12-01', 1, 12, 'December', 4, 2025, 2025, 4, FALSE, NOW(), NOW());

INSERT INTO "FactRevenues" (
  "time_id",
  "client_id",
  "project_id",
  "amount",
  "payment_status",
  "createdAt",
  "updatedAt"
)
VALUES
  (900001, 1, 1, 8200, 'Paid', NOW(), NOW()),
  (900002, 1, 1, 8600, 'Paid', NOW(), NOW()),
  (900003, 2, 2, 9100, 'Paid', NOW(), NOW()),
  (900004, 2, 2, 9550, 'Paid', NOW(), NOW()),
  (900005, 3, 3, 10100, 'Paid', NOW(), NOW()),
  (900006, 3, 3, 9900, 'Paid', NOW(), NOW()),
  (900007, 4, 4, 10850, 'Paid', NOW(), NOW()),
  (900008, 4, 4, 11200, 'Paid', NOW(), NOW()),
  (900009, 5, 5, 11750, 'Paid', NOW(), NOW()),
  (900010, 5, 5, 12400, 'Paid', NOW(), NOW()),
  (900011, 6, 6, 12950, 'Paid', NOW(), NOW()),
  (900012, 6, 6, 14100, 'Paid', NOW(), NOW()),
  (900013, 7, 7, 13600, 'Paid', NOW(), NOW()),
  (900014, 7, 7, 14350, 'Paid', NOW(), NOW()),
  (900015, 8, 8, 15100, 'Paid', NOW(), NOW()),
  (900016, 8, 8, 15800, 'Paid', NOW(), NOW()),
  (900017, 9, 9, 16650, 'Paid', NOW(), NOW()),
  (900018, 9, 9, 16100, 'Paid', NOW(), NOW()),
  (900019, 10, 10, 17400, 'Paid', NOW(), NOW()),
  (900020, 10, 10, 18150, 'Paid', NOW(), NOW()),
  (900021, 11, 11, 18900, 'Paid', NOW(), NOW()),
  (900022, 11, 11, 19750, 'Paid', NOW(), NOW()),
  (900023, 12, 12, 20500, 'Paid', NOW(), NOW()),
  (900024, 12, 12, 22100, 'Paid', NOW(), NOW());

INSERT INTO "FactExpenses" (
  "time_id",
  "project_id",
  "category_id",
  "fournisseur_id",
  "amount",
  "createdAt",
  "updatedAt"
)
VALUES
  (900001, 1, 1, 1, 2300, NOW(), NOW()),
  (900002, 1, 2, 1, 2450, NOW(), NOW()),
  (900003, 2, 3, 2, 2600, NOW(), NOW()),
  (900004, 2, 1, 2, 2550, NOW(), NOW()),
  (900005, 3, 2, 3, 2750, NOW(), NOW()),
  (900006, 3, 3, 3, 2900, NOW(), NOW()),
  (900007, 4, 1, 4, 12000, NOW(), NOW()),
  (900008, 4, 2, 4, 3100, NOW(), NOW()),
  (900009, 5, 3, 5, 2950, NOW(), NOW()),
  (900010, 5, 1, 5, 3300, NOW(), NOW()),
  (900011, 6, 2, 6, 3450, NOW(), NOW()),
  (900012, 6, 3, 6, 3600, NOW(), NOW()),
  (900013, 7, 1, 7, 3400, NOW(), NOW()),
  (900014, 7, 2, 7, 3650, NOW(), NOW()),
  (900015, 8, 3, 8, 3800, NOW(), NOW()),
  (900016, 8, 1, 8, 15000, NOW(), NOW()),
  (900017, 9, 2, 9, 4100, NOW(), NOW()),
  (900018, 9, 3, 9, 3950, NOW(), NOW()),
  (900019, 10, 1, 10, 4300, NOW(), NOW()),
  (900020, 10, 2, 10, 4550, NOW(), NOW()),
  (900021, 11, 3, 11, 4700, NOW(), NOW()),
  (900022, 11, 1, 11, 4900, NOW(), NOW()),
  (900023, 12, 2, 12, 5100, NOW(), NOW()),
  (900024, 12, 3, 12, 5400, NOW(), NOW());

COMMIT;
