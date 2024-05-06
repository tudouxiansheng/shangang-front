<template>
  <div class="box">
    <div
      class="box_left"
      :class="{ switch: classSwitch == 1 }"
      @click="navClick(1, 'NavCoontentOne')"
    >
      告警信息统计
    </div>
    <div
      class="box_right"
      :class="{ switch: classSwitch == 2 }"
      @click="navClick(2, 'NavCoontentTwo')"
    >
      数据分析
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      classSwitch: 1, //切换navbar的类名
    }
  },
  methods: {
    navClick(num, component) {
      this.classSwitch = num
      this.$emit('componentSwitch', component)
    },
  },
}
</script>

<style scoped lang="scss">
.box {
  display: flex;
  justify-content: center;
  height: 47px;
  margin-top: 6px;
  line-height: 47px;
  text-align: center;
  color: #ffffff;
  font-size: 16px;
  .switch {
    color: #04d5fa;
    border-bottom: 2px solid #04d5fa;
  }
  .box_left {
    padding: 0 10px;
    margin: 0 10px;
  }
  .box_right {
    padding: 0 10px;
    margin: 0 10px;
  }
}
</style>
