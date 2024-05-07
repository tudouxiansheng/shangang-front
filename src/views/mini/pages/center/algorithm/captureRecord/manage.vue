<template>
  <div
    id="capture-record"
    v-if="isRouterAlive"
    ref="captureRecord"
    v-loading="loading"
    :element-loading-text="$t('public.loading')"
  >
    <el-row class="full_height" :gutter="40">
      <el-col :span="24">
        <el-tabs v-model="searchMode" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('repo.vehicleCapture')" :name="String(CaptureType.vehicle)" />
          <el-tab-pane :label="$t('repo.faceCapture')" :name="String(CaptureType.person)" />
        </el-tabs>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6" :lg="6" :xl="6" class="content_height">
        <div
          class="search-form-wrapper"
          v-loading="loadingGroup"
          :element-loading-text="$t('public.loading')"
          element-loading-background="rgba(8,55,83,0.7)"
        >
          <el-form ref="form" :model="searchForm" label-position="top">
            <el-form-item :label="$t('metadata.snapTime') + ' ：'" required>
              <el-date-picker
                style="width: 100% !important"
                v-model="dateVal"
                type="datetimerange"
                :clearable="false"
                :range-separator="$t('public.to')"
                :start-placeholder="$t('public.startTimePrompt')"
                :end-placeholder="$t('public.endTimePrompt')"
                @change="changeDate"
                popper-class="no-clear"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('retrieval.selectPlatform')" required>
              <el-select
                v-model="searchForm.platId"
                clearable
                :placeholder="$t('retrieval.selectPlatformPrompt')"
                @change="handleAccessPlatformIdChange"
              >
                <el-option
                  v-for="item in platformList"
                  :key="item.platformId"
                  :label="item.platformName"
                  :value="item.platformId"
                ></el-option>
              </el-select>
            </el-form-item>
            <div v-if="accessPlatformId" class="newCameras">
              <el-form-item :label="$t('metadata.sourceName') + ' ：'">
                <el-input
                  ref="selectACameraInput"
                  @focus="openDialog"
                  v-model="cameraName"
                  :placeholder="$t('alarmList.selectACamera')"
                >
                  <template #suffix>
                    <svg-icon icon-class="add-input" class-name="el-input__icon" />
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <el-form-item
              v-if="searchMode === String(CaptureType.vehicle)"
              :label="$t('metadata.pictureSource') + ' ：'"
            >
              <el-select
                clearable
                v-model="searchForm.intell"
                :popper-append-to-body="false"
                :placeholder="$t('metadata.selectpictureSource')"
              >
                <el-option
                  :label="$t('metadata.intelligentAnalysis1')"
                  :value="$t('metadata.intelligentAnalysis')"
                ></el-option>
              </el-select>
            </el-form-item>
            <div style="margin-bottom: 20px; text-align: center">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
              <el-button type="primary" @click="resetForm" class="miniBtn">
                {{ $t('public.reset') }}
              </el-button>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :xs="24" :sm="12" :md="18" :lg="18" :xl="18" class="content_height">
        <div class="repository_item_container">
          <el-row v-show="tableData.length">
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
            >
              {{ $t('repo.allSelect') }}
            </el-checkbox>

            <el-popover
              trigger="click"
              popper-class="export-btn-popper"
              placement="bottom"
              class="export-btn"
            >
              <div class="el-select-dropdown__item" @click="handleExportCommand(1)">
                {{ $t('retrieval.exportSelected') }}
              </div>
              <div class="el-select-dropdown__item" @click="handleExportCommand(2)">
                {{ $t('retrieval.exportPage') }}
              </div>
              <div class="el-select-dropdown__item" @click="handleExportCommand(3)">
                {{ $t('retrieval.exportAll') }}
              </div>
              <el-icon><el-icon-upload2 /></el-icon>
            </el-popover>
          </el-row>
          <div class="flex flex-col flex-1 overflow-hidden">
            <div v-show="!tableData.length" class="tableNOdata">
              <img src="@/assets/img/common/NOdata.png" alt />
              <p>{{ $t('public.noData') }}</p>
            </div>
            <div class="table-cards-wrapper" ref="tableCards" v-show="tableData.length">
              <el-checkbox-group v-model="checkedData" @change="handleCheckedDataChange">
                <div class="table-cards">
                  <el-card
                    v-for="(item, index) in tableData"
                    :key="index"
                    :class="[isChecked(item) && 'is-checked']"
                  >
                    <div class="card-header">
                      <el-checkbox
                        class="no-label"
                        :label="item"
                        :key="item.pictureInfo.thirdFileId"
                      />
                    </div>
                    <div class="img-content" @click="openBigImg(item)">
                      <el-image
                        v-if="item.pictureInfo && item.pictureInfo.thumPicUrl"
                        fit="fill"
                        :src="item.pictureInfo.thumPicUrl"
                        :lazy="tableData.length > 10"
                        scroll-container=".table-cards-wrapper"
                      ></el-image>
                    </div>
                    <div class="guard-info">
                      <span class="guard-info-item">
                        <svg-icon icon-class="record-time" />
                        <span :title="formatTime(item.deviceInfo.recordTime)">
                          {{ formatTime(item.deviceInfo.recordTime) }}
                        </span>
                      </span>
                      <span class="guard-info-item">
                        <svg-icon icon-class="record-camera" />
                        <span :title="item.deviceInfo.cameraName || $t('metadata.cameraNotExist')">
                          {{ item.deviceInfo.cameraName || $t('metadata.cameraNotExist') }}
                        </span>
                      </span>
                    </div>
                  </el-card>
                </div>
              </el-checkbox-group>
            </div>
          </div>
          <!--分页-->
          <pagination
            v-show="tableData.length"
            :total="totalNum"
            :page-sizes="[8, 16, 24, 32, 64, 128, 512]"
            v-model:pageNum="searchForm.pageInfo.pageNum"
            v-model:limit="searchForm.pageInfo.pageSize"
            @pagination="getCaptureData"
          ></pagination>
        </div>
      </el-col>
    </el-row>
    <camera-selector
      :key="deviceToolKey"
      :title="$t('metadata.selectCamara')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      :device-type="1"
      :platform-id="accessPlatformId"
      :max="1000"
    />
    <capture-detail
      v-model:visible="detailDialogVisible"
      :repository-type="repositoryType"
      :form="dataForm"
    ></capture-detail>
    <capture-export
      ref="captureExportRef"
      v-model:visible="batchVisible"
      :data="checkedCopyDate"
      :export-type="command"
      :totalNum="totalNum"
      :api="api"
      :queryParams="queryParamsFormattered"
    />
  </div>
</template>

<script>
import { handleGetPreview } from '@/utils/common/preViewImg'
import { UploadFilled as ElIconUpload2 } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { getFormatDate, getDIYTime2 } from '@/utils/common/mutil'
import CaptureDetail from './component/capture-detail'
import CaptureExport from './component/capture-export'
import CameraSelector from '@components/cameraSelector'
import { repositoryType as RepositoryTypeEnum } from './component/repositoryModal/constant'
import { CaptureType } from './constant'
export default {
  components: {
    CameraSelector,
    CaptureDetail,
    CaptureExport,
    ElIconUpload2
  },
  data() {
    return {
      isRouterAlive: true,
      locale: localStorage.getItem('locale'),
      CaptureType: CaptureType,
      searchMode: String(CaptureType.vehicle),
      loadingGroup: false,
      cameraName: '',
      //车辆抓拍搜索数据
      searchForm: {
        pageInfo: {
          pageNum: 1,
          pageSize: 8
        },
        searchType: 1,
        cameraList: undefined,
        beginTime: undefined,
        endTime: undefined,
        intell: undefined,
        platId: undefined
      },
      platformList: [],
      accessPlatformId: undefined,
      deviceToolKey: 0,
      //初始化时间
      dateVal: '',
      dialogDeviceVisible: false,
      totalNum: 0,
      loading: false,
      tableData: [],
      isIndeterminate: false,
      checkAll: false,
      checkedData: [],
      PermissionManagea: true,
      //目标抓拍详情弹窗是否显示
      detailDialogVisible: false,
      dataForm: {},
      command: undefined,
      queryParamsFormattered: null,
      api: undefined,
      //被选中的导出数据
      checkedCopyDate: [],
      batchVisible: false,
      exportLoading: false,
      dayjs
    }
  },
  name: 'CaptureRecord',
  computed: {
    repositoryType() {
      return this.searchMode === String(CaptureType.person)
        ? RepositoryTypeEnum.person
        : RepositoryTypeEnum.vehicle
    }
  },
  async mounted() {
    await this.initialization()
  },
  methods: {
    //初始化
    async initialization() {
      this.initialization_Date()
      await this.getAccessPlatList()
    },
    async getAccessPlatList() {
      this.loadingGroup = true
      const res = await this.$api.queryAccessPlatformList({
        platformType: 19
      })
      this.loadingGroup = false
      if (res.resultCode == 0) {
        this.platformList = res.platformList
        // 默认选择第一个平台
        if (this.platformList.length > 0) {
          this.searchForm.platId = this.platformList[0].platformId
          this.handleAccessPlatformIdChange(this.searchForm.platId)
        }
      }
    },
    //车辆抓拍目标抓拍切换
    handleTabClick() {
      this.resetForm()
      this.tableData = []
      this.totalNum = 0
    },
    isChecked(item) {
      return this.checkedData.find(
        data => data.pictureInfo.thirdFileId === item.pictureInfo.thirdFileId
      )
    },
    getCaptureData() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.loading = true
          this.checkAll = false
          this.isIndeterminate = false
          this.checkedData = []
          this.api =
            this.searchMode === String(CaptureType.vehicle)
              ? 'searchVehicleByCondition'
              : 'searchFaceByCondition'
          const res = await this.$api[this.api](JSON.parse(JSON.stringify(this.searchForm)))
          try {
            if (res && res.resultCode == 0) {
              if (res.resultList[0]?.datas?.length > 0) {
                res.resultList[0].datas.forEach(item => {
                  if (item?.pictureInfo.thumPicUrl) {
                    item.pictureInfo.thumPicUrl = handleGetPreview(item.pictureInfo.thumPicUrl)
                  }
                  if (item?.pictureInfo.picUrl) {
                    item.pictureInfo.picUrl = handleGetPreview(item.pictureInfo.picUrl)
                  }
                })
                this.tableData = res.resultList[0].datas
                 if (Number(res.resultList[0].total) > 10000) {
                  this.totalNum = 10000
                } else {
                  this.totalNum = Number(res.resultList[0].total)
                }
              } else {
                this.tableData = []
                this.totalNum = 0
              }
            } else {
              this.tableData = []
              this.totalNum = 0
            }
          } finally {
            this.loading = false
          }
        }
      })
    },
    openDialog() {
      this.dialogDeviceVisible = true
      this.$refs.selectACameraInput.blur()
    },
    // 改变开始时间
    changeDate(val) {
      if (val) {
        this.searchForm.beginTime = getFormatDate(val[0])
        this.searchForm.endTime = getFormatDate(val[1])
      } else {
        this.searchForm.beginTime = undefined
        this.searchForm.endTime = undefined
      }
    },
    // 初始化日期
    initialization_Date() {
      this.dateVal = [
        new Date(getFormatDate(getDIYTime2(1)[0]).substring(0, 10) + ' 00:00:00'),
        new Date(getFormatDate(new Date()).substring(0, 10) + ' 23:59:59')
      ]
      this.searchForm.beginTime = getFormatDate(this.dateVal[0])
      this.searchForm.endTime = getFormatDate(this.dateVal[1])
    },
    getCameras(cameras) {
      let currentCameras = [],
        camerasArray = []

      if (cameras.length) {
        for (let i = 0; i < cameras.length; i++) {
          currentCameras.push(cameras[i].name)
          camerasArray.push(cameras[i].id)
        }
        this.cameraName = currentCameras.join(',')
        this.searchForm.cameraList = camerasArray
      } else {
        this.cameraName = ''
        this.searchForm.cameraList = undefined
      }
    },
    handleFind() {
      if (!this.searchForm.platId) {
        this.$message.error(`${this.$t('retrieval.selectPlatformPrompt')}`)
        return
      }
      this.searchForm.pageInfo.pageNum = 1
      let s1 = new Date(this.searchForm.beginTime).getTime()
      let s2 = new Date(this.searchForm.endTime).getTime()
      let total = (s2 - s1) / 1000
      let plusDay = parseInt(total / (24 * 60))
      if (plusDay > 29 * 60) {
        this.$message({
          message: this.$t('metadata.timeSelect30'),
          type: 'warning',
          duration: '1000'
        })
      } else if (plusDay < 0) {
        this.$message({
          message: this.$t('metadata.timeSelectAgain'),
          type: 'warning',
          duration: '1000'
        })
      } else {
        // 计算实际结束时间 判断endTime是否大于当前时间
        let endTime = new Date(this.dateVal[1]).getTime()
        let now = new Date().getTime()
        if (endTime > now) {
          this.searchForm.endTime = this.dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
          this.endTimeStamp = new Date(this.searchForm.endTime).getTime()
        } else {
          this.searchForm.endTime = getFormatDate(this.dateVal[1])
          this.endTimeStamp = endTime
        }
        this.getCaptureData()
      }
    },
    // 重置表单
    resetForm() {
      this.dateVal = [
        new Date(getFormatDate(getDIYTime2(1)[0]).substring(0, 10) + ' 00:00:00'),
        new Date(getFormatDate(new Date()).substring(0, 10) + ' 23:59:59')
      ]
      this.searchForm = {
        pageInfo: {
          pageNum: 1,
          pageSize: 8
        },
        searchType: 1,
        cameraList: undefined,
        beginTime: getFormatDate(this.dateVal[0]),
        endTime: getFormatDate(this.dateVal[1]),
        intell: undefined,
        platId: undefined
      }
      this.cameraName = ''
      // 默认选择第一个平台
      if (this.platformList.length > 0) {
        this.searchForm.platId = this.platformList[0].platformId
        this.handleAccessPlatformIdChange(this.searchForm.platId)
      }
    },
    //抓拍全选
    handleCheckAllChange(val) {
      this.checkedData = val ? this.tableData : []
      this.isIndeterminate = false
    },
    handleCheckedDataChange(value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tableData.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tableData.length
    },
    // 查看大图详情
    async openBigImg(row) {
      let data = {
        ...row.attributes,
        ...row.pictureInfo,
        ...row.deviceInfo
      }
      if (row.attributes.lprInfo) {
        data = {
          ...data,
          ...row.attributes.lprInfo
        }
      }
      this.dataForm = data
      this.detailDialogVisible = true
    },
    async handleExportCommand(command) {
      if (command === 1 && this.checkedData.length === 0) {
        this.$message.error(this.$t('retrieval.selectExportData'))
        return
      }
      this.command = command

      try {
        await this.$confirm(
          this.searchMode === String(CaptureType.vehicle)
            ? this.$t('retrieval.vehicleExportPrompt')
            : this.$t('retrieval.exportPersonInfoPrompt'),
          this.$t('public.prompt'),
          {
            confirmButtonText: this.$t('public.confirm'),
            cancelButtonText: this.$t('public.cancel'),
            type: 'warning',
            closeOnClickModal: false
          }
        )
      } catch {
        return
      }
      if (command === 1) {
        this.checkedCopyDate = this.checkedData
        this.$refs.captureExportRef.dialogOpen()
      } else if (command === 2) {
        this.checkedCopyDate = this.tableData
        this.$refs.captureExportRef.dialogOpen()
      } else if (command === 3) {
        this.loading = true
        let obj = {
          pageInfo: {
            pageNum: 1,
            pageSize: 500
          },
          beginTime: this.searchForm.beginTime,
          endTime: this.searchForm.endTime,
          platId: this.searchForm.platId,
          searchType: 1
        }
        if (this.searchForm.cameraList) {
          obj.cameraList = this.searchForm.cameraList
        }
        if (this.searchForm.intell) {
          obj.intell = this.searchForm.intell
        }
        // 用于指定第一批第一张图片
        if (this.endTimeStamp) {
          obj.precisionTime = this.endTimeStamp + ''
        }
        this.queryParamsFormattered = obj
        this.batchVisible = true
      }
    },
    // 导出所有
    exportAllList() {
      let pageSize = 500
      let promises = []
      for (let i = 1; (i - 1) * pageSize < this.totalNum; i++) {
        promises.push(
          new Promise((resolve, reject) => {
            let obj = {
              pageInfo: {
                pageNum: i,
                pageSize: pageSize
              },
              beginTime: this.searchForm.beginTime,
              endTime: this.searchForm.endTime,
              platId: this.searchForm.platId,
              searchType: 1
            }
            if (this.searchForm.cameraList) {
              obj.cameraList = this.searchForm.cameraList
            }
            if (this.searchForm.intell) {
              obj.intell = this.searchForm.intell
            }

            let requestFunc = null
            if (this.searchMode === String(CaptureType.vehicle)) {
              requestFunc = this.$api.searchVehicleByCondition
            } else {
              requestFunc = this.$api.searchFaceByCondition
            }

            requestFunc(obj).then(res => {
              if (res && res.resultCode == 0) {
                if (res.resultList[0]?.datas?.length > 0) {
                  resolve(res.resultList[0].datas)
                } else {
                  resolve([])
                }
              } else {
                resolve([])
              }
            })
          })
        )
      }

      Promise.all(promises).then(resultList => {
        let list = []
        if (resultList.length) {
          resultList.forEach(item => (list = list.concat(item)))
        }
        this.exportLoading = false
        this.checkedCopyDate = list
        this.batchVisible = true
      })
    },
    handleAccessPlatformIdChange(val) {
      if (val) {
        this.$api
          .getCameraPlat({
            accessId: val
          })
          .then(res => {
            if (res.resultCode == 0) {
              this.accessPlatformId = res.platId
            } else {
              this.searchForm.platId = undefined
              this.accessPlatformId = undefined
            }
          })
          .catch(err => {
            this.searchForm.platId = undefined
            this.accessPlatformId = undefined
          })
      } else {
        this.accessPlatformId = undefined
      }
      // 强制更新镜头选择组件
      this.deviceToolKey += 1
      // 平台变化 情况已选择的镜头
      this.cameraName = ''
      this.searchForm.cameraList = undefined
    },
    formatTime(timeStamp) {
      return this.dayjs(parseInt(timeStamp)).format('YYYY-MM-DD HH:mm:ss')
    }
  }
}
</script>

<style lang="scss">
.export-btn-popper {
  padding: 6px 0;
}

#capture-record {
  box-sizing: border-box;
  padding: 20px 20px 0;
  height: 100%;
  width: 100%;

  .full_height {
    height: 100%;
    position: relative;
  }

  .content_height {
    height: calc(100% - 54px);
    position: relative;
    overflow: hidden;
  }

  .el-tabs {
    .el-tabs__nav-scroll {
      padding-left: 0;
    }

    .el-tabs__content,
    .el-tabs__nav-wrap:after {
      display: none;
    }

    .el-tabs__item {
      color: #ccc;
      font-size: 18px !important;
      background: transparent !important;

      &:hover,
      &.is-active {
        color: #409eff;
      }
    }
  }

  .search-form-wrapper {
    height: 100%;
    background-color: #083753;
    color: #f2f2f2;

    .el-form {
      padding: 20px;
    }

    .el-select {
      width: 100%;
    }

    .el-form--inline .el-form-item__content {
      width: 100%;
    }

    .newCameras {
      width: 100%;
      position: relative;
      display: inline-block;

      .el-input__inner {
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
  }

  .repository_item_container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    .check_all {
      display: inline-block;
      margin-right: 10px;

      .el-checkbox {
        color: #fff;
        margin-right: 10px;
      }
    }

    .export-btn {
      margin-left: 20px;
      cursor: pointer;

      &:hover,
      &.is-active {
        color: #409eff;
      }
    }

    & > .el-row {
      padding-bottom: 10px;
    }

    .table-cards-wrapper {
      flex: 1;
      width: 100%;
      overflow-y: auto;
    }

    .table-cards {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 2rem;

      .el-card {
        border: none;
        border-radius: 0;
        background-color: #0a2941;
        color: #fff;
        cursor: pointer;
        box-sizing: border-box;

        .el-card__body {
          padding: 4px;
        }

        &:hover,
        &.is-checked {
          background-color: lighten(#0a2941, 5%);
        }

        .card-header {
          font-size: 14px;
          padding-bottom: 8px;

          > .el-checkbox .el-checkbox__label {
            display: none;
          }
        }

        .guard-info {
          display: flex;
          flex-direction: column;
          font-size: 14px;

          &-title {
            font-weight: bold;
            margin: 12px 0;
          }

          &-item {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            padding: 9px 8px;

            span {
              line-height: 1;
              flex: 1;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }

            .svg-icon {
              margin-right: 8px;
            }

            &:nth-child(2n - 1) {
              background-color: #16344d;
            }
          }
        }
      }

      .img-content {
        width: 100%;
        position: relative;
        margin-bottom: 8px;

        .el-image {
          width: 100%;
          height: 200px;
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) {
  #capture-record .repository_item_container .table-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media only screen and (min-width: 992px) {
  #capture-record .repository_item_container .table-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media only screen and (min-width: 1200px) {
  #capture-record .repository_item_container .table-cards {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
  }
}

@media only screen and (min-width: 1920px) {
  #capture-record .repository_item_container .table-cards {
    grid-template-columns: repeat(5, minmax(0, 1fr));
    row-gap: 2rem;
    column-gap: 3rem;
  }
}
</style>
