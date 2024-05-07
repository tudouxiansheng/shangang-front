<template>
  <div>
    <el-dialog
      title="新增"
      v-model="$parent.addStorageNodesVisible"
      top="10vh"
      :width="locale == 'en' ? '1350px' : '1050px'"
      @closed="dialogClosed"
      @open="dialogOpen"
      :modal="false"
      :close-on-click-modal="false"
      draggable
      class="addStorageNodesDialog"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        :validate-on-rule-change="false"
        :label-width="locale == 'en' ? '190px' : '156px'"
        label-position="left"
      >
        <div class="form-flex">
          <div class="form-left">
            <!-- 存储介质类型 -->
            <el-form-item label="存储介质类型：" prop="">
              <el-select
                :popper-append-to-body="false"
                v-model="form.domainCode"
                autocomplete="off"
                :placeholder="$t('public.domainNamePrompts')"
                :disabled="true"
              >
                <el-option label="item.domainName" value="item.domainCode" ></el-option>
              </el-select>
            </el-form-item>
            <!-- 分组 -->
            <el-form-item label="分组：" prop="">
              <el-select
                :popper-append-to-body="false"
                v-model="form.domainCode"
                autocomplete="off"
                :placeholder="$t('public.domainNamePrompts')"
              >
                <el-option label="item.domainName" value="item.domainCode" ></el-option>
              </el-select>
            </el-form-item>
            <!-- 节点名称 -->
            <el-form-item label="节点名称：" prop="">
              <el-input v-model="form.organizationName" :placeholder="$t('public.pleaseInputorganizationName')" :disabled="true"></el-input>
            </el-form-item>
          </div>

          <div class="form-right">
            <!-- 存储域 -->
            <el-form-item label="存储域：" prop="">
              <el-select
                  :popper-append-to-body="false"
                  v-model="form.domainCode"
                  autocomplete="off"
                  :placeholder="$t('public.domainNamePrompts')"
                  :disabled="true"
              >
                <el-option label="item.domainName" value="item.domainCode" ></el-option>
              </el-select>
            </el-form-item>
            <!-- 节点IP -->
            <el-form-item label="节点IP：" prop="ip">
              <el-input v-model="form.organizationName" :placeholder="$t('public.pleaseInputorganizationName')" :disabled="true" ></el-input>
            </el-form-item>
            <!-- 资源关联 -->
            <el-form-item label="资源关联：" prop="ip">
              <el-button type="primary" link @click="associatedResourcesVisible = true">关联</el-button>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button
            type="primary"
            @click="addMainDevSubmit"
            :loading="$parent.maskloading"
          >
            {{ $t('public.confirm') }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    <associated-resources></associated-resources>
  </div>
</template>

<script>
import {
  InfoFilled as ElIconInfo,
  ArrowDown as ElIconArrowDown,
  ArrowUp as ElIconArrowUp,
  Delete as ElIconDelete
} from '@element-plus/icons-vue'
import AssociatedResources from "./associated-resources";

export default {
  components: {'associated-resources': AssociatedResources},
  data() {
    return {
      ElIconDelete,

      locale: localStorage.getItem('locale'),
      dialogClose: false,

      form: {

      },
      rules: {
        // Ip
        puIp: [
          {
            // 前端IP 非（T28181或设备向平台注册的HWSDK设备）必填
            required: this.puIpPortRequired,
            message: this.$t('public.puIpPrompt'),
            trigger: 'change'
          },
          {
            pattern:
                /^-?((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/,
            message: this.$t('public.puIpError'),
            trigger: 'blur'
          }
        ],
        // 端口
        puPort: [
          {
            required: this.puIpPortRequired,
            message: this.$t('public.puPortPrompt'),
            trigger: 'change'
          },
          {
            pattern:
                /^([0-9]|[1-9]\d|[1-9]\d{2}|[1-9]\d{3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$/,
            message: this.$t('public.puPortError'),
            trigger: 'blur'
          }
        ],
        // 对接账号
        puAccount: [
          {
            required: true,
            message: this.$t('public.puAccountPrompt'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 32,
            message: this.$t('public.puAccountError'),
            trigger: 'blur'
          }
        ],
        // 对接密码
        puPasswd: [
          {
            required: true,
            message: this.$t('public.puPasswdPrompt'),
            trigger: 'change'
          },
          {
            min: 5,
            max: 128,
            message: this.$t('public.puPasswdError'),
            trigger: 'blur'
          }
        ],
      },
      associatedResourcesVisible: false,
    }
  },
  computed: {
  },
  methods: {
    dialogOpen() {
      if (this.$refs.form) {
        this.$nextTick(() => {
          this.$refs.form.resetFields()
        })
      }
      this.$nextTick(() => {
        
      })
    },
    dialogClosed() {
      this.$parent.addStorageNodesVisible = false
    },

    // 添加确认按钮事件
    addMainDevSubmit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log('添加确认按钮事件')
        }
      })
    },
  }
}
</script>

<style lang="scss">
.addStorageNodesDialog {
  .clear {
    margin-left: 20px;
  }
}
#recordPolicyConfig .el-step__icon.is-text {
  background: #fff !important;
}
</style>
