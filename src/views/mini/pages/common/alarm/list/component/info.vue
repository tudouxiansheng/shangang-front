<template>
  <!-- 快捷输入文字显示 -->
  <div id="info">
    <el-radio-group
      v-model="radio"
      @change="changeText"
      :style="{ 'grid-template-columns': 'repeat(1, minmax(0, 1fr))' }"
    >
      <el-radio v-for="(item, index) of adviseList" :label="item" :key="index"></el-radio>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    adviseList: {
      type: Array
    }
  },
  data() {
    return {}
  },
  computed: {
    radio: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    changeText(val) {
      this.$emit('changeInfo', val)
    }
  }
}
</script>

<style lang="scss">
#info {
  .el-radio__input {
    display: none;
  }
  .el-radio__label {
    padding-left: 0;
  }
  .el-radio-group {
    display: grid;
    gap: 20px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    text-align: left;
  }
  .el-radio {
    margin-right: 0;
  }
}
</style>
