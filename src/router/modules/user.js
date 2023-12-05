const list = [
  {
    path: '/user',
    redirect: '/user/index',
    name: 'User',
    meta: { title: '用户管理', icon: 'el-icon-user' },
    children: [
      { path: 'index', component: () => import('@v/user/index'), meta: { title: '用户列表' } },
      { path: 'name', component: () => import('@v/user/index'), meta: { title: '用户操作' } },
    ],
  },
];

export default list;
