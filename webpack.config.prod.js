// webpack.config.prod.js
import { fileURLToPath } from 'url';
import path from 'path';
import webpack from 'webpack';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'dist'),
    // Use contenthash for caching purposes
    filename: 'js/[name].[contenthash].js',
    // Adjust this if deploying to a subdirectory (e.g., GitHub Pages)
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    splitChunks: {
      chunks: 'all', // This will split vendor code into separate chunks
    },
    runtimeChunk: 'single', // Extract runtime code into its own chunk
  },
  performance: {
    maxAssetSize: 300000, // Warn for assets larger than 300KB
    maxEntrypointSize: 500000, // Warn for entry points larger than 500KB
    hints: 'warning',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      // Minify the HTML for production
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
      },
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
      analyzerMode: 'static', // Outputs and HTML file for analysis
      openAnalyzer: false, // Set to true to automatically open the report
    }),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true, // Ensures the service worker takes control of the page immediately
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
  ],
});

