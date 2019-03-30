<template>
  <div>
    <Modal v-model="showDetailModal" title="仪器报废管理详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
            <tr>
              <th>报废详情id</th>
              <td>{{obj.detailId}}</td>
            </tr>
            <tr>
              <th>报废日期</th>
              <td>{{obj.scrapDate}}</td>
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
   * 仪器报废管理详情
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