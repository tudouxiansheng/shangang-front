<template>
  <el-dialog
    :title="txt.title"
    v-model="dialogVisible"
    width="475px"
    :close-on-click-modal="false"
    class="share"
    :modal="false"
    dialogDrag
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <div class="txt">
      <span>{{ txt.isCancelShareDev }}</span>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submit">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import constantsMixin from '../mixin/constantsMixin'
export default {
  name: 'cancel-share',
  mixins: [constantsMixin],
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    currentId: {
      type: String,
      default: ''
    },
    checkedNodes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false
    }
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  mounted() {},
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
      })
    },
    dialogClosed() {
      this.dialogVisible = false
    },

    async submit() {
      let data = {
        userIds: this.checkedNodes
      }
      this.loading = true
      if (String(this.currentId).length < 10) {
        data.groupId = this.currentId
      } else {
        data.deviceId = this.currentId
      }

      this.$api.removeDeviceToUser(data).then(res => {
        if (res.resultCode == 0) {
          this.$message({
            message: this.$t('public.operatingSuccess'),
            type: 'success'
          })
        }
        this.$emit('optioncb')
        this.dialogClosed()
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.txt {
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    width: 210px;
    height: 18px;
    font-size: 14px;
    font-family:
      Microsoft YaHei-Regular,
      Microsoft YaHei;
    font-weight: 400;
    color: #232c3b;
    line-height: 16px;
  }
}
</style>
