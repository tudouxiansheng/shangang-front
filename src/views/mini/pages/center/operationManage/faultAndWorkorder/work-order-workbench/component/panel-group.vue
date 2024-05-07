<template>
  <el-row :gutter="20" class="panel-group">
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="{ span: '1-5' }" class="card-panel-col">
      <div class="ac-card-box">
        <div class="ac-card-left">
          <div class="ac-card-title" :title="$t('operateManage.repairing')">
            {{ $t('operateManage.repairing') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="statMap.repairing"
            :duration="2600"
            class="ac-card-subtitle"
          />
        </div>
        <div class="ac-card-right">
          <img :src="imgs[0]" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="{ span: '1-5' }" class="card-panel-col">
      <div class="ac-card-box">
        <div class="ac-card-left">
          <div class="ac-card-title" :title="$t('dictConst.pendingAudit')">
            {{ $t('dictConst.pendingAudit') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="statMap.toAudit"
            :duration="2600"
            class="ac-card-subtitle"
          />
        </div>
        <div class="ac-card-right">
          <img :src="imgs[1]" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="{ span: '1-5' }" class="card-panel-col">
      <div class="ac-card-box">
        <div class="ac-card-left">
          <div class="ac-card-title" :title="$t('faultAndWorkorder.suspended')">
            {{ $t('faultAndWorkorder.suspended') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="statMap.suspended"
            :duration="2600"
            class="ac-card-subtitle"
          />
        </div>
        <div class="ac-card-right">
          <img :src="imgs[2]" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="{ span: '1-5' }" class="card-panel-col">
      <div class="ac-card-box">
        <div class="ac-card-left">
          <div class="ac-card-title" :title="$t('faultAndWorkorder.delay')">
            {{ $t('faultAndWorkorder.delay') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="statMap.delayed"
            :duration="2600"
            class="ac-card-subtitle"
          />
        </div>
        <div class="ac-card-right">
          <img :src="imgs[3]" />
        </div>
      </div>
    </el-col>
    <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="{ span: '1-5' }" class="card-panel-col">
      <div class="ac-card-box">
        <div class="ac-card-left">
          <div class="ac-card-title" :title="$t('faultAndWorkorder.closed')">
            {{ $t('faultAndWorkorder.closed') }}
          </div>
          <count-to
            :start-val="0"
            :end-val="statMap.closed"
            :duration="2600"
            class="ac-card-subtitle"
          />
        </div>
        <div class="ac-card-right">
          <img :src="imgs[4]" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      imgs: [
        require('@/assets/img/common/governance-workplace1.png'),
        require('@/assets/img/common/governance-workplace2.png'),
        require('@/assets/img/common/governance-workplace3.png'),
        require('@/assets/img/common/governance-workplace4.png'),
        require('@/assets/img/common/governance-workplace5.png')
      ],
      statMap: {
        repairing: 0,
        toAudit: 0,
        suspended: 0,
        delayed: 0,
        closed: 0
      }
    }
  },
  created() {
    this.getWorkorderSummaryInfo()
  },
  methods: {
    async getWorkorderSummaryInfo() {
      let res = await this.$api.getWorkorderSummaryInfo()
      if (res.resultCode == 0) {
        this.statMap = {
          repairing: res.repairing,
          toAudit: res.toAudit,
          suspended: res.suspended,
          delayed: res.delayed,
          closed: res.closed
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  padding: 20px 0px 0 20px;
  margin-left: 0 !important;
  margin-right: 0 !important;
  .card-panel-col {
    margin-bottom: 20px;
  }

  .ac-card-box {
    box-sizing: border-box;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 12% 10% 12% 8%;
    border-radius: 5px;

    .ac-card-left {
      flex: 1;
      text-align: left;
      max-width: 80%;
      &.center {
        text-align: center;
      }

      .ac-card-title {
        font-size: 16px;
        margin-bottom: 5px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        width: 90%;
      }

      .ac-card-subtitle {
        font-size: 26px;
        font-weight: bold;
      }
    }

    .ac-card-right {
      width: 58px;
      height: 58px;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }

  .card-panel-col:nth-child(1) .ac-card-box {
    background: linear-gradient(180deg, #4e94f8, #7eb3ff);
    margin-left: 0;
  }

  .card-panel-col:nth-child(2) .ac-card-box {
    background: linear-gradient(180deg, #ff6b6b, #ff9292);
  }

  .card-panel-col:nth-child(3) .ac-card-box {
    background: linear-gradient(180deg, #968ce4, #afa6f7);
  }

  .card-panel-col:nth-child(4) .ac-card-box {
    background: linear-gradient(180deg, #ffd145, #ffdf7f);
  }

  .card-panel-col:nth-child(5) .ac-card-box {
    background: linear-gradient(180deg, #3de0bf, #77f6dc);
    margin-right: 0;
  }
}
</style>
