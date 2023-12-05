export default [
  {
    path: '/',
    redirect: '/dashboard',
    children: [
      {
        name: 'Dashboard',
        path: 'dashboard',
        component: () => import('@v/dashboard/index'),
        meta: { title: '首页', icon: 'el-icon-eleme' },
      },
    ],
  },
];
