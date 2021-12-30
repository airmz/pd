<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
    <div class="upload-demo">
      <yl-upload
        action="http://192.168.28.103:10001/file/upload"
        multiple
        :data="chunkData"
        :on-success="handleSuccess"
        :chunk-size="1024 * 1024 * 3"
        :thread="4"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
      </yl-upload>
    </div>
  </div>
</template>

<script>
import YlUpload from './upload'
export default {
  name: 'HelloWorld',
  components:{YlUpload},
  props: {
    msg: String
  },
  methods:{
    chunkData(option){
      return{
        size: option.fileSize, // 总文件大小
        chunks: option.chunkTotal, // 所有切片数量
        chunk: option.chunkIndex,// 当前切片下标
        md5: option.chunkHash, // 单个切片hash
        filename: option.fileName, // 文件名
        fileHash: option.fileHash // 整个文件hash
      }
    },
    handleSuccess(response, file, fileList) {
      //文件上传成功
      console.log(response, file, fileList);
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.upload-demo{
  text-align: left;
  width: 400px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #dedede;
}
</style>
