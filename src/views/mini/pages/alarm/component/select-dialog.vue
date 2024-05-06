<template>
  <CusDialog
    @close="handleClose"
    :visible="visible"
    :title="$t('public.select')"
    isDetail
    :width="338"
    defaultBgc="smallBgc"
    class="select-dialog"
  >
    <el-scrollbar class="scrollbar" slot="body">
      <el-checkbox-group :max="10" :min="6" class="select-wrapper" v-model="checkList" @change="handleChangeType">
        <el-checkbox v-for="(item, index) in data" :label="item" :key="index">{{
          isZh ? item.alarmName : item.alarmEnName
        }}</el-checkbox>
      </el-checkbox-group>
    </el-scrollbar>
  </CusDialog>
</template>

<script>
export default {
  name: 'select-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  computed: {
    isZh() {
      return localStorage.getItem('locale') != 'en'
    },
  },
  watch: {
    data: {
      handler(val) {
        this.checkList = val.slice(0, 10)
        this.$emit('change', this.checkList)
      },
    },
  },
  data() {
    return {
      checkList: [],
    }
  },
  methods: {
    handleChangeType() {
      this.$emit('change', this.checkList)
    },
    handleClose() {
      this.$emit('close')
    },
  },
}
</script>

<style scoped lang="scss">
::v-deep .cusDialog {
  .select-wrapper {
    display: flex;
    flex-direction: column;
    .el-checkbox {
      margin-bottom: 10px;
    }
  }
  .scrollbar {
    height: 100%;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.select-dialog{
  ::v-deep .el-dialog__body{
    margin-bottom: 36px;
  }
}
</style>
