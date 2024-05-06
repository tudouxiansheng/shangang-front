<template>
  <div class="linkage-form-item step4">
    <div class="flex justify-between">
      <div class="preview-list">
        <div class="title">
          {{ $t('alarmLinkage.alarmDev') }}
        </div>
        <div class="preview-list-wrapper">
          <div class="title title_p">
            {{ $t('alarmLinkage.devName') }}
          </div>
          <div class="preview-list-container">
            <div class="preview-item" v-for="(item, index) in cameras" :key="index">
              <div class="preview-item-name">
                <i :class="getDevIcon(item.payload.status, item.payload.deviceType)" class="aci" />
                <span>{{ item.label }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="preview-list alarm-groups">
        <div class="title">
          {{ $t('public.alarmType') }}
        </div>
        <div class="preview-list-wrapper">
          <div v-for="(item, index) in alarmGroups" :key="index" class="alarm-group">
            <template v-if="item.alarmTypeList.length">
              <div class="title title_p" :title="item.groupName">
                {{ item.groupName }}
              </div>
              <div class="alarm-group-list">
                <div
                  class="alarm-group-item"
                  v-for="alarmType in item.alarmTypeList"
                  :key="alarmType.alarmType"
                >
                  <span :title="alarmType.alarmName">
                    {{ alarmType.alarmName }}
                  </span>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="preview-list">
        <div class="title">
          {{ $t('alarmLinkage.alarmAcion') }}
        </div>
        <div class="preview-list-wrapper">
          <div class="title title_p">
            {{ $t('alarmLinkage.actionName') }}
          </div>
          <div class="preview-list-container">
            <div class="preview-item" v-for="(item, index) in actions" :key="index">
              <div class="preview-item-name">
                <span>{{ item.actionName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="dialog-footer">
      <el-button @click="$emit('cancel')">{{ $t('public.cancel') }}</el-button>
      <el-button type="primary" @click="previousStep">
        {{ $t('alarmLinkage.previousStep') }}
      </el-button>
      <el-button type="primary" :loading="isLoading" @click="nextStep">
        {{ $t('public.confirm') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import devIcon from '@/utils/common/dev-icon.js'
const { getDevIcon } = devIcon()
export default {
  name: 'step4',
  props: {
    cameras: {
      type: Array,
      default: () => []
    },
    alarmGroups: {
      type: Array,
      default: () => []
    },
    actions: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    getDevIcon() {
      return getDevIcon
    }
  },
  data() {
    return {
      isLoading: false
    }
  },
  methods: {
    previousStep() {
      this.$emit('prev')
    },
    async nextStep() {
      try {
        this.isLoading = true
        this.$emit('next', {
          step: 4,
          data: {}
        })
      } catch (error) {}
    }
  }
}
</script>
