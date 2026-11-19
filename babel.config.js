module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // plugins:[
  //   'react-native-reanimated/plugin',
  // ]
  env: {
    // Strip console.log etc. from release builds (they slow the app down); errors are kept
    production: {
      plugins: [['transform-remove-console', { exclude: ['error'] }]],
    },
  },
};
