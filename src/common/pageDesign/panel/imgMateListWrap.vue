<template>
  <div id="img-mate-list-wrap" >
    <div class="style-tab">
      <span class="tab" :class="{'active-tab' : activeTab === 0}" @click="activeTab = 0">动态图</span>
      <span class="tab" :class="{'active-tab' : activeTab === 1}" @click="activeTab = 1">特效图</span>
    </div>
    <div class="tab-content"  v-if="hadShowRecommendImg" :style="getStyle(1)" >
      <img-water-fall
        class="img-list"
        :listData="recommendImgList"
        sortBy="id"
        k="id"
        @delete-img="deleteImg"
        @select-img="selectImg"
        @scroll-img="wheelChange" />
    </div>
    <div class="tab-content" v-if="hadShowMyImg"  :style="getStyle(0)" >
      <img-water-fall
        class="img-list"
        :listData="recommendImgList"
        sortBy="id"
        k="id"
        @delete-img="deleteImg"
        @scroll-img="wheelChange"
        @select-img="selectImg" />
    </div>
  </div>
</template>

<script>

// 图片列表
const NAME = 'img-list-wrap'

import wImage from 'COMMON/pageDesign/widgets/wImage/wImage'

import {
  mapGetters,
  mapActions
} from 'vuex'

export default {
  name: NAME,
  data () {
    return {
      activeTab: -1,
      myImgList: [],
      page:1,
      size:30,
      totalPages:0,
      scroll:true,
      recommendImgList: [

      ],
      hadShowMyImg: false,
      hadShowRecommendImg: false,
      pos: 0,
      loading:false,
      materialType:0
    }
  },
  mounted () {
    this.activeTab = 0;
  },
  watch: {
    activeTab (value) {
      if (value === 0) {
        this.hadShowMyImg = true
        this.page=1;
        this.materialType=4;
        this.loading=true;
        this.recommendImgList = [];
        this.getImgList();
      } else if (value === 1) {
        this.page=1;
        this.materialType=5;
        this.loading=true;
          this.recommendImgList = [];
        this.getImgList();
        this.hadShowRecommendImg = true
      }
    }
  },
  methods: {
    ...mapActions([
      'addWidget'
    ]),
    getImgList(){
       let that = this;
            var data = {page:this.page,size:this.size,materialType:this.materialType}  //定义一个data储存需要带的参数
            if(that.loading){
               this.$axios.post(this.$domain +"/wechat/api/manager/getSysMaterialByWhere" ,this.$qs.stringify(data)
                          ).then(res =>{
                            if(res.data.code == 0){
                              console.log(res.data.data.totalPages)
                               that.recommendImgList ={};

                               if(that.page == 1){
                                  for(var i=0;i<res.data.data.content.length;i++){
                                    res.data.data.content[i].ratio = 500 / 500;
                                  }
                                  that.recommendImgList = res.data.data.content;
                                  that.page = that.page+1;

                               }else{
                                  for(var i=0;i<res.data.data.content.length;i++){
                                    res.data.data.content[i].ratio = 500 / 500;
                                  }
                                  that.recommendImgList = res.data.data.content;
                                  that.page = that.page+1;
                               }

                               that.totalPages = res.data.data.totalPages

                            }else{
                              alert(that.page )
                            }

                            this.loading = false;
                          });
            }
    },
    getStyle (index) {
      return {
        display: (this.activeTab === index ? '' : 'none')
      }
    },
    selectImg (item) {
      let setting = JSON.parse(JSON.stringify(wImage.setting))
      console.log(setting)
      setting.width = 500
      setting.height = 500
      setting.imgUrl = item.value.url
      this.addWidget(setting)
    },
    deleteImg (item) {
      //
    },
    uploadImg (e) {
    },
    wheelChange(e){

     console.log(this.page)
      console.log(this.totalPages)
      if(this.loading == false){
         if(this.totalPages >= this.page ){
            this.loading = true
            this.getImgList();
         }else{
            console.log("没有更多了")
         }
      }

    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~STYLUS/page-design.styl'
#img-mate-list-wrap
  width: 100%
  height: 100%
  display: flex
  flex-direction: column
  .style-tab
    width: 100%
    display: flex
    border-bottom: 1px solid $color-dark-gray
    .tab
      flex: 1
      padding: 10px
      color: $color-white
      cursor: pointer
      border-bottom: 2px solid $color-transparent
      text-align: center
      &.active-tab
        color: $color-main
        border-bottom: 2px solid $color-main
  .tab-content
    width: 100%
    flex: 1
    display: flex
    flex-direction: column
    .img-list
      width: 100%
      flex: 1
      .img-item
        width: 33.33%
        height: auto
        padding: 6px
        cursor: pointer
        &:hover
          outline: 1px solid $color-main
        .img
          width: 100%

    .upload-btn-wrap
      width: 100%
      display: flex
      justify-content: center
      .upload-btn
        cursor: pointer
        width: 80%
        padding: 10px
        margin: 15px
        text-align: center
        border-radius: 5px
        color: $color-white
        background-color: $color-main
        &:hover
          background-color: lighten($color-main, 10%)
</style>
