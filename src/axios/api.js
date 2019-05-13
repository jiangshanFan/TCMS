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
//根据查询条件获取用户列表
export const login = data => {return $ajax({url: '/api/login', method: 'post', data: data,})};
