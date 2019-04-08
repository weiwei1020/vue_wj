<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
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
        <Button @click="_ok(true)" type="primary">提交审批</Button>
      </div>
    </Modal>
    <!--申请原因-->
    <Modal v-model="showModal" :mask-closable="false">
      <p slot="header">{{applyTitle}}</p>
      <div>
        <Form ref="applyFormObj" :model="applyFormObj" :rules="ruleValidate" :label-width="100">
          <Form-item label="申请原因" prop="remark">
            <Input v-model="applyFormObj.remark" type="textarea" :rows="4" placeholder="请输入申请原因 ..."></Input>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_applyCancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_applyOk" type="primary">确定</Button>
      </div>
    </Modal>
    <!--申请单进行编辑-->
    <LmsChemicalRelApplyEdit ref="relEditModel" @on-result-change="_search"></LmsChemicalRelApplyEdit>
  </div>
</template>
<script>
  /**
   * 添加编辑试验耗材申请表
   */
  import LmsChemicalRelApplyEdit from './LmsChemicalRelApplyEdit.vue'
  import BtnList from '../../../components/base/BtnList.vue'
  import PageTable from '../../../components/table/PageTable'

  export default {
    components: {
      LmsChemicalRelApplyEdit,
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
          edit: '',
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
          {title: '耗材编号', key: 'chemicalNumber', width: 150, ellipsis: true},
          {title: '耗材名称', key: 'chemicalName', width: 160, ellipsis: true},
          {
            title: '申请数量', key: 'stockNumber', width: 150, ellipsis: true,
            render: (h, data) => {
              return h("Input", {
                props: {
                  type: "number",
                  value: data.row.stockNumber,
                },
                on: {
                  'on-blur': (event,) => {
                    data.row.stockNumber = event.target.value;
                    this._cellChange(data.row._index, event.target.value, 'stockNumber');
                  },
                }
              })
            }
          },
          {
            title: '规格', key: 'spec', width: 100, ellipsis: true,
            render: (h, data) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: data.row.spec,
                },
                on: {
                  'on-blur': (event,) => {
                    data.row.spec = event.target.value;
                    this._cellChange(data.row._index, event.target.value, 'spec');
                  },
                }
              })
            }
          },
          {title: '申请原因', key: 'remark', ellipsis: true,
            render: (h, data) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: data.row.remark,
                },
                on: {
                  'on-blur': (event,) => {
                    data.row.remark = event.target.value;
                    this._cellChange(data.row._index, event.target.value, 'remark');
                  },
                }
              })
            }
          },
          {
            title: '操作', key: 'action', width: 160, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              let btnDel =
                h('Button', {
                  props: {type: 'error', size: 'small',},
                  attrs: {id: this.btnObj.del},
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
        showModal: false,
        applyValue: '',
        ruleValidate: {
          remark: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
          stockNumber: [{required: true, message: '申请数量不能为空', trigger: 'blur'}],
        },
        getPage: {},
      }
    },
    methods: {
      _cellChange(index, value, name) {
        for (let i = 0; i < this.getPage.records.length; i++) {
          if (i === index) {
            this.getPage.records[i][name] = value;
            this._blurSave(name, value, this.getPage.records[i]);
            break;
          }
        }
      },
      _blurSave(name, value, item) {
        let obj = {
          [name]: value
        };
        this.$store.dispatch('LmsChemicalApply/editChemical', {id:item.id, obj:obj}).then(() => {
          if (this.$store.state.LmsChemicalApply.success) {
            this._page();
          }
        });
      },
      _page() {
        this.$refs.pageTable._page('edit-form-detail', 'LmsChemicalApply/pageTemp');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _ok(approve) {
        if (this.getPage.records.length == 0) {  //申请单不能为空
          this.$Message.warning("请先添加耗材！");
        } else {
          this.showModal = true;
          this.applyValue = approve;
          this.applyFormObj.remark = '';
          if (approve) { //提交审批
            this.applyTitle = '申请单提交审批';
          } /*else {      //保存
            this.applyTitle = '申请单保存'
          }*/
        }
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open() {
        this.showEditModal = true;
        this.id = '';
        this.modalTitle = '领用申请单';
        this._page();
      },
      _purOrder() {
        this.$store.dispatch('LmsChemicalApply/purOrder', {
          remark: this.applyFormObj.remark
        }).then(() => {
          if (this.$store.state.LmsChemicalApply.success) {
            this.showEditModal = false;
              this.$Message.success('申请单提交审批成功！');
          }
        });
      },
      _remove(id) { //移除一条数据
        this._deletePurIds([id]);
      },
      _deletePurIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsChemicalApply/deletePurIds', ids).then(() => {
              if (this.$store.state.LmsChemicalApply.success) {
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
      _applyCancel() { //申请原因取消
        this.showModal = false;
      },
      _applyOk() {  //申请原因提交
        this.$refs['applyFormObj'].validate((valid) => {
          if (valid) {
            this.showModal = false;
            this._purOrder(this.applyValue);
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _edit(id, chemicalId) { //编辑
        this.$refs.relEditModel._open(id, chemicalId);
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
            this.getPage = this.$store.state.LmsChemicalApply.page;
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
