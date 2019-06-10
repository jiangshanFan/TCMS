<template>
 <div class="PatentAddOrEdit p20">
   <h1 v-if="Object.keys($store.getters.knowledge_patentFollow).length">专利编号：{{basicInfo.patentCode}}</h1>

   <el-form :model="basicInfo" :rules="rules" ref="PatentAddOrEdit" label-width="120px" label-position="right" size="mini">

     <el-row :gutter="10" class="spec">
       <el-col :span="6">
         <el-form-item label="专利名称：" prop="patentName">
           <el-input style="width:100%;" v-model="basicInfo.patentName" clearable maxlength="64"></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="专利申请号：" prop="patentApplyNum">
           <span class="fl" style="display:inline-block;width:20px;">ZL</span>
           <el-input style="width:calc(100% - 20px);" v-model="basicInfo.patentApplyNum" clearable></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="专利状态：" prop="status">
           <el-select v-model="basicInfo.status" placeholder="请选择" style="width:100%;">
             <el-option v-for="item in options.status" :key="item.id" :label="item.label" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="专利类型：" prop="type">
           <el-select v-model="basicInfo.type" placeholder="请选择" style="width:100%;">
             <el-option v-for="item in options.type" :key="item.id" :label="item.label" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="交底书名称：" prop="disclosurePaperDTO.paperName">
           <el-select v-model="basicInfo.disclosurePaperDTO.paperName" maxlength="64" filterable remote reserve-keyword placeholder="请输入交底书名称"
                      :remote-method="searchPaperNames"
                      :loading="loading"
                      @change="selectPaperNames">
             <el-option v-for="item in listDown" :key="item.paperCode" :label="item.paperName" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="交底书编码：" prop="disclosurePaperDTO.paperCode">
           <span>{{basicInfo.disclosurePaperDTO.paperCode}}</span>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="专利权人：" prop="patentee">
           <el-select v-model="basicInfo.patentee" placeholder="请选择" style="width:100%;">
             <el-option v-for="item in options.patentee" :key="item.id" :label="item.label" :value="item.label"></el-option>
           </el-select>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <!--<span>项目编号：</span><el-input v-model="basicInfo.projectNo" size="mini" clearable></el-input>-->
         <el-form-item label="官方受理时间：" prop="officialAcceptanceTime">
           <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.officialAcceptanceTime" style="width: 100%;"></el-date-picker>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <!--<span>项目编号：</span><el-input v-model="basicInfo.projectNo" size="mini" clearable></el-input>-->
         <el-form-item label="实际授权时间：" prop="realAuthorizeTime">
           <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.realAuthorizeTime" style="width: 100%;"></el-date-picker>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <!--<span>项目编号：</span><el-input v-model="basicInfo.projectNo" size="mini" clearable></el-input>-->
         <el-form-item label="预计授权时间：" prop="planAuthorizeTime">
           <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.planAuthorizeTime" style="width: 100%;"></el-date-picker>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="获取方式：" prop="gainWay">
           <el-select v-model="basicInfo.gainWay" placeholder="请选择">
             <el-option v-for="item in options.gainWay" :key="item.id" :label="item.label" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="第一发明人：" prop="firstInventor">
           <el-input style="width:100%;" v-model="basicInfo.firstInventor" clearable maxlength="64"></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="第二发明人：" prop="secondInventor">
           <el-input style="width:100%;" v-model="basicInfo.secondInventor" clearable maxlength="64"></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="第三发明人：" prop="thirdInventor">
           <el-input style="width:100%;" v-model="basicInfo.thirdInventor" clearable maxlength="64"></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="9">
         <el-form-item label="其他发明人：" prop="otherInventor">
           <el-input style="width:100%;" v-model="basicInfo.otherInventor" clearable maxlength="64"></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="3" class="cc">
         <span>限填7人,用'、'号隔开</span>
       </el-col>
     </el-row>

     <el-row :gutter="10">
       <!--<el-col :span="6">-->
         <!--<el-form-item label="关联项目：" prop="patentName">-->
           <!--<el-button type="primary" size="mini">关联</el-button>-->
         <!--</el-form-item>-->
       <!--</el-col>-->

       <el-col :span="6">
         <el-form-item label="授权费用：" prop="authorizationCost">
           <el-input style="width:100%;" v-model="basicInfo.authorizationCost" clearable></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="授权费OA单号：" prop="authorizationOaOddNum">
           <el-input style="width:100%;" v-model="basicInfo.authorizationOaOddNum" clearable></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6" v-if="Object.keys($store.getters.knowledge_patentFollow).length">
         <el-form-item label="授权费OA状态：" prop="oa_odd_status">
           <span>{{basicInfo.oa_odd_status}}</span>
         </el-form-item>
       </el-col>
     </el-row>

     <el-row :gutter="10">
       <el-col :span="6">
         <el-form-item label="是否有变更：" prop="whetherChange">
           <el-select v-model="basicInfo.whetherChange" placeholder="请选择" style="width:100%;">
             <el-option v-for="item in options.whetherChange" :key="item.id" :label="item.label" :value="item.id"></el-option>
           </el-select>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="变更费用：" prop="changeCost">
           <el-input style="width:100%;" v-model="basicInfo.changeCost" clearable></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6">
         <el-form-item label="变更OA单号：" prop="changeOaOddNum">
           <el-input style="width:100%;" v-model="basicInfo.changeOaOddNum" clearable></el-input>
         </el-form-item>
       </el-col>

       <el-col :span="6" v-if="Object.keys($store.getters.knowledge_patentFollow).length">
         <el-form-item label="变更OA状态：" prop="oa_odd_status">
           <span>{{basicInfo.oa_odd_status}}</span>
         </el-form-item>
       </el-col>
     </el-row>

     <el-col :span="24">
       <el-form-item label="备注：" prop="remark">
         <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="basicInfo.remark"></el-input>
       </el-form-item>
     </el-col>

     <el-col class="tc" :span="24">
       <el-form-item>
         <el-button type="primary" @click="submitForm('PatentAddOrEdit')">确定</el-button>
         <el-button type="plain" @click="resetForm('PatentAddOrEdit')">重置</el-button>
       </el-form-item>
     </el-col>

   </el-form>
 </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { insertPatent, updatePatent, checkPatentApplyNum, getDisclosurePaperListByPaperName, } from '../axios/api.js'
export default {
  name: "PatentAddOrEdit",
  created() {
    let info = this.$store.getters.knowledge_patentFollow;
    if (Object.keys(info).length) {
      this.basicInfo = Object.assign({}, info);
      if (!this.basicInfo.disclosurePaperDTO) {
        this.basicInfo.disclosurePaperDTO = {};
      }
      this.choose = 1;
    } else {
      this.choose = 0;
    }
  },
  mounted() {

  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let ifValid = true;
          if (this.basicInfo.status !== 9 && !this.basicInfo.officialAcceptanceTime) {
            ifValid = false;
          }
          if (ifValid) {
            let res;
            if (this.choose === 0) {
              res = await insertPatent(this.basicInfo);
            } else {
              res = await updatePatent(this.basicInfo);
            }
            if (res.status === 1) {
              if (this.choose === 1) {
                this.$emit('ifChange','edit');
              } else {
                this.$router.push({path: '/patent/patentFollow'});
              }

              Message({showClose: true, type: 'success', message: '新增或更新专利成功！'});
            }
          } else {
            Message({showClose: true, type: 'warning', message: '请填写“官方受理时间！'});
          }
        } else {
          console.log('error submit!!');
          Message({showClose: true, type: 'error', message: '请仔细核对信息，确认无误再点击确定提交！'});
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 根据条件查询客户下拉列表
    searchPaperNames(query) {
      let self = this;
      if (query !== '') {
        self.loading = true;
        setTimeout(async () => {
          self.loading = false;
          self.listDown = (await getDisclosurePaperListByPaperName({paperName	: query})).msg;
        }, 200);
      } else {
        self.listDown = [];
      }
    },

    // 根据选择的交底书名称显示交底书编码
    selectPaperNames(val) {
      this.listDown.forEach(item => {
        if (item.id === val) {
          this.basicInfo.disclosurePaperDTO.paperCode = item.paperCode;
        }
      })
    },
  },
  data() {
    let self = this;
    let validatePatentApplyNum = async (rule, value, callback) => {
      if(!value) {
        value = '';
        callback(new Error('专利申请号不能为空！'));
      } else {
        let valid = false;
        let params = {
          patentAppleNum: this.basicInfo.patentApplyNum,
        };
        if (self.choose) {
          params.id = this.basicInfo.id;
        }
        if (self.basicInfo.patentApplyNum) {
          let res = await checkPatentApplyNum(params);
          valid =  res.status === 1;
        } else {
          valid = false;
        }

        if (!valid) {
          callback(new Error('专利申请号重复！'));
        } else {
          callback();
        }
      }
    };

    return {
      // all info
      basicInfo: {
        status: 1,
        type: 1,
        patentee: '深圳银宝山新',
        gainWay: 1,
        whetherChange: 0,
        disclosurePaperDTO: {},
      },

      options: {
        status: [
          { label: '已受理', id: 1,},
          { label: '初审中', id: 2,},
          { label: '实审中', id: 3,},
          { label: '待缴费', id: 4,},
          { label: '已撤回', id: 5,},
          { label: '已驳回', id: 6,},
          { label: '已放弃', id: 7,},
          { label: '已授权', id: 8,},
          { label: '变更中', id: 9,},
          { label: '已失效', id: 10,},
          { label: '已转让', id: 11,},
        ],
        type: [
          { label: '全部', id: 0,},
          { label: '实用', id: 1,},
          { label: '发明', id: 2,},
          { label: '外观', id: 3,},
          { label: '软件著作权', id: 4,},
        ],
        patentee: [
          { label: '深圳银宝山新', id: 1,},
          { label: '天津银宝山新', id: 2,},
          { label: '惠州银宝山新', id: 3,},
          { label: '长沙银宝山新', id: 4,},
          { label: '深圳白狐', id: 5,},
          { label: '广州银宝山新', id: 6,},
          { label: '广东银宝山新', id: 7,},
          { label: '博慧热流道', id: 8,},
          { label: '武汉银宝山新', id: 9,},
          { label: '南通银宝山新', id: 10,},
        ],
        gainWay: [
          { label: '原始取得', id: 1,},
          { label: '归属转让', id: 2,},
          { label: '授权使用', id: 3,},
        ],
        whetherChange: [
          { label: '不变更', id: 0,},
          { label: '变更', id: 1,},
        ],
      },

      loading: false, //下拉列表请求后提示加载中
      listDown: [],

      rules: {
        patentName: [
          { required: true, message: '专利名称不能为空', trigger: ['blur','change'] },
        ],
        patentApplyNum: [
          { required: true, validator: validatePatentApplyNum, trigger: 'blur'},
        ],
        firstInventor : [
          { required: true, message: '第一发明人不能为空', trigger: ['blur','change'] },
        ],
      },

      // choose api
      choose: 0,
    }
  }
}
</script>

<style scoped>
  .el-form-item__label {
    font-size: 12px !important;
  }
</style>
