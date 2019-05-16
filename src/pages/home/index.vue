<template>
  <div id="index">
    <el-container>
      <!--  menu module -->
      <el-aside width="200px">
        <el-menu
          :default-active="$route.name" class="el-menu-vertical-demo menu"
          background-color="#082B50" text-color="#fff" active-text-color="#2C8CF0">
          <side-nav :menu-list="$store.state.Auth.sidebarMenu"></side-nav>
        </el-menu>
      </el-aside>

      <el-container>
        <!--  header module -->
        <el-header class="header">
          <div class="header_head bg_f">
            <span class="f20 fwb">技术中心管理系统</span>

            <el-dropdown class="">
              <el-button type="primary" plain size="mini">hello<i class="el-icon-arrow-down el-icon--right"></i></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="1" >修改信息</el-dropdown-item>
                <el-dropdown-item divided command="2">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="3">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>

          <!--面包屑-->
          <el-breadcrumb class="lh40 bg_f5 pl20" separator="/">
            <transition-group name="breadcrumb">
              <!-- 防止面包屑导航出现 首页/首页， v-if="route.name!='home'" -->
              <el-breadcrumb-item v-for="(route,i) in crumbList" :key="route.name"
                  :to="{path:route.path}" v-if="route.name!=''" :class="{'is-last-link':i==crumbList.length-1}">
                {{route.meta.name}}
              </el-breadcrumb-item>
            </transition-group>
          </el-breadcrumb>
        </el-header>

        <!--  main content -->
        <el-main class="main">
          <transition name="slide-fade">
            <router-view></router-view>
          </transition>
        </el-main>

        <!--  footer module -->
        <el-footer class="footer"></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
/* eslint-disable */
import sidNav from '../../components/sideNav'

  export default {
    name: "index",
    components: {
      'side-nav': sidNav, //添加 name 属性才能够调用 <side-nav></side-nave>
    },
    created() {

    },
    mounted() {
      this.crumbList = this.$route.matched.slice(1);
    },
    watch: { //通过路由的更新可以直接赋值
      $route: function(to, from , next) {
        this.crumbList = this.$route.matched.slice(1);
      },
    },


    data() {
      return {
        crumbList: [],
      }
    },
  }
</script>

<style lang="scss">
  @import "../../style/index.scss";
  @import "../../style/common.scss";

  .el-aside > ul {
    background: url('../../assets/logo.png') no-repeat  center 10px;
    background-size: auto 40px;
  }

  .footer {
    height: 30px !important;
    background: #fff url("../../assets/footer.png") no-repeat center;
    background-size: auto 20px;
  }
</style>
