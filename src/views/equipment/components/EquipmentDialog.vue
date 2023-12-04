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
      <el-form-item label="项目名称" prop="studyId">
        <el-select v-model="form.studyId" multiple clearable @change="handleChange">
          <el-option v-for="item in studyData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="仪器名称" prop="name">
        <el-input v-model="form.name" type="text" :placeholder="namePlaceholder" />
      </el-form-item>
      <el-form-item label="生产厂家" prop="producer">
        <el-input v-model="form.producer" type="text" :placeholder="producerPlaceholder" />
      </el-form-item>
      <el-form-item label="型号" prop="model">
        <el-input v-model="form.model" type="text" :placeholder="modelPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="注册证编号" prop="code">
        <el-input v-model="form.code" type="text" :placeholder="modelPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="产品序列号" prop="serialNumber">
        <el-input v-model="form.serialNumber" type="text" :placeholder="serialNumberPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="数量" prop="number">
        <el-input v-model="form.number" type="text" :placeholder="numberPlaceholder" clearable />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmitClick"> 确认 </el-button>
      <el-button @click="handleCancelClick"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import _ from 'lodash';

export default {
  name: 'EquipmentDialog',
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
    studyData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      studyIdPlaceholder: '请输入主运企业名称',
      namePlaceholder: '请输入仪器名称',
      producerPlaceholder: '请输入生产厂家',
      modelPlaceholder: '请输入型号',
      codePlaceholder: '请输入注册证编号',
      serialNumberPlaceholder: '请输入序列号',
      numberPlaceholder: '请输入数量',
      form: null,
      // statusOptions: [
      //   { label: '校验', value: 'pending' },
      //   { label: '使用', value: 'use' },
      //   { label: '维护', value: 'maintenance' },
      // ],
    };
  },
  computed: {
    rules() {
      return {
        studyId: [{ required: true, message: this.studyIdPlaceholder, trigger: 'blur' }],
        name: [{ required: true, message: this.namePlaceholder, trigger: 'blur' }],
        producer: [{ required: true, message: this.producerPlaceholder, trigger: 'blur' }],
        model: [{ required: true, message: this.producerPlaceholder, trigger: 'blur' }],
        code: [{ required: true, message: this.codePlaceholder, trigger: 'blur' }],
        serialNumber: [{ required: true, message: this.serialNumberPlaceholder, trigger: 'blur' }],
        number: [{ required: true, message: this.numberPlaceholder, trigger: 'blur' }],
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
    handleChange(value) {
      this.form.study = value.map((m) => this.studyData.find((f) => f.id === m));
    },
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
        studyId: [],
        study: [],
        name: null,
        producer: null,
        model: null,
        code: null,
        serialNumber: null,
        number: null,
        // 校准 使用 维护
        status: 'pending',
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
