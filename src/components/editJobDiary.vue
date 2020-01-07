<template>
  <div>
    <div style="font-size: 14px; margin-left:14px;">
      <span>项目名称：{{info.projectName}}</span>
    </div>
    <div class="sameStyle">
      <span>子项目名称：{{info.subprojectName}}</span>
    </div>
    <div class="sameStyle" style="margin-left:14px;">
      <span>任务名称：{{info.assignmentName}}</span>
    </div>
    <!-- 提交表单 -->
    <el-form ref="form1" style="margin-top:20px;" :model="form" label-width="80px" size="mini">
      <el-form-item label="任务状态" prop="status">
        <el-select size="mini" v-model="form.status">
          <el-option
            v-for="item in options.status"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-col :span="6">
        <el-form-item label="工时" prop="laborHour">
          <el-select v-model="form.laborHour" placeholder="请选择">
            <el-option
              v-for="item in options.laborHour"
              :key="item.value"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="日期" prop="workTime">
          <el-date-picker v-model="form.workTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="日志" prop="content">
          <el-input
            resize="none"
            maxlength="100"
            :show-word-limit="true"
            type="textarea"
            v-model="form.content"
          ></el-input>
        </el-form-item>
      </el-col>
      <el-col style="text-align:center; margin:0 auto;">
        <el-button size="mini" type="primary" @click="submitForm">提交</el-button>
        <el-button size="mini" @click="resetForm('form1')">重置</el-button>
      </el-col>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import { updateLogRecord } from "../axios/api.js";
export default {
  created() {
    this.info = JSON.parse(JSON.stringify(this.$store.getters.diaryJump));
    this.form.assignmentId = this.info.assignmentId;
    this.form.projectId = this.info.projectId;
    this.form.subprojectId = this.info.subprojectId;
    for (let i = 1; i <= 8; i++) {
      this.options.laborHour.push({
        label: i,
        id: i
      });
    }
    this.options.status.forEach(item => {
      if (this.info.status === item.id) {
        this.form.status = item.id;
      }
    });
    this.form.laborHour = this.info.laborHour;
    this.form.workTime = this.info.workTime;
    this.form.content = this.info.content;
  },
  methods: {
    //   提交事件
    async submitForm() {
      let res = await updateLogRecord({
        ...this.form,
        id: this.info.id
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.$emit("ifChange", "0");
      }
    },
    //   重置事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  data() {
    return {
      // 日志信息
      info: {},
      form: {
        status: 3,
        laborHour: "",
        workTime: "",
        content: "",
        assignmentId: "",
        projectId: "",
        subprojectId: ""
      },
      //   下拉选框数据
      options: {
        status: [
          { label: "进行中", id: 3 },
          { label: "已完成", id: 4 },
          { label: "已关闭", id: 5 },
          { label: "已暂停", id: 7 }
        ],
        laborHour: []
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.sameStyle {
  margin-top: 20px;
  font-size: 14px;
}
</style>
