<template>
  <span>
    <slot :onClick="open" />
    <el-dialog
      :title="`${!readonly ? '添加' : '查看'}算法`"
      :visible.sync="visible"
      width="300px"
      top="10vh"
      append-to-body
      modal-append-to-body
      class="algorithm-editor-shortcut"
      :close-on-click-modal="false"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="readonly ? {} : formRules"
        class="addForm"
        label-suffix="："
        label-position="right"
        :disabled="readonly"
      >
        <el-form-item label="算法名称" prop="name">
          <el-input v-model="formData.name"> </el-input>
        </el-form-item>
        <el-form-item label="算法类型" prop="type">
          <el-input v-model="formData.type"> </el-input>
        </el-form-item>
        <el-form-item label="算法平台" prop="platform">
          <el-select clearable :popper-append-to-body="false" v-model="formData.platform">
            <el-option :label="$t('public.all')" value></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer v-if="!readonly">
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('public.cancel') }}</el-button>
          <el-button type="primary" @click="confirm">{{ $t('public.confirm') }}</el-button>
        </span>
      </template>
    </el-dialog>
  </span>
</template>

<script>
export default {
  components: {},
  props: {
    readonly: {
      type: Boolean,
    },
    value: {},
  },
  data() {
    return {
      visible: false,
      formData: {},
      formRules: {
        name: [
          {
            required: true,
            message: `请输入算法名称`,
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            message: `请输入算法类型`,
            trigger: 'blur',
          },
        ],
        platform: [
          {
            required: true,
            message: `请选择算法平台`,
            trigger: 'blur',
          },
        ],
      },
    }
  },
  computed: {},
  watch: {},
  methods: {
    reset() {
      this.formData.json = this.value.json
    },
    async confirm() {
      await this.$refs.form.validate()
      this.visible = false
    },
    open() {
      if (this.value) {
        this.formData.name = '测试'
        this.formData.type = '演示'
        this.formData.platform = ''
      }
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
.algorithm-editor-shortcut {
}
</style>
