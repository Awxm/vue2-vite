const equipment = () => import('@v/equipment');
const lists = [
  {
    path: '/equipment',
    redirect: '/equipment/index',
    meta: { title: '仪器设备', roles: ['test_instruments_reception'] },
    children: [
      {
        path: 'index',
        name: 'Equipment',
        component: equipment,
        meta: { title: '仪器列表' },
      },
    ],
  },
];
export default lists;
