<template>
  <div id="login">
    <h2 class="title">随便搞个登录页</h2>
    <div class="login">
      <div class="login--account">
        <span>账号：</span>
        <input type="text"  placeholder="随便输" name="account" v-model.trim="account"/>
      </div>
      <div class="login--password">
        <span>密码：</span>
        <input type="password"  placeholder="随便输" name="password" v-model.trim="password" @keyup.enter="login"/>
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
            accountName: this.account,
            pwd: this.password,
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
              this.$router.replace('/');
            }
          }catch (e) {
            console.log(e)
          }
        } else if(this.accountName) {
          this.$message({showClose: true, type: 'warning', message: '请输入用户名'});
        } else {
          this.$message({showClose: true, type: 'warning', message: '请输入密码'});
        }
      }
    },

    data() {
      return {
        account: '',
        password: '',
      }
    },
  }
</script>

<style scoped>

</style>
