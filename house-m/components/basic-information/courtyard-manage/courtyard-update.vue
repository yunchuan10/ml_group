<template>
  <div>
    <section class="m-main" :style="{ minHeight: height + 'px' }">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="title" :item="[title]" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{title}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>院落名称</th>
              <td>
                <el-form-item prop="courtyardName">
                  <el-input clearable v-model="ruleForm.courtyardName" :maxlength="40" placeholder="请输入院落名称"></el-input>
                </el-form-item>
              </td>
              <th>
                集中办公区</th>
              <td>
                <el-form-item>
                  <!-- <el-select style="width:100%;" v-model="ruleForm.centralOffice" filterable clearable placeholder="请选择">
                    <el-option label="是" value="YES"></el-option>
                    <el-option label="否" value="NO"></el-option>
                  </el-select> -->
                  <el-radio-group v-model="ruleForm.centralOffice">
                    <el-radio label="YES">是</el-radio>
                    <el-radio label="NO">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>地址坐落</th>
              <td colspan="3">
                <el-form-item prop="courtyardAddress">
                  <el-input clearable placeholder="请输入院落所在的地址位置并进行地图定位" id="suggestId" v-model="ruleForm.courtyardAddress"></el-input>
                </el-form-item>
                <div id="allmap"></div>
                <!-- <div v-show="userlocation.lng==''" style="color: red;">请在地图上标注地点</div> -->
              </td>
            </tr>
            <tr>
              <th>院落航拍图</th>
              <td colspan="3">
                <v-uploadPicture class="avatar-uploader" v-model="ruleForm.domains" title="院落照片" max="5" maxSize="5">
                </v-uploadPicture>
              </td>
            </tr>
          </table>
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle" style="padding:5px 0 0px;">
              <span></span>物业管理信息</h2>
          </div>
          <table class="h-table-info">
            <tr>
              <th>
                物业服务单位</th>
              <td>
                <el-form-item>
                  <el-input clearable v-model="ruleForm.serviceUnit" :maxlength="40" placeholder="请输入物业服务单位全称"></el-input>
                </el-form-item>
              </td>
              <th>
                物业类型</th>
              <td>
                <el-form-item>
                  <el-select style="width:100%;" v-model="ruleForm.propertyType" filterable clearable placeholder="请选择物业类型" @change="getPropertyType">
                    <el-option v-for="item in propertyTypeList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.propertyType ==='SELF'">
              <th>
                单位性质</th>
              <td>
                <el-form-item prop="unitType">
                  <el-select style="width:100%;" v-model="ruleForm.unitType" filterable clearable placeholder="请选择">
                    <el-option v-for="item in companyNature" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                合同物业费</th>
              <td>
                <el-form-item prop="propertyFee">
                  <el-input clearable v-model="ruleForm.propertyFee" :maxlength="7" placeholder="按合同收费标准填写">
                    <template slot="append">元/年</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr v-if="ruleForm.propertyType ==='OTHER'">
              <th>
                政府采购</th>
              <td>
                <el-form-item prop="goverBuy">
                  <el-select style="width:100%;" v-model="ruleForm.goverBuy" filterable clearable placeholder="请选择">
                    <el-option label="是" value="YES">
                    </el-option>
                    <el-option label="否" value="NO">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                合同物业费</th>
              <td>
                <el-form-item prop="propertyFee">
                  <el-input clearable v-model="ruleForm.propertyFee" :maxlength="7" placeholder="按合同收费标准填写">
                    <template slot="append">元/年</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                负责人</th>
              <td>
                <el-form-item prop="chargePerson">
                  <el-input clearable v-model="ruleForm.chargePerson" maxlength="10" placeholder="请输入负责人姓名"></el-input>
                </el-form-item>
              </td>
              <th>
                负责人联系方式</th>
              <td>
                <el-form-item prop="chargePhone">
                  <el-input clearable v-model="ruleForm.chargePhone" maxlength="11" placeholder="请输入物业服务单位负责人联系电话"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                服务开始时间</th>
              <td>
                <el-form-item>
                  <el-date-picker style="width:100%;" v-model="ruleForm.startTime" type="date" placeholder="请选择服务开始时间" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                服务结束时间</th>
              <td>
                <el-form-item>
                  <el-date-picker style="width:100%;" v-model="ruleForm.endTime" type="date" placeholder="请选择服务结束时间" :picker-options="pickerOptions1">
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan='3'>
                <el-form-item prop="remark">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.remark" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.remark.length?ruleForm.remark.length:0}}/200</div>
                </el-form-item>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/basic-information/courtyard-manage/courtyard-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
            <el-button class="u-submit-btn submit-btn new-btn" v-show="this.$route.params.type === 'add'" @click="getAddDataBuildRequest" :loading="loadingbuild">保存并创建楼座</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :isBtn="isBtn" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
import { setTimeout } from 'timers';
export default {
  components: {
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    let self = this;
    let propertyFee = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`合同物业费为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`合同物业费不能大于100万`))
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      pickerOptions: {
        disabledDate(time) {
          if (self.ruleForm.endTime) {
            return time.getTime() > self.ruleForm.endTime;
          } else {
            if (self.ruleForm.startTime) {
              return time.getTime() > self.ruleForm.putUseDate;
            } else {
              return time.getTime() > Date.now();
            }
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          if (self.ruleForm.startTime) {
            return time.getTime() < self.ruleForm.startTime;
          } else {
            return time.getTime() < Date.now();
          }
        }
      },

      loading: false,
      loadingbuild: false,
      isAdd: true, // 当前页面状态
      isBtn: false,
      userlocation: {
        lng: "",  //经度
        lat: ""   //纬度
      },
      title: '',
      ruleForm: {
        centralOffice: '', //是否集中办公
        goverBuy: '',//政府采购
        serviceUnit: '', //物业服务单位
        propertyFee: '', //物业费
        unitType: '',// 单位性质
        propertyType: '', //物业类型
        chargePerson: '', //负责人
        chargePhone: '', //负责人联系方式
        startTime: '', //服务开始时间
        endTime: '', //服务结束时间
        courtyardName: "", //院落名称
        courtyardAddress: "", //院落地址
        remark: '',
        domains: [] // 上传图片
      },
      courtyardId: '', //院落id
      HouseManageCompanyId: '', //物业管理id
      id: '', //创建楼座的id
      imgUrls: [], //图片集合
      originAddress: '',
      companyNature: [], //单位性质集合
      propertyment: {}, //物业管理
      propertyTypeList: [], //物业类型
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      height: 0, // 自定义屏幕高度
      hasClickMap: false, // 有没有点击选择地址
      hasPoint: true, // 地图是否有找到点
      tableData: [], //数据集合
      Bmap: undefined,
      local: undefined,
      rules: {
        isAdd: [{ required: true, message: '请选择发送类型', trigger: 'change' }],
        courtyardName: [
          { required: true, message: '请输入院落名称', trigger: 'change' }
        ],
        courtyardAddress: [
          { required: true, message: '请输入院落地址', trigger: 'change' }
        ],
        propertyFee: [
          { required: false, validator: propertyFee, trigger: 'change' }
        ],
        chargePhone: [{ required: false, pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
        serviceUnit: [
          { required: true, message: '请输入物业服务单位全称', trigger: 'change' }
        ],
        goverBuy: [
          { required: false, message: '请选择是否政府采购', trigger: 'change' }
        ],
        centralOffice: [
          { required: true, message: '请选择是否集中办公', trigger: 'change' }
        ],
        unitType: [
          { required: false, message: '请选择单位性质', trigger: 'change' }
        ],
        propertyType: [
          { required: true, message: '请选择物业类型', trigger: 'change' }
        ],
        startTime: [
          { required: true, message: '请选择输入开始时间', trigger: 'change' }
        ],
        endTime: [
          { required: true, message: '请选择输入结束时间', trigger: 'change' }
        ],

      }
    };
  },
  activated() {
    this.height = document.body.clientHeight - 145; // 设置高度自适应
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      this.courtyardId = this.$route.query.id;
      this.getEditDataRequest(); // 修改回显页面数据
      this.isAdd = false;
      this.title = '修改院落';
    } else {
      this.isAdd = true;
      this.title = '新增院落';
    }
    this.getSelect()
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  mounted() {
    this.mapReady();
  },
  watch: {
    'ruleForm.courtyardAddress': function (value) {
      if (!value) {
        this.userlocation = {
          lng: "",  //经度
          lat: ""   //纬度
        }
        this.setPlace(value)
      }
    }
  },
  computed: {
    searchTableListBol() {
      return this.$store.state.searchTableListBol.tableListBol["CHECK_CAR"];
    }
  },
  methods: {
    //点击物业类型 清空显示的表单
    getPropertyType() {
      this.ruleForm.goverBuy = '';
      this.ruleForm.propertyFee = '';
    },
    // 新增、修改院落
    getAddDataRequest() {
      if (this.userlocation.lng) {
        this.hasPoint = true;
      } else {
        this.hasPoint = false;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            name: this.ruleForm.courtyardName,
            address: this.ruleForm.courtyardAddress,
            centralOffice: this.ruleForm.centralOffice,
            longitude: this.userlocation.lng || '',
            latitude: this.userlocation.lat || '',
            fileRequestList: this.ruleForm.domains,
            companyName: this.ruleForm.serviceUnit || '', //物业服务单位
            companyManageType: this.ruleForm.propertyType || '', //物业类型    
            companyContractCost: this.ruleForm.propertyFee || '', //合同物业费
            responsiblePerson: this.ruleForm.chargePerson, //负责人
            responsiblePersonPhone: this.ruleForm.chargePhone, //负责人联系电话
            serviceStartTime: FORMATGET.formatGET(this.ruleForm.startTime).substr(0, 10) || '', //服务开始时间
            serviceEndTime: FORMATGET.formatGET(this.ruleForm.endTime).substr(0, 10) || '', //服务结束时间
            companyRemark: this.ruleForm.remark, //备注
          }

          if (this.ruleForm.propertyType === 'OTHER') {
            this.$set(params, 'companyGovermentBuy', this.ruleForm.goverBuy) //政府采购
            this.$set(params, 'companyOrganType', '')
          } else if (this.ruleForm.propertyType === 'SELF') {
            this.$set(params, 'companyGovermentBuy', '')
            this.$set(params, 'companyOrganType', this.ruleForm.unitType) //单位性质
          } else {
            this.$set(params, 'companyGovermentBuy', '')
            this.$set(params, 'companyOrganType', '') //单位性质
            this.$set(params, 'companyContractCost', '') //单位性质
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            url = API.courtYard_update;
            this.$set(params, 'id', this.$route.query.id)
            // this.$set(params, 'HouseManageCompanyId', this.HouseManageCompanyId)
          } else {
            url = API.courtYard_add;
          }
          this.loading = true;

          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '院落修改')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '院落新增')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },

    getAddDataBuildRequest() {
      if (this.userlocation.lng) {
        this.hasPoint = true;
      } else {
        this.hasPoint = false;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {

          let params = {
            name: this.ruleForm.courtyardName,
            address: this.ruleForm.courtyardAddress,
            centralOffice: this.ruleForm.centralOffice,
            longitude: this.userlocation.lng || '',
            latitude: this.userlocation.lat || '',
            fileRequestList: (this.ruleForm.domains),
            companyName: this.ruleForm.serviceUnit || '', //物业服务单位
            companyManageType: this.ruleForm.propertyType || '', //物业类型    
            companyContractCost: this.ruleForm.propertyFee || '', //合同物业费
            responsiblePerson: this.ruleForm.chargePerson, //负责人
            responsiblePersonPhone: this.ruleForm.chargePhone, //负责人联系电话
            serviceStartTime: FORMATGET.formatGET(this.ruleForm.startTime).substr(0, 10) || '', //服务开始时间
            serviceEndTime: FORMATGET.formatGET(this.ruleForm.endTime).substr(0, 10) || '', //服务结束时间
            companyRemark: this.ruleForm.remark, //备注
          }
          if (this.ruleForm.propertyType === 'OTHER') {
            this.$set(params, 'companyGovermentBuy', this.ruleForm.goverBuy) //政府采购
            this.$set(params, 'companyOrganType', '')
          } else if (this.ruleForm.propertyType === 'SELF') {
            this.$set(params, 'companyGovermentBuy', '')
            this.$set(params, 'companyOrganType', this.ruleForm.unitType) //单位性质
          } else {
            this.$set(params, 'companyGovermentBuy', '')
            this.$set(params, 'companyOrganType', '') //单位性质
            this.$set(params, 'companyContractCost', '') //单位性质
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            url = API.courtYard_update;
            this.$set(params, 'id', this.$route.query.id)
            // this.$set(params, 'HouseManageCompanyId', this.HouseManageCompanyId)
          } else {
            url = API.courtYard_add;
          }
          this.loadingbuild = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isBtn = true;
              this.id = res.data.id;
            } else {
              this.isBol = false;
              this.isBtn = false;
            }
            this.loadingbuild = false;
            this.message = res.message;
          })
        }
      });
    },

    //物业管理下拉框取值
    getSelect() {
      this.$axiosGet(API.courtYard_manageCompanyStatus, {}).then(res => {
        if (res.data) {
          this.propertyTypeList = res.data.houseManageType;
          this.companyNature = res.data.organType;
        }
      })


    },
    //修改详情回显
    getEditDataRequest() {
      let params = {
        id: this.courtyardId
      }
      this.$axiosGet(API.courtYard_updateDetail, params).then(res => {
        this.propertyment = res.data || {};
        this.ruleForm.domains = res.data.fileResponseList || [];
        this.ruleForm.courtyardName = res.data.name;
        this.ruleForm.courtyardAddress = res.data.address;
        this.ruleForm.centralOffice = res.data.centralOffice;
        this.originAddress = this.ruleForm.address;

        this.ruleForm.serviceUnit = res.data.companyName || '';
        this.ruleForm.propertyType = res.data.companyManageType || '';

        this.ruleForm.unitType = this.propertyment.companyOrganType || '';
        this.ruleForm.goverBuy = this.propertyment.companyGovermentBuy || '';
        this.ruleForm.propertyFee = this.propertyment.companyContractCost || '';
        this.ruleForm.chargePerson = this.propertyment.responsiblePerson || '';
        this.ruleForm.chargePhone = this.propertyment.responsiblePersonPhone || '';

        res.data.serviceStartTime = res.data.serviceStartTime || '';
        res.data.serviceEndTime = res.data.serviceEndTime || '';
        this.ruleForm.startTime = res.data.serviceStartTime.substr(0, 10) || '';
        this.ruleForm.endTime = res.data.serviceEndTime.substr(0, 10) || '';

        this.ruleForm.remark = res.data.companyRemark || '';
        // this.HouseManageCompanyId = this.propertyment.houseManageCompanyId;
        setTimeout(() => {
          if (res.data.longitude == null || res.data.longitude == '' || res.data.longitude == undefined) {
            return false;
          }
          this.userlocation.lng = res.data.longitude;
          this.userlocation.lat = res.data.latitude;
          if (!this.isAdd && !this.hasClickMap) {
            this.addPoint(this.userlocation.lng, this.userlocation.lat);
          }
        }, 0)
      })
    },
    // 初始化地图
    mapReady() {
      let self = this;
      this.Bmap = new BMap.Map('allmap');
      let point = new BMap.Point(116.331398, 39.897445); // 初始化地图
      this.Bmap.centerAndZoom(point, 15);
      this.Bmap.enableScrollWheelZoom();
      let ac = new BMap.Autocomplete(    //建立一个自动完成的对象
        {
          input: "suggestId",
          location: this.Bmap,
          onSearchComplete: function (data) {
            if (self.courtyardId && (self.originAddress === self.ruleForm.courtyardAddress)) {
              ac.hide()
            }
          }
        }
      );
      let myValue = '';
      ac.addEventListener("onconfirm", (e) => {    //鼠标点击下拉列表后的事件
        this.hasClickMap = true;
        var _value = e.item.value;
        myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
        this.ruleForm.courtyardAddress = myValue;
        // this.originAddress = myValue;
        this.setPlace(myValue);
      });
      if (this.hasClickMap === false) {
        this.Bmap.addEventListener("click", (e) => {
          this.Bmap.clearOverlays();
          var marker = new BMap.Marker(e.point);
          this.Bmap.addOverlay(marker);
          this.userlocation = e.point;
          console.log(e.point.lng, e.point.lat)
        });
      }
      setTimeout(() => {
        ac.hide();
      }, 500)
    },



    addPoint(lng, lat) {
      this.Bmap.clearOverlays();
      let new_point = new BMap.Point(lng, lat);
      let marker = new BMap.Marker(new_point);  // 创建标注
      this.Bmap.addOverlay(marker);              // 将标注添加到地图中
      this.Bmap.panTo(new_point);
    },
    setPlace(myValue) {
      this.Bmap.clearOverlays();    //清除地图上所有覆盖物
      // this.originAddress = myValue;
      let myFun = () => {
        if (local.getResults() && local.getResults().getPoi(0) !== undefined) {
          this.userlocation = local.getResults().getPoi(0).point;    //获取第一个智能搜索的结果
          this.Bmap.centerAndZoom(this.userlocation, 18);
          this.Bmap.addOverlay(new BMap.Marker(this.userlocation));    //添加标注
          this.hasPoint = true;
        } else {
          this.hasPoint = false;
        }
      }
      var local = new BMap.LocalSearch(this.Bmap, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(myValue);
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/courtyard-manage/courtyard-list')
        }
        if (this.isBol && this.isBtn) {
          this.$router.push({ path: '/basic-information/building-manage/building-update/add', query: { id: this.id } })
        }
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
#allmap {
  width: 100%;
  height: 400px;
  font-family: "微软雅黑";
}
.table-bottom-btns {
  width: 360px;
  text-align: center;
}
.new-btn {
  width: 120px !important;
}
</style>
