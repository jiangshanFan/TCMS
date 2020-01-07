<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <el-form ref="form" :model="form" label-width="80px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="简报类型">
              <el-select
                @change="bulletinBlur"
                size="mini"
                v-model="form.bull"
                placeholder="请选择简报类型"
              >
                <el-option
                  v-for="item in options.bulletin"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="日期">
              <el-date-picker
                @change="date1change"
                v-if="show === 1"
                size="mini"
                type="date"
                v-model="form.date1"
                style="width: 100%;"
              ></el-date-picker>
              <el-date-picker
                @change="date2change"
                v-else-if="show === 2"
                size="mini"
                v-model="form.date2"
                type="month"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-button type="primary" size="mini" @click="getpaper" v-if="$route.meta.button.buttons.includes('导出Excel')">导出Excel</el-button>
      <!-- 简报列表 -->
      <template>
        <el-table
          :data="tableData.content"
          stripe
          border
          size="small"
          style="width: 100%; margin-top:10px;"
          header-cell-class-name="header_cell table_header_shadow"
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="projectName" label="项目名称"></el-table-column>
          <el-table-column align="center" prop="subprojectName" label="子项目名称"></el-table-column>
          <el-table-column align="center" prop="assignmentName" label="任务名称"></el-table-column>
          <el-table-column align="center" prop="userName" label="任务负责人"></el-table-column>
          <el-table-column v-if="show === 2" align="center" prop="status" label="任务状态">
            <template slot-scope="scope">
              <span
                v-for="(item,index) in taskstatus"
                :key="index"
              >{{scope.row.status===item.id?item.label:""}}</span>
            </template>
          </el-table-column>
          <el-table-column v-else-if="show === 1" align="center" prop="totalTime" label="工时">
            <template slot-scope="scope">
              <span>{{scope.row.totalTime}}</span>
            </template>
          </el-table-column>
          <el-table-column v-if="show === 1" align="center" prop="content" label="日志"></el-table-column>
          <el-table-column v-else-if="show === 2" align="center" prop="totalTime" label="已用工时"></el-table-column>
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
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryPowerPointList,
  downloadQueryPowerPointList
} from "../../axios/api.js";
import breadcrumbList from "../../components/breadcrumbList";
export default {
  components: {
    breadcrumbList
  },
  mounted() {
    this.date1change();
  },
  methods: {
    // 简报导出
    getpaper() {
      if (this.show === 1) {
        downloadQueryPowerPointList({
          dateTime: this.form.date1
        });
      } else if (this.show === 2) {
        downloadQueryPowerPointList({
          dateMonth: this.form.date2
        });
      }
    },
    async date1change() {
      let res = await queryPowerPointList({
        size: this.size,
        page: this.page,
        dateTime: this.form.date1
      });
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    async date2change() {
      let res = await queryPowerPointList({
        size: this.size,
        page: this.page,
        dateMonth: this.form.date2
      });
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    // 简报类型失去焦点事件
    bulletinBlur() {
      this.tableData = [];
      console.log(this.form.bull);
      if (this.form.bull === 1) {
        this.show = 1;
        this.date1change();
      } else if (this.form.bull === 2) {
        this.show = 2;
        this.date2change();
      }
    },
    handleSizeChange(val) {
      this.size = val;
      if (this.show === 1) {
        this.date1change();
      } else if (this.show === 2) {
        this.date2change();
      }
    },
    handleCurrentChange(val) {
      this.page = val;
      if (this.show === 1) {
        this.date1change();
      } else if (this.show === 2) {
        this.date2change();
      }
    },
    // show default module
    showDefault(val) {
      if (val) {
        this.breadcrumb = this.breadcrumb.slice(0, 2);
      }
    }
  },
  data() {
    return {
      // 月报日报切换
      show: 1,
      page: 1,
      size: 10,
      // 简报页面数据
      form: {
        branch: "",
        bull: 1,
        date1: new Date(new Date() - 3600 * 1000 * 24),
        date2: new Date()
      },
      // 简报下拉栏数据
      options: {
        //   部门名称
        branch: [{ label: "技术中心", id: 1 }],
        //   简报类型
        bulletin: [{ label: "日报", id: 1 }, { label: "月报", id: 2 }]
      },
      // 状态
      taskstatus: [
        { label: "待启动", id: 1 },
        { label: "暂停", id: 2 },
        { label: "进行中", id: 3 },
        { label: "已完成", id: 4 },
        { label: "已关闭", id: 5 }
      ],
      //   简报列表数据
      tableData: [],
      // breadcrumb
      breadcrumb: [
        { id: "project", name: "项目管理", path: "/project" },
        {
          id: "projectBulletin",
          name: "简报",
          path: "/project/projectBulletin",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped></style>
