<template>
  <div class="face-pass">
    <div class="face-pass_filter">
      <el-form inline :model="filterForm" ref="sform">
        <el-form-item :label="$t('traffic.name')" prop="personName">
          <el-input v-model="filterForm.personName" :placeholder="$t('traffic.name')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('traffic.head')" prop="inOutType">
          <el-select v-model="filterForm.inOutType">
            <el-option :label="$t('public.all')" value=""></el-option>
            <el-option :label="$t('passageway.in')" :value="1"></el-option>
            <el-option :label="$t('passageway.out')" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('traffic.deviceName')" prop="deviceName">
          <el-input
            v-model="filterForm.deviceName"
            :placeholder="$t('passageway.enterName', { type: $t('traffic.deviceName') })"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('public.startTime')" prop="startTime">
          <el-date-picker
            v-model="filterForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
            :clearable="false"
            :editable="false"
            :picker-options="pickerOptions"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('public.endTime')" prop="endTime">
          <el-date-picker
            v-model="filterForm.endTime"
            :picker-options="pickerOptions"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            :clearable="false"
            :editable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
          <el-button @click="handleReset">{{ $t('public.reset') }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-button type="primary" @click="exportPersonList">{{ $t('public.export') }}</el-button>
    <span class="tips">提示：最大可以导出5000条数据</span>
    <div class="face-pass_table">
      <CustomTable
        :data="tableData"
        :total="total"
        :listQuery="listQuery"
        :pager="true"
        stripe
        border
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <el-table-column :label="$t('patrol.order')" width="60" type="index" align="center" show-overflow-tooltip>
          <template slot-scope="{ $index }">
            {{ listQuery.pageSize * (listQuery.pageNo - 1) + $index + 1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" prop="personName" :label="$t('traffic.name')">
          <template slot-scope="scope">
            <div v-if="scope.row.personName">{{ scope.row.personName }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="personType" :label="$t('traffic.personType')">
          <template slot-scope="scope">
            <div v-if="scope.row.personType == 1">{{ $t('traffic.personType1') }}</div>
            <div v-else-if="scope.row.personType == 2">{{ $t('traffic.personType2') }}</div>
            <div v-else-if="scope.row.personType == 3">{{ $t('traffic.personType3') }}</div>
            <div v-else-if="scope.row.personType == 4">{{ $t('traffic.personType4') }}</div>
            <div v-else-if="scope.row.personType == 5">{{ $t('traffic.personType5') }}</div>
            <div v-else-if="scope.row.personType == 6">{{ $t('traffic.personType6') }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" show-overflow-tooltip prop="verifyModeName" :label="$t('traffic.openType')">
          <!-- <template slot-scope="scope">
            <div v-if="scope.row.authType == 0">{{ $t('traffic.accessType1') }}</div>
            <div v-if="scope.row.authType == 1">{{ $t('traffic.accessType2') }}</div>
            <div v-if="scope.row.authType == 2">{{ $t('traffic.accessType3') }}</div>
            <div v-if="scope.row.authType == 3">{{ $t('traffic.accessType4') }}</div>
            <div v-if="scope.row.authType == 4">{{ $t('traffic.accessType5') }}</div>
            <div v-if="scope.row.authType == 5">{{ $t('traffic.accessType6') }}</div>
          </template> -->
        </el-table-column>
        <el-table-column align="center" prop="cardNo" :label="$t('traffic.number')">
          <template slot-scope="scope">
            <div v-if="scope.row.cardNo">{{ scope.row.cardNo }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" :label="$t('traffic.snapshot')">
          <template slot-scope="scope">
            <img class="table-img" :src="scope.row.snapPhotoUrl || defaultUrl" v-viewer alt="" />
          </template>
        </el-table-column>
        <el-table-column align="center" prop="inOutType" :label="$t('traffic.head')">
          <template slot-scope="scope">
            <div v-if="scope.row.inOutType == 1">{{ $t('passageway.in') }}</div>
            <div v-else-if="scope.row.inOutType == 2">{{ $t('passageway.out') }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="areaName" :label="$t('traffic.deviceName')">
          <template slot-scope="scope">
            <div v-if="scope.row.channelName">{{ scope.row.channelName }}</div>
            <div v-else>--</div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="eventTime" :label="$t('traffic.time')"></el-table-column>
      </CustomTable>
    </div>
  </div>
</template>

<script>
import { download } from '@/utils/download'
import CustomTable from '../../../../../components/CustomTable'
import { getPeopleRecognize, getDevPos, exportPerson } from '../../../../../utils/api'
import Dayjs from '@/utils/Dayjs'
export default {
  name: 'facePass',
  components: {
    CustomTable,
  },
  data() {
    return {
      defaultUrl: require('@/assets/xingren.png'),
      filterForm: {
        personName: '',
        inOutType: '',
        deviceName: '',
        startTime: Dayjs(new Date()).format('YYYY-MM-DD 00:00:00'),
        endTime: Dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      },
      tableData: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 10,
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
      },
      locationList: [],
      timer: null,
    }
  },
  created() {
    this.handleGetList()
  },
  mounted() {
    this.getDevPosition()
  },
  methods: {
    handlePageChange(pageNo) {
      this.listQuery.pageNo = pageNo
      this.handleGetList()
    },
    handleSizeChange(size) {
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = size
      this.handleGetList()
    },
    handleReset() {
      this.$refs.sform.resetFields()
      this.filterForm.endTime = Dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.handleSearch()
    },
    handleSearch() {
      this.listQuery.pageNo = 1
      this.handleGetList()
    },
    handleGetList() {
      if (new Date(this.filterForm.startTime).getTime() > new Date(this.filterForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        },
        ...this.filterForm,
      }
      //   Object.keys(params).map((item) => {
      //     if (params[item] == '') {
      //       delete params[item]
      //     }
      //   })
      getPeopleRecognize(params).then((res) => {
        if (res.resultCode == 0) {
          this.tableData = res.doorRecognitionInfos || []
          this.total = res.pageInfo.totalNum
        }
      })
    },
    getDevPosition(val) {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
      this.timer = setTimeout(() => {
        getDevPos({
          pageInfo: {
            pageNum: 1,
            pageSize: 10,
          },
          installLocation: val,
        }).then((res) => {
          this.locationList = res.locationList
        })
      }, 200)
    },
    exportPersonList() {
      exportPerson({
        // pageInfo: {
        //     pageNum: this.listQuery.pageNo,
        //     pageSize: this.listQuery.pageSize,
        // },
        ...this.filterForm,
      }).then((res) => {
        if (res.resultCode == 0) {
          download(res.fileUrl, 'person-record')
        }
      })
    },
  },
}
</script>

<style scoped lang="scss">
.face-pass {
  background-color: transparent;
  box-sizing: border-box;
  width: 1700px;
  height: 100%;
  margin: 20px auto;
  position: relative;
  &_filter {
    ::v-deep.el-form {
      .el-slider {
        width: 140px;
      }
    }
    .filter-m-s {
      width: 120px;
    }
  }
  &_table {
    width: 100%;
    height: calc(100% - 150px);
    margin-top: 20px;
    clear: both;
  }
  .table-img {
    width: 20px;
    height: 20px;
  }
  .tips {
    color: #b6b6b6;
    font-size: 12px;
    margin-left: 20px;
  }
}
</style>
