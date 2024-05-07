<template>
  <!-- 添加或修改对话框 -->
  <el-dialog
    draggable
    :title="$parent.operation ? $t('menuPerm.createMenuPerm') : $t('menuPerm.modifyMenuPerm')"
    v-model="$parent.permDialogShow"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
    id="addPermLeft"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '198px' : '120px'"
      label-position="left"
      :rules="rules1"
    >
      <el-form-item :label="$t('menuPerm.menuId') + ':'" prop="menuId">
        <el-input
          v-model="form.menuId"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputMenuId')"
        />
      </el-form-item>
      <el-form-item :label="$t('menuPerm.menuName') + ':'" prop="menuName">
        <el-input
          v-model="form.menuName"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputMenuName')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('menuPerm.menuNameEn') + ':'">
        <el-input
          v-model="form.menuNameEn"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputMenuNameEn')"
          clearable
        />
      </el-form-item>

      <el-form-item
        :label="$t('menuPerm.menuType') + ':'"
        prop="type"
        :placeholder="$t('menuPerm.chooseMenuType')"
      >
        <el-select v-model="form.type">
          <el-option
            v-for="(item, index) in menuTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('menuPerm.menuPath') + ':'">
        <el-input
          v-model="form.path"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputMenuPath')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('menuPerm.menuIcon') + ':'" prop="icon" class="iconFormItem">
        <el-button type="primary" @click="showIconDialog">
          {{ $t('menuPerm.clickChooseMenuIcon') }}
        </el-button>
        <i :class="form.icon" class="aci"></i>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$parent.permDialogShow = false">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm('form')">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
    <el-dialog
      draggable
      :title="$t('menuPerm.chooseMenuIcon')"
      v-model="iconDialogShow"
      top="10vh"
      width="965px"
      :close-on-click-modal="false"
      :modal="false"
      class="iconDialog"
    >
      <i
        v-for="(item, index) in iconData"
        :key="index"
        :class="item"
        class="aci"
        @click="chooseIcon(item)"
        style="
          float: left;
          margin-right: 14px;
          margin-bottom: 10px;
          font-style: normal;
          cursor: pointer;
          width: 18px;
          font-size: 18px;
          padding: 5px;
        "
      ></i>
    </el-dialog>
  </el-dialog>
</template>

<script>
import icon from './icon.json'
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        menuId: '',
        menuName: '',
        menuNameEn: '',
        type: '',
        path: '',
        icon: ''
      },
      rules1: {},
      iconDialogShow: false,
      iconVisible: false,
      iconData: []
    }
  },
  computed: {
    ...mapState({
      menuTypeList: state => state.dict['sys-menu-type'] // 菜单类型
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async created() {
    this.iconData = icon.iconData
    this.getMenuTypeList()
  },
  async mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      this.rules1 = {
        menuId: [
          {
            required: true,
            message: this.$t('menuPerm.inputMenuId'),
            trigger: 'change'
          }
        ],
        menuName: [
          {
            required: true,
            message: this.$t('menuPerm.inputMenuName'),
            trigger: 'change'
          }
        ],
        type: [
          {
            required: true,
            message: this.$t('menuPerm.chooseMenuType'),
            trigger: 'change'
          }
        ],
        icon: [
          {
            required: false,
            message: this.$t('menuPerm.inputMenuIcon'),
            trigger: 'change'
          }
        ]
      }
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getMenuTypeList() {
      this.getSysDictData(['sys-menu-type'])
    },

    chooseIcon(item) {
      this.form.icon = item
      this.iconDialogShow = false
    },
    showIconDialog() {
      this.iconDialogShow = true
    },
    dialogOpen() {
      if (this.$parent.operation) {
        if (this.$refs.form) {
          this.$nextTick(() => {
            this.$refs.form.resetFields()
          })
          this.form = {
            menuId: '',
            menuName: '',
            menuNameEn: '',
            type: '',
            path: '',
            icon: ''
          }
        }
      }
      this.$nextTick(() => {
        
        if (!this.$parent.operation) {
          this.form = this.$parent.addDataForm
        }
      })
    },
    dialogClosed() {
      this.$parent.permDialogShow = false
    },

    // 添加或编辑设施确认按钮事件
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.$parent.choosedMenuId != '') {
            this.searchAddMenu(this.$parent.permList, this.$parent.choosedMenuId)
          } else {
            let obj = {
              icon: this.form.icon,
              menuId: this.form.menuId,
              menuName: this.form.menuName,
              menuNameEn: this.form.menuNameEn,
              parentId: -1,
              path: this.form.path,
              type: this.form.type,
              name: this.form.menuName,
              children: []
            }
            this.$parent.permList.unshift(obj)
          }
          this.$parent.permList = JSON.parse(JSON.stringify(this.$parent.permList))

          this.$parent.permDialogShow = false
        }
      })
    },

    searchAddMenu(permList, choosedMenuId) {
      for (let i = 0; i < permList.length; i++) {
        if (permList[i].menuId == choosedMenuId) {
          if (this.$parent.operation) {
            let obj = {
              icon: this.form.icon,
              menuId: this.form.menuId,
              menuName: this.form.menuName,
              menuNameEn: this.form.menuNameEn,
              parentId: choosedMenuId,
              path: this.form.path,
              type: this.form.type,
              name: this.form.menuName
            }
            if (permList[i].children) {
              permList[i].children.push(obj)
            } else {
              permList[i].children = []
              permList[i].children.push(obj)
            }
            this.$parent.codeArr.push(this.form.menuId)
          } else {
            permList[i].icon = this.form.icon
            permList[i].menuId = this.form.menuId
            permList[i].menuName = this.form.menuName
            permList[i].menuNameEn = this.form.menuNameEn
            permList[i].path = this.form.path
            permList[i].type = this.form.type
            permList[i].name = this.form.menuName
          }
          break
        } else {
          if (permList[i].children && !permList[i].perms) {
            this.searchAddMenu(permList[i].children, choosedMenuId)
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
#addPermLeft {
  .el-popper {
    width: 460px;
  }
  .iconDialog {
    .el-dialog__body {
      padding: 5px 12px 20px 20px;
    }
    i:hover {
      background: #4998d0;
    }
  }
}
</style>
