<template>
  <!--访客-->
  <div class="screen">
    <div class="visitorWrapper">
      <div class="visitor">
        <left-visitor></left-visitor>
      </div>
      <div class="rightVistor">
        <right-visit></right-visit>
      </div>
    </div>
  </div>
</template>

<script>
import leftVisitor from './leftVisitor.vue'
import rightVisit from './rightVisitor.vue'
export default {
  components: {
    leftVisitor,
    rightVisit,
  },
}
</script>

<style lang="scss">
.visitorWrapper {
  width: 100%;
  min-height: 900px;
  height: calc(100vh - 65px);
  position: relative;

  .visitor {
    pointer-events: auto;
    width: 444px;
    min-height: 90%;
    height: 89.8vh;
    position: absolute;
    left: 19px;
    margin-top: 16px;
    background: url('../../../../assets/buildingSeting/background.png')
      no-repeat;
    background-size: 100% 100%;
  }

  .rightVistor {
    pointer-events: auto;
    width: 444px;
    min-height: 90%;
    height: 89.8vh;
    position: absolute;
    right: 19px;
    margin-top: 16px;
    background: url('../../../../assets/buildingSeting/background.png')
      no-repeat;
    background-size: 100% 100%;
  }
}
</style>
