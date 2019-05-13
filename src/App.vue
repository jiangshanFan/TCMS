<template>
  <div id="app">
    <el-container>
      <el-aside width="200px">
        <el-menu
          default-active="2" class="el-menu-vertical-demo"
          background-color="#082B50" text-color="#fff" active-text-color="#2C8CF0">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item-group>
              <template slot="title">分组一</template>
              <el-menu-item index="1-1">选项1</el-menu-item>
              <el-menu-item index="1-2">选项2</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="分组2">
              <el-menu-item index="1-3">选项3</el-menu-item>
            </el-menu-item-group>
            <el-submenu index="1-4">
              <template slot="title">选项4</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header class="header bg_f">
          <span class="f20 fwb">技术中心管理系统</span>
          <el-dropdown class="">
            <el-button type="primary" plain size="mini">hello<i class="el-icon-arrow-down el-icon--right"></i></el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="1" >修改信息</el-dropdown-item>
              <el-dropdown-item divided command="2">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="3">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <p>Main</p>
          <router-view />
        </el-main>
        <el-footer class="footer"></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {

    }
  }
}
</script>

<style lang="scss">
  @import "./style/index.scss";
  @import "./style/common.scss";

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width:1280px;
    overflow:auto;
  }

  .el-aside > ul {
    background: url('./assets/logo.png') no-repeat  center 10px;
    background-size: auto 40px;
  }

  .footer {
    height: 30px !important;
    background: #fff url("./assets/footer.png") no-repeat center;
    background-size: auto 20px;
  }
</style>
