const state = {
  studyId: null,
  studyName: null,
};

const mutations = {
  SET_STUDY: (state, { key, value }) => {
    state[key] = value;
  },
};

const actions = {
  info({ commit }, data) {
    commit('SET_STUDY', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
