<template>
  <CusDialog @close="handleClose" :visible="visible" :width="1200" isDetail defaultBgc="bigBgc">
    <div slot="title" class="guard-header">
      <ul class="guard-header-tab">
        <li @click="handleChangeTab(1)" :class="activeTab == 1 ? 'active' : ''">{{ $t('application.alarmInfo') }}</li>
        <li @click="handleChangeTab(2)" :class="activeTab == 2 ? 'active' : ''">{{ $t('application.taskInfo') }}</li>
      </ul>
    </div>
    <div class="scrollbar" slot="body">
      <AlarmList :guardId="guardId" v-if="activeTab == 1" :visible="visible"></AlarmList>
      <taskInfo :info="info" :guardId="guardId" v-else :visible="visible"></taskInfo>
    </div>
  </CusDialog>
</template>

<script>
import AlarmList from './alarmList'
import taskInfo from './taskInfo'
export default {
  name: 'guard-detail',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    guardId: {
      type: String,
      default: '',
    },
    info: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  components: {
    AlarmList,
    taskInfo,
  },
  data() {
    return {
      activeTab: 1,
    }
  },

  mounted() {},

  methods: {
    handleChangeTab(tab) {
      this.activeTab = tab
    },
    handleClose() {
      this.activeTab = 1
      this.$emit('close')
    },
  },
}
</script>

<style lang="scss" scoped>
.scrollbar {
  color: #fff;
  min-height: 600px;
}
.guard-header {
  .guard-header-tab {
    display: flex;
    box-sizing: border-box;
    li {
      padding: 10px 20px;
      box-sizing: border-box;
      font-size: 18px;
      cursor: pointer;
      &.active {
        border-bottom: 3px solid #0cd8fa;
        color: #0cd8fa;
      }
    }
  }
}
</style>
