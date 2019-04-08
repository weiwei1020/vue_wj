<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="80">
          <Form-item label="精度范围" prop="accuracyRange">
            <Input name="accuracyRange" v-model="formObj.accuracyRange" placeholder="请输入精度范围"></Input>
          </Form-item>
          <Form-item label="证书编号" prop="certificateNum">
            <Input name="certificateNum" v-model="formObj.certificateNum" placeholder="请输入证书编号"></Input>
          </Form-item>
          <Form-item label="试验耗材 ID" prop="chemicalId">
            <Input name="chemicalId" v-model="formObj.chemicalId" placeholder="请输入试验耗材 ID"></Input>
          </Form-item>
          <Form-item label="企业 ID" prop="companyId">
            <Input name="companyId" v-model="formObj.companyId" placeholder="请输入企业 ID"></Input>
          </Form-item>
          <Form-item label="创建时间" prop="ctime">
            <Input name="ctime" v-model="formObj.ctime" placeholder="请输入创建时间"></Input>
          </Form-item>
          <Form-item label="定值单位" prop="definite">
            <Input name="definite" v-model="formObj.definite" placeholder="请输入定值单位"></Input>
          </Form-item>
          <Form-item label="定值日期" prop="definiteDate">
            <Input name="definiteDate" v-model="formObj.definiteDate" placeholder="请输入定值日期"></Input>
          </Form-item>
          <Form-item label="0、正常 1、删除" prop="deleted">
            <Input name="deleted" v-model="formObj.deleted" placeholder="请输入0、正常 1、删除"></Input>
          </Form-item>
          <Form-item label="鉴定单位" prop="detection">
            <Input name="detection" v-model="formObj.detection" placeholder="请输入鉴定单位"></Input>
          </Form-item>
          <Form-item label="出厂编号" prop="factoryNum">
            <Input name="factoryNum" v-model="formObj.factoryNum" placeholder="请输入出厂编号"></Input>
          </Form-item>
          <Form-item label="最后修改人 ID" prop="lid">
            <Input name="lid" v-model="formObj.lid" placeholder="请输入最后修改人 ID"></Input>
          </Form-item>
          <Form-item label="最后修改时间" prop="ltime">
            <Input name="ltime" v-model="formObj.ltime" placeholder="请输入最后修改时间"></Input>
          </Form-item>
          <Form-item label="设备管理员" prop="manage">
            <Input name="manage" v-model="formObj.manage" placeholder="请输入设备管理员"></Input>
          </Form-item>
          <Form-item label="计量类别" prop="metering">
            <Input name="metering" v-model="formObj.metering" placeholder="请输入计量类别"></Input>
          </Form-item>
          <Form-item label="备品备件规格型号" prop="model">
            <Input name="model" v-model="formObj.model" placeholder="请输入备品备件规格型号"></Input>
          </Form-item>
          <Form-item label="单价" prop="price">
            <Input name="price" v-model="formObj.price" placeholder="请输入单价"></Input>
          </Form-item>
          <Form-item label="备注" prop="remark">
            <Input name="remark" v-model="formObj.remark" placeholder="请输入备注"></Input>
          </Form-item>
          <Form-item label="标准值" prop="standardValue">
            <Input name="standardValue" v-model="formObj.standardValue" placeholder="请输入标准值"></Input>
          </Form-item>
          <Form-item label="库存" prop="stock">
            <Input name="stock" v-model="formObj.stock" placeholder="请输入库存"></Input>
          </Form-item>
          <Form-item label="技术参数" prop="technology">
            <Input name="technology" v-model="formObj.technology" placeholder="请输入技术参数"></Input>
          </Form-item>
          <Form-item label="密度" prop="thickness">
            <Input name="thickness" v-model="formObj.thickness" placeholder="请输入密度"></Input>
          </Form-item>
          <Form-item label="使用范围" prop="useRange">
            <Input name="useRange" v-model="formObj.useRange" placeholder="请输入使用范围"></Input>
          </Form-item>
          <Form-item label="使用地点" prop="useSite">
            <Input name="useSite" v-model="formObj.useSite" placeholder="请输入使用地点"></Input>
          </Form-item>
          <Form-item label="已使用量" prop="used">
            <Input name="used" v-model="formObj.used" placeholder="请输入已使用量"></Input>
          </Form-item>
          <Form-item label="有效期" prop="validDate">
            <Input name="validDate" v-model="formObj.validDate" placeholder="请输入有效期"></Input>
          </Form-item>
          <Form-item label="校验日期" prop="verifyDate">
            <Input name="verifyDate" v-model="formObj.verifyDate" placeholder="请输入校验日期"></Input>
          </Form-item>
          <Form-item label="校验部门" prop="verifyOrg">
            <Input name="verifyOrg" v-model="formObj.verifyOrg" placeholder="请输入校验部门"></Input>
          </Form-item>
          <Form-item label="检定周期(/月)" prop="verifyPeriod">
            <Input name="verifyPeriod" v-model="formObj.verifyPeriod" placeholder="请输入检定周期(/月)"></Input>
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
   * 添加编辑试验耗材库存表
   */
  const defVal = {
    accuracyRange: '',
    certificateNum: '',
    chemicalId: '',
    companyId: '',
    ctime: '',
    definite: '',
    definiteDate: '',
    deleted: '',
    detection: '',
    factoryNum: '',
    lid: '',
    ltime: '',
    manage: '',
    metering: '',
    model: '',
    price: '',
    remark: '',
    standardValue: '',
    stock: '',
    technology: '',
    thickness: '',
    useRange: '',
    useSite: '',
    used: '',
    validDate: '',
    verifyDate: '',
    verifyOrg: '',
    verifyPeriod: '',
  };
  export default {
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          accuracyRange: [{required: true, message: '精度范围不能为空', trigger: 'blur'}],
          certificateNum: [{required: true, message: '证书编号不能为空', trigger: 'blur'}],
          chemicalId: [{required: true, message: '试验耗材 ID不能为空', trigger: 'blur'}],
          companyId: [{required: true, message: '企业 ID不能为空', trigger: 'blur'}],
          ctime: [{required: true, message: '创建时间不能为空', trigger: 'blur'}],
          definite: [{required: true, message: '定值单位不能为空', trigger: 'blur'}],
          definiteDate: [{required: true, message: '定值日期不能为空', trigger: 'blur'}],
          deleted: [{required: true, message: '0、正常 1、删除不能为空', trigger: 'blur'}],
          detection: [{required: true, message: '鉴定单位不能为空', trigger: 'blur'}],
          factoryNum: [{required: true, message: '出厂编号不能为空', trigger: 'blur'}],
          lid: [{required: true, message: '最后修改人 ID不能为空', trigger: 'blur'}],
          ltime: [{required: true, message: '最后修改时间不能为空', trigger: 'blur'}],
          manage: [{required: true, message: '设备管理员不能为空', trigger: 'blur'}],
          metering: [{required: true, message: '计量类别不能为空', trigger: 'blur'}],
          model: [{required: true, message: '备品备件规格型号不能为空', trigger: 'blur'}],
          price: [{required: true, message: '单价不能为空', trigger: 'blur'}],
          remark: [{required: true, message: '备注不能为空', trigger: 'blur'}],
          standardValue: [{required: true, message: '标准值不能为空', trigger: 'blur'}],
          stock: [{required: true, message: '库存不能为空', trigger: 'blur'}],
          technology: [{required: true, message: '技术参数不能为空', trigger: 'blur'}],
          thickness: [{required: true, message: '密度不能为空', trigger: 'blur'}],
          useRange: [{required: true, message: '使用范围不能为空', trigger: 'blur'}],
          useSite: [{required: true, message: '使用地点不能为空', trigger: 'blur'}],
          used: [{required: true, message: '已使用量不能为空', trigger: 'blur'}],
          validDate: [{required: true, message: '有效期不能为空', trigger: 'blur'}],
          verifyDate: [{required: true, message: '校验日期不能为空', trigger: 'blur'}],
          verifyOrg: [{required: true, message: '校验部门不能为空', trigger: 'blur'}],
          verifyPeriod: [{required: true, message: '检定周期(/月)不能为空', trigger: 'blur'}],
        },
        showEditModal: false
      }
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsChemicalStock.success) {
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
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsChemicalStock/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsChemicalStock/edit', {id: this.formObj.id, obj: data}).then(() => {
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
          this.modalTitle = '添加试验耗材库存表';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this.modalTitle = '编辑试验耗材库存表';
        }
      }
    }
  }
</script>
