const getters = {
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  auid: (state) => state.user.auid,
  name: (state) => state.user.name,
  nickname: (state) => state.user.nickname,
  roles: (state) => state.user.roles,
  studyName: (state) => state.study.studyName,
  studyId: (state) => state.study.studyId,
  permission_routes: (state) => state.permission.routes,
  dataDictionarty_module: (state) => state.dataDictionarty.dataDictionarty_module,
  dataDictionarty_code: (state) => state.dataDictionarty.dataDictionarty_code,
};
export default getters;
