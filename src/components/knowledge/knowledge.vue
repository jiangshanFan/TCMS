<template>
  <div class="pl20 pr20">
    <h1 style="font-size:20px;" :data="zlInfo">专利编号：{{zlInfo.patentCode}}</h1>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="专利基本信息" name="first">
        <el-row :gutter="20">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">专利名称：</span>
              <span>{{zlInfo.patentName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">专利申请号：</span>
              <span>{{zlInfo.patentApplyNum}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">专利状态：</span>
              <span
                v-for="(item,index) in options"
                :key="index"
              >{{item.id===zlInfo.status?item.label:""}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">专利类型：</span>
              <span
                v-for="(item,index) in type"
                :key="index"
              >{{item.id===zlInfo.type?item.label:""}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">交底书名称：</span>
              <span>{{zlInfo.disclosurePaperDTO.paperName}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">交底书编码：</span>
              <span>{{zlInfo.disclosurePaperDTO.paperCode}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">专利权人：</span>
              <span>{{zlInfo.patentee}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">官方受理时间：</span>
              <span
                v-if="zlInfo.officialAcceptanceTime!==null"
              >{{$format(new Date(zlInfo.officialAcceptanceTime).getTime()).dates}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">实际授权时间：</span>
              <span
                v-if="zlInfo.realAuthorizeTime!==null"
              >{{$format(new Date(zlInfo.realAuthorizeTime).getTime()).dates}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">预计授权时间：</span>
              <span
                v-if="zlInfo.planAuthorizeTime!==null"
              >{{$format(new Date(zlInfo.planAuthorizeTime).getTime()).dates}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">获取方式：</span>
              <span
                v-for="(item,index) in gainWay"
                :key="index"
              >{{item.id===zlInfo.gainWay?item.label:""}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">第一发明人：</span>
              <span>{{zlInfo.firstInventor}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">第二发明人：</span>
              <span>{{zlInfo.secondInventor}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">第三发明人：</span>
              <span>{{zlInfo.thirdInventor}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">其他发明人：</span>
              <span>{{zlInfo.otherInventor}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">印花税：</span>
              <span v-if="zlInfo.stampDuty!==undefined">{{zlInfo.stampDuty/100}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">年费优惠后：</span>
              <span>{{zlInfo.discount*100}}%</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">最新续费年份：</span>
              <span>{{zlInfo.renewYear}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">授权费OA单号：</span>
              <span>{{zlInfo.authorizationOaOddNum}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">授权OA单状态：</span>
              <span>{{zlInfo.authorizationOaStatus}}</span>
            </div>
          </el-col>
          <el-col :span="8">
            <div :data="zlInfo">
              <span class="col_style">是否有变更：</span>
              <span>{{zlInfo.whetherChange===0?'否':'是'}}</span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" class="row_style">
        </el-row>
        <el-row :gutter="20" class="row_style">
          <el-col :span="16">
            <div :data="zlInfo">
              <span class="col_style">备注：</span>
              <span>{{zlInfo.remark}}</span>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="专利续费详情" name="second">
        <div>
          <div>
            <template>
              <el-table
                :data="tableDataZlMoney.msg"
                border
                header-cell-class-name="header_cell table_header_shadow"
                size="small"
                stripe
              >
                <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
                <el-table-column prop="latestRenewTime" label="最迟续费时间" align="center">
                  <template slot-scope="scope">
                    <span>{{$format(new Date(scope.row.latestRenewTime).getTime()).dates}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="renewAmount" label="续费金额" align="center"></el-table-column>
                <el-table-column prop="id" label="续费状态" align="center">
                  <template slot-scope="scope">
                    <span>{{scope.row.id===null?"待续费":"已续费"}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="oaOddNum" label="OA单号" align="center"></el-table-column>
                <el-table-column prop="oaStatus" label="OA单状态" align="center"></el-table-column>
                <el-table-column
                  :show-overflow-tooltip="true"
                  prop="remark"
                  label="续费备注"
                  align="center"
                ></el-table-column>
              </el-table>
            </template>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="专利变更记录" name="third">
        <!-- <el-button type="primary" size="mini" @click="dialogVisible = true">新增变更记录</el-button> -->
        <template>
          <el-table
            :data="tableDataZlChange.content"
            style="width: 100%;"
            border
            header-cell-class-name="header_cell table_header_shadow"
            size="small"
            stripe
          >
            <el-table-column type="index" label="序号" align="center" width="50"></el-table-column>
            <el-table-column
              prop="changerUserName"
              label="提交人"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="updateTime"
              label="提交时间"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.createTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="oldPatentee"
              width="110"
              label="变更前专利权人"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="newPatentee"
              width="110"
              label="变更后专利权人"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="changeCost"
              label="变更费用"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{scope.row.changeCost/100}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="changeOaOddNum"
              label="OA单号"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="oaStatus"
              label="OA单状态"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column
              prop="changeConfirmTime"
              label="官方确认时间"
              width="130"
              align="center"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.changeConfirmTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="changeRemarks"
              label="变更备注"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column width="90" label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="primary" size="mini" align="center" @click="edit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <!-- 弹出新增框 -->
        <el-dialog title="修改变更记录" :visible.sync="dialogVisible" width="60%">
          <el-form :model="form" label-width="130px" :rules="rules">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="变更前专利权人：">
                  <span>{{changePeoBefore}}</span>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="变更后专利权人：">
                  <span>{{changePeoAfter}}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="官方确认时间：">
                  <el-date-picker
                    type="date"
                    placeholder="选择日期"
                    v-model="form.changeConfirmTime"
                    style="width: 100%;"
                    format="yyyy-MM-dd"
                    range-separator="-"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="变更费用：" prop="changeCost">
                  <el-input v-model="form.changeCost"></el-input>
                  <template v-slot:error>
                    <span></span>
                  </template>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="OA单号：">
                  <el-input v-model="form.changeOaOddNum" maxlength="15"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="24">
                <el-form-item label="备注：">
                  <el-input
                    maxlength="300"
                    v-model="form.changeRemarks"
                    :rows="2"
                    :show-word-limit="true"
                    type="textarea"
                    resize="none"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <div slot="footer" style="text-align:center;" class="dialog-footer">
            <el-button size="mini" type="primary" @click="subform">提交</el-button>
            <el-button size="mini" @click="dialogVisible = false">返回</el-button>
          </div>
        </el-dialog>
        <el-pagination
          v-if="tableDataZlChange.totalCount"
          @size-change="handleSizeChangeForChange"
          @current-change="handleCurrentChangeForChange"
          :current-page.sync="currentPageForChange"
          :page-sizes="[5, 10, 15, 20,50]"
          :page-size="sizeForChange"
          layout="total,sizes, prev, pager, next"
          :total="tableDataZlChange.totalCount"
          style="margin-top:30px; float:right;"
        ></el-pagination>
      </el-tab-pane>
      <el-tab-pane label="专利文档详情" name="fourth">
        <!-- 上传组件 -->
        <el-upload
          class="upload-demo"
          action="/api/fileManageInformation/fileManage/addUploadManyFileEach"
          :headers="headers"
          :data="dataFile"
          name="file"
          multiple
          ref="upload_content"
          :on-exceed="maxExceed"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-error="handleError"
          :on-change="handleChange"
          :file-list="fileList"
        >
          <el-button type="primary" size="mini">上传附件</el-button>
        </el-upload>
        <template>
          <el-table
            :data="tableDataZlDetail.content"
            style="width: 100%; margin-top:15px;"
            border
            header-cell-class-name="header_cell table_header_shadow"
            size="small"
            stripe
          >
            <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
            <el-table-column
              prop="fileName"
              label="附件名称"
              align="center"
              :show-overflow-tooltip="true"
            ></el-table-column>
            <el-table-column prop="fileSize" label="大小" align="center"></el-table-column>
            <el-table-column prop="userName" label="创建人" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建日期" align="center">
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.createTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  @click="downloads(scope.row)"
                  type="primary"
                  size="mini"
                  align="center"
                >下载</el-button>
                <el-button @click="deletes(scope.row)" type="primary" size="mini" align="center">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <el-pagination
          v-if="tableDataZlDetail.totalCount"
          @size-change="handleSizeChangeForDetail"
          @current-change="handleCurrentChangeForDetail"
          :current-page="currentPageForDetail"
          :page-sizes="[5, 10, 15, 20,50]"
          :page-size="sizeForDetail"
          layout="total, sizes, prev, pager, next"
          :total="tableDataZlDetail.totalCount"
          style="margin-top:30px; float:right;"
        ></el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
/* eslint-disable */
import {
  getFileList,
  removeFileEnclosureInformation,
  getPatentChangeInfoList,
  insertPatentChangeInfo,
  updatePatentChangeInfo,
  getRenewInfoList
} from "../../axios/api.js";
export default {
  name: "knowledge",
  mounted() {
    // 专利详情页面
    let info = this.$store.getters.knowledge_patentFollow;
    if (Object.keys(info).length) {
      this.zlInfo = Object.assign({}, info);
      if (!this.zlInfo.disclosurePaperDTO) {
        this.zlInfo.disclosurePaperDTO = {};
      }
      this.choose = 1;
    } else {
      this.choose = 0;
    }
    this.getFileListForZl();
    this.dataFile.id = this.zlInfo.id;
    this.pid = this.zlInfo.id;
    this.getPatentChangeInfo();
    this.getRenewInfo();
  },
  methods: {
    // 专利缴费详情
    async getRenewInfo() {
      let res = await getRenewInfoList({
        pId: this.zlInfo.id
      });
      if (res.status === 1) {
        this.tableDataZlMoney = res;
      }
    },
    // 专利变更记录
    async getPatentChangeInfo() {
      let res = await getPatentChangeInfoList({
        pid: this.zlInfo.id,
        page: this.currentPageForChange,
        size: this.sizeForChange
      });
      if (res.status === 1) {
        this.tableDataZlChange = res.msg;
      }
    },
    //变更记录弹出框点击方法
    edit(row) {
      this.changePeoBefore = row.oldPatentee;
      this.changePeoAfter = row.newPatentee;
      this.pid = row.id;
      this.dialogVisible = true;
      this.form.changeCost = row.changeCost / 100;
      this.form.changeOaOddNum = row.changeOaOddNum;
      this.form.changeRemarks = row.changeRemarks;
    },
    async subform() {
      let res = await updatePatentChangeInfo({
        changeConfirmTime: this.form.changeConfirmTime,
        changeCost: this.form.changeCost * 100,
        changeOaOddNum: this.form.changeOaOddNum,
        changeRemarks: this.form.changeRemarks,
        id: this.pid
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "提交成功"
        });
        this.dialogVisible = false;
        this.getPatentChangeInfo();
        this.form = {};
      }
    },

    async getFileListForZl() {
      let res = await getFileList({
        page: this.currentPageForDetail,
        size: this.sizeForDetail,
        type: 3,
        id: this.zlInfo.id
      });
      if (res.status === 1) {
        this.tableDataZlDetail = res.msg;
      }
    },
    // 专利变更记录分页
    handleSizeChangeForChange(val) {
      this.currentPageForChange = val;
      if (this.show) {
        this.getPatentChangeInfo();
      } else {
        this.getPatentChangeInfo();
      }
    },
    handleCurrentChangeForChange(val) {
      this.sizeForChange = val;
      if (this.show) {
        this.getPatentChangeInfo();
      } else {
        this.getPatentChangeInfo();
      }
    },
    // 专利文档详情分页
    handleCurrentChangeForDetail(val) {
      this.currentPageForDetail = val;
      if (this.show) {
        this.getFileListForZl();
      } else {
        this.getFileListForZl();
      }
    },

    handleSizeChangeForDetail(val) {
      this.sizeForDetail = val;
      if (this.show) {
        this.getFileListForZl();
      } else {
        this.getFileListForZl();
      }
    },
    // 上传钩子
    handleRemove(file, fileList) {},
    handleSuccess(response, file, fileList) {
      this.getFileListForZl();
      let index = fileList.indexOf(file);
      if (index > -1) {
        // clear fileList after upload
        console.log(this.fileList);
        return fileList.splice(index, 1);
      }
    },
    handleError(file, fileList) {
      // console.log(err, file, fileList);
    },
    handleChange(file, fileList) {},
    maxExceed(file, fileList) {},
    // download file
    downloads(row) {
      window.open(row.uploadFilePath);
    },

    deletes(row) {
      this.$confirm(`此操作将删除"${row.fileName}"文件, 是否继续?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let res = await removeFileEnclosureInformation({ id: row.id });
          if (res.status === 1) {
            this.getFileListForZl();
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功！"
            });
          }
        })
        .catch(() => {
          this.$message({ type: "info", message: "已取消删除" });
        });
    }
  },
  data() {
    // 变更费用
    let validate1 = (rule, value, callback) => {
      if (this.form.changeCost !== "") {
        let res = this.$money(this.form.changeCost);
        if (res === 1) {
          callback();
        } else {
          callback(new Error());
        }
      } else {
        this.$message({
          type: "warning",
          message: "不能为空"
        });
      }
    };
    return {
      // 专利文档详情分页
      currentPageForDetail: 1,
      sizeForDetail: 10,
      // 专利变更记录分页
      currentPageForChange: 1,
      sizeForChange: 10,
      // 文件上传数据
      dataFile: {
        path: "knowledge",
        type: 3,
        id: ""
      },
      // 文件上传头
      headers: {
        Authorization: sessionStorage.getItem("token")
      },
      fileList: [],
      // 新增变更数据
      form: {
        // 新增日期
        changeConfirmTime: "",
        // 费用
        changeCost: "",
        // oa danhao
        changeOaOddNum: "",
        // 备注
        changeRemarks: ""
      },
      // 专利变更记录id
      pid: "",
      // 变更记录弹出框
      dialogVisible: false,
      // 默认显示tabs第一栏
      activeName: "first",
      // 专利基本详情数据
      zlInfo: {
        status: 1,
        type: 1,
        patentee: "深圳银宝山新",
        gainWay: 1,
        whetherChange: 0,
        disclosurePaperDTO: {}
      },
      // 专利文档表格数据
      tableDataZlDetail: {},
      // 专利变更记录
      tableDataZlChange: {},
      // 专利缴费详情
      tableDataZlMoney: {},
      // 变更前及后专利人
      changePeoBefore: "",
      changePeoAfter: "",
      // 专利受理
      options: [
        { label: "全部", id: 0 },
        { label: "已受理", id: 1 },
        { label: "初审中", id: 2 },
        { label: "实审中", id: 3 },
        { label: "已缴费", id: 4 },
        { label: "已撤回", id: 5 },
        { label: "已驳回", id: 6 },
        { label: "已放弃", id: 7 },
        { label: "已授权", id: 8 },
        { label: "变更中", id: 9 },
        { label: "已失效", id: 10 },
        { label: "已转让", id: 11 }
      ],
      // 专利类型
      type: [
        { label: "全部", id: 0 },
        { label: "实用", id: 1 },
        { label: "发明", id: 2 },
        { label: "外观", id: 3 },
        { label: "软件著作权", id: 4 }
      ],
      // 获取方式
      gainWay: [
        { label: "原始取得", id: 1 },
        { label: "归属转让", id: 2 },
        { label: "授权使用", id: 3 }
      ],
      // Api开关
      choose: 0,
      // 修改专利权人费用验证
      rules: {
        changeCost: [
          {
            validator: validate1,
            trigger: ["blur"]
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.row_style {
  margin-top: 15px;
}
.col_style {
  display: inline-block;
  width: 108px;
  text-align: right;
}
</style>
