import message from '@u/reset-message/index.js';

import getPageTitle from '@u/get-page-title';

import NProgress from 'nprogress';
import router from './router';
import store from './store';

import 'nprogress/nprogress.css';

NProgress.configure({ showSpinner: false });

const whiteList = ['/login'];

router.beforeEach(async (to, from, next) => {
  NProgress.start();
  document.title = getPageTitle(to.meta.title);
  const { auid } = store.getters;
  if (auid) {
    if (to.path === '/login') {
      next({ path: '/' });
      NProgress.done();
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;
      const hasPermissionRoutes = store.getters.permission_routes.length > 0;
      // 权限列表一开始可能为空
      if (hasRoles && hasPermissionRoutes) {
        next();
      } else {
        try {
          const { roles } = await store.dispatch('user/getInfo');
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
          router.addRoutes(accessRoutes);
          next({ ...to, replace: true });
        } catch (error) {
          await store.dispatch('user/resetToken');
          message.error(error || 'Has Error');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else if (whiteList.indexOf(to.path) !== -1) {
    next();
  } else {
    next(`/login?redirect=${to.path}`);
    NProgress.done();
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
