<template>
  <div class="navbar">
    <div class="tab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane
          v-for="route in tabPane"
          :key="route.path"
          :label="route.meta.title"
          :name="hasOneShowingChild(route.children, route) ? route.redirect : route.path"
        ></el-tab-pane>
      </el-tabs>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img
            src="https://aidi-data-1300131487.cos.ap-guangzhou.myqcloud.com/avatar/subject.png?imageView2/1/w/80/h/80"
            class="user-avatar"
          />
          <span>{{ nickname }}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Mixin from './mixin/index.js';

export default {
  name: 'Navbar',
  components: {},
  mixins: [Mixin],
  data() {
    return {
      activeName: '/user',
    };
  },

  computed: {
    ...mapGetters(['permission_routes', 'avatar', 'nickname']),

    tabPane() {
      return this.permission_routes.filter((f) => !f.hidden);
    },

    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      return meta.topTab || path;
    },
  },

  watch: {
    activeMenu: {
      handler(value) {
        this.activeName = value;
      },
      immediate: true,
    },
  },

  methods: {
    handleClick({ name: path }) {
      this.$router.push(path);
    },

    async logout() {
      await this.$store.dispatch('user/logout');
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  position: relative;
  height: 68px;
  overflow: hidden;
  background: #fff;
  // border: 1px solid #f0f0f0;
  .tab {
    float: left;
    height: 100%;
    padding-left: 30px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    ::v-deep .el-tabs {
      &__item {
        height: 68px;
        line-height: 68px;
      }
      // &__active-bar {
      //   background-color: #fff;
      // }

      &__nav-wrap {
        &::after {
          background-color: #fff;
        }
      }
    }
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 68px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      height: 100%;
      padding: 0 8px;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      height: 100%;
      margin-right: 30px;
      .avatar-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        height: 100%;
        .user-avatar {
          width: 48px;
          height: 48px;
          cursor: pointer;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          font-size: 12px;
          cursor: pointer;
        }
        span {
          margin: 0 16px;
        }
      }
    }
  }
}
</style>
