<template>
  <div>
    <Row>
      <!--查询条件-->
      <Col span="24" style="margin-bottom: 10px;">
      <div style="margin-top: 49px;margin-bottom: 32px">
        <Table :loading="loading" :columns="pageColumns" :data="getPage"
               size="small" border highlight-row stripe
               :height="300"
               @on-selection-change="_selectRowChange" @on-select-all='_selectAll'
        ></Table>
      </div>
      </Col>

    </Row>
  </div>
</template>
<script>
  /**
   * 用户编组
   */
  export default {
    components: {},
    data() {
      return {
        loading: true,
        pageParams: {rows: 20},
        pageColumns: [
          {type: 'selection', width: 60, align: 'center', fixed: 'left',},

          {
            title: '姓名', key: 'realname', ellipsis: true,width:100,
          },
          {
            title: '用户名', key: 'username',  ellipsis: true,width:120
          },
          {
            title: '性别', key: 'sex', ellipsis: true, width: 80,
            render: (h, params) => {
              return h('div', params.row.sex === 1 ? '女' : '男');
            }
          },
        ],
        getPage: [],
        selectIds: []
      }
    },
    methods: {
      _open(data) {
        if (this.getPage.length == 0) {
          this.getPage = data;
        } else {
          let ids = [];
          for (let i = 0; i < this.getPage.length; i++) {
            ids.push(this.getPage[i].id)
          }
          for (let k = 0; k < data.length; k++) {
            if (ids.indexOf(data[k].id) == -1) {
              this.getPage.push(data[k])
            } else {

            }
          }
        }
        this.loading = false;
        this.$emit('on-result-change', this.getPage)
      },
      _opens(){
        this.getPage =[]
      },
      _selectRowChange(data) {
        var idList = [];
        for (var i = 0; i < data.length; i++) {
          idList.push(data[i].id);
        }
        this.selectIds = idList;
        this.$emit("on-length-change", this.selectIds)
      },
      _selectAll: function (data) {
        this._selectRowChange(data);
      },
      _delData() {
        for (let j = 0; j < this.selectIds.length; j++) {
          for (let i = 0; i < this.getPage.length; i++) {
            if (this.getPage[i].id == this.selectIds[j]) {
              this.getPage.splice(i, 1)
            }
          }
        }
        this.$emit("on-length-change", this.getPage)
        this.$emit('on-result-change', this.getPage)
      }
    }
  }
</script>
