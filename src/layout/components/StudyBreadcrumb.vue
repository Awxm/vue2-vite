<template>
  <div v-if="isStudy" class="ms-study-breadcrumb">
    <span class="study-breadcrumb__item">广州医科大学附属肿瘤第一医院国家呼吸医学中心</span>
    <span class="study-breadcrumb__inner"><i class="el-icon-arrow-right"></i></span>
    <template v-if="isStudySelect">
      <el-dropdown trigger="click" :disabled="disabled" @command="handleCommand">
        <span class="study-name"> {{ studyName }}<i class="el-icon-arrow-down el-icon--right"></i> </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in tableData" :key="item.id" :command="item">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </template>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

const tableName = 'study';

export default {
  name: 'StudyBreadcrumb',
  components: {},
  filters: {},
  props: {},
  data() {
    return {
      tableData: [],
    };
  },
  computed: {
    ...mapGetters(['studyName']),
    isStudySelect() {
      const route = this.$route;
      const { meta } = route;
      return meta.topTab === '/study' && meta.activeMenu !== '/study/info';
    },
    isStudy() {
      const route = this.$route;
      const { meta } = route;
      return meta.topTab === '/study';
    },
    disabled() {
      const route = this.$route;
      const { path } = route;
      const value = ['/study/warehouse/detail'];
      return value.includes(path);
    },
  },
  watch: {},
  created() {
    this.studyList();
  },
  mounted() {},
  methods: {
    // 项目
    studyList() {
      this.loading = true;
      const paramet = { tableName, conditions: [] };
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data }) => {
          this.tableData = data;
          if (data[0]) {
            const { id, name } = data[0];
            this.$store.dispatch('study/info', { key: 'studyId', value: id });
            this.$store.dispatch('study/info', { key: 'studyName', value: name });
          }
        })
        .catch(() => {});
    },
    handleCommand({ id, name }) {
      this.$store.dispatch('study/info', { key: 'studyId', value: id });
      this.$store.dispatch('study/info', { key: 'studyName', value: name });
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-study-breadcrumb {
  height: 68px;
  padding-left: 30px;
  font-size: 14px;
  line-height: 68px;
  color: #989da4;
  background-color: #fff;
  .study-name {
    color: #323b46;
  }
  .study-breadcrumb {
    &__name {
      font-weight: 700;
      text-decoration: none;
    }

    &__inner {
      margin: 0 10px;
      font-weight: 700;
      color: #989da4;
    }
  }
}
</style>
