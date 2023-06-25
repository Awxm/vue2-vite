import Vue from 'vue';
import Router from 'vue-router';
import Account from './account';
import { data } from './sort/index.json';

import Layout from '@/layout';

Vue.use(Router);

let filesArr = [];
const routerFiles = [];

const files = import.meta.glob('./modules/*.js', { eager: true });

const keys = Object.keys(files);

keys.forEach((key) => {
  const fileName = [key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')][0];
  const fileValue = files[key].default;
  const i = data.findIndex((f) => f === fileName);
  filesArr = filesArr.concat({ list: fileValue, sort: i });
});

filesArr.sort((a, b) => a.sort - b.sort); // 排序
filesArr.forEach((r) => {
  r.list.forEach((e) => {
    e.component = Layout;
    routerFiles.push(e);
  });
});

routerFiles.push({ path: '*', redirect: '/404', hidden: true });

export const constantRoutes = [...Account];
export const asyncRoutes = [...routerFiles];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
