<template>
  <div>
    <collapse-card
      :title="$t('operateManage.reportWorkbench')"
      hideCollapse
      background
      backgroundColor="#0A314F"
    >
      <template #operate>
        <span class="more" @click="searchMore">{{ $t('operateManage.viewMore') }} ></span>
      </template>
      <div class="work-order-container">
        <div class="work-order-items">
          <div class="work-order-item">
            <span>{{ statMap.confirming }}</span>
            <span class="work-order-status">{{ $t('faultAndWorkorder.pending') }}</span>
          </div>
          <div class="work-order-item">
            <span>{{ statMap.processing }}</span>
            <span class="work-order-status">{{ $t('faultAndWorkorder.processing') }}</span>
          </div>
          <div class="work-order-item">
            <span>{{ statMap.closed }}</span>
            <span class="work-order-status">{{ $t('faultAndWorkorder.closed') }}</span>
          </div>
        </div>
      </div>
      <div class="fault-count">
        <span>{{ statMap.existing }}</span>
        <span>{{ $t('operateManage.existReport') }}：</span>
      </div>
    </collapse-card>
  </div>
</template>

<script>
import collapseCard from '../../component/collapse-card.vue'
import routeJump from '@/mixin/route-jump.js' //路由跳转
export default {
  components: { collapseCard },
  mixins: [routeJump],
  data() {
    return {
      statMap: {
        confirming: 0,
        processing: 0,
        closed: 0,
        existing: 0
      }
    }
  },
  mounted() {
    this.getFaultSummary()
  },
  methods: {
    searchMore() {
      let path = '/devOps/fault-workbench',
        routerPush = {
          path: '/devOps/fault-workbench'
        }
      this.routeJump(path, routerPush)
    },
    async getFaultSummary() {
      let res = await this.$api.getFaultSummary()
      if (res.resultCode == 0) {
        this.statMap.existing = res.existing
        this.statMap.confirming = res.confirming
        this.statMap.processing = res.processing
        this.statMap.closed = res.closed
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.more {
  font-size: 14px;
  color: #2c6dd2;
  cursor: pointer;
}
.work-order-container {
  .work-order-items {
    display: flex;
    height: 86px;
    .work-order-item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-end;
      flex: 1;
      margin-right: 20px;
      padding-right: 20px;
      background-size: 100%;
      span {
        width: 50px;
        color: #fff;
        font-size: 22px;
        font-weight: 800;
        text-align: center;
      }
      .work-order-status {
        font-size: 16px;
        font-weight: normal;
      }
      &:first-child {
        background: url('~@/assets/img/common/pending.png') no-repeat;
      }
      &:nth-child(2) {
        background: url('~@/assets/img/common/checking1.png') no-repeat;
      }
      &:last-child {
        background: url('~@/assets/img/common/evaluating.png') no-repeat;
        margin-right: 0;
      }
    }
  }
}
.fault-count {
  display: flex;
  flex-direction: row-reverse;
  margin-top: 13px;
  color: #7a869a;
  font-family: 'Source Han Sans CN';
}
</style>
