/* eslint-disable */
import Vue from 'vue'
import Router from 'vue-router'
import '../main'

import login from '../pages/login'
import index from '../pages/home/index'
import patent from '../pages/knowledge/patent'

import none from '../pages/none'

Vue.use(Router)

/* 初始路由 */
const router =  new Router({
  mode: 'hash',
  methods: {

  },
  routes: [
    {
      path: '/login',
      component: login,
    },
  ]
});

export default router;


/* 准备动态添加的路由 */
export const DynamicRoutes = [
  {
    path: '/',
    component: index,
    name: 'INDEX',
    redirect: 'patent',
    meta: {
      requiresAuth: true,
      name: '技术中心管理系统'
    },
    children: [

    ],
  },
  {
    path: '*',
    component: none,
  }
];
