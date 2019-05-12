<template>
    <div>
        <Modal v-model="showEditModal" :mask-closable="false">
            <p slot="header">{{modalTitle}}</p>
            <div>
                <Form id="edit-form1" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
                    <Form-item label="项目名称" prop="projectName">
                        <Input name="projectName" v-model="formObj.projectName" placeholder="请输入项目名称"></Input>
                    </Form-item>
                  <Form-item label="创建人" prop="projectPerson">
                    <Input name="projectPerson" v-model="formObj.projectPerson" readonly></Input>
                  </Form-item>
                    <Form-item label="备注" prop="projectRemark">
                        <Input name="projectRemark" v-model="formObj.projectRemark" placeholder="请输入备注"></Input>
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
     * 添加编辑项目
     */
    const defVal = {
        projectId:'',
        projectName:'',
        projectRemark: '',
        projectPerson:localStorage.getItem('personName'),
        projectPersonId:localStorage.getItem('personId')
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
                  projectName: [{required: true, message: '项目名称不能为空', trigger: 'blur'}],
                },
                showEditModal: false,
            }
        },
        methods: {
            _resultChange(msg) {
                if (this.$store.state.LmsTestProject.success) {
                    this.formObj = defVal;
                    this.showEditModal = false;
                    this.$Message.success(msg);
                    this.$emit("on-result-change")
                }
            },
            _ok() {
              debugger
                this.$refs['formObj'].validate((valid) => {
                if (valid) {
                    var data = this.$serialize('edit-form1');
                    this.$extend(data,
                      {
                        projectId:this.formObj.projectId,//年度计划id
                        projectPerson:this.formObj.projectPerson,
                        projectPersonId:this.formObj.projectPersonId,
                      });
                    if (this.$string(this.id).isEmpty()) {
                        // 添加
                        this.$store.dispatch('LmsTestProject/add', data).then(() => {
                            this._resultChange('添加成功!');
                        });
                    }
                    else {
                      // 编辑
                      this.$store.dispatch('LmsTestProject/edit', data).then(() => {
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
                    this.formObj = defVal;
                    this.formObj.lmsPlanFiles=[];
                    this.modalTitle = '添加项目计划';
                } else {
                    this.id = formObj.projectId;
                    this.formObj = formObj;
                    this.modalTitle = '编辑项目计划';
                }
            },
        }
    }
</script>
