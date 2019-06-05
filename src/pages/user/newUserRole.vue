<template>
  <div class="newUserRole posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <AddOrEdit></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
import breadcrumbList from '../../components/breadcrumbList'
import UserRoleAddOrEdit from '../../components/UserRoleAddOrEdit'
  export default {
    name: "newUserRole",
    components: {
      'AddOrEdit': UserRoleAddOrEdit,
      'breadcrumbList': breadcrumbList,
    },
    created() {
      this.$store.dispatch('auth_userRole', {});
    },
    methods: {
      // show default module
      showDefault() {
        this.show = false;
        this.breadcrumb = this.breadcrumb.slice(0,2);
      },
    },
    data() {
      return {
        // breadcrumb
        breadcrumb: [
          { id: 'user', name: '权限管理', path: '/user',},
          { id: 'newUserRole', name: '新增角色', path: '/user/newUserRole', thing: 'showDefault'},
        ],
      }
    },
  }
</script>

<style scoped>

</style>
