#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building SidecarAI Bid Scanner Chrome Extension...');

// Ensure dist directory exists
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Build the React app
console.log('📦 Building React application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ React build completed');
} catch (error) {
  console.error('❌ React build failed:', error.message);
  process.exit(1);
}

// Copy extension-specific files
console.log('📋 Copying extension files...');
const publicDir = path.join(__dirname, '..', 'public');
const filesToCopy = [
  'manifest.json',
  'background.js',
  'content-script.js',
  'popup.html',
  'popup.js',
  'options.html',
  'options.js',
  'icon.svg',
  'favicon.ico'
];

filesToCopy.forEach(file => {
  const sourcePath = path.join(publicDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✅ Copied ${file}`);
  } else {
    console.warn(`⚠️  Warning: ${file} not found in public directory`);
  }
});

// Verify critical files exist
const criticalFiles = ['manifest.json', 'background.js', 'content-script.js'];
const missingFiles = criticalFiles.filter(file => !fs.existsSync(path.join(distDir, file)));

if (missingFiles.length > 0) {
  console.error('❌ Critical files missing:', missingFiles.join(', '));
  process.exit(1);
}

// Create a simple validation of the manifest
try {
  const manifestPath = path.join(distDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  if (!manifest.name || !manifest.version || !manifest.manifest_version) {
    throw new Error('Invalid manifest.json');
  }
  
  console.log('✅ Manifest validation passed');
} catch (error) {
  console.error('❌ Manifest validation failed:', error.message);
  process.exit(1);
}

console.log('🎉 Extension build completed successfully!');
console.log('');
console.log('📁 Extension files are in the "dist" directory');
console.log('');
console.log('📋 To load in Chrome:');
console.log('   1. Open chrome://extensions/');
console.log('   2. Enable "Developer mode"');
console.log('   3. Click "Load unpacked"');
console.log('   4. Select the "dist" folder');
console.log('');
console.log('📦 To create a zip file: npm run package'); 