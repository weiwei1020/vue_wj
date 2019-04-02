<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Tabs :value="baseName" class="tabsHiddenEquip" @on-click="_changeTabs">
          <TabPane label="待审核" name="waitcheck">
            <!--待审核-->
            <EquipWaitCheck ref="waitcheck"></EquipWaitCheck>
          </TabPane>
           <TabPane label="已审核" name="checked">
             <!--已审核-->
             <EquipChecked ref="checked"></EquipChecked>
           </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>
<script>
  import EquipWaitCheck from './tabs/EquipWaitAudit.vue'
  import EquipChecked from './tabs/EquipAudited.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      EquipWaitCheck,
      EquipChecked,
      BreadCrumbs
    },
    data() {
      return {
        baseName:'waitcheck',
      }
    },
    mounted() {
      this.$refs.waitcheck._open();
    },
    methods: {
      _changeTabs(data){
        if(data == 'waitcheck'){  //待审核
          this.$refs.waitcheck._open();
          this.baseName='waitcheck';
        }else{
          this.$refs.checked._open();
          this.baseName='checked';
        }
      },
    },
  }
</script>
