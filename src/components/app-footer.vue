<template>
  <el-footer id="main-footer" :style="footerStyle">
    <div>
      <span>{{ flavorObj.copyright }}</span>
      <a :href="flavorObj.registrationUrl" target="_blank" rel="noopener noreferrer">
        {{ flavorObj.registration }}
      </a>
      <span v-if="flavorObj.phoneNumber != ''">
        {{ $t('login.allRightPhoneNum') }}：{{ flavorObj.phoneNumber }}
      </span>
    </div>
  </el-footer>
</template>

<script>
export default {
  props: ['flavorObj', 'footerStyle'],
  data() {
    return {}
  }
}
</script>

<style lang="scss">
//页脚版权
#main-footer {
  position: fixed;
  bottom: 0;
  z-index: 999;
  line-height: 20px;
  text-align: center;
  color: #fff;
  font-size: 12px;
  a {
    color: #0085d0;
    text-decoration: none;
  }
}
</style>
