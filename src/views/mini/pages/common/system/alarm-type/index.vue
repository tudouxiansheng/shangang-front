<template>
  <!-- 告警类型管理 -->
  <div id="alarm-type" v-if="isRouterAlive" ref="systemAlarmType">
    <el-row>
      <el-col :span="24" class="el-row20" :style="{ minHeight: th + 'px' }">
        <div class="btnMargin" v-if="PermissionManage">
          <el-button type="primary" @click="handleAdd">
            {{ $t('alarmTypeManage.addAlertType') }}
          </el-button>
          <el-button type="primary" :icon="ElIconCheck" :disabled="startBtn" @click="handelStart">
            {{ $t('public.batchEnable') }}
          </el-button>
          <el-button type="primary" :icon="ElIconClose" :disabled="stopBtn" @click="handelStop">
            {{ $t('public.batchDeactivation') }}
          </el-button>
        </div>

        <!-- 查询和其他操作 -->
        <div class="filter-container search-form">
          <el-form
              :inline="true"
              class="demo-form-inline"
              ref="form"
              :model="searchForm"
              label-position="left"
              style="position: relative"
              :label-width="locale == 'en' ? '196px' : '84px'"
          >
            <div class="flexstart">
              <el-form-item
                  :label="$t('alarmTypeManage.alarmClassification') + ' ：'"
                  class="flex-item"
              >
                <el-select
                    clearable
                    :popper-append-to-body="false"
                    v-model="searchForm.alarmGroup"
                    :placeholder="$t('alarmTypeManage.selectAnAlarmCategory')"
                >
                  <el-option
                      v-for="(item, index) in alarmGroupTypeArray"
                      :key="index"
                      :label="locale == 'en' ? item.groupEnName : item.groupName"
                      :value="item.groupCode"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                  :label="$t('public.alarmLevel') + ' ：'"
                  prop="alarmLevel"
                  class="flex-item"
              >
                <el-select
                    :popper-append-to-body="false"
                    v-model="searchForm.alarmLevel"
                    :placeholder="$t('public.alarmLevelPrompt')"
                >
                  <el-option :label="$t('public.all')" value=""></el-option>
                  <el-option
                      v-for="item in alarmLevelList"
                      :key="item.alarmLevelId"
                      :label="locale == 'en' ? item.alarmLevelEnName : item.alarmLevelName"
                      :value="item.alarmLevelId"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item
                  :label="$t('alarmTypeManage.whetherToEnable') + ' ：'"
                  prop="enable"
                  class="flex-item"
              >
                <el-select
                    :popper-append-to-body="false"
                    v-model="searchForm.enable"
                    :placeholder="$t('alarmTypeManage.selectWhetherToEnable')"
                >
                  <el-option :label="$t('public.all')" value="" />
                  <el-option
                    v-for="item in enableList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>

            <div class="search-btn">
              <el-button type="primary" @click="handleFind" class="miniBtn">
                {{ $t('public.search') }}
              </el-button>
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
            ref="multipleTable"
            :data="tableData"
            max-height="613"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            class="elTable"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <el-table-column
              :label="$t('alarmTypeManage.alarmTypeName')"
              min-width="120"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.alarmName }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarmTypeManage.alarmClassification')"
              min-width="100"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ setGroup(row.alarmGroup) }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.alarmLevel')" min-width="80" show-overflow-tooltip>
              <template #default="{ row }">
                <span :style="'color:' + setstatus(row.alarmLevel).color">
                  {{ setstatus(row.alarmLevel).value }}
                </span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('alarmTypeManage.whetherToEnable')"
              show-overflow-tooltip
              min-width="80"
            >
              <template #default="{ row }">
                <span :class="row.enable == 1 ? 'success' : 'danger'">
                  {{ row.enable == 1 ? $t('alarmTypeManage.yes') : $t('alarmTypeManage.no') }}
                </span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.createTime')" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('public.updateTime')" min-width="100" show-overflow-tooltip>
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>

            <el-table-column :label="$t('public.operating')" min-width="100">
              <template #default="{ row }">
                <span class="cell-operate" @click="handleInfo(row)" v-if="PermissionInfo">
                  {{ $t('public.particulars') }}
                </span>
                <span class="cell-operate" @click="handleEdit(row)" v-if="PermissionManage">
                  {{ $t('public.modify') }}
                </span>
                <span
                  :class="row.enable == '0' ? 'blue' : 'danger'"
                  style="margin-right: 7px; cursor: pointer"
                  @click="handleUsing(row)"
                  v-if="PermissionManage"
                >
                  {{ row.enable == '0' ? $t('public.enable') : $t('public.deactivate') }}
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

    <alarm-type-detail></alarm-type-detail>
    <alarm-type-add></alarm-type-add>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import { Check as ElIconCheck, Close as ElIconClose } from '@element-plus/icons-vue'
import alarmTypeDetail from './component/alarmTypeDetail'

import { permissions } from '@/utils/common/permissions'

import alarmTypeAdd from './component/alarmTypeAdd'

export default {
  data() {
    return {
      isRouterAlive: true,
      alarmTypeDetailVisible: false,
      //用户权限判断
      PermissionInfo: true,
      PermissionManage: true,
      locale: localStorage.getItem('locale'),
      th: window.innerHeight - 70,
      // 告警类型组
      alarmGroupTypeArray: [],
      // 条件搜索
      searchForm: {
        alarmGroup: '',
        alarmLevel: '',
        enable: ''
      },
      //批量启用
      startBtn: true,
      //批量停用
      stopBtn: true,
      //表格选中状态存放数组
      multipleSelection: [],
      // 表格数据
      tableData: [],
      loading: true,
      dataText: '',
      pageNum: 1,
      pageSize: 10,
      // 总数量
      totalNum: 0,
      number: 0,
      //每页显示数量,
      numberList: [10, 20, 30, 40, 50, 100, 500],
      // true:新增, false:编辑
      operation: false,
      // 添加或者编辑
      dialogFormVisible: false,
      enableList: [
        {
          label: this.$t('public.enable'),
          value: 1
        },
        {
          label: this.$t('public.deactivate'),
          value: 0
        }
      ],
      // 添加修改框表单
      dataForm: {
        alarmName: '', //告警类型名称
        alarmEnName: '', //告警类型英文名称
        alarmGroup: '', //告警类型英文名称
        alarmType: '', //告警分类
        alarmLevel: '', //告警级别
        canQuery: 1, //是否可查询
        canLinkage: 1, //是否可联动
        enable: 1 //是否启用
      },
      //告警级别列表
      alarmLevelList: [],
      maskloading: false,
      ElIconCheck,
      ElIconClose
    }
  },
  name: 'AlarmTypeManagement',
  components: {
    alarmTypeDetail,
    alarmTypeAdd
  },
  created() {
    this.getPermissions()
  },
  mounted() {
    this.getAlarmTypeList()
    this.getGroups()
  },
  activated() {
    
  },
  methods: {
    //用户权限判断
    async getPermissions() {
      this.PermissionInfo = await permissions(85)
      this.PermissionManage = await permissions(86)
    },
    getGroups() {
      this.$api.getGroupsQuery({}).then(res => {
        this.alarmGroupTypeArray = res.alarmGroups
      })
      // 请求
      let data = {
        pageInfo: {
          pageNum: 1,
          pageSize: 100
        }
      }
      this.$api.listAlarmLevelByPage(data).then(res => {
        if (res.alarmLevelList) {
          this.alarmLevelList = res.alarmLevelList
        }
      })
    },
    getAlarmTypeList() {
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        searchInfo: {
          alarmGroup: this.searchForm.alarmGroup,
          alarmLevel: this.searchForm.alarmLevel,
          enable: this.searchForm.enable
        }
      }
      this.dataText = ''
      this.loading = true
      this.$api.getAlarmTypes(obj).then(res => {
        if (res.alarmTypeList && res.alarmTypeList.length) {
          this.tableData = res.alarmTypeList
          this.totalNum = res.pageInfo.totalNum
        } else {
          this.tableData = []
          this.totalNum = 0
          this.dataText = this.$t('public.noData')
        }
        this.loading = false
      })
    },
    setGroup(val) {
      if (val == 1) {
        return this.$t('alarmTypeManage.statusAlarm')
      } else if (val == 2) {
        return this.$t('alarmTypeManage.intelligentAlarm')
      } else if (val == 3) {
        return this.$t('alarmTypeManage.FrontDevServiceAlarm')
      } else if (val == 4) {
        return this.$t('alarmTypeManage.FrontEquipmentAlarm')
      } else if (val == 5) {
        return this.$t('alarmTypeManage.videoQualityAlarm')
      } else {
        return ''
      }
    },
    setstatus(val) {
      let data = { value: '', color: '' }
      this.alarmLevelList.forEach(element => {
        if (val == element.alarmLevelId) {
          data.value = this.locale == 'en' ? element.alarmLevelEnName : element.alarmLevelName
          data.color = element.color
        }
      })
      return data
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    // 分页每页条数
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getAlarmTypeList()
    },
    // 分页
    handleCurrentChange(val) {
      this.pageNum = val
      this.getAlarmTypeList()
    },

    // 添加告警类型
    handleAdd() {
      this.dataForm = {
        alarmName: '', //告警类型名称
        alarmEnName: '', //告警类型英文名称
        alarmGroup: '', //告警类型英文名称
        alarmType: '', //告警分类
        alarmLevel: this.alarmLevelList.length ? this.alarmLevelList[0].alarmLevelId : '', //告警级别
        canQuery: 1, //是否可查询
        canLinkage: 1, //是否可联动
        enable: 1 //是否启用
      }
      this.operation = true
      this.dialogFormVisible = true
    },

    // 批量启用
    handelStart() {
      this.startOrStop(1, this.$t('public.batchEnableSuccess'))
    },

    // 批量停用
    handelStop() {
      this.startOrStop(0, this.$t('public.batchDeactivationSuccess'))
    },
    startOrStop(enable, title) {
      this.loading = true
      let item = this.multipleSelection
      this.multipleSelection.forEach((item, index) => {
        let obj = {
          alarmCode: item.alarmType,
          enable
        }
        this.$api.enableAlarmType(obj).then(res => {
          if (res.resultCode == 0 && index == this.multipleSelection.length - 1) {
            this.$message({
              type: 'success',
              message: title
            })
            this.getAlarmTypeList()
            this.loading = false
          }
        })
      })
    },

    // 表格列表选中
    handleSelectionChange(val) {
      this.multipleSelection = val

      // 判断选中的数据中status是否都为true,用于批量启用，批量停用
      let b = val.every(item => {
        return item.enable == true
      })
      let c = val.every(item => {
        return item.enable == false
      })

      // 如果数据不为空 状态都为true，可以批量启用，批量组织变更
      if (val.length != 0 && b == true) {
        this.startBtn = true
        this.stopBtn = false
      }

      // 如果数据不为空 状态都为false，可以批量停用，批量组织变更
      else if (val.length != 0 && c == true) {
        this.startBtn = false
        this.stopBtn = true
      }
      // 如果数据为空，都禁用状态
      else {
        this.startBtn = true
        this.stopBtn = true
      }
    },

    // 搜索
    handleFind() {
      this.pageNum = 1
      this.getAlarmTypeList()
    },

    // 详情
    handleInfo(row) {
      this.getAlarmTypeInfo(row.alarmType, 0)
    },
    // 编辑
    handleEdit(row) {
      this.getAlarmTypeInfo(row.alarmType, 1)
    },
    async getAlarmTypeInfo(alarmTypeCode, flag) {
      let res = await this.$api.getAlarmType({ alarmTypeCode })
      if (res.resultCode != 0) return
      this.dataForm = res.alarmTypeInfo
      if (flag) {
        this.operation = false
        this.dialogFormVisible = true
      } else {
        this.alarmTypeDetailVisible = true
      }
    },
    // 是否启用
    handleUsing(row) {
      let enable = 0
      enable = row.enable ? 0 : 1
      let ifUseObj = {
        alarmCode: row.alarmType,
        enable
      }
      this.$api.enableAlarmType(ifUseObj).then(res => {
        if (res.resultCode == 0) {
          row.enable = enable
          this.$refs.multipleTable.clearSelection()
          this.$message({
            message: this.$t('public.operatingSuccessContent'),
            type: 'success'
          })
        }
      })
    }
  },
  watch: {
    '$i18n.locale': function () {
      this.locale = localStorage.getItem('locale')
    }
  }
}
</script>

<style lang="scss">
#alarm-type {
  height: 100%;

  .filter-container {
    position: relative;
    margin: 20px 0 10px;
    text-align: right;
    .miniBtn{
      margin-left:10px;
    }
  }

  .flex-item {
    width: 30%;
  }
  .search-btn {
    position: absolute;
    right: 0;
    bottom: 41px;
  }
}
</style>
