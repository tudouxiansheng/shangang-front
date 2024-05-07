<template>
  <div>
    <!-- 调拨主设备 -->
    <el-dialog
      :title="$t('primaryDevice.AllocatingEquipment')"
      v-model="$parent.allcateDialogVisible"
      top="10vh"
      width="1000px"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      class="deviceDialog"
      draggable
      :show-close="!allLoading"
    >
      <el-form
        ref="allcateDeviceForm"
        :model="allcateDeviceForm"
        :rules="rules"
        :validate-on-rule-change="false"
        :label-width="locale == 'en' ? '160px' : '86px'"
        label-position="left"
        v-loading="allLoading"
        :element-loading-text="$t('primaryDevice.transferLoading')"
      >
        <el-form-item
          :label="$t('primaryDevice.organization') + '：'"
          auto-complete="off"
          prop="organizationName"
        >
          <el-input
            v-model="allcateDeviceForm.organizationName"
            :placeholder="$t('public.pleaseInputorganizationName')"
            disabled
          ></el-input>
        </el-form-item>

        <el-form-item
          :label="$t('primaryDevice.Allocatingplat') + '：'"
          auto-complete="off"
          prop="platform"
        >
          <el-select
            clearable
            :popper-append-to-body="false"
            v-model="allcateDeviceForm.platform"
            :placeholder="$t('primaryDevice.pleaseInputplat')"
            @change="platChange"
          >
            <template v-for="(item, index) in $parent.platNameLists" :key="index">
              <el-option
                v-if="item.platType != 15 && item.platType != 16"
                :label="item.platName"
                :value="item.platName"
              ></el-option>
            </template>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('Operations.DomaincodeName') + '：'"
          auto-complete="off"
          prop="domainCode"
          v-show="encoderShow"
        >
          <el-select
            clearable
            :popper-append-to-body="false"
            v-model="allcateDeviceForm.domainCode"
            v-loading="Domainloading"
            autocomplete="off"
            :placeholder="$t('public.domainNamePrompts')"
            ref="Domaincode"
          >
            <el-option
              v-for="(item, index) in domaincodelist"
              :key="index"
              :label="item.domainName"
              :value="item.domainCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          :label="$t('primaryDevice.PlatformAccount') + '：'"
          auto-complete="off"
          prop="PlatformAccount"
          v-show="PlatformAccountShow"
        >
          <el-input
            v-model="allcateDeviceForm.PlatformAccount"
            :placeholder="$t('primaryDevice.PlatformAccountPrompt')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('primaryDevice.PlatformPassword') + '：'"
          auto-complete="off"
          prop="PlatformPassword"
          v-show="PlatformPasswordShow"
        >
          <el-input
            v-model="allcateDeviceForm.PlatformPassword"
            :placeholder="$t('primaryDevice.PlatformPasswordPrompt')"
          ></el-input>
        </el-form-item>
        <el-form-item
          :label="$t('primaryDevice.Camera') + '：'"
          auto-complete="off"
          prop="devicelist"
        >
          <el-input
            ref="allDevicelist"
            v-model="allcateDeviceForm.devicelist"
            @focus="Allocatdevice"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            type="primary"
            @click="synchronization"
            v-if="PermissionManage && platType == 5"
          >
            {{ $t('primaryDevice.syncDomain') }}
          </el-button>
          <el-button @click="dialogClosed" :disabled="allLoading">
            {{ $t('public.cancel') }}
          </el-button>
          <el-button type="primary" @click="submitForm" :loading="allLoading">
            {{ $t('primaryDevice.AllocatingEquipment') }}
          </el-button>
        </span>
      </template>
    </el-dialog>

    <device-allcate-tree></device-allcate-tree>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { permissions } from '@/utils/common/permissions'
import deviceAllcateTree from './device-allcate-tree'

export default {
  components: {
    'device-allcate-tree': deviceAllcateTree
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      PermissionManage: true,

      allLoading: false,
      allcateDeviceForm: {
        organizationName: '',
        platform: '',
        domainCode: '',
        PlatformAccount: '',
        PlatformPassword: '',
        devicelist: ''
      },
      rules: {},
      Domainloading: false,
      domaincodelist: [],
      PlatformAccountShow: false,
      PlatformPasswordShow: false,
      encoderShow: false,

      platId: null,
      platType: null,
      allcateTreeDialogVisible: false,
      devicelistgroupIds: [],
      devicelistcameraIds: []
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  mounted() {
    this.getPermissions()
    this.setFormRules()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionManage = await permissions(90)
    },
    async dialogOpen() {
      if (this.$refs.allcateDeviceForm) {
        this.$nextTick(() => {
          this.$refs.allcateDeviceForm.resetFields()
        })
      }
      this.$nextTick(() => {
        
        this.allcateDeviceForm = this.$parent.allcateForm
      })
    },
    dialogClosed() {
      this.$parent.allcateDialogVisible = false
      this.$parent.allcateForms = {}
      this.rules.domainCode[0].required = false
      this.rules.PlatformAccount[0].required = false
      this.rules.PlatformPassword[0].required = false
      this.PlatformAccountShow = false
      this.PlatformPasswordShow = false
      this.encoderShow = false
    },
    submitForm() {
      this.$refs['allcateDeviceForm'].validate(valid => {
        if (valid) {
          this.allLoading = true
          let data = {
            organizationId: this.allcateDeviceForm.organizationId, //组织Id
            platId: this.platId, //平台Id
            groupIds: this.devicelistgroupIds, //设备组ID列表
            cameraIds: this.devicelistcameraIds, //摄像机ID列表
            domainCode: this.allcateDeviceForm.domainCode,
            account: this.allcateDeviceForm.PlatformAccount
          }
          this.$api.allocateDevice(data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('primaryDevice.AllocatingEquipments')
              })
              this.$parent.allcateDialogVisible = false
              this.$parent.search_clear()
              this.$parent.getMainDevList()
              this.allLoading = false
            } else if (res.resultCode !== 0 && res.resultList.length !== 0) {
              this.$parent.resultlist = res.resultList
              this.$parent.allcateErrorDialogVisible = true
              this.allLoading = false
            }
          })
        }
      })
    },
    // 同步
    synchronization() {
      this.$api.syncAllPlat({}).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('primaryDevice.synchronousRegime')
          })
          this.get_Domain_Code(this.platId)
        }
      })
    },
    Allocatdevice() {
      if (this.allcateDeviceForm.platform == '') {
        this.$message({
          type: 'error',
          message: this.$t('primaryDevice.SelectionPlatform')
        })
      } else if (
        this.platType == 2 &&
        this.allcateDeviceForm.PlatformAccount == '' &&
        this.allcateDeviceForm.PlatformPassword == ''
      ) {
        this.$message({
          type: 'error',
          message: this.$t('primaryDevice.AccountandPassword')
        })
      } else if (this.platType == 5 && this.allcateDeviceForm.domainCode == '') {
        this.$message({
          type: 'error',
          message: this.$t('primaryDevice.domainNames')
        })
      } else {
        this.allcateTreeDialogVisible = true
        this.$refs.allDevicelist.blur()
      }
    },

    platChange(val) {
      let platType = null,
        platId = null

      this.$parent.platNameList.forEach(item => {
        if (item.platName == val) {
          platType = item.platType
          platId = item.platId
        }
      })

      if (platType == 5 || platType == 15) {
        this.get_Domain_Code(platId)
        this.PlatformAccountShow = false
        this.PlatformPasswordShow = false
        this.encoderShow = true

        this.rules.domainCode[0].required = true
        this.rules.PlatformAccount[0].required = false
        this.rules.PlatformPassword[0].required = false
      } else if (platType == 2) {
        //nvs平台
        this.PlatformAccountShow = true
        this.PlatformPasswordShow = true
        this.encoderShow = false

        this.rules.domainCode[0].required = false
        this.rules.PlatformAccount[0].required = true
        this.rules.PlatformPassword[0].required = true
      } else if (platType == 10) {
        //萤石云平台
        this.encoderShow = false
        this.rules.domainCode[0].required = false
        this.rules.PlatformAccount[0].required = false
        this.rules.PlatformPassword[0].required = false
      } else {
        //svs平台
        this.encoderShow = false
        this.rules.domainCode[0].required = false
      }

      this.platType = platType
      this.platId = platId
      this.allcateDeviceForm.domainCode = ''
      this.allcateDeviceForm.devicelist = ''
      this.devicelistgroupIds = []
      this.devicelistcameraIds = []
    },

    async get_Domain_Code(platId) {
      this.Domainloading = true
      let data = {
        platId,
        isExDomain: 0,
        organizationId: this.allcateDeviceForm.organizationId, //组织Id
        pageInfo: {
          pageNum: 1,
          pageSize: 500
        }
      }
      await this.$api.getDomainCode(data).then(res => {
        if (res.resultCode == 0) {
          this.domaincodelist = res.domainList
        } else {
          this.domaincodelist = []
        }
        this.Domainloading = false
      })
    },

    setFormRules() {
      this.rules = {
        organizationName: [
          {
            required: true,
            message: this.$t('public.pleaseInputorganizationName'),
            trigger: 'blur'
          }
        ],
        platform: [
          {
            required: true,
            message: this.$t('primaryDevice.pleaseInputplat'),
            trigger: 'change'
          }
        ],
        domainCode: [
          {
            required: false,
            message: this.$t('public.domainCodePrompts'),
            trigger: 'change'
          }
        ],
        PlatformAccount: [
          {
            required: false,
            message: this.$t('primaryDevice.PlatformAccountPrompts'),
            trigger: 'change'
          }
        ],
        PlatformPassword: [
          {
            required: false,
            message: this.$t('primaryDevice.PlatformPasswordPrompts'),
            trigger: 'change'
          }
        ],
        devicelist: [
          {
            required: true,
            message: this.$t('primaryDevice.DevicePrompt'),
            trigger: 'change'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.deviceDialog {
  .el-dialog__body {
    padding: 15px 140px 5px !important;

    .el-loading-spinner {
      margin-left: 25px;
    }
  }
}
</style>
