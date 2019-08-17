/* eslint-disable */
/* 知识产权管理 */
import patent from '../pages/knowledge/patent';
const patentStatics = () => import('../pages/knowledge/patentStatics');

const newSubmission = () => import('../pages/knowledge/newSubmission');
const Submission = () => import('../pages/knowledge/Submission');

const newPatent = () => import('../pages/knowledge/newPatent');
const patentFollow = () => import('../pages/knowledge/patentFollow');

const patentRenewManage = () => import('../pages/knowledge/patentRenewManage');

const patentEnd = () => import('../pages/knowledge/patentEnd');

const newTechArticle = () => import('../pages/knowledge/newTechArticle');
const techArticle = () => import('../pages/knowledge/techArticle');

const knowledgeDocument = () => import('../pages/knowledge/knowledgeDocument');

/* 权限管理 */
import user from '../pages/user/user';
const userRole = () => import('../pages/user/userRole');
const userName = () => import('../pages/user/userName');
const newUserRole = () => import('../pages/user/newUserRole');
const newUserName = () => import('../pages/user/newUserName');


/* 项目管理 */
import project from '../pages/project/project';
const projectList = () => import('../pages/project/projectList');
const newProject = () => import('../pages/project/newProject');
const projectProgress = () => import('../pages/project/projectProgress');
const projectMembers = () => import('../pages/project/projectMembers');
const projectEvaluate = () => import('../pages/project/projectEvaluate');
const projectDocument = () => import('../pages/project/projectDocument');


/* 经费预算 */
import cost from '../pages/cost/cost';
const costList = () => import('../pages/cost/costList');
const costProject = () => import('../pages/cost/costProject');


/* 材料管理 */
import material from '../pages/material/material';
const materialList = () => import('../pages/material/materialList');


/* 所有的路由 */
const allRoutes = [
  {
    path: '/project',
    component: project,
    name: 'project',
    meta: {
      name: '项目管理',
      icon: 'icon-project_new'
    },
    children: [
      {
        path: 'projectList',
        component: projectList,
        name: 'projectList',
        meta: {
          name: '项目列表',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },
      {
        path: 'newProject',
        component: newProject,
        name: 'newProject',
        meta: {
          name: '新增项目',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },
      {
        path: 'projectProgress',
        component: projectProgress,
        name: 'projectProgress',
        meta: {
          name: '项目进度管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },
      {
        path: 'projectMembers',
        component: projectMembers,
        name: 'projectMembers',
        meta: {
          name: '项目成员管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },
      {
        path: 'projectEvaluate',
        component: projectEvaluate,
        name: 'projectEvaluate',
        meta: {
          name: '项目考评管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },
      {
        path: 'projectDocument',
        component: projectDocument,
        name: 'projectDocument',
        meta: {
          name: '项目文档管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },
    ]
  },

  {
    path: '/cost',
    component: cost,
    name: 'cost',
    meta: {
      name: '经费预算',
      icon: 'icon-project_fee'
    },
    children: [
      {
        path: 'costList',
        component: costList,
        name: 'costList',
        meta: {
          name: '经费预算统计',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },
      {
        path: 'costProject',
        component: costProject,
        name: 'costProject',
        meta: {
          name: '项目经费预算管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },
    ]
  },

  {
    path: '/material',
    component: material,
    name: 'material',
    meta: {
      name: '材料管理',
      icon: 'icon-project_equipment'
    },
    children: [
      {
        path: 'materialList',
        component: materialList,
        name: 'materialList',
        meta: {
          name: '材料统计',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },
    ]
  },

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
          name: '知识产权统计',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },

      {
        path: 'newSubmission',
        component: newSubmission,
        name: 'newSubmission',
        meta: {
          name: '新增交底书',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'Submission',
        component: Submission,
        name: 'Submission',
        meta: {
          name: '交底书列表',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'newPatent',
        component: newPatent,
        name: 'newPatent',
        meta: {
          name: '新增专利',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'patentFollow',
        component: patentFollow,
        name: 'patentFollow',
        meta: {
          name: '专利跟踪表',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'patentRenewManage',
        component: patentRenewManage,
        name: 'patentRenewManage',
        meta: {
          name: '专利续费管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'patentEnd',
        component: patentEnd,
        name: 'patentEnd',
        meta: {
          name: '已终止专利',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'newTechArticle',
        component: newTechArticle,
        name: 'newTechArticle',
        meta: {
          name: '新增技术论文',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'techArticle',
        component: techArticle,
        name: 'techArticle',
        meta: {
          name: '技术论文列表',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

      {
        path: 'knowledgeDocument',
        component: knowledgeDocument,
        name: 'knowledgeDocument',
        meta: {
          name: '知识产权文件存档',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },

    ]
  },

  {
    path: '/user',
    component: user,
    name: 'user',
    meta: {
      name: '权限管理',
      icon: 'icon-project_auth'
    },
    children: [
      {
        path: 'userRole',
        component: userRole,
        name: 'userRole',
        meta: {
          name: '角色管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
      },
      {
        path: 'newUserRole',
        component: newUserRole,
        name: 'newUserRole',
        meta: {
          name: '新增角色',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },
      {
        path: 'userName',
        component: userName,
        name: 'userName',
        meta: {
          name: '账户管理',
          button: {
            buttons: [],
            nextButton: [],
          }
        },
        button: {

        }
      },
      {
        path: 'newUserName',
        component: newUserName,
        name: 'newUserName',
        meta: {
          name: '新增账户',
          button: {
            buttons: [],
            nextButton: [],
          }
        }
      },

    ]
  },
];

export default  allRoutes;
