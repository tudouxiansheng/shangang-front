<template>
  <!--子工单详情-->
  <div class="childDetailApproval">
    <el-dialog
      :visible.sync="$parent.childDialogDetailVisiable"
      top="10vh"
      width="678px"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :title="$t('work.childDetail')"
    >
      <div class="dialog-content">
        <div class="dealInfo" v-for="(item, index) in childWorkSheetInfoList" :key="index">
          <div class="topTitle">
            <div class="line"></div>
            <div class="name">{{ $t('work.handleInfo') }}</div>
          </div>
          <div class="childwrapper">
            <div class="childContent">
              <div class="leftContent">
                <div class="myspan">{{ $t('work.handler') }}：</div>
                <el-input style="width: 80%" v-model="item.handlerName" :disabled="true"></el-input>
              </div>
              <div class="leftContent">
                <div class="myspan">{{ $t('public.createTime') }}：</div>
                <el-input style="width: 80%" v-model="item.createTime" :disabled="true"></el-input>
              </div>
            </div>
            <div class="des">
              <div class="myspan">{{ $t('work.opinion') }}：</div>
              <textarea class="mytextArea mywidth" v-model="item.opinion" :disabled="true"></textarea>
            </div>
          </div>
          <div class="topTitle mytop" v-if="item.state == 3 || item.state == 2">
            <div class="line"></div>
            <div class="name">{{ $t('work.auditOpinion') }}</div>
          </div>
          <div
            class="title fujian"
            style="margin-left: 20px; display: flex; margin-top: 20px"
            v-if="item.childWorkSheetAttachmentList"
          >
            <div style="width: 78px; text-align: center">{{ $t('work.attachment') }}：</div>
            <div class="source" v-for="(item, index2) in item.childWorkSheetAttachmentList" :key="index2">
              <img
                :src="item.fileUrl"
                style="width: 60px; height: 60px; margin-right: 10px"
                v-if="item.fileType == 1"
              />

              <video width="60" height="60" controls v-if="item.fileType == 2" style="margin-right: 10px" autoplay>
                <source :src="item.fileUrl" type="video/mp4" />
              </video>
            </div>
          </div>

          <el-form
            ref="form"
            class="form"
            label-suffix=":"
            style="margin-top: 20px"
            label-width="120px"
            v-if="item.state == 3 || item.state == 2"
          >
            <el-form-item :label="$t('work.auditResult')">
              <el-radio-group v-model="item.state" :disabled="true">
                <el-radio :label="2">{{ $t('work.p') }}</el-radio>
                <el-radio :label="3">{{ $t('work.r') }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('work.reviewer')">
              <el-select
                :placeholder="$t('public.placeholderSelect', { type: $t('work.reviewer') })"
                v-model="item.reviewerName"
                style="width: 391px"
                suffix-icon="el-icon-user"
              >
                <el-option
                  v-for="item in $parent.userList"
                  :key="item.userId"
                  :label="item.userName"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('work.auditOpinion')">
              <textarea class="mytextArea" v-model="item.suggestion" :disabled="true"></textarea>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getChildWorkSheet } from '@/utils/api'
export default {
  props: ['childWorkSheetId'],
  data() {
    return {
      childWorkSheetInfoList: [], //子工单列表
    }
  },
  methods: {
    //打开工单详情
    dialogOpen() {
      //获取子工单列表
      getChildWorkSheet({
        pageInfo: { pageSize: 15, pageNum: 1 },
        childWorkSheetId: this.childWorkSheetId,
      }).then((res) => {
        if (res.resultCode == 0) {
          if (res.resultCode == 0) {
            this.childWorkSheetInfoList = res.childWorkSheetInfoList
          }
        }
      })
    },
    dialogClosed() {
      this.childWorkSheetInfoList = []
    },
  },
}
</script>

<style lang="scss" scoped>
.dialog-content {
  height: 600px;
  overflow-y: auto;
  overflow-x: hidden;
}
.mytextArea {
  background-color: transparent;
  resize: none;
  width: 100%;
  height: 80px;
  color: #fff;
}
.childDetailApproval {
  .el-dialog__body {
    padding-top: 10px !important;
  }
  /*el-label 的颜色 */
  .el-form-item__label {
    color: #b3b3b3;
  }
  .el-form-item__label {
    color: #b3b3b3;
  }
  .el-radio {
    color: #ffffff;
  }
  .topName {
    display: flex;
    cursor: pointer;
    line-height: 16px;
    .left {
      color: #3696e5;
      font-size: 16px;
    }
    .right {
      color: #ffffff;
      font-size: 14px;
      margin-left: 25px;
    }
  }
  .baseInfo {
    width: 100%;
    height: 310px;
    border: 1px solid #535353;
    padding: 15px 18px 20px 28px;
  }
  .dealInfo {
    width: 100%;
    border: 1px solid #535353;
    padding: 15px 18px 20px 28px;
    margin-top: 10px;
    color: #b3b3b3;
    max-height: 600px;
    overflow-y: scroll;
  }
  .topTitle {
    display: flex;
    .line {
      width: 5px;
      height: 19px;
      background: linear-gradient(0deg, #1eb499 0%, #2ea8e5 100%);
      border-radius: 2px;
    }
    .name {
      color: #fefefe;
      margin-left: 5px;
    }
  }
  .mytop {
    margin-top: 20px;
  }
  .childContent {
    display: flex;
    margin-top: 22px;
  }
  .leftContent {
    width: 50%;
    display: flex;
  }
  .des {
    display: flex;
    margin-top: 20px;
  }
  .myspan {
    line-height: 38px;
    width: 130px;
    white-space: nowrap;
    text-align: right;
  }
}
</style>
