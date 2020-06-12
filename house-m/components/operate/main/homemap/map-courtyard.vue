<template>
  <div>
    <div id="indexmap" style="height: calc(100% - 10px);">
      <section class="m-main" style="height: calc(100% - 35px)">
        <!--导航-->
        <div class="m-breadcrumb">
          <div class="f-pull-left m-text">当前位置：
            <span v-if="this.areaId.length =='7'">{{areaName+'省直机关'}}</span>
            <span v-if="this.areaId.length =='10' || this.areaId.length=='13'">{{areaName+'直机关'}}</span>
          </div>
          <el-form ref="ruleForm" :model="ruleForm" class="form" @submit.native.prevent>
            <div class="f-pull-right">
              <div class="f-pull-left">
                <el-input placeholder="请输入街道名称/门牌号或管理单位名称" v-model="ruleForm.organName" class="input-with-select" clearable>
                  <el-button slot="append" icon="el-icon-search" @click="getSearch"></el-button>
                </el-input>
              </div>
              <div class="map-search operate">
                <el-radio-group v-model="status" @change="getSearch">
                  <div class="one">
                    <el-radio label="">全部</el-radio>
                    <label class="option s-state-apply">全部</label>
                  </div>
                  <div class="one">
                    <el-radio label="DEALIDLE">闲置</el-radio>
                    <label class="option s-state-success">闲置</label>
                  </div>
                  <div class="one">
                    <el-radio label="RENTING">出租中</el-radio>
                    <label class="option s-state-prohibited">出租中</label>
                  </div>
                </el-radio-group>
              </div>
            </div>
          </el-form>
          <div class="f-clearfix"></div>
        </div>
        <div style="height: calc(100% - 61px);display: flex;">
          <div id="left-panel" v-loading="loading" style="width:370px;height: 100%;margin-right: 10px;box-shadow: 3px 5px 5px rgba(0,0,0,0.1);">
            <ul class="item-option">
              <li>
                <a>经营面积
                  <i class="iconfont icon-paixu" @click="setOrderType('desc')" v-show="sortIcon"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderType('asc')" v-show="!sortIcon"></i>
                </a>
              </li>
              <li>
                <a>当前租金
                  <i class="iconfont icon-paixu" @click="setOrderTypeUser('desc')" v-show="sortIconTwo"></i>
                  <i class="iconfont icon-order-asc" @click="setOrderTypeUser('asc')" v-show="!sortIconTwo"></i>
                </a>
              </li>
              <li>
                <a>共
                  <span class="u-text-color">{{total}}</span>处房屋</a>
              </li>
            </ul>
            <div class="item-courtList" style="height:calc(100% - 53px);overflow: auto;padding-right:10px;" id="viewBox">
              <div>
                <div class="item-mod f-clearfix" v-for="(item,index) in houseData" :key='index'>
                  <div class="item-col-l f-relative">
                    <a class="no-1">
                      <span class="pointicon">{{index + 1}}</span>
                    </a>
                  </div>
                  <div class="item-col-r">
                    <div class="img-wrap">
                      <a href="javascript:void(0)">
                        <img v-show="item.url != null" :src="item.url" style="width:80px;height:60px;">
                        <img v-show="item.url == null" :src="$store.state.imgPath.index_default" style="width:80px;height:60px;"></a>
                    </div>
                  </div>
                  <div class="ml_30 mr_90">
                    <!-- <div class="row">
                      <span>
                        <router-link :to="{path: '/basic-information/query-manage/query-courtyard-list', query: {courtyardId: item.courtyardId, areaId: $route.query.areaId, areaType:  $route.query.areaType, courtyardName:item.courtyardName}}" class="n-blue">{{item.courtyardName}}</router-link>
                      </span>
                    </div> -->
                    <div class="row addr">
                      <div class="n-grey" title="">
                        <p class="f-inline-block">
                          <router-link :to="{path: '/operate/query-manage-street/query-street-list/roomnum', query: {organId: item.organId, areaId: $route.query.areaId, street:item.street,name: ruleForm.organName}}" class="n-blue">{{item.street}}</router-link>{{item.houseNo}}
                        </p>
                      </div>
                      <div class="n-grey" title="">房屋状态：
                        <i class="z-state" :class="checkStatus(item.statusName)">{{item.statusName || ''}}</i>
                      </div>
                      <div class="n-grey" title="">经营面积：{{item.area?item.area:'0'}}㎡</div>
                      <div class="n-grey" title="">当前租金：{{item.contractRental}}
                        <i v-show="item.contractRental != null">元/年</i>
                      </div>
                      <div class="n-grey" title="">管理单位：
                        <router-link :to="{path: '/operate/query-manage/query-courtyard-list/roomnum',query:{organId: item.organId, areaId: $route.query.areaId, organName:item.organName,name: ruleForm.organName}}">{{item.organName}}</router-link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="block">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div> -->
          </div>
          <div id="operatMap" style="height: 100%;flex:1;">
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
      searchData: true, // 判断是不是搜索
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
      opts: {},
      busy: false,
      rentSort: '', //租金排序
      buildAreaSort: '', //建筑面积排序
      infoBoxTemp:'', //是否存在已打开的信息框
      datamap: [],
      areaList: [], //区域集合
      orderType: 'orderIdleAreaSumByAsc', //排序
      areaType: '', // 地区类型
      houseData: [],
      ruleForm: {
        organName: '', //院落名称或者院落地址
      },
      loading: false
    };
  },
  activated() {
    if (this.$route.query) {
      this.areaType = this.$route.query.areaType;
      this.ruleForm.organName = this.$route.query.name;
    } else {
      this.ruleForm.organName = ''
    }
    // this.setOrderType();
    // this.setOrderTypeUser();
    this.getDataRequest();
  },
  mounted() {
    // this.$nextTick(() =>{
    //   this.myReady();
    // }) 
  },
  computed: {
    areaName() {
      return this.$store.state.mainData.areaName;
    },
    areaId() {
      return this.$store.state.mainData.areaId;
    }
  },
  deactivated() {
    this.datamap = [];
    this.total = '';
    this.houseData = [];
    this.$destroy()
  },
  methods: {
    checkStatus(value) {
      if (value === '闲置') { // 闲置中
        return 's-state-success'
      } else if (value === '出租中') {
        return 's-state-prohibited'
      }
    },
    //排序
    setOrderTypeUser(value) {
      if (value) {
        if (this.buildAreaSort) {
          this.buildAreaSort = '';
          this.rentSort = value;
        } else {
          this.rentSort = value;
        }

      } else {
        this.rentSort = '';
      }
      this.getDataRequest();
      this.sortIconTwo = !this.sortIconTwo;
    },
    setOrderType(value) {
      if (value) {
        if (this.rentSort) {
          this.rentSort = '';
          this.buildAreaSort = value;
        } else {
          this.buildAreaSort = value;
        }
      } else {
        this.buildAreaSort = '';
      }
      this.getDataRequest();
      this.sortIcon = !this.sortIcon;
    },
    myReady() {
      this.map = new BMap.Map("operatMap");
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
      // this.map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 5);
      if (this.searchData) {
        if (this.areaName != "") {
          this.map.setCenter(this.areaName);
          this.map.centerAndZoom(this.areaName, 14);      // 用城市名设置地图中心点
        }
      } else {
        this.map.centerAndZoom(new BMap.Point(116.417854, 39.921988), 14);
      }

    },

    getCountryList() {
      let yard_info = [];
      for (let i = 0; i < this.houseData.length; i++) {
        yard_info.push(
          {
            lng: this.houseData[i].longitude,
            lat: this.houseData[i].latitude,
            area: this.houseData[i].area,
            contractRental: this.houseData[i].contractRental,
            street: this.houseData[i].street,
            houseNo: this.houseData[i].houseNo,
            houseId: this.houseData[i].id,
            statusName: this.houseData[i].statusName,
            acquisitionModeName: this.houseData[i].acquisitionModeName,
            propertyOrganName: this.houseData[i].propertyOrganName,
            organId: this.houseData[i].organId,
            organName: this.houseData[i].organName,
            houseAddress: this.houseData[i].houseAddress,
            imgUrl: this.houseData[i].url
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
        street: this.ruleForm.organName || '',
        houseStatus: this.status,  //查询的房屋状态
        rentSort: this.rentSort, //租金排序
        buildAreaSort: this.buildAreaSort //经营面积排序
      }
      this.$axiosGet(API.mainPage_getHouseDate, params).then(res => {
        if (res.data) {
          this.datamap = res.data.mainPageResponseList; //地区
          this.houseData = res.data.houseDataResponseList;
          if (res.data.houseDataResponseList) {
            this.total = res.data.TotalHouseNum;
          } else {
            this.total = 0;
          }
          this.myReady();
        }      
        setTimeout(() => {
          this.getCountryList();         
        }, 0);
      })
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
        content = `<a><span>${data_info[i].name}</span>&nbsp;&nbsp;${data_info[i].houseNum}处</a>`;;
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
          if (data_info[i].houseNum === 0 && this.areaType == 1) {
            return false
          } else if (this.areaType == 0) {
            this.getDataRequest(this.areaId, this.areaType)
          } else if (this.areaType == 1) {
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
        this.label = new BMap.Label(`<div class="ol-commu"><span class="ol-commu-name">${data_info[i].street}${data_info[i].houseNo}</span><i class="i-arr-down"></i></div>`, { offset: new BMap.Size(-22, -32) });// 创建文本标注对象
        this.map.addOverlay(marker);
        marker.setLabel(this.label);
        this.label.addEventListener("click", () => {
          if(this.infoBoxTemp){
            this.infoBoxTemp.close();
          }  
          let params = {
            houseId: data_info[i].houseId
          }
          this.$axiosGet(API.mainPage_getHouseDetail,params).then(res =>{
            if(res.data){
              let data_detail = {};
              data_detail = res.data;
              let content = `<div class="infoBoxContent">
              <h2 class="box-h2"><a href="/operate/query-manage-street/query-street-list/roomnum?organId=${data_detail.organId}&areaId=${data_detail.areaId}&street=${data_detail.street}&name=${this.ruleForm.organName}">${data_detail.street}</a>${data_detail.houseNo}
                <span>(${data_detail.houseAddress})</span>
              </h2>
              <div class="box-1">
                <div class="box-text f-pull-left">
                  <p>经营面积：${data_detail.area}㎡ <span>${data_detail.statusName}</span></p>
                  <p>当前租金：${data_detail.contractRental ? data_detail.contractRental + '元/年' : ''}</p>
                  <p>管理单位： <a href="/operate/query-manage/query-courtyard-list/roomnum?organId=${data_detail.organId}&areaId=${this.areaId}&organName=${data_detail.organName}&name=${this.ruleForm.organName}">${data_detail.organName}</a></p>
                  <p>取得方式：${data_detail.acquisitionModeName}</p>
                  <p>产权单位：${data_detail.propertyOrganName}</p>
                </div>
                <div class="box-img f-pull-right">
                   <img src=${data_detail.imgUrl ? data_detail.imgUrl : this.$store.state.imgPath.yldefault} style="width:250px; height:180px;" />
                </div>
                <div class="f-clearfix"></div>
              </div>
            </div>`;
              let infoBox = new BMapLib.InfoBox(this.map, content, {
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
              this.infoBoxTemp = infoBox;
              infoBox.open(marker);
            }         
          })       
     
          //开启信息窗口
        });
      }
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
  .el-radio-group {
    font-size: 14px;
    display: inline-block;
  }
  .m-breadcrumb {
    padding: 10px 0;
    .m-text {
      height: 40px;
      line-height: 40px;
    }
    .input-with-select {
      width: 400px;
    }
  }
  .f-inline-block {
    display: inline-block !important;
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
      line-height: 30px;
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
  .map-search {
    float: left;
    height: 40px;
    line-height: 40px;
    width: auto;
  }
  .operate {
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
        top: -4px !important;
        left: 18px;
      }
      .el-radio {
        margin-right: 10px;
      }
    }
  }
  .z-state {
    width: 60px;
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
    -webkit-appearance: none;
    -moz-appearance: none;
    -o-appearance: none;
    -ms-appearance: none;
    appearance: none;
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
        margin-bottom: 5px;
      }
    }
    .addr {
      overflow: hidden;
    }
  }
  .n-grey {
    color: #666 !important;
    margin-bottom: 10px;
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
      box-shadow: 3px 3px 4px rgba(0, 0, 0, 0.3);
      display: inline-block;
      color: #2f70ff;
      font-size: 14px;
     line-height:23px;
      font-weight: bold;
      padding: 4px 15px;
      min-width: 80px;
      text-align: center;
      background-color: #fff;
    }
    .i-arr-down {
      display: inline-block;
      width: 0;
      height: 0;
      position: absolute;
      top:30px;
      left: 21px;
      border-top: 8px solid #fff;
      border-left: 8px dashed transparent;
      border-right: 8px dashed transparent;
    }
  }
}
</style>
