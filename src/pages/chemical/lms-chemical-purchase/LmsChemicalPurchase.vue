<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-left" :style="treeStyleObj" v-show="isTree">
          <Card dis-hover class="card_tree">
            <p slot="title" style="width: 60%">耗材类别列表</p>
            <p slot="title" style="width: 40%;text-align: right">
              <a @click="_refresh">
                <Icon type="refresh" size="20"></Icon>
              </a>
            </p>
            <div>
              <CategoryTree ref="tree" @on-result-change="_treeData"></CategoryTree>
            </div>
          </Card>
        </div>
        <div style="position: absolute;left: 196px;top: 50%;cursor:pointer" @click="_treeHide" v-if="isTree">
          <div class="navbarImgShow"></div>
        </div>
        <div style="position: absolute;left:0;top: 50%;cursor:pointer" @click="_treeShow" v-else="isTree">
          <div class="navbarImgHide"></div>
        </div>
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <!--查询-->
            <Col span="24" style="margin-top: 10px">
            <Form id="search-form" inline onsubmit="return false" :label-width="70">
              <label class="label-sign"></label>
              <Form-item class="width-20" label="耗材名称:">
                <input name="consumable" type="hidden"/>
                <Input name="name" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
              </Form-item>
              <Form-item>
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
    </div>
    <!--耗材详情-->
    <LmsChemicalDetail ref="chemicalDetailModel"></LmsChemicalDetail>
    <!--添加进采购单-->
    <LmsChemicalPurchaseAdd ref="addModel" @on-result-change="_search"></LmsChemicalPurchaseAdd>
  </div>
</template>
<script>
  import CategoryTree from '../CategoryTree.vue'
  import LmsChemicalDetail from './LmsChemicalDetail.vue'
  import LmsChemicalPurchaseAdd from './LmsChemicalPurchaseAdd.vue'
  import PageTable from '../../../components/table/PageTable'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'


  export default {
    components: {
      CategoryTree,
      LmsChemicalDetail,
      LmsChemicalPurchaseAdd,
      PageTable,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        iconMsg:[
          {type:'plus-round',id:'',name:'采购'},
        ],
        heightSearch: '',
        showInputNumber: false,
        inputNum: 1,

        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, fixed: 'left', align: 'center'},
          {title: '耗材编号', width: 140, key: 'num', ellipsis: true,sortable:'true',fixed:'left'},
          {
            title: '耗材名称', key: 'name', width: 200, align: 'left', ellipsis: true,sortable:'true',fixed:'left',
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row.id);
                    }
                  }
                }, data.row.name),
              ]);
            }
          },
          {title: '耗材类别', width: 140, key: 'consumable', ellipsis: true,sortable:'true',},
          {title: '仓库位置', width: 180, key: 'storehouse', ellipsis: true,sortable:'true',},
          {title: '库存量', width: 100, key: 'stock', ellipsis: true,sortable:'true',},
          {title: '备注', width: 140, key: 'remark', ellipsis: true},
          {title: '计量单位', width: 120, key: 'unit', ellipsis: true,sortable:'true',},
          {title: '备注', width: 200, key: 'remark', ellipsis: true,sortable:'true',},
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
          },
        ],
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
         'margin-left': '215px'
        },
        isTree: true,
        consumable: '',
        getPage: {},
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('search');
      }
    },
    mounted() {
      this._search();
    },
    methods: {
      _iconClick(res,data){
        switch (res){
          case '采购' :
            this._addModal(data.row);
            break;
        }
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemicalManage/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _refresh() { //刷新
        $('input[name=consumable]').val('');
        this._tree();
        this._page();
      },
      _search() {
        this._tree();
        this._page();
      },
      _treeData(data) {
        $('input[name=consumable]').val(data.consumableSortName);
        this._formSearch();
      },
      _tree() {
        this.$refs.tree._Ztree();
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsChemicalManage/getById', id).then(() => {
          this.$refs.chemicalDetailModel._open(this.$store.state.LmsChemicalManage.model);
        });
      },
      _addModal(data) {
        this.$refs.addModel._open(data);
      },
      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '15px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '215px'
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalManage.page;
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
