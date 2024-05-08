<template>
  <el-dialog
    :title="$t('analysisTask.taskInfo')"
    v-model="dialogVisible"
    top="10vh"
    :width="locale == 'en' ? '1200px' : '1100px'"
    class="taskDetailDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="data" :label-width="locale == 'en' ? '205px' : '120px'" label-position="left">
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { ArrowDown as ElIconArrowDown, ArrowUp as ElIconArrowUp } from '@element-plus/icons-vue'
import { defineAsyncComponent } from 'vue'
import timeGridControl from '@/components/time-grid-control.vue'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {},
}
</script>

<style lang="scss">
.taskDetailDialog {
}
</style>
