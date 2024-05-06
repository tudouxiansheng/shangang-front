<template>
  <div>
    <div class="content" v-show="list.length !== 0">
      <div class="back" @click="backTo">
        <img src="../assets/fanhui.png" style="width: 50px" />
      </div>
      <div class="content-main" v-for="(item, index) in list" :key="index">
        <div class="bigtitle">{{ item.name }}</div>
        <div style="width: 1100px; margin: 30px auto">
          <div class="title">算法简介</div>
          <div class="detail">{{ item.detail }}</div>
        </div>
        <div style="width: 1100px; margin: 30px auto" v-show="item.scenario">
          <div class="title">应用场景</div>
          <div class="detail">{{ item.scenario }}</div>
        </div>
        <div>
          <div class="width:1300px;">
            <video
              autoplay
              controls
              style="
                display: block;
                width: 1000px;
                height: 600px;
                margin-left: 50px;
              "
            >
              <source :src="item.src" type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </div>
    <div class="content" v-show="list1.length !== 0">
      <div class="content-main" v-for="(item, index) in list1" :key="index">
        <div class="bigtitle">{{ item.name }}</div>
        <div style="width: 1100px; margin: 30px auto">
          <div class="title">算法简介</div>
          <div class="detail">{{ item.detail }}</div>
        </div>
        <div>
          <img
            :src="item.src"
            alt
            style="width: 1000px; height: 600px; margin-left: 50px"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      list1: [],
    }
  },
  methods: {
    getName() {
      var name = this.$router.history.current.query.name
      switch (name) {
        case '火焰检测':
          this.list = [
            {
              name: '火焰检测',
            //   src: require('../assets/video/fire.mp4'),
              detail:
                '支持多边形周界设置，支持设置多个区域。支持设置密度告警阈值，当超过阈值时产生告警，并给出告警发生时的实际人群密度值。',
              scenario:
                '人群密度主要运用于商场、广场等大型公共区域，统计出来的结果可进行为人群引导和安全防范做参考。',
            },
          ]
          break
        case '烟雾检测':
          this.list = [
            {
              name: '烟雾检测',
            //   src: require('../assets/video/smoke.mp4'),
              detail:
                '烟雾检测是与火焰检测同时进行的，用于提升检测能力。通过利用分块和背景差分提取运动区域，在空间建立烟雾颜色模型和亮度模型，得到烟雾疑似区域；在灰度空间提取能量变化规律；对用Lucas-Kanade稀疏光流算法改进，实现疑似区域进行多目标自动跟踪，获取疑似区域的平均偏移量和相位分布作为烟雾识别特征。',
              scenario:
                '监控焚烧秸秆、工厂偷排废气等违法行为的自动化视频监控、分析检测、报警系统。',
            },
          ]
          break
        case '违章加盖检测':
          this.list = [
            {
              name: '违章加盖检测',
            //   src: require('../assets/video/rule.mp4'),
              detail:
                '违章加盖是在未取得相关部门许可的情况下，占用农业用地或楼顶等公共区域，加盖违章建筑的场景，是违建行为中比较高发的行为。智能分析算法通过原始图片和抓拍现场图片的比对，如果出现建筑物形态的新增图形，即触发疑似违章加盖的检测告警，及时通知相关责任人进行确认、排查。',
              scenario: '动态监测、门禁通道',
            },
          ]
          break
        case '脚手架检测':
          this.list = [
            {
              name: '脚手架检测',
            //   src: require('../assets/video/cli.mp4'),
              detail:
                '脚手架检测是通过智能分析算法判断建筑物外立面上是否安装有脚手架设施，从而确定该建筑物是否处于施工状态，如果未取得相关施工许可，即触发脚手架检测告警，及时通知相关责任人进行确认、排查。',
            },
          ]
          break
        case '砖堆&土堆&沙堆检测':
          this.list = [
            {
              name: '砖堆&土堆&沙堆检测',
            //   src: require('../assets/video/brick.mp4'),
              detail:
                '砖堆&土堆&沙堆检测通过智能分析算法判断建筑物周围或空地上是否砖堆、土堆、沙堆，如果出现上述图形特征，则可确定该建筑物是否处于施工状态或准备施工状态，如果未取得相关施工许可，即可触发砖堆、土堆、沙堆检测告警，及时通知相关责任人进行确认、排查。',
            },
          ]
          break
        case '工程车辆检测':
          this.list1 = [
            {
              name: '工程车辆检测',
              src: require('../assets/applicationArea/23.jpg'),
              detail:
                '工程车辆检测通过智能分析算法判断被监控画面中是否出现大型工程车辆，如果出现工程车辆图形特征，特别是长时间滞留的情况，可怀疑该区域正处于施工状态，如果未取得相关施工许可，即可触发工程车辆检测告警，及时通知相关责任人进行确认、排查。',
            },
          ]
          break
        case '非法开采检测':
          this.list1 = [
            {
              name: '非法开采检测',
              src: require('../assets/applicationArea/23.jpg'),
              detail:
                '对矿山等地形进行的私自开采行为进行检测，对地表变化进行比对，如果发现地表发生变化，且未取得相关施工许可，即可触发告警，及时通知相关责任人进行确认、排查。',
            },
          ]
          break
      }
    },
    backTo() {
      window.history.back()
    },
  },
  created() {
    this.getName()
  },
  mounted() {},
}
</script>

<style scoped>
.content {
  width: 100%;
}
.back {
  cursor: pointer;
}

.content .content-main {
  width: 1200px;
  margin: 0 auto;
  padding-top: 20px;
}

.content .content-main .bigtitle {
  font-size: 24px;
  font-weight: bold;
  color: #007af4;
}

.content .content-main .title {
  font-size: 16px;
  font-weight: bold;
  color: #007af4;
}
.content .content-main .video {
  width: 100%;
  height: 700px;
}

.content .content-main .detail {
  margin: 10px 0 20px;
  font-size: 14px;
  color: #ffffff;
}
</style>
