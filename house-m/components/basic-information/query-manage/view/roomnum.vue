<template>
  <div>
    <div class="h-table">
      <div class="u-query-top f-clearfix f-relative">
        <div class="f-absolute imgUrl"><img v-show="imgurl.length === 0" :src="$store.state.imgPath.queryyl">
          <img v-show="imgurl.length > 0 && imgurl != null" :src="imgurl" width="427" height="300">
        </div>
        <div class="u-query-right">
          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th style="width: 120px">院落名称</th>
                <td style="width: 250px">{{courtyardName}} </td>
                <th>院落地址</th>
                <td>{{courtyardAddress}}
                </td>
              </tr>
              <tr>
                <th>使用单位</th>
                <td>
                  <a @click="roomDetailInfoClick(courtyardId,courtyardName)">{{useOrganNum || '0'}}家</a>
                </td>
                <th>使用人数</th>
                <td>{{usePersonNum || '0'}}人
                </td>
              </tr>
              <tr>
                <th>物业服务单位</th>
                <td>{{houseManageCompanyName}}
                </td>
                <th>物业类型</th>
                <td>{{houseManageTypeName}}
                </td>
              </tr>
              <tr>
                <th>合同物业费</th>
                <td>
                  <span v-show='contractCost !==null'>{{contractCost}} 元/年</span>
                </td>
                <th>负责人</th>
                <td>
                  {{responsiblePerson || ''}}
                </td>
              </tr>
              <tr>
                <th>负责人联系电话</th>
                <td>{{responsiblePersonPhone || ''}}
                </td>
                <th>服务开始时间</th>
                <td>{{serviceStartTime}}
                </td>
              </tr>
              <tr>
                <th>服务结束时间</th>
                <td>
                  {{serviceEndTime}}
                </td>
                <th>备注</th>
                <td>
                  {{remark}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
      <div class="u-query-top f-relative">
        <h2 class="u-query-h2">{{courtyardName}}-办公用房分配及处置情况</h2>
        <div class="u-grid-charttab">
          <el-radio-group v-model="activeName" @change="getSwitch" size="small">
            <el-radio-button label="数量">数量</el-radio-button>
            <el-radio-button label="面积">面积</el-radio-button>
          </el-radio-group>
        </div>
        <div id="Usedpie" name='num' style="position:absolute; width: 400px; height: 400px;">
        </div>
        <div class="u-query-right">

          <div class="h-tab-content">
            <table class="h-table-info">
              <tr>
                <th>房间状态</th>
                <th>房间数量（间）</th>
                <th>使用面积（㎡）</th>
                <th>建筑面积（㎡）</th>
              </tr>
              <tr v-for="(item,index) in roomStatusCountList" :key="index">
                <td align="center">
                  <a class="bjsdf" @click="typeDetailInfoClick(courtyardId,item.useStatusName,item.useStatus)">{{item.useStatusName}}</a>
                </td>
                <td align="center">
                  {{item.roomNum}}
                </td>
                <td align="center">
                  {{item.roomUseAreaSum}}
                </td>
                <td align="center">
                  {{item.roomBuildAreaSum}}
                </td>
              </tr>
            </table>
          </div>
        </div>
      </div>
    </div>
     <!-- 详情弹框 -->
    <v-room-detail ref="roomDetail"></v-room-detail>
    <!-- 办公用房使用弹框 -->
    <v-typeroom-detail ref="typeRoomDetail"></v-typeroom-detail>
  </div>
</template>
<script>
import roomDetail from '@/components/basic-information/query-manage/view/usage-detail'; // 办公用房使用情况弹出框
import typeRoomDetail from '@/components/basic-information/query-manage/view/type-room-detail'; // 详情弹出框
export default {
  components: {
    'v-room-detail': roomDetail,
    'v-typeroom-detail': typeRoomDetail
  },
  data() {
    let self = this;
    return {
      contractCost: '',//合同物业费
      courtyardName: '', //院落名称
      courtyardAddress: '', //院落地址
      houseManageCompanyName: '', //物业服务单位
      houseManageTypeName: '', //物业类型名称
      govermentBuy: '', //政府采购
      organType: '', //单位性质
      organTypeName: '', //单位性质名称
      responsiblePerson: '', //负责人
      responsiblePersonPhone: '', //负责人联系电话
      serviceStartTime: '', //服务开始时间
      serviceEndTime: '', //服务结束时间
      remark: '', //备注
      imgUrls: [], // 图片
      imgurl: '',
      useOrganNum: '', //单位数量
      usePersonNum: '', //人员数量
      useStatus: '', //房间状态
      roomBuildAreaSum: '', //面积
      roomUserAreaSum: '',
      activeName: '数量',
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      myChart1: {}, //车辆状态图表
      list: [],
      useStatusList: [],
      roomStatusCountList: [], //房间状态数量集合
      chatOptions: {
        title: [{
          text: '',
          textStyle: { 
            fontSize: 16 
          },
          top: 0,
          left: 10
        }],
        tooltip: {
          trigger: 'item',
          formatter: "{b},{d}%"
        },
        series: [{
          type: 'pie',
          center: ['50%', '50%'],
          radius: ['20%', '40%'],
          color: ['#66c33a', '#6bb0f7', '#a7b5e0', '#90b0a5', '#c3b98f', '#b19d9d', '#f66e6e', '#e7a33c'],
          data: [],
          itemStyle: {
            normal: {
              label: {
                show: true,
                formatter: '{b}: \n {d}%'
              }
            },
          },
        }]
      },
      roomNum: '0'
    };
  },
  computed: {
    courtyardId() {
      return this.$store.state.mainData.courtyardId;
    }
  },
  watch: {
    'courtyardId': function (val) {
      this.getRoomCount();
    }
  },
  activated() {  
    this.myChart1 = echarts.init(document.getElementById('Usedpie'));
    this.myChart1.setOption(this.chatOptions);
    this.init();
    if (this.$route.query.courtyardId) {
      this.$store.commit('courtyardIdMutations', this.$route.query.courtyardId);
    }else if(!this.$store.state.mainData.courtyardId){
      this.$store.commit('courtyardIdMutations', '');
    }
    // else{
    //   this.$store.dispatch('courtyardIdActions', '');
    // }
    this.getRoomCount();
  },
  mounted() {  
  
  },
  deactivated() {
  },
  methods: {
    init() {
      // 图表大小自适应
      setTimeout(() => {
        window.onresize = () => {
          this.myChart1.resize();
        };
      }, 500);
    },
    getSwitch() {
      this.getRoomCount();
    },
    // 获取图表数据
    getRoomCount() {
      let params = {
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.yardSearch2_table1Data, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data;
          this.list = list;

          this.contractCost = res.data.companyContractCost;
          this.courtyardName = res.data.name;
          this.courtyardAddress = res.data.address;
          this.houseManageCompanyName = res.data.companyName;
          this.houseManageTypeName = res.data.companyManageTypeName;
          this.organTypeName = res.data.companyOrganTypeName;
          this.responsiblePerson = res.data.responsiblePerson;
          this.useOrganNum = res.data.useOrganNum;
          this.usePersonNum = res.data.usePersonNum;
          this.responsiblePersonPhone = res.data.responsiblePersonPhone; //负责人联系电话
          this.govermentBuy = res.data.companyGovermentBuy; //政府采购
          this.remark = res.data.companyRemark; //备注


          res.data.serviceStartTime = res.data.serviceStartTime || '';
          res.data.serviceEndTime = res.data.serviceEndTime || '';
          this.serviceStartTime = res.data.serviceStartTime.substr(0, 10)||'';
          this.serviceEndTime = res.data.serviceEndTime.substr(0, 10)||'';

          this.imgUrls = res.data.fileResponseList||[];
          if (this.imgUrls.length > 0) {
            this.imgUrls.forEach((item, index) => {
              if (index === 0) {
                this.imgurl = item.url;
              }
            })
          } else {
            this.imgurl = '';
          }

          this.roomStatusCountList = res.data.roomStatusCountResponses;
          let roomUseList = [];
          let legend = ['已分配', '闲置', '已拆除', '已拍卖', '已出租', '已转换用途', '处置中', '调配中'];
          if (this.roomStatusCountList.length > 0) {
            if (this.activeName === '数量') {
              this.roomStatusCountList.forEach((item, index) => {
                if (item.useStatus === 'INUSE') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已分配`
                  })
                } else if (item.useStatus === 'IDLE') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `闲置`
                  })
                } else if (item.useStatus === 'REMOVED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已拆除`
                  })
                } else if (item.useStatus === 'AUCTIONED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已拍卖`
                  })
                } else if (item.useStatus === 'RENTED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已出租`
                  })
                } else if (item.useStatus === 'CONVERSIONPURPOSESED') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `已转换用途`
                  })
                } else if (item.useStatus === 'HANDLEING') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `处置中`
                  })
                } else if (item.useStatus === 'OFFICEHOUSEAPPLYING') {
                  roomUseList.push({
                    value: item.roomNum || '0',
                    name: `调配中`
                  })
                }
              })
            } else {
              this.roomStatusCountList.forEach((item, index) => {
                if (item.useStatus === 'INUSE') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `已分配`
                  })
                } else if (item.useStatus === 'IDLE') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `闲置`
                  })
                } else if (item.useStatus === 'REMOVED') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `已拆除`
                  })
                } else if (item.useStatus === 'AUCTIONED') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `已拍卖`
                  })
                } else if (item.useStatus === 'RENTED') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `已出租`
                  })
                } else if (item.useStatus === 'CONVERSIONPURPOSESED') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `已转换用途`
                  })
                } else if (item.useStatus === 'HANDLEING') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `处置中`
                  })
                } else if (item.useStatus === 'OFFICEHOUSEAPPLYING') {
                  roomUseList.push({
                    value: item.roomBuildAreaSum || '0',
                    name: `调配中`
                  })
                }
              })
            }
          }
          this.chatOptions.series[0].data = roomUseList || [];
          this.myChart1.setOption(this.chatOptions); //this.options为车辆状态的配置
        } else {
          this.roomStatusCountList = [];
          this.chatOptions.series[0].data = [];
          this.myChart1.clear();
        }
      })
    },

    // 详情
    roomDetailInfoClick(roomId) {
      this.$refs.roomDetail.openModal(roomId);
    },
    //图表 详情
    typeDetailInfoClick(id, name, useStatus) {
      this.$refs.typeRoomDetail.openModal(id, name, useStatus);
    }
  },
};
</script>
<style lang="scss" scoped>
.el-tooltip__popper {
  max-width: 80%;
}
.h-table {
  float: left;
}
.u-query-top {
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  border: 1px solid #e4e7eb;
  -webkit-box-shadow: 2px 2px 5px #d7d7d7;
  box-shadow: 2px 2px 5px #d7d7d7;
  .u-query-right {
    margin-left: 440px;
  }
}
.u-query-h2 {
  font-size: 16px;
  font-weight: bold;
  margin: 20px 0;
  text-align: center;
}
.imgUrl {
  img {
    width: 427px;
    height: 300px;
  }
}
.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 25px 0;
    .u-grid-tips {
      position: absolute;
      right: 10px;
      top: 10px;
    }
    .icon-gantanhao:before {
      color: #c0c4cc;
    }
    .u-query-icons {
      width: 60px;
      height: 64px;
      margin: 5px auto 0;
    }
    .u-query-txt {
      float: left;
    }
    .u-query-h2 {
      font-size: 38px;
    }
}
.u-grid-charttab {
  position: absolute;
  z-index: 5;
  left: 18%;
  top: 15%;
}
</style>
