<template>
  <div class="has-logo">
    <logo :collapse="false" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="false"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item v-for="route in sidebarRoutes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Mixin from '../mixin/index.js';
import Logo from './Logo.vue';
import SidebarItem from './SidebarItem.vue';
import variables from '@/styles/variables.module.scss';

export default {
  name: 'Sidebar',
  components: { SidebarItem, Logo },
  mixins: [Mixin],
  computed: {
    ...mapGetters(['permission_routes']),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },

    sidebarRoutes() {
      const route = this.$route;
      const { path, meta } = route;
      let key = path;
      if (meta.topTab) key = meta.topTab;
      return this.permission_routes.filter((f) => {
        const oneChild = this.hasOneShowingChild(f.children, f);
        return !f.hidden && key === f[oneChild ? 'redirect' : 'path'];
      });
    },

    variables() {
      return variables;
    },
  },
};
</script>
