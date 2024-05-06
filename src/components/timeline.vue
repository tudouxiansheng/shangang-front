<template>
  <CusDialog
    isDetail
    :title="$t('application.trackList')"
    :width="576"
    appendToBody
    :visible="visible"
    @close="dialogclose"
    defaultBgc="smallBgc"
  >
    <div class="main" slot="body">
      <p class="total">{{ $t('application.trackTotal', { num: data.length }) }}</p>
      <div v-for="(item, index) of list" :key="index">
        <span class="el-icon-time"></span>
        <span class="time" @click="handleToggle(item)"
          >{{ item.time }}&nbsp;<span class="s">{{ $t('application.track', { size: item.list.length }) }}</span></span
        >
        <ul v-if="item.status && item.list.length > 0">
          <li v-for="(p, i) of item.list" :key="i">
            <i>—</i>
            <span @click="handleDetail(p)">{{ p.captureTime }}</span>
            <img v-viewer :src="p.detectUrl" alt="" />
            <!--            <span>{{ p.snapLocation }}</span>-->
            <span @click="handleDetail(p)" class="device-name" :title="p.cameraName">{{ p.cameraName }}</span>
          </li>
        </ul>
        <ul v-if="!item.status"></ul>
      </div>
    </div>
    <slot></slot>
  </CusDialog>
</template>
<script>
export default {
  name: 'timeline',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      list: [],
      activities: {
        total: 32,
        content: [
          {
            timestamp: '2022-03-29',
            content: '(9条)',
            status: true,
            children: [
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
            ],
          },
          {
            timestamp: '2022-03-29',
            content: '(9条)',
            status: true,
            children: [
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
            ],
          },
          {
            timestamp: '2022-03-29',
            content: '(9条)',
            status: true,
            children: [
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
              {
                timestamp: '15:53:53',
                img: '',
                num: '98.56%',
                pos: '设备运行位置',
              },
            ],
          },
        ],
      },
    }
  },
  watch: {
    data: {
      handler() {
        let obj = {}
        this.data.map((i) => {
          if (obj[i.time]) {
            obj[i.time].push(i)
          } else {
            obj[i.time] = [i]
          }
        })
        let temp = []
        Object.keys(obj).map((key) => {
          temp.push({
            time: key,
            list: obj[key],
            status: true,
          })
        })
        this.list = temp
      },
      deep: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleDetail(item) {
      this.$emit('detail', item)
    },
    handleToggle(item) {
      console.log(item)
      this.$set(item, 'status', !item.status)
    },
    dialogclose() {
      this.$emit('close')
    },
  },
}
</script>
<style scoped lang="scss">
.device-name {
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  /*文字超出宽度则显示ellipsis省略号*/
  text-overflow: ellipsis;
}
.main {
  --themeColor: #21fbf8;
  width: 100%;
  height: 519px;
  overflow: auto;
  color: #fff;
  .total {
    color: #1efffc;
    font-size: 14px;
  }
  .time {
    margin-left: 10px;
    .s {
      margin-left: 40px;
    }
  }
  > div {
    > span {
      pointer-events: all;
      cursor: pointer;
    }
    > ul {
      min-height: 40px;
      margin: 1em 0 0 6px;
      border-left: 2px solid var(--themeColor);
      > li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 90%;
        padding: 12px 0;
        > i {
          color: var(--themeColor);
          font-weight: 900;
        }
        > img {
          width: 40px;
          height: 40px;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
