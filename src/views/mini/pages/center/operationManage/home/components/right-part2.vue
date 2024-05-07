<template>
  <div>
    <collapse-card
      :title="$t('operateManage.userReport')"
      hideCollapse
      background
      backgroundColor="#0A314F"
    >
      <template #operate>
        <span class="more" @click="searchMore">{{ $t('operateManage.viewMore') }} ></span>
      </template>
      <div v-loading="loading">
        <ul v-if="tableData.length > 0" class="flex flex-col pt-0">
          <li v-for="(item, index) in tableData" :key="index" class="list-item-class">
            <div class="truncate">
              <el-tooltip class="item" effect="light" :content="item.devName" placement="top-start">
                <span>{{ item.devName }}</span>
              </el-tooltip>
            </div>
            <div class="mt-1 flex justify-between">
              <span>{{ item.faultTypeName }}</span>
              <span>{{ item.createTime }}</span>
            </div>
          </li>
        </ul>
        <ul v-else class="flex flex-col pt-0">
          <el-empty :description="$t('public.noData')"></el-empty>
        </ul>
      </div>
    </collapse-card>
  </div>
</template>

<script>
import collapseCard from '../../component/collapse-card.vue'
import { mapState } from 'vuex'
import routeJump from '@/mixin/route-jump.js' //路由跳转

export default {
  components: { collapseCard },
  mixins: [routeJump],
  data() {
    return {
      loading: false,
      searchForm: {
        faultSource: 1,
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      },
      tableData: []
    }
  },
  computed: {
    ...mapState({
      userReportFaultTypeData: state => state.dict.user_report_fault_type
    })
  },
  mounted() {
    this.getFaultList()
  },
  methods: {
    searchMore() {
      let path = '/devOps/fault-workbench',
        routerPush = {
          name: 'FaultWorkbench',
          params: {
            activeName: '1'
          }
        }
      this.routeJump(path, routerPush)
    },
    async getFaultList() {
      this.loading = true
      let res = await this.$api.getFaultList(this.searchForm)
      if (res.resultCode == 0) {
        this.loading = false
        let tableData = res.faultList
        tableData.forEach(item => {
          item.faultTypeName = this.faultTypeFormatter(item.faultType)
        })
        this.tableData = tableData
      }
    },
    faultTypeFormatter(faultType) {
      return this.selectDictLabel(this.userReportFaultTypeData, faultType)
    }
  }
}
</script>

<style lang="scss" scoped>
.more {
  font-size: 14px;
  color: #2c6dd2;
  @apply cursor-pointer;
}
ul {
  height: 348px;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none; /* Chrome Safari */
  }
  li {
    position: relative;
    height: 65px;
    border-top: 1px solid #48535a;
    padding: 10px 10px 10px 30px;
    color: #fff;
    &::before {
      position: absolute;
      top: 16px;
      left: 0;
      content: '';
      margin-right: 8px;
      width: 8px;
      height: 8px;
      border-radius: 4px;
      background: #2c6dd2;
    }
  }
}
</style>
