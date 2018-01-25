var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WriteFilePlugin = require("write-file-webpack-plugin");
var BrowserSyncPlugin = require("browser-sync-webpack-plugin");

module.exports = {
  entry: ["./src/js/app.js", "./src/scss/site.scss"],
  output: {
    path: __dirname + "/dist",
    filename: "bundle.min.js"
  },
  module: {
    loaders: [
      {
        test: /\.(s*)css$/,
        loader: ExtractTextPlugin.extract(["css-loader", "sass-loader", "resolve-url-loader", "sass-loader?sourceMap"])
      },
      {
        test: /\.(svg|gif|png|eot|woff|woff2|ttf)$/,
        loaders: ["url-loader"]
      },
      {
        test: /\.js$/,
        loader: "babel-loader?presets[]=es2015"
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      // define where to save the file
      filename: "site.bundle.css",
      allChunks: true
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
    })
  ],
  devServer: {
    port: 8421
  },
  resolve: {
    alias: {
      vue: "vue/dist/vue.js"
    }
  }
};
