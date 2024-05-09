<template>
  <div>
    <div style="display: flex; align-items: center">
      <el-input
        :value="value.name"
        maxlength="30"
        show-word-limit
        @input="onChange('name', $event)"
        style="width: unset; flex: 1"
      ></el-input>
      <i
        class="el-icon-remove"
        @click="$emit('delete', value)"
        v-if="removable"
        style="margin-left: 8px; font-size: 18px; color: red"
      />
    </div>
    <div style="display: flex; align-items: center">
      <el-checkbox
        :value="value.isDefault"
        @input="
          onSetAsDefault($event)
          onChange('isDefault', $event)
        "
        >设为默认模板</el-checkbox
      >
    </div>
    <div style="display: flex; align-items: center">
      <el-input
        type="textarea"
        :autosize="{ minRows: 8, maxRows: 18 }"
        :value="value.json"
        @input="onChange('json', $event)"
      >
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    canUnsetDefault: {
      type: Boolean,
    },
    removable: {
      type: Boolean,
    },
    value: {},
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    onChange(k, v) {
      if (k === 'isDefault' && !this.canUnsetDefault && !v) return
      this.$emit('input', { ...this.value, [k]: v })
    },
    onSetAsDefault(v) {
      if (v) this.$emit('setAsDefault', v)
    },
  },
}
</script>

<style lang="scss">
.AlgorithmTemplatesEditor {
}
</style>
