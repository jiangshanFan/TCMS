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
};


const getters = {   //实时监听state值的变化(最新状态)
  //承载变化的 token 的值
  token: (state) => {return state.token},
  //承载变化的 userLoginVO 的值
  userLoginVO: (state) => {return state.userLoginVO},
  //承载变化的 accountName 的值
  accountName: (state) => {return state.accountName},
  //承载变化的 isLogin 的值
  isLogin(state) {return state.isLogin},

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission: (state) => {return state.knowledge_submission},
  // 专利跟踪表
  knowledge_patentFollow: (state) => {return state.knowledge_patentFollow},
  // 技术论文
  knowledge_techArticle: (state) => {return state.knowledge_techArticle},

  /* 权限管理 */
  // 角色管理
  auth_userRole: (state) => {return state.auth_userRole},
  // 账户管理
  auth_userName: (state) => {return state.auth_userName},

  /* 项目管理 */
  // 项目列表
  project_list: (state) => {return state.project_list},

};


const mutations = {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
  //改变 token
  token(state,item) {state.token = item;},
  //改变 userLoginVO
  userLoginVO(state,item) {state.userLoginVO = item;},

  //改变 accountName
  accountName(state,item) {state.accountName = item;},
  //改变 isLogin
  isLogin(state,item) {state.isLogin = item;},

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission(state, item) {state.knowledge_submission = item},
  // 专利跟踪表
  knowledge_patentFollow(state, item) {state.knowledge_patentFollow = item},
  // 技术论文
  knowledge_techArticle(state, item) {state.knowledge_techArticle = item},

  /* 权限管理 */
  // 角色管理
  auth_userRole(state, item) {state.auth_userRole = item},
  // 账户管理
  auth_userName(state, item) {state.auth_userName = item},

  /* 项目管理 */
  // 项目列表
  project_list(state, item) {state.project_list = item},

};


const actions = {//同上注释，item 为要变化的形参
  //异步触发改变 token
  token(context,item){context.commit('token',item)},
  //异步触发改变 userLoginVO
  userLoginVO(context,item){context.commit('userLoginVO',item)},

  //异步触发改变 accountName
  accountName(context,item){context.commit('accountName',item)},
  //异步触发改变 allRoutes
  isLogin(context,item){context.commit('isLogin',item)},

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission(context, item) {context.commit('knowledge_submission', item)},
  // 专利跟踪表
  knowledge_patentFollow(context, item) {context.commit('knowledge_patentFollow', item)},
  // 技术论文
  knowledge_techArticle(context, item) {context.commit('knowledge_techArticle', item)},

  /* 权限管理 */
  // 角色管理
  auth_userRole(context, item) {context.commit('auth_userRole', item)},
  // 账户管理
  auth_userName(context, item) {context.commit('auth_userName', item)},

  /* 项目管理 */
  // 项目列表
  project_list(context, item) {context.commit('project_list', item)},

};


const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
export default store;
