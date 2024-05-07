<template>
  <div class="pagination">
    <div class="paging">
      <span class="el-pagination__total">{{ $t('pagination.realTotal') }}：{{ realTotal }}</span>
      <span class="el-pagination__total">{{ $t('pagination.currentTotal') }}：{{ total }}</span>
    </div>

    <div class="flex">
      <button
        type="button"
        class="btn-pager"
        :disabled="currentPage === 1"
        @click="handlePagerBtnClick(1)"
      >
        {{ $t('pagination.frontPage') }}
      </button>
      <el-pagination
        @current-change="handleCurrentChange"
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :layout="layout"
        :total="total"
        :background="background"
        :prevText="$t('pagination.prevPage')"
        :nextText="$t('pagination.nextPage')"
      />
      <button
        type="button"
        class="btn-pager"
        :disabled="currentPage === pageCount"
        @click="handlePagerBtnClick(pageCount)"
      >
        {{ $t('pagination.lastPage') }}
      </button>
      <button
        v-show="searchBtnVisible"
        type="button"
        class="btn-pager"
        @click="handleSearchBtnClick"
      >
        {{ $t('pagination.continueToSearch') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    total: {
      type: Number,
      required: true
    },
    realTotal: {
      type: Number,
      required: true
    },
    layout: {
      type: String,
      default: 'prev, pager, next'
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
    },
    max: {
      type: Number,
      default: 10000
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
    },
    pageCount() {
      return Math.ceil(this.total / this.pageSize)
    },
    searchBtnVisible() {
      return this.currentPage === this.pageCount
    }
  },
  methods: {
    handleSizeChange(size) {
      this.$emit('pagination', { pageNum: this.currentPage, limit: size })
    },
    handleCurrentChange(pageNum) {
      this.$emit('pagination', { pageNum: pageNum, limit: this.pageSize })
    },
    handlePagerBtnClick(pageNum) {
      this.currentPage = pageNum
      this.handleCurrentChange(pageNum)
    },
    handleSearchBtnClick() {
      this.$emit('continueSearch')
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  .paging {
    line-height: 32px;
  }
  .btn-pager {
    margin: 2px 0px;
  }
  .btn-pager + .btn-pager {
    margin-left: 10px;
  }
  button {
    display: inline-block;
    font-size: 13px;
    height: 28px;
    line-height: 28px;
    vertical-align: top;
    box-sizing: border-box;
    padding: 0 8px;
    border: 1px solid #aaaaaa;
    border-radius: 4px;
    &:disabled {
      cursor: not-allowed;
      color: #c0c4cc;
    }
  }
  :deep(.el-pagination) {
    .btn-prev,
    .btn-next {
      padding: 0 8px;
      border: 1px solid #aaaaaa;
      border-radius: 4px;
    }
    .el-pager li {
      border: 1px solid #aaaaaa;
      border-radius: 4px;
    }
  }
}
</style>
