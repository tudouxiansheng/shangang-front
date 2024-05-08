<style lang="scss" scoped>
.algorithm-editor {
  display: flex;
  flex-wrap: wrap;
}
</style>
<template>
  <div
    class="algorithm-editor"
    v-loading="loading"
    element-loading-text="加载数据中..."
    element-loading-spinner="el-icon-loading"
  >
    <Item
      style="margin: 0 18px 18px 0"
      v-for="a in options"
      :key="a.id"
      :customTemplates.sync="value.customTemplates"
      :metadata="a"
      :highlight="a.id === value.algorithmId"
      :templateId="value.algorithmTemplateId"
      @delete="onDelete"
      @select="onSelect"
      @templateChange="onTemplateChange(a, $event)"
    />
  </div>
</template>

<script>
import Item from './item.vue'
export default {
  components: {
    Item,
  },
  props: {
    value: {},
  },
  watch: {
    EMIYA: function (val) {},
  },
  computed: {},
  data() {
    return {
      options: [],
      loading: false,
    }
  },
  async created() {
    this.loading = true
    try {
      this.options = (await this.$api.getAlgorithmOptions()).data
    } finally {
      this.loading = false
    }
  },
  methods: {
    onTemplateChange(algorithm, tmpl) {
      algorithm.selectedTemplateId = tmpl.id
      this.options = this.options.map((a) => (a === algorithm ? { ...algorithm } : a))
      if (this.value.algorithmId === algorithm.id) {
        this.value.algorithmTemplateId = tmpl.id
        this.$emit('input', { ...this.value })
      }
    },
    async onDelete({ id }) {
      await this.$confirm(
        '删除后任务内所选的所有摄像头的该算法将同步删除，不再生效。是否确认删除',
        this.$t('public.prompt'),
        {
          confirmButtonText: this.$t('public.confirm'),
          cancelButtonText: this.$t('public.cancel'),
        }
      )
      this.options = this.options.filter((a) => a.id !== id)
    },
    onSelect(tmpl) {
      this.value.algorithmId = tmpl.templateId
      this.value.algorithmTemplateId = tmpl.id
      this.$emit('input', { ...this.value })
    },
  },
}
</script>
