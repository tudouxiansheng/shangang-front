<template>
  <!-- 录像 -->
  <div
    id="recordReport"
    v-if="isRouterAlive"
    ref="recordReport"
    v-loading="pageloading"
    :element-loading-text="$t('public.batchImporting')"
    
  >
    <el-row>
      <el-col :span="4" class="el-row4">
        <el-scrollbar style="border-radius: 6px">
          <div id="orgTree">
            <el-tree
              ref="treeList"
              node-key="id"
              :props="organizationTreeProps"
              :load="loadNode"
              lazy
              v-loading="treeLoading"
              :default-expanded-keys="defaultKeys1"
              :current-node-key="currentDefaultKey"
              :empty-text="treeEmptyText"
              :highlight-current="true"
              :expand-on-click-node="false"
              @node-click="handleNodeClick"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i :class="iconSty(data)" class="iconCss aci"></i>
                  <span>{{ node.label }}</span>
                </span>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </el-col>

      <el-col :span="20" class="el-row20">
        <div class="btnMargin">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="form"
            :model="searchForm"
            label-position="left"
            :label-width="locale == 'en' ? '154px' : '96px'"
          >
            <el-form-item :label="$t('recordReport.operationDate') + ':'" prop="operationDate">
              <el-date-picker
                :shortcuts="pickerOptions && pickerOptions.shortcuts"
                :disabled-date="pickerOptions && pickerOptions.disabledDate"
                :cell-class-name="pickerOptions && pickerOptions.cellClassName"
                v-model="time"
                type="datetimerange"
                :range-separator="$t('public.to')"
                :start-placeholder="$t('public.startTime')"
                :end-placeholder="$t('public.endTime')"
                @change="pickerChange"
              ></el-date-picker>
            </el-form-item>
          </el-form>

          <div>
            <el-button type="primary" class="miniBtn" @click="handleFind">
              {{ $t('recordReport.search') }}
            </el-button>
            <el-button type="info" class="miniBtn" @click="initTime">
              {{ $t('public.reset') }}
            </el-button>
          </div>
        </div>
        <div class="chartBox">
          <div id="pieChart"></div>
          <div class="rightInfo">
            <div class="infoTitle">{{ $t('recordReport.deviceInfo') }}</div>
            <div class="moreInfoBox">
              <ul>
                <li class="liItem" style="width: 54%">
                  <span class="blueSpan">{{ $t('recordReport.cameraName') }}:</span>
                  <span v-if="cameraInfo.cameraBaseInfo">
                    {{ cameraInfo.cameraBaseInfo.cameraName }}
                  </span>
                </li>
                <li class="liItem">
                  <span class="blueSpan">{{ $t('recordReport.ptzType') }}:</span>
                  <span v-if="cameraInfo.cameraBaseInfo">
                    {{ setPtzType(cameraInfo.cameraBaseInfo.ptzType) }}
                  </span>
                </li>
                <li class="liItem" style="width: 54%">
                  <span class="blueSpan">{{ $t('recordReport.cameraId') }}:</span>
                  <span v-if="cameraInfo.cameraBaseInfo">
                    {{ cameraInfo.cameraBaseInfo.cameraId }}
                  </span>
                </li>
                <li class="liItem">
                  <span class="blueSpan">{{ $t('recordReport.networkType') }}:</span>
                  <span v-if="cameraInfo.cameraMaintainInfo">
                    {{ setNetworkType(cameraInfo.cameraMaintainInfo.networkType) }}
                  </span>
                </li>
                <li class="liItem" style="width: 54%">
                  <span class="blueSpan">{{ $t('recordReport.puIp') }}:</span>
                  <span v-if="cameraInfo.thirdAccessInfo">
                    {{ cameraInfo.thirdAccessInfo.puIp }}
                  </span>
                </li>
                <li class="liItem">
                  <span class="blueSpan">{{ $t('recordReport.recordRemainDays') }}:</span>
                  <span v-if="cameraInfo.cameraRecordInfo">
                    {{ cameraInfo.cameraRecordInfo.recordRemainDays }}
                  </span>
                </li>
                <li class="liItem" style="width: 54%">
                  <span class="blueSpan">{{ $t('recordReport.recordPolicyName') }}:</span>
                  <span v-if="cameraInfo.cameraRecordInfo">
                    {{ cameraInfo.cameraRecordInfo.recordPolicyName }}
                  </span>
                </li>
                <li class="liItem">
                  <span class="blueSpan">{{ $t('recordReport.manufacturer') }}:</span>
                  <span v-if="cameraInfo.cameraBaseInfo">
                    {{ setManufacturerData(cameraInfo.cameraBaseInfo.manufacturer) }}
                  </span>
                </li>
                <li class="liItem" style="width: 54%">
                  <span class="blueSpan">{{ $t('recordReport.status') }}:</span>
                  <span v-if="cameraInfo.cameraMaintainInfo">
                    {{ setStatus(cameraInfo.cameraMaintainInfo.status) }}
                  </span>
                </li>
                <li class="liItem">
                  <span class="blueSpan">{{ $t('recordReport.updateTime') }}:</span>
                  <span v-if="cameraInfo.updateTime">
                    {{ cameraInfo.updateTime }}
                  </span>
                </li>
                <li class="liItem" style="width: 54%">
                  <span class="blueSpan">{{ $t('recordReport.locationType') }}:</span>
                  <span v-if="cameraInfo.cameraBaseInfo">
                    {{ setLocationType(cameraInfo.cameraBaseInfo.locationType) }}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div
          style="height: 450px"
          v-loading="loading"
          :element-loading-text="$t('public.loading')"
          
        >
          <el-table
            v-if="!loading && choosedDeviceID"
            max-height="450"
            ref="multipleTable"
            :data="tableData"
            :row-class-name="tableRowClassName"
            border
            :empty-text="tableEmptyText"
          >
            <template #empty>
              <span style="font-size: 14px">{{ tableEmptyText }}</span>
            </template>
            <el-table-column show-overflow-tooltip :label="$t('recordReport.index')">
              <template #default="{ $index }">
                <span>{{ $index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('recordReport.lostBeginTime')">
              <template #default="{ row }">
                <span>{{ row.lostBeginTime }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('recordReport.lostEndTime')">
              <template #default="{ row }">
                <span>{{ row.lostEndTime }}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip :label="$t('recordReport.lostTime')">
              <template #default="{ row }">
                <span>{{ row.lostTime + $t('recordReport.second') }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { permissions } from '@/utils/common/permissions'
import { getFormatDate } from '@/utils/common/mutil'
import { mapState, mapActions } from 'vuex'
import { onUnmounted } from 'vue'

export default {
  name: 'RecordReport',
  data() {
    return {
      tableEmptyText: this.$t('public.noData'),
      locationTypeData: [],
      statusData: [],

      cameraInfo: {},
      time: '',
      pickerOptions: {
        disabledDate(time) {
          let curDate = new Date().getTime()
          return time.getTime() > curDate
        }
      },
      videoPieList: [
        { value: 0, name: this.$t('recordReport.videoPie0'), percent: '0' },
        { value: 0, name: this.$t('recordReport.videoPie1'), percent: '0' }
      ],
      zoneList: [],
      defaultKeys: [],
      defaultKeys1: [],
      currentDefaultKey: '',
      treeLoading: false,
      // tree配置项
      organizationTreeProps: {
        label: 'label',
        children: [],
        isLeaf: 'leaf'
      },
      treeEmptyText: this.$t('public.noData'),
      choosedDeviceID: '',
      /////
      isRouterAlive: true,
      //用户权限判断
      PermissionManage: true,
      //判断是否有角色权限
      PermissionRoleManage: true,
      PermissionRoleUse: true,
      locale: localStorage.getItem('locale'),

      // 条件搜索
      searchForm: {
        userName: '',
        beginTime: '',
        endTime: ''
      },
      isSearch: false,
      loading: false,
      tableData: [], // 表格数据
      dataText: '',

      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量

      organizationId: null, //默认查询组织为0

      maskloading: false, // 点击提交按钮后蒙版

      pageloading: false // 批量导入
    }
  },

  computed: {
    ...mapState({
      ptzTypeData: state => state.dict['device-type'], // 摄像机类型
      manufacturerData: state => state.dict['camera_manufacturer'], // 设备厂商类型
      networkTypeData: state => state.dict['dev-access-mode'] // 网络类型
    })
  },
  watch: {
    //监听语言切换
    '$i18n.locale': function () {
      this.locale = localStorage.getItem('locale')
    }
  },

  created() {
    this.initTime()
    this.getDiction()
  },
  mounted() {
    this.getPieChart()
  },
  methods: {
    ...mapActions('dict', ['getSysDictData']),
    // 字典查询
    getDiction() {
      this.getSysDictData(['device-type', 'camera_manufacturer', 'dev-access-mode'])
    },

    setStatus(val) {
      let name = ''
      this.statusData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setPtzType(val) {
      let name = ''
      this.ptzTypeData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setNetworkType(val) {
      let name = ''
      this.networkTypeData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setLocationType(val) {
      let name = ''
      this.locationTypeData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    setManufacturerData(val) {
      let name = ''
      this.manufacturerData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    initTime() {
      this.time = [new Date(new Date().getTime() - 24 * 60 * 60 * 1000), new Date()]
      this.searchForm.beginTime = getFormatDate(this.time[0])
      this.searchForm.endTime = getFormatDate(this.time[1])

      this.locationTypeData = [
        {
          value: 1,
          name: this.$t('public.applicationtype1')
        },
        {
          value: 2,
          name: this.$t('public.applicationtype2')
        }
      ]
      this.statusData = [
        {
          value: 0,
          name: this.$t('public.statustype0')
        },
        {
          value: 1,
          name: this.$t('public.statustype1')
        },
        {
          value: 2,
          name: this.$t('public.statustype2')
        },
        {
          value: 3,
          name: this.$t('public.statustype3')
        }
      ]
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        await this.findTreeData('', resolve)
        return resolve(this.zoneList)
      } else {
        await this.findTreeData(node.data.id, resolve)
        resolve(this.zoneList)
      }
    },
    async findTreeData(parentId, resolve) {
      let data = {
        type: 1
      }
      parentId ? (data.parentId = parentId) : null
      await this.$api.getDeviceTree(data).then(res => {
        let nodeList = res.nodeList
        //初始化面包屑
        this.treeLoading = false

        this.zoneList = nodeList
        if (!parentId) {
          this.defaultKeys = [nodeList[0].id]
          this.defaultKeys1 = [nodeList[0].id]
          this.$refs.treeList.setCurrentKey(nodeList[0].id)
          this.currentDefaultKey = nodeList[0].id
          this.organizationId = nodeList[0].payload.organizationId
        } else {
        }
      })
    },

    getPieChart(
      data = [
        { value: 0, name: this.$t('recordReport.videoPie0'), percent: '0' },
        { value: 0, name: this.$t('recordReport.videoPie1'), percent: '0' }
      ]
    ) {
      let pieChart = echarts.init(document.getElementById('pieChart'))
      let resizeFn = () => {
        pieChart.resize()
      }
      window.addEventListener('resize', resizeFn)

      onUnmounted(() => {
        window.removeEventListener('resize', resizeFn)
      })
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      let obj = this
      // 绘制图表
      pieChart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{c}' + this.$t('recordReport.second')
        },
        series: [
          {
            type: 'pie',
            avoidLabelOverlap: false,
            hoverAnimation: true,

            labelLine: {
              show: true
            },
            label: {
              normal: {
                textStyle: {
                  fontSize: 14
                },
                formatter: '{b} {d}%'
              },
              x: 0
            },

            data
          }
        ],
        color: ['#10CAFF', '#678DF2']
      })
      pieChart.on('mouseover', function (params) {
        /*添加鼠标事件*/
        obj.isShow = true
        obj.title = params.name
        obj.percent = params.percent
      })
      pieChart.on('mouseout', function (params) {
        /*添加鼠标事件*/ obj.isShow = false
      })
      this.$nextTick(() => {
        pieChart.resize()
      })
    },
    // 日期改变联动时间类型
    pickerChange() {
      if (this.time) {
        this.searchForm.beginTime = getFormatDate(this.time[0])
        this.searchForm.endTime = getFormatDate(this.time[1])
      } else {
        this.searchForm.beginTime = ''
        this.searchForm.endTime = ''
      }

      this.isSearch = false
    },
    //用户权限判断
    async getPermissions() {
      this.locale = localStorage.getItem('locale')
      this.PermissionManage = await permissions(62)
      //判断是否有角色权限
      this.PermissionRoleManage = await permissions(71)
      this.PermissionRoleUse = await permissions(73)
    },

    handleNodeClick(data, node, self) {
      //点击树联动面包屑
      this.organizationId = data.payload.organizationId
      this.choosedDeviceID = data.payload.deviceId ? data.payload.deviceId : ''

      if (this.choosedDeviceID) {
        if (!this.searchForm.beginTime || !this.searchForm.endTime) {
          this.$message({
            message: this.$t('recordReport.chooseOperationDate'),
            type: 'warning'
          })
          return
        }
        this.loading = true
        this.handleFind()
      } else {
        this.$message({
          message: this.$t('recordReport.chooseCamera'),
          type: 'warning'
        })
      }
    },

    getCamera() {
      this.$api.getCameraInfo({ cameraId: this.choosedDeviceID }).then(res => {
        if (res.resultCode == 0) {
          this.cameraInfo = res
        }
      })
    },

    getLostList() {
      let obj = {
        pageInfo: {
          pageNum: this.pageNum
        },
        cameraList: [
          {
            cameraId: this.choosedDeviceID
          }
        ],
        searchInfo: {
          from: 'DEVICE',
          beginTime: this.searchForm.beginTime,
          endTime: this.searchForm.endTime,
          eventList: [
            {
              event: 'ALL'
            }
          ]
        }
      }
      this.$api.getVideoRecordList(obj).then(res => {
        if (res.recordList) {
          let arr = []
          for (let i = 0; i < res.recordList.length; i++) {
            if (res.recordList[i + 1]) {
              if (
                new Date(res.recordList[i + 1].beginTime) <= new Date(res.recordList[i].endTime)
              ) {
                continue
              } else {
                let obj = {
                  lostTime: '',
                  lostBeginTime: '',
                  lostEndTime: ''
                }
                obj.lostTime =
                  (new Date(res.recordList[i + 1].beginTime).getTime() -
                    new Date(res.recordList[i].endTime).getTime()) /
                  1000
                obj.lostBeginTime = res.recordList[i].endTime
                obj.lostEndTime = res.recordList[i + 1].beginTime

                arr.push(obj)
              }
            }
          }

          if (new Date(res.recordList[0].beginTime) > new Date(this.searchForm.beginTime)) {
            arr.unshift({
              lostTime:
                (new Date(res.recordList[0].beginTime).getTime() -
                  new Date(this.searchForm.beginTime).getTime()) /
                1000,
              lostBeginTime: this.searchForm.beginTime,
              lostEndTime: res.recordList[0].beginTime
            })
          }

          if (
            new Date(this.searchForm.endTime) >
            new Date(res.recordList[res.recordList.length - 1].endTime)
          ) {
            arr.push({
              lostTime:
                (new Date(this.searchForm.endTime).getTime() -
                  new Date(res.recordList[res.recordList.length - 1].endTime).getTime()) /
                1000,
              lostBeginTime: res.recordList[res.recordList.length - 1].endTime,
              lostEndTime: this.searchForm.endTime
            })
          }

          this.tableData = arr

          let lostPieTime = 0
          for (let j = 0; j < this.tableData.length; j++) {
            lostPieTime += this.tableData[j].lostTime
          }

          this.videoPieList[0].value = Number(lostPieTime)

          this.videoPieList[1]['value'] = Number(
            this.time[1].getTime(-this.time[0].getTime()) / 1000 - lostPieTime
          )

          this.videoPieList[0]['percent'] = this.GetPercent(
            lostPieTime,
            this.time[1].getTime(-this.time[0].getTime()) / 1000
          )

          this.videoPieList[1]['percent'] = this.GetPercent(
            this.videoPieList[1].value,
            this.time[1].getTime(-this.time[0].getTime()) / 1000
          )

          this.getPieChart(this.videoPieList)
          this.loading = false
        } else {
          this.tableData = [
            {
              lostBeginTime: this.searchForm.beginTime,
              lostEndTime: this.searchForm.endTime,
              lostTime: (this.time[1].getTime() - this.time[0].getTime()) / 1000
            }
          ]

          this.getPieChart([
            {
              value: (this.time[1].getTime() - this.time[0].getTime()) / 1000,
              name: this.$t('recordReport.videoPie0'),
              percent: '100'
            },
            { value: 0, name: this.$t('recordReport.videoPie1'), percent: '0' }
          ])
          this.tableEmptyText = this.$t('public.noData')
          this.loading = false
        }
      })
    },

    GetPercent(num, total) {
      num = parseFloat(num)
      total = parseFloat(total)
      if (isNaN(num) || isNaN(total)) {
        return '-'
      }
      return total <= 0 ? '0' : String(Math.round((num / total) * 10000) / 100.0)
    },

    // 表格斑马纹!
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },

    search_change() {
      this.isSearch = false
    },
    //判断是否点击搜索
    search_clear() {
      if (!this.isSearch) {
        this.searchForm.userName = ''
      }
    },
    // 搜索!
    handleFind() {
      if (!this.searchForm.beginTime || !this.searchForm.endTime) {
        this.$message({
          message: this.$t('recordReport.chooseOperationDate'),
          type: 'warning'
        })
        return
      }
      if (!this.choosedDeviceID) {
        this.$message({
          message: this.$t('recordReport.chooseCamera'),
          type: 'warning'
        })
        return
      }
      this.pageNum = 1
      this.isSearch = true
      this.getLostList()
      this.getCamera()
    },
    iconSty(node) {
      if (node.type == 1) {
        if (node.payload.type == 1) {
          return 'aci-organization iconCss'
        } else {
          return 'aci-x006-folder iconCss'
        }
      } else {
        if (node.payload.deviceStatus == 1) {
          if (node.payload.deviceType == 1) {
            return 'aci aci-camera-gun iconCss1'
          } else if (node.payload.deviceType == 2) {
            return 'aci aci-camera-ptz iconCss1'
          } else if (node.payload.deviceType == 3) {
            return 'aci aci-camera-ball iconCss1'
          } else if (node.payload.deviceType == 4) {
            return 'aci aci-camera-hemisphere iconCss1'
          }
        } else if (node.payload.deviceStatus == 0 || node.payload.deviceStatus == 2) {
          if (node.payload.deviceType == 1) {
            return 'aci aci-camera-gun iconCss2'
          } else if (node.payload.deviceType == 2) {
            return 'aci aci-camera-ptz iconCss2'
          } else if (node.payload.deviceType == 3) {
            return 'aci aci-camera-ball iconCss2'
          } else if (node.payload.deviceType == 4) {
            return 'aci aci-camera-hemisphere iconCss2'
          }
        }
      }
    }
  }
}
</script>

<style lang="scss">
#recordReport {
  width: 100%;
  height: 100%;
  .btnMargin {
    display: flex;
    min-height: 38px;
    margin-bottom: 0px;
  }

  .chartBox {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  #pieChart {
    width: 600px;
    height: 300px;
  }
  .rightInfo {
    width: 720px;
    background: #043d5e;
    border-radius: 12px;
    padding: 20px 20px;
  }
  .liItem {
    width: 42%;
    float: left;
    font-size: 14px;

    font-weight: 400;
    color: #edf6f7;
    margin-bottom: 26px;
    line-height: 14px;
  }
  .liItem:last-child {
    margin-bottom: 0px;
  }
  .moreInfoBox {
    margin-top: 23px;
  }
  .infoTitle {
    font-size: 16px;

    font-weight: 400;
    color: #e5f2f9;
  }
  .blueSpan {
    font-size: 14px;

    font-weight: 400;
    color: #3ca6ff;
  }
}
</style>
