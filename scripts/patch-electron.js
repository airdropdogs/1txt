/**
 * Post-install patch for node_modules/electron
 *
 * Problem: node_modules/electron/index.js exports a path string to electron.exe.
 * When Electron's main process does require('electron'), Node resolves to this
 * npm package instead of Electron's built-in module, causing app = undefined.
 *
 * Fix: Rename index.js to _get_path.js, create a new index.js that detects
 * the runtime environment and acts accordingly:
 * - In Node.js (npm scripts, cli.js): re-exports _get_path.js (the exe path)
 * - In Electron main process: exports empty object (Electron's built-in takes over
 *   since we remove ourselves from Module._cache)
 */

const fs = require('fs');
const path = require('path');

const electronDir = path.join(__dirname, '..', 'node_modules', 'electron');
const indexJs = path.join(electronDir, 'index.js');
const getPathJs = path.join(electronDir, '_get_path.js');
const patchMarker = path.join(electronDir, '.patched');

// Skip if already patched
if (fs.existsSync(patchMarker)) {
  console.log('[patch-electron] Already patched, skipping.');
  process.exit(0);
}

if (!fs.existsSync(indexJs)) {
  console.log(
    '[patch-electron] node_modules/electron/index.js not found, skipping.'
  );
  process.exit(0);
}

// Step 1: Backup original index.js as _get_path.js
console.log('[patch-electron] Backing up index.js -> _get_path.js');
fs.copyFileSync(indexJs, getPathJs);

// Step 2: Write new index.js that handles both environments
const newIndexContent = `// Patched by scripts/patch-electron.js
// Detects runtime environment and provides correct exports.
if (process.versions && process.versions.electron) {
  // Inside Electron main process — remove ourselves from cache
  // so that Electron's built-in module resolver can take over on next require.
  delete require.cache[__filename];
  module.exports = {};
} else {
  // In Node.js (cli.js, npm scripts) — export the exe path
  module.exports = require('./_get_path.js');
}
`;

console.log('[patch-electron] Writing patched index.js');
fs.writeFileSync(indexJs, newIndexContent);

// Step 3: Mark as patched
fs.writeFileSync(patchMarker, new Date().toISOString());
console.log('[patch-electron] Done!');
