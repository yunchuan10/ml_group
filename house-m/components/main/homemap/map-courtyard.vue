<template>
  <div>
    <div id="indexmap" style="height: calc(100% - 10px);">
      <section class="m-main" style="height: calc(100% - 35px)">
        <!--导航-->
        <div class="m-breadcrumb">
          <!-- <Y-Breadcrumb title="" :item="[]" type=""></Y-Breadcrumb> -->
          <div class="f-pull-left m-text">当前位置：
            <span v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</span>
            <span v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</span>
          </div>
          <el-form ref="ruleForm" :model="ruleForm" class="form" @submit.native.prevent>
            <div class="f-pull-right">
              <div class="f-pull-left">
                <el-input placeholder="输入院落名称、地址或使用单位查询" v-model="ruleForm.courtyardName" class="input-with-select" clearable>
                  <el-button slot="append" icon="el-icon-search" @click="getSearch"></el-button>
                </el-input>
              </div>
              <div class="map-search">
                <el-checkbox-group v-model="status" @change="getSearch">
                  <div class="one">
                    <el-checkbox label="IDLE">闲置</el-checkbox>
                    <label class="option s-state-success">闲置</label>
                  </div>
                </el-checkbox-group>
                <el-checkbox-group v-model="centralOffice" @change="getSearch">
                  <div class="one">
                    <el-checkbox label="YES">集中办公区</el-checkbox>
                    <label class="option s-state-centralize">集中办公区</label>
                  </div>
                </el-checkbox-group>             
              </div>
            </div>
          </el-form>
          <div class="f-clearfix"></div>
        </div>
        <div style="height: calc(100% - 61px);display: flex;">
          <!-- <div id="left-panel" v-loading="loading" style="width:370px;height: 100%;margin-right: 10px;box-shadow: 3px 5px 5px rgba(0,0,0,0.1);" v-show=" this.areaType == 1"> -->
          <div id="left-panel" v-loading="loading" style="width:370px;height: 100%;margin-right: 10px;box-shadow: 3px 5px 5px rgba(0,0,0,0.1);">
            <ul class="item-option">
              <li>
                <a>闲置面积
                  <i class="iconfont icon-paixu" @click="setOrderType('orderIdleAreaSumByDesc')" v-show="sortIcon"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderType('orderIdleAreaSumByAsc')" v-show="!sortIcon"></i>
                </a>
              </li>
              <li class="f-text-center">
                共
                <span class="f-size-16px">{{total}}</span>个院落
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
                      <img v-show="item.imgUrl != null" :src="item.imgUrl" style="width:80px;height:60px;">
                      <img v-show="item.imgUrl == null" :src="$store.state.imgPath.index_default" style="width:80px;height:60px;">
                    </div>
                  </div>
                  <div class="ml_30 mr_90">
                    <div class="row">
                      <span>
                        <router-link :to="{path: '/basic-information/query-manage/query-courtyard-list', query: {courtyardId: item.courtyardId, areaId: areaId, areaType:  $route.query.areaType, courtyardName:item.courtyardName,name: ruleForm.courtyardName}}" class="n-blue">{{item.courtyardName}}</router-link>
                      </span>
                      <span v-show="item.centralOffice ==='YES'" class="row-text">集中办公</span>
                    </div>
                    <div class="row addr">
                      <span class="n-grey" title="">闲置面积：{{item.roomBuildAreaSum}}㎡</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="f-text-center data-default" v-show="total === 0"><img :src="$store.state.imgPath.indexdedault">
                <p>暂无院落！</p>
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
      status: [],
      centralOffice: [], //集中办公区
      sortIcon: true,
      sortIconTwo: true,
      searchData: true,
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      // areaId: '',
      map: undefined,
      myGeo: undefined,
      point: undefined,
      label: undefined,
      bdary: undefined,
      ply: undefined,
      local: undefined,
      infoBoxTemp:'',
      opts: {},
      busy: false,
      datamap: [],
      // orderType: '', //排序
      orderBy: '',  //排序
      areaType: '1', // 地区类型
      courtyardList: [],
      courtyardDetail:[], //院落详情
      ruleForm: {
        courtyardName: '', //院落名称或者院落地址
      },
      loading: false
    };
  },
  activated() {
    // if (this.$route.query) {
    //    this.areaId = this.$route.query.areaId;
    //   this.areaType = this.$route.query.areaType;
    // }
    if (this.$route.query.name) {
      this.ruleForm.courtyardName = this.$route.query.name;
    }
    // this.setOrderTypeUser();
    setTimeout(() => {
      this.getDataRequest();
      // this.setOrderType();
    }, 1000)
  },
  created(){
    // let self = this;
    // window.getDetail = self.getDetail;
  },
  updated() {

  },
  computed: {
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    organName() {
      return this.$store.state.mainData.organName;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  watch: {
    // 'areaId': function (val) {
    //   this.getDataRequest();
    // },
  },
  deactivated() {
    this.datamap = [];
    this.total = '';
    this.courtyardList = [];
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
    // setOrderTypeUser(value) {
    //   if (value) {
    //     this.orderBy = value;
    //   } else {
    //     this.orderBy = '';
    //   }
    //   this.getDataRequest();
    //   this.sortIconTwo = !this.sortIconTwo;
    // },
    myReady() {
      this.map = new BMap.Map("allmap");
      //设置当前页面定位区域
      // this.map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 12);
      if (this.searchData) {
        if (this.areaName != "") {
          this.map.setCenter(this.areaName);
          this.map.centerAndZoom(this.areaName, 14);      // 用城市名设置地图中心点
        } else {
          this.map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 14);
        }
      }
      //比例尺控件
      let top_left_control = new BMap.ScaleControl({ anchor: BMAP_ANCHOR_TOP_LEFT });// 左上角，添加比例尺
      let top_left_navigation = new BMap.NavigationControl();  //左上角，添加默认缩放平移控件
      let top_right_navigation = new BMap.NavigationControl({ anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL }); //右上角，仅包含平移和缩放按钮
      /*缩放控件type有四种类型:
      BMAP_NAVIGATION_CONTROL_SMALL：仅包含平移和缩放按钮；BMAP_NAVIGATION_CONTROL_PAN:仅包含平移按钮；BMAP_NAVIGATION_CONTROL_ZOOM：仅包含缩放按钮*/
      setTimeout(() => {
        this.map.addControl(top_left_control);
        this.map.addControl(top_left_navigation);
      }, 0);   
      // 启动鼠标滚轮操作
      this.map.enableScrollWheelZoom(true);        
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
            roomBuildAreaSum:this.courtyardList[i].roomBuildAreaSum,
            imgUrl:this.courtyardList[i].imgUrl,
            address: this.courtyardList[i].courtyardAddress
          }
        );
      }
      setTimeout(() => {
        this.initYard(yard_info);
      }, 0)
    },
    getDataRequest() {
      this.page = 1;
      let params = {
        useStatus: this.status.toString(),  //查询的房间状态
        courtyardName: this.ruleForm.courtyardName, // 查询 院落名称 或者地址
        orderBy: this.orderBy,
        centralOffice: this.centralOffice.toString(), //集中办公区
      }
      this.$axiosGet(API.index_getCountYard, params).then(res => {
        if (res.data) {
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
    getDetail(id){
      let params = {
        courtyardId: id
      }
      this.$axiosGet(API.index_getCountYardDetail,params).then(res =>{
        if(res.data){
          this.courtyardDetail = res.data;
        }
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
        this.map.centerAndZoom(this.point, 12);
        this.map.addOverlay(marker);
        this.map.addOverlay(this.label);
        // 启动鼠标滚轮操作
        this.map.enableScrollWheelZoom(true);
        // this.map.enableDragging();
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

      }
    },

    initYard(data_info) {
      for (let i = 0; i < data_info.length; i++) {
        if(data_info[i].lng==null||data_info[i].lng==''||data_info[i].lng==undefined){
          continue;
        }
        let label = '';
        this.point = new BMap.Point(data_info[i].lng, data_info[i].lat);
        let marker = new BMap.Marker(this.point);  // 创建标注   
        label = new BMap.Label(`<div class="ol-commu"><span class="ol-commu-name">${data_info[i].name}</span><i class="i-arr-down"></i></div>`, { offset: new BMap.Size(-22, -32) });// 创建文本标注对象
        this.map.addOverlay(marker);
        marker.setLabel(label);
        label.addEventListener("click", () => {
          if(this.infoBoxTemp){
            this.infoBoxTemp.close();
          }   
          let params = {
            courtyardId: data_info[i].courtyardId
          }
          this.$axiosGet(API.index_getCountYardDetail,params).then(res =>{
            if(res.data){
              this.courtyardDetail = res.data;
              let data_detail ={};
              data_detail = this.courtyardDetail;
              let content = `<div class="infoBoxContent">
              <h2 class="box-h2">${data_info[i].name}
                <span>(${data_info[i].address})</span>
              </h2>
              <div class="box-1">
                <div class="box-text f-pull-left">
                  <p>建筑数量：${ data_detail.floorNum}栋</p>
                  <p>总建筑面积：${data_detail.floorBuildAreaSum}㎡</p>
                  <p>总闲置面积：${data_detail.roomBuildAreaSum}㎡</p>
                  <p>使用单位：${data_detail.useOrganNum}家</p>
                  <div class="u-bread-btn-group">                      
                  <a href="/basic-information/query-manage/query-courtyard-list?courtyardId=${data_info[i].courtyardId}&areaId=${this.areaId}&areaType=${this.areaType}&courtyardName=${data_info[i].name}&name=${this.ruleForm.courtyardName}">
                  <button class="u-bread-btn">
                      详细信息
                    </button>   
                    </a>               
                 <a href="${data_detail.viewUrl ? data_detail.viewUrl:''}" target="_blank"><button class="u-bread-btn" disabled="${ data_detail.viewUrl?false:true}">
                      进入全景
                    </button> </a>
                 <a href="${data_detail.threeUrl ?  data_detail.threeUrl:''}  " target="_blank"><button class="u-bread-btn"  disabled="${ data_detail.threeUrl?false:true}">
                      3D模型
                    </button></a>
                  </div>
                </div>
                <div class="box-img f-pull-right">
                   <img src=${data_detail.imgUrl ?  data_detail.imgUrl : this.$store.state.imgPath.yldefault} style="width:250px; height:180px;" />
                </div>
                <div class="f-clearfix"></div>
              </div>
            </div>`;
              let infoBox =  new BMapLib.InfoBox(this.map, content, {
                boxStyle: {
                  opacity: "1",
                  background: "#333333",
                  borderRadius: "6px",
                  boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.2)",
                  width: "600px",
                  height: "260px"
                },
                closeIconUrl: this.$store.state.imgPath.closeIcon,
                closeIconMargin: "20px 20px 0 0",
                enableAutoPan: true,
                align: INFOBOX_AT_TOP
              }); 
              // infoBoxTemp 全局变量用于做判断当前是否存在开着的消息框
              this.infoBoxTemp = infoBox;
              infoBox.open(marker);            
            }          
          })             
          //开启信息窗口
        });
        // 启动鼠标滚轮操作
        // this.map.enableScrollWheelZoom(true);
      }
      this.map.enableScrollWheelZoom(true);
    },
    //查询
    getSearch() {
      this.page = 1;
      this.searchData = false;
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
  .m-breadcrumb {
    padding: 10px 0;
    .m-text {
      height: 40px;
      line-height: 40px;
    }
    .input-with-select {
      width: 350px;
    }
  }
  .f-size-16px {
    font-size: 16px;
    cursor: default;
  }
  .infoBoxContent {
    width: 600px;
    height: 260px;
    cursor: default;
    border-radius: 6px;
    background: #fff;
    padding: 20px;
    box-sizing: border-box;
    .box-h2 {
      span {
        font-weight: normal;
        cursor: text;
      }
    }

    .box-1 {
      margin-top: 15px;
    }
    .box-text p {
      color: #606266;
      margin-bottom: 10px;
    }
    .box-img {
      width: 250px;
      height: 180px;
    }
    .u-bread-btn {
      height: 34px;
      line-height: 34px;
      margin-left: 0;
      margin-right: 10px;
    }
    .u-bread-btn-group {
      // margin-top: 40px;
      .el-button-export {
        border: 1px solid #c0c4cc;
        color: #c0c4cc;
      }
      .el-button-export:hover {
        border: 1px solid #dcdfe6;
        color: #c0c4cc;
        cursor: default;
      }
    }
  }
  .infoBoxContent:before {
    content: "";
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: #fff;
    position: absolute;
    left: 50%;
    top: 100%;
    margin-left: -10px;
  }
  .data-default {
    margin-top: calc(100% - 50% + 55px);
    p {
      margin-top: 15px;
      color: #909399;
    }
  }
  .el-radio-group,
  .el-checkbox-group {
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
  .s-state-centralize {
    background: #e6a23c;
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
        top: 4px;
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
        display: inline-block;
        margin: 0 15px 5px 0;
      }
      .row-text {
        color: #e6a23c;
        padding: 0 8px;
        font-size: 12px;
        height: 28px;
        line-height: 28px;
        background: rgba(253, 246, 236, 1);
        border: 1px solid rgba(245, 218, 177, 1);
        border-radius: 2px;
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
    top: -10px;
    z-index: 2;
    .ol-commu-name {
      box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2);
      display: inline-block;
      color: #2f70ff;
      border: 1px solid #2f70ff;
      font-size: 14px;
      font-weight: 400;
      line-height: 28px;
      padding: 0 10px;
      min-width: 80px;
      text-align: center;
      background-color: #fff;
    }
    .i-arr-down {
      display: inline-block;
      width: 0;
      height: 0;
      position: absolute;
      top: 28px;
      left: 21px;
      border-top: 8px solid #fff;
      border-left: 8px dashed transparent;
      border-right: 8px dashed transparent;
    }
  }
}
</style>
