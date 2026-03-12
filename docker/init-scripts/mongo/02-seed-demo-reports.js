// ArchLens - Demo Reports Seed Script
// Runs on first container start, after 01-init-archlens.js
// Inserts 3 pre-built analysis reports so evaluators see data immediately
// without needing an OpenAI key or uploading a diagram manually.

db = db.getSiblingDB('archlens_reports');

var now = new Date();
var oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
var threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
var oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

db.reports.insertMany([
  // ─── Report 1: Microservices Architecture ─────────────────────────────────
  {
    _id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    AnalysisId:  "a0000001-0000-0000-0000-000000000001",
    DiagramId:   "d0000001-0000-0000-0000-000000000001",
    UserId: null,
    Components: [
      { Name: "API Gateway",       Type: "Gateway",    Description: "Entry point for all external requests. Routes traffic to downstream microservices.", Confidence: 0.97 },
      { Name: "Auth Service",      Type: "Service",    Description: "Handles authentication and authorization via JWT tokens.", Confidence: 0.95 },
      { Name: "Product Service",   Type: "Service",    Description: "Manages product catalog, inventory levels, and pricing.", Confidence: 0.93 },
      { Name: "Order Service",     Type: "Service",    Description: "Processes customer orders and coordinates with payment and inventory.", Confidence: 0.92 },
      { Name: "Notification Service", Type: "Service", Description: "Sends email and push notifications to users asynchronously.", Confidence: 0.90 },
      { Name: "PostgreSQL (Auth)", Type: "Database",   Description: "Relational database storing user credentials and roles.", Confidence: 0.98 },
      { Name: "PostgreSQL (Orders)", Type: "Database", Description: "Relational database for order persistence and history.", Confidence: 0.97 },
      { Name: "RabbitMQ",          Type: "MessageBroker", Description: "Message broker enabling async communication between services.", Confidence: 0.96 },
      { Name: "Redis",             Type: "Cache",      Description: "In-memory cache for session tokens and rate limiting.", Confidence: 0.94 }
    ],
    Connections: [
      { Source: "API Gateway",     Target: "Auth Service",      Type: "HTTP/REST",  Description: "Validates JWT tokens before forwarding requests." },
      { Source: "API Gateway",     Target: "Product Service",   Type: "HTTP/REST",  Description: "Forwards product catalog queries." },
      { Source: "API Gateway",     Target: "Order Service",     Type: "HTTP/REST",  Description: "Forwards order creation and status requests." },
      { Source: "Auth Service",    Target: "PostgreSQL (Auth)", Type: "TCP",        Description: "Reads and writes user account data." },
      { Source: "Auth Service",    Target: "Redis",             Type: "TCP",        Description: "Caches session tokens for fast validation." },
      { Source: "Order Service",   Target: "PostgreSQL (Orders)", Type: "TCP",      Description: "Persists order state and history." },
      { Source: "Order Service",   Target: "RabbitMQ",          Type: "AMQP",       Description: "Publishes OrderCreated events for downstream consumers." },
      { Source: "Notification Service", Target: "RabbitMQ",    Type: "AMQP",       Description: "Subscribes to domain events to send user notifications." }
    ],
    Risks: [
      { Title: "API Gateway Single Point of Failure", Description: "All traffic routes through a single API Gateway instance. A crash brings down the entire system.", Severity: "High",   Category: "Reliability",     Mitigation: "Deploy multiple Gateway instances behind a load balancer. Use health checks and automatic failover." },
      { Title: "Missing Circuit Breaker",             Description: "No circuit breaker pattern detected between services, risking cascading failures.", Severity: "Medium", Category: "Resilience",      Mitigation: "Implement Polly circuit breakers on all inter-service HTTP calls." },
      { Title: "Unencrypted Internal Traffic",        Description: "Internal service-to-service communication uses plain HTTP, exposing sensitive data on the network.", Severity: "Medium", Category: "Security",        Mitigation: "Enable mTLS for internal traffic or use a service mesh (Istio, Linkerd)." },
      { Title: "Missing Distributed Tracing",         Description: "No distributed tracing detected. Debugging failures across services will be very difficult.", Severity: "Low",    Category: "Observability",   Mitigation: "Integrate OpenTelemetry with a tracing backend such as Jaeger or Zipkin." }
    ],
    Recommendations: [
      "Add circuit breaker patterns (e.g., Polly) on all synchronous inter-service calls to prevent cascading failures.",
      "Deploy at least 2 API Gateway replicas behind a load balancer to eliminate the current single point of failure.",
      "Enable mTLS between internal services or adopt a service mesh for zero-trust network security.",
      "Integrate OpenTelemetry + Jaeger for distributed tracing — essential for debugging distributed transactions.",
      "Consider adding a CQRS read model for the Product Service to improve query performance under load.",
      "Document service contracts (OpenAPI specs) and publish them to a shared registry."
    ],
    Scores: { Scalability: 8.5, Security: 7.0, Reliability: 7.5, Maintainability: 8.0 },
    OverallScore: 7.75,
    Confidence: 0.93,
    ProvidersUsed: ["demo-seed"],
    ProcessingTimeMs: 4320,
    CreatedAt: oneHourAgo
  },

  // ─── Report 2: Legacy Monolith ────────────────────────────────────────────
  {
    _id: "3fa85f64-5717-4562-b3fc-2c963f66afa7",
    AnalysisId:  "a0000002-0000-0000-0000-000000000002",
    DiagramId:   "d0000002-0000-0000-0000-000000000002",
    UserId: null,
    Components: [
      { Name: "Nginx Web Server",      Type: "WebServer",  Description: "Reverse proxy and static file server. Entry point for browser requests.", Confidence: 0.96 },
      { Name: "Monolith Application",  Type: "Application", Description: "Single deployable unit containing all business logic: authentication, orders, reporting.", Confidence: 0.98 },
      { Name: "PostgreSQL Database",   Type: "Database",   Description: "Single relational database shared by all modules of the monolith.", Confidence: 0.99 },
      { Name: "File System Storage",   Type: "Storage",    Description: "Local disk storage for user-uploaded files and generated reports.", Confidence: 0.91 },
      { Name: "Cron Job Scheduler",    Type: "Scheduler",  Description: "Scheduled tasks for nightly batch processing and report generation.", Confidence: 0.88 }
    ],
    Connections: [
      { Source: "Nginx Web Server",     Target: "Monolith Application", Type: "HTTP",    Description: "Proxies all dynamic requests to the application server." },
      { Source: "Monolith Application", Target: "PostgreSQL Database",  Type: "TCP",     Description: "Direct database connection pool. All queries are synchronous." },
      { Source: "Monolith Application", Target: "File System Storage",  Type: "POSIX I/O", Description: "Reads and writes user files directly to local disk." },
      { Source: "Cron Job Scheduler",   Target: "Monolith Application", Type: "Internal", Description: "Triggers internal batch methods on a fixed schedule." }
    ],
    Risks: [
      { Title: "Scalability Bottleneck",        Description: "The monolith cannot be scaled horizontally without running multiple full copies, wasting resources.", Severity: "High",   Category: "Scalability",   Mitigation: "Identify high-load modules (e.g., reporting) and extract them as independent services." },
      { Title: "Single Database for All Modules", Description: "All business domains share one database schema, creating tight coupling and migration risk.", Severity: "High",   Category: "Maintainability", Mitigation: "Introduce schema separation per domain or plan a gradual database decomposition." },
      { Title: "Local File System Storage",     Description: "Storing files on local disk prevents horizontal scaling and creates data loss risk on container restart.", Severity: "High",   Category: "Reliability",   Mitigation: "Migrate file storage to object storage (MinIO, AWS S3) with replication." },
      { Title: "No Queue for Background Jobs",  Description: "Batch jobs run in-process via cron, competing for CPU and memory with web requests.", Severity: "Medium", Category: "Performance",   Mitigation: "Extract batch workloads to a job queue (e.g., Hangfire, RabbitMQ workers)." },
      { Title: "Low Test Isolation",            Description: "Tight coupling in the monolith makes unit testing difficult — changes risk breaking unrelated features.", Severity: "Medium", Category: "Maintainability", Mitigation: "Introduce domain boundaries, dependency injection, and modular testing." }
    ],
    Recommendations: [
      "Migrate local file storage to MinIO or a cloud object storage service immediately — this is a data loss risk.",
      "Apply the Strangler Fig pattern: start extracting the highest-load modules (reporting, auth) into independent services.",
      "Introduce schema-per-domain separation in PostgreSQL as a first step toward a future microservices split.",
      "Replace cron-based batch jobs with a dedicated job queue to isolate background processing from web traffic.",
      "Add an application-level cache (Redis) for frequently read data to reduce database load in the meantime.",
      "Establish strong module boundaries within the monolith and enforce them via architecture tests (ArchUnitNET)."
    ],
    Scores: { Scalability: 3.5, Security: 6.0, Reliability: 4.5, Maintainability: 5.5 },
    OverallScore: 4.875,
    Confidence: 0.95,
    ProvidersUsed: ["demo-seed"],
    ProcessingTimeMs: 2150,
    CreatedAt: threeDaysAgo
  },

  // ─── Report 3: Event-Driven Architecture ──────────────────────────────────
  {
    _id: "3fa85f64-5717-4562-b3fc-2c963f66afa8",
    AnalysisId:  "a0000003-0000-0000-0000-000000000003",
    DiagramId:   "d0000003-0000-0000-0000-000000000003",
    UserId: null,
    Components: [
      { Name: "Event Producers",       Type: "ServiceGroup", Description: "Multiple microservices that emit domain events to the message bus (Order, Payment, Inventory).", Confidence: 0.92 },
      { Name: "Apache Kafka",          Type: "MessageBroker", Description: "Distributed commit log used as the central event bus. Retains messages for 7 days.", Confidence: 0.96 },
      { Name: "Event Consumers",       Type: "ServiceGroup", Description: "Analytics and notification services that subscribe to topics and process events.", Confidence: 0.91 },
      { Name: "Schema Registry",       Type: "Infrastructure", Description: "Centralized Avro schema registry ensuring event contract compatibility.", Confidence: 0.89 },
      { Name: "Analytics Service",     Type: "Service",      Description: "Builds real-time aggregations from event streams for business dashboards.", Confidence: 0.93 },
      { Name: "Audit Log Service",     Type: "Service",      Description: "Persistent, immutable log of all business events for compliance.", Confidence: 0.95 },
      { Name: "ClickHouse",            Type: "Database",     Description: "Columnar database used by the Analytics Service for high-speed OLAP queries.", Confidence: 0.90 },
      { Name: "MongoDB",               Type: "Database",     Description: "Document store for the Audit Log, storing full event payloads.", Confidence: 0.94 }
    ],
    Connections: [
      { Source: "Event Producers",  Target: "Apache Kafka",       Type: "AMQP/Kafka", Description: "Publishes domain events to topic partitions." },
      { Source: "Apache Kafka",     Target: "Schema Registry",    Type: "HTTP",        Description: "Validates message schemas on publish and consume." },
      { Source: "Apache Kafka",     Target: "Analytics Service",  Type: "AMQP/Kafka", Description: "Analytics Service consumes events for real-time aggregation." },
      { Source: "Apache Kafka",     Target: "Audit Log Service",  Type: "AMQP/Kafka", Description: "Audit Service persists all events for compliance log." },
      { Source: "Analytics Service", Target: "ClickHouse",        Type: "TCP",         Description: "Writes aggregated metrics for OLAP queries." },
      { Source: "Audit Log Service", Target: "MongoDB",           Type: "TCP",         Description: "Writes full event payloads as immutable documents." }
    ],
    Risks: [
      { Title: "Eventual Consistency Complexity",  Description: "Event-driven systems are eventually consistent. Developers must handle out-of-order events, duplicates, and compensating transactions.", Severity: "Medium", Category: "Complexity",     Mitigation: "Implement idempotent consumers and use Kafka exactly-once semantics where order matters." },
      { Title: "Schema Evolution Risk",            Description: "Breaking changes to event schemas can crash downstream consumers silently if schema compatibility is not enforced.", Severity: "High",   Category: "Reliability",    Mitigation: "Enforce backward-compatible Avro schemas via Schema Registry. Use API versioning for events." },
      { Title: "Kafka Operational Overhead",       Description: "Apache Kafka requires careful monitoring, partition rebalancing, and capacity planning. Misconfiguration causes message lag.", Severity: "Medium", Category: "Operations",     Mitigation: "Use a managed Kafka offering (Confluent Cloud, MSK) or invest in a dedicated Kafka operations runbook." },
      { Title: "No Dead Letter Queue Monitoring",  Description: "Failed messages may silently pile up in DLQs without alerting, causing data loss without visibility.", Severity: "Medium", Category: "Observability",  Mitigation: "Set up alerts on DLQ depth. Implement a DLQ replay mechanism for operational recovery." }
    ],
    Recommendations: [
      "Enforce schema backward compatibility in the Schema Registry and use consumer compatibility checks in CI/CD pipelines.",
      "Implement idempotency keys in all consumers to safely handle message redelivery and duplicate events.",
      "Set up monitoring and alerting on Kafka consumer group lag (Prometheus + Grafana or Confluent Control Center).",
      "Create a dead-letter queue replay runbook — ensure ops team can re-process failed events without re-triggering producers.",
      "Consider Kafka Streams or ksqlDB for complex event processing instead of custom consumer aggregation logic.",
      "Document the event taxonomy (topic names, payload schemas, owners) in an architectural decision record (ADR)."
    ],
    Scores: { Scalability: 9.0, Security: 7.5, Reliability: 8.0, Maintainability: 7.0 },
    OverallScore: 7.875,
    Confidence: 0.91,
    ProvidersUsed: ["demo-seed"],
    ProcessingTimeMs: 5870,
    CreatedAt: oneWeekAgo
  }
]);

print('ArchLens: 3 demo analysis reports seeded into archlens_reports.reports collection.');
