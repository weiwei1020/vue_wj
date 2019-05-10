<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
      <TabPane label="仪器资产信息" name="baseName" >
        <!--仪器基本信息-->
        <EquipInfo ref="equipInfo"></EquipInfo>
      </TabPane>

  </div>
</template>
<script>
  import EquipInfo from './tabs/EquipInfo.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      EquipInfo,
      BreadCrumbs
    },
    data() {
      return {
      }
    },
    mounted() {
      this._equipInfo();
    },
    methods: {
      _changeTabs(data){
        if(data == 'locationName'){  //点位信息
          this.$refs.imgNotes._open();
        }else{
          this._equipInfo();
        }
      },
      _equipInfo(){
        this.$refs.equipInfo._open();
      },
    },
  }
</script>
