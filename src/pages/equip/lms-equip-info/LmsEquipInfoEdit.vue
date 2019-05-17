<template>
  <div>
    <Modal v-model="showEditModal" :mask-closable="false" width="700">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <Form id="edit-form" ref="formObj" :model="formObj" :rules="ruleValidate" :label-width="90" inline>
          <Form-item label="仪器编号" prop="apparatusNum" class="width-48">
            <Input name="apparatusNum" v-model="formObj.apparatusNum" placeholder="可自动生成"/>
          </Form-item>
          <Form-item label="仪器名称" prop="apparatusName" class="width-48">
            <Input name="apparatusName" v-model="formObj.apparatusName" placeholder="请输入仪器名称"/>
          </Form-item>
          <Form-item label="仪器类别" prop="apparatusSortName" class="width-48">
            <Input v-model="formObj.apparatusSortName" placeholder="请选择仪器类别" @click.native="_selectEquipClass"
                   icon="plus-circled" readonly/>
            <input name="apparatusSortId" v-model="apparatusSortId" type="hidden"/>
          </Form-item>
          <Form-item label="仪器品牌" prop="apparatusBrand" class="width-48">
            <Input name="apparatusBrand" v-model="formObj.apparatusBrand" placeholder="请输入品牌"/>
          </Form-item>
          <Form-item label="仪器价格" prop="apparatusPrice" class="width-48">
            <InputNumber min="1" name="apparatusPrice"  v-model="formObj.apparatusPrice" style="width:100%"></InputNumber>
          </Form-item>
          <Form-item label="购买日期" prop="apparatusBuyTime" class="width-48">
            <Date-picker name="apparatusBuyTime" type="date" placeholder="购买日期" format="yyyy-MM-dd" v-model="formObj.apparatusBuyTime"
                         style="width: 100%;"></Date-picker>
          </Form-item>
          <Form-item label="备注" prop="apparatusRemark" style="width:96%;">
            <Input name="apparatusRemark" placeholder="请输入产品备注" type="textarea" :rows="1" v-model="formObj.apparatusRemark"/>
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
  </div>
</template>
<script>
  import Editor from '../../../components/editor/Editor.vue'
  import LmsEquipClassZTree from './LmsEquipClassZTree.vue'
  /**
   * 添加编辑仪器资产信息表
   */
  const defVal = {
    apparatusId: '',
    apparatusNum: '',
    apparatusName: '',
    apparatusSortName: '',
    apparatusSortId: '',
    apparatusBrand: '',
    apparatusPrice: 1,
    apparatusBuyTime: new Date(),
    apparatusRemark: '',
  };
  export default {
    components: {
      Editor,
      LmsEquipClassZTree,
    },
    data() {
      return {
        id: '',
        modalTitle: '',
        formObj: defVal,
        ruleValidate: {
          apparatusSortName: [{required: true, message: '仪器类别不能为空', trigger: 'change'}],
        },
        showEditModal: false,
        treeName: '',
      }
    },
    mounted() {
      this.$bus.$on('info-tree-name', (msg) => {
        this.treeName = msg;
      });
    },
    methods: {
      _resultChange(msg) {
        if (this.$store.state.LmsEquipInfo.success) {
          this.formObj = defVal;
          this._reset();
          this.showEditModal = false;
          this.$Message.success(msg);
          this.$emit("on-result-change")
        }
      },
      _ok() {
        this.$refs['formObj'].validate((valid) => {
          if (valid) {
            var data = this.$serialize('edit-form');
            if(data.apparatusName==undefined){
              this.$Message.warning('仪器名称不能为空！');
            }else{
              this.$extend(data, {
                apparatusPrice: this.formObj.apparatusPrice,
                apparatusSortId:this.formObj.apparatusSortId,
                apparatusId:this.formObj.apparatusId,
                apparatusSortName:this.formObj.apparatusSortName,
            });
              if (this.$string(this.id).isEmpty()) {
                // 添加
                this.$store.dispatch('LmsEquipInfo/add', data).then(() => {
                  this._resultChange('添加成功!');
                });
              } else {
                // 编辑
                this.$store.dispatch('LmsEquipInfo/edit', data).then(() => {
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
        this.formObj.apparatusPrice=1;
        this.formObj.apparatusBuyTime=new Date();
      },
      _cancel() {
        this.showEditModal = false;
        this._reset();
      },
      _open(treeObj,formObj) {
        this.showEditModal = true;
        this.$refs['formObj'].resetFields();
        if (this.$string(formObj).isEmpty()) {
          this.id = '';
          this.formObj = defVal;
          this.modalTitle = '添加仪器资产信息表';
          if (JSON.stringify(treeObj) !== '{}') {
            this.formObj.apparatusSortName = treeObj.apparatusSortName;
            this.formObj.apparatusSortId = treeObj.apparatusSortId;
          } else {
            this.formObj.apparatusSortName = '';
            this.formObj.apparatusSortId = '';
          }
        } else {
          this.id = formObj.apparatusId;
          this.formObj = formObj;
          this._showTime();
          this.modalTitle = '编辑仪器资产信息表';
        }
      },
      _selEquip() {
        this.$refs.equipModal._open();
      },
      _selectEquipClass() {
        if (this.$string(this.id).isEmpty()) {
          this.$refs.equipClassModal._openZtree();
        } else {
          this.$refs.equipClassModal._openZtree(this.formObj.apparatusSortId);
        }
      },
      _equipClassData(data) {
        this.formObj.apparatusSortId = data.apparatusSortId;
        this.formObj.apparatusSortName = data.apparatusSortName;
      },
      _selectOrgZtree() {
        this.$refs.ztreeOrgModal._openZtree();  //打开上ztreeModel
      },
      _showTime() {
        if (this.formObj.apparatusBuyTime === undefined) {
          this.formObj.apparatusBuyTime = '';
        } else {
          this.formObj.apparatusBuyTime = new Date(this.formObj.apparatusBuyTime);
        }
      },
    }
  }
</script>
<style scoped>
  .width-48{
    width: 48%;
  }
</style>
