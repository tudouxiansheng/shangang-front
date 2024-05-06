// import Vue from 'vue'
import { createApp } from 'vue'
import App from '../App.vue'
createApp(App).mixin({
  data() {
    return {
      locale: localStorage.getItem('locale')
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  }
})
