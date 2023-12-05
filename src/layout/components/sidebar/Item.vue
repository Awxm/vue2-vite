<script lang="jsx">
export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    isArrow: {
      type: [Boolean, String],
      default: false,
    },
  },
  render(h, context) {
    const { icon, title, isArrow } = context.props;
    const vnodes = [];

    if (icon){
      if (icon.includes('el-icon')) {
        vnodes.push(<i class={[icon, 'sub-el-icon']} />)
      } else {
        vnodes.push(<i class={[icon,'iconfont', 'sub-el-icon']} />);
      }
    }

    if (title) {
      vnodes.splice(
        2,
        0,
        <span
          // eslint-disable-next-line jsx-quotes
          class="sub-title"
          style={`width: ${isArrow ? '110px' : '100%'}`}
          title={title}
          // eslint-disable-next-line jsx-quotes
          slot="title"
        >
          {title}
        </span>,
      );
    }
    return vnodes;
  },
};
</script>

<style scoped>
.sub-el-icon {
  width: 1em;
  height: 1em;
  color: currentcolor;
}
</style>
