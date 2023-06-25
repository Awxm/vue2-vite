<template>
  <div class="tinymce-editor">
    <editor v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick" />
  </div>
</template>
<script>
import Editor from '@tinymce/tinymce-vue';
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/skins/ui/oxide/skin.css';
// 编辑器插件plugins
// 更多插件参考：https://www.tiny.cloud/docs/plugins/
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/wordcount'; // 字数统计插件
// import '@/tinymce/plugins/placehold'; // 占位符
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/preview';
import emoticons from '@/tinymce/emoticons/js/emojis';
import cn from '@/tinymce/langs/zh_CN.js';
export default {
  components: {
    Editor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    // 基本路径，默认为空根目录，如果你的项目发布后的地址为目录形式，
    // 即abc.com/tinymce，baseUrl需要配置成tinymce，不然发布后资源会找不到
    baseUrl: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default: 'lists image media table wordcount',
    },
    toolbar: {
      type: [String, Array],
      default:
        'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists table | removeformat',
    },
  },
  data() {
    return {
      emoticons,
      init: {
        language_url: cn,
        language: 'zh_CN',
        skin_url: `/tinymce/skins/ui/oxide`,
        content_css: `/tinymce/skins/content/default/content.css`,
        height: 500,
        plugins: this.plugins,
        toolbar: this.toolbar,
        browser_spellcheck: true, // 拼写检查
        branding: false, // 去水印
        elementpath: false, // 禁用编辑器底部的状态栏
        statusbar: false, // 隐藏编辑器底部的状态栏
        paste_data_images: true, // 允许粘贴图像
        menubar: false, // 隐藏最上方menu
        // menubar: 'view',
        ctels: false,
        emoticons_database_url: this.emoticons,
        emoticons_append: {
          diy1: {
            keywords: ['diy1'],
            char: '\uD83E\uDD2F',
            category: 'animals_and_nature',
          },
        },
        file_picker_types: 'image',
        images_upload_credentials: true,
        /**
         *  字体大小
         */
        fontsize_formats: '14px 16px 18px 20px 24px 26px 28px 30px 32px 36px',
        font_formats:
          '微软雅黑=Microsoft YaHei,Helvetica Neue;PingFang SC;sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun;serifsans-serif;Terminal=terminal;monaco;Times New Roman=times new roman;times', // 字体
        /**
         * 下面方法是为tinymce添加自定义插入图片按钮
         * 借助iview的Upload组件,将图片先上传到存储云上，再将图片的存储地址放入编辑器内容
         */
        // 图片上传三个参数，图片数据，成功时的回调函数，失败时的回调函数
        images_upload_handler: (blobInfo, success) => {
          var formData = new FormData();
          formData.append('file', blobInfo.blob(), blobInfo.filename());
          formData.append('type', 'article');
          formData.append('groupName', 'article');
          formData.append('remark', '');

          this.$post(this.urls.cloud_file.single_upload, formData)
            .then((result) => {
              success(result.fileUrl);
            })
            .catch(() => {
              this.$message.error('上传失败');
            });
        },
      },
      myValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
    },
    myValue(newValue) {
      this.$emit('input', newValue);
    },
  },
  mounted() {
    tinymce.init({});
  },
  beforeDestroy() {
    this.$nextTick(() => {
      const textarea = document.querySelector('.tinymce-editor textarea');
      if (textarea) textarea.remove();
    });
  },
  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit('onClick', e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = '';
    },
  },
};
</script>
