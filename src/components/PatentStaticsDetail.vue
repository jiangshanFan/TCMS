<template>
  <div class="PatentStaticsDetail p20">
    <!-- Disclosure Detail -->
    <div class="Detail">
      <el-table
        :data="DetailTable"
        v-loading="loading"
        stripe
        border
        size="small"
        :summary-method="getSummaries"
        :show-summary="showSummary"
        max-height="800"
        style="width: 100%;margin-top:10px;"
        header-cell-class-name="header_cell table_header_shadow"
        tooltip-effect="light">
        <!-- circle -->
        <column :header="header"></column>
      </el-table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  import column from './tableColumn'
  /** 导入api.js */
  import { queryDisclosurePaperDetailsByYear, queryPatentDetailsByYear, queryPatentDetailsByYearAndAuthorized, } from '../axios/api.js'
  export default {
    name: "PatentStaticsDetail",
    props: {
      choose: { type: Number, },
      year: { type: Number,}
    },
    components: {
      "column": column,
    },
    async created() {
      this.loading = true;
      let res,params = { yearDate: this.Year };
      if (this.choice === 1) {
        this.header = this.header1;
        res = await queryDisclosurePaperDetailsByYear(params);
      } else if (this.choice === 2) {
        this.header = this.header2;
        res = await queryPatentDetailsByYear(params);
      } else if (this.choice === 3) {
        this.header = this.header3;
        this.showSummary = false;
        res = await queryPatentDetailsByYearAndAuthorized(params);
      }
      if (res.status === 1) {
        for (let item of res.msg) {
          if (item.type !== 4) {
            this.DetailTable.push(item);
          }
        }
        this.loading = false;
      }
    },
    async mounted() {

    },
    methods: {
      getSummaries(param) {
        const { columns, data } = param;
        console.log(data);
        const sums = [];
        columns.forEach((column, index) => {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          const values = data.map(item => {if (item.type !==4) return Number(item[column.property])});
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (this.choice === 1) {
              if (index % 2) {
                sums[index] = (sums[index] / 100).toFixed(2);
              }
            }
          } else {
            sums[index] = 'N/A';
          }
        });
        return sums;
      },

    },
    data() {
      return {
        choice: this.choose,
        Year: this.year,

        // all info
        DetailTable: [],
        header: [],

        header1:[

          { prop: 'agent', label: '代理公司/月份', fixed: 'left', eachWidth: 25, },
          { prop: 'Jan', label: '1月', children: [{ prop: 'janTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'janMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Feb', label: '2月', children: [{ prop: 'febTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'febMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Mar', label: '3月', children: [{ prop: 'marTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'marMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Apr', label: '4月', children: [{ prop: 'aprTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'aprMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'May', label: '5月', children: [{ prop: 'mayTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'mayMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Jun', label: '6月', children: [{ prop: 'junTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'junMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'July', label: '7月', children: [{ prop: 'julTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'julMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Aug', label: '8月', children: [{ prop: 'augTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'augMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Sep', label: '9月', children: [{ prop: 'sepTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'sepMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Oct', label: '10月', children: [{ prop: 'octTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'octMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Nov', label: '11月', children: [{ prop: 'novTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'novMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Dece', label: '12月', children: [{ prop: 'deceTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'deceMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},
          { prop: 'Year', label: '年度总计', children: [{ prop: 'yearNumTotal', label: '数量', eachWidth: 48, sortable: true, }, { prop: 'yearNumMoney', label: '费用', division: 100, eachWidth: 48, sortable: true, },]},

        ],

        header2: [
          { prop: 'type', label: '专利类型/月份', fixed: 'left', eachWidth: 25, change: ['','申请实用专利','申请发明专利','申请外观专利',]},
          { prop: 'janTotal', label: '1月', width: 'unset'},
          { prop: 'febTotal', label: '2月', width: 'unset'},
          { prop: 'marTotal', label: '3月', width: 'unset'},
          { prop: 'aprTotal', label: '4月', width: 'unset'},
          { prop: 'mayTotal', label: '5月', width: 'unset'},
          { prop: 'junTotal', label: '6月', width: 'unset'},
          { prop: 'julTotal', label: '7月', width: 'unset'},
          { prop: 'augTotal', label: '8月', width: 'unset'},
          { prop: 'sepTotal', label: '9月', width: 'unset'},
          { prop: 'octTotal', label: '10月', width: 'unset'},
          { prop: 'novTotal', label: '11月', width: 'unset'},
          { prop: 'deceTotal', label: '12月', width: 'unset'},

        ],

        header3: [
          { prop: 'type', label: '专利类型/月份', fixed: 'left', eachWidth: 25, change: ['','已授权实用专利','已授权发明专利','已授权外观专利',]},
          { prop: 'janTotal', label: '1月', width: 'unset' },
          { prop: 'febTotal', label: '2月', width: 'unset' },
          { prop: 'marTotal', label: '3月', width: 'unset' },
          { prop: 'aprTotal', label: '4月', width: 'unset' },
          { prop: 'mayTotal', label: '5月', width: 'unset' },
          { prop: 'junTotal', label: '6月', width: 'unset' },
          { prop: 'julTotal', label: '7月', width: 'unset' },
          { prop: 'augTotal', label: '8月', width: 'unset' },
          { prop: 'sepTotal', label: '9月', width: 'unset' },
          { prop: 'octTotal', label: '10月', width: 'unset' },
          { prop: 'novTotal', label: '11月', width: 'unset' },
          { prop: 'deceTotal', label: '12月', width: 'unset'},
        ],
        showSummary: true,

        loading: true,
      }
    }
  }
</script>

<style scoped>
  .el-form-item__label {
    font-size: 12px !important;
  }
</style>
