<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <div style="display: flex;">
        <search-box :keyword.sync="keyword" @handleSearchClick="subjectList" @handleClearInput="subjectList" />
      </div>
      <div v-if="checkPermission(['subject_add_edit'])" class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" :disabled="loading" @click="handleCreateSubjectClick">
          添加受试者
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
        <el-table-column label="受试者姓名" prop="name" min-width="100" />
        <el-table-column label="年龄" prop="age" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.age | getAge }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="sex" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.sex === '1' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="签署知情同意书日期" prop="signedDate" min-width="140">
          <template slot-scope="scope">
            <span v-if="scope.row.signedDate" style="margin-left: 10px">{{
              scope.row.signedDate | parseTime('{y}-{m}-{d}')
            }}</span>
            <span v-else>
              无
            </span>
          </template>
        </el-table-column>
        <!-- 签署知情 筛选成功 筛选失败  已入组 -->
        <el-table-column label="受试者状态" prop="status" min-width="140">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="date" min-width="140">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.date | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status !== 'screen' && checkPermission(['subject_add_edit'])"
              type="text"
              @click="handleEditClick(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 'sign' && checkPermission(['subject_sieve'])"
              type="text"
              @click="handleScreeningClick(scope.row)"
            >
              筛选
            </el-button>
            <el-button
              v-if="scope.row.status === 'screen' && checkPermission(['subject_enrollment'])"
              type="text"
              @click="handleOperationClick(scope.row, 'enrolled')"
            >
              入组
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="subjectList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <study-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handleStudyDialogSubmitClick"
    />
  </div>
</template>

<script>
import page from '@st/mixin/page.js';
import search from '@st/mixin/search.js';
import mixin from '../mixin/index.js';
import StudyDialog from './components/SubjectDialog.vue';

const tableName = 'subject';

export default {
  name: 'StudySubject',
  components: { StudyDialog },
  filters: {
    getAge(birthTimestamp) {
      const now = new Date();
      const birthDate = new Date(birthTimestamp);
      const age = now.getFullYear() - birthDate.getFullYear();
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
        return age - 1;
      }
      return age;
    },
    getStatus(status) {
      const statusOptions = [
        { label: '待签署知情', value: 'pending' },
        { label: '签署知情', value: 'sign' },
        { label: '筛选成功', value: 'screen' },
        { label: '筛选失败', value: 'screenFail' },
        { label: '已入组', value: 'enrolled' },
        { label: '已入组失败', value: 'enrollingFail' },
      ];
      return statusOptions.find((f) => f.value === status).label;
    },
  },
  mixins: [page, search, mixin],
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
      loading: true,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    requestApi() {
      this.subjectList();
    },

    subjectList() {
      this.loading = true;
      const paramet = {
        tableName: 'subject',
        conditions: [{ fieldName: 'studyId', fieldValue: this.studyId }],
        ...this.pagination,
      };

      if (this.keyword) {
        paramet.conditions = [{ fieldName: 'name', fieldValue: this.keyword }, ...paramet.conditions];
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
    handleCreateSubjectClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建受试者';
    },

    // 筛选
    handleScreeningClick({ id }) {
      this.$router.push({ name: 'SubjectCriyeria', query: { id, studyId: this.studyId } });
    },
    // 表单操作
    handleEditClick(row) {
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = '编辑受试者';
    },

    // 删除操作
    handleDelectClick(row) {
      const { name, id } = row;
      this.$confirm(`是否删除${name}项目 是否继续？`, { type: 'warning' })
        .then(() => {
          this.$post(this.urls.mdb.delete, { tableName, id })
            .then(() => {
              this.subjectList();
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
      data.studyId = this.studyId;
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.subjectList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
    // 操作
    handleOperationClick({ id }, status) {
      this.$post(this.urls.mdb.save, { tableName, data: { id, status } })
        .then(() => {
          this.subjectList();
          this.$message.success('操作成功');
        })
        .catch(() => {});
    },
  },
};
</script>
