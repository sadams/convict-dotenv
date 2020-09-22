module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },

  extends: ['eslint:recommended', 'plugin:prettier/recommended'],

  parserOptions: {
    ecmaVersion: 12,
  },

  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',

    // rules: {
    //   semi: ['error', 'always'],
    //   'comma-dangle': ['error', 'only-multiline'],
  },
};
