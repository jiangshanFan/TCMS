<template>
  <div class="patentStatics posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>

    <!-- Detail -->
    <PatentStaticsDetail v-if="choose!==0" :choose="choose" :year="$format(new Date(year).getTime()).y"></PatentStaticsDetail>

    <!-- content -->
    <div class="patentStaticsContent p20" v-else>
      <div class="boxShadow">
        <h2>技术中心知识产权统计</h2>
        <hr>
        <el-row :gutter="10">
          <el-col :span="6" class="fwb">已申请交底书统计：{{count.paperTotal}}</el-col>
          <el-col :span="6" class="fwb">已发表论文统计：{{count.dissertationTotal}}</el-col>
        </el-row>

        <el-row>
          <el-row :gutter="10">
            <el-col :span="6" class="fwb">已申请专利统计：{{count.patentTotal}}</el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">初审中专利：{{count.firstInstance}}</el-col>
            <el-col :span="6">实审中专利：{{count.realTrial}}</el-col>
            <el-col :span="6">已撤回专利：{{count.hasWithdrawn}}</el-col>
            <el-col :span="6">已驳回申请：{{count.hasBeenRejected}}</el-col>
            <el-col :span="6">待缴费专利：{{count.payCost}}</el-col>
            <el-col :span="6">已授权专利：{{count.authorized}}</el-col>
            <el-col :span="6">变更中专利：{{count.alteration}}</el-col>
            <el-col :span="6">已失效专利：{{count.becameInvalid}}</el-col>
          </el-row>
        </el-row>

        <el-row>
          <el-row :gutter="10">
            <el-col :span="6" class="fwb">已授权专利详情</el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="6">已授权实用专利：{{count.practicalTypeTotal}}</el-col>
            <el-col :span="6">已授权发明专利：{{count.inventTypeTotal}}</el-col>
            <el-col :span="6">已授权外观专利：{{count.appearanceTypeTotal}}</el-col>
          </el-row>
        </el-row>
      </div>

      <div class="boxShadow mt20">
        <el-row class="mb20">
          <el-date-picker v-model="year" value-format="yyyy" type="year" placeholder="选择年" :clearable="false" :editable="false" @change="getYearCount"></el-date-picker>
        </el-row>
        <hr>

        <el-row>
          <el-row :gutter="10">
            <el-col :span="6" class="fwb">
              <span>交底书</span>
              <el-button class="underline" type="text" size="mini" @click.stop.prevent="details()">详情</el-button>
            </el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="2">{{$format(new Date(year).getTime()).y}}</el-col>
            <el-col :span="6">申请交底书：{{countYear.paperTotal}}</el-col>
            <el-col :span="12">交底书代理公司{{countYear.companyTotal}}家，总费用{{countYear.totalCost / 100}}元</el-col>
          </el-row>
        </el-row>

        <el-row>
          <el-row :gutter="10">
            <el-col :span="6" class="fwb">专利统计</el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="2">{{$format(new Date(year).getTime()).y}}</el-col>
            <el-col :span="6">
              <span>申请专利：{{countYear.allPatentNum}}</span>
              <el-button class="underline" type="text" size="mini" @click.stop.prevent="details(2)">详情</el-button>
            </el-col>
            <el-col :span="16">申请实用专利{{countYear.practicalTypeAllTotal}}份，申请发明专利{{countYear.inventTypeAllTotal}}份，申请外观专利{{countYear.appearanceTypeAllTotal}}份</el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="2">{{$format(new Date(year).getTime()).y}}</el-col>
            <el-col :span="6">
              <span>已授权专利：{{countYear.authorizationPatentNum}}</span>
              <el-button class="underline" type="text" size="mini" @click.stop.prevent="details(3)">详情</el-button>
            </el-col>
            <el-col :span="16">已授权实用专利{{countYear.practicalTypeTotal}}份，已授权发明专利{{countYear.inventTypeTotal}}份，已授权外观专利{{countYear.appearanceTypeTotal}}份</el-col>
          </el-row>
        </el-row>

        <el-row>
          <el-row :gutter="10">
            <el-col :span="6" class="fwb">专利续费详情</el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="2">{{$format(new Date(year).getTime()).y}}</el-col>
            <el-col :span="6">{{quarter}}</el-col>
            <el-col :span="16">需要续费专利数量/费用：{{countYear.waitCost}}份/共{{countYear.waitCostMoney / 100}}元</el-col>
          </el-row>

          <el-row :gutter="10" style="text-indent: 2em;">
            <el-col :span="2">{{$format(new Date(year).getTime()).y}}</el-col>
            <el-col :span="16">已续费专利数量/费用：{{countYear.arrivedCost}}份/共{{countYear.arrivedCostMoney / 100}}元</el-col>
          </el-row>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { queryProjectInformation, queryDisclosurePatentStatisticsTotalByYear, } from '../../axios/api.js'
import breadcrumbList from '../../components/breadcrumbList'
import PatentStaticsDetail from '../../components/PatentStaticsDetail'

  export default {
    name: "patentStatics",
    components: {
      'breadcrumbList': breadcrumbList,
      'PatentStaticsDetail': PatentStaticsDetail,
    },
    async created() {
      let res = await queryProjectInformation();
      if (res.status === 1) {
        this.count = res.msg;
      }
      this.getYearCount();
    },
    mounted() {

    },
    computed: {
      quarter: function () {
        let t = this.$format(new Date().getTime()).m / 3;
        let q = Math.ceil(t) + 1;
        if (q > 4) {
          q = 2;
        }
        return `第${q}季度`
      }
    },
    methods: {
      // year count
      async getYearCount() {
        let res = await queryDisclosurePatentStatisticsTotalByYear({yearDate: this.year});
        if (res.status === 1) {
          this.countYear = res.msg;
        }
      },

      // send the value of choose
      details(c = 1) {
        console.log(c);
        this.choose = c;
        let id,name;
        if (c === 1) {
          id = 'DisclosureDetail';
          name = '交底书详情';
        } else if (c === 2) {
          id = 'ApplyPatentDetail';
          name = '申请专利详情';
        } else if (c === 3) {
          id = 'AuthorityPatentDetail';
          name = '已授权专利详情';
        }
        this.breadcrumb.push({id: id, name: name});
      },

      // show default module
      showDefault(val) {
        console.log(val);
        if (val !== undefined) {
          this.choose = val;
          this.breadcrumb = this.breadcrumb.slice(0,2);
        }
      },
    },
    data() {
      return {
        count: {},

        countYear: {},

        year: String(new Date()),

        choose: 0,

        // breadcrumb
        breadcrumb: [
          { id: 'patent', name: '知识产权管理', path: '/patent',},
          { id: 'patentStatics', name: '知识产权统计', path: '/patent/patentStatics', thing: 0},
        ],
      }
    }
  }
</script>

<style lang="scss" scoped>
  .patentStaticsContent {
    .boxShadow {
      box-shadow: rgba(0, 0, 0, 0.35) 0px 3px 8px 0px;
      padding: 10px 20px;
      line-height: 30px;
    }
  }
</style>
