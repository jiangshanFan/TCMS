<template>
  <div class="PatentAddOrEdit p20">
    <el-form ref="form" :model="form" label-width="100px">
      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="专利号：">
            <el-input size="mini" v-model="form.patentApplyNum" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专利名称：">
            <el-input size="mini" v-model="form.patentName" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专利状态：">
            <el-select size="mini" v-model="form.status" placeholder="请选择" style="width:100%;">
              <el-option v-for="item in patent" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专利类型：">
            <el-select size="mini" v-model="form.type" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in patentType"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="专利权人：">
            <el-select size="mini" v-model="form.patentee" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in patenPeo"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button size="mini" type="primary" @click="onSeach">搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 表格数据 -->
    <template>
      <div>
        <el-table
          :data="tableData.content"
          border
          header-cell-class-name="header_cell table_header_shadow"
          size="small"
          stripe
        >
          <el-table-column type="index" label="序号" width="50" align="center"></el-table-column>
          <el-table-column align="center" prop="patentApplyNum" label="专利申请号">
            <template slot-scope="scope">
              <span>ZL{{scope.row.patentApplyNum}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="patentName" label="专利名称"></el-table-column>
          <el-table-column align="center" prop="type" label="专利类型">
            <template slot-scope="scope">
              <span v-for="(item,index) in patentType" :key="index">{{item.id===scope.row.type?item.label:""}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="officialAcceptanceTime" label="官方受理时间">
            <template slot-scope="scope">
              <span
                v-if="scope.row.officialAcceptanceTime!==null"
              >{{$format(new Date(scope.row.officialAcceptanceTime).getTime()).dates}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="planAuthorizeTime" label="预计授权时间">
            <template slot-scope="scope">
              <span
                v-if="scope.row.planAuthorizeTime!==null"
              >{{$format(new Date(scope.row.planAuthorizeTime).getTime()).dates}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="status" label="专利状态">
            <template slot-scope="scope">
              <span
                v-for="(item,index) in patent"
                :key="index"
              >{{item.id===scope.row.status?item.label:""}}</span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="patentee"
            label="专利权人"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column align="center" prop="discount" label="年费优惠后">
            <template slot-scope="scope">
              <span v-if="scope.row.discount!==null">{{scope.row.discount*100}}%</span>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="renewYear" label="最新已缴费年份"></el-table-column>
        </el-table>
      </div>
    </template>
    <el-pagination
      style="float:right; margin-top:10px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage4"
      :page-sizes="[5, 10, 15, 20,50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="tableData.totalCount"
      v-if="tableData.totalCount"
    ></el-pagination>
  </div>
</template>

<script>
import { getAuthorizePatentList } from '../../axios/api.js'
export default {
  name: 'patentAuthorize',
  mounted () {
    this.getList()
  },
  methods: {
    // 搜索方法
    // 模糊搜索 只要表单中(form)任意一项有数值 则获取并显示
    async onSeach () {
      console.log(this.form)
      this.tableData = {}
      if (this.form !== '') {
        let res = await getAuthorizePatentList({
          page: this.currentPage4,
          size: this.pageSize,
          ...this.form
        })
        if (res.status === 1) {
          this.tableData = res.msg
        }
      }
    },
    // 获取待授权专利管理列表
    async getList () {
      let res = await getAuthorizePatentList({
        page: this.currentPage4,
        size: this.pageSize
      })
      if (res.status === 1) {
        this.tableData = res.msg
      }
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.currentPage4 = val
      this.getList()
    }
  },
  data () {
    return {
      // 分页数据
      pageSize: 10,
      currentPage4: 1,
      // 表单数据
      form: {
        // 专利号
        patentApplyNum: '',
        // 专利名称
        patentName: '',
        // 专利状态
        status: '',
        // 专利类型
        type: '',
        // 专利权人
        patentee: ''
      },
      // 专利状态下拉
      patent: [
        { label: '全部', id: 0 },
        { label: '已受理', id: 1 },
        { label: '初审中', id: 2 },
        { label: '实审中', id: 3 },
        { label: '已缴费', id: 4 }
      ],
      // 专利类型
      patentType: [
        { label: '全部', id: 0 },
        { label: '实用', id: 1 },
        { label: '发明', id: 2 },
        { label: '外观', id: 3 },
        { label: '软件著作权', id: 4 }
      ],
      // 专利权人
      patenPeo: [
        { label: '深圳市银宝山新科技股份有限公司', id: 1 },
        { label: '天津银宝山新科技有限公司', id: 2 },
        { label: '惠州银宝山新科技股份有限公司', id: 3 },
        { label: '惠州银宝山新实业有限公司', id: 4 },
        { label: '长沙银宝山新模具科技有限公司', id: 5 },
        { label: '长沙银宝山新汽车零部件有限公司', id: 6 },
        { label: '深圳市白狐工业设计有限公司', id: 7 },
        { label: '广州市银宝山新汽车零部件有限公司', id: 8 },
        { label: '广东银宝山新科技有限公司', id: 9 },
        { label: '深圳市博慧热流道科技有限公司', id: 10 },
        { label: '武汉市银宝山新模塑科技有限公司', id: 11 },
        { label: '南通银宝山新科技有限公司', id: 12 }
      ],
      // 表格数据
      tableData: {}
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
