<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标房间查询" :item="['超标房间查询']" type="2"></Y-Breadcrumb>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <!-- <li>
                  <span>房间位置</span>
                  <el-cascader placeholder="请选择房间位置" v-model="roomLocation" clearable :options="roomLocationList" filterable change-on-select></el-cascader>
                </li> -->
                <li>
                  <span>房间号</span>
                  <el-input clearable placeholder="请输入房间号" v-model="addressId"></el-input>
                </li>
                <!-- <li>
                  <span>姓名：</span>
                  <el-input clearable placeholder="请输入姓名" v-model="userName"></el-input>
                </li> -->
                <!-- <li>
                  <span>房间类型</span>
                  <el-cascader placeholder="请选择房间类型" v-model="roomType" clearable :options="roomTypeList" filterable change-on-select></el-cascader>
                </li> -->
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.id,scope.row.roomRecordId,'','1')">{{scope.row.roomNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomTypeNameString" label="房间类型">
          </el-table-column>
          <el-table-column prop="name" label="房间名称">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积（㎡）">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column prop="userNum" label="使用人数">
          </el-table-column>
          <el-table-column prop="realNameString" label="当前使用人">
          </el-table-column>
          <el-table-column prop="excessiveArea" label="超标面积">
          </el-table-column>
          <!-- <el-table-column prop="roomRecord" label="状态">
            <template slot-scope="scope">
              {{scope.row.roomRecord == 'YES' ? '已备案':'未备案'}}
            </template>
          </el-table-column> -->
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <!-- <a @click="idleClick(scope.row.id,scope.row.roomRecordId)" v-show="scope.row.roomRecord ==='YES'">修改</a> -->
              <!-- <a @click="idleClick(scope.row.id,'')" v-show="scope.row.roomRecord !=='YES'">备案</a> -->
              <!-- <router-link :to="{path: '/operate/basic-information/basic-update/edit', query:{id: scope.row.dealHouseRoomBaseId}}">修改</router-link> -->
              <!-- <a @click="deleteClick(scope.row.id)">查看平面图</a> -->
              <a @click="basicInfoClick(scope.row.id,scope.row.roomRecordId,scope.row.roomRecord,'1')">详情</a>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 闲置原因补录弹窗 -->
    <el-dialog :title="titleRecord" custom-class="h-dialog-add" :visible.sync="rentEntryVisible" width="630px" :before-close="resetForm">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
        <table>
          <tr>
            <th style="vertical-align: initial;width: 100px;">
              <i class="f-color-red">*</i>情况说明</th>
            <td class="tdstyle">
              <el-form-item prop="messageFee">
                <el-input type="textarea" :rows="3" maxlength="200" v-model="ruleForm.messageFee" placeholder="请输入情况说明"> </el-input>
                <div style="text-align: right;">{{ruleForm.messageFee.length}}/200</div>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <th>附件</th>
            <td>
              <el-button class="u-upload-btn" @click="emptyFileJson">
                <i class="iconfont icon-daochu"></i>上传附件
              </el-button>
              <ul>
                <li style="display: block;" v-for=" (item, index) in ruleForm.domains" :key="index">{{index+1}}、{{item.name}}
                  <a class="ahover" @click="deleteFileNameList(index)" style="margin: 0 10px;">删除</a>
                  <a target="_blank" :href="item.url" download>下载</a>
                </li>
              </ul>
            </td>
          </tr>
        </table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="idleReson" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗结束 -->
    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <!--上传附件-->
    <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="doc/docx/pdf/jpg/jpeg/png"></v-upload>
  </div>
</template>

<script>
import basicDetail from '@/components/office-use-manage/view/unmanned-office-detail'; // 详情弹出框
// import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
import VUpload from '@/assembly/vue-popup-upload' // 上传控件

export default {
  components: {
    'basic-detail': basicDetail,
    // "v-vuePopupPicture": vuePopupPicture,
    'v-upload': VUpload

  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      rentEntryVisible: false, //闲置原因补录弹框
      loading: false,
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      idlereason: '', //闲置原因英文
      ruleForm: {
        idleness: '',
        idlenessList: [], //闲置原因集合
        messageFee: '', //情况说明
        domains: [], //附件集合
      },
      houseStatus: '', //房屋状态
      propertyMentant: '', //产权办理  
      houseStatusList: [], //房屋状态  
      rules: {
        messageFee: [
          { required: true, message: '情况说明不能为空', trigger: 'change' }
        ],
      },
      addressId: '', //房间号
      // userName: '', //姓名
      propertyList: [], //下拉框产权状态集合
      roomLocation: [], //房间位置
      roomLocationList: [], //房间位置下拉
      roomTypeList: [], //房间类型下拉
      roomType: [], //房间类型
      id: '',//房间id
      maxLength: '200',
      roomRecordId: '', //备案房间ID
      titleRecord: '新增备案', //备案标题
    };
  },
  activated() {
    this.roomLocation = [];
    this.addressId = '';
    // this.userName = '';
    this.roomType = [];
    this.getDataRequest();
    this.getHousingLocation();
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  methods: {
    requestData() {
      this.getDataRequest();
    },
    resetForm(ruleForm) {
      this.rentEntryVisible = false;
      this.$refs.ruleForm.resetFields();
    },
    //备案修改
    idleClick(id, roomRecordId) {
      this.rentEntryVisible = true;
      this.id = id;
      if (roomRecordId == '') {
        this.ruleForm.messageFee = '';
        this.ruleForm.domains = [];
        this.roomRecordId = '';
        this.titleRecord = '新增备案';
      } else {
        this.titleRecord = '修改备案';
        this.getkeepOnRecord(roomRecordId);
        this.roomRecordId = roomRecordId;

      }
    },
    // 详情
    basicInfoClick(id, type, roomRecord,hasUseStatus) {
      this.$refs.basicDetail.openModal(id, type, roomRecord,hasUseStatus);
    },
    // floorBatchaddClick() {
    //   this.$refs.floorBatchadd.openModal();
    // }, 
    // deleteClick(id) { // 存储删除参数
    //   this.deleteYardId = id;
    //   this.YConfirmShow = true;
    //   this.message = '你确定要删除吗？';
    // },
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
    //保存备案修改
    idleReson() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let url = '';
          let params = {};
          if (this.roomRecordId == '') {
            params = {
              roomId: this.id,
              situationDescription: this.ruleForm.messageFee || '',
              fileRequestList: this.ruleForm.domains || [],
            }
            url = API.useManage_addRoomRecord;
          } else {
            params = {
              id: this.roomRecordId,
              situationDescription: this.ruleForm.messageFee || '',
              fileRequestList: this.ruleForm.domains || [],
            }
            url = API.useManage_updateRoomRecord;
          }
          this.loading = true;
          this.$axiosJsonPost(url, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              // BURYINGPOINT.buryingPoint('经营性房产', '基础信息', '闲置原因补录')
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })

    },
    getHousingLocation() {
      let params = {
        useOrganId: this.loginOrganId,
      }
      this.$axiosGet(API.useManage_useManageSelect, params).then(res => {
        this.roomLocationList = res.data.treeResponseList || [];
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
        this.rentEntryVisible = false;
      }
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    // 获取列表数据
    getDataRequest() {
      let roomTypeIds = [];
      if (this.roomType.length == 2) {
        roomTypeIds.push(this.roomType[1]);
      } else if (this.roomType.length == 1) {
        roomTypeIds.push(this.roomType[0]);
      } else {
        roomTypeIds = [];
      }
      let params = {
        useOrganId: this.loginOrganId,
        courtyardId: this.roomLocation[0] || '',
        floorId: this.roomLocation[1] || '',
        storeysId: this.roomLocation[2] || '',
        roomNo:this.addressId || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.useManage_excessiveRoomList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;

          this.total = res.data.total; //分页数据数量回显
          this.list = list;
          this.roomTypeList = res.data.roomTypeList || [];
          // if (res.data.data) {
          //   res.data.data.forEach((item, inNa) => {
          //     let excessivePersonResponseList = '';
          //     item.excessivePersonResponseList.forEach((row, index) => {
          //       if (index == item.excessivePersonResponseList.length - 1) {
          //         excessivePersonResponseList += row.realName;
          //       } else {
          //         excessivePersonResponseList += row.realName + ',';
          //       }
          //     })
          //     this.list[inNa].excessivePersonResponseList = excessivePersonResponseList;
          //   })
          // }
        } else {
          this.list = [];
          // this.total = 0;
        }
        if (list) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
      });
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    //获取备案信息
    getkeepOnRecord(roomRecordId) {
      let params = {
        id: roomRecordId,
      };
      this.$axiosGet(API.useManage_roomRecordDetail, params).then(res => {
        this.ruleForm.messageFee = res.data.situationDescription;
        this.ruleForm.domains = res.data.fileResponseList;
      })
    }
  }
};
</script>

<style lang="scss">
.tdstyle .el-form-item {
  margin-bottom: 0px;
}
.tdstyle .el-form-item__error {
  top: 66%;
}
</style>
