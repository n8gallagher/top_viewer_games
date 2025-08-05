#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🎮 Top Viewer Games Setup');
console.log('========================\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, 'env.example');

if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file from template...');
  
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ .env file created successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Edit the .env file with your Twitch API credentials');
    console.log('2. Get your credentials from: https://dev.twitch.tv/console');
    console.log('3. Run: npm run install:all');
    console.log('4. Run: npm run build');
    console.log('5. Run: npm start');
  } else {
    console.log('❌ env.example file not found!');
    console.log('Please create a .env file manually with your Twitch API credentials.');
  }
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('\n📦 Installing dependencies...');
  console.log('Run: npm run install:all');
} else {
  console.log('✅ Dependencies already installed');
}

// Check if frontend is built
const bundlePath = path.join(__dirname, 'frontend', 'dist', 'bundle.js');
if (!fs.existsSync(bundlePath)) {
  console.log('\n🔨 Frontend needs to be built...');
  console.log('Run: npm run build');
} else {
  console.log('✅ Frontend already built');
}

console.log('\n🚀 Ready to start! Run: npm start'); 