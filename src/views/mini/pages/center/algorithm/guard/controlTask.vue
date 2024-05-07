<template>
  <!-- 布控任务 -->
  <div id="newControlTask" v-if="isRouterAlive" ref="newControlTask">
    <el-row>
      <el-col :span="24" style="padding: 0 30px">
        <div v-if="PermissionManage" class="btnMargin">
          <el-button type="primary" @click="handleAdd">{{ $t('algoGuard.addGuard') }}</el-button>
          <el-button type="primary" :disabled="batchBtnShow" @click="handleAllot(1)">
            {{ $t('public.enable') }}
          </el-button>
          <el-button type="danger" :disabled="batchBtnShow" @click="handleAllot(0)">
            {{ $t('public.deactivate') }}
          </el-button>
        </div>
        <!-- 查询和其他操作 -->
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale == 'en' ? '150px' : '110px'"
            ref="form"
            :model="searchForm"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('algoGuard.guardName') + ' ：'" prop="guardName">
                <el-input
                  v-model="searchForm.guardName"
                  auto-complete="off"
                  :placeholder="$t('algoGuard.inputSearchGuard')"
                  clearable
                  class="inputMiddle"
                />
              </el-form-item>
              <el-form-item :label="$t('algoGuard.guardType') + ' ：'" prop="guardType">
                <el-select
                  v-model="searchForm.guardType"
                  auto-complete="off"
                  clearable
                  @change="changeGuardType"
                >
                  <el-option :label="$t('algoGuard.carListGuard')" :value="2"></el-option>
                  <el-option :label="$t('algoGuard.manListGuard')" :value="1"></el-option>
                  <el-option :label="$t('algoGuard.customGuard')" :value="3"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                :label-width="locale == 'en' ? '160px' : '110px'"
                :label="$t('algoGuard.guardLib') + ' ：'"
                prop="guardLib"
              >
                <el-select clearable v-model="searchForm.guardLib" auto-complete="off">
                  <el-option
                    v-for="(item, index) in guardLibList"
                    :key="index"
                    :label="item.repositoryName"
                    :value="item.repositoryId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('public.state') + ' ：'" prop="state">
                <el-select clearable v-model="searchForm.state" auto-complete="off">
                  <el-option :label="$t('public.enable')" :value="1"></el-option>
                  <el-option :label="$t('public.deactivate')" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="flexstart">
              <el-form-item :label="$t('public.searchTime') + ' ：'">
                <el-radio-group v-model="timeType" size="medium">
                  <el-radio-button :label="1" @click="setDIYTime(1)">
                    {{ $t('public.nearlyThreeDays') }}
                  </el-radio-button>
                  <el-radio-button :label="2" @click="setDIYTime(2)">
                    {{ $t('public.nearlySevenSays') }}
                  </el-radio-button>
                  <el-radio-button :label="3" @click="setDIYTime(3)">
                    {{ $t('public.nearly30Days') }}
                  </el-radio-button>
                </el-radio-group>
                <el-date-picker
                  size="default"
                  :shortcuts="pickerOptions && pickerOptions.shortcuts"
                  :disabled-date="pickerOptions && pickerOptions.disabledDate"
                  :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                  popper-class="data-picker"
                  v-model="time"
                  type="datetimerange"
                  :range-separator="$t('public.to')"
                  :start-placeholder="$t('public.startTimePrompt')"
                  :end-placeholder="$t('public.endTimePrompt')"
                  @change="pickerChange"
                  :clearable="false"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <el-button type="primary" @click="handleReset" class="miniBtn">
                {{ $t('public.reset') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <no-table :tableLoading="loading" :tableData="tableData">
          <!-- 表格 -->
          <el-table
            v-if="!loading && tableData.length"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
            @selection-change="handleSelectionChange"
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />

            <el-table-column
              :label="$t('algoGuard.guardName')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.guardName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('algoGuard.guardType')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setGuardType(row.guardType) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('algoGuard.threshold')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.threshold }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('algoGuard.alarmName')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.alarmName }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.state')" min-width="90">
              <template #default="{ row }">
                <span :class="row.enabled == 1 ? 'success' : 'danger'">
                  {{ setEnabled(row.enabled) }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.updateTime')" min-width="120" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span v-if="PermissionManage" class="cell-operate" @click="handleInfo(row)">
                  {{ $t('public.particulars') }}
                </span>
                <span v-if="PermissionManage" class="cell-operate" @click="editInfo(row)">
                  {{ $t('public.edit') }}
                </span>
                <span
                  v-if="PermissionManage && row.enabled == 0"
                  class="cell-operate"
                  @click="handleEnable(1, row)"
                >
                  {{ $t('public.enable') }}
                </span>
                <span
                  v-if="PermissionManage && row.enabled == 1"
                  class="cell-operate danger"
                  @click="handleEnable(0, row)"
                >
                  {{ $t('public.deactivate') }}
                </span>
                <span
                  v-if="PermissionManage"
                  class="cell-operate danger"
                  @click="handleDelete(row)"
                >
                  {{ $t('public.delete') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <pagination
            v-show="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
          ></pagination>
        </no-table>
      </el-col>
    </el-row>
    <!-- 创建布控任务 -->
    <div class="control"></div>

    <add-guard @repositoryChange="handleRepositoryChange"></add-guard>

    <!-- 批量操作 -->
    <batch-operate
      :multipleSelection="multipleSelection"
      :multipleSelectionMany="multipleSelectionMany"
      :what="$t('algoGuard.guard')"
      @getList="getList"
      :operate="operate"
      :batchApi="batchApi"
      whatId="guardId"
      whatName="guardName"
      v-model:visible="batchDialogVisible"
    ></batch-operate>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { getFormatDate, getDIYTime2 } from '@/utils/common/mutil'
import addGuard from './component/addGuard'
import { sStorage } from '@/utils/common/store'
import batchOperate from '@/components/batchOperate' // 批量操作
export default {
  name: 'DeviceGuardTask',
  components: {
    addGuard,
    batchOperate
  },
  data() {
    return {
      multipleSelectionMany: [],
      time: null,
      timeType: '',
      pickerOptions: {
        disabledDate(time) {
          let yester = new Date().getTime()
          return time.getTime() > yester
        }
      },
      batchApi: '',
      batchDialogVisible: false, //批量删除对话框
      operate: '',

      batchBtnShow: true,

      isRouterAlive: true,
      timeSpanList: [],
      maskloading: false, // 点击提交按钮后蒙版
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,

      //布控弹框
      // 创建布控表单
      genderList: [],
      yesOrNoList: [],

      choosedGuardId: '',
      vehicleTypeList: [],
      vehicleColorList: [],
      emotionTypeList: [],
      faceProperty: [],
      carProperty: [],
      taskList: [],

      alarmTypeList: [],
      carPreBrandList: [],
      carSubBrandList: [],
      //jquery
      th: window.innerHeight - 70,
      option: '',
      planType: 0,
      planName: '',

      // 条件搜索
      searchForm: {
        guardName: '',
        guardType: '',
        guardLib: '',
        beginTime: '',
        endTime: '',
        state: ''
      },
      //布控库
      guardLibList: [],
      periodList1: [],
      periodList2: [],

      multipleSelection: [], //表格选中状态存放数组

      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      organizationId: 0,

      operation: 0, // 0:添加, 1:详情, 2:修改
      dialogFormVisible: false, // 添加或者修改
      allotDialogFormVisible: false, //算法分配弹框

      rules2: {},

      //新增算法仓
      sourceTypeList: [],
      guardTypeList: [],
      statusList: [],

      dataForm0: {
        guardName: '',
        guardType: '',
        validDateBegin: '',
        validDateEnd: '',
        remark: ''
      },
      dataForm1: {
        algorithmId: '',
        alarmType: [],
        //公共
        repositoryIds: [],
        threshold: 50,
        sourceType: '',
        sourceId: '',
        cameraName: '',
        hited: 1
      },
      dataForm_Detail: {
        guardId: '',
        guardType: '',
        sourceId: '',
        sourceName: '',
        sourceType: '',
        algorithmId: '',
        algorithmName: ''
      },
      dayTypeList: [],
      tableDataFather: [],
      rulesFather: [],
      hitTableDataFather: [],
      hitTableDataFather_totalNum: 0,
      performTableDataFather: [],
      infoResFather: {},
      peopleList: [],
      carList: [],

      algorithmModelList: [],

      locale: localStorage.getItem('locale')
    }
  },

  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setData()
      this.locale = localStorage.getItem('locale')
    }
  },
  mounted() {
    this.setData()
    this.getGuardLibList()
    //布防列表
    this.getList()
    //模型列表
    this.getAlgorithmModelList()
  },
  activated() {
    
  },
  methods: {
    setData() {
      this.genderList = [
        {
          name: this.$t('algoGuard.man'),
          value: 1
        },
        {
          name: this.$t('algoGuard.woman'),
          value: 2
        }
      ]
      this.yesOrNoList = [
        {
          name: this.$t('algoGuard.have'),
          value: 1
        },
        {
          name: this.$t('algoGuard.without'),
          value: 2
        }
      ]
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
    },
    // 1:近三天 2：近七天 3：近一个月
    setDIYTime(data = 1) {
      this.time = getDIYTime2(data)
      this.date_format()
    },
    // 日期改变联动时间类型
    pickerChange() {
      this.timeType = ''
      this.date_format()
    },
    // 日期格式处理
    date_format() {
      this.searchForm.beginTime =
        this.time != null && this.time.length > 0 ? getFormatDate(this.time[0]) : undefined
      this.searchForm.endTime =
        this.time != null && this.time.length > 0 ? getFormatDate(this.time[1]) : undefined
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
    setStatus(val) {
      this.statusList.map(item => {
        if (val == item.value) {
          val = item.name
        }
      })
      return val
    },
    setEnabled(val) {
      if (val == 0) {
        val = this.$t('public.deactivate')
      } else if (val == 1) {
        val = this.$t('public.enable')
      } else {
        val = ''
      }
      return val
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
    },
    getGuardLibList() {
      this.guardLibList = []
      this.$api
        .getPersonRepositoryList({
          pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.peopleList = this.setRepositoryList(res.repositoryList)
            this.periodList2 = res.repositoryList
            this.guardLibList.push(...this.periodList2)
          }
        })
      this.$api
        .getVehicleRepositoryList({
          pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
        })
        .then(res => {
          if (res.resultCode == 0) {
            this.carList = this.setRepositoryList(res.repositoryList)
            this.periodList1 = res.repositoryList
            this.guardLibList.push(...this.periodList1)
          }
        })
    },
    getPersonList() {},
    getCarList() {},
    setRepositoryList(arr) {
      let options = []
      let obj = {}
      arr.forEach(item => {
        options.push({
          label: item.algorithmName,
          value: item.algorithmId,
          children: []
        })
      })
      options = options.reduce((item, next) => {
        if (!obj[next.value]) {
          item.push(next)
          obj[next.value] = true
        }
        return item
      }, [])

      for (let i = 0; i < options.length; i++) {
        const item = options[i]
        for (let j = 0; j < arr.length; j++) {
          const item1 = arr[j]
          if (item.value == item1.algorithmId) {
            item.children.push({
              label: `${item1.repositoryName} (${
                item1.repositoryType === 0 || item1.repositoryType === 2
                  ? this.$t('repo.blacklist')
                  : this.$t('repo.whitelist')
              })`,
              value: item1.repositoryId,
              type: item1.repositoryType,
              disabled: false
            })
          }
        }
      }

      return options
    },
    handleRepositoryChange({ val, guardType }) {
      if (val.length) {
        let algorithmId = val[0]
        let repositoryId = val[1]
        let algorithmRepositoryIndex =
          guardType === 1
            ? this.peopleList.findIndex(item => item.value === algorithmId)
            : this.carList.findIndex(item => item.value === algorithmId)
        let repository =
          guardType === 1
            ? this.peopleList[algorithmRepositoryIndex].children.find(
                item => item.value === repositoryId
              )
            : this.carList[algorithmRepositoryIndex].children.find(
                item => item.value === repositoryId
              )
        let type = repository.type

        if (guardType === 1) {
          this.peopleList.forEach((algorithm, index) => {
            algorithm.children.forEach(repository => {
              repository.disabled =
                index === algorithmRepositoryIndex ? repository.type !== type : false
            })
          })
        } else {
          this.carList.forEach((algorithm, index) => {
            algorithm.children.forEach(repository => {
              repository.disabled =
                index === algorithmRepositoryIndex ? repository.type !== type : false
            })
          })
        }
      } else {
        if (guardType === 1) {
          this.peopleList.forEach(algorithm => {
            algorithm.children.forEach(repository => {
              repository.disabled = false
            })
          })
        } else {
          this.carList.forEach(algorithm => {
            algorithm.children.forEach(repository => {
              repository.disabled = false
            })
          })
        }
      }
    },
    //改变任务类型 布控库改变
    changeGuardType(val) {
      if (val) {
        this.searchForm.guardLib = ''
        if (val == 1) {
          this.guardLibList = this.periodList2
        } else if (val == 2) {
          this.guardLibList = this.periodList1
        } else {
          this.getGuardLibList()
        }
      } else {
        this.getGuardLibList()
      }
    },
    // 获取布防列表
    getList() {
      this.dataText = ''
      this.loading = true
      let obj = {}
      obj.pageInfo = {
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }
      obj.guardName = this.searchForm.guardName
      if (this.searchForm.guardType !== '') {
        obj.guardType = this.searchForm.guardType
      }
      if (this.searchForm.guardLib !== '') {
        obj.repositoryId = this.searchForm.guardLib
      }
      if (this.searchForm.beginTime !== '') {
        obj.startTime = this.searchForm.beginTime
      }
      if (this.searchForm.endTime !== '') {
        obj.endTime = this.searchForm.endTime
      }
      if (this.searchForm.state !== '') {
        obj.enabled = this.searchForm.state
      }
      this.$api.getNewGuardList(obj).then(res => {
        if (res.guardList && res.guardList.length) {
          this.tableData = res.guardList
          this.totalNum = res.pageInfo.totalNum
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.guardTypeList.length; j++) {
              if (this.tableData[i].type == this.guardTypeList[j].value) {
                this.tableData[i].type = this.guardTypeList[j].name
              }
            }
          }
          this.$nextTick(() => {
            this.$refs.multipleTable?.setScrollTop(0)
          })
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },

    // 获取算法模型列表
    async getAlgorithmModelList() {
      let res = await this.$api.getAlgorithmModelList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
      })
      if (res.resultCode != 0) return
      this.algorithmModelList = res.algorithmModelList
    },

    handleAllot(isEnabled) {
      this.operate = isEnabled == 1 ? this.$t('algoGuard.start') : this.$t('algoGuard.stop')
      this.batchApi = 'enableGuard'

      this.multipleSelectionMany = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        this.multipleSelectionMany.push({
          guardId: this.multipleSelection[i].guardId,
          enabled: isEnabled
        })
      }

      this.batchDialogVisible = true
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 添加
    handleAdd() {
      //重置
      this.choosedSourceType = 1
      this.planType = 0
      this.operation = 0
      this.planName = ''

      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getList()
    },

    //重置
    handleReset() {
      this.searchForm = {
        guardName: '',
        guardType: '',
        guardLib: '',
        beginTime: '',
        endTime: '',
        state: ''
      }
      this.time = null
      this.timeType = ''
    },
    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.batchBtnShow = val.length ? false : true
    },

    doEnable(obj, mess) {
      this.$api.enableGuard(obj).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: mess
          })
          this.getList()
        }
      })
    },
    handleEnable(enable, row) {
      let enableObj = {
        guardId: row.guardId
      }
      if (enable == 0) {
        enableObj.enabled = 0
        this.doEnable(enableObj, this.$t('algoGuard.stopSucc'))
      } else if (enable == 1) {
        enableObj.enabled = 1
        this.doEnable(enableObj, this.$t('algoGuard.startSucc'))
      }
    },

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

    //详情
    async handleInfo(row, type = 1) {
      this.choosedGuardId = row.guardId
      await this.getGuardInfo(this.choosedGuardId)
      let sourceTag = 0
      if (this.dataForm_Detail?.sourceList) {
        for (let i = 0; i < this.dataForm_Detail.sourceList.length; i++) {
          if (!this.dataForm_Detail.sourceList[i].sourceName) {
            sourceTag += 1
          }
        }
      }

      if (sourceTag == 0) {
        if (type != 1) return Promise.resolve(true)
        this.operation = 2
        this.$router.push({
          name: 'GuardTaskDetail',
          params: { id: this.choosedGuardId }
        })
      } else if (sourceTag < this.dataForm_Detail.sourceList.length) {
        this.$confirm(this.$t('algoGuard.ifRemoveSource'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            this.$api.delSource({ guardId: row.guardId }).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('algoGuard.removeSucc')
                })
                this.getList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('algoGuard.removeCanceled')
            })
          })
      } else if (sourceTag == this.dataForm_Detail.sourceList.length) {
        this.$confirm(this.$t('algoGuard.shouldDelGuard'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning',
          closeOnClickModal: false
        })
          .then(() => {
            this.$api.deleteNewGuardInfo({ guardId: row.guardId }).then(res => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: this.$t('public.delSuccess')
                })
                this.getList()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('public.canceledDelete')
            })
          })
      }
    },

    //编辑任务信息
    async editInfo(row) {
      const flag = await this.handleInfo(row, 2)
      if (flag) {
        this.choosedGuardId = row.guardId
        await this.getGuardInfo(this.choosedGuardId)
        this.operation = 2
        this.dialogFormVisible = true
      }
    },
    async getGuardInfo(guardId) {
      let res = await this.$api.getNewGuardInfo({ guardId: guardId })
      if (res.resultCode == 0) {
        this.infoResFather = res
        this.dataForm_Detail = {
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

        this.tableDataFather = [
          { key: this.$t('algoGuard.taskName'), value: res.guardName },
          {
            key: this.$t('algoGuard.taskStatus'),
            value: this.setStatus(res.enabled)
          },
          {
            key: this.$t('algoGuard.taskType'),
            value: this.setGuardType(res.guardType)
          },
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
        pageInfo: { pageNum: this.pageNum, pageSize: this.pageSize },
        guardIds: [guardId]
      }
      let res_h = await this.$api.getGuardHitList(_params)
      if (res_h.resultCode == 0) {
        this.hitTableDataFather = res_h.guardHitList
        this.hitTableDataFather_totalNum = res_h.pageInfo.totalNum
      }
    },

    // 修改
    async handleEdit(row) {
      let res = await this.$api.getNewGuardInfo({ guardId: row.guardId })
      if (res.resultCode == 0) {
        this.choosedSourceType = res.sourceType
        if (res.sourceType == 1) {
          this.choosedCameras = res.contentName
          this.camerasArray = res.content.split(',')
        } else if (res.sourceType == 4) {
          this.dataForm1.sourceId = res.sourceId
        }

        this.dataForm0.guardName = res.guardName

        if (res.periods[0].dayType == 0) {
          this.planType = 1
        } else {
          this.planType = 0
        }

        this.timeSpanList = res.periodList
      }
      this.choosedGuardId = row.guardId
      this.dialogFormVisible = true

      this.operation = 2
    },

    // 删除
    handleDelete(row) {
      this.$confirm(
        row.enabled == 1 ? this.$t('algoGuard.ifDelEnabledGuard') : this.$t('algoGuard.ifDelGuard'),
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        }
      )
        .then(() => {
          this.$api.deleteNewGuardInfo({ guardId: row.guardId }).then(response => {
            if (response.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })

              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete')
          })
        })
    },

    // 分页
    getListByPage() {
      this.getList()
    }
  }
}
</script>

<style lang="scss">
#newControlTask {
  .el-dialog {
    .el-dialog__body {
      padding: 15px 20px 5px;

      .el-checkbox__inner {
        background: none;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        background: #409eff;
      }

      .el-checkbox__label {
        color: #4d4d4d !important;
      }
    }

    .filterDiv {
      display: flex;

      .el-select,
      .el-input {
        width: 290px;
        margin-right: 10px;
      }
    }
  }
}
</style>
