<template>
  <div class="app-container ms-recycle">
    <div class="ms-recycle-filter">
      <search-box
        :keyword.sync="keyword"
        @handleSearchClick="handleSearchClick(recycleList)"
        @handleClearInput="handleClearInput(recycleList)"
      />
      <el-button size="small" type="primary" @click="handleDialogCreateClick">添加回收记录</el-button>
    </div>
    <div class="ms-recycle-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column prop="deliverer" label="送交者" />
        <el-table-column prop="delivererTime" label="送交时间">
          <template slot-scope="scope">
            <span>{{ scope.row.delivererTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="recipient" label="接收者" />
        <el-table-column prop="recipientTime" label="接收时间">
          <template slot-scope="scope">
            <span>{{ scope.row.recipientTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" />
        <el-table-column fixed="right" label="操作" width="140">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogEditClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDialogAddReagentClick(scope.row)">添加试剂</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="recycleList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <recycle-dialog
      :dialog.sync="dialog"
      :formData.sync="formData"
      :title="title"
      @handleSubmitClick="handleDialogSubmitClick"
    />
    <recycle-reagent-dialog
      :dialog.sync="reagentDialog"
      :tableData="reagentRow.reagent"
      :reagentData.sync="reagentData"
      @handleRecycleCreateClick="handleRecycleCreateClick"
      @handleSubmitClick="handleReagentDialogSubmitClick"
    />
  </div>
</template>

<script>
import search from '@st/mixin/search';
import page from '@/static/mixin/page';
import RecycleDialog from './components/RecycleDialog.vue';
import RecycleReagentDialog from './components/RecycleReagentDialog.vue';

const tableName = 'recycle';

export default {
  name: 'ReagentRecycle',
  components: { RecycleDialog, RecycleReagentDialog },
  filters: {},
  mixins: [page, search],
  props: {},
  data() {
    return {
      reagentData: [],
      tableData: [],
      // 弹窗
      dialog: false,
      dialogType: null,
      formData: null,
      title: null,
      // 试剂弹窗
      reagentDialog: false,
      reagentRow: { reagent: [] },
      // loading
      loading: true,
      time: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.reagentList();
    this.recycleList();
  },
  methods: {
    // 试剂
    reagentList() {
      const paramet = { tableName: 'reagent', conditions: [] };
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.reagentData = data;
        })
        .catch(() => {});
    },
    recycleList() {
      this.loading = true;
      const paramet = { tableName, conditions: [], ...this.pagination };
      if (this.keyword) {
        paramet.conditions = [
          {
            fieldName: 'name',
            fieldValue: this.keyword,
          },
          ...paramet.conditions,
        ];
      }
      this.$post(this.urls.mdb.query, paramet).then(({ data, total }) => {
        if (this.time) clearTimeout(this.time);
        this.time = setTimeout(() => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        }, 500);
      });
    },
    // 弹窗事件
    handleDialogCreateClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建回收记录';
    },
    handleDialogEditClick(row) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑回收记录';
    },
    handleDialogAddReagentClick(row) {
      this.reagentDialog = true;
      this.reagentRow = row;
    },
    handleDialogSubmitClick(data) {
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.recycleList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
    handleReagentDialogSubmitClick(table) {
      const data = { ...this.reagentRow, reagent: table };
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.recycleList();
          this.$message.success('保存成功');
        })
        .catch(() => {});
    },
    handleRecycleCreateClick(recycle) {
      this.reagentRow.reagent.push(recycle);
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-recycle {
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
