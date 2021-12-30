
<template>
  <div id="ttex-library">
    <div style="marigin-top: 100px">
      <el-scrollbar style="height: 100vh">
        <div id="text-list-wrap" >
          <ul v-infinite-scroll="loadMoreLocal"
            class="basic-text-wrap"
            style="display: flex; align-items: center"
          >
            <li
              class="basic-text-item"
              v-for="(item, index) in textList"
              :key="index"
              :style="{
                fontSize: item.fontSize / 2 + 'px',
                fontWeight: item.fontWeight,
              }"
              @click="selectBasicText(item)"
            >
              {{ item.title }}
            </li>
          </ul>
          <div class="other-text-wrap"></div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import wText from "COMMON/pageDesign/widgets/wText/wText";
import { mapGetters, mapActions } from "vuex";
const NAME = "text-library";
export default {
  name: NAME,
  data() {
    return {
      textList: [],
      visible: false,
      tempNameVisible: false,
      isFirst: true,
      page: 1,
      size: 20,
    };
  },
  mounted() {
    this.getTextList();
  },
  destroyed() {},
  props: [],
  methods: {
     ...mapActions([
      "updateText"
    ]),
    selectBasicText(item) {
      // let setting = JSON.parse(JSON.stringify(wText.setting))
      // setting.text = item.text
      // setting.fontSize = item.fontSize
      // setting.fontWeight = item.fontWeight
      // this.addWidget(setting)
      this.updateText(item.title);
    },
    getTextList(type, page) {
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
        page: page,
        size: this.size,
        isOpen: 1,
      };
      this.$axios
        .post(this.$domain + "/api/getSysTextLib?", this.$qs.stringify(data))
        .then((res) => {
          if (res.data.code == 200) {
            //图片
            this.imgTotal = res.data.data.totalElements;
            console.log(this.textList);
            if (this.textList.length > 0) {
              this.textList = this.textList.concat(res.data.data.content);
            } else {
              this.textList = res.data.data.content;
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
    loadMoreLocal() {
      console.log("isFirst" + this.isFirst);
      //触发底部
      if (this.isFirst || this.disable == 1) {
        this.isFirst = false;
      } else {
        this.getTextList(this.page + 1);
      }
    },
  },
};
</script>

<style  lang="stylus" scoped>
.textList {
  padding: 30px;
  margin-top: 50px;
}

@import '~STYLUS/page-design.styl';

#text-list-wrap {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  .basic-text-wrap {
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-content: center;
    width: 100%;
    border-bottom: 1px solid #092625;
    padding: 80px 0;

    .basic-text-item {
      background-color: #29292d;
      width: 96%;
      padding: 5px 15px;
      margin-top: 10px;
      margin-bottom: 10px;
      color: $white;
      border: dashed 1px #5c5c5f;
      border-radius: 5px;
      // border-top: 1px solid $color-transparent
      // border-bottom: 1px solid $color-transparent
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
</style>