<template>
  <div class="newProject posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <AddOrEdit></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  import ProjectAddOrEdit from '../../components/ProjectAddOrEdit'
  import breadcrumbList from '../../components/breadcrumbList'

  export default {
    name: "newProject",
    components: {
      'AddOrEdit': ProjectAddOrEdit,
      'breadcrumbList': breadcrumbList,
    },
    created() {
      this.$store.dispatch('project_list', {});
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
          { id: 'project', name: '项目管理', path: '/project',},
          { id: 'newProject', name: '新增项目', path: '/project/newProject', thing: 'showDefault'},
        ],
      }
    },
  }
</script>

<style scoped>

</style>
