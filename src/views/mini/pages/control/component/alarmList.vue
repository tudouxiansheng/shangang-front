<template>
  <div class="alarm-list">
    <div class="filter-wrapper">
      <el-form :inline="true" :model="filterForm">
        <el-form-item :label="$t('public.startTime')">
          <el-date-picker
            v-model="filterForm.beginTime"
            type="datetime"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :placeholder="$t('public.startTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('public.endTime')">
          <el-date-picker
            v-model="filterForm.endTime"
            type="datetime"
            default-time="23:59:59"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="pickerOptions"
            :placeholder="$t('public.endTime')"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch" class="miniBtn">{{ $t('public.search') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <CardList
      :data="tableData"
      :total="total"
      :page-size="listQuery.pageSize"
      :page-no="listQuery.pageNo"
      :page-sizes="[9, 18, 30, 50, 100]"
      :pager="true"
      @page-change="handlePageChange"
      @size-change="handleSizeChange"
    >
      <template slot-scope="{ item }">
        <div class="alarm-content" @click.stop="handleDetail(item)">
          <div class="alarm-img">
            <img :src="item.captureImage" alt="" />
          </div>
          <div class="alarm-detail">
            <div class="alarm-detail-item">
              <div class="item-label" :class="isZh ? '' : 'en'">
                {{ item.repositoryType == 1 ? $t('application.plateNum') : $t('home.name') }}：
              </div>
              <div class="item-value">{{ item.repositoryType == 1 ? item.lpn : item.personName }}</div>
            </div>
            <div class="alarm-detail-item">
              <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.library') }}：</div>
              <div class="item-value" :title="item.repositoryName">{{ item.repositoryName }}</div>
            </div>
            <div class="alarm-detail-item">
              <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('alarm.alarmDevice') }}：</div>
              <div class="item-value" :title="item.deviceName">{{ item.deviceName }}</div>
            </div>
            <div class="alarm-detail-item">
              <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('alarm.alarmTime') }}：</div>
              <div class="item-value" :title="item.hitTime">{{ item.hitTime }}</div>
            </div>
          </div>
        </div>
      </template>
    </CardList>
    <alarmDetail :info="detailRow" :visible="detailDialogVisible" @close="handleCloseDetailDialog"></alarmDetail>
  </div>
</template>

<script>
import CardList from '../../../../../components/CardList'
import alarmDetail from './alarmDetail'
import { getGuardHitList } from '../../../../../utils/api'

export default {
  name: 'alarmInfo',
  props: {
    guardId: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    CardList,
    alarmDetail,
  },
  data() {
    return {
      pickerOptions: {
        // selectableRange: (() => {
        //   let data = new Date()
        //   let hour = data.getHours()
        //   let minute = data.getMinutes()
        //   let second = data.getSeconds()
        //   return [`00:00:00-${hour}:${minute}:${second}`]
        // })(),
        disabledDate(time) {
          //Date.now()是javascript中的内置函数，它返回自1970年1月1日00:00:00 UTC以来经过的毫秒数。
          return time.getTime() > Date.now()
        },
      },
      tableData: [],
      total: 0,
      detailDialogVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 9,
      },
      filterForm: {
        beginTime: '',
        endTime: '',
      },
      detailRow: {},
    }
  },
  watch: {
    visible() {
      this.handleGetList()
    },
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  mounted() {
    this.handleGetList()
  },
  methods: {
    handleCloseDetailDialog() {
      this.detailDialogVisible = false
      this.detailRow = {}
    },
    handleDetail(item) {
      console.log(item)
      this.detailRow = { ...item }
      this.detailDialogVisible = true
    },
    handleSearch() {
      if (this.filterForm.beginTime && !this.filterForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (!this.filterForm.beginTime && this.filterForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      // if (new Date(this.filterForm.endTime).getTime() > new Date().getTime()) {
      //   this.$message.warning(this.$t('public.endGtCur'))
      //   return
      // }
      if (new Date(this.filterForm.beginTime).getTime() > new Date(this.filterForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      this.listQuery.pageNo = 1
      this.handleGetList()
    },
    handleGetList() {
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        },
        ...this.filterForm,
        guardIds: [this.guardId],
      }
      Object.keys(params).map((key) => {
        if (params[key] == '') {
          delete params[key]
        }
      })
      getGuardHitList(params).then((res) => {
        if (res.resultCode === 0) {
          if (res.guardHitList) {
            this.tableData = res.guardHitList
          } else {
            this.tableData = []
          }
          this.total = res.pageInfo.totalNum
        }
      })
    },
    handlePageChange(pageNo) {
      this.listQuery.pageNo = pageNo
      this.handleGetList()
    },
    handleSizeChange(size) {
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = size
      this.handleGetList()
    },
  },
}
</script>

<style scoped lang="scss">
.alarm-list {
  height: calc(100% - 50px);
}
.alarm-content {
  display: flex;
  background-color: rgba(32, 75, 116, 0.5);
  padding: 20px;
  box-sizing: border-box;
  border-radius: 4px;
  align-items: center;
  .alarm-img {
    width: 90px;
    height: 80px;
    margin-right: 10px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .alarm-detail {
    flex: 1;
    overflow: hidden;
    .alarm-detail-item {
      display: flex;
      margin-bottom: 5px;
      .item-label {
        width: 70px;
        margin-right: 5px;
        white-space: nowrap;
        color: #ccc;
        text-align: right;
        &.en {
          width: 110px;
        }
      }
      .item-value {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
