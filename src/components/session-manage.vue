<template>
  <el-dialog
    :title="$t('session.sessionManage')"
    v-model="dialogVisible"
    top="10vh"
    width="1300px"
    class="session-manage"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-row>
      <el-col :span="24">
        <div class="btnMargin">
          <!-- 创建 -->
          <el-button
            type="primary"
            @click="batchSignOut"
            v-if="sessionHasPermi"
            :disabled="batchBtnShow"
          >
            {{ $t('session.batchSignBack') }}
          </el-button>
        </div>
        <!-- 搜索条件 -->
        <div class="search-form">
          <el-form
            :inline="true"
            class="demo-form-inline"
            ref="form"
            :model="sessionSearchInfo"
            label-position="left"
            :label-width="locale == 'en' ? '160px' : '90px'"
          >
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="22" :xl="22">
                <!-- 客户端类型 -->
                <el-form-item :label="$t('session.cuType') + '：'" prop="type">
                  <el-select v-model="sessionSearchInfo.type" clearable>
                    <el-option :label="$t('session.all')" value="" />
                    <el-option
                      v-for="item of cuTypeOption"
                      :key="item.value"
                      :label="item.name"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
                <!-- 登录IP -->
                <el-form-item :label="$t('session.loginIp') + '：'" prop="loginIp">
                  <el-input
                    v-model="sessionSearchInfo.loginIp"
                    clearable
                    :placeholder="$t('session.plInputloginIp')"
                  />
                </el-form-item>
                <!-- 登录时间 -->
                <el-form-item :label="$t('session.createTime') + '：'" prop="createTime">
                  <el-date-picker
                    v-model="sessionSearchInfo.createTime"
                    @change="createTimeChange"
                    format="YYYYY-MM-DD HH:mm:ss"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    type="datetimerange"
                    :range-separator="$t('session.to')"
                    :start-placeholder="$t('session.startTime')"
                    :end-placeholder="$t('session.endTime')"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="2" :xl="2">
                <!-- 搜索 -->
                <div class="search-btn">
                  <el-button type="primary" class="miniBtn" @click="handleFind">
                    {{ $t('public.search') }}
                  </el-button>
                  <el-button type="info" class="miniBtn" @click="handleRest">
                    {{ $t('session.rest') }}
                  </el-button>
                </div>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <no-table :tableLoading="loading" :tableData="tableData" :tableStyle="tableStyle">
          <el-table
            v-if="!loading && tableData.length"
            max-height="630"
            :row-class-name="tableRowClassName"
            ref="multipleTable"
            :data="tableData"
            @selection-change="handleSelectionChange"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column label width="50" type="selection" />
            <!-- 客户端类型 -->
            <el-table-column
              :label="$t('session.cuType')"
              prop="cuTypeName"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 登录IP -->
            <el-table-column
              :label="$t('session.loginIp')"
              prop="loginIp"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 登录时间 -->
            <el-table-column
              :label="$t('session.createTime')"
              prop="createTime"
              min-width="120"
              show-overflow-tooltip
            />
            <!-- 会话时长 -->
            <el-table-column
              :label="$t('session.duration')"
              prop="duration"
              min-width="120"
              show-overflow-tooltip
            />

            <el-table-column
              :label="$t('public.operating')"
              min-width="130"
              fixed="right"
              v-if="sessionHasPermi"
            >
              <template #default="{ row }">
                <!-- 查看 -->
                <span class="cell-operate" @click="handleSignOut(row)">
                  {{ $t('session.signOut') }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!--分页-->
          <pagination
            v-if="!loading && tableData.length"
            :total="totalNum"
            v-model:pageNum="pageNum"
            v-model:limit="pageSize"
            @pagination="getListByPage"
          />
        </no-table>
      </el-col>
    </el-row>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('session.closed') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { permissions } from '@/utils/common/permissions'
export default {
  props: {
    createVisible: {
      type: Boolean,
      default: false
    },
    sessionDate: {
      type: Object
    },
    sessionFlag: {
      type: String
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      tableStyle: 'width:100%;height: 400px',
      // 搜索条件
      sessionSearchInfo: {
        loginIp: undefined,
        type: '',
        createTime: undefined,
        beginTime: undefined,
        endTime: undefined
      },
      // 表格信息
      tableData: [],
      dataText: '',
      loading: false,
      // 分页
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      multipleSelection: [],
      batchBtnShow: true,
      sessionHasPermi: true
    }
  },
  computed: {
    ...mapState({
      cuTypeOption: state => state.dict['cu-type'] // 客户端类型
    }),
    dialogVisible: {
      get() {
        return this.createVisible
      },
      set(val) {
        this.$emit('update:createVisible', val)
      }
    }
  },
  mounted() {
    this.getDictionary()
  },
  methods: {
    //打开弹框
    dialogOpen() {
      this.$nextTick(async () => {
        
        this.getSessionList()
        this.session()
      })
    },
    dialogClosed() {
      this.dialogVisible = false
      // 循环置空对象属性（避免重新创建空间或者形成冗余代码（如下））
      Object.keys(this.sessionSearchInfo).forEach(key => {
        this.sessionSearchInfo[key] = undefined
      })
      this.sessionSearchInfo.type = ''
    },
    ...mapActions('dict', ['getSysDictData']),
    getDictionary() {
      this.getSysDictData(['cu-type'])
    },
    session() {
      switch (this.sessionFlag) {
        case 'tenant':
          this.sessionHasPermi = permissions(76)
          break
        case 'user':
          this.sessionHasPermi = permissions(68)
          break
        case 'admin':
          this.sessionHasPermi = permissions(70)
          break
      }
    },
    getTime(time) {
      // 转换为天时分秒
      let d = parseInt(time / 60 / 60 / 24)
      let h = parseInt((time / 60 / 60) % 24)
      h = h < 10 ? '0' + h : h
      let m = parseInt((time / 60) % 60)
      m = m < 10 ? '0' + m : m
      let s = parseInt(time % 60)
      s = s < 10 ? '0' + s : s
      // 作为返回值返回
      return `${d}${this.$t('session.days')}${h}${this.$t('session.hours')}${m}${this.$t(
        'session.minutes'
      )}${s}${this.$t('session.second')}`
    },
    getSessionList() {
      let { type, loginIp, beginTime, endTime } = this.sessionSearchInfo
      this.loading = true
      let obj = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        userId: this.sessionDate.userId ? this.sessionDate.userId : this.sessionDate.adminUserId,
        type,
        loginIp,
        beginTime,
        endTime
      }
      this.$api
        .getSessionList(obj)
        .then(res => {
          if (res.sessionList && res.sessionList.length) {
            res.sessionList.forEach(item => {
              item.duration = this.getTime(item.duration)
            })
            this.tableData = res.sessionList
            this.totalNum = res.pageInfo.totalNum
          } else {
            this.tableData = []
            this.totalNum = 0
          }
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    //状态
    cuTypeFormat(data) {
      return this.selectDictLabel(this.cuTypeOption, data, {
        key: 'name',
        value: 'value'
      })
    },
    // 表格斑马纹
    tableRowClassName({ rowIndex }) {
      return rowIndex % 2 == 1 ? '' : 'success-row'
    },
    //改变创建时间
    createTimeChange(val) {
      let { createTime } = this.sessionSearchInfo
      if (val) {
        this.sessionSearchInfo.beginTime = createTime[0]
        this.sessionSearchInfo.endTime = createTime[1]
      } else {
        this.sessionSearchInfo.beginTime = ''
        this.sessionSearchInfo.endTime = ''
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      this.batchBtnShow = val.length ? false : true
    },
    batchSignOut() {
      this.$confirm(this.$t('session.sessionNum', { num: this.multipleSelection.length }), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          for (let i = 0; i < this.multipleSelection.length; i++) {
            let item = this.multipleSelection[i]
            this.$api
              .signOutSession({
                userId: item.userId,
                sessionId: item.sessionId
              })
              .then(res => {
                if (res.resultCode == 0 && i == this.multipleSelection.length - 1) {
                  this.$message({
                    type: 'success',
                    message: this.$t('session.batchSignOutSuccess')
                  })
                  this.getSessionList()
                }
              })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('session.cancelBatchSignOut')
          })
        })
    },
    //签退
    handleSignOut(data) {
      this.$confirm(`${this.$t('session.isSignOutSession')}`, this.$t('session.tips'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning',
        closeOnClickModal: false
      })
        .then(() => {
          this.$api
            .signOutSession({
              userId: data.userId,
              sessionId: data.sessionId
            })
            .then(res => {
              if (res && res.resultCode === 0) {
                this.$message.success(this.$t('session.signOutSuccess'))
                this.getSessionList()
              } else {
                this.$message.error(this.$t('session.signOutError'))
              }
            })
            .catch(() => {
              this.$message.error(this.$t('session.signOutError'))
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('session.cancelSignOut')
          })
        })
    },
    //重置
    handleRest() {
      this.pageNum = 1
      // 循环置空对象属性（避免重新创建空间或者形成冗余代码（如下））
      Object.keys(this.sessionSearchInfo).forEach(key => {
        this.sessionSearchInfo[key] = undefined
      })
      this.sessionSearchInfo.type = ''
      this.getSessionList()
    },
    //搜索
    handleFind() {
      this.pageNum = 1
      this.getSessionList()
    },
    // 分页
    getListByPage() {
      this.getSessionList()
    }
  }
}
</script>

<style lang="scss">
.session-manage {
  .el-dialog__body {
    padding: 0 40px;
    .search-btn {
      position: absolute;
      right: 0;
      bottom: 40px;
    }
  }
  .el-date-editor .el-range-separator {
    padding: 1px 5px 0 0 !important;
    color: #666;
    width: 23px;
  }
  .el-range-editor--small .el-range-input {
    background: transparent;
    color: #262626;
  }
}
</style>
