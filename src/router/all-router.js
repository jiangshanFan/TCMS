/* eslint-disable */
/* 知识产权管理 */
const patent = () => import('../pages/knowledge/patent');
const patentStatics = () => import('../pages/knowledge/patentStatics');
const Submission = () => import('../pages/knowledge/Submission');


/* 所有的路由 */
const allRoutes = [
  {
    path: '/patent',
    component: patent,
    name: 'patent',
    meta: {
      name: '知识产权管理',
      icon: 'icon-project_knowleadge'
    },
    children: [
      {
        path: 'patentStatics',
        component: patentStatics,
        name: 'patentStatics',
        meta: {
          name: '专利统计'
        }
      },

      {
        path: 'Submission',
        component: Submission,
        name: 'Submission',
        meta: {
          name: '交底书管理'
        }
      },
    ]
  },
];

export default  allRoutes;
