const path = require('path');
const webpack = require('webpack');
const commonConfig = require('./webpack.config');

module.exports = (env, argv) => {
  const baseConfig = commonConfig(env, argv);

  return {
    ...baseConfig,
    entry: ['./web-entry'],
    target: 'web',
    output: {
      ...baseConfig.output,
      path: path.resolve(__dirname, 'dist-web'),
      publicPath: '/',
    },
    resolve: {
      ...baseConfig.resolve,
      alias: {
        ...(baseConfig.resolve?.alias || {}),
        electron: false,
        'electron-fetch': false,
        'electron-window-state': false,
        'electron-updater': false,
      },
    },
    plugins: [
      ...baseConfig.plugins,
      new webpack.DefinePlugin({
        'process.env.BUILD_TARGET': JSON.stringify('web'),
        __WEB__: JSON.stringify(true),
      }),
    ],
    devServer: {
      ...(baseConfig.devServer || {}),
      historyApiFallback: true,
      port: 4000,
      proxy: {
        '/api': {
          target: 'https://1txt.xyz',
          changeOrigin: true,
        },
      },
    },
  };
};
