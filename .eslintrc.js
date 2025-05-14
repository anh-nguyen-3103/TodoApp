module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    curly: ['error', 'all'],
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-no-bind': [
      'error',
      {
        ignoreDOMComponents: false,
        ignoreRefs: false,
        allowArrowFunctions: false,
        allowFunctions: false,
        allowBind: false,
        ignoreDOMElements: false,
      },
    ],
    'react/no-unstable-nested-components': [
      'warn',
      {
        allowAsProps: true,
      },
    ],
  },
};
