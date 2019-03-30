<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="110">
          <Form-item label="计划名称" prop="name">
            <Input name="name" v-model="formObj.name" placeholder="请输入计划名称"></Input>
          </Form-item>
          <Form-item label="所属部门" prop="orgName">
            <Input name="orgName" @click.native="_selectOrgZtree" placeholder="请选择所属部门..."
                   v-model="formObj.orgName" icon="plus-circled" readonly></Input>
          </Form-item>
          <Form-item label="申请原因" prop="applyReason">
            <Input name="applyReason" v-model="formObj.applyReason" placeholder="请输入申请原因"></Input>
          </Form-item>
          <Form-item label="计划核查开始时间" prop="checkStartTimePlan">
            <Date-picker name="checkStartTimePlan" type="datetime" placeholder="计划核查开始时间" v-model="formObj.checkStartTimePlan" style="width: 100%;"/>
          </Form-item>
          <Form-item label="计划核查结束时间" prop="checkEndTimePlan">
            <Date-picker name="checkEndTimePlan" type="datetime" placeholder="计划核查开始时间" v-model="formObj.checkEndTimePlan" style="width: 100%;"/>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
          <Form-item label="附件上传">
            <div class="file-upload-list" v-for="item in formObj.lmsEquipFiles">
              <div>
                <!--<img :src="item.url">-->
                <div class="file-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="_handleView(item)"></Icon>
                  <Icon type="ios-cloud-download-outline" @click.native="_downloadFile(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="_handleRemove(item)"></Icon>
                </div>
              </div>
              {{item.orginName }}
            </div>
            <Upload
              :show-upload-list="false"
              :with-credentials="true"
              :on-success="_handleSuccess"
              :before-upload="_handleBeforeUpload"
              type="drag"
              :action="fileAction"
              :data="fileObj"
              style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-cloud-upload" size="20"></Icon>
              </div>
            </Upload>
          </Form-item>
          <input name="orgId" v-model="formObj.orgId" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok(0)" type="warning" style="margin-left: 8px">草稿</Button>
        <Button @click="_ok(1)" type="primary">提交</Button>
      </div>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="'https://obs.myhwclouds.com/lims/'+filePath" v-if="visible" style="width: 100%">
    </Modal>
    <OrgZtree ref="ztreeOrgModal" @on-result-change="_ztreeOrg"></OrgZtree>
  </div>
</template>
<script>

  import OrgZtree from '../../../components/Ztree/single-select/OrgZtree'
  import global from '../../../api/config'

  /**
   * 添加编辑
   */
  const defVal = {
    id:'',
    name: '',
    orgId: '',
    orgName: '',
    status: '',
    applyReason: '',
    remark: '',
    checkStartTimePlan:'',
    checkEndTimePlan:'',
    lmsEquipFiles:[],
  };
  export default {
    components: {
      OrgZtree
    },
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '计划名称不能为空', trigger: 'blur'}],
          orgName: [{required: true, message: '所属部门不能为空', trigger: 'change'}],
          applyReason: [{required: true, message: '申请原因不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        fileAction: global.baseURL + '/zuul/slims/v1/equip_check/uploadFile',
        fileObj:{
          id:'',
        },
        visible:false,
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipCheck.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            this.$extend(data, {status: status});
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipCheck/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipCheck/edit', {id: this.formObj.id, obj: data}).then(() => {
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
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj.lmsEquipFiles=[];
          this.formObj = defVal;
          this.modalTitle = '添加';
          this.$store.dispatch('LmsEquipCheck/getTemp').then(() => {//查询有没有添加但没有保存的数据
            this.fileObj.id=this.$store.state.LmsEquipCheck.model.id;
            if (!this.$string(this.$store.state.LmsEquipCheck.model.lmsEquipFiles).isEmpty()) {
              this.formObj.lmsEquipFiles = this.$store.state.LmsEquipCheck.model.lmsEquipFiles;
            }
          });
        } else {
          this.id = formObj.id;
          this.fileObj.id=formObj.id;
          this.formObj = formObj;
          this.modalTitle = '编辑';
          this._showTime (formObj);
        }
      },
      _showTime (formObj){
        if (this.formObj.checkStartTimePlan === undefined) {
          this.formObj.checkStartTimePlan = '';
        } else {
          this.formObj.checkStartTimePlan = new Date(formObj.checkStartTimePlan);
        }
        if (this.formObj.checkEndTimePlan === undefined) {
          this.formObj.checkEndTimePlan = '';
        } else {
          this.formObj.checkEndTimePlan = new Date(formObj.checkEndTimePlan);
        }
      },
      _selectOrgZtree() {
        if (this.$string(this.id).isEmpty()) {
          this.$refs.ztreeOrgModal._openZtree();  //打开上ztreeModel
        }else{
          this.$refs.ztreeOrgModal._openZtree(this.formObj.orgId);  //打开上ztreeModel
        }
      },
      _ztreeOrg(result) {
        this.formObj.orgId = result.id;
        this.formObj.orgName = result.name;
      },
      _handleBeforeUpload(file) {
      },
      _handleSuccess(response, file, fileList) {
        if (response.success) {
          this.$Message.success('上传成功！');
          this.formObj.lmsEquipFiles.push(response.data);
        } else {
          this.$Message.error('上传失败！');
        }
      },
      _handleView(data) {
        this.filePath = data.filePath;
        let index1=this.filePath.lastIndexOf(".");
        let index2=this.filePath.length;
        let suffix=this.filePath.substring(index1+1,index2);//后缀名
        if(suffix=='png'||suffix=='jpg'||suffix=='jpeg'){
          this.visible = true;
        }else{
          this.$Message.warning({
            content:'非图片文件无法查看，请下载查看',
            duration:3
          });
          this.visible = false;
        }
      },
      _downloadFile(file) {//下载文件
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            var url = global.baseURL + '/slims/v1/equip_check/downLoadFile?id=' + file.id;
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
            const fileList = this.formObj.lmsEquipFiles;
            this.$store.dispatch('LmsEquipCheck/deleteFileById', file.id).then(() => {
              if (this.$store.state.LmsEquipCheck.success) {
                this.formObj.lmsEquipFiles.splice(fileList.indexOf(file), 1);
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
    }
  }
</script>
