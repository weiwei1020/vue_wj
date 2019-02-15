/**
 * 相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  list:{},
  item:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/dict/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //根据分类查询（仪器）
  async getItem({commit}, data) {
    await http.get('/slims/v1/equip_info/search/'+data).then(function (resp) {
      commit('ITEM', resp);
    });
  },
  //根据分类查询（耗材）
/*
  async getItems({commit}, data) {
    await http.get('/slims/v1/chemical/search/'+data).then(function (resp) {
      commit('ITEM', resp);
    });
  },
*/

  async getTypeItem({commit}) {
    await http.get('/slims/v1/dict/dict_type_no_repeat').then(function (resp) {
      commit('ITEM', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/dict/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/dict/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/dict/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/dict/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async list({commit}, data) {
    await http.post('/slims/v1/dict/list', data).then(function (resp) {
      commit('LIST', resp);
    });
  },

};

const mutations = {
  PAGE(state, resp) {
    state.page = resp;
  },
  ITEM(state, resp) {
    state.item = resp;
  },
  GET_BY_ID(state, resp) {
    state.model = resp;
  },
  SUCCESS(state, resp) {
    state.success = resp;
  },
  LIST(state, resp) {
    state.list = resp;
  }
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
