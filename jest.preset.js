const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  testMatch: ['**/__tests__/**/*.ts', '**/__tests__/**/*.tsx'],
};
