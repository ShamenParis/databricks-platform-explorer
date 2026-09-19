/**
 * DATABRICKS PLATFORM EXPLORER — Futuristic 3D Holographic Scene Engine (Three.js)
 * 
 * Cinematic Sci-Fi Computer Display Architecture:
 * - Side-Angle Perspective: Default 39° side-isometric angle so all rows & tiers are 100% visible
 * - Stadium-Tiered Staggered Nodes: Back rows are elevated and offset so front rows never occlude them
 * - Free Orbit Rotation (Drag-Safe): Dragging to rotate/pan never accidentally triggers click selections
 * - Tactical Dependency Isolation: Clicking any node HIDES non-participating layers and fades unrelated nodes
 * - 3D Holographic Icon Crystals: Faceted floating crystal emblems with illuminated vector logos & rotating power reticles
 * - Futuristic Sci-Fi HUD Tags: Chamfered holographic nameplates with status beacons, category tags, and tech brackets
 * - Cinematic Movie Computer Mapping: High-speed digital laser conduits, streaming data packet bursts, and [ + ] target reticles
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LAYERS, COMPONENT_MAP } from './data.js';
import { getIconSvg } from './icons.js';

// ── State ──────────────────────────────────────────────────
let renderer, scene, camera, controls, animId;
let layerMeshes   = {};   // layerId  → THREE.Mesh
let compMeshes    = {};   // compId   → THREE.Group (3D Component Station)
let baseMesh      = null;
let gridHelper    = null;
let connPipes     = [];   // active 3D laser conduit meshes
let connPulses    = [];   // animated digital data packet streams
let animatedReticles = []; // rotating power reticles
let animatedEmblems  = []; // floating 3D icon crystals
let activeReticles   = []; // [ + ] targeting lock-on brackets
let hoveredMesh   = null;
let selectedId    = null;
let selectedType  = null;
let onSelect      = () => {};

// Mouse drag-vs-click disambiguation
let isDragging    = false;
let pointerDownX  = 0;
let pointerDownY  = 0;

// Camera tween state
let camTweening   = false;
let camStartPos   = new THREE.Vector3();
let camEndPos     = new THREE.Vector3();
let camStartTgt   = new THREE.Vector3();
let camEndTgt     = new THREE.Vector3();
let camTweenStart = 0;
let camTweenDur   = 650; // ms

// Camera mode: 'iso', 'front', or 'top'
let currentCameraMode = 'iso';

// Geometry & Layout Constants
const PLATE_W     = 13.0;
const PLATE_D     = 7.6;
const PLATE_H     = 0.18;
const LAYER_GAP   = 2.6;   // Generous vertical spacing between layers
const STEP_Z      = 1.7;   // Stepped cascade
let sepMultiplier = 1.0;

// Stack layer order from bottom (idx=0) to top (idx=4)
const STACK_LAYERS = LAYERS.filter(l => l.isStack).sort((a, b) => a.stackLevel - b.stackLevel);

// Default camera anchors — Side-angle isometric perspective (39° azimuth, 28° elevation)
// Guarantees that Row 0 (behind) and Row 1 (front) are horizontally separated with ZERO occlusion!
const ISO_CAM_POS   = new THREE.Vector3(16.5, 14.5, 20.5);
const ISO_CAM_TGT   = new THREE.Vector3(0, 0, 0);
const FRONT_CAM_POS = new THREE.Vector3(0, 1.2, 27.5);
const FRONT_CAM_TGT = new THREE.Vector3(0, 0, 0);
const TOP_CAM_POS   = new THREE.Vector3(0, 33.0, 0.001);
const TOP_CAM_TGT   = new THREE.Vector3(0, 0, 0);

// Raycaster for mouse picking
const raycaster = new THREE.Raycaster();
const mouse     = new THREE.Vector2(-999, -999);

// ── Init Scene ─────────────────────────────────────────────
export function initScene(container, selectCallback) {
  onSelect = selectCallback;

  const width = container.clientWidth || (container.parentElement ? container.parentElement.clientWidth : 900) || 900;
  const height = container.clientHeight || (container.parentElement ? container.parentElement.clientHeight : 700) || 700;

  // WebGL Renderer with High Dynamic Range & Tone Mapping
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  container.appendChild(renderer.domElement);

  // Scene
  scene = new THREE.Scene();
  scene.background = null;

  // Perspective Camera
  const aspect = width / height;
  camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 500);
  camera.position.copy(ISO_CAM_POS);
  camera.lookAt(ISO_CAM_TGT);

  // Lights — Balanced and luminous for glowing sci-fi holographic elements
  const ambient = new THREE.AmbientLight(0xffffff, 0.90);
  scene.add(ambient);

  const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
  mainLight.position.set(16, 26, 20);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  mainLight.shadow.bias = -0.0004;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x00f0ff, 0.65);
  fillLight.position.set(-16, 18, 14);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xc084fc, 0.5);
  rimLight.position.set(0, 15, -18);
  scene.add(rimLight);

  const bottomFill = new THREE.DirectionalLight(0x0284c7, 0.35);
  bottomFill.position.set(0, -10, 8);
  scene.add(bottomFill);

  // Controls — Intuitive Orbit, Scroll-Zoom, and Pan
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.enableZoom = true;
  controls.zoomSpeed = 1.2;
  controls.enableRotate = true;
  controls.rotateSpeed = 0.85;
  controls.enablePan = true;
  controls.panSpeed = 0.85;
  controls.screenSpacePanning = true;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minPolarAngle = Math.PI / 18;
  controls.minDistance = 6;
  controls.maxDistance = 60;
  controls.target.copy(ISO_CAM_TGT);

  // Build the 3D Architecture Stack
  buildStackPlates();
  buildComponentNodes();
  buildBaseboard();

  // Setup event listeners
  setupMouseEvents(container);
  setupResize(container);

  // Start render loop
  animate(0);
}

// ── 1. Build the 5 Primary Stack Layer Boards ──────────────
function getLayerY(levelIndex, sep = 1.0) {
  return (levelIndex - 2) * LAYER_GAP * sep;
}

function getLayerZ(levelIndex, sep = 1.0) {
  return (levelIndex - 2) * -STEP_Z * sep;
}

function buildStackPlates() {
  STACK_LAYERS.forEach((layer, idx) => {
    const y = getLayerY(idx, sepMultiplier);
    const z = getLayerZ(idx, sepMultiplier);
    const color = new THREE.Color(layer.hex || '#0284c7');

    // Luminous frosted glass plate
    const plateMat = new THREE.MeshPhysicalMaterial({
      color: color.clone().multiplyScalar(0.42),
      emissive: color.clone().multiplyScalar(0.18),
      transparent: true,
      opacity: 0.88,
      roughness: 0.22,
      metalness: 0.15,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
      transmission: 0.5,
      ior: 1.35,
    });

    const plateGeo = new THREE.BoxGeometry(PLATE_W, PLATE_H, PLATE_D);
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.position.set(0, y, z);
    plate.receiveShadow = true;
    plate.castShadow = true;
    plate.userData = { type: 'layer', id: layer.id, baseLevel: idx, color: layer.hex || layer.color };
    scene.add(plate);
    layerMeshes[layer.id] = plate;

    // Glowing neon perimeter border
    const edgeGeo = new THREE.EdgesGeometry(plateGeo);
    const edgeMat = new THREE.LineBasicMaterial({
      color: color.clone().multiplyScalar(1.6),
      transparent: true,
      opacity: 0.9,
    });
    const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
    plate.add(edgeLine);

    // High-DPI unclipped layer badge on front edge of plate
    const labelMesh = createPlateLabel(layer);
    labelMesh.position.set(-PLATE_W / 2 + 2.0, PLATE_H / 2 + 0.02, PLATE_D / 2 - 0.55);
    plate.add(labelMesh);
  });
}

function createPlateLabel(layer) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(8, 14, 26, 0.92)';
  ctx.beginPath();
  ctx.roundRect(8, 8, 1008, 184, 24);
  ctx.fill();

  ctx.strokeStyle = layer.hex || '#38bdf8';
  ctx.lineWidth = 5;
  ctx.stroke();

  // Number badge pill
  const numPillGrad = ctx.createLinearGradient(16, 16, 150, 184);
  numPillGrad.addColorStop(0, layer.hex || '#ff3621');
  numPillGrad.addColorStop(1, '#0f172a');
  ctx.fillStyle = numPillGrad;
  ctx.beginPath();
  ctx.roundRect(16, 16, 140, 168, 18);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 78px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(layer.num, 86, 100);

  // Layer Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 50px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(layer.name.toUpperCase(), 180, 80);

  // Subtitle / component count metadata
  const compCount = layer.components ? layer.components.length : 0;
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText(`${compCount} ARCHITECTURE SERVICES · CORE PLATFORM TIER`, 180, 138);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.7), mat);
  mesh.rotation.x = -Math.PI / 2;
  return mesh;
}

// ── 2. Build Futuristic 3D Holographic Component Nodes ─────
function buildComponentNodes() {
  animatedReticles = [];
  animatedEmblems  = [];

  STACK_LAYERS.forEach((layer, idx) => {
    const y = getLayerY(idx, sepMultiplier);
    const z = getLayerZ(idx, sepMultiplier);
    const comps = layer.components || [];
    const count = comps.length;

    // Distribute across plate in 2 rows
    const cols = Math.ceil(count / 2);
    const spacingX = 2.65;
    const startX = -((cols - 1) * spacingX) / 2;

    comps.forEach((comp, ci) => {
      const col = ci % cols;
      const row = Math.floor(ci / cols);

      // Stagger back row slightly for checkerboard spacing so it's never hidden behind front row
      const staggerX = (row === 0 && count > 3) ? (spacingX * 0.35) : 0;
      const posX = startX + col * spacingX + staggerX;
      // Generous spacing between rows
      const posZ = (row === 0 ? -1.45 : 1.25) + z;

      // Stadium seating elevation: Back row is elevated by +0.22 so its icon rises above the front row
      const elevationY = row === 0 ? 0.22 : 0;
      const baseY = y + PLATE_H / 2 + elevationY;

      const nodeGroup = createHolographicComponentNode(comp, layer, idx, row);
      nodeGroup.position.set(posX, baseY, posZ);
      nodeGroup.userData = {
        type: 'component',
        id: comp.id,
        layerId: layer.id,
        baseLevel: idx,
        row: row,
        baseY: baseY,
        baseZ: posZ,
        color: layer.hex || layer.color
      };

      scene.add(nodeGroup);
      compMeshes[comp.id] = nodeGroup;
    });
  });
}

function createHolographicComponentNode(comp, layer, layerIdx, row) {
  const nodeGroup = new THREE.Group();
  const layerColor = layer.hex || '#38bdf8';
  const layerCol = new THREE.Color(layerColor);

  // ── A. Base Holographic Energy Power Reticle (Flat on Plate)
  const reticleTexture = createReticleTexture(layerColor);
  const reticleGeo = new THREE.PlaneGeometry(1.8, 1.8);
  const reticleMat = new THREE.MeshBasicMaterial({
    map: reticleTexture,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
  reticleMesh.rotation.x = -Math.PI / 2;
  reticleMesh.position.y = 0.02;
  nodeGroup.add(reticleMesh);

  // Keep for continuous gyroscopic rotation in animate()
  animatedReticles.push({
    mesh: reticleMesh,
    speed: 0.0006 * (layerIdx % 2 === 0 ? 1 : -1)
  });

  // ── B. Floating 3D Holographic Icon Crystal
  const emblemGroup = new THREE.Group();
  emblemGroup.position.y = 0.52;

  // Faceted crystal hexagonal prism
  const radius = 0.65;
  const height = 0.16;
  const segments = 6;
  const crystalGeo = new THREE.CylinderGeometry(radius, radius, height, segments);

  const crystalMat = new THREE.MeshPhysicalMaterial({
    color: layerCol.clone().multiplyScalar(0.38),
    emissive: layerCol.clone().multiplyScalar(0.18),
    roughness: 0.18,
    metalness: 0.35,
    clearcoat: 0.9,
    clearcoatRoughness: 0.15,
    transparent: true,
    opacity: 0.88,
    transmission: 0.55,
    ior: 1.45,
  });

  const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
  // Tilt forward slightly so the emblem catches the side-isometric angle
  crystalMesh.rotation.x = Math.PI / 3.4;
  crystalMesh.rotation.y = -Math.PI / 16; // Angled toward side camera
  crystalMesh.castShadow = true;

  // Glowing neon edge wireframe around crystal
  const edgeGeo = new THREE.EdgesGeometry(crystalGeo);
  const edgeMat = new THREE.LineBasicMaterial({
    color: layerCol.clone().multiplyScalar(1.8),
    transparent: true,
    opacity: 0.95,
  });
  const edgeLine = new THREE.LineSegments(edgeGeo, edgeMat);
  crystalMesh.add(edgeLine);

  // Front face canvas displaying crisp Vector Icon & radiant hologram
  const faceTexture = createEmblemFaceTexture(comp, layer);
  const faceMat = new THREE.MeshBasicMaterial({ map: faceTexture, transparent: true });
  const faceGeo = new THREE.CircleGeometry(radius * 0.96, segments);
  const faceMesh = new THREE.Mesh(faceGeo, faceMat);
  faceMesh.rotation.x = -Math.PI / 2;
  faceMesh.position.y = height / 2 + 0.002;
  crystalMesh.add(faceMesh);

  emblemGroup.add(crystalMesh);
  nodeGroup.add(emblemGroup);

  // Keep for subtle levitation bobbing
  animatedEmblems.push({
    group: emblemGroup,
    baseY: 0.52,
    phase: Math.random() * Math.PI * 2
  });

  // ── C. Glowing Sci-Fi Laser Stem
  const stemGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.45);
  const stemMat = new THREE.MeshBasicMaterial({
    color: layerColor,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
  });
  const stemMesh = new THREE.Mesh(stemGeo, stemMat);
  stemMesh.position.set(0, 0.85, 0);
  nodeGroup.add(stemMesh);

  // ── D. Futuristic Sci-Fi HUD Name Tag
  const tagTexture = createHudTagTexture(comp, layer);
  const tagGeo = new THREE.PlaneGeometry(2.3, 0.72);
  const tagMat = new THREE.MeshBasicMaterial({
    map: tagTexture,
    transparent: true,
    side: THREE.DoubleSide
  });
  const tagMesh = new THREE.Mesh(tagGeo, tagMat);
  tagMesh.position.set(0, 1.18, 0.15);
  tagMesh.rotation.x = -Math.PI / 6;
  tagMesh.rotation.y = -Math.PI / 16;
  nodeGroup.add(tagMesh);

  // ── E. Holographic Targeting Lock-On Reticle [ + ] (Hidden until targeted)
  const targetReticleTexture = createTargetReticleTexture(layerColor);
  const targetGeo = new THREE.PlaneGeometry(2.4, 2.4);
  const targetMat = new THREE.MeshBasicMaterial({
    map: targetReticleTexture,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const targetReticle = new THREE.Mesh(targetGeo, targetMat);
  targetReticle.rotation.x = -Math.PI / 2;
  targetReticle.position.y = 0.03;
  nodeGroup.add(targetReticle);

  nodeGroup.userData = {
    type: 'component',
    id: comp.id,
    layerId: layer.id,
    emblemGroup,
    crystalMesh,
    faceMesh,
    edgeLine,
    tagMesh,
    reticleMesh,
    targetReticle,
    color: layerColor
  };

  crystalMesh.userData = nodeGroup.userData;
  faceMesh.userData = nodeGroup.userData;
  tagMesh.userData = nodeGroup.userData;

  return nodeGroup;
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

// ── Canvas Texture Generators ──────────────────────────────
function createReticleTexture(colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const cx = 128, cy = 128;
  const col = colorHex || '#38bdf8';

  // Outer dashed ring
  ctx.strokeStyle = col;
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, 116, 0, Math.PI * 2);
  ctx.stroke();

  // 4 corner tick marks
  ctx.setLineDash([]);
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    const angle = (i * Math.PI) / 2;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(110, 0);
    ctx.lineTo(124, 0);
    ctx.stroke();
    ctx.restore();
  }

  // Inner continuous ring
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(cx, cy, 94, 0, Math.PI * 2);
  ctx.stroke();

  // High-tech hash ring
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.setLineDash([4, 6]);
  ctx.beginPath();
  ctx.arc(cx, cy, 76, 0, Math.PI * 2);
  ctx.stroke();

  // Center glowing radial core
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 60);
  grad.addColorStop(0, `${col}55`);
  grad.addColorStop(0.7, `${col}15`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, 60, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createTargetReticleTexture(colorHex) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  const cx = 128, cy = 128;
  const col = colorHex || '#00f0ff';

  // Sci-Fi [ + ] lock-on brackets
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 4;
  const bracketDist = 80;
  const armLen = 28;

  // 4 corner brackets
  ctx.beginPath();
  ctx.moveTo(cx - bracketDist, cy - bracketDist + armLen);
  ctx.lineTo(cx - bracketDist, cy - bracketDist);
  ctx.lineTo(cx - bracketDist + armLen, cy - bracketDist);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + bracketDist - armLen, cy - bracketDist);
  ctx.lineTo(cx + bracketDist, cy - bracketDist);
  ctx.lineTo(cx + bracketDist, cy - bracketDist + armLen);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - bracketDist, cy + bracketDist - armLen);
  ctx.lineTo(cx - bracketDist, cy + bracketDist);
  ctx.lineTo(cx - bracketDist + armLen, cy + bracketDist);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx + bracketDist - armLen, cy + bracketDist);
  ctx.lineTo(cx + bracketDist, cy + bracketDist);
  ctx.lineTo(cx + bracketDist, cy + bracketDist - armLen);
  ctx.stroke();

  // Center crosshair +
  ctx.strokeStyle = col;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(cx - 16, cy); ctx.lineTo(cx + 16, cy);
  ctx.moveTo(cx, cy - 16); ctx.lineTo(cx, cy + 16);
  ctx.stroke();

  // Concentric dashed lock-on ring
  ctx.strokeStyle = col;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, 108, 0, Math.PI * 2);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

function createEmblemFaceTexture(comp, layer) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  const layerHex = layer.hex || '#38bdf8';

  function redraw(iconImg) {
    ctx.clearRect(0, 0, 512, 512);

    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 240, 0, Math.PI * 2);
    ctx.clip();

    // Cybernetic dark radial background
    const bg = ctx.createRadialGradient(256, 256, 20, 256, 256, 240);
    bg.addColorStop(0, '#12203c');
    bg.addColorStop(0.7, '#070c18');
    bg.addColorStop(1, '#02050b');
    ctx.fillStyle = bg;
    ctx.fill();

    // Radiant core neon glow
    const coreGlow = ctx.createRadialGradient(256, 256, 10, 256, 256, 170);
    coreGlow.addColorStop(0, `${layerHex}88`);
    coreGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = coreGlow;
    ctx.fill();

    // Concentric tech rings
    ctx.strokeStyle = layerHex;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(256, 256, 224, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(256, 256, 192, 0, Math.PI * 2);
    ctx.stroke();

    // Draw vector icon in center
    if (iconImg && iconImg.complete && iconImg.naturalWidth > 0) {
      ctx.save();
      ctx.shadowColor = layerHex;
      ctx.shadowBlur = 20;
      ctx.drawImage(iconImg, 128, 128, 256, 256);
      ctx.restore();
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 120px monospace, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = layerHex;
      ctx.shadowBlur = 18;
      ctx.fillText((comp.name || 'D').charAt(0), 256, 256);
    }

    ctx.restore();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(256, 256, 242, 0, Math.PI * 2);
    ctx.stroke();
  }

  redraw(null);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;

  getOrLoadSvgImage(comp.id, layer.hex, (img) => {
    redraw(img);
    texture.needsUpdate = true;
  });

  return texture;
}

function createHudTagTexture(comp, layer) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');
  const layerColor = layer.hex || '#38bdf8';

  // 1. Sci-fi chamfered card background
  ctx.fillStyle = 'rgba(5, 10, 20, 0.88)';
  ctx.beginPath();
  ctx.moveTo(24, 8);
  ctx.lineTo(512 - 24, 8);
  ctx.lineTo(512 - 8, 24);
  ctx.lineTo(512 - 8, 160 - 24);
  ctx.lineTo(512 - 24, 160 - 8);
  ctx.lineTo(24, 160 - 8);
  ctx.lineTo(8, 160 - 24);
  ctx.lineTo(8, 24);
  ctx.closePath();
  ctx.fill();

  // Outer neon border
  ctx.strokeStyle = `${layerColor}aa`;
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // 2. Futuristic corner brackets
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(14, 32); ctx.lineTo(14, 14); ctx.lineTo(32, 14);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(480, 14); ctx.lineTo(498, 14); ctx.lineTo(498, 32);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(14, 128); ctx.lineTo(14, 146); ctx.lineTo(32, 146);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(480, 146); ctx.lineTo(498, 146); ctx.lineTo(498, 128);
  ctx.stroke();

  // 3. Top category tag line
  if (comp.opensrc) {
    ctx.fillStyle = '#06b6d4';
    ctx.font = 'bold 18px monospace, sans-serif';
    ctx.fillText('◈ [ OPEN SOURCE ]', 28, 42);
  } else {
    ctx.fillStyle = layerColor;
    ctx.font = 'bold 18px monospace, sans-serif';
    ctx.fillText('◈ [ DATABRICKS NATIVE ]', 28, 42);
  }

  // Status indicator
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(436, 36, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#94a3b8';
  ctx.font = '600 16px monospace, sans-serif';
  ctx.fillText('ACTIVE', 448, 42);

  // 4. Component Name
  const name = (comp.name || '').toUpperCase();
  const nameLen = name.length;
  const fontSize = nameLen > 22 ? 27 : (nameLen > 16 ? 31 : 35);
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  ctx.shadowColor = layerColor;
  ctx.shadowBlur = 10;
  ctx.fillText(name, 28, 88);
  ctx.shadowBlur = 0;

  // 5. Subtitle / Architecture Role
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 20px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  const sub = (comp.subtitle || comp.desc || '').slice(0, 36);
  ctx.fillText(sub, 28, 122);

  // 6. Segmented bottom tech bar
  ctx.fillStyle = layerColor;
  for (let b = 0; b < 6; b++) {
    ctx.fillRect(410 + b * 14, 114, 9, 8);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  return texture;
}

// ── 3. Baseboard Perimeter (Floor Grid) ─────────────────────
function buildBaseboard() {
  const baseboardY = getLayerY(0, sepMultiplier) - 1.4;
  const baseboardZ = 0;

  const baseMat = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#060a12'),
    roughness: 0.75,
    metalness: 0.2,
    transparent: true,
    opacity: 0.92,
  });
  const baseGeo = new THREE.BoxGeometry(PLATE_W + 5.0, 0.1, PLATE_D + 11.0);
  baseMesh = new THREE.Mesh(baseGeo, baseMat);
  baseMesh.position.set(0, baseboardY, baseboardZ);
  baseMesh.receiveShadow = true;
  scene.add(baseMesh);

  gridHelper = new THREE.GridHelper(PLATE_W + 4.6, 28, 0x1e293b, 0x0f172a);
  gridHelper.position.set(0, baseboardY + 0.06, baseboardZ);
  scene.add(gridHelper);
}

// ── Helpers to find component or layer from hit hierarchy ──
function getComponentFromHit(object) {
  let curr = object;
  while (curr) {
    if (curr.userData && curr.userData.type === 'component') return curr;
    curr = curr.parent;
  }
  return null;
}

function getLayerFromHit(object) {
  let curr = object;
  while (curr) {
    if (curr.userData && curr.userData.type === 'layer') return curr;
    curr = curr.parent;
  }
  return null;
}

// ── Interaction & Hover Handling ───────────────────────────
function setupMouseEvents(container) {
  const dom = renderer.domElement;

  // Track pointerdown to distinguish click from rotation drag
  dom.addEventListener('pointerdown', (e) => {
    pointerDownX = e.clientX;
    pointerDownY = e.clientY;
    isDragging = false;
  });

  dom.addEventListener('pointermove', (e) => {
    // If pointer moved more than 6px, user is rotating/panning the scene
    if (Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY) > 6) {
      isDragging = true;
    }

    const rect = dom.getBoundingClientRect();
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(Object.values(compMeshes), true);

    let hitNode = null;
    for (const hit of intersects) {
      const comp = getComponentFromHit(hit.object);
      if (comp && comp.visible) { hitNode = comp; break; }
    }

    if (hitNode) {
      if (hoveredMesh !== hitNode) {
        if (hoveredMesh && hoveredMesh !== getSelectedMesh()) unhighlightNode(hoveredMesh);
        hoveredMesh = hitNode;
        highlightNode(hoveredMesh);
        dom.style.cursor = 'pointer';
      }
      const comp = COMPONENT_MAP[hitNode.userData.id];
      const hoverEl = document.getElementById('hover-label');
      if (hoverEl && comp) {
        hoverEl.innerHTML = `<span style="color:${hitNode.userData.color || '#38bdf8'}; font-weight:700;">●</span> <strong>${comp.name}</strong> <span style="opacity:0.65;">· ${comp.layerName}</span>`;
        hoverEl.style.left = `${e.clientX - rect.left + 16}px`;
        hoverEl.style.top = `${e.clientY - rect.top + 16}px`;
        hoverEl.style.opacity = '1';
      }
    } else {
      if (hoveredMesh && hoveredMesh !== getSelectedMesh()) {
        unhighlightNode(hoveredMesh);
        hoveredMesh = null;
      }
      dom.style.cursor = 'default';
      const hoverEl = document.getElementById('hover-label');
      if (hoverEl) hoverEl.style.opacity = '0';
    }
  });

  dom.addEventListener('pointerleave', () => {
    if (hoveredMesh && hoveredMesh !== getSelectedMesh()) {
      unhighlightNode(hoveredMesh);
      hoveredMesh = null;
    }
    dom.style.cursor = 'default';
    const hoverEl = document.getElementById('hover-label');
    if (hoverEl) hoverEl.style.opacity = '0';
  });

  dom.addEventListener('click', (e) => {
    // If the user was dragging to orbit/pan, ignore click so rotation is completely free!
    if (isDragging) {
      isDragging = false;
      return;
    }

    raycaster.setFromCamera(mouse, camera);

    // 1. Check components (with recursive search into child meshes)
    const compHits = raycaster.intersectObjects(Object.values(compMeshes), true);
    for (const hit of compHits) {
      const compNode = getComponentFromHit(hit.object);
      if (compNode && compNode.visible) {
        selectItem('component', compNode.userData.id);
        onSelect({ type: 'component', id: compNode.userData.id });
        return;
      }
    }

    // 2. Check layer plates
    const plateHits = raycaster.intersectObjects(Object.values(layerMeshes), true);
    for (const hit of plateHits) {
      const plate = getLayerFromHit(hit.object);
      if (plate && plate.visible) {
        selectItem('layer', plate.userData.id);
        onSelect({ type: 'layer', id: plate.userData.id });
        return;
      }
    }

    // 3. Clicked empty space -> clear selection smoothly
    clearSelection();
    onSelect(null);
  });
}

function getSelectedMesh() {
  if (selectedType === 'component' && selectedId) return compMeshes[selectedId];
  return null;
}

function highlightNode(node) {
  if (node.userData.emblemGroup) {
    node.userData.emblemGroup.position.y = 0.68;
  }
  if (node.userData.edgeLine) {
    node.userData.edgeLine.material.color.set('#ff5722');
    node.userData.edgeLine.material.opacity = 1.0;
  }
}

function unhighlightNode(node) {
  if (node.userData.emblemGroup) {
    node.userData.emblemGroup.position.y = 0.52;
  }
  if (node.userData.edgeLine) {
    const col = new THREE.Color(node.userData.color || '#38bdf8');
    node.userData.edgeLine.material.color.copy(col.multiplyScalar(1.8));
    node.userData.edgeLine.material.opacity = 0.95;
  }
}

// ── Public Selection & Tactical Dependency Isolation ──────
export function selectItem(type, id) {
  selectedType = type;
  selectedId = id;

  if (type === 'component') {
    const comp = COMPONENT_MAP[id];
    if (!comp) return;

    const connectedIds = [id, ...(comp.connections || [])];
    const participatingLayerIds = connectedIds.map(cId => COMPONENT_MAP[cId]?.layerId).filter(Boolean);

    // Deactivate previous targeting reticles
    activeReticles.forEach(ret => { ret.material.opacity = 0.0; });
    activeReticles = [];

    // 1. Tactical Layer Isolation: HIDE layers that are not part of this selection!
    STACK_LAYERS.forEach(l => {
      const plate = layerMeshes[l.id];
      if (plate) {
        const isParticipating = participatingLayerIds.includes(l.id);
        plate.visible = isParticipating;
        plate.material.opacity = isParticipating ? 0.92 : 0.0;
      }
    });

    // 2. Component Dependency Isolation: Show only connected nodes; hide unrelated nodes
    Object.values(compMeshes).forEach(node => {
      const isConnected = connectedIds.includes(node.userData.id);
      if (isConnected) {
        node.visible = true;
        node.position.y = node.userData.baseY + (node.userData.id === id ? 0.22 : 0.10);
        if (node.userData.crystalMesh) {
          node.userData.crystalMesh.material.opacity = 1.0;
          node.userData.crystalMesh.material.emissiveIntensity = 0.55;
        }
        if (node.userData.tagMesh) {
          node.userData.tagMesh.material.opacity = 1.0;
        }

        // Activate Lock-On Targeting Reticle [ + ]
        if (node.userData.targetReticle) {
          node.userData.targetReticle.material.opacity = 0.95;
          activeReticles.push(node.userData.targetReticle);
        }
      } else {
        // Hide components that are not part of the active dependency trace!
        node.visible = false;
        node.position.y = node.userData.baseY;
        if (node.userData.targetReticle) {
          node.userData.targetReticle.material.opacity = 0.0;
        }
      }
    });

    // 3. Draw Cinematic High-Speed Laser Conduits & Digital Data Pulses
    drawConnections(comp);

    // 4. Smoothly frame the active dependency workflow from the side-angle perspective
    const avgPos = new THREE.Vector3();
    let validCount = 0;
    connectedIds.forEach(cId => {
      const m = compMeshes[cId];
      if (m && m.visible) { avgPos.add(m.position); validCount++; }
    });
    if (validCount > 0) avgPos.divideScalar(validCount);

    if (currentCameraMode === 'iso') {
      animateCameraTo(
        new THREE.Vector3(avgPos.x * 0.35 + 14.0, avgPos.y + 11.5, avgPos.z + 18.0),
        new THREE.Vector3(avgPos.x * 0.2, avgPos.y, avgPos.z),
        650
      );
    }
  } else if (type === 'layer') {
    focusLayer(id);
  }
}

export function clearSelection() {
  selectedType = null;
  selectedId = null;

  // Restore all layer plates visibility & opacity
  STACK_LAYERS.forEach(l => {
    const plate = layerMeshes[l.id];
    if (plate) {
      plate.visible = true;
      plate.material.opacity = 0.88;
    }
  });

  // Deactivate all targeting reticles
  activeReticles.forEach(ret => { ret.material.opacity = 0.0; });
  activeReticles = [];

  // Restore all component stations visibility
  Object.values(compMeshes).forEach(node => {
    node.visible = true;
    node.position.y = node.userData.baseY;
    if (node.userData.crystalMesh) {
      node.userData.crystalMesh.material.opacity = 0.88;
      node.userData.crystalMesh.material.emissiveIntensity = 0.18;
    }
    if (node.userData.tagMesh) {
      node.userData.tagMesh.material.opacity = 1.0;
    }
    unhighlightNode(node);
  });

  clearConnections();

  // Return smoothly to side-angle ISO camera framing
  if (currentCameraMode === 'iso') {
    animateCameraTo(ISO_CAM_POS, ISO_CAM_TGT, 650);
  }
}

export function focusLayer(layerId) {
  selectedType = 'layer';
  selectedId = layerId;

  const targetPlate = layerMeshes[layerId];
  if (!targetPlate) return;

  const targetY = targetPlate.position.y;
  const targetZ = targetPlate.position.z;

  // Spotlight this layer; hide or dim others
  STACK_LAYERS.forEach(l => {
    const plate = layerMeshes[l.id];
    if (plate) {
      const isTarget = (l.id === layerId);
      plate.visible = true;
      plate.material.opacity = isTarget ? 0.95 : 0.12;
    }
  });

  Object.values(compMeshes).forEach(node => {
    if (node.userData.layerId === layerId) {
      node.visible = true;
      if (node.userData.crystalMesh) node.userData.crystalMesh.material.opacity = 1.0;
      if (node.userData.tagMesh) node.userData.tagMesh.material.opacity = 1.0;
      node.position.y = node.userData.baseY + 0.14;
    } else {
      node.visible = false;
      node.position.y = node.userData.baseY;
    }
  });

  clearConnections();

  // Smooth camera glide to frame the selected layer with full visibility
  if (currentCameraMode === 'iso') {
    animateCameraTo(
      new THREE.Vector3(12.0, targetY + 7.5, targetZ + 16.5),
      new THREE.Vector3(0, targetY, targetZ * 0.4),
      650
    );
  }
}

// ── Cinematic Movie Computer Mapping: Laser Conduits & Data Pulses ──
function drawConnections(comp) {
  clearConnections();
  const sourceNode = compMeshes[comp.id];
  if (!sourceNode || !comp.connections) return;

  const startPt = sourceNode.position.clone();
  startPt.y += 0.55;

  const sourceLayer = LAYERS.find(l => l.id === comp.layerId);
  const sourceLevel = sourceLayer ? sourceLayer.stackLevel : 3;

  comp.connections.forEach(connId => {
    const targetNode = compMeshes[connId];
    if (!targetNode) return;

    const endPt = targetNode.position.clone();
    endPt.y += 0.55;

    const targetComp = COMPONENT_MAP[connId];
    const targetLayer = targetComp ? LAYERS.find(l => l.id === targetComp.layerId) : null;
    const targetLevel = targetLayer ? targetLayer.stackLevel : 3;

    // Color-code flow direction
    let flowColorHex = 0x00f0ff; // Default cyan for upstream data sources
    if (targetLevel > sourceLevel) {
      flowColorHex = 0xff7043; // Glowing solar/coral for downstream consumers
    } else if (targetLevel === sourceLevel) {
      flowColorHex = 0xc084fc; // Radiant purple for lateral processing
    }

    // Build 3D arching cubic bezier curve that loops cleanly through space
    const dist = startPt.distanceTo(endPt);
    const midX = (startPt.x + endPt.x) / 2;
    const maxY = Math.max(startPt.y, endPt.y);
    const midY = maxY + 1.2 + Math.min(dist * 0.18, 3.0);
    const maxZ = Math.max(startPt.z, endPt.z);
    const midZ = maxZ + 1.2 + Math.abs(startPt.x - endPt.x) * 0.12;

    const ctrl1 = new THREE.Vector3(
      startPt.x * 0.75 + midX * 0.25,
      startPt.y + (midY - startPt.y) * 0.8,
      startPt.z + (midZ - startPt.z) * 0.85
    );
    const ctrl2 = new THREE.Vector3(
      endPt.x * 0.75 + midX * 0.25,
      endPt.y + (midY - endPt.y) * 0.8,
      endPt.z + (midZ - endPt.z) * 0.85
    );

    const curve = new THREE.CubicBezierCurve3(startPt, ctrl1, ctrl2, endPt);

    // 1. Core high-intensity laser beam
    const coreGeo = new THREE.TubeGeometry(curve, 48, 0.055, 8, false);
    const coreMat = new THREE.MeshBasicMaterial({
      color: flowColorHex,
      transparent: true,
      opacity: 0.95,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);
    connPipes.push(coreMesh);

    // 2. Outer volumetric luminous plasma sleeve
    const haloGeo = new THREE.TubeGeometry(curve, 48, 0.14, 8, false);
    const haloMat = new THREE.MeshBasicMaterial({
      color: flowColorHex,
      transparent: true,
      opacity: 0.38,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    scene.add(haloMesh);
    connPipes.push(haloMesh);

    // 3. High-Speed Digital Data Packet Stream (4 photons per conduit)
    const pulseCount = 4;
    for (let p = 0; p < pulseCount; p++) {
      const pGeo = new THREE.SphereGeometry(0.14, 12, 12);
      const pMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.98,
        blending: THREE.AdditiveBlending,
      });
      const pulseMesh = new THREE.Mesh(pGeo, pMat);
      scene.add(pulseMesh);
      connPulses.push({
        mesh: pulseMesh,
        offset: p / pulseCount,
        curve: curve,
        speed: 0.45,
      });
    }
  });
}

function clearConnections() {
  connPipes.forEach(mesh => {
    scene.remove(mesh);
    mesh.geometry.dispose();
    mesh.material.dispose();
  });
  connPipes = [];

  connPulses.forEach(p => {
    scene.remove(p.mesh);
    p.mesh.geometry.dispose();
    p.mesh.material.dispose();
  });
  connPulses = [];
}

// ── Camera Modes: ISO ⟷ FRONT ⟷ TOP ────────────────────────
export function setCameraMode(mode) {
  currentCameraMode = mode;
  if (mode === 'top') {
    animateCameraTo(TOP_CAM_POS, TOP_CAM_TGT, 750);
  } else if (mode === 'front') {
    animateCameraTo(FRONT_CAM_POS, FRONT_CAM_TGT, 750);
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
  camera.position.addScaledVector(dir, 3.0);
  controls.update();
}

export function zoomOut() {
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  camera.position.addScaledVector(dir, -3.0);
  controls.update();
}

export function panUp() {
  camera.position.y += 2.5;
  controls.target.y += 2.5;
  controls.update();
}

export function panDown() {
  camera.position.y -= 2.5;
  controls.target.y -= 2.5;
  controls.update();
}

// ── Separation & Exploded Mode ─────────────────────────────
export function setSeparation(pct) {
  sepMultiplier = 0.5 + (pct / 100) * 1.0;
  updatePositions();
}

export function setExploded(exploded) {
  sepMultiplier = exploded ? 1.15 : 0.65;
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
    const spacingX = 2.65;
    const startX = -((cols - 1) * spacingX) / 2;

    comps.forEach((comp, ci) => {
      const col = ci % cols;
      const row = Math.floor(ci / cols);
      const staggerX = (row === 0 && count > 3) ? (spacingX * 0.35) : 0;
      const posX = startX + col * spacingX + staggerX;
      const posZ = (row === 0 ? -1.45 : 1.25) + z;
      const elevationY = row === 0 ? 0.22 : 0;
      const baseY = y + PLATE_H / 2 + elevationY;

      const node = compMeshes[comp.id];
      if (node) {
        node.userData.baseY = baseY;
        node.userData.baseZ = posZ;
        node.position.set(posX, baseY, posZ);
      }
    });
  });

  if (baseMesh) {
    const baseboardY = getLayerY(0, sepMultiplier) - 1.4;
    baseMesh.position.y = baseboardY;
    if (gridHelper) gridHelper.position.y = baseboardY + 0.06;
  }

  if (selectedType === 'component' && selectedId) {
    const comp = COMPONENT_MAP[selectedId];
    if (comp) drawConnections(comp);
  }
}

// ── Open Source Filter ─────────────────────────────────────
export function highlightOpenSource(highlight) {
  Object.values(compMeshes).forEach(node => {
    const comp = COMPONENT_MAP[node.userData.id];
    if (!comp) return;

    if (highlight) {
      if (comp.opensrc) {
        if (node.userData.crystalMesh) {
          node.userData.crystalMesh.material.emissive.set('#00f0ff');
          node.userData.crystalMesh.material.emissiveIntensity = 0.6;
        }
      } else {
        if (node.userData.crystalMesh) node.userData.crystalMesh.material.opacity = 0.20;
        if (node.userData.tagMesh) node.userData.tagMesh.material.opacity = 0.20;
      }
    } else {
      if (node.userData.crystalMesh) {
        node.userData.crystalMesh.material.emissive.set(node.userData.color || '#38bdf8');
        node.userData.crystalMesh.material.emissiveIntensity = 0.18;
        node.userData.crystalMesh.material.opacity = 0.88;
      }
      if (node.userData.tagMesh) {
        node.userData.tagMesh.material.opacity = 1.0;
      }
    }
  });
}

// ── Camera Animation Helper ────────────────────────────────
function animateCameraTo(targetPos, targetLookAt, duration = 650) {
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
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    camera.position.lerpVectors(camStartPos, camEndPos, ease);
    controls.target.lerpVectors(camStartTgt, camEndTgt, ease);

    if (t >= 1) camTweening = false;
  }

  // 1. Continuous rotation of base power reticles
  animatedReticles.forEach(ret => {
    ret.mesh.rotation.z += ret.speed;
  });

  // 2. Idle levitation harmonic bobbing of 3D icon crystals
  animatedEmblems.forEach(emb => {
    emb.group.position.y = emb.baseY + Math.sin(time * 0.0022 + emb.phase) * 0.04;
  });

  // 3. Rotating lock-on targeting reticles [ + ]
  activeReticles.forEach(ret => {
    ret.rotation.z += 0.02;
  });

  // 4. High-speed digital laser data packet streams
  if (connPulses.length > 0) {
    connPulses.forEach(p => {
      const progress = ((time * 0.001 * p.speed) + p.offset) % 1.0;
      const pt = p.curve.getPointAt(progress);
      p.mesh.position.copy(pt);
    });
  }

  controls.update();
  renderer.render(scene, camera);
}
