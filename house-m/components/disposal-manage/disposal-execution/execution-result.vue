<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="处置执行结果" :item="['处置执行结果']" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>处置执行结果{{msgType}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>项目名称</th>
              <td>{{ruleForm.itemName}}</td>
              <th>处置方式</th>
              <td>{{ruleForm.handleTypeName}} </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='RENT'">
              <th>评估基准日</th>
              <td>{{ruleForm.estimateBaseDate || ''}} </td>
              <th>
                评估机构</th>
              <td>{{ruleForm.estimateMechanism || ''}}</td>
            </tr>
            <tr v-if="ruleForm.handleType ==='RENT'">
              <th>
                <i class="f-color-red">*</i>成交金额</th>
              <td colspan="3">
                <el-form-item prop="clinchDealMoney">
                  <el-input placeholder="请输入" v-model="ruleForm.clinchDealMoney" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='AUCTION'">
              <th>起拍价</th>
              <td>
                {{ruleForm.startingPrice?ruleForm.startingPrice+'万元':''}}
              </td>
              <th>保证金</th>
              <td>{{ruleForm.deposit?ruleForm.deposit+'万元':''}}

              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='AUCTION'">
              <th>增价幅度</th>
              <td>{{ruleForm.priceIncreaseRange?ruleForm.priceIncreaseRange+'万元':''}}
              </td>
              <th>
                <i class="f-color-red">*</i> 拍卖人</th>
              <td>
                <el-form-item prop="patLetPerson">
                  <el-input placeholder="请输入" v-model="ruleForm.patLetPerson" style="width:100%;">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='AUCTION'">
              <th>拍卖地点</th>
              <td>
                <el-input placeholder="请输入" v-model="ruleForm.auctionAddress" style="width:100%;">
                </el-input>
              </td>
              <th>
                <i class="f-color-red">*</i>拍卖日期</th>
              <td>
                <el-form-item prop="auctionDate">
                  <el-date-picker v-model="ruleForm.auctionDate" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='DEMOLITION'">
              <th>
                <i class="f-color-red">*</i>项目预算</th>
              <td>
                {{ruleForm.itemBudget?ruleForm.itemBudget+'万元':''}}
              </td>
              <th>
                <i class="f-color-red">*</i>项目地点</th>
              <td>
                {{ruleForm.itemAddress}}
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='DEMOLITION'">
              <th>项目工期</th>
              <td>{{ruleForm.itemSchedule ? ruleForm.itemSchedule+'天':''}} </td>
              <th>
                <i class="f-color-red">*</i>拆除单位</th>
              <td>
                <el-form-item prop="demolitionOrganName">
                  <el-input placeholder="请输入拆除单位" v-model="ruleForm.demolitionOrganName" style="width:100%;" maxlength="40">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='DEMOLITION'">
              <th>
                <i class="f-color-red">*</i>拆除费用</th>
              <td>
                <el-form-item prop="demolitionFee">
                  <el-input placeholder="请输入拆除费用" v-model="ruleForm.demolitionFee" style="width:100%;">
                    <template slot="append">万元</template>
                  </el-input>
                </el-form-item>
              </td>
              <th> 投标工期</th>
              <td>
                <el-form-item prop="biddingPeriod">
                  <el-input placeholder="请输入投标工期" v-model="ruleForm.biddingPeriod" style="width:100%;">
                    <template slot="append">天</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.handleType ==='CONVERSIONPURPOSES'">
              <th>管理单位</th>
              <td>{{ruleForm.manageOrganName}}</td>
              <th>转换用途</th>
              <td>{{ruleForm.purpose}}</td>
            </tr>
            <tr v-if="ruleForm.handleType ==='CONVERSIONPURPOSES'">
              <th>
                <i class="f-color-red">*</i>转换日期</th>
              <td>
                <el-form-item prop="conversionDate">
                  <el-date-picker v-model="ruleForm.conversionDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>附件</th>
              <td colspan="3">
                <el-button class="u-upload-btn" @click="emptyFileJson">
                  <i class="iconfont icon-daochu"></i>上传附件
                </el-button>
                <ul>
                  <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                    <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                    <a target="_blank" :href="item.url">预览</a>
                  </li>
                </ul>
              </td>
            </tr>
          </table>
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle " style="padding-top:5px;">
              <span></span>已处置房屋明细
              <i class="f-color-red">*请对列表中的房间{{ruleForm.handleTypeName}}情况进行登记</i>
            </h2>
          </div>
          <div class="h-table">
            <el-table :data="ruleForm.list" stripe ref="multipleTable" style="width: 100%">
              <el-table-column fixed="left" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column label="房间号" prop="roomNo" width='80px'>
              </el-table-column>
              <el-table-column label="房间位置" prop="roomAddress">
              </el-table-column>
              <el-table-column label="建筑面积（㎡）" prop="buildArea">
              </el-table-column>
              <el-table-column label="使用面积（㎡）" prop="useArea">
              </el-table-column>
              <el-table-column label="房屋评估建筑面积单价(万元/㎡)" prop="houseEstimateBuildAreaOfUnivalent" v-if="ruleForm.handleType ==='AUCTION'" width='240px'>
              </el-table-column>
              <el-table-column label="总价（万元）" prop="totalPrice" v-if="ruleForm.handleType ==='AUCTION'">
              </el-table-column>
              <el-table-column label="是否出租" key='3' :render-header="renderHeader" v-if="ruleForm.handleType ==='RENT'" width='120px'>
                <template slot-scope="scope">
                  <el-form-item :prop="'list.'+ scope.$index +'.whetherToRent'" :rules="rules.whetherToRent">
                    <el-select v-model="scope.row.whetherToRent" placeholder="请选择" :disabled="$route.params.type==='edit'" @change="getColum(scope.row.whetherToRent)">
                      <el-option label="是" value="YES"></el-option>
                      <el-option label="否" value="NO"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否已拆除" key='1' :render-header="renderHeader1" v-if="ruleForm.handleType ==='DEMOLITION'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.whetherToRemoved'" :rules='rules.whetherToRemoved'>
                    <el-select v-model="scope.row.whetherToRemoved" :disabled="$route.params.type==='edit'" placeholder="请选择">
                      <el-option label="是" value="YES"></el-option>
                      <el-option label="否" value="NO"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否已拍卖" key='2' :render-header="renderHeader2" v-if="ruleForm.handleType ==='AUCTION'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.whetherToAuction'" :rules='rules.whetherToAuction'>
                    <el-select v-model="scope.row.whetherToAuction" placeholder="请选择" :disabled="$route.params.type==='edit'" @change="getColum(scope.row.whetherToAuction)">
                      <el-option label="是" value="YES"></el-option>
                      <el-option label="否" value="NO"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="是否已转换用途" key='4' :render-header="renderHeaderPurpose" v-if="ruleForm.handleType ==='CONVERSIONPURPOSES'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.whetherToTransformPurpose'" :rules='rules.whetherToTransformPurpose'>
                    <el-select v-model="scope.row.whetherToTransformPurpose" :disabled="$route.params.type==='edit'" placeholder="请选择">
                      <el-option label="是" value="YES"></el-option>
                      <el-option label="否" value="NO"></el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="受让人" :render-header="renderHeader3" v-if="ruleForm.handleType ==='AUCTION'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.receivePerson'" :rules="scope.row.whetherToAuction === 'YES'?rules.receivePerson:{}">
                    <el-input v-model="scope.row.receivePerson" :disabled="getColum(scope.row.whetherToAuction)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="成交金额" fixed="right" key="clinchDealMoney" :render-header="renderHeader4" v-if="ruleForm.handleType ==='AUCTION'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.clinchDealMoney'" :rules="scope.row.whetherToAuction === 'YES'?rules.clinchDealMoney:{}">
                    <el-input v-model="scope.row.clinchDealMoney" :disabled="getColum(scope.row.whetherToAuction)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="拆除日期" :render-header="renderHeader31" key="removedDate" v-if="ruleForm.handleType ==='DEMOLITION'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.removedDate'" :rules="scope.row.whetherToRemoved === 'YES'?rules.removedDate:{}">
                    <el-date-picker v-model="scope.row.removedDate" type="date" :disabled="getColum(scope.row.whetherToRemoved)" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="承租人" prop="lesseeName" key="lesseeName" :render-header="renderHeader01" v-if="ruleForm.handleType ==='RENT'">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.lesseeName'" :rules='scope.row.whetherToRent === "YES"?rules.lesseeName:{}'>
                    <el-input v-model="scope.row.lesseeName" :disabled="getColum(scope.row.whetherToRent)"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="出租开始日期" key="rentStartDate" :render-header="renderHeader02" v-if="ruleForm.handleType ==='RENT'" width='160px'>
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.rentStartDate'" :rules='scope.row.whetherToRent === "YES"?rules.rentStartDate:{}'>
                    <el-date-picker v-model="scope.row.rentStartDate" type="date" :disabled="getColum(scope.row.whetherToRent)" placeholder="选择日期">
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="出租结束日期" key="rentEndDate" :render-header="renderHeader03" v-if="ruleForm.handleType ==='RENT'" width='160px'>
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.rentEndDate'" :rules='scope.row.whetherToRent === "YES"?rules.rentEndDate:{}'>
                    <el-date-picker v-model="scope.row.rentEndDate" type="date" :disabled="getColum(scope.row.whetherToRent)" placeholder="选择日期" :picker-options="{  disabledDate(time) {
                        return time.getTime() < new Date(scope.row.rentStartDate).getTime();
                    }
}">
                    </el-date-picker>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="租金（元/年)" fixed="right" key="clinchDealPrice" :render-header="renderHeader04" v-if="ruleForm.handleType ==='RENT'" width='140px'>
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.clinchDealPrice'" :rules='scope.row.whetherToRent === "YES"?rules.clinchDealPrice:{}'>
                    <el-input :disabled="getColum(scope.row.whetherToRent)" v-model="scope.row.clinchDealPrice"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="table-bottom-btns f-hidden">
            <router-link v-if="ruleForm.handleType ==='RENT'" :to="{path: '/disposal-manage/disposal-execution/execution-list/rent'}">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <router-link v-if="ruleForm.handleType ==='AUCTION'" :to="{path:'/disposal-manage/disposal-execution/execution-list/auction'}">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <router-link v-if="ruleForm.handleType==='DEMOLITION'" :to="{path:'/disposal-manage/disposal-execution/execution-list/demolish'}">
              <el-button class="u-submit-btn cancel-btn ">取消</el-button>
            </router-link>
            <router-link v-if="ruleForm.handleType==='CONVERSIONPURPOSES'" :to="{path:'/disposal-manage/disposal-execution/execution-list/purpose'}">
              <el-button class="u-submit-btn cancel-btn ">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn " @click="getSaveDataRequest " :loading="loading ">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength " @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow " :isBol="isBol " :message="message " @click="YPromptClick"></Y-Prompt>
  </div>
</template>
<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    'v-upload': vuePopupUpload
  },
  data() {
    let startingPrice = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'clinchDealMoney') {
        message = '成交金额'
      } else if (rule.fullField === 'demolitionFee') {
        message = '拆除费用'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万元`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`));
      }
    }
    //投标工期验证
    let itemSchedule = (rule, value, callback) => {
      if (value) {
        if (!(/(^[1-9]\d*$)/.test(value))) {
          callback(new Error(`请输入大于0正整数！`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    let estimatePrice = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`评估价最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`评估价不能大于一百万元`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }

    let clinchDealPrice = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`租金为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`租金不能大于一百万元`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`租金不能为空`));
      }
    }

    let whether = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'whetherToRent') {
        message = '是否出租'
      } else if (rule.fullField === 'whetherToAuction') {
        message = '是否拍卖'
      } else if (rule.fullField === 'whetherToRemoved') {
        message = '是否拆除'
      }
      else if (rule.fullField === 'whetherToTransformPurpose') {
        message = '是否转换'
      }
      if (value) {
        callback();
      }
      else {
        callback(new Error(`${message}不能为空`));
      }
    }
    return {
      loading: false,
      maxLength: '5',
      ruleForm: {
        itemName: '', //项目名称
        handleTypeName: '', //处置方式名称
        handleType: '',//处置方式
        whetherToRemoved: '',  //是否拆除
        handleHouseDetails: '', //拍卖、出租、拆除、转换用途
        estimateMechanism: '', //评估机构
        estimateBaseDate: '', //评估基准日       
        itemBudget: '',//项目预算（拆除）
        itemAddress: '', //项目地点（拆除）
        itemSchedule: '', //项目工期（拆除）
        manageOrganName: '', //管理单位（转换用途）
        conversionDate: '', //转换日期（转换用途）
        purpose: '', //用途 （转换用途）
        startingPrice: '', // 起拍价（拍卖）
        deposit: '', //保证金（拍卖）
        priceIncreaseRange: '', //增价幅度（拍卖）
        clinchDealMoney: '', //成交金额
        remark: '', //备注
        attachments: {}, //图片地址
        courtyardId: '', //院落id
        courtyardName: '', //院落名称
        houseEstimateBuildAreaOfUnivalent: '', //房屋评估建筑面积单价
        totalPrice: '', //总价
        auctionDate: '', //拍卖日期
        auctionAddress: '', //拍卖地点
        patLetPerson: '', //拍卖人
        lesseeName: '',//	承租人
        biddingPeriod: '', //投标工期(天)
        demolitionOrganName: '', //拆除单位
        whetherToRent: '', //是否出租 YES已出租,NO不出租
        domains: [],
        list: [],
      },
      multipleSelection: [],
      dialogFormVisible: false,
      title: '',
      exectionDetail: [], // 处置执行录入详情
      roomUseDetail: [], // 房间使用情况详情回显
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      msgType: '录入', // 当前页面状态 
      rules: {
        clinchDealMoney: [
          { required: true, validator: startingPrice, trigger: 'change' }
        ],
        patLetPerson: [
          { required: true, message: '请选择拍卖人', trigger: 'change' }
        ],
        demolitionOrganName: [
          { required: true, message: '请选择拆除单位', trigger: 'change' }
        ],
        demolitionFee: [
          { required: true, validator: startingPrice, trigger: 'change' }],
        auctionDate: [
          { required: true, message: '请选择拍卖日期', trigger: 'change' }
        ],
        conversionDate: [
          { required: true, message: '请选择转换日期', trigger: 'change' }
        ],
        rentStartDate: [
          { required: true, message: '请选择出租开始日期', trigger: 'change' }
        ],
        removedDate: [
          { required: true, message: '请选择拆除日期', trigger: 'change' }
        ],
        rentEndDate: [
          { required: true, message: '请选择出租结束日期', trigger: 'change' }
        ],
        purpose: [
          { required: true, message: '请选择转换用途', trigger: 'change' }
        ],
        receivePerson: [{ required: true, message: '请选择受让人', trigger: 'change' }
        ],
        lesseeName: [{ required: true, message: '请选择承租人', trigger: 'change' }
        ],
        whetherToRent: [
          { required: true, validator: whether, trigger: 'change' }
        ],
        whetherToAuction: [
          { required: true, validator: whether, trigger: 'change' }
        ],
        whetherToRemoved: [
          { required: true, validator: whether, trigger: 'change' }
        ],
        whetherToTransformPurpose: [
          { required: true, validator: whether, trigger: 'change' }
        ],
        clinchDealPrice: [
          { required: true, validator: clinchDealPrice, trigger: 'change' } //租金
        ],
        biddingPeriod: [
          { required: true, validator: itemSchedule, trigger: 'change' }   //投标工期
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      }
    };
  },
  activated() {
    if (this.$route.params.type === 'add') {
      this.handleApplyId = this.$route.query.id;
      this.msgType = '录入';
      this.getDetail();
    } else {
      this.handleApplyId = this.$route.query.id;
      this.msgType = '修改';
      this.getEditDataRequest();
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.ruleForm.domains = [];
    this.whetherToTransformPurpose = "";
    this.whetherToRemoved = "";
    this.ruleForm.handleTypeName = '';
    // this.$destroy()
  },
  mounted() {
    this.init();
  },
  computed: {
  },
  methods: {
    init() {
      this.$set(this.ruleForm, 'list', this.list)
    },
    renderHeader(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>是否出租</span>           
                `        },
      })
    },
    renderHeader01(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>承租人</span>           
                `        },
      })
    },
    renderHeader02(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>出租开始日期</span>           
                `        },
      })
    },
    renderHeader03(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>出租结束日期</span>           
                `        },
      })
    },
    renderHeader04(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>租金（元/年）</span>           
                `        },
      })
    },
    renderHeader1(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>是否已拆除</span>           
                `        },
      })
    },
    renderHeader2(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>是否已拍卖</span>           
                `        },
      })
    },
    renderHeaderPurpose(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>是否已转换用途</span>           
                `        },
      })
    },
    renderHeader3(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>受让人</span>           
                `        },
      })
    },
    renderHeader31(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>拆除日期</span>           
                `        },
      })
    },
    renderHeader4(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>成交金额（万元）</span>           
                `        },
      })
    },
    getColum(value) {
      if (value === 'NO') {
        this.ruleForm.list.forEach((item, index) => {
          if (item.whetherToAuction == value) {
            item.receivePerson = '';
            item.clinchDealMoney = '';
          } else if (item.whetherToRent == value) {
            item.rentStartDate = '';
            item.rentEndDate = '';
            item.clinchDealPrice = '';
            item.lesseeName = '';
          } else if (item.whetherToRemoved == value) {
            item.removedDate = '';
          }
          // this.$refs.ruleForm.resetFields();
        })
        return true
      } else {
        return false
      }

    },
    fileUploadRequest(fileNameList) {
      fileNameList.forEach(value => {
        this.ruleForm.domains.push({
          name: value.name,
          url: value.url
        })
      })
    },
    deleteFileNameList(index) { // 删除附件
      this.ruleForm.domains.splice(index, 1)
      this.maxLength = 5 - this.ruleForm.domains.length
    },
    emptyFileJson() {
      this.$refs.VUpload.openModal()
    },
    openDilog() {
      this.dialogFormVisible = true;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //后退
    backHandle() {
      this.$router.go(-1);
      this.$refs.ruleForm.resetFields();
    },
    //执行结果修改回显
    getEditDataRequest() {
      let params = {
        handleApplyId: this.handleApplyId
      }
      this.$axiosGet(API.handleapply_handlePerformResultUpdateDetail, params).then(res => {
        if (res.data) {
          this.ruleForm.itemName = res.data.handleApplyResponse.itemName; //项目名称
          this.ruleForm.handleTypeName = res.data.handleApplyResponse.handleTypeName; //处置方式
          this.ruleForm.handleType = res.data.handleApplyResponse.handleType;
          this.ruleForm.estimateMechanism = res.data.handleApplyResponse.estimateMechanism; //评估机构
          if (res.data.handleApplyResponse.estimateBaseDate) {
            this.ruleForm.estimateBaseDate = res.data.handleApplyResponse.estimateBaseDate.substr(0, 10); //评估基准日
          } else {
            this.ruleForm.estimateBaseDate = ''
          }
          this.ruleForm.itemBudget = res.data.handleApplyResponse.itemBudget;  //项目预算
          this.ruleForm.itemAddress = res.data.handleApplyResponse.itemAddress;  //项目地点
          this.ruleForm.itemSchedule = res.data.handleApplyResponse.itemSchedule; //项目工期
          this.ruleForm.manageOrganName = res.data.handleApplyResponse.manageOrganName; // 管理单位
          this.ruleForm.purpose = res.data.handleApplyResponse.purpose; //用途
          this.ruleForm.startingPrice = res.data.handleApplyResponse.startingPrice; // 起拍价
          this.ruleForm.deposit = res.data.handleApplyResponse.deposit; //保证金
          this.ruleForm.priceIncreaseRange = res.data.handleApplyResponse.priceIncreaseRange; //增价幅度
          this.ruleForm.clinchDealMoney = res.data.handleApplyResponse.clinchDealMoney;// 成交金额
          if (res.data.handleApplyResponse.auctionDate) {
            this.ruleForm.auctionDate = res.data.handleApplyResponse.auctionDate.substr(0, 10); //拍卖日期
          } else {
            this.ruleForm.auctionDate = ''
          }
          this.ruleForm.patLetPerson = res.data.handleApplyResponse.patLetPerson; //拍卖人
          this.ruleForm.auctionAddress = res.data.handleApplyResponse.auctionAddress; //拍卖地点
          this.ruleForm.demolitionOrganName = res.data.handleApplyResponse.demolitionOrganName; //拆除单位
          this.ruleForm.demolitionFee = res.data.handleApplyResponse.demolitionFee;   //拆除费用
          this.ruleForm.biddingPeriod = res.data.handleApplyResponse.biddingPeriod; //投标工期
          this.ruleForm.conversionDate = res.data.handleApplyResponse.conversionDate; //转换日期
          if (res.data.handleApplyResponse.handleHouseDetailResponseList) {
            this.ruleForm.list = res.data.handleApplyResponse.handleHouseDetailResponseList;
          } else {
            this.ruleForm.list = []
          }
          if (res.data.fileResponseAdapterList) {
            res.data.fileResponseAdapterList.forEach((item, index) => {
              this.ruleForm.domains.push({
                name: item.name,
                url: item.url
              })
            });
          }
        }
      })
    },
    checkStatus(value) {
      if (value === '出租') {
        return 'RENT'
      } else if (value === '拍卖') {
        return 'AUCTION'
      } else if (value === '转换用途') {
        return 'CONVERSIONPURPOSES'
      } else {
        return 'DEMOLITION'
      }
    },
    //提交表单
    getSaveDataRequest() {
      let ispass = false;
      if (this.ruleForm.list.length > 0) {
        ispass = true
      } else {
        ispass = false;
      }
      let dataTable = [];
      this.ruleForm.list.forEach((item, index) => {
        if (this.ruleForm.handleType === 'AUCTION') {
          dataTable.push({
            roomId: item.roomId,
            houseEstimateBuildAreaOfUnivalent: item.houseEstimateBuildAreaOfUnivalent,
            totalPrice: parseFloat(item.buildArea) * parseFloat(item.houseEstimateBuildAreaOfUnivalent),
            receivePerson: item.receivePerson, // 受让人
            clinchDealMoney: item.clinchDealMoney || '', // 成交金额
            whetherToAuction: item.whetherToAuction, //是否已拍卖           
          })
        } else if (this.ruleForm.handleType === 'RENT') {
          dataTable.push({
            roomId: item.roomId,
            whetherToRent: item.whetherToRent,   // 是否出租
            lesseeName: item.lesseeName, //承租人
            rentStartDate: FORMATGET.formatGET(item.rentStartDate).substr(0, 10), //出租日期
            rentEndDate: FORMATGET.formatGET(item.rentEndDate).substr(0, 10),
            clinchDealPrice: item.clinchDealPrice, //租金
            estimatePrice: item.estimatePrice || '',
            leaseTerm: item.leaseTerm || '',
            planPurpose: item.planPurpose || ''
          })
        }
        else if (this.ruleForm.handleType === 'DEMOLITION') {
          dataTable.push({
            roomId: item.roomId,
            whetherToRemoved: item.whetherToRemoved || '', //是否已拆除
            removedDate: FORMATGET.formatGET(item.removedDate).substr(0, 10)

          })
        } else {
          dataTable.push({
            roomId: item.roomId,
            whetherToTransformPurpose: item.whetherToTransformPurpose || '', //是否已转换用途
          })
        }
      })
      this.$refs.ruleForm.validate((valid, failRuleForm) => {
        if (valid && ispass) {
          let params = {
            id: this.handleApplyId,
            itemName: this.ruleForm.itemName,
            handleType: this.checkStatus(this.ruleForm.handleTypeName),
            handleHouseDetailRequestList: dataTable,  //房间详情        
            fileRequestList: this.ruleForm.domains, // 图片地址
          }
          if (this.ruleForm.handleType === 'RENT') {
            this.$set(params, 'clinchDealMoney', this.ruleForm.clinchDealMoney);
            this.$set(params, 'estimateMechanism', this.ruleForm.estimateMechanism); //评估机构
            this.$set(params, 'estimateBaseDate', FORMATGET.formatGET(this.ruleForm.estimateBaseDate).substr(0, 10) || ''); //评估基准日
          } else if (this.ruleForm.handleType === 'CONVERSIONPURPOSES') {
            this.$set(params, 'conversionDate', FORMATGET.formatGET(this.ruleForm.conversionDate).substr(0, 10));
            this.$set(params, 'manageOrganName', this.ruleForm.manageOrganName);
            this.$set(params, 'purpose', this.ruleForm.purpose);
          } else if (this.ruleForm.handleType === 'AUCTION') {
            this.$set(params, 'patLetPerson', this.ruleForm.patLetPerson); //拍卖人
            this.$set(params, 'auctionAddress', this.ruleForm.auctionAddress || ''); //拍卖地点
            this.$set(params, 'auctionDate', FORMATGET.formatGET(this.ruleForm.auctionDate).substr(0, 10));  //拍卖日期
            this.$set(params, 'startingPrice', this.ruleForm.startingPrice || '');
            this.$set(params, 'deposit', this.ruleForm.deposit || '');
            this.$set(params, 'priceIncreaseRange', this.ruleForm.priceIncreaseRange || '');
          } else {
            this.$set(params, 'demolitionOrganName', this.ruleForm.demolitionOrganName);
            this.$set(params, 'demolitionFee', this.ruleForm.demolitionFee);
            this.$set(params, 'biddingPeriod', this.ruleForm.biddingPeriod);
            this.$set(params, 'itemBudget', this.ruleForm.itemBudget);
            this.$set(params, 'itemAddress', this.ruleForm.itemAddress);
            this.$set(params, 'itemSchedule', this.ruleForm.itemSchedule || '');
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.handleapply_doUpdateHandlePerformResult;
          } else {
            url = API.handleapply_doHandlePerformResultEntry;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('办公用房', '处置利用', '执行结果修改')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '处置利用', '执行结果录入')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        } else {
          let message = failRuleForm[Object.keys(failRuleForm)[0]][0].message;
          this.$message({ message, type: 'error' });
        }
      })
    },
    //处置利用详情获取
    getDetail() {
      let params = {
        handleApplyId: this.handleApplyId
      }
      this.$axiosGet(API.handleapply_handlePerformResultEntryDetail, params).then(res => {
        if (res.data) {
          this.exectionDetail = res.data.handleApplyResponse;
          this.ruleForm.itemName = this.exectionDetail.itemName;
          this.ruleForm.handleTypeName = this.exectionDetail.handleTypeName;
          this.ruleForm.handleType = this.exectionDetail.handleType;
          if (this.ruleForm.handleType === 'RENT') {
            this.ruleForm.estimateMechanism = this.exectionDetail.estimateMechanism || '';
            if (res.data.handleApplyResponse.estimateBaseDate) {
              this.ruleForm.estimateBaseDate = this.exectionDetail.estimateBaseDate.substr(0, 10);
            } else {
              this.ruleForm.estimateBaseDate = ''
            }

          } else if (this.ruleForm.handleType === 'AUCTION') {
            this.ruleForm.startingPrice = this.exectionDetail.startingPrice; //起拍价
            this.ruleForm.deposit = this.exectionDetail.deposit; //保证金
            this.ruleForm.priceIncreaseRange = this.exectionDetail.deposit; //增价幅度
          } else if (this.ruleForm.handleType === 'CONVERSIONPURPOSES') {
            this.ruleForm.manageOrganName = this.exectionDetail.manageOrganName;
            this.ruleForm.purpose = this.exectionDetail.purpose;
          } else if (this.ruleForm.handleType === 'DEMOLITION') {
            this.ruleForm.itemBudget = this.exectionDetail.itemBudget;
            this.ruleForm.itemAddress = this.exectionDetail.itemAddress;
            this.ruleForm.itemSchedule = this.exectionDetail.itemSchedule
          }
          this.ruleForm.list = res.data.handleApplyResponse.handleHouseDetailResponseList;
        }
        if (res.data.fileResponseAdapterList) {
          res.data.fileResponseAdapterList.forEach((item, index) => {
            this.ruleForm.domains.push({
              name: item.name,
              url: item.url
            })
          });
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.back()
        }
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
.h-table-info {
  table-layout: fixed;
}
.u-file {
  margin: 5px 0;
  li {
    float: left;
    display: inline-block;
    line-height: 26px;
  }
}
.el-input {
  width: auto;
}
.iconfont {
  font-size: 6px;
}
</style>
