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
      <el-form-item v-if="type === 'code'" label="编码" prop="code">
        <el-input v-model="form.code" :placeholder="codePlaceholder" />
      </el-form-item>
      <el-form-item v-if="type === 'save'" label="入库日期" prop="saveDate">
        <el-date-picker
          v-model="form.saveDate"
          type="date"
          value-format="timestamp"
          :placeholder="saveDatePlaceholder"
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
  name: 'SampleOperationDialog',
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
    type: {
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
      codePlaceholder: '请输入编码',
      saveDatePlaceholder: '请选择入库时间',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        code: [{ required: true, message: this.codePlaceholder, trigger: 'blur' }],
        saveDate: [{ required: true, message: this.saveDatePlaceholder, trigger: 'blur' }],
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
    handleSubjectChange(id) {
      this.form.subject = this.subjectTableData.find((f) => f.id === id);
    },
    formInit() {
      const form = {};

      switch (this.type) {
      case 'code':
        form.code = null;
        break;
      case 'save':
        form.saveDate = null;
        break;

      default:
        break;
      }
      return form;
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
