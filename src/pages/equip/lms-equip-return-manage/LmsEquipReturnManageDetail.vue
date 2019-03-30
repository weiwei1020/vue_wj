<template>
  <div>
    <Modal v-model="showDetailModal" title="详情">
      <div class="maxHeight">
        <table class="tableClass">
          <tbody>
            <tr>
              <th>企业ID</th>
              <td>{{obj.companyId}}</td>
            </tr>
            <tr>
              <th>合同仪器ID</th>
              <td>{{obj.contractEquipId}}</td>
            </tr>
            <tr>
              <th>使用来源</th>
              <td>{{obj.useSource}}</td>
            </tr>
            <tr>
              <th>领用人ID</th>
              <td>{{obj.receiptorId}}</td>
            </tr>
            <tr>
              <th>领用人</th>
              <td>{{obj.receiptor}}</td>
            </tr>
            <tr>
              <th>领用时间</th>
              <td>{{obj.receiveDate}}</td>
            </tr>
            <tr>
              <th>备注</th>
              <td>{{obj.remark}}</td>
            </tr>
            <tr>
              <th>创建人ID</th>
              <td>{{obj.uid}}</td>
            </tr>
            <tr>
              <th>创建时间</th>
              <td>{{obj.ctime}}</td>
            </tr>
            <tr>
              <th>最后修改人ID</th>
              <td>{{obj.lid}}</td>
            </tr>
            <tr>
              <th>最后修改时间</th>
              <td>{{obj.ltime}}</td>
            </tr>
            <tr>
              <th>是否删除</th>
              <td>{{obj.deleted}}</td>
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