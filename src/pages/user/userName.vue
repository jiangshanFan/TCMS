<template>
  <div class="userName posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="userNames pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span class="c6">账户名称：</span>
            <el-input
              v-model="search.accountName"
              size="mini"
              clearable
              style="width:calc(100% - 100px);"
            ></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">用户名称：</span>
            <el-input
              v-model="search.userName"
              size="mini"
              clearable
              style="width:calc(100% - 100px);"
            ></el-input>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr />
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 表格数据 -->
        <el-table
          :data="table.content"
          stripe
          border
          size="small"
          style="width: 100%;margin-top:10px;"
          header-cell-class-name="header_cell table_header_shadow"
          tooltip-effect="light"
        >
          <el-table-column fixed type="index" width="60" label="序号" align="center"></el-table-column>

          <!-- circle -->
          <column :header="header"></column>

          <el-table-column fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.userId !== 1">
                <el-button
                  class="underline f12"
                  @click="edits(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.buttons.includes('编辑')"
                >编辑</el-button>
                <el-button
                  class="underline f12"
                  @click="resets(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.buttons.includes('重置密码')"
                >重置密码</el-button>
                <el-button
                  class="underline f12"
                  @click="deletes(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.buttons.includes('删除')"
                >删除</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination fr ovw-h mt20">
          <el-pagination
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :current-page="currentPage"
            :page-size="size"
            :page-sizes="[5, 10, 15, 20,50]"
            layout="total, sizes, prev, pager, next"
            :total="table.totalCount"
            v-if="table.totalCount"
          ></el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  getUserList,
  deleteUser,
  resetPwd,
  // queryTechnicalCentreDept
} from "../../axios/api.js";
import column from "../../components/tableColumn";
import breadcrumbList from "../../components/breadcrumbList";
import UserNameAddOrEdit from "../../components/UserNameAddOrEdit";
import newBranch from "../user/newBranch";
export default {
  name: "userName",
  components: {
    breadcrumbList: breadcrumbList,
    AddOrEdit: UserNameAddOrEdit,
    column: column,
    newBranch: newBranch
  },
  created() {
    /* 通过在创建组件的周期内改写header的值，可以改变子组件对应的值 */
    // this.header.forEach(async item => {
    //   if (item.prop === "dept") {
    //     let res = await queryTechnicalCentreDept();
    //     if (res.status === 1) {
    //       item.change = [
    //         "",
    //         ...[...res.msg].map(item => item.pleaseDepartmentName)
    //       ];
    //     }
    //   }
    // });
    this.getList();
  },

  methods: {
    // get dataList of table
    async getList() {
      let params = {
        page: this.currentPage,
        size: this.size
      };
      if (this.search.accountName) {
        params.accountName = this.search.accountName;
      }
      if (this.search.userName) {
        params.userName = this.search.userName;
      }
      let res = await getUserList(params);
      if (res.status === 1) {
        this.table = res.msg;
      }
    },

    // search
    Search() {
      this.currentPage = 1;
      this.getList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },

    deletes(row) {
      this.$confirm(`此操作将删除"${row.userName}", 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await deleteUser({ userId: row.userId });
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
    },

    resets(row) {
      this.$confirm(
        `此操作将重置用户"${row.userName}"密码为"Ybsx#123", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          let res = await resetPwd({ userId: row.userId });
          if (res.status === 1) {
            this.getList();
            Message({
              showClose: true,
              type: "success",
              message: "重置成功！"
            });
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消重置" });
        });
    },

    edits(row) {
      this.$store.dispatch("auth_userName", row);
      this.show = !this.show;
      this.breadcrumb.push({ id: "edit", name: "编辑" });
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
      // table
      table: {},
      currentPage: 1,
      size: 10,

      // search
      search: {},

      header: [
        { prop: "accountName", label: "账户名称" },
        { prop: "roleName", label: "用户角色", parent: "role" },
        { prop: "status", label: "账户状态", change: ["关闭", "启用"] },
        { prop: "userName", label: "用户名称" },
        { prop: "workNo", label: "工号", eachWidth: 50 },
        { prop: "deptName", label: "部门", eachWidth: 50 },
        { prop: "createTime", label: "创建时间", date: 1 },
        { prop: "mobile", label: "手机号", eachWidth: 50 },
        { prop: "mail", label: "邮箱", width: "unset" }
      ],

      show: false,

      // breadcrumb
      breadcrumb: [
        { id: "user", name: "权限管理", path: "/user" },
        {
          id: "userName",
          name: "账户管理",
          path: "/user/userName",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 20px !important;
}
</style>

