<template>
  <div>
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
        <div style="position: absolute;left:10px;top: 50%;cursor:pointer" @click="_treeShow" v-else="isTree">
          <div class="navbarImgHide"></div>
        </div>
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <Col span="24" style="margin-top: 15px;">
              <Form id="search-form" inline onsubmit="return false" :label-width="70">
                <label class="label-sign"></label>
                <Form-item class="width-21" label="仪器名称:">
                  <Input v-model="apparatusName" placeholder="请输入仪器名称" @on-enter="_pageChange(1)"/>
                </Form-item>
                <Form-item class="search-btn">
                  <Button type="primary" @click="_pageChange(1)">搜索</Button>
                </Form-item>
              </Form>

            </Col>
            <!--操作-->
            <Col span="24" style="margin-bottom: 15px;">
              <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
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
    <!-- 添加、编辑 -->
    <LmsEquipInfoEdit ref="editModal" @on-result-change="_search"></LmsEquipInfoEdit>
    <!-- 查看详情 -->
    <LmsEquipInfoDetail ref="detailModal"></LmsEquipInfoDetail>
    <!--上级类别弹出树-->
    <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>
  </div>
</template>
<script>
  import LmsEquipInfoEdit from '../LmsEquipInfoEdit.vue'
  import LmsEquipInfoDetail from '../LmsEquipInfoDetail.vue'
  import LmsEquipClassTree from '../LmsEquipClassTree.vue'
  import BtnList from '../../../../components/base/BtnList.vue'
  import IconList from '../../../../components/base/IconList1.vue'
  export default {
    components: {
      IconList,
      BtnList,
      LmsEquipInfoEdit,
      LmsEquipInfoDetail,
      LmsEquipClassTree,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'trash-a', id: '', name: '删除'},
          // {type: 'android-document', id: '', name: '操作记录'},
        ],
        loading: true,
        id: '',
        apparatusName: '',
        className: '',
        pname: '',
        classId: '',
        selectIds: [],
        selectObj: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
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
        getPage: {},
        treeStyleObj: {
          'width': '210px',
          'height': ''
        },
        tableStyleObj: {
          'margin-left': '215px',
        },
        isTree: true,
        contLength: 0,
        treeObj: {},
      }
    },
    computed: {
      tableHeight: function () {
        return this.$tableHeight('tabSearch');
      }
    },
    methods: {
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.apparatusId);
            break;
          case '删除' :
            this._deleteById(data.row.apparatusId);
            break;
          // case '操作记录' :
          //   this._docModal(data.row.apparatusId);
          //   break;
        }
      },
      _deleteById(id) {
        this._deleteByIds([id]);
      },
      _deleteSelected() {
        if (this.selectIds === '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(this.selectIds, '确定删除 ' + this.selectIds.length + ' 条记录？');
        }
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipInfo/deleteByIds', ids.join(',')).then(() => {
              if (this.$store.state.LmsEquipInfo.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.$bus.$emit('class', 'class')
              }
            });
          }
        });
      },
      _refresh() { //刷新
        this.classId = '';
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
      _detailModal(id) {
        // 查看
        this.$store.dispatch('LmsEquipInfo/getById', id).then(() => {
          this.$refs.detailModal._open(this.$store.state.LmsEquipInfo.model);
        });
      },
      _editModal(edit, id) {
        if (edit) {
          // 编辑
          this.$store.dispatch('LmsEquipInfo/getById', id).then(() => {
            this.$refs.editModal._open('',this.$store.state.LmsEquipInfo.model);
          });
        } else {
          // 添加
          this.$refs.editModal._open(this.treeObj, '');
        }
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        if (this.apparatusName !== '') {
          this.$extend(data, {apparatusName: this.apparatusName.trim()});
        }
        if (this.classId != null && this.classId !== '') {
          this.$extend(data, {classId: this.classId});
        }
        return this.$extend(data, this.pageParams);
      },
      _classTree() {
        this.$refs.classTree._Ztree();
      },
      _classData(data) {
       // $('input[apparatusName=classId]').val(data);
        this.classId = data.id;
        this.treeObj=data;
        this._pageChange(1);
      },
      _treeHide() { //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '20px'
      },
      _treeShow() {
        this.isTree = true;
        this.tableStyleObj.marginLeft = '215px'
      },
      _selectZtree() {
        if (this.$string(this.id).isEmpty()) {
          this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        } else {
          this.$refs.ztreeModal._openZtree(this.formObj.pid);  //打开上ztreeModel
        }
      },
      _ztree(result) {
        this.pname = '';
        if (result === undefined) {
          this.formObj.pid = '0';
          this.pname = '';
        } else {
          this.formObj.pid = result.id;
          this.pname = result.name;
        }
      },
    },
  }
</script>
