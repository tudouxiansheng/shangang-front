<template>
  <vxe-column
    v-bind="$attrs"
    :type="type"
    :field="props.prop"
    :title="props.label"
    :width="props.width"
    :show-overflow="showOverflowTooltip"
  >
    <template #default="scope">
      <template v-if="type === 'seq' && scope.columnIndex === 0">
        <span class="vxe-cell--label">{{ scope.seq }}</span>
      </template>
      <template v-else>
        <slot :row="scope.row" v-if="props.useSlot"></slot>
        <span v-else class="vxe-cell--label">{{ scope.row[props.prop] }}</span>
      </template>
    </template>
  </vxe-column>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  prop: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: ''
  },
  showOverflowTooltip: {
    type: [String, Boolean],
    default: 'ellipsis'
  },
  useSlot: {
    type: Boolean,
    default: false
  }
})

const type = computed(() => {
  const obj = {
    selection: 'checkbox',
    index: 'seq'
  }
  return obj[props.type] ? obj[props.type] : props.type
})

const test = scope => {}
</script>
