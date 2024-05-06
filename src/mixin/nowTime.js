import Vue from 'vue'
Vue.mixin({
  methods: {
    $nowTime() {
      let date = new Date()
      let year = date.getFullYear()
      let month = this.p(date.getMonth() + 1)
      let day = this.p(date.getDate())
      let hour = this.p(date.getHours())
      let minute = this.p(date.getMinutes())
      let second = this.p(date.getSeconds())
      let nowTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`
      return nowTime
    },
  },
})
