<template>
  <div>
    <!-- 修改镜头 -->
    <el-dialog
      :title="$t('deviceCamera.modifyCamera')"
      v-model="$parent.modifyCameraVisible"
      top="10vh"
      :width="locale == 'en' ? '1200px' : '1050px'"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale === 'en' ? '230px' : '140px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <el-form-item
              :label="$t('public.organizationName') + '：'"
              auto-complete="off"
              prop="organizationName"
            >
              <el-input v-model="form.organizationName" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('public.mainDevName') + '：'"
              auto-complete="off"
              prop="mainDevName"
            >
              <el-input
                v-model="form.mainDevName"
                :placeholder="$t('public.pleaseInputmainDevName')"
                clearable
                :disabled="true"
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('deviceCamera.cameraName') + '：'"
              auto-complete="off"
              prop="cameraName"
            >
              <el-input
                v-model="form.cameraName"
                :placeholder="$t('deviceCamera.pleaseInputCameraName')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('deviceCamera.locationType') + '：'"
              auto-complete="off"
              prop="locationType"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.locationType"
                :placeholder="$t('deviceCamera.pleaseInputLocationType')"
              >
                <el-option
                  v-for="(item, index) in $parent.locationTypeData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('public.manufacturer') + '：'"
              auto-complete="off"
              prop="manufacturer"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.manufacturer"
                :placeholder="$t('public.pleaseInputmanufacturer')"
              >
                <el-option
                  v-for="(item, index) in $parent.manufacturerData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('deviceCamera.networkType') + '：'"
              auto-complete="off"
              prop="networkType"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.networkType"
                :placeholder="$t('deviceCamera.pleaseInputnetworkType')"
                :disabled="true"
              >
                <el-option
                  v-for="(item, index) in $parent.networkTypeData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('public.state') + '：'" auto-complete="off" prop="status">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.status"
                :placeholder="$t('deviceCamera.pleaseInputnetworkType')"
                :disabled="true"
              >
                <el-option
                  v-for="(item, index) in $parent.statusData"
                  :key="index"
                  :label="item.statusname"
                  :value="item.statustype"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('deviceCamera.xEightyAxis') + '：'" prop="xEightyAxis">
              <el-input
                v-model="form.xEightyAxis"
                :placeholder="$t('deviceCamera.pleaseInputxEightyAxis')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('public.longitude') + '：'"
              auto-complete="off"
              prop="longitude"
            >
              <el-input
                ref="inputBlurLog"
                @focus="longlatFocus"
                v-model="form.longitude"
                :placeholder="$t('public.pleaseInputlongitude')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('deviceCamera.azimuth') + '：'"
              auto-complete="off"
              prop="azimuth"
            >
              <el-input
                v-model="form.azimuth"
                :placeholder="$t('deviceCamera.pleaseInputazimuth')"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item :label="$t('public.platName') + '：'" auto-complete="off" prop="platName">
              <el-input v-model="form.platName" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item
              :label="$t('deviceCamera.ptzType') + '：'"
              auto-complete="off"
              prop="ptzType"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.ptzType"
                :placeholder="$t('public.ptzTypePrompt')"
              >
                <el-option
                  v-for="(item, index) in $parent.ptzTypeData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('deviceCamera.IntelligentAnalysisType') + '：'"
              auto-complete="off"
              prop="aiType"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.aiType"
                :placeholder="$t('deviceCamera.pleaseAnalysisType')"
                :disabled="true"
              >
                <el-option
                  v-for="(item, index) in $parent.aiTypeData"
                  :key="index"
                  :label="item.aiTypekName"
                  :value="item.aiType"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('public.applicationType') + '：'" prop="applicationType">
              <el-select
                disabled
                clearable
                :popper-append-to-body="false"
                v-model="form.applicationType"
                :placeholder="$t('public.pleaseInputApplicationType')"
              >
                <el-option
                  v-for="(item, index) in $parent.applicationData"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('deviceCamera.model') + '：'" prop="model">
              <el-input
                v-model="form.model"
                :placeholder="$t('deviceCamera.pleaseInputmodel')"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item :label="$t('deviceCamera.dpi') + '：'" prop="dpi">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.dpi"
                :placeholder="$t('deviceCamera.pleaseInputdpi')"
              >
                <el-option
                  v-for="(item, index) in $parent.dpiData"
                  :key="index"
                  :label="item.dpiname"
                  :value="item.dpitype"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('public.installLocate') + '：'" prop="installLocate">
              <el-input
                v-model="form.installLocate"
                :placeholder="$t('public.pleaseInputinstallLocate')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('deviceCamera.yEightyAxis') + '：'" prop="yEightyAxis">
              <el-input
                v-model="form.yEightyAxis"
                :placeholder="$t('deviceCamera.pleaseInputyEightyAxis')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('public.latitude') + '：'" prop="latitude">
              <el-input
                ref="inputBlurLat"
                @focus="longlatFocus"
                v-model="form.latitude"
                :placeholder="$t('public.pleaseInputlatitude')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="$t('public.remark') + '：'" prop="remark" class="padding40">
          <el-input
            type="textarea"
            v-model="form.remark"
            :placeholder="$t('public.pleaseInputremark')"
            maxlength="512"
            clearable
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="modifyCameraSubmit" :loading="$parent.maskloading">
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
import { validateDeviceName } from '@/utils/common/validator'

import longlatmap from '@/components/long-lat-map'
export default {
  components: {
    'long-lat-map': longlatmap
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        organizationName: null, //组织名称
        mainDevName: null, //主设备名称
        cameraId: null, //镜头ID
        cameraName: null, //镜头名称
        locationType: null, //移动类型
        manufacturer: null, //厂商
        aiType: null, //摄像机智能分析类型
        networkType: null, //网络接入类型
        status: null, //设备状态
        loginName: null, //平台内登录名
        loginDomain: null, //平台内登录域
        password: null, //平台内登录密码
        platName: null, //平台名称
        ptzType: null, //摄像机云台类型
        applicationType: null, //应用类型
        model: null, //设备型号
        installLocate: null, //设备的安装位置
        remark: null, //备注
        longitude: null, //经度
        latitude: null, //纬度
        storeageVolume: null, //存储空间
        xEightyAxis: null, //80坐标系x轴
        yEightyAxis: null, //80坐标系y轴
        azimuth: null, //初始方位角
        dpi: null //分辨率
      },
      rules: {},
      longlatMapVisible: false
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  mounted() {
    this.setFormRules()
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.dataForm
      })
    },
    dialogClosed() {
      this.$parent.modifyCameraVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
    },
    setFormRules() {
      this.rules = {
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'change'
          }
        ],
        mainDevName: [
          {
            required: true,
            message: this.$t('public.pleaseInputMainDevName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],
        cameraName: [
          {
            required: true,
            message: this.$t('deviceCamera.pleaseInputCameraName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ],
        recordRemainDays: [
          {
            required: true,
            message: this.$t('deviceCamera.VideoDays'),
            trigger: 'change'
          }
        ],
        networkType: [
          {
            required: false,
            message: this.$t('public.networkTypePrompt'),
            trigger: 'change'
          }
        ],
        aiType: [
          {
            required: true,
            message: this.$t('deviceCamera.pleaseAnalysisType'),
            trigger: 'change'
          }
        ],
        platName: [
          {
            required: true,
            message: this.$t('public.platNamePrompt'),
            trigger: 'change'
          }
        ],
        applicationType: [
          {
            required: false,
            message: this.$t('public.pleaseInputApplicationType'),
            trigger: 'change'
          }
        ],
        ptzType: [
          {
            required: true,
            message: this.$t('public.ptzTypePrompt'),
            trigger: 'change'
          }
        ],
        longitude: [
          {
            pattern:
              /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.longitudeError1'),
            trigger: 'change'
          }
        ],
        latitude: [
          {
            pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.latitudeError1'),
            trigger: 'change'
          }
        ],
        model: [
          {
            max: 128,
            message: this.$t('public.validate.charLimit', { num: 128 }),
            trigger: 'blur'
          }
        ],
        xEightyAxis: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'blur'
          }
        ],
        yEightyAxis: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'blur'
          }
        ],
        azimuth: [
          {
            max: 32,
            message: this.$t('public.validate.charLimit', { num: 32 }),
            trigger: 'blur'
          }
        ],
        installLocate: [
          {
            max: 512,
            message: this.$t('public.validate.charLimit', { num: 512 }),
            trigger: 'blur'
          }
        ]
      }
    },

    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlurLat.blur()
      this.$refs.inputBlurLog.blur()
    },

    modifyCameraSubmit() {
      var form = this.form
      if (form.cameraName != form.cameraName1) {
        this.rules.cameraName = [
          {
            required: true,
            message: this.$t('deviceCamera.pleaseInputCameraName'),
            trigger: 'change'
          },
          {
            validator: validateDeviceName,
            message: this.$t('public.mainDevError'),
            trigger: 'change'
          }
        ]
      } else {
        this.rules.cameraName = [
          {
            required: true,
            message: this.$t('deviceCamera.pleaseInputCameraName'),
            trigger: 'change'
          }
        ]
      }
      if (this.form.longitude && !this.form.latitude) {
        this.$message.warning(this.$t('public.pleaseInputlatitude'))
        return
      } else if (!this.form.longitude && this.form.latitude) {
        this.$message.warning(this.$t('public.pleaseInputlongitude'))
        return
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (form.dpi != undefined) {
            form.dpi = parseInt(form.dpi)
          }
          let data = {
            cameraId: form.cameraId,
            cameraName: form.cameraName != form.cameraName1 ? form.cameraName : null,
            ptzType: form.ptzType,
            locationType: form.locationType,
            networkType: form.networkType,
            organizationId: form.organizationId,
            manufacturer: form.manufacturer,
            model: form.model,
            installLocate: form.installLocate,
            remark: form.remark,
            applicationType: form.applicationType,
            longitude: parseFloat(form.longitude) || 0,
            latitude: parseFloat(form.latitude) || 0,
            xEightyAxis: form.xEightyAxis,
            yEightyAxis: form.yEightyAxis,
            azimuth: form.azimuth,
            dpi: form.dpi,
            aiType: form.aiType
          }
          this.$parent.maskloading = true
          // 修改镜头
          this.$api.modifyCameraInfo(data).then(async res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })

              this.dialogClosed()
              this.$parent.search_clear()
              this.$parent.handleFind()
            }
            this.$parent.maskloading = false
          })
        }
      })
    }
  }
}
</script>
