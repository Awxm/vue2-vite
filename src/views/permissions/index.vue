<template>
  <div class="app-container ms-permissions">
    <div class="ms-permissions-content">
      <role
        ref="role"
        :roles="roles"
        :roleId.sync="roleId"
        @handleRoleSubmitClick="handleRoleSubmitClick"
        @handleItemClick="handleItemClick"
      />
      <list
        ref="list"
        v-loading="loading"
        :permissions="permissions"
        :permissionIds="permissionIds"
        @handleSaveClick="handleSaveClick"
      />
    </div>
  </div>
</template>

<script>
import Role from './components/Role';
import List from './components/List';
// import { nearer } from 'q';
const tableName = 'role';
export default {
  name: 'Permissions',
  components: {
    Role,
    List,
  },
  filters: {},
  props: {},
  data() {
    return {
      roles: [],
      permissions: [],
      permissionIds: [],
      roleId: null,
      loading: false,
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.loading = false;
    this.roleGet();
    this.permissionTemplate();
  },
  methods: {
    // 获取role get
    async roleGet() {
      const { data } = await this.$post(this.urls.mdb.query, { tableName: 'role', page: -1, pageSize: -1 });
      this.roles = data;
      this.roleId = data[0].id;
      if (data[0].permissionIds == null) {
        this.permissionIds = [];
      } else {
        this.permissionIds = data[0].permissionIds;
      }
      return data;
    },
    async permissionTemplate() {
      // const result = await this.$post(this.urls.mdb.query, { tableName: 'permission' });
      // this.permissions = result;
      // return result;
    },
    rolePermissionGet(roleId) {
      this.$post(this.urls.mdb.getOne, { tableName, id: roleId })
        .then(({ permissionIds }) => {
          if (permissionIds == null) {
            this.permissionIds = [];
          } else {
            this.permissionIds = permissionIds;
          }
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
    handleRoleSubmitClick(value) {
      const { name, dialogType } = value;
      if (dialogType === 'create') {
        const postData = { tableName, data: { roleName: name } };
        this.$post(this.urls.mdb.save, postData).then(() => {
          this.roleGet();
          this.$message.success('创建成功');
        });
      } else {
        this.$post(this.urls.mdb.save, { tableName, data: { id: this.roleId, roleName: name } }).then(() => {
          this.roleGet();
          this.$message.success('修改成功');
        });
      }
    },
    handleItemClick(roleId) {
      this.loading = true;
      this.rolePermissionGet(roleId);
    },
    handleSaveClick(permissionIds, permissionList) {
      this.$post(this.urls.mdb.save, { tableName, data: { id: this.roleId, permissionIds, permissionList } }).then(
        () => {
          this.$message.success('保存成功');
        },
      );
    },
  },
  beforeDestory() {
    this.permissions = [];
    this.permissionIds = [];
  },
};
</script>
<style lang="scss" scoped>
.ms-permissions {
  height: 100%;

  &-content {
    display: flex;
    height: 100%;
    overflow: hidden;
    background-color: #fff;
  }
}
</style>
