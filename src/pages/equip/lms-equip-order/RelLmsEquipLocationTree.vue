
<template>
  <!--上级类别弹出树-->
  <Modal v-model="showTreeModal">
    <p slot="header">选择使用地点</p>
    <div>
      <Form onsubmit="return false">
        <Form-item>
          <Input v-model="key" style="width: 350px;" type="text" placeholder="请输入类别名,回车查询"
                 @on-enter="_ztreeSearch" icon="ios-search-strong"></Input>
        </Form-item>
      </Form>
    </div>

    <div class="treeHeight">
      <!--加载中-->
      <div class="demo-spin-container" v-show="isloading">
        <Spin fix size="large"></Spin>
      </div>

      <ul id="locationTree" class="ztree ztreePro" v-show="isTree"></ul>
    </div>

    <div slot="footer"></div>
  </Modal>
</template>
<script>
  /**
   * 添加编辑Ztree
   */
  var setting;
  export default {
    data() {
      return {
        showTreeModal: false,
        isloading:true,
        isTree:false,
        key: '',
      }
    },
    methods: {
      _openZtree() {
        this.showTreeModal = true;
        this._getZtree();
        this.key = '';
      },
      _getZtree() {
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
          callback: {
            onDblClick: this.zTreeOnDblClick    //  双击节点
          }
        };

        this.$store.dispatch('LmsEquipLocation/getTree').then(() => {
          $.fn.zTree.init($("#locationTree"), setting, this.$store.state.LmsEquipLocation.treeList);
          setTimeout(()=>{
            this.isloading = false;
            this.isTree = true;
          },300);
        });

      },
      zTreeOnDblClick(event, treeId, treeNode) {
        var data = {
          id: treeNode.id,
          name: treeNode.name,
          pids: treeNode.pids
        }
        this.$emit("on-result-change", data);   //向父及传递数据
        this.showTreeModal = false;
      },
      _ztreeSearch(){

        if(this.key !=''){
          this.isloading = true;
          this.isTree = false;
          this.key = $.trim(this.key);
          this.$store.dispatch('LmsEquipLocation/getTreeKeyword',this.key).then(() => {
            $.fn.zTree.init($("#locationTree"), setting, this.$store.state.LmsEquipLocation.treeList);
            setTimeout(()=>{
              this.isloading = false;
              this.isTree = true;
            },300);

          });

        }else{
          this. _getZtree();
        }

      },
    }
  }
</script>

