<template>
  <div class="p20">
    <!-- <addPatentRel v-if="show===1"></addPatentRel> -->
    <div>
      <div>
        <span class="title">项目名称：{{basicInfo.projectName}}</span>
      </div>
      <el-button
        type="primary"
        size="mini"
        style="margin-top:20px;"
        @click="toAdd"
      >添&nbsp;&nbsp;&nbsp;加</el-button>
      <!-- 列表 -->
      <template>
        <el-table
          :data="tableData.content"
          style="width: 100%; margin-top:20px;"
          stripe
          border
          size="small"
          header-cell-class-name="header_cell table_header_shadow"
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="patentName" label="专利名称"></el-table-column>
          <el-table-column align="center" prop="officialAcceptanceTime" label="受理时间">
            <template slot-scope="scope" v-if="scope.row.officialAcceptanceTime">
              <span>{{$format(new Date(scope.row.officialAcceptanceTime).getTime()).dates}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="type" label="专利类型">
            <template slot-scope="scope">
              <span
                v-for="(item,index) in type"
                :key="index"
              >{{item.id===scope.row.type?item.label:''}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                style="margin-top:10px;"
                @click="del(scope.row)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          v-if="tableData.totalCount"
          style="float:right; margin-top:10px;"
          @size-change="handleSizeChangeForList"
          @current-change="handleCurrentChangeForList"
          :current-page="page1"
          :page-sizes="[5, 10, 15, 20,50]"
          :page-size="sizes1"
          layout="total, sizes, prev, pager, next"
          :total="tableData.totalCount"
        ></el-pagination>
      </template>
      <!-- 添加弹窗 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="70%">
        <!-- 添加页面表单 -->
        <el-form :rules="rules" ref="form" :model="form" label-width="80px" size="mini">
          <el-col :span="6">
            <el-form-item label="专利名称">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="受理时间" required>
              <el-date-picker
                v-model="form.date1"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form>
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="seach()">搜 索</el-button>
        </el-col>
        <!--  列表 -->
        <template>
          <el-table
            :data="tableData1.content"
            style="width: 100%; margin-top:20px;"
            stripe
            border
            size="small"
            header-cell-class-name="header_cell table_header_shadow"
          >
            <el-table-column align="center" label="选择" width="50">
              <template slot-scope="scope">
                <el-checkbox
                  @change="checkChange(scope.row.id)"
                  :disabled="scope.row.projectNames==null?false:true"
                ></el-checkbox>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="patentName" label="专利名称"></el-table-column>
            <el-table-column align="center" prop="officialAcceptanceTime" label="受理时间">
              <template slot-scope="scope">
                <span>{{$format(new Date(scope.row.officialAcceptanceTime).getTime()).dates}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="type" label="专利类型">
              <template slot-scope="scope">
                <span
                  v-for="(item,index) in type"
                  :key="index"
                >{{item.id===scope.row.type?item.label:''}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="projectNames" label="关联项目名称"></el-table-column>
          </el-table>
        </template>
        <!-- 分页 -->
        <el-row>
          <el-pagination
            style="float:right; margin-top:20px;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[5, 10, 15, 20,50]"
            :page-size="sizes"
            layout="total, sizes, prev, pager, next"
            :total="tableData1.totalCount"
          ></el-pagination>
        </el-row>

        <div style="text-align:center; margin-top:20px;">
          <el-button size="mini" type="primary" @click="addNewPatent">添&nbsp;&nbsp;&nbsp;加</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryProjectRelatedPaten,
  removePatenRelatedProject,
  queryPatenRelatedProject,
  addProjectRelatedPaten
} from "../../axios/api.js";
// 引入专利关联添加页面
// import addPatentRel from "../../components/addPatentRel";
export default {
  name: "projectRelevance",
  // 注册专利关联页面
  components: {
    // addPatentRel: addPatentRel
  },
  mounted() {
    this.basicInfo = Object.assign({}, this.$store.getters.project_list);
    this.getReleList();
  },
  methods: {
    // 删除专利关联
    async del(row) {
      let res = await removePatenRelatedProject({
        id: row.projectRelatedPatenId
      });
      if (res.status === 1) {
        this.$message({
          type: "success",
          message: "删除成功"
        });
        this.getReleList();
      }
    },
    // 获取专利关联列表
    async getReleList() {
      let res = await queryProjectRelatedPaten({
        page: this.page,
        size: this.sizes,
        id: this.basicInfo.id
      });
      if (res.status === 1) {
        this.tableData = res.msg;
        res.msg.content.forEach(item => {
          this.patentId.push(item.id);
        });
      }
    },
    //   点击添加跳转页面
    toAdd() {
      this.dialogVisible = true;
      this.checkbox = [];
      this.getList();
    },
    handleSizeChangeForList(val) {
      this.sizes1 = val;
      this.getReleList();
    },
    handleCurrentChangeForList(val) {
      this.page1 = val;
      this.getReleList();
    },

    // 添加方法
    // 专利关联多选
    checkChange(row) {
      this.checkbox.push(row);
    },

    // 添加按钮事件
    async addNewPatent() {
      console.log(this.checkbox);
      if (this.checkbox.length === 0) {
        this.$message({
          type: "info",
          message: "请选择一项点击添加！"
        });
        return;
      } else {
        let res = await addProjectRelatedPaten({
          projectId: this.basicInfo.id,
          list: this.checkbox
        });
        if (res.status === 1) {
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.dialogVisible = false;
          this.getReleList();
          this.tableData1 = [];
        }
      }
    },
    // 搜索按钮
    async seach() {
      this.page = 1;
      this.getList();
    },
    // 获取专利关联列表
    async getList() {
      let params = {
        page: this.page,
        size: this.sizes
      };
      if (this.form.name) {
        params.patentName = this.form.name;
      }
      if (this.form.date1) {
        (params.officialAcceptanceStartTime = this.form.date1[0]),
          (params.officialAcceptanceEndTime = this.form.date1[1]);
      }
      let res = await queryPatenRelatedProject(params);
      if (res.status === 1) {
        this.tableData1 = res.msg;
      }
    },
    handleSizeChange(val) {
      this.sizes = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.page = val;
      this.getList();
    }
  },
  data() {
    return {
      dialogVisible: false,
      // 跳转数据源
      basicInfo: {},
      // 跳转页面判断参
      show: 0,
      // 搜索栏表单元素
      form: {
        name: "",
        date1: ""
      },
      // 分页数据
      page: 1,
      sizes: 10,
      // 分页数据
      page1: 1,
      sizes1: 10,
      //  表格数据
      tableData1: [],
      // 表格数据
      tableData: {},
      // 专利类型
      type: [
        { label: "实用", id: 1 },
        { label: "发明", id: 2 },
        { label: "外观", id: 3 },
        { label: "软件著作权", id: 4 }
      ],
      // 专利id数组
      checkbox: [],
      // 已关联专利id
      patentId: [],
      //  搜索表单验证
      rules: {
        date: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 28px;
  font-weight: bold;
}
</style>