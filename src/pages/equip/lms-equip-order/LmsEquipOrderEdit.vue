<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1100" :styles="{top:'60px'}">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-order-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
          <Alert><h4 align="center">仪器基本信息</h4></Alert>
          <Form-item label="仪器名称" prop="name" class="width-23">
            <Input name="name" v-model="formObj.name" placeholder="请选择仪器名称" @on-click="_selEquip"
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
          <Form-item label="使用地点" prop="locationName" class="width-23">
            <Input name="locationName" v-model="formObj.locationName" placeholder="请输入使用地点" readonly/>
          </Form-item>
          <Form-item label="检定周期（月）" prop="period" class="width-23">
            <Input name="period" v-model="formObj.period" placeholder="请输入检定周期" readonly/>
          </Form-item>
          <Alert type="success"><h4 align="center">仪器预约信息</h4></Alert>
          <Form-item label="预约使用部门" prop="orderLabName" class="width-488">
            <Input name="orderLabName" @click.native="_selectOrgZtree" placeholder="请选择实验室..."
                   v-model="formObj.orderLabName"/>
          </Form-item>
          <Form-item label="预约日期" prop="orderDate" class="width-488">
            <Date-picker name="orderDate" type="date" placeholder="预约日期" v-model="formObj.orderDate"  style="width: 100%;" @on-change="_getOrderStartTime" :options="options"></Date-picker>
          </Form-item>
          <Form-item label="预约使用开始时间" prop="orderStartTime" class="width-488">
            <Date-picker name="orderStartTime" type="datetime" placeholder="有效日期" v-model="formObj.orderStartTime" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="预约使用结束时间" prop="orderEndTime" class="width-488">
            <Date-picker name="orderEndTime" type="datetime" placeholder="有效日期" v-model="formObj.orderEndTime" style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="预约原因" prop="applyReason" style="width: 98.8%;">
            <Input name="applyReason" placeholder="请输入预约原因" type="textarea" :rows="1" v-model="formObj.applyReason"/>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98.8%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <Input name="orderLabId" v-model="formObj.orderLabId" type="hidden"/>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_validateDate('DRAFT')" type="warning">草稿</Button>
        <Button @click="_validateDate('TECHNOLOGY_CHECK')" type="primary">提交申请</Button>
      </div>
    </Modal>
    <!--选择仪器信息-->
    <RelLmsEquipInfo ref="equipModal" @on-result-change="_equipData"></RelLmsEquipInfo>
    <!--公司组织树-->
    <OrgZtree ref="ztreeOrgModal" @on-result-change="_ztreeOrg"></OrgZtree>
  </div>
</template>
<script>
  import Editor from '../../../components/editor/Editor.vue'
  import RelLmsEquipInfo from './RelLmsEquipInfo.vue'
  import OrgZtree from './OrgZtree.vue'

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
    //保存
    equipId: '',
    status: '',
    orderLabId: '',
    orderLabName: '',
    orderDate:'',
    orderStartTime: '',
    orderEndTime: '',
    applyReason: '',
    remark: '',
  };
  export default {
    components: {
      RelLmsEquipInfo,
      Editor,
      OrgZtree,
    },
    data() {
      const validateOrderDate = (rule, value, callback) => {
        if (this.formObj.orderDate === '') {
          callback(new Error("预约日期不能为空"));
        } else {
          callback();
        }
      };
      const validateOrderStartTime = (rule, value, callback) => {
        if (this.formObj.orderStartTime === '') {
          callback(new Error("预约使用开始时间不能为空"));
        } else if(this.formObj.orderStartTime<this.formObj.orderDate){
          callback(new Error("预约使用开始时间不能小于预约日期"));
        }else if(this.formObj.orderStartTime<new Date()){
          callback(new Error("预约使用开始时间不能小于当前时间"));
        }else {
          callback();
        }
      };
      const validateOrderEndTime = (rule, value, callback) => {
        if (this.formObj.orderEndTime === '') {
          callback(new Error("预约使用结束时间不能为空"));
        } else if(this.formObj.orderEndTime<this.formObj.orderStartTime){
          callback(new Error("预约使用结束时间不能小于预约使用开始时间"));
        }else {
          callback();
        }
      };
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '仪器名称不能为空', trigger: 'change'}],
          applyReason: [{required: true, message: '预约原因不能为空', trigger: 'blur'}],
          orderDate: [{required: true, validator:validateOrderDate , trigger: 'change'}],
          orderStartTime: [{required: true, validator:validateOrderStartTime , trigger: 'change'}],
          orderEndTime: [{required: true, validator:validateOrderEndTime , trigger: 'change'}],
        },
        showEditModal: false,
        labList: [],
        options: {
          disabledDate (date) {
            return date && date.valueOf() < Date.now() - 86400000
          }
        }
      }
    },
    methods: {
      _getOrg(){
        this.$store.dispatch('SysOrg/getOrg').then(() => {
          let data=this.$store.state.SysOrg.list;
          this.formObj.orderLabName=data.name;
          this.formObj.orderLabId = data.id;
        });
      },
      _getOrderStartTime(date){
          setTimeout(() => {
            this.formObj.orderStartTime=this.formObj.orderDate;
          }, 100);
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipOrder.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _validateDate(status) {
        if (this.formObj.orderStartTime === '' && this.formObj.orderEndTime !== '') {
          this.$Message.warning('请输入预约使用开始时间');
        } else if (this.formObj.orderStartTime !== '' && this.formObj.orderEndTime === '') {
          this.$Message.warning('请输入预约使用结束时间');
        }
       this._ok(status);
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-order-form');
            this.$extend(data, {status: status, equipId: this.formObj.equipId});
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipOrder/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipOrder/edit', {id: this.formObj.id, obj: data}).then(() => {
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
        this.formObj.orderLabName = '';
        this.formObj.orderLabId = '';
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.modalTitle = '添加仪器预约信息表';
          this._getOrg();
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this._showTime();
          this.modalTitle = '编辑仪器预约信息表';
        }
      },
      _selEquip() {
        this.$refs.equipModal._open();
      },
      _addEquip(result){//从资产列表选择的仪器添加
        this._equipData(result);
        this.showEditModal=true;
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
        this.formObj.buyDate = result.buyDate;
        this.formObj.effectDate = result.effectDate;
      },
      _selectOrgZtree() {
        this.$refs.ztreeOrgModal._openZtree();  //打开上ztreeModel
      },
      _ztreeOrg(result) {
        console.log(result);
        this.formObj.orderLabId = result.id;
        this.formObj.orderLabName = result.name;
      },
      _showTime (){
        if(this.formObj.buyDate===undefined){
          this.formObj.buyDate='';
        }else{
          this.formObj.buyDate=new Date(this.formObj.buyDate);
        }
        if(this.formObj.effectDate===undefined){
          this.formObj.effectDate='';
        }else{
          this.formObj.effectDate=new Date(this.formObj.effectDate);
        }
        if(this.formObj.orderDate===undefined){
          this.formObj.orderDate='';
        }else{
          this.formObj.orderDate=new Date(this.formObj.orderDate);
        }
        if(this.formObj.orderStartTime===undefined){
          this.formObj.orderStartTime='';
        }else{
          this.formObj.orderStartTime=new Date(this.formObj.orderStartTime);
        }
        if(this.formObj.orderEndTime===undefined){
          this.formObj.orderEndTime='';
        }else{
          this.formObj.orderEndTime=new Date(this.formObj.orderEndTime);
        }
      },
    }
  }
</script>
