<template>
  <div>
    <div :style="{'height': `${heightCon}px`}">
      <!-- 轮播图 -->
      <div class="block">
        <el-carousel trigger="click" height="850px" arrow="nerver">
          <el-carousel-item v-for="(item, index) in carsouselList" :key="index">
            <img :src="item" style="width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </div>

      <div class="theme-column-wrap">
        <!-- 主题介绍 -->
        <div class="theme-info-wrap f-clearfix">
          <div class="theme-info f-pull-left">
            <img :src="$store.state.imgPath.themeLeft" style="margin-left:40px;">
            <span>{{themeInfor.title}}</span>
            <img :src="$store.state.imgPath.themeRight">

            <div>{{themeInfor.info}}</div>
          </div>

          <div class="img-info f-pull-right">
            <img :src="rightImg" alt="">
          </div>
        </div>

        <!-- 栏目 -->
        <div class="column-info-wrap">
          <ul class="new-list f-clearfix" :class="{anim:animate}" @mouseenter="mouseStop()" @mouseleave="mouseUp()" :style="{'width':columnWidth + 'px'}">
            <li v-for="(item, index) in noticeList" :key="index" class="f-pull-left" style="position:relative;width:256px;height:260px;cursor:pointer;" @click="columnClick(item)">
              <img :src="item.icon" alt="" style="width:256px;height:260px">
              <span style="margin-left:-50%">{{item.columnName}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      heightCon: 1750,
      columnWidth: 0, // 栏目宽
      carsouselList: [],
      themeInfor: {
        title: '',
        info: ''
      },
      rightImg: '',
      noticeList: [],
      animate: false,
      intNum: undefined,
    };
  },
  computed: {
    themeInfo() {
      return this.$store.state.mainData.themeInfo;
    }
  },
  activated() {
    clearInterval(this.intNum);
    this.getNoticeData();
  },
  methods: {
    // 点击栏目导航
    columnClick(item) {
      if (item.columnName == '自然地理') {
        this.$router.push({ path: `/emblem-rhyme/unified-list/${item.columnName}?type=famous&id=${item.columnId}` });
      } else if (item.columnName == '山水风光' || item.columnName == '风味美食') {
        this.$router.push({ path: `/emblem-rhyme/picture-list/${item.columnName}?type=famous&id=${item.columnId}` });
      } else if (item.columnName == '首页') {
        this.$router.push({ path: `/emblem-rhyme/rhyme-home?type=famous&id=${item.columnId}` });
      } else {
        this.$router.push({ path: `/emblem-rhyme/text-list/${item.columnName}?type=famous&id=${item.columnId}` });
      }
    },
    // 获取数据
    getNoticeData() {
      this.$axiosGet(API.columnManageFacade_findTitleAndColumn, {}).then(res => {
        if (res.result == 'success') {
          this.carsouselList = res.model[0].attachImg;
          this.themeInfor.title = res.model[0].titleName;
          this.themeInfor.info = res.model[0].titleIntroduction;
          this.rightImg = res.model[0].uploadImage;
          this.noticeList = res.model[0].columnBOList; // 栏目名（导航）
          this.columnWidth = this.noticeList.length * 256;
        }
      })
      this.scrollUp();
    },
    // 栏目轮播滚动
    scrollUp() {
      this.intNum = setInterval(() => {
        this.animate = true;// 向上滚动的时候需要添加css3过渡动画
        setTimeout(() => {
          this.noticeList.push(this.noticeList[0]);// 将数组的第一个元素添加到数组的
          this.noticeList.shift(); //删除数组的第一个元素
          this.animate = false;
        }, 2500)
      }, 5000);
    },
    //栏目鼠标移上去停止
    mouseStop() {
      clearInterval(this.intNum);
    },
    mouseUp() {
      this.scrollUp();
    },
  }
}
</script>

<style lang="scss">
.anim {
  transition: all 1.5s;
  margin-left: -256px; //高度等于行高
}
.main-default .g-head {
  background-color: #fff;
  color: #4c4c4d;
}
.main-default .g-head .g-login-info {
  background-color: #fff;
  text-align: center;
  cursor: pointer;
  span {
    margin-right: 15px;
    display: inline-block;
    height: 67px;
    vertical-align: top;
    padding: 0 15px;
    &:hover {
      color: #3471a3;
      border-bottom: 3px #226399 solid;
    }
  }
}
.main-default .g-content {
  height: auto;
  .g-main {
    width: 100%;
  }
}
.el-carousel__button {
  width: 10px;
  height: 10px;
  border-radius: 5px;
}

// 主题介绍
.theme-column-wrap {
  margin: 20px auto;
  width: 1280px;
  height: 580px;
  .theme-info-wrap {
    .theme-info {
      width: 760px;
      height: 580px;
      background-image: url("../../../public/static/icon/default/theme/theme-bg.jpg");
      background-repeat: no-repeat;
      img {
        margin-top: 60px;
      }
      span {
        position: relative;
        top: 37px;
        padding: 0 10px;
        color: #fff;
        font-size: 34px;
      }
      div {
        padding: 60px 60px 0 40px;
        color: #fff;
        line-height: 27px;
        text-indent: 2em;
        font-size: 16px;
      }
    }
    .img-info img {
      width: 500px;
      height: 580px;
    }
  }
  .column-info-wrap {
    margin: 20px 0;
    width: 1280px;
    height: 260px;
    overflow: hidden;
    ul li span {
      position: absolute;
      width: 100%;
      left: 50%;
      top: 200px;
      text-align: center;
      color: #fff;
      font-size: 16px;
    }
  }
}
</style>


