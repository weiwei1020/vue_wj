<template>
  <div>
    <!--内容-->
    <Modal v-model="showMakeClassifyModal" title="选择所要归类的耗材" width="1000" :mask-closable="false">
        <div>
          <Row>
            <!--查询-->
            <Col span="24">
                <Form id="search-form-no-classify" inline onsubmit="return false" :label-width="70">
                  <label class="label-sign"></label>
                  <Form-item  label="耗材编号:" class="width-20">
                    <input name="classifyId" type="hidden"/>
                    <Input  name="num" placeholder="请输入耗材编号" @on-enter="_formSearch"></Input>
                  </Form-item>
                  <Form-item  label="耗材名称:" class="width-20">
                    <input name="categoryId" type="hidden"/>
                    <Input  name="name" placeholder="请输入耗材名称" @on-enter="_formSearch" ></Input>
                  </Form-item>
                  <Form-item  label="耗材类别:" class="width-20">
                    <Input  name="category" placeholder="请输入耗材类别" @on-enter="_formSearch" ></Input>
                  </Form-item>
                  <Form-item  label="规格:" class="width-20">
                    <Input  name="spec" placeholder="请输入规格" @on-enter="_formSearch"></Input>
                  </Form-item>
                  <Form-item class="marleft-90">
                    <Button type="primary" @click="_formSearch">搜索</Button>
                  </Form-item>
                </Form>
            </Col>
            <Col span="24" style="margin-bottom: 10px">
            <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                       ref="pageTable" :getPage="getPage">

            </PageTable>
            </Col>
          </Row>
        </div>
        <div slot="footer">
          <Button @click="_cancel" type="ghost" style="margin-left: 8px">取消</Button>
          <Button @click="_ok" type="primary">确定</Button>
        </div>
    </Modal>
    <!--耗材详情-->
    <RelLmsChemicalDetail ref="detailChemicalModal"></RelLmsChemicalDetail>
  </div>
</template>
<script>
  import RelLmsChemicalDetail from '../lms-chemicals-manage/LmsChemicalDetail.vue'
  import PageTable from '../../../components/table/PageTable'

  export default {
    components:{RelLmsChemicalDetail,PageTable},
    data() {
      return {
        tableHeight:'400',
        heightSearch:'',
        selectIds: [],
        showMakeClassifyModal: false,
        pageColumns: [
          {type: 'selection', width: 60, align: 'center'},
          {title: '耗材编号', width: 100, key: 'num',ellipsis:true,},
          {title: '耗材名称', key: 'name', width: 140,ellipsis:true,
            render: (h, data) => {
              return h('div', [
                h('a', {
                  on: {
                    click: () => {
                      this._detailChemicalModal(data.row.id);
                    }
                  }
                }, data.row.name),
              ]);
            }
          },
          {title: '耗材类别', width: 140, key: 'category', ellipsis: true},
          {title: '仓库位置', width: 200, key: 'storehouse', ellipsis: true},
          {title: '库存量', width: 100, key: 'stock', ellipsis: true},
          {title: '等级（纯度）', width: 150, key: 'quality', ellipsis: true},
          {title: '规格', width: 100, key: 'spec', ellipsis: true},
          {title: '密度', width: 100, key: 'thickness', ellipsis: true},
          {title: '不确定度', width: 100, key: 'unsure', ellipsis: true},
          {title: '标准值', width: 100, key: 'standard', ellipsis: true},
          {title: '制造厂商', width: 200, key: 'manufacturer', ellipsis: true},
//          {title: '供应商', width: 200, key: 'supplier', ellipsis: true},
          {title: '计量方式', width: 100, key: 'unit', ellipsis: true},
          {title: '转化率', width: 100, key: 'exchange', ellipsis: true},
          {title: '转化单位', width: 120, key: 'exunit', ellipsis: true},
          {title: '转化库存量', width: 120, key: 'exstock', ellipsis: true},
        ],
        DATA:{        //要提交至归类的数据
          classifyId:'',
          chemicalIds:[]
        },
        getPage:{},
      }
    },
    methods: {
      _page() {
        this.$refs.pageTable._page('search-form-no-classify', 'LmsChemical/getExclude');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _search() {
        this._page();
      },
      _detailChemicalModal(id){
        // 查看
        this.$store.dispatch('LmsChemical/getById', id).then(() => {
          this.$refs.detailChemicalModal._open(this.$store.state.LmsChemical.model);
        });
      },
      _open(id) {
        this.showMakeClassifyModal = true;
        this.selectIds = [];
        $('input[name=classifyId]').val(id);
        this.DATA.classifyId = id;
        this._page();
      },
      _ok() {
        var ids = this.selectIds;
        this.DATA.chemicalIds = ids;
        if (ids == '') {
          this.$Message.warning('请选择要进行归类的产品！');
        } else {
          this.$store.dispatch('LmsChemical/chemicalClass', this.DATA).then(() => {
            if(this.$store.state.LmsChemical.success){
              this.showMakeClassifyModal = false;
              this.$Message.success('归类成功！');
              this.$emit("on-result-change");
            }
          });

        }
      },
      _cancel() {
        this.showMakeClassifyModal = false;
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage =  this.$store.state.LmsChemical.pageExclude;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
