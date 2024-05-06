<template>
  <CusDialog :visible="visible" @close="handleClose(false)" isDetail :title="$t('patrol.patrolChildInfo')">
    <div class="task-info-content" slot="body">
      <div class="task-left" v-if="info.id">
        <el-form :model="info" label-position="right" label-suffix=":" :label-width="isZh ? '120px' : '150px'">
          <el-form-item :label="$t('patrol.taskNum')">
            <div class="form-value">{{ info.id }}</div>
          </el-form-item>
          <el-form-item :label="$t('patrol.route')">
            <div class="form-value">
              <span :title="info.routeName">{{ info.routeName }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.taskStatus')">
            <div class="form-value">
              <span>{{ handleFormatStatus(info.state) }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.patrolMan')">
            <div class="form-value">
              <span :title="info.patrolPeopleName">{{ info.patrolPeopleName }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.startTime')">
            <div class="form-value">
              <span :title="info.startTime">{{ info.startTime }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.endTime')">
            <div class="form-value">
              <span :title="info.endTime">{{ info.endTime }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.actualStartTime')">
            <div class="form-value">
              <span :title="info.actualStartTime">{{ info.actualStartTime }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('patrol.actualEndTime')">
            <div class="form-value">
              <span :title="info.actualEndTime">{{ info.actualEndTime }}</span>
            </div>
          </el-form-item>
          <el-form-item :label="$t('public.createTime')">
            <div class="form-value">
              <span :title="info.createTime">{{ info.createTime }}</span>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div class="task-process">
        <div class="timeline-wrapper">
          <el-timeline class="timeline">
            <el-timeline-item
              placement="top"
              v-for="(item, index) in processList"
              :color="item.flag ? (item.isStart ? '#1efffc' : '#fff') : !item.isStart ? '#fff' : '#2a4a6b'"
              :key="index"
              size="large"
              :timestamp="item.reportTime"
              hide-timestamp
              :icon="
                item.flag || !item.isStart ? '' : item.status == 0 ? 'el-icon-circle-check' : 'el-icon-circle-close'
              "
            >
              <div class="timeline-status">
                <div class="point-name" :title="item.label">{{ item.label }}</div>
                <div class="status" :class="item.flag || !item.isStart ? '' : item.status == 0 ? '' : 'is-error'">
                  <span v-if="!item.flag && item.isStart">{{
                    item.status == 0 ? $t('public.normal') : $t('public.unusual')
                  }}</span>
                </div>
              </div>
              <template v-if="item.isStart">
                <div class="timeline-item">
                  <div class="item-value">{{ item.reportTime }}</div>
                </div>
                <div class="timeline-item" v-if="!item.flag">
                  <div class="item-label">{{ $t('patrol.desc') }}</div>
                  <div class="item-value">{{ item.recordDescribe }}</div>
                </div>
                <div class="timeline-item" v-if="!item.flag && item.fileList && item.fileList.length">
                  <div class="img-wrapper" v-viewer>
                    <img
                      class="img-item"
                      v-for="(file, index) in item.fileList"
                      :key="index"
                      :src="file.fileUrl"
                      alt=""
                    />
                  </div>
                </div>
              </template>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
  </CusDialog>
</template>

<script>
export default {
  name: 'taskInfo',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
    info: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {}
  },
  created() {},
  computed: {
    processList() {
      let temp = []
      console.log(this.info, 'info')
      this.data.map((item, index) => {
        let pointReportInfo = item.pointReportInfo ? item.pointReportInfo : false
        if (index == 0) {
          temp.push({
            label: this.$t('patrol.start'),
            flag: true,
            isStart: this.info.actualStartTime && this.info.state != 1 ? true : false,
            reportTime: this.info.actualStartTime,
          })
        }
        let t = pointReportInfo
          ? {
              recordDescribe: pointReportInfo.recordDescribe,
              reportTime: pointReportInfo.reportTime,
              fileList: pointReportInfo.fileList,
              status: pointReportInfo.status,
              state: pointReportInfo.state,
            }
          : {}
        temp.push({
          flag: false,
          ...item,
          isStart: pointReportInfo ? true : false,
          label: item.pointName,
          ...t,
        })

        if (index == this.data.length - 1) {
          temp.push({
            label: this.$t('patrol.complete'),
            flag: true,
            isStart: this.info.actualEndTime ? true : false,
            reportTime: this.info.actualEndTime,
          })
        }
      })
      console.log(temp)
      return temp
    },
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  methods: {
    handleFormatStatus(status) {
      const statusDict = {
        1: this.$t('patrol.notStarted'),
        2: this.$t('patrol.execution'),
        3: this.$t('patrol.executed'),
        4: this.$t('patrol.expired'),
        5: this.$t('patrol.undone'),
      }
      return statusDict[status]
    },
    handleClose(type) {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.timeline-status {
  display: flex;
  font-size: 14px;
  margin-bottom: 10px;
  margin-top: 3px;
  overflow: hidden;
  .point-name {
    flex: 4;
    color: #fff;
    overflow: hidden;
    white-space: nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow: ellipsis;
  }
  &.is-error {
    color: #df4044;
  }
  .status {
    flex: 1;
    color: #0affff;
    text-align: right;
    &.is-error {
      color: #df4044;
    }
  }
}
.img-wrapper {
  display: flex;
  margin: 10px 0;
  .img-item {
    width: 120px;
    height: 120px;
    margin-right: 30px;
    border-radius: 4px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.dialog-title {
  color: #0cd8fa;
  font-size: 18px;
  padding-top: 10px;
  box-sizing: border-box;
}
.form-value {
  overflow: hidden;
  white-space: nowrap;
  /*文字超出宽度则显示ellipsis省略号*/
  text-overflow: ellipsis;
  span {
    overflow: hidden;
    white-space: nowrap;
    /*文字超出宽度则显示ellipsis省略号*/
    text-overflow: ellipsis;
  }
}
.task-info-content {
  color:#fff;
  display: flex;
  padding: 20px 30px;
  box-sizing: border-box;
  height: 500px;
  overflow: hidden;
  .task-left {
    flex: 2;
    overflow: hidden;
    padding-right: 10px;
  }
  .task-process {
    flex: 3;
    padding-left: 15px;
    overflow: auto;
    padding-right: 10px;
  }
}
.timeline-wrapper {
  margin-top: 20px;
  font-size: 14px;
  ::v-deep.el-timeline-item__icon {
    font-size: 18px;
    &.el-icon-circle-check {
      color: #1efffc;
    }
    &.el-icon-circle-close {
      color: #df4044;
    }
  }
}
.timeline-item {
  display: flex;
  margin-bottom: 10px;
  font-size: 14px;
  color: #ddd;
  .item-label {
    white-space: nowrap;
    color: #ddd;
    &:after {
      content: '：';
    }
  }
  .item-value {
    //overflow: hidden;
    //white-space: nowrap;
    ///*文字超出宽度则显示ellipsis省略号*/
    //text-overflow: ellipsis;
  }
}
.custom-timeline {
  margin-top: 30px;
  margin-bottom: 30px;
  max-height: 380px;
  overflow: auto;
  padding-left: 10px;
  padding-right: 10px;
  ::v-deep.el-timeline-item {
    .el-timeline-item__content {
      color: #fff;
    }
  }
  .timeline-status {
    color: #909399;
    display: flex;
    font-size: 14px;
    .time {
      margin-left: 30px;
    }
  }
}
.work-detail {
    padding: 0 30px;
    box-sizing: border-box;
    .work-base-info {
      .item {
        display: flex;
        margin-bottom: 10px;
        .red {
          color: #ff4d4f;
        }
        .blue {
          color: #17cd57;
        }
        .item-label {
          margin-right: 5px;
          white-space: nowrap;
          &:after {
            content: '：';
          }
        }
        .item-value {
        }
      }
    }
  }
</style>
