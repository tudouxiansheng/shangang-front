<template>
  <div class="wrapper2" :style="{ height: clientHeight + 'px', width: clientWidth + 'px' }">
    <div id="certify">
      <div class="swiper-container">
        <div class="swiper-wrapper">
          <div class="swiper-slide" @click="showDialogItem(1)">
            <!-- <img src="./sourceimages/certify01.png" /> -->
            <div class="yi item">
              <div class="yiimage">
                <img src="./source/images/yuexian.png" />
              </div>
              <div class="yuexian">越线检测</div>
            </div>
          </div>
          <div class="swiper-slide" @click="showDialogItem(2)">
            <div class="yi san item">
              <div class="yiimage">
                <img src="./source/images/huoyan.png" />
              </div>
              <div class="yuexian">火焰检测</div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="yi er item">
              <div class="yiimage">
                <img src="./source/images/wushui.png" />
              </div>
              <div class="yuexian">污水检测</div>
            </div>
          </div>

          <div class="swiper-slide">
            <div class="yi si item">
              <div class="yiimage">
                <img src="./source/images/gaokong.png" />
              </div>
              <div class="yuexian">高空抛物</div>
            </div>
          </div>
          <div class="swiper-slide">
            <div class="yi wu item">
              <div class="yiimage">
                <img src="./source/images/kouzhao.png" />
              </div>
              <div class="yuexian">是否待口罩</div>
            </div>
          </div>
        </div>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
    <div class="dialog-item" v-show="showDialog">
      <div class="left">
        <div class="title">{{ content.title }}</div>
        <img :src="content.leftImg" alt="" />
      </div>
      <div class="right">
        <div class="close" @click="closeIcon">
          <i class="el-icon-close infoIcon"></i>
        </div>

        <div class="first" v-if="content.algrom">
          <h3>算法简介</h3>
          <div>{{ content.algrom }}</div>
        </div>
        <div class="second" v-if="content.yingyong">
          <h3>应用场景</h3>
          <div>{{ content.yingyong }}</div>
        </div>
        <div class="third" v-if="content.des">
          <h3>功能描述</h3>
          <div>{{ content.des }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let certifySwiper
import Swiper from 'swiper'
export default {
  data() {
    return {
      clientHeight: document.body.clientHeight,
      clientWidth: document.body.clientWidth,
      myimg: require('./source/images/background.png'),
      showDialog: false,
      content: {
        leftImg: '',
        algrom: '',
        yingyong: '',
        des: '',
        title: '',
      },
    }
  },
  mounted() {
    certifySwiper = new Swiper('#certify .swiper-container', {
      watchSlidesProgress: true,
      slidesPerView: 'auto',
      centeredSlides: true,
      loop: true,
      loopedSlides: 5,
      autoplay: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      pagination: {
        el: '.swiper-pagination',
        //clickable :true,
      },
      on: {
        progress: function (progress) {
          for (let i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i)
            var slideProgress = this.slides[i].progress
            var modify = 1
            if (Math.abs(slideProgress) > 1) {
              modify = (Math.abs(slideProgress) - 1) * 0.3 + 1
            }
            var translate = slideProgress * modify * 260 + 'px'
            var scale = 1 - Math.abs(slideProgress) / 5
            var zIndex = 999 - Math.abs(Math.round(10 * slideProgress))
            slide.transform('translateX(' + translate + ') scale(' + scale + ')')
            slide.css('zIndex', zIndex)
            slide.css('opacity', 1)
            if (Math.abs(slideProgress) > 3) {
              slide.css('opacity', 0)
            }
          }
        },
        setTransition: function (transition) {
          for (var i = 0; i < this.slides.length; i++) {
            var slide = this.slides.eq(i)
            slide.transition(transition)
          }
        },
      },
    })
  },
  methods: {
    showDialogItem(count) {
      console.log(count, 'count')
      if (count == 1) {
        this.showDialog = true
        this.content = {
          leftImg: require('./source/images/guoxian-left.png'),
          title: '越线统计',
          algrom: '越线检测是指在指定区域内设置警戒线和警戒方向，当有目标沿警戒方向穿过警戒线时，产生告警。',
          yingyong: '越线检测主要运用于轨道、仓库、公园等禁止进入区域检测。',
          des: '内容支持警戒线和警戒方向设置。 支持多目标同时越线检测，能够区分并识别所有目标，并标注告警。 支持感兴趣区域设置，提高检测效率',
        }
      } else if (count == 2) {
        this.showDialog = true
        this.content = {
          leftImg: require('./source/images/huoyan-left.png'),
          title: '火焰检测',
          algrom:
            '利用计算机视觉、人工智能以及闭路电视监控技术，通过视频图像来检测烟火。系统自动分析、识别视频图像内的火焰、烟雾，产生告警信息，在数秒内完成火灾探测及报警，大大缩短了火灾告警时间。',
          yingyong:
            '森林防火、煤矿、化工、石油加工厂、水利及核电站、仓库、大型存储、集散中心、商场、机场体育场馆等可能出现火灾的场景。',
        }
      }
    },
    closeIcon() {
      this.showDialog = false
    },
  },
}
</script>

<style lang="scss">
@import './source/css/certify.css';
@import './source/css/swiper.min.css';
.swiper-slide {
  pointer-events: auto;
}
.wrapper2 {
  width: 100%;
  position: absolute;
  top: 0;
  z-index: 999;
  background: url('./source/images/background.png') no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  background-attachment: fixed;
  background-size: cover;
  pointer-events: auto;
  // background: rgba(120, 190, 190, .3);
}
#certify {
  position: absolute;
}
.yi {
  background: linear-gradient(-3deg, #1dc9bd, #30d8a5);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  cursor: pointer;
  .yiimage {
    display: flex;
    justify-content: center;
    img {
      width: 135px;
      height: 145px;
    }
  }
  .yuexian {
    color: white;
    font-size: 18px;
    text-align: center;
    margin-top: 20px;
  }
}
.er {
  background: linear-gradient(-3deg, #57bdfd, #0860d8);
}
.san {
  background: linear-gradient(-3deg, #878aff, #6859f5);
}
.si {
  background: linear-gradient(-3deg, #6cbbfe, #279bfe);
}
.wu {
  background: linear-gradient(-3deg, #748ef3, #2a21db);
}
.item {
  width: 100%;
  height: 100%;
}
.dialog-item {
  width: 800px;
  height: 400px;
  background: #ffffff;
  border-radius: 10px;
  display: flex;
  padding: 20px;
  font-size: 16px;
  z-index: 10000;
  .left {
    flex: 1;
    .title {
      font-size: 19px;
    }
    img {
      width: 353px;
      height: 315px;
      margin-top: 10px;
    }
  }
  .right {
    flex: 1;
    display: flex;
    flex-direction: column;
    .close {
      text-align: right;
      i {
        font-size: 18px;
        cursor: pointer;
      }
    }
    .first {
      flex: 1;
    }
    .second {
      flex: 1;
    }
    .third {
      flex: 1;
    }
  }
}
</style>
