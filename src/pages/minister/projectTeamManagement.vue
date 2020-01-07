<template>
  <div class="projectProgress posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <div class="p20">
      <h1 style="font-size:24px;">评分说明</h1>

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
      <h2>姓名：{{this.$store.state.username}}</h2>
      <!-- 选择年份区域 -->
      <div>
        <span style="font-size:16px; font-weight:bold;">选择年份&nbsp;&nbsp;&nbsp;&nbsp;</span>
        <template>
          <el-date-picker
            @change="yearChange"
            size="mini"
            v-model="yearValue"
            type="year"
            placeholder="选择年份"
          ></el-date-picker>
        </template>
      </div>
      <!-- 部门成员考评列表区域 -->
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
          <el-table-column align="center" prop="monthPart" label="月份"></el-table-column>
          <el-table-column align="center" prop="selfGradeOne" label="指标1自评分">
            <template slot-scope="scope">
              <span v-if="scope.row.selfGradeOne">{{scope.row.selfGradeOne/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="selfGradeTwo" label="指标2自评分">
            <template slot-scope="scope">
              <span v-if="scope.row.selfGradeTwo">{{scope.row.selfGradeTwo/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="selfTotalGrade" label="自评总分">
            <template slot-scope="scope">
              <span v-if="scope.row.selfTotalGrade">{{scope.row.selfTotalGrade/10}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="remark" label="说明"></el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="openWin(scope.row)">编辑</el-button>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <!-- 编辑弹窗 -->
      <el-dialog title="自评分编辑" :visible.sync="dialogFormVisible">
        <el-form :model="form" size="mini">
          <el-form-item label="月份：">
            <span>{{Mountagement+'月'}}</span>
          </el-form-item>
          <el-form-item label="指标1自评分">
            <span v-if="isShow.selfGradeOne!==null">{{form.selfGradeOne}}分</span>
            <el-select v-else v-model="form.selfGradeOne" placeholder="请选择自评分">
              <el-option
                v-for="(item,index) in options.scoreOne"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
            <span style="color:#ccc; margin-left:20px;">自评分仅提交一次</span>
          </el-form-item>
          <el-form-item label="指标2自评分">
            <span v-if="isShow.selfGradeTwo!==null">{{form.selfGradeTwo}}分</span>
            <el-select v-else v-model="form.selfGradeTwo" placeholder="请选择自评分">
              <el-option
                v-for="(item,index) in options.scoreTwo"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
            <span style="color:#ccc; margin-left:20px;">自评分仅提交一次</span>
          </el-form-item>
          <el-form-item label="说明">
            <el-input
              maxlength="32"
              :show-word-limit="true"
              type="textarea"
              v-model="form.remark"
              :rows="3"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button size="mini" type="primary" @click="subGrade">提 交</el-button>
          <el-button size="mini" @click="dialogFormVisible = false">取 消</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import {
  queryAssessmentManagementList,
  updateAssessmentManagement
} from '../../axios/api.js'
import breadcrumbList from '../../components/breadcrumbList'
export default {
  components: {
    breadcrumbList
  },
  mounted () {
    this.yearChange()
  },
  methods: {
    // 编辑自评分弹窗  57行
    openWin (row) {
      this.form.selfGradeOne = row.selfGradeOne / 10
      this.form.selfGradeTwo = row.selfGradeTwo / 10
      this.form.remark = row.remark
      this.form.id = row.id
      this.dialogFormVisible = true
      this.Mountagement = row.monthPart
      this.isShow = row
    },
    // 自评编辑弹窗提交事件
    subGrade () {
      this.$confirm(`请确认评分信息评分提交后将不能修改！`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          let params = { ...this.form }
          for (let index of Object.keys(params)) {
            if ('selfGradeOne|selfGradeTwo'.match(index)) {
              if (params[index]) {
                params[index] = parseFloat(params[index]) * 10
              }
            }
          }
          let res = await updateAssessmentManagement(params)
          if (res.status === 1) {
            this.$message({
              type: 'warning',
              message: '提交成功'
            })
            this.form.selfGradeOne = ''
            this.form.selfGradeTwo = ''
            this.form.remark = ''
            this.form.id = ''
            this.dialogFormVisible = false
            this.yearChange()
          }
        })
        .catch(() => {
          this.$message({ type: 'info', message: '已取消提交' })
        })
    },
    // 根据年份获取评分列表方法
    async yearChange () {
      let res = await queryAssessmentManagementList({
        yearPart: this.$format(new Date(this.yearValue).getTime()).y
      })
      if (res.status === 1) {
        this.table = res.msg
      }
    },
    // show default module
    showDefault (val) {
      if (val) {
        this.breadcrumb = this.breadcrumb.slice(0, 2)
      }
    }
  },
  data () {
    return {
      // 弹窗显隐判断
      dialogFormVisible: false,
      // 弹窗form表单数据
      form: {
        // 自评分1数据
        selfGradeOne: '',
        // 自评分2数据
        selfGradeTwo: '',
        // 说明数据
        remark: '',
        id: ''
      },
      isShow: {},
      //   考评标准表格数据（固定数据）
      tableData: [
        {
          kpione: '工作态度（2分）',
          checkone:
            '1）主动依据部门工作清单及领导临时安排的工作任务，完成所需的工作。 2）积极主动及时报告工作。 3）遵守规章制度、考勤、会议出勤。',
          checkdataone:
            '2.0分--工作主动性强，出色完成本职工作并积极找任务； 1.5分--工作主动性较好，本职工作按时完成； 1.0分--工作主动性一般； 0.5分--工作主动性差，本职工作未能按时完成并经常出错； 0分--工作有抵触情绪，经常脱岗。',
          kpitwo: '工作完成时效性和质量(3分)',
          checktwo:
            '按要求，准确无误的完成任务上要求的各项技术指标，满足项目的技术要求，并针对过程中的相关问题能做全面分析并描述出解决方案。',
          checkdatatwo:
            '3.0分--提前保质完成本职工作，并有出色发挥或额外成绩且输出结果完整清晰； 2.5分--按时保质完成本职工作，输出结果完整清晰； 2.0分--按时完成本职工作，输出结果质量一般； 1.5分--按时完成本职工作，输出结果不完整； 1.0分--仅完成部分本职工作，没有输出结果； 0.5分--未能按时完成本职工作。 0分--未能完成本职工作且严重失职或影响团队其他成员工作。'
        }
      ],
      //   选择年份下拉数据（暂时写死）
      options: {
        scoreOne: [
          { label: 0, id: 1 },
          { label: 0.5, id: 2 },
          { label: 1, id: 3 },
          { label: 1.5, id: 4 },
          { label: 2, id: 5 }
        ],
        scoreTwo: [
          { label: 0, id: 1 },
          { label: 0.5, id: 2 },
          { label: 1, id: 3 },
          { label: 1.5, id: 4 },
          { label: 2, id: 5 },
          { label: 2.5, id: 6 },
          { label: 3, id: 7 }
        ]
      },
      // 年份数据
      yearValue: new Date(),
      //   考评列表区域数据
      table: [],
      // 自评分编辑页面月份数据
      Mountagement: '',
      // breadcrumb
      breadcrumb: [
        { id: 'minister', name: '考评管理', path: '/minister' },
        {
          id: 'projectTeamManagement',
          name: '月度成员自评',
          path: '/jobdiary/projectTeamManagement',
          thing: 'showDefault'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
