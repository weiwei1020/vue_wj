<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false">
            <p slot="header">{{modalTitle}}</p>
            <div>
                <Form id="edit-form" ref="formObj"  :model="formObj" :rules="ruleValidate" :label-width="80">
                    <Form-item label="实验名称" prop="testName" style="width:100%;">
                        <Input name="testName" v-model="formObj.testName" placeholder="请输入实验名称"></Input>
                    </Form-item>
                    <Form-item label="计划开始日期" prop="beginDate" >
                      <Date-picker name="beginDate" type="datetime"
                                   placeholder="开始日期" format="yyyy-MM-dd HH"
                                  v-model="formObj.beginDate" style="width:100%;">
                      </Date-picker>
                    </Form-item>
                    <Form-item label="计划结束日期" prop="endDate" >
                      <Date-picker name="endDate" type="datetime"  format="yyyy-MM-dd HH"
                                   placeholder="结束日期" v-model="formObj.endDate" style="width:100%;"></Date-picker>
                    </Form-item>
                    <Form-item label="备注" prop="remark">
                        <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
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
  /**
     * 添加编辑人员管理-人员等级分类
     */
    const defVal = {
        id:'',
        projectId:'',
        testName: '',
        beginDate:'',
        endDate:'',
        remark: '',
    };
  var dateFormat = require('dateformat');
    export default {
        components: {
        },
        data() {
            return {
                id: '',
                modalTitle: '',
                formObj: defVal,
                ruleValidate: {
                },
                showEditModal: false,
            }
        },
        methods: {
            _resultChange(msg) {
                if (this.$store.state.LmsStaffStatus.success) {
                    this.formObj = defVal;
                    this.showEditModal = false;
                    this.$Message.success(msg);
                    this.$emit("on-result-change")
                }
            },
            _ok() {
              this.$refs['formObj'].validate((valid) => {
                if (valid) {
                  var data = this.$serialize('edit-form');
                  data.beginDate=dateFormat(this.formObj.beginDate,'yyyy-mm-dd HH')+':00:00';
                  data.endDate=dateFormat(this.formObj.endDate,'yyyy-mm-dd HH')+':00:00';
                  this.$extend(data,
                      {
                        projectId:this.formObj.projectId,//年度计划id
                      });
                    if (this.$string(this.id).isEmpty()) {
                        // 添加
                        this.$store.dispatch('LmsStaffStatus/add', data).then(() => {
                            this._resultChange('添加成功!');
                            this.showEditModal=false;
                        });
                    } else {
                        // 编辑
                        this.$store.dispatch('LmsStaffStatus/Testedit', {id: this.formObj.id, obj: data}).then(() => {
                        this._resultChange('编辑成功!');
                          this.showEditModal=false;
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
              if(formObj.projectId==''||formObj.projectId==undefined){
                this.$Message.warning('请先在左侧计点击选择一个计划名称！');
                this.showEditModal = false;
              }else{
                this.showEditModal = true;
                this.$refs['formObj'].resetFields();
                if (this.$string(formObj.id).isEmpty()) {
                  this.id = '';
                  this.formObj = defVal;
                  this.formObj.projectId=formObj.projectId;
                  this.modalTitle = '添加实验安排-'+formObj.projectName;
                } else {
                  this.id = formObj.id;
                  this.formObj = formObj;
                  if(formObj.beginDate!=undefined){
                    this.formObj.beginDate = dateFormat(formObj.beginDate,"yyyy-mm-dd HH");
                  }else{
                    this.formObj.beginDate='';
                  }
                  if(formObj.endDate!=undefined){
                    this.formObj.endDate = dateFormat(formObj.endDate,"yyyy-mm-dd HH");
                  }else{
                    this.formObj.endDate='';
                  }
                  this.modalTitle = '编辑实验安排';
                }
              }
            },
        }
    }
</script>
