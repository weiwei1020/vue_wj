<template>
  <div>
    <Modal v-model="showDetailModal" title="详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
            <tr>
              <th>核查id</th>
              <td>{{obj.checkId}}</td>
            </tr>
            <tr>
              <th>实施过程</th>
              <td>{{obj.process}}</td>
            </tr>
            <tr>
              <th>实施附件</th>
              <td>{{obj.processFiles}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td>{{obj.remark}}</td>
            </tr>
            <tr>
              <th>公司id</th>
              <td>{{obj.companyId}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<script>
  /**
   * 详情
   */
  export default {
    data() {
      return {
        obj: {},
        showDetailModal: false
      }
    },
    methods: {
      _open(obj) {
        this.showDetailModal = true;
        this.obj = obj;
      }
    }
  }
</script>