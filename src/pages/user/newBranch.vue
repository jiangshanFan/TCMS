<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <el-button
        type="primary"
        size="mini"
        @click="dialogFormVisible = true"
        v-if="$route.meta.button.buttons.includes('新增')"
      >新 增</el-button>

      <!-- 部门列表 -->
      <template>
        <el-table
          :data="tableData"
          stripe
          border
          size="small"
          style="width: 100%; margin-top:20px;"
          header-cell-class-name="header_cell table_header_shadow"
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="pleaseDepartmentNumber" label="部门ID"></el-table-column>
          <el-table-column align="center" prop="pleaseDepartmentName" label="部门名称"></el-table-column>
          <el-table-column align="center" prop="createTime" label="创建时间">
            <template slot-scope="scope">
              <span>{{$format(new Date(scope.row.createTime).getTime()).dates}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="createUserName" label="创建人"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="editBranch(scope.row)"
                v-if="$route.meta.button.buttons.includes('编辑')"
              >编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 新增弹窗 -->
      <el-dialog title="新增部门" :visible.sync="dialogFormVisible">
        <el-form :model="form" :rules="rules" size="mini" ref="reference" label-width="100px">
          <el-col :span="10">
            <el-form-item label="部门名称" prop="branchName">
              <el-input
                maxlength="16"
                v-model="form.branchName"
                onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="addBranch('reference')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑弹窗 -->
      <el-dialog title="编辑部门" :visible.sync="editdialogFormVisible">
        <el-form :model="edform" :rules="ruless" size="mini" ref="references" label-width="100px">
          <el-col :span="10">
            <el-form-item label="部门名称" prop="pleaseDepartmentName">
              <el-input
                maxlength="16"
                onkeyup="this.value=this.value.replace(/^\s+|\s+$/g,'')"
                v-model="edform.pleaseDepartmentName"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="subEditBranch('references')">确 定</el-button>
          <el-button size="mini" @click="editdialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

import {
  insertDepartment,
  updateDepartment,
  queryDepartmentListManage
} from "../../axios/api.js";
import breadcrumbList from "../../components/breadcrumbList";
export default {
  components: {
    breadcrumbList
  },
  mounted() {
    this.getbranch();
  },
  methods: {
    // 新增部门确定方法
    addBranch(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await insertDepartment({
            pleaseDepartmentName: this.form.branchName.trim()
          });
          if (res.status === 1) {
            this.$message({
              type: "success",
              message: "新增成功"
            });
            this.dialogFormVisible = false;
            this.getbranch();
            this.form.branchName = "";
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑部门方法
    subEditBranch(formNa) {
      this.$refs[formNa].validate(async valid => {
        if (valid) {
          let res = await updateDepartment({ ...this.edform });
          if (res.status === 1) {
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.getbranch();
            this.editdialogFormVisible = false;
            this.edform = {};
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async editBranch(row) {
      this.edform.id = row.id;
      this.edform.pleaseDepartmentName = row.pleaseDepartmentName;
      this.editdialogFormVisible = true;
    },
    // 获取部门列表方法
    async getbranch() {
      let res = await queryDepartmentListManage();
      if (res.status === 1) {
        this.tableData = res.msg;
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
      // 新增部门弹窗显隐
      dialogFormVisible: false,
      editdialogFormVisible: false,
      // 新增部门弹窗
      form: {
        branchName: ""
      },
      edform: {
        pleaseDepartmentName: "",
        id: ""
      },
      tableData: [],
      // breadcrumb
      breadcrumb: [
        { id: "user", name: "权限管理", path: "/user" },
        {
          id: "newBranch",
          name: "部门管理",
          path: "/jobdiary/newBranch",
          thing: "showDefault"
        }
      ],
      rules: {
        branchName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ]
      },
      ruless: {
        pleaseDepartmentName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
