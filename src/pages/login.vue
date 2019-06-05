<template>
  <div id="login">
    <h2 class="title">简易登录页</h2>
    <div class="login">
      <div class="login--account">
        <span>账号：</span>
        <input type="text"  placeholder="随便输" name="account" v-model.trim="accountName"/>
      </div>
      <div class="login--password">
        <span>密码：</span>
        <input type="password"  placeholder="随便输" name="password" v-model.trim="pwd" @keyup.enter="login"/>
      </div>
      <p class="login--btn">
        <button id="loginBtn" @click="login">登录</button>
      </p>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import { login, } from '../axios/api'

  export default {
    name: "login",
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
              localStorage.setItem('token',res.msg.authorization);
              localStorage.setItem('accountName',res.msg.userLoginVO.userName);
              localStorage.setItem('userLoginVO',JSON.stringify(res.msg.userLoginVO));

              this.$store.dispatch('token', localStorage.getItem('token'));
              this.$store.dispatch('accountName', localStorage.getItem('accountName'));
              this.$store.dispatch('userLoginVO', JSON.parse(localStorage.getItem('userLoginVO')));

              if(!this.$store.state.Auth.permissionList) {
                this.$store.dispatch('Auth/FETCH_PERMISSION').then(() => {
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

<style scoped>

</style>
