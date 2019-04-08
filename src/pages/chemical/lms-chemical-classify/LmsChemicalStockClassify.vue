<template>
  <div>
    <Modal v-model="showStockModal" title="归类" width="1200">
      <!--内容-->
      <div>
        <Row>
          <Col span="11">
          <Card class="card_item">
            <p slot="title">未添加归类</p>
            <div>
              <LmsChemicalMakeClassify ref="chemicalMakeClassifyModal"
                                       @on-result-change="_searchChemical"></LmsChemicalMakeClassify>
            </div>
          </Card>
          </Col>
          <Col span="2">
          <div style="text-align: center;margin-top:250px">
            <div style="margin-bottom: 20px">
              <Tooltip content="添加" transfer placement="right">
                <Button type="primary" @click="_submit">
                  <Icon type="chevron-right"></Icon>
                </Button>
              </Tooltip>
            </div>
            <div>
              <Tooltip content="移除" transfer placement="right">
                <Button type="primary" @click="_deleteSelected">
                  <Icon type="chevron-left"></Icon>
                </Button>
              </Tooltip>
            </div>
          </div>
          </Col>
          <Col span="11">
          <Card class="card_item">
            <p slot="title">已添加归类</p>
            <div>
              <Row>
                <Col span="24">
                <Form id="search-form-classify" inline onsubmit="return false">
                  <label class="label-sign"></label>
                  <Form-item>
                    归类名称：<Input name="name" placeholder="请输入归类名称" style="width: 160px;"
                                @on-enter="_pageChange(1)"></Input>
                  </Form-item>
                  <input name="classifyed" type="hidden" value="0"></input>
                  <Form-item>
                    <Button type="primary" @click="_pageChange(1)">搜索</Button>
                  </Form-item>
                </Form>
                </Col>
                <Col span="24">
                <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small" border
                       highlight-row
                       disabled-hover
                       @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="400"
                       :row-class-name="_rowClassName"></Table>
                </Col>
                <!--分页-->
                <Col span="24">
                <Page :total="getPage.total" :page-size="getPage.size" :current="getPage.current"
                      @on-change="_pageChange"
                      @on-page-size-change='_pageSizeChange'
                      placement="top" show-total style="margin-top:10px"></Page>
                </Col>
              </Row>
            </div>
          </Card>
          </Col>
        </Row>
      </div>
    </Modal>
    <!--耗材详情-->
    <LmsChemicalClassifyDetail ref="detailModal"></LmsChemicalClassifyDetail>
  </div>
</template>
<script>
  import LmsChemicalMakeClassify from './LmsChemicalMakeClassify.vue'
  import LmsChemicalClassifyDetail from './LmsChemicalClassifyDetail.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      LmsChemicalMakeClassify,
      LmsChemicalClassifyDetail,
      BtnList,
      IconList
    },
    data() {
      return {
        // btn: [
        //   {type: 'success', id: 'chemical-manage-classify-add', name: '添加'},
        //   {type: 'error', id: 'chemical-manage-classify-del-all', name: '移除'},
        // ],
        btnObj: { //按钮权限
          view: 'chemical-manage-classify-view',
          del: 'chemical-manage-classify-del',
        },
        loading: true,
        makeClassIdsData: {
          classPks: [],
          chemicalPks: []
        },
        selectIds: [],
        chemicalClassIds: [],
        classIds: [],
        pageParams: {
          rows: 20,
        },
        showStockModal: false,
        pageColumns: [
          {type: 'selection', width: 60,fixed:'left'},
          {
            title: '归类名称', key: 'name', width: 120, ellipsis: true,
            render: (h, data) => {
              let operate = [];
              let btnView = h('a', {
                on: {
                  click: () => {
                    this._detailModal(data.row.id);
                  }
                }
              }, data.row.name);
              if (this.$showBtn(this.btnObj.view)) {
                operate.push(btnView);
              }
              return h('div', operate.length > 0 ? operate : data.row.name);
            }
          },
          {title: '归类库存量', width: 120, key: 'stock', ellipsis: true},
          {title: '计量单位', width: 100, key: 'unit', ellipsis: true},
          {title: '预警库存量', key: 'warning', ellipsis: true, width: 100},
          {title: '备注', key: 'remark', ellipsis: true},
          {
            title: '操作', key: 'action', width: 70, align: 'left',fixed:'right',
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
          }
        ],
        iconMsg: [
          {type: 'close', id: 'chemical-manage-del', name: '移除'},
        ],
        // chemicalId: '',
        DATA: { //删除要提交的数据
          chemicalId: '',
          classifyIds: []
        },
        getPage: {},
        //未归类数据
        selectedIds: []
      }
    },
    methods: {
      _resultChange(msg){
        if(this.$store.state.LmsChemicalClassify.success){
          this.$Message.success(msg);
          this.$emit("on-result-change");
          this.selectedIds = [];
          this.selectIds = [];
          this._open(this.DATA.chemicalId);
        }
      },
      //添加
      _submit() {
        if(this.selectedIds.length === 0){
          this.$Message.warning('请至少选择一条要进行归类类别！')
        }else{
          let tempData = {
            classifyIds:this.selectedIds,
            chemicalId:this.DATA.chemicalId
          };
          this.$store.dispatch('LmsChemicalClassify/chemicalClass', tempData).then(() => {
            this._resultChange('添加成功');
          });
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '移除' :
            this._deleteByIds([data.row.id]);
            break;
        }
      },
      _rowClassName(row, index) {
        if (row.stock < row.warning) { //归类库存量小于预警库存量
          return 'table-error-row';
        } else {
          return '';
        }
      },
      _page() {
        this.$store.dispatch('LmsChemicalClassify/getIncludePage', this._searchParams()).then(() => {
          this.loading = false;
          this.getPage = this.$store.state.LmsChemicalClassify.includePage;
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
      },
      _selectAll(data) {
        this._selectRowChange(data);
      },
      _deleteByIds(ids, content) {
        this.DATA.classifyIds = ids;
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定移除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalClassify/chemicalClassDel', this.DATA).then(() => {
              this._resultChange('移除成功');
            });
          }
        });
      },
      _deleteById(id) {
        // 删除一条记录
        this._deleteByIds([id]);
      },
      _deleteSelected() {
        // 批量删除
        var ids = this.selectIds;
        this.DATA.classifyIds = ids;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条已归类数据！');
        } else {
          this._deleteByIds(ids, '确定移除 ' + ids.length + ' 条记录？');
        }
      },
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsChemicalClassify/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsChemicalClassify.model);
        });
      },
      _search() {
        this._page();
      },
      _searchChemical(data) {
        this.selectedIds = data;
        // this._page();
        // this.$emit("on-result-change");
      },
      _searchParams() {
        var data = this.$serialize('search-form-classify');
        return this.$extend(data, this.pageParams);
      },
      _open(id) {
        this.showStockModal = true;
        this.pageParams.chemicalId = id;
        this.DATA.chemicalId = id;
        this.$refs.chemicalMakeClassifyModal._open(this.DATA.chemicalId);
        this._page();
      },
      // _btnClick(msg) {
      //   switch (msg) {
      //     case '添加' :
      //       this._addChemical();
      //       break;
      //     case '移除' :
      //       this._deleteSelected();
      //       break;
      //   }
      // },
    },
  }
</script>
