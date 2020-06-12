<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb :title="paramsType" :item="[paramsType]" type="1"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{paramsType}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>院落名称</th>
              <td>
                <el-form-item prop="courtyardId">
                  <el-select :disabled="paramsType === '修改楼座'" v-model="ruleForm.courtyardId" filterable clearable placeholder="请选择院落名称">
                    <el-option v-for="item in courtySelectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>楼座名称</th>
              <td>
                <el-form-item prop="floorName">
                  <el-input :maxlength="40" clearable placeholder="请输入" v-model="ruleForm.floorName"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
               建筑结构</th>
              <td>
                <el-form-item>
                  <el-select v-model="ruleForm.dicValue" filterable clearable placeholder="请选择建筑结构">
                    <el-option v-for="item in houseStructure" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>建造年份</th>
              <td>
                <el-form-item>
                  <el-date-picker v-model="ruleForm.architecturalDate" type="year" placeholder="选择年" clearable>
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>总建筑面积</th>
              <td>
                <el-form-item prop="allbuildArea">
                  <el-input clearable v-model="ruleForm.allbuildArea" placeholder="请输入">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                总占地面积</th>
              <td>
                <el-form-item prop="allcoveredArea">
                  <el-input clearable v-model="ruleForm.allcoveredArea" placeholder="请输入">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <el-tooltip class="item" effect="dark" content="建筑楼层会影响楼层的创建" placement="top-start">
                  <i>
                    <i class="f-color-red">*</i>地上建筑层数</i>
                </el-tooltip>
              </th>
              <td>
                <el-form-item prop="upFloorNumber">
                  <el-input clearable v-model="ruleForm.upFloorNumber" placeholder="请输入">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <el-tooltip class="item" effect="dark" content="建筑楼层会影响楼层的创建" placement="top-start">
                  <i>
                    <i class="f-color-red">*</i>地下建筑层数</i>
                </el-tooltip>
              </th>
              <td>
                <el-form-item prop="downFloorNumber">
                  <el-input clearable placeholder="请输入" v-model="ruleForm.downFloorNumber">
                    <template slot="append">层</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <th>地上面积</th>
              <td>
                <el-form-item prop="upArea">
                  <el-input clearable v-model="ruleForm.upArea" placeholder="请输入">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>地下面积</th>
              <td>
                <el-form-item prop="downArea">
                  <el-input clearable v-model="ruleForm.downArea" placeholder="请输入">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>取得方式</th>
              <td>
                <el-form-item prop="obtainWay">
                  <el-select v-model="ruleForm.obtainWay" filterable clearable placeholder="请选择">
                    <el-option v-for="item in obtainWayList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
               取得日期</th>
              <td colspan="3">
                <el-form-item>
                  <el-date-picker v-model="ruleForm.obtainDate" type="date" placeholder="选择日期" clearable>
                  </el-date-picker>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remark">
                  <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.remark" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.remark.length}}/200</div>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>照片信息</th>
              <td colspan="3">
                <v-uploadPicture v-model="ruleForm.imgUrls" title="楼座照片" max="5" maxSize="5"></v-uploadPicture>
              </td>
            </tr>
          </table>

          <div class="table-bottom-btns f-hidden">
            <router-link to="/basic-information/building-manage/building-list">
              <el-button class="u-submit-btn cancel-btn">
                取消
              </el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn"  @click="getAddDataRequest" :loading="loading">保存</el-button>
            <el-button class="u-submit-btn submit-btn new-btn" v-show="this.$route.params.type === 'add'" @click="getAddDataFloorRequest" :loading="loading">保存并创建楼层</el-button>
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
export default {
  components: {
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    let self = this;

    //验证正整数+0
    let checkFloorNumber = (rule, value, callback) => {
      let reg = /^(0|[1-9][0-9]*)$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('地下建筑层数大于等于0的正整数'))
        } else if (value > 1000) {
          callback(new Error(`地下建筑层数不能大于一千层`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`地下建筑层数不能为空`))
      }
    };
    //验证正整数+0
    let checkupNumber = (rule, value, callback) => {
      let reg = /^([1-9][0-9]*)$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('地上建筑层数大于0的正整数'))
        } else if (value > 1000) {
          callback(new Error(`地上建筑层数不能大于一千层`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`地上建筑层数不能为空`))
      }
    };


    let buildArea = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'allbuildArea') {
        message = '总建筑面积'
      } else if (rule.fullField === 'upArea') {
        message = '地上面积'
      } else if (rule.fullField === 'downArea') {
        message = '地下面积'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}应为数字，且最多保留两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`))
      }
    }


    let allcoveredArea = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'allcoveredArea') {
        message = '总占地面积'
      } 
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}应为数字，且最多保留两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方`))
        } else {
          callback();
        }
      } else {
        callback()
      }
    }

    let upArea = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'upArea') {
        message = '地上面积'
      } else if (rule.fullField === 'downArea') {
        message = '地下面积'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}应为数字，且最多保留两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`${message}不能大于一百万平方`))
        } else {
          callback();
        }
      } else {
        callback()
      }
    }

    let completionDate = (rule, value, callback) => {
      if (value) {
        if (self.ruleForm.architecturalDate) {
          if (value < self.ruleForm.architecturalDate) {
            callback(new Error('竣工日期不能小于建造年份'))
          } else {
            callback()
          }
        }
        if (self.ruleForm.putUseDate) {
          if (value > self.ruleForm.putUseDate) {
            callback(new Error('竣工日期不能大于投入使用日期'))
          } else {
            callback();
          }
        }
      } else {
        callback();
      }
    }
    let architecturalDate = (rule, value, callback) => {
      if (value) {
        if (self.ruleForm.completionDate && value > self.ruleForm.completionDate) {
          callback(new Error('建造年份不能大于竣工日期'))
        } else if (!self.ruleForm.completionDate) {
          if (self.ruleForm.putUseDate && value > self.ruleForm.putUseDate) {
            callback(new Error('建造年份不能大于投入使用日期'))
          } else if (!self.ruleForm.putUseDate) {
            callback()
          }
        }
      }
      else {
        callback()
      }
    }
    return {
      loading: false,
      loadingfloor: false,
      id: '', // 修改id
      fid: '',
      cid: '',
      isClose: false, //标记是否修改
      isBtn: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      courtySelectList: [],  //院落名称集合
      houseStructure: [], //建筑结构集合
      obtainWayList: [], //取得方式集合
      paramsType: '新增楼座', //页面标题显示
      ruleForm: {
        upArea: '', //地上面积
        downArea: '', //地下面积
        obtainWay: '', //取得方式
        obtainDate: '', //取得日期
        floorId: '', //楼座id
        architecturalDate: '', //建筑年份
        courtyardId: '', // 院落ID
        dicValue: '',//建筑结构value
        allbuildArea: '', //总建筑面积
        allcoveredArea: '', //总占地面积
        floorName: '',//楼座名称
        upFloorNumber: '', //地上建筑层数
        downFloorNumber: '',//地下建筑层数
        remark: '', //备注
        imgUrls: []  //上传图片集合
      },
      rules: {
        obtainWay: [
          { required: true, message: '取得方式不能为空', trigger: 'change' }
        ],
        dicValue: [
          { required: true, message: '建筑结构不能为空', trigger: 'change' }
        ],
        courtyardId: [
          { required: true, message: '院落名称不能为空', trigger: 'change' },
        ],
        allbuildArea: [
          { required: true, validator: buildArea, trigger: 'change' },
        ],
        allcoveredArea: [
          { required: false, validator: allcoveredArea, trigger: 'change' },
        ],
        upArea: [
          { required: false, validator: upArea, trigger: 'change' },
        ],
        downArea: [
          { required: false, validator: upArea, trigger: 'change' },
        ],
        obtainDate: [
          { required: true, message: '取得日期不能为空', trigger: 'change' },
        ],
        architecturalDate: [
          { required: false, validator: architecturalDate, trigger: 'change' },
        ],
        floorName: [
          { required: true, message: '楼座名称不能为空', trigger: 'change' }
        ],
        upFloorNumber: [
          { required: true, validator: checkupNumber, trigger: 'change' }
        ],
        downFloorNumber: [
          { required: true, validator: checkFloorNumber, trigger: 'change' }
        ]
      },
    };
  },
  activated() {
    this.getSelectRequest();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.floorId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = '修改楼座';
    } else {
      this.paramsType = '新增楼座';
      if (this.$route.query.id) {
        this.ruleForm.courtyardId = this.$route.query.id;
      }
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.ruleForm.courtyardId = '';
    this.ruleForm.floorName = '';
    this.ruleForm.dicValue = '';
    this.ruleForm.buildArea = '';
    this.ruleForm.architecturalDate = '';
    this.ruleForm.obtainDate = '';
    this.ruleForm.upFloorNumber = '';
    this.ruleForm.downFloorNumber = '';
    this.ruleForm.obtainWay = '';
    this.ruleForm.imgUrls = [];
    this.$destroy();
  },
  methods: {
    // 获取院落查询数据
    getSelectRequest() {
      this.$axiosGet(API.floor_getAddSelect, {}).then(res => {
        this.courtySelectList = res.data.courtyardSelect;
        this.houseStructure = res.data.houseStructure;
        this.obtainWayList = res.data.obtainWay;

      });
    },
    // 新增、修改楼座
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            // floorId: this.$route.query.id,
            courtyardId: this.ruleForm.courtyardId,//院落id
            name: this.ruleForm.floorName,//楼座名称
            houseStructure: this.ruleForm.dicValue || '',//建筑结构
            buildArea: this.ruleForm.allbuildArea,//总建筑面积
            landArea: this.ruleForm.allcoveredArea || '',//总占地面积
            architecturalDate: (FORMATGET.formatGET(this.ruleForm.architecturalDate)).substr(0, 4),//建造年份
            upFloorNumber: this.ruleForm.upFloorNumber,//地上建筑层数
            downFloorNumber: this.ruleForm.downFloorNumber,//地下建筑层数
            upArea: this.ruleForm.upArea,//地上面积
            downArea: this.ruleForm.downArea,//地下面积
            obtainWay: this.ruleForm.obtainWay,//取得方式
            obtainDate: FORMATGET.formatGET(this.ruleForm.obtainDate),//取得日期
            remark: this.ruleForm.remark,//备注
            fileRequestList: this.ruleForm.imgUrls
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.floor_update;
            params.id = this.floorId
          } else {
            url = API.floor_add;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼座修改')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼座新增')
              }
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      });
    },

    getAddDataFloorRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            // floorId: this.$route.query.id,
            courtyardId: this.ruleForm.courtyardId,
            name: this.ruleForm.floorName,//楼座名称
            houseStructure: this.ruleForm.dicValue || '',
            buildArea: this.ruleForm.allbuildArea,
            landArea: this.ruleForm.allcoveredArea || '',
            architecturalDate: (FORMATGET.formatGET(this.ruleForm.architecturalDate)).substr(0, 4),
            floorName: this.ruleForm.floorName,
            upFloorNumber: this.ruleForm.upFloorNumber,
            downFloorNumber: this.ruleForm.downFloorNumber,
            upArea: this.ruleForm.upArea,
            downArea: this.ruleForm.downArea,
            obtainWay: this.ruleForm.obtainWay,
            obtainDate: FORMATGET.formatGET(this.ruleForm.obtainDate),
            remark: this.ruleForm.remark,
            imgUrls: JSON.stringify(this.ruleForm.imgUrls)
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.floor_update;
          } else {
            url = API.floor_add;
          }
          this.loadingfloor = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
              this.isBtn = true;
              this.fid = res.data.id;
              this.cid = res.data.courtyardId;
            } else {
              this.isBol = false;
              this.isClose = false;
              this.isBtn = false;
            }
            this.loadingfloor = false;
            this.message = res.message;
          })
        }
      });
    },
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {  
        id: this.floorId
      }
      this.$axiosGet(API.floor_updateDetail, params).then(res => {
        this.ruleForm.floorId = res.data.id;
        this.ruleForm.courtyardId = res.data.courtyardId;
        this.ruleForm.floorName = res.data.name;
        this.ruleForm.dicValue = res.data.houseStructure || '';
        this.ruleForm.allbuildArea = res.data.buildArea;
        this.ruleForm.allcoveredArea = res.data.landArea || '';
        this.ruleForm.architecturalDate = res.data.architecturalDate;
        this.ruleForm.upArea = res.data.upArea || '';
        this.ruleForm.downArea = res.data.downArea || '';
        this.ruleForm.obtainWay = res.data.obtainWay;
        this.ruleForm.upFloorNumber = res.data.upFloorNumber;
        this.ruleForm.downFloorNumber = res.data.downFloorNumber.toString();
        if (res.data && res.data.obtainDate) {
          this.ruleForm.obtainDate = res.data.obtainDate.substr(0,10);
        } else {
          this.ruleForm.obtainDate = '';
        }
        this.ruleForm.remark = res.data.remark || '';
        this.ruleForm.imgUrls = res.data.fileResponseList;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/building-manage/building-list')
        }
        if (this.isBol && this.isBtn) {
          this.$router.push({ path: '/basic-information/floor-manage/floor-update/add', query: { fid: this.fid, cid: this.cid } })
        }
      }, 1000)

    }

  }
};
</script>

<style lang="scss" scoped>
.h-table-info {
  .el-select {
    display: block;
  }
}
.table-bottom-btns {
  width: 360px;
}
.new-btn {
  width: 120px !important;
}
</style>
