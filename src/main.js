import Vue from 'vue';

import ElementUI from 'element-ui';

import message from '@u/reset-message/index.js';
import Pagination from '@c/Pagination/index.vue';
import SearchBox from '@c/search-box/index.vue';
import { post, get } from '@/https/request.js';
import urls from '@/https/urls.js';
import checkPermission from '@/directives/check/permission'; // 权限判断函数

import 'normalize.css/normalize.css'; // A modern alternative to CSS resets
import 'element-ui/lib/theme-chalk/index.css';
import '@/styles/index.scss'; // global css
import App from './App.vue';
import store from './store/index.js';
import router from './router';

import directives from '@/directives';

import * as filters from './filters';

import '@/permission'; // permission control

Vue.use(directives); // 安装命令
Vue.use(ElementUI);

Vue.prototype.urls = urls;
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.checkPermission = checkPermission;

Vue.prototype.$message = message;
Vue.config.productionTip = false;
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key]);
});

Vue.component(SearchBox.name, SearchBox);
Vue.component(Pagination.name, Pagination);

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App),
});
