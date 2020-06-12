<template>
  <div style="background-color:#fff;">
    <div :style="{'height': `${heightCon}px`}">
      <!-- <div ref="picTopImgHei" class="picture-top-img">
        <img :src="picImg" alt="">
      </div> -->
      <!-- 轮播图 -->
      <div class="block" ref="picTopImgHei">
        <el-carousel trigger="click" height="850px" arrow="nerver">
          <el-carousel-item v-for="(item, index) in carsouselList" :key="index">
            <img :src="item" style="width:100%;height:100%;">
          </el-carousel-item>
        </el-carousel>
      </div>
      <!-- 导航栏 -->
      <div ref="picCloumnHei" class="pic-nav-cloumn">
        <div style="width:1280px;margin:0 auto;line-height:60px;">
          <i class="iconfont icon-fangzi" style="color:#226399;"></i>
          <router-link to="/emblem-rhyme/rhyme-home?type=famous">首页</router-link>
          <span>></span><span>{{this.$route.params.type}}</span>
          <span v-if="columnTitle">>{{columnTitle}}</span>
          <span v-if="childColumnTitle">>{{childColumnTitle}}</span>
        </div>
      </div>

      <div ref="picConHei">
        <div class="pic-content-wrap">
          <div class="pic-content-right">

            <div>
              <div class="pic-cont-right-title">{{columnTitle}}</div>
              <div v-for="(item, index) in dataList" :key="index">
                <div v-if="columnIndex == index">
                  <div class="unified-cont-introduct">{{unifiedCont}}</div>
                  <div class="pic-cont-right-column" v-for="(childItem, childIndex) in item.areaList" :key="childIndex" @click="childColumn(childItem.geographyName, childIndex)">
                    <span>{{childItem.geographyName}}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      carsouselList: [],
      columnId: '',
      unifiedCont: '',
      columnIndex: '0',
      columnTitle: '',
      childColumnTitle: '',
      columnCont: '',
      heightCon: 0,
      picImg: 'http://pics.govicar.com/84ab1cb3-28fa-48d1-97ac-1070038da423.jpg', // 图片
      dataList: [
        {
          theme: '安徽',
          content: '八公山豆腐开始于2000多年，淮南王刘安是其创始人。刘安招养才俊之士云集古都寿春，在八公山上纵论天下兴亡，求治世良方和炼丹制药。刘安等在炼丹时，偶尔将石膏点人丹母液即豆浆之中，经化学变化成了豆腐。豆腐从此问世。刘安使人成立豆腐生产作坊，培养豆腐专业生产人员，在生产操作的过程中，逐步完善生产设备，改进生产技术，提高豆腐质量。同时把豆腐制作技术传授给当地农民，当地农民学会了制作豆腐之术，并代代相传，不断改进豆腐制作工艺，严格操作，精益求精，使八公山豆腐比外地豆腐更具有自己鲜明的特色。如今八公山豆腐制品已远销海内外，每年的九月十五日的“中国豆腐文化节”影响巨大，吸引着中外客商云集于此。',
          areaList: [
            {
              name: '栏目1-1',
              title: '开始于2000多年，淮南王刘安是其创始人。刘安招养才俊之士云集古都寿春，在八公山上纵论天下兴亡，求治世良方和炼丹制药。刘安等在炼丹时，偶尔将石膏点人丹母液即豆浆之中，经化学变化成了豆腐。豆腐从此问世。刘安使人成立豆腐生产作坊，培养豆腐专业生产人员，在生产操作的过程中，逐步完善生产设备，改进生产技术，提高豆腐质量。同时把豆腐制作技术传授给当地农民，当地农民学会了制作豆腐之术，并代代相传，不断改进豆腐制作工艺，严格操作，精益求精，使八公山豆腐比外地豆腐更具有自己鲜明的特色。如今八公山豆腐制品已远销海内外，每年的九月十五日的“中国豆腐文化节”影响巨大，吸引着中外客商云集于此。'
            }, {
              name: '栏目1-2',
              title: '八公山豆腐，淮南王刘安是其创始人。刘安招养才俊之士云集古都寿春，在八公山上纵论天下兴亡，求治世良方和炼丹制药。刘安等在炼丹时，偶尔将石膏点人丹母液即豆浆之中，经化学变化成了豆腐。豆腐从此问世。刘安使人成立豆腐生产作坊，培养豆腐专业生产人员，在生产操作的过程中，逐步完善生产设备，改进生产技术，提高豆腐质量。同时把豆腐制作技术传授给当地农民，当地农民学会了制作豆腐之术，并代代相传，不断改进豆腐制作工艺，严格操作，精益求精，使八公山豆腐比外地豆腐更具有自己鲜明的特色。如今八公山豆腐制品已远销海内外，每年的九月十五日的“中国豆腐文化节”影响巨大，吸引着中外客商云集于此。'
            }, {
              name: '栏目1-3'
            }, {
              name: '栏目1-4'
            }, {
              name: '栏目1-5'
            }, {
              name: '栏目1-1'
            }, {
              name: '栏目1-2'
            }, {
              name: '栏目1-3'
            }, {
              name: '栏目1-4'
            }, {
              name: '栏目1-5'
            }
          ]
        }
      ]
    };
  },
  activated() {
    this.title = this.$route.params.type;
    this.columnId = this.$route.query.id;
    this.getColumnData(this.columnId);
  },
  methods: {
    // 点击栏目
    columnClick(val, index) {
      this.columnIndex = index;
      this.columnTitle = val;
      this.childColumnTitle = '';
    },
    // 点击子栏目
    childColumn(val, index) {
      this.childColumnTitle = val;
      this.dataList[0].areaList.forEach((item, indexx) => {
        if (indexx == index) {
          this.unifiedCont = item.geographyDetail;
        }
      })
    },
    // 获取页面数据
    getColumnData(id) {
      this.columnTitle = this.dataList[0].theme;
      this.unifiedCont = this.dataList[0].content;
      this.$nextTick(() => {
        this.heightCon = this.$refs.picTopImgHei.offsetHeight * 1.4 + this.$refs.picCloumnHei.offsetHeight + this.$refs.picConHei.offsetHeight;
      });
      if (id) { // 自然地理信息
        let params = {
          flag: this.title,
          id: id,
          max: 20,  //暂时定义20
          offset: 0
        };
        this.$axiosGet(API.columnManageFacade_findWithPage, params).then(res => {
          if (res.result == 'success') {
            this.dataList[0].areaList = res.model.list;
            if (res.model.list.length > 0) {
              this.unifiedCont = res.model.list[0].geographyDetail;
              this.carsouselList = res.model.list[0].geographyImg;
            }
          } else {
            this.dataList.areaList = [];
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
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

.picture-top-img {
  img {
    width: 100%;
    height: 100%;
  }
}
.pic-nav-cloumn {
  height: 60px;
  background-color: #efefef;
  div a {
    color: #909399;
  }
}
.pic-content-wrap {
  width: 1280px;
  margin: 0px auto;
  padding: 30px 0;
  .pic-content-right {
    // width: 1010px;
    .pic-cont-right-title {
      font-size: 26px;
      color: #7babc1;
      display: inline-block;
      border-bottom: 1px #7babc1 solid;
      height: 45px;
    }
    .pic-cont-right-column {
      margin: 20px 20px 0 0;
      width: 180px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      display: inline-block;
      background-color: #efefef;
      color: #7babc1;
      cursor: pointer;
      &:hover {
        color: #226399;
      }
    }
    .unified-cont-introduct {
      margin: 20px 0 0 0;
      line-height: 30px;
    }
  }
}
</style>
