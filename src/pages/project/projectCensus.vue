<template>
  <div class="patentStatics posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <!-- content -->
    <div class="patentStaticsContent p20">
      <div class="boxShadow">
        <h2>项目统计</h2>
        <hr />

        <el-row>
          <el-row :gutter="10" style="text-indent: 1em;">
            <el-col :span="6" style="color:#34B5FF;">
              <span>
                <img src="../../../static/images/cencus.png" alt />
              </span>
              项目总数：{{listData.projectTotalNum}}个
            </el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">已完成项目：{{listData.finishNum}}个</el-col>
            <el-col :span="6">规划中项目：{{listData.planNum}}个</el-col>
            <el-col :span="6">待审批项目：{{listData.approvalNum}}个</el-col>
            <el-col :span="6">进行中项目：{{listData.ingNum}}个</el-col>
          </el-row>
          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">已关闭项目：{{listData.closeNum}}个</el-col>
            <el-col :span="6">验收中项目：{{listData.acceptanceNum}}个</el-col>
          </el-row>
          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">政府合作项目：{{listData.governmentNum}}个</el-col>
            <el-col :span="6">企业内部项目：{{listData.ownNum}}个</el-col>
            <el-col :span="6">企业间合作项目：{{listData.companyNum}}个</el-col>
            <el-col :span="6">科研预研项目：{{listData.scientificResearchNum}}个</el-col>
          </el-row>
        </el-row>
      </div>

      <div class="boxShadow mt20">
        <el-row class="mb20">
          <el-date-picker
            size="mini"
            v-model="year"
            type="year"
            placeholder="选择年"
            @change="yearChange"
          ></el-date-picker>
        </el-row>
        <hr />
        <el-row>
          <el-row :gutter="10" style="text-indent: 1em;">
            <el-col :span="6" style="color:#34B5FF;">
              <span>
                <img src="../../../static/images/cencus.png" alt />
              </span>
              项目总数：{{yearList.projectTotalNum}}个
            </el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">已完成项目：{{yearList.finishNum}}个</el-col>
            <el-col :span="6">规划中项目：{{yearList.planNum}}个</el-col>
            <el-col :span="6">待审批项目：{{yearList.approvalNum}}个</el-col>
            <el-col :span="6">进行中项目：{{yearList.ingNum}}个</el-col>
          </el-row>
          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">已关闭项目：{{yearList.closeNum}}个</el-col>
            <el-col :span="6">验收中项目：{{yearList.acceptanceNum}}个</el-col>
          </el-row>
          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">政府合作项目：{{yearList.governmentNum}}个</el-col>
            <el-col :span="6">企业内部项目：{{yearList.ownNum}}个</el-col>
            <el-col :span="6">企业间合作项目：{{yearList.companyNum}}个</el-col>
            <el-col :span="6">科研预研项目：{{yearList.scientificResearchNum}}个</el-col>
          </el-row>
          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col
              :span="6"
            >{{$format(new Date().getTime()).y}}年项目总预算：{{yearList.projectAmountTotal/100}}元</el-col>
          </el-row>
          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col
              :span="8"
            >{{$format(new Date().getTime()).y}}年项目资助总资金：{{yearList.supportAmountTotal/100}}元</el-col>
            <el-col
              :span="8"
            >{{$format(new Date().getTime()).y}}年项目自筹总资金：{{yearList.raiseAmountTotal/100}}元</el-col>
          </el-row>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumbList from '../../components/breadcrumbList'
import { queryProjectStatistics } from '../../axios/api.js'
export default {
  components: {
    breadcrumbList
  },
  mounted () {
    this.getList()
    this.getYearList()
  },
  methods: {
    yearChange () {
      this.getYearList()
    },
    //   获取任务统计列表
    async getList () {
      let res = await queryProjectStatistics()
      if (res.status === 1) {
        this.listData = res.msg
      }
    },
    //   获取任务统计列表
    async getYearList () {
      let res = await queryProjectStatistics({
        currentDateTime: this.year
      })
      if (res.status === 1) {
        if (res.msg !== null) {
          this.yearList = res.msg
        } else {
          this.yearList = {}
        }
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
      // 选择年
      year: new Date(),
      // 列表数据
      listData: {},
      //   年份列表数据
      yearList: {},
      // breadcrumb
      breadcrumb: [
        { id: 'project', name: '项目管理', path: '/project' },
        {
          id: 'projectCensus',
          name: '项目统计',
          path: '/project/projectCensus',
          thing: 'showDefault'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
