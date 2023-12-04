<template>
  <div class="app-container">
    <div class="study-subject-criteria__inclusion">
      <div class="title">入组标准</div>
      <ms-inclusion ref="inclusion" :isEdit="false" :isOperation="true" :tableData="inclusionData" />
    </div>
    <div class="study-subject-criteria__exclusion" style="margin-top: 20px;">
      <div class="title">排除标准</div>
      <ms-inclusion ref="exclusion" :isEdit="false" :isOperation="true" :tableData="exclusionData" />
    </div>
    <div style="margin-top: 20px;">
      <el-button v-waves type="primary" icon="el-icon-plus" :disabled="loading" @click="handleUpdateClick">
        保存
      </el-button>
    </div>
  </div>
</template>

<script>
import MsInclusion from '@c/screening-table/index.vue';

const tableName = 'subject';
export default {
  name: 'StudySubjectCriteria',
  components: { MsInclusion },
  filters: {},
  props: {},
  data() {
    return {
      subjectData: {},
      inclusionData: [],
      exclusionData: [],
      // loading
      loading: false,
      selectType: 'inclusion',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    Promise.all([this.inclusionList(), this.exclusionList()]).then((result) => {
      if (result[1].length > 0 && result[0].length > 0) this.getSubject(this.roleId);
    });
  },
  methods: {
    // 调用入组标准
    async inclusionList() {
      const paramet = {
        tableName: 'inclusion',
        conditions: [{ fieldName: 'studyId', fieldValue: this.$route.query.studyId }],
      };
      const { data } = await this.$post(this.urls.mdb.query, paramet);
      this.inclusionData = data.map((m) => {
        m.conform = null;
        return m;
      });
      return data;
    },

    async exclusionList() {
      const paramet = {
        tableName: 'exclusion',
        conditions: [{ fieldName: 'studyId', fieldValue: this.$route.query.studyId }],
      };
      const { data } = await this.$post(this.urls.mdb.query, paramet);
      this.exclusionData = data.map((m) => {
        m.conform = null;
        return m;
      });
      return data;
    },
    // 获取受试者详情
    getSubject() {
      const paramet = { tableName: 'subject', id: this.$route.query.id };
      this.$post(this.urls.mdb.getOne, paramet)
        .then((data) => {
          const { exclusion, inclusion } = data;
          this.subjectData = data;
          for (let index = 0; index < exclusion.length; index++) {
            this.exclusionData[index].conform = exclusion[index];
          }
          for (let index = 0; index < inclusion.length; index++) {
            this.inclusionData[index].conform = inclusion[index];
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },

    handleUpdateClick() {
      const inclusion = this.inclusionData.map((m) => m.conform);
      const exclusion = this.exclusionData.map((m) => m.conform);
      const isInclusion = inclusion.every((item) => item === 1);
      const isExclusion = exclusion.every((item) => item === 0);
      this.$post(this.urls.mdb.save, {
        tableName,
        data: {
          id: this.$route.query.id,
          status: isInclusion && isExclusion ? 'screen' : 'screenFail',
          inclusion,
          exclusion,
        },
      })
        .then(() => {
          this.getSubject();
          this.$message.success('操作成功');
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
