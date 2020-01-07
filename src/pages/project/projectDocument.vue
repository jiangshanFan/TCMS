<template>
  <div class="projectDocument posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <div class="projectDocuments pl20 pr20">
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <el-col :span="12">
            <span class="c6">附件名称：</span>
            <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </el-col>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <el-container>
        <el-aside class="pr20" style="max-width:520px;width: auto;min-width:200px;">
          <el-tree
            ref="tree"
            node-key="id"
            accordion
            @node-click="handleNodeClick"
            :data="tree"
            :props="defaultProps"
            :auto-expand-parent="true"
            :highlight-current="highlight"
            :check-on-click-node="true"
            :default-expanded-keys="defaultKeys">
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span class="out fl" :class="{node_span : !data.status}" :title="node.label">{{ node.label }}</span>
              <span class="fl posr" v-if="(data.filePath.split('/').length === 1 && data.fileName !== '技术中心') || data.filePath.split('/').length > 1">
                <span class="add" @click.stop.prevent="() => append(node, data)" v-if="data.filePath.split('/').length === 1 && data.fileName !== '技术中心'"></span>
                <span v-else>
                  <span class="delete" @click.stop.prevent="() => remove(node, data)" v-if="!data.status"></span>
                  <span class="edit" @click.stop.prevent="() => change(node, data)" v-if="!data.status"></span>
                </span>
              </span>
            </span>
          </el-tree>
        </el-aside>

        <el-main>
          <div class="mt20" v-if="show">
            <!-- 添加 name="fileType" :http-request="uploadFiles"-->
            <div class="addFiles">
              <el-upload
                class="upload-demo"
                ref="upload"
                action="/api/projectFileManageInformation/projectFileManage/addUploadManyFile"
                :limit="maxLimit"
                :on-exceed="maxExceed"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :on-error="handleError"
                :on-change="handleChange"
                :data="uploadData"
                :headers="headers"
                :file-list="fileList"
                :multiple="true"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary" v-if="$route.meta.button.buttons.includes('添加附件')">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload" v-if="$route.meta.button.buttons.includes('添加附件')">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">说明：每次上传附件数量不超过6个，单个文件不超过120M</div>
              </el-upload>
              <!-- show error files -->
              <div class="fileStatus" v-if="fileStatus">
                <ul v-if="successFiles.length">上传成功的文件：<li class="ml20" v-for="(val, i) in successFiles" :key="i">{{val}}</li></ul>
                <ul v-if="errorFiles.length">上传失败的文件：<li class="ml20" v-for="(val, i) in errorFiles" :key="i">{{val}}</li></ul>
              </div>
            </div>

            <!-- 表格数据 -->
            <el-table
              :data="table.content"
              stripe
              border
              size="small"
              style="width: 100%;margin-top:10px;"
              header-cell-class-name="header_cell table_header_shadow"
              tooltip-effect="light">

              <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

              <!-- circle -->
              <el-table-column :fixed="h.fixed" v-for="h in header" :key="h.prop" :label="h.label" :width="h.width !== 'unset' ? h.label.length*50 : ''"  align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
                  <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
                  <span v-else-if="h.date === 1">{{scope.row[h.prop]? $format(new Date(scope.row[h.prop]).getTime()).dates : ''}}</span>
                  <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
                  <span v-else>{{scope.row[h.prop]}}</span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button @click="downloads(scope.row)" type="text" class="underline" align="center" v-if="$route.meta.button.buttons.includes('下载')">下载</el-button>
                  <el-button @click="deletes(scope.row)" type="text" class="underline" align="center" v-if="$route.meta.button.buttons.includes('删除')">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination fr ovw-h mt20">
              <el-pagination @current-change="handleCurrentChange"
                             @size-change="handleSizeChange"
                             :current-page="currentPage" :page-size="size"
                             :page-sizes="[5, 10, 15, 20,50]"
                             layout="total, sizes, prev, pager, next"
                             :total="table.totalCount" v-if="table.totalCount">
              </el-pagination>
            </div>
          </div>

          <div class="mt20" v-if="show1">
            <span>所有文件夹中附件名称为“{{search.value1}}”的文件如下所示：</span>
            <!-- 表格数据 -->
            <el-table
              :data="table1.content"
              v-loading="loading"
              stripe
              border
              size="small"
              style="width: 100%;margin-top:10px;"
              header-cell-class-name="header_cell table_header_shadow"
              tooltip-effect="light">

              <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

              <!-- circle -->
              <el-table-column :fixed="h.fixed" v-for="h in header1" :key="h.prop" :label="h.label" :width="h.width !== 'unset' ? h.label.length*50 : ''"  align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
                  <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
                  <span v-else-if="h.date === 1">{{scope.row[h.prop]? $format(new Date(scope.row[h.prop]).getTime()).dates : ''}}</span>
                  <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
                  <span v-else>{{scope.row[h.prop]}}</span>
                </template>
              </el-table-column>

              <el-table-column fixed="right" label="操作" width="100" align="center">
                <template slot-scope="scope">
                  <el-button @click="downloads(scope.row)" type="text" class="underline" align="center">下载</el-button>
                  <el-button @click="deletes(scope.row)" type="text" class="underline" align="center">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="pagination fr ovw-h mt20">
              <el-pagination @current-change="handleCurrentChange"
                             @size-change="handleSizeChange"
                             :current-page="currentPage" :page-size="size"
                             :page-sizes="[5, 10, 15, 20,50]"
                             layout="total, sizes, prev, pager, next"
                             :total="table.totalCount" v-if="table.totalCount">
              </el-pagination>
            </div>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import {
    getFileManageInformationProject,
    removeFileManageFolderProject,
    saveFileManageFolderProject,
    getFileEnclosureInformationListProject,
    removeFileEnclosureInformationProject,
    getFileEnclosureInformationProject,
    editeFileManageFolder,
    addUploadManyFileProject
  } from '../../axios/api.js'
  import breadcrumbList from '../../components/breadcrumbList'

  export default {
    name: "projectDocument",
    components: {
      'breadcrumbList': breadcrumbList,
    },
    async created() {
      this.getTreeList(0);
    },

    methods: {
      // get dataList of table
      async getTableList() {
        this.loading = true;
        let params = {
          page: this.currentPage,
          size: this.size,
          folderId: this.folderId,
        };

        let res = await getFileEnclosureInformationListProject(params);
        if(res.status === 1) {
          this.table = res.msg;
          this.loading = false;
        }
      },

      // get treeList
      async getTreeList(val = 1) {
        let res = await getFileManageInformationProject();
        if (res.status === 1) {
          this.tree = res.msg;
          if (val === 0) {
            if (this.tree[0]) {
              let defaultData = this.tree[0].fileManages[0].fileManages[0];

              this.defaultKeys = [1, this.tree[0].fileManages[0].id];

              setTimeout(() => {
                this.$refs.tree.setCurrentKey(defaultData.id);
              },500);

              this.handleNodeClick(defaultData);
            }
          }
        }
      },

      async handleNodeClick(data) {
        this.table = [];
        this.search.value1 = '';
        // console.log(data);
        this.highlight = true;
        if (data.filePath.split('/').length > 1) {
          this.show = true;
          this.show1 = false;
          this.currentPage = 1;
          this.folderId = data.id;
          this.uploadData.folderId = data.id;
          // this.uploadData.path = data.filePath;
          this.fileStatus = false;
          this.fileList = [];
          this.successFiles = [];
          this.errorFiles = [];
          this.getTableList();
        } else {
          this.show = false;
        }
      },

      // append file folder
      append(node, data) {
        this.$prompt('请输入文件夹名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /^.{1,30}$/,
          inputErrorMessage: '格式不正确,请输入1~30个字符！'
        }).then( async ({ value }) => {
          if (value) {
            let res = await saveFileManageFolderProject({id: data.id, fileName: value,});
            if (res.status === 1) {
              this.$message({type: 'success', message: '新增文件夹: ' + value + '成功！'});
              this.getTreeList();
              this.defaultKeys = [1, node.key];
              // console.log(this.defaultKeys)
            }
          } else {
            Message({showClose: true, type: 'warning', message: '文件夹名称不能为空！'})
          }
        }).catch(() => {
          this.$message({type: 'info', message: '取消输入'});
        });
      },

      // remove file folder
      remove(node, data) {
        this.$confirm(`此操作将删除"${node.label}"文件夹以及此文件夹下的所有文件, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await removeFileManageFolderProject({id: data.id});
          if(res.status === 1) {
            this.getTreeList();
            this.defaultKeys = [1];
            if (node.parent) {
              this.defaultKeys.push(node.parent.key)
            }
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      // change folder name
      change(node, data) {
        this.$prompt(`<p>当前文件夹名称为<br />"<span style="word-break: break-all;">${node.label}</span>"<br />,请在下方框中输入新的名称：`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          dangerouslyUseHTMLString: true,
          inputPattern: /^.{1,30}$/,
            // /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: '格式不正确,请输入1~30个字符！'
        }).then( async ({ value }) => {
          let res = await editeFileManageFolder({id: data.id, fileName: value,});
          if (res.status === 1) {
            this.$message({type: 'success', message: '修改文件夹名称为:“ ' + value + '”成功！'});
            this.getTreeList();
            this.defaultKeys = [1, node.key];
          }

        }).catch(() => {
          this.$message({type: 'info', message: '取消输入'});
        });
      },

      // // http-request
      // uploadFiles(file) {
      //   this.uploadFilesData.append('file', file.file);
      // },

      // add new files
      async submitUpload() {
        // this.uploadFilesData = new FormData();
        // console.log(e.dataTransfer.files);
        this.$refs.upload.submit();
        this.fileStatus = true;
        // 延迟一秒避免上传文件未进入数据库经由接口返回
        setTimeout(() => {
          this.getTableList();
        },1000)
        // this.uploadFilesData.append('path', 'projectDocument');
        // this.uploadFilesData.append('folderId', this.folderId);
        // let res = await addUploadManyFileProject(this.uploadFilesData);
        // if (res.status === 1) {
        //   console.log('success!')
        // }
        // if (this.fileList.length) {
        //   this.fileStatus = true;
        // }

      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handleSuccess(response, file, fileList) {
        console.log(response, file, fileList);
        if (file.status === 'success') {
          if (response.status === 1) {
            this.successFiles.push(file.name);
            let index = fileList.indexOf(file);
            if(index>-1){  // clear fileList after upload
              console.log(this.fileList);
              return fileList.splice(index,1)
            }
          } else {
            Message({showClose: true, type: 'warning', message: response.msg});
          }
        }
      },
      handleError(err, file, fileList) {
        console.log(err, file, fileList);
        this.errorFiles.push(file.name);
      },
      handleChange(file, fileList) {
        console.log(file, fileList);
        // this.fileList = fileList;
        // if (file.status === 'fail') {
        //   this.errorFiles.push(file.name);
        // } else if (file.status === 'success') {
        //   this.successFiles.push(file.name);
        // }
      },
      maxExceed(file, fileList) {
        console.log('超出最大限制数量');
        Message({showClose: true, type: 'warning', message: '一次上传最多6个文件，已达到最大上传数！'})
      },

      handleCurrentChange(val) {
        this.currentPage = val;
        if (this.show) {
          this.getTableList();
        } else {
          this.getTable1List();
        }
      },

      handleSizeChange(val) {
        this.size = val;
        if (this.show) {
          this.getTableList();
        } else {
          this.getTable1List();
        }
      },

      // download file
      downloads(row) {
        window.open(row.uploadFilePath);
      },

      deletes(row) {
        this.$confirm(`此操作将删除"${row.fileName}"文件, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await removeFileEnclosureInformationProject({id: row.id});
          if(res.status === 1) {
            this.getTableList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      async getTable1List() {
        if (this.search.value1) {
          this.show = false;
          this.show1 = true;
          let params = {
            page: this.currentPage,
            size: this.size,
            fileName: this.search.value1,
          };
          let res = await getFileEnclosureInformationProject(params);
          if (res.status === 1) {
            this.highlight = false;
            this.table1 = res.msg;
          }
        } else {
          Message({showClose: true, type: 'warning', message: '请先输入附件名称！'})
        }
      },

      // search
      async Search() {
        this.$refs.tree.setCurrentKey();
        this.currentPage =1;
        this.defaultKeys = [1];
        this.search.name = this.search.value1;
        this.getTable1List();
      },

      // show default module
      showDefault(val) {
        if (val) {
          this.show = false;
          this.breadcrumb = this.breadcrumb.slice(0,2);
          // this.getTreeList();
        }
      },
    },

    data() {
      return {
        loading: true,

        // search
        search: {
          value1: '',
        },

        //树形菜单
        tree: [],

        defaultProps: {
          children: 'fileManages',
          label: 'fileName'
        },
        defaultKeys: [1],
        // if highlight
        highlight: true,

        // click tree to get data.id
        folderId: '',

        // upload files
        fileList: [],
        uploadData: {path: 'projectDocument', folderId: '',},
        maxLimit: 6,
        successFiles: [],
        errorFiles: [],
        fileStatus: false,
        headers: {
          Authorization: sessionStorage.getItem('token'),
        },

        // select options
        options: {},

        // table
        table: {},
        table1: {},

        header: [
          { prop: 'fileName', label: '附件名称', width: 'unset'},
          { prop: 'createTime', label: '上传时间', date: 1},
          { prop: 'userName', label: '上传人',},
        ],

        header1: [
          { prop: 'fileName', label: '附件名称',},
          { prop: 'filePath', label: '附件位置', width: 'unset'},
          { prop: 'createTime', label: '上传时间', date: 1},
          { prop: 'userName', label: '上传人',},
        ],

        currentPage: 1,
        size: 10,

        // 是否显示table
        show: false,
        show1: false,

        // breadcrumb
        breadcrumb: [
          { id: 'project', name: '项目管理', path: '/project',},
          { id: 'projectDocument', name: '项目文档管理', path: '/project/projectDocument',},
        ],
        uploadFilesData:{}
      }
    },
  }
</script>

<style lang="scss" scoped>
  .projectDocuments {
    > .el-container {
      height: 100%;
      overflow: hidden;
      .el-aside {
        overflow: hidden;
        height: 100%;
        position: relative;
        &:after {
          content: '';
          height: 100%;
          border-right: 1px solid #ddd;
          top: 0;
          right: 0;
          position: absolute;
        }
      }
      .el-main {
        height: 100%;
        overflow: auto !important;
      }
    }
  }

  .custom-tree-node {
    display: block;
    overflow: hidden;
    line-height: 28px;
    .node_span {
      max-width: 450px;
      margin-right: 10px;
      display:block;
    }
    .add {
      position: relative;
      margin-left: 30px;
      line-height: 26px;
      display:block;
      cursor: pointer;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 3px;
        background: url(/static/images/knowledge_add.png) no-repeat;
        background-size: 20px 20px;
        width: 20px;
        height: 20px;
        display: block;
      }
    }
    span > .delete {
      position: relative;
      line-height: 26px;
      display:block;
      cursor: pointer;
      width: 16px;
      height: 16px;
      float: left;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 7px;
        background: url(/static/images/knowledge_delete.png) no-repeat;
        background-size: 12px 12px;
        width: 12px;
        height: 12px;
        display: block;
        cursor: pointer;
      }
    }
    span > .edit {
      position: relative;
      margin-left: 5px;
      line-height: 26px;
      display:block;
      width: 16px;
      height: 16px;
      float: left;
      &:after {
        content: '';
        position: absolute;
        right: 0;
        top: 7px;
        background: url(/static/images/knowledge_edit.png) no-repeat;
        background-size: 12px 12px;
        width: 12px;
        height: 12px;
        display: block;
        cursor: pointer;
      }
    }
  }

  .addFiles {
    max-height: 240px;
    overflow: auto;
  }
</style>
