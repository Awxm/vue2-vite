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
    <el-input v-model="form.introduction" type="textarea" rows="10" cols="30" wrap="off" placeholder="请输入内容" />
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
    dialogType: {
      type: String,
      default: 'create',
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
      form: null,
    };
  },
  computed: {},
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
      if (this.form.introduction) {
        const data = [];
        if (this.dialogType === 'create') {
          const pretext = this.form.introduction.replace(/\r\n/g, ',').replace(/\n/g, ',');
          const splitData = pretext.split(',');
          for (let index = 0; index < splitData.length; index++) {
            const introduction = splitData[index];
            if (introduction !== '') data.push({ introduction });
          }
        }
        this.$emit('update:dialog', false);
        this.$emit('handleSubmitClick', this.dialogType === 'create' ? data : this.form);
      } else {
        this.$message.error('内容不能为空');
      }
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
        introduction: null,
        date: new Date().getTime(),
      };
    },
  },
};
</script>
<style lang="scss" scoped>
@import '@/styles/el-dialog/index.scss';
</style>
