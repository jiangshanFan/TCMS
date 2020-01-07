/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex);

const state = {   //要设置的全局访问的state对象     //要设置的初始属性值
  //login获取token
  token: '',
  accountName: '',
  userLoginVO: {},
  isLogin: false,

  /* 面包屑导航列表 */
  // crumbList: []  ****************************************** ERROR: convert converting circular structure to JSON; use JSON.stringify(this.$store.state)

  /* 知识产权管理 */
  // 交底书管理跳转新增或者编辑传参
  knowledge_submission: {},
  // 专利跟踪表跳转新增或者编辑传参
  knowledge_patentFollow: {},
  // 技术论文跳转新增或者编辑传参
  knowledge_techArticle: {},

  /* 权限管理 */
  // 角色管理跳转新增或者编辑传参
  auth_userRole: {},
  // 账户管理跳转新增或者编辑传参
  auth_userName: {},

  /* 项目管理 */
  // 项目列表跳转新增或编辑传参
  project_list: {},
  // 项目进度表跳转新增或编辑传参
  project_progress: {},
  // 项目考评表跳转新增或编辑传参
  project_evaluate: {},

  /* 经费预算 */
  // 项目经费预算管理跳转编辑
  costProject_edit: {},

  /* 材料管理 */
  // 详情
  materialList_edit: {},
  // 用户名称
  username: '',
  // 是否是管理层判断
  managerOr: '',
  // 部门编号
  dept: '',
  // 甘特图数据
  gantteData: '',
  // gan-top-time
  topTime: '',
  // gan-bottm-time
  bottomTime: '',
  // 编辑任务值
  editTaskData: '',
  // 项目成员工时统计
  jobTime: '',
  // 日志编辑跳转
  diaryJump: '',
  // 项目名称id
  projectNameId: "",
  // 项目名称
  pN: '',
  // 已关联专利id
  patentId: ''
};


const getters = {   //实时监听state值的变化(最新状态)
  //承载变化的 token 的值
  token: (state) => { return state.token },
  //承载变化的 userLoginVO 的值
  userLoginVO: (state) => { return state.userLoginVO },
  //承载变化的 accountName 的值
  accountName: (state) => { return state.accountName },
  //承载变化的 isLogin 的值
  isLogin(state) { return state.isLogin },

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission: (state) => { return state.knowledge_submission },
  // 专利跟踪表
  knowledge_patentFollow: (state) => { return state.knowledge_patentFollow },
  // 技术论文
  knowledge_techArticle: (state) => { return state.knowledge_techArticle },

  /* 权限管理 */
  // 角色管理
  auth_userRole: (state) => { return state.auth_userRole },
  // 账户管理
  auth_userName: (state) => { return state.auth_userName },

  /* 项目管理 */
  // 项目列表
  project_list: (state) => { return state.project_list },
  // 项目进度表
  project_progress: (state) => { return state.project_progress },
  // 项目考评表
  project_evaluate: (state) => { return state.project_evaluate },

  /* 经费预算 */
  // 单个项目经费管理
  costProject_edit: (state) => { return state.costProject_edit },

  /* 材料管理 */
  // 详情
  materialList_edit: (state) => { return state.materialList_edit },
  // 用户名称
  username: (state) => { return state.username },
  // 是否是管理层判断
  managerOr: (state) => { return state.managerOr },
  // 部门编号
  dept: (state) => { return state.dept },
  // 甘特图数据
  gantteData: (state) => { return state.gantteData },
  // gan-top-time
  topTime: (state) => { return state.topTime },
  // gan-bottm-time
  bottomTime: (state) => { return state.bottomTime },
  // 编辑任务值
  editTaskData: (state) => { return state.editTaskData },
  // 项目成员工时统计
  jobTime: (state) => { return state.jobTime },
  // 日志编辑跳转
  diaryJump: (state) => { return state.diaryJump },
  // 项目名称id
  projectNameId: (state) => { return state.projectNameId },
  // 项目名称
  pN: (state) => { return state.pN },
  // 已关联专利id
  patentId: (state) => { return state.patentId }
};


const mutations = {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
  //改变 token
  token(state, item) { state.token = item; },
  //改变 userLoginVO
  userLoginVO(state, item) { state.userLoginVO = item; },

  //改变 accountName
  accountName(state, item) { state.accountName = item; },
  //改变 isLogin
  isLogin(state, item) { state.isLogin = item; },

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission(state, item) { state.knowledge_submission = item },
  // 专利跟踪表
  knowledge_patentFollow(state, item) { state.knowledge_patentFollow = item },
  // 技术论文
  knowledge_techArticle(state, item) { state.knowledge_techArticle = item },

  /* 权限管理 */
  // 角色管理
  auth_userRole(state, item) { state.auth_userRole = item },
  // 账户管理
  auth_userName(state, item) { state.auth_userName = item },

  /* 项目管理 */
  // 项目列表
  project_list(state, item) { state.project_list = item },
  // 项目进度表
  project_progress(state, item) { state.project_progress = item },
  // 项目考评表
  project_evaluate(state, item) { state.project_evaluate = item },

  /* 经费预算 */
  // 单个项目经费预算管理
  costProject_edit(state, item) { state.costProject_edit = item },

  /* 材料管理 */
  // 详情
  materialList_edit(state, item) { state.materialList_edit = item },
  // 用户名称
  username(state, item) { state.username = item },
  // 是否是管理层判断
  managerOr: (state, item) => { state.managerOr = item },
  // 部门编号
  dept: (state, item) => { state.dept = item },
  // 甘特图数据
  gantteData: (state, item) => { state.gantteData = item },
  // gan-top-time
  topTime: (state, item) => { state.topTime = item },
  // gan-bottm-time
  bottomTime: (state, item) => { state.bottomTime = item },
  // 编辑任务值
  editTaskData: (state, item) => { state.editTaskData = item },
  // 项目成员工时统计
  jobTime: (state, item) => { state.jobTime = item },
  // 日志编辑跳转
  diaryJump: (state, item) => { state.diaryJump = item },
  // 项目名称id
  projectNameId: (state, item) => { state.projectNameId = item },
  // 项目名称
  pN: (state, item) => { state.pN = item },
  // 已关联专利id
  patentId: (state, item) => { state.patentId = item }
};


const actions = {//同上注释，item 为要变化的形参
  //异步触发改变 token
  token(context, item) { context.commit('token', item) },
  //异步触发改变 userLoginVO
  userLoginVO(context, item) { context.commit('userLoginVO', item) },

  //异步触发改变 accountName
  accountName(context, item) { context.commit('accountName', item) },
  //异步触发改变 allRoutes
  isLogin(context, item) { context.commit('isLogin', item) },

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission(context, item) { context.commit('knowledge_submission', item) },
  // 专利跟踪表
  knowledge_patentFollow(context, item) { context.commit('knowledge_patentFollow', item) },
  // 技术论文
  knowledge_techArticle(context, item) { context.commit('knowledge_techArticle', item) },

  /* 权限管理 */
  // 角色管理
  auth_userRole(context, item) { context.commit('auth_userRole', item) },
  // 账户管理
  auth_userName(context, item) { context.commit('auth_userName', item) },

  /* 项目管理 */
  // 项目列表
  project_list(context, item) { context.commit('project_list', item) },
  // 项目进度表
  project_progress(context, item) { context.commit('project_progress', item) },
  // 项目考评表
  project_evaluate(context, item) { context.commit('project_evaluate', item) },

  /* 经费预算 */
  // 单个项目经费预算管理
  costProject_edit(context, item) { context.commit('costProject_edit', item) },

  /* 材料管理 */
  // 详情
  materialList_edit(context, item) { context.commit('materialList_edit', item) },
  // 用户名称
  username(context, item) { context.commit('username', item) },
  // 是否是管理层判断
  managerOr: (context, item) => { context.commit('managerOr', item) },
  // 部门编号
  dept: (context, item) => { context.commit('dept', item) },
  // 甘特图数据
  gantteData: (context, item) => { context.commit('gantteData', item) },
  // gan-top-time
  topTime: (context, item) => { context.commit('topTime', item) },
  // gan-bottm-time
  bottomTime: (context, item) => { context.commit('bottomTime', item) },
  // 编辑任务值
  editTaskData: (context, item) => { context.commit('editTaskData', item) },
  // 项目成员工时统计
  jobTime: (context, item) => { context.commit('jobTime', item) },
  // 日志编辑跳转
  diaryJump: (context, item) => { context.commit('diaryJump', item) },
  // 项目名称id
  projectNameId: (context, item) => { context.commit('projectNameId', item) },
  // 项目名称
  pN: (context, item) => { context.commit('pN', item) },
  // 已关联专利id
  patentId: (context, item) => { context.commit('patentId', item) }
};


const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
export default store;
