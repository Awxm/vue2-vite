<template>
  <div class="table-container">
    <el-table ref="table" v-loading="loading" :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column prop="introduction" label="描述">
        <template v-slot="scope">
          <div style="white-space: pre-wrap" v-html="scope.row.introduction"></div>
        </template>
      </el-table-column>
      <el-table-column v-if="isEdit" label="操作" width="120px">
        <template v-slot="scope">
          <el-button type="text" @click="handleEditClick(scope.row, scope.$index)">
            编辑
          </el-button>
          <el-button type="text" @click="handleDelClick(scope.row, scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <el-table-column v-if="isOperation" width="300" align="right">
        <template #header>
          <span class="conform">全部</span>
          <el-radio-group v-model="radio" @change="handleRadioChange">
            <el-radio :label="1"> 是 </el-radio>
            <el-radio :label="0"> 否 </el-radio>
          </el-radio-group>
        </template>
        <!--插槽-->
        <template v-slot="scope">
          <el-radio-group v-model="scope.row.conform" @change="handleRadioChildClick">
            <el-radio :label="1">
              <span></span>
            </el-radio>
            <el-radio :label="0">
              <span></span>
            </el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
//   const filterList0 = list.every((item) => item.conform === 0);
export default {
  name: 'ScreeningTable',
  components: {},
  filters: {},
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    isOperation: {
      type: Boolean,
      default: false,
    },
    isEdit: {
      type: Boolean,
      default: true,
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      radio: null,
    };
  },
  computed: {
    // 所有都是1 0
    radioValue() {
      let one = true;
      let zero = true;
      let value = null;
      for (let index = 0; index < this.tableData.length; index++) {
        const { conform } = this.tableData[index];
        if (conform !== 0) zero = false;
        if (conform !== 1) one = false;
      }
      if (one) value = 1;
      if (zero) value = 0;
      return value;
    },
  },
  watch: {
    radioValue(value) {
      this.radio = value;
    },
  },
  created() {},
  mounted() {},
  beforeUpdate() {
    this.$nextTick(() => {
      // 在数据加载完，重新渲染表格
      this.$refs.table.doLayout();
    });
  },
  methods: {
    // headerRadio
    handleRadioChange(radio) {
      this.tableData.forEach((row) => {
        row.conform = radio;
      });
      this.$emit('handleRadioChange', radio);
    },
    handleRadioChildClick(value) {
      this.$emit('handleRadioChildClick', value);
    },
    handleEditClick(row, index) {
      this.$emit('handleEditClick', { row, index });
    },
    handleDelClick(row, index) {
      this.$confirm('是否删除该标准?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$emit('handleDelClick', { row, index });
        })
        .catch(() => {});
    },
    //
  },
};
</script>
<style lang="scss" scoped>
.table-container {
  .conform {
    margin-right: 20px;
  }

  ::v-deep .el-radio__inner {
    width: 16px;
    height: 16px;
  }
}
</style>
