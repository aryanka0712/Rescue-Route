// Trusted, bundled simulation shell. srcDoc avoids a second hosted HTML response
// whose frame-ancestors policy can reject the surrounding preview's origin.
// The base keeps all supplied modules, fonts, images and CSS at /simulation/.
export const SIMULATION_DOCUMENT = `<!doctype html>
<html lang="en"><head><base href="/simulation/"/><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><meta name="theme-color" content="#0B1020"/><meta name="description" content="Simulation is an offline 3D flood and evacuation simulation. Know who is at risk, where to go, and how to get there."/><link rel="icon" type="image/svg+xml" href="/simulation/assets/logo.svg"/><script src="/simulation/appearance.js?v=embed-v2"></script><title>Simulation — A clearer way to safety</title>  <script type="module" crossorigin src="/simulation/assets/index-JB_hNxhk.js"></script>
  <link rel="modulepreload" crossorigin href="/simulation/assets/three-Dc5JXPPH.js">
  <link rel="modulepreload" crossorigin href="/simulation/assets/charts-DG3I7PnE.js">
  <link rel="stylesheet" crossorigin href="/simulation/assets/index-DiLKVZsR.css">
<link rel="stylesheet" href="/simulation/appearance.css"/></head><body><div id="root"></div></body></html>
`;
