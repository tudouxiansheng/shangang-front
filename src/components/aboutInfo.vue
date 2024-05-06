<template>
  <el-dialog
    draggable
    :close-on-click-modal="false"
    :append-to-body="true"
    :title="$t('changePwd.about')"
    v-model="$parent.$parent.aboutVisible"
    top="10vh"
    width="600px"
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <div class="about">
      <div>
        {{ $t('changePwd.version') }}
        {{ $t('login.loginTitle') }}
        &nbsp;
        {{ version }}
      </div>
      <div>{{ $t('changePwd.publishTime') }} {{ info.publishTime }}</div>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    info: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      version: state => state.user.version,
    }),
  },
  methods: {
    dialogClosed() {
      this.$parent.$parent.aboutVisible = false
    },
    dialogOpen() {}
  }
}
</script>

<style lang="scss" scoped>
.about {
  height: 100px;
  white-space: nowrap;
  font-weight: bold;
  display: flex;
  flex-flow: column;
  align-self: center;
  justify-content: center;
  div {
    margin-bottom: 8px;
  }
}
</style>
