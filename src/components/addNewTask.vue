<template>
  <div class="p20">
    <el-form ref="form" :rules="rules" :model="form" label-width="120px" size="mini">
      <el-row>
        <el-col :span="7">
          <el-form-item label="子项目名称" prop="subprojectId">
            <el-select v-model="form.subprojectId" placeholder="请选择">
              <el-option
                v-for="item in options.childTask"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="7">
          <el-form-item label="任务名称" prop="assignmentName">
            <el-input v-model="form.assignmentName" maxlength="16"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <el-form-item label="计划开始日期" prop="planStartTime">
            <el-date-picker
              @blur="dateChange(form.planStartTime)"
              v-model="form.planStartTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="计划完成日期" prop="planEndTime">
            <el-date-picker
              @blur="endTime(form.planEndTime)"
              v-model="form.planEndTime"
              type="date"
              placeholder="选择日期"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
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
        <el-col :span="8">
          <el-form-item label="任务负责人" prop="principal">
            <span v-if="proPeople!==''">{{proPeople}}</span>
            <el-select v-else v-model="form.principal" placeholder="请选择">
              <el-option
                v-for="item in options.taskloader"
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
      <el-form-item style="text-align:center;">
        <el-button type="primary" @click="subform('form')">提 交</el-button>
        <el-button @click="resetForm('form')">重 置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import {
  getSubprojectList,
  saveAssignment,
  queryProjectMemberAll
} from "../axios/api.js";
export default {
  mounted() {
    this.projectId = this.$store.getters.projectNameId;
    this.form.projectId = this.$store.getters.projectNameId;
    this.getChild();
    this.getTaskManager();
  },
  methods: {
    // 获取任务负责人
    async getTaskManager() {
      let res = await queryProjectMemberAll({
        projectId: this.projectId
      });
      if (res.status === 1) {
        if (res.msg.length !== 1) {
          res.msg.forEach(item => {
            this.options.taskloader.push({
              label: item.userName,
              id: item.empNo
            });
          });
        } else if (res.msg.length === 1) {
          this.proPeople = res.msg[0].userName;
          this.form.principal = res.msg[0].empNo;
        }
      }
    },
    // 获取子任务列表
    async getChild() {
      let res = await getSubprojectList({
        projectId: this.projectId
      });
      if (res.status === 1) {
        res.msg.forEach(item => {
          this.options.childTask.push({
            label: item.subprojectName,
            id: item.id
          });
        });
      }
    },
    // 提交事件
    subform(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `是否创建新的任务，任务创建成功之后将无法删除！`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(async () => {
              let res = await saveAssignment({ ...this.form });
              if (res.status === 1) {
                this.$message({
                  type: "success",
                  message: "创建成功"
                });
                this.$emit("ifChange", "2");
              }
            })
            .catch(() => {
              this.$message({ type: "info", message: "已取消提交" });
            });
        } else {
          console.log("error sub");
        }
      });
    },
    // 重置按钮
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 计划时间失去焦点事件
    dateChange(val) {
      this.planTime = new Date(val).getTime();
    },
    // 计划完成时间失去焦点
    endTime(val) {
      // 计划结束时间
      let pendTime = new Date(val).getTime();
      if (this.planTime > pendTime) {
        this.$message({
          type: "warning",
          message: "结束时间不得小于开始时间"
        });
        this.form.planEndTime = "";
      }
    }
  },
  data() {
    // let validate2 = (rule, value, callback) => {
    //   let Timer = new Date(value).getTime();
    //   if (this.planTime > Timer) {
    //     this.$message({
    //       type: "warning",
    //       message: "结束时间不得小于开始时间"
    //     });
    //     this.form.planEndTime = "";
    //   }
    // validator: validate2
    // };
    return {
      // 提交表单数据
      form: {
        // 子任务名称
        subprojectId: "",
        // 任务名称
        assignmentName: "",
        // 计划开始时间
        planStartTime: "",
        // 计划结束时间
        planEndTime: "",
        // 任务状态
        status: 3,
        // 任务负责人
        principal: "",
        // 附件地址
        filePath: "",
        // 项目id
        projectId: ""
      },
      // 项目id
      projectId: "",
      // 项目下拉
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
      //表单验证
      rules: {
        subprojectId: [
          {
            required: true,
            message: "请选择子任务名称",
            trigger: ["blur", "change"]
          }
        ],
        assignmentName: [
          { required: true, message: "请输入任务名称", trigger: "blur" }
        ],
        planStartTime: [
          { required: true, message: "请选择计划开始时间", trigger: "blur" }
        ],
        planEndTime: [
          { required: true, message: "请选择计划结束时间", trigger: "blur" }
        ],
        principal: [
          {
            required: true,
            message: "请选择任务负责人",
            trigger: ["blur", "change"]
          }
        ]
      },
      // 计划开始时间
      planTime: "",
      // 项目负责人为1
      proPeople: ""
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
