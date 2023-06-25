const mixin = {
  data() {
    return {
      filterTableStatus: null,
    };
  },
  computed: {
    filtersDataDictionartyCode() {
      return (code) => {
        const dictionartyCode = this.$store.getters.dataDictionarty_code[code].items.map(({ itemText, itemValue }) => ({
          text: itemText,
          value: itemValue,
        }));
        return dictionartyCode;
      };
    },
  },
  methods: {
    handleFilterChange({ status }, callback) {
      this.filterTableStatus = status.length === 0 ? null : status[0];
      callback();
    },
  },
};
export default mixin;
