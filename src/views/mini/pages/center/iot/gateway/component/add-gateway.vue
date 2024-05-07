<template>
  <div>
    <el-dialog
      :title="this.$parent.operation ? $t('iotGateway.addGateway') : $t('iotGateway.editGateway')"
      v-model="$parent.dialogVisiable"
      width="910px"
      :close-on-click-modal="false"
      @open="dialogOpen"
      draggable
      top="10vh"
      class="addGateway"
    >
      <el-form
        ref="form"
        :inline="true"
        :model="form"
        :rules="rules"
        :label-width="$parent.locale == 'en' ? '164px' : '100px'"
        size="small"
        label-position="left"
      >
        <el-form-item :label="$t('iotGateway.organizationName') + ':'" prop="organizationName">
          <el-input v-model="$parent.organizationName" auto-complete="off" disabled clearable />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.platName') + ':'" prop="platId">
          <el-select v-model="form.platId" :placeholder="$t('iotGateway.platNamePrompt')" clearable>
            <el-option
              v-for="item in $parent.platList"
              :key="item.platId"
              :label="item.platName"
              :value="item.platId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('iotGateway.deviceSn') + ':'" prop="deviceSn">
          <el-input
            v-model="form.deviceSn"
            auto-complete="off"
            clearable
            :placeholder="$t('iotGateway.deviceSnPrompt')"
          />
        </el-form-item>

        <el-form-item :label="$t('iotGateway.deviceName') + ':'" prop="deviceName">
          <el-input
            v-model="form.deviceName"
            auto-complete="off"
            :placeholder="$t('iotGateway.deviceNamePrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.lngLat') + ':'">
          <el-input
            ref="inputBlur"
            @focus="longlatFocus"
            v-model="lngLat"
            :placeholder="$t('iotGateway.lngLatPrompt')"
            clearable
            @clear="lngLatClear"
          />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.installLocate') + ':'" prop="installLocate">
          <el-input
            v-model="form.installLocate"
            :placeholder="$t('iotGateway.installLocatePrompt')"
            auto-complete="off"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.manufacturer') + ':'" prop="manufacturer">
          <el-select
            v-model="form.manufacturer"
            :placeholder="$t('iotGateway.manufacturerPrompt')"
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
        <el-form-item :label="$t('iotGateway.model') + ':'" prop="model">
          <el-input
            v-model="form.model"
            :placeholder="$t('iotGateway.modelPrompt')"
            auto-complete="off"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.fwVersion') + ':'" prop="fwVersion">
          <el-input
            v-model="form.fwVersion"
            auto-complete="off"
            :placeholder="$t('iotGateway.fwVersionPrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.hwVersion') + ':'" prop="hwVersion">
          <el-input
            v-model="form.hwVersion"
            auto-complete="off"
            :placeholder="$t('iotGateway.hwVersionPrompt')"
            clearable
          />
        </el-form-item>
        <el-form-item :label="$t('iotGateway.swVersion') + ':'" prop="swVersion">
          <el-input
            v-model="form.swVersion"
            auto-complete="off"
            :placeholder="$t('iotGateway.swVersionPrompt')"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <long-lat-map />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import longlatmap from '@/components/long-lat-map'
export default {
  components: { 'long-lat-map': longlatmap },
  data() {
    return {
      form: {},
      rules: {},
      organizationId: sessionStorage.getItem('organizationId'),
      longlatMapVisible: false
    }
  },
  computed: {
    lngLat: {
      get() {
        let lngLat = ''
        if (this.form.longitude && this.form.latitude) {
          lngLat = this.form.longitude + ',' + this.form.latitude
        } else {
          lngLat = ''
        }
        return lngLat
      },
      set(v) {}
    }
  },
  mounted() {
    this.setRules()
  },
  methods: {
    setRules() {
      this.rules = {
        deviceSn: [
          {
            required: true,
            message: this.$t('iotGateway.deviceSnPrompt'),
            trigger: 'blur'
          },
          {
            max: 64,
            message: this.$t('public.validate.charLimit', { num: 64 }),
            trigger: 'change'
          }
        ],
        deviceName: [
          {
            required: true,
            message: this.$t('iotGateway.deviceNamePrompt'),
            trigger: 'blur'
          },
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        installLocate: [
          {
            max: 512,
            message: this.$t('public.validate.charLimit', { num: 512 }),
            trigger: 'change'
          }
        ],
        model: [
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        platId: [
          {
            required: true,
            message: this.$t('iotGateway.platNamePrompt'),
            trigger: 'change'
          }
        ],
        manufacturer: [
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'change'
          }
        ],
        fwVersion: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'change'
          },
          {
            message: this.$t('iotGateway.versionFormat'),
            pattern: /^[\\@A-Za-z0-9\\.\\_-]{1,32}$/,
            trigger: 'blur'
          }
        ],
        hwVersion: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'change'
          },
          {
            message: this.$t('iotGateway.versionFormat'),
            pattern: /^[\\@A-Za-z0-9\\.\\_-]{1,32}$/,
            trigger: 'blur'
          }
        ],
        swVersion: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'change'
          },
          {
            message: this.$t('iotGateway.versionFormat'),
            pattern: /^[\\@A-Za-z0-9\\.\\_-]{1,32}$/,
            trigger: 'blur'
          }
        ]
      }
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.form = this.$parent.dataForm
        if (this.form.longitude !== undefined && this.form.longitude !== '') {
          this.lngLat = this.form.longitude + ',' + this.form.latitude
        } else {
          this.lngLat = ''
        }
        this.$refs.form.resetFields()
      })
    },
    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlur.blur()
    }, // 获取经纬度
    lngLatFocus() {
      this.longlatMapVisible = true
    },
    lngLatClear() {
      this.lngLat = ''
      this.form.longitude = ''
      this.form.latitude = ''
    },
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          this.form.organizationId = parseInt(this.organizationId)
          this.form.deviceType = 16
          this.form.subType = 60
          this.form.nodeType = 1
          if (this.$parent.operation) {
            // 添加
            this.$api.addIotDeviceInfo(this.form).then(res => {
              if (res.resultCode == 0) {
                this.$parent.dialogVisiable = false
                this.$message({
                  type: 'success',
                  message: this.$t('public.addSuccess')
                })
                this.$parent.getDeviceList()
              }
            })
          } else {
            this.form.deviceId = this.$parent.deviceId
            this.$api.modifyIotDeviceInfo(this.form).then(res => {
              if (res.resultCode == 0) {
                this.$parent.dialogVisiable = false

                this.$message({
                  type: 'success',
                  message: this.$t('public.modifySuccess')
                })
                this.$parent.getDeviceList()
              }
            })
          }
          this.$parent.maskloading = false
        }
      })
    },
    dialogClosed() {
      this.lngLat = ''
      this.$refs.form.resetFields()
      this.$parent.dialogVisiable = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
.addGateway {
  .el-dialog__body {
    padding: 20px;
  }
  .el-input__inner {
    width: 302px;
    height: 36px;
  }

  .el-form-item__label {
    color: #333;
    padding: 0 5px 0 0;
  }
}
</style>
