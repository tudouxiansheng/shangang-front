<template>
  <CustomCard :module-name="showProperty.moduleName">
    <div slot="filter" class="right-box">
      <img src="../../assets/homePage/shijian.png" class="shijian" />
      <div class="time">{{ date | formatDateTime }}</div>
    </div>
    <div class="content">
      <div class="firstList">
        <div class="box">
          <div class="leftimg">
            <img src="../../assets/homePage/pm2.png" />
          </div>
          <div class="righttext">
            <div class="pm2">pm2.5</div>
            <div class="num">170毫克</div>
          </div>
        </div>
        <div class="box">
          <div class="leftimg">
            <img src="../../assets/homePage/co2.png" />
          </div>
          <div class="righttext">
            <div class="pm2">co2</div>
            <div class="num">20%</div>
          </div>
        </div>
        <div class="box">
          <div class="leftimg">
            <img src="../../assets/homePage/fengsu.png" class="fengsu" />
          </div>
          <div class="righttext">
            <div class="pm2">风速</div>
            <div class="num">{{ weather.windSpeed ? weather.windSpeed : 0 }}公里/小时</div>
          </div>
        </div>
      </div>
      <div class="secondList" style="margin-top: 30px">
        <div class="box">
          <div class="leftimg">
            <img src="../../assets/homePage/wendu.png" />
          </div>
          <div class="righttext">
            <div class="pm2">温度</div>
            <div class="num">{{ weather.temp ? weather.temp : 0 }}&#8451;</div>
          </div>
        </div>
        <div class="box">
          <div class="leftimg">
            <img src="../../assets/homePage/shidu.png" />
          </div>
          <div class="righttext">
            <div class="pm2">湿度</div>
            <div class="num">{{ weather.humidity ? weather.humidity : '0' }}%</div>
          </div>
        </div>
        <div class="box">
          <div class="leftimg">
            <img src="../../assets/homePage/zhaoshe.png" class="zhaoshe" />
          </div>
          <div class="righttext">
            <div class="pm2">照射强度</div>
            <div class="num">170Lx</div>
          </div>
        </div>
      </div>
    </div>
  </CustomCard>
</template>

<script>
import CustomCard from './components/custom-card'
export default {
  props: ['showProperty'],
  components: {
    CustomCard,
  },
  data() {
    return {
      weather: {},
      date: new Date(),
      timer: '',
    }
  },
  created() {
    this.getWeather()
  },
  mounted() {
    var that = this
    this.timer = setInterval(() => {
      that.date = new Date() //修改数据date
    }, 1000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer) //在Vue实例销毁前，清除我们的定时器
    }
  },
  methods: {
    getWeather() {
      // this.$fetch(
      //         "https://devapi.qweather.com/v7/weather/now?location=101190101&key=e184d90608f3477ebe78a7b1f57d017d"
      //     )
      //     .then((res) => {
      //         console.log(res, '天气');
      //         if (res.data.code == 200) {
      //             this.weather = res.data.now;
      //         }
      //     });
    },
  },
  filters: {
    formatDateTime(value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? '0' + MM : MM
      let d = date.getDate()
      d = d < 10 ? '0' + d : d
      let h = date.getHours()
      h = h < 10 ? '0' + h : h
      let m = date.getMinutes()
      m = m < 10 ? '0' + m : m
      let s = date.getSeconds()
      s = s < 10 ? '0' + s : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    },
  },
}
</script>

<style lang="scss" scoped>
.right-box {
  height: 40px;
  display: flex;
  align-items: center;
  .shijian {
    width: 20px !important;
    height: 20px;
    margin-right: 10px;
  }

  .time {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #1df8fc;
  }
}
.content {
  width: 100%;
  padding: 17px;
  position: absolute;
  left: 0;
  top: 45px;
  display: flex;
  font-size: 14px;
  flex-direction: column;

  img {
    width: 40px;
    height: 40px;
  }

  .firstList {
    flex: 1;
    display: flex;

    .box {
      flex: 1;
      display: flex;

      .leftimg {
        .fengsu {
          animation: rotate 6s linear infinite;
        }

        @keyframes rotate {
          0% {
            transform: rotateZ(0deg);
            /*从0度开始*/
          }

          100% {
            transform: rotateZ(360deg);
            /*360度结束*/
          }
        }
      }

      .righttext {
        margin-left: 8px;

        .pm2 {
          font-size: 14px;
          font-weight: 400;
          color: #1df8fc;
        }

        .num {
          font-weight: 400;
          color: #ffffff;
          margin-top: 6px;
        }
      }
    }
  }

  .secondList {
    flex: 1;
    display: flex;

    .box {
      flex: 1;
      display: flex;

      .zhaoshe {
        animation: rotate 6s linear infinite;
      }

      @keyframes rotate {
        0% {
          transform: rotateZ(0deg);
          /*从0度开始*/
        }

        100% {
          transform: rotateZ(360deg);
          /*360度结束*/
        }
      }

      .righttext {
        margin-left: 8px;

        .pm2 {
          font-size: 14px;
          font-weight: 400;
          color: #1df8fc;
        }

        .num {
          font-weight: 400;
          color: #ffffff;
          margin-top: 6px;
        }
      }
    }
  }
}
</style>
