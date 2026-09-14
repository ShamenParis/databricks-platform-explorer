/**
 * DATABRICKS PLATFORM EXPLORER — Left Sidebar Navigation
 */

import { LAYERS, TOTAL_COMPONENTS } from './data.js';
import { renderIcon, renderLayerIcon } from './icons.js';

let activeLayerId   = null;
let activeCompId    = null;
let expandedLayerId = null;
let onLayerSelect   = () => {};
let onCompSelect    = () => {};

// ── Bootstrap ──────────────────────────────────────────────
export function initNav(onLayer, onComp) {
  onLayerSelect = onLayer;
  onCompSelect  = onComp;

  document.getElementById('component-count').textContent = `${TOTAL_COMPONENTS} components`;
  buildLayerNav();
  buildOverviewButton();
}

// ── Overview button ────────────────────────────────────────
function buildOverviewButton() {
  const btn = document.getElementById('overview-btn');
  if (!btn) return;
  btn.classList.add('active');
  btn.addEventListener('click', () => {
    clearActive();
    btn.classList.add('active');
    onLayerSelect(null);
  });
}

// ── Layer nav ──────────────────────────────────────────────
function buildLayerNav() {
  const nav = document.getElementById('layer-nav');
  if (!nav) return;
  nav.innerHTML = '';

  const stackLayers = LAYERS.filter(l => l.isStack);
  const baseLayers = LAYERS.filter(l => !l.isStack);

  // Section 1: Platform Stack
  const sec1Hdr = document.createElement('div');
  sec1Hdr.className = 'sidebar-section-hdr';
  sec1Hdr.textContent = 'PLATFORM LAYERS';
  nav.appendChild(sec1Hdr);

  stackLayers.forEach(layer => appendLayerItem(nav, layer));

  // Section 2: Across the Platform
  const sec2Hdr = document.createElement('div');
  sec2Hdr.className = 'sidebar-section-hdr';
  sec2Hdr.style.marginTop = '16px';
  sec2Hdr.textContent = 'ACROSS THE PLATFORM';
  nav.appendChild(sec2Hdr);

  baseLayers.forEach(layer => appendLayerItem(nav, layer));
}

function appendLayerItem(nav, layer) {
  // Layer button
  const btn = document.createElement('button');
  btn.className = 'layer-btn';
  btn.id = `layer-btn-${layer.id}`;
  btn.style.setProperty('--layer-color', layer.color);
  btn.dataset.layerId = layer.id;
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `
    ${layer.num ? `<span class="layer-num-pill" style="background:${layer.color}">${layer.num}</span>` : `<span class="layer-icon-wrap">${renderLayerIcon(layer.id, { size: 14, color: layer.color })}</span>`}
    <span class="layer-name">${layer.name}</span>
    <span class="layer-count">${layer.components.length}</span>
    <svg class="chevron" viewBox="0 0 24 24" aria-hidden="true" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <path d="m9 5 7 7-7 7"/>
    </svg>
  `;
  btn.addEventListener('click', () => handleLayerClick(layer.id));
  nav.appendChild(btn);

  // Component sub-list
  const list = document.createElement('div');
  list.className = 'component-list';
  list.id = `comp-list-${layer.id}`;
  layer.components.forEach(comp => {
    const cb = document.createElement('button');
    cb.className = 'component-btn';
    cb.id = `comp-btn-${comp.id}`;
    cb.dataset.compId = comp.id;
    cb.innerHTML = `
      <span class="comp-icon-wrap">${renderIcon(comp.id, { size: 14, color: layer.color })}</span>
      <span class="comp-name">${comp.name}</span>
    `;
    cb.addEventListener('click', (e) => {
      e.stopPropagation();
      handleCompClick(comp.id, layer.id);
    });
    list.appendChild(cb);
  });
  nav.appendChild(list);
}

// ── Handlers ───────────────────────────────────────────────
function handleLayerClick(layerId) {
  const isAlreadyActive = activeLayerId === layerId && expandedLayerId === layerId;

  clearActive();
  document.getElementById('overview-btn')?.classList.remove('active');

  if (!isAlreadyActive) {
    activeLayerId   = layerId;
    expandedLayerId = layerId;

    const btn  = document.getElementById(`layer-btn-${layerId}`);
    const list = document.getElementById(`comp-list-${layerId}`);
    btn?.classList.add('active');
    btn?.setAttribute('aria-expanded', 'true');
    list?.classList.add('expanded');
    onLayerSelect(layerId);
  } else {
    document.getElementById('overview-btn')?.classList.add('active');
    onLayerSelect(null);
  }
}

function handleCompClick(compId, layerId) {
  clearCompActive();
  activeCompId = compId;
  const cb = document.getElementById(`comp-btn-${compId}`);
  cb?.classList.add('active');
  markDiscovered(compId);
  onCompSelect(compId, layerId);
}

// ── State helpers ──────────────────────────────────────────
function clearActive() {
  // Clear layer
  if (activeLayerId) {
    document.getElementById(`layer-btn-${activeLayerId}`)?.classList.remove('active');
    document.getElementById(`layer-btn-${activeLayerId}`)?.setAttribute('aria-expanded', 'false');
    document.getElementById(`comp-list-${activeLayerId}`)?.classList.remove('expanded');
  }
  clearCompActive();
  activeLayerId   = null;
  expandedLayerId = null;
}

function clearCompActive() {
  if (activeCompId) {
    document.getElementById(`comp-btn-${activeCompId}`)?.classList.remove('active');
  }
  activeCompId = null;
}

export function setActiveLayer(layerId) {
  clearActive();
  if (!layerId) {
    document.getElementById('overview-btn')?.classList.add('active');
    return;
  }
  activeLayerId   = layerId;
  expandedLayerId = layerId;
  document.getElementById(`layer-btn-${layerId}`)?.classList.add('active');
  document.getElementById(`comp-list-${layerId}`)?.classList.add('expanded');
  // NOTE: does NOT call onLayerSelect — callbacks are handled by handleNavLayerClick in main.js
}

/** Update sidebar visuals WITHOUT triggering any callbacks (used by main.js to avoid loops) */
export function setActiveLayerSilent(layerId) {
  clearActive();
  if (!layerId) {
    document.getElementById('overview-btn')?.classList.add('active');
    return;
  }
  activeLayerId   = layerId;
  expandedLayerId = layerId;
  document.getElementById(`layer-btn-${layerId}`)?.classList.add('active');
  document.getElementById(`layer-btn-${layerId}`)?.setAttribute('aria-expanded', 'true');
  document.getElementById(`comp-list-${layerId}`)?.classList.add('expanded');
}

export function setActiveComp(compId, layerId) {
  setActiveLayer(layerId);
  clearCompActive();
  activeCompId = compId;
  document.getElementById(`comp-btn-${compId}`)?.classList.add('active');
  markDiscovered(compId);
}

/** Update sidebar visuals WITHOUT triggering any callbacks */
export function setActiveCompSilent(compId, layerId) {
  setActiveLayerSilent(layerId);
  clearCompActive();
  activeCompId = compId;
  document.getElementById(`comp-btn-${compId}`)?.classList.add('active');
  markDiscovered(compId);
}

// ── Discovery tracking ─────────────────────────────────────
const discovered = new Set();

function markDiscovered(compId) {
  if (!discovered.has(compId)) {
    discovered.add(compId);
    document.getElementById(`comp-btn-${compId}`)?.classList.add('discovered');
    updateDiscoveryCount();
  }
}

function updateDiscoveryCount() {
  const el = document.getElementById('discovery-count');
  if (el) el.textContent = `${discovered.size} explored`;
}
