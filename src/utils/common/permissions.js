// 判断用户权限
import api from '@/api'
export async function permissions(Permission) {
  let PermissionFlag = false
  let userPermList = JSON.parse(sessionStorage.getItem('userPermList'))

  if (!userPermList) {
    const res = await api.selectUserPermissions({})
    if (res.resultCode == 0) {
      sessionStorage.setItem('userPermList', JSON.stringify(res.permList))
      userPermList = res.permList
    }
  }
  if (userPermList && userPermList.length) {
    for (let i = 0; i < userPermList.length; i++) {
      if (userPermList[i].code == Permission) {
        PermissionFlag = true
        return PermissionFlag
      }
    }
  } else {
    PermissionFlag = true
  }

  return PermissionFlag
}
