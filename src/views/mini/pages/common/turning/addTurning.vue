<template>
  <!-- 轮巡管理 -->
  <div class="addTurning-manage">
    <el-row>
      <el-col :span="24" style="padding: 15px 30px 0">
        <el-form ref="form" :model="form" :rules="rules" label-position="top">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('turning.turningGroupName')" prop="turningName">
                <el-popover
                  placement="bottom"
                  :width="locale === 'en' ? 445 : 280"
                  trigger="click"
                  popper-class="popoverStyle"
                >
                  <div>
                    {{ $t('turning.cantContain2') }}
                    <br />
                    {{ $t('turning.length1To128') }}
                    <br />
                  </div>
                  <template #reference>
                    <el-input
                      v-model.trim="form.turningName"
                      auto-complete="off"
                      clearable
                      :placeholder="$t('turning.inputName')"
                    />
                  </template>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$t('turning.turningWindowNum')" prop="windowCount">
                <template #label>
                  <span>
                    {{ $t('turning.turningWindowNum') }}
                    <el-tooltip
                      effect="light"
                      :content="$t('turning.windowNumLessThanCameraPS')"
                      placement="right"
                      popper-class="tooltipStyle"
                    >
                      <img src="@/assets/img/common/info.png" alt />
                    </el-tooltip>
                  </span>
                </template>

                <el-input
                  v-model="form.windowCount"
                  auto-complete="off"
                  :placeholder="$t('turning.inputWindowNum')"
                  clearable
                  @input="windowCount_input"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="choosedCameras">
                <template #label>
                  <span>
                    {{ $t('turning.camera1') }}
                    <el-tooltip
                      effect="light"
                      :content="$t('turning.selectCameraLessThanNum', { num: maxCameras })"
                      placement="right"
                      popper-class="tooltipStyle"
                    >
                      <img src="@/assets/img/common/info.png" alt />
                    </el-tooltip>
                  </span>
                </template>

                <el-input
                  ref="choosedCamerasRef"
                  @focus="handleFocus"
                  v-model="form.choosedCameras"
                  :placeholder="$t('turning.selectCameraPlz')"
                />
                <img
                  src="@/assets/img/common/turn_cameras.png"
                  class="addIcon"
                  @click="dialogDeviceVisible = true"
                />
              </el-form-item>
            </el-col>
            <el-col :span="12" style="margin-top: 32px">
              <el-form-item label="">
                <el-checkbox v-model="autoPlan">{{ $t('turning.autoPlan') }}</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :label="$t('turning.roundTourPlan')" v-show="autoPlan">
                <el-radio-group v-model="planType" @change="planTypeChange">
                  <el-radio :label="0">{{ $t('analysisTask.weekPlan') }}</el-radio>
                  <el-radio :label="1">{{ $t('analysisTask.dayPlan') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-collapse-transition>
          <div class="periodSetBox" v-show="autoPlan">
            <!-- 网格时间选择控件 -->
            <time-grid-control ref="timeGridControl" id="time_grid_control"></time-grid-control>
            <el-button type="primary" class="clear">{{ $t('analysisTask.removeAll') }}</el-button>
          </div>
        </el-collapse-transition>

        <div class="stayDuration_check">
          <el-checkbox v-model="checked" style="margin: 0 40px 0 0px" @change="check_change">
            {{ $t('turning.manualSetting') }}
          </el-checkbox>
          <span>{{ $t('turning.oneDevVideoPlayTime') }}：</span>
          <el-input
            v-model="stayDuration"
            ref="stayDuration"
            class="stayDuration"
            :disabled="checked"
            @input="stayDuration_input"
          ></el-input>
          <span class="danger" v-if="checked == false">{{ stayDuration_errpr }}</span>
        </div>

        <div class="btns">
          <div @click="upList" class="mr-4 inline_block">
            <img :src="turn_up" alt />
            <span class="ml-1">{{ $t('turning.up') }}</span>
          </div>
          <div @click="downList" class="inline_block">
            <img :src="turn_down" alt />
            <span class="ml-1">{{ $t('turning.down') }}</span>
          </div>
          <div class="mr-4 inline_block">
            <el-tooltip
              :content="$t('turning.tips')"
              placement="top"
              effect="light"
              popper-class="tooltipStyle"
            >
              <span class="ml-2">
                <el-icon style="color: #4488be"><el-icon-info /></el-icon>
              </span>
            </el-tooltip>
          </div>
          <div @click="handleDel" class="inline_block">
            <img :src="turn_del" alt />
            <span class="ml-1">{{ $t('public.delete') }}</span>
          </div>
          <div class="mr-4 inline_block">
            <el-tooltip
              :content="$t('turning.tips2')"
              placement="top"
              effect="light"
              popper-class="tooltipStyle"
            >
              <span class="ml-2">
                <el-icon style="color: #4488be"><el-icon-info /></el-icon>
              </span>
            </el-tooltip>
          </div>
        </div>

        <el-table
          max-height="330"
          ref="multipleTable"
          :data="cameraList"
          highlight-current-row
          :row-class-name="tableRowClassName"
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          :span-method="objectSpanMethod"
          border
        >
          <el-table-column label width="50" type="selection" />

          <el-table-column show-overflow-tooltip :label="$t('turning.roundTourGroup')" width="200">
            <template #default="{ row }">
              <span>{{ row.turningName }}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip :label="$t('primaryDevice.cameraName')">
            <template #default="{ row }">
              <span>{{ row.cameraName }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip :label="$t('turning.playTime')" width="200">
            <template #default="{ row }">
              <input
                v-model="row.stayDuration"
                ref="durationInput"
                :disabled="!checked"
                @change="stayDuration_change1(row.stayDuration)"
                @input="stayDuration_input1(row)"
              />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip :label="$t('turning.preset')">
            <template #default="{ row, $index }">
              <select
                v-model="row.presetName"
                @click="presetIndex_focus($event, row, $index)"
                @change="presetIndex_change(row, $index)"
              >
                <option v-for="item in row.presetList" :key="item.index" :value="item.presetIndex">
                  {{ item.presetName }}
                </option>
              </select>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip :label="$t('turning.videoBitstream')">
            <template #default="{ row }">
              <select
                v-model="row.streamType"
                ref="streamTypedSelect"
                @change="streamType_change(row)"
              >
                <option v-for="item in streamList" :key="item.value" :value="item.value">
                  {{ item.label }}
                </option>
              </select>
            </template>
          </el-table-column>
        </el-table>

        <div class="footer">
          <el-button type="primary" @click="submit">{{ $t('public.confirm') }}</el-button>
          <el-button @click="closeFun">{{ $t('public.cancel') }}</el-button>
        </div>
      </el-col>
    </el-row>

    <camera-selector
      ref="cameraSelector"
      class="device-tools"
      :title="$t('turning.selectCamera')"
      v-model:visible="dialogDeviceVisible"
      :lazy-load="false"
      @confirm="getCameras"
      @open="onCameraSelectorOpen"
      :device-type="1"
      :max="maxCameras"
      show-favorites
    />
  </div>
</template>

<script>
import { InfoFilled as ElIconInfo } from '@element-plus/icons-vue'
import CameraSelector from '@components/cameraSelector'
import timeGridControl from '@/components/time-grid-control.vue'

export default {
  components: {
    CameraSelector,
    'time-grid-control': timeGridControl,
    ElIconInfo
  },
  name: 'TurningGroup',
  data() {
    let reg = /[\s<>'@:"$*%)\\/|?-]+/
    // 验证名称
    let validate_turningName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('turning.inputName')))
      } else {
        if (reg.test(value)) {
          callback(new Error(this.$t('turning.cantContain') + `：<>'@:"$*%)\\/|?-`))
        }
        callback()
      }
    }
    let reg1 = /^[0-9]+$/
    // 验证窗口数量
    let validate_windowCount = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('turning.inputWindowNum')))
      } else {
        if (reg1.test(value) == false || value == 0) {
          callback(new Error(this.$t('turning.enterPositiveInteger')))
        } else if (value > 24) {
          callback(new Error(this.$t('turning.windowNumAtMost24')))
        } else if (this.cameraList.length != 0 && value > this.cameraList.length) {
          callback(new Error(this.$t('turning.windowNumLessThanCamera')))
        }
        callback()
      }
    }
    return {
      locale: localStorage.getItem('locale'),
      form: {
        turningName: '',
        windowCount: '',
        choosedCameras: ''
      },
      rules: {
        turningName: [
          {
            required: true,
            validator: validate_turningName,
            trigger: 'change'
          },
          {
            min: 1,
            max: 128,
            message: this.$t('turning.length1To128'),
            trigger: 'change'
          }
        ],
        windowCount: [
          {
            required: true,
            validator: validate_windowCount,
            trigger: 'change'
          }
        ],
        choosedCameras: [
          {
            required: true,
            message: this.$t('turning.selectCameraPlz'),
            trigger: 'change'
          }
        ]
      },

      dialogDeviceVisible: false,

      checked: false,
      stayDuration: '15',
      stayDuration_errpr: '',

      cameraList: [], //表格列表
      cameraList_row: {}, //单行

      turningId: null,
      multipleSelection: [], //表格选中状态存放数组

      streamList: [
        {
          value: 0,
          label: this.$t('public.streamType0')
        },
        {
          value: 1,
          label: this.$t('public.streamType1')
        },
        {
          value: 2,
          label: this.$t('public.streamType2')
        },
        {
          value: 3,
          label: this.$t('public.streamType3')
        }
      ],

      operation: false,
      moveIndex: null, //移动索引

      turn_up: require('@/assets/img/common/turn_up.png'),
      turn_down: require('@/assets/img/common/turn_down.png'),
      turn_del: require('@/assets/img/common/turn_del.png'),
      turn_cameras: require('@/assets/img/common/turn_cameras.png'),

      planType: 0,
      timeOperation: 0,
      timeSpanList: [],
      autoPlan: false,
      oldRow: null
    }
  },
  computed: {
    ifDisable() {
      return this.cameraList.length > 0 ? false : true
    },
    groupNum() {
      return new Set(this.cameraList.map(o => o.turningName))
    },
    //阿联酋翻译
    tai() {
      return this.locale == 'en' ? '' : '台'
    },
    maxCameras() {
      return this.$projectEnv === 'AVS' ? 100 : 1000
    }
  },
  watch: {
    //监听语言切换
    cameraList(list) {
      this.locale = localStorage.getItem('locale')
      //阿联酋翻译
      if (list.length) {
        const itsBeenSelect = this.formatterItsBeenSelect(list)
        this.form.choosedCameras = itsBeenSelect
      }
    }
  },
  mounted() {
    this.dialogOpen()
  },
  methods: {
    handleFocus() {
      this.dialogDeviceVisible = true
      this.$refs.choosedCamerasRef.blur()
    },
    // 打开窗口
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        let path = this.$route.path
        if (path.indexOf('/turning/addTurning') != -1) {
          this.operation = true
          this.timeOperation = 0
          let timeOut = setTimeout(() => {
            this.$refs.timeGridControl.time_initialize(
              this.planType,
              this.timeOperation,
              this.timeSpanList
            )
            clearTimeout(timeOut)
          }, 300)
        } else {
          this.operation = false
          this.timeOperation = 2
          const turningId = this.$route.query.turningId
          this.get_Turning_Info(turningId)
        }
      })
    },
    // 关闭窗口
    closeFun() {
      const cuType = sessionStorage.getItem('cuType') || 1
      if (cuType == 1) {
        let param = {}
        if (this.operation) {
          param = {
            url: '/AIV-MP/#/turning/addTurning'
          }
        } else {
          param = {
            url: '/AIV-MP/#/turning/modifyTurning',
            turningId: this.turningId
          }
        }
        this.$webkitProc('close_dialog', JSON.stringify(param))
      }

      this.form = {
        turningName: '',
        windowCount: '',
        choosedCameras: ''
      }
      this.cameraList = []
      this.$refs.timeGridControl.closeControl()
    },

    async get_Turning_Info(turningId) {
      let data = {
        turningId
      }
      await this.$api.getTurningInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.form = {
            turningName: res.turningName,
            windowCount: res.windowCount.toString(),
            choosedCameras: this.formatterItsBeenSelect(res.cameraList)
          }

          this.cameraList = res.cameraList
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
          const checked = this.isAllEqual(res.cameraList)
          if (checked) {
            this.stayDuration =
              res.cameraList.length > 0 ? res.cameraList[0].stayDuration : undefined
          } else {
            this.checked = true
            this.stayDuration = ''
          }
          this.cameraList_fun()

          this.turningId = res.turningId

          let periodList = []
          if (res.periodList.length) {
            for (let i = 0; i < res.periodList.length; i++) {
              let item = res.periodList[i]
              periodList.push({
                dayType: item.dayType,
                startTime: item.startTime,
                stopTime: item.endTime
              })
            }
            this.timeSpanList = periodList
            if (res.periodList[0].dayType == 0) {
              this.planType = 1
            } else {
              this.planType = 0
            }
            this.autoPlan = !!periodList.length
          }
          let timeOut = setTimeout(() => {
            this.$refs.timeGridControl.time_initialize(
              this.planType,
              this.timeOperation,
              this.timeSpanList
            )
            clearTimeout(timeOut)
          }, 300)
        }
      })
    },
    isAllEqual(arr) {
      if (arr.length > 0) {
        return !arr.some(item => {
          return item.stayDuration !== arr[0].stayDuration
        })
      } else {
        return true
      }
    },
    windowCount_input(val) {
      const reg = /^[0-9]+$/
      if (val == '') {
        return
      } else if (reg.test(val) == false || val == 0) {
        return
      } else if (this.cameraList.length != 0 && val > this.cameraList.length) {
        return
      } else if (val != '' && this.cameraList.length / val > 24) {
        return
      }
      this.cameraList_fun()
      this.stayDuration_input1(this.cameraList_row)
    },
    async cameraList_fun() {
      if (this.cameraList.length != 0) {
        let cameraList = JSON.parse(JSON.stringify(this.cameraList))
        const windowCount = this.form.windowCount ? this.form.windowCount : 1
        for (let i = 0; i < cameraList.length; i++) {
          const turningName = this.$t('turning.group') + (Math.floor(i / windowCount) + 1)
          cameraList[i].turningName = turningName
          if (
            cameraList[i].presetName != undefined &&
            (cameraList[i].presetList == undefined || cameraList[i].presetList.length == 0)
          ) {
            const res = await this.$api.getPreset({
              cameraId: cameraList[i].cameraId
            })
            if (res.resultCode == 0) {
              cameraList[i].presetList = res.presetList
            }
          }
        }
        this.cameraList = cameraList
        this.$nextTick(() => {
          this.$refs.multipleTable?.setScrollTop(0)
        })
        this.$refs.multipleTable.setCurrentRow(this.cameraList[this.moveIndex])
      }
    },

    check_change(val) {
      if (!val) {
        this.stayDuration_input(this.stayDuration)
      }
    },

    stayDuration_input(val) {
      this.stayDuration_change2(val)
      if (this.cameraList) {
        this.cameraList.map(item => {
          item.stayDuration = val
        })
      }
    },

    stayDuration_change1(val) {
      const reg = /^[0-9]+$/
      if (val == '') {
        this.$message.warning(this.$t('turning.playTimeCantEmpty'))
        return false
      } else if (reg.test(val) == false || val == 0) {
        this.$message.warning(this.$t('turning.playTimePositiveInteger'))
        return false
      } else if (val < 10 || val > 600) {
        this.$message.warning(this.$t('turning.platTimeRange'))
        return false
      } else {
        return true
      }
    },
    stayDuration_change2(val) {
      const reg = /^[0-9]+$/
      if (val == '') {
        this.stayDuration_errpr = this.$t('turning.playTimeCantEmpty')
        return false
      } else if (reg.test(val) == false || val == 0) {
        this.stayDuration_errpr = this.$t('turning.playTimePositiveInteger')
        return false
      } else if (val < 10 || val > 600) {
        this.stayDuration_errpr = this.$t('turning.range')
        return false
      } else {
        this.stayDuration_errpr = ''
        return true
      }
    },

    stayDuration_input1(data) {
      this.cameraList_row = data
      this.$loadash.each(this.cameraList, item => {
        if (item.turningName == data.turningName) {
          item.stayDuration = data.stayDuration
        }
      })
    },
    // 上移
    upList() {
      if (this.cameraList.length == 1) {
        this.$message.warning(this.$t('turning.currentRow'))
        return
      }
      let index = this.moveIndex
      if (index == null) {
        this.$message.warning(this.$t('turning.selectUpRowPlz'))
        return
      }
      if (index === 0) {
        this.$message.warning(this.$t('turning.currentRowJustCanDown'))
        return
      }
      //在上一项插入该项
      this.cameraList.splice(index - 1, 0, this.cameraList[index])
      //删除后一项
      this.cameraList.splice(index + 1, 1)
      this.moveIndex = index - 1
      this.cameraList_fun()
    },
    // 下移
    downList() {
      if (this.cameraList.length == 1) {
        this.$message.warning(this.$t('turning.currentRow'))
        return
      }
      let index = this.moveIndex
      if (index == null) {
        this.$message.warning(this.$t('turning.selectDownRowPlz'))
        return
      }
      if (index === this.cameraList.length - 1) {
        this.$message.warning(this.$t('turning.currentRowJustCanUp'))
        return
      }
      // 在下一项插入该项
      this.cameraList.splice(index + 2, 0, this.cameraList[index])
      // 删除前一项
      this.cameraList.splice(index, 1)
      this.moveIndex = index + 1
      this.cameraList_fun()
    },
    // 删除
    handleDel() {
      if (this.cameraList.length && this.multipleSelection.length == 0) {
        this.$message.warning(this.$t('turning.selectDelRowFirst'))
        return
      }
      const arr = []
      this.multipleSelection.forEach(item => {
        arr.push(item.cameraId)
      })
      let cameraList = []
      cameraList = this.cameraList.filter(item => !arr.includes(item.cameraId))
      this.form.choosedCameras = this.formatterItsBeenSelect(cameraList)
      this.cameraList = cameraList
      this.cameraList_fun()
      this.$refs.multipleTable.clearSelection()
    },

    handleSelectionChange(row) {
      this.multipleSelection = row
    },
    rowClick(row) {
      this.moveIndex = row.index
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
    },

    objectSpanMethod(data) {
      const windowCount = this.form.windowCount ? this.form.windowCount : 1
      if (windowCount == 1) return
      if (windowCount > 1) {
        const { rowIndex, columnIndex } = data
        if (columnIndex === 1) {
          if (rowIndex % windowCount == 0) {
            return {
              rowspan: windowCount,
              colspan: 1
            }
          } else {
            return {
              rowspan: 0,
              colspan: 0
            }
          }
        } else {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
      }
    },
    async presetIndex_focus(event, row, index) {
      if (event) {
        await this.$api.getPreset({ cameraId: row.cameraId }).then(res => {
          if (res.presetList) {
            this.cameraList[index].presetList = res.presetList
          } else {
            this.cameraList[index].presetList = []
            this.$message({
              type: 'info',
              message: this.$t('turning.ThisCameraHaveNotPreset')
            })
          }
        })
      } else {
        this.cameraList[index].presetList = []
      }
    },
    presetIndex_change(row, index) {
      if (row.presetName == '') {
        this.cameraList[index].presetIndex = ''
        this.cameraList[index].presetName = ''
      } else {
        row.presetList.forEach(item => {
          if (row.presetIndex == item.presetIndex) {
            this.cameraList[index].presetIndex = item.presetIndex
            this.cameraList[index].presetName = item.presetName
          }
        })
      }
    },
    streamType_change() {},

    // 摄像机弹框
    openDialog() {
      this.dialogDeviceVisible = true
    },
    onCameraSelectorOpen() {
      this.$refs.cameraSelector.setSelected(this.cameraList)
    },
    getCameras(cameras) {
      if (cameras.length > this.maxCameras) {
        this.$message.warning(this.$t('turning.selectCameraLessThanNum', { num: this.maxCameras }))
        return
      }
      let cameraList = []
      const windowCount = this.form.windowCount ? this.form.windowCount : 1
      for (let i = 0; i < cameras.length; i++) {
        const turningName = this.$t('turning.group') + (Math.floor(i / windowCount) + 1)
        const arr = this.cameraList.filter(item => item.cameraId == cameras[i].id)
        const stayDuration =
          arr.length > 0 && arr[0].stayDuration ? arr[0].stayDuration : this.stayDuration
        const presetName = arr.length > 0 && arr[0].presetName ? arr[0].presetName : undefined
        const streamType =
          arr.length > 0 && arr[0].streamType !== undefined ? arr[0].streamType : undefined

        const presetList = arr.length > 0 && arr[0].presetList ? arr[0].presetList : []
        cameraList.push({
          cameraId: cameras[i].id,
          cameraName: cameras[i].name,
          stayDuration,
          turningName,
          presetName: presetName,
          streamType: streamType,
          presetList: presetList
        })
      }
      this.cameraList = cameraList

      this.form.choosedCameras = this.formatterItsBeenSelect(this.cameraList)
    },
    // 提交
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid && this.stayDuration_errpr == '') {
          let b = this.cameraList.every(item => {
            return item.stayDuration
          })
          if (!b) {
            this.$message.warning(this.$t('turning.playTimeHave'))
            return
          }

          let reg = /^[0-9]+$/
          let c = this.cameraList.every(item => {
            return reg.test(item.stayDuration) == false || item.stayDuration == 0
          })
          if (c) {
            this.$message.warning(this.$t('turning.playTimePositiveInteger'))
            return
          }

          let d = this.cameraList.every(item => {
            return item.stayDuration >= 10 && item.stayDuration <= 600
          })
          if (!d) {
            this.$message.warning(this.$t('turning.platTimeRange'))
            return
          }

          let periodList = []
          if (this.autoPlan) {
            let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
            if (timeSpanList.length == 0) {
              this.$message({
                message: this.$t('turning.selectPlan'),
                type: 'error',
                duration: 5 * 1000
              })
              return
            }

            periodList = timeSpanList.map(item => {
              return {
                dayType: item.dayType,
                startTime: item.startTime,
                endTime: item.stopTime
              }
            })
          }

          let cameraList = this.cameraList.map(item => {
            return {
              cameraId: item.cameraId,
              cameraName: item.cameraName,
              presetIndex: item.presetIndex,
              presetName: item.presetName,
              stayDuration: item.stayDuration,
              streamType: item.streamType
            }
          })

          let data = {
            turningName: this.form.turningName,
            windowCount: this.form.windowCount,
            cameraList
          }
          periodList.length && (data.periodList = periodList)

          if (this.operation) {
            this.$api.addTurningInfo(data).then(res => {
              this.successResult(res, this.$t('public.addSuccess'))
            })
          } else {
            Object.assign(data, {
              turningId: this.turningId
            })
            this.$api.modifyTurningInfo(data).then(res => {
              this.successResult(res, this.$t('public.modifySuccess'))
            })
          }
        }
      })
    },
    successResult(res, title) {
      if (res.resultCode == 0) {
        this.$message({
          type: 'success',
          message: title
        })
        this.closeFun()
      }
    },
    //选择周计划或日计划
    planTypeChange(val) {
      this.$refs.timeGridControl.planTypeChange(val)
    },
    formatterItsBeenSelect(list) {
      let itsBeenSelect = ''
      if (list.length > 0) {
        if (this.locale === 'en') {
          const camera = list.length > 1 ? 'cameras' : this.$t('turning.camera')
          itsBeenSelect =
            list.length + ' ' + this.tai + camera + ' ' + this.$t('turning.itsBeenSelect')
        } else {
          itsBeenSelect =
            this.$t('turning.itsBeenSelect') + list.length + this.tai + this.$t('turning.camera')
        }
      }
      return itsBeenSelect
    }
  }
}
</script>

<style lang="scss">
#app {
  overflow-y: auto;
}
.addTurning-manage {
  min-height: 100vh;
  background: #fff;
  .el-input .el-input__wrapper {
    border: 1px solid #d2d2d2;
    background: #f2f2f2;
    color: #262626;
    &::placeholder {
      color: #999;
    }
  }
  .el-input .el-input__inner {
    background: #f2f2f2;
    border: 0px solid #d2d2d2;
    color: #262626;
  }
  .el-table th,
  .el-table th.el-table__cell,
  .el-table tr {
    background: transparent;
  }
  .el-table--border .el-table__inner-wrapper::after,
  .el-table--border::after,
  .el-table--border::before,
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #d9d9d9 !important;
  }
  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #d9d9d9 !important;
  }
  .el-input.is-disabled .el-input__wrapper {
    background-color: #bfbfbf;
  }
  img {
    display: inline-block;
  }
  .el-form {
    margin: 0 auto;

    .el-form-item__label {
      color: #4d4d4d;
      padding: 0 5px 0 0;
    }
    .el-input,
    .el-input__inner {
      height: 32px;
      line-height: 32px;
    }

    .addIcon {
      position: absolute;
      width: 18px;
      height: 13px;
      right: 10px;
      top: 9px;
    }
  }
  .el-input__inner {
    border: 1px solid #d2d2d2;
    background: #f2f2f2;
    color: #262626;
    &::placeholder {
      color: #999;
    }
  }

  .el-input.is-disabled .el-input__inner {
    background-color: #bfbfbf;
    border-color: #bfbfbf;
    color: #737373;
  }

  .stayDuration_check {
    min-width: 695px;
    margin: 0 auto;
    text-align: center;
    color: #4d4d4d;
    .el-checkbox {
      color: #4d4d4d;
    }
  }

  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #0e6294;
  }

  .stayDuration,
  .stayDuration .el-input__inner {
    width: 50px;
  }
  .stayDuration .el-input__inner {
    padding: 0 6px;
    text-align: center;
  }
  .remark {
    color: #999;
  }

  .btns {
    margin: 12px 0;
    .inline_block {
      display: inline-block;
      color: #0e6294;
      cursor: pointer;
      img {
        height: 15px;
        display: inline-block;
      }
      span {
        display: inline-block;
        font-size: 14px;
        font-weight: 400;
        position: relative;
        top: 2px;
        vertical-align: middle;
      }
    }
  }

  .el-table--border:after,
  .el-table--group:after,
  .el-table:before {
    background-color: #d9d9d9;
  }

  .el-table--border,
  .el-table--group {
    border-color: #d9d9d9;
  }

  .el-table td,
  .el-table th.is-leaf {
    border-bottom: 1px solid #d9d9d9;
  }

  .el-table--border th,
  .el-table--border th.gutter:last-of-type {
    border-bottom: 1px solid #d9d9d9;
  }

  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #d9d9d9;
  }

  .el-table th,
  .el-table td {
    text-align: center;
  }

  .el-table th,
  .el-table tr {
    background: #fff;
  }

  .el-table {
    color: #2d2d2d;
    font-size: 14px;
    font-weight: 400;
  }

  .el-table thead {
    color: #808080;
  }

  // 暂无数据
  .el-table__empty-block {
    background: #fff;
  }

  .el-table__empty-text {
    color: #2d2d2d;
  }

  .el-table__body tr.current-row > td,
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #4488be !important;
  }

  .footer {
    text-align: center;
    margin-top: 25px;
    .el-button--default {
      background: #fff;
      border-color: #bfbfbf;
      color: #666;
    }

    .el-button--primary {
      background: #3085cb;
      border-color: #3085cb;
      margin-right: 25px;
    }
    .el-button {
      min-width: 60px;
    }
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    background-color: #f2f2f2;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background-color: #b3b3b3;
  }

  // 定义滚动条轨道 边角
  ::-webkit-scrollbar-corner {
    background-color: #f2f2f2;
  }

  .device-tools .el-dialog {
    margin-top: 2.5vh;
    .el-dialog__body {
      max-height: 100vh;
      padding: 10px 20px;
    }
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 10px;
    background-color: #f2f2f2;
  }

  .table_time_selected {
    min-width: initial;
  }

  #time_grid_control {
    color: #000;
  }
  input,
  select {
    width: 100%;
    padding: 0 15px;
    border: 1px solid #d2d2d2;
    background: #f2f2f2;
    color: #262626;
    height: 32px;
    line-height: 32px;
    text-overflow: ellipsis;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 400;
  }
  input:disabled {
    background-color: #bfbfbf;
    border-color: #bfbfbf;
    color: #737373;
  }
  .el-form-item__label {
    float: none; // 取消label左浮动
    word-break: break-word; // 支持单词截断换行
  }
}
.tooltipStyle {
  color: #fff !important;
  background: rgba(68, 136, 190, 0.9) !important;
  border: 0 solid #303133 !important;
  .popper__arrow {
    border-right-color: transparent !important;
    border-top-color: transparent !important;
  }
  &.is-light[x-placement^='right'] .popper__arrow::after {
    border-right-color: rgba(68, 136, 190, 0.9) !important;
  }
  &.is-light[x-placement^='top'] .popper__arrow::after {
    border-top-color: rgba(68, 136, 190, 0.9) !important;
  }
}
.popoverStyle {
  border: 1px solid #ebeef5 !important;
  background: #ffffff !important;
  color: #999999 !important;
  .popper__arrow::after,
  &[x-placement^='bottom'] .popper__arrow::after {
    border-bottom-color: #fff !important;
  }
  .popper__arrow {
    top: -7px !important;
  }
  &[x-placement^='bottom'] .popper__arrow {
    border-bottom-color: #ebeef5 !important;
  }
}
</style>
