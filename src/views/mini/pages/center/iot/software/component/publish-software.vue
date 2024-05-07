<template>
  <div id="publish-version">
    <el-dialog
      :title="$t('iotSoftware.publishNewVersion')"
      v-model="$parent.dialogVisiable"
      width="980px"
      :close-on-click-modal="false"
      @open="dialogOpen"
      @closed="cancelPublish"
      draggable
      top="10vh"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        :label-width="$parent.locale == 'en' ? '202px' : '120px'"
        size="small"
        label-position="left"
      >
        <el-form-item :label="$t('iotSoftware.deviceType') + ':'" prop="deviceType">
          <el-select
            v-model="form.deviceType"
            :placeholder="$t('iotSoftware.deviceTypePrompt')"
            clearable
          >
            <el-option
              v-for="item in $parent.iotDeviceTypeListFormatter"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.manufacturer') + ':'" prop="manufacturer">
          <el-select
            v-model="form.manufacturer"
            :placeholder="$t('iotSoftware.manufacturerPrompt')"
            clearable
          >
            <el-option
              v-for="item in $parent.iotDeviceManufacture"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.model') + ':'" prop="model">
          <el-input
            v-model="form.model"
            auto-complete="off"
            :placeholder="$t('iotSoftware.modelPrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.compatible') + ':'" prop="compatible">
          <el-radio-group v-model="form.compatible">
            <el-radio label="1">{{ $t('iotSoftware.yes') }}</el-radio>
            <el-radio label="0">{{ $t('iotSoftware.no') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.versionId') + ':'" prop="versionId">
          <el-input
            v-model="form.versionId"
            auto-complete="off"
            :placeholder="$t('iotSoftware.versionIdPrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.versionName') + ':'" prop="versionName">
          <el-input
            v-model="form.versionName"
            :placeholder="$t('iotSoftware.versionNamePrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.versionUrl') + ':'" prop="versionUrl">
          <el-input
            v-model="form.versionUrl"
            auto-complete="off"
            :placeholder="$t('iotSoftware.versionUrlPrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotSoftware.versionMD5') + ':'" prop="versionMD5">
          <el-input
            v-model="form.versionMD5"
            auto-complete="off"
            :placeholder="$t('iotSoftware.versionMD5Prompt')"
            clearable
          />
        </el-form-item>
        <el-form-item
          class="remark"
          :label="$t('iotSoftware.versionDesc') + ':'"
          prop="versionDesc"
        >
          <el-input
            type="textarea"
            :rows="2"
            :placeholder="$t('iotSoftware.versionDescPrompt')"
            v-model="form.versionDesc"
            clearable
            maxlength="512"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="cancelPublish">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="publish" :loading="$parent.maskloading">
            {{ $t('iotSoftware.publish') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      rules: {
        deviceType: [
          {
            required: true,
            message: this.$t('iotSoftware.deviceTypePrompt'),
            trigger: 'change'
          }
        ],
        manufacturer: [
          {
            required: true,
            message: this.$t('iotSoftware.manufacturerPrompt'),
            trigger: 'change'
          }
        ],
        model: [
          {
            required: true,
            message: this.$t('iotSoftware.modelPrompt'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        compatible: [
          {
            required: true,
            message: this.$t('iotSoftware.compatiblePrompt'),
            trigger: 'change'
          }
        ],
        versionId: [
          {
            required: true,
            message: this.$t('iotSoftware.versionFormat'),
            pattern: /^[\\@A-Za-z0-9\\.\\_-]{1,32}$/,
            trigger: 'change'
          },
          {
            min: 1,
            max: 32,
            message: this.$t('iotSoftware.versionInterval'),
            trigger: 'change'
          }
        ],
        versionName: [
          {
            required: true,
            message: this.$t('iotSoftware.versionName'),
            trigger: 'change'
          },
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        versionUrl: [
          {
            required: true,
            message: this.$t('iotSoftware.versionUrlPrompt'),
            trigger: 'change'
          },
          {
            max: 512,
            message: this.$t('public.validate.charLimit', { num: 512 }),
            trigger: 'change'
          }
        ],
        versionMD5: [
          {
            required: true,
            message: this.$t('iotSoftware.versionMD5Prompt'),
            trigger: 'change'
          },
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    dialogOpen() {},

    publish() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          this.$api.publishDeviceSoftwareVersion(this.form).then(res => {
            this.$parent.maskloading = false
            if (res.resultCode == 0) {
              this.$parent.dialogVisiable = false
              this.$message({
                type: 'success',
                message: `${this.$t('iotSoftware.publishSuccess')}`
              })
              this.$refs.form.resetFields()
              this.$parent.getDeviceSoftwareVersionList()
            }
          })
        }
      })
    },

    cancelPublish() {
      this.$refs.form.resetFields()
      this.form.versionDesc = ''
      this.$parent.dialogVisiable = false
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
#publish-version {
  .el-dialog__body {
    padding: 20px;
  }
  .el-input__inner {
    width: 340px;
    height: 36px;
  }
  .el-radio-group {
    width: 340px;
  }
  .el-form-item__label {
    color: #333;
    padding: 0 5px 0 0;
  }
  .remark {
    width: 100%;
    display: flex;
    .el-form-item__content {
      flex: 1;
    }
  }
}
</style>
