const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project root directory
const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Configure Metro to handle aliases
config.resolver.alias = {
  '@': path.resolve(projectRoot),
};

module.exports = config;
