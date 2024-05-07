<template>
  <div>
    <el-dialog
      :title="
        $parent.operation
          ? $t('deviceManagement.addVehicleLane')
          : $t('deviceManagement.modifyVehicleLane')
      "
      v-model="$parent.addMainDevVisible"
      top="10vh"
      :width="locale == 'en' ? '1200px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="addLaneDialogVC"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale == 'en' ? '225px' : '116px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 组织 -->
            <el-form-item :label="$t('deviceManagement.belongBayonet') + ':'" prop="tollgateName">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.tollgateName"
                :placeholder="$t('deviceManagement.selectTheBayonet')"
                filterable
                @change="changeTol"
              >
                <el-option
                  v-for="(item, index) in $parent.tollgatesList"
                  :key="index"
                  :label="item.name"
                  :value="item.tollgateID"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 平台名称 -->
            <el-form-item
              :label="$t('deviceManagement.belongingBayonetCode') + ':'"
              prop="tollgateID"
            >
              <el-input
                v-model="form.tollgateID"
                :placeholder="$t('deviceManagement.selectTheBayonetCode')"
                :disabled="true"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <!-- 注册方式 -->
            <el-form-item :label="$t('deviceManagement.laneName') + ':'" prop="name">
              <el-input
                v-model="form.name"
                :placeholder="$t('deviceManagement.inputLaneName')"
              ></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 设备协议类型 -->
            <el-form-item :label="$t('deviceManagement.laneID') + ':'" prop="laneId">
              <el-input
                v-model="form.laneId"
                :placeholder="$t('deviceManagement.inputLaneID')"
              ></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="form-flex">
          <div class="form-left">
            <el-form-item :label="$t('deviceManagement.laneDirection') + ':'" prop="direction">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.direction"
                :placeholder="$t('deviceManagement.inputLaneDirection')"
              >
                <el-option
                  v-for="(item, index) in $parent.directionList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('deviceManagement.speedLimit') + ':'" prop="maxSpeed">
              <el-input-number
                v-model="form.maxSpeed"
                controls-position="right"
                :min="0"
              ></el-input-number>
              <span>{{ $t('deviceManagement.kmHour') }}</span>
            </el-form-item>

            <el-form-item :label="$t('deviceManagement.leavingTheCity') + ':'" prop="cityPass">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form.cityPass"
                :placeholder="$t('deviceManagement.selectTheEntry')"
              >
                <el-option
                  v-for="(item, index) in $parent.cityPassList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>

          <div class="form-right">
            <el-form-item :label="$t('deviceManagement.laneCoding') + ':'" prop="laneNo">
              <el-input
                v-model="form.laneNo"
                :placeholder="$t('deviceManagement.inputLaneCoding')"
              ></el-input>
            </el-form-item>

            <!--纬度  -->
            <el-form-item :label="$t('deviceManagement.equipmentInformation') + ':'">
              <el-input
                ref="latInput"
                @focus="latLngInput"
                v-model="choosedCameras"
                :placeholder="$t('deviceManagement.pleaseSelectCamera')"
                class="newCameras"
              ></el-input>
              <img
                src="@/assets/img/common/add.png"
                class="addIcon"
                @click="dialogDeviceVisibleAp = true"
              />
            </el-form-item>
          </div>
        </div>
        <el-form-item :label="$t('deviceManagement.laneDescription') + ':'" prop="desc">
          <el-input
            v-model="form.desc"
            :placeholder="$t('deviceManagement.selectLaneDescription')"
            type="textarea"
            maxlength="256"
            show-word-limit
            clearable
          ></el-input>
        </el-form-item>
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

    <device-tools
      :dialogDeviceVisibleAp="dialogDeviceVisibleAp"
      @getChooseCameras="getCameras"
      :currentChooseCameras="currentChooseCameras"
      :title="$t('deviceManagement.equipmentInformation')"
      :titleDialog="$t('deviceManagement.collectingDevice')"
      type="2"
      ifSendDeviceType="5"
      ifSendDeviceTypeApi="5"
      :showApeTree="true"
      :checkedApeId="checkedApeId"
      v-if="showTools"
    ></device-tools>
  </div>
</template>

<script>
import DeviceTools from '@/views/center/component/apeDeviceTools'
export default {
  components: {
    DeviceTools
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      dialogClose: false,

      organizationId: '',

      form: {
        tollgateName: '',
        tollgateID: '',
        name: '',
        laneId: '',
        direction: '',
        laneNo: '',
        maxSpeed: '',
        desc: '',
        cityPass: ''
      },

      rules: {},

      passw: 'password', //用于改变Input类型
      passws: 'password',
      iconShow: true,
      iconShows: true,

      choosedCameras: '',
      camerasArray: [],
      dialogDeviceVisibleAp: false,

      currentChooseCameras: [],
      token: '',

      showTools: true,
      cameraList: [],
      laneCheckedNodes: [],

      checkedApeId: ''
    }
  },
  mounted() {
    this.setFormRules()
  },

  watch: {},

  computed: {
    ifDisable() {
      return this.camerasArray.length > 0 && this.choosedCameras ? false : true
    }
  },

  methods: {
    getCameras(cameras) {
      let currentCameras = []
      this.choosedCameras = ''
      this.camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        currentCameras.push(cameras[i].label)
        this.camerasArray.push(cameras[i].id)
      }
      this.currentChooseCameras = JSON.parse(JSON.stringify(cameras))
      this.choosedCameras = currentCameras.join(',')
    },
    dialogOpen() {
      this.showTools = false
      if (this.$parent.operation) {
        this.$nextTick(() => {
          this.choosedCameras = ''
          this.currentChooseCameras = []
          this.camerasArray = []
        })
      } else {
        if (this.$parent.laneCheckedNodes && this.$parent.laneCheckedNodes.length) {
          this.laneCheckedNodes = this.$parent.laneCheckedNodes
          this.currentChooseCameras = this.$parent.laneCheckedNodes
          this.checkedApeId = this.laneCheckedNodes[0].id
        } else {
          this.laneCheckedNodes = []
          this.currentChooseCameras = []
          this.checkedApeId = ''
        }
      }

      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }

      this.$nextTick(() => {
        this.showTools = true
        this.setDialogCss()
        if (!this.$parent.operation) {
          this.form = this.$parent.modifyMainForm
          this.choosedCameras = this.form.apeName
          this.camerasArray = [this.laneCheckedNodes[0].id]
        } else {
          this.form.tollgateName = this.$parent.tollgateID
          this.form.tollgateID = this.$parent.tollgateID
        }

        this.organizationId = this.$parent.organizationId
      })
    },
    latLngInput() {
      this.dialogDeviceVisibleAp = true
      this.$refs.latInput.blur()
    },
    dialogClosed() {
      this.$parent.addMainDevVisible = false
      this.organizationId = ''
    },

    setFormRules() {
      var regInt = /^\d+$/
      var validateLaneId = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('deviceManagement.inputLaneID')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('deviceManagement.laneID2147483647')))
        } else {
          callback()
        }
      }
      var validateLaneNo = (rule, value, callback) => {
        if (value == '') {
          callback(new Error(this.$t('deviceManagement.inputLaneCoding')))
        } else if (!regInt.test(value) || value > 2147483647 || value < 1) {
          callback(new Error(this.$t('deviceManagement.laneCode2147483647')))
        } else {
          callback()
        }
      }

      this.rules = {
        tollgateName: [
          {
            required: true,
            message: this.$t('deviceManagement.bayonetNotEmpty'),
            trigger: 'change'
          }
        ],
        tollgateID: [
          {
            required: true,
            message: this.$t('deviceManagement.bayonetCodeNotEmpty'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: this.$t('deviceManagement.inputLaneName'),
            trigger: 'change'
          },
          {
            max: 100,
            message: this.$t('deviceManagement.length100'),
            trigger: 'change'
          }
        ],
        laneId: [
          {
            required: true,
            validator: validateLaneId,
            trigger: 'change'
          }
        ],
        direction: [
          {
            required: true,
            message: this.$t('deviceManagement.inputLaneDirection'),
            trigger: 'change'
          }
        ],
        maxSpeed: [
          {
            required: false,
            message: this.$t('deviceManagement.inputSpeedLimit'),
            trigger: 'change'
          },
          { type: 'integer', message: this.$t('deviceManagement.inputInt'), trigger: 'change' }
        ],
        laneNo: [
          {
            required: true,
            validator: validateLaneNo,
            trigger: 'change'
          }
        ],
        desc: [
          {
            max: 256,
            message: this.$t('deviceManagement.length256'),
            trigger: 'change'
          }
        ],
        cityPass: [
          {
            required: false,
            message: this.$t('deviceManagement.selectTheEntry'),
            trigger: 'change'
          }
        ]
      }
    },

    changeTol(val) {
      this.form.tollgateID = val
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
        tollgateID: form.tollgateID,
        laneId: Number(form.laneId),
        laneNo: Number(form.laneNo),
        name: form.name,
        direction: form.direction,
        maxSpeed: form.maxSpeed,
        apeID: this.camerasArray.join(''),
        cityPass: form.cityPass,
        desc: form.desc
      }

      this.$parent.maskloading = true
      if (this.$parent.operation) {
        this.$api.addLane(data).then(async res => {
          if (res.resultCode == 0) {
            this.successBack()
          } else {
            this.$parent.maskloading = false
          }
        })
      } else {
        data.id = this.$parent.choosedId
        this.$api.updateLane(data).then(async res => {
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
      this.$parent.getLaneList()
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.addLaneDialogVC {
  .el-dialog__body .form-flex {
    padding: 0;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .newCameras {
    height: 38px;
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .addIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 5px;
    top: 13px;
  }
  .el-input-number--small {
    width: 253px;
  }
}
</style>
