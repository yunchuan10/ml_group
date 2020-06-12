<template>
  <div id="m-full-map">
    <section class="m-main">

      <div class="m-right">
        <div id="map-right">
          <div id="all-map" style="width: 100%;" :style="{ height: height + 'px' }"></div>
          <span class="all-map-font" :title="this.$store.state.mainData.organName">
            {{this.$store.state.mainData.organName}}
          </span>

          <!-- 车辆信息弹出框 -->
          <div v-if="dialogVisible" v-drag class="dialogVisible">
            <div class="u-title">
              <span>{{datas.carNo}}</span>
              <span class="f-right" @click="dialogVisible = false">X</span>
            </div>
            <div class="u-content">
              <el-tabs v-model="dialogVisibleTab" type="card">
                <el-tab-pane label="基本信息" name="essential">
                  <div class="f-content">
                    <div class="f-left">
                      <img :src="datas.imgUrl">
                    </div>
                    <div class="f-right">
                      <div class="f-text">
                        <div class="f-text-left">品牌型号</div>
                        <div class="f-text-right">{{datas.brand}}&ensp;{{datas.model}}</div>
                      </div>
                      <div class="f-text">
                        <div class="f-text-left">车&emsp;&emsp;型</div>
                        <div class="f-text-right">{{datas.carTypeName}}</div>
                      </div>
                      <div class="f-text">
                        <div class="f-text-left">颜&emsp;&emsp;色</div>
                        <div class="f-text-right">{{datas.color}}</div>
                      </div>
                      <div class="f-text">
                        <div class="f-text-left">车&emsp;&emsp;龄</div>
                        <div class="f-text-right">{{datas.carYears}}年</div>
                      </div>
                      <div class="f-text">
                        <div class="f-text-left">车&ensp;架&ensp;号</div>
                        <div class="f-text-right">{{datas.vin}}</div>
                      </div>
                      <div class="f-text">
                        <div class="f-text-left">所属单位</div>
                        <div class="f-text-right">{{datas.fromOrganName}}</div>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="状态信息" name="status">
                  <div class="m-status">
                    <div class="f-text">
                      <div class="f-text-left">定位时间</div>
                      <div class="f-text-right">{{dataType.time}}</div>
                    </div>
                    <div class="f-text">
                      <div class="f-text-left">当前位置</div>
                      <div class="f-text-right">{{dataType.location}}</div>
                    </div>
                    <div class="f-text">
                      <div class="f-text-left">行驶状态</div>
                      <div class="f-text-right">{{dataType.status}}</div>
                    </div>
                    <div class="f-text">
                      <div class="f-text-left">行驶方向</div>
                      <div class="f-text-right">{{dataType.direction}}</div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
            <div class="u-bottom">
              <el-button type="primary" class="f-but-blue" @click="trajectory(datas.carNo)">轨迹</el-button>
            </div>
          </div>
        </div>

      </div>

    </section>

  </div>
</template>



<script>
import Vue from 'vue';

export default {
  data() {
    return {
      height: 0, // 自定义屏幕高度
      setIntervalDatasRequest: undefined, // 定时获取车辆数据
      setIntervalDataType: undefined, // 定时获取车辆状态信息
      carInfo: [], // 车辆坐标数组
      Bmap: undefined, // 地图组件
      markers: undefined, // 车辆图标
      dialogVisible: false, // 弹出框
      dialogVisibleTab: 'essential', // 弹出框状态
      publicCarId: '', // 当前弹出框的车辆主键
      datas: {},// 弹出框基本信息
      dataType: {}, // 弹出框状态信息
      centerAndZoom: true // 定位状态
    };
  },
  activated() {
    document.title = this.$store.state.mainData.organName;
    this.publicCarId = '';
    this.height = window.innerHeight; // 设置高度自适应
    this.mapReady(); // 初始化地图
  },
  methods: {
    // 初始化地图
    mapReady() {
      this.Bmap = new BMap.Map('all-map', {
        enableMapClick: false
      });
      this.Bmap.centerAndZoom(this.$store.state.mainData.areaName, 10); // 初始化地图
      this.Bmap.enableScrollWheelZoom();
      // 添加带有定位的导航控件
      let navigationControl = new BMap.NavigationControl({
        anchor: BMAP_ANCHOR_TOP_RIGHT, // 靠右上角位置
        type: BMAP_NAVIGATION_CONTROL_LARGE, // LARGE类型
        enableGeolocation: true // 启用显示定位
      });
      // 添加控件
      this.Bmap.addControl(navigationControl);
      this.datasRequest(); // 获取车辆列表
    },
    // 获取车辆列表
    datasRequest() {
      let params = {
        carNo: '',
        rentOrganId: '',
        status: 'all'
      };
      this.$axiosPost(API.realTimeRefresh_leagueCarPositionList, params).then(res => {
        if (res.model.leagueCarList && res.model.leagueCarList.length > 0) {
          let item = [];
          let list = []
          for (let value of res.model.leagueCarList) {
            item = [];
            for (let val of value.carList) {
              item.push({
                id: val.carId,
                label: val.carNo,
                orderId: val.orderId,
                time: val.position.time,
                location: val.position.location,
                status: val.position.status,
                direction: val.position.direction,
                longitude: val.position.longitude,
                latitude: val.position.latitude
              })
            }
            list.push.apply(list, item);
          }
          this.newMap(list); // 地图车辆定位
        }
      });
    },
    // 地图车辆定位
    newMap(list) {
      if (list && list.length > 0) {
        this.carInfo = [];
        for (let value of list) {
          if (value.status !== '离线') {
            this.carInfo.push(value);
          }
        }
        if (this.centerAndZoom) {
          this.centerAndZoom = false;
          this.Bmap.centerAndZoom(new BMap.Point(this.carInfo[0].longitude, this.carInfo[0].latitude), 10);
        }
        if (this.markers) {
          this.markerClusterer.removeMarkers(this.markers);
        }
        let arr = [];
        let pointArray = [];
        let markers = [];
        let marker = '';
        let label = '';
        let myIcon = '';
        this.carInfo.forEach((value, i) => {
          marker = 'marker' + i;
          label = 'label' + i;
          myIcon = new BMap.Icon(this.carImgUrlFun(value, true), new BMap.Size(42, 42)); // 设置小车状态
          arr[label] = new BMap.Label(value.label, { offset: new BMap.Size(-45, -35) }); // 设置标签位置
          arr[label].setContent('<div class="car-label-type"><img src="' + (value.orderId ? this.$store.state.imgPath.greenround : this.$store.state.imgPath.redround) + '" /><span>' + value.label + '</span></div>')
          arr[label].setStyle({ boxShadow: '5px 3px 5px #888888' }); // 设置标签样式
          arr[label].setStyle({ border: 'none' }); // 设置标签样式
          arr[marker] = new BMap.Marker(new BMap.Point(value.longitude, value.latitude), { icon: myIcon }); // 设置小车位置
          arr[marker].setRotation(this.carImgUrlFun(value, false)); // 车辆方向
          arr[marker].setLabel(arr[label]);
          pointArray.push(new BMap.Point(value.longitude, value.latitude));
          markers.push(arr[marker]);
          arr[label].addEventListener('click', this.attributel); // 单击事件开启信息窗口
          arr[marker].addEventListener('click', this.attributel); // 单击事件开启信息窗口
        });
        // 点聚合
        this.markers = markers;
        this.markerClusterer = new BMapLib.MarkerClusterer(this.Bmap, { markers: markers });
      }
      // 定时获取车辆数据
      if (!this.setIntervalDatasRequest) {
        this.setIntervalDatasRequest = setInterval(() => {
          this.datasRequest();
        }, 10000);
      }
    },
    // 开启信息窗口
    attributel(e) {
      let name = '';
      if (e.currentTarget.content) {
        name = e.currentTarget.content.split('<span>')[1].split('</span>')[0];
      } else if (e.currentTarget.z.label.content) {
        name = e.currentTarget.z.label.content.split('<span>')[1].split('</span>')[0];
      }
      let carId = null;
      for (let i = 0; i < this.carInfo.length; i++) {
        if (name === this.carInfo[i].label) {
          carId = this.carInfo[i].id;
          break;
        }
      }
      if (carId) {
        this.$axiosPost(API.realTimeRefresh_findCarBaseInfo, { carId: carId }).then(res => {
          this.datas = res.model;
          this.dialogVisible = true;
        });
        for (let i = 0; i < this.carInfo.length; i++) {
          if (carId === this.carInfo[i].id) {
            this.dataType = {
              time: this.carInfo[i].time,
              location: this.carInfo[i].location,
              status: this.carInfo[i].status,
              direction: this.carInfo[i].direction
            }
            break;
          }
        }
        // 定时器获取状态信息
        let isDataType = false;
        let a = null;
        this.setIntervalDataType = setInterval(() => {
          isDataType = false;
          a = null;
          for (let i = 0; i < this.carInfo.length; i++) {
            if (carId === this.carInfo[i].id) {
              a = i;
              isDataType = true;
              break;
            }
          }
          if (isDataType) {
            this.dataType = {
              time: this.carInfo[a].time,
              location: this.carInfo[a].location,
              status: this.carInfo[a].status,
              direction: this.carInfo[a].direction
            }
          } else {
            this.dialogVisibleClose();
          }
        }, 10000);
        this.publicCarId = carId
      }
    },
    // 轨迹按钮
    trajectory(carno) {
      this.$router.push({
        path: `/car-manage/vehicle-state/vehicle-trajectory/${carno}`
      });
    },
    // 关闭车辆弹出框，清除状态信息定时器
    dialogVisibleClose() {
      this.dialogVisible = false;
      clearInterval(this.setIntervalDataType); // 清除定时器
      this.setIntervalDataType = undefined;
    },
    // 判断车辆状态，判断车辆方向
    carImgUrlFun(item, is) {
      let params = '';
      if (is) {
        // 判断车辆状态
        if (item.status === '行驶') {
          params = this.$store.state.imgPath.greencar;
        } else {
          params = this.$store.state.imgPath.redcar;
        }
      } else {
        // 判断车辆方向
        switch (item.direction) {
        case '东':
          params = '0';
          break;
        case '南':
          params = '90';
          break;
        case '西':
          params = '180';
          break;
        case '北':
          params = '270';
          break;
        case '东北':
          params = '315';
          break;
        case '西北':
          params = '225';
          break;
        case '东南':
          params = '45';
          break;
        case '西南':
          params = '135';
          break;
        }
      }
      return params;
    }
  }
}

// 自定义指令 - 拖拽弹出框
Vue.directive('drag', {
  bind: function (el, binding) {
    let oDiv = el; // 当前元素
    let self = this; // 上下文
    oDiv.onmousedown = function (e) {
      // 鼠标按下，计算当前元素距离可视区的距离
      e = e || window.event;
      e.preventDefault();
      let disX = e.clientX - oDiv.offsetLeft;
      let disY = e.clientY - oDiv.offsetTop;

      document.onmousemove = function (e) {
        // 通过事件委托，计算移动的距离
        e = e || window.event;
        e.preventDefault();
        let l = e.clientX - disX;
        let t = e.clientY - disY;
        // 移动当前元素
        oDiv.style.left = l + 'px';
        oDiv.style.top = t + 'px';
        // 将此时的位置传出去
        if (parseInt(oDiv.style.left) < 0) {
          oDiv.style.left = 0;
        }
        if (parseInt(oDiv.style.top) < 0) {
          oDiv.style.top = 0;
        }
        var obox = document.getElementById('map-right');
        if (parseInt(oDiv.style.left) > obox.clientWidth - oDiv.clientWidth) {
          oDiv.style.left = obox.clientWidth - oDiv.clientWidth + 'px';
        }
        if (parseInt(oDiv.style.top) > obox.clientHeight - oDiv.clientHeight) {
          oDiv.style.top = obox.clientHeight - oDiv.clientHeight + 'px';
        }
      };
      document.onmouseup = function (e) {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
});
</script>

<style lang="scss">
#m-full-map {
  .m-right {
    width: 100%;
    .all-map-font {
      position: absolute;
      color: red;
      cursor: pointer;
      font-size: 35px;
      font-weight: bold;
      right: 100px;
      text-align: right;
      text-shadow: 1px 2px 5px #888888;
      top: 6px;
      width: calc(100% - 100px);
    }
    #map-right {
      position: relative;
      .car-label-type {
        cursor: pointer;
        padding: 6px 12px;
        img {
          height: 10px;
          margin-right: 5px;
          width: 10px;
        }
        span {
          font-size: 14px;
        }
      }
      .dialogVisible {
        position: absolute;
        background-color: #ffffff;
        border: 1px solid #aaaaaa;
        border-radius: 6px;
        cursor: move;
        height: 345px;
        top: 0;
        width: 400px;
        .u-title {
          background-color: #eeeeee;
          border-radius: 6px;
          padding: 12px 15px;
          .f-right {
            cursor: pointer;
            float: right;
          }
        }
        .u-content {
          padding: 12px 15px;
          .el-tabs__item {
            background-color: #eeeeee;
          }
          .el-tabs__item.is-active {
            background-color: #ffffff;
          }
          .f-content {
            font-size: 14px;
            overflow: hidden;
            .f-left {
              float: left;
              img {
                margin-right: 15px;
                width: 100px;
              }
            }
            .f-right {
              float: left;
              width: calc(100% - 115px);
              .f-text {
                overflow: hidden;
                padding-top: 5px;
                .f-text-left {
                  float: left;
                  width: 70px;
                }
                .f-text-right {
                  float: left;
                  width: calc(100% - 70px);
                }
              }
            }
          }
        }
        .u-bottom {
          position: absolute;
          border-top: 1px solid #eeeeee;
          bottom: 0;
          padding: 8px 15px;
          text-align: right;
          width: calc(100% - 30px);
        }
        .m-status {
          font-size: 14px;
          .f-text {
            overflow: hidden;
            padding-top: 5px;
            .f-text-left {
              float: left;
              width: 70px;
            }
            .f-text-right {
              float: left;
              width: calc(100% - 70px);
            }
          }
        }
      }
    }
  }
}
</style>
