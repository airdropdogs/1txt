const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const spawnSync = require('child_process').spawnSync;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const fs = require('fs');

// Load .env (if present) — values from .env override matching keys in
// config.json so contributors can keep their Supabase credentials out of
// the tracked config file.
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional — safe to ignore if not installed
}

function readConfig() {
  // Resolution order:
  //   1. config-local.json (gitignored, personal overrides)
  //   2. config.json       (gitignored after open-sourcing)
  //   3. config.sample.json (tracked template — fallback for fresh clones)
  const candidates = [
    './config-local.json',
    './config.json',
    './config.sample.json',
  ];
  const configPath = candidates.find((p) => fs.existsSync(p));

  if (!configPath) {
    // eslint-disable-next-line no-console
    console.error(
      `Could not load the required configuration file.\n` +
        'Please copy config.sample.json to config.json (or set SUPABASE_URL/SUPABASE_KEY in .env).\n' +
        'See README.md for setup instructions.'
    );
    throw new Error('Missing config.json');
  }

  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(`Failed to parse ${configPath}: ${e.message}`);
    throw e;
  }
}

function getConfig() {
  var config = readConfig();
  var pkg = require('./package.json');
  config.version = pkg.version;

  // Allow .env to override Supabase credentials (preferred for CI / local dev
  // without touching the tracked config).
  if (process.env.SUPABASE_URL) {
    config.supabase_url = process.env.SUPABASE_URL;
  }
  if (process.env.SUPABASE_KEY) {
    config.supabase_key = process.env.SUPABASE_KEY;
  }
  return config;
}

module.exports = () => {
  const isDevMode = process.env.NODE_ENV === 'development';
  const config = getConfig();

  return {
    context: __dirname + '/lib',
    mode: isDevMode ? 'development' : 'production',
    devtool:
      process.env.SOURCEMAP || (isDevMode && 'eval-cheap-module-source-map'),
    entry: ['./boot'],
    output: {
      filename: 'app.[fullhash].js',
      chunkFilename: '[name].[chunkhash].js',
      ...(config.is_app_engine && {
        publicPath: config.web_app_url + '/',
      }),
    },
    // target: 'browserslist', // this seems like it should be "node" or "electron-renderer" but those both crash
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader',
            },
          ],
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            isDevMode ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDevMode,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [autoprefixer()],
                },
                sourceMap: isDevMode,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                api: 'modern-compiler',
                sassOptions: {
                  includePaths: [__dirname + '/lib'],
                },
                sourceMap: isDevMode,
              },
            },
          ],
        },
        {
          test: /\.ttf$/,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json', '.scss', '.css', '.ts', '.tsx'],
      modules: ['node_modules'],
    },
    plugins: [
      new NodePolyfillPlugin({
        includeAliases: [
          'Buffer',
          'buffer',
          'path',
          'process',
          'stream',
          'util',
        ],
      }),
      new HtmlWebpackPlugin({
        'build-platform': process.platform,
        'build-reference': spawnSync('git', ['describe', '--always', '--dirty'])
          .stdout.toString('utf8')
          .replace('\n', ''),
        favicon: process.cwd() + '/resources/images/favicon.ico',
        'node-version': process.version,
        template: 'index.ejs',
        title: '1TXT',
      }),
      new MiniCssExtractPlugin({
        filename: isDevMode ? '[name].css' : '[name].[fullhash].css',
        chunkFilename: isDevMode ? '[id].css' : '[id].[fullhash].css',
      }),
      new MonacoWebpackPlugin({
        languages: [],
        // don't include features we disable. these generally correspond to the options
        // passed to editor initialization in note-content-editor.tsx
        // @see https://github.com/microsoft/monaco-editor/blob/main/webpack-plugin/README.md#options
        features: [
          '!bracketMatching',
          '!codeAction',
          '!codelens',
          '!colorPicker',
          '!comment',
          '!diffEditor',
          '!diffEditorBreadcrumbs',
          '!folding',
          '!gotoError',
          '!gotoLine',
          '!gotoSymbol',
          '!gotoZoom',
          '!inspectTokens',
          '!multicursor',
          '!parameterHints',
          '!quickCommand',
          '!quickHelp',
          '!quickOutline',
          '!referenceSearch',
          '!rename',
          '!snippet',
          '!stickyScroll',
          '!suggest',
          '!toggleHighContrast',
          '!unicodeHighlighter',
        ],
      }),
      new webpack.DefinePlugin({
        __TEST__: JSON.stringify(process.env.NODE_ENV === 'test'),
        config: JSON.stringify(config),
      }),
      new webpack.IgnorePlugin({
        resourceRegExp: /^\.\/locale$/,
        contextRegExp: /moment$/,
      }),
    ],
  };
};
