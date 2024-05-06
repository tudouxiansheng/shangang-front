<template>
  <!-- 测量 -->
  <ul class="measurement">
    <li @click="rangingClick(0)" :class="rangingIndex == 0 ? 'active' : ''">
      {{ $t('gis.measureistance') }}
    </li>
    <li @click="rangingClick(1)" :class="rangingIndex == 1 ? 'active' : ''">
      {{ $t('gis.measureArea') }}
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    mouseTool: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      rangingIndex: 0
    }
  },
  methods: {
    rangingClick(index) {
      this.rangingIndex = index
      index == 0 ? this.measureRule() : this.measureArea()
    },
    // 测量距离
    measureRule() {
      this.mouseTool.rule({
        strokeColor: '#FF6B6B',
        strokeOpacity: 1,
        strokeWeight: 10,
        // 线样式还支持 'dashed'
        strokeStyle: 'solid',
        lineOptions: {
          // 可缺省
          strokeStyle: 'solid',
          strokeColor: '#FF6B6B',
          strokeOpacity: 1,
          strokeWeight: 3
        }
      })
    },
    // 测量面积
    measureArea() {
      this.mouseTool.measureArea({
        strokeColor: '#FF6B6B',
        strokeOpacity: 1,
        strokeWeight: 1,
        fillColor: '#FF6B6B',
        fillOpacity: 0.3,
        // strokeStyle还支持 solid
        strokeStyle: 'solid'
        // strokeDasharray: [30,10],
      })
    }
  }
}
</script>

<style lang="scss">
.measurement {
  position: absolute;
  top: 90px;
  right: 20px;
  background: #fff;
  padding: 16px 10px;
  border-radius: 4px;
  box-shadow: 3px 2px 9px 0px rgba(108, 108, 108, 0.18);
  z-index: 999;
  li {
    display: inline-block;
    padding: 0 10px;
    line-height: 18px;
    border-right: 1px dashed #7a869a;
    font-size: 14px;
    font-weight: 400;
    color: #7a869a;
    cursor: pointer;
    &:last-child {
      border: none;
    }
    &.active {
      color: #2c6dd2;
    }
  }
}
</style>
