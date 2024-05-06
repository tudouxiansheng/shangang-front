<template>
  <div class="visitor-wrapper">
    <div class="filter-wrapper">
      <el-form :inline="true" :model="filterForm">
        <el-form-item :label="$t('visitor.visitorName')">
          <el-input
            class="sm-input"
            v-model.trim="filterForm.visitorName"
            :placeholder="$t('visitor.visitorName')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('visitor.visitorMobile')">
          <el-input
            class="sm-input"
            v-model="filterForm.visitorMobile"
            :placeholder="$t('visitor.visitorMobile')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('visitor.intervieweeName')" v-if="isSec || isAdmin">
          <el-input v-model.trim="filterForm.intervieweeName" :placeholder="$t('visitor.intervieweeName')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('visitor.reason')">
          <el-select
            class="filter-m-s"
            :popper-append-to-body="false"
            v-model="filterForm.visitType"
            :placeholder="$t('visitor.reason')"
          >
            <el-option :label="$t('public.all')" value=""></el-option>
            <el-option
              v-for="(item, index) in visitTypeList"
              :key="index"
              :label="isZh ? item.label : item.labelEn"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('visitor.auditStatus')">
          <el-select
            class="filter-m-s"
            :popper-append-to-body="false"
            v-model="filterForm.auditStatus"
            :placeholder="$t('visitor.auditStatus')"
          >
            <el-option :label="$t('public.all')" value=""></el-option>
            <el-option
              v-for="item in auditTypeList"
              :label="isZh ? item.label : item.labelEn"
              :value="item.value"
              :key="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <!--        <el-form-item label="安保审核状态">-->
        <!--          <el-select-->
        <!--            class="filter-m-s"-->
        <!--            :popper-append-to-body="false"-->
        <!--            v-model="filterForm.securityAuditType"-->
        <!--            placeholder="请选择审核状态"-->
        <!--          >-->
        <!--            <el-option label="全部" value=""></el-option>-->
        <!--            <el-option-->
        <!--              v-for="item in auditTypeList"-->
        <!--              :label="item.label"-->
        <!--              :value="item.value"-->
        <!--              :key="item.value"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <!--        <el-form-item :label="$t('visitor.visitStatus')">-->
        <!--          <el-select-->
        <!--            class="filter-m-s"-->
        <!--            :popper-append-to-body="false"-->
        <!--            v-model="filterForm.visitStatus"-->
        <!--            :disabled="filterForm.auditStatus != 1"-->
        <!--            :placeholder="$t('visitor.visitStatus')"-->
        <!--          >-->
        <!--            <el-option :label="$t('public.all')" value=""></el-option>-->
        <!--            <el-option-->
        <!--              v-for="(item, index) in visitStatusList"-->
        <!--              :key="index"-->
        <!--              :label="isZh ? item.label : item.labelEn"-->
        <!--              :value="item.value"-->
        <!--            ></el-option>-->
        <!--          </el-select>-->
        <!--        </el-form-item>-->
        <el-form-item :label="$t('public.startTime')">
          <el-date-picker
            v-model="filterForm.startTime"
            type="datetime"
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
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="23:59:59"
            :placeholder="$t('public.endTime')"
          >
          </el-date-picker>
        </el-form-item>
        <div class="visitor-tools">
          <el-button type="primary" v-if="isSec" @click="handleAddVisitor">{{ $t('visitor.addVisitor') }}</el-button>
          <el-button type="primary" @click="handleExportVisitor">{{ $t('visitor.exportVisitor') }}</el-button>
          <el-button type="primary" @click="handleSearch">{{ $t('public.search') }}</el-button>
          <el-button type="default" @click="handleReset">{{ $t('public.reset') }}</el-button>
        </div>
      </el-form>
    </div>
    <div class="visitor-content">
      <CardList
        :data="tableData"
        :total="total"
        :pageNo="listQuery.pageNo"
        :pageSize="listQuery.pageSize"
        :pageSizes="[15, 30, 50, 100]"
        :pager="true"
        :columns="5"
        @page-change="handlePageChange"
        @size-change="handleSizeChange"
      >
        <template slot-scope="{ item }">
          <div class="visitor-list-item" @click="clickVisitDetail(item)">
            <div class="visitor-item">
              <div class="status" :class="item.auditStatus == 2 ? '' : item.auditStatus == 1 ? 'active' : 'info'">
                {{
                  item.auditStatus == 1
                    ? $t('visitor.pass')
                    : item.auditStatus == 2
                    ? $t('visitor.reject')
                    : $t('visitor.audit')
                }}
              </div>
              <div class="left">
                <div class="pic">
                  <img v-if="item.facePhoto" :src="item.facePhoto" alt="" />
                </div>
              </div>
              <div class="right">
                <div class="item">
                  <div class="label">{{ $t('visitor.visitorName') }}:</div>
                  <div class="value" :title="item.visitorName">{{ item.visitorName }}</div>
                </div>
                <div class="item">
                  <div class="label">{{ $t('visitor.reason') }}:</div>
                  <div class="value">{{ item.visitType | formatType(that) }}</div>
                </div>
                <div class="item">
                  <div class="label">{{ $t('visitor.intervieweeName') }}:</div>
                  <div class="value" :title="item.intervieweeName">{{ item.intervieweeName }}</div>
                </div>
                <div class="item">
                  <div class="label">{{ $t('visitor.createTime') }}:</div>
                  <div v-if="item.sourceType == 1" class="value" :title="item.createTime">
                    {{ item.createTime }}
                  </div>
                  <div v-else class="value opt">
                    <span class="time" :title="item.createTime">{{ item.createTime }}</span>
                    <div class="btn" v-if="(isSec || isAdmin) && item.auditStatus == 3 && item.auditType == 3">
                      <i class="el-icon-edit" v-if="false" @click.stop="handleEdit(item)"></i>
                      <i class="el-icon-delete" @click.stop="handleDelete(item)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </CardList>
    </div>
    <addVisitor
      :visible="addVisitorVisible"
      :addVisitorOrDetail="addVisitorOrDetail"
      :info="ruleForm"
      @close="handleCloseDialog"
    ></addVisitor>
  </div>
</template>

<script>
import CardList from '../../../../components/CardList'
import { getVistorList, visitorInfo, exportVisitor } from '@/utils/api'
import addVisitor from './addVisitor.vue'
import { deleteVisitor, getLoginUserInfo } from '../../../../utils/api'
export default {
  name: 'index',
  components: {
    CardList,
    addVisitor,
  },
  data() {
    return {
      that: this, //保存this以便filter中使用
      addVisitorOrDetail: 1,
      //1.待入园；2.已入园；3.已出园
      visitStatusList: [
        {
          label: '未到访',
          labelEn: 'Not Visited',
          value: 1,
        },
        {
          label: '访问中',
          labelEn: 'Visiting',
          value: 2,
        },
        {
          label: '已结束',
          labelEn: 'Over',
          value: 3,
        },
      ],
      visitTypeList: [
        {
          label: '外卖',
          labelEn: 'Takeout',
          value: 1,
        },
        {
          label: '保洁',
          labelEn: 'Cleaning',
          value: 2,
        },
        {
          label: '快递配送',
          labelEn: 'Express delivery',
          value: 3,
        },
        {
          label: '维修施工',
          labelEn: 'Maintenance construction',
          value: 4,
        },
        {
          label: '面试',
          labelEn: 'Interview',
          value: 5,
        },
        {
          label: '其他',
          labelEn: 'Other',
          value: 6,
        },
      ],
      //1.通过；2.驳回；3.未审核
      auditTypeList: [
        {
          label: '已通过',
          labelEn: 'Pass',
          value: 1,
        },
        {
          label: '已拒绝',
          labelEn: 'Reject',
          value: 2,
        },
        {
          label: '待审核',
          labelEn: 'Audit',
          value: 3,
        },
      ],
      filterDate: [],
      filterForm: {
        visitorName: '',
        visitorMobile: '',
        visitStatus: '',
        intervieweeName: '',
        auditStatus: '',
        securityAuditType: '',
        visitType: '',
        startTime: '',
        endTime: '',
      },
      tableData: [],
      total: 0,
      listQuery: {
        pageNo: 1,
        pageSize: 15,
      },
      addVisitorVisible: false,
      isSec: false,
      isAdmin: false,
      ruleForm: {},
    }
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  created() {
    let str = sessionStorage.getItem('roleId')
    if (!str) {
      getLoginUserInfo({}).then((res) => {
        if (res.userInfo?.roleId) {
          str = res.userInfo.roleId
          if (str) {
            this.isSec = str.split(',').indexOf('00000000000000000403009999999991') != -1
            this.isAdmin = str.split(',').indexOf('00000000000000000403000000000000') != -1
          }
          this.handleFetchVisitList()
        }
      })
    } else {
      this.isSec = str.split(',').indexOf('00000000000000000403009999999991') != -1
      this.isAdmin = str.split(',').indexOf('00000000000000000403000000000000') != -1
      this.handleFetchVisitList()
    }
  },
  filters: {
    formatType(val, that) {
      // let visitMap = {
      //   1: '外卖',
      //   2: '保洁',
      //   3: '快递配送',
      //   4: '维修施工',
      //   5: '面试',
      //   6: '其他',
      // }
      let res = that.visitTypeList.filter((item) => item.value == val)
      return res && res.length ? (that.isZh ? res[0].label : res[0].labelEn) : '-'
    },
  },
  methods: {
    handleEdit(item) {
      console.log(item)
    },
    handleDelete(item) {
      console.log(item)
      this.$confirm(this.$t('visitor.deleteVisitor'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
      })
        .then(() => {
          let params = {
            deleteList: [item.recordId],
          }
          deleteVisitor(params).then((res) => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.success'),
              })
              this.listQuery.pageNo = 1
              this.handleFetchVisitList()
            }
          })
        })
        .catch((err) => err)
    },
    handleReset() {
      this.filterForm = {
        visitorName: '',
        visitorMobile: '',
        visitStatus: '',
        intervieweeName: '',
        auditStatus: '',
        visitType: '',
        startTime: '',
        endTime: '',
      }
      this.listQuery.pageNo = 1
      this.handleFetchVisitList()
    },
    handleSearch() {
      if (this.filterForm.startTime && !this.filterForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.endTime')}`)
        return
      }
      if (!this.filterForm.startTime && this.filterForm.endTime) {
        this.$message.warning(`${this.$t('public.please')}${this.$t('public.startTime')}`)
        return
      }
      if (new Date(this.filterForm.startTime).getTime() > new Date(this.filterForm.endTime).getTime()) {
        this.$message.warning(this.$t('public.startGtEnd'))
        return
      }
      this.listQuery.pageNo = 1
      this.handleFetchVisitList()
    },
    //访客列表
    handleFetchVisitList() {
      let params = {
        pageInfo: {
          pageNum: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
        },
        ...this.filterForm,
      }
      if (!this.isAdmin && !this.isSec) {
        params.intervieweeMobile = sessionStorage.getItem('account')
        params.personType = 2
      }
      Object.keys(params).map((key) => {
        if (params[key] == '') {
          delete params[key]
        }
      })
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      getVistorList(params)
        .then((res) => {
          loading.close()
          if (res.resultCode == 0) {
            this.tableData = res.resultList
            this.total = res.pageInfo.totalNum
          }
        })
        .catch(() => {
          loading.close()
        })
    },
    //访客详情
    clickVisitDetail(row) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      visitorInfo({
        recordId: row.recordId,
      }).then((res) => {
        loading.close()
        console.log(res, 'res')
        if (res.resultCode == 0) {
          this.ruleForm = res.info
          this.addVisitorVisible = true
          this.addVisitorOrDetail = 2
        }
      })

      this.recordId = row.recordId
    },
    handleExportVisitor() {
      console.log(this.filterForm)
      let params = {
        ...this.filterForm,
      }
      if (!this.isSec && !this.isAdmin) {
        params.intervieweeMobile = sessionStorage.getItem('account')
      }
      const loading = this.$loading({
        lock: true,
        text: this.$t('public.loading'),
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      exportVisitor(params)
        .then((res) => {
          loading.close()
          if (res.resultCode === 0) {
            if (res.downloadUrl) {
              // downloadUrl
              let downFileHref = res.downloadUrl
              const body = document.querySelector('body')
              const a = document.createElement('a')
              a.setAttribute('href', downFileHref)
              a.setAttribute('download', '访客列表')
              a.style.display = 'none'
              body.appendChild(a)
              a.click()
              body.removeChild(a)
              window.URL.revokeObjectURL(downFileHref)
            } else {
              this.$message.warning(this.$t('visitor.exportEmpty'))
            }
          }
          console.log(res)
        })
        .catch(() => {
          loading.close()
        })
    },
    handleAddVisitor() {
      this.addVisitorVisible = true
      this.addVisitorOrDetail = 1
    },
    handleCloseDialog(flag = false) {
      if (flag) {
        this.handleSearch()
      }
      this.ruleForm = {}
      this.addVisitorVisible = false
    },
    handlePageChange(pageNo) {
      this.listQuery.pageNo = pageNo
      this.handleFetchVisitList()
    },
    handleSizeChange(size) {
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = size
      this.handleFetchVisitList()
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep.el-time-panel__footer {
  display: none;
}
.visitor-wrapper {
  //background-color: red;
  width: 1700px;
  height: calc(100% - 20px);
  margin: 40px auto 0;
  //background: url('../../../../assets/passway/800.png') no-repeat;
  //background-size: 100% 100%;
  //height: 780px;
  //padding: 40px 30px;
  box-sizing: border-box;
  .filter-wrapper {
    position: relative;
    .el-form-item {
      margin-right: 20px;
      .el-input,
      .el-select,
      .el-date-editor {
        width: 200px;
      }
    }
    .sm-input {
      // width: 160px;
    }
    .visitor-tools {
      position: absolute;
      right: 20px;
      top: 50px;
    }
  }
  .filter-m-s {
    width: 120px;
  }
  .visitor-tools {
    margin-bottom: 10px;
  }
  .visitor-content {
    height: calc(100% - 60px);
    padding: 20px 0;
    box-sizing: border-box;
    .visitor-list-item {
      padding: 5px;
      box-sizing: border-box;
      .visitor-item {
        background-color: #173252;
        box-shadow: 0 0 5px #1b3f69;
        color: #fff;
        display: flex;
        align-items: center;
        padding: 12px;
        box-sizing: border-box;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        .status {
          position: absolute;
          top: 8px;
          right: -24px;
          padding: 5px 0;
          width: 90px;
          font-size: 12px;
          text-align: center;
          box-sizing: border-box;
          background-color: rgb(255, 77, 79);
          transform: rotate(45deg);
          opacity: 0.8;
          &.active {
            background: #17cd57;
          }
          &.info {
            background-color: #909399;
          }
        }
        .left {
          margin-right: 10px;
          .pic {
            width: 90px;
            height: 80px;
            background-color: #ccc;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .right {
          font-size: 12px;
          flex: 1;
          overflow: hidden;
          &:hover {
            .item {
              .value {
                &.opt {
                  .btn {
                    display: block;
                  }
                }
              }
            }
          }
          .item {
            display: flex;
            color: #ddd;
            margin-bottom: 5px;
            .label {
              margin-right: 5px;
              color: #ccc;
              white-space: nowrap;
            }
            .value {
              overflow: hidden;
              white-space: nowrap;
              /*文字超出宽度则显示ellipsis省略号*/
              text-overflow: ellipsis;
              &.opt {
                display: flex;
                overflow: hidden;
                .time {
                  overflow: hidden;
                  white-space: nowrap;
                  /*文字超出宽度则显示ellipsis省略号*/
                  text-overflow: ellipsis;
                }
                .btn {
                  display: none;
                  margin-left: 5px;
                  box-sizing: border-box;
                  flex: 1;
                  font-size: 12px;
                  .el-icon-edit {
                    margin-right: 10px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
