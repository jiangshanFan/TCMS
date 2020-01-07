<template>
  <div class="p20">
    <h1 class="nameStyle">项目名称：{{info.projectName}}</h1>
    <el-button type="primary" size="mini" @click="getjobtime">导出Excel</el-button>
    <template>
      <el-table
        style="width: 100%; top:15px; margin:0 auto;"
        border
        header-cell-class-name="header_cell table_header_shadow"
        size="small"
        stripe
        :data="tableData.content"
      >
        <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
        <el-table-column align="center" prop="userName" label="项目成员名称"></el-table-column>
        <el-table-column align="center" prop="totalNum" label="任务总数量"></el-table-column>
        <el-table-column align="center" prop="totalTime" label="总工时"></el-table-column>
        <el-table-column align="center" prop="stayStartNum" label="待启动"></el-table-column>
        <el-table-column align="center" prop="underWayNum" label="进行中"></el-table-column>
        <el-table-column align="center" prop="postponeNum" label="延期"></el-table-column>
        <el-table-column align="center" prop="finishNum" label="已完成"></el-table-column>
        <el-table-column align="center" prop="pauseNum" label="已暂停"></el-table-column>
        <el-table-column align="center" prop="closeNum" label="已关闭"></el-table-column>
        <el-table-column align="center" prop="percentage" label="完成率"></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top:25px; float:right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20,50]"
        :page-size="size"
        layout="total, sizes, prev, pager, next"
        :total="tableData.totalCount"
      ></el-pagination>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryStatisticsAssignmentMemberCount,
  downloadStatisticsAssignmentMemberCount
} from "../axios/api.js";
export default {
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.$store.getters.jobTime));
    this.getList();
  },
  methods: {
    // 导出工时统计
    getjobtime() {
      downloadStatisticsAssignmentMemberCount({
        projectId: this.info.id
      });
    },
    //   获取项目成员工时列表
    async getList() {
      let res = await queryStatisticsAssignmentMemberCount({
        page: this.page,
        size: this.size,
        projectId: this.info.id
      });
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    }
  },
  data() {
    return {
      // 分页
      page: 1,
      size: 10,
      // 页面信息
      info: {},
      //   表格数据
      tableData: []
    };
  }
};
</script>

<style lang="scss" scoped>
.nameStyle {
  font-size: 21px;
  font-weight: bold;
}
</style>
