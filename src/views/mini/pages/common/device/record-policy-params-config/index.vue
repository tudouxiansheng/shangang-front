<template>
  <div id="recordPolicyParamsConfig" v-if="isRouterAlive" ref="recordPolicyParamsConfig">
    <el-page-header v-if="cuType !== '1'" @back="goBack" :content="mainDevName"></el-page-header>
    <div :class="['center_container', cuType === '1' && 'full_height']">
      <div class="center_container_topBox">
        <div class="topBox_left">
          <div class="topBox_left_title"><svg-icon icon-class="storageNodeInformation" />存储节点信息</div>
          <table>
            <tbody>
              <tr>
                <td>所在存储域：</td>
                <td></td>
                <td>节点IP：</td>
                <td></td>
              </tr>
              <tr>
                <td>节点名称：</td>
                <td></td>
                <td>集群编码：</td>
                <td></td>
              </tr>
              <tr>
                <td>存储介质类型：</td>
                <td></td>
                <td>节点状态：</td>
                <td></td>
              </tr>
              <tr>
                <td>存储路径：</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="topBox_middle">
          <div class="topBox_left_title"><svg-icon icon-class="storageSpaceStatistics" />存储空间统计</div>
          <div class="topBox_middle_echarts">
            <div class="echarts_left">
<!--              <el-progress class="echarts_left_progress" type="circle" :percentage="20" stroke-linecap="butt">-->
<!--                <template #default>-->
<!--                  <div class="percentageBox">-->
<!--                    <div class="percentage-value">2000G</div>-->
<!--                    <div class="percentage-label">总空间</div>-->
<!--                  </div>-->
<!--                </template>-->
<!--              </el-progress>-->
              <div class="echarts_left_progress">
                <div class="echarts_left_progress-box">
                  <svg class="progress-circle1" viewBox="0 0 100 100" style="--percent: 70">
                    <!-- 辅助圆环 -->
                    <circle stroke="var(--inactive-color)" style="stroke-dasharray: calc(2 * 3.1415 * (var(--size) - var(--border-width)) / 2 * ((99 - var(--percent)) / 100)), 1000"/>
                  </svg>
                  <svg class="progress-circle2" viewBox="0 0 100 100" style="--percent: 70">
                    <!-- 进度圆环 -->
                    <circle stroke="var(--color)" style="stroke-dasharray: calc(2 * 3.1415 * (var(--size) - var(--border-width)) / 2 * (var(--percent) / 100)), 1000"/>
                  </svg>
                </div>
              </div>
              <div class="percentageBox">
                <div class="percentage-value">2000G</div>
                <div class="percentage-label">总空间</div>
              </div>
            </div>
            <div class="echarts_right">
              <div class="echarts_right_available">
                <span class="echarts_right_available_icon">可用空间</span> <span>1970G</span> <span>70%</span>
              </div>
              <div class="echarts_right_used">
                <span class="echarts_right_used_icon">可用空间</span> <span>1970G</span> <span>70%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="topBox_right">
          <div class="topBox_left_title"><svg-icon icon-class="changesStorageSpace" />未来15天内存储空间变化</div>
          <div class="topBox_middle_echarts">
            <div id="topBox_middle_echarts_barChart" style="height: 100%; width: 100%;"></div>
          </div>
        </div>
      </div>
      <div class="center_container_botton">
        <div class="center_container_botton_title"><svg-icon icon-class="storeInformationIcon" /> <span>存储节点信息</span> <el-icon class="iStyle"><el-icon-warning-outline /></el-icon> <span class="iStyle">该存储节点已负载40路录像存储</span></div>
        <div class="center_container_botton_content">
          <!-- 查询和其他操作 -->
          <div class="content_tableBox">
            <el-form
              :inline="true"
              ref="form"
              :model="searchForm"
              label-position="left"
              style="position: relative"
              :label-width="locale == 'en' ? '180px' : '84px'"
            >
              <div>
                <el-form-item label="设备名称：" class="flex-item">
                  <el-input placeholder="Please input" />
                </el-form-item>
                <el-form-item label="设备ID：" auto-complete="off" lass="flex-item">
                  <el-input placeholder="Please input" />
                </el-form-item>
              </div>

              <div class="search-btn">
                <el-button type="primary" @click="handleQuery" class="miniBtn">
                  {{ $t('public.search') }}
                </el-button>
                <el-button @click="handleReset" class="miniBtn">
                  {{ $t('public.reset') }}
                </el-button>
              </div>
            </el-form>

            <div v-loading="loading" :element-loading-text="$t('public.loading')">
              <div v-if="!loading && !tableData.length" class="tableNOdata">
                <img src="@/assets/img/common/NOdata.png" alt />
                <p>{{ $t('public.noData') }}</p>
              </div>

              <el-table
                v-if="!loading && tableData.length"
                ref="multipleTable"
                :data="tableData"
                :row-class-name="tableRowClassName"
                class="elTable"
                border
              >
                <el-table-column label="序号" width="50"></el-table-column>
                <el-table-column label="设备ID" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="摄像机名称" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="存储留存期" min-width="100" show-overflow-tooltip></el-table-column>
                <el-table-column label="存储码流" show-overflow-tooltip min-width="80"></el-table-column>
                <el-table-column label="已占用空间" min-width="100" show-overflow-tooltip></el-table-column>
              </el-table>

              <!--分页-->
              <pagination
                v-if="!loading && tableData.length"
                :total="totalNum"
                v-model:pageNum="pageNum"
                v-model:limit="pageSize"
                @pagination="getListByPage"
              ></pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import SvgIcon from "@components/svg-icon/index.vue"
import { Warning as ElIconWarningOutline } from '@element-plus/icons-vue'
import pagination from "@components/pagination.vue"
import * as echarts from 'echarts'
import useChart from "@/hooks/useChart"
export default {
  name: 'VideoRecordPolicyParamsConfig',
  components: {
    pagination,
    SvgIcon,
    ElIconWarningOutline
  },
  data() {
    return {
      isRouterAlive: true,
      cuType: sessionStorage.getItem('cuType'),
      locale: localStorage.getItem('locale'),
      // 条件搜索
      searchForm: {
        systemType: '',
        tenantName: '',
        status: ''
      },
      // 表格数据
      tableData: [],
      loading: false,
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
    }
  },
  async mounted () {
    this.getBarChart()
  },
  watch: {
    '$i18n.locale'() {
      this.locale = localStorage.getItem('locale')
    },
  },
  computed: {
    ...mapState({
      mainDevId: state => state.deviceConfig.mainDevId
    }),
    ...mapGetters('deviceConfig', ['mainDevName'])
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    //图表配置即展示
    getBarChart() {
      const{ getBarChart } = useChart()
      getBarChart('topBox_middle_echarts_barChart', {
        title: {
          subtext: '磁盘空间/G',
          right: 20,
          subtextStyle: {
            color: '#ffffff',
            fontSize: 12,
          }
        },
        grid: {
          // top: '10%',
          left: '5%',
          right: '5%',
          bottom: '5%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          axisLine: {
            lineStyle: {
              color: '#25435C'
            }
          },
          axisLabel: {
            color: '#FFFFFF'
          }
        },
        yAxis: {
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#25435C'
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            color: '#FFFFFF'
          },
        },
        tooltip: {
          show: true, // 是否显示提示框组件
          trigger: 'axis', // 触发类型，一般可设置为 'axis' 表示坐标轴触发
          axisPointer: { // 坐标轴指示器配置项
            type: 'line' // 坐标轴指示器的类型
          },
        },
        series: [
          {
            data: ['820', '932', '14030', '934', '1290', '1330', '1320'],
            type: 'line',
            smooth: true,
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: '#FFD511'
                },
                {
                  offset: 1,
                  color: 'rgba(255,213,17,0.1)'
                }
              ])
            },
            markPoint: {
              silent: false,
              symbolSize: [190, 57],
              symbolOffset: [0, -32],
              emphasis: {
                scale: false
              },
              label: {
                width: 160,
                height: 57,
                align: 'left',
                fontSize: 12,
                offset: [-80, 0],
                formatter: function (params) {
                  let str = `${params.data.xAxis}\n`
                  str += `${params.data.value}`
                  return str
                },
                overflow: 'breakAll',
              },
              itemStyle: {
                color: 'rgba(173,198,255,0.5)',
              },
              data: [
                {
                  name: '周最低',
                  value: '已用100000GB，剩余7854564GB',
                  xAxis: 'Wed',
                  yAxis: '14030',
                  symbol: 'path://M140 7.54715C140 3.379 136.418 0 132 0H8C3.5817 0 0 3.379 0 7.54715V42.4529C0 46.621 3.5817 50 8 50H65.0004L70 56.9995L74.9996 50H132C136.418 50 140 46.621 140 42.4529V7.54715Z',
                }
              ],
            },
            itemStyle: {
              opacity: 1,
              color: '#FFD511',
              borderWidth: 10,
              borderColor: '#FFD511',
              shadowColor: '#FFD511',
              shadowBlur: 20
            },
            emphasis: {
              scale: 1.5,
              itemStyle: {
                opacity: 1,
                borderWidth: 10,
                borderColor: '#FFD511',
                shadowColor: '#FFD511',
                shadowBlur: 20
              },
            },
            lineStyle: {
              color: '#FFD511'
            },
          }
        ]
      })
    },
    // 搜索
    handleQuery() {
      this.pageNum = 1
    },
    //重置
    handleReset() {
      this.searchForm = {
        systemType: '',
        platType: '',
        status: ''
      }
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      if (rowIndex % 2 == 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    // 分页
    getListByPage() {
    },
  }
}
</script>
<style lang="scss">
#recordPolicyParamsConfig {
  box-sizing: border-box;
  padding: 20px 20px 0;
  height: 100%;
  .center_container {
    width: 100%;
    height: calc(100% - 42px);
    box-sizing: border-box;
    padding: 5px 20px;
    position: relative;
    margin-top: 10px;
    &.full_height {
      height: 100%;
    }
    display: flex;
    flex-direction: column;
    &_topBox {
      width: 100%;
      height: 300px;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      grid-template-rows: 1fr;
      grid-column-gap: 20px;
      grid-row-gap: 0;
      margin-bottom: 20px;
      .topBox_left,
      .topBox_middle,
      .topBox_right {
        .svg-icon {
          width: 20px;
          height: 18px;
          margin-right: 10px;
        }
        &_title {
          font-size: 16px;
          height: 60px;
          line-height: 60px;
        }
        background-color: #052132;
        padding: 0 20px;
      }
      .topBox_left {
        table {
          width: 100%; /* 表格宽度为父容器的100% */
          height: calc(100% - 70px);
          table-layout: fixed; /* 固定表格布局 */
          background: #0E2638;
          td {
            padding: 0 10px;
            border: 1px solid #20405D; /* 为表格添加边框 */
            width: 25%; /* 每列宽度为表格宽度的四分之一 */
          }
        }
      }
      .topBox_middle {
        position: relative;
        .topBox_middle_echarts {
          width: 100%;
          height: calc(100% - 70px);
          display: flex;
          align-items: center;
          justify-content: space-around;
          .el-progress__text {
            height: 100%;
          }
          .echarts_left {
            position: relative;
            width: 182px;
            height: 182px;
            flex-shrink: 0;
            .percentageBox {
              width: 100%;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              background: url('~@/assets/img/common/progressBg.png') no-repeat 50% 50%;
              position: relative;
              &:after {
                position: absolute;
                content: '';
                width: 100%;
                height: 100%;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                border: 5px solid rgba(0, 0, 0, .3);
                border-radius: 50%;
              }
              .percentage-value {
                font-size: 28px;
                font-weight: bold;
                color: #fff;
                margin-bottom: 10px;
              }
              .percentage-label {
                font-size: 14px;
                font-weight: 500;
                color: #fff;
              }
            }
            .echarts_left_progress {
              position: absolute;
              --percent: 70; /* 百分数 */
              --size: 100px; /* 尺寸大小 */
              --border-width: 5px; /* 环形宽度（粗细） */
              --color: #00A2FF; /* 主色 */
              --inactive-color: #00EAFF; /* 辅助色 */
              width: 182px;
              height: 182px;
              border-radius: 50%;
              .el-progress-circle {
                width: var(--size) !important;
                height: var(--size) !important;
              }
              .echarts_left_progress-box {
                position: relative;
                .progress-circle1 {
                  position: absolute;
                  transform: rotate(-271.5deg) rotateY(180deg);
                }
                .progress-circle2 {
                  position: absolute;
                  transform: rotate(-90deg);
                }
              }
              circle {
                cx: calc(var(--size) / 2);
                cy: calc(var(--size) / 2);
                r: calc((var(--size) - var(--border-width)) / 2);
                fill: none;
                stroke-width: var(--border-width);
                transition: stroke-dasharray 0.4s linear, stroke .3s;
              }
            }
          }
          .echarts_right {
            margin-left: 20px;
            &_available {
              margin-bottom: 30px;
            }
            &_available,
            &_used {
              position: relative;
              &_icon {
                &:before {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: -16px;
                  transform: translate(0, -50%);
                  display: block;
                  width: 10px;
                  height: 10px;
                  border: 1px solid #00AAFF;
                  box-sizing: border-box;
                }
                &:after {
                  content: '';
                  position: absolute;
                  top: 50%;
                  left: -14px;
                  transform: translate(0, -50%);
                  display: block;
                  width: 6px;
                  height: 6px;
                  background-color: #00AAFF;
                }
              }
            }
            &_used {
              &_icon {
                &:before {
                  border: 1px solid #00EAFF !important;
                }
              }
            }
          }
        }
        .topBox_middle_echarts1 {
          position: absolute !important;
          top: 60px;
        }
      }
      .topBox_right {
        .topBox_middle_echarts {
          width: 100%;
          height: calc(100% - 70px);
        }
      }
    }
    &_botton {
      .svg-icon {
        width: 20px;
        height: 18px;
        margin-right: 10px;
      }
      &_title {
        font-size: 16px;
        height: 60px;
        line-height: 60px;
        display: flex;
        align-items: center;
        span {
          margin-right: 10px;
        }
        .iStyle {
          color: #2A7AC4;
          margin-right: 10px;
          font-size: 14px;
        }
      }
      &_content {
        height: calc(100% - 70px);
        .content_tableBox {
          position: relative;
          .search-btn {
            position: absolute;
            right: 0;
            top: 0;
          }
          .tableNOdata {
            img {
              margin-top: 60px;
            }
          }
        }
      }
      width: 100%;
      flex: 1;
      background-color: #052132;
      padding: 0 20px;
    }
  }
}
</style>
