const path = require('path');

const webpackConfig = {
  mode: "development",
  // Especificar 'web' para asegurar que los módulos de Node (como fs) no rompan los tests en el navegador
   target: 'web', 
  module: {
    rules: [
      //{ test: /\.(js|jsx)$/, exclude: /node_modules/, use: "babel-loader" },
      { 
        test: /\.(js|jsx)$/, 
        exclude: /node_modules/, 
        use: {
          loader: 'babel-loader',
          // **CORRECCIÓN CLAVE:** Forzamos los presets para que Babel lea JSX en el entorno de test
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'] 
          }
        } 
      },
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      { test: /\.(svg|png|jpg|jpeg|gif)$/, use: "file-loader" }
    ],
  },
  resolve: { 
    extensions: [".js", ".jsx"],
  },
  // Configuración de optimización y performance para un entorno de test más limpio
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: 'commons',
    },
    runtimeChunk: 'single',
    minimize: false
  },
  performance: {
    hints: false
  }
};

module.exports = function (config) {
  config.set({
    basePath: "",
    frameworks: ["jasmine"],
    files: ["test/**/*.spec.js"],
    preprocessors: { "test/**/*.spec.js": ["webpack"] },
    webpack: webpackConfig,
    browsers: ["ChromeHeadless"],
    singleRun: true,
    reporters: ["progress"],
    // Aseguramos que los timeouts sean suficientes
    browserDisconnectTimeout: 10000, 
    browserNoActivityTimeout: 10000,
  });
};