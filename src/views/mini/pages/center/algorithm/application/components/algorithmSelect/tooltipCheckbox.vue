<template>
  <div class="tooltip-checkbox" :style="{ width }">
    <el-tooltip
      :content="label"
      :placement="tooltipOption.position"
      :disabled="!showTooltip"
      manual
    >
      <el-checkbox
        v-if="buttonType === 0"
        ref="checkbox"
        v-model="myChecked"
        :label="value"
        class="checkbox"
        @change="$emit('change', myChecked)"
      >
        {{ label }}
      </el-checkbox>

      <el-radio
        v-if="buttonType === 1"
        ref="checkbox"
        v-model="myChecked"
        :label="value"
        class="checkbox"
        @change="$emit('change', myChecked)"
      >
        {{ label }}
      </el-radio>
    </el-tooltip>
    <!-- 用于确定字符长度的隐藏域 -->
    <div ref="hidden" class="el-checkbox" style="position: absolute; left: -100000px">
      <span class="el-checkbox__inner"></span>
      <span class="el-checkbox__label">
        {{ label }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TooltipCheckbox',
  model: {
    prop: 'checked',
    event: 'v-model'
  },
  props: {
    // 整个checkbox的宽度，可设置px/%，默认200px
    width: {
      type: String,
      default: '200px'
    },
    // tooltip配置
    tooltipOption: {
      type: Object,
      default: () => ({
        position: 'top-start'
      })
    },
    // checkbox的文本
    label: {
      default: ''
    },
    // checkbox选中的值
    value: {
      default: ''
    },
    // 是否选中
    checked: {
      type: Boolean,
      default: false
    },
    buttonType: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      showTooltip: false
    }
  },
  computed: {
    myChecked: {
      get() {
        return this.checked
      },
      set(v) {
        this.$emit('v-model', v)
      }
    }
  },
  mounted() {
    this.setShowTooltip()
  },
  methods: {
    setShowTooltip() {
      this.$nextTick(() => {
        let hiddenLength = this.$refs.hidden.offsetWidth
        let checkboxLength = this.$refs.checkbox.$el.offsetWidth
        this.showTooltip = hiddenLength > checkboxLength
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tooltip-checkbox {
  .checkbox {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  .checkbox.el-radio {
    width: 100%;
    justify-content: center;
    padding: 8px 0;
    &.is-checked {
      background: #1b517d;
    }
  }

  .checkbox.el-checkbox {
    width: 100%;
    padding: 8px 0;
  }

  :deep(.el-radio__input.is-checked + .el-radio__label) {
    color: #fff;
  }

  :deep(.el-checkbox__label),
  :deep(.el-radio__label) {
    color: #fff;
    line-height: 14px;
    padding-bottom: 2px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  :deep(.el-radio__label) {
    padding: 2px;
  }

  :deep(.el-radio__input) {
    display: none;
  }
}
</style>
