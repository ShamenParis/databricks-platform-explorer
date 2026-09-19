# Databricks Data Intelligence Platform Explorer

An interactive, visual architecture explorer for the **Databricks Data Intelligence Platform**, the **Data + AI Summit (DAIS) 2026** reference stack, and an in-depth **Spark & Serverless Compute Simulator**.

🚀 **Live GitHub Pages URL**: [https://shamenparis.github.io/databricks-platform-explorer/](https://shamenparis.github.io/databricks-platform-explorer/)

---

## 🌟 Key Features

### 1. 2D Interactive Architecture Matrix (Default View)
- **Zero Occlusion & Distortion**: Clean, responsive swimlane architecture grouping all 44 canonical components across the 5 platform layers.
- **Guided Data Journeys**:
  - `▶ From Source to Dashboard` (7-step end-to-end trace)
  - `▶ Build a Generative AI Application` (6-step Agentic RAG flow)
  - `▶ Real-Time Streaming & LTAP` (5-step low-latency analytics trace)
- **High-Fidelity Vector Icons**: Self-contained inline SVGs with zero external CDN dependencies or broken boxes.
- **Bi-Directional Sidebar Sync**: Clicking any component or layer in the navigation sidebar highlights and smooth-scrolls directly to it.

### 2. 3D Layer Stack (Stepped Amphitheater)
- **Stepped Z-Cascade**: Solves 3D occlusion by cascading layers in an amphitheater layout (`Layer 01 Storage` steps forward, `Layer 05 Apps` steps back).
- **Quick-Jump Layer Elevator**: Floating toolbar (`[05 Apps] [04 AI/ML] [03 SQL] [02 Ingestion] [01 Storage] [Reset]`) that glides camera focus smoothly to any tier.
- **High-Definition Tile Textures**: 512x400 custom canvas pedestals featuring glowing emblem badges (`128x128`), bold typography, neon halos, and category pills (`★ OPEN SOURCE` / `DATABRICKS NATIVE`).
- **Interactive Controls**: Smooth vertical wheel panning, stack separation slider, and hover tooltips.

### 3. Modern Databricks Architecture (DAIS 2026)
- **Copied from Data and AI Summit 2026**: Interactive architecture diagram covering:
  - *Agentic Apps*: Databricks Apps, Lakewatch, CustomerLake
  - *Agentic Work*: Genie, + Agents, App Builder, Agent Bricks, Omnigent, Genie Ontology
  - *Unified Governance*: Unity Catalog, Unity AI Gateway
  - *Agentic Data*: Lakeflow, Lakehouse, LTAP, Lakebase
  - *Open Infrastructure*: Delta Lake, Apache Iceberg (UniForm)
- **Control vs Compute Plane Architecture**: AWS, Azure, and GCP enterprise multi-cloud deployment models.

### 4. Official Reference Patterns
Directly aligned with the **Databricks Architecture Center**:
- **Generative AI & Agentic RAG**: Vector Search, Model Serving, Unity Catalog Volumes
- **Lakehouse ETL Modernization**: Lakeflow Pipelines (DLT) & Lakeflow Connect CDC
- **Multi-Cloud Lakehouse Architecture**: Centralized Unity Catalog control plane over AWS/Azure/GCP compute planes
- **Real-Time Streaming & LTAP**: Structured Streaming + Delta Lake + Hybrid Transactional/Analytical Processing
- **Medallion Architecture**: Bronze → Silver → Gold pipeline

### 5. Spark & Serverless Compute Simulator
A high-fidelity, interactive Spark physics engine and Databricks execution simulator that models cluster topology, memory pressure, and stage DAG execution:
- **Comprehensive Compute Modeling**:
  - **Classic Static Clusters**: User-selected worker counts and instance families (General Purpose, Memory Optimized, Compute Optimized, Storage Optimized) with custom garbage collector selection (G1GC / ParallelGC).
  - **Autoscale Clusters**: Elastic workload simulation factoring in Databricks dynamic worker scaling between minimum and maximum bounds.
  - **Databricks Serverless Compute**: Accurate containerized architecture (4 vCPU / 16 GB managed container units), instant-on scale-to-zero, Databricks-managed G1GC, and isolated query execution.
- **Smart Control Visibility**:
  - Context-aware UI that automatically collapses cluster-level parameters (worker node slider, VM specs, GC selector) when **Serverless** mode is engaged.
  - Inline operational notices detailing the behavioral differences between managed Serverless container pools and Classic VM clusters.
- **Interactive Physics Engine & Bottlenecks**:
  - **Unified Memory Model**: Real-time breakdown of Spark Driver and Executor memory across Execution Memory, Storage Memory, User Memory, 300 MB Reserved Memory, and Off-Heap headroom.
  - **Realistic Bottlenecks**: Accurate modeling of CPU core saturation, network shuffle data transfer, NVMe disk spill degradation (150 MB/s), and GC pause latency.
  - **Photon Vector Engine**: Simulates the 3.5x C++ vectorized query engine speedup on Databricks Runtime.
  - **Adaptive Query Execution (AQE)**: Models dynamic partition coalescing and skew join resolution.
- **Fluid Vector Flow Visualization**:
  - Clean, high-performance SVG vector conduits with traveling particle pulses showing live execution dynamics without awkward directional arrows:
    - ⚡ **Cyan**: Task scheduling & driver-to-executor dispatch
    - 🔀 **Purple**: Shuffle exchange across cluster nodes
    - 🔥 **Lava**: NVMe disk and memory spill channels
    - 🟢 **Emerald**: Serverless containerized micro-scheduling
- **Industry-Accurate Prescriptive Advisor**:
  - Generates ready-to-run Databricks and PySpark configuration snippets based on active workload metrics:
    - *Spill Remediation*: Recommends AQE target partition sizing (`spark.sql.adaptive.advisoryPartitionSizeInBytes`) and memory upscaling.
    - *Data Skew Mitigation*: Code for AQE skew join optimization (`spark.sql.adaptive.skewJoin.enabled`, `skewedPartitionFactor`, `skewedPartitionThresholdInBytes`).
    - *File Scan Optimization*: Evaluates file load workloads and projects task parallelism gains with `spark.sql.files.maxPartitionBytes`.
    - *Photon Engine Selection*: Explains DBR Photon cluster-level runtime selection (rather than invalid runtime configs).
    - *Delta Lake Liquid Clustering*: Generates modern `CLUSTER BY` syntax for DBR 13.3+ / Delta 3.1+ tables.
    - *Serverless Boundaries*: Explicitly delineates allowed session/query configs from restricted cluster/JVM flags.
- **Real-Time Telemetry & Economics**:
  - Live cost tracking reflecting production 2024 Databricks DBU rates ($0.22/DBU Serverless Jobs vs. $0.55/DBU Classic All-Purpose + VM hourly rates), compute core-hours, memory saturation percentage, and total execution time.

---

## 🛠️ Technology Stack
- **Pure Static Web App**: 100% client-side HTML5, Vanilla CSS3 (Custom design system & glassmorphism), and Vanilla ES Modules.
- **Three.js**: WebGL 3D rendering with ACESFilmic tone mapping, soft shadows, and custom canvas textures.
- **Interactive SVG Vector Engine**: Dynamic SVG flow conduits with synchronized CSS keyframe particle pulses for realistic cluster telemetry.
- **Spark Physics Simulation Engine**: Mathematical modeling of Apache Spark 3.5+ and Databricks Runtime 15.x scheduling, memory management, and AQE heuristics.
- **Zero Build Step Required**: Works natively on any static host, GitHub Pages, or local web server.
