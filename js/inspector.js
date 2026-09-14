/**
 * DATABRICKS PLATFORM EXPLORER — Inspector Panel
 * Renders component details in the right panel.
 */

import { LAYERS, COMPONENT_MAP } from './data.js';
import { renderIcon } from './icons.js';

// ── Bootstrap ──────────────────────────────────────────────
export function initInspector() {
  showWelcome();
}

// ── Welcome state ──────────────────────────────────────────
export function showWelcome() {
  const el = document.getElementById('detail-content');
  if (!el) return;
  el.innerHTML = `
    <div class="inspector-welcome anim-fade-in">
      <svg class="welcome-icon" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M24 6 38 14 24 22 10 14 24 6Z"/>
        <path d="M10 22l14 8 14-8"/>
        <path d="M10 30l14 8 14-8"/>
      </svg>
      <h3>Explore the Platform</h3>
      <p>Start with the whole ecosystem. Select any layer or component to inspect its architecture role, source code, and connections.</p>

      <div style="text-align:left;margin-top:24px;border-top:1px solid rgba(255,255,255,0.08);padding-top:16px;">
        <div style="font-size:10px;font-weight:700;letter-spacing:0.1em;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">
          FOLLOW THE DATA
        </div>
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div class="journey-card" data-jid="source-to-dashboard" role="button" tabindex="0">
            <div style="font-weight:600;font-size:12.5px;color:#fff;">From source to dashboard</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">7 steps · Ingestion, tables, SQL and BI</div>
          </div>
          <div class="journey-card" data-jid="build-ai-app" role="button" tabindex="0">
            <div style="font-weight:600;font-size:12.5px;color:#fff;">Build a GenAI application</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">6 steps · Documents, retrieval and serving</div>
          </div>
          <div class="journey-card" data-jid="realtime-streaming" role="button" tabindex="0">
            <div style="font-weight:600;font-size:12.5px;color:#fff;">Real-Time Streaming & LTAP</div>
            <div style="font-size:11px;color:var(--text-muted);margin-top:2px;">5 steps · High-concurrency live analytics</div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Wire journey cards
  el.querySelectorAll('.journey-card').forEach(card => {
    card.addEventListener('click', () => {
      const journeyId = card.dataset.jid;
      document.dispatchEvent(new CustomEvent('journey:activate', { detail: { journeyId } }));
    });
  });
}

// ── Show layer overview ────────────────────────────────────
export function showLayerDetail(layerId) {
  const layer = LAYERS.find(l => l.id === layerId);
  if (!layer) return;

  const el = document.getElementById('detail-content');
  if (!el) return;

  const compList = layer.components.map(c => `
    <div class="connection-item" data-comp-id="${c.id}" role="button" tabindex="0">
      <span class="conn-dot" style="background:${layer.color}"></span>
      <span>${c.name}</span>
      <span class="conn-arrow">›</span>
    </div>
  `).join('');

  el.innerHTML = `
    <div class="detail-view anim-slide-up">
      <div class="detail-header">
        <span class="detail-layer-tag">
          <span class="detail-layer-dot" style="background:${layer.color}; box-shadow: 0 0 8px ${layer.color}"></span>
          Layer
        </span>
        <h2 class="detail-title">${layer.name}</h2>
        <p class="detail-desc" style="margin-top:4px">${layer.shortDesc}</p>
      </div>

      <div class="divider"></div>

      <div class="detail-section">
        <div class="detail-section-title">Components (${layer.components.length})</div>
        <div class="connection-list">${compList}</div>
      </div>
    </div>
  `;

  // Wire component clicks
  el.querySelectorAll('[data-comp-id]').forEach(item => {
    item.addEventListener('click', () => {
      const compId = item.dataset.compId;
      // Fire global event so main.js can wire scene + nav
      document.dispatchEvent(new CustomEvent('inspector:selectComp', { detail: { compId, layerId } }));
    });
  });
}

// ── Show component detail ──────────────────────────────────
export function showCompDetail(compId) {
  const comp = COMPONENT_MAP[compId];
  if (!comp) return;

  const el = document.getElementById('detail-content');
  if (!el) return;

  // Build connections list
  const connItems = (comp.connections || []).map(cid => {
    const c = COMPONENT_MAP[cid];
    if (!c) return '';
    return `
      <div class="connection-item" data-comp-id="${cid}" role="button" tabindex="0">
        <span class="conn-icon">${renderIcon(cid, { size: 14, color: c.layerColor })}</span>
        <span>${c.name}</span>
        <span class="conn-layer" style="color:${c.layerColor}">${c.layerName}</span>
        <span class="conn-arrow">›</span>
      </div>
    `;
  }).join('');

  // Build tags
  const tags = (comp.tags || []).map(t => `<span class="tag">${t}</span>`).join('');

  // OSS badge
  const ossBadge = comp.opensrc ? `
    <span class="oss-badge">
      <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="6" cy="5" r="3"/><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/>
        <path d="M6 8v8m0-3c7 0 12-1 12-5"/>
      </svg>
      Open Source
    </span>
  ` : '';

  el.innerHTML = `
    <div class="detail-view anim-slide-up">
      <div class="detail-header">
        <div class="detail-comp-icon">${renderIcon(comp.id, { size: 32, color: comp.layerColor })}</div>
        <span class="detail-layer-tag" style="color:${comp.layerColor}">
          <span class="detail-layer-dot" style="background:${comp.layerColor}; box-shadow: 0 0 8px ${comp.layerColor}"></span>
          ${comp.layerName}
        </span>
        <h2 class="detail-title">${comp.name}</h2>
        <p class="detail-subtitle">${comp.subtitle || ''}</p>
        ${ossBadge}
      </div>

      <div class="divider"></div>

      <div class="detail-section">
        <div class="detail-section-title">What it does</div>
        <p class="detail-desc">${comp.desc}</p>
      </div>

      ${tags ? `
      <div class="detail-section">
        <div class="detail-section-title">Tags</div>
        <div class="tag-list">${tags}</div>
      </div>
      ` : ''}

      ${connItems ? `
      <div class="detail-section">
        <div class="detail-section-title">Connected to</div>
        <div class="connection-list">${connItems}</div>
      </div>
      ` : ''}

      ${comp.docs ? `
      <a href="${comp.docs}" target="_blank" rel="noopener noreferrer" class="docs-link">
        View Databricks documentation
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 3h7v7m0-7L10 14M10 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5"/>
        </svg>
      </a>
      ` : ''}
    </div>
  `;

  // Wire connection clicks
  el.querySelectorAll('[data-comp-id]').forEach(item => {
    item.addEventListener('click', () => {
      const cid = item.dataset.compId;
      const c = COMPONENT_MAP[cid];
      if (c) {
        document.dispatchEvent(new CustomEvent('inspector:selectComp', { detail: { compId: cid, layerId: c.layerId } }));
      }
    });
  });
}
