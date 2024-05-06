<template>
  <!--工单详情-->
  <div class="orderApprovalDetail">
    <el-dialog
      :visible.sync="$parent.dialogDetailVisiable"
      top="10vh"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      v-dialogDrag
      v-show="showTab == 1"
    >
      <div class="dialog-content">
        <div class="topName" slot="title">
          <div class="left" @click="orderDetail">{{ $t('work.workOrderDetail') }}</div>
          <div class="right" @click="eventLoop">{{ $t('work.progress') }}</div>
        </div>
        <div class="baseInfo">
          <div class="topTitle">
            <div class="line"></div>
            <div class="name">{{ $t('work.baseInfo') }}</div>
          </div>
          <el-form label-suffix=":" :label-width="isZh ? '120px' : '160px'" v-model="form">
            <div style="display: flex; margin-top: 22px">
              <div style="width: 50%; display: flex; flex-direction: column">
                <el-form-item :label="$t('work.workOrderNo')" prop="workSheetId">
                  <el-input v-model="form.workSheetId" auto-complete="off" :disabled="true" />
                </el-form-item>
                <el-form-item :label="$t('work.type')" prop="workSheetType">
                  <el-select style="width: 100%" v-model="form.workSheetType" :disabled="true">
                    <el-option
                      v-for="item in $parent.workSheetTypeList"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.creator')" prop="handlerName">
                  <el-select style="width: 100%" v-model="form.handlerName" :disabled="true">
                    <el-option
                      v-for="item in $parent.userList"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userName"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </div>

              <div style="width: 50%; display: flex; flex-direction: column">
                <el-form-item :label="$t('alarm.workOrderName')" prop="workSheetName">
                  <el-input v-model="form.workSheetName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item :label="$t('work.level')" prop="workSheetType">
                  <el-select style="width: 100%" v-model="form.workSheetLevel" :disabled="true">
                    <el-option
                      v-for="item in $parent.degreeOfUrgency"
                      :key="item.label"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('work.submitTime')" prop="createTime">
                  <el-input v-model="form.createTime" :disabled="true"></el-input>
                </el-form-item>
              </div>
            </div>
            <!-- <div class="description">
              <el-form-item
                label="问题描述："
                prop="description"
                label-width="100px"
              >
                <textarea
                  class="mytextArea"
                  v-model="form.description"
                  :disabled="true"
                ></textarea>
              </el-form-item>
            </div> -->
          </el-form>
        </div>
        <div class="dealInfo" v-for="(item, index) in childWorkSheetInfoList" :key="index">
          <div class="topTitle">
            <div class="line"></div>
            <div class="name">{{ $t('work.handleInfo') }}</div>
          </div>
          <div class="childwrapper">
            <div class="childContent">
              <div class="leftContent">
                <div class="myspan">{{ $t('work.handler') }}：</div>
                <el-input v-model="item.handlerName" style="width: 194px" :disabled="true"></el-input>
              </div>
              <div class="leftContent">
                <div class="myspan">{{ $t('public.createTime') }}：</div>
                <el-input v-model="item.createTime" style="width: 194px" :disabled="true"></el-input>
              </div>
            </div>
            <div class="des">
              <div class="myspan">{{ $t('work.opinion') }}：</div>
              <textarea class="mytextArea mywidth" v-model="item.opinion" :disabled="true"></textarea>
            </div>
            <div
              class="title fujian"
              style="margin-left: 20px; display: flex; margin-top: 20px"
              v-if="item.childWorkSheetAttachmentList"
            >
              <div style="width: 78px; text-align: center">{{ $t('work.attachment') }}：</div>
              <div class="source" v-for="(item, index2) in item.childWorkSheetAttachmentList" :key="index2">
                <img
                  :src="item.fileUrl"
                  style="width: 120px; height: 80px; margin-right: 10px"
                  v-if="item.fileType == 1"
                />
                <video width="120" height="80" controls v-if="item.fileType == 2" style="margin-right: 10px" autoplay>
                  <source :src="item.fileUrl" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
          <div class="topTitle mytop" v-if="item.state == 3 || item.state == 2">
            <div class="line"></div>
            <div class="name">{{ $t('work.auditOpinion') }}</div>
          </div>

          <el-form
            ref="form"
            class="form"
            label-suffix=":"
            label-width="120px"
            style="margin-top: 20px"
            v-if="item.state == 3 || item.state == 2"
          >
            <el-form-item :label="$t('work.auditResult')">
              <el-radio-group v-model="item.state" :disabled="true">
                <el-radio :label="2">{{ $t('work.p') }}</el-radio>
                <el-radio :label="3">{{ $t('work.r') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('work.reviewer')">
              <el-select
                :placeholder="$t('public.placeholderSelect', { type: $t('work.reviewer') })"
                v-model="item.reviewerName"
                style="width: 391px"
                suffix-icon="el-icon-user"
                :disabled="true"
              >
                <el-option
                  v-for="item in $parent.userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('work.auditOpinion')">
              <textarea class="mytextArea2" v-model="item.suggestion" :disabled="true"></textarea>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>

    <div class="closeLoop" v-show="showTab == 2">
      <div class="topTitle">
        <div class="titleBack" @click="orderDetail">{{ $t('work.workOrderDetail') }}</div>
        <div class="title">{{ $t('work.progress') }}</div>
        <i class="el-icon-close infoIcon iconclose" @click="Allclose"></i>
      </div>
      <div class="contentwrapper">
        <div class="parentEvent">
          <el-timeline class="timeline timeline2">
            <el-timeline-item
              placement="top"
              color="#3696E5"
              v-for="(item, index) in parentItem"
              :key="index"
              :timestamp="item.timestamp"
            >
              <el-card>
                <div class="title" v-if="item.dispatchName">
                  <span>{{ $t('work.dispatcherName') }}：{{ item.dispatchName }}</span>
                </div>
                <div class="title" v-if="item.eventName">
                  <span>{{ $t('work.eventName') }}：{{ item.eventName }}</span>
                </div>
                <div class="title" v-if="item.occurTime">
                  <span>{{ $t('work.eventTime') }}：{{ item.occurTime }}</span>
                </div>
                <div class="title" v-if="item.occurSite">
                  <span>{{ $t('work.eventPos') }}: {{ item.occurSite }}</span>
                </div>
                <div class="title" v-if="item.residenceInterval">
                  <span>{{ $t('work.residenceTime') }}：{{ item.residenceInterval }}</span>
                </div>
                <div class="title" v-if="item.state">
                  <span>{{ $t('work.processStatus') }}： {{ item.state | parentState(that) }} </span>
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
        <el-timeline class="timeline" v-for="(item, index) in listItem" :key="index">
          <el-timeline-item
            placement="top"
            color="#3696E5"
            :timestamp="$t('work.workOrderProcessing')"
            v-if="item.handleResult"
          >
            <!--工单处理-->
            <el-card>
              <div class="title" v-if="item.handleResult.handlerName">
                <span>{{ $t('work.handler') }}：{{ item.handleResult.handlerName }}</span>
              </div>

              <div class="title" v-if="item.handleResult.completedTime">
                <span>{{ $t('work.completeTime') }}：{{ item.handleResult.completedTime }}</span>
              </div>
              <div class="title" v-if="item.handleResult.residenceInterval">
                <span>{{ $t('work.residenceTime') }}：{{ item.handleResult.residenceInterval }}</span>
              </div>
              <div class="title" v-if="item.handleResult.auditOpinion">
                <span>{{ $t('work.opinion') }}：{{ item.handleResult.auditOpinion }}</span>
              </div>

              <div class="title fujian" v-if="item.handleResult.attachmentList">
                <span class="mingzi">{{ $t('work.attachment') }}：</span>
                <div class="source" v-for="(item, index2) in item.handleResult.attachmentList" :key="index2">
                  <img
                    :src="item.fileUrl"
                    style="width: 60px; height: 60px; margin-right: 10px"
                    v-if="item.fileType == 1"
                  />
                  <video width="60" height="60" controls v-if="item.fileType == 2" style="margin-right: 10px" autoplay>
                    <source :src="item.fileUrl" type="video/mp4" />
                  </video>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            placement="top"
            color="#3696E5"
            :timestamp="$t('work.workOrderVerify')"
            v-if="item.auditResult"
          >
            <!--工单审核-->
            <el-card>
              <div class="title" v-if="item.auditResult.auditName">
                <span>{{ $t('work.reviewer') }}：{{ item.auditResult.auditName }}</span>
              </div>

              <div class="title" v-if="item.auditResult.state">
                <span
                  >{{ $t('work.childStatus') }}：<span
                    :class="{
                      activegreen: item.auditResult.state == 2,
                      activered: item.auditResult.state == 3,
                    }"
                    >{{ item.auditResult.state | state(that) }}</span
                  ></span
                >
              </div>
              <div class="title" v-if="item.auditResult.completedTime">
                <span>{{ $t('work.completeTime') }}：{{ item.auditResult.completedTime }}</span>
              </div>
              <div class="title" v-if="item.auditResult.residenceInterval">
                <span>{{ $t('work.residenceTime') }}：{{ item.auditResult.residenceInterval }}</span>
              </div>
              <div class="title">
                <span
                  >{{ $t('work.auditOpinion') }}：<span v-if="item.auditResult.auditOpinion">{{
                    item.auditResult.auditOpinion
                  }}</span
                  ><span v-else>无</span></span
                >
              </div>
              <div class="title fujian" v-if="item.handleResult.attachmentList">
                <span class="mingzi">{{ $t('work.attachment') }}：</span>
                <div class="source" v-for="(item, index2) in item.handleResult.attachmentList" :key="index2">
                  <img :src="item.fileUrl" style="width: 60px; height: 60px" v-if="item.fileType == 1" />
                  <video :src="item.fileUrl" v-if="item.fileType == 2" style="width: 60px; height: 60px"></video>
                </div>
              </div>
            </el-card>
          </el-timeline-item>
          <el-timeline-item
            placement="top"
            color="#3696E5"
            :timestamp="$t('work.closedLoop')"
            v-if="item.auditResult || parentItem[0].state == 2"
          >
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
  </div>
</template>

<script>
import { getWorkSheetInfo, childProgress, getChildWorkSheet } from '../../../../../utils/api'
export default {
  props: ['workSheetId'],
  data() {
    return {
      that: this,
      showTab: 0, //1是工单详情 2是进展
      form: {
        workSheetId: '',
        workSheetName: '',
      },
      listItem: [],
      childWorkSheetInfoList: [], //子工单列表
      parentItem: [],
    }
  },
  filters: {
    state(state, that) {
      switch (state) {
        case 0:
          return that.$t('work.processing')
        case 1:
          return that.$t('work.audit')
        case 2:
          return that.$t('work.pass')
        case 3:
          return that.$t('work.notPass')
        case 4:
          return that.$t('work.expired')
        default:
          return that.$t('public.unknown')
      }
    },
    parentState(state, that) {
      switch (state) {
        case 0:
          return that.$t('work.issued')
        case 1:
          return that.$t('work.completed')
        case 2:
          return that.$t('work.expired')
      }
    },
    workSheetType(type) {
      if (type == 1) {
        return '告警'
      } else if (type == 0) {
        return '巡逻'
      }
    },
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  methods: {
    //打开工单详情
    dialogOpen() {
      this.showTab = 1
      this.getParentAndChildDetail()
    },
    getParentAndChildDetail() {
      let params = { workSheetId: this.workSheetId, flag: true }
      getWorkSheetInfo(params).then((res) => {
        if (res.resultCode == 0) {
          this.form = res.workSheetInfo
        }
      })
      //获取子工单列表
      getChildWorkSheet({
        pageInfo: { pageSize: 15, pageNum: 1 },
        workSheetId: this.workSheetId,
      }).then((res) => {
        if (res.resultCode == 0) {
          if (res.resultCode == 0) {
            this.childWorkSheetInfoList = res.childWorkSheetInfoList
          }
        }
      })
    },
    dialogClosed() {
      this.form = {}
      this.childWorkSheetInfoList = []
    },
    //工单详情
    orderDetail() {
      this.showTab = 1
      this.getParentAndChildDetail()
    },
    //获取处理进展
    getChildProgress() {
      childProgress({ workSheetId: this.workSheetId }).then((res) => {
        if (res.resultCode == 0) {
          //父工单接收
          if (res.receiveInfo) {
            this.parentItem = []
            this.parentItem.push({ ...res.receiveInfo, timestamp: this.$t('work.receive') })
            if (res.receiveInfo.state == 2) {
              this.parentItem.push({ timestamp: this.$t('work.closedLoop') })
            } else {
              this.parentItem.push({})
            }

            if (res.progressInfoList) {
              this.listItem = res.progressInfoList
            }
          }
        }
      })
    },
    //处理进展
    eventLoop() {
      this.showTab = 2
      this.getChildProgress()
    },
    Allclose() {
      this.showTab = 0
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-content {
  width: 100%;
}
.orderApprovalDetail {
  .el-dialog__body {
    padding-top: 10px !important;
    max-height: 800px;
    overflow-y: scroll;
  }

  /*el-label 的颜色 */
  .el-form-item__label {
    color: #b3b3b3;
  }
  .el-form-item__label {
    color: #b3b3b3;
  }
  .el-radio {
    color: #ffffff;
  }
  .topName {
    display: flex;
    cursor: pointer;
    padding: 10px 0;
    box-sizing: border-box;
    .left {
      color: #3696e5;
      font-size: 16px;
    }
    .right {
      color: #ffffff;
      font-size: 14px;
      margin-left: 25px;
    }
  }
  .baseInfo {
    width: 100%;
    height: 235px;
    border: 1px solid #535353;
    padding: 15px 18px 20px 28px;
  }
  .dealInfo {
    width: 100%;
    border: 1px solid #535353;
    padding: 15px 18px 20px 28px;
    margin-top: 10px;
    color: #b3b3b3;
  }
  .topTitle {
    display: flex;
    .line {
      width: 5px;
      height: 19px;
      background: linear-gradient(0deg, #1eb499 0%, #2ea8e5 100%);
      border-radius: 2px;
    }
    .name {
      color: #fefefe;
      margin-left: 5px;
    }
  }
  .mytop {
    margin-top: 20px;
  }
  .childContent {
    display: flex;
    margin-top: 22px;
  }
  .leftContent {
    width: 50%;
    display: flex;
  }
  .des {
    display: flex;
    margin-top: 20px;
  }
  .myspan {
    line-height: 38px;
    width: 100px;
    text-align: right;
  }
  /*事件处理进展 */
  .closeLoop {
    width: 600px;
    height: 690px;
    background: #083753;
    border-radius: 4px;
    position: absolute;
    top: 50px;
    padding: 20px;
    box-sizing: border-box;
    left: 50%;
    margin-left: -170px;
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
      }
      .titleBack {
        font-size: 14px;
        color: #ffffff;
        margin-left: 17px;
        margin-right: 20px;
        cursor: pointer;
      }
      .iconclose {
        font-size: 16px;
        color: white;
        cursor: pointer;
      }
    }
    .timeline {
      overflow: auto;
      // height: 582px;
      // margin-top: 23px;
      // margin-left: 80px;
      .title {
        margin-top: 11px;
      }
      .fujian {
        display: flex;
        align-items: center;
        height: 60px;
        .source {
          margin-right: 5px;
          width: 60px;
          height: 60px;
        }
      }
      .el-timeline-item__tail {
        border-left: 1px dashed #3696e5;
        left: 6px !important;
      }
      .el-timeline-item__node--normal {
        left: 0 !important;
      }
      .el-timeline-item__timestamp {
        color: #3696e5;
      }
      .el-card {
        background: transparent;
        color: #fff;
        border: none;
      }
    }
    .timeline2 {
      margin-left: 0;
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

.mytextArea {
  background-color: transparent;
  color: white;
  font-size: 16px;
  min-height: 60px;
  border-radius: 6px;
  padding: 5px;
  resize: none;
  width: 100%;
}
.mywidth {
  width: 86%;
}
.mytextArea2 {
  background-color: #4d4d4d;
  width: 391px;
  border: none;
  color: white;
  font-size: 16px;
  min-height: 60px;
  border-radius: 6px;
  padding: 5px;
  resize: none;
}
.activegreen {
  color: #2fec7b;
}
.activered {
  color: red;
}
</style>
