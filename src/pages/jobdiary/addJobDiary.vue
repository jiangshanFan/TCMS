<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <el-form :model="form" :rules="rules" ref="form" size="mini" label-width="100px">
        <el-form-item label="项目名称" prop="projectId">
          <el-select @change="change" v-model="form.projectId" placeholder="请选择项目名称">
            <el-option
              v-for="item in options.proname"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="子项目名称" prop="subprojectId">
          <el-select @change="childTaskName" v-model="form.subprojectId" placeholder="请选择子项目名称">
            <el-option
              v-for="item in options.childTask"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="任务名称" prop="assignmentId">
          <el-select v-model="form.assignmentId" placeholder="请选择任务名称">
            <el-option
              v-for="item in options.taskName"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-col :span="6">
          <el-form-item label="工时" prop="laborHour">
            <el-select v-model="form.laborHour" placeholder="请选择工时">
              <el-option
                v-for="item in options.jobHour"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :rules="form.workTime===''?[{ required: true, message: '请选择工作日期',trigger:['blur','change']},]:[{required: false}]" label="工作日期" prop="workTime">
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
      </el-form>

      <el-col style="text-align:center; margin:0 auto;">
        <el-button size="mini" type="primary" @click="submitForm('form')">提交</el-button>
        <el-button size="mini" @click="resetForm('form')">重置</el-button>
      </el-col>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryProjectIngByMember,
  getSubprojectList,
  getAssignmentList,
  saveLogRecord
} from "../../axios/api.js";
import breadcrumbList from "../../components/breadcrumbList";
export default {
  components: {
    breadcrumbList
  },
  async created() {
    let res = await queryProjectIngByMember();
    if (res.status === 1) {
      res.msg.forEach(item => {
        this.options.proname.push({ label: item.projectName, id: item.id });
      });
    }
  },
  mounted() {
    for (let i = 1; i <= 8; i++) {
      this.options.jobHour.push({ label: i, id: i });
    }
  },
  methods: {
    // 选择项目名称后触发子任务名称接口
    async change() {
      this.form.subprojectId = "";
      this.options.childTask = [];
      let res = await getSubprojectList({
        projectId: this.form.projectId
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
    // 选择子项目名称触发任务名称
    async childTaskName() {
      this.form.assignmentId = "";
      this.options.taskName = [];
      let res = await getAssignmentList({
        projectId: this.form.projectId,
        subprojectId: this.form.subprojectId
      });
      if (res.status === 1) {
        res.msg.forEach(item => {
          this.options.taskName.push({
            label: item.assignmentName,
            id: item.id
          });
        });
      }
    },
    // 提交事件
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveLogRecord({ ...this.form }).then(res => {
            if (res.status === 1) {
              this.$message({
                type: "success",
                message: "新增成功"
              });
              this.$router.push("../jobdiary/jobDiaryList");
            }
          });
        } else {
          console.log("error sub");
        }
      });
    },
    // 重置事件
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // show default module
    showDefault(val) {
      if (val) {
        this.breadcrumb = this.breadcrumb.slice(0, 2);
      }
    }
  },
  data() {
    let validate2 = (rule, value, callback) => {
      let today = new Date().getTime();
      let workTimer = new Date(value).getTime();
      if (workTimer > today) {
        this.$message({
          type: "warning",
          message: "不可超出当前时间"
        });
        this.form.workTime = "";
      }
    };
    return {
      form: {
        projectId: "",
        subprojectId: "",
        assignmentId: "",
        laborHour: "",
        workTime: "",
        content: ""
      },
      rules: {
        projectId: [
          { required: true, message: "请选择项目名称", trigger: "change" }
        ],
        subprojectId: [
          { required: true, message: "请选择子项目名称", trigger: "change" }
        ],
        assignmentId: [
          { required: true, message: "请选择任务名称", trigger: "change" }
        ],
        laborHour: [
          { required: true, message: "请选择工时", trigger: "change" }
        ]
        // workTime: [
        //   {
        //     required: true,
        //     validator: validate2,
        //     trigger: "blur"
        //   }
        // ]
      },
      options: {
        proname: [],
        childTask: [],
        taskName: [],
        jobHour: []
      },
      // breadcrumb
      breadcrumb: [
        { id: "jobDiary", name: "工作日志", path: "/jobdiary" },
        {
          id: "addJobDiary",
          name: "新增日志",
          path: "/jobdiary/addJobDiary",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
