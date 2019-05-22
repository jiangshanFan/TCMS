<template>
  <div class="newSubmission posr">
    <breadcrumbList :breadcrumb-list="breadcrumb" @showDefault="showDefault"></breadcrumbList>
    <AddOrEdit></AddOrEdit>
  </div>
</template>

<script>
/* eslint-disable */
import { Message, MessageBox, Loading } from 'element-ui';
import SubmissionAddOrEdit from '../../components/SubmissionAddOrEdit'
import breadcrumbList from '../../components/breadcrumbList'

  export default {
    name: "newSubmission",
    components: {
      'AddOrEdit': SubmissionAddOrEdit,
      'breadcrumbList': breadcrumbList,
    },
    created() {
      this.$store.dispatch('knowledge_submission', {});
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
          { id: 'newSubmission', name: '新增交底书', path: '/patent/newSubmission', thing: 'showDefault'},
        ],
      }
    },
  }
</script>

<style scoped>

</style>
