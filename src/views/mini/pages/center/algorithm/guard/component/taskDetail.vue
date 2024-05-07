<template>
  <div v-if="isRouterAlive" id="NewTaskDetail" ref="taskDetail">
    <el-page-header @back="goBack" :content="$t('algoGuard.detailsTask')"></el-page-header>
    <el-row class="totalInfo">
      <el-col :span="8" class="total">
        <span>{{ $t('algoGuard.totalAlarmCount') }}</span>
        <p>{{ totalInfo.totalAlarmCount }}</p>
      </el-col>
      <el-col :span="8" class="total">
        <span>{{ $t('algoGuard.todayAlarmCount') }}</span>
        <p>{{ totalInfo.todayAlarmCount }}</p>
      </el-col>
      <el-col :span="8" class="total">
        <span>{{ $t('algoGuard.controlDays') }}</span>
        <p>{{ totalInfo.controlDays }}</p>
      </el-col>
    </el-row>

    <el-row>
      <el-form
        ref="form"
        :model="form"
        size="small"
        label-position="left"
        :label-width="locale == 'en' ? '150px' : '120px'"
      >
        <div
          style="display: flex; padding: 0px 0px; margin-top: 20px; flex-wrap: wrap"
          class="form-flex"
        >
          <div class="divmar">
            <el-form-item :label="$t('algoGuard.taskID') + '：'">
              <span>{{ form.guardId }}</span>
              <el-button class="blueSpan ml10" link @click="copyValue(form.guardId)">
                {{ $t('frontParameterConfiguration.copy') }}
              </el-button>
            </el-form-item>
          </div>
          <div class="divmar">
            <el-form-item :label="$t('algoGuard.guardType') + '：'">
              <span>{{ setGuardType(form.guardType) }}</span>
            </el-form-item>
          </div>
          <div class="divmar">
            <el-form-item :label="$t('algoGuard.guardSource') + '：'">
              <span v-if="form.sourceType === 3">{{ $t('algoGuard.territorialDefence') }}</span>
              <el-popover v-else placement="bottom" trigger="hover">
                <ul>
                  <li v-show="form.sourceType == 1">{{ $t('algoGuard.devName') }}：</li>
                  <li v-show="form.sourceType == 2">{{ $t('algoGuard.taskName') }}：</li>
                  <li v-for="(item, index) in form.sourceList" :key="index">
                    {{ item.sourceName }}
                  </li>
                </ul>
                <template #reference>
                  <span class="blueSpan">
                    {{ form.sourceName }}
                    <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                  </span>
                </template>
              </el-popover>
            </el-form-item>
            <el-form-item :label="$t('algoGuard.guardAlgo') + '：'" v-if="form.sourceType == 2">
              <el-popover placement="bottom" width="350" trigger="hover">
                <ul>
                  <li>{{ $t('algoGuard.algoID') }}：{{ algoInfo.algorithmId }}</li>
                  <li>{{ $t('algoGuard.algoName') }}：{{ algoInfo.algorithmName }}</li>
                  <li>{{ $t('algoGuard.accessID') }}：{{ algoInfo.accessId }}</li>
                  <li>{{ $t('algoGuard.modelID') }}：{{ algoInfo.modelId }}</li>
                  <li>{{ $t('algoGuard.maxChannel') }}：{{ algoInfo.maxChannel }}</li>
                </ul>
                <template #reference>
                  <span class="blueSpan" @mouseenter="showAlgoInfo">
                    {{ form.algorithmName }}
                  </span>
                </template>
              </el-popover>
            </el-form-item>
          </div>
          <div class="divmar" v-for="(item, index) in tableData" :key="index">
            <el-form-item
              :label="item.key + '：'"
              v-if="
                item.key !== $t('algoGuard.guardLib') && item.key !== $t('algoGuard.runningPeriod')
              "
            >
              <el-tooltip :content="item.value" popper-class="guardFormTooltip" placement="bottom">
                <span class="inline-block w-full truncate">{{ item.value }}</span>
              </el-tooltip>
            </el-form-item>
            <el-form-item
              :label="item.key + '：'"
              v-if="item.key == $t('algoGuard.guardLib') && item.value && item.value.length != 0"
            >
              <el-dropdown trigger="hover" class="engOverWidthStyle">
                <span class="el-dropdown-link dropStyle">
                  <span>
                    {{ item.value[0].repositoryName }}
                  </span>
                  <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu class="truncate">
                    <el-dropdown-item v-for="(item, index) in item.value" :key="index">
                      <span
                        style="
                          white-space: normal;
                          display: inline-block;
                          width: 100%;
                          word-break: break-word;
                        "
                      >
                        {{ item.repositoryName }}
                      </span>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>
            <el-form-item :label="item.key + '：'" v-if="item.key == $t('algoGuard.runningPeriod')">
              <el-dropdown trigger="hover">
                <span
                  class="el-dropdown-link"
                  style="width: 100%; display: block; word-wrap: break-word; word-break: normal"
                >
                  {{ item.value[0] ? item.value[0].dayType : '' }}
                  {{ item.value[0] ? item.value[0].time : '' }}
                  <el-icon class="el-icon--right"><el-icon-arrow-down /></el-icon>
                </span>
                <template #dropdown>
                  <el-dropdown-menu
                    style="max-width: 400px; word-wrap: break-word; word-break: normal"
                  >
                    <el-dropdown-item v-for="(item, index) in item.value" :key="index">
                      {{ item.dayType }} {{ item.time }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div style="margin-top: 20px" class="date-picker-wrapper">
        <el-date-picker
          style="margin-bottom: 10px"
          v-model="dateValue"
          type="datetimerange"
          popper-class="data-picker"
          :range-separator="$t('public.to')"
          :start-placeholder="$t('public.startTimePrompt')"
          :end-placeholder="$t('public.endTimePrompt')"
          @change="dateChange"
        ></el-date-picker>
        <el-button type="primary" class="miniBtn" @click="searchHit">
          {{ $t('public.search') }}
        </el-button>
      </div>
      <!-- 表格 -->
      <el-table ref="hitTable" :data="hitTableData" style="width: 100%" border max-height="440">
        <el-table-column :label="$t('algoGuard.alarmTime')" min-width="120" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.hitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('algoGuard.alarmType')" min-width="90" show-overflow-tooltip>
          <template #default="{ row }">
            {{ locale == 'en' ? row.alarmTypeEnName : row.alarmType }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('algoGuard.alarmLevel')" min-width="65" show-overflow-tooltip>
          <template #default="{ row }">
            <span :style="styleObj(row.alarmLevel, 'color')">
              {{ locale == 'en' ? row.alarmLevelEnName : row.alarmLevelName }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('algoGuard.hitLib')" min-width="80" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.repositoryName }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('algoGuard.hitObj')" min-width="80" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.personName || row.lpn }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('algoGuard.similarity')" min-width="65" show-overflow-tooltip>
          <template #default="{ row }">
            <span>{{ row.similarity }}</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span class="cell-operate" @click="showSnapImg(row)">
              {{ $t('algoGuard.viewMetadata') }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <div class="pagination" style="width:100%">
        <div class="paging">
          <span>{{ $t('public.everyPageShows') }}</span>
          <el-select v-model="number_h" @change="numberChange_h">
            <el-option
              v-for="(item, index) in numberList_h"
              :key="index"
              :label="item"
              :value="index"
            ></el-option>
          </el-select>
          <span>{{ $t('public.records') }}</span>
        </div>
        <div>
          <el-pagination
            v-model:current-page="pageNum_h"
            :page-size="pageSize_h"
            layout="total, prev, pager, next, jumper"
            :total="totalNum_h"
            @current-change="handleCurrentChange_h"
            background
          />
        </div>
      </div>

      <div v-show="activeName == 'perform'">
        <el-table ref="performTable" :data="performTableData" style="width: 100%" border>
          <el-table-column
            :label="$t('algoGuard.executeTime')"
            min-width="120"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span v-if="row.startTime.substring(0, 10) == row.endTime.substring(0, 10)">
                {{ row.startTime }} ~
                {{ row.endTime.substring(11) }}
              </span>
              <span v-else>{{ row.startTime }} ~ {{ row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('algoGuard.executeStatus')"
            min-width="90"
            show-overflow-tooltip
          >
            <template #default="{ row }">
              <span>{{ row.status }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('public.operating')">
            <template #default="{ row }">
              <span class="cell-operate" @click="showJsonMessage(row)">
                {{ $t('algoGuard.executeInfo') }}
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!--分页-->
        <div class="pagination">
          <div class="paging">
            <span>{{ $t('public.everyPageShows') }}</span>
            <el-select v-model="number_p" @change="numberChange_p">
              <el-option
                v-for="(item, index) in numberList_p"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <span>{{ $t('public.records') }}</span>
          </div>
          <div>
            <el-pagination
              v-model:current-page="pageNum_p"
              :page-size="pageSize_p"
              layout="total, prev, pager, next, jumper"
              :total="totalNum_p"
              @current-change="handleCurrentChange_p"
              background
            />
          </div>
        </div>
      </div>
    </el-row>

    <el-dialog
      :title="$t('algoGuard.snapImg')"
      v-model="snapImgDialogVisible"
      top="16vh"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      width="600px"
      class="snapDialog"
    >
      <img :src="snapImgUrl" style="width: 100%; height: 338px" />
    </el-dialog>

    <el-dialog
      :title="$t('algoGuard.executeInfo')"
      v-model="jsonVisible"
      top="16vh"
      :close-on-click-modal="false"
      :modal="false"
      draggable
      width="600px"
      class="snapDialog"
    >
      <p>{{ jsonMessage }}</p>
    </el-dialog>

    <!-- 命中元数据 -->
    <guard-alarm-detail v-model:visible="detailDialogVisible" />
  </div>
</template>

<script>
import Clipboard from 'vue-clipboard3'
import { ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { getFormatDate } from '@/utils/common/mutil'
import GuardAlarmDetail from '../../alarm/component/guard-alarm-detail'
import { handleGetPreview } from '@/utils/common/preViewImg'
import { sStorage } from '@/utils/common/store'
import { mapState } from 'vuex'
export default {
  components: {
    GuardAlarmDetail,
    ElIconArrowDown
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      totalInfo: {
        totalAlarmCount: 0,
        todayAlarmCount: 0,
        controlDays: 0
      },
      form: {
        guardId: '',
        guardName: '',
        guardType: '',
        algorithmId: '',
        alarmType: [],
        //公共
        repositoryIds: [],
        threshold: 50,
        validDateBegin: '',
        validDateEnd: '',
        remark: '',
        sourceType: '',
        sourceId: '',
        sourceName: '',
        algorithmName: ''
      },
      isRouterAlive: true,
      //来源类型
      sourceTypeList: [],
      ptzTypeData: [],
      cameraInfo: {
        cameraId: '',
        cameraName: '',
        ptzType: '',
        platName: '',
        status: ''
      },
      taskInfo: {
        taskId: '',
        taskName: '',
        taskType: '',
        taskState: ''
      },
      algoInfo: {
        cameraId: '',
        cameraName: '',
        ptzType: '',
        platName: '',
        status: ''
      },
      guardTypeList: [],
      activeName: 'info',
      tableData: [],
      dayTypeList: [],
      statusList: [],
      // 布控命中
      dateValue: '',
      validDateBegin: '',
      validDateEnd: '',
      hitTableData: [],
      number_h: 0,
      //每页显示数量
      numberList_h: [10, 20, 30, 40, 50, 100, 500],
      pageNum_h: 1,
      pageSize_h: 10,
      // 总数量
      totalNum_h: 0,
      snapImgUrl: '',
      snapImgDialogVisible: false,
      // 任务执行情况
      performTableData: [
        {
          startTime: '2021-09-21 11:22:33',
          endTime: '2021-09-22 12:22:33',
          message: { fff: 'fff' }
        }
      ],
      number_p: 0,
      //每页显示数量
      numberList_p: [10, 20, 30, 40, 50, 100, 500],
      pageNum_p: 1,
      pageSize_p: 10,
      // 总数量
      totalNum_p: 0,
      jsonMessage: '',
      jsonVisible: false,
      //命中元数据
      dataForm: {},
      //元数据弹框
      detailDialogVisible: false,
      choosedGuardId: '',
      rulesFather: [],
      alarmLevelList: [],
      dayjs
    }
  },
  name: 'GuardTaskDetail',
  created() {
    this.choosedGuardId = this.$route.params.id
  },
  async mounted() {
    this.setDate()
    this.getDictionary()
    this.getAlarmLevel()
    this.getGuardInfo()
  },
  computed: {
    ...mapState({
      analysisTaskStatus: state => state.dict['analysis_task_status'] // 智能分析任务状态
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  methods: {
    async copyValue(info) {
      const { toClipboard } = Clipboard()
      try {
        await toClipboard(info)
        this.$message({
          type: 'success',
          message: this.$t('frontParameterConfiguration.copySucc')
        })
      } catch (e) {}
    },
    styleObj(alarmLevelId, property) {
      let currLevel = this.alarmLevelList.find(item => item.alarmLevelId === alarmLevelId)
      if (property === 'background') {
        return {
          background: currLevel?.color || 'initial',
          borderColor: currLevel?.color || 'initial'
        }
      } else {
        return {
          color: currLevel?.color || 'initial'
        }
      }
    },
    getAlarmLevel() {
      this.$api.getAlarmLevelList().then(res => {
        if (res.alarmLevelList) {
          this.alarmLevelList = res.alarmLevelList
        }
      })
    },
    goBack() {
      this.$router.back()
    },
    setDate() {
      this.sourceTypeList = [
        {
          name: this.$t('algoGuard.camera'),
          value: 1
        },
        {
          name: this.$t('algoGuard.rtmp'),
          value: 2
        }
      ]
      this.guardTypeList = [
        {
          name: this.$t('algoGuard.manListGuard'),
          value: 1
        },
        {
          name: this.$t('algoGuard.carListGuard'),
          value: 2
        },
        {
          name: this.$t('algoGuard.customGuard'),
          value: 3
        }
      ]
      this.tableData = [
        { key: this.$t('algoGuard.taskName'), value: '1' },
        { key: this.$t('algoGuard.taskStatus'), value: '2' },
        { key: this.$t('algoGuard.guardLib'), value: '4' },
        { key: this.$t('algoGuard.threshold'), value: '5' },
        { key: this.$t('algoGuard.guardTime'), value: '6' },
        { key: this.$t('algoGuard.runningPeriod'), value: '7' },
        { key: this.$t('algoGuard.alarmName'), value: '8' },
        { key: this.$t('algoGuard.hitType'), value: '11' },
        { key: this.$t('algoGuard.addTime'), value: '9' },
        { key: this.$t('algoGuard.taskRemark'), value: '10' }
      ]
      this.sourceTypeList = [
        {
          name: this.$t('algoGuard.targetDev'),
          value: 1
        },
        {
          name: this.$t('algoGuard.analysisTask1'),
          value: 2
        }
      ]
      this.dayTypeList = [
        {
          name: this.$t('algoGuard.Monday'),
          value: 1
        },
        {
          name: this.$t('algoGuard.Tuesday'),
          value: 2
        },
        {
          name: this.$t('algoGuard.Wednesday'),
          value: 3
        },
        {
          name: this.$t('algoGuard.Thursday'),
          value: 4
        },
        {
          name: this.$t('algoGuard.Friday'),
          value: 5
        },
        {
          name: this.$t('algoGuard.Saturday'),
          value: 6
        },
        {
          name: this.$t('algoGuard.Sunday'),
          value: 7
        }
      ]
      this.statusList = [
        {
          name: this.$t('algoGuard.waitingForRun'),
          value: 0
        },
        {
          name: this.$t('algoGuard.running'),
          value: 1
        }
      ]
    },
    setSourceType(val) {
      if (val) {
        this.sourceTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setState(val) {
      return this.selectDictLabel(this.analysisTaskStatus, val, {
        key: 'name',
        value: 'code'
      })
    },
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    setCameraState(val) {
      let name = ''
      if (val == 0) {
        name = this.$t('public.statustype0')
      } else if (val == 1) {
        name = this.$t('public.statustype1')
      } else if (val == 2) {
        name = this.$t('public.statustype2')
      } else if (val == 3) {
        name = this.$t('public.statustype3')
      }
      return name
    },
    setPtzType(val) {
      let name = ''
      this.ptzTypeData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setStatus(val) {
      this.statusList.map(item => {
        if (val == item.value) {
          val = item.name
        }
      })
      return val
    },
    // 字典查询
    async getDictionary() {
      await this.$api.getDictionary({ type: 'device-type' }).then(res => {
        if (res.dictionaryList) {
          this.ptzTypeData = res.dictionaryList
        }
      })
    },
    async getGuardInfo() {
      let guardId = this.$route.params.id
      let res = await this.$api.getNewGuardInfo({ guardId: guardId })
      if (res.resultCode == 0) {
        this.totalInfo = {
          totalAlarmCount: res.totalAlarmCount || 0,
          todayAlarmCount: res.todayAlarmCount || 0,
          controlDays: res.controlDays || 0
        }
        this.form = {
          guardId: res.guardId,
          guardType: this.setGuardType(res.guardType),
          sourceList: res.sourceList,
          sourceId: res.sourceList ? res.sourceList[0].sourceId : '',
          sourceName: res.sourceList ? res.sourceList[0].sourceName : '',
          sourceType: res.sourceList ? res.sourceList[0].sourceType : res.sourceType,
          algorithmId: res.algorithmId,
          algorithmName: res.algorithmName
        }

        let dayList = this.getDayList(res.periods)
        if (res.periods[0].dayType == 0) {
          this.planType = 1
        } else {
          this.planType = 0
        }

        this.tableData = [
          { key: this.$t('algoGuard.taskName'), value: res.guardName },
          { key: this.$t('algoGuard.taskStatus'), value: this.setStatus(res.status) },
          { key: this.$t('algoGuard.guardLib'), value: res.repositoryList },
          { key: this.$t('algoGuard.threshold'), value: res.threshold },
          {
            key: this.$t('algoGuard.guardTime'),
            value:
              res.beginTime.substring(0, 10) == res.endTime.substring(0, 10)
                ? res.beginTime + '~' + res.endTime.substring(11)
                : res.beginTime + '~' + res.endTime
          },
          { key: this.$t('algoGuard.runningPeriod'), value: dayList },
          { key: this.$t('algoGuard.alarmName'), value: res.alarmName },
          {
            key: this.$t('algoGuard.hitType'),
            value:
              res.hited == 1
                ? this.$t('algoGuard.hitType1')
                : res.hited == 2
                ? this.$t('algoGuard.hitType2')
                : ''
          },
          { key: this.$t('algoGuard.addTime'), value: res.createTime },
          { key: this.$t('algoGuard.taskRemark'), value: res.remark }
        ]
        this.rulesFather = res.rules

        let compareOnj = {
          '>': this.$t('algoGuard.greater'),
          '&gt;': this.$t('algoGuard.greater'),
          '>=': this.$t('algoGuard.greaterEqual'),
          '&gt;=': this.$t('algoGuard.greaterEqual'),
          '<': this.$t('algoGuard.lessThan'),
          '&lt;': this.$t('algoGuard.lessThan'),
          '<=': this.$t('algoGuard.lessEqual'),
          '&lt;=': this.$t('algoGuard.lessEqual'),
          '==': this.$t('algoGuard.equal'),
          '!=': this.$t('algoGuard.notEqual'),
          in: this.$t('algoGuard.contain'),
          between: this.$t('algoGuard.between'),
          like: this.$t('algoGuard.like')
        }
        this.rulesFather.forEach(item => {
          item.compares = compareOnj[item.compare]
          item.remark = item.propertySpecsName
            ? item.propertySpecsName + '-' + item.value
            : item.value
        })
      }

      //命中
      let _params = {
        guardIds: [this.$route.params.id],
        pageInfo: { pageNum: this.pageNum_h, pageSize: this.pageSize_h }
      }
      let res_h = await this.$api.getGuardHitList(_params)
      if (res_h.resultCode == 0) {
        this.hitTableData = res_h.guardHitList?.map(item => {
          item.previewCaptureImage = handleGetPreview(item.captureImage)
          item.previewDetectImage = handleGetPreview(item.detectImage)
          item.previewVehiclePhoto = handleGetPreview(item.vehiclePhoto)
          item.previewFacePhoto = handleGetPreview(item.facePhoto)
          return item
        })
        this.totalNum_h = res_h.pageInfo.totalNum
      }
    },
    setGuardType(val) {
      if (val) {
        this.guardTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    showSourceInfo() {
      if (this.form.sourceType == 1) {
        this.$api.getCameraInfo({ cameraId: this.form.sourceId }).then(res => {
          if (res.resultCode == 0) {
            this.cameraInfo = {
              cameraId: res.cameraBaseInfo.cameraId,
              cameraName: res.cameraBaseInfo.cameraName,
              ptzType: res.cameraBaseInfo.ptzType,
              platName: res.platInfo.platName,
              status: res.cameraMaintainInfo.status
            }
          }
        })
      } else if (this.form.sourceType == 2) {
        this.$api.getNewTaskInfo({ taskId: this.form.sourceId }).then(res => {
          if (res.resultCode == 0) {
            this.taskInfo = res
          }
        })
      }
    },
    showAlgoInfo() {
      this.$api
        .getNewAlgorithmInfo({
          algorithmId: this.form.algorithmId,
          netType: this.$getNetType()
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.algoInfo = res
          }
        })
    },

    // 编辑弹框
    showEditDialog() {},

    // 布控命中--------
    showSnapImg(row) {
      this.dataForm = JSON.parse(JSON.stringify(row))
      this.detailDialogVisible = true
    },
    dateChange(val) {
      if (val) {
        this.validDateBegin = getFormatDate(val[0])
        this.validDateEnd = getFormatDate(val[1])
      } else {
        this.validDateBegin = ''
        this.validDateEnd = ''
      }
    },
    getList_h() {
      let _params = {
        guardIds: [this.$route.params.id],
        beginTime: this.validDateBegin,
        endTime: this.validDateEnd,
        pageInfo: { pageNum: this.pageNum_h, pageSize: this.pageSize_h }
      }
      this.$api.getGuardHitList(_params).then(res => {
        if (res.resultCode == 0) {
          this.hitTableData = res.guardHitList?.map(item => {
            item.previewCaptureImage = handleGetPreview(item.captureImage)
            item.previewDetectImage = handleGetPreview(item.detectImage)
            item.previewVehiclePhoto = handleGetPreview(item.vehiclePhoto)
            item.previewFacePhoto = handleGetPreview(item.facePhoto)
            return item
          })
          this.totalNum_h = res.pageInfo.totalNum
        } else {
          this.hitTableData = []
          this.totalNum_h = 0
        }
      })
    },
    searchHit() {
      this.pageNum_h = 1
      this.getList_h()
    },
    numberChange_h(val) {
      this.pageSize_h = this.numberList_h[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum_h < this.pageSize_h * this.pageNum_h) {
        this.pageNum_h = 1
      }
      this.getList_h()
    },
    handleCurrentChange_h(val) {
      this.pageNum_h = val
      this.getList_h()
    },
    // 布控命中--------

    // 任务执行情况============
    showJsonMessage(row) {
      this.jsonMessage = row.message
      this.jsonVisible = true
    },
    getList_p() {
      this.$api
        .getGuardExecutionLog({
          pageInfo: { pageNum: this.pageNum_h, pageSize: this.pageSize_h },
          guardId: this.choosedGuardId
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.performTableData = res.guardExecutionLogList
          }
        })
    },
    numberChange_p(val) {
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum_p < this.pageSize_p * this.pageNum_p) {
        this.pageNum_p = 1
      }
      this.getList_p()
    },
    handleCurrentChange_p(val) {
      this.pageNum_p = val
      this.getList_p()
    },
    // 任务执行情况============

    //获取列表展示中的运行周期数组
    getDayList(data) {
      let dataInfo = {}
      data.forEach((item, index) => {
        let { dayType } = item
        if (!dataInfo[dayType]) {
          dataInfo[dayType] = {
            dayType,
            child: []
          }
        }
        dataInfo[dayType].child.push(item)
      })
      let list = Object.values(dataInfo) // list 转换成功的数据
      let dayList = []
      for (let i = 0; i < list.length; i++) {
        let timeList = []
        for (let j = 0; j < list[i].child.length; j++) {
          let startTime = list[i].child[j].startTime
          let stopTime = list[i].child[j].stopTime
          let time = startTime.substring(0, 5) + '~' + stopTime.substring(0, 5)
          timeList.push(time)
        }
        timeList = '(' + timeList.toString() + ')'
        dayList.push({
          dayType: this.setDayType(list[i].dayType),
          time: timeList
        })
      }
      return dayList
    },
    setDayType(val) {
      if (val) {
        this.dayTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    }
  }
}
</script>

<style lang="scss">
.guardFormTooltip {
  max-width: 30% !important;
}
.date-picker-wrapper {
  display: flex;
  align-items: flex-start;
}
</style>

<style lang="scss">
#NewTaskDetail {
  padding: 0 30px;

  .totalInfo {
    display: flex;
    justify-content: center;
    &.el-row {
      flex-wrap: nowrap;
      .el-col-8 {
        flex: initial;
      }
    }
    .total {
      width: 15%;
      min-width: 270px;
      border-radius: 4px;
      background-color: #0a314f;
      font-size: 20px;
      margin-right: 20px;
      padding: 20px;

      p {
        font-size: 30px;
        text-align: right;
      }
    }
  }

  .engOverWidthStyle {
    width: 90%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;

    .dropStyle {
      width: 100%;
      display: flex;
      align-items: center;

      span {
        width: calc(100% - 20px);
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .el-page-header {
    line-height: 32px;
    padding: 10px 20px;

    .el-page-header__content {
      color: #fff;
    }
  }

  .el-dialog__body {
    padding: 15px 20px 5px;
  }

  .divmar {
    width: 25%;

    .el-dropdown {
      color: #10a9ff;
      cursor: pointer;
    }
  }

  .filterDiv {
    display: flex;

    .el-select {
      width: 290px;
      margin-right: 10px;
    }
  }

  .el-tabs__content {
    display: none;
  }

  .el-tabs {
    padding-left: 16px;
    margin-left: -15px;
  }

  .el-tabs__item {
    background: none !important;
  }

  .el-tabs__item.is-active {
    color: #409eff !important;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .blueSpan {
    color: #10a9ff;
    cursor: pointer;
  }
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-tabs__nav-scroll {
    padding-left: 0px !important;
  }

  .el-tabs__item {
    padding-left: 0px !important;
  }

  .snapDialog {
    .el-dialog__body {
      padding: 10px;
    }
  }

  .el-date-editor .el-range-separator {
    color: #4d4d4d;
  }

  .el-range-input {
    color: #262626;
  }

  .el-popper {
    width: 30%;
  }

  .filterDivDetail {
    display: flex;
    margin-bottom: 10px;

    .el-input {
      width: 290px;
      margin-right: 10px;
    }
  }
}
</style>
