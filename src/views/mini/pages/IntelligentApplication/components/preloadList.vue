<template>
  <div class="preloadList">
    <div class="pre" @click="prev">
      <i class="el-icon-arrow-left" v-show="tabNum > 0"></i>
    </div>
    <div class="list">
      <div class="list-box">
        <div
          v-for="(item, index) in showList"
          :key="tabNum * 8 + index + 1"
          class="item"
          :class="[activeIndex == tabNum * 8 + index + 1 ? 'active' : '']"
          @click="selItem(item, index)"
        >
          <img :src="item.detectUrl" alt="" />
        </div>
      </div>
    </div>
    <div class="pre" @click="next">
      <i class="el-icon-arrow-right" v-show="tabNum < maxSize"></i>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    // 点击的图片的索引，从1开始
    sortNum: {
      type: Number,
      default: 1,
    },
    list: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      size: 8,
      maxSize: 0,
      tabNum: 0,
      activeIndex: 0,
    }
  },
  computed: {
    showList() {
      return this.list.slice(this.tabNum * 8, this.tabNum * 8 + 8)
    },
  },
  created() {
    this.maxSize = Math.ceil(this.list.length / 8) - 1
    this.tabNum = this.sortNum > 0 ? Math.ceil(this.sortNum / 8) - 1 : 0
    this.activeIndex = this.sortNum
  },
  methods: {
    prev() {
      if (this.tabNum == 0) return
      this.tabNum--
    },
    next() {
      if (this.tabNum == this.maxSize) return
      this.tabNum++
    },
    selItem(item, index) {
      this.$emit('updateDetail', item)
      this.activeIndex = this.tabNum * 8 + index + 1
      // this.$nextTick(() => {
      //   this.$emit('update:sortNum', this.tabNum * 8 + index + 1)
      // })
    },
  },
}
</script>

<style lang="scss" scoped>
.preloadList {
  display: flex;
  height: 120px;
  width: 100%;
  border-top: 1px solid #2b6fd6;
  .pre {
    width: 5%;
    text-align: center;
    line-height: 120px;
    font-size: 20px;
    cursor: pointer;
    &:hover {
      background: rgba(48, 138, 202, 0.3);
    }
  }
  .list {
    width: 90%;
    &-box {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: flex-start;
      .item {
        width: 12%;
        margin-right: 0.5%;
        background: rgba(0, 0, 0, 0.2);
        &.active {
          background: #007fa57d;
        }
        &:hover{
          background: #007fa57d;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          // background: rgba(0, 0, 0, 0.2);
          cursor: pointer;
        }
      }
      :last-child {
        margin-right: 0;
      }
    }
  }
}
</style>