module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  globals: {
    App: "readonly",
    Page: "readonly",
    Component: "readonly",
    wx: "readonly",
    getApp: "readonly",
    getCurrentPages: "readonly",
  },
  extends: ["eslint:recommended"],
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "no-unused-vars": "off",
  },
};
