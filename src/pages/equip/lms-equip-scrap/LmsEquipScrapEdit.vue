<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Alert>
          <Form id="edit-scrap-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90"
                class="coll-search" inline>
            <Form-item label="申请名称" prop="name" class="width-32">
              <Input name="name" v-model="formObj.name" placeholder="请输入申请名称"/>
            </Form-item>
            <Form-item label="申请原因" prop="applyReason" class="width-32">
              <Input name="applyReason" v-model="formObj.applyReason" placeholder="请输入申请原因"/>
            </Form-item>
            <Form-item label="备注" prop="remark" class="width-32">
              <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"/>
            </Form-item>
            <input type="hidden" name="id" v-model="formObj.id">
          </Form>
        </Alert>
        <!--报废详情-->
        <Row>
          <!--操作-->
          <Col span="24" style="margin-bottom: 10px;">
          <div>
            <Button type="success" @click="_editModal(false)">添加</Button>
            <Button type="error" @click="_deleteSelected">删除</Button>
            <Button type="info" @click="_batch">批量维护</Button>
          </div>
          </Col>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :columns="pageColumns" :data="getPageList" size="small" border highlight-row stripe
                 @on-selection-change="_selectRowChange" @on-select-all='_selectAll' :height="250"></Table>
          </Col>
        </Row>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok('DRAFT')">草稿</Button>
        <Button @click="_ok('TECHNOLOGY_CHECK')" type="primary">提交</Button>
      </div>
    </Modal>
    <!--添加-->
    <LmsEquipScrapedEdit ref="editModal" @on-result-change="_scrapData"></LmsEquipScrapedEdit>
    <!--批量维护-->
    <LmsEquipScrapBatch ref="batchModal" @on-result-change="_batchResult"></LmsEquipScrapBatch>
  </div>
</template>
<script>

  import LmsEquipScrapedEdit from './detail/LmsEquipScrapDetailEdit.vue'
  import IconList from '../../../components/base/IconList1.vue'
  import LmsEquipScrapBatch from './detail/LmsEquipScrapBatch'
  /*
     * 添加编辑仪器报废信息表
     */
  const defVal = {
    id: '',
    name: '',
    applyReason: '',
    status: '',
    remark: '',
  };
  export default {
    components: {
      LmsEquipScrapedEdit,
      IconList,
      LmsEquipScrapBatch
    },
    data() {
      return {
        id: '',
        dataObj: {
          scrapId: '',
        },

        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '申请名称不能为空', trigger: 'blur'}],
          applyReason: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        selectIds: [],
        getPageList: [],
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {title: '仪器名称', key: 'name', width: 160, align: 'center'},
          {title: '仪器编号', key: 'equipNum', width: 160, align: 'center'},
          {title: '规格型号', key: 'spec', width: 160, align: 'center'},
          {title: '实验室编号', key: 'labNum', width: 160, align: 'center'},
          {title: '使用科别', key: 'departmentName', width: 160, align: 'center'},
          {title: '使用位置', key: 'locationName', width: 160, align: 'center'},
          {
            title: '购买日期', key: 'buyDate', "width": 160,
            render: (h, params) => {
              return h('div', params.row.buyDate ? this.$dateformat(params.row.buyDate, "yyyy-mm-dd") : '');
            }
          },
          {
            title: '有效日期', key: 'effectDate', "width": 160,
            render: (h, params) => {
              return h('div', params.row.effectDate ? this.$dateformat(params.row.effectDate, "yyyy-mm-dd") : '');
            }
          },
          {title: '金额', key: 'money', width: 160, align: 'center'},
          {title: '报废原因', key: 'reason', width: 160, align: 'center'},
          {title: '备注', key: 'remark', width: 160, align: 'center'},
          {
            title: '操作', key: 'action', width: 90, fixed: 'right', align: 'center',
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
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
        ],
      }
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '删除' :
            this._deleteById(data.row.id);
            break;
          case '编辑':
            this._editModal(true, data.row.id);
            break;
        }
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipScrap.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok(status) {
        if (status === 'TECHNOLOGY_CHECK' && this.getPageList.length === 0) {
          this.$Message.warning('请添加仪器后再提交！');
          return;
        }
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-scrap-form');
            this.$extend(data, {status: status});

            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipScrap/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipScrap/edit', {id: this.formObj.id, obj: data}).then(() => {
                this._resultChange('编辑成功!');
              });
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel() {
        this.showEditModal = false;
      },
      _getTemp() {//查询有没有添加但没有保存的数据
        this.$store.dispatch('LmsEquipScrap/getTemp').then(() => {
          this.formObj.id = this.$store.state.LmsEquipScrap.model.id;
          this.dataObj.scrapId = this.$store.state.LmsEquipScrap.model.id;
          if (!this.$string(this.$store.state.LmsEquipScrap.model.lmsEquipScrapDetailVOList).isEmpty()) {
            this.getPageList = this.$store.state.LmsEquipScrap.model.lmsEquipScrapDetailVOList;
          }
        });
      },
      _open(formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.getPageList = [];
          this.modalTitle = '添加仪器报废信息表';
          this._getTemp();
        } else {
          this.formObj = formObj;
          this.id = formObj.id;
          this.dataObj.scrapId = formObj.id;
          this.getPageList = formObj.lmsEquipScrapDetailVOList;
          this.modalTitle = '编辑仪器报废信息表';
        }
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipScrapDetail/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipScrapDetail.success) {
                this._scrapData();
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
      _deleteById(id) {// 删除一条记录
        this._deleteByIds([id]);
      },
      _batch() {
        if (!this.selectIds.length) {
          this.$Message.warning('请至少选择一条数据！');
        } else {
          this.$refs.batchModal._open(this.selectIds);
        }
      },
      _batchResult() {
        this._getTemp();
      },
      _deleteSelected() {// 批量删除
        if (!this.selectIds.length) {
          this.$Message.warning('请至少选择一条数据！');
        } else {
          this._deleteByIds(this.selectIds, '确定删除 ' + ids.length + ' 条记录？');
        }
      },
      _editModal(flag, id) {
        if (flag) {
          this.$store.dispatch('LmsEquipScrapDetail/getById', id).then(() => {
            this.$refs.editModal._open(this.dataObj.scrapId, this.$store.state.LmsEquipScrapDetail.model);
          });
        } else {
          this.$refs.editModal._open(this.dataObj.scrapId);
        }
      },
      _addEquip(ids) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.getPageList = [];
        this.modalTitle = '添加仪器报废信息表';
        this.$store.dispatch('LmsEquipScrap/infoAddEquip', ids).then(() => {
          this.dataObj.scrapId = this.$store.state.LmsEquipScrap.model.id;
          if (!this.$string(this.$store.state.LmsEquipScrap.model.lmsEquipScrapDetailVOList).isEmpty()) {
            this.getPageList = this.$store.state.LmsEquipScrap.model.lmsEquipScrapDetailVOList;
          }
        });
      },
      _scrapData() {
        this.$store.dispatch('LmsEquipScrapDetail/list', this.dataObj).then(() => {
          this.getPageList = this.$store.state.LmsEquipScrapDetail.list;
        });
      },
    }
  }
</script>
