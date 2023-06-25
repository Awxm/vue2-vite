const mixin = {
  data() {
    return {
      keyword: null,
    };
  },
  created() {},
  mounted() {},
  methods: {
    // 查询
    handleSearchClick(value, callback) {
      this.pagination.page = 1;
      callback();
    },
    handleClearInput(value, callback) {
      this.pagination.page = 1;
      callback();
    },
  },
};
export default mixin;
