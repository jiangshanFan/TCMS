<template>
  <div class="projectProgress posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="projectProgresss pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span>项目名称：</span>
            <el-select v-model="search.value1" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.projectName" :key="item.id" :label="item.projectName" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">子项目内容：</span>
            <el-input v-model="search.value2" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">责任人：</span>
            <el-input v-model="search.value3" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>
        <el-button type="primary" size="mini" @click="addOrEdit('')">添加工作内容</el-button>

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
              <span>
                <el-button class="underline f12" @click="addOrEdit(scope.row)" type="text" align="center" v-if="$route.meta.button.buttons.includes('编辑')">编辑</el-button>
                <el-button class="underline f12" @click="deletes(scope.row)" type="text" align="center" v-if="$route.meta.button.buttons.includes('删除')">删除</el-button>
              </span>
            </template>
          </el-table-column>
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
  import { getProjectProgressManagement, removeProjectProgressManagement, downloadProjectProgress, queryProjectProjectName, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import ProjectProgressAddOrEdit from '../../components/ProjectProgressAddOrEdit'

  export default {
    name: "projectProgress",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': ProjectProgressAddOrEdit,
      'column': column,
    },
    async created() {
      console.log(this.$route);
      let res = await queryProjectProjectName();
      if (res.status === 1) {
        this.options.projectName = [...res.msg];
        this.search.value1 = this.options.projectName[0].id;
        this.getList();
      }
    },

    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
        };
        if(this.search.value1) {
          params.projectId = this.search.value1;
          if(this.search.value2) {
            params.subprojectContent = this.search.value2;
          }
          if(this.search.value3) {
            params.name = this.search.value3;
          }

          let res = await getProjectProgressManagement(params);
          if(res.status === 1) {
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
        this.$confirm(`此操作将删除"${row.subprojectContent}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await removeProjectProgressManagement({id: row.id});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      addOrEdit(row) {
        if (!row) {
          this.$store.dispatch('project_progress', {projectId: this.search.value1});
          this.breadcrumb.push({id: 'add', name: '新增'});
        } else {
          this.$store.dispatch('project_progress', row);
          this.breadcrumb.push({id: 'edit', name: '编辑'});
        }
        this.show = !this.show;
      },

      // download Excel
      async exportExcel() {
        let res = await downloadProjectProgress({projectId: this.search.value1});
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
          { prop: 'subprojectContent', label: '子项目内容',},
          { prop: 'workContent', label: '工作内容',},

          { prop: 'name', label: '负责人',},
          { prop: 'planStartTime', label: '计划开始日期',},
          { prop: 'planEndTime', label: '计划完成日期',},
          { prop: 'realStartTime', label: '实际开始日期',},
          { prop: 'realEndTime', label: '实际完成日期',},
          { prop: 'percentComplete', label: '完成百分比',},
          { prop: 'remark', label: '备注', width:'unset', },

        ],

        // search
        search: {
          value1: '',
        },
        options: {
          projectName: [],
        },

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'project', name: '项目管理', path: '/project',},
          { id: 'projectProgress', name: '项目进度管理', path: '/project/projectProgress', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>

