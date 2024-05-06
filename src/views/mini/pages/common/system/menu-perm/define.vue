<template>
  <div id="menuPermDefine">
    <div class="divBox">
      <div class="leftDiv">
        <div class="rightOperateDiv" style="padding-top: 0px">
          <span style="margin-left: -23%; color: #fff">{{ $t('menuPerm.clickSave') }}</span>
          <el-button type="primary" draggable="true" @click="addMainMenu">
            {{ $t('menuPerm.add') }}
          </el-button>
          <el-button type="primary" draggable="true" @click="submitMenuList">
            {{ $t('public.save') }}
          </el-button>
          <el-button type="primary" @click="importMenuList">{{ $t('menuPerm.import') }}</el-button>
          <input type="file" @change="loadTextFromFile" id="txtInput" style="display: none" />
          <el-button type="primary" @click="exportMenuList" style="margin-left: 10px">
            {{ $t('menuPerm.exmport') }}
          </el-button>
        </div>
        <el-tree
          ref="menuTree"
          node-key="menuId"
          :data="permList"
          :props="defaultProps"
          :default-expanded-keys="codeArr"
          v-loading="menuLoading"
          :expand-on-click-node="false"
          draggable
          :allow-drop="allowDrop"
          v-if="showTree"
          style="overflow: auto; height: 570px"
        >
          <template #default="{ node, data }">
            <span
              class="custom-tree-node"
              style="width: 100%"
              @drop="nodeUp(...arguments, node, data)"
            >
              <el-icon v-if="data.nodeType != 'perm'" @click="addPerm(node, data)"><el-icon-plus /></el-icon>
              <el-icon v-if="data.nodeType != 'perm'" @click="editPerm(node, data)"><el-icon-edit /></el-icon>
              <el-icon v-if="!data.children" @click="delPerm(node, data)"><el-icon-minus /></el-icon> </span
          ></template>
        </el-tree>
      </div>
      <div class="rightDiv">
        <div class="rightOperateDiv">
          <el-button type="primary" @click="addPermRight">{{ $t('menuPerm.add') }}</el-button>
          <el-button type="primary" @click="editPermRight">{{ $t('menuPerm.modify') }}</el-button>
          <el-button type="danger" @click="delPermRight" :disabled="choosedItemRight.setGrey">
            {{ $t('menuPerm.delete') }}
          </el-button>
          <el-button type="primary" @click="importRightPerm">{{ $t('menuPerm.import') }}</el-button>
          <input type="file" @change="loadTextFromFile_r" id="txtInput_r" style="display: none" />
          <el-button type="primary" @click="exportRightPerm" style="margin-left: 10px">
            {{ $t('menuPerm.exmport') }}
          </el-button>
        </div>
        <ul style="overflow: auto; height: 570px; width: 98%">
          <li
            v-for="(item, index) in rightPermList"
            :key="index"
            class="permLi"
            :draggable="!item.setGrey"
            :class="{ liBg: index == isactive }"
            @click="clickLi(item, index)"
            @mousedown="liDown(item, index)"
            :style="item.setGrey ? 'color:grey' : ''"
          >
            {{ item.name }}
          </li>
        </ul>
      </div>
    </div>

    <add-permleft></add-permleft>
    <add-permright></add-permright>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import {
  Plus as ElIconPlus,
  Edit as ElIconEdit,
  Minus as ElIconMinus
} from '@element-plus/icons-vue'
import addPermleft from './component/addPermleft'
import addPermright from './component/addPermright'
export default {
  components: {
    'add-permleft': addPermleft,
    'add-permright': addPermright,
    ElIconPlus,
    ElIconEdit,
    ElIconMinus
  },
  name: 'MenuPermissions',
  data() {
    return {
      showTree: true,
      permList: [],
      rightPermList: [],
      codeArr: [],
      menuLoading: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      permDialogShow: false,
      permDialogShowRight: false,
      addDataForm: {
        menuId: '',
        menuName: '',
        menuNameEn: '',
        type: '',
        path: '',
        icon: ''
      },
      addDataFormRight: {
        code: '',
        name: '',
        nameEn: '',
        devType: ''
      },
      isactive: -1,
      operation: true,
      operationRight: true,
      choosedItemRight: {},
      choosedMenuId: '',
      copyRightPerm: [],
      judgeFlag: true,
      ifSetGrey: '',
      upleftNodeType: '',
      dragRightItem: {},
      rightDragIndex: '',
      gg: ''
    }
  },
  watch: {},
  async created() {
    await this.getSystemMenus()
    await this.getSelectMenus()
  },
  async mounted() {},
  methods: {
    importMenuList() {
      document.getElementById('txtInput').click()
    },
    loadTextFromFile(e) {
      const file = e.target.files[0]
      let name = file.name.split('.').splice(-1).toString()
      const isLtLimitSize = file.size / 1024 / 1024 < 100
      if (name !== 'txt') {
        this.$message.warning(this.$t('menuPerm.fileTypeError'))
        return
      }
      if (!isLtLimitSize) {
        this.$message.error(this.$t('public.validate.fileSizeLimit', { size: 100 }))
        return
      }
      const reader = new FileReader()
      if (typeof FileReader === 'undefined') {
        this.$message.warning(this.$t('menuPerm.browerNonsupport'))
      }
      reader.onload = e => this.$emit('load', this.dealNum(e.target.result))
      reader.readAsText(file, 'utf-8')
    },
    dealNum(item) {
      for (let i = 0; i < this.rightPermList.length; i++) {
        if (this.rightPermList[i].setGrey) {
          this.rightPermList[i].setGrey = false
        }
      }

      let perm = JSON.parse(item)
      this.setPerms(perm)
      this.permList = perm
      this.showTree = false
      this.$nextTick(() => {
        this.showTree = true
      })
    },
    exportMenuList() {
      let perm = JSON.parse(JSON.stringify(this.permList))
      this.setSubmitPerm(perm)
      var str = JSON.stringify(perm)
      var allStr = str
      var export_blob = new Blob([allStr])
      var save_link = document.createElement('a')
      save_link.href = window.URL.createObjectURL(export_blob)
      save_link.download = this.$t('menuPerm.menueInfo') + '.txt'
      this.fakeClick(save_link)
    },
    fakeClick(obj) {
      var ev = document.createEvent('MouseEvents')
      ev.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      obj.dispatchEvent(ev)
    },

    //右侧导入导出
    importRightPerm() {
      document.getElementById('txtInput_r').click()
    },
    loadTextFromFile_r(e) {
      const file_r = e.target.files[0]
      let name_r = file_r.name.split('.').splice(-1).toString()
      const isLtLimitSize = file_r.size / 1024 / 1024 < 100
      if (name_r !== 'txt') {
        this.$message.warning(this.$t('menuPerm.fileTypeError'))
        return
      }
      if (!isLtLimitSize) {
        this.$message.error(this.$t('public.validate.fileSizeLimit', { size: 100 }))
        return
      }
      const reader_r = new FileReader()
      if (typeof FileReader === 'undefined') {
        this.$message.warning(this.$t('menuPerm.browerNonsupport'))
      }
      reader_r.onload = e => this.$emit('load', this.dealNum_r(e.target.result))
      reader_r.readAsText(file_r, 'utf-8')
    },
    async dealNum_r(item) {
      for (let i = 0; i < this.rightPermList.length; i++) {
        if (this.rightPermList[i].setGrey) {
          this.rightPermList[i].setGrey = false
        }
      }

      let perm_r = JSON.parse(item)
      let res = await this.$api.resetSystemPermission({ permList: perm_r })
      if (res.resultCode == 0) {
        this.rightPermList = perm_r
        this.setPerms_r(this.permList)
      }
    },

    exportRightPerm() {
      var str_r = JSON.stringify(this.rightPermList)
      var allStr_r = str_r
      var export_blob_r = new Blob([allStr_r])
      var save_link_r = document.createElement('a')
      save_link_r.href = window.URL.createObjectURL(export_blob_r)
      save_link_r.download = this.$t('menuPerm.permInfo') + '.txt'
      this.fakeClick_r(save_link_r)
    },
    fakeClick_r(obj) {
      var ev_r = document.createEvent('MouseEvents')
      ev_r.initMouseEvent(
        'click',
        true,
        false,
        window,
        0,
        0,
        0,
        0,
        0,
        false,
        false,
        false,
        false,
        0,
        null
      )
      obj.dispatchEvent(ev_r)
    },

    clickLi(item, index) {
      this.choosedItemRight = JSON.parse(JSON.stringify(item))
      this.isactive = index
    },
    liDown(item, index) {
      this.ifSetGrey = item.setGrey
      this.rightDragIndex = index
      this.dragRightItem = item
    },
    addPermRight() {
      this.operationRight = true
      this.permDialogShowRight = true
    },
    editPermRight() {
      if (!this.choosedItemRight.code) {
        this.$message({
          type: 'warning',
          message: this.$t('menuPerm.chooseDeletePerm')
        })
        return
      }
      this.addDataFormRight = JSON.parse(JSON.stringify(this.choosedItemRight))
      this.addDataFormRight.devType = String(this.addDataFormRight.devType)
      this.operationRight = false
      this.permDialogShowRight = true
    },
    delPermRight() {
      if (!this.choosedItemRight.code) {
        this.$message({
          type: 'warning',
          message: this.$t('menuPerm.chooseDeletePerm')
        })
        return
      }
      this.$confirm(this.$t('menuPerm.deletePermWarning'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteSystemPermission({ code: this.choosedItemRight.code }).then(res => {
            if (res.resultCode == 0) {
              this.getSystemMenus()
              this.$message({
                type: 'success',
                message: this.$t('menuPerm.deleteSuccess')
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('menuPerm.cancelDelete')
          })
        })
    },
    addMainMenu() {
      this.choosedMenuId = ''
      this.operation = true
      this.permDialogShow = true
    },
    addPerm(node, data) {
      this.choosedMenuId = data.menuId
      this.operation = true
      this.permDialogShow = true
    },
    editPerm(node, data) {
      this.addDataForm.menuId = data.menuId
      this.addDataForm.menuName = data.menuName
      this.addDataForm.menuNameEn = data.menuNameEn
      this.addDataForm.type = data.type
      this.addDataForm.path = data.path
      this.addDataForm.icon = data.icon

      this.choosedMenuId = data.menuId

      this.operation = false
      this.permDialogShow = true
    },
    delPerm(node, data) {
      if (data.parentId == -1) {
        for (let i = 0; i < this.permList.length; i++) {
          if (this.permList[i].menuId == data.menuId) {
            this.permList.splice(i, 1)
          }
        }
      } else {
        this.searchAddMenu(this.permList, node.parent.data.menuId, data.menuId || data.code)
      }

      this.permList = JSON.parse(JSON.stringify(this.permList))

      //解除置灰
      for (let i = 0; i < this.rightPermList.length; i++) {
        if (this.rightPermList[i].code == data.code) {
          this.rightPermList[i].setGrey = false
        }
      }
    },
    searchAddMenu(permList, parentId, choosedMenuId) {
      for (let i = 0; i < permList.length; i++) {
        if (permList[i].menuId == parentId) {
          if (permList[i].children) {
            for (let a = 0; a < permList[i].children.length; a++) {
              if (
                permList[i].children[a].menuId == choosedMenuId ||
                permList[i].children[a].code == choosedMenuId
              ) {
                permList[i].children.splice(a, 1)

                //置灰解除
                for (let b = 0; b < this.rightPermList.length; b++) {
                  if (this.rightPermList[b].code == choosedMenuId) {
                    this.rightPermList[b].setGrey = false
                  }
                }

                if (!permList[i].children.length) {
                  delete permList[i].children
                  break
                }
              }
            }
          }
          if (permList[i].perms) {
            for (let j = 0; j < permList[i].perms.length; j++) {
              if (
                permList[i].perms[j].menuId == choosedMenuId ||
                permList[i].perms[j].code == choosedMenuId
              ) {
                permList[i].perms.splice(j, 1)
                if (!permList[i].perms.length) {
                  delete permList[i].perms
                  break
                }
              }
            }
          }
          break
        } else {
          if (permList[i].children) {
            this.searchAddMenu(permList[i].children, parentId, choosedMenuId)
          }
        }
      }
    },
    dragOverNode(e, node, data) {
      if (data.nodeType == 'perm') {
        e.dataTransfer.effectAllowed = 'none'
        e.dataTransfer.dropEffect = 'none'
      } else {
        e.dataTransfer.effectAllowed = 'all'
        e.dataTransfer.dropEffect = 'copy'
      }
    },
    nodeUp(e, node, data) {
      this.upleftNodeType = data.nodeType
      if (!this.ifSetGrey && this.upleftNodeType != 'perm' && data.perms) {
        this.addRightPermToleft(this.permList, data.menuId, this.dragRightItem)

        this.permList = JSON.parse(JSON.stringify(this.permList))

        //置灰
        for (let i = 0; i < this.rightPermList.length; i++) {
          if (this.rightPermList[i].code == this.dragRightItem.code) {
            this.rightPermList[i].setGrey = true
          }
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('menuPerm.menueAndPermWarning1')
        })
      }
    },

    addRightPermToleft(permList, menuId, dragRightItem) {
      for (let i = 0; i < permList.length; i++) {
        if (permList[i].menuId == menuId) {
          let obj = {
            code: dragRightItem.code,
            name: dragRightItem.name,
            devType: dragRightItem.devType,
            nodeType: 'perm',
            parentId: menuId
          }
          if (permList[i].children) {
            permList[i].children.push(obj)
          } else {
            permList[i].children = []
            permList[i].children.push(obj)
          }
          permList[i].perms = permList[i].children
          if (this.codeArr.indexOf(menuId) == -1) {
            this.codeArr.push(menuId)
          }
          break
        } else {
          if (permList[i].children && !permList[i].perms) {
            this.addRightPermToleft(permList[i].children, menuId, dragRightItem)
          }
        }
      }
    },

    allowDrop(draggingNode, dropNode, type) {
      if (dropNode.isLeaf) {
        return false
      } else {
        return true
      }
    },
    findTreeData() {
      this.menuLoading = true
      let data = {
        type: 1
      }
      this.$api.selectMenuPerms(data).then(res => {
        if (res.permList && res.permList.length) {
          let arr = []
          this.permList = res.permList
          res.permList.forEach(item => {
            arr.push(item.code)
          })
          this.codeArr = arr
        }
        this.menuLoading = false
      })
    },
    async getSelectMenus() {
      this.menuLoading = true

      let res1 = await this.$api.selectSystemMenus({})
      if (res1.resultCode == 0) {
        this.permList = res1.menuList
        this.setPerms(this.permList)

        let arr = []
        res1.menuList.forEach(item => {
          arr.push(item.menuId)
        })
        this.codeArr = arr
        this.menuLoading = false
      }
    },
    setPerms(menuList) {
      for (let a = 0; a < menuList.length; a++) {
        menuList[a].name = menuList[a].menuName
        if (menuList[a].perms && menuList[a].children) {
          delete menuList[a].perms
        }
        if (menuList[a].perms && !menuList[a].children) {
          menuList[a].children = menuList[a].perms ///////////////////////////////////////////
          for (let i = 0; i < menuList[a].perms.length; i++) {
            for (let j = 0; j < this.rightPermList.length; j++) {
              if (menuList[a].perms[i] == this.rightPermList[j].code) {
                menuList[a].perms[i] = {
                  menuId: this.rightPermList[j].code,
                  name: this.rightPermList[j].name,
                  nodeType: 'perm'
                }
                menuList[a].children[i] = {
                  menuId: this.rightPermList[j].code,
                  name: this.rightPermList[j].name,
                  nodeType: 'perm'
                }

                //置灰
                this.rightPermList[j].setGrey = true
              }
            }
          }
        }
        if (menuList[a].children && !menuList[a].perms) {
          this.setPerms(menuList[a].children)
        }
      }
    },
    setPerms_r(menuList) {
      for (let a = 0; a < menuList.length; a++) {
        if (menuList[a].perms && !menuList[a].children) {
          for (let i = 0; i < menuList[a].perms.length; i++) {
            for (let j = 0; j < this.rightPermList.length; j++) {
              if (menuList[a].perms[i] == this.rightPermList[j].code) {
                //置灰
                this.rightPermList[j].setGrey = true
              }
            }
          }
        }
        if (menuList[a].children && !menuList[a].perms) {
          this.setPerms_r(menuList[a].children)
        }
      }
    },
    setPerms2(menuList) {
      for (let a = 0; a < menuList.length; a++) {
        if (menuList[a].perms) {
          for (let i = 0; i < menuList[a].perms.length; i++) {
            for (let j = 0; j < this.rightPermList.length; j++) {
              if (
                menuList[a].perms[i].code == this.rightPermList[j].code ||
                menuList[a].perms[i].menuId == this.rightPermList[j].code
              ) {
                //置灰
                this.rightPermList[j].setGrey = true
              }
            }
          }
        }
        if (menuList[a].children) {
          this.setPerms2(menuList[a].children)
        }
      }
    },
    async getSystemMenus() {
      let copyRightPerm = []
      if (this.rightPermList.length) {
        copyRightPerm = JSON.parse(JSON.stringify(this.rightPermList))
      }
      let res = await this.$api.selectSystemPermissions({})
      if (res.resultCode == 0) {
        this.rightPermList = res.permList
        this.setPerms2(this.permList)
      }
    },
    async submitMenuList() {
      this.judgeFlag = true
      this.judgeMenuList(this.permList)

      if (this.judgeFlag) {
        let perm = JSON.parse(JSON.stringify(this.permList))
        this.setSubmitPerm(perm)
        let res = await this.$api.updateSystemMenus({ menuList: perm })
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('menuPerm.setSuccess')
          })
        }
      }
    },

    judgeMenuList(permList) {
      for (let a = 0; a < permList.length; a++) {
        if (permList[a].perms && permList[a].children) {
          for (let b = 0; b < permList[a].perms.length; b++) {
            if (!permList[a].perms[b].nodeType) {
              this.$message({
                type: 'warning',
                message: this.$t('menuPerm.menueAndPermWarning2')
              })
              this.judgeFlag = false
              return
            }
          }
        }
        if (permList[a].children && permList[a].perms) {
          this.judgeMenuList(permList[a].children)
        }
      }
    },

    setSubmitPerm(permList) {
      for (let a = 0; a < permList.length; a++) {
        if (permList[a].children && permList[a].perms) {
          delete permList[a].children
          for (let b = 0; b < permList[a].perms.length; b++) {
            permList[a].perms[b] =
              permList[a].perms[b].menuId || permList[a].perms[b].code || permList[a].perms[b]
          }
        }
        if (permList[a].children && !permList[a].perms) {
          this.setSubmitPerm(permList[a].children)
        }
      }
    }
  },
  computed: {
    iconSty(data) {
      return data => {
        if (data.nodeType == 'perm') {
          return 'aci-key1'
        } else {
          return 'aci-x006-folder'
        }
      }
    }
  }
}
</script>

<style lang="scss">
#menuPermDefine {
  width: 100%;
  height: 100%;
  padding: 100px 20%;
  box-sizing: border-box;
  .divBox {
    display: flex;
    justify-content: space-between;
    .leftDiv {
      padding: 15px;
      padding-right: 10px;
      width: 48%;
      background: #052a3f;
    }
    .rightDiv {
      width: 48%;
      background: #052a3f;
    }
  }
  .mystyle {
    cursor: copy;
  }
  .btnDiv {
    text-align: center;
    margin-top: 20px;
  }
  .rightOperateDiv {
    text-align: center;
    padding: 15px;
  }
  .permLi {
    padding: 10px 0px 10px 20px;
    color: #fff;
    font-size: 14px;
  }
  .permLi:hover {
    cursor: pointer;
    background: #4998d0;
  }
  .liBg {
    background: #4998d0;
  }
  .el-tree-node__content:hover {
    background-color: #4998d0;
  }
  .el-tree-node__content {
    font-size: 14px;
    padding-bottom: 5px;
    padding-top: 5px;
  }
}
</style>
