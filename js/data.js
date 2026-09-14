/**
 * DATABRICKS PLATFORM EXPLORER — Canonical Architecture Data
 * 
 * Clean 5-Layer Stack + Cross-Platform Baseboard (inspired by Analytic Endeavors & DAIS)
 * Layer 05: Apps & Analytics
 * Layer 04: AI & Machine Learning
 * Layer 03: Engineering & SQL
 * Layer 02: Data Ingestion
 * Layer 01: Storage & Tables
 * Baseboard: Governance, Operations, Integrations
 */

export const LAYERS = [
  // ── Layer 05: Apps & Analytics ─────────────────────────────
  {
    id: 'apps',
    num: '05',
    name: 'Apps & Analytics',
    stackLevel: 5,
    isStack: true,
    color: 'hsl(15, 85%, 56%)',
    hex: '#ff5722',
    icon: 'apps',
    shortDesc: 'Business applications, conversational analytics, dashboards, and open data sharing.',
    components: [
      {
        id: 'aibi',
        name: 'AI/BI Dashboards',
        subtitle: 'Conversational & Visual BI',
        desc: 'Next-generation business intelligence built natively on the lakehouse. Features rich 12-column responsive layouts, automated KPI cards, and conversational Q&A.',
        tags: ['bi', 'dashboards', 'analytics', 'visualization'],
        connections: ['databricks-sql', 'genie', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/dashboards/',
        opensrc: false
      },
      {
        id: 'genie',
        name: 'Databricks Genie',
        subtitle: 'Conversational Analytics',
        desc: 'Autonomous conversational coworker that translates plain-English business questions into verified SQL queries over lakehouse data, grounded by enterprise ontology.',
        tags: ['genie', 'nl-to-sql', 'ai-agent', 'analytics'],
        connections: ['databricks-sql', 'unity-catalog', 'aibi'],
        docs: 'https://docs.databricks.com/aws/en/genie/',
        opensrc: false
      },
      {
        id: 'dbx-apps',
        name: 'Databricks Apps',
        subtitle: 'Serverless Custom Applications',
        desc: 'Build and deploy custom data-centric web applications (Streamlit, Dash, Gradio, React/Node) running securely inside your governed workspace boundary.',
        tags: ['apps', 'streamlit', 'serverless', 'ui'],
        connections: ['model-serving', 'databricks-sql', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/dev-tools/databricks-apps/',
        opensrc: false
      },
      {
        id: 'clean-rooms',
        name: 'Clean Rooms',
        subtitle: 'Privacy-Preserving Collaboration',
        desc: 'Collaborate securely with external partners and clients on shared datasets without exposing underlying raw data, proprietary IP, or PII.',
        tags: ['clean-rooms', 'privacy', 'collaboration', 'security'],
        connections: ['delta-sharing', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/clean-rooms/',
        opensrc: false
      },
      {
        id: 'delta-sharing',
        name: 'Delta Sharing',
        subtitle: 'Open Data & Model Sharing',
        desc: 'The industry-first open protocol for secure data, AI model, and agent sharing across computing platforms, cloud providers, and regions with zero data duplication.',
        tags: ['open-sharing', 'delta-sharing', 'federation', 'open-source'],
        connections: ['delta-lake', 'unity-catalog', 'marketplace'],
        docs: 'https://docs.databricks.com/aws/en/data-sharing/',
        opensrc: true
      },
      {
        id: 'marketplace',
        name: 'Databricks Marketplace',
        subtitle: 'Commercial Data & AI Hub',
        desc: 'An open exchange for discovering, licensing, and deploying commercial datasets, machine learning models, solutions accelerators, and partner applications.',
        tags: ['marketplace', 'data-products', 'ecosystem'],
        connections: ['delta-sharing', 'dbx-apps', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/marketplace/',
        opensrc: false
      },
      {
        id: 'notebooks',
        name: 'Workspaces & Notebooks',
        subtitle: 'Collaborative Data Science',
        desc: 'Interactive multi-language notebooks (Python, SQL, Scala, R) with real-time co-authoring, version control integration (GitHub/GitLab), and automated lineage.',
        tags: ['notebooks', 'collaboration', 'ide', 'python'],
        connections: ['compute-clusters', 'spark', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/notebooks/',
        opensrc: false
      }
    ]
  },

  // ── Layer 04: AI & Machine Learning ────────────────────────
  {
    id: 'ai',
    num: '04',
    name: 'AI & Machine Learning',
    stackLevel: 4,
    isStack: true,
    color: 'hsl(270, 75%, 62%)',
    hex: '#a855f7',
    icon: 'brain',
    shortDesc: 'End-to-end platform for generative AI, foundation model tuning, vector search, and model serving.',
    components: [
      {
        id: 'model-serving',
        name: 'Model Serving',
        subtitle: 'Serverless Real-Time LLMs & APIs',
        desc: 'Production-grade serverless endpoint hosting for custom LLMs, open-source models (Llama, DBRX, Mistral), and traditional ML with scale-to-zero economics.',
        tags: ['serving', 'llm', 'serverless', 'inference'],
        connections: ['mlflow', 'unity-catalog', 'vector-search', 'dbx-apps'],
        docs: 'https://docs.databricks.com/aws/en/machine-learning/model-serving/',
        opensrc: false
      },
      {
        id: 'vector-search',
        name: 'Mosaic AI Vector Search',
        subtitle: 'Serverless Embedding Database',
        desc: 'A serverless similarity search engine that automatically indexes and syncs vector embeddings directly from Delta Lake tables for production RAG pipelines.',
        tags: ['vector-search', 'rag', 'embeddings', 'ai'],
        connections: ['delta-lake', 'model-serving', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/generative-ai/vector-search',
        opensrc: false
      },
      {
        id: 'mlflow',
        name: 'MLflow',
        subtitle: 'ML Lifecycle & Model Registry',
        desc: 'Open-source platform for managing the end-to-end ML lifecycle: experiment tracking, reproducible packaging, evaluation, and central model registry.',
        tags: ['mlflow', 'mlops', 'registry', 'open-source'],
        connections: ['spark', 'model-serving', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/mlflow/',
        opensrc: true
      },
      {
        id: 'feature-store',
        name: 'Feature Store',
        subtitle: 'Feature Engineering & Serving',
        desc: 'Centralized repository of curated machine learning features that guarantees consistency between offline training and online real-time inference.',
        tags: ['feature-store', 'mlops', 'data-prep'],
        connections: ['delta-lake', 'mlflow', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/machine-learning/feature-store/',
        opensrc: false
      },
      {
        id: 'automl',
        name: 'AutoML',
        subtitle: 'Automated ML Model Generation',
        desc: 'Automatically prepares datasets, trains a suite of candidate algorithms, tunes hyperparameters, and outputs transparent, editable Python code.',
        tags: ['automl', 'no-code', 'training'],
        connections: ['mlflow', 'compute-clusters'],
        docs: 'https://docs.databricks.com/aws/en/machine-learning/automl/',
        opensrc: false
      },
      {
        id: 'mosaic-ai',
        name: 'Mosaic AI Agent Framework',
        subtitle: 'Agentic Systems & Fine-Tuning',
        desc: 'Comprehensive framework for building, evaluating, and fine-tuning enterprise multi-agent applications with built-in MLflow evaluation and guardrails.',
        tags: ['mosaic-ai', 'agent-framework', 'fine-tuning'],
        connections: ['model-serving', 'vector-search', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/generative-ai/agent-framework/',
        opensrc: false
      }
    ]
  },

  // ── Layer 03: Engineering & SQL ────────────────────────────
  {
    id: 'engineering',
    num: '03',
    name: 'Engineering & SQL',
    stackLevel: 3,
    isStack: true,
    color: 'hsl(200, 85%, 52%)',
    hex: '#0284c7',
    icon: 'cpu',
    shortDesc: 'High-performance query engines and declarative data pipelines that transform raw streams into analytics-ready tables.',
    components: [
      {
        id: 'spark',
        name: 'Apache Spark',
        subtitle: 'Unified Analytics Engine',
        desc: 'The industry-standard distributed general-purpose computing engine for large-scale data processing, batch analytics, streaming, and distributed machine learning.',
        tags: ['spark', 'distributed-compute', 'big-data', 'open-source'],
        connections: ['photon', 'lakeflow-pipelines', 'delta-lake'],
        docs: 'https://docs.databricks.com/aws/en/spark/',
        opensrc: true
      },
      {
        id: 'photon',
        name: 'Photon Engine',
        subtitle: 'Native Vectorized C++ Engine',
        desc: 'Databricks next-generation, high-speed execution engine written from the ground up in C++ to accelerate SQL queries and DataFrame operations by up to 8x.',
        tags: ['photon', 'c++', 'acceleration', 'high-performance'],
        connections: ['spark', 'databricks-sql'],
        docs: 'https://docs.databricks.com/aws/en/runtime/photon',
        opensrc: false
      },
      {
        id: 'lakeflow-pipelines',
        name: 'Lakeflow Pipelines (DLT)',
        subtitle: 'Declarative Data Pipelines',
        desc: 'Declarative ETL framework (formerly Delta Live Tables). Specify data transformations in SQL or Python; Databricks manages dependencies, infrastructure, and automated quality testing.',
        tags: ['pipelines', 'dlt', 'declarative-etl', 'data-quality'],
        connections: ['auto-loader', 'delta-lake', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/delta-live-tables/',
        opensrc: false
      },
      {
        id: 'databricks-sql',
        name: 'Databricks SQL',
        subtitle: 'Serverless Data Warehouse',
        desc: 'Provides instant, elastic, serverless SQL compute powered by Photon for querying Delta Lake tables at industry-leading price-performance.',
        tags: ['sql-warehouse', 'data-warehouse', 'serverless', 'bi'],
        connections: ['photon', 'delta-lake', 'aibi', 'genie'],
        docs: 'https://docs.databricks.com/aws/en/sql/',
        opensrc: false
      },
      {
        id: 'ai-functions',
        name: 'AI Functions',
        subtitle: 'SQL-Native GenAI Transforms',
        desc: 'Call state-of-the-art LLMs directly in standard SQL statements: ai_query, ai_extract, ai_classify, ai_summarize, and ai_translate.',
        tags: ['ai-functions', 'sql', 'llm-in-sql'],
        connections: ['databricks-sql', 'model-serving'],
        docs: 'https://docs.databricks.com/aws/en/sql/language-manual/sql-ref-functions-builtin#ai-functions',
        opensrc: false
      },
      {
        id: 'compute-clusters',
        name: 'Compute Clusters',
        subtitle: 'All-Purpose & Job Compute',
        desc: 'Elastic clusters provisioned in your cloud VPC or managed serverless. Automatically scales workers up and down with instant spot-instance management.',
        tags: ['compute', 'clusters', 'autoscaling', 'cloud'],
        connections: ['spark', 'notebooks', 'cloud-storage'],
        docs: 'https://docs.databricks.com/aws/en/compute/',
        opensrc: false
      }
    ]
  },

  // ── Layer 02: Data Ingestion ───────────────────────────────
  {
    id: 'ingestion',
    num: '02',
    name: 'Data Ingestion',
    stackLevel: 2,
    isStack: true,
    color: 'hsl(165, 80%, 44%)',
    hex: '#10b981',
    icon: 'flow',
    shortDesc: 'Automated, scalable connectors and streaming ingestion tools that ingest files, events, and databases into the lakehouse.',
    components: [
      {
        id: 'auto-loader',
        name: 'Auto Loader',
        subtitle: 'CloudFiles Ingestion Engine',
        desc: 'Incrementally and efficiently processes billions of new files arriving in cloud storage without state tracking overhead. Features automated schema inference and evolution.',
        tags: ['auto-loader', 'streaming-ingest', 'schema-evolution'],
        connections: ['cloud-storage', 'lakeflow-pipelines', 'delta-lake'],
        docs: 'https://docs.databricks.com/aws/en/ingestion/auto-loader/',
        opensrc: false
      },
      {
        id: 'lakeflow-connect',
        name: 'Lakeflow Connect',
        subtitle: 'Managed SaaS & CDC Connectors',
        desc: 'Native managed connectors for transactional databases (Postgres, MySQL, Oracle, SQL Server) and enterprise SaaS (Salesforce, Workday, ServiceNow).',
        tags: ['lakeflow-connect', 'cdc', 'saas', 'connectors'],
        connections: ['delta-lake', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/connect/lakeflow-connect',
        opensrc: false
      },
      {
        id: 'structured-streaming',
        name: 'Structured Streaming',
        subtitle: 'Real-Time Event Processing',
        desc: 'Scalable and fault-tolerant stream processing engine built on Apache Spark. Ingests from Apache Kafka, Amazon Kinesis, and event hubs with exactly-once guarantees.',
        tags: ['streaming', 'kafka', 'kinesis', 'real-time', 'open-source'],
        connections: ['spark', 'delta-lake'],
        docs: 'https://docs.databricks.com/aws/en/structured-streaming/',
        opensrc: true
      },
      {
        id: 'partner-connect',
        name: 'Partner Connect',
        subtitle: 'One-Click Ecosystem Setup',
        desc: 'Instantly connect certified third-party tools (Fivetran, Confluent, dbt Cloud, Airbyte, Tableau) to your Databricks workspace with automated security config.',
        tags: ['partner-connect', 'integrations', 'ecosystem'],
        connections: ['unity-catalog', 'compute-clusters'],
        docs: 'https://docs.databricks.com/aws/en/partner-connect/',
        opensrc: false
      }
    ]
  },

  // ── Layer 01: Storage & Tables ─────────────────────────────
  {
    id: 'storage',
    num: '01',
    name: 'Storage & Tables',
    stackLevel: 1,
    isStack: true,
    color: 'hsl(215, 80%, 58%)',
    hex: '#3b82f6',
    icon: 'delta',
    shortDesc: 'The open storage foundation. ACID transaction logs, universal open table formats, and cloud object stores.',
    components: [
      {
        id: 'delta-lake',
        name: 'Delta Lake',
        subtitle: 'Open ACID Table Format',
        desc: 'Open-source storage framework built on Parquet. Provides ACID transactions, scalable metadata handling, time travel (data versioning), and schema enforcement.',
        tags: ['delta-lake', 'acid', 'parquet', 'time-travel', 'open-source'],
        connections: ['spark', 'databricks-sql', 'unity-catalog', 'iceberg'],
        docs: 'https://docs.databricks.com/aws/en/delta/',
        opensrc: true
      },
      {
        id: 'iceberg',
        name: 'Apache Iceberg (UniForm)',
        subtitle: 'Universal Format Interop',
        desc: 'Delta Lake Universal Format (UniForm) generates Apache Iceberg metadata alongside Delta metadata, enabling any Iceberg-compatible query engine to read tables zero-copy.',
        tags: ['iceberg', 'uniform', 'open-table-format', 'open-source'],
        connections: ['delta-lake', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/delta/uniform',
        opensrc: true
      },
      {
        id: 'volumes',
        name: 'Unity Catalog Volumes',
        subtitle: 'Governed Unstructured Data',
        desc: 'Logical volumes for managing, governing, and querying non-tabular data assets — PDFs, images, video, genomics, and raw sensor files — under Unity Catalog.',
        tags: ['volumes', 'unstructured-data', 'files', 'governance'],
        connections: ['cloud-storage', 'unity-catalog', 'vector-search'],
        docs: 'https://docs.databricks.com/aws/en/volumes/',
        opensrc: false
      },
      {
        id: 'cloud-storage',
        name: 'Cloud Object Storage',
        subtitle: 'Amazon S3 · ADLS Gen2 · GCS',
        desc: 'The physical, highly durable object storage in the customer cloud subscription where all Parquet data files, transaction logs, and volume assets physically reside.',
        tags: ['s3', 'adls', 'gcs', 'object-store', 'durability'],
        connections: ['auto-loader', 'delta-lake', 'volumes'],
        docs: 'https://docs.databricks.com/aws/en/connect/storage/',
        opensrc: false
      },
      {
        id: 'medallion',
        name: 'Medallion Architecture',
        subtitle: 'Bronze → Silver → Gold Architecture',
        desc: 'The architectural pattern for incremental data refinement: Bronze (raw append-only), Silver (cleaned, deduplicated, enriched), Gold (aggregated business KPIs).',
        tags: ['medallion', 'bronze-silver-gold', 'architecture', 'best-practice'],
        connections: ['delta-lake', 'lakeflow-pipelines'],
        docs: 'https://docs.databricks.com/aws/en/lakehouse/medallion',
        opensrc: false
      }
    ]
  },

  // ── Across Platform: Governance ────────────────────────────
  {
    id: 'governance',
    name: 'Governance & Security',
    isStack: false,
    color: 'hsl(45, 90%, 54%)',
    hex: '#eab308',
    icon: 'cog',
    shortDesc: 'Unified governance, access control, audit, and security across multi-cloud data and AI assets.',
    components: [
      {
        id: 'unity-catalog',
        name: 'Unity Catalog',
        subtitle: 'Unified Multi-Cloud Governance',
        desc: 'The universal governance metastore for data and AI assets across AWS, Azure, and GCP. Enforces centralized permissions, data lineage, and audit logging.',
        tags: ['unity-catalog', 'governance', 'security', 'open-source'],
        connections: ['delta-lake', 'databricks-sql', 'model-serving', 'aibi'],
        docs: 'https://docs.databricks.com/aws/en/data-governance/unity-catalog/',
        opensrc: true
      },
      {
        id: 'aigateway',
        name: 'Unity AI Gateway',
        subtitle: 'AI Traffic & Spend Governance',
        desc: 'Unified security and routing proxy for LLMs, agent tools, and external AI endpoints. Enforces budget caps, rate limits, PII masking, and audit trails.',
        tags: ['ai-gateway', 'llm-governance', 'rate-limiting', 'security'],
        connections: ['model-serving', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/generative-ai/ai-gateway/',
        opensrc: false
      },
      {
        id: 'lineage',
        name: 'Automated Data Lineage',
        subtitle: 'Column-Level Traceability',
        desc: 'Automatically captures runtime data lineage down to table and column level across queries, pipelines, notebooks, workflows, and dashboards with zero tagging.',
        tags: ['lineage', 'compliance', 'impact-analysis'],
        connections: ['unity-catalog', 'spark', 'databricks-sql'],
        docs: 'https://docs.databricks.com/aws/en/data-governance/unity-catalog/data-lineage',
        opensrc: false
      },
      {
        id: 'system-tables',
        name: 'System Tables',
        subtitle: 'Operational Telemetry Lakehouse',
        desc: 'Analytical tables providing deep visibility into your workspace: billing and consumption, audit events, compute cluster state, and query execution profiles.',
        tags: ['system-tables', 'observability', 'finops', 'audit'],
        connections: ['unity-catalog', 'databricks-sql'],
        docs: 'https://docs.databricks.com/aws/en/administration-guide/system-tables/',
        opensrc: false
      }
    ]
  },

  // ── Across Platform: Operations ────────────────────────────
  {
    id: 'operations',
    name: 'Operations & Workflows',
    isStack: false,
    color: 'hsl(140, 70%, 45%)',
    hex: '#22c55e',
    icon: 'ops',
    shortDesc: 'Enterprise orchestration, monitoring, automated recovery, and resource management.',
    components: [
      {
        id: 'workflows',
        name: 'Databricks Workflows',
        subtitle: 'Production Lakehouse Orchestrator',
        desc: 'Fully managed multi-task orchestration for data, analytics, and AI. Trigger DAGs with conditional execution, repair single task failures, and trace task lineage.',
        tags: ['workflows', 'orchestration', 'jobs', 'scheduling'],
        connections: ['compute-clusters', 'lakeflow-pipelines', 'notebooks'],
        docs: 'https://docs.databricks.com/aws/en/workflows/',
        opensrc: false
      },
      {
        id: 'lakehouse-monitoring',
        name: 'Lakehouse Monitoring',
        subtitle: 'Data & Model Quality Profiling',
        desc: 'Automated statistical profiling that monitors data drift, schema anomalies, and ML model performance degradations over time without writing custom tests.',
        tags: ['monitoring', 'data-quality', 'model-drift'],
        connections: ['delta-lake', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/lakehouse-monitoring/',
        opensrc: false
      },
      {
        id: 'serverless-compute',
        name: 'Serverless Compute',
        subtitle: 'Instant Elastic Compute',
        desc: 'Instant startup (seconds), automated rightsizing, and scale-to-zero compute managed directly in secure Databricks infrastructure.',
        tags: ['serverless', 'instant-boot', 'cost-optimization'],
        connections: ['databricks-sql', 'workflows', 'notebooks'],
        docs: 'https://docs.databricks.com/aws/en/compute/serverless',
        opensrc: false
      }
    ]
  },

  // ── Across Platform: Integrations ──────────────────────────
  {
    id: 'integrations',
    name: 'Integrations & Ecosystem',
    isStack: false,
    color: 'hsl(210, 60%, 55%)',
    hex: '#64748b',
    icon: 'network',
    shortDesc: 'Developer tooling, CI/CD infrastructure as code, BI connectors, and partner frameworks.',
    components: [
      {
        id: 'terraform',
        name: 'Terraform Provider',
        subtitle: 'Infrastructure as Code',
        desc: 'Automate workspace provisioning, cluster creation, Unity Catalog permissions, service principals, and network routing using HashiCorp Terraform.',
        tags: ['terraform', 'iac', 'automation', 'devops'],
        connections: ['unity-catalog', 'compute-clusters'],
        docs: 'https://docs.databricks.com/aws/en/dev-tools/terraform/',
        opensrc: true
      },
      {
        id: 'dbt',
        name: 'dbt Integration',
        subtitle: 'Analytics Engineering',
        desc: 'Use dbt (data build tool) with dbt-databricks to model, test, and document SQL transformations running natively on Databricks SQL or Spark.',
        tags: ['dbt', 'analytics-engineering', 'sql-modeling'],
        connections: ['databricks-sql', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/partner-connect/dbt',
        opensrc: true
      },
      {
        id: 'bi-connectors',
        name: 'Power BI & Tableau',
        subtitle: 'Direct BI Lakehouse Connectivity',
        desc: 'Native DirectQuery and ODBC/JDBC connectors that enable business users in Power BI, Tableau, and Looker to query lakehouse tables with SSO security.',
        tags: ['powerbi', 'tableau', 'bi-connectors', 'odbc'],
        connections: ['databricks-sql', 'unity-catalog'],
        docs: 'https://docs.databricks.com/aws/en/integrations/bi/',
        opensrc: false
      }
    ]
  }
];

// ── Flattened Component Map for Fast Lookup ─────────────────
export const COMPONENT_MAP = {};
LAYERS.forEach(layer => {
  layer.components.forEach(comp => {
    COMPONENT_MAP[comp.id] = {
      ...comp,
      layerId: layer.id,
      layerName: layer.name,
      layerColor: layer.color,
      layerNum: layer.num || ''
    };
  });
});

// ── Interactive Guided Data Journeys ───────────────────────
export const DATA_JOURNEYS = [
  {
    id: 'source-to-dashboard',
    title: 'From Source to Dashboard',
    tagline: '7 steps · Ingestion, tables, SQL and BI',
    desc: 'See how unstructured files and transactional tables land in cloud storage, get refined through Delta Lake, and power sub-second dashboards.',
    steps: [
      { id: 'cloud-storage', role: 'Data Lands in Object Store (S3/ADLS)' },
      { id: 'auto-loader', role: 'Auto Loader Ingests Streams Incrementally' },
      { id: 'delta-lake', role: 'ACID Enforcement in Delta Lake (Bronze / Silver)' },
      { id: 'unity-catalog', role: 'Governance & Access Control Applied' },
      { id: 'databricks-sql', role: 'Serverless Photon SQL Warehouse Processes Query' },
      { id: 'aibi', role: 'Interactive Visualisation in AI/BI Dashboard' }
    ]
  },
  {
    id: 'build-ai-app',
    title: 'Build a Generative AI Application',
    tagline: '6 steps · Documents, retrieval, serving and apps',
    desc: 'Understand how enterprise documents are ingested, indexed into Vector Search, routed through Unity AI Gateway, and served to users in Databricks Apps.',
    steps: [
      { id: 'volumes', role: 'PDFs & Docs Uploaded to Unity Catalog Volumes' },
      { id: 'lakeflow-pipelines', role: 'Parsed & Chunked via Lakeflow Pipelines' },
      { id: 'vector-search', role: 'Embeddings Automatically Indexed in Vector Search' },
      { id: 'aigateway', role: 'Guardrails & Budget Caps Enforced by AI Gateway' },
      { id: 'model-serving', role: 'LLM Generates Answer via Model Serving' },
      { id: 'dbx-apps', role: 'Served Directly in Databricks App or Genie Space' }
    ]
  },
  {
    id: 'realtime-streaming',
    title: 'Real-Time Streaming & LTAP',
    tagline: '5 steps · High-concurrency zero-copy analytics',
    desc: 'Continuous real-time ingestion from Kafka through Structured Streaming directly into Delta Lake with sub-second queries on live tables.',
    steps: [
      { id: 'structured-streaming', role: 'Events Read from Kafka with Exactly-Once Guarantees' },
      { id: 'delta-lake', role: 'Real-Time Streaming Append into Delta Table' },
      { id: 'lakehouse-monitoring', role: 'Automated Real-Time Quality Monitoring' },
      { id: 'databricks-sql', role: 'Sub-Second Analytical Queries over Live Table' }
    ]
  }
];

export const TOTAL_COMPONENTS = Object.keys(COMPONENT_MAP).length;
