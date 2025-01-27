import path from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: {
    app: './src/app.js', // Main entry point
    login: './src/auth/login.js', // Login page entry
    signup: './src/auth/signup.js', // Signup page entry
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].js', // Dynamic filenames based on entry points
    clean: true,
  },
  plugins: [
    // Generate HTML file for the main app
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html', // Path to the main app HTML template
      chunks: ['app'], // Include only the app.js script
    }),
    // Generate HTML file for the login page
    new HtmlWebpackPlugin({
      filename: 'login.html',
      template: './src/pages/login.html', // Path to the login HTML template
      chunks: ['login'], // Include only the login.js script
    }),
    // Generate HTML file for the signup page
    new HtmlWebpackPlugin({
      filename: 'signup.html',
      template: './src/pages/signup.html', // Path to the signup HTML template
      chunks: ['signup'], // Include only the signup.js script
    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/i, // CSS loader
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
