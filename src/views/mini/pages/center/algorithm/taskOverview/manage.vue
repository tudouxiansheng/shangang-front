<template>
  <div id="taskOverview" v-if="isRouterAlive" ref="taskOverview">
    <el-row>
      <div class="header">
        <div
          class="headerlist"
          style="background-color: #04a1ff; text-align: center; cursor: pointer"
          @click="jumpToTask"
        >
          <img src="@/assets/img/common/addTask.png" class="addIcon" />
          <p class="mt-7">{{ $t('analysisTask.createAnalysisTask') }}</p>
        </div>
        <div
          class="headerlist"
          v-loading="loadingList1"
          :element-loading-text="$t('public.loading')"
          element-loading-background="rgba(5,27,44,0.5)"
        >
          <div class="taskall" v-show="!loadingList1">
            <img src="@/assets/img/common/total.png" />
            <div class="taskword">
              <span>{{ $t('analysisTask.totalTask') }}</span>
              <p>{{ totalTask.total }}</p>
            </div>
          </div>
        </div>
        <div
          class="headerlist"
          v-loading="loadingList1"
          :element-loading-text="$t('public.loading')"
          element-loading-background="rgba(5,27,44,0.5)"
        >
          <div class="taskall" v-show="!loadingList1">
            <img src="@/assets/img/common/now.png" />
            <div class="taskword">
              <span>{{ $t('analysisTask.executing') }}</span>
              <p>{{ totalTask.executing }}</p>
            </div>
          </div>
        </div>
        <div
          class="headerlist"
          v-loading="loadingList1"
          :element-loading-text="$t('public.loading')"
          element-loading-background="rgba(5,27,44,0.5)"
        >
          <div class="taskall" v-show="!loadingList1">
            <img src="@/assets/img/common/end.png" />
            <el-tooltip class="item" effect="dark" placement="right">
              <template #content>
                <div>
                  {{ $t('analysisTask.notSstarted') + ':' + totalTask.notStarted }}
                  <br />
                  {{ $t('analysisTask.stopped') + ':' + totalTask.stopped }}
                  <br />
                  {{ $t('analysisTask.completed') + ':' + totalTask.completed }}
                </div>
              </template>

              <div class="taskword">
                <span>{{ $t('analysisTask.unexecuted') }}</span>
                <p>{{ totalTask.unExecuted }}</p>
              </div>
            </el-tooltip>
          </div>
        </div>
        <div
          class="headerlist"
          v-loading="loadingList1"
          :element-loading-text="$t('public.loading')"
          element-loading-background="rgba(5,27,44,0.5)"
        >
          <div class="taskall" v-show="!loadingList1">
            <img src="@/assets/img/common/failed.png" />
            <div class="taskword">
              <span>{{ $t('analysisTask.failed') }}</span>
              <p>{{ totalTask.failed }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="contentleft">
          <div
            v-loading="loadingList2"
            :element-loading-text="$t('public.loading')"
            element-loading-background="rgba(5,27,44,0.5)"
            style="height: 450px"
          >
            <el-row :gutter="20" v-show="!loadingList2">
              <el-col :span="8" style="display: flex">
                <img src="@/assets/img/common/snap.png" />
                <div class="text">
                  <p class="headertext">
                    {{ $t('analysisTask.captureToday') }}
                  </p>
                  <p class="contenttext">
                    {{
                      metadata.peopleCount +
                      metadata.vehicleCount +
                      metadata.faceCount +
                      metadata.otherCount
                    }}
                  </p>
                </div>
              </el-col>
              <el-col :span="8" style="display: flex">
                <img src="@/assets/img/common/snap.png" />
                <div class="text">
                  <p class="headertext">
                    {{ $t('analysisTask.capturePortraitsToday') }}
                  </p>
                  <p class="contenttext">{{ metadata.faceCount }}</p>
                </div>
              </el-col>
              <el-col :span="8" style="display: flex">
                <img src="@/assets/img/common/snap.png" />
                <div class="text">
                  <p class="headertext">
                    {{ $t('analysisTask.captureVehiclesToday') }}
                  </p>
                  <p class="contenttext">{{ metadata.vehicleCount }}</p>
                </div>
              </el-col>
            </el-row>
            <el-row :gutter="20" style="margin-top: 20px; height: 308px" v-show="!loadingList2">
              <el-col
                v-for="(item, index) in metadata.result"
                :key="index"
                :span="6"
                class="imageback"
              >
                <el-image
                  style="height: 100%; width: 100%"
                  :key="item.captureImagePath"
                  :src="item.previewCaptureImage"
                  lazy
                ></el-image>
                <div class="imagetext">
                  <p
                    class="headertext"
                    :title="$t('primaryDevice.cameraName') + ':' + item.deviceName"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ $t('primaryDevice.cameraName') }}:{{ item.deviceName }}
                  </p>
                  <p
                    class="headertext"
                    :title="item.captureTime"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ item.captureTime }}
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div id="barChart"></div>
        </div>
        <div
          :class="[locale == 'en' ? 'contentright enStyle' : 'contentright']"
          v-loading="loadingList4"
          :element-loading-text="$t('public.loading')"
          element-loading-background="rgba(5,27,44,0.5)"
        >
          <div style="height: 52px">
            <el-row :gutter="20" v-show="!loadingList4">
              <el-col :span="6" style="display: flex">
                <img src="@/assets/img/common/alarm.png" />
                <div class="text">
                  <p
                    class="headertext"
                    :title="$t('analysisTask.taskAlert')"
                    style="
                      width: 100px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    "
                  >
                    {{ $t('analysisTask.taskAlert') }}
                  </p>
                  <p class="contenttext" style="color: #48ece7">
                    {{ urgentCount + importantCount + generalCount }}
                  </p>
                </div>
              </el-col>
              <el-col :span="6" style="display: flex">
                <img src="@/assets/img/common/urgent.png" />
                <div class="text">
                  <p
                    class="headertext"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ $t('public.urgent') }}
                  </p>
                  <p class="contenttext" style="color: #ff625b">
                    {{ urgentCount }}
                  </p>
                </div>
              </el-col>
              <el-col :span="6" style="display: flex">
                <img src="@/assets/img/common/important.png" />
                <div class="text">
                  <p
                    class="headertext"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ $t('public.important') }}
                  </p>
                  <p class="contenttext" style="color: #ffd452">
                    {{ importantCount }}
                  </p>
                </div>
              </el-col>
              <el-col :span="6" style="display: flex">
                <img src="@/assets/img/common/commonly.png" />
                <div class="text">
                  <p
                    class="headertext"
                    style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis"
                  >
                    {{ $t('public.general') }}
                  </p>
                  <p class="contenttext" style="color: #47a2ff">
                    {{ generalCount }}
                  </p>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="tabcontent">
            <el-tabs v-model="activeName" type="card" class="tabclass" @tab-change="handleClick">
              <el-tab-pane :label="$t('public.urgent')" name="urgent">
                <div v-show="!loadingList4">
                  <div
                    class="tabcontenttext"
                    v-for="(item, index) in guardHitList.slice(0, 4)"
                    :key="index"
                  >
                    <div class="img-content">
                      <div class="img-content-item">
                        <el-image :key="item.detectImage" :src="item.previewDetectImage"></el-image>
                        <span class="img-type-tips" :title="$t('metadata.snapImg')">
                          {{ $t('metadata.snapImg') }}
                        </span>
                        <span
                          class="lpn-tips"
                          v-if="item.hitType === '2' && item.metadata.lpn"
                          :title="item.metadata.lpn"
                        >
                          {{ item.metadata.lpn }}
                        </span>
                      </div>
                      <div v-if="item.hited == '1'" class="img-content-item">
                        <el-image
                          :key="item.hitType === '2' ? item.vehiclePhoto : item.facePhoto"
                          :src="
                            item.hitType === '2' ? item.previewVehiclePhoto : item.previewFacePhoto
                          "
                        ></el-image>
                        <span
                          class="img-type-tips"
                          :title="item.repositoryName || $t('metadata.idPhoto')"
                        >
                          {{ item.repositoryName || $t('metadata.idPhoto') }}
                        </span>
                        <span
                          class="lpn-tips"
                          v-if="item.hitType === '2' && item.lpn"
                          :title="item.lpn"
                        >
                          {{ item.lpn }}
                        </span>
                      </div>
                      <div v-else :style="{ width: '110px', height: '110px' }"></div>
                      <span class="similarity" v-if="item.hitType === '1' && item.hited == '1'">
                        {{ parseFloat(item.similarity).toFixed(2) + '%' }}
                      </span>
                    </div>
                    <div class="text">
                      <div class="headertext">
                        <p>
                          {{ item.hited == 1 ? item.repositoryName : '' }}
                        </p>
                        <p>
                          {{ item.hitTime }}
                        </p>
                      </div>
                      <p class="contenttext">{{ item.guardName }}</p>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('public.important')" name="important">
                <div v-show="!loadingList4">
                  <div
                    class="tabcontenttext"
                    v-for="(item, index) in guardHitList.slice(0, 4)"
                    :key="index"
                  >
                    <div class="img-content">
                      <div class="img-content-item">
                        <el-image :key="item.detectImage" :src="item.previewDetectImage"></el-image>
                        <span class="img-type-tips" :title="$t('metadata.snapImg')">
                          {{ $t('metadata.snapImg') }}
                        </span>
                        <span
                          class="lpn-tips"
                          v-if="item.hitType === '2' && item.metadata.lpn"
                          :title="item.metadata.lpn"
                        >
                          {{ item.metadata.lpn }}
                        </span>
                      </div>
                      <div v-if="item.hited == '1'" class="img-content-item">
                        <el-image
                          :key="item.hitType === '2' ? item.vehiclePhoto : item.facePhoto"
                          :src="
                            item.hitType === '2' ? item.previewVehiclePhoto : item.previewFacePhoto
                          "
                        ></el-image>
                        <span
                          class="img-type-tips"
                          :title="item.repositoryName || $t('metadata.idPhoto')"
                        >
                          {{ item.repositoryName || $t('metadata.idPhoto') }}
                        </span>
                        <span
                          class="lpn-tips"
                          v-if="item.hitType === '2' && item.lpn"
                          :title="item.lpn"
                        >
                          {{ item.lpn }}
                        </span>
                      </div>
                      <div v-else :style="{ width: '110px', height: '110px' }"></div>
                      <span class="similarity" v-if="item.hitType === '1' && item.hited == '1'">
                        {{ parseFloat(item.similarity).toFixed(2) + '%' }}
                      </span>
                    </div>
                    <div class="text">
                      <div class="headertext">
                        <p>
                          {{ item.hited == 1 ? item.repositoryName : '' }}
                        </p>
                        <p>
                          {{ item.hitTime }}
                        </p>
                      </div>
                      <p class="contenttext">{{ item.guardName }}</p>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
              <el-tab-pane :label="$t('public.general')" name="general">
                <div v-show="!loadingList4">
                  <div
                    class="tabcontenttext"
                    v-for="(item, index) in guardHitList.slice(0, 4)"
                    :key="index"
                  >
                    <div class="img-content">
                      <div class="img-content-item">
                        <el-image :key="item.detectImage" :src="item.previewDetectImage"></el-image>
                        <span class="img-type-tips" :title="$t('metadata.snapImg')">
                          {{ $t('metadata.snapImg') }}
                        </span>
                        <span
                          class="lpn-tips"
                          v-if="item.hitType === '2' && item.metadata.lpn"
                          :title="item.metadata.lpn"
                        >
                          {{ item.metadata.lpn }}
                        </span>
                      </div>
                      <div v-if="item.hited == '1'" class="img-content-item">
                        <el-image
                          :key="item.hitType === '2' ? item.vehiclePhoto : item.facePhoto"
                          :src="
                            item.hitType === '2' ? item.previewVehiclePhoto : item.previewFacePhoto
                          "
                        ></el-image>
                        <span
                          class="img-type-tips"
                          :title="item.repositoryName || $t('metadata.idPhoto')"
                        >
                          {{ item.repositoryName || $t('metadata.idPhoto') }}
                        </span>
                        <span
                          class="lpn-tips"
                          v-if="item.hitType === '2' && item.lpn"
                          :title="item.lpn"
                        >
                          {{ item.lpn }}
                        </span>
                      </div>
                      <div v-else :style="{ width: '110px', height: '110px' }"></div>
                      <span class="similarity" v-if="item.hitType === '1' && item.hited == '1'">
                        {{ parseFloat(item.similarity).toFixed(2) + '%' }}
                      </span>
                    </div>
                    <div class="text">
                      <div class="headertext">
                        <p>
                          {{ item.hited == 1 ? item.repositoryName : '' }}
                        </p>
                        <p>
                          {{ item.hitTime }}
                        </p>
                      </div>
                      <p class="contenttext">{{ item.guardName }}</p>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { getFormatDate, getDIYTime2, getDIYTime } from '@/utils/common/mutil'
import routeJump from '@/mixin/route-jump.js'
import { handleGetPreview } from '@/utils/common/preViewImg'
import { sStorage } from '@/utils/common/store'
export default {
  name: 'IntelligentTasksOverview',
  mixins: [routeJump],
  data() {
    return {
      locale: localStorage.getItem('locale'),
      isRouterAlive: true,
      activeName: 'urgent',
      updateTime: '',
      updateWeek: {},
      //任务总数概览
      totalTask: {
        total: 0,
        executing: 0,
        unExecuted: 0,
        failed: 0,
        notStarted: 0,
        stopped: 0,
        completed: 0
      },
      //今日抓拍数据
      metadata: {},
      level: 2,
      //告警信息紧急、重要、一般
      urgentCount: 0,
      importantCount: 0,
      generalCount: 0,
      //告警信息数据
      guardHitList: [],
      //元数据是否loading
      loadingList2: false,
      //统计任务数是否loading
      loadingList1: false,
      //柱状图是否loading
      loadingList3: false,
      //告警信息是否loading
      loadingList4: false,
      //柱状图人员抓拍数据
      personList: [],
      //柱状图车辆抓拍数据
      vehicleList: []
    }
  },
  watch: {
    $route(to, from) {
      if (from.path === '/algorithm/intelligent-task-add') {
        this.addDate()
        this.getTaskTotal()
        this.getMetadata()
        this.getguardHit()
        this.getEdgeProperties()
      }
    }
  },
  mounted() {
    this.addDate()
    this.getTaskTotal()
    this.getMetadata()
    this.getguardHit()
    this.getEdgeProperties()
  },
  methods: {
    //图表配置即展示
    getBarChart() {
      if (!document.getElementById('barChart')) {
        return
      }
      let barChart = echarts.init(document.getElementById('barChart'))
      let resizeFn = () => {
        barChart.resize()
      }
      window.addEventListener('resize', resizeFn)
      onUnmounted(() => {
        window.removeEventListener('resize', resizeFn)
      })
      // 指定图表的配置项和数据
      // 使用刚指定的配置项和数据显示图表。
      let obj = this
      // 绘制图表
      barChart.setOption({
        color: ['#54ABFF', '#FD9E56'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow', // 默认为直线，可选为 ：'line' | 'shadow'
            shadowStyle: {
              color: 'rgba(103,86,127,.2)'
            }
          }
        },
        legend: {
          data: [this.$t('repo.personnelCaptur'), this.$t('repo.vehicleCapture')],
          x: 'right',
          textStyle: {
            color: '#fff',
            width: '100%'
          }
          // ...
        },
        grid: {
          left: '18',
          right: '0',
          bottom: '20',
          top: '28',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: [
              this.$t('public.Monday'),
              this.$t('public.Tuesday'),
              this.$t('public.Wednesday'),
              this.$t('public.Thursday'),
              this.$t('public.Friday'),
              this.$t('public.Saturday'),
              this.$t('public.Sunday')
            ],
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: '#808080'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#808080'
              }
            },
            splitLine: {
              lineStyle: {
                type: 'dashed',
                color: '#808080'
              }
            }
          }
        ],
        series: [
          {
            type: 'bar',
            name: this.$t('repo.personnelCaptur'),
            data: this.personList,
            itemStyle: {
              normal: {
                color: params => {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.2, color: '#54ABFF' },
                    { offset: 1, color: '#0048D0' }
                  ])
                }
              }
            }
          },
          {
            type: 'bar',
            name: this.$t('repo.vehicleCapture'),
            data: this.vehicleList,
            itemStyle: {
              normal: {
                color: params => {
                  return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0.2, color: '#FD9E56' },
                    { offset: 1, color: '#FF8400' }
                  ])
                }
              }
            }
          }
        ],
        textStyle: {
          color: '#CCCCCC',
          fontSize: 14
        }
      })
      this.$nextTick(() => {
        barChart.resize()
      })
    },
    //获取当天日期
    addDate() {
      const nowDate = new Date()
      const date = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate()
      }
      const newmonth = date.month > 10 ? date.month : '0' + date.month
      const day = date.date > 10 ? date.date : '0' + date.date
      this.updateTime = date.year + '-' + newmonth + '-' + day + ' 00:00:00'
    },
    //获取元数据当日抓拍
    async getMetadata() {
      this.loadingList2 = true
      let _param = {
        date: this.updateTime
      }
      await this.$api.getMetadata(_param).then(res => {
        res.result = res.result.map(item => {
          item.previewCaptureImage = handleGetPreview(item.captureImagePath)
          item.previewDetectImage = handleGetPreview(item.detectImagePath)
          return item
        })
        this.metadata = res
        this.loadingList2 = false
      })
    },
    async getTaskTotal() {
      this.loadingList1 = true
      this.totalTask = {
        total: 0,
        executing: 0,
        completed: 0,
        failed: 0,
        notStarted: 0,
        unExecuted: 0,
        stopped: 0
      }
      await this.$api.getTaskTotal({}).then(res => {
        res.list.forEach(element => {
          this.totalTask['total'] += element.num
          if (element.state === 0 || element.state === 7) {
            this.totalTask['notStarted'] = element.num
            this.totalTask['unExecuted'] += element.num
          }
          if (element.state === 1 || element.state === 2) {
            this.totalTask['executing'] += element.num
          }
          if (element.state === 3) {
            this.totalTask['completed'] = element.num
            this.totalTask['unExecuted'] += element.num
          }
          if (element.state === 4 || element.state === 5) {
            this.totalTask['stopped'] += element.num
            this.totalTask['unExecuted'] += element.num
          }
          if (element.state === 6) {
            this.totalTask['failed'] = element.num
          }
        })
        this.loadingList1 = false
      })
    },
    //告警统计
    async getguardHit() {
      this.loadingList4 = true
      await this.$api
        .getguardHit({
          level: this.level
        })
        .then(res => {
          this.urgentCount = res.urgentCount
          this.importantCount = res.importantCount
          this.generalCount = res.generalCount
          this.guardHitList = res.result.map(item => {
            item.previewCaptureImage = handleGetPreview(item.captureImage)
            item.previewDetectImage = handleGetPreview(item.detectImage)
            if (item.hited == '1') {
              if (item.hitType === '2') {
                item.previewVehiclePhoto = handleGetPreview(item.vehiclePhoto)
              } else {
                item.previewFacePhoto = handleGetPreview(item.facePhoto)
              }
            }
            return item
          })
          this.loadingList4 = false
        })
    },
    //元数据周期统计
    async getEdgeProperties() {
      this.loadingList3 = true
      this.updateWeek.startDate = getFormatDate(getDIYTime(2).beginTime).slice(0, 10) + ' 23:59:59'
      this.updateWeek.endDate = getFormatDate(getDIYTime(2).endTime).slice(0, 10) + ' 23:59:59'
      await this.$api.getWeekCount(this.updateWeek).then(res => {
        delete res.week[0]
        for (var key in res.week) {
          this.personList.push(res.week[key].faceCount)
          this.vehicleList.push(res.week[key].vehicleCount)
        }
        this.loadingList3 = false
        this.getBarChart()
      })
    },
    //切换告警tab页
    handleClick(val) {
      if (val == 'urgent') {
        this.level = 2
      } else if (val == 'important') {
        this.level = 1
      } else {
        this.level = 3
      }
      this.getguardHit()
    },
    //跳转到元数据查看
    jumpToCapture() {
      let routerPush = {
        name: 'CaptureRecord'
      }
      this.routeJump('/algorithm/capture-record', routerPush)
    },
    //跳转到告警数据查看
    jumpToAlarm() {
      let routerPush = {
        name: 'GuardAlarm'
      }
      this.routeJump('/algorithm/guard-alarm', routerPush)
    },
    //跳转到创建智能分析任务
    jumpToTask() {
      this.$router.push('/algorithm/intelligent-task-add')
    }
  }
}
</script>

<style lang="scss">
#taskOverview {
  margin: 20px;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .headerlist {
      width: 19%;
      height: 140px;
      border-radius: 4px;
      background-color: #0a314f;
      font-size: 20px;
      .mt-7 {
        margin-top: 1rem;
      }
      .taskall {
        display: flex;
        margin-top: 32px;
        img {
          margin-left: 30px;
          width: 76px;
          height: 76px;
        }
        .taskword {
          margin-left: 31px;
          overflow: hidden;
          span {
            font-size: 16px;
            margin-top: 9px;
          }
          p {
            font-size: 26px;
            margin-top: 6px;
          }
        }
      }
      .addIcon {
        display: inline-block;
        margin-top: 32px;
      }
    }
  }
  .content {
    width: 100%;
    margin-top: 25px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    .contentleft,
    .contentright {
      width: 49%;
      border-radius: 4px;
      padding: 21px;
      background-color: #0a314f;
      .text {
        height: 52px;
        margin: auto 0;
        .headertext {
          margin: 0;
          font-size: 14px;
        }
        .contenttext {
          margin-top: 10px;
          font-size: 20px;
          color: #04a1ff;
        }
      }
    }
    .contentleft {
      .imageback {
        height: 144px;
        position: relative;
        margin-top: 10px;
        .imagetext {
          width: calc(100% - 20px);
          height: 44px;
          background: #000000;
          opacity: 0.4;
          position: absolute;
          bottom: 0;
          p {
            margin: 4px 0 0 10px;
          }
        }
      }

      #barChart {
        margin-top: 20px;
        width: 100%;
        height: 360px;
      }
    }
    .contentright {
      margin-left: 23px;
      .text {
        margin-left: 20px;
        .headertext {
          font-size: 14px !important;
          opacity: 0.8;
        }
        .contenttext {
          font-size: 14px !important;
          opacity: 0.8;
        }
      }
      .el-tabs__item.is-active {
        color: #fff;
        background: #ff625b !important;
      }
      .el-tabs__item:nth-child(2).is-active {
        background: #ff8f35 !important;
      }
      .el-tabs__item:nth-child(3).is-active {
        background: #fec842 !important;
      }
      .el-tabs__item:hover {
        color: #fff;
        cursor: pointer;
      }
      .el-tabs__item {
        width: 90px;
        color: #fff;
        text-align: center;
        border: 1px solid #3e5670;
      }
      .el-tabs__item:nth-child(2),
      .el-tabs__item:nth-child(3) {
        border-left: 0px;
      }
      .el-tabs--card > .el-tabs__header .el-tabs__nav {
        border: none !important;
      }
      .el-tabs--card > .el-tabs__header {
        border-bottom: none !important;
      }
      .tabcontent {
        margin-top: 30px;
        position: relative;
        .more {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        .tabcontenttext {
          height: 150px;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          background: #184267;
          border-radius: 4px;
          margin-top: 10px;
          overflow-y: auto;
          .text {
            width: 70%;
            height: 52px;
            margin: auto 20px;
            .headertext {
              font-size: 16px;
              display: flex;
              p {
                margin: 0;
              }
              p:first-child {
                width: 80%;
                text-align: left;
              }
              p:nth-child(2) {
                width: 40%;
                text-align: right;
              }
            }
            .contenttext {
              margin-top: 10px;
              font-size: 16px;
              color: #fff !important;
            }
          }
        }
      }
      .img-content {
        display: flex;
        justify-content: space-between;
        position: relative;
        &-item {
          position: relative;
          .el-image {
            width: 110px;
            height: 110px;
          }

          .img-type-tips {
            position: absolute;
            top: 5px;
            left: 5px;
            right: 5px;
            z-index: 1;
            background-color: rgba(0, 0, 0, 0.5);
            padding: 2px 4px;
            color: #fff;
            display: inline-block;
            max-width: 100px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }

          .lpn-tips {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 1;
            background-color: rgba(26, 122, 239, 0.5);
            padding: 2px 4px;
            font-size: 14px;
            color: #fff;
            display: inline-block;
            width: 70%;
            text-align: center;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .similarity {
          position: absolute;
          bottom: 5px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
          background-color: rgba(255, 107, 107, 0.8);
          padding: 4px 6px;
          color: #fff;
          font-size: 16px;
        }
      }
    }
    .enStyle {
      .el-tabs__item {
        width: unset;
      }
    }
  }
  .more {
    text-align: right;
    cursor: pointer;
  }
}
</style>
