<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline>
          <Form-item label="供应商名称" prop="supplierName" class="width-23">
            <Select v-model="formObj.supplierId" clearable placeholder="请选择供应商" style="width:100%" name="supplierId">
              <Option v-for="item in supplierList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </Form-item>
          <Form-item label="仪器类别" prop="className" class="width-23">
            <Input name="className" @click.native="_selectZtree" placeholder="请选择仪器类别..."
                   v-model="formObj.className" icon="plus-circled" readonly></Input>
          </Form-item>
          <Form-item label="品牌" prop="brand" class="width-23">
            <Input name="brand" placeholder="请输入品牌..." v-model="formObj.brand"></Input>
          </Form-item>
          <Form-item label="产品名称" prop="name" class="width-23">
            <Input name="name" placeholder="请输入产品名称..." v-model="formObj.name"></Input>
          </Form-item>
          <Form-item label="规格型号" prop="spec" class="width-23">
            <Input name="spec" placeholder="请输入规格型号..." v-model="formObj.spec"></Input>
          </Form-item>
          <Form-item label="报价" prop="price" class="width-23">
            <InputNumber name="price" :min="0" :precision="2" v-model="formObj.price" style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="生厂商" prop="productPlace" class="width-23">
            <Input name="productPlace" placeholder="请输入生厂商..." v-model="formObj.productPlace"></Input>
          </Form-item>
          <Form-item label="计量类别" prop="meterType" class="width-23">
            <Input name="meterType" placeholder="请输入计量类别..." v-model="formObj.meterType"></Input>
          </Form-item>
          <Form-item label="不确定度" prop="uncertainty" class="width-23">
            <Input name="uncertainty" placeholder="请输入不确定度..." v-model="formObj.uncertainty"></Input>
          </Form-item>
          <Form-item label="精度" prop="accuracy" class="width-23">
            <Input name="accuracy" placeholder="请输入精度..." v-model="formObj.accuracy"></Input>
          </Form-item>
          <Form-item label="使用范围" prop="range" class="width-23">
            <Input name="range" placeholder="请输入使用范围..." v-model="formObj.range"></Input>
          </Form-item>
          <Form-item label="联系电话" prop="tel" class="width-23">
            <Input name="tel" placeholder="请输入联系电话..." v-model="formObj.tel"></Input>
          </Form-item>
          <Form-item label="描述" prop="remark" style="width: 98.6%;">
            <Input name="remark" placeholder="请输入产品描述..." type="textarea" :rows="1" v-model="formObj.remark"></Input>
          </Form-item>
          <Form-item label="技术参数" style="width: 98.6%;">
            <Editor ref="editorModal" @on-result-change="_editorData" v-model="formObj.techParams"></Editor>
          </Form-item>
          <Form-item label="附件上传" style="width: 98.6%;">
            <div class="file-upload-list" v-for="item in formObj.lmsEquipFiles">
              <div>
                <!--<img :src="item.url">-->
                <div class="file-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="_handleView(item)"></Icon>
                  <Icon type="ios-cloud-download-outline" @click.native="_downloadFile(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="_handleRemove(item)"></Icon>
                </div>
              </div>
              {{item.orginName }}
            </div>
            <Upload
              :show-upload-list="false"
              :with-credentials="true"
              :on-success="_handleSuccess"
              :before-upload="_handleBeforeUpload"
              type="drag"
              :action="fileAction"
              :data="fileData"
              style="display: inline-block;width:100px;">
              <div style="width: 100px;height:100px;line-height: 100px;">
                <Icon type="ios-cloud-upload" size="20"></Icon>
              </div>
            </Upload>
          </Form-item>
          <input name="classId" v-model="formObj.classId" type="hidden">
          <input name="classIds" v-model="formObj.classIds" type="hidden">
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel('formObj')" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok('formObj')" type="primary">提交</Button>
      </div>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="'https://obs.myhwclouds.com/lims/'+filePath" v-if="visible" style="width: 100%">
    </Modal>
    <!--上级产品类别弹出树-->
    <LmsEquipClassZTree ref="ztreeModal" @on-result-change="_ztree"></LmsEquipClassZTree>
  </div>
</template>
<script>
  /**
   * 添加编辑标准查询-产品信息表
   */
  import LmsEquipClassZTree from './LmsEquipClassZTree.vue'
  import Editor from '../../../components/editor/Editor.vue'
  import global from '../../../api/config'

  const defVal = {
    id:'',
    supplierId: '',
    classId: '',
    name: '',
    spec: '',
    brand: '',
    price: 1,
    productPlace: '',
    meterType: '',
    uncertainty: '',
    accuracy: '',
    range: '',
    remark: '',
    techParams: '',
    techParamsText:'',
    feature: '',
    classIds: '',
    className: '',
    supplierName: '',
    lmsEquipFiles: [],
    tel: '',
  };
  export default {
    components: {LmsEquipClassZTree, Editor},
    data() {
      return {
        id:'',
        modalTitle: '添加仪器产品信息',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '仪器名称不能为空', trigger: 'blur'}],
          className: [{required: true, message: '仪器类别不能为空', trigger: 'change'}],
        },
        showEditModal: false,
        supplierList: '',
        filePath: '',
        visible: false,
        fileAction: global.baseURL + '/zuul/slims/v1/equip_product/uploadFile',
        fileData:{
          id:'',
        },
        treeData:''
      }
    },
    mounted() {
      this._getSupplierList();
      this.$bus.$on('tree-name',(msg)=>{
        this.treeData =msg;
        console.log(this.treeData)
      })
    },
    methods: {
      _getSupplierList() {
        var data;
        this.$store.dispatch('LmsSupplier/list', data).then(() => {
          this.supplierList = this.$store.state.LmsSupplier.list;
        });
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipProduct.success) {
          this.formObj = defVal;
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok(name) {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            this.$extend(data, {techParams: this.formObj.techParams,techParamsText:this.formObj.techParamsText});
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipProduct/add', data).then(() => {
                this._resultChange('添加成功!');
                this._reset(name);
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipProduct/edit', {id: this.formObj.id, obj: data}).then(() => {
                this._resultChange('编辑成功!');
              });
            }
          } else {
            this.$Message.error('表单验证失败!');
          }
        });
      },
      _cancel(name) {
        this.showEditModal = false;
      },
      _reset(name) {
        this.formObj = defVal;
        this.formObj.supplierId='';
        this.$refs[name].resetFields();
      },
      _open(formObj) {
        this.showEditModal = true;
        if (this.$string(formObj).isEmpty()) {
          this.id='';
          this._reset('formObj');
          this.$refs.editorModal._open('');
          this.formObj.classId = this.treeData.id;
          this.formObj.className = this.treeData.name;
          this.formObj.classIds = this.treeData.pids + this.treeData.id + ',';
          this.formObj.lmsEquipFiles=[];
          this.$store.dispatch('LmsEquipProduct/getTemp').then(() => {//查询有没有添加但没有保存的数据
            this.fileData.id = this.$store.state.LmsEquipProduct.model.id;
            if (!this.$string(this.$store.state.LmsEquipProduct.model.lmsEquipFiles).isEmpty()) {
              this.formObj.lmsEquipFiles=this.$store.state.LmsEquipProduct.model.lmsEquipFiles;
            }
          });
        } else {
          this.id=formObj.id;
          this.fileData.id=formObj.id;
          this.formObj = formObj;
          if(formObj.price==undefined){
            this.formObj.price='';
          }
          this.modalTitle = '编辑仪器产品信息';
          this.$refs.editorModal._open(formObj.techParams);
        }
      },
      _selectZtree() {
        if (this.$string(this.id).isEmpty()){
          this.$refs.ztreeModal._openZtree();  //打开上ztreeModel
        }else{
          this.$refs.ztreeModal._openZtree(this.formObj.classId);  //打开上ztreeModel
        }

      },
      _ztree(result) {
        if(result==undefined){
          this.formObj.classId ='';
          this.formObj.className = '';
          this.formObj.classIds ='';
        }else{
          this.formObj.classId = result.id;
          this.formObj.className = result.name;
          this.formObj.classIds = result.pids + result.id + ',';
        }
      },
      _editorData(html,text) { //技术参数
        this.formObj.techParams = html;
        this.formObj.techParamsText = text;
      },
      _handleBeforeUpload(file) {
      },
      _handleSuccess(response, file, fileList) {
        if (response.success) {
          this.$Message.success('上传成功！');
          this.formObj.lmsEquipFiles.push(response.data);
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
            var url = global.baseURL+'/slims/v1/equip_product/downLoadFile?id='+file.id;
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
            const fileList = this.formObj.lmsEquipFiles;
            this.$store.dispatch('LmsEquipProduct/deleteFileById', file.id).then(() => {
              if (this.$store.state.LmsEquipProduct.success) {
                this.formObj.lmsEquipFiles.splice(fileList.indexOf(file), 1);
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },

    }
  }
</script>
