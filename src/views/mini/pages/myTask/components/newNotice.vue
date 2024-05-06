<template>
  <div class="new-notice">
    <div v-if="listData.length === 0" class="noData">{{ $t('public.empty') }}</div>
    <div v-else class="notice-content">
      <div class="new-notice-item" v-for="(item, index) in listData" :key="index" @click="getDetailById(item)">
        <div class="item-left" :title="item.noticeTitle">
          {{ item.noticeTitle }}
        </div>
        <div class="item-right">
          {{ item.updateTime }}
        </div>
      </div>
      <NoticeDetail :visible.sync="showDetail" :propValue="detailData" />
    </div>
  </div>
</template>
<script>
import { noticeList, noticeDetail } from '@/utils/api'
import NoticeDetail from './comp/noticeDetail.vue'
export default {
  components: { NoticeDetail },
  data() {
    return {
      listData: [],
      pageInfo: {
        pageNum: 1,
        pageSize: 5,
      },
      showDetail: false,
      detailData: {
        title: '',
        content: '',
        time: '',
      },
    }
  },
  mounted() {
    this.getNoticesList()
  },
  methods: {
    async getNoticesList() {
      const params = {
        pageInfo: this.pageInfo,
      }
      const res = await noticeList(params)
      if (res.resultCode != 0) return

      this.listData = res.noticeInfoList
    },
    async getDetailById(item) {
      const params = {
        noticeId: item.noticeId,
      }
      const res = await noticeDetail(params)
      let arr = []
      if (res.noticeInfo.noticeReceiverInfoList.length === 0) {
        res.noticeInfo['receivers'] = ''
      } else {
        res.noticeInfo.noticeReceiverInfoList.forEach((item) => {
          arr.push(item.receiverName)
        })
        res.noticeInfo['receivers'] = arr.join(',')
      }
      this.detailData = {
        ...res?.noticeInfo,
        title: res.noticeInfo.noticeTitle,
        content: res.noticeInfo.noticeContentHtml,
        time: res.noticeInfo.updateTime,
      }
      this.showDetail = true
    },
  },
}
</script>
<style scoped lang="scss">
.new-notice {
  height: 100%;

  .notice-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .noData {
    width: 100%;
    height: 80%;
    display: flex;
    padding-top: 20px;
    font-size: 14px;
    color: #fff;
    text-align: center;
    flex-direction: column;
    justify-content: space-around;
  }
  .new-notice-item {
    display: flex;
    justify-content: space-between;
    width: 556px;
    height: 20%;
    margin-bottom:4px;
    background-image: url('../img/noticeBg.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    align-items: center;
    padding: 0 10px 0 42px;
    cursor: pointer;
    .item-left {
      font-size: 18px;
      font-weight: normal;
      text-shadow: 0px 4px 4px rgba(149, 244, 255, 0.25);
      width: 240px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-style: italic;
    }
    .item-right {
      font-size: 14px;
      font-weight: 400;
    }
  }
}
</style>
