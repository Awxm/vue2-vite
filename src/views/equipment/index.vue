<template>
  <div class="app-container ms-equipment">
    <div class="ms-equipment-filter">
      <search-box
        :keyword.sync="keyword"
        @handleSearchClick="handleSearchClick(equipmentList)"
        @handleClearInput="handleClearInput(equipmentList)"
      />
      <el-button
        v-if="checkPermission(['test_instruments_management'])"
        size="small"
        type="primary"
        @click="handleDialogCreateClick"
      >
        添加仪器
      </el-button>
    </div>
    <div class="ms-equipment-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column prop="name" label="项目名称" min-width="268">
          <template slot-scope="scope">
            <span>{{ scope.row | studyName }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="仪器名称" min-width="120" />
        <el-table-column prop="producer" label="生产厂家" min-width="120" />
        <el-table-column prop="model" label="型号" min-width="120" />
        <el-table-column prop="code" label="注册证编号" min-width="120" />
        <el-table-column prop="serialNumber" label="产品序列号" min-width="100" />
        <el-table-column prop="number" label="数量" min-width="80" />
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span>{{ scope.row.status | getStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="checkPermission(['test_instruments_management'])" fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogEditClick(scope.row)">
              编辑
            </el-button>
            <!-- <el-button
              v-if="['pending', 'maintenance'].includes(scope.row.status)"
              type="text"
              size="small"
              @click="handleOperationClick(scope.row, 'use')"
            >
              使用
            </el-button>
            <el-button
              v-if="scope.row.status === 'use'"
              type="text"
              size="small"
              @click="handleOperationClick(scope.row, 'maintenance')"
            >
              维护
            </el-button> -->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="equipmentList"
      :page.sync="pagination.page"
      :page-size.sync="pagination.pageSize"
      :total="total"
    />
    <equipment-dialog
      :dialog.sync="dialog"
      :form-data.sync="formData"
      :study-data="studyData"
      :title="title"
      @handleSubmitClick="handleDialogSubmitClick"
    />
  </div>
</template>

<script>
import search from '@/static/mixin/search.js';
import page from '@/static/mixin/page.js';
import EquipmentDialog from './components/EquipmentDialog';

const tableName = 'equipment';

export default {
  name: 'Equipment',
  components: { EquipmentDialog },
  filters: {
    studyName(value) {
      const name = value.study.map((m) => m.name);
      return name.toString();
    },
    getStatus(status) {
      const statusOptions = [
        { label: '校验', value: 'pending' },
        { label: '使用', value: 'use' },
        { label: '维护', value: 'maintenance' },
      ];
      return statusOptions.find((f) => f.value === status).label;
    },
  },
  mixins: [page, search],
  props: {},
  data() {
    return {
      studyData: [],
      tableData: [],
      // 弹窗
      dialog: false,
      dialogType: null,
      formData: null,
      title: null,
      // loading
      loading: true,
      time: null,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.studyList();
    this.equipmentList();
  },
  methods: {
    studyList() {
      const paramet = { tableName: 'study', conditions: [] };
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.studyData = data;
          this.sampleList();
          this.subjectList();
        })
        .catch(() => {});
    },
    equipmentList() {
      this.loading = true;
      const paramet = { tableName, conditions: [], ...this.pagination };
      if (this.keyword) {
        paramet.conditions = [
          {
            fieldName: 'name',
            fieldValue: this.keyword,
          },
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
      this.title = '创建仪器';
    },
    handleDialogEditClick(row) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑仪器';
    },
    handleOperationClick({ id }, status) {
      this.$post(this.urls.mdb.save, {
        tableName,
        data: { id, status },
      })
        .then(() => {
          this.equipmentList();
          this.$message.success('操作成功');
        })
        .catch(() => {});
    },
    handleDialogSubmitClick(data) {
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.equipmentList();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-equipment {
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
