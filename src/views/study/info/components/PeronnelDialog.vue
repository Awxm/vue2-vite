<template>
  <el-dialog
    center
    :title="title"
    width="560px"
    :visible.sync="dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    @closed="handleClosed"
  >
    <el-form ref="form" label-position="right" label-width="90px" :model="form" :rules="rules">
      <el-form-item label="人员" prop="userId">
        <el-select v-model="form.userId" collapse-tags :disabled="form.isDisabled" :placeholder="userPlaceholder">
          <el-option v-for="item in form.userList" :key="item.id" :label="item.nickname" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="职责" prop="roleIds">
        <el-select v-model="form.roleIds" multiple collapse-tags :placeholder="rolePlaceholder">
          <el-option v-for="item in form.roleList" :key="item.id" :label="item.roleName" :value="item.id" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmitClick">
        确认
      </el-button>
      <el-button @click="handleCancelClick">
        取消
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';

const tableName = 'study_peronnel';

export default {
  name: 'PeronnelDialog',
  components: {},
  filters: {},
  props: {
    dialog: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    formData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      userPlaceholder: '请选择人员',
      rolePlaceholder: '请选择职责',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        userId: [{ required: true, message: this.userPlaceholder, trigger: 'blur' }],
        roleIds: [{ required: true, message: this.rolePlaceholder, trigger: 'blur' }],
      };
    },
  },
  watch: {
    formData: {
      handler(form) {
        if (form) this.form = _.cloneDeep(form);
        else this.form = this.formInit();
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    handleSubmitClick() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 获取已选择用户的信息
          let userInfo = {};
          for (let i = 0; i < this.form.userList.length; i++) {
            if (this.form.userList[i].id === this.form.userId) {
              userInfo = this.form.userList[i];
              break;
            }
          }
          this.form.nickname = userInfo.nickname;
          this.form.phone = userInfo.phone;
          this.form.email = userInfo.email;

          if (this.form.dialogType === 'edit') {
            this.$emit('update:dialog', false);
            this.$emit('handleSubmitClick', this.form);
            return;
          }

          // 查询该人员是否已添加
          const paramet = { tableName, conditions: [] };
          paramet.conditions = [
            {
              fieldName: 'studyId',
              fieldValue: this.form.studyId,
            },
            {
              fieldName: 'userId',
              fieldValue: userInfo.id,
            },
          ];

          this.$post(this.urls.mdb.query, paramet)
            .then(({ data, total }) => {
              console.log('query userId');
              console.log(data);
              if (total <= 0) {
                // 返回人员与职责数据集
                this.$emit('update:dialog', false);
                this.$emit('handleSubmitClick', this.form);
              } else {
                this.$message.error('人员已存在，请选择其它人员！');
              }
            })
            .catch(() => {});
        } else {
          return false;
        }
      });
    },
    getUserInfoByList(list, id) {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          return list[i];
        }
      }
      return {};
    },
    handleCancelClick() {
      this.$emit('update:dialog', false);
    },
    handleClosed() {
      this.$emit('update:formData', null);
      this.form = this.formInit();
    },
    formInit() {
      return {
        userList: [],
        roleList: [],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
