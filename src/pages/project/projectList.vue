<template>
  <div class="projectList posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="userRoles pl20 pr20" v-else>
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
            <span class="c6">科技接口部门：</span>
            <el-input v-model="search.value4" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">项目开始日期：</span>
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

          <div class="fl mr20 mb20">
            <span class="c6">项目完成日期：</span>
            <el-date-picker  clearable style="width:calc(100% - 100px);"
                             v-model="search.value6"
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

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>

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

          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.id !== 1">
                <el-button class="underline f12" @click="edits(scope.row)" type="text" align="center" v-if="$route.meta.button.buttons.includes('编辑')">编辑</el-button>
                <el-button class="underline f12" @click="deletes(scope.row)" type="text" align="center" v-if="$route.meta.button.buttons.includes('删除')">删除</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="pagination fr ovw-h mt20">
          <el-pagination @current-change="handleCurrentChange"
                         :current-page="currentPage" :page-size="size"
                         layout="total, prev, pager, next"
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
  import { getProjectProjectInformation, removeProjectInformation, downloadProjectList, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import ProjectAddOrEdit from '../../components/ProjectAddOrEdit'

  export default {
    name: "projectList",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': ProjectAddOrEdit,
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
          params.empName = this.search.value2;
        }
        if(this.search.value3) {
          params.status = this.search.value3;
        }
        if(this.search.value4) {
          params.techInterfaceDept = this.search.value4;
        }

        if(this.search.value5) {
          params.realStartTimeStart = this.search.value5[0];
          params.realStartTimeEnd = this.search.value5[1];
        }
        if(this.search.value6) {
          params.realEndTimeStart = this.search.value6[0];
          params.realEndTimeEnd = this.search.value6[1];
        }

        let res = await getProjectProjectInformation(params);
        if(res.status === 1) {
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

      deletes(row) {
        this.$confirm(`此操作将删除"${row.projectName}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await removeProjectInformation({id: row.id});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      edits(row) {
        this.$store.dispatch('project_list', row);
        this.show = !this.show;
        this.breadcrumb.push({id: 'edit', name: '编辑'});
      },

      // download Excel
      async exportExcel() {
        let res = await downloadProjectList();
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
        table: [],
        currentPage: 1,
        size: 10,

        header: [
          { prop: 'projectName', label: '项目名称',},
          { prop: 'createTime', label: '项目创建时间',},
          { prop: 'type', label: '项目类型', change: ['', '政府合作项目', '企业内部项目', '企业间合作项目', '科研预研究项目']},
          { prop: 'status', label: '项目状态', change: ['', '规划中', '待审批', '进行中', '已关闭', '验收中', '已完成',]},
          { prop: 'empName', label: '项目负责人',},
          { prop: 'techInterfaceDept', label: '科技接口部门',},
          { prop: 'projectStartTime', label: '项目计划开始日期',},
          { prop: 'projectEndTime', label: '项目计划完成日期',},
          { prop: 'projectAcceptTime', label: '项目验收日期',},
          { prop: 'realStartTime', label: '实际开始日期',},
          { prop: 'realEndTime', label: '实际完成日期',},
          { prop: 'projectCostTotal', label: '项目总预算',},
          { prop: 'supportAmount', label: '资助资金',},
          { prop: 'raiseAmount', label: '自筹资金',},
          { prop: 'workContentNum', label: '工作内容总量',},
          { prop: 'percentComplete', label: '完成百分比',},
          { prop: 'memberNum', label: '项目成员数量',},
          { prop: 'patentNum', label: '关联专利数',},
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
          { id: 'project', name: '项目管理', path: '/project',},
          { id: 'projectList', name: '项目列表', path: '/project/projectList', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>

