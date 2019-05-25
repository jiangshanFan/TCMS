/* eslint-disable */
/** api-doc*/
import $ajax from './request'
import vm from '../main.js'

//--此处根据method方法改变：method === 'post'? data : params;
// console.log($ajax)

/**
 * @name login -------------- 登录
 * @param {ObjectConstructor} data
 * @author fjs
 * */
//登录
export const login = data => {return $ajax({url: '/static/login.json', method: 'get', params: data,})};

//权限
export const auth = data => {return $ajax({url: '/static/auth.json', method: 'get', params: data,})};

/**
 * @name knowledge_disclosurePaper -------------- 知识产权管理
 * @param {ObjectConstructor} data
 * @author fjs
 * */
//交底书管理--列表
export const getDisclosurePaperList = data => {return $ajax({url: '/api/paper/getDisclosurePaperList', method: 'get', params: data,})};
//交底书管理--删除
export const deleteDisclosurePaper = data => {return $ajax({url: '/api/paper/deleteDisclosurePaper', method: 'post', data: data,})};
//交底书管理--新增
export const insertDisclosurePaper = data => {return $ajax({url: '/api/paper/insertDisclosurePaper', method: 'post', data: data, meta: 1,})};
//交底书管理--更新
export const updateDisclosurePaper = data => {return $ajax({url: '/api/paper/updateDisclosurePaper', method: 'post', data: data, meta: 1,})};


//专利相关--专利跟踪表
export const getPatentList = data => {return $ajax({url: '/api/patent/getPatentList', method: 'get', params: data,})};
//专利相关--新增专利
export const insertPatent = data => {return $ajax({url: '/api/patent/insertPatent', method: 'post', data: data, meta: 1,})};
//专利相关--更新专利
export const updatePatent = data => {return $ajax({url: '/api/patent/updatePatent', method: 'post', data: data, meta: 1,})};
//专利相关--删除专利
export const deletePatent = data => {return $ajax({url: '/api/patent/deletePatent', method: 'post', data: data, meta: 1,})};


//专利相关--专利续费管理
export const getPatentRenewManageList = data => {return $ajax({url: '/api/patent/getPatentRenewManageList', method: 'get', params: data,})};
//专利相关--下载续费管理
export const exportPatentRenewManageList = data => {return $ajax({url: '/api/patent/exportPatentRenewManageList', method: 'get', params: data,})};
//专利相关--续费管理详情
export const getRenewInfoList = data => {return $ajax({url: '/api/patent/getRenewInfoList', method: 'get', params: data,})};
//专利相关--填写续费信息
export const insertRenewInfo = data => {return $ajax({url: '/api/patent/insertRenewInfo', method: 'post', data: data, meta: 1,})};


//专利相关--终止专利
export const getEndPatentList = data => {return $ajax({url: '/api/patent/getEndPatentList', method: 'get', params: data,})};


//技术论文--技术论文列表
export const getDissertationInformation = data => {return $ajax({url: '/api/dissertationInformation/dissertation/getDissertationInformation', method: 'get', params: data,})};
//技术论文--技术论文删除
export const removeDissertationInformation = data => {return $ajax({url: '/api/dissertationInformation/dissertation/removeDissertationInformation', method: 'get', params: data,})};
//技术论文--技术论文编辑
export const editDissertationInformation = data => {return $ajax({url: '/api/dissertationInformation/dissertation/editDissertationInformation', method: 'post', data: data, meta: 1,})};
//技术论文--技术论文新增
export const addDissertationInformation = data => {return $ajax({url: '/api/dissertationInformation/dissertation/addDissertationInformation', method: 'post', data: data, meta: 1,})};

//知识产权文件存档--树形菜单
export const getFileManageInformation = data => {return $ajax({url: '/api/fileManageInformation/fileManage/getFileManageInformation', method: 'get', params: data,})};
//知识产权文件存档--根据文件夹的id删除文件夹及文件夹下面的所有文件
export const removeFileManageFolder = data => {return $ajax({url: '/api/fileManageInformation/fileManage/removeFileManageFolder', method: 'get', params: data,})};
//知识产权文件存档--新增文件夹
export const saveFileManageFolder = data => {return $ajax({url: '/api/fileManageInformation/fileManage/saveFileManageFolder', method: 'post', data: data, })};
//知识产权文件存档--根据文件夹id获取该文件夹下面的文件
export const getFileEnclosureInformationList = data => {return $ajax({url: '/api/fileManageInformation/fileManage/getFileEnclosureInformationList', method: 'get', params: data,})};
//知识产权文件存档--搜索
export const getFileEnclosureInformation = data => {return $ajax({url: '/api/fileManageInformation/fileManage/getFileEnclosureInformation', method: 'get', params: data,})};
//知识产权文件存档--删除上传的文件
export const removeFileEnclosureInformation = data => {return $ajax({url: '/api/fileManageInformation/fileManage/removeFileEnclosureInformation', method: 'get', params: data,})};
//知识产权文件存档--添加附件  --------no use
export const addUploadManyFile = data => {return $ajax({url: '/api/fileManageInformation/fileManage/addUploadManyFile', method: 'post', data: data, meta: 1,})};
