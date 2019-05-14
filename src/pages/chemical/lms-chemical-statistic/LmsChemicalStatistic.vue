<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main tree-position">
        <div class="position-right">
          <Row>
            <h3 style="text-align: center;">耗材采购统计</h3>
            <Col span="24" style="margin-bottom: 10px">
              <ElTableNoPage :tableHeight="tableHeight" ref="pageTable" :getPage="getPage" no-warning hide-checkbox>
                <el-table-column
                  show-overflow-tooltip
                  sortable
                  :prop="item.key"
                  :label="item.title"
                  :width="item.width"
                  :min-width="200"
                  :fixed="item.fixed?item.fixed:undefined"
                  v-for="item in pageColumns" :key="item.key">
                  <template slot-scope="scope">
                    <span>{{scope.row[item.key]}}</span>
                  </template>
                </el-table-column>
              </ElTableNoPage>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import CategoryTree from '../CategoryTree.vue'
  import ElTableNoPage from '../../../components/table/ElTableNoPage.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import IconList from '../../../components/base/IconList1.vue'

  export default {
    components: {
      CategoryTree,
      ElTableNoPage,
      BreadCrumbs,
      IconList,
    },
    data() {
      return {
        isSearch: true,
        tableHeight: '520',
        getPage: {
          records: []
        },
        pageColumns: [
          {title: '耗材编号', width: 240, key: 'num', ellipsis: true,sortable:'true',},
          {title: '耗材名称', key: 'name',  align: 'left', ellipsis: true,sortable:'true',},
          {title: '采购量', width: 220, key: 'consunmableStock', ellipsis: true,sortable:'true',},
          {title: '单价', width: 220, key: 'price', ellipsis: true,sortable:'true',},
          {title: '总价格', width: 220, key: 'sumPrice', ellipsis: true,sortable:'true',},
        ],
      }
    },
    mounted() {
      this._page();
    },
    methods: {
      _page() {
        this.$store.dispatch('LmsChemicalManage/getStatistic').then(() => {
          this.getPage = this.$store.state.LmsChemicalManage.page;
          this.$refs.pageTable._hideLoading();
        });
      },
    },
  }
</script>
