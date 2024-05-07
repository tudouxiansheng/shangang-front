<template>
  <el-dialog
    :title="$t('analysisTask.editTask')"
    v-model="dialogVisible"
    top="10vh"
    :width="locale == 'en' ? '1200px' : '1100px'"
    class="intelligentTaskModifyDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="taskForm"
      :model="form"
      :rules="formRules"
      :label-width="$parent.locale == 'en' ? '205px' : '140px'"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <p class="form-title">
        {{ $t('analysisTask.basicInfo') }}
      </p>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item :label="$t('analysisTask.taskName') + '：'" prop="taskName">
            <el-input
              :placeholder="$t('analysisTask.taskName')"
              v-model="form.taskName"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('analysisTask.streamType') + '：'" prop="streamType">
            <el-select
              v-model="form.streamType"
              :placeholder="$t('analysisTask.selectStreamType')"
              disabled
            >
              <el-option
                v-for="(item, index) in streamTypeList"
                :key="index"
                :label="item.name"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col v-if="form.streamType === 2" :span="12">
          <el-form-item :label="$t('analysisTask.recordTime') + '：'" prop="recordTimeRange">
            <el-date-picker
              v-model="recordTimeRange"
              type="datetimerange"
              clearable
              align="right"
              value-format="YYYY-MM-DD HH:mm:ss"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              disabled
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="form.streamType === 2" :span="12">
          <el-form-item :label="$t('analysisTask.amazingSpeed') + '：'" prop="amazingSpeed">
            <el-checkbox
              v-model="form.amazingSpeed"
              :true-label="1"
              :false-label="0"
              disabled
            ></el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="no-margin-item" prop="analyzeMode">
            <el-checkbox v-model="form.analyzeMode" :true-label="1" :false-label="2" disabled>
              {{ $t('analysisTask.analyzeMode') }}
            </el-checkbox>
            <el-tooltip
              class="tip-item"
              popper-class="tip-item-popper"
              effect="dark"
              :content="$t('analysisTask.analyzeModePrompt')"
              placement="right"
            >
              <el-icon><el-icon-info /></el-icon>
            </el-tooltip>
          </el-form-item>
        </el-col>
      </el-row>

      <p class="form-title">
        {{ $t('algoTemplate.selectAnalysis') }}
      </p>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item
            :label="$t('algoTemplate.selectplatform') + '：'"
            prop="accessId"
            class="platform"
          >
            <el-select
              :placeholder="$t('algoTemplate.pleaseSelectplatform')"
              v-model="selAccessId"
              disabled
            >
              <el-option
                v-for="item in algorithmAccessList"
                :key="item.accessId"
                :label="
                  item.accessName +
                  `(${item.status === 1 ? $t('public.statustype1') : $t('public.statustype2')})`
                "
                :value="item.accessId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :label="$t('analysisTask.algo') + '：'"
            prop="algorithmIds"
            v-if="algorithmAccessList.find(algorithm => algorithm.accessId === selAccessId)"
          >
            <el-radio
              class="algorithm-radio"
              v-model="selAlgorithmId"
              :label="selAlgorithmId"
              disabled
            >
              <span>{{ selAlgorithmName }}</span>
            </el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="no-margin-item">
            <drawboard-for-modify
              v-if="selAlgorithmId && showDraw"
              ref="drawboardForModify"
              :data="form"
              :templateRule2="templateRule"
              :url="coverUrl"
              @change="behaviorChange"
              @board-mounted="handleBoardMounted"
            />
          </el-form-item>
        </el-col>

        <!--计划时间设置-->
        <el-col :span="24" style="margin-top: 10px">
          <el-form-item label-width="300px">
            <template #label>
              <div class="inline-block cursor-pointer" @click="autoPlan = !autoPlan">
                <span>{{ $t('analysisTask.autoPlan') }}</span>
                <el-icon v-if="autoPlan"><el-icon-arrow-down /></el-icon>
                <el-icon v-else><el-icon-arrow-up /></el-icon>
              </div>
            </template>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <div v-show="autoPlan" class="flex-aln">
            <el-radio-group v-model="planType" @change="planTypeChange" disabled>
              <el-radio :label="0">{{ $t('analysisTask.weekPlan') }}</el-radio>
              <el-radio :label="1">{{ $t('analysisTask.dayPlan') }}</el-radio>
            </el-radio-group>
          </div>
        </el-col>
        <el-col :span="24">
          <el-collapse-transition>
            <div class="periodSetBox" v-show="autoPlan">
              <!-- 网格时间选择控件 -->
              <time-grid-control ref="timeGridControl" id="time_grid_control1"></time-grid-control>
            </div>
          </el-collapse-transition>
        </el-col>

        <!--预置位设置-->
        <el-col v-if="ifCanSetPreset" :span="24">
          <el-form-item>
            <template #label>
              <span @click="presetConfiguration = !presetConfiguration">
                {{ $t('analysisTask.persetSet') }}
              </span>
              <el-icon v-if="presetConfiguration"><el-icon-arrow-down /></el-icon>
              <el-icon v-else><el-icon-arrow-up /></el-icon>
            </template>
          </el-form-item>
        </el-col>
        <el-col v-if="ifCanSetPreset" :span="24">
          <el-collapse-transition>
            <div class="presetSetBox" v-show="presetConfiguration">
              <!-- 表格 -->
              <el-table
                ref="dialogTable"
                :data="tableData"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                :row-class-name="tableRowClassName"
                border
                :highlight-current-row="true"
              >
                <template #empty>
                  <span style="font-size: 14px">{{ $t('public.noData') }}</span>
                </template>
                <el-table-column :label="$t('analysisTask.preset')" min-width="90">
                  <template #default="{ row }">
                    <div style="width: 100%; height: 100%">
                      <el-select
                        v-if="row.isPresetOK"
                        v-model="row.presetIndex"
                        :placeholder="$t('analysisTask.selectPreset')"
                        ref="presetInput"
                        @change="
                          () => {
                            row.isPresetOK = !row.presetIndex
                          }
                        "
                      >
                        <el-option
                          v-for="(item, index) in presetArr"
                          :key="index"
                          :label="item.presetName"
                          :value="item.presetIndex"
                        ></el-option>
                      </el-select>
                      <span v-else>{{ setPresetIndex(row.presetIndex) }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('analysisTask.dwellTime')" min-width="90">
                  <template #default="{ row }">
                    <div style="width: 100%; height: 100%">
                      <el-input
                        v-if="row.isDwellTimeOK"
                        v-model="row.dwellTime"
                        @blur="
                          () => {
                            row.isDwellTimeOK = !row.dwellTime
                          }
                        "
                        :placeholder="$t('analysisTask.inputStayTime')"
                        ref="dwellTimeInput"
                      ></el-input>
                      <span v-else>{{ row.dwellTime }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('analysisTask.speed')" min-width="90">
                  <template #default="{ row }">
                    <div style="width: 100%; height: 100%">
                      <el-input
                        v-if="row.isSpeedOK"
                        v-model="row.speed"
                        @blur="
                          () => {
                            row.isSpeedOK = !row.speed
                          }
                        "
                        :placeholder="$t('analysisTask.inputSpeed')"
                        ref="speedInput"
                      ></el-input>
                      <span v-else>{{ row.speed }}</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-collapse-transition>
        </el-col>
        <el-col :span="24">
          <el-form-item :label="$t('public.remark') + '：'" prop="remark">
            <el-input
              v-model="form.remark"
              auto-complete="off"
              type="textarea"
              :rows="2"
              maxlength="256"
              show-word-limit
              clearable
              :placeholder="$t('analysisTask.inputReamrk256')"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import {
  InfoFilled as ElIconInfo,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp
} from '@element-plus/icons-vue'
import drawboardForModify from './drawboardForModify'
import TimeGridControl from '@/components/time-grid-control'
import routeJump from '@/mixin/route-jump.js'
import { generateUuid } from '@/utils/common/utils'
import { handleGetPreviewWss } from '@/utils/common/preViewImg'
export default {
  components: {
    drawboardForModify,
    TimeGridControl,
    ElIconInfo,
    ElIconArrowDown,
    ElIconArrowUp
  },
  name: 'intelligentTaskModifyForm',
  mixins: [routeJump],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      streamTypeList: [
        {
          name: this.$t('analysisTask.live'),
          value: 1
        },
        {
          name: this.$t('analysisTask.record'),
          value: 2
        }
      ],
      recordTimeRange: [],
      algorithmAccessList: [],
      algorithmList: [],
      selAccessId: undefined,
      selAlgorithmId: undefined,
      selAlgorithmName: undefined,
      showDraw: false,
      templateRule: {},
      coverUrl: undefined,
      autoPlan: true,
      planType: 0,
      timeSpanList: [],
      presetConfiguration: false,
      presetTipVisible: false,
      ifCanSetPreset: false,
      presetArr: [],
      tableData: [],
      multipleSelection: [],
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    },
    formRules() {
      return {
        taskName: [
          {
            required: true,
            message: this.$t('analysisTask.taskNameCantEmpty'),
            trigger: 'blur'
          },
          {
            pattern: /^(?:(?!.*(-)\1)(?<!.*(-)\2)[^<>';@:"$*%)\\/|?]{1,128})$/,
            message: this.$t('analysisTask.taskNameError'),
            trigger: 'blur'
          }
        ],
        remark: [
          {
            max: 256,
            message: this.$t('public.validate.charLimit', { num: 256 }),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getTenantAlgorithm()
  },
  methods: {
    dialogOpen() {
      this.$nextTick(async () => {
        this.setDialogCss()
        this.form = this.data
        if (this.form.recordStartTime && this.form.recordEndTime) {
          this.recordTimeRange = [this.form.recordStartTime, this.form.recordEndTime]
        }
        if (this.form.algorithms.length) {
          this.selAccessId = this.form.algorithms[0].accessId
          this.selAlgorithmId = this.form.algorithms[0].algorithmId
          this.selAlgorithmName = this.form.algorithms[0].algorithmName
        }
        await this.getAlgoRule()
        if (this.form.periodList) {
          this.timeSpanList = this.form.periodList.map(item => {
            return {
              dayType: item.dayType,
              startTime: item.startTime,
              stopTime: item.endTime
            }
          })
          this.planType = this.form.periodList[0].dayType === 0 ? 1 : 0
        }
        this.$refs.timeGridControl.time_initialize(this.planType, 1, this.timeSpanList)
        await this.getPresetList()
        if (this.form.presetList) {
          this.tableData = this.form.presetList.map(item => {
            return {
              presetIndex: item.presetIndex,
              dwellTime: item.dwellTime,
              speed: item.speed,
              isPresetOK: false,
              isDwellTimeOK: false,
              isSpeedOK: false,
              operation: true,
              rowIndex: generateUuid()
            }
          })
        }
      })
    },
    dialogClosed() {
      this.dialogVisible = false
      this.showDraw = false
      this.planType = 0
      this.timeSpanList = []
      this.presetTipVisible = false
      this.ifCanSetPreset = false
      this.presetArr = []
      this.tableData = []
    },
    async getLiveUrl() {
      try {
        const res = await this.$api.getLiveUrl({
          cameraId: this.form.content,
          streamType: 1,
          urlType: 6
        })
        this.coverUrl = handleGetPreviewWss(res.url ? res.url : '')
      } catch (e) {
        this.$message.error(this.$t('cameraConfiguration.videoChannel.getLiveUrlFailed'))
      }
    },
    // 查询当前租户拥有的算法
    async getTenantAlgorithm() {
      // 查询算法接入
      let res = await this.$api.getAlgorithmAccessList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode == 0) {
        this.algorithmAccessList = res.algorithmAccessList || []
      }

      let res1 = await this.$api.getUserAlgorithmList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        userId: sessionStorage.getItem('userId'),
        enabled: 1
      })
      if (res1.resultCode == 0) {
        this.algorithmList =
          res1.algorithmList
            .filter(
              item =>
                item.algorithmKey !== 'BEHAVIOR3800' || item.algorithmKey !== 'BEHAVIOR_RECOGNIZE'
            )
            .map(item => {
              return {
                ...item,
                disabled: false
              }
            }) || []

        this.algorithmAccessList = this.algorithmAccessList.map(item => {
          return {
            ...item,
            children: this.algorithmList.filter(algorithm => algorithm.accessId === item.accessId)
          }
        })
      }
      // 选择算法平台及选择后续算法都是必选项，目前优化方法，算法平台下没有算法就不展示该算法平台以保证数据验证完整性。
      this.algorithmAccessList = this.algorithmAccessList.reduce((total, acc) => {
        if (acc.children && Array.isArray(acc.children) && acc.children.length !== 0) {
          total.push(acc)
        }
        return total
      }, [])
    },
    // 获取算法规则
    async getAlgoRule() {
      let res = await this.$api.searchAlgorithmRuleByAlgorithm({
        algorithmId: this.selAlgorithmId
      })
      if (!res.info) {
        this.showDraw = false
        this.$confirm(
          this.$t('algoTemplate.pleaseTemplateConfiguration'),
          this.$t('public.prompt'),
          {
            confirmButtonText: this.$t('algoTemplate.goTo'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning',
            closeOnClickModal: false
          }
        )
          .then(() => {
            let routerPush = {
              name: 'AlgorithmManagement'
            }
            this.routeJump('/algorithm/manage', routerPush)
          })
          .catch(() => {})
      } else {
        this.templateRule = res.info
        this.showDraw = true
      }
    },
    async getPresetList() {
      let res = await this.$api.getCameraInfo({ cameraId: this.form.content })
      if (res.resultCode == 0) {
        //判断是否可设置预置位
        if (
          res.cameraBaseInfo.ptzType == 2 ||
          res.cameraBaseInfo.ptzType == 3 ||
          res.cameraBaseInfo.ptzType == 4
        ) {
          let res1 = await this.$api.getPreset({ cameraId: this.form.content })
          if (res1.presetList?.length) {
            this.presetArr = res1.presetList
            this.ifCanSetPreset = true
            this.presetConfiguration = true
            let res2 = await this.$api.mayConflict({
              cameraId: this.form.content
            })
            this.presetTipVisible = res2.mayConflict
          }
        }
      }
    },
    behaviorChange(form) {
      this.form = Object.assign({}, this.form, form)
    },
    handleBoardMounted() {
      this.$nextTick(() => {
        this.$refs.drawboardForModify.reLoadCanvas()
      })
    },
    //选择周计划或日计划
    planTypeChange(val) {
      this.$refs.timeGridControl.planTypeChange(val)
    },
    handleFullPlan() {
      Array.from(document.querySelectorAll('.plug-timer-grid tbody tr th')).forEach(th => {
        let timer = setTimeout(() => {
          th.click()
          clearTimeout(timer)
        }, 200)
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    presetDbClick(row) {
      row.isPresetOK = true
      this.$nextTick(() => {
        this.$refs.presetInput.focus()
      })
    },
    setPresetIndex(val) {
      if (val) {
        this.presetArr.map(item => {
          if (val == item.presetIndex) {
            val = item.presetName
          }
        })
      } else {
        val = ''
      }
      return val
    },
    dwellTimeDbClick(row) {
      row.isDwellTimeOK = true
      this.$nextTick(() => {
        this.$refs.dwellTimeInput.focus()
      })
    },
    speedDbClick(row) {
      row.isSpeedOK = true
      this.$nextTick(() => {
        this.$refs.speedInput.focus()
      })
    },
    async handleAdd() {
      let addObj = {
        presetIndex: '',
        dwellTime: '',
        speed: '',
        isPresetOK: true,
        isDwellTimeOK: true,
        isSpeedOK: true,
        operation: true,
        rowIndex: generateUuid()
      }
      this.tableData.push(addObj)
    },
    handleDel() {
      if (!this.multipleSelection.length) {
        this.$message.warning(this.$t('analysisTask.selectDelRowFirst'))
        return
      }

      this.multipleSelection.forEach(item1 => {
        this.tableData.forEach((item2, j) => {
          if (item2.rowIndex == item1.rowIndex) {
            this.tableData.splice(j, 1)
            j -= 1
          }
        })
      })
    },
    handleMoveUp() {
      if (!this.multipleSelection.length) {
        this.$message.warning(this.$t('analysisTask.selectUpRowFirst'))
        return
      }

      let arr = []
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.multipleSelection.length; j++) {
          if (this.tableData[i].rowIndex == this.multipleSelection[j].rowIndex) {
            arr.push(this.tableData[i])
          }
        }
      }
      this.multipleSelection = arr

      if (this.multipleSelection[0].rowIndex == this.tableData[0].rowIndex) {
        this.$message.warning(this.$t('analysisTask.cantUp'))
        return
      }

      arr.forEach(item1 => {
        this.tableData.forEach((item2, j) => {
          if (item2.rowIndex == item1.rowIndex) {
            //在上一项插入该项
            this.tableData.splice(j - 1, 0, this.tableData[j])
            //删除后一项
            this.tableData.splice(j + 1, 1)
            j -= arr.length
          }
        })
      })
    },
    handleMoveDown() {
      if (!this.multipleSelection.length) {
        this.$message.warning(this.$t('analysisTask.selectDownRowFirst'))
        return
      }

      let arr = []
      for (let i = 0; i < this.tableData.length; i++) {
        for (let j = 0; j < this.multipleSelection.length; j++) {
          if (this.tableData[i].rowIndex == this.multipleSelection[j].rowIndex) {
            arr.push(this.tableData[i])
          }
        }
      }
      this.multipleSelection = arr

      if (
        this.multipleSelection[this.multipleSelection.length - 1].rowIndex ==
        this.tableData[this.tableData.length - 1].rowIndex
      ) {
        this.$message.warning(this.$t('analysisTask.cantDown'))
        return
      }

      for (let i = this.tableData.length - 1; i >= 0; i--) {
        for (let j = this.multipleSelection.length - 1; j >= 0; j--) {
          if (this.tableData[i].rowIndex == this.multipleSelection[j].rowIndex) {
            this.tableData.splice(i + 2, 0, this.tableData[i])
            //删除前一项
            this.tableData.splice(i, 1)
          }
        }
      }
    },
    async submitForm() {
      const valid = await this.$refs['taskForm'].validate().catch(err => err)
      if (valid === true) {
        //判断接入在离线
        let ifAccessOffline = false
        let access = this.algorithmAccessList.find(item => {
          return (
            item.children.findIndex(algorithm => algorithm.algorithmId === this.selAlgorithmId) !==
            -1
          )
        })
        if (access?.status === 2) {
          ifAccessOffline = true
        }

        let data = {
          taskId: this.form.taskId,
          taskName: this.form.taskName,
          remark: this.form.remark
        }
        this.loading = true
        //判断接入在离线
        if (ifAccessOffline) {
          try {
            await this.$confirm(
              this.$t('analysisTask.selectAlgoOfflineEdit'),
              this.$t('public.prompt'),
              {
                confirmButtonText: this.$t('public.confirm'),
                cancelButtonText: this.$t('public.cancel'),
                type: 'warning'
              }
            )
            const res = await this.$api.modifyNewTaskInfo(data)
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.modifySuccess')
              })
              this.loading = false
              this.dialogVisible = false
              this.$parent.getList()
            }
          } catch {
            this.$message({
              type: 'info',
              message: this.$t('analysisTask.editCanceled')
            })
            return false
          }
        } else {
          const res = await this.$api.modifyNewTaskInfo(data)
          if (res.resultCode === 0) {
            this.$message({
              type: 'success',
              message: this.$t('public.modifySuccess')
            })
          }
          this.loading = false
          this.dialogVisible = false
          this.$parent.getList()
        }
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss">
.intelligentTaskModifyDialog {
  .el-dialog__body {
    padding: 15px 20px 5px;

    .form-title {
      position: relative;
      margin: 20px 0 20px 10px;
      font-size: 16px;
      font-weight: bold;

      &:before {
        content: '';
        width: 2px;
        height: 16px;
        position: absolute;
        left: -10px;
        top: 2.5px;
        bottom: 0;
        background-color: #00a1ff;
      }
    }

    .el-row {
      display: flex;
      flex-wrap: wrap;
    }

    .presetSetBox {
      margin-bottom: 18px;
    }

    .preset-tip {
      margin-left: 20px;
      color: #ff6b6b;
    }

    .clear {
      margin-left: 20px;
    }

    .el-date-editor {
      width: 100%;
    }

    .el-date-editor.is-disabled {
      background-color: #bfbfbf;
      border-color: #bfbfbf;
      color: #737373;

      .el-range-separator,
      .el-range__icon {
        color: #737373;
      }

      input {
        background-color: #bfbfbf;
        color: #737373;
      }
    }
  }
}
</style>
