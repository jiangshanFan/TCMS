<template>
  <div class="TechArticleAddOrEdit p20">
    <h1 v-if="Object.keys($store.getters.knowledge_techArticle).length">论文编号：{{basicInfo.dissertationCode}}</h1>

    <el-form :model="basicInfo" :rules="rules" ref="TechArticleAddOrEdit" label-width="120px" label-position="right" size="mini">

      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="论文名称：" prop="dissertationName">
            <el-input style="width:100%;" v-model="basicInfo.dissertationName" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="撰稿人：" prop="writer">
            <el-input style="width:100%;" v-model="basicInfo.writer" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="cc lh40">
          <span style="line-height:28px;">限填7人,用'、'号隔开</span>
        </el-col>

        <el-col :span="6">
          <el-form-item label="发表期刊：" prop="publishedPeriodical">
            <el-input style="width:100%;" v-model="basicInfo.publishedPeriodical" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第一作者：" prop="firstAuthor">
            <el-input style="width:100%;" v-model="basicInfo.firstAuthor" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第二作者：" prop="secondAuthor">
            <el-input style="width:100%;" v-model="basicInfo.secondAuthor" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第三作者：" prop="thirdAuthor">
            <el-input style="width:100%;" v-model="basicInfo.thirdAuthor" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="其他作者：" prop="otherAuthor">
            <el-input style="width:100%;" v-model="basicInfo.otherAuthor" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" class="cc">
          <span style="line-height:28px;">限填7人,用'、'号隔开</span>
        </el-col>
      </el-row>

      <el-col :span="24">
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" :rows="5" resize="none" placeholder="请输入内容" v-model="basicInfo.remark"></el-input>
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
  import { Message, MessageBox, Loading } from 'element-ui';
  /** 导入api.js */
  import { addDissertationInformation, editDissertationInformation, } from '../axios/api.js'
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
    },
    mounted() {

    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            let res;
            if (this.choose === 0) {
              res = await addDissertationInformation(this.basicInfo);
            } else {
              res = await editDissertationInformation(this.basicInfo);
            }
            if (res.status === 1) {
              if (this.choose === 1) {
                this.$emit('ifChange','edit');
              } else {
                this.$router.push({path: '/patent/techArticle'});
              }

              Message({showClose: true, type: 'success', message: '新增或更新论文成功！'})
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
        basicInfo: {

        },

        options: {

        },


        rules: {
          dissertationName: [
            { required: true, message: '论文名称不能为空', trigger: ['blur','change'] },
          ],
          firstAuthor : [
            { required: true, message: '第一作者不能为空', trigger: ['blur','change'] },
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
