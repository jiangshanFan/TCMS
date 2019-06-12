<template>
  <div class="ProjectProgressAddOrEdit p20">
    <el-row>
      <el-col :span="16" :offset="4">
        <!--<h1>姓名：{{basicInfo.name}}</h1>-->

        <el-form :model="basicInfo" :rules="rules" ref="ProjectProgressAddOrEdit" label-width="120px" label-position="right" size="mini">

          <el-row :gutter="10" class="spec">
            <el-col :span="12">
              <el-form-item label="子项目内容：" prop="subprojectContent">
                <el-input style="width:100%;" v-model="basicInfo.subprojectContent" clearable maxLength="16"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="责任人：" prop="name">
                <el-select v-model="basicInfo.name" filterable remote reserve-keyword placeholder="请输入责任人名称进行查询"
                           :remote-method="searchNames"
                           :loading="loading"
                           style="width:100%"
                           @visible-change="val => {let self = this;if(!val) self.listDown=[];}">
                  <el-option v-for="item in listDown" :key="item.empNo" :label="item.name" :value="item.empNo">
                    <span class="fl">{{ item.name }}</span>
                    <span class="fr select_color f12 ml20 disib">
                      <b class="cc">性别：</b><b>{{ item.sex }}</b>
                      <b class="cc">部门：</b><b>{{item.dept}}</b>
                      <b class="cc">职位：</b><b>{{item.position}}</b>
                    </span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="工作内容：" prop="workContent">
                <el-input style="width:100%;" v-model="basicInfo.workContent" clearable maxLength="32"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="计划开始日期：" prop="planStartTime">
                <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.planStartTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计划结束日期：" prop="planEndTime">
                <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.planEndTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="实际开始日期：" prop="realStartTime">
                <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.realStartTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="实际结束日期：" prop="realEndTime">
                <el-date-picker type="date" placeholder="选择日期" v-model="basicInfo.realEndTime" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="完成百分比：" prop="percentComplete">
                <el-input style="width:100%;" v-model="basicInfo.percentComplete" clearable></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" class="spec">
            <el-col>
              <el-form-item label="备注：" prop="remark">
                <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="basicInfo.remark"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-col class="tc mt20" :span="24">
            <el-form-item label-width="0">
              <el-button type="primary" @click="submitForm('ProjectProgressAddOrEdit')">确定</el-button>
              <el-button type="plain" @click="resetForm('ProjectProgressAddOrEdit')">重置</el-button>
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
import { saveProjectProgressManagement, revampProjectProgressManagement, getEmployeesInfoList, } from '../axios/api.js'
  export default {
    name: "ProjectProgressAddOrEdit",
    created() {
      this.basicInfo = Object.assign({},this.$store.getters.project_progress);
      console.log(this.basicInfo)
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
              res = await saveProjectProgressManagement(this.basicInfo);
            } else {
              res = await revampProjectProgressManagement(this.basicInfo);
            }

            if (res.status === 1) {

              this.$emit('ifChange','edit');

              Message({showClose: true, type: 'success', message: '新增或修改项目进度成功！'})
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
      searchNames(query) {
        let self = this;
        self.listDown = [];
        if (query) {
          self.loading = true;
          setTimeout(async () => {
            let res = await getEmployeesInfoList({name: query});
            if (res.status === 1) {
              self.listDown = res.msg;
              self.loading = false;
            }
          }, 200);
        } else {
          self.listDown = [];
        }
      },
    },
    data() {
      return {
        // all info
        basicInfo: {},

        loading: false, //下拉列表请求后提示加载中
        listDown: [],
        rules: {
          subprojectContent: [
            { required: true, message: '子项目内容不能为空！', trigger: ['blur', 'change']},
          ],
          workContent: [
            { required: true, message: '工作内容不能为空！', trigger: ['blur', 'change']},
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

  .select_color {
    color: #8492a6 !important;
  }
</style>
