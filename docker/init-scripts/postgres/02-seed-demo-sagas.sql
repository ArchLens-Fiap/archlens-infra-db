-- ArchLens - Demo Saga States Seed Script
-- Matches the 3 demo reports seeded in MongoDB (02-seed-demo-reports.js)
-- so that Analyses and Compare pages show consistent data.

\c archlens_orchestrator;

-- Ensure saga_states table exists (EF Core creates it on first run,
-- but we need it here for the seed to work on fresh installs)
CREATE TABLE IF NOT EXISTS saga_states (
    "CorrelationId"   UUID PRIMARY KEY,
    "CurrentState"    VARCHAR(64) NOT NULL,
    "AnalysisId"      UUID NOT NULL,
    "DiagramId"       UUID NOT NULL,
    "FileName"        VARCHAR(255),
    "FileHash"        VARCHAR(64),
    "StoragePath"     VARCHAR(500),
    "UserId"          VARCHAR(128),
    "RetryCount"      INTEGER NOT NULL DEFAULT 0,
    "ErrorMessage"    VARCHAR(2000),
    "ResultJson"      TEXT,
    "ReportId"        UUID,
    "ProcessingTimeMs" BIGINT,
    "RowVersion"      BYTEA,
    "CreatedAt"       TIMESTAMP NOT NULL,
    "UpdatedAt"       TIMESTAMP NOT NULL
);

-- Report 1: Microservices Architecture (1 hour ago)
INSERT INTO saga_states (
    "CorrelationId", "CurrentState", "AnalysisId", "DiagramId",
    "FileName", "FileHash", "StoragePath", "UserId",
    "RetryCount", "ReportId", "ProcessingTimeMs", "CreatedAt", "UpdatedAt"
) VALUES (
    'c0000001-0000-0000-0000-000000000001', 'Completed',
    'a0000001-0000-0000-0000-000000000001', 'd0000001-0000-0000-0000-000000000001',
    'microservices-architecture.png', 'abc123def456', '2026/03/14/demo/microservices-architecture.png', NULL,
    0, '3fa85f64-5717-4562-b3fc-2c963f66afa6', 4320,
    NOW() - INTERVAL '1 hour', NOW() - INTERVAL '1 hour'
) ON CONFLICT ("CorrelationId") DO NOTHING;

-- Report 2: Legacy Monolith (3 days ago)
INSERT INTO saga_states (
    "CorrelationId", "CurrentState", "AnalysisId", "DiagramId",
    "FileName", "FileHash", "StoragePath", "UserId",
    "RetryCount", "ReportId", "ProcessingTimeMs", "CreatedAt", "UpdatedAt"
) VALUES (
    'c0000002-0000-0000-0000-000000000002', 'Completed',
    'a0000002-0000-0000-0000-000000000002', 'd0000002-0000-0000-0000-000000000002',
    'legacy-monolith.png', 'def456ghi789', '2026/03/11/demo/legacy-monolith.png', NULL,
    0, '3fa85f64-5717-4562-b3fc-2c963f66afa7', 2150,
    NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'
) ON CONFLICT ("CorrelationId") DO NOTHING;

-- Report 3: Event-Driven Architecture (1 week ago)
INSERT INTO saga_states (
    "CorrelationId", "CurrentState", "AnalysisId", "DiagramId",
    "FileName", "FileHash", "StoragePath", "UserId",
    "RetryCount", "ReportId", "ProcessingTimeMs", "CreatedAt", "UpdatedAt"
) VALUES (
    'c0000003-0000-0000-0000-000000000003', 'Completed',
    'a0000003-0000-0000-0000-000000000003', 'd0000003-0000-0000-0000-000000000003',
    'event-driven-architecture.pdf', 'ghi789jkl012', '2026/03/07/demo/event-driven-architecture.pdf', NULL,
    0, '3fa85f64-5717-4562-b3fc-2c963f66afa8', 5870,
    NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
) ON CONFLICT ("CorrelationId") DO NOTHING;
