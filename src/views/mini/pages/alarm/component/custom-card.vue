<template>
  <div class="custom-card">
    <div class="title">
      <div class="left">
        <div class="title-info">{{ moduleName }}</div>
      </div>
      <div class="right">
        <slot name="filter"></slot>
      </div>
    </div>
    <div class="custom-card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    moduleName: {
      type: String,
      default: '',
    },
  },
  name: 'custom-card',
}
</script>

<style scoped lang="scss">
.custom-card {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 8px;
  pointer-events: auto;
  .bg-img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .title {
    width: 100%;
    height: 40px;
    padding: 10px 20px 0;
    box-sizing: border-box;
    position: relative;
    display: flex;
    align-items: center;
    .left {
      display: flex;
      .title-info {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #1EFFFC;
      }
    }
    .right {
      flex: 1;
      text-align: right;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      z-index: 99;
      font-size: 14px;
      ul {
        display: flex;
        color: #fff;
        align-items: flex-end;

        text-align: right;
        li {
          padding: 2px 6px;
          border-radius: 3px;
          box-sizing: border-box;
          margin: 0 3px;
          cursor: pointer;
          pointer-events: auto;
          &.active {
            background-color: #226fbd;
          }
        }
      }
    }

    img {
      width: 30px;
      margin-left: 10px;
    }
  }
  .custom-card-content {
    height: calc(100% - 50px);
  }
}
</style>
