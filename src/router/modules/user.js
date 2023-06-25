const user = () => import('@v/user/index');

const list = [
  {
    path: '/user',
    redirect: '/user/index',
    name: 'User',
    meta: { title: '用户管理', icon: 'user' },
    children: [
      {
        path: 'index',
        component: user,
        meta: { title: '用户列表', icon: 'user' },
      },
    ],
  },
];

export default list;
