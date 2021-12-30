<template>
  <div id="works">
    <div class="title">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="视频作品" name="video">
          <div class="lift-title">
            <span>视频作品</span>
            <p>({{ videoTotal }})</p>
          </div>
        </el-tab-pane>
        <el-tab-pane label="图片作品" name="img">
          <div class="lift-title">
            <span>图片作品</span>
            <p>({{ imgTotal }})</p>
          </div>
        </el-tab-pane>
      </el-tabs>
      <!-- <div class="lift-title">
        <span>剪辑草稿</span>
        <p>({{ total }})</p>
      </div> -->
      <div style="display: flex" v-if="1 == 2">
        <div v-show="!videoCheck" style="display: flex; margin-right: 10px">
          <!-- <el-button
            size="mini"
            :disabled="this.deleteVideo.length == 0"
            type="info"
            >备份草稿</el-button
          > -->
          <el-button
            size="mini"
            :disabled="this.checkList.length == 0"
            type="info"
            @click="delectTemp"
            >删除</el-button
          >
        </div>
        <el-button size="mini" @click="videoCheckBox" type="info">{{
          title
        }}</el-button>
      </div>
    </div>
    <div>
      <el-scrollbar style="height: 425px">
        <el-checkbox-group v-model="checkList">
          <div class="videoList" v-infinite-scroll="loadMoreLocal">
            <div v-for="(item, index) in worksList" :key="index">
              <img
                v-if="item.type == 0"
                class="videoImg"
                :src="item.link + '?imageView2/1/w/160/h/160'"
                @click="previewWorks(item)"
                alt=""
              />
              <img
                v-if="item.type == 1 && item.videoStats != 'wait'"
                class="videoImg"
                :src="item.link + '?vframe/jpg/offset/1|imageView2/0/w/500'"
                @click="previewWorks(item)"
                alt=""
              />
              <el-progress
                v-if="item.videoStats == 'wait'"
                type="circle"
                :percentage="item.progress"
              ></el-progress>
              <el-popover width="150" trigger="click">
                <div class="popover">
                  <ul>
                    <li class="popover-li" @click="previewWorks(item)">
                      <span>预览</span>
                    </li>
                    <li class="popover-li" @click="download(item.link)">
                      <span>下载</span>
                    </li>
                    <li
                      class="popover-li"
                      v-if="item.type == 1"
                      @click="showPublishDialog(item)"
                    >
                      <span>发布</span>
                    </li>
                    <li class="popover-li" @click="delWorks(item)">
                      <span>删除</span>
                    </li>
                  </ul>
                </div>
                <el-button
                  class="popoverBtn"
                  icon="el-icon-more"
                  type="info"
                  slot="reference"
                ></el-button>
              </el-popover>
              <el-checkbox
                class="videoCheck"
                v-show="!videoCheck"
                @change="check(item.id)"
                :true-label="item.id"
                :label="item.id"
              ></el-checkbox>
              <div class="videoTitle">
                <span>{{ item.title }}</span>
                <!--   <div class="videoSubTitle">
                <p>1.2k</p>
                <p>|</p>
                <p>0.00s</p>
              </div>-->
              </div>
            </div>
          </div>
        </el-checkbox-group>
      </el-scrollbar>
    </div>
    <el-dialog
      title="修改模板名称"
      :visible.sync="tempNameVisible"
      width="30%"
      height="200px"
    >
      <el-input v-model="works.title" placeholder="请输入模板名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tempNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTemp">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="预览"
      :visible.sync="dialogVisible"
      width="240px"
      height="482px"
      custom-class="note-dialog"
    >
      <div
        v-if="works.type == 0"
        class="priImg"
        :style="
          'background: url(' +
          works.link +
          ');width: 100%;height: 400px;background-size: cover;'
        "
      ></div>
      <video
        v-if="works.type == 1"
        controls
        class="priImg"
        :src="works.link"
        style="width: 225px; height: 400px; background-size: cover"
      ></video>
    </el-dialog>
    <el-dialog :visible.sync="publishDialogVisible" width="50%" height="600px">
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
            <!-- <span class="TitleTop">请在 {{ time }}s 内扫码登录</span> -->
          </div>
          <div>
            <img class="er" :src="loginUrl" alt="" />
          </div>
        </div>
        <div class="loginSubTitle">
          <span class="TitleTop">请输入发布信息：</span>
          <span class="releaseSpan">
            <!-- <i class="el-icon-circle-check"></i> -->
            <p class="releaseP">视频标题：</p>
            <el-input
              placeholder="请输入视频标题"
              size="small"
              v-model="publishInfo.videoTitle"
            >
              <!-- <template slot="prepend">123</template> -->
            </el-input>
          </span>
          <span class="releaseSpan">
            <!-- <i class="el-icon-circle-check"></i> -->
            <p class="releaseP">抖音地址：</p>
            <el-input
              placeholder="请输入地址链接"
              size="small"
              v-model="publishInfo.videoPoi"
            >
              <!-- <template slot="prepend">123</template> -->
            </el-input>
          </span>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <el-button type="primary" @click="getQrcode">获取二维码</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
const NAME = "works";
export default {
  name: NAME,
  data() {
    return {
      videoList: [],
      visible: false,
      checked: true,
      videoCheck: true,
      title: "批量管理",
      disabled: true,
      deleteVideo: [],
      lastLength: 0,
      tempNameVisible: false,
      works: {},
      deletArr: [],
      checkList: [],
      isFirst: true,
      activeName: "video",
      worksList: [],
      imgTotal: 0,
      videoTotal: 0,
      nowType: 1,
      page: 1,
      size: 10,
      dialogVisible: false,
      publishDialogVisible: false,
      publishInfo: {
        id: null,
        videoTitle: "",
        videoPoi: "",
      },
      loginUrl: "http://airmz.top/er.jpg",
    };
  },
  watch: {
    videoInfo: function () {
      console.log("home", this.videoInfo);
    },
  },
  mounted() {
    this.workTab = this.$validator.getUrlKey("workTab");
    if (this.workTab!="") {
      if (this.workTab == 0) {
        this.worksList = [];
        this.nowType = 1;
        this.activeName = "video";
        this.getWorks(this.nowType, 1);
      } else if (this.workTab == 1) {
        this.worksList = [];
        this.nowType = 0;
        this.activeName = "img";
        this.getWorks(this.nowType, 1);
      }
    } else {
      this.worksList = [];
      this.nowType = 1;
      this.activeName = "video";
      this.getWorks(this.nowType, 1);
    }
  },
  destroyed() {},
  props: ["disable", "workTab"],
  methods: {
    previewWorks(item) {
      if (item.videoStats == "wait") {
        this.$message({
          type: "info",
          message: "作品正在生成中，预计1-3分钟",
        });
        return;
      }
      this.dialogVisible = true;
      this.works = item;
    },
    openRename(item) {
      console.log();
      this.temp = item;
      this.tempNameVisible = true;
    },
    handleClick(tab, event) {
      console.log(tab.name);
      if (tab.name == "video") {
        this.worksList = [];
        this.nowType = 1;
        this.getWorks(this.nowType, 1);
      } else if (tab.name == "img") {
        this.worksList = [];
        this.nowType = 0;
        this.getWorks(this.nowType, 1);
      }
    },
    showPublishDialog(item) {
      this.loginUrl = "http://airmz.top/er.jpg";
      this.publishInfo.id = item.id;
      this.publishDialogVisible = true;
    },
    getWorks(type, page) {
      if (page) {
        this.page = page;
      } else {
        page = this.page;
      }
      //0：图片    1：视频
      var user = this.$local.get("user");
      if (!user || !user.id) {
        return;
      }
      var data = {
        uid: user.id,
        type: type,
        page: page,
        size: 12,
      };
      this.$axios
        .post(
          this.$domain + "/api/getTaskCreateList?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            if (type == 0) {
              //图片
              this.imgTotal = res.data.data.totalElements;
              console.log(this.worksList);
              if (this.worksList.length > 0) {
                this.worksList = this.worksList.concat(res.data.data.content);
              } else {
                this.worksList = res.data.data.content;
              }
              console.log(this.worksList);
              console.log(this.imgTotal);
            } else if (type == 1) {
              //视频
              this.videoTotal = res.data.data.totalElements;
              console.log(this.worksList);
              if (this.worksList.length > 0) {
                this.worksList = this.worksList.concat(res.data.data.content);
              } else {
                this.worksList = res.data.data.content;
              }
              console.log(this.worksList);
              console.log(this.videoTotal);
            }
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    getQrcode() {
      var data = this.publishInfo;
      if (data.videoTitle == "") {
        this.$message({
          showClose: false,
          message: "请输入视频标题",
          type: "error",
        });
        return;
      }
      this.$axios
        .post(
          this.$domain + "/api/douyin/saveDesignMaterial?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res);
            this.loginUrl = res.data.data;
            this.$message({
              showClose: false,
              message: "获取成功！",
              type: "success",
            });
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    download(link) {
      window.location.href = link + "?attname=";
      // this.$router.push(link + "?attname=");
    },
    saveTemp() {
      var data = {
        id: this.temp.id,
        title: this.temp.title,
      };
      this.$axios
        .post(this.$domain + "/api/saveTempName?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "success",
            });
            this.tempNameVisible = false;
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    copyTemp(temp) {
      var data = {
        id: temp.id,
      };
      this.$axios
        .post(this.$domain + "/api/copyTemp?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "success",
            });
            this.tempNameVisible = false;
            this.$parent.local();
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    publish(temp) {
      var data = {
        id: temp.id,
      };
      this.$axios
        .post(this.$domain + "/api/publishTemple?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "success",
            });
            this.tempNameVisible = false;
            this.$parent.local();
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    delWorks(temp) {
      this.$confirm("此操作将永久删除该作品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          var data = {
            id: temp.id,
          };
          this.$axios
            .post(
              this.$domain + "/api/delDesignMaterial?",
              this.$qs.stringify(data)
            )
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  showClose: false,
                  message: res.data.msg,
                  type: "success",
                });
                this.tempNameVisible = false;
                this.worksList = [];
                this.getWorks(this.nowType, 1);
              } else {
                this.$message({
                  showClose: false,
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    delectTemp() {
      for (var i = 0; i < this.checkList.length; i++) {
        if (this.checkList[i] != "null" && this.checkList[i] > 0) {
          var data = {
            id: this.checkList[i],
          };
          this.$axios
            .post(this.$domain + "/api/delTemple?", this.$qs.stringify(data))
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  showClose: false,
                  message: res.data.msg,
                  type: "success",
                });
                this.tempNameVisible = false;
                if ((this.checkList.length = i + 1)) {
                  // window.location.href = "/";
                  this.$router.push("/");
                }
              } else {
                this.$message({
                  showClose: false,
                  message: res.data.msg,
                  type: "error",
                });
              }
            });
        }
      }
    },
    editTemp(id) {
      console.log(id);
      // window.location.href = "/main?type=edit&tid=" + id;
      this.$router.push("/main?type=edit&tid=" + id);
    },
    videoCheckBox() {
      this.videoCheck = !this.videoCheck;
      if (this.videoCheck == false) {
        this.title = "取消";
      } else {
        this.title = "批量管理";
      }
    },
    check(id) {
      if (this.checkList.includes(id)) {
        var tempList = [];
        for (var i = 0; i < this.checkList.length; i++) {
          if (this.checkList[i] != id) {
            tempList.push(this.checkList[i]);
          }
        }
        console.log(tempList);
        this.checkList = tempList;
      } else {
        this.checkList.push(id);
      }

      console.log(this.checkList);
      if (this.deleteVideo.length != 0) {
        this.disabled = false;
      }
    },
    addRoutes() {
      this.$router.replace("/main");
    },
    loadMoreLocal() {
      console.log("isFirst" + this.isFirst);
      //触发底部
      if (this.isFirst || this.disable == 1) {
        this.isFirst = false;
      } else {
        this.getWorks(this.nowType, this.page + 1);
      }
    },
  },
};
</script>

<style  lang="stylus" scoped>
#works {
  padding: 30px;
}

.videoList {
  display: grid;
  grid-template-columns: repeat(4, 25%);
  justify-items: center;
  margin-top: 30px;
  row-gap: 10px;
}

.videoImg {
  width: 130px;
  height: 130px;
  border-radius: 10px;
  cursor: pointer;
  object-fit: cover;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 30px;
}

.lift-title {
  display: flex;
  flex-flow: row;
  color: #ffffff;
  font-weight: 900;
}

.videoTitle {
  margin-top: -30px;
}

.videoTitle span:nth-child(1) {
  color: #ffffff;
  font-size: 10px;
  font-weight: 900;
}

.videoSubTitle {
  display: flex;
  flex-flow: row;
  align-items: center;
  margin-top: 3px;
}

.videoSubTitle p {
  color: #4c4c4c;
  font-size: 10px;
  font-weight: 900;
}

.start-main {
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.startBtn {
  width: 98%;
  height: 120px;
  background-color: #242424;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px auto;
  cursor: pointer;
}

.startBtn:hover {
  width: 98%;
  height: 120px;
  background-color: #373838;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 25px auto;
  cursor: pointer;
}

.popover {
  background-color: #050507;
  border-radius: 10px;
  border: solid 1px #666666;
  color: #ffffff;
  font-weight: 800;
  width: 76%;
  margin-left 13px;
}

.popoverBtn {
  background-color: #2d2c2e00!important;
  border: none!important;
  position: relative;
  top: -30px;
  left: 88px;
}

.el-scrollbar__wrap {
  overflow-y: scroll;
}

.popover-li {
  font-size: 10px;
  width: 90%;
  height: 30px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
}

.popover-li:hover {
  background-color: #242323;
}

.videoCheck {
  position: relative;
  top: -138px;
  left: -51px;
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav {
  border-radius: 15px;
  border: solid 1px #ffffff;
}

/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  border-bottom: none;
}

/deep/ .el-tabs--card>.el-tabs__header {
  border: none;
}

/deep/ .el-tabs__item.is-active {
  color: #00c6d2;
  font-weight: 900;
}

/deep/ .el-tabs__item {
  color: #666666;
}

.priImg {
  background: #ccc;
  width: 225px;
  height: 400px;
  background-size: cover !important;
}

/deep/ .el-dialog {
  // background: #2e2b2b;
  border-radius: 10px;
  height: 470px;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

/deep/ .el-dialog__title {
  // color: #13eb2e;
  font-weight: 900;
}

/deep/ .el-dialog__footer {
  padding: 0px 20px 20px;
}

/deep/ .el-dialog__header {
  padding: 0px 20px 2px;
  text-align: center;
  font-size: 8px;
  -webkit-transform: scale(0.8);
}

/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #90939900;
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
  // margin-top: 8px;
  margin-bottom: 8px;
}

.releaseSpan {
  display: flex;
  align-items: center;
}

.releaseP {
  width: 100px;
}

.releaseImg {
  width: 200px;
  height: 200px;
}

/deep/ .el-dialog__wrapper {
  background-color: #ffffff;
}
</style>
<style lang="stylus">
.el-popover {
  min-width: 150px;
  border: none !important;
  background: none !important;
  padding-left: 32px;
  padding-right: 32px;
  border-radius: 10px !important;
  margin-top: 3px;
}

.el-scrollbar__wrap {
  overflow: hidden;
  overflow-y: scroll !important;
  height: 100% !important;
}

.note-dialog {
  background: #2e2b2b !important;

  .el-dialog__wrapper {
    background-color: #ffffff !important;
  }

  .el-dialog {
    border-radius: 10px;
    height: 480px;
    background: #2e2b2b !important;
  }

  .el-dialog__header {
    margin-top: -20px;
  }

  .el-dialog__body {
    display: flex;
    justify-content: center;
    padding: 0;
  }

  .el-dialog__title {
    color: #13eb2e;
    font-weight: 900;
  }
}
/deep/ .el-button--info:focus{
  background: none!important;
  border: none!important;
}
/deep/ .el-button--info:hover{
  background: none!important;
  border: none!important;
}
</style>