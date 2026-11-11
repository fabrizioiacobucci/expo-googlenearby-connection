const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
  
const config = getDefaultConfig(__dirname);

// Let Metro read the module's files in the parent folder, and resolve the module's name to them.
// `experiments.autolinkingModuleResolution` in app.json resolves react-native, expo and the other
// packages that the module also installs in ../node_modules to the copies that this app uses.
config.watchFolders = [path.resolve(__dirname, '..')];
config.resolver.extraNodeModules = { 'expo-googlenearby-connection': path.resolve(__dirname, '..') };
  
module.exports = withNativeWind(config, { input: './global.css' });