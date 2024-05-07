<template>
  <div class="p-5" ref="faultWorkbench" v-if="isRouterAlive">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('public.all')" name="0" />
      <el-tab-pane :label="$t('operateManage.userReport')" name="1" />
      <el-tab-pane :label="$t('operateManage.patrolReport')" name="2" />
    </el-tabs>
    <fault :activeName="activeName" />
  </div>
</template>

<script>
import fault from './component/fault.vue'
export default {
  name: 'FaultWorkbench',
  components: { fault },
  data() {
    return {
      isRouterAlive: true,
      activeName: '0'
    }
  },
  mounted() {
    if (this.$route.params.activeName) {
      this.activeName = this.$route.params.activeName
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-tabs__header) .el-tabs__item {
  background: none !important;
  color: #fff;
}

:deep(.el-tabs--border-card) > .el-tabs__header,
.main-header,
.el-tabs--border-card {
  background: none !important;
}

:deep(.el-tabs__nav-wrap::after) {
  background-color: #48535a;
}
</style>
