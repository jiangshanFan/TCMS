<template>
  <div class="costList posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <div class="costLists pl20 pr20">
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span class="c6">项目名称：</span>
            <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">项目负责人：</span>
            <el-input v-model="search.value2" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>项目状态：</span>
            <el-select v-model="search.value3" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.status" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">计划开始日期：</span>
            <el-date-picker  clearable style="width:calc(100% - 100px);"
                             v-model="search.value4"
                             type="datetimerange"
                             align="right"
                             format="yyyy-MM-dd"
                             range-separator="-"
                             start-placeholder="开始日期"
                             end-placeholder="结束日期"
                             :default-time="['00:00:00', '23:59:59']"
                             size="mini">
            </el-date-picker>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">计划完成日期：</span>
            <el-date-picker  clearable style="width:calc(100% - 100px);"
                             v-model="search.value5"
                             type="datetimerange"
                             align="right"
                             format="yyyy-MM-dd"
                             range-separator="-"
                             start-placeholder="开始日期"
                             end-placeholder="结束日期"
                             :default-time="['00:00:00', '23:59:59']"
                             size="mini">
            </el-date-picker>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="SearchList()"></el-button>
        </el-row>
        <hr>
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
          tooltip-effect="light">

          <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

          <!-- circle -->
          <column :header="header"></column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination fr ovw-h mt20">
          <el-pagination @current-change="handleCurrentChange"
                         @size-change="handleSizeChange"
                         :current-page="currentPage" :page-size="size"
                         :page-sizes="[5, 10, 15, 20,50]"
                         layout="total, sizes, prev, pager, next"
                         :total="table.totalCount" v-if="table.totalCount">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getProjectCostList, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'

  export default {
    name: "costList",
    components: {
      'breadcrumbList': breadcrumbList,
      'column': column,
    },
    created() {
      console.log(this.$route);
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
        };
        if(this.search.value1) {
          params.projectName = this.search.value1;
        }
        if(this.search.value2) {
          params.projectMan = this.search.value2;
        }
        if(this.search.value3) {
          params.status = this.search.value3;
        }

        if(this.search.value4) {
          params.projectStartTimeStart = this.search.value4[0];
          params.projectStartTimeEnd = this.search.value4[1];
        }
        if(this.search.value5) {
          params.projectEndTimeStart = this.search.value5[0];
          params.projectEndTimeEnd = this.search.value5[1];
        }

        let res = await getProjectCostList(params);
        if(res.status === 1) {
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

      // show default module
      showDefault(val) {
        if (val) {
          this.show = false;
          this.breadcrumb = this.breadcrumb.slice(0,2);
          this.getList();
        }
      },
    },

    data() {
      return {
        // table
        table: {},
        currentPage: 1,
        size: 10,

        header: [
          { prop: 'projectName', label: '项目名称',},
          { prop: 'projectMan', label: '项目负责人',},
          { prop: 'status', label: '项目状态', change: ['', '规划中', '待审批', '进行中', '已关闭', '验收中', '已完成',]},
          { prop: 'projectStartTime', label: '项目计划开始日期', date: 1},
          { prop: 'projectEndTime', label: '项目计划完成日期', date: 1},
          { prop: 'fundTypeNum', label: '经费支出类别',},
          // { prop: 'type', label: '项目类型', change: ['', '政府合作项目', '企业内部项目', '企业间合作项目', '科研预研究项目']},


          { prop: 'fundMoney', label: '资助金额',},

          { prop: 'fundUseMoney', label: '资助已用金额',},
          { prop: 'selfMoney', label: '自筹金额',},
          { prop: 'selfUseMoney', label: '自筹已用金额',},
          { prop: 'moneyTotal', label: '经费小计',},
          { prop: 'moneyUseTotal', label: '已用经费小计',},
        ],

        // search
        search: {},
        options: {
          status: [
            { label: '规划中', id: 1,},
            { label: '待审批', id: 2,},
            { label: '进行中', id: 3,},
            { label: '已关闭', id: 4,},
            { label: '验收中', id: 5,},
            { label: '已完成', id: 6,},
          ],
        },

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'cost', name: '经费预算', path: '/cost',},
          { id: 'costList', name: '经费预算统计', path: '/cost/costList', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>

