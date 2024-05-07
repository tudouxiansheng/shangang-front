<template>
  <div ref="repairWorkbench" v-if="isRouterAlive">
    <panel-group />
    <repair />
  </div>
</template>

<script>
import PanelGroup from './component/panel-group'
import repair from './component/repair'

export default {
  name: 'RepairWorkbench',
  components: {
    PanelGroup,
    repair
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {}
}
</script>
