<template>
  <el-dialog
    :title="$parent.nodeOperation == 1 ? $t('GBShare.addChildNode') : $t('GBShare.editNode')"
    v-model="$parent.dialogFormVisible_add"
    top="10vh"
    width="1000px"
    class="GGBShareTreeNodeAddDialog"
    :close-on-click-modal="false"
    :modal="false"
    draggable
    @closed="dialogClosed"
    @open="dialogOpen"
  >
    <el-form ref="form" :model="form" :rules="rules" label-width="116px" label-position="left">
      <el-form-item :label="$t('GBShare.parentNode') + ':'" prop="parentName">
        <el-input v-model="form.parentName" auto-complete="off" clearable disabled />
      </el-form-item>

      <el-form-item :label="$t('GBShare.nodeCoding') + ':'" prop="interconnectCode">
        <el-input
          v-model="form.interconnectCode"
          auto-complete="off"
          :placeholder="$t('GBShare.inputNodeCoding')"
          clearable
          v-if="resetItem"
        />
      </el-form-item>

      <el-form-item :label="$t('GBShare.nodeName') + ':'" prop="groupName">
        <el-input
          v-model="form.groupName"
          auto-complete="off"
          :placeholder="$t('GBShare.inputNodeName')"
          clearable
          v-if="resetItem"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
        <el-button type="primary" :loading="$parent.maskloading" @click="submitForm">
          {{ $t('public.confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      form: {
        parentName: '',
        interconnectCode: '',
        groupName: ''
      },

      rules: {},

      //视频云
      upLoadFile: '',
      choosedServer: '',
      resetItem: true,

      ifShowAva: false,
      platGroupName: ''
    }
  },

  mounted() {
    this.setFormRules()
  },

  computed: {
    itemDisabled() {
      return this.form.associateServer != ''
    }
  },

  methods: {
    changeAva(val) {
      if (val == 1) {
        this.rules.gatewayNatIp[0].required = true
      } else {
        this.rules.gatewayNatIp[0].required = false
      }
    },
    dialogOpen() {
      if (this.$refs.form) {
        this.showServerChoose = false
        this.ifShowAva = false
        this.$nextTick(() => {
          this.$refs.form.resetFields()
          this.form.associateServer = ''
          this.form.nodeAvailableType = ''

          this.showServerChoose = true
        })
      }
      this.$nextTick(() => {
        this.setDialogCss()
        if (this.$parent.nodeOperation == 2) {
          if (this.$parent.rightClickNode.parent.data) {
            this.form.parentName = this.$parent.rightClickNode.parent.data.label
          } else {
            this.form.parentName = this.$parent.rightClickData.label
          }

          this.form.interconnectCode = this.$parent.rightClickData.payload.interconnectCode
          this.form.groupName = this.$parent.rightClickData.label
        } else if (this.$parent.nodeOperation == 1) {
          this.form.parentName = this.$parent.rightClickData.label
          this.form.interconnectCode = ''
          this.form.groupName = ''
        }
      })
    },

    dialogClosed() {
      this.$parent.dialogFormVisible_add = false
      this.$parent.maskloading = false
    },

    dialogClosed1() {
      this.showServer = false
    },

    setFormRules() {
      var regNatIP =
        /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/
      var validategatewayNatIp = (rule, value, callback) => {
        if (this.form.nodeAvailableType == 1 && this.ifShowAva) {
          if (!this.form.gatewayNatIp) {
            callback(new Error(this.$t('GBShare.mappedPublicNetworkAddress')))
          } else if (this.form.gatewayNatIp && !regNatIP.test(this.form.gatewayNatIp)) {
            callback(new Error(this.$t('GBShare.mappedPublicNetworkAddressS')))
          } else {
            callback()
          }
        } else {
          if (this.form.gatewayNatIp && !regNatIP.test(this.form.gatewayNatIp)) {
            callback(new Error(this.$t('GBShare.mappedPublicNetworkAddressS')))
          } else {
            callback()
          }
        }
      }
      this.rules = {
        parentName: [
          {
            required: true,
            message: this.$t('GBShare.selectParentNode'),
            trigger: 'change'
          }
        ],
        groupName: [
          {
            required: true,
            message: this.$t('GBShare.inputNodeName'),
            trigger: 'change'
          },
          {
            max: 255,
            message: this.$t('GBShare.length255'),
            trigger: 'change'
          }
        ],
        interconnectCode: [
          {
            required: false,
            message: this.$t('GBShare.nodeCode'),
            trigger: 'change'
          },
          {
            pattern: /^[0-9]{20}$/,
            message: this.$t('GBShare.nodeCode20')
          }
        ]
      }
    },

    // 表单提交
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$parent.maskloading = true
          let form = this.form

          if (this.$parent.nodeOperation == 1) {
            let data = {
              parentId: this.$parent.choosedParentId,
              groupName: form.groupName,
              platId: this.$parent.choosedPlatId,
              interconnectCode: form.interconnectCode
            }
            // 添加
            this.$api.addGroup(data).then(res => {
              if (res.resultCode == 0) {
                this.$nextTick(() => {
                  const node = this.$parent.$refs.treeList.getNode(this.$parent.rightClickData.id)
                  const data = node.data.payload.parents
                  if (node.expanded) {
                    node.loaded = false
                  } else {
                    node.expanded = true
                  }
                  node.loadData()

                  this.$parent.maskloading = false
                  this.$parent.dialogFormVisible_add = false

                  this.$message({
                    type: 'success',
                    message: this.$t('public.addSuccess')
                  })
                })
              } else {
                this.$parent.maskloading = false
              }
            })
          } else if (this.$parent.nodeOperation == 2) {
            let data = {
              groupId: this.$parent.rightClickData.id,
              groupName: form.groupName,
              interconnectCode: form.interconnectCode,
              platId: this.$parent.choosedPlatId
            }

            // 编辑
            this.$api.modifyGroup(data).then(res => {
              if (res.resultCode == 0) {
                this.$nextTick(() => {
                  let node = this.$parent.$refs.treeList.getNode(this.$parent.rightClickData.id)
                  //更新面包屑
                  node.data.label = form.groupName
                  node.data.payload.interconnectCode = this.form.interconnectCode
                  this.$parent.maskloading = false
                  this.$parent.dialogFormVisible_add = false
                  this.$message({
                    type: 'success',
                    message: this.$t('public.modifySuccess')
                  })
                })
              } else {
                this.$parent.maskloading = false
              }
            })
          }
        }
      })
    },

    successResult(res, title) {
      if (res.resultCode === 0) {
        this.$parent.dialogFormVisible_add = false
        this.$message({
          type: 'success',
          message: title
        })
        this.$parent.handleFind()
      }
      this.$parent.maskloading = false
    }
  }
}
</script>

<style lang="scss">
.GGBShareTreeNodeAddDialog {
  .el-dialog__body {
    .el-date-editor {
      .el-range-input,
      .el-range-separator {
        color: #262626;
      }
    }
  }
  .avatar-upload {
    width: 100px;
    height: 100px;
    line-height: 100px;
    cursor: pointer;
  }
  .avatar {
    width: 100px;
    height: 100px;
    display: inline-block;
  }
  .serverDialog {
    .el-dialog__body {
      padding: 20px;
    }
  }
  .el-cascader {
    width: 100%;
  }
}
</style>
