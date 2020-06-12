<template>
  <div id="room-add">
    <section class="m-main" :style="{ minHeight: height + 'px' }">
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
                <i class="f-color-red">*</i>房间位置</th>
              <td>
                <el-form-item prop="roomPos">
                  <el-cascader placeholder="请选择房间位置" :options="roomList" v-model="ruleForm.roomPos" clearable filterable></el-cascader>
                </el-form-item>
              </td>
            <tr>
              <th>
                <i class="f-color-red">*</i>房间号</th>
              <td>
                <el-form-item prop="roomNumber">
                  <el-input clearable v-model="ruleForm.roomNumber" placeholder="请输入房间号"></el-input>
                </el-form-item>
              </td>
            </tr>
            <!-- <tr>
                <th>房间类型</th>
                <td class="f-relative">
                  <el-form-item prop="roomType" class="f-absolute" style="width: calc(100% - 20px)">
                    <el-input clearable v-model="ruleForm.roomType" disabled placeholder="请输入房间类型"></el-input>
                  </el-form-item>
                  <a @click="openRoomType" style="position:relative;display: block;width: 100%;height:40px;"></a>
                </td>
              </tr> -->
            <tr>
              <th>
                使用面积</th>
              <td>
                <el-form-item prop="useArea">
                  <el-input clearable v-model="ruleForm.useArea" placeholder="请输入使用面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                建筑面积</th>
              <td>
                <el-form-item prop="buildArea">
                  <el-input clearable v-model="ruleForm.buildArea" placeholder="请输入建筑面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>房间照片</th>
              <td>
                <el-form-item prop="">
                  <v-uploadPicture v-model="ruleForm.domains" title="房间照片" max="5" maxSize="5"></v-uploadPicture>
                </el-form-item>
              </td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/basic-information/room-manage/room-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" @click="saveDate" :loading="loading">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <!--消息提示框-->
    <v-roomType ref="roomType" @getNode="getNode"></v-roomType>
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import roomType from '@/components/basic-information/room-manage/room-chose-roomtype'; // 选择房间弹出框
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片

export default {
  components: {
    'v-roomType': roomType,
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    // let useArea = (rule, value, callback) => {
    //   let message = '';
    //   if (rule.field === 'bulidArea') {
    //     message = '建筑面积'
    //   } else {
    //     message = '使用面积'
    //   }
    //   if (value) {
    //     if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
    //       callback(new Error(`${message}为最多两位小数`))
    //     } else if (value > 1000000) {
    //       callback(new Error(`${message}不能大于一百万平方`))
    //     } else {
    //       callback();
    //     }
    //   } else {
    //     callback(new Error(`${message}不能为空`))
    //   }
    // }
    let self = this;
    // 使用面积
    let useArea = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('使用面积不能为空'));
      // }
      if (!value) {
        return callback();
      }

      if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入大于0的数字，最多两位小数'));
      }
      else {
        if (value > 1000000) {
          callback(new Error('使用面积不能大于一百万平方'));
        } else {
          // callback();
          if (Number(self.ruleForm.buildArea) && Number(value) > Number(self.ruleForm.buildArea)) {
            callback(new Error('使用面积应小于等于建筑面积'))
          } else if (!Number(self.ruleForm.buildArea)) {
            callback()
          } else {
            callback()
          }
        }
      }
    }

    //建筑面积
    let buildArea = (rule, value, callback) => {
      // if (!value) {
      //   return callback(new Error('建筑面积不能为空'));
      // }
      if (!value) {
        return callback();
      }

      if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
        callback(new Error('请输入大于0的数字，最多两位小数'));
      }
      else {
        if (value > 1000000) {
          callback(new Error('建筑面积不能大于一百万平方'));
        } else {
          if (Number(self.ruleForm.useArea) && Number(value) < Number(self.ruleForm.useArea)) {
            callback(new Error('建筑面积应大于等于使用面积'))
          } else if (!Number(self.ruleForm.useArea)) {
            callback()
          } else {
            callback()
          }
        }
      }
    }
    return {
      loading: false,
      isAdd: true, // 是否是新增页面
      paramsType: '新增房间', //页面标题显示
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      height: 0, // 自定义屏幕高度
      roomId: '', // 房间ID
      roomCheckList: [], // 选择的节点数
      roomList: [],
      roomTypeList: [],
      rules: {
        roomPos: [
          { required: true, message: '请选择房间位置', trigger: 'change' }
        ],
        roomNumber: [
          { required: true, message: '请输入房间号', trigger: 'change' }
        ],
        useArea: [
          { required: false, validator: useArea, trigger: 'change' }
        ],
        buildArea: [
          { required: false, validator: buildArea, trigger: 'change' }
        ]
      },
      ruleForm: {
        domains: [], // 照片集合
        roomPos: [], // 房间位置
        roomNumber: '', // 房间号
        roomType: '', // 房间类型
        useArea: '', // 使用面积
        buildArea: '' // 建造面积
      }
    };
  },
  activated() {
    this.height = document.body.clientHeight - 145; // 设置高度自适应
    this.getSearchDate();
    if (this.$route.params.type === 'edit') {
      this.id = this.$route.query.id;
      this.storeysId = this.$route.query.storeysId;
      this.roomNo = this.$route.query.roomNo;
      this.paramsType = '修改房间';
      this.getDetail();
      this.isAdd = false;
    } else {
      if (this.$route.query.cid) {
        this.ruleForm.roomPos[0] = this.$route.query.cid;
      }
      if (this.$route.query.fid) {
        this.ruleForm.roomPos[1] = this.$route.query.fid;
      }
      if (this.$route.query.id) {
        this.ruleForm.roomPos[2] = this.$route.query.id;
      }
      this.paramsType = '新增房间';
      this.isAdd = true;
      this.roomId = '';
    }
  },
  mounted() {

  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  computed: {
  },
  methods: {
    openRoomType() {
      this.$refs.roomType.openModal(this.roomTypeList);
    },
    getSearchDate() {

      this.$axiosGet(API.room_getSelect, {}).then(res => {
        this.roomList = res.data.select;
        this.useStatusList = res.data.useStatus;
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/basic-information/room-manage/room-list')
        }
      }, 1000)
    },
    saveDate() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let roomTypeId = [];
          this.roomCheckList.forEach((item, index) => {
            roomTypeId.push(item.value);
          })
          let url = '';
          let params = {
            courtyardId: this.ruleForm.roomPos[0] || '',
            floorId: this.ruleForm.roomPos[1] || '',
            storeysId: this.ruleForm.roomPos[2] || '',
            roomNo: this.ruleForm.roomNumber,
            buildArea: this.ruleForm.buildArea || '',
            useArea: this.ruleForm.useArea || '',
            fileRequestList: this.ruleForm.domains,
            roomTypeIds: roomTypeId
          }
          if (this.isAdd) {
            url = API.room_add;
          } else {
            url = API.room_update;
            this.$set(params, 'id', this.id)
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.isAdd) {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼层新增')
              } else {
                BURYINGPOINT.buryingPoint('办公用房', '基础信息', '楼层修改')
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
    getDetail() {
      let params = {
        id: this.id,
      }
      this.$axiosGet(API.room_updateDetail, params).then(res => {
        this.roomTypeList = [];
        this.roomCheckList = [];
        this.ruleForm.roomPos = [res.data.courtyardId, res.data.floorId, res.data.storeysId];
        this.ruleForm.roomNumber = res.data.roomNo;
        this.ruleForm.buildArea = res.data.buildArea || '';
        this.ruleForm.useArea = res.data.useArea || '';
        this.ruleForm.roomType = res.data.roomBaseTypes;
        this.ruleForm.domains = res.data.fileResponse;
        res.data.houseRoomBaseTypesList.forEach((item, index) => {
          this.roomCheckList.push({
            children: null,
            label: item.roomTypeName,
            typeFlag: item.typeFlag,
            value: item.roomTypeId
          });
          if (item.typeFlag === 'TWO') {
            this.roomTypeList.push({
              children: null,
              label: item.roomTypeName,
              typeFlag: item.typeFlag,
              value: item.roomTypeId
            });
          }
        })
      })
    },
    getNode(val) {
      if (val) {
        this.roomCheckList = val;
        this.roomTypeList = [];
        let roomType = '';
        if (val.length === 2) {
          if (val[0].label === '办公室') {
            if (val[1].label === '请选择') {
              this.ruleForm.roomType = '办公室';
            } else {
              this.ruleForm.roomType = `${val[0].label}（${val[1].label}）`
            }
          } else {
            this.ruleForm.roomType = `${val[0].label}（${val[1].label}）`
          }
          this.roomTypeList.push(val[1]);
        } else {
          val.forEach((item, index) => {
            if (item.typeFlag === 'FITST') {
              roomType += item.label + '，'
            }
            if (item.typeFlag === 'TWO') {
              this.roomTypeList.push(item);
            }
          })
          this.ruleForm.roomType = roomType.substr(0, roomType.length - 1);
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#room-add {
  .el-select,
  .el-cascader {
    display: block;
  }
}
</style>
