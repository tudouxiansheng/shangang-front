<template>
  <div class="info-window">
    <div class="info-window-left">
      <span>{{ count }}</span>
    </div>
    <div class="info-window-right" ref="info-window-right">
      <el-tooltip effect="light" :content="location" placement="top-start" :disabled="disabled">
        <span @mouseenter="changeDisabled($event)">
          {{ location }}
        </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  props: ['location', 'count'],
  data() {
    return {
      disabled: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    changeDisabled(e) {
      const contentHeight = e.target.offsetHeight
      const tooltipHeight = this.$refs['info-window-right'].offsetHeight
      this.disabled = contentHeight > tooltipHeight ? false : true
    }
  }
}
</script>

<style lang="scss" scoped>
.info-window {
  position: relative;
  display: flex;
  height: 60px;
  padding: 10px;
  background: #fff;
  color: #505050;
  font-size: 12px;
  font-family: Microsoft YaHei;
  line-height: 23px;
  max-width: 300px;
  &-left {
    display: inline-block;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #3085cb;
    color: #fff;
    font-size: 32px;
    font-family: Arial;
    box-shadow: 0px 3px 6px rgba(48, 133, 203, 0.32);
    border-radius: 8px;
    padding: 0 10px;
  }
  &-right {
    flex: 1;
    margin: auto;
    margin-left: 10px;

    display: -webkit-box;
    /* 弹性盒子元素垂直排列 */
    -webkit-box-orient: vertical;
    /* 控制要显示的行数 */
    -webkit-line-clamp: 2;
    overflow: hidden;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -20px;
    left: 50%;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-top-color: #fff;
  }
}
</style>
