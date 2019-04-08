<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form-detail" inline onsubmit="return false" :label-width="80">
          <Form-item class="width-23" label="耗材名称:">
            <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
          </Form-item>
          <Form-item class="marleft-90">
            <Button type="primary" @click="_formSearch">搜索</Button>
          </Form-item>
        </Form>
        <!--table-->
        <Row>
          <!--操作-->
          <Col span="24" style="margin-bottom: 10px;">
          <div>
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </div>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                     ref="pageTable" :getPage="getPage">

          </PageTable>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">提交审批</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材申请表
   */
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'

  export default {
    components: {
      BtnList,
      PageTable
    },
    data() {
      return {
        tableHeight: '300',
        btn: [
          {type: 'error', id: '', name: '移除'},
        ],
        btnObj: {
          del: ''
        },
        formObj: [],
        applyFormObj: {
          remark: '', //申请原因
        },
        applyTitle: '',
        id: '',
        modalTitle: '',
        showEditModal: false,
        selectIds: [],
        DATA: {},
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {title: '耗材名称', key: 'chemicalName', width: 200, ellipsis: true},
          {title: '归还量', key: 'giveQuantity',  ellipsis: true,},
          {
            title: '操作', key: 'action', width: 110, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              let btnDel =
                h('Button', {
                  props: {type: 'error', size: 'small',},
                  attrs: {id: this.btnObj.del}, //添加自定义属性
                  on: {
                    click: () => {
                      this._remove(data.row.id);
                    }
                  }
                }, '移除');
              if (this.$showBtn(this.btnObj.del)) {
                operate.push(btnDel);
              }
              return h('div', operate.length > 0 ? operate : '--');
            }
          }
        ],
        applyValue: '',
        ruleValidate: {
          remark: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
        },
        getPage: {},
      }
    },
    methods: {
      _page() {
        this.$refs.pageTable._page('edit-form-detail', 'LmsChemicalUseHistory/chemicalPageTemp');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _ok() {
        if (this.getPage.records.length == 0) {  //采购单不能为空
          this.$Message.warning("请先添加耗材！");
        } else {
          this.$store.dispatch('LmsChemicalUseHistory/givePush').then(() => {
            if (this.$store.state.LmsChemicalUseHistory.success) {
              this.showEditModal = false;
              this.$Message.success('归还单提交审批成功！');
            }
          });
        }
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open() {
        this.showEditModal = true;
        this.id = '';
        this.modalTitle = '归还单';
        this._page();
      },
      _remove(id) { //移除一条数据
        this._deletePurIds([id]);
      },
      _deletePurIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalUseHistory/deletePurIds', ids).then(() => {
              if (this.$store.state.LmsChemicalUseHistory.success) {
                this._page();
                this.$Message.success('删除成功！');
                this.selectIds = [];
              }
            });
          }
        });
      },
      _deleteSelected() {  // 批量移除
        var ids = this.selectIds;
        if (ids == '') {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          this._deletePurIds(ids, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _search() {
        this._page();
      },
      _btnClick(msg) {
        switch (msg) {
          case '移除' :
            this._deleteSelected();
            break;
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalUseHistory.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
    }
  }
</script>
