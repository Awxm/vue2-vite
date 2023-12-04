<template>
  <div class="app-container ms-transport">
    <div class="ms-transport-filter">
      <search-box
        :keyword.sync="keyword"
        @handleSearchClick="handleSearchClick(transportList)"
        @handleClearInput="handleClearInput(transportList)"
      />
      <el-button size="small" type="primary" @click="handleDialogCreateClick">创建交接记录</el-button>
    </div>
    <div class="ms-transport-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column prop="startPoint" label="开始地点" min-width="180" />
        <el-table-column prop="endPoint" label="截止地点" min-width="100" />
        <el-table-column prop="packingTime" label="装箱时间" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.packingTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="packingTemperature" label="装箱温度" min-width="80" />
        <el-table-column prop="boxer" label="装箱者" min-width="100" />
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogEditClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDialogAddReagentClick(scope.row)">添加试剂</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="transportList"
      :page.sync="pagination.page"
      :page-size.sync="pagination.pageSize"
      :total="total"
    />
    <transport-dialog
      :dialog.sync="dialog"
      :form-data.sync="formData"
      :title="title"
      @handleSubmitClick="handleDialogSubmitClick"
    />
    <transport-reagent-dialog
      :dialog.sync="reagentDialog"
      :table-data="reagentRow.reagent"
      :reagent-data.sync="reagentData"
      @handleRecycleCreateClick="handleRecycleCreateClick"
      @handleSubmitClick="handleReagentDialogSubmitClick"
    />
  </div>
</template>

<script>
import search from '@st/mixin/search.js';
import page from '@/static/mixin/page.js';
import TransportDialog from './components/TransportDialog.vue';
import TransportReagentDialog from './components/TransportReagentDialog.vue';

const tableName = 'transport';

export default {
  name: 'Transport',
  components: { TransportDialog, TransportReagentDialog },
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
    this.transportList();
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
    transportList() {
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
      this.title = '创建运输交接记录';
    },
    handleDialogEditClick(row) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑运输交接记录';
    },

    handleDialogAddReagentClick(row) {
      this.reagentDialog = true;
      this.reagentRow = row;
    },

    handleDialogSubmitClick(data) {
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.transportList();
          this.$message.success(message);
        })
        .catch(() => {});
    },

    handleReagentDialogSubmitClick(table) {
      const data = { ...this.reagentRow, reagent: table };
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.transportList();
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
.ms-transport {
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
