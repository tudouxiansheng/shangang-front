<template>
  <div id="guardAddDialog">
    <el-dialog
      :title="$parent.operation == 0 ? $t('algoGuard.addGuard') : $t('algoGuard.editGuard')"
      v-model="$parent.dialogFormVisible"
      top="10vh"
      :width="$parent.locale == 'en' ? '1040px' : '1020px'"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      draggable
    >
      <el-steps :active="active" align-center finish-status="success">
        <el-step :title="$t('algoGuard.addTask')"></el-step>
        <el-step :title="$t('algoGuard.taskConfigure')"></el-step>
        <el-step :title="$t('algoGuard.complete')"></el-step>
      </el-steps>
      <el-form
        ref="form0"
        :model="form0"
        :rules="rules0"
        :validate-on-rule-change="false"
        :label-width="$parent.locale == 'en' ? '125px' : '86px'"
        label-position="left"
        v-show="active == 0"
      >
        <div style="display: flex; padding: 0 40px" class="form-flex">
          <div class="form-left">
            <el-form-item prop="guardName" :label="$t('workOrder.ticketName') + '：'">
              <el-input
                v-model="form0.guardName"
                auto-complete="off"
                :placeholder="$t('workOrder.ticketNamePrompt')"
                clearable
              />
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item :label="$t('algoGuard.guardType') + '：'" prop="guardType">
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form0.guardType"
                :placeholder="$t('algoGuard.inputGuardType')"
                @change="changeGuardType"
                :disabled="$parent.operation == 2"
              >
                <el-option
                  v-for="(item, index) in $parent.guardTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <el-form-item
          :label="$t('algoGuard.timeSet') + '：'"
          prop="dateValue"
          style="padding: 0 40px"
        >
          <el-date-picker
            :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
            style="width: 100%"
            v-model="dateValue"
            type="datetimerange"
            :range-separator="$t('public.to')"
            :start-placeholder="$t('public.startTimePrompt')"
            :end-placeholder="$t('public.endTimePrompt')"
            @change="dateChange"
          ></el-date-picker>
        </el-form-item>

        <el-form-item :label="$t('algoGuard.remark') + '：'" style="padding: 0 40px">
          <el-input
            v-model="form0.remark"
            :placeholder="$t('algoGuard.inputRemark')"
            type="textarea"
            :rows="2"
            maxlength="256"
            show-word-limit
            clearable
          />
        </el-form-item>
      </el-form>

      <el-form
        ref="form1"
        :model="form1"
        :rules="rules1"
        :validate-on-rule-change="false"
        :label-width="$parent.locale == 'en' ? '192px' : '116px'"
        size="small"
        label-position="left"
        v-show="active == 1"
      >
        <div style="display: flex; padding: 0px 20px" class="form-flex">
          <div class="form-left">
            <el-form-item
              :label="$t('algoGuard.sourceType') + '：'"
              prop="sourceType"
              class="nowrap"
            >
              <el-select
                clearable
                v-model="form1.sourceType"
                :placeholder="$t('algoGuard.selectSourceType')"
                :disabled="$parent.operation == 2"
                @change="sourceTypeChange"
              >
                <el-option
                  v-for="(item, index) in sourceTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('public.alarmType') + '：'"
              prop="alarmType"
              class="alarmTypeItem"
            >
              <el-cascader
                style="width: 100%"
                :options="options"
                expand-trigger="hover"
                clearable
                :show-all-levels="false"
                v-model="form1.alarmType"
                :popper-append-to-body="false"
                filterable
                :disabled="$parent.operation == 2"
                popper-class="alarmType"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              :label="$t('algoGuard.threshold') + '：'"
              prop="threshold"
              v-if="
                form0.guardType == 1 ||
                form0.guardType == 2 ||
                (form0.guardType == 3 && algorithmType == 'FACE_RECOGNIZE')
              "
            >
              <el-slider v-model="form1.threshold"></el-slider>
              <el-input-number v-model="form1.threshold" :min="1" :max="100"></el-input-number>
            </el-form-item>
            <el-form-item :label="$t('algoGuard.hitType') + '：'" prop="hited">
              <el-radio-group v-model="form1.hited">
                <el-radio :label="1">{{ $t('algoGuard.hitType1') }}</el-radio>
                <el-radio :label="2">{{ $t('algoGuard.hitType2') }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="form-right">
            <el-form-item
              :label="$t('algoGuard.algoModel') + '：'"
              prop="modelId"
              v-if="(form1.sourceType == 1 || form1.sourceType == 3) && form0.guardType == 3"
            >
              <el-select
                clearable
                :popper-append-to-body="false"
                v-model="form1.modelId"
                :placeholder="$t('algoGuard.selectAlgoModel')"
                :disabled="$parent.operation == 2"
                @change="changeModel"
              >
                <el-option
                  v-for="(item, index) in $parent.algorithmModelList"
                  :key="index"
                  :label="item.modelName"
                  :value="item.modelId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('algoGuard.algo') + '：'"
              v-if="form1.sourceType == 2 && form0.guardType != 1"
              prop="algorithmId"
            >
              <el-select
                clearable
                v-model="form1.algorithmId"
                :placeholder="$t('algoGuard.selectAlgo')"
                @change="changeAlgo"
                :disabled="$parent.operation == 2"
              >
                <el-option
                  v-for="(item, index) in algoList"
                  :key="index"
                  :label="item.algorithmName"
                  :value="item.algorithmId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              :label="$t('algoGuard.staffLib') + '：'"
              prop="repositoryIds"
              style="color: #fff"
              v-if="
                form0.guardType == 1 || (form0.guardType == 3 && algorithmType == 'FACE_RECOGNIZE')
              "
            >
              <el-cascader
                style="width: 100%"
                v-model="form1.repositoryIds"
                :options="$parent.peopleList"
                :props="{
                  value: 'value',
                  label: 'label',
                  multiple: true,
                  checkStrictly: true
                }"
                collapse-tags
                clearable
                filterable
                :placeholder="$t('algoGuard.selectStaffLib')"
                @change="peopleChange"
                :disabled="$parent.operation == 2"
                popper-class="repository_popper"
              >
                <template #default="{ data }">
                  <span :title="data.label">{{ data.label }}</span>
                </template>
              </el-cascader>
            </el-form-item>

            <el-form-item
              :label="$t('algoGuard.camera') + '：'"
              v-if="
                (form0.guardType == 1 && form1.sourceType == 1 && form1.modelId) ||
                (form0.guardType == 2 && form1.sourceType == 1) ||
                (form0.guardType == 3 && form1.modelId && form1.sourceType == 1)
              "
              prop="cameraName"
            >
              <el-input
                ref="newCameras"
                @focus="openDialog"
                v-model="form1.cameraName"
                :placeholder="$t('alarmList.selectACamera')"
                class="newCameras"
                :disabled="$parent.operation == 2"
              ></el-input>
              <img
                src="@/assets/img/common/add.png"
                class="addIcon"
                @click="openDialog"
                v-if="$parent.operation == 0"
              />
            </el-form-item>

            <el-form-item
              :label="$t('algoGuard.analysisTask') + '：'"
              v-if="
                form1.sourceType == 2 &&
                ((form1.algorithmId && (form0.guardType == 2 || form0.guardType == 3)) ||
                  (form1.repositoryIds &&
                    form1.repositoryIds.length &&
                    (form0.guardType == 1 || form0.guardType == 3)))
              "
              prop="sourceId"
            >
              <el-select
                v-model="form1.sourceId"
                filterable
                :placeholder="$t('algoGuard.selectTask')"
                :disabled="$parent.operation == 2"
                collapse-tags
                @change="changeAITask"
              >
                <el-option
                  v-for="(item, index) in taskList"
                  :key="index"
                  :label="item.taskName"
                  :value="item.taskId"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              :label="$t('algoGuard.vehicleLib') + '：'"
              prop="repositoryIds"
              style="color: #fff"
              v-if="
                form0.guardType == 2 ||
                (form0.guardType == 3 && algorithmType == 'VEHICLE_RECOGNIZE')
              "
            >
              <el-cascader
                style="width: 100%"
                v-model="form1.repositoryIds"
                :options="$parent.carList"
                :props="{
                  value: 'value',
                  label: 'label',
                  multiple: true,
                  checkStrictly: true
                }"
                collapse-tags
                clearable
                filterable
                :placeholder="$t('algoGuard.selectVehicleLib')"
                @change="carChange"
                :disabled="$parent.operation == 2"
                popper-class="repository_popper"
              >
                <template #default="{ data }">
                  <span :title="data.label">{{ data.label }}</span>
                </template>
              </el-cascader>
            </el-form-item>
          </div>
        </div>
        <!-- //过滤条件 -->
        <div class="filterBox" v-if="form0.guardType == 3" style="padding: 0px 20px">
          <p>{{ $t('algoGuard.filterCondition') }}</p>
          <div v-for="(item, index) in valueForm.filterList" :key="index" class="filterDiv">
            <el-select
              :popper-append-to-body="false"
              v-model="item.propertyKey"
              :placeholder="$t('algoGuard.selectProperty')"
              @change="changeProperty(item, index)"
            >
              <el-option
                v-for="(item1, index1) in propertyArr"
                :key="index1"
                :label="item1.name"
                :value="item1.key"
              ></el-option>
            </el-select>
            <el-select
              :popper-append-to-body="false"
              v-model="item.compare"
              :placeholder="$t('algoGuard.selectCompareWay')"
              @change="changeCompare(item, index)"
            >
              <el-option
                v-for="(item2, index2) in item.compareArr"
                :key="index2"
                :label="item2.name"
                :value="item2.value"
              ></el-option>
            </el-select>
            <el-select
              :popper-append-to-body="false"
              v-model="item.value"
              :placeholder="$t('algoGuard.selectCompareValue')"
              v-if="item.type == 'enum' || item.type == 'bool'"
            >
              <el-option
                v-for="(item3, index3) in item.specs"
                :key="index3"
                :label="item3.name + '-' + item3.value"
                :value="item3.value"
              ></el-option>
            </el-select>
            <el-form ref="valueForm" :rules="valueRules" :model="valueForm">
              <el-form-item :rules="valueRules.value" :prop="`filterList.${index}.value`">
                <el-input
                  :popper-append-to-body="false"
                  v-model="item.value"
                  :placeholder="$t('algoGuard.inputCompareValue')"
                  v-if="item.type != 'enum' && item.type != 'bool'"
                ></el-input>
              </el-form-item>
            </el-form>
            <div
              style="line-height: 34px; cursor: pointer; color: #f56c6c; width: 88px"
              @click="delFilter(index)"
            >
              {{ $t('public.delete') }}
            </div>
          </div>
          <div class="operateIcon-row" @click="addFilter">
            <el-icon class="operateIcon"><el-icon-plus /></el-icon>
            {{ $t('algoGuard.add') }}
          </div>
        </div>
      </el-form>

      <div v-show="active == 0">
        <div class="redAsterisk">
          <div class="clickIfShow" @click="showPeriodFlag = !showPeriodFlag">
            {{ $t('algoGuard.periodSet') }}&nbsp;
            <el-icon v-if="showPeriodFlag"><el-icon-arrow-down /></el-icon>
            <el-icon v-else><el-icon-arrow-up /></el-icon>
          </div>
        </div>
        <el-collapse-transition>
          <div v-show="showPeriodFlag">
            <el-radio-group v-model="$parent.planType" @change="planTypeChange">
              <el-radio :label="0">{{ $t('algoGuard.weekPlan') }}</el-radio>
              <el-radio :label="1">{{ $t('algoGuard.dayPlan') }}</el-radio>
            </el-radio-group>

            <!-- 网格时间选择控件 -->
            <time-grid-control ref="timeGridControl" id="time_grid_control"></time-grid-control>

            <el-button type="primary" class="clear" v-if="$parent.operation != 1">
              {{ $t('algoGuard.removeAll') }}
            </el-button>
          </div>
        </el-collapse-transition>
      </div>

      <div v-show="active == 2" style="text-align: center">
        <h2 v-if="$parent.operation == 0">
          <el-icon><el-icon-success /></el-icon>
          {{ $t('algoGuard.addTaskSucc') }}
        </h2>
        <h2 v-else>
          <el-icon><el-icon-success /></el-icon>
          {{ $t('algoGuard.editTaskSucc') }}
        </h2>
        <p>{{ $t('algoGuard.clickButtonTo') }}</p>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed" v-show="active < 2">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="previousStep" v-show="active > 0 && active < 2">
            {{ $t('algoGuard.lastStep') }}
          </el-button>
          <el-button type="primary" @click="nextStep" v-show="active < 1">
            {{ $t('algoGuard.nextStep') }}
          </el-button>
          <el-button
            v-show="active == 1"
            type="primary"
            @click="submitForm"
            :loading="$parent.maskloading"
          >
            {{ $t('public.confirm') }}
          </el-button>
          <el-button
            v-show="active == 2"
            type="primary"
            @click="backToList"
            :loading="$parent.maskloading"
          >
            {{ $t('algoGuard.backToList') }}
          </el-button>
          <el-button
            v-show="active == 2"
            type="primary"
            @click="viewInfo"
            :loading="$parent.maskloading"
          >
            {{ $t('algoGuard.viewInfo') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <device-tools
      :userType="userType"
      @getChooseCameras="getCameras"
      :currentChooseCameras="camerasInfo"
      :title="$t('algoGuard.selectCamera')"
      type="1"
      :ifJudgeAiType="true"
      :guardType="form0.guardType"
      :showModelTree="showModelTree"
      :modelId="form1.modelId"
      v-if="showTools"
    ></device-tools>
  </div>
</template>

<script>
import {
  Plus as ElIconPlus,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp,
  SuccessFilled as ElIconSuccess
} from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { defineAsyncComponent } from 'vue'
import { getFormatDate } from '@/utils/common/mutil'
import timeGridControl from '@/components/time-grid-control.vue'
import DeviceTools from '@/components/device-tools'
import { validateSpecialWord } from '@/utils/common/validator'

export default {
  components: {
    DeviceTools,
    'time-grid-control': timeGridControl,
    ElIconPlus,
    ElIconArrowDown,
    ElIconArrowUp,
    ElIconSuccess
  },
  data() {
    return {
      showTools: true,
      showModelTree: true,
      userType: '2',
      camerasInfo: [],
      camerasArray: [],
      dialogDeviceVisible: false,
      form0: {
        guardName: '',
        guardType: '',
        validDateBegin: '',
        validDateEnd: '',
        remark: ''
      },
      form1: {
        algorithmId: '',
        //新增模型联动设备
        modelId: '',

        alarmType: [],
        //公共
        repositoryIds: [],
        threshold: 50,
        sourceType: '',
        sourceId: '',
        cameraName: ''
      },
      sourceTypeList: [],
      valueForm: {
        filterList: [
          {
            type: '',
            propertyKey: '',
            compare: '',
            value: '',
            compareArr: [],
            specs: []
          }
        ]
      },
      rules0: {},
      rules1: {},
      valueRules: {},
      peopleListCopy: [],
      carListCopy: [],
      dialogClose: false,
      //新增算法仓
      active: 0,
      dateValue: [],
      options: [],
      shareScope: [],
      shareScopeCopy: [],
      taskList: [],
      //规则
      propertyArr: [],
      numCompareArr: [],
      strCompareArr: [],
      boolOrEnumCompareArr: [],
      modelList: [],
      algoList: [],
      addReturnGuardId: '',
      algorithmType: '',
      showPeriodFlag: true,
      dayjs
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.setFormRules()
    }
  },
  async mounted() {
    this.setFormRules()
    this.getGroups()
  },
  methods: {
    changeAITask(val) {},
    dialogOpen() {
      this.getAlgoList()
      if (this.$refs.form0) {
        this.$nextTick(() => {
          this.$refs.form0.resetFields()
          this.dateValue = []
        })
      }
      if (this.$refs.form1) {
        this.$nextTick(() => {
          this.$refs.form1.resetFields()
        })
      }

      this.showTools = false
      this.$nextTick(async () => {
        this.showTools = true
        

        if (this.$parent.operation == 0) {
          this.form0 = this.$parent.dataForm0
          this.form1 = this.$parent.dataForm1
        } else {
          let infoResFather = this.$parent.infoResFather
          this.dateValue = [new Date(infoResFather.beginTime), new Date(infoResFather.endTime)]
          this.form0 = {
            guardName: infoResFather.guardName,
            guardType: infoResFather.guardType,
            validDateBegin: infoResFather.beginTime,
            validDateEnd: infoResFather.endTime,
            remark: infoResFather.remark
          }
          this.form1 = {
            algorithmId: infoResFather.algorithmId,
            //新增模型联动设备
            modelId: infoResFather.modelId,

            alarmType: [infoResFather.alarmGroup, infoResFather.alarmType],

            threshold: infoResFather.threshold,
            hited: infoResFather.hited,
            sourceType: infoResFather.sourceType
          }
          let currentCameras = []
          this.camerasArray = []

          if (this.form1.sourceType == 2) {
            await this.$api
              .getNewTaskList({
                pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
                algorithmId: this.form1.algorithmId,
                sourceType: 1,
                taskOwner: 0
              })
              .then(res => {
                if (res.resultCode == 0) {
                  this.taskList = res.taskList
                }
              })
          }
          if (infoResFather?.sourceList) {
            for (let i = 0; i < infoResFather.sourceList.length; i++) {
              currentCameras.push(infoResFather.sourceList[i].sourceName)
              this.camerasArray.push(infoResFather.sourceList[i].sourceId)
            }
          }

          this.form1.cameraName = currentCameras.join(',')
          this.form1.sourceId = infoResFather?.sourceList?.[0]['sourceId']

          this.sourceTypeChange(this.form1.sourceType, false)
          this.timeSpanList = infoResFather.periods

          if (this.form0.guardType == 1) {
            this.rules1.threshold[0].required = true
            this.rules1.repositoryIds[0].required = true
            this.rules1.repositoryIds[0].message = this.$t('algoGuard.personnelCantEmpty')
            this.sourceTypeList = [
              {
                name: this.$t('algoGuard.targetDev'),
                value: 1
              },
              {
                name: this.$t('algoGuard.analysisTask1'),
                value: 2
              },
              {
                name: this.$t('algoGuard.territorialDefence'),
                value: 3
              }
            ]
          } else if (this.form0.guardType == 2) {
            this.rules1.threshold[0].required = true
            this.rules1.repositoryIds[0].required = true
            this.rules1.repositoryIds[0].message = this.$t('algoGuard.vehicleLibCantEmpty')
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
          } else if (this.form0.guardType == 3) {
            this.rules1.threshold[0].required = false
            this.rules1.repositoryIds[0].required = false
          }

          if (infoResFather.guardType == 3) {
            if (infoResFather.sourceType == 2) {
              let resA = await this.$api.getNewAlgorithmInfo({
                algorithmId: infoResFather.algorithmId,
                netType: this.$getNetType()
              })
              if (resA.resultCode == 0) {
                this.propertyArr = resA.model.properties
                this.algorithmType = resA.model.algorithmType
              }
              await this.getAlgoList()
              await this.$api
                .getNewTaskList({
                  pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
                  algorithmId: this.form1.algorithmId,
                  sourceType: 1,
                  taskOwner: 0
                })
                .then(res => {
                  if (res.resultCode == 0) {
                    this.taskList = res.taskList
                  }
                })
            } else {
              if (infoResFather.modelId) {
                let res = await this.$api.getAlgorithmModel({
                  modelId: infoResFather.modelId
                })
                if (res.properties) this.propertyArr = res.properties
              }
            }

            let filterArr = []
            for (let i = 0; i < infoResFather.rules.length; i++) {
              for (let j = 0; j < this.propertyArr.length; j++) {
                if (this.propertyArr[j].key == infoResFather.rules[i].propertyKey) {
                  let filterObj = {
                    propertyKey: infoResFather.rules[i].propertyKey,
                    compare: infoResFather.rules[i].compare,
                    value: infoResFather.rules[i].value
                  }

                  filterObj.type = this.propertyArr[j].type

                  if (this.propertyArr[j].type == 'enum' || this.propertyArr[j].type == 'bool') {
                    filterObj.specs = this.propertyArr[j].specs
                  } else {
                    filterObj.specs = []
                  }

                  if (
                    this.propertyArr[j].type == 'int' ||
                    this.propertyArr[j].type == 'float' ||
                    this.propertyArr[j].type == 'double'
                  ) {
                    filterObj.compareArr = this.numCompareArr
                  } else if (this.propertyArr[j].type == 'text') {
                    filterObj.compareArr = this.strCompareArr
                  } else if (
                    this.propertyArr[j].type == 'bool' ||
                    this.propertyArr[j].type == 'enum'
                  ) {
                    filterObj.compareArr = this.boolOrEnumCompareArr
                  }

                  filterArr.push(filterObj)
                  continue
                }
              }
            }

            this.valueForm.filterList = filterArr
          }

          if (
            this.form0.guardType == 1 ||
            (this.form0.guardType == 3 && this.algorithmType == 'FACE_RECOGNIZE')
          ) {
            let repositoryIds = []
            for (let i = 0; i < infoResFather.repositoryList.length; i++) {
              const item = infoResFather.repositoryList[i]
              repositoryIds.push([item.algorithmId, item.repositoryId])
            }
            this.form1.repositoryIds = repositoryIds
            this.peopleListCopy = JSON.parse(JSON.stringify(this.form1.repositoryIds))
          }

          if (
            this.form0.guardType == 2 ||
            (this.form0.guardType == 3 && this.algorithmType == 'VEHICLE_RECOGNIZE')
          ) {
            let repositoryIds = []
            for (let i = 0; i < infoResFather.repositoryList.length; i++) {
              const item = infoResFather.repositoryList[i]
              repositoryIds.push([item.algorithmId, item.repositoryId])
            }
            this.form1['repositoryIds'] = repositoryIds
            this.carListCopy = JSON.parse(JSON.stringify(this.form1.repositoryIds))
          }
        }

        let planType = this.$parent.planType
        let operation = this.$parent.operation
        let timeSpanList = this.timeSpanList

        this.$refs.timeGridControl.time_initialize(planType, operation, timeSpanList)

        await this.$parent.getGuardLibList()
      })
    },
    dialogClosed() {
      this.$parent.dialogFormVisible = false
      this.$parent.maskloading = false
      this.$parent.dataForm0 = {
        guardName: '',
        guardType: '',
        validDateBegin: '',
        validDateEnd: '',
        remark: ''
      }
      this.$parent.dataForm1 = {
        algorithmId: '',
        //新增模型联动设备
        modelId: '',

        alarmType: [],
        //公共
        repositoryIds: [],
        threshold: 50,
        sourceType: '',
        sourceId: '',
        cameraName: ''
      }
      this.valueForm.filterList = [
        {
          type: '',
          propertyKey: '',
          compare: '',
          value: '',
          compareArr: [],
          specs: []
        }
      ]
      this.camerasArray = []
      this.active = 0
      this.algorithmType = ''
      this.$refs.timeGridControl.closeControl()
    },

    setFormRules() {
      this.numCompareArr = [
        {
          name: this.$t('algoGuard.greater'),
          value: '&gt;'
        },
        {
          name: this.$t('algoGuard.greaterEqual'),
          value: '&gt;='
        },
        {
          name: this.$t('algoGuard.lessThan'),
          value: '&lt;'
        },
        {
          name: this.$t('algoGuard.lessEqual'),
          value: '&lt;='
        },
        {
          name: this.$t('algoGuard.equal'),
          value: '=='
        },
        {
          name: this.$t('algoGuard.notEqual'),
          value: '!='
        },
        {
          name: this.$t('algoGuard.contain'),
          value: 'in'
        },
        {
          name: this.$t('algoGuard.between'),
          value: 'between'
        }
      ]
      this.strCompareArr = [
        {
          name: this.$t('algoGuard.equal'),
          value: '=='
        },
        {
          name: this.$t('algoGuard.notEqual'),
          value: '!='
        },
        {
          name: this.$t('algoGuard.contain'),
          value: 'in'
        },
        {
          name: this.$t('algoGuard.like'),
          value: 'like'
        }
      ]
      this.boolOrEnumCompareArr = [
        {
          name: this.$t('algoGuard.equal'),
          value: '=='
        }
      ]
      var validateDateValue = (rule, value, callback) => {
        if (!this.form0.validDateBegin || !this.form0.validDateEnd) {
          callback(new Error(this.$t('algoGuard.selectDate')))
        } else if (new Date(this.form0.validDateBegin) >= new Date(this.form0.validDateEnd)) {
          callback(new Error(this.$t('algoGuard.startLessThanStop')))
        } else {
          callback()
        }
      }

      var regIntNum_feifu = /^(0|[1-9]\d*)$/ //非负整数
      var regIntNum_zhengshu = /^-?\d+$/ //整数
      var regFloat = /^-?(0|[1-9]\d*)(\.\d*[1-9])?$/ //单精度
      var regDouble = /^([+-]?)\d*\.\d+$/ //双精度

      var validateValue = (rule, value, callback) => {
        let index = Number(rule.field.substring(11, 12))
        if (this.valueForm.filterList[index].type) {
          if (this.valueForm.filterList[index].type == 'int') {
            if (
              this.valueForm.filterList[index].compare == '&gt;' ||
              this.valueForm.filterList[index].compare == '&gt;=' ||
              this.valueForm.filterList[index].compare == '&lt;' ||
              this.valueForm.filterList[index].compare == '&lt;=' ||
              this.valueForm.filterList[index].compare == '==' ||
              this.valueForm.filterList[index].compare == '!='
            ) {
              if (!regIntNum_feifu.test(this.valueForm.filterList[index].value)) {
                callback(new Error(this.$t('algoGuard.nonnegativeInt')))
              } else {
                callback()
              }
            } else if (this.valueForm.filterList[index].compare == 'in') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (
                      !regIntNum_feifu.test(JSON.parse(this.valueForm.filterList[index].value)[i])
                    ) {
                      callback(new Error(this.$t('algoGuard.arrNonnegative')))
                      break
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange')))
              }
            } else if (this.valueForm.filterList[index].compare == 'between') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length ||
                  JSON.parse(this.valueForm.filterList[index].value).length != 2
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange1')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (
                      !regIntNum_zhengshu.test(
                        JSON.parse(this.valueForm.filterList[index].value)[i]
                      )
                    ) {
                      callback(new Error(this.$t('algoGuard.arrInt')))
                      break
                    } else if (
                      JSON.parse(this.valueForm.filterList[index].value)[0] >=
                      JSON.parse(this.valueForm.filterList[index].value)[1]
                    ) {
                      callback(new Error(this.$t('algoGuard.rightGreater')))
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange1')))
              }
            } else {
              callback()
            }
          } else if (this.valueForm.filterList[index].type == 'float') {
            if (
              this.valueForm.filterList[index].compare == '&gt;' ||
              this.valueForm.filterList[index].compare == '&gt;=' ||
              this.valueForm.filterList[index].compare == '&lt;' ||
              this.valueForm.filterList[index].compare == '&lt;=' ||
              this.valueForm.filterList[index].compare == '==' ||
              this.valueForm.filterList[index].compare == '!='
            ) {
              if (!regFloat.test(this.valueForm.filterList[index].value)) {
                callback(new Error(this.$t('algoGuard.float')))
              } else {
                callback()
              }
            } else if (this.valueForm.filterList[index].compare == 'in') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (!regFloat.test(JSON.parse(this.valueForm.filterList[index].value)[i])) {
                      callback(new Error(this.$t('algoGuard.arrFloat')))
                      break
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange')))
              }
            } else if (this.valueForm.filterList[index].compare == 'between') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length ||
                  JSON.parse(this.valueForm.filterList[index].value).length != 2
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange1')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (!regFloat.test(JSON.parse(this.valueForm.filterList[index].value)[i])) {
                      callback(new Error(this.$t('algoGuard.arrFloat')))
                      break
                    } else if (
                      JSON.parse(this.valueForm.filterList[index].value)[0] >=
                      JSON.parse(this.valueForm.filterList[index].value)[1]
                    ) {
                      callback(new Error(this.$t('algoGuard.rightGreater')))
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange1')))
              }
            } else {
              callback()
            }
          } else if (this.valueForm.filterList[index].type == 'double') {
            if (
              this.valueForm.filterList[index].compare == '&gt;' ||
              this.valueForm.filterList[index].compare == '&gt;=' ||
              this.valueForm.filterList[index].compare == '&lt;' ||
              this.valueForm.filterList[index].compare == '&lt;=' ||
              this.valueForm.filterList[index].compare == '==' ||
              this.valueForm.filterList[index].compare == '!='
            ) {
              if (!regDouble.test(this.valueForm.filterList[index].value)) {
                callback(new Error(this.$t('algoGuard.double')))
              } else {
                callback()
              }
            } else if (this.valueForm.filterList[index].compare == 'in') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (!regDouble.test(JSON.parse(this.valueForm.filterList[index].value)[i])) {
                      callback(new Error(this.$t('algoGuard.arrDouble')))
                      break
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange')))
              }
            } else if (this.valueForm.filterList[index].compare == 'between') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length ||
                  JSON.parse(this.valueForm.filterList[index].value).length != 2
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange1')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (!regDouble.test(JSON.parse(this.valueForm.filterList[index].value)[i])) {
                      callback(new Error(this.$t('algoGuard.arrDouble')))
                      break
                    } else if (
                      JSON.parse(this.valueForm.filterList[index].value)[0] >=
                      JSON.parse(this.valueForm.filterList[index].value)[1]
                    ) {
                      callback(new Error(this.$t('algoGuard.rightGreater')))
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange1')))
              }
            } else {
              callback()
            }
          } else if (this.valueForm.filterList[index].type == 'text') {
            if (this.valueForm.filterList[index].compare == 'in') {
              try {
                if (
                  !JSON.parse(this.valueForm.filterList[index].value) ||
                  !JSON.parse(this.valueForm.filterList[index].value).join(',') ||
                  !JSON.parse(this.valueForm.filterList[index].value).length
                ) {
                  callback(new Error(this.$t('algoGuard.arrRange')))
                  return
                } else {
                  for (
                    let i = 0;
                    i < JSON.parse(this.valueForm.filterList[index].value).length;
                    i++
                  ) {
                    if (!regFloat.test(JSON.parse(this.valueForm.filterList[index].value)[i])) {
                      callback(new Error(this.$t('algoGuard.arrFloat')))
                      break
                    }
                  }
                  callback()
                }
              } catch (error) {
                callback(new Error(this.$t('algoGuard.arrRange')))
              }
            } else if (this.valueForm.filterList[index].compare == 'like') {
              callback()
            } else if (this.valueForm.filterList[index].compare == '==') {
              callback()
            } else if (this.valueForm.filterList[index].compare == '!=') {
              callback()
            } else {
              callback()
            }
          } else {
            callback()
          }
        } else {
          callback()
        }
      }
      this.rules0 = {
        guardName: [
          { required: true, message: this.$t('algoGuard.taskNameCantEmpty'), trigger: 'change' },
          {
            max: 128,
            message: this.$t('monitorManage.oneHundredAndTwentyEight'),
            trigger: 'change'
          },
          {
            validator: validateSpecialWord,
            trigger: 'blur'
          }
        ],
        guardType: [
          { required: true, message: this.$t('algoGuard.guardTypeCantEmpty'), trigger: 'change' }
        ],
        dateValue: [{ required: true, validator: validateDateValue, trigger: 'change' }]
      }
      this.rules1 = {
        sourceType: [
          { required: true, message: this.$t('algoGuard.guardTypeCantEmpty'), trigger: 'change' }
        ],
        sourceId: [
          { required: true, message: this.$t('algoGuard.guardSourceCantEmpty'), trigger: 'blur' }
        ],
        cameraName: [
          { required: true, message: this.$t('algoGuard.cameraCantEmpty'), trigger: 'change' }
        ],
        threshold: [
          { required: true, message: this.$t('algoGuard.thresholdCantEmpty'), trigger: 'change' }
        ],
        repositoryIds: [
          { required: true, message: this.$t('algoGuard.personnelCantEmpty'), trigger: 'change' }
        ],
        algorithmId: [
          { required: true, message: this.$t('algoGuard.algoCantEmpty'), trigger: 'change' }
        ],
        //新增模型联动设备
        modelId: [
          { required: true, message: this.$t('algoGuard.algoModelCantEmpty'), trigger: 'change' }
        ],
        alarmType: [
          { required: true, message: this.$t('algoGuard.alarmTypeCantEmpty'), trigger: 'change' }
        ],
        hited: [{ required: true, message: this.$t('algoGuard.hitTypePrompt'), trigger: 'change' }]
      }
      this.valueRules = {
        value: [{ required: false, validator: validateValue, trigger: 'change' }]
      }
    },

    getGroups() {
      this.$api.getGroupsQuery({}).then(res => {
        if (res.alarmGroups) {
          let options = []
          for (let i = 0; i < res.alarmGroups.length; i++) {
            let groupobj = {}
            groupobj.value = res.alarmGroups[i].groupCode
            groupobj.label =
              this.$parent.locale == 'en'
                ? res.alarmGroups[i].groupEnName
                : res.alarmGroups[i].groupName
            options.push(groupobj)
          }
          for (let i = 0; i < options.length; i++) {
            let typeobj = {}
            options[i].children = []
            let searchTypeObj = {}
            searchTypeObj.alarmGroup = options[i].value
            this.$api.getAlarmTypesQuery(searchTypeObj).then(res => {
              for (let j = 0; j < res.alarmTypeList.length; j++) {
                let childrenObj = {}
                childrenObj.value = res.alarmTypeList[j].alarmType
                childrenObj.label = res.alarmTypeList[j].alarmName
                options[i].children.push(childrenObj)
              }
            })
          }
          this.options = options.filter(i => i.value == '2')
        }
      })
    },

    setTaskType(val) {
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
    dateChange(val) {
      if (val) {
        this.form0.validDateBegin = getFormatDate(val[0])
        this.form0.validDateEnd = getFormatDate(val[1])
      } else {
        this.form0.validDateBegin = ''
        this.form0.validDateEnd = ''
      }
    },
    previousStep() {
      if (this.active > 0) this.active--
    },
    nextStep() {
      this.$refs['form0'].validate(valid => {
        if (valid) {
          let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
          if (timeSpanList.length == 0) {
            this.$message({
              message: this.$t('algoGuard.selectTime'),
              type: 'error',
              duration: 5 * 1000
            })
            return
          }
          if (this.active < 2) this.active++
        }
      })
    },
    changeGuardType(val) {
      if (val) {
        this.camerasInfo = []
        this.camerasArray = []
        this.form1.cameraName = ''

        this.form1.repositoryIds = []

        if (val == 1) {
          this.rules1.threshold[0].required = true
          this.rules1.repositoryIds[0].required = true
          this.rules1.repositoryIds[0].message = this.$t('algoGuard.personnelCantEmpty')
          this.sourceTypeList = [
            {
              name: this.$t('algoGuard.targetDev'),
              value: 1
            },
            {
              name: this.$t('algoGuard.analysisTask1'),
              value: 2
            },
            {
              name: this.$t('algoGuard.territorialDefence'),
              value: 3
            }
          ]
          this.showModelTree = true
        } else if (val == 2) {
          this.rules1.threshold[0].required = true
          this.rules1.repositoryIds[0].required = true
          this.rules1.repositoryIds[0].message = this.$t('algoGuard.vehicleLibCantEmpty')
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
          this.showModelTree = false
        } else if (val == 3) {
          this.rules1.threshold[0].required = false
          this.rules1.repositoryIds[0].required = false
          this.sourceTypeList = [
            {
              name: this.$t('algoGuard.analysisTask1'),
              value: 2
            },
            {
              name: this.$t('algoGuard.territorialDefence'),
              value: 3
            }
          ]
          //模型树
          this.showModelTree = true
        }

        this.form1.sourceType = ''

        this.showTools = false
        this.$nextTick(() => {
          this.showTools = true
        })
      }

      this.getAlgoList()
    },

    getAlgoList() {
      let obj = {
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        modelType: 1,
        netType: this.$getNetType()
      }
      if (this.form0.guardType == 1) {
        obj.algorithmType = 'FACE_RECOGNIZE'
      } else if (this.form0.guardType == 2) {
        obj.algorithmType = 'VEHICLE_RECOGNIZE'
      } else {
        obj.algorithmType = null
      }
      this.$api.queryNewAlgorithmList(obj).then(res => {
        if (res.resultCode == 0) {
          this.algoList = res.algorithmList
        }
      })
    },

    //选择周计划或日计划
    planTypeChange(val) {
      this.$refs.timeGridControl.planTypeChange(val)
    },

    // 清除全部
    clearAll() {
      this.$refs.timeGridControl.clearAll()
    },

    changeAlgo(val) {
      if (val) {
        this.form1.sourceId = []
        this.form1.repositoryIds = []
        //根据算法查任务
        this.$api
          .getNewTaskList({
            pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
            algorithmId: val,
            sourceType: 1,
            taskOwner: 0
          })
          .then(res => {
            if (res.resultCode == 0) {
              this.taskList = res.taskList
            }
          })
        //根据算法查模型
        if (this.form0.guardType == 3) {
          this.$api
            .getNewAlgorithmInfo({
              algorithmId: val,
              netType: this.$getNetType()
            })
            .then(res => {
              if (res.resultCode == 0) {
                this.propertyArr = res.model.properties

                this.algorithmType = res.model.algorithmType
              }
            })
        }
      }
    },

    changeProperty(item, index) {
      this.valueForm.filterList[index].value = ''
      this.valueForm.filterList[index].compare = ''
      let type = ''
      for (let i = 0; i < this.propertyArr.length; i++) {
        if (this.propertyArr[i].key == item.propertyKey) {
          type = this.propertyArr[i].type
          if (this.propertyArr[i].type == 'enum' || this.propertyArr[i].type == 'bool') {
            this.valueForm.filterList[index].specs = this.propertyArr[i].specs
          }
          break
        }
      }
      if (type == 'int' || type == 'float' || type == 'double') {
        this.valueForm.filterList[index].compareArr = this.numCompareArr
      } else if (type == 'text') {
        this.valueForm.filterList[index].compareArr = this.strCompareArr
      } else if (type == 'bool' || type == 'enum') {
        this.valueForm.filterList[index].compareArr = this.boolOrEnumCompareArr
      }

      this.valueForm.filterList[index].type = type
    },

    changeCompare(item, index) {
      this.valueForm.filterList[index].value = ''
    },

    addFilter() {
      this.valueForm.filterList.push({
        type: '',
        propertyKey: '',
        compare: '',
        value: '',
        compareArr: [],
        specs: []
      })
    },
    delFilter(index) {
      this.valueForm.filterList.splice(index, 1)
    },

    sourceTypeChange(val, reset = true) {
      if (val == 1) {
        this.rules1.cameraName[0].required = true
      } else {
        this.rules1.cameraName[0].required = false
      }
      if (reset) {
        this.form1 = {
          ...this.form1,
          ...{
            algorithmId: '',
            modelId: '',
            alarmType: [],
            repositoryIds: [],
            threshold: 50,
            sourceId: [],
            cameraName: '',
            hited: 1
          }
        }
        this.algorithmType = ''
      }
    },

    async changeModel(val) {
      this.camerasInfo = []
      this.camerasArray = []
      this.form1.cameraName = ''
      this.showTools = false
      this.$nextTick(() => {
        this.showTools = true
      })
      if (val && this.form0.guardType == 3) {
        let res = await this.$api.getAlgorithmModel({ modelId: val })
        if (res.resultCode == 0) {
          this.propertyArr = res.properties
          this.algorithmType = res.algorithmType
        }
      }
    },

    openDialog() {
      this.dialogDeviceVisible = true
      this.$refs.newCameras.blur()
    },
    async getCameras(cameras) {
      let currentCameras = []
      this.camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        currentCameras.push(cameras[i].label)
        this.camerasArray.push(cameras[i].id)
      }
      this.camerasInfo = JSON.parse(JSON.stringify(cameras))
      this.form1.cameraName = currentCameras.join(',')
    },

    // 第一级单选
    async peopleChange(val) {
      this.$emit('repositoryChange', { val: val.length ? val[0] : [], guardType: 1 })
      let newVal = ''
      if (this.peopleListCopy.length && val.length) {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.peopleListCopy.length; j++) {
            if (val[i][0] != this.peopleListCopy[j][0]) {
              newVal = val[i][0]
              break
            }
          }
        }

        if (newVal) {
          this.form1.repositoryIds = val.filter(item => {
            return item[0] == newVal
          })
          this.$emit(
            'repositoryChange',
            this.form1.repositoryIds.length ? this.form1.repositoryIds[0] : []
          )
        }
      }

      if (this.form1.repositoryIds) {
        this.peopleListCopy = JSON.parse(JSON.stringify(this.form1.repositoryIds))
      }

      this.camerasInfo = []
      this.camerasArray = []
      this.form1.cameraName = ''
      this.showTools = false
      this.$nextTick(() => {
        this.showTools = true
      })

      if (val && val.length) {
        if (this.form0.guardType == 1) {
          let res = await this.$api.getNewAlgorithmInfo({
            algorithmId: val[0][0],
            netType: this.$getNetType()
          })
          if (res.resultCode == 0) {
            let resM = await this.$api.getAlgorithmModel({
              modelId: res.modelId
            })

            this.algorithmType = resM.algorithmType

            this.form1.modelId = resM.modelId

            if (this.form0.guardType == 3) {
              this.propertyArr = resM.properties
            }
          }
        }

        if (this.form0.guardType == 1) {
          this.form1.sourceId = []
          let resT = await this.$api.getNewTaskList({
            pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
            algorithmId: val[0][0],
            sourceType: 1,
            taskOwner: 0
          })
          if (resT.resultCode == 0) {
            this.taskList = resT.taskList
          }
        }
      }
    },
    carChange(val) {
      this.$emit('repositoryChange', { val: val && val.length ? val[0] : [], guardType: 2 })
      let newVal = ''
      if (this.carListCopy.length && val && val.length) {
        for (let i = 0; i < val.length; i++) {
          for (let j = 0; j < this.carListCopy.length; j++) {
            if (val[i][0] != this.carListCopy[j][0]) {
              newVal = val[i][0]
              break
            }
          }
        }

        if (newVal) {
          this.form1.repositoryIds = val.filter(item => {
            return item[0] == newVal
          })
          this.$emit(
            'repositoryChange',
            this.form1.repositoryIds.length ? this.form1.repositoryIds[0] : []
          )
        }
      }
      if (this.form1.repositoryIds) {
        this.carListCopy = JSON.parse(JSON.stringify(this.form1.repositoryIds))
      }
    },
    //返回任务列表
    backToList() {
      this.$parent.getList()
      this.$parent.dialogFormVisible = false
    },

    //查看任务详情
    async viewInfo() {
      if (this.$parent.operation == 0) {
        await this.$parent.getList()
        this.$router.push({
          name: 'GuardTaskDetail',
          params: { id: this.addReturnGuardId }
        })
      } else {
        this.$router.push({
          name: 'GuardTaskDetail',
          params: { id: this.$parent.choosedGuardId }
        })
      }

      this.$parent.dialogFormVisible = false
    },

    //创建布防
    submitForm() {
      this.$refs['form1'].validate(valid => {
        if (valid) {
          if (this.form0.guardType == 3 && this.$refs['valueForm'][0]) {
            this.$refs['valueForm'][0].validate(valid1 => {
              if (valid1) {
                this.sureSubmit()
              }
            })
          } else {
            this.sureSubmit()
          }
        }
      })
    },

    sureSubmit() {
      //周期
      let timeSpanList = this.$refs.timeGridControl.getTimeSpanList()
      if (timeSpanList.length == 0) {
        this.$message({
          message: this.$t('algoGuard.selectTime'),
          type: 'error',
          duration: 5 * 1000
        })
        return
      }

      //过滤条件
      if (this.form0.guardType == 3) {
        let needFilter = false
        for (let i = 0; i < this.valueForm.filterList.length; i++) {
          if (
            this.valueForm.filterList[i].propertyKey ||
            this.valueForm.filterList[i].compare ||
            this.valueForm.filterList[i].value
          ) {
            needFilter = true
            break
          }
        }
        if (needFilter) {
          for (let i = 0; i < this.valueForm.filterList.length; i++) {
            if (
              !this.valueForm.filterList[i].propertyKey ||
              !this.valueForm.filterList[i].compare ||
              !this.valueForm.filterList[i].value
            ) {
              this.$message({
                type: 'error',
                message: this.$t('algoGuard.inputFullFilter')
              })
              return
            }
          }
        }
      }

      this.$parent.maskloading = true

      let obj = {}
      obj.guardName = this.form0.guardName
      obj.beginTime = this.form0.validDateBegin
      obj.endTime = this.form0.validDateEnd
      obj.remark = this.form0.remark
      obj.periods = timeSpanList
      obj.alarmType = this.form1.alarmType[1]
      obj.hited = this.form1.hited

      if (
        this.form0.guardType == 1 ||
        this.form0.guardType == 2 ||
        (this.form0.guardType == 3 && this.algorithmType == 'FACE_RECOGNIZE')
      ) {
        obj.threshold = this.form1.threshold
      }

      if (
        this.form0.guardType == 1 ||
        this.form0.guardType == 2 ||
        (this.form0.guardType == 3 && this.algorithmType == 'FACE_RECOGNIZE')
      ) {
        let repositoryIds = []
        for (let i = 0; i < this.form1.repositoryIds.length; i++) {
          const item = this.form1.repositoryIds[i]
          repositoryIds.push(item[1])
        }
        obj.repositoryIds = repositoryIds
      }

      if (this.form0.guardType == 3 && this.algorithmType == 'VEHICLE_RECOGNIZE') {
        let repositoryIds = []
        for (let i = 0; i < this.form1.repositoryIds.length; i++) {
          if (this.form1.repositoryIds[i]) {
            if (this.form1.repositoryIds[i].repositoryId) {
              repositoryIds.push(this.form1.repositoryIds[i].repositoryId)
            } else {
              repositoryIds.push(this.form1.repositoryIds[i])
            }
          }
        }
        obj.repositoryIds = repositoryIds
      }

      if (this.form0.guardType == 3) {
        if (this.valueForm.filterList[0]) {
          if (this.valueForm.filterList[0].propertyKey != '') {
            let rules = []
            for (let i = 0; i < this.valueForm.filterList.length; i++) {
              rules.push({
                propertyKey: this.valueForm.filterList[i].propertyKey,
                compare: this.valueForm.filterList[i].compare,
                value: this.valueForm.filterList[i].value
              })
            }
            obj.rules = rules
          }
        }
      }

      if (this.$parent.operation == 0) {
        obj.guardType = this.form0.guardType

        //sourceType放到外层
        obj.sourceType = this.form1.sourceType
        let sources = []
        // 如果是设备
        if (this.form1.sourceType == 1) {
          for (let i = 0; i < this.camerasArray.length; i++) {
            const item = this.camerasArray[i]
            sources.push({
              sourceId: item
            })
          }
          obj.sources = sources

          //新增模型联动设备
          obj.modelId = this.form1.modelId
        }
        //
        else if (this.form1.sourceType == 2) {
          const flag = Array.isArray(this.form1.sourceId)
          if (flag) {
            for (let i = 0; i < this.form1.sourceId.length; i++) {
              const item = this.form1.sourceId[i]
              sources.push({
                sourceId: item
              })
            }
          } else {
            sources.push({
              sourceId: this.form1.sourceId
            })
          }

          obj.sources = sources
          obj.algorithmId = this.form1.algorithmId
        } else if (this.form1.sourceType == 3) {
          obj.modelId = this.form1.modelId
        }

        this.$api.addNewGuardInfo(obj).then(res => {
          if (res.resultCode == 0) {
            this.addReturnGuardId = res.guardId
            this.active = 2
          }
          this.$parent.maskloading = false
        })
      } else if (this.$parent.operation == 2) {
        obj.guardId = this.$parent.choosedGuardId
        this.$api.modifyNewGuardInfo(obj).then(res => {
          if (res.resultCode == 0) {
            this.active = 2
          }
          this.$parent.maskloading = false
        })
      }
    }
  }
}
</script>

<style lang="scss">
#guardAddDialog {
  .nowrap {
    white-space: nowrap;
  }
  .el-dialog__body {
    padding: 15px 20px 5px;
  }
  .addIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 5px;
    top: 13px;
  }
  .newCameras {
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }

  .el-steps {
    width: 100%;
    margin-bottom: 20px;
  }
  .el-step__icon.is-text {
    width: 68px;
    height: 68px;
    background: transparent;
  }
  .el-step.is-center .el-step__line {
    width: 260px;
    left: 60%;
    top: 33px;
  }
  .el-step__head.is-process .el-step__icon.is-text {
    border-color: #64befd !important;
    color: #64befd;
  }
  .el-step__title.is-process {
    color: #64befd;
  }
  .el-step__title.is-success {
    color: #ccc;
  }
  .el-step__head.is-success .el-step__icon.is-text {
    border-color: #64befd !important;
    background: #64befd;
  }
  .el-step__head.is-success {
    border-color: #bfbfbf;
  }
  .el-step__icon-inner {
    font-size: 20px;
  }
  .el-date-editor .el-range-separator {
    color: #4d4d4d;
  }
  .el-range-input {
    color: #262626;
  }
  .el-icon-check:before {
    color: #fff;
  }
  .el-icon-success:before {
    color: #67c23a;
  }

  .redAsterisk {
    margin-bottom: 10px;
  }
  .redAsterisk:before {
    content: '*';
    color: #f56c6c;
    margin-right: 4px;
  }

  .el-tag.el-tag--info {
    background-color: #3085cb;
    color: #fff;
    border-color: #3085cb;
    span {
      display: inline-block;
      max-width: 100px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      vertical-align: middle;
    }
  }
  .el-cascader__search-input {
    background: #f2f2f2;
    display: none;
  }
  .el-cascader__search-input::placeholder {
    color: #999;
  }
  .operateIcon-row {
    display: flex;
    align-items: center;
    color: #10a9ff;
    cursor: pointer;
  }
  .operateIcon {
    font-size: 14px;
    cursor: pointer;
    color: #10a9ff;
    padding-right: 5px;
  }

  .filterDiv {
    display: flex;
    margin-bottom: 18px;
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }
    .el-select,
    .el-input {
      width: 280px;
      margin-right: 10px;
    }
  }
  .clickIfShow {
    display: inline-block;
    cursor: pointer;
  }
  .clear {
    margin-top: 10px;
    height: 32px;
  }

  .el-select-dropdown {
    max-width: 280px !important;
  }
}

.repository_popper {
  .el-cascader-panel .el-cascader-menu:first-of-type .el-checkbox {
    display: none !important;
  }

  .el-cascader-menu {
    max-width: 280px;
  }
}
.alarmType {
  .el-cascader-menu {
    max-width: 350px;
    overflow-x: auto;
  }
}
</style>
