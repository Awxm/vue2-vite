<template>
  <div class="study-criteria app-container">
    <div class="ad-app-filter">
      <div style="display: flex;"></div>
      <div class="ad-app-filter__operat">
        <el-button
          v-waves
          type="primary"
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreateCriteriaClick('inclusion')"
        >
          添加入组标准
        </el-button>
        <el-button
          v-waves
          type="primary"
          icon="el-icon-plus"
          :disabled="loading"
          @click="handleCreateCriteriaClick('exclusion')"
        >
          添加排除标准
        </el-button>
      </div>
    </div>
    <div class="study-criteria__inclusion">
      <div class="title">入组标准</div>
      <ms-inclusion
        ref="inclusion"
        :table-data="inclusionData"
        @handleEditClick="handleEditCriteriaClick($event, 'inclusion')"
        @handleDelClick="handleDelCriteriaClick($event, 'inclusion')"
      />
    </div>
    <div class="study-criteria__exclusion">
      <div class="title">排除标准</div>
      <ms-inclusion
        ref="exclusion"
        :table-data="exclusionData"
        @handleEditClick="handleEditCriteriaClick($event, 'exclusion')"
        @handleDelClick="handleDelCriteriaClick($event, 'exclusion')"
      />
    </div>
    <criteria-dialog
      :dialog.sync="dialog"
      :title="title"
      :form-data.sync="formData"
      :dialog-type="dialogType"
      @handleSubmitClick="handleCriteriaDialogSubmitClick"
    />
  </div>
</template>

<script>
import mixin from '../mixin/index.js';
import MsInclusion from '@c/screening-table/index.vue';
import CriteriaDialog from './components/CriteriaDialog.vue';

export default {
  name: 'StudyCriteria',
  components: { MsInclusion, CriteriaDialog },
  filters: {},
  mixins: [mixin],
  props: {},
  data() {
    return {
      inclusionData: [],
      exclusionData: [],
      // dialog
      dialog: false,
      title: null,
      formData: null,
      dialogType: null,
      // loading
      loading: false,
      selectType: 'inclusion',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    requestApi() {
      this.inclusionList();
      this.exclusionList();
    },

    // 调用入组标准
    inclusionList() {
      const paramet = {
        tableName: 'inclusion',
        conditions: [{ fieldName: 'studyId', fieldValue: this.studyId }],
      };
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.inclusionData = data;
        })
        .catch(() => {});
    },

    exclusionList() {
      const paramet = { tableName: 'exclusion', conditions: [{ fieldName: 'studyId', fieldValue: this.studyId }] };
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.exclusionData = data;
        })
        .catch(() => {});
    },

    // 调用排除标准
    handleCreateCriteriaClick(type) {
      this.dialog = true;
      this.dialogType = 'create';
      this.selectType = type;
      this.title = type === 'inclusion' ? '创建入组标准' : '创建排除标准';
    },
    handleEditCriteriaClick({ row }, type) {
      this.selectType = type;
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = type === 'inclusion' ? '編輯入组标准' : '編輯排除标准';
    },
    handleDelCriteriaClick({ row: { id } }) {
      this.$post(this.urls.mdb.delete, { tableName: this.selectType, id })
        .then(() => {
          const fn = `${this.selectType}List`;
          this[fn]();
          this.$message.success('删除成功');
        })
        .catch(() => {});
    },
    handleExclusionEditClick() {
      this.selectType = 'exclusion';
    },
    handleCriteriaDialogSubmitClick(data) {
      // 编辑一条 创建多条
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      if (this.dialogType === 'create') {
        data.forEach((element) => {
          element.studyId = this.studyId;
        });
      }
      this.$post(this.urls.mdb.save, { tableName: this.selectType, data })
        .then(() => {
          const fn = `${this.selectType}List`;
          this[fn]();
          this.$message.success(message);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.study-criteria {
  &__exclusion {
    margin-top: 20px;
  }
}
</style>
