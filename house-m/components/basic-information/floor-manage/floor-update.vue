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
          <table class="h-table-info th-180">
            <tr>
              <th>
                <i class="f-color-red">*</i>院落名称</th>
              <td>
                <el-form-item prop="courtyardId">
                  <el-select :disabled="paramsType === '修改楼层'" v-model="ruleForm.courtyardId" @change="getFloorSelectRequest" filterable clearable placeholder="请选择院落名称">
                    <el-option v-for="item in courtySelectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>楼座名称</th>
              <td>
                <el-form-item prop="floorId">
                  <el-select :disabled="paramsType === '修改楼层' || !ruleForm.courtyardId" v-model="ruleForm.floorId" @change="getFloorName" filterable clearable placeholder="请选择楼座名称">
                    <el-option v-for="item in floorSelectList" :key="item.floorId" :label="item.floorName" :value="item.floorId">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>选择录入方式</th>
              <td colspan="3">
                <el-radio-group v-model="ruleForm.defineFloors" @change="getFloorValue">
                  <el-radio label="NO">选择已有楼层</el-radio>
                  <el-radio label="YES">自定义楼层</el-radio>
                </el-radio-group>
              </td>
            </tr>
            <tr v-if="ruleForm.defineFloors=='NO'">
              <th>
                <i class="f-color-red">*</i>楼层</th>
              <td colspan="3">
                <div class="f-inline-block">
                  <el-form-item prop="storeysName">
                    <el-select v-model="ruleForm.storeysName" :disabled="!ruleForm.floorId" filterable clearable placeholder="请选择楼层" style="width:90%">
                      <el-option v-for="(item,index) in storeySelectList" :key="index" :label="item.storeysName" :value="item.storeysName">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr v-if="ruleForm.defineFloors=='YES'">
              <th> <i class="f-color-red">*</i>楼层</th>
              <td>
                <el-form-item prop="storeysName">
                  <el-input v-model="ruleForm.storeysName" clearable></el-input>
                </el-form-item>
              </td>
              <th><i class="f-color-red">*</i>排序值</th>
              <td>
                <el-form-item prop="floorSort">
                  <el-input v-model="ruleForm.floorSort" clearable></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>楼层平面图</th>
              <td colspan="3">
                <v-uploadPicture v-model="ruleForm.domainsPlan" title="楼层平面图" max="1" maxSize="5"></v-uploadPicture>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/basic-information/floor-manage/floor-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
            <el-button class="u-submit-btn submit-btn new-btn" v-show="this.$route.params.type === 'add'" @click="getAddDataRoomRequest" :loading="loadingroom">保存并创建房间</el-button>
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
    let floorSort = (rule, value, callback) => {
      let message = '';
      if (rule.fullField === 'floorSort') {
        message = '排序值'
      }
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`${message}应为数字，且最多保留两位小数`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`${message}不能为空`))
      }
    }
    return {
      loading: false,
      loadingroom: false,
      paramsType: '新增楼层', //标记是新增还是修改
      isBol: false, // 弹出框图形标识
      isBtn: false, //标识保存并创建房间
      id: '',
      yardid: '',
      fid: '',
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      ruleForm: {
        defineFloors: 'NO',//自定义选择楼层
        floorSort: '', //排序值
        courtyardId: '',//院落id
        floorId: '', //楼座id
        storeysId: '',//楼层id
        storeysName: '', //楼层名称
        floorName: '', //楼座名称
        domainsPlan: [] // 上传图片
      },
      custom: false,//自定义判读
      storeysPlanImgUrls: [], // 楼层图片
      rules: {
        courtyardId: [
          { required: true, message: '请选择院落名称', trigger: 'change' }
        ],
        floorId: [
          { required: true, message: '请选择楼座名称', trigger: 'change' },
        ],
        storeysName: [
          { required: true, message: '请选择楼层名称', trigger: 'change' },
        ],
        floorSort: [
          { required: true, validator: floorSort, trigger: 'change' }
        ]
      },  //验证规则
      courtySelectList: [], // 院落名称集合
      floorSelectList: [], // 楼座名称集合
      storeySelectList: [], // 楼层名称集合

    };
  },
  activated() {
    this.getSelectRequest();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      if (this.$route.query.id) {
        this.storeysId = this.$route.query.id;
      }
      this.getEditDataRequest();
      this.paramsType = '修改楼层';
    } else {
      if (this.$route.query.fid) {
        this.ruleForm.floorId = this.$route.query.fid;
        this.getStoreySelectRequest()
      }
      if (this.$route.query.cid) {
        this.ruleForm.courtyardId = this.$route.query.cid
      }
      this.getFloorSelectRequest();
      this.paramsType = '新增楼层';
    }
  },
  deactivated() {
    this.ruleForm.domainsPlan = [];
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  methods: {

    //单选按钮组楼层选值
    getFloorValue() {
      if (this.ruleForm.defineFloors == 'YES') {
        this.$refs.ruleForm.clearValidate(['storeysName']);
        this.ruleForm.storeysName = '';
      } else {
        this.$refs.ruleForm.clearValidate(['floorSort']);
        this.$refs.ruleForm.clearValidate(['storeysName']);
        this.ruleForm.storeysName = '';
        this.ruleForm.floorSort = '';
      }
    },
    // 获取楼座名称
    getFloorName(value) {
      this.$refs.ruleForm.clearValidate(['storeysName']);
      this.ruleForm.storeysName = '';
      this.floorSelectList.forEach((item, index) => {
        if (value === item.floorId) {
          this.floorName = item.floorName;
        }
      })
      this.getStoreySelectRequest()
    },
    // 新增、修改楼层
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {

          let params = {
            courtyardId: this.ruleForm.courtyardId,
            floorId: this.ruleForm.floorId,
            name: this.ruleForm.storeysName,
            customFlag: this.ruleForm.defineFloors,
            fileRequestList: this.ruleForm.domainsPlan
          }
          if (this.ruleForm.defineFloors == 'YES') {
            this.$set(params, 'sortNo', this.ruleForm.floorSort)
          }
          else {
            this.$set(params, 'sortNo', '')
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.storeys_update;
            this.$set(params, 'id', this.$route.query.id)
          } else {
            url = API.storeys_add;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            this.isBtn = false;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼层修改')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼层新增')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      }
      )
    },
    getAddDataRoomRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            courtyardId: this.ruleForm.courtyardId,
            floorId: this.ruleForm.floorId,
            name: this.ruleForm.storeysName,
            customFlag: this.ruleForm.defineFloors,
            fileRequestList: this.ruleForm.domainsPlan
          }
          if (this.ruleForm.defineFloors == 'YES') {
            this.$set(params, 'sortNo', this.ruleForm.floorSort)
          }
          else {
            this.$set(params, 'sortNo', '')
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            // 区分当前页面状态
            url = API.storeys_update;
            this.$set(params, 'id', this.$route.query.id)
          } else {
            url = API.storeys_add;
          }
          this.loadingroom = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isBtn = true;
              this.cid = res.data.courtyardId;
              this.fid = res.data.floorId;
              this.id = res.data.id;
            } else {
              this.isBol = false;
              this.isBtn = false;
            }
            this.loadingroom = false;
            this.message = res.message;
          })
        }
      }
      )
    },
    //修改详情回显楼座
    getEditDataRequest() {
      let params = {
        id: this.storeysId
      }
      this.$axiosGet(API.storeys_updateDetail, params).then(res => {
        this.ruleForm.defineFloors = res.data.customFlag;
        this.ruleForm.floorSort = res.data.sortNo;
        this.ruleForm.storeysName = res.data.name;
        this.ruleForm.courtyardId = res.data.courtyardId;
        this.ruleForm.floorId = res.data.floorId;
        this.ruleForm.floorName = res.data.floorName;;
        this.ruleForm.domainsPlan = res.data.fileResponseList;
        setTimeout(() => {
          this.getFloorSelectRequest();
          this.getStoreySelectRequest();
        }, 500)
      })
    },
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosGet(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
    // 获取楼座列表查询数据
    getFloorSelectRequest() {
      if (this.$route.params.type === 'add' && !this.$route.query.fid) {
        this.ruleForm.floorId = '';
        this.ruleForm.storeysName = '';
      }
      let params = {
        courtyardId: this.ruleForm.courtyardId,
      }
      this.$axiosGet(API.floor_queryFloorSelect, params).then(res => {
        if (res.data) {
          res.data.forEach((item, index) => [
            this.floorSelectList.push(
              {
                floorId: item.id,
                floorName: item.name
              }
            )
          ])
        }

      });
    },
    // 获取所有楼层
    getStoreySelectRequest() {
      let params = {};
      if (this.$route.params.type === 'edit') {
        // 区分当前页面状态
        params = {
          floorId: this.ruleForm.floorId,
          storeysId: this.storeysId
        }
      } else {
        params = {
          floorId: this.ruleForm.floorId,
          storeysId: ''
        }
      }
      this.$axiosGet(API.storeys_getStoreysNumSelect, params).then(res => {
        this.storeySelectList = res.data;
      });
    },
    // 修改、新增保存成功跳转页面

    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/floor-manage/floor-list')
        }
        if (this.isBol && this.isBtn) {
          this.$router.push({ path: '/basic-information/room-manage/room-update/add', query: { id: this.id, fid: this.fid, cid: this.cid } })
        }
      }, 100)
    }
  }
};
</script>

<style lang="scss" scoped>
.el-select {
  display: block;
}
.table-bottom-btns {
  width: 360px;
  text-align: center;
}
.new-btn {
  width: 120px !important;
}
</style>
