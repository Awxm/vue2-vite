<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="studyList" @handleClearInput="studyList" />
      <div class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleCreateStudyClick">添加项目</el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="项目名称" prop="name" min-width="268" />
        <el-table-column label="项目描述" prop="description" min-width="268" />
        <el-table-column label="负责人" prop="person" min-width="100" />
        <el-table-column label="项目状态" prop="status" min-width="100" />
        <el-table-column label="开始时间" prop="startTime" min-width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.startTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="endTime" min-width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.endTime | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelectClick(scope.row)">删除</el-button>
            <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
            <el-button type="text" @click="handlePersonnelClick(scope.row)">人员管理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination :request="studyList" :page.sync="pagination.page" :pageSize.sync="pagination.pageSize" :total="total" />
    <study-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleStudyDialogSubmitClick"
    />
  </div>
</template>

<script>
import StudyDialog from './components/StudyDialog.vue';
import page from '@st/mixin/page';
import search from '@st/mixin/search';

const tableName = 'study';

export default {
  name: 'StudyInfo',
  components: { StudyDialog },
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
      tableData: [],
      // create-dialog
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      // loading
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.studyList();
  },
  methods: {
    // 项目
    studyList() {
      this.loading = true;
      const paramet = { tableName, conditions: [], ...this.pagination };
      if (this.keyword) {
        paramet.conditions = [{ fieldName: 'name', fieldValue: this.keyword }];
      }
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },

    peronnelList() {
      this.loading = true;
      const paramet = { tableName, conditions: [], ...this.pagination };
      paramet.conditions = [{ fieldName: 'studyId', fieldValue: this.$route.query.id }];

      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.roleTableData = data;
        })
        .catch(() => {});
    },

    // 创建弹窗
    handleCreateStudyClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建项目';
    },

    // 表单操作
    handleEditClick(row) {
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = '编辑项目';
    },
    handlePersonnelClick(row) {
      this.$router.push({ name: 'StudyPeronnel', query: { id: row.id } });
    },
    // 删除操作
    handleDelectClick(row) {
      const { name, id } = row;
      this.$confirm(`是否删除${name}项目 是否继续？`, { type: 'warning' })
        .then(() => {
          this.$post(this.urls.mdb.delete, { tableName, id })
            .then(() => {
              this.studyList();
              this.$message.success('操作成功');
            })
            .catch(() => {});
        })
        .catch(() => {});
    },

    // 弹窗确定事件接口
    handleStudyDialogSubmitClick(data) {
      // const { nickname, username, phone, email, id, password, date } = paramet;
      // const data = { nickname, username, phone, email, id, date };
      // if (this.dialogType === 'create') data.password = password;
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.studyList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
