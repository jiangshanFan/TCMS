<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <!-- <div v-if="this.notManager===1" style="line-height:28px;">
        <el-row :gutter="10">
          <el-col :span="2">
            <span>归属部门</span>
          </el-col>
          <el-col :span="4">
            <el-input size="mini" type="text" v-model="this.$store.state.dept" :disabled="true"></el-input>
          </el-col>
        </el-row>
      </div>-->

      <div>
        <span>归属部门</span>
        <template>
          <span v-if="mangerBranch" style="margin-left:20px; font-size:20px;">{{mangerBranch}}</span>
          <el-select
            v-else
            @change="brenchChange(value)"
            style="margin-left:30px;"
            size="mini"
            v-model="value"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options.classM"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            ></el-option>
          </el-select>
        </template>
        <!-- <el-button type="primary" size="mini" style="margin-left:30px;">搜 索</el-button> -->
      </div>

      <!-- kpi -->
      <h1 style="font-size:30px; display:inline-block;">KPI评分</h1>
      <!-- 点击弹出评分说明列表 -->
      <el-button
        class="underline"
        type="text"
        size="mini"
        style="margin-left:30px; display:inline-block; font-size:16px;"
        @click="dialogVisible = true"
      >评分说明</el-button>

      <div>
        <span>选择年份/月份</span>
        <template>
          <el-date-picker
            size="mini"
            @change="monthChange"
            v-model="value2"
            type="month"
            placeholder="请选择时间"
          ></el-date-picker>
        </template>
      </div>
      <!-- 部长考评列表 -->
      <template>
        <el-table
          :data="table"
          stripe
          border
          size="small"
          style="width: 100%;margin-top:10px;"
          header-cell-class-name="header_cell table_header_shadow"
        >
          <el-table-column align="center" type="index" label="序号" width="50"></el-table-column>
          <el-table-column align="center" prop="userName" label="姓名"></el-table-column>
          <el-table-column align="center" prop="selfGradeOne" label="指标1自评分">
            <template slot-scope="scope">
              <span>{{scope.row.selfGradeOne/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ministerGradeOne" label="指标1部长评分">
            <template slot-scope="scope">
              <span>{{scope.row.ministerGradeOne/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="selfGradeTwo" label="指标2自评分">
            <template slot-scope="scope">
              <span>{{scope.row.selfGradeTwo/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ministerGradeTwo" label="指标2部长评分">
            <template slot-scope="scope">
              <span>{{scope.row.ministerGradeTwo/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="selfTotalGrade" label="自评总分">
            <template slot-scope="scope">
              <span>{{scope.row.selfTotalGrade/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="ministerTotalGrade" label="部长评分总分">
            <template slot-scope="scope">
              <span>{{scope.row.ministerTotalGrade/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="totalScore" label="总分">
            <template slot-scope="scope">
              <span>{{scope.row.totalScore/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="自评说明"></el-table-column>
          <el-table-column align="center" prop="ministerExplain" label="部长评分说明"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="ministerEdit(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>

      <!-- 部长编辑弹窗 -->
      <el-dialog title="信息编辑" :visible.sync="ministerDialogFormVisible">
        <el-form :model="form">
          <el-form-item label="姓名：">
            <span>{{name}}</span>
          </el-form-item>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="指标1自评分：">
                <span>{{scoreOne/10}}分</span>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="指标1项目负责人评分">
                <span v-if="isShow.ministerGradeOne!==null">{{form.ministerGradeOne}}分</span>
                <el-select size="mini" v-else v-model="form.ministerGradeOne" placeholder="请选择分数">
                  <el-option
                    v-for="(item,index) in options.sofm"
                    :key="index"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10">
            <el-col :span="10">
              <el-form-item label="指标2自评分：">
                <span>{{scoreTwo/10}}分</span>
              </el-form-item>
            </el-col>
            <el-col :span="14">
              <el-form-item label="指标2项目负责人评分">
                <span v-if="isShow.ministerGradeTwo!==null">{{form.ministerGradeTwo}}分</span>
                <el-select v-else size="mini" v-model="form.ministerGradeTwo" placeholder="请选择分数">
                  <el-option
                    v-for="(item,index) in options.sofml"
                    :key="index"
                    :label="item.label"
                    :value="item.label"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="说明">
            <el-input
              maxlength="32"
              type="textarea"
              v-model="form.ministerExplain"
              :rows="2"
              resize="none"
              :show-word-limit="true"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subMinister">提 交</el-button>
          <el-button @click="ministerDialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>

      <!-- 评分说明弹窗 -->
      <el-dialog title="评分说明" :visible.sync="dialogVisible" width="80%">
        <template>
          <el-table
            :data="tableData"
            stripe
            border
            size="small"
            style="width: 100%;margin-top:10px;"
            header-cell-class-name="header_cell table_header_shadow"
          >
            <el-table-column prop="kpione" align="center" label="KPI指标1" width="80"></el-table-column>
            <el-table-column prop="checkone" align="center" label="考核定义" width="180"></el-table-column>
            <el-table-column prop="checkdataone" align="center" label="计分方法"></el-table-column>
            <el-table-column prop="kpitwo" align="center" label="KPI指标2" width="80"></el-table-column>
            <el-table-column prop="checktwo" align="center" label="考核定义" width="180"></el-table-column>
            <el-table-column prop="checkdatatwo" align="center" label="计分方法"></el-table-column>
          </el-table>
        </template>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import {
  queryAssessmentManagementAllList,
  queryDepartmentList,
  updateAssessmentManagement
} from "../../axios/api";
import breadcrumbList from "../../components/breadcrumbList";
export default {
  components: {
    breadcrumbList
  },
  created() {
    // 加载页面时获取部门列表
    this.getClass();
  },
  mounted() {
    this.monthChange();
  },

  methods: {
    brenchChange(val) {
      this.monthChange();
    },
    // 部长评分选择时间改变时间
    async monthChange() {
      let res = await queryAssessmentManagementAllList({
        dept: this.value,
        yearPart: this.$format(new Date(this.value2).getTime()).y,
        monthPart: this.$format(new Date(this.value2).getTime()).m
      });
      if (res.status === 1) {
        this.table = res.msg;
      }
    },
    // 获取部门列表
    async getClass() {
      let res = await queryDepartmentList();
      if (res.status === 1) {
        if (res.msg.length !== 1) {
          res.msg.forEach(item => {
            this.options.classM.push({
              label: item.pleaseDepartmentName,
              id: item.id
            });
          });
        } else if (res.msg.length === 1) {
          this.mangerBranch = res.msg[0].pleaseDepartmentName;
          this.value = res.msg[0].id;
          this.monthChange();
        }
      }
    },
    // 部长编辑评分弹窗  64行
    ministerEdit(row) {
      this.form.id = row.id;
      this.name = row.userName;
      this.scoreOne = row.selfGradeOne;
      this.scoreTwo = row.selfGradeTwo;
      this.ministerDialogFormVisible = true;
      this.form.ministerGradeOne = row.ministerGradeOne / 10;
      this.form.ministerGradeTwo = row.ministerGradeTwo / 10;
      this.form.ministerExplain = row.ministerExplain;
      this.isShow = row;
    },
    // 部长编辑弹窗提交事件
    subMinister() {
      this.$confirm(`请确认评分信息评分提交后将不能修改！`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          let params = {
            ...this.form
          };
          for (let index of Object.keys(params)) {
            if ("ministerGradeOne|ministerGradeTwo".match(index)) {
              if (params[index]) {
                params[index] = parseFloat(params[index]) * 10;
              }
            }
          }
          let res = await updateAssessmentManagement(params);
          if (res.status === 1) {
            this.$message({
              type: "warning",
              message: "提交成功"
            });
            this.form.ministerGradeOne = "";
            this.form.ministerGradeTwo = "";
            this.form.ministerExplain = "";
            this.form.id = "";
            this.ministerDialogFormVisible = false;
            this.monthChange();
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消提交"
          });
        });
    },
    // show default module
    showDefault(val) {
      if (val) {
        this.breadcrumb = this.breadcrumb.slice(0, 2);
      }
    }
  },
  data() {
    return {
      isShow: {},
      // 评分说明弹窗显隐
      dialogVisible: false,
      //   部长编辑弹窗显隐
      ministerDialogFormVisible: false,
      //   部长编辑表单数据
      form: {
        //   指标1项目负责人评分
        ministerGradeOne: "",
        // 指标2项目负责人评分
        ministerGradeTwo: "",
        // 编辑说明
        ministerExplain: "",
        id: ""
      },
      options: {
        //   月份数据（暂时固定）
        classM: [],
        // 指标1项目负责人下拉框数据
        sofm: [
          {
            label: 0,
            id: 1
          },
          {
            label: 0.5,
            id: 2
          },
          {
            label: 1,
            id: 3
          },
          {
            label: 1.5,
            id: 4
          },
          {
            label: 2,
            id: 5
          }
        ],
        // 指标2项目负责人下拉框数据
        sofml: [
          {
            label: 0,
            id: 1
          },
          {
            label: 0.5,
            id: 2
          },
          {
            label: 1,
            id: 3
          },
          {
            label: 1.5,
            id: 4
          },
          {
            label: 2,
            id: 5
          },
          {
            label: 2.5,
            id: 6
          },
          {
            label: 3,
            id: 7
          }
        ]
      },
      // 归属部门双向绑定数据
      value: "",
      // 选择年份及日期数据源
      value2: new Date(),
      // 部长弹窗初始数据
      name: "",
      scoreOne: "",
      scoreTwo: "",
      //   考评标准表格数据（固定数据）
      tableData: [
        {
          kpione: "工作态度（2分）",
          checkone:
            "1）主动依据部门工作清单及领导临时安排的工作任务，完成所需的工作。 2）积极主动及时报告工作。 3）遵守规章制度、考勤、会议出勤。",
          checkdataone:
            "2.0分--工作主动性强，出色完成本职工作并积极找任务； 1.5分--工作主动性较好，本职工作按时完成； 1.0分--工作主动性一般； 0.5分--工作主动性差，本职工作未能按时完成并经常出错； 0分--工作有抵触情绪，经常脱岗。",
          kpitwo: "工作完成时效性和质量(3分)",
          checktwo:
            "按要求，准确无误的完成任务上要求的各项技术指标，满足项目的技术要求，并针对过程中的相关问题能做全面分析并描述出解决方案。",
          checkdatatwo:
            "3.0分--提前保质完成本职工作，并有出色发挥或额外成绩且输出结果完整清晰； 2.5分--按时保质完成本职工作，输出结果完整清晰； 2.0分--按时完成本职工作，输出结果质量一般； 1.5分--按时完成本职工作，输出结果不完整； 1.0分--仅完成部分本职工作，没有输出结果； 0.5分--未能按时完成本职工作。 0分--未能完成本职工作且严重失职或影响团队其他成员工作。"
        }
      ],
      //   部长考评列表区域数据
      table: [],
      // 用户不是管理层下拉栏置灰
      notManager: 0,
      // breadcrumb
      breadcrumb: [
        {
          id: "minister",
          name: "考评管理",
          path: "/minister"
        },
        {
          id: "projectMangerRun",
          name: "月度部长考评",
          path: "/jobdiary/projectMangerRun",
          thing: "showDefault"
        }
      ],
      // 部长考评归属部门
      mangerBranch: ""
    };
  }
};
</script>

<style lang="scss" scoped>
</style>
