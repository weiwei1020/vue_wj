<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="maintain-detail-form-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Alert style="text-align: center">仪器基本信息</Alert>
          <Form-item label="仪器名称" prop="name" class="width-23">
            <Input name="name" v-model="formObj.name" placeholder="请选择仪器名称" @click.native="_selEquip"
                   icon="plus-circled" readonly/></Form-item>
          <Form-item label="供应商" prop="supplierName" class="width-23">
            <Input name="supplierName" v-model="formObj.supplierName" placeholder="请输入供应商" readonly/>
          </Form-item>
          <Form-item label="仪器类型" prop="className" class="width-23">
            <Input name="className" v-model="formObj.className" placeholder="请输入仪器类型" readonly/>
          </Form-item>
          <Form-item label="规格型号" prop="spec" class="width-23">
            <Input name="spec" v-model="formObj.spec" placeholder="请输入规格型号" readonly/>
          </Form-item>
          <Form-item label="仪器品牌" prop="brand" class="width-23">
            <Input name="brand" v-model="formObj.brand" placeholder="请输入品牌" readonly/>
          </Form-item>
          <Form-item label="仪器单价" prop="price" class="width-23">
            <Input name="price" v-model="formObj.price" placeholder="请输入报价" readonly/>
          </Form-item>
          <Form-item label="制造厂商" prop="productPlace" class="width-23">
            <Input name="productPlace" v-model="formObj.productPlace" placeholder="请输入产地" readonly/>
          </Form-item>
          <Form-item label="计量类别" prop="meterType" class="width-23">
            <Input name="meterType" v-model="formObj.meterType" placeholder="请输入计量类别" readonly/>
          </Form-item>
          <Form-item label="不确定度" prop="uncertainty" class="width-23">
            <Input name="uncertainty" v-model="formObj.uncertainty" placeholder="请输入不确定度" readonly/>
          </Form-item>
          <Form-item label="仪器精度" prop="accuracy" class="width-23">
            <Input name="accuracy" v-model="formObj.accuracy" placeholder="请输入精度" readonly/>
          </Form-item>
          <Form-item label="使用范围" prop="range" class="width-23">
            <Input name="range" v-model="formObj.range" placeholder="请输入使用范围" readonly/>
          </Form-item>
          <Form-item label="仪器编号" prop="equipNum" class="width-23">
            <Input name="equipNum" v-model="formObj.equipNum" placeholder="请输入仪器编号" readonly/>
          </Form-item>
          <Form-item label="证书编号" prop="ceNum" class="width-23">
            <Input name="ceNum" v-model="formObj.ceNum" placeholder="请输入证书编号" readonly/>
          </Form-item>
          <Form-item label="实验室编号" prop="labNum" class="width-23">
            <Input name="labNum" v-model="formObj.labNum" placeholder="请输入实验室编号" readonly/>
          </Form-item>
          <Form-item label="使用科别" prop="departmentName" class="width-23">
            <Input name="departmentName" v-model="formObj.departmentName" placeholder="请输入使用科别" readonly/>
          </Form-item>
          <Form-item label="使用地点" prop="locationName" class="width-23">
            <Input name="locationName" v-model="formObj.locationName" placeholder="请输入使用地点" readonly/>
          </Form-item>
          <Form-item label="检定周期（月）" prop="period" class="width-23">
            <Input name="period" v-model="formObj.period" placeholder="请输入检定周期" readonly/>
          </Form-item>
          <Form-item label="购买日期" prop="buyDate" class="width-23">
            <Date-picker name="buyDate" type="date" placeholder="有效日期" format="yyyy-MM-dd" v-model="formObj.buyDate"
                         style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="有效日期" prop="effectDate" class="width-23">
            <Date-picker name="effectDate" type="date" placeholder="有效日期" format="yyyy-MM-dd"
                         v-model="formObj.effectDate" style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Alert type="success" style="text-align: center;">仪器维保信息</Alert>
          <Form-item label="维保项目名称" prop="projectName" class="width-48">
            <Input name="projectName" v-model="formObj.projectName" placeholder="请输入维保项目名称"/>
          </Form-item>
          <Form-item label="维保内容" prop="maintainContent" class="width-48">
            <Input name="maintainContent" v-model="formObj.maintainContent" placeholder="请输入维保内容"/>
          </Form-item>
          <Form-item label="计划保养开始时间" prop="maintainStartTimePlan" class="width-48">
            <Date-picker name="maintainStartTimePlan" type="datetime" placeholder="保养开始时间"
                         v-model="formObj.maintainStartTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="计划保养结束时间" prop="maintainEndTimePlan" class="width-48">
            <Date-picker name="maintainEndTimePlan" type="datetime" placeholder="保养结束时间"
                         v-model="formObj.maintainEndTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="维保保养人" prop="maintainerIds" style="width: 98%;">
            <Select v-model="maintainerList" filterable multiple @on-change="_maintainChange" :label-in-value="true">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realname }}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <input name="equipId" v-model="formObj.equipId" type="hidden">
          <input name="maintainId" v-model="formObj.maintainId" type="hidden">
          <input name="maintainerIds" v-model="formObj.maintainerIds" type="hidden">
          <input name="maintainerNames" v-model="formObj.maintainerNames" type="hidden">
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
    <!--选择仪器信息-->
    <RelLmsEquipInfo ref="equipModal" @on-result-change="_equipData"></RelLmsEquipInfo>
  </div>
</template>
<script>
  import RelLmsEquipInfo from './RelLmsEquipInfo.vue'

  const defVal = {
    //展示
    name: '',
    supplierName: '',
    className: '',
    spec: '',
    brand: '',
    price: '',
    productPlace: '',
    meterType: '',
    uncertainty: '',
    accuracy: '',
    range: '',
    equipNum: '',
    ceNum: '',
    labNum: '',
    departmentName: '',
    locationName: '',
    period: '',
    buyDate: '',
    effectDate: '',

    equipId: '',
    maintainId: '',
    projectName: '',
    maintainContent: '',
    remark: '',
    maintainStartTimePlan: '',
    maintainEndTimePlan: '',
    maintainerIds: '',
    maintainerNames: '',
  };
  export default {
    components: {RelLmsEquipInfo},
    data() {
      const validateStartDate = (rule, value, callback) => {
        if (this.formObj.maintainStartTimePlan === '') {
          callback(new Error("计划保养开始时间不能为空"));
        } else {
          callback();
        }
      };
      const validateEndDate = (rule, value, callback) => {
        if (this.formObj.maintainEndTimePlan === '') {
          callback(new Error("计划保养结束时间不能为空"));
        } else {
          callback();
        }
      };
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '仪器名称不能为空', trigger: 'change'}],
          projectName: [{required: true, message: '维保项目名称', trigger: 'blur'}],
          maintainContent: [{required: true, message: '维保内容', trigger: 'blur'}],
          maintainStartTimePlan: [{required: true, validator: validateStartDate, trigger: 'change'}],
          maintainEndTimePlan: [{required: true, validator: validateEndDate, trigger: 'change'}],
          maintainerIds: [{required: true, message: '维保保养人不能为空', trigger: 'change'}],
        },
        showEditModal: false,
        userList: [],
        maintainerList: [],
      }
    },
    mounted() {
      this._getUserList();
    },
    methods: {
      _getUserList() { //用户列表
        this.$store.dispatch('LmsEquipMaintain/userList').then(() => {
          this.userList = this.$store.state.LmsEquipMaintain.userList;
        });
      },
      _resultChange(msg) {
        this.$Message.success(msg);
        this.showEditModal = false;
        this.$emit("on-result-change");
      },
      _validateDate() {
        let date = new Date();
        if (this.formObj.maintainStartTimePlan <= date) {
          this.$Message.warning('保养开始时间不能早于当前系统时间');
          return false;
        } else if (this.formObj.maintainStartTimePlan >= this.formObj.maintainEndTimePlan) {
          this.$Message.warning('保养结束时间不能早于保养开始时间');
          return false;
        } else {
          return true;
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          valid = this._validateDate();
          if (valid) {
            var data = this.$serialize('maintain-detail-form-edit');
            // 添加
            if (this.$string(this.id).isEmpty()) {
              this.$store.dispatch('LmsEquipMaintain/addDetail', data).then(() => {
                if (this.$store.state.LmsEquipMaintain.success) {
                  this._resultChange('添加成功');
                }
              });
            } else {
              this.$store.dispatch('LmsEquipMaintainDetail/edit', {obj: data, id: this.id}).then(() => {
                if (this.$store.state.LmsEquipMaintainDetail.success) {
                  this._resultChange('编辑成功');
                }
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
      _open(maintainId, formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.maintainerList = [];
        if (this.$string(formObj).isEmpty()) {
          this.formObj.maintainId = maintainId;
          this.id='';
          this.modalTitle = '新增仪器维保明细';
        } else {
          this.formObj = formObj;
          this.formObj.maintainId = maintainId;
          this.id = formObj.id;
          this.maintainerList=formObj.maintainerIds.split(',');
          this.formObj.buyDate = formObj.buyDate ? new Date(formObj.buyDate) : '';
          this.formObj.effectDate = formObj.effectDate ? new Date(formObj.effectDate) : '';
          this.formObj.maintainStartTimePlan = formObj.maintainStartTimePlan ? new Date(formObj.maintainStartTimePlan) : '';
          this.formObj.maintainEndTimePlan = formObj.maintainEndTimePlan ? new Date(formObj.maintainEndTimePlan) : '';
          this.modalTitle = '编辑仪器维保明细';
        }
      },
      _selEquip() {
        this.$refs.equipModal._open();
      },
      _equipData(result) {
        this.formObj.equipId = result.id;
        this.formObj.name = result.name;
        this.formObj.supplierName = result.supplierName;
        this.formObj.className = result.className;
        this.formObj.spec = result.spec;
        this.formObj.brand = result.brand;
        this.formObj.price = result.price;
        this.formObj.productPlace = result.productPlace;
        this.formObj.meterType = result.meterType;
        this.formObj.uncertainty = result.uncertainty;
        this.formObj.accuracy = result.accuracy;
        this.formObj.range = result.range;
        this.formObj.equipNum = result.equipNum;
        this.formObj.ceNum = result.ceNum;
        this.formObj.labNum = result.labNum;
        this.formObj.departmentName = result.departmentName;
        this.formObj.locationName = result.locationName;
        this.formObj.period = result.period;
        this.formObj.buyDate = result.buyDate ? new Date(result.buyDate) : '';
        this.formObj.effectDate = result.effectDate ? new Date(result.effectDate) : '';
      },
      _maintainChange(obj) {
        var ids = '';
        var names = '';
        obj.forEach(function (item) {
            ids = ids + item.value + ",";
            names = names + item.label + ",";
          }
        );

        this.formObj.maintainerIds = ids.substring(0, ids.length - 1);
        this.formObj.maintainerNames = names.substring(0, names.length - 1);
      }
    }
  }
</script>
