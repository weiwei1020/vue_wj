<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item class="width-23" label="耗材名称:">
              <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
            </Form-item>
            <Form-item class="width-23" label="领用人:">
              <Input name="uname" placeholder="请输入领用人" @on-enter="_formSearch"></Input>
            </Form-item>
            <Form-item class="search-btn">
              <Button type="primary" @click="_formSearch">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                     ref="pageTable" :getPage="getPage">

          </PageTable>
          </Col>
        </Row>
      </div>
    </div>
    <!-- 采购详情 -->
    <LmsChemicalUseQueryById ref="UseQueryById" @on-result-change="_search"></LmsChemicalUseQueryById>
  </div>
</template>
<script>
  import LmsChemicalUseQueryById from './LmsChemicalUseQueryById.vue'
  import PageTable from '../../../components/table/PageTable'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsChemicalUseQueryById,
      PageTable,
      IconList,
      BreadCrumbs
    },
    data() {
      return {
        heightSearch: '',
        tableHeight: '300',
        iconMsg:[
          {type:'document-text',id:'',name:'使用记录'},
        ],
        pageColumns: [
          {title: '耗材编号', key: 'chemicalNumber',  align: 'center', ellipsis: true,sortable:'true', },
          {title: '耗材名称', key: 'chemicalName',  align: 'center', ellipsis: true,sortable:'true', },
          {title: '申请人', key: 'uname', width: 200, align: 'center', ellipsis: true,sortable:'true', },
          {title: '规格', key: 'spec', width: 200, align: 'center', ellipsis: true,sortable:'true', },
          {title: '申请原因', key: 'remark', width: 200, align: 'center', ellipsis: true,sortable:'true',},
          {title: '申请数量', key: 'stockNumber', width: 200, align: 'center', ellipsis: true,sortable:'true', },
          {title: '剩余量', key: 'surplusQuantity', width: 200, align: 'center', ellipsis: true,sortable:'true',},
          {
            title: '操作', key: 'action', width: 70, fixed: 'right',align:'center',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this. iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res,data)
                      }
                    }
                  },),
                ]);
            }
          }
        ],
        noBtnVal: 250,
        dVal: 57,
        getPage: {}
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _contHide() {
        this._judgePanel(0);
        this._page();
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemicalUseQuery/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _iconClick(res,data){
        switch (res){
          case '使用记录' :
            this._chemicalDetail(data.row.id);
            break;
        }
      },
      _chemicalDetail(id) {
        this.$refs.UseQueryById._open(id);
      },
      _search() {
        this._page();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalUseQuery.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
