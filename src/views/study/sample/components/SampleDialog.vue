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
      <el-form-item label="受试者" prop="subjectId">
        <el-select v-model="form.subjectId" clearable :placeholder="subjectIdPlaceholder" @change="handleSubjectChange">
          <el-option v-for="item in subjectTableData" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="受试者筛选编号" prop="screeningnNo">
        <el-input v-model="form.screeningnNo" :placeholder="screeningnNoPlaceholder" />
      </el-form-item> -->
      <el-form-item label="条形码" prop="barCode">
        <el-input v-model="form.barCode" :placeholder="barCodePlaceholder" />
      </el-form-item>
      <el-form-item label="采集日期" prop="collectionDate">
        <el-date-picker
          v-model="form.collectionDate"
          type="date"
          value-format="timestamp"
          :placeholder="collectionDatePlaceholder"
        />
      </el-form-item>
      <el-form-item label="样本类型" prop="type">
        <el-input v-model="form.type" :placeholder="typePlaceholder" />
      </el-form-item>
      <el-form-item label="未入组的原因" prop="reason">
        <el-select v-model="form.reason" clearable :placeholder="reasonPlaceholder">
          <el-option v-for="(item, index) in reasonOptions" :key="index" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="背景信息" prop="background">
        <el-input v-model="form.background" type="textarea" :placeholder="backgroundPlaceholder" />
      </el-form-item>
      <el-form-item label="入组编号" prop="no">
        <el-input v-model="form.no" type="text" :placeholder="noPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="form.remark" type="textarea" :placeholder="remarkPlaceholder" />
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
  name: 'SampleDialog',
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
    subjectTableData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      subjectIdPlaceholder: '请选择受试者',
      screeningnNoPlaceholder: '请输入筛选编号',
      barCodePlaceholder: '请输入条形码',
      collectionDatePlaceholder: '请选择采集日期',
      typePlaceholder: '请输入样本类型',
      reasonPlaceholder: '请选择未入组的原因',
      backgroundPlaceholder: '请输入临床诊断背景信息',
      noPlaceholder: '请输入入组编号',
      remarkPlaceholder: '请输入备注',
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        subjectId: [{ required: true, message: this.subjectIdPlaceholder, trigger: 'blur' }],
        screeningnNo: [{ required: true, message: this.screeningnNoPlaceholder, trigger: 'blur' }],
        barCode: [{ required: true, message: this.barCodePlaceholder, trigger: 'blur' }],
        collectionDate: [{ required: true, message: this.collectionDatePlaceholder, trigger: 'blur' }],
        type: [{ required: true, message: this.typePlaceholder, trigger: 'blur' }],
        background: [{ required: true, message: this.backgroundPlaceholder, trigger: 'blur' }],
        no: [{ required: true, message: this.backgroundPlaceholder, trigger: 'blur' }],
      };
    },
    reasonOptions() {
      return [
        {
          label: '样本信息不完整、不能溯源',
          value: 'A',
        },
        {
          label: '样本体积不足检查',
          value: 'B',
        },
        {
          label: '不符合样本采集与保存要去',
          value: 'C',
        },
        {
          value: 'D',
          label: '严重溶血、严重黄疸、严重淤血',
        },
      ];
    },
    typeOptions() {
      return [
        {
          label: '血清',
          value: '血清',
        },
      ];
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
      return {
        screeningnNo: Math.round(Math.random() * 80 + 20),
        subjectId: null,
        barCode: null,
        collectionDate: null,
        background: null,
        type: null,
        reason: null,
        no: null,
        remark: null,
        subject: {},
        status: 'pending',
        date: new Date().getTime(),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
