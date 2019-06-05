<template>
  <div class="newUserName posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <AddOrEdit></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  import breadcrumbList from '../../components/breadcrumbList'
  import UserNameAddOrEdit from '../../components/UserNameAddOrEdit'
  export default {
    name: "newUserName",
    components: {
      'AddOrEdit': UserNameAddOrEdit,
      'breadcrumbList': breadcrumbList,
    },
    created() {
      this.$store.dispatch('auth_userName', {role:{}});
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
          { id: 'newUserName', name: '新增账户', path: '/user/newUserName', thing: 'showDefault'},
        ],
      }
    },
  }
</script>

<style scoped>

</style>
