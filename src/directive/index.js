import title from './modules/title'
import preventReClick from './modules/preventReClick'
import dialogDrag from './modules/dialogDrag'
import hasPermi from './modules/hasPermi'

const install = function (Vue) {
  Vue.directive('title', title)
  Vue.directive('dialogDrag', dialogDrag)
  Vue.directive('preventReClick', preventReClick)
  Vue.directive('hasPermi', hasPermi)
}
if (window.Vue) {
  window['hasPermi'] = hasPermi
  Vue.use(install); // eslint-disable-line
}
export default install
