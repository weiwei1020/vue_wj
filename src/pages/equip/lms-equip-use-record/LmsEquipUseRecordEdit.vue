<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="110" inline>
          <Alert><h4 align="center">仪器基本信息</h4></Alert>
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

          <Alert type="success"><h4 align="center">仪器使用信息</h4></Alert>
            <Form-item label="使用实验室" prop="labName" class="width-23">
              <Input name="labName" @click.native="_selectOrgZtree" placeholder="请选择实验室..."
                     v-model="formObj.labName"/>
              <input name="labId" v-model="formObj.labId"  type="hidden"/>
            </Form-item>
            <Form-item label="使用日期" prop="useDate" class="width-23">
              <Date-picker name="useDate" type="date" placeholder="有效日期" format="yyyy-MM-dd" v-model="formObj.useDate"
                           style="width: 100%;" @on-change="_getUseStartTime"></Date-picker>
            </Form-item>
            <Form-item label="使用开始时间" prop="useStartTime" class="width-23">
              <Date-picker name="useStartTime" type="datetime" placeholder="有效日期" v-model="formObj.useStartTime"
                           style="width: 100%;"></Date-picker>
            </Form-item>
            <Form-item label="使用结束时间" prop="useEndTime" class="width-23">
              <Date-picker name="useEndTime" type="datetime" placeholder="有效日期" v-model="formObj.useEndTime"
                           style="width: 100%;"></Date-picker>
            </Form-item>
            <Form-item label="开始性能" prop="performanceStart" class="width-23">
              <Input name="performanceStart" v-model="formObj.performanceStart" placeholder="请输入开始性能"/>
            </Form-item>
            <Form-item label="结束性能" prop="performanceEnd" class="width-23">
              <Input name="performanceEnd" v-model="formObj.performanceEnd" placeholder="请输入结束性能"/>
            </Form-item>
            <Form-item label="使用人" prop="userId" class="width-23">
              <Select name="userId" v-model="formObj.userId" filterable clearable @on-change="_changeUser($event)">
                <Option v-for="item in userList" :value="item.id" :key="item.id">{{ item.realname }}</Option>
              </Select>
            </Form-item>
            <Form-item label="检品编号/批号" prop="checkNum" class="width-23">
              <Input name="checkNum" v-model="formObj.checkNum" placeholder="请输入检品编号/批号"/>
            </Form-item>
            <Form-item label="检测项目" prop="checkItem" class="width-23">
              <Input name="checkItem" v-model="formObj.checkItem" placeholder="请输入检测项目"/>
            </Form-item>
            <Form-item label="其他要求" prop="other" class="width-23">
              <Input name="other" v-model="formObj.other" placeholder="请输入其他"/>
            </Form-item>
            <Form-item label="备注" prop="remark" style="width: 98.6%;">
              <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
            </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_validateDate(0)" type="warning">草稿</Button>
        <Button @click="_validateDate(1)" type="primary">提交</Button>
      </div>
    </Modal>
    <!--选择仪器信息-->
    <RelLmsEquipInfo ref="equipModal" @on-result-change="_equipData"></RelLmsEquipInfo>
    <!--公司组织树-->
    <OrgZtree ref="ztreeOrgModal" @on-result-change="_ztreeOrg"></OrgZtree>
  </div>
</template>
<script>
  import RelLmsEquipInfo from './RelLmsEquipInfo.vue'
  import OrgZtree from './OrgZtree.vue'

  var dateFormat = require('dateformat');
  /**
   * 添加编辑仪器使用记录信息表
   */
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
    status: '',
    labId: '',
    labName: '',
    useDate: '',
    useStartTime: '',
    useEndTime: '',
    performanceStart: '',
    performanceEnd: '',
    userId: '',
    userName: '',
    checkNum: '',
    checkItem: '',
    other: '',
    remark: '',
  };
  export default {
    components: {
      RelLmsEquipInfo,
      OrgZtree
    },
    data() {
      const validateUseDate = (rule, value, callback) => {
        if (this.formObj.useDate === '') {
          callback(new Error("使用日期不能为空"));
        } else {
          callback();
        }
      };
      const validateUseStartTime = (rule, value, callback) => {
        if (this.formObj.useStartTime === '') {
          callback(new Error("使用开始时间不能为空"));
        } else {
          callback();
        }
      };
      const validateUseEndTime = (rule, value, callback) => {
        if (this.formObj.useEndTime === '') {
          callback(new Error("使用结束时间不能为空"));
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
          useDate: [{required: true, validator: validateUseDate, trigger: 'change'}],
          useStartTime: [{required: true, validator: validateUseStartTime, trigger: 'change'}],
          useEndTime: [{required: true, validator: validateUseEndTime, trigger: 'change'}],
          userId: [{required: true, message: '使用人不能为空', trigger: 'change'}],
        },
        showEditModal: false,
        userList: [],
        labList: [],
      }
    },
    mounted() {
      this._getUserList();
    },
    methods: {
      _getUserList() { //用户列表
        this.$store.dispatch('LmsEquipUseRecord/userList').then(() => {
          this.userList = this.$store.state.LmsEquipUseRecord.userList;
        });
      },
      _getUseStartTime(date) {
        setTimeout(() => {
          this.formObj.useStartTime = this.formObj.useDate;
        }, 100);
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipUseRecord.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _validateDate(status) {
        let date = dateFormat(this.formObj.useDate, "yyyy-mm-dd");
        let start = dateFormat(this.formObj.useStartTime, "yyyy-mm-dd");
        if (this.formObj.useStartTime == '' && this.formObj.useEndTime != '') {
          this.$Message.warning('请输入使用开始时间');
        } else if (this.formObj.useStartTime != '' && this.formObj.useEndTime == '') {
          this.$Message.warning('请输入使用结束时间');
        } else if (this.formObj.useStartTime != '' && this.formObj.useEndTime != '') {
          if (date != start) {
            this.$Message.warning('请选择当天开始时间');
          } else if (this.formObj.useStartTime >= this.formObj.useEndTime) {
            this.$Message.warning('使用结束时间不能小于等于使用开始时间');
          } else {
            this._ok(status);
          }
        } else {
          this._ok(status);
        }
      },
      _ok(status) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            this.$extend(data, {
              status: status,
              equipId: this.formObj.equipId,
              userName: this.formObj.userName,
            });
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipUseRecord/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipUseRecord/edit', {id: this.formObj.id, obj: data}).then(() => {
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
          this.modalTitle = '添加仪器使用记录信息表';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          this._showTime();
          this.modalTitle = '编辑仪器使用记录信息表';
        }
      },
      _selEquip() {
        this.$refs.equipModal._open();
      },
      _equipData(result) {
        console.log(result);
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
      _changeUser(id) {
        this.formObj.userName = this.userList.find(item => item.id === id)['realname'];
      },
      _selectOrgZtree() {
        this.$refs.ztreeOrgModal._openZtree();  //打开上ztreeModel
      },
      _ztreeOrg(result) {
        console.log(result);
        this.formObj.labId = result.id;
        this.formObj.labName = result.name;
      },
      _showTime (){
        if(this.formObj.useDate===undefined){
          this.formObj.useDate='';
        }else{
          this.formObj.useDate=new Date(this.formObj.useDate);
        }

        if(this.formObj.useStartTime===undefined){
          this.formObj.useStartTime='';
        }else{
          this.formObj.useStartTime=new Date(this.formObj.useStartTime);
        }

        if(this.formObj.useEndTime===undefined){
          this.formObj.useEndTime='';
        }else{
          this.formObj.useEndTime=new Date(this.formObj.useEndTime);
        }
      },
    }
  }
</script>
