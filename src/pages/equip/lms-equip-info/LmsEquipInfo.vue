<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
     <!-- <Tabs value="baseName" class="tabsHiddenEquip" @on-click="_changeTabs">-->
        <TabPane label="仪器资产信息" name="baseName" >
          <!--仪器基本信息-->
          <EquipInfo ref="equipInfo"></EquipInfo>
        </TabPane>
       <!-- <TabPane label="仪器点位信息" name="locationName">
          &lt;!&ndash;仪器点位&ndash;&gt;
          <ImgNotes ref="imgNotes"></ImgNotes>
        </TabPane>-->
     <!-- </Tabs>-->
  </div>
</template>
<script>
  import ImgNotes from './tabs/ImgNotes.vue'
  import EquipInfo from './tabs/EquipInfo.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      ImgNotes,
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
