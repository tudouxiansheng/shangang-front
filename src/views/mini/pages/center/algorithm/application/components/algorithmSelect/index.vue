<template>
  <div class="relative checkbox-wrapper">
    <template v-if="type === 1">
      <el-radio-group
        v-model="checkedAlgorithma"
        @change="handleCheckedAlgorithmChange"
        class="grid grid-cols-9 gap-2"
      >
        <TooltipCheckbox
          v-show="options.length > 0"
          :label="$t('retrieval.allAlgorithm')"
          :value="options.map(item => item.algorithmId).join(',')"
          width="100%"
        />
        <TooltipCheckbox
          v-for="(item, index) in options"
          :key="index"
          :label="item.algorithmName"
          :value="item.algorithmId"
          width="100%"
        />
      </el-radio-group>
    </template>
    <template v-else>
      <el-checkbox-group
        v-model="checkedAlgorithma"
        @change="handleCheckedAlgorithmChange"
        class="grid grid-cols-9 gap-2"
      >
        <TooltipCheckbox
          :button-type="0"
          v-for="(item, index) in options"
          :key="index"
          :label="item.algorithmName"
          :value="item.algorithmId"
          width="100%"
        />
      </el-checkbox-group>
    </template>
  </div>
</template>

<script>
import TooltipCheckbox from './tooltipCheckbox'
export default {
  components: {
    TooltipCheckbox
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    // 选中值
    modelData: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 1
    }
  },
  name: 'AlgorithmSelect',
  data() {
    return {
      checkAll: 1,
      isIndeterminate: true,
      checkedAlgorithma: []
    }
  },
  watch: {
    modelData: {
      handler(nv, ov) {
        if (nv) {
          let flag = typeof nv === 'string' ? true : false
          if (this.type === 1) {
            this.checkedAlgorithma = flag ? nv : nv.join(',')
          } else {
            this.checkedAlgorithma = nv
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleCheckedAlgorithmChange(value) {
      let flag = typeof value === 'string' ? true : false
      let arr = value
      if (flag) {
        arr = value.split(',')
      }
      let checkedCount = arr.length
      this.checkAll = checkedCount === this.options.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.options.length
      this.$emit('valueChange', arr)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox-wrapper {
  padding: 12px;
  background-color: #0b2236;
  .checkbox-all {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    :deep(el-checkbox__label) {
      color: #fff;
      line-height: 14px;
      padding-bottom: 2px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
  :deep(.el-checkbox__input.is-checked + .el-checkbox__label) {
    color: #409eff;
  }
}
</style>
