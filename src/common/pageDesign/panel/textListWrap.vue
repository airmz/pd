<template>
  <div id="text-list-wrap">
    <ul class="basic-text-wrap" style="display:flex;align-items:center">
      <li
        class="basic-text-item"
        v-for="(item, index) in basicTextList"
        :key="index"
        :style="{
          fontSize: item.fontSize / 2 + 'px',
          fontWeight: item.fontWeight
        }"
        @click="selectBasicText(item)"
        @mouseover="selectBasicText(item)"
        @mouseout="dActiveElement.uuid !== '-1' ? handle('delete') : ''">
        {{ item.text }}
      </li>
    </ul>
    <div class="other-text-wrap">

    </div>
  </div>
</template>

<script>

// 文本组件列表
const NAME = 'text-list-wrap'

import wText from 'COMMON/pageDesign/widgets/wText/wText'

import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: NAME,
  data () {
    return {
      basicTextList: [
        {
          text: '大标题',
          fontSize: 96,
          fontWeight: 'bold'
        },
        {
          text: '标题',
          fontSize: 60,
          fontWeight: 'bold'
        },
        {
          text: '副标题',
          fontSize: 40,
          fontWeight: 'normal'
        },
        {
          text: '小标题',
          fontSize: 36,
          fontWeight: 'normal'
        },
        {
          text: '正文内容',
          fontSize: 28,
          fontWeight: 'normal'
        }
      ]
    }
  },
  methods: {
    ...mapActions([
      'addWidget',
      "dActiveElement",
      "deleteWidget"
    ]),
    selectBasicText (item) {
      let setting = JSON.parse(JSON.stringify(wText.setting))
      setting.text = item.text
      setting.fontSize = item.fontSize
      setting.fontWeight = item.fontWeight
      setting.textAlign="center"
       setting.width="750"
      this.addWidget(setting)
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
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#text-list-wrap
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  .basic-text-wrap
    display: flex
    flex-flow: column
    justify-content: center
    align-content: center
    width: 100%
    border-bottom: 1px solid #092625
    padding: 80px 0
    .basic-text-item
      background-color: #29292d
      width: 96%
      padding: 5px 15px
      margin-top 10px
      margin-bottom 10px
      color: $white
      border: dashed 1px #5c5c5f
      border-radius: 5px
      // border-top: 1px solid $color-transparent
      // border-bottom: 1px solid $color-transparent
      cursor: pointer
      &:hover
        border-top: 1px solid $color-main
        border-bottom: 1px solid $color-main
        background-color: $color-dark-gray
  .other-text-wrap
    width: 100%
    flex: 1
    overflow: auto
</style>
