<template>
  <div class="patentFollow posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <AddOrEdit v-if="show" @ifChange="showDefault"></AddOrEdit>

    <div class="pl20 pr20" v-else>
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20">
            <span class="c6">专利编码：</span>
            <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">专利名称：</span>
            <el-input v-model="search.value2" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>专利状态：</span>
            <el-select v-model="search.value3" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.value3" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span>专利类型：</span>
            <el-select v-model="search.value4" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.value4" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">发明人员：</span>
            <el-input v-model="search.value5" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">官方受理时间：</span>
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
            <span class="c6">实际授权时间：</span>
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
          <el-table-column :fixed="h.fixed" v-for="(h,i) in header" :key="h.prop" :label="h.label" :width="i !== header.length-1 ? h.label.length*25 : ''"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
              <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
              <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
              <span v-else-if="h.date === 1">{{scope.row[h.prop]? $format(new Date(scope.row[h.prop]).getTime()).dates : ''}}</span>
              <span v-else>{{scope.row[h.prop]}}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" class="underline" align="center" v-if="$route.meta.button.buttons.includes('编辑')">编辑</el-button>
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
import { getPatentList, deletePatent, } from '../../axios/api.js'
import breadcrumbList from '../../components/breadcrumbList'
import PatentAddOrEdit from '../../components/PatentAddOrEdit'

  export default {
    name: "patentFollow",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': PatentAddOrEdit,
    },
    created() {
      this.getList();
    },
    mounted() {

    },
    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
        };
        if(this.search.value1) {
          params.patentCode = this.search.value1;
        }
        if(this.search.value2) {
          params.patentName = this.search.value2;
        }
        if(this.search.value3) {
          params.status = this.search.value3;
        }
        if(this.search.value4) {
          params.type = this.search.value4;
        }

        if(this.search.value5) {
          params.inventor = this.search.value5;
        }
        if(this.search.value6) {
          params.officialAcceptanceStartTime = this.search.value6[0];
          params.officialAcceptanceEndTime = this.search.value6[1];
        }
        if(this.search.value7) {
          params.realAuthorizeStartTime = this.search.value7[0];
          params.realAuthorizeEndTime = this.search.value7[1];
        }

        let res = await getPatentList(params);
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
        this.$confirm(`此操作将删除"${row.patentName}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await deletePatent({id: row.id});
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

      edit(row) {
        this.$store.dispatch('knowledge_patentFollow', row);
        this.show = !this.show;
        this.breadcrumb.push({id: 'edit', name: '专利编辑'});
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
          value4: 0,
          value5: '',
          value6: [],
          value7: [],
        },

        // select options
        options: {
          status: [
            { label: '全部', id: 0,},
            { label: '项目启动', id: 1,},
            { label: '交底完成', id: 2,},
            { label: '已委托代理', id: 3,},
            { label: '委托终止', id: 4,},
            { label: '确认代理', id: 5,},
            { label: '缴费中', id: 6,},
            { label: '代理完成', id: 7,},
          ],
          value3: [
            { label: '全部', id: 0,},
            { label: '已受理', id: 1,},
            { label: '初审中', id: 2,},
            { label: '实审中', id: 3,},
            { label: '待缴费', id: 4,},
            { label: '已撤回', id: 5,},
            { label: '已驳回', id: 6,},
            { label: '已放弃', id: 7,},
            { label: '已授权', id: 8,},
            { label: '变更中', id: 9,},
            { label: '已失效', id: 10,},
            { label: '已转让', id: 11,},
          ],
          value4: [
            { label: '全部', id: 0,},
            { label: '实用', id: 1,},
            { label: '发明', id: 2,},
            { label: '外观', id: 3,},
            { label: '软件著作权', id: 4,},
          ],
        },

        // table
        table: {},

        header: [
          { prop: 'patentCode', label: '专利编码',},
          { prop: 'patentName', label: '专利名称',},
          { prop: 'patentApplyNum', label: '专利申请号',},
          { prop: 'type', label: '专利类型', change: ['','实用','发明','外观','软件著作权',]},
          { prop: 'paperName', label: '交底书名称', parent:'disclosurePaperDTO'},
          { prop: 'paperCode', label: '交底书编号', parent:'disclosurePaperDTO'},
          { prop: 'officialAcceptanceTime', label: '官方受理时间', date: 1},
          { prop: 'status', label: '专利状态', change: ['','已受理','初审中','实审中','待缴费','已撤回','已驳回','已放弃','已授权','变更中','已失效']},
          { prop: 'whetherChange', label: '是否有变更', change: ['不变更','变更',]},
          { prop: 'authorizationCost', label: '授权缴费',},
          { prop: 'authorizationOaOddNum', label: '授权费OA单号',},
          { prop: 'disclosurePaperDTO.', label: 'OA单状态',},
          { prop: 'planAuthorizeTime', label: '预计授权日期', date: 1},
          { prop: 'realAuthorizeTime', label: '实际授权日期', date: 1},
          { prop: 'patentee', label: '专利权人',},
          { prop: 'inventor', label: '发明人清单', multiProp: ['firstInventor','secondInventor','thirdInventor','otherInventor']},
          { prop: 'project', label: '关联项目',},
          { prop: 'remark', label: '备注',},
        ],

        currentPage: 1,
        size: 10,

        show: false,

        // breadcrumb
        breadcrumb: [
          { id: 'patent', name: '知识产权管理', path: '/patent',},
          { id: 'patentFollow', name: '专利跟踪表', path: '/patent/patentFollow', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>
