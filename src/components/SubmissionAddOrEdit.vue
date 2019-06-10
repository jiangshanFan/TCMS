<template>
  <div class="SubmissionAddOrEdit p20">
    <h1 v-if="Object.keys($store.getters.knowledge_submission).length">交底书编号：{{basicInfo.paperCode}}</h1>

    <el-form :model="basicInfo" :rules="rules" ref="SubmissionAddOrEdit" label-width="120px" label-position="right" size="mini">

      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="交底书名称：" prop="paperName">
            <el-input style="width:100%;" v-model="basicInfo.paperName" clearable maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!--<span>项目编号：</span><el-input v-model="basicInfo.projectNo" size="mini" clearable></el-input>-->
          <el-form-item label="计划完成时间：" prop="planTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.planTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际完成时间：" prop="realTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.realTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="交底书负责人：" prop="charge">
            <el-input style="width:100%;" v-model="basicInfo.charge" clearable maxlength="12"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="代理方：" prop="agent">
            <el-input style="width:100%;" v-model="basicInfo.agent" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="代理受理时间：" prop="agentHandleTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.agentHandleTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="代理费：" prop="agentCost">
            <el-input style="width:100%;" v-model="basicInfo.agentCost" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="官费：" prop="officialFee">
            <el-input style="width:100%;" v-model="basicInfo.officialFee" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="交底书状态：" prop="status">
            <el-select v-model="basicInfo.status" placeholder="请选择">
              <el-option v-for="item in status" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="OA单号：" prop="oaOddNum">
            <el-input style="width:100%;" v-model="basicInfo.oaOddNum" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="Object.keys($store.getters.knowledge_submission).length">
          <el-form-item label="OA单状态：" prop="oa_odd_status">
            <span>{{basicInfo.oa_odd_status}}</span>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="技术支持：" prop="techSupport">
            <el-input style="width:100%;" v-model="basicInfo.techSupport" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="cc">
          <el-form-item label="" prop="">
            <span>限填5人,用“、”号隔开</span>
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
          <el-button type="primary" @click="submitForm('SubmissionAddOrEdit')">确定</el-button>
          <el-button type="plain" @click="resetForm('SubmissionAddOrEdit')">重置</el-button>
        </el-form-item>
      </el-col>

    </el-form>

  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { insertDisclosurePaper, updateDisclosurePaper, } from '../axios/api.js'
  export default {
    name: "SubmissionAddOrEdit",
    created() {
      this.basicInfo = Object.assign({},this.$store.getters.knowledge_submission);
      console.log(this.basicInfo);
      if (!this.basicInfo.status) {
        this.basicInfo.status = 1;
      }
    },
    mounted() {
      if (Object.keys(this.basicInfo).length === 1) {
        this.choose = 0;
      } else {
        this.choose = 1;
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res;
            if (this.choose === 0) {
              res = await insertDisclosurePaper(this.basicInfo);
            } else {
              res = await updateDisclosurePaper(this.basicInfo);
            }
            if (res.status === 1) {
              if (this.choose === 1) {
                this.$emit('ifChange','edit');
              } else {
                this.$router.push({path: '/patent/Submission'});
              }

              Message({showClose: true, type: 'success', message: '新增或更新交底书成功！'})
            }
          } else {
            console.log('error submit!!');
            Message({showClose: true, type: 'error', message: '请仔细核对信息，确认无误再点击确定提交！'})
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
    data() {
      return {
        // all info
        basicInfo: {},

        status: [
          { id: 1, label: '项目启动'},
          { id: 2, label: '交底完成'},
          { id: 3, label: '已委托代理'},
          { id: 4, label: '委托终止'},
          { id: 5, label: '确认代理'},
          { id: 6, label: '缴费中'},
          { id: 7, label: '代理完成'},
        ],

        rules: {
          paperName: [
            { required: true, message: '交底书名称不能为空', trigger: ['blur','change'] },
          ],
          charge: [
            { required: true, message: '交底书负责人不能为空', trigger: ['blur','change'] },
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
