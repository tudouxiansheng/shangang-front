/**
 * 操作权限处理 v-hasPermi
 */
import { selectUserPermissions } from '../../utils/api'

export default {
  async inserted(el, binding, vnode) {
    const { value } = binding
    let permissions = JSON.parse(sessionStorage.getItem('userPermList'))
    if (!permissions) {
      let res = await selectUserPermissions({})
      if (res.resultCode == 0) {
        sessionStorage.setItem('userPermList', JSON.stringify(res.permList))
        permissions = res.permList
      }
    }
    if (value && value instanceof Array && value.length > 0) {
      const permissionFlag = value
      const hasPermissions = permissions.some((permission) => {
        return permissionFlag.includes(permission.code)
      })
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`请设置操作权限code值`)
    }
  },
}
