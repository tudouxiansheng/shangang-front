<template>
  <!--右边的-->
  <div class="rightAttendance">
    <div class="topVedio">
      <div class="vedio"></div>
      <div class="vedio right-vedio"></div>
    </div>
    <div class="kaoqin-wrapper">
      <div class="small-item" v-for="(item, index) in 12" :key="index">
        <div class="leftIncome">
          <img src="../../../../assets/mapIcon/alfred.png" class="ikm" />
        </div>
        <div class="rightIncome">
          <div class="name">张艺兴</div>
          <div class="apartMent">产品部</div>
          <div class="daka">打卡时间：08-19 07:00</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss">
.rightAttendance {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;

  .topVedio {
    display: flex;

    .vedio {
      flex: 1;
      height: 12.5rem;
      border: 0.0625rem solid #00ccff;
    }

    .right-vedio {
      margin-left: 1.125rem;
    }
  }

  .kaoqin-wrapper {
    display: flex;
    flex-wrap: wrap;
    .small-item {
      background: #204b74;
      opacity: 0.6;
      width: 14.375rem;
      height: 6.875rem;
      margin-right: 0.625rem;
      margin-top: 1.875rem;
      padding: 0.625rem;
      display: flex;
      .leftIncome {
        width: 4.375rem;
        height: 5.625rem;
        .ikm {
          width: 100%;
          height: 100%;
        }
      }
      .rightIncome {
        display: flex;
        flex-direction: column;
        color: #ffffff;
        .name {
          font-size: 1.375rem;
        }
        .apartMent {
          flex: 1;
          display: flex;
          align-items: center;
        }
        .daka {
          flex: 1;
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
</style>
