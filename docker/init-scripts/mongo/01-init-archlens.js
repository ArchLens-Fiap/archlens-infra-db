// ArchLens - MongoDB Initialization Script
// Runs on first container start via /docker-entrypoint-initdb.d

// Switch to the archlens_reports database
db = db.getSiblingDB('archlens_reports');

// Create the reports collection (used by ArchLens.Report.Infrastructure)
db.createCollection('reports');

// Indexes for reports
db.reports.createIndex({ UserId: 1 }, { name: 'idx_userId' });
db.reports.createIndex({ AnalysisId: 1 }, { name: 'idx_analysisId', unique: true });
db.reports.createIndex({ DiagramId: 1 }, { name: 'idx_diagramId' });
db.reports.createIndex({ CreatedAt: -1 }, { name: 'idx_createdAt_desc' });

print('ArchLens MongoDB initialized: archlens_reports database and reports collection created.');
