import defaultSettings from '@/settings';

const { title, fixedHeader, logo } = defaultSettings;

const state = {
  title,
  fixedHeader,
  logo,
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    state[key] = value;
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
