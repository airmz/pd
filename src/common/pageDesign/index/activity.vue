<template>
  <div id="activity">
    <div class="main">
      <div class="block">
        <el-carousel trigger="click" height="120px">
          <el-carousel-item v-for="(item, index) in imgList" :key="index">
            <img
              class="imgList"
              :src="item.img"
              @click="toHref(item.link)"
              :alt="item.title"
            />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="title">
        <div class="lift-title">
          <span>热门模版</span>
          <p>({{ total }})</p>
        </div>
        <div style="display: flex">
          <div v-show="!videoCheck" style="display: flex; margin-right: 10px">
            <el-button
              size="mini"
              :disabled="this.deleteVideo.length == 0"
              type="info"
              >备份草稿</el-button
            >
            <el-button
              size="mini"
              :disabled="this.deleteVideo.length == 0"
              type="info"
              >删除</el-button
            >
          </div>
          <!-- <el-button size="mini" @click="videoCheckBox" type="info">{{
            title
          }}</el-button> -->
        </div>
      </div>

      <div>
        <el-scrollbar style="height: 325px" placement="bottom">
          <div class="videoList" v-infinite-scroll="loadMoreHot">
            <div v-for="(item, index) in data" :key="index">
              <div
                class="videoBtn"
                style="margin-top: -130px"
                v-if="videoBtn === item.id"
              >
                <el-button
                  size="mini"
                  style="margin-top: 0px; width: 80px"
                  type="success"
                  @click="previewTemp(item)"
                  >预览</el-button
                >
                <el-button
                  size="mini"
                  style="margin-top: 10px; width: 80px"
                  type="primary"
                  @click="useTemp(item)"
                  >使用模板</el-button
                >
              </div>
              <img
                class="videoImg"
                :src="item.thumb + '?imageView2/1/w/130/h/130'"
                alt=""
                @mouseover="addActive(item)"
                @mouseout="removeActive(item)"
              />
              <el-popover placement="bottom" width="150" trigger="click">
                <div class="popover">
                  <ul>
                    <li class="popover-li" @click="previewTemp(item)">
                      <span>预览</span>
                    </li>
                    <li class="popover-li" @click="useTemp(item)">
                      <span>创建成我的</span>
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
                @change="check(data)"
              ></el-checkbox>
              <div class="videoTitle">
                <div class="actTitle">
                  <span>{{ item.title }}</span>
                  <el-tag
                    effect="dark"
                    v-show="item.id == '1'"
                    size="mini"
                    class="tag"
                    >最新</el-tag
                  >
                </div>
                <!-- <div class="actSubTitle">
                  <p>2021.11.24</p>
                  <p>至</p>
                  <p>2021.12.19</p>
                </div> -->
              </div>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <!-- <el-scrollbar style="height: 325px">
    <div class="actList">
        <div class="list" v-for="item in imgList" :key="item">
            <img class="actImg" :src=item.img alt="">
            <div class="actTitle">
            <span>我的这一天</span>   
            <el-tag effect="dark" v-show="item.id=='1'" size="mini" class="tag">最新</el-tag>
            </div>
            <div class="actSubTitle">
                <p>2021.11.24</p>
                <p>至</p>
                <p>2021.12.19</p>
            </div>
        </div>
    </div>
</el-scrollbar> -->
    </div>
    <el-dialog
      title="预览模板"
      :visible.sync="dialogVisible"
      width="240px"
      height="482px"
    >
      <div
        class="priImg"
        :style="
          'background: url(' +
          temp.thumb +
          ');width: 225px;height: 400px;background-size: cover;'
        "
      >
        <video
          controls
          src="https://pic.dd0531.com/upload/110ed68a884a04c8164016153171504.mp4"
          style="width: 225px; position: absolute; top: 220px"
        ></video>
      </div>
    </el-dialog>
  </div>
</template>
<script>
const NAME = "activity";
export default {
  name: NAME,
  data() {
    return {
      videoList: [
        {
          id: "1",
          img: "https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg",
        },
      ],
      visible: false,
      checked: true,
      videoCheck: true,
      title: "批量管理",
      disabled: true,
      deleteVideo: [],
      videoBtn: 0,
      dialogVisible: false,
      temp: {},
      isFirst: true,
    };
  },
  props: ["data", "imgList", "page", "size", "total"],
  methods: {
    previewTemp(item) {
      this.dialogVisible = true;
      this.temp = item;
    },
    useTemp(item) {
      //创建本地模板并编辑
      var user = this.$local.get("user");
      if (!user || !user.id) {
        return;
      }
      var data = {
        id: item.id,
        type: 1,
        uid: user.id,
      };
      console.log(user);
      if (user.endDate != null) {
        if (new Date(user.endDate).getTime() > new Date().getTime()) {
          //未到期
        } else {
          //已到期
          this.$parent.recharge(user.id);
          return;
        }
      } else {
        //未授权
        this.$parent.recharge(user.id);
        return;
      }
      this.$axios
        .post(this.$domain + "/api/copyTemp?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "success",
            });
            var copyTemp = res.data.data;
            // window.location.href = "/main?type=edit&tid=" + copyTemp.id;
            this.$router.push("/main?type=edit&tid=" + copyTemp.id);
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    addActive($event) {
      this.videoBtn = $event.id;
    },
    removeActive($event) {
      this.videoBtn != $event.id;
    },
    toHref(e) {
      if (e) {
        window.open(e);
      }
    },
    videoCheckBox() {
      this.videoCheck = !this.videoCheck;
      if (this.videoCheck == false) {
        this.title = "取消";
      } else {
        this.title = "批量管理";
      }
    },
    check(data) {
      console.log(data);
      Object.assign(this.deleteVideo, data);
      if (this.deleteVideo.length != 0) {
        this.disabled = false;
      }
    },
    loadMoreHot() {
      //触发底部
      this.lastLength = this.data.length;
      console.log("热门模板");

      if (this.isFirst || this.disable == 1) {
        this.isFirst = false;
      } else {
        this.$parent.getTempList(2, this.page + 1, this.size);
      }
    },
  },
};
</script>
<style lang="stylus" scoped>
.main {
  width: 635px;
  height: 100%;
  padding: 30px;
}

.imgList {
  width: 98%;
  height: 120px;
  border-radius: 15px;
  cursor: pointer;
}

.block {
  margin: 25px 0 25px 0;
  text-align: center;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lift-title {
  display: flex;
  flex-flow: row;
  color: #ffffff;
  font-weight: 900;
}

.actList {
  width: 575px;
  display: grid;
  grid-template-columns: 50% 50%;
  column-gap: 10px;
  row-gap: 10px;
  margin: 15px auto;
  padding: 15px;
}

.list {
  display: flex;
  flex-flow: column;
  align-items: flex-start;
}

.actImg {
  width: 96%;
  height: 65px;
  border-radius: 10px;
}

/deep/.el-tag--dark {
  background-color: #00c6d2;
  border-radius: 30px;
  color: #ffffff !important;
}

.actTitle {
  height: 30px;
}

.actTitle span {
  font-size: 12px;
  color: #808080;
  font-weight: 900;
  -webkit-transform: scale(0.9);
}

.actSubTitle {
  display: flex;
  flex-flow: row;
  // margin-top:5px;
}

.actSubTitle p {
  font-size: 8px;
  color: #373737;
  font-weight: 900;
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
  object-fit: cover;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  background-color: #2d2c2e00;
  position: relative;
  top: -30px;
  left: 88px;
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
  top: -166px;
  left: -51px;
}

.videoBtn {
  background-color: rgba(0, 0, 0, 0.4);
  width: 130px;
  height: 130px;
  border-radius: 10px;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  position: relative;
  top: 130px;
  left: 0px;
}

.videoBtn button {
  transition: all 0.4s;
  -moz-transition: all 0.4s;
  -webkit-transition: all 0.4s;
  -o-transition: all 0.4s;
  margin-left: 0;
  width: 60px;
  margin-top: 6px;
}

.videoBtn button:nth-child(1) {
  // background-color: #ffffff;
  background-color: #fff0;
  // border: solid 1px #00bd7e;
  border: solid 1px #ffffff;
  color: #ffffff;
  margin-top: 70px;
}

.videoBtn button:nth-child(2) {
  background-color: #00bd7e;
  color: #ffffff;
  font-weight: 900;
  border: none;
}

.mTop {
  margin-top: -50px;
}

.videoBtns {
  width: 60px;
  display: none;
  flex-flow: column;
  justify-content: center;
  position: relative;
  top: 110px;
  left: 50px;
  opacity: 0;
}

.priImg {
  background: #ccc;
  width: 225px;
  height: 400px;
  background-size: cover !important;
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
/deep/ .el-button--info:focus{
  background: none;
  border: none
}
/deep/ .el-button--info:hover{
  background: none;
  border: none
}
</style>
<style>
.el-popover {
  min-width: 100px;
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
  height: 100%;
}

</style>