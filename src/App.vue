<template>
  <div id="app">
    <transition name="slide-fade">
      <router-view></router-view>
      <!--<router-view v-if="!$store.getters.isLogin"></router-view>-->
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
import store from './vuex/index'
import login from '../src/pages/login'
import index from '../src/pages/home/index'

export default {
  name: 'App',
  components: {
    default: index,
    'login': login,
  },
  provide () {
    return {
      reload: this.reload,
    }
  },

  created() {
    // 在页面加载时读取 localStorage 里的状态信息 ---------------------- 可能考虑使用 sessionStorage 会更好，尤其是在token会失效的情况下
    if (localStorage.getItem("store") ) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(localStorage.getItem("store"))));
    }

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
      function replacer(key, value) {
        // Filtering out properties
        if (key === 'Auth' || key === 'userLoginVO') {
          return undefined;
        }
        return value;
      }
      console.log(this.$store.state);
      localStorage.setItem("store", JSON.stringify(this.$store.state, replacer));  // replacer delete Auth
    });

    // this.$store.commit('Auth/CLEAR_PERMISSION');
    if(localStorage.getItem('token') && !this.$store.state.Auth.permissionList) {
      this.$store.dispatch('Auth/FETCH_PERMISSION'); //刷新界面就请求权限数据
    }
    // if(!this.$store.state.Auth.permissionList) {
    //   this.$store.dispatch('Auth/FETCH_PERMISSION'); //刷新界面就请求权限数据
    // }

    console.log(this.$router.options)
  },

  mounted() {
    let path = localStorage.getItem('currentUrl');
    if(localStorage.getItem('token') === '' || localStorage.getItem('token') === null || localStorage.getItem('token') === undefined){
      this.$router.push('/login');
    } else {
      this.$router.push(path);
    }


    // else if (path) {  // sessionStorage 时初始化不会产生URL，因为URL时update产生的
    //   this.$router.push(path);
    // } else {
    //   this.$router.push('/');
    // }
  },

  beforeUpdate() {
    window.localStorage.setItem('currentUrl',this.$route.path);
  },

  watch: { //通过路由的更新可以直接赋值
    $route: function(to, from , next) {
      console.log(this.$route);
    },
  },

  methods: {
    //刷新子路由
    reload () {
      window.location.reload();
      // this.$store.dispatch('isLogin', false);
      // this.$nextTick(function () {
      //   this.$store.dispatch('isLogin', true);
      // });
    },
  },

  data () {
    return {

    }
  },
}
</script>

<style lang="scss">
  @import "./style/index.scss";
  @import "./style/common.scss";


  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: left;
    color: #2c3e50;
    min-width:1280px;
    overflow:auto;
  }
</style>
