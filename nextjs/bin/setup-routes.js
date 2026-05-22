#!/usr/bin/env node
/**
 * Post-install: rename placeholder folder names to Next.js dynamic-segment brackets.
 *
 * The project ships with `-id-`, `-username-`, `--...section--` folder names
 * because the upstream design tool can't write `[`/`]` in paths.
 * Next.js App Router NEEDS bracketed folder names — so we rename here.
 *
 * Idempotent: safe to run multiple times.
 */

const fs = require('fs');
const path = require('path');

const RENAMES = [
  ['app/explore/-category-', 'app/explore/[category]'],
  ['app/photo/-id-', 'app/photo/[id]'],
  ['app/photographer/-username-', 'app/photographer/[username]'],
  ['app/photographers/-filter-', 'app/photographers/[filter]'],
  ['app/me/--...section--', 'app/me/[[...section]]'],
];

const root = path.resolve(__dirname, '..');

for (const [from, to] of RENAMES) {
  const src = path.join(root, from);
  const dst = path.join(root, to);
  if (fs.existsSync(dst)) {
    // already renamed — clean up old placeholder if both exist
    if (fs.existsSync(src)) fs.rmSync(src, { recursive: true, force: true });
    console.log('  ✓', to, '(already in place)');
    continue;
  }
  if (fs.existsSync(src)) {
    fs.renameSync(src, dst);
    console.log('  ✓ renamed', from, '→', to);
  } else {
    console.log('  · skip', from, '(not found)');
  }
}

console.log('Route setup done.');
