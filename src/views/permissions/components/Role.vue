<template>
  <div class="ms-permissions__role">
    <div class="ms-permissions-role-head">
      <div class="ms-permissions-role-head__doubt">系统管理职责<i class="el-icon-question"></i></div>
      <div class="ms-permissions-role-head__create" @click="handleCreateClick">
        <i class="el-icon-plus"></i>创建职责
      </div>
    </div>
    <ul v-if="roles.length > 0" class="ms-permissions-role-list">
      <li
        v-for="item in roles"
        :key="item.id"
        :class="['ms-permissions-role-item', selectRoleId === item.id ? 'is-active' : '']"
        @click="handleItemClick(item.id)"
      >
        <div class="ms-permissions-role-item__name">{{ item.roleName }}</div>
        <div
          :class="[
            'ms-permissions-role-item__operat',
            `ms-permissions-role-item__operat--${visibleRoleId === item.id ? 'show' : 'hide'}`,
          ]"
        >
          <el-dropdown
            trigger="click"
            placement="bottom"
            @visible-change="visibleChange($event, item.id)"
            @command="handleCommand($event, item)"
          >
            <i class="el-icon-setting"></i>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="edit">编辑</el-dropdown-item>
              <!-- <el-dropdown-item command="del">删除</el-dropdown-item> -->
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </li>
    </ul>
    <role-user-dialog
      :dialog.sync="dialog"
      :title="dialogTitle"
      :formData.sync="formData"
      @handleSubmitClick="handleSubmitClick"
    />
  </div>
</template>

<script>
import RoleUserDialog from './RoleUserDialog.vue';

export default {
  name: 'PermissionsRole',
  components: { RoleUserDialog },
  filters: {},
  props: {
    roles: {
      type: Array,
      default: () => [],
    },
    roleId: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      visibleRoleId: null,
      dialog: false,
      dialogTitle: null,
      dialogType: null,
      formData: null,
    };
  },
  computed: {
    selectRoleId() {
      return this.roleId;
    },
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    visibleChange(visible, roleId) {
      this.visibleRoleId = visible ? roleId : null;
    },
    handleCreateClick() {
      this.dialog = true;
      this.dialogTitle = '创建';
      this.dialogType = 'create';
    },
    handleCommand(command, item) {
      if (command === 'del') {
        this.$confirm('是否删除该项?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {})
          .catch(() => {});
      } else {
        // 打开弹窗
        this.dialog = true;
        this.dialogTitle = '编辑';
        this.dialogType = 'edit';
        this.formData = item;
      }
    },
    handleItemClick(roleId) {
      this.$emit('update:roleId', roleId);
      this.$emit('handleItemClick', roleId);
    },
    handleSubmitClick(value) {
      this.$emit('handleRoleSubmitClick', { ...value, dialogType: this.dialogType });
    },
  },
};
</script>
<style lang="scss" scoped>
ul,
li {
  padding: 0;
  margin: 0;
  list-style: none;
}

.el-dropdown-menu__item {
  padding: 0 20px;
}

.ms-permissions {
  &__role {
    flex-shrink: 0;
    width: 240px;
    height: 100%;
    padding: 0 10px 10px;
    overflow: hidden;
    background: #f6f6f7;
    border-radius: 5px;
  }

  &-role-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 0;
    font-size: 14px;

    &__doubt,
    &__create {
      cursor: pointer;
    }

    &__doubt {
      i {
        margin-left: 5px;
      }
    }

    &__create {
      i {
        margin-right: 5px;
      }
    }
  }

  &-role-list {
    height: calc(100% - 56px);
    padding: 5px;
    overflow: auto;
    background-color: #fff;

    .is-active {
      background-color: #deebff;
      border-color: #94c1ff;
      border-radius: 5px;
    }
  }

  &-role-item {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 20px;
    margin-top: 5px;
    font-size: 14px;
    line-height: 40px;
    border: 1px solid transparent;

    &:hover {
      box-sizing: border-box;
      background-color: #deebff;
      border-color: #94c1ff;
      border-radius: 5px;

      .ms-permissions-role-item__operat {
        display: block;
      }
    }

    &:first-child {
      margin-top: 0;
    }

    &__operat {
      display: none;
      cursor: pointer;

      &--show {
        display: block;
      }

      &--hide {
        display: none;
      }
    }
  }
}
</style>
