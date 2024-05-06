<template>
  <CusDialog
    :title="$t('worktable.NotificationDetails')"
    :visible="visible"
    isDetail
    @close="dialogClosed"
    :width="800"
  >
    <el-form slot="body" label-suffix=":" label-position="right" label-width="auto" class="form">
      <el-form-item :label="$t('worktable.sender')">
        {{ propValue.senderUserName }}
      </el-form-item>
      <el-form-item :label="$t('worktable.recipient')">
        {{ propValue.receivers }}
      </el-form-item>
      <el-form-item :label="$t('worktable.notificationTitle')">
        {{ propValue.noticeTitle }}
      </el-form-item>
      <el-form-item :label="$t('worktable.notificationType')">
        {{ setInfoType(propValue.noticeType) }}
      </el-form-item>
      <el-form-item :label="$t('worktable.notificationImage')">
        <div class="notice-pic">
          <div class="imgPic" v-for="(item, index) in propValue.noticeFileMapList" :key="index">
            <video controls="controls" v-if="item.noticeFileType == 2" :src="item.noticeFileUrl" />

            <img v-viewer v-if="item.noticeFileType == 1" :src="item.noticeFileUrl" />
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('worktable.creationTime')">
        {{ propValue.time }}
      </el-form-item>
      <el-form-item :label="$t('worktable.text')">
        <div v-html="propValue.content" class="textC"></div>
      </el-form-item>
    </el-form>
  </CusDialog>
</template>

<script>
import { getNoticeList } from '@/utils/api'
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false,
    },
    propValue: {
      type: Object,
      default: () => {
        return {
          title: '标题',
          content: '',
        }
      },
    },
  },
  data() {
    return {
      noticeTypeList: null, //通知列表
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 设置类型
    setInfoType(value) {
      return this.noticeTypeList?.find((n) => n.id == value)?.noticeTypeName
    },
    // 获取告警列表
    getList() {
      getNoticeList({
        pageInfo: {
          pageNum: 1,
          pageSize: 1000,
        },
      }).then((res) => {
        if (res.resultCode == 0) {
          this.noticeTypeList = res.noticeTypeInfoList
        }
      })
    },
    dialogClosed() {
      this.$emit('update:visible', false)
    },
  },
}
</script>

<style scoped lang="scss">
.form {
  color: #fff;
  .notice-pic {
    display: flex;
    flex-wrap: wrap;
    .imgPic {
      width: 120px;
      height: 120px;
      cursor: pointer;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  .textC {
    min-height: 63px;
    color: #ccc;
    margin-top: -14px;
  }
}
</style>
