<template>
  <!-- 布控任务 -->
  <div id="newControlTask" ref="newControlTask">
    <div class="filter-wrapper">
      <el-form :inline="true" class="demo-form-inline" ref="form" :model="searchForm">
        <el-form-item prop="adminLName" :label="$t('application.taskName')">
          <el-input
            v-model="searchForm.guardName"
            auto-complete="off"
            :placeholder="$t('application.taskName', { name: $t('public.pleaseInput') })"
            clearable
            class="inputMiddle"
          />
        </el-form-item>
        <el-form-item :label="$t('application.taskType')" prop="guardType">
          <el-select
            :placeholder="$t('application.taskType')"
            @change="handleChangeType"
            clearable
            v-model="searchForm.guardType"
            class="filter-m-s"
          >
            <el-option :label="$t('public.all')" value=""></el-option>
            <el-option :label="$t('application.faceControl')" :value="1"></el-option>
            <el-option :label="$t('application.vehicleControl')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('application.library')" prop="repositoryId">
          <el-select
            :disabled="searchForm.guardType == ''"
            clearable
            v-model="searchForm.repositoryId"
            :placeholder="$t('public.placeholderSelect', { type: $t('application.library') })"
          >
            <el-option
              v-for="(item, index) in guardLibList"
              :key="index"
              :label="item.repositoryName"
              :value="item.repositoryId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('public.startTime')">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :picker-options="pickerOptions"
            :placeholder="$t('public.startTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('public.endTime')">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            default-time="23:59:59"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            :placeholder="$t('public.endTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="miniBtn">{{ $t('public.search') }}</el-button>
          <el-button type="default" @click="handleReset" class="miniBtn">{{ $t('public.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="control">
      <CardList
        :data="tableData"
        :total="totalNum"
        :columns="3"
        :page-no="pageNum"
        :page-size="pageSize"
        :page-sizes="[9, 18, 30, 50, 100]"
        :pager="true"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template slot-scope="{ item }">
          <div class="control-item" @click="handleInfo(item)">
            <div class="item-header">
              <div class="control-name">
                <img v-if="item.guardType == 1" class="icon" src="./images/person.png" alt="" />
                <img v-else class="icon" src="./images/car.png" alt="" />
                <span class="guard-name" :title="item.guardName">{{ item.guardName }}</span>
              </div>
              <div class="control-status" :class="item.enabled == 0 ? 'gray' : 'green'">
                {{ item.enabled == 0 ? $t('application.stop') : $t('application.run') }}
              </div>
            </div>
            <div class="item-content">
              <div class="first">
                <div class="first-item">
                  <div class="item-label">{{ $t('application.control') }} {{ $t('application.type') }}：</div>
                  <div
                    class="item-value"
                    :title="item.guardType == 1 ? $t('application.personControl') : $t('application.carControl')"
                  >
                    {{ item.guardType == 1 ? $t('application.personControl') : $t('application.carControl') }}
                  </div>
                </div>
                <div class="first-item">
                  <div class="item-label">
                    {{ item.guardType == 1 ? $t('application.controlPerson') : $t('application.controlCar') }}：
                  </div>
                  <div class="item-value">{{ item.guardTargetCount ? item.guardTargetCount : 0 }}</div>
                </div>
                <div class="first-item">
                  <div class="item-label">{{ $t('application.alarmNum') }}：</div>
                  <div class="item-value">{{ item.alarmCount ? item.alarmCount : 0 }}</div>
                </div>
              </div>
              <div class="item">
                <div class="item-label">{{ $t('application.timeRange') }}：</div>
                <div class="item-value">{{ item.beginTime }}-{{ item.endTime }}</div>
              </div>
              <div class="item">
                <div class="item-label">{{ $t('public.createTime') }}：</div>
                <div class="item-value">{{ item.createTime }}</div>
              </div>
            </div>
          </div>
        </template>
      </CardList>
    </div>

    <guard-detail
      :info="infoResFather"
      :guardId="choosedGuardId"
      :visible="detailVisibleDialog"
      @close="handleClose"
    ></guard-detail>
  </div>
</template>

<script>
import CardList from '../../../../components/CardList'
import guardDetail from './component/guardDetail'
import {
  getNewGuardList,
  getGuardInfo,
  delSource,
  deleteGuardInfo,
  queryRepositoryList,
  queryVehicleRepositoryList,
} from '../../../../utils/api'

export default {
  components: {
    guardDetail,
    CardList,
  },
  data() {
    return {
      pickerOptions: {
        // selectableRange: (() => {
        //   let data = new Date()
        //   let hour = data.getHours()
        //   let minute = data.getMinutes()
        //   let second = data.getSeconds()
        //   return [`00:00:00-${hour}:${minute}:${second}`]
        // })(),
        disabledDate(time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() > Date.now()
        },
      },
      // 条件搜索
      searchForm: {
        guardName: '',
        guardType: '',
        repositoryId: '',
        startTime: '',
        endTime: '',
      },
      guardTypeList: [
        {
          name: '人员名单布控',
          value: 1,
        },
        {
          name: '车辆名单布控',
          value: 2,
        },
      ],
      dayTypeList: [
        {
          name: '周一',
          value: 1,
        },
        {
          name: '周二',
          value: 2,
        },
        {
          name: '周三',
          value: 3,
        },
        {
          name: '周四',
          value: 4,
        },
        {
          name: '周五',
          value: 5,
        },
        {
          name: '周六',
          value: 6,
        },
        {
          name: '周日',
          value: 7,
        },
      ],
      statusList: [
        {
          name: '等待运行',
          value: 0,
        },
        {
          name: '运行中',
          value: 1,
        },
      ],
      tableData: [], // 表格数据
      pageNum: 1,
      pageSize: 9,
      totalNum: 0, // 总数量
      detailVisibleDialog: false,
      guardLibList: [],
      dataForm_Detail: {
        guardId: '',
        guardType: '',
        sourceId: '',
        sourceName: '',
        sourceType: '',
        algorithmId: '',
        algorithmName: '',
      },
      infoResFather: {
        repositoryNames: [],
      },
      choosedGuardId: '',
    }
  },
  filters: {
    formatType(val) {
      // 1_人员名单布控 2_车辆名单布控 3_自定义布控'
      switch (val) {
        case 1:
          return '人员名单布控'
        case 2:
          return '车辆名单布控'
        case 3:
          return '自定义布控'
        default:
          return '自定义布控'
      }
    },
  },
  created() {},
  mounted() {
    //布防列表
    this.handleGetList()
  },
  methods: {
    handleChangeType(type) {
      console.log(type)
      this.$set(this.searchForm, 'repositoryId', '')
      this.handleGetRepository(type)
    },
    handleGetRepository(type) {
      console.log(type)
      let params = {
        // repositoryType: type,
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
        },
      }
      if (type == 1) {
        //人员
        queryRepositoryList(params).then((res) => {
          if (res.resultCode == 0) {
            this.guardLibList = res.repositoryList
          }
        })
      } else {
        //车辆
        queryVehicleRepositoryList(params).then((res) => {
          if (res.resultCode == 0) {
            this.guardLibList = res.repositoryList
          }
        })
      }
    },
    handlePageChange(pageNo) {
      this.pageNum = pageNo
      this.handleGetList()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.handleGetList()
    },
    handleClose() {
      this.detailVisibleDialog = false
    },
    handleSearch() {
      if (this.searchForm.startTime && !this.searchForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (!this.searchForm.startTime && this.searchForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (new Date(this.searchForm.endTime).getTime() > new Date().getTime()) {
        this.$message.warning(this.$t('public.endGtCur'))
        return
      }
      if (new Date(this.searchForm.startTime).getTime() > new Date(this.searchForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      this.pageNum = 1
      this.handleGetList()
    },
    // 获取布防列表
    handleGetList() {
      let params = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
        },
        ...this.searchForm,
      }
      getNewGuardList(params).then((res) => {
        if (res.resultCode == 0) {
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
          } else {
            this.tableData = []
            this.totalNum = 0
          }
        }
      })
    },
    //重置
    handleReset() {
      this.searchForm = {
        guardName: '',
        guardType: '',
        repositoryId: '',
        startTime: '',
        endTime: '',
        state: '',
      }
      this.pageNum = 1
      this.handleGetList()
    },

    //获取列表展示中的运行周期数组
    getDayList(data) {
      let dataInfo = {}
      data.forEach((item, index) => {
        let { dayType } = item
        if (!dataInfo[dayType]) {
          dataInfo[dayType] = {
            dayType,
            child: [],
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
          time: timeList,
        })
      }
      return dayList
    },

    //详情
    async handleInfo(row) {
      this.choosedGuardId = row.guardId
      await this.handleGetGuardInfo(this.choosedGuardId)
      let sourceTag = 0
      for (let i = 0; i < this.dataForm_Detail.sourceList.length; i++) {
        if (!this.dataForm_Detail.sourceList[i].sourceName) {
          sourceTag += 1
        }
      }
      if (sourceTag == 0) {
        this.operation = 2
        this.detailVisibleDialog = true
      } else if (sourceTag < this.dataForm_Detail.sourceList.length) {
        this.$confirm('该布控任务的部分布控源被删除, 请移除被删除的布控源', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        })
          .then(() => {
            delSource({ guardId: row.guardId }).then((res) => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                })
                this.pageNum = 1
                this.handleGetList()
              }
            })
          })
          .catch((err) => err)
      } else if (sourceTag == this.dataForm_Detail.sourceList.length) {
        this.$confirm('该布控任务的全部布控源被删除, 请删除该布控任务', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal: false,
        })
          .then(() => {
            deleteGuardInfo({ guardId: row.guardId }).then((res) => {
              if (res.resultCode === 0) {
                this.$message({
                  type: 'success',
                  message: '删除成功',
                })
                this.pageNum = 1
                this.handleGetList()
              }
            })
          })
          .catch((err) => err)
      }
    },
    async handleGetGuardInfo(guardId) {
      let res = await getGuardInfo({ guardId: guardId })
      if (res.resultCode == 0) {
        this.infoResFather = {
          ...res,
          planType: res.periods[0].dayType == 0 ? 1 : 0,
          algoName: res.repositoryList.length ? res.repositoryList[0].algorithmId : '',
          repositoryIds: res.repositoryList.map((r) => r.repositoryId),
          repositoryNames: res.repositoryList.map((r) => r.repositoryName),
        }
        this.dataForm_Detail = {
          guardId: res.guardId,
          guardType: this.setGuardType(res.guardType),
          sourceList: res.sourceList,
          sourceId: res.sourceList && res.sourceList.length ? res.sourceList[0].sourceId : '',
          sourceName: res.sourceList && res.sourceList.length ? res.sourceList[0].sourceName : '',
          sourceType: res.sourceList && res.sourceList.length ? res.sourceList[0].sourceType || res.sourceType : '',
          algorithmId: res.algorithmId,
          algorithmName: res.algorithmName,
        }

        let dayList = this.getDayList(res.periods)
        if (res.periods && res.periods.length && res.periods[0].dayType == 0) {
          this.planType = 1
        } else {
          this.planType = 0
        }

        this.tableDataFather = [
          { key: '任务名称', value: res.guardName },
          { key: '任务状态', value: this.setStatus(res.enabled) },
          { key: '任务类型', value: this.setGuardType(res.guardType) },
          { key: '布控库', value: res.repositoryList },
          { key: '阈值', value: res.threshold },
          {
            key: '布控时间',
            value: res.beginTime
              ? res.beginTime.substring(0, 10) == res.endTime.substring(0, 10)
                ? res.beginTime + '~' + res.endTime.substring(11)
                : res.beginTime + '~' + res.endTime
              : '',
          },
          { key: '运行周期', value: dayList },
          { key: '告警名称', value: res.alarmName },
          { key: '创建时间', value: res.createTime },
          { key: '任务描述', value: res.remark },
        ]

        this.rulesFather = res.rules

        let compareOnj = {
          '>': '大于',
          '&gt;': '大于',
          '>=': '大于或等于',
          '&gt;=': '大于或等于',
          '<': '小于',
          '&lt;': '小于',
          '<=': '小于或等于',
          '&lt;=': '小于或等于',
          '==': '等于',
          '!=': '不等于',
          in: '包含',
          between: '介于',
          like: '模糊匹配',
        }
        let compareOnj1 = {
          '&gt;': '>',
          '&gt;=': '>=',
          '&lt;': '<',
          '&lt;=': '<=',
        }
        this.rulesFather.forEach((item) => {
          item.compares = compareOnj[item.compare]
          item.compare = compareOnj1[item.compare] ? compareOnj1[item.compare] : item.compare
          item.remark = item.propertySpecsName ? item.propertySpecsName + '-' + item.value : item.value
        })
      }
    },
    setStatus(val) {
      this.statusList.map((item) => {
        if (val == item.value) {
          val = item.name
        }
      })
      return val
    },
    setGuardType(val) {
      if (val) {
        this.guardTypeList.map((item) => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setDayType(val) {
      if (val) {
        this.dayTypeList.map((item) => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
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
        // this.choosedCameras = res.contentName

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
    handleDelete(index, row) {
      this.$confirm(this.$t('algoGuard.ifDelGuard'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
      })
        .then(() => {
          this.$api.deleteNewGuardInfo({ guardId: row.guardId }).then((response) => {
            if (response.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.bulkDelSuccess'),
              })

              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('public.canceledDelete'),
          })
        })
    },
  },
}
</script>

<style lang="scss">
.live {
  margin-left: 30px;
  cursor: pointer;
  padding: 8px 25px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #1fbaf2;
  color: #fff;
  font-size: 14px;
  img {
    width: 22px;
    margin-right: 5px;
  }
}
.replay {
  cursor: pointer;
  padding: 8px 15px;
  box-sizing: border-box;
  border-radius: 4px;
  background-color: #1fbaf2;
  img {
    width: 22px;
    margin-right: 5px;
  }
}
#newControlTask {
  width: 1700px;
  height: calc(100% - 80px);
  margin: 50px auto 0;
  .search-btn {
    position: absolute;
    right: 0;
    // bottom: 20px;
    bottom: 10px;
  }
  .filter-wrapper {
    .filter-m-s {
      width: 180px;
    }
  }
  .control {
    height: calc(100% - 20px);
  }
  .control-item {
    background-color: #204b74;
    color: #fff;
    padding: 20px;
    box-sizing: border-box;
    font-size: 14px;
    border-radius: 4px;
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      .control-name {
        flex: 1;
        font-size: 18px;
        display: flex;
        align-items: center;
        overflow: hidden;
        .guard-name {
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          /*文字超出宽度则显示ellipsis省略号*/
          text-overflow: ellipsis;
          padding-right: 10px;
          box-sizing: border-box;
        }
        .icon {
          width: 18px;
          height: 18px;
          margin-right: 10px;
        }
      }
      .control-status {
        font-size: 18px;
        position: relative;
        padding-left: 15px;
        &::before {
          content: '';
          width: 8px;
          height: 8px;
          position: absolute;
          border-radius: 50%;
          overflow: hidden;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
        &.gray {
          color: #aeaeae;
          &::before {
            background-color: #aeaeae;
          }
        }
        &.green {
          color: #17cd57;
          &::before {
            background-color: #17cd57;
          }
        }
      }
    }
  }
  .item-content {
    .item-label {
      color: #1efffc;
      white-space: nowrap;
    }
    .item-value {
      overflow: hidden;
      white-space: nowrap;
      /*文字超出宽度则显示ellipsis省略号*/
      text-overflow: ellipsis;
    }
    .first {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      overflow: hidden;
      .first-item {
        display: flex;
        overflow: hidden;
        flex: 3;
        &:first-child {
          flex: 5;
        }
        &:last-child {
          flex: 4;
        }
      }
    }
    .item {
      margin-bottom: 10px;
      display: flex;
    }
  }
}
</style>
