<!--
 * @Author: airmz
 * @Date: 2021-12-16 09:07:00
 * @LastEditTime: 2021-12-25 17:46:58
 * @FilePath: /pd/src/views/pageDesign/login.vue
-->
<template>
  <div id="login">
    <div class="left-main">
      <div class="left-mian-title">
        <div class="title">巨量助手</div>
        <div class="subtitle">巨量素材 轻而易剪</div>
      </div>
      <div class="left-main-tab">
        <el-menu
          :default-active="defaltActive"
          background-color="#1a1a1b"
          text-color="#d4d4d4"
        >
          <el-menu-item-group>
            <el-menu-item @click="local" index="local">
              <div class="tab"><i class="icon el-icon-folder"></i>本地草稿</div>
            </el-menu-item>
            <el-menu-item @click="temp" index="temp">
              <div class="tab"><i class="icon el-icon-cloudy"></i>网络模板</div>
            </el-menu-item>
            <el-menu-item @click="hotTemple" index="activity">
              <div class="tab">
                <i class="icon el-icon-ice-cream-square"></i>热门模板
              </div>
            </el-menu-item>
            <el-menu-item @click="myWork" index="myWork">
              <div class="tab">
                <i class="icon el-icon-ice-cream-square"></i>我的作品
              </div>
            </el-menu-item>
          </el-menu-item-group>
        </el-menu>
      </div>
      <div class="banner">
        <div class="block">
          <el-carousel trigger="click" height="88px">
            <el-carousel-item
              v-for="(item, index) in imgList"
              :key="index"
              v-show="item.type == 0"
            >
              <img
                class="imgList"
                :src="item.img"
                @click="toHref(item.link)"
                :alt="item.title"
              />
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="login-btn">
          <!-- <el-button
            type="info"
           
            icon="el-icon-user-solid"
            circle
          ></el-button>
          <el-button type="info" icon="el-icon-s-promotion" circle></el-button> -->
          <div class="userImg" @click="open">
            <img
              class="userHeadImg"
              :src="user.avatar == null ? defalutAvatar : user.avatar"
            />
            <span>{{
              user.nickName == null ? defalutNickName : user.nickName
            }}</span>
          </div>
          <el-button
            v-show="user.id"
            type="info"
            class="logOut"
            icon="el-icon-switch-button"
            circle
            @click="loginOut"
          ></el-button>
        </div>
      </div>
      <el-dialog
        title="扫码登录"
        :visible.sync="dialogVisible"
        width="50%"
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
              <span class="TitleTop">请在 {{ time }}s 内扫码登录</span>
            </div>
            <div>
              <img class="er" :src="loginUrl" alt="" />
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
              <p>获取你在抖音内手机号</p></span
            >
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
          <el-button type="primary" @click="loginSuccess">已确认登录</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="right-main">
      <div class="start-main">
        <div>
          <cloud v-show="showTem == 0"></cloud>
          <local
            :data="localTempList"
            :imgList="imgList"
            v-show="showTem == 1"
            :page="page"
            :size="size"
            :total="total1"
            :disable="disable"
          ></local>
          <activity
            :data="hotTempList"
            :imgList="hotImgList"
            v-show="showTem == 2"
            :page="page"
            :size="size"
            :total="total2"
            :disable="disable"
          ></activity>
          <temp
            :data="commonTempList"
            :imgList="commonImgList"
            v-show="showTem == 3"
            :page="page"
            :size="size"
            :total="total"
            :disable="disable"
          ></temp>
          <works
            v-show="showTem == 4"
            :disable="disable"
            :workTab="workTab"
          ></works>
          <!-- <router-view></router-view> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import local from "COMMON/pageDesign/index/local";
import cloud from "COMMON/pageDesign/index/cloud";
import activity from "COMMON/pageDesign/index/activity";
import temp from "COMMON/pageDesign/index/temp";
import works from "COMMON/pageDesign/index/works";
export default {
  name: "login",
  data() {
    return {
      imgList: [
        {
          id: "",
          img: "https://pic.dd0531.com/eab569489b694c8db4ff0d3a4aebaf39.png",
          link: "",
        },
      ],
      commonImgList: [],
      hotImgList: [],
      dialogVisible: false,
      url: "http://www.baidu.com/",
      loginUrl:
        "https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fopen.douyin.com%2Fplatform%2Foauth%2Fconnect%3Fclient_key%3Dawpiozooi5g1h2io%26response_type%3Dcode%26scope%3Duser_info%2Cmobile%26redirect_uri%3Dhttps%3A%2F%2Fdraw.dd0531.com%2Fapi%2Fdouyin%2Fcallback%2FjkjLogin%3FclientId%3D" +
        this.$clientId,
      time: 60,
      interval: "",
      defalutAvatar:
        "https://pic.dd0531.com/c6b5ff8f048a46379c10b7ec985ffa93.png",
      defalutNickName: "请登录",
      user: {},
      showTem: 0,
      localTempList: [],
      commonTempList: [],
      hotTempList: [],
      page: 1,
      size: 10,
      total: 0,
      total1: 0,
      total2: 0,
      tempNameVisible: false,
      isFirst: true,
      disable: 1,
      defaltActive: "local",
      workTab: 0,
    };
  },
  components: {
    local,
    cloud,
    activity,
    temp,
    works,
  },
  mounted() {
    this.user = this.$local.get("user");
    if (this.user.id) {
      this.showTem = 1;
      this.getTempList(1, this.page, this.size, "mounted");
    }
    this.initData();
    // this.getTempList(0);
    // this.getTempList(2);
    let defaltActive = this.$validator.getUrlKey("defaltActive");
    let workTab = this.$validator.getUrlKey("workTab");
    if (workTab) {
      this.workTab = workTab;
      console.log(workTab);
    }
    if (defaltActive) {
      this.defaltActive = defaltActive;
      if (defaltActive == "temp") {
        this.temp();
      } else if (defaltActive == "works") {
        this.myWork();
      } else if (defaltActive == "activity") {
        this.hotTemple();
      }
    }
  },
  methods: {
    getTempList(type, page, size, t) {
      console.log(type, page, size, t);
      if (page) {
        this.page = page;
      } else {
        page = this.page;
      }

      if (this.isFirst) {
        page = 1;
        this.page;
        this.isFirst = false;
      }

      var data = {
        type: type,
        page: page,
        size: size,
      };

      if (type == 2) {
        data.type = 0;
        data.label = "热门";
      }
      if (type == 1) {
        data.uid = this.user.id;
      }

      this.$axios
        .post(this.$domain + "/api/getTempList?", this.$qs.stringify(data))
        .then((res) => {
          this.disable = 0;
          if (res.data.code == 200) {
            if (type == 0) {
              this.total = res.data.data.totalElements;
              if (this.commonTempList.length > 0) {
                this.commonTempList = this.commonTempList.concat(
                  res.data.data.content
                );
              } else {
                this.commonTempList = res.data.data.content;
              }
            } else if (type == 1) {
              this.total1 = res.data.data.totalElements;
              if (this.localTempList.length > 0) {
                this.localTempList = this.localTempList.concat(
                  res.data.data.content
                );
              } else {
                this.localTempList = res.data.data.content;
              }
            } else if (type == 2) {
              this.total2 = res.data.data.totalElements;
              if (this.hotTempList.length > 0) {
                this.hotTempList = this.hotTempList.concat(
                  res.data.data.content
                );
              } else {
                this.hotTempList = res.data.data.content;
              }
            }
          }
        });
    },
    toHref(e) {
      if (e) {
        window.open(e);
      }
    },
    recharge(id) {
      this.$prompt("请输入激活码", "您还不是会员！", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      })
        .then(({ value }) => {
          var data = {
            uid: id,
            cdk: value,
          };
          this.$axios
            .post(
              this.$domain + "/api/douyin/jkyAuthorize?",
              this.$qs.stringify(data)
            )
            .then((res) => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message:
                    "激活成功！有效期至 " +
                    this.$validator.dateFormat(res.data.data.endDate),
                });
                this.$local.set("user", res.data.data);
                window.location.reload();
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
            message: "取消输入",
          });
        });
    },
    initData() {
      var data = {};
      this.$axios
        .post(this.$domain + "/api/getSwiperList?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            if (res.data.data.length > 0) {
              (this.imgList = []),
                (this.commonImgList = []),
                (this.hotImgList = []);
              for (var i = 0; i < res.data.data.length; i++) {
                if (res.data.data[i].type == 0) {
                  this.imgList.push(res.data.data[i]);
                } else if (res.data.data[i].type == 1) {
                  this.commonImgList.push(res.data.data[i]);
                } else if (res.data.data[i].type == 2) {
                  this.hotImgList.push(res.data.data[i]);
                }
              }
            }
          }
        });
    },
    local() {
      if (this.user.id) {
        this.showTem = 1;
        this.page = 1;
        this.localTempList = [];
        this.disable = 1;
        this.getTempList(1, this.page, this.size, "local");
      } else {
        this.$message({
          showClose: false,
          message: "请登录后进行创作",
          type: "error",
        });
        this.showTem = 0;
      }
    },
    temp() {
      this.showTem = 3;
      this.page = 1;
      this.disable = 1;
      this.defaltActive = "temp";
      this.commonTempList = [];
      this.getTempList(0, this.page, this.size);
    },
    cloud() {
      this.showTem = 2;
    },
    myWork() {
      this.showTem = 4;
      this.defaltActive = "myWork";
    },
    hotTemple() {
      this.showTem = 2;
      this.page = 1;
      this.hotTempList = [];
      this.disable = 1;
      this.defaltActive = "activity";
      this.getTempList(2, this.page, this.size);
    },
    loginSuccess() {
      this.dialogVisible = false;
      clearInterval(this.interval);
    },
    loginOut() {
      this.user = {};
      this.$local.set("user", {});
      this.showTem = 0;
    },
    open(url) {
      if (this.user.id) {
        this.$message({
          showClose: false,
          message:
            "亲爱的【" +
            this.user.nickName +
            "】,您已登录成功！有效期到：" +
            this.$validator.dateFormat(this.user.endDate),
          type: "success",
        });
      } else {
        this.url = url;
        this.time = 60;
        this.dialogVisible = true;
        clearInterval(this.interval);
        var timer = window.setInterval(() => {
          console.log("执行：" + this.time);
          this.time = this.time - 2;
          this.checkLogin();
          if (this.time <= 0) {
            clearInterval(timer);
          }
        }, 2000);

        this.interval = timer;
      }
    },
    checkLogin() {
      var data = {
        clientId: this.$clientId,
      };
      this.$axios
        .post(
          this.$domain + "/api/douyin/checkJkjLogin?" + this.$clientId,
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            clearInterval(this.interval);
            this.$local.set("user", res.data.data);
            this.user = res.data.data;
            this.dialogVisible = false;
            this.showTem = 1;
            this.$message({
              showClose: false,
              message: "登录成功",
              type: "success",
            });
            // window.location.href = "/";
            this.$router.go(0);
          } else {
            //alert(res.data.msg);
          }
        });
    },
    login() {
      this.dialogVisible = false;
      return this.$route.path.replace("/", "");
    },
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    },
  },
};
</script>
<style lang="stylus" src="STYLUS/main.styl"></style>
<style lang="stylus" scoped>
#login {
  background: rgb(26, 26, 27);
  width: 850px;
  height: 570px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  /* 自动居中了 */
  border-radius: 15px;
  display: flex;
  box-shadow: 0px 15px 15px 15px rgb(201, 195, 195);
}

.left-main {
  width: 210px;
  height: 100%;
  border-right: 1px solid rgb(36, 36, 36);
}

.right-main {
  width: 635px;
  height: 100%;
  background: rgb(18, 18, 18);
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
}

.left-mian-title {
  height: 140px;
  text-align: center;
  padding: 45px 0px;
}

.title {
  color: rgb(253, 253, 253);
  font-size: 28px;
  font-weight: bold;
  line-height: 50px;
}

.subtitle {
  color: rgb(74, 74, 74);
  font-size: 12px;
  font-weight: bold;
}

.left-main-tab {
  text-align: center;
  color: rgb(212, 212, 212);
}

.tab {
  font-size: 12px;
  font-weight: bold;
  line-height: 55px;
  margin-left: -65px;
  // padding: 10px 25px 0px 25px;
}

.selected {
  /* background: rgb(45, 45, 45);
  border-radius: 30px; */
}

.icon {
  font-weight: bold;
  font-size: 15px;
  margin-right: 8px;
}

/deep/ .el-carousel__indicators--horizontal {
  display: none;
}

.banner {
  text-align: center;
  margin-top: -30px;
}

.logOut {
  border: none;
  background: none !important;
}

/deep/.block {
  margin-top: 70px;
  margin-bottom: -30px;
}

.imgList {
  width: 75%;
  height: 80px;
  border-radius: 10px;
  // margin-top 35px
  cursor: pointer;
}

.login-btn {
  display: flex;
  padding-left: 30px;
  margin-top: 40px;
  // padding-top 40px
}

/deep/ .el-button--info {
  background-color: #2d2c2e;
  border: none;
}

/deep/.el-menu-item.is-active {
  background-color: #2d2c2e !important;
  color: #d4d4d4;
  display: flex;
  width: 80%;
  padding-left: 20px;
  border-radius: 10px;
  margin: 0px auto;
  justify-content: center;
  // align-items: center;
}

/deep/ .el-menu {
  border-right: none;
}

.er {
  width: 230px;
  height: 230px;
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

.userImg {
  display: flex;
  flex-flow: row;
  align-items: center;
  cursor: pointer;
}

.userHeadImg {
  border-radius: 50%;
  width: 30px !important;
  height: 30px !important;
}

.userImg span {
  color: #ffffff;
  font-weight: 900;
  font-size: 12px;
  width: 75px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
<style lang="">
/* .el-dialog__header {
  text-align: center;
  background-color: #050507;
  color: #ffffff;
}
.el-dialog__title {
  color: #ffffff;
} */
.el-menu-item:hover {
  background-color: #1a1a1b00 !important;
}

.el-checkbox__input.is-checked + .el-checkbox__label {
  color: #00000000;
}
.el-checkbox {
  color: #00000100 !important;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  user-select: none;
  margin-right: 30px;
}
.el-menu-item {
  transition: border-color 0s, background-color 0s, color 0s !important;
}
</style>