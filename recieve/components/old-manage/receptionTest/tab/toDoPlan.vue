<template>
  <div id="trip-update">
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="接待任务办理" :item="['接待子任务办理']"></Y-Breadcrumb>
        <!-- <el-button class="f-pull-right" style="background-color: #004EB4;color: #fff;padding: 8px 16px;" @click="cancelForm">返回</el-button> -->
      </div>

      <div class="reception-form" v-show="meeting">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>会议方案</h2>
            <h2 class="childPlanId">子方案号:{{subPlanNo}}</h2>
          </div>
          <el-form ref="meetingFormSubmit" :model="meetingFormSubmit" :rules="infoRules">
            <div>
              <table class="h-table-info">
                <tr id="planId">
                  <th>子方案号:</th>
                  <td colspan="3">{{subPlanNo}}</td>
                </tr>
                <tr>
                  <th>会议时间</th>
                  <td>{{meetingForm.startTime}}至{{meetingForm.endTime}}</td>
                  <th>会议密级</th>
                  <td>{{meetingForm.isSecrecy == 0 ? '保密':'非保密'}}</td>
                </tr>
                <tr>
                  <th>选择会议酒店</th>
                  <td>{{meetingForm.hotelName}}</td>
                  <th>会议室</th>
                  <td>{{meetingForm.roomName}}</td>
                </tr>
                <tr>
                  <th>与会人员</th>
                  <td colspan="3">{{meetingForm.attendPersons}}</td>
                </tr>
                <tr>
                  <th>会议设备</th>
                  <td>{{meetingForm.meetingEquip}}</td>
                  <th>会议服务</th>
                  <td>{{meetingForm.meetingServices}}</td>
                </tr>
                <div class="u-left-border-title todo">
                  <h3>方案办理</h3>
                </div>
                <tr>
                  <th><i class="f-color-red">*</i>选择会议室</th>
                  <td colspan="6">
                    <el-form-item prop="roomName" :rules='[{ required: true, message: "请输入会议室", trigger: "change" }]'>
                      <el-input v-model="meetingFormSubmit.roomName" placeholder="请输入会议室"></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th><i class="f-color-red">*</i>预定会议室时间</th>
                  <td colspan="6">
                    <el-form-item class="f-inline-block" prop="validTime">
                      <el-date-picker
                        v-model="meetingFormSubmit.roomStartTime"
                        type="datetime"
                        placeholder="请选择开始时间"
                      ></el-date-picker>
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker
                        v-model="meetingFormSubmit.roomEndTime"
                        type="datetime"
                        placeholder="请选择结束时间"
                      ></el-date-picker>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>安排会务人员</th>
                  <td colspan="6">
                    <el-form-item class="f-inline-block">
                      <el-input
                        v-model="meetingFormSubmit.serviceStaff"
                        placeholder="请输入姓名"
                        style="width:220px"
                      ></el-input>
                    </el-form-item>-
                    <el-form-item class="f-inline-block" prop="staffPhoneNo">
                      <el-input
                        v-model="meetingFormSubmit.staffPhoneNo"
                        placeholder="请输入手机号码"
                        style="width:220px"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelForm">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="meetingSubmit">保存</el-button>
          </div>
        </div>
      </div>

      <div class="reception-form" v-show="accommodation">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>住宿方案</h2>
            <h2 class="childPlanId">子方案号:{{subPlanNo}}</h2>
          </div>
          <el-form ref="liveFormSubmit" :model="liveFormSubmit" :rules="infoRules">
            <div>
              <table class="h-table-info">
                <tr id="planId">
                  <th>子方案号:</th>
                  <td colspan="3">{{subPlanNo}}</td>
                </tr>
                <tr>
                  <th>入住时间</th>
                  <td
                    colspan="1"
                  >{{this.$formatDate(liveForm.stayStartTime)}}至{{this.$formatDate(liveForm.stayEndTime)}}</td>
                  <th>入住酒店</th>
                  <td>{{liveForm.hotelName}}</td>
                </tr>
                <tr>
                  <th>入住房型</th>
                  <td v-if="liveForm.roomType == 0">套间</td>
                  <td v-if="liveForm.roomType == 1">标准间</td>
                  <td v-if="liveForm.roomType == 2">单间</td>
                  <th>备注</th>
                  <td>{{liveForm.remark}}</td>
                </tr>
                <tr>
                  <th>入住人员</th>
                  <td colspan="3">{{liveForm.roomPersons}}</td>
                </tr>
                <div class="u-left-border-title todo">
                  <h3 class="title">方案办理</h3>
                </div>
                <tr>
                  <th style="width = 100%;"><i class="f-color-red">*</i>选择房间</th>
                  <td>
                    <div class="form-options">
                      <div class="f-input-width">
                        <el-form-item prop="roomName" :rules='[{ required: true, message: "请输入房间号", trigger: "change" }]'>
                          <el-input v-model="liveFormSubmit.roomName" placeholder="请输入房间号"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </td>
                  <th><i class="f-color-red">*</i>入住时间</th>
                  <td>
                    <el-form-item class="f-inline-block" prop="validTime1">
                      <el-date-picker
                        v-model="liveFormSubmit.stayStartTime"
                        type="datetime"
                        placeholder="请选择开始时间"
                      ></el-date-picker>
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker
                        v-model="liveFormSubmit.stayEndTime"
                        type="datetime"
                        placeholder="请选择结束时间"
                      ></el-date-picker>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelForm">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="accommodationSubmit">办理</el-button>
          </div>
        </div>
      </div>

      <div class="reception-form" v-show="meals">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>用餐方案</h2>
            <h2 class="childPlanId">子方案号:{{subPlanNo}}</h2>
          </div>
          <el-form ref="mealsFormSubmit" :model="mealsFormSubmit" :rules="infoRules">
            <div>
              <table class="h-table-info">
                <tr id="planId">
                  <th>子方案号:</th>
                  <td colspan="3">{{mealsForm.subPlanNo}}</td>
                </tr>
                <tr>
                  <th width="100%">用餐时间</th>
                  <td>
                    {{this.$formatDate(mealsForm.mealsStartTime)}}
                    <span style="margin: 0 10px;"></span>
                    {{mealsForm.mealsTimesType== 0?'早餐':mealsForm.mealsTimesType== 1?'中餐':'晚餐'}}
                  </td>
                  <th>用餐酒店</th>
                  <td>{{mealsForm.hotelName}}</td>
                </tr>
                <tr>
                  <th>用餐餐厅</th>
                  <td>{{mealsForm.diningName}}</td>
                  <th>用餐类型</th>
                  <td>{{mealsForm.mealsType}}</td>
                </tr>
                <tr>
                  <th>用餐人员</th>
                  <td colspan="3">{{mealsForm.mealsPersons}}</td>
                </tr>
                <tr>
                  <th>用餐人数</th>
                  <td>{{mealsForm.mealsPersonNum}}</td>
                  <th>陪餐人员</th>
                  <td>{{mealsForm.accompanyPersons}}</td>
                </tr>
                <tr>
                  <th>陪餐人数</th>
                  <td>{{mealsForm.accompanyPersonNum}}</td>
                  <th>联系人</th>
                  <td>{{mealsForm.linkMan}}</td>
                </tr>
                <tr>
                  <th>备注</th>
                  <td colspan="3">{{mealsForm.remark}}</td>
                </tr>
                <div class="u-left-border-title todo">
                  <h3>方案办理</h3>
                </div>
                <tr>
                  <th><i class="f-color-red">*</i>选择餐厅</th>
                  <td>
                    <el-form-item prop="diningName">
                      <el-input v-model="mealsFormSubmit.diningName" placeholder="请输入餐厅"></el-input>
                    </el-form-item>
                  </td>
                  <th><i class="f-color-red">*</i>用餐开始时间</th>
                  <td>
                    <div class="form-options" style="justify-content: left;">
                      <el-form-item prop="mealsStartTime" class="f-inline-block">
                        <el-date-picker
                          v-model="mealsFormSubmit.mealsStartTime"
                          type="datetime"
                          placeholder="请选择开始时间"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item  class="f-inline-block">
                        <div class="f-radio-group-width" style="width:300px;float:left">
                          <el-radio-group v-model="mealsFormSubmit.mealsTimesType">
                            <el-radio v-for="(item, index) in mealsTimesTypeList" :key="index" :label="item.value">{{item.name}}</el-radio>
                          </el-radio-group>
                        </div>
                      </el-form-item>
                    </div>
                  </td>
                </tr>
                <!-- <tr>
                  <th>
                    用餐人数
                  </th>
                  <td colspan="3">
                    <el-form-item :rules="mealsRules.mealsPersonNum">
                      <el-input v-model="mealsFormSubmit.mealsPersonNum" placeholder="请输入用餐人数"></el-input>
                    </el-form-item>
                  </td>
                </tr>-->
              </table>
            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelForm">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="mealsSubmit">办理</el-button>
          </div>
        </div>
      </div>
      <div class="reception-form" v-show="car">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="u-left-border-title">
            <h2>用车办理</h2>
            <h2 class="childPlanId">子方案号:{{subPlanNo}}</h2>
          </div>
          <el-form ref="infoFormSubmit" :model="infoFormSubmit" :rules="infoRules">
            <div>
              <table class="h-table-info">
                <tr id="planId">
                  <th>子方案号:</th>
                  <td colspan="3">{{infoForm.subPlanNo}}</td>
                </tr>
                <tr>
                  <th width="100%">车辆要求</th>
                  <td>{{infoForm.carRequire}}</td>
                  <th>联系人</th>
                  <td>{{infoForm.linkMan}}</td>
                </tr>
                <tr>
                  <th>用车时间</th>
                  <td>{{this.$formatDate(infoForm.useStartTime)}}至{{this.$formatDate(infoForm.useEndTime)}}</td>
                  <th>用车范围</th>
                  <td v-if="infoForm.useRangeType == 0">市区/县区</td>
                  <td v-if="infoForm.useRangeType == 1">市内</td>
                  <td v-if="infoForm.useRangeType == 2">省内</td>
                  <td v-if="infoForm.useRangeType == 3">省外</td>
                </tr>
                <tr>
                  <th>随车人员</th>
                  <td colspan="3">{{infoForm.followPersons}}</td>
                </tr>
                <div class="u-left-border-title todo">
                  <h3>方案办理</h3>
                </div>
                <tr>
                  <th>
                    <i class="f-color-red">*</i>驾驶员
                  </th>
                  <td>
                    <div class="el-form-item" style="display: inline-block;">
                      <div class="el-form-item__content form-inline-block">
                        <el-form-item prop="driver">
                          <el-input
                            placeholder="请输入姓名"
                            v-model="infoFormSubmit.driver"
                           
                          ></el-input>
                        </el-form-item>
                      
                    <span style="margin: 0 5px;">-</span>
                    <el-form-item prop="driverPhoneNo">
                      <el-input
                        placeholder="请输入手机号"
                        v-model="infoFormSubmit.driverPhoneNo"
                        style="diplay: inline-block;"
                      ></el-input>
                    </el-form-item>
                    </div>
                    </div>
                  </td>

                  <th>
                    <i class="f-color-red">*</i>车牌号
                  </th>
                  <td>
                    <el-form-item prop="license">
                      <el-input
                        placeholder="请输入车牌号"
                        v-model="infoFormSubmit.license"
                        style="diplay: inline-block;width:220px;"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>备注</th>
                  <td colspan="3">
                    <el-form-item>
                      <el-input
                        placeholder="请输入备注"
                        v-model="infoFormSubmit.remark"
                        style="diplay: inline-block;
                        width:800px"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelForm">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="carSubmit">办理</el-button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
let mealsOpt = {
  "mealsTimesType": "",
}
export default {
  data() {
    let areaName = (rule, value, callback) => {
      if (value.length > 0) {
        callback();
      } else {
        callback(new Error("接待地区不能为空"));
      }
    };
    let validTime = (rule, value, callback) => {
      if (!this.meetingFormSubmit.roomStartTime) {
        callback(new Error("会议开始时间不能为空"));
      } else if (!this.meetingFormSubmit.roomEndTime) {
        callback(new Error("会议结束时间不能为空"));
      } else {
        let start =
          new Date(this.meetingFormSubmit.roomStartTime).getTime() * 1;
        let end = new Date(this.meetingFormSubmit.roomEndTime).getTime() * 1;
        if (start > end) {
          callback(new Error("结束时间不得早于开始时间"));
        } else {
          callback();
        }
      }
    };
    let validTime1 = (rule, value, callback) => {
      if (!this.liveFormSubmit.stayStartTime) {
        callback(new Error("入住开始时间不能为空"));
      } else if (!this.liveFormSubmit.stayEndTime) {
        callback(new Error("入住结束时间不能为空"));
      } else {
        let start = new Date(this.liveFormSubmit.stayStartTime).getTime() * 1;
        let end = new Date(this.liveFormSubmit.stayEndTime).getTime() * 1;
        if (start > end) {
          callback(new Error("结束时间不得早于开始时间"));
        } else {
          callback();
        }
      }
    };
    let validTime2 = (rule, value, callback) => {
      if (!this.mealsFormSubmit.mealsStartTime) {
        callback(new Error("用餐开始时间不能为空"));
      }
    };
    return {
      pageActive: 0,
      dialogVisible: false,
      meeting: false,
      accommodation: false,
      meals: false,
      car: false,
      subPlanNo: "", //子方案号
      planSubId: "", //回显查询子方案id
      mealsTimesTypeList: [],//餐次类型
      props: { key: "id", label: "label" },
      data: [
        {
          label: "人员1",
          id: "1"
        },
        {
          label: "人员2",
          id: "2"
        },
        {
          label: "人员3",
          id: "3"
        }
      ],

      mealsForm: {}, //用餐方案上面回显数据
      mealsFormSubmit: {
        //用餐方案办理提交数据
        diningName: "", //选择餐厅
        mealsStartTime: "", //用餐开始时间
        mealsTimesType:''//餐次
      },
      infoForm: {}, //用车方案上面回显数据
      infoFormSubmit: {
        //用车方案办理提交数据
        driver: "", //驾驶员姓名
        driverPhoneNo: "", //驾驶员手机号
        license: "", //车牌号
        remark: "" //备注
      },
      meetingForm: {}, //会议方案上面回显数据
      meetingFormSubmit: {
        //会议方案提交办理的数据
        roomName: "", //会议室
        roomStartTime: "", //会议开始时间
        roomEndTime: "", //会议结束时间
        serviceStaff: "", //会务人员
        staffPhoneNo: "" //会务人员手机号
      },
      liveForm: {}, //住宿方案办理回显数据
      liveFormSubmit: {
        //住宿方案办理提交
        roomName: "", //房间号
        stayStartTime: "", //住宿开始时间
        stayEndTime: "" //住宿结束时间
      },

      infoRules: {
        //表单验证
        validTime: [
          { validator: validTime, trigger: "change", required: true }
        ],
        validTime1: [
          { validator: validTime1, trigger: "change", required: true }
        ],
        driverPhoneNo: [
          {
            pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的电话",
            trigger: "change"
          },
          { required: true, message: "请输入电话号码", trigger: "change" }
        ],
        staffPhoneNo: [
          {
            pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/,
            message: "请输入正确的电话",
            trigger: "change"
          }
        ],
        roomName: [
          { required: true, message: "请输入会议室", trigger: "change" }
        ],
        roomName1: [
          { required: true, message: "请选择房间", trigger: "change" }
        ],
        diningName: [
          { required: true, message: "请输入餐厅", trigger: "change" }
        ],
        mealsStartTime: [
          { required: true, message: "请输入用餐开始时间", trigger: "change" }
        ],
        license: [
          { required: true, message: "请输入车牌号", trigger: "change" }
        ],
        driver: [{ required: true, message: "请输入驾驶员", trigger: "change" }]
      },
      meetingRules: {
        meetingStartTime: [
          { required: true, message: "会议开始时间不能为空", trigger: "change" }
        ],
        meetingEndTime: [
          { required: true, message: "会议结束时间不能为空", trigger: "change" }
        ],
        conferenceLevel: [
          { required: true, message: "会议级别不能为空", trigger: "change" }
        ],
        Level: [
          { required: true, message: "会议酒店不能为空", trigger: "change" }
        ],
        whether: [
          { required: true, message: "请选择会议室", trigger: "change" }
        ],
        conferenceRoom: [
          { required: true, message: "请选择会议室", trigger: "change" }
        ],
        meetingHotel: [
          {
            required: true,
            message: "请选择会议酒店",
            trigger: "change"
          }
        ]
      },

      liveRules: {
        meetingStartTime: [
          { required: true, message: "预计开始时间不能为空", trigger: "change" }
        ],
        meetingEndTime: [
          { required: true, message: "预计结束时间不能为空", trigger: "change" }
        ],
        hotel: [
          { required: true, message: "入住酒店不能为空", trigger: "change" }
        ],
        apartment: [
          { required: true, message: "入住房型不能为空", trigger: "change" }
        ],
        staff: [{ required: true, message: "请输入入住人员", trigger: "blur" }]
      },
      mealsRules: {
        mealsStartTime: [
          { required: true, message: "开始时间不能为空", trigger: "change" }
        ],
        diningChoice: [
          { required: true, message: "用餐不能为空", trigger: "change" }
        ],
        selectHotel: [
          { required: true, message: "酒店不能为空", trigger: "change" }
        ],
        mealsTypes: [
          { required: true, message: "请选择用餐类型", trigger: "change" }
        ],
        choiceRestaurant: [
          { required: true, message: "请选择餐厅", trigger: "change" }
        ],
        dinersNum: [
          { required: true, message: "用餐人数不能为空", trigger: "change" }
        ],
        accompanyingNum: [
          { required: true, message: "陪餐人数不能为空", trigger: "change" }
        ],
        comeName: [
          { required: true, message: "来访人姓名不能为空", trigger: "change" }
        ],
        comePost: [
          { required: true, message: "来访服务能为空", trigger: "change" }
        ],
        comeNo: [
          { required: true, message: "来访人手机号不能为空", trigger: "change" }
        ]
      }
    };
  },
  mounted() {},
  activated() {
    this.accommodation = false;
    this.meeting = false;
    this.meals = false;
    this.car = false;
    this.subPlanNo = this.$route.query.subPlanNo;
    this.planSubId = this.$route.query.planSubId;
    if (this.$route.query.planType == 1) {
      //住宿办理
      this.accommodation = true;
      this.getaccommodationData();
    } else if (this.$route.query.planType == 3) {
      //会议办理
      this.meeting = true;
      this.getMeetingData();
    } else if (this.$route.query.planType == 0) {
      //用车办理
      this.car = true;
      this.getCarData();
    } else {
      this.meals = true;
      this.getMealsData();
    }
    this.getDlist();  // 获取用餐类型
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    // 获取房间类型字典
    getDlist(){
      let code = '/D05,D06';
      this.$axiosGet(API.sysDicItem_getItemList+code).then(res => {
        if(res && res.data){
          this.mealsTimesTypeList = res.data.D05||[];
          this.mealsTypeList = res.data.D06||[];
        }
      });
    },
    //用餐办理回显数据
    getMealsData() {
      this.$axiosGet(API.planMeals + "/" + this.planSubId).then(res => {
        this.mealsForm = res.data;
      });
    },
    //用车办理回显数据
    getCarData() {
      this.$axiosGet(API.planCars + "/" + this.planSubId).then(res => {
        this.infoForm = res.data;
        this.infoForm.jsonPerson = JSON.parse(this.infoForm.jsonPerson);
      });
    },
    //会议办理回显数据
    getMeetingData() {
      this.$axiosGet(API.planMeetings + "/" + this.planSubId).then(res => {
        this.meetingForm = res.data;
        this.meetingForm.jsonPerson = JSON.parse(this.meetingForm.jsonPerson);
      });
    },
    //住宿办理回显数据
    getaccommodationData() {
      this.$axiosGet(API.planAccommodation_echo + "/" + this.planSubId).then(
        res => {
          this.liveForm = res.data;
        }
      );
    },
    determine() {
      this.dialogVisible = false;
    },
    transfer() {
      this.dialogVisible = true;
    },
    // 点击取消
    cancelForm() {
      this.mealsFormSubmit = {};
      this.infoFormSubmit = {};
      this.meetingFormSubmit = {};
      this.liveFormSubmit = {};
      this.$router.go(-1);
    },
    //会议方案保存提交
    meetingSubmit() {
      this.meetingForm.roomName = this.meetingFormSubmit.roomName;
      this.meetingForm.roomStartTime = this.$formatDate(
        this.meetingFormSubmit.roomStartTime
      );
      this.meetingForm.roomEndTime = this.$formatDate(
        this.meetingFormSubmit.roomEndTime
      );
      this.meetingForm.serviceStaff = this.meetingFormSubmit.serviceStaff;
      this.meetingForm.staffPhoneNo = this.meetingFormSubmit.staffPhoneNo;
      this.meetingForm.state = 3;
      this.meetingForm.planNo = this.$route.query.planNo;
      this.$refs.meetingFormSubmit.validate(valid => {
        if (valid) {
          this.$axiosJsonPost(
            API.planMeetings_updatePlanMeetings,
            this.meetingForm
          ).then(res => {
            if (res.status == 200) {
              this.$message.success("办理成功");
              this.mealsForm = {};
              this.$router.go(-1);
              this.meetingFormSubmit = {};
            } else {
              this.$message.warning("办理失败,");
            }
          });
        }
      });
    },
    //住宿方案保存提交
    accommodationSubmit() {
      // this.liveForm.roomName = this.liveFormSubmit.roomName;
      // this.liveForm.stayStartTime = this.$formatDate(
      //   this.liveFormSubmit.stayStartTime
      // );
      // this.liveForm.stayEndTime = this.$formatDate(
      //   this.liveFormSubmit.stayEndTime
      // );
      // this.liveForm.planNo = this.$route.query.planNo;
      this.$refs.liveFormSubmit.validate(valid => {
        if (valid) {
          let pagrm = {
            id: this.liveForm.id,
            stayEndTime: this.$formatDate(this.liveFormSubmit.stayEndTime),
            stayStartTime: this.$formatDate(this.liveFormSubmit.stayStartTime),
            roomName: this.liveFormSubmit.roomName,
            planSubId: this.liveForm.planSubId,
            planNo: this.$route.query.planNo,
            state: 3
          };
          console.log(this.liveForm, pagrm);
          this.$axiosJsonPost(
            API.planAccommodation_handlePlanAccommodation,
            pagrm
          ).then(res => {
            if (res.status == 200) {
              this.$message.success("办理成功");
              this.mealsForm = {};
              this.$router.go(-1);
              this.liveFormSubmit = {};
            } else {
              this.$message.warning("办理失败,请输入房间号或联系管理员");
            }
          });
        }
      });
    },
    //用餐方案保存提交
    mealsSubmit() {
      // this.mealsForm.diningName = this.mealsFormSubmit.diningName;
      // this.mealsForm.mealsStartTime = this.$formatDate(
      //   this.mealsFormSubmit.mealsStartTime
      // );
      // this.mealsForm.mealsPersonNum = this.mealsFormSubmit.mealsPersonNum;
      // this.mealsForm.state = 3;
      // this.mealsForm.planId = this.$route.query.planId;
      // this.mealsForm.planNo = this.$route.query.planNo;
      // this.mealsForm.jsonAccompanyPerson = JSON.parse(this.mealsForm.jsonAccompanyPerson)
      // this.mealsForm.jsonMealsPerson = JSON.parse(this.mealsForm.jsonMealsPerson )
      this.$refs.mealsFormSubmit.validate(valid => {
        if (valid) {
          let pagrm = {
            id: this.mealsForm.id,
            planSubId: this.mealsForm.planSubId,
            diningName: this.mealsFormSubmit.diningName,
            mealsStartTime: this.$formatDate(
              this.mealsFormSubmit.mealsStartTime
            ),
            planNo: this.$route.query.planNo,
            mealsTimesType:this.mealsFormSubmit.mealsTimesType
          };
          this.$axiosJsonPut(API.planMeals_handlePlanMeals, pagrm).then(res => {
            if (res.status == 200) {
              this.$message.success("办理成功");
              this.mealsForm = {};
              this.$router.go(-1);
              this.mealsFormSubmit = {};
            } else {
              this.$message.warning("办理失败,请输入用餐酒店");
            }
          });
        }
      });
    },
    //用车方案保存提交
    carSubmit() {
      // this.infoForm.driver = this.infoFormSubmit.driver;
      // this.infoForm.driverPhoneNo = this.infoFormSubmit.driverPhoneNo;
      // this.infoForm.license = this.infoFormSubmit.license;
      // this.infoForm.remark = this.infoFormSubmit.remark;
      // this.infoForm.state = 3;
      // this.infoForm.planNo = this.$route.query.planNo;
      // this.infoForm.useStartTime = this.$formatDate(this.infoForm.useStartTime);
      // this.infoForm.useEndTime = this.$formatDate(this.infoForm.useEndTime);

      this.$refs.infoFormSubmit.validate(valid => {
        if (valid) {
          let pagrm = {
            id: this.infoForm.id,
            planSubId: this.infoForm.planSubId,
            license: this.infoFormSubmit.license,
            driver: this.infoFormSubmit.driver,
            driverPhoneNo: this.infoFormSubmit.driverPhoneNo,
            remark: this.infoFormSubmit.remark,
            planNo: this.$route.query.planNo
          };
          console.log(this.infoForm);
          this.$axiosJsonPut(API.planCars_handlePlanCar, pagrm).then(res => {
            if (res.status == 200) {
              this.$message.success("办理成功");
              this.infoForm = {};
              this.$router.go(-1);
              this.infoFormSubmit = {};
            } else {
              this.$message.warning("办理失败");
            }
          });
        }
      });
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.go(-1);
      }
    },
    // 会议点击上一步
    appoveClick() {
      this.$router.go(-1);
    },
    //住宿点击上一步
    appoveThreeClick() {
      this.pageActive = 0;
    },
    mealsClick() {
      this.pageActive = 1;
    }
  }
};
</script>

<style lang="scss" scoped>
#trip-update {
  .main-height {
    height: calc(100% - 35px);
  }
  .form-options {
    display: flex;
    justify-content: space-between;
    .f-radio-group-width {
      margin: 0 28px;
      width: 220px;
    }
    .f-input-width {
      // width: 680px;
      width: 100%;
    }
    .f-input-tow-width {
      margin-left: 20px;
      width: 550px;
    }
  }
  .h-tab-content {
    .h-table-info {
      td {
        width: 500px;
      }
    }
  }
}
.title {
  margin: 0 auto;
}
.childPlanId {
  position: absolute;
  right: 2%;
}
.todo {
  margin-top: 10 px;
}
  .el-form-item {
        display: inline-block;
      }
    .form-options{
      justify-content:left
    }
</style>
