const mixin = {
  data() {
    return {
      pagination: {
        page: 1,
        pageSize: 10,
        order: null,
        sortBy: null,
      },
      total: 0,
    };
  },
  created() {
    const { page } = this.$route.query;
    if (page) this.pagination.page = Number(page);
  },
  mounted() {},
  methods: {
    handleSortChange({ prop, order: sort }, callback) {
      let sortBy = prop;
      let order = null;
      if (sort === 'descending') order = 'desc';
      else if (sort === 'ascending') order = 'asc';
      else sortBy = null;
      this.pagination.sortBy = sortBy;
      this.pagination.order = order;
      callback();
    },
  },
};
export default mixin;
