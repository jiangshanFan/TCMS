<template>
  <div id="costProjectType">
    <transition name="slide-fade">
      <costProjectEquipment v-if="show===1"></costProjectEquipment>

      <costProjectMaterial v-else-if="show===2"></costProjectMaterial>

      <costProjectOthers v-else-if="show===3"></costProjectOthers>
    </transition>
  </div>
</template>

<script>
/* eslint-disable */
  import costProjectEquipment from '../../components/cost/costProjectEquipment'
  import costProjectMaterial from '../../components/cost/costProjectMaterial'
  import costProjectOthers from '../../components/cost/costProjectOthers'

  export default {
    name: "costProjectType",
    components: {
      'costProjectEquipment': costProjectEquipment,
      'costProjectMaterial': costProjectMaterial,
      'costProjectOthers': costProjectOthers,
    },
    created() {
      this.info = this.$store.getters.costProject_edit;
      this.show = this.info.materialClass;
    },
    data() {
      return {
        show: 1,
        info: {},
      }
    }
  }
</script>

<style scoped>

</style>
