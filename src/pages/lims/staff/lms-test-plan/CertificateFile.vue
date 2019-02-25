<template>
  <div>
    <Modal v-model="showUploadModal" :width="800">
      <p slot="header">{{modalTitle}}</p>
      <div>
        <!--内容-->
        <Row>
          <!--查询-->
          <Col span="24" style="margin-bottom: -10px">
          <Form id="search-form-upload" inline onsubmit="return false" :label-width="70">
            <label class="label-sign"></label>
            <Form-item label="文件名称:">
              <Input name="fileName" placeholder="请输入文件名称" @on-enter="_pageChange(1)" style="width: 200px;"/>
              <input name="projectId" type="hidden">
            </Form-item>
            <Form-item class="marleft-70">
              <Button type="primary" @click="_search">搜索</Button>
            </Form-item>
          </Form>
          </Col>
          <!--操作-->
          <Col span="24" style="margin-bottom: 10px">
          <UploadFile ref="uploadFileModal" @on-result-change="_search"></UploadFile>
          </Col>
          <Col span="24" style="margin-bottom: 10px">
          <Files ref="fileModal" @on-result-change="_fileData"></Files>
          </Col>
        </Row>
      </div>
    </Modal>

  </div>
</template>
<script>
  import global from '../../../../api/config'
  import Files from './Files'
  import UploadFile from './UploadFile'

  export default {
    components: {
      global,
      Files,
      UploadFile
    },
    data() {
      return {
        showUploadModal: false,
        modalTitle: '附件',
        heightSearch: '',
        selectIds: [],
        getPage: {},
        pageParams: {
          rows: 20,
        },
      }
    },
    methods: {
      _open(id) {
        this.showUploadModal = true;
        $('input[name=projectId]').val(id);
        this._page();
        this.$refs.uploadFileModal._open(id);
      },
      _page() {
        this.$store.dispatch('LmsStaffLevel/filePage', this._searchParams()).then(() => {
          this.getPage = this.$store.state.LmsStaffLevel.page;
          this.$refs.fileModal._open(this.getPage, '300');
        });
      },
      _pageChange(page) {
        this.pageParams['page'] = page;
        this._page();
      },
      _pageSizeChange(rows) {
        this.pageParams['rows'] = rows;
        this._page();
      },
      _search() {
        this._page();
      },
      _searchParams() {
        var data = this.$serialize('search-form-upload');
        return this.$extend(data, this.pageParams);
      },
      _deleteById(id) {
        // 删除一条记录
        this.$Modal.confirm({
          title: '提示',
          content: '确定删除？',
          onOk: () => {
            this.$store.dispatch('LmsStaffLevel/deleteFileByIds', id).then(() => {
              if (this.$store.state.LmsStaffLevel.success) {
                this._page();
                this.$Message.success('删除成功！');
              }
            });
          }
        });
      },
      //下载
      _download(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '确定要下载？',
          onOk: () => {
            window.open(global.baseURL + '/slims/v1/staff_plan_attachment/download/' + id, '_blank');
          }
        });
      },
      _fileData(msg, data) {
        switch (msg) {
          case 'delete' :
            this._deleteById(data);
            break;
          case 'down' :
            this._download(data);
            break;
          case 'page' :
            this._pageChange(data);
            break;
          case 'rows' :
            this._pageSizeChange(data);
            break;
        }
      },
    },
  }
</script>
