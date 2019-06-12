/* eslint-disable */
/** api-doc*/
import $ajax from './request'
// import vm from '../main.js'

//--此处根据method方法改变：method === 'post'? data : params;
// console.log($ajax)

/**
 * @name login -------------- 登录
 * @author fjs
 * */
//登录
export const login = data => {return $ajax({url: '/api/login', method: 'post', data: data,})};
//登出
export const loginOut = data => {return $ajax({url: '/api/login/loginOut', method: 'post', data: data,})};


/**
 * @name authority -------------- 权限管理
 * @param {ObjectConstructor} data
 * @author fjs
 * */
//路由列表
export const auth = data => {return $ajax({url: '/static/auth.json', method: 'get', params: data,})};
//获取角色列表
export const getRoleList = data => {return $ajax({url: '/api/role/getRoleList', method: 'get', params: data,})};
//获取系统权限列表
export const getPermissionList = data => {return $ajax({url: '/api/role/getPermissionList', method: 'get', params: data,})};
//根据角色id获取权限列表
export const getPermissionListById = data => {return $ajax({url: '/api/role/getPermissionListById', method: 'get', params: data,})};
//删除角色
export const deleteRole = data => {return $ajax({url: '/api/role/deleteRole', method: 'post', data: data,})};
//添加角色
export const insertRole = data => {return $ajax({url: '/api/role/insertRole', method: 'post', data: data, meta: 1, })};
//角色更新
export const updateRole = data => {return $ajax({url: '/api/role/updateRole', method: 'post', data: data, meta: 1, })};


//获取账户列表
export const getUserList = data => {return $ajax({url: '/api/user/getUserList', method: 'get', params: data,})};
//删除账户
export const deleteUser = data => {return $ajax({url: '/api/user/deleteUser', method: 'post', data: data,})};
//密码重置
export const resetPwd = data => {return $ajax({url: '/api/user/resetPwd', method: 'post', data: data,})};
//密码修改
export const changePwd = data => {return $ajax({url: '/api/user/changePwd', method: 'post', data: data,})};
//添加账户
export const insertUser = data => {return $ajax({url: '/api/user/insertUser', method: 'post', data: data, meta: 1, })};
//账户更新
export const updateUser = data => {return $ajax({url: '/api/user/updateUser', method: 'post', data: data, meta: 1, })};


/**
 * @name knowledge -------------- 知识产权管理
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
//交底书管理--根据交底书名称获取交底书列表
export const getDisclosurePaperListByPaperName = data => {return $ajax({url: '/api/paper/getDisclosurePaperListByPaperName', method: 'get', params: data,})};


//专利相关--专利跟踪表
export const getPatentList = data => {return $ajax({url: '/api/patent/getPatentList', method: 'get', params: data,})};
//专利相关--专利申请号验证
export const checkPatentApplyNum = data => {return $ajax({url: '/api/patent/checkPatentApplyNum', method: 'get', params: data,})};
//专利相关--新增专利
export const insertPatent = data => {return $ajax({url: '/api/patent/insertPatent', method: 'post', data: data, meta: 1,})};
//专利相关--更新专利
export const updatePatent = data => {return $ajax({url: '/api/patent/updatePatent', method: 'post', data: data, meta: 1,})};
//专利相关--删除专利
export const deletePatent = data => {return $ajax({url: '/api/patent/deletePatent', method: 'post', data: data,})};


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
//知识产权文件存档--修改文件夹名称
export const replaceFileManageFolder = data => {return $ajax({url: '/api/fileManageInformation/fileManage/replaceFileManageFolder', method: 'post', data: data,})};


//知识产权统计--知识产权统计根据年份统计
export const queryDisclosurePatentStatisticsTotalByYear = data => {return $ajax({url: '/api/intellectualPropertyStatistics/propertyStatistics/queryDisclosurePatentStatisticsTotalByYear', method: 'get', params: data,})};
//知识产权统计--交底详情
export const queryProjectInformation = data => {return $ajax({url: '/api/intellectualPropertyStatistics/propertyStatistics/queryProjectInformation', method: 'get', params: data,})};
//知识产权统计--交底详情
export const queryDisclosurePaperDetailsByYear = data => {return $ajax({url: '/api/intellectualPropertyStatistics/propertyStatistics/queryDisclosurePaperDetailsByYear', method: 'get', params: data,})};
//知识产权统计--专利申报详情
export const queryPatentDetailsByYear = data => {return $ajax({url: '/api/intellectualPropertyStatistics/propertyStatistics/queryPatentDetailsByYear', method: 'get', params: data, })};
//知识产权统计--已授权专利申报详情
export const queryPatentDetailsByYearAndAuthorized = data => {return $ajax({url: '/api/intellectualPropertyStatistics/propertyStatistics/queryPatentDetailsByYearAndAuthorized', method: 'get', params: data,})};


/**
 * @name project -------------- 项目管理
 * @author fjs
 * */
//项目列表
export const getProjectProjectInformation = data => {return $ajax({url: '/api/createProject/project/getProjectProjectInformation', method: 'get', params: data,})};
//项目列表--删除
export const removeProjectInformation = data => {return $ajax({url: '/api/createProject/project/removeProjectInformation', method: 'get', params: data,})};
//项目列表--导出Excel
export const downloadProjectList = (data, arg) => {return $ajax({url: '/api/createProject/export/downloadProjectList', method: 'get', params: data, responseType: 'blob', args: arg,})};
//项目列表--新增
export const addProjectInformation = data => {return $ajax({url: '/api/createProject/project/addProjectInformation', method: 'post', data: data, meta: 1,})};
//项目列表--编辑
export const editProjectInformation = data => {return $ajax({url: '/api/createProject/project/editProjectInformation', method: 'post', data: data, meta: 1,})};


//获取所有项目名称
export const queryProjectProjectName = data => {return $ajax({url: '/api/createProject/project/queryProjectProjectName', method: 'get', params: data,})};
//获取负责人信息
export const getEmployeesInfoList = data => {return $ajax({url: '/api/projectMember/emp/getEmployeesInfoList', method: 'get', params: data,})};


//项目进度管理
export const getProjectProgressManagement = data => {return $ajax({url: '/api/projectProgressManagement/projectProgress/getProjectProgressManagement', method: 'get', params: data,})};
//项目进度管理--删除
export const removeProjectProgressManagement = data => {return $ajax({url: '/api/projectProgressManagement/projectProgress/removeProjectProgressManagement', method: 'post', data: data,})};
//项目进度管理--导出Excel
export const downloadProjectProgress = (data, arg) => {return $ajax({url: '/api/projectProgressManagement/export/downloadProjectProgress', method: 'get', params: data, responseType: 'blob', args: arg,})};
//项目进度管理--新增
export const saveProjectProgressManagement = data => {return $ajax({url: '/api/projectProgressManagement/projectProgress/saveProjectProgressManagement', method: 'post', data: data, meta: 1,})};
//项目进度管理--编辑
export const revampProjectProgressManagement = data => {return $ajax({url: '/api/projectProgressManagement/projectProgress/revampProjectProgressManagement', method: 'post', data: data, meta: 1,})};


//项目成员管理
export const getProjectMember = data => {return $ajax({url: '/api/projectMember/projectMemberInformation/getProjectMember', method: 'get', params: data,})};
//项目成员管理--删除
export const removeProjectMember = data => {return $ajax({url: '/api/projectMember/projectMemberInformation/removeProjectMember', method: 'post', data: data,})};
//项目成员管理--导出Excel
export const downloadProjectMember = (data, arg) => {return $ajax({url: '/api/projectMember/export/downloadProjectMember', method: 'get', params: data, responseType: 'blob', args: arg,})};
//项目成员管理--新增
export const saveProjectMember = data => {return $ajax({url: '/api/projectMember/projectMemberInformation/saveProjectMember', method: 'post', data: data, meta: 1,})};


//项目考评管理
export const getProjectMemberCheckScore = data => {return $ajax({url: '/api/projectMember/projectMemberInformation/getProjectMemberCheckScore', method: 'get', params: data,})};
//项目考评管理--编辑
export const revampProjectMember = data => {return $ajax({url: '/api/projectMember/projectMemberInformation/revampProjectMember', method: 'post', data: data, meta: 1,})};


//项目文档管理--树形菜单
export const getFileManageInformationProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/getFileManageInformation', method: 'get', params: data,})};
//项目文档管理--根据文件夹的id删除文件夹及文件夹下面的所有文件
export const removeFileManageFolderProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/removeFileManageFolder', method: 'get', params: data,})};
//项目文档管理--新增文件夹
export const saveFileManageFolderProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/saveFileManageFolder', method: 'post', data: data, })};
//项目文档管理--根据文件夹id获取该文件夹下面的文件
export const getFileEnclosureInformationListProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/getFileEnclosureInformationList', method: 'get', params: data,})};
//项目文档管理--搜索
export const getFileEnclosureInformationProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/getFileEnclosureInformation', method: 'get', params: data,})};
//项目文档管理--删除上传的文件
export const removeFileEnclosureInformationProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/removeFileEnclosureInformation', method: 'get', params: data,})};
//项目文档管理--添加附件  --------no use
export const addUploadManyFileProject = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/addUploadManyFile', method: 'post', data: data, meta: 1,})};
//项目文档管理--修改文件夹名称
export const editeFileManageFolder = data => {return $ajax({url: '/api/projectFileManageInformation/projectFileManage/editeFileManageFolder', method: 'post', data: data,})};
