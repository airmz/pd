<template>
  <div id="local">
    <div class="startBtn" @click="addRoutes">
      <i class="el-icon-circle-plus" style="color: #00c6d2"></i>
      <el-button
        type="info"
        plain
        style="background-color: #2d2c2e00; padding: 10px"
        >开始创作</el-button
      >
    </div>
    <div class="title">
      <div class="lift-title">
        <span>剪辑草稿</span>
        <p>({{ total }})</p>
      </div>
      <div style="display: flex">
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
      <el-scrollbar style="height: 325px">
        <el-checkbox-group v-model="checkList">
          <div class="videoList" v-infinite-scroll="loadMoreLocal">
            <div v-for="(item, index) in data" :key="index">
              <img
                class="videoImg"
                :src="item.thumb + '?imageView2/1/w/160/h/160'"
                @click="editTemp(item.id)"
                alt=""
              />

              <el-popover width="150" trigger="click">
                <div class="popover">
                  <ul>
                    <li class="popover-li" @click="editTemp(item.id)">
                      <span>编辑模板</span>
                    </li>
                    <li class="popover-li" @click="openRename(item)">
                      <span>重命名</span>
                    </li>
                    <li class="popover-li" @click="copyTemp(item)">
                      <span>复制草稿</span>
                    </li>
                    <li class="popover-li" @click="publish(item)">
                      <span>发布模板</span>
                    </li>
                    <li class="popover-li" @click="delTemple(item)">
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
      <el-input v-model="temp.title" placeholder="请输入模板名称"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tempNameVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveTemp">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
const NAME = "local";
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
      temp: {},
      deletArr: [],
      checkList: [],
      isFirst: true,
    };
  },
  mounted() {},
  destroyed() {},
  props: ["data", "imgList", "page", "size", "total", "disable"],
  methods: {
    openRename(item) {
      console.log();
      this.temp = item;
      this.tempNameVisible = true;
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
    delTemple(temp) {
      this.$confirm("此操作将永久删除该作品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          var data = {
            id: temp.id,
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
                this.$parent.local();
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
      this.$confirm("此操作将永久删除该作品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          for (var i = 0; i < this.checkList.length; i++) {
            if (this.checkList[i] != "null" && this.checkList[i] > 0) {
              var data = {
                id: this.checkList[i],
              };
              this.$axios
                .post(
                  this.$domain + "/api/delTemple?",
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
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
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
      this.$router.push("/main?type=add&tid=169");
    },
    loadMoreLocal() {
      console.log("isFirst" + this.isFirst);
      //触发底部
      if (this.isFirst || this.disable == 1) {
        this.isFirst = false;
      } else {
        this.$parent.getTempList(1, this.page + 1, this.size);
      }
    },
  },
};
</script>

<style  lang="stylus" scoped>
#local {
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
  background-color: #2d2c2e00;
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