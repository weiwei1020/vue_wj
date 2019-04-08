<template>
  <div>
    <!-- 面包屑 -->
    <BreadCrumbs :crumbs="$showBread()"></BreadCrumbs>
    <!--内容-->
    <div class="layout-content-padding">
      <div class="layout-content-main">
        <Row>
          <!--查询-->
          <Col span="24" style="margin-top: 20px">
          <Form id="search-form" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item style="width: 15%" label="耗材编号:">
              <Input name="chemicalNum" placeholder="请输入耗材编号" @on-enter="_formSearch"></Input>
            </Form-item>
            <Form-item style="width: 15%" label="耗材名称:">
              <Input name="chemicalName" placeholder="请输入耗材名称" @on-enter="_formSearch"></Input>
            </Form-item>
            <Form-item style="width: 15%" label="耗材类别:">
              <Select style="width:100%" clearable filterable @on-change="_chemicalCategoryChange">
                <Option v-for="item in typeList" :value="item" :key="item">{{ item}}</Option>
              </Select>
              <input name="chemicalCategory" type="hidden"/>
            </Form-item>
            <Form-item style="width: 15%" label="状态:">
              <Select v-model="type" style="width:100%" clearable filterable @on-change="_typeChange">
                <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.name}}</Option>
              </Select>
              <input name="type" type="hidden"/>
            </Form-item>
            <Form-item label="操作时间:" style="margin-left: -15px;">
              <Date-picker type="datetimerange" placeholder="操作时间" style="width:300px;"
                           @on-change="_dateChange"></Date-picker>
              <input name="beginDate" type="hidden">
              <input name="endDate" type="hidden">
            </Form-item>
            <Form-item style="margin-left: -70px">
              <Button type="primary" @click="_formSearch">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <div>
            <BtnList :msg="btn" class="contHide" @on-result-change="_btnClick"></BtnList>
          </div>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <PageTable :pageColumns="pageColumns" :tableHeight="tableHeight" @on-result-change="_tableResultChange"
                     ref="pageTable" :getPage="getPage">

          </PageTable>
          </Col>
        </Row>
      </div>
    </div>
  </div>
</template>
<script>
  import PageTable from '../../../components/table/PageTable'
  import IconList from '../../../components/base/IconList1.vue'
  import BreadCrumbs from '../../../components/base/BreadCrumbs'
  import BtnList from '../../../components/base/BtnList.vue'
  import {http} from '../../../api/http'

  export default {
    components: {
      PageTable,
      IconList,
      BreadCrumbs,
      BtnList
    },
    data() {
      return {
        btn: [
          {type: '', id: '', name: '导出'},
        ],
        heightSearch: '',
        tableHeight: '300',
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left'},
          {
            title: '状态', key: 'type', width: 120, fixed: 'left',
            render: (h, params) => {
              let text = '', color = '';
              if (params.row.type == 0) {
                text = '入库';
                color = '#6FBA2C';
              } else if (params.row.type == 1) {
                text = '出库';
                color = '#F8BB2C';
              } else if (params.row.type == 2) {
                text = '归还';
                color = '#00a0e9';
              } else {
              }
              return h('div', {
                style: {
                  color: color
                }
              }, text);
            }
          },
          {title: '耗材编号', key: 'chemicalNum', width: 100, ellipsis: true,},
          {
            title: '耗材名称', key: 'chemicalName', width: 140, ellipsis: true,
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
                    display: 'block',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, params.row.chemicalName),
                h('div', {
                  slot: 'content',
                  style: {
                    padding: '3px',
                    whiteSpace: 'normal'
                  }
                }, [
                  h('div', params.row.chemicalName)
                ])

              ]);
            }
          },
          {
            title: '出入库量', key: 'stock', width: 120, ellipsis: true,
            render: (h, params) => {
              return h('div', params.row.stock + ' / ' + params.row.unit);
            }
          },
          {title: '操作人', key: 'realname', width: 100, ellipsis: true},
          {
            title: '操作时间', key: 'ctime', width: 160, fixed: 'right',
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.ctime, "yyyy-mm-dd HH:MM"));
            }
          },
          {title: '计量方式', width: 100, key: 'unit', ellipsis: true,},
          {
            title: '耗材类别', key: 'category', width: 140, ellipsis: true,
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
                    display: 'block',
                    maxWidth: '100px',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis'
                  }
                }, params.row.chemicalCategory),
                h('div', {
                  slot: 'content',
                  style: {
                    padding: '3px',
                    whiteSpace: 'normal'
                  }
                }, [
                  h('div', params.row.chemicalCategory)
                ])

              ]);
            }
          },
          {title: '仓库位置', key: 'storehouse', width: 100, ellipsis: true,},
          {title: '库存量', key: 'allstock', width: 100, ellipsis: true,},
          {
            title: '有效期', key: 'validDate', width: 120, ellipsis: true,
            render: (h, params) => {
              return h('div', this.$dateformat(params.row.validDate, "yyyy-mm-dd"));
            }
          },
          {title: '生产批号/批次', key: 'batchNum', width: 170, ellipsis: true,},
          {title: '价格', key: 'price', width: 100, ellipsis: true,},
          {
            title: '备注', key: 'remark', ellipsis: true, width: 230,
            render: (h, data) => {
              if (data.row.type == 1) {
                let operate = [];
                operate.push(
                  h('span', {
                    style: {'color': '#19be6b', 'marginRight': '10px'}
                  }, '科室:' + data.row.department + ';')
                );
                operate.push(
                  h('span', {
                    style: {'color': '#ed3f14', 'marginRight': '10px'}
                  }, '登记人:' + data.row.registrant + ';')
                );
                operate.push(
                  h('span', {
                    style: {'color': '#1c2438'}
                  }, '备注:' + data.row.remark)
                );
                return h('div', operate);
              } else {
                return h('div', data.row.remark);
              }
            }
          },
        ],
        statusList: [
          {value: 0, name: '入库'},
          {value: 1, name: '出库'},
          {value: 2, name: '归还'},
        ],
        type: '', //状态
        getPage: {},
        contLength: null,
        noBtnVal: 290,
        btnVal: 340,
        dVal: 90,
        typeList: [],
        selectIds: [],
        beginDate: '',
        endDate: ''
      }
    },
    mounted() {
      this._contHide();
    },
    methods: {
      _dateChange(data){
        $('input[name=beginDate]').val(data[0]);
        $('input[name=endDate]').val(data[1]);
      },
      _btnClick(msg) {
        switch (msg) {
          case '导出' :
            this._export();
            break;
        }
      },
      _typeChange(data) {
        $('input[name=type]').val(data);
      },
      _chemicalCategoryChange(data) {
        $('input[name=chemicalCategory]').val(data);
      },
      _contHide() {
        this._judgePanel(0);
        this._page();
        this._typeList();
      },
      _typeList() {
        this.$store.dispatch('LmsChemicalCategory/treeList').then(() => {
          let typeList = this.$store.state.LmsChemicalCategory.treeList
          let list = [];
          for (let i = 0; i < typeList.length; i++) {
            list.push(typeList[i].name)
          }
          this.typeList = list
        })
      },
      _panelChange(rel) { //点击折叠面板
        this._judgePanel(rel.length);
      },
      _judgePanel(val) {
        this.tableHeight = this.$tableHeight(val, this.noBtnVal, this.dVal);
      },
      _page() {
        this.$refs.pageTable._page('search-form', 'LmsChemicalUserecord/page');
      },
      _formSearch() {
        this.$refs.pageTable._pageChange(1);
      },
      _tableResultChange(msg, data) {
        switch (msg) {
          case 'page':
            this.getPage = this.$store.state.LmsChemicalUserecord.page;
            break;
          case 'selectIds':
            this.selectIds = data;
            break;
          default :
            this._page();
        }
      },
      //导出
      _export() {
        var ids = this.selectIds;
        if (ids.length === 0) {
          this.$Message.warning('请选择一条或多条数据！');
        } else {
          if (this.beginDate === '' || this.endDate === '') {
            this._exportByIds(ids, '确定导出 ' + ids.length + ' 条记录？');
          } else {
            this._exportByTimeIds(ids, '确定要按时间导出 ' + ids.length + ' 条记录？');
          }
        }
      },
      _exportByIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            http.open('/slims/v1/chemical_userecord/export',
              {request: {'ids': this.selectIds}}
            );
            // this.selectIds = [];
          }
        });
      },
      _exportByTimeIds(ids, content) {
        this.$Modal.confirm({
          title: '提示',
          content: content,
          onOk: () => {
            http.open('/slims/v1/chemical_userecord/export',
              {request: {"beginDate": this.beginDate, "endDate": this.endDate, 'ids': this.selectIds}}
            );
            // this.selectIds = [];
          }
        });
      },
    },
  }
</script>
