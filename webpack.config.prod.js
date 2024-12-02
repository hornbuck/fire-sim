import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { GenerateSW } from 'workbox-webpack-plugin';
import { DefinePlugin } from 'webpack';

export default merge(common, {
      mode: 'production',
      optimization: {
        minimize: true, // Enables minification
        splitChunks: {
          chunks: 'all', // Splits vendor code into separate chunks
        },
        runtimeChunk: 'single', // Extracts runtime logic for better caching
      },
      performance: {
        maxAssetSize: 300000, // Warn for assets larger than 300KB
        maxEntrypointSize: 500000, // Warn for entry points larger than 500kb
        hints: 'warning',
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './index.html',
        }),
        new CopyPlugin({
          patterns: [
            {from: 'img', to: 'img'},
            {from: 'css', to: 'css'},
            {from: 'js/vendor', to: 'js/vendor'},
            {from: 'icon.svg', to: 'icon.svg'},
            {from: 'favicon.ico', to: 'favicon.ico'},
            {from: 'robots.txt', to: 'robots.txt'},
            {from: 'icon.png', to: 'icon.png'},
            {from: '404.html', to: '404.html'},
            {from: 'site.webmanifest', to: 'site.webmanifest'},
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
        new DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('production'), // Ensures correct environment
        })
      ],
    });
