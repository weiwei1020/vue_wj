<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false">
            <p slot="header">{{modalTitle}}</p>
            <div>
                <Form id="edit-form1" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
                    <Form-item label="项目名称" prop="projectName">
                        <Input name="projectName" v-model="formObj.projectName" placeholder="请输入项目名称"></Input>
                    </Form-item>
                    <Form-item label="创建时间" prop="ctime" v-show="ctimeModel">
                      <Date-picker name="ctime" type="date" placeholder="创建时间" format="yyyy-MM-dd" v-model="formObj.ctime" style="width: 100%;" readonly></Date-picker>
                    </Form-item>
                  <Form-item label="负责人" prop="responsibilityName">
                    <Input name="responsibilityName" v-model="formObj.responsibilityName" placeholder="请输入负责人"></Input>
                  </Form-item>
                    <Form-item label="备注" prop="projectRemark">
                        <Input name="projectRemark" v-model="formObj.projectRemark" placeholder="请输入备注"></Input>
                    </Form-item>
                  <Form-item label="隐私项目" prop="privateProject" >
                    <RadioGroup  @on-change="_selectStatus" v-model="formObj.privateProject">
                      <Radio label="1">是</Radio>
                      <Radio label="0">否</Radio>
                    </RadioGroup>
                  </Form-item>
                </Form>
            </div>
            <div slot="footer">
                <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
                <Button @click="_ok" type="primary">提交</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
 import global from '../../../../api/config'


 /**
     * 添加编辑人员管理-人员等级分类
     */
    const defVal = {
        id:'',
        projectName:'',
        ctime:new Date(),
        projectRemark: '',
        lmsPlanFiles: [],
        privateProject:'0',
        responsibilityName:'',
  };
  var dateFormat = require('dateformat');
    export default {
        components: {
        },
        data() {
            return {
                id: '',
                modalTitle: '',
                ctimeModel:false,
                formObj: defVal,
                ruleValidate: {
                  projectName: [{required: true, message: '项目名称不能为空', trigger: 'blur'}],
                },
                showEditModal: false,
              fileAction: global.baseURL + '/slims/v1/staff_plan_attachment/',
              fileData:{
                id:'',
              },
              filePath: '',
              privateProject:'0',
            }
        },
        methods: {
          _selectStatus(data) {
            this.privateProject = data;
          },
            _resultChange(msg) {
                if (this.$store.state.LmsStaffLevel.success) {
                    this.formObj = defVal;
                    this.showEditModal = false;
                    this.$Message.success(msg);
                    this.$emit("on-result-change")
                }
            },
            _ok() {
                this.$refs['formObj'].validate((valid) => {
                if (valid) {
                    var data = this.$serialize('edit-form1');
                    this.$extend(data,
                      {
                        projectId:this.formObj.projectId,//年度计划id
                        privateProject:this.privateProject,
                      });
                    if (this.$string(this.id).isEmpty()) {
                        // 添加
                        this.$store.dispatch('LmsStaffLevel/add', data).then(() => {
                            this._resultChange('添加成功!');
                        });
                        this.ctimeModel=false;
                    }
                    else {
                      // 编辑
                      this.$store.dispatch('LmsStaffLevel/edit', {id: this.formObj.id, obj: data}).then(() => {
                        this._resultChange('编辑成功!');
                        this.ctimeModel=false;
                      });
                    }
                } else {
                    this.$Message.error('表单验证失败!');
                }
                });
            },
            _cancel() {
                this.showEditModal = false;
              this.ctimeModel=false;
            },
            _open(formObj) {
                this.showEditModal = true;
                this.$refs['formObj'].resetFields();
                if (this.$string(formObj).isEmpty()) {
                    this.id = '';
                    this.formObj = defVal;
                    this.formObj.lmsPlanFiles=[];
                    this.modalTitle = '添加项目计划';
                } else {
                 this.ctimeModel=true;
                    this.id = formObj.id;
                    this.formObj = formObj;
                    this.formObj.privateProject=formObj.privateProject;
                  if(formObj.ctime!=undefined){
                    this.formObj.ctime = dateFormat(formObj.ctime,"yyyy-mm-dd");
                  }else{
                    this.formObj.ctime='';
                  }
                    this.modalTitle = '编辑项目计划';
                }
            },
          _handleBeforeUpload(file) {
          },
          _handleSuccess(response, file, fileList) {
            if (response.success) {
              this.$Message.success('上传成功！');
              this.formObj.lmsPlanFiles.push(response.data);
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
                var url = global.baseURL+'/slims/v1/staff_plan_attachment/download?id='+file.id;
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
                const fileList = this.formObj.lmsPlanFiles;
                this.$store.dispatch('LmsStaffLevel/deleteFile', file.id).then(() => {
                  if (this.$store.state.LmsStaffLevel.success) {
                    this.formObj.lmsPlanFiles.splice(fileList.indexOf(file), 1);
                    this.$Message.success('删除成功！');
                  }
                });
              }
            });
          },
        }
    }
</script>
