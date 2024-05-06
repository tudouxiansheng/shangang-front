<template>
  <!-- 添加或修改对话框 -->
  <el-dialog
    draggable
    :title="
      $parent.operation
        ? $t('algorithmPlat.algorithmPlatformAdd')
        : $t('algorithmPlat.algorithmPlatformModify')
    "
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
      :rules="rules2"
      :label-width="$parent.locale == 'en' ? '132px' : '100px'"
      label-position="left"
    >
      <el-form-item :label="$t('public.platName') + '：'" prop="platformName">
        <el-input
          v-model="form.platformName"
          auto-complete="off"
          :placeholder="$t('monitorManage.inputPlatformName')"
        />
      </el-form-item>

      <el-form-item :label="$t('monitorManage.platformType') + '：'" prop="platformType">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="form.platformType"
          :placeholder="$t('monitorManage.pleaseSelectAPlatformType')"
          :disabled="!$parent.operation"
        >
          <el-option
            v-for="(item, index) in $parent.platformTypeList"
            :label="item.name"
            :value="item.value"
            :key="index"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('monitorManage.version') + '：'" prop="version">
        <el-input
          v-model="form.version"
          auto-complete="off"
          :placeholder="$t('algorithmPlat.versionPrompt')"
        />
      </el-form-item>

      <el-form-item :label="$t('algorithmPlat.vendor') + '：'" prop="vendor">
        <el-input
          v-model="form.vendor"
          auto-complete="off"
          :placeholder="$t('algorithmPlat.vendorPormpt')"
        />
      </el-form-item>

      <el-form-item :label="$t('algorithmPlat.accessIP') + '：'" prop="accessIP">
        <el-input
          v-model="form.accessIP"
          auto-complete="off"
          :placeholder="$t('algorithmPlat.accessIPPormpt')"
        />
      </el-form-item>

      <el-form-item :label="$t('algorithmPlat.accessPort') + '：'" prop="accessPort">
        <el-input
          v-model="form.accessPort"
          auto-complete="off"
          :placeholder="$t('algorithmPlat.accessPortPormpt')"
        />
      </el-form-item>

      <el-form-item :label="$t('public.account') + '：'" prop="accessAccount">
        <el-input
          v-model="form.accessAccount"
          auto-complete="off"
          :placeholder="$t('public.accountPrompt')"
        />
      </el-form-item>

      <el-form-item :label="$t('public.password') + '：'" prop="accessPassword">
        <pwd-input v-model="form.accessPassword" :placeholder="$t('public.psdPrompt')" strength />
      </el-form-item>

      <el-form-item :label="$t('public.remark') + '：'" prop="platformDesc">
        <el-input
          v-model="form.platformDesc"
          auto-complete="off"
          type="textarea"
          maxlength="256"
          show-word-limit
          :placeholder="$t('public.pleaseInputremark')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
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
        platformName: '',
        platformType: '',
        version: '',
        vendor: '',
        accessIP: '',
        accessPort: '',
        accessAccount: '',
        accessPassword: '',
        platformDesc: ''
      },
      rules2: {}
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setFormRules()
    }
  },
  async mounted() {
    this.setFormRules()
  },
  methods: {
    setFormRules() {
      this.rules2 = {
        // 平台名称
        platformName: [
          {
            required: true,
            message: this.$t('monitorManage.inputPlatformName'),
            trigger: 'blur'
          }
        ],
        platformType: [
          {
            required: true,
            message: this.$t('monitorManage.pleaseSelectAPlatformType'),
            trigger: 'change'
          }
        ],
        version: [
          {
            required: true,
            message: this.$t('algorithmPlat.versionPrompt'),
            trigger: 'blur'
          }
        ],
        vendor: [
          {
            required: true,
            message: this.$t('algorithmPlat.vendorPormpt'),
            trigger: 'blur'
          }
        ],
        accessIP: [
          {
            required: true,
            message: this.$t('algorithmPlat.accessIPPormpt'),
            trigger: 'blur'
          },
          {
            pattern:
              /^((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}$/,
            message: this.$t('algorithmPlat.IPPormpt') + '0.0.0.0 ~ 255.255.255.255'
          }
        ],
        accessPort: [
          {
            required: true,
            message: this.$t('algorithmPlat.accessPortPormpt'),
            trigger: 'blur'
          }
        ],
        accessAccount: [
          {
            required: true,
            message: this.$t('public.accountPrompt'),
            trigger: 'blur'
          }
        ],
        accessPassword: [
          {
            required: true,
            message: this.$t('public.psdPrompt'),
            trigger: 'blur'
          }
        ]
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
        this.form = this.$parent.dataForm
        if (this.$parent.operation) {
          this.rules2.accessPassword[0].required = true
        } else {
          this.rules2.accessPassword[0].required = false
        }
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },

    // 添加或编辑设施确认按钮事件
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let form = this.form
          let data = {
            platformName: form.platformName,
            platformType: Number(form.platformType),
            version: form.version,
            vendor: form.vendor,
            accessIP: form.accessIP,
            accessPort: form.accessPort,
            accessAccount: form.accessAccount,
            platformDesc: form.platformDesc
          }
          if (form.accessPassword) {
            data.accessPassword = form.accessPassword
          }
          this.$parent.maskloading = true
          if (this.$parent.operation) {
            // 添加算法平台
            this.$api.addAlgorithmPlatformInfo(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else {
            data.platformId = form.platformId
            // 编辑算法平台
            this.$api.modifyAlgorithmPlatformInfo(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible = false
        this.$message({
          type: 'success',
          message: title
        })

        this.$parent.handleFind()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>
