<template>
  <div
    id="alarm-list"
    v-if="isRouterAlive"
    ref="alarmList"
    v-loading="exportLoading"
    :element-loading-text="$t('alarmList.isExporting')"
  >
    <el-row>
      <el-col :span="24" class="el-row24">
        <div class="mt-7">
          <el-dropdown trigger="click" @command="batchExport" style="margin-right: 10px">
            <el-button
              type="primary"
              class="miniBtn"
              :loading="exportLoading"
              :disabled="alarmLists.length === 0"
            >
              {{ $t('public.batchExport') }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :command="1">
                  {{ $t('alarmList.exportSelected') }}
                </el-dropdown-item>

                <el-dropdown-item :command="2">
                  {{ $t('alarmList.exportPage') }}
                </el-dropdown-item>
                <el-dropdown-item :command="3">{{ $t('alarmList.exportAll') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="condition">
          <el-form
            :inline="true"
            class="demo-form-inline"
            style="width: 100%"
            :label-width="locale == 'en' ? '140px' : '96px'"
            label-position="left"
            ref="form"
          >
            <el-row :gutter="20">
              <el-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
                <el-row :gutter="20">
                  <el-col :xs="24" :sm="24" :md="12" :lg="7" :xl="7">
                    <el-form-item :label="$t('alarmLinkage.alarmDev') + ' ：'">
                      <el-input
                        ref="choosedCamerasRef"
                        @focus="openDialog"
                        v-model="choosedCameras"
                        :placeholder="$t('alarmLinkage.chooseAlarmDevContent')"
                        class="newCameras"
                      >
                        <template #suffix>
                          <svg-icon icon-class="add-input" class-name="el-input__icon" />
                        </template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="7" :xl="7">
                    <!-- 告警类型 -->
                    <el-form-item :label="$t('public.alarmType') + ' ：'">
                      <el-cascader
                        :options="options"
                        :props="{ expandTrigger: 'hover' }"
                        clearable
                        :show-all-levels="false"
                        v-model="value"
                        :popper-append-to-body="false"
                      ></el-cascader>
                    </el-form-item>
                  </el-col>
                  <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="10">
                    <el-form-item :label="$t('alarmList.alarmTime') + ' ：'">
                      <el-date-picker
                        :shortcuts="pickerOptions && pickerOptions.shortcuts"
                        :disabled-date="pickerOptions && pickerOptions.disabledDate"
                        :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                        v-model="dateValue"
                        type="datetimerange"
                        style="width: 370px"
                        :placeholder="$t('alarmList.selectTime')"
                        :range-separator="$t('public.to')"
                        :start-placeholder="$t('alarmList.startingTime')"
                        :end-placeholder="$t('alarmList.endTime')"
                        format="YYYY-MM-DD HH:mm"
                        value-format="YYYY-MM-DD HH:mm:ss"
                        :default-time="[
                          new Date(2000, 1, 1, 0, 0, 0),
                          new Date(2000, 1, 1, 23, 59, 59)
                        ]"
                        :clearable="false"
                      ></el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="showManyCondition" :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
                    <el-form-item :label="$t('alarmList.positiveAndFalseDetectionStatus') + ' ：'">
                      <el-radio-group v-model="checkState">
                        <el-radio label="-1" text-color="#333">{{ $t('public.all') }}</el-radio>
                        <el-radio label="0" text-color="#333">
                          {{ $t('alarmList.notChecked') }}
                        </el-radio>
                        <el-radio label="1" text-color="#333">
                          {{ $t('alarmList.falseDetection') }}
                        </el-radio>
                        <el-radio label="2" text-color="#333">
                          {{ $t('alarmList.correctCheck') }}
                        </el-radio>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
                <div class="search-btn">
                  <el-button
                    type="primary"
                    :loading="loading"
                    @click="searchBtnClick"
                    class="miniBtn"
                  >
                    {{ $t('public.search') }}
                  </el-button>

                  <div class="manyCondition inputMiddle" @click="manyCondition">
                    <span>{{ $t('public.manyCondition') }}</span>
                    <span :class="iconName"></span>
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
                            style="display: inline-block; margin: 0 auto"
                            alt
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
                          <el-icon style="font-size: 20px"><el-icon-menu /></el-icon>
                        </div>
                      </el-tooltip>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div
          class="snapBox"
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
        >
          <div v-if="!loading && !alarmLists.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <el-row v-if="boxShow">
            <el-col
              v-if="!loading && alarmLists.length"
              :span="17"
              class="with1"
              style="padding-right: 10px"
            >
              <el-table
                :data="alarmLists"
                highlight-current-row
                ref="table"
                max-height="660"
                @row-click="seeDetail"
                class="elTable"
                :row-class-name="tableRowClassName"
                border
                @selection-change="handleSelectionChange"
              >
                <el-table-column label width="50" type="selection" />
                <el-table-column
                  prop="alarmTypeName"
                  :label="$t('public.alarmType')"
                  show-overflow-tooltip
                />
                <el-table-column
                  width="180"
                  prop="alarmDevName"
                  :label="$t('alarmList.alarmSourceDeviceName')"
                  show-overflow-tooltip
                />
                <el-table-column :label="$t('public.alarmLevel')" show-overflow-tooltip>
                  <template #default="{ row }">
                    <span :style="`color:${row.alarmLevelColor}`">
                      {{ locale == 'en' ? row.alarmLevelEnName : row.alarmLevelName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="alarmTime"
                  :label="$t('alarmList.alarmTime')"
                  show-overflow-tooltip
                />
                <el-table-column :label="$t('public.alarmState')" show-overflow-tooltip>
                  <template #default="{ row }">
                    <span :class="row.alarmState == 1 ? 'danger' : 'success'">
                      {{ setAlarmState(row.alarmState) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('alarmList.positiveAndFalseDetectionStatus')"
                  show-overflow-tooltip
                >
                  <template #default="{ row }">
                    <span>{{ setCheckState(row.checkState) }}</span>
                  </template>
                </el-table-column>

                <el-table-column :label="$t('alarmList.confirmStatus')" show-overflow-tooltip>
                  <template #default="{ row }">
                    <span :class="row.confirmState == 0 ? 'danger' : 'success'">
                      {{ setConfirmState(row.confirmState) }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :label="$t('alarmList.confirmDescription')"
                  prop="confirmDesc"
                  show-overflow-tooltip
                />
              </el-table>
              <div class="paginations">
                <span>
                  {{ $t('alarmList.alarmTotalNum') + '：' + tableRows }}
                </span>

                <div class="paging">
                  <span>{{ $t('alarmList.loadMoreNums') }}</span>
                  <el-select v-model="pageSize" @change="numberChange">
                    <el-option
                      v-for="(item, index) in numberList"
                      :key="index"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="getMoreTableData">
                    {{ $t('alarmList.loadMore') }}
                  </el-button>
                </div>
              </div>
            </el-col>
            <el-col
              v-if="!loading && alarmLists.length"
              :span="7"
              class="with2"
              style="padding: 0 10px"
            >
              <div
                v-if="Object.keys(currentRowData).length"
                class="detailBox"
                :style="{ height: 685 + 'px' }"
              >
                <div style="font-size: 16px; color: #fff; margin-bottom: 10px">
                  {{ $t('alarmList.alarmDetails') }}
                </div>
                <div>
                  <ul style="overflow: hidden">
                    <li class="top10 bottom10 fullW">
                      <span class="name font14">{{ $t('alarmList.alarmDeviceCode') + '：' }}</span>
                      <span class="value font14">{{ this.currentRowData.alarmDevId }}</span>
                    </li>
                    <li class="bottom10 fullW">
                      <span class="name font14">{{ $t('alarmList.alarmDeviceName') + '：' }}</span>
                      <span class="value font14">{{ this.currentRowData.alarmDevName }}</span>
                    </li>
                    <li class="bottom10" :style="locale == 'en' ? { width: '60%' } : ''">
                      <span class="name font14">{{ $t('public.alarmType') + '：' }}</span>
                      <span class="value font14">{{ this.currentRowData.alarmTypeName }}</span>
                    </li>
                    <li class="bottom10 fullW">
                      <span class="name font14">{{ $t('alarmList.alarmTime') + '：' }}</span>
                      <span class="value font14">{{ this.currentRowData.alarmTime }}</span>
                    </li>
                    <li class="bottom10">
                      <span class="name font14">
                        {{ $t('alarmList.positiveAndFalseDetectionStatus') + '：' }}
                      </span>
                      <span class="value font14">
                        {{ setCheckState(this.currentRowData.checkState) }}
                      </span>
                    </li>
                    <li class="bottom10">
                      <span class="name font14">{{ $t('alarmList.confirmStatus') + '：' }}</span>
                      <span class="value font14">
                        {{ setConfirmState(this.currentRowData.confirmState) }}
                      </span>
                    </li>

                    <li
                      class="bottom10 widthFull"
                      style="height: 25px"
                      :style="locale == 'en' ? { width: '60%' } : ''"
                    >
                      <span class="name font14">
                        {{ $t('alarmList.confirmDescription') + '：' }}
                      </span>
                      <el-tooltip effect="dark" placement="top">
                        <template #content>
                          <div style="width: 200px">
                            {{ currentRowData.confirmDesc }}
                          </div>
                        </template>

                        <span class="value font14 noRap">
                          {{ currentRowData.confirmDesc }}
                        </span>
                      </el-tooltip>
                    </li>
                  </ul>
                </div>
                <div class="relative">
                  <img
                    v-if="currentRowData.snapUrlType == 2"
                    ref="smallBox"
                    class="imgCor"
                    :src="currentRowData.alarmSnapUrl"
                    alt
                    @dblclick="biggerImage(currentRowData, false)"
                    @click="handleInfo(currentRowData)"
                  />
                  <video
                    v-if="currentRowData.snapUrlType == 1"
                    ref="videosmallBox"
                    class="imgCor"
                    :class="[videoDbShow ? 'video-showbig' : '']"
                    style="height: auto"
                    :src="currentRowData.alarmSnapUrl"
                    :controls="true"
                    controlslist="nodownload"
                    @dblclick.prevent="biggerVideo"
                  >
                    {{ $t('alarmList.notSupportH5video') }}
                  </video>

                  <div v-if="currentRowData.snapUrlType == 2" class="uploadAndBig">
                    <div class="big">
                      <el-icon
                        class="zoomIn"
                        style="font-size: 18px"
                        :title="$t('alarmList.enlarge')"
                        @click="biggerImage(currentRowData, false)"
                      >
                        <el-icon-zoom-in />
                      </el-icon>
                    </div>
                  </div>

                  <div class="flexstart alarmBtns">
                    <!-- 清除 -->
                    <el-button
                      v-show="
                        (currentRowData.confirmState == 0 || currentRowData.checkState == 0) &&
                        PermissionCheck
                      "
                      type="warning"
                      @click="handleAlarm('delete')"
                    >
                      {{ $t('newAlarm.deleteAlarm') }}
                    </el-button>
                    <!-- 处理告警 -->
                    <el-button
                      v-show="
                        (currentRowData.confirmState == 0 || currentRowData.checkState == 0) &&
                        PermissionCheck
                      "
                      type="primary"
                      @click="handleAlarm('dispose')"
                    >
                      {{ $t('newAlarm.disposeAlarm') }}
                    </el-button>

                    <el-button
                      v-if="PermissionVideo && cuType == 1"
                      type="primary"
                      @click="goToReplay"
                    >
                      {{ $t('alarmList.playbackVideo') }}
                    </el-button>

                    <el-button
                      v-if="PermissionLive && cuType == 1"
                      type="primary"
                      @click="goToRealtime"
                    >
                      {{ $t('alarmList.liveVideo') }}
                    </el-button>

                    <el-button
                      v-has-permi="[155, 157]"
                      v-show="Object.keys(currentRowData).length"
                      :type="gisBtnType"
                      :disabled="gisBtnDisabled"
                      @click="goToGis"
                    >
                      {{ $t('alarmList.locateMap') }}
                    </el-button>
                  </div>

                  <alarm-map
                    v-if="gisType == 1 || gisType == 2"
                    v-show="alarmLists.length"
                    ref="alarmMap"
                    @getRouterParams="getRouterParams"
                  />
                </div>
              </div>
            </el-col>
          </el-row>

          <el-row v-if="!boxShow">
            <el-col v-show="!loading && alarmLists.length" :span="24">
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAll"
                @change="handleCheckAllChange"
              >
                {{ $t('public.checkAll') }}
              </el-checkbox>
              <el-checkbox-group v-model="checkedCameras" @change="handleCheckedCitiesChange">
                <div class="MainCenter">
                  <div
                    class="centerTop"
                    ref="centerTop"
                    v-for="(item, index) in alarmLists"
                    :key="index"
                  >
                    <el-checkbox class="centerTop-checkbox" :label="item.alarmId">{{}}</el-checkbox>
                    <div class="MainCenter-top">
                      <img
                        v-if="item.snapUrlType == 2 || item.snapUrlType == 0"
                        class="imgCor"
                        :src="item.alarmSnapUrl"
                        ref="smallBoxs"
                        alt
                        style="width: 100%; height: 100%; border-radius: 4px"
                        @dblclick="biggerImage(item, true)"
                        @click="handleInfo(item)"
                      />
                      <video
                        v-if="item.snapUrlType == 1"
                        ref="videosmallBox1"
                        class="imgCor"
                        :class="[videoDbShow ? 'video-showbig' : '']"
                        style="height: auto; width: 100%; height: 100%"
                        :src="item.alarmSnapUrl"
                        :controls="true"
                        controlslist="nodownload"
                        @dblclick.prevent="biggerVideo"
                      >
                        {{ $t('alarmList.notSupportH5video') }}
                      </video>
                    </div>
                    <div class="MainCenter-center">
                      <span>
                        <svg-icon icon-class="alarm-warn" style="display: inline-block"></svg-icon>
                        {{ item.alarmTypeName }}
                      </span>
                      <span class="bgColor" :style="`color:${item.alarmLevelColor}`">
                        {{ locale == 'en' ? item.alarmLevelEnName : item.alarmLevelName }}
                      </span>
                    </div>
                    <div class="MainCenter-center">
                      <span>
                        {{ item.groupName }}
                      </span>
                      <span>{{ item.alarmTime }}</span>
                    </div>
                    <div class="MainCenter-center">
                      <span class="alarmDevName-title" :title="item.alarmDevName">
                        {{ item.alarmDevName }}
                      </span>
                      <span style="text-align: end" v-show="!item.confirmDesc">
                        <div @click="handleAlarm('delete', item)" class="delete-buttom">
                          <svg-icon
                            icon-class="alarm-close"
                            style="display: inline-block"
                          ></svg-icon>
                          {{ $t('newAlarm.delete') }}
                        </div>
                        <div @click="handleAlarm('dispose', item)" class="dispose-buttom">
                          <svg-icon
                            icon-class="alarm-confirm"
                            style="display: inline-block"
                          ></svg-icon>
                          {{ $t('newAlarm.dispose') }}
                        </div>
                      </span>
                      <span
                        v-show="item.confirmDesc"
                        class="content-info"
                        :title="item.confirmDesc"
                      >
                        {{ item.confirmDesc }}
                      </span>
                    </div>
                  </div>
                </div>
              </el-checkbox-group>
              <div class="paginations">
                <span>
                  {{ $t('alarmList.alarmTotalNum') + '：' + tableRows }}
                </span>

                <div class="paging">
                  <span>{{ $t('alarmList.loadMoreNums') }}</span>
                  <el-select v-model="pageSize" @change="numberChange">
                    <el-option
                      v-for="(item, index) in numberList"
                      :key="index"
                      :label="item"
                      :value="item"
                    ></el-option>
                  </el-select>
                  <el-button type="primary" @click="getMoreTableData">
                    {{ $t('alarmList.loadMore') }}
                  </el-button>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-col>
    </el-row>

    <div v-show="ifshowImg" ref="bigImg" class="bigimg" @mousewheel="wheelFun">
      <img :src="bigInfo.alarmSnapUrl" alt style="width: 100%; height: 100%" />
      <div class="nunu" v-show="bigInfoShow">
        <span>{{ $t('alarmList.alarmTime') }}：{{ bigInfo.alarmTime }}</span>
        <span>{{ $t('alarmList.alarmDeviceName') }}：{{ bigInfo.alarmDevName }}</span>
        <span>{{ $t('public.alarmType') }}：{{ bigInfo.alarmTypeName }}</span>
      </div>
    </div>
    <div class="mask" v-show="ifshowImg" @click="maskClick">
      <el-icon><el-icon-close /></el-icon>
    </div>

    <div id="rvc" v-show="videoShow">
      <!-- 视频 -->
      <div id="video" class="videoBox"></div>

      <div class="close" @click="closeRVC">
        <el-icon class="closeRVC"><el-icon-close /></el-icon>
      </div>
    </div>

    <div class="mask" v-show="videoDbShow" @click="videoDbShow = false">
      <el-icon><el-icon-close /></el-icon>
    </div>

    <camera-selector
      :title="$t('alarmList.alarmManagementSelectCamera')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      :max="100"
      :deviceType="1"
    />
    <handle-alarm
      v-model:createVisible="createVisible"
      :handleAlarmInfoObj="handleAlarmInfoObj"
      :data="currentRowData"
      :search="searchBtnClick"
      @content="contentText"
    />
    <guard-alarm-detail v-model:visible="detailDialogVisible" />
    <select-image-map
      v-model:visible="imageMapDialogVisible"
      :data="currDeviceMapList"
      @submit="handleSelectMap"
    />
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import {
  Menu as ElIconMenu,
  ZoomIn as ElIconZoomIn,
  Close as ElIconClose
} from '@element-plus/icons-vue'
import { permissions } from '@/utils/common/permissions'
import { getFormatDate } from '@/utils/common/mutil'
import judgeWindow from '@/mixin/judgeWindow'
import routeJump from '@/mixin/route-jump.js' //路由跳转
import { exportCsv } from '@/utils/common/data2Excel'
import CameraSelector from '@components/cameraSelector'
import handleAlarm from './component/handleAlarm'
import alarmMap from './alarm-map'
import GuardAlarmDetail from '@/views/center/algorithm/alarm/component/guard-alarm-detail'
import SelectImageMap from './component/selectImageMap.vue'
import { handleGetPreview } from '@/utils/common/preViewImg'
import * as dayjs from 'dayjs'
import { download } from '@/utils/common/download'
export default {
  components: {
    CameraSelector,
    'handle-alarm': handleAlarm,
    'alarm-map': alarmMap,
    GuardAlarmDetail,
    SelectImageMap,
    ElIconMenu,
    ElIconZoomIn,
    ElIconClose
  },
  name: 'HistoryAlarm',
  mixins: [judgeWindow, routeJump],
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      screenFlag: true,
      //用户权限判断
      PermissionCreate: true,
      PermissionManage: true,
      PermissionCheck: true,
      PermissionLive: true,
      PermissionVideo: true,
      noMoreAlarmsFlag: false,
      // 列表展示显影
      boxShow: true,
      childIndex: 1,

      // 摄像数组列表
      camerasArray: [],
      choosedCameras: '',
      dialogDeviceVisible: false,

      options: [],
      value: [],

      dateValue: '',
      minDate: '',
      maxDate: '',
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.minDate = minDate
          this.maxDate = maxDate
        },
        disabledDate: time => {
          if (this.minDate) {
            let range = 29 * 24 * 3600 * 1000
            return (
              time.getTime() > Date.now() ||
              time.getTime() > this.minDate.getTime() + range ||
              time.getTime() < this.minDate.getTime() - range
            )
          }
          return time.getTime() > Date.now()
        }
      },
      //搜索时间
      beginTime: '',
      endTime: '',
      chooseBeginTime: '',
      chooseEndTime: '',
      checkList: ['2', '3'],

      choosedIndex: 0,
      tableRows: '',
      finish: false,

      // iconClass 控制更多条件的字体图标
      iconName: 'el-icon-arrow-down',
      // 更多条件显示与隐藏
      showManyCondition: false,

      changeNumber: false,
      seeDetailFlag: true,

      loading: false,
      pageNum: 1,
      pageSize: 10,
      // 分页
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100], //每页显示数量,

      // 控制正误检单选按钮的默认选择
      checkState: '-1',

      // 报警数据列表
      alarmLists: [],
      currentRowData: {},

      // 放大图片
      ifshowImg: false,
      bigInfoShow: false,
      bigInfo: {
        alarmSnapUrl: '',
        alarmTime: '',
        alarmTypeName: '',
        alarmDevName: ''
      },

      //播放判断
      cuType: sessionStorage.getItem('cuType'),
      videoShow: false,
      player: null,
      ifDownLoad: false,
      videoDbShow: false,

      currDeviceInfo: {
        longitude: '',
        latitude: '',
        cameraId: '',
        cameraName: ''
      },
      currDeviceMapList: [],

      createVisible: false,
      handleAlarmInfoObj: {
        title: '',
        index: ''
      },

      alarmGroupsList: null,
      gisType: undefined,
      alarmLevelList: [],
      detailDialogVisible: false,
      dataForm: {},
      infoLoading: false,
      imageMapDialogVisible: false,
      dayjs,
      multipleSelection: [],
      // 用以表示 checkbox 的不确定状态，一般用于实现全选的效果
      isIndeterminate: false,
      checkAll: false,
      checkedCameras: [],
      exportLoading: false
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.locale = localStorage.getItem('locale')
      this.pageResize()
      if (this.map) {
        this.map.setLang(this.locale == 'en' ? 'en' : 'zh_cn')
      }
    }
  },
  created() {
    this.getDatePickerTime()
    this.getPermissions()
    this.getGroups()
    this.getAlarmLevel()
    this.bindEvent()
    this.get_gis_config()
  },
  beforeDestroy() {
    this.unBindEvent()
  },
  mounted() {
    this.pageResize()
  },
  activated() {
    
    this.pageResize()
  },
  computed: {
    gisBtnDisabled() {
      if (this.gisType == 1 || this.gisType == 2) {
        return this.currDeviceInfo.longitude ? false : true
      } else if (this.gisType == 3) {
        return this.currDeviceMapList.length ? false : true
      } else {
        return true
      }
    },
    gisBtnType() {
      if (this.gisType == 1 || this.gisType == 2) {
        return this.currDeviceInfo.longitude ? 'primary' : 'info'
      } else if (this.gisType == 3) {
        return this.currDeviceMapList.length ? 'primary' : 'info'
      } else {
        return 'info'
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      let checkedIds = []
      for (let j = 0; j < this.alarmLists.length; j++) {
        checkedIds.push(this.alarmLists[j].alarmId)
      }
      this.checkedCameras = val ? checkedIds : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.alarmLists.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.alarmLists.length
    },
    // 表格列表选中!
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 导出按钮下拉中 被点击
    batchExport(command) {
      let paramObj
      let idAlarmTimes
      if (command === 1) {
        if (this.boxShow) {
          idAlarmTimes = this.getIdAlarmTimes(this.multipleSelection)
        } else {
          idAlarmTimes = this.getIdAlarmTimes(this.checkedCameras, 2)
        }
        if (!idAlarmTimes.length) return
        paramObj = {
          idAlarmTimes
        }
      } else if (command === 2) {
        if (this.alarmLists.length > 0) {
          idAlarmTimes = this.getIdAlarmTimes(this.alarmLists)
          paramObj = {
            idAlarmTimes
          }
        } else {
          return this.$message({
            type: 'warning',
            message: this.$t('alarmList.noData')
          })
        }
      } else {
        const devList = []
        let typeList = []
        const beginTime = this.dateValue[0]
        const endTime = this.dateValue[1]
        this.camerasArray.forEach(item => {
          devList.push({ devId: item })
        })
        if (this.value.length > 0) {
          typeList = this.value[1] === '' ? undefined : [this.value[1]]
        } else {
          typeList = null
        }
        paramObj = {
          devList,
          typeList,
          alarmGroupType: this.value ? this.value[0] : undefined,
          beginTime: beginTime,
          endTime: endTime,
          checkState: this.checkState === '-1' ? undefined : this.checkState
        }
      }
      this.exportLoading = true
      this.$api
        .exportAllAlarm(paramObj)
        .then(res => {
          if (res.resultCode === 0) {
            res.fileUrl && download(res.fileUrl, this.$t('alarmList.alarm'))
          }
        })
        .finally(() => {
          this.exportLoading = false
        })
    },
    getIdAlarmTimes(selectList, type = 1) {
      const idAlarmTimes = []
      if (selectList.length > 0) {
        if (type === 1) {
          selectList.forEach(item => {
            idAlarmTimes.push(item.alarmId + '-' + item.alarmTime)
          })
        } else {
          // 获取-
          const arr = this.alarmLists.filter(item => selectList.includes(item.alarmId))
          arr.forEach(item => {
            idAlarmTimes.push(item.alarmId + '-' + item.alarmTime)
          })
        }
      } else {
        this.$message({
          type: 'warning',
          message: this.$t('alarmList.selectedDataTip')
        })
      }
      return idAlarmTimes
    },
    async get_gis_config(data = { enable: true }) {
      await this.$store.dispatch('mapConfig/get_gis_config_initial')
      const res = await this.$store.dispatch('mapConfig/get_gis_config', data)
      if (res) {
        const { form } = res
        if (form) {
          this.gisType = form.type
        }
      }
    },
    bindEvent() {
      this.$bus.$on('webkit_notify', this.handlePcHistoryNotify)
    },
    unBindEvent() {
      this.$bus.$off('webkit_notify')
    },
    handlePcHistoryNotify(e) {
      let { func, message } = e
      if (func != 'AlarmDetails') return
      const res = JSON.parse(message)
      this.getAlarmById(res, 'pc')
    },
    //页面显示处理告警后的状态（将处理告警文字到页面）
    contentText(obj) {
      let { confirmDesc, alarmId } = obj
      this.alarmLists.forEach((item, index) => {
        if (item.alarmId == alarmId) {
          this.alarmLists[index].confirmDesc = confirmDesc
        }
      })
    },
    getDatePickerTime() {
      let cameraInfo = this.$route.query.cameraInfo ? JSON.parse(this.$route.query.cameraInfo) : ''
      const time = cameraInfo.date && getFormatDate(new Date(cameraInfo.date))
      const startTime = getFormatDate(new Date().getTime() - 29 * 24 * 3600 * 1000)
      const endTime = getFormatDate(new Date())
      this.dateValue = cameraInfo.date ? [time, time] : [startTime, endTime]
      this.choosedCameras = cameraInfo.cameraName ? cameraInfo.cameraName : ''
      cameraInfo.cameraId ? this.camerasArray.push(cameraInfo.cameraId) : (this.camerasArray = [])

      this.locale = localStorage.getItem('locale')
    },
    //用户权限判断
    async getPermissions() {
      this.PermissionCreate = await permissions(232)
      this.PermissionManage = await permissions(152)
      this.PermissionCheck = await permissions(154)
      this.PermissionLive = await permissions(101) //实时浏览
      this.PermissionVideo = await permissions(132) //录像回放
    },
    pageResize() {
      this.judgeWindow(1850)
    },
    getGroups() {
      this.$api.getGroupsQuery({}).then(res => {
        if (res.alarmGroups) {
          this.alarmGroupsList = res.alarmGroups
          let options = []
          for (let i = 0; i < res.alarmGroups.length; i++) {
            options.push({
              value: res.alarmGroups[i].groupCode,
              label:
                this.locale == 'en' ? res.alarmGroups[i].groupEnName : res.alarmGroups[i].groupName,
              children: []
            })
          }
          const requests = options.map(option => {
            return this.$api.getAlarmTypesQuery({
              alarmGroup: option.value,
              canQuery: 1
            })
          })
          Promise.all(requests).then(responses => {
            responses.forEach((res, i) => {
              for (let j = 0; j < res.alarmTypeList.length; j++) {
                options[i].children.push({
                  value: res.alarmTypeList[j].alarmType,
                  label: res.alarmTypeList[j].alarmName
                })
              }
              options[i].children.unshift({
                value: '',
                label: options[i].label
              })
            })
            this.options = options // 更新 options
            this.value = [this.options[0].value, '']
            if (this.camerasArray.length) {
              this.searchAlarmList()
            } else {
              this.searchAllAlarms()
            }
          })
        }
      })
    },

    openDialog() {
      this.dialogDeviceVisible = true
      this.$refs.choosedCamerasRef.blur()
    },
    getCameras(cameras) {
      let currentCameras = []
      this.choosedCameras = ''
      this.camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        currentCameras.push(cameras[i].name)
        this.camerasArray.push(cameras[i].id)
      }
      this.choosedCameras = currentCameras.join(',')
    },
    //搜索
    searchBtnClick() {
      this.seeDetailFlag = true
      this.finish = false
      this.currentRowData = {}
      this.pageNum = 1
      this.searchAlarmList()
    },
    // 点击更多条件控制更多条件的显示与隐藏
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
    },
    // 缩略图、列表显影操作
    async divchange(index) {
      this.childIndex = index
      if (this.childIndex == 2) {
        const checkedIds = []
        for (let j = 0; j < this.multipleSelection.length; j++) {
          checkedIds.push(this.multipleSelection[j].alarmId)
        }
        this.checkedCameras = checkedIds
        this.handleCheckedCitiesChange(checkedIds)
        this.$nextTick(() => {
          if (this.$refs.videosmallBox1) {
            for (let i = 0; i < document.getElementsByClassName('imgCor').length; i++) {
              document.getElementsByClassName('imgCor')[i]['disablePictureInPicture'] = true
            }
          }
        })
        this.boxShow = false
      } else {
        this.$nextTick(() => {
          if (this.$refs.videosmallBox) {
            for (let i = 0; i < document.getElementsByClassName('imgCor').length; i++) {
              document.getElementsByClassName('imgCor')[i]['disablePictureInPicture'] = true
            }
          }
          this.getTableCurrSelection()
        })

        this.boxShow = true
      }
    },
    // 根据选项生成当前表格被选项
    getTableCurrSelection() {
      const checkedArrs = this.alarmLists.filter(item => {
        return this.checkedCameras.includes(item.alarmId)
      })
      if (!checkedArrs.length) {
        this.$refs.table && this.$refs.table.clearSelection()
      } else {
        checkedArrs.forEach(row => {
          this.$refs.table && this.$refs.table.toggleRowSelection(row, true)
        })
      }
    },

    setConfirmState(val) {
      if (val == 0) {
        return this.$t('alarmList.unconfirmed')
      } else if (val == 1) {
        return this.$t('alarmList.confirmed')
      }
    },
    setAlarmState(val) {
      if (val == 1) {
        return this.$t('alarmList.alarmHappened')
      } else if (val == 2) {
        return this.$t('alarmList.alarmCleared')
      }
    },
    setCheckState(val) {
      if (val == 0) {
        return this.$t('alarmList.notChecked')
      } else if (val == 1) {
        return this.$t('alarmList.falseDetection')
      } else if (val == 2) {
        return this.$t('alarmList.correctCheck')
      }
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    //分页
    numberChange(val) {
      this.pageNum = 0
      this.pageSize = val
      this.changeNumber = true
      this.getMoreTableData()
    },

    //加载更多
    async getMoreTableData() {
      if (this.finish) {
        this.$message({
          message: this.$t('alarmList.moMoreNums'),
          type: 'warning'
        })
        return
      }
      let timeType
      const endTime = new Date(this.dateValue[0].substr(0, 10)).getTime()
      let beginTime = new Date(this.beginTime).getTime()
      // 如果切换分页，时间换位原始时间调用接口
      if (this.changeNumber) {
        this.beginTime = this.dateValue[1].substr(0, 10)
        beginTime = new Date(this.beginTime).getTime()
        timeType = endTime === beginTime ? 1 : 2
      } else {
        timeType = endTime === beginTime ? 1 : 4
      }
      this.finish = false
      if (this.pageNum == 0 && !this.noMoreAlarmsFlag) {
        this.alarmLists = []
      }
      this.loading = true
      this.pageNum++
      let devList = []
      this.camerasArray.forEach(element => {
        devList.push({ devId: element })
      })
      await this.getAlarmBypage(2, devList, timeType)
    },

    // 根据设备查询报警列表
    async searchAlarmList() {
      this.alarmLists = []
      let devList = []
      this.camerasArray.forEach(element => {
        devList.push({ devId: element })
      })
      if (devList.length > 100) {
        this.$alert(this.$t('alarmList.cantGreaterThanOneHundred'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm')
        })
        return
      }
      let time1 = new Date(this.dateValue[0]).getTime()
      let time2 = new Date(this.dateValue[1]).getTime()
      let six = 30 * 24 * 3600 * 1000

      if (time1 < time2 - six) {
        this.$alert(this.$t('alarmList.largestSpan'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm')
        })
        return
      }
      if (time1 <= time2) {
        this.loading = true
        this.beginTime = this.dateValue[1].substr(0, 10)
        this.chooseBeginTime = this.dateValue[0]
        this.chooseEndTime = this.dateValue[1]
        const endTime = this.dateValue[0].substr(0, 10)
        const timeType = this.beginTime === endTime ? 1 : 2
        await this.getAlarmBypage(2, devList, timeType)
      } else {
        this.$alert(this.$t('alarmList.startLarger'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm')
        })
      }
    },
    //列表并集去重
    mergeAndDistinct(arr1, arr2) {
      const mergedArray = arr1.concat(arr2)
      const distinctArray = mergedArray.reduce((result, item) => {
        if (
          result.findIndex(i => JSON.stringify(i.alarmId) === JSON.stringify(item.alarmId)) === -1
        ) {
          result.push(item)
        }
        return result
      }, [])
      return distinctArray
    },
    // timeType:  1开始结束在同一天 2查询的第一天 3查询的最后一天  4中间时间
    async getAlarmBypage(type, devList, timeType) {
      const lists = await this.searchAlarmByDate(
        this.beginTime,
        this.beginTime,
        type,
        devList,
        timeType
      )
      let alarms = lists.alarmList ? lists.alarmList : []
      if (this.changeNumber) {
        this.alarmLists = []
        this.changeNumber = false
      }
      this.alarmLists = this.mergeAndDistinct(this.alarmLists, alarms)
      this.tableRows = this.alarmLists.length
      //修改了 alarmDevId of undefined
      if (this.alarmLists.length) {
        if (!this.currentRowData.alarmDevId) {
          if (this.$refs.table) {
            this.$refs.table.setCurrentRow(this.alarmLists[0], true)
          }
          this.alarmLists[0].index = 0
          if (this.seeDetailFlag) {
            await this.seeDetail(this.alarmLists[0])
          }
        }
      }
      if (alarms.length < this.pageSize) {
        //当天查完了，查下一天
        this.noMoreAlarmsFlag = true

        const endTime = this.chooseBeginTime.substr(0, 10)
        if (new Date(this.beginTime).getTime() > new Date(endTime).getTime()) {
          this.beginTime = getFormatDate(new Date(this.beginTime).getTime() - 24 * 3600000).substr(
            0,
            10
          )
          this.pageNum = 1
          if (this.beginTime === endTime) {
            await this.getAlarmBypage(type, devList, 3)
          } else {
            await this.getAlarmBypage(type, devList, 4)
          }
        } else if (!alarms.length) {
          await this.getAlarmSnap()
          this.finish = true
          this.loading = false
        }
      } else {
        await this.getAlarmSnap()
        this.loading = false
      }
      return alarms
    },
    // 默认查询的所有正检和未检的报警列表 不能与devList同时查询 使用groupId 查询 选择所有的数据显示在表格
    async searchAllAlarms() {
      this.beginTime = this.dateValue[1].substr(0, 10)
      this.chooseBeginTime = this.dateValue[0]
      this.chooseEndTime = this.dateValue[1]
      const endTime = this.dateValue[0].substr(0, 10)
      const timeType = this.beginTime === endTime ? 1 : 2
      this.loading = true
      await this.getAlarmBypage(1, [], timeType)
    },
    // 根据时间和类型查询报警列表
    async searchAlarmByDate(beginTime, endTime, type, devList, timeType) {
      let searchInfo
      switch (timeType) {
        //开始时间结束时间在同一天
        case 1:
          searchInfo = {
            beginTime: this.chooseBeginTime,
            endTime: this.chooseEndTime
          }
          break
        //查询的第一天
        case 2:
          searchInfo = {
            beginTime: beginTime + ' 00:00:00',
            endTime: this.chooseEndTime
          }
          break
        //查询的最后一天
        case 3:
          searchInfo = {
            beginTime: this.chooseBeginTime,
            endTime: endTime + ' 23:59:59'
          }
          break
        default:
          searchInfo = {
            beginTime: beginTime + ' 00:00:00',
            endTime: endTime + ' 23:59:59'
          }
          break
      }
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize //默认只查第一页的500条
        },
        searchInfo: {
          ...searchInfo,
          alarmGroupType: this.value ? this.value[0] : undefined
        }
      }
      type == 1 ? (obj.searchInfo.groupId = '') : (obj.searchInfo.devList = devList)
      if (this.value && this.value[1]) {
        obj.searchInfo.typeList = []
        obj.searchInfo.typeList.push(this.value[1])
      }

      if (this.checkState != '-1') {
        obj.searchInfo.checkState = this.checkState
      }

      const lists = await this.$api.getAlarmList(obj)
      if (lists.resultCode != 0) {
        this.loading = false
      }
      if (lists.alarmList.length) {
        for (let item of lists.alarmList) {
          this.alarmGroupsList.forEach(data => {
            if (item.alarmGroup == data.groupCode) {
              item.groupName = this.locale == 'en' ? data.groupEnName : data.groupName
            }
          })
          let url = require('@/assets/img/common/newBackground.png')
          item.alarmSnapUrl = url
          item.snapUrlType = 0
        }
      }

      if (lists.alarmList.length < this.pageSize) {
        this.loading = false
      }

      return lists
    },
    async getAlarmSnap() {
      if (this.alarmLists.length) {
        for (let i = 0; i < this.alarmLists.length; i++) {
          let item = this.alarmLists[i]
          let data = {
            alarmId: item.alarmId,
            alarmTime: item.alarmTime
          }
          const res = await this.$api.getAlarmSnap(data)
          item.alarmSnapUrl = res.snapUrl ? res.snapUrl : item.alarmSnapUrl
          item.snapUrlType = res.snapUrlType !== undefined ? res.snapUrlType : item.snapUrlType
        }
      }
    },
    // 下载图片
    downImg(url) {
      // 如果没有图片,就让其return掉
      if (!url || url.indexOf('http') == -1) {
        this.ifDownLoad = true
        return
      }
      // 否则就进行下载操作
      let obj = { url, functionId: 'snap_download_req' }
      window.webkitProc('snap_download_req', JSON.stringify(obj))
    },
    // 查看详情
    async seeDetail(row) {
      this.seeDetailFlag = false
      if (this.$refs.alarmMap) {
        this.$refs.alarmMap.mapShow = false
        // 获取预置位(列表不直接返回，需要前端获取预置位后再调用方位角)
        await this.$refs.alarmMap.get_PresetId(row.alarmId, row.alarmDevId)
      } else {
        // 图片地图 获取设备绑定的地图列表
        this.getDevMapList(row.alarmDevId)
      }
      await this.getAlarmById(row)

      this.choosedIndex = row.index
    },
    async getAlarmById(row, type) {
      let obj = {}
      if (type && type == 'pc') {
        obj = {
          alarmId: row.alarmID,
          alarmTime: row.alarmTime
        }
      } else {
        obj = {
          alarmId: row.alarmId,
          alarmTime: row.alarmTime
        }
      }
      const res = await this.$api.getAlarmById(obj)
      if (res.resultCode == 0) {
        this.alarmLists[row.index]['checkState'] = res.alarmInfo.checkState
        this.alarmLists[row.index]['confirmState'] = res.alarmInfo.confirmState
        this.currentRowData = Object.assign({}, this.currentRowData, res.alarmInfo)

        if (!res.alarmInfo.alarmGroup) {
          this.currentRowData.alarmGroup = row.alarmGroup
        }

        this.currentRowData.confirmDesc = res.alarmInfo.confirmDesc

        if (res.alarmInfo.cameraName) {
          this.currentRowData.alarmDevName = res.alarmInfo.cameraName
        } else {
          this.currentRowData.alarmDevName = row.alarmDevName
        }

        if (row.groupName) {
          this.currentRowData.groupName = row.groupName
        }

        const res1 = await this.$api.getAlarmSnap(obj)
        if (res1.resultCode == 0) {
          let url = res1.snapUrl ? res1.snapUrl : require('@/assets/img/common/newBackground.png')
          this.currentRowData.alarmSnapUrl = url
          this.currentRowData.snapUrlType = res1.snapUrlType

          this.$nextTick(() => {
            if (this.$refs.videosmallBox) {
              this.$refs.videosmallBox['disablePictureInPicture'] = true
            }
          })
          if (!url || url.indexOf('http') == -1) {
            this.ifDownLoad = true
            return
          }
        } else {
          let url = require('@/assets/img/common/newBackground.png')
          this.currentRowData.alarmSnapUrl = url
          this.currentRowData.snapUrlType = 0
        }
      }
    },

    // 告警正误检(清除/确认处理意见)
    handleAlarm(value, data) {
      if (data) {
        this.currentRowData = data
      }
      if (value === 'delete') {
        this.handleAlarmInfoObj.title = this.$t('newAlarm.deleteAdvise')
        this.handleAlarmInfoObj.index = 'delete'
      } else {
        this.handleAlarmInfoObj.title = this.$t('newAlarm.disposeAdvise')
        this.handleAlarmInfoObj.index = 'dispose'
      }
      this.createVisible = true
    },
    //跳转到 录像
    goToReplay() {
      if (sessionStorage.getItem('cuType') == 1) {
        let param = {
          cameraId: this.currentRowData.alarmDevId,
          cameraName: this.currentRowData.alarmDevName,
          alarmTime: this.currentRowData.alarmTime
        }
        window.webkitProc('alarm-playback', JSON.stringify(param))
      }
    },
    //跳转到 实时视频
    goToRealtime() {
      if (sessionStorage.getItem('cuType') == 1) {
        let param = {
          cameraId: this.currentRowData.alarmDevId,
          cameraName: this.currentRowData.alarmDevName
        }
        window.webkitProc('realtime-play', JSON.stringify(param))
      }
    },
    //关闭播放
    closeRVC() {
      this.videoShow = false
      this.player = null
    },

    // 地图定位
    goToGis() {
      if (!this.gisType) return
      if (this.gisType == 1 || this.gisType == 2) {
        if (this.currDeviceInfo.longitude && this.currDeviceInfo.latitude) {
          let path = '/gis/index',
            routerPush = {
              name: 'gis',
              params: {
                cameraId: this.currDeviceInfo.cameraId,
                cameraName: this.currDeviceInfo.cameraName
              }
            }
          this.routeJump(path, routerPush)
        }
      } else if (this.gisType == 3) {
        if (!this.currDeviceMapList.length) return
        if (this.currDeviceMapList.length == 1) {
          let path = '/gis/index',
            routerPush = {
              name: 'gis',
              params: {
                type: 2,
                cameraId: this.currentRowData.alarmDevId,
                cameraName: this.currentRowData.alarmDevName,
                mapId: this.currDeviceMapList[0].mapId
              }
            }
          this.routeJump(path, routerPush)
          return
        } else {
          this.imageMapDialogVisible = true
        }
      }
    },
    handleSelectMap(mapId) {
      let path = '/gis/index',
        routerPush = {
          name: 'gis',
          params: {
            type: 2,
            cameraId: this.currentRowData.alarmDevId,
            cameraName: this.currentRowData.alarmDevName,
            mapId: mapId
          }
        }
      this.routeJump(path, routerPush)
    },
    //放大
    biggerVideo() {
      this.videoDbShow = true
    },

    // 放大图片
    biggerImage(item, flag) {
      if (flag) {
        this.bigInfo.alarmTime = item.alarmTime
        this.bigInfo.alarmTypeName = item.alarmTypeName
        this.bigInfo.alarmDevName = item.alarmDevName

        this.$refs.bigImg.style.width = this.$refs.smallBoxs[0].offsetWidth * 4 + 'px'
        this.$refs.bigImg.style.height = this.$refs.smallBoxs[0].offsetHeight * 3.5 + 'px'
      } else {
        this.$refs.bigImg.style.width = this.$refs.smallBox.offsetWidth * 1.5 + 'px'
        this.$refs.bigImg.style.height = this.$refs.smallBox.offsetHeight * 1.5 + 'px'
      }
      this.bigInfo.alarmSnapUrl = item.alarmSnapUrl

      this.bigInfoShow = flag
      this.ifshowImg = true
    },
    maskClick() {
      this.ifshowImg = false
    },
    // 滚轮放大缩小图片
    wheelFun(e) {
      let ev = e || window.event
      let dir = ev.wheelDelta || ev.detail
      if (ev.preventDefault) {
        ev.preventDefault()
      } else {
        ev.returnValue = false
      }
      if (dir == -3 || dir == 120) {
        let maxWidth = document.getElementsByTagName('body')[0].offsetWidth
        let maxHeight = document.getElementsByTagName('body')[0].offsetHeight
        if (this.$refs.bigImg.offsetWidth > maxWidth - 20) {
          return
        }
        if (this.$refs.bigImg.offsetHeight > maxHeight - 50) {
          return
        }
        this.$refs.bigImg.style.width = this.$refs.bigImg.offsetWidth * 1.03 + 'px'
        this.$refs.bigImg.style.height = this.$refs.bigImg.offsetHeight * 1.03 + 'px'
      } else {
        //向下
        if (this.$refs.bigImg.offsetWidth < 500) {
          return
        }
        if (this.$refs.bigImg.offsetHeight < 500) {
          return
        }
        this.$refs.bigImg.style.width = this.$refs.bigImg.offsetWidth / 1.03 + 'px'
        this.$refs.bigImg.style.height = this.$refs.bigImg.offsetHeight / 1.03 + 'px'
      }
    },

    getRouterParams(data) {
      Object.assign(this.currDeviceInfo, data)
    },
    //告警级别接口
    getAlarmLevel() {
      this.$api.getAlarmLevelList().then(res => {
        if (res && res.alarmLevelList) {
          this.alarmLevelList = res.alarmLevelList
        }
      })
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
    async handleInfo(item) {
      if (item.alarmGroup !== 2 || this.infoLoading) {
        return
      }
      try {
        this.infoLoading = true
        const res = await this.$api.getGuardHitInfo({
          alarmId: item.alarmId,
          netType: this.$getNetType()
        })
        if (res.resultCode == 0) {
          this.dataForm = {
            ...res.guardHitInfo,
            ...{
              previewCaptureImage: handleGetPreview(res.guardHitInfo.captureImage),
              previewDetectImage: handleGetPreview(res.guardHitInfo.detectImage),
              previewVehiclePhoto: handleGetPreview(res.guardHitInfo.vehiclePhoto),
              previewFacePhoto: handleGetPreview(res.guardHitInfo.facePhoto)
            }
          }
          this.detailDialogVisible = true
        }
      } finally {
        this.infoLoading = false
      }
    },
    async getDevMapList(deviceId) {
      const res = await this.$api.getPictureDeviceList({
        deviceId
      })
      if (res.resultCode == 0) {
        this.currDeviceMapList = res.pictureDeviceMapList
      }
    }
  }
}
</script>

<style lang="scss">
#alarm-list {
  width: 100%;
  height: 100%;
  min-width: 1200px;
  .el-row24 {
    padding: 0 20px;
  }

  .flexstart {
    display: flex;
    justify-content: flex-start;
  }

  // .flex-item {
  //   width: 43%;
  // }
  .actives {
    background: #3085cb;
  }

  .condition {
    position: relative;
    margin: 20px 0;
  }

  .addIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 5px;
    top: 13px;
  }

  .newCameras {
    width: 200px;
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .el-dialog__body {
    padding: 5px 40px 15px;
  }
  .condition .el-input {
    width: 200px;
  }
  .el-checkbox {
    color: #fff;
  }

  .search-btn {
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 1;
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
      }
    }
  }

  .snapBox {
    width: 100%;
    position: relative;
  }

  .detailBox {
    width: 100%;
    height: 720px;
    border-radius: 4px;
    padding: 10px;
    li {
      list-style: none;
      float: left;
      width: 50%;
      text-align: left;
      font-size: 14px;
      .name {
        color: #666;
        font-size: 14px;
      }
      .value {
        font-size: 14px;
      }
      &.fullW {
        width: 100% !important;
      }

      &.widthFull {
        width: 100% !important;
        display: flex;
        .noRap {
          flex: 1;
          position: relative;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          -o-text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: middle;
        }
      }
    }
    .uploadAndBig {
      margin-top: -34px;
      overflow: hidden;
      position: relative;
      height: 35px;
      line-height: 35px;
      .downLoad {
        position: absolute;
        top: 8px;
        left: 94%;
        color: #000;
        font-size: 16px;
        cursor: pointer;
      }
      .bid {
        color: #c3c1c1;
      }
    }
    .zoomIn {
      position: absolute;
      top: 8px;
      left: 93%;
      color: #000;
      font-size: 16px;
      cursor: pointer;
    }
    .relative {
      width: 100%;
      .imgCor {
        height: 80%;
        width: 100%;
        max-height: 300px;
        display: block;
      }
    }
    .el-icon-zoom-in:before {
      color: #fff;
    }
    .bottom10 {
      margin-bottom: 10px;
    }
    .alarmBtns {
      margin: 10px 0;
      text-align: center;
    }
  }
  .MainCenter {
    width: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-wrap: wrap;
    .bgColor {
      height: 22px;
      background: rgba(255, 203, 161, 0.2);
      border-radius: 2px;
      text-align: center;
      line-height: 22px;
    }
    .danger {
      color: #ff344d;
    }
    .warning {
      color: #ff9744;
    }
    .success {
      color: #fec842;
    }
    .dispose-buttom,
    .delete-buttom {
      display: inline-block;
      height: 26px;
      border-radius: 2px;
      text-align: center;
      line-height: 26px;
      cursor: pointer;
      padding: 0 5px;
    }
    .dispose-buttom {
      margin-left: 0.6em;
      background-color: hsla(207, 100%, 52%, 1);
      &:hover {
        background-color: hsla(207, 100%, 52%, 0.8);
      }
    }
    .delete-buttom {
      background-color: hsla(18, 73%, 56%, 1);
      &:hover {
        background-color: hsla(18, 73%, 56%, 0.8);
      }
    }
    .alarmDevName-title {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 150px;
      display: inline-block;
      white-space: nowrap;
    }
    .content-info {
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 160px;
      text-align: end;
      display: inline-block;
      margin-left: 10px;
      white-space: nowrap;
    }
    .centerTop {
      width: 19%;
      height: 314px;
      aspect-ratio: 16/9;
      margin-right: 1.2%;
      background-color: #163648;
      margin-bottom: 32px;
      border-radius: 4px;
      position: relative;
      .centerTop-checkbox {
        position: absolute;
        left: 5px;
        top: 5px;
      }
      &:nth-of-type(5n) {
        margin-right: 0;
      }
      .MainCenter-top {
        width: 100%;
        height: 180px;
        position: relative;
        aspect-ratio: 16/9;
      }
      .MainCenter-top video {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .MainCenter-center {
        width: 93%;
        margin: 10px auto;
        display: flex;
        justify-content: space-between;
        span {
          font-size: 14px;
          line-height:26px;
        }
      }
      .MainCenter-bottom {
        display: flex;
        justify-content: space-around;
        span {
          font-size: 14px;
          cursor: pointer;
        }
        :hover {
          font-size: 16px;
        }
      }
    }
  }
  .elTable {
    margin-bottom: 20px;
  }
  .paginations {
    width: 100%;
    position: relative;
    line-height: 40px;
    span {
      font-size: 16px;
      display: inline-block;
    }
    .paging {
      display: inline-block;
      position: absolute;
      right: 0px;
      .el-input.el-input--small.el-input--suffix {
        width: 72px !important;
      }
      .el-input {
        width: 72px !important;
      }

      .el-button {
        margin-left: 20px;
        span {
          font-size: 14px;
        }
      }
    }
  }

  .mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background: #000;
    left: 0;
    top: 0;
    z-index: 1000;
    opacity: 0.5;
    i {
      position: absolute;
      right: 10px;
      top: 10px;
      color: #fff;
      font-size: 30px;
      cursor: pointer;
    }
  }
  .bigimg {
    position: fixed;
    width: 300px;
    height: 200px;
    z-index: 1001;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    .nunu {
      width: 100%;
      height: 40px;
      line-height: 40px;
      background: black;
      opacity: 0.65;
      position: absolute;
      bottom: 0%;
      display: flex;
      justify-content: space-around;
      span {
        display: inline-block;
        font-size: 16px;
        color: #fff;
      }
    }
  }

  //视频
  .video-showbig {
    position: fixed !important;
    z-index: 1001;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80% !important;
    &:focus {
      outline: none;
    }
  }

  //播放器
  $background: rgba(23, 45, 58, 1);
  #rvc {
    background: $background;
    width: 760px;
    height: 430px;
    position: fixed;
    top: 20%;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 120;
    #video {
      width: 100%;
      height: 100%;
      background: $background;
    }
    .close {
      width: 35px;
      height: 35px;
      text-align: center;
      line-height: 35px;
      background: rgba(84, 242, 255, 0.2);
      border-radius: 4px;
      position: absolute;
      top: 4px;
      right: 4px;
      .closeRVC {
        margin: 6px;
        cursor: pointer;
        color: #fff;
        font-size: 30px;
      }
    }
  }
  .el-table__header-wrapper {
    overflow-y: hidden;
  }
  @media screen and (max-width: 1400px) {
    .with1 {
      width: 58.33333% !important;
    }
    .with2 {
      width: 41.66667% !important;
    }
  }
}
</style>
