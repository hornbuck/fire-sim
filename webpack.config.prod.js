import webpack from 'webpack';
const { DefinePlugin } = webpack;
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';

export default merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: 'single',
  },
  performance: {
    maxAssetSize: 300000,
    maxEntrypointSize: 500000,
    hints: 'warning',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img', noErrorOnMissing: true },
        { from: 'css', to: 'css', noErrorOnMissing: true },
        { from: 'js/vendor', to: 'js/vendor', noErrorOnMissing: true },
        { from: 'icon.svg', to: 'icon.svg', noErrorOnMissing: true },
        { from: 'favicon.ico', to: 'favicon.ico', noErrorOnMissing: true },
        { from: 'robots.txt', to: 'robots.txt', noErrorOnMissing: true },
        { from: 'icon.png', to: 'icon.png', noErrorOnMissing: true },
        { from: '404.html', to: '404.html', noErrorOnMissing: true },
        { from: 'site.webmanifest', to: 'site.webmanifest', noErrorOnMissing: true },
        { from: 'assets', to: 'assets', noErrorOnMissing: true },
      ],
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    })
  ],
});
