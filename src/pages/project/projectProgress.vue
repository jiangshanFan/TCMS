<template>
  <div class="projectProgress posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <!-- 新增任务页面及编辑任务页面 -->
    <addNewTask v-if="show===1" @ifChange="showDefault"></addNewTask>
    <editTask v-else-if="show===2" @ifChange="showDefault"></editTask>
    <div class="p20" v-else>
      <el-form size="mini" ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="项目名称" prop="projectName">
          <el-select
            :rules="[{ required: true, message: '请选择项目名称',trigger:'change'}]"
            @change="projectChange(form.projectName)"
            v-model="form.projectName"
            placeholder="请选择"
          >
            <el-option
              v-for="item in productName"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 新增子任务及新增任务 -->
      <el-button
        size="mini"
        type="primary"
        @click="dialogVisible=true"
        v-if="this.$route.meta.button.buttons.includes('新增子项目')"
      >新增子项目</el-button>
      <el-button
        size="mini"
        type="primary"
        @click="gotonewtask"
        v-if="this.$route.meta.button.buttons.includes('新增任务')"
      >新增任务</el-button>

      <Gantte
        style="margin-top:20px;"
        ref="ganttes"
        v-on:fun="showChange"
        :gantte_data="gantte_datas"
      ></Gantte>
      <!-- 新增子任务弹窗 -->
      <el-dialog title="新增子项目" :visible.sync="dialogVisible" width="30%">
        <el-form size="mini" ref="forms" :rules="rule" :model="form" label-width="100px">
          <el-form-item label="子项目名称" prop="cprojectName">
            <el-input v-model="form.cprojectName"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="subChildProject('forms')">确 定</el-button>
          <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  queryProjectProgressList,
  queryProjectByMember,
  saveSubproject
} from "../../axios/api.js";
import breadcrumbList from "../../components/breadcrumbList";
// 引入新增任务页面及编辑页面
import addNewTask from "../../components/addNewTask";
import editTask from "../../components/editTask";

// 引入gante图
import Gantte from "../../components/gantte";
export default {
  name: "projectProgress",
  components: {
    breadcrumbList: breadcrumbList,
    // 注册新增任务页面及编辑页面
    addNewTask: addNewTask,
    editTask: editTask,
    Gantte
  },
  created() {},
  async mounted() {
    let res = await queryProjectByMember();
    if (res.status === 1) {
      res.msg.forEach(item => {
        this.productName.push({ label: item.projectName, id: item.id });
      });
    }
    if (this.productName.length !== 0) {
      this.form.projectName = this.productName[0].id;
    }
    this.projectChange();
  },
  methods: {
    // funct(val) {
    //   console.log(val);
    //   v-on:childByValue="funct"
    // },
    showChange(params) {
      if (params.id === 2) {
        this.show = 2;
        this.$store.dispatch("editTaskData", params.msg);
        this.breadcrumb.push({ id: "er", name: "编辑任务" });
      }
    },
    // 新增子项目方法
    subChildProject(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let res = saveSubproject({
            projectId: this.form.projectName,
            subprojectName: this.form.cprojectName
          }).then(res => {
            if (res.status === 1) {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "新增成功"
              });
              this.form.cprojectName = "";
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 项目名称选择方法
    async projectChange(val) {
      // 获取任务进度列表
      let res = await queryProjectProgressList({
        projectId: this.form.projectName
      });
      if (res.status === 1) {
        this.gantte_datas = JSON.parse(JSON.stringify(res));
      }
    },
    // 跳转新增方法
    gotonewtask() {
      this.$store.dispatch("projectNameId", this.form.projectName);
      this.show = 1;
      this.breadcrumb.push({ id: "qw", name: "新增任务" });
    },

    // show default module
    showDefault(val) {
      if (val) {
        this.show = 0;
        this.breadcrumb = this.breadcrumb.slice(0, 2);
        this.projectChange();
      }
    }
  },

  data() {
    return {
      // 弹窗判断值
      dialogVisible: false,
      // 项目名称
      form: {
        // 项目名称
        projectName: "",
        // 新增子项目名称
        cprojectName: ""
      },
      show: 0,
      // breadcrumb
      breadcrumb: [
        { id: "project", name: "项目管理", path: "/project" },
        {
          id: "projectProgress",
          name: "项目进度管理",
          path: "/project/projectProgress",
          thing: "showDefault"
        }
      ],
      // 传递到 Gantte 图中的数据源参数
      gantte_datas: {},
      // 验证规则
      rules: {
        projectName: [
          {
            required: true,
            message: "请选择项目名称",
            trigger: "blur"
          }
        ]
      },
      // 新增弹窗验证规则
      rule: {
        cprojectName: [
          {
            required: true,
            message: "请填写子项目名称",
            trigger: "blur"
          }
        ]
      },
      // 项目名称下拉
      productName: []
    };
  }
};
</script>

<style scoped>
</style>

