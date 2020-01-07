<template>
  <div class="PatentAddOrEdit p20">
    <h1
      v-if="Object.keys($store.getters.knowledge_patentFollow).length"
    >专利编号：{{basicInfo.patentCode}}</h1>

    <el-form
      :model="basicInfo"
      :rules="rules"
      ref="PatentAddOrEdit"
      label-width="120px"
      label-position="right"
      size="mini"
    >
      <el-row :gutter="10" class="spec">
        <el-col :span="6">
          <el-form-item label="专利名称：" prop="patentName">
            <el-input style="width:100%;" v-model="basicInfo.patentName" clearable maxlength="64"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="专利申请号：" prop="patentApplyNum">
            <el-input
              @blur="askfor"
              v-model="basicInfo.patentApplyNum"
              clearable
              maxlength="15"
              minlength="13"
              oninput="value=value.replace(/[\u4e00-\u9fa5]/g,'')"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="this.choose===1">
          <el-form-item label="专利类型：" prop="type">
            <span>{{options.type[basicInfo.type-1].label}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-else>
          <el-form-item label="专利类型：" prop="type">
            <el-select @change="typeChange" v-model="basicInfo.type" style="width:100%;">
              <el-option
                v-for="item in options.type"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="this.choose===1">
          <el-form-item label="获取方式：" prop="gainWay">
            <span>{{options.gainWay[basicInfo.gainWay-1].label}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-else>
          <el-form-item label="获取方式：" prop="gainWay">
            <el-select @change="gainWayChange" v-model="basicInfo.gainWay" placeholder="请选择">
              <el-option
                v-for="item in options.gainWay"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="交底书名称：" prop="disclosurePaperDTO.paperName">
            <el-select
              v-model="basicInfo.disclosurePaperDTO.paperName"
              maxlength="64"
              filterable
              remote
              reserve-keyword
              placeholder="请输入交底书名称"
              :remote-method="searchPaperNames"
              :loading="loading"
              @change="selectPaperNames"
            >
              <el-option
                v-for="item in listDown"
                :key="item.paperCode"
                :label="item.paperName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="交底书编码：" prop="disclosurePaperDTO.paperCode">
            <span>{{basicInfo.disclosurePaperDTO.paperCode}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="专利权人：" prop="patentee">
            <el-select v-model="basicInfo.patentee" placeholder="请选择" style="width:100%;">
              <el-option
                v-for="item in options.patentee"
                :key="item.id"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="isShow.officialAcceptanceTime">
          <el-form-item label="官方受理时间：" prop="officialAcceptanceTime">
            <span>{{$format(new Date(basicInfo.officialAcceptanceTime).getTime()).dates}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-else>
          <el-form-item label="官方受理时间：" prop="officialAcceptanceTime">
            <el-date-picker
              @change="offDateChange(basicInfo.officialAcceptanceTime)"
              type="date"
              placeholder="选择日期"
              v-model="basicInfo.officialAcceptanceTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="专利状态：" prop="status">
            <el-select
              @change="statusChange(basicInfo.status)"
              v-model="basicInfo.status"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                v-for="item in options.status"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-if="isShow.realAuthorizeTime">
          <el-form-item label="实际授权时间：" prop="realAuthorizeTime">
            <span>{{$format(new Date(basicInfo.realAuthorizeTime).getTime()).dates}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-else>
          <el-form-item
            :rules="basicInfo.gainWay===2||basicInfo.gainWay===3||basicInfo.status===8?[{ required: true, message: '请选择实际授权时间',trigger:['blur','change']},]:[{required: false}]"
            label="实际授权时间："
            prop="realAuthorizeTime"
          >
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="basicInfo.realAuthorizeTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="预计授权时间：" prop="planAuthorizeTime">
            <el-date-picker
              type="date"
              placeholder="选择日期"
              v-model="basicInfo.planAuthorizeTime"
              style="width: 100%;"
            ></el-date-picker>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第一发明人：" prop="firstInventor">
            <el-input
              style="width:100%;"
              v-model="basicInfo.firstInventor"
              clearable
              maxlength="64"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第二发明人：" prop="secondInventor">
            <el-input
              style="width:100%;"
              v-model="basicInfo.secondInventor"
              clearable
              maxlength="64"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="第三发明人：" prop="thirdInventor">
            <el-input
              style="width:100%;"
              v-model="basicInfo.thirdInventor"
              clearable
              maxlength="64"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="9">
          <el-form-item label="其他发明人：" prop="otherInventor">
            <el-input
              style="width:100%;"
              v-model="basicInfo.otherInventor"
              clearable
              maxlength="48"
            ></el-input>
            <template v-slot:error>
              <span></span>
            </template>
          </el-form-item>
        </el-col>

        <el-col :span="3" class="cc">
          <span>限填7人,用'、'号隔开</span>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <!--<el-col :span="6">-->
        <!--<el-form-item label="关联项目：" prop="patentName">-->
        <!--<el-button type="primary" size="mini">关联</el-button>-->
        <!--</el-form-item>-->
        <!--</el-col>-->
        <!-- 印花税 -->
        <el-col :span="6">
          <el-form-item label="印花税：" prop="stampDuty">
            <el-input
              oninput="value=value.replace(/[^\d]/g,'')"
              style="width:calc(100% - 20px);"
              v-model="basicInfo.stampDuty"
              clearable
            ></el-input>
            <template v-slot:error>
              <span></span>
            </template>
            <span class="fr" style=" display:inline-block;">元</span>
          </el-form-item>
        </el-col>
        <!-- 年费优惠 -->

        <el-col :span="6" v-if="this.choose===1">
          <el-form-item label="年费优惠后：" prop="discount">
            <span>{{basicInfo.discount}}%</span>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-else>
          <el-form-item label="年费优惠后：" prop="discount">
            <el-input
              style="width:calc(100% - 20px);"
              @blur="discountChange"
              v-model="basicInfo.discount"
              clearable
              maxlength="3"
              oninput="value=value.replace(/[^\d]/g,'')"
            ></el-input>
            <span class="fr" style=" display:inline-block;">%</span>
          </el-form-item>
        </el-col>
        <!-- 缴费年份 -->

        <el-col :span="6" v-if="isShow.renewYear">
          <el-form-item label="最新续费年份：" prop="renewYear">
            <span
              v-if="(isShow.status===8&&this.basicInfo.status===8)||(isShow.status===4&&this.basicInfo.status===4)"
            >{{isShow.renewYear}}</span>
          </el-form-item>
        </el-col>

        <el-col :span="6" v-else>
          <el-form-item
            :rules="isShowActive===3||isShowActive===1?[{ required: true, message: '请选择续费年份',trigger:['blur','change']},]:[{required: false}]"
            label="最新续费年份："
            prop="renewYear"
          >
            <el-input
              v-if="isShowActive===3||isShowActive===1"
              @blur="inpBlur(basicInfo.renewYear)"
              v-model="basicInfo.renewYear"
              placeholder="请输入缴费年份"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="10">
        <el-col :span="6">
          <el-form-item label="授权费OA单号：" prop="authorizationOaOddNum">
            <el-input
              @blur="downBlur"
              style="width:100%;"
              v-model="basicInfo.authorizationOaOddNum"
              clearable
              placeholder="请输入OA单号"
              maxlength="15"
            ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="授权费OA状态：" prop="authorizationOaStatus">
            <span
              v-if="Object.keys($store.getters.knowledge_patentFollow).length"
            >{{basicInfo.authorizationOaStatus}}</span>
            <span v-else>{{oaDicition}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-col :span="24">
        <el-form-item label="专利信息摘要：" prop="remark">
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
          <el-button type="primary" @click="submitForm('PatentAddOrEdit')">确定</el-button>
          <el-button type="plain" @click="resetForm('PatentAddOrEdit')">重置</el-button>
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
  insertPatent,
  updatePatent,
  checkPatentApplyNum,
  getDisclosurePaperListByPaperName,
  queryOfficeAutomationInformation,
  getPatentStatus,
} from "../axios/api.js";
import { async } from "q";
export default {
  name: "PatentAddOrEdit",
  created() {
    let info = this.$store.getters.knowledge_patentFollow;
    if (Object.keys(info).length) {
      this.basicInfo = Object.assign({}, info);
      if (!this.basicInfo.disclosurePaperDTO) {
        this.basicInfo.disclosurePaperDTO = {};
      }
      this.choose = 1;
    } else {
      this.choose = 0;
    }
    for (let i of Object.keys(this.basicInfo)) {
      if ("authorizationCost|stampDuty".match(i)) {
        if (this.basicInfo[i]) {
          this.basicInfo[i] = parseFloat(this.basicInfo[i]) / 100;
        }
      }
    }
    // 当处于编辑页面的时候  年费优惠需乘以100  反之新增页面年费优惠上传时/100
    if (this.choose === 1) {
      for (let i of Object.keys(this.basicInfo)) {
        if ("discount".match(i)) {
          if (this.basicInfo[i]) {
            this.basicInfo[i] = parseFloat(this.basicInfo[i]) * 100;
          }
        }
      }
    }
    this.isShow = JSON.parse(JSON.stringify(this.basicInfo));
  },
  mounted() {
    // 当获取方式不为undefined时 调用改变事件  此举为了处理进来时默认值问题
    if (this.basicInfo.gainWay !== undefined) {
      this.gainWayChange();
    } else {
      return;
    }
    // 处于编辑页面时直接调用状态接口  此举是因为编辑页面默认值问题
    if (this.choose === 1) {
      this.getEdit();
      // this.getRenew();
      this.statusChange(this.basicInfo.status);
      this.offTime = new Date(this.isShow.officialAcceptanceTime).getTime();
      if (this.isShow.renewYear !== 0) {
        this.basicInfo.renewYear = this.isShow.renewYear;
      } else {
        this.basicInfo.renewYear = "";
      }
    }
  },
  methods: {
    // 续费年份输入框失去焦点事件
    inpBlur(val) {
      if (this.isShowActive === 1) {
        if (+val > 4) {
          this.stGet = false;
        } else if (+val <= 4) {
          this.stGet = true;
        }
      }
    },
    // 官方时间改变事件
    offDateChange(val) {
      this.offTime = new Date(val).getTime();
    },
    // 状态改变事件
    statusChange(val) {
      if (val === 4 && this.isShow.gainWay === 1 && this.choose === 1) {
        this.isShowActive = 1;
      } else if (
        val === 8 &&
        this.basicInfo.gainWay === 2 &&
        this.choose === 0
      ) {
        this.isShowActive = 3;
      } else {
        this.isShowActive = 2;
      }
    },
    // 年费优惠后输入框失去焦点
    discountChange() {
      if (this.basicInfo.discount > 100) {
        this.$message({
          type: "warning",
          message: "不得超过100%，请重新输入！"
        });
        this.basicInfo.discount = "";
        this.subOrNo = false;
      } else {
        this.subOrNo = true;
      }
    },
    // 专利类型改变事件
    typeChange(val) {
      if (val === 4) {
        this.basicInfo.status = "";
        this.options.status = [];
        this.options.status.push({ label: "已授权", id: 8 });
      } else {
        this.options.status = [];
        this.basicInfo.status = "";
        this.getOriginal();
      }
    },
    // 获取方式改变事件
    gainWayChange() {
      this.basicInfo.renewYear = "";
      this.options.status = [];
      // 此处调用获取状态接口判断为新增页面
      if (this.choose === 0 && this.basicInfo.gainWay !== 3) {
        this.getOriginal();
      } else if (this.choose === 0 && this.basicInfo.gainWay === 3) {
        this.options.status = [];
        this.basicInfo.status = "";
        this.options.status.push({ label: "已授权", id: 8 });
      }
    },
    // 新增调用状态接口方法
    async getOriginal() {
      this.basicInfo.status = "";
      let res = await getPatentStatus({
        type: this.basicInfo.gainWay
      });
      if (res.status === 1) {
        this.options.status = [];
        res.msg.forEach(item => {
          this.options.status.push({ label: item.name, id: item.id });
        });
      }
    },
    // 编辑调用状态接口方法
    async getEdit() {
      let res = await getPatentStatus({
        id: this.basicInfo.status,
        type: this.basicInfo.gainWay
      });
      if (res.status === 1) {
        this.options.status = [];
        res.msg.forEach(item => {
          this.options.status.push({ label: item.name, id: item.id });
        });
      }
    },
    // 获取缴费年份方法
    getRenew() {
      if (this.choose === 0 && this.basicInfo.gainWay === 2) {
        if (this.$format(new Date().getTime()).y % 4 === 0) {
          if (
            this.offTime +
              (+this.basicInfo.renewYear + 1) * 366 * 24 * 3600 * 1000 <
            new Date().getTime()
          ) {
            this.renewTime = false;
          } else {
            this.renewTime = true;
          }
        } else if (this.$format(new Date().getTime()).y % 4 !== 0) {
          if (
            this.offTime +
              (+this.basicInfo.renewYear + 1) * 365 * 24 * 3600 * 1000 <
            new Date().getTime()
          ) {
            this.renewTime = false;
          } else {
            this.renewTime = true;
          }
        }
      } else if (this.choose === 1 && this.isShow.gainWay === 1) {
        if (this.$format(new Date().getTime()).y % 4 === 0) {
          if (
            this.offTime +
              (+this.basicInfo.renewYear + 1) * 366 * 24 * 3600 * 1000 <
            new Date().getTime()
          ) {
            this.renewTime = false;
          } else {
            this.renewTime = true;
          }
        } else if (this.$format(new Date().getTime()).y % 4 !== 0) {
          if (
            this.offTime +
              (+this.basicInfo.renewYear + 1) * 365 * 24 * 3600 * 1000 <
            new Date().getTime()
          ) {
            this.renewTime = false;
          } else {
            this.renewTime = true;
          }
        }
      } else if (this.choose === 0 && this.basicInfo.gainWay === 1) {
        this.renewTime = true;
      }
    },
    // 专利类型年份判断方法
    type_C() {
      if (this.basicInfo.type === 2) {
        if (+this.basicInfo.renewYear >= 20) {
          this.typeCag = false;
        } else if (+this.basicInfo.renewYear < 20) {
          this.typeCag = true;
        }
      } else if (this.basicInfo.type === 1 || this.basicInfo.type === 3) {
        if (+this.basicInfo.renewYear >= 10) {
          this.typeCag = false;
        } else if (+this.basicInfo.renewYear < 10) {
          this.typeCag = true;
        }
      }
    },
    // 专利申请号验证方法
    askfor() {
      let value = this.basicInfo.patentApplyNum;
      if (value !== undefined) {
        let str = value.replace(/^[0-9a-zA-Z\.]$/g, "**");
        if (str.length < 1) {
          // console.log("不能为空");
          this.$message({
            type: "warning",
            message: "不能为空"
          });
        } else {
          console.log("正确");
        }
      }
    },
    // OA单号失去焦点事件
    async downBlur() {
      if (
        this.basicInfo.authorizationOaOddNum !== undefined &&
        this.basicInfo.authorizationOaOddNum !== ""
      ) {
        let res = await queryOfficeAutomationInformation({
          mathCode: this.basicInfo.authorizationOaOddNum
        });
        if (res.status === 1) {
          this.oaDicition = res.msg.documentsState;
          this.basicInfo.authorizationOaStatus = res.msg.documentsState;
        }
      }
    },
    async submitForm(formName) {
      this.getRenew();
      this.type_C();
      if (!this.renewTime) {
        this.$message({
          type: "warning",
          message: "专利信息填写错误，请重新确认最新已续费年份、官方受理时间"
        });
        return;
      } else if (!this.typeCag && this.choose === 0) {
        this.$message({
          type: "warning",
          message: "专利已失效，请重新确认最新已续费年份"
        });
        return;
      } else if (!this.stGet && this.choose === 1) {
        this.$message({
          type: "warning",
          message: "最新续费年份年份错误，请检查！"
        });
        return;
      } else {
        if (!this.subOrNo) {
          return;
        }
        this.sub = true;
        let arr = [];
        this.$refs[formName].validateField(
          [
            "patentName",
            "patentApplyNum",
            "firstInventor",
            "officialAcceptanceTime",
            "realAuthorizeTime",
            "renewYear"
          ],
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
          let ifValid = false;
          if (this.active === 0) {
            ifValid = true;
          } else if (this.active === 1) {
            ifValid = false;
          }
          if (ifValid) {
            let params = { ...this.basicInfo };
            for (let index of Object.keys(params)) {
              if ("authorizationCost|stampDuty".match(index)) {
                if (params[index]) {
                  params[index] = parseFloat(params[index]) * 100;
                }
              }
            }
            for (let index of Object.keys(params)) {
              if ("stampDuty|discount".match(index)) {
                if (params[index]) {
                  params[index] = +params[index];
                }
              }
            }
            for (let index of Object.keys(params)) {
              if ("discount".match(index)) {
                if (params[index]) {
                  params[index] = parseFloat(params[index]) / 100;
                }
              }
            }
            params.renewYear = +this.basicInfo.renewYear;
            let res;
            if (this.choose === 0) {
              res = await insertPatent(params);
            } else {
              res = await updatePatent(params);
            }
            if (res.status === 1) {
              if (this.choose === 1) {
                this.$emit("ifChange", "edit");
              } else {
                this.$router.push({ path: "/patent/patentFollow" });
              }

              Message({
                showClose: true,
                type: "success",
                message: "新增或更新专利成功！"
              });
            }
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
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    // 根据条件查询客户下拉列表
    searchPaperNames(query) {
      let self = this;
      if (query !== "") {
        self.loading = true;
        setTimeout(async () => {
          self.loading = false;
          self.listDown = (await getDisclosurePaperListByPaperName({
            paperName: query
          })).msg;
        }, 200);
      } else {
        self.listDown = [];
      }
    },

    // 根据选择的交底书名称显示交底书编码
    selectPaperNames(val) {
      this.listDown.forEach(item => {
        if (item.id === val) {
          this.basicInfo.disclosurePaperDTO = {
            paperCode: item.paperCode,
            paperName: item.paperName,
            id: item.id
          };
        }
      });
    }
  },
  data() {
    // 印花税
    let validate3 = (rule, value, callback) => {
      let res = this.$money(this.basicInfo.stampDuty);
      if (res === 1) {
        callback();
      } else {
        callback(new Error());
      }
    };
    // 技术支持
    let validate2 = (rule, value, callback) => {
      if (
        this.basicInfo.otherInventor !== undefined &&
        this.basicInfo.otherInventor !== null
      ) {
        let arr = [];
        arr = this.basicInfo.otherInventor.split("、");
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
    let self = this;
    let validatePatentApplyNum = async (rule, value, callback) => {
      if (!value) {
        value = "";
        callback(new Error("专利申请号不能为空！"));
      } else {
        let valid = false;
        let params = {
          patentAppleNum: this.basicInfo.patentApplyNum
        };
        if (self.choose) {
          params.id = this.basicInfo.id;
        }
        if (self.basicInfo.patentApplyNum) {
          let res = await checkPatentApplyNum(params);
          valid = res.status === 1;
        } else {
          valid = false;
        }

        if (!valid) {
          callback(new Error("专利申请号重复！"));
          self.active = 1;
        } else {
          callback();
          self.active = 0;
        }
      }
    };

    return {
      // 受理时间戳
      offTime: "",
      // 编辑受理时间戳
      editoffTime: "",
      // 新增页面续费年份判断
      renewTime: true,
      // 专利类型续费年份判断
      typeCag: true,
      // 编辑页面续费年份判断
      stGet: true,
      active: 0,
      // all info
      basicInfo: {
        status: 1,
        type: 1,
        patentee: "深圳市银宝山新科技股份有限公司",
        gainWay: 1,
        whetherChange: 0,
        disclosurePaperDTO: {},
        discount: 100,
        renewYear: ""
      },

      options: {
        status: [],
        type: [
          { label: "实用", id: 1 },
          { label: "发明", id: 2 },
          { label: "外观", id: 3 },
          { label: "软件著作权", id: 4 }
        ],
        patentee: [
          { label: "深圳市银宝山新科技股份有限公司", id: 1 },
          { label: "天津银宝山新科技有限公司", id: 2 },
          { label: "惠州银宝山新科技股份有限公司", id: 3 },
          { label: "惠州银宝山新实业有限公司", id: 4 },
          { label: "长沙银宝山新模具科技有限公司", id: 5 },
          { label: "长沙银宝山新汽车零部件有限公司", id: 6 },
          { label: "深圳市白狐工业设计有限公司", id: 7 },
          { label: "广州市银宝山新汽车零部件有限公司", id: 8 },
          { label: "广东银宝山新科技有限公司", id: 9 },
          { label: "深圳市博慧热流道科技有限公司", id: 10 },
          { label: "武汉市银宝山新模塑科技有限公司", id: 11 },
          { label: "南通银宝山新科技有限公司", id: 12 }
        ],
        gainWay: [
          { label: "原始取得", id: 1 },
          { label: "归属转让", id: 2 },
          { label: "授权使用", id: 3 }
        ],
        whetherChange: [{ label: "不变更", id: 0 }, { label: "变更", id: 1 }],
        // 续费年份
        renewYear: []
      },

      loading: false, //下拉列表请求后提示加载中
      listDown: [],

      rules: {
        patentName: [
          {
            required: true,
            message: "专利名称不能为空",
            trigger: ["blur", "change"]
          }
        ],
        patentApplyNum: [
          { required: true, validator: validatePatentApplyNum, trigger: "blur" }
        ],
        firstInventor: [
          {
            required: true,
            message: "第一发明人不能为空",
            trigger: ["blur", "change"]
          }
        ],
        officialAcceptanceTime: [
          {
            required: true,
            message: "请选择官方受理时间",
            trigger: ["blur", "change"]
          }
        ],
        // renewYear: [
        //   {
        //     required: true,
        //     message: "请填写缴费年份",
        //     trigger: ["blur"]
        //   }
        // ],
        status: [
          {
            required: true,
            message: "请选择专利状态",
            trigger: ["blur", "change"]
          }
        ],
        // realAuthorizeTime: [
        //   {
        //     required: true,
        //     message: "请选择实际授权时间",
        //     trigger: ["change", "blur"]
        //   }
        // ],
        otherInventor: [
          {
            validator: validate2,
            trigger: ["blur", "change"]
          }
        ],
        stampDuty: [
          {
            validator: validate3,
            trigger: ["blur"]
          }
        ]
      },

      // choose api
      choose: 0,
      // OA单状态
      oaDicition: "",
      // 裸参判断事件显示
      isShow: {},
      // 判断是否提交
      sub: false,
      // 专利期限权年份
      newTime: "",
      //  优惠大于一百不允许提交
      subOrNo: true,
      // 编辑页面状态仅为已缴费显示续费年份
      isShowActive: 0,
      // 续费年丰显隐
      s: false
    };
  }
};
</script>

<style scoped>
.el-form-item__label {
  font-size: 12px !important;
}
</style>
