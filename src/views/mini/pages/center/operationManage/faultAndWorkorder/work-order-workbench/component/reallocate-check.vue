<template>
  <div>
    <el-dialog
      :title="$t('faultAndWorkorder.reallocateCheck')"
      v-model="$parent.dialogVisible1"
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
        <el-form-item :label="$t('faultAndWorkorder.workorderId') + ':'" prop="woId">
          <el-input v-model="form.woId" disabled></el-input>
        </el-form-item>
        <el-form-item :label="$t('public.operating') + ':'" prop="agreed">
          <el-radio-group v-model="form.agreed">
            <el-radio :label="true">{{ $t('faultAndWorkorder.reallocate') }}</el-radio>
            <el-radio :label="false">{{ $t('faultAndWorkorder.reject') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('faultAndWorkorder.workorderDes') + ':'" prop="woRemark">
          <el-input
            v-model="form.woRemark"
            clearable
            type="textarea"
            :rows="2"
            :placeholder="$t('faultAndWorkorder.workorderDesProp')"
          ></el-input>
        </el-form-item>
        <el-form-item
          v-show="form.agreed"
          :label="$t('faultAndWorkorder.maintainer') + ':'"
          prop="maintainerId"
        >
          <treeselect
            :options="treeOption"
            :clearable="false"
            :normalizer="normalizer"
            :placeholder="$t('faultAndWorkorder.maintainerProp')"
            v-model="form.maintainerId"
            :disable-branch-nodes="true"
          />
        </el-form-item>
        <el-form-item
          v-show="form.agreed"
          :label="$t('faultAndWorkorder.deadline') + ':'"
          prop="deadline"
        >
          <el-date-picker
            v-model="form.deadline"
            type="date"
            :placeholder="$t('faultAndWorkorder.deadlineProp')"
            value-format="YYYY-MM-DD"
          ></el-date-picker>
        </el-form-item>
        <el-form-item
          v-show="form.agreed"
          :label="$t('faultAndWorkorder.level') + ':'"
          prop="level"
        >
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
  data() {
    return {
      treeOption: [],
      form: {
        woId: undefined,
        agreed: true,
        woRemark: undefined,
        maintainerId: undefined,
        deadline: undefined,
        level: 3
      },
      formRules: {
        woId: [{ required: true, trigger: 'change' }],
        agreed: [
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
        woRemark: [
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
    })
  },
  methods: {
    dialogOpen() {
      this.form.woId = this.$parent.woId
      this.getMaintainerRole()
      this.getWorkOrderInfo()
    },
    async getWorkOrderInfo() {
      let res = await this.$api.getWorkOrderInfo({ woId: this.form.woId })
      if (res.resultCode == 0) {
        this.form.woRemark = res.woRemark
        this.form.maintainerId = res.maintainerId
        this.form.deadline = res.deadline
        this.form.level = res.level
      }
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
    normalizer(node) {
      if (node.type == 1 && !node.children) {
        node['isDisabled'] = true
      }
    },
    handleSubmit() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          let formCopy = JSON.parse(JSON.stringify(this.form))
          let res = await this.$api.reallocateAudit(formCopy)
          if (res.resultCode == 0) {
            this.$parent.getWorkOrderList()
            this.$refs['form'].resetFields()
            this.$parent.dialogVisible1 = false
            if (this.form.agreed) {
              this.$message({
                message: this.$t('faultAndWorkorder.AcceptanceCheckSuccess'),
                type: 'success'
              })
            } else {
              this.$message({
                message: this.$t('faultAndWorkorder.AcceptanceCheckReject'),
                type: 'success'
              })
            }
          }
        }
      })
    },
    dialogClosed() {
      this.$refs['form'].resetFields()
      this.$parent.dialogVisible1 = false
    }
  }
}
</script>

<style lang="scss" scoped>
:deep(.el-form-item--medium .el-form-item__content) {
  line-height: 36px !important;
}
:deep(.el-date-editor.el-input, .el-date-editor.el-input__inner) {
  width: 290px;
}
:deep(.el-dialog__body) {
  padding: 20px;
}
</style>
