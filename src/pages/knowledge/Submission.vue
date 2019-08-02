<template>
  <div class="submissions posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="Submission pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span class="c6">交底书编码：</span>
            <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">交底书名称：</span>
            <el-input v-model="search.value2" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>交底书状态：</span>
            <el-select v-model="search.value3" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.value3" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">交底书负责人：</span>
            <el-input v-model="search.value4" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">代理受理时间：</span>
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
            <span class="c6">计划完成时间：</span>
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

          <div class="fl mr20 mb20">
            <span class="c6">实际完成时间：</span>
            <el-date-picker  clearable style="width:calc(100% - 100px);"
                             v-model="search.value7"
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
        <!--<el-button type="primary" size="mini" @click="addOrEditSubmission('')">新增交底书</el-button>-->

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
          <el-table-column :fixed="h.fixed" v-for="(h,i) in header" :key="h.prop" :prop="h.parent?'':h.prop" :label="h.label" :width="i !== header.length-1 ? h.label.length*25 : ''"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
              <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
              <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
              <span v-else>{{scope.row[h.prop]}}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="addOrEditSubmission(scope.row)" type="text" class="underline" align="center" v-if="$route.meta.button.buttons.includes('编辑')">编辑</el-button>
              <el-button @click="deletes(scope.row)" type="text" class="underline" align="center" v-if="$route.meta.button.buttons.includes('删除')">删除</el-button>
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
import { getDisclosurePaperList, deleteDisclosurePaper, } from '../../axios/api.js'
import SubmissionAddOrEdit from '../../components/SubmissionAddOrEdit'
import breadcrumbList from '../../components/breadcrumbList'

  export default {
    name: "Submission",
    components: {
      'AddOrEdit': SubmissionAddOrEdit,
      'breadcrumbList': breadcrumbList,
    },
    created() {
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
          params.paperCode = this.search.value1;
        }
        if(this.search.value2) {
          params.paperName = this.search.value2;
        }
        if(this.search.value3) {
          params.status = this.search.value3;
        }
        if(this.search.value4) {
          params.charge = this.search.value4;
        }

        if(this.search.value5) {
          params.agentHandleTimeStart = this.search.value5[0];
          params.agentHandleTimeEnd = this.search.value5[1];
        }
        if(this.search.value6) {
          params.planTimeStart = this.search.value6[0];
          params.planTimeEnd = this.search.value6[1];
        }
        if(this.search.value7) {
          params.realTimeStart = this.search.value7[0];
          params.realTimeEnd = this.search.value7[1];
        }

        let res = await getDisclosurePaperList(params);
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

      handleSizeChange(val) {
        this.size = val;
        this.getList();
      },

      deletes(row) {
        this.$confirm(`此操作将删除"${row.paperName}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await deleteDisclosurePaper({id: row.id});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      addOrEditSubmission(row) {
        this.$store.dispatch('knowledge_submission', row);
        this.show = !this.show;
        this.breadcrumb.push({id: 'edit', name: '交底书编辑'});
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
        // search
        search: {
          value1: '',
          value2: '',
          value3: 0,
          value4: '',
          value5: [],
          value6: [],
          value7: [],
        },

        // select options
        options: {
          value3: [
            { label: '全部', id: 0,},
            { label: '项目启动', id: 1,},
            { label: '交底完成', id: 2,},
            { label: '已委托代理', id: 3,},
            { label: '委托终止', id: 4,},
            { label: '确认代理', id: 5,},
            { label: '缴费中', id: 6,},
            { label: '代理完成', id: 7,},
          ]
        },

        // table
        table: {

        },

        header: [
          { prop: 'paperCode', label: '交底书编码',},
          { prop: 'paperName', label: '交底书名称',},
          { prop: 'patentCount', label: '申请专利数',},
          { prop: 'planTime', label: '计划完成时间',},
          { prop: 'realTime', label: '实际完成时间',},
          { prop: 'agentHandleTime', label: '代理受理时间',},
          { prop: 'status', label: '交底书状态', change: ['','项目启动','交底完成','已委托代理','委托终止','确认代理','缴费中','代理完成']},
          { prop: 'agentCost', label: '代理费',},
          { prop: 'officialFee', label: '官费',},
          { prop: 'oaOddNum', label: 'OA单号',},
          { prop: 'oa_odd_status', label: 'OA单状态',},
          { prop: 'agent', label: '代理方',},
          { prop: 'techSupport', label: '技术支持',},
          { prop: 'charge', label: '交底书负责人',},
          { prop: 'remark', label: '备注',},
        ],

        currentPage: 1,
        size: 10,

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'patent', name: '知识产权管理', path: '/patent',},
          { id: 'Submission', name: '交底书列表', path: '/patent/Submission', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>
