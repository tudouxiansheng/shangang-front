<template>
  <span>
    <slot :onClick="open" />
    <el-dialog
      title="算法参数模板"
      :visible.sync="visible"
      top="10vh"
      append-to-body
      modal-append-to-body
      class="algorithm-tmpl-editor-shortcut"
      :close-on-click-modal="false"
      :modal="false"
      draggable
    >
      <el-form
        ref="form"
        :model="formData"
        :rules="formRules"
        class="addForm"
        label-suffix="："
        label-position="right"
        :disabled="readonly"
      >
        <el-form-item label="检测类型">
          <span>{{ value.templateName }}</span>
        </el-form-item>
        <el-form-item label="模板">
          <span>{{ value.name }}</span>
        </el-form-item>
        <el-form-item label="Json参数" prop="json">
          <el-input type="textarea" :autosize="{ minRows: 8, maxRows: 18 }" v-model="formData.json"> </el-input>
        </el-form-item>
      </el-form>
      <template #footer v-if="!readonly">
        <span class="dialog-footer">
          <el-button @click="visible = false">{{ $t('public.cancel') }}</el-button>
          <el-button @click="reset">重置</el-button>
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
    customTemplates: {},
    value: {},
  },
  data() {
    return {
      visible: false,
      formData: {
        json: '',
      },
      formRules: {
        json: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!value?.trim()) {
                callback(new Error('请输入JSON模板'))
              } else {
                try {
                  if (typeof JSON.parse(value) !== 'object') throw new Error()
                  callback()
                } catch (e) {
                  callback(new Error('无效的JSON模板'))
                }
              }
            },
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
      if (JSON.stringify(this.value.json) !== JSON.stringify(this.formData.json)) {
        const customTemplates = { ...(this.customTemplates || {}) }
        customTemplates[this.value.id] = { json: this.formData.json }
        this.$emit('update:customTemplates', customTemplates)
      } else if (this.customTemplates && this.customTemplates[this.value.id]) {
        delete this.customTemplates[this.value.id]
        this.$emit('update:customTemplates', { ...this.customTemplates })
      }
      this.visible = false
    },
    open() {
      if (this.customTemplates && this.customTemplates[this.value.id]) {
        this.formData.json = this.customTemplates[this.value.id].json
      } else this.formData.json = this.value.json
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
.taskDetailDialog {
}
</style>
