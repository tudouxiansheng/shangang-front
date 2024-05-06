import { createApp } from 'vue'
import App from '../App.vue'
createApp(App).mixin({
  data() {
    return {}
  },
  mounted() {
    this.showPlaceholderToTitle()
  },
  methods: {
    showPlaceholderToTitle() {
      let ipts = document.querySelectorAll('input')
      Array.from(ipts).forEach(i => {
        !i.disabled && i.setAttribute('title', i?.placeholder)
      })
    }
  }
})
