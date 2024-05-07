<template>
  <div class="task-form" v-loading="formLoading" :element-loading-text="$t('public.loading')">
    <el-form
      ref="taskForm"
      :model="form"
      :rules="formRules"
      :label-width="locale == 'en' ? '205px' : '120px'"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <p class="form-title">
        {{ $t('analysisTask.basicInfo') }}
      </p>
      <el-row class="form-row" :gutter="20">
        <el-col v-if="!batchConfig" :span="12">
          <el-form-item :label="$t('workOrder.ticketName') + '：'" prop="taskName">
            <el-input
              :placeholder="$t('workOrder.ticketNamePrompt')"
              v-model="form.taskName"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item :label="$t('analysisTask.streamType') + '：'" prop="streamType">
            <el-select
              clearable
              :popper-append-to-body="false"
              v-model="form.streamType"
              :placeholder="$t('analysisTask.selectStreamType')"
              @change="streamTypeChange"
              :disabled="batchConfig"
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
              v-model="form.recordTimeRange"
              type="datetimerange"
              clearable
              align="right"
              value-format="YYYY-MM-DD HH:mm:ss"
              :range-separator="$t('public.to')"
              :start-placeholder="$t('public.startTimePrompt')"
              :end-placeholder="$t('public.endTimePrompt')"
              @change="dateRangeChange"
              :disabled="batchConfig"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col v-if="form.streamType === 2" :span="12">
          <el-form-item class="no-margin-item" prop="amazingSpeed">
            <el-checkbox
              v-model="form.amazingSpeed"
              true-label="1"
              false-label="0"
              :disabled="batchConfig || disabledConfig"
            >
              {{ $t('analysisTask.amazingSpeed') }}
            </el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item class="no-margin-item" prop="analyzeMode">
            <el-checkbox
              v-model="form.analyzeMode"
              :true-label="1"
              :false-label="2"
              :disabled="batchConfig"
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
              clearable
              :popper-append-to-body="false"
              :placeholder="$t('algoTemplate.pleaseSelectplatform')"
              v-model="form.accessId"
              :disabled="batchConfig"
              @clear="
                () => {
                  disabledConfig = false
                  form.algorithmIds = ''
                }
              "
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
        <el-form-item
          class="no-margin-item"
          prop="algorithmIds"
          style="width: 100%"
          v-if="algorithmAccessList?.find(algorithm => algorithm.accessId === form.accessId)"
        >
          <el-radio-group
            class="algorithm_group"
            v-model="form.algorithmIds"
            @change="handleCheckedCitiesChange"
            :disabled="batchConfig"
          >
            <div
              v-for="algorithm in algorithmAccessList?.filter(
                algorithm => algorithm.accessId === form.accessId
              )[0].children"
              :key="algorithm.algorithmId"
            >
              <el-col v-if="algorithm.algorithmKey == 'BEHAVIOR3800'" :span="6">
                <el-radio class="algorithm-radio" :label="algorithm.algorithmId">
                  <span style="margin-right: 10px">{{ algorithm.algorithmName }}</span>
                  <el-checkbox
                    v-if="form.algorithmIds === algorithm.algorithmId && algorithm.extractFeature"
                    v-model="algorithm.enableExtractFeature"
                    :true-label="1"
                    :false-label="0"
                    :disabled="batchConfig"
                  >
                    {{ $t('analysisTask.extractFeature') }}
                  </el-checkbox>
                </el-radio>
              </el-col>
              <el-col v-if="algorithm.algorithmType != 'BEHAVIOR_RECOGNIZE'" :span="6">
                <el-radio class="algorithm-radio" :label="algorithm.algorithmId">
                  <span style="margin-right: 10px">{{ algorithm.algorithmName }}</span>
                  <el-checkbox
                    v-if="form.algorithmIds === algorithm.algorithmId && algorithm.extractFeature"
                    v-model="algorithm.enableExtractFeature"
                    :true-label="1"
                    :false-label="0"
                    :disabled="batchConfig"
                  >
                    {{ $t('analysisTask.extractFeature') }}
                  </el-checkbox>
                </el-radio>
              </el-col>
            </div>
          </el-radio-group>
          <div
            v-for="algorithm in algorithmAccessList?.filter(
              algorithm => algorithm.accessId === form.accessId
            )[0].children"
            :key="algorithm.algorithmId"
          >
            <div
              v-if="
                algorithm.algorithmKey == 'BEHAVIOR3800'
                  ? algorithm.algorithmId === form.algorithmIds
                  : false
              "
            >
              {{ $t('algoTemplate.selectRule') }}
            </div>
            <behavior-analysis
              v-if="
                algorithm.algorithmKey == 'BEHAVIOR3800'
                  ? algorithm.algorithmId === form.algorithmIds
                  : false
              "
              ref="behavior"
              :data="form"
              :url="coverUrl"
              @change="behaviorChange"
            />
            <vehicle-recognize
              v-if="
                (algorithm.algorithmKey != 'BEHAVIOR3800'
                  ? algorithm.algorithmId === form.algorithmIds
                  : false) && showDraw
              "
              ref="vehicleRecognize"
              :data="form"
              :templateRule2="templateRule"
              :url="coverUrl"
              @change="behaviorChange"
              @board-mounted="handleBoardMounted"
            />
          </div>
        </el-form-item>
        <!--计划时间设置-->
        <el-col v-if="!batchConfig" :span="24" style="margin-top: 10px">
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
        <el-col v-if="!batchConfig" :span="24">
          <div v-show="autoPlan" class="flex-aln">
            <el-radio-group v-model="planType" @change="planTypeChange">
              <el-radio :label="0">{{ $t('analysisTask.weekPlan') }}</el-radio>
              <el-radio :label="1">{{ $t('analysisTask.dayPlan') }}</el-radio>
            </el-radio-group>
            <el-link type="primary" :underline="false" class="clear" @click="handleFullPlan">
              {{ $t('analysisTask.fullPlan') }}
            </el-link>
            <el-link type="primary" :underline="false" class="clear" :icon="ElIconDelete">
              {{ $t('analysisTask.removeAll') }}
            </el-link>
          </div>
        </el-col>
        <el-col v-if="!batchConfig" :span="24">
          <el-collapse-transition>
            <div class="periodSetBox" v-show="autoPlan">
              <!-- 网格时间选择控件 -->
              <time-grid-control
                v-if="showTimeGridControl"
                ref="timeGridControl"
                id="time_grid_control"
              ></time-grid-control>
            </div>
          </el-collapse-transition>
        </el-col>
        <!--预置位设置-->
        <el-col v-if="ifCanSetPreset" :span="24">
          <el-form-item>
            <template #label>
              <div @click="presetConfiguration = !presetConfiguration" style="cursor: pointer">
                <span>
                  {{ $t('analysisTask.persetSet') }}
                </span>
                <el-icon v-if="presetConfiguration"><el-icon-arrow-down /></el-icon>
                <el-icon v-else><el-icon-arrow-up /></el-icon>
              </div>
            </template>
            <span v-if="presetTipVisible" class="preset-tip">
              {{ $t('analysisTask.presetWrong') }}
            </span>
          </el-form-item>
        </el-col>
        <el-col v-if="ifCanSetPreset" :span="24">
          <el-collapse-transition>
            <div class="presetSetBox" v-show="presetConfiguration">
              <div class="tableOperateBox">
                <el-link type="primary" :underline="false" :icon="ElIconPlus" @click="handleAdd">
                  {{ $t('analysisTask.add') }}
                </el-link>
                <el-link type="primary" :underline="false" :icon="ElIconDelete" @click="handleDel">
                  {{ $t('public.delete') }}
                </el-link>
                <el-link type="primary" :underline="false" :icon="ElIconTop" @click="handleMoveUp">
                  {{ $t('analysisTask.up') }}
                </el-link>
                <el-link
                  type="primary"
                  :underline="false"
                  :icon="ElIconBottom"
                  @click="handleMoveDown"
                >
                  {{ $t('analysisTask.down') }}
                </el-link>
              </div>
              <!-- 表格 -->
              <el-table
                v-loading="loading"
                :element-loading-text="$t('public.loading')"
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
                <el-table-column label width="50" type="selection" />
                <el-table-column :label="$t('analysisTask.preset')" min-width="90">
                  <template #default="{ row }">
                    <div @dblclick="presetDbClick(row)" style="width: 100%; height: 100%">
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
                    <div @dblclick="dwellTimeDbClick(row)" style="width: 100%; height: 100%">
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
                    <div @dblclick="speedDbClick(row)" style="width: 100%; height: 100%">
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
  </div>
</template>

<script>
import {
  InfoFilled as ElIconInfo,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp,
  Delete as ElIconDelete,
  Plus as ElIconPlus,
  Top as ElIconTop,
  Bottom as ElIconBottom
} from '@element-plus/icons-vue'
import TimeGridControl from '@/components/time-grid-control'
import BehaviorAnalysis from './behavior-analysis'
import VehicleRecognize from './vehicle-recognize'
import { mapState, mapActions } from 'vuex'
import { generateUuid } from '@/utils/common/utils'
import routeJump from '@/mixin/route-jump.js'
import { handleGetPreviewWss } from '@/utils/common/preViewImg' //路由跳转
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {
        sourceType: undefined,
        content: undefined,
        taskName: undefined,
        streamType: undefined,
        analyzeMode: 1,
        amazingSpeed: 0,
        recordStartTime: undefined,
        recordEndTime: undefined,
        algorithmIds: undefined,
        remark: undefined,
        recordTimeRange: [],
        accessId: undefined
      },
      // 是否开启极速
      disabledConfig: false,
      recordTimeRange: [],
      planType: 0,
      timeOperation: 0,
      timeSpanList: [],
      autoPlan: true,
      algorithmAccessList: [],
      algorithmList: [],
      presetConfiguration: false,
      presetTipVisible: false,
      ifCanSetPreset: false,
      presetArr: [],
      loading: false,
      tableData: [],
      multipleSelection: [],
      // 行为分析配置弹窗
      behaviorDialogVisible: false,
      // 车牌识别配置弹窗
      vehicleDialogVisible: false,
      formLoading: false,
      coverUrl: '',
      //算法平台
      platForm: '',
      selRules: [],
      showDraw: false,
      templateRule: {},
      buttonLoading: false,
      showTimeGridControl: false,
      ElIconDelete,
      ElIconPlus,
      ElIconTop,
      ElIconBottom
    }
  },
  components: {
    TimeGridControl,
    BehaviorAnalysis,
    VehicleRecognize,
    ElIconInfo,
    ElIconArrowDown,
    ElIconArrowUp
  },
  mixins: [routeJump],
  props: {
    type: {
      type: Number,
      default: 1
    },
    selection: {
      type: Array,
      default: () => []
    },
    currentIndex: {
      type: Number,
      default: 0
    },
    currentCamera: {
      type: Object,
      default: () => {}
    },
    formCache: {
      type: Map,
      default: () => new Map()
    },
    batchConfig: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState({
      algorithmTypeList: state => state.dict['algorithm-type']
    }),
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
        streamType: [
          {
            required: true,
            message: this.$t('analysisTask.streamTypeCantEmpty'),
            trigger: 'change'
          }
        ],
        recordTimeRange: [
          {
            required: this.form.streamType === 2,
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
        this.algorithmList.find(item => item.algorithmId === this.form.algorithmIds) &&
        this.algorithmList.find(item => item.algorithmId === this.form.algorithmIds)[
          'algorithmType'
        ]
      )
    }
  },
  watch: {
    // 监听算法类型，冲突影响是否开启极速分析
    algorithmType(newV) {
      if (!newV) {
        this.form.amazingSpeed = 0
        this.disabledConfig = false
      } else if (newV !== 'FACE_RECOGNIZE' && newV !== 'VEHICLE_RECOGNIZE') {
        this.form.amazingSpeed = 0 // 取消勾选
        this.disabledConfig = true // 置灰
      } else {
        this.disabledConfig = false
      }
    },
    currentCamera: {
      handler(newV, oldV) {
        if (!this.$loadash.isEqual(newV, oldV)) {
          this.$nextTick(() => {
            this.currentCameraChange(newV)
          })
        }
      },
      immediate: true
    }
  },
  created() {
    this.getDictionary()
    this.getTenantAlgorithm()
  },
  methods: {
    async handleCheckedCitiesChange(value) {
      this.showDraw = false
      let arr = this.algorithmAccessList?.find(
        algorithm => algorithm.accessId === this.form.accessId
      )
      for (const element of arr.children) {
        if (element.algorithmId == value) {
          if (element.algorithmKey == 'BEHAVIOR3800') {
            this.showDraw = true
            continue
          } else {
            let res = await this.$api.searchAlgorithmRuleByAlgorithm({
              algorithmId: value
            })
            if (!res.info) {
              this.showDraw = false
              this.$confirm(
                this.$t('algoTemplate.pleaseTemplateConfiguration'),
                this.$t('gis.prompt'),
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
                .catch(() => {
                  this.form.algorithmIds = ''
                })
            } else {
              this.templateRule = res.info
              this.showDraw = true
            }
          }
        }
      }
      if (this.form.extendsData) {
        delete this.form.extendsData
      }
      if (this.form.regionInfo) {
        delete this.form.regionInfo
      }
      if (this.form.minCarFrame) {
        delete this.form.minCarFrame
      }
      if (this.form.maxCarFrame) {
        delete this.form.maxCarFrame
      }
    },
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDictionary() {
      this.getSysDictData(['algorithm-type'])
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
    streamTypeChange(val) {
      if (val !== 2) {
        this.form.recordTimeRange = []
        this.form.recordStartTime = undefined
        this.form.recordEndTime = undefined
        this.form.amazingSpeed = '0'
      }
    },
    dateRangeChange(val) {
      this.form.recordStartTime = val != null ? val[0] : undefined
      this.form.recordEndTime = val != null ? val[1] : undefined
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
    async currentCameraChange(camera) {
      let { deviceId: cameraId, type: deviceType } = camera.payload
      this.formLoading = true
      // 表单缓存回显
      let currentFormCache = JSON.parse(JSON.stringify(this.formCache.get(cameraId) || {}))
      if (this.batchConfig) {
        currentFormCache = {
          ...currentFormCache,
          ...this.$parent.$parent.$parent.batchForm
        }
      }
      let { periodList, presetList, accessId, algorithmIds } = currentFormCache
      periodList && delete currentFormCache.periodList
      presetList && delete currentFormCache.presetList
      // 算法改变获取算法规则
      if (algorithmIds) {
        // handleCheckedCitiesChange 依赖于cameraId & accessId 先赋值
        this.form.content = cameraId
        this.form.accessId = accessId
        await this.handleCheckedCitiesChange(algorithmIds)
      }
      this.resetForm()
      this.form = { ...this.form, ...currentFormCache }
      if (this.type === 1) {
        this.form.sourceType = 1
        this.form.content = cameraId
        // 摄像机
        this.presetTipVisible = false
        this.presetConfiguration = false
        this.ifCanSetPreset = false

        if (deviceType === 1) {
          await this.getPresetList()
        } else if (deviceType === 5) {
          this.presetArr = []
          this.ifCanSetPreset = false
          this.presetTipVisible = false
        }
        // 回显预置位设置
        if (presetList?.length) {
          this.tableData = presetList.map(item => {
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
        } else {
          this.tableData = []
        }
      }
      // 回显任务计划
      if (!this.batchConfig) {
        this.showTimeGridControl = false
        await this.$nextTick()
        this.showTimeGridControl = true
        await this.$nextTick()
        if (periodList?.length) {
          this.timeSpanList = periodList.map(item => {
            return {
              dayType: item.dayType,
              startTime: item.startTime + ':00',
              stopTime: item.endTime + ':59'
            }
          })
          this.planType = periodList[0].dayType === 0 ? 1 : 0
        } else {
          this.timeSpanList = []
          this.planType = 0
        }
        this.$refs.timeGridControl.time_initialize(
          this.planType,
          this.timeSpanList.length ? 2 : 0,
          this.timeSpanList
        )
      } else {
        this.showTimeGridControl = false
      }

      this.formLoading = false
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
    async getPresetList() {
      let res = await this.$api.getCameraInfo({ cameraId: this.form.content })
      if (res && res.resultCode == 0) {
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
    // 行为分析配置变更
    behaviorChange(form) {
      this.form = Object.assign({}, this.form, form)
    },
    handleBoardMounted() {
      this.$nextTick(() => {
        if (this.$refs.vehicleRecognize && this.$refs.vehicleRecognize.length > 0) {
          this.$refs.vehicleRecognize[0].reLoadCanvas()
        }
      })
    },
    async handleSubmitAdd() {
      const valid = await this.$refs['taskForm'].validate().catch(err => err)
      if (valid === true) {
        // 校验周期
        let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
        if (timeSpanList.length === 0) {
          this.$message.error(`${this.$t('analysisTask.selectPeriodPrompt')}`)
          return false
        }
        // 校验预置位
        if (this.tableData.length) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (
              !this.tableData[i].presetIndex ||
              !this.tableData[i].dwellTime ||
              !this.tableData[i].speed
            ) {
              this.$message.error(`${this.$t('analysisTask.inputFullPreset')}`)
              return false
            }
          }
        }
        let algorithm = this.algorithmList?.find(
          item => item.algorithmId === this.form.algorithmIds
        )
        if (
          algorithm.algorithmType === 'BEHAVIOR_RECOGNIZE' &&
          this.$refs.behavior[0].selRules.length == 0
        ) {
          this.$message.error(this.$t('algoTemplate.selectRule'))
          return false
        }
        // 校验算法配置
        if (this.$refs.behavior && this.$refs.behavior.length != 0) {
          this.$refs.behavior[0].submitForm()
          if (this.$refs.behavior[0].isShowMessage) {
            return false
          }
        }
        if (this.$refs.vehicleRecognize && this.$refs.vehicleRecognize.length != 0) {
          this.$refs.vehicleRecognize[0].submitForm()
          if (this.$refs.vehicleRecognize[0].isShowMessage) {
            return false
          }
        }

        //判断接入在离线
        let ifAccessOffline = false
        let access = this.algorithmAccessList.find(item => {
          return (
            item.children.findIndex(
              algorithm => algorithm.algorithmId === this.form.algorithmIds
            ) !== -1
          )
        })
        if (access?.status === 2) {
          ifAccessOffline = true
        }

        let data = JSON.parse(JSON.stringify(this.form))
        delete data.accessId
        delete data.recordTimeRange
        data.amazingSpeed = parseInt(this.form.amazingSpeed)
        data.algorithmIds = [data.algorithmIds]
        data.enableExtractFeature = this.algorithmAccessList
          .filter(algorithm => algorithm.accessId === this.form.accessId)[0]
          .children.filter(
            item => item.algorithmId === this.form.algorithmIds
          )[0].enableExtractFeature
        if (this.tableData.length) {
          let presetList = []
          for (let i = 0; i < this.tableData.length; i++) {
            presetList.push({
              presetIndex: this.tableData[i].presetIndex,
              dwellTime: Number(this.tableData[i].dwellTime),
              speed: Number(this.tableData[i].speed)
            })
          }
          data.presetList = presetList
        }

        let periodList = []
        for (let i = 0; i < timeSpanList.length; i++) {
          let item = timeSpanList[i]
          periodList.push({
            dayType: item.dayType,
            startTime: item.startTime.substring(0, 5),
            endTime: item.stopTime.substring(0, 5)
          })
        }
        data.periodList = periodList
        this.buttonLoading = true
        //判断接入在离线
        if (ifAccessOffline) {
          try {
            await this.$confirm(
              this.$t('analysisTask.selectAlgoOfflineAdd'),
              this.$t('public.prompt'),
              {
                confirmButtonText: this.$t('public.confirm'),
                cancelButtonText: this.$t('public.cancel'),
                type: 'warning'
              }
            )
            const res = await this.$api.addNewTaskInfo(data)
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.addSuccess')
              })
              this.$parent.$parent.$parent.goBack()
            }
            this.buttonLoading = false
          } catch {
            this.$message({
              type: 'info',
              message: this.$t('analysisTask.addCanceled')
            })
            return false
          }
        } else {
          // 添加
          const res = await this.$api.addNewTaskInfo(data)
          if (res.resultCode === 0) {
            this.$message({
              type: 'success',
              message: this.$t('public.addSuccess')
            })
            this.$parent.$parent.$parent.goBack()
          }
          this.buttonLoading = false
        }
      } else {
        return false
      }
    },
    resetForm() {
      this.form = {
        sourceType: undefined,
        content: this.form.content,
        taskName: undefined,
        streamType: undefined,
        analyzeMode: 1,
        amazingSpeed: 0,
        recordStartTime: undefined,
        recordEndTime: undefined,
        algorithmIds: undefined,
        remark: undefined,
        recordTimeRange: [],
        accessId: undefined
      }
      this.$refs.timeGridControl && this.$refs.timeGridControl.clearAll()
      this.tableData = []
      this.$resetForm('taskForm')
    },
    getFormData() {
      // 更新划线数据
      if (this.$refs.vehicleRecognize && this.$refs.vehicleRecognize.length != 0) {
        this.$refs.vehicleRecognize[0].updateForm()
      }
      let data = JSON.parse(JSON.stringify(this.form))
      // 获取任务计划
      let timeSpanList = [],
        periodList = []
      if (this.$refs.timeGridControl) {
        timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
        for (let i = 0; i < timeSpanList.length; i++) {
          let item = timeSpanList[i]
          periodList.push({
            dayType: item.dayType,
            startTime: item.startTime.substring(0, 5),
            endTime: item.stopTime.substring(0, 5)
          })
        }
      }
      periodList.length && (data.periodList = periodList)
      // 获取预置位
      let presetList = []
      if (this.tableData.length) {
        for (let i = 0; i < this.tableData.length; i++) {
          presetList.push({
            presetIndex: this.tableData[i].presetIndex,
            dwellTime: Number(this.tableData[i].dwellTime),
            speed: Number(this.tableData[i].speed)
          })
        }
      }
      presetList.length && (data.presetList = presetList)
      return data
    }
  }
}
</script>
