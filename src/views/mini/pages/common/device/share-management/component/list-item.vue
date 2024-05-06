<template>
  <div class="shareDevDialog">
    <div class="tree-header" style="margin-left: 10px">
      <img :src="src" alt="" />
      <span>{{ txt.preShare }}</span>
    </div>
    <div class="tree-list">
      <div class="tree-list-user">
        <div
          class="chooseUser"
          v-for="(item, i) in chooseUserDevList"
          :key="item.id"
          :title="item.label"
          :class="activeSty(item)"
          @click="handleClickUser(item)"
        >
          <el-icon :class="iconSty(item, '01')" class="aci" />
          <span>{{ item.label }}</span>
          <el-icon class="el-icon-close delete-item" @click="handleDeleteUser(i)"></el-icon>
        </div>
      </div>
      <div class="tree-list-dev">
        <template v-if="chooseUserDevList.length">
          <div
            class="chooseUser-item"
            v-for="(item1, index) in currentDevList"
            :key="item1.id"
            :title="item1.label"
          >
            <el-icon :class="iconSty(item1, '02')" class="aci" />
            <span>{{ item1.label }}</span>
            <el-icon
              class="el-icon-close delete-item"
              @click="handleDelete(selectedId, index)"
            ></el-icon>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import constantsMixin from '../mixin/constantsMixin'
import devIcon from '@/utils/common/dev-icon.js'
const { getDevIcon } = devIcon()
export default {
  mixins: [constantsMixin],
  props: {
    chooseUserDevList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      src: require('@/assets/img/common/share-title-item.png'),
      selectedId: ''
    }
  },
  computed: {
    currentDevList() {
      const index = this.chooseUserDevList.findIndex(
        chooseUser => chooseUser.id === this.selectedId
      )
      if (index > -1) {
        return this.chooseUserDevList[index]['list']
      } else {
        return []
      }
    }
  },
  watch: {
    chooseUserDevList: {
      handler(val) {
        if (val && val.length) {
          if (!this.selectedId) {
            this.selectedId = val[0].id
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    nodeClick() {},
    nodeCheck() {},
    activeSty(item) {
      if (item.id == this.selectedId) {
        return 'item active'
      } else {
        return 'item'
      }
    },
    iconSty(item, type) {
      if (type == '01') {
        if (item.type == 1 && item.payload.type == 1) {
          if (item.id == this.selectedId) {
            return 'aci-organization iconCss1'
          }
          return 'aci-organization iconCss'
        } else {
          if (item.type == 1) {
            if (item.id == this.selectedId) {
              return 'aci-x006-folder iconCss1'
            }
            return 'aci-x006-folder iconCss'
          } else {
            if (item.id == this.selectedId) {
              return 'aci-person iconCss1'
            }
            return 'aci-person iconCss'
          }
        }
      } else if (type == '02') {
        if (item.type == 1 && item.payload.type == 1) {
          if (item.id == this.selectedId) {
            return 'aci-organization iconCss1'
          }
          return 'aci-organization iconCss'
        } else if (item.type == 1) {
          if (item.id == this.selectedId) {
            return 'aci-x006-folder iconCss1'
          }
          return 'aci-x006-folder iconCss'
        } else {
          return getDevIcon(item.payload.status, item.payload.deviceType)
        }
      }
    },
    handleClickUser(item) {
      const index = this.chooseUserDevList.findIndex(user => user.id === item.id)
      if (index > -1) {
        this.selectedId = item.id
      }
    },
    handleDelete(id, i) {
      this.$emit('handleDelete', id, i)
    },
    handleDeleteUser(i) {
      this.$emit('handleDeleteUser', i)
    }
  }
}
</script>
<style lang="scss">
.shareDevDialog .tree-list {
  i.aci.iconCss {
    color: #a5a5a5;
  }
  i.aci.iconCss1 {
    color: #3085cb;
  }
  .el-scrollbar {
    background: unset !important;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  ::-webkit-scrollbar-track {
    background-color: #f2f2f2 !important;
  }

  /*定义滑块 内阴影+圆角*/
  ::-webkit-scrollbar-thumb {
    background-color: #b3b3b3 !important;
  }

  // 定义滚动条轨道 边角
  ::-webkit-scrollbar-corner {
    background-color: #f2f2f2 !important;
  }
}
</style>
