<!--
 * @Author: airmz
 * @Date: 2021-12-13 10:43:28
 * @LastEditTime: 2021-12-13 10:57:37
 * @FilePath: /pd/src/common/pageDesign/widgets/wVideo/wVideo.vue
-->
<template>
  <div 
    id="w-text"
    v-html="params.text"
    :contenteditable="editable ? 'plaintext-only' : false"
    @dblclick="(e) => dblclickText(e)"
    @blur="(e) => updateText(e)"
    :class="[{'edit-text': editable}, params.uuid, params.fontClass.value]"
    ref="widget"
    :style="{
      position: 'absolute',
      left: (params.left - parent.left) + 'px',
      top: (params.top - parent.top) + 'px',
      width: Math.max(params.fontSize, params.width) + 'px',
      minWidth: params.fontSize + 'px',
      minHeight: params.fontSize * params.lineHeight + 'px',
      lineHeight: params.fontSize * params.lineHeight + 'px',
      letterSpacing: params.fontSize * params.letterSpacing / 100 + 'px',
      fontSize: params.fontSize + 'px',
      color: params.textColor,
      textAlign: params.textAlign,
      fontWeight: params.fontWeight,
      fontStyle: params.fontStyle,
      textDecoration: params.textDecoration,
      opacity: params.opacity,
      backgroundColor: params.backgroundColor
    }">
  </div>
</template>

<script>
// 文本组件
const NAME = 'w-video'

import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: NAME,
  props: ['params', 'parent'],
  data () {
    return {
      editable: false
    }
  },
  updated () {
    this.updateRecord()
  },
  mounted () {
    this.updateRecord()
  },
  computed: {
  ...mapGetters([
      'dActiveElement'
    ])
  },
  methods: {
 ...mapActions([
      'updateWidgetData'
    ]),
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
@import '~STYLUS/page-design-font.styl'
#w-text
  outline: none
  cursor: pointer
  word-break: break-word
  &.edit-text
    cursor: text
    outline: 1px solid $color-black !important
</style>
