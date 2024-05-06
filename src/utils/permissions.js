import {selectUserPermissions} from "./api"
export async function permissions(Permission) {
  let PermissionFlag = false;
  if(!sessionStorage.getItem("userPermList")){
    let res = await selectUserPermissions({})
        if(res.resultCode==0){
          sessionStorage.setItem("userPermList",JSON.stringify(res.permList))
          let userPermList = JSON.parse(sessionStorage.getItem("userPermList"))
          if(userPermList&&userPermList.length) {
            PermissionFlag = userPermList.some(item=>item.code ==Permission)
          }else {
            PermissionFlag = true;
          }
        } else {
          PermissionFlag = true;
        }

  }else{
    let userPermList = JSON.parse(sessionStorage.getItem("userPermList"))
    if(userPermList&&userPermList.length) {
      PermissionFlag = userPermList.some(item=>item.code ==Permission)
    }else {
      PermissionFlag = true;
    }
  }

  return PermissionFlag
}
