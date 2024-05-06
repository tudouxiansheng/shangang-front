<template>
  <!--事件闭环进展-->
  <div class="closeLoop">
    <div class="topTitle">
      <div class="titleBack" @click="toEventDetail">工单详情</div>
      <div class="title">处理进展</div>
      <i class="el-icon-close infoIcon iconclose" @click="Allclose"></i>
    </div>
    <div class="contentwrapper" v-if="$store.state.alarmParentInfo.workSheetId">
      <div class="parentEvent">
        <el-timeline class="timeline timeline2">
          <el-timeline-item
            placement="top"
            color="#1efffc"
            v-for="(item, index) in parentItem"
            :key="index"
            :timestamp="item.timestamp"
          >
            <el-card>
              <div class="title33" v-if="item.dispatchName">
                <span>派单人姓名：{{ item.dispatchName }}</span>
              </div>
              <div class="title33" v-if="item.eventName">
                <span>事件名称：{{ item.eventName }}</span>
              </div>
              <div class="title33" v-if="item.occurTime">
                <span>事件发生时间：{{ item.occurTime }}</span>
              </div>
              <div class="title33" v-if="item.occurSite">
                <span>发生位置{{ item.occurSite }}</span>
              </div>
              <div class="title33" v-if="item.residenceInterval">
                <span>环节滞留时间：{{ item.residenceInterval }}</span>
              </div>
              <div class="title33" v-if="item.state">
                <span>状态： {{ item.state | parentState }} </span>
              </div>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
      <el-timeline class="timeline" v-for="(item, index) in listItem" :key="index">
        <el-timeline-item placement="top" color="#3696E5" timestamp="工单处理">
          <!--工单处理-->
          <el-card v-if="item.handleResult">
            <div class="title33" v-if="item.handleResult.handlerName">
              <span>处理人姓名：{{ item.handleResult.handlerName }}</span>
            </div>

            <div class="title33" v-if="item.handleResult.completedTime">
              <span>完成时间：{{ item.handleResult.completedTime }}</span>
            </div>
            <div class="title33" v-if="item.handleResult.residenceInterval">
              <span>环节滞留时间：{{ item.handleResult.residenceInterval }}</span>
            </div>
            <div class="title33" v-if="item.handleResult.auditOpinion">
              <span>处理意见：{{ item.handleResult.auditOpinion }}</span>
            </div>

            <div class="title33 fujian3" v-if="item.handleResult.attachmentList">
              <div class="mingzi">附件：</div>
              <div class="source" v-for="(item, index2) in item.handleResult.attachmentList" :key="index2">
                <el-image
                  :src="item.fileUrl"
                  style="width: 60px; height: 60px; margin-right: 10px; margin-bottom: 10px"
                  v-if="item.fileType == 1"
                  :preview-src-list="[item.fileUrl]"
                />
                <video width="60" height="60" controls v-if="item.fileType == 2" style="margin-right: 10px" autoplay>
                  <source
                    :src="item.fileUrl"
                    type="video/mp4"
                    v-if="item.fileType == 2"
                    style="margin-right: 10px; margin-bottom: 10px"
                  />
                </video>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item placement="top" color="#3696E5" timestamp="工单审核">
          <!--工单审核-->
          <el-card v-if="item.auditResult">
            <div class="title33" v-if="item.auditResult.auditName">
              <span>审核人姓名：{{ item.auditResult.auditName }}</span>
            </div>

            <div class="title33" v-if="item.auditResult.state">
              <span
                >子工单状态：<span
                  :class="{
                    activegreen: item.auditResult.state == 2,
                    activered: item.auditResult.state == 3,
                  }"
                  >{{ item.auditResult.state | state }}</span
                ></span
              >
            </div>
            <div class="title33" v-if="item.auditResult.completedTime">
              <span>完成时间：{{ item.auditResult.completedTime }}</span>
            </div>
            <div class="title33" v-if="item.auditResult.residenceInterval">
              <span>环节滞留时间：{{ item.auditResult.residenceInterval }}</span>
            </div>
            <div class="title33">
              <span
                >审核意见：<span v-if="item.auditResult.auditOpinion">{{ item.auditResult.auditOpinion }}</span
                ><span v-else>无</span></span
              >
            </div>
            <div class="title33 fujian3" v-if="item.handleResult.attachmentList">
              <div class="mingzi">相关附件：</div>
              <div class="source" v-for="(item, index2) in item.handleResult.attachmentList" :key="index2">
                <el-image
                  :src="item.fileUrl"
                  style="width: 60px; height: 60px; margin-right: 10px; margin-bottom: 10px"
                  v-if="item.fileType == 1"
                  :preview-src-list="[item.fileUrl]"
                />
                <video width="60" height="60" controls v-if="item.fileType == 2" style="margin-right: 10px" autoplay>
                  <source
                    :src="item.fileUrl"
                    type="video/mp4"
                    v-if="item.fileType == 2"
                    style="margin-right: 10px; margin-bottom: 10px"
                  />
                </video>
              </div>
            </div>
          </el-card>
        </el-timeline-item>
        <el-timeline-item placement="top" color="#3696E5" timestamp="事件闭环" v-if="item.auditResult">
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="else" v-else style="color: white; margin-top: 20px; margin-left: 20px">暂无处理进展</div>
  </div>
</template>

<script>
import { childProgress } from '../../../../../utils/api'
export default {
  data() {
    return {
      searchInfo: {
        pageInfo: {
          pageSize: 10,
          pageNum: 1,
        },
        workSheetId: '',
      },
      dealActivity: [],
      parentItem: [],
      listItem: [],
    }
  },
  filters: {
    workSheetType(type) {
      if (type == 1) {
        return '告警'
      } else if (type == 0) {
        return '巡逻'
      }
    },
    parentState(state) {
      switch (state) {
        case 0:
          return '已下发'
        case 1:
          return '已完成'
        case 2:
          return '已过期'
      }
    },
    state(state) {
      switch (state) {
        case 0:
          return '处理中'
        case 1:
          return '待审核'
        case 2:
          return '审核通过'
        case 3:
          return '未通过'
        case 4:
          return '子工单过期'
        default:
          return '未知'
      }
    },
  },
  mounted() {
    this.getChildProgress()
  },
  methods: {
    //获取处理进展
    getChildProgress() {
      if (this.$store.state.alarmParentInfo.workSheetId) {
        childProgress({
          workSheetId: this.$store.state.alarmParentInfo.workSheetId,
        }).then((res) => {
          if (res.resultCode == 0) {
            //父工单接收
            if (res.receiveInfo) {
              this.parentItem = []
              this.parentItem.push({ ...res.receiveInfo, timestamp: '接收' })
              if (res.receiveInfo.state == 2) {
                this.parentItem.push({ timestamp: '事件闭环' })
              } else {
                this.parentItem.push({})
                if (res.progressInfoList) {
                  this.listItem = res.progressInfoList
                }
              }
            }
          }
        })
      }
    },
    Allclose() {
      this.$store.commit('alarmPage', 0)
    },
    toEventDetail() {
      this.$store.commit('alarmPage', 2)
    },
  },
}
</script>

<style lang="scss" scoped>
.closeLoop {
  width: 340px;
  height: 690px;
  background: rgba(20, 47, 72, 0.65);
  border-radius: 8px;
  pointer-events: auto;
  position: absolute;
  right: 480px;
  top: 100px;
  padding: 20px;
  z-index: 1000;
  font-size: 14px;
  .el-timeline-item__node {
    background-color: #1efffc;
  }
  .el-card__body {
    font-size: 12px;
    padding: 3px;
  }
  .topTitle {
    display: flex;
    justify-content: space-between;
    .title {
      font-weight: 400;
      color: #3696e5;
      font-size: 14px;
      flex: 1;
      margin-left: 20px;
    }
    .titleBack {
      font-size: 14px;
      color: #ffffff;
      margin-left: 17px;
      cursor: pointer;
      width: 68px;
    }
    .iconclose {
      font-size: 16px;
      color: white;
      cursor: pointer;
    }
  }
  .timeline {
    overflow: auto;

    .title33 {
      margin-top: 11px;
    }
    .fujian3 {
      display: flex;
      align-items: center;
      .source {
        margin-right: 5px;
        width: 60px;
        height: 60px;
      }
    }
    .el-timeline-item__tail {
      border-left: 1px dashed #1efffc;
      left: 6px !important;
    }
    .el-timeline-item__node--normal {
      left: 0 !important;
    }
    .el-timeline-item__timestamp {
      color: #1efffc;
    }
    .el-card {
      background: transparent;
      color: #fff;
      border: none;
    }
  }
  .parentEvent {
    margin-top: 20px;
  }
  .contentwrapper {
    overflow-y: scroll;
    height: 600px;
  }
}
</style>
