import Vue from 'vue'
Vue.mixin({
  methods: {
    // 补0
    p(s) {
      return s < 10 ? '0' + s : s
    },
    $newTime(val) {
      const d = new Date(val)
      const resDate =
        d.getFullYear() +
        '-' +
        this.p(d.getMonth() + 1) +
        '-' +
        this.p(d.getDate())
      const resTime =
        this.p(d.getHours()) +
        ':' +
        this.p(d.getMinutes()) +
        ':' +
        this.p(d.getSeconds())
      return resDate + ' ' + resTime
    },
  },
})
