<template>
  <div class="linkage-form-item step2">
    <el-skeleton class="alarm-group-skeleton" :loading="loading" animated>
      <template #template>
        <el-skeleton-item variant="rect" />
        <el-skeleton-item variant="rect" />
        <el-skeleton-item variant="rect" />
        <el-skeleton-item variant="rect" />
        <el-skeleton-item variant="rect" />
      </template>
      <div v-if="!error" class="flex">
        <div v-for="(item, index) in alarmGroups" :key="index" class="alarm-group">
          <div class="title title_p" :title="item.groupName">
            {{ item.groupName }}
          </div>
          <div class="alarm-group-list">
            <el-checkbox-group v-model="checkedAlarmTypes">
              <el-checkbox
                v-for="alarmType in item.alarmTypeList"
                :key="alarmType.alarmType"
                :label="alarmType.alarmType"
              >
                <span :title="alarmType.alarmName">
                  {{ alarmType.alarmName }}
                </span>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-else class="empty-wrapper">
        <el-empty :image="emptyImg" :description="'获取告警类型失败'" />
      </div>
    </el-skeleton>

    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" @click="previousStep">
        {{ $t('alarmLinkage.previousStep') }}
      </el-button>
      <el-button type="primary" @click="nextStep">
        {{ $t('alarmLinkage.nextStep') }}
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'step2',
  props: {
    operation: {
      type: String,
      default: 'add'
    },
    policyInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: true,
      error: false,
      alarmGroups: [],
      checkedAlarmTypes: [],
      emptyImg: require('@/assets/img/common/no-data.png')
    }
  },
  created() {
    if (this.operation === 'edit') {
      this.checkedAlarmTypes = this.policyInfo.alarmTypes
    }
    this.getAlarmGroups()
  },
  methods: {
    previousStep() {
      this.$emit('prev')
    },
    nextStep() {
      if (this.checkedAlarmTypes.length === 0) {
        this.$message({
          type: 'warning',
          message: `${this.$t('public.alarmTypePromptContent')}`
        })
        return
      }
      let checkedAlarmGroups = []
      for (let group of this.alarmGroups) {
        let filteredAlarmTypes = group.alarmTypeList.filter(alarmType =>
          this.checkedAlarmTypes.includes(alarmType.alarmType)
        )
        let checkedGroup = {
          groupCode: group.groupCode,
          groupName: group.groupName,
          groupEnName: group.groupEnName,
          sort: group.sort,
          alarmTypeList: filteredAlarmTypes.length > 0 ? filteredAlarmTypes : []
        }
        checkedAlarmGroups.push(checkedGroup)
      }
      this.$emit('next', {
        step: 2,
        data: {
          alarmTypes: this.checkedAlarmTypes,
          alarmGroups: checkedAlarmGroups
        }
      })
    },
    //获取告警类型组数据
    async getAlarmGroups() {
      this.loading = true
      try {
        const res = await this.$api.getGroupsQuery({})
        if (res.resultCode === 0) {
          const alarmGroups = res.alarmGroups
          for (const item of alarmGroups) {
            let getAlarmTypesObj = {
              alarmGroup: item.groupCode,
              canLinkage: 1 //过滤可联动的告警类型
            }
            //获取告警类型
            const res = await this.$api.getAlarmTypesQuery(getAlarmTypesObj)
            if (res.resultCode === 0) {
              item.alarmTypeList = res.alarmTypeList
            }
          }
          this.alarmGroups = alarmGroups
        }
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
