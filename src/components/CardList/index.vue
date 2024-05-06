<template>
  <div class="ak-card-list">
    <!--卡片列表组件-->
    <div
      v-if="list.length && !this.currentLoading"
      :class="colProps.isCol ? '' : 'custom-flex'"
      class="ak-card-list-wrapper"
      ref="listWrapper"
    >
      <el-row v-bind="rowProps" v-if="colProps.isCol">
        <el-col v-for="(item, index) in list" :key="index" v-bind="colProps" :style="colStyle">
          <slot
            v-bind="{
              item,
              index,
              pageNo: currentPage,
              pageSize: currentPageSize,
              total: currentTotal,
              columns: currentColumn,
            }"
          >
            {{ item }}
          </slot>
        </el-col>
      </el-row>
      <div class="card-no-col" v-else v-for="(item, index) in list" :key="index" :style="colProps">
        <div class="card-no-col-item">
          <slot
            v-bind="{
              item,
              index,
              pageNo: currentPage,
              pageSize: currentPageSize,
              total: currentTotal,
              columns: currentColumn,
            }"
          >
            {{ item }}
          </slot>
        </div>
      </div>
    </div>
    <!--数据加载中...-->
    <div v-if="currentLoading" class="ak-card-list-loading">
      <slot name="loading">{{ $t('public.loading') }}</slot>
    </div>
    <!--数据为空-->
    <div v-if="!currentLoading && !list.length" class="ak-card-list-empty-wrapper">
      <div class="ak-card-list-empty">
        <slot name="empty">{{ $t('public.empty') }}</slot>
      </div>
    </div>
    <!--列表底部自定义内容-->
    <div v-if="$slots.append" class="ak-card-list-append">
      <slot name="append" />
    </div>
    <!-- 分页 -->
    <div class="ak-pager">
      <Pagination
        v-if="pager"
        ref="pager"
        :prev-text="$t('public.prev')"
        :next-text="$t('public.next')"
        class="ak-card-list-pager"
        v-bind="pagerProps"
        :total="total"
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="pageSizes"
        @size-change="handlePageSizeChange"
        @current-change="handlePageChange"
      >
        <div class="slot-default">
          <button
            type="button"
            @click="jumpFirstPage"
            :class="{ disabled: currentTotal <= 0, active: pageNo == 1 && currentTotal > 0 }"
            class="btn-first"
          >
            首页
          </button>
          <button
            type="button"
            @click="jumpLastPage"
            :class="{ disabled: currentTotal <= 0 || totalPageNum == 1, active: pageNo > 1 && pageNo == totalPageNum }"
            class="btn-last"
          >
            尾页
          </button>
        </div>
      </Pagination>
    </div>
  </div>
</template>

<script>
import { Pagination } from 'element-ui'
import responsive, { responsiveArray } from '@/utils/responsive'

// 分页组件默认配置
const defaultPagerProps = {
  background: true,
  layout: 'total,prev,pager,next,sizes',
}
export default {
  name: 'Index',
  components: {
    Pagination,
  },
  props: {
    data: Array,
    columns: {
      type: [Number, Object],
      default: 3,
      // validator(val) {
      //   return typeof val === 'number' ? 24 % val === 0 : true
      // },
    },
    pageNo: {
      type: Number,
      default: 1,
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40, 50, 100]
      },
    },
    pageSize: {
      type: Number,
      default: 12,
    },
    total: {
      type: Number,
      default: 0,
    },
    pager: {
      type: [Boolean, Object],
    },
    auto: {
      type: Boolean,
      default: true,
    },
    gutter: {
      type: Number,
      default: 12,
    },
    loading: Boolean,
  },
  data() {
    return {
      list: [],
      screens: {},
      currentColumn: 3,
      currentPage: this.pageNo,
      currentTotal: this.total,
      currentPageSize: this.pageSize,
      currentLoading: this.loading,
      token: '',
      isCol: true,
    }
  },
  computed: {
    totalPageNum() {
      return Math.ceil(this.total / this.pageSize)
    },
    rowProps() {
      return {
        gutter: this.gutter,
      }
    },
    colProps() {
      if (!(24 % this.currentColumn)) {
        return {
          isCol: true,
          span: Math.floor(24 / this.currentColumn),
        }
      } else {
        return {
          isCol: false,
          width: `${100 / this.currentColumn}%`,
        }
      }
    },
    colStyle() {
      return {
        paddingBottom: `${this.gutter}px`,
      }
    },
    pagerProps() {
      return {
        ...defaultPagerProps,
        ...this.pager,
        total: this.total,
      }
    },
  },
  mounted() {},
  watch: {
    data: {
      handler(val = []) {
        this.list = Object.freeze(val.slice(0))
      },
      immediate: true,
    },
    loading: {
      handler(val) {
        this.currentLoading = val
      },
      immediate: true,
    },
    columns: {
      handler(val) {
        if (24 % val) {
          this.setupResponsive()
          this.currentColumn = this.getResponsiveValue()
        } else {
          this.currentColumn = val
        }
      },
      immediate: true,
    },
    screens() {
      this.currentColumn = this.getResponsiveValue()
    },
    pagerProps: {
      handler(props) {
        this.currentPage = props.currentPage
        this.currentTotal = props.total
        this.currentPageSize = props.pageSize
        // this.auto && this.$nextTick(this.load)
      },
      immediate: true,
    },
  },
  methods: {
    // 开启响应式
    setupResponsive() {
      this.token && responsive.off(this.token)
      if (typeof this.columns !== 'object') {
        return
      }
      this.token = responsive.on((screens) => {
        this.screens = screens
      })
    },
    // 获取当前响应式列数
    getResponsiveValue() {
      const columns = this.columns
      const defaultValue = 3
      if (!columns) return defaultValue
      // 参数是对象类型，即开启响应式
      if (typeof columns === 'object') {
        for (let i = 0; i < responsiveArray.length; i++) {
          const breakpoint = responsiveArray[i]
          if (this.screens[breakpoint]) {
            return columns[breakpoint] || defaultValue
          }
        }
      }
      // 数字类型
      return columns
    },
    jumpFirstPage() {
      this.handlePageChange(1)
    },
    jumpLastPage() {
      this.handlePageChange(this.totalPageNum)
    },
    handlePageChange(page) {
      this.currentPage = page
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.scrollTop = 0
      }
      this.$emit('page-change', page, this.currentPageSize)
    },
    handlePageSizeChange(size) {
      this.currentPage = 1
      this.currentPageSize = size
      if (this.$refs.listWrapper) {
        this.$refs.listWrapper.scrollTop = 0
      }

      this.$emit('size-change', size)
    },
  },
}
</script>

<style scoped lang="scss">
.ak-card-list {
  height: calc(100% - 80px);
  &-wrapper {
    overflow-y: auto;
    overflow-x: hidden;
    height: calc(100% - 50px);
    &.custom-flex {
      display: flex;
      align-content: flex-start;
      flex-wrap: wrap;
    }
    .card-no-col {
      .card-no-col-item {
        margin: 12px;
      }
    }
  }
  &-empty-wrapper {
    position: relative;
    width: 100%;
    height: calc(100% - 50px);
  }
  &-empty {
    text-align: center;
    padding: 20px;
    color: #fff;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  &-loading {
    text-align: center;
    padding: 20px;
  }
  &-pager {
    margin-top: 12px;
    text-align: center;
  }
}
::v-deep.el-pagination {
  position: relative;
  padding: 2px 0 2px 50px;
  .el-pagination__total {
    color: #fff;
  }

  &.is-background {
    .btn-prev,
    .btn-next,
    .btn-first,
    .btn-last {
      background-color: transparent;
      color: #e6e6e6;
      border: 1px solid #aaa;
      padding: 0 8px;
      box-sizing: border-box;
    }
    ul.el-pager li.number,
    ul.el-pager li.el-icon-more {
      background-color: transparent;
      color: #e6e6e6;
      border: 1px solid #aaa;
      &.active {
        color: #00ccff;
        border: 1px solid #00ccff;
      }
    }
  }

  .slot-default {
    display: inline-block;
    width: 60px;
  }

  .btn-first {
    position: absolute;
    top: 50%;
    left: 0;
    border-radius: 2px;
    margin: -14px 5px 0;
    color: #606266;

    &.disabled {
      color: #c0c4cc;
    }

    &.active {
      background-color: #8398ca;
      color: #fff;
    }
  }

  .btn-last {
    border-radius: 2px;
    margin: 0 5px;
    color: #606266;

    &.disabled {
      color: #c0c4cc;
    }

    &.active {
      background-color: #8398ca;
      color: #fff;
    }
  }
}
</style>
