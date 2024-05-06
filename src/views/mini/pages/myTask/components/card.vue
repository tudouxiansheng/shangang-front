<template>
  <div class="card">
    <!-- header -->
    <div class="card-header">
      <!-- 左侧内容标题 -->
      <div class="card-header-left">
        <img src="../img/title.png" />
        <span class="title">{{ title }}</span>
      </div>
      <!-- 右侧操作按钮 -->
      <div class="card-header-right">
        <slot name="options"></slot>
      </div>
    </div>
    <!-- 内容 -->
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
  mounted() {},
  computed: {},
  methods: {},
}
</script>
<style scoped lang="scss">
.card {
  border: 1px solid rgba(172, 255, 255, 0.16);
  background: rgba(34, 39, 49, 0.4);
  color: #fff;
  width: 100%;
  .card-header {
    display: flex;
    margin: 5px;
    box-sizing: border-box;
    justify-content: space-between;
    .card-header-left {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 40px;
      }
      .title {
        display: inline-block;
        font-size: 22px;
        font-weight: 400;
        line-height: 26px;
        text-shadow: 0px 3px 6px rgba(94, 175, 200, 0.6);
        margin-bottom: 5px;
      }
    }
  }
  .card-content {
    height: calc(100% - 50px);
  }
}
</style>
