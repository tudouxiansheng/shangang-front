<template>
  <ul class="right-toolbar">
    <li
      v-for="(item, index) in toolBarList"
      :key="index"
      :class="[toolbarIndex == index ? 'active' : '', 'toolbar']"
      @click="toolbarClick(item.value)"
    >
      <svg-icon :icon-class="item.icon" />
      <span>{{ item.name }}</span>
    </li>
    <slot></slot>
  </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      toolBarList: [
        {
          icon: 'map-info',
          name: this.$t('gis.mapInfo'),
          value: 0,
        },
        {
          icon: 'spatial-query',
          name: this.$t('gis.spatialQuery'),
          value: 1,
        },
        {
          icon: 'display-layer',
          name: this.$t('gis.displayLayer'),
          value: 2,
        },
        {
          icon: 'ranging',
          name: this.$t('gis.ranging'),
          value: 3,
        },
        {
          icon: 'trajectory',
          name: this.$t('trajectory.trajectory'),
          value: 4,
        },
        {
          icon: 'clear',
          name: this.$t('gis.clear'),
          value: 5,
        },
      ],
    }
  },
  computed: {
    ...mapState({
      toolbarIndex: (state) => state.mapSet.toolbarIndex,
    }),
  },
  methods: {
    toolbarClick(index) {
      this.$store.commit('mapSet/set_toolbarIndex', index)
      this.$emit('toolBarChange', index)
    },
  },
}
</script>

<style lang="scss">
.right-toolbar {
  position: absolute;
  top: 20px;
  right: 80px;
  background: #fff;
  padding: 16px 10px;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  .toolbar {
    display: inline-block;
    padding: 0 10px;
    line-height: 18px;
    border-right: 1px dashed #7a869a;
    font-size: 14px;
    font-weight: 400;
    color: #7a869a;
    cursor: pointer;
    .svg-icon {
      font-size: 16px;
      margin-right: 9px;
      color: #7a869a;
      display: inline-block;
    }
    &:last-child {
      border: none;
    }
    &.active {
      .svg-icon,
      i,
      span {
        color: #2c6dd2;
      }
    }
  }
  .toolbar1 {
    border: none;
    i {
      font-size: 16px;
      margin-right: 9px;
      color: #7a869a;
    }
  }
}
</style>
