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
    class="addOrganization"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '195px' : '95px'"
      size="small"
      label-position="left"
      :validate-on-rule-change="false"
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

      <el-radio-group
        v-model="cascaderShow"
        @change="radioChange"
        :style="{ marginLeft: $parent.locale == 'en' ? '195px' : '95px' }"
        v-if="locale == 'zh'"
      >
        <el-radio-button :label="1">{{ $t('newOrg.manualInput') }}</el-radio-button>
        <el-radio-button :label="0">
          {{ $t('newOrg.cascadeSelection') }}
        </el-radio-button>
      </el-radio-group>
      <div v-loading="radioLoading">
        <el-form-item
          v-show="cascaderShow"
          :label="$t('organizationManage.organizationAreaCode') + '：'"
          prop="areaCode1"
          v-if="locale == 'zh'"
        >
          <el-input
            v-model="form.areaCode1"
            auto-complete="off"
            :placeholder="$t('organizationManage.PleaseEnterOrganizationCode')"
            clearable
          />
        </el-form-item>
        <el-form-item
          v-if="locale == 'zh'"
          v-show="!cascaderShow"
          :label="$t('organizationManage.organizationAreaCode') + '：'"
          prop="areaCode"
        >
          <el-cascader
            v-model="form.areaCode"
            :options="$parent.areaCodeOptions"
            :props="$parent.areaCodeProps"
            :show-all-levels="false"
            clearable
            :placeholder="$t('organizationManage.PleaseChooseOrganizationCode')"
          >
            <template #default="{ node }">
              <span>{{ node.data.areaName }}</span>
            </template>
          </el-cascader>
        </el-form-item>

        <el-form-item :label="$t('public.organizationName') + '：'" prop="organizationName">
          <el-input
            v-model="form.organizationName"
            auto-complete="off"
            :placeholder="$t('public.pleaseInputorganizationName')"
            clearable
          />
        </el-form-item>
      </div>
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
      locale: localStorage.getItem('locale'),
      radioLoading: false,
      form: {
        organizationName: '', // 组织名称
        parentId: 0,
        parentName: '', // 上级组织名称
        areaCode: [],
        areaCode1: ''
      },
      rules1: {},
      cascaderShow: 1
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
      var reg = /^\d{6,12}$/
      var validateName = (rule, value, callback) => {
        if (this.cascaderShow) {
          if (value === '') {
            callback(new Error(this.$t('organizationManage.areaCodeRegExp')))
          } else {
            if (!reg.test(value)) {
              callback(new Error(this.$t('organizationManage.areaCodeRegExp1')))
            }
            callback()
          }
        } else {
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
        areaCode: [
          {
            required: true,
            message: this.$t('organizationManage.PleaseChooseOrganizationCode'),
            trigger: 'change'
          }
        ],
        areaCode1: [{ required: true, validator: validateName, trigger: 'change' }]
      }
    },
    radioChange(val) {
      if (val) {
        this.rules1.areaCode[0].required = false
        this.rules1.areaCode1[0].required = true
      } else {
        this.rules1.areaCode[0].required = true
        this.rules1.areaCode1[0].required = false
      }
      setTimeout(() => {
        if (this.$refs.form) {
          this.$refs.form.clearValidate()
          this.radioLoading = false
        }
      }, 200)
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
      })
      setTimeout(()=>{
        this.$refs.form.clearValidate()
      },100)
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
            areaCode: !this.cascaderShow
              ? Array.isArray(form.areaCode)
                ? form.areaCode[form.areaCode.length - 1]
                : form.areaCode
              : form.areaCode1
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
                const node = this.$parent.$refs.lazyTree.$refs.treeList.getNode(form.parentId)
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

<style lang="scss">
.addOrganization {
  .el-radio-group {
    margin-bottom: 10px;
    .el-radio-button__inner {
      border: 1px solid #dcdfe6;
      box-shadow: none;
    }
    .el-radio-button.is-active {
      .el-radio-button__inner {
        border: none;
      }
    }
  }
}
</style>
