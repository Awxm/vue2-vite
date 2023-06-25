import { mapGetters } from 'vuex';

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['studyId']),
  },
  watch: {
    studyId: {
      handler(value) {
        if ((value ?? '') !== '') this.requestApi();
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
};
