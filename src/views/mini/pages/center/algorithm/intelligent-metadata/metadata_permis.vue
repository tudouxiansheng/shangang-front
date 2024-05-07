<template>
  <!-- 智能元数据 -->
  <div id="newMetadata" v-if="isRouterAlive" ref="newAlgorithmMetadata">
    <el-row>
      <el-col :span="6" style="padding-left: 29px" class="colLeft">
        <div class="search-form">
          <div style="margin-bottom: 20px">
            <el-button type="primary" @click="handleFind" class="miniBtn">
              {{ $t('public.search') }}
            </el-button>
            <el-button type="primary" @click="resetForm" class="miniBtn">
              {{ $t('public.reset') }}
            </el-button>
          </div>
          <el-form
            :inline="true"
            ref="form"
            :model="searchForm"
            :rules="valueRules"
            :label-width="'160px'"
            class="demo-form-inline"
            label-position="left"
          >
            <div class="flexstart">
              <el-form-item :label="$t('metadata.sourceType') + ' ：'">
                <el-select v-model="searchForm.sourceType" clearable>
                  <el-option
                    v-for="(item, index) in sourceTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div v-if="searchForm.sourceType == 1" class="flexstart newCameras">
              <el-form-item :label="$t('metadata.sourceName') + ' ：'">
                <el-input
                  ref="newCameras"
                  @focus="openDialog"
                  v-model="searchForm.cameraName"
                  :placeholder="$t('alarmList.selectACamera')"
                ></el-input>
                <img src="@/assets/img/common/add.png" class="addIcon" @click="openDialog" />
              </el-form-item>
            </div>
            <div v-if="searchForm.sourceType == 2" class="flexstart newCameras">
              <el-form-item :label="$t('metadata.sourceName') + ' ：'">
                <el-input
                  ref="taskName"
                  @focus="openDialogTask"
                  v-model="searchForm.taskName"
                  :placeholder="$t('metadata.selectTask1')"
                ></el-input>
                <img src="@/assets/img/common/add.png" class="addIcon" @click="openDialogTask" />
              </el-form-item>
            </div>

            <div class="flexstart">
              <el-form-item :label="$t('deviceManagement.searchType') + ' ：'">
                <el-checkbox-group v-model="searchForm.dataTypes" @change="typeChange">
                  <el-checkbox
                    v-for="(item, index) in dataTypeList"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.name }}
                  </el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </div>

            <div class="flexstart">
              <el-form-item :label="$t('metadata.snapTime') + ' ：'">
                <el-date-picker
                  style="width: 330px !important"
                  v-model="dateVal"
                  type="datetimerange"
                  :range-separator="$t('public.to')"
                  :start-placeholder="$t('public.startTimePrompt')"
                  :end-placeholder="$t('public.endTimePrompt')"
                  @change="changeDate"
                ></el-date-picker>
              </el-form-item>
            </div>

            <div
              @click="manyCondition"
              class="manyCondition"
              style="margin-left: 0px; margin-bottom: 8px"
            >
              <span>{{ $t('public.manyCondition') }}</span>
              <span :class="iconName"></span>
            </div>

            <div class="modelListDiv" v-show="showManyCondition">
              <div class="flexstart">
                <el-form-item
                  :label="$t('metadata.model') + ' ：'"
                  v-if="searchForm.sourceType == 1"
                >
                  <el-select v-model="searchForm.model" clearable filterable @change="changeModel">
                    <el-option
                      v-for="(item, index) in modelListFilter"
                      :key="index"
                      :label="item.modelName"
                      :value="item.modelId"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  :label="$t('metadata.algoType') + ' ：'"
                  v-if="searchForm.sourceType == 2"
                >
                  <el-select
                    v-model="searchForm.algorithmId"
                    clearable
                    filterable
                    @change="changeAlgo"
                  >
                    <el-option
                      v-for="(item, index) in algorithmListFilter"
                      :key="index"
                      :label="item.algorithmName"
                      :value="item.algorithmId"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div v-if="searchForm.model || searchForm.algorithmId" class="modelUL">
                <span
                  style="color: #f56c6c; margin-bottom: 10px; display: block"
                  v-if="searchForm.sourceType"
                >
                  * {{ $t('metadata.searchTip') }}
                </span>
                <div v-for="(item, index) in searchForm.properties" :key="index">
                  <el-form-item
                    :rules="valueRules.value"
                    :label="item.name + ' ：'"
                    :prop="`properties.${index}.value`"
                  >
                    <el-select
                      v-if="item.type == 'bool' || item.type == 'enum'"
                      v-model="properData[index].value"
                      :multiple="item.type == 'enum'"
                      :collapse-tags="item.type == 'enum'"
                    >
                      <el-option
                        v-for="(item1, index1) in item.specs"
                        :key="index1"
                        :label="item1.name"
                        :value="item1.value"
                      ></el-option>
                    </el-select>
                    <el-input v-else v-model="properData[index].value"></el-input>

                    <el-tooltip
                      effect="light"
                      :content="item.description"
                      placement="top-start"
                      v-if="item.description"
                    >
                      <el-icon class="descriptionIcon"><el-icon-question /></el-icon>
                    </el-tooltip>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </el-col>
      <el-col :span="18" style="padding: 0px 29px; margin-top: 20px">
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
                  :key="item.metadataId"
                  :src="item.detectImagePath"
                  lazy
                ></el-image>
              </div>

              <div class="content">
                <div class="content-item" v-if="item.deviceName">
                  <span class="content-item-left" :title="$t('metadata.camera') + ':'">
                    {{ $t('metadata.camera') }}：
                  </span>
                  <span class="content-item-right" :title="item.deviceName">
                    {{ item.deviceName }}
                  </span>
                </div>
                <div class="content-item" v-if="item.taskName">
                  <span class="content-item-left" :title="$t('metadata.task') + ':'">
                    {{ $t('metadata.task') }}：
                  </span>
                  <span class="content-item-right" :title="item.taskName">{{ item.taskName }}</span>
                </div>
                <div class="content-item">
                  <span class="content-item-left" :title="$t('metadata.snapTime') + ':'">
                    {{ $t('metadata.snapTime') }}：
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
            @pagination="getMetadataList"
          ></pagination>
        </div>
      </el-col>
    </el-row>

    <camera-selector
      v-if="showComponent"
      :title="$t('metadata.selectCamara')"
      v-model:visible="dialogDeviceVisible"
      @confirm="getCameras"
    />

    <metadata-detail v-model:visible="detailDialogVisible" />
    <metadata-task-choose
      @getChoosedTask="getChoosedTask"
      v-if="showComponent"
    ></metadata-task-choose>
  </div>
</template>

<script>
import { QuestionFilled as ElIconQuestion } from '@element-plus/icons-vue'
import { getFormatDate } from '@/utils/common/mutil'

import CameraSelector from '@components/cameraSelector'
import metadataDetail from './component/metadata-detail'
import metadataTaskChoose from './component/metadata-task-choose'

export default {
  components: {
    CameraSelector,
    'metadata-detail': metadataDetail,
    'metadata-task-choose': metadataTaskChoose,
    ElIconQuestion
  },
  name: 'MetadataView',
  data() {
    return {
      isRouterAlive: true,

      //用户权限判断
      PermissionManage: true,

      parentPage: 'metadata',

      userType: '2',
      dialogDeviceVisible: false,
      metadataTaskVisible: false,

      searchForm: {
        sourceType: '',
        taskName: '',
        cameraName: '',
        taskId: '',
        deviceIds: [],
        dataTypes: [null],
        captureStartTime: '',
        captureEndTime: '',
        model: '',
        algorithmId: '',

        properties: []
      },
      algorithmTypeList: [],
      vehicleTypeList: [],
      taskList: [],
      dateVal: '',

      loading: false,
      tableData: [],
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0,
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      detailDialogVisible: false,
      dataForm: {
        detectImagePath: ''
      },

      showComponent: true,
      modelList: [],
      showManyCondition: false, // 高级搜索点击显示与隐藏
      iconName: 'el-icon-arrow-down', // iconClass 高级搜索的字体图标
      properData: [],

      valueRules: {},

      algorithmList: [],

      pageType: 'metadata', //元数据弹框页面的有些选项的显隐判断
      locale: localStorage.getItem('locale'),
      searchType: [1, 3, 99],
      dataTypeMap: {
        1: 'FACE_RECOGNIZE',
        3: 'VEHICLE_RECOGNIZE',
        99: 'OTHER'
      }
    }
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.setFormRules()
      this.locale = localStorage.getItem('locale')
    }
  },
  computed: {
    dataTypeList() {
      return [
        {
          name: this.$t('metadata.unlimited'),
          value: null
        },
        {
          name: this.$t('metadata.face'),
          value: 1
        },
        {
          name: this.$t('metadata.vehicle'),
          value: 3
        },
        {
          name: this.$t('metadata.other'),
          value: 99
        }
      ]
    },
    selCodeList() {
      return this.searchType.map(item => this.dataTypeMap[item])
    },
    modelListFilter() {
      return this.modelList.filter(item => this.selCodeList.indexOf(item.algorithmType) !== -1)
    },
    algorithmListFilter() {
      return this.algorithmList.filter(item => this.selCodeList.indexOf(item.algorithmType) !== -1)
    },
    sourceTypeList() {
      return [
        {
          name: this.$t('metadata.camera'),
          value: 1
        },
        {
          name: this.$t('metadata.task'),
          value: 2
        }
      ]
    }
  },
  async created() {
    this.getPermissions()
  },
  async mounted() {
    await this.setFormRules()
    await this.getModelList() // 获取模型列表
    await this.getAlgorithmList() // 获取模型列表
    await this.getMetadataList() // 获取元数据列表
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.userType = this.$route.query.userType
    },

    setFormRules() {
      var regIntNum_feifu = /^(0|[1-9]\d*)$/ //非负整数
      var regIntNum_zhengshu = /^-?\d+$/ //整数
      var regFloat = /^-?(0|[1-9]\d*)(\.\d*[1-9])?$/ //单精度
      var regDouble = /^([+-]?)\d*\.\d+$/ //双精度

      var validateValue = (rule, value, callback) => {
        let index = Number(rule.field.substring(11, rule.field.lastIndexOf('.')))
        // return;
        if (this.properData[index].value === '') {
          callback()
        } else if (
          this.searchForm.properties[index].type == 'text' ||
          this.searchForm.properties[index].type == 'bool' ||
          this.searchForm.properties[index].type == 'enum'
        ) {
          callback()
        } else if (this.searchForm.properties[index].type == 'int') {
          if (
            !regIntNum_feifu.test(this.properData[index].value) &&
            Number(this.properData[index].value)
          ) {
            callback(new Error(this.$t('metadata.nonnegativeInt')))
          } else if (
            regIntNum_feifu.test(this.properData[index].value) &&
            Number(this.properData[index].value)
          ) {
            callback()
          } else {
            try {
              if (
                !JSON.parse(this.properData[index].value) ||
                !JSON.parse(this.properData[index].value).join(',') ||
                !JSON.parse(this.properData[index].value).length ||
                JSON.parse(this.properData[index].value).length < 2
              ) {
                callback(new Error(this.$t('metadata.arrNonnegativeInt')))
              } else {
                for (let i = 0; i < JSON.parse(this.properData[index].value).length; i++) {
                  if (!regIntNum_feifu.test(JSON.parse(this.properData[index].value)[i])) {
                    callback(new Error(this.$t('metadata.arrNonnegativeInt')))
                    break
                  }
                }
              }
              callback()
            } catch (error) {
              callback(new Error(this.$t('metadata.arrNonnegativeInt')))
            }
          }
        } else if (this.searchForm.properties[index].type == 'float') {
          if (
            !regFloat.test(this.properData[index].value) &&
            Number(this.properData[index].value)
          ) {
            callback(new Error(this.$t('metadata.float')))
          } else if (
            regFloat.test(this.properData[index].value) &&
            Number(this.properData[index].value)
          ) {
            callback()
          } else {
            try {
              if (
                !JSON.parse(this.properData[index].value) ||
                !JSON.parse(this.properData[index].value).join(',') ||
                !JSON.parse(this.properData[index].value).length ||
                JSON.parse(this.properData[index].value).length < 2
              ) {
                callback(new Error(this.$t('metadata.arrFloat')))
              } else {
                for (let i = 0; i < JSON.parse(this.properData[index].value).length; i++) {
                  if (!regFloat.test(JSON.parse(this.properData[index].value)[i])) {
                    callback(new Error(this.$t('metadata.arrFloat')))
                    break
                  }
                }
              }
              callback()
            } catch (error) {
              callback(new Error(this.$t('metadata.arrFloat')))
            }
          }
        } else if (this.searchForm.properties[index].type == 'double') {
          if (
            !regDouble.test(this.properData[index].value) &&
            Number(this.properData[index].value)
          ) {
            callback(new Error(this.$t('metadata.double')))
          } else if (
            regDouble.test(this.properData[index].value) &&
            Number(this.properData[index].value)
          ) {
            callback()
          } else {
            try {
              if (
                !JSON.parse(this.properData[index].value) ||
                !JSON.parse(this.properData[index].value).join(',') ||
                !JSON.parse(this.properData[index].value).length ||
                JSON.parse(this.properData[index].value).length < 2
              ) {
                callback(new Error(this.$t('metadata.arrDouble')))
              } else {
                for (let i = 0; i < JSON.parse(this.properData[index].value).length; i++) {
                  if (!regDouble.test(JSON.parse(this.properData[index].value)[i])) {
                    callback(new Error(this.$t('metadata.arrDouble')))
                    break
                  }
                }
              }
              callback()
            } catch (error) {
              callback(new Error(this.$t('metadata.arrDouble')))
            }
          }
        }
      }
      this.valueRules = {
        value: [{ required: false, validator: validateValue, trigger: 'change' }]
      }
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
    //获取模型列表
    async getModelList() {
      this.$api
        .getAlgorithmModelList({
          pageInfo: { pageNum: 1, pageSize: this.$maxPageSize }
        })
        .then(res => {
          this.modelList = res.algorithmModelList || []
        })
    },

    // 智能分析任务
    getTaskList() {
      this.$api.getNewTaskList({ pageInfo: { pageNum: 1 }, taskOwner: 0 }).then(res => {
        this.taskList = res.taskList
      })
    },

    //获取算法列表
    async getAlgorithmList() {
      let res = await this.$api.queryNewAlgorithmList({
        pageInfo: { pageNum: 1, pageSize: this.$maxPageSize },
        netType: this.$getNetType()
      })
      this.algorithmList = res.algorithmList || []
    },

    changeModel(val) {
      if (val) {
        this.$api.getAlgorithmModel({ modelId: val }).then(res => {
          if (res.resultCode == 0) {
            this.searchForm.properties = res.properties
            let arr = []
            for (let i = 0; i < res.properties.length; i++) {
              arr.push({
                property: res.properties[i].key,
                value: ''
              })
            }
            this.properData = arr
          }
        })
      }
    },

    changeAlgo(val) {
      if (val) {
        let modelId = ''
        for (let i = 0; i < this.algorithmList.length; i++) {
          if (this.algorithmList[i].algorithmId == val) {
            modelId = this.algorithmList[i].modelId
            break
          }
        }
        this.$api.getAlgorithmModel({ modelId: modelId }).then(res => {
          if (res.resultCode == 0) {
            this.searchForm.properties = res.properties
            let arr = []
            for (let i = 0; i < res.properties.length; i++) {
              arr.push({
                property: res.properties[i].key,
                value: ''
              })
            }
            this.properData = arr
          }
        })
      }
    },

    // 点击更多条件控制更多条件的显示与隐藏！
    manyCondition() {
      this.showManyCondition = !this.showManyCondition
      this.iconName = this.showManyCondition ? 'el-icon-arrow-up' : 'el-icon-arrow-down'
      this.tableHeight = this.showManyCondition ? 534 : 616
    },

    // 获取元数据列表
    getMetadataList() {
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        sourceType: 2,
        dataTypes: this.searchType,
        captureStartTime: this.searchForm.captureStartTime,
        captureEndTime: this.searchForm.captureEndTime,
        netType: this.$getNetType()
      }
      if (this.searchForm.sourceType == 1) {
        obj.deviceIds = this.searchForm.deviceIds
        obj.modelId = this.searchForm.model
      } else if (this.searchForm.sourceType == 2) {
        obj.taskId = this.searchForm.taskId
        obj.algorithmId = this.searchForm.algorithmId
      }

      let modelProperties = []

      for (let i = 0; i < this.properData.length; i++) {
        if (this.properData[i].value !== '' && this.properData[i].value.length != 0) {
          let item = JSON.parse(JSON.stringify(this.properData[i]))
          if (Array.isArray(this.properData[i].value)) {
            item.value = item.value.join(',')
          }
          modelProperties.push(item)
        }
      }
      obj.modelProperties = modelProperties || null

      this.$api.searchMetadataList(obj).then(res => {
        if (res.resultCode == 0) {
          this.tableData = res.metadataList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.totalNum = 0
        }
        this.loading = false
      })
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
          currentCameras.push(cameras[i].name)
          camerasArray.push(cameras[i].id)
        }
        this.searchForm.cameraName = currentCameras.join(',')
        this.searchForm.deviceIds = camerasArray
      } else {
        this.searchForm.cameraName = ''
        this.searchForm.deviceIds = []
      }
    },

    getChoosedTask(val) {
      if (val) {
        this.searchForm.taskName = val.taskName
        this.searchForm.taskId = val.taskId
      }
    },

    openDialog() {
      this.dialogDeviceVisible = true
      this.$refs.newCameras.blur()
    },
    openDialogTask() {
      this.metadataTaskVisible = true
      this.$refs.taskName.blur()
    },

    // 检索类型实现单选
    typeChange(val) {
      if (val.indexOf(null) != -1 && val.length == 1) {
        this.searchType = [1, 3, 99]
      } else if (
        val.indexOf(null) != -1 &&
        val.length != 1 &&
        val.indexOf(null) != val.length - 1
      ) {
        this.searchForm.dataTypes.splice(this.searchForm.dataTypes.indexOf(null), 1)
        this.searchType = this.searchForm.dataTypes
      } else if (
        val.indexOf(null) != -1 &&
        val.length != 1 &&
        val.indexOf(null) == val.length - 1
      ) {
        this.searchForm.dataTypes = [null]
        this.searchType = [1, 3, 99]
      } else {
        this.searchType = this.searchForm.dataTypes
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

    // 查询
    handleFind() {
      this.pageNum = 1

      let s1 = new Date(this.searchForm.captureStartTime).getTime()
      let s2 = new Date(this.searchForm.captureEndTime).getTime()
      let total = (s2 - s1) / 1000
      let plusDay = parseInt(total / (24 * 60))
      if (plusDay > 29 * 60) {
        this.$message({
          message: this.$t('metadata.timeSelect30'),
          type: 'warning',
          duration: '1000'
        })
        return
      } else if (plusDay < 0) {
        this.$message({
          message: this.$t('metadata.timeSelectAgain'),
          type: 'warning',
          duration: '1000'
        })
        return
      } else {
        this.$refs['form'].validate(valid => {
          if (valid) {
            this.getMetadataList()
          }
        })
      }
    },
    // 重置表单
    resetForm() {
      this.searchForm = {
        sourceType: '',
        cameraName: '',
        deviceIds: [],
        taskId: '',
        taskName: '',
        dataTypes: [null],
        captureStartTime: '',
        captureEndTime: '',
        model: '',
        algorithmId: '',

        properties: []
      }
      this.dateVal = ''
      this.properData = []
      this.showComponent = false
      this.$nextTick(() => {
        this.showComponent = true
      })
    },

    // 查看大图详情
    async openBigImg(row) {
      let res = await this.$api.getMetadataInfo({
        metadataId: row.metadataId,
        sourceType: 2,
        netType: this.$getNetType()
      })
      if (res.resultCode != 0) return
      this.dataForm = res
      this.detailDialogVisible = true
    },

    //页数切换
    numberChange(val) {
      this.pageSize = this.numberList[val]

      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getMetadataList()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getMetadataList()
    }
  }
}
</script>

<style lang="scss">
#newMetadata {
  width: 100%;
  height: 100%;
  margin-top: 50px;

  .search-form {
    .el-form-item {
      margin-bottom: 18px !important;
    }
  }

  .colLeft {
    .el-input__inner {
      width: 200px !important;
    }
  }

  .newCameras {
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

  .search-btn {
    position: absolute;
    right: 0px;
    bottom: 41px;
  }

  .modelUL {
    overflow-y: auto;
    height: 331px;
    .el-form-item {
      display: flex;
      .el-form-item__content {
        display: flex;
        align-items: center;
      }
      .descriptionIcon {
        font-size: 20px;
        margin-left: 3px;
        cursor: pointer;
      }
    }
  }

  .table-list {
    width: 100%;
    max-height: 680px;
    position: relative;
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

  .modelListDiv {
    .el-form-item__error {
      left: -160px;
    }
  }
}
</style>
