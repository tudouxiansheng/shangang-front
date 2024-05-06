'use strict'
const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

// Add environment variable
process.env.VUE_APP_VERSION = require('./package.json').version

const name = '智能视频物联网业务中台' // 标题

const port = process.env.port || 8080 // 端口

// vue.config.js 配置说明
// 官方vue.config.js 参考文档 https://cli.vuejs.org/zh/config/#css-loaderoptions
// 这里只列一部分，具体配置参考文档
module.exports = {
  publicPath: '/AIV-MP/',
  // 在npm run build 或 yarn build 时 ，生成文件的目录名称（要和baseUrl的生产环境路径一致）（默认dist）
  outputDir: 'AIV-MP',
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  assetsDir: 'static',
  lintOnSave: false,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  runtimeCompiler: true,
  pages: {
    index: {
      entry: 'src/views/mini/main.js',
      template: 'public/index.html',
    },
  },
  // webpack-dev-server 相关配置
  devServer: {
    host: '0.0.0.0',
    port: port,
    open: false,
    proxy: {
      '/uas': {
        // target: 'http://172.16.11.41:10000', //开发环境
        // target: 'http://172.16.11.119:10000', //开发环境
        // target: 'http://172.16.11.87:10000', //测试环境
        target: 'http://172.16.11.87:10000', //测试环境
        // target: 'http://121.37.136.149:10000', //演示环境
        // target: 'http://172.16.11.68:10000', //测试环境
        changeOrigin: true,
        pathRewrite: {
          '^/uas': '/uas',
        },
      },
    },
    disableHostCheck: true,
  },
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    externals: {},
    output: {
      jsonpFunction: `webpackJsonp-main-vue2`,
    },
  },
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/assets/icons')).end()
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    config.module
      .rule('images')
      .test(/.(jpg|jpeg|png|gif)$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 100,
        outputPath: 'static/img',
        name: '[hash:16].[ext]',
      })
      .end()
  },
  pluginOptions: {},
}
