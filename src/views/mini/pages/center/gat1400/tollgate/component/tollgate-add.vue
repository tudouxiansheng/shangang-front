<template>
  <div>
    <el-dialog
      :title="
        $parent.operation ? $t('deviceManagement.addBayonet') : $t('deviceManagement.reviseBayonet')
      "
      v-model="$parent.addMainDevVisible"
      top="10vh"
      :width="locale == 'en' ? '1400px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="addBayonetDialogVC"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale == 'en' ? '320px' : '172px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 组织 -->
            <el-form-item
              :label="$t('platformManagement.Affiliation') + '：'"
              prop="organizationName"
            >
              <el-cascader
                ref="orgCascader"
                :key="areaCascaderKey"
                v-model="form.organizationName"
                :props="propsCasOrg"
                clearable
                @change="changeOrg"
              ></el-cascader>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 平台名称 -->
            <el-form-item
              :label="$t('platformManagement.organizationCode') + '：'"
              prop="organizationId"
            >
              <el-input
                v-model="form.organizationId"
                :placeholder="$t('platformManagement.selectOrganizationCode')"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <!-- 注册方式 -->
            <el-form-item :label="$t('deviceManagement.bayoneNname') + '：'" prop="name">
              <el-input
                v-model="form.name"
                :placeholder="$t('deviceManagement.inputBayoneNname')"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 设备协议类型 -->
            <el-form-item :label="$t('deviceManagement.bayonetCode') + '：'" prop="tollgateID">
              <el-input
                v-model="form.tollgateID"
                :placeholder="$t('deviceManagement.inputBayonetCode')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('deviceManagement.installationLocation') + '：'" prop="place">
              <el-input
                v-model="form.place"
                :placeholder="$t('deviceManagement.townshipStreet')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('deviceManagement.longitude') + '：'" prop="longitude">
              <el-input
                ref="inputBlurLog"
                @focus="longlatFocus"
                v-model="form.longitude"
                :placeholder="$t('deviceManagement.selectLongitude')"
                clearable
              ></el-input>
            </el-form-item>
            <!-- 安装地址 -->
            <el-form-item :label="$t('deviceManagement.bayonetPurpose') + '：'" prop="tollgateCat2">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.tollgateCat2"
                :placeholder="$t('deviceManagement.selectBayonetPurpose')"
              >
                <el-option
                  v-for="(item, index) in $parent.tollgateCat2List"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('deviceManagement.bayonetType') + '：'" prop="tollgateCat">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.tollgateCat"
                :placeholder="$t('deviceManagement.selectBayonetType')"
              >
                <el-option
                  v-for="(item, index) in $parent.tollgateCatList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('deviceManagement.organizationName') + '：'"
              prop="managementName"
            >
              <el-input
                v-model="form.managementName"
                :placeholder="$t('deviceManagement.inputOrganizationName')"
                clearable
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item
              :label="$t('deviceManagement.administrativeArea') + '：'"
              prop="placeCode"
            >
              <el-cascader
                v-model="form.placeCode"
                :props="propsCas"
                :key="placeCodeCascaderKey"
                clearable
              ></el-cascader>
            </el-form-item>

            <!--纬度  -->
            <el-form-item :label="$t('deviceManagement.latitude') + '：'" prop="latitude">
              <el-input
                ref="inputBlurLat"
                @focus="longlatFocus"
                v-model="form.latitude"
                :placeholder="$t('deviceManagement.selectLatitude')"
                clearable
              ></el-input>
            </el-form-item>

            <el-form-item :label="$t('deviceManagement.bayonetStatus') + '：'" prop="status">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.status"
                :placeholder="$t('deviceManagement.selectBayonetStatus')"
              >
                <el-option
                  v-for="(item, index) in $parent.statusList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('deviceManagement.enableTime') + '：'" prop="activeTime">
              <el-date-picker
                v-model="form.activeTime"
                type="datetime"
                :placeholder="$t('deviceManagement.selectActivationTime')"
                size="medium"
                value-format="YYYY-MM-DD HH:mm:ss"
              ></el-date-picker>
            </el-form-item>

            <el-form-item :label="$t('deviceManagement.jurisdictionCode') + '：'" prop="orgCode">
              <el-input
                v-model="form.orgCode"
                :placeholder="$t('deviceManagement.inputJurisdictionCode')"
                clearable
              ></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>

          <el-button type="primary" @click="addMainDevSubmit" :loading="$parent.maskloading">
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
    let _this = this
    return {
      locale: localStorage.getItem('locale'),
      dialogClose: false,

      organizationId: '',
      organizationName: '',

      form: {
        organizationId: '',
        organizationName: '',
        name: '',
        tollgateID: '',
        place: '',
        placeCode: '',
        longitude: '',
        latitude: '',
        tollgateCat2: '',
        status: '',
        tollgateCat: '',
        activeTime: '',
        managementName: '',
        orgCode: ''
      },

      rules: {},

      longlatMapVisible: false,

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,
      placeCodeCascaderKey: 0,
      propsCas: {
        checkStrictly: true,
        lazy: true,
        value: 'areaCode',
        label: 'areaName',
        lazyLoad(node, resolve) {
          const { level } = node
          if (level == 0) {
            setTimeout(function () {
              resolve([
                {
                  areaCode: '000000000000',
                  areaLevel: 0,
                  areaName: _this.$t('deviceManagement.nationwide'),
                  leaf: false
                }
              ])
            })
          } else {
            _this.$api.getAreaList({ areaCode: node.value }).then(res => {
              if (res.resultCode == 0) {
                const nodes = res.subAreaList.map(item => ({
                  ...item,
                  leaf: node.level >= 3
                }))
                resolve(nodes)
              }
            })
          }
        }
      },

      //5.7.4新增
      propsCasOrg: {
        checkStrictly: true,
        lazy: true,
        value: 'id',
        label: 'label',
        lazyLoad(node, resolve) {
          _this.$api
            .getOrganizationTree({
              withTenant: 2,
              type: 1,
              parentId: node.level == 0 ? null : node.data.id
            })
            .then(res => {
              if (res.resultCode == 0) {
                const nodes = res.nodeList.map(item => ({
                  ...item
                }))
                resolve(nodes)
              }
            })
        }
      },

      areaCascaderKey: 0
    }
  },
  mounted() {
    this.setFormRules()
  },

  watch: {},

  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }

      this.$nextTick(() => {
        
        if (!this.$parent.operation) {
          this.form = this.$parent.modifyMainForm
        } else {
          Object.assign(this.form, {
            organizationName: this.$parent.organizationName,
            organizationId: this.$parent.organizationId
          })
        }

        this.organizationId = this.$parent.organizationId
        this.organizationName = this.$parent.organizationName
        if (this.form.placeCode.length) {
          this.placeCodeCascaderKey++
        }
      })
    },
    dialogClosed() {
      this.$parent.addMainDevVisible = false
      this.organizationId = ''
    },

    setFormRules() {
      var regTollID = /^[0-9]{20}$/
      var validateTollgateID = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('deviceManagement.inputBayonetID')))
        } else if (!regTollID.test(value)) {
          callback(new Error(this.$t('deviceManagement.BayonetID20')))
        } else {
          callback()
        }
      }
      this.rules = {
        organizationId: [
          {
            required: true,
            message: this.$t('platformManagement.organizationEncodeNotEmpty'),
            trigger: 'change'
          }
        ],
        organizationName: [
          {
            required: true,
            message: this.$t('platformManagement.organizationEncodeNotEmpty'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('deviceManagement.inputBayoneNname'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          }
        ],
        tollgateID: [
          {
            required: true,
            validator: validateTollgateID,
            trigger: 'change'
          }
        ],
        place: [
          {
            required: false,
            message: this.$t('deviceManagement.inputInstallationLocation'),
            trigger: 'change'
          },
          {
            max: 256,
            message: this.$t('deviceManagement.length256'),
            trigger: 'change'
          }
        ],
        placeCode: [
          {
            required: true,
            message: this.$t('deviceManagement.selectAdministrativeArea'),
            trigger: 'change'
          }
        ],
        longitude: [
          {
            required: true,
            message: this.$t('deviceManagement.selectLongitude'),
            trigger: 'change'
          },
          {
            pattern:
              /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.longitudeError1'),
            trigger: 'change'
          }
        ],
        latitude: [
          {
            required: true,
            message: this.$t('deviceManagement.selectLongitude'),
            trigger: 'change'
          },
          {
            pattern: /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/,
            message: this.$t('public.latitudeError1'),
            trigger: 'change'
          }
        ],
        tollgateCat2: [
          {
            required: true,
            message: this.$t('deviceManagement.selectBayonetPurpose'),
            trigger: 'change'
          }
        ],
        status: [
          {
            required: true,
            message: this.$t('deviceManagement.selectBayonetStatus'),
            trigger: 'change'
          }
        ],
        tollgateCat: [
          {
            required: true,
            message: this.$t('deviceManagement.selectBayonetType'),
            trigger: 'change'
          }
        ],
        activeTime: [
          {
            required: false,
            message: this.$t('deviceManagement.selectActivationTime'),
            trigger: 'change'
          }
        ],
        managementName: [
          {
            required: false,
            message: this.$t('deviceManagement.inputOrganizationName'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          },
          {
            pattern: /^[\u4E00-\u9FA5A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.namePattern'),
            trigger: 'change'
          }
        ],
        orgCode: [
          {
            required: false,
            message: this.$t('deviceManagement.inputJurisdictionCode'),
            trigger: 'change'
          },
          {
            max: 12,
            message: this.$t('deviceManagement.length12'),
            trigger: 'change'
          },
          {
            pattern: /^[A-Za-z0-9_-]+$/,
            message: this.$t('deviceManagement.codePattern'),
            trigger: 'change'
          }
        ]
      }
    },

    changeOrg(val) {
      this.form.organizationId = JSON.parse(JSON.stringify(val)).pop()
    },

    // 获取经纬度
    longlatFocus() {
      this.longlatMapVisible = true
      this.$refs.inputBlurLat.blur()
      this.$refs.inputBlurLog.blur()
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.addSubmit()
        }
      })
    },
    addSubmit() {
      let form = this.form
      let data = {
        organizationId: this.form.organizationId, //组织Id
        organizationName: this.$refs['orgCascader'].getCheckedNodes()[0].label, //组织名称
        name: form.name, //卡口名称
        tollgateID: form.tollgateID, //卡口ID
        place: form.place, //安装位置
        placeCode: form.placeCode[form.placeCode.length - 1].substring(0, 6), //安装地点行政区域代码
        longitude: form.longitude, //经度
        latitude: form.latitude, //纬度
        tollgateCat2: form.tollgateCat2, //卡口用途
        status: form.status, //卡口状态
        tollgateCat: form.tollgateCat, //卡口类型
        activeTime: form.activeTime, //卡口启用时间
        managementName: form.managementName, //管理单位名称
        orgCode: form.orgCode //管理单位代码
      }

      this.$parent.maskloading = true
      if (this.$parent.operation) {
        this.$api.addTollgate(data).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      } else {
        data.id = this.$parent.choosedId
        this.$api.updateTollgate(data).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      }
    },
    successBack() {
      this.$message({
        type: 'success',
        message: this.$parent.operation
          ? this.$t('public.addSuccess')
          : this.$t('public.modifySuccess')
      })
      this.$parent.addMainDevVisible = false
      this.$parent.search_clear()
      this.$parent.getBayonetList()
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.addBayonetDialogVC {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
