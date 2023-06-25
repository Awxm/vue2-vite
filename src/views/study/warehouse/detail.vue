<template>
  <div class="app-container zh-detail">
    <div class="zh-detail-filter">
      <div></div>
      <el-button size="small" type="primary" @click="handleDialogCreateClick">创建出入库记录</el-button>
    </div>
    <div class="zh-detail-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="登记日期" prop="date" min-width="120">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.registerTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出库数量" prop="delivered" min-width="100" />
        <el-table-column label="库存数量" prop="inventory" min-width="100" />
        <el-table-column label="操作者" prop="operator" min-width="100" />
        <el-table-column label="管理者" prop="manager" min-width="100" />
        <el-table-column label="使用数量" prop="quantity" min-width="100" />
        <el-table-column label="入库数量" prop="receipt" min-width="100" />
        <el-table-column label="库存数量" prop="receiptInventory" min-width="100" />
        <el-table-column label="操作者" prop="receiptOperator" min-width="100" />
        <el-table-column label="管理者" prop="receiptManager" min-width="100" />
        <el-table-column label="备注" prop="remark" min-width="100" />
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogEditClick(scope.row, scope.$index)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <detail-dialog
      :dialog.sync="dialog"
      :formData.sync="formData"
      :title="title"
      @handleSubmitClick="handleDialogSubmitClick"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import DetailDialog from './components/detailDialog';

const tableName = 'wrehouse';
export default {
  name: 'Detail',
  components: { DetailDialog },
  filters: {},
  mixins: [],
  props: {},
  data() {
    return {
      wrehouse: { list: [] },
      // 弹窗
      dialog: false,
      dialogType: null,
      formData: null,
      title: null,
      index: 0,
      // loading
      loading: true,
      time: null,
    };
  },
  computed: {
    tableData() {
      return this.wrehouse.list;
    },
  },
  watch: {},
  created() {},
  mounted() {
    this.wrehouseInfo();
  },
  methods: {
    wrehouseInfo() {
      this.loading = true;
      const paramet = { tableName, id: this.$route.query.id };
      if (this.keyword) {
        paramet.conditions = [{ fieldName: 'name', fieldValue: this.keyword }, ...paramet.conditions];
      }

      this.$post(this.urls.mdb.getOne, paramet).then((data) => {
        if (this.time) clearTimeout(this.time);
        this.time = setTimeout(() => {
          this.wrehouse = data;
          this.loading = false;
        }, 500);
      });
    },
    // 弹窗事件
    handleDialogCreateClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建';
      this.index = 0;
    },
    handleDialogEditClick(row, index) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑';
      this.index = index;
    },
    handleDialogSubmitClick(tableData) {
      const list = _.cloneDeep(this.tableData);
      let message = null;
      let i = 0;
      let index = 0;
      if (this.dialogType === 'create') {
        message = '创建成功';
        i = 0;
        index = list.length - 1;
      } else {
        message = '编辑成功';
        i = 1;
        index = this.index;
      }
      list.splice(index, i, tableData);
      this.$post(this.urls.mdb.save, {
        tableName,
        data: { id: this.$route.query.id, list },
      })
        .then(() => {
          this.wrehouseInfo();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.zh-detail {
  &-filter {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &-table {
    margin: 20px 0;
  }
}
</style>
