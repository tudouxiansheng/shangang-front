<template>
  <div id="scenario-plan">
    <el-form :model="form" :rules="formRules" ref="form">
      <el-form-item :label="$t('scenarioMange.isEnabled1') + ':'" prop="isEnabled">
        <el-switch
          v-model="form.isEnabled"
          :active-value="1"
          :inactive-value="0"
          @change="enableTvWallScenarioPlanInfo"
        />
      </el-form-item>
      <el-form-item :label="$t('scenarioMange.planType') + ':'" prop="planType">
        <el-radio-group v-model="form.planType">
          <el-radio :label="0">{{ $t('scenarioMange.week') }}</el-radio>
          <el-radio :label="1">{{ $t('scenarioMange.day') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <PlanTime
        ref="planTime"
        :props="timeSpanListTemplate"
        :planList="periodList"
        :planType="form.planType"
        :optionList="scenarioList"
        :alertMessage="$t('scenarioMange.rightClickWarn')"
        :tip="$t('scenarioMange.tip')"
        @timeListChange="planList = $event"
      />
      <div class="mt-10 text-center">
        <el-button type="info" @click="cancelHandle">{{ $t('public.cancel') }}</el-button>
        <el-button class="confirm-button" type="primary" :loading="loading" @click="confirmHandle">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import PlanTime from '@/components/plan-time.vue'
import routeJump from '@/mixin/route-jump.js' //路由跳转
import { getListAllData } from '@/utils/common/utils'

export default {
  name: 'ScenarioPlan',
  components: { PlanTime },
  mixins: [routeJump],
  data() {
    return {
      form: {
        isEnabled: 0,
        planId: undefined,
        planType: undefined
      },
      tvWallId: this.$route.params.tvWallId,
      loading: false,
      scenarioList: [],
      formRules: {
        planType: [
          {
            required: true,
            message: this.$t('scenarioMange.planTypeProp'),
            trigger: 'change'
          }
        ]
      },
      periodList: [],
      timeSpanListTemplate: {
        label: 'label',
        timeList: 'timeInfos',
        startTime: 'startTime',
        endTime: 'stopTime',
        optionLabel: 'scenarioName',
        optionValue: 'scenarioId',
        selectedOptionValue: 'scenarioId'
      },
      planList: [],
      isAdd: true
    }
  },
  computed: {},
  watch: {},

  mounted() {
    this.getTvWallScenarioList()
    this.getTvWallScenarioPlanList()
  },
  methods: {
    rightClick() {
    },
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
      this.scenarioList.push({
        scenarioName: this.$t('public.delete'),
        scenarioId: 'delete'
      })
    },
    async getTvWallScenarioPlanList() {
      const obj = {
        tvWallId: this.tvWallId,
        pageInfo: {
          pageNum: 1,
          pageSize: 10
        }
      }
      const res = await this.$api.getTvWallScenarioPlanList(obj)
      if (res.resultCode == 0) {
        if (res.tvWallScenarioPlanList && res.tvWallScenarioPlanList.length) {
          this.isAdd = false
          this.form.planId = res.tvWallScenarioPlanList[0].planId
          this.form.planType = res.tvWallScenarioPlanList[0].planType
          this.form.isEnabled = res.tvWallScenarioPlanList[0].isEnabled
          this.periodList = res.tvWallScenarioPlanList[0].periodList
        } else {
          this.isAdd = true
        }
      }
    },

    confirmHandle() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.scenarioList.length == 0)
            return this.$alert(this.$t('scenarioMange.noSetScenario'), this.$t('public.confirm'))
          const flag = this.$refs.planTime.validateList()
          if (!flag) return
          if (this.isAdd) {
            const obj = {
              planName: this.$t('scenarioMange.preliminaryPlan'),
              planType: this.form.planType,
              periodList: this.planList,
              isEnabled: this.form.isEnabled
            }
            const res = await this.$api.addTvWallScenarioPlanInfo(obj)
            if (res.resultCode == 0) {
              this.$message({
                message: this.$t('scenarioMange.planAddSuccess'),
                type: 'success'
              })
            }
          } else {
            const obj = {
              planId: this.form.planId,
              planName: this.$t('scenarioMange.preliminaryPlan'),
              planType: this.form.planType,
              periodList: this.planList
            }
            const res = await this.$api.modifyTvWallScenarioPlanInfo(obj)
            if (res.resultCode == 0) {
              this.$message({
                message: this.$t('scenarioMange.planEditSuccess'),
                type: 'success'
              })
            }
          }
          await this.$refs.planTime.resetForm()
          this.getTvWallScenarioPlanList()
          this.closeFun(2)
        }
      })
    },
    cancelHandle() {
      this.closeFun(1)
    },
    async enableTvWallScenarioPlanInfo() {
      if (!this.form.planId) return
      const obj = {
        planId: this.form.planId,
        isEnabled: this.form.isEnabled
      }
      const res = await this.$api.enableTvWallScenarioPlanInfo(obj)
      if (res.resultCode == 0) {
        this.form.isEnabled
          ? this.$message({
              message: this.$t('scenarioMange.enabledPlanSuccess'),
              type: 'success'
            })
          : this.$message({
              message: this.$t('scenarioMange.stopPlanSuccess'),
              type: 'success'
            })
      }
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
#scenario-plan {
  height: 100%;
  width: 100%;
  padding: 20px;
  background: #fff;
  color: #606266;
  .el-form-item__label {
    color: #606266;
  }
  .el-radio__label {
    color: #606266;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #409eff;
  }
}
</style>
