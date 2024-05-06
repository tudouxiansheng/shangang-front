<template>
  <div class="search-wrapper" :class="showLeftBox ? 'hidden' : ''">
    <div class="search-main">
      <div class="title-wrapper">
        <div class="title">{{ title }}</div>
        <img src="../images/title.png" alt="" />
      </div>
      <div class="search-content">
        <slot></slot>
      </div>
    </div>
    <div
      v-if="!isShow"
      :title="showLeftBox ? $t('public.expand') : $t('public.fold')"
      :class="[showLeftBox ? 'left470 ' : 'left0 ', 'collapse']"
      @click="handleToggleCollapse"
    >
      <img v-if="!showLeftBox" src="../../../../../assets/bigScreen/right@2x.png" alt="" />
      <img v-else src="../../../../../assets/bigScreen/left@2x.png" alt="" />
      <!--      <i :class="[showLeftBox ? 'el-icon-d-arrow-left' : 'el-icon-d-arrow-right', 'colx']"></i>-->
    </div>
  </div>
</template>

<script>
export default {
  name: 'custom-card',
  props: {
    title: {
      type: String,
      default: '',
    },
    collapse: {
      type: Boolean,
      default: false,
    },
    isShow: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    collapse: {
      handler(val) {
        this.showLeftBox = val
      },
      deep: true,
    },
  },
  data() {
    return {
      showLeftBox: false,
    }
  },
  methods: {
    handleToggleCollapse() {
      this.showLeftBox = !this.showLeftBox
    },
  },
}
</script>

<style scoped lang="scss">
.collapse {
  display: none;
  pointer-events: auto;
  position: absolute;
  right: 0;
  top: 50%;
  width: 40px;
  transform: translateY(-50%);
  z-index: 9990;
  cursor: pointer;
  img {
    width: 100%;
  }
}
.search-wrapper {
  width: 560px;
  pointer-events: auto;
  height: calc(100% - 24px);
  padding: 10px 10px 10px 50px;
  position: absolute;
  right: 20px;
  margin-top: 10px;
  box-sizing: border-box;
  color: #fff;
  transition: all 0.5s;
  &:hover {
    .collapse {
      display: block;
    }
  }
  &.hidden {
    right: -520px;
  }
  .colx {
    color: #1efffc;
  }
  .left0 {
    left: 0;
    position: absolute;
    top: 50%;
  }
  .left470 {
    left: -10px;
    position: absolute;
    top: 50%;
    &.collapse {
      display: block;
    }
  }
  .centerItem {
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: auto;
    z-index: 8888;
    cursor: pointer;
  }
  .search-main {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    background: url('../../../../../assets/buildingSeting/background.png') no-repeat;
    background-size: 100% 100%;
  }
  .title-wrapper {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    box-sizing: border-box;
    .title {
      font-size: 16px;
    }
    img {
      width: 28px;
      height: 22px;
      margin-left: 6px;
    }
  }
  .search-content {
    height: calc(100% - 50px);
    overflow: hidden;
    box-sizing: border-box;
  }
}
</style>
