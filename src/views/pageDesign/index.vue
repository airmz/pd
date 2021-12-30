<template>
  <div id="page-design-index" ref="pageDesignIndex">
    <div class="top-nav" :style="style">
      <div class="top-nav-wrap">
        <div class="top-title"></div>
        <div class="top-icon-wrap">
          <div class="top-icon" @click="saveAndClose">
            <i class="el-icon-close"></i>
            保存并关闭
          </div>
          <div class="top-icon" @click="save">
            <i class="iconfont icon-save"></i>
            导出
          </div>
          <div class="top-icon" @click="save" v-if="false">
            <i class="iconfont icon-publish"></i>
            发布
          </div>
        </div>
      </div>
    </div>
    <div class="page-design-index-wrap">
      <widget-panel></widget-panel>
      <page-design
        class="page-design-wrap"
        :videoInfo="videoInfo"
        pageDesignCanvasId="page-design-canvas"
        :key="timeRefusr"
      ></page-design>
      <style-panel></style-panel>
    </div>
    <div class="operation">
      <ul class="operation-wrap">
        <li
          class="operation-item"
          :class="{ disable: !undoable }"
          @click="undoable ? handle('undo') : ''"
        >
          <i class="iconfont icon-chexiao"></i>
          <p>撤销</p>
        </li>
        <li
          class="operation-item"
          :class="{ disable: !redoable }"
          @click="redoable ? handle('redo') : ''"
        >
          <i class="iconfont icon-shuaxin"></i>
          <p>重做</p>
        </li>
      </ul>
      <ul class="operation-wrap">
        <li
          class="operation-item"
          :class="{ disable: dActiveElement.uuid === '-1' }"
          @click="dActiveElement.uuid !== '-1' ? handle('copy') : ''"
        >
          <i class="iconfont icon-fuzhi"></i>
          <p>复制</p>
        </li>
        <li
          class="operation-item"
          :class="{ disable: dCopyElement.length === 0 }"
          @click="dCopyElement.length !== 0 ? handle('paste') : ''"
        >
          <i class="iconfont icon-niantie"></i>
          <p>粘贴</p>
        </li>
        <li
          class="operation-item"
          :class="{ disable: dActiveElement.uuid === '-1' }"
          @click="dActiveElement.uuid !== '-1' ? handle('delete') : ''"
        >
          <i class="iconfont icon-shanchu"></i>
          <p>删除</p>
        </li>
      </ul>
      <ul class="operation-wrap">
        <li
          class="operation-item"
          @click.stop="showGridSizeList = !showGridSizeList"
          :class="{ 'operation-item-active': showGridSizeList }"
        >
          <i class="iconfont icon-24gl-appsSmall2"></i>
          <p>网格</p>
          <ul class="grid-selecter" v-show="showGridSizeList">
            <li
              v-for="(item, index) in gridSizeList"
              :key="index"
              class="grid-item"
              :class="{ 'grid-item-active': gridSizeIndex === index }"
              @click="gridSizeIndex = index"
            >
              <span>{{ item.value }}</span>
              <i
                class="iconfont icon-selected"
                v-if="gridSizeIndex === index"
              ></i>
            </li>
          </ul>
        </li>
        <li
          class="operation-item"
          @click.stop="showRefLine(!dShowRefLine)"
          :class="{ 'operation-item-active': dShowRefLine }"
        >
          <i class="iconfont icon-iconjing"></i>
          <p>吸附</p>
        </li>
        <li
          class="operation-item"
          @click.stop="showVideos()"
          :class="{ 'operation-item-active': dShowRefLine }"
        >
          <i class="iconfont icon-shipinbofang"></i>
          <p>{{ showVideoText }}</p>
        </li>
      </ul>
    </div>
    <zoom-control />
    <div class="menu-bg" id="menu-bg" v-show="showMenuBg">
      <ul
        class="menu-list"
        ref="menuList"
        :style="{
          left: menuList.left + 'px',
          top: menuList.top + 'px',
        }"
      >
        <li
          class="menu-item"
          :class="{
            'disable-menu': dCopyElement.length === 0 && item.type === 'paste',
          }"
          v-for="(item, index) in menuList.list"
          :key="index"
          @click="selectMenu(item.type)"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
    <div class="fill-info-wrap" v-if="fillInfoing">
      <div class="fill-info-content" v-loading="publishing">
        <el-steps
          :active="active[fillStep]"
          finish-status="success"
          align-center
        >
          <el-step :title="message['1']"></el-step>
          <!-- <el-step :title="message['2']"></el-step>
          <el-step :title="message['3']"></el-step> -->
        </el-steps>
        <div v-if="fillStep === 1" class="schedule">
          <el-progress type="circle" :percentage="percent"></el-progress>
        </div>
        <div
          class="fill-info-step"
          v-if="fillStep === 1"
          v-loading="false"
          element-loading-background="#2b2a2a"
        ></div>
        <!-- <div class="fill-info-step" v-show="fillStep === 2 || fillStep === 3">
          <div id="cover-wrap">
            <img id="cover" />
          </div>
          <text-input label="名称" v-model="title" />
          <div class="publish-btn" @click="publish">
            <span v-show="!publishing">确认发布</span>
            <i class="el-icon-loading" v-show="publishing"></i>
          </div>
          <div class="close-publish" @click="closePublish">
            关闭
          </div>
        </div> -->
        <div class="fill-info-step" v-show="fillStep === 2 || fillStep === 3">
          <div class="fillTitle">
            <!-- <div id="cover-wrap">
              <img id="cover" />
              <video
                id="cover"
                :src="videoInfo.link"
                controls="controls"
                style="width: 225px; position: absolute; margin-top: 60px"
              ></video>
            </div> -->
            <img id="cover1" style="display: none" />
            <el-carousel trigger="click" height="400px" autoplay="false">
              <el-carousel-item v-for="item in posterList" :key="item">
                <div id="cover-wrap">
                  <img id="cover" :src="item" />

                  <video
                    id="cover"
                    :src="videoInfo.link"
                    controls="controls"
                    style="width: 225px; position: absolute; margin-top: 60px"
                  >
                    {{ item.link }}
                  </video>
                </div>
              </el-carousel-item>
            </el-carousel>
            <!-- <text-input label="名称" v-model="title" /> -->
          </div>
          <div class="fillBtn">
            <div class="fillSpan"></div>
            <div class="fillAtt">
              <text-input label="模板名称" v-model="title" />
              <span>海报生成：可生成 {{ posterCount }}个海报</span>
              <span>视频生成：可生成 {{ posterCount }}个视频</span>
              <span>视频选择：已选择 1个</span>
              <span>背景选择：已选择 {{ posterCount }}张</span>
              <span>模板尺寸：1920 * 1080</span>
            </div>
            <div class="fillBtns">
              <!-- <div class="publish-btn" @click="saveTmpl">
                <span v-show="!publishing">保存草稿</span>
                <i class="el-icon-loading" v-show="publishing"></i>
              </div> -->
              <div class="publish-btn" @click="savePoster">
                <span v-show="!publishing">保存海报</span>
                <i class="el-icon-loading" v-show="publishing"></i>
              </div>
              <div class="publish-btn" @click="saveVideo">
                <span v-show="!publishing">保存视频</span>
                <i class="el-icon-loading" v-show="publishing"></i>
              </div>
              <div class="close-publish" @click="closePublish">关闭</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "COMMON/pageDesign/index";
import wGroup from "COMMON/pageDesign/widgets/wGroup/wGroup";
import { shortcuts } from "MIXINS/shortcuts";
import html2canvas from "html2canvas";
import { mapGetters, mapActions } from "vuex";

export default {
  name: "page-design-index",
  data() {
    return {
      style: {
        left: "0px",
      },
      gridSizeList: [
        {
          width: 0,
          height: 0,
          value: "无",
        },
        {
          width: 10,
          height: 10,
          value: "10x10",
        },
        {
          width: 20,
          height: 20,
          value: "20x20",
        },
        {
          width: 50,
          height: 50,
          value: "50x50",
        },
        {
          width: 75,
          height: 75,
          value: "75x75",
        },
        {
          width: 100,
          height: 100,
          value: "100x100",
        },
      ],
      gridSizeIndex: 0,
      showGridSizeList: false,
      showMenuBg: false,
      menuList: {
        left: 0,
        top: 0,
        list: [],
      },
      widgetMenu: [
        {
          type: "copy",
          text: "复制",
        },
        {
          type: "paste",
          text: "粘贴",
        },
        {
          type: "index-up",
          text: "上移一层",
        },
        {
          type: "index-down",
          text: "下移一层",
        },
        {
          type: "del",
          text: "删除",
        },
      ],
      pageMenu: [
        {
          type: "paste",
          text: "粘贴",
        },
      ],
      fillInfoing: false,
      message: {
        1: "生成封面图",
        2: "填写模板信息",
        3: "发布模板",
      },
      active: {
        1: 0,
        2: 1,
        3: 2,
      },
      fillStep: 1,
      formParams: {},
      title: "",
      publishing: false,
      content: "",
      videoInfo: {
        id: 0,
        link: "https://pic.dd0531.com/upload/3e96a8a8c9ad598d1640411737727202112251216.mp4",
        show: true,
      },
      workInfo: {},
      showVideo: true,
      showVideoText: "视频",
      timeRefusr: new Date().getTime(),
      posterList: [],
      imgList: [],
      posterCount: 0,
      percent: 0,
    };
  },
  mixins: [shortcuts],
  computed: {
    ...mapGetters([
      "dHistoryParams",
      "dActiveElement",
      "dShowRefLine",
      "dCopyElement",
      "dPage",
      "dAltDown",
      "dWidgets",
      "dZoom",
    ]),
    undoable() {
      return !(
        this.dHistoryParams.index === -1 ||
        (this.dHistoryParams === 0 && this.dHistoryParams.length === 10)
      );
    },
    redoable() {
      return !(this.dHistoryParams.index === this.dHistoryParams.length - 1);
    },
  },
  mounted() {
    this.user = this.$local.get("user");
    if (this.user.id) {
      // 初始化激活的控件为page
      this.selectWidget({
        uuid: "-1",
      });
      this.initGroupJson(JSON.stringify(wGroup.setting));
      window.addEventListener("scroll", this.fixTopBarScroll);
      window.addEventListener("click", this.clickListener);
      document.addEventListener("keydown", this.handleKeydowm, false);
      document.addEventListener("keyup", this.handleKeyup, false);
      document.oncontextmenu = this.mouseRightClick;
      this.initDesign();
      this.showRefLine(!this.dShowRefLine);
    } else {
      // window.location.href = "/";
      this.$router.push("/");
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.fixTopBarScroll);
    window.removeEventListener("click", this.clickListener);
    document.removeEventListener("keydown", this.handleKeydowm, false);
    document.removeEventListener("keyup", this.handleKeyup, false);
    document.oncontextmenu = null;
  },
  watch: {
    gridSizeIndex(index) {
      this.updateGridSize({
        width: this.gridSizeList[index].width,
        height: this.gridSizeList[index].height,
      });
    },
    videoInfo: function () {
      console.log("home", this.videoInfo);
      this.videoInfo.show = true;
      this.$forceUpdate();
    },
  },
  methods: {
    ...mapActions([
      "updateGridSize",
      "handleHistory",
      "selectWidget",
      "deleteWidget",
      "copyWidget",
      "showRefLine",
      "pasteWidget",
      "updateWidgetData",
      "getWidgetJsonData",
      "initGroupJson",
      "updateLayerIndex",
      "ungroup",
      "updateZoom",
      "pushHistory",
      "addWidget",
      "updatePageData",
      "setCheckImgIds",
      "clearWidget",
      "getStoreImgList",
      "getPosterList",
      "setPosterList",
    ]),
    showVideos() {
      console.log(this.videoInfo.show);
      this.videoInfo.show = !this.showVideo;
      this.showVideo = !this.showVideo;
      if (this.showVideo == true) {
        this.showVideoText = "影藏";
      } else {
        this.showVideoText = "显示";
      }
      this.timeRefusr = new Date().getTime();
      this.$forceUpdate();
    },
    fixTopBarScroll() {
      const scrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft;
      this.style.left = `-${scrollLeft}px`;
    },
    clickListener(e) {
      this.showGridSizeList = false;
    },
    handle(action) {
      switch (action) {
        case "undo":
        case "redo":
          this.handleHistory(action);
          break;
        case "delete":
          this.deleteWidget();
          break;
        case "copy":
          this.copyWidget();
          break;
        case "paste":
          this.pasteWidget();
          break;
      }
    },
    initDesign(e) {
      //  let uid= this.$validator.getUrlKey("uid")
      let type = this.$validator.getUrlKey("type");
      if (type == "add") {
        let tid = this.$validator.getUrlKey("tid");
        var that = this;
        var data = { tid: tid }; //定义一个data储存需要带的参数
        that.$axios
          .post(
            that.$domain + "/api/getPosterDesignTemple",
            that.$qs.stringify(data)
          )
          .then(
            (res) => {
              if (res.data.code == 200) {
                that.clearWidget();
                that.title = res.data.data.title;
                var content = JSON.parse(res.data.data.content);
                var widgets = content.widgets;
                for (let i = 0; i < widgets.length; i++) {
                  /* console.log(widgets[i]); */
                  that.addWidget(widgets[i]);
                }
                that.updatePageData({
                  key: "backgroundImage",
                  value: content.backgroundImage,
                });
                that.setCheckImgIds(content.imgList);
              } else {
                /* alert("初始化失败，请重新进入") */
                that.$message({
                  showClose: true,
                  message: "初始化失败，请重新进入",
                  type: "error",
                });
              }
              console.log(res);
              console.log(res.data.data[0]);
            },
            (err) => {
              that.fillStep = 2;
              /* alert("网络错误") */
              that.$message({
                showClose: true,
                message: "网络错误",
                type: "error",
              });
            }
          );
      } else if (type == "edit") {
        let tid = this.$validator.getUrlKey("tid");
        var that = this;
        var data = { tid: tid }; //定义一个data储存需要带的参数
        that.$axios
          .post(
            that.$domain + "/api/getPosterDesignTemple",
            that.$qs.stringify(data)
            /* that.$axios.post("http://192.168.1.7:8081" + "/api/getPosterDesignTemple",that.$qs.stringify(data) */
          )
          .then(
            (res) => {
              if (res.data.code == 200) {
                that.clearWidget();
                /* console.log(res.data.data.content) */
                that.title = res.data.data.title;
                var content = JSON.parse(res.data.data.content);
                var widgets = content.widgets;
                for (let i = 0; i < widgets.length; i++) {
                  /* console.log(widgets[i]); */
                  that.addWidget(widgets[i]);
                }
                that.updatePageData({
                  key: "backgroundImage",
                  value: content.backgroundImage,
                });
                that.setCheckImgIds(content.imgList);
              } else {
                /* alert("初始化失败，请重新进入") */
                that.$message({
                  showClose: true,
                  message: "初始化失败，请重新进入",
                  type: "error",
                });
              }
              console.log(res);
              console.log(res.data.data[0]);
            },
            (err) => {
              that.fillStep = 2;
              /* alert("网络错误") */
              that.$message({
                showClose: true,
                message: "网络错误",
                type: "error",
              });
            }
          );
      }
    },
    mouseRightClick(e) {
      e.stopPropagation();
      e.preventDefault();
      if (this.showMenuBg) {
        this.showMenuBg = false;
        return;
      }
      let target = e.target;
      let type = target.getAttribute("data-type");
      if (type) {
        let uuid = target.getAttribute("data-uuid"); // 设置选中元素

        if (uuid !== "-1" && !this.dAltDown) {
          let widget = this.dWidgets.find((item) => item.uuid === uuid);
          if (
            widget.parent !== "-1" &&
            widget.parent !== this.dActiveElement.uuid &&
            widget.parent !== this.dActiveElement.parent
          ) {
            uuid = widget.parent;
          }
        }
        this.selectWidget({
          uuid: uuid || "-1",
        });
        this.showMenu(e);
      }
    },
    showMenu(e) {
      let isPage = this.dActiveElement.uuid === "-1";
      this.menuList.list = isPage ? this.pageMenu : this.widgetMenu;
      if (this.dActiveElement.isContainer) {
        let ungroup = [
          {
            type: "ungroup",
            text: "取消组合",
          },
        ];
        this.menuList.list = ungroup.concat(this.menuList.list);
      }
      this.showMenuBg = true;
      document
        .getElementById("menu-bg")
        .addEventListener("click", this.closeMenu, false);
      let mx = e.pageX;
      let my = e.pageY;
      let listWidth = 120;
      if (mx + listWidth > window.innerWidth) {
        mx -= listWidth;
      }
      let listHeight = (14 + 10) * this.menuList.list.length + 10;
      if (my + listHeight > window.innerHeight) {
        my -= listHeight;
      }
      this.menuList.left = mx;
      this.menuList.top = my;
    },
    closeMenu() {
      this.showMenuBg = false;
      document
        .getElementById("menu-bg")
        .removeEventListener("click", this.closeMenu, false);
    },
    selectMenu(type) {
      switch (type) {
        case "copy":
          this.copyWidget();
          break;
        case "paste":
          if (this.dCopyElement.length === 0) {
            return;
          }
          this.pasteWidget();
          break;
        case "index-up":
          this.updateLayerIndex({
            uuid: this.dActiveElement.uuid,
            value: 1,
            isGroup: this.dActiveElement.isContainer,
          });
          break;
        case "index-down":
          this.updateLayerIndex({
            uuid: this.dActiveElement.uuid,
            value: -1,
            isGroup: this.dActiveElement.isContainer,
          });
          break;
        case "del":
          this.deleteWidget();
          break;
        case "ungroup":
          this.ungroup(this.dActiveElement.uuid);
          break;
      }
    },
    returnPage() {
      this.$router.replace("/");
    },
    // save () {
    //   this.fillStep = 1
    //   this.fillInfoing = true
    //   let nowGrideSizeIndex = this.gridSizeIndex
    //   let nowZoom = this.dZoom
    //   // 取消选中元素
    //   this.selectWidget({
    //     uuid: '-1'
    //   })
    //   this.gridSizeIndex = 0
    //   this.updateZoom(100)
    //   this.getQiniuToken().then((data) => {
    //     let opts = {
    //       useCORS: true, // 跨域图片
    //     }
    //     html2canvas(document.getElementById('page-design-canvas'), opts).then((canvas) => {
    //       canvas.toBlob((blob) => {
    //         this.blobToImage(blob, data => {
    //           document.getElementById('cover').src = data
    //         })

    //         this.fillStep = 2
    //         this.gridSizeIndex = nowGrideSizeIndex
    //         this.updateZoom(nowZoom)

    //         this.formParams = new FormData()
    //         this.formParams.append('token', data.token)
    //         this.formParams.append('file', blob, 'canvas.png')
    //       }, 'image/png')
    //     })
    //   }).catch(err => this.saveError(err.msg))
    // },
    publish() {
      if (this.publishing) {
        return;
      }
      if (!this.title) {
        this.$message({
          showClose: true,
          message: "请输入名称",
          type: "error",
        });
        return;
      }
      this.publishing = true;
      this.uploadToQiniu(this.formParams)
        .then((qiniuData) => {
          this.getWidgetJsonData().then((json) => {
            let templateData = {
              title: this.title,
              template: JSON.stringify(json),
              cover: qiniuData.imgUrl,
            };
            this.fillStep = 3;
            this.createDesignTemplate(templateData)
              .then((data) => {
                this.fillStep = 4;
                this.publishing = false;
                this.fillInfoing = false;
                this.$message({
                  showClose: true,
                  message: "发布完成",
                  type: "success",
                });
              })
              .catch((err) => {
                this.publishing = false;
                if (!err.code === -2) {
                  this.saveError(err.msg);
                }
              });
          });
        })
        .catch((err) => this.saveError(err.msg));
    },
    closePublish() {
      this.publishing = false;
      this.fillInfoing = false;
      this.fillStep = 1;
    },
    saveError(message) {
      this.publishing = false;
      this.fillInfoing = false;
      this.fillStep = 1;
      this.$message({
        showClose: true,
        message: message,
        type: "error",
      });
    },
    fileOrBlobToDataURL(obj, cb) {
      let a = new FileReader();
      a.readAsDataURL(obj);
      a.onload = (e) => {
        cb(e.target.result);
      };
    },
    blobToImage(blob, cb) {
      this.fileOrBlobToDataURL(blob, (dataurl) => {
        cb(dataurl);
      });
    },
    saveAndClose() {
      this.fillStep = 1;
      this.fillInfoing = true;
      let nowGrideSizeIndex = this.gridSizeIndex;
      let nowZoom = this.dZoom;
      this.percent = 0;
      // 取消选中元素
      this.selectWidget({
        uuid: "-1",
      });
      this.gridSizeIndex = 0;
      this.updateZoom(100);
      let opts = {
        useCORS: true, // 跨域图片
        width: 750,
        height: 1334,
        windowWidth: 4000,
        windowHeight: 4000,
        x: 0,
        y: window.pageYOffset,
      };
      let _this = this;

      this.percent = 30;
      setTimeout(function () {
        _this.percent = 50;
        html2canvas(document.getElementById("page-design-canvas"), opts).then(
          (canvas) => {
            _this.percent = 70;
            canvas.toBlob((blob) => {
              _this.blobToImage(blob, (data) => {
                document.getElementById("cover1").src = data;
              });
              // _this.fillStep = 2;
              _this.gridSizeIndex = nowGrideSizeIndex;
              _this.updateZoom(nowZoom);
              _this.getWidgetJsonData().then((json) => {
                _this.content = JSON.stringify(json);
              });
              setTimeout(function () {
                _this.percent = 90;
                _this.saveTmpl(true);
                  _this.percent = 90;
              }, 500);
            }, "image/png");
          }
        );
      }, 500);
    },
    save() {
      var that = this;
      this.fillStep = 1;
      this.fillInfoing = true;
      let nowGrideSizeIndex = this.gridSizeIndex;
      let nowZoom = this.dZoom;
      // 取消选中元素
      this.selectWidget({
        uuid: "-1",
      });
      this.gridSizeIndex = 0;
      this.updateZoom(100);
      this.percent = 0;
      this.imgList = [];
      this.posterList = [];
      this.getStoreImgList().then((json) => {
        this.imgList = json;
        this.posterCount = this.imgList.length;
        console.log("imgList");
        console.log(this.imgList);
        if (this.posterCount == 0) {
          this.$message({
            showClose: true,
            message: "请选择背景图片",
            type: "error",
          });
          this.gridSizeIndex = nowGrideSizeIndex;
          this.updateZoom(nowZoom);
          this.closePublish();

          return;
        }

        this.acyncCreatImg(this.posterCount, nowGrideSizeIndex, nowZoom);
      });
    },
    async acyncCreatImg(imgLength, nowGrideSizeIndex, nowZoom) {
      var that = this;
      await this.createImg(this.imgList[this.posterList.length]).then((res) => {
        // console.log(res);
        this.posterList.push(res);
        if (this.posterList.length == 1) {
          document.getElementById("cover1").src = res;
        }
        if (this.posterList.length == imgLength) {
          this.percent = 100;
          this.fillStep = 2;
          this.gridSizeIndex = nowGrideSizeIndex;
          this.updateZoom(nowZoom);
          this.setPosterList(this.posterList);
          this.getWidgetJsonData().then((json) => {
            this.content = JSON.stringify(json);
          });

          setTimeout(function () {
            that.saveTmplBase();
          }, 500);
        } else {
          this.percent = Math.floor((this.posterList.length / imgLength) * 100);
          console.log(this.percent);
          this.acyncCreatImg(imgLength, nowGrideSizeIndex, nowZoom);
        }
      });
    },
    createImg(img) {
      return new Promise((resolve, reject) => {
        console.log(img);
        this.updatePageData({
          key: "backgroundImage",
          value: img,
        });
        // 取消选中元素
        this.selectWidget({
          uuid: "-1",
        });
        this.gridSizeIndex = 0;
        let opts = {
          useCORS: true, // 跨域图片
          width: 750,
          height: 1334,
          windowWidth: 4000,
          windowHeight: 4000,
          x: 0,
          y: window.pageYOffset,
        };
        let _this = this;

        setTimeout(async function () {
          await html2canvas(
            document.getElementById("page-design-canvas"),
            opts
          ).then((canvas) => {
            canvas.toBlob((blob) => {
              _this.blobToImage(blob, (data) => {
                // document.getElementById("cover").src = data;
                _this.$qiniu.getQiniuToken(_this).then((res) => {
                  console.log(res);
                  if (res.data.code == 200) {
                    _this.$qiniu
                      .uploadQiniu(_this, res.data.data, data)
                      .then((res) => {
                        console.log(res);
                        if (res.status == 200) {
                          var imgUrl = _this.$imgDomain + res.data.key;
                          console.log(imgUrl);
                          resolve(imgUrl);
                        }
                      });
                  } else {
                    _this.fillStep = 2;
                    /* alert("网络错误") */
                    _this.$message({
                      showClose: true,
                      message: "网络错误",
                      type: "error",
                    });
                  }
                });
              });

              // _this.fillStep = 2;
              // _this.gridSizeIndex = nowGrideSizeIndex;
              // _this.updateZoom(nowZoom);
              // _this.getWidgetJsonData().then((json) => {
              //   _this.content = JSON.stringify(json);
              // });
              // setTimeout(function () {
              //   _this.saveTmpl(false);
              // }, 500);
            }, "image/png");
          });
        }, 500);
      });
    },
    saveTmpl(close) {
      if (this.publishing) {
        return;
      }
      if (!this.title) {
        this.$message({
          showClose: true,
          message: "请输入名称",
          type: "error",
        });
        this.closePublish();
        return;
      }
      if (!this.content) {
        this.$message({
          showClose: true,
          message: "参数错误",
          type: "error",
        });
        this.closePublish();
        return;
      }
      var imgList = JSON.parse(this.content).imgList;
      if (imgList.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择背景图片",
          type: "error",
        });
        this.closePublish();
        return;
      }
      var user = this.$local.get("user");
      if (!user || !user.id) {
        this.$message({
          showClose: true,
          message: "用户不存在或未登录",
          type: "error",
        });
        this.$router.replace("/");
        return;
      }
      this.publishing = true;
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png");

        let a = document.createElement("a");
        let event = new MouseEvent("click");

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        // a.download = name || 'pageDesign'
        // a.href = url

        // 触发a的单击事件
        // a.dispatchEvent(event)
      };
      image.src = document.getElementById("cover1").src;
      this.publishing = false;
      this.fillStep = 1;
      var that = this;
      that.$qiniu.getQiniuToken(that).then((res) => {
        console.log(res);
        if (res.data.code == 200) {
          that.$qiniu
            .uploadQiniu(that, res.data.data, image.src)
            .then((res) => {
              console.log(res);
              if (res.status == 200) {
                var imgUrl = this.$imgDomain + res.data.key;
                console.log(imgUrl);
                let type = this.$validator.getUrlKey("type");
                var data1;
                if (type == "add") {
                  data1 = {
                    thumb: imgUrl,
                    title: that.title,
                    content: that.content,
                    type: 1,
                    uid: user.id,
                  };
                } else if (type == "edit") {
                  let tid = this.$validator.getUrlKey("tid");
                  data1 = {
                    thumb: imgUrl,
                    title: that.title,
                    content: that.content,
                    type: 1,
                    id: tid,
                  };
                }
                that.$axios
                  .post(
                    that.$domain + "/api/savePosterDesignTemple",
                    that.$qs.stringify(data1)
                  )
                  .then(
                    (res) => {
                      if (res.data.code == 200) {
                        that.fillStep = 2;
                        /* alert("保存成功") */
                        that.$message({
                          showClose: true,
                          message: "模板已保存",
                          type: "success",
                        });
                        window.parent.postMessage("close", "*");
                        if (close) {
                          this.$router.replace("/");
                        }
                      } else {
                        that.fillStep = 2;
                        /* alert("模板保存失败，请重新试试") */
                        that.$message({
                          showClose: true,
                          message: "模板保存失败，请重新试试",
                          type: "error",
                        });
                      }
                    },
                    (err) => {
                      that.fillStep = 2;
                      /* alert("网络错误") */
                      that.$message({
                        showClose: true,
                        message: "网络错误",
                        type: "error",
                      });
                    }
                  );
              }
            });
        } else {
          that.fillStep = 2;
          /* alert("网络错误") */
          that.$message({
            showClose: true,
            message: "网络错误",
            type: "error",
          });
        }
      });
    },
    saveTmplBase() {
      if (this.publishing) {
        return;
      }
      if (!this.title) {
        this.$message({
          showClose: true,
          message: "请输入名称",
          type: "error",
        });
        return;
      }
      if (!this.content) {
        this.$message({
          showClose: true,
          message: "参数错误",
          type: "error",
        });
        return;
      }
      var imgList = JSON.parse(this.content).imgList;
      if (imgList.length == 0) {
        this.$message({
          showClose: true,
          message: "请选择背景图片",
          type: "error",
        });
        return;
      }
      var user = this.$local.get("user");
      if (!user || !user.id) {
        this.$message({
          showClose: true,
          message: "用户不存在或未登录",
          type: "error",
        });
        return;
      }
      this.publishing = true;

      this.publishing = false;
      this.fillStep = 1;
      var that = this;
      var imgUrl = document.getElementById("cover1").src;
      console.log(imgUrl);
      let type = this.$validator.getUrlKey("type");
      var data1;
      if (type == "add") {
        data1 = {
          thumb: imgUrl,
          title: that.title,
          content: that.content,
          type: 1,
          uid: user.id,
        };
      } else if (type == "edit") {
        let tid = this.$validator.getUrlKey("tid");
        data1 = {
          thumb: imgUrl,
          title: that.title,
          content: that.content,
          type: 1,
          id: tid,
        };
      }
      that.$axios
        .post(
          that.$domain + "/api/savePosterDesignTemple",
          that.$qs.stringify(data1)
        )
        .then(
          (res) => {
            if (res.data.code == 200) {
              that.fillStep = 2;
              /* alert("保存成功") */
              that.$message({
                showClose: true,
                message: "模板已保存",
                type: "success",
              });
              window.parent.postMessage("close", "*");
            } else {
              that.fillStep = 2;
              /* alert("模板保存失败，请重新试试") */
              that.$message({
                showClose: true,
                message: "模板保存失败，请重新试试",
                type: "error",
              });
            }
          },
          (err) => {
            that.fillStep = 2;
            /* alert("网络错误") */
            that.$message({
              showClose: true,
              message: "网络错误",
              type: "error",
            });
          }
        );
    },
    saveImg() {
      if (this.publishing) {
        return;
      }
      this.publishing = true;
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png");

        let a = document.createElement("a");
        let event = new MouseEvent("click");

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        a.download = name || "pageDesign";
        a.href = url;

        // 触发a的单击事件
        a.dispatchEvent(event);
      };

      image.src = document.getElementById("cover1").src;
      this.publishing = false;
    },
    savePoster() {
      if (this.publishing) {
        return;
      }
      var that = this;
      let tid = this.$validator.getUrlKey("tid");

      var data = {
        uid: this.user.id,
        title: that.title,
        link: document.getElementById("cover1").src,
        type: 0,
        tempId: tid,
        taskId: 0,
        tempName: that.name,
        // storeId:0,
        // tempName:0,
      };
      this.saveUserFile(data);
    },
    saveUserFile(dataStr) {
      var data = dataStr;
      this.$axios
        .post(
          this.$domain + "/api/douyin/saveDesignMaterial?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$confirm("保存成功，请选择?", "提示", {
              confirmButtonText: "查看作品",
              cancelButtonText: "继续导出",
              type: "success",
            })
              .then(() => {
                this.$message({
                  showClose: false,
                  message: "保存成功",
                  type: "success",
                });
                if (data.type == 0) {
                  // window.location.href = "/?defaltActive=works&workTab=1";
                  this.$router.push("/?defaltActive=works&workTab=1");
                } else {
                  // window.location.href = "/?defaltActive=works&workTab=0";
                  this.$router.push("/?defaltActive=works&workTab=0");
                }
              })
              .catch(() => {
                this.$message({
                  type: "info",
                  message: "继续导出",
                });
              });
          } else {
            //alert(res.data.msg);
            this.$message({
              type: "info",
              message: res.data.msg,
            });
          }
        });
    },
    saveVideo() {
      if (this.publishing) {
        return;
      }
      var that = this;

      let tid = this.$validator.getUrlKey("tid");
      var data = {
        uid: that.user.id,
        title: that.title,
        posterUrl: document.getElementById("cover1").src,
        type: 1,
        // tempId:0,
        taskId: 0,
        link: that.videoInfo.link,
        tempId: tid,
        tempName: that.name,
        // storeId:0,
        // tempName:0,
      };
      this.saveUserFile(data);
    },

    saveImgToStore() {
      if (this.publishing) {
        return;
      }
      this.publishing = true;
      let image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function () {
        let canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        let context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        let url = canvas.toDataURL("image/png");

        let a = document.createElement("a");
        let event = new MouseEvent("click");

        // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
        // a.download = name || 'pageDesign'
        // a.href = url

        // 触发a的单击事件
        // a.dispatchEvent(event)
      };

      image.src = document.getElementById("cover").src;
      this.publishing = false;
      var that = this;
      var data = {
        base64: image.src,
        ext: ".png",
        uid: this.$validator.getUrlKey("uid"),
      }; //定义一个data储存需要带的参数
      that.$axios
        .post(that.$domain + "/uploads/base64", that.$qs.stringify(data))
        .then((res) => {
          if (res.data.errno == 0) {
            alert("保存成功");
          } else {
            alert("图片保存失败，请重新试试");
          }
          console.log(res);
          console.log(res.data.data[0]);
        });
    },
  },
};
</script>

<style lang="stylus">
@import '~STYLUS/page-design-element-ui.styl';
</style>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#page-design-index {
  width: 100%;
  min-width: 1180px;
  height: 100%;
  min-height: 500px;
  position: absolute;
  background-color: #efefef;
  display: flex;
  flex-direction: column;

  .menu-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 9;

    .menu-list {
      position: absolute;
      width: 120px;
      background-color: $color-white;
      box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, 0.1);
      padding: 5px;

      .menu-item {
        width: 100%;
        padding: 5px 15px;
        cursor: pointer;
        font-size: 14px;
        line-height: 1;

        &:hover {
          background-color: #ececec;
        }

        &.disable-menu {
          background-color: $color-white;
          cursor: not-allowed;
          color: #aaaaaa;
        }
      }
    }
  }

  .top-nav {
    z-index: 9;
    // position: absolute;
    // width: 100%;
    // min-width: 1180px;
    // height: 45px;
    display: flex;
    justify-content: end;
    top: 0px;

    .top-nav-wrap {
      position: fixed;
      right: 0;
      width: 300px;
      height: 60px;
      min-width: 300px;
      background-color: #252327;
      display: flex;
      align-items: center;

      .top-back {
        width: 60px;
        height: 45px;
        cursor: pointer;
        color: $color-white;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 1px 0px 10px 3px rgba(0, 0, 0, 0.1) inset;

        i {
          font-size: 28px;
        }
      }

      .top-title {
        flex: 1;
        text-align: center;
        color: $color-white;
        font-weight: bold;
        cursor: pointer;
      }

      .top-icon-wrap {
        height: 45px;
        display: flex;

        .top-icon {
          color: #33e0c0;
          margin: 8px;
          border-radius: 5px;
          padding: 5px 8px;
          font-weight: bold;
          cursor: pointer;
          background-color: rgba(0, 0, 0, 0.4);

          &:hover {
            background-color: rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }

  .page-design-index-wrap {
    width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    overflow: hidden;
    flex-direction: row;

    .page-design-wrap {
      flex: 1;
      background-color: #333334;
    }
  }
}

.operation {
  z-index: 1000;
  width: 45px;
  position: absolute;
  top: 200px;
  right: 320px;

  .operation-wrap {
    box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;

    &:last-child {
      margin-bottom: 0px;
    }

    .operation-item {
      border-bottom: 1px solid $color-dark-gray;
      background-color: $color-light-gray;
      color: $color-white;
      width: 100%;
      height: 45px;
      font-size: 10px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      p {
        margin-top: 5px;
      }

      &:hover {
        color: #33e0c0;
        background-color: $color-dark-gray;
      }

      &:last-child {
        border-bottom: 0px;
      }

      .grid-selecter {
        position: absolute;
        width: 120px;
        left: -8px;
        transform: translateX(-100%);
        background-color: $color-dark-gray;
        color: $color-white;
        z-index: 1000;

        &:after {
          content: '';
          position: absolute;
          top: 50%;
          right: -8px;
          transform: translateY(-50%);
          triangle(right, 8px, $color-dark-gray);
        }

        .grid-item {
          width: 100%;
          height: 34px;
          font-size: 14px;
          padding: 10px;
          display: flex;
          align-items: center;
          cursor: pointer;

          span {
            flex: 1;
          }

          &:hover {
            color: $color-main;
            background-color: #50555b;
          }
        }

        .grid-item-active {
          color: $color-main;
          background-color: #50555b;
        }
      }
    }

    .operation-item-active {
      color: $color-main;
      background-color: $color-dark-gray;
    }

    .disable {
      color: #808080;

      &:hover {
        color: #808080;
        background-color: $color-light-gray;
        cursor: not-allowed;
      }
    }
  }
}

.fill-info-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #333334;
  z-index: 2000;
  padding: 50px;

  .fill-info-content {
    border-radius: 10px;
    width: 1200px;
    min-height: 500px;
    max-height: 661px;
    margin: 0 auto;
    padding: 20px;
    background-color: #2b2a2a;
    display: flex;
    flex-direction: column;

    .fill-info-step {
      width: 100%;
      flex: 1;
      display: grid;
      grid-template-columns: 50% 50%;
      align-items: flex-end;
      justify-items: center;

      #cover-wrap {
        margin: 20px auto;
        width: 400px;
        height: 400px;
        display: flex;
        justify-content: center;
        align-items: center;

        #cover {
          max-width: 400px;
          max-height: 400px;
          box-shadow: 1px 1px 10px 3px rgba(0, 0, 0, 0.1);
        }
      }

      .publish-btn {
        margin: 20px auto;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        color: $color-white;
        background-color: $color-main;
        cursor: pointer;

        &:hover {
          background-color: lighten($color-main, 10%);
        }
      }

      .close-publish {
        margin: 20px auto;
        margin-bottom: 20px;
        padding: 10px;
        text-align: center;
        border-radius: 5px;
        color: $color-main;
        background-color: $color-white;
        outline: 1px solid $color-main;
        cursor: pointer;

        &:hover {
          color: $color-white;
          background-color: lighten($color-main, 10%);
        }
      }
    }
  }
}

/deep/ .operation .operation-wrap .operation-item {
  background-color: #3c3c40;
  color: #33e0c0;
}

/deep/ .operation .operation-wrap .disable {
  background-color: #454546;
  color: #5c5c5f;
}

.fillTitle {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: 400px;
}

.fillBtn {
  width: 66%;
  height: 100%;
  // display:flex;
  // flex-flow: column;
  display: grid;
  grid-template-rows: 12% 70% 18%;
  margin: -11px auto;
}

.fillBtns {
  display: flex;
  flex-flow: row;
}

.fillAtt {
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
  color: #ffffff;
  font-size: 1px !important;
}

.fillAtt span {
  margin: 10px 0 10px 0;
}

#text-input {
  margin-top: 10px;
}

/deep/ .el-carousel__button {
  width: 10px;
  height: 10px;
  border: none;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
}

/deep/ .is-active .el-carousel__button {
  background: #3b74f1;
}

/deep/ .el-carousel__indicator--horizontal {
  padding: 6px 3px;
}

.schedule {
  display: flex;
  justify-content: center;
  margin-top: 100px;
}
</style>
