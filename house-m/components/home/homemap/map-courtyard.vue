<template>
  <div>
    <div id="indexmap" style="height: calc(100% - 10px);">
      <section class="m-main" style="height: calc(100% - 35px)">
        <!--导航-->
        <div class="m-breadcrumb">
          <Y-Breadcrumb title=""></Y-Breadcrumb>
          <el-form ref="ruleForm" :model="ruleForm" class="form" @submit.native.prevent>
            <div class="f-pull-right">
              <div class="f-pull-left">
                <el-input placeholder="请输入院落名称或地址" v-model="ruleForm.courtyardName" class="input-with-select">
                  <el-button slot="append" icon="el-icon-search" @click="getSearch"></el-button>
                </el-input>
              </div>
              <div class="map-search">
                <el-radio-group v-model="status" @change="getSearch">
                  <div class="one">
                    <el-radio label="">全部</el-radio>
                    <label class="option s-state-apply">全部</label>
                  </div>
                  <div class="one">
                    <el-radio label="IDLE">闲置</el-radio>
                    <label class="option s-state-success">闲置</label>
                  </div>
                  <div class="one">
                    <el-radio label="INUSE">已分配</el-radio>
                    <label class="option s-state-inuse">已分配</label>
                  </div>
                  <div class="one">
                    <el-radio label="OFFICEHOUSEAPPLYING">调配中</el-radio>
                    <label class="option s-state-caveat">调配中</label>
                  </div>
                  <div class="one">
                    <el-radio label="HANDLEING">处置中</el-radio>
                    <label class="option s-state-prohibited">处置中</label>
                  </div>
                  <div class="one">
                    <el-radio label="HASHANDLE">已处置</el-radio>
                    <label class="option s-state-fail">已处置</label>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </el-form>
        </div>
        <div style="height: calc(100% - 61px);display: flex;">
          <div id="left-panel" v-loading="loading" style="width:370px;height: 100%;margin-right: 10px;box-shadow: 3px 5px 5px rgba(0,0,0,0.1);" v-show=" this.areaType == 1">
            <ul class="item-option">
              <li>
                <a>闲置面积
                  <i class="iconfont icon-paixu" @click="setOrderType('orderIdleAreaSumByDesc')" v-show="sortIcon"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderType('orderIdleAreaSumByAsc')" v-show="!sortIcon"></i>
                </a>
              </li>
              <li>
                <a>总使用面积
                  <i class="iconfont icon-paixu" @click="setOrderTypeUser('orderAreaSumByDesc')" v-show="sortIconTwo"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderTypeUser('orderAreaSumByAsc')" v-show="!sortIconTwo"></i>
                </a>
              </li>
              <li>
                <a>共
                  <span class="u-text-color">{{total}}</span>个院落</a>
              </li>
            </ul>
            <div class="item-courtList" style="height:calc(100% - 53px);overflow: auto;padding-right:10px;" id="viewBox">
              <div>
                <div class="item-mod f-clearfix" v-for="(item,index) in courtyardList" :key='index'>
                  <div class="item-col-l f-relative">
                    <a class="no-1">
                      <span class="pointicon">{{index + 1}}</span>
                    </a>
                  </div>
                  <div class="item-col-r">
                    <div class="img-wrap">
                      <a href="javascript:void(0)">
                        <img v-show="item.imgUrl != null" :src="item.imgUrl" style="width:80px;height:60px;">
                        <img v-show="item.imgUrl == null" :src="$store.state.imgPath.index_default" style="width:80px;height:60px;"></a>
                    </div>
                  </div>
                  <div class="ml_30 mr_90">
                    <div class="row">
                      <span>
                        <router-link :to="{path: '/basic-information/query-manage/query-courtyard-list', query: {courtyardId: item.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType, courtyardName:item.courtyardName}}" class="n-blue">{{item.courtyardName}}</router-link>
                      </span>
                    </div>
                    <div class="row addr">
                      <span class="n-grey" title="">总使用面积：{{item.areaSum}}㎡</span>
                      <span class="n-grey" title="">闲置面积：{{item.idleAreaSum}}㎡</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div> -->
          </div>
          <div id="allmap" style="height: 100%;flex:1;">
          </div>
        </div>

      </section>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data() {
    return {
      status: '',
      sortIcon: true,
      sortIconTwo: true,
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      areaId: '',
      map: undefined,
      myGeo: undefined,
      point: undefined,
      label: undefined,
      bdary: undefined,
      ply: undefined,
      local: undefined,
      opts: {},
      busy: false,
      datamap: [],
      orderType: 'orderIdleAreaSumByAsc', //排序
      areaType: '', // 地区类型
      courtyardList: [],
      ruleForm: {
        courtyardName: '', //院落名称或者院落地址
      },
      loading: false
    };
  },
  activated() {
    if (this.$route.query) {
      this.areaId = this.$route.query.areaId;
      this.areaType = this.$route.query.areaType;
    }
    this.setOrderType();
    this.setOrderTypeUser();
    this.getDataRequest();
  },
  mounted() {
    window.addEventListener('scroll', this.scroll, true);
  },
  computed: {
    areaName() {
      return this.$store.state.mainData.areaName;
    }
  },
  deactivated() {
    this.datamap = [];
    this.total = '';
    this.courtyardList = []
  },
  methods: {
    scroll(event) {
      let scrollObj = document.getElementById('viewBox'); // 滚动区域
      if (scrollObj) {
        let clientHeight = scrollObj.clientHeight;
        let scrollTop = scrollObj.scrollTop; // div 到头部的距离
        let scrollHeight = scrollObj.scrollHeight; // 滚动条的总高度
        if (clientHeight + scrollTop === scrollHeight) {
          this.page++;
          this.scrollGetData();
        }
      }
    },
    //排序
    setOrderType(value) {
      if (value) {
        this.orderBy = value;
      } else {
        this.orderBy = '';
      }
      this.getDataRequest();
      this.sortIcon = !this.sortIcon;
    },
    setOrderTypeUser(value) {
      if (value) {
        this.orderBy = value;
      } else {
        this.orderBy = '';
      }
      this.getDataRequest();
      this.sortIconTwo = !this.sortIconTwo;
    },
    myReady() {
      this.map = new BMap.Map("allmap");
      //比例尺控件
      let top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT });// 左上角，添加比例尺
      let top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
      let top_right_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }); //右上角，仅包含平移和缩放按钮
      /*缩放控件type有四种类型:
      BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
      this.map.addControl(top_left_control);
      this.map.addControl(top_left_navigation);
      // 启动鼠标滚轮操作
      this.map.enableScrollWheelZoom();
      //设置当前页面定位区域
      this.map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 5);
    },
    getData() {
      // 创建地址解析器实例
      this.myGeo = new BMap.Geocoder();
      let data_info = [];
      for (let i = 0; i < this.datamap.length; i++) {
        this.myGeo.getPoint(this.datamap[i].areaNames, (point) => {
          data_info.push(
            {
              lng: point.lng,
              lat: point.lat,
              name: this.datamap[i].areaName,
              areaId: this.datamap[i].areaId,
              areaType: this.datamap[i].areaType,
              yardNum: this.datamap[i].yardNum
            }
          );
        });
      }
      setTimeout(() => {
        this.initPoint(data_info);
      }, 1000)
    },

    getCountryList() {
      let yard_info = [];
      for (let i = 0; i < this.courtyardList.length; i++) {
        yard_info.push(
          {
            lng: this.courtyardList[i].longitude,
            lat: this.courtyardList[i].latitude,
            name: this.courtyardList[i].courtyardName,
            courtyardId: this.courtyardList[i].courtyardId,
            address: this.courtyardList[i].courtyardAddress,
            imgUrl: this.courtyardList[i].imgUrl,
            areaSum: this.courtyardList[i].areaSum,
            idleAreaSum: this.courtyardList[i].idleAreaSum
          }
        );
      }
      setTimeout(() => {
        this.initYard(yard_info);
      }, 1000)
    },
    getDataRequest() {
      this.page = 1;
      let params = {
        areaId: this.areaId,
        useStatus: this.status,  //查询的房间状态
        courtyardName: this.ruleForm.courtyardName, // 查询 院落名称 或者地址
        orderBy: this.orderBy,
        areaType: this.areaType,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      this.$axiosPost(API.index_getCountYard, params).then(res => {
        if (res.data) {
          this.datamap = res.data.mapData;
          this.courtyardList = res.data.yardList;
          if (res.data.yardList) {
            this.total = res.data.yardList.length;
          }
        }
        this.myReady();
        setTimeout(() => {
          if (this.areaType == '1') {
            this.getCountryList();
          } else {
            this.getData();
          }
        }, 0);
      })
    },
    scrollGetData() {
      let params = {
        areaId: this.areaId,
        useStatus: this.status,  //查询的房间状态
        courtyardName: this.ruleForm.courtyardName, // 查询 院落名称 或者地址
        orderBy: this.orderBy,
        areaType: this.areaType,
        pageSize: this.pageSize,
        pageNum: this.page
      }
      if (this.total == this.courtyardList.length) {
        this.page--;
      } else {
        this.loading = true;
        this.$axiosPost(API.index_getCountYard, params).then(res => {
          if (res.data) {
            this.datamap = res.data.mapData;
            this.total = res.data.yardList.total;
            this.courtyardList = this.courtyardList.concat(res.data.yardList.data);
          }
          this.loading = false;
          setTimeout(() => {
            this.getCountryList();
          }, 0);
        })
      }
    },
    initPoint(data_info) {
      for (let i = 0; i < data_info.length; i++) {
        this.point = new BMap.Point(data_info[i].lng, data_info[i].lat);
        let marker = new BMap.Marker(this.point);  // 创建标注
        let content = data_info[i].name;
        let opts = {
          position: this.point, // 指定文本标注所在的地理位置
          offset: new BMap.Size(0, 0) //设置文本偏移量
        }
        content = `<a><span>${data_info[i].name}</span>&nbsp;&nbsp;${data_info[i].yardNum}个</a>`;;
        // }
        this.label = new BMap.Label(content, opts); // 创建文本标注对象
        this.label.setStyle({
          background: "#fff",
          boxShadow: "2px 2px 5px #d7d7d7",
          borderRadius: "2px",
          color: "#303133",
          fontWeight: "800",
          fontSize: "14px", //字号
          border: "0", //边
          padding: '10px 15px',
          textAlign: "center", //文字水平居中显示
          lineHeight: "26px", //行高，文字垂直居中显示
          cursor: "pointer"
        });
        this.map.addOverlay(marker);
        this.map.addOverlay(this.label);
        this.label.addEventListener("click", () => {
          this.areaId = data_info[i].areaId;
          this.areaType = data_info[i].areaType;
          if (data_info[i].yardNum === 0 && this.areaType === 1) {
            return false
          } else if (this.areaType === 0) {
            this.getDataRequest(this.areaId, this.areaType)
          } else if (this.areaType === 1) {
            this.getDataRequest(this.areaId, this.areaType)
          }
        })
        this.map.centerAndZoom(this.point, 10);
      }
    },

    initYard(data_info) {
      for (let i = 0; i < data_info.length; i++) {
        this.point = new BMap.Point(data_info[i].lng, data_info[i].lat);
        let marker = new BMap.Marker(this.point);  // 创建标注     
        let content = `<h4 style='color:#303133;font-size:14px;margin:0 0 5px 0;padding:0.2em 0'>${data_info[i].name}</h4>
         <img  v-show="data_info[i].imgUrl != null" src=${data_info[i].imgUrl} width='80' height='60' style="float:right;margin:4px;">
        <p style='color:#606266;margin:0;line-height:1.5;'>${data_info[i].address}</p>
        <p style='color:#606266;margin:0;line-height:1.5;'>总使用面积：${data_info[i].areaSum}㎡</p>
        <p style='color:#606266;margin:0;line-height:1.5;'>总闲置面积：${data_info[i].idleAreaSum}㎡</p>
        </div>`;
        this.opts = {
          width: 500,     // 信息窗口宽度
          height: 120,     // 信息窗口高度
          title: "", // 信息窗口标题
        }
        this.label = new BMap.Label(`<div class="ol-commu"><span class="ol-commu-name">${data_info[i].name}</span><i class="i-arr-down"></i></div>`, { offset: new BMap.Size(-22, -32) });// 创建文本标注对象
        this.map.addOverlay(marker);
        marker.setLabel(this.label);
        this.addClickHandler(content, marker);
        this.map.centerAndZoom(this.point, 10);
      }
    },

    addClickHandler(content, marker) {
      marker.addEventListener("click", function (e) {
        let infoWindow = new BMap.InfoWindow(content, this.opts);  // 创建信息窗口对象 
        this.map.openInfoWindow(infoWindow, this.point); //开启信息窗口
      }
      );
    },

    //查询
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
  },

};
</script>

<style lang="scss">
#indexmap {
  .form {
    display: inline;
  }
  .el-radio-group {
    font-size: 14px;
    display: inline-block;
  }
  .el-input-group__append {
    color: #fff;
    font-size: 18px;
  }
  .el-input__inner {
    border-radius: 2px;
  }
  .el-button {
    border-radius: 2px;
  }
  .map-search {
    float: left;
    height: 40px;
    line-height: 40px;
    width: auto;
    .one {
      display: inline-block;
      margin-left: 35px;
      position: relative;
      .option {
        padding: 0 10px;
        line-height: 26px;
        white-space: nowrap;
        color: #fff;
        position: absolute;
        top: -5px;
        left: 18px;
      }
      .el-radio {
        margin-right: 10px;
      }
    }
  }
  .pointicon {
    font-size: 12px;
    color: #fff;
  }
  .el-input-group__append {
    background-color: #2f70ff;
    border: 1px solid #2f70ff;
  }
  input[type="checkbox"] {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    -ms-appearance: none;
    width: 18px;
    height: 18px;
    margin-right: 5px;
    border: 1px solid #0ce;
    border-radius: 2px;
    vertical-align: top;
    outline: none;
  }
  input[type="checkbox"]:checked {
    border-color: #0ce;
    width: 18px;
    height: 18px;
    background-size: 100% auto;
  }
  .item-option {
    display: -webkit-flex;
  }
  .item-option li {
    display: inline-block;
    height: 52px;
    line-height: 52px;
    -webkit-flex: 1;
    a {
      display: block;
      text-align: center;
      color: #606266;
    }
  }
  .item-mod {
    padding: 6px 0;
    .item-col-l {
      float: left;
      .no-1 {
        // background-image: url(https://webmap0.bdimg.com/wolfman/static/common/images/markers_new2_4ab0bc5.png);
        background-image: url("/static/icon/default/index/point-icon.png");
        background-repeat: no-repeat;
        width: 21px;
        height: 32px;
        text-align: center;
        display: inline-block;
        margin-left: 6px;
        margin-top: 4px;
      }
    }
    .item-col-r {
      float: right;
      width: 75px;
      margin-right: 10px;
      text-align: right;
      .img-wrap {
        position: relative;
      }
    }
    .row {
      padding: 5px 0;
      line-height: 1.2;
      span {
        display: block;
        margin-bottom: 5px;
      }
    }
    .addr {
      overflow: hidden;
    }
  }
  .n-grey {
    color: #666 !important;
  }
  .mr_90 {
    margin-right: 90px;
  }
  .ml_30 {
    margin-left: 30px !important;
  }
  .ol-commu {
    cursor: pointer;
    position: absolute;
    top: -20px;
    z-index: 2;
    .ol-commu-name {
      box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
      display: inline-block;
      color: #2f70ff;
      font-size: 14px;
      font-weight: bold;
      padding: 10px 15px;
      min-width: 80px;
      text-align: center;
      background-color: #fff;
    }
    .i-arr-down {
      display: inline-block;
      width: 0;
      height: 0;
      position: absolute;
      top: 36px;
      left: 21px;
      border-top: 8px solid #fff;
      border-left: 8px dashed transparent;
      border-right: 8px dashed transparent;
    }
  }
}
</style>
