<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-left" :style="treeStyleObj" v-show="isTree">
          <Card dis-hover class="card_tree">
            <p slot="title">角色列表</p>
            <div>
              <RoleTree ref="roleTree" @on-result-change="_roleData"></RoleTree>
            </div>
          </Card>
        </div>
        <div style="position: absolute;left: 196px;top: 50%;cursor:pointer" @click="_treeHide" v-if="isTree">
          <div class="navbarImgShow"></div>
        </div>
        <div style="position: absolute;left:0;top: 50%;cursor:pointer" @click="_treeShow" v-else="isTree">
          <div class="navbarImgHide"></div>
        </div>
        <div class="position-right" :style="tableStyleObj">
          <Row>
            <Col span="24">
            <div class="catgory_border_left">
              <p>仪器类别列表</p>
            </div>
            <div>
              <PurTree ref="purTree"></PurTree>
            </div>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import RoleTree from './RoleZtree.vue'
  import PurTree from './PurZtree.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'

  export default {
    components: {
      RoleTree,
      PurTree,
      BreadCrumbs
    },
    data() {
      return {
        IDS: {
          roleId: '',
          classIds: [],
        },
        treeStyleObj:{
          'width':'210px',
          'height':''
        },
        tableStyleObj:{
          'margin-left':'215px'
        },
        isTree:true,
      }
    },
    mounted() {
      this._roleTree();
      this._tableHeight();
    },
    methods: {
      _tableHeight(){
        this.treeStyleObj.height = document.documentElement.clientHeight-110 +'px';
      },
      _roleTree() {
        this.$refs.roleTree._Ztree();
      },
      _roleData(result) {
        this.IDS.roleId = result.id;
        this._purTree(result.id);//显示耗材树
      },
      _purTree(ID) {
        this.$refs.purTree._openZtree(ID);
      },
      _treeHide(){ //左侧树隐藏
        this.isTree = false;
        this.tableStyleObj.marginLeft = '15px'
      },
      _treeShow(){
        this.isTree = true;
        this.tableStyleObj.marginLeft = '215px'
      },
    },
  }
</script>
