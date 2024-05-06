// v-dialogDrag: 弹窗拖拽属性
export default {
  bind(el, binding, vnode, oldVnode) {
    let dialogHeaderEl = el.querySelector('.el-dialog__header')
    let dragDom = el.querySelector('.el-dialog')
    //dialogHeaderEl.style.cursor = 'move';
    dialogHeaderEl.style.cssText += ';cursor:move;'
    dragDom.style.cssText += ';top:0px;'

    // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
    let sty = (function () {
      if (window.document.currentStyle) {
        return (dom, attr) => dom.currentStyle[attr]
      } else {
        return (dom, attr) => getComputedStyle(dom, false)[attr]
      }
    })()

    dialogHeaderEl.onmousedown = (e) => {
      // 鼠标按下，计算当前元素距离可视区的距离
      let disX = e.clientX - dialogHeaderEl.offsetLeft
      let disY = e.clientY - dialogHeaderEl.offsetTop

      let screenWidth = document.body.clientWidth // body当前宽度
      let screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

      let dragDomWidth = dragDom.offsetWidth // 对话框宽度
      let dragDomheight = dragDom.offsetHeight // 对话框高度

      let minDragDomLeft = dragDom.offsetLeft
      let maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

      let minDragDomTop = dragDom.offsetTop
      let maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

      let cuType = JSON.parse(sessionStorage.getItem('cuType'))
      let longNav = JSON.parse(sessionStorage.getItem('vuex')).longNav
      let thirdMenuShow = JSON.parse(sessionStorage.getItem('vuex')).thirdMenuShow
      let thirdMenuList = JSON.parse(sessionStorage.getItem('thirdMenuList'))
      let leftTop = sessionStorage.getItem('leftTop')
      if (cuType == 5 && leftTop == null) {
        maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight - 50
        if (longNav) {
          if (thirdMenuShow && thirdMenuList.length != 0) {
            maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 70
          } else if (!thirdMenuShow && thirdMenuList.length != 0) {
            maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 230
          } else {
            maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 64
          }
        } else {
          if (thirdMenuShow && thirdMenuList.length != 0) {
            maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 206
          } else if (!thirdMenuShow && thirdMenuList.length != 0) {
            maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 366
          } else {
            maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 200
          }
        }
      } else if (cuType == 1 && leftTop == null) {
        maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

        if (thirdMenuShow && thirdMenuList.length != 0) {
          maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 6
        } else if (!thirdMenuShow && thirdMenuList.length != 0) {
          maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 166
        } else {
          maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth - 0
        }
      }

      // 获取到的值带px 正则匹配替换
      let styL = sty(dragDom, 'left')
      let styT = sty(dragDom, 'top')

      // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
      if (styL.includes('%')) {
        styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
        styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
      } else {
        styL = +styL.replace(/\px/g, '')
        styT = +styT.replace(/\px/g, '')
      }

      document.onmousemove = function (event) {
        // 通过事件委托，计算移动的距离
        let left = event.clientX - disX
        let top = event.clientY - disY

        // 边界处理
        if (-left > minDragDomLeft) {
          left = -minDragDomLeft
        } else if (left > maxDragDomLeft) {
          left = maxDragDomLeft
        }

        if (-top > minDragDomTop) {
          top = -minDragDomTop
        } else if (top > maxDragDomTop) {
          top = maxDragDomTop
        }

        // 移动当前元素
        dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
      }

      document.onmouseup = function () {
        document.onmousemove = null
        document.onmouseup = null
      }
    }
  },
}
