/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import modules from './modules'

Vue.use(Vuex);

const state = {   //要设置的全局访问的state对象     //要设置的初始属性值
  //login获取token
  token: '',
  username: '',
  isLogin: '',
  userLoginVO: {},

  /* 面包屑导航列表 */
  // crumbList: []  ****************************************** ERROR: convert converting circular structure to JSON; use JSON.stringify(this.$store.state)

  /*  知识产权管理 */
  // 交底书管理跳转新增或者编辑传参
  knowledge_submission: {},
  // 专利跟踪表跳转新增或者编辑传参
  knowledge_patentFollow: {},
  // 技术论文跳转新增或者编辑传参
  knowledge_techArticle: {},

};


const getters = {   //实时监听state值的变化(最新状态)
  //承载变化的 token 的值
  token: (state) => {return state.token},
  //承载变化的 userLoginVO 的值
  userLoginVO: (state) => {return state.userLoginVO},
  //承载变化的 username 的值
  username: (state) => {return state.username},
  //承载变化的 isLogin 的值
  isLogin(state) {return state.isLogin},

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission: (state) => {return state.knowledge_submission},
  // 专利跟踪表
  knowledge_patentFollow: (state) => {return state.knowledge_patentFollow},

  // 技术论文
  knowledge_techArticle: (state) => {return state.knowledge_techArticle},

};


const mutations = {//自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
  //改变 token
  token(state,item) {state.token = item;},
  //改变 userLoginVO
  userLoginVO(state,item) {state.userLoginVO = item;},

  //改变 username
  username(state,item) {state.username = item;},
  //改变 isLogin
  isLogin(state,item) {state.isLogin = item;},

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission(state, item) {state.knowledge_submission = item},
  // 专利跟踪表
  knowledge_patentFollow(state, item) {state.knowledge_patentFollow = item},

  // 技术论文
  knowledge_techArticle(state, item) {state.knowledge_techArticle = item},

};


const actions = {//同上注释，item 为要变化的形参
  //异步触发改变 token
  token(context,item){context.commit('token',item)},
  //异步触发改变 userLoginVO
  userLoginVO(context,item){context.commit('userLoginVO',item)},

  //异步触发改变 username
  username(context,item){context.commit('username',item)},
  //异步触发改变 isLogin
  isLogin(context,item){context.commit('isLogin',item)},

  /* 知识产权管理 */
  // 交底书管理
  knowledge_submission(context, item) {context.commit('knowledge_submission', item)},

  // 专利跟踪表
  knowledge_patentFollow(context, item) {context.commit('knowledge_patentFollow', item)},

  // 技术论文
  knowledge_techArticle(context, item) {context.commit('knowledge_techArticle', item)},

};


const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  modules
});
export default store;
