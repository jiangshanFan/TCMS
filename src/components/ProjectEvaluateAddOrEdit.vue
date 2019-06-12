<template>
  <div class="ProjectEvaluateAddOrEdit p20">
    <el-row>
      <el-col :span="16" :offset="4">
        <h1>姓名：{{basicInfo.name}}</h1>

        <el-form :model="basicInfo" :rules="rules" ref="ProjectEvaluateAddOrEdit" label-width="120px" label-position="right" size="mini">

          <el-row :gutter="10" class="spec">
            <el-col :span="12">
              <el-form-item label="指标1自评分：" prop="oneSelfGraded" label-width="120px">
                <el-input style="width:100%;" v-model="basicInfo.oneSelfGraded" clearable @change="basicInfo.oneSelfGraded = basicInfo.oneSelfGraded.replace(/[^0-9-]+/,'')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="指标1项目负责人评分：" prop="empName" label-width="180px">
                <el-input style="width:100%;" v-model="basicInfo.oneIndicatorGraded" clearable @change="basicInfo.oneIndicatorGraded = basicInfo.oneIndicatorGraded.replace(/[^0-9-]+/,'')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="指标2自评分：" prop="techInterfaceDept" label-width="120px">
                <el-input style="width:100%;" v-model="basicInfo.twoSelfGraded" clearable @change="basicInfo.twoSelfGraded = basicInfo.twoSelfGraded.replace(/[^0-9-]+/,'')"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="指标2项目负责人评分：" prop="supportAmount" label-width="180px">
                <el-input style="width:100%;" v-model="basicInfo.twoIndicatorGraded" clearable @change="basicInfo.twoIndicatorGraded = basicInfo.twoIndicatorGraded.replace(/[^0-9-]+/,'')"></el-input>
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
    },
    mounted() {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res= await revampProjectMember(this.basicInfo);
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
      return {
        // all info
        basicInfo: {},

        rules: {

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
