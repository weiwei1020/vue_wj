<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-right">
          <Row>
            <!--查询-->
            <Col span="24" style="margin-bottom: 15px;margin-top: 15px;">
            <div class="">
              <div class="coll-search" v-show="isSearch">
                <Form id="search-form-chemical-manage" inline onsubmit="return false" :label-width="70">
                  <label class="label-sign"></label>
                  <Form-item class="width-23-2" label="耗材名称:">
                   <!-- <input name="categoryId" type="hidden"/>-->
                    <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
                  </Form-item>
                  <Form-item>
                    <Button type="primary" @click="_formSearch">搜索</Button>
                  </Form-item>
                </Form>
              </div>
            </div>
            </Col>
            <Col span="24" style="margin-bottom: 10px">
            <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                       ref="pageTable" :getPage="getPage">

            </PageTable>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!--查看详情-->
    <LmsChemicalDetail ref="chemicalDetailModal"></LmsChemicalDetail>

  </div>
</template>
<script>
  import CategoryTree from '../CategoryTree.vue'
  import LmsChemicalDetail from './LmsChemicalDetail.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      CategoryTree,
      LmsChemicalDetail,
      PageTable,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        isSearch: true,
        tableHeight: '480',
        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, align: 'center',},
          {title: '耗材编号', width: 240, key: 'chemicalNum', ellipsis: true,sortable:'true',},
          {title: '耗材名称', key: 'chemicalName',  align: 'left', ellipsis: true,sortable:'true',},
          {title: '采购量', width: 220, key: 'stock', ellipsis: true,sortable:'true',},
          {title: '总价格', width: 220, key: 'total', ellipsis: true,sortable:'true',},
        ],
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        isTree: true,
        getPage: {},
        treeObj: {},
        contLength: 0,
        noBtnVal: 240,
        btnVal: 270,
        dVal: 70
      }
    },
    mounted() {
      this._page();
    },
    methods: {
      _page() {
        this.$refs.pageTable._page('search-form-chemical-manage', 'LmsChemical/getStatistic');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _search() {
        this._page();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemical.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
