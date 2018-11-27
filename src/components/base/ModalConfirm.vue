<template>
  <div>
    <Modal
      class="modal-confirm zIndex-1200"
      :title="modalTitle"
      v-model="showModalConfirm"
      :closable="false"
      :width="420">
      <div class="modal-confirm-flex">
        <div><i class="ivu-icon ivu-icon-help-circled"></i></div>
        <div> {{content}}</div>
      </div>
      <div slot="footer">
        <Button :type="item.type === '' ? 'ghost' : 'primary' " v-for="(item,index) in btnModalList" :key="index"
                size="large" style="margin:0 3px;min-width: 88px" @click="_btnModal(item.name)">{{item.name}}
        </Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  /*modal 确认弹框提示（底部多个按钮）*/
  export default {
    name: "modal-confirm",
    props: {
      btnModalList: null,
      content: null
    },
    data() {
      return {
        showModalConfirm: false,
        modalTitle: '提示',
        //用于区别modal
        modalName: ''
      }
    },
    methods: {
      _openModal(name) {
        this.showModalConfirm = true;
        if (name === undefined) {
          this.modalName = 'confirmModal';
        } else {
          this.modalName = name;
        }
      },
      _closeModal() {
        this.showModalConfirm = false;
      },
      _btnModal(name) {
        if (name === '取消') {
          this._closeModal();
        }
        this.$emit('on-result-change', name, this.modalName);
      },
    }
  }
</script>
<style>
  .modal-confirm .ivu-modal-header {
    border-bottom: none !important;
  }

  .modal-confirm .ivu-modal-body {
    padding: 20px !important;
  }

  .modal-confirm .ivu-modal-footer {
    border-top: none !important;
  }

  .modal-confirm i {
    color: #f90 !important;
  }

  .modal-confirm i {
    font-size: 36px !important;
  }

  .modal-confirm .modal-confirm-flex {
    display: flex;
    justify-content: start;
    text-align: center;
  }

  .modal-confirm-flex div {
    line-height: 36px;
    margin-right: 10px;
  }
</style>
