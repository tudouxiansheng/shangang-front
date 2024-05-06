<template>
  <!-- 变更对话框 -->
  <el-dialog
    :title="$t('workOrder.workOrderUpdate')"
    v-model="$parent.updateTicketVisible"
    top="10vh"
    width="1000px"
    :close-on-click-modal="false"
    @open="dialogOpen"
    :modal="false"
    @closed="updateClose"
    draggable
  >
    <div class="ticket-content">
      <div class="step step-blue">
        <div class="step-text">{{ $t('workOrder.create') }}</div>
      </div>
      <div class="line"></div>
      <div class="step">
        <div class="step-text">{{ $t('workOrder.dispose') }}</div>
      </div>
      <div class="line"></div>
      <div class="step">
        <div class="step-text">{{ $t('workOrder.audit') }}</div>
      </div>
      <div class="line"></div>
      <div class="step">
        <div class="step-text">{{ $t('workOrder.close') }}</div>
      </div>
    </div>

    <el-form
      ref="updateForm"
      :model="updateForm"
      :rules="updateRule"
      :label-width="$parent.locale == 'en' ? '126px' : '85px'"
      style="margin-top: 30px"
      size="small"
      label-position="left"
    >
      <el-form-item :label="$t('workOrder.workOrderName') + '：'" prop="name" class="updateName">
        <el-input
          v-model="updateForm.name"
          auto-complete="off"
          :placeholder="$t('workOrder.workOrderNamePrompt')"
          disabled
        />
      </el-form-item>

      <el-form-item :label="$t('workOrder.workOrderContent') + '：'" prop="content">
        <el-input
          type="textarea"
          v-model="updateForm.content"
          maxlength="255"
          :placeholder="$t('workOrder.workOrderContentPrompt')"
          show-word-limit
          disabled
        ></el-input>
      </el-form-item>

      <el-form-item prop="pic">
        <img :src="item" alt class="image" v-for="(item, index) in updateForm.pic" :key="index" />
      </el-form-item>

      <el-form-item :label="$t('public.workLevel') + '：'" prop="level">
        <el-radio-group v-model="updateForm.level">
          <el-radio :label="2" disabled>{{ $t('public.urgent') }}</el-radio>
          <el-radio :label="1" disabled>{{ $t('public.important') }}</el-radio>
          <el-radio :label="0" disabled>{{ $t('public.general') }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="$t('workOrder.builderId') + '：'" prop="builderId">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="updateForm.builderId"
          :placeholder="$t('workOrder.builderPrompt')"
        >
          <el-option
            v-for="(item, index) in $parent.personData"
            :key="index"
            :label="item.userName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item :label="$t('workOrder.checkerId') + '：'" prop="checkerId">
        <el-select
          clearable
          :popper-append-to-body="false"
          v-model="updateForm.checkerId"
          :placeholder="$t('workOrder.checkerPrompt')"
        >
          <el-option
            v-for="(item, index) in $parent.personData"
            :key="index"
            :label="item.userName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="updateClose">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="updateTicketSubmit">
          {{ $t('workOrder.submit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      updateForm: {
        name: '', //任务名称
        content: '', //任务内容
        pic: [], //图片集合
        checkerId: '', //审核人Id
        builderId: '', //处理人Id
        level: null //1.紧急 2.严重 3.一般
      },
      updateRule: {} //变更校验
    }
  },
  methods: {
    dialogOpen() {
      if (this.$refs.updateForm) {
        this.$nextTick(() => {
          this.$refs.updateForm.resetFields()
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        this.updateForm = Object.assign(this.updateForm, this.$parent.updateForm)
      })
      this.updateRule = {
        builderId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.builderPrompt')
          }
        ],
        checkerId: [
          {
            required: true,
            trigger: 'blur',
            message: this.$t('workOrder.checkerPrompt')
          }
        ]
      }
    },
    // 关闭窗口
    updateClose() {
      this.$parent.updateTicketVisible = false
      this.$parent.maskloading = false
      this.$parent.updateForm = {}
    },

    // 变更表单提交！
    updateTicketSubmit() {
      this.$refs['updateForm'].validate(valid => {
        if (valid) {
          this.submitUpdateTicket()
        }
      })
    },
    submitUpdateTicket() {
      this.$parent.maskloading = true
      let data = {
        ticketId: this.updateForm.ticketId,
        builderId: this.updateForm.builderId,
        checkerId: this.updateForm.checkerId
      }
      this.$api.update_ticketInfo(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            type: 'success',
            message: this.$t('workOrder.changeSuccess')
          })

          this.$parent.updateTicketVisible = false
          this.$parent.handleFind()
        }
        this.$parent.maskloading = false
      })
    }
  }
}
</script>
