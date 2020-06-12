<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="会议室信息" :item="breadcrumbItem"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>新增会议室</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <!-- 表单正文 -->
      <div class="h-tab-content" style="padding-bottom: 20px;">
        <el-form ref="ruleForm" :model="ruleForm">
          <table class="h-table-info h-table-info-meet">
            <tr>
              <th width="10%">
                <i class="f-color-red">*</i>会议室名称
              </th>
              <td width="40%">
                <el-form-item
                  prop="name"
                  :rules="{ required: true, message: '会议室名称不能为空', trigger: 'change' }"
                >
                  <el-input v-model="ruleForm.name" placeholder="请输入会议室名称，不超过20个字符" :maxlength="20"></el-input>
                </el-form-item>
              </td>
              <th width="10%">
                <i class="f-color-red">*</i>容纳人数
              </th>
              <td width="40%">
                <el-form-item
                  prop="capacity"
                  :rules="{ validator: maxPeopleValidator, trigger: 'change' }"
                >
                  <el-input v-model="ruleForm.capacity" placeholder="请输入容纳人数，不超过4位数" :maxlength="4">
                    <template slot="append">人</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>会议室面积
              </th>
              <td>
                <el-form-item
                  prop="area"
                  :rules="{ validator: meetingRoomAreaValidator, trigger: 'change' }"
                >
                  <el-input v-model="ruleForm.area" placeholder="请输入会议室面积">
                    <template slot="append">㎡</template>
                  </el-input>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>地址
              </th>
              <td>
                <el-form-item
                  prop="address"
                  :rules="{ required: true, message: '地址不能为空', trigger: 'change' }"
                >
                  <el-input v-model="ruleForm.address" placeholder="请输入详细地址"></el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>设备</th>
              <td>
                <el-form-item prop="equip">
                  <el-checkbox-group v-model="ruleForm.equip" @change="showOtherEquipClick">
                    <el-checkbox label="空调" name="type"></el-checkbox>
                    <el-checkbox label="投影仪" name="type"></el-checkbox>
                    <el-checkbox label="话筒" name="type"></el-checkbox>
                    <el-checkbox label="电脑" name="type"></el-checkbox>
                    <el-checkbox label="其它" name="type"></el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>会议室类型
              </th>
              <td>
                <el-select clearable filterable v-model="ruleForm.type" placeholder="请选择会议室类型">
                  <el-option value="0" name="type" label="超大型会议室"></el-option>
                  <el-option value="1" label="大型会议室"></el-option>
                  <el-option value="2" label="中型会议室"></el-option>
                  <el-option value="3" label="小型会议室"></el-option>
                  <el-option value="4" label="微型会议室"></el-option>
                </el-select>
              </td>
            </tr>
            <tr v-if="isShowOther">
              <th>其它设备</th>
              <td colspan="3">
                <el-form-item prop="otherEquip">
                  <el-input
                    v-model="ruleForm.otherEquip"
                    type="textarea"
                    placeholder="其他设备输入，不超过100字"
                    :maxlength="100"
                  ></el-input>
                </el-form-item>
                <div class="f-text-right">{{ruleForm.otherEquip.length}}/100</div>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remark">
                  <el-input
                    v-model="ruleForm.remark"
                    type="textarea"
                    placeholder="请输入备注，不超过200字"
                    :maxlength="200"
                  ></el-input>
                </el-form-item>
                <div class="f-text-right">{{ruleForm.remark ? ruleForm.remark.length : ''}}/200</div>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>会议室图片
              </th>
              <td colspan="3">
                <v-upload-picture v-model="ruleForm.meetImgList" title="会议室图片" max="5" maxSize="10"></v-upload-picture>
                <div
                  v-show="isHasImg"
                  style="font-size:12px;color: #F56C6C;padding-top: 5px"
                >会议室图片不能为空</div>
              </td>
            </tr>
            <tr>
              <th>
                <i class="f-color-red">*</i>会议室封面
              </th>
              <td colspan="3">
                <v-uploadPicture v-model="ruleForm.meetCoveList" title="会议室封面" max="1" maxSize="10"></v-uploadPicture>
                <div
                  v-show="isHasCover"
                  style="font-size:12px;color: #F56C6C;padding-top: 5px"
                >会议室封面不能为空</div>
              </td>
            </tr>
          </table>
          <div class="f-text-center" style="margin-top: 20px;">
            <el-button class="u-submit-btn cancel-btn" @click="$router.go(-1)">返回</el-button>
            <el-button class="u-submit-btn submit-btn" @click="submitClick" :loading="loading">确定</el-button>
          </div>
        </el-form>
      </div>
    </section>
    <zl-prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></zl-prompt>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbItem: [],
      YPromptShow: false,
      message: "",
      isBol: false,
      isHasImg: false,
      isHasCover: false,
      loading: false,
      ruleForm: {
        name: "", // 会议室名称
        capacity: "", // 容纳人数
        area: "", // 会议室面积
        address: "", // 地址
        type: '', // 会议室类型
        equip: [], // 设备
        otherEquip: "", // 其他设备
        remark: "", // 备注
        meetImgList: [], // 会议室图片
        meetCoveList: "" // 会议室封面
      },
      isShowOther: false
    };
  },
  activated() {
    this.breadcrumbItem = ["会议室管理", "会议室信息", "新增"];
    if (this.$route.params.type == "edit") {
      this.breadcrumbItem = ["会议室管理", "会议室信息", "修改"];
      this.getDetail();
    }
    this.$refs.ruleForm.resetFields();
    this.ruleForm.meetImgList = []; // 会议室图片
    this.ruleForm.meetCoveList = ""; // 会议室封面
  },
  watch: {
    "ruleForm.meetImgList": function(val) {
      // console.log('val',val)
      if (val.length > 0) {
        this.isHasImg = false;
      } else {
        // this.isHasImg = true;
        // console.log('isHasImg',this.isHasImg)
      }
    },
    "ruleForm.meetCoveList": function(val) {
      if (val.length > 0) {
        this.isHasCover = false;
      } else {
        this.isHasCover = true;
      }
    }
  },
  methods: {
    showOtherEquipClick(value) {
      if (value.indexOf("其它") > -1) {
        this.isShowOther = true;
      } else {
        this.isShowOther = false;
      }
    },
    // 获取订单详情
    getDetail() {
      let params = {
        id: this.$route.query.id
      };
      this.$axiosGet(API.roomInfo_roomInfoDetail, params).then(res => {
        if (res.status == 200) {
          this.ruleForm.name = res.data.name;
          this.ruleForm.capacity = res.data.capacity;
          this.ruleForm.area = res.data.area;
          this.ruleForm.address = res.data.address;
          this.ruleForm.remark = res.data.remark;
          this.ruleForm.type = res.data.type.toString();
          this.ruleForm.equip = res.data.equip.split(",");
          this.ruleForm.meetCoveList = [res.data.picture];
          res.data.attachmentList.forEach((item, index) => {
            this.ruleForm.meetImgList.push(item.attachUrl);
          });
        }
      });
    },
    // 提交
    submitClick() {
      this.$refs.ruleForm.validate(valid => {
        // this.loading = true;
        if (this.ruleForm.meetImgList.length > 0) {
          this.isHasImg = false;
        } else {
          this.isHasImg = true;
        }
        if (this.ruleForm.meetCoveList.length > 0) {
          this.isHasCover = false;
        } else {
          this.isHasCover = true;
        }
        let meetImgList = [];
        this.ruleForm.meetImgList.forEach((item, index) => {
          meetImgList.push(item.url);
        });
        // if (valid && !this.isHasImg && !this.isHasCover) {
        if (valid) {
          // this.loading = true;
          let meetUrl = "";
          let params = {
            type:'0',//会议室使用类型
            name: this.ruleForm.name,
            capacity: this.ruleForm.capacity,
            area: this.ruleForm.area,
            address: this.ruleForm.address,
            equip: this.ruleForm.equip.join(","),
            otherEquip: this.ruleForm.otherEquip,
            remark: this.ruleForm.remark,
            size: this.ruleForm.type,//会议室类型
           
            otherImg: this.ruleForm.meetImgList.join()
          };
          if (this.$route.params.type == "add") {
            // 新增
            meetUrl = API.roomInfo_doCreateRoomInfo;
            params.picture=this.ruleForm.meetCoveList[0]//上传封面图片
          } else if (this.$route.params.type == "edit") {
            // 编辑
            meetUrl = API.roomInfo_doUpdateRoomInfo;
            this.$set(params, "id", this.$route.query.id);
            params.attachImg=this.ruleForm.meetCoveList[0]//上传封面图片
          }

          this.$axiosJsonPost(meetUrl, params).then(res => {
            if (res.status === 200) {
              this.isBol = true;
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.YPromptShow = true;
            this.message = res.message;
          });
        }
      });
    },
    // 操作成功弹出框回调方法
    YPromptClick() {
      if (this.isBol) {
        this.$refs.ruleForm.resetFields();
        this.$router.push({ path: "/meet-room-manage/meet-room-list" });
      }
    },
    maxPeopleValidator(rule, value, callback) {
      if (!value) {
        callback(new Error("容纳人数不能为空"));
      } else if (!/^(\d|([1-9]\d+))?$/.test(value)) {
        callback(new Error("容纳人数只能为整数"));
      } else if (!(value > 0)) {
        callback(new Error("容纳人数只能大于零"));
      } else {
        callback();
      }
    },
    meetingRoomAreaValidator(rule, value, callback) {
      if (!value) {
        callback(new Error("会议室面积不能为空"));
      } else if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
        callback(new Error("会议室面积只能为最多两位小数的有效数字"));
      } else if (value > 1000000) {
        callback(new Error("会议室面积不能大于一百万平方"));
      } else {
        callback();
      }
    },

    deactivated() {
      this.ruleForm = {
        meetingName: "", // 会议室名称
        maxPeople: "", // 容纳人数
        meetingRoomArea: "", // 房间面积
        address: "", // 地址
        type: 0, // 会议室类型
        equip: [], // 设备
        otherEquip: "", // 其他设备
        remark: "", // 备注
        meetImgList: [], // 会议室图片
        meetCoveList: "" // 会议室封面
      };
      this.$refs.ruleForm.resetFields();
    }
  }
};
</script>

<style>
</style>
