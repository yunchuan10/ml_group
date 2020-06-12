<template>
  <div style="background-color:#fff;">
    <div :style="{'height': `${heightCon}px`}">
      <div ref="picTopImgHei" class="picture-top-img">
        <img :src="picImg" alt="">
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
        <div class="pic-content-wrap f-clearfix">
          <div class="pic-content-left f-pull-left">
            <div class="f-relative">
              <img :src="$store.state.imgPath.picTheme" alt=""><span class="f-absolute">{{this.$route.params.type}}</span>
            </div>
            <div style="box-shadow:0px 1px 4px 1px #dcdcdc;">
              <div class="pic-cont-column" :class="columnIndex == index ? 'column-active':''" v-for="(item, index) in dataList" :key="index" @click="childColumn(item.childColumnId)">
                <img :style="columnIndex == index?'visibility: visible;':'visibility: hidden;'" :src="$store.state.imgPath.iconTitle">
                <span>{{item.childColumnName}}</span>
              </div>
            </div>
          </div>

          <div class="pic-content-right f-pull-right">

            <div v-if="!childColumnTitle">
              <div class="pic-cont-right-title">{{columnTitle}}</div>
              <div>
                <div class="pic-cont-right-column" v-for="(childItem, childIndex) in defaultList" :key="childIndex" @click="childDetailColumn(childItem.childColumnDetailName,childItem.childColumnDetailId)">
                  <span>{{childItem.childColumnDetailName}}</span>
                </div>
              </div>
            </div>

            <div v-if="childColumnTitle">
              <div class="pic-cont-right-title">{{childColumnTitle}}</div>
              <img class="pic-cont-right-img" v-if="image" :src="image" style="width:550px;height:310px;">
              <div style="margin-top: 20px;line-height: 30px;">{{columnCont}}</div>
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
      columnId: '',
      title: '',
      columnIndex: '0',
      columnTitle: '',
      childColumnTitle: '',
      columnCont: '',
      heightCon: 0,
      image: '',  //子栏目内容图片
      picImg: 'http://pics.govicar.com/84ab1cb3-28fa-48d1-97ac-1070038da423.jpg', // 图片
      dataList: [
        {
          theme: '栏目一',
          themeList: [
            {
              name: '栏目1-1'
            }, {
              name: '栏目1-2'
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
        }, {
          theme: '栏目2',
          themeList: [
            {
              name: '栏目2-1'
            }, {
              name: '栏目2-2'
            }, {
              name: '栏目2-3'
            }, {
              name: '栏目2-4'
            }, {
              name: '栏目2-5'
            }
          ]
        }, {
          theme: '栏目3',
          themeList: [
            {
              name: '栏目3-1'
            }, {
              name: '栏目3-2'
            }, {
              name: '栏目3-3'
            }, {
              name: '栏目3-4'
            }, {
              name: '栏目3-5'
            }
          ]
        }
      ],
      defaultList: [],
      total: 0, // 数据总数
      pageSize: 100, // 数据最大值
      page: 1, // 当前页
    };
  },
  activated() {
    this.columnId = this.$route.query.id;
    this.title = this.$route.query.title;
    this.getColumnData(this.columnId);
  },
  methods: {
    // 点击子栏目
    childColumn(childColumnId) {
      this.getChildColumnData(childColumnId);
      this.childColumnTitle = '';
    },
    // 点击子栏目内容
    childDetailColumn(val, childColumnDetailId) {
      this.childColumnTitle = val;
      let params = {
        childColumnDetailId: childColumnDetailId
      }
      // 获取子栏目内容
      this.$axiosGet(API.columnManageFacade_findByChildColumnDetailId, params).then(res => {
        if (res.result == 'success') {
          // console.log(res);
          this.columnCont = res.model.childColumnDetail;
          this.image = res.model.attachImg;
        } else {
          this.columnCont = '';
        }
      })

      this.columnCont = '八公山豆腐开始于2000多年，淮南王刘安是其创始人。刘安招养才俊之士云集古都寿春，在八公山上纵论天下兴亡，求治世良方和炼丹制药。刘安等在炼丹时，偶尔将石膏点人丹母液即豆浆之中，经化学变化成了豆腐。豆腐从此问世。刘安使人成立豆腐生产作坊，培养豆腐专业生产人员，在生产操作的过程中，逐步完善生产设备，改进生产技术，提高豆腐质量。同时把豆腐制作技术传授给当地农民，当地农民学会了制作豆腐之术，并代代相传，不断改进豆腐制作工艺，严格操作，精益求精，使八公山豆腐比外地豆腐更具有自己鲜明的特色。如今八公山豆腐制品已远销海内外，每年的九月十五日的“中国豆腐文化节”影响巨大，吸引着中外客商云集于此。';
    },
    // 获取页面数据
    getColumnData(id) {
      this.$nextTick(() => {
        this.heightCon = this.$refs.picTopImgHei.offsetHeight * 1.4 + this.$refs.picCloumnHei.offsetHeight + this.$refs.picConHei.offsetHeight;
      });
      if (id) {
        let params = {
          columnId: this.columnId
        }
        // 获取子栏目
        this.$axiosGet(API.columnManageFacade_findAllByColumnId, params).then(res => {
          if (res.result == 'success') {
            this.dataList = res.model.model.childColumnList;
            // 子栏目列表
            this.getChildColumnData(res.model.model.childColumnList[0].childColumnId);
          } else {
            this.dataList = [];
          }
        })
      }
    },
    getChildColumnData(id) {
      let params = {
        id: id,
        max: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      };
      this.$axiosGet(API.columnManageFacade_findDetailWithPage, params).then(res => {
        // console.log(res);
        if (res.result == 'success') {
          this.defaultList = res.model.list;
          this.total = res.total;
          if (res.model.list.length > 0) {
            if (res.model.list.attachImg != '') {
              this.picImg = res.model.list[0].attachImg;
            }
          }
        } else {
          this.defaultList = [];
        }
      })
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
  .pic-content-left {
    width: 220px;
    span {
      top: 24px;
      left: 70px;
      font-size: 20px;
      color: #fff;
    }
    .pic-cont-column {
      font-size: 16px;
      font-weight: bold;
      height: 55px;
      line-height: 55px;
      cursor: pointer;
      span {
        margin-left: 10px;
        color: #000;
      }
      img {
        margin-left: 65px;
        margin-top: -5px;
      }
    }
    .column-active {
      span {
        color: #226399;
      }
    }
  }
  .pic-content-right {
    width: 1010px;
    .pic-cont-right-title {
      font-size: 26px;
      color: #7babc1;
      display: inline-block;
      border-bottom: 1px #7babc1 solid;
      height: 45px;
    }
    .pic-cont-right-img {
      margin: 20px auto;
      width: 550px;
      height: 310px;
      display: block;
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
  }
}
</style>
