<template>
  <div>
    <el-dialog
      :title="$t('faultAndWorkorder.createWorkorder')"
      v-model="isVisible"
      top="10vh"
      width="500px"
      :close-on-click-modal="false"
      :modal="false"
      @open="dialogOpen"
      @closed="dialogClosed"
      draggable
    >
      <el-form
        ref="form"
        :model="form"
        :rules="formRules"
        label-width="130px"
        label-position="left"
      >
        <el-form-item :label="$t('faultAndWorkorder.workorderDes') + ':'" prop="remark">
          <el-input
            v-model="form.remark"
            clearable
            type="textarea"
            :rows="2"
            maxlength="256"
            show-word-limit
            :placeholder="$t('faultAndWorkorder.workorderDesProp')"
          ></el-input>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.maintainer') + ':'" prop="maintainerId">
          <treeselect
            :options="treeOption"
            :clearable="false"
            :normalizer="normalizer"
            :placeholder="$t('faultAndWorkorder.maintainerProp')"
            :disable-branch-nodes="true"
            v-model="form.maintainerId"
          />
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.deadline') + ':'" prop="deadline">
          <el-date-picker
            v-model="form.deadline"
            type="date"
            :placeholder="$t('faultAndWorkorder.deadlineProp')"
            value-format="YYYY-MM-DD"
            :pickerOptions="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.level') + ':'" prop="level">
          <el-radio-group v-model="form.level">
            <el-radio v-for="(item, index) in workorderLevelData" :key="index" :label="item.code">
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="text-center">
          <el-button @click="dialogClosed">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="handleSubmit">{{ $t('workOrder.submit') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { LOAD_ROOT_OPTIONS } from 'vue3-treeselect'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { mapState } from 'vuex'
export default {
  components: { Treeselect },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      roleId: undefined,
      treeOption: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
        }
      },
      form: {
        faultId: undefined,
        remark: undefined,
        maintainerId: undefined,
        deadline: undefined,
        level: 3
      },
      formRules: {
        woId: [{ required: true, trigger: 'change' }],
        operatType: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.disposeOperationProp'),
            trigger: 'change'
          }
        ],
        maintainerId: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.maintainerProp'),
            trigger: 'change'
          }
        ],
        level: [
          {
            required: true,
            message: this.$t('faultAndWorkorder.levelProp'),
            trigger: 'change'
          }
        ],
        remark: [
          {
            max: 256,
            message: this.$t('faultAndWorkorder.workorderDes256Prop'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState({
      workorderLevelData: state => state.dict.workorder_level
    }),
    isVisible: {
      get() {
        return this.dialogVisible
      },
      set(val) {
        this.$emit('update:dialogVisible', val)
      }
    }
  },
  methods: {
    dialogOpen() {
      this.form.faultId = this.$parent.faultId
      this.getMaintainerRole()
    },
    async getMaintainerRole() {
      let res1 = await this.$api.getMaintainerRole()
      if (res1.resultCode == 0) {
        let roleId = res1.roleId
        let res2 = await this.$api.getUserTree({
          roleId,
          type: 2,
          parentId: this.$parent.devOrgId
        })
        if (res2.resultCode == 0) {
          this.treeOption = res2.nodeList
        }
      }
    },
    handleSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let formCopy = JSON.parse(JSON.stringify(this.form))
          delete formCopy.operatType
          let res = await this.$api.addWorkOrderInfo(formCopy)
          if (res.resultCode == 0) {
            this.$parent.getFaultList()
            this.$message({
              message: this.$t('faultAndWorkorder.workorderCreateSuccess'),
              type: 'success'
            })
            this.isVisible = false
          }
        }
      })
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.isVisible = false
    },
    normalizer(node) {
      if (node.type == 1 && !node.children) {
        node['isDisabled'] = true
      }
    },
    loadOptions({ action, parentNode, callback }) {
      this.$api
        .getUserTree({
          parentId: parentNode?.id,
          type: 1,
          roleId: '00000000000000000403000999999999'
        })
        .then(res => {
          if (res.resultCode === 0) {
            if (action === LOAD_ROOT_OPTIONS) {
              this.treeOption = this.normalizeChildren(res.nodeList)
            } else {
              parentNode.children = this.normalizeChildren(res.nodeList)
            }
          }
          callback()
        })
    },
    /** 处理组织表单数据 */
    normalizeChildren(data) {
      if (data.length == 0) return {}
      return data.map(item => {
        let obj = {
          id: item.payload.organizationId,
          label: item.label,
          children: null
        }
        if (item.leaf === true) {
          delete obj.children
        }
        if (item.type == 1 && !item.children) {
          obj['isDisabled'] = true
        }
        return obj
      })
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item--medium) .el-form-item__content {
  line-height: 36px !important;
}
:deep(.el-date-editor.el-input),
.el-date-editor.el-input__inner {
  width: 290px;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
