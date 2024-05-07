<template>
  <!-- 算法模型管理 -->
  <div id="modelManage" v-if="isRouterAlive" ref="modelManage">
    <el-row>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="el-row20">
        <div style="position: relative; min-height: 38px" class="btnMargin">
          <div>
            <el-button type="primary" @click="handleAdd" v-if="PermissionManage">
              {{ $t('algoModel.add') }}
            </el-button>
          </div>
          <!-- 查询和其他操作 -->
          <div class="filter-container" style="position: absolute; top: 0px; right: -8px">
            <el-form
              :inline="true"
              class="demo-form-inline"
              label-width="100px"
              ref="form"
              :model="searchForm"
              label-position="left"
              style="display: flex; flex-direction: row"
            >
              <el-form-item prop="adminLName">
                <el-input
                  v-model="searchForm.modelName"
                  auto-complete="off"
                  :placeholder="$t('algoModel.inputSearchModelName')"
                  clearable
                  class="inputMiddle"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleFind" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div
          style="height: 600px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <div v-if="!loading && !tableData.length" class="tableNOdata">
            <img src="@/assets/img/common/NOdata.png" alt />
            <p>{{ $t('public.noData') }}</p>
          </div>
          <!-- 表格 -->
          <el-table
            v-if="!loading && tableData.length"
            :max-height="tableHeight"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>

            <el-table-column :label="$t('algoModel.algoModelName')" min-width="90">
              <template #default="{ row }">
                <span>{{ row.modelName }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoModel.algoType')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ setAlgoType(row.algorithmType) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoModel.mark')" min-width="90" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.algorithmKey }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('algoModel.modelType')"
              min-width="90"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setAlgorithmModel(row.modelType) }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('algoModel.alarmType')" min-width="90">
              <template #default="{ row }">
                <span>
                  {{ row.algorithmType === 'OTHER' && row.modelType === 2 ? row.alarmName : 'NA' }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="120">
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.updateTime')" min-width="120">
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="120">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleEdit(row)">
                  {{ $t('public.modify') }}
                </span>
                <span class="cell-operate danger" @click="handleDelete(row)">
                  {{ $t('public.delete') }}
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

    <!-- 添加或修改对话框 -->
    <add-info v-model:visible="dialogFormVisible"></add-info>
    <model-detail v-model:visible="modelDetailVisible"></model-detail>

    <device-tools
      :dialogDeviceVisible="dialogDeviceVisible"
      @getChooseCameras="getCameras"
      :currentChooseCameras="currentChooseCameras"
      :title="$t('algoModel.selectCamera')"
      type="2"
      :ifShowModelDevCancel="true"
      v-if="showTools"
    ></device-tools>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { defineAsyncComponent } from 'vue'

import DeviceTools from '@/components/device-tools'
import addInfo from './component/addInfo'
import modelDetail from './component/modelDetail'

export default {
  name: 'AlgorithmModelManagement',
  components: {
    'add-info': addInfo,
    'model-detail': modelDetail,
    DeviceTools
  },
  data() {
    return {
      tableHeight: 616,
      isRouterAlive: true,
      maskloading: false, // 点击提交按钮后蒙版
      PermissionInfo: true, //用户权限判断
      PermissionManage: true, //用户权限判断

      // 条件搜索
      searchForm: {
        modelName: ''
      },

      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,

      operation: true, // true:添加, false:修改
      dialogFormVisible: false, // 添加或者修改
      // 添加修改框表单
      dataForm: {
        modelName: '',
        algorithmKey: '',
        algorithmType: '',
        modelType: '',
        alarmType: ''
      },

      //新增算法仓
      modelDetailVisible: false, //详情
      tableData_property: [], //结构化属性表格数据
      modelId: '',
      alarmTypeList: [],

      dialogDeviceVisible: false,
      choosedCameras: '',
      camerasArray: [],
      currentChooseCameras: [],
      showTools: true,
      locale: localStorage.getItem('locale')
    }
  },
  computed: {
    ...mapState({
      algorithmTypeList: state => state.dict['algorithm-type'] // 算法类型
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    }
  },
  async mounted() {
    await this.getDictionary()
    await this.getGroups()
    await this.getAlgorithmModelList()
  },
  activated() {
    this.setDialogCss()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    getDictionary() {
      this.getSysDictData(['algorithm-type'])
    },

    // 获取告警类型
    async getGroups() {
      await this.$api.getGroupsQuery({}).then(res => {
        if (res.alarmGroups) {
          let options = []
          for (let i = 0; i < res.alarmGroups.length; i++) {
            let groupobj = {}
            groupobj.value = res.alarmGroups[i].groupCode
            groupobj.label =
              this.locale == 'en' ? res.alarmGroups[i].groupEnName : res.alarmGroups[i].groupName
            options.push(groupobj)
          }
          for (let i = 0; i < options.length; i++) {
            options[i].children = []
            let searchTypeObj = {
              alarmGroup: options[i].value
            }

            this.$api.getAlarmTypesQuery(searchTypeObj).then(res1 => {
              if (res1.alarmTypeList) {
                for (let j = 0; j < res1.alarmTypeList.length; j++) {
                  let childrenObj = {}
                  childrenObj.value = res1.alarmTypeList[j].alarmType
                  childrenObj.label = res1.alarmTypeList[j].alarmName
                  options[i].children.push(childrenObj)
                }
              }
            })
          }

          this.alarmTypeList = options
        } else {
          this.alarmTypeList = []
        }
      })
    },
    // 模型类型
    setAlgorithmModel(val) {
      if (val == 1) {
        return this.$t('algoModel.structedData')
      } else if (val == 2) {
        return this.$t('algoModel.alarm')
      } else {
        return ''
      }
    },

    // 算法类型
    setAlgoType(val) {
      if (val) {
        this.algorithmTypeList.map(item => {
          if (val == item.value) {
            val = item.name
          }
        })
      } else {
        val = ''
      }
      return val
    },
    // 告警类型
    setAlarmType(val) {
      if (val) {
        this.alarmTypeList.map(item => {
          if (item.children) {
            item.children.map(item1 => {
              if (val == item1.value) {
                val = item1.label
              }
            })
          }
        })
      } else {
        val = ''
      }
      return val
    },
    setDataType(val) {
      if (val == 'enum') {
        return this.$t('algoModel.enum')
      } else if (val == 'bool') {
        return this.$t('algoModel.boolean')
      } else if (val == 'text') {
        return this.$t('algoModel.text')
      } else {
        return val
      }
    },
    setDataType1(val) {
      if (val == 'enum') {
        return this.$t('algoModel.enumValue') + '：'
      } else if (val == 'bool') {
        return this.$t('algoModel.bool') + '：'
      } else if (val == 'text') {
        return this.$t('algoModel.dataLength') + '：'
      } else {
        return val
      }
    },
    //获取算法模型列表
    getAlgorithmModelList() {
      this.dataText = ''
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        modelName: this.searchForm.modelName
      }

      this.$api.getAlgorithmModelList(obj).then(res => {
        if (res && res.algorithmModelList && res.algorithmModelList.length) {
          this.tableData = res.algorithmModelList

          this.totalNum = res.pageInfo.totalNum
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

    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 添加
    async handleAdd() {
      this.dataForm = {
        modelName: '',
        algorithmKey: '',
        algorithmType: '',
        modelType: '',
        alarmType: ''
      }
      this.tableData_property = []
      this.operation = true
      this.dialogFormVisible = true
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getAlgorithmModelList()
    },

    //获取模型详情
    async getModelInfo(flag, modelId) {
      this.modelId = modelId

      let res = await this.$api.getAlgorithmModel({ modelId })
      if (res.resultCode != 0) return

      this.dataForm = {
        modelName: res.modelName,
        algorithmKey: res.algorithmKey,
        algorithmType: res.algorithmType,
        modelType: res.modelType,
        alarmType: res.alarmType
      }

      this.tableData_property = res.properties

      if (flag) {
        this.dataForm.alarmType = this.getAlarmType(res.alarmType)
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.modelDetailVisible = true
      }
    },
    // 告警类型处理
    getAlarmType(val) {
      let arr = []
      this.alarmTypeList.map(item => {
        if (item.children) {
          item.children.map(item1 => {
            if (val == item1.value) {
              arr = [item.value, item1.value]
            }
          })
        }
      })
      return arr
    },
    //详情
    async handleInfo(row) {
      await this.getModelInfo(0, row.modelId)
    },
    // 修改
    async handleEdit(row) {
      await this.getModelInfo(1, row.modelId)
    },

    getCameras(cameras) {
      let currentCameras = []
      this.choosedCameras = ''
      this.camerasArray = []
      for (let i = 0; i < cameras.length; i++) {
        currentCameras.push(cameras[i].label)
        if (cameras[i].payload) {
          this.camerasArray.push(cameras[i].payload.thirdId)
        } else {
          this.camerasArray.push(cameras[i].id)
        }
      }
      this.currentChooseCameras = JSON.parse(JSON.stringify(cameras))
      this.choosedCameras = currentCameras.join(',')
    },
    handleApply() {
      this.choosedCameras = ''
      this.currentChooseCameras = []
      this.camerasArray = []
      this.showTools = false
      this.$nextTick(() => {
        this.showTools = true
      })

      this.dialogDeviceVisible = true
    },

    // 删除
    handleDelete(row) {
      this.$confirm(this.$t('algoModel.ifDelModel'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(() => {
          this.$api.deleteAlgorithmModel({ modelId: row.modelId }).then(res => {
            if (res.resultCode === 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.delSuccess')
              })
              this.getAlgorithmModelList()
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

    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getAlgorithmModelList()
    },

    // 分页输入跳转页数
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAlgorithmModelList()
    }
  }
}
</script>
