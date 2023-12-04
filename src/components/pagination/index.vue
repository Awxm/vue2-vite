<template>
  <el-pagination
    layout="total,prev, pager, next, jumper,sizes"
    :current-page.sync="pagination.page"
    :page-size="pagination.pageSize"
    :page-sizes="pageSizes"
    :total="total"
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'Pagination',
  components: {},
  filters: {},
  props: {
    page: {
      type: Number,
      default: 1,
    },
    pageSize: {
      type: Number,
      default: 10,
    },
    pageSizes: {
      type: Array,
      default: () => [10, 20, 50],
    },
    total: {
      type: Number,
      default: 0,
    },
    request: {
      type: Function,
      default() {},
    },
    isRouter: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pagination: {
        page: this.page,
        pageSize: this.pageSize,
      },
    };
  },
  computed: {},
  watch: {
    page(val) {
      this.pagination.page = val;
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleCurrentChange(page) {
      this.pagination.page = page;
      if (this.isRouter) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page,
          },
        });
      }
      this.$emit('update:page', page);
      this.request();
    },
    handleSizeChange(pageSize) {
      this.pagination.page = 1;
      this.pagination.pageSize = pageSize;
      if (this.isRouter) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            page: 1,
          },
        });
      }
      this.$emit('update:page', 1);
      this.$emit('update:pageSize', pageSize);
      this.request();
    },
  },
};
</script>
<style lang="scss" scoped>
.el-pagination {
  text-align: right;
}
</style>
