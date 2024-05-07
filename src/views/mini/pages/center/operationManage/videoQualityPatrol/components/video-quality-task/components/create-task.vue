<template>
  <div>
    <el-dialog
      :title="
        $parent.operation ? $t('videoQualityPatrol.creatTask') : $t('videoQualityPatrol.editTask')
      "
      v-model="$parent.dialogFormVisible"
      top="10vh"
      width="1175px"
      :close-on-click-modal="false"
      class="add_qualityTask"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :label-width="locale == 'en' ? '180px' : '130px'"
        label-position="left"
        :disabled="!$parent.operation"
      >
        <el-form-item
          :label="$t('videoQualityPatrol.taskName') + '：'"
          prop="name"
          style="padding: 0 140px"
        >
          <el-input
            v-model="form.name"
            auto-complete="off"
            :placeholder="$t('videoQualityPatrol.taskNameProp')"
            clearable
          />
        </el-form-item>
      </el-form>
      <el-collapse v-model="activeNames">
        <el-collapse-item :title="$t('devOps.periodSet')" name="2">
          <el-radio-group v-model="form.type" @change="typeChamge">
            <el-radio :label="1">{{ $t('dictConst.taskType1') }}</el-radio>
            <el-radio :label="2">{{ $t('dictConst.taskType2') }}</el-radio>
            <el-radio :label="3">{{ $t('dictConst.taskType3') }}</el-radio>
          </el-radio-group>

          <div style="display: inline-block; margin-left: 40px" v-show="form.type != 1">
            {{ $t('devOps.timeSet') }}：
            <el-date-picker
              :shortcuts="pickerOptions && pickerOptions.shortcuts"
              :disabled-date="pickerOptions && pickerOptions.disabledDate"
              :cell-class-name="pickerOptions && pickerOptions.cellClassName"
              v-model="datevalue"
              type="daterange"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              @change="dateChange"
              format="YYYY-MM-DD"
            ></el-date-picker>
          </div>
          <div style="display: inline-block; margin-left: 10px">
            <el-select v-model="form.week" v-show="form.type == 3" style="width: 100px">
              <el-option
                v-for="item in $parent.weekOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-select v-model="form.hour" v-show="form.type != 1" style="width: 70px">
              <el-option
                v-for="item in $parent.hourOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span v-show="form.type != 1">{{ $t('devOps.hour') }}</span>
          </div>
        </el-collapse-item>
        <el-collapse-item :title="$t('devOps.deviceSet')" name="1">
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="chooseDevice">
              {{ $t('devOps.selectDevice') }}
            </el-button>
            <el-button type="danger" @click="batchDel" :disabled="delShow">
              {{ $t('public.batchDeletion') }}
            </el-button>
          </div>

          <el-table
            :data="cameraList"
            :row-class-name="$parent.tableRowClassName"
            max-height="350"
            border
            @selection-change="handleSelectionChange"
          >
            <template #empty>
              <span style="font-size: 14px">{{ $t('public.noData') }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              show-overflow-tooltip
              :label="$t('deviceCamera.cameraId')"
              min-width="130"
            >
              <template #default="{ row }">
                <span>{{ row.cameraId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              show-overflow-tooltip
              :label="$t('deviceCamera.cameraName')"
              min-width="100"
            >
              <template #default="{ row }">
                <span>{{ row.cameraName }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('devOps.videoStream')" min-width="80">
              <template #default="{ row }">
                <el-select v-model="row.streamType">
                  <el-option
                    @change="changeStreamType(row)"
                    v-for="item in $parent.streamTypeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
          </el-table>
        </el-collapse-item>
      </el-collapse>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="submitForm" :loading="$parent.maskloading">
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <camera-selector
      ref="cameraSelector"
      class="device-tools"
      :title="$t('devOps.selectDevice')"
      v-model:visible="dialogDeviceVisible"
      :lazy-load="false"
      @confirm="getCameras"
      @open="onCameraSelectorOpen"
      :device-type="1"
    />
  </div>
</template>

<script>
import { getFormatDate } from '@/utils/common/mutil'
import CameraSelector from '@components/cameraSelector'
export default {
  components: {
    CameraSelector
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        name: '',
        type: 1,
        week: 1,
        hour: 0,
        startDay: undefined,
        endDay: undefined
      },
      rules: {},

      delShow: true,
      multipleSelection: [],
      cameraList: [],
      camerasArray: [],
      dialogDeviceVisible: false,

      activeNames: ['1', '2'],
      datevalue: '',
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime()
          let yester = curDate - 24 * 3600 * 1000
          return time.getTime() <= yester
        }
      }
    }
  },

  async mounted() {
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
        this.cameraList = this.$parent.cameraInfos
        this.datevalue = this.form.startDay ? [this.form.startDay, this.form.endDay] : ''
      })
    },
    onCameraSelectorOpen() {
      this.$refs.cameraSelector.setSelected(this.cameraList)
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm = {}
      this.$parent.cameraInfos = []
      this.camerasArray = []
      this.camerasInfo = []
    },

    setFormRules() {
      var reg1 = /[\s!#$%^&*()<>\\]+/
      // 验证名称
      var validateTaskName = (rule, value, callback) => {
        if (value === '') {
          callback(new Error(this.$t('videoQualityPatrol.taskNameProp')))
        } else {
          if (reg1.test(value)) {
            callback(new Error(this.$t('videoQualityPatrol.taskNamePrompt')))
          }
          callback()
        }
      }

      this.rules = {
        name: [
          {
            required: true,
            validator: validateTaskName,
            trigger: 'blur'
          },
          {
            min: 1,
            max: 32,
            message: this.$t('videoQualityPatrol.taskNameLength'),
            trigger: 'blur'
          }
        ]
      }
    },

    // 选择设备
    chooseDevice() {
      this.dialogDeviceVisible = true
    },
    async getCameras(cameras) {
      let cameraList = []
      let camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        cameraList.push({
          cameraName: cameras[i].name,
          cameraId: cameras[i].id,
          streamType: 1
        })
        camerasArray.push(cameras[i].id)
      }
      this.cameraList = this.unique(cameraList, this.cameraList)
      this.camerasArray = camerasArray
    },
    unique(arr1, arr2) {
      //去掉重复选取的数据
      for (var i = 0; i < arr1.length; i++) {
        for (var j = 0; j < arr2.length; j++) {
          if (arr1[i].cameraId == arr2[j].cameraId) {
            //通过cameraId属性进行匹配；
            arr1[i] = arr2[j]
          }
        }
      }
      return arr1
    },
    // 批量删除
    batchDel() {
      let list = this.cameraList.filter(items => {
        if (!this.multipleSelection.includes(items)) return items
      })
      this.cameraList = list
    },

    handleSelectionChange(val) {
      if (val.length != 0) {
        this.delShow = false
      } else {
        this.delShow = true
      }
      this.multipleSelection = val
    },

    typeChamge(val) {
      this.datevalue = ''
      this.form.week = 1
    },
    dateChange(val) {
      if (val) {
        this.form.startDay = getFormatDate(val[0]).substr(0, 10)
        this.form.endDay = getFormatDate(val[1]).substr(0, 10)
      } else {
        this.form.startDay = ''
        this.form.endDay = ''
      }
    },
    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          if (this.cameraList.length == 0) {
            this.$message.warning(this.$t('devOps.selectDevicePrompt'))
            return
          }
          if (this.form.type != 1 && !this.datevalue) {
            this.$message.warning(this.$t('devOps.timePrompt'))
            return
          }
          this.$parent.maskloading = true
          let cameraList = []
          this.cameraList.forEach(item => {
            cameraList.push({
              cameraId: item.cameraId,
              streamType: item.streamType
            })
          })
          let data = {
            name: this.form.name,
            type: this.form.type,
            week: this.form.type == 3 ? this.form.week : undefined,
            hour: this.form.type != 1 ? this.form.hour : undefined,
            startDay: this.form.type != 1 ? this.form.startDay : undefined,
            endDay: this.form.type != 1 ? this.form.endDay : undefined,
            cameras: cameraList
          }
          if (!this.$parent.operation) {
            Object.assign(data, {
              id: this.$parent.taskId
            })
            // 编辑
            this.$api.updateVideoQualityMainTask(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          } else {
            // 添加
            this.$api.createVideoQualityMainTask(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
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

<style lang="scss" scoped>
.add_qualityTask {
  :deep(.el-range-input) {
    color: #000;
  }
  :deep(.el-range-separator) {
    //color: #000;
    width: 20px;
  }
  .el-table {
    --el-table-border-color: #d9d9d9;
  }
}
:deep(.el-dialog__body) {
  padding: 15px 20px 20px 20px;
  .el-form-item--small.el-form-item {
    margin-bottom: 28px;
  }
}
:deep(.el-select .el-input .el-input__inner) {
  background: transparent;
}
:deep(.el-date-editor .el-range-separator) {
  color: #000;
}
</style>
