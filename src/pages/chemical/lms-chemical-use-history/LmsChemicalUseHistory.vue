<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Tabs :value="baseName" class="tabsHiddenEquip" @on-click="_changeTabs">
          <TabPane label="耗材列表" name="chemical">
            <LmsChemical ref="chemical"></LmsChemical>
          </TabPane>
          <TabPane label="已用尽耗材" name="useUp">
            <LmsUseUp ref="useUp"></LmsUseUp>
          </TabPane>
          <TabPane label="已归还耗材" name="returned">
            <LmsReturn ref="returned"></LmsReturn>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
  import LmsUseUp from './LmsUseUp.vue'
  import LmsChemical from './LmsChemical.vue'
  import LmsReturn from './LmsReturn'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsUseUp,
      LmsChemical,
      LmsReturn,
      BreadCrumbs
    },
    data() {
      return {
        baseName:'chemical',
      }
    },
    mounted() {
      this.$refs.chemical._open();
    },
    methods: {
      _changeTabs(data){
        if(data == 'chemical'){  //待审核
          this.$refs.chemical._open();
          this.baseName='chemical';
        }else if(data == 'useUp'){
          this.$refs.useUp._open();
          this.baseName='useUp';
        }else{
          this.$refs.returned._open();
          this.baseName='returned';
        }
      },
    },
  }
</script>
