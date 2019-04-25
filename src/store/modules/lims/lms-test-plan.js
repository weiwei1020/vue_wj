/**
 * 实验管理
 */
import {http} from '../../../api/http'

const state = {
    success: false,
    model: {},
    page: {},
    list:{},
  orgList: {},

};
//项目page
const actions = {
  async page({commit}, data) {
      await http.post('/project/page', data).then(function (resp) {
            commit('PAGE', resp);
        });
    },
  //项目添加
    async add({commit}, data) {
        await http.post('/slims/v1/staff_plan/', data).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
  //项目编辑
    async edit({commit}, data) {
        await http.put('/slims/v1/staff_plan/' + data.id, data.obj).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
  //根据id删除
    async deleteByIds({commit}, ids) {
        await http.delete('/slims/v1/staff_plan/?ids=' + ids).then(function (resp) {
            commit('SUCCESS', resp);
        });
    },
  //根据id查询
    async getById({commit}, id) {
        await http.get('/slims/v1/staff_plan/' + id).then(function (resp) {
            commit('GET_BY_ID', resp);
        });
    },
  //项目查询列表
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
  // //实验修改记录byID
  // async testChangeById({commit},data) {
  //   await http.post('/slims/v1/staff_test_history/page', data).then(function (resp) {
  //     commit('PAGE', resp);
  //   });
  // },
  //获取所有人员
  async orgTreeList({commit}, data) { //组织树
    await http.post('/base/v1/org/org_tree', data).then(function (resp) {
      commit('ORG_TREE', resp);
    });
  },

  async getUser({commit},data) {
    await http.post('/base/v1/user/list',data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async addUser({commit},data) {
    await http.post('/base/v1/user/page_org',data).then(function (resp) {
      commit('PAGE', resp);
    });
  },
  async delUser({commit},data) {
    await http.post('/base/v1/user/page_org',data).then(function (resp) {
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
  ORG_TREE(state, resp) {
    state.orglist = resp;
  },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}
