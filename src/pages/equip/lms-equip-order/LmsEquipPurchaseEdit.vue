<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Row>
          <Col span="24" style="margin-bottom: 10px">
            <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                       ref="pageTable" :getPage="getPage">
            </PageTable>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_save">保存</Button>
        <Button @click="_ok" type="primary">提交审批</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 添加编辑试验仪器申请表
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
        btnObj: { //按钮权限
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
          {title: '仪器名称', key: 'equipName', width: 220, ellipsis: true},
          {
            title: '开始使用时间', key: 'orderStartTime', width: 200, ellipsis: true,
            render: (h, data) => {
              return h("Date-picker", {
                props: {
                  type: "datetime",
                  value: data.row.orderStartTime,
                  editable: false,
                },
                on: {
                  'on-change': (event,) => {
                    data.row.orderStartTime = event;
                    this._cellChange(data.row._index, event, 'orderStartTime');
                  },
                }
              })
            }
          },
          {
            title: '结束使用时间', key: 'orderEndTime', width: 200, ellipsis: true,
            render: (h, data) => {
              return h("Date-picker", {
                props: {
                  type: "datetime",
                  value: data.row.orderEndTime,
                  editable: false,
                },
                on: {
                  'on-change': (event,) => {

                    data.row.orderEndTime = event;
                    this._cellChange(data.row._index, event, 'orderEndTime');
                  },
                }
              })
            }
          },
          {
            title: '申请原因', key: 'applyReason', width: 340, ellipsis: true,
            render: (h, data) => {
              return h("Input", {
                props: {
                  type: "text",
                  value: data.row.applyReason,
                },
                on: {
                  'on-blur': (event,) => {
                    data.row.applyReason = event.target.value;
                    this._cellChange(data.row._index, event.target.value, 'applyReason');
                  },
                }
              })
            }
          },
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              let operate = [];
              let btnDel =
                h('Button', {
                  props: {type: 'error', size: 'small',},
                  attrs: {id: this.btnObj.del}, //添加自定义属性
                  on: {
                    click: () => {
                      this._remove(data.row.tempId);
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
          applyReason: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
          orderStartTime: [{required: true, message: '开始使用时间', trigger: 'on-change'}],
          orderEndTime: [{required: true, message: '结束使用时间', trigger: 'on-change'}],
        },
        getPage: {},
      }
    },
    methods: {
      _cellChange(index, value, name) {
        for (let i = 0; i < this.getPage.records.length; i++) {
          if (i === index) {
            if ('orderStartTime' === name || 'orderEndTime' === name) {
              value = this.$dateformat(value, "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'");
            }
            this.getPage.records[i][name] = value;
            //  this._blurSave(name, value, this.getPage.records[i]);
            break;
          }
        }
      },
      _page() {
        this.$refs.pageTable._page('edit-form-detail', 'LmsEquipOrder/chemicalPageTemp');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _ok() {
        if (this.getPage.records.length == 0) {  //申请单不能为空
          this.$Message.warning("请先添加仪器！");
        } else {
          var data = {};
          data.list = this.getPage.records;
          this.$store.dispatch('LmsEquipOrder/submitDraft', data).then(() => {
            if (this.$store.state.LmsEquipOrder.success) {
              this.$Message.success('申请单提交成功！');
              this.showEditModal = false;
            }
          });
        }
      },
      _save() {
        if (this.getPage.records.length == 0) {  //申请单不能为空
          this.$Message.warning("请先添加仪器！");
        } else {
          var data = {};
          data.list = this.getPage.records;
          this.$store.dispatch('LmsEquipOrder/submitOrder', data).then(() => {
            if (this.$store.state.LmsEquipOrder.success) {
              this.$Message.success('申请单保存成功！');
              this.showEditModal = false;
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
        this.modalTitle = '申请单';
        this._page();
      },
      _purOrder(approve) {
        this.$store.dispatch('LmsEquipOrder/purOrder', {}).then(() => {
          if (this.$store.state.LmsEquipOrder.success) {
            this.showEditModal = false;
            if (approve) { //提交审批
              this.$Message.success('申请单提交审批成功！');
            } else {     //保存
              this.$Message.success('申请单保存成功！');
            }

          }
        });
      },
      _remove(ids) { //移除一条数据
        this._deletePurIds(ids);
      },
      _deletePurIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipOrder/deletePurIds', ids).then(() => {
              if (this.$store.state.LmsEquipOrder.success) {
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
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsEquipOrder.purchasePage;
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
