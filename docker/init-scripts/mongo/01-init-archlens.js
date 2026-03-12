// ArchLens - MongoDB Initialization Script
// Runs on first container start via /docker-entrypoint-initdb.d

// Switch to the archlens_reports database
db = db.getSiblingDB('archlens_reports');

// Create collections with schema validation hints
db.createCollection('analysis_reports', {
    validator: {
        $jsonSchema: {
            bsonType: 'object',
            required: ['_id', 'UserId', 'DiagramUploadId', 'CreatedAt'],
            properties: {
                UserId:         { bsonType: 'string' },
                DiagramUploadId:{ bsonType: 'string' },
                Status:         { bsonType: 'string' },
                CreatedAt:      { bsonType: 'date' }
            }
        }
    },
    validationAction: 'warn'
});

db.createCollection('report_documents');

// Indexes for analysis_reports
db.analysis_reports.createIndex({ UserId: 1 }, { name: 'idx_userId' });
db.analysis_reports.createIndex({ DiagramUploadId: 1 }, { name: 'idx_diagramUploadId' });
db.analysis_reports.createIndex({ CreatedAt: -1 }, { name: 'idx_createdAt_desc' });
db.analysis_reports.createIndex({ Status: 1, CreatedAt: -1 }, { name: 'idx_status_createdAt' });

// Indexes for report_documents
db.report_documents.createIndex({ ReportId: 1 }, { name: 'idx_reportId' });
db.report_documents.createIndex({ UserId: 1 }, { name: 'idx_userId' });

print('ArchLens MongoDB initialized: archlens_reports database, collections and indexes created.');
