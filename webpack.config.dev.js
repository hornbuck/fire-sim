import { merge } from 'webpack-merge'
import common from './webpack.common.js'

// noinspection JSCheckFunctionSignatures
export default merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    liveReload: true,
    hot: true,
    open: true,
    static: ['./'],
  },
});
