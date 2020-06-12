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
          <!-- <span>></span><span>{{this.$route.params.type}}</span> -->
          <span>></span><span><a @click="back">{{this.$route.params.type}}</a></span>
          <!-- <span v-if="columnTitle">><a @click="back" href="#">{{columnTitle}}</a></span> -->
          <span v-if="childColumnTitle">>{{childColumnTitle}}</span>
        </div>
      </div>

      <div ref="picConHei">
        <div class="pic-content-wrap">

          <div class="pic-content-box-wrap">
            <div v-if="!childColumnTitle" class="pic-cont-right-title">{{this.$route.params.type}}</div>

            <div v-if="!childColumnTitle" style="width: 1300px;margin-left: -7px;">

              <div v-for="(item, index) in dataList" :key="index" style="display:inline-block;margin: 0 7px;">

                <div v-if="title == '风味美食'">
                  <div class="pic-content-box" @click="childColumn(item.columnFoodName,item.columnFoodId)">
                    <img class="pic-content-box-img" :src="item.attachImg[0]">
                    <span class="pic-content-box-title f-text-ellipsis">{{item.columnFoodName}}</span>
                  </div>
                </div>
                <div v-if="title == '山水风光'">
                  <div class="pic-content-box" @click="childColumn(item.columnLandscapeName,item.columnLandscapeId)">
                    <img class="pic-content-box-img" :src="item.attachImg[0]">
                    <span class="pic-content-box-title f-text-ellipsis">{{item.columnLandscapeName}}</span>
                  </div>
                </div>
              </div>

              <div class="h-table-bottom f-clearfix" style="margin-top:20px;">
                <div class="h-table-pages f-pull-right">
                  <div class="block">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[12, 24, 36]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="childColumnTitle">
              <div class="pic-cont-right-title">{{childColumnTitle}}</div>
              <!-- <img class="pic-cont-right-img" v-if="picImg" :src="picImg" style="width:550px;height:310px;">
              <div style="margin-top: 20px;line-height: 30px;">{{columnCont}}</div> -->
              <div style="margin-top:20px;">

                <div v-if="title == '山水风光'">
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">地区：</span><span>{{detailData.areaId}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">详细地址：</span><span>{{detailData.detailedAddress}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">简介：</span><span style="line-height:30px;">{{detailData.briefIntroduction}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">百度百科：</span><a :href="detailData.url" target="_blank">{{detailData.url}}</a>
                  </div>
                  <div class="pic-cont-detail">
                    <!-- <span class="f-weight-bold" style="position: relative;top: -102px;">区位图：</span><img :src="detailData.areaPic" style="width:350px;height:220px;margin-left:23px;"> -->
                    <span class="f-weight-bold">区位图：</span><a :href="detailData.url" target="_blank">{{detailData.areaUrl}}</a>
                  </div>

                </div>
                <div v-if="title == '风味美食'">
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">美食名称：</span><span>{{detailData.columnFoodName}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">简介：</span><span>{{detailData.briefIntroduction}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">原料：</span><span style="line-height:30px;">{{detailData.rawMateria}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">制作方法：</span><span style="line-height:30px;">{{detailData.foodMake}}</span>
                  </div>
                  <div class="pic-cont-detail">
                    <span class="f-weight-bold">推荐餐厅：</span><a :href="rest.restaurant" target="_blank" v-for="(rest,index) in detailData.foodRestaurant" :key="index" style="margin-right:30px">{{rest.restaurant}}</a>
                  </div>
                </div>
                <div class="pic-cont-detail">
                  <span class="f-weight-bold">相关图片：</span>
                  <div style="margin-left:80px;margin-top:-20px;">
                    <img style="width:355px;height:225px;margin: 0 20px 20px 0;" v-for="(picItem, picIndex) in detailData.attachImg" :key="picIndex" :src="picItem">
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
      columnId: '',
      carsouselList: [],
      title: '',
      columnIndex: '0',
      columnTitle: '',
      childColumnTitle: '',
      heightCon: 0,
      picImg: 'http://pics.govicar.com/84ab1cb3-28fa-48d1-97ac-1070038da423.jpg', // 图片
      dataList: [],
      detailData: [],
      total: 0, // 数据总数
      pageSize: 12, // 数据最大值
      page: 1, // 当前页
    };
  },
  //监听器,监听路由的变化
  watch: {
    // 利用watch方法检测路由变化：
    '$route': function (to, from) {
      this.columnId = this.$route.query.id;
      this.title = this.$route.params.type;
      this.getColumnData(this.columnId);
    }
  },
  activated() {
    this.columnId = this.$route.query.id;
    this.title = this.$route.params.type;
    // this.heightCon = this.$refs.picTopImgHei.offsetHeight * 1.5 + this.$refs.picCloumnHei.offsetHeight + this.$refs.picConHei.offsetHeight,
    this.getColumnData(this.columnId);
  },
  methods: {
    //点击返回
    back() {
      this.childColumnTitle = ''
    },
    // 点击栏目
    columnClick(val, index) {
      this.columnIndex = index;
      this.columnTitle = val;
      this.childColumnTitle = '';

    },
    // 点击子栏目
    childColumn(val, id) {
      this.childColumnTitle = val;
      let params = {
        flag: this.title,
        pId: id
      };
      //查询单条记录给detailData赋值,判断是风味美食还是山水风光
      this.$axiosGet(API.columnManageFacade_findById, params).then(res => {
        if (res.result == 'success') {
          if (this.title == '山水风光') {
            this.detailData = res.model;
          } else if (this.title == '风味美食') {
            this.detailData = res.model;
            this.detailData.foodRestaurant = eval(res.model.foodRestaurant);
          }
        } else {
          this.detailData = [];
        }
        console.log(this.detailData);
      })
    },
    // 获取页面数据
    getColumnData(id) {
      this.childColumnTitle = '';
      this.$nextTick(() => {
        if (this.title == '风味美食') {
          this.heightCon = this.$refs.picTopImgHei.offsetHeight * 1.65 + this.$refs.picCloumnHei.offsetHeight + this.$refs.picConHei.offsetHeight;
        } else {
          this.heightCon = this.$refs.picTopImgHei.offsetHeight * 1.4 + this.$refs.picCloumnHei.offsetHeight + this.$refs.picConHei.offsetHeight;
        }
        // this.heightCon = this.$refs.picTopImgHei.offsetHeight * 1.5 + this.$refs.picCloumnHei.offsetHeight + this.$refs.picConHei.offsetHeight;
        // alert("offsetHeight:" + this.$refs.picTopImgHei.offsetHeight + ",offsetHeight" + this.$refs.picCloumnHei.offsetHeight + ",offsetHeight" + this.$refs.picConHei.offsetHeight);
      });
      if (id && id != '') { // 风味美食,山水风光信息
        let params = {
          flag: this.title,
          id: id,
          max: this.pageSize,
          offset: (this.page - 1) * this.pageSize
        };
        this.$axiosGet(API.columnManageFacade_findWithPage, params).then(res => {
          if (res.result == 'success') {
            this.dataList = res.model.list;
            // console.log(res.model.list);
            this.carsouselList = res.model.list[0].attachImg;
            // if (res.model.list.length > 0) {
            //   // alert(res.model.list[0].attachImg.length);
            //   if (res.model.list[0].attachImg.length > 0) {
            //     this.picImg = res.model.list[0].attachImg[0];
            //   }
            // }
            this.total = res.model.totleCount;
          } else {
            this.dataList = '';
          }
        })
      }
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getColumnData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getColumnData();
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
  .pic-content-box-wrap {
    // width: 1010px;
    .pic-cont-right-title {
      font-size: 26px;
      color: #7babc1;
      display: inline-block;
      border-bottom: 1px #7babc1 solid;
      height: 45px;
    }
    .pic-content-box {
      margin-top: 20px;
      display: inline-block;
      cursor: pointer;
      color: #7babc1;
      &:hover {
        color: #226399;
      }
      .pic-content-box-img {
        width: 310px;
        height: 260px;
      }
      .pic-content-box-title {
        padding: 0 30px;
        width: 250px;
        height: 60px;
        line-height: 60px;
        background-color: #efefef;
        box-shadow: 0px 3px 5px 0px #dcdcdc;
        display: block;
      }
    }
    .pic-cont-detail {
      margin-top: 40px;
    }
  }
}
</style>
