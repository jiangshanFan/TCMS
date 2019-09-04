<template>
  <div class="ProjectEvaluateAddOrEdit p20">
    <el-row>
      <el-col :span="16" :offset="4">
        <h1>姓名：{{basicInfo.name}}</h1>

        <el-form :model="basicInfo" :rules="rules" ref="ProjectEvaluateAddOrEdit" label-width="120px" label-position="right" size="mini">

          <el-row :gutter="10" class="spec">
            <!-- @change="basicInfo = { ...basicInfo, oneSelfGraded: basicInfo.oneSelfGraded.replace(/[^0-9]+/,'') }"-->
            <el-col :span="12">
              <el-form-item label="指标1自评分：" prop="oneSelfGraded" label-width="120px">
                <el-input style="width:100%;" v-model="basicInfo.oneSelfGraded" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="指标1项目负责人评分：" prop="oneIndicatorGraded" label-width="180px">
                <el-input style="width:100%;" v-model="basicInfo.oneIndicatorGraded" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="指标2自评分：" prop="twoSelfGraded" label-width="120px">
                <el-input style="width:100%;" v-model="basicInfo.twoSelfGraded" clearable></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="指标2项目负责人评分：" prop="twoIndicatorGraded" label-width="180px">
                <el-input style="width:100%;" v-model="basicInfo.twoIndicatorGraded" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="spec">
            <el-col>
              <el-form-item label="说明：" prop="remark">
                <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="basicInfo.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-col class="tc mt20" :span="24">
            <el-form-item label-width="0">
              <el-button type="primary" @click="submitForm('ProjectEvaluateAddOrEdit')">确定</el-button>
              <el-button type="plain" @click="resetForm('ProjectEvaluateAddOrEdit')">重置</el-button>
            </el-form-item>
          </el-col>

        </el-form>
      </el-col>
    </el-row>

  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { revampProjectMember, } from '../axios/api.js'
  export default {
    name: "ProjectEvaluateAddOrEdit",
    created() {
      this.basicInfo = Object.assign({},this.$store.getters.project_evaluate);
      for (let i of Object.keys(this.basicInfo)) {
        if ('oneSelfGraded|oneIndicatorGraded|twoSelfGraded|twoIndicatorGraded'.match(i)) {
          this.basicInfo[i] = parseFloat(this.basicInfo[i]) / 100;
        }
      }
    },
    mounted() {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let params = {...this.basicInfo};
            for (let index of Object.keys(params)) {
              if ('oneSelfGraded|oneIndicatorGraded|twoSelfGraded|twoIndicatorGraded'.match(index)) {
                params[index] = parseFloat(params[index]) * 100;
              }
            }
            let res= await revampProjectMember(params);
            if (res.status === 1) {

              this.$emit('ifChange','edit');

              Message({showClose: true, type: 'success', message: '修改成员考评成功！'})
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
      }
    },
    data() {
      let validate1 = (rule, value, callback) => {
        if (!value) {
          value = "";
          callback();
        } else {
          if (!/^\d(\.\d)?$/.test(value)) {
            callback(new Error('输入有误，请核对'));
            Message({showClose: true, type: 'error', message: '提示“小数点前1位，小数点后1位”！'})
          } else {
            callback();
          }
        }
      };
      return {
        // all info
        basicInfo: {},

        rules: {
          oneSelfGraded: [{ validator: validate1, trigger: ['blur']},],
          oneIndicatorGraded: [{ validator: validate1, trigger: ['blur']},],
          twoSelfGraded: [{ validator: validate1, trigger: ['blur']},],
          twoIndicatorGraded: [{ validator: validate1, trigger: ['blur']},],
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
