<template>
  <div v-if="isRouterAlive" ref="systemClusterManage" id="cluster-manage">
    <el-tabs
      v-model="tableSizes"
      type="card"
      style="margin: 20px 20px -10px 20px"
      @tab-click="handleClick"
    >
      <el-tab-pane :label="'IVS'" name="IVS"></el-tab-pane>
      <el-tab-pane :label="'ADS'" name="ADS"></el-tab-pane>
    </el-tabs>
    <table1 v-if="tableSizes == 'IVS'"></table1>
    <table2 v-if="tableSizes == 'ADS'"></table2>
  </div>
</template>

<script>
import { defineAsyncComponent } from 'vue'
import table1 from './index'
import table2 from './index-vpaas'
export default {
  components: {
    table1: table1,
    table2: table2
  },
  data() {
    return {
      isRouterAlive: true,
      tableSizes: 'IVS'
    }
  },
  methods: {
    handleClick() {}
  }
}
</script>

<style lang="scss">
#cluster-manage {
  .pageTitle {
    font-size: 18px;
    margin-top: 20px;
  }

  .flex-item {
    width: 42%;
  }

  //缺省页
  .tableNOdata img {
    margin-top: 0;
  }

  .el-loading-spinner {
    margin-top: -6px;
  }
  .el-tabs--card > .el-tabs__header {
    border-bottom: 1px solid transparent;
    .el-tabs__nav {
      border-bottom: 1px solid #409eff;
      border-color: #409eff;
    }
    .el-tabs__item.is-active {
      color: #fff;
      background: #409eff !important;
    }
    .el-tabs__item {
      color: #409eff;
      border-bottom: none;
      border-left: 1px solid #409eff;
      background: none !important;
    }
    .el-tabs__item:first-child {
      border-left: none;
    }
  }
}
</style>
