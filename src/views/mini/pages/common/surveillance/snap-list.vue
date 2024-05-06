<template>
  <div id="snap-list" v-if="isRouterAlive" ref="snapList">
    <el-row>
      <el-col :span="24" class="el-row20">
        <div v-if="PermissionManage" class="btnMargin">
          <el-button type="primary" @click="downLoadLot">
            {{ $t('snapList.batchDownload') }}
          </el-button>
        </div>
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            :label-width="locale === 'en' ? '130px' : '84px'"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item
                :label="$t('snapList.snapDevice') + '：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                :style="screenFlag ? 'width:25%' : ''"
              >
                <el-input
                  @focus="handleFocus"
                  v-model="choosedCameras"
                  ref="deviceInput"
                  :placeholder="$t('snapList.snapDevicePrompt')"
                  class="newCameras"
                >
                  <template #suffix>
                    <svg-icon icon-class="add-input" class-name="el-input__icon" />
                  </template>
                </el-input>
              </el-form-item>
              <el-form-item
                :label="$t('snapList.snapType') + '：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
              >
                <el-checkbox-group v-model="checkList">
                  <el-checkbox label="2" size="medium">
                    {{ $t('snapList.alarmPlatformSnap') }}
                  </el-checkbox>
                  <el-checkbox label="3" size="medium">
                    {{ $t('snapList.manualPlatformSnap') }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item
                :label="$t('snapList.snapDate') + '：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                :style="screenFlag ? 'width:32%' : ''"
                v-if="screenFlag"
              >
                <el-date-picker
                  :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                  @change="dateChange"
                  v-model="dateValue"
                  type="datetimerange"
                  :placeholder="$t('snapList.selectStartTime')"
                  :range-separator="$t('snapList.to')"
                  :start-placeholder="$t('snapList.selectstartdate')"
                  :end-placeholder="$t('snapList.selectEndDate')"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="flexstart" v-if="flag">
              <el-form-item
                :label="$t('snapList.snapDate') + '：'"
                :class="screenFlag ? 'screenthree' : 'flex-item'"
                v-if="!screenFlag"
              >
                <el-date-picker
                  :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
                  @change="dateChange"
                  v-model="dateValue"
                  type="datetimerange"
                  :placeholder="$t('snapList.selectStartTime')"
                  :range-separator="$t('snapList.to')"
                  :start-placeholder="$t('snapList.selectstartdate')"
                  :end-placeholder="$t('snapList.selectEndDate')"
                  value-format="YYYY-MM-DD HH:mm:ss"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="search-btn">
              <el-button type="primary" @click="searchSnapList" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>

              <div class="manyCondition inputMiddle" @click="flag = !flag" v-if="!screenFlag">
                <span>{{ $t('public.manyCondition') }}</span>
                <el-icon v-if="flag"><el-icon-arrow-up /></el-icon>
                <el-icon v-else><el-icon-arrow-down /></el-icon>
              </div>
            </div>
          </el-form>
        </div>

        <div style="height: 600px" v-loading="loading" :element-loading-text="$t('public.loading')">
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>

          <el-table
            v-if="!loading && tableData.length"
            :data="tableData"
            :element-loading-text="$t('public.loading')"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            border
            ref="multipleTable"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="devName" :label="$t('alarmLinkage.devName')" />
            <el-table-column prop="snapTime" :label="$t('snapList.snapDate')" />
            <el-table-column prop="snapType" :label="$t('snapList.snapType')" />
            <el-table-column prop="contentName" :label="$t('snapList.snapFileName')" />
            <el-table-column prop="thumbnail" :label="$t('snapList.thumbnail')">
              <template #default="{ row }">
                <el-image
                  :src="row.thumbnailSrc"
                  fit="fill"
                  style="width: 125px; height: 65px; cursor: pointer"
                  @click="openBigImg(row)"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column prop="deal" :label="$t('public.operating')">
              <template #default="{ row }">
                <span
                  style="color: #10a9ff; cursor: pointer"
                  @click="downImg(row)"
                  v-if="PermissionManage && row.urlSrc"
                >
                  {{ $t('snapList.downloadOriginalImage') }}
                </span>
              </template>
            </el-table-column>
          </el-table>

          <!--分页-->
          <div class="pagination" v-if="!loading && tableData.length">
            <div class="paging">
              <span>{{ $t('public.everyPageShows') }}</span>
              <el-select v-model="number" @change="numberChange">
                <el-option
                  v-for="(item, index) in numberList"
                  :key="index"
                  :label="item"
                  :value="index"
                ></el-option>
              </el-select>
              <span>{{ $t('public.records') }}</span>
            </div>

            <div>
              <el-pagination
                v-model:current-page="pageNum"
                :page-size="pageSize"
                layout="total, prev, pager, next, jumper"
                :total="totalNum"
                @current-change="handleCurrentChange"
                background
              />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <camera-selector
      :title="$t('snapList.snapDeviceTitle')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
      mode="single"
      :deviceType="1"
    />
    <see-big-image></see-big-image>
  </div>
</template>

<script>
import { handleGetPreview } from '@/utils/common/preViewImg'
import { ArrowUp as ElIconArrowUp, ArrowDown as ElIconArrowDown } from '@element-plus/icons-vue'
import * as dayjs from 'dayjs'
import { permissions } from '@/utils/common/permissions'
import { lastMonthDate, getFormatDate } from '@/utils/common/mutil'
import CameraSelector from '@components/cameraSelector'
import SeeBigImage from '../component/SeeBigImage'
import judgeWindow from '@/mixin/judgeWindow'
import { blobToBase64, getBlobByGET } from '@/utils/common/download'
import { asyncPool } from '@/utils/common/utils'
import axios from 'axios'
import { PLATFORM_TYPE } from '@/enums/platformEnum'

export default {
  components: {
    CameraSelector,
    SeeBigImage,
    ElIconArrowUp,
    ElIconArrowDown
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      screenFlag: true,
      //用户权限判断
      PermissionManage: true,
      //点击展开
      flag: false,
      tableData: [],
      choosedCameras: '',
      camerasArray: [],
      dialogDeviceVisible: false,
      checkList: ['2', '3'],
      dateValue: [new Date(lastMonthDate()), new Date(new Date())],
      searchInfo: {
        beginTime: '',
        endTime: ''
      },
      loading: false,
      imageLoading: false,
      taskEndFlag: false,
      // 分页
      number: 0,
      //每页显示数量,
      numberList: [10, 20, 30, 40, 50, 100, 500],
      pageNum: 1,
      pageSize: 10,
      totalNum: 0,
      ImageDialogVisible: false,
      rowData: {},
      multipleSelection: [],
      dayjs
    }
  },
  name: 'CaptureManagement',
  mixins: [judgeWindow],
  async created() {
    this.getPermissions()
  },
  mounted() {
    this.pageResize()
    this.dateChange(this.dateValue)
  },
  activated() {
    this.setDialogCss()
    this.pageResize()
  },
  methods: {
    handleFocus() {
      this.$refs['deviceInput'].blur()
      this.dialogDeviceVisible = true
    },
    async getPermissions() {
      //用户权限判断
      this.PermissionManage = await permissions(142)
    },
    pageResize() {
      this.judgeWindow(1525)
    },

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    openDialog() {
      this.dialogDeviceVisible = true
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

    dateChange() {
      if (this.dateValue) {
        this.searchInfo.beginTime = getFormatDate(this.dateValue[0])
        this.searchInfo.endTime = getFormatDate(this.dateValue[1])
      } else {
        this.searchInfo.beginTime = ''
        this.searchInfo.endTime = ''
      }
    },

    async searchSnapList() {
      this.loading = true
      this.taskEndFlag = true
      if (this.validataCondition()) {
        let snapType = 0
        if (this.checkList.length != 2) {
          snapType = parseInt(this.checkList[0])
        }
        let obj = {
          snapType,
          pageInfo: {
            pageNum: this.pageNum,
            pageSize: this.pageSize
          },
          cameraList: this.camerasArray,
          searchInfo: { ...this.searchInfo },
          netType: this.$getNetType()
        }
        const lists = await this.$api.getSnapList(obj)
        this.loading = false
        let pageInfo = lists.pageInfo
        this.totalNum = pageInfo && pageInfo.totalNum
        const snapList = lists.snapList
        let type = [
          this.$t('snapList.unclassified'),
          this.$t('snapList.alarmPlatformSnap'),
          this.$t('snapList.manualPlatformSnap')
        ]
        this.tableData = []

        this.$nextTick(() => {
          this.$refs.multipleTable?.setScrollTop(0)
        })

        for (let i = 0; i < snapList.length; i++) {
          this.tableData.push({
            platType: snapList[i].platType,
            devName: snapList[i].cameraName,
            snapTime: snapList[i].snapTime,
            snapType:
              snapList[i].snapType === 2 ? type[1] : snapList[i].snapType === 3 ? type[2] : type[0],
            contentName: snapList[i].contentName,
            thumbnail: snapList[i].previewUrl,
            url: snapList[i].url,
            thumbnailSrc: '',
            urlSrc: ''
          })
        }
        this.getImage()
      }
      this.loading = false
    },
    getImageFromPath(imagePath) {
      return new Promise((resolve, reject) => {
        axios({
          method: 'get',
          url: imagePath,
          timeout: 60000
        })
          .then(res => {
            if (res && res.data) {
              resolve(res.data.data)
            } else {
              reject(null)
            }
          })
          .catch(err => {
            // 请求异常的时候, 返回err
            reject(err)
          })
      })
    },
    async getImage() {
      this.imageLoading = true
      this.taskEndFlag = false
      try {
        const uploadImages = async item => {
          try {
            if (item.platType == 5) {
              item.urlSrc = handleGetPreview(item.url)
              item.thumbnailSrc = handleGetPreview(item.thumbnail)
            } else if(item.platType == 16){
              const thumbnailBlob = await getBlobByGET(item.thumbnail)
              item.thumbnailSrc = await blobToBase64(thumbnailBlob)
              const urlBlob = await getBlobByGET(item.url)
              item.urlSrc = await blobToBase64(urlBlob)
            }else {
              let thumbImageData = await this.getImageFromPath(item.thumbnail)
              item.thumbnailSrc = 'data:image/*;base64,' + thumbImageData
              let urlImageData = await this.getImageFromPath(item.url)
              item.urlSrc = 'data:image/*;base64,' + urlImageData
            }
            return item
          } catch (e) {
            throw new Error(e.message ?? 'download failed')
          }
        }
        await asyncPool.call(this, 6, this.tableData, uploadImages)
      } finally {
        this.imageLoading = false
      }
    },
    validataCondition() {
      if (!this.camerasArray.length) {
        this.$alert(this.$t('alarmList.selectACamera'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          type: 'warning'
        })
        return false
      } else if (this.checkList.length == 0) {
        this.$alert(this.$t('snapList.selectCapturetype'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          type: 'warning'
        })
        return false
      } else if (!this.dateValue) {
        this.$alert(this.$t('snapList.selectCaptureTime'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          type: 'warning'
        })
        return false
      } else {
        return true
      }
    },
    openBigImg(row) {
      this.rowData = row
      this.ImageDialogVisible = true
    },
    downImg(row) {
      let param = {
        fileName: row.contentName,
        downloadUrl: row.urlSrc
      }
      window.webkitProc('snap_download', JSON.stringify(param))
    },
    downLoadLot() {
      if (this.imageLoading) {
        this.$message({
          message: this.$t('snapList.downloadLoading'),
          type: 'warning'
        })
        return
      }
      if (!this.multipleSelection.length) {
        this.$message({
          message: this.$t('snapList.selectDownload'),
          type: 'warning'
        })
      }
      let imgUrl = []
      this.$loadash.each(this.multipleSelection, function (item) {
        imgUrl.push({ fileName: item.contentName, downloadUrl: item.urlSrc })
      })

      for (let i = 0; i < imgUrl.length; i++) {
        window.webkitProc('snap_download', JSON.stringify(imgUrl[i]))
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    seeClient() {
      let obj = { functionId: 'local_path_open_req', resultList: '123' }
      window.webkitProc('local_path_open_req', JSON.stringify(obj))
    },

    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.searchSnapList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.searchSnapList()
    }
  }
}
</script>

<style lang="scss">
#snap-list {
  width: 100%;
  height: 100%;
  .el-table__header-wrapper {
    overflow: hidden !important;
  }

  .flex-item {
    width: 42%;
  }

  .newCameras {
    width: 200px;
    height: 38px;
    .el-input__inner {
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .addIcon {
    position: absolute;
    width: 16px;
    height: 16px;
    right: 5px;
    top: 13px;
  }

  .search-form .el-checkbox__label {
    color: #fff;
  }
  .el-dialog__body {
    padding: 5px 15px 15px 22px;
  }
  .el-table__header-wrapper {
    overflow-y: hidden;
  }
}
</style>
