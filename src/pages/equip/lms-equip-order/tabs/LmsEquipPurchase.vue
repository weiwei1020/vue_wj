<template>
  <div>
    <!--&lt;!&ndash; 面包屑 &ndash;&gt;
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>-->
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-left" :style="treeStyleObj" v-show="isTree">
          <Card dis-hover class="card_tree">
            <p slot="title" style="width: 60%">仪器类别列表</p>
            <p slot="title" style="width: 40%;text-align: right">
              <a @click="_refresh">
                <Icon type="refresh" size="20"></Icon>
              </a>
            </p>
            <div>
              <LmsEquipClassTree ref="classTree" @on-result-change="_classData"></LmsEquipClassTree>
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
                <Form-item class="width-21" label="仪器名称:">
                  <Input v-model="apparatusName" placeholder="请输入仪器名称" @on-enter="_pageChange(1)"/>
                  <input v-model="apparatusSortName" type="hidden"/>
                </Form-item>
                <Form-item class="search-btn">
                  <Button type="primary" @click="_pageChange(1)">搜索</Button>
                </Form-item>
              </Form>
            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 15px;">
            <div>
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
            </div>
            </Col>
            <!-- 表格 -->
            <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                   highlight-row stripe
                   @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="tableHeight"></Table>
            </Col>
            <!--分页-->
            <Col span="24">
            <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current" @on-change="_pageChange"
                  @on-page-size-change='_pageSizeChange'
                  placement="top" show-elevator show-total show-sizer></Page>
            </Col>
          </Row>
        </div>
      </div>
    </div>
    <!--仪器详情-->
    <LmsEquipInfoDetail ref="detailModal"></LmsEquipInfoDetail>
    <!--仪器预约-->
    <LmsEquipPurchaseAdd ref="addModal"></LmsEquipPurchaseAdd>
  </div>
</template>
<script>
  import LmsEquipInfoDetail from '../../lms-equip-info/LmsEquipInfoDetail.vue'
  import LmsEquipPurchaseAdd from'../LmsEquipPurchaseAdd.vue'

  import LmsEquipClassTree from '../LmsEquipClassTree.vue'
  import BtnList from '../../../../components/base/BtnList.vue'
  import PageTable from '../../../../components/table/PageTable'
  import BreadCrumbs from '../../../../components/base/BreadCrumbs'
  import IconList from '../../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsEquipInfoDetail,
      LmsEquipPurchaseAdd,

      LmsEquipClassTree,
      BtnList,
      PageTable,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        btn: [
        ],
        iconMsg: [
          {type: 'plus', id: '', name: '预约'},
        ],
        heightSearch: '',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center',fixed: 'left',},
          {title: '仪器编号', key: 'apparatusNum', width: 170, align: 'center', ellipsis: true, fixed: 'left', sortable: 'true',},
          {
            title: '仪器名称', key: 'apparatusName', width: 160, align: 'center', ellipsis: true, fixed: 'left', sortable: 'true',
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailModal(data.row.apparatusId);
                    }
                  }
                }, data.row.apparatusName),
              ]);
            }
          },
          {title: '仪器类别', key: 'apparatusSortName', width: 160, align: 'center', ellipsis: true, sortable: 'true',},
          {title: '仪器品牌', key: 'apparatusBrand', width: 160, align: 'center', ellipsis: true, sortable: 'true',},
          {title: '仪器价格', key: 'apparatusPrice', width: 110, align: 'center', ellipsis: true, sortable: 'true',},
          {title: '购买日期', key: 'apparatusBuyTime', width: 150, ellipsis: true, sortable: 'true',},
          {title: '备注', key: 'apparatusRemark', width: 180, align: 'center', ellipsis: true,},
          {
            title: '操作', key: 'action', width: 160, fixed: 'right', align: 'center',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this.iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res, data)
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
         'margin-left': '230px'
        },
        isTree: true,
        getPage: {},
        loading :true,
        apparatusName: '',
        apparatusSortName: '',
        selectIds: [],
        selectObj: [],
        pname:'',
        pid:'',
        id:'',
        pageParams: {
          rows: 20,
        },
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('tabSearch');
      }
    },
    methods: {
      _iconClick(res,data){
        switch (res){
          case '预约' :
            this._addModal(data.row.apparatusId, data.row.apparatusName);
            break;
        }
      },
      _refresh() { //刷新
        this.apparatusSortName = '';
        this.apparatusName = '';
        this._search();
        this._classTree();
      },
      _open() {
        this._page();
        this._classTree();
      },
      _page() {
        this.$store.dispatch('LmsEquipInfo/page', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsEquipInfo.page;
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _pageSizeChange(rows) {
        if (rows !== this.pageParams.rows) {
          this.pageParams['rows'] = rows;
          this._page();
        }
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
        this.selectObj = data;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        if (this.apparatusName !== '') {
          this.$extend(data, {apparatusName: this.apparatusName.trim()});
        }
        if (this.apparatusSortName != null && this.apparatusSortName !== '') {
          this.$extend(data, {apparatusSortName: this.apparatusSortName});
        }
        return this.$extend(data, this.pageParams);
      },
      _classTree() {
        this.$refs.classTree._Ztree();
      },
      _classData(data) {
        $('input[name=apparatusSortName]').val(data.apparatusSortName);
        this.apparatusSortName = data.apparatusSortName;
        this._pageChange(1);
      },
      _detailModal(data) {
        // 查看
        this.$store.dispatch('LmsEquipInfo/getById', data).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipInfo.model);
        });
      },
      _addModal(id, name) {
        this.$refs.addModal._open(id, name);
      },
      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '15px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '230px'
      },
      _btnClick(msg) {
      },
    },
  }
</script>
