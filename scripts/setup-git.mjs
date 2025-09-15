#!/usr/bin/env node

/**
 * Setup script to configure git for fabric.js development
 * This script configures the union merge driver for CHANGELOG.md to prevent merge conflicts
 */

import { execGitCommand } from './git.mjs';

function setupGitConfig() {
  console.log('🔧 Setting up git configuration for fabric.js development...\n');
  
  try {
    // Configure union merge driver for CHANGELOG.md
    // The union merge driver automatically resolves conflicts by taking both sides
    execGitCommand('git config merge.union.driver true');
    console.log('✅ Configured union merge driver for automatic CHANGELOG.md conflict resolution');
    
    // Verify the configuration
    const unionDriver = execGitCommand('git config --get merge.union.driver')[0];
    if (unionDriver === 'true') {
      console.log('✅ Union merge driver configuration verified');
    } else {
      throw new Error('Failed to verify union merge driver configuration');
    }
    
    console.log('\n🎉 Git configuration complete!');
    console.log('📋 The CHANGELOG.md file will now automatically merge without conflicts');
    console.log('   using the union merge strategy as defined in .gitattributes');
    
  } catch (error) {
    console.error('❌ Error setting up git configuration:', error.message);
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  setupGitConfig();
}

export { setupGitConfig };