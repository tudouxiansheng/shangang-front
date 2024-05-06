<template>
  <!-- 添加或修改对话框 -->
  <el-dialog
    draggable
    :title="$parent.operationRight ? $t('menuPerm.createSysPerm') : $t('menuPerm.modifySysPerm')"
    v-model="$parent.permDialogShowRight"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    @closed="dialogClosed"
    @open="dialogOpen"
    :modal="false"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '198px' : '144px'"
      label-position="left"
      :rules="rules1"
    >
      <el-form-item :label="$t('menuPerm.permCode') + ':'" prop="code">
        <el-input
          v-model="form.code"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputPermCode')"
        />
      </el-form-item>
      <el-form-item :label="$t('menuPerm.permName') + ':'" prop="name">
        <el-input
          v-model="form.name"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputPermName')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('menuPerm.permNameEn') + ':'">
        <el-input
          v-model="form.nameEn"
          auto-complete="off"
          :placeholder="$t('menuPerm.inputPermNameEn')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('menuPerm.permDevType') + ':'">
        <el-select v-model="form.devType" :placeholder="$t('menuPerm.choosePermDevType')">
          <el-option
            v-for="(item, index) in devTypeList"
            :key="index"
            :label="item.name"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="$parent.permDialogShowRight = false">
          {{ $t('public.cancel') }}
        </el-button>
        <el-button type="primary" @click="submitForm('form')">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      form: {
        code: '',
        name: '',
        nameEn: '',
        devType: ''
      },
      rules1: {}
    }
  },
  computed: {
    ...mapState({
      devTypeList: state => state.dict['device-category'] // 权限所属设备类型
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async mounted() {
    this.setFormRules()
    this.getDevTypeList()
  },
  methods: {
    setFormRules() {
      this.rules1 = {
        // 组织名称
        code: [
          {
            required: true,
            message: this.$t('menuPerm.inputPermCode'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('menuPerm.inputPermName'),
            trigger: 'change'
          }
        ]
      }
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDevTypeList() {
      this.getSysDictData(['device-category'])
    },
    dialogOpen() {
      if (this.$parent.operationRight) {
        if (this.$refs.form) {
          this.$nextTick(() => {
            this.$refs.form.resetFields()
            this.form = {
              code: '',
              name: '',
              nameEn: '',
              devType: ''
            }
          })
        }
      }
      this.$nextTick(() => {
        this.setDialogCss()
        if (!this.$parent.operationRight) {
          this.form = this.$parent.addDataFormRight
        }
      })
    },
    dialogClosed() {
      this.$parent.permDialogShowRight = false
    },

    // 添加或编辑设施确认按钮事件
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 添加组织
          let data = {
            code: Number(this.form.code),
            name: this.form.name,
            nameEn: this.form.nameEn,
            devType: this.form.devType == '' ? null : Number(this.form.devType)
          }

          if (this.$parent.operationRight) {
            this.$api.addSystemPermission(data).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.addSuccess')
                })
                this.$parent.getSystemMenus()
                this.$parent.permDialogShowRight = false
              }
            })
          } else {
            this.$api.modifySystemPermission(data).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.modifySuccess')
                })
                this.$parent.getSystemMenus()
                this.$parent.permDialogShowRight = false
              }
            })
          }
        }
      })
    }
  }
}
</script>
