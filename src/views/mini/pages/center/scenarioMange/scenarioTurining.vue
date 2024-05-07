<template>
  <div id="scenario-turning">
    <collapse-card :title="$t('scenarioMange.createTurningTitle')" hideCollapse>
      <el-form
        :model="form"
        :rules="formRules"
        ref="form"
        label-width="105px"
        :label-position="locale === 'en' ? 'top' : 'left'"
      >
        <el-row :gutter="20" style="margin-bottom: 20px">
          <el-col :span="12">
            <el-form-item :label="$t('scenarioMange.turningName') + ':'" prop="turningName">
              <el-input
                v-model="form.turningName"
                :placeholder="$t('scenarioMange.turningNameProp')"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('scenarioMange.turningInterval') + ':'" prop="turningInterval">
              <el-input-number v-model="form.turningInterval" :min="10" :max="600" />
              {{ $t('scenarioMange.turningIntervalTip') }}
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item
              :label="$t('scenarioMange.selectedScenarioList') + ':'"
              prop="selectedScenarioList"
            >
              <el-select
                v-model="form.selectedScenarioList"
                multiple
                clearable
                :placeholder="$t('scenarioMange.selectedScenarioListProp')"
              >
                <el-option
                  v-for="item in scenarioList"
                  :key="item.scenarioId"
                  :label="item.scenarioName"
                  :value="item.scenarioId"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <div class="mt-10 text-center">
          <el-button
            class="confirm-button"
            type="primary"
            :loading="loading"
            @click="confirmHandle"
          >
            {{ $t('public.add') }}
          </el-button>
          <el-button type="info" @click="cancelHandle">{{ $t('public.reset') }}</el-button>
        </div>
      </el-form>
    </collapse-card>
    <collapse-card :title="$t('scenarioMange.turningListTitle')" hideCollapse>
      <el-table :data="tableData" border max-height="285px">
        <template #empty>
          <span>{{ $t('public.noData') }}</span>
        </template>
        <el-table-column
          :label="$t('scenarioMange.turningName')"
          prop="turningName"
          show-overflow-tooltip
          width="250"
        />
        <el-table-column
          :label="$t('scenarioMange.scenarioList')"
          prop="scenarioList"
          show-overflow-tooltip
        >
          <template #default="{ row }">
            <span>
              {{ row.scenarioList && row.scenarioList.map(item => item.scenarioName).join('、') }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('scenarioMange.turningInterval')"
          prop="turningInterval"
          show-overflow-tooltip
        />
        <el-table-column :label="$t('scenarioMange.isEnabled')" prop="isEnabled">
          <template #default="scope">
            <el-switch
              v-model="scope.row.isEnabled"
              :active-value="1"
              :inactive-value="0"
              @change="() => isEnabledChange(scope.row, scope.$index)"
            />
          </template>
        </el-table-column>
        <el-table-column :label="$t('public.operating')">
          <template #default="{ row }">
            <span class="danger cell-operate" @click="handleDelete(row)">
              {{ $t('public.delete') }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </collapse-card>
  </div>
</template>
<script>
import CollapseCard from '@/components/collapse-card.vue'

import routeJump from '@/mixin/route-jump.js' //路由跳转
import { getListAllData } from '@/utils/common/utils'

export default {
  name: 'PrePlanRoundTour',
  components: { CollapseCard },
  mixins: [routeJump],
  data() {
    return {
      form: {
        turningName: undefined,
        turningInterval: undefined,
        selectedScenarioList: []
      },
      tvWallId: this.$route.params.tvWallId,
      loading: false,
      formRules: {
        turningName: [
          { required: true, message: this.$t('scenarioMange.turningNameProp'), trigger: 'change' },
          {
            pattern: /^(?![-_])[\u4e00-\u9fa5-_a-zA-Z0-9]{1,32}(?<![-_])$/,
            message: this.$t('scenarioMange.turningNameError'),
            trigger: 'change'
          }
        ],
        turningInterval: [
          {
            required: true,
            message: this.$t('scenarioMange.turningIntervalProp'),
            trigger: 'change'
          }
        ],
        selectedScenarioList: [
          {
            required: true,
            message: this.$t('scenarioMange.selectedScenarioListProp'),
            trigger: 'change'
          }
        ]
      },
      scenarioList: [],
      tableData: [],
      tvWallScenarioTurningList: []
    }
  },
  computed: {},
  watch: {},

  mounted() {
    this.getTvWallScenarioList()
    this.getTvWallScenarioTurningList()
  },
  methods: {
    // 获取电视墙预案列表
    async getTvWallScenarioList() {
      const obj = {
        tvWallId: this.tvWallId,
        pageInfo: {
          pageNum: 1,
          pageSize: 500
        }
      }
      this.scenarioList = await getListAllData('getTvWallScenarioList', obj, 'tvWallScenarioList')
    },
    confirmHandle() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let obj = JSON.parse(JSON.stringify(this.form))
          obj.scenarioList = obj.selectedScenarioList.map((item, index) => {
            return {
              scenarioId: item,
              sort: index
            }
          })
          delete obj.selectedScenarioList
          const res = await this.$api.addTvWallScenarioTurningInfo(obj)
          this.getTvWallScenarioTurningList()
          if (res.resultCode == 0) {
            this.$message({
              message: this.$t('scenarioMange.turningAddSuccess'),
              type: 'success'
            })
          }
        }
      })
    },
    cancelHandle() {
      this.$refs.form.resetFields()
    },
    async getTvWallScenarioTurningList() {
      const obj = {
        tvWallId: this.tvWallId,
        pageInfo: {
          pageNum: 1,
          pageSize: 500
        }
      }
      this.tableData = await getListAllData(
        'getTvWallScenarioTurningList',
        obj,
        'tvWallScenarioTurningList'
      )
    },
    async isEnabledChange(row, index) {
      const flag = this.getIsEnabledFlag()
      const obj = {
        turningId: row.turningId,
        isEnabled: row.isEnabled
      }
      if (row.isEnabled && flag) {
        this.$confirm(this.$t('scenarioMange.onlyOneTurning'), this.$t('public.prompt'), {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
          type: 'warning'
        })
          .then(() => {
            this.enableTvWallScenarioTurningInfo(obj)
          })
          .catch(() => {
            this.tableData[index].isEnabled = 0
            this.$message({
              type: 'info',
              message: this.$t('scenarioMange.cancelTurning')
            })
          })
      } else {
        this.enableTvWallScenarioTurningInfo(obj)
      }
    },
    async enableTvWallScenarioTurningInfo(obj) {
      const res = await this.$api.enableTvWallScenarioTurningInfo(obj)
      if (res.resultCode == 0) {
        this.getTvWallScenarioTurningList()
        obj.isEnabled
          ? this.$message({
              message: this.$t('scenarioMange.enabledTurningSuccess'),
              type: 'success'
            })
          : this.$message({
              message: this.$t('scenarioMange.stopTurningSuccess'),
              type: 'success'
            })
        const params = {
          tvWallId: this.tvWallId,
          ...obj
        }
        this.$webkitProc('tvwall_scenario_turning_info', JSON.stringify(params))
      }
    },

    getIsEnabledFlag() {
      const arr = this.tableData.filter(item => item.isEnabled == 1)
      return arr.length > 1
    },
    handleDelete(row) {
      this.$confirm(this.$t('scenarioMange.deleteTurningWarn'), this.$t('public.prompt'), {
        confirmButtonText: this.$t('public.confirm'),
        cancelButtonText: this.$t('public.cancel'),
        type: 'warning'
      })
        .then(async () => {
          const res = await this.$api.deleteTvWallScenarioTurningInfo({
            turningId: row.turningId
          })
          if (res.resultCode == 0) {
            this.getTvWallScenarioTurningList()
            this.$message({
              message: this.$t('scenarioMange.deleteTurningSuccess'),
              type: 'success'
            })
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('scenarioMange.cancelDeleteTurning')
          })
        })
    },
    closeFun(closeType) {
      this.$refs['form'].resetFields()
      let param = {
        closeType //1:取消 2：保存  3.关闭
      }
      this.$webkitProc('close_dialog', JSON.stringify(param))
    }
  }
}
</script>
<style lang="scss">
#scenario-turning {
  height: 100%;
  width: 100%;
  background: #fff;
  color: #606266;

  .el-input-number--small {
    width: 40%;
  }

  .el-input {
    height: 34px;
  }

  .el-form-item {
    display: flex;
    align-items: flex-start;
  }

  .el-select--small {
    width: 100%;
  }

  .el-input .el-input__wrapper {
    border: 1px solid #d2d2d2;
    background: #f2f2f2;
    color: #262626;
    &::placeholder {
      color: #999;
    }
  }
  .el-input .el-input__inner {
    background: #f2f2f2;
    border: 0px solid #d2d2d2;
    color: #262626;
  }
  .el-table th,
  .el-table th.el-table__cell,
  .el-table tr {
    background: transparent;
  }
  .el-table--border .el-table__inner-wrapper::after,
  .el-table--border::after,
  .el-table--border::before,
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
  .el-table td.el-table__cell,
  .el-table th.el-table__cell.is-leaf {
    border-bottom: 1px solid #d9d9d9 !important;
  }
  .el-table--border td,
  .el-table--border th {
    border-right: 1px solid #d9d9d9 !important;
  }
  .el-input.is-disabled .el-input__wrapper {
    background-color: #bfbfbf;
  }

  .el-table th,
  .el-table tr {
    background-color: #fff;
  }
  .el-table__empty-block {
    background: #fff;
  }
  .el-table__empty-text {
    color: #606266;
  }
  .el-table {
    thead {
      color: #909399;
      font-weight: 500;
    }
    tbody {
      color: #606266;
    }
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #f5f7fa !important;
  }

  .el-form-item__label {
    color: #000;
  }
  .el-radio__label {
    color: #000;
  }
  .el-input-number__decrease,
  .el-input-number__increase {
    background: transparent;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #409eff;
  }
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1 !important;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background-color: #a8a8a8 !important;
  }

  // 定义滚动条轨道 边角
  ::-webkit-scrollbar-corner {
    background-color: #f1f1f1 !important;
  }
}
</style>
