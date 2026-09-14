# Databricks Data Intelligence Platform Explorer

An interactive, visual architecture explorer for the **Databricks Data Intelligence Platform** and the **Data + AI Summit (DAIS) 2026** reference stack.

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

---

## 🛠️ Technology Stack
- **Pure Static Web App**: 100% client-side HTML5, Vanilla CSS3 (Custom design system & glassmorphism), and Vanilla ES Modules.
- **Three.js**: WebGL 3D rendering with ACESFilmic tone mapping, soft shadows, and custom canvas textures.
- **Zero Build Step Required**: Works natively on any static host, GitHub Pages, or local web server.

---

## 🌐 Deploying to GitHub Pages

1. Go to your repository on GitHub: `https://github.com/ShamenParis/databricks-platform-explorer`
2. Click **Settings** (gear icon) in the top tabs.
3. In the left navigation menu, click **Pages**.
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`
   - **Branch**: Select `main` and folder `/ (root)`
5. Click **Save**.
6. Within 1–2 minutes, your live site will be published at:
   👉 **`https://shamenparis.github.io/databricks-platform-explorer/`**
