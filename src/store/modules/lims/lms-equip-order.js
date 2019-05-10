/**
 * 仪器预约信息表相关
 */
import {http} from '../../../api/http'
import {https} from "../../../api/https";
const state = {
    success: false,
    model: {},
    page: {},
  list: {},
  supplierList: {},
  purchasePage: {}
};

const actions = {
  /*仪器预约添加*/
  async addPros({commit}, data) {
    await http.post('/apparatusPurchase/add',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageDraft({commit}, data) {
    await http.post('/apparatusPurchase/pageDraft', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async page({commit}, data) {
    await http.post('/apparatusPurchase/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  /*仪器预约修改*/
  async editPros({commit}, data) {
    await http.post('/apparatusPurchase/edit',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*预约提交*/
  async submitPros({commit}, data) {
    await http.post('/apparatusPurchase/submit',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*预约删除*/
  async deletePros({commit}, data) {
    await http.post('/apparatusPurchase/delete',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*async addPro({commit}, data) { //批量添加
    await http.post('/slims/v1/chemical_rel_purchase/?addPros=' + data.id + '&quantity=' + data.quantity).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },*/
  /*async purchaseChemicalPage({commit}, data) {
    await http.post('/slims/v1/chemical_rel_purchase/page?orderId=' + data.purchaseId, data.obj).then(function (resp) {
      commit('PAGE', resp);
    });
  },*/
  async deletePurIds({commit}, ids) {
    await http.delete('/slims/v1/equip_order_temp/?ids='+ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async purOrder({commit}, data) {
    await http.post('/slims/v1/equip_order/submit' + data.approve, {remark: data.remark}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitOrder({commit}, data) {
    await https.post('/slims/v1/equip_order/' , JSON.stringify(data)).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitById({commit}, data) {
    await https.put('/slims/v1/equip_order/submitById' , JSON.stringify(data)).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*async relPurchase({commit}, data) {
    await http.put('/slims/v1/chemical_rel_purchase/' + data.id, {quantity: data.quantity}).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },*/
  async addEquip({commit}, data) { //添加
    await http.post('/slims/v1/equip_order_temp/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*async detailEquip({commit}, id) { //回显
    await http.get('/slims/v1/chemical_rel_purchase/' + id).then(function (resp) {
      commit('LIST', resp);
    });
  },*/
  /*async editChemical({commit}, data) { //编辑提交
    await http.put('/slims/v1/chemical_rel_purchase/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async chemicalPage({commit}, data) {
    await http.post('/slims/v1/chemical_rel_purchase/page', data).then(function (resp) {
      commit('PURCHASE_PAGE', resp);
    });
  },*/
  async chemicalPageTemp({commit}, data) {
    await http.get('/slims/v1/equip_order/getTempList', data).then(function (resp) {
      commit('PURCHASE_PAGE', resp);
    });
  },
  /*async rejectPurchase({commit}, data) { //拒绝提交--删除
    await http.post('/slims/v1/chemical_rel_purchase/reject_'+ data.id+ '?remark='+data.remark).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async endPurchase({commit}, data) { //结束采购单
    await http.post('/slims/v1/chemical_rel_purchase/finish_'+ data.id+'?remark='+data.remark).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async inStockPurchase({commit}, data) { //采购单单个入库
    await http.post('/slims/v1/chemical_rel_purchase/in_stock_'+ data.id,data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //编辑数量要提交的数据
  async changeQuantity({commit}, data) {
    await http.put('/slims/v1/chemical_rel_purchase/'+ data.id+'?quantity='+data.quantity).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },*/
  /*
  * 草稿箱状态*/
  /*获取学生分页列表*/
  // async pageDraft({commit}, data) {
  //   await http.post('/slims/v1/equip_order/applyPage', data).then(function (resp) {
  //     commit('PAGE', resp);
  //   });
  // },
  /*提交*/
  async submitOrderDraft({commit}, groupId) {
    await http.put('/slims/v1/equip_order/submitById?groupId=' + groupId).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitDraft({commit}, data) {
    await https.post('/slims/v1/equip_order/submit',JSON.stringify(data)).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitDrafts({commit}, data) {
    await http.post('/slims/v1/equip_order/submits',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*编辑  详情*/
  async editById({commit}, groupId) {
    await http.post('/slims/v1/equip_order/page',groupId).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async deleteById({commit}, id) {
    await http.delete('/slims/v1/equip_order/deleteById?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },

  /*已申请状态*/
  async applyPage({commit}, data) {
    await http.post('/slims/v1/equip_order/applyPage', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  //撤回
  async recallOrderByGroupId({commit}, groupId) {
    await http.put('/slims/v1/equip_order/callback?groupId='+groupId).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*删除（草稿和已申请）*/
  async deleteOrderByGroupId({commit}, groupId) {
    await http.delete('/slims/v1/equip_order/?groupId='+groupId).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  /*申请单修改记录*/
  async changeOrderByGroupId({commit}, data) {
    await http.post('/slims/v1/equip_order_flow/page_update_history?groupId='+data.groupId).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  /*申请单修改详情*/
  async changeOrderDetail({commit}, data) {
    await http.post('/slims/v1/equip_order_flow/page',data).then(function (resp) {
      commit('PAGE', resp);
    });
  },


    async add({commit}, data) {
        await http.post('/slims/v1/equip_order/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/equip_order/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
        await http.delete('/slims/v1/equip_order/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async getById({commit}, id) {
        await http.get('/slims/v1/equip_order/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
    async submit({commit}, ids) {
      await http.post('/slims/v1/equip_order/submit?ids=' + ids).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
    async approve({commit}, data) {
      await http.post('/slims/v1/equip_order/approve/' + data.id, data).then(function (resp) {
        commit('SUCCESS', resp);
      });
    },
  //仪器预约记录
    async getRecordById({commit}, data) {
      await http.post('/slims/v1/equip_order/page', data).then(function (resp) {
        commit('PAGE', resp);
      });
    },
  /*//仪器预约记录
  async getRecordById({commit}, data) {
    await http.post('/slims/v1/equip_order/getOrderByEquipPage', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },*/

  async abolish({commit}, ids) {
    await http.post('/slims/v1/equip_order/abolish_use/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async orderFinishSubmit({commit}, ids) {
    await http.post('/slims/v1/equip_order/submit_use/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async startUse({commit}, data) {
    await http.post('/slims/v1/equip_order/start_use',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async endUse({commit}, data) {
    await http.post('/slims/v1/equip_order/end_use',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async queryPage({commit}, data) {
    await http.post('/slims/v1/equip_order/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //仪器申请首页
  async equipApplyPage({commit}) {
    await http.post('/slims/v1/equip_order/auditPage?page=1&rows=10&status=TECHNOLOGY_CHECK').then(function (resp) {
      commit('PAGE', resp);
    });
  },
};

const mutations = {
    PAGE(state, resp) {
        state.page = resp;
    },
    GET_BY_ID(state, resp) {
        state.model = resp;
    },
    SUCCESS(state, resp) {
        state.success = resp;
    },
    PURCHASE_PAGE(state, resp) {
      state.purchasePage = resp;
    },

    LIST(state, resp) {
      state.list = resp;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
