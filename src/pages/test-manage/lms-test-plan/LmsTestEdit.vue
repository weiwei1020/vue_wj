<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false">
            <p slot="header">{{modalTitle}}</p>
            <div>
                <Form id="edit-form" ref="formObj"  :model="formObj" :rules="ruleValidate" :label-width="80">
                    <Form-item label="实验名称" prop="testName" style="width:100%;">
                        <Input name="testName" v-model="formObj.testName" placeholder="请输入实验名称"></Input>
                      <input name="testProjectId" v-model="formObj.testProjectId" type="hidden"></input>
                      <input name="testProjectName" v-model="formObj.testProjectName" type="hidden"></input>
                    </Form-item>
                    <Form-item label="计划开始日期" prop="testBrginDate" >
                      <Date-picker name="testBrginDate" type="datetime"
                                   placeholder="开始日期" format="yyyy-MM-dd HH:mm:ss"
                                  v-model="formObj.testBrginDate" style="width:100%;">
                      </Date-picker>
                    </Form-item>
                    <Form-item label="计划结束日期" prop="testEndDate" >
                      <Date-picker name="testEndDate" type="datetime"  format="yyyy-MM-dd HH:mm:ss"
                                   placeholder="结束日期" v-model="formObj.testEndDate" style="width:100%;"></Date-picker>
                    </Form-item>
                    <Form-item label="备注" prop="testRemark">
                        <Input name="testRemark" v-model="formObj.testRemark" placeholder="请输入备注"></Input>
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
     * 添加编辑实验
     */
    const defVal = {
        testProjectId:'',
        testProjectName:'',
        testId:'',
        testName: '',
        testBrginDate:'',
        testEndDate:'',
        testRemark: '',
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
                  testName: [{required: true, message: '实验名称不能为空', trigger: 'blur'}],
                },
                showEditModal: false,
            }
        },
        methods: {
            _resultChange(msg) {
                if (this.$store.state.LmsTestProject.success) {
                    this.formObj = defVal;
                  this.$refs['formObj'].resetFields();
                  this.showEditModal = false;
                    this.$Message.success(msg);
                    this.$emit("on-result-change")
                }
            },
            _ok() {
              this.$refs['formObj'].validate((valid) => {
                if (valid) {
                  var data = this.$serialize('edit-form');
                  this.$extend(data,
                      {
                        testProjectId:this.formObj.testProjectId,//年度计划id
                        testProjectName:this.formObj.testProjectName,//年度计划
                        testId:this.formObj.testId,//实验id
                      });
                    if (this.$string(this.id).isEmpty()) {
                        // 添加
                        this.$store.dispatch('LmsTestProject/addTest', data).then(() => {
                            this._resultChange('添加成功!');
                            this.showEditModal=false;
                        });
                    } else {
                        // 编辑
                        this.$store.dispatch('LmsTestProject/editTest', data).then(() => {
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
              this.$refs['formObj'].resetFields();
              this.showEditModal = false;
            },
            _open(formObj) {
              if(formObj.testProjectId==''||formObj.testProjectId==undefined){
                this.$Message.warning('请先在左侧计点击选择一个计划名称！');
                this.showEditModal = false;
              }else{
                this.showEditModal = true;
                if (this.$string(formObj.testId).isEmpty()) {
                  this.id = '';
                  this.formObj = defVal;
                  this.formObj.testProjectId=formObj.testProjectId;
                  this.formObj.testProjectName=formObj.testProjectName;
                  this.modalTitle = '添加实验安排-'+formObj.testProjectName;
                } else {
                  this.id = formObj.testId;
                  this.formObj = formObj;
                  if(formObj.testBrginDate=undefined){
                    this.formObj.testBrginDate='';
                  }
                  if(formObj.testEndDate=undefined){
                    this.formObj.testEndDate='';
                  }
                  this.modalTitle = '编辑实验安排';
                }
              }
            },
        }
    }
</script>
