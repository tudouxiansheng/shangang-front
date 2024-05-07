<template>
  <div id="cruise-plan">
    <el-form :model="form" :rules="formRules" ref="form">
      <el-form-item :label="$t('cruise.enable') + ':'" prop="enable">
        <el-switch v-model="form.enable" :active-value="1" :inactive-value="0"></el-switch>
      </el-form-item>
      <el-form-item :label="$t('cruise.planType') + ':'" prop="planType">
        <el-radio-group v-model="form.planType">
          <el-radio :label="0">{{ $t('cruise.planType0') }}</el-radio>
          <el-radio :label="1">{{ $t('cruise.planType1') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <plan-time
        ref="planTime"
        :props="timeSpanListTemplate"
        :planList="planList"
        :planType="form.planType"
        :optionList="cruiseTrackList"
        :alertMessage="$t('cruise.alertMessage')"
        :tip="$t('cruise.tip')"
        @timeListChange="timeList = $event"
      />
      <div class="mt-10 text-center">
        <el-button type="info" @click="cancelHandle">{{ $t('public.cancel') }}</el-button>
        <el-button class="confirm-button" type="primary" :loading="loading" @click="confirmHandle">
          {{ $t('public.save') }}
        </el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import routeJump from '@/mixin/route-jump.js' //路由跳转
import PlanTime from '@/components/plan-time.vue'

export default {
  name: 'CruisePlan',
  mixins: [routeJump],
  components: { PlanTime },
  data() {
    return {
      form: {},
      timeSpanListTemplate: {
        label: 'label',
        timeList: 'timeSpanList',
        startTime: 'startTime',
        endTime: 'endTime',
        optionLabel: 'cruiseName',
        optionValue: 'cruiseNo',
        selectedOptionValue: 'cruiseNo'
      },
      cameraId: this.$route.params.cameraId,
      cruiseTrackList: [],
      loading: false,
      planList: [],
      timeList: [],
      formRules: {
        enable: [
          {
            required: true,
            message: this.$t('cruise.enableProp'),
            trigger: 'change'
          }
        ],
        planType: [
          {
            required: true,
            message: this.$t('cruise.planType2'),
            trigger: 'change'
          }
        ]
      }
    }
  },

  mounted() {
    this.getCruiseList()
    this.getCruisePlan()
  },
  methods: {
    async getCruiseList() {
      const res = await this.$api.getCruiseList({
        cameraId: this.cameraId,
        cruiseType: 1
      })
      if (res.resultCode == 0 && res.cruiseTrackList) {
        this.cruiseTrackList = [
          ...res.cruiseTrackList,
          {
            cruiseName: this.$t('public.delete'),
            cruiseNo: 'delete'
          }
        ]
      }
    },
    async getCruisePlan() {
      const res = await this.$api.getCruisePlan({
        cameraId: this.cameraId
      })
      if (res.resultCode == 0) {
        this.form = {
          cameraId: res?.cameraId,
          enable: res?.enable,
          planType: res?.planType
        }
        this.planList = res?.planList
      }
    },
    confirmHandle() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          if (this.cruiseTrackList.length == 0)
            return this.$alert(this.$t('cruise.noCruiseWarn'), this.$t('public.confirm'))
          const flag = this.$refs.planTime.validateList()
          if (!flag) return
          let obj = {
            planList: this.timeList,
            ...this.form,
            cameraId: this.cameraId
          }
          const res = await this.$api.setCruisePlan(obj)
          if (res.resultCode == 0) {
            await this.$message({
              message: this.$t('cruise.cruiseSetSuccess'),
              type: 'success'
            })
            await this.$refs.planTime.resetForm()
            this.getCruisePlan()
            this.closeFun(2)
          }
        }
      })
    },
    cancelHandle() {
      this.closeFun(1)
    },
    closeFun(closeType) {
      let param = {
        closeType, //1:取消 2：保存  3.关闭
        cameraId: this.cameraId
      }
      this.$webkitProc('close_dialog', JSON.stringify(param))
    }
  }
}
</script>

<style lang="scss">
#cruise-plan {
  height: 100%;
  width: 100%;
  padding: 20px;
  background: #fff;
  color: #000;
  .el-form-item__label {
    color: #000;
  }
  .el-radio__label {
    color: #000;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #409eff;
  }
}
</style>
