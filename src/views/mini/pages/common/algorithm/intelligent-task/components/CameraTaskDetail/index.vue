<template>
  <span>
    <slot :onClick="open" />
    <el-dialog
      title="任务详情"
      :visible.sync="visible"
      append-to-body
      modal-append-to-body
      top="10vh"
      width="96%"
      id="accessPlatformDetailDialog"
      :close-on-click-modal="false"
      :draggable="false"
    >
      <el-form
        ref="archivesForm"
        class="archivesForm"
        :inline="true"
        :label-width="'142px'"
        label-position="left"
        :validate-on-rule-change="false"
      >
        <!-- 基本信息 -->
        <collapse-card title="任务基本信息" v-model:collapse="show1">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="'算法平台名称' + '：'">
                <span>博斯廷算法平台</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'算法平台名称' + '：'">
                <span>XXXXXXXXXX</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'算法平台名称' + '：'">
                <span>1天13时23分</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="'创建时间' + '：'">
                <span>2022-3-23 18:23:12</span>
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
        <collapse-card title="任务基本信息" v-model:collapse="show2">
          <el-row>
            <el-col :span="24">
              <el-form-item :label="'摄像机名称' + '：'">
                <span>摄像机2</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="'检测类型' + '：'">
                <AlgorithmSelect readonly :value="value.formData.cameraScope[0]" />
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
        <collapse-card title="部署时间" v-model:collapse="show3">
          <el-row>
            <el-col :span="8">
              <el-form-item :label="'任务开始日期' + '：'">
                <span>2022-04-01</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="'任务结束日期' + '：'">
                <span>2022-09-01</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="'任务计划' + '：'">
                <ScheduleEditor readonly :value="value.formData.schedule" />
              </el-form-item>
            </el-col>
          </el-row>
        </collapse-card>
      </el-form>
    </el-dialog>
  </span>
</template>

<script>
import CollapseCard from '@components/collapse-card.vue'
import AlgorithmSelect from '@views/mini/pages/common/algorithm/intelligent-task/components/AlgorithmSelect/index.vue'
import ScheduleEditor from '@views/mini/pages/common/algorithm/intelligent-task/components/ScheduleEditor/index.vue'

export default {
  components: {
    ScheduleEditor,
    AlgorithmSelect,
    CollapseCard,
  },
  props: {
    value: {},
  },
  data() {
    return {
      show1: true,
      show2: true,
      show3: true,
      visible: false,
    }
  },
  computed: {},
  watch: {},
  methods: {
    open() {
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
#accessPlatformDetailDialog {
  .nowrap {
    white-space: nowrap;
  }
  .el-table__border-left-patch {
    background-color: #d9d9d9;
  }
  .el-table__inner-wrapper::before {
    background-color: #d9d9d9;
  }
  .el-table__inner-wrapper::after {
    background-color: #d9d9d9;
  }
  .el-dialog__body {
    padding: 20px;

    .appendIpt {
      .el-input .el-input__inner {
        width: 180px;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }

      .el-input .el-input-group__append {
        color: #000;
        background-color: transparent;
        padding: 0 8px;
        border: none;
      }
    }

    .el-input__inner {
      width: 215px;
      height: 36px;
      border-radius: 4px;
      background: transparent;
      color: #232c3b;
    }

    .el-form-item__label {
      color: #333;
      padding: 0 5px 0 0;
    }

    .single-line {
      width: 100%;
      box-sizing: border-box;

      .el-textarea__inner {
        background: transparent;
        border-radius: 4px;
        height: 100px;
        border: 1px solid #c1c7d0;
        color: #232c3b;
      }
    }

    .accessGatewayConfig {
      padding: 20px;
      background: #f8f8f9;
      border-radius: 4px;
      .el-radio-group {
        margin-bottom: 25px;
        .el-radio-button__inner {
          margin-right: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #595959;
          background: transparent;
        }
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
          border-radius: 100px;
          background: rgba(44, 109, 210, 0.1);
          color: #2c6dd2;
          box-shadow: none;
        }
      }
    }
  }
}
</style>
