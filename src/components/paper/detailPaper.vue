<template>
  <div class="pl20 pr20">
    <h1 style="font-size:20px;" :data="jdsInfo">交底书编码：{{jdsInfo.paperCode}}</h1>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="交底书基本信息" name="first">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">交底书名称：</span>
              <span>{{jdsInfo.paperName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">计划完成时间：</span>
              <span v-if="jdsInfo.planTime">{{$format(new Date(jdsInfo.planTime).getTime()).dates}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">实际完成时间：</span>
              <span v-if="jdsInfo.realTime">{{$format(new Date(jdsInfo.realTime).getTime()).dates}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">交底书负责人：</span>
              <span>{{jdsInfo.charge}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">代理方：</span>
              <span>{{jdsInfo.agent}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">代理受理时间：</span>
              <span v-if="jdsInfo.agentHandleTime">{{$format(new Date(jdsInfo.agentHandleTime).getTime()).dates}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">代理费：</span>
              <span>{{jdsInfo.agentCost/100}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">官费：</span>
              <span>{{jdsInfo.officialFee/100}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">交底书状态：</span>
              <span
                v-for="(item,index) in status"
                :key="index"
              >{{item.id===jdsInfo.status?item.label:''}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">技术支持：</span>
              <span>{{jdsInfo.techSupport}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">OA单号：</span>
              <span>{{jdsInfo.oaOddNum}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">OA单状态：</span>
              <span>{{jdsInfo.oaOddStatus}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="16">
            <div class="grid-content bg-purple" :data="jdsInfo">
              <span class="col_style">备注：</span>
              <span>{{jdsInfo.remark}}</span>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="交底书文档详情" name="second">
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
            style="width: 99%; top:15px; margin:0 auto;"
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
            <el-table-column prop="userName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建日期" align="center">
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.createTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="downloads(scope.row)"
                  size="mini"
                  type="primary"
                  align="center"
                >下载</el-button>
                <el-button @click="deletes(scope.row)" size="mini" type="primary" align="center">删除</el-button>
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
  name: "detalPaper",
  mounted() {
    // 交底书详情
    this.jdsInfo = Object.assign(
      { status: 1 },
      this.$store.getters.knowledge_submission
    );
    this.getFileListForJds();
    this.dataFile.id = this.jdsInfo.id;
  },
  methods: {
    async getFileListForJds() {
      let res = await getFileList({
        page: this.currentPage,
        size: this.size,
        type: 2,
        id: this.jdsInfo.id
      });
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.show) {
        this.getFileListForJds();
      } else {
        this.getFileListForJds();
      }
    },

    handleSizeChange(val) {
      this.size = val;
      if (this.show) {
        this.getFileListForJds();
      } else {
        this.getFileListForJds();
      }
    },
    //上传钩子
    handleRemove(file, fileList) {
      // console.log(file, fileList);
    },
    handleSuccess(response, file, fileList) {
      this.getFileListForJds();
      // this.$refs.upload_content.clearFiles()
      // console.log(response, file, fileList);
      let index = fileList.indexOf(file);
      if (index > -1) {
        // clear fileList after upload
        console.log(this.fileList);
        return fileList.splice(index, 1);
      }
    },
    handleError(err, file, fileList) {
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
      // Message({
      //   showClose: true,
      //   type: "warning",
      //   message: "一次上传最多6个文件，已达到最大上传数！"
      // });
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
            this.getFileListForJds();
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
      //文件上传数据
      dataFile: {
        path: "detalPaper",
        type: 2,
        id: ""
      },
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      fileList: [],
      //交底书数据
      jdsInfo: {},
      //分页数据
      currentPage: 1,
      size: 10,
      //   交底书状态
      status: [
        { id: 1, label: "项目启动" },
        { id: 2, label: "交底完成" },
        { id: 3, label: "已委托代理" },
        { id: 4, label: "委托终止" },
        { id: 5, label: "确认代理" },
        { id: 6, label: "缴费中" },
        { id: 7, label: "代理完成" }
      ],
      // tabs默认显示第一栏
      activeName: "first",
      //   表格数据
      tableData: {}
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
  width: 100px;
  text-align: right;
}
</style>