// webpack.config.dev.js
import { merge } from 'webpack-merge'
import common from './webpack.common.js'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';


// noinspection JSCheckFunctionSignatures
export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    open: true,
    static: ['./'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // no hardcoded <script> tags
      inject: 'body',          // Injects scripts at the end of the body
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
