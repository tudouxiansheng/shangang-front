<style lang="scss" scoped>
.algorithm-item {
  padding: 8px 8px;
  background-color: #4d4d4d;
  color: #fff;
  font-size: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  .tmpl {
    font-size: 12px;
    margin-top: 6px;
    color: #888;
  }
  i {
    position: relative;
    top: 3px;
  }
}
</style>
<template>
  <div class="algorithm-item" :style="{ 'background-color': highlight ? '#134b71' : '' }" @click="onClick">
    <i class="el-icon-delete" style="margin-right: 18px" @click="$emit('delete', metadata)" />
    <div>
      <div>{{ metadata.name }}</div>
      <div class="tmpl">{{ selectedTemplate.name }}</div>
    </div>
    <i class="el-icon-sort" style="margin-left: 38px" />
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    metadata: {},
    templateId: {},
    highlight: {
      type: Boolean,
    },
  },
  watch: {
    EMIYA: function (val) {},
  },
  computed: {
    selectedTemplate() {
      let a = this.metadata.templates.find((a) => a.id === this.templateId)
      if (a) return a
      a = this.metadata.templates.find((a) => a.id === this.metadata.selectedTemplateId)
      if (a) return a
      a = this.metadata.templates.find((a) => a.isDefault)
      if (a) return a
      return this.metadata.templates[0]
    },
  },
  data() {
    return {}
  },
  async created() {},
  methods: {
    onClick() {
      this.$emit('select', this.selectedTemplate)
    },
  },
}
</script>
