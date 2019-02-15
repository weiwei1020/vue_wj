/**
 * 不符合项登记相关
 */
import {http} from '../../../api/http'

const state = {
  success: false,
  model: {},
  page: {},
  fileList:{},
};

const actions = {
  async page({commit}, data) {
    await http.post('/slims/v1/frame_unconform_register/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async add({commit}, data) {
    await http.post('/slims/v1/frame_unconform_register/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async edit({commit}, data) {
    await http.put('/slims/v1/frame_unconform_register/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async deleteByIds({commit}, ids) {
    await http.delete('/slims/v1/frame_unconform_register/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async getById({commit}, id) {
    await http.get('/slims/v1/frame_unconform_register/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },

  async getTemp({commit}) {
    await http.get('/slims/v1/frame_unconform_register/getTemp/').then(function (resp) {
      commit('FILE_LIST', resp);
    });
  },
  async deleteFileById({commit}, id) {
    await http.delete('/slims/v1/frame_unconform_register/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async submitByIds({commit}, ids) {
    await http.post('/slims/v1/frame_unconform_register/submit/?id=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async approve({commit}, data) {
    await http.post('/slims/v1/frame_unconform_register/approve/' + data.id + '?audit=' + data.audit +
      '&reason='+data.reason+'&status='+data.status).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pageRecord({commit}, data) {
    await http.post('/slims/v1/frame_unconform_register_record/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  /*************流程************/
  async improvePage({commit}, data) {
    await http.post('/slims/v1/frame_unconform_improve/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async improveAdd({commit}, data) {
    await http.post('/slims/v1/frame_unconform_improve/', data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async improveEdit({commit}, data) {
    await http.put('/slims/v1/frame_unconform_improve/' + data.id, data.obj).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async improveDeleteByIds({commit}, ids) {
    await http.delete('/slims/v1/frame_unconform_improve/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async improveGetById({commit}, id) {
    await http.get('/slims/v1/frame_unconform_improve/' + id).then(function (resp) {
      commit('GET_BY_ID', resp);
    });
  },
  async improveGetTemp({commit}) {
    await http.get('/slims/v1/frame_unconform_improve/getTemp/').then(function (resp) {
      commit('FILE_LIST', resp);
    });
  },
  async improveDeleteFileById({commit}, id) {
    await http.delete('/slims/v1/frame_unconform_improve/deleteFile/?id=' + id).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async improveSubmitByIds({commit}, ids) {
    await http.post('/slims/v1/frame_unconform_improve/submit/?ids=' + ids).then(function (resp) {
      commit('SUCCESS', resp);
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
  FILE_LIST(state,resp){
    state.fileList=resp;
  },
};

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
