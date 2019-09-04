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
            <el-select v-model="basicInfo.empName" filterable remote reserve-keyword placeholder="请输入责任人名称进行查询"
                       :remote-method="searchNames"
                       :loading="loading"
                       style="width:100%"
                       @change="basicInfo.empNo = basicInfo.empName"
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
            <el-input style="width:100%;" v-model="basicInfo.supportAmount" clearable placeholder="单位/元"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="自筹经费：" prop="raiseAmount">
            <el-input style="width:100%;" v-model="basicInfo.raiseAmount" clearable placeholder="单位/元"></el-input>
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
import { addProjectInformation, editProjectInformation, getEmployeesInfoList, } from '../axios/api.js'
  export default {
    name: "ProjectAddOrEdit",
    created() {
      this.basicInfo = Object.assign({},this.$store.getters.project_list);
      for (let i of Object.keys(this.basicInfo)) {
        if ('supportAmount|raiseAmount|projectCostTotal'.match(i)) {
          this.basicInfo[i] = parseFloat(this.basicInfo[i]) / 100;
        }
      }
      console.log(this.basicInfo);
      if (!this.basicInfo.status) {
        this.basicInfo = {
          status: 3,
          bidding: 0,
          type: 1,
        }
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
            let params = {...this.basicInfo};
            for (let index of Object.keys(params)) {
              if ('supportAmount|raiseAmount'.match(index)) {
                params[index] = parseFloat(params[index]) * 100;
              }
            }
            let res;
            if (this.choose === 0) {
              res = await addProjectInformation(params);
            } else {
              res = await editProjectInformation(params);
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
      let validate1 = (rule, value, callback) => {
        if (!value) {
          value = "";
          callback();
        } else {
          if (!/^\d+(\.\d{1,2})?$/.test(value)) {
            callback(new Error('输入有误，请核对'));
            Message({showClose: true, type: 'error', message: '提示“小数点后2位”！'})
          } else {
            callback();
          }
        }
      };
      return {
        // all info
        basicInfo: {},
        loading: false, //下拉列表请求后提示加载中
        listDown: [],

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
          supportAmount: [{ validator: validate1, trigger: ['blur']},],
          raiseAmount: [{ validator: validate1, trigger: ['blur']},],
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
