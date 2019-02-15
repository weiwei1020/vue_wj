/**
 * 订单管理相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  detail:'',
  fileList:{},
};

const actions = {
  //订单管理
  async page({commit}, data) {
    await http.post('/slims/v1/chemical_order_supplier/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //批量接单
  async receiveByIds({commit}, ids) {
    await http.post('/slims/v1/chemical_order_supplier/order_receipt/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //批量拒单
  async refuseByIds({commit}, ids) {
    await http.post('/slims/v1/chemical_order_supplier/order_refuse/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //拒单
  async refuse({commit}, data) {
    await http.post('/slims/v1/chemical_order_supplier/order_refuse/?ids=' + data.ids,data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //备货单管理
  async pagePick({commit}, data) {
    await http.post('/slims/v1/equip_purchase/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //批量发货
  async deliverByIds({commit}, ids) {
    await http.post('/slims/v1/equip_purchase/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //历史记录
  async pageHistory({commit}, data) {
    await http.post('/slims/v1/chemical_order_supplier/page_history', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async submit({commit}, ids) {
    await http.post('/slims/v1/equip_purchase/submit?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/equip_purchase/approve/' + data.id, data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async addDetail({commit}, data) {
    await http.post('/slims/v1/equip_purchase/addDetail/', data).then(function (resp) {
      commit('DETAIL', resp);
    });
  },
  async getTemp({commit}) {
    await http.get('/slims/v1/equip_purchase/getTemp/').then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async getFileList({commit},data) {
    await http.post('/slims/v1/equip_file/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async deleteFileById({commit}, id) {
    await http.delete('/slims/v1/equip_purchase/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  DETAIL(state, resp) {
    state.detail = resp;
  },
  LIST(state, resp){
    state.fileList = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
