module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 192, // 根据设计图尺寸写，设计图是1920，就写192
      propList: ['*'], // 需要被转换的属性
      selectorBlackList: ['.el-time'], // 不进行px转换的选择器，不转换element的标签样式，根据自己项目需求来定义
    },
  },
}
