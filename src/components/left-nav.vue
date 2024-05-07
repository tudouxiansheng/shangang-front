<template>
  <!-- 左侧菜单栏 -->
  <div id="leftNav">
    <el-menu
      class="el-menu-vertical-demo"
      :collapse="longNav"
      unique-opened
      style="height: 100vh"
      :collapse-transition="false"
      :default-active="activeIndex"
    >
      <div class="logobox">
        <img class="logoimg" :src="mainLogo" alt v-if="mainLogo" />
        <img class="logoimg" src="@/assets/img/common/centerlogo.png" alt v-if="!mainLogo" />
        <p class="title" v-show="!longNav" :title="$t('login.loginTitle')">
          {{ $t('login.title') }}
        </p>
      </div>
      <div @click="showMenus" class="openBtn">
        <img src="@/assets/img/common/he.png" style="width: 12px; height: 12px" v-if="longNav" />
        <img src="@/assets/img/common/zhankai.png" style="width: 10px; height: 12px" v-else />
      </div>
      <!-- 注意：index是必填的属性  1、index可以看成ID,也就是说它是唯一的
        2、它代表路由的跳转路径-->

      <el-scrollbar :style="!longNav ? 'width: 200px;' : 'width: 64px;'">
        <div v-for="m in menus" :key="'id_' + m.menuId">
          <el-sub-menu
            v-if="m.children"
            :index="'id_' + m.menuId"
            :style="!longNav ? 'width:200px' : 'width:64px'"
          >
            <template #title>
              <span :class="[m.icon, 'aci']"></span>
              <span
                class="menu-text"
                v-title="{ width: 130, longNav: longNav }"
                style="margin-left: 5px"
                v-show="!longNav"
              >
                {{ locale == 'en' ? m.menuNameEn : m.menuName }}
              </span>
            </template>
            <el-menu-item
              v-for="m2 in m.children"
              :key="'id_' + m2.menuId"
              :index="m2.menuId.toString()"
              @click="showName(m2)"
            >
              <template #title>
                <span
                  class="menu-text"
                  v-title="{ width: 130, longNav: longNav }"
                  style="margin-left: 5px"
                >
                  {{ locale == 'en' ? m2.menuNameEn : m2.menuName }}
                </span>
              </template>
            </el-menu-item>
          </el-sub-menu>

          <el-menu-item v-else :index="m.menuId.toString()" @click="showName(m)">
            <span :class="[m.icon, 'aci']"></span>
            <template #title>
              <span style="margin-left: 5px">
                {{ locale == 'en' ? m.menuNameEn : m.menuName }}
              </span>
            </template>
          </el-menu-item>
        </div>
      </el-scrollbar>
    </el-menu>
  </div>
</template>

<script>
export default {
  props: ['menus', 'mainLogo'],

  data() {
    return {
      locale: localStorage.getItem('locale')
    }
  },
  computed: {
    activeIndex: {
      get() {
        return this.$store.state.menu.activeIndex
      },
      set(val) {
        this.$store.commit('menu/set_active_index', val)
      }
    },
    longNav: {
      get() {
        return this.$store.state.menu.longNav
      },
      set(val) {
        this.$store.commit('menu/set_longNav', val)
      }
    }
  },
  methods: {
    // 展开闭合
    showMenus() {
      this.longNav = !this.longNav
      
    },
    // 跳转菜单
    showName(data) {
      let menuName = this.locale == 'en' ? data.menuNameEn : data.menuName
      // 把菜单名称放进去，当成tab页的名称
      this.$store.commit('menu/set_showName', menuName)
      this.$store.commit('menu/set_role', 'pass')
      this.$emit('third_menu', data)
    }
  }
}
</script>

<style lang="scss">
#leftNav {
  .el-menu {
    border: none;
    --el-menu-hover-bg-color: #3085cb;
  }

  .el-menu.el-menu--collapse {
    .el-sub-menu__title {
      padding: 0 32px;

      .aci {
        transform: translateX(-50%);
      }
    }

    .el-sub-menu__icon-arrow {
      display: none;
    }
  }

  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }

  .logobox {
    height: 50px;
    color: #fff;
    font-size: 16px;
    text-align: center;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .logoimg {
      height: 20px;
    }

    .title {
      margin: 0 5px;
      white-space: nowrap;
      text-overflow: ellipsis;
      word-break: break-all;
      overflow: hidden;
    }
  }

  .openBtn {
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
  }

  .el-icon-arrow-right {
    display: none;
  }

  .el-submenu__title i {
    color: #ccc;
  }

  .el-submenu__icon-arrow {
    right: 15px;
    margin-top: -5px;
  }

  .el-menu-item-group__title {
    padding: 0px;
  }

  .menu-text {
    display: inline-block;
    width: 130px;
  }

  .el-submenu__title *,
  .el-menu-item * {
    vertical-align: middle;
  }

  .el-sub-menu {
    .el-sub-menu__title {
      color: #fff;
    }
  }
}
</style>
