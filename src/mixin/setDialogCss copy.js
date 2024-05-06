export let setDialogCssMixin = {
  methods: {
    // 设置弹框位置以及样式
    setDialogCss() {
      let cuType = JSON.parse(sessionStorage.getItem('cuType'))
      let longNav = JSON.parse(sessionStorage.getItem('vuex')).menu.longNav
      let thirdMenuShow = JSON.parse(sessionStorage.getItem('vuex')).menu.thirdMenuShow
      let thirdMenuList = JSON.parse(sessionStorage.getItem('thirdMenuList')) || []
      let el_dialog_wrapper = document.getElementsByClassName('el-dialog__wrapper')
      if (cuType == 4) {
        for (let i = 0; i < el_dialog_wrapper.length; i++) {
          if (el_dialog_wrapper[i].className.indexOf('changePwd') != -1) {
            break
          }
          el_dialog_wrapper[i].style.top = '50px'
          el_dialog_wrapper[i].style.height = 'calc(100% - 50px)'
          el_dialog_wrapper[i].style.background = 'rgba(0,0,0,0.5)'
        }
        if (longNav) {
          if (thirdMenuShow && thirdMenuList.length != 0) {
            for (let i = 0; i < el_dialog_wrapper.length; i++) {
              el_dialog_wrapper[i].style.left = '70px'
              el_dialog_wrapper[i].style.width = 'calc(100% - 70px)'
            }
          } else if (!thirdMenuShow && thirdMenuList.length != 0) {
            for (let i = 0; i < el_dialog_wrapper.length; i++) {
              el_dialog_wrapper[i].style.left = '230px'
              el_dialog_wrapper[i].style.width = 'calc(100% - 230px)'
            }
          } else {
            for (let i = 0; i < el_dialog_wrapper.length; i++) {
              el_dialog_wrapper[i].style.left = '64px'
              el_dialog_wrapper[i].style.width = 'calc(100% - 64px)'
            }
          }
        } else {
          if (thirdMenuShow && thirdMenuList.length != 0) {
            for (let i = 0; i < el_dialog_wrapper.length; i++) {
              el_dialog_wrapper[i].style.left = '206px'
              el_dialog_wrapper[i].style.width = 'calc(100% - 206px)'
            }
          } else if (!thirdMenuShow && thirdMenuList.length != 0) {
            for (let i = 0; i < el_dialog_wrapper.length; i++) {
              el_dialog_wrapper[i].style.left = '366px'
              el_dialog_wrapper[i].style.width = 'calc(100% - 366px)'
            }
          } else {
            for (let i = 0; i < el_dialog_wrapper.length; i++) {
              el_dialog_wrapper[i].style.left = '200px'
              el_dialog_wrapper[i].style.width = 'calc(100% - 200px)'
            }
          }
        }
      } else if (cuType == 1) {
        for (let i = 0; i < el_dialog_wrapper.length; i++) {
          el_dialog_wrapper[i].style.background = 'rgba(0,0,0,0.5)'
          el_dialog_wrapper[i].style.height = '100%'
        }

        if (thirdMenuShow && thirdMenuList.length != 0) {
          for (let i = 0; i < el_dialog_wrapper.length; i++) {
            el_dialog_wrapper[i].style.left = '6px'
            el_dialog_wrapper[i].style.width = 'calc(100% - 6px)'
          }
        } else if (!thirdMenuShow && thirdMenuList.length != 0) {
          for (let i = 0; i < el_dialog_wrapper.length; i++) {
            el_dialog_wrapper[i].style.left = '166px'
            el_dialog_wrapper[i].style.width = 'calc(100% - 166px)'
          }
        } else {
          for (let i = 0; i < el_dialog_wrapper.length; i++) {
            el_dialog_wrapper[i].style.left = '0px'
            el_dialog_wrapper[i].style.width = '100%'
          }
        }
      } else {
        for (let i = 0; i < el_dialog_wrapper.length; i++) {
          el_dialog_wrapper[i].style.width = '100%'
          el_dialog_wrapper[i].style.height = '100%'
          el_dialog_wrapper[i].style.background = 'rgba(0,0,0,0.5)'
        }
      }
    }
  }
}
