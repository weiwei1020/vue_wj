<template>
  <div>
    <Modal v-model="showStorageDetailModal" width="1000">
      <p slot="header">库存详情</p>
      <Row>
        <!--查询-->
        <Col span="24">
        <Form id="search-form-chemical-stock" inline onsubmit="return false" :label-width="80">
          <label class="label-sign"></label>
          <Form-item label="CAS编号:" class="width-23">
            <input name="chemicalId" value="" type="hidden"/>
            <Input name="casNum" placeholder="请输入CAS编号" @on-enter="_formSearch"></Input>
          </Form-item>
          <Form-item label="生产批号:" class="width-23">
            <Input name="batchNum" placeholder="请输入生产批号" @on-enter="_formSearch"></Input>
          </Form-item>
          <Form-item label="有效期:" class="width-23">
            <DatePicker :value="dateValue" format="yyyy-MM-dd" type="daterange" placement="bottom-end"
                        placeholder="请选择有效期" style="width: 100%" @on-change="_dateChange">
            </DatePicker>
            <input name="beginValidDate" type="hidden"/>
            <input name="endValidDate" type="hidden"/>
          </Form-item>
          <Form-item class="marleft-90">
            <Button type="primary" @click="_formSearch">搜索</Button>
          </Form-item>
        </Form>
        </Col>
        <!-- 耗材基本信息 -->
        <Col span="24" style="margin-bottom: 10px">
        <table class="tableClass">
          <tbody>
          <tr>
            <th>耗材编号</th>
            <td>{{chemical.num}}</td>
            <th>耗材名称</th>
            <td>{{chemical.name}}</td>
            <th>耗材类别</th>
            <td>{{chemical.category}}</td>
            <th>仓库位置</th>
            <td>{{chemical.storehouse}}</td>
          </tr>
          <tr>
            <th>库存量</th>
            <td>{{chemical.stock}}</td>
            <th>计量方式</th>
            <td>{{chemical.unit}}</td>
            <th>备注</th>
            <td colspan="3">{{chemical.remark}}</td>
          </tr>
          </tbody>
        </table>
        </Col>
        <Col span="24" style="margin-bottom: 10px">
        <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
        </Col>
        <Col span="24" style="margin-bottom: 10px">
        <PageTable :pageColumns="pageColumnsStorage" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                   ref="pageTable" :getPage="getPage">

        </PageTable>
        </Col>
      </Row>
    </Modal>
    <!-- 耗材入库 -->
    <LmsChemicalStockIn ref="chemicalStockInModal" @on-result-change="_search"></LmsChemicalStockIn>
  </div>
</template>
<script>
  import PageTable from '../../../components/table/PageTable'
  import IconList from '../../../components/base/IconList1.vue'
  import BtnList from '../../../components/base/BtnList.vue'

  export default {
    components: {
      PageTable,
      IconList,
      BtnList,
    },
    data() {
      return {
        tableHeight: '300',
        iconMsg: [
          {type: 'log-in', id: 'chemical-manage-stock-in', name: '入库'},
        ],
        btn: [
          {type: 'success', id: 'chemical-in-storage-start', name: '添加'},
        ],
        heightSearch: '',
        getPage: {},
        dateValue: [],//有效期
        showStorageDetailModal: false,
        chemical: {
          id: '',
          num: '',
          category: '',
          name: '',
          storehouse: ''
        },
        RelQuoteList: [],
        chemicalId:'',
        pageColumnsStorage: [
          {title: 'CAS编号', width: 120, key: 'casNum', ellipsis: true, fixed: 'left'},
          {
            title: '商品编码', width: 150, key: 'productCode',
            render: (h, params) => {
              return h('Tooltip', {
                props: {
                  placement: 'top-start'
                },
                style: {
                  cursor: 'pointer'
                }
              }, [
                h('div', {
                  style: {
                    maxWidth: '110px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, params.row.productCode),
                h('div', {
                  slot: 'content',
                  style: {
                    padding: '3px',
                    whiteSpace: 'normal'
                  }
                }, [
                  h('div', params.row.productCode)
                ])

              ]);
            }
          },
          {
            title: '库存量', width: 100, key: 'stock', ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.stock + ' / ' + params.row.unit);
            }
          },
          {
            title: '有效期', key: 'validDate', width: 110, ellipsis: true,
            render: (h, params) => {
              if (!params.row.validDate) {
                return '';
              }
              return h('div', this.$dateformat(params.row.validDate, "yyyy-mm-dd"));
            }
          },
          {title: '生产批号（批次）', width: 150, key: 'batchNum', ellipsis: true},
          {
            title: '转换库存量', width: 100, key: 'exstock', ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.exstock + ' / ' + params.row.exunit);
            }
          },
          {
            title: '已使用量', width: 100, key: 'exused', ellipsis: true,
            render: (h, params) => {
              let text = params.row.exused;
              if (!text) {
                text = 0;
              }
              return h('div', text + ' / ' + params.row.exunit);
            }
          },
          {title: '供应商', width: 180, key: 'supplier', ellipsis: true},
          {title: '备注', key: 'remark', width: 220, ellipsis: true},
          {
            title: '操作', key: 'action', width: 100, align: 'center', fixed: 'right',
            render: (h, data) => {
              return h('div',
                [
                  h(IconList, {
                    props: {msg: this.iconMsg},
                    on: {
                      'on-result-change': (res) => {
                        this._iconClick(res, data)
                      }
                    }
                  },),
                ]);
            }
          }
        ],

      }
    },

    methods: {
      _btnClick(msg){
        switch (msg) {
          case '添加' :
            this._chemicalStockAddModal(this.chemicalId);
            break;
        }
      },
      _iconClick(res, data) {
        switch (res) {
          case '入库' :
            this._chemicalStockInModal(data.row);
            break;
        }
      },
      _chemicalStockAddModal(chemicalId) {
        // 入库
        this.$refs.chemicalStockAddModal._open(chemicalId);
      },
      _page() {
        this.$refs.pageTable._page('search-form-chemical-stock', 'LmsChemicalStock/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _chemicalStockInModal(data) {
        //入库
        this.$refs.chemicalStockInModal._open(data);
      },
      _search() {
        this._page();
        this.$emit('on-result-change', this.chemical.id);
      },
      _openStorage(data) {
        this.chemical = data;
        $('input[name=chemicalId]').val(data.id);
        this.chemicalId = data.id;
        this._page();
        this.showStorageDetailModal = true;
      },
      _dateChange(data) { //有效期
        if (data[0] == '') { //开始和结束为同一天
          $('input[name=beginValidDate]').val(data[0]);
          $('input[name=endValidDate]').val(data[0]);
        } else {
          $('input[name=beginValidDate]').val(data[0]);
          $('input[name=endValidDate]').val(data[1]);
        }
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalStock.page;
            break;
          default :
            this._page();
        }
      },
    },
  }
</script>
