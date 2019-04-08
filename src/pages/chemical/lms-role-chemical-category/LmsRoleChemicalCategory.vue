<template>
  <div>
    <!-- 面包屑 -->
    <div class="ivu-breadcrumb breadcrumb_bg">
      <Breadcrumb>
        <Breadcrumb-item>资源管理</Breadcrumb-item>
        <Breadcrumb-item>耗材管理</Breadcrumb-item>
        <Breadcrumb-item>耗材采购金额统计</Breadcrumb-item>
      </Breadcrumb>
    </div>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-right">
          <Row>
            <Col span="24">
            <div class="catgory_border_left">
              <p>耗材采购金额统计</p>
            </div>
            <div>
              <ChemicalStatistic ref="purTree"></ChemicalStatistic>
            </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import ChemicalStatistic from './ChemicalStatistic.vue'

  export default {
    components: {
      ChemicalStatistic
    },
    data() {
      return {
        IDS: {
          roleId: '',
          categoryIds: [],
        },
        treeStyleObj:{
          'width':'210px',
          'height':''
        },
      }
    },
    mounted() {
      this._roleTree();
      this._tableHeight();
    },
    methods: {
      _tableHeight(){
        this.treeStyleObj.height = document.documentElement.clientHeight-110 +'px';
      },
    },
  }
</script>
