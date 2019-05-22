<template>
  <div class="menu-container">
    <template v-for="v in menuList">
      <el-submenu :index="v.name" v-if="v.children&&v.children.length>0" :key="v.name">
        <template slot="title">
          <i :class="v.meta.icon"></i>
          <span>{{v.meta.name}}</span>
        </template>
        <!--<el-menu-item-group v-if="v.children && v.children.length > 0">-->
          <sideNav :menuList="v.children"></sideNav>  <!-- 循环本身，组件中引用自身 -->
        <!--</el-menu-item-group>-->
      </el-submenu>
      <el-menu-item :key="v.name" :index="v.name" @click="gotoRoute(v.name)" v-else>
        <i class="iconfont" :class="v.meta.icon"></i>
        <span slot="title">{{v.meta.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "sideNav",
    props: {
      menuList: {
        type: Array,
        default: function() {
          return [];
        }
      }
    },

    created() {

    },

    data() {
      return {

      }
    },
    methods: {
      gotoRoute(name) {
        this.$router.push({ name })
      }
    }
  }
</script>

<style scoped>

</style>
