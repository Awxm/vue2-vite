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
      <el-form-item label="登记日期" prop="registerTime">
        <el-date-picker
          v-model="form.registerTime"
          type="date"
          value-format="timestamp"
          :placeholder="registerTimePlaceholder"
        />
      </el-form-item>
      <el-form-item label="出库数量" prop="delivered">
        <el-input v-model="form.delivered" type="text" placeholder="请输入出库数量" clearable />
      </el-form-item>
      <el-form-item label="库存数量" prop="inventory">
        <el-input v-model="form.inventory" type="text" placeholder="请输入库存数量" clearable />
      </el-form-item>
      <el-form-item label="操作者" prop="operator">
        <el-input v-model="form.operator" type="text" placeholder="请输入操作者" clearable />
      </el-form-item>
      <el-form-item label="管理者" prop="manager">
        <el-input v-model="form.manager" type="text" placeholder="请输入管理者" clearable />
      </el-form-item>
      <el-form-item label="使用数量" prop="quantity">
        <el-input v-model="form.quantity" type="text" placeholder="请输入使用数量" clearable />
      </el-form-item>
      <el-form-item label="入库数量" prop="receipt">
        <el-input v-model="form.receipt" type="text" placeholder="请输入入库数量" clearable />
      </el-form-item>
      <el-form-item label="库存数量" prop="receiptInventory">
        <el-input v-model="form.receiptInventory" type="text" placeholder="请输入库存数量" clearable />
      </el-form-item>
      <el-form-item label="操作者" prop="receiptOperator">
        <el-input v-model="form.receiptOperator" type="text" placeholder="请输入操作者" clearable />
      </el-form-item>
      <el-form-item label="管理者" prop="receiptManager">
        <el-input v-model="form.receiptManager" type="text" placeholder="请输入管理者" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder="请输入备注" rows="3" />
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
  name: 'DetailDialog',
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
      registerTimePlaceholder: '请选择登记时间',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        registerTime: [{ required: true, message: this.registerTimePlaceholder, trigger: 'blur' }],
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
        registerTime: '',
        delivered: '',
        inventory: '',
        operator: '',
        manager: '',
        quantity: '',
        receipt: '',
        receiptInventory: '',
        receiptOperator: '',
        receiptManager: '',
        remark: '',
        date: new Date().getTime(),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
