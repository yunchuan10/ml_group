<template>
  <div id="trip-update">
    <section class="section-content">
      <div class="reception-form">
        <div class="h-tab-content" style="padding-bottom: 20px;">
          <div class="h-table-title">
            <h2>住宿方案</h2>
            <p class="f-color-red">（*为必填项，请检查后提交！)</p>
          </div>

          <button
            v-show="type=='add'"
            style="margin-left: 0;"
            class="u-bread-btn"
            @click.prevent="liveAdd"
          >
            <i
              class="el-icon-circle-plus-outline"
              style="margin:-2px 4px 0 0;vertical-align: middle;color: #409EFF;font-size: 16px;font-weight: bold;color: #2f70ff;"
            ></i>添加房间
          </button>

          <div
            v-show="type == 'edit'"
            class="form-options"
            style="align-items: center;margin-top: 20px;"
          >
            <h5 class="text-h5">子方案号：{{subPlanNo}}</h5>
          </div>

          <!-- 空列表 -->
          <div class="m-programme-null" v-show="liveForm.addAccommodationPlanList.length<=0">
            <img :src="$store.state.imgPath.programmeNull" alt="方案详情" />
            <p>暂未添加住宿方案！</p>
          </div>

          <el-form ref="liveForm" :model="liveForm">
            <div v-for="(item ,index) in liveForm.addAccommodationPlanList" :key="index">
              <div class="form-options" style="align-items: center;margin-top: 20px;">
                <h5 v-show="type=='add'" class="text-h5">房间{{(index+1)}}</h5>
                <span
                  v-show="type=='add'"
                  v-if="item.carNum!=1"
                  class="u-bread-text"
                  @click="deleteItemsThree(item, index)"
                >
                  <i class="iconfont icon-circle-remove">删除房间</i>
                </span>
              </div>

              <table class="h-table-info">
                <tr>
                  <th>
                    <i class="f-color-red">*</i>入住时间
                  </th>
                  <td>
                    <el-form-item
                      :prop="'addAccommodationPlanList.'+index+'.validTime'"
                      :rules="liveRules.validTime"
                    >
                      <el-date-picker
                        v-model="item.stayStartTime"
                        type="datetime"
                        placeholder="请选择开始时间"
                      ></el-date-picker>
                      <span style="margin: 0 5px;">-</span>
                      <el-date-picker
                        v-model="item.stayEndTime"
                        type="datetime"
                        placeholder="请选择结束时间"
                      ></el-date-picker>
                    </el-form-item>
                  </td>
                  <th>
                    <i class="f-color-red">*</i>入住酒店
                  </th>
                  <td>
                    <el-form-item
                      :prop="'addAccommodationPlanList.'+index+'.hotelId'"
                      :rules="liveRules.hotel"
                    >
                      <div class="f-input-width">
                        <el-select v-model="item.hotelId" placeholder="选择入住酒店" style="width:100%">
                          <el-option
                            v-for="(item, index) in hotelInfoList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </td>
                </tr>
                <tr>
                  <th>
                    <i class="f-color-red">*</i>入住房型
                  </th>
                  <td>
                    <el-form-item
                      :prop="'addAccommodationPlanList.'+index+'.roomType'"
                      :rules="liveRules.apartment"
                    >
                      <div class="f-input-width">
                        <el-select v-model="item.roomType" placeholder="选择入住房型" style="width:100%">
                          <el-option
                            v-for="(item, index) in roomTypeList"
                            :key="index"
                            :label="item.name"
                            :value="item.value"
                          ></el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                  </td>
                  <th>备注</th>
                  <td>
                    <div class="form-options">
                      <div class="f-input-width">
                        <el-form-item>
                          <el-input v-model="item.remark" placeholder="请输入备注"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </td>
                  <!-- <th>
                    <i class="f-color-red">*</i>房型数量
                  </th>
                  <td>
                    <div class="form-options">
                      <div class="f-input-width">
                        <el-form-item
                          :prop="'addAccommodationPlanList.'+index+'.roomNum'"
                          :rules="liveRules.apartmentNum"
                        >
                          <el-input v-model="item.roomNum" type='number' placeholder="房型数量"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </td> -->
                </tr>

                <tr>
                  <th>
                    <i class="f-color-red"></i>入住人员
                  </th>
                  <td colspan="6">
                    <el-form-item :prop="'addAccommodationPlanList.'+index+'.roomPersons'">
                      <el-input
                        @focus="setPerson(index)"
                        :readonly="true"
                        v-model="item.roomPersons"
                        placeholder="入住人员"
                      ></el-input>
                    </el-form-item>
                  </td>
                </tr>
              </table>
            </div>
          </el-form>
          <div
            class="f-text-center"
            style="margin-top: 15px;"
            v-show="liveForm.addAccommodationPlanList.length>0"
          >
            <el-button class="u-submit-btn cancel-btn" @click="carCommit(0)">保 存</el-button>
            <el-button class="u-submit-btn submit-btn" @click="carCommit(1)">提 交</el-button>
          </div>
        </div>
      </div>

      <el-dialog title="选择人员" :visible.sync="dialogVisible" width="660px">
        <el-form ref="ruleForm">
          <div class="f-hidden dialog-person">
            <div class="f-pull-left person-box">
              <h2>未选人员</h2>
              <div class="padding10">
                <el-tree
                  node-key="id"
                  :default-checked-keys="defaultKeys"
                  class="filter-tree"
                  :data="dataList"
                  @check="getCheckedNodes"
                  show-checkbox
                  default-expand-all
                  ref="tree2"
                ></el-tree>
              </div>
            </div>
            <div class="f-pull-right person-box">
              <h2>已选人员</h2>
              <ul class="selectionPerson">
                <li v-for="(item,index) in selectNodeList" :key="index">{{item.label}}</li>
              </ul>
            </div>
          </div>
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible= false">取 消</el-button>
          <el-button type="primary" @click="setPersonSure">确 定</el-button>
        </span>
      </el-dialog>
    </section>
  </div>
</template>

<script>
let accommodationPlan = {
  hotelId: "",
  hotelName: "",
  jsonPerson: {},
  planId: "",
  remark: "",
  roomNum: "",
  roomPersons: "",
  roomType: "",
  stayEndTime: "",
  stayStartTime: ""
};

export default {
  data() {
    let validTime = (rule, value, callback) => {
      let field =
        (rule.field || "")
          .replace("addAccommodationPlanList.", "")
          .replace(".validTime", "") * 1;
      let startT = (this.liveForm.addAccommodationPlanList[field] || {})
        .stayStartTime;
      let endT = (this.liveForm.addAccommodationPlanList[field] || {})
        .stayEndTime;
      if (!startT) {
        callback(new Error("预计开始时间不能为空"));
      } else if (!endT) {
        callback(new Error("预计结束时间不能为空"));
      } else {
        let start = new Date(startT).getTime() * 1;
        let end = new Date(endT).getTime() * 1;
        if (start > end) {
          callback(new Error("结束时间不得早于开始时间"));
        } else {
          callback();
        }
      }
    };

    return {
      id: this.$route.query.id || "", // 方案id
      type: this.$route.query.type || "",
      planNo: this.$route.query.planNo || "", // planNo
      planSubId: this.$route.query.planSubId || "", // planSubId

      subPlanNo: "", //子方案号
      dialogVisible: false,

      secIndex: 0, // 当前操作的index

      // 默认选中人员
      defaultKeys: [],

      // 已选人员
      selectNodeList: [],

      // 人员列表数据
      dataList: [],

      // 酒店列表
      hotelInfoList: [],

      // 房间类型
      roomTypeList: [],

      liveForm: {
        addAccommodationPlanList: [
          {
            hotelId: "",
            hotelName: "",
            jsonPerson: {},
            planId: "",
            remark: "",
            roomNum: "",
            roomPersons: "",
            roomType: "",
            stayEndTime: "",
            stayStartTime: ""
          }
        ],
        planNo: "",
        state: ""
      },

      liveRules: {
        validTime: [
          { required: true, validator: validTime, trigger: "change" }
        ],
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
        apartmentNum: [
          { required: true, message: "房型数量不能为空", trigger: "change" }
        ],
        staff: [
          { required: true, message: "请输入入住人员", trigger: "change" }
        ]
      }
    };
  },
  activated() {
    this.getPlanDetail(); //获取方案详情， 只在编辑时候获取
    this.getDlist();
    this.getPlanPersonList();
    this.hotelInfos();
  },
  deactivated() {
    this.$destroy();
  },
  methods: {
    //获取方案详情， 只在编辑时候获取
    getPlanDetail() {
      if (this.type != "edit") {
        return;
      }
      let planSubId = "/" + this.planSubId;
      this.$axiosGet(API.planAccommodation_echo + planSubId).then(res => {
        if (res && res.data) {
          let addvehicle = res.data;
          if (typeof addvehicle.jsonPerson == "string") {
            addvehicle.jsonPerson = JSON.parse(addvehicle.jsonPerson);
          }
          this.subPlanNo = addvehicle.subPlanNo;
          this.liveForm.addAccommodationPlanList = [];
          this.liveForm.addAccommodationPlanList.push(addvehicle);
        }
      });
    },

    // 获取房间类型字典
    getDlist() {
      let code = "/D03";
      this.$axiosGet(API.sysDicItem_getItemList + code).then(res => {
        if (res && res.data) {
          this.roomTypeList = res.data.D03 || [];
        }
      });
    },

    hotelInfos() {
      //酒店
      this.$axiosGet(API.hotelInfo_getList).then(res => {
        if (res && res.data) {
          this.hotelInfoList = res.data || [];
        }
      });
    },

    // 获取人员列表
    getPlanPersonList() {
      this.$axiosGet(API.planPerson_getPlanPersonList + "/" + this.id).then(
        res => {
          let fromData = [];
          let masterGuestOpt = {
            id: "parent_level_d1",
            label: "主宾",
            children: []
          };
          let accompanyPersonOpt= {
            id: "parent_level_d2",
            label: "来宾",
            children: []
          };
          let followGuestOpt = {
            id: "parent_level_d3",
            label: "陪同人员",
            children: []
          };
          if (res && res.data) {
            let masterGuest = res.data.masterGuest || []; //主宾
            let followGuest = res.data.followGuest || []; //来宾
            let accompanyPerson = res.data.accompanyPerson || []; //陪同

            if (masterGuest.length > 0) {
              masterGuest = masterGuest.map(item => {
                return {
                  id: item.id,
                  label: item.personName,
                  groupId: "parent_level_d1",
                  children: null
                };
              });
              masterGuestOpt.children = masterGuest;
              fromData.push(masterGuestOpt);
            }

            if (accompanyPerson.length > 0) {
              accompanyPerson = accompanyPerson.map(item => {
                return {
                  id: item.id,
                  label: item.personName,
                  groupId: "parent_level_d3",
                  children: null
                };
              });
              accompanyPersonOpt.children = accompanyPerson;
              fromData.push(accompanyPersonOpt);
            }

            if (followGuest.length > 0) {
              followGuest = followGuest.map(item => {
                return {
                  id: item.id,
                  label: item.personName,
                  groupId: "parent_level_d2",
                  children: null
                };
              });
              followGuestOpt.children = followGuest;
              fromData.push(followGuestOpt);
            }
            this.dataList = fromData;
          }
        }
      );
    },

    setPerson(index) {
      //选择人员
      this.selectNodeList = [];
      this.dialogVisible = true;
      this.secIndex = index;
      let checkedKeys = [], selectNodeList = [];

      let jsonPerson =
        this.liveForm.addAccommodationPlanList[index].jsonPerson || {};
      let master = jsonPerson.master || [],
        follow = jsonPerson.follow || [],
        accompany = jsonPerson.accompany || [];

      master.forEach(item => {
        checkedKeys.push(item.id);
        selectNodeList.push(item);
      });

      follow.forEach(item => {
        checkedKeys.push(item.id);
        selectNodeList.push(item);
      });

      accompany.forEach(item => {
        checkedKeys.push(item.id);
        selectNodeList.push(item);
      });
      this.selectNodeList = selectNodeList;
      this.$nextTick(() => {
        this.$refs.tree2.setCheckedKeys(checkedKeys);
        this.selectNodeList = selectNodeList;
      });
    },

    setPersonSure() {
      //确定人员
      let roomPersons = [];
      let master = [],
        follow = [],
        accompany = [];
      this.selectNodeList.forEach((item, index) => {
        if (item.groupId) {
          roomPersons.push(item.label);
        }
        if (item.groupId == "parent_level_d1") {
          master.push(item);
        } else if (item.groupId == "parent_level_d2") {
          follow.push(item);
        } else if (item.groupId == "parent_level_d3") {
          accompany.push(item);
        }
      });
      let jsonPerson = { master, follow, accompany };
      roomPersons = roomPersons.join(",");
      this.liveForm.addAccommodationPlanList[
        this.secIndex
      ].roomPersons = roomPersons;
      this.liveForm.addAccommodationPlanList[
        this.secIndex
      ].jsonPerson = jsonPerson;
      this.dialogVisible = false;
    },

    //  获取选择人员
    getCheckedNodes() {
      this.selectNodeList = [];
      let tree2 = this.$refs.tree2;
      let selectList = [];
      let id_list = ["parent_level_d1", "parent_level_d2", "parent_level_d3"];
      tree2.getCheckedNodes(false, false).forEach((item, index) => {
        if (!id_list.includes(item.id)) {
          selectList.push(item);
        }
      });
      this.selectNodeList = selectList;
    },

    // 提交
    carCommit(state) {
      this.$refs.liveForm.validate(valid => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.liveForm || {}));
          params.addAccommodationPlanList = params.addAccommodationPlanList || [];
          params.state = state;
          params.planNo = this.planNo;
          params.addAccommodationPlanList = params.addAccommodationPlanList.map(
            item => {
              this.hotelInfoList.forEach(hotel => {
                if (hotel.id == item.hotelId) {
                  item.hotelName = hotel.name;
                }
              });

              item.jsonPerson.master = (item.jsonPerson.master || []).map(
                item => {
                  return { id: item.id, name: item.name || item.label };
                }
              );
              item.jsonPerson.follow = (item.jsonPerson.follow || []).map(
                item => {
                  return { id: item.id, name: item.name || item.label };
                }
              );
              item.jsonPerson.accompany = (item.jsonPerson.accompany || []).map(
                item => {
                  return { id: item.id, name: item.name || item.label };
                }
              );
              item.planId = this.id;
              item.stayStartTime = this.$formatDate(item.stayStartTime);
              item.stayEndTime = this.$formatDate(item.stayEndTime);
              item.roomNum = 1;     //房型数量固定是1
              return item;
            }
          );

          let msg = "是否确认提交办理，并返回列表页？";
          if (state == 0) {
            msg = "是否确认保存修改内容，并返回列表页？";
          }
          this.$confirm(msg)
            .then(() => {
              if (this.type == "add") {
                this.$axiosJsonPost(API.planAccommodation, params)
                .then(res => {
                  if (res.status == 200) {
                    // this.$message({type: 'success', message: '操作成功！'});
                    this.$router.go(-1);
                  }
                })
                .finally(() => {
                  console.log("finally");
                });
              } else if (this.type == "edit") {
                params = params.addAccommodationPlanList[0];
                this.$axiosJsonPost(
                  API.planAccommodation_updatePlanAccommodation,
                  params
                )
                .then(res => {
                  if (res.status == 200) {
                    // this.$message({type: 'success', message: '操作成功！'});
                    this.$router.go(-1);
                  }
                })
                .finally(() => {
                  // console.log('finally');
                });
              }
            })
            .catch(() => {});
        }
      });
    },

    //房间添加
    liveAdd() {
      this.liveForm.addAccommodationPlanList.push(
        JSON.parse(JSON.stringify(accommodationPlan))
      );
    },
    // 删除房间
    deleteItemsThree(item, index) {
      if (index !== -1) {
        this.liveForm.addAccommodationPlanList.splice(index, 1);
      }
    }
  }
};
</script>

<style lang="scss">
.transfer-null {
  display: none;
}
</style>
<style lang="scss" scoped>
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
.reception-form {
  padding-top: 20px;
  .text-h5 {
    padding-bottom: 10px;
  }
  .u-bread-text {
    margin-top: -3px;
  }
}
.options-tow-width {
  width: 300px;
  .el-input {
    width: 300px;
  }
}

.dialog-person {
  .person-box {
    width: 50%;
    box-sizing: border-box;
  }

  .h-dialog-add-select {
    width: 477px;
  }
  .el-form-nobottom {
    margin-bottom: 0;
  }
  .el-select {
    display: inline-block;
  }
  .padding10 {
    padding: 10px;
  }
  .person-box {
    margin: 15px 0;
    width: 300px;
    height: 400px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
  }
  .person-box h2 {
    background: #f3f6fd;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border-bottom: 1px solid #dcdfe6;
  }
  .selectionPerson {
    overflow: hidden;
    padding: 10px;
  }
  .selectionPerson li {
    line-height: 30px;
    display: inline-block;
    box-sizing: border-box;
    width: 100%;
  }
  .lineHight {
    line-height: 28px;
  }
}
</style>



