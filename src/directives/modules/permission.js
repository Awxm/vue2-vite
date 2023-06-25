import store from '@/store';
// 判断权限方法
export default {
  inserted(el, binding) {
    const { value } = binding;
    /**
     * 1.从staore拿到权限列表
     * 2.根据指令上面的binding参数,判断是否有拥有该权限
     * 3.如果存在的话如果不存在
     */
    const permissionList = store.getters && store.getters.p;
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;
      const hasPermission = permissionList.some((role) => permissionRoles.includes(role));
      if (!hasPermission) {
        return el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('need roles!');
    }
  },
};
