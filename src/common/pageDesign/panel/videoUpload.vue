<!--
 * @Author: airmz
 * @Date: 2021-12-11 10:25:00
 * @LastEditTime: 2021-12-30 16:57:40
 * @FilePath: /pd/src/common/pageDesign/panel/videoUpload.vue
-->
<template>
  <div id="Video-list-wrap">
    <div class="basic-text-wrap">
      <el-scrollbar style="height: 100vh">
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
                  <!-- <el-upload
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
                  </el-upload> -->

                  <yl-upload
                    class="videoUpload"
                    :action="uploadUrl"
                    :on-change="uploadVideoChange"
                    multiple
                    :show-file-list="false"
                    :beforeUpload="beforeUploadVideo"
                    :data="chunkData"
                    :on-success="handleSuccess"
                    :on-progress="uploadVideoProcess"
                    :chunk-size="1024 * 1024 * 500"
                    :thread="1"
                  >
                    <div class="upBtn">
                      <i
                        class="el-icon-circle-plus"
                        style="color: #ffffff; font-size: 18px"
                      ></i>
                      <p>导入素材</p>
                    </div>
                    <p class="upBtnP">请上传横版16:9视频</p>
                  </yl-upload>
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
                <div v-if="item.thumb">
                  <el-checkbox-group v-model="videoChecked" class="checked" @change="videoChange">
                    <el-checkbox :label="item.link"> </el-checkbox>
                  </el-checkbox-group>
                  <p class="videoTime">{{ item.fileSize }}</p>
                  <div class="bgVideo bgVideoList" @click="selectVideo(item)">
                    <img
                      :src="item.thumb"
                      alt="index"
                      @click="selectBasicVideo(item)"
                      class="thumbnail"
                    />
                  </div>
                </div>
                <div v-if="!item.thumb" style="text-align: center">
                  <el-progress
                    type="circle"
                    :percentage="item.percentage"
                  ></el-progress>
                </div>
                <div class="videoTitles">
                  <span v-if="!item.thumb" class="videoTitle">{{
                    item.subTitle
                  }}</span>
                  <span v-if="item.thumb" class="videoTitle">{{
                    item.title
                  }}</span>
                </div>

                <el-popover placement="bottom" width="150" trigger="click">
                  <div class="popover">
                    <ul>
                      <li class="popover-li" @click="delVideo(item)">
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
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <div></div>
    </div>
    <div class="other-text-wrap"></div>
  </div>
</template>

<script>
// 文本组件列表
const NAME = "video-list-wrap";
import YlUpload from "COMPONENTS/upload";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  components: { YlUpload },
  data() {
    return {
      videoChecked: [],
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
      uploadUrl: "",
      fileKey: "",
      canUpload: true,
    };
  },
  ...mapGetters(["dActiveElement"]),
  ...mapActions(["getQiniuToken"]),
  created() {
    this.showVideoList();
    this.getUserVideoList(1);

    this.$qiniu.getQiniuToken(this).then((res) => {
      console.log(res);
      if (res.data.code == 200) {
        this.uploadUrl = "http://upload.qiniup.com?token=" + res.data.data;
        console.log(this.uploadUrl);
      }
    });
  },
  methods: {
    ...mapActions(["setVideoList"]),
    chunkData(option) {
      return {
        size: option.fileSize, // 总文件大小
        chunks: option.chunkTotal, // 所有切片数量
        chunk: option.chunkIndex, // 当前切片下标
        md5: option.chunkHash, // 单个切片hash
        filename: option.fileName, // 文件名
        fileHash: option.fileHash, // 整个文件hash
      };
    },
    videoChange(e){
      console.log(this.videoChecked);
      this.setVideoList(this.videoChecked)
    },
    delVideo(item) {
      this.$confirm("此操作将永久删除该视频, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            id: item.id,
            link: item.link,
            status: 3,
          };
          this.$axios
            .post(
              this.$domain + "/api/saveUserVideo?",
              this.$qs.stringify(data)
            )
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  showClose: false,
                  message: "删除成功",
                  type: "success",
                });
                // this.fileList=[];
                // this.getUserVideoList(1);
                var index = this.fileList.findIndex((file) => {
                  if (file.id == item.id) {
                    return true;
                  }
                });
                this.fileList.splice(index, 1);
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
    getVideoMsg(file) {
      return new Promise((resolve) => {
        let videoElement = document.createElement("video");
        videoElement.src = URL.createObjectURL(file);
        videoElement.addEventListener("loadedmetadata", function () {
          resolve({
            duration: videoElement.duration,
            height: videoElement.videoHeight,
            width: videoElement.videoWidth,
          });
        });
      });
    },
    uploadVideoChange(file) {
      this.canUpload = true;
      this.getVideoMsg(file.raw).then((videoinfo) => {
        const { duration, height, width } = videoinfo;
        console.log(duration, height, width);
        if (height > width) {
          this.canUpload = false;
        }
      });
    },
    handleSuccess(response, file, fileLists) {
      console.log("//文件上传成功", response, file, fileLists);

      var user = this.$local.get("user");
      var size = file.size / 1024 / 1024;
      var imgUrl = this.$imgDomain + response[0].key;
      var data = {
        uid: user.id,
        title: file.name,
        type: 0,
        link: imgUrl,
        thumb: imgUrl + "?vframe/jpg/offset/1|imageView2/0/w/500",
        fileSize: size.toFixed(2),
        hash: response[0].hash,
      };

      this.fileList.map((item, index) => {
        if (item.key == file.uid) {
          item.percentage = Number(this.videoUploadPercent);
          item.link = imgUrl;
          item.thumb = imgUrl + "?vframe/jpg/offset/1|imageView2/0/w/500";
          item.title = file.name;
        }
      });

      var status = true;
      fileLists.map((item, index) => {
        if (item.status == "uploading") {
          status = false;
        }
      });

      this.saveVideo(data, status);
    },
    selectBasicVideo(item) {
      console.log(item);
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
      console.log("beforeUploadVideo", file);
      console.log("aa", file.width);
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
          "video/quicktime",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的视频格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传视频大小不能超过100MB哦!");
        return false;
      }
      const isSize = new Promise(function (resolve, reject) {
        let _URL = window.URL || window.webkitURL;
        let videoElement = document.createElement("video");
        // 当指定的音频/视频的元数据已加载时，会发生 loadedmetadata 事件。 元数据包括：时长、尺寸（仅视频）以及文本轨道。
        videoElement.addEventListener("loadedmetadata", function (_event) {
          let width = videoElement.videoWidth;
          let height = videoElement.videoHeight;
          let duration = videoElement.duration; // 视频时长

          if (Math.floor(duration) >= 120) reject(2);
          let valid = width > height;
          console.log("valid", valid);
          valid ? resolve() : reject(1);
        });
        videoElement.src = _URL.createObjectURL(file);
      }).then(
        (res) => {
          console.log(res);

          var key = new Date().getTime();
          let uploadKey = "upload/" + key + file.name; //上传七牛云需要的key
          this.fileKey = uploadKey;
          var size = file.size / 1024 / 1024;
          var data = {
            title: file.name,
            subTitle: file.name,
            fileSize: size.toFixed(2),
            thumb: "",
            key: file.uid,
          };
          this.fileList.push(data);
          this.fileList.map((item, index) => {
            if (index == this.fileList.length - 1) {
              this.fileList.unshift(this.fileList.splice(index, 1)[0]);
            }
          });
          return true;
        },
        (res) => {
          if (res == 1) {
            this.$message.error("请上传横版视频!");
          } else if (res == 2) {
            this.$message.error("请上传120秒以内视频!");
          }
          // alert("上传视频尺寸为 1280*720！");

          return Promise.reject();
        }
      );
      console.log(isSize);

      // if (isSize==Promise.reject() ) {
      //   this.$message.error("上传视频大小不能超过100MB哦!");
      //   return false;
      // }

      return isSize;
    },
    uploadVideoProcess(event, file, fileList) {
      this.videoFlag = true;
      this.videoUploadPercent = file.percentage.toFixed(0);
      // console.log(event);
      // console.log(file);
      // console.log(this.videoUploadPercent);
      this.fileList.map((item, index) => {
        if (item.key == file.uid) {
          item.percentage = Number(this.videoUploadPercent);
          item.subTitle =
            file.name + " 上传中(" + this.videoUploadPercent + "%)";
        }
      });
      // console.log(this.fileList);
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
    saveVideo(dataStr, status) {
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
            if (status) {
              (this.fileList = {}), this.getUserVideoList(1);
            }
          } else {
            //alert(res.data.msg);
            this.$message({
              showClose: false,
              message: "当前视频视频已上传过！",
              type: "error",
            });
            if (status) {
              (this.fileList = {}), this.getUserVideoList(1);
            }
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
  width: 350px;
  // grid-template-columns: repeat(4, 1fr);
  flex-flow: column;
  justify-content: center;
  align-items: center;
  // box-sizing: border-box
  margin-top: 70px;
}

.upload {
  width: 150px;
  height: 100px;
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
  width: 350px;
  border-radius: 5px;
  display: grid;
  grid-template-columns: repeat(2, 170px);
  justify-content: center;
  align-items: center;
  // column-gap: 5px;
  box-sizing: border-box;
  // overflow: auto;
  // margin-top: 15px;
}

.bgVideo {
  width: 150px;
  height: 100px;
  background-color: #000000;
  border-radius: 5px;
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.thumbnail {
  width: 140px;
  height: 100%;
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
.videoTitles{
  width:130px
  // word-break: break-all;
  // word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  // white-space: normal;
}
.videoTitle {
  font-size: 8px;
  color: #666666;
  margin-left: 10px;
  // // width: 10px;
  // word-break: break-all;
  // word-wrap: break-word;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // // white-space: nowrap;
  // white-space: normal;
}

.videoTime {
  font-size: 8px;
  -webkit-transform: scale(0.8);
  color: #ffffff;
  position: relative;
  left: 110px;
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

.popover {
  background-color: #050507;
  border-radius: 10px;
  border: solid 1px #666666;
  color: #ffffff;
  font-weight: 800;
  width: 76%;
  margin-left: 13px;
}

.popoverBtn {
  display: flex;
  background-color: #2d2c2e00;
  position: relative;
  top: -52px;
  left: 68%;
  border: none;
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

/deep/ .el-dialog__body {
  display: flex;
  justify-content: center;
  padding: 0;
}

/deep/ .el-dialog {
  background: #2e2b2b;
  border-radius: 10px;
  height: 470px;
}

/deep/ .el-dialog__title {
  color: #13eb2e;
}

/deep/ .el-dialog__header {
  padding: 11px 20px 2px;
  text-align: center;
  font-size: 8px;
  -webkit-transform: scale(0.8);
}

/deep/ .el-dialog__headerbtn .el-dialog__close {
  color: #90939900;
}

/deep/ .el-dialog__wrapper {
  background-color: #ffffff !important;
}

/deep/ .el-button--info:focus {
  background: none;
  border: none;
}

/deep/ .el-button--info:hover {
  background: none;
  border: none;
}

.checked {
  position: relative;
  top: 45px;
  left: 18px;
  z-index: 999;
}

/deep/ .el-checkbox__label {
  display: none;
}
</style>
<style>
.el-scrollbar__wrap {
  overflow: hidden;
  /* overflow-y: scroll; */
  overflow-y: auto;
  /* overflow-x: hidden!important; */
  height: 100%;
  /* margin-left: -28px; */
}
.el-scrollbar__view {
  overflow: hidden;
  overflow-y: scroll;
  height: 100%;
}
.el-scrollbar__bar.is-vertical {
  width: 3px !important;
}
.el-scrollbar {
}
::-webkit-scrollbar {
  width: 4px;
  height: 8px;
  background-color: #ebeef5;
}
::-webkit-scrollbar-thumb {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  background-color: #ccc;
}
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  background: rgba(255, 255, 255, 1);
}
.el-loading-mask.is-fullscreen {
  width: 361px;
}
.el-popover {
  min-width: 100px;
  border: none !important;
  background: none !important;
  padding-left: 32px;
  padding-right: 32px;
  border-radius: 10px !important;
  margin-top: 3px;
}
</style>