<template>
  <!-- 添加或修改对话框 -->
  <el-dialog
    draggable
    :title="$t('organizationManage.addOrganization')"
    v-model="$parent.dialogFormVisible"
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
      :label-width="$parent.locale == 'en' ? '198px' : '120px'"
      label-position="left"
      :rules="rules1"
    >
      <el-form-item :label="$t('organizationManage.parentOrganization') + '：'" prop="parentName">
        <el-input
          v-model="form.parentName"
          auto-complete="off"
          :placeholder="$t('public.pleaseInputorganizationName')"
          disabled
        />
      </el-form-item>
      <el-form-item :label="$t('organizationManage.organizationAreaCode') + '：'" prop="areaCode">
        <el-input
          v-model="form.areaCode"
          auto-complete="off"
          :placeholder="$t('organizationManage.PleaseEnterOrganizationCode')"
          clearable
        />
      </el-form-item>

      <el-form-item :label="$t('public.organizationName') + '：'" prop="organizationName">
        <el-input
          v-model="form.organizationName"
          auto-complete="off"
          :placeholder="$t('public.pleaseInputorganizationName')"
          clearable
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm('form')">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        organizationName: '', // 组织名称
        parentId: 0,
        parentName: '', // 上级组织名称
        areaCode: ''
      },
      rules1: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      // 验证组织名
      var reg = /^\d{6,12}$/
      var validateName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('organizationManage.areaCodeRegExp')))
        } else {
          if (!reg.test(value)) {
            callback(new Error(this.$t('organizationManage.areaCodeRegExp1')))
          }
          callback()
        }
      }
      this.rules1 = {
        // 组织名称
        organizationName: [
          {
            required: true,
            message: this.$t('organizationManage.organizationRegExp'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('organizationManage.lessThanEighteen'),
            trigger: 'blur'
          }
        ],
        areaCode: [{ required: true, validator: validateName, trigger: 'change' }]
      }
    },
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.addDataForm
        this.form.parentName = this.$parent.dataForm.organizationName
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
    },

    // 添加或编辑设施确认按钮事件
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let form = this.form
          // 添加组织
          let data = {
            organizationName: form.organizationName,
            parentId: form.parentId,
            areaCode: form.areaCode
          }

          this.$parent.maskloading = true
          this.$api.addOrganizationInfo(data).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.addSuccess')
              })
              this.$parent.dialogFormVisible = false

              this.$nextTick(() => {
                this.appendId = res.organizationId.toString()
                const node = this.$parent.$refs.treeList.getNode(form.parentId)
                const data = node.data.payload.parents
                const arr = data.split(',')
                this.idArr = arr.slice(0, -1)
                if (node.expanded) {
                  node.loaded = false
                } else {
                  node.expanded = true
                }
                node.loadData()
              })
            }
            this.$parent.maskloading = false
          })
        }
      })
    }
  }
}
</script>
