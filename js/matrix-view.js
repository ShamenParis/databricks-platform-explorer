/**
 * DATABRICKS PLATFORM EXPLORER — 2D Interactive Architecture Matrix
 * 
 * Provides a clean, flat, highly intuitive alternative to 3D.
 * Displays all 5 layers + baseboard with full connection tracing,
 * guided data journeys, and real vector icons.
 */

import { LAYERS, COMPONENT_MAP, DATA_JOURNEYS } from './data.js';
import { renderIcon, renderLayerIcon } from './icons.js';

let activeSelectCallback = () => {};
let currentActiveCompId = null;
let currentActiveJourney = null;

export function render2DMatrix(container, onSelect) {
  activeSelectCallback = onSelect;
  container.innerHTML = '';

  const wrap = document.createElement('div');
  wrap.className = 'matrix-wrapper';

  // 1. Data Journeys Header Bar
  wrap.innerHTML = `
    <!-- Top Bar: Guided Data Stories -->
    <div class="matrix-journeys-bar">
      <span class="journey-label">FOLLOW THE DATA:</span>
      <div class="journey-buttons">
        ${DATA_JOURNEYS.map(j => `
          <button class="journey-btn" data-journey-id="${j.id}">
            <span class="j-play">▶</span>
            <span class="j-title">${j.title}</span>
            <span class="j-badge">${j.steps.length} steps</span>
          </button>
        `).join('')}
        <button class="journey-btn reset" id="journey-reset-btn" style="display:none;">✕ Clear path</button>
      </div>
    </div>

    <!-- 2. Main 5-Tier Architecture Swimlanes -->
    <div class="matrix-swimlanes" id="matrix-swimlanes">
      ${LAYERS.filter(l => l.isStack).map(layer => `
        <div class="matrix-layer" data-layer-id="${layer.id}" style="--lcolor: ${layer.color};">
          <div class="matrix-layer-hdr">
            <span class="mlayer-num">${layer.num}</span>
            <div class="mlayer-meta">
              <div class="mlayer-title">${layer.name}</div>
              <div class="mlayer-desc">${layer.shortDesc}</div>
            </div>
          </div>
          <div class="matrix-layer-grid">
            ${layer.components.map(comp => `
              <div class="matrix-card" id="mcard-${comp.id}" data-comp-id="${comp.id}" data-layer-id="${layer.id}">
                <div class="mcard-icon">
                  ${renderIcon(comp.id, { size: 20, color: layer.color })}
                </div>
                <div class="mcard-text">
                  <div class="mcard-name">${comp.name}</div>
                  <div class="mcard-sub">${comp.subtitle}</div>
                </div>
                ${comp.opensrc ? '<span class="mcard-oss">OSS</span>' : ''}
                <span class="mcard-step-badge" id="mstep-${comp.id}"></span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>

    <!-- 3. Across Platform Foundation Row -->
    <div class="matrix-baseboard-hdr">ACROSS THE PLATFORM</div>
    <div class="matrix-baseboard-grid">
      ${LAYERS.filter(l => !l.isStack).map(layer => `
        <div class="matrix-base-col" data-layer-id="${layer.id}">
          <div class="mbase-col-title" style="color:${layer.color}">
            ${renderLayerIcon(layer.id, { size: 14, color: layer.color })}
            ${layer.name}
          </div>
          <div class="mbase-cards">
            ${layer.components.map(comp => `
              <div class="matrix-card sm" id="mcard-${comp.id}" data-comp-id="${comp.id}" data-layer-id="${layer.id}">
                <div class="mcard-icon sm">
                  ${renderIcon(comp.id, { size: 14, color: layer.color })}
                </div>
                <div class="mcard-text">
                  <div class="mcard-name">${comp.name}</div>
                  <div class="mcard-sub">${comp.subtitle}</div>
                </div>
                ${comp.opensrc ? '<span class="mcard-oss">OSS</span>' : ''}
                <span class="mcard-step-badge" id="mstep-${comp.id}"></span>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;

  container.appendChild(wrap);

  // Setup Interactivity
  setupMatrixEvents(wrap);
}

function setupMatrixEvents(wrap) {
  // Component Card Clicks
  wrap.querySelectorAll('.matrix-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.stopPropagation();
      const compId = card.dataset.compId;
      highlightMatrixComponent(compId);
      activeSelectCallback({ type: 'component', id: compId });
    });
  });

  // Layer Header Clicks
  wrap.querySelectorAll('.matrix-layer-hdr').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const layerId = hdr.closest('.matrix-layer').dataset.layerId;
      highlightMatrixLayer(layerId);
      activeSelectCallback({ type: 'layer', id: layerId });
    });
  });

  // Guided Journey Clicks
  wrap.querySelectorAll('.journey-btn:not(.reset)').forEach(btn => {
    btn.addEventListener('click', () => {
      const jId = btn.dataset.journeyId;
      activateJourney(jId, wrap);
    });
  });

  const resetBtn = wrap.querySelector('#journey-reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      clearMatrixHighlights(wrap);
      activeSelectCallback(null);
    });
  }
}

export function highlightMatrixComponent(compId) {
  const comp = COMPONENT_MAP[compId];
  if (!comp) return;

  const wrap = document.querySelector('.matrix-wrapper');
  if (!wrap) return;

  currentActiveCompId = compId;

  // Clear previous highlights
  wrap.querySelectorAll('.matrix-card').forEach(c => {
    c.classList.remove('active', 'connected-upstream', 'connected-downstream', 'dimmed');
  });

  // Mark active
  const activeCard = wrap.querySelector(`#mcard-${compId}`);
  if (activeCard) activeCard.classList.add('active');

  const conns = comp.connections || [];

  // Dim unrelated cards, highlight connected
  wrap.querySelectorAll('.matrix-card').forEach(c => {
    const cId = c.dataset.compId;
    if (cId === compId) {
      // active
    } else if (conns.includes(cId)) {
      c.classList.add('connected-downstream');
    } else {
      c.classList.add('dimmed');
    }
  });

  // Highlight active layer header
  wrap.querySelectorAll('.matrix-layer').forEach(l => {
    l.classList.toggle('active-layer', l.dataset.layerId === comp.layerId);
  });
}

export function highlightMatrixLayer(layerId) {
  const wrap = document.querySelector('.matrix-wrapper');
  if (!wrap) return;

  wrap.querySelectorAll('.matrix-layer').forEach(l => {
    l.classList.toggle('active-layer', l.dataset.layerId === layerId);
  });

  wrap.querySelectorAll('.matrix-card').forEach(c => {
    const isThisLayer = c.dataset.layerId === layerId;
    c.classList.toggle('dimmed', !isThisLayer);
    c.classList.remove('active', 'connected-downstream');
  });
}

export function activateJourney(journeyId, wrap = document.querySelector('.matrix-wrapper')) {
  if (!wrap) return;
  const journey = DATA_JOURNEYS.find(j => j.id === journeyId);
  if (!journey) return;

  currentActiveJourney = journeyId;

  // Update journey buttons
  wrap.querySelectorAll('.journey-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.journeyId === journeyId);
  });
  const resetBtn = wrap.querySelector('#journey-reset-btn');
  if (resetBtn) resetBtn.style.display = 'inline-flex';

  // Dim all cards
  wrap.querySelectorAll('.matrix-card').forEach(c => {
    c.classList.add('dimmed');
    c.classList.remove('active', 'journey-node');
    const badge = c.querySelector('.mcard-step-badge');
    if (badge) badge.textContent = '';
  });

  // Light up journey steps sequentially
  journey.steps.forEach((step, idx) => {
    const card = wrap.querySelector(`#mcard-${step.id}`);
    if (card) {
      card.classList.remove('dimmed');
      card.classList.add('journey-node');
      const badge = card.querySelector('.mcard-step-badge');
      if (badge) {
        badge.textContent = `Step ${idx + 1}`;
      }
    }
  });

  // Select the first component in the journey
  if (journey.steps.length > 0) {
    const firstId = journey.steps[0].id;
    activeSelectCallback({ type: 'component', id: firstId });
  }
}

export function clearMatrixHighlights(wrap = document.querySelector('.matrix-wrapper')) {
  if (!wrap) return;
  currentActiveCompId = null;
  currentActiveJourney = null;

  wrap.querySelectorAll('.matrix-card').forEach(c => {
    c.classList.remove('active', 'connected-upstream', 'connected-downstream', 'dimmed', 'journey-node');
    const badge = c.querySelector('.mcard-step-badge');
    if (badge) badge.textContent = '';
  });

  wrap.querySelectorAll('.matrix-layer').forEach(l => {
    l.classList.remove('active-layer');
  });

  wrap.querySelectorAll('.journey-btn').forEach(b => b.classList.remove('active'));
  const resetBtn = wrap.querySelector('#journey-reset-btn');
  if (resetBtn) resetBtn.style.display = 'none';
}
