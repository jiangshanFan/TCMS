<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <editJobDiary v-if="show===1" @ifChange="showDefault"></editJobDiary>
      <div v-else>
        <el-form ref="form" :model="form" label-width="100px" size="mini">
          <el-col :span="6">
            <el-form-item label="项目名称">
              <el-input v-model="form.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="子项目名称">
              <el-input v-model="form.subprojectName"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <el-button
          type="primary"
          size="mini"
          style="margin-left:20px;"
          @click="seach()"
        >搜&nbsp;&nbsp;&nbsp;索</el-button>
        <!-- 工作日志列表 -->
        <template>
          <el-table
            :data="tableData.content"
            style="width: 100%; margin-top:20px;"
            stripe
            border
            size="small"
            header-cell-class-name="header_cell table_header_shadow"
          >
            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="workTime" label="工作日期">
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.workTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="createTime" label="日志创建时间" show-overflow-tooltip>
              <template slot-scope="scope">
                <span
                  v-if="scope.row.createTime!==null"
                >{{$format(new Date(scope.row.createTime).getTime()).alls}}</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip align="center" prop="projectName" label="项目名称"></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="subprojectName"
              label="子项目名称"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="center"
              prop="assignmentName"
              label="任务名称"
            ></el-table-column>
            <el-table-column align="center" prop="laborHour" label="工时"></el-table-column>
            <el-table-column align="center" prop="content" label="日志"></el-table-column>
            <el-table-column align="center" label="操作" width="250">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="copy(scope.row)"
                  :disabled="scope.row.status!==3"
                  v-if="$route.meta.button.buttons.includes('复制')"
                >复制</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="edit(scope.row)"
                  :disabled="scope.row.status!==3"
                  v-if="$route.meta.button.buttons.includes('编辑')"
                >编辑</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="del(scope.row)"
                  v-if="$route.meta.button.buttons.includes('删除')"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 分页 -->
        <el-pagination
          style="float:right; margin-top:20px;"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[5, 10, 15, 20,50]"
          :page-size="size"
          layout="total, sizes, prev, pager, next"
          :total="tableData.totalCount"
        ></el-pagination>
      </div>

      <!-- 复制弹窗 -->
      <el-dialog title="修改日志" :visible.sync="dialogFormVisible">
        <el-form size="mini" :model="copyEdit" label-width="100px">
          <el-row>
            <el-form-item label="任务名称">
              <span>{{taskName}}</span>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="任务状态">
              <el-select size="mini" v-model="copyEdit.status">
                <el-option
                  v-for="item in options.status"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="工时">
                <el-select size="mini" v-model="copyEdit.laborHour">
                  <el-option
                    v-for="item in options.laborHour"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                label="日期"
                :rules="[{ required: true, message: '请选择日期',trigger:'change'}]"
              >
                <el-date-picker v-model="copyEdit.workTime" type="date"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="日志">
            <el-input v-model="copyEdit.content" type="textarea" resize="none"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="subEdit">提 交</el-button>
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getLogRecordList,
  copyLogRecord,
  removeLogRecord
} from "../../axios/api.js";
// 编辑页面
import editJobDiary from "../../components/editJobDiary";
// 引入面包屑
import breadcrumbList from "../../components/breadcrumbList";
export default {
  name: "jobDiaryList",
  components: {
    editJobDiary: editJobDiary,
    breadcrumbList: breadcrumbList
  },
  mounted() {
    this.getList();
    for (let i = 1; i <= 8; i++) {
      this.options.laborHour.push({ label: i, id: i });
    }
  },
  methods: {
    // 获取列表
    async getList() {
      let params = {
        size: this.size,
        page: this.page
      };
      if (this.form.projectName) {
        params.projectName = this.form.projectName;
      }
      if (this.form.subprojectName) {
        params.subprojectName = this.form.subprojectName;
      }
      let res = await getLogRecordList(params);
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    // 搜索
    async seach() {
      this.page = 1;
      this.getList();
    },
    //   编辑跳转
    edit(row) {
      this.$store.dispatch("diaryJump", row);
      this.show = 1;
      this.breadcrumb.push({ id: "df", name: "编辑日志" });
    },
    //   复制方法
    copy(row) {
      this.copyEdit.workTime = row.workTime;
      this.taskName = row.assignmentName;
      this.options.status.forEach(item => {
        if (item.id === row.status) {
          this.copyEdit.status = item.id;
        }
      });
      this.copyEdit.laborHour = row.laborHour;
      this.copyEdit.assignmentId = row.assignmentId;
      this.copyEdit.projectId = row.projectId;
      this.copyEdit.subprojectId = row.subprojectId;
      this.dialogFormVisible = true;
    },
    // 复制弹窗提交方法
    async subEdit() {
      let res = await copyLogRecord({
        ...this.copyEdit
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.dialogFormVisible = false;
        this.getList();
        this.copyEdit.content = "";
      }
    },
    //   删除方法
    async del(row) {
      let res = await removeLogRecord({
        id: row.id
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.getList();
      }
    },
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
        this.show = 0;
        this.breadcrumb = this.breadcrumb.slice(0, 2);
        this.getList();
      }
    }
  },
  data() {
    return {
      // 复制修改弹窗数据
      copyEdit: {
        status: "",
        laborHour: "",
        workTime: "",
        content: "",
        assignmentId: "",
        projectId: "",
        subprojectId: ""
      },
      // 弹窗下拉列表
      options: {
        status: [
          { label: "进行中", id: 3 },
          { label: "已完成", id: 4 },
          { label: "已关闭", id: 5 },
          { label: "已暂停", id: 7 }
        ],
        // 工时
        laborHour: []
      },
      // 弹窗任务名称
      taskName: "",
      page: 1,
      size: 10,
      form: {
        projectName: "",
        subprojectName: ""
      },
      //   列表数据
      tableData: {},
      //   点击编辑跳转参
      show: 0,
      dialogFormVisible: false,
      // breadcrumb
      breadcrumb: [
        { id: "jobDiary", name: "工作日志", path: "/jobdiary" },
        {
          id: "jobDiaryList",
          name: "日志列表",
          path: "/jobdiary/jobDiaryList",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
