<template>
  <el-dialog
    :title="$t('loginOut.tips')"
    v-model="loginOutDialogVisible"
    width="30%"
    :show-close="false"
    :close-on-click-modal="false"
    append-to-body
    draggable
  >
    <span class="content-text">{{ this.message || loginOutContent }}</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">
          {{ $t('loginOut.loginInAgain') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { sStorage } from '@/utils/common/store'

export default {
  props: {
    logdialogVisible: {
      type: Boolean,
      default: false
    },
    loginOutContent: {
      type: String
    },
    loginOut: {
      type: Function
    }
  },
  data() {
    return {
      message: ''
    }
  },
  computed: {
    loginOutDialogVisible: {
      get() {
        return this.logdialogVisible
      },
      set(val) {
        this.$emit('update:logdialogVisible', val)
      }
    }
  },
  watch: {
    logdialogVisible: {
      handler(newVal, oldVal) {
        //只有自己主动弹出得框，调登出接口
        if (newVal && !this.message) {
          this.$api
            .logout({ type: 1 })
            .then(res => {})
            .catch(err => {})
        }
      }
    }
  },
  created() {
    this.bindEvent()
  },
  beforeDestroy() {
    this.unBindEvent()
  },
  mounted() {},
  methods: {
    bindEvent() {
      this.$bus.$on('log_out', this.handleVisible)
    },
    unBindEvent() {
      this.$bus.$off('log_out')
    },
    handleConfirm() {
      this.loginOutDialogVisible = false
      this.$store.state.logOutDialogNotAlert = false
      //后台发消息得直接跳转到登录页即可，调登出会报401
      if (this.loginOut && !this.message) {
        window.removeEventListener('beforeunload', this.loginOut)
      }
      if (this.$route.path == '/login') {
        sStorage.clear()
        this.$store.dispatch('auth/setClientNonce', '')
        this.$store.dispatch('auth/setRefreshToken', '')
        this.$store.dispatch('auth/setAccessToken', '')
        window.location.reload()
      } else {
        this.$router.push({ path: '/login' })
      }
    },
    handleVisible(message) {
      if (message) {
        let code = JSON.parse(message.newValue).code
        if (this.$route.path == '/login' && code == 7) {
          // 登陆页面修改密码不展示消息推送
          return
        }
        this.message = this.msgType(code)
        this.loginOutDialogVisible = true
        this.$store.state.logOutDialogNotAlert = true
      }
    },
    msgType(type) {
      let message = ''
      switch (type) {
        case 1:
          message = this.$t('loginOut.sessionExpired')
          break
        case 2:
          message = this.$t('loginOut.sessionSigned')
          break
        case 3:
          message = this.$t('loginOut.userDeleted')
          break
        case 4:
          message = this.$t('loginOut.userLocked')
          break
        case 5:
          message = this.$t('loginOut.userDisabled')
          break
        case 6:
          message = this.$t('loginOut.permissionsChanged')
          break
        case 7:
          message = this.$t('loginOut.passwordModified')
          break
        case 8:
          message = this.$t('loginOut.accountExpired')
          break
        case 9:
          message = this.$t('loginOut.sessionOverLimit')
          break
      }
      return message
    }
  }
}
</script>

<style lang="scss" scoped>
.content-text {
  text-align: center;
  display: block;
  margin: 34px 0;
  font-weight: bold;
  font-size: 16px;
}
</style>
