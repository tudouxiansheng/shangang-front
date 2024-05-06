<template>
  <el-card :class="[background ? 'hasBackground' : '', 'collapse-card']" shadow="never">
    <template #header>
      <div class="card-header">
        <span class="card-header-title">
          <span>{{ title }}</span>
        </span>
        <span
          v-if="!hideCollapse"
          :class="[show ? 'arrow-up' : 'arrow-down', 'card-header-tool']"
          class="card-header-tool"
          @click="show = !show"
        >
          {{ show ? $t('public.collapse') : $t('public.unfold') }}
        </span>
        <div class="operate">
          <slot name="operate"></slot>
        </div>
      </div>
    </template>

    <el-collapse-transition>
      <div v-show="show" class="card-body">
        <slot />
      </div>
    </el-collapse-transition>
  </el-card>
</template>

<script>
export default {
  name: 'collapse-card',
  props: {
    title: {
      type: String,
      default: ''
    },
    collapse: {
      type: Boolean,
      default: true
    },
    background: {
      type: Boolean,
      default: false
    },
    hideCollapse: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    show: {
      get() {
        return this.collapse
      },
      set(val) {
        this.$emit('update:collapse', val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.collapse-card {
  margin-bottom: 20px;
  border: none;
  border-bottom: 1px solid #f4f5f7;
  background: #fff;

  &.hasBackground {
    background: #f5f7fa;
    border: none;
  }

  .card-header {
    position: relative;
    font-size: 16px;
    color: #232c3b;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .card-header-title {
      margin-left: 14px;

      &::before {
        content: ' ';
        position: absolute;
        width: 4px;
        height: 16px;
        left: 0;
        bottom: 3px;
        background-color: #2c6dd2;
      }
    }

    .card-header-tool {
      color: #2c6dd2;
      cursor: pointer;
      padding-right: 20px;

      &::after {
        content: ' ';
        position: absolute;
        width: 0px;
        height: 0px;
        top: 8px;
        right: 0;
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
      }

      &.arrow-up::after {
        border-bottom: 6px solid #2c6dd2;
      }

      &.arrow-down::after {
        border-top: 6px solid #2c6dd2;
      }
    }
    .operate {
      position: absolute;
      right: 0;
    }
  }

  .card-body {
    padding: 0px 20px 20px;
  }

  :deep(.el-card__body) {
    padding: 0;
  }

  :deep(.el-card__header) {
    padding: 20px;
    border-bottom: none;
  }
}
</style>
