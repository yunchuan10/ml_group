<template>
  <div>
    <el-dialog title="租金到期提醒" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="right" label-width="100px">
        <el-form-item label="提醒时间" prop="reminderDay">
          <el-row>
            <el-col :span="3">租金到期前</el-col>
            <el-col :span="12">
              <el-input placeholder="请输入内容" v-model="ruleForm.reminderDay">
                <template slot="append">天</template>
              </el-input>
            </el-col>
            <el-col :span="4">开始提醒</el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="提醒标题" prop="reminderTitle">
          <el-input placeholder="请输入内容" v-model="ruleForm.reminderTitle">
          </el-input>
        </el-form-item>
        <el-form-item label="提醒正文" prop="textContent">
          <el-input type="textarea" :rows="2" maxlength='30' placeholder="请输入内容" v-model="ruleForm.textContent">
          </el-input>
          <div style="text-align: right;">{{ruleForm.textContent.length}}/30</div>
        </el-form-item>
        <el-form-item label="提醒人" prop="reminderPerson" class="f-relative">
          <el-input placeholder="请输入内容" disabled v-model="ruleForm.reminderPerson">
          </el-input>
          <span class="iconfont f-absolute addIcon" @click="openPersonModal">
            <i class="fa icon-tianjia"></i>
          </span>
        </el-form-item>
        <el-form-item label="提醒方式" prop="reminderWay">
          <el-checkbox-group v-model="ruleForm.reminderWay">
            <!-- <el-checkbox label="EVENT">待办</el-checkbox> -->
            <el-checkbox label="LIST">短信</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <div class="switch-item-content">
          <span>启用到期提醒</span>
          <el-switch v-model="ruleForm.switchOnOff" style="margin-left:15px">
          </el-switch>
        </div> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button @click="doEditEequest" class="u-submit-btn submit-btn">保存</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加人员" custom-class="h-dialog-add" :visible.sync="dialogPersonVisible" width="730px">
      <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1" style="margin: -15px 0">
        <div class="el-row-padding">
          <el-row>
            <el-button plain @click="dptClick('depart')" :class="{'current':pageSelect=='depart'}">部门</el-button>
            <el-button plain @click="dptClick('official')" :class="{'current':pageSelect=='official'}">职务级别</el-button>
          </el-row>
        </div>
        <div class="f-hidden">
          <div class="f-pull-left person-box">
            <h2> 未选人员</h2>
            <div class="padding10">
              <el-input placeholder="输入关键字进行过滤" v-model="filterText">
              </el-input>
              <el-tree class="filter-tree" :data="dataList" node-key="userId" @check="getCheckedNodes" show-checkbox :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2">
              </el-tree>
            </div>
          </div>
          <div class="f-pull-right person-box">
            <h2>已选人员</h2>
            <ul class="selectionPerson">
              <li v-for="(item,index) in selectNodeList" :key="index">{{item.nodeName}}</li>
            </ul>
          </div>
        </div>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelUserList" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="confirmBtn">保存</el-button>
      </div>
    </el-dialog>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
export default {
  data() {
    let checkFloorNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`提醒天数不能为空`));
      } else {
        if (!/^[1-9](\d+)?$/.test(value)) {
          callback(new Error(`提醒天数为大于零的整数`))
        } else if (value > 1000) {
          callback(new Error(`提醒天数不能大于1000`))
        }
        else {
          callback();
        }
      }
    };
    return {
      savedialogVisible: false,
      dialogFormVisible: false,
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      dialogPersonVisible: false,
      loading: false,
      rentDetail: {},
      id: '',
      ruleForm: {
        reminderWay: [], //提醒方式
        textContent: '', //提醒正文
        reminderTitle: '', //提醒标题
        reminderPerson: '', //提醒人
        reminderDay: '', // 提醒日期    
        switchOnOff: true
      },
      filterText: '',
      ruleForm1: {},
      dataList: [],
      dealRemindBaseId: '', //修改的id
      selectNodeList: [], //获取节点信息 
      selectOriginNodeList: [], // 详情返回的选择节点list，存储用来遍历
      deleteId: '', //删除id
      pageSelect: 'depart',
      defaultProps: {
        children: 'children',
        label: 'nodeName'
      },
      rules: {
        reminderDay: [
          { required: true, validator: checkFloorNumber, trigger: 'change' },
        ],
        reminderTitle: [
          { required: true, message: '请输入提醒标题', trigger: 'change' }
        ],
        reminderPerson: [
          { required: true, message: '请输入提醒人', trigger: 'change' }
        ],
        textContent: [
          { required: true, message: '请输入提醒正文', trigger: 'change' }
        ],
        reminderWay: [
          { required: true, message: '请选择提醒方式', trigger: 'change' }
        ],
      }
    };
  },
  activated() {
  },
  computed: {
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  watch: {
    'filterText': function (val) {
      this.$refs.tree2.filter(val);
    },
  },
  methods: {
    // 初始化弹出框
    openModal(id) {
      this.dialogFormVisible = true;
      this.id = id;
      this.getEditRequest()
    },

    // 添加人员信息里的tab切换
    dptClick(type) {
      this.pageSelect = type;
      this.dataList = [];
      this.getPersonTree();
    },
    //根据部门获取人员信息
    getPersonTree() {
      let url = '';
      let params = {
        useOrganId: this.loginOrganId
      }
      if (this.pageSelect == 'depart') {
        // 区分部门
        url = API.sysmanage_getOrganTree;
      } else {
        // 区分职级职别
        url = API.sysmanage_getDutyTree;
      }
      this.$axiosGet(url, params).then(res => {
        if (Array.isArray(res.data)) {
          this.dataList = res.data;
        } else {
          this.dataList = [res.data]
        }

        this.userIds = [];
        this.selectNodeList.forEach((item, index) => {
          this.userIds.push(item.userId)
        })
        this.$refs.tree2.setCheckedKeys(this.userIds)
      })
    },
    //获取树型节点信息
    getCheckedNodes() {
      let selectList = [];
      this.$refs.tree2.getCheckedNodes(false, false).forEach((item, index) => {
        if (item.nodeType === "staff" || item.typeFlag == 'person') {
          selectList.push(item)
        }
      })
      // let data = [];
      // selectList.forEach((item, index) => {
      //   data.push({
      //     userId: item.value,
      //     userName: item.label,
      //     userPhone: item.userPhone
      //   })
      // })
      this.selectNodeList = selectList;
      let person = '';
      this.selectNodeList.forEach((item, index) => {
        person += item.nodeName + ',';
      })
      this.ruleForm.reminderPerson = person.substr(0, person.length - 1);
    },
    filterNode(value, data) {
      let res = false;
      if (!value) {
        res = true;
      } else if (data.nodeName && data.nodeName.indexOf && data.nodeName.indexOf(value) !== -1) {
        res = true;
      }
      return res;

    },
    // 添加按钮弹框
    openPersonModal() {
      this.pageSelect == 'depart';
      this.originSelectNodeList = this.selectNodeList;
      this.getPersonTree();
      this.dialogPersonVisible = true;
      this.filterText = '';
    },

    // 点击取消人员选择之前的数据
    cancelUserList() {
      this.selectNodeList = this.originSelectNodeList;
      this.dialogPersonVisible = false;
    },
    //  确定按钮
    confirmBtn() {
      this.dialogPersonVisible = false;
    },

    //修改详情回显
    getEditRequest() {
      let params = {
        flag: this.id,
        organId: this.loginOrganId,
      }
      this.$axiosGet(API.sysmanage_getRemindBaseSet, params).then(res => {
        if (res.data) {
          this.rentDetail = res.data[0];
          this.dealRemindBaseId = this.rentDetail.id;
          this.ruleForm.reminderDay = this.rentDetail.startDate;
          this.ruleForm.reminderTitle = this.rentDetail.title;
          this.ruleForm.textContent = this.rentDetail.text;
          this.ruleForm.reminderWay = this.rentDetail.typeArray;
          this.selectNodeList = [];
          if (res.data[0].remindReceiverResponseList != []) {
            res.data[0].remindReceiverResponseList.forEach((item, index) => {
              this.selectNodeList.push({
                children: null,
                nodeName: item.realName || '',
                typeFlag: "person",
                userId: item.userId,
                phoneNo: item.phoneNo
              })
            })
            let reminder = '';
            this.selectNodeList.forEach((item, index) => {
              reminder += item.nodeName + ','
            })
            this.ruleForm.reminderPerson = reminder.substr(0, reminder.length - 1);
            this.selectOriginNodeList = this.selectNodeList;
          }
        }
      })
    },
    //修改提交
    doEditEequest() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let users = []
          this.selectNodeList.forEach((item, index) => {
            users.push({ userId: item.userId, realName: item.nodeName, userPhone: item.phoneNo })
          })
          console.log(users)
          let params = {
            id: this.dealRemindBaseId,
            flag: 'RENT',
            startDate: this.ruleForm.reminderDay,
            title: this.ruleForm.reminderTitle,
            text: this.ruleForm.textContent,
            type: JSON.stringify(this.ruleForm.reminderWay),
            remindSwitch: 'ON',
            remindReceiverRequestList: users,
          }
          this.$axiosJsonPost(API.sysmanage_updateRemindBaseSet, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('经营性房产', '系统设置', '修改租金到期设置')
            } else {
              this.isBol = false;
            }
            this.dialogFormVisible = false;
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },

    resetForm(ruleForm) {
      this.dialogFormVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    // 修改、新增保存成功跳转页面
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          // this.$emit('requestData')
          // this.dialogFormVisible = false;
          this.$refs.ruleForm.resetFields();
        }
      }, 100)

    }
  }
}
</script>
<style lang="scss" scoped>
.addIcon {
  width: 50px;
  height: 40px;
  font-size: 20px;
  text-align: center;
  right: 0;
  color: #2f70ff;
  cursor: pointer;
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
  width: 50%;
}
.lineHight {
  line-height: 28px;
}
.personList {
  top: 0;
  li {
    display: inline-block;
    line-height: 30px;
  }
}
</style>
