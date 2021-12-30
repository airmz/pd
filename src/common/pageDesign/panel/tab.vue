<!--
 * @Author: airmz
 * @Date: 2021-12-29 19:12:43
 * @LastEditTime: 2021-12-30 09:45:59
 * @FilePath: /pd/src/common/pageDesign/panel/tab.vue
-->
<template>
  <div id="tab">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#333334"
    >
      <el-menu-item
        @click="activeIndex='1'"
        index="1"
      >片段</el-menu-item>
      <el-menu-item
        @click="activeIndex='2'"
        index="2"
      >音乐</el-menu-item>
      <el-menu-item
        @click="activeIndex='3'"
        index="3"
      >配音</el-menu-item>
    </el-menu>
    <div v-show="activeIndex=='1'">
      <div style="margin-top: 30px">
          <el-tabs
            v-model="activeName"
            tab-position="left"
            @tab-click="handleClick"
          >
            <el-tab-pane label="片段一" name="first">
              <div class="video">
          <div
            class="videoList"
            v-infinite-scroll="loadMoreHot"
            infinite-scroll-disabled="busy"
            infinite-scroll-distance="10"
          >
            <div class="videoList" v-show="videoList">
              <div>
                <div class="upload">
                  <el-upload
                    class="videoUpload"
                    :show-file-list="false"
                    :http-request="sliderRequest"
                    :on-progress="uploadVideoProcess"
                    name="file"
                    accept="video/*"
                    action="qiniu"
                  >
                    <div class="upBtn">
                      <i
                        class="el-icon-circle-plus"
                        style="color: #ffffff; font-size: 18px"
                      ></i>
                      <p>导入素材</p>
                    </div>
                    <p class="upBtnP">请上传横版16:9视频</p>
                  </el-upload>
                </div>
              </div>
              <div>
                <p class="videoTime">40.0</p>
                <div
                  class="bgVideo bgVideoList"
                  @click="selectVideo(defalutVideo)"
                >
                  <img
                    :src="defalutVideo.thumb"
                    alt="index"
                    @click="selectBasicVideo(defalutVideo)"
                    class="thumbnail"
                  />
                </div>
                <span class="videoTitle">{{ defalutVideo.title }}</span>
              </div>
              <div v-for="(item, index) in fileList" :key="index">
                <p class="videoTime">{{ item.fileSize }}</p>
                <div class="bgVideo bgVideoList" @click="selectVideo(item)">
                  <img
                    :src="item.thumb"
                    alt="index"
                    @click="selectBasicVideo(item)"
                    class="thumbnail"
                  />
                </div>
                <span class="videoTitle">{{ item.title }}</span>
              </div>
            </div>
          </div>
        </div>
            </el-tab-pane>
            <el-tab-pane label="片段二" name="second"></el-tab-pane>
            <el-tab-pane label="片段三" name="third"></el-tab-pane>
            <el-tab-pane label="片段四" name="fourth"></el-tab-pane>
            <el-tab-pane label="片段五" name="fifth"></el-tab-pane>
          </el-tabs>
        </div>
    </div>
    <div v-show="activeIndex=='2'">
      <el-tree
        :data="data"
        show-checkbox
        :props="defaultProps"
        node-key="id"
        @node-click="handleNodeClick"
        ref="tree"
      >
        <span
          class="custom-tree-node"
          slot-scope="{ node, data }"
        >
          <span>
            {{ node.label }}
            <i
              @click="play(node.label)"
              :class="{ 'el-icon-video-play': isActive, 'el-icon-video-pause': hasError }"
            ></i>
          </span>
        </span>
      </el-tree>
    </div>
    <div v-show="activeIndex=='3'">
      <el-tree
        :data="data"
        show-checkbox
        :props="defaultProps"
        @node-click="handleNodeClick"
      ></el-tree>
    </div>
  </div>
</template>
<script>
const NAME = "tab-list";
import * as qiniu from "qiniu-js";
import wVideo from "COMMON/pageDesign/widgets/wVideo/wVideo";
import { mapGetters, mapActions } from "vuex";
export default {
  name: NAME,
  data() {
    return {
      checkAll: false,
      select_box: [],
      isActive: true,
      hasError: false,
      activeIndex: "1",
      activeName: "first",
      defaultProps: {
        children: "children",
        label: "label",
      },
      data: [
        {
          id: 1,
          label: "高兴",
          icon: "el-icon-more",
          children: [{ id: 5, label: "今天是个好日子" }],
        },
        {
          id: 2,
          label: "热门",
          children: [
            {
              id: 6,
              label: "今天是个好日子",
            },
            {
              id: 7,
              label: "今天是个好日子",
            },
          ],
        },
        {
          id: 3,
          label: "正能量",
          children: [
            {
              label: "今天是个好日子",
            },
          ],
        },
        {
          id: 4,
          label: "红歌",
          children: [{ id: 8, label: "今天是个好日子" }],
        },
      ],
      videoList: true,
      fileList: {},
      page: 1,
      size: 10,
      total: 0,
      busy: false,
      defalutVideo: {
        fileSize: "9.85",
        link: "https://pic.dd0531.com/upload/3e96a8a8c9ad598d1640411737727202112251216.mp4",
        status: 1,
        thumb:
          "https://pic.dd0531.com/upload/3e96a8a8c9ad598d1640411737727202112251216.mp4?vframe/jpg/offset/1|imageView2/0/w/500",
        title: "演示视频.mp4",
        type: 0,
      },
    };
  },
  ...mapGetters(["dActiveElement"]),
  ...mapActions(["getQiniuToken"]),
  created() {
    this.showVideoList();
    this.getUserVideoList(1);
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleNodeClick(data) {
      console.log(data);
    },
    play(item) {
      // console.log(item.id);
      this.$refs.tree.getCheckedKeys();
      console.log(this.$refs.tree.getCheckedKeys());
      if (item == item) {
        this.isActive = !this.isActive;
        this.hasError = !this.hasError;
      }
    },
    ...mapActions(["addWidget"]),
    selectBasicVideo(item) {
      console.log(item);
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    selectVideo(e) {
      console.log(e);
      this.$parent.videoInfo = e;
    },
    showVideoList() {
      if (this.fileList.length != 0) {
        this.videoList = true;
      } else {
        this.videoList = false;
      }
    },
    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 100;
      if (
        [
          "video/mp4",
          "video/ogg",
          "video/flv",
          "video/avi",
          "video/mov",
          "video/wmv",
          "video/rmvb",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过100MB哦!");
        return false;
      }
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
      console.log(event);
      console.log(file);
    },
    handleVideoSuccess(res, file) {
      //获取上传图片地址
      this.videoFlag = false;
      this.videoUploadPercent = 0;
      if (res.status == 200) {
        this.videoForm.videoUploadId = res.data.uploadId;
        this.videoForm.Video = res.data.uploadUrl;
      } else {
        this.$message.error("视频上传失败，请重新上传！");
      }
    },
    sliderRequest(param) {
      let uploadKey = new Date().getTime() + param.file.name; //上传七牛云需要的key
      var that = this;
      console.log(param);
      console.log(uploadKey);
      const load = that.$loading({
        lock: true,
        text: "上传中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      //向后台获取到上传七牛云的token；
      that.$qiniu.getQiniuToken(that).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          that.$qiniu
            .uploadQiniu(that, res.data.data, param.file, false, uploadKey)
            .then((res) => {
              console.log(res);

              if (res.status == 200) {
                var imgUrl = this.$imgDomain + res.data.key;
                var user = this.$local.get("user");
                var size = param.file.size / 1024 / 1024;
                var data = {
                  uid: user.id,
                  title: param.file.name,
                  type: 0,
                  link: imgUrl,
                  thumb: imgUrl + "?vframe/jpg/offset/1|imageView2/0/w/500",
                  fileSize: size.toFixed(2),
                  hash: res.data.hash,
                };
                that.saveVideo(data);
                console.log(imgUrl);
                load.close();
                this.$message.success("视频上传成功！");
              }
            });
        } else {
          that.$message({
            showClose: true,
            message: "网络错误",
            type: "error",
          });
        }
      });
    },
    saveVideo(dataStr) {
      var data = dataStr;
      this.$axios
        .post(this.$domain + "/api/saveUserVideo?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              showClose: false,
              message: "上传成功",
              type: "success",
            });
            (this.fileList = {}), this.getUserVideoList(1);
          } else {
            //alert(res.data.msg);
            this.$message({
              showClose: false,
              message: "当前视频视频已上传过！",
              type: "error",
            });
          }
        });
    },
    getUserVideoList(page) {
      this.busy = true;
      console.log(page);
      if (page) {
        this.page = page;
      } else {
        page = this.page;
      }
      var user = this.$local.get("user");
      var data = {
        uid: user.id,
        page: page,
        type: 0,
      };
      this.$axios
        .post(this.$domain + "/api/getUserVideoList?", this.$qs.stringify(data))
        .then((res) => {
          this.busy = false;
          if (res.data.code == 200) {
            this.total = res.data.data.totalElements;
            console.log(this.fileList);
            if (this.fileList.length > 0) {
              this.fileList = this.fileList.concat(res.data.data.content);
            } else {
              this.fileList = res.data.data.content;
            }
            console.log(this.fileList);
            console.log(this.total);
          }
        });
    },
    loadMoreHot() {
      //触发底部
      // console.log("触底事件",this.total,this.fileList.length);
      if (this.total > this.fileList.length) {
        this.getUserVideoList(this.page + 1);
      }
    },
  },
};
</script>
<style  lang="stylus" scoped>
/deep/ .el-menu.el-menu--horizontal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

/deep/ .el-menu--horizontal>.el-menu-item.is-active {
  color: #33e0c0;
}

/deep/ .el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 5px solid #33e0c0;
}

/deep/ .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: #33e0c0;
}

/deep/ .el-tree-node__content {
  background-color: #1b1b1c;
}

/deep/ .el-tree-node:focus>.el-tree-node__content {
  background-color: #333334;
}
</style>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#text-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .basic-text-wrap {
    width: 100%;
    border-bottom: 1px solid #092625;
    padding: 60px 0;
    text-align: center;

    .basic-text-item {
      width: 100%;
      text-align: center;
      padding: 5px 0;
      color: $white;
      border-top: 1px solid $color-transparent;
      border-bottom: 1px solid $color-transparent;
      cursor: pointer;

      &:hover {
        border-top: 1px solid $color-main;
        border-bottom: 1px solid $color-main;
        background-color: $color-dark-gray;
      }
    }
  }

  .other-text-wrap {
    width: 100%;
    flex: 1;
    overflow: auto;
  }
}

.video {
  display: flex;
  width: 310px;
  // grid-template-columns: repeat(4, 1fr);
  flex-flow: column;
  justify-content: center;
  align-items: center;
  // box-sizing: border-box
  margin-top: 10px;
}

.upload {
  width: 120px;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  // padding: 10px;
  background-color: #1f1f20;
  border: dashed 1px #3d3e3e;
  border-radius: 20px;
  // position: relative;
  // left: 100%;
  // top: 100%;
  // right: 0;
  // bottom: 0;
}

.videoUpload {
  display: flex;
  flex-flow: row;
  font-size: 10px;
}

.videoList {
  width: 300px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  // column-gap: 5px;
  box-sizing: border-box;
  // position: absolute;
  // top: 35%
  // left: 10%
  // overflow: auto;
  // margin-top: 15px;
}

.bgVideo {
  width: 120px;
  height: 90px;
  background-color: #000000;
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumbnail {
  width: 100px;
  height: 80%;
}

.upBtn {
  display: flex;
  flex-flow: row;
  justify-content: center;
  align-items: center;
}

.upBtn p {
  margin-left: 5px;
}

.upBtnP {
  font-size: 8px;
  color: #666666;
  margin-top: 6px;
}

.videoTitle {
  font-size: 8px;
  color: #666666;
  margin-left: 10px;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 30px;
}

.videoTime {
  font-size: 8px;
  -webkit-transform: scale(0.8);
  color: #ffffff;
  position: relative;
  left: 80px;
  top: 30px;
}

/deep/.el-scrollbar {
  height: 100%;

  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }

  .el-scrollbar__bar {
    opacity: 1;
  }

  .el-scrollbar__thumb {
    background: #ED4040;
  }
}

/deep/ .el-tabs__item.is-active {
  color: #7de2c1;
  background-color: #333334;
}

/deep/ .el-tabs__active-bar {
  background-color: #7de2c1;
}

/deep/ .el-tabs__item:hover {
  color: #7de2c1;
}

/deep/ .el-tabs__item {
  background-color: #29292d;
}

/deep/ .el-tabs--left .el-tabs__item.is-left {
  color: #ffffff;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0px 10px 10px 0px;
}

.partBtn {
  position: fixed;
  bottom: 10%;
  left: 10%;
  z-index: 999;
}

/deep/ .el-drawer__open .el-drawer.ltr {
  background-color: #0e0e0e;
}

.partBtnFoot {
  position: absolute;
  bottom: 10%;
  left: 40%;
}

.actives {
  width: 355px !important;
}

/deep/ .el-tab-pane__label {
  width: 10px;
}

/deep/ .el-tabs__item {
  width: 10px;
  writing-mode: vertical-lr;
}

/deep/ .el-tabs__item.is-active {
  width: 10px;
  writing-mode: vertical-lr;
}

/deep/ .el-tabs--left .el-tabs__active-bar.is-left, .el-tabs--left .el-tabs__nav-wrap.is-left::after {
  right: auto;
  left: 0;
}

/deep/ .el-tabs__nav {
  background: #1b1b1c;
}
</style>
<style>