<template>
  <CusDialog @close="handleClose" :visible="visible" :title="$t('alarm.detail')" isDetail :appendToBody="true">
    <div class="alarmDetail" slot="body">
      <div class="left">
        <img v-viewer :src="info.captureImage" alt="" />
      </div>
      <div class="right">
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('alarm.alarmType') }}：</div>
          <div class="item-value">{{ isZh ? info.alarmName : info.alarmType || info.alarmName }}</div>
        </div>
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('alarm.alarmLevel') }}：</div>
          <div class="item-value" :class="setLevelClass(info.alarmLevel)">{{ setAlarmLevel(info.alarmLevel) }}</div>
        </div>
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('alarm.alarmTime') }}：</div>
          <div class="item-value" :title="info.hitTime">{{ info.hitTime }}</div>
        </div>
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.deviceName') }}：</div>
          <div class="item-value" :title="info.deviceName">{{ info.deviceName }}</div>
        </div>
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.devicePos') }}：</div>
          <div class="item-value" :title="info.installLocate">
            {{ info.installLocate ? info.installLocate : $t('public.unknown') }}
          </div>
        </div>
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">
            {{ info.repositoryType == 1 ? $t('application.plateNum') : $t('home.name') }}：
          </div>
          <div class="item-value">{{ info.repositoryType == 1 ? info.lpn : info.personName }}</div>
        </div>
        <div class="alarm-detail-item">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.library') }}：</div>
          <div class="item-value" :title="info.repositoryName">{{ info.repositoryName }}</div>
        </div>
        <div class="alarm-detail-item" v-if="info.repositoryType != 1">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('application.personType') }}：</div>
          <div class="item-value">
            {{ info.repositoryType == 3 ? $t('application.whitelist') : $t('application.blacklist') }}
          </div>
        </div>

        <div class="alarm-detail-item" v-if="info.repositoryType == 2">
          <div class="item-label" :class="isZh ? '' : 'en'">{{ $t('public.similarity') }}：</div>
          <div class="item-value" v-if="info.similarity">{{ info.similarity.toFixed(2) }}%</div>
        </div>
        <div class="alarm-detail-item">
          <div class="replay" @click="goToVideo(info)">
            <span style="display: flex; align-items: center">
              <img src="../../../../../assets/alarmImg/录像.png" alt />
              {{ $t('application.alarmVideo') }}
            </span>
          </div>
        </div>
        <div v-if="false" class="alarm-detail-item" @click="goToLive(info)">
          <div class="live">
            <span style="display: flex; align-items: center">
              <img src="../../../../../assets/alarmImg/实况.png" alt />
              {{ $t('application.live') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </CusDialog>
</template>

<script>
import VideoScreen from "@/mixin/VideoScreen" //查看视频
export default {
  name: 'select-dialog',
  mixins:[VideoScreen],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    info: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      checkList: [],
    }
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  methods: {
    setLevelClass(val) {
      if (val == 1) {
        return 'level1'
      } else if (val == 2) {
        return 'level2'
      } else if (val == 3) {
        return 'level3'
      } else if (val == 4) {
        return 'level4'
      }
    },
    setAlarmLevel(val) {
      switch (val) {
        case 1:
          return this.$t('home.level1')
        case 2:
          return this.$t('home.level2')
        case 3:
          return this.$t('home.level3')
        case 4:
          return this.$t('home.level4')
      }
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
.level1 {
  color: #ff4d4f;
}
.level2 {
  color: #ff4e00;
}
.level3 {
  color: #ffa900;
}
.level4 {
  color: #00ccff;
}

.alarmDetail {
  color: #fff;
  display: flex;
  .left {
    width: 480px;
    height: 360px;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .right {
    flex: 1;
    margin-left: 15px;
    overflow: hidden;
    .alarm-detail-item {
      display: flex;
      margin-bottom: 15px;
      .item-label {
        width: 85px;
        margin-right: 5px;
        white-space: nowrap;
        color: #ccc;
        text-align: right;
        &.en {
          width: 120px;
        }
      }
      .item-value {
        flex: 1;
        overflow: hidden;
        white-space: nowrap;
        /*文字超出宽度则显示ellipsis省略号*/
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
