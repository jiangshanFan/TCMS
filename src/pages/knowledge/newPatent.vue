<template>
  <div class="newPatent posr">
    <!--面包屑-->
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <AddOrEdit></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  import breadcrumbList from '../../components/breadcrumbList'
  import PatentAddOrEdit from '../../components/PatentAddOrEdit'

  export default {
    name: "newPatent",
    components: {
      'breadcrumbList': breadcrumbList,
      'AddOrEdit': PatentAddOrEdit,
    },
    created() {
      this.$store.dispatch('knowledge_patentFollow', {});
    },
    mounted() {

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
          { id: 'patent', name: '知识产权管理', path: '/patent',},
          { id: 'newPatent', name: '新增专利', path: '/patent/newPatent', thing: 'showDefault'},
        ]
      }
    },
  }
</script>

<style scoped>

</style>
