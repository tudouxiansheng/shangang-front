<template>
  <div class="content">
    <div class="back" @click="backTo">
      <img src="../assets/fanhui.png" style="width: 50px" />
    </div>
    <div class="content-main" v-for="(item, index) in list" :key="index">
      <div class="bigtitle page">{{ item.name }}</div>
      <div>
        <p class="title page">定义</p>
        <p class="page">{{ item.definition }}</p>
      </div>
      <div>
        <div class="title page">客户价值</div>
        <ul class="list">
          <li class="page" v-for="(item1, index1) in item.value" :key="index1">
            {{ item1 }}
          </li>
        </ul>
      </div>
      <div>
        <div class="title page">功能描述</div>
        <ul class="list">
          <li
            class="page"
            v-for="(item2, index2) in item.function"
            :key="index2"
          >
            {{ item2 }}
          </li>
        </ul>
      </div>
      <div>
        <p class="title page">典型应用场景</p>
        <p class="page">{{ item.scene }}</p>
      </div>
      <div>
        <p class="what page">图1 典型应用场景</p>
        <img :src="item.img" alt class="img" />
      </div>
    </div>
    <div class="content-main1" v-for="(item, index) in listImg" :key="index">
      <div>
        <div class="bigtitle">{{ item.name }}</div>
      </div>
      <div style="padding-top: 20px">
        <div class="title">算法简介</div>
        <div class="detail">{{ item.detail }}</div>
      </div>
      <div>
        <div class="title">应用场景</div>
        <div class="detail">{{ item.scenario }}</div>
        <div>
          <p class="what page">图1 应用场景</p>
          <img :src="item.img" alt class="img" />
        </div>
        <img :src="item.src" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      listImg: [],
    }
  },
  methods: {
    getName() {
      var name = this.$router.history.current.query.name
      switch (name) {
        case '人群密度检测':
          this.list = [
            {
              name: '人群密度检测',
              definition:
                '人群密度检测是指在指定区域内检测是否人流量超过设置的阈值，当超过该阈值时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持多边形周界设置，支持设置多个区域',
                '支持设置密度告警阈值，当超过阈值时产生告警，并给出告警发生时的实际人群密度值',
              ],
              scene:
                '人群密度主要运用于商场、广场等大型公共区域，统计出来的结果可进行为人群引导和安全防范做参考。',
              img: require('../assets/applicationArea/d1.png'),
            },
          ]
          break
        case '人数计数':
          this.list = [
            {
              name: '人数计数',
              definition:
                '人数计数检测是指在指定区域内统计通过的人数，根据统计数据进行规律、趋势的分析，有助于针对性地改进。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '使用人数计数后，可以统计出超市、市场、商场等场所的人流量。根据统计出的结果进行规律、趋势的分析，有助于针对性地改进。',
                '采用人数计数后，可以实现系统自动统计数量，减少人工计数的误差和人力成本。',
              ],
              function: [
                '支持多边形周界设置，支持设置多个区域。',
                '支持对指定区域自动检测监控区域的人员进出总数，并生成统计信息。',
              ],
              scene:
                '人数统计主要运用于商业部门以及相关公共场所，适用于商场、超市、连锁店、展会、博物馆的出入口。',
              img: require('../assets/applicationArea/d2.png'),
            },
          ]
          break
        case '越线检测':
          this.list = [
            {
              name: '越线检测',
              definition:
                '越线检测是指在指定区域内设置警戒线和警戒方向，当有目标沿警戒方向穿过警戒线时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持警戒线和警戒方向设置。',
                '支持多目标同时越线检测，能够区分并识别所有目标，并标注告警。',
                '支持感兴趣区域设置，提高检测效率。',
              ],
              scene: '越线检测主要运用于轨道、仓库、公园等禁止进入区域检测。',
              img: require('../assets/applicationArea/d3.png'),
            },
          ]
          break
        case '入侵检测':
          this.list = [
            {
              name: '入侵检测',
              definition:
                '入侵检测是指在指定区域内设置边界，检查是否有目标进入该边界，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '当有监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持多边形周界设置，支持设置多个区域。',
                '支持多目标同时越界检测，能够区分并识别所有目标，并标注告警。',
                '支持感兴趣区域设置，提高检测效率。',
              ],
              scene:
                '入侵检测主要运用于住宅、校园、机场、军事区域等边界围墙，用于防范外来人员入侵，导致危险事故的发生。',
              img: require('../assets/applicationArea/d4.png'),
            },
          ]
          break
        case '物品移走检测':
          this.list = [
            {
              name: '物品移走检测',
              definition:
                '物品移走检测是指在指定区域内检测是否有指定的目标被移走，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持多边形周界设置，支持设置多个区域。',
                '可以设置物体允许遮挡时间，当移走物消失或遮挡物品超过设置时间，则触发告警。',
                '支持感兴趣区域设置，提高检测效率。',
              ],
              scene:
                '物品移走检测主要运用于博物馆、展览馆等场所，预防贵重物品等被移走。',
              img: require('../assets/applicationArea/d5.png'),
            },
          ]
          break
        case '物品遗留检测':
          this.list = [
            {
              name: '物品遗留检测',
              definition:
                '物品遗留检测是指在指定区域内检测是否有目标遗留，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持多边形周界设置，支持设置多个区域。',
                '可以设置遗留物告警时间，当遗留物遗留超过设置时间，则触发告警。',
                '支持感兴趣区域设置，提高检测效率。',
              ],
              scene:
                '物品遗留主要运用于机场、火车站、地铁站等公共场所，在警戒区域进行遗留物品检测，预防危险事件发生等事件。',
              img: require('../assets/applicationArea/d6.png'),
            },
          ]
          break
        case '方向检测':
          this.list = [
            {
              name: '方向检测',
              definition:
                '方向检测是指在指定区域内检测是否有目标按照指定方向运动，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '设置检测方向，当物体沿该检测方向运动时，则触发告警。',
                '支持感兴趣区域设置，提高检测效率和准确率。',
              ],
              scene:
                '方向检测主要运用于目标流量不高的园区道路、乡村道路，检查是否有逆行等事件发生。',
              img: require('../assets/applicationArea/d7.png'),
            },
          ]
          break
        case '徘徊检测':
          this.list = [
            {
              name: '徘徊检测',
              definition:
                '徘徊检测是指在指定区域内检测是否有目标滞留、徘徊行为进行检测，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持多边形监控区域设置，支持设置多个区域，只有进入区域内的目标才能触发告警。',
                '支持徘徊时间设置，目标在设定时间内离开则不触发告警，当徘徊时间超过设置阙值时告警。',
              ],
              scene:
                '徘徊检测主要运用于人流量较少的银行ATM附近、政府机关门口等区域，使管理员能够提前得知潜在威胁的所在。',
              img: require('../assets/applicationArea/d8.png'),
            },
          ]
          break
        case '路径检测':
          this.list = [
            {
              name: '路径检测',
              definition:
                '路径检测是指在指定区域内检测是否有目标按照指定路径运动，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持设置最多2个绊线(包括方向)，2个绊线和方向形成一个运动路径，符合该路径方向的目标产生告警。',
                '支持感兴趣区域设置，提高检测效率和准确率。',
              ],
              scene:
                '路径检测主要运用于目标流量不高的园区道路、乡村道路，检查是否有违章掉头等事件发生。',
              img: require('../assets/applicationArea/d9.png'),
            },
          ]
          break
        case '速度异常检测':
          this.list = [
            {
              name: '速度异常检测',
              definition:
                '速度异常检测是指在指定区域内检测是否有目标高于或低于设置的速度值运行，当有符合该条件的目标时，产生告警。',
              value: [
                '由系统代替客户人力自动检测视频中的关键信息，降低客户人力成本，提高效率。',
                '实现24小时全天候的严密监控，也可以根据现场情况灵活设置监控时间，减少由于监控人员疏忽引起的失误。',
                '监控人员只需在系统产生告警时观察实时视频画面，一个监控人员可以同时管理摄像机数量大幅上升，降低人力成本。',
              ],
              function: [
                '支持设置超速告警阈值，目标高于阈值速度产生告警。',
                '支持设置低速告警阈值，目标低于阈值速度产生告警。',
              ],
              scene:
                '速度异常检测主要运用于目标流量不高的园区道路、乡村道路，检查是否有超速、慢速等事件发生。',
              img: require('../assets/applicationArea/d10.png'),
            },
          ]
          break
        case '车牌识别':
          this.list = [
            {
              name: '车牌识别',
              definition:
                '车牌识别及布控，用于识别在监控区域内出现的车辆，以及识别车辆的车牌号码，并能对指定的车牌号码、车身颜色、车辆类型、品牌和子品牌进行布控。',
              value: [
                '由系统代替人力执行车牌号码的识别，有效节省人力成本、缩短识别时间。',
                '可将指定的车牌号码进行布控，系统自动识别监控区域的车牌号码并触发告警。',
              ],
              function: [
                '支持对历史录像、实时视频、抓拍图片进行车辆号牌、车牌颜色、车身颜色提取和识别。',
                '支持多个国家和地区的车牌识别。',
                '支持对检索出来车牌目标进行轨迹展示。',
                '支持根据感兴趣区域进行车牌识别，提升识别效率。',
                '支持黑名单，将指定车牌号码纳入黑名单，一旦发现该车牌号码立即产生告警。',
                '支持模糊搜索，即使记不住全部车牌，只记住了车牌的部分数字或字母，也能通过设置搜索条件，检索出所有可能出现的车牌。',
              ],
              scene:
                '典型应用场景主要为停车场、高速公路、小区等出入口以及收费站等场景。',
              img: require('../assets/applicationArea/d11.png'),
            },
          ]
          break
        case '车辆特征检测':
          this.list = [
            {
              name: '车辆特征检测',
              definition:
                '车辆特征识别用于识别监控区域出现车辆颜色、车辆方向、车辆类型、车辆品牌、车辆子品牌、年款和局部特征，将车辆特征信息进行结构化处理，便于后续根据业务需要进行车辆的搜索。',
              value: [
                '车辆特征识别可作为车牌模糊识别时缩小搜索范围的辅助手段。',
                '车辆特征识别可独立应于车辆搜索，有效地缩小搜索范围，提升排查效率。',
              ],
              function: [
                '支持对视频中的车辆进行车身颜色、车辆方向、车辆类型、车辆品牌、车辆子品牌和年款的提取和识别。',
                '支持对抓拍图片进行车身颜色、车辆方向、车辆类型、车辆品牌、车辆子品牌、年款和局部特征的提取和识别。',
                '支持车辆识别结果作为车牌模糊搜索时的过滤项。',
                '支持以车辆的特征进行以图搜车。',
              ],
              scene:
                '典型应用场景主要为停车场、高速公路、小区等出入口以及收费站等场景。',
              img: require('../assets/applicationArea/d12.png'),
            },
          ]
          break
        case '人脸检测':
          this.list = [
            {
              name: '人脸检测',
              definition:
                '提取图片中的人脸坐标，并分析图片中人脸的属性，包括年龄、性别',
              value: [
                '由系统代替人力执行人脸识别，有效节省人力成本、缩短识别时间。',
                '可将指定的人脸进行布控，系统自动识别监控区域的人脸并触发告警。',
              ],
              function: [
                '支持白色、黄色、黑色人种人脸检测。',
                '支持对实时视频和历史视频进行人脸分析，提取人脸图片和人脸特征实时入路人库，历史视频分析支持分片模式分布式加速。',
              ],
              scene:
                '典型应用场景主要为公安、新零售、智能考勤、人脸鉴权等场景。',
              img: require('../assets/applicationArea/d13.png'),
            },
          ]
          break
        case '人脸比对':
          this.list = [
            {
              name: '人脸比对',
              definition:
                '对比两张图像中的人脸信息，分析面部特征，判断是否为同一人',
              value: [
                '由系统代替人力执行人脸识别，有效节省人力成本、缩短识别时间。',
                '可将指定的人脸进行布控，系统自动识别监控区域的人脸并触发告警。',
              ],
              function: [
                '支持白色、黄色、黑色人种人脸比对。',
                '支持对实时视频和历史视频进行人脸比对，提取人脸图片和人脸特征实时入路人库，历史视频分析支持分片模式分布式加速。',
              ],
              scene:
                '典型应用场景主要为公安、新零售、智能考勤、人脸鉴权等场景。',
              img: require('../assets/applicationArea/d13.png'),
            },
          ]
          break
        case '人脸检索':
          this.list = [
            {
              name: '人脸检索',
              definition: '搜索图库并返回与输入人脸最相似的N张人脸图像',
              value: [
                '由系统代替人力执行人脸识别，有效节省人力成本、缩短识别时间。',
                '可将指定的人脸进行布控，系统自动识别监控区域的人脸并触发告警。',
              ],
              function: [
                '支持白色、黄色、黑色人种人脸检索。',
                '支持对实时视频和历史视频进行人脸分析，提取人脸图片和人脸特征实时入路人库，历史视频分析支持分片模式分布式加速。',
                '支持对检索出来人脸目标进行轨迹展示。',
                '支持人脸静态库管理和检索：首先导入人员信息库图片信息，然后手动上传图片在该人员信息库中进行检索。',
              ],
              scene:
                '典型应用场景主要为公安、新零售、智能考勤、人脸鉴权等场景。',
              img: require('../assets/applicationArea/d13.png'),
            },
          ]
          break
        case '安全帽检测':
          this.listImg = [
            {
              name: '安全帽检测',
              src: require('../assets/applicationArea/d14.png'),
              detail: '暂缺',
              scenario: '动态监测、门禁通道',
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
}
</script>

<style scoped>
.content {
  width: 100vw;
}
.content li {
  list-style: disc;
}

.content .content-main,
.content .content-main1 {
  width: 1200px;
  margin: 0 auto;
  padding-top: 60px;
  font-size: 14px;
}
.content .content-main .bigtitle,
.content .content-main1 .bigtitle {
  color: #007af4;
  font-size: 24px;
  font-weight: bold;
}
.content .content-main .title,
.content .content-main1 .title {
  color: #007af4;
  font-size: 16px;
  font-weight: bold;
}

.content .content-main .page,
.content .content-main1 .page {
  padding-top: 20px;
  color: #ffffff;
}

.content .content-main .list {
  padding-left: 20px;
}

.content .content-main .what,
.content .content-main1 .what {
  font-weight: bold;
}

.content .content-main .img {
  margin: 10px 0 20px;
  width: 480px;
}

.content .content-main1 .video {
  width: 100%;
  height: 700px;
}

.content .content-main1 .detail {
  margin: 10px 0 20px;
  font-size: 14px;
}
</style>
