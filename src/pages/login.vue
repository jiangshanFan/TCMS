<template>
  <div id="login" class="tc posr">
    <div class="login posa boxShadow">
      <h1 class="title">技术中心管理系统</h1>
      <span class="f12">欢迎登录!</span>

      <div class="login_info">

        <el-input placeholder="请输入用户名" v-model.trim="accountName" size="medium" clearable>
          <i slot="prefix" class="el-input__icon icon_user"></i>
        </el-input>

        <el-input type="password" placeholder="请输入密码" v-model.trim="pwd" size="medium" clearable show-password>
          <i slot="prefix" class="el-input__icon icon_pwd"></i>
        </el-input>

        <el-button type="primary" size="medium" style="width: 100%;" @click="login">登录</el-button>
      </div>

    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { login, } from '../axios/api'

  export default {
    name: "login",
    created() {
      sessionStorage.clear();  //
      // console.log(sessionStorage);
    },
    mounted() {
      this.$store.commit('Auth/CLEAR_PERMISSION');  // avoid losing the efficacy of token, goto the page of login.vue, but the token still resist
    },
    methods: {
      async login() {
        if(this.accountName !== '' && this.pwd !== '') {
          let params = {
            accountName: this.accountName,
            pwd: this.pwd,
          };
          try {
            let res = await login(params);
            if(res.status === 1) {
              sessionStorage.setItem('token',res.msg.authorization);
              // localStorage.setItem('token',res.msg.authorization);
              sessionStorage.setItem('accountName',res.msg.userLoginVO.userName);
              sessionStorage.setItem('userLoginVO',JSON.stringify(res.msg.userLoginVO));
              // localStorage.setItem('userLoginVO',JSON.stringify(res.msg.userLoginVO));

              this.$store.dispatch('token', sessionStorage.getItem('token'));
              this.$store.dispatch('accountName', sessionStorage.getItem('accountName'));
              this.$store.dispatch('userLoginVO', JSON.parse(sessionStorage.getItem('userLoginVO')));
              // 登录时存入用户名称
              this.$store.commit('username', res.msg.userLoginVO.userName)
              // 登录时存入是否管理层
              this.$store.commit('managerOr',res.msg.userLoginVO.manager)
              // 登录时存入部门编号
              this.$store.commit('dept',res.msg.userLoginVO.dept)
              if(!this.$store.state.Auth.permissionList) {
                this.$store.dispatch('Auth/FETCH_PERMISSION').then(() => {  // 此处的then写法在旧版IE不支持
                  this.$store.dispatch('isLogin', true);
                  this.$router.replace('/');
                }); //刷新界面就请求权限数据
              }
            }
          }catch (e) {
            console.log(e)
          }
        } else {
          this.$message({showClose: true, type: 'warning', message: '请填写完整用户名和密码！'});
        }
      }
    },

    data() {
      return {
        accountName: '',
        pwd: '',
      }
    },
  }
</script>

<style lang="scss" scoped>
  #login {
    height: 100%;
    background: url("../assets/login_bg.png") no-repeat center 0;
    background-size: cover;
    .login {
      width: 800px;
      height: 460px;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 80px 40px 80px 400px;
      box-sizing: border-box;
      border-radius: 5px;
      background: #fff url("../assets/login_dialog_bg.png") no-repeat 10px center;
      background-size: 380px 281px;
      &:before {
        content: '';
        width: 137px;
        height: 38px;
        position: absolute;
        top: 10px;
        left: 10px;
        background: url("../assets/logo.png") no-repeat;
      }
      .title {
        margin: 0 !important;
      }
      .login_info {
        height: 210px;
        padding: 0 60px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: column;
        .icon_user {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-top: 6px;
          background: url("../assets/login_user.png") no-repeat center 0em;
          background-size: cover;
        }
        .icon_pwd {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-top: 6px;
          background: url("../assets/login_pwd.png") no-repeat center 0em;
          background-size: cover;
        }
      }
    }
  }
</style>
