let currentVnode = null
let currentEl = null

const blurFunc = function(evt) {
  if ((!currentVnode) || (!currentEl)) return
  
  const domWrapper = currentEl.querySelector('.el-input__wrapper')

  currentVnode.ctx.exposeProxy.blur()

  // 删除聚焦样式
  let timeout = setTimeout(() => {
    domWrapper.classList.remove('is-focus')
    clearTimeout(timeout)
    timeout = null
  }, 200)

}

export default {
  beforeMount(el, binding, vnode) {
    currentEl = el
    currentVnode = vnode

    const dom = el.querySelector('.el-input__inner')
    dom.addEventListener('focus', blurFunc, { capture: true })
  },

  unmounted(el) {
    const dom = el.querySelector('.el-input__inner')
    dom.removeEventListener('focus', blurFunc, { capture: true })
    currentVnode = null
    currentEl = null
  }
}