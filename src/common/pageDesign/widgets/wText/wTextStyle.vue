<template>
  <div id="w-text-style">
    <el-collapse v-model="activeNames">
     

      <el-collapse-item title="文字设置" name="2">
        <text-input-area
          label="文本内容"
          v-model="innerElement.text"
          @finish="(value) => finish('text', value)"
        />
        <div class="line-layout style-item">
          <number-input
            label="字体大小"
            suffix="px"
            :data="fontSizeList"
            :value="innerElement.fontSize"
            @finish="(value) => finish('fontSize', value)"
          />
          <number-input
            label="行距"
            suffix="倍"
            :data="lineHeightList"
            v-model="innerElement.lineHeight"
            @finish="(value) => finish('lineHeight', value)"
          />
          <number-input
            label="字距"
            suffix="%"
            :data="letterSpacingList"
            v-model="innerElement.letterSpacing"
            @finish="(value) => finish('letterSpacing', value)"
          />
        </div>
        <div class="line-layout style-item"v-cloak >
          <value-select
            label="字体"
            :data="fontClassList"
            :value="innerElement.fontClass"
            inputWidth="280px"
            textAlign="left"
            :readonly="true"
            @finish="(value) => finish('fontClass', value)"style="color: #ffffff;"
          />
        </div>
        <div class="line-layout style-item">
          <color-select
            label="字体颜色"
            v-model="innerElement.textColor"
            @finish="(value) => finish('textColor', value)"
          />
          <color-select
            label="背景颜色"
            v-model="innerElement.backgroundColor"
            @finish="(value) => finish('backgroundColor', value)"
          />
        </div>
        <icon-item-select
          class="style-item"
          label="图层层级"
          :data="layerIconList"
          @finish="layerAction"
        />
        <icon-item-select
          class="style-item"
          label="组件对齐"
          :data="alignIconList"
          @finish="alignAction"
        />
        <icon-item-select
          class="style-item"
          label="文本样式"
          :data="styleIconList"
          @finish="textStyleAction"
        />
      </el-collapse-item>
      <el-collapse-item title="位置" name="1">
        <div class="line-layout">
          <number-input
            label="X"
            v-model="innerElement.left"
            @finish="(value) => finish('left', value)"
          />
          <number-input
            label="Y"
            v-model="innerElement.top"
            @finish="(value) => finish('top', value)"
          />
          <number-input
            label="宽"
            v-model="innerElement.width"
            @finish="(value) => finish('width', value)"
          />
          <number-input
            label="高"
            v-model="innerElement.height"
            :editable="false"
            @finish="(value) => finish('height', value)"
          />
        </div>
      </el-collapse-item>
       <el-collapse-item title="数据绑定" name="0">
        <div class="line-layout style-item">
          <value-select
            label="绑定信息"
            :data="symbolList"
            :value="innerElement.symbol"
            inputWidth="280px"
            textAlign="left"
            :readonly="true"
            @finish="(value) => finish('symbol', value)"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item title="其他设置" name="3">
        <text-input
          label="名称"
          v-model="innerElement.name"
          @finish="(value) => finish('name', value)"
        />
      </el-collapse-item>
      <el-collapse-item title="客户端配置(设置客户端是否允许修改)" name="4">
        <div class="setting-list">
          <setting-switch
            class="style-item"
            v-for="item in dActiveElement.setting"
            :key="item.key"
            :label="item.label"
            v-model="item.value"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// 文本组件样式
const NAME = "w-text-style";
import { mapGetters, mapActions } from "vuex";

export default {
  name: NAME,
  data() {
    return {
      activeNames: ["0", "1", "2", "3"],
      innerElement: {},
      tag: false,
      ingoreKeys: [
        "left",
        "top",
        "name",
        "width",
        "height",
        "text",
        "textColor",
        "backgroundColor",
      ],
      fontSizeList: [
        "12",
        "24",
        "26",
        "28",
        "30",
        "34",
        "36",
        "40",
        "44",
        "46",
        "50",
        "60",
        "72",
        "96",
        "106",
        "120",
        "144",
      ],
      fontClassList: [
        {
          name: "默认字体",
          value: "",
          fontName: "",
        },
        {
          name: "站酷快乐体",
          value: "f1",
          fontName: "站酷快乐体2016修订版",
        },
        {
          name: "IPix中文像素字体",
          value: "f2",
          fontName: "IPix",
        },
        {
          name: "OPPOSans-R",
          value: "f3",
          fontName: "OPPOSans R",
        },
        {
          name: "阿里巴巴普惠体",
          value: "f4",
          fontName: "阿里巴巴普惠体2.0 55Regular",
        },
        {
          name: "包图小白体",
          value: "f5",
          fontName: "包图小白体",
        },
        {
          name: "仓耳舒圆体",
          value: "f6",
          fontName: "仓耳舒圆体 W03",
        },
        {
          name: "仓耳与墨",
          value: "f7",
          fontName: "TsangerYuMo W03",
        },
        {
          name: "仓耳周珂正大榜书",
          value: "f8",
          fontName: "仓耳周珂正大榜书",
        },
        {
          name: "斗鱼追光体",
          value: "f9",
          fontName: "DOUYU Font",
        },

        {
          name: "方正楷体简体",
          value: "f12",
          fontName: "方正楷体简体",
        },
        {
          name: "寒蝉手拙体",
          value: "f13",
          fontName: "寒蝉手拙体",
        },
        {
          name: "汉字拼音体",
          value: "f14",
          fontName: "Hanzi-Pinyin-Font",
        },
        {
          name: "鸿蒙",
          value: "f15",
          fontName: "HarmonyOS Sans SC",
        },
        {
          name: "江西拙楷",
          value: "f16",
          fontName: "江西拙楷",
        },
        {
          name: "庞门正道真贵楷体",
          value: "f17",
          fontName: "庞门正道真贵楷体",
        },
        {
          name: "千图纤墨体",
          value: "f18",
          fontName: "千图纤墨体",
        },
        {
          name: "摄图摩登小方体",
          value: "f20",
          fontName: "shetumodengxiaofangti",
        },
        {
          name: "思源黑体",
          value: "f22",
          fontName: "思源黑体CN",
        },
        {
          name: "思源宋体",
          value: "f23",
          fontName: "Source Han Serif CN",
        },
        {
          name: "素材集市康康体",
          value: "f24",
          fontName: "素材集市康康体",
        },
        {
          name: "素材集市酷方体",
          value: "f25",
          fontName: "素材集市酷方体",
        },
        {
          name: "文道潮黑体",
          value: "f26",
          fontName: "文道潮黑",
        },
        {
          name: "问藏书房",
          value: "f27",
          fontName: "问藏书房",
        },
        {
          name: "小赖字体",
          value: "f28",
          fontName: "小赖字体SC",
        },
        {
          name: "演示秋鸿楷",
          value: "f29",
          fontName: "演示秋鸿楷",
        },
        {
          name: "杨任东竹石体",
          value: "f30",
          fontName: "杨任东竹石体-Regular",
        },
        {
          name: "优设标题黑",
          value: "f31",
          fontName: "优设标题黑",
        },
        {
          name: "优设好身体",
          value: "f32",
          fontName: "优设好身体",
        },
        {
          name: "站酷仓耳渔阳体",
          value: "f33",
          fontName: "仓耳渔阳体 W04",
        },
        {
          name: "站酷酷黑体",
          value: "f34",
          fontName: "站酷酷黑",
        },
        {
          name: "站酷庆科黄油体",
          value: "f35",
          fontName: "站酷庆科黄油体",
        },
        {
          name: "字体传奇南安体",
          value: "f36",
          fontName: "字体传奇南安体-免费商用",
        },
        {
          name: "字体传奇特战体",
          value: "f37",
          fontName: "字体传奇特战体-免费商用",
        },
        {
          name: "字体圈欣意冠黑体",
          value: "f38",
          fontName: "字体圈欣意冠黑体",
        },
        {
          name: "字制区喜脉体",
          value: "f39",
          fontName: "字制区喜脉体",
        },
        {
          name: "手书体",
          value: "f21",
          fontName: "手书体",
        },
        {
          name: "方正仿宋简体",
          value: "f10",
          fontName: "方正仿宋简体",
        },
        {
          name: "方正黑体简体",
          value: "f11",
          fontName: "方正黑体简体",
        },
      ],
      symbolList: [
        {
          name: "空标记",
          value: "",
        },
        {
          name: "商家名称",
          value: "storeName",
        },
        {
          name: "原价",
          value: "originalPrice",
        },
        {
          name: "活动价",
          value: "price",
        },
        {
          name: "套餐内容",
          value: "mealContent",
        },
      ],
      lineHeightList: ["1", "1.5", "2"],
      letterSpacingList: ["0", "10", "25", "50", "75", "100", "200"],
      layerIconList: [
        {
          key: "zIndex",
          icon: "icon-shangyi",
          tip: "上一层",
          value: 1,
        },
        {
          key: "zIndex",
          icon: "icon-xiayi",
          tip: "下一层",
          value: -1,
        },
      ],
      styleIconList: [
        {
          key: "fontWeight",
          icon: "icon-zitijiacu",
          tip: "加粗",
          value: ["normal", "bold"],
          select: false,
        },
        {
          key: "fontStyle",
          icon: "icon-qingxie",
          tip: "斜体",
          value: ["normal", "italic"],
          select: false,
        },
        {
          key: "textDecoration",
          icon: "icon-zitixiahuaxian",
          tip: "下划线",
          value: ["none", "underline"],
          select: false,
        },
        {
          key: "textAlign",
          icon: "icon-zuoduiqi",
          tip: "左对齐文本",
          value: "left",
          select: false,
        },
        {
          key: "textAlign",
          icon: "icon-juzhongduiqi",
          tip: "居中对齐文本",
          value: "center",
          select: false,
        },
        {
          key: "textAlign",
          icon: "icon-youduiqi",
          tip: "右对齐文本",
          value: "right",
          select: false,
        },
      ],
      alignIconList: [
        {
          key: "align",
          icon: "icon-zuoduiqi1",
          tip: "左对齐",
          value: "left",
        },
        {
          key: "align",
          icon: "icon-shuipingjuzhongduiqi",
          tip: "水平居中对齐",
          value: "ch",
        },
        {
          key: "align",
          icon: "icon-youduiqi1",
          tip: "右对齐",
          value: "right",
        },
        {
          key: "align",
          icon: "icon-shangduiqi",
          tip: "上对齐",
          value: "top",
        },
        {
          key: "align",
          icon: "icon-chuizhijuzhongduiqi",
          tip: "垂直居中对齐",
          value: "cv",
        },
        {
          key: "align",
          icon: "icon-xiaduiqi",
          tip: "下对齐",
          value: "bottom",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["dActiveElement", "dMoving"]),
  },
  watch: {
    dActiveElement: {
      handler(newValue, oldValue) {
        this.change();
      },
      deep: true,
    },
    innerElement: {
      handler(newValue, oldValue) {
        this.changeValue();
      },
      deep: true,
    },
  },
  created() {
    this.change();
  },
  methods: {
    ...mapActions(["updateWidgetData", "updateAlign", "updateLayerIndex"]),
    change() {
      this.tag = true;
      this.innerElement = JSON.parse(JSON.stringify(this.dActiveElement));
      this.changeStyleIconList();
    },
    changeValue() {
      if (this.tag) {
        this.tag = false;
        return;
      }
      if (this.dMoving) {
        return;
      }
      for (let key in this.innerElement) {
        if (this.ingoreKeys.indexOf(key) !== -1) {
          this.dActiveElement[key] = this.innerElement[key];
        } else if (
          key !== "setting" &&
          key !== "record" &&
          this.innerElement[key] !== this.dActiveElement[key]
        ) {
          this.updateWidgetData({
            uuid: this.dActiveElement.uuid,
            key: key,
            value: this.innerElement[key],
          });
        }
      }
    },
    finish(key, value) {
      this.updateWidgetData({
        uuid: this.dActiveElement.uuid,
        key: key,
        value: value,
        pushHistory: true,
      });
    },
    layerAction(item) {
      this.updateLayerIndex({
        uuid: this.dActiveElement.uuid,
        value: item.value,
      });
    },
    textStyleAction(item) {
      let value =
        item.key === "textAlign" ? item.value : item.value[item.select ? 1 : 0];
      this.innerElement[item.key] = value;
    },
    alignAction(item) {
      this.updateAlign({
        align: item.value,
        uuid: this.dActiveElement.uuid,
      });
    },
    changeStyleIconList() {
      for (let i = 0; i < this.styleIconList.length; ++i) {
        let key = this.styleIconList[i].key;
        this.styleIconList[i].select = false;
        if (
          key === "textAlign" &&
          this.innerElement[key] === this.styleIconList[i].value
        ) {
          this.styleIconList[i].select = true;
          continue;
        }
        switch (key) {
          case "fontWeight":
          case "fontStyle":
            if (this.innerElement[key] !== "normal") {
              this.styleIconList[i].select = true;
            }
            break;
          case "textDecoration":
            if (this.innerElement[key] !== "none") {
              this.styleIconList[i].select = true;
            }
            break;
        }
      }
    },
  },
};
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl';

#w-text-style {
  width: 100%;
  height: 100%;
}

.line-layout {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  
}

.style-item {
  margin-bottom: 10px;
}

.setting-list {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex-wrap: wrap;
}

/deep/ .el-collapse-item__header {
  background-color: #1b1b1c;
  color: #ffffff;
}

/deep/ .el-collapse-item__wrap {
  background-color: #1b1b1c;
  color: #ffffff;
}

/deep/ #color-select .label {
  color: #ffffff;
}

/deep/ #setting-switch .label {
  color: #ffffff;
}

/deep/ #text-input .input-label {
  color: #ffffff;
}

/deep/ #value-select .input-label {
  color: #ffffff;
}

/deep/ #icon-item-select .label {
  color: #ffffff;
}

/deep/ #text-input-area .input-label {
  color: #ffffff;
}

/deep/ #icon-item-select .list .list-item.active {
  color: #ffffff !important;
  background-color: #34d8b9 !important;
}

/deep/ #icon-item-select .list .list-item {
  color: #34d8b9 !important;
}
[v-cloak] {
        display: none;
    }
</style>
