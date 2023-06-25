const files = import.meta.glob('./modules/*.js');

export default {
  install(Vue) {
    const keys = Object.keys(files);
    keys.forEach((key) => {
      files[key]().then((res) => {
        const fileName = [key.replace(/^\.\/modules\/(.*)\.\w+$/, '$1')][0];
        Vue.directive(fileName, res.default);
      });
    });
  },
};
