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
    <el-form ref="form" label-position="right" label-width="140px" :model="form" :rules="rules">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="form.name" :placeholder="namePlaceholder" />
      </el-form-item>
      <el-form-item label="项目描述" prop="description">
        <el-input v-model="form.description" :placeholder="descriptionPlaceholder" type="textarea" />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker
          v-model="form.startTime"
          type="date"
          value-format="timestamp"
          :placeholder="startTimePlaceholder"
        />
      </el-form-item>
      <el-form-item label="项目预计结束时间" prop="endTime">
        <el-date-picker v-model="form.endTime" type="date" value-format="timestamp" :placeholder="endTimePlaceholder" />
      </el-form-item>
      <el-form-item label="负责人" prop="person">
        <el-input v-model="form.person" :placeholder="personPlaceholder" />
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
  name: 'StudyDialog',
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
      namePlaceholder: '请输入项目名称',
      descriptionPlaceholder: '请输入项目描述',
      personPlaceholder: '请输入负责人',
      startTimePlaceholder: '请选择开始时间',
      endTimePlaceholder: '请选择结束时间',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.namePlaceholder, trigger: 'blur' }],
        personPlaceholder: [{ required: true, message: this.personPlaceholder, trigger: 'blur' }],
        startTime: [{ required: true, message: this.startTimePlaceholder, trigger: 'blur' }],
        endTime: [{ required: true, message: this.endTimePlaceholder, trigger: 'blur' }],
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
        name: null,
        description: null,
        person: null,
        startTime: null,
        endTime: null,
        status: '进行中',
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
