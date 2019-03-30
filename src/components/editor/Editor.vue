<template>
  <div>
    <quill-editor ref="myTextEditor" v-model="html" :options = "editorOption"
                  @change="onEditorChange($event)"></quill-editor>
  </div>
</template>

<script>
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor }from 'vue-quill-editor'
  export default {
    components: {quillEditor},
    data(){
      return{
        html:'',
        content:'',
        editorOption: { //操作按钮
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image', 'video']
            ],
          },
          placeholder: '请输入技术参数...',
        },
      }
    },
    mounted(){
    },
    methods: {
       onEditorChange({ editor, html, text }) {//富文本编辑器  文本改变时 设置字段值
         this.html=html;
         this.content = text;
         this.$emit("on-result-change",html,text);
         },
        _open(data){ //回显内容
          this.html = data;//带标签的
        },
    },
  }
</script>
<style>
.ql-container{
  height:150px !important;
}
</style>

