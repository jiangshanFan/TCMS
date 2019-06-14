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
            <el-select v-model="search.value1" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.projectName" :key="item.id" :label="item.projectName" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span>状态：</span>
            <el-select v-model="search.value2" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.status" :key="item.id" :label="item.label" :value="item.label"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">姓名：</span>
            <el-input v-model="search.value3" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>是否考评：</span>
            <el-select v-model="search.value4" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.evaluate" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="Search()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <div class="buttons ovwh">
          <el-button type="primary" size="mini" @click="exportExcel">导出Excel</el-button>

          <el-select v-model="newMember" filterable remote reserve-keyword placeholder="请输入名称查询成员并添加"
                     :remote-method="searchNames"
                     :loading="loading"
                     size="small"
                     value-key="empNo"
                     @visible-change="val => {let self = this;if(!val) self.listDown=[];}">
            <el-option v-for="item in listDown" :key="item.empNo" :label="item.name" :value="item">
              <span class="fl">{{ item.name }}</span>
              <span class="fr select_color f12 ml20 disib">
                <b class="cc">性别：</b><b>{{ item.sex }}</b>
                <b class="cc">部门：</b><b>{{item.dept}}</b>
                <b class="cc">职位：</b><b>{{item.position}}</b>
              </span>
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="addNewMember()">新增项目成员</el-button>
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
          <column :header="header" @changeStatus="changeWhetherInspection"></column>

          <el-table-column fixed="right" label="操作" width="60" align="center">
            <template slot-scope="scope">
              <span>
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
  import { getProjectMember, removeProjectMember, revampProjectMember, downloadProjectMember, queryProjectProjectName, getEmployeesInfoList, saveProjectMember, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import ProjectAddOrEdit from '../../components/ProjectAddOrEdit'

  export default {
    name: "projectMembers",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': ProjectAddOrEdit,
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
          if(this.search.value2 !== 'all') {
            params.type = this.search.value2;
          }
          if(this.search.value3) {
            params.name = this.search.value3;
          }
          if(this.search.value4 !== -1) {
            params.whetherInspection = this.search.value4;
          }

          let res = await getProjectMember(params);
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

      deletes(row) {
        this.$confirm(`此操作将删除"${row.name}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await removeProjectMember({id: row.id});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      edits(row) {
        this.$store.dispatch('project_progress', row);
        this.show = !this.show;
        this.breadcrumb.push({id: 'edit', name: '编辑'});
      },

      // download Excel
      async exportExcel() {
        let res = await downloadProjectMember({projectId: this.search.value1});
      },

      // 根据条件查询客户下拉列表
      searchNames(query) {
        let self = this;
        self.listDown = [];
        if (query) {
          self.loading = true;
          setTimeout(async () => {
            let res = await getEmployeesInfoList({name: query});
            if (res.status === 1) {
              self.listDown = res.msg;
              self.loading = false;
            }
          }, 200);
        } else {
          self.listDown = [];
        }
      },

      // add new member
      async addNewMember() {
        if (this.newMember) {
          let res = await saveProjectMember({...this.newMember, projectId: this.search.value1});
          if (res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '新增项目成员成功！'});
          }
        } else {
          Message({showClose: true, type: 'warning', message: '请输入名称查询成员！'});
        }
      },

      // change whetherInspection
      async changeWhetherInspection(obj) {
        let res = await revampProjectMember(obj);
        console.log(obj);
        if (res.status === 1) {
          this.getList();
          Message({showClose: true, type: 'success', message: '修改考评成功！'});
        }
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

        newMember: '',
        loading: false, //下拉列表请求后提示加载中
        listDown: [],

        header: [
          { prop: 'name', label: '姓名', eachWidth: 40,},
          { prop: 'empNo', label: '工号', eachWidth: 60,},

          { prop: 'position', label: '工作职位',},
          { prop: 'sex', label: '性别',},
          { prop: 'birthday', label: '出生日期',},
          { prop: 'highEducation', label: '学历', eachWidth: 40,},
          { prop: 'school', label: '毕业学校',},
          { prop: 'type', label: '状态', eachWidth: 40,},
          { prop: 'unitTime', label: '入职时间',},
          { prop: 'whetherInspection', label: '是否考评', select: [ { id: 0, label: '否'}, { id: 1, label: '是'},]},
          { prop: 'dept', label: '部门', eachWidth: 40,},
          { prop: 'mobile', label: '联系电话',},
          { prop: 'mail', label: '邮箱', width:'unset', },

        ],

        // search
        search: {
          value1: '',
          value2: 'all',
          value4: -1,
        },
        options: {
          projectName: [],
          status: [
            { id: 0, label: 'all'},
            { id: 1, label: '正式人员'},
            { id: 2, label: '试用人员'},
            { id: 3, label: '调转人员'},
          ],
          evaluate: [
            { id: -1, label: 'all'},
            { id: 1, label: '是'},
            { id: 0, label: '否'},
          ],
        },

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'project', name: '项目管理', path: '/project',},
          { id: 'projectMembers', name: '项目成员管理', path: '/project/projectMembers', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>
