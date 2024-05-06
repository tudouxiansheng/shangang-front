<template>
  <div class="custom-table">
    <div class="table-wrapper" ref="tableWrapper">
      <div class="table-main">
        <el-table
          ref="customTable"
          :data="data"
          :row-class-name="rowClass || tableRowClassName"
          :header-row-class-name="headerRowClassName"
          style="width: 100%"
          :row-key="rowKey"
          class="custom-table"
          :border="border"
          default-expand-all
          :max-height="Height"
          :show-summary="showSummary"
          :summary-method="summaryMethod"
          :tree-props="treeProps"
          @selection-change="handleSelectionChange"
          @row-click="handleRowClick"
          @sort-change="handleSortChange"
        >
          <slot></slot>
          <div slot="empty" :style="emptyStyle">
            <slot name="empty">
              <div class="ak-card-list-empty-wrapper">
                <div class="ak-card-list-empty">
                  <slot name="empty">{{ $t('public.empty') }}</slot>
                </div>
              </div>
            </slot>
          </div>
        </el-table>
      </div>
    </div>
    <div class="custom-pager">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNo"
        :page-sizes="pageSizes"
        :page-size="listQuery.pageSize"
        :layout="layout"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Custom-Table',
  props: {
    headerRowClassName: {
      type: String,
      default: 'custom-table-header',
    },
    border: {
      type: Boolean,
      default: false,
    },
    showSummary: {
      type: Boolean,
      default: false,
    },
    summaryMethod: {
      type: Function,
      default() {
        return () => {}
      },
    },
    rowClass: {
      type: Function,
    },
    treeProps: {
      type: Object,
      default() {
        return { children: 'children', hasChildren: 'hasChildren' }
      },
    },
    rowKey: {
      type: String,
      default: 'id',
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
    total: {
      type: Number,
      default: 0,
    },
    listQuery: {
      type: Object,
      default() {
        return {
          pageNo: 1,
          pageSize: 10,
        }
      },
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper',
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 30, 50, 100]
      },
    },
  },
  data() {
    return {
      Height: '300px',
    }
  },
  computed: {
    emptyStyle() {
      return {
        height: this.Height,
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(this.$refs.tableWrapper)
      this.Height = `${this.$refs.tableWrapper.clientHeight - 50}px`
    })
  },
  methods: {
    handleSortChange(params) {
      this.$emit('sort-change', params)
    },
    // 表格斑马纹
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 === 1) {
        return ''
      } else {
        return 'success-row'
      }
    },
    renderHeaderBorder(args) {
      const ColorMap = [
        '#A6B9D3',
        '#59C7F9',
        '#7CB0FF',
        '#48D5B2',
        '#FFC36D',
        '#FF7E7E',
        '#ef7eff',
        '#7fff4c',
        '#33ffe7',
        '#A6B9D3',
        '#59C7F9',
        '#7CB0FF',
        '#48D5B2',
        '#FFC36D',
        '#FF7E7E',
        '#ef7eff',
        '#7fff4c',
        '#33ffe7',
      ]
      return {
        color: '#ccc',
        borderTop: `5px solid ${ColorMap[args.columnIndex]}`,
      }
    },
    handleSizeChange(pageSize) {
      this.$emit('size-change', pageSize)
    },
    handleCurrentChange(pageNo) {
      this.$emit('current-change', pageNo)
    },
    handleSelectionChange(row) {
      this.$emit('selection-change', row)
    },
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, this.data, column, event)
    },
  },
}
</script>

<style lang="scss" scoped>
.custom-table {
  font-family: 'PingFang-Medium';
  height: 100%;
  background-color: transparent;
  .ak-card-list-empty-wrapper {
    position: relative;
    width: 100%;
    height: calc(100% - 50px);
  }
  .ak-card-list-empty {
    text-align: center;
    padding: 20px;
    color: #fff;
    position: absolute;
    font-size: 18px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .table-wrapper {
    /* position: absolute; */
    flex: 1;
    width: 100%;
    height: calc(100% - 80px);
    .table-main {
      border-bottom: 1px solid #156c9e;
    }
    ::v-deep.el-table__body-wrapper {
      height: 100%;
      padding-bottom: 1px;
      box-sizing: border-box;

    }
    ::v-deep.el-table--enable-row-hover {
      .el-table__body tr:hover > td.el-table__cell {
        background-color: #175290;
      }
    }
    ::v-deep.el-table {
      color: #eee;
      &.el-table--border::after {
        background-color: #156c9e;
      }
      &.el-table--group::after {
        background-color: #156c9e;
      }
      &.el-table::before {
        background-color: #156c9e;
      }
      &.el-table--border {
        border-color: #156c9e;
      }
      .success-row {
        background: rgba(8, 55, 83, 0.5);
      }
      .el-table__row {
        td {
          height: 50px;
          border-color: #156c9e;
        }
      }
      .custom-table-header {
        background: transparent;

        th {
          background: transparent;
          border-color: #156c9e;
        }
      }
    }
  }

  .custom-pager {
    /* position: absolute; */
    width: 100%;
    margin-top: 20px;
    text-align: center;
    ::v-deep.el-pagination {
      .btn-next {
        background-color: transparent;
        color: #fff;
      }
      .btn-prev {
        background-color: transparent;
        color: #fff;
      }
      button {
        &:disabled {
          color: #606266;
          background-color: transparent;
        }
      }
      .el-pager {
        li {
          background-color: transparent;
          color: #eee;
          &.active {
            color: #409eff;
            cursor: default;
          }
        }
      }
      .el-pagination__jump {
        color: #fff;
      }
      .el-pagination__total {
        color: #fff;
      }
    }
  }
}
</style>
