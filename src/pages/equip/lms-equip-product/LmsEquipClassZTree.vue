
<template>
  <!--上级类别弹出树-->
  <Modal v-model="showTreeModal">
    <p slot="header">选择类别</p>
    <div>
      <Form  onsubmit="return false">
        <Form-item>
          <Input v-model="key" style="width: 350px;" type="text" placeholder="请输入类别名,回车查询"
                 @on-enter="_ztreeSearch" @on-click="_ztreeSearch" icon="ios-search-strong" ></Input>
        </Form-item>
      </Form>
    </div>

    <div class="treeHeight">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>

      <ul id="tree" class="ztree" v-show="isTree"></ul>
    </div>

    <div slot="footer">
      <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
      <Button @click="_ok" type="primary">确定</Button>
    </div>
  </Modal>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  var setting;
  var treeObj;
  export default {
    data() {
      return {
        showTreeModal: false,
        isloading:true,
        isTree:false,
        key: '',
        selNotes:[],
      }
    },
    methods: {
      _openZtree(classId) {
        this.showTreeModal = true;
        this.key='';
        this._getZtree(classId);
        this.selNotes = [];
      },
      _getZtree(classId) {
        this.isloading = true;
        this.isTree = false;
        setting = {
          data: {
            simpleData: {
              enable: true,
              idKey: "id",
              pIdKey: "pid",
            }
          },
          check:{
            enable:true,
            chkStyle:"radio",
            radioType:'all',

          },
          callback: {
            onClick: this.zTreeOnClick    //  单击节点
          }
        };

        this.$store.dispatch('LmsEquipClass/list').then(() => {
          treeObj=$.fn.zTree.init($("#tree"), setting, this.$store.state.LmsEquipClass.list);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
            if(classId){
              let node = treeObj.getNodeByParam('id',classId,null);//根据id获取该节点；（第三个参数父节点，在指定父节点查找）
              treeObj.checkNode(node, true, false);//选中节点 第三个参数为是否勾选父节点
              treeObj.expandAll(true);//展开节点
            }
          },300);

        });

      },
      zTreeOnClick(event, treeId, treeNode) {
        treeObj.checkNode(treeNode,!treeNode.checked,true);
      },
      _ztreeSearch(){
        if(this.key !=''){
          this.isloading = true;
          this.isTree = false;
          this.$store.dispatch('LmsEquipClass/getTreeKeyword',this.key).then(() => {
            treeObj=$.fn.zTree.init($("#tree"), setting, this.$store.state.LmsEquipClass.list);

            setTimeout(()=>{
              this.isloading = false;
              this.isTree = true;
            },300);

          });

        }else{
          this. _getZtree();
        }

      },
      _cancel(){
        this.showTreeModal = false;
      },
      _ok(){
        this.selNotes = treeObj.getCheckedNodes(true);
        this.$emit("on-result-change", this.selNotes[0]);   //向父及传递数据
        this.showTreeModal = false;
      },
    }
  }
</script>

