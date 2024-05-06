import Vue from 'vue'
Vue.mixin({
  methods: {
    $msg(message, type = 'info') {
      this.$message({
        type,
        message,
        duration: 5000,
        offset: 120,
      })
    },
    $success(message) {
      this.$msg(message, 'success')
    },
    $warn(message) {
      this.$msg(message, 'warning')
    },
    $fail(message) {
      this.$msg(message, 'error')
    },
  },
})
