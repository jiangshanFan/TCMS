<template>
  <div>
    <template v-for="h in header">
      <el-table-column
        v-if="!h.children"
        :fixed="h.fixed"
        :key="h.prop"
        :label="h.label"
        :prop="h.prop"
        :sortable= "h.sortable"
        :width="h.width !=='unset' ? h.label.length*h.eachWidth : ''"
        align="center"
        show-overflow-tooltip>

        <template slot-scope="scope">
          <span v-if="h.change">{{h.change[scope.row[h.prop]]}}</span>
          <span v-else-if="h.parent">{{scope.row[h.parent]?scope.row[h.parent][h.prop]:''}}</span>
          <span v-else-if="h.multiProp">{{h.multiProp.map(function (item) { if(scope.row[item]) return scope.row[item];}).filter(current => {return current !== null && current !== undefined;}).join('、')}}</span> <!--<span v-for="(p,ind) in h.multiProp" :key="ind">{{scope.row[p]}}</span>-->
          <span v-else-if="h.division">{{scope.row[h.prop] / h.division}}</span>
          <span v-else>{{scope.row[h.prop]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-else :key="h.prop" :label="h.label" align="center" show-overflow-tooltip>
        <tableColumn :header="h.children"></tableColumn>
      </el-table-column>
    </template>
  </div>
</template>

<script>
/* eslint-disable */
  export default {
    name: "tableColumn",
    methods: {
    },
    data() {
      return {

      }
    },
    props: {
      header: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style scoped>

</style>
