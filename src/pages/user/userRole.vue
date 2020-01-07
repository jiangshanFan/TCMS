<template>
  <div class="userRole posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="userRoles pl20 pr20" v-else>

      <!-- content -->
      <div class="mt20">
        <!-- 表格数据 -->
        <el-table
          :data="table"
          stripe
          border
          size="small"
          style="width: 100%;margin-top:10px;"
          header-cell-class-name="header_cell table_header_shadow"
          tooltip-effect="light">

          <el-table-column fixed type="index" width="60" label="序号" align="center"></el-table-column>

          <!-- circle -->
          <column :header="header"></column>

          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.id !== 1">
                <el-button class="underline f12" @click="edits(scope.row)" type="text" align="center" v-if="$route.meta.button.buttons.includes('权限维护')">权限维护</el-button>
                <el-button class="underline f12" @click="deletes(scope.row)" type="text" align="center" v-if="$route.meta.button.buttons.includes('删除')">删除</el-button>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getRoleList, deleteRole, } from '../../axios/api.js'
  import column from '../../components/tableColumn'
  import breadcrumbList from '../../components/breadcrumbList'
  import UserRoleAddOrEdit from '../../components/UserRoleAddOrEdit'

  export default {
    name: "userRole",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': UserRoleAddOrEdit,
      'column': column,
    },
    created() {
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        let res = await getRoleList();
        if(res.status === 1) {
          this.table = res.msg;
        }
      },

      deletes(row) {
        this.$confirm(`此操作将删除"${row.roleName}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await deleteRole({id: row.id});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      edits(row) {
        this.$store.dispatch('auth_userRole', row);
        this.show = !this.show;
        this.breadcrumb.push({id: 'edit', name: '权限维护'});
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

        header: [
          { prop: 'roleName', label: '角色名称',},
          { prop: 'des', label: '角色描述',},
          { prop: 'userNames', label: '用户列表', width: 'unset', },
          { prop: 'status', label: '状态', change: ['关闭', '启用']},
        ],

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'user', name: '权限管理', path: '/user',},
          { id: 'userRole', name: '角色管理', path: '/user/userRole', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>
