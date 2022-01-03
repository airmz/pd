<!--
 * @Author: airmz
 * @Date: 2021-12-11 10:25:00
 * @LastEditTime: 2022-01-03 21:45:54
 * @FilePath: \pd\src\common\pageDesign\panel\videoPart.vue
-->
<template>
  <div id="Video-part-wrap">
    <div class="basic-text-wrap">
      <div style="margin-top: 60px">
        <div id="tab">
          <el-menu
            :default-active="activeIndex"
            class="el-menu-demo"
            mode="horizontal"
            @select="handleSelect"
            background-color="#333334"
          >
            <el-menu-item @click="activeIndex = '1'" index="1"
              >片段</el-menu-item
            >
            <el-menu-item @click="activeIndex = '2'" index="2"
              >音乐({{ musicChecked.length }})</el-menu-item
            >
            <el-menu-item @click="activeIndex = '3'" index="3"
              >配音({{ dubbingChecked.length }})</el-menu-item
            >
            <el-menu-item @click="activeIndex = '4'" index="4"
              >生成</el-menu-item
            >
          </el-menu>
          <el-scrollbar style="height: calc(100vh - 120px)">
            <div
              v-infinite-scroll="loadMoreHot"
              infinite-scroll-disabled="busy"
              infinite-scroll-distance="10"
            >
              <div v-show="activeIndex == '1'">
                <div style="margin-top: 5px">
                  <el-tabs
                    v-model="activeName"
                    tab-position="left"
                    @tab-click="handleClick"
                  >
                    <el-tab-pane label="片段一" name="first"></el-tab-pane>
                    <el-tab-pane label="片段二" name="second"></el-tab-pane>
                    <el-tab-pane label="片段三" name="third"></el-tab-pane>
                    <el-tab-pane label="片段四" name="fourth"></el-tab-pane>
                    <el-tab-pane label="片段五" name="fifth"></el-tab-pane>
                  </el-tabs>
                  <div class="video">
                    <div class="videoList" v-show="videoList">
                      <div>
                        <div class="upload" style="margin-top: -40px">
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
                      <!-- <div>
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
                          <span class="videoTitle">{{
                            defalutVideo.title
                          }}</span>
                        </div> -->
                      <div v-for="(item, index) in fileList" :key="index">
                        <div v-if="item.thumb">
                          <div class="videoSubTime">
                            <p class="videoTime">{{ item.useTime }}次</p>
                            <p class="videoTime">{{ item.fileSize }}</p>
                          </div>

                          <div
                            class="bgVideo bgVideoList"
                            @click="selectVideo(item)"
                          >
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
                        <span v-if="!item.thumb" class="videoTitle">{{
                          item.subTitle
                        }}</span>
                        <span v-if="item.thumb" class="videoTitle">{{
                          item.title
                        }}</span>
                        <el-popover
                          placement="bottom"
                          width="150"
                          trigger="click"
                        >
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
              </div>
              <div v-show="activeIndex == '2'">
                <div class="musicBtn">
                  <yl-upload
                    class="videoUpload"
                    :action="uploadUrl"
                    multiple
                    :show-file-list="false"
                    :on-success="uploadMusic"
                    :chunk-size="1024 * 1024 * 500"
                    :thread="1"
                  >
                    <el-button type="success" class="musicUp"
                      >上传音乐
                    </el-button>
                  </yl-upload>
                  <el-button type="danger" size="small">
                    <el-checkbox
                      :indeterminate="isIndeterminate"
                      v-model="checkAll"
                      @change="handleCheckAllChange"
                      >全选</el-checkbox
                    >
                  </el-button>
                </div>
                <el-checkbox-group
                  v-model="musicChecked"
                  @change="handleCheckedCitiesChange"
                >
                  <div class="music">
                    <ul>
                      <li
                        class="musicTitle"
                        v-for="(item, index) in musicList"
                        :key="index"
                      >
                        <div>
                          <el-checkbox @change="changeMusic" :label="item.id">
                            {{ item.title }}</el-checkbox
                          >
                        </div>
                        <div class="palyBtn">
                          <div
                            class="palyImg"
                            :data-url="item.link"
                            :data-id="item.id"
                            @click="playAudio"
                          >
                            <img
                              v-if="nowMusicPlay == item.id"
                              src="http://airmz.top/suspend.png"
                              alt=""
                            />
                            <img
                              v-else
                              src="http://airmz.top/play.png"
                              alt=""
                            />
                          </div>
                          <div
                            class="palyImg"
                            style="margin-left: 5px"
                            @click="deleteMusic"
                          >
                            <img src="http://airmz.top/delete.png" alt="" />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </el-checkbox-group>
              </div>
              <div v-show="activeIndex == '3'">
                <div class="writing">
                  <div class="workList">
                    <span>请输入文案:</span>
                    <el-input
                      type="textarea"
                      :rows="2"
                      placeholder="请输入文案"
                      v-model="dubbingText"
                    >
                    </el-input>
                    <span>请选择配音:</span>
                    <div class="dubbing">
                      <div
                        class="dubbingCon"
                        v-for="(item, index) in dubbing"
                        :key="index"
                      >
                        <div
                          class="dubSelect"
                          :class="{ activeDubbing: isActive == item.id }"
                          @click="activeDubbing(item)"
                        >
                          <i :class="item.icon"></i>
                          <span>{{ item.name }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="dubBtn">
                      <el-button type="primary" @click="saveDubbing"
                        >生成配音</el-button
                      >
                    </div>
                  </div>

                  <span>配音列表:</span>
                  <div class="musicBtn">
                    <yl-upload
                      class="videoUpload"
                      :action="uploadUrl"
                      multiple
                      :show-file-list="false"
                      :on-success="uploadDubbing"
                      :chunk-size="1024 * 1024 * 500"
                      :thread="1"
                    >
                      <el-button type="success" class="musicUp"
                        >上传配音
                      </el-button>
                    </yl-upload>
                    <el-button type="danger" size="small">
                      <el-checkbox
                        :indeterminate="isIndeterminate2"
                        v-model="checkAll2"
                        @change="handleCheckAllChanges"
                        >全选</el-checkbox
                      >
                    </el-button>
                  </div>
                  <el-checkbox-group v-model="dubbingChecked">
                    <div class="music">
                      <!-- <yl-upload
                        class="videoUpload"
                        :action="uploadUrl"
                        multiple
                        :show-file-list="false"
                        :on-success="uploadDubbing"
                        :chunk-size="1024 * 1024 * 500"
                        :thread="1"
                      >
                        <el-button>上传配音 </el-button>
                      </yl-upload> -->
                      <ul>
                        <li
                          class="musicTitle"
                          v-for="(item, index) in dubbingList"
                          :key="index"
                        >
                          <div
                            style="display: flex; flex-flow: row; width: 300px"
                          >
                            <el-checkbox
                              class="check"
                              @change="changeDubbing"
                              :label="item.id"
                            >
                              <div class="musicImg">
                                {{ item.title }}
                              </div>
                            </el-checkbox>
                            <div class="palyBtn">
                              <div
                                class="palyImg"
                                :data-url="item.link"
                                :data-id="item.id"
                                @click="playAudio"
                              >
                                <img
                                  v-if="nowMusicPlay == item.id"
                                  src="http://airmz.top/suspend.png"
                                  alt=""
                                />
                                <img
                                  v-else
                                  src="http://airmz.top/play.png"
                                  alt=""
                                />
                              </div>
                              <div
                                class="palyImg"
                                style="margin-left: 5px"
                                @click="deleteMusic"
                              >
                                <img src="http://airmz.top/delete.png" alt="" />
                              </div>
                            </div>
                            <!-- <div
                              class="palyImg"
                              :data-url="item.link"
                              :data-id="item.id"
                              @click="playAudio"
                            >
                              <img
                                v-if="nowMusicPlay == item.id"
                                src="http://airmz.top/suspend.png"
                                alt=""
                              />
                              <img
                                v-else
                                src="http://airmz.top/play.png"
                                alt=""
                              />
                            </div> -->
                          </div>
                        </li>
                      </ul>
                    </div>
                  </el-checkbox-group>
                </div>
              </div>
              <div v-show="activeIndex == '4'">
                <div style="margin-top: 15px" v-if="taskCount == 0">
                  <div class="workList">
                    作品名称:
                    <el-input
                      v-model="createInfo.title"
                      placeholder="请输入作品名称"
                      clearable
                    ></el-input>
                    <!-- </div> -->
                    <!-- <div class="workList">
                    音乐:
                    <span>{{musicChecked.length}}(个)</span>
                    
                  </div>
                  <div class="workList">
                    配音:
                    <span>{{dubbingChecked.length}}(个)</span>
                  </div>
                  <div class="workList">
                    视频总数:
                    <span>111个</span>
                  </div> -->
                    <!-- <div class="workList"> -->
                    生成数量:
                    <el-input
                      v-model="createInfo.toCreate"
                      maxlength="3"
                      onkeyup="value=value.replace(/[^\d]/g,0)"
                      clearable
                      placeholder="当前一次性生成视频数量，最大值30"
                    ></el-input>
                    <!-- </div>
                  <div class="workList"> -->
                    视频阈值:
                    <el-input
                      v-model="createInfo.autoCreate"
                      maxlength="3"
                      onkeyup="value=value.replace(/[^\d]/g,0)"
                      clearable
                      placeholder="当视频数量小于阈值时，自动生成视频，最大值30"
                    ></el-input>
                    <div class="workBtn">
                      <el-button type="primary" @click="createVideo"
                        >确认生成</el-button
                      >
                    </div>
                  </div>
                </div>
                <div style="margin-top: 20px">
                  <div class="workLists workTitle">
                    <span>任务列表:</span>
                    <el-button type="primary" @click="seeVideo" size="small"
                      >查看生成视频</el-button
                    >
                  </div>

                  <div
                    class="writings"
                    v-for="(item, index) in createList"
                    :key="index"
                  >
                    <!-- <div class="workList">
                        <span>创建时间:</span>
                        <el-button type="primary" size="mini"
                          >2021-12-30 10:27</el-button
                        >
                      </div> -->
                    <!-- <div class="workList">
                        <span>请输入标题:</span>
                        <el-input
                          v-model="worksName"
                          placeholder="请输入标题"
                          clearable
                        ></el-input>
                      </div> -->
                    <div class="workList works">
                      <div>
                        <span>创建时间:</span>
                        <el-button type="primary" size="mini">{{
                          dateFormat(item.createDate)
                        }}</el-button>
                      </div>
                      <div>
                        <span>视频标题:</span>
                        <span>{{ item.title }}</span>
                      </div>
                      <div>
                        <span>可生产视频数:</span>
                        <el-button type="primary" size="mini"
                          >{{ item.total }}个</el-button
                        >
                      </div>
                      <div>
                        <span>已生产视频:</span>
                        <el-button type="primary" size="mini"
                          >{{ item.createVideo }}个</el-button
                        >
                      </div>
                      <div>
                        <span>第一次生成数量:</span>
                        <el-button type="primary" size="mini"
                          >{{ item.toCreate }}个</el-button
                        >
                      </div>
                      <div>
                        <span>视频阈值:</span>
                        <el-button type="primary" size="mini"
                          >{{ item.autoCreate }}个</el-button
                        >
                      </div>
                      <div>
                        <span>任务状态:</span>
                        <el-button
                          type="warning"
                          size="mini"
                          v-if="item.taskStatus == 0"
                          >等待中</el-button
                        >
                        <el-button
                          type="danger"
                          size="mini"
                          v-if="item.taskStatus == 1"
                          >执行中</el-button
                        >
                        <el-button
                          type="danger"
                          size="mini"
                          v-if="item.taskStatus == 2"
                          >已完成</el-button
                        >
                        <el-button
                          type="danger"
                          size="mini"
                          v-if="item.taskStatus == 3"
                          >执行异常</el-button
                        >
                      </div>
                    </div>
                    <!-- <div class="workList works">
                      <div>
                        <span>第一次生成数量:</span>
                        <el-button type="primary" size="mini">243</el-button>
                      </div>
                      <div>
                        <span>视频阈值:</span>
                        <el-button type="primary" size="mini">243</el-button>
                      </div>
                    </div> -->
                    <!-- <div class="workList works">
                      <div>
                        <span>任务状态:</span>
                        <el-button type="danger" size="mini">正在生成中</el-button>
                      </div>
                      <div>
                        <span>执行状态:</span>
                        <el-button type="warning" size="mini">等待中</el-button>
                      </div>
                    </div> -->
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>

      <div></div>
    </div>

    <div class="other-text-wrap"></div>
  </div>
</template>

<script>
// 文本组件列表
const NAME = "video-part-wrap";
import YlUpload from "COMPONENTS/upload";
import videoListWrap from "COMMON/pageDesign/panel/videoUpload.vue";
import { mapGetters, mapActions } from "vuex";
export default {
  name: NAME,
  components: { YlUpload, videoListWrap },
  data() {
    return {
      isIndeterminate: true,
      isIndeterminate2: true,
      active: 0,
      dubbingText: "",
      isActive: 0,
      dubbing: [
        { id: 5003, icon: "el-icon-s-custom", name: "男生配音" },
        { id: 5118, icon: "el-icon-s-check", name: "女生配音" },
      ],
      videoNum: "",
      worksName: "",
      checked: true,
      activeName: "first",
      checkAll: false,
      checkAll2: false,
      select_box: [],
      hasError: false,
      activeIndex: "1",
      drawer: false,
      direction: "rtl",
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
      type: 1,
      musicPage: 1,
      musicTotal: 0,
      musicList: [],
      musicChecked: [],
      audio: new Audio(),
      dubbingPage: 1,
      dubbingTotal: 0,
      dubbingList: [],
      dubbingChecked: [],
      nowMusicPlay: 0,
      createInfo: {
        title: "",
        toCreate: "",
        autoCreate: "",
        musics: [],
        dubbing: [],
      },
      createPage: 1,
      createToatal: 0,
      createList: [],
      taskCount: 0,
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
    deleteMusic() {
      this.$confirm("此操作将永久删除该音乐, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleCheckAllChange(val) {
      if(val){
        this.musicList.forEach((item)=>{
          this.musicChecked.push(item.id)
        });
      }else{
        this.musicChecked=[]
      }
      this.isIndeterminate = false;
      // this.musicChecked = val ? this.musicList : [];
      // this.isIndeterminate = false;
    },
    handleCheckAllChanges(val) {
      console.log(val);
      // this.dubbingChecked = val ? this.dubbingList : [];
      this.isIndeterminate2 = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.musicList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.musicList.length;
    },
    seeVideo() {
      this.$parent.clickClassify(1);
    },
    checkIcon(index) {
      this.i = index;
    },
    playIcon(index) {
      this.i != index;
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
    activeDubbing(item) {
      // console.log(item);
      if (item.id != this.isActive) {
        this.getDubbing(item.id);
      } else {
        this.audio.play();
      }
      this.isActive = item.id;
    },
    getDubbing(id) {
      if (this.dubbingText == "") {
        this.$message({
          showClose: false,
          message: "请先输入配音文本！",
          type: "error",
        });
        return;
      }
      var data = {
        text: this.dubbingText,
        dubbing: id,
      };
      this.$axios
        .post(
          this.$domain + "/wechat/api/manager/text2Dubbing?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res);
            this.playAudioUrl(res.data.data[0]);

            // this.$message({
            //   showClose: false,
            //   message: "成功",
            //   type: "success",
            // });
          } else {
            //alert(res.data.msg);
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    saveAudio(data) {
      this.$axios
        .post(
          this.$domain + "/api/saveCustomMaterial?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            console.log(res);
            this.$message({
              showClose: false,
              message: "上传成功",
              type: "success",
            });
          } else {
            //alert(res.data.msg);
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    saveDubbing() {
      var src = this.audio.src;
      if (src) {
        var user = this.$local.get("user");
        var data = {
          title: this.dubbingText.substring(0, 10),
          type: 3,
          link: src,
          uid: user.id,
        };
        this.$axios
          .post(
            this.$domain + "/api/saveCustomMaterial?",
            this.$qs.stringify(data)
          )
          .then((res) => {
            if (res.data.code == 200) {
              console.log(res);
              this.$message({
                showClose: false,
                message: "上传成功",
                type: "success",
              });
              this.dubbingList = [];
              this.getDubbingList(1);
            } else {
              //alert(res.data.msg);
              this.$message({
                showClose: false,
                message: res.data.msg,
                type: "error",
              });
            }
          });
      } else {
        this.$message({
          showClose: false,
          message: "请先选择配音类型！",
          type: "error",
        });
      }
    },
    createVideo(e) {
      var data = this.createInfo;
      if (this.musicChecked.length + this.dubbingChecked.length > 0) {
        data.musics = this.musicChecked.join(",");
        data.dubbing = this.dubbingChecked.join(",");
      } else {
        this.$message({
          showClose: false,
          message: "请先选择音乐或配音！",
          type: "error",
        });
        return;
      }

      var user = this.$local.get("user");
      data.uid = user.id;

      this.$axios
        .post(
          this.$domain + "/api/saveCreateVideoMaterial?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          if (res.data.code == 200) {
            this.$message({
              showClose: false,
              message: "任务添加成功",
              type: "success",
            });
            //查询任务
            this.createList = [];
            this.getCreateList(1);
          } else {
            this.$message({
              showClose: false,
              message: res.data.msg,
              type: "error",
            });
          }
        });
    },
    playAudioUrl(url) {
      this.audio.src = url;
      this.audio.load();
      this.audio.play();
    },
    playAudio(e) {
      var url = e.currentTarget.dataset.url;
      var id = e.currentTarget.dataset.id;

      var that = this;
      if (that.nowMusicPlay == id) {
        that.audio.pause();
        that.nowMusicPlay = 0;
      } else {
        that.nowMusicPlay = id;
        //播放音乐
        that.audio.src = url;
        that.audio.load();
        that.audio.play();
      }
      console.log(this.nowMusicPlay);
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      if (key == 2) {
        if (this.musicList.length == 0) {
          this.getMusicList(1);
        }
      } else if (key == 3) {
        if (this.dubbingList.length == 0) {
          this.getDubbingList(1);
        }
      } else if (key == 4) {
        this.createList = [];
        this.getCreateList(1);
      }
    },
    handleNodeClick(data) {
      console.log(data);
    },
    ...mapActions(["addWidget"]),
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
        type: this.type,
        link: imgUrl,
        thumb: imgUrl + "?vframe/jpg/offset/1|imageView2/0/w/500",
        fileSize: size.toFixed(2),
        hash: response[0].hash,
        useTime: 0,
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
    uploadMusic(response, file, fileLists) {
      console.log("//文件上传成功", response, file, fileLists);
      var url = this.$imgDomain + response[0].key;
      console.log(url);
      var user = this.$local.get("user");
      var data = {
        title: file.name,
        type: 2,
        link: url,
        uid: user.id,
      };

      this.saveAudio(data);
      var status = true;
      fileLists.map((item, index) => {
        if (item.status == "uploading") {
          status = false;
        }
      });
      if (status) {
        this.musicList = [];
        this.getMusicList(1);
      }
    },
    uploadDubbing(response, file, fileLists) {
      console.log("//文件上传成功", response, file, fileLists);
      var url = this.$imgDomain + response[0].key;
      console.log(url);
      var user = this.$local.get("user");
      var data = {
        title: file.name,
        type: 3,
        link: url,
        uid: user.id,
      };

      this.saveAudio(data);
      var status = true;
      fileLists.map((item, index) => {
        if (item.status == "uploading") {
          status = false;
        }
      });
      if (status) {
        this.dubbingList = [];
        this.getDubbingList(1);
      }
    },
    selectBasicVideo(item) {
      console.log(item);
    },
    next() {
      if (this.active++ > 2) this.active = 0;
    },
    dateFormat: function (date) {
      return this.$validator.dateFormat(date);
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.name == "first") {
        this.type = 1;
      } else if (tab.name == "second") {
        this.type = 2;
      } else if (tab.name == "third") {
        this.type = 3;
      } else if (tab.name == "fourth") {
        this.type = 4;
      } else if (tab.name == "fifth") {
        this.type = 5;
      }
      (this.fileList = {}), this.getUserVideoList(1);
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

          if (Math.floor(duration) >= 10 || Math.floor(duration) <= 2)
            reject(2);
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
            this.$message.error("请上传2~10秒以内的视频!");
          }
          return Promise.reject();
        }
      );
      return isSize;
    },
    beforeUploadAuidio(file) {
      console.log("beforeUploadAuidio", file);
      // console.log("aa", file.width);
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
        this.$message.error("上传大小不能超过100MB哦!");
        return false;
      }
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
                  type: this.type,
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
    changeMusic(e) {
      console.log(e);
      console.log(this.musicChecked);
    },
    changeDubbing(e) {
      console.log(this.dubbingChecked);
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
        type: this.type,
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
    getMusicList(page) {
      this.busy = true;
      console.log(page);
      if (page) {
        this.musicPage = page;
      } else {
        page = this.musicPage;
      }
      var user = this.$local.get("user");
      var data = {
        uid: user.id,
        page: page,
        size: 15,
        type: 2,
      };
      this.$axios
        .post(
          this.$domain + "/api/getCustomMaterialList?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          this.busy = false;
          if (res.data.code == 200) {
            this.musicTotal = res.data.data.totalElements;
            console.log(this.musicList);
            if (this.musicList.length > 0) {
              this.musicList = this.musicList.concat(res.data.data.content);
            } else {
              this.musicList = res.data.data.content;
            }

            console.log(this.musicList);
            console.log(this.musicTotal);
          }
        });
    },
    getDubbingList(page) {
      this.busy = true;
      console.log(page);
      if (page) {
        this.dubbingPage = page;
      } else {
        page = this.dubbingPage;
      }
      var user = this.$local.get("user");
      var data = {
        uid: user.id,
        page: page,
        size: 15,
        type: 3,
      };
      this.$axios
        .post(
          this.$domain + "/api/getCustomMaterialList?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          this.busy = false;
          if (res.data.code == 200) {
            this.dubbingTotal = res.data.data.totalElements;
            console.log(this.dubbingList);
            if (this.dubbingList.length > 0) {
              this.dubbingList = this.dubbingList.concat(res.data.data.content);
            } else {
              this.dubbingList = res.data.data.content;
            }

            console.log(this.dubbingList);
            console.log(this.dubbingTotal);
          }
        });
    },
    getCreateList(page) {
      this.busy = true;
      console.log(page);
      if (page) {
        this.createPage = page;
      } else {
        page = this.createPage;
      }
      var user = this.$local.get("user");
      var data = {
        uid: user.id,
        page: page,
        size: 10,
        orderByColumn: "id",
        isAsc: "desc",
      };
      this.$axios
        .post(
          this.$domain + "/api/getCreateVideoMaterialList?",
          this.$qs.stringify(data)
        )
        .then((res) => {
          this.busy = false;
          if (res.data.code == 200) {
            this.createToatal = res.data.data.data.totalElements;
            console.log(this.createList);
            if (this.createList.length > 0) {
              this.createList = this.createList.concat(
                res.data.data.data.content
              );
            } else {
              this.createList = res.data.data.data.content;
            }
            this.taskCount = res.data.data.taskCount;
            console.log(this.createList);
            console.log(this.createToatal);
          }
        });
    },
    loadMoreHot() {
      //触发底部
      console.log("触底事件");
      if (this.activeIndex == "1") {
        if (this.total > this.fileList.length) {
          this.getUserVideoList(this.page + 1);
        }
      } else if (this.activeIndex == "2") {
        if (this.musicTotal > this.musicList.length) {
          this.getMusicList(this.musicPage + 1);
        }
      } else if (this.activeIndex == "3") {
        if (this.dubbingTotal > this.dubbingList.length) {
          this.getDubbingList(this.dubbingPage + 1);
        }
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
  border-bottom: 5px solid #33e0c0;
  color: #33e0c0 !important;
  width: 30%;
}

/deep/ .el-menu--horizontal>.el-menu-item {
  width: 30%;
  text-align: center;
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
  margin-left: 50px;
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
  grid-template-rows: repeat(2, 150px);
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  align-items: center;
  // column-gap: 5px;
  box-sizing: border-box;
  // position: absolute;
  // top: 35%
  // left: 10%
  // overflow: auto;
  margin-top: 5px;
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
  width: -30px;
}

.videoSubTime {
  display: flex;
  flex-flow: row;
  margin-left: -10px;
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
  border: solid 1px #7de2c1 !important;
}

/deep/ .el-tabs__item.is-active {
  color: #7de2c1;
  background-color: #1b624b;
}

/deep/ .el-tabs__active-bar {
  background-color: #7de2c100;
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
  border: solid 1px #efefef;
  border-left: none;
  font-weight: 900;
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

/deep/ .el-tabs--left .el-tabs__header.is-left {
  position: absolute;
}

/deep/ .el-tabs--left .el-tabs__nav-wrap.is-left::after {
  height: 0;
}

.music {
  display: flex;
  flex-flow: column;
  justify-content: center;
  margin: 15px auto;
}

.music ul {
  width: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
}

.musicTitle {
  width: 96%;
  // height: 40px;
  display: flex;
  justify-content: space-between;
  background: #333334;
  align-items: center;
  border: dashed 1px #5c5c5f;
  border-radius: 5px;
  padding: 5px 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  cursor: pointer;
}

/deep/ .el-textarea__inner {
  background-color: #333334;
  color: #ffffff;
  width: 95%;
  margin: 20px auto;
}

.writing {
  margin-top: 15px;
}

.writings {
  margin-top: 15px;
}

.writings div:nth-child(1) {
  border-top: none;
}

.writings span {
  margin: 10px;
}

.writing span {
  margin: 10px;
}

.dubbing {
  width: 100%;
  display: grid;
  grid-template-columns: 25% 25% 25% 25%;
  justify-items: center;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 20px;
  column-gap: 10px;
}

.dubbingCon {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  background-color: #333334;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.dubSelect {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
}

.dubSelect span {
  font-size: 10px;
}

.activeDubbing {
  width: 80px;
  height: 80px;
  border-radius: 10px;
  border: 3px solid #33e0c0;
}

/deep/ .el-input__inner {
  background-color: #333334;
  color: #ffffff;
  width: 95%;
  margin: 10px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.workList {
  background-color: #29292d;
  width: 96%;
  padding: 5px 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: dashed 1px #5c5c5f;
  border-radius: 5px;
  cursor: pointer;
}

.workLists {
  background-color: #29292d;
  width: 100%;
  padding: 5px 15px;
  margin-top: 10px;
  margin-bottom: -15px;
  border: dashed 1px #5c5c5f;
  border-bottom: none;
  border-radius: 5px;
  cursor: pointer;
}

.works {
  display: grid;
  grid-template-columns: 100%;
  justify-content: flex-start;
  align-items: center;
}

.works div {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
}

.workBtn {
  // position: absolute;
  // left: 50%;
  // top: 50%;
  // transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.dubBtn {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-left: -30px;
}

.nav {
  margin-top: 60px;
  position: absolute;
  height: 100%;
  width: 100%;
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
  top: -55px;
  left: 63%;
  border: none;
  z-index: 999;
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

/deep/ .el-checkbox {
  color: #ffffff;
  width: 100%;
}

/deep/ .el-checkbox__label {
  color: #ffffff;
}

/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
  color: #7de2c1;
}

.musicImg {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  width: 80%;
}

.palyBtn {
  display: flex;
  flex-flow: row;
  align-items: center;
}

.palyImg img {
  width: 20px;
  height: 20px;
}

.workTitle {
  width: 96%;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  margin: -16 auto;
}

.musicUp {
  background: #33e0c0;
  border: none;
  color: #ffffff;
  font-weight: 900;
}

.musicBtn {
  width: 95%;
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
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
.el-menu-item {
  text-align: center;
  width: 100%;
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