<template>
  <div>
    <!--内容-->
    <Modal v-model="showModal" title="电子档案" :width="1200">
      <div>
        <Tabs v-model="tabValue" class="tabsHiddenEquip" @on-click="_changeTabs">
          <TabPane label="仪器预约记录" name="预约">
            <LmsEquipOrderQuery ref="order"></LmsEquipOrderQuery>
          </TabPane>
          <TabPane label="仪器修改记录" name="修改">
            <LmsEquipChangeQuery ref="change"></LmsEquipChangeQuery>
          </TabPane>
        </Tabs>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
      </div>
    </Modal>
  </div>
</template>
<style scoped>
  .tabsHiddenEquip {
    height: 650px;
  }
</style>
<script>
  import LmsEquipOrderQuery from './record-tabs/LmsEquipOrderQuery'
  import LmsEquipUseRecordQuery from './record-tabs/LmsEquipUseRecordQuery'
  import LmsEquipMaintainQuery from './record-tabs/LmsEquipMaintainQuery'
  import LmsEquipRepairQuery from './record-tabs/LmsEquipRepairQuery'
  import LmsEquipVerify from './record-tabs/LmsEquipVerify'
  import LmsEquipDocument from './record-tabs/LmsEquipDocument'
  import LmsEquipChangeQuery from './record-tabs/LmsEquipChangeQuery'



  export default {
    components: {
      LmsEquipOrderQuery,
      LmsEquipUseRecordQuery,
      LmsEquipMaintainQuery,
      LmsEquipRepairQuery,
      LmsEquipVerify,
      LmsEquipDocument,
      LmsEquipChangeQuery
    },
    data() {
      return {
        equipId: '',
        showModal: false,
        tabValue: '预约',
      }
    },
    methods: {
      _changeTabs(data) {
        switch (data) {
          case '预约':
            this.$refs.order._tabOpen(this.equipId);
            break;
          case '修改':
            this.$refs.change._tabOpen(this.equipId);
            break;
         /* case '保养':
            this.$refs.maintain._tabOpen(this.equipId);
            break;
          case '维修':
            this.$refs.repair._tabOpen(this.equipId);
            break;
          case '电子档案':
            this.$refs.doc._tabOpen(this.equipId);
            break;*/
        }
      },
      _initTab() {
        this.$refs.order._tabOpen(this.equipId);
      },
      _open(equipId) {
        this.tabValue = '预约';
        this.showModal = true;
        this.equipId = equipId;
        this.loading = true;
        this._initTab();
      },
      _cancel() {
        this.showModal = false;
      }
    },
  }
</script>
