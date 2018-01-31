const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");
const BrowserSyncPlugin = require("browser-sync-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BabelMinifyPlugin = require("babel-minify-webpack-plugin");
const path = require("path");

module.exports = {
  entry: ["./src/js/app.js", "./src/scss/site.scss"],
  output: {
    path: __dirname + "/dist",
    filename: "bundle.min.js"
  },
  devtool: "source-map",
  module: {
    loaders: [
      {
        test: /\.(s*)css$/,
        loader: ExtractTextPlugin.extract(["css-loader", "sass-loader", "resolve-url-loader", "sass-loader?sourceMap"]),
        exclude: "/node_modules"
      },
      {
        test: /\.(svg|gif|png|eot|woff|woff2|ttf)$/,
        loaders: ["url-loader"],
        exclude: "/node_modules"
      },
      {
        test: /\.js$/,
        loader: "babel-loader?presets[]=es2015",
        exclude: "/node_modules"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // define where to save the file
      filename: "site.bundle.css"
    }),
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.optimize\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: { removeAll: true } },
      canPrint: true
    }),
    new WriteFilePlugin(),
    new BrowserSyncPlugin({
      // browse to http://localhost:3000/ during development,
      // ./public directory is being served
      host: "169.254.59.103",
      port: 9999,
      proxy: "http://localhost:8421/",
      files: "src/*",
      files: "index.html"
    }),
    // new UglifyJsPlugin(),
    // new BabelMinifyPlugin()
  ],
  devServer: {
    port: 8421
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.js",
      'splitting': path.join(__dirname, '/node_modules/splitting/splitting.css')
    }
  }
};
