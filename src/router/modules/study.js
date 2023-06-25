const study = () => import('@v/study/index');
const info = () => import('@v/study/info/index.vue');
const criteria = () => import('@v/study/criteria/index.vue');
const subject = () => import('@v/study/subject/index.vue');
const subjectCriyeria = () => import('@v/study/subject/criteria.vue');
const sample = () => import('@v/study/sample/index.vue');
const warehouse = () => import('@v/study/warehouse/index.vue');
const warehouseDetail = () => import('@v/study/warehouse/detail.vue');
const studyPeronnel = () => import('@v/study/info/peronnel.vue');

const list = [
  {
    path: '/',
    redirect: '/study',
    name: 'Study',
    isDeep: true,
    meta: { title: '项目管理', icon: 'el-icon-folder-opened' },
    children: [
      {
        path: '/study',
        redirect: '/study/info/index',
        isDeep: true,
        component: study,
        meta: { title: '项目管理', icon: 'el-icon-folder-opened' },
        children: [
          {
            path: 'info',
            redirect: '/study/info/index',
            name: 'StudyInfoInit',
            component: study,
            meta: { activeMenu: '/study', title: '项目信息', roles: ['project_management'] },
            children: [
              {
                hidden: true,
                path: 'index',
                component: info,
                meta: { activeMenu: '/study/info', topTab: '/study' },
              },
              {
                hidden: true,
                path: 'peronnel',
                name: 'StudyPeronnel',
                component: studyPeronnel,
                meta: { activeMenu: '/study/info', title: '人员管理', topTab: '/study' },
              },
            ],
          },
          {
            path: 'criteria',
            redirect: '/study/criteria/index',
            name: 'StudyCriteriaInit',
            component: study,
            meta: { title: '入排标准', roles: ['project_inclusion_exclusion'] },
            children: [
              {
                hidden: true,
                path: 'index',
                component: criteria,
                meta: { activeMenu: '/study/criteria', topTab: '/study' },
              },
            ],
          },
          {
            path: 'subject',
            redirect: '/study/subject/index',
            name: 'StudySubjectInit',
            component: study,
            meta: { title: '受试者' },
            children: [
              {
                hidden: true,
                path: 'index',
                component: subject,
                meta: { activeMenu: '/study/subject', topTab: '/study' },
              },
              {
                hidden: true,
                path: 'criyeria',
                name: 'SubjectCriyeria',
                component: subjectCriyeria,
                meta: { activeMenu: '/study/subject', topTab: '/study', title: '筛选' },
              },
            ],
          },
          {
            path: 'sample',
            redirect: '/study/sample/index',
            name: 'StudySampleInit',
            component: study,
            meta: { title: '样本' },
            children: [
              {
                hidden: true,
                path: 'index',
                component: sample,
                meta: { activeMenu: '/study/sample', topTab: '/study' },
              },
            ],
          },
          {
            path: 'warehouse',
            redirect: '/study/warehouse/index',
            name: 'StudyWarehouseInit',
            component: study,
            meta: { title: '试剂出入库记录', roles: ['test_reagent_in_out_management'] },
            children: [
              {
                hidden: true,
                path: 'index',
                component: warehouse,
                meta: { activeMenu: '/study/warehouse', topTab: '/study' },
              },
              {
                hidden: true,
                path: 'detail',
                name: 'StudyWarehouseDetail',
                component: warehouseDetail,
                meta: { activeMenu: '/study/warehouse', title: '记录详情', topTab: '/study' },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default list;
