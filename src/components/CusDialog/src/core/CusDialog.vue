<template>
  <el-dialog
    custom-class="cusDialog"
    :title="title"
    :class="defaultBgc"
    :visible.sync="visible"
    :before-close="handleClose"
    :destroy-on-close="destroyOnClose"
    @open="handleOpen"
    @opened="handleOpened"
    @closed="handleClosed"
    modal-append-to-body
    :append-to-body="appendToBody"
    :modal="modal"
    :width="cWidth"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    ref="CusDialog"
  >
    <template slot="title">
      <slot name="title">
        <span slot="title" :style="{ fontSize: '20px', color: '#0cd8fa' }">{{ title }}</span>
      </slot>
    </template>
    <slot name="body"></slot>
    <template slot="footer" v-if="!isDetail">
      <!-- 默认按钮 -->
      <slot name="footer">
        <el-button @click="handleClose">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submit" :loading="submitLoading">
          {{ $t('public.confirm') }}
        </el-button>
      </slot>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '信息',
    },
    visible: {
      type: Boolean,
    },
    submitLoading: {
      type: Boolean,
      default: false,
    },
    modal: {
      type: Boolean,
      default: true,
    },
    isDetail: {
      //详情页面
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 1000,
    },
    defaultBgc: {
      type: String,
      default: 'normalBgc',
    },
    appendToBody: {
      type: Boolean,
      default: false,
    },
    destroyOnClose: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cWidth: '',
    }
  },
  methods: {
    handleClosed() {
      this.$emit('closed')
    },
    handleClose() {
      this.$refs.CusDialog.$el.querySelector('.el-dialog__body').scrollTop = 0
      this.$emit('close')
    },
    handleOpened() {
      this.$emit('opened')
    },
    handleOpen() {
      let w
      try {
        w = this.computeRem(this.width) + 'rem'
      } catch (error) {
        w = this.width
      }
      this.$nextTick(() => {
        this.cWidth = w
        this.$emit('open')
      })
    },
    computeRem(width) {
      let rem = window.innerWidth / 1920
      let n = Number(width)
      return (rem * n) / (rem * 192)
    },
    submit() {
      this.$emit('submit')
    },
  },
}
</script>

<style lang="scss" scoped>
@import './cusDialog.scss';
</style>
