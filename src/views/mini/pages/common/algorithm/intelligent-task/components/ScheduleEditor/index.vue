<style lang="scss" scoped>
.ScheduleEditor {
}
</style>
<template>
  <div class="ScheduleEditor base">
    <div style="margin-bottom: 8px">
      <el-radio-group v-model="type">
        <el-radio :label="0">周计划</el-radio>
        <el-radio :label="1">日计划</el-radio>
      </el-radio-group>
      <el-button type="primary" size="small" style="margin-left: 38px" @click="clear">清除</el-button>
    </div>
    <TimeGridControl :type="type" ref="comp" :value="value" @input="$emit('input', $event)" />
  </div>
</template>

<script>
import TimeGridControl from './time-grid-control.vue'

export default {
  components: {
    TimeGridControl,
  },
  props: {
    value: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    EMIYA: function (val) {},
  },
  computed: {},
  data() {
    return {
      type: 0,
    }
  },
  async created() {},
  methods: {
    clear() {
      this.$refs.comp.clearAll()
    },
  },
}
</script>
