<template>
  <div class="ms-search-box">
    <el-input
      v-model="inputVal"
      :placeholder="placeholder"
      class="input-with-select"
      clearable
      @input="handleInput"
      @clear="handleClearInput"
    >
      <el-select
        v-if="isSelect"
        slot="prepend"
        v-model="search.order"
        placeholder="请选择"
        clearable
        @clear="handleClearSelect"
      >
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="handleSearchClick" />
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'SearchBox',
  components: {},
  filters: {},
  props: {
    // 是否选择框
    isSelect: {
      type: Boolean,
      default: false,
    },
    keyword: {
      type: [String, Number],
      default: null,
    },
    placeholder: {
      type: String,
      default: '请输入搜索内容',
    },
    options: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: {
        order: null,
      },
      inputVal: null,
    };
  },
  computed: {},
  watch: {
    keyword: {
      handler(val) {
        this.inputVal = val;
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  destroyed() {},
  methods: {
    // 输入框
    handleInput(value) {
      this.$emit('update:keyword', value);
    },
    handleClearInput() {
      this.$emit('handleClearInput');
    },
    // 清除搜索框
    handleClearSelect() {
      this.search.order = null;
      this.$emit('clearSelect');
    },
    handleSearchClick() {
      this.$emit('handleSearchClick');
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 500px;

  ::v-deep .el-select .el-input {
    width: 130px;
  }

  ::v-deep .input-with-select .el-input-group__prepend {
    background-color: #fff;
  }
}
</style>
