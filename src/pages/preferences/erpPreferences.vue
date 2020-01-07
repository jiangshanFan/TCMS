<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <el-button
        type="primary"
        size="mini"
        @click="dialogFormVisible = true"
        v-if="$route.meta.button.buttons.includes('新增')"
      >新&nbsp;&nbsp;&nbsp;增</el-button>
      <!-- erp接口列表 -->
      <template>
        <el-table
          :data="tableData"
          style="width: 100%; margin-top:20px;"
          stripe
          border
          size="small"
          header-cell-class-name="header_cell table_header_shadow"
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="departmentName" label="部门名称"></el-table-column>
          <el-table-column align="center" prop="purchasePersonnelNumber" label="ERP请购员ID"></el-table-column>
          <el-table-column align="center" prop="purchasePersonnelName" label="ERP请购员姓名"></el-table-column>
          <el-table-column align="center" prop="pleaseDepartmentNumber" label="ERP请购部门ID"></el-table-column>
          <el-table-column align="center" label="操作" width="200">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="editBra(scope.row)"
                v-if="$route.meta.button.buttons.includes('编辑')"
              >编辑</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="del(scope.row.id)"
                v-if="$route.meta.button.buttons.includes('删除')"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 点击新增弹窗 -->
      <el-dialog title="新增ERP" :visible.sync="dialogFormVisible">
        <el-form
          ref="dynamicValidateForm"
          :rules="rules"
          :model="form"
          size="mini"
          label-width="125px"
        >
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="部门名称" prop="pleaseDepartmentId">
                <el-select v-model="form.pleaseDepartmentId" placeholder="请选择">
                  <el-option
                    v-for="item in options.departmentName"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ERP请购员ID" prop="purchasePersonnelNumber">
                <el-input v-model="form.purchasePersonnelNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="ERP请购员姓名" prop="purchasePersonnelName">
                <el-input v-model="form.purchasePersonnelName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ERP请购部门ID" prop="pleaseDepartmentNumber">
                <el-input v-model="form.pleaseDepartmentNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="sub('dynamicValidateForm')">提 交</el-button>
          <el-button size="mini" @click="reset">重 置</el-button>
        </div>
      </el-dialog>
      <!-- 点击编辑弹窗 -->
      <el-dialog title="编辑ERP" :visible.sync="editDialogFormVisible">
        <el-form :model="editForm" size="mini" label-width="125px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="部门名称">
                <el-select v-model="editForm.pleaseDepartmentId" placeholder="请选择部门">
                  <el-option
                    v-for="item in options.departmentName"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ERP请购员ID">
                <el-input v-model="editForm.purchasePersonnelNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="ERP请购员姓名">
                <el-input v-model="editForm.purchasePersonnelName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="ERP请购部门ID">
                <el-input v-model="editForm.pleaseDepartmentNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="subEdit">提 交</el-button>
          <el-button size="mini" @click="editReset">重 置</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryErpDeptList,
  deleteErpDept,
  insertErpDept,
  updateErpDept,
  queryDepartmentList
} from "../../axios/api.js";
import breadcrumbList from "../../components/breadcrumbList";
export default {
  components: {
    breadcrumbList
  },
  created() {
    // 创建时调用获得接口列表
    this.getErpList();
    this.getBranchList();
  },
  mounted() {},
  methods: {
    // 编辑弹窗重置按钮
    editReset() {
      this.editForm = {};
    },
    // 编辑弹窗提交按钮
    async subEdit() {
      let res = await updateErpDept({ ...this.editForm });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.editDialogFormVisible = false;
        this.getErpList();
      }
    },
    // 编辑弹窗按钮
    editBra(row) {
      this.editDialogFormVisible = true;
      this.editForm.departmentName = row.departmentName;
      this.editForm.purchasePersonnelNumber = row.purchasePersonnelNumber;
      this.editForm.purchasePersonnelName = row.purchasePersonnelName;
      this.editForm.pleaseDepartmentNumber = row.pleaseDepartmentNumber;
      this.editForm.pleaseDepartmentName = row.pleaseDepartmentName;
      this.editForm.id = row.id;
    },
    // 新增弹窗重置按钮
    reset() {
      this.form = {};
    },
    // 新增弹窗提交按钮
    sub(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          await insertErpDept({ ...this.form }).then(res => {
            if (res.status === 1) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              this.getErpList();
              this.dialogFormVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 获取部门下拉数据
    async getBranchList() {
      this.options.departmentName = [];
      let res = await queryDepartmentList();
      if (res.status === 1) {
        this.options.departmentName = [];
        res.msg.forEach(item => {
          this.options.departmentName.push({
            label: item.pleaseDepartmentName,
            id: item.id
          });
        });
      }
    },
    // erp接口列表
    async getErpList() {
      let res = await queryErpDeptList();
      if (res.status === 1) {
        this.tableData = res.msg;
      }
    },
    //   编辑事件
    edit() {
      this.editDialogFormVisible = true;
    },
    // 删除事件
    del(id) {
      this.$confirm(`请确认是否删除部门！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteErpDept({
            id: id
          });
          if (res.status === 1) {
            this.$message({
              type: "success",
              message: "删除成功"
            });
            this.getErpList();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
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
      // 新增表单数据
      form: {
        pleaseDepartmentId: "",
        purchasePersonnelNumber: "",
        purchasePersonnelName: "",
        pleaseDepartmentNumber: ""
      },
      // 新增部门名称下拉数据
      options: {
        departmentName: []
      },
      // 编辑表单数据
      editForm: {
        pleaseDepartmentId: "",
        purchasePersonnelNumber: "",
        purchasePersonnelName: "",
        pleaseDepartmentNumber: "",
        id: ""
      },
      // 列表数据
      tableData: [],
      dialogFormVisible: false,
      editDialogFormVisible: false,
      // breadcrumb
      breadcrumb: [
        { id: "preferences", name: "参数管理", path: "/preferences" },
        {
          id: "erpPreferences",
          name: "ERP接口设置",
          path: "/jobdiary/erpPreferences",
          thing: "showDefault"
        }
      ],
      // 验证规则
      rules: {
        pleaseDepartmentId: [
          {
            required: true,
            message: "请选择部门名称",
            trigger: ["blur", "change"]
          }
        ],
        purchasePersonnelNumber: [
          {
            required: true,
            message: "请填写ERP请购员ID",
            trigger: "blur"
          }
        ],
        purchasePersonnelName: [
          {
            required: true,
            message: "请填写ERP请购员姓名",
            trigger: "blur"
          }
        ],
        pleaseDepartmentNumber: [
          {
            required: true,
            message: "请填写ERP请购部门ID",
            trigger: "blur"
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
