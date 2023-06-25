<template>
  <div class="app-wrapper openSidebar">
    <sidebar class="sidebar-container" />
    <div class="main-container">
      <div :class="{ 'fixed-header': fixedHeader }">
        <navbar />
      </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
  },
  mixins: [],
  computed: {
    fixedHeader() {
      return this.$store.state.settings.fixedHeader;
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';
@import '@/styles/variables.module.scss';

.app-wrapper {
  @include clearfix;

  position: relative;
  width: 100%;
  height: 100%;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  box-sizing: border-box;
  width: calc(100% - #{$sideBarWidth});
  border-bottom: 1px solid #f0f0f0;
  transition: width 0.28s;
}
</style>
