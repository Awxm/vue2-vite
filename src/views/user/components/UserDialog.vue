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
    <el-form ref="form" label-position="right" label-width="120px" :model="form" :rules="rules">
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="form.nickname" :placeholder="nicknamePlaceholder" />
      </el-form-item>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" :placeholder="usernamePlaceholder" />
      </el-form-item>
      <el-form-item label="职务、职称" prop="title">
        <el-input v-model="form.title" :placeholder="titlePlaceholder" />
      </el-form-item>
      <el-form-item label="姓名拼音缩写" prop="abbreviation">
        <el-input v-model="form.abbreviation" :placeholder="abbreviationPlaceholder" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form.phone" maxlength="11" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item v-if="show" label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email" placeholder="请输入邮箱" />
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
import { phoneRegular, passwordRegular } from '@u/regular';
import _ from 'lodash';

export default {
  name: 'UserDialog',
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
    // 手机号验证
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('电话号码不能为空'));
      }
      setTimeout(() => {
        if (!Number.isInteger(+value)) {
          callback(new Error('请输入数字值'));
        } else if (phoneRegular(value)) {
          callback();
        } else {
          callback(new Error('电话号码格式不正确'));
        }
      }, 100);
    };
    const checkPassword = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('密码不能为空'));
      }
      setTimeout(() => {
        if (passwordRegular(value)) {
          callback();
        } else {
          callback(new Error('必须包含一个大写，一个小写字母，一个特殊字符，且长度为8到16位'));
        }
      }, 100);
    };
    return {
      checkPhone,
      checkPassword,
      nicknamePlaceholder: '请输入昵称',
      usernamePlaceholder: '请输入用户名',
      titlePlaceholder: '请输入职务、职称',
      abbreviationPlaceholder: '请输入姓名拼音缩写',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        nickname: [{ required: true, message: this.nicknamePlaceholder, trigger: 'blur' }],
        username: [{ required: true, message: this.usernamePlaceholder, trigger: 'blur' }],
        title: [{ required: true, message: this.titlePlaceholder, trigger: 'blur' }],
        phone: [{ required: true, validator: this.checkPhone, trigger: 'blur' }],
        password: [{ required: true, validator: this.checkPassword, trigger: 'blur' }],
      };
    },
    show() {
      return !this.formData?.id;
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
          this.$emit('update:dialog', false);
          this.$emit('handleSubmitClick', this.form);
        } else {
          return false;
        }
      });
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
        nickname: null,
        username: null,
        phone: null,
        email: null,
        password: null,
        title: null,
        enabled: true,
        abbreviation: null,
        date: new Date().getTime(),
        roleList: [],
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
