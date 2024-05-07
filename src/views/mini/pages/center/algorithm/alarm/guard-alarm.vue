<template>
  <!-- 布控告警 -->
  <div id="guard-alarm" v-if="isRouterAlive" ref="guardAlarm">
    <el-form
      class="advanced-query-form"
      :label-width="locale == 'en' ? '125px' : '100px'"
      ref="queryForm"
      :model="queryParams"
      label-position="left"
    >
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="24" :lg="17" :xl="19">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-show="1 < count">
              <el-form-item :label="$t('alarmLinkage.alarmDev') + ':'" prop="deviceIds">
                <el-input
                  ref="choosedCamerasRef"
                  v-model="contentName"
                  :placeholder="$t('alarmList.selectACamera')"
                  class="newCameras"
                  @focus="openDialog"
                >
                  <template #suffix>
                    <svg-icon icon-class="add-input" class-name="el-input__icon" />
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-show="2 < count">
              <el-form-item :label="$t('deviceCamera.addGuard') + ':'" prop="guardIds">
                <select-guard ref="cameraSelector" v-model="queryParams.guardIds"></select-guard>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-show="3 < count">
              <el-form-item :label="$t('alarmList.alarmTime') + ':'" prop="alarmTime">
                <el-date-picker
                  :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                  :shortcuts="pickerOptions && pickerOptions.shortcuts"
                  :disabled-date="pickerOptions && pickerOptions.disabledDate"
                  :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                  ref="datePicker"
                  v-model="alarmTimeRange"
                  type="datetimerange"
                  align="right"
                  unlink-panels
                  clearable
                  value-format="YYYY-MM-DD HH:mm:ss"
                  :range-separator="$t('public.to')"
                  :start-placeholder="$t('public.startTimePrompt')"
                  :end-placeholder="$t('public.endTimePrompt')"
                  @change="dateRangeChange"
                  style="width: 100%"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-show="4 < count">
              <el-form-item :label="$t('algoGuard.controlType') + ':'" prop="guardType">
                <el-select clearable v-model="queryParams.guardType" @change="getAlgoList">
                  <el-option
                    v-for="(item, index) in guardTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              v-show="5 < count && queryParams.guardType"
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="8"
            >
              <el-form-item
                style="white-space: nowrap"
                :label="$t('guradAlarm.algo') + '：'"
                prop="algorithmId"
              >
                <el-select
                  v-model="queryParams.algorithmId"
                  :placeholder="$t('algoGuard.selectAlgo')"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in algorithmList"
                    :key="index"
                    :label="item.algorithmName"
                    :value="item.algorithmId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col
              :xs="24"
              :sm="24"
              :md="12"
              :lg="12"
              :xl="8"
              v-show="6 < count && queryParams.guardType === 2"
            >
              <el-form-item :label="$t('retrieval.pnr') + ':'" prop="lpn">
                <el-input v-model="queryParams.lpn" clearable />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12" :lg="12" :xl="8" v-show="7 < count">
              <el-form-item :label="$t('newAlarm.alarmLevel') + ' ：'" prop="alarmLevel">
                <el-select
                  v-model="queryParams.alarmLevel"
                  :placeholder="$t('newAlarm.pleaseSelect')"
                  clearable
                >
                  <el-option :label="$t('newAlarm.all')" :value="false" />
                  <el-option
                    v-for="item in alarmLevelList"
                    :key="item.alarmLevelId"
                    :label="locale == 'en' ? item.alarmLevelEnName : item.alarmLevelName"
                    :value="item.alarmLevelId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24" :lg="7" :xl="5">
          <div class="search-btn">
            <el-button type="primary" class="miniBtn" @click="handleQuery">
              {{ $t('public.search') }}
            </el-button>
            <el-button class="miniBtn" @click="resetQuery">
              {{ $t('public.reset') }}
            </el-button>
            <div class="manyCondition inputMiddle" @click="advancedSearch">
              <span>{{ $t('public.manyCondition') }}</span>
              <span :class="expand ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></span>
            </div>
            <div class="inputMiddle switch-checkered">
              <div class="checkered">
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('alarmList.listDisplay')"
                  placement="top"
                >
                  <div
                    :class="this.childIndex == 1 ? 'actives' : ''"
                    class="checkered1"
                    @click="divchange(1)"
                  >
                    <img
                      src="@/assets/img/common/list.png"
                      alt
                      style="display: inline-block; margin: 0 auto"
                    />
                  </div>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="$t('alarmList.gridDisplay')"
                  placement="top"
                >
                  <div
                    :class="this.childIndex == 2 ? 'actives' : ''"
                    class="checkered2"
                    @click="divchange(2)"
                  >
                    <i class="el-icon-menu" style="font-size: 20px" />
                  </div>
                </el-tooltip>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <div
      :style="{ height: tableHeight + 'px' }"
      v-loading="loading"
      :element-loading-text="$t('public.loading')"
      
    >
      <div v-if="!loading && !tableData.length" class="tableNOdata">
        <img src="@/assets/img/common/NOdata.png" alt />
        <p>{{ $t('public.noData') }}</p>
      </div>
      <!-- 表格 -->
      <el-table
        v-if="!loading && tableData.length && childIndex === 1"
        ref="multipleTable"
        :data="tableData"
        style="width: 100%"
        height="calc(100% - 56px)"
        :row-class-name="tableRowClassName"
        class="elTable"
        border
      >
        <el-table-column show-overflow-tooltip :label="$t('public.sn')">
          <template #default="{ $index }">
            <span>
              {{ $index + (queryParams.pageInfo.pageNum - 1) * queryParams.pageInfo.pageSize + 1 }}
            </span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('alarmList.alarmContent')" min-width="120">
          <template #default="{ row }">
            <div style="text-align: left">
              <el-image class="detect-image" :src="row.previewDetectImage"></el-image>
              <span class="task-name">
                {{ row.guardName
                }}{{
                  row.hited == 1
                    ? $t('alarmList.hitType1')
                    : row.hited == 2
                    ? $t('alarmList.hitType2')
                    : ''
                }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('algoGuard.guardName')"
          show-overflow-tooltip
          prop="guardName"
        />
        <el-table-column
          :label="$t('alarmLinkage.devName')"
          show-overflow-tooltip
          prop="deviceName"
        />
        <el-table-column :label="$t('metadata.cameraID')" show-overflow-tooltip prop="deviceId" />
        <el-table-column :label="$t('alarmList.alarmTime')" show-overflow-tooltip prop="hitTime" />
        <el-table-column :label="$t('public.alarmLevel')" show-overflow-tooltip prop="alarmLevel">
          <template #default="{ row }">
            <span class="bgColor" :style="styleObj(row.alarmLevel, 'color')">
              {{
                selectDictLabel(alarmLevelList, row.alarmLevel, {
                  key: locale == 'en' ? 'alarmLevelEnName' : 'alarmLevelName',
                  value: 'alarmLevelId'
                })
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('algoGuard.alarmName')"
          show-overflow-tooltip
          prop="alarmName"
        />

        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span class="cell-operate" @click="handleInfo(row)">
              {{ $t('public.particulars') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div
        class="table-cards-wrapper"
        ref="tableCards"
        v-if="!loading && tableData.length && childIndex === 2"
      >
        <div class="table-cards">
          <el-card v-for="item in tableData" :key="item.alarmId" :body-style="{ padding: '0px' }">
            <div class="img-content">
              <div class="img-content-item">
                <el-image
                  fit="fill"
                  :src="item.previewDetectImage"
                  :preview-src-list="[item.previewDetectImage]"
                ></el-image>
                <span class="img-type-tips" :title="$t('metadata.snapImg')">
                  {{ $t('metadata.snapImg') }}
                </span>
                <span
                  class="lpn-tips"
                  v-if="item.hitType === '2' && item.metadata.lpn"
                  :title="item.metadata.lpn"
                >
                  {{ item.metadata.lpn }}
                </span>
              </div>
              <div class="img-content-item">
                <el-image
                  v-if="item.hited == 1"
                  fit="fill"
                  :src="item.hitType === '1' ? item.previewFacePhoto : item.previewVehiclePhoto"
                  :preview-src-list="[
                    item.hitType === '1' ? item.previewFacePhoto : item.previewVehiclePhoto
                  ]"
                ></el-image>
                <el-image
                  v-else
                  fit="fill"
                  :src="item.hitType === '1' ? noHitImg.person : noHitImg.vehicle"
                ></el-image>
                <span
                  class="img-type-tips"
                  v-if="item.hited == 1"
                  :title="item.repositoryName || $t('metadata.idPhoto')"
                >
                  {{ item.repositoryName || $t('metadata.idPhoto') }}
                </span>
                <span
                  class="lpn-tips"
                  v-if="item.hitType === '2' && item.lpn && item.hited == 1"
                  :title="item.lpn"
                >
                  {{ item.lpn }}
                </span>
              </div>
              <span class="similarity" v-if="item.hitType === '1' && item.similarity">
                {{ Number(item.similarity).toFixed(2) }}%
              </span>
            </div>
            <div class="guard-info" @click="handleInfo(item)">
              <span class="guard-info-title">{{ item.guardName }}</span>
              <span class="guard-info-item">{{ item.alarmName }}</span>
              <span class="guard-info-item">{{ item.hitTime }}</span>
              <span class="guard-info-item">{{ item.deviceName }}</span>
              <div class="clearfix bottom">
                <el-tag :style="styleObj(item.alarmLevel, 'background')" effect="dark">
                  {{
                    selectDictLabel(alarmLevelList, item.alarmLevel, {
                      key: locale == 'en' ? 'alarmLevelEnName' : 'alarmLevelName',
                      value: 'alarmLevelId'
                    })
                  }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>
      </div>
      <!--分页-->
      <Pager
        v-if="!loading && total > 0"
        :total="total"
        :realTotal="realTotal"
        v-model:pageNum="queryParams.pageInfo.pageNum"
        v-model:limit="queryParams.pageInfo.pageSize"
        @pagination="getList"
        @continueSearch="handleContinueSearch"
      />
    </div>

    <camera-selector
      :title="$t('analysisTask.selectCamara')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      :device-type="1"
    />

    <guard-alarm-detail v-model:visible="detailDialogVisible" />
  </div>
</template>

<script>
import { Menu as ElIconMenu } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import CameraSelector from '@components/cameraSelector'
import GuardAlarmDetail from './component/guard-alarm-detail'
import SelectGuard from './component/select-guard'
import Pager from './pager'
import { handleGetPreview } from '@/utils/common/preViewImg'
import { sStorage } from '@/utils/common/store'
export default {
  components: {
    SelectGuard,
    CameraSelector,
    GuardAlarmDetail,
    Pager,
    ElIconMenu
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      queryParams: {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        guardIds: undefined,
        beginTime: undefined,
        endTime: undefined,
        deviceIds: undefined,
        alarmLevel: undefined,
        guardType: undefined,
        lpn: undefined,
        algorithmId: undefined
      },
      algorithmList: [],
      alarmTimeRange: undefined,
      contentName: undefined,
      dialogDeviceVisible: false,
      expand: false,
      queryFormCount: 4,
      loading: false,
      tableHeight: 900,
      tableData: [],
      total: 0,
      realTotal: 0,
      maxTotal: 10000,
      detailDialogVisible: false,
      dataForm: {},
      childIndex: 1,
      alarmLevelList: [],
      noHitImg: {
        person: require('@/assets/img/common/noHits_person.png'),
        vehicle: require('@/assets/img/common/noHits_vehicle.png')
      },
      dayjs
    }
  },
  name: 'GuardAlarm',
  computed: {
    pickerOptions() {
      return {
       shortcuts: [
          {
            text: this.$t('public.nearlyThreeDays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 2)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearlySevenSays'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6)
              return [start, end]
            }
          },
          {
            text: this.$t('public.nearly30Days'),
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
              return [start, end]
            }
          }
        ]
      }
    },
    guardTypeList() {
      return [
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
    },
    count() {
      return this.expand ? 11 : this.queryFormCount
    }
  },
  created() {
    window.addEventListener('resize', this.getQueryFormCount)
    this.getQueryFormCount()
    this.getAlarmLevel()
    this.initTime()
    this.getList()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.getQueryFormCount)
  },
  methods: {
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
        if (res && res.alarmLevelList) {
          this.alarmLevelList = res.alarmLevelList
        }
      })
    },
    getList() {
      this.loading = true
      let queryParams = JSON.parse(JSON.stringify(this.queryParams))
      queryParams.alarmLevel = queryParams.alarmLevel ? [queryParams.alarmLevel] : undefined
      this.$api
        .getGuardHitList(queryParams)
        .then(res => {
          if (res.guardHitList && res.guardHitList.length) {
            this.tableData = res.guardHitList.map(item => {
              return {
                ...item,
                ...{
                  previewCaptureImage: handleGetPreview(item.captureImage),
                  previewDetectImage: handleGetPreview(item.detectImage),
                  previewVehiclePhoto: handleGetPreview(item.vehiclePhoto),
                  previewFacePhoto: handleGetPreview(item.facePhoto)
                }
              }
            })
            this.total =
              res.pageInfo.totalNum > this.maxTotal ? this.maxTotal : res.pageInfo.totalNum
            this.realTotal = res.realTotal
            this.$nextTick(() => {
              this.$refs.multipleTable?.setScrollTop(0);
              this.$refs.tableCards.scrollTop = 0;
            });
          } else {
            this.tableData = []
            this.total = 0
            this.realTotal = 0
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    openDialog() {
      this.dialogDeviceVisible = true
      this.$refs.choosedCamerasRef.blur()
    },
    getAlgoList() {
      this.tableHeight = this.queryParams.guardType === 2 ? 748 : 800
      let obj = {
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        modelType: 1,
        netType: this.$getNetType()
      }
      if (this.queryParams.guardType == 1) {
        obj.algorithmType = 'FACE_RECOGNIZE'
      } else if (this.queryParams.guardType == 2) {
        obj.algorithmType = 'VEHICLE_RECOGNIZE'
      } else {
        obj.algorithmType = null
      }
      this.queryParams.algorithmId = undefined
      this.$api.queryNewAlgorithmList(obj).then(res => {
        if (res.resultCode == 0) {
          this.algorithmList = res.algorithmList
        }
      })
    },
    initTime() {
      const end = this.dayjs(new Date()).format('YYYY-MM-DD')
      const start = this.dayjs(
        new Date().setTime(new Date().getTime() - 3600 * 1000 * 24 * 7)
      ).format('YYYY-MM-DD')
      this.queryParams.beginTime = start + ' 00:00:00'
      this.queryParams.endTime = end + ' 23:59:59'
      this.alarmTimeRange = [start + ' 00:00:00', end + ' 23:59:59']
    },
    dateRangeChange(val) {
      this.queryParams.beginTime = val != null ? val[0] : undefined
      this.queryParams.endTime = val != null ? val[1] : undefined
    },
    async getCameras(cameras) {
      this.contentName = cameras.map(item => item.name).join(',')
      this.queryParams.deviceIds = cameras.map(item => item.id)
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageInfo.pageNum = 1
      this.dateRangeChange(this.alarmTimeRange)
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.queryParams = {
        pageInfo: {
          pageNum: 1,
          pageSize: 20
        },
        guardIds: undefined,
        beginTime: undefined,
        endTime: undefined,
        deviceIds: undefined,
        guardType: undefined,
        lpn: undefined,
        alarmLevel: undefined
      }
      this.$refs.cameraSelector.selected = []
      this.initTime()
      this.$resetForm('queryForm')
      this.contentName = undefined

      this.handleQuery()
    },
    /** 高级搜索按钮操作 */
    advancedSearch() {
      this.expand = !this.expand
      this.tableHeight = this.expand ? 800 : 900
    },
    getQueryFormCount() {
      let winW = window.innerWidth
      switch (true) {
        case winW >= 1920:
          this.queryFormCount = 4
          break
        case winW >= 1200 && winW < 1920:
          this.queryFormCount = 3
          break
        case winW >= 992 && winW < 1200:
          this.queryFormCount = 3
          break
        case winW >= 768 && winW < 992:
          this.queryFormCount = 2
          break
        case winW < 768:
          this.queryFormCount = 2
          break
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 === 1 ? '' : 'success-row'
    },
    handleInfo(row) {
      this.dataForm = JSON.parse(JSON.stringify(row))
      this.detailDialogVisible = true
    },
    // 缩略图、列表显影操作
    divchange(index) {
      this.childIndex = index
    },
    handleContinueSearch() {
      /*
       * 默认搜搜结果数据，时间倒序，取最后一页最后一条时间作比较；
       * 判断最后一条数据时间和搜索时间比较，且实际数据不超过最大值，就更换结束时间为最后一条数据时间，继续当前搜索；
       * 否则，往前推对应已选择天数区间，继续搜索。
       */
      const lastRecordTime = this.tableData[this.tableData.length - 1].hitTime
      const lastRecordTimeStamp = new Date(lastRecordTime).getTime()
      const beginTimeStamp = new Date(this.queryParams.beginTime).getTime()
      if (lastRecordTimeStamp > beginTimeStamp && this.realTotal > this.maxTotal) {
        this.queryParams.pageInfo.pageNum = 1
        this.queryParams.endTime = lastRecordTime
        this.alarmTimeRange[1] = lastRecordTime
        this.getList()
      } else {
        const num = this.dayjs(this.alarmTimeRange[1]).diff(this.alarmTimeRange[0], 'day')
        const end = this.dayjs(
          new Date(this.queryParams.beginTime).getTime() - 3600 * 1000 * 24 * 1
        ).format('YYYY-MM-DD')
        const start = this.dayjs(
          new Date().setTime(
            new Date(this.queryParams.beginTime).getTime() - 3600 * 1000 * 24 * (num + 1)
          )
        ).format('YYYY-MM-DD')
        this.alarmTimeRange = [start + ' 00:00:00', end + ' 23:59:59']
        this.dateRangeChange(this.alarmTimeRange)
        this.queryParams.pageInfo.pageNum = 1
        this.getList()
      }
    }
  }
}
</script>

<style lang="scss">
#guard-alarm {
  padding: 20px;

  .advanced-query-form {
    .el-row {
      display: flex;
      flex-wrap: wrap;
    }

    .el-form-item__content {
      & > .el-select {
        width: 100%;
      }
    }

    .el-date-editor--daterange.el-input__inner {
      width: 100%;
    }

    .advanced-query-form-btn {
      float: right;

      .el-form-item__content {
        margin-left: 0 !important;
      }
    }

    .select-tag-wrapper .el-checkbox {
      width: initial;
    }

    .select-tag-wrapper.select-tag-inline:not(.select-no-all)
      .el-checkbox-group:not(.check-all)
      .el-checkbox:first-of-type {
      margin-left: 100px;
    }
  }

  .newCameras {
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .search-btn {
    text-align: right;
  }
  .detect-image {
    width: 40px;
    height: 40px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 5px;
  }

  .table-cards-wrapper {
    width: 100%;
    height: calc(100% - 56px);
    overflow-y: auto;
  }

  .table-cards {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 2rem;

    .el-card {
      border: 2px solid #0a314f;
      border-radius: 0;
      background-color: #0a314f;
      color: #fff;
      cursor: pointer;
      box-sizing: border-box;

      &:hover {
        border: 2px solid #156c9e;
      }

      .guard-info {
        display: flex;
        flex-direction: column;
        padding: 14px;

        &-title {
          font-size: 14px;
          font-weight: bold;
          margin-bottom: 12px;
        }

        &-item {
          margin-bottom: 8px;
        }

        .el-tag {
          padding: 0 20px;
          border-radius: 0;
        }
      }
    }

    .img-content {
      width: 100%;
      display: flex;
      justify-content: space-between;
      position: relative;

      &-item {
        width: 49%;
        position: relative;

        .el-image {
          width: 100%;
          height: 120px;
        }

        .img-type-tips {
          position: absolute;
          top: 5px;
          right: 5px;
          z-index: 1;
          background-color: rgba(0, 0, 0, 0.5);
          padding: 2px 4px;
          color: #fff;
          display: inline-block;
          max-width: 100px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .lpn-tips {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          background-color: rgba(26, 122, 239, 0.5);
          padding: 2px 4px;
          font-size: 14px;
          color: #fff;
          display: inline-block;
          width: 70%;
          text-align: center;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }

      .similarity {
        position: absolute;
        bottom: 5px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1;
        background-color: rgba(255, 107, 107, 0.8);
        padding: 4px 6px;
        color: #fff;
        font-size: 16px;
      }
    }
  }

  .switch-checkered {
    display: inline-block;
    margin-left: 10px;

    .checkered {
      border: 1px #bfbfbf solid;
      width: 75px;
      height: 30px;
      display: flex;
      border-radius: 4px;

      .checkered1 {
        width: 50%;
        line-height: 30px;
        text-align: center;
        border-radius: 2px 0 0 2px;
      }

      .checkered2 {
        width: 50%;
        line-height: 36px;
        text-align: center;
        border-radius: 0 2px 2px 0;
      }

      .actives {
        background: #3085cb;
      }
    }
  }
}
</style>
