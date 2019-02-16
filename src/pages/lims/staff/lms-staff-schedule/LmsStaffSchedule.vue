<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="">
      <Tabs value="list" class="tabsHiddenEquip" @on-click="_changeTabs">
        <TabPane label="列表视图" name="list">
            <LmsStaffScheduleListView ref="listView"></LmsStaffScheduleListView>
        </TabPane>
        <TabPane label="甘特图" name="month">
            <LmsStaffScheduleMonthView ref="monthView"></LmsStaffScheduleMonthView>
        </TabPane>

      </Tabs>
    </div>
  </div>
</template>
<script>
 import LmsStaffScheduleListView from './LmsStaffScheduleListView'
 import LmsStaffScheduleMonthView from './LmsStaffScheduleMonthView'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsStaffScheduleListView,
      LmsStaffScheduleMonthView,
      BreadCrumbs
    },
    mounted() {
      this._listModal();
    },
    methods: {
      _listModal() {
        this.$refs.listView._open();
      },
      _changeTabs(data) {
        switch (data) {
          case 'list':
            this.$refs.listView._open();
            break;
          case 'month':
            this.$refs.monthView._open();
            break;
        }
      },
    },
  }
</script>
