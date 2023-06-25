<template>
  <div class="ms-permissions__list">
    <div class="ms-permissions-list-operat">
      <div style="text-align: right;">
        <el-button type="primary" size="small" @click="handleSaveClick">保存</el-button>
      </div>
    </div>
    <div class="ms-permissions-list-checkbox">
      <el-backtop target=".ms-permissions-list-checkbox" />
      <el-tree
        ref="tree"
        height="calc(100% - 55px)"
        :props="defaultProps"
        :data="permissionsData"
        :expand-on-click-node="false"
        node-key="permissionId"
        default-expand-all
        show-checkbox
      >
        <template slot-scope="{ data }">
          <span :class="[!!data.permissions ? 'node-label' : 'node-content']">
            {{ data.permissionId ? data.name : data.groupName }}
          </span>
        </template>
      </el-tree>
    </div>
  </div>
</template>

<script>
// import VueEasyTree from '@wchbrad/vue-easy-tree';
export default {
  name: 'PermissionsList',
  components: {
    // VueEasyTree,
  },
  filters: {},
  props: {
    permissions: {
      type: Array,
      default: () => [],
    },
    permissionIds: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      defaultProps: {
        children: 'permissions',
        label: 'groupName',
      },
    };
  },
  computed: {
    permissionsData() {
      // let data = [];
      // if (this.permissions.length > 0) {
      //   data = [
      //     {
      //       groupName: '全部',
      //       permissions: this.permissions,
      //     },
      //   ];
      // }
      // return data;

      const result = [];
      result.push({
        groupName: '试验试剂',
        permissions: [
          { permissionId: 'a1001', permissionCode: 'test_reagent_list_management', name: '试剂列表管理' },
          { permissionId: 'a1002', permissionCode: 'test_reagent_transport_management', name: '运输交接管理' },
          { permissionId: 'a1003', permissionCode: 'test_reagent_in_out_management', name: '出入库管理' },
          { permissionId: 'a1004', permissionCode: 'test_reagent_recovery_management', name: '回收管理' },
        ],
      });
      result.push({
        groupName: '试验仪器',
        permissions: [
          { permissionId: 'b1001', permissionCode: 'test_instruments_reception', name: '接收' },
          { permissionId: 'b1002', permissionCode: 'test_instruments_management', name: '管理' },
        ],
      });
      result.push({
        groupName: '受试者管理',
        permissions: [
          { permissionId: 'c1001', permissionCode: 'subject_add_edit', name: '添加/编辑受试者' },
          { permissionId: 'c1002', permissionCode: 'subject_sieve', name: '筛选' },
          { permissionId: 'c1003', permissionCode: 'subject_enrollment', name: '入组' },
        ],
      });
      result.push({
        groupName: '样本',
        permissions: [
          { permissionId: 'd1001', permissionCode: 'sample_reception', name: '添加样本' },
          { permissionId: 'd1003', permissionCode: 'sample_code', name: '编码' },
          { permissionId: 'd1004', permissionCode: 'sample_test_operation', name: '入库保存' },
          { permissionId: 'd1005', permissionCode: 'sample_unblinding', name: '销毁' },
        ],
      });
      result.push({
        groupName: '项目管理',
        permissions: [
          { permissionId: 'e1001', permissionCode: 'project_management', name: '项目管理' },
          { permissionId: 'e1002', permissionCode: 'project_inclusion_exclusion', name: '入排标准管理' },
        ],
      });
      result.push({
        groupName: '系统管理员',
        permissions: [
          { permissionId: 'z1001', permissionCode: 'sys_user_management', name: '用户管理' },
          { permissionId: 'z1002', permissionCode: 'sys_role_management', name: '职责管理' },
        ],
      });
      return [{ groupName: '全部', permissions: result }];
    },
  },
  watch: {
    permissionIds: {
      handler(value) {
        this.$nextTick(() => {
          this.$refs.tree.setCheckedKeys(value);
        });
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes();
    },
    handleSaveClick() {
      const keys = this.$refs.tree.getCheckedKeys();
      const permissionIds = keys.filter((f) => f !== undefined);

      const nodes = this.$refs.tree.getCheckedNodes();
      const permissionList = nodes.filter((node) => node.permissionId !== undefined);

      this.$emit('handleSaveClick', permissionIds, permissionList);
    },
  },
};
</script>
<style lang="scss" scoped>
.ms-permissions {
  &__list {
    width: 100%;
    margin: 0 20px;

    ::v-deep .el-tree {
      .el-tree-node__expand-icon {
        display: none;
      }

      .el-tree-node__content {
        &:hover {
          background-color: #fff;
        }
      }

      .el-tree-node > .el-tree-node__content {
        padding-left: 0 !important;
        margin-bottom: 8px;
        background-color: #fff;
      }

      .el-tree-node > .el-tree-node__children {
        word-break: break-word;
        white-space: initial;
      }

      & > .el-tree-node > .el-tree-node__children > .is-expanded > .el-tree-node__children > .is-expanded {
        display: inline-block;
      }

      .node-label {
        font-size: 16px;
        font-weight: 700;
      }

      .node-content {
        display: inline-block;
        min-width: 122px;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }

  &-list-checkbox {
    // height: calc(100% - 55px);
    height: 100%;
    margin-top: 20px;
    overflow: auto;
  }
}
</style>
