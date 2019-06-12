<template>
  <div class="projectEvaluate posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="projectEvaluates pl20 pr20" v-else>
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
            <span class="c6">姓名：</span>
            <el-input v-model="search.value2" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <div>
          <span class="fwb f20">项目成员评分</span>
          <el-button class="ml20 underline" type="text" size="mini" @click="dialogIntroduce=true">评分说明</el-button>
        </div>

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

          <el-table-column fixed="right" label="操作" width="60" align="center">
            <template slot-scope="scope">
              <span>
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

    <el-dialog title="评分说明" :visible.sync="dialogIntroduce" width="80%" center>
      <el-row class="ovwh">
        <img class="w" src="../../assets/evaluate_introduce.png" alt="评分说明">
      </el-row>
    </el-dialog>
  </div>

</template>

<script>
  /* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getProjectMemberCheckScore, revampProjectMember, queryProjectProjectName, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import ProjectEvaluateAddOrEdit from '../../components/ProjectEvaluateAddOrEdit'

  export default {
    name: "projectEvaluate",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': ProjectEvaluateAddOrEdit,
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
            params.name = this.search.value2;
          }

          let res = await getProjectMemberCheckScore(params);
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

      edits(row) {
        this.$store.dispatch('project_evaluate', row);
        this.show = !this.show;
        this.breadcrumb.push({id: 'edit', name: '编辑'});
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
          { prop: 'name', label: '姓名', eachWidth: 40,},
          { prop: 'oneSelfGraded', label: '指标1自评分', },

          { prop: 'oneIndicatorGraded', label: '指标1负责人评分',},
          { prop: 'twoSelfGraded', label: '指标2自评分',},
          { prop: 'twoIndicatorGraded', label: '指标2负责人评分',},
          { prop: 'scoreTotal', label: '总分',},
          { prop: 'remark', label: '说明', width: 'unset'},

        ],

        // search
        search: {
          value1: '',
        },
        options: {
          projectName: [],
        },

        show: false,

        // dialog
        dialogIntroduce: false,

        // breadcrumb
        breadcrumb: [
          { id: 'project', name: '项目管理', path: '/project',},
          { id: 'projectEvaluate', name: '项目考评管理', path: '/project/projectEvaluate', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>
