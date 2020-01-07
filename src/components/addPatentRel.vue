<template>
  <div>
    <!-- 添加页面表单 -->
    <el-form :rules="rules" ref="form" :model="form" label-width="80px" size="mini">
      <el-col :span="6">
        <el-form-item label="专利名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="受理时间" required>
          <el-date-picker
            v-model="form.date1"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-form>
    <el-button type="primary" size="mini" @click="seach()">搜索</el-button>
    <!--  列表 -->
    <template>
      <el-table
        :data="tableData.content"
        style="width: 100%; margin-top:20px;"
        stripe
        border
        size="small"
        header-cell-class-name="header_cell table_header_shadow"
      >
        <el-table-column align="center" label="选择" width="50">
          <template slot-scope="scope">
            <el-checkbox
              @change="checkChange(scope.row.id)"
              :disabled="scope.row.projectNames==null?false:true"
            ></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="patentName" label="专利名称"></el-table-column>
        <el-table-column align="center" prop="officialAcceptanceTime" label="受理时间">
          <template slot-scope="scope">
            <span>{{$format(new Date(scope.row.officialAcceptanceTime).getTime()).dates}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="type" label="专利类型">
          <template slot-scope="scope">
            <span
              v-for="(item,index) in type"
              :key="index"
            >{{item.id===scope.row.type?item.label:''}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="projectNames" label="关联项目名称"></el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <el-row>
      <el-pagination
        style="float:right; margin-top:20px;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="sizes"
        layout="total, sizes, prev, pager, next"
        :total="tableData.totalCount"
      ></el-pagination>
    </el-row>

    <div style="text-align:center; margin-top:20px;">
      <el-button size="mini" type="primary" @click="addNewPatent">添&nbsp;&nbsp;&nbsp;加</el-button>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryPatenRelatedProject,
  addProjectRelatedPaten
} from "../axios/api.js";

export default {
  mounted() {
    this.basicInfo = Object.assign({}, this.$store.getters.project_list);
    this.getList();
    this.patentId = this.$store.getters.patentId;
  },
  methods: {
    // 专利关联多选
    checkChange(row) {
      this.checkbox.push(row);
    },

    // 添加按钮事件
    async addNewPatent() {
      let res = await addProjectRelatedPaten({
        projectId: this.basicInfo.id,
        list: this.checkbox
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "添加成功"
        });
        // this.$router.go(0)
        // this.$router.push({ name: "projectRelevance" });
      }
    },
    // 搜索按钮
    async seach() {
      this.page = 1;
      this.getList();
    },
    // 获取专利关联列表
    async getList() {
      let params = {
        page: this.page,
        size: this.sizes
      };
      if (this.form.name) {
        params.patentName = this.form.name;
      }
      if (this.form.date1) {
        (params.officialAcceptanceStartTime = this.form.date1[0]),
          (params.officialAcceptanceEndTime = this.form.date1[1]);
      }
      let res = await queryPatenRelatedProject(params);
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    handleSizeChange(val) {
      this.sizes = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    }
  },
  data() {
    return {
      basicInfo: {},
      // 分页数据
      page: 1,
      sizes: 10,
      // 搜索栏表单元素
      form: {
        name: "",
        date1: ""
      },
      //  表格数据
      tableData: [],
      //  搜索表单验证
      rules: {
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },
      // 专利类型
      type: [
        { label: "实用", id: 1 },
        { label: "发明", id: 2 },
        { label: "外观", id: 3 },
        { label: "软件著作权", id: 4 }
      ],
      // 专利id数组
      checkbox: [],
      // 已关联专利id
      patentId: []
    };
  }
};
</script>

<style lang="scss" scoped>
</style>