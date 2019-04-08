<template xmlns="http://www.w3.org/1999/html">
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline>
          <Form-item label="仪器编号" prop="equipNum" class="width-23">
            <Input name="equipNum" v-model="formObj.equipNum" placeholder="可自动生成"/>
          </Form-item>
          <Form-item label="仪器名称" prop="name" class="width-23">
            <autoComplete name="name"  placeholder="请输入仪器名称" :value="formObj.name"
                          :downData="nameList"  @on-result-change="_nameChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="仪器类别" prop="className" class="width-23">
            <Input v-model="formObj.className" placeholder="请选择仪器类别" @click.native="_selectEquipClass"
                   icon="plus-circled" readonly/>
            <input name="classId" v-model="classId" type="hidden"/>

          </Form-item>
          <Form-item label="仪器品牌" prop="brand" class="width-23">
            <autoComplete name="brand"  placeholder="请输入仪器品牌"  :value="formObj.brand" v-model="formObj.brand"
                          :downData="brandList" @on-result-change="_brandChange"
            ></autoComplete>
            <!--<Input name="brand" v-model="formObj.brand" placeholder="请输入品牌"/>-->
          </Form-item>
          <Form-item label="供应商名称" prop="supplierId" class="width-23">
            <autoComplete name="supplierId"  placeholder="请输入供应商名称" :value="formObj.supplierId"
                          :downData="supplierList"  @on-result-change="_supplierChange"
            ></autoComplete>
          </Form-item>

          <Form-item label="联系方式" prop="suppliertel" class="width-23">
            <autoComplete name="suppliertel"  placeholder="请输入供应商联系方式" :value="formObj.suppliertel"
                          :downData="telList"  @on-result-change="_telChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="邮箱" prop="supplieremil" class="width-23">
            <autoComplete name="supplieremil"  placeholder="请输入供应商email" :value="formObj.supplieremil"
                          :downData="emailList"  @on-result-change="_emailChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="仪器价格" prop="price" class="width-23">
            <InputNumber name="price"  v-model="formObj.price" style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="购买日期" prop="buyDate" class="width-23">
            <Date-picker name="buyDate" type="date" placeholder="购买日期" format="yyyy-MM-dd" v-model="formObj.buyDate"
                         style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width:60%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_reset" type="ghost" style="margin-left: 8px">重置</Button>
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">确定</Button>
      </div>
    </Modal>
    <!--选择仪器类别-->
    <LmsEquipClassZTree ref="equipClassModal" @on-result-change="_equipClassData"></LmsEquipClassZTree>
    <!--公司组织树-->
    <OrgZtree ref="ztreeOrgModal" @on-result-change="_ztreeOrg"></OrgZtree>
    <!--位置树-->
    <LocationZtree ref="ztreeLocationModal" @on-result-change="_ztreeLocation"></LocationZtree>
  </div>
</template>
<script>
  import  autoComplete from '../../../components/base/autoComplete.vue'
  import Editor from '../../../components/editor/Editor.vue'
  import RelLmsEquipProduct from './RelLmsEquipProduct.vue'
  import LmsEquipClassZTree from './LmsEquipClassZTree.vue'
  import Global from '../../../api/config'
  import OrgZtree from './OrgZtree.vue'
  import LocationZtree from './LocationZtree.vue'

  /**
   * 添加编辑仪器资产信息表
   */
  const defVal = {
    id: '',
    equipNum: '',
    name: '',
    className: '',
    supplierName: '',
    classId: '',
    classIds: '',
    brand: '',
    status: 0,
    price: 0,
    buyDate: new Date(),
    remark: '',
    lmsEquipFiles: [],
    supplierId:'',
  };
  export default {
    components: {
      autoComplete,
      RelLmsEquipProduct,
      Editor,
      LmsEquipClassZTree,
      OrgZtree,
      LocationZtree
    },
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          className: [{required: true, message: '仪器类别不能为空', trigger: 'change'}],
        /*  status: [{required: true, message: '仪器状态不能为空', trigger: 'change', type: 'number'}],*/
        },
        showEditModal: false,
        userList: [],
        statusList: [
          {value: 0, name: '闲置'},
          {value: 1, name: '在用'},
        ],
        labList: [],
        departmentList: [],
        locationList: [],
        equipPanel: '1',
        treeName: '',
        nameListTemp:[],
        nameList: [],
        supplierListTemp:[],
        supplierList:[],
        brandListTemp:[],
        brandList:[],
        telList:[],
        telListTemp:[],
        emailList:[],
        emailListTemp:[],
      }
    },
    mounted() {
      this._getUserList();
      this._getSupplierList();
      this.$bus.$on('info-tree-name', (msg) => {
        this.treeName = msg;
      });
    },
    methods: {
      //从字典中查询类别
      _dicSearch() {
        this.$store.dispatch('LmsBaseDict/getItem', '仪器名称').then(() => {
          let nameList = this.$store.state.LmsBaseDict.item;
          this.nameList = nameList;
          this.nameListTemp = nameList;
        });
        this.$store.dispatch('LmsBaseDict/getItem', '供应商名称').then(() => {
          let supplierList = this.$store.state.LmsBaseDict.item;
          this.supplierList = supplierList;
          this.supplierListTemp = supplierList;
        });
        this.$store.dispatch('LmsBaseDict/getItem', '仪器品牌').then(() => {
          let brandList = this.$store.state.LmsBaseDict.item;
          this.brandList = brandList;
          this.brandListTemp = brandList;
        });
        //供应商联系方式
        this.$store.dispatch('LmsBaseDict/getItem', '供应商电话').then(() => {
          let telList = this.$store.state.LmsBaseDict.item;
          this.telList = telList;
          this.telListTemp = telList;
        });
        // email
        this.$store.dispatch('LmsBaseDict/getItem', '供应商邮箱').then(() => {
          let emailList = this.$store.state.LmsBaseDict.item;
          this.emailList = emailList;
          this.emailListTemp = emailList;
        });
      },
      //仪器名称
      _nameChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.name = data;
            break;
          default:
            this._nameQuery(data);
        }
      },
      _nameQuery(query) {
        this.formObj.name = query;
        if (query === '') {
          this.nameList = this.nameListTemp;
        } else {
          this.nameList = this.nameListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //供应商名称
      _supplierChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.supplierId = data;
            break;
          default:
            this._supplierQuery(data);
        }
      },
      _supplierQuery(query) {
        this.formObj.supplierId = query;
        if (query === '') {
          this.supplierList = this.supplierListTemp;
        } else {
          this.supplierList = this.supplierListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //供应商联系方式
      _telChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.tel = data;
            break;
          default:
            this._telQuery(data);
        }
      },
      _telQuery(query) {
        this.formObj.tel = query;
        if (query === '') {
          this.telList = this.telListTemp;
        } else {
          this.telList = this.telListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //供应商email
      _emailChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.email = data;
            break;
          default:
            this._emailQuery(data);
        }
      },
      _emailQuery(query) {
        this.formObj.email = query;
        if (query === '') {
          this.emailList = this.emailListTemp;
        } else {
          this.emailList = this.emailListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      //仪器品牌
      _brandChange(msg, data) {
        switch (msg) {
          case'select':
            this.formObj.brand = data;
            break;
          default:
            this._brandQuery(data);
        }
      },
      _brandQuery(query) {
        this.formObj.brand = query;
        if (query === '') {
          this.brandList = this.brandListTemp;
        } else {
          this.brandList = this.brandListTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      _editorData(html, text) { //技术参数
        this.formObj.techParams = html;
        this.formObj.techParamsText = text;
      },

      _getSupplierList() { //供应商
        this.$store.dispatch('LmsSupplier/list').then(() => {
          this.supplierList = this.$store.state.LmsSupplier.list;
        });
      },
      _getUserList() {
        var data = {};
        this.$store.dispatch('LmsEquipInfo/userList', data).then(() => {
          this.userList = this.$store.state.LmsEquipInfo.userList;
        });
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipInfo.success) {
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
            if(data.name==undefined){
              this.$Message.warning('仪器名称不能为空！');
            }else{
              this.$extend(data, {
                status: this.formObj.status,
                price: this.formObj.price,
                classId:this.classId,
              });
              if (this.$string(this.id).isEmpty()) {
                // 添加
                this.$store.dispatch('LmsEquipInfo/add', data).then(() => {
                  this._resultChange('添加成功!');
                });
              } else {
                // 编辑
                this.$store.dispatch('LmsEquipInfo/edit', {id: this.formObj.id, obj: data}).then(() => {
                  this._resultChange('编辑成功!');
                });
              }
            }

          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _reset(){
        this.formObj=[];
        this.formObj.status=0;
        this.formObj.price=0;
        this.formObj.buyDate=new Date();
      },
      _cancel() {
        this.showEditModal = false;
      },
      _open(treeObj,formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          let userInfo = Global.getUserInfo();
          this.modalTitle = '添加仪器资产信息表';
          this.fileShow=false;
          this.formObj.supplierId = '';
          this.formObj.lmsEquipFiles = [];
          if (JSON.stringify(treeObj) !== '{}') {
            this.formObj.className = treeObj.name;
            this.className = treeObj.name;
            this.classId = treeObj.id;
          } else {
            this.formObj.className = '';
            this.classId = '';
          }
          /*this.$store.dispatch('LmsEquipInfo/getTemp').then(() => {//查询有没有添加但没有保存的数据
            this.fileObj.id = this.$store.state.LmsEquipInfo.model.id;
            if (!this.$string(this.$store.state.LmsEquipInfo.model.lmsEquipFiles).isEmpty()) {
              this.formObj.lmsEquipFiles = this.$store.state.LmsEquipInfo.model.lmsEquipFiles;
            }
          });*/
        } else {
          this.id = formObj.id;
          this.fileObj.id = formObj.id;
          this.formObj = formObj;
          this._showTime();
          this.modalTitle = '编辑仪器资产信息表';
          this.fileShow=true;

        }
       // this.$refs.editorModal._open(); //打开editor
        this._dicSearch();
      },
      _selEquip() {
        this.$refs.equipModal._open();
      },
      _locationData(data) {
        this.formObj.locationId = data.id;
        this.formObj.locationName = data.name;
      },
      _selectEquipClass() {
        if (this.$string(this.id).isEmpty()) {
          this.$refs.equipClassModal._openZtree();
        } else {
          this.$refs.equipClassModal._openZtree(this.formObj.classId);
        }
      },
      _equipClassData(data) {
        this.classId = data.id;
        this.formObj.className = data.name;
      },
      _selectOrgZtree() {
        this.$refs.ztreeOrgModal._openZtree();  //打开上ztreeModel
      },
      _ztreeOrg(result) {
        console.log(result);
        this.formObj.departmentId = result.id;
        this.formObj.departmentName = result.name;
      },
      _ztreeLocation(result) {
        this.formObj.locationId = result.id;
        this.formObj.locationName = result.name;
      },
      _showTime() {
        if (this.formObj.effectDate === undefined) {
          this.formObj.effectDate = '';
        } else {
          this.formObj.effectDate = new Date(this.formObj.effectDate);
        }
        if (this.formObj.buyDate === undefined) {
          this.formObj.buyDate = '';
        } else {
          this.formObj.buyDate = new Date(this.formObj.buyDate);
        }
      },
    }
  }
</script>
<style scoped>
  .width-23{
    width: 30%;
  }
</style>
