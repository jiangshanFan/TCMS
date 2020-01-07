<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <!-- 项目成员工时统计 -->
    <projectMangerJobTime v-if="show"></projectMangerJobTime>
    <div class="p20" v-else>
      <el-form size="mini" ref="form" :model="form" label-width="80px">
        <el-row :gutter="10">
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input v-model="form.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button size="mini" type="primary" @click="Search()">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
      <template>
        <el-table
          style="width: 99%; top:15px; margin:0 auto;"
          border
          header-cell-class-name="header_cell table_header_shadow"
          size="small"
          stripe
          :data="tableData.content"
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column show-overflow-tooltip align="center" prop="projectName" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="totalNum" label="任务总数量"></el-table-column>
          <el-table-column align="center" prop="stayStartNum" label="待启动"></el-table-column>
          <el-table-column align="center" prop="underWayNum" label="进行中"></el-table-column>
          <el-table-column align="center" prop="postponeNum" label="延期"></el-table-column>
          <el-table-column align="center" prop="finishNum" label="已完成"></el-table-column>
          <el-table-column align="center" prop="pauseNum" label="已暂停"></el-table-column>
          <el-table-column align="center" prop="closeNum" label="已关闭"></el-table-column>
          <el-table-column align="center" prop="percentage" label="完成率"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="toJobTime(scope.row)" v-if="$route.meta.button.buttons.includes('项目成员工时统计')">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
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
    </div>
  </div>
</template>

<script>
import { queryStatisticsAssignmentCount } from '../../axios/api.js'
import breadcrumbList from '../../components/breadcrumbList'
import projectMangerJobTime from '../../components/projectMangerJobTime'
/* eslint-disable */
export default {
  components: {
    projectMangerJobTime,
    breadcrumbList
  },
  mounted() {
    this.getList();
  },
  methods: {
    // 跳转至工时统计
    toJobTime(row) {
      this.$store.dispatch("jobTime", row);
      this.show = true;
      this.breadcrumb.push({ id: "sss", name: "项目成员工时统计" });
    },
    //   获取任务统计列表
    async getList() {
      let params = {
        page: this.page,
        size: this.size
      };
      if (this.form.projectName) {
        params.projectName = this.form.projectName;
      }
      let res = await queryStatisticsAssignmentCount(params);
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    // 搜索方法
    Search() {
      if (this.form.projectName === "") {
        this.$message({
          type: "warning",
          message: "请输入之后点击搜索"
        });
      } else {
        this.page = 1;
        this.getList();
      }
    },
    // 分页方法
    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    },
    // show default module
    showDefault(val) {
      if (val) {
        this.show = false;
        this.breadcrumb = this.breadcrumb.slice(0, 2);
      }
    }
  },
  data() {
    return {
      size: 10,
      page: 1,
      show: false,
      form: {
        projectName: ""
      },
      //表格数据
      tableData: [],
      // breadcrumb
      breadcrumb: [
        { id: "project", name: "项目管理", path: "/project" },
        {
          id: "taskCensus",
          name: "任务统计 ",
          path: "/project/taskCensus",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>