/**
 * DATABRICKS PLATFORM EXPLORER — 100% Inline Vector SVG Icon Engine
 * 
 * High-fidelity, self-contained SVG icons for every component, layer,
 * and service in the Databricks & DAIS 2026 Ecosystem.
 * Zero external CDN calls, zero network lag, zero broken boxes.
 */

// ── Master SVG Definition Registry (viewBox="0 0 24 24") ────
export const SVGS = {
  // ── Brand / Core Ecosystem Logos ──
  'databricks': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 3.5 7.4v9.2L12 21.5l8.5-4.9V7.4L12 2.5zm0 2.3 6.5 3.7-6.5 3.8-6.5-3.8 6.5-3.7zm-7 5.2 6 3.5v7.2l-6-3.5V10zm8 10.7v-7.2l6-3.5v7.2l-6 3.5z"/></svg>`,
  'spark': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2C11.5 2 10 5.5 8 7c-1.5 1.1-3.5 1.2-5 .5 1.8 1.8 4.2 2.2 6.2 1.5-.8 1.4-2.2 2.4-3.7 2.8 2.2.8 4.7.2 6.3-1.2-.5 1.6-1.5 3.1-3 4 2.5.2 5-1.2 6.2-3.3 0 2.2-.8 4.4-2.5 5.9 3.2-.8 5.6-3.5 6-6.7 1.4 1.4 3.4 2.1 5.5 2-1.8-1.5-2.9-3.7-3-6 1.8.8 3.8.8 5.5.1-2.1-1.3-4.6-1.4-6.8-.5.8-1.5 2-2.7 3.6-3.3-2.3-.4-4.7.5-6.1 2.2.3-2.1-.2-4.3-1.7-5.9-.6 1.8-1.7 3.3-3.2 4.2.3-1.8-.1-3.7-1.2-5.1-.3 1.6-1.1 3-2.4 3.9.5-1.9.2-3.9-.8-5.5z"/></svg>`,
  'delta': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 1.8 20.2h20.4L12 2.5zm0 4.8 6.5 11.3H5.5L12 7.3zm0 3.2-3.6 6.3h7.2L12 10.5z"/></svg>`,
  'iceberg': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 4.5 13.5h15L12 2zm-7.5 13c1.5 0 2.5-1 4-1s2.5 1 4 1 2.5-1 4-1 2.5 1 4 1v1c-1.5 0-2.5-1-4-1s-2.5 1-4 1-2.5-1-4-1-2.5 1-4 1v-1zm1.5 3.2L8 22h8l2-3.8c-1.5.5-2.8.8-4 .8s-2.5-.5-4-.5-2.8.5-4 .7z"/></svg>`,
  'mlflow': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M3 12h6m6 0h6M12 3v6m0 6v6M5.6 5.6l4.3 4.3m4.2 4.2 4.3 4.3M18.4 5.6l-4.3 4.3m-4.2 4.2-4.3 4.3"/></svg>`,
  's3': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C7.6 2 4 3.3 4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5c0-1.7-3.6-3-8-3zm6 14c0 .8-2.7 1.5-6 1.5s-6-.7-6-1.5v-2.2c1.6.8 3.7 1.2 6 1.2s4.4-.4 6-1.2V16zm0-4.5c0 .8-2.7 1.5-6 1.5s-6-.7-6-1.5V9.3c1.6.8 3.7 1.2 6 1.2s4.4-.4 6-1.2v2.2zm0-4.5c0 .8-2.7 1.5-6 1.5s-6-.7-6-1.5C6 5.7 8.7 5 12 5s6 .7 6 1.5V7z"/></svg>`,
  'kafka': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><circle cx="5" cy="6" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="6" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="M7 7.2l3.3 3.3m-3.3 6.3l3.3-3.3m6.4-3.3 3.3-3.3m-3.3 6.3 3.3 3.3" stroke="currentColor" stroke-width="1.8"/></svg>`,
  'database': `<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="12" cy="5" rx="7" ry="2.8"/><path d="M5 5v5c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V5m-14 5.5v5c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-5m-14 5.5v5c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-5" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>`,
  'postgres': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.8 8.1 6.8 9.4.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.5-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.2-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.7-.3 2.5-.3s1.7.1 2.5.3c1.9-1.3 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.7.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5 .3.3.6.8.6 1.7v2.5c0 .3.2.6.7.5 4-1.3 6.8-5 6.8-9.4 0-5.5-4.5-10-10-10z"/></svg>`,
  'cloud': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 18h10a4 4 0 000-8 5 5 0 00-9.6-1.3A3.6 3.6 0 007 18Z"/></svg>`,
  'airflow': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="3" fill="currentColor"/><path d="M12 2v7m0 6v7M2 12h7m6 0h7M4.9 4.9l5 5m4.2 4.2 5 5M19.1 4.9l-5 5m-4.2 4.2-5 5"/></svg>`,
  'dbt': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 3 7.7v8.6l9 5.2 9-5.2V7.7L12 2.5zm0 2.5 6.8 3.9-2.8 1.6-6.8-3.9 2.8-1.6zm-7 4.9 6 3.5v7l-6-3.5v-7zm8 10.5v-7l2.8-1.6v3.2l3.2-1.8v-3.2l2 1.2v7.2l-8 4.7z"/></svg>`,
  'powerbi': `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="13" width="4" height="8" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/></svg>`,
  'tableau': `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="11" y="2" width="2" height="6" rx="1"/><rect x="11" y="16" width="2" height="6" rx="1"/><rect x="2" y="11" width="6" height="2" rx="1"/><rect x="16" y="11" width="6" height="2" rx="1"/><rect x="7" y="6" width="2" height="4" rx="0.5"/><rect x="15" y="6" width="2" height="4" rx="0.5"/><rect x="7" y="14" width="2" height="4" rx="0.5"/><rect x="15" y="14" width="2" height="4" rx="0.5"/><circle cx="12" cy="12" r="1.5"/></svg>`,
  'jupyter': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 8.5C5.8 4.6 9.6 2 14 2c4.8 0 8.8 3.1 10.2 7.5M20 15.5C18.2 19.4 14.4 22 10 22c-4.8 0-8.8-3.1-10.2-7.5"/><circle cx="17.5" cy="5.5" r="1.5" fill="currentColor"/><circle cx="6.5" cy="18.5" r="1.5" fill="currentColor"/><circle cx="19.5" cy="18.5" r="1" fill="currentColor"/></svg>`,
  'terraform': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 2.5h6.7v6.7H1.5zm7.3 7.3h6.7v6.7H8.8zm0-7.3h6.7v6.7H8.8zm7.4 7.3h6.7v6.7h-6.7zm-7.4 7.4h6.7v6.7H8.8z"/></svg>`,

  // ── DAIS 2026 Modern Databricks Platform Icons ──
  'apps': `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>`,
  'watch': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/></svg>`,
  'people': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M2.5 20c0-3.3 2.5-5.5 5.5-5.5S13.5 16.7 13.5 20Z"/><path d="M14.6 20c.2-2.6 1.7-4.2 3.9-4.2 2.2 0 3.7 1.8 3.9 4.2Z"/></svg>`,
  'genie': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 4.3 2.7 6.4 7 7-4.3.6-6.4 2.7-7 7-.6-4.3-2.7-6.4-7-7 4.3-.6 6.4-2.7 7-7Z"/><path d="M19.5 13c.2 1.6 1 2.4 2.5 2.7-1.5.3-2.3 1.1-2.5 2.6-.2-1.5-1-2.3-2.5-2.6 1.5-.3 2.3-1.1 2.5-2.7Z"/></svg>`,
  'lamp': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2.5 16c0-1.9 3-3.3 8-3.3 1.4 0 2.7.1 3.8.3l3.6-2.2c.5-.3 1.1-.1 1.3.4.2.5 0 1-.4 1.3l-1.9 1c1.3.7 2.1 1.5 2.1 2.5 0 2-3.8 3.3-8.5 3.3S2.5 18 2.5 16Z"/><path d="M9.5 12.6V9.5h4v3" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`,
  'bricks': `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="4" width="8.5" height="4.3" rx="1.2"/><rect x="13" y="4" width="8" height="4.3" rx="1.2"/><rect x="3" y="9.8" width="8" height="4.3" rx="1.2"/><rect x="12.5" y="9.8" width="8.5" height="4.3" rx="1.2"/><rect x="3" y="15.6" width="8.5" height="4.3" rx="1.2"/><rect x="13" y="15.6" width="8" height="4.3" rx="1.2"/></svg>`,
  'flower': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2.3"/><circle cx="12" cy="19" r="2.3"/><circle cx="5.2" cy="8.5" r="2.3"/><circle cx="18.8" cy="8.5" r="2.3"/><circle cx="5.2" cy="15.5" r="2.3"/><circle cx="18.8" cy="15.5" r="2.3"/><circle cx="12" cy="12" r="2.6"/></svg>`,
  'cog': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3.2"/><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v3.2M12 18.8V22M2 12h3.2M18.8 12H22M4.9 4.9l2.3 2.3M16.8 16.8l2.3 2.3M19.1 4.9l-2.3 2.3M7.2 16.8l-2.3 2.3"/></g></svg>`,
  'agent': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="8" width="14" height="11" rx="3"/><path d="M12 3.5v3.3"/><circle cx="12" cy="2.8" r="1.2" fill="currentColor"/><circle cx="9.6" cy="13.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.4" cy="13.5" r="1.1" fill="currentColor" stroke="none"/></svg>`,
  'flow': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7.5h11l-3-3M21 7.5h-3.5"/><path d="M21 16.5H10l3 3M3 16.5h3.5"/></svg>`,
  'house': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 2 11h3v9h5v-5h4v5h5v-9h3z"/></svg>`,
  'layers': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 2 7l10 5 10-5z"/><path d="M2 12l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M2 17l10 5 10-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  'db': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="7" ry="2.8" fill="currentColor" stroke="none"/><path d="M5 5v6c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8V5"/><path d="M5 11v6c0 1.6 3.1 2.8 7 2.8s7-1.2 7-2.8v-6"/></svg>`,
  'model': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 7.5 16 11M8 16.5 16 12.8"/><circle cx="6" cy="7" r="2.2" fill="currentColor" stroke="none"/><circle cx="6" cy="17" r="2.2" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="2.4" fill="currentColor" stroke="none"/></svg>`,
  'share': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M8 11 16 6.9M8 13 16 17.1"/><circle cx="6" cy="12" r="2.4" fill="currentColor" stroke="none"/><circle cx="18" cy="6" r="2.4" fill="currentColor" stroke="none"/><circle cx="18" cy="18" r="2.4" fill="currentColor" stroke="none"/></svg>`,
  'one': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 7.2 13.2 5v14h-2.6V8.6l-1.8 1z"/></svg>`,
  'code': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7 3.5 12 8 17M16 7l4.5 5L16 17"/></svg>`,
  'ops': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11a8 8 0 10-1.6 5.5"/><path d="M20 4.5V10h-5.3"/></svg>`,

  // ── Engine, Compute, Pipeline & Security ──
  'cpu': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3"/></svg>`,
  'zap': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2 3 14h8l-2 8 10-12h-8l2-8z"/></svg>`,
  'factory': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/></svg>`,
  'brain': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-5-.4 2.5 2.5 0 0 1-3-3.1 3 3 0 0 1-.3-5.6A2.5 2.5 0 0 1 5 6.2 2.5 2.5 0 0 1 7 3a2.5 2.5 0 0 1 2.5-1zm5 0A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 5-.4 2.5 2.5 0 0 0 3-3.1 3 3 0 0 0 .3-5.6 2.5 2.5 0 0 0-1.3-4.2 2.5 2.5 0 0 0-2-3.2A2.5 2.5 0 0 0 14.5 2z"/></svg>`,
  'rocket': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 15l-3-3a22 22 0 0 1 2-4 13 13 0 0 1 11-6c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2zm-3-3H4s.5-3 2-4c1.6-1 5 0 5 0m1 7v5s3-.5 4-2c1-1.6 0-5 0-5m-7.5 4.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.2 2.2 0 0 0-2.9-.1z"/></svg>`,
  'search': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>`,
  'shield': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  'key': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="7.5" cy="15.5" r="4.5"/><path d="m11 12 9-9m-5 1 2 2m-4 2 2 2"/></svg>`,
  'network': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="2" width="6" height="5" rx="1"/><rect x="2" y="17" width="6" height="5" rx="1"/><rect x="16" y="17" width="6" height="5" rx="1"/><path d="M12 7v5m0 0H5v5m7-5h7v5"/></svg>`,
  'link': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
  'check': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 12 2 2 4-4"/></svg>`,
  'file': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2 5 5h-5V4z"/></svg>`,
  'refresh': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8m0-5v5h-5M21 12a9 9 0 0 1-15 6.7L3 16m0 5v-5h5"/></svg>`,
  'package': `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 3 7.7v8.6l9 5.2 9-5.2V7.7L12 2.5zm0 2.4 6.8 3.9-6.8 3.9-6.8-3.9 6.8-3.9zm-7 5.1 6 3.4v6.8l-6-3.4V10zm8 10.2v-6.8l6-3.4v6.8l-6 3.4z"/></svg>`,
  'monitor': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>`,
  'user': `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-7 8-7s8 3 8 7z"/></svg>`,
  'bag': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>`,
};

// ── Mapping of Component IDs to SVGs key ────────────────────
export const COMPONENT_ICON_KEY = {
  // Layer 05: Apps & Analytics
  'aibi':                  'apps',
  'genie':                 'genie',
  'dbx-apps':              'apps',
  'clean-rooms':           'shield',
  'delta-sharing':         'share',
  'marketplace':           'bag',
  'notebooks':             'jupyter',

  // Layer 04: AI & Machine Learning
  'model-serving':         'rocket',
  'vector-search':         'search',
  'mlflow':                'mlflow',
  'feature-store':         'database',
  'automl':                'zap',
  'mosaic-ai':             'brain',

  // Layer 03: Engineering & SQL
  'spark':                 'spark',
  'photon':                'zap',
  'lakeflow-pipelines':    'flow',
  'databricks-sql':        'databricks',
  'ai-functions':          'code',
  'compute-clusters':      'cpu',

  // Layer 02: Data Ingestion
  'auto-loader':           'refresh',
  'lakeflow-connect':      'network',
  'structured-streaming':  'flow',
  'partner-connect':       'link',

  // Layer 01: Storage & Tables
  'delta-lake':            'delta',
  'iceberg':               'iceberg',
  'volumes':               'package',
  'cloud-storage':         's3',
  'medallion':             'layers',

  // Across Platform: Governance
  'unity-catalog':         'cog',
  'aigateway':             'agent',
  'lineage':               'link',
  'system-tables':         'database',

  // Across Platform: Operations
  'workflows':             'airflow',
  'lakehouse-monitoring':  'watch',
  'serverless-compute':    'cloud',

  // Across Platform: Integrations
  'terraform':             'terraform',
  'dbt':                   'dbt',
  'bi-connectors':         'powerbi',
};

// ── Layer Representatives ──────────────────────────────────
export const LAYER_ICON_KEY = {
  apps:         'apps',
  ai:           'brain',
  engineering:  'cpu',
  ingestion:    'flow',
  storage:      'delta',
  governance:   'cog',
  operations:   'ops',
  integrations: 'network',
};

/**
 * Returns raw SVG string for a given icon name.
 */
export function getSvg(iconName) {
  let svg = SVGS[iconName] || SVGS['databricks'];
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" ');
  }
  return svg;
}

/**
 * Returns raw SVG markup string for a given component ID with xmlns attribute.
 */
export function getIconSvg(compId) {
  const iconKey = COMPONENT_ICON_KEY[compId] || (SVGS[compId] ? compId : 'databricks');
  let svg = SVGS[iconKey] || SVGS['databricks'];
  if (!svg.includes('xmlns=')) {
    svg = svg.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" ');
  }
  return svg;
}

/**
 * Renders an inline SVG icon for a component.
 * 
 * @param {string} compId Component ID (or direct SVG key)
 * @param {Object} opts
 * @param {number} [opts.size=18] Size in px
 * @param {string} [opts.color] CSS color string (hex, hsl, rgb, var)
 * @param {string} [opts.cls=''] Additional CSS class
 * @param {boolean} [opts.tile=false] Render in a glowing rounded tile
 */
export function renderIcon(compId, { size = 18, color = 'currentColor', cls = '', tile = false } = {}) {
  const iconKey = COMPONENT_ICON_KEY[compId] || (SVGS[compId] ? compId : 'databricks');
  const svgMarkup = SVGS[iconKey] || SVGS['databricks'];

  if (tile) {
    return `<span class="icon-tile ${cls}" style="color:${color};width:${size + 14}px;height:${size + 14}px;display:inline-flex;align-items:center;justify-content:center;background:rgba(255,54,33,0.12);border-radius:10px;flex-shrink:0;">
      <span class="icon-inner" style="width:${size}px;height:${size}px;display:flex;align-items:center;justify-content:center;">
        ${svgMarkup}
      </span>
    </span>`;
  }

  return `<span class="comp-icon-svg ${cls}" style="color:${color};width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
    ${svgMarkup}
  </span>`;
}

/**
 * Renders an inline SVG icon for a layer.
 */
export function renderLayerIcon(layerId, { size = 16, color = 'currentColor', cls = '' } = {}) {
  const iconKey = LAYER_ICON_KEY[layerId] || 'databricks';
  const svgMarkup = SVGS[iconKey] || SVGS['databricks'];
  return `<span class="layer-icon-svg ${cls}" style="color:${color};width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">
    ${svgMarkup}
  </span>`;
}
