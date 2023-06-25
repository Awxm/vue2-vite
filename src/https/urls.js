const urls = {
  mdb: {
    save: null,
    query: null,
    getOne: null,
    delete: null,
  },
  user: {
    login: null,
    query_user_permission: null,
  },
};

const keys = Object.keys(urls);
keys.forEach((key) => {
  const clidKeys = Object.keys(urls[key]);
  clidKeys.forEach((clidKey) => {
    if (urls[key][clidKey]) {
      urls[key][clidKey] = `${key}/${urls[key][clidKey]}`;
    } else {
      urls[key][clidKey] = `${key}/${clidKey}`;
    }
  });
});

export default urls;
