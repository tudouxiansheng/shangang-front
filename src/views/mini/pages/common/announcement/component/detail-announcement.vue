<template>
  <el-dialog
    :title="$t('systemAnnounce.noticeDetail')"
    v-model="dialogVisible"
    top="10vh"
    width="800px"
    class="detail_notice"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <div class="content">
      <el-timeline>
        <el-timeline-item
          v-for="(item, index) in ruleForm.processList"
          :key="index"
          :timestamp="activityObj[item.status]"
        >
          {{ item.creator }}
          <el-card>
            <div v-show="index !== ruleForm.processList.length - 1">
              {{ item.createTime }}
            </div>
            <div v-show="index == ruleForm.processList.length - 1 && item.status === 2">
              {{ $t('systemAnnounce.tipss') }}：
            </div>
            <div>{{ item.rejectMessage }}</div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
      <div style="border-left: 1px solid #eee; margin: 10px 30px; flex: 3">
        <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item :label="$t('systemAnnounce.receiver') + '：'" prop="receiver">
            {{ ruleForm.receiver }}
          </el-form-item>
          <el-form-item :label="$t('systemAnnounce.noticeTime') + '：'" prop="noticeTime">
            {{ ruleForm.beginDate }} —— {{ ruleForm.endDate }}
          </el-form-item>
          <el-form-item :label="$t('systemAnnounce.title') + '：'" prop="title">
            {{ ruleForm.title }}
          </el-form-item>
          <el-form-item :label="$t('systemAnnounce.content') + '：'" prop="content">
            <div style="white-space: pre-wrap; word-break: break-all">
              {{ ruleForm.content }}
            </div>
          </el-form-item>
          <div class="footer">{{ ruleForm.footPublisher }}</div>
          <div class="footer">{{ ruleForm.footPublishDate }}</div>
        </el-form>
      </div>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="dialogClosed">
          {{ $t('systemAnnounce.return') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    detailVisible: {
      type: Boolean,
      default: false
    },
    detaiContent: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {},
      activityObj: {
        0: this.$t('systemAnnounce.audit'),
        1: this.$t('systemAnnounce.pending'),
        2: this.$t('systemAnnounce.rejected'),
        3: this.$t('systemAnnounce.ended')
      }
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.detailVisible
      },
      set(val) {
        this.$emit('update:detailVisible', val)
      }
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //打开弹框
    dialogOpen() {
      this.$nextTick(async () => {
        this.setDialogCss()
        this.announceInfo()
      })
    },
    dialogClosed() {
      this.dialogVisible = false
    },
    announceInfo() {
      this.$api
        .announceInfo({
          announceId: this.detaiContent.announceId
        })
        .then(res => {
          if (res && res.resultCode == 0) {
            let processList = []
            res = {
              ...res,
              processList
            }
            res.processList = [
              {
                creator: res.creator,
                createTime: res.createTime
              },
              {
                creator: this.$t('systemAnnounce.admin'),
                status: res.status,
                rejectMessage: res.rejectMessage
              }
            ]
            this.ruleForm = { ...this.ruleForm, ...res }
          }
        })
    }
  }
}
</script>

<style lang="scss">
.detail_notice {
  .el-dialog__body {
    padding: 15px 20px 5px 0px;
  }
  .content {
    display: flex;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1a1a1a;
  }
  .footer {
    text-align: end;
  }
  .el-timeline {
    flex: 1;
  }
  .el-timeline-item__timestamp.is-bottom {
    position: absolute;
    top: 0px;
    right: 22px;
    color: #ff5656;
  }
  .el-timeline-item__tail {
    left: 8px;
    border-left: 2px solid #c5c5c5;
  }
  .el-timeline-item__node--normal {
    width: 20px;
    height: 20px;
    background: #98b5e2;
    box-shadow: 0 0 0 4px #fff;
    &::before {
      content: '';
      display: block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #2c6dd2;
      position: absolute;
    }
  }
  .el-timeline-item__content {
    font-size: 16px;
    color: #232c3b;
  }
  .el-card__body {
    margin-top: 8px;
    padding: 0px;
    font-size: 14px;
    line-height: 28px;
    color: #7a869a;
  }
  .el-card {
    border: 0px solid #ebeef5;
    background-color: transparent;
  }
  .el-card.is-always-shadow {
    -webkit-box-shadow: 0 0px 0px 0 transparent;
    box-shadow: 0 0px 0px 0 transparent;
  }
  .el-timeline {
    padding: 14px 0px 0px 23px;
  }
}
</style>
