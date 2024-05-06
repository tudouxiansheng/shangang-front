<template>
  <div class="pagination">
    <div class="paging">
      <span>{{ $t('public.everyPageShows') }}</span>
      <el-select v-model="pageSize" @change="handleSizeChange">
        <el-option
          v-for="(item, index) in pageSizes"
          :key="index"
          :label="item"
          :value="item"
        ></el-option>
      </el-select>
      <span>{{ $t('public.records') }}</span>
    </div>

    <div>
      <el-pagination
        @current-change="handleCurrentChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :layout="layout"
        :total="total"
        :background="background"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      required: true
    },
    layout: {
      type: String,
      default: 'total, prev, pager, next, jumper'
    },
    limit: {
      type: Number,
      default: 10
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100, 500]
      }
    },
    background: {
      type: Boolean,
      default: true
    },
    pageNum: {
      type: Number,
      default: 1
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.pageNum
      },
      set(val) {
        this.$emit('update:pageNum', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        if (this.total < val * this.currentPage) {
          this.currentPage = 1
        }
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(size) {
      this.$emit('pagination', { pageNum: this.currentPage, limit: size })
    },
    handleCurrentChange(pageNum) {
      this.$emit('pagination', { pageNum: pageNum, limit: this.pageSize })
    }
  }
}
</script>
<style lang="scss">
.pagination {
 .el-pagination__editor.el-input{
  width: 56px !important;
} 
}
</style>
