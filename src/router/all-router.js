/* eslint-disable */
/* 知识产权管理 */
const patent = () => import('../pages/knowledge/patent');
const patentStatics = () => import('../pages/knowledge/patentStatics');

const newSubmission = () => import('../pages/knowledge/newSubmission');
const Submission = () => import('../pages/knowledge/Submission');

const newPatent = () => import('../pages/knowledge/newPatent');
const patentFollow = () => import('../pages/knowledge/patentFollow');

const patentRenewManage = () => import('../pages/knowledge/patentRenewManage');

const patentEnd = () => import('../pages/knowledge/patentEnd');

/* 所有的路由 */
const allRoutes = [
  {
    path: '/patent',
    component: patent,
    name: 'patent',
    meta: {
      name: '知识产权管理',
      icon: 'icon-project_knowledge'
    },
    children: [
      {
        path: 'patentStatics',
        component: patentStatics,
        name: 'patentStatics',
        meta: {
          name: '知识产权统计'
        }
      },

      {
        path: 'newSubmission',
        component: newSubmission,
        name: 'newSubmission',
        meta: {
          name: '新增交底书'
        },
      },

      {
        path: 'Submission',
        component: Submission,
        name: 'Submission',
        meta: {
          name: '交底书列表'
        },
      },

      {
        path: 'newPatent',
        component: newPatent,
        name: 'newPatent',
        meta: {
          name: '新增专利'
        },
      },

      {
        path: 'patentFollow',
        component: patentFollow,
        name: 'patentFollow',
        meta: {
          name: '专利跟踪表'
        },
      },

      {
        path: 'patentRenewManage',
        component: patentRenewManage,
        name: 'patentRenewManage',
        meta: {
          name: '专利续费管理'
        },
      },

      {
        path: 'patentEnd',
        component: patentEnd,
        name: 'patentEnd',
        meta: {
          name: '已终止专利'
        },
      },
    ]
  },
];

export default  allRoutes;
