<template>
  <span>
    <slot :onClick="open" />
    <el-dialog
      :title="`编辑算法参数模板`"
      :visible.sync="visible"
      width="600px"
      top="10vh"
      append-to-body
      modal-append-to-body
      class="AlgorithmTemplatesEditor"
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
        label-width="110px"
        :disabled="readonly"
      >
        <el-form-item label="算法名称" prop="name">
          <span>{{ formData.name }}</span
          ><el-button
            type="primary"
            style="margin-left: 18px"
            :disabled="formData.templates?.length >= maxTemplates"
            @click="addTemplate"
            >添加模板</el-button
          >
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formData.templates || []"
          :label="`模板${index + 1}`"
          :key="item.id"
          :prop="`templates.${index}.value`"
          :rules="{
            required: true,
            message: '模板不能为空',
            trigger: 'blur',
          }"
        >
          <TemplateItem
            v-model="item.value"
            :removable="formData.templates.length > 1"
            @delete="removeTemplate"
            @setAsDefault="setAsDefault"
          />
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
import TemplateItem from '@views/mini/pages/common/algorithm/config/components/AlgorithmTemplatesEditor/TemplateItem.vue'

export default {
  components: { TemplateItem },
  props: {
    readonly: {
      type: Boolean,
    },
    value: {},
    maxTemplates: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {
      visible: false,
      formData: {},
      formRules: {
        name: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        type: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        platform: [
          {
            required: true,
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
    setAsDefault(item) {
      this.formData.templates.forEach((a) => {
        if (a !== item) a.value.isDefault = false
      })
    },
    addTemplate() {
      this.formData.templates = this.formData.templates || []
      if (this.formData.templates.length < this.maxTemplates) {
        this.formData.templates.push({
          value: {
            id: Math.random() + '' + Date.now(),
            isDefault: !this.formData.templates.some((a) => a.value.isDefault),
          },
        })
      }
    },
    removeTemplate(item) {
      var index = this.formData.templates.indexOf(item)
      if (index !== -1) {
        this.formData.templates.splice(index, 1)
      }
    },
    open() {
      if (this.value) {
        this.formData.name = '测试'
        this.formData.templates = []
        this.addTemplate()
        this.formData = { ...this.formData }
      }
      this.visible = true
    },
  },
}
</script>

<style lang="scss">
.AlgorithmTemplatesEditor {
}
</style>
