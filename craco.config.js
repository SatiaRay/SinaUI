const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      if (process.env.REACT_APP_WIDGET === "true") {
        webpackConfig.entry = path.resolve(__dirname, "src/widget.js");
      } else {
        webpackConfig.entry = path.resolve(__dirname, "src/index.js");
      }
      return webpackConfig;
    },
  },
};