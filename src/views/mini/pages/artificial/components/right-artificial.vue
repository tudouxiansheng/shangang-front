<template>
  <div class="right-artifial">
    <NavBar @componentSwitch="componentSwitch"></NavBar>
    <keep-alive>
      <component :is="componentName"></component>
    </keep-alive>
  </div>
</template>

<script>
import NavBar from '@/views/mini/pages/artificial/components/rightArtifical/NavBar'
import NavCoontentOne from '@/views/mini/pages/artificial/components/rightArtifical/NavCoontentOne'
import NavCoontentTwo from '@/views/mini/pages/artificial/components/rightArtifical/NavCoontentTwo'

export default {
  components: {
    NavBar,
    NavCoontentOne,
    NavCoontentTwo,
  },
  data() {
    return {
      componentName: 'NavCoontentOne', //动态组件名称
    }
  },
  methods: {
    /* 组件传值获取动态组件名称 */
    componentSwitch(value) {
      this.componentName = value
    },
  },
}
</script>

<style lang="scss">
.right-artifial {
  width: 443px;
  height: 906px;
  padding: 0 23px;
  position: absolute;
  pointer-events: auto;
  right: 52px;
  background: url('../../../../../assets/buildingSeting/background.png')
    no-repeat;
  background-size: 100% 100%;
}
</style>
