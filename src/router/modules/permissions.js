const permissions = () => import('@v/permissions/index');
const list = [
  {
    path: '/permissions',
    redirect: '/permissions/index',
    name: 'Permissions',
    meta: { title: '职责管理', icon: 'user' },
    children: [
      {
        path: 'index',
        name: 'Permissions',
        component: permissions,
        meta: { title: '职责', icon: 'el-icon-user' },
      },
    ],
  },
];
export default list;
