<template>
  <div class="materialList posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="materialLists pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span class="c6">材料名称：</span>
            <el-input
              v-model="search.value1"
              size="mini"
              clearable
              style="width:calc(100% - 100px);"
            ></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>归属部门：</span>
            <el-select
              v-model="search.value2"
              placeholder="请选择"
              size="mini"
              style="width:calc(100% - 100px);"
              clearable
            >
              <el-option
                v-for="item in options.attributionDepartment"
                :key="item.id"
                :label="item.label"
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

          <el-table-column fixed="right" label="操作" width="80" align="center">
            <template slot-scope="scope">
              <span>
                <el-button
                  class="underline f12"
                  @click="lookDetail(scope.row)"
                  type="text"
                  align="center"
                  v-if="$store.getters.userLoginVO.manager || $store.getters.userLoginVO.dept === scope.row.attributionDepartment"
                >详情</el-button>
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
  getMaterialManageList,
  queryTechnicalCentreDept,
  queryDepartmentMaterialManage
} from "../../axios/api.js";
import column from "../../components/tableColumn";
import breadcrumbList from "../../components/breadcrumbList";
import materialListDetail from "../../components/material/materialListDetail";

export default {
  name: "materialList",
  components: {
    breadcrumbList: breadcrumbList,
    column: column,
    AddOrEdit: materialListDetail
  },
  async created() {
    let branch = await queryDepartmentMaterialManage();
    if (branch.status === 1) {
      branch.msg.forEach(item=>{
        this.options.attributionDepartment.push({label:item.pleaseDepartmentName,id:item.id})
      })
    }
  },

  mounted() {
    this.getList();
  },

  methods: {
    // get dataList of table
    async getList() {
      let params = {
        page: this.currentPage,
        size: this.size
      };
      if (this.search.value1) {
        params.materialName = this.search.value1;
      }
      if (this.search.value2) {
        params.attributionDepartment = this.search.value2;
      }

      let res = await getMaterialManageList(params);
      if (res.status === 1) {
        this.table = res.msg;
      }
    },

    // search
    SearchList() {
      this.currentPage = 1;
      this.getList();
    },

    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },

    lookDetail(row) {
      let params = JSON.parse(JSON.stringify(row));
      /* 赋值归属部门名称 */
      // params.attributionDepartmentName = [{},...this.options.attributionDepartment][params.attributionDepartment].pleaseDepartmentName;
      this.$store.dispatch("materialList_edit", params);
      this.breadcrumb.push({ id: "edit", name: "详情" });

      this.show = true;
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

      options: {
        attributionDepartment: []
      },

      header: [
        { prop: "materialName", label: "材料名称", width: "unset" },
        { prop: "attributionDepartmentName", label: "请购部门", eachWidth: 40 },
        { prop: "remainingQuantity", label: "库存数量", eachWidth: 20 },
        { prop: "unit", label: "单位", eachWidth: 40 },
        { prop: "unitPrice", label: "最新单价" },
        // { prop: 'type', label: '项目类型', change: ['', '政府合作项目', '企业内部项目', '企业间合作项目', '科研预研究项目']},

        { prop: "purchaseTotal", label: "采购总数", eachWidth: 20 },

        { prop: "totalMoney", label: "采购总金额", eachWidth: 20 }
      ],

      // search
      search: {},

      show: false,

      // breadcrumb
      breadcrumb: [
        { id: "material", name: "材料管理", path: "/material" },
        {
          id: "materialList",
          name: "材料统计",
          path: "/material/materialList",
          thing: "showDefault"
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>

