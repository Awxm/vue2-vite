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
    <el-form ref="form" label-position="right" label-width="140px" :model="form" :rules="rules" @submit.native.prevent>
      <el-form-item label="试剂名称" prop="name">
        <el-input v-model="form.name" type="text" :placeholder="namePlaceholder" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="producer">
        <el-input v-model="form.producer" type="text" :placeholder="producerPlaceholder" />
      </el-form-item>
      <el-form-item label="规格" prop="specification">
        <el-input v-model="form.specification" type="text" :placeholder="specificationPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="批号" prop="batchNumber">
        <el-input v-model="form.batchNumber" type="text" :placeholder="batchNumberPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="失效时间" prop="failureTime">
        <el-date-picker
          v-model="form.failureTime"
          type="date"
          value-format="timestamp"
          :placeholder="failureTimePlaceholder"
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
    return {
      namePlaceholder: '请输入试剂名称',
      producerPlaceholder: '请输入生产厂家',
      specificationPlaceholder: '请输入规格',
      batchNumberPlaceholder: '请输入批文',
      failureTimePlaceholder: '请选择失效时间',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        name: [{ required: true, message: this.namePlaceholder, trigger: 'blur' }],
        producer: [{ required: true, message: this.producerPlaceholder, trigger: 'blur' }],
        specification: [{ required: true, message: this.specificationPlaceholder, trigger: 'blur' }],
        batchNumber: [{ required: true, message: this.batchNumberPlaceholder, trigger: 'blur' }],
        failureTime: [{ required: true, message: this.failureTimePlaceholder, trigger: 'blur' }],
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
        producer: null,
        specification: null,
        batchNumber: null,
        failureTime: null,
        date: new Date().getTime(),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
