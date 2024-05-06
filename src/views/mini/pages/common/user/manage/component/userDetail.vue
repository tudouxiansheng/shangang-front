<template>
  <el-dialog
    :title="$t('userManage.userDetail')"
    v-model="$parent.userDetailVisible"
    top="10vh"
    :width="$parent.locale == 'en' ? '1100px' : '1000px'"
    :close-on-click-modal="false"
    class="userDetailDialog detailDialog"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form
      ref="form"
      :model="form"
      :label-width="$parent.locale == 'en' ? '230px' : '140px'"
      label-position="left"
    >
      <div class="form-flex">
        <div class="form-left">
          <el-form-item :label="$t('userManage.userName') + '：'">
            <span>{{ form.userName }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.phone') + '：'">
            <span>{{ desensitized.desensitizedPhone(form.mobile) }}</span>
          </el-form-item>
          <!-- 账户有效期 -->
          <el-form-item :label="$t('public.enableAccountValidity') + '：'">
            <el-switch
              v-model="form.isValidityEnable"
              active-color="#0085d0"
              :active-value="1"
              inactive-color="#dee2e6"
              :inactive-value="0"
              disabled
            />
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('public.account') + '：'">
            <span>{{ form.account }}</span>
          </el-form-item>
          <el-form-item :label="$t('public.role') + '：'" v-if="$parent.PermissionRoleManage">
            <span>{{ setRoleId(form.roles) }}</span>
          </el-form-item>
          <!-- 会话控制数 -->
          <el-form-item :label="$t('session.maxSessionNum') + '：'">
            <span>{{ form.maxSessionNum }}</span>
          </el-form-item>
        </div>
      </div>

      <div class="form-flex" v-if="form.isValidityEnable == 1">
        <div class="form-left">
          <el-form-item :label="$t('public.validityBeginTime') + '：'">
            <span>{{ form.beginTime }}</span>
          </el-form-item>
        </div>

        <div class="form-right">
          <el-form-item :label="$t('public.validityEndTime') + '：'">
            <span>{{ form.endTime }}</span>
          </el-form-item>
        </div>
      </div>
      <el-form-item
        :label="$t('userManage.PTZControlPriority') + '：'"
        prop="cloudMirrorPriority"
        class="padding40"
      >
        <span>{{ form.cloudMirrorPriority }}</span>
      </el-form-item>

      <el-form-item :label="$t('public.remark') + '：'" class="padding40">
        <span>{{ form.remark }}</span>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { Desensitized } from '@/utils/common/desensitization'
export default {
  data() {
    return {
      form: {
        userName: '',
        account: '',
        mobile: '',
        remark: '',
        isValidityEnable: 0,
        beginTime: '',
        endTime: ''
      },
      desensitized: Desensitized
    }
  },

  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        this.setDialogCss()
        this.form = Object.assign({}, this.form, this.$parent.dataForm)
      })
    },
    dialogClosed() {
      this.$parent.userDetailVisible = false
      this.$parent.dataForm = {}
    },
    setRoleId(val) {
      let name = ''
      if (val && val.length > 0) {
        name = val[0].roleName
      }
      return name
    }
  }
}
</script>
