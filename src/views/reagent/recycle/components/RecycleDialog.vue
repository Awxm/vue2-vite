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
      <el-form-item label="送交者" prop="deliverer">
        <el-input v-model="form.deliverer" :placeholder="delivererPlaceholder" />
      </el-form-item>
      <el-form-item label="送交时间" prop="delivererTime">
        <el-date-picker
          v-model="form.delivererTime"
          type="date"
          value-format="timestamp"
          :placeholder="delivererTimePlaceholder"
        />
      </el-form-item>
      <el-form-item label="接收者" prop="recipient">
        <el-input v-model="form.recipient" :placeholder="recipientPlaceholder" />
      </el-form-item>
      <el-form-item label="接收时间" prop="recipientTime">
        <el-date-picker
          v-model="form.recipientTime"
          type="date"
          value-format="timestamp"
          :placeholder="recipientTimePlaceholder"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :rows="2" :placeholder="remarkPlaceholder" />
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
  name: 'RecycleDialog',
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
    reagentTableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // reagentIdPlaceholder: '请选择试剂名称',
      delivererPlaceholder: '请输入送交者',
      delivererTimePlaceholder: '请选择送交时间',
      recipientPlaceholder: '请输入接收者',
      recipientTimePlaceholder: '请选择接收时间',
      remarkPlaceholder: '请输入备注',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        // reagentId: [{ required: true, message: this.reagentIdPlaceholder, trigger: 'blur' }],
        deliverer: [{ required: true, message: this.delivererPlaceholder, trigger: 'blur' }],
        delivererTime: [{ required: true, message: this.delivererTimePlaceholder, trigger: 'blur' }],
        recipient: [{ required: true, message: this.recipientPlaceholder, trigger: 'blur' }],
        recipientTime: [{ required: true, message: this.recipientTimePlaceholder, trigger: 'blur' }],
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
    handleReagentChange(id) {
      this.form.reagent = this.reagentTableData.find((f) => f.id === id);
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
      this.form = this.formInit();
      this.$emit('update:formData', null);
    },
    formInit() {
      return {
        reagent: [],
        reagentId: null,
        deliverer: null,
        delivererTime: null,
        recipient: null,
        recipientTime: null,
        remark: null,
        date: new Date().getTime(),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
