<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Alert>
          <Form id="edit-maintain-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90"
                class="coll-search" inline>
            <Form-item label="计划名称" prop="name" class="width-32">
              <Input name="name" v-model="formObj.name" placeholder="请输入计划名称"/>
            </Form-item>
            <Form-item label="申请原因" prop="applyReason" class="width-32">
              <Input name="applyReason" placeholder="请输入申请原因" v-model="formObj.applyReason"/>
            </Form-item>
            <Form-item label="备注" prop="remark" class="width-32">
              <Input name="remark" placeholder="请输入备注" v-model="formObj.remark"/>
            </Form-item>
            <input type="hidden" name="id" v-model="formObj.id">
          </Form>
        </Alert>
        <!--维保详情-->
        <Row>
          <Col span="24" style="margin-bottom: 10px">
          <!--操作-->
          <div>
            <Button type="success" @click="_editModal(false)">添加</Button>
            <Button type="error" @click="_deleteSelected">批量删除</Button>
            <Button type="info" @click="_batch">批量维护</Button>
          </div>
          </Col>
          <!-- 表格 -->
          <Col span="24" style="margin-bottom: 10px">
          <Table :columns="pageColumns" :data="getPageList" size="small" border highlight-row stripe
                 :height="250" @on-selection-change="_selectRowChange" @on-select-all='_selectAll'></Table>
          </Col>
        </Row>
      </div>
      <Form id="file-form" :label-width="90" inline>
        <Form-item label="附件上传" style="width: 98.6%;">
          <div class="file-upload-list" v-for="item in lmsEquipFiles">
            <div>
              <div class="file-upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="_handleView(item)"></Icon>
                <Icon type="ios-cloud-download-outline" @click.native="_downloadFile(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="_handleRemove(item)"></Icon>
              </div>
            </div>
            {{item.orginName}}
          </div>
          <Upload
            :show-upload-list="false"
            :with-credentials="true"
            :on-success="_handleSuccess"
            type="drag"
            :action="fileAction"
            :data="fileObj"
            style="display: inline-block;width:100px;">
            <div style="width: 100px;height:100px;line-height: 100px;">
              <Icon type="ios-cloud-upload" size="20"></Icon>
            </div>
          </Upload>
        </Form-item>
      </Form>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(0)" type="success" style="margin-left: 8px">草稿</Button>
        <Button @click="_ok(1)" type="primary">提交</Button>
      </div>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="'https://obs.myhwclouds.com/lims/'+filePath" v-if="visible" style="width: 100%">
    </Modal>
    <!--添加仪器维保明细-->
    <LmsEquipMaintainedEdit ref="editModal" @on-result-change="_MaintainData"></LmsEquipMaintainedEdit>
    <!--批量维护-->
    <LmsEquipMaintainBatch ref="batchModal" @on-result-change="_batchResult"></LmsEquipMaintainBatch>
  </div>
</template>
<script>
  /**
   * 添加编辑仪器保养计划信息表
   */
  import LmsEquipMaintainedEdit from './detail/LmsEquipMaintainDetailEdit.vue'
  import global from '../../../api/config'
  import LmsEquipMaintainBatch from './detail/LmsEquipMaintainBatch'
  import IconList from '../../../components/base/IconList1.vue'

  const defVal = {
    id:'',
    name: '',
    status: '',
    applyReason: '',
    remark: '',
    lmsEquipFiles: [],
  };
  export default {
    components: {
      LmsEquipMaintainedEdit, LmsEquipMaintainBatch,IconList
    },
    data() {
      return {
        id: '',
        dataObj: {
          maintainId: '',
        },
        lmsEquipFiles: [],//文件列表
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '计划名称不能为空', trigger: 'blur'}],
          applyReason: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        selectIds: [],
        getPageList: [],//详情列表
        fileAction: global.baseURL + '/zuul/slims/v1/equip_maintain/uploadFile',
        fileObj: {
          id: '',
        },
        visible: false,
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {title: '维保项目名称', key: 'projectName', width: 160, align: 'center'},
          {title: '维保内容', key: 'maintainContent', width: 160, align: 'center'},
          {
            title: '计划保养开始时间', key: 'maintainStartTimePlan', "width": 160,
            render: (h, params) => {
              return h('div', params.row.maintainStartTimePlan ? this.$dateformat(params.row.maintainStartTimePlan, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {
            title: '计划保养结束时间', key: 'maintainEndTimePlan', "width": 160,
            render: (h, params) => {
              return h('div', params.row.maintainEndTimePlan ? this.$dateformat(params.row.maintainEndTimePlan, "yyyy-mm-dd HH:MM:ss") : '');
            }
          },
          {title: '维保人员', key: 'maintainerNames', width: 160, align: 'center'},
          {title: '备注', key: 'remark', width: 160, align: 'center'},
          {title: '仪器名称', key: 'name', width: 160, align: 'center'},
          {title: '规格型号', key: 'spec', width: 160, align: 'center'},
          {title: '仪器编号', key: 'equipNum', width: 160, align: 'center'},
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
          {
            title: '操作', key: 'action', width: 90, align: 'center', fixed: 'right',
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
          {type: 'edit', id: '', name: '编辑'},
          {type: 'close', id: '', name: '删除'},
        ],
      }
    },
    methods: {
      _iconClick(res, data) {
        switch (res) {
          case '编辑' :
            this._editModal(true, data.row.id);
            break;
          case '删除' :
            this._deleteById(data.row.id);
            break;
        }
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipMaintain.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (status === 1 && this.getPageList.length === 0) {
            this.$Message.warning('请添加仪器后再提交！');
            return;
          }
          if (valid) {
            var data = this.$serialize('edit-maintain-form');
            this.$extend(data, {status: status, lmsEquipFiles: this.lmsEquipFiles});
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipMaintain/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipMaintain/edit', {id: this.formObj.id, obj: data}).then(() => {
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
      _open(formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.formObj = defVal;
        if (this.$string(formObj).isEmpty()) {
          this.getPageList = [];
          this.lmsEquipFiles = [];
          this.modalTitle = '添加仪器保养计划信息表';
          this._getTemp();
        } else {
          this.formObj = formObj;
          this.id = formObj.id;
          this.dataObj.maintainId = formObj.id;//列表添加id
          this.fileObj.id = formObj.id;//文件上传id
          this.getPageList = formObj.lmsEquipMaintainDetailVOList;//列表
          this.lmsEquipFiles = formObj.lmsEquipFiles;//文件集合
          this.modalTitle = '编辑仪器保养计划信息表';
        }
      },
      _getTemp() {
        this.$store.dispatch('LmsEquipMaintain/getTemp').then(() => {
          this.formObj.id=this.$store.state.LmsEquipMaintain.model.id;
          this.fileObj.id = this.$store.state.LmsEquipMaintain.model.id;
          this.dataObj.maintainId = this.$store.state.LmsEquipMaintain.model.id;
          if (!this.$string(this.$store.state.LmsEquipMaintain.model.lmsEquipMaintainDetailVOList).isEmpty()) {
            this.getPageList = this.$store.state.LmsEquipMaintain.model.lmsEquipMaintainDetailVOList;
          }
          if (!this.$string(this.$store.state.LmsEquipMaintain.model.lmsEquipFiles).isEmpty()) {
            this.lmsEquipFiles = this.$store.state.LmsEquipMaintain.model.lmsEquipFiles;
          }
        });
      },
      _deleteByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content ? content : '确定删除该记录？',
          onOk: () => {
            this.$store.dispatch('LmsEquipMaintainDetail/deleteByIds', ids).then(() => {
              if (this.$store.state.LmsEquipMaintainDetail.success) {
                this._MaintainData();
                this.$Message.success('删除成功！');
              }
            });
          }
        });
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
          this._deleteByIds(this.selectIds, '确定删除 ' + this.selectIds.length + ' 条记录？');
        }
      },
      _editModal(flag, id) {
        if (flag) {
          this.$store.dispatch('LmsEquipMaintainDetail/getById', id).then(() => {
            this.$refs.editModal._open(this.dataObj.maintainId, this.$store.state.LmsEquipMaintainDetail.model);
          });
        } else {
          this.$refs.editModal._open(this.dataObj.maintainId);
        }
      },
      _addEquip(ids) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.formObj = defVal;
        this.getPageList = [];
        this.lmsEquipFiles = [];
        this.modalTitle = '添加仪器保养计划信息表';
        this.$store.dispatch('LmsEquipMaintain/infoAddEquip', ids).then(() => {
          this.fileObj.id = this.$store.state.LmsEquipMaintain.model.id;
          this.dataObj.maintainId = this.$store.state.LmsEquipMaintain.model.id;
          if (!this.$string(this.$store.state.LmsEquipMaintain.model.lmsEquipMaintainDetailVOList).isEmpty()) {
            this.getPageList = this.$store.state.LmsEquipMaintain.model.lmsEquipMaintainDetailVOList;
          }
          if (!this.$string(this.$store.state.LmsEquipMaintain.model.lmsEquipFiles).isEmpty()) {
            this.lmsEquipFiles = this.$store.state.LmsEquipMaintain.model.lmsEquipFiles;
          }
        });
      },
      _MaintainData() {
        this.$store.dispatch('LmsEquipMaintainDetail/list', this.dataObj).then(() => {
          this.getPageList = this.$store.state.LmsEquipMaintainDetail.list;
        });
      },
      _handleSuccess(response, file, fileList) {
        if (response.success) {
          this.$Message.success('上传成功！');
          this.lmsEquipFiles.push(response.data);
          console.log(this.lmsEquipFiles);
        } else {
          this.$Message.error('上传失败！');
        }
      },
      _handleView(data) {
        this.filePath = data.filePath;
        let index1 = this.filePath.lastIndexOf(".");
        let index2 = this.filePath.length;
        let suffix = this.filePath.substring(index1 + 1, index2);//后缀名
        if (suffix == 'png' || suffix == 'jpg' || suffix == 'jpeg') {
          this.visible = true;
        } else {
          this.$Message.warning({
            content: '非图片文件无法查看，请下载查看',
            duration: 3
          });
          this.visible = false;
        }
      },
      _downloadFile(file) {//下载文件
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            var url = global.baseURL+'/slims/v1/equip_maintain/downLoadFile?id='+file.id;
            window.open(url);
            return;
          }
        });
      },
      _handleRemove(file) {//删除
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除文件？',
          onOk: () => {
            const fileList = this.lmsEquipFiles;
            this.$store.dispatch('LmsEquipMaintain/deleteFileById', file.id).then(() => {
              if (this.$store.state.LmsEquipMaintain.success) {
                this.lmsEquipFiles.splice(fileList.indexOf(file), 1);
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
    }
  }
</script>
