import { post } from '@/https/request';
import urls from '@/https/urls';
import { resetRouter } from '@/router';

const state = {
  auid: null,
  nickname: null,
  name: null,
  phone: null,
  avatar: null,
  token: null,
  info: {},
  roles: [],
};

const mutations = {
  SET_AUID: (state, auid) => {
    state.auid = auid;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_NICKNAME: (state, nickname) => {
    state.nickname = nickname;
  },
  SET_PHONE: (state, phone) => {
    state.phone = phone;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
};

const actions = {
  // user login
  login({ commit }, loginForm) {
    return new Promise((resolve, reject) => {
      const { username, password } = loginForm;
      commit('SET_AUID', '1');
      commit('SET_TOKEN', '1');
      resolve();
      // post(urls.user.login, { username: username.trim(), password })
      //   .then((response) => {
      //     const {
      //       userInfo: { id },
      //     } = response;
      //     commit('SET_AUID', id);
      //     commit('SET_TOKEN', id);
      //     resolve();
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const avatarUrl = 'https://img0.baidu.com/it/u=3950247347,4044272545&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400';
      const response = { id: '12', username: 'username', nickname: 'nickname', phone: '18172348119', avatarUrl };
      commit('SET_AUID', '12');
      commit('SET_NAME', 'username');
      commit('SET_NICKNAME', 'nickname');
      commit('SET_PHONE', '18172348119');
      commit('SET_AVATAR', avatarUrl);
      commit('SET_ROLES', ['admin']);
      resolve({ ...response, roles: ['admin'] });
      // post(urls.mdb.getOne, { tableName: 'user', id: state.auid })
      //   .then((response) => {
      //     const { username, nickname, phone, id } = response;
      //     const avatarUrl =
      //       'https://img0.baidu.com/it/u=3950247347,4044272545&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=400';
      //     commit('SET_AUID', id);
      //     commit('SET_NAME', username);
      //     commit('SET_NICKNAME', nickname);
      //     commit('SET_PHONE', phone);
      //     commit('SET_AVATAR', avatarUrl);

      //     post(urls.user.query_user_permission, { username: 'euser', id: state.auid })
      //       .then((ROLES) => {
      //         commit('SET_ROLES', ROLES);
      //         resolve({ ...response, roles: ROLES });
      //       })
      //       .catch((error) => {
      //         reject(error);
      //       });
      //   })
      //   .catch((error) => {
      //     reject(error);
      //   });
    });
  },

  // user logout
  logout({ commit, dispatch }) {
    return new Promise((resolve) => {
      commit('SET_AUID', '');
      commit('SET_ROLES', []);
      resetRouter();
      // reset visited views and cached views
      // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
      dispatch('tagsView/delAllViews', null, { root: true });
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      commit('SET_AUID', null);
      commit('SET_ROLES', []);
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
