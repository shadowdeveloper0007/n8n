#!/usr/bin/env node

/**
 * n8n Server Entry Point for Render Deployment
 * This file starts n8n with proper configuration for Render hosting
 */

const { spawn } = require('child_process');
const path = require('path');

// Set environment variables for n8n
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

// Ensure n8n data directory exists
const n8nDataDir = process.env.N8N_USER_FOLDER || '/opt/render/project/src/.n8n';
process.env.N8N_USER_FOLDER = n8nDataDir;

console.log('🚀 Starting n8n server...');
console.log(`📁 Data directory: ${n8nDataDir}`);
console.log(`🌐 Host: ${process.env.N8N_HOST || '0.0.0.0'}`);
console.log(`🔌 Port: ${process.env.N8N_PORT || '3000'}`);
console.log(`🔒 Protocol: ${process.env.N8N_PROTOCOL || 'http'}`);

// Start n8n
const n8nProcess = spawn('npx', ['n8n', 'start'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Ensure n8n runs in production mode
    NODE_ENV: 'production'
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  n8nProcess.kill('SIGTERM');
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  n8nProcess.kill('SIGINT');
});

n8nProcess.on('close', (code) => {
  console.log(`✅ n8n process exited with code ${code}`);
  process.exit(code);
});

n8nProcess.on('error', (err) => {
  console.error('❌ Failed to start n8n:', err);
  process.exit(1);
});
