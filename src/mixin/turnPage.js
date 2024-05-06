Vue.mixin({
  methods: {
    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      try {
        typeof eval(this.search_clear) === 'function' ? this.search_clear() : false
      } catch (e) {}
      this.getTableList()
      this.$refs.multipleTable?.setScrollTop(0)
    },

    // 分页
    handleCurrentChange(val) {
      this.pageNum = val
      try {
        typeof eval(this.search_clear) === 'function' ? this.search_clear() : false
      } catch (e) {}
      this.getTableList()
      this.$refs.multipleTable?.setScrollTop(0)
    },
  },
})
