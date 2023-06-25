<template>
  <div class="app-container">
    <div class="ad-app-filter">
      <search-box :keyword.sync="keyword" @handleSearchClick="peronnelList" @handleClearInput="peronnelList" />
      <div class="ad-app-filter__operat">
        <el-button v-waves type="primary" icon="el-icon-plus" @click="handleCreateStudyClick">添加人员</el-button>
      </div>
    </div>
    <div class="ad-app-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }"
      >
        <el-table-column label="昵称" prop="nickname" min-width="100" />
        <el-table-column label="手机" prop="phone" min-width="100" />
        <el-table-column label="邮箱" prop="email" min-width="100" />
        <el-table-column label="职责" prop="roleNames" min-width="100" />

        <el-table-column label="操作" min-width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDeleteClick(scope.row)">删除</el-button>
            <el-button type="text" @click="handleEditClick(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <pagination
      :request="peronnelList"
      :page.sync="pagination.page"
      :pageSize.sync="pagination.pageSize"
      :total="total"
    />
    <peronnel-dialog
      :dialog.sync="dialog"
      :title="title"
      :formData.sync="formData"
      @handleSubmitClick="handlePeronnelDialogSubmitClick"
    />
  </div>
</template>

<script>
import PeronnelDialog from './components/PeronnelDialog.vue';
import page from '@st/mixin/page';
import search from '@st/mixin/search';

const tableName = 'study_peronnel';

export default {
  name: 'PeronnelInfo',
  components: { PeronnelDialog },
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
      userList: [],
      roleList: [],
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.peronnelList();
    this.loadUserList();
    this.loadRoleList();
  },
  methods: {
    // 项目
    peronnelList() {
      this.loading = true;
      const paramet = { tableName, conditions: [], ...this.pagination };
      paramet.conditions = [
        {
          fieldName: 'studyId',
          fieldValue: this.$route.query.id,
        },
      ];
      if (this.keyword) {
        paramet.conditions.push({
          fieldName: 'nickname',
          fieldValue: this.keyword,
        });
      }
      this.$post(this.urls.mdb.query, paramet)
        .then(({ data, total }) => {
          this.tableData = data;
          this.total = total;
          this.loading = false;
        })
        .catch(() => {});
    },
    loadUserList() {
      this.$post(this.urls.mdb.query, { tableName: 'user' })
        .then(({ data }) => {
          this.userList = data;
        })
        .catch(() => {});
    },
    loadRoleList() {
      this.$post(this.urls.mdb.query, { tableName: 'role' })
        .then(({ data }) => {
          this.roleList = data;
        })
        .catch(() => {});
    },
    // 创建弹窗
    handleCreateStudyClick() {
      this.dialog = true;
      this.dialogType = 'create';
      this.title = '添加人员';
      const rowData = {};
      rowData.userList = this.userList;
      rowData.roleList = this.roleList;
      rowData.studyId = this.$route.query.id;
      rowData.dialogType = 'create';
      this.formData = rowData;
    },
    // 表单操作
    handleEditClick(row) {
      row.userList = this.userList;
      row.roleList = this.roleList;
      row.isDisabled = true;
      row.dialogType = 'edit';
      this.formData = row;
      this.dialog = true;
      this.dialogType = 'edit';
      this.title = '编辑人员';
    },
    // 删除操作
    handleDeleteClick(row) {
      const { nickname, id } = row;
      this.$confirm(`是否删除${nickname}项目 是否继续？`, { type: 'warning' })
        .then(() => {
          this.$post(this.urls.mdb.delete, { tableName, id })
            .then(() => {
              this.peronnelList();
              this.$message.success('操作成功');
            })
            .catch(() => {});
        })
        .catch(() => {});
    },

    // 弹窗确定事件接口
    handlePeronnelDialogSubmitClick(data) {
      // const { nickname, username, phone, email, id, password, date } = paramet;
      // const data = { nickname, username, phone, email, id, date };
      // if (this.dialogType === 'create') data.password = password;

      data.userList = null;
      data.roleList = null;
      data.studyId = this.$route.query.id;
      data.roleNames = this.$options.methods.buildRoleNames(data.roleIds, this.roleList);
      const message = this.dialogType === 'create' ? '创建成功' : '编辑成功';
      this.$post(this.urls.mdb.save, { tableName, data })
        .then(() => {
          this.peronnelList();
          this.$message.success(message);
        })
        .catch(() => {});
    },

    buildRoleNames(roleIds, roleDataList) {
      let result = '';
      for (let i = 0; i < roleIds.length; i++) {
        for (let j = 0; j < roleDataList.length; j++) {
          if (roleIds[i] === roleDataList[j].id) {
            result += `,${roleDataList[j].roleName}`;
          }
        }
      }
      if (result.length > 0) {
        result = result.substring(1);
      }
      return result;
    },
  },
};
</script>
