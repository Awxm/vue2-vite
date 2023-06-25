// import parseTime, formatTime and set to filter
import store from '@/store';

export { parseTime } from '@/utils';

export function statusItemText(value, code, isStr = true) {
  if (!value) return '暂无';
  let explain = isStr ? null : [];
  if (isStr ? !value : value.length === 0) return;
  const dictionary = store.getters.dataDictionarty_code[code];
  if (!dictionary) return;
  const { items } = dictionary;
  if (isStr) {
    explain = items.find((f) => f.itemValue === value)?.itemText;
  } else {
    for (let index = 0; index < value.length; index++) {
      const item = items.find((f) => f.itemValue === value[index]);
      if (item) explain.push(item?.itemText);
    }
  }
  return isStr ? explain : explain.toString();
}
