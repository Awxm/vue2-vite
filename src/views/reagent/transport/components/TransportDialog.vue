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
    <el-form ref="form" label-position="right" label-width="220px" :model="form" :rules="rules">
      <el-form-item label="开始地点" prop="startPoint">
        <el-input v-model="form.startPoint" type="text" :placeholder="startPointPlaceholder" />
      </el-form-item>
      <el-form-item label="截止地点" prop="endPoint">
        <el-input v-model="form.endPoint" type="text" :placeholder="endPointPlaceholder" />
      </el-form-item>
      <!-- 试剂清单 -->
      <!-- <template v-for="(item, index) in form.reagent">
        <el-form-item
          :key="index"
          :label="`试剂${index}`"
          :prop="`reagent.${index}.name`"
          :rules="{ required: true, message: reagentPlaceholder, trigger: 'blur' }"
        >
          <el-input v-model="item.name" type="text" :placeholder="reagentPlaceholder" clearable />
        </el-form-item>
        <el-form-item
          :key="index"
          :label="`数量${index}`"
          :prop="`reagent.${index}.number`"
          :rules="{ required: true, message: '请输入数量' }"
        >
          <el-input v-model="item.number" type="text" placeholder="数量不能为空" clearable />
        </el-form-item>
      </template> -->

      <el-form-item label="装箱时间" prop="packingTime">
        <el-date-picker
          v-model="form.packingTime"
          type="date"
          value-format="timestamp"
          :placeholder="packingTimePlaceholder"
        />
      </el-form-item>
      <el-form-item label="装箱温度" prop="packingTemperature">
        <el-input
          v-model="form.packingTemperature"
          type="text"
          :placeholder="packingTemperaturePlaceholder"
          clearable
        />
      </el-form-item>
      <el-form-item label="装箱者" prop="boxer">
        <el-input v-model="form.boxer" type="text" :placeholder="boxerPlaceholder" clearable />
      </el-form-item>
      <el-form-item label="开箱时间" prop="unpackingTime">
        <el-date-picker
          v-model="form.unpackingTime"
          type="date"
          value-format="timestamp"
          :placeholder="unpackingTimePlaceholder"
        />
      </el-form-item>
      <el-form-item label="开箱温度" prop="unpackingTemperature">
        <el-input
          v-model="form.unpackingTemperature"
          type="text"
          :placeholder="unpackingTemperaturePlaceholder"
          clearable
        />
      </el-form-item>
      <el-form-item label="接收产品外观,包装是否良好？" prop="appearance">
        <el-radio-group v-model="form.appearance">
          <el-radio v-for="(item, index) in Options" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!form.appearance" label="详细说明" prop="appearanceNotes">
        <el-input v-model="form.appearanceNotes" type="textarea" :placeholder="notesPlaceholder" rows="2" />
      </el-form-item>
      <el-form-item label="收货产品数量是否与清单一致？" prop="quantity">
        <el-radio-group v-model="form.quantity">
          <el-radio v-for="(item, index) in Options" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!form.quantity" label="详情说明" prop="quantityNotes">
        <el-input v-model="form.quantityNotes" type="textarea" :placeholder="notesPlaceholder" rows="2" />
      </el-form-item>
      <el-form-item label="产品运输温度记录是否正常？" prop="temperature">
        <el-radio-group v-model="form.temperature">
          <el-radio v-for="(item, index) in Options" :key="index" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="!form.temperature" label="详情说明" prop="temperatureNotes">
        <el-input v-model="form.temperatureNotes" type="textarea" :placeholder="notesPlaceholder" rows="2" />
      </el-form-item>
      <el-form-item label="接受者" prop="receiver">
        <el-input v-model="form.receiver" type="text" :placeholder="receiverPlaceholder" clearable />
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
  name: 'TransportDialog',
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
      startPointPlaceholder: '请输入开始地点',
      endPointPlaceholder: '请输入截止地点',
      reagentPlaceholder: '请输入试剂清单',
      packingTimePlaceholder: '请选择装箱时间',
      packingTemperaturePlaceholder: '请输入装箱温度',
      boxerPlaceholder: '请输入装箱者',
      unpackingTimePlaceholder: '请选择开箱时间',
      unpackingTemperaturePlaceholder: '请选择开箱温度',
      notesPlaceholder: '请输入详情说明',
      receiverPlaceholder: '请输入接受者',
      Options: [{ label: '是', value: true }, { label: '否', value: false }],
      form: null,
    };
  },
  computed: {
    rules() {
      return {
        startPoint: [{ required: true, message: this.startPointPlaceholder, trigger: 'blur' }],
        endPoint: [{ required: true, message: this.endPointPlaceholder, trigger: 'blur' }],
        reagent: [{ required: true, message: this.reagentPlaceholder, trigger: 'blur' }],
        packingTime: [{ required: true, message: this.packingTimePlaceholder, trigger: 'blur' }],
        packingTemperature: [{ required: true, message: this.packingTemperaturePlaceholder, trigger: 'blur' }],
        boxer: [{ required: true, message: this.boxerPlaceholder, trigger: 'blur' }],
        unpackingTime: [{ required: true, message: this.unpackingTimePlaceholder, trigger: 'blur' }],
        unpackingTemperature: [{ required: true, message: this.unpackingTemperaturePlaceholder, trigger: 'blur' }],
        appearance: [{ required: true, message: '请选择产品外观', trigger: 'blur' }],
        appearanceNotes: [{ required: true, message: this.notesPlaceholder, trigger: 'blur' }],
        quantity: [{ required: true, message: '请选择产品数量', trigger: 'blur' }],
        quantityNotes: [{ required: true, message: this.notesPlaceholder, trigger: 'blur' }],
        temperature: [{ required: true, message: '请选择产品运输温度', trigger: 'blur' }],
        temperatureNotes: [{ required: true, message: this.notesPlaceholder, trigger: 'blur' }],
        receiver: [{ required: true, message: this.receiverPlaceholder, trigger: 'blur' }],
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
        startPoint: null,
        endPoint: null,
        reagent: [{ name: null, number: 0 }],
        packingTime: null,
        packingTemperature: null,
        boxer: null,
        unpackingTime: null,
        unpackingTemperature: null,
        appearance: true,
        appearanceNotes: null,
        quantity: true,
        quantityNotes: null,
        temperature: true,
        temperatureNotes: null,
        receiver: null,
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
