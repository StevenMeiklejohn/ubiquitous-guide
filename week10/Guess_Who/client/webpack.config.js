config = {
  entry: __dirname + "/src/app.jsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/build"
  },
  resolve: {
    extensions: [' ','.js', '.jsx']
  },
    devtool: 'source-map',
    module:{
        rules: [{
          test: /\.jsx?$/,
          exclude: /(node_modules)/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react']
          }
        }]
      },

  devtool: 'source-map'
}

module.exports = config;
