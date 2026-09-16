'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const buildId = path.join(root, '.next', 'BUILD_ID');

if (fs.existsSync(buildId)) {
  process.exit(0);
}

console.log('No Next.js production build found. Running next build...');

const nextBin = require.resolve('next/dist/bin/next');
const result = spawnSync(process.execPath, [nextBin, 'build'], {
  cwd: root,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'production',
    NEXT_TELEMETRY_DISABLED: '1',
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'https://creliora-api.onrender.com',
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://couriergiant.com',
    NODE_OPTIONS: [process.env.NODE_OPTIONS, '--max-old-space-size=460']
      .filter(Boolean)
      .join(' '),
  },
});

process.exit(result.status ?? 1);
