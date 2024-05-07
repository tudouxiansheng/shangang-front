<template>
  <div class="mark-label">
    <div class="mark-label-left">6</div>
    <div class="arrow"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  computed: {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.mark-label {
  position: relative;
  height: 60px;
  padding: 10px;
  background: #fff;
  color: #505050;
  font-size: 12px;
  font-family: Microsoft YaHei;
  line-height: 18px;
  &-left {
    display: inline-block;
    width: 40px;
    height: 40px;
    text-align: center;
    line-height: 40px;
    background: #3085cb;
    color: #fff;
    font-size: 32px;
    font-family: Arial;
    box-shadow: 0px 3px 6px rgba(48, 133, 203, 0.32);
    border-radius: 8px;
  }

  .arrow {
    position: absolute;
    bottom: -24px;
    left: 50px;
    width: 0;
    height: 0;
    border: 12px solid transparent;
    border-top-color: #fff;
  }
}
</style>
