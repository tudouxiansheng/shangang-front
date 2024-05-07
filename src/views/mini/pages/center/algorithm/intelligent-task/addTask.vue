<template>
  <div id="addIntelligentAnalysisTask" v-if="isRouterAlive" ref="addIntelligentAnalysisTask">
    <el-page-header
      @back="goBack(true)"
      :content="$t('analysisTask.createAnalysisTask')"
    ></el-page-header>
    <el-row :gutter="20">
      <el-col :span="5">
        <source-tree @selTypeChange="onTypeChange" @selectionChange="onSelectionChange" />
      </el-col>
      <el-col :span="19">
        <div v-if="this.selection.length > 0" class="task-form-container">
          <div class="task-form-header">
            <el-checkbox v-model="batchConfiguration" @change="handleBatchConfigChange">
              {{ $t('analysisTask.batchConfiguration') }}
            </el-checkbox>
            <el-form
              v-if="batchConfiguration"
              ref="batchForm"
              :model="batchForm"
              :rules="batchFormRules"
              :label-width="locale == 'en' ? '240px' : '120px'"
              label-position="left"
              :validate-on-rule-change="false"
            >
              <el-row class="form-row" :gutter="20">
                <el-col :span="12">
                  <el-form-item :label="$t('analysisTask.streamType') + '：'" prop="streamType">
                    <el-select
                      clearable
                      :popper-append-to-body="false"
                      v-model="batchForm.streamType"
                      :placeholder="$t('analysisTask.selectStreamType')"
                      @change="streamTypeChange"
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
                <el-col v-if="batchForm.streamType === 2" :span="12">
                  <el-form-item
                    :label="$t('analysisTask.recordTime') + '：'"
                    prop="recordTimeRange"
                  >
                    <el-date-picker
                      v-model="batchForm.recordTimeRange"
                      type="datetimerange"
                      clearable
                      align="right"
                      value-format="YYYY-MM-DD HH:mm:ss"
                      :range-separator="$t('public.to')"
                      :start-placeholder="$t('public.startTimePrompt')"
                      :end-placeholder="$t('public.endTimePrompt')"
                      @change="dateRangeChange"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item class="no-margin-item" prop="analyzeMode">
                    <el-checkbox
                      v-model="batchForm.analyzeMode"
                      :true-label="1"
                      :false-label="2"
                      @change="val => updateTaskForms('analyzeMode', val)"
                    >
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
              <el-row class="form-row" :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('algoTemplate.selectplatform') + '：'"
                    prop="accessId"
                    class="platform"
                  >
                    <el-select
                      clearable
                      :popper-append-to-body="false"
                      :placeholder="$t('algoTemplate.pleaseSelectplatform')"
                      v-model="batchForm.accessId"
                      @change="val => updateTaskForms('accessId', val)"
                      @clear="
                        () => {
                          disabledConfig = false
                          batchForm.algorithmIds = ''
                        }
                      "
                    >
                      <el-option
                        v-for="item in algorithmAccessList"
                        :key="item.accessId"
                        :label="
                          item.accessName +
                          `(${
                            item.status === 1 ? $t('public.statustype1') : $t('public.statustype2')
                          })`
                        "
                        :value="item.accessId"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col v-if="batchForm.streamType === 2" :span="12">
                  <el-form-item class="no-margin-item" prop="amazingSpeed">
                    <el-checkbox
                      v-model="batchForm.amazingSpeed"
                      true-label="1"
                      false-label="0"
                      @change="val => updateTaskForms('amazingSpeed', val)"
                      :disabled="disabledConfig"
                    >
                      {{ $t('analysisTask.amazingSpeed') }}
                    </el-checkbox>
                  </el-form-item>
                </el-col>
                <el-form-item
                  class="no-margin-item"
                  prop="algorithmIds"
                  style="margin-bottom: 0; width: 100%"
                  v-if="
                    algorithmAccessList?.find(
                      algorithm => algorithm.accessId === batchForm.accessId
                    )
                  "
                >
                  <el-radio-group
                    class="algorithm_group"
                    v-model="batchForm.algorithmIds"
                    @change="handleAlgorithmIdsChange"
                  >
                    <div
                      v-for="algorithm in algorithmAccessList?.filter(
                        algorithm => algorithm.accessId === batchForm.accessId
                      )[0].children"
                      :key="algorithm.algorithmId"
                    >
                      <el-col :span="6">
                        <el-radio class="algorithm-radio" :label="algorithm.algorithmId">
                          <span>{{ algorithm.algorithmName }}</span>
                          <el-checkbox
                            class="enableExtractFeature-checkbox"
                            v-if="
                              batchForm.algorithmIds === algorithm.algorithmId &&
                              algorithm.extractFeature
                            "
                            v-model="algorithm.enableExtractFeature"
                            :true-label="1"
                            :false-label="0"
                          >
                            {{ $t('analysisTask.extractFeature') }}
                          </el-checkbox>
                        </el-radio>
                      </el-col>
                    </div>
                  </el-radio-group>
                </el-form-item>
              </el-row>
              <!--计划时间设置-->
              <el-row class="form-row" style="margin-top: 10px" :gutter="20">
                <el-col :span="24">
                  <el-form-item required label-width="300px">
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
                    <el-radio-group v-model="planType" @change="planTypeChange">
                      <el-radio :label="0">{{ $t('analysisTask.weekPlan') }}</el-radio>
                      <el-radio :label="1">{{ $t('analysisTask.dayPlan') }}</el-radio>
                    </el-radio-group>
                    <el-link
                      :underline="false"
                      type="primary"
                      class="clear"
                      @click="handleFullPlan"
                    >
                      {{ $t('analysisTask.fullPlan') }}
                    </el-link>
                    <el-link :underline="false" type="primary" class="clear" :icon="ElIconDelete">
                      {{ $t('analysisTask.removeAll') }}
                    </el-link>
                  </div>
                </el-col>
                <el-col :span="24">
                  <el-collapse-transition>
                    <div class="periodSetBox" v-show="autoPlan">
                      <!-- 网格时间选择控件 -->
                      <time-grid-control
                        ref="timeGridControl"
                        id="time_grid_control"
                      ></time-grid-control>
                    </div>
                  </el-collapse-transition>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div class="task-form-content" :style="{ flex: batchConfiguration ? 'none' : '1' }">
            <div class="selection-list">
              <el-scrollbar>
                <div
                  :class="['selection-list-item', currentIndex === index && 'active']"
                  v-for="(item, index) in selection"
                  :key="item.id"
                  @click="selectionItemClick(index)"
                >
                  {{ item.label }}
                </div>
              </el-scrollbar>
            </div>
            <div class="task-form-wrapper">
              <task-form
                ref="taskForm"
                :type="selectType"
                :current-index="currentIndex"
                :batch-config="batchConfiguration"
                :current-camera="currentSelection"
                :form-cache="taskFormDataMap"
              />
            </div>
          </div>
          <div class="task-form-footer">
            <el-button @click="goBack">{{ $t('public.cancel') }}</el-button>
            <el-button type="primary" @click="handleSubmitAdd" :loading="submitLoading">
              {{ $t('public.confirm') }}
            </el-button>
          </div>
        </div>
        <div class="empty-wrapper" v-else>
          <el-empty
            :image="emptyImg"
            :image-size="388"
            :description="$t('analysisTask.selectAnalysisObject')"
          />
        </div>
      </el-col>
    </el-row>

    <!-- 批量操作 -->
    <batch-add-dialog
      ref="batchOperation"
      :title="$t('analysisTask.batchCreateTasks')"
      :api="batchApi"
      :operations="batchData"
      :customErrorColumn="customErrorColumn"
      @close="afterBatchOperate"
    />
  </div>
</template>

<script>
import {
  InfoFilled as ElIconInfo,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp,
  Delete as ElIconDelete
} from '@element-plus/icons-vue'
import SourceTree from './component/sourceTree'
import TaskForm from './component/taskForm'
import TimeGridControl from '@/components/time-grid-control'
import BatchAddDialog from './component/batch-add-dialog'
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      // 摄像机 1  视频文件 2
      selectType: 1,
      selection: [],
      batchConfiguration: false,
      emptyImg: require('@/assets/img/common/analyze.png'),
      currentIndex: 0,
      submitLoading: false,
      batchForm: {
        sourceType: 1,
        content: undefined,
        taskName: undefined,
        streamType: undefined,
        analyzeMode: 1,
        recordStartTime: undefined,
        recordEndTime: undefined,
        algorithmIds: undefined,
        remark: undefined,
        recordTimeRange: [],
        amazingSpeed: 0,
        accessId: undefined
      },
      // 是否开启极速
      disabledConfig: false,
      algorithmAccessList: [],
      algorithmList: [],
      planType: 0,
      timeOperation: 0,
      timeSpanList: [],
      autoPlan: true,
      batchData: [],
      //批量操作接口
      batchApi: () => {},
      // 任务表单数据
      taskFormDataMap: new Map(),
      customErrorColumn: [
        {
          prop: 'taskName',
          label: this.$t('analysisTask.taskName'),
          minWidth: '130'
        }
      ],
      ElIconDelete
    }
  },
  components: {
    BatchAddDialog,
    SourceTree,
    TaskForm,
    TimeGridControl,
    ElIconInfo,
    ElIconArrowDown,
    ElIconArrowUp
  },
  name: 'CreateIntelligentAnalysisTask',
  watch: {
    // 监听算法类型，冲突影响是否开启极速分析
    algorithmType(newV) {
      if (!newV) {
        this.batchForm.amazingSpeed = 0
        this.disabledConfig = false
      } else if (newV !== 'FACE_RECOGNIZE' && newV !== 'VEHICLE_RECOGNIZE') {
        this.batchForm.amazingSpeed = 0 // 取消勾选
        this.disabledConfig = true // 置灰
      } else {
        this.disabledConfig = false
      }
    }
  },
  computed: {
    batchFormRules() {
      return {
        streamType: [
          {
            required: true,
            message: this.$t('analysisTask.streamTypeCantEmpty'),
            trigger: 'change'
          }
        ],
        recordTimeRange: [
          {
            required: this.batchForm.streamType === 2,
            message: this.$t('analysisTask.startTimeCantEmpty'),
            trigger: 'change'
          }
        ],
        algorithmIds: [
          {
            required: true,
            message: this.$t('analysisTask.seelctAlgo'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 256,
            message: this.$t('public.validate.charLimit', { num: 256 }),
            trigger: 'blur'
          }
        ],
        accessId: [
          {
            required: true,
            message: this.$t('algoTemplate.pleaseSelectplatform'),
            trigger: 'blur'
          }
        ]
      }
    },
    streamTypeList() {
      return [
        {
          name: this.$t('analysisTask.live'),
          value: 1
        },
        {
          name: this.$t('analysisTask.record'),
          value: 2
        }
      ]
    },
    // 选中的算法类型
    algorithmType() {
      return (
        this.algorithmList &&
        this.algorithmList.find(item => item.algorithmId === this.batchForm.algorithmIds) &&
        this.algorithmList.find(item => item.algorithmId === this.batchForm.algorithmIds)[
          'algorithmType'
        ]
      )
    },
    currentSelection() {
      return this.selection[this.currentIndex] || {}
    }
  },
  async created() {
    await this.getTenantAlgorithm()
  },
  mounted() {
    window.addEventListener('resize', this.initWrapperHeight)
    this.initWrapperHeight()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.initWrapperHeight)
  },
  methods: {
    goBack(confirm = false) {
      if (confirm) {
        this.$confirm(this.$t('analysisTask.cancelAddPrompt'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        })
          .then(() => {
            this.$router.back()
          })
          .catch(() => {})
      } else {
        this.$router.back()
      }
    },
    onTypeChange(value) {
      this.selectType = value
    },
    getChangedIds(currentList, oldList) {
      let idArr = []
      for (let i = 0; i < currentList.length; i++) {
        let item = currentList[i]
        let index = oldList.findIndex(sel => sel.id === item.id)
        if (index === -1) {
          idArr.push(item.id)
        }
      }
      return idArr
    },
    async onSelectionChange(val) {
      if (this.selection.length === 0) {
        this.selection = val
        this.currentIndex = 0
        this.taskFormDataMap.clear()
        for (let i = 0; i < val.length; i++) {
          this.taskFormDataMap.set(val[i].id, {})
        }
      } else {
        let currentId = this.currentSelection.id
        let nextIndex = val.findIndex(item => item.id === currentId)
        if (nextIndex === -1) {
          nextIndex = this.currentIndex
        }
        // 新选择的镜头
        let addedIdArr = this.getChangedIds(val, this.selection)
        // 删除的镜头
        let deletedIdArr = this.getChangedIds(this.selection, val)
        this.selection = val
        if (this.currentIndex !== nextIndex) {
          this.currentIndex = nextIndex
        }
        // 新增镜头设置表单数据
        for (let i = 0; i < addedIdArr.length; i++) {
          if (!this.taskFormDataMap.has(addedIdArr[i])) {
            this.taskFormDataMap.set(addedIdArr[i], {})
          }
        }
        // 删除镜头删除表单数据
        for (let i = 0; i < deletedIdArr.length; i++) {
          if (this.taskFormDataMap.has(deletedIdArr[i])) {
            this.taskFormDataMap.delete(deletedIdArr[i])
          }
        }
      }
    },
    selectionItemClick(index) {
      if (this.currentIndex === index) return
      // 保存当前表单
      const currentFormData = this.$refs.taskForm.getFormData()
      this.taskFormDataMap.set(this.currentSelection.id, currentFormData)
      this.currentIndex = index
    },
    async handleSubmitAdd() {
      if (!this.batchConfiguration) {
        await this.$refs.taskForm.handleSubmitAdd()
      } else {
        const valid = await this.$refs['batchForm'].validate().catch(err => err)
        if (valid !== true) {
          return false
        }
        let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
        if (timeSpanList.length === 0) {
          this.$message.error(`${this.$t('analysisTask.selectPeriodPrompt')}`)
          return false
        }
        let periodList = []
        if (this.$refs.timeGridControl) {
          for (let i = 0; i < timeSpanList.length; i++) {
            let item = timeSpanList[i]
            periodList.push({
              dayType: item.dayType,
              startTime: item.startTime.substring(0, 5),
              endTime: item.stopTime.substring(0, 5)
            })
          }
        }
        // 更新当前表单数据
        const currentFormData = this.$refs.taskForm.getFormData()
        this.taskFormDataMap.set(this.currentSelection.id, currentFormData)
        // 遍历taskFormDataMap
        for (const [key, value] of this.taskFormDataMap.entries()) {
          this.taskFormDataMap.set(key, {
            ...this.batchForm,
            ...value,
            periodList
          })
        }
        const validRes = this.validateBatchForm()
        if (!validRes) {
          return false
        }
        this.batchApi = this.$api.addNewTaskInfo
        this.batchData = validRes
        this.$nextTick(() => {
          this.$refs.batchOperation.batchOperation()
        })
      }
    },
    validateBatchForm() {
      let formList = []
      for (const [key, form] of this.taskFormDataMap.entries()) {
        const { presetList, minCarFrame, maxCarFrame, regionInfo } = form
        const select = this.selection.find(item => item.id === key)
        let cameraName = select.label
        // 校验预置位
        if (presetList?.length) {
          for (let i = 0; i < presetList.length; i++) {
            if (!presetList[i].presetIndex || !presetList[i].dwellTime || !presetList[i].speed) {
              this.$message.error(`${cameraName}-${this.$t('analysisTask.inputFullPreset')}`)
              return false
            }
          }
        }
        // 校验画线
        const templateRule = this.$refs.taskForm.templateRule
        if (templateRule.minTarget && templateRule.minTarget.status == 1) {
          if (!minCarFrame || !minCarFrame.criteria.area.some(item => item.type === 19)) {
            this.$message.error(`${cameraName}-${this.$t('analysisTask.setMinObjectPrompt')}`)
            return false
          }
        }
        if (templateRule.maxTarget && templateRule.maxTarget.status == 1) {
          if (!maxCarFrame || !maxCarFrame.criteria.area.some(item => item.type === 18)) {
            this.$message.warning(`${cameraName}-${this.$t('analysisTask.setMaxObjectPrompt')}`)
            return false
          }
        }
        if (templateRule.roi && templateRule.roi.status == 1) {
          if (!regionInfo || !regionInfo[0].criteria.area.some(item => item.type === 26)) {
            this.$message.error(`${cameraName}-${this.$t('algoTemplate.areaCannotEmpty')}`)
            return false
          }
        }
        if (templateRule.nRoi && templateRule.nRoi.status == 1) {
          if (!regionInfo || !regionInfo[0].criteria.area.some(item => item.type === 9)) {
            this.$message.error(`${cameraName}-${this.$t('algoTemplate.exclusionCannotEmpty')}`)
            return false
          }
        }
        if (templateRule.line && templateRule.line.status == 1) {
          if (!regionInfo || !regionInfo[0].criteria.area.some(item => item.type === 1)) {
            this.$message.error(`${cameraName}-${this.$t('algoTemplate.listOneLine')}`)
            return false
          }
        }
        const currForm = JSON.parse(JSON.stringify(form))
        let algorithmName = this.algorithmList.find(
          algo => algo.algorithmId === currForm.algorithmIds
        ).algorithmName
        currForm.taskName = `${cameraName}-${algorithmName}`
        currForm.content = key
        currForm.amazingSpeed = parseInt(currForm.amazingSpeed)
        currForm.enableExtractFeature = this.algorithmAccessList
          .filter(algorithm => algorithm.accessId === currForm.accessId)[0]
          .children.filter(
            item => item.algorithmId === currForm.algorithmIds
          )[0].enableExtractFeature
        formList.push(currForm)
        currForm.algorithmIds = [currForm.algorithmIds]
        delete currForm.accessId
        delete currForm.recordTimeRange
      }
      return formList
    },
    afterBatchOperate() {
      this.goBack()
    },
    streamTypeChange(val) {
      this.updateTaskForms('streamType', val)
      this.triggerTaskFormsMethod('streamTypeChange')
      if (val !== 2) {
        this.batchForm.recordTimeRange = []
        this.batchForm.recordStartTime = undefined
        this.batchForm.recordEndTime = undefined
        this.batchForm.amazingSpeed = '0'
      }
    },
    dateRangeChange(val) {
      this.batchForm.recordStartTime = val != null ? val[0] : undefined
      this.batchForm.recordEndTime = val != null ? val[1] : undefined
      this.updateTaskForms('recordTimeRange', val)
      this.triggerTaskFormsMethod('dateRangeChange', val)
    },
    handleAlgorithmIdsChange(val) {
      this.updateTaskForms('algorithmIds', val)
      this.triggerTaskFormsMethod('handleCheckedCitiesChange', val)
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
    resetForm() {
      this.batchForm = {
        sourceType: 1,
        content: undefined,
        taskName: undefined,
        streamType: undefined,
        analyzeMode: 1,
        recordStartTime: undefined,
        recordEndTime: undefined,
        algorithmIds: undefined,
        remark: undefined,
        recordTimeRange: [],
        amazingSpeed: 0,
        accessId: undefined
      }
      this.$refs.timeGridControl && this.$refs.timeGridControl.clearAll()
      this.$resetForm('batchForm')
    },
    handleBatchConfigChange(val) {
      if (val) {
        this.$nextTick(() => {
          this.$refs.timeGridControl.time_initialize(
            this.planType,
            this.timeOperation,
            this.timeSpanList
          )
        })
      } else {
        this.resetForm()
        let taskFormRefs = this.$refs.taskForm
        taskFormRefs.resetForm()
        this.taskFormDataMap.clear()
      }
    },
    updateTaskForms(key, val) {
      let taskFormRefs = this.$refs.taskForm
      if (key === 'taskName') {
        if (val) {
          taskFormRefs.form[key] = this.currentSelection.label
        } else {
          taskFormRefs.form[key] = undefined
        }
      } else {
        taskFormRefs.form[key] = val
      }
    },
    triggerTaskFormsMethod(method, params) {
      let taskFormRefs = this.$refs.taskForm
      taskFormRefs[method] && taskFormRefs[method](params)
    },
    // 查询当前租户拥有的算法
    async getTenantAlgorithm() {
      // 查询算法接入
      let res = await this.$api.getAlgorithmAccessList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode == 0) {
        this.algorithmAccessList = res.algorithmAccessList
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

        this.algorithmAccessList = this.algorithmAccessList?.map(item => {
          return {
            ...item,
            children: this.algorithmList
              .filter(algorithm => algorithm.accessId === item.accessId)
              .map(algorithm => {
                return {
                  ...algorithm,
                  enableExtractFeature: algorithm.extractFeature === 1 ? 1 : undefined
                }
              })
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
    initWrapperHeight() {
      let timer = setTimeout(() => {
        this.$nextTick(function () {
          let mainCenter = document.getElementById('main-center')
          this.$refs.addIntelligentAnalysisTask.style.height = mainCenter.clientHeight + 'px'
          clearTimeout(timer)
        })
      }, 20)
    }
  }
}
</script>

<style lang="scss">
@import './intelligentTask.scss';
</style>
