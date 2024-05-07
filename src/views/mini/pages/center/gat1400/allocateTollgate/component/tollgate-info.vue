<template>
  <el-dialog
    :title="$t('cascadeDevice.bayonetDetails')"
    v-model="$parent.dialogvisible_detail"
    top="10vh"
    :width="locale == 'en' ? '1400px' : '1000px'"
    :close-on-click-modal="false"
    class="bayonetDetailDialogAll"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="locale == 'en' ? '370px' : '184px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('platformManagement.Affiliation') + ':'">
            <span>{{ form.platName }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.bayoneNname') + ':'">
            <span>{{ form.name }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.installationLocation') + ':'">
            <span>{{ form.place }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.longitude') + ':'">
            <span>{{ form.longitude }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.bayonetPurpose') + ':'">
            <span>{{ $parent.setTollgateCat2(form.tollgateCat2) }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.bayonetType') + ':'">
            <span>{{ $parent.setTollgateCat(form.tollgateCat) }}</span>
          </el-form-item>

          <el-form-item :label="$t('deviceManagement.organizationName') + ':'">
            <span>{{ form.managementName }}</span>
          </el-form-item>
        </div>
        <div class="form-right">
          <el-form-item :label="$t('platformManagement.organizationCode') + ':'">
            <span>{{ form.platId }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.bayonetCode') + ':'">
            <span>{{ form.tollgateID }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.installationLocationRegion') + ':'">
            <span>{{ form.placeCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.latitude') + ':'">
            <span>{{ form.latitude }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.bayonetStatus') + ':'">
            <span>{{ $parent.setStatus(form.status) }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.enableTime') + ':'">
            <span>{{ form.activeTime }}</span>
          </el-form-item>
          <el-form-item :label="$t('deviceManagement.jurisdictionCode') + ':'">
            <span>{{ form.orgCode }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>

    <!-- //车道详情 -->
    <el-dialog
      :title="$t('platformManagement.laneDetails')"
      v-model="laneInfoVisible"
      top="10vh"
      width="1060px"
      :close-on-click-modal="false"
      :modal="false"
      draggable
    >
      <div
        style="height: 600px"
        v-loading="loading"
        :element-loading-text="$t('public.loading')"
        
      >
        <div v-if="!loading && !tableData.length" class="tableNOdata">
          <img src="@/assets/img/common/NOdata.png" alt />
          <p>{{ $t('public.noData') }}</p>
        </div>
        <div class="laneInfoDiv" v-if="!loading && tableData.length">
          <el-table
            max-height="556"
            :row-class-name="$parent.tableRowClassName"
            ref="laneInfoTable"
            :data="tableData"
            border
          >
            <template #empty>
              <span>{{ dataText }}</span>
            </template>
            <el-table-column
              :label="$t('deviceManagement.laneName')"
              min-width="110"
              show-overflow-tooltip
              prop="name"
            >
              <template #default="{ row }">
                <span>{{ row.name }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.laneID')"
              min-width="110"
              show-overflow-tooltip
              prop="laneId"
            >
              <template #default="{ row }">
                <span>{{ row.laneId }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.belongBayonet')"
              min-width="100"
              show-overflow-tooltip
            >
              <template>
                <span>{{ $parent.choosedTollgateName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.laneNumber')"
              min-width="65"
              show-overflow-tooltip
              prop="drive"
            >
              <template #default="{ row }">
                <span>{{ row.laneNo }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.laneDirection')"
              min-width="60"
              show-overflow-tooltip
              prop="mainDevType"
            >
              <template #default="{ row }">
                <span>{{ $parent.setDirection(row.direction) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.leavingTheCity')"
              min-width="65"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ $parent.setCityPass(row.cityPass) }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.deviceID')"
              min-width="65"
              show-overflow-tooltip
            >
              <template #default="{ row }">
                <span>{{ row.apeID }}</span>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('deviceManagement.modificationTime')"
              min-width="90"
              show-overflow-tooltip
              prop="createTime"
            >
              <template #default="{ row }">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!--分页-->
        <div
          class="pagination"
          v-if="!loading && tableData.length"
          style="padding-left: 22px; padding-right: 22px"
        >
          <div class="paging">
            <span>{{ $t('public.everyPageShows') }}</span>
            <el-select v-model="number" @change="numberChange">
              <el-option
                v-for="(item, index) in numberList"
                :key="index"
                :label="item"
                :value="index"
              ></el-option>
            </el-select>
            <span>{{ $t('public.records') }}</span>
          </div>

          <div>
            <el-pagination
              v-model:current-page="pageNum"
              :page-size="pageSize"
              layout="total, prev, pager, next, jumper"
              :total="totalNum"
              @current-change="handleCurrentChange"
              background
            />
          </div>
        </div>
      </div>
    </el-dialog>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {},
      //1400参数
      laneInfoVisible: false,
      tableData: [
        {
          mainDevId: '11111'
        }
      ],
      dataText: '',
      pageNum: 1,
      pageSize: 10,
      totalNum: 0, // 总数量
      number: 0,
      numberList: [10, 20, 30, 40, 50, 100, 500], //每页显示数量,
      loading: false
    }
  },
  methods: {
    setData() {
      this.dataText = this.$t('platformManagement.noData')
    },
    setDirection(val) {
      let name = ''
      this.$parent.directionList.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    },
    async showLaneInfo() {
      await this.getLaneList()
      this.laneInfoVisible = true
    },
    async getLaneList() {
      let data = {
        pageInfo: {
          pageNum: this.pageNum,
          pageSize: this.pageSize
        },
        laneMatch: {
          tollgateID: this.$parent.choosedTollgateID
        }
      }
      let res = await this.$api.getLanesForPage(data)
      if (res.resultCode == 0) {
        this.tableData = res.laneInfoList
        this.totalNum = res.pageInfo.totalNum
        this.loading = false
      } else {
        this.tableData = []
        this.totalNum = 0
        this.dataText = this.$t('public.noData')
        this.loading = false
      }
    },
    // 分页每页条数 !
    numberChange(val) {
      this.pageSize = this.numberList[val]
      // 如果数量小于分页*每页条数，分页恢复为1
      if (this.totalNum < this.pageSize * this.pageNum) {
        this.pageNum = 1
      }
      this.getLaneList()
    },
    // 分页输入跳转页数 !
    handleCurrentChange(val) {
      this.pageNum = val
      this.getLaneList()
    },
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = this.$parent.detailForm
        this.setData()
      })
    },
    dialogClosed() {
      this.$parent.dialogvisible_detail = false
      this.$parent.detailForm = {}
    },
    setManufacturer(val) {
      let name = ''
      this.$parent.manufacturerData.filter(item => {
        if (val == item.value) {
          name = item.name
        }
      })
      return name
    }
  }
}
</script>

<style lang="scss">
.bayonetDetailDialogAll {
  .el-dialog__body {
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      line-height: 24px;
      padding-right: 0;
    }
    .el-form-item__content {
      line-height: 24px;
    }
  }
  .laneInfoDiv {
    padding: 0px 22px;
  }
}
</style>
