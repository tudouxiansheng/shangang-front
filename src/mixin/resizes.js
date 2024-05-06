export default {
  mounted() {
    window.addEventListener('resize', this.chartResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.chartResize)
  },
  methods: {
    chartResize() {},
  },
}
