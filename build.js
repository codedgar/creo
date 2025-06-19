#!/usr/bin/env node

/**
 * =============================================================================
 * Creo CSS Framework Build Script (Node.js)
 * =============================================================================
 * Cross-platform build script with advanced features
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Utility functions for colored output
const log = {
  info: (msg) => console.log(`${colors.blue}[Creo]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[Creo]${colors.reset} ✅ ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}[Creo]${colors.reset} ⚠️  ${msg}`),
  error: (msg) => console.log(`${colors.red}[Creo]${colors.reset} ❌ ${msg}`),
};

// Build configuration
const config = {
  srcDir: 'scss',
  distDir: 'dist',
  mainFile: 'creo.scss',
  leanFile: 'creo.lean.scss',
  packageJson: require('./package.json'),
};

// Check if sass is available
async function checkDependencies() {
  try {
    execSync('sass --version', { stdio: 'ignore' });
  } catch (error) {
    log.error('Sass compiler not found!');
    log.info('Installing sass...');
    try {
      execSync('npm install sass --save-dev', { stdio: 'inherit' });
      log.success('Sass installed successfully');
    } catch (installError) {
      log.error('Failed to install sass');
      process.exit(1);
    }
  }
}

// Ensure directory exists
async function ensureDir(dirPath) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// Get file size in human readable format
async function getFileSize(filePath) {
  try {
    const stats = await fs.stat(filePath);
    const bytes = stats.size;
    const sizes = ['B', 'KB', 'MB'];
    if (bytes === 0) return '0 B';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round(bytes / Math.pow(1024, i) * 100) / 100} ${sizes[i]}`;
  } catch (error) {
    return 'Unknown';
  }
}

// Clean dist directory
async function cleanDist() {
  log.info('Cleaning dist directory...');
  try {
    await fs.rm(config.distDir, { recursive: true, force: true });
    await ensureDir(config.distDir);
    log.success('Cleaned dist directory');
  } catch (error) {
    log.error(`Failed to clean dist directory: ${error.message}`);
    throw error;
  }
}

// Create lean build file if it doesn't exist
async function createLeanBuild() {
  const leanPath = path.join(config.srcDir, config.leanFile);
  
  try {
    await fs.access(leanPath);
  } catch (error) {
    log.warning('Creating lean build file...');
    
    const leanContent = `// =============================================================================
// Creo CSS Framework - Lean Build
// =============================================================================
// Minimal build for maximum performance

// Core essentials only
@use 'core/tokens';
@use 'core/reset';
@use 'core/typography';

// Essential layout
@use 'layout/containers';
@use 'layout/sections';

// Dark theme (lightweight)
@use 'themes/dark';

// Framework metadata
:root {
  --creo-version: "${config.packageJson.version}-lean";
  --creo-framework: "Creo CSS Lean";
}`;

    await fs.writeFile(leanPath, leanContent);
    log.success('Created lean build file');
  }
}

// Compile Sass file
async function compileSass(inputFile, outputFile, options = {}) {
  const { style = 'expanded', sourceMap = true } = options;
  
  try {
    const inputPath = path.join(config.srcDir, inputFile);
    const outputPath = path.join(config.distDir, outputFile);
    
    let command = `sass ${inputPath} ${outputPath} --style=${style}`;
    if (sourceMap) {
      command += ' --source-map --embed-sources';
    }
    
    execSync(command, { stdio: 'inherit' });
    
    const size = await getFileSize(outputPath);
    return { success: true, size };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Build expanded CSS
async function buildExpanded() {
  log.info('Building expanded CSS...');
  const result = await compileSass(config.mainFile, 'creo.css', { style: 'expanded' });
  
  if (result.success) {
    log.success(`Built creo.css (${result.size})`);
  } else {
    log.error(`Failed to build expanded CSS: ${result.error}`);
    throw new Error(result.error);
  }
}

// Build compressed CSS
async function buildCompressed() {
  log.info('Building compressed CSS...');
  const result = await compileSass(config.mainFile, 'creo.min.css', { style: 'compressed' });
  
  if (result.success) {
    log.success(`Built creo.min.css (${result.size})`);
  } else {
    log.error(`Failed to build compressed CSS: ${result.error}`);
    throw new Error(result.error);
  }
}

// Build lean variants
async function buildLean() {
  await createLeanBuild();
  
  log.info('Building lean CSS...');
  
  const expandedResult = await compileSass(config.leanFile, 'creo.lean.css', { style: 'expanded' });
  const compressedResult = await compileSass(config.leanFile, 'creo.lean.min.css', { style: 'compressed' });
  
  if (expandedResult.success && compressedResult.success) {
    log.success(`Built lean builds (${expandedResult.size} / ${compressedResult.size})`);
  } else {
    const errors = [expandedResult.error, compressedResult.error].filter(Boolean);
    log.error(`Failed to build lean CSS: ${errors.join(', ')}`);
    throw new Error(errors.join(', '));
  }
}

// Generate build info file
async function generateBuildInfo() {
  log.info('Generating build information...');
  
  const buildInfo = `Creo CSS Framework Build Information
====================================

Build Date: ${new Date().toISOString()}
Version: ${config.packageJson.version}
Node.js Version: ${process.version}
Platform: ${process.platform}

Files Generated:
================

creo.css          - Full framework (expanded)
creo.min.css      - Full framework (compressed)
creo.lean.css     - Lean build (expanded)
creo.lean.min.css - Lean build (compressed)

File Sizes:
===========

${await Promise.all([
  'creo.css',
  'creo.min.css', 
  'creo.lean.css',
  'creo.lean.min.css'
].map(async (file) => {
  const size = await getFileSize(path.join(config.distDir, file));
  return `${file.padEnd(20)} - ${size}`;
})).then(sizes => sizes.join('\n'))}

Framework Modules Included:
===========================

Full Build:
- Core: Reset, Tokens, Typography
- Layout: Containers, Grid, Sections  
- Utilities: Spacing, Text, Responsive
- Themes: Dark Mode
- Components: Available as separate imports

Lean Build:
- Core: Reset, Tokens, Typography
- Layout: Containers, Sections
- Themes: Dark Mode
- Total reduction: ~60% smaller than full build

Usage:
======

HTML:
<link rel="stylesheet" href="creo.min.css">

Sass:
@use '@creo-framework/creo';

NPM:
npm install @creo-framework/creo

For more information: https://creo-framework.dev`;

  await fs.writeFile(path.join(config.distDir, 'BUILD_INFO.txt'), buildInfo);
  log.success('Generated build information');
}

// Display final summary
async function showSummary() {
  console.log('');
  console.log(`${colors.blue}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.blue}║                      Build Complete!                           ║${colors.reset}`);
  console.log(`${colors.blue}╚════════════════════════════════════════════════════════════════╝${colors.reset}`);
  console.log('');
  
  console.log('📦 Generated files:');
  try {
    const files = await fs.readdir(config.distDir);
    for (const file of files.sort()) {
      const filePath = path.join(config.distDir, file);
      const stats = await fs.stat(filePath);
      const size = await getFileSize(filePath);
      console.log(`   ${file.padEnd(20)} - ${size}`);
    }
  } catch (error) {
    log.error('Failed to read dist directory');
  }
  
  console.log('');
  console.log('💡 Quick start:');
  console.log('   <link rel="stylesheet" href="dist/creo.min.css">');
  console.log('');
  console.log('🔍 Build details in: dist/BUILD_INFO.txt');
  console.log('');
}

// Watch for changes
function watchFiles() {
  log.info('Starting watch mode...');
  log.warning('Press Ctrl+C to stop watching');
  
  try {
    execSync(`sass --watch ${config.srcDir}/${config.mainFile}:${config.distDir}/creo.css --style=expanded --source-map`, { 
      stdio: 'inherit' 
    });
  } catch (error) {
    if (error.signal === 'SIGINT') {
      log.info('Watch mode stopped');
    } else {
      log.error(`Watch mode failed: ${error.message}`);
    }
  }
}

// Main build function
async function buildAll() {
  await ensureDir(config.distDir);
  await cleanDist();
  await buildExpanded();
  await buildCompressed();
  await buildLean();
  await generateBuildInfo();
  await showSummary();
}

// Show help
function showHelp() {
  console.log('Creo CSS Framework Build Script');
  console.log('');
  console.log('Usage: node build.js [command]');
  console.log('       npm run build [command]');
  console.log('');
  console.log('Commands:');
  console.log('  all         Build all variants (default)');
  console.log('  expanded    Build expanded CSS only');
  console.log('  compressed  Build compressed CSS only');
  console.log('  lean        Build lean variants only');
  console.log('  clean       Clean dist directory');
  console.log('  watch       Watch for changes and rebuild');
  console.log('  help        Show this help message');
  console.log('');
}

// Main execution
async function main() {
  console.log(`${colors.blue}`);
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log(`║                 Creo CSS Framework Builder                     ║`);
  console.log(`║     v${config.packageJson.version.padEnd(8)}                   ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log(`${colors.reset}`);
  
  const command = process.argv[2] || 'all';
  
  try {
    await checkDependencies();
    
    switch (command) {
      case 'clean':
        await cleanDist();
        break;
        
      case 'expanded':
        await ensureDir(config.distDir);
        await buildExpanded();
        break;
        
      case 'compressed':
        await ensureDir(config.distDir);
        await buildCompressed();
        break;
        
      case 'lean':
        await ensureDir(config.distDir);
        await buildLean();
        break;
        
      case 'all':
        await buildAll();
        break;
        
      case 'watch':
        await ensureDir(config.distDir);
        watchFiles();
        break;
        
      case 'help':
      case '-h':
      case '--help':
        showHelp();
        break;
        
      default:
        // Default behavior: build all if no command or unknown command
        if (command === '' || command === undefined) {
          await buildAll();
        } else {
          log.error(`Unknown command: ${command}`);
          log.info("Use 'node build.js help' for available commands");
          process.exit(1);
        }
        break;
    }
  } catch (error) {
    log.error(`Build failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
  console.log('\n');
  log.info('Build interrupted by user');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log.info('Build terminated');
  process.exit(0);
});

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    log.error(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  buildAll,
  buildExpanded,
  buildCompressed,
  buildLean,
  cleanDist,
  config,
};