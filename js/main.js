/**
 * DATABRICKS PLATFORM EXPLORER — Main Bootstrap
 * Wires all modules together and handles view switching.
 */

import { initScene, selectItem, clearSelection, setSeparation, setExploded, resetCamera, zoomIn, zoomOut, panUp, panDown, resizeRenderer, highlightOpenSource, setCameraMode, focusLayer } from './scene.js?v=d2';
import { initNav, setActiveLayerSilent, setActiveCompSilent } from './nav.js?v=d2';
import { initInspector, showWelcome, showLayerDetail, showCompDetail } from './inspector.js?v=d2';
import { LAYERS, COMPONENT_MAP } from './data.js?v=d2';
import { renderDaisArchitecture } from './dais-arch.js?v=d2';
import { render2DMatrix, highlightMatrixComponent, highlightMatrixLayer, activateJourney, clearMatrixHighlights } from './matrix-view.js?v=d2';
import { renderSparkSimulator } from './spark-simulator.js?v=d4';

// Guard flag to prevent circular calls between scene ↔ nav ↔ scene
let _selecting = false;
let currentViewportMode = '2d'; // Default to pristine, user-friendly 2D Architecture Matrix

// ── DOMContentLoaded ───────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initInspector();
  // Nav callbacks: user clicked something in the sidebar → update scene/matrix + inspector
  initNav(handleNavLayerClick, handleNavCompClick);
  initViewportModes();
  initCameraButtons();
  initViewTabs();
  initControls();
  initHelpDialog();
  initPatternsPage();
  initDaisArch();
  initSparkSimulator();
  initMobileDrawers();
  setStatusDate();

  // Initialize 3D scene engine
  initSceneWhenReady();

  // Set default view mode to 2D Architecture Matrix (or ?mode=3d if requested)
  const params = new URLSearchParams(window.location.search);
  const initialMode = params.get('mode') === '3d' ? '3d' : '2d';
  switchViewportMode(initialMode);
  document.getElementById('loading')?.classList.add('hidden');
});

function initSparkSimulator() {
  const mount = document.getElementById('simulator-mount');
  if (mount && !mount.hasChildNodes()) {
    mount.appendChild(renderSparkSimulator());
  }
}

function initDaisArch() {
  const mount = document.getElementById('dais-arch-mount');
  if (mount && !mount.hasChildNodes()) {
    mount.appendChild(renderDaisArchitecture());
  }
}

// ── Viewport Mode Switcher (3D Board vs 2D Matrix) ────────
function initViewportModes() {
  const btn3d = document.getElementById('btn-mode-3d');
  const btn2d = document.getElementById('btn-mode-2d');
  const matrixView = document.getElementById('matrix-canvas-view');

  if (btn3d && btn2d) {
    btn3d.addEventListener('click', () => switchViewportMode('3d'));
    btn2d.addEventListener('click', () => switchViewportMode('2d'));
  }

  // Render 2D matrix initially
  if (matrixView) {
    render2DMatrix(matrixView, handleSceneSelect);
  }
}

function switchViewportMode(mode) {
  currentViewportMode = mode;
  const btn3d = document.getElementById('btn-mode-3d');
  const btn2d = document.getElementById('btn-mode-2d');
  const sceneEl = document.getElementById('scene');
  const matrixEl = document.getElementById('matrix-canvas-view');
  const camBar = document.getElementById('cam-mode-bar');
  const bottomCtrls = document.querySelector('.bottom-controls');
  const layerElevator = document.getElementById('layer-elevator-bar');
  const viewTools = document.getElementById('view-tools');
  const sceneHeading = document.getElementById('scene-heading');

  if (mode === '3d') {
    btn3d?.classList.add('active');
    btn2d?.classList.remove('active');
    if (sceneEl) {
      sceneEl.style.display = 'block';
      resizeRenderer(sceneEl);
    }
    if (matrixEl) matrixEl.classList.remove('active');
    if (camBar) camBar.style.display = 'flex';
    if (bottomCtrls) bottomCtrls.style.display = 'flex';
    if (layerElevator) layerElevator.style.display = 'flex';
    if (viewTools) viewTools.style.display = 'flex';
    if (sceneHeading) sceneHeading.style.display = 'block';
    try { history.replaceState(null, '', '?mode=3d'); } catch(e) {}
  } else {
    btn2d?.classList.add('active');
    btn3d?.classList.remove('active');
    if (sceneEl) sceneEl.style.display = 'none';
    if (matrixEl) matrixEl.classList.add('active');
    if (camBar) camBar.style.display = 'none';
    if (bottomCtrls) bottomCtrls.style.display = 'none';
    if (layerElevator) layerElevator.style.display = 'none';
    if (viewTools) viewTools.style.display = 'none';
    if (sceneHeading) sceneHeading.style.display = 'none';
    try { history.replaceState(null, '', window.location.pathname); } catch(e) {}
  }
}

// ── Camera Angle Switcher (ISO / TOP) ───────────────────────
function initCameraButtons() {
  const btnIso = document.getElementById('btn-cam-iso');
  const btnTop = document.getElementById('btn-cam-top');

  btnIso?.addEventListener('click', () => {
    btnIso.classList.add('active');
    btnTop?.classList.remove('active');
    setCameraMode('iso');
  });

  btnTop?.addEventListener('click', () => {
    btnTop.classList.add('active');
    btnIso?.classList.remove('active');
    setCameraMode('top');
  });
}

// ── Scene ──────────────────────────────────────────────────
function initSceneWhenReady() {
  const container = document.getElementById('scene');
  if (!container) return;

  initScene(container, handleSceneSelect);
  document.getElementById('loading')?.classList.add('hidden');
}

/**
 * Called when user clicks in the 3D scene.
 * Updates inspector + nav ONLY (does NOT call back into scene).
 */
function handleSceneSelect(sel) {
  if (_selecting) return;
  _selecting = true;
  try {
    if (!sel) {
      showWelcome();
      setActiveLayerSilent(null);
      updateSceneHeading('PLATFORM OVERVIEW', 'Data Intelligence Platform', 'Click a layer or component to explore.');
      return;
    }
    if (sel.type === 'layer') {
      const layer = LAYERS.find(l => l.id === sel.id);
      showLayerDetail(sel.id);
      setActiveLayerSilent(sel.id);
      if (layer) updateSceneHeading(layer.name.toUpperCase(), layer.name, layer.shortDesc);
      openMobileInspector(layer?.name);
    } else if (sel.type === 'component') {
      const comp = COMPONENT_MAP[sel.id];
      showCompDetail(sel.id);
      if (comp) {
        setActiveCompSilent(sel.id, comp.layerId);
        updateSceneHeading(comp.layerName.toUpperCase(), comp.name, comp.subtitle || '');
        openMobileInspector(comp.name);
      }
    }
  } finally {
    _selecting = false;
  }
}

function scrollMatrixTo(selector) {
  if (currentViewportMode !== '2d') return;
  const container = document.getElementById('matrix-canvas-view');
  if (!container) return;
  const target = container.querySelector(selector);
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

/**
 * Called when user clicks a layer in the LEFT NAV sidebar.
 * Updates scene + inspector ONLY (does NOT call back into nav).
 */
function handleNavLayerClick(layerId) {
  if (_selecting) return;
  _selecting = true;
  try {
    if (!layerId) {
      showWelcome();
      clearSelection();
      clearMatrixHighlights(document.getElementById('matrix-canvas-view'));
      updateSceneHeading('PLATFORM OVERVIEW', 'Data Intelligence Platform', 'Click a layer or component to explore.');
      return;
    }
    const layer = LAYERS.find(l => l.id === layerId);
    showLayerDetail(layerId);
    selectItem('layer', layerId);
    highlightMatrixLayer(layerId);
    scrollMatrixTo(`.matrix-layer[data-layer-id="${layerId}"]`);
    if (layer) updateSceneHeading(layer.name.toUpperCase(), layer.name, layer.shortDesc);
    closeMobileSidebar();
    openMobileInspector(layer?.name);
  } finally {
    _selecting = false;
  }
}

/**
 * Called when user clicks a component in the LEFT NAV sidebar.
 * Updates scene + inspector ONLY (does NOT call back into nav).
 */
function handleNavCompClick(compId, layerId) {
  if (_selecting) return;
  _selecting = true;
  try {
    const comp = COMPONENT_MAP[compId];
    showCompDetail(compId);
    selectItem('component', compId);
    highlightMatrixComponent(compId);
    scrollMatrixTo(`#mcard-${compId}`);
    if (comp) updateSceneHeading(comp.layerName.toUpperCase(), comp.name, comp.subtitle || '');
    closeMobileSidebar();
    openMobileInspector(comp?.name);
  } finally {
    _selecting = false;
  }
}

// ── Inspector event (from inspector.js clicking connections) ──
document.addEventListener('inspector:selectComp', (e) => {
  if (_selecting) return;
  _selecting = true;
  try {
    const { compId, layerId } = e.detail;
    const comp = COMPONENT_MAP[compId];
    showCompDetail(compId);
    selectItem('component', compId);
    highlightMatrixComponent(compId);
    scrollMatrixTo(`#mcard-${compId}`);
    if (comp) {
      setActiveCompSilent(compId, comp.layerId);
      updateSceneHeading(comp.layerName.toUpperCase(), comp.name, comp.subtitle || '');
      openMobileInspector(comp.name);
    }
  } finally {
    _selecting = false;
  }
});

// ── Breadcrumbs / heading ──────────────────────────────────
function updateSceneHeading(crumb, title, subtitle) {
  const bc = document.getElementById('breadcrumbs');
  const ti = document.getElementById('scene-title');
  const su = document.getElementById('scene-subtitle');
  if (bc) bc.innerHTML = `<span>PLATFORM OVERVIEW</span><span class="breadcrumb-sep">›</span><span>${crumb}</span>`;
  if (ti) ti.textContent = title;
  if (su) su.textContent = subtitle;
}

// ── View tabs ──────────────────────────────────────────────
function initViewTabs() {
  document.querySelectorAll('.view-tab').forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });
  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get('tab') || params.get('view') || 'explorer';
  switchView(initialTab);
}

function switchView(view) {
  // Update tab active states
  document.querySelectorAll('.view-tab').forEach(t => {
    const isActive = t.dataset.view === view;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      try {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      } catch (e) {}
    }
  });

  const workspace = document.getElementById('main-workspace');
  const mobToggle = document.getElementById('mobile-sidebar-toggle');
  const floatBtn = document.getElementById('mobile-floating-detail-btn');

  // Close any open mobile drawers when switching views
  closeMobileSidebar();
  closeMobileInspector();

  if (view === 'explorer') {
    // Restore grid / flex for the explorer
    if (window.innerWidth > 960) {
      workspace.style.display = 'grid';
    } else {
      workspace.style.display = 'flex';
    }
    document.getElementById('explorer-panel').style.display = 'contents';
    document.getElementById('architecture-panel').style.display = 'none';
    document.getElementById('patterns-panel').style.display = 'none';
    document.getElementById('simulator-panel').style.display = 'none';
    if (mobToggle) mobToggle.style.display = '';
  } else {
    // Full-width single column for page views
    workspace.style.display = 'block';
    document.getElementById('explorer-panel').style.display = 'none';
    document.getElementById('architecture-panel').style.display = view === 'architecture' ? 'block' : 'none';
    document.getElementById('patterns-panel').style.display = view === 'patterns' ? 'block' : 'none';
    document.getElementById('simulator-panel').style.display = view === 'simulator' ? 'block' : 'none';
    if (mobToggle) mobToggle.style.display = 'none';
    if (floatBtn) floatBtn.style.display = 'none';
    // Make page views scrollable
    ['architecture-panel', 'patterns-panel', 'simulator-panel'].forEach(id => {
      const el = document.getElementById(id);
      if (el && el.style.display !== 'none') {
        el.style.overflowY = 'auto';
        el.style.height = '100%';
      }
    });

    if (view === 'simulator') {
      // Trigger smooth resize/recalculation of animated SVG flow arrows and coordinates
      requestAnimationFrame(() => {
        window.dispatchEvent(new Event('resize'));
      });
    }
  }
}

// ── Toolbar controls ───────────────────────────────────────
function initControls() {
  // Zoom & Pan
  document.getElementById('zoom-in')?.addEventListener('click', zoomIn);
  document.getElementById('zoom-out')?.addEventListener('click', zoomOut);
  document.getElementById('pan-up')?.addEventListener('click', panUp);
  document.getElementById('pan-down')?.addEventListener('click', panDown);
  document.getElementById('reset-view')?.addEventListener('click', resetCamera);

  // Layer Elevator (in 3D Mode)
  const elevatorBtns = document.querySelectorAll('.elevator-btn:not(.reset)');
  elevatorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      elevatorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const layerId = btn.dataset.layerId;
      handleNavLayerClick(layerId);
      setActiveLayerSilent(layerId);
      focusLayer(layerId);
    });
  });

  const elevReset = document.getElementById('elevator-reset-btn');
  elevReset?.addEventListener('click', () => {
    elevatorBtns.forEach(b => b.classList.remove('active'));
    handleNavLayerClick(null);
    setActiveLayerSilent(null);
    clearSelection();
    resetCamera();
  });

  // Stacked / Exploded
  const stackedBtn   = document.getElementById('stacked-btn');
  const explodedBtn  = document.getElementById('exploded-btn');
  stackedBtn?.addEventListener('click', () => {
    setExploded(false);
    stackedBtn.setAttribute('aria-pressed', 'true');
    explodedBtn?.setAttribute('aria-pressed', 'false');
  });
  explodedBtn?.addEventListener('click', () => {
    setExploded(true);
    stackedBtn?.setAttribute('aria-pressed', 'false');
    explodedBtn.setAttribute('aria-pressed', 'true');
  });

  // Separation slider
  const sep = document.getElementById('separation');
  const sepVal = document.getElementById('sep-value');
  sep?.addEventListener('input', () => {
    const v = +sep.value;
    setSeparation(v);
    if (sepVal) sepVal.textContent = v + '%';
  });

  // OSS toggle
  const ossBtn = document.getElementById('oss-toggle');
  let ossActive = false;
  ossBtn?.addEventListener('click', () => {
    ossActive = !ossActive;
    ossBtn.classList.toggle('active', ossActive);
    highlightOpenSource(ossActive);
  });
}

// ── Help dialog ────────────────────────────────────────────
function initHelpDialog() {
  const dialog   = document.getElementById('help-dialog');
  const openBtn  = document.getElementById('help-btn');
  const closeBtn = document.getElementById('close-help');
  const doneBtn  = document.getElementById('help-done');

  openBtn?.addEventListener('click', () => dialog?.showModal());
  closeBtn?.addEventListener('click', () => dialog?.close());
  doneBtn?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

  // '?' key
  document.addEventListener('keydown', e => {
    if (e.key === '?' && !dialog?.open) dialog?.showModal();
    if (e.key === 'Escape' && dialog?.open) dialog.close();
  });
}

// ── Reference Patterns page (Aligned with Databricks Architecture Center) ──
function initPatternsPage() {
  const patterns = [
    {
      icon: '🏠',
      name: 'Lakehouse Architecture',
      desc: 'Unified architecture combining cloud storage scale with ACID transactions, time travel, schema enforcement, and central governance via Delta Lake and Unity Catalog.',
      tags: ['Delta Lake', 'Unity Catalog', 'Lakehouse'],
      color: '#1e40af',
      url: 'https://www.databricks.com/resources/architectures',
    },
    {
      icon: '⚡',
      name: 'Real-Time Streaming & LTAP',
      desc: 'Sub-second streaming analytics: ingest high-velocity telemetry from Apache Kafka, AWS Kinesis, or Event Hubs with Structured Streaming into Delta Lake. Power concurrent live BI and real-time inference via Hybrid Transactional/Analytical Processing (LTAP).',
      tags: ['Structured Streaming', 'Kafka', 'Delta Lake', 'LTAP'],
      color: '#0f766e',
      url: 'https://docs.databricks.com/aws/en/structured-streaming/concepts',
    },
    {
      icon: '🔮',
      name: 'Generative AI & Agentic RAG',
      desc: 'Production enterprise RAG and multi-agent systems: ingest unstructured documents into Unity Catalog Volumes, generate embeddings with Mosaic AI Foundation Models, index with Vector Search, orchestrate agents, and deploy with low-latency Model Serving.',
      tags: ['Mosaic AI', 'Vector Search', 'Model Serving', 'Agentic AI'],
      color: '#7c3aed',
      url: 'https://docs.databricks.com/aws/en/ai-search/ai-search',
    },
    {
      icon: '🔄',
      name: 'Lakehouse ETL Modernization',
      desc: 'Modernize legacy batch ETL systems (Informatica, Talend, SSIS) with Databricks Lakeflow. Features automated CDC ingestion via Lakeflow Connect, declarative autoscaling transformations with Lakeflow Pipelines (DLT), automated data quality testing, and end-to-end Unity Catalog lineage.',
      tags: ['Lakeflow', 'Delta Lake', 'Unity Catalog', 'CDC Ingestion'],
      color: '#15803d',
      url: 'https://docs.databricks.com/aws/en/ldp',
    },
    {
      icon: '🌐',
      name: 'Multi-Cloud Lakehouse Architecture',
      desc: 'Enterprise multi-cloud architecture deploying Databricks across AWS, Azure, and Google Cloud. Clearly isolates the Databricks-managed Control Plane from customer Cloud Compute Planes. Unity Catalog provides unified cross-cloud governance, while Delta Sharing enables real-time data exchange without replication.',
      tags: ['Control Plane', 'Compute Plane', 'Unity Catalog', 'Multi-Cloud'],
      color: '#1d4ed8',
      url: 'https://docs.databricks.com/aws/en/getting-started/high-level-architecture',
    },
    {
      icon: '🏗️',
      name: 'Medallion Architecture (Bronze · Silver · Gold)',
      desc: 'Multi-hop data quality pipeline: raw data ingested into Bronze (append-only), cleaned and enriched into Silver (conformed/validated), and curated into Gold (business-ready data products) — all managed declaratively on Delta Lake.',
      tags: ['Bronze/Silver/Gold', 'Delta Lake', 'Lakeflow'],
      color: '#b45309',
      url: 'https://docs.databricks.com/aws/en/lakehouse/medallion',
    },
    {
      icon: '📊',
      name: 'Self-Service BI & Conversational Analytics',
      desc: 'High-concurrency serverless data warehousing accelerated by the Photon C++ engine. Seamlessly connects to Power BI and Tableau, with Databricks AI/BI Dashboards and Genie for conversational natural-language insights.',
      tags: ['Databricks SQL', 'Photon', 'AI/BI Genie'],
      color: '#0369a1',
      url: 'https://docs.databricks.com/aws/en/sql/',
    },
    {
      icon: '🛡️',
      name: 'Open Data Sharing & Clean Rooms',
      desc: 'Open, cross-platform data sharing without copying or moving data. Securely share live Delta Lake tables, partitions, and AI models across organizations, clouds, and tools with audit logging and privacy-preserving Clean Rooms.',
      tags: ['Delta Sharing', 'Clean Rooms', 'Governance'],
      color: '#dc2626',
      url: 'https://docs.databricks.com/aws/en/delta-sharing/',
    },
  ];

  const grid = document.getElementById('patterns-grid');
  if (!grid) return;

  grid.innerHTML = patterns.map(p => `
    <a href="${p.url}" target="_blank" rel="noopener noreferrer" class="pattern-card anim-slide-up">
      <div class="pattern-card-icon" style="background: color-mix(in srgb, ${p.color} 20%, transparent)">
        <span>${p.icon}</span>
      </div>
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <div class="pattern-card-footer">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          ${p.tags.map(t => `<span class="pattern-tag">${t}</span>`).join('')}
        </div>
        <span class="pattern-arrow">→</span>
      </div>
    </a>
  `).join('');
}

// ── Status bar date ────────────────────────────────────────
function setStatusDate() {
  const el = document.getElementById('verified-date');
  if (el) {
    const d = new Date();
    el.textContent = d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  }
}

// ── Mobile Drawer Controllers ──────────────────────────────
export function openMobileInspector(compName) {
  if (window.innerWidth > 960) return;
  const inspector = document.getElementById('inspector');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const sidebar = document.getElementById('sidebar');
  const floatBtn = document.getElementById('mobile-floating-detail-btn');
  const nameEl = document.getElementById('mobile-floating-comp-name');

  inspector?.classList.add('mobile-open');
  backdrop?.classList.add('visible');
  sidebar?.classList.remove('mobile-open');

  if (floatBtn && compName) {
    if (nameEl) nameEl.textContent = compName;
    floatBtn.style.display = 'inline-flex';
  }
}

export function closeMobileInspector() {
  const inspector = document.getElementById('inspector');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const sidebar = document.getElementById('sidebar');

  inspector?.classList.remove('mobile-open');
  if (!sidebar?.classList.contains('mobile-open')) {
    backdrop?.classList.remove('visible');
  }
}

export function openMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const inspector = document.getElementById('inspector');

  sidebar?.classList.add('mobile-open');
  backdrop?.classList.add('visible');
  inspector?.classList.remove('mobile-open');
}

export function closeMobileSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const inspector = document.getElementById('inspector');

  sidebar?.classList.remove('mobile-open');
  if (!inspector?.classList.contains('mobile-open')) {
    backdrop?.classList.remove('visible');
  }
}

function initMobileDrawers() {
  const toggleBtn = document.getElementById('mobile-sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarClose = document.getElementById('sidebar-close-btn');
  const inspectorClose = document.getElementById('inspector-close-btn');
  const backdrop = document.getElementById('mobile-drawer-backdrop');
  const floatBtn = document.getElementById('mobile-floating-detail-btn');

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    if (sidebar?.classList.contains('mobile-open')) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });

  sidebarClose?.addEventListener('click', closeMobileSidebar);
  inspectorClose?.addEventListener('click', closeMobileInspector);
  floatBtn?.addEventListener('click', () => openMobileInspector());

  backdrop?.addEventListener('click', () => {
    closeMobileSidebar();
    closeMobileInspector();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) {
      closeMobileSidebar();
      closeMobileInspector();
      if (floatBtn) floatBtn.style.display = 'none';
    }
  });
}
