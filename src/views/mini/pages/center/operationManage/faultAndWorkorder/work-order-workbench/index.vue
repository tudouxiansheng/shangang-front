<template>
  <div ref="workOrderWorkbench" v-if="isRouterAlive">
    <panel-group />
    <work-order />
  </div>
</template>

<script>
import PanelGroup from './component/panel-group'
import workOrder from './component/work-order'

export default {
  name: 'WorkOrderWorkbench',
  components: {
    PanelGroup,
    workOrder
  },
  data() {
    return {
      isRouterAlive: true
    }
  },
  methods: {}
}
</script>
