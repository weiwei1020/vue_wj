<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Tabs value="wait" class="tabsHiddenEquip" @on-click="_changeTabs">
          <TabPane label="仪器列表" name="wait">
            <LmsEquipPurchase ref="waitOrder"></LmsEquipPurchase>
          </TabPane>
          <TabPane label="草稿箱" name="draft">
            <LmsEquipOrderDraft ref="draft"></LmsEquipOrderDraft>
          </TabPane>
          <TabPane label="已申请" name="order">
            <LmsEquipOrder ref="order"></LmsEquipOrder>
          </TabPane>
        </Tabs>
      </div>
    </div>
  </div>
</template>

<script>
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import LmsEquipPurchase from './LmsEquipPurchase.vue'
  import LmsEquipOrder from './LmsEquipOrder.vue'
  import LmsEquipOrderDraft from './LmsEquipOrderDraft.vue'


  export default {
    components: {
      BreadCrumbs,
      LmsEquipPurchase,
      LmsEquipOrder,
      LmsEquipOrderDraft,
    },
    data() {
      return {

      }
    },
    mounted(){
      this._equipInfo();
    },
    methods: {
      _changeTabs(data) {
        if (data == 'wait') {
          this._equipInfo();
        } else if (data == 'draft'){
          this.$refs.draft._search();
        }else{
          this.$refs.order._search();
        }
      },
      _equipInfo(){
        this.$refs.waitOrder._open();
      },
    }
  }
</script>

<style scoped>

</style>
