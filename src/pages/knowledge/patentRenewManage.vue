<template>
  <div class="patentRenewManage posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <div class="pl20 pr20">
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
            <span>专利类型：</span>
            <el-select v-model="search.value3" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.value3" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span>缴费状态：</span>
            <el-select v-model="search.value4" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.value4" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">发明人员：</span>
            <el-input v-model="search.value5" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>专利权人：</span>
            <el-select v-model="search.value6" placeholder="请选择" size="mini" style="width:calc(100% - 100px);">
              <el-option v-for="item in options.value6" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">最迟续费时间：</span>
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

          <div class="fl mr20 mb20">
            <span class="c6">OA单提交时间：</span>
            <el-date-picker  clearable style="width:calc(100% - 105px);"
                             v-model="search.value8"
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
        <!-- 导出 -->
        <el-button type="primary" @click="exportExcel" v-if="$route.meta.button.buttons.includes('导出Excel')">导出Excel</el-button>
        <!-- 表格数据 -->
        <el-table
          :data="table.content"
          stripe
          border
          size="small"
          style="width: 100%;margin-top:10px;"
          header-cell-class-name="header_cell table_header_shadow"
          :row-class-name="tableRowClassName"
          tooltip-effect="light">

          <el-table-column fixed type="index" width="60" label="序号" align="center" :index="(index) => this.$indexS(index, currentPage, size)"></el-table-column>

          <!-- circle -->
          <el-table-column :fixed="h.fixed" v-for="h in header" :key="h.prop" :label="h.label" :width="h.width !=='unset' ?(h.eachWidth? h.label.length*h.eachWidth: h.label.length*25) : ''"  align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
              <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
              <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
              <span v-else>{{scope.row[h.prop]}}</span>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作" width="200" align="center">
            <template slot-scope="scope">
              <el-button @click="edit(scope.row)" type="text" class="underline" align="center" v-if="scope.row.renewStatus === 1 && $route.meta.button.buttons.includes('填写续费信息')">填写续费信息</el-button>
              <el-button @click="details(scope.row)" type="text" class="underline" align="center" v-if="$route.meta.button.buttons.includes('缴费记录')">缴费记录</el-button>
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

      <!-- dialogs -->
      <!-- renewEdit -->
      <el-dialog title="填写续费信息" :visible.sync="renewEditVisible" center custom-class="dialogStyle" @close="cancelAdd">
        <el-form :model="renewEdit" label-position="right" label-width="120px" size="mini">
          <el-row style="line-height:40px;">
            <el-row :gutter="10" >
              <el-col :span="12">
                <el-form-item label="专利申请号：">
                  <span>{{renewEdit.patentApplyNum}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="专利名称：">
                  <span>{{renewEdit.patentName}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="当前续费次数：">
                  <span>{{renewEdit.renewCount}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="最迟续费时间：">
                  <span>{{renewEdit.latestRenewTime}}</span>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="预计续费金额：">
                  <span>{{renewEdit.renewAmount}}</span>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="10" >
              <el-col :span="12">
                <el-form-item label="OA单提交时间：">
                  <el-date-picker v-model="renewEdit.oaOddSubmitTime" type="datetime" placeholder="选择日期时间" style="width:100%;"></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="OA单申请费用：">
                  <el-input v-model="renewEdit.oaApplyCost" autocomplete="off" style="width:100%;"></el-input>
                </el-form-item>
              </el-col>

              <el-col :span="12">
                <el-form-item label="OA单号：">
                  <el-input v-model="renewEdit.oaOddNum" autocomplete="off" style="width:100%;"></el-input>
                </el-form-item>
              </el-col>
            </el-row>

            <el-col :span="24">
              <el-form-item label="备注：">
                <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="renewEdit.remark"></el-input>
              </el-form-item>
            </el-col>

          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="add(renewEdit)" size="mini">确 定</el-button>
          <el-button @click="dialogFormVisible = false" size="mini">取 消</el-button>
        </div>
      </el-dialog>
      <!-- renewList-->
      <el-dialog title="缴费记录" :visible.sync="renewListVisible" center custom-class="dialogStyle" @close="cancelAdd">
        <el-table class="mb20" :data="renewList" max-height="300" size="small" border style="width: 100%;" header-cell-class-name="header_cell">
          <el-table-column type="index" width="100" label="序号"></el-table-column>
          <el-table-column prop="oaOddSubmitTime" label="OA单提交时间" width="180"></el-table-column>
          <el-table-column prop="oaApplyCost" label="申请费用"></el-table-column>
        </el-table>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { getPatentRenewManageList, exportPatentRenewManageList, getRenewInfoList, insertRenewInfo} from '../../axios/api.js'
  import breadcrumbList from '../../components/breadcrumbList'
  import Qs from "qs";  /** 需要进行引入才可以使用 */

  export default {
    name: "patentRenewManage",
    components: {
      'breadcrumbList': breadcrumbList,
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
          params.type = this.search.value3;
        }
        if(this.search.value4) {
          params.renewStatus = this.search.value4;
        }

        if(this.search.value5) {
          params.inventor = this.search.value5;
        }
        if(this.search.value6) {
          params.patentee = this.search.value6;
        }
        if(this.search.value7) {
          params.latestRenewStartTime = this.search.value7[0];
          params.latestRenewEndTime = this.search.value7[1];
        }
        if(this.search.value8) {
          params.oaOddSubmitStartTime = this.search.value8[0];
          params.oaOddSubmitEndTime = this.search.value8[1];
        }

        let res = await getPatentRenewManageList(params);
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

      // 点击填写编辑按钮打开弹框
      edit(row) {
        this.renewEditVisible = true;
        this.renewEdit = row;
      },

      async details(row) {
        this.renewListVisible = true;
        let res = await getRenewInfoList({pId: row.id,});
        if (res.status === 1) {
          console.log(res.msg);
          this.renewList = res.msg;
        }
      },

      // 点击确定按钮新增续费信息
      add(form) {
        let pid = form.id;
        delete form.id;  // =========================== 删除对象的某个属性
        this.$confirm(`此操作将新增续费信息,请确认信息无误, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await insertRenewInfo({...form, pid: pid});
          if (res.status === 1) {
            Message({showClose: true, type: 'success', message: '新增续费信息成功'});
            this.renewEditVisible = false;
            this.getList();
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消提交'
          });
        });
      },

      // 导出Excel
      async exportExcel() {
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
          params.type = this.search.value3;
        }
        if(this.search.value4) {
          params.renewStatus = this.search.value4;
        }

        if(this.search.value5) {
          params.inventor = this.search.value5;
        }
        if(this.search.value6) {
          params.patentee = this.search.value6;
        }
        if(this.search.value7) {
          params.latestRenewStartTime = this.search.value7[0];
          params.latestRenewEndTime = this.search.value7[1];
        }
        if(this.search.value8) {
          params.oaOddSubmitStartTime = this.search.value8[0];
          params.oaOddSubmitEndTime = this.search.value8[1];
        }
        let res = await exportPatentRenewManageList(params);
      },

      // 关闭弹框
      cancelAdd() {
        this.renewEdit = {};
        this.renewList = [];
        this.renewEditVisible = false;
        this.renewListVisible = false;
      },

      // 待续费状态变色处理
      tableRowClassName({row, rowIndex}) {
        if (row.renewStatus === 1) {
          // return 'warning-row';
        }
        return '';
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
          value6: '',
          value7: [],
          value8: [],
        },

        // select options
        options: {
          value6: [
            { label: '深圳银宝山新', id: 1,},
            { label: '天津银宝山新', id: 2,},
            { label: '惠州银宝山新', id: 3,},
            { label: '长沙银宝山新', id: 4,},
            { label: '深圳白狐', id: 5,},
            { label: '广州银宝山新', id: 6,},
            { label: '广东银宝山新', id: 7,},
            { label: '博慧热流道', id: 8,},
            { label: '武汉银宝山新', id: 9,},
            { label: '南通银宝山新', id: 10,},
          ],
          value3: [
            { label: '全部', id: 0,},
            { label: '实用', id: 1,},
            { label: '发明', id: 2,},
            { label: '外观', id: 3,},
            { label: '软件著作权', id: 4,},
          ],
          value4: [
            { label: '全部', id: 0,},
            { label: '待续费', id: 1,},
            { label: '已续费', id: 2,},
            { label: '停止续费', id: 3,},
          ],
        },

        // table
        table: {},

        header: [
          { prop: 'patentApplyNum', label: '专利申请号', eachWidth: 40},
          { prop: 'patentName', label: '专利名称',},
          { prop: 'renewCount', label: '已续费年限',},
          { prop: 'type', label: '专利类型', change: ['','实用','发明','外观','软件著作权',]},
          { prop: 'officialAcceptanceTime', label: '官方受理时间',},
          { prop: 'realAuthorizeTime', label: '授权日期',},
          { prop: 'patentValidity', label: '专利权期限',},
          { prop: 'gainWay', label: '取得方式', change: ['','原始取得','归属转让','授权使用',]},
          { prop: 'patentee', label: '专利权人',},
          { prop: 'inventor', label: '发明人清单', multiProp: ['firstInventor','secondInventor','thirdInventor','otherInventor']},
          { prop: 'renewStatus', label: '缴费状态', change: ['','待续费','已续费','停止续费',]},
          { prop: 'latestRenewTime', label: '最迟续费时间',},
          { prop: 'renewAmount', label: '预计续费金额',},
          { prop: 'oaOddSubmitTime', label: 'OA单提交时间',},
          { prop: 'oaApplyCost', label: 'OA申请实际费用',},
          { prop: 'oaOddNum', label: '续费OA单号',},
          { prop: 'oaStatus', label: 'OA单状态',},
          { prop: 'remark', label: '备注',},
        ],

        currentPage: 1,
        size: 10,

        // 详情内容等必须通过当前页面才能访问的内容
        show: false,

        // dialog visible
        renewEditVisible: false,
        renewListVisible: false,

        // dialog form
        renewEdit: {},
        renewList: [],

        // breadcrumb
        breadcrumb: [
          { id: 'patent', name: '知识产权管理', path: '/patent',},
          { id: 'patentRenewManage', name: '专利续费管理', path: '/patent/patentRenewManage',},
        ]
      }
    },
  }
</script>

<style lang="scss">
  .el-table .warning-row {
    background: yellow;
  }
</style>
