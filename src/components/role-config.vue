<template>
  <el-dialog
    :title="$t('public.roleConfig')"
    v-model="dialogVisible"
    top="10vh"
    width="700px"
    :close-on-click-modal="false"
    :modal="false"
    @open="dialogOpen"
    @closed="dialogClosed"
    draggable
  >
    <el-form
      ref="authForm"
      :model="form"
      :rules="rules"
      class="authForm"
      :label-width="locale == 'en' ? '160px' : '110px'"
      label-position="left"
      :validate-on-rule-change="false"
    >
      <el-form-item :label="$t('public.loginPwd') + '：'" prop="authPassword">
        <pwd-input v-model="form.authPassword" :placeholder="$t('public.loginPwdPrompt')" />
      </el-form-item>

      <el-form-item :label="$t('public.role') + '：'" prop="roleId">
        <el-select
          :popper-append-to-body="false"
          v-model="form.roleId"
          @change="$forceUpdate()"
          :placeholder="$t('public.rolePrompt')"
        >
          <el-option
            v-for="(item, index) in roleList"
            :key="index"
            :label="item.roleName"
            :value="item.roleId"
            :disabled="item.createBy == '00000000000000000201009999999999'"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="loading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script>
const apiMap = {
  0: 'setUserRole',
  1: 'setAdminRole',
  2: 'setTenantRole'
}
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: '',
      required: true
    },
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      locale: localStorage.getItem('locale'),
      roleList: [],
      loading: false,
      form: {
        roleId: undefined,
        authPassword: undefined
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
    },
    rules() {
      return {
        authPassword: [
          {
            required: true,
            message: this.$t('public.loginPwdPrompt'),
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            message: this.$t('public.rolePrompt'),
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    dialogOpen() {
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {
      this.resetForm()
    },
    getRoleList() {
      this.$api.selectRolesQuery({}).then(res => {
        this.roleList = res.roleList || []
      })
    },
    resetForm() {
      this.form = {
        roleId: undefined,
        authPassword: undefined
      }
      this.$resetForm('authForm')
    },
    submitForm() {
      this.$refs['authForm'].validate(valid => {
        if (valid) {
          let data = {
            authPassword: this.form.authPassword,
            roles: [this.form.roleId]
          }
          if (!this.userId) {
            this.$emit('success', data)
            this.dialogVisible = false
            return
          }
          this.loading = true
          if (this.type == 0) {
            data.userId = this.userId
          } else if (this.type == 1) {
            data.adminId = this.userId
          } else if (this.type == 2) {
            data.tenantId = this.userId
          }
          this.$api[apiMap[this.type]](data).then(res => {
            if (res.resultCode == 0) {
              this.$message({
                type: 'success',
                message: this.$t('public.operatingSuccessContent')
              })
              this.dialogVisible = false
              if (this.type == 0) {
                this.$parent.userList()
              } else if (this.type == 1) {
                this.$parent.getAdminList()
              } else if (this.type == 2) {
                this.$parent.getTenantList()
              }
            }
            this.loading = false
          })
        }
      })
    }
  }
}
</script>
