import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'

Vue.use(VueI18n)

// 引入各个语言配置文件
import zh from './config/zh'
import en from './config/en'

// 创建vue-i18n实例
const i18n = new VueI18n({
  // 设置默认语言
  locale: localStorage.getItem('locale') || 'en', //语言标识
  messages: {
    zh, //中文
    en, //英文
  },
})
//重点：为了实现element插件的多语言切换
locale.i18n((key, value) => i18n.t(key, value)) //为了实现element插件的多语言切换
// console.log('%c当前缓存语言是：' + (localStorage.getItem('locale') == 'en' ? 'English' : '中文') + '', 'color:#fff;background:green;padding:4px;border-radius:5px');
export default i18n
