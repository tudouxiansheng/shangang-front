<template>
  <div class="collapse-box">
    <div class="collapse-box-title" @click="$parent.handleShowEchart">
      <div>
        <slot></slot>
      </div>
      <div>
        {{ $parent.isShowEchart ? $t('public.collapse') : $t('public.unfold') }}
        <i v-if="!$parent.isShowEchart" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div>
    <div class="collapse-box-content" v-show="$parent.isShowEchart">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'collapse'
}
</script>

<style lang="scss" scoped>
.collapse-box {
  .collapse-box-title {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    color: #fff;
    background-color: rgba(15, 64, 93, 0.5);
    font-size: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .collapse-box-content {
  }
}
</style>
