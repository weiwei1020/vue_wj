/**
 * 相关
 */
import {http} from '../../../api/http'
import {https} from "../../../api/https";

const state = {
  success: false,
  model: {},
  list:{},
  result:{},
  page: {}
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/component_flow/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/component_flow/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/component_flow/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/component_flow/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/component_flow/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async saveContract({commit}, data) {
    let dto={};
    dto.flows=data.list;
    await https.post('/slims/v1/component_flow/save_configure_flow?companyId=' + data.companyId, JSON.stringify(dto)).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async saveItem({commit}, data) {
    let itemDto={};
    itemDto.flows=data.list;
    await https.post('/slims/v1/component_flow/save_item_configure_flow?companyId=' + data.companyId, JSON.stringify(itemDto)).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async flowOption({commit}, data) {
    await http.post('/slims/v1/component_flow/env_contract_flow_option', data).then(function (resp) {
      commit('LIST', resp);
    });
  },
  async flowResult({commit}, data) {
    await http.post('/slims/v1/component_flow/env_contract_flow_result', data).then(function (resp) {
      commit('RESULT', resp);
    });
  },

};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  LIST(state, resp) {
    state.list = resp;
  },
  RESULT(state, resp) {
    state.result = resp;
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
