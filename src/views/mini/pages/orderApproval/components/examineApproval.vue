<template>
  <!--审核-->
  <div class="examine">
    <el-dialog
      :title="$t('work.workOrderVerify')"
      :visible.sync="$parent.dialogExamineVisiable"
      top="10vh"
      width="678px"
      :close-on-click-modal="false"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      v-dialogDrag
    >
      <div class="shenhe">
        <div class="topTitle">
          <div class="line"></div>
          <div class="name">{{ $t('work.aud') }}</div>
        </div>
        <el-form ref="form" class="form" :model="form" label-suffix=":" :rules="rules">
          <el-form-item :label="$t('work.auditResult')" label-width="90px" prop="state">
            <el-radio-group v-model="form.state">
              <el-radio label="2">{{ $t('work.p') }}</el-radio>
              <el-radio label="3">{{ $t('work.r') }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('work.handler')" label-width="90px" prop="handlerId" v-if="form.state == 3">
            <el-select
              :placeholder="$t('public.placeholderSelect', { type: $t('work.handler') })"
              v-model="form.handlerId"
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
          <el-form-item :label="$t('alarm.proDesc')" label-width="90px">
            <textarea class="mytextArea2" v-model="form.suggestion"></textarea>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { modifyChildWorkSheet } from '../../../../../utils/api'

export default {
  props: ['childWorkSheetId'],
  data() {
    return {
      form: {
        state: '2', //2为通过 3为未通过
        handlerId: '', //处理人id
        newHandlerId: '', //驳回后新的处理人
        suggestion: '', //内容描述
        childWorkSheetId: '', //子工单id
      },
      rules: {
        state: { required: true, trigger: 'blur', message: '工单状态必选' },
        handlerId: { required: true, trigger: 'blur', message: '处理人必选' },
      },
    }
  },
  methods: {
    //确认审核
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.childWorkSheetId = this.childWorkSheetId
          if (this.form.state == 3) {
            this.form.newHandlerId = this.form.handlerId
            delete this.form.handlerId
          }
          modifyChildWorkSheet(this.form).then((res) => {
            if (res.resultCode == 0) {
              this.$message.success('审核成功')
              this.$parent.dialogExamineVisiable = false
              this.$parent.getorderApproval()
              this.$refs.form.resetFields()
              this.form.suggestion = ''
              this.form.state = ''
            }
          })
        }
      })
    },
    //关闭
    dialogClosed() {
      this.$parent.dialogExamineVisiable = false
      this.$refs.form.resetFields()
    },
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.shenhe {
  height: 260px;
  border: 1px solid #535353;
  padding: 18px;
  .el-dialog__body {
    padding-top: 10px;
  }
  .el-form-item__label {
    color: #b3b3b3;
  }
  .el-radio {
    color: #ffffff;
  }
  .topTitle {
    display: flex;
    .line {
      width: 5px;
      height: 19px;
      background: #00a1ff;
    }
    .name {
      color: #fefefe;
      margin-left: 5px;
    }
  }
  .form {
    padding: 7px;
    .mytextArea2 {
      background-color: #4d4d4d;
      width: 391px;
      border: none;
      color: white;
      font-size: 16px;
      min-height: 60px;
      border-radius: 6px;
      padding: 5px;
      resize: none;
    }
  }
}
</style>
