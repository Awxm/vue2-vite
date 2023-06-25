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
      <el-form-item label="受试者姓名" prop="name">
        <el-input v-model="form.name" :placeholder="namePlaceholder" />
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="form.sex">
          <el-radio label="1">男</el-radio>
          <el-radio label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期" prop="age">
        <el-date-picker v-model="form.age" type="date" value-format="timestamp" :placeholder="signedDatePlaceholder" />
      </el-form-item>
      <el-form-item label="签署知情时间" prop="signedDate">
        <el-date-picker
          v-model="form.signedDate"
          type="date"
          value-format="timestamp"
          :placeholder="signedDatePlaceholder"
        />
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

export default {
  name: 'SubjectDialog',
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
      namePlaceholder: '请输入受试者姓名',
      agePlaceholder: '请输入出生日期',
      signedDatePlaceholder: '请选择签署知情日期',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.namePlaceholder, trigger: 'blur' }],
        age: [{ required: true, message: this.agePlaceholder, trigger: 'blur' }],
        sex: [{ required: true, message: this.endTimePlaceholder, trigger: 'blur' }],
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
          this.form.status = this.form.signedDate ? 'sign' : 'pending';
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
        age: null,
        sex: '1',
        signedDate: null,
        date: new Date().getTime(),
        status: 'pending',
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
