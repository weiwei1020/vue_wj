<template>
  <div>
    <Row>
      <!--操作-->
      <Col span="24" style="margin-bottom: 10px">
      <div class="btns-menu">
        <!--查看方式-->
        <Select v-model="viewVal" style="width:150px" @on-change="_view" placeholder="请选择查看方式">
          <Option v-for="item in checkList" :key="item.value" :value="item.value">{{ item.name }}</Option>
        </Select>
        <!--一系列操作-->
        <RadioGroup type="button" @on-change="_radioChange" v-if="viewStyle === 2 || viewStyle === 3">
          <Radio :label="item.value" v-for="item in menusList" :key="item.name">
            <Icon :type="item.type"></Icon>&nbsp;{{item.name}}
          </Radio>
        </RadioGroup>

        <RadioGroup type="button" @on-change="_tableChange" v-if="viewStyle === 1">
          <Radio :label="item.value" v-for="item in menusList" :key="item.name">
            <Icon :type="item.type"></Icon>&nbsp;{{item.name}}
          </Radio>
        </RadioGroup>
      </div>
      </Col>

      <Col span="24" style="margin-bottom: 10px">
      <!-- 默认是详细模式 -->
      <div v-if="viewStyle === 1">
        <Table :columns="pageColumns" :data="getPage.records" size="small"
               @on-selection-change="_selectRowChange" @on-select-all='_selectAll'
               border highlight-row stripe style="margin-bottom: 10px" :height="tableHeight"></Table>

        <Page :total="getPage.total" :page-size="getPage.size" @on-change="_pageChange"
              @on-page-size-change='_pageSizeChange'
              placement="top" show-elevator show-total show-sizer></Page>
      </div>
      <!--/-->
      <!--缩略图 模式-->
      <div v-else-if="viewStyle === 2">
        <ul class="thumbnailStyle" :style="{ 'height': tableHeight + 'px' }">
          <CheckboxGroup @on-change="_chkVal" v-model="selectIds">
            <li v-for="item in getPage.records" :key="item.id">
              <div class="thumbnailStyleImg">
                <Tooltip placement="top">
                  <img :src=" bigUrl+item.type+'.png' "/>
                  <div slot="content" style="white-space: normal">
                    <p>名称：{{item.fileName}}</p>
                  </div>
                </Tooltip>
              </div>
              <div class="thumbnailStyleCheck clearCheck">
                <Checkbox :label="item.id"><span class="inline-span" style="display: inline">{{item.fileName}}</span>
                </Checkbox>
              </div>
            </li>
          </CheckboxGroup>
        </ul>
        <div style="margin-top: 10px">共 {{getPage.total}} 条</div>
      </div>
      <!--/-->
      <!--列表 模式-->
      <div v-else="viewStyle === 3">
        <ul class="listStyle" :style="{ 'height': tableHeight + 'px' }">
          <CheckboxGroup @on-change="_chkVal" v-model="selectIds">
            <li v-for="item in getPage.records" :key="item.id">
              <div class="listStyleCheck clearCheck">
                <Tooltip placement="top">
                  <span class="spanImg">
                    <img :src=" smallUrl+item.type+'.png' "/>
                  </span>
                  <span>
                    <Checkbox :label="item.id"><span>{{item.fileName}}</span></Checkbox>
                  </span>
                  <div slot="content" style="white-space: normal">
                    <p>名称：{{item.fileName}}</p>
                  </div>
                </Tooltip>
              </div>
            </li>
          </CheckboxGroup>
        </ul>
        <div style="margin-top: 10px">共 {{getPage.total}} 条</div>
      </div>
      <!--/-->
      </Col>
    </Row>
  </div>
</template>
<script>

  export default {
    components: {},
    data() {
      return {
        heightSearch: '',
        selectIds: [],
        getPage: {},
        pageParams: {
          rows: 20,
        },
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},
          {title: '文件名', key: 'fileName', ellipsis: true,},
          {
            title: '操作', key: 'action', width: 130,
            render: (h, data) => {
              return h('div', [
                h('Button', {
                  props: {type: 'error', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: () => {
                      this._deleteById(data.row.id);
                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {type: 'primary', size: 'small'},
                  on: {
                    click: () => {
                      this._download(data.row.id);
                    }
                  }
                }, '下载'),
              ]);
            }
          }
        ],
        viewVal: 1,
        viewStyle: 1,
        menusList: [
          {name: '下载', value: 'down', type: 'arrow-down-a'},
          {name: '删除', value: 'delete', type: 'trash-a'},
        ],
        checkList: [
          {name: '详细模式', value: 1},
          {name: '缩略图模式', value: 2},
          {name: '列表模式', value: 3}
        ],
        Ids:[],
        smallUrl: 'http://static.patzn.com/img/smallfile/',
        bigUrl: 'http://static.patzn.com/img/bigfile/',
        tableHeight: '300'
      }
    },
    methods: {
      _open(data, height) {
        this.getPage = data;
        this.tableHeight = height;
        this.selectIds = [];
      },
      _pageChange(page) {
        this.$emit("on-result-change", 'page', page);
      },
      _selectRowChange(data) {
       // console.log(data)
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.Ids = idList;
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _pageSizeChange(rows) {
        this.$emit("on-result-change", 'rows', rows);
      },
      //删除
      _deleteById(id) {
        this.$emit("on-result-change", 'delete', id);
      },
      //下载
      _download(id) {
        this.$emit("on-result-change", 'down', id);
      },
      //查看方式改变
      _view(val) {
        this.viewStyle = val;
        this.selectIds = [];
      },
      _chkVal(val) {
        this.selectIds = val;
      },
      //一系列操作返回的值
      _radioChange(val) {
        if (val == 'down') {
          if (this.selectIds.length === 0) {
            this.$Message.warning('请选择一条数据!');
          } else if (this.selectIds.length > 1) {
            this.$Message.warning('只能选择一条数据下载!');
          } else {
            this._download(this.selectIds[0]);
          }
        }
        if (val == 'delete') {
          if (this.selectIds.length === 0) {
            this.$Message.warning('请选择一条数据!');
          } else {
            this._deleteById(this.selectIds);
          }
        }
      },
      _tableChange(val) {
        if (val == 'down') {
          if (this.Ids.length === 0) {
            this.$Message.warning('请选择一条数据!');
          } else if (this.Ids.length > 1) {
            this.$Message.warning('只能选择一条数据下载!');
          } else {
            this._download(this.Ids[0]);
          }
        }
        if (val == 'delete') {
          if (this.Ids.length === 0) {
            this.$Message.warning('请选择一条数据!');
          } else {
            this._deleteById(this.Ids);
          }
        }
      },
    },
  }
</script>
