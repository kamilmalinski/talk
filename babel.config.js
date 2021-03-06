/**
 * This is a project wide babel configuration.
 * https://babeljs.io/docs/en/config-files#project-wide-configuration
 */

// Note: If Webpack env is set, we are building for the client.

const plugins =
  process.env.WEBPACK === "true" ? ["use-lodash-es", "lodash"] : [];

const environment =
  process.env.WEBPACK === "true"
    ? { targets: "IE 11", modules: false }
    : { targets: { node: "current" }, modules: "commonjs" };

module.exports = {
  babelrcRoots: ["./src/core/client/*"],
  plugins,
  presets: [["@babel/env", environment]],
};
