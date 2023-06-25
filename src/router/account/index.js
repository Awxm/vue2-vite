const login = () => import('@v/login');
const err = () => import('@v/404');
const list = [
  {
    path: '/login',
    component: login,
    hidden: true,
  },

  {
    path: '/404',
    component: err,
    hidden: true,
  },
];
export default list;
