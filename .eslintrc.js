module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: ["react-app"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2020,
    sourceType: "module"
  },
  rules: {
    "no-unused-vars": "warn",
    "no-console": "off"
  }
};
