/**
 * DAIS 2026 · MODERN DATABRICKS STACK — INTERACTIVE ARCHITECTURE ENGINE
 * Based directly on https://dais-2026-deck.web.app/#/
 */

import { SVGS, getSvg } from './icons.js';

// ── DAIS 2026 Architecture Modules Registry ────────────────
export const DAIS_MODULES = {
  // ── Core Open Storage & Table Formats ──
  deltalake: {
    tag: "Open Storage Layer",
    date: "Open Foundation",
    title: "Delta Lake",
    sum: "The open-source storage framework that brings ACID transactions, scalable metadata handling, and unified streaming and batch data processing to cloud object storage.",
    bullets: [
      ["ACID transactions", "Serializable or write-serializable transaction guarantees prevent dirty reads and inconsistent states during concurrent reads/writes."],
      ["UniForm (Universal Format)", "Read Delta tables natively as Apache Iceberg or Apache Hudi without duplicating data files or running conversion pipelines."],
      ["Time travel & schema evolution", "Query historical snapshots of tables with versioning/timestamps, roll back accidental deletes, and evolve schemas automatically."],
      ["Performance optimizations", "Liquid clustering, Z-ordering, predictive I/O, data skipping, and Parquet caching for ultra-fast queries."]
    ],
    stats: [
      ["Open source", "Linux Foundation hosted project"],
      ["UniForm", "Zero-copy Delta + Iceberg + Hudi"],
      ["100% ACID", "Multi-version concurrency control (MVCC)"],
      ["50M+", "Monthly downloads globally"]
    ],
    src: "https://delta.io",
    simType: "deltalake"
  },

  iceberg: {
    tag: "Open Table Format",
    date: "Open Foundation",
    title: "Apache Iceberg Support & UniForm",
    sum: "First-class Apache Iceberg interoperability via Delta Lake UniForm and Unity Catalog: read and write Iceberg tables with zero data duplication, using the open Iceberg REST catalog API.",
    bullets: [
      ["UniForm zero-copy access", "Write data once and query it seamlessly as either Delta Lake or Apache Iceberg with automatic metadata translation."],
      ["Apache Iceberg REST Catalog", "Unity Catalog implements the open Iceberg REST Catalog API, enabling external engines (Snowflake, Trino, BigQuery, Spark) to read governed tables."],
      ["No data duplication", "Eliminates duplicate storage costs and out-of-sync copies by maintaining dual Iceberg and Delta metadata pointing to the same Parquet files."],
      ["Universal governance", "Row filters, column masks, and access control policies defined in Unity Catalog apply uniformly to Iceberg queries."]
    ],
    stats: [
      ["REST API", "Open Iceberg REST catalog compatible"],
      ["0 copies", "Shared Parquet files across formats"],
      ["Multi-engine", "Snowflake · Trino · Spark · Presto"],
      ["Bi-directional", "Read & write Iceberg natively"]
    ],
    src: "https://www.databricks.com/product/delta-lake/uniform",
    simType: "iceberg"
  },

  lakehouse: {
    tag: "Open Lakehouse",
    date: "Platform Foundation",
    title: "Lakehouse Architecture",
    sum: "One architecture that merges the data lake and data warehouse — open formats, one governed copy, every workload, on any cloud.",
    bullets: [
      ["Lake + warehouse, unified", "Data lakes scale but lack governance; warehouses govern but are rigid. The lakehouse delivers both — zero silos."],
      ["Open foundation", "Built on Apache Spark, Delta Lake & MLflow; your data stays in open formats under your control without proprietary lock-in."],
      ["Delta Lake reliability", "ACID transactions, schema enforcement, data quality and blazing performance on cloud object storage; Delta Sharing for live sharing without copies."],
      ["One platform, any cloud", "Unified integration, storage, governance, analytics & AI for structured and unstructured data across AWS, Azure & GCP."]
    ],
    stats: [
      ["1 copy", "Lake + warehouse unified"],
      ["Open", "Spark · Delta Lake · MLflow"],
      ["3 clouds", "AWS · Azure · GCP"],
      ["Lowest TCO", "Auto-optimized performance"]
    ],
    src: "https://www.databricks.com/product/data-lakehouse",
    simType: "lakehouse"
  },

  lakehousert: {
    tag: "Real-Time Warehouse",
    date: "June 2026",
    title: "Lakehouse//RT",
    sum: "A real-time data warehouse powered by the Reyden engine — millisecond queries directly on the lakehouse, no separate serving layer, no data movement.",
    bullets: [
      ["Millisecond latency", "As low as 10ms on operational data, sub-100ms on massive scale — sustaining 12,000+ queries per second."],
      ["Complex analytics", "Handles multi-way joins, window functions and subqueries that traditional real-time engines choke on."],
      ["Zero copies, unified governance", "Serves Delta & Iceberg directly — no proprietary duplication; Unity Catalog policies stay consistent."],
      ["Effortless autoscaling", "AUTO sizing picks optimal baseline; incremental autoscaling adds single nodes instead of redundant warehouse copies."]
    ],
    stats: [
      ["sub-100ms", "At 12,000 queries / second"],
      ["Up to 16x", "Faster than separate serving layers"],
      ["0 copies", "Queries run on open formats"],
      ["AUTO", "Sizing + incremental autoscale"]
    ],
    src: "https://www.databricks.com/blog/introducing-lakehousert-real-time-performance-unified-lakehouse",
    simType: "ltap"
  },

  ltap: {
    tag: "Real-Time Processing",
    date: "June 2026",
    title: "LTAP — Lakehouse Transactional & Analytical Processing",
    sum: "Eliminates the split between transactional databases and analytical warehouses. Run operational OLTP writes and sub-second OLAP analytics on a single open storage tier.",
    bullets: [
      ["Zero ETL pipelines", "Changes written by transactional applications are immediately visible to analytics and AI models in real-time."],
      ["No dual-storage cost", "Avoid paying for separate operational databases and expensive enterprise cloud data warehouses."],
      ["Strong consistency", "Snapshot isolation and serializable ACID transactions backed by Delta Lake and Lakebase."],
      ["Unified governance", "One access control list, one audit log, one catalog across transactions and reporting."]
    ],
    stats: [
      ["0 sec", "ETL latency between OLTP & OLAP"],
      ["60-80%", "Lower storage and compute bills"],
      ["12K+ QPS", "High-concurrency analytical throughput"],
      ["ACID", "Serializable transaction guarantees"]
    ],
    src: "https://www.databricks.com/blog/introducing-lakehousert-real-time-performance-unified-lakehouse",
    simType: "ltap"
  },

  lakebase: {
    tag: "Serverless Postgres",
    date: "Feb 2026",
    title: "Databricks Lakebase",
    sum: "The operational database for the AI era: production-ready serverless Postgres built into the Lakehouse for transactional applications, agent memory, and real-time state with zero-ETL integration.",
    bullets: [
      ["Serverless Postgres engine", "Fully managed, scalable PostgreSQL database built directly into Databricks with instant provisioning and automated scaling."],
      ["AI Agent system-of-record", "Store conversational memory, tool state, agent configurations, and transactional audit trails with microsecond latency."],
      ["Zero-ETL Lakehouse replication", "Operational records written to Lakebase are automatically, continuously mirrored to Delta Lake tables for real-time analytics."],
      ["Unified Unity Catalog governance", "Manage database users, access control lists, and encryption keys under a single unified security framework."]
    ],
    stats: [
      ["100%", "PostgreSQL wire-compatible"],
      ["0 ETL", "Continuous bidirectional Delta sync"],
      ["Serverless", "Instant scale & pay-per-use"],
      ["Microsecond", "Operational read/write latency"]
    ],
    src: "https://www.databricks.com/product/lakebase",
    simType: "lakebase"
  },

  lakebasepartners: {
    tag: "Foundation",
    date: "Feb 2026",
    title: "Lakebase Launch Partners",
    sum: "60+ vetted partners ready to support Lakebase — production-ready serverless Postgres for the AI era.",
    bullets: [
      ["Unified workloads", "OLTP + OLAP + AI on one governed foundation; zero brittle ETL synchronization between systems."],
      ["Agent system-of-record", "Store agent state, conversational memory and workflow configuration in serverless Postgres."],
      ["Partner ecosystem", "Accenture, Deloitte, EY, Fivetran, Confluent, Retool, Replit, ThoughtSpot & more."]
    ],
    stats: [
      ["60+", "Ecosystem launch partners"],
      ["GA", "Since February 2026"],
      ["Serverless", "Managed PostgreSQL engine"],
      ["0 ETL", "Bidirectional OLTP ↔ Lakehouse"]
    ],
    src: "https://www.databricks.com/blog/announcing-databricks-lakebase-launch-partners"
  },

  lakeflow: {
    tag: "Agentic Data",
    date: "June 2026",
    title: "Lakeflow — Unified Data Ingestion & Pipelines",
    sum: "A single, declarative solution for data engineering: Lakeflow Connect for broad SaaS/database ingestion, Lakeflow Pipelines for automated ETL, and Lakeflow Jobs for orchestrating workloads.",
    bullets: [
      ["Native connectors", "Serverless ingestion from Salesforce, Workday, ServiceNow, PostgreSQL, MySQL, Oracle, Kafka & S3."],
      ["Automated transformations", "SQL and Python declarative pipelines with automatic data quality expectations and schema evolution."],
      ["Orchestration built-in", "Trigger, monitor and alert on complex DAGs with automated failure recovery and lineage tracking."],
      ["Zero infrastructure to manage", "Fully serverless execution eliminates sizing clusters, tuning memory, or managing drivers."]
    ],
    stats: [
      ["50+", "Native managed connectors"],
      ["100%", "Serverless auto-scaling"],
      ["Automated", "Data quality expectations"],
      ["Built-in", "Unity Catalog governance"]
    ],
    src: "https://www.databricks.com/product/lakeflow",
    simType: "lakeflow"
  },

  unitycatalog: {
    tag: "Unified Governance",
    date: "Platform Foundation",
    title: "Unity Catalog",
    sum: "The industry's only unified governance solution for data and AI across clouds. Manage files, tables, volumes, AI models, notebooks, and dashboards under a single universal permission model.",
    bullets: [
      ["Multi-cloud metadata", "One universal catalog across AWS, Azure, and GCP — no vendor silos or disconnected IAM policies."],
      ["End-to-end data lineage", "Automatically traces data flow down to column level, from raw ingestion all the way to dashboards and LLMs."],
      ["Attribute-based access control", "Row-level filtering, column masking, and tag-based policies enforced dynamically at query runtime."],
      ["Open standard", "Open-sourced under Linux Foundation with REST API compatibility for Apache Iceberg and Delta Lake."]
    ],
    stats: [
      ["1 catalog", "Data + AI + Models across 3 clouds"],
      ["Open source", "Linux Foundation governance API"],
      ["Column-level", "Automated runtime lineage"],
      ["Fine-grained", "Row filters & column masking"]
    ],
    src: "https://www.databricks.com/product/unity-catalog",
    simType: "unitycatalog"
  },

  aigateway: {
    tag: "AI Governance",
    date: "June 2026",
    title: "Unity AI Gateway",
    sum: "Govern enterprise runtime AI — models, agent swarms, MCP tools, and external APIs — with unified access controls, rate limiting, and cost tracking.",
    bullets: [
      ["Cost control & routing", "Unified AI spend tracking, granular cost attribution, hard monthly spend caps, and intelligent model routing."],
      ["Security guardrails", "Prevent PII leakage, block prompt injection, and enforce safety policies across OpenAI, Claude, Gemini & OSS LLMs."],
      ["Zero-downtime failover", "Automatically fallback to alternate providers or self-hosted models when upstream APIs experience outages."],
      ["Audit & monitoring", "Complete payload logging and LLM trace inspection recorded directly in Unity Catalog system tables."]
    ],
    stats: [
      ["1 layer", "Governs models + agents + MCP tools"],
      ["Hard caps", "Auto-stop spend breach prevention"],
      ["Zero-lag", "Sub-millisecond routing proxy"],
      ["10+", "Frontline AI security partners"]
    ],
    src: "https://www.databricks.com/blog/ai-governance-data-ai-summit-2026-whats-new-unity-ai-gateway"
  },

  genie: {
    tag: "Conversational Analytics",
    date: "Platform",
    title: "Databricks Genie",
    sum: "Conversational AI coworker that answers complex data questions in natural language, generating verified SQL queries, calculations, and charts over the lakehouse.",
    bullets: [
      ["Conversational Q&A", "Understands domain-specific jargon, translates ambiguous questions into accurate SQL, and plots interactive visualizations."],
      ["Trusted answers", "Subject matter experts can attach certified SQL logic for KPI queries to ensure 100% precision."],
      ["Continuous learning", "Incorporates user feedback, learns schema semantics, and leverages Genie Ontology for business context."],
      ["Deploy anywhere", "Embed inside Slack, Microsoft Teams, AI/BI Dashboards, or bespoke enterprise portals."]
    ],
    stats: [
      ["0 SQL", "Natural language analytics"],
      ["Trusted answers", "Verified SQL functions"],
      ["UC-grounded", "Governed row/col access"],
      ["Spaces", "Domain-tailored analytic rooms"]
    ],
    src: "https://www.databricks.com/product/databricks-genie",
    simType: "genie"
  },

  geniecode: {
    tag: "AI Code Assistant",
    date: "Platform",
    title: "Genie Code & Databricks Assistant",
    sum: "Context-aware AI pair programmer for data teams: generate, refactor, debug, and optimize SQL, Python, R, and Scala directly inside Databricks notebooks and the SQL editor.",
    bullets: [
      ["Context-aware code generation", "Leverages Unity Catalog schema metadata, table definitions, and column comments to generate accurate queries and pipeline code."],
      ["Instant error diagnostics", "Click 'Diagnose Error' on any failed cell or job run to automatically identify the root cause and receive a 1-click syntax or logic fix."],
      ["Automated code refactoring", "Translate legacy PySpark, Pandas, or SQL dialect scripts into modern, vectorized Photon-optimized syntax."],
      ["Inline autocomplete & doc generation", "Real-time code completions, inline explanations of complex transformations, and automated docstring generation."]
    ],
    stats: [
      ["50%+", "Faster pipeline development"],
      ["Contextual", "Understands schemas & Unity Catalog"],
      ["Multi-language", "SQL · Python · Scala · R"],
      ["1-click", "Automated error diagnosis & fixes"]
    ],
    src: "https://www.databricks.com/product/assistant",
    simType: "geniecode"
  },

  genieone: {
    tag: "AI Coworker",
    date: "DAIS 2026",
    title: "Genie One",
    sum: "The enterprise AI coworker — business teams ask in natural language, get governed answers, and trigger actions across 50+ enterprise SaaS tools.",
    bullets: [
      ["Cross-tool orchestration", "Integrates with Slack, Teams, Jira, Salesforce, SAP, and GitHub to execute actions autonomously."],
      ["Enterprise context", "Rely on Genie Ontology and Unity Catalog to understand organizational hierarchy and definitions."],
      ["Zero code required", "Non-technical personnel can automate complex cross-department workflows via simple conversational prompts."],
      ["Human-in-the-loop", "Sensitive actions (financial transactions, data updates) require explicit user confirmation."]
    ],
    stats: [
      ["50+", "Connected enterprise SaaS tools"],
      ["No-code", "Automated workflow triggers"],
      ["100%", "Grounded in business ontology"],
      ["Enterprise", "Role-based action permissions"]
    ],
    src: "https://www.databricks.com/blog/introducing-genie-one-genie-ontology-and-genie-agents"
  },

  genieagents: {
    tag: "Agentic Analytics",
    date: "Platform",
    title: "Genie Agents",
    sum: "Specialized analytical agents tailored for distinct business units — Finance, Marketing, Supply Chain, and Engineering.",
    bullets: [
      ["Domain-tuned reasoning", "Each agent specializes in specific schemas, KPIs, and statistical methods."],
      ["Collaborative analysis", "Agents communicate with each other to solve cross-functional questions."],
      ["Verifiable output", "Every insight includes the underlying query, confidence score, and data lineage."],
      ["Automated alerting", "Agents continuously monitor lakehouse metrics and proactively notify stakeholders of anomalies."]
    ],
    stats: [
      ["Multi-agent", "Collaborative analytical swarms"],
      ["Real-time", "Proactive anomaly monitoring"],
      ["100%", "Verifiable SQL & source lineage"],
      ["API-first", "Integrates into any workspace tool"]
    ],
    src: "https://www.databricks.com/blog/introducing-genie-one-genie-ontology-and-genie-agents"
  },

  vibecoding: {
    tag: "App Development",
    date: "June 2026",
    title: "Governed Vibe Coding & App Builder",
    sum: "Fast, natural-language app generation backed by enterprise guardrails — App Spaces, Genie App Builder, and Serverless Micro Apps.",
    bullets: [
      ["Natural language to full apps", "Describe the interface or upload a wireframe screenshot; Genie generates reactive UI with TypeScript & Python."],
      ["App Spaces security", "Configure data governance and IAM policies once at the space level; every generated app inherits them automatically."],
      ["Serverless micro-apps", "Instant micro-VM provisioning, scale-to-zero cold boots, and pay-per-execution economics."],
      ["Pre-wired data integration", "Native connection to SQL Warehouses, Lakebase, Vector Search, and Model Serving."]
    ],
    stats: [
      ["~2x", "Active running apps in 6 months"],
      ["3x", "Weekly app users growth"],
      ["Scale-to-0", "Serverless micro-VM containers"],
      ["1 review", "Governance per space, not per app"]
    ],
    src: "https://www.databricks.com/blog/enabling-governed-vibe-coding-enterprise-apps-databricks"
  },

  geniezeroops: {
    tag: "Autonomous Ops",
    date: "June 2026",
    title: "Genie ZeroOps",
    sum: "An autonomous background agent that continuously monitors production data and AI workloads, pinpoints failures, and submits verified PR fixes for your review.",
    bullets: [
      ["Continuous detection", "Watches job runs, query errors, latency spikes, and silent data quality degradation."],
      ["Root-cause lineage diagnosis", "Inspects Unity Catalog lineage to identify whether issues stem from code regressions, upstream schema shifts, or stale sources."],
      ["Zero-copy sandbox verification", "Generates a bug fix and validates it against a zero-copy clone of production data before notifying engineers."],
      ["Human-in-the-loop approval", "Presents a prioritized inbox with detailed fix diffs and test results ready for 1-click merge."]
    ],
    stats: [
      ["4 steps", "Detect · Assess · Remediate · Verify"],
      ["Zero-copy", "Safe sandbox validation on real data"],
      ["Lineage", "UC root-cause dependency tracing"],
      ["1-click", "GitHub PR creation & remediation"]
    ],
    src: "https://www.databricks.com/blog/introducing-genie-zeroops"
  },

  agentbricks: {
    tag: "Agent Platform",
    date: "June 2026",
    title: "Agent Bricks",
    sum: "A complete enterprise platform for creating, testing, and governing AI agents — because the LLM prompt loop is only 1% of the job; 99% is production engineering.",
    bullets: [
      ["Model choice", "Plug-and-play with OpenAI, Anthropic Claude, Google Gemini, Meta Llama, and custom fine-tuned models."],
      ["Rich enterprise context", "Pre-built MCP (Model Context Protocol) connectors for Google Drive, Jira, Slack, GitHub, and Lakehouse tables."],
      ["Full observability", "Detailed agent execution traces, token consumption tracking, and quality evaluation in MLflow."],
      ["Governance at scale", "Unity AI Gateway enforcement ensures agent actions comply with company compliance policies."]
    ],
    stats: [
      ["100,000+", "Agents built across enterprises"],
      ["1+ quadrillion", "Tokens processed annually"],
      ["1% vs 99%", "The prompt loop vs production engineering"],
      ["6+", "Top LLM model provider families"]
    ],
    src: "https://www.databricks.com/blog/agent-bricks-dais-2026",
    simType: "agents"
  },

  omnigent: {
    tag: "Multi-Agent System",
    date: "DAIS 2026",
    title: "Omnigent — Collaborative Multi-Agent Runtime",
    sum: "An enterprise framework for orchestrating teams of specialized AI agents that collaborate to solve complex, multi-stage business challenges.",
    bullets: [
      ["Role-based delegation", "A lead Orchestrator agent decomposes tasks and assigns sub-problems to domain specialist agents."],
      ["Shared memory & state", "Persistent conversation history and execution state stored safely in Lakebase Postgres."],
      ["Automated reflection & critique", "Peer agents review intermediate results, detect hallucinations, and request corrections prior to final output."],
      ["Deterministic tool integration", "Executes verified Python scripts, SQL statements, and REST API calls under strict sandbox isolation."]
    ],
    stats: [
      ["10x", "Higher accuracy on complex reasoning tasks"],
      ["Lakebase", "State persistence & memory storage"],
      ["Sandbox", "Safe isolated execution runtime"],
      ["Open standard", "Compatible with LangGraph and CrewAI"]
    ],
    src: "https://www.databricks.com/blog/agent-bricks-dais-2026",
    simType: "agents"
  },

  geniontology: {
    tag: "Enterprise Semantics",
    date: "Platform",
    title: "Genie Ontology",
    sum: "The universal semantic knowledge graph that maps enterprise data structures, business terms, and KPI formulas into a single shared mental model for all agents.",
    bullets: [
      ["Single source of truth", "Every agent and Genie Space references the same verified business terminology — eliminating contradictory numbers."],
      ["Semantic relationship graph", "Connects customer entities across tables, schemas, and cloud regions with contextual graph relationships."],
      ["Continuous enrichment", "Learns from analyst queries, feedback annotations, and schema metadata in real-time."],
      ["Unity Catalog integration", "Directly binds business terms to governed physical tables, views, and columns."]
    ],
    stats: [
      ["1 source", "Of shared business meaning for all agents"],
      ["Continuous", "Self-learning from enterprise queries"],
      ["UC-bound", "Enforced through Unity Catalog"],
      ["Context", "The foundational pillar of Agent Bricks"]
    ],
    src: "https://www.databricks.com/blog/introducing-genie-one-genie-ontology-and-genie-agents"
  },

  apps: {
    tag: "Serverless Applications",
    date: "June 2026",
    title: "Databricks Apps",
    sum: "Build, deploy, and securely host full-stack data and AI applications (Streamlit, Dash, Gradio, FastAPI, React) natively within Databricks with automatic Unity Catalog governance.",
    bullets: [
      ["Native full-stack apps", "Deploy interactive data applications using Python, Streamlit, Dash, Gradio, FastAPI, or custom React frontends directly within your workspace."],
      ["Automatic governance & auth", "Inherits Unity Catalog permissions, role-based access control (RBAC), and Single Sign-On (SSO) out of the box with zero boilerplate."],
      ["Serverless compute", "Instant provisioning, auto-scaling, and scale-to-zero compute economics without managing VMs, Kubernetes pods, or containers."],
      ["Secure data access", "Query Lakehouse tables, Vector Search indexes, and call Model Serving endpoints safely within the enterprise network perimeter."]
    ],
    stats: [
      ["0 config", "Instant SSO & Unity Catalog auth"],
      ["Serverless", "Auto-scaling micro-VM containers"],
      ["Frameworks", "Streamlit · Dash · Gradio · FastAPI"],
      ["Enterprise", "Private networking & egress control"]
    ],
    src: "https://www.databricks.com/product/databricks-apps",
    simType: "apps"
  },

  marketplace: {
    tag: "Marketplace & Apps",
    date: "June 2026",
    title: "Databricks Apps & Marketplace",
    sum: "Discover, install, and execute native applications directly on your own data without moving files or copying records to third-party SaaS vendors.",
    bullets: [
      ["Zero data movement", "Third-party partner algorithms run directly inside your governed Databricks security boundary."],
      ["One-click deployment", "Browse enterprise solutions, grant granular Unity Catalog permissions, and launch on serverless compute."],
      ["Isolated sandboxes", "Each app executes in a secure, micro-VM sandbox with controlled egress network rules."],
      ["Commercial data products", "Monetize and share proprietary datasets, AI models, and analytical tools via Delta Sharing."]
    ],
    stats: [
      ["20+", "Production-grade partner apps at launch"],
      ["0", "Data copies moved to third-party vendors"],
      ["100%", "Native Unity Catalog governance"],
      ["All regions", "Available with enterprise compliance profiles"]
    ],
    src: "https://www.databricks.com/product/marketplace"
  },

  lakewatch: {
    tag: "Security SIEM",
    date: "June 2026",
    title: "Lakewatch — Open Security Lakehouse",
    sum: "A next-generation SIEM and security analytics engine built on the Lakehouse: full-fidelity telemetry, decoupled storage/compute, and AI-speed threat detection.",
    bullets: [
      ["Comprehensive visibility", "Consolidates cloud trail logs, network flows, HR records, and application events over the open OCSF schema."],
      ["AI-driven investigation", "Genie Code and Genie Spaces generate detection rules, filter out false positives, and allow plain-English incident triage."],
      ["Decoupled cost savings", "Keep petabytes of historical telemetry in your own cloud object storage at up to 80% lower cost than traditional SIEMs."],
      ["Open security ecosystem", "17+ security partners including CrowdStrike, Zscaler, SentinelOne, and Palo Alto Networks."]
    ],
    stats: [
      ["23d → 1.6d", "Average time to exploit detection cut dramatically"],
      ["Up to 80%", "Cost reduction via storage/compute decoupling"],
      ["500+", "Zero-day vulnerabilities discovered by AI"],
      ["17+", "Open Security Lakehouse ecosystem partners"]
    ],
    src: "https://www.databricks.com/product/security-lakehouse"
  },

  agenticcdp: {
    tag: "Customer 360",
    date: "DAIS 2026",
    title: "CustomerLake — Agentic Customer Intelligence",
    sum: "Transforms customer telemetry into an active intelligence asset. Automatically unifies identity, predicts churn, and triggers real-time personalization across marketing channels.",
    bullets: [
      ["Identity resolution", "Deterministically and probabilistically resolves cross-device identities into a single Customer 360 view in Delta Lake."],
      ["Real-time event ingestion", "Captures web clicks, mobile app interactions, and purchase receipts via Lakeflow with sub-second latency."],
      ["Predictive AI models", "Built-in Mosaic AI templates for lifetime value (LTV), propensity to buy, and automated churn prevention."],
      ["Bi-directional sync", "Seamlessly pushes unified customer cohorts to Braze, Klaviyo, Salesforce, and Google Ads."]
    ],
    stats: [
      ["360°", "Unified customer identity graph"],
      ["Sub-sec", "Streaming event capture & activation"],
      ["0 ETL", "Operates directly on lakehouse data"],
      ["Privacy", "Built-in GDPR & CCPA consent enforcement"]
    ],
    src: "https://www.databricks.com/solutions/customer-analytics"
  },

  opensharing: {
    tag: "Open Sharing",
    date: "June 2026",
    title: "OpenSharing & Delta Sharing v2",
    sum: "The next evolution of Delta Sharing: securely share tables, AI models, agents, and Genie spaces across clouds and platforms without vendor lock-in.",
    bullets: [
      ["Share governed agents", "Share conversational Genie agents with external partners while concealing internal prompts and enforcing token quotas."],
      ["SecureConnect proxy", "Managed proxy eliminates tedious IP allowlisting and complex customer firewall configuration."],
      ["Global replication", "Automatic cross-region replication allows recipients to query local replicas with zero cross-region egress charges."],
      ["Open format standard", "Linux Foundation open specification compatible with Apache Iceberg REST catalog and on-prem storage."]
    ],
    stats: [
      ["28,000+", "Active Delta Sharing data recipients worldwide"],
      ["33%", "Of all data shares cross multi-cloud boundaries"],
      ["0", "Egress cost with local cached replicas"],
      ["Hundreds EB", "Of production enterprise data managed"]
    ],
    src: "https://www.databricks.com/product/delta-sharing"
  },

  anycloud: {
    tag: "Multi-Cloud Architecture",
    date: "Platform Foundation",
    title: "Any Cloud — Multi-Cloud Data Intelligence",
    sum: "Deploy and operate Databricks across AWS, Microsoft Azure, and Google Cloud Platform (GCP) with identical APIs, unified cross-cloud governance, and zero vendor lock-in.",
    bullets: [
      ["Consistent experience on all 3 clouds", "The exact same notebooks, SQL warehouses, serverless compute, and ML pipelines across AWS, Azure, and Google Cloud."],
      ["Unified cross-cloud governance", "Unity Catalog provides a single metastore and identity model governing data assets residing in S3, ADLS Gen2, and Google Cloud Storage (GCS)."],
      ["Delta Sharing multi-cloud federation", "Share live data and models across clouds and regions with zero egress fees and zero data copying."],
      ["Disaster recovery & workload portability", "Easily migrate workloads or balance compute capacity across cloud providers without rewriting application code."]
    ],
    stats: [
      ["3 clouds", "AWS · Microsoft Azure · Google Cloud"],
      ["1 catalog", "Cross-cloud Unity Catalog governance"],
      ["100% portable", "Open formats & standard SQL/Python"],
      ["0 lock-in", "Runs directly on your object storage"]
    ],
    src: "https://www.databricks.com/product/multi-cloud",
    simType: "anycloud"
  },

  anymodel: {
    tag: "AI Model Freedom",
    date: "June 2026",
    title: "Any Model — Mosaic AI Model Serving",
    sum: "Build with any AI model: route to frontier proprietary LLMs (OpenAI, Anthropic, Gemini), serve open-source foundation models (Llama, Mistral, DBRX), or deploy custom fine-tuned weights under unified enterprise governance.",
    bullets: [
      ["Frontier external APIs", "Call OpenAI GPT-4o, Anthropic Claude 3.5, and Google Gemini via unified, rate-limited, and cost-capped Foundation Model APIs."],
      ["Open weights hosting", "Serverless 1-click deployment for open-source LLMs including Llama 3, Mistral, and DBRX on optimized GPU infrastructure."],
      ["Custom fine-tuning & domain adaptation", "Fine-tune models on your proprietary lakehouse data with Mosaic AI Model Training using your own IP safely."],
      ["Unified security & evaluation", "Unity AI Gateway enforces guardrails, PII masking, and audit logging across all models, while MLflow evaluates output quality."]
    ],
    stats: [
      ["Any LLM", "Proprietary APIs + Open Source + Custom"],
      ["Sub-ms", "High-throughput serverless model serving"],
      ["100% private", "Customer data never trains vendor models"],
      ["Auto-eval", "MLflow LLM evaluation & benchmarking"]
    ],
    src: "https://www.databricks.com/product/mosaic-ai-foundation-models",
    simType: "anymodel"
  },

  anydata: {
    tag: "Multimodal Intelligence",
    date: "Platform Foundation",
    title: "Any Data — Multimodal Lakehouse",
    sum: "Ingest, govern, and analyze any data type in the Lakehouse: structured tables, semi-structured logs & JSON, and unstructured text, images, audio, video, PDFs, and vector embeddings.",
    bullets: [
      ["Multimodal AI & unstructured data", "Store documents, audio, video, and PDFs in Unity Catalog Volumes; extract knowledge automatically with Mosaic AI."],
      ["Semi-structured & streaming", "Native support for JSON, Parquet, Avro, XML, and CDC changelog streams with automatic schema inference and evolution."],
      ["Integrated Vector Search", "Automatically compute and sync embeddings into serverless vector indexes for semantic search and RAG applications."],
      ["Uniform governance across all types", "Apply access controls, lineage tracking, and audit logging to raw files and unstructured volumes just like SQL tables."]
    ],
    stats: [
      ["All types", "Structured · Semi-structured · Unstructured"],
      ["Volumes", "Native governance for non-tabular files"],
      ["Vector Search", "Auto-syncing vector index generation"],
      ["0 silos", "One security boundary for all assets"]
    ],
    src: "https://www.databricks.com/product/data-lakehouse",
    simType: "anydata"
  },

  realtime_ml: {
    tag: "Real-Time Machine Learning",
    date: "June 2026",
    title: "Mosaic AI Real-Time ML & Serving",
    sum: "Ultra-low latency inference, feature serving, and streaming machine learning directly over the Lakehouse for real-time recommendations, fraud detection, and agentic workflows.",
    bullets: [
      ["Sub-10ms model serving", "Serve Scikit-learn, PyTorch, XGBoost, and ONNX models on auto-scaling serverless infrastructure with millisecond response times."],
      ["Online Feature Store", "Synchronize batch features to low-latency key-value stores for real-time feature lookup during inference."],
      ["Continuous model monitoring", "Automatically track latency, throughput, data drift, and prediction anomalies in production using Lakehouse Monitoring."],
      ["Streaming inference integration", "Score live event streams from Kafka, Kinesis, and Event Hubs with Structured Streaming pipelines."]
    ],
    stats: [
      ["sub-10ms", "P99 inference latency"],
      ["Auto-scale", "Scales to zero when idle"],
      ["Feature store", "Online/offline feature consistency"],
      ["Drift tracking", "Automated production monitoring"]
    ],
    src: "https://www.databricks.com/product/machine-learning",
    simType: "realtime_ml"
  },

  secureconnect: {
    tag: "Enterprise Networking",
    date: "June 2026",
    title: "SecureConnect — Zero-Trust Private Connectivity",
    sum: "Secure, managed private connectivity between Databricks serverless compute, on-premises corporate data sources, and multi-cloud VPCs without complex VPNs or public IP exposure.",
    bullets: [
      ["Zero public IP exposure", "Connect serverless SQL warehouses and notebooks to internal enterprise networks through secure, private tunnels."],
      ["Automated firewall traversal", "Eliminates tedious IP allowlist churn and manual proxy configurations across cloud networks."],
      ["PrivateLink & PSC integration", "Native integration with AWS PrivateLink, Azure Private Link, and GCP Private Service Connect."],
      ["End-to-end encryption", "mTLS cryptographic handshake and continuous posture validation for all network transit."]
    ],
    stats: [
      ["0 public IPs", "Complete private network isolation"],
      ["1-click", "Setup without network redesign"],
      ["Multi-cloud", "AWS PrivateLink · Azure · GCP PSC"],
      ["SOC2 / FedRAMP", "Certified compliance security"]
    ],
    src: "https://www.databricks.com/product/security",
    simType: "secureconnect"
  },

  aibi_dashboards: {
    tag: "Intelligent BI",
    date: "Platform",
    title: "AI/BI Dashboards",
    sum: "Next-generation business intelligence built directly into the Lakehouse: low-code interactive visualization with conversational Genie spaces and automated data refresh.",
    bullets: [
      ["Built-in lakehouse visualizations", "Create rich, responsive dashboards with 20+ chart types, multi-tab layouts, and parameter cross-filtering."],
      ["Conversational Genie integration", "Every dashboard can be paired with a Genie space, allowing business users to ask follow-up questions in natural language."],
      ["Serverless SQL speed", "Powered by serverless SQL warehouses with automated query caching and instant concurrency scaling."],
      ["Governed publishing & sharing", "Share interactive dashboards with external stakeholders or embed inside enterprise portals with Unity Catalog permissions."]
    ],
    stats: [
      ["20+", "Native chart types & widgets"],
      ["Sub-second", "Cached query response times"],
      ["Conversational", "Genie Q&A embedded directly"],
      ["100%", "Governed by Unity Catalog"]
    ],
    src: "https://www.databricks.com/product/databricks-sql",
    simType: "aibi_dashboards"
  },

  free_edition: {
    tag: "Community & Developer",
    date: "Always Available",
    title: "Databricks Free Edition & Learning Platform",
    sum: "Instant, free self-service access to Databricks for developers, students, and practitioners to learn Apache Spark, Delta Lake, SQL, and machine learning with zero credit card required.",
    bullets: [
      ["Instant access with zero setup", "Spin up a pre-configured micro-cluster with Apache Spark and Delta Lake in seconds with no cloud credentials needed."],
      ["Interactive notebooks & tutorials", "Hands-on access to guided tutorials for data engineering, generative AI, feature engineering, and analytics."],
      ["Sample datasets included", "Pre-loaded with popular open datasets (COVID, financial markets, Wikipedia, IoT telemetry) to test transformations immediately."],
      ["Seamless transition to production", "Export notebooks and code directly to commercial Databricks workspaces on AWS, Azure, or GCP."]
    ],
    stats: [
      ["$0", "Completely free access"],
      ["0 setup", "No credit card or cloud account required"],
      ["Pre-loaded", "Rich sample datasets & tutorials"],
      ["1M+", "Community developers trained"]
    ],
    src: "https://www.databricks.com/try-databricks",
    simType: "free_edition"
  },

  azure: {
    tag: "Cloud Partner",
    date: "June 2026",
    title: "Azure Databricks Integration",
    sum: "Deep native integration with Microsoft Azure: OneLake external locations, zero-copy federation for Azure Data Manager for Energy, and AI infrastructure.",
    bullets: [
      ["OneLake integration", "Register OneLake storage locations in Unity Catalog with zero duplication."],
      ["Zero-copy federation", "Federated analytics across Microsoft Fabric, Azure SQL, and Cosmos DB."],
      ["Azure OpenAI & Copilot", "Direct governance and routing for Azure OpenAI models via Unity AI Gateway."]
    ],
    stats: [
      ["First-party", "Microsoft native cloud service"],
      ["OneLake", "Zero-copy external location support"],
      ["30,000+", "DAIS participants leveraging Azure"],
      ["FedRAMP", "High compliance certification"]
    ],
    src: "https://azure.microsoft.com/en-us/products/databricks"
  },

  aws: {
    tag: "Cloud Partner",
    date: "June 2026",
    title: "AWS & Databricks Reference Architecture",
    sum: "Legend sponsor AWS combines Amazon Bedrock, AgentCore, and S3 with Databricks to operationalize AI at global scale.",
    bullets: [
      ["Amazon Bedrock integration", "Govern Bedrock foundational models and AgentCore runtimes through Unity AI Gateway."],
      ["Graviton4 instances", "Optimized price-performance for Apache Spark and Photon workloads on AWS Graviton."],
      ["PrivateLink & Security", "Zero-trust network architecture with AWS PrivateLink and customer-managed KMS encryption keys."]
    ],
    stats: [
      ["Legend", "Summit sponsorship tier"],
      ["30+", "AWS-led technical sessions and live labs"],
      ["$400", "AWS Marketplace promotion credit"],
      ["S3 Express", "One-zone ultra-low latency storage support"]
    ],
    src: "https://www.databricks.com/aws"
  }
};

// ── Renderer: Main DAIS 2026 Architecture Diagram ─────────
export function renderDaisArchitecture() {
  const container = document.createElement('div');
  container.className = 'dais-container';

  // Navigation Switcher between DAIS 2026 and Cloud Planes
  container.innerHTML = `
    <!-- Top View Switcher -->
    <div class="arch-view-nav" role="tablist">
      <button class="arch-view-tab active" id="subtab-dais" role="tab" aria-selected="true">
        <span style="color:var(--dais-lava)">●</span> Modern Databricks Stack (DAIS 2026)
      </button>
      <button class="arch-view-tab" id="subtab-planes" role="tab" aria-selected="false">
        <span>☁️</span> Cloud Architecture (Control vs Compute Planes)
      </button>
    </div>

    <!-- VIEW 1: DAIS 2026 MODERN DATABRICKS STACK -->
    <div id="view-dais-stack">
      <div class="dais-hero">
        <div class="dais-kicker">
          <span class="pulse-dot"></span>
          Copied from Data and AI Summit 2026
        </div>
      </div>

      <div class="pdwrap">
        <!-- Platform Header -->
        <div class="pdhead">
          <div class="db"><span class="dbsq"></span>databricks</div>
          <div class="sep"></div>
          <div class="dai">DATA<span class="plus">+</span>AI<small>PLATFORM</small></div>
          <div class="sep"></div>
          <div class="tag">Context<i>.</i> Control<i>.</i> Cost<i>.</i> Choice<i>.</i></div>
        </div>

        <!-- 5 Horizontal Architecture Swimlanes -->
        <div class="pdiagram">
          
          <!-- TIER 1: Agentic Apps -->
          <div class="player">
            <div class="lbl">Agentic Apps</div>
            <div class="pdrow">
              ${makeItem('apps', 'apps', 'Apps')}
              ${makeItem('lakewatch', 'watch', 'Lakewatch')}
              ${makeItem('agenticcdp', 'people', 'CustomerLake')}
            </div>
          </div>

          <!-- TIER 2: Agentic Work -->
          <div class="player work">
            <div class="lbl">Agentic Work</div>
            <div class="workcontent">
              <div class="pdrow worktop">
                <div class="pgroup genie">
                  ${makeItem('genie', 'genie', 'Genie')}
                  <div class="pills">
                    ${makePill('genieone', 'one', 'One')}
                    ${makePill('genieagents', 'genie', '+ Agents')}
                    ${makePill('geniecode', 'code', '<> Code')}
                    ${makePill('vibecoding', 'apps', 'App Builder')}
                    ${makePill('geniezeroops', 'ops', 'Zero Ops')}
                  </div>
                </div>
                <div class="pgroup">
                  ${makeItem('agentbricks', 'bricks', 'Agent Bricks')}
                  <div class="vsep"></div>
                  ${makeItem('omnigent', 'flower', 'Omnigent')}
                </div>
                <div class="lbl right">Agentic Development</div>
              </div>
              <div class="pontology">
                <span class="line"></span>
                ${makeItem('geniontology', 'lamp', 'Genie Ontology')}
                <span class="line"></span>
              </div>
            </div>
          </div>

          <!-- TIER 3: Unified Governance -->
          <div class="player">
            <div class="lbl">Unified Governance</div>
            <div class="pdrow">
              ${makeItem('unitycatalog', 'cog', 'Unity Catalog')}
              ${makeItem('aigateway', 'agent', 'Unity AI Gateway')}
            </div>
          </div>

          <!-- TIER 4: Agentic Data -->
          <div class="player">
            <div class="lbl">Agentic Data</div>
            <div class="pdrow">
              ${makeItem('lakeflow', 'flow', 'Lakeflow')}
              <div class="pgroup phi">
                ${makeItem('lakehouse', 'house', 'Lakehouse')}
                ${makeItem('ltap', 'layers', 'LTAP')}
                ${makeItem('lakehousert', 'flow', 'Lakehouse//RT')}
                ${makeItem('lakebase', 'db', 'Lakebase')}
              </div>
            </div>
          </div>

          <!-- TIER 5: Open Infrastructure -->
          <div class="player infra">
            <div class="lbl">Open Infrastructure</div>
            <div class="pdrow infra">
              <span class="infralabel">Open Format Data Lake</span>
              ${makeItem('deltalake', 'delta', 'Delta Lake', true)}
              ${makeItem('iceberg', 'iceberg', 'Iceberg', true)}
              <span class="infragap"></span>
              ${makeItem('anycloud', 'cloud', 'Any Cloud', true)}
              ${makeItem('anymodel', 'model', 'Any Model', true)}
              ${makeItem('anydata', 'layers', 'Any Data', true)}
            </div>
          </div>

        </div><!-- /pdiagram -->

        <!-- Additional Announcement Chips -->
        <div class="alsohead">Also announced at DAIS 2026 — click any to explore with live interactive simulation</div>
        <div class="xchips">
          ${makeChip('realtime_ml', 'AI Platform — Real-Time ML', true)}
          ${makeChip('opensharing', 'OpenSharing', true)}
          ${makeChip('secureconnect', 'SecureConnect', true)}
          ${makeChip('lakeflow', 'AI-First Data Engineering', true)}
          ${makeChip('lakewatch', 'Platform Security & Compliance', true)}
          ${makeChip('aibi_dashboards', 'AI/BI Dashboards', true)}
          ${makeChip('free_edition', 'Free Edition', false)}
          ${makeChip('marketplace', 'Databricks Marketplace', false)}
          ${makeChip('azure', 'Azure Databricks', false)}
          ${makeChip('aws', 'AWS Reference', false)}
        </div>
        <div class="hint-text">
          ⚡ 26 modules with verified architectural deep dives · Click any card, pill or chip to explore
        </div>
      </div>
    </div><!-- /view-dais-stack -->

    <!-- VIEW 2: CLOUD PLANES ARCHITECTURE -->
    <div id="view-cloud-planes" style="display:none;">
      <!-- Existing High-Level Control/Compute/Storage Plane will be attached here -->
      <div id="cloud-planes-content"></div>
    </div>

    <!-- INTERACTIVE DETAIL MODAL -->
    <div class="dais-modal-backdrop" id="dais-modal-backdrop">
      <div class="dais-modal" id="dais-modal-box">
        <div class="modal-header">
          <button class="modal-close-btn" id="modal-close" aria-label="Close modal">&times;</button>
          <div class="modal-badge-row">
            <span class="modal-tag" id="modal-tag">Tag</span>
            <span class="modal-date" id="modal-date">Date</span>
          </div>
          <h2 class="modal-title" id="modal-title">Module Title</h2>
          <p class="modal-summary" id="modal-sum">Executive summary of announcement</p>
        </div>
        <div class="modal-body">
          <!-- Live Simulation Container -->
          <div class="modal-sim-box" id="modal-sim-box"></div>
          
          <!-- Key stats 4-grid -->
          <div class="modal-stats-grid" id="modal-stats-grid"></div>

          <!-- Highlight Bullets -->
          <div class="modal-bullets" id="modal-bullets"></div>

          <!-- Footer with blog link -->
          <div class="modal-footer">
            <span style="color:var(--dais-ink3);font-size:12px;">Verified Data + AI Summit 2026 Announcement</span>
            <a href="#" target="_blank" rel="noopener noreferrer" class="modal-source-link" id="modal-link">
              Read announcement on Databricks blog ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  // Attach event handlers
  setupEvents(container);

  return container;
}

// ── HTML Helpers ───────────────────────────────────────────
function makeItem(modKey, iconKey, label, isSm = false) {
  const svg = SVGS[iconKey] || SVGS['databricks'];
  return `
    <div class="pditem${isSm ? ' sm' : ''}" data-mod="${modKey}" title="Explore ${label}">
      <span class="itile">${svg}</span>
      <span class="iname">${label}</span>
    </div>
  `;
}

function makePill(modKey, iconKey, label) {
  const svg = SVGS[iconKey] || SVGS['genie'];
  return `
    <span class="gpill" data-mod="${modKey}" title="Explore ${label}">
      <span class="d">${svg}</span>
      ${label}
    </span>
  `;
}

function makeChip(modKey, label, hasSim = false) {
  return `
    <span class="xchip" data-mod="${modKey}">
      ${label}
      ${hasSim ? '<span class="sim-badge">sim</span>' : ''}
    </span>
  `;
}

// ── Event Setup & Interactivity ────────────────────────────
function setupEvents(container) {
  // Tab switching between DAIS Stack and Cloud Planes
  const tabDais = container.querySelector('#subtab-dais');
  const tabPlanes = container.querySelector('#subtab-planes');
  const viewDais = container.querySelector('#view-dais-stack');
  const viewPlanes = container.querySelector('#view-cloud-planes');
  const planesContent = container.querySelector('#cloud-planes-content');

  // Populate cloud planes content from template
  setTimeout(() => {
    const template = document.getElementById('cloud-planes-template');
    if (template && planesContent && !planesContent.hasChildNodes()) {
      planesContent.innerHTML = template.innerHTML;
    }
  }, 50);

  tabDais.addEventListener('click', () => {
    tabDais.classList.add('active');
    tabDais.setAttribute('aria-selected', 'true');
    tabPlanes.classList.remove('active');
    tabPlanes.setAttribute('aria-selected', 'false');
    viewDais.style.display = 'block';
    viewPlanes.style.display = 'none';
  });

  tabPlanes.addEventListener('click', () => {
    const template = document.getElementById('cloud-planes-template');
    if (template && planesContent && !planesContent.hasChildNodes()) {
      planesContent.innerHTML = template.innerHTML;
    }
    tabPlanes.classList.add('active');
    tabPlanes.setAttribute('aria-selected', 'true');
    tabDais.classList.remove('active');
    tabDais.setAttribute('aria-selected', 'false');
    viewDais.style.display = 'none';
    viewPlanes.style.display = 'block';
  });

  // Card & Chip Clicks -> Open Modal
  container.querySelectorAll('[data-mod]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const modKey = el.dataset.mod;
      openDaisModal(modKey);
    });
  });

  // Modal Close Handlers
  const backdrop = container.querySelector('#dais-modal-backdrop');
  const closeBtn = container.querySelector('#modal-close');
  closeBtn.addEventListener('click', () => closeDaisModal());
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeDaisModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeDaisModal();
    }
  });
}

// ── Modal Controller ───────────────────────────────────────
export function openDaisModal(modKey) {
  const mod = DAIS_MODULES[modKey] || DAIS_MODULES['lakehouse'];
  const backdrop = document.getElementById('dais-modal-backdrop');
  if (!backdrop) return;

  // Fill text
  document.getElementById('modal-tag').textContent = mod.tag || 'Databricks Stack';
  document.getElementById('modal-date').textContent = mod.date || 'June 2026';
  document.getElementById('modal-title').textContent = mod.title;
  document.getElementById('modal-sum').textContent = mod.sum;
  document.getElementById('modal-link').href = mod.src || 'https://www.databricks.com';

  // Fill Stats Grid
  const statsBox = document.getElementById('modal-stats-grid');
  statsBox.innerHTML = (mod.stats || []).map(([val, lbl]) => `
    <div class="modal-stat-card">
      <div class="modal-stat-val">${val}</div>
      <div class="modal-stat-lbl">${lbl}</div>
    </div>
  `).join('');

  // Fill Bullets
  const bulletsBox = document.getElementById('modal-bullets');
  bulletsBox.innerHTML = (mod.bullets || []).map(([bold, text]) => `
    <div class="modal-bullet-item">
      <span class="bullet-dot"></span>
      <div><b>${bold}:</b> ${text}</div>
    </div>
  `).join('');

  // Render Live Simulation
  const simBox = document.getElementById('modal-sim-box');
  renderSimulation(simBox, mod.simType || 'lakehouse', mod);

  backdrop.classList.add('open');
}

export function closeDaisModal() {
  const backdrop = document.getElementById('dais-modal-backdrop');
  if (backdrop) backdrop.classList.remove('open');
}

// ── Live Simulations Engine ────────────────────────────────
function renderSimulation(container, simType, mod) {
  if (simType === 'lakehouse') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · One Governed Copy for Every Workload</div>
        <div class="sim-controls">
          <button class="sim-btn active" id="sim-cloud-aws">AWS</button>
          <button class="sim-btn" id="sim-cloud-azure">Azure</button>
          <button class="sim-btn" id="sim-cloud-gcp">GCP</button>
        </div>
      </div>
      <div class="lakehouse-flow">
        <!-- Sources -->
        <div class="flow-col">
          <div class="flow-node"><span class="pulse-flow-dot"></span> Raw Files (JSON, Parquet, CSV)</div>
          <div class="flow-node"><span class="pulse-flow-dot"></span> Streaming Events (Kafka / Kinesis)</div>
          <div class="flow-node"><span class="pulse-flow-dot"></span> Enterprise Databases (CDC / Relational)</div>
        </div>

        <!-- Central Hub -->
        <div class="flow-node hub">
          <span class="flow-badge-top">UNITY CATALOG GOVERNED</span>
          <h4>Open Lakehouse</h4>
          <small>Delta Lake UniForm + Apache Spark</small>
          <div style="font-size:11px;color:#9fb0c9;margin-top:6px;">Single copy in cloud object storage</div>
        </div>

        <!-- Workloads -->
        <div class="flow-col">
          <div class="flow-node" style="border-color:rgba(34,211,238,0.4)">
            <span style="color:#22d3ee">📊</span> SQL / BI & Dashboards
          </div>
          <div class="flow-node" style="border-color:rgba(52,211,153,0.4)">
            <span style="color:#34d399">⚙️</span> Data Engineering (ETL)
          </div>
          <div class="flow-node" style="border-color:rgba(251,191,36,0.4)">
            <span style="color:#fbbf24">⚡</span> Streaming Analytics
          </div>
          <div class="flow-node" style="border-color:rgba(244,114,182,0.4)">
            <span style="color:#f472b6">🤖</span> Machine Learning & GenAI
          </div>
        </div>
      </div>
      <div style="text-align:center;font-size:12px;color:var(--dais-ink3);margin-top:10px;">
        Zero copies, zero silos. Data is written once in open formats and fed concurrently to all analytical and operational engines.
      </div>
    `;

    // Interactive Cloud Toggle
    const btnAws = container.querySelector('#sim-cloud-aws');
    const btnAzure = container.querySelector('#sim-cloud-azure');
    const btnGcp = container.querySelector('#sim-cloud-gcp');
    [btnAws, btnAzure, btnGcp].forEach(btn => {
      btn.addEventListener('click', () => {
        [btnAws, btnAzure, btnGcp].forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  } else if (simType === 'ltap') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Real-Time HTAP Concurrency</div>
        <span style="font-size:11px;color:var(--dais-good);font-weight:700;">ACTIVE ENGINE: REYDEN</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <div style="background:#121a28;padding:12px;border-radius:10px;border:1px solid #22304a;">
            <div style="font-size:11px;color:var(--dais-ink3);text-transform:uppercase;">Transactional Ingestion</div>
            <div style="font-size:22px;font-weight:700;color:var(--dais-lava2);margin-top:4px;" id="ltap-tps">48,500 TPS</div>
            <div style="font-size:11px;color:#9fb0c9;margin-top:2px;">Zero ETL lag into Lakehouse</div>
          </div>
          <div style="background:#121a28;padding:12px;border-radius:10px;border:1px solid #22304a;">
            <div style="font-size:11px;color:var(--dais-ink3);text-transform:uppercase;">Concurrent Query Latency</div>
            <div style="font-size:22px;font-weight:700;color:var(--dais-cyan);margin-top:4px;" id="ltap-latency">14 ms</div>
            <div style="font-size:11px;color:#9fb0c9;margin-top:2px;">Serving 12,000+ QPS directly</div>
          </div>
        </div>
        <div style="display:flex;align-items:center;gap:12px;background:rgba(255,255,255,0.02);padding:8px 14px;border-radius:8px;">
          <span style="font-size:12px;color:var(--dais-ink2);min-width:110px;">Simulate Load:</span>
          <input type="range" id="ltap-slider" min="10" max="100" value="45" style="flex:1;accent-color:var(--dais-lava);">
          <span id="ltap-load-lbl" style="font-size:12px;font-weight:700;color:#fff;min-width:40px;">45%</span>
        </div>
      </div>
    `;

    const slider = container.querySelector('#ltap-slider');
    const tpsEl = container.querySelector('#ltap-tps');
    const latEl = container.querySelector('#ltap-latency');
    const loadEl = container.querySelector('#ltap-load-lbl');
    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value);
      loadEl.textContent = `${val}%`;
      tpsEl.textContent = `${Math.round(val * 1100).toLocaleString()} TPS`;
      latEl.textContent = `${Math.round(9 + (val * 0.45))} ms`;
    });
  } else if (simType === 'unitycatalog') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Multi-Cloud Unified Metastore</div>
      </div>
      <div style="background:#121a28;border:1px solid #22304a;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;line-height:1.6;color:#eef3fb;">
        <div style="color:var(--dais-amber);">-- 1. Single Universal Catalog Definition</div>
        <div>CREATE CATALOG <span style="color:#34d399">enterprise_lake</span>;</div>
        <div style="color:var(--dais-amber);margin-top:8px;">-- 2. Federated Cross-Cloud Locations</div>
        <div>GRANT SELECT ON CATALOG enterprise_lake TO <span style="color:#38bdf8">role_analysts</span>;</div>
        <div style="color:var(--dais-amber);margin-top:8px;">-- 3. Dynamic Column Masking & Row Filter</div>
        <div>ALTER TABLE enterprise_lake.sales.transactions ALTER COLUMN pii_ssn SET MASK mask_ssn();</div>
      </div>
      <div style="font-size:12px;color:var(--dais-ink3);margin-top:10px;text-align:center;">
        Unity Catalog governs files, tables, AI models, and vector indexes across AWS S3, Azure ADLS, and Google GCS.
      </div>
    `;
  } else if (simType === 'genie') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Natural Language to Governed SQL</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:10px;">
        <div style="background:#16202f;padding:10px 14px;border-radius:8px;font-size:13px;color:#fff;border-left:3px solid var(--dais-lava);">
          💬 <b>User prompt:</b> "What was our net retention rate by customer segment in Q2?"
        </div>
        <div style="background:#0b111a;padding:12px 14px;border-radius:8px;font-family:monospace;font-size:11.5px;color:#3ddc84;line-height:1.5;">
          SELECT segment, SUM(net_expansion) / SUM(start_arr) AS nrr<br>
          FROM enterprise_lake.finance.arr_history<br>
          WHERE quarter = '2026-Q2'<br>
          GROUP BY segment ORDER BY nrr DESC;
        </div>
        <div style="font-size:11.5px;color:var(--dais-ink3);text-align:center;">
          Grounded by Genie Ontology & governed by Unity Catalog row/column permissions.
        </div>
      </div>
    `;
  } else if (simType === 'deltalake') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · UniForm Zero-Copy Multi-Format Reader</div>
        <div class="sim-controls">
          <button class="sim-btn active" id="sim-fmt-delta">Delta Lake</button>
          <button class="sim-btn" id="sim-fmt-iceberg">Iceberg Metadata</button>
          <button class="sim-btn" id="sim-fmt-hudi">Hudi Metadata</button>
        </div>
      </div>
      <div style="background:#121a28;border:1px solid #22304a;border-radius:10px;padding:14px;">
        <div id="sim-fmt-display" style="font-family:monospace;font-size:12px;color:#eef3fb;line-height:1.6;">
          <div style="color:var(--dais-lava2);">// Physical Storage: Single Parquet File Set (Zero Duplication)</div>
          <div>s3://lakehouse-data/sales/part-00000.snappy.parquet (2.4 GB)</div>
          <div style="color:var(--dais-good);margin-top:6px;">// Delta Log Commit: _delta_log/00000000000000000042.json</div>
          <div>{"commitInfo":{"timestamp":1789420000,"operation":"MERGE","isolationLevel":"WriteSerializable"}}</div>
        </div>
      </div>
      <div style="font-size:11.5px;color:var(--dais-ink3);margin-top:8px;text-align:center;">
        UniForm generates Iceberg and Hudi metadata pointers on commit — zero data copying, 100% ACID.
      </div>
    `;

    const bDelta = container.querySelector('#sim-fmt-delta');
    const bIce = container.querySelector('#sim-fmt-iceberg');
    const bHudi = container.querySelector('#sim-fmt-hudi');
    const disp = container.querySelector('#sim-fmt-display');
    const setFmt = (btn, text) => {
      [bDelta, bIce, bHudi].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      disp.innerHTML = text;
    };
    bDelta.addEventListener('click', () => setFmt(bDelta, `
      <div style="color:var(--dais-lava2);">// Native Delta Lake Reader (Spark / Photon / SQL Warehouse)</div>
      <div>SELECT * FROM delta.\`s3://lakehouse-data/sales\` WHERE region = 'US-EAST';</div>
      <div style="color:var(--dais-good);margin-top:6px;">// Delta ACID Log: Multi-Version Concurrency (MVCC) Active</div>
      <div>Status: 100% ACID Serializable Snapshot read in 12ms via Photon vector engine</div>
    `));
    bIce.addEventListener('click', () => setFmt(bIce, `
      <div style="color:var(--dais-cyan);">// Apache Iceberg Reader (Snowflake / Trino / BigQuery)</div>
      <div>SELECT * FROM iceberg_catalog.sales WHERE region = 'US-EAST';</div>
      <div style="color:var(--dais-good);margin-top:6px;">// Iceberg Metadata Generated by UniForm:</div>
      <div>metadata/v42.metadata.json -> Points directly to shared Delta Parquet data! (0 bytes copied)</div>
    `));
    bHudi.addEventListener('click', () => setFmt(bHudi, `
      <div style="color:var(--dais-amber);">// Apache Hudi Reader (Legacy Analytics Systems)</div>
      <div>SELECT * FROM hudi_ro_table WHERE region = 'US-EAST';</div>
      <div style="color:var(--dais-good);margin-top:6px;">// Hudi .hoodie Commit Timeline:</div>
      <div>.hoodie/20260615120000.commit -> Referenced Parquet files shared with Delta Lake</div>
    `));
  } else if (simType === 'iceberg') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Unity Catalog Iceberg REST Catalog API</div>
      </div>
      <div style="background:#121a28;border:1px solid #22304a;border-radius:10px;padding:14px;font-family:monospace;font-size:12px;line-height:1.6;color:#eef3fb;">
        <div style="color:var(--dais-cyan);">GET /v1/catalogs/unity/namespaces/analytics/tables/customers</div>
        <div style="color:#94a3b8;margin-top:6px;">{</div>
        <div style="padding-left:14px;">"metadata-location": "s3://corp-lake/metadata/0001-iceberg.metadata.json",</div>
        <div style="padding-left:14px;">"format-version": 2,</div>
        <div style="padding-left:14px;color:var(--dais-good);">"table-governance": "Unity Catalog Enforced (Row Filters + Column Masking)"</div>
        <div style="color:#94a3b8;">}</div>
      </div>
      <div style="font-size:11.5px;color:var(--dais-ink3);margin-top:8px;text-align:center;">
        External query engines read Unity Catalog tables as native Apache Iceberg tables without credential vending risks.
      </div>
    `;
  } else if (simType === 'anycloud') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Multi-Cloud Unified Fabric</div>
        <div class="sim-controls">
          <button class="sim-btn active" id="sim-mc-all">All 3 Clouds</button>
          <button class="sim-btn" id="sim-mc-aws">AWS (us-east-1)</button>
          <button class="sim-btn" id="sim-mc-azure">Azure (eastus)</button>
          <button class="sim-btn" id="sim-mc-gcp">GCP (us-central1)</button>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        <div style="background:#141e2e;padding:12px;border-radius:8px;border:1px solid #243550;text-align:center;">
          <div style="font-size:12px;font-weight:700;color:#f59e0b;">AWS S3</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;">us-east-1</div>
          <div style="font-size:10px;color:#34d399;margin-top:6px;">● Active Replicas</div>
        </div>
        <div style="background:#141e2e;padding:12px;border-radius:8px;border:1px solid #243550;text-align:center;">
          <div style="font-size:12px;font-weight:700;color:#0ea5e9;">Azure ADLS Gen2</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;">eastus</div>
          <div style="font-size:10px;color:#34d399;margin-top:6px;">● Zero-Copy Mirror</div>
        </div>
        <div style="background:#141e2e;padding:12px;border-radius:8px;border:1px solid #243550;text-align:center;">
          <div style="font-size:12px;font-weight:700;color:#ec4899;">Google GCS</div>
          <div style="font-size:11px;color:#94a3b8;margin-top:4px;">us-central1</div>
          <div style="font-size:10px;color:#34d399;margin-top:6px;">● Federated Access</div>
        </div>
      </div>
      <div style="font-size:11.5px;color:var(--dais-ink3);margin-top:10px;text-align:center;">
        Single Unity Catalog metastore manages unified governance across AWS, Azure, and Google Cloud with 0 egress lock-in.
      </div>
    `;
  } else if (simType === 'anymodel') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Mosaic AI Gateway Model Router</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          <div style="background:#131c2a;border:1px solid #24344d;border-radius:8px;padding:10px;">
            <div style="font-size:11px;color:var(--dais-ink3);text-transform:uppercase;">Frontier API Models</div>
            <div style="font-size:13px;font-weight:700;color:#fff;margin-top:4px;">OpenAI GPT-4o · Claude 3.5 Sonnet</div>
            <div style="font-size:10px;color:var(--dais-good);margin-top:2px;">Rate-limited & spend capped at $5K/mo</div>
          </div>
          <div style="background:#131c2a;border:1px solid #24344d;border-radius:8px;padding:10px;">
            <div style="font-size:11px;color:var(--dais-ink3);text-transform:uppercase;">Open Weights & Custom</div>
            <div style="font-size:13px;font-weight:700;color:#fff;margin-top:4px;">Meta Llama 3 70B · DBRX · Custom</div>
            <div style="font-size:10px;color:var(--dais-cyan);margin-top:2px;">Private GPU serving inside customer VPC</div>
          </div>
        </div>
        <div style="background:#0c121b;padding:10px 12px;border-radius:8px;font-family:monospace;font-size:11px;color:#38bdf8;">
          mlflow.deployments.get_deploy_client("databricks").predict(endpoint="enterprise-router", inputs={"prompt": "..."})
        </div>
      </div>
    `;
  } else if (simType === 'anydata') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Multimodal Lakehouse Indexing</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;text-align:center;">
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;">
          <div style="font-size:16px;">📊</div>
          <div style="font-size:11px;font-weight:700;color:#fff;margin-top:4px;">Structured</div>
          <div style="font-size:10px;color:#94a3b8;">Delta Tables</div>
        </div>
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;">
          <div style="font-size:16px;">⚡</div>
          <div style="font-size:11px;font-weight:700;color:#fff;margin-top:4px;">Streaming</div>
          <div style="font-size:10px;color:#94a3b8;">Kafka & CDC</div>
        </div>
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;">
          <div style="font-size:16px;">📄</div>
          <div style="font-size:11px;font-weight:700;color:#fff;margin-top:4px;">Unstructured</div>
          <div style="font-size:10px;color:#94a3b8;">PDFs, Audio, Vid</div>
        </div>
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;">
          <div style="font-size:16px;">🧠</div>
          <div style="font-size:11px;font-weight:700;color:#fff;margin-top:4px;">Vectors</div>
          <div style="font-size:10px;color:#94a3b8;">Vector Search</div>
        </div>
      </div>
      <div style="font-size:11.5px;color:var(--dais-ink3);margin-top:10px;text-align:center;">
        Unity Catalog Volumes govern all unstructured files alongside structured Delta Lake tables.
      </div>
    `;
  } else if (simType === 'apps') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Databricks Apps Serverless Container Deployment</div>
      </div>
      <div style="background:#111927;border:1px solid #223249;border-radius:10px;padding:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;border-bottom:1px solid #1f2d42;padding-bottom:8px;">
          <span style="font-size:12px;font-weight:700;color:#fff;">🚀 Application: revenue-forecasting-app</span>
          <span style="font-size:10.5px;background:#065f46;color:#6ee7b7;padding:2px 8px;border-radius:12px;font-weight:600;">Status: Healthy (Serverless)</span>
        </div>
        <div style="font-family:monospace;font-size:11.5px;color:#94a3b8;line-height:1.6;">
          <div>App Framework: <span style="color:#fff;">Streamlit + Python 3.11</span></div>
          <div>Runtime: <span style="color:#38bdf8;">Micro-VM Serverless Container (Cold boot: 480ms)</span></div>
          <div>Authentication: <span style="color:#34d399;">Automatic Workspace SSO & Unity Catalog RBAC</span></div>
          <div>Data Connection: <span style="color:#fbbf24;">Serverless SQL Warehouse (Zero credentials in code)</span></div>
        </div>
      </div>
    `;
  } else if (simType === 'lakebase') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Lakebase Serverless Postgres + Bidirectional Delta Mirror</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
        <div style="background:#121a28;border:1px solid #22304a;border-radius:8px;padding:10px;font-family:monospace;font-size:11px;color:#e2e8f0;">
          <div style="color:var(--dais-lava2);font-weight:700;">-- Operational OLTP Write</div>
          <div>INSERT INTO lakebase.agent_memory</div>
          <div>(session_id, user_id, state)</div>
          <div>VALUES ('s_902', 'u_44', '{...}');</div>
          <div style="color:var(--dais-good);margin-top:4px;">-- Latency: 0.8ms (ACID committed)</div>
        </div>
        <div style="background:#121a28;border:1px solid #22304a;border-radius:8px;padding:10px;font-family:monospace;font-size:11px;color:#e2e8f0;">
          <div style="color:var(--dais-cyan);font-weight:700;">-- Zero-ETL Delta Lake Mirror</div>
          <div>SELECT * FROM delta.agent_memory</div>
          <div>WHERE session_id = 's_902';</div>
          <div style="color:var(--dais-good);margin-top:4px;">-- Sync lag: 0.0 sec (Real-time analytics ready)</div>
        </div>
      </div>
    `;
  } else if (simType === 'geniecode') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · Assistant Code Generation & 1-Click Error Diagnostics</div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;">
        <div style="background:#221518;border-left:3px solid #ef4444;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:11.5px;color:#fca5a5;">
          ❌ AnalysisException: Column 'revnue' not found in table 'orders'. Did you mean 'revenue'?
        </div>
        <div style="background:#0d1829;border-left:3px solid #38bdf8;padding:8px 12px;border-radius:6px;font-family:monospace;font-size:11.5px;color:#93c5fd;">
          💡 <b>Assistant Fix (1-Click applied):</b> Corrected typo 'revnue' -> 'revenue' and added Photon vectorized group-by optimization.
        </div>
      </div>
    `;
  } else if (simType === 'secureconnect') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · SecureConnect Private Zero-Trust Tunnel</div>
      </div>
      <div style="background:#121a28;border:1px solid #22304a;border-radius:10px;padding:12px;font-family:monospace;font-size:11.5px;color:#eef3fb;line-height:1.6;">
        <div>[Databricks Serverless Compute] ──── <span style="color:#34d399">PrivateLink / mTLS Tunnel</span> ──── [On-Prem Enterprise Oracle]</div>
        <div style="color:#94a3b8;margin-top:6px;">• Public Internet Transit: <span style="color:#ef4444;">BLOCKED (0 public IP footprint)</span></div>
        <div style="color:#94a3b8;">• Network Path: <span style="color:#34d399;">Direct VPC Peering & Customer Private Subnet</span></div>
      </div>
    `;
  } else if (simType === 'aibi_dashboards') {
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Live Simulation · AI/BI Interactive Dashboard Metrics</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px;">
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;color:#94a3b8;">TOTAL LAKEHOUSE DATA</div>
          <div style="font-size:18px;font-weight:700;color:#38bdf8;margin-top:2px;">14.2 PB</div>
        </div>
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;color:#94a3b8;">QUERIES / DAY</div>
          <div style="font-size:18px;font-weight:700;color:#34d399;margin-top:2px;">2.8M</div>
        </div>
        <div style="background:#131c2a;border:1px solid #24344d;padding:10px;border-radius:8px;text-align:center;">
          <div style="font-size:10.5px;color:#94a3b8;">GENIE Q&A ACCURACY</div>
          <div style="font-size:18px;font-weight:700;color:#f59e0b;margin-top:2px;">99.4%</div>
        </div>
      </div>
    `;
  } else {
    // Default interactive stats visual
    container.innerHTML = `
      <div class="sim-header">
        <div class="sim-label">⚡ Interactive Architecture Snapshot · ${mod.title}</div>
      </div>
      <p style="font-size:13.5px;color:var(--dais-ink2);line-height:1.6;margin:0;">
        ${mod.sum}
      </p>
    `;
  }
}
