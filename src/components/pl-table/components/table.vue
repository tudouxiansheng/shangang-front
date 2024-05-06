<template>
  <vxe-table
    ref="vxeTable"
    :data="tableData"
    :height="props.height"
    :max-height="props.maxHeight"
    :width="props.width"
    :stripe="props.stripe"
    :column-config="{ isCurrent: true, isHover: true }"
    :row-config="{ isCurrent: true, isHover: true }"
    :scroll-y="{ enabled: true }"
    :show-header="showHeader"
    :row-class-name="rowClassName"
    :empty-text="emptyText"
    :row-style="rowStyle"
    :cell-style="cellStyle"
    :checkbox-config="checkboxConfig"
    @checkbox-change="onCheckboxChange"
    v-bind="$attrs"
  >
    <slot></slot>
  </vxe-table>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['selection-change'])

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  width: {
    type: [String, Number],
    default: ''
  },
  height: {
    type: [String, Number],
    default: ''
  },
  maxHeight: {
    type: [String, Number],
    default: ''
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  rowClassName: {
    type: String,
    default: ''
  },
  emptyText: {
    type: String,
    default: ''
  },
  rowStyle: {
    type: String,
    default: ''
  },
  rowStyle: {
    type: String,
    default: ''
  },
  checkboxConfig: {
    type: Function
  },
  stripe: {
    type: Boolean,
    default: false
  }
})

let tableData = computed(() => {
  return props.data
})

const onCheckboxChange = val => {
  emit('selection-change', val.records)
}
</script>
