<template>
  <div class="app-container ms-transport">
    <div class="ms-transport-filter">
      <search-box
        :keyword.sync="keyword"
        @handleSearchClick="handleSearchClick(wrehouseList)"
        @handleClearInput="handleClearInput(wrehouseList)"
      />
      <el-button size="small" type="primary" @click="handleDialogCreateClick">创建库存信息</el-button>
    </div>
    <div class="ms-transport-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <!-- <el-table-column prop="name" label="项目名称">
          <template slot-scope="scope">
            <span>{{ scope.row.study.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="主要研究者">
          <template slot-scope="scope">
            <span>{{ scope.row.study.person }}</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="name" label="试剂名称">
          <template slot-scope="scope">
            <span>{{ scope.row.reagent.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="试剂类别">
          <template slot-scope="scope">
            <span>{{ scope.row.type }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="position" label="存放位置" />
        <el-table-column prop="temperature" label="存储温度" />
        <el-table-column prop="no" label="设备编号" />
        <el-table-column fixed="right" label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="handleDialogEditClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDialogAddReagentClick(scope.row)">
              登记出入库数量
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="wrehouseList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <warehouse-dialog
      :dialog.sync="dialog"
      :formData.sync="formData"
      :reagentData="reagentData"
      :studyData="studyData"
      :title="title"
      @handleSubmitClick="handleDialogSubmitClick"
    />
  </div>
</template>

<script>
import search from '@st/mixin/search.js';
import page from '@/static/mixin/page.js';
import mixin from '../mixin/index.js';
import WarehouseDialog from './components/WarehouseDialog.vue';

const tableName = 'wrehouse';

export default {
  name: 'Wrehouse',
  components: { WarehouseDialog },
  filters: {},
  mixins: [page, search, mixin],
  props: {},
  data() {
    return {
      studyData: [],
      reagentData: [],
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
  mounted() {},

  methods: {
    requestApi() {
      this.reagentList();
      this.wrehouseList();
    },

    wrehouseList() {
      this.loading = true;
      const paramet = {
        tableName,
        conditions: [{ fieldName: 'studyId', fieldValue: this.studyId }],
        ...this.pagination,
      };
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
          if (this.time) clearTimeout(this.time);
          this.time = setTimeout(() => {
            this.tableData = data;
            this.total = total;
            this.loading = false;
          }, 500);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // 试剂
    reagentList() {
      const paramet = { tableName: 'reagent', conditions: [] };
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.reagentData = data;
        })
        .catch(() => {});
    },

    // 弹窗事件
    handleDialogCreateClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '创建试剂信息';
    },
    handleDialogEditClick(row) {
      this.dialog = true;
      this.formData = row;
      this.dialogType = 'edit';
      this.title = '编辑试剂信息';
    },

    handleDialogAddReagentClick({ id }) {
      this.$router.push({ name: 'StudyWarehouseDetail', query: { id } });
    },

    handleDialogSubmitClick(data) {
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data: { ...data, studyId: this.studyId } })
        .then(() => {
          this.wrehouseList();
          this.$message.success(message);
        })
        .catch(() => {});
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
