<template>
  <div class="pl20 pr20">
    <h1 style="font-size:20px;" :data="lwInfo">论文编号：{{lwInfo.dissertationCode}}</h1>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="论文基本信息" name="first">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">论文名称：</span>
              <span>{{lwInfo.dissertationName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">发表期刊：</span>
              <span>{{lwInfo.publishedPeriodical}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">撰稿人：</span>
              <span>{{lwInfo.writer}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">第一作者：</span>
              <span>{{lwInfo.firstAuthor}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">第二作者：</span>
              <span>{{lwInfo.secondAuthor}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">第三作者：</span>
              <span>{{lwInfo.thirdAuthor}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">其他作者：</span>
              <span>{{lwInfo.otherAuthor}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="16">
            <div class="grid-content bg-purple" :data="lwInfo">
              <span class="col_style">备注：</span>
              <span>{{lwInfo.remark}}</span>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="论文文档详情" name="second">
        <el-upload
          class="upload-demo"
          action="/api/fileManageInformation/fileManage/addUploadManyFileEach"
          :headers="headers"
          :data="dataFile"
          name="file"
          multiple
          ref="upload_content"
          :on-exceed="maxExceed"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :file-list="fileList"
        >
          <el-button type="primary" size="mini">上传附件</el-button>
        </el-upload>
        <template>
          <el-table
            :data="tableData.content"
            style="width: 100%; margin-top:15px;"
            border
            header-cell-class-name="header_cell table_header_shadow"
            size="small"
            stripe
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="fileName"
              label="附件名称"
              :show-overflow-tooltip="true"
              align="center"
            ></el-table-column>
            <el-table-column prop="fileSize" label="大小" align="center"></el-table-column>
            <el-table-column prop="userName" label="修改/创建人" align="center"></el-table-column>
            <el-table-column prop="updateTime" label="修改日期" align="center">
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.createTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="downloads(scope.row)"
                  type="primary"
                  size="mini"
                  align="center"
                >下载</el-button>
                <el-button @click="deletes(scope.row)" type="primary" size="mini" align="center">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          v-if="tableData.totalCount"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="currentPage"
          :page-sizes="[5, 10, 15, 20,50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next"
          :total="tableData.totalCount"
          style="margin-top:30px; float:right;"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/* eslint-disable */

import {
  getFileList,
  removeFileEnclosureInformation
} from "../../axios/api.js";
export default {
  name: "thesis",
  mounted() {
    let info = this.$store.getters.knowledge_techArticle;
    if (Object.keys(info).length) {
      this.lwInfo = Object.assign({}, info);
      this.choose = 1;
    } else {
      this.choose = 0;
    }
    this.getFileListForLw();
    this.dataFile.id = this.lwInfo.id;
  },
  methods: {
    async getFileListForLw() {
      let res = await getFileList({
        page: this.currentPage,
        size: this.size,
        type: 4,
        id: this.lwInfo.id
      });
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.show) {
        this.getFileListForLw();
      } else {
        this.getFileListForLw();
      }
    },

    handleSizeChange(val) {
      this.size = val;
      if (this.show) {
        this.getFileListForLw();
      } else {
        this.getFileListForLw();
      }
    },
    // 上传钩子
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handleSuccess(response, file, fileList) {
      this.getFileListForLw();
      // this.$refs.upload_content.clearFiles()
      // console.log(response, file, fileList);
      let index = fileList.indexOf(file);
      if (index > -1) {
        // clear fileList after upload
        console.log(this.fileList);
        return fileList.splice(index, 1);
      }
    },
    handleError(file, fileList) {
      // console.log(err, file, fileList);
    },
    handleChange(file, fileList) {
      // console.log(file, fileList);
      // this.fileList = fileList;
      // if (file.status === "fail") {
      //   this.errorFiles.push(file.name);
      // } else if (file.status === "success") {
      //   this.successFiles.push(file.name);
      // }
    },
    maxExceed(file, fileList) {
      // console.log("超出最大限制数量");
      this.$Message({
        showClose: true,
        type: "warning",
        message: "一次上传最多6个文件，已达到最大上传数！"
      });
    },
    // download file
    downloads(row) {
      window.open(row.uploadFilePath);
    },

    deletes(row) {
      this.$confirm(`此操作将删除"${row.fileName}"文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await removeFileEnclosureInformation({ id: row.id });
          if (res.status === 1) {
            this.getFileListForLw();
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功！"
            });
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    }
  },
  data() {
    return {
      // 分页数据
      currentPage: 1,
      size: 10,
      // 文件上传参数
      dataFile: {
        path: "thesis",
        type: 4,
        id: ""
      },
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      fileList: [],
      // tabs默认显示第一栏
      activeName: "first",
      // 论文详情数据
      lwInfo: {},
      // 表格数据
      tableData: {},
      choose: 0
    };
  }
};
</script>

<style lang="scss" scoped>
.row_style {
  margin-top: 15px;
}
.col_style {
  display: inline-block;
  width: 80px;
  text-align: right;
}
</style>
