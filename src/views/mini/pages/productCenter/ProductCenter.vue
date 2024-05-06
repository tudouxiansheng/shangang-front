<template>
  <!-- <div class="screen"> -->
  <div
    class="ProductContainer"
    :style="{ height: Mheight + 'px', backgroundImage: 'url(' + Mimg + ')' }"
  >
    <router-view></router-view>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  data() {
    return {
      Mheight: document.documentElement.clientHeight,
      Mwidth: document.documentElement.clientWidth,
      Mimg: require('./assets/background.png'),
    }
  },
}
</script>

<style>
.ProductContainer {
  overflow: hidden;
  padding-top: 60px;
}
</style>
