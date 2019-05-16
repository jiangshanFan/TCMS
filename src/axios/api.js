/* eslint-disable */
/** api-doc*/
import $ajax from './request'
import vm from '../main.js'

//--此处根据method方法改变：method === 'post'? data : params;
// console.log($ajax)

/**
 * login-controller -------------- 用户管理
 * @param {ObjectConstructor} data
 * @fjs
 * */
//登录
export const login = data => {return $ajax({url: '/static/login.json', method: 'get', params: data,})};

//权限
export const auth = data => {return $ajax({url: '/static/auth.json', method: 'get', params: data,})};
