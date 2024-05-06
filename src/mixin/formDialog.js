var formDialog = {
  data() {
    return {
      preForm: {},
      dialogClose: false,
    }
  },
  watch: {
    form: {
      handler: function (nowVal, oldVal) {
        for (let i in nowVal) {
          if (nowVal[i].constructor === Object) {
            for (let j in nowVal[i]) {
              if (nowVal[i][j] != this.preForm[i][j]) {
                console.log(nowVal[i][j])
                this.dialogClose = true
                break
              } else {
                this.dialogClose = false
              }
            }
          } else {
            if (nowVal[i] != this.preForm[i]) {
              console.log(i, nowVal[i])
              this.dialogClose = true
              break
            } else {
              this.dialogClose = false
            }
          }
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.preForm = Object.assign({}, this.form)
  },
  methods: {
    beforeClose() {
      if (this.dialogClose) {
        this.$confirm('您填入的内容尚未保存，确定离开此页面吗？', {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          closeOnClickModal: false,
        })
          .then((_) => {
            this.$parent.dialogFormVisible = false
            this.dialogClose = false
          })
          .catch((_) => {})
      } else {
        this.$parent.dialogFormVisible = false
        this.dialogClose = false
      }
    },
  },
}

export default formDialog
