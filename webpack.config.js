var path = require('path');

module.exports = {
  entry: {
    "goods":  ["./src/pages/goods/app.js"],
    "shop":  ["./src/pages/shop/app.js"]
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        use: ["json-loader"]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],//在webpack的module部分的loaders里进行配置即可
      },
      {
        test: /antd\/.*\.css$/,
        use: ['style-loader', 'css-loader']//添加对样式表的处理
      },
      {
        // test: /\.css$/,
        test(filePath) {
          return /\.css$/.test(filePath) && !/antd\/.*\.css$/.test(filePath)
        },
        use: ['style-loader', 'css-loader?module']//添加对样式表的处理
      }
    ]
  },
  devServer: {
      contentBase: path.resolve(__dirname, './demo'),//本地服务器所加载的页面所在的目录
      publicPath: path.resolve(__dirname, '/dist'),
      port: 8989,
      host: 'dev.52shangou.com',
      historyApiFallback: true,//不跳转
      inline: true//实时刷新
  }
};

