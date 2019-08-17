<template>
  <div class="costProjectOthers posr">

    <div class="costProjectOtherss pl20 pr20">
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20 lh28">
            <span>项目名称：<b>{{info.projectName}}</b></span>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">主题：</span>
            <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>费用类型：</span>
            <el-select v-model="search.value2" placeholder="请选择" size="mini" style="width:calc(100% - 100px);" clearable>
              <el-option v-for="item in options.fundType" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="SearchList()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button type="primary" size="mini" @click="opencostOtherDialog('')" v-if="$route.meta.button.nextButton.includes('新增')">新增</el-button>
        <el-button type="primary" size="mini" @click="exportExcel" v-if="$route.meta.button.nextButton.includes('导出Excel')">导出Excel</el-button>

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
                <el-button class="underline f12" @click="opencostOtherDialog(scope.row)" type="text" align="center" v-if="$route.meta.button.nextButton.includes('编辑')">编辑</el-button>
                <el-button class="underline f12" @click="deletes(scope.row)" type="text" align="center" v-if="$route.meta.button.nextButton.includes('删除')">删除</el-button>
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

      <!-- 新增或编辑其他类别 -->
      <el-dialog :title="Object.keys(costOther).length?'编辑':'新增'" :visible.sync="costOtherDialogShow" center custom-class="dialogStyle" @close="cancelAdd">
        <el-form :model="costOther" label-position="right" size="mini">
          <el-row style="width:100%;line-height:40px;margin:0 auto;">

            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="费用报销单号：" label-width="100px">
                  <el-select v-model="costOther.oddNumbers" filterable remote reserve-keyword placeholder="请输入名称查询费用报销单号并添加"
                             :remote-method="searchNames"
                             :loading="loading"
                             size="small"
                             value-key="propertyNum"
                             @visible-change="val => {let self = this;if(!val) self.listDown=[];}"
                             style="width:100%;"
                  >
                    <el-option v-for="item in listDown" :key="item.id" :label="item.oddNumbers" :value="item"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>

            <el-col :span="8">
              <el-form-item label="费用类型：" label-width="120px">
                <el-select v-model="costOther.fundType" placeholder="请选择" size="mini">
                  <el-option v-for="item in options.fundType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注：" label-width="120px">
                <el-input type="textarea" :rows="3" resize="none" placeholder="请输入备注内容" v-model="costOther.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addOrEditcostOther">确 定</el-button>
          <el-button @click="costOtherDialogShow = false" size="mini">取 消</el-button>
        </div>
      </el-dialog>
    </div>

  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import {
    getOtherCategoriesInformationList,
    addOtherCategories,
    editOtherCategories,
    removeOtherCategories,
    downloadProjectProgress,
    getMaterialCostInformation
  } from '../../axios/api.js'
  import column from '../../components/tableColumn'

  export default {
    name: "costProjectOthers",
    components: {
      'column': column,
    },
    async created() {
      this.info = this.$store.getters.costProject_edit;
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
          projectId: this.info.projectId,
          fundId: this.info.id,
        };
        if(this.search.value1) {
          params.themeTitle = this.search.value1;
        }
        if(this.search.value2) {
          params.fundType = this.search.value2;
        } else if (this.search.value2 === 0) {
          params.fundType = this.search.value2;
        }

        let res = await getOtherCategoriesInformationList(params);
        if(res.status === 1) {
          this.table = res.msg;
        }
      },

      // search
      SearchList() {
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
        this.$confirm(`此操作将删除"${row.tradeName}", 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await removeOtherCategories({id: row.id});
          if(res.status === 1) {
            this.getList();
            Message({showClose: true, type: 'success', message: '删除成功！'});
          }
        }).catch(() => {
          this.$message({type: 'info', message: '已取消删除'});
        });
      },

      /*addOrEdit(row) {
        if (!row) {
          this.$store.dispatch('project_progress', {projectId: this.search.value1});
          this.breadcrumb.push({id: 'add', name: '新增'});
        } else {
          this.$store.dispatch('project_progress', row);
          this.breadcrumb.push({id: 'edit', name: '编辑'});
        }
        this.show = !this.show;
      },*/

      // download Excel
      async exportExcel() {
        let res = await downloadProjectProgress({projectId: this.search.value1});
      },

      // submit costOther
      async addOrEditcostOther() {
        if (this.costOther.tuitionInformation && this.costOther.amountPatronage && this.costOther.raiseMount) {
          let params = {
            ...this.costOther,
            projectId: this.search.value1,
          };
          let res;
          if (this.costOtherFlag) {
            res = await editOtherCategories(params);
          } else {
            res = await addOtherCategories(params);
          }
          if (res.status === 1) {
            this.costOtherDialogShow = false;
            if (this.costOtherFlag) {
              Message({showClose: true, type: 'success', message: '预算设置成功！'});
            } else {
              Message({showClose: true, type: 'success', message: '新增经费类别成功！'});
            }
            this.getList();
          }
        } else {
          Message({showClose: true, type: 'warning', message: '请完整填写所有信息！'});
        }
      },

      // open costOther dialog
      opencostOtherDialog(row) {
        this.costOtherDialogShow = true;
        if (row) {
          this.costOtherFlag = 1;
          this.costOther = row;
        } else {
          this.costOtherFlag = 0;
          this.costOther = {
            fundType: 0,
          };
        }
      },

      // 关闭弹框
      cancelAdd() {
        this.costOtherDialogShow = false;
      },

      // 根据条件查询客户下拉列表
      searchNames(query) {
        let self = this;
        self.listDown = [];
        if (query) {
          self.loading = true;
          setTimeout(async () => {
            let res = await getMaterialCostInformation({tradeName: query,});
            if (res.status === 1) {
              self.listDown = res.msg;
              self.loading = false;
            }
          }, 200);
        } else {
          self.listDown = [];
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

        header: [
          { prop: 'themeTitle', label: '主题', eachWidth: 50,},

          { prop: 'fundType', label: '费用类型', select: [ { id: 0, label: '资助'}, { id: 1, label: '自筹'},]},

          { prop: 'sumMoney', label: '金额', eachWidth: 40,},
          { prop: 'oddNumbers', label: 'OA单号', eachWidth: 30,},
          { prop: 'documentsState', label: 'OA单状态',},
          { prop: 'assessingOfficer', label: '最新审批人', eachWidth: 30,},

          { prop: 'ramark', label: '备注', width: 'unset'},
        ],

        // search
        search: {
          // value1: '',
          // value2: 0,
          // value3: 0,
        },
        options: {
          projectName: [],

          fundType: [
            { id: 0, name: '资助'},
            { id: 1, name: '自筹'}
          ],
        },

        show: false,
        info: {},

        // dialogs
        costOtherDialogShow: false,
        costOther: {},
        costOtherFlag: 0,

        // breadcrumb
        breadcrumb: [
          { id: 'cost', name: '经费预算', path: '/cost',},
          { id: 'costProject', name: '项目经费预算管理', path: '/cost/costProject', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>

