<template>
  <div id="trip-update">
    <section class="m-main" :class="pageActive == '2'?'main-height':''">
      <!--导航-->
      <div class="m-breadcrumb">
        <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
          <span class="re-info fl">资源信息</span>
          <span class="re-space fl"></span>
          <el-breadcrumb-item>资源管理</el-breadcrumb-item>
          <el-breadcrumb-item>资源信息</el-breadcrumb-item>
        </el-breadcrumb> -->
        <Y-Breadcrumb :title="title" :item="titleArr"></Y-Breadcrumb>
        <el-button class="f-pull-right" style="background-color: #004EB4;color: #fff;padding: 8px 16px;" @click="cancelForm">返回</el-button>
      </div>
      <div class="el-steps-item">
        <el-steps v-if="this.$route.params.type !== 'detail'" :active="pageActive" finish-status="success" align-center>
          <el-step title="接待信息"></el-step>
          <el-step title="接待行程"></el-step>
        </el-steps>
      </div>
      <div class="reception-form" v-show="pageActive =='1'">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <el-form ref="infoForm" :model="infoForm" :rules="infoRules">
            <div class="u-left-border-title">接待信息</div>
            <table class="h-table-info">
              <tr>
                <th><i class="f-color-red">*</i>方案名称</th>
                <td colspan="3">
                  <el-form-item prop="receptionLetterName">
                    <el-input v-model="infoForm.receptionLetterName" :disabled="this.$route.params.type=='edit'?true:false" placeholder="请输入方案名称"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <!-- <tr>
                <th><i class="f-color-red">*</i>公函号</th>
                <td colspan="3">
                  <el-form-item prop="letterNumber">
                    <el-input :disabled="this.$route.params.type=='edit'?true:false" v-model="infoForm.letterNumber" placeholder="请输入公函号"></el-input>
                  </el-form-item>
                </td>
              </tr> -->
              <tr>
                <th><i class="f-color-red">*</i>派出单位</th>
                <td colspan="3">
                  <el-form-item prop="dispatchedOrgan">
                    <el-input v-model="infoForm.dispatchedOrgan" placeholder="请输入派出单位"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>来访类型</th>
                <td colspan="3">
                  <el-form-item>
                    <el-radio-group v-model="infoForm.visitingType">
                      <el-radio label="出席会议">出席会议</el-radio>
                      <el-radio label="考察调研">考察调研</el-radio>
                      <el-radio label="执行任务">执行任务</el-radio>
                      <el-radio label="学习交流">学习交流</el-radio>
                      <el-radio label="检查指导">检查指导</el-radio>
                      <el-radio label="请示汇报工作">请示汇报工作</el-radio>
                      <el-radio label="其他公务活动">其他公务活动</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>派出单位联系人</th>
                <td colspan="3">
                  <el-form-item prop="sendOrganUser">
                    <!-- <el-select placeholder="请选择姓名" v-model="infoForm.sendOrganUser.name"></el-select> -->
                    <el-input placeholder="请输入姓名" v-model="infoForm.sendOrganUser.dispatchedOrganLinkmanName" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <!-- <el-select placeholder="请选择科室" v-model="infoForm.sendOrganUser.dept"></el-select> -->
                    <el-input placeholder="请输入职务" v-model="infoForm.sendOrganUser.dispatchedOrganLinkmanDuty" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <!-- <el-select placeholder="请选择电话" v-model="infoForm.sendOrganUser.phone"></el-select> -->
                    <el-input placeholder="请输入手机号" v-model="infoForm.sendOrganUser.dispatchedOrganLinkmanTel" style="diplay: inline-block;width:220px;"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <!-- <tr>
                <th><i class="f-color-red">*</i>到访人员</th>
                <td colspan="3">
                  <el-form-item style="margin:5px 0;" v-for="(visitUser, index) in infoForm.visitUserList" :key="index" :prop="'visitUserList.' + index + '.userName'" :rules="{required: true, message: '姓名不能为空', trigger: 'change'}">
                    <el-input placeholder="请输入姓名" v-model="visitUser.userName" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <el-input placeholder="请输入性别" v-model="visitUser.userSex" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <el-input placeholder="请输入职务" v-model="visitUser.userJob" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <el-input placeholder="请输入手机号" v-model="visitUser.userTel" style="diplay: inline-block;width:220px;"></el-input>
                    <a v-if="index == 0" style="margin-left: 10px;" class="iconfont icon-tianjia" @click="addDomain"></a>
                    <a v-if="index !== 0" style="margin-left: 10px;" class="iconfont icon-circle-remove" @click.prevent="removeDomain(visitUser)"></a>
                  </el-form-item>
                </td>
              </tr> -->
              <tr>
                <th><i class="f-color-red">*</i>到访时间</th>
                <td colspan="3">
                  <el-form-item prop="startEndTime">
                    <el-date-picker v-model="infoForm.visitingStartTime" :picker-options="pickerBeginDateBefore" type="datetime" placeholder="请选择开始时间"></el-date-picker>
                    <span style="margin: 0 5px;">-</span>
                    <el-date-picker v-model="infoForm.visitingEndTime" :picker-options="pickerBeginDateAfter" type="datetime" placeholder="请选择结束时间"></el-date-picker>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>到访人数</th>
                <td>
                  <el-form-item prop="visitingCount">
                    <el-input v-model="infoForm.visitingCount" placeholder="请输入到访人数"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>到访时长（h）</th>
                <td>
                  <el-form-item prop="visitingDuring">
                    <el-input v-model="infoForm.visitingDuring" placeholder="请输入到访时长" @focus="timeBlur"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>接待单位联系人</th>
                <td colspan="3">
                  <el-form-item prop="acceptOrganUser">
                    <!-- <el-select v-model="infoForm.acceptOrganUser.name" placeholder="请选择姓名"></el-select> -->
                    <el-input placeholder="请输入姓名" v-model="infoForm.acceptOrganUser.receptionOrganLinkmanName" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <!-- <el-select v-model="infoForm.acceptOrganUser.dept" placeholder="请选择科室"></el-select> -->
                    <el-input placeholder="请输入职务" v-model="infoForm.acceptOrganUser.receptionOrganLinkmanDuty" style="diplay: inline-block;width:220px;"></el-input>
                    <span style="margin: 0 5px;">-</span>
                    <!-- <el-select v-model="infoForm.acceptOrganUser.phone" placeholder="请选择电话"></el-select> -->
                    <el-input placeholder="请输入手机号" v-model="infoForm.acceptOrganUser.receptionOrganLinkmanTel" style="diplay: inline-block;width:220px;"></el-input>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>接待级别</th>
                <td colspan="3">
                  <el-form-item prop="receptionLevel">
                    <!-- <el-input v-model="infoForm.acceptLevel" placeholder="根据来访单位级别和来访人员级别自行确定"></el-input> -->
                    <el-radio-group v-model="infoForm.receptionLevel">
                      <el-radio label="A">A</el-radio>
                      <el-radio label="B">B</el-radio>
                      <el-radio label="C">C</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>是否涉密</th>
                <td colspan="3">
                  <el-form-item>
                    <el-radio-group v-model="infoForm.booleanSecret">
                      <el-radio label="YES">是</el-radio>
                      <el-radio label="NO">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </td>
              </tr>
              <tr>
                <th>公函附件</th>
                <td colspan="3">
                  <span class="upload-file el-button" @click="openUploadFile">
                    <img class="img-upload" :src="$store.state.imgPath.picUpload">
                    <span class="h-upload-btn">上传附件</span>
                  </span>
                  <!-- 显示上传文件 -->
                  <ul style="margin-left:20px;display:inline-block;">
                    <li v-for="(item, index) in fileListData" :key="index">
                      <span style="margin-right: 20px;">{{item.title}}</span>
                      <a @click="deleteFile(index)">删除</a>
                    </li>
                  </ul>
                </td>
              </tr>
              <tr>
                <th><i class="f-color-red">*</i>备注</th>
                <td colspan="3">
                  <el-form-item prop="remark">
                    <el-input type="textarea" v-model="infoForm.remark" placeholder="请输入备注"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table>
            <!-- <div class="u-left-border-title" style="margin-top: 20px;">接待信息</div>
            <table class="h-table-info">
              <tr>
                <th><i class="f-color-red">*</i>接待单位</th>
                <td colspan="3">
                  <el-form-item prop="acceptOrganName">
                    <el-input v-model="infoForm.acceptOrganName" placeholder="请输入接待单位"></el-input>
                  </el-form-item>
                </td>
              </tr>
            </table> -->
          </el-form>
          <div class="f-text-center" style="margin-top: 15px;">
            <el-button class="u-submit-btn cancel-btn" @click="cancelForm">取消</el-button>
            <el-button class="u-submit-btn submit-btn" @click="nextClick">下一步</el-button>
          </div>
        </div>
      </div>
      <!-- 第二页 -->
      <div class="u-trip" v-show="pageActive =='2'?true:false">
        <div class="u-trip-form" v-if="pageActive =='2' && this.$route.params.type !== 'detail'">
          <!-- <el-form label-position="right" label-width="80px" ref="tripNameForm" :model="tripNameForm">
            <el-form-item label="行程名称" prop="name" :rules="{required: true, message: '行程名称不能为空', trigger: 'change'}">
              <el-input v-model="tripNameForm.name" placeholder="请输入行程名称"></el-input>
            </el-form-item>
          </el-form> -->
          <el-form label-position="right" label-width="80px" ref="tripForm" :model="tripForm" :rules="tripRiles">
            <div class="u-left-border-title">行程编辑</div>
            <el-form-item label="地区" prop="areaName">
              <!-- <el-input v-model="tripForm.areaName" placeholder="请输入地区"></el-input> -->
              <el-cascader @change="getAreaPointData" clearable v-model="tripForm.areaName" style="width:100%;" :options="areaOptions" change-on-select :props="defaultParams" placeholder="请输入地区"></el-cascader>
            </el-form-item>
            <el-form-item label="到访地点" prop="acceptAreaName">
              <!-- <el-input v-model="tripForm.acceptAreaName" placeholder="请输入接待地点"></el-input> -->
              <el-select v-model="tripForm.acceptAreaName" clearable filterable placeholder="请选择" style="width:100%;" @change="pointLngLat(areaPointList)">
                <el-option v-for="item in areaPointList" :key="item.id" :label="item.name" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="到访时间" prop="receptionTime">
              <el-date-picker v-model="tripForm.receptionTime" type="datetime" placeholder="选择时间" style="width:100%;"></el-date-picker>
            </el-form-item>
            <el-form-item label="到访人数">
              <el-input type="input" v-model="tripForm.visitingCount" placeholder="请输入到访人数"></el-input>
            </el-form-item>
            <el-form-item label="到访类型" prop="visitingType">
              <el-radio-group v-model="tripForm.visitingType">
                <el-radio label="WORK">工作</el-radio>
                <el-radio label="MEETING">会议</el-radio>
                <el-radio label="EAT">用餐</el-radio>
                <el-radio label="SLEEP">住宿</el-radio>
              </el-radio-group>

              <!-- <el-select v-model="tripForm.type" placeholder="请选择" style="width:48%;" @change="receptionType">
                <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select>

              <el-select v-if="tripForm.type == '餐饮'" v-model="tripForm.typeOther" placeholder="请选择" style="width:48%;margin-left:4%;">
                <el-option v-for="item in optionsFood" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select>

              <el-select v-if="tripForm.type == '其他'" v-model="tripForm.typeOther" placeholder="请选择" style="width:48%;margin-left:4%;">
                <el-option v-for="item in optionsOther" :key="item.value" :label="item.label" :value="item.label">
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="随行人员">
              <el-input type="input" v-model="tripForm.visitingPerson" placeholder="请输入随行人员"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input type="textarea" v-model="tripForm.remark" placeholder="请输入备注信息"></el-input>
            </el-form-item>
          </el-form>
          <div class="f-text-right" style="margin-top: 20px;">
            <el-button class="u-submit-btn submit-btn" @click="scheduleAdd">添加</el-button>
          </div>
          <!-- <a @click="addPoint">增加点</a>
          <a @click="deletePoint">删除点</a> -->
          <div class="schedule-add-btn-wrap">
            <div class="schedule-add-wrap" v-if="scheduleListAdd.length > 0">
              <div class="schedule-list" v-for="(item, index) in scheduleListAdd" :key="index">
                <i class="iconfont icon-guanbi schedule-close" @click="iconClose(index)"></i>
                <div style="font-weight:bold;">时间：{{item.receptionTime}}</div>
                <div>到访地点：{{item.areaName}}</div>
                <div>到访事项：{{item.visitingTypeDesc}}</div>
                <div>到访人数：{{item.visitingCount}}</div>
                <div>随行人员：{{item.visitingPerson}}</div>
                <div>备注：{{item.remark}}</div>
              </div>

            </div>
            <div class="f-text-center" style="margin-top: 20px;">
              <el-button class="u-submit-btn cancel-btn" @click="appoveClick">上一步</el-button>
              <el-button class="u-submit-btn submit-btn" @click="submitClick">提交</el-button>
            </div>
          </div>

        </div>

        <div class="u-trip-form u-trip-detail" v-if="pageActive =='2' && this.$route.params.type == 'detail'">
          <div class="trip-detail-btn" @click="tripDetailClick">详情</div>
          <div style="height:600px;padding: 15px 10px;overflow-y: auto;">
            <div class="trip-detail-wrap" v-for="(item, index) in scheduleListAdd" :key="index">
              <span class="trip-circle"></span>
              <div class="trip-time">{{item.receptionTime}}</div>
              <div>{{item.visitingTypeDesc}}</div>
              <div class="trip-address">{{item.areaName}}</div>
            </div>
          </div>
        </div>
        <div class="u-trip-map">
          <div id="allmap" style="height: 100%;width: 100%;"></div>
        </div>
      </div>
    </section>
    <!-- 详情弹出框 -->
    <trip-detail ref="tripDetail"></trip-detail>
    <!-- 上传文件 -->
    <v-popup-upload ref="popupUpload" @vueUpload="getFileList" :max="fileMax" allMax="5" maxSize="10" :accept="uploadType"></v-popup-upload>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import tripDetail from "@/components/trip-manage/trip-detail";
import popupUpload from "@/assembly/vue-popup-upload";
import { setTimeout } from 'timers';
export default {
  components: {
    'trip-detail': tripDetail,
    'v-popup-upload': popupUpload
  },
  data() {
    let self = this;
    let sendOrganUser = (rule, value, callback) => {
      if (this.infoForm.sendOrganUser.dispatchedOrganLinkmanName) {
        if (this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel && (!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel)))) {
          callback(new Error('手机号码格式有误'))
        }
        callback()
      } else {
        if (this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel && (!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel)))) {
          callback(new Error('手机号码格式有误'))
        }
        callback(new Error('派出单位联系人姓名不能为空'))
      }
    };
    // let visitUserList = (rule, value, callback) => {
    //   if (this.infoForm.visitUserList.userName) {
    //     callback()
    //   } else {
    //     callback(new Error('到访人员姓名不能为空'))
    //   }
    // };
    let validTime = (rule, value, callback) => { // 开始，结束时间验证
      if (this.infoForm.visitingStartTime && this.infoForm.visitingEndTime) {
        callback();
      } else {
        callback(new Error('到访时间不能为空'));
      }
    };
    let acceptOrganUser = (rule, value, callback) => {
      if (this.infoForm.acceptOrganUser.receptionOrganLinkmanName) {
        if (this.infoForm.acceptOrganUser.receptionOrganLinkmanTel && (!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.infoForm.acceptOrganUser.receptionOrganLinkmanTel)))) {
          callback(new Error('手机号码格式有误'))
        }
        callback()
      } else {
        if (this.infoForm.acceptOrganUser.receptionOrganLinkmanTel && (!(/^1(3|4|5|7|8|9)\d{9}$/.test(this.infoForm.acceptOrganUser.receptionOrganLinkmanTel)))) {
          callback(new Error('手机号码格式有误'))
        }
        callback(new Error('接待单位联系人姓名不能为空'))
      }
    };
    // let validReception = (rule, value, callback) => {
    //   if (this.tripForm.visitingType == '住宿' && this.tripForm.visitingType) {
    //     callback()
    //   } else if (this.tripForm.type !== '住宿' && this.tripForm.type && this.tripForm.typeOther) {
    //     callback()
    //   } else {
    //     callback(new Error('接待类型不能为空'))
    //   }
    // };
    let areaName = (rule, value, callback) => {
      if (value.length > 0) {
        callback()
      } else {
        callback(new Error('接待地区不能为空'))
      }
    };
    return {
      title: '新增行程',
      titleArr: ['新增行程'],
      fileMax: 1, // 上传附件上限
      uploadType: 'jpg/jpeg/png/xls/doc/docx/xlsx/pdf', // 上传文件格式
      YPromptShow: false,
      isBol: false,
      message: '',
      scheduleDetail: [],
      Bmap: null,
      pageActive: 1,
      areaOptions: [], // 地区
      defaultParams: {
        value: 'areaId',
        label: 'areaName'
      },
      point: { lng: 116.408757, lat: 39.995704 },
      pointLng: '',
      pointLat: '',
      pointList: [],
      scheduleList: [], // 添加行程
      scheduleListAdd: [],
      areaPointList: [], // 接待点数据
      visitingOptions: [
        {
          value: 'WORK',
          label: '工作'
        },
        {
          value: 'MEETING',
          label: '会议'
        },
        {
          value: 'EAT',
          label: '用餐'
        },
        {
          value: 'SLEEP',
          label: '住宿'
        }
      ],
      // optionsType: [
      //   {
      //     value: 'food',
      //     label: '餐饮'
      //   }, {
      //     value: 'accommodation',
      //     label: '住宿'
      //   }, {
      //     value: 'other',
      //     label: '其他'
      //   }
      // ],
      // optionsFood: [
      //   {
      //     value: '01',
      //     label: '早餐'
      //   }, {
      //     value: '02',
      //     label: '午餐'
      //   }, {
      //     value: '03',
      //     label: '晚餐'
      //   }
      // ],
      // optionsOther: [
      //   {
      //     value: '21',
      //     label: '会议'
      //   }, {
      //     value: '22',
      //     label: '视察'
      //   }, {
      //     value: '23',
      //     label: '交流'
      //   }
      // ],
      infoForm: {
        receptionLetterId: '', //方案id
        receptionLetterName: '', // 方案名称
        dispatchedOrgan: '', // 派出单位名称
        sendOrganUser: { // 派出单位联系人
          dispatchedOrganLinkmanName: '', // 姓名
          dispatchedOrganLinkmanDuty: '', // 职务
          dispatchedOrganLinkmanTel: '' // 联系方式
        },
        // visitUserList: [ // 到访人员
        //   {
        //     userName: '', // 姓名
        //     userSex: '', // 性别
        //     userJob: '', // 职务
        //     userTel: '' // 联系方式  
        //   }
        // ],
        visitingCount: '', // 到访人员总数
        visitingStartTime: '', // 到访开始时间
        visitingEndTime: '', // 到访结束时间
        startEndTime: 'time', // 到访时间
        visitingDuring: '', // 到访时长
        remark: '', // 备注
        fileList: [],
        acceptOrganName: '', // 接收单位
        acceptOrganUser: {
          receptionOrganLinkmanName: '', // 姓名
          receptionOrganLinkmanDuty: '', // 职务
          receptionOrganLinkmanTel: '' // 联系方式  
        },
        receptionLevel: 'A', //接待级别
        booleanSecret: 'YES', // 是否涉密
        visitingType: '出席会议' // 来访类型
      },
      pickerBeginDateBefore: {
        disabledDate: (time) => {
          if (this.infoForm.visitingEndTime) {
            return time.getTime() > new Date(this.infoForm.visitingEndTime.toLocaleDateString()).getTime();
          } else {
            // return time.getTime() < (Date.now() - 24 * 3600 * 1000);
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: (time) => {
          if (this.infoForm.visitingStartTime) {
            return time.getTime() < new Date(this.infoForm.visitingStartTime.toLocaleDateString()).getTime();
          } else {
            // return time.getTime() < (Date.now() - 24 * 3600 * 1000);
          }
        }
      },
      infoRules: {
        receptionLetterName: [
          { required: true, message: '方案名称不能为空', trigger: 'change' }
        ],
        dispatchedOrgan: [
          { required: true, message: '派出单位不能为空', trigger: 'change' }
        ],
        sendOrganUser: [
          { required: true, validator: sendOrganUser, trigger: 'change' }
        ],
        // visitUserList: [
        //   { required: true, validator: visitUserList, trigger: 'change' }
        // ],
        startEndTime: [
          { required: true, message: '到访时间不能为空', trigger: 'change' },
          { validator: validTime, trigger: 'change' }
        ],
        visitingCount: [
          { required: true, message: '到访人数不能为空', trigger: 'change' }
        ],
        visitingDuring: [
          { required: true, message: '来访时长不能为空', trigger: 'change' }
        ],
        acceptOrganName: [
          { required: true, message: '接待单位不能为空', trigger: 'change' }
        ],
        acceptOrganUser: [
          { required: true, validator: acceptOrganUser, trigger: 'change' }
        ],
        receptionLevel: [
          { required: true, message: '接待级别不能为空', trigger: 'change' }
        ]
      },
      tripForm: {
        areaName: [], //  地区
        acceptAreaName: '', // 接待地点
        receptionTime: '', // 到访时间
        visitingCount: '',//到访人数
        visitingType: 'WORK', // 到访类型
        visitingPerson: '', //随行人员
        remark: '' // 备注
      },
      tripNameForm: {
        name: ''// 行程名称
      },
      tripRiles: {
        areaName: [
          { required: true, validator: areaName, trigger: 'change' }
        ],
        acceptAreaName: [
          { required: true, message: '接待地点不能为空', trigger: 'change' }
        ],
        receptionTime: [
          { required: true, message: '到访时间不能为空', trigger: 'change' }
        ],
        visitingType: [
          { required: true, message: '到访类型不能为空', trigger: 'change' }
        ]
      },
      fileListData: []
    }
  },
  mounted() {

  },
  activated() {
    this.pageActive = 1;
    this.pointList = [];
    this.clearForm();

    if (this.$route.params.type == 'add') {
      this.title = '新增行程';
      this.titleArr = ['新增行程'];
    } else if (this.$route.params.type == 'detail') {
      this.pageActive = 2;
      this.mapReady();
      this.title = '行程预览';
      this.titleArr = ['行程预览'];
    } else if (this.$route.params.type == 'edit') {
      this.title = '编辑行程';
      this.titleArr = ['编辑行程'];
    }
    // this.getAreaPointData();
    this.getAreaData();
  },
  methods: {
    // 接待时长
    timeBlur() {
      if (this.infoForm.visitingStartTime && this.infoForm.visitingEndTime) {
        let begin = DATE.dateReturnYMDHMS(this.infoForm.visitingStartTime) || this.infoForm.visitingStartTime;
        let end = DATE.dateReturnYMDHMS(this.infoForm.visitingEndTime) || this.infoForm.visitingEndTime;
        let beginEnd = new Date(end).getTime() - new Date(begin).getTime();
        this.infoForm.visitingDuring = (beginEnd / (1000 * 60 * 60)).toFixed(1);
      }
    },
    // 清空表单
    clearForm() {
      // this.infoForm.visitUserList = [ // 到访人员
      //   {
      //     userName: '', // 姓名
      //     userSex: '', // 性别
      //     userJob: '', // 职务
      //     userTel: '' // 联系方式  
      //   }
      // ];
      this.infoForm.sendOrganUser.dispatchedOrganLinkmanName = ''; // 姓名
      this.infoForm.sendOrganUser.dispatchedOrganLinkmanDuty = ''; // 职务
      this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel = ''; // 联系方式
      this.infoForm.acceptOrganUser.receptionOrganLinkmanName = ''; // 姓名
      this.infoForm.acceptOrganUser.receptionOrganLinkmanDuty = ''; // 职务
      this.infoForm.acceptOrganUser.receptionOrganLinkmanTel = ''; // 联系方式
      this.infoForm.visitingType = '出席会议';
      this.fileListData = [];
      this.infoForm.visitingStartTime = '';
      this.infoForm.visitingEndTime = '';
      this.tripForm.remark = '';
      this.$refs.infoForm.resetFields();
      this.scheduleListAdd = [];
      this.infoForm.receptionLetterId = '';
    },
    // 上传后回调上传数据
    getFileList(data) {
      data.forEach((item, index) => {
        this.fileListData.push({
          title: `${item.name}.${item.suffixName}`,
          path: item.url,
          size: item.size,
        })
      })
      this.fileMax = 5 - this.fileListData.length;
    },
    // 点击上传文件
    openUploadFile() {
      this.$refs.popupUpload.openModal();
    },
    // 删除文件
    deleteFile(index) {
      this.fileListData.splice(index, 1)
    },
    // 点击取消
    cancelForm() {
      this.clearForm();
      this.$router.go(-1);
    },
    // // 移除
    // removeDomain(item) {
    //   var index = this.infoForm.visitUserList.indexOf(item)
    //   if (index !== -1) {
    //     this.infoForm.visitUserList.splice(index, 1)
    //   }
    // },
    // // 增加
    // addDomain() {
    //   this.infoForm.visitUserList.push({
    //     userName: '',
    //     userSex: '',
    //     userJob: '',
    //     userTel: ''
    //   });
    // },
    // 接待类型下拉选
    // receptionType(value) {
    //   this.tripForm.typeOther = '';
    // },
    // 点击下一步
    nextClick() {
      this.$refs.infoForm.validate((valid) => {
        //   // console.log(this.infoForm.visitUserList)
        //   this.infoForm.visitUserList.forEach((item, index) => {
        //     if (this.infoForm.visitUserList[index].userName == '') {
        //       console.log(1)
        //     }
        //   })
        if (valid) {
          this.pageActive = 2;
          this.mapReady();
        }
      })
    },
    // 地区
    getAreaData() {
      this.$axiosGet(API.receptionFacade_areaTree, {}).then(res => {
        if (res.model.model.length > 0) {
          this.areaOptions = res.model.model;
          // 数据回显
          if (this.$route.params.type !== 'add') {
            this.getUpdateData();
          }
        } else {
          this.areaOptions = [];
        }
      })
    },
    // 获取经纬度
    pointLngLat(data) {
      data.forEach((item, index) => {
        if (this.tripForm.acceptAreaName == data[index].id) {
          this.pointLng = data[index].x;
          this.pointLat = data[index].y;
        }
      })
    },
    // 点击添加
    scheduleAdd() {
      this.$refs.tripForm.validate((valid) => {
        if (valid) {
          // let addFlag = 0;
          // 根据接待地点ID匹配接待地点
          let areaAccept = '';
          this.areaPointList.forEach((item, index) => {
            if (this.tripForm.acceptAreaName == this.areaPointList[index].id) {
              areaAccept = this.areaPointList[index].name;
            }
          })
          // 判断是否为相同接待点
          // this.scheduleListAdd.forEach((item, index) => {
          //   if (this.tripForm.acceptAreaName == this.scheduleListAdd[index].hotelInfoId) {
          //     addFlag = 1;
          //     this.message = '接待点不能重复';
          //     this.YPromptShow = true;
          //   }
          // })
          // 处理前端回显
          // if (addFlag == 0) {

          // 显示接待方式
          let visitingTypeDesc = '';
          this.visitingOptions.forEach((optionItem, optionIndex) => {
            if (this.tripForm.visitingType == this.visitingOptions[optionIndex].value) {
              visitingTypeDesc = this.visitingOptions[optionIndex].label;
            }
          })

          let scheduleAddData = {
            receptionX: this.pointLng,
            receptionY: this.pointLat,
            // hotelInfoId: this.tripForm.acceptAreaName, // 接待地点ID
            // areaId: this.tripForm.areaName[this.tripForm.areaName.length - 1], // 地区ID
            areaId: this.tripForm.acceptAreaName, // 接待地点ID
            areaName: areaAccept, // 接待地点
            receptionTime: DATE.dateReturnYMDHMS(this.tripForm.receptionTime) || this.tripForm.receptionTime, // 行程时间节点
            visitingType: this.tripForm.visitingType, // 接待类型，比如，餐饮还是住宿，传递字符串即可
            visitingTypeDesc: visitingTypeDesc,
            remark: this.tripForm.remark, // 备注
            visitingCount: this.tripForm.visitingCount, //到访人数
            visitingPerson: this.tripForm.visitingPerson, //随行人员
          }
          let pointData = {
            lng: this.pointLng,
            lat: this.pointLat
          }
          this.pointList.push(pointData);
          this.mapReady();
          let acceptName = this.tripForm.areaName;
          this.scheduleListAdd.push(scheduleAddData);
          this.$refs.tripForm.resetFields();
          this.tripForm.areaName = acceptName;
          this.tripForm.node = '';
        }
        // }
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.$router.go(-1);
      }
    },
    // 移除
    iconClose(index) {
      this.scheduleListAdd.splice(index, 1);
      this.pointList.splice(index, 1);
      this.mapReady();
    },
    // 点击上一步
    appoveClick() {
      this.pageActive = 1;
    },
    // 增加一个点
    addPoint() {
      this.pointList.push(this.point);
      this.mapReady();
    },
    // 删除一个点
    deletePoint() {
      this.pointList.splice(0, 1);
      this.mapReady();
    },
    // 提交点击
    submitClick() {
      // this.$refs.tripNameForm.validate((valid) => {

      // })
      if (this.scheduleListAdd.length > 0) {
        let tripList = [];
        let tripScheduleList = [];
        tripList.push({
          receptionTime: this.tripForm.time, // 行程时间节点
          acceptType: this.tripForm.type, // 接待类型，比如，餐饮还是住宿，传递字符串即可
          receptionFood: this.tripForm.typeOther, // 早餐、午餐、晚餐，传递字符串即可
          hotelInfoId: this.tripForm.acceptAreaName, // 接待地点ID
          areaId: this.tripForm.areaName[this.tripForm.areaName.length - 1], // 地区ID
          remark: this.tripForm.node // 备注
        })
        let params = {
          receptionLetterDTO: {
            receptionLetterId: this.infoForm.receptionLetterId, // 接待方案id
            receptionLetterName: this.infoForm.receptionLetterName, // 接待方案名称
            dispatchedOrgan: this.infoForm.dispatchedOrgan, // 派出单位名称
            dispatchedOrganLinkmanTel: this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel, // 派出单位联系方式
            dispatchedOrganLinkmanDuty: this.infoForm.sendOrganUser.dispatchedOrganLinkmanDuty, // 派出单位职务
            dispatchedOrganLinkmanName: this.infoForm.sendOrganUser.dispatchedOrganLinkmanName,//派出单位姓名
            // visitingUserId: JSON.stringify(this.infoForm.visitUserList), // 到访人员
            visitingCount: this.infoForm.visitingCount, // 到访人员总数
            visitingStartTime: DATE.dateReturnYMDHMS(this.infoForm.visitingStartTime) || this.infoForm.visitingStartTime, // 到访开始时间
            visitingEndTime: DATE.dateReturnYMDHMS(this.infoForm.visitingEndTime) || this.infoForm.visitingEndTime, // 到访结束时间
            visitingDuring: this.infoForm.visitingDuring, // 到访时长
            remark: this.infoForm.remark, // 备注
            attachmentURL: JSON.stringify(this.fileListData),
            // receptionOrganId: this.infoForm.acceptOrganName, // 接收单位
            receptionOrganLinkmanTel: this.infoForm.acceptOrganUser.receptionOrganLinkmanTel, // 接待单位联系方式
            receptionOrganLinkmanDuty: this.infoForm.acceptOrganUser.receptionOrganLinkmanDuty, // 接待单位职务
            receptionOrganLinkmanName: this.infoForm.acceptOrganUser.receptionOrganLinkmanName,//接待单位姓名
            receptionLevel: this.infoForm.receptionLevel, //接待级别
            booleanSecret: this.infoForm.booleanSecret, // 是否涉密
            visitingType: this.infoForm.visitingType, // 接收类型，参数就直接传递字符串
          },
          tripPlanDTOList: this.scheduleListAdd
        }
        // if (this.$route.params.type == 'add') {
        //   this.$set(params, 'type', 'ADD');
        // } else {
        //   this.$set(params, 'type', '');
        // }

        // console.log(params)
        let url = '';
        if (this.$route.params.type == 'add') {
          url = API.receptionFacade_createTrip;
        } else {
          url = API.receptionFacade_updateTrip;
        }

        this.$axiosJsonPost(url, params).then(res => {
          if (res.result === 'success') {
            this.isBol = true;
          } else {
            this.isBol = false;
          }
          this.message = res.message;
          this.YPromptShow = true;
        })
        this.$refs.tripForm.resetFields();
      }
    },
    // 初始化地图slice
    mapReady() {
      this.Bmap = new BMap.Map('allmap');
      let point = new BMap.Point(116.331398, 39.897445); // 初始化地图
      this.Bmap.centerAndZoom(point, 15);
      this.Bmap.enableScrollWheelZoom();
      this.drawLine();
    },
    drawLine() {
      let mapPointList = [];
      this.pointList.forEach((item, index) => {
        mapPointList.push(new BMap.Point(item.lng, item.lat))
      })
      // console.log(this.pointList[this.pointList.length - 1])
      //   let p1 = new BMap.Point(116.301934, 39.977552);
      //   let p2 = new BMap.Point(116.508328, 39.919141);
      //   let p3 = new BMap.Point(116.365942, 39.996165);
      //   let p4 = new BMap.Point(116.385944, 39.995568);
      //   let p5 = new BMap.Point(116.408757, 39.995704);

      let driving = new BMap.DrivingRoute(this.Bmap, { renderOptions: { map: this.Bmap, autoViewport: true } });
      driving.search(mapPointList[0], mapPointList[mapPointList.length - 1], { waypoints: mapPointList.slice(1, mapPointList.length - 1) });//waypoints表示途经点
    },
    // 获取接待点数据
    getAreaPointData(data) {
      this.areaPointList = [];
      let params = {
        areaId: data[data.length - 1]
      };
      this.$axiosGet(API.receptionFacade_findWithOutPageByAreaId, params).then(res => {
        if (res.result == 'success') {
          this.areaPointList = res.model.list;

          // 根据接待地点ID匹配接待地点
          this.areaPointList.forEach((item, index) => {
            this.scheduleListAdd.forEach((itemTrip, indexTrip) => {
              if (this.scheduleListAdd[indexTrip].hotelInfoId == this.areaPointList[index].id) {
                this.scheduleListAdd[indexTrip].area = this.areaPointList[index].name;
              }
            })
          })
        } else {
          this.areaPointList = [];
        }
      })
      // 数据回显
      // if (this.$route.params.type == 'edit') {
      //   this.getUpdateData();
      // }
    },
    // 修改数据回显
    getUpdateData() {
      let params = {
        receptionLetterId: this.$route.query.id
      };
      this.$axiosGet(API.receptionFacade_findByReceptionLetterId, params).then(res => {
        if (res.result == 'success') {
          this.scheduleDetail = res.model;
          // let officialLetterBO = res.model.officialLetterBO; // 公函信息
          let receptionLetterBO = res.model.receptionLetterDTO; // 接待信息
          // let tripVoDTO = res.model.tripVoDTO; // 行程编辑

          this.infoForm.receptionLetterId = receptionLetterBO.receptionLetterId; // 接待方案id
          this.infoForm.receptionLetterName = receptionLetterBO.receptionLetterName; // 接待方案名称
          this.infoForm.dispatchedOrgan = receptionLetterBO.dispatchedOrgan; // 派出单位名称
          this.infoForm.sendOrganUser.dispatchedOrganLinkmanTel = receptionLetterBO.dispatchedOrganLinkmanTel; // 派出单位接待人联系方式
          this.infoForm.sendOrganUser.dispatchedOrganLinkmanDuty = receptionLetterBO.dispatchedOrganLinkmanDuty; // 派出单位接待人所属职务
          this.infoForm.sendOrganUser.dispatchedOrganLinkmanName = receptionLetterBO.dispatchedOrganLinkmanName; //派出单位接待人姓名
          // this.infoForm.visitUserList = officialLetterBO.visitingUserId; // 到访人员
          this.infoForm.visitingCount = receptionLetterBO.visitingCount; // 到访人员总数
          this.infoForm.visitingStartTime = receptionLetterBO.visitingStartTime; // 到访开始时间
          this.infoForm.visitingEndTime = receptionLetterBO.visitingEndTime; // 到访结束时间
          this.infoForm.visitingDuring = receptionLetterBO.visitingDuring; // 到访时长
          this.infoForm.remark = receptionLetterBO.remark; // 来访事由
          this.fileListData = eval(receptionLetterBO.attachmentURL); // 附件

          // this.infoForm.acceptOrganName = receptionLetterBO.receptionOrganId; // 接收单位
          this.infoForm.acceptOrganUser.receptionOrganLinkmanTel = receptionLetterBO.receptionOrganLinkmanTel; // 接待单位联系方式
          this.infoForm.acceptOrganUser.receptionOrganLinkmanDuty = receptionLetterBO.receptionOrganLinkmanDuty; // 接待单位所属职务
          this.infoForm.acceptOrganUser.receptionOrganLinkmanName = receptionLetterBO.receptionOrganLinkmanName;//接待单位姓名
          this.infoForm.receptionLevel = receptionLetterBO.receptionLevel; //接待级别
          this.infoForm.booleanSecret = receptionLetterBO.booleanSecret; // 是否涉密
          this.infoForm.visitingType = receptionLetterBO.visitingType; // 接收类型，参数就直接传递字符串
          this.scheduleListAdd = res.model.tripPlanDTOList;

          // this.tripNameForm.name = tripVoDTO[0].name;
          // 根据接待地点ID匹配接待地点
          this.areaPointList.forEach((item, index) => {
            this.scheduleListAdd.forEach((itemTrip, indexTrip) => {
              if (this.scheduleListAdd[indexTrip].hotelInfoId == this.areaPointList[index].id) {
                this.scheduleListAdd[indexTrip].area = this.areaPointList[index].name;
              }
            })
          })

          // 显示接待方式
          this.scheduleListAdd.forEach((item, index) => {
            this.visitingOptions.forEach((optionItem, optionIndex) => {
              if (this.scheduleListAdd[index].visitingType == this.visitingOptions[optionIndex].value) {
                this.scheduleListAdd[index].visitingTypeDesc = this.visitingOptions[optionIndex].label;
              }

            })
          })

          // 显示路径
          this.scheduleListAdd.forEach((itemPoint, indexPoint) => {
            if (this.scheduleListAdd[indexPoint].areaId) {
              // this.tripForm.areaName = ;
              this.getAreaPointData([this.scheduleListAdd[indexPoint].areaId]);
            }
            let lngLatArr = this.scheduleListAdd[indexPoint].lastUpdated.split(',');
            let pointData = {
              lng: lngLatArr[0],
              lat: lngLatArr[1]
            };
            this.pointList.push(pointData);
          })
          this.mapReady();
        }
      })
    },
    // 点击详情
    tripDetailClick() {
      this.$refs.tripDetail.openModal(this.scheduleDetail);
    }
  }
}
</script>

<style lang="scss" scoped>
#trip-update {
  .main-height {
    // height: calc(100% - 35px);
  }
  .h-tab-content {
    .reception-form {
      .h-table-info {
        td {
          width: calc(50% - 120px);
        }
      }
    }
  }
  .u-trip {
    display: flex;
    // height: calc(100% - 158px);
    height: 700px;
    background-color: #fff;
    .u-trip-form {
      width: 350px;
      height: 100%;
      padding: 15px 10px;
      border: 1px solid #ccc;
      box-sizing: border-box;
      margin-right: 10px;
      position: relative;
      &.u-trip-detail {
        padding: 0px;
      }
      .trip-detail-btn {
        width: 70px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #3670ff;
        color: #3670ff;
        cursor: pointer;
        border-radius: 2px;
        margin-left: 250px;
        top: 15px;
        position: absolute;
        z-index: 10;
      }
      .trip-detail-wrap {
        position: relative;
        padding-left: 10px;
        height: 120px;
        border-left: 2px #e4e7ee solid;
        .trip-circle {
          position: absolute;
          top: 0;
          left: -6px;
          width: 10px;
          height: 10px;
          border-radius: 6px;
          background-color: #e4e7ee;
        }
        .trip-time {
          font-weight: bold;
        }
        .trip-address {
          padding: 15px 10px;
          background-color: #f7faff;
          box-shadow: -2px 2px 5px #dcdcdc;
        }
        div {
          margin-bottom: 5px;
        }
      }
      .el-form-item {
        margin-bottom: 20px;
      }
    }
    .u-trip-map {
      flex: 1;
      height: 100%;
    }
  }
  .schedule-add-btn-wrap {
    border-top: 1px #dcdcdc solid;
    margin-top: 15px;
    padding-top: 10px;
    // height: 200px;
    .schedule-add-wrap {
      height: 155px;
      overflow-y: auto;
      position: relative;
      .schedule-list {
        margin: 0 0 10px 0;
        padding: 10px;
        border: 1px #e9eaef solid;
        background-color: #f7faff;
        div {
          padding: 5px;
        }
        .schedule-close {
          position: absolute;
          right: 5px;
          cursor: pointer;
          font-size: 12px;
          color: #e9eaef;
        }
      }
    }
  }
}
</style>
