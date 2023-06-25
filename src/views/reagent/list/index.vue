<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="reagentList" @handleClearInput="reagentList" />
      <div class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" :disabled="loading" @click="handleCreateStudyClick">
          添加试剂
        </el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="试剂名称" prop="name" min-width="100" />
        <el-table-column label="生产厂家" prop="producer" min-width="100" />
        <el-table-column label="规格" prop="specification" min-width="100" />
        <el-table-column label="批号" prop="batchNumber" min-width="100" />
        <el-table-column label="失效时间" prop="failureTime" min-width="100">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.failureTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="reagentList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <reagent-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleStudyDialogSubmitClick"
    />
  </div>
</template>

<script>
import ReagentDialog from './components/ListDialog.vue';
import page from '@st/mixin/page';
import search from '@st/mixin/search';

const tableName = 'reagent';

export default {
  name: 'Reagent',
  components: { ReagentDialog },
  filters: {},
  mixins: [page, search],
  props: {
    info: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      studyData: [],
      studyId: null,
      tableData: [],
      // create-dialog
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      // loading
      loading: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.reagentList();
  },
  methods: {
    reagentList() {
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
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },

    // 创建弹窗
    handleCreateStudyClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '添加试剂';
    },

    // 表单操作
    handleEditClick(row) {
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = '编辑试剂';
    },

    // 弹窗确定事件接口
    handleStudyDialogSubmitClick(data) {
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.reagentList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
