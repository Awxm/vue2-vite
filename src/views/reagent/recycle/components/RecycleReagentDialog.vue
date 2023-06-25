<template>
  <el-dialog
    center
    title="试剂列表"
    width="1200px"
    :visible.sync="dialog"
    :show-close="false"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :destroy-on-close="true"
    @closed="handleClosed"
  >
    <div style="margin-bottom: 20px;text-align: right;">
      <el-button type="primary" @click="handleRecycleCreateClick"> 添加 </el-button>
    </div>

    <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#F5F6F8', color: '#191D30' }">
      <el-table-column prop="reagentId" label="试剂名称" min-width="180">
        <template slot-scope="scope">
          <el-select
            v-model="scope.row.reagentId"
            clearable
            placeholder="请选择试剂"
            @change="handleReagentChange($event, scope.$index)"
          >
            <el-option v-for="item in reagentData" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="生产厂家" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.reagent">{{ scope.row.reagent.producer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.reagent">{{ scope.row.reagent.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批号" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.reagent">{{ scope.row.reagent.batchNumber }}</span>
        </template>
      </el-table-column>
      <el-table-column label="失效时间" min-width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.reagent" style="margin-left: 10px">
            {{ scope.row.reagent.failureTime | parseTime('{y}-{m}-{d}') }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="num" label="数量" min-width="180">
        <template slot-scope="scope">
          <el-input v-model="scope.row.recipient" placeholder="请输入数量" />
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注">
        <template slot-scope="scope">
          <el-input v-model="scope.row.remark" placeholder="请输入备注" />
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmitClick"> 确认 </el-button>
      <el-button @click="handleCancelClick"> 取消 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'RecycleReagentDialog',
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
    tableData: {
      type: Array,
      default: () => [],
    },
    reagentData: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      reagentIdPlaceholder: '请选择试剂名称',
      numberPlaceholder: '请输入数量',
      remarkPlaceholder: '请输入备注',
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 关联药品
    handleRecycleCreateClick() {
      this.$emit('handleRecycleCreateClick', { reagentId: null, num: null, reagent: {}, remark: null });
    },
    handleReagentChange(id, index) {
      const f = this.reagentData.find((f) => f.id === id);
      this.$set(this.tableData[index], 'reagent', f);
    },
    handleSubmitClick() {
      const aa = [];
      if (aa) {
        this.$emit('update:dialog', false);
        this.$emit('handleSubmitClick', this.tableData);
      }
    },
    handleCancelClick() {
      this.$emit('update:dialog', false);
    },
    handleClosed() {
      this.$emit('update:formData', null);
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
