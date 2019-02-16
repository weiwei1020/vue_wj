<template>
    <div>
      <Row>
        <!--查询条件-->
        <Col span="24">
        <Form id="user-marshalling-form" >
          <Form-item onsubmit="return false">
            <Input v-model="groupName" placeholder="请输入组名称,回车查询" style="width:100%"
                   @on-enter="_search()" icon="ios-search-strong" @on-click="_search"></Input>
          </Form-item>
        </Form>
        </Col>
        <Col span="24" style="margin-bottom: 10px">
            <Table :loading="loading" :columns="pageColumns" :data="getPage.records" size="small"
                   border highlight-row  disabled-hover
                    :height="300"
                   class="tableClassName" @on-row-click="_rowChange"
            ></Table>
        </Col>
        <Col span="24">
          <Page :total="getPage.total"
                :current="getPage.current"
                @on-change="_pageChange"
               show-total simple></Page>
        </Col>
      </Row>
    </div>
</template>
<script>
    /**
     * 用户编组
     */
    export default {
      components: {

      },
        data() {
            return {
              loading:true,
              pageParams: {rows: 20},
              pageColumns: [
                {title: '组名称', key: 'name',width:120,fixed:'left',ellipsis:true},
                {title: '描述', key: 'decp',width:150,ellipsis:true},
                {title: '用户数', key: 'num',width:170,ellipsis:true},
              ],
              getPage:{},
              groupName:''
            }
        },
        methods: {
            _open() {
                this._page();
            },
            _page() {
              this.$store.dispatch('LmsMarshalManage/page', this._searchParams()).then(()=>{
                this.loading = false;
                this.getPage = this.$store.state.LmsMarshalManage.page;
              });
            },
            _pageChange(page) {
              this.pageParams['page'] = page;
              this._page();
            },
            _searchParams() {
              var data = this.$serialize('user-marshalling-form');
              data.name = this.groupName;
              return this.$extend(data, this.pageParams);
            },
            _search() {
              this._page();
            },
          _rowChange(data) {
            this.$emit("on-result-change",data);
          },

        }
    }
</script>
