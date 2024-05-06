<template>
  <!-- 考勤 -->
  <div class="screen">
    <div class="visitorWrapper">
      <div class="visitor">
        <left-attendance></left-attendance>
      </div>
      <div class="att-vedio">
        <right-attendance></right-attendance>
      </div>
    </div>
  </div>
</template>

<script>
import leftAttendance from './leftAttendance.vue'
import rightAttendance from './rightAttendance.vue'
export default {
  components: {
    leftAttendance,
    rightAttendance,
  },
}
</script>

<style lang="scss">
.visitorWrapper {
  width: 100%;
  min-height: 56.25rem;
  height: calc(100vh - 4.0625rem);
  position: relative;

  .visitor {
    pointer-events: auto;
    width: 21.5625rem;
    min-height: 90%;
    height: 89.8vh;
    position: absolute;
    left: 1.1875rem;
    margin-top: 1rem;
    background: url('../../../../assets/buildingSeting/background.png')
      no-repeat;
    background-size: 100% 100%;
    // top: 3.75rem;
  }
  .att-vedio {
    pointer-events: auto;
    width: 47.5625rem;
    min-height: 90%;
    height: 54.3125rem;
    position: absolute;
    right: 1.1875rem;
    margin-top: 1rem;
    background: rgba(12, 25, 44, 0.5);
    background-size: 100% 100%;
  }
}
</style>
