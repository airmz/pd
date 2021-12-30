<template>
  <div id="img-list-wrap">
    <div class="style-tab">
      <span
        class="tab"
        :class="{ 'active-tab': activeTab === 0 }"
        @click="activeTab = 0"
        >推荐</span
      >
      <span
        class="tab"
        :class="{ 'active-tab': activeTab === 1 }"
        @click="activeTab = 1"
        >我的</span
      >
    </div>
    <div class="tab-content 1" v-if="hadShowRecommendImg" :style="getStyle(1)">
      <temp-water-fall
        class="img-list"
        showCheck="true"
        :listData="myImgList"
        sortBy="id"
        :clear="clear"
        k="id"
        @delete-img="deleteImg"
        @select-img="selectImg"
        @checked-img="checkedImg"
        @scroll-img="wheelChange"
      />
      <!-- <div class="upload-btn-wrap">
        <el-upload
          class="videoUpload"
          :show-file-list="false"
          :http-request="sliderRequest"
          :on-progress="uploadVideoProcess"
          name="file"
          accept="image/*"
          action="qiniu"
        >
          <div class="upload-btn">
            <i
              class="el-icon-circle-plus"
              style="color: #ffffff; font-size: 18px"
            ></i>
            <p class="upBtnP">上传图片</p>
          </div>
        </el-upload>
      </div> -->
    </div>
    <div class="tab-content 0" v-if="hadShowMyImg" :style="getStyle(0)">
      <temp-water-fall
        class="img-list 123"
        showCheck="true"
        :listData="recommendImgList"
        sortBy="id"
        :clear="clear"
        k="id"
        @delete-img="deleteImg"
        @scroll-img="wheelChange"
        @checked-img="checkedImg"
        @select-img="selectImg"
      />
    </div>
  </div>
</template>

<script>
// 图片列表
const NAME = "img-list-wrap";

import wImage from "COMMON/pageDesign/widgets/wImage/wImage";

import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      activeTab: -1,
      myImgList: [],
      page: 1,
      size: 15,
      totalPages: 0,
      scroll: true,
      recommendImgList: [],
      hadShowMyImg: false,
      hadShowRecommendImg: false,
      pos: 0,
      loading: false,
      clear: 1,
    };
  },
  mounted() {
    this.activeTab = 0;
    this.user = this.$local.get("user");
  },
  watch: {
    activeTab(value) {
      console.log("activeTab:" + value);
      this.clear++;
      console.log("clear:" + this.clear);
      if (value === 0) {
        this.hadShowMyImg = true;
        this.hadShowRecommendImg = false;
        this.page = 1;
        this.loading = true;
        this.myImgList = [];
        // this.$set(recommendImgList =[]);
        this.getImgList();
      } else if (value === 1) {
        this.hadShowMyImg = false;
        this.hadShowRecommendImg = true;
        this.page = 1;
        this.loading = true;
        this.myImgList = [];
        // this.$set(recommendImgList =[]);
        console.log(this.user.id);
        this.getImgList(this.user.id);
      }
    },
  },
  methods: {
    ...mapActions([
      "addWidget",
      "updatePageData",
      "setCheckImgIds",
      "getStoreImgList",
      "clearWidget",
    ]),

    beforeUploadVideo(file) {
      const isLt10M = file.size / 1024 / 1024 < 30;
      if (
        [
          "image/jpg",
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/bmp",
        ].indexOf(file.type) == -1
      ) {
        this.$message.error("请上传正确的图片格式");
        return false;
      }
      if (!isLt10M) {
        this.$message.error("上传图片大小不能超过30B哦!");
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
        this.$message.error("图片上传失败，请重新上传！");
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
                var imgUrl = "https://pic.dd0531.com/" + res.data.key;

                var size = param.file.size / 1024 / 1024;
                var data = {
                  title: param.file.name,
                  url: imgUrl,
                  industryType: 0,
                  materialType: 0,
                  fileType: 0,
                  isOpen: 1,
                  uid: this.user.id,
                };
                that.saveImg(data);
                console.log(imgUrl);
                load.close();
                this.$message.success("图片上传成功！");
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
    saveImg(data) {
      this.$axios
        .post(
          this.$domain + "/api/douyin/saveSysMaterial",
          this.$qs.stringify(data)
        )
        .then((res) => {
          this.loading = true;
          if (res.data.code == 200) {
            this.$message.success("图片保存成功");
            this.clear++;
            this.page = 1;
            this.getImgList(this.user.id);
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    getImgList(uid) {
      let that = this;
      console.log(that);
      var data = { page: this.page, size: this.size, type: 0 }; //定义一个data储存需要带的参数
      if (uid) {
        data.uid = uid;
        data.type = 1;
      }
      if (that.loading) {
        this.$axios
          .post(this.$domain + "/api/getTempList", this.$qs.stringify(data))
          .then((res) => {
            if (res.data.code == 200) {
              console.log(res.data.data.totalPages);
              that.recommendImgList = {};

              if (that.page == 1) {
                that.recommendImgList = [];
                that.myImgList = [];
              }

              if (that.page == 1) {
                for (var i = 0; i < res.data.data.content.length; i++) {
                  res.data.data.content[i].ratio = 750 / 1334;
                }

                if (this.activeTab == 1) {
                  that.myImgList = res.data.data.content;
                } else {
                  that.recommendImgList = res.data.data.content;
                }

                that.page = that.page + 1;
              } else {
                for (var i = 0; i < res.data.data.content.length; i++) {
                  res.data.data.content[i].ratio = 750 / 1334;
                }
                if (this.activeTab == 1) {
                  that.myImgList = res.data.data.content;
                } else {
                  that.recommendImgList = res.data.data.content;
                }

                that.page = that.page + 1;
              }

              that.totalPages = res.data.data.totalPages;
            } else {
              alert(that.page);
            }

            this.loading = false;
          });
      }
    },
    getStyle(index) {
      return {
        display: this.activeTab === index ? "" : "none",
      };
    },
    checkedImg(item) {
      console.log(item);
      this.setCheckImgIds(item);
      // addCheckImgId
    },
    selectImg(item) {
      // let setting = JSON.parse(JSON.stringify(wImage.setting))
      // console.log(setting)
      // setting.width = 750
      // setting.height = 1334
      // setting.imgUrl = item.value.url
      // this.addWidget(setting)
      //   this.updatePageData({
      //     key: "backgroundImage",
      //     value: item.value.url,
      //   });

      console.log(item);

      this.$confirm("此操作将替换当前模板，请谨慎操作！, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.clearWidget();
          this.title = item.value.title;
          var content = JSON.parse(item.value.content);
          var widgets = content.widgets;
          for (let i = 0; i < widgets.length; i++) {
            /* console.log(widgets[i]); */
            this.addWidget(widgets[i]);
          }
          this.updatePageData({
            key: "backgroundImage",
            value: content.backgroundImage,
          });
          this.setCheckImgIds(content.imgList);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消替换",
          });
        });
    },
    deleteImg(item) {
      //
    },
    uploadImg(e) {},
    wheelChange(e) {
      if (this.loading == false) {
        if (this.totalPages >= this.page) {
          this.loading = true;

          this.getImgList();
        } else {
          console.log("没有更多了");
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#img-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .style-tab {
    margin-top: 70px;
    width: 100%;
    display: flex;
    border-bottom: 1px solid $color-dark-gray;

    .tab {
      flex: 1;
      padding: 10px;
      color: $color-white;
      cursor: pointer;
      border-bottom: 2px solid $color-dark-gray;
      text-align: center;

      &.active-tab {
        color: #33e0c0;
        border-bottom: 2px solid #33e0c0;
      }
    }
  }

  .tab-content {
    // margin-top: 30px
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;

    .img-list {
      width: 100%;
      flex: 1;
      display: grid;

      .img-item {
        width: 50%;
        height: auto;
        padding: 6px;
        cursor: pointer;

        &:hover {
          outline: 1px solid $color-main;
        }

        .img {
          width: 100%;
        }
      }
    }

    .upload-btn-wrap {
      width: 150px;
      display: flex;
      justify-content: center;
      align-items: end;

      .upload-btn {
        position: fixed;
        z-index: 9;
        bottom: 0;
        cursor: pointer;
        width: 10%;
        height: 60px;
        padding: 10px;
        margin: 15px;
        text-align: center;
        border-radius: 5px;
        color: $color-white;
        background-color: $color-main;

        &:hover {
          background-color: lighten($color-main, 10%);
        }
      }
    }
  }
}
</style>
