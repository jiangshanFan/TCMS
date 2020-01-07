<template>
  <div class="ProjectAddOrEdit p20">
    <h1 v-if="Object.keys($store.getters.project_list).length">项目编号：{{basicInfo.projectNum}}</h1>

    <el-form
      :model="basicInfo"
      :rules="rules"
      ref="ProjectAddOrEdit"
      status-icon
      label-width="120px"
      label-position="right"
      size="mini"
      style="padding:0 20px;"
    >
      <el-row :gutter="40" class="spec">
        <el-row>
          <el-col :span="6" v-if="choose===1">
            <el-form-item label="项目编号：">
              <span style="width:100%;">{{basicInfo.projectNum}}</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="项目类型：" prop="type">
              <el-select v-model="basicInfo.type" placeholder="请选择">
                <el-option
                  v-for="item in options.type"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="6" v-if="basicInfo.type === 1 || basicInfo.type === 3">
            <el-form-item label="项目主导" prop="projectLead">
              <el-select v-model="basicInfo.projectLead" placeholder="请选择">
                <el-option
                  v-for="item in options.lead"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="项目名称：" prop="projectName">
              <el-input
                style="width:100%;"
                v-model="basicInfo.projectName"
                clearable
                maxlength="32"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- <el-col :span="6">
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
        </el-col>-->

        <el-row v-if="choose ===1 || basicInfo.type === 1 || basicInfo.type === 3">
          <el-col :span="6" v-if="choose===1">
            <el-form-item label="项目负责人：">
              <span style="width:100%;">{{basicInfo.userName}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item
              label="非银宝负责人："
              prop="projectLeader"
              v-if="basicInfo.type === 1 || basicInfo.type === 3"
            >
              <el-input
                style="width:100%;"
                v-model="basicInfo.projectLeader"
                clearable
                maxlength="32"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item
              label="其他管理人员："
              prop="otherLeader"
              v-if="basicInfo.type === 1 || basicInfo.type === 3"
            >
              <el-input
                style="width:100%;"
                v-model="basicInfo.otherLeader"
                clearable
                maxlength="32"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="项目状态：" prop="status">
              <el-select v-model="basicInfo.status" placeholder="请选择">
                <el-option
                  v-for="item in options.status"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="计划开始日期：" prop="projectStartTime">
              <el-date-picker
                @change="planStr(basicInfo.projectStartTime)"
                type="date"
                placeholder="选择日期"
                v-model="basicInfo.projectStartTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="计划结束日期：" prop="projectEndTime">
              <el-date-picker
                @change="endPlan(basicInfo.projectEndTime)"
                type="date"
                placeholder="选择日期"
                v-model="basicInfo.projectEndTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="项目验收日期：" prop="projectAcceptTime">
              <el-date-picker
                @change="projectT(basicInfo.projectAcceptTime)"
                type="date"
                placeholder="选择日期"
                v-model="basicInfo.projectAcceptTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="科技接口部门：" prop="techInterfaceDept">
              <el-input
                style="width:100%;"
                onblur="value=value.replace(/[^\u4e00-\u9fa5]/g,'')"
                v-model="basicInfo.techInterfaceDept"
                maxlength="12"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="资助总额：" prop="supportAmount">
              <el-input
                @blur="supportAmountBlur(basicInfo.supportAmount)"
                style="width:calc(100% - 30px);"
                v-model="basicInfo.supportAmount"
                clearable
              ></el-input>
              <span class="fr" style=" display:inline-block;">万元</span>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="自筹经费：" prop="raiseAmount">
              <el-input
                @blur="raiseAmountBlur(basicInfo.raiseAmount)"
                style="width:calc(100% - 30px);"
                v-model="basicInfo.raiseAmount"
                clearable
              ></el-input>
              <span class="fr" style=" display:inline-block;">万元</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="6">
            <el-form-item label="项目总预算：" prop="projectCostTotal">
              <span v-if="projectCostTotal">{{projectCostTotal}}万元</span>
            </el-form-item>
          </el-col>

          <el-col :span="6">
            <el-form-item label="是否招投标：" prop="bidding">
              <el-select v-model="basicInfo.bidding" placeholder="请选择">
                <el-option
                  v-for="item in options.bidding"
                  :key="item.id"
                  :label="item.label"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
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
import { Message, MessageBox, Loading } from "element-ui";
/** 导入api.js */
import {
  addProjectInformation,
  editProjectInformation,
  getEmployeesInfoList
} from "../axios/api.js";
export default {
  name: "ProjectAddOrEdit",
  created() {
    this.basicInfo = Object.assign({}, this.$store.getters.project_list);
    for (let i of Object.keys(this.basicInfo)) {
      if ("supportAmount|raiseAmount|projectCostTotal".match(i)) {
        if (this.basicInfo[i]) {
          this.basicInfo[i] = parseFloat(this.basicInfo[i]) / 1000000;
        }
      }
    }
    if (!this.basicInfo.status) {
      this.basicInfo = {
        status: 3,
        bidding: 0,
        type: 1
      };
    }
  },
  mounted() {
    if (!this.basicInfo.projectName) {
      this.choose = 0;
    } else {
      this.choose = 1;
    }
    if (this.choose === 1) {
      this.projectCostTotal =
        +this.basicInfo.raiseAmount + +this.basicInfo.supportAmount;
      this.timeStrat = new Date(this.basicInfo.projectStartTime).getTime();
      this.proTimeEnd = new Date(this.basicInfo.projectAcceptTime).getTime();
      this.timeEnd = new Date(this.basicInfo.projectEndTime).getTime();
      if (
        this.basicInfo.projectAcceptTime !== "" &&
        this.basicInfo.projectStartTime !== ""
      ) {
        if (this.timeStrat > this.proTimeEnd) {
          this.$message({
            type: "warning",
            message: "项目验收时间不得小于计划开始时间"
          });
          this.basicInfo.projectAcceptTime = "";
        }
      }
      if (this.basicInfo.projectAcceptTime !== "") {
        if (this.proTimeEnd > this.timeEnd) {
          this.$message({
            type: "warning",
            message: "项目验收时间不得大于计划结束时间"
          });
          this.basicInfo.projectAcceptTime = "";
        }
      }
      if (
        this.basicInfo.projectStartTime !== "" &&
        this.basicInfo.projectStartTime !== ""
      ) {
        if (this.timeStrat > this.timeEnd) {
          this.$message({
            type: "warning",
            message: "计划结束时间不得小于计划开始时间"
          });
          this.basicInfo.projectEndTime = "";
        }
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let params = { ...this.basicInfo };
          for (let index of Object.keys(params)) {
            if ("supportAmount|raiseAmount".match(index)) {
              if (params[index]) {
                params[index] = parseFloat(params[index]) * 1000000;
              }
            }
          }
          if (this.choose === 0) {
            this.$confirm(`是否新增项目，项目添加成功后将不能删除！`, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(async () => {
                let reg = await addProjectInformation(params);
                if (reg.status === 1) {
                  this.$router.push({ path: "/project/projectList" });
                  Message({
                    showClose: true,
                    type: "success",
                    message: "新增或更新项目成功！"
                  });
                }
              })
              .catch(() => {
                this.$message({ type: "info", message: "已取消提交" });
              });
          } else {
            let res = await editProjectInformation(params);
            if (res.status === 1) {
              this.$emit("ifChange", "edit");
              Message({
                showClose: true,
                type: "success",
                message: "新增或更新项目成功！"
              });
            }
          }
          // if (res.status === 1) {
          //   if (this.choose === 1) {
          //     this.$emit("ifChange", "edit");
          //   } else {
          //     this.$router.push({ path: "/project/projectList" });
          //   }
          // }
        } else {
          console.log("error submit!!");
          Message({
            showClose: true,
            type: "error",
            message: "请仔细核对信息，确认无误再点击确定提交！"
          });
          return false;
        }
      });
    },
    supportAmountBlur(val) {
      if (this.basicInfo.raiseAmount === undefined) {
        this.projectCostTotal = +val;
      } else {
        this.projectCostTotal = +val + +this.basicInfo.raiseAmount;
      }
    },
    raiseAmountBlur(val) {
      if (this.basicInfo.supportAmount === undefined) {
        this.projectCostTotal = +val;
      } else {
        this.projectCostTotal = +val + +this.basicInfo.supportAmount;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 计划开始时间
    planStr(val) {
      this.timeStrat = new Date(val).getTime();
    },
    // 项目验收时间
    projectT(val) {
      this.proTimeEnd = new Date(val).getTime();
      if (
        this.basicInfo.projectAcceptTime !== "" &&
        this.basicInfo.projectStartTime !== ""
      ) {
        if (this.timeStrat > this.proTimeEnd) {
          this.$message({
            type: "warning",
            message: "项目验收时间不得小于计划开始时间"
          });
          this.basicInfo.projectAcceptTime = "";
        }
      }
      if (this.basicInfo.projectAcceptTime !== "") {
        if (this.proTimeEnd > this.timeEnd) {
          this.$message({
            type: "warning",
            message: "项目验收时间不得大于计划结束时间"
          });
          this.basicInfo.projectAcceptTime = "";
        }
      }
    },
    // 计划结束时间
    endPlan(val) {
      this.timeEnd = new Date(val).getTime();
      if (
        this.basicInfo.projectStartTime !== "" &&
        this.basicInfo.projectStartTime !== ""
      ) {
        if (this.timeStrat > this.timeEnd) {
          this.$message({
            type: "warning",
            message: "计划结束时间不得小于计划开始时间"
          });
          this.basicInfo.projectEndTime = "";
        }
      }
    }
    // 根据条件查询客户下拉列表
    // searchNames(query) {
    //   let self = this;
    //   self.listDown = [];
    //   if (query) {
    //     self.loading = true;
    //     setTimeout(async () => {
    //       let res = await getEmployeesInfoList({name: query});
    //       if (res.status === 1) {
    //         self.listDown = res.msg;
    //         self.loading = false;
    //       }
    //     }, 200);
    //   } else {
    //     self.listDown = [];
    //   }
    // },
  },
  data() {
    let validate1 = (rule, value, callback) => {
      if (!value) {
        value = "";
        callback();
      } else {
        if (!/^\d{1,8}(\.\d{1,6})?$/.test(value)) {
          callback(new Error("输入有误，请核对"));
          Message({
            showClose: true,
            type: "error",
            message: "提示“小数点后6位”！"
          });
        } else {
          callback();
        }
      }
    };
    return {
      projectCostTotal: "",
      // all info
      basicInfo: {},
      loading: false, //下拉列表请求后提示加载中
      listDown: [],
      options: {
        status: [
          { id: 1, label: "规划中" },
          { id: 2, label: "待审批" },
          { id: 3, label: "进行中" },
          { id: 4, label: "已关闭" },
          { id: 5, label: "验收中" },
          { id: 6, label: "已完成" },
          { id: 7, label: "已暂停" }
        ],
        type: [
          { id: 1, label: "政府合作项目" },
          { id: 2, label: "企业内部项目" },
          { id: 3, label: "企业间合作项目" },
          { id: 4, label: "技术中心预研究项目" }
        ],
        bidding: [{ id: 0, label: "否" }, { id: 1, label: "是" }],
        // 项目主导
        lead: [{ label: "银宝山新", id: 1 }, { label: "非银宝山新", id: 2 }]
      },

      rules: {
        projectName: [
          {
            required: true,
            message: "项目名称不能为空",
            trigger: ["blur", "change"]
          }
        ],
        empName: [
          {
            required: true,
            message: "项目负责人不能为空",
            trigger: ["blur", "change"]
          }
        ],
        supportAmount: [{ validator: validate1, trigger: ["blur"] }],
        raiseAmount: [{ validator: validate1, trigger: ["blur"] }]
      },

      // choose api
      choose: 0,
      // 计划开始时间
      timeStrat: "",
      // 计划结束时间
      timeEnd: "",
      // 项目验收时间
      proTimeEnd: ""
    };
  }
};
</script>

<style scoped>
.el-form-item__label {
  font-size: 12px !important;
}
</style>
