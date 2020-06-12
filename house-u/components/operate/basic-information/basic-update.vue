<template>
  <div>
    <section class="m-main" :style="{ minHeight: height + 'px' }">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="title" :item="[title]" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{title}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle" style="padding:5px 0 10px;">
              <span></span>
              <!-- <i class="f-color-red">*</i> -->
              基本信息</h2>
          </div>
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>街道</th>
              <td>
                <el-form-item prop="street">
                  <el-input :maxlength="40" clearable placeholder="请输入房屋所在的街道名称" v-model="ruleForm.street">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>门牌号</th>
              <td>
                <el-form-item prop="houseNo">
                  <el-input :maxlength="40" clearable placeholder="请输入门牌号、楼栋号、单元室等，例如：86号" v-model="ruleForm.houseNo">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>
                地址坐落</th>
              <td colspan="3">
                <el-form-item prop="houseAddress">
                  <el-input clearable placeholder="请输入或选择房屋地址坐落" id="suggestId" v-model="ruleForm.houseAddress"></el-input>
                </el-form-item>
                <div id="allmap"></div>
                <div v-show="userlocation.lng==''" style="color: red;">请在地图上标注地点</div>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>经营面积</th>
              <td>
                <el-form-item prop="area">
                  <el-input :maxlength="40" clearable placeholder="请输入当前房屋的经营面积" v-model="ruleForm.area">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>取得方式</th>
              <td>
                <el-form-item prop="acquisitionModeName">
                  <el-select v-model="ruleForm.acquisitionModeName" clearable placeholder="请选择">
                    <el-option v-for="item in ruleForm.acquireWayList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                经营间数</th>
              <td>
                <el-form-item prop="houseNum">
                  <el-input maxlength="5" clearable placeholder="请输入当前房屋的经营间数" v-model="ruleForm.houseNum">
                    <template slot="append">间</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>产权单位</th>
              <td>
                <el-form-item prop="organName">
                  <el-input :maxlength="20" clearable placeholder="请输入产权单位" v-model="ruleForm.organName">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                权证编号</th>
              <td>
                <el-form-item prop="warrantNo">
                  <el-input :maxlength="40" clearable placeholder="请输入权证编号" v-model="ruleForm.warrantNo">
                  </el-input>
                </el-form-item>
              </td>
              <th>
                土地证号</th>
              <td>
                <el-form-item prop="landCertificateNo">
                  <el-input maxlength="40" clearable placeholder="请输入土地证号" v-model="ruleForm.landCertificateNo">
                  </el-input>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="f-margin-upd f-hidden">
            <h2 class="h-table-subtitle" style="padding:5px 0 10px;">
              <span></span>
              照片信息</h2>
          </div>
          <table class="h-table-info">
            <tr>
              <th>照片信息</th>
              <td>
                <v-uploadPicture class="avatar-uploader" v-model="ruleForm.domains" title="房屋照片" max="5" maxSize="5">
                </v-uploadPicture>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/operate/basic-information/basic-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

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
    let area = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`经营面积为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`经营面积不能大于100万`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`经营面积不能为空`))
      }
    }

    //合同年限验证
    let houseNum = (rule, value, callback) => {
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

    return {
      loading: false,
      isAdd: true, // 当前页面状态
      userlocation: {
        lng: "",  //经度
        lat: ""   //纬度
      },
      isReasonShow: false,
      propertyOrgan: [],
      reasonNotBook: '', //未入账原因
      isenable: false,
      title: '',
      ruleForm: {
        houseNum: '', //经营间数
        area: '', //经营面积
        houseNo: '', //门牌号
        street: '', //街道
        warrantNo: '', //权证编号
        landCertificateNo: '',//土地证号
        noEvidenceReason: '', //未办证原因
        list: [], //列表集合
        organName: '', //产权单位      
        houseStatus: '', //房屋状态
        propertyMentant: '', //产权办理 
        reason: '', //情况说明
        houseStatusList: [], //房屋状态
        acquisitionModeName: '', //取得方式
        acquireWayList: [], //下拉框取得方式集合
        houseAddress: "", //院落地址
        domains: [] // 上传图片
      },
      dealOwnershipId: '', //权属id
      id: '', //房屋id
      dealContractSubjectId: '', //合同标的物id
      imgUrls: [], //图片集合
      originAddress: '',
      houseDetail: {}, //房屋的详情集合
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      height: 0, // 自定义屏幕高度
      hasClickMap: false, // 有没有点击选择地址
      hasPoint: true, // 地图是否有找到点
      tableData: [], //数据集合
      msgType: '新增', // 当前页面状态 
      Bmap: undefined,
      local: undefined,
      rules: {
        isAdd: [{ required: true, message: '请选择发送类型', trigger: 'change' }],
        houseStatus: [
          { required: true, message: '请选择房屋状态', trigger: 'change' }
        ],
        idleness: [
          { required: true, message: '请选择闲置原因', trigger: 'change' }
        ],
        houseAddress: [
          { required: true, message: '请输入房产地址', trigger: 'change' }
        ],
        street: [
          { required: true, message: '请输入房屋所在街道名称', trigger: 'change' }
        ],
        houseNo: [
          { required: true, message: '请输入门牌号', trigger: 'change' }
        ],
        acquisitionModeName: [
          { required: true, message: '请选择取得方式', trigger: 'change' } //取得方式
        ],
        area: [
          { required: true, validator: area, trigger: 'change' }  // 经营面积
        ],
        houseNum: [
          { required: false, validator: houseNum, trigger: 'change' }  // 经营间数
        ],
        reason: [{ required: true, message: '请输入情况说明', trigger: 'change' },],
        organId: [
          { required: true, message: '产权单位不能为空', trigger: 'change' }
        ],
      },
      //验证规则
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
    };
  },
  activated() {
    this.getSelectRequest();
    this.height = document.body.clientHeight - 145; // 设置高度自适应
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      this.id = this.$route.query.id;
      this.getEditDataRequest(); // 修改回显页面数据
      this.isAdd = false;
      this.title = '修改经营性房产';
    } else {
      this.isAdd = true;
      this.title = '新增经营性房产';
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  mounted() {
    this.mapReady();
  },
  watch: {
    'ruleForm.houseAddress': function (value) {
      if (!value) {
        this.userlocation = {
          lng: "",  //经度
          lat: ""   //纬度
        }
        this.setPlace(value)
      }
    },
  },

  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },
    organName() {
      return this.$store.state.mainData.organName
    },

  },


  methods: {
    // 新增、修改院落
    getAddDataRequest() {
      if (this.userlocation.lng) {
        this.hasPoint = true;
      } else {
        this.hasPoint = false;
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid && this.hasPoint) {
          let params = {
            houseAddress: this.ruleForm.houseAddress, //房屋地址
            longitude: this.userlocation.lng,
            latitude: this.userlocation.lat,
            street: this.ruleForm.street,
            houseNo: this.ruleForm.houseNo,
            area: this.ruleForm.area,
            propertyOrganName: this.ruleForm.organName,
            acquisitionMode: this.ruleForm.acquisitionModeName,
            houseNum: this.ruleForm.houseNum,
            warrantNo: this.ruleForm.warrantNo,
            landCertificateNo: this.ruleForm.landCertificateNo,
            fileRequestList: this.ruleForm.domains
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            url = API.dealhouse_doUpdate;
            this.$set(params, 'id', this.$route.query.id);
          } else {
            url = API.dealhouse_doAdd;

          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('经营性房产', '基础信息', '修改')
              } else {
                BURYINGPOINT.buryingPoint('经营性房产', '基础信息', '新增')
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

    // 获取下拉框
    getSelectRequest() {
      this.$axiosGet(API.dealhouse_queryStatusAndAcquisitionList, {}).then(res => {
        this.ruleForm.acquireWayList = res.data.acquisitionModeList;
      });
    },

    //表格列表日期转换
    // dateFormat(row, column) {
    //   var date = row[column.property];
    //   if (date == undefined) {
    //     return "";
    //   }
    //   return DATEFORMAT.dateReturn(new Date(date));
    // },


    //修改获取回显
    getEditDataRequest() {
      let params = {
        houseId: this.id
      }
      this.$axiosGet(API.dealhouse_updateDetail, params).then(res => {
        if (res.data) {
          this.houseDetail = res.data.houseResponse;
          this.dealOwnershipId = this.houseDetail.dealOwnershipId;
          this.ruleForm.houseAddress = this.houseDetail.houseAddress;
          this.ruleForm.street = this.houseDetail.street;
          this.ruleForm.houseNo = this.houseDetail.houseNo;
          this.ruleForm.area = this.houseDetail.area;
          this.ruleForm.acquisitionModeName = this.houseDetail.acquisitionMode;
          // this.originAddress = this.ruleForm.houseAddress;
          this.ruleForm.houseNum = this.houseDetail.houseNum || '';
          this.ruleForm.organName = this.houseDetail.propertyOrganName;
          this.ruleForm.warrantNo = this.houseDetail.warrantNo;
          this.ruleForm.landCertificateNo = this.houseDetail.landCertificateNo;
          this.ruleForm.domains = res.data.fileResponseList;

          setTimeout(() => {
            this.getSelectRequest();
          }, 0)
        }
        setTimeout(() => {
          this.userlocation.lng = this.houseDetail.longitude;
          this.userlocation.lat = this.houseDetail.latitude;
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
            if (self.courtyardId && (self.originAddress === self.ruleForm.houseAddress)) {
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
        this.ruleForm.houseAddress = myValue;
        // this.ruleForm.contractSubject = myValue;
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
          this.$router.push('/operate/basic-information/basic-list')
        }
      }, 1000)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
#allmap {
  width: 100%;
  height: 400px;
  font-family: "微软雅黑";
}
.h-table-info {
  .el-select {
    display: block;
  }
}
.el-table {
  th {
    div {
      line-height: auto !important;
    }
  }
}
</style>