<template>
  <div class="SubmissionAddOrEdit p20">
    <h1 v-if="Object.keys($store.getters.knowledge_submission).length">交底书编号：{{basicInfo.paperCode}}</h1>

    <el-form
      :model="basicInfo"
      :rules="rules"
      ref="SubmissionAddOrEdit"
      label-width="120px"
      label-position="right"
      size="mini"
    >
      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="交底书名称：" prop="paperName">
            <el-input style="width:100%;" v-model="basicInfo.paperName" clearable maxlength="32"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <!--<span>项目编号：</span><el-input v-model="basicInfo.projectNo" size="mini" clearable></el-input>-->
          <el-form-item label="计划完成时间：" prop="planTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="basicInfo.planTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="实际完成时间：" prop="realTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="basicInfo.realTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="交底书负责人：" prop="charge">
            <el-input style="width:100%;" v-model="basicInfo.charge" clearable maxlength="12"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="代理方：" prop="agent">
            <el-input style="width:100%;" maxlength="16" v-model="basicInfo.agent" clearable></el-input>
            <template v-slot:error>
              <span></span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="代理受理时间：" prop="agentHandleTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="basicInfo.agentHandleTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="代理费：" prop="agentCost">
            <el-input
              oninput="value=value.replace(/[^\d,\.]/g,'')"
              maxlength="11"
              style="width:100%;"
              v-model="basicInfo.agentCost"
              clearable
            ></el-input>
            <template v-slot:error>
              <span></span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="官费：" prop="officialFee">
            <el-input
              oninput="value=value.replace(/[^\d,\.]/g,'')"
              maxlength="11"
              style="width:100%;"
              v-model="basicInfo.officialFee"
              clearable
            ></el-input>
            <template v-slot:error>
              <span></span>
            </template>
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
            <el-input
              maxlength="15"
              style="width:100%;"
              @blur="downBlur"
              v-model="basicInfo.oaOddNum"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="OA单状态：" prop="oaOddStatus">
            <span
              v-if="Object.keys($store.getters.knowledge_submission).length"
            >{{basicInfo.oaOddStatus}}</span>
            <span v-else>{{oaDicition}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="技术支持：" prop="techSupport">
            <el-input style="width:100%;" maxlength="35" v-model="basicInfo.techSupport" clearable></el-input>
            <template v-slot:error>
              <span></span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="cc">
          <el-form-item label prop>
            <span>限填5人,用“、”号隔开</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-col :span="24">
        <el-form-item label="备注：" prop="remark">
          <el-input
            type="textarea"
            :rows="5"
            resize="none"
            placeholder="请输入内容"
            v-model="basicInfo.remark"
            maxlength="300"
            :show-word-limit="true"
          ></el-input>
        </el-form-item>
      </el-col>

      <el-col class="tc mt20" :span="24">
        <el-form-item label-width="0">
          <el-button type="primary" @click="submitForm('SubmissionAddOrEdit')">确定</el-button>
          <el-button type="plain" @click="resetForm('SubmissionAddOrEdit')">重置</el-button>
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
  insertDisclosurePaper,
  updateDisclosurePaper,
  queryOfficeAutomationInformation
} from "../axios/api.js";
export default {
  name: "SubmissionAddOrEdit",
  created() {
    /*let info = this.$store.getters.knowledge_submission;
      if (Object.keys(info).length) {
        this.basicInfo = Object.assign({}, info);
      }*/
    this.basicInfo = Object.assign(
      { status: 1 },
      this.$store.getters.knowledge_submission
    );
    for (let i of Object.keys(this.basicInfo)) {
      if (/(agentCost|officialFee)/.test(i)) {
        if (this.basicInfo[i]) {
          this.basicInfo[i] = parseFloat(this.basicInfo[i]) / 100;
        }
      }
    }
    this.isShow = this.basicInfo;
    /*if (!Object.keys(this.basicInfo).length) {
        this.basicInfo = {
          status: 1,  // 定义对象初始化，若要定义子对象，必须先初始化对象，即先放入此对象
        };
      }*/
  },
  mounted() {
    if (Object.keys(this.basicInfo).length === 1) {
      this.choose = 0;
    } else {
      this.choose = 1;
    }
  },
  methods: {
    // OA单号失去焦点事件

    async downBlur() {
      if (
        this.basicInfo.oaOddNum !== undefined &&
        this.basicInfo.oaOddNum !== ""
      ) {
        let res = await queryOfficeAutomationInformation({
          mathCode: this.basicInfo.oaOddNum
        });
        if (res.status === 1) {
          this.oaDicition = res.msg.documentsState;
          this.basicInfo.oaOddStatus = res.msg.documentsState;
        }
      } else {
        return;
      }
    },

    async submitForm(formName) {
      this.sub = true;
      let arr = [];
      this.$refs[formName].validateField(["paperName", "charge"], valid => {
        console.log(valid);
        if (valid) {
          arr.push(false);
        } else {
          arr.push(true);
        }
      });
      arr.forEach(item => {
        if (!item) {
          this.sub = false;
          return;
        }
      });
      if (this.sub) {
        let params = { ...this.basicInfo };
        for (let index of Object.keys(params)) {
          if (/(agentCost|officialFee)/.test(index)) {
            if (params[index]) {
              params[index] = parseFloat(params[index]) * 100;
            }
          }
        }
        let res;
        if (this.choose === 0) {
          res = await insertDisclosurePaper(params);
        } else {
          res = await updateDisclosurePaper(params);
        }
        if (res.status === 1) {
          if (this.choose === 1) {
            this.$emit("ifChange", "edit");
          } else {
            this.$router.push({ path: "/patent/Submission" });
          }

          Message({
            showClose: true,
            type: "success",
            message: "新增或更新交底书成功！"
          });
        }
      } else if (!this.sub) {
        console.log("error submit!!");
        Message({
          showClose: true,
          type: "error",
          message: "请仔细核对信息，确认无误再点击确定提交！"
        });
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  data() {
    // 代理费
    let validate1 = (rule, value, callback) => {
      let res = this.$money(this.basicInfo.agentCost);
      if (res === 1) {
        callback();
      } else {
        callback(new Error());
        this.basicInfo.agentCost = "";
      }
    };
    // 代理方
    let validate2 = (rule, value, callback) => {
      if (value !== undefined && value !== null) {
        let res = this.$len(32, value);
        if (res === 1) {
          callback();
        } else {
          callback(new Error());
        }
      }
    };
    // 官费
    let validate3 = (rule, value, callback) => {
      let res = this.$money(this.basicInfo.officialFee);
      if (res === 1) {
        callback();
      } else {
        callback(new Error());
        this.basicInfo.officialFee = "";
      }
    };
    // 技术支持
    let validate4 = (rule, value, callback) => {
      if (
        this.basicInfo.techSupport !== undefined &&
        this.basicInfo.techSupport !== null
      ) {
        let arr = [];
        arr = this.basicInfo.techSupport.split("、");
        if (arr.length > 5) {
          this.$message({
            type: "warning",
            message: "限填写5人！"
          });
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    return {
      // all info
      basicInfo: {},

      // oa单状态
      oaDicition: "",
      status: [
        { id: 1, label: "项目启动" },
        { id: 2, label: "交底完成" },
        { id: 3, label: "已委托代理" },
        { id: 4, label: "委托终止" },
        { id: 5, label: "确认代理" },
        { id: 6, label: "缴费中" },
        { id: 7, label: "代理完成" }
      ],

      rules: {
        paperName: [
          {
            required: true,
            message: "交底书名称不能为空",
            trigger: ["blur", "change"]
          }
        ],
        charge: [
          {
            required: true,
            message: "交底书负责人不能为空",
            trigger: ["blur", "change"]
          }
        ],
        agentCost: [
          {
            required: false,
            validator: validate1,
            trigger: ["blur"]
          }
        ],
        officialFee: [
          {
            required: false,
            validator: validate3,
            trigger: ["blur"]
          }
        ],
        agent: [
          {
            required: false,
            validator: validate2,
            trigger: ["blur", "change"]
          }
        ],
        techSupport: [
          {
            required: false,
            validator: validate4,
            trigger: ["blur", "change"]
          }
        ]
      },

      // choose api
      choose: 0,
      // 判断是否提交
      sub: true,
      // 编辑非空判断项
      isShow: {},
      // 必填项不为空判断
      must: true,
      // 编辑必填项不为空判断
      editMust: true
    };
  }
};
</script>

<style scoped>
.el-form-item__label {
  font-size: 12px !important;
}
</style>
