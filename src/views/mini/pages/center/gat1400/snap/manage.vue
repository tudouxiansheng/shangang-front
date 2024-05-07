<template>
  <!-- 智能元数据 -->
  <div id="gat1400SnapManage" v-if="isRouterAlive" ref="newAlgorithmMetadata">
    <el-row>
      <el-col :span="24" style="padding: 0px 29px">
        <div class="search-form">
          <el-form
            :inline="true"
            ref="form"
            :model="searchForm"
            :label-width="locale == 'en' ? '170px' : '124px'"
            class="demo-form-inline"
            label-position="left"
          >
            <el-row>
              <el-col :span="22">
                <div>
                  <el-form-item :label="$t('deviceManagement.equipmentSource') + ':'">
                    <el-select
                      clearable
                      :popper-append-to-body="false"
                      v-model="searchForm.sourceType"
                      :placeholder="$t('deviceManagement.selectEquipmentSource')"
                      @change="changeSourceType"
                    >
                      <el-option
                        v-for="(item, index) in devSourceList"
                        :key="index"
                        :label="item.name"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="setDevLabel + ' ：'" v-if="searchForm.sourceType">
                    <div class="newCameras">
                      <el-input
                        v-inputFocus
                        @focus="openDialog"
                        v-model="searchForm.cameraNames"
                        :placeholder="$t('deviceManagement.selectDevices')"
                      ></el-input>
                      <img src="@/assets/img/common/add.png" class="addIcon" @click="openDialog" />
                    </div>
                  </el-form-item>

                  <el-form-item :label="$t('deviceManagement.searchType') + ':'">
                    <el-checkbox-group v-model="searchForm.type" @change="typeChange">
                      <el-checkbox
                        v-for="(item, index) in algorithmTypeList"
                        :key="index"
                        :label="item.value"
                      >
                        {{ item.name }}
                      </el-checkbox>
                    </el-checkbox-group>
                  </el-form-item>

                  <el-form-item :label="$t('deviceManagement.captureTime') + ':'">
                    <el-date-picker
                      v-model="dateVal"
                      type="datetimerange"
                      style="width: 330px"
                      :range-separator="$t('public.to')"
                      :start-placeholder="$t('platformManagement.startDate')"
                      :end-placeholder="$t('platformManagement.endDate')"
                      :picker-options="pickerOptions"
                      :clearable="false"
                      @change="changeDate"
                    ></el-date-picker>
                  </el-form-item>
                </div>
              </el-col>
            </el-row>

            <div class="search-btn">
              <el-button type="primary" @click="getSnapList" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <el-button type="primary" @click="resetForm" class="miniBtn">
                {{ $t('public.reset') }}
              </el-button>
            </div>
          </el-form>
        </div>
        <p class="toolTipStyle" v-if="realTotalNum > 10000">
          {{$t('deviceManagement.toolTipMaxNum')}}
        </p>
        <div style="height: 600px" v-loading="loading" :element-loading-text="$t('public.loading')">
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <ul v-if="!loading && tableData.length" class="table-list">
            <li
              v-for="(item, index) in tableData"
              :key="index"
              class="list-li"
              @click="openBigImg(item)"
            >
              <div class="imgs">
                <el-image
                  fit="contain"
                  style="height: 100%; width: 100%"
                  :src="item.src"
                  lazy
                ></el-image>
              </div>

              <div class="content">
                <div class="content-item">
                  <span class="content-item-left" :title="$t('deviceManagement.deviceID2') + ':'">
                    {{ $t('deviceManagement.deviceID2') + ':' }}
                  </span>
                  <span class="content-item-right" :title="item.deviceId">{{ item.deviceId }}</span>
                </div>
                <div class="content-item">
                  <span class="content-item-left" :title="$t('deviceManagement.deviceName') + ':'">
                    {{ $t('deviceManagement.deviceName') + ':' }}
                  </span>
                  <span class="content-item-right" :title="item.deviceName">
                    {{ item.deviceName }}
                  </span>
                </div>
                <div class="content-item">
                  <span class="content-item-left" :title="$t('deviceManagement.captureTime') + ':'">
                    {{ $t('deviceManagement.captureTime') + ':' }}
                  </span>
                  <span class="content-item-right" :title="item.captureTime">
                    {{ item.captureTime }}
                  </span>
                </div>
              </div>
            </li>
          </ul>

          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getSnapList"
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <!-- type="1" (树多选) -->
    <device-tools
      :dialogDeviceVisible="dialogDeviceVisible"
      @getChooseCameras="getCameras"
      :titleDialog="setDevLabel"
      :currentChooseCameras="currentChooseCameras"
      :title="setDevLabel"
      type="1"
      :token="token"
      :ifSendDeviceTypeApi="ifSendDeviceTypeApi"
      v-if="showTools"
    ></device-tools>

    <snap-detail></snap-detail>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { getFormatDate } from '@/utils/common/mutil'

import DeviceTools from '@/components/device-tools'
import snapDetail from './component/snap-detail'
import { getBlob } from '@/utils/common/download'

export default {
  name: 'ViewLibrarySnap',
  components: {
    'device-tools': DeviceTools,
    'snap-detail': snapDetail
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      ifSendDeviceTypeApi: null,
      isRouterAlive: true,

      //用户权限判断
      PermissionInfo: true,

      parentPage: 'metadata',
      token: '',
      currentChooseCameras: [],
      userType: '2',
      dialogDeviceVisible: false,

      searchForm: {
        cameraNames: '',
        cameraIds: [],
        type: [null],
        captureStartTime: '',
        captureEndTime: '',

        sourceType: ''
      },
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

      algorithmTypeList: [],
      dateVal: '',

      loading: false,
      tableData: [],
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0,
      realTotalNum: 0,
      detailDialogVisible: false,
      dataForm: {},
      showTools: true,

      devSourceList: [
        {
          name: this.$t('deviceManagement.allDevice'),
          value: ''
        },
        {
          name: this.$t('deviceManagement.monitoringEquipment'),
          value: 1
        },
        {
          name: this.$t('deviceManagement.acquisitionEquipment'),
          value: 2
        }
      ],

      searchType: [1, 2, 3, 4, 99],
      choosedDataType: ''
    }
  },

  computed: {
    setDevLabel() {
      let name = ''
      this.devSourceList.filter(item => {
        if (this.searchForm.sourceType == item.value) {
          name = item.name
        }
      })
      return name
    }
  },

  async created() {},
  async mounted() {
    await this.getSearchTypeList() //获取检索类型
  },
  activated() {
    
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.userType = this.$route.query.userType
      this.token = this.$route.query.token
    },

    // 初始化日期
    initialization_Date() {
      this.dateVal = [
        new Date(getFormatDate(new Date()).substring(0, 10) + ' 00:00:00'),
        new Date()
      ]
      this.searchForm.captureStartTime = getFormatDate(this.dateVal[0])
      this.searchForm.captureEndTime = getFormatDate(this.dateVal[1])
    },

    //获取检索类型
    async getSearchTypeList() {
      this.algorithmTypeList = [
        {
          name: this.$t('deviceManagement.unlimited'),
          value: null
        },
        {
          name: this.$t('deviceManagement.face'),
          value: 1
        },
        {
          name: this.$t('deviceManagement.personnel'),
          value: 2
        },
        {
          name: this.$t('deviceManagement.vehicle'),
          value: 3
        },
        {
          name: this.$t('deviceManagement.nonVehicle'),
          value: 4
        },
        {
          name: this.$t('deviceManagement.other'),
          value: 99
        }
      ]
      this.searchForm.type = [this.algorithmTypeList[0].value]
      this.searchType = [1, 2, 3, 4, 99]
      this.getSnapList()
    },

    changeSourceType(val) {
      this.searchForm.cameraNames = ''
      this.searchForm.cameraIds = []
      if (val == 1) {
        this.ifSendDeviceTypeApi = '1'
      } else if (val == 2) {
        this.ifSendDeviceTypeApi = '5'
      }
      this.showTools = false
      this.$nextTick(() => {
        this.showTools = true
      })
    },

    // 获取元数据列表
    async getSnapList() {
      this.loading = true

      let res = await this.$api.queryCapture({
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchInfo: {
          searchType: this.searchType,
          deviceIds: this.searchForm.cameraIds,
          startTime: this.searchForm.captureStartTime,
          endTime: this.searchForm.captureEndTime
        },
        netType: this.$getNetType()
      })
      if (res.resultCode == 0) {
        const tableData = res.snapList
        if (tableData.length > 0) {
          for (let i = 0; i < tableData.length; i++) {
            tableData[i].src = tableData[i].captureImagePath
          }
        }
        this.tableData = tableData
        this.realTotalNum = res.pageInfo.totalNum
        this.totalNum = res.pageInfo.totalNum > 10000 ? 10000 : res.pageInfo.totalNum
      } else {
        this.tableData = []
        this.totalNum = 0
        this.realTotalNum = 0
      }
      this.loading = false
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    getCameras(cameras) {
      let currentCameras = [],
        camerasArray = []
      if (cameras.length) {
        for (let i = 0; i < cameras.length; i++) {
          currentCameras.push(cameras[i].label)
          camerasArray.push(cameras[i].id)
        }
        this.searchForm.cameraNames = currentCameras.join(',')
        this.searchForm.cameraIds = camerasArray
      } else {
        this.searchForm.cameraNames = ''
        this.searchForm.cameraIds = []
      }
    },
    openDialog() {
      this.dialogDeviceVisible = true
    },

    typeChange(val) {
      if (val.indexOf(null) != -1 && val.length == 1) {
        this.searchType = [1, 2, 3, 4, 99]
      } else if (
        val.indexOf(null) != -1 &&
        val.length != 1 &&
        val.indexOf(null) != val.length - 1
      ) {
        this.searchForm.type.splice(this.searchForm.type.indexOf(null), 1)
        this.searchType = this.searchForm.type
      } else if (
        val.indexOf(null) != -1 &&
        val.length != 1 &&
        val.indexOf(null) == val.length - 1
      ) {
        this.searchForm.type = [null]
        this.searchType = [1, 2, 3, 4, 99]
      } else {
        this.searchType = this.searchForm.type
      }
    },
    // 改变开始时间
    changeDate(val) {
      if (val) {
        this.searchForm.captureStartTime = getFormatDate(val[0])
        this.searchForm.captureEndTime = getFormatDate(val[1])
      } else {
        this.searchForm.captureStartTime = ''
        this.searchForm.captureEndTime = ''
      }
    },

    // 重置表单
    resetForm() {
      this.searchForm = {
        cameraNames: '',
        cameraIds: [],
        type: [this.algorithmTypeList[0].value],
        captureStartTime: '',
        captureEndTime: '',

        sourceType: ''
      }
      this.searchType = [1, 2, 3, 4, 99]
      this.dateVal = ''

      this.showTools = false
      this.$nextTick(() => {
        this.showTools = true
      })
    },
    async getImageUrl(src) {
      const res = await getBlob(src)
      if (res) {
        const blob = new Blob([res], { type: 'image/jpeg' })
        return URL.createObjectURL(blob)
      }
    },

    // 查看大图详情
    async openBigImg(row) {
      this.choosedDataType = row.dataType
      let res = await this.$api.queryCaptureInfo({
        snapId: row.snapId,
        searchType: row.dataType,
        netType: this.$getNetType()
      })
      if (res.resultCode != 0) return
      const dataForm = res
      dataForm.captureImageSrc = dataForm.captureImagePath
      dataForm.largeImageSrc = dataForm.largeImagePath
      this.dataForm = dataForm
      this.detailDialogVisible = true
    }
  }
}
</script>

<style lang="scss">
#gat1400SnapManage {
  width: 100%;
  height: 100%;

  .newCameras {
    position: relative;
    display: inline-block;

    .el-input__inner {
      width: 200px !important;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addIcon {
      position: absolute;
      right: 5px;
      top: 13px;
      width: 16px;
      height: 16px;
    }
  }

  .search-btn {
    position: absolute;
    right: 0px;
    bottom: 41px;
  }
  .el-checkbox {
    margin-right: 16px;
    color: #fff;
  }
  .table-list {
    width: 100%;
    max-height: 680px;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    -ms-overflow-style: none;
    display: flex;
    flex-wrap: wrap;
    .list-li {
      margin-right: 1%;
      margin-bottom: 20px;
      padding: 10px;
      width: calc(19% - 20px);
      height: 300px;
      border-radius: 4px;
      background: rgba(41, 41, 41, 1);
      cursor: pointer;
      .imgs {
        margin: 0 auto;
        width: 100%;
        height: 200px;
        border-radius: 4px;
        text-align: center;
        .imgCor {
          width: 100%;
          height: 100%;
        }
      }

      .content {
        margin-top: 10px;
        .content-item {
          font-size: 16px;
          color: #fff;
          line-height: 24px;
          display: flex;
          .content-item-left {
            width: 25%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .content-item-right {
            width: 75%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
    }
  }
  .toolTipStyle {
    color: rgb(221, 0, 0);
    margin: 5px 0;
    font-size: 14px;
  }
}
</style>
