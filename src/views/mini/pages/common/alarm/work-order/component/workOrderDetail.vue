<template>
  <!-- 详情对话框 -->
  <div class="detail">
    <el-dialog
      class="details-box"
      :title="$t('workOrder.workOrderDetail')"
      v-model="$parent.detailTicketVisible"
      top="10vh"
      width="1000px"
      @closed="detailClose"
      @open="detailOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
    >
      <div class="ticket-content">
        <div
          class="step"
          :class="stepStatus == 1 || stepStatus == 2 || stepStatus == 3 ? 'step-blue' : ''"
        >
          <div class="step-text">{{ $t('workOrder.create') }}</div>
        </div>
        <div class="line"></div>
        <div
          class="step"
          :class="stepStatus == 1 || stepStatus == 2 || stepStatus == 3 ? 'step-blue' : ''"
        >
          <div class="step-text">{{ $t('workOrder.dispose') }}</div>
        </div>
        <div class="line"></div>
        <div class="step" :class="stepStatus == 2 || stepStatus == 3 ? 'step-blue' : ''">
          <div class="step-text">{{ $t('workOrder.audit') }}</div>
        </div>
        <div class="line"></div>
        <div class="step" :class="stepStatus == 3 ? 'step-blue' : ''">
          <div class="step-text">{{ $t('workOrder.close') }}</div>
        </div>
      </div>
      <div class="overflow">
        <div class="ticket-content">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.workOrderTitle') + '：' }}</span>
            <span class="ticketContent title" :title="detailData.name">{{ detailData.name }}</span>
          </div>
          <div class="ticket-content-item" style="width: 35%">
            <span class="ticket-content-title">{{ $t('public.createTime') + '：' }}</span>
            <span class="ticketContent">{{ detailData.createTime }}</span>
          </div>
        </div>

        <div class="ticket-content">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.workOrderId') + '：' }}</span>
            <span class="ticketContent">{{ detailData.ticketId }}</span>
          </div>
          <div class="ticket-content-item" style="width: 35%">
            <span class="ticket-content-title">{{ $t('workOrder.workOrderState') + '：' }}</span>
            <span
              class="ticketContent"
              :class="
                detailData.status == 1
                  ? 'disposeColor'
                  : detailData.status == 2
                  ? 'auditColor'
                  : 'closeColor'
              "
            >
              {{ $parent.setStatus(detailData.status) }}
            </span>
          </div>
        </div>

        <div class="ticket-content">
          <div class="ticket-content-item">
            <span class="ticket-content-title">&#12288;{{ $t('workOrder.builderId') + '：' }}</span>
            <span class="ticketContent">{{ detailData.builderName }}</span>
          </div>

          <div class="ticket-content-item" style="width: 35%">
            <span class="ticket-content-title">&#12288;{{ $t('workOrder.checkerId') + '：' }}</span>
            <span class="ticketContent">{{ detailData.checkerName }}</span>
          </div>
        </div>

        <div class="ticket-content">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.workOrderLevel') + '：' }}</span>
            <span
              class="ticketContent"
              :class="
                detailData.level == 1 ? 'danger' : detailData.level == 2 ? 'warning' : 'success'
              "
            >
              {{ $parent.setLevel(detailData.level) }}
            </span>
          </div>

          <div class="ticket-content-item" style="width: 35%" v-if="detailData.eventName">
            <span class="ticket-content-title">{{ $t('public.eventType') + '：' }}</span>
            <span class="ticketContent">{{ detailData.eventName }}</span>
          </div>
        </div>

        <div class="work-order">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.ticketContent') + '：' }}</span>
            <span class="workOrderContent">{{ detailData.content }}</span>
          </div>
          <div class="workImage">
            <img
              :src="item"
              alt
              class="image"
              v-for="(item, index) in detailData.pic"
              :key="index"
            />
          </div>
        </div>

        <div class="work-order" v-if="disposeOpinionShow">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.operationContent') + '：' }}</span>
            <span class="ticketContent">{{ disposeOpinion.result }}</span>
          </div>
          <div class="workImage">
            <img
              :src="item"
              alt
              class="image"
              v-for="(item, index) in disposeOpinion.resultPic"
              :key="index"
            />
          </div>
        </div>

        <div class="work-order" v-if="auditOpinionShow">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.auditOpinion') + '：' }}</span>
            <span class="ticketContent">{{ auditOpinion.result }}</span>
          </div>
          <div class="workImage">
            <img
              :src="item"
              alt
              class="image"
              v-for="(item, index) in auditOpinion.resultPic"
              :key="index"
            />
          </div>
        </div>

        <div style="display: flex; justify-content: flex-start">
          <div class="ticket-content-item">
            <span class="ticket-content-title">{{ $t('workOrder.operationHistory') + '：' }}</span>
          </div>
          <div>
            <div
              class="ticketContent"
              v-for="(item, index) in detailList"
              :key="index"
              style="margin-bottom: 10px"
            >
              <span>{{ item.userName }}</span>
              <span>{{ $t('workOrder.to') }}{{ item.operationTime }}</span>
              <span>{{ $parent.setOperation(item.operation) }}{{ $t('workOrder.task') }}</span>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailClose">{{ $t('public.cancel') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detailData: {},
      detailList: [],
      stepStatus: 1,
      disposeOpinionShow: false,
      disposeOpinion: {},
      auditOpinionShow: false,
      auditOpinion: {}
    }
  },

  methods: {
    // 打开窗口
    detailOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.detailData = this.$parent.detailData
        this.detailList = this.$parent.detailList
        this.stepStatus = this.$parent.stepStatus
        this.disposeOpinion = this.$parent.disposeOpinion
        this.disposeOpinionShow = this.$parent.disposeOpinionShow
        this.auditOpinion = this.$parent.auditOpinion
        this.auditOpinionShow = this.$parent.auditOpinionShow
      })
    },
    // 关闭详情页面
    detailClose() {
      this.$parent.detailTicketVisible = false
      this.$parent.detailData = {}
      this.$parent.detailList = []
      this.$parent.disposeOpinionShow = false
      this.$parent.auditOpinionShow = false
      this.$parent.disposeOpinion = {}
      this.$parent.auditOpinion = {}
    }
  }
}
</script>
