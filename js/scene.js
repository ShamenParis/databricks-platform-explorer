/**
 * DATABRICKS PLATFORM EXPLORER — Scene Engine (Three.js)
 * 
 * Elegant 5-Layer Stack with:
 * - Generous, balanced layer spacing (all 5 layers always fully visible)
 * - Full pan & orbit controls (no bottom clipping, complete viewport control)
 * - ISO (Isometric 3D) ⟷ TOP (Overhead Architecture) camera modes
 * - Smooth camera framing when selecting layers or components
 * - High-definition component pedestal tiles with dynamic canvas icon textures
 * - Animated bezier connection pulses
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LAYERS, COMPONENT_MAP } from './data.js';
import { getIconSvg } from './icons.js';

// ── State ──────────────────────────────────────────────────
let renderer, scene, camera, controls, animId;
let layerMeshes   = {};   // layerId  → THREE.Mesh
let compMeshes    = {};   // compId   → THREE.Mesh
let connCurves    = [];   // active connection lines
let hoveredMesh   = null;
let selectedId    = null;
let selectedType  = null;
let onSelect      = () => {};

// Camera tween state
let camTweening   = false;
let camStartPos   = new THREE.Vector3();
let camEndPos     = new THREE.Vector3();
let camStartTgt   = new THREE.Vector3();
let camEndTgt     = new THREE.Vector3();
let camTweenStart = 0;
let camTweenDur   = 700; // ms

// Camera mode: 'iso' or 'top'
let currentCameraMode = 'iso';

// Geometry & Layout Constants
const PLATE_W     = 11.2;
const PLATE_D     = 6.6;
const PLATE_H     = 0.16;
const LAYER_GAP   = 2.1;    // Generous spacing between layers
const STEP_Z      = 1.5;    // Stepped cascade: upper layers set back, lower layers brought forward
const BASE_SEP    = 1.0;    // Multiplier for layer separation
let sepMultiplier = 1.0;

// Stack layer order from bottom (idx=0) to top (idx=4)
const STACK_LAYERS = LAYERS.filter(l => l.isStack).sort((a, b) => a.stackLevel - b.stackLevel);

// Default camera anchors
const ISO_CAM_POS  = new THREE.Vector3(0, 13, 17);
const ISO_CAM_TGT  = new THREE.Vector3(0, -0.4, 0);
const TOP_CAM_POS  = new THREE.Vector3(0, 20, 0.001);
const TOP_CAM_TGT  = new THREE.Vector3(0, 0, 0);

// Raycaster for mouse picking
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-999, -999);

// ── Init Scene ─────────────────────────────────────────────
export function initScene(container, selectCallback) {
  onSelect = selectCallback;

  // Safe dimensions even if container is hidden during initial load
  const width = container.clientWidth || (container.parentElement ? container.parentElement.clientWidth : 900) || 900;
  const height = container.clientHeight || (container.parentElement ? container.parentElement.clientHeight : 700) || 700;

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  container.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Camera — Framed so all 5 layers are 100% visible from top to bottom
  const aspect = width / height;
  camera = new THREE.PerspectiveCamera(38, aspect, 0.1, 400);
  camera.position.copy(ISO_CAM_POS);
  camera.lookAt(ISO_CAM_TGT);

  // Lights
  const ambient = new THREE.AmbientLight(0xffffff, 0.65);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.4);
  mainLight.position.set(12, 22, 14);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.bias = -0.0005;
  scene.add(mainLight);

  const rimLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
  rimLight.position.set(-12, 10, -10);
  scene.add(rimLight);

  const bottomFill = new THREE.DirectionalLight(0xff5722, 0.25);
  bottomFill.position.set(0, -12, 6);
  scene.add(bottomFill);

  // Controls — Full Orbit and Pan
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enablePan = true;
  controls.panSpeed = 1.0;
  controls.screenSpacePanning = true; // Allows natural up/down/left/right panning
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minPolarAngle = Math.PI / 16;
  controls.minDistance = 4;
  controls.maxDistance = 35;
  controls.target.copy(ISO_CAM_TGT);

  // Build the 3D Architecture
  buildStackPlates();
  buildComponentTiles();
  buildBaseboard();

  // Setup event listeners
  setupMouseEvents(container);
  setupResize(container);

  // Start animation loop
  animate(0);
}

// ── 1. Build the 5 Primary Stack Layer Boards ──────────────
function getLayerY(levelIndex, sep = 1.0) {
  // Center the 5 layers around y = 0
  // levelIndex: 0 (Storage) -> 4 (Apps)
  return (levelIndex - 2) * LAYER_GAP * sep;
}

function getLayerZ(levelIndex, sep = 1.0) {
  // Cascading step: Level 4 (Apps) is at z = -2 * STEP_Z (furthest back)
  // Level 0 (Storage) is at z = +2 * STEP_Z (closest to camera, forward)
  // This guarantees 0% occlusion from the isometric front-top camera!
  return (levelIndex - 2) * -STEP_Z * sep;
}

function buildStackPlates() {
  STACK_LAYERS.forEach((layer, idx) => {
    const y = getLayerY(idx, sepMultiplier);
    const z = getLayerZ(idx, sepMultiplier);
    const color = new THREE.Color(layer.hex || '#0284c7');

    // Translucent glass plate
    const plateMat = new THREE.MeshPhysicalMaterial({
      color: color.clone().multiplyScalar(0.25),
      emissive: color.clone().multiplyScalar(0.08),
      transparent: true,
      opacity: 0.85,
      roughness: 0.35,
      metalness: 0.2,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });

    const plateGeo = new THREE.BoxGeometry(PLATE_W, PLATE_H, PLATE_D);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, y, z);
    plate.receiveShadow = true;
    plate.castShadow = true;
    plate.userData = { type: 'layer', id: layer.id, baseLevel: idx, color: layer.color };
    scene.add(plate);
    layerMeshes[layer.id] = plate;

    // Outer glowing border
    const edgeGeo = new THREE.EdgesGeometry(plateGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: color.clone().multiplyScalar(1.2),
      transparent: true,
      opacity: 0.7,
      linewidth: 2,
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    plate.add(edgeLine);

    // Number & Name badge on the left edge of plate
    const labelMesh = createPlateLabel(layer);
    labelMesh.position.set(-PLATE_W / 2 + 1.2, PLATE_H / 2 + 0.02, -PLATE_D / 2 + 0.45);
    plate.add(labelMesh);
  });
}

function createPlateLabel(layer) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(10, 18, 30, 0.9)';
  ctx.fillRect(0, 0, 512, 128);

  ctx.strokeStyle = layer.hex || '#38bdf8';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, 508, 124);

  // Number badge
  ctx.fillStyle = layer.hex || '#ff3621';
  ctx.fillRect(10, 10, 80, 108);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 54px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(layer.num, 50, 64);

  // Layer Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(layer.name.toUpperCase(), 110, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 0.6), mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

// ── 2. Build Component Pedestals with High-Res Canvas Icons ─
function buildComponentTiles() {
  STACK_LAYERS.forEach((layer, idx) => {
    const y = getLayerY(idx, sepMultiplier);
    const z = getLayerZ(idx, sepMultiplier);
    const comps = layer.components || [];
    const count = comps.length;

    // Distribute nicely across the plate in 2 rows
    const cols = Math.ceil(count / 2);
    const spacingX = 2.4;
    const spacingZ = 2.3;
    const startX = -((cols - 1) * spacingX) / 2;

    comps.forEach((comp, ci) => {
      const col = ci % cols;
      const row = Math.floor(ci / cols);
      const posX = startX + col * spacingX;
      const posZ = (row === 0 ? -1.1 : 1.1) + z;

      const tileMesh = createComponentTile(comp, layer);
      tileMesh.position.set(posX, y + PLATE_H / 2 + 0.12, posZ);
      tileMesh.userData = {
        type: 'component',
        id: comp.id,
        layerId: layer.id,
        baseLevel: idx,
        baseY: y + PLATE_H / 2 + 0.12,
        baseZ: posZ,
        color: layer.color
      };

      scene.add(tileMesh);
      compMeshes[comp.id] = tileMesh;
    });
  });
}

// ── SVG Image Cache for 3D Textures ────────────────────────
const SVG_TEXTURE_CACHE = new Map();

function getOrLoadSvgImage(compId, hexColor, onLoaded) {
  const cacheKey = `${compId}_${hexColor}`;
  if (SVG_TEXTURE_CACHE.has(cacheKey)) {
    const cached = SVG_TEXTURE_CACHE.get(cacheKey);
    if (cached.complete && cached.naturalWidth > 0) {
      onLoaded(cached);
      return;
    }
  }

  const rawSvg = getIconSvg(compId);
  if (!rawSvg) return;

  // Ensure pure white icon with proper xmlns and dimensions
  let coloredSvg = rawSvg.replace(/currentColor/g, '#ffffff');
  if (!coloredSvg.includes('xmlns=')) {
    coloredSvg = coloredSvg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" ');
  }
  const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(coloredSvg);
  const img = new Image();
  img.onload = () => {
    SVG_TEXTURE_CACHE.set(cacheKey, img);
    onLoaded(img);
  };
  img.src = dataUri;
  if (img.complete && img.naturalWidth > 0) {
    SVG_TEXTURE_CACHE.set(cacheKey, img);
    onLoaded(img);
  }
}

function createComponentTile(comp, layer) {
  const TILE_W = 2.0;
  const TILE_H = 0.24;
  const TILE_D = 1.6;

  const layerCol = new THREE.Color(layer.hex || '#38bdf8');

  // Pedestal body
  const bodyMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0c1322'),
    emissive: layerCol.clone().multiplyScalar(0.08),
    roughness: 0.3,
    metalness: 0.4,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2,
  });

  const bodyGeo = new THREE.BoxGeometry(TILE_W, TILE_H, TILE_D);
  const tile = new THREE.Mesh(bodyGeo, bodyMat);
  tile.castShadow = true;
  tile.receiveShadow = true;

  // Ultra-crisp top face with high-resolution canvas texture (512x400)
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 400;
  const ctx = canvas.getContext('2d');

  function redrawTile(iconImg) {
    // 1. Dark tech background with subtle depth gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 400);
    bgGrad.addColorStop(0, '#131e32');
    bgGrad.addColorStop(1, '#090e1a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 512, 400);

    // 2. Radiant ambient glow behind icon emblem badge
    const radGlow = ctx.createRadialGradient(256, 92, 8, 256, 92, 150);
    radGlow.addColorStop(0, layer.hex ? `${layer.hex}3a` : 'rgba(255, 54, 33, 0.22)');
    radGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, 512, 230);

    // 3. Top header accent bar
    ctx.fillStyle = layer.hex || '#ff3621';
    ctx.fillRect(0, 0, 512, 10);

    // 4. Inner card border with subtle specular edge
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)';
    ctx.lineWidth = 3;
    ctx.strokeRect(8, 14, 496, 378);

    // 5. Large glowing icon emblem badge (128x128)
    const badgeW = 128;
    const badgeH = 128;
    const badgeX = (512 - badgeW) / 2; // 192
    const badgeY = 28;

    const badgeGrad = ctx.createLinearGradient(badgeX, badgeY, badgeX + badgeW, badgeY + badgeH);
    badgeGrad.addColorStop(0, layer.hex || '#ff3621');
    badgeGrad.addColorStop(1, '#0b1220');
    ctx.fillStyle = badgeGrad;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 26);
    ctx.fill();

    // Glowing perimeter border around badge
    ctx.strokeStyle = layer.hex || '#38bdf8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Specular shine at top of badge
    const shine = ctx.createLinearGradient(badgeX, badgeY, badgeX, badgeY + 44);
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.32)');
    shine.addColorStop(1, 'transparent');
    ctx.fillStyle = shine;
    ctx.beginPath();
    ctx.roundRect(badgeX + 2, badgeY + 2, badgeW - 4, 42, [24, 24, 6, 6]);
    ctx.fill();

    // 6. Draw crisp Vector Icon inside badge with drop shadow
    if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
      ctx.save();
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;
      ctx.drawImage(iconImg, badgeX + 20, badgeY + 20, 88, 88);
      ctx.restore();
    } else {
      // High-contrast initial while SVG parses
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText((comp.name || 'D').charAt(0), badgeX + badgeW / 2, badgeY + badgeH / 2);
    }

    // 7. Component Name (bold, centered, dynamic font size)
    const nameLen = (comp.name || '').length;
    const nameFontSize = nameLen > 24 ? 24 : (nameLen > 18 ? 27 : 32);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${nameFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 8;
    ctx.fillText(comp.name, 256, 196);
    ctx.shadowBlur = 0;

    // 8. Subtitle / description
    const subLen = (comp.subtitle || '').length;
    const subFontSize = subLen > 28 ? 18 : 20;
    ctx.fillStyle = '#94a3b8';
    ctx.font = `500 ${subFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(comp.subtitle || '', 256, 238);

    // 9. Badge pill (Open Source or Enterprise)
    if (comp.opensrc) {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.24)';
      ctx.beginPath();
      ctx.roundRect(151, 276, 210, 42, 99);
      ctx.fill();
      ctx.strokeStyle = '#22d3ee';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('★ OPEN SOURCE', 256, 297);
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
      ctx.beginPath();
      ctx.roundRect(146, 276, 220, 42, 99);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#cbd5e1';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('DATABRICKS NATIVE', 256, 297);
    }

    // 10. Bottom layer indicator stripe
    ctx.fillStyle = layer.hex || '#ff3621';
    ctx.fillRect(56, 386, 400, 4);
  }

  // Initial draw
  redrawTile(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  // Load actual vector SVG icon and redraw
  getOrLoadSvgImage(comp.id, layer.hex, (img) => {
    redrawTile(img);
    texture.needsUpdate = true;
  });

  const topMat = new THREE.MeshBasicMaterial({ map: texture });
  const topGeo = new THREE.PlaneGeometry(TILE_W - 0.05, TILE_D - 0.05);
  const topMesh = new THREE.Mesh(topGeo, topMat);
  topMesh.rotation.x = -Math.PI / 2;
  topMesh.position.y = TILE_H / 2 + 0.002;
  tile.add(topMesh);

  // Glowing perimeter ring
  const ringGeo = new THREE.EdgesGeometry(bodyGeo);
  const ringMat = new THREE.LineBasicMaterial({
    color: layerCol.clone().multiplyScalar(1.4),
    transparent: true,
    opacity: 0.45,
  });
  const ring = new THREE.LineSegments(ringGeo, ringMat);
  tile.add(ring);
  tile.userData.ring = ring;

  return tile;
}

// ── 3. Baseboard Perimeter (Governance, Operations, Integrations) ──
function buildBaseboard() {
  const baseboardY = getLayerY(0, sepMultiplier) - 1.2;
  const baseboardZ = 0;

  // A sleek dark floor / perimeter
  const baseMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#070c14'),
    roughness: 0.7,
    metalness: 0.1,
    transparent: true,
    opacity: 0.9,
  });
  const baseGeo = new THREE.BoxGeometry(PLATE_W + 4.0, 0.1, PLATE_D + 10.0);
  const baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.set(0, baseboardY, baseboardZ);
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  // Grid texture on baseboard
  const gridHelper = new THREE.GridHelper(PLATE_W + 3.6, 24, 0x1e293b, 0x0f172a);
  gridHelper.position.set(0, baseboardY + 0.06, baseboardZ);
  scene.add(gridHelper);
}

// ── Interaction & Hover Handling ───────────────────────────
function setupMouseEvents(container) {
  const dom = renderer.domElement;

  // Mouse wheel smoothly pans camera up/down the stack
  dom.addEventListener('wheel', (e) => {
    if (e.ctrlKey || e.metaKey) return;
    const deltaY = e.deltaY * 0.005;
    camera.position.y -= deltaY;
    controls.target.y -= deltaY;
    camera.position.y = THREE.MathUtils.clamp(camera.position.y, -12, 22);
    controls.target.y = THREE.MathUtils.clamp(controls.target.y, -10, 10);
  }, { passive: true });

  dom.addEventListener('pointermove', (e) => {
    const rect = dom.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    // Raycast on hover
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(compMeshes), false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (hoveredMesh !== hit) {
        if (hoveredMesh && hoveredMesh !== getSelectedMesh()) unhighlightTile(hoveredMesh);
        hoveredMesh = hit;
        highlightTile(hoveredMesh);
        dom.style.cursor = 'pointer';
      }
      const comp = COMPONENT_MAP[hit.userData.id];
      const hoverEl = document.getElementById('hover-label');
      if (hoverEl && comp) {
        hoverEl.innerHTML = `<span style="color:${hit.userData.color || '#38bdf8'}; font-weight:700;">●</span> <strong>${comp.name}</strong> <span style="opacity:0.65;">· ${comp.layerName}</span>`;
        hoverEl.style.left = `${e.clientX - rect.left + 16}px`;
        hoverEl.style.top = `${e.clientY - rect.top + 16}px`;
        hoverEl.style.opacity = '1';
      }
    } else {
      if (hoveredMesh && hoveredMesh !== getSelectedMesh()) {
        unhighlightTile(hoveredMesh);
        hoveredMesh = null;
      }
      dom.style.cursor = 'default';
      const hoverEl = document.getElementById('hover-label');
      if (hoverEl) hoverEl.style.opacity = '0';
    }
  });

  dom.addEventListener('pointerleave', () => {
    if (hoveredMesh && hoveredMesh !== getSelectedMesh()) {
      unhighlightTile(hoveredMesh);
      hoveredMesh = null;
    }
    dom.style.cursor = 'default';
    const hoverEl = document.getElementById('hover-label');
    if (hoverEl) hoverEl.style.opacity = '0';
  });

  dom.addEventListener('click', (e) => {
    raycaster.setFromCamera(mouse, camera);

    // Check components first
    const compHits = raycaster.intersectObjects(Object.values(compMeshes), false);
    if (compHits.length > 0) {
      const hit = compHits[0].object;
      selectItem('component', hit.userData.id);
      onSelect({ type: 'component', id: hit.userData.id });
      return;
    }

    // Check layer plates
    const plateHits = raycaster.intersectObjects(Object.values(layerMeshes), false);
    if (plateHits.length > 0) {
      const hit = plateHits[0].object;
      selectItem('layer', hit.userData.id);
      onSelect({ type: 'layer', id: hit.userData.id });
      return;
    }

    // Clicked empty space -> clear selection
    clearSelection();
    onSelect(null);
  });
}

function getSelectedMesh() {
  if (selectedType === 'component' && selectedId) return compMeshes[selectedId];
  return null;
}

function highlightTile(tile) {
  tile.position.y = tile.userData.baseY + 0.16;
  if (tile.userData.ring) {
    tile.userData.ring.material.opacity = 1.0;
    tile.userData.ring.material.color.set('#ff5722');
  }
}

function unhighlightTile(tile) {
  tile.position.y = tile.userData.baseY;
  if (tile.userData.ring) {
    tile.userData.ring.material.opacity = 0.4;
    const col = new THREE.Color(tile.userData.color || '#38bdf8');
    tile.userData.ring.material.color.copy(col.multiplyScalar(1.2));
  }
}

// ── Public Selection & Layer Focus ─────────────────────────
export function selectItem(type, id) {
  selectedType = type;
  selectedId = id;

  if (type === 'component') {
    const comp = COMPONENT_MAP[id];
    if (!comp) return;

    // Highlight target component and raise slightly
    Object.values(compMeshes).forEach(m => {
      if (m.userData.id === id) {
        highlightTile(m);
      } else {
        unhighlightTile(m);
      }
    });

    // Dim unrelated layers slightly
    STACK_LAYERS.forEach(l => {
      const plate = layerMeshes[l.id];
      if (plate) {
        plate.material.opacity = (l.id === comp.layerId) ? 0.95 : 0.25;
      }
    });

    // Draw connection curves between connected components
    drawConnections(comp);

    // Smoothly focus camera towards component's layer
    const compMesh = compMeshes[id];
    if (compMesh && currentCameraMode === 'iso') {
      animateCameraTo(
        new THREE.Vector3(compMesh.position.x * 0.4, compMesh.position.y + 5.2, compMesh.position.z + 8.6),
        new THREE.Vector3(compMesh.position.x * 0.2, compMesh.position.y, compMesh.position.z),
        600
      );
    }
  } else if (type === 'layer') {
    focusLayer(id);
  }
}

export function clearSelection() {
  selectedType = null;
  selectedId = null;

  // Restore all layers & components opacity
  STACK_LAYERS.forEach(l => {
    const plate = layerMeshes[l.id];
    if (plate) plate.material.opacity = 0.85;
  });

  Object.values(compMeshes).forEach(unhighlightTile);
  clearConnections();

  // Return to default camera framing
  if (currentCameraMode === 'iso') {
    animateCameraTo(ISO_CAM_POS, ISO_CAM_TGT, 600);
  }
}

export function focusLayer(layerId) {
  selectedType = 'layer';
  selectedId = layerId;

  const targetPlate = layerMeshes[layerId];
  if (!targetPlate) return;

  const targetY = targetPlate.position.y;
  const targetZ = targetPlate.position.z;

  // Highlight only this layer; dim others
  STACK_LAYERS.forEach(l => {
    const plate = layerMeshes[l.id];
    if (plate) {
      plate.material.opacity = (l.id === layerId) ? 0.95 : 0.15;
    }
  });

  clearConnections();

  // Smooth camera glide to frame the selected layer front and center
  if (currentCameraMode === 'iso') {
    animateCameraTo(
      new THREE.Vector3(0, targetY + 5.5, targetZ + 9.5),
      new THREE.Vector3(0, targetY, targetZ),
      650
    );
  }
}

// ── Connection Curves ──────────────────────────────────────
function drawConnections(comp) {
  clearConnections();
  const sourceMesh = compMeshes[comp.id];
  if (!sourceMesh || !comp.connections) return;

  const startPt = sourceMesh.position.clone();
  startPt.y += 0.15;

  comp.connections.forEach(connId => {
    const targetMesh = compMeshes[connId];
    if (!targetMesh) return;

    const endPt = targetMesh.position.clone();
    endPt.y += 0.15;

    // Smooth 3D Bezier curve arching between layers
    const midY = (startPt.y + endPt.y) / 2 + Math.abs(startPt.y - endPt.y) * 0.4 + 0.8;
    const ctrlPt = new THREE.Vector3(
      (startPt.x + endPt.x) / 2,
      midY,
      (startPt.z + endPt.z) / 2
    );

    const curve = new THREE.QuadraticBezierCurve3(startPt, ctrlPt, endPt);
    const points = curve.getPoints(32);
    const geo = new THREE.BufferGeometry().setFromPoints(points);

    const mat = new THREE.LineDashedMaterial({
      color: 0x38bdf8,
      linewidth: 2,
      scale: 1,
      dashSize: 0.3,
      gapSize: 0.15,
      transparent: true,
      opacity: 0.85,
    });

    const line = new THREE.Line(geo, mat);
    line.computeLineDistances();
    scene.add(line);
    connCurves.push(line);
  });
}

function clearConnections() {
  connCurves.forEach(line => {
    scene.remove(line);
    line.geometry.dispose();
    line.material.dispose();
  });
  connCurves = [];
}

// ── Camera Modes: ISO ⟷ TOP ─────────────────────────────────
export function setCameraMode(mode) {
  currentCameraMode = mode;
  if (mode === 'top') {
    animateCameraTo(TOP_CAM_POS, TOP_CAM_TGT, 750);
  } else {
    animateCameraTo(ISO_CAM_POS, ISO_CAM_TGT, 750);
  }
}

export function resetCamera() {
  clearSelection();
  setCameraMode('iso');
}

export function zoomIn() {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  camera.position.addScaledVector(dir, 2.5);
  controls.update();
}

export function zoomOut() {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  camera.position.addScaledVector(dir, -2.5);
  controls.update();
}

export function panUp() {
  camera.position.y += 2.2;
  controls.target.y += 2.2;
  controls.update();
}

export function panDown() {
  camera.position.y -= 2.2;
  controls.target.y -= 2.2;
  controls.update();
}

// ── Separation & Exploded Mode ─────────────────────────────
export function setSeparation(pct) {
  // pct: 0 to 100
  sepMultiplier = 0.4 + (pct / 100) * 1.0;
  updatePositions();
}

export function setExploded(exploded) {
  sepMultiplier = exploded ? 1.0 : 0.45;
  updatePositions();
}

function updatePositions() {
  STACK_LAYERS.forEach((layer, idx) => {
    const y = getLayerY(idx, sepMultiplier);
    const z = getLayerZ(idx, sepMultiplier);
    const plate = layerMeshes[layer.id];
    if (plate) {
      plate.position.y = y;
      plate.position.z = z;
    }

    const comps = layer.components || [];
    const count = comps.length;
    const cols = Math.ceil(count / 2);
    const spacingX = 2.4;
    const startX = -((cols - 1) * spacingX) / 2;

    comps.forEach((comp, ci) => {
      const col = ci % cols;
      const row = Math.floor(ci / cols);
      const posX = startX + col * spacingX;
      const posZ = (row === 0 ? -1.1 : 1.1) + z;

      const tile = compMeshes[comp.id];
      if (tile) {
        tile.userData.baseY = y + PLATE_H / 2 + 0.12;
        tile.userData.baseZ = posZ;
        tile.position.set(posX, tile.userData.baseY, posZ);
      }
    });
  });

  if (selectedType === 'component' && selectedId) {
    const comp = COMPONENT_MAP[selectedId];
    if (comp) drawConnections(comp);
  }
}

// ── Open Source Filter ─────────────────────────────────────
export function highlightOpenSource(highlight) {
  Object.values(compMeshes).forEach(tile => {
    const comp = COMPONENT_MAP[tile.userData.id];
    if (!comp) return;

    if (highlight) {
      if (comp.opensrc) {
        tile.material.emissive.set('#22d3ee');
        tile.material.emissiveIntensity = 0.4;
      } else {
        tile.material.opacity = 0.25;
      }
    } else {
      tile.material.emissive.set('#000000');
      tile.material.opacity = 1.0;
    }
  });
}

// ── Camera Animation Helper ────────────────────────────────
function animateCameraTo(targetPos, targetLookAt, duration = 700) {
  camStartPos.copy(camera.position);
  camEndPos.copy(targetPos);
  camStartTgt.copy(controls.target);
  camEndTgt.copy(targetLookAt);
  camTweenStart = performance.now();
  camTweenDur = duration;
  camTweening = true;
}

// ── Resize ─────────────────────────────────────────────────
export function resizeRenderer(container) {
  if (!container || !renderer || !camera) return;
  const w = container.clientWidth || container.parentElement?.clientWidth || 900;
  const h = container.clientHeight || container.parentElement?.clientHeight || 700;
  if (w > 0 && h > 0) {
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
}

function setupResize(container) {
  window.addEventListener('resize', () => {
    resizeRenderer(container);
  });
}

// ── Render Loop ────────────────────────────────────────────
function animate(time) {
  animId = requestAnimationFrame(animate);

  // Camera tween interpolation
  if (camTweening) {
    const elapsed = performance.now() - camTweenStart;
    const t = Math.min(elapsed / camTweenDur, 1);
    // Smooth easeInOutCubic
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(camStartPos, camEndPos, ease);
    controls.target.lerpVectors(camStartTgt, camEndTgt, ease);

    if (t >= 1) camTweening = false;
  }

  // Animate line dashes for connection pulses
  connCurves.forEach(line => {
    if (line.material && line.material.dashSize) {
      line.material.dashOffset = (time * 0.002) % (line.material.dashSize + line.material.gapSize);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}
