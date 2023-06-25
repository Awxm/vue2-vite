const reagent = () => import('@v/reagent');
const list = () => import('@v/reagent/list/index.vue');
const transport = () => import('@v/reagent/transport/index.vue');
const recycle = () => import('@v/reagent/recycle/index.vue');
const lists = [
  {
    path: '/reagent',
    redirect: '/reagent/list/index',
    name: 'Reagent',
    isDeep: true,
    meta: {
      title: '试验用试剂',
      roles: [
        'test_reagent_list_management',
        'test_reagent_transport_management',
        'test_reagent_in_out_management',
        'test_reagent_recovery_management',
      ],
    },
    children: [
      {
        path: 'list',
        redirect: '/reagent/list/index',
        name: 'ReagentListInit',
        component: reagent,
        meta: { title: '试剂列表' },
        children: [
          {
            hidden: true,
            path: 'index',
            component: list,
            meta: { activeMenu: '/reagent/list', topTab: '/reagent' },
          },
        ],
      },
      {
        path: 'transport',
        redirect: '/reagent/transport/index',
        name: 'ReagentTransportInit',
        component: reagent,
        meta: { title: '运输交接', roles: ['test_reagent_transport_management'] },
        children: [
          {
            hidden: true,
            path: 'index',
            component: transport,
            meta: { activeMenu: '/reagent/transport', topTab: '/reagent' },
          },
        ],
      },
      {
        path: 'recycle',
        redirect: '/reagent/recycle/index',
        name: 'ReagentRecycleInit',
        meta: { title: '回收记录', roles: ['test_reagent_recovery_management'] },
        component: reagent,
        children: [
          {
            hidden: true,
            path: 'index',
            component: recycle,
            meta: { activeMenu: '/reagent/recycle', topTab: '/reagent' },
          },
        ],
      },
    ],
  },
];
export default lists;
