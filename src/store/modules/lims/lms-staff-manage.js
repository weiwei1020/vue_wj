/**
 * 实验管理
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
};
const actions = {
  async page({commit}, data) {
      await http.post('/slims/v1/staff_test/page_test', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  async startByIds({commit}, ids) {
    await http.put('/slims/v1/staff_test/status/' + ids+'?status=1').then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async pauseByIds({commit}, ids) {
    await http.put('/slims/v1/staff_test/status/' + ids+'?status=2').then(function (resp) {
      commit('SUCCESS', resp);
    });
  }, async suspendByIds({commit}, ids) {
    await http.put('/slims/v1/staff_test/status/' + ids+'?status=3').then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async finishByIds({commit}, ids) {
    await http.put('/slims/v1/staff_test/status/' + ids+'?status=4').then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  async process({commit}, data) {
    await http.put('/slims/v1/staff_process/',data).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },


    async add({commit}, data) {
        await http.post('/slims/v1/staff_plan/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async edit({commit}, data) {
        await http.put('/slims/v1/staff_plan/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
    async deleteByIds({commit}, ids) {
        await http.delete('/slims/v1/staff_plan/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },



    async getById({commit}, id) {
        await http.get('/slims/v1/staff_plan/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
  //年度计划查询列表
    async  list({commit}, data) {
      await http.post('/slims/v1/staff_plan/list', data).then(function (resp) {
        commit('LIST', resp);
      });
    },
    async getTreeKeyword({commit},data) {
      await http.post('/slims/v1/staff_plan/list?projectName='+data).then(function (resp) {
        commit('LIST', resp);
      });
    },
  //附件
  async filePage({commit},data) {
    await http.post('/slims/v1/staff_plan_attachment/page',data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //根据id查询
  async getFileById({commit},id) {
    await http.post('/slims/v1/staff_plan_attachment/page/' + id).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //删除附件
  async deleteFileByIds({commit},ids) {
    await http.delete('/slims/v1/staff_plan_attachment/?ids='+ ids).then(function (resp) {
      commit('SUCCESS', resp);
    });
  },
  //实验修改记录
  async testChange({commit},data) {
    await http.post('/slims/v1/staff_history_operation/page', data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  //实验修改记录byID
  async testChangeById({commit},data) {
    await http.post('/slims/v1/staff_test_history/page',data).then(function (resp) {
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
