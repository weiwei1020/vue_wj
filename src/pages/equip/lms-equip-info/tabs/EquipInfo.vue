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
                  <Input v-model="name" placeholder="请输入仪器名称" @on-enter="_pageChange(1)"/>
                </Form-item>
                <!--<Form-item class="width-21" prop="status" label="状态:">
                  <Select v-model="status" clearable placeholder="请选择状态">
                    <Option value="0">闲置</Option>
                    <Option value="1">在用</Option>
                  </Select>
                </Form-item>-->
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
    <!--预约-->
    <LmsEquipInfoOrder ref="orderModal"></LmsEquipInfoOrder>
    <!--修改-->
    <LmsEquipChangeOrder ref="changeModal"></LmsEquipChangeOrder>
    <!--电子文档-->
    <LmsEquipInfoRecord ref="docModal"></LmsEquipInfoRecord>
    <!--上级类别弹出树-->
    <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>
    <!--导入-->
    <DownloadImportExcel ref="importModal" @on-result-change="_search"></DownloadImportExcel>
  </div>
</template>
<script>
  import global from '../../../../api/config'
  import LmsEquipInfoEdit from '../LmsEquipInfoEdit.vue'
  import LmsEquipInfoDetail from '../LmsEquipInfoDetail.vue'
  import LmsEquipClassTree from '../LmsEquipClassTree.vue'
  import LmsEquipInfoRecord from '../LmsEquipInfoRecord.vue'
  import BtnList from '../../../../components/base/BtnList.vue'
  import IconList from '../../../../components/base/IconList1.vue'
  import LmsEquipInfoOrder from '../../lms-equip-order/LmsEquipOrderEdit.vue'
  import DownloadImportExcel from '../../../../components/import/DownloadImportExcel'


  export default {
    components: {
      IconList,
      BtnList,
      LmsEquipInfoEdit,
      LmsEquipInfoDetail,
      LmsEquipClassTree,
      LmsEquipInfoRecord,
      LmsEquipInfoOrder,
      DownloadImportExcel,
    },
    data() {
      return {
        btn: [
          {type: 'success', id: '', name: '添加'},
          {type: '', id: '', name: '导入',},
          {type: '', id: '', name: '导出'},
        ],
        iconMsg: [
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
          {type: 'android-document', id: '', name: '操作记录'},
        ],
        loading: true,
        id: '',
        name: '',
        status: '',
        className: '',
        pname: '',
        tableHeight: '300',
        classId: '',
        selectIds: [],
        selectObj: [],
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
        /*  {
            title: '状态', key: 'status', width: 80, ellipsis: true, fixed: 'left', sortable: 'true',
            render: (h, data) => {
              var status = {"0": "闲置", "1": "在用"};
              let operate = [];
              if (data.row.status === undefined) {
                operate.push(
                  h('div', {}, '无')
                );
              } else {
                operate.push(
                  h('div', {
                    style: {
                      color: data.row.status === 2 || data.row.status === 3 ? '#6FBA2C' : data.row.status === 0 ? '#00a0e9' : data.row.status === 1 ? '#F8BB2C' : 'red'
                    }
                  }, status[data.row.status] ? status[data.row.status] : '')
                );
              }
              return h('div', operate);
            }
          },*/
          {title: '仪器编号', key: 'equipNum', width: 170, align: 'center', ellipsis: true, fixed: 'left', sortable: 'true',},
          {
            title: '仪器名称', key: 'name', width: 160, align: 'center', ellipsis: true, fixed: 'left', sortable: 'true',
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
          {title: '仪器类别', key: 'className', width: 160, align: 'center', ellipsis: true, sortable: 'true',},
          {title: '供应商名称', key: 'supplierId', width: 160, align: 'center', ellipsis: true, sortable: 'true',},
          {title: '供应商电话', key: 'suppliertel', width: 160, align: 'center', ellipsis: true,sortable: 'true',},
          {title: '供应商email', key: 'supplieremil', width: 160, align: 'center', ellipsis: true,sortable: 'true',},
          {title: '仪器品牌', key: 'brand', width: 160, align: 'center', ellipsis: true, sortable: 'true',},
          {title: '仪器价格', key: 'price', width: 110, align: 'center', ellipsis: true, sortable: 'true',},
          {
            title: '购买日期', key: 'buyDate', "width": 120, ellipsis: true, sortable: 'true',
            render: (h, params) => {
              return h('div', params.row.buyDate ? this.$dateformat(params.row.buyDate, "yyyy-mm-dd") : '');
            }
          },
          {title: '备注', key: 'remark', width: 180, align: 'center', ellipsis: true,},
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
    methods: {
      _btnClick(msg) {
        switch (msg) {
          case '添加' :
            this._editModal(false);
            break;
          case '导出':
            this._export();
            break;
          case '导入':
            this._upload();
            break;
          case '预约':
            this._orderModal();
            break;
          case '修改':
            this._changeModal();
            break;
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '操作记录' :
            this._docModal(data.row.id);
            break;
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
            this.$store.dispatch('LmsEquipInfo/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipInfo.success) {
                this._search();
                this.$Message.success('删除成功！');
                this.$bus.$emit('class', 'class')
              }
            });
          }
        });
      },
      _initCont() {
        this.contLength = $(".contHide").find('button').length;
        if (this.contLength) {
          this.tableHeight = this.$newTableHeight('tabBtn');
        } else {
          this.tableHeight = this.$newTableHeight('tabNoBtn');
        }
        this.treeStyleObj.height = document.documentElement.clientHeight - 110 + 'px';
        this._search();
      },
      _refresh() { //刷新
        this.classId = '';
        this.name = '';
        this.status = '';
        this._search();
        this._classTree();
      },
      _open() {
        this._initCont();
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
      _docModal(id) {
        this.$refs.docModal._open(id);
      },
      _search() {
        this._pageChange(1);
      },
      _searchParams() {
        var data = this.$serialize('search-form');
        if (this.name !== '') {
          this.$extend(data, {name: this.name.trim()});
        }
        if (this.status !== '') {
          this.$extend(data, {status: this.status});
        }
        if (this.classId != null && this.classId !== '') {
          this.$extend(data, {classId: this.classId});
        }
        return this.$extend(data, this.pageParams);
      },
      //excel文件到处部分
      _export() {
        var ids = this.selectIds;
        if (!ids.length) {
          this._exportByIds(ids, '是否要导出数据模板？');
        } else {
          this._exportByIds(ids, '确定导出 ' + ids.length + ' 条记录？');
        }
      },
      _exportByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/equip_info/export?ids=' + ids, '_blank');
          }
        });
      },

      //导入
      _upload() {
        let tempData = {
          title: '导入仪器信息',
          importUrl: '/slims/v1/equip_info/import',
          downloadUrl: '/slims/v1/excel/template/EquipInfo'
          //action: global.baseURL + '/slims/v1/equip_info/import',
        };
        this.$refs.importModal._open(tempData);
      },
      _handelsuccess(response, file, fileList) { //上传成功
        if (response.success) {
          this.$Message.success('上传成功!!!！！');
        } else {
          this.$Message.warning(response.msg);
        }
        this._search();
      },
      _classTree() {
        this.$refs.classTree._Ztree();
      },
      _classData(data) {
       // $('input[name=classId]').val(data);
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
      _orderModal() {
        if (this.selectObj.length > 1) {
          this.$Message.warning({
            content: '请选择一条项目',
            duration: 3
          });
        } else if (this.selectObj.length === 0) {
          this.$refs.orderModal._open();
        } else {
          this.$refs.orderModal._addEquip(this.selectObj[0]);
        }
      },
      _changeModal() {
        if (this.selectIds.length > 0) {
          this.$refs.chengeModal._addEquip(this.selectIds);
        } else {
          this.$refs.chengeModal._open();
        }
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
