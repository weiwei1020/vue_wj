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
            <Form-item class="search-item" label="归还人:">
             <!-- <DatePicker type="datetimerange" placement="bottom-start" placeholder="请选择申请时间"
                          style="width:100%;" @on-change="_getDate"></DatePicker>
              <input type="hidden" name="queryStartDate" v-model="queryStartDate">
              <input type="hidden" name="queryEndDate" v-model="queryEndDate">-->
              <Input type="text" name="uname" v-model="uname" placeholder="请输入归还人"></Input>
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
    <LmsChemicalReturnDetail ref="chemicalPurchaseOrderDetail" @on-result-change="_search"></LmsChemicalReturnDetail>
  </div>
</template>
<script>
  import LmsChemicalReturnDetail from './LmsChemicalReturnDetail.vue'
  import PageTable from '../../../components/table/PageTable'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      LmsChemicalReturnDetail,
      PageTable,
      IconList,
      BreadCrumbs
    },
    data() {
      return {
        heightSearch: '',
        tableHeight: '300',
        iconMsg:[
          {type:'document-text',id:'',name:'查看归还单'},
        ],
        uname:'',
        pageColumns: [
          {title: '归还单编号', key: 'giveNum', width: 200, align: 'center', ellipsis: true,sortable:'true', },
          {title: '归还人', key: 'uname',  align: 'center',width: 150, ellipsis: true,sortable:'true', },
          {title: '归还详情', key: 'giveNameNumber',  align: 'center', ellipsis: true,sortable:'true', },
          {
            title: '是否归还入库', key: 'giveStatus', width: 150, ellipse: true, align: 'center',
            render: (h, params) => {
              const row = params.row;
              return h('div', {
                style: {
                  color: row.giveStatus === 0 ? 'red' : '#00a0e9'
                },
              }, row.giveStatus === undefined ? '未入库' : row.giveStatus === 0?'等待入库' :'已入库');
            }
          },
          {
            title: '状态', key: 'status', "width": 80, ellipsis: true,
            render: (h, data) => {
              var status = {"0": "待审批", "1": "已审批", "2": "已驳回"};
              let operate = [];
              if (data.row.status == undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status == 0 ? '#F8BB2C' : data.row.status == 1 ? '#6FBA2C' :  'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },
          {
            title: '归还提交时间', key: 'ctime', width: 200,sortable:'true',
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM:ss"));
            }
          },
          {
            title: '操作', key: 'action', width: 100, fixed: 'right',align:'center',
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
      _getDate(date) {
        this.queryStartDate = date[0];
        this.queryEndDate = date[1];
      },
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
        this.$refs.pageTable._page('search-form', 'LmsChemicalReturn/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _iconClick(res,data){
        switch (res){
          case '查看归还单' :
            this._chemicalDetail(data.row);
            break;
        }
      },
      _chemicalDetail(data) {
        this.$refs.chemicalPurchaseOrderDetail._open(data);
      },
      _search() {
        this._page();
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalReturn.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
