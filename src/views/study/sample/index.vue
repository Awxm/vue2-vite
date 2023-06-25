<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <div style="display: flex;">
        <search-box :keyword.sync="keyword" @handleSearchClick="sampleList" @handleClearInput="sampleList" />
      </div>
      <div v-if="checkPermission(['sample_reception'])" class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleCreateSampleClick">添加样本</el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="受试者编号" prop="screeningnNo" min-width="100" />
        <el-table-column label="条形码" prop="barCode" min-width="140" />
        <el-table-column label="性别" prop="sex" min-width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.subject.sex === '1' ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" prop="age" min-width="50">
          <template slot-scope="scope">
            <span>{{ scope.row.subject.age | getAge }}</span>
          </template>
        </el-table-column>
        <el-table-column label="采集日期" prop="collectionDate" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.collectionDate | parseTime('{y}-{m}-{d}') }}</span>
          </template>
        </el-table-column>
        <el-table-column label="临床诊断背景信息" prop="background" min-width="180" />
        <el-table-column label="样本类型" prop="type" min-width="100" />
        <el-table-column label="未入组原因" prop="reason" min-width="180" />
        <el-table-column label="入组编号" prop="no" min-width="140" />
        <el-table-column label="状态" prop="status" min-width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark" min-width="180" />
        <el-table-column label="操作" min-width="220">
          <template slot-scope="scope">
            <el-button
              v-if="['code', 'pending'].includes(scope.row.status) && checkPermission(['sample_reception'])"
              type="text"
              @click="handleEditClick(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.status === 'pending'"
              type="text"
              @click="handleOperationClick(scope.row, 'code') && checkPermission(['sample_code'])"
            >
              编码
            </el-button>
            <el-button
              v-if="scope.row.status === 'code' && checkPermission(['sample_test_operation'])"
              type="text"
              @click="handleOperationClick(scope.row, 'save')"
            >
              入库保存
            </el-button>
            <el-button
              v-if="scope.row.status === 'save' && checkPermission(['sample_unblinding'])"
              type="text"
              @click="handleOperationClick(scope.row, 'destroy')"
            >
              销毁
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="sampleList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <!-- 添加编辑弹窗 -->
    <sample-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      :subjectTableData="subjectTableData"
      @handleSubmitClick="handleDialogSubmitClick"
    />
    <!-- 操作弹窗 -->
    <operation-dialog
      :dialog.sync="operationDialog"
      :title="operationTitle"
      :type="status"
      @handleSubmitClick="handleDialogOperationSubmitClick"
    />
  </div>
</template>

<script>
import page from '@st/mixin/page.js';
import search from '@st/mixin/search.js';
import mixin from '../mixin/index.js';
import SampleDialog from './components/SampleDialog.vue';
import OperationDialog from './components/OperationDialog.vue';

const tableName = 'sample';
const statusOptions = [
  { label: '收集', value: 'pending' },
  { label: '编码', value: 'code' },
  { label: '入库保存', value: 'save' },
  { label: '销毁', value: 'destroy' },
];
export default {
  name: 'Sample',
  components: { SampleDialog, OperationDialog },
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
      subjectTableData: [],
      // create-dialog
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      // operation-dialog
      operationDialog: false,
      operationTitle: null,
      operationType: null,
      id: null,
      status: null,
      // loading
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    requestApi() {
      this.sampleList();
      this.subjectList();
    },

    // 样本列表
    sampleList() {
      this.loading = true;
      const paramet = { tableName, conditions: [], ...this.pagination };
      if (this.studyId) {
        paramet.conditions.push({
          fieldName: 'studyId',
          fieldValue: this.studyId,
        });
      }
      if (this.keyword) {
        paramet.conditions = [{ fieldName: 'screeningnNo', fieldValue: this.keyword }, ...paramet.conditions];
      }
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },
    handleOperationClick({ id, screeningnNo }, status) {
      this.id = id;
      this.status = status;
      if (status === 'destroy') {
        this.$confirm(`是否销毁受试者编号为${screeningnNo}的样本？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.handleDialogOperationSubmitClick();
          })
          .catch(() => {});
      } else {
        this.operationDialog = true;
        this.operationTitle = statusOptions.find((f) => f.value === status).label;
      }
    },
    subjectList() {
      this.loading = true;
      const paramet = { tableName: 'subject', conditions: [] };
      if (this.studyId) {
        paramet.conditions.push({
          fieldName: 'studyId',
          fieldValue: this.studyId,
        });
      }
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.subjectTableData = data;
        })
        .catch(() => {});
    },

    // 创建样本
    handleCreateSampleClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建样本';
    },
    // 表单操作
    handleEditClick(row) {
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = '编辑样本';
    },
    // 编码 入库保存
    handleDialogOperationSubmitClick(form) {
      this.$post(this.urls.mdb.save, { tableName, data: { id: this.id, status: this.status, ...form } })
        .then(() => {
          this.sampleList();
          this.$message.success('操作成功');
        })
        .catch(() => {});
    },
    // 弹窗确定事件接口
    handleDialogSubmitClick(data) {
      // const { nickname, username, phone, email, id, password, date } = paramet;
      // const data = { nickname, username, phone, email, id, date };
      // if (this.dialogType === 'create') data.password = password;
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      data.studyId = this.studyId;
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.sampleList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
