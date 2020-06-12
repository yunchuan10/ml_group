<template>
  <div>
    <div id="indexmap" style="height: calc(100% - 10px);">
      <section class="m-main" style="height: calc(100% - 35px)">
        <!--导航-->
        <div class="m-breadcrumb">
          <Y-Breadcrumb title="楼座管理"></Y-Breadcrumb>
          <el-form ref="ruleForm" :model="ruleForm" class="form" @submit.native.prevent>
            <div class="f-pull-right">
              <div class="f-pull-left">
                <el-input placeholder="请输入单位名称" v-model="ruleForm.useOrganName" class="input-with-select">
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
                    <el-radio label="EMPTY">空置</el-radio>
                    <label class="option s-state-success">空置</label>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </el-form>
        </div>
        <div style="height: calc(100% - 61px);display: flex;">
          <div id="left-panel" v-loading="loading" style="width:370px;height: 100%;margin-right: 10px;box-shadow: 3px 5px 5px rgba(0,0,0,0.1);" v-show="this.areaType == 1">
            <ul class="item-option">
              <li v-if=" this.flag === 0">
                <a>空置面积
                  <i class="iconfont icon-paixu" @click="setOrderType('orderEmptyAreaByDesc')" v-show="!sortIcon"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderType('orderEmptyAreaByAsc')" v-show="sortIcon"></i>
                </a>
              </li>
              <li v-if=" this.flag === 1">
                <a>空置面积
                  <i class="iconfont icon-paixu" @click="setOrderType('orderEmptyAreaDesc')" v-show="!sortIcon"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderType('orderEmptyAreaAsc')" v-show="sortIcon"></i>
                </a>
              </li>
              <!-- <li>
                <a>总使用面积</a>
              </li> -->
              <li>
                <a>共
                  <span class="u-text-color">{{total}}</span>个单位</a>
              </li>
            </ul>
            <div class="item-courtList" style="height:calc(100% - 53px);overflow: auto;padding-right:10px;" id="viewBox">
              <div class="item-mod f-clearfix" v-for="(item,index) in organList" :key="index">
                <div class="item-col-l">
                  <a class="no-1">
                    <span class="pointicon">{{index+1}}</span>
                  </a>
                </div>
                <div class="ml_30 mr_90">
                  <div class="row">
                    <span>
                      <router-link :to="{path: '/basic-information/query-manage/query-company-list/addressnum', query: {areaId: $route.query.areaId, areaType:  $route.query.areaType,organId: item.organId, organName: item.organName}}" class="n-blue">{{item.organName}}</router-link>
                    </span>
                  </div>
                  <div class="row addr">
                    <span class="n-grey" title="">空置面积：{{item.emptyAreaSum || '0'}}</span>
                    <span class="n-grey" title="">办公地址：{{item.courtyardAddress}}</span>
                  </div>
                </div>
              </div>
            </div>
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
  data() {
    return {
      status: '', //房间状态
      sortIcon: true,
      sortIconTwo: true,
      orderBy: '',
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      courtyardId: '',
      areaId: '',
      flag: 0,
      map: undefined,
      myGeo: undefined,
      point: undefined,
      label: undefined,
      bdary: undefined,
      ply: undefined,
      local: undefined,
      datamap: [],
      areaType: '', // 地区类型
      organList: [],
      organMapList: [],
      ruleForm: {
        useOrganName: '', //使用单位名称
      },
      loading: false
    };
  },
  activated() {
    if (this.$route.query) {
      this.areaId = this.$route.query.areaId;
      this.areaType = this.$route.query.areaType;
    }
    this.getDataRequest();
  },
  mounted() {
    // this.myReady();
    window.addEventListener('scroll', this.scroll, true);
  },
  computed: {

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
      if (this.flag === 1) {
        this.getUserList()
      } else {
        this.getDataRequest();
      }
      this.sortIcon = !this.sortIcon;
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
    getUserList() {
      let params = {
        orderBy: this.orderBy,
        courtyardId: this.courtyardId,
        useClientStatus: this.status,
        useOrganName: this.ruleForm.useOrganName
      }
      this.$axiosPost(API.index_getUseOrgan, params).then(res => {
        if (res.data) {
          this.organList = res.data.data;
          this.total = res.data.total;
        } else {
          this.organList = '';
          this.total = '';
        }
      })
    },
    getorganList() {
      let organ_info = [];
      for (let i = 0; i < this.organMapList.length; i++) {
        organ_info.push(
          {
            lng: this.organMapList[i].longitude,
            lat: this.organMapList[i].latitude,
            courtyardName: this.organMapList[i].courtyardName,
            organNum: this.organMapList[i].organNum,
            courtyardId: this.organMapList[i].courtyardId,
            address: this.organMapList[i].courtyardAddress,
          }
        );
      }
      setTimeout(() => {
        this.initCompany(organ_info);
      }, 1000)
    },
    getData() {
      // 创建地址解析器实例
      this.myGeo = new BMap.Geocoder();
      let data_info = [];
      // this.datamap.forEach((item, index) => {
      // });
      for (let i = 0; i < this.datamap.length; i++) {
        this.myGeo.getPoint(this.datamap[i].areaNames, (point) => {
          data_info.push(
            {
              lng: point.lng,
              lat: point.lat,
              name: this.datamap[i].areaName,
              areaId: this.datamap[i].areaId,
              areaType: this.datamap[i].areaType,
              organNum: this.datamap[i].organNum,
            }
          );
        });

      }
      setTimeout(() => {
        this.initPoint(data_info);
      }, 1000)
    },
    getDataRequest() {
      this.page = 1;
      let params = {
        areaId: this.areaId,
        orderBy: this.orderBy,
        useClientStatus: this.status,  //查询的房间状态
        useOrganName: this.ruleForm.useOrganName, // 查询 使用单位名称
        areaType: this.areaType,
        pageSize: this.pageSize,
        pageNum: this.page, // 当前页
      }
      this.$axiosPost(API.index_getCountOrgan, params).then(res => {
        if (res.data) {
          this.datamap = res.data.mapData;
          this.organList = res.data.organList.data;
          this.organMapList = res.data.organMapList;
          this.total = res.data.organList.total;
        }
        this.myReady();
        setTimeout(() => {
          if (this.areaType == '1') {
            this.getorganList()
          } else {
            this.getData();
          }
        }, 0);
        this.flag = 0;
      })
    },
    scrollGetData() {
      let params = {
        areaId: this.areaId,
        useClientStatus: this.status,  //查询的房间状态
        useOrganName: this.ruleForm.useOrganName, // 查询 使用单位名称
        areaType: this.areaType,
        pageSize: this.pageSize,
        pageNum: this.page, // 当前页
      }
      if (this.total == this.organList.length) {
        this.page--;
      } else {
        this.loading = true;
        this.$axiosPost(API.index_getCountOrgan, params).then(res => {
          if (res.data) {
            this.datamap = res.data.mapData;
            this.total = res.data.organList.total;
            this.organList = this.organList.concat(res.data.organList.data);
          }
          this.loading = false;
          setTimeout(() => {
            this.getData();
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
        //是地区
        content = `<a href='#'>${data_info[i].name}&nbsp;&nbsp;${data_info[i].organNum}</a>`;
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
        this.map.centerAndZoom(this.point, 10);
        this.label.addEventListener("click", () => {
          this.areaId = data_info[i].areaId;
          this.areaType = data_info[i].areaType;
          if (data_info[i].organNum === 0 && this.areaType === 1) {
            return false
          } if (this.areaType === 0) {
            this.getDataRequest(this.areaId, this.areaType)
          }
        })
      }
    },
    initCompany(data_info) {
      for (let i = 0; i < data_info.length; i++) {
        this.point = new BMap.Point(data_info[i].lng, data_info[i].lat);
        let marker = new BMap.Marker(this.point);  // 创建标注     
        this.label = new BMap.Label(`<div class="ol-commu"><div class="ol-commu-info"><span class="ol-commu-price">${data_info[i].organNum}个单位</span><span class="ol-commu-name">${data_info[i].courtyardName}</span><span class="ol-commu-count"></span>
      <i class="i-arr-down"></i></div></div>`, { offset: new BMap.Size(-22, -32) });// 创建文本标注对象
        this.map.addOverlay(marker);
        marker.setLabel(this.label);
        this.label.addEventListener("click", () => {
          this.courtyardId = data_info[i].courtyardId;
          this.getUserList(this.courtyardId);
          this.flag = 1;
        })
        this.map.centerAndZoom(this.point, 10);
      }
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
      margin-left: 15px;
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
    z-index: 2;
    background: #fff;
    .ol-commu-info {
      height: 30px;
      white-space: nowrap;
      border: 1px solid #2f70ff;
      box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
      border-radius: 4px;
      font-size: 14px;
      span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        vertical-align: middle;
      }
      .ol-commu-price {
        display: inline-block;
        color: #fff;
        padding: 0 10px;
        min-width: 31px;
        *width: 31px;
        text-align: center;
        background-color: #2f70ff;
      }
      .ol-commu-name {
        display: inline-block;
        max-width: 110px;
        *width: 140px;       
        padding: 0 7px 0 10px;
        overflow: hidden;
        color: #303133;
        white-space: nowrap;
        text-overflow: ellipsis;
        background-color: #fff;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
      }
      .ol-commu-count {
        font-weight: bold;
        padding-right: 10px;
        background-color: #fff;
        display: none;
      }
      .i-arr-down {
        display: inline-block;
        width: 0;
        height: 0;
        position: absolute;
        top: 32px;
        left: 21px;
        border-top: 9px solid #2f70ff;
        border-left: 9px dashed transparent;
        border-right: 9px dashed transparent;
      }
    }
  }
}
</style>
