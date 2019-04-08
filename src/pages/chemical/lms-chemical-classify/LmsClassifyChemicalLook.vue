<template>
  <div>
    <!--内容-->
    <div style="margin-left: 10px">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
          <Form id="search-form-classify-chemical" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item label="耗材名称:" class="width-48">
              <input name="classifyId" type="hidden"/>
              <Input name="name" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
            </Form-item>
            <Form-item class="marleft-70">
              <Button type="primary" @click="_formSearch">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <!--操作-->
          <Col span="24" style="margin-bottom: 10px;">
          <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                     ref="pageTable" :getPage="getPage">

          </PageTable>
          </Col>
        </Row>
      </div>
    </div>
    <!--详情-->
    <LmsChemicalDetail ref="detailChemicalModal"></LmsChemicalDetail>
    <!--添加-->
    <LmsClassiftyChemicalMake ref="makeModal" @on-result-change="_search"></LmsClassiftyChemicalMake>
  </div>
</template>
<script>
  import LmsChemicalDetail from '../LmsChemicalDetail.vue'
  import LmsClassiftyChemicalMake from './LmsClassifyChemicalMake.vue'
  import BtnList from '../../components/base/BtnList.vue'
  import PageTable from '../../components/table/PageTable'
  import IconList from '../../components/base/IconList1.vue'

  export default {
    components: {
      LmsChemicalDetail,
      LmsClassiftyChemicalMake,
      BtnList,
      PageTable,
      IconList
    },
    data() {
      return {
        btn: [
          {type: 'success', id: 'chemical-classify-supplies-add', name: '添加耗材'},
          {type: 'error', id: 'chemical-classify-supplies-del-all', name: '移除'},
        ],
        btnObj: { //按钮权限
          del: 'chemical-classify-del',
        },
        heightSearch: '',
        tableHeight: '300',
        selectIds: [],
        pageColumns: [
          {type: 'selection', width: 60, fixed: 'left'},
          {title: '耗材编号', width: 140, key: 'num', ellipsis: true,},
          {
            title: '耗材名称', key: 'name', width: 140, align: 'left', ellipsis: true,
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailChemicalModal(data.row.id);
                    }
                  }
                }, data.row.name),
              ]);
            }
          },
          {title: '耗材类别', width: 140, key: 'category', ellipsis: true,},
          {title: '库存量', width: 100, key: 'stock', ellipsis: true,},
          {title: '等级（纯度）', width: 150, key: 'quality', ellipsis: true,},
          {title: '规格', width: 100, key: 'spec', ellipsis: true,},
          {title: '密度', width: 100, key: 'thickness', ellipsis: true,},
          {title: '不确定度', width: 100, key: 'unsure', ellipsis: true,},
          {title: '标准值', width: 100, key: 'standard', ellipsis: true,},
          {title: '制造厂商', width: 200, key: 'manufacturer', ellipsis: true,},
          {title: '计量方式', width: 100, key: 'unit', ellipsis: true,},
          {title: '转化率', width: 100, key: 'exchange', ellipsis: true,},
          {title: '转化单位', width: 100, key: 'exunit', ellipsis: true,},
          {title: '转化库存量', width: 100, key: 'exstock', ellipsis: true,},
          {title: '备注', width: 140, key: 'remark', ellipsis: true,},
          {
            title: '操作', key: 'action', width: 70, fixed: 'right', align: 'center',
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

        iconMsg: [
          {type: 'close', id: 'chemical-classify-del', name: '移除'},
        ],
        DATA: { //删除要提交的数据
          classifyId: '',
          chemicalIds: []
        },
        getPage: {},
        contLength: null,
        noBtnVal: 238,
        btnVal: 292,
        dVal: 57,
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '移除' :
            this._deleteByIds([data.row.id]);
            break;
        }
      },
      _contHide() {
        this.contLength = $(".contHide").find('button').length;
        this._judgePanel(0);
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        switch (this.contLength) {
          case 0 :
            this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
            break;
          default:
            this.tableHeight = this.$tableHeight(val, this.btnVal, this.dVal);
        }
      },
      _page() {
        this.$refs.pageTable._page('search-form-classify-chemical', 'LmsChemical/getInclude');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _search() {
        this._page();
      },
      _addSelected() { //添加
        if (this.DATA.classifyId === undefined) {
          this.$Message.warning('请先选择归类名称！')
        } else {
          this.$refs.makeModal._open(this.DATA.classifyId);
        }
      },
      _deleteByIds(ids, content) {
        this.DATA.chemicalIds = ids;
        if (this.DATA.classifyId != '') {
          this.$Modal.confirm({
            title: '提示',
            content: content ? content : '确定移除该记录？',
            onOk: () => {
              this.$store.dispatch('LmsChemical/chemicalClassDel', this.DATA).then(() => {
                if (this.$store.state.LmsChemical.success) {
                  this._page();
                  this.$Message.success('移除成功！');
                  this.selectIds = [];
                  this.$emit("on-result-change");
                }
              });
            }
          });
        } else {
          this.$Message.warning('请先选择归类组！');
        }

      },
      _deleteById(id) {
        // 删除一条记录
        this._deleteByIds([id]);
      },
      _deleteSelected() {
        // 批量删除
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deleteByIds(ids, '确定移除 ' + ids.length + ' 条记录？');

        }
      },
      _open(classifyId) {
        $('input[name=classifyId]').val(classifyId);
        this._page();
        this.DATA.classifyId = classifyId;
        this.selectIds = [];
      },
      _detailChemicalModal(id) {
        // 查看
        this.$store.dispatch('LmsChemical/getById', id).then(() => {
          this.$refs.detailChemicalModal._open(this.$store.state.LmsChemical.model);
        });
      },
      _btnClick(msg) {
        switch (msg) {
          case '添加耗材' :
            this._addSelected();
            break;
          case '移除' :
            this._deleteSelected();
            break;
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemical.pageInclude;
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
