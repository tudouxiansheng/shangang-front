<template>
  <div class="productCenterContainer">
    <div class="ableTabs">
      <div
        v-for="(item, index) in tabs"
        :key="index"
        class="ableTab"
        :class="item.id == activeIndex ? 'toggle' : ''"
        @click="tabChage(item.id)"
      >
        {{ item.title }}
      </div>
    </div>
    <!-- 视频识别类 -->
    <div class="casesList" v-if="activeIndex == 0">
      <div
        class="caseItem"
        v-for="(item, index) in caseInfosVideo1"
        :key="index"
        @click="goDetail(item)"
      >
        <div class="caseImg">
          <img :src="item.caseImg" style="width: 100%" alt />
        </div>
        <div class="caseContent">
          <div class="caseTitle">{{ item.name }}</div>
          <div class="caseContentItem">{{ item.caseContent }}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: flex-start; flex-wrap: wrap">
        <div
          class="caseItem"
          v-for="(item, index) in caseInfosVideo2"
          :key="index + 1"
          @click="goDetail(item)"
        >
          <div class="caseImg">
            <img :src="item.caseImg" style="width: 100%" alt />
          </div>
          <div class="caseContent">
            <div class="caseTitle">{{ item.name }}</div>
            <div class="caseContentItem">{{ item.caseContent }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- 行为分析类 -->
    <div class="casesList" v-if="activeIndex == 1">
      <div
        class="caseItem"
        v-for="(item, index) in behaviorAnalysisList"
        :key="index"
        @click="goDetailTwo(item)"
      >
        <div class="caseImg">
          <img :src="item.caseImg" style="width: 100%" alt />
        </div>
        <div class="caseContent">
          <div class="caseTitle">{{ item.name }}</div>
          <div class="caseContentItem">{{ item.caseContent }}</div>
        </div>
      </div>
    </div>
    <!-- 人脸识别类 -->
    <div class="casesList" v-if="activeIndex == 2">
      <div
        class="caseItem"
        v-for="(item, index) in FaceRecognitionList"
        :key="index"
        @click="goDetailTwo(item)"
      >
        <div class="caseImg">
          <img :src="item.caseImg" alt style="width: 100%" />
        </div>
        <div class="caseContent">
          <div class="caseTitle">{{ item.name }}</div>
          <div class="caseContentItem">{{ item.caseContent }}</div>
        </div>
      </div>
    </div>
    <!-- 人员检测类 -->
    <div class="casesList" v-if="activeIndex == 3">
      <div
        class="caseItem"
        v-for="(item, index) in PersonnelTestingList"
        :key="index"
        @click="goDetailTwo(item)"
      >
        <div class="caseImg">
          <img :src="item.caseImg" alt style="width: 100%" />
        </div>
        <div class="caseContent">
          <div class="caseTitle">{{ item.name }}</div>
          <div class="caseContentItem">{{ item.caseContent }}</div>
        </div>
      </div>
    </div>
    <!-- 目标识别类 -->
    <div class="casesList" v-if="activeIndex == 4">
      <div
        class="caseItem"
        v-for="(item, index) in targetRecognitionList"
        :key="index"
        @click="goDetailTwo(item)"
      >
        <div class="caseImg">
          <img :src="item.caseImg" alt style="width: 100%" />
        </div>
        <div class="caseContent">
          <div class="caseTitle">{{ item.name }}</div>
          <div class="caseContentItem">{{ item.caseContent }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bannerUrl: [
        // require('../assets/homePage/banner1.png'),
        // require("../assets/homePage/banner.png")
        require('../assets/homePage/banner2.png'),
      ],
      tabs: [
        {
          id: 0,
          title: '视频识别类',
        },
        {
          id: 1,
          title: '行为分析类',
        },
        {
          id: 2,
          title: '人脸识别类',
        },
        {
          id: 3,
          title: '人员检测类',
        },
        {
          id: 4,
          title: '目标识别类',
        },
      ],
      activeIndex: 0,
      caseInfosVideo1: [
        {
          id: 1,
          caseImg: require('../assets/applicationArea/air4.png'),
          name: '火焰检测',
          caseContent:
            '基于视频图像的火焰检测方法融合了计算机视觉、数字图像处理、模式识别和信号处理等方面的技术，不受环境和距离的限制',
        },
        {
          id: 2,
          caseImg: require('../assets/applicationArea/air5.png'),
          name: '烟雾检测',
          caseContent:
            '烟雾检测是与火焰检测同时进行的，用于提升检测能力，通过利用分块和背景差分提取运动区域，在空间建立烟雾颜色模型',
        },
        {
          id: 3,
          caseImg: require('../assets/applicationArea/air6.png'),
          name: '违章加盖检测',
          caseContent:
            '通过原始图片和抓拍现场图片的对比，识别对农业用地或楼顶等公共区域的非法占用及违章加盖',
        },
        {
          id: 4,
          caseImg: require('../assets/applicationArea/air7.png'),
          name: '脚手架检测',
          caseContent:
            '脚手架检测是通过智能分析算法判断建筑物外立面上是否安装有脚手架设施，从而确定该建筑物是否处于施工状态',
        },
      ],
      caseInfosVideo2: [
        {
          id: 1,
          caseImg: require('../assets/applicationArea/air8.png'),
          name: '砖堆&土堆&沙堆检测',
          caseContent:
            '砖堆&土堆&沙堆检测通过智能分析算法判断建筑物周围或空地上是否砖堆、土堆、沙堆，如果出现上诉图形特征，则可确定',
        },
        {
          id: 2,
          caseImg: require('../assets/applicationArea/air9.png'),
          name: '工程车辆检测',
          caseContent:
            '工程车辆检测通过智能分析算法判断被监控画面中是否出现大型工程车辆，如果出现工程车辆图形特征，特别是长时间滞留的情节',
        },
        {
          id: 3,
          caseImg: require('../assets/applicationArea/air10.png'),
          name: '非法开采检测',
          caseContent:
            '对矿石等地形进行的私自开采行为进行检测，对地表变化进行对比，如果发现地表发生变化，且未取得相关施工许可，即可触发',
        },
      ],
      // 行为分析类
      behaviorAnalysisList: [
        {
          id: 1,
          caseImg: require('../assets/applicationArea/air11.png'),
          name: '越线检测',
          caseContent:
            '越线检测是指在指定区域内设置警戒线和警戒方向，当有目标沿警戒方向穿过警戒线时，产生告警',
        },
        {
          id: 2,
          caseImg: require('../assets/applicationArea/air1.png'),
          name: '入侵检测',
          caseContent:
            '入侵检测是指在指定区域内 设置边界，检查是否有目标进入该边界，当有符合该条件的目标时，产生告警',
        },
        {
          id: 3,
          caseImg: require('../assets/applicationArea/air2.png'),
          name: '物品移走检测',
          caseContent:
            '入侵检测物品移走检测是指在指定区域内检测是否有指定的目标被移走，当有符合该条件的目标时，产生告警',
        },
        {
          id: 4,
          caseImg: require('../assets/applicationArea/air3.png'),
          name: '物品遗留检测',
          caseContent:
            '物品遗留检测是指在指定区域内检测是否有目标遗留，当有符合该条件时，产生告警',
        },
        {
          id: 5,
          caseImg: require('../assets/applicationArea/7.jpg'),
          name: '方向检测',
          caseContent:
            '方向检测是指在指定区域内检测是否有目标按照指定方向运动，当有符合该条件的目标时，产生告警。',
        },
        {
          id: 6,
          caseImg: require('../assets/applicationArea/8.jpg'),
          name: '徘徊检测',
          caseContent:
            '徘徊检测是指在指定区域内检测是否有目标滞留、徘徊行为进行检测，当有符合该条件的目标时，产生告警。',
        },
        {
          id: 7,
          caseImg: require('../assets/applicationArea/9.jpg'),
          name: '路径检测',
          caseContent:
            '路径检测是指在指定区域内检测是否有目标按照指定路径运动，当有符合该条件的目标时，产生告警。',
        },
        {
          id: 8,
          caseImg: require('../assets/applicationArea/10.jpg'),
          name: '速度异常检测',
          caseContent:
            '速度异常检测是指在指定区域内检测是否有目标高于或低于设置的速度值运行，当有符合该条件的目标时，产生告警。',
        },
      ],
      // 人员检测类
      PersonnelTestingList: [
        {
          id: 1,
          caseImg: require('../assets/applicationArea/1.jpg'),
          name: '人群密度检测',
          caseContent:
            '人群密度检测是指在指定区域内检测是否人流量超过设置的阈值，当超过该阈值时，产生告警。',
        },
        {
          id: 2,
          caseImg: require('../assets/applicationArea/2.jpg'),
          name: '人数计数',
          caseContent:
            '人数计数检测是指在指定区域内统计通过的人数，根据统计数据进行规律、趋势的分析，有助于针对性地改进。',
        },
        {
          id: 3,
          caseImg: require('../assets/applicationArea/19.jpg'),
          name: '安全帽检测',
          caseContent: '对安全帽佩戴识别检测。',
        },
      ],
      // 人脸识别类
      FaceRecognitionList: [
        {
          id: 1,
          caseImg: require('../assets/applicationArea/17.png'),
          name: '人脸检测',
          caseContent:
            '提取图片中的人脸坐标，并分析图片中人脸的属性，包括年龄、性别',
        },
        {
          id: 2,
          caseImg: require('../assets/applicationArea/18.jpg'),
          name: '人脸比对',
          caseContent:
            '对比两张图像中的人脸信息，分析面部特征，判断是否为同一人',
        },
        {
          id: 3,
          caseImg: require('../assets/applicationArea/16.png'),
          name: '人脸检索',
          caseContent: '搜索图库并返回与输入人脸最相似的N张人脸图像',
        },
      ],
      // 目标识别类
      targetRecognitionList: [
        {
          id: 1,
          caseImg: require('../assets/applicationArea/11.jpg'),
          name: '车牌识别',
          caseContent:
            '车牌识别及布控，用于识别在监控区域内出现的车辆，以及识别车辆的车牌号码，并能对指定的车牌号码、车身颜色、车辆类型、品牌和子品牌进行布控。',
        },
        {
          id: 2,
          caseImg: require('../assets/applicationArea/12.jpg'),
          name: '车辆特征检测',
          caseContent:
            '车辆特征识别用于识别监控区域出现车辆颜色、车辆方向、车辆类型、车辆品牌、车辆子品牌、年款和局部特征，将车辆特征信息进行结构化处理，便于后续根据业务需要进行车辆的搜索。',
        },
      ],
    }
  },
  components: {},
  methods: {
    tabChage(index) {
      this.activeIndex = index
    },
    goDetailTwo(item) {
      this.$router.push({
        path: '/ProductCenter/detailTwo',
        query: {
          name: item.name,
        },
      })
    },
    goDetail(item) {
      this.$router.push({
        path: '/ProductCenter/detail',
        query: {
          name: item.name,
        },
      })
    },
  },
}
</script>

<style lang="scss">
// img {
//   width: 100%;
// }
ul,
li {
  padding: 0;
  margin: 0;
}

.productCenterContainer {
  width: 100%;

  .bannerBox {
    min-width: 1200px;
    height: 600px;
  }

  /* 轮播图以下 */
  .ableTabs {
    width: 1200px;
    margin: 59px auto 50px;
    display: flex;
    justify-content: flex-start;
  }

  .ableTab {
    cursor: pointer;
    margin-right: 120px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }

  .toggle {
    font-size: 20px;
    font-weight: 600;
    color: rgba(0, 189, 255, 1);
  }

  .casesList {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .caseItem {
    width: 253px;
    height: 350px;
    background: rgba(242, 242, 242, 1);
    border: 1px solid rgba(230, 230, 230, 1);
    margin: 0px 60px 60px 0px;
    border-radius: 8px;
    cursor: pointer;
  }

  .caseItem:nth-child(4n) {
    margin-right: 0;
  }

  .caseImg {
    width: 230px;
    height: 172px;
    margin: 10px auto 0;
  }

  .caseContent {
    margin: 0 10px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: gray;
  }

  .caseTitle {
    box-sizing: border-box;
    padding: 25px 0 15px 10px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 600;
    color: rgba(26, 26, 26, 1);
  }

  .caseContentItem {
    margin: 0 10px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(128, 128, 128, 1);
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    ///*! autoprefixer: off */
    //-webkit-box-orient: vertical;
    ///* autoprefixer: on */
    //-webkit-line-clamp: 4; // 最多显示四行
  }
}
</style>
