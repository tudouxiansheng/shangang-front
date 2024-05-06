<template>
  <div class="person-application">
    <el-tabs v-model="activeName" @tab-click="handleTabChang">
      <el-tab-pane :label="$t('application.picToPeople')" name="image">
        <div class="filter-wrapper">
          <el-form class="custom-el-form" :model="queryForm" :inline="true">
            <div class="part-l">
              <el-upload
                ref="upload"
                class="avatar-uploader"
                :action="uploadUrl"
                :show-file-list="false"
                :limit="1"
                :multiple="false"
                :before-upload="handleBeforeUpload"
                :on-success="handleAvatarSuccess"
                accept="image/*"
              >
                <img class="avatar-img" v-if="imageUrl" :src="imageUrl" />
                <div class="tips-wrapper" v-else>
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                  <div class="tips">{{ $t('public.upload') }}</div>
                </div>
              </el-upload>
            </div>
            <div class="part-r">
              <el-form-item :label="$t('public.period')">
                <el-radio-group v-model="timeType" size="small" @change="handleChangeQuickDateTime">
                  <el-radio-button :label="3">{{ $t('public.today') }}</el-radio-button>
                  <el-radio-button :label="1">{{ $t('public.threeDay') }}</el-radio-button>
                  <el-radio-button :label="2">{{ $t('public.sevenDay') }}</el-radio-button>
                  <el-radio-button :label="4">{{ $t('public.customize') }}</el-radio-button>
                </el-radio-group>
              </el-form-item>
              <el-form-item :label="$t('public.startTime')">
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  default-time="00:00:00"
                  :editable="false"
                  @change="handleChangeDate"
                  :picker-options="pickerOptions"
                  v-model="queryForm.beginTime"
                  type="datetime"
                  :placeholder="$t('public.startTime')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('public.endTime')">
                <el-date-picker
                  value-format="yyyy-MM-dd HH:mm:ss"
                  :editable="false"
                  @change="handleChangeDate"
                  :picker-options="pickerOptions"
                  v-model="queryForm.endTime"
                  type="datetime"
                  :placeholder="$t('public.endTime')"
                ></el-date-picker>
              </el-form-item>
              <el-form-item :label="$t('public.camera')">
                <div class="camera-resource">
                  <div class="camera-radio">
                    <el-radio-group v-model="queryForm.type">
                      <el-radio :label="1">{{ $t('public.all') }}</el-radio>
                      <el-radio :label="2">{{ $t('public.selectCamera') }}</el-radio>
                    </el-radio-group>
                  </div>
                  <div class="camera">
                    <el-input v-if="queryForm.type == 2" :placeholder="placeholder" @click.native="handleClickCamera">
                      <img slot="suffix" class="tree-img" src="../images/tree.png" />
                    </el-input>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$t('public.similarity')">
                <el-slider class="custom-slider" :min="60" v-model="queryForm.threshold" show-input> </el-slider>
              </el-form-item>
              <el-form-item :label="$t('public.quality')" v-if="false">
                <el-slider class="custom-slider" :min="60" v-model="queryForm.picValue" show-input> </el-slider>
              </el-form-item>
            </div>
          </el-form>
          <div class="btn-search">
            <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
            <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('application.condition')" name="condition">
        <div class="filter-wrapper">
          <el-form :model="queryForm" :inline="true">
            <el-form-item :label="$t('public.period')">
              <el-radio-group v-model="timeType" size="small" @change="handleChangeQuickDateTime">
                <el-radio-button :label="3">{{ $t('public.today') }}</el-radio-button>
                <el-radio-button :label="1">{{ $t('public.threeDay') }}</el-radio-button>
                <el-radio-button :label="2">{{ $t('public.sevenDay') }}</el-radio-button>
                <el-radio-button :label="4">{{ $t('public.customize') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('public.startTime')">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"
                :picker-options="pickerOptions"
                :editable="false"
                @change="handleChangeDate"
                v-model="queryForm.beginTime"
                type="datetime"
                :placeholder="$t('public.startTime')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('public.endTime')">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                @change="handleChangeDate"
                :editable="false"
                v-model="queryForm.endTime"
                type="datetime"
                :placeholder="$t('public.endTime')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('public.camera')">
              <div class="camera-resource">
                <div class="camera-radio">
                  <el-radio-group v-model="queryForm.type">
                    <el-radio :label="1">{{ $t('public.all') }}</el-radio>
                    <el-radio :label="2">{{ $t('public.selectCamera') }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="camera">
                  <el-input v-if="queryForm.type == 2" :placeholder="placeholder" @click.native="handleClickCamera">
                    <img slot="suffix" class="tree-img" src="../images/tree.png" />
                  </el-input>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="$t('public.sex')">
              <el-select class="custom-select-mini" v-model="queryForm.gender" :placeholder="$t('public.sex')">
                <el-option :value="-1" :label="$t('public.all')"></el-option>
                <el-option :value="1" :label="$t('public.man')"></el-option>
                <el-option :value="2" :label="$t('public.woman')"></el-option>
                <!--                <el-option :value="0" :label="$t('public.unknown')"></el-option>-->
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('public.age')">
              <el-select class="custom-select-mini" :placeholder="$t('public.age')" v-model="queryForm.age">
                <el-option :value="-1" :label="$t('public.all')"></el-option>
                <el-option :value="1" :label="$t('public.child')"></el-option>
                <el-option :value="2" :label="$t('public.juvenile')"></el-option>
                <el-option :value="3" :label="$t('public.youth')"></el-option>
                <el-option :value="4" :label="$t('public.middleAged')"></el-option>
                <el-option :value="5" :label="$t('public.elderly')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('public.eyeGlass')">
              <el-select class="custom-select" :placeholder="$t('public.eyeGlass')" v-model="queryForm.eyeGlass">
                <el-option :value="-1" :label="$t('public.all')"></el-option>
                <el-option :value="1" :label="$t('public.glasses')"></el-option>
                <el-option :value="2" :label="$t('public.withoutGlasses')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('public.hat')">
              <el-select class="custom-select" :placeholder="$t('public.hat')" v-model="queryForm.hat">
                <el-option :value="-1" :label="$t('public.all')"></el-option>
                <el-option :value="1" :label="$t('public.wearHat')"></el-option>
                <el-option :value="2" :label="$t('public.noHat')"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('public.mask')">
              <el-select class="custom-select" :placeholder="$t('public.mask')" v-model="queryForm.mask">
                <el-option :value="-1" :label="$t('public.all')"></el-option>
                <el-option :value="1" :label="$t('public.wearmask')"></el-option>
                <el-option :value="2" :label="$t('public.withoutMask')"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="btn-search">
            <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
            <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('application.humanRetrieval')" name="humanRetrieval">
        <div class="filter-wrapper">
          <el-form :model="queryForm" :inline="true">
            <el-form-item :label="$t('public.period')">
              <el-radio-group v-model="timeType" size="small" @change="handleChangeQuickDateTime">
                <el-radio-button :label="3">{{ $t('public.today') }}</el-radio-button>
                <el-radio-button :label="1">{{ $t('public.threeDay') }}</el-radio-button>
                <el-radio-button :label="2">{{ $t('public.sevenDay') }}</el-radio-button>
                <el-radio-button :label="4">{{ $t('public.customize') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('public.startTime')">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                default-time="00:00:00"
                :picker-options="pickerOptions"
                :editable="false"
                @change="handleChangeDate"
                v-model="queryForm.beginTime"
                type="datetime"
                :placeholder="$t('public.startTime')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('public.endTime')">
              <el-date-picker
                value-format="yyyy-MM-dd HH:mm:ss"
                :picker-options="pickerOptions"
                @change="handleChangeDate"
                :editable="false"
                v-model="queryForm.endTime"
                type="datetime"
                :placeholder="$t('public.endTime')"
              ></el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('public.camera')">
              <div class="camera-resource">
                <div class="camera-radio">
                  <el-radio-group v-model="queryForm.type">
                    <el-radio :label="1">{{ $t('public.all') }}</el-radio>
                    <el-radio :label="2">{{ $t('public.selectCamera') }}</el-radio>
                  </el-radio-group>
                </div>
                <div class="camera">
                  <el-input v-if="queryForm.type == 2" :placeholder="placeholder" @click.native="handleClickCamera">
                    <img slot="suffix" class="tree-img" src="../images/tree.png" />
                  </el-input>
                </div>
              </div>
            </el-form-item>
            <!-- 上衣颜色 -->
            <el-form-item :label="$t('public.topColor')">
              <el-select class="custom-select" v-model="queryForm.upperColor">
                <el-option v-for="item in colors" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <!-- 上衣款式 -->
            <el-form-item :label="$t('public.topStyle')">
              <el-select class="custom-select" v-model="queryForm.upperStyle">
                <el-option
                  v-for="item in upStyles"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item>
            <!-- 下衣颜色 -->
            <el-form-item :label="$t('public.bottomColor')">
              <el-select class="custom-select" v-model="queryForm.lowerColor">
                <el-option v-for="item in colors" :key="item.value" :value="item.value" :label="item.label"></el-option>
              </el-select>
            </el-form-item>
            <!-- 下衣款式 -->
            <!-- <el-form-item :label="$t('public.bottomStyle')">
              <el-select class="custom-select" v-model="queryForm.lowerStyle">
                <el-option
                  v-for="item in botStyles"
                  :key="item.value"
                  :value="item.value"
                  :label="item.label"
                ></el-option>
              </el-select>
            </el-form-item> -->
          </el-form>
          <div class="btn-search">
            <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
            <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <div class="card-wrapper">
      <CardList
        :data="tableData"
        pager
        :total="total"
        :page-size="listQuery.pageSize"
        :page-sizes="[12, 30, 50, 100]"
        :page-no="listQuery.pageNum"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
        :columns="6"
      >
        <template slot-scope="{ item, index }">
          <div class="item-wrapper">
            <div class="img-wrapper">
              <!-- <img :src="item.detectUrl" alt="" @click="handleDetail(item)" /> -->
              <img :src="item.detectUrl" alt="" class="img-bg" v-if="activeName == 'humanRetrieval'" />
              <img :src="item.detectUrl" alt="" class="img" @click="handleDetail(item, index)" />
            </div>
            <div class="captureInfo">
              <div class="address-confidence">
                <div class="address" :title="item.cameraName">{{ item.cameraName }}</div>
                <div
                  class="track"
                  v-if="activeName == 'image' || activeName == 'condition'"
                  :title="$t('public.track')"
                  @click="handleGoTrack(item)"
                >
                  <img src="../images/track.png" alt="" />
                </div>
              </div>
              <div class="item" v-if="activeName == 'image'">
                <div class="label">{{ $t('public.similarity') }}</div>
                <div class="value" v-if="item.confidence">{{ (item.confidence * 1).toFixed(2) }}%</div>
              </div>
              <div class="captureTime">{{ item.captureTime }}</div>
            </div>
          </div>
        </template>
      </CardList>
    </div>
    <choseCamera
      v-if="choseCameraDialog"
      @close="handleCloseChoseCamera"
      :choseDeviceList="choseDeviceList"
    ></choseCamera>
    <searchDetail
      @close="handleCloseDetailDialog"
      @renlianjiasuo="handleQuickSearch"
      :detail.sync="detailRow"
      :searchType="searchType"
      v-if="showDetailDialog"
    ></searchDetail>
  </div>
</template>

<script>
import Dayjs from '../../../../../utils/Dayjs'
import CardList from '../../../../../components/CardList'
import choseCamera from '../components/chose-camera'
import searchDetail from '../components/search-detail'
import { DateDiff } from '../../../../../utils/mutil'
import {
  bodysearchByCondition,
  facesearchByCondition,
  facesearchByImage,
  getGuardHitInfo,
  getUploadUrl,
} from '../../../../../utils/api'
export default {
  name: 'index',
  components: {
    CardList,
    choseCamera,
    searchDetail,
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
      searchType: 0,
      detailRow: {},
      activeName: 'image',
      uploadUrl: '',
      imageUrl: '',
      choseCameraDialog: false,
      showDetailDialog: false,
      queryForm: {
        /***********公共参数 */
        image: {},
        type: 1, //摄像机
        threshold: 90, //相似度
        picValue: 90, //图片质量 舍弃
        beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
        cameraList: [],
        /***********人脸 */
        age: -1,
        gender: -1,
        eyeGlass: -1,
        hat: -1,
        mask: -1,
        /*************人体参数 */
        upperColor: -1, //上身颜色
        upperStyle: -1, //上身颜色
        lowerColor: -1, //下身颜色
        // lowerStyle: -1, //下身款式
        // bodyType: -1, //体型
        // backpack: -1, //背包
        // helmet: -1, //是否戴头盔
      },
      timeType: 3,
      placeholder: this.$t('public.selectCamera'),
      searchPictureKey: '',
      choseDeviceList: [],
      tableData: [],
      listQuery: {
        pageNum: 1,
        pageSize: 12,
      },
      total: 0,
      colors: [
        {
          label: this.$t('public.all'),
          value: -1,
        },
        {
          label: this.$t('public.black'),
          value: 1,
        },
        {
          label: this.$t('public.grey'),
          value: 4,
        },
        {
          label: this.$t('public.orange'),
          value: 5,
        },
        {
          label: this.$t('public.pink'),
          value: 6,
        },
        {
          label: this.$t('public.other'),
          value: 0,
        },
      ], //颜色
      upStyles: [
        {
          label: this.$t('public.all'),
          value: -1,
        },
        {
          label: this.$t('public.unknown'),
          value: 0,
        },
        {
          label: this.$t('application.shirtL'),
          value: 1,
        },
        {
          label: this.$t('application.shirtS'),
          value: 2,
        },
      ], //款式
      // botStyles: [
      //   {
      //     label: this.$t('public.all'),
      //     value: -1,
      //   },
      //   {
      //     label: this.$t('public.unknown'),
      //     value: 0,
      //   },
      //   {
      //     label: this.$t('application.trousers'),
      //     value: 1,
      //   },
      //   {
      //     label: this.$t('application.shorts'),
      //     value: 2,
      //   },
      //   {
      //     label: this.$t('application.skirt'),
      //     value: 3,
      //   },
      // ], //款式
    }
  },
  created() {
    // this.handleGetList()
    this.$EventBus.$on('renlianguiji', (item) => {
      this.handleGoTrack(item)
    })
    this.$EventBus.$on('renlianjiasuo', (item) => {
      this.activeName = 'image'
      this.handleTabChang()
      console.log(item)
      this.imageUrl = item.captureUrl
      // this.queryForm.image.fileId = this.imageUrl
      //   .slice(0, this.imageUrl.indexOf('?'))
      //   .slice(
      //     this.imageUrl.slice(0, this.imageUrl.indexOf('?')).lastIndexOf('/') + 1,
      //     this.imageUrl.slice(0, this.imageUrl.indexOf('?')).lastIndexOf('.')
      //   )
      this.queryForm.image.url = this.imageUrl
    })
  },
  beforeDestroy() {
    this.$EventBus.$off('renlianguiji')
    this.$EventBus.$off('renlianjiasuo')
  },
  methods: {
    handleChangeDate() {
      this.timeType = 4
    },
    handleTabChang() {
      this.tableData = []
      this.total = 0
      this.handleReset()
      this.handleCloseDetailDialog()
    },
    handleGoTrack(item) {
      if (sessionStorage.getItem('cuType') == 1) {
        // sessionStorage.setItem(
        //   'trailSearchBy',
        //   JSON.stringify({
        //     trackType: 1, //人员轨迹，车辆轨迹
        //     ...item,
        //   })
        // )
        window.webkitProc(
          'switch_page_by_url',
          JSON.stringify({
            url: '/trail',
            menuName: localStorage.getItem('locale') != 'en' ? '动态轨迹' : 'Dynamic trajectory',
            params: JSON.stringify({
              trackType: 1, //人员轨迹，车辆轨迹
              ...item,
              optType: 'trail',
            }),
          })
        )
        // qt
      } else {
        this.$router.push({
          name: 'trail',
          params: {
            trackType: 1, //人员轨迹，车辆轨迹
            ...item,
          },
        })
      }
    },
    handleQuickSearch(picture) {
      this.activeName = 'image'
      this.imageUrl = picture
      this.queryForm.image.url = picture
    },
    handleDetail(item, index) {
      this.detailRow = { ...item, index }
      this.showDetailDialog = true
      // getGuardHitInfo({ alarmId: item.alarmId }).then((res) => {
      //   if (res.resultCode == 0) {
      //     this.detailRow = { ...item,...res.guardHitInfo }
      //     this.showDetailDialog = true
      //   }
      // })
    },

    handleCloseDetailDialog() {
      this.detailRow = {}
      this.showDetailDialog = false
    },
    // 检查文件名称长度是否小于64,
    checkFileLength(name, n = 64) {
      let inLength = false
      if (name) {
        // 处理文件名中存在多个点
        let nameArr = name.split('.')
        nameArr.pop()
        let nameStr = nameArr.join('')
        if (nameStr.length <= 64) {
          inLength = true
        } else {
          this.$message.warning(this.$t('tips.fileName'))
        }
      }
      return inLength
    },
    async handleBeforeUpload(file) {
      let types = ['jpg', 'jpeg', 'png']
      let size = file.size / 1024 / 1024 <= 5
      if (types.indexOf(file.type.split('/')[1]) == -1) {
        this.$message.warning(this.$t('tips.format'))
        return false
      }
      if (!size) {
        this.$message.warning(this.$t('tips.max', { size: 5 }))
        return false
      }
      if (!this.checkFileLength(file.name)) return
      // 获取图片上传地址
      let res = await getUploadUrl({})
      if (res.resultCode === 0) {
        this.uploadUrl = res.uploadUrl
      }
    },
    //图片上传成功
    handleAvatarSuccess(res, file) {
      if (res.resultCode === 0) {
        this.queryForm.image.fileId = res.fileId
        this.imageUrl = URL.createObjectURL(file.raw)
        this.queryForm.image.url = this.imageUrl
        this.$refs.upload.clearFiles()
      }
    },
    handleSearch() {
      this.listQuery.pageNum = 1
      this.total = 0
      this.searchPictureKey = ''
      this.handleGetList()
    },
    handleReset() {
      if (this.activeName == 'image') {
        this.searchType = 0
      } else if (this.activeName == 'condition') {
        this.searchType = 1
      }
      // 人体检索
      else {
        this.searchType = 2
      }
      this.$refs.upload.clearFiles()
      this.searchPictureKey = ''
      this.queryForm = {
        /***********公共参数 */
        image: {},
        type: 1, //摄像机
        threshold: 90, //相似度
        picValue: 90, //图片质量 舍弃
        beginTime: Dayjs().format('YYYY-MM-DD 00:00:00'),
        // beginTime: Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs().format('YYYY-MM-DD HH:mm:ss'),
        cameraList: [],
        /***********人脸 */
        age: -1,
        gender: -1,
        eyeGlass: -1,
        hat: -1,
        mask: -1,
        /*************人体参数 */
        upperColor: -1, //上身颜色
        upperStyle: -1, //上身颜色
        lowerColor: -1, //下身颜色
        // lowerStyle: -1, //下身款式
      }
      this.imageUrl = ''
      this.timeType = 3
      this.handleChangeQuickDateTime()
      this.choseDeviceList = []
      this.placeholder = this.$t('public.selectCamera')
      this.listQuery.pageNum = 1
      this.tableData = []
      this.total = 0
      // this.handleGetList()
    },
    handleGetList() {
      if (!this.queryForm.beginTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (!this.queryForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (new Date(this.queryForm.endTime).getTime() > new Date().getTime()) {
        this.$message.warning(this.$t('public.endGtCur'))
        return
      }
      if (new Date(this.queryForm.beginTime).getTime() > new Date(this.queryForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      if (DateDiff(this.queryForm.beginTime, this.queryForm.endTime) > 6) {
        this.$message.warning(this.$t('public.gt7'))
        return
      }
      if (this.queryForm.type == 2) {
        this.queryForm.cameraList = this.choseDeviceList.map((item) => item.id)
        if (!this.queryForm.cameraList.length) {
          this.$message.warning(`${this.$t('public.please')}${this.$t('public.camera')}`)
          return
        }
      } else {
        this.queryForm.cameraList = []
      }
      if (this.activeName == 'image' && !this.queryForm.image.url) {
        this.$message.warning(this.$t('public.pleaseUpload'))
        return
      }
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNum,
          pageSize: this.listQuery.pageSize,
        },
        beginTime: this.queryForm.beginTime,
        endTime: this.queryForm.endTime,
        cameraList: this.queryForm.cameraList,
        // picValue: this.queryForm.picValue,
      }
      if (this.total) params.pageInfo.totalNum = this.total
      if (this.activeName == 'image') {
        params.image = this.queryForm.image
        params.threshold = this.queryForm.threshold
        params.searchPictureKey = this.searchPictureKey
        const loading = this.$loading({
          lock: true,
          text: this.$t('public.loading'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        Object.keys(params).map((key) => {
          if (params[key] == '') {
            delete params[key]
          }
        })
        facesearchByImage(params)
          .then((res) => {
            loading.close()
            if (res.resultCode == 0) {
              if (res.resultList && res.resultList.length) {
                this.total = res.pageInfo.totalNum
                this.tableData = res.resultList
                if (res.searchPictureKey) {
                  this.searchPictureKey = res.searchPictureKey
                }
              } else {
                this.$message.warning(this.$t('public.noData'))
                this.total = 0
                this.tableData = []
                this.searchPictureKey = ''
              }
            }
          })
          .catch(() => {
            loading.close()
          })
      } // 条件检索
      else if (this.activeName == 'condition') {
        params.age = this.queryForm.age
        params.gender = this.queryForm.gender
        params.eyeGlass = this.queryForm.eyeGlass
        params.hat = this.queryForm.hat
        params.mouthMask = this.queryForm.mask
        const loading = this.$loading({
          lock: true,
          text: this.$t('public.loading'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        facesearchByCondition(params)
          .then((res) => {
            loading.close()
            if (res.resultCode == 0) {
              if (res.resultList && res.resultList.length) {
                this.total = res.pageInfo.totalNum
                this.tableData = res.resultList
              } else {
                this.$message.warning(this.$t('public.noData'))
                this.total = 0
                this.tableData = []
              }
            }
          })
          .catch(() => {
            loading.close()
          })
      }
      // 人体检索
      else {
        params.upperColor = [this.queryForm.upperColor]
        if (this.queryForm.upperColor == 0) {
          params.upperColor = [0, 2, 3]
        }
        params.upperStyle = this.queryForm.upperStyle
        params.lowerColor = [this.queryForm.lowerColor]
        if (this.queryForm.lowerColor == 0) {
          params.upperColor = [0, 2, 3]
        }
        // params.lowerStyle = this.queryForm.lowerStyle
        const loading = this.$loading({
          lock: true,
          text: this.$t('public.loading'),
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
        bodysearchByCondition(params)
          .then((res) => {
            loading.close()
            if (res.resultCode == 0) {
              if (res.resultList && res.resultList.length) {
                this.total = res.pageInfo.totalNum
                this.tableData = res.resultList
              } else {
                this.$message.warning(this.$t('public.noData'))
                this.total = 0
                this.tableData = []
              }
            }
          })
          .catch(() => {
            loading.close()
          })
      }
    },
    handleCloseChoseCamera(cameraNum, cameraList) {
      // console.log(cameraNum, cameraList)
      this.cameraNum = cameraNum
      this.placeholder = this.$t('public.placeholder', { num: cameraNum })
      this.choseDeviceList = cameraList
      if (!this.choseDeviceList.length) {
        this.placeholder = this.$t('public.selectCamera')
      }
      this.choseCameraDialog = false
    },
    //点击弹窗摄像机列表
    handleClickCamera() {
      this.choseCameraDialog = true
    },
    // 时间按钮发生变化时
    handleChangeQuickDateTime() {
      let s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
      let e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      // 如果是近三天
      if (this.timeType == 1) {
        s = Dayjs().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // 如果是近七天
      else if (this.timeType == 2) {
        s = Dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      // 如果是今日
      else if (this.timeType == 3) {
        s = Dayjs().format('YYYY-MM-DD 00:00:00')
        e = Dayjs().format('YYYY-MM-DD HH:mm:ss')
      } else {
        s = ''
        e = ''
      }
      this.queryForm.beginTime = s
      this.queryForm.endTime = e
      this.$forceUpdate()
    },
    handlePageChange(pageNo) {
      this.listQuery.pageNum = pageNo
      this.handleGetList()
    },
    handleSizeChange(size) {
      this.listQuery.pageNum = 1
      this.listQuery.pageSize = size
      this.handleGetList()
    },
  },
}
</script>

<style scoped lang="scss">
.detail-position {
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  z-index: 1111;
}
.person-application {
  width: 1780px;
  height: calc(100% - 120px);
  margin: 20px auto 0;
  color: #fff;
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 190px;
  }
  ::v-deep.el-tabs {
    .el-tabs__item {
      color: #fff;
      font-size: 16px;
      font-weight: bold;
      &.is-active {
        color: #409eff;
      }
    }
    .el-tabs__nav-wrap {
      &::after {
        height: 1px;
      }
    }
  }
  .card-wrapper {
    height: calc(100% - 80px);
    .item-wrapper {
      position: relative;
      color: #fff;
      background-color: #204b74;
      border-radius: 4px;
      padding: 10px;
      box-sizing: border-box;
      font-size: 14px;
      .check {
        position: absolute;
        right: 20px;
        top: 15px;
      }
      .img-wrapper {
        position: relative;
        width: 100%;
        height: 180px;
        img {
          width: 100%;
          height: 100%;
        }
        .img {
          position: absolute;
          left: 0;
          top: 0;
          object-fit: contain;
        }
        .img-bg {
          filter: blur(20px);
        }
      }
      .captureInfo {
        margin-top: 15px;
        .item {
          display: flex;
          overflow: hidden;
          margin-bottom: 10px;
          .label {
            &:after {
              content: ':';
            }
          }
          .value {
            margin-left: 5px;
          }
        }
        .address-confidence {
          display: flex;
          justify-content: space-between;
          line-height: 30px;
          .track {
            padding: 4px;
            box-sizing: border-box;
            cursor: pointer;
            img {
              width: 14px;
              height: 14px;
            }
          }
          .confidence {
            white-space: nowrap;
            color: #00ccff;
          }
          .address {
            overflow: hidden;
            white-space: nowrap;
            /*文字超出宽度则显示ellipsis省略号*/
            text-overflow: ellipsis;
            padding-right: 15px;
          }
        }
        .captureTime {
          height: 20px;
        }
      }
    }
  }
  .filter-wrapper {
    display: flex;
    //justify-content: space-between;
    position: relative;
    .custom-el-form {
      display: flex;
      .part-l {
        margin-right: 20px;
      }
    }
    .btn-search {
      position: absolute;
      right: 10px;
      top: 50px;
    }
    .avatar-uploader {
      width: 100px;
      height: 90px;
      position: relative;
      .avatar-img {
        width: 100%;
        height: 100%;
      }
      .avatar-uploader-icon {
        width: 100%;
        height: auto;
        line-height: 1;
      }
      .tips-wrapper {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
      }
      .tips {
        color: #ccc;
        font-size: 12px;
      }
    }
  }

  .custom-slider {
    width: 300px;
  }
  .custom-select-mini {
    width: 110px;
  }
  .custom-select {
    width: 170px;
  }
  .camera-resource {
    display: flex;
    .camera-radio {
      flex: 1;
      white-space: nowrap;
    }
    .camera {
      flex: 1;
      width: 100%;
    }
    .tree-img {
      width: 18px;
      height: 18px;
      position: absolute;
      right: 5px;
      top: 6px;
    }
  }
}
</style>
