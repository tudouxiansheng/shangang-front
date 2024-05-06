<template>
  <!-- 表格暂无数据 -->
  <div
    :style="tableStyle"
    class="no-table"
    v-loading="tableLoading"
    :element-loading-text="$t('public.loading')"
    
  >
    <div v-show="!tableLoading && !tableData.length" class="no-data-show">
      <div class="no-data">
        <img src="@/assets/img/common/NOdata.png" alt />
        <p>{{ $t('public.noData') }}</p>
      </div>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    tableLoading: {
      type: Boolean,
      default: false
    },
    tableStyle: {
      type: String,
      default: 'width:100%;height: 600px'
    },
    tableData: {
      type: Array,
      default() {
        return []
      }
    }
  }
}
</script>

<style lang="scss">
.no-table {
  .no-data-show {
    display: flex;
    height: 100%;
    .no-data {
      margin: auto;
      text-align: center;
      p {
        font-size: 14px;
        color: #808080;
        margin-right: 50px;
        margin-top: 20px;
      }
    }
  }
}
</style>
