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
      <el-form-item label="试剂" prop="reagentId">
        <el-select
          v-model="form.reagentId"
          clearable
          :placeholder="reagentIdPlaceholder"
          @change="handleChange($event, 'reagent')"
        >
          <el-option v-for="item in reagentData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="试剂类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="item in typeOptions" :key="item.value" :label="item.value"> {{ item.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="form.type === 3" label="其他" prop="other">
        <el-input v-model="form.other" type="text" clearable :placeholder="otherPlaceholder" />
      </el-form-item>
      <el-form-item label="存放位置" prop="position">
        <el-input v-model="form.position" type="text" :placeholder="positionPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="储存温度" prop="temperature">
        <el-input v-model="form.temperature" type="text" :placeholder="temperaturePlaceholder" clearable />
      </el-form-item>
      <el-form-item label="设备编号" prop="no">
        <el-input v-model="form.no" type="text" :placeholder="noPlaceholder" clearable />
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
  name: 'WarehouseDialog',
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
    reagentData: {
      type: Array,
      default: () => [],
    },
    studyData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      reagentIdPlaceholder: '请选择试剂',
      positionPlaceholder: '请输入存放位置',
      temperaturePlaceholder: '请输入存储温度',
      noPlaceholder: '请输入设备编号',
      otherPlaceholder: '请输入其他',
      form: null,
      typeOptions: [{ label: '考核试剂', value: 1 }, { label: '对比试剂', value: 2 }, { label: '其他', value: 3 }],
    };
  },
  computed: {
    rules() {
      return {
        reagentId: [{ required: true, message: this.reagentIdPlaceholder }],
        position: [{ required: true, message: this.positionPlaceholder }],
        temperature: [{ required: true, message: this.temperature }],
        other: [{ required: true, message: this.otherPlaceholder }],
        type: [{ required: true, message: '请选择类型' }],
        no: [{ required: true, message: this.noPlaceholder }],
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
      this.$emit('update:form', null);
      this.form = this.formInit();
    },
    handleChange(id, type) {
      this.form[type] = this[`${type}Data`].find((f) => f.id === id);
    },
    formInit() {
      return {
        reagent: null,
        reagentId: null,
        position: null,
        temperature: null,
        type: 1,
        other: null,
        no: null,
        list: [],
        date: new Date().getTime(),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
