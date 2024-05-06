<template>
  <div class="screen">
    <div class="wrapper-ai">
      <div class="artificial">
        <leftArt></leftArt>
      </div>
      <div class="rightArt">
        <right-art></right-art>
      </div>
    </div>
  </div>
</template>

<script>
import leftArt from './components/left-artificial.vue'
import rightArt from './components/right-artificial.vue'
export default {
  components: {
    leftArt,
    rightArt,
  },
}
</script>

<style lang="scss">
.wrapper-ai {
  display: flex;
  justify-content: space-between;

  .artificial {
    position: relative;
    left: 50px;
    margin: 10px;
    width: 354px;
    height: 906px;
  }

  .rightArt {
    position: relative;
  }
}
</style>
