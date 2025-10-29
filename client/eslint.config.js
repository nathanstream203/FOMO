// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
      presets: ['module:metro-react-native-babel-preset'],
      plugins: [
          ['module:react-native-dotenv', {
              "moduleName": "@env",
              "path": ".env",
              "blocklist": null,
              "allowlist": null,
              "safe": false,
              "allowUndefined": true
          }]
      ],
    ignores: ['dist/*'],
  },

]);
