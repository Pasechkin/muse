module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
          cleanupIDs: false,
          removeTitle: false,
          removeDesc: false
        }
      }
    },
    'removeDimensions',
    'collapseGroups',
    'convertPathData',
    'cleanupNumericValues'
  ]
};
