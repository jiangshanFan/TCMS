<template>
  <div class="ProjectAddOrEdit p20">
    <h1 v-if="Object.keys($store.getters.project_list).length">项目编号：{{basicInfo.projectNum}}</h1>

    <el-form :model="basicInfo" :rules="rules" ref="ProjectAddOrEdit" label-width="120px" label-position="right" size="mini">

      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="项目名称：" prop="projectName">
            <el-input style="width:100%;" v-model="basicInfo.projectName" clearable maxlength="32"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="项目负责人：" prop="empName">
            <el-input style="width:100%;" v-model="basicInfo.empName" clearable maxlength="12"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="项目类型：" prop="type">
            <el-select v-model="basicInfo.type" placeholder="请选择">
              <el-option v-for="item in options.type" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="项目状态：" prop="status">
            <el-select v-model="basicInfo.status" placeholder="请选择">
              <el-option v-for="item in options.status" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="计划开始日期：" prop="projectStartTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.projectStartTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="计划结束日期：" prop="projectEndTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.projectEndTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="项目验收日期：" prop="projectAcceptTime">
            <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.projectAcceptTime" style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="科技接口部门：" prop="techInterfaceDept">
            <el-input style="width:100%;" v-model="basicInfo.techInterfaceDept" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="资助总额：" prop="supportAmount">
            <el-input style="width:100%;" v-model="basicInfo.supportAmount" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="自筹经费：" prop="raiseAmount">
            <el-input style="width:100%;" v-model="basicInfo.raiseAmount" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="Object.keys($store.getters.project_list).length">
          <el-form-item label="项目总预算：" prop="projectCostTotal">
            <span>{{basicInfo.projectCostTotal}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="是否招投标：" prop="bidding">
            <el-select v-model="basicInfo.bidding" placeholder="请选择">
              <el-option v-for="item in options.bidding" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-col class="tc mt20" :span="24">
        <el-form-item label-width="0">
          <el-button type="primary" @click="submitForm('ProjectAddOrEdit')">确定</el-button>
          <el-button type="plain" @click="resetForm('ProjectAddOrEdit')">重置</el-button>
        </el-form-item>
      </el-col>

    </el-form>

  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
/** 导入api.js */
import { addProjectInformation, editProjectInformation, } from '../axios/api.js'
  export default {
    name: "ProjectAddOrEdit",
    created() {
      this.basicInfo = Object.assign({},this.$store.getters.project_list);
      console.log(this.basicInfo);
      if (!this.basicInfo.status) {
        this.basicInfo.status = 3;
        this.basicInfo.bidding = 0;
        this.basicInfo.type = 1;
      }
    },
    mounted() {
      if (!this.basicInfo.projectName) {
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
              res = await addProjectInformation(this.basicInfo);
            } else {
              res = await editProjectInformation(this.basicInfo);
            }
            if (res.status === 1) {
              if (this.choose === 1) {
                this.$emit('ifChange','edit');
              } else {
                this.$router.push({path: '/project/projectList'});
              }

              Message({showClose: true, type: 'success', message: '新增或更新项目成功！'})
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

        options: {
          status: [
            { id: 1, label: '规划中'},
            { id: 2, label: '待审批'},
            { id: 3, label: '进行中'},
            { id: 4, label: '已关闭'},
            { id: 5, label: '验收中'},
            { id: 6, label: '已完成'},
          ],
          type: [
            { id: 1, label: '政府合作项目'},
            { id: 2, label: '企业内部项目'},
            { id: 3, label: '企业间合作项目'},
            { id: 4, label: '科研预研究项目'},
          ],
          bidding: [
            { id: 0, label: '否'},
            { id: 1, label: '是'},
          ],
        },


        rules: {
          projectName: [
            { required: true, message: '项目名称不能为空', trigger: ['blur','change'] },
          ],
          empName: [
            { required: true, message: '项目负责人不能为空', trigger: ['blur','change'] },
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
