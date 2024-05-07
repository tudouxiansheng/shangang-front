<template>
  <el-dialog
    :title="$t('alarmTypeManage.alarmTypeDetail')"
    :visible.sync="$parent.alarmTypeDetailVisible"
    top="10vh"
    :width="locale == 'en' ? '1100px' : '1000px'"
    :close-on-click-modal="false"
    class="alarmTypeDetailDialog"
    :draggable='false'
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '220px' : '130px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('alarmTypeManage.alarmTypeName') + '：'">
            <span>{{ form.alarmName }}</span>
          </el-form-item>
          <el-form-item :label="$t('alarmTypeManage.alarmTypeCode') + '：'">
            <span>{{ form.alarmType }}</span>
          </el-form-item>
          <el-form-item :label="$t('alarmTypeManage.alarmClassification') + '：'">
            <span>{{ setAlarmGroup(form.alarmGroup) }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('public.alarmLevel') + '：'">
            <span>{{ setAlarmLevel(form.alarmLevel) }}</span>
          </el-form-item>
          <el-form-item :label="$t('alarmTypeManage.whetherToSupportQuery') + '：'">
            <span>{{ setCanQuery(form.canQuery) }}</span>
          </el-form-item>
          <el-form-item :label="$t('alarmTypeManage.whetherToSupportLinkage') + '：'">
            <span>{{ setCanLinkage(form.canLinkage) }}</span>
          </el-form-item>
          <el-form-item :label="$t('alarmTypeManage.whetherToEnable') + '：'">
            <span>{{ setEnable(form.enable) }}</span>
          </el-form-item>
        </div>
      </div>
    </el-form>

    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      locale: localStorage.getItem('locale'),
      form: {}
    }
  },

  methods: {
    setAlarmGroup(val) {
      if (val) {
        this.$parent.alarmGroupTypeArray.map(item => {
          if (val == item.groupCode) {
            val = this.$parent.locale == 'en' ? item.groupEnName : item.groupName
          }
        })
      } else {
        val = ''
      }
      return val
    },

    setAlarmLevel(val) {
      let data = ''
      this.$parent.alarmLevelList.forEach(element => {
        if (val == element.alarmLevelId) {
          data = this.$parent.locale == 'en' ? element.alarmLevelEnName : element.alarmLevelName
        }
      })
      return data
    },

    setCanQuery(val) {
      if (val == 0) {
        val = this.$t('alarmTypeManage.no')
      } else if (val == 1) {
        val = this.$t('alarmTypeManage.yes')
      } else {
        val = ''
      }
      return val
    },

    setCanLinkage(val) {
      if (val == 0) {
        val = this.$t('alarmTypeManage.no')
      } else if (val == 1) {
        val = this.$t('alarmTypeManage.yes')
      } else {
        val = ''
      }
      return val
    },

    setEnable(val) {
      if (val == 0) {
        val = this.$t('alarmTypeManage.no')
      } else if (val == 1) {
        val = this.$t('alarmTypeManage.yes')
      } else {
        val = ''
      }
      return val
    },

    dialogOpen() {
      this.$nextTick(() => {
        
        this.form = this.$parent.dataForm
      })
    },

    dialogClosed() {
      this.$parent.alarmTypeDetailVisible = false
      this.$parent.dataForm = {}
    }
  }
}
</script>

<style lang="scss">
.alarmTypeDetailDialog {
  .el-dialog__body {
    padding: 15px 0px 5px;
    color: #4d4d4d;
    .el-form-item--small.el-form-item {
      margin-bottom: 10px !important;
    }

    .el-form-item__label {
      line-height: 24px;
      padding-right: 0;
    }
    .el-form-item__content {
      line-height: 24px;
    }
  }
}
</style>
