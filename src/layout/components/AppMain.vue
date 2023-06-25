<template>
  <section class="app-main">
    <study-breadcrumb></study-breadcrumb>
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
import StudyBreadcrumb from './StudyBreadcrumb.vue';

export default {
  name: 'AppMain',
  components: { StudyBreadcrumb },
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.app-main {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;

  /* 50 = navbar  */
  height: calc(100vh - 0px);
  overflow: hidden;
  background-color: #f6f7f9;
}

.fixed-header + .app-main {
  padding-top: 68px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
