/**
 * DATABRICKS PLATFORM EXPLORER — Spark & Serverless Compute Simulator
 * 
 * Interactive cluster physics engine:
 * - Driver & Executor topology distribution
 * - Memory model (Execution, Storage, User, Reserved, Off-Heap)
 * - Disk Spilling physics (Memory Spill vs Disk Spill)
 * - JVM Garbage Collection overhead (G1GC vs ParallelGC vs Photon off-heap)
 * - Autoscaling vs Serverless instant orchestration
 * - Rich animated SVG flow arrows and streaming particle packets
 * - Prescriptive Spark Config Advisor & Best Practices
 */

export function renderSparkSimulator() {
  const container = document.createElement('div');
  container.className = 'sim-container';
  container.id = 'spark-sim-root';

  // Initial State
  const state = {
    dataSizeGB: 2000,           // 2 TB default
    workload: 'aggregation',    // aggregation, join, etl, streaming
    clusterMode: 'classic_static', // classic_static, classic_autoscale, serverless
    workerCount: 8,             // 8 worker nodes
    workerCores: 8,             // 8 cores per node = 64 cores
    workerRAM: 32,              // 32 GB RAM per node
    partitions: 200,            // default 200 shuffle partitions
    aqeEnabled: false,          // Adaptive Query Execution
    photonEnabled: false,       // Databricks Photon Vectorized Engine
    dataSkew: 'none',           // none, moderate, severe
    gcMode: 'g1gc',             // g1gc, parallel
    activePreset: 'disaster200' // current preset
  };

  // Build the complete Simulator UI
  container.innerHTML = `
    <!-- Hero Header -->
    <div class="sim-hero">
      <div class="sim-kicker">
        <span class="pulse-dot"></span>
        Interactive Compute & Spark Physics Engine
      </div>
      <h1>Apache Spark & Serverless Compute Simulator</h1>
      <p>
        Understand how distributed Spark clusters execute multi-terabyte queries, manage JVM memory,
        spill to disk, trigger garbage collection pauses, and scale dynamically — with real-time animated data flows.
      </p>
    </div>

    <!-- Quick Scenario Presets -->
    <div class="sim-presets-bar">
      <span class="sim-presets-label">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        Scenario Presets:
      </span>
      <div class="sim-presets-list" id="sim-presets-list">
        <button class="sim-preset-btn active" data-preset="disaster200">
          <span>⚠️</span> Default 200 Partitions Spill
        </button>
        <button class="sim-preset-btn" data-preset="aqe_rescue">
          <span>🚀</span> AQE Auto-Tuning Rescue
        </button>
        <button class="sim-preset-btn" data-preset="data_skew">
          <span>🔥</span> Severe Data Skew Straggler
        </button>
        <button class="sim-preset-btn" data-preset="serverless_burst">
          <span>⚡</span> Databricks Serverless Instant Burst
        </button>
        <button class="sim-preset-btn" data-preset="photon_speed">
          <span>💎</span> Photon Vectorized Engine
        </button>
      </div>
    </div>

    <!-- Main Simulator Grid: Control Deck on Left, Visuals on Right -->
    <div class="sim-grid">

      <!-- LEFT: Interactive Control Deck -->
      <aside class="sim-controls-card">
        <div class="sim-section-title">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
          Workload & Data Size
        </div>

        <!-- Data Size Slider -->
        <div class="sim-ctrl-group">
          <div class="sim-ctrl-label">
            <span>Input Dataset Volume</span>
            <span class="sim-ctrl-val" id="val-data-size">2,000 GB (2.0 TB)</span>
          </div>
          <input type="range" class="sim-slider" id="ctrl-data-size" min="10" max="20000" step="10" value="2000">
        </div>

        <!-- Workload Type -->
        <div class="sim-ctrl-group">
          <div class="sim-ctrl-label"><span>Query / Operation Type</span></div>
          <select class="sim-select" id="ctrl-workload">
            <option value="aggregation" selected>Heavy GroupBy & Aggregation (Shuffle)</option>
            <option value="join">Large Table Sort-Merge Join (Heavy Network)</option>
            <option value="etl">Data Lake Ingestion & Bronze/Silver ETL</option>
            <option value="streaming">Low-Latency Delta Live Tables (Streaming)</option>
          </select>
        </div>

        <!-- Data Skew -->
        <div class="sim-ctrl-group">
          <div class="sim-ctrl-label"><span>Key Distribution & Skew</span></div>
          <select class="sim-select" id="ctrl-skew">
            <option value="none" selected>Uniform Distribution (No Skew)</option>
            <option value="moderate">Moderate Skew (Top 10% keys hold 45% data)</option>
            <option value="severe">Severe Skew (1 Hot Key holds 65% data)</option>
          </select>
        </div>

        <div class="sim-section-title" style="margin-top:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
          Compute Architecture
        </div>

        <!-- Compute Mode -->
        <div class="sim-ctrl-group">
          <div class="sim-ctrl-label"><span>Cluster Orchestration</span></div>
          <div class="sim-segmented">
            <button class="sim-seg-btn active" data-mode="classic_static">Classic Static</button>
            <button class="sim-seg-btn" data-mode="classic_autoscale">Autoscale</button>
            <button class="sim-seg-btn serverless" data-mode="serverless">Serverless ⚡</button>
          </div>
        </div>

        <!-- Worker Count Slider -->
        <div class="sim-ctrl-group" id="group-workers">
          <div class="sim-ctrl-label">
            <span>Worker Nodes</span>
            <span class="sim-ctrl-val" id="val-workers">8 Workers (64 Cores)</span>
          </div>
          <input type="range" class="sim-slider" id="ctrl-workers" min="2" max="32" step="2" value="8">
        </div>

        <!-- Worker VM Sizing -->
        <div class="sim-ctrl-group">
          <div class="sim-ctrl-label"><span>Worker VM Spec (per Node)</span></div>
          <select class="sim-select" id="ctrl-vm-spec">
            <option value="4_16">Standard: 4 vCPU · 16 GB RAM</option>
            <option value="8_32" selected>General Purpose: 8 vCPU · 32 GB RAM</option>
            <option value="16_64">Memory Optimized: 16 vCPU · 64 GB RAM</option>
            <option value="32_128">Heavy Compute: 32 vCPU · 128 GB RAM</option>
          </select>
        </div>

        <!-- Shuffle Partitions Slider -->
        <div class="sim-ctrl-group">
          <div class="sim-ctrl-label">
            <span>spark.sql.shuffle.partitions</span>
            <span class="sim-ctrl-val" id="val-partitions">200</span>
          </div>
          <input type="range" class="sim-slider" id="ctrl-partitions" min="10" max="4000" step="10" value="200">
        </div>

        <div class="sim-section-title" style="margin-top:8px;">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          Engine & Optimizations
        </div>

        <!-- Toggles -->
        <div class="sim-toggle-row">
          <div class="sim-toggle-info">
            <span class="sim-toggle-title">Adaptive Query Execution (AQE)</span>
            <span class="sim-toggle-sub">Auto-coalesce & auto-skew mitigation</span>
          </div>
          <label class="sim-switch">
            <input type="checkbox" id="toggle-aqe">
            <span class="sim-slider-switch"></span>
          </label>
        </div>

        <div class="sim-toggle-row">
          <div class="sim-toggle-info">
            <span class="sim-toggle-title">Photon Engine Acceleration</span>
            <span class="sim-toggle-sub">C++ native vectorized execution</span>
          </div>
          <label class="sim-switch">
            <input type="checkbox" id="toggle-photon">
            <span class="sim-slider-switch"></span>
          </label>
        </div>

        <div class="sim-toggle-row">
          <div class="sim-toggle-info">
            <span class="sim-toggle-title">JVM Garbage Collector</span>
            <span class="sim-toggle-sub">G1GC vs Legacy ParallelGC</span>
          </div>
          <select class="sim-select" id="ctrl-gc" style="width:110px;padding:4px 8px;font-size:11px;">
            <option value="g1gc" selected>G1GC (Low Pause)</option>
            <option value="parallel">ParallelGC (High Pause)</option>
          </select>
        </div>

      </aside>

      <!-- RIGHT: Visual Simulation Canvas & Live Analytics -->
      <main class="sim-visual-deck">

        <!-- 1. Live KPI Metrics Bar -->
        <div class="sim-metrics-grid">
          <div class="sim-metric-card">
            <div class="sim-metric-top">
              <span class="sim-metric-lbl">Estimated Job Runtime</span>
              <span class="sim-metric-badge sim-badge-danger" id="badge-runtime">SLOW</span>
            </div>
            <span class="sim-metric-val" id="metric-runtime">38.4 min</span>
            <span class="sim-metric-sub" id="metric-runtime-sub">Heavy disk spill bottlenecks</span>
          </div>
          <div class="sim-metric-card">
            <div class="sim-metric-top">
              <span class="sim-metric-lbl">Total Disk Spilling</span>
              <span class="sim-metric-badge sim-badge-danger" id="badge-spill">SPILL CRITICAL</span>
            </div>
            <span class="sim-metric-val" id="metric-spill" style="color:var(--sim-lava);">760 GB</span>
            <span class="sim-metric-sub" id="metric-spill-sub">Mem: 1,840 GB · Disk: 760 GB</span>
          </div>
          <div class="sim-metric-card">
            <div class="sim-metric-top">
              <span class="sim-metric-lbl">JVM GC Pause Time</span>
              <span class="sim-metric-badge sim-badge-warn" id="badge-gc">HIGH GC</span>
            </div>
            <span class="sim-metric-val" id="metric-gc">18.5%</span>
            <span class="sim-metric-sub" id="metric-gc-sub">Stop-the-world pauses: 7.1m</span>
          </div>
          <div class="sim-metric-card">
            <div class="sim-metric-top">
              <span class="sim-metric-lbl">Estimated Cost & DBUs</span>
              <span class="sim-metric-badge sim-badge-warn" id="badge-cost">UNOPTIMIZED</span>
            </div>
            <span class="sim-metric-val" id="metric-cost">$42.80</span>
            <span class="sim-metric-sub" id="metric-dbu">64.0 DBUs consumed</span>
          </div>
        </div>

        <!-- 2. Interactive Animated Cluster & Flow Topology Board -->
        <div class="sim-topology-board" id="sim-topology-board">
          <div class="sim-board-header">
            <div class="sim-board-title">
              <span style="color:var(--sim-cyan);">●</span>
              Live Cluster Topology & Streaming Flow
            </div>
            <span class="sim-board-badge sim-badge-good" id="cluster-mode-badge">
              Classic Dedicated · 8 Nodes Active
            </span>
          </div>

          <!-- Dynamic SVG Canvas for Animated Flow Lines & Particles -->
          <svg class="sim-flow-svg-overlay" id="sim-flow-svg" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-cyan" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.9"/>
              </linearGradient>
              <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#34d399" stop-opacity="0.9"/>
              </linearGradient>
              <linearGradient id="grad-purple" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#a855f7" stop-opacity="0.9"/>
                <stop offset="100%" stop-color="#c084fc" stop-opacity="0.9"/>
              </linearGradient>
              <linearGradient id="grad-spill" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff3621"/>
                <stop offset="100%" stop-color="#ff8c00"/>
              </linearGradient>

              <!-- Neon Glow Filters -->
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <filter id="glow-lava" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="3.5" result="blur"/>
                <feMerge>
                  <feMergeNode in="blur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>

              <!-- Arrowhead Markers -->
              <marker id="arrow-cyan" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#00d2ff"/>
              </marker>
              <marker id="arrow-green" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#10b981"/>
              </marker>
              <marker id="arrow-purple" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#c084fc"/>
              </marker>
              <marker id="arrow-lava" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#ff3621"/>
              </marker>
            </defs>
            <g id="flow-paths-layer"></g>
            <g id="flow-particles-layer"></g>
            <g id="flow-labels-layer"></g>
          </svg>

          <!-- Diagram Elements (Driver, Workers, Disk Spill Target) -->
          <div class="sim-topology-layout">

            <!-- Col 1: Driver Node -->
            <div class="sim-node-box driver" id="driver-box">
              <div class="sim-node-header">
                <span class="sim-node-title">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Driver Node
                </span>
                <span class="sim-component-pill">COORDINATOR</span>
              </div>
              <div class="sim-driver-modules">
                <div class="sim-module-item">
                  <span class="sim-module-name">Catalyst Optimizer</span>
                  <span class="sim-module-status">READY</span>
                </div>
                <div class="sim-module-item">
                  <span class="sim-module-name">DAG Scheduler</span>
                  <span class="sim-module-status" id="driver-stages-active">2 Stages</span>
                </div>
                <div class="sim-module-item">
                  <span class="sim-module-name">Task Scheduler</span>
                  <span class="sim-module-status" id="driver-tasks-total">200 Tasks</span>
                </div>
                <div class="sim-module-item">
                  <span class="sim-module-name">BlockManagerMaster</span>
                  <span class="sim-module-status">TRACKING</span>
                </div>
              </div>
            </div>

            <!-- Col 2: Executors & Worker Nodes -->
            <div class="sim-workers-area">
              <div class="sim-workers-header">
                <span>ACTIVE EXECUTORS (<span id="count-executors-label">8</span> Nodes · <span id="count-cores-label">64</span> Core Slots)</span>
                <span id="cluster-autoscale-status" style="color:var(--sim-cyan);">Fixed Allocation</span>
              </div>
              <div class="sim-workers-grid" id="sim-workers-grid">
                <!-- Dynamically generated executor cards -->
              </div>
            </div>

            <!-- Col 3: Spilling Storage / Local NVMe Disks -->
            <div class="sim-spill-box" id="spill-box">
              <div class="sim-node-header">
                <span class="sim-node-title" style="color:var(--sim-lava);">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  Local NVMe Spill
                </span>
              </div>
              <div class="sim-disk-target" id="disk-target">
                <span class="sim-disk-icon">💾</span>
                <span class="sim-disk-label">Scratch SSD Storage</span>
                <div class="sim-spill-meter" id="spill-meter-display">760 GB</div>
                <span style="font-size:9.5px;color:var(--sim-text-muted);" id="spill-status-sub">High I/O Degradation (10x Slower)</span>
              </div>
              <div class="sim-module-item" style="border-color:rgba(255,255,255,0.08);">
                <span class="sim-module-name">Remote Shuffle Service</span>
                <span class="sim-module-status" id="shuffle-service-status" style="color:var(--sim-green);">STANDBY</span>
              </div>
            </div>

          </div>
        </div>

        <!-- 3. Executor JVM Memory Breakdown Model (Visual Stack) -->
        <div class="sim-memory-model-box">
          <div class="sim-mem-header">
            <span class="sim-mem-title">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>
              Executor Memory Model Breakdown (Single Node JVM Heap & Off-Heap)
            </span>
            <span style="font-size:12px;color:var(--sim-cyan);font-weight:700;" id="mem-per-task-label">
              Available per Task: 1.15 GB
            </span>
          </div>

          <!-- Stacked Bar Gauge -->
          <div class="sim-stacked-mem-bar" id="sim-stacked-mem-bar">
            <!-- Dynamically calculated percentage bars -->
          </div>

          <!-- Legend -->
          <div class="sim-mem-legend">
            <div class="sim-mleg-item">
              <span class="sim-mleg-dot" style="background:#334155;"></span>
              <span>Reserved (300 MB)</span>
            </div>
            <div class="sim-mleg-item">
              <span class="sim-mleg-dot" style="background:#475569;"></span>
              <span id="leg-user-mem">User Memory (11.8 GB)</span>
            </div>
            <div class="sim-mleg-item">
              <span class="sim-mleg-dot" style="background:#7c3aed;"></span>
              <span id="leg-storage-mem">Storage (Cache) (8.9 GB)</span>
            </div>
            <div class="sim-mleg-item">
              <span class="sim-mleg-dot" style="background:#0284c7;"></span>
              <span id="leg-exec-mem">Execution (Shuffle/Sort) (8.9 GB)</span>
            </div>
            <div class="sim-mleg-item">
              <span class="sim-mleg-dot" style="background:var(--sim-lava);"></span>
              <span id="leg-spill-mem">Spill to Disk Overrun</span>
            </div>
            <div class="sim-mleg-item">
              <span class="sim-mleg-dot" style="background:#0d9488;"></span>
              <span id="leg-photon-mem">Photon Off-Heap / Native</span>
            </div>
          </div>
        </div>

        <!-- 4. Spark DAG Stages & Tasks Pipeline (Mini-Spark UI) -->
        <div class="sim-stages-box">
          <div class="sim-stages-header">
            <span class="sim-mem-title">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
              Execution DAG: Stages, Partitions & Straggler Detection
            </span>
            <span style="font-size:11.5px;color:var(--sim-text-muted);" id="stage-meta-info">
              Wide Transformation (Shuffle Boundary)
            </span>
          </div>

          <div class="sim-stage-flow" id="sim-stage-flow">
            <!-- Stage 0: Scan & Map -->
            <div class="sim-stage-node active">
              <div class="sim-stage-top">
                <span class="sim-stage-id">Stage 0</span>
                <span class="sim-component-pill" style="color:var(--sim-green);">COMPLETED</span>
              </div>
              <div class="sim-stage-name">Scan Delta Lake & Filter</div>
              <div class="sim-stage-meta">
                <span>Tasks: <b id="stage0-tasks">2,000</b></span>
                <span>Shuffle Write: <b id="stage0-write">2,000 GB</b></span>
              </div>
              <div class="sim-stage-progress">
                <div class="sim-stage-prog-fill" style="width:100%;"></div>
              </div>
            </div>

            <!-- Flow Arrow 1: Shuffle Boundary Connector -->
            <div class="sim-stage-connector" id="stage-conn-0-1">
              <div class="sim-connector-line">
                <span class="sim-chevron sim-ch-1">›</span>
                <span class="sim-chevron sim-ch-2">›</span>
                <span class="sim-chevron sim-ch-3">›</span>
              </div>
              <span class="sim-connector-label">Shuffle Write ➔ Read</span>
            </div>

            <!-- Stage 1: Shuffle & Exchange -->
            <div class="sim-stage-node shuffle-boundary active" id="stage1-box">
              <div class="sim-stage-top">
                <span class="sim-stage-id">Stage 1</span>
                <span class="sim-component-pill" id="stage1-pill" style="color:var(--sim-orange);">RUNNING</span>
              </div>
              <div class="sim-stage-name">Exchange & GroupBy Aggregation</div>
              <div class="sim-stage-meta">
                <span>Shuffle Partitions: <b id="stage1-parts">200</b></span>
                <span>Spill: <b id="stage1-spill" style="color:var(--sim-lava);">760 GB</b></span>
              </div>
              <div class="sim-stage-progress">
                <div class="sim-stage-prog-fill" id="stage1-progress" style="width:68%;"></div>
              </div>
            </div>

            <!-- Flow Arrow 2: Pipeline Result Connector -->
            <div class="sim-stage-connector" id="stage-conn-1-2">
              <div class="sim-connector-line">
                <span class="sim-chevron sim-ch-1">›</span>
                <span class="sim-chevron sim-ch-2">›</span>
                <span class="sim-chevron sim-ch-3">›</span>
              </div>
              <span class="sim-connector-label">Pipeline Result ➔</span>
            </div>

            <!-- Stage 2: Output / Action -->
            <div class="sim-stage-node">
              <div class="sim-stage-top">
                <span class="sim-stage-id">Stage 2</span>
                <span class="sim-component-pill">QUEUED</span>
              </div>
              <div class="sim-stage-name">Result Aggregation & Write</div>
              <div class="sim-stage-meta">
                <span>Partitions: <b>1</b></span>
                <span>Duration: <b>~2.4s</b></span>
              </div>
              <div class="sim-stage-progress">
                <div class="sim-stage-prog-fill" style="width:0%;"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 5. Prescriptive Best Practices & Config Advisor -->
        <div class="sim-advisor-box">
          <div class="sim-advisor-header">
            <div class="sim-advisor-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              Prescriptive Optimization Advisor & Recommended Spark Configs
            </div>
            <span style="font-size:12px;color:var(--sim-cyan);">Tailored to your current simulated workload</span>
          </div>

          <div class="sim-recommendations-list" id="sim-recommendations-list">
            <!-- Dynamically populated best practices -->
          </div>
        </div>

      </main>
    </div>
  `;

  // Attach interactive events and start simulation loop
  setTimeout(() => {
    initSimulatorLogic(container, state);
  }, 0);

  return container;
}

// ── Physics Calculation & Interactive Logic ──────────────────
function initSimulatorLogic(container, state) {

  // DOM Elements
  const dataSlider = container.querySelector('#ctrl-data-size');
  const dataVal = container.querySelector('#val-data-size');
  const workloadSel = container.querySelector('#ctrl-workload');
  const skewSel = container.querySelector('#ctrl-skew');
  const workersSlider = container.querySelector('#ctrl-workers');
  const workersVal = container.querySelector('#val-workers');
  const vmSpecSel = container.querySelector('#ctrl-vm-spec');
  const partitionsSlider = container.querySelector('#ctrl-partitions');
  const partitionsVal = container.querySelector('#val-partitions');
  const toggleAqe = container.querySelector('#toggle-aqe');
  const togglePhoton = container.querySelector('#toggle-photon');
  const gcSel = container.querySelector('#ctrl-gc');

  // Seg Buttons (Cluster Mode)
  container.querySelectorAll('.sim-seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sim-seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.clusterMode = btn.dataset.mode;
      updateAll();
    });
  });

  // Preset Buttons
  container.querySelectorAll('.sim-preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.sim-preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyPreset(btn.dataset.preset);
    });
  });

  function applyPreset(presetKey) {
    state.activePreset = presetKey;
    if (presetKey === 'disaster200') {
      state.dataSizeGB = 2000;
      state.workload = 'aggregation';
      state.clusterMode = 'classic_static';
      state.workerCount = 8;
      state.workerCores = 8;
      state.workerRAM = 32;
      state.partitions = 200;
      state.aqeEnabled = false;
      state.photonEnabled = false;
      state.dataSkew = 'none';
      state.gcMode = 'parallel';
    } else if (presetKey === 'aqe_rescue') {
      state.dataSizeGB = 2000;
      state.workload = 'aggregation';
      state.clusterMode = 'classic_autoscale';
      state.workerCount = 12;
      state.workerCores = 8;
      state.workerRAM = 32;
      state.partitions = 200; // AQE will override dynamically
      state.aqeEnabled = true;
      state.photonEnabled = false;
      state.dataSkew = 'none';
      state.gcMode = 'g1gc';
    } else if (presetKey === 'data_skew') {
      state.dataSizeGB = 2000;
      state.workload = 'join';
      state.clusterMode = 'classic_static';
      state.workerCount = 8;
      state.workerCores = 8;
      state.workerRAM = 32;
      state.partitions = 800;
      state.aqeEnabled = false;
      state.photonEnabled = false;
      state.dataSkew = 'severe';
      state.gcMode = 'g1gc';
    } else if (presetKey === 'serverless_burst') {
      state.dataSizeGB = 2000;
      state.workload = 'aggregation';
      state.clusterMode = 'serverless';
      state.workerCount = 16;
      state.workerCores = 8;
      state.workerRAM = 32;
      state.partitions = 1200;
      state.aqeEnabled = true;
      state.photonEnabled = true;
      state.dataSkew = 'none';
      state.gcMode = 'g1gc';
    } else if (presetKey === 'photon_speed') {
      state.dataSizeGB = 3000;
      state.workload = 'aggregation';
      state.clusterMode = 'serverless';
      state.workerCount = 12;
      state.workerCores = 8;
      state.workerRAM = 32;
      state.partitions = 1600;
      state.aqeEnabled = true;
      state.photonEnabled = true;
      state.dataSkew = 'none';
      state.gcMode = 'g1gc';
    }
    syncInputsFromState();
    updateAll();
  }

  function syncInputsFromState() {
    dataSlider.value = state.dataSizeGB;
    workloadSel.value = state.workload;
    skewSel.value = state.dataSkew;
    workersSlider.value = state.workerCount;
    vmSpecSel.value = `${state.workerCores}_${state.workerRAM}`;
    partitionsSlider.value = state.partitions;
    toggleAqe.checked = state.aqeEnabled;
    togglePhoton.checked = state.photonEnabled;
    gcSel.value = state.gcMode;

    container.querySelectorAll('.sim-seg-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.mode === state.clusterMode);
    });
  }

  // Event Listeners for Controls
  dataSlider.addEventListener('input', (e) => {
    state.dataSizeGB = Number(e.target.value);
    updateAll();
  });
  workloadSel.addEventListener('change', (e) => {
    state.workload = e.target.value;
    updateAll();
  });
  skewSel.addEventListener('change', (e) => {
    state.dataSkew = e.target.value;
    updateAll();
  });
  workersSlider.addEventListener('input', (e) => {
    state.workerCount = Number(e.target.value);
    updateAll();
  });
  vmSpecSel.addEventListener('change', (e) => {
    const [c, r] = e.target.value.split('_').map(Number);
    state.workerCores = c;
    state.workerRAM = r;
    updateAll();
  });
  partitionsSlider.addEventListener('input', (e) => {
    state.partitions = Number(e.target.value);
    updateAll();
  });
  toggleAqe.addEventListener('change', (e) => {
    state.aqeEnabled = e.target.checked;
    updateAll();
  });
  togglePhoton.addEventListener('change', (e) => {
    state.photonEnabled = e.target.checked;
    updateAll();
  });
  gcSel.addEventListener('change', (e) => {
    state.gcMode = e.target.value;
    updateAll();
  });

  // Master Update Function
  function updateAll() {
    // 1. Text Labels
    dataVal.textContent = state.dataSizeGB >= 1000 ? `${state.dataSizeGB.toLocaleString()} GB (${(state.dataSizeGB/1000).toFixed(1)} TB)` : `${state.dataSizeGB} GB`;
    workersVal.textContent = `${state.workerCount} Workers (${state.workerCount * state.workerCores} Cores)`;
    partitionsVal.textContent = state.aqeEnabled ? `${state.partitions} (AQE Dynamic Auto)` : state.partitions;

    // 2. Compute Spark Physics
    const physics = computeSparkPhysics(state);

    // 3. Render KPI Metrics
    container.querySelector('#metric-runtime').textContent = formatTime(physics.totalRuntimeSec);
    container.querySelector('#metric-runtime-sub').textContent = physics.runtimeSub;
    container.querySelector('#badge-runtime').textContent = physics.runtimeBadge.text;
    container.querySelector('#badge-runtime').className = `sim-metric-badge ${physics.runtimeBadge.cls}`;

    container.querySelector('#metric-spill').textContent = `${physics.diskSpillGB.toLocaleString()} GB`;
    container.querySelector('#metric-spill-sub').textContent = `Mem Spill: ${physics.memSpillGB.toLocaleString()} GB · Disk: ${physics.diskSpillGB.toLocaleString()} GB`;
    container.querySelector('#badge-spill').textContent = physics.spillBadge.text;
    container.querySelector('#badge-spill').className = `sim-metric-badge ${physics.spillBadge.cls}`;

    container.querySelector('#metric-gc').textContent = `${physics.gcPct}%`;
    container.querySelector('#metric-gc-sub').textContent = `Stop-the-world pauses: ${formatTime(physics.gcTimeSec)}`;
    container.querySelector('#badge-gc').textContent = physics.gcBadge.text;
    container.querySelector('#badge-gc').className = `sim-metric-badge ${physics.gcBadge.cls}`;

    container.querySelector('#metric-cost').textContent = `$${physics.costDollars.toFixed(2)}`;
    container.querySelector('#metric-dbu').textContent = `${physics.dbus.toFixed(1)} DBUs consumed`;
    container.querySelector('#badge-cost').textContent = physics.costBadge.text;
    container.querySelector('#badge-cost').className = `sim-metric-badge ${physics.costBadge.cls}`;

    // 4. Cluster Mode Badge
    const badgeMode = container.querySelector('#cluster-mode-badge');
    if (state.clusterMode === 'serverless') {
      badgeMode.textContent = `Serverless Compute · ${physics.effectiveWorkers} Dynamic Containers (<4s cold start)`;
      badgeMode.className = 'sim-board-badge sim-badge-good';
    } else if (state.clusterMode === 'classic_autoscale') {
      badgeMode.textContent = `Autoscaling VM Cluster · ${state.workerCount} Nodes (3m warmup delay)`;
      badgeMode.className = 'sim-board-badge sim-badge-warn';
    } else {
      badgeMode.textContent = `Classic Static VM · ${state.workerCount} Fixed Nodes (${state.workerCount * state.workerCores} Cores)`;
      badgeMode.className = 'sim-board-badge sim-badge-good';
    }

    // 5. Topology Elements
    container.querySelector('#count-executors-label').textContent = physics.effectiveWorkers;
    container.querySelector('#count-cores-label').textContent = physics.totalCores;
    container.querySelector('#driver-tasks-total').textContent = `${physics.effectivePartitions.toLocaleString()} Tasks`;
    container.querySelector('#spill-meter-display').textContent = `${physics.diskSpillGB.toLocaleString()} GB`;
    
    const spillBox = container.querySelector('#spill-box');
    const diskTarget = container.querySelector('#disk-target');
    if (physics.diskSpillGB > 0) {
      spillBox.classList.add('active-spill');
      diskTarget.classList.add('spilling');
      container.querySelector('#spill-status-sub').textContent = `High Disk I/O Bottleneck (${physics.spillMultiplier}x slowdown)`;
    } else {
      spillBox.classList.remove('active-spill');
      diskTarget.classList.remove('spilling');
      container.querySelector('#spill-status-sub').textContent = 'Zero Spilling · 100% In-Memory Execution';
    }

    // 6. Render Worker Cards
    renderWorkersGrid(container, state, physics);

    // 7. Render Memory Model Stacked Bar
    renderMemoryBar(container, state, physics);

    // 8. Render Stages Pipeline
    renderStagesPipeline(container, state, physics);

    // 9. Render Animated SVG Flow Paths
    renderFlowSvg(container, state, physics);

    // 10. Render Prescriptive Spark Config Advisor
    renderAdvisor(container, state, physics);
  }

  // Auto-reflow SVG arrows on board resize & window resize
  const boardEl = container.querySelector('#sim-topology-board');
  if (window.ResizeObserver && boardEl) {
    const ro = new ResizeObserver(() => {
      renderFlowSvg(container, state, computeSparkPhysics(state));
    });
    ro.observe(boardEl);
  }
  window.addEventListener('resize', () => {
    renderFlowSvg(container, state, computeSparkPhysics(state));
  });

  // Initial Run
  updateAll();
  setTimeout(() => renderFlowSvg(container, state, computeSparkPhysics(state)), 100);

  return container;
}

// ── Physics Calculations ─────────────────────────────────────
function computeSparkPhysics(s) {
  // 1. Cluster Sizing
  let effectiveWorkers = s.workerCount;
  if (s.clusterMode === 'serverless') {
    // Serverless dynamically matches optimal task concurrency
    effectiveWorkers = Math.min(32, Math.max(4, Math.ceil(s.dataSizeGB / 120)));
  }
  const totalCores = effectiveWorkers * s.workerCores;

  // 2. Memory Breakdown (per worker JVM)
  const heapRAM = s.workerRAM - 2; // 2 GB reserved for OS
  const reservedMB = 300;
  const usableHeapGB = (heapRAM * 1024 - reservedMB) / 1024;
  const sparkMemoryFraction = 0.6;
  const storageFraction = 0.5; // of 0.6 = 0.3 execution, 0.3 storage
  const executionMemGB = usableHeapGB * sparkMemoryFraction * (1 - storageFraction);
  const storageMemGB = usableHeapGB * sparkMemoryFraction * storageFraction;
  const userMemGB = usableHeapGB * (1 - sparkMemoryFraction);
  const execMemPerTaskSlotGB = executionMemGB / s.workerCores;

  // 3. Partitioning & AQE Logic
  let effectivePartitions = s.partitions;
  if (s.aqeEnabled) {
    // AQE targets 128 MB per partition automatically
    const targetSizeGB = 0.128; // 128 MB
    effectivePartitions = Math.max(totalCores, Math.ceil(s.dataSizeGB / targetSizeGB));
  }

  // 4. Data per Partition & Spilling
  const avgPartitionSizeGB = s.dataSizeGB / effectivePartitions;
  let maxPartitionSizeGB = avgPartitionSizeGB;

  if (s.dataSkew === 'moderate') {
    maxPartitionSizeGB = avgPartitionSizeGB * 4.5;
  } else if (s.dataSkew === 'severe') {
    maxPartitionSizeGB = s.dataSizeGB * 0.55; // 55% of all data on 1 partition!
  }

  // Spilling: If working set exceeds slot execution memory
  // In an aggregation or sort, memory expansion is roughly 1.8x due to Hash/Sort Tables
  const expansionFactor = s.workload === 'join' ? 2.2 : 1.7;
  const workingSetPerTaskGB = maxPartitionSizeGB * expansionFactor;

  let isSpilling = false;
  let memSpillGB = 0;
  let diskSpillGB = 0;

  if (workingSetPerTaskGB > execMemPerTaskSlotGB) {
    isSpilling = true;
    const spillPerSpilledTaskGB = workingSetPerTaskGB - execMemPerTaskSlotGB;
    const numSpilledTasks = s.dataSkew === 'severe' ? 4 : (s.dataSkew === 'moderate' ? Math.ceil(effectivePartitions * 0.25) : effectivePartitions);
    memSpillGB = Math.round(spillPerSpilledTaskGB * numSpilledTasks);
    diskSpillGB = Math.round(memSpillGB / 2.4); // Snappy compression ratio ~2.4x
  }

  // 5. Garbage Collection (GC) Overhead
  let gcPct = 4.2; // default G1GC
  if (s.gcMode === 'parallel') {
    gcPct = 18.5; // stop-the-world pauses
  }
  if (s.photonEnabled) {
    gcPct = 0.8; // Photon runs in C++ off-heap; eliminates JVM GC!
  }
  if (memSpillGB > 500 && !s.photonEnabled) {
    gcPct += 8.0; // severe object thrashing from deserializing spilled blocks
  }

  // 6. Runtime Estimation
  // Base compute time: 100 GB / core / hour baseline
  let baseThroughputGBPerSec = 0.08 * (s.photonEnabled ? 3.4 : 1.0);
  let rawComputeSec = s.dataSizeGB / (totalCores * baseThroughputGBPerSec);

  // Shuffle Network transfer
  let shuffleNetworkSec = (s.dataSizeGB * 0.7) / (effectiveWorkers * 0.5); // 500 MB/s per node network

  // Spilling penalty (Disk I/O is 10x-50x slower than memory!)
  let spillDelaySec = (diskSpillGB * 1024) / (effectiveWorkers * 45); // 45 MB/s disk write/read throughput
  let spillMultiplier = isSpilling ? Math.max(2, Math.round(spillDelaySec / Math.max(1, rawComputeSec))) : 1;

  // Straggler penalty from skew
  let stragglerSec = 0;
  if (s.dataSkew === 'severe') {
    stragglerSec = 380; // 1 single task holds up the entire stage
  } else if (s.dataSkew === 'moderate') {
    stragglerSec = 95;
  }

  // Autoscaling spinup delay
  let warmupSec = 0;
  if (s.clusterMode === 'classic_autoscale') {
    warmupSec = 180; // 3 minutes VM boot delay
  } else if (s.clusterMode === 'serverless') {
    warmupSec = 4; // <5 seconds instant cold start
  }

  const gcTimeSec = (rawComputeSec + spillDelaySec + stragglerSec) * (gcPct / 100);
  const totalRuntimeSec = Math.round(rawComputeSec + shuffleNetworkSec + spillDelaySec + stragglerSec + gcTimeSec + warmupSec);

  // 7. Costs & DBUs
  // Standard VM: 0.75 DBU/hr/node + $0.20 cloud VM cost
  // Serverless: 1.2 DBU/hr/node, but bills strictly per-second with zero idle waste
  const runtimeHours = totalRuntimeSec / 3600;
  let dbus = 0;
  let costDollars = 0;

  if (s.clusterMode === 'serverless') {
    dbus = effectiveWorkers * 1.4 * runtimeHours;
    costDollars = dbus * 0.40; // $0.40 per DBU, no VM markup
  } else {
    // Static / Autoscale has minimum 15-min billing or idle allocation
    const billedHours = Math.max(0.25, runtimeHours + 0.15); // idle timeout
    dbus = effectiveWorkers * 0.85 * billedHours;
    costDollars = dbus * 0.40 + (effectiveWorkers * 0.28 * billedHours);
  }

  // Badges & Statuses
  let runtimeBadge = { text: 'FAST', cls: 'sim-badge-good' };
  let runtimeSub = 'High-throughput execution';
  if (totalRuntimeSec > 1800) {
    runtimeBadge = { text: 'CRITICAL', cls: 'sim-badge-danger' };
    runtimeSub = 'Heavy disk spill & skew bottleneck';
  } else if (totalRuntimeSec > 600) {
    runtimeBadge = { text: 'DEGRADED', cls: 'sim-badge-warn' };
    runtimeSub = 'Memory pressure slowing pipeline';
  }

  let spillBadge = { text: '0 SPILL', cls: 'sim-badge-good' };
  if (diskSpillGB > 400) {
    spillBadge = { text: 'HIGH SPILL', cls: 'sim-badge-danger' };
  } else if (diskSpillGB > 0) {
    spillBadge = { text: 'SPILLING', cls: 'sim-badge-warn' };
  }

  let gcBadge = { text: 'MINIMAL', cls: 'sim-badge-good' };
  if (gcPct > 15) {
    gcBadge = { text: 'SEVERE PAUSE', cls: 'sim-badge-danger' };
  } else if (gcPct > 8) {
    gcBadge = { text: 'MODERATE', cls: 'sim-badge-warn' };
  }

  let costBadge = { text: 'OPTIMIZED', cls: 'sim-badge-good' };
  if (costDollars > 35) {
    costBadge = { text: 'EXPENSIVE', cls: 'sim-badge-warn' };
  }

  return {
    effectiveWorkers,
    totalCores,
    heapRAM,
    reservedMB,
    userMemGB,
    storageMemGB,
    executionMemGB,
    execMemPerTaskSlotGB,
    effectivePartitions,
    avgPartitionSizeGB,
    maxPartitionSizeGB,
    isSpilling,
    memSpillGB,
    diskSpillGB,
    spillMultiplier,
    gcPct,
    gcTimeSec,
    totalRuntimeSec,
    dbus,
    costDollars,
    runtimeBadge,
    runtimeSub,
    spillBadge,
    gcBadge,
    costBadge
  };
}

// ── Render Worker Nodes Grid ─────────────────────────────────
function renderWorkersGrid(container, state, physics) {
  const grid = container.querySelector('#sim-workers-grid');
  grid.innerHTML = '';

  const displayNodes = Math.min(8, physics.effectiveWorkers);
  for (let i = 0; i < displayNodes; i++) {
    const isHotSkewNode = state.dataSkew !== 'none' && i === 0;
    const isSpillingNode = physics.isSpilling && (state.dataSkew === 'none' || i === 0);

    const card = document.createElement('div');
    card.className = `sim-worker-card active ${isSpillingNode ? 'spilling' : ''}`;

    let coreSlotsHtml = '';
    for (let c = 0; c < state.workerCores; c++) {
      const isHotSlot = isHotSkewNode && c === 0;
      coreSlotsHtml += `
        <div class="sim-core-slot active ${isHotSlot ? 'skew-hot' : ''}" title="Core Slot ${c+1}: Task Active">
          ${isHotSlot ? '🔥' : 'T' + (c+1)}
        </div>
      `;
    }

    const execWidth = isSpillingNode ? 70 : 45;
    const storageWidth = 20;
    const spillWidth = isSpillingNode ? 30 : 0;

    card.innerHTML = `
      <div class="sim-worker-top">
        <span class="sim-worker-name">Executor #${i+1}</span>
        <span class="sim-worker-status ${isSpillingNode ? 'spill' : 'busy'}">
          ${isSpillingNode ? '⚠️ SPILLING' : '● RUNNING'}
        </span>
      </div>
      <div class="sim-cores-bar">
        ${coreSlotsHtml}
      </div>
      <div class="sim-ram-track" title="RAM Usage">
        <div class="sim-ram-fill-exec" style="width:${execWidth}%;"></div>
        <div class="sim-ram-fill-storage" style="width:${storageWidth}%;"></div>
        <div class="sim-ram-fill-spill" style="width:${spillWidth}%;"></div>
      </div>
    `;
    grid.appendChild(card);
  }
}

// ── Render Memory Breakdown Stacked Bar ───────────────────────
function renderMemoryBar(container, state, physics) {
  const bar = container.querySelector('#sim-stacked-mem-bar');
  const total = physics.heapRAM + (state.photonEnabled ? 12 : 0);

  const resPct = (0.3 / total) * 100;
  const userPct = (physics.userMemGB / total) * 100;
  const storPct = (physics.storageMemGB / total) * 100;
  const execPct = (physics.executionMemGB / total) * 100;
  const offheapPct = state.photonEnabled ? (12 / total) * 100 : 0;

  bar.innerHTML = `
    <div class="sim-mem-block reserved" style="width:${resPct.toFixed(1)}%;" title="Reserved Memory: 300 MB (Spark internal)">Res</div>
    <div class="sim-mem-block user" style="width:${userPct.toFixed(1)}%;" title="User Memory: ${physics.userMemGB.toFixed(1)} GB (UDFs, user data structures)">User (${physics.userMemGB.toFixed(1)}G)</div>
    <div class="sim-mem-block storage" style="width:${storPct.toFixed(1)}%;" title="Storage Memory: ${physics.storageMemGB.toFixed(1)} GB (Cached DataFrames, Broadcast)">Storage (${physics.storageMemGB.toFixed(1)}G)</div>
    <div class="sim-mem-block exec ${physics.isSpilling ? 'spill-risk' : ''}" style="width:${execPct.toFixed(1)}%;" title="Execution Memory: ${physics.executionMemGB.toFixed(1)} GB (Shuffle, Hash Tables, Sorts)">
      Execution ${physics.isSpilling ? '⚠️ OVERRUN' : `(${physics.executionMemGB.toFixed(1)}G)`}
    </div>
    ${state.photonEnabled ? `<div class="sim-mem-block offheap" style="width:${offheapPct.toFixed(1)}%;" title="Photon Native Off-Heap: 12 GB">Photon (12G)</div>` : ''}
  `;

  container.querySelector('#mem-per-task-label').textContent = `Slot Execution Budget: ${(physics.execMemPerTaskSlotGB * 1024).toFixed(0)} MB / Core`;
  container.querySelector('#leg-user-mem').textContent = `User Memory (${physics.userMemGB.toFixed(1)} GB)`;
  container.querySelector('#leg-storage-mem').textContent = `Storage (${physics.storageMemGB.toFixed(1)} GB)`;
  container.querySelector('#leg-exec-mem').textContent = `Execution (${physics.executionMemGB.toFixed(1)} GB)`;
}

// ── Render Stage Pipeline (Mini-Spark UI) ─────────────────────
function renderStagesPipeline(container, state, physics) {
  container.querySelector('#stage0-tasks').textContent = Math.round(state.dataSizeGB / 1.0).toLocaleString();
  container.querySelector('#stage0-write').textContent = `${state.dataSizeGB.toLocaleString()} GB`;
  container.querySelector('#stage1-parts').textContent = physics.effectivePartitions.toLocaleString();
  container.querySelector('#stage1-spill').textContent = `${physics.diskSpillGB.toLocaleString()} GB`;

  const stage1Box = container.querySelector('#stage1-box');
  const stage1Pill = container.querySelector('#stage1-pill');
  const stageConn01 = container.querySelector('#stage-conn-0-1 .sim-connector-line');

  if (state.dataSkew === 'severe') {
    stage1Box.className = 'sim-stage-node shuffle-boundary active straggler';
    stage1Pill.textContent = 'STRAGGLER TASK';
    stage1Pill.style.color = 'var(--sim-lava)';
    if (stageConn01) stageConn01.className = 'sim-connector-line spill';
  } else if (physics.isSpilling) {
    stage1Box.className = 'sim-stage-node shuffle-boundary active';
    stage1Pill.textContent = 'SPILLING';
    stage1Pill.style.color = 'var(--sim-lava)';
    if (stageConn01) stageConn01.className = 'sim-connector-line spill';
  } else {
    stage1Box.className = 'sim-stage-node shuffle-boundary active';
    stage1Pill.textContent = 'RUNNING';
    stage1Pill.style.color = 'var(--sim-orange)';
    if (stageConn01) stageConn01.className = state.clusterMode === 'serverless' ? 'sim-connector-line serverless' : 'sim-connector-line';
  }
}

// ── Render Animated SVG Flow Paths & Particles ───────────────
function renderFlowSvg(container, state, physics) {
  const svg = container.querySelector('#sim-flow-svg');
  const pathsGroup = container.querySelector('#flow-paths-layer');
  const particlesGroup = container.querySelector('#flow-particles-layer');
  const labelsGroup = container.querySelector('#flow-labels-layer');

  const board = container.querySelector('#sim-topology-board');
  if (!board || !pathsGroup || !particlesGroup) return;

  const boardRect = board.getBoundingClientRect();
  const driverBox = container.querySelector('#driver-box');
  const spillBox = container.querySelector('#spill-box');
  if (!driverBox || !spillBox) return;

  const driverRect = driverBox.getBoundingClientRect();
  const spillRect = spillBox.getBoundingClientRect();
  const workerCards = Array.from(container.querySelectorAll('.sim-worker-card'));

  if (workerCards.length === 0 || boardRect.width <= 0) return;

  pathsGroup.innerHTML = '';
  particlesGroup.innerHTML = '';
  if (labelsGroup) labelsGroup.innerHTML = '';

  const isServerless = state.clusterMode === 'serverless';
  const taskLineClass = isServerless ? 'flow-line serverless' : 'flow-line normal';
  const particleClass = isServerless ? 'green' : 'cyan';
  const arrowMarker = isServerless ? 'url(#arrow-green)' : 'url(#arrow-cyan)';

  const driverRightX = driverRect.right - boardRect.left;

  // 1. Task Dispatch Arrows: Driver -> Left-column Executors (0, 2, 4, 6)
  const leftColCards = [];
  const rightColCards = [];
  const firstLeft = workerCards[0]?.getBoundingClientRect().left || 0;

  workerCards.forEach((card, idx) => {
    const r = card.getBoundingClientRect();
    if (Math.abs(r.left - firstLeft) < 30) {
      leftColCards.push({ card, idx });
    } else {
      rightColCards.push({ card, idx });
    }
  });

  // If cards are single column (narrow screen), treat first 4 as left targets
  const dispatchTargets = leftColCards.length > 0 ? leftColCards : workerCards.slice(0, 4).map((card, idx) => ({ card, idx }));

  dispatchTargets.forEach(({ card }, i) => {
    const cardRect = card.getBoundingClientRect();
    const driverY = (driverRect.top - boardRect.top) + (driverRect.height * (0.2 + (0.6 * (i / Math.max(1, dispatchTargets.length - 1)))));
    const targetX = cardRect.left - boardRect.left;
    const targetY = cardRect.top - boardRect.top + (cardRect.height / 2);

    if (targetX <= driverRightX) return;

    const deltaX = targetX - driverRightX;
    const c1X = driverRightX + Math.max(20, deltaX * 0.42);
    const c2X = targetX - Math.max(20, deltaX * 0.42);
    const taskPathD = `M ${driverRightX.toFixed(1)} ${driverY.toFixed(1)} C ${c1X.toFixed(1)} ${driverY.toFixed(1)}, ${c2X.toFixed(1)} ${targetY.toFixed(1)}, ${(targetX - 5).toFixed(1)} ${targetY.toFixed(1)}`;

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', taskPathD);
    pathEl.setAttribute('class', taskLineClass);
    pathEl.setAttribute('marker-end', arrowMarker);
    pathsGroup.appendChild(pathEl);

    // Continuous streaming particles
    const dur = (1.15 + (i * 0.12)).toFixed(2);
    const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    p1.setAttribute('class', `flow-particle ${particleClass}`);
    p1.innerHTML = `<animateMotion path="${taskPathD}" dur="${dur}s" repeatCount="indefinite" begin="0s"/>`;
    particlesGroup.appendChild(p1);

    const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    p2.setAttribute('class', `flow-particle ${particleClass}`);
    p2.innerHTML = `<animateMotion path="${taskPathD}" dur="${dur}s" repeatCount="indefinite" begin="${(parseFloat(dur) / 2).toFixed(2)}s"/>`;
    particlesGroup.appendChild(p2);
  });

  // 2. Inter-Executor Shuffle Flow (Col 1 -> Col 2 Pairs)
  if ((state.workload === 'aggregation' || state.workload === 'join') && rightColCards.length > 0) {
    const pairCount = Math.min(leftColCards.length, rightColCards.length, 4);
    for (let p = 0; p < pairCount; p++) {
      const cardA = leftColCards[p].card;
      const cardB = rightColCards[p].card;
      const rectA = cardA.getBoundingClientRect();
      const rectB = cardB.getBoundingClientRect();

      const aRight = rectA.right - boardRect.left;
      const aY = rectA.top - boardRect.top + (rectA.height * 0.45);
      const bLeft = rectB.left - boardRect.left;
      const bY = rectB.top - boardRect.top + (rectB.height * 0.45);

      if (bLeft > aRight + 12) {
        const delta = bLeft - aRight;
        const c1X = aRight + delta * 0.45;
        const c2X = bLeft - delta * 0.45;
        const shufflePathD = `M ${aRight.toFixed(1)} ${aY.toFixed(1)} C ${c1X.toFixed(1)} ${(aY - 10).toFixed(1)}, ${c2X.toFixed(1)} ${(bY - 10).toFixed(1)}, ${(bLeft - 5).toFixed(1)} ${bY.toFixed(1)}`;

        const shufflePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shufflePath.setAttribute('d', shufflePathD);
        shufflePath.setAttribute('class', 'flow-line shuffle');
        shufflePath.setAttribute('marker-end', 'url(#arrow-purple)');
        pathsGroup.appendChild(shufflePath);

        const sp = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sp.setAttribute('class', 'flow-particle purple');
        sp.innerHTML = `<animateMotion path="${shufflePathD}" dur="0.95s" repeatCount="indefinite" begin="${(p * 0.18).toFixed(2)}s"/>`;
        particlesGroup.appendChild(sp);
      }
    }
  }

  // 3. Disk Spilling Flow Arrows (Overloaded Executors -> Local NVMe Spill Target)
  if (physics.isSpilling) {
    const spillLeftX = spillRect.left - boardRect.left;

    // If severe skew, hot Executor #0 is spilling; otherwise right-column executors spill into SSD
    const spillingCards = state.dataSkew === 'severe'
      ? [workerCards[0]]
      : (rightColCards.length > 0 ? rightColCards.map(c => c.card) : workerCards.slice(0, 3));

    spillingCards.slice(0, 3).forEach((card, sIdx) => {
      const cardRect = card.getBoundingClientRect();
      const wRight = cardRect.right - boardRect.left;
      const wCenterY = cardRect.top - boardRect.top + (cardRect.height * (0.35 + sIdx * 0.22));

      if (spillLeftX <= wRight) return;

      const deltaX = spillLeftX - wRight;
      const c1X = wRight + Math.max(25, deltaX * 0.45);
      const c2X = spillLeftX - Math.max(25, deltaX * 0.45);
      const targetY = (spillRect.top - boardRect.top) + (spillRect.height * (0.32 + sIdx * 0.25));

      const spillPathD = `M ${wRight.toFixed(1)} ${wCenterY.toFixed(1)} C ${c1X.toFixed(1)} ${wCenterY.toFixed(1)}, ${c2X.toFixed(1)} ${targetY.toFixed(1)}, ${(spillLeftX - 5).toFixed(1)} ${targetY.toFixed(1)}`;

      const spillPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      spillPath.setAttribute('d', spillPathD);
      spillPath.setAttribute('class', 'flow-line spill');
      spillPath.setAttribute('marker-end', 'url(#arrow-lava)');
      pathsGroup.appendChild(spillPath);

      // Fast streaming glowing lava particles
      const pSpill1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pSpill1.setAttribute('class', 'flow-particle spill');
      pSpill1.innerHTML = `<animateMotion path="${spillPathD}" dur="0.7s" repeatCount="indefinite" begin="0s"/>`;
      particlesGroup.appendChild(pSpill1);

      const pSpill2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pSpill2.setAttribute('class', 'flow-particle spill');
      pSpill2.innerHTML = `<animateMotion path="${spillPathD}" dur="0.7s" repeatCount="indefinite" begin="0.35s"/>`;
      particlesGroup.appendChild(pSpill2);

      // Add a prominent animated floating SVG alert badge on the top spill path
      if (sIdx === 0 && labelsGroup && deltaX > 75) {
        const midX = (wRight + spillLeftX) / 2;
        const midY = (wCenterY + targetY) / 2 - 12;

        const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badgeG.setAttribute('transform', `translate(${midX - 55}, ${midY})`);
        badgeG.innerHTML = `
          <rect width="110" height="20" rx="10" fill="rgba(255, 54, 33, 0.95)" stroke="#ff3621" stroke-width="1.5" filter="url(#glow-lava)"/>
          <text x="55" y="14" fill="#fff" font-size="9.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
            ⚠️ SPILL: ${physics.diskSpillGB.toLocaleString()} GB
          </text>
        `;
        labelsGroup.appendChild(badgeG);
      }
    });
  } else if (labelsGroup) {
    // Show pristine zero-spill badge
    const lastCard = (rightColCards[0]?.card) || workerCards[workerCards.length - 1];
    if (lastCard) {
      const cardRect = lastCard.getBoundingClientRect();
      const wRight = cardRect.right - boardRect.left;
      const spillLeftX = spillRect.left - boardRect.left;
      if (spillLeftX - wRight > 80) {
        const midX = (wRight + spillLeftX) / 2;
        const midY = spillRect.top - boardRect.top + 20;
        const badgeG = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        badgeG.setAttribute('transform', `translate(${midX - 55}, ${midY})`);
        badgeG.innerHTML = `
          <rect width="110" height="20" rx="10" fill="rgba(16, 185, 129, 0.18)" stroke="#10b981" stroke-width="1.2"/>
          <text x="55" y="14" fill="#10b981" font-size="9.5" font-weight="700" text-anchor="middle" font-family="Inter, sans-serif">
            ✓ 100% In-Memory
          </text>
        `;
        labelsGroup.appendChild(badgeG);
      }
    }
  }
}

// ── Prescriptive Recommendations & Best Practices Advisor ────
function renderAdvisor(container, state, physics) {
  const recsContainer = container.querySelector('#sim-recommendations-list');
  recsContainer.innerHTML = '';

  const recs = [];

  // Rule 1: High Spilling Detected
  if (physics.diskSpillGB > 0) {
    const optimalPartitions = Math.max(400, Math.ceil(state.dataSizeGB / 0.128));
    recs.push({
      urgent: true,
      title: `⚠️ Heavy Disk Spilling (${physics.diskSpillGB.toLocaleString()} GB) — Execution Memory Saturated`,
      desc: `Each partition currently carries ~${(physics.maxPartitionSizeGB * 1024).toFixed(0)} MB of data, which exceeds the ${(physics.execMemPerTaskSlotGB * 1024).toFixed(0)} MB execution limit per core. Spark is dumping hash tables to local NVMe, causing a ${physics.spillMultiplier}x slowdown.`,
      code: state.aqeEnabled ? 
        `-- AQE is active; ensure your worker VM has sufficient RAM or increase executor cores\nspark.conf.set("spark.sql.shuffle.partitions", "${optimalPartitions}")` :
        `-- Enable Adaptive Query Execution to auto-scale partitions and eliminate spill:\nspark.conf.set("spark.sql.adaptive.enabled", "true")\nspark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")\nspark.conf.set("spark.sql.shuffle.partitions", "${optimalPartitions}")`
    });
  }

  // Rule 2: Data Skew Detected
  if (state.dataSkew !== 'none' && !state.aqeEnabled) {
    recs.push({
      urgent: true,
      title: `🔥 Severe Data Skew Straggler Detected on Join Key`,
      desc: `A single key holds a disproportionate fraction of the dataset, causing 1 executor to crunch 100x more data while the rest of the cluster sits idle. Enable AQE skew join handling to automatically split hot partitions into smaller sub-chunks.`,
      code: `spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")\nspark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")\nspark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "268435456") -- 256MB`
    });
  }

  // Rule 3: Photon Engine Acceleration
  if (!state.photonEnabled && state.workload === 'aggregation') {
    recs.push({
      urgent: false,
      title: `💡 Enable Photon Vectorized Engine for 3x–5x CPU Acceleration`,
      desc: `GroupBy aggregations and sort-merge joins are CPU and memory-intensive. Photon runs natively in C++ off-heap, eliminating JVM object allocation overhead and reducing GC pause time to near zero.`,
      code: `spark.conf.set("spark.databricks.photon.enabled", "true")\n-- Photon executes vectorized queries on modern SIMD CPU instruction sets`
    });
  }

  // Rule 4: Serverless Compute Recommendation
  if (state.clusterMode !== 'serverless') {
    recs.push({
      urgent: false,
      title: `⚡ Migrate to Databricks Serverless Compute`,
      desc: `Classic clusters require 3–5 minutes of VM cold boot time and continue incurring infrastructure charges while idle. Serverless starts in <4 seconds, auto-provisions exact worker capacity, and frees shuffle files from node lifecycle.`,
      code: `# In Databricks Workspace UI:\n# Switch Compute target from "Classic Cluster" to "Serverless"\n# Instant startup · Per-second billing · Automatic AQE tuning`
    });
  }

  // Rule 5: Delta Lake Liquid Clustering / Z-Order Best Practice
  recs.push({
    urgent: false,
    title: `🛡️ Delta Lake Liquid Clustering & Data Skipping`,
    desc: `Instead of scanning ${state.dataSizeGB >= 1000 ? (state.dataSizeGB/1000).toFixed(1) + ' TB' : state.dataSizeGB + ' GB'} across the network, cluster your Delta table on frequently filtered keys. Spark will skip irrelevant Parquet files before even scheduling Stage 0.`,
    code: `CREATE TABLE gold_metrics\nUSING DELTA\nCLUSTER BY (customer_id, transaction_date)\nAS SELECT * FROM silver_events;`
  });

  recs.forEach(r => {
    const item = document.createElement('div');
    item.className = `sim-rec-item ${r.urgent ? 'urgent' : 'good'}`;
    item.innerHTML = `
      <span class="sim-rec-title">${r.title}</span>
      <span class="sim-rec-desc">${r.desc}</span>
      <div class="sim-code-snippet">
        <pre style="margin:0;overflow-x:auto;"><code>${escapeHtml(r.code)}</code></pre>
        <button class="sim-copy-btn" title="Copy configuration">Copy</button>
      </div>
    `;

    item.querySelector('.sim-copy-btn').addEventListener('click', (e) => {
      navigator.clipboard.writeText(r.code);
      e.target.textContent = 'Copied!';
      setTimeout(() => { e.target.textContent = 'Copy'; }, 1800);
    });

    recsContainer.appendChild(item);
  });
}

// ── Helpers ──────────────────────────────────────────────────
function formatTime(sec) {
  const rSec = Math.round(sec);
  if (rSec < 60) return `${rSec}s`;
  const m = Math.floor(rSec / 60);
  const s = rSec % 60;
  return `${m}m ${s}s`;
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
