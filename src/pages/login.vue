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
        try {
          let res = await login();
          let token = res.data.token;
          // this.$store.dispatch('token', token);
          // console.log(this.$store.state);
          localStorage.setItem('token', token);
          this.$router.replace('/');
        }
        catch (e) {
          console.log(e)
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
