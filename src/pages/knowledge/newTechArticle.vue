<template>
  <div class="newTechArticle posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <AddOrEdit></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
  import { Message, MessageBox, Loading } from 'element-ui';
  import TechArticleAddOrEdit from '../../components/TechArticleAddOrEdit'
  import breadcrumbList from '../../components/breadcrumbList'

  export default {
    name: "newTechArticle",
    components: {
      'AddOrEdit': TechArticleAddOrEdit,
      'breadcrumbList': breadcrumbList,
    },
    created() {
      this.$store.dispatch('knowledge_techArticle', {});
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
          { id: 'newTechArticle', name: '新增技术论文', path: '/patent/newTechArticle', thing: 'showDefault'},
        ],
      }
    },
  }
</script>

<style scoped>

</style>

