<template>
  <div class="costProjectEquipment posr">
    <div class="costProjectEquipments pl20 pr20">
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20 lh28">
            <span>
              项目名称：
              <b>{{info.projectName}}</b>
            </span>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">设备名称：</span>
            <el-input
              v-model="search.value1"
              size="mini"
              clearable
              style="width:calc(100% - 100px);"
            ></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>设备类别：</span>
            <el-select
              v-model="search.value2"
              placeholder="请选择"
              size="mini"
              style="width:calc(100% - 100px);"
              clearable
            >
              <el-option
                v-for="item in options.deviceClass"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span>费用类型：</span>
            <el-select
              v-model="search.value3"
              placeholder="请选择"
              size="mini"
              style="width:calc(100% - 100px);"
              clearable
            >
              <el-option
                v-for="item in options.fundType"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            class="fl"
            @click="SearchList()"
          ></el-button>
        </el-row>
        <hr />
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button
          type="primary"
          size="mini"
          @click="opencostEquipmentDialog('')"
          v-if="$route.meta.button.nextButton.includes('新增')"
        >新增</el-button>
        <el-button
          type="primary"
          size="mini"
          @click="exportExcel"
          v-if="$route.meta.button.nextButton.includes('导出Excel')"
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
          <column :header="header" @changeStatus="changeStatus"></column>

          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <span>
                <el-button
                  class="underline f12"
                  @click="opencostEquipmentDialog(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.nextButton.includes('编辑')"
                >编辑</el-button>
                <el-button
                  class="underline f12"
                  @click="deletes(scope.row)"
                  type="text"
                  align="center"
                  v-if="$route.meta.button.nextButton.includes('删除')"
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

      <!-- 新增或修改设备 -->
      <el-dialog
        :title="Object.keys(costEquipment).length !== 3?'编辑':'新增'"
        :visible.sync="costEquipmentDialogShow"
        center
        custom-class="dialogStyle"
        @close="cancelAdd"
      >
        <el-form :model="costEquipment" label-position="right" size="mini">
          <el-row style="width:100%;line-height:40px;margin:0 auto;">
            <el-col :span="7">
              <el-form-item label="费用类型：" label-width="100px">
                <el-select
                  v-model="costEquipment.fundType"
                  placeholder="请选择"
                  size="mini"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in options.fundType"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="9">
              <el-form-item label="设备类别：" label-width="100px">
                <el-select
                  v-model="costEquipment.deviceClass"
                  placeholder="请选择"
                  size="mini"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in options.deviceClass"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label="发票是否盖章：" label-width="120px">
                <el-select
                  v-model="costEquipment.whetherSeal"
                  placeholder="请选择"
                  size="mini"
                  style="width:100%;"
                >
                  <el-option
                    v-for="item in options.whetherSeal"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="交货日期：" label-width="100px">
                  <el-date-picker
                    clearable
                    style="width:100%;"
                    v-model="costEquipment.recordedDate"
                    type="datetimerange"
                    align="right"
                    format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    :disabled="costEquipmentFlag === 1"
                    size="mini"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="设备名称：" label-width="100px">
                  <el-select
                    v-model="costEquipment.equipmentName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入名称查询设备并添加"
                    :remote-method="searchNames"
                    :loading="loading"
                    size="small"
                    value-key="propertyNum"
                    @visible-change="val => {let self = this;if(!val) self.listDown=[];}"
                    style="width:100%;"
                    :disabled="costEquipmentFlag === 1"
                  >
                    <el-option
                      v-for="item in listDown"
                      :key="item.id"
                      :label="item.equipmentName"
                      :value="item"
                      :disabled="item.projectName !== null && item.projectName !== ''"
                    >
                      <span
                        class="select_color f12 ml20 lh24 dis"
                        style="max-width:960px;overflow-x:auto;"
                      >
                        <b class="pr40">{{ item.equipmentName}}</b>
                        <b class="cc">固定资产编号：</b>
                        <b>{{ item.propertyNum}}</b>
                        <b class="cc">交货日期：</b>
                        <b>{{ item.deliveryTime}}</b>
                        <b class="cc">规格型号：</b>
                        <b>{{ item.standardType}}</b>
                        <b class="cc">实际金额：</b>
                        <b>{{ item.actualAmount}}</b>
                        <b class="cc">资产归属：</b>
                        <b>{{ item.assetOwnership}}</b>
                        <b class="cc">已关联项目名称：</b>
                        <b>{{ item.projectName}}</b>
                        <b class="cc">申报项目名称：</b>
                        <b>{{ item.applicationProjectName}}</b>
                        <b class="cc">申报补助项目名称：</b>
                        <b>{{ item.applySubsidyProjectName}}</b>
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注：" label-width="100px">
                <el-input
                  type="textarea"
                  :rows="3"
                  resize="none"
                  maxlength="200"
                  show-word-limit
                  placeholder="请输入备注内容"
                  v-model="costEquipment.ramark"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addOrEditcostEquipment">确 定</el-button>
          <el-button @click="costEquipmentDialogShow = false" size="mini">取 消</el-button>
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
  getEquipmentOutlayInformationList,
  addEquipmentOutlayInformation,
  editEquipmentOutlayInformation,
  removeEquipmentOutlayInformation,
  downloadEquipmentOutlayInformationList,
  getEquipmentInformation
} from "../../axios/api.js";
import column from "../../components/tableColumn";

export default {
  name: "costProjectEquipment",
  components: {
    column: column
  },
  async created() {
    this.info = this.$store.getters.costProject_edit;
    this.getList();
  },

  methods: {
    // get dataList of table
    async getList() {
      let params = {
        page: this.currentPage,
        size: this.size,
        projectId: this.info.projectId,
        fundId: this.info.id
      };
      if (this.search.value1) {
        params.equipmentName = this.search.value1;
      }
      if (this.search.value2) {
        params.deviceClass = this.search.value2;
      } else if (this.search.value2 === 0) {
        params.deviceClass = this.search.value2;
      }
      if (this.search.value3) {
        params.fundType = this.search.value3;
      } else if (this.search.value3 === 0) {
        params.fundType = this.search.value3;
      }
      let res = await getEquipmentOutlayInformationList(params);
      if (res.status === 1) {
        this.table = res.msg;
        this.imp = this.table.content[0];
        if (this.tk) {
          this.editFun();
          this.tk = false;
        }
      }
    },

    // search
    SearchList() {
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
      this.$confirm(`此操作将删除"${row.equipmentName}", 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await removeEquipmentOutlayInformation({ id: row.id });
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

    /*addOrEdit(row) {
        if (!row) {
          this.$store.dispatch('project_progress', {projectId: this.search.value1});
          this.breadcrumb.push({id: 'add', name: '新增'});
        } else {
          this.$store.dispatch('project_progress', row);
          this.breadcrumb.push({id: 'edit', name: '编辑'});
        }
        this.show = !this.show;
      },*/

    // download Excel
    async exportExcel() {
      let params = {
        projectId: this.info.projectId,
        fundId: this.info.id
      };
      if (this.search.value1) {
        params.equipmentName = this.search.value1;
      }
      if (this.search.value2) {
        params.deviceClass = this.search.value2;
      } else if (this.search.value2 === 0) {
        params.deviceClass = this.search.value2;
      }
      if (this.search.value3) {
        params.fundType = this.search.value3;
      } else if (this.search.value3 === 0) {
        params.fundType = this.search.value3;
      }
      let res = await downloadEquipmentOutlayInformationList(params);
    },
    // 编辑方法
    async editFun() {
      let res = await editEquipmentOutlayInformation({
        ...this.imp,
        projectId: this.info.projectId,
        fundId: this.info.id
      });
      if (res.status === 1) {
        this.getList();
      }
    },
    // submit costEquipment
    async addOrEditcostEquipment() {
      if (
        this.costEquipment.deviceClass !== "" &&
        this.costEquipment.fundType !== "" &&
        this.costEquipment.whetherSeal !== ""
      ) {
        let params = {
          ...this.costEquipment,
          projectId: this.info.projectId,
          fundId: this.info.id
        };
        if (!this.costEquipmentFlag) {
          params.propertyNum = this.costEquipment.equipmentName.propertyNum;
        }
        let res;
        if (this.costEquipmentFlag) {
          res = await editEquipmentOutlayInformation(params);
          if (res.status === 1) {
            this.costEquipmentDialogShow = false;
            Message({
              showClose: true,
              type: "success",
              message: "编辑成功！"
            });
            this.getList();
          }
        } else {
          res = await addEquipmentOutlayInformation(params);
          if (res.status === 1) {
            this.costEquipmentDialogShow = false;
            Message({
              showClose: true,
              type: "success",
              message: "新增成功！"
            });
            this.getList();
            this.tk = true;
          }
        }
      } else {
        Message({
          showClose: true,
          type: "warning",
          message: "请完整填写所有信息！"
        });
      }
    },

    // open costEquipment dialog
    opencostEquipmentDialog(row) {
      this.costEquipmentDialogShow = true;
      if (row) {
        this.costEquipmentFlag = 1;
        this.costEquipment = row;
      } else {
        this.costEquipmentFlag = 0;
        this.costEquipment = {
          fundType: 0,
          deviceClass: 0,
          whetherSeal: 0
        };
      }
    },

    // 关闭弹框
    cancelAdd() {
      this.costEquipmentDialogShow = false;
    },

    // 根据条件查询客户下拉列表
    searchNames(query) {
      let self = this;
      self.listDown = [];
      let costE = this.costEquipment.recordedDate;
      let params = {
        equipmentName: query
      };
      // 交货日期
      if (costE) {
        params.playStartTime = costE[0];
        params.playEndTime = costE[1];
      }
      if (query) {
        self.loading = true;
        setTimeout(async () => {
          let res = await getEquipmentInformation(params);
          if (res.status === 1) {
            self.listDown = res.msg;
            self.loading = false;
          }
        }, 200);
      } else {
        self.listDown = [];
      }
    },

    // change the value of select
    async changeStatus(obj, prop) {
      this.costEquipmentFlag = 1;
      this.costEquipment = obj;
      this.addOrEditcostEquipment();
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
        { prop: "equipmentName", label: "设备名称" },
        { prop: "propertyNum", label: "资产编号" },

        { prop: "standardType", label: "规格型号" },
        { prop: "actualAmount", label: "金额", eachWidth: 50 },
        {
          prop: "fundType",
          label: "费用类型",
          select: [{ id: 0, label: "资助" }, { id: 1, label: "自筹" }]
        },
        {
          prop: "deviceClass",
          label: "设备类别",
          select: [
            { id: 0, label: "项目新购设备" },
            { id: 1, label: "预算调配设备" }
          ],
          eachWidth: 40
        },
        {
          prop: "whetherSeal",
          label: "发票是否已盖章",
          select: [{ id: 0, label: "是" }, { id: 1, label: "否" }],
          eachWidth: 15
        },
        { prop: "assetOwnership", label: "资产归属" },
        { prop: "providerConsult", label: "供应商", eachWidth: 30 },
        { prop: "contractNum", label: "关联采购合同编号", eachWidth: 15 },
        { prop: "contractName", label: "合同名称" },
        { prop: "ramark", label: "备注", width: "unset" }
      ],

      // search
      search: {
        // value1: '',
        // value2: 0,
        // value3: 0,
      },
      options: {
        projectName: [],
        deviceClass: [
          { id: 0, name: "项目新购设备" },
          { id: 1, name: "预算调配设备" }
        ],
        fundType: [{ id: 0, name: "资助" }, { id: 1, name: "自筹" }],
        whetherSeal: [{ id: 0, name: "是" }, { id: 1, name: "否" }]
      },

      show: false,
      info: {},

      // 设备名称下拉清单
      listDown: [],
      loading: false, //下拉列表请求后提示加载中

      // dialogs
      costEquipmentDialogShow: false,
      costEquipment: {},
      costEquipmentFlag: 0,

      // breadcrumb
      breadcrumb: [
        { id: "cost", name: "经费预算", path: "/cost" },
        {
          id: "costProject",
          name: "项目经费预算管理",
          path: "/cost/costProject",
          thing: "showDefault"
        }
      ],
      // 行内对象
      imp: {},
      tk: false
    };
  }
};
</script>

<style lang="scss">
.dialogStyle {
  min-width: 800px;
  border-radius: 5px;
}
</style>

