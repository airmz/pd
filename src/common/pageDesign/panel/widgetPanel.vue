<template>
  <div id="widget-panel">
    <div class="widget-classify">
      <ul class="classify-wrap">
        <li
          class="classify-item"
          :class="{ 'active-classify-item': activeWidgetClassify === index }"
          v-for="(item, index) in widgetClassifyList"
          :key="index"
          @click="clickClassify(index)"
        >
          <i :class="item.icon" class="iconfont"></i>
          <p>{{ item.name }}</p>
        </li>
      </ul>
    </div>
    <div class="widget-wrap">
      <part-wrap v-if="widgetClassifyList[0].show" :style="getStyle(0)" />
      <video-list-wrap v-if="widgetClassifyList[1].show" :style="getStyle(1)" />
      <text-list-wrap v-if="widgetClassifyList[2].show" :style="getStyle(2)" />
      <img-list-wrap v-if="widgetClassifyList[3].show" :style="getStyle(3)" />
      <!-- <shape-list-wrap v-if="widgetClassifyList[2].show" :style="getStyle(2)" /> -->
      <temp-list-wrap v-if="widgetClassifyList[4].show" :style="getStyle(4)" />
      <img-mate-list-wrap
        v-if="widgetClassifyList[5].show"
        :style="getStyle(5)"
      />
      <!-- <shape-list-wrap v-if="widgetClassifyList[5].show" :style="getStyle(5)" /> -->
      <text-library v-if="widgetClassifyList[6].show" :style="getStyle(6)" />
    </div>
  </div>
</template>

<script>
// 组件面板
const NAME = "widget-panel";
import videoListWrap from "COMMON/pageDesign/panel/videoUpload.vue";
import partWrap from "COMMON/pageDesign/panel/videoPart.vue";
export default {
  name: NAME,
  data() {
    return {
      widgetClassifyList: [
        {
          name: "片段",
          icon: "icon-snippets-fill",
          show: false,
        },
        {
          name: "视频",
          icon: "icon-shipinbofang",
          show: false,
        },
        {
          name: "文本",
          icon: "icon-shuipingsuofang",
          show: false,
        },
        {
          name: "背景",
          icon: "icon-charutupian",
          show: false,
        },
        {
          name: "模版",
          icon: "icon-sucai",
          show: false,
        },
        {
          name: "素材",
          icon: "icon-moban",
          show: false,
        },
        {
          name: "文案",
          icon: "icon-zuoyepingjiamoban",
          show: false,
        },
        // {
        //   name: "形状",
        //   icon: "icon-zuoyepingjiamoban",
        //   show: false,
        // },
      ],
      activeWidgetClassify: -1,
      videoInfo: {},
    };
  },
  components: {
    videoListWrap,
    partWrap,
  },
  watch: {
    activeWidgetClassify(index) {
      if (index >= 0 && index < this.widgetClassifyList.length) {
        this.widgetClassifyList[index].show = true;
      }
    },
    videoInfo: function () {
      console.log("videoInfo", this.videoInfo);
      this.$parent.videoInfo = this.videoInfo;
    },
  },
  mounted() {
    this.activeWidgetClassify = 0;
  },
  methods: {
    clickClassify(index) {
      this.activeWidgetClassify = index;
    },
    getStyle(index) {
      return {
        display: this.activeWidgetClassify === index ? "" : "none",
      };
    },
    videoList() {
      this.videoList = !this.videoList;
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#widget-panel {
  position: relative;
  width: 360px;
  height: 100%;
  display: flex;
  flex-direction: row;
  font-weight: bold;
  color: $color-white;

  .widget-classify {
    position: absolute;
    z-index: 10;
    width: 100%;
    height: 60px;
    text-align: center;
    background-color: #29292d;

    .classify-wrap {
      width: 100%;
      display: flex;

      .classify-item {
        width: 100%;
        height: 60px;
        font-size: 12px;
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
        }
      }

      .active-classify-item {
        background-color: #1b1b1c;
        color: #33e0c0;
      }
    }
  }

  .widget-wrap {
    flex: 1;
    height: 100%;
    background-color: #1b1b1c;
  }
}
</style>
