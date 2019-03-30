<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" :width="1200">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="120" inline>
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
            <Input name="price" v-model.number="formObj.price" placeholder="请输入报价" readonly/>
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
            <InputNumber name="period" style="width: 100%" v-model.number="formObj.period" placeholder="请输入检定周期"
                         readonly></InputNumber>
          </Form-item>
          <Form-item label="购买日期" prop="buyDate" class="width-23">
            <Date-picker name="buyDate" type="date" placeholder="有效日期" format="yyyy-MM-dd" v-model="formObj.buyDate"
                         style="width: 100%;" readonly></Date-picker>
          </Form-item>
          <Form-item label="有效日期" prop="effectDate" class="width-23">
            <Date-picker name="effectDate" type="date" placeholder="有效日期" format="yyyy-MM-dd"
                         v-model="formObj.effectDate" style="width: 100%;" readonly></Date-picker>
          </Form-item>

          <Alert type="success"><h4 align="center">仪器检定信息</h4></Alert>
          <Form-item label="检定日期" prop="verifyDate" class="width-23">
            <Date-picker name="verifyDate" type="date" placeholder="检定日期" format="yyyy-MM-dd"
                         v-model="formObj.verifyDate" @on-change="verifyDateChange" style="width: 100%;"></Date-picker>
            <!--<input type="hidden" name="verifyDate">-->
          </Form-item>
          <Form-item label="下次检定日期" prop="nextVerifyDate" class="width-23">
            <Date-picker name="nextVerifyDate" type="date" placeholder="有效日期" format="yyyy-MM-dd"
                         v-model="formObj.nextVerifyDate" style="width: 100%;" readonly></Date-picker>
            <!--<input type="hidden" name="nextVerifyDate">-->
          </Form-item>
          <Form-item label="提前提醒（天）" prop="warningDays" class="width-23">
            <InputNumber name="warningDays" v-model.number="formObj.warningDays" :min="1"
                         style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="检定结果" prop="verifyResult" class="width-23">
            <Input name="verifyResult" v-model="formObj.verifyResult" placeholder="请输入检定结果"/>
          </Form-item>
          <Form-item label="检定单位" prop="verifyDepartmentName" class="width-23">
            <autoComplete name="verifyDepartmentName" :value="formObj.verifyDepartmentName" placeholder="请输入或选择检定单位"
                          :downData="verifyDepartmentData" @on-result-change="_verifyDepartmentChange"
            ></autoComplete>
          </Form-item>
          <Form-item label="证书编号" prop="certificateNum" class="width-23">
            <Input name="certificateNum" v-model="formObj.certificateNum" placeholder="请输入证书编号"/>
          </Form-item>
          <Form-item label="检定范围" prop="verifyRange" style="width: 49%">
            <Input name="verifyRange" v-model="formObj.verifyRange" placeholder="请输入检定范围"/>
          </Form-item>
          <Form-item label="备注" prop="remark" style="width: 98.6%;">
            <Input name="remark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.remark"/>
          </Form-item>
          <Form-item label="附件上传" style="width: 98.6%;">
            <div class="file-upload-list" v-for="item in formObj.lmsEquipFiles">
              <div>
                <div class="file-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="_handleView(item)"></Icon>
                  <Icon type="ios-cloud-download-outline" @click.native="_downloadFile(item)"></Icon>
                  <Icon type="ios-trash-outline" @click.native="_handleRemove(item)"></Icon>
                </div>
              </div>
              {{item.orginName }}
            </div>
            <Upload :show-upload-list="false"
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
        </Form>
      </div>
      <div slot="footer">
        <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
        <Button @click="_ok" type="primary">保存</Button>
      </div>
    </Modal>
    <Modal title="查看图片" v-model="visible">
      <img :src="'https://obs.myhwclouds.com/lims/'+filePath" v-if="visible" style="width: 100%">
    </Modal>
    <!--选择仪器信息-->
    <RelLmsEquipInfo ref="equipModal" @on-result-change="_equipData"></RelLmsEquipInfo>
  </div>
</template>
<script>
  import RelLmsEquipInfo from './RelLmsEquipInfo.vue'
  import global from '../../../api/config'
  import autoComplete from '../../../components/base/autoComplete'

  /**
   * 添加编辑仪器检定信息表
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
    verifyDate: '',
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
    warningDays: 1,
    nextVerifyDate: '',
    verifyResult: '',
    verifyDepartmentId: '',
    verifyDepartmentName: '',
    verifyRange: '',
    remark: '',
    certificateNum: '',
    lmsEquipFiles: []
  };
  export default {
    components: {
      RelLmsEquipInfo,
      autoComplete
    },
    data() {
      const validateDate = (rule, value, callback) => {
        if (this.formObj.nextVerifyDate === '') {
          callback(new Error("下次检定日期不能为空"));
        } else {
          callback();
        }
      };
      return {
        verifyDepartmentData: [],
        verifyDepartmentDataTemp: [],
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          name: [{required: true, message: '仪器名称不能为空', trigger: 'blur'}],
          warningDays: [{required: true, type: 'number', message: '提醒天数不能为空', trigger: 'blur'}],
          verifyDate: [{required: true, type: 'date', message: '检定日期不能为空', trigger: 'blur'}],
        },
        showEditModal: false,
        fileAction: global.baseURL + '/zuul/slims/v1/equip_verify/uploadFile',
        visible: false,
        filePath: '',
        fileData: {
          id: '',
        },
      }
    },
    methods: {
      _verifyDepartmentChange(msg, data) {
        switch (msg) {
          case 'select':
            this.formObj.verifyDepartmentName = data;
        }
        this._verifyDepartmentChangeQuery(data);
      },
      _verifyDepartmentChangeQuery(query) {
        this.formObj.verifyDepartmentName = query;
        if (query === '') {
          this.verifyDepartmentData = this.verifyDepartmentDataTemp;
        } else {
          this.verifyDepartmentData = this.verifyDepartmentDataTemp.filter(item => item.indexOf(query) > -1);
        }
      },
      _getCustomer(query) {
        let uri = '';
        let data = '';
        if (query === '') {
          uri = 'LmsEquipVerify/list';
          data = '';
        } else {
          uri = 'LmsEquipVerify/queryList';
          data = query;
        }
        this.$store.dispatch(uri, data).then(() => {
          let result = this.$store.state.LmsEquipVerify.list;
          let list = [];
          for (var i = 0; i < result.length; i++) {
            list.push(result[i].verifyDepartmentName);
          }
          this.verifyDepartmentData = list;
          this.verifyDepartmentDataTemp = list
        });
      },
      verifyDateChange(date) {
        let months = this.formObj.period;
        let endDate = new Date(date.replace(new RegExp(/-/gm), "/"));//兼容苹果
        endDate.setMonth(endDate.getMonth() + months);
        this.formObj.nextVerifyDate = this.$dateformat(endDate, 'yyyy-mm-dd');
      },
      _handleView(data) {
        this.filePath = data.filePath;
        let index1 = this.filePath.lastIndexOf(".");
        let index2 = this.filePath.length;
        let suffix = this.filePath.substring(index1 + 1, index2);//后缀名
        if (suffix == 'png' || suffix == 'jpg' || suffix == 'jpeg') {
          this.visible = true;
        } else {
          this.$Message.warning({
            content: '非图片文件无法查看，请下载查看',
            duration: 3
          });
          this.visible = false;
        }
      },
      _downloadFile(file) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            var url = global.baseURL+'/slims/v1/equip_verify/downLoadFile?id='+file.id;
            window.open(url);
            return;
          }
        });
      },
      _handleRemove(file) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除文件？',
          onOk: () => {
            const fileList = this.formObj.lmsEquipFiles;
            this.$store.dispatch('LmsEquipVerify/deleteFileById', file.id).then(() => {
              if (this.$store.state.LmsEquipVerify.success) {
                this.formObj.lmsEquipFiles.splice(fileList.indexOf(file), 1);
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
      _handleSuccess(response, file, fileList) {
        if (response.success) {
          this.$Message.success('上传成功！');
          this.formObj.lmsEquipFiles.push(response.data);
        } else {
          this.$Message.error('上传失败！');
        }
      },
      _handleBeforeUpload() {
      },
      _resultChange(msg) {
        if (this.$store.state.LmsEquipVerify.success) {
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
            this.$extend(data, {status: 0, equipId: this.formObj.equipId});
            if (this.$string(this.id).isEmpty()) {
              // 添加
              this.$store.dispatch('LmsEquipVerify/add', data).then(() => {
                this._resultChange('添加成功!');
              });
            } else {
              // 编辑
              this.$store.dispatch('LmsEquipVerify/edit', {id: this.formObj.id, obj: data}).then(() => {
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
      _showTime(formObj) {
        if (this.formObj.nextVerifyDate === undefined) {
          this.formObj.nextVerifyDate = '';
        } else {
          this.formObj.nextVerifyDate = new Date(formObj.nextVerifyDate);
        }
        if (this.formObj.verifyDate === undefined) {
          this.formObj.verifyDate = '';
        } else {
          this.formObj.verifyDate = new Date(formObj.verifyDate);
        }
      },
      _open(formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        this._getCustomer('')
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.$store.dispatch('LmsEquipVerify/getTemp').then(() => {//查询有没有添加但没有保存的数据
            this.fileData.id = this.$store.state.LmsEquipVerify.model.id;
            if (!this.$string(this.$store.state.LmsEquipVerify.model.lmsEquipFiles).isEmpty()) {
              this.formObj.lmsEquipFiles = this.$store.state.LmsEquipVerify.model.lmsEquipFiles;
            }
          });
          this.modalTitle = '添加仪器检定信息表';
        } else {
          this.id = formObj.id;
          this.formObj = formObj;
          if (formObj.warningDays == undefined) {
            this.formObj.warningDays = '';
          }
          this.modalTitle = '编辑仪器检定信息表';
          this._showTime(formObj)
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
        // this.formObj.buyDate = result.buyDate;
        // this.formObj.effectDate = result.effectDate;
        this.formObj.buyDate = result.buyDate ? new Date(result.buyDate) : '';
        this.formObj.effectDate = result.effectDate ? new Date(result.effectDate) : '';
      },
    }
  }
</script>
