<template>
  <div class="costProjectMaterial posr">

    <div class="costProjectMaterials pl20 pr20">
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20 lh28">
            <span>项目名称：<b>{{info.projectName}}</b></span>
          </div>

          <div class="fl mr20 mb20">
            <span class="c6">材料名称：</span>
            <el-input v-model="search.value1" size="mini" clearable style="width:calc(100% - 100px);"></el-input>
          </div>

          <div class="fl mr20 mb20">
            <span>费用类型：</span>
            <el-select v-model="search.value2" placeholder="请选择" size="mini" style="width:calc(100% - 100px);" clearable>
              <el-option v-for="item in options.fundType" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>

          <div class="fl mr20 mb20">
            <span>采购部门：</span>
            <el-select v-model="search.value3" placeholder="请选择" size="mini" style="width:calc(100% - 100px);" clearable>
              <el-option v-for="item in options.dept" :key="item.id" :label="item.pleaseDepartmentName" :value="item.pleaseDepartmentName"></el-option>
            </el-select>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="SearchList()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button type="primary" size="mini" @click="opencostMaterialDialog('')" v-if="$route.meta.button.nextButton.includes('新增')">新增</el-button>
        <!--<el-button type="primary" size="mini" @click="exportExcel" v-if="$route.meta.button.nextButton.includes('导出Excel')">导出Excel</el-button>-->

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
          <column :header="header" @changeStatus="changeStatus"></column>

          <el-table-column fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <span>
                <!--<el-button class="underline f12" @click="opencostMaterialDialog(scope.row)" type="text" align="center" v-if="$route.meta.button.nextButton.includes('编辑')">编辑</el-button>-->
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

      <!-- 新增或修改材料 -->
      <el-dialog :title="Object.keys(costMaterial).length !== 1?'编辑':'新增'" :visible.sync="costMaterialDialogShow" center custom-class="dialogStyle" @close="cancelAdd">
        <el-form :model="costMaterial" label-position="right" size="mini">
          <el-row style="width:100%;line-height:40px;margin:0 auto;">

            <el-col :span="24">
              <el-col :span="12">
                <el-form-item label="采购日期：" label-width="100px">
                  <el-date-picker  clearable style="width:100%;"
                                   v-model="costMaterial.orderDate"
                                   type="datetimerange"
                                   align="right"
                                   format="yyyy-MM-dd"
                                   range-separator="-"
                                   start-placeholder="开始日期"
                                   end-placeholder="结束日期"
                                   :default-time="['00:00:00', '23:59:59']"
                                   size="mini">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="材料名称：" label-width="100px">
                  <el-select v-model="costMaterial.tradeName" filterable remote reserve-keyword placeholder="请输入名称查询材料并添加"
                             :remote-method="searchNames"
                             :loading="loading"
                             size="small"
                             value-key="id"
                             @visible-change="val => {let self = this;if(!val) self.listDown=[];}"
                             style="width:100%;"
                  >
                    <el-option v-for="item in listDown" :key="item.id" :label="item.tradeName" :value="item" :disabled="item.projectName !== null && item.projectName !== ''">
                      <span class="select_color f12 ml20 lh24 dis" style="max-width:960px;overflow-x:auto;">
                        <b class="pr40">{{ item.tradeName}}</b>
                        <b class="cc">采购部门：</b><b>{{ item.dept}}</b>
                        <b class="cc">采购时间：</b><b>{{ item.orderDate}}</b>
                        <b class="cc">材料编码：</b><b>{{ item.partNo}}</b>
                        <b class="cc">采购数量：</b><b>{{ item.purchaseNum}}</b>
                        <b class="cc">规格型号：</b><b>{{ item.specification}}</b>
                        <b class="cc">采购商家：</b><b>{{ item.purchaseAme}}</b>
                        <b class="cc">已关联项目名称：</b><b>{{ item.projectName}}</b>
                      </span>
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-col>

            <el-col :span="8">
              <el-form-item label="费用类型：" label-width="100px">
                <el-select v-model="costMaterial.fundType" placeholder="请选择" size="mini">
                  <el-option v-for="item in options.fundType" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注：" label-width="100px">
                <el-input type="textarea" :rows="3" resize="none" placeholder="请输入备注内容" v-model="costMaterial.ramark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addOrEditcostMaterial">确 定</el-button>
          <el-button @click="costMaterialDialogShow = false" size="mini">取 消</el-button>
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
    getMaterialCostList,
    addMaterialCostInformation,
    editMaterialCostInformation,
    removeMaterialCost,
    downloadProjectProgress,
    getEnterpriseResourcePlanList,
    queryTechnicalCentreDept
  } from '../../axios/api.js'
  import column from '../../components/tableColumn'

  export default {
    name: "costProjectMaterial",
    components: {
      'column': column,
    },
    async created() {
      this.info = this.$store.getters.costProject_edit;
      this.getList();

      let res = await queryTechnicalCentreDept();
      if (res.status === 1) {
        this.options.dept = [...res.msg];
      }
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
          params.tradeName = this.search.value1;
        }
        if(this.search.value2) {
          params.fundType = this.search.value2;
        } else if (this.search.value2 === 0) {
          params.fundType = this.search.value2;
        }
        if(this.search.value3) {
          params.dept = this.search.value3;
        } else if (this.search.value3 === 0) {
          params.dept = this.search.value2;
        }

        let res = await getMaterialCostList(params);
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
          let res = await removeMaterialCost({id: row.id});
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

      // submit costMaterial
      async addOrEditcostMaterial() {
        if (this.costMaterial.tradeName) {
          let params = {
            ...this.costMaterial,
            projectId: this.info.projectId,
            fundId: this.info.id,
          };
          if (!this.costMaterialFlag) {
            params.enterpriseId = this.costMaterial.tradeName.id;
          }
          let res;
          if (this.costMaterialFlag) {
            res = await editMaterialCostInformation(params);
          } else {
            res = await addMaterialCostInformation(params);
          }
          if (res.status === 1) {
            this.costMaterialDialogShow = false;
            if (this.costMaterialFlag) {
              Message({showClose: true, type: 'success', message: '编辑成功！'});
            } else {
              Message({showClose: true, type: 'success', message: '新增成功！'});
            }
            this.getList();
          }
        } else {
          Message({showClose: true, type: 'warning', message: '请完整填写所有信息！'});
        }
      },

      // open costMaterial dialog
      opencostMaterialDialog(row) {
        this.costMaterialDialogShow = true;
        if (row) {
          this.costMaterialFlag = 1;
          this.costMaterial = row;
        } else {
          this.costMaterialFlag = 0;
          this.costMaterial = {
            fundType: 0,
          };
        }
      },

      // 关闭弹框
      cancelAdd() {
        this.costMaterialDialogShow = false;
      },

      // 根据条件查询客户下拉列表
      searchNames(query) {
        let self = this;
        self.listDown = [];
        let costM = this.costMaterial.orderDate;
        let params = {
          tradeName: query,
        };
        // 交货日期
        if(costM) {
          params.orderDateStart = costM[0];
          params.orderDateEnd = costM[1];
        }
        if (query) {
          self.loading = true;
          setTimeout(async () => {
            let res = await getEnterpriseResourcePlanList(params);
            if (res.status === 1) {
              self.listDown = res.msg;
              self.loading = false;
            }
          }, 200);
        } else {
          self.listDown = [];
        }
      },

      // change the value of select
      async changeStatus(obj, prop) {
        this.costMaterialFlag = 1;
        this.costMaterial = obj;
        this.addOrEditcostMaterial();
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
          { prop: 'tradeName', label: '材料名称',},

          { prop: 'fundType', label: '费用类型', select: [ { id: 0, label: '资助'}, { id: 1, label: '自筹'},]},

          { prop: 'orderDate', label: '采购时间',},
          { prop: 'purchaseNum', label: '采购数量', eachWidth: 20,},
          { prop: 'purchaseUnit', label: '单位',},
          { prop: 'price', label: '单价', eachWidth: 30,},
          { prop: 'priceTotalTax', label: '总金额', eachWidth: 30,},
          { prop: 'numberTimes', label: 'ERP单号+批次',},
          { prop: 'dept', label: '采购部门',},
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
          dept: [

          ],
          fundType: [
            { id: 0, name: '资助'},
            { id: 1, name: '自筹'}
          ],
        },

        show: false,
        info: {},

        // 材料名称下拉清单
        listDown: [],
        loading: false, //下拉列表请求后提示加载中

        // dialogs
        costMaterialDialogShow: false,
        costMaterial: {},
        costMaterialFlag: 0,

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

