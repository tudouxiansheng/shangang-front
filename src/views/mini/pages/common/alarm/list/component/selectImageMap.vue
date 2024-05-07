<template>
  <el-dialog
    :title="$t('gis.selectMap')"
    v-model="dialogVisible"
    top="10vh"
    width="620px"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @open="dialogOpen"
  >
    <el-form :model="form" ref="ruleForm">
      <div style="margin-bottom: 20px; font-weight: bold; word-break: break-word">
        {{ $t('gis.selectMapTip') }}
      </div>
      <el-form-item prop="mapId">
        <el-select v-model="form.mapId">
          <el-option
            v-for="(item, index) in data"
            :key="index"
            :label="item.mapName"
            :value="item.mapId"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" @click="submitForm">{{ $t('public.confirm') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  name: 'selectImageMap',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      form: {
        mapId: undefined
      }
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
  methods: {
    dialogOpen() {
      this.form.mapId = this.data[0]?.mapId
      this.$nextTick(async () => {
        
      })
    },
    submitForm() {
      this.$emit('submit', this.form.mapId)
      this.dialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog__body) {
  padding: 15px 140px 5px 140px !important;
}
:deep(.el-select) {
  width: 100% !important;
  .el-input {
    width: 100% !important;
  }
}
</style>
