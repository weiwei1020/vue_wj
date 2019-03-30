<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="repair-detail-form-edit" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120"
              inline>
          <Alert style="text-align: center">仪器基本信息</Alert>
          <Form-item label="仪器名称" prop="name" class="width-23">
            <Input name="name" v-model="formObj.name" placeholder="请选择仪器名称" @click.native="_selEquip"
                   icon="plus-circled" readonly/>
          </Form-item>
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
          <Form-item label="使用地点" prop="locationNameName" class="width-23">
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

          <Alert type="success" style="text-align: center;">仪器维修信息</Alert>
          <Form-item label="计划维修开始时间" prop="repairStartTimePlan" class="width-488">
            <Date-picker name="repairStartTimePlan" type="datetime" placeholder="计划维修开始时间"
                         v-model="formObj.repairStartTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="计划维修结束时间" prop="repairEndTimePlan" class="width-488">
            <Date-picker name="repairEndTimePlan" type="datetime" placeholder="计划维修结束时间"
                         v-model="formObj.repairEndTimePlan" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="故障原因" prop="breakdown" style="width: 98.8%;">
            <!--<Input name="breakdown" placeholder="请输入故障原因" type="textarea" :rows="1" v-model="formObj.breakdown"/>-->
            <Select v-model="formObj.breakdown" name="breakdown">
              <Option v-for="item in typeList" :value="item.name" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="维修人员" prop="repairerIds" style="width: 98.8%;">
            <Select v-model="repairerList" filterable multiple @on-change="_inputChange" :label-in-value="true">
              <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realname }}</Option>
            </Select>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98.8%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <input name="equipId" v-model="formObj.equipId" type="hidden"/>
          <input name="repairId" v-model="formObj.repairId" type="hidden"/>
          <input name="repairerIds" v-model="formObj.repairerIds" type="hidden"/>
          <input name="repairerNames" v-model="formObj.repairerNames" type="hidden"/>
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
    locationNameName: '',
    period: '',
    buyDate: '',
    effectDate: '',

    equipId: '',
    repairId: '',
    breakdown: '',
    remark: '',
    repairStartTimePlan: '',
    repairEndTimePlan: '',
    repairerIds: '',
    repairerNames: '',
  };
  export default {
    components: {RelLmsEquipInfo},
    data() {
      const validateStartDate = (rule, value, callback) => {
        if (this.formObj.repairStartTimePlan === '') {
          callback(new Error("计划维修开始时间不能为空"));
        } else {
          callback();
        }
      };
      const validateEndDate = (rule, value, callback) => {
        if (this.formObj.repairEndTimePlan === '') {
          callback(new Error("计划维修结束时间不能为空"));
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
          breakdown: [{required: true, message: '故障原因不能为空', trigger: 'change'}],
          repairStartTimePlan: [{required: true, validator: validateStartDate, trigger: 'change'}],
          repairEndTimePlan: [{required: true, validator: validateEndDate, trigger: 'change'}],
        },
        showEditModal: false,
        userList: [],
        repairerList: [],
        breakReason: [],
        typeList: []
      }
    },
    mounted() {
      this._getUserList();
      this._getBreakReason();
    },
    methods: {
      _getBreakReason() {
        this.$store.dispatch('LmsBaseDict/getItem', '仪器故障原因').then(() => {
          this.typeList = this.$store.state.LmsBaseDict.item;
        });
      },
      _getUserList() { //用户列表
        this.$store.dispatch('LmsEquipMaintain/userList').then(() => {
          this.userList = this.$store.state.LmsEquipMaintain.userList;
        });
      },
      _resultChange(msg) {
        this.showEditModal = false;
        this.$Message.success(msg);
        this.$emit("on-result-change");
      },
      _validateDate() {
        let date = new Date();
        if (this.formObj.repairStartTimePlan <= date) {
          this.$Message.warning('维修开始时间不能早于当前系统时间');
          return false;
        } else if (this.formObj.repairStartTimePlan >= this.formObj.repairEndTimePlan) {
          this.$Message.warning('维修结束时间不能早于维修开始时间');
          return false;
        } else {
          return true;
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          let validDate = this._validateDate();
          if (valid && validDate) {
            var data = this.$serialize('repair-detail-form-edit');
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipRepair/addDetail', data).then(() => {
                if (this.$store.state.LmsEquipRepair.success) {
                  this._resultChange('添加成功');
                }
              });
            } else {
              this.$store.dispatch('LmsEquipRepairDetail/edit', {obj: data, id: this.id}).then(() => {
                if (this.$store.state.LmsEquipRepairDetail.success) {
                  this._resultChange("编辑成功");
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
      _open(repairId, formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this.repairerList = [];
        if (this.$string(formObj).isEmpty()) {
          this.formObj.repairId = repairId;
          this.id = '';
          this.modalTitle = '新增仪器维修明细';
        } else {
          this.formObj = formObj;
          this.formObj.repairId = repairId;
          this.id = formObj.id;
          this.repairerList = formObj.repairerIds.split(',');
          this.formObj.buyDate = formObj.buyDate ? new Date(formObj.buyDate) : '';
          this.formObj.effectDate = formObj.effectDate ? new Date(formObj.effectDate) : '';
          this.formObj.repairStartTimePlan = formObj.repairStartTimePlan ? new Date(formObj.repairStartTimePlan) : '';
          this.formObj.repairEndTimePlan = formObj.repairEndTimePlan ? new Date(formObj.repairEndTimePlan) : '';
          this.modalTitle = '编辑仪器维修明细';
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
      _inputChange(obj) {
        var ids = '';
        var names = '';
        obj.forEach(function (item) {
            ids = ids + item.value + ",";
            names = names + item.label + ",";
          }
        );

        this.formObj.repairerIds = ids.substring(0, ids.length - 1);
        this.formObj.repairerNames = names.substring(0, names.length - 1);
      }
    },
    _showTime() {
      if (this.formObj.buyDate === undefined) {
        this.formObj.buyDate = '';
      } else {
        this.formObj.buyDate = new Date(this.formObj.buyDate);
      }
      if (this.formObj.effectDate === undefined) {
        this.formObj.effectDate = '';
      } else {
        this.formObj.effectDate = new Date(this.formObj.effectDate);
      }
      if (this.formObj.orderDate === undefined) {
        this.formObj.orderDate = '';
      } else {
        this.formObj.orderDate = new Date(this.formObj.orderDate);
      }
      if (this.formObj.orderStartTime === undefined) {
        this.formObj.orderStartTime = '';
      } else {
        this.formObj.orderStartTime = new Date(this.formObj.orderStartTime);
      }
      if (this.formObj.orderEndTime === undefined) {
        this.formObj.orderEndTime = '';
      } else {
        this.formObj.orderEndTime = new Date(this.formObj.orderEndTime);
      }
    },
  }
</script>
