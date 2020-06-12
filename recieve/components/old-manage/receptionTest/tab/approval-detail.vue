<template>
  <div>
    <el-dialog
      custom-class="m-detail-dialog m-car-detail"
      append-to-body
      @close="pageSelect == 'basic'"
      :show-close="false"
      width="950px"
      :visible.sync="carDetailShow"
    >
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>
      <div class="u-detail-dialog-content" style="padding-bottom:20px;">
        <p class="u-detail-p">申请单号：{{orderNo}}</p>
        <p class="u-detail-p">申请提交时间：{{createdAt}}</p>
        <!--  tab切换 -->
        <ul class="house-nav-tab">
          <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
            <a>基础信息</a>
          </li>
          <li @click="pageSelect = 'plan'" :class="{'active':pageSelect=='plan'}">
            <a>任务办理</a>
          </li>
          <li @click="pageSelect = 'history'" :class="{'active':pageSelect=='history'}">
            <a>历史记录</a>
          </li>
        </ul>
        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr class="basic">
              <th class="f-text-right">到访时间</th>
              <td>{{tableDate.VisitingTime}}</td>
              <th class="f-text-right">来访类型</th>
              <td>{{tableDate.VisitingType}}</td>
            </tr>
            <tr>
              <th class="f-text-right">接待级别</th>
              <td>{{tableDate.ReceptionLevel}}</td>
              <th class="f-text-right">相关附件</th>
              <td>
                <a>文件01</a>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">来访单位</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr>
                    <td>单位名称:</td>
                    <td>单位联系人:</td>
                  </tr>
                  <tr v-for="(item,index) in tableDate.VisitingUnitList" :key="index">
                    <td>{{item.dutyName}}</td>
                    <td>{{item.contactPerson}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">主宾信息</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr v-for="(item,index) in tableDate.masterInfo" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.dutyName}}</td>
                    <td>{{item.position}}</td>
                    <td>{{item.leval}}</td>
                    <td>{{item.sex}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">来宾名单</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr v-for="(item,index) in tableDate.guestInfo" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.dutyName}}</td>
                    <td>{{item.position}}</td>
                    <td>{{item.leval}}</td>
                    <td>{{item.sex}}</td>
                    <td>{{item.tel}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">接待单位</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr>
                    <td>单位名称:</td>
                    <td>单位联系人:</td>
                  </tr>
                  <tr v-for="(item,index) in tableDate.serveUnitList" :key="index">
                    <td>{{item.dutyName}}</td>
                    <td>{{item.contactPerson}}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">陪同人员名单</th>
              <td colspan="3" class="padding0">
                <table class="u-td-table">
                  <tr v-for="(item,index) in tableDate.accompanyList" :key="index">
                    <td>{{item.name}}</td>
                    <td>{{item.dutyName}}</td>
                    <td>{{item.position}}</td>
                    <td>{{item.leval}}</td>
                    <td>{{item.sex}}</td>
                    <td>{{item.tel}}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='plan'">
          <h3 class="title">会议方案</h3>
          <table
            class="h-table-info plan"
            v-for="(item,index) in tableDate.meetingPlan"
            :key="index+1"
          >
            <tr>会议{{index+1}}</tr>
            <tr>
              <th class="f-text-right">会议时间</th>
              <td>{{item.meetingTime}}</td>
              <th class="f-text-right">会议级别</th>
              <td>{{item.meetingLeaval}}</td>
            </tr>
            <tr>
              <th class="f-text-right">会议酒店</th>
              <td>{{item.meetingHotel}}</td>
              <th class="f-text-right">会议室</th>
              <td>{{item.meetingRoom}}</td>
            </tr>
            <tr>
              <th class="f-text-right">与会人员</th>
              <td colspan="3">{{item.people}}</td>
            </tr>
            <tr>
              <th class="f-text-right">会议设备</th>
              <td>{{item.equipment}}</td>
              <th class="f-text-right">会议服务</th>
              <td>{{item.service}}</td>
            </tr>
          </table>
          <h4 class="status">未办理</h4>
          <h3 class="title">住宿方案</h3>
          <table
            class="h-table-info plan"
            v-for="(item,index) in tableDate.accommodationPlan"
            :key="index+2"
          >
            <tr>房间{{index+1}}</tr>
            <tr>
              <th class="f-text-right">入住时间</th>
              <td colspan="1">{{item.checkinTime}}</td>
              <th class="f-text-right">入住酒店</th>
              <td>{{item.checkinHotel}}</td>
            </tr>
            <tr>
              <th class="f-text-right">入住房型</th>
              <td>{{item.roomType}}</td>
              <th class="f-text-right">入住人员</th>
              <td colspan="3">{{item.checkinPeople}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{item.remark}}</td>
            </tr>
          </table>
          <h4 class="status">未办理</h4>
          <h3 class="title">用餐方案</h3>
          <table
            class="h-table-info plan"
            v-for="(item,index) in tableDate.mealsPlan"
            :key="index+3"
          >
            <tr>用餐安排{{index+1}}</tr>
            <tr>
              <th class="f-text-right" width="100%">用餐时间</th>
              <td>{{item.mealsTime}}</td>
              <th class="f-text-right">用餐酒店</th>
              <td>{{item.mealsHotel}}</td>
            </tr>
            <tr>
              <th class="f-text-right">用餐餐厅</th>
              <td>{{item.mealsRoom}}</td>
              <th class="f-text-right">用餐类型</th>
              <td>{{item.mealsType}}</td>
            </tr>
            <tr>
              <th class="f-text-right">用餐人员</th>
              <td colspan="3">{{item.mealsPeople}}</td>
            </tr>
            <tr>
              <th class="f-text-right">用餐人数</th>
              <td>{{item.mealsPeopleNum}}</td>
              <th class="f-text-right">陪餐人员</th>
              <td>{{item.companyPeople}}</td>
            </tr>
            <tr>
              <th class="f-text-right">陪餐人数</th>
              <td>{{item.companyPeopleNum}}</td>
              <th class="f-text-right">联系人</th>
              <td>{{item.contactPeople}}</td>
            </tr>
            <tr>
              <th class="f-text-right">备注</th>
              <td colspan="3">{{item.remark}}</td>
            </tr>
          </table>
          <h4 class="status">未办理</h4>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='history'">
          <el-timeline>
            <el-timeline-item
              v-for="(item, index) in tableDate.commontHis"
              :key="index"
              :timestamp="returnDataFormat(item.createTime)"
              placement="top"
            >
              <el-card class="history">
                <span
                  class="z-state"
                  :class="item.flowLabel?'s-state-apply':'s-state-fail'"
                >{{item.flowLabel?item.flowLabel:'待审批'}}</span>
                <div style="margin-top:30px">
                  <span>提交人：{{item.submitName}}</span>
                  <span>接受人：{{item.receiveName}}</span>
                  <span>状态：{{item.status}}</span>
                </div>

               
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      pageSelect: "basic",
      orderNo: "", // 订单号
      createdAt: "", // 创建时间
      organTypeName: "", // 单位类别
      organName: "", // 单位名称
      checkUserNum: "", //批复人数
      officeCheckArea: "", //核定办公用房面积
      serviceCheckArea: "", //服务设备用房面积
      equipCheckArea: "", //设备用房面积核定
      affiliatedCheckArea: "", //附属用房面积核定
      formkey: "", //调配方案
      remark: "", //备注
      planType: "", //配置类型
      fileUrls: [], //附件集合
      organAddressList: [], //地址集合
      hasOfficeArea: "", //原办公用房面积
      dutiesLevelResponseList: [], //人数统计集合
      applyArea: "", //拟申请调配办公用房面积
      applyReason: "", // 申请原因
      allCommontHis: [],

      allFile: [],
      statuslevel: 1,
      allocatePlan: {},
      roomBaseResponseList: [],
      tableDate: {
        //表格数据
        VisitingTime: "2020年4月5日至2020年4月9日", //来访时间
        VisitingType: "指导检查", //来访类型
        ReceptionLevel: "一级接待", //接待级别
        VisitingUnitList: [
          //来访单位
          {
            dutyName: "国家税务总局", //来访单位名称
            contactPerson: " 蒋寅飞    办公室科员   13812345678" //来访单位联系人
          },
          {
            dutyName: "国家税务总局",
            contactPerson: " 蒋云飞    办公室科员   13812345678"
          }
        ],
        masterInfo: [
          //主宾信息
          {
            name: "曹操",
            dutyName: "国家税务局",
            position: "国家税务局副局长",
            leval: "正部级",
            sex: "男"
          },
          {
            name: "关羽",
            dutyName: "国家税务局",
            position: "国家税务局局长",
            leval: "省部级",
            sex: "男"
          }
        ],
        guestInfo: [
          //来宾信息
          {
            name: "关羽",
            dutyName: "国家税务局",
            position: "国家税务局局长",
            leval: "省部级",
            sex: "男",
            tel: 15555606770
          },
          {
            name: "刘备",
            dutyName: "国家税务局",
            position: "国家税务局局长",
            leval: "省部级",
            sex: "男",
            tel: 15555606770
          }
        ],
        serveUnitList: [
          //接待单位
          {
            dutyName: "安徽省管局", //接待单位名称
            contactPerson: " 蒋寅飞    办公室科员   13812345678" //接待单位联系人
          },
          {
            dutyName: "稻香楼宾馆",
            contactPerson: " 蒋云飞    办公室科员   13812345678"
          }
        ],
        accompanyList: [
          //陪同人员信息名单
          {
            name: "关羽",
            dutyName: "国家税务局",
            position: "国家税务局局长",
            leval: "省部级",
            sex: "男",
            tel: 15555606770
          },
          {
            name: "关羽",
            dutyName: "国家税务局",
            position: "国家税务局局长",
            leval: "省部级",
            sex: "男",
            tel: 15555606770
          }
        ],
        meetingPlan: [
          {
            //会议方案数据
            meetingTime: "2020年4月5日18：00-2020年4月5日20：00", //会议时间
            meetingLeaval: "省级  非保密", //会议级别
            meetingHotel: "稻香楼", //会议酒店
            meetingRoom: "1号会议室", //会议室
            people: " 曹操、曹丕、曹植、司马懿、孙权、周瑜", //与会人员
            equipment: "空调、投影仪、话筒、会标", //会议设备
            service: "毛巾、茶叶、开水、纸杯、席卡" //会务服务
          }
        ],
        accommodationPlan: [
          {
            //住宿方案数据
            checkinTime: "2020年4月5日至2020年4月10日", //入住时间
            checkinHotel: "稻香楼", //入住酒店
            roomType: "套间", //入住房型
            checkinPeople: "曹操", //入住人员
            remark:
              "请保持房间干净、整洁，全时段不要打扰；如有相关要求，会通过座机联系前台" //备注
          }
        ],
        mealsPlan: [
          {
            mealsTime: "2020年4月5日18：00晚餐", //用餐时间
            mealsHotel: "稻香楼", //用餐酒店
            mealsRoom: "黄山厅", //用餐餐厅
            mealsType: "桌餐", //用餐类型
            mealsPeople: "曹操、曹丕、曹植、司马懿、夏侯惇、许诸", //用餐人员
            mealsPeopleNum: "6", //用餐人数
            companyPeople: "孙权、周瑜", //陪餐人员
            companyPeopleNum: "2", //陪餐人数
            contactPeople: "张飞", //联系人
            remark: "自备两瓶82年拉菲，提前安排醒酒" //备注
          }
        ],
        commontHis: [
          {
            submitName: "管理员099",//提交人
            receiveName:'李逵',//发起人
            createTime: "2020-05-27 09:26:06",//创建时间戳
            flowLabel: "制定方案",//历史记录名称
            status:'已提交'//状态
          }
        ]
      }
    };
  },
  activated() {},
  computed: {
    //基本核定面积
    basicArea() {
      let num = 0;
      num = parseFloat(
        Number(this.officeCheckArea) +
          Number(this.serviceCheckArea) +
          Number(this.equipCheckArea)
      ).toFixed(2);
      return num;
    },
    totalArea() {
      let num = 0;
      num = parseFloat(
        this.basicArea / 0.65 + Number(this.affiliatedCheckArea)
      );
      return num;
    }
  },
  methods: {
    returnDataFormat(value) {
      if (value) {
        return `${value.substr(0, 4)}/${value.substr(5, 2)}/${value.substr(
          8,
          2
        )}`;
      } else {
        return "";
      }
    },
    // 初始化弹出框
    openModal(id, formkey) {
      this.carDetailShow = true;
      this.formkey = formkey;
      this.pageSelect = "basic";
      //   this.getDataRequest(id)
    }
    // getDataRequest(id) {
    //   let params = {
    //     id: id,
    //   }
    //   this.$axiosGet(API.officeapply_getDetail, params).then(res => {
    //     if (res.data) {
    //       this.organName = res.data.applyOrderDetail.organName;
    //       this.hasOfficeArea = res.data.applyOrderDetail.hasOfficeArea;
    //       this.organTypeName = res.data.applyOrderDetail.organTypeName || '';
    //       this.organAddressList = res.data.applyOrderDetail.organAddressList;
    //       this.dutiesLevelResponseList = res.data.applyOrderDetail.dutiesLevelResponseList;
    //       this.dutyCheckNum = 0;
    //       this.dutyRealNum = 0;
    //       this.dutiesLevelResponseList.forEach((item, index) => {
    //         this.dutyCheckNum += Number(item.dutyCheckNum);
    //         this.dutyRealNum += Number(item.dutyRealNum);
    //       })
    //       this.statuslevel = Number(res.data.applyOrderDetail.status + 1);
    //       this.applyArea = res.data.applyOrderDetail.applyArea;
    //       this.applyReason = res.data.applyOrderDetail.applyReason;
    //       this.commontHis = res.data.commontHis;
    //       this.allCommontHis = res.data.allCommontHis;
    //       this.allFile = res.data.allFile;
    //       this.orderNo = res.data.applyOrderDetail.orderNo;
    //       this.createdAt = res.data.applyOrderDetail.createdAt.substr(0, 10);
    //       if (res.data.allocatePlan) {
    //         this.allocatePlan = res.data.allocatePlan;
    //         this.organName = this.allocatePlan.organName;
    //         this.checkUserNum = this.allocatePlan.checkUserNum;
    //         this.officeCheckArea = this.allocatePlan.officeCheckArea || '0';
    //         this.serviceCheckArea = this.allocatePlan.serviceCheckArea || '0';
    //         this.equipCheckArea = this.allocatePlan.equipCheckArea || '0';
    //         this.affiliatedCheckArea = this.allocatePlan.affiliatedCheckArea || '0';
    //         this.planType = this.allocatePlan.planType;
    //         this.remark = this.allocatePlan.remark;
    //         this.fileUrls = this.allocatePlan.fileResponse;
    //         this.roomBaseResponseList = res.data.allocatePlan.allocatePlanDetailResponseList;
    //       } else {
    //         this.allocatePlan = {
    //           checkArea: '',
    //           planType: '',
    //           planOfficeAddress: '',
    //           remark: ''
    //         }
    //         this.roomBaseResponseList = [];
    //       }
    //     }
    //   })
    // }
  }
};
</script>
<style lang="scss" scoped>
.title {
  margin: 0 auto;
  text-align: center;
}
.status {
  margin-bottom: 20px;
  text-align: center;
}
</style>

