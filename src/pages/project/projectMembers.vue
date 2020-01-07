<template>
  <div class="projectMembers posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="projectMemberss pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span>项目名称：</span>
            <el-select
              @change="projectChange"
              v-model="search.value1"
              placeholder="请选择"
              size="mini"
              style="width:calc(100% - 100px);"
            >
              <el-option
                v-for="item in options.projectName"
                :key="item.id"
                :label="item.projectName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-row>
        <hr />
      </div>

      <!-- content -->
      <div class="mt20">
        <div class="buttons ovwh">
          <el-button
            type="primary"
            size="mini"
            @click="addProManber"
            v-if="$route.meta.button.buttons.includes('新增项目成员')"
          >新增项目成员</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="addProBer"
            v-if="$route.meta.button.buttons.includes('项目负责人变更')"
          >项目负责人变更</el-button>
        </div>

        <!-- 表格数据 -->
        <template>
          <el-table
            :data="tableBase.content"
            style="width: 100%; margin-top:20px;"
            stripe
            border
            size="small"
            header-cell-class-name="header_cell table_header_shadow"
          >
            <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
            <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
            <el-table-column align="center" prop="empNo" label="工号"></el-table-column>
            <el-table-column align="center" prop="oneSelfGraded" label="项目角色">
              <template slot-scope="scope">
                <span
                  v-for="(item,index) in options.projectManager"
                  :key="index"
                >{{item.id===scope.row.oneSelfGraded?item.label:""}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="deptName" label="部门"></el-table-column>
            <el-table-column align="center" prop="mobile" label="联系电话"></el-table-column>
            <el-table-column align="center" prop="mail" show-overflow-tooltip label="邮箱"></el-table-column>
            <el-table-column align="center" label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="deletes(scope.row)"
                  v-if="scope.row.oneSelfGraded!==1"
                >删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页 -->
          <el-pagination
            style="margin-top:20px; float:right;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="currentPage"
            :page-size="size"
            :page-sizes="[5, 10, 15, 20,50]"
            layout="total, sizes, prev, pager, next"
            :total="tableBase.totalCount"
          ></el-pagination>
        </template>

        <!-- 新增项目成员 -->
        <el-dialog title="新增项目成员" :visible.sync="dialogVisible" width="50%">
          <el-form size="mini" ref="ruleform" :model="form" :rules="ruless" label-width="100px">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item label="真实姓名" prop="truename">
                  <el-select
                    v-model="form.truename"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入真实姓名"
                    :remote-method="workNoBlur"
                    :loading="loading"
                    @change="nameChange(form.truename)"
                  >
                    <el-option
                      v-for="item in listDown"
                      :key="item.workNo"
                      :label="item.userName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row :gutter="20" class="row_style">
            <el-col :span="12">
              <div>
                <span class="col_style">工号</span>
                <span style="margin-left:10px;">{{peopleInfo.workNo}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="col_style">部门</span>
                <span style="margin-left:10px;">{{peopleInfo.deptName}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="row_style">
            <el-col :span="12">
              <div>
                <span class="col_style">手机号</span>
                <span style="margin-left:10px;">{{peopleInfo.mobile}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="col_style">邮箱</span>
                <span style="margin-left:10px;">{{peopleInfo.mail}}</span>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="subManager('ruleform')">确 定</el-button>
          </span>
        </el-dialog>
        <!-- 项目负责人变更 -->
        <el-dialog title="项目负责人变更" :visible.sync="prodialogVisible" width="50%">
          <el-form size="mini" ref="ruled" :model="proform" :rules="rulesss" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="11">
                <el-form-item label="项目负责人" prop="newproname">
                  <el-select
                    v-model="proform.newproname"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入新项目负责人"
                    :remote-method="nameBlur"
                    :loading="loading"
                    @change="proChange(proform.newproname)"
                  >
                    <el-option
                      v-for="item in proList"
                      :key="item.workNo"
                      :label="item.userName"
                      :value="item"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-row :gutter="20" class="row_style">
            <el-col :span="12">
              <div>
                <span class="col_style">工号</span>
                <span style="margin-left:10px;">{{proInfo.workNo}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="col_style">部门</span>
                <span style="margin-left:10px;">{{proInfo.deptName}}</span>
              </div>
            </el-col>
          </el-row>
          <el-row :gutter="20" class="row_style">
            <el-col :span="12">
              <div>
                <span class="col_style">手机号</span>
                <span style="margin-left:10px;">{{proInfo.mobile}}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div>
                <span class="col_style">邮箱</span>
                <span style="margin-left:10px;">{{proInfo.mail}}</span>
              </div>
            </el-col>
          </el-row>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" type="primary" @click="subProManager('ruled')">确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  getProjectMember,
  removeProjectMember,
  revampProjectMember,
  downloadProjectMember,
  queryProjectProjectName,
  getEmployeesInfoList,
  saveProjectMember,
  changePersonProject
} from "../../axios/api.js";
import column from "../../components/tableColumn";
import breadcrumbList from "../../components/breadcrumbList";
import ProjectAddOrEdit from "../../components/ProjectAddOrEdit";
export default {
  name: "projectMembers",
  components: {
    breadcrumbList: breadcrumbList,
    AddOrEdit: ProjectAddOrEdit,
    column: column
  },
  async created() {
    let res = await queryProjectProjectName();
    if (res.status === 1 && res.msg.length !== 0) {
      this.options.projectName = [...res.msg];
      this.search.value1 = this.options.projectName[0].id;
      this.getList();
    }
  },
  mounted() {
    this.form.projectManager = this.options.projectManager[1].id;
  },
  methods: {
    // 项目成员新增
    addProManber() {
      this.dialogVisible = true;
      this.form.proId = 2;
    },
    // 项目负责人新增
    addProBer() {
      this.prodialogVisible = true;
      this.proform.peoId = 1;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
    },

    handleSizeChange(val) {
      this.size = val;
    },

    // 获取部门成员列表
    async getList() {
      let res = await getProjectMember({
        page: this.currentPage,
        size: this.size,
        projectId: this.search.value1
      });
      if (res.status === 1) {
        this.tableBase = res.msg;
        res.msg.content.forEach(item => {
          if (item.oneSelfGraded === 1) {
            this.projectPeo = item.userName;
          }
        });
      }
    },

    // 分页
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },

    // 项目名称改变方法
    projectChange() {
      this.tableBase = {};
      this.getList();
    },
    // 项目负责人新增
    subProManager(formName) {
      this.$confirm(
        `是否将原项目负责人"${this.projectPeo}"替换为"${this.proInfo.userName}", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        this.$refs[formName].validate(async valid => {
          if (valid) {
            let res = await changePersonProject({
              empNo: this.proInfo.workNo,
              projectId: this.search.value1,
              oneSelfGraded: this.proform.peoId
            });
            if (res.status === 1) {
              this.$message({
                type: "success",
                message: "提交成功"
              });
              this.prodialogVisible = false;
              this.getList();
              this.proform = {};
              this.proInfo = {};
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      });
    },
    // 新增项目成员
    subManager(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let res = await saveProjectMember({
            empNo: this.peopleInfo.workNo,
            projectId: this.search.value1,
            oneSelfGraded: this.form.proId
          });
          if (res.status === 1) {
            this.$message({
              type: "success",
              message: "提交成功"
            });
            this.dialogVisible = false;
            this.getList();
            this.form = {};
            this.peopleInfo = {};
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    // 删除方法
    deletes(row) {
      if (this.$route.meta.button.buttons.includes("删除")) {
        this.$confirm(`此操作将删除"${row.userName}", 是否继续?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(async () => {
            let res = await removeProjectMember({ id: row.id });
            if (res.status === 1) {
              this.getList();
              Message({
                showClose: true,
                type: "success",
                message: "删除成功！"
              });
            }
          })
          .catch(() => {
            this.$message({ type: "info", message: "已取消删除" });
          });
      }
    },

    edits(row) {
      this.$store.dispatch("project_progress", row);
      this.show = !this.show;
      this.breadcrumb.push({ id: "edit", name: "编辑" });
    },

    // 输入工号查询下拉列表
    async workNoBlur(query) {
      if (query !== "") {
        this.loading = true;
        let res = await getEmployeesInfoList({
          name: query
        });
        if (res.status === 1) {
          this.listDown = res.msg;
          this.loading = false;
        }
      } else {
        this.listDown = [];
      }
    },
    // x项目负责人
    async nameBlur(query) {
      if (query !== "") {
        this.loading = true;
        let res = await getEmployeesInfoList({
          name: query
        });
        if (res.status === 1) {
          this.proList = res.msg;
          this.loading = false;
        }
      } else {
        this.proList = [];
      }
    },
    proChange(val) {
      this.proInfo = val;
    },
    nameChange(val) {
      this.peopleInfo = val;
    },
    // show default module
    showDefault(val) {
      if (val) {
        this.show = false;
        this.breadcrumb = this.breadcrumb.slice(0, 2);
        this.getList();
      }
    }
  },

  data() {
    return {
      // 表格数据
      tableBase: {},
      // table
      table: {},
      currentPage: 1,
      size: 10,
      // 成员信息
      peopleInfo: {},
      form: {
        truename: "",
        projectManager: "",
        proId: ""
      },
      // 项目负责人
      proInfo: {},
      proform: {
        newproname: "",
        peoId: ""
      },
      loading: false, //下拉列表请求后提示加载中
      listDown: [],
      proList: [],
      // search
      search: {
        value1: ""
      },
      options: {
        projectName: [],
        projectManager: [
          { label: "项目负责人", id: 1 },
          { label: "普通成员", id: 2 }
        ]
      },

      show: false,

      // breadcrumb
      breadcrumb: [
        { id: "project", name: "项目管理", path: "/project" },
        {
          id: "projectMembers",
          name: "项目成员管理",
          path: "/project/projectMembers",
          thing: "showDefault"
        }
      ],
      // 验证规则
      ruless: {
        truename: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ]
      },
      rulesss: {
        newproname: [
          { required: true, message: "请选择项目负责人", trigger: "blur" }
        ]
      },
      dialogVisible: false,
      prodialogVisible: false,
      // 项目负责人
      projectPeo: ""
    };
  }
};
</script>

<style lang="scss" scoped>
.row_style {
  margin-top: 15px;
}
.col_style {
  margin-left: 28px;
  display: inline-block;
  width: 56px;
  text-align: right;
}
</style>
