<template>
  <div class="costProject posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="costProjects pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span>项目名称：</span>
            <el-select
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

          <div class="fl mr20 mb20">
            <span class="c6">经费支出类别名称：</span>
            <el-input
              v-model="search.value2"
              size="mini"
              clearable
              style="width:calc(100% - 150px);"
            ></el-input>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr />
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button
          type="primary"
          size="mini"
          @click="openCostTypeDialog('')"
          v-if="$route.meta.button.buttons.includes('新增经费类别')"
        >新增经费类别</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="exportExcel"
          v-if="$route.meta.button.buttons.includes('导出Excel')"
        >导出Excel</el-button>

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
          <el-table-column
            fixed
            type="index"
            width="60"
            label="序号"
            align="center"
            :index="(index) => this.$indexS(index, currentPage, size)"
          ></el-table-column>

          <!-- circle -->
          <column :header="header"></column>

          <el-table-column fixed="right" label="操作" width="unset" align="center">
            <template slot-scope="scope">
              <span>
                <el-button
                  class="underline f12"
                  @click="openCostTypeDialog(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.buttons.includes('预算设置')"
                >预算设置</el-button>
                <el-button
                  class="underline f12"
                  @click="edit(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.buttons.includes('编辑')"
                >编辑</el-button>
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

      <!-- 新增经费或预算设置 -->
      <el-dialog
        :title="Object.keys(costType).length?'预算设置':'新增经费类别'"
        :visible.sync="costTypeDialogShow"
        center
        custom-class="dialogStyle"
        @close="cancelAdd"
      >
        <el-form :model="costType" label-position="right" label-width="120px" size="mini">
          <el-row style="line-height:40px;margin:0 auto;">
            <el-col :span="12" :offset="6">
              <el-col>
                <el-form-item label="经费类别：">
                  <el-input
                    v-model="costType.tuitionInformation"
                    autocomplete="off"
                    style="width:100%;"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="资助金额：">
                  <el-input
                    @blur="amountPatronageBlur(costType.amountPatronage)"
                    v-model="costType.amountPatronage"
                    autocomplete="off"
                    style="width:100%;"
                  ></el-input>
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="自筹金额：">
                  <el-input
                    @blur="raiseMountBlur(costType.raiseMount)"
                    v-model="costType.raiseMount"
                    autocomplete="off"
                    style="width:100%;"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addOrEditCostType">确 定</el-button>
          <el-button @click="costTypeDialogShow = false" size="mini">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  getProjectFundList,
  addProjectFundInformation,
  editProjectFundInformation,
  removeProjectFundInformation,
  downloadProjectFundList,
  queryProjectAllName
} from "../../axios/api.js";
import column from "../../components/tableColumn";
import breadcrumbList from "../../components/breadcrumbList";
import costProjectType from "../../components/cost/costProjectType";

export default {
  name: "costProject",
  components: {
    breadcrumbList: breadcrumbList,
    AddOrEdit: costProjectType,
    column: column
  },
  async mounted() {
    let res = await queryProjectAllName();
    if (res.status === 1) {
      this.options.projectName = [...res.msg];
      this.search.value1 = this.options.projectName[0].id;
      this.getList();
    }
  },

  methods: {
    // 资助金额失去焦点事件
    amountPatronageBlur(val) {
      let res = this.$money(+val);
      if (res === 2) {
        this.costType.amountPatronage = "";
      }
    },
    // 自筹金额失去焦点事件
    raiseMountBlur(val) {
      let res = this.$money(+val);
      if (res === 2) {
        this.costType.raiseMount = "";
      }
    },
    // get dataList of table
    async getList() {
      let params = {
        page: this.currentPage,
        size: this.size
      };
      if (this.search.value1) {
        params.projectId = this.search.value1;
        if (this.search.value2) {
          params.tuitionInformation = this.search.value2;
        }

        let res = await getProjectFundList(params);
        if (res.status === 1) {
          this.table = res.msg;
        }
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
      this.$confirm(
        `此操作将删除"${row.tuitionInformation}", 是否继续?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(async () => {
          let res = await removeProjectFundInformation({ id: row.id });
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

    edit(row) {
      let projectName;
      this.options.projectName.forEach(item => {
        if (item.id === row.projectId) {
          projectName = item.projectName;
        }
      });
      let params = JSON.parse(JSON.stringify(row));
      params.projectName = projectName;
      this.$store.dispatch("costProject_edit", params);
      this.breadcrumb.push({ id: "edit", name: "编辑" });

      this.show = !this.show;
    },

    // download Excel
    async exportExcel() {
      let params = {
        projectId: this.search.value1
      };
      if (this.search.value2) {
        params.tuitionInformation = this.search.value2;
      }
      let res = await downloadProjectFundList(params);
    },

    // submit costType
    async addOrEditCostType() {
      /* 注意：input 框中内容的类型是字符串，所有填入的内容都会转换成字符串 */
      if (
        this.costType.tuitionInformation &&
        /^\d+(\.\d+)?$/.test(this.costType.amountPatronage) &&
        /^\d+(\.\d+)?$/.test(this.costType.raiseMount)
      ) {
        let params = {
          ...this.costType,
          projectId: this.search.value1
        };
        let res;
        if (this.costTypeFlag) {
          res = await editProjectFundInformation(params);
        } else {
          res = await addProjectFundInformation(params);
        }
        if (res.status === 1) {
          this.costTypeDialogShow = false;
          if (this.costTypeFlag) {
            Message({
              showClose: true,
              type: "success",
              message: "预算设置成功！"
            });
          } else {
            Message({
              showClose: true,
              type: "success",
              message: "新增经费类别成功！"
            });
          }
          this.getList();
        }
      } else {
        Message({
          showClose: true,
          type: "warning",
          message: "请完整填写所有信息！"
        });
      }
    },

    // open costType dialog
    openCostTypeDialog(row) {
      this.costTypeDialogShow = true;
      if (row) {
        this.costTypeFlag = 1;
        this.costType = row;
        this.getList();
      } else {
        this.costTypeFlag = 0;
        this.costType = {};
        this.getList();
      }
    },

    // 关闭弹框
    cancelAdd() {
      this.costTypeDialogShow = false;
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

      header: [
        { prop: "tuitionInformation", label: "经费支出类别" },
        { prop: "amountPatronage", label: "资助金额" },

        { prop: "fundUseMoney", label: "资助已用金额" },
        { prop: "raiseMount", label: "自筹金额" },
        { prop: "selfUseMoney", label: "自筹已用金额" },
        { prop: "moneyTotal", label: "小计", eachWidth: 60 },
        { prop: "moneyUseTotal", label: "已用小计" }
      ],

      // search
      search: {
        value1: ""
      },
      options: {
        projectName: []
      },

      show: false,

      // dialogs
      costTypeDialogShow: false,
      costType: {},
      costTypeFlag: 0,

      // breadcrumb
      breadcrumb: [
        { id: "cost", name: "经费预算", path: "/cost" },
        {
          id: "costProject",
          name: "项目经费预算管理",
          path: "/cost/costProject",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>

