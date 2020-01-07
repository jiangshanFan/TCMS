<template>
  <div class="TechArticleAddOrEdit p20">
    <h1
      v-if="Object.keys($store.getters.knowledge_techArticle).length"
    >论文编号：{{basicInfo.dissertationCode}}</h1>

    <el-form
      :model="basicInfo"
      :rules="rules"
      ref="TechArticleAddOrEdit"
      label-width="120px"
      label-position="right"
      size="mini"
    >
      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="论文名称：" prop="dissertationName">
            <el-input
              style="width:100%;"
              v-model="basicInfo.dissertationName"
              clearable
              maxlength="32"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="撰稿人：" prop="writer">
            <el-input style="width:100%;" v-model="basicInfo.writer" clearable maxlength="64"></el-input>
            <template v-slot:error>
              <span></span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="cc lh40">
          <span style="line-height:28px;">限填7人,用'、'号隔开</span>
        </el-col>

        <el-col :span="6">
          <el-form-item label="发表期刊：" prop="publishedPeriodical">
            <el-input
              style="width:100%;"
              v-model="basicInfo.publishedPeriodical"
              clearable
              maxlength="16"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第一作者：" prop="firstAuthor">
            <el-input style="width:100%;" v-model="basicInfo.firstAuthor" clearable maxlength="12"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第二作者：" prop="secondAuthor">
            <el-input style="width:100%;" v-model="basicInfo.secondAuthor" clearable maxlength="12"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第三作者：" prop="thirdAuthor">
            <el-input style="width:100%;" v-model="basicInfo.thirdAuthor" clearable maxlength="12"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其他作者：" prop="otherAuthor">
            <el-input style="width:100%;" maxlength="48" v-model="basicInfo.otherAuthor" clearable></el-input>
            <template v-slot:error>
              <span></span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="cc">
          <span style="line-height:28px;">限填7人,用'、'号隔开</span>
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
          <el-button type="primary" @click="submitForm('TechArticleAddOrEdit')">确定</el-button>
          <el-button type="plain" @click="resetForm('TechArticleAddOrEdit')">重置</el-button>
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
  addDissertationInformation,
  editDissertationInformation
} from "../axios/api.js";
export default {
  name: "TechArticleAddOrEdit",
  created() {
    let info = this.$store.getters.knowledge_techArticle;
    if (Object.keys(info).length) {
      this.basicInfo = Object.assign({}, info);
      this.choose = 1;
    } else {
      this.choose = 0;
    }
    this.isShow = info;
  },
  mounted() {},
  methods: {
    async submitForm(formName) {
      this.sub = true;
      let arr = [];
      this.$refs[formName].validateField(
        ["dissertationName", "firstAuthor"],
        valid => {
          if (valid) {
            arr.push(false);
          } else {
            arr.push(true);
          }
          arr.forEach(item => {
            if (!item) {
              this.sub = false;
              return;
            }
          });
        }
      );
      if (this.sub) {
        let res;
        if (this.choose === 0) {
          res = await addDissertationInformation(this.basicInfo);
        } else {
          res = await editDissertationInformation(this.basicInfo);
        }
        if (res.status === 1) {
          if (this.choose === 1) {
            this.$emit("ifChange", "edit");
          } else {
            this.$router.push({ path: "/patent/techArticle" });
          }

          Message({
            showClose: true,
            type: "success",
            message: "新增或更新论文成功！"
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
    // 撰稿人
    let validate1 = (rule, value, callback) => {
      if (
        this.basicInfo.writer !== undefined &&
        this.basicInfo.writer !== null
      ) {
        let arr = [];
        arr = this.basicInfo.writer.split("、");
        if (arr.length > 7) {
          this.$message({
            type: "warning",
            message: "限填写7人！"
          });
          callback(new Error());
        } else {
          callback();
        }
      }
    };
    // 其他发明人
    let validate2 = (rule, value, callback) => {
      if (
        this.basicInfo.otherAuthor !== undefined &&
        this.basicInfo.otherAuthor !== null
      ) {
        let arr = [];
        arr = this.basicInfo.otherAuthor.split("、");
        if (arr.length > 7) {
          this.$message({
            type: "warning",
            message: "限填写7人！"
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

      options: {},

      rules: {
        dissertationName: [
          {
            required: true,
            message: "论文名称不能为空",
            trigger: ["blur", "change"]
          }
        ],
        firstAuthor: [
          {
            required: true,
            message: "第一作者不能为空",
            trigger: ["blur", "change"]
          }
        ],
        writer: [
          {
            validator: validate1,
            trigger: ["blur", "change"]
          }
        ],
        otherAuthor: [
          {
            validator: validate2,
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
