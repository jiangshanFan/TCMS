<template>
  <div class="p20">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" size="mini">
      <el-row :gutter="10">
        <el-col :span="12">
          <div class="div_style">
            <span class="col_style">项目名称：</span>
            <span>{{pName}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="div_style">
            <span class="col_style">子项目名称：</span>
            <span>{{info.subprojectName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="row_style">
        <el-col :span="12">
          <div class="div_style">
            <span class="col_style">任务名称：</span>
            <span>{{info.assignmentName}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="row_style">
        <el-col :span="12">
          <div class="div_style">
            <span class="col_style">计划开始日期：</span>
            <span>{{$format(new Date(info.planStartTime).getTime()).dates}}</span>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="div_style">
            <span class="col_style">计划完成日期：</span>
            <span>{{$format(new Date(info.planEndTime).getTime()).dates}}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="10" class="row_style">
        <el-col :span="12">
          <el-form-item label="实际开始日期" prop="actualStartTime">
            <el-date-picker
              @blur="dateChange(form.actualStartTime)"
              v-model="form.actualStartTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item
            :rules="form.status===4?[{ required: true, message: '请选择实际完成时间',trigger:['blur','change']},]:[{required: false}]"
            label="实际完成日期"
            prop="actualEndTime"
          >
            <el-date-picker
              @blur="faceEnd(form.actualEndTime)"
              v-model="form.actualEndTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="12">
          <el-form-item label="任务负责人" prop="principal">
            <span v-if="proPeople!==''">{{proPeople}}</span>
            <el-select v-else-if="selectShow" v-model="form.principal" placeholder="请选择">
              <el-option
                v-for="item in options.taskloader"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-button
              style="margin-left:20px;"
              type="primary"
              size="mini"
              @click="taskLoaderChange"
              v-if="isShow"
            >{{btnName}}</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务状态" prop="status">
            <el-select v-model="form.status" placeholder="请选择">
              <el-option
                v-for="item in options.taskstatus"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="附件地址" prop="filePath">
        <el-input
          resize="none"
          type="textarea"
          v-model="form.filePath"
          maxlength="50"
          :show-word-limit="true"
        ></el-input>
      </el-form-item>
      <el-form-item label="日志记录" prop="filePath">
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
            <el-table-column align="center" prop="workTime" label="工作日期">
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.workTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="laborHour" label="工时"></el-table-column>
            <el-table-column align="center" prop="userName" label="完成人"></el-table-column>
            <el-table-column align="center" prop="content" label="日志" show-overflow-tooltip></el-table-column>
          </el-table>
          <el-pagination
            style="margin-top:25px; float:right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pages"
            :page-sizes="[5, 10, 15, 20,50]"
            :page-size="sizes"
            layout="total, sizes, prev, pager, next"
            :total="tableData.totalCount"
          ></el-pagination>
        </template>
      </el-form-item>

      <el-form-item style="text-align:center; margin-top:25px;">
        <el-button type="primary" @click="submit('form')">提 交</el-button>
        <el-button @click="reset">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryProjectMemberAll,
  getLogRecordListByAssignmentId,
  renewalAssignment,
  queryProjectByMember
} from "../axios/api.js";
export default {
  mounted() {
    this.info = JSON.parse(JSON.stringify(this.$store.getters.editTaskData));
    // 项目负责人
    this.getTaskManager();
    // 日志列表
    this.getLogList();
    // 项目名称
    this.getProjectName();
    this.form.actualStartTime = this.info.actualStartTime;
    if (this.info.actualStartTime !== null) {
      this.form.actualEndTime = this.info.actualEndTime;
    }
    this.form.status = this.info.status;
    this.form.filePath = this.info.filePath;
    this.truetime = new Date(this.info.actualStartTime).getTime();
  },
  methods: {
    // 变更任务负责人方法
    taskLoaderChange() {
      this.btn1 = !this.btn1;
      if (!this.btn1) {
        this.btnName = "变更负责人";
        this.proPeople = this.info.userName;
        this.form.principal = this.info.principal;
        this.selectShow = false;
      } else if (this.btn1) {
        this.btnName = "取消变更";
        this.proPeople = "";
        this.form.principal = "";
        this.selectShow = true;
      }
    },
    // 分页
    handleSizeChange(val) {
      this.sizes = val;
      this.getLogList();
    },
    handleCurrentChange(val) {
      this.pages = val;
      this.getLogList();
    },
    // 获取项目名称
    async getProjectName() {
      let res = await queryProjectByMember();
      if (res.status === 1) {
        res.msg.forEach(item => {
          if (item.id === this.info.projectId) {
            this.pName = item.projectName;
          }
        });
      }
    },
    // 获取日志列表
    async getLogList() {
      let res = await getLogRecordListByAssignmentId({
        assignmentId: this.info.id,
        page: this.pages,
        size: this.sizes
      });
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    // 提交按钮事件
    submit(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await renewalAssignment({
            ...this.form,
            id: this.info.id,
            subprojectId: this.info.subprojectId,
            assignmentName: this.info.assignmentName,
            projectId: this.info.projectId
          });
          if (res.status === 1) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.$emit("ifChange", "2");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 重置按钮事件
    reset() {
      this.form.actualStartTime = this.info.actualStartTime;
      if (this.info.actualStartTime !== null) {
        this.form.actualEndTime = this.info.actualEndTime;
      }
      this.form.status = this.info.status;
      this.form.filePath = this.info.filePath;
      this.truetime = new Date(this.info.actualStartTime).getTime();
    },
    // 获取任务负责人
    async getTaskManager() {
      let res = await queryProjectMemberAll({
        projectId: this.info.projectId
      });
      if (res.status === 1) {
        if (res.msg.length !== 1) {
          res.msg.forEach(item => {
            this.options.taskloader.push({
              label: `${item.userName}/${item.empNo}`,
              id: item.empNo
            });
            this.proPeople = this.info.userName;
            this.form.principal = this.info.principal;
          });
          this.isShow = true;
        } else if (res.msg.length === 1) {
          this.proPeople = this.info.userName;
          this.form.principal = this.info.principal;
          this.isShow = false;
          if (res.msg[0].oneSelfGraded === 1) {
            res.msg.forEach(item => {
              this.options.taskloader.push({
                label: `${item.userName}/${item.empNo}`,
                id: item.empNo
              });
              this.proPeople = this.info.userName;
              this.form.principal = this.info.principal;
            });
            this.isShow = true;
          }
        }
      }
    },
    // 实际开始日期失去焦点
    dateChange(val) {
      this.truetime = new Date(val).getTime();
    },
    // 实际结束时间失去焦点
    faceEnd(val) {
      let today = new Date().getTime();
      let timer = new Date(val).getTime();
      if (timer > today) {
        this.$message({
          type: "warning",
          message: "不可超出当前时间"
        });
        this.form.actualEndTime = "";
      } else if (timer < this.truetime) {
        this.$message({
          type: "warning",
          message: "不可小于实际开始时间"
        });
        this.form.actualEndTime = "";
      }
    }
  },
  // :rules="form.status===4?[{ required: true, message: '请选择实际完成日期',trigger:['blur','change']},]:[{required: false}]"

  data() {
    // 实际结束日期
    // let validate4 = (rule, value, callback) => {
    //   let today = new Date().getTime();
    //   let timer = new Date(value).getTime();
    //   if (timer > today) {
    //     this.$message({
    //       type: "warning",
    //       message: "不可超出当前时间"
    //     });
    //     this.form.actualEndTime = "";
    //   } else if (timer < this.truetime) {
    //     this.$message({
    //       type: "warning",
    //       message: "不可小于实际开始时间"
    //     });
    //     this.form.actualEndTime = "";
    //   }
    // };
    return {
      form: {
        // 实际开始时间
        actualStartTime: "",
        // 实际结束时间
        actualEndTime: "",
        // 任务负责人
        principal: "",
        // 附件地址
        filePath: "",
        // 任务状态
        status: "",
        projectId: "",
        subprojectId: "",
        id: ""
      },
      // 编辑项目下拉
      options: {
        childTask: [],
        taskstatus: [
          { label: "待启动", id: 1 },
          { label: "暂停", id: 2 },
          { label: "进行中", id: 3 },
          { label: "已完成", id: 4 },
          { label: "已关闭", id: 5 }
        ],
        taskloader: []
      },
      // 编辑参数值
      info: {},
      // 日志数据
      tableData: {},
      // 项目名称
      proName: "",
      pName: "",
      rules: {
        actualStartTime: [
          { required: true, message: "请选择实际开始日期", trigger: "blur" }
        ]
        // actualEndTime: [
        //   {
        //     required: true,
        //     message: "请选择实际结束日期",
        //     trigger: "blur"
        //   }
        // ]
      },
      // 实际开始日期
      truetime: "",
      // 分页
      pages: 1,
      sizes: 10,
      // 项目负责人为1
      proPeople: "",
      // 判断变更负责人按钮是否出现
      isShow: false,
      // 变更负责人下拉框显隐
      selectShow: false,
      // 取反按钮文字及bool值
      btn1: false,
      btnName: "负责人变更"
    };
  }
};
</script>

<style lang="scss" scoped>
.row_style {
  margin-top: 8px;
}
.div_style {
  font-size: 14px;
}
.col_style {
  display: inline-block;
  width: 120px;
  text-align: right;
}
</style>
