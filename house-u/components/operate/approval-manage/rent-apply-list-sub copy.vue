<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="出租申请" :item="['出租申请']" type="2"></Y-Breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{paramsType}}经营性房产出租申请表</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！)</p>
      </div>
      <div class="h-tab-content">
        <el-form :rules="rules" ref="ruleForm" :model="ruleForm">
          <table class="h-table-info">
            <tr>
              <th>申请单位：</th>
              <td>
                {{organName}}
              </td>
              <th>
                <i class="f-color-red">*</i>申请单位责任人：</th>
              <td>
                <el-form-item prop="respPerson">
                  <el-input placeholder="请输入" v-model="ruleForm.respPerson" style="width:100%;" maxlength='40'>
                  </el-input>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <th>
                <i class="f-color-red">*</i>经办人：</th>
              <td>
                <el-form-item prop="agent">
                  <el-input placeholder="请输入" v-model="ruleForm.agent" style="width:100%;" maxlength='40'>
                  </el-input>
                </el-form-item>

              </td>
              <th>
                <i class="f-color-red">*</i>经办人电话：</th>
              <td>
                <el-form-item prop="agentPhone">
                  <el-input placeholder="请输入" v-model="ruleForm.agentPhone" style="width:100%;" maxlength='11'>
                  </el-input>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <th>
                <i class="f-color-red">*</i>拟出租开始日期：</th>
              <td>
                <el-form-item prop="rentalStartDate">
                  <el-date-picker v-model="ruleForm.rentalStartDate" type="date" placeholder="选择日期" :picker-options="pickerOptions">
                  </el-date-picker>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>乙方支付租金方式：</th>
              <td>
                <el-form-item prop="payment">
                  <el-select v-model="ruleForm.payment" filterable placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in ruleForm.paymentList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <th>
                <i class="f-color-red">*</i>招租形式：</th>
              <td>
                <el-form-item prop="recruitment">
                  <el-select v-model="ruleForm.recruitment" filterable placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in ruleForm.recruitmentList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </el-form-item>
              </td>
              <th>
                <i class="f-color-red">*</i>拟出租用途：</th>
              <td>
                <el-form-item prop="rentalUse">
                  <el-input placeholder="请输入" v-model="ruleForm.rentalUse" style="width:100%;" maxlength="40">
                  </el-input>
                </el-form-item>
              </td>
            </tr>

            <tr>
              <th>
                <i class="f-color-red">*</i>拟出租年限：</th>
              <td colspan="3">
                <el-form-item prop="yearLimit">
                  <el-input placeholder="请输入" v-model="ruleForm.yearLimit" style="width:100%;" maxlength="2">
                    <template slot="append">年</template>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <th>备注</th>
              <td colspan="3">
                <el-form-item prop="remark">
                  <el-input type="textarea" :rows="3" :maxlength="200" v-model="ruleForm.remark" placeholder="请输入备注"> </el-input>
                  <div style="text-align: right;">{{ruleForm.remark.length?ruleForm.remark.length:0}}/200</div>
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
          <div class="f-margin-upd f-hidden" style="margin-top: 5px">
            <h2 class="h-table-subtitle f-pull-left">
              <span></span>
              <i class="f-color-red">*</i>
              拟出租经营性房产明细</h2>
            <div class="u-bread-btn-group f-pull-right">
              <button class="u-bread-btn" @click.prevent="openDilog">选择经营性房产</button>
            </div>
          </div>
          <div class="h-table" style="margin: 0">
            <el-table :data="ruleForm.list" stripe style="width: 100%" ref="multipleTable1" show-summary :summary-method="getSummaries">
              <el-table-column fixed="left" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column label="坐落位置" prop="roomAddress">
              </el-table-column>
              <el-table-column label="建筑面积（㎡）" prop="buildArea">
              </el-table-column>
              <el-table-column label="评估租金（元/月/平方米）" prop="estimateRentPrice" :render-header="renderHeader">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.estimateRentPrice'" :rules='rules.estimateRentPrice'>
                    <el-input v-model="scope.row.estimateRentPrice"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column label="租赁保证金" :render-header="renderHeader1">
                <template slot-scope="scope">
                  <el-form-item :prop="'list.' + scope.$index + '.rentDeposit'" :rules='rules.rentDeposit'>
                    <el-input v-model="scope.row.rentDeposit"></el-input>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column fixed="right" label="操作">
                <template slot-scope="scope">
                  <a @click="deleteClick(scope.row.dealHouseRoomBaseId)">删除</a>
                </template>
              </el-table-column>
            </el-table>
            <div v-show="ruleForm.list.length === 0" class="f-color-red">经营性房产明细不能为空</div>
          </div>
          <div class="table-bottom-btns f-hidden">
            <router-link to="/operate/approval-manage/rent-apply-list">
              <el-button class="u-submit-btn cancel-btn">取消</el-button>
            </router-link>
            <el-button class="u-submit-btn submit-btn" :loading="loading" @click="getSaveDataRequest">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>

    <el-dialog title="选择房屋" custom-class="h-dialog-add" :visible.sync="dialogFormVisible" width="730px">
      <el-form :model="ruleFormRoom" :rules="rules" ref="ruleFormRoom" style="margin: -10px 0;">
        <div class="m-search" style="margin-bottom:15px;">
          <table>
            <tr>
              <td>
                <ul class="f-clearfix" @keydown="$keydown($event, getHouseNameList)">
                  <li>
                    <span>地址：</span>
                    <el-input v-model="ruleFormRoom.roomAddress"></el-input>
                  </li>
                </ul>
              </td>
              <td class="u-search-but f-text-right">
                <el-button class="f-search-but" @click="getHouseNameList">查询</el-button>
              </td>
            </tr>
          </table>
        </div>
        <div style="max-height:400px;overflow:auto;">
          <div class="h-table">
            <el-table ref="multipleTable" :data="tableData" stripe style="width: 100% " @selection-change="handleSelectionChange" :row-key="getRowKeys">
              <el-table-column type="selection" width="55">
              </el-table-column>
              <el-table-column label="地址" prop="roomAddress">
              </el-table-column>
              <el-table-column prop="buildArea" label="建筑面积（㎡）">
              </el-table-column>
              <el-table-column prop="userArea" label="使用面积（㎡）">
              </el-table-column>
              <el-table-column prop="houseStatus" label="房屋状态" width="80">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button class="u-submit-btn cancel-btn" @click="closeDilog">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click.native="SaveData">保存</el-button>
      </div>
    </el-dialog>
    <!--删除提示框-->
    <!-- <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm> -->
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow " :isBol="isBol" :message="message " @click="YPromptClick "></Y-Prompt>
    <!--消息提示框 删除-->
    <!-- <Y-Prompt v-model="YPromptShowDel " :isBol="isBol" :isOpen="isOpen" :message="messagedel " @click="YPromptClickDel"></Y-Prompt> -->

  </div>
</template>

<script>
import vuePopupUpload from '@/assembly/vue-popup-upload' // 上传控件
export default {
  components: {
    'v-upload': vuePopupUpload
  },

  data() {
    let self = this;
    let startingPrice = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`评估租金为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`评估租金不能大于100万元`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`评估租金不能为空`));
      }
    }
    let rentDeposit = (rule, value, callback) => {
      if (value) {
        if (!/^(\d|([1-9]\d+))(\.\d{1,2})?$/.test(value)) {
          callback(new Error(`租赁保证金为最多两位小数`))
        } else if (value > 1000000) {
          callback(new Error(`租赁保证金不能大于100万元`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`租赁保证金不能为空`));
      }
    }

    //拟出租年限验证
    let rentalLimit = (rule, value, callback) => {
      if (value) {
        if (!(/(^[1-9]\d*$)/.test(value))) {
          callback(new Error(`请输入大于0正整数！`))
        } else {
          callback();
        }
      } else {
        callback(new Error(`拟出租年限不能为空`));
      }
    }
    return {
      loading: false,
      itemName: '', //申请单位
      dealRentApplyId: '', //出租申请id
      paramsType: '新增',
      ruleForm: {
        respPerson: '', //负责人
        agent: '', //经办人
        agentPhone: '', //经办人电话
        rentalStartDate: '', //拟出租开始日期
        estimateRentPrice: '', //评估租金
        rentDeposit: '', //保证金
        payment: '',//乙方支付租金方式
        paymentList: [],
        recruitment: '', //招租形式
        recruitmentList: [], //招租形式集合
        rentalUse: '', //拟出租用途
        yearLimit: '', //拟出租年限年
        remark: '', //备注     
        list: [],
        domains: [],
        buildArea: '' //建筑面积
      },
      houseIds: [], //房间id集合
      rentalDetailList: [], //详情集合
      houseDetailList: [], //房屋明细
      HistoryList: [],
      HruleFormList: [],
      getRowKeys(row) {
        return row.dealHouseRoomBaseId;
      },
      ruleFormRoom: {
        roomAddress: '',
      },
      roomId: '', //房间id
      dataTable: [], //房屋明细
      fileList: [], //上传文件集合
      fileNames: '', // 通知公告附件name拼串
      fileUrls: '', // 通知公告附件url拼串
      vuePopupUploadShow: true,
      multipleSelection: [],
      dialogFormVisible: false,
      title: '',
      maxLength: '200',
      YConfirmShow: false,
      YPromptShowDel: false,
      messagedel: '',
      imgUrls: [], //图片集合
      YPromptShow: false, // 提示对话框
      isBol: false, // 弹出框图形标识
      isOpen: false,
      message: '', // 删除、修改、修改成功后，返回的值，初始默认为空
      tableData: [], //数据集合
      msgType: '新增', // 当前页面状态 
      rules: {
        respPerson: [
          { required: true, message: '申请单位负责人不能为空', trigger: 'change' }
        ],
        agent: [
          { required: true, message: '经办人不能为空', trigger: 'change' }  // 增价幅度
        ],
        rentalStartDate: [
          { required: true, message: '日期不能为空', trigger: 'change' }
        ],
        payment: [
          { required: true, message: '请输入乙方支付租金方式', trigger: 'change' }
        ],
        recruitment: [
          { required: true, message: '招租形式不能为空', trigger: 'change' }
        ],
        rentalUse: [
          { required: true, message: '请输入拟出租用途', trigger: 'change' }
        ],
        yearLimit: [
          { required: false, validator: rentalLimit, trigger: 'change' },  //拟出租年限
        ],
        estimateRentPrice: [
          { required: true, validator: startingPrice, trigger: 'change' }
        ],
        rentDeposit: [
          { required: true, validator: rentDeposit, trigger: 'change' }
        ],
        agentPhone: [{ required: true, pattern: /^1(0|3|4|5|6|7|8|9)\d{9}$/, message: '请输入正确的手机号', trigger: 'change' }],
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 60 * 60 * 1000;
        }
      }
    };
  },
  activated() {
    this.getSelectRequest();
    if (this.$route.params.type === 'edit') {
      // 区分当前页面状态
      this.dealRentApplyId = this.$route.query.id;
      this.getEditDataRequest(); // 修改回显页面数据
      this.paramsType = '修改'
    } else {
      this.paramsType = '新增';
    }
  },
  deactivated() {
    this.$refs.ruleForm.resetFields();
    this.$destroy();
  },
  mounted() {
  },
  computed: {
    organName() {
      return this.$store.state.mainData.organName
    },
    areaId() {
      return this.$store.state.mainData.areaId
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    },

  },
  methods: {
    fileUploadRequest(fileNameList) { // 文件上传回选
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
    emptyFileJson() { // 打开文件上传弹出框
      this.$refs.VUpload.openModal()
    },
    getSummaries(param) { // 获取总计
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        if (index === 1) {
          sums[index] = '';
          return;
        }
        if (index === 8) {
          sums[index] = '';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' ';
        } else {
          sums[index] = '';
        }
      });
      return sums;
    },

    // 获取下拉框
    getSelectRequest() {
      this.$axiosPost(API.userplathouserent_queryOrderStatusAndPayWay, {}).then(res => {
        this.ruleForm.paymentList = res.data.sysDicRentPayWayResponseList;  //乙方支付租金方式
        this.ruleForm.recruitmentList = res.data.sysDicRentWayResponseList; //招租方式
      });
    },
    renderHeader(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>评估租金（元/月/平方米）</span>           
                `        },
      })
    },
    renderHeader1(createElement) {
      let self = this
      return createElement('span', {
        domProps: {
          innerHTML: `
          <span class="f-color-red">*</span>
                <span>租赁保证金（元）</span>           
                `        },
      })
    },
    //添加弹框的保存按钮
    SaveData() {


      // this.HistoryList.forEach((itemI, indexI) => {
      //   this.houseIds.forEach((itemJ, indexJ) => {
      //     if (itemI.dealHouseRoomBaseId === itemJ) {
      //       this.HruleFormList = this.multipleSelection
      //     }
      //   })
      // })

      // if (this.$route.params.type === 'edit') {
      // let data1 = [];
      // let data2 = [];
      // data1 = this.multipleSelection;
      // let idList = [];
      // data1 = this.multipleSelection.filter(item => {
      //   idList = this.HruleFormList.map(v => v.dealHouseRoomBaseId)
      //   return !idList.includes(item.dealHouseRoomBaseId)
      // })
      // data2 = this.multipleSelection.filter(item => {
      //   idList = this.HruleFormList.map(v => v.dealHouseRoomBaseId)
      //   return idList.includes(item.dealHouseRoomBaseId)
      // })
      // this.multipleSelection = data1.concat(data2);

      //   // if (this.multipleSelection === '') {
      //   //   this.ruleForm.list = this.multipleSelection;
      //   // } else {
      //   //   this.ruleForm.list = this.ruleForm.list.concat(this.multipleSelection);
      //   // }
      //   this.ruleForm.list = this.ruleForm.list.concat(this.multipleSelection);
      // }
      // else {
      this.ruleForm.list = this.multipleSelection;
      // }
      this.dialogFormVisible = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    openDilog() {
      this.dialogFormVisible = true;
      this.getHouseNameList();

      // if (this.tableData.length > 0) {
      //   this.$refs.multipleTable.clearSelection();
      //   setTimeout(() => {
      //     this.ruleForm.list.forEach(row => {
      //       this.$refs.multipleTable.toggleRowSelection(row);
      //     });
      //   }, 500)

      // }
    },
    closeDilog() {
      this.dialogFormVisible = false;
    },
    // 修改获取详情数据
    getEditDataRequest() {
      let params = {
        dealRentApplyId: this.dealRentApplyId
      }
      this.$axiosPost(API.userplathouserent_detail, params).then(res => {
        if (res.data) {
          this.rentalDetailList = res.data.dealRentApplyResponseDetail;
          this.ruleForm.respPerson = this.rentalDetailList.applyResponsible;
          this.ruleForm.agent = this.rentalDetailList.agentName;
          this.ruleForm.agentPhone = this.rentalDetailList.agentPhone;
          this.ruleForm.rentalStartDate = this.rentalDetailList.proposedRentStartDate.substr(0, 10);
          this.ruleForm.payment = this.rentalDetailList.rentPayWay;
          this.ruleForm.recruitment = this.rentalDetailList.rentWay;
          this.ruleForm.yearLimit = this.rentalDetailList.proposedRentYear; //出租年限
          this.ruleForm.rentalUse = this.rentalDetailList.proposedRentPurpose; //出租用途
          this.ruleForm.remark = this.rentalDetailList.remark; //备注
          if (res.data.dealRentApplyResponseDetail.dealRentHouseDetailResponseDetail) {
            this.houseDetailList = res.data.dealRentApplyResponseDetail.dealRentHouseDetailResponseDetail;
            this.ruleForm.list = this.houseDetailList;
          }
        }
      })
    },
    //提交表单
    getSaveDataRequest() {
      let ispass = false;
      if (this.ruleForm.list.length > 0) {
        ispass = true
      } else {
        ispass = false;
      }
      this.dataTable = [];
      this.ruleForm.list.forEach((item, index) => {
        this.dataTable.push({
          dealHouseRoomBaseId: item.dealHouseRoomBaseId,
          roomAddress: item.roomAddress,
          buildArea: item.buildArea,
          estimateRentPrice: item.estimateRentPrice, //评估租金
          rentDeposit: item.rentDeposit,
          userArea: item.userArea,
        })
      })
      this.$refs.ruleForm.validate((valid) => {
        if (valid && ispass) {
          let params = {
            businessCode: 'USER_PLAT_RENT_APPLY',
            applyOrganId: this.loginOrganId, //申请单位id
            applyOrganName: this.organName, //申请单位名称
            applyResponsible: this.ruleForm.respPerson, //申请单位责任人
            agentName: this.ruleForm.agent, //经办人
            agentPhone: this.ruleForm.agentPhone, //经办人电话
            proposedRentStartDate: this.ruleForm.rentalStartDate.substr(0, 10),//拟出租开始日期
            rentPayWay: this.ruleForm.payment, //乙方支付租金方式
            rentWay: this.ruleForm.recruitment, //招租形式
            proposedRentPurpose: this.ruleForm.rentalUse, //拟出租用途
            proposedRentYear: this.ruleForm.yearLimit,//拟出租年限
            remark: this.ruleForm.remark,
            dealRentHouseDetails: this.dataTable,
            attachments: JSON.stringify(this.ruleForm.domains), // 图片地址
          }
          let url = '';
          if (this.$route.params.type === 'edit') {
            this.$set(params, 'dealRentApplyId', this.dealRentApplyId);
            // 区分当前页面状态
            url = API.userplathouserent_doRentApplyUpdate;
          } else {
            url = API.userplathouserent_doRentApply;
          }
          this.loading = true;
          this.$axiosPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              if (this.$route.params.type === 'edit') {
                BURYINGPOINT.buryingPoint('经营性房产', '申请审批', '修改')
              } else {
                BURYINGPOINT.buryingPoint('经营性房产', '申请审批', '申请')
              }
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },

    //获取所有经营性房产信息
    getHouseNameList() {
      let params = {
        organId: this.loginOrganId, //单位id
        areaId: this.areaId,
        houseAddress: this.ruleFormRoom.roomAddress
      }
      this.$axiosGet(API.userplathouserent_dealHouseList, params).then(res => {
        let datas = [];
        if (res.result == 'success' && res.data) {
          if (res.data) {
            this.tableData = res.data;
            if (this.ruleForm.list.length > 0) {
              this.$refs.multipleTable.clearSelection();
              for (let j = 0, leng = this.tableData.length; j < leng; j++) {
                for (let i = 0, len = this.ruleForm.list.length; i < len; i++) {
                  if (this.tableData[j].dealHouseRoomBaseId === this.ruleForm.list[i].dealHouseRoomBaseId) {
                    setTimeout(() => {
                      this.$refs.multipleTable.toggleRowSelection(this.tableData[j]);
                      this.HistoryList.push(this.tableData[j])
                    }, 500)
                    this.HruleFormList.push(this.ruleForm.list[i])
                  }
                }
              }
            }
          } else {
            this.tableData = [];
            this.HistoryList = [];
            this.HruleFormList = [];
          }
        }
      })
    },
    //删除人员信息
    deleteClick(deleteId) {
      this.ruleForm.list.forEach((item, index) => {
        if (item.dealHouseRoomBaseId == deleteId) {
          this.ruleForm.list.splice(index, 1)
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.$router.push('/operate/approval-manage/rent-apply-list')
        }
      }, 1000)
    }
  }
}

</script>

<style lang="scss" scoped>
.u-file {
  margin: 5px 0;
  li {
    float: left;
    display: inline-block;
    line-height: 26px;
  }
}
.el-row-padding {
  padding: 0 0 20px 20px;
}
.el-input {
  width: auto;
}
.iconfont {
  font-size: 6px;
}
.u-rules {
  position: absolute;
  right: 10px;
  top: 0;
}
.left20 {
  left: 20px;
}
.u-table-content {
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}

.h-tab-content td {
  width: 450px;
}

.f-pull-left {
  // margin-right: 10px;
  padding-top: 10px;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100% !important;
}
</style>
