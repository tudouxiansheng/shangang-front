import { getUploadUrl } from '../utils/api'
export default {
  methods: {
    uploadFile(file) {
      return new Promise((resolve, reject) => {
        getUploadUrl({})
          .then((res) => {
            if (res.resultCode === 0) {
              let uploadUrl = res.uploadUrl
              // 文件上传
              let format = new FormData()
              format.append('file', file)
              this.$postFetch(uploadUrl, format)
                .then((res1) => {
                  if (res1.resultCode == 0) {
                    resolve(res1)
                  } else {
                    reject()
                  }
                })
                .catch((err) => reject(err))
            }
          })
          .catch((err) => reject(err))
      })
    },
    handleRemove(file, fileList) {
      this.fileList = fileList
      // 上传图片 > 6 则隐藏上传组件
      this.hideUploadBtn = fileList.length >= 3
    },
    handleChangeFile(f, fileList) {
      let file = f.raw
      let types = ['jpg', 'jpeg', 'png']
      let size = file.size / 1024 / 1024 <= 5
      if (types.indexOf(file.type.split('/')[1]) == -1) {
        this.$message.warning(this.$t('tips.format'))
        fileList.splice(-1, 1)
        return false
      }
      if (!size) {
        this.$message.warning(this.$t('tips.max', { size: 5 }))
        fileList.splice(-1, 1)
        return false
      }
      if (!this.checkFileLength(file.name)) {
        fileList.splice(-1, 1)
        return false
      }
      this.hideUploadBtn = fileList.length >= 3
      this.fileList = fileList
    },

    // 检查文件是否为excel
    checkExcel(fileName) {
      let isTypeTrue = false
      if (fileName) {
        isTypeTrue = /\.(xls|xlsx)$/.test(fileName.toLowerCase())
      }
      return isTypeTrue
    },
    // 检查文件名称长度是否小于64,
    checkFileLength(name, n = 64) {
      let inLength = false
      if (name) {
        // 处理文件名中存在多个点
        let nameArr = name.split('.')
        nameArr.pop()
        let nameStr = nameArr.join('')
        if (nameStr.length <= 64) {
          inLength = true
        } else {
          this.$message.warning(this.$t('tips.fileName'))
        }
      }
      return inLength
    },
  },
}
