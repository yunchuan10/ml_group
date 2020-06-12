<template>
  <div id="m-contract-time">
    <div class="h-table-title margin-bottom-10 f-clearfix">
      <p class="f-color-red f-pull-left">（*为必填项，请检查后提交！)</p>
    </div>
    <div class="h-tab-content">
      <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
        <div class="h-table">
          <el-table :data="ruleForm.list" stripe ref="multipleTable" style="width: 100%">
            <el-table-column fixed="left" label="序号" type="index" width="50">
            </el-table-column>
            <el-table-column label="提醒日期" key='3' :render-header="renderHeader1">
              <template slot-scope="scope">
                <el-form-item :prop="'list.'+ scope.$index +'.remindDate'" :rules="rules.remindDate">
                  <el-date-picker v-model="scope.row.remindDate" type="date" placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒标题">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.title" maxlength='10'></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒正文">
              <template slot-scope="scope">
                <el-form-item>
                  <el-input v-model="scope.row.text" maxlength='30'></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒人" :render-header="renderHeader3">
              <template slot-scope="scope">
                <el-form-item class="f-relative" :prop="'list.' + scope.$index + '.remindPerson'" :rules="scope.row.whetherToAuction !== 'YES' ? rules.remindPerson : {}">
                  <el-input placeholder="请输入内容" disabled v-model="scope.row.personStr">
                  </el-input>
                  <span class="iconfont f-absolute addIcon" @click="openPersonModal(scope.$index)">
                    <i class="fa icon-tianjia"></i>
                  </span>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="提醒方式" :render-header="renderHeader2">
              <template slot-scope="scope">
                <el-form-item :prop="'list.' + scope.$index + '.remindType'" :rules="scope.row.whetherToAuction !== 'YES' ? rules.remindPerson : {}">
                  <el-checkbox-group v-model="scope.row.remindType">
                    <el-checkbox label="EVENT">待办</el-checkbox>
                    <el-checkbox label="MESSAGE">短信</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column fixed="right" prop="operation" label="操作">
              <template slot-scope="scope">
                <el-form-item>
                  <a v-if="scope.$index == 0" class="iconfont icon-tianjia" @click="addTr"></a>
                  <a v-else class="iconfont icon-circle-remove" @click="deleteClick(scope.$index)"></a>
                </el-form-item>
                <!-- <a v-if="ruleForm.list.length > 1 && ruleForm.list.length != 1" @click="deleteClick(scope.row.value)">删除</a>
                <button class="f-pull-right u-bread-btn" @click.prevent="addTr"> -->
                <!-- 添加 -->
                <!-- </button> -->
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="table-bottom-btns f-hidden">
          <router-link to="/operate/contract-manage/contractinfo-list">
            <el-button class="u-submit-btn cancel-btn">
              取消
            </el-button>
          </router-link>
          <el-button class="u-submit-btn submit-btn" @click="getAddDataRequest" :loading="loading">保存</el-button>
        </div>
      </el-form>
    </div>
    <!-- 选择人员弹窗 -->
    <el-dialog title="添加人员" custom-class="h-dialog-add" :close-on-click-modal="false" :before-close="hanleClose" :visible.sync="dialogPersonVisible" width="730px">
      <el-form :model="ruleForm1" :rules="rules" ref="ruleForm1">
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
              <el-tree class="filter-tree" :default-checked-keys="defaultCheckedKeys" :data="dataList" node-key="value" @check="getCheckedNodes" show-checkbox :props="defaultProps" default-expand-all :filter-node-method="filterNode" ref="tree2">
              </el-tree>
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
import vueUploadPicture from '@/assembly/vue-upload-picture'; // 上传图片
export default {
  components: {
    'v-uploadPicture': vueUploadPicture
  },
  data() {
    let self = this;
    return {
      person: '', // 
      loading: false,
      id: '', // 修改id
      remindDate: '', //提醒日期
      title: '', //提醒标题
      text: '', // 提醒正文
      personStr: '',// 提醒人姓名字符串
      remindPerson: [], //提醒人
      remindType: [], //提醒方式
      isClose: false, //标记是否修改
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      ruleForm1: {},
      defaultCheckedKeys: [],
      dataList: [], //树形选择
      upData: '', //判断是否为修改
      ruleForm: {
        list: [
          {
            remindDate: '', //提醒日期
            title: '', //提醒标题
            text: '', // 提醒正文
            remindPerson: [], //提醒人ids集合
            personStr: '',// 提醒人姓名字符串
            remindType: [], //提醒方式
          },
        ],
        imgUrls: []  //上传图片集合
      },
      rules: {
        remindDate: [
          { required: true, message: '提醒日期不能为空', trigger: 'change' }
        ],
        remindPerson: [
          { required: true, message: '提醒人不能为空', trigger: 'change' }
        ],
        remindType: [
          { required: true, message: '提醒方式不能为空', trigger: 'change' }
        ],
      },
      dialogPersonVisible: false, //添加提醒人弹窗
      pageSelect: 'depart', //默认显示第一个
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      filterText: '', //关键字进行过滤
      selectNodeList: [], //获取节点信息 
      index: '', //提醒人索引
      personValue: '',//提醒人主键
    };
  },
  activated() {
    // this.getPersonTree()
    if (this.$route.query.id !== 'add') {
      this.id = this.$route.query.id;
      this.getEditDataRequest();
    } else {
      alert("请先填写合同基本信息");
      this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/info', query: { id: 'add' } })
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    // this.ruleForm.courtyardId = '';
    // this.ruleForm.floorName = '';
    // this.ruleForm.dicValue = '';
    // this.ruleForm.builtArea = '';
    // this.ruleForm.architecturalDate = '';
    // this.ruleForm.putUseDate = '';
    // this.ruleForm.upFloorNumber = '';
    // this.ruleForm.downFloorNumber = '';
    // this.ruleForm.completionDate = '';
    // this.ruleForm.imgUrls = [];
  },
  methods: {
    hanleClose() { // 关闭弹窗
      this.$refs.tree2.setCheckedKeys([]);
      this.dialogPersonVisible = false;
    },
    renderHeader1(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>提醒日期</span>           
                `        },
      })
    },
    renderHeader2(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>提醒方式</span>           
                `        },
      })
    },
    renderHeader3(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>提醒人</span>           
                `},
      })
    },
    addTr() { //添加行数
      let newValue = {};
      newValue = {
        value: '',
        remindDate: '', //提醒日期
        title: '', //提醒标题
        text: '', // 提醒正文
        remindPerson: [], //提醒人ids集合
        personStr: '',
        remindType: [], //提醒方式
      };
      //添加新的行数
      this.ruleForm.list.push(newValue);
    },
    //删除人员信息
    deleteClick(index) {
      this.ruleForm.list.splice(index, 1)
    },
    // 新增、修改
    getAddDataRequest() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let params = {
            dealContractBaseId: this.id,
            contractRemindResponses: JSON.stringify(this.ruleForm.list),
          };
          let url = '';
          if (this.upData === '') {
            url = API.contract_addContractRemind;
          } else {
            url = API.contract_updateContractRemind;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              this.isClose = true;
              if (this.upData === '') {
                BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '新增合同到期提醒')
              } else {
                BURYINGPOINT.buryingPoint('经营性房产', '合同管理', '修改合同到期提醒')
              }
            } else {
              this.isBol = false;
              this.isClose = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },
    //修改回显
    getEditDataRequest() { // 获取列表数据进行处理
      let params = {
        dealContractBaseId: this.id
      }
      this.$axiosPost(API.contract_getContractRemind, params).then(res => {
        if (res.data.length != 0) {
          this.upData = 1;
          this.ruleForm.list = []
          let remindPerson = [];
          let personStr = '';
          res.data.forEach((item, index) => {
            personStr = ''
            item.remindReceiverResponseList.forEach((remindReceiverResponse, index) => {
              personStr += remindReceiverResponse.userName + ',';
              remindPerson.push(remindReceiverResponse.userId);
            })
            this.ruleForm.list.push({
              title: item.title,
              text: item.text,
              remindDate: new Date(item.remindDate),
              remindType: JSON.parse(item.remindType),
              personStr: personStr,
              remindPerson: remindPerson
            })
          })
        } else {
          // this.ruleForm.list[0].remindDate = ''; //提醒日期
          this.ruleForm.list[0].title = ''; //提醒标题
          this.ruleForm.list[0].text = ''; // 提醒正文
          this.ruleForm.list[0].remindPerson = []; //提醒人ids集合
          this.ruleForm.list[0].personStr = '';// 提醒人姓名字符串
          // this.ruleForm.list[0].remindType = []; //提醒方式
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push({ path: '/operate/contract-manage/contract-update/contract-tab/rental', query: { id: this.$route.query.id } })
        }
      }, 1000)
    },
    // 初始化弹出框
    openModal(dialogFormVisible) {
      this.dialogFormVisible = true;
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
      if (this.pageSelect == 'depart') {
        // 区分部门
        url = API.useManage_getOrganTree;
      } else {
        // 区分职级职别
        url = API.useManage_getDutyTree;
      }
      this.$axiosPost(url, {}).then(res => {
        this.dataList = [res.data];
        this.userIds = [];
        // this.selectNodeList.forEach((item, index) => {
        //   this.userIds.push(item.value)
        // })
        // this.$refs.tree2.setCheckedKeys(this.userIds)
      })
    },
    //获取树型节点信息
    getCheckedNodes() {
      let selectList = [];
      this.$refs.tree2.getCheckedNodes(false, false).forEach((item, index) => {
        if (item.typeFlag === "person") {
          selectList.push(item)
        }
      })
      this.selectNodeList = selectList;
      this.person = '';
      this.personValue = '';
      // this.selectNodeList.forEach((item, index) => {
      // this.person += item.label + ',';
      // this.personValue += item.value + '_';
      // })
      // this.ruleForm.list.forEach((item, index) => {
      //   if (index == this.index) {
      //     this.$set(item, 'remindPerson', person.substr(0, person.length - 1));
      //   }
      // })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 添加按钮弹框
    openPersonModal(index) {
      this.index = index
      this.pageSelect == 'depart';
      this.originSelectNodeList = this.selectNodeList;
      this.ruleForm.list.forEach((item, index) => {
        if (index == this.index) {
          if (item.remindPerson.length <= 0) {
            this.selectNodeList = [];
            this.originSelectNodeList = '';
          }
        }
      })
      this.defaultCheckedKeys = this.ruleForm.list[index].remindPerson;
      this.getPersonTree();
      this.dialogPersonVisible = true;
    },
    // 点击取消人员选择之前的数据
    cancelUserList() {
      this.selectNodeList = this.originSelectNodeList;
      this.dialogPersonVisible = false;
    },
    //  确定按钮
    confirmBtn() {
      this.ruleForm.list.forEach((item, index) => {
        if (index == this.index) {
          let personStr = this.selectNodeList.map(item2 => item2.label)
          let personArr = this.selectNodeList.map(item2 => item2.value)
          this.$set(item, 'remindPerson', personArr);
          this.$set(item, 'personStr', personStr.join(','));
        }
      })
      this.hanleClose()
    },
  }
};
</script>

<style lang="scss">
#m-contract-time {
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
  .padding10 {
    padding: 10px;
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
  // .h-tab-content .el-table__body-wrapper div {
  //   margin-bottom: 0 !important;
  // }
  .f-relative span {
    right: 3%;
  }
  .el-form-item__error {
    position: static;
  }
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>
