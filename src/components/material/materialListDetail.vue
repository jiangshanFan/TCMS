<template>
  <div class="costProjectOthers posr">

    <div class="costProjectOtherss pl20 pr20">
      <!--  search -->
      <div class="section-search mb20 mt20">
        <el-row>
          <div class="fl mr20 mb20 lh28">
            <span>归属部门：<b>{{options.attributionDepartment[info.attributionDepartment]}}</b></span>
          </div>

          <div class="fl mr20 mb20 lh28">
            <span>材料名称：<b>{{info.materialName}}</b></span>
          </div>

          <div class="fl mr20 mb20">
            <span>出入库方式：</span>
            <el-select v-model="search.value1" placeholder="请选择" size="mini" style="width:calc(100% - 100px);" clearable>
              <el-option v-for="item in options.inOutType" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>

          <el-button type="primary" size="mini" icon="el-icon-search" class="fl" @click="SearchList()"></el-button>
        </el-row>
        <hr>
      </div>

      <!-- content -->
      <div class="mt20">
        <!-- 添加 -->
        <el-button type="primary" size="mini" @click="openmaterialListDetailDialog('')">新增</el-button>

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
                <el-button class="underline f12" @click="openmaterialListDetailDialog(scope.row)" type="text" align="center" v-if="scope.row.inOutType !== 1">编辑</el-button>
                <el-button class="underline f12" @click="deletes(scope.row)" type="text" align="center" v-if="scope.row.inOutType !== 1">删除</el-button>
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

      <!-- 新增经费或预算设置 -->
      <el-dialog :title="Object.keys(materialListDetail).length?'编辑':'新增'" :visible.sync="materialListDetailDialogShow" center custom-class="dialogStyle" @close="cancelAdd">
        <el-form :model="materialListDetail" label-position="right" size="mini">
          <el-row style="width:100%;line-height:60px;margin:0 auto;">

            <el-col :span="12" class="mb20">
              <span>材料名称：<b>{{materialListDetail.materialName}}</b></span>
            </el-col>

            <el-col :span="12" class="mb20">
              <span>库存数量：<b>{{materialListDetail.remainingQuantity}}</b></span>
            </el-col>

            <el-col :span="12" v-if="materialListDetail.inOutType === 2">
              <el-form-item label="项目名称：" label-width="120px">
                <el-select v-model="materialListDetail.projectName" placeholder="请选择" size="mini" style="width:100%;">
                  <el-option v-for="item in options.projectName" :key="item.id" :label="item.projectName" :value="item.projectName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12" v-else>
              <el-form-item :label="materialListDetail.inOutType === 3? '借出部门：': '归还部门：'" label-width="120px">
                <el-select v-model="materialListDetail.inOutDepartment" placeholder="请选择" size="mini" style="width:100%;">
                  <el-option v-for="item in options.inOutDepartment" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="出入库方式：" label-width="120px">
                <el-select v-model="materialListDetail.inOutType" placeholder="请选择" size="mini" style="width:100%;">
                  <el-option v-for="item in options.inOutTypeOne" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="使用数量：" label-width="120px">
                <el-input placeholder="请输入使用数量" v-model="materialListDetail.intOutNum"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="备注：" label-width="120px">
                <el-input type="textarea" :rows="3" resize="none" placeholder="请输入备注内容" v-model="materialListDetail.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" size="mini" @click="addOrEditmaterialListDetail">确 定</el-button>
          <el-button @click="materialListDetailDialogShow = false" size="mini">取 消</el-button>
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
    getMaterialManageInformation,
    addMaterialManageInformation,
    editMaterialManageInformation,
    deleteMaterialManageInformation,
    downloadProjectProgress,
    queryProjectProjectName
  } from '../../axios/api.js'
  import column from '../../components/tableColumn'

  export default {
    name: "costProjectOthers",
    components: {
      'column': column,
    },
    created() {
      this.info = this.$store.getters.materialList_edit;
    },
    async mounted() {
      let res = await queryProjectProjectName();
      if (res.status === 1) {
        this.options.projectName = [...res.msg];
      }
      this.getList();
    },

    methods: {
      // get dataList of table
      async getList() {
        let params = {
          page: this.currentPage,
          size: this.size,
          attributionDepartment: this.info.attributionDepartment,
          materialName: this.info.materialName,
        };
        if(this.search.value1) {
          params.inOutType = this.search.value1;
        }

        let res = await getMaterialManageInformation(params);
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
        this.$confirm(`此操作将删除此项, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          let res = await deleteMaterialManageInformation({id: row.id});
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

      // submit materialListDetail
      async addOrEditmaterialListDetail() {
        if (this.materialListDetail.projectName && this.materialListDetail.inOutType && this.materialListDetail.intOutNum) {
          let params = {
            ...this.materialListDetail,
          };
          let res;
          if (this.materialListDetailFlag) {
            res = await editMaterialManageInformation(params);
          } else {
            res = await addMaterialManageInformation(params);
          }
          if (res.status === 1) {
            this.materialListDetailDialogShow = false;
            if (this.materialListDetailFlag) {
              Message({showClose: true, type: 'success', message: '编辑详情成功！'});
            } else {
              Message({showClose: true, type: 'success', message: '新增详情成功！'});
            }
            this.getList();
          }
        } else {
          Message({showClose: true, type: 'warning', message: '项目名称，出入库方式，使用数量为必填项！'});
        }
      },

      // open materialListDetail dialog
      openmaterialListDetailDialog(row) {
        this.materialListDetailDialogShow = true;
        if (row) {
          this.materialListDetailFlag = 1;
          this.materialListDetail = row;
        } else {
          this.materialListDetailFlag = 0;
          this.materialListDetail = {
            materialName: this.info.materialName,
            inOutType: 2,
          };
        }
      },

      // 关闭弹框
      cancelAdd() {
        this.materialListDetailDialogShow = false;
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
          { prop: 'inOutType', label: '出入库方式', eachWidth: 50, change: ['', '采购', '项目自用', '外借', '归还',]},

          // { prop: 'fundType', label: '费用类型', select: [ { id: 0, label: '资助'}, { id: 1, label: '自筹'},]},

          { prop: 'intOutNum', label: '出入库数量', eachWidth: 40,},
          { prop: 'remainingQuantity', label: '库存剩余数量', eachWidth: 30,},
          { prop: 'inOutDepartment', label: '借出/归还部门', change: ['', '研发部', 'IME部', '先进制造技术研究所', '数字化部', '开发部', '新型复合材料研究工程实验室', '非技术中心部门']},
          { prop: 'createTime', label: '时间', eachWidth: 30,},
          { prop: 'numberTimes', label: 'ERP单号+批次', eachWidth: 30,},
          { prop: 'projectName', label: '项目名称', eachWidth: 30,},
          { prop: 'unit', label: '单位', eachWidth: 30,},
          { prop: 'unitPrice', label: '单价', eachWidth: 30,},
          { prop: 'totalMoney', label: '总金额', eachWidth: 30,},

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
          inOutType: [
            { id: 1, name: '采购'},
            { id: 2, name: '项目自用'},
            { id: 3, name: '外借'},
            { id: 4, name: '归还'}
          ],
          inOutTypeOne: [
            { id: 2, name: '项目自用'},
            { id: 3, name: '外借'},
            { id: 4, name: '归还'}
          ],
          inOutDepartment: [
            { id: 1, name: '研发部'},
            { id: 2, name: 'IME部'},
            { id: 3, name: '先进制造技术研究所'},
            { id: 4, name: '数字化部'},
            { id: 5, name: '开发部'},
            { id: 6, name: '新型复合材料研究工程实验室'},
            { id: 7, name: '非技术中心部门'},
          ],
          attributionDepartment : [
            '',
            '研发部',
            'IME部',
            '先进制造技术研究所',
            '数字化部',
            '开发部',
            '新型复合材料研究工程实验室',
            '非技术中心部门'
          ]
        },

        show: false,
        info: {},

        // dialogs
        materialListDetailDialogShow: false,
        materialListDetail: {},
        materialListDetailFlag: 0,

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

