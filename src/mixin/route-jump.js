// 路由跳转
var routeJump = {
  data() {
    return {
      routeParams: {},
      routeParams1: {}
    }
  },

  methods: {
    getArrRepeat(arr1, arr2) {
      return arr1.filter(item => {
        return arr2.includes(item.menuId)
      })
    },
    // 删除缓存点击过三级菜单
    del_active_storage(menuId, thirdMenu_active_storage) {
      let index = 0
      for (let item of thirdMenu_active_storage) {
        if (item === menuId) {
          break
        }
        index++
      }
      thirdMenu_active_storage.splice(index, 1)
      return thirdMenu_active_storage
    },
    menuListRecursion(data, path) {
      data.forEach(item => {
        if (item.path === path) {
          this.routeParams.menuId = String(item.menuId)
          this.routeParams.menuName = item.menuName
          this.routeParams.parentId = item.parentId
          this.routeParams.children = item.children
          return
        } else {
          if (item.children) {
            this.menuListRecursion(item.children, path)
          }
        }
      })
    },
    menuListRecursion1(data, menuId) {
      data.forEach(item => {
        if (item.menuId == menuId) {
          this.routeParams1 = item
        } else {
          if (item.children) {
            this.menuListRecursion1(item.children, menuId)
          }
        }
      })
    },
    // 跳转页面
    async routeJump(path, routerPush) {
      let menuList = JSON.parse(sessionStorage.getItem('menuList'))
      if (!menuList) {
        await this.$api
          .selectMenus({
            type: 1
          })
          .then(res => {
            if (res.resultCode === 0) {
              sessionStorage.setItem('menuList', JSON.stringify(res.menuList))
              menuList = res.menuList
            }
          })
      }
      this.menuListRecursion(menuList, path)
      this.menuListRecursion1(menuList, this.routeParams.parentId)
      // 如果是三级菜单
      if (this.routeParams1.parentId != undefined && this.routeParams1.parentId != -1) {
        let thirdMenuList = JSON.parse(sessionStorage.getItem('thirdMenuList'))
        let thirdMenu_active_storage =
          JSON.parse(sessionStorage.getItem('thirdMenu_active_storage')) || []
        let thirdMenu_active_storage1 = []
        if (thirdMenu_active_storage.length) {
          var res = this.getArrRepeat(thirdMenuList, thirdMenu_active_storage)
          if (res.length) {
            thirdMenu_active_storage1 = this.del_active_storage(
              res[0].menuId,
              thirdMenu_active_storage
            )
          }
        }

        if (Object.keys(this.routeParams).find(item => item == 'menuId')) {
          thirdMenu_active_storage1.push(Number(this.routeParams.menuId))
        }
        thirdMenu_active_storage1 = [...new Set(thirdMenu_active_storage1)]
        sessionStorage.setItem(
          'thirdMenu_active_storage',
          JSON.stringify(thirdMenu_active_storage1)
        )
        if (this.routeParams1.menuId) {
          this.$store.commit('menu/set_showName', this.routeParams1.menuName)
          this.$store.commit('menu/set_active_index', this.routeParams1.menuId)
          this.$store.commit('menu/set_role', 'pass')
        }
        this.$router.push(routerPush)
      } else {
        this.routerChange(this.routeParams, routerPush)
      }
    },
    routerChange(routeParams, routerPush) {
      if (sessionStorage.getItem('cuType') == 4) {
        if (routeParams.menuId) {
          this.$store.commit('menu/set_showName', routeParams.menuName)
          this.$store.commit('menu/set_active_index', routeParams.menuId)
          this.$store.commit('menu/set_role', 'pass')
        }
        this.$router.push(routerPush)
      } else {
        // 客户端跳转
        let join_menu = {
          menuId: routeParams.menuId,
          params: routerPush.params
        }
        this.$webkitProc('join_menu', JSON.stringify(join_menu))
      }
    }
  }
}

export default routeJump
