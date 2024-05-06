import Vue from 'vue'
Vue.mixin({
  methods: {
    $getFileUrl(fileName, arr = []) {
      let file = document.getElementById(fileName).files[0]
      console.log(file)
      if (file) {
        if (arr.length === 0) {
          let formData = new FormData()
          formData.append('file', file)
          this.$fetch('/uas/v1/api/media/upload/url', {}).then((res) => {
            if (res.resultCode === 0) {
              this.$postFetch(res.uploadUrl, formData).then(() => {
                this.$fetch('/uas/v1/api/media/download/url', {
                  fileId: res.fileId,
                }).then((res1) => {
                  console.log(res1)
                  if (res1.resultCode === 0) {
                    arr.push({
                      src: res1.downloadUrl,
                      id: res.fileId,
                    })
                  }
                })
              })
            }
          })
        } else {
          if (arr.length >= 5) {
            this.$warn('最多可上传5张图片')
          } else {
            let formData = new FormData()
            formData.append('file', file)
            this.$fetch('/uas/v1/api/media/upload/url', {}).then((res) => {
              if (res.resultCode === 0) {
                this.$postFetch(res.uploadUrl, formData).then(() => {
                  this.$fetch('/uas/v1/api/media/download/url', {
                    fileId: res.fileId,
                  }).then((res1) => {
                    console.log(res1)
                    if (res1.resultCode === 0) {
                      arr.push({
                        src: res1.downloadUrl,
                        id: res.fileId,
                      })
                    }
                  })
                })
              }
            })
          }
        }
      }
    },
    $getVideoUrl(fileName, arr = []) {
      console.log(arr)
      let file = document.getElementById(fileName).files[0]
      if (file) {
        let size = file.size / 1024 / 1024
        if (size > 100) {
          this.$warn('文件最大不能超过100MB')
        } else {
          if (arr.length === 0) {
            let formData = new FormData()
            formData.append('file', file)
            this.$fetch('/uas/v1/api/media/upload/url', {}).then((res) => {
              if (res.resultCode === 0) {
                this.$postFetch(res.uploadUrl, formData).then(() => {
                  this.$fetch('/uas/v1/api/media/download/url', {
                    fileId: res.fileId,
                  }).then((res1) => {
                    console.log(res1)
                    if (res1.resultCode === 0) {
                      arr.push({
                        src: res1.downloadUrl,
                        id: res.fileId,
                      })
                    }
                  })
                })
              }
            })
          } else {
            if (arr.length >= 3) {
              this.$warn('最多可上传3个视频')
            } else {
              let formData = new FormData()
              formData.append('file', file)
              this.$fetch('/uas/v1/api/media/upload/url', {}).then((res) => {
                if (res.resultCode === 0) {
                  this.$postFetch(res.uploadUrl, formData).then(() => {
                    this.$fetch('/uas/v1/api/media/download/url', {
                      fileId: res.fileId,
                    }).then((res1) => {
                      console.log(res1)
                      if (res1.resultCode === 0) {
                        arr.push({
                          src: res1.downloadUrl,
                          id: res.fileId,
                        })
                      }
                    })
                  })
                }
              })
            }
          }
        }
      }
    },
  },
})
