<!--
 * @Author: airmz
 * @Date: 2021-12-16 10:45:06
 * @LastEditTime: 2021-12-29 09:17:01
 * @FilePath: /pd/src/common/pageDesign/index/cloud.vue
-->
<template>
  <div id="cloud">
    <div class="cloud">
      <img class="cloudImg" src="http://airmz.top/tc.png" alt="" />
      <span>何时想起，即时创作</span>
      <p>登录账号，作品保存到云端</p>
      <el-button size="mini" @click="opens" type="primary">点击登录</el-button>
    </div>
    <el-dialog
      title="扫码登录"
      :visible.sync="dialogVisible"
      width="70%"
      height="400px"
    >
      <!-- <iframe style="width: 620px;height: 500px;margin-top: 10px;margin-top: -10px;" :src="url"></iframe> -->
      <div class="loginImg">
        <div>
          <div class="loginTitle">
            <div class="TitleTop">
              <span
                >使用<span class="TitleRed">抖音App</span
                >，打开首页搜索-扫一扫</span
              >
            </div>
            <span class="TitleTop">安全登录，防止盗号</span>
          </div>
          <div>
            <img
              class="er"
              src="https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg"
              alt=""
            />
          </div>
        </div>
        <div class="loginSubTitle">
          <span class="TitleTop">巨快剪将获得以下权限</span>
          <span>
            <i class="el-icon-circle-check"></i>
            <p>将获得你的公开信息（头像、昵称、地区和性别）</p></span
          >
          <span>
            <i class="el-icon-circle-check"></i>
            <p>获取你在抖音内收藏的音乐列表</p></span
          >
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
const NAME = "cloud";
export default {
  name: NAME,
  data() {
    return {
      dialogVisible: false,
    };
  },
  methods: {
    opens() {
      // this.dialogVisible = true;
      this.$parent.open();
    },
  },
};
</script>
<style  lang="stylus" scoped>
.cloud {
  width: 500px;
  height: 500px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}

.cloudImg {
  width: 40%;
}

.cloud span {
  font-size: 15px;
  color: #ffffff;
  font-weight: 900;
  margin-top: 35px;
}

.cloud p {
  font-size: 10px;
  color: #4c4c4c;
  font-weight: 900;
  margin: 10px;
}

/deep/ .el-button--primary {
  background-color: #00c6d2;
}

/deep/.el-button--mini {
  font-size: 13px;
  font-weight: 900;
  margin-top: 10px;
}

.er {
  width: 300px;
  height: 300px;
}

.loginImg {
  display: flex;
  flex-flow: row;
  justify-content: space-around;
}

.loginTitle {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.TitleTop {
  display: flex;
  flex-flow: row;
  color: #5c5c5c;
  font-weight: 600;
  margin-bottom: 20px;
}

.TitleRed {
  color: #fe0404;
  font-weight: 600;
}

.loginSubTitle {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
}

.loginSubTitle span {
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
}
/deep/ .el-button--info:focus{
  background: none;
  border: none
}
/deep/ .el-button--info:hover{
  background: none;
  border: none
}
</style>