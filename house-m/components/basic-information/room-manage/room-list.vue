<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="房间管理" :item="['房间管理']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="u-bread-btn" @click="openImport">批量导入</button>
          <router-link to='/basic-information/room-manage/room-update/add'>
            <button class="f-pull-right u-bread-btn">新增房间</button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>房间位置</span>
                  <el-cascader placeholder="请选择房间位置" v-model="search.roomPos" clearable :options="roomList" filterable change-on-select></el-cascader>
                </li>
                <li>
                  <span>房间状态</span>
                  <el-select clearable v-model="search.useStatus" filterable placeholder="请选择房间状态">
                    <el-option v-for="item in useStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>房间号</span>
                  <el-input clearable placeholder="请输入房间号" v-model="search.roomNo"></el-input>
                </li>
              </ul>
            </td>
            <!--搜索按钮-->
            <td class="u-search-but">
              <el-button class="f-search-but" @click.native="searchClick">查询</el-button>
            </td>
          </tr>
        </table>
      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%" @selection-change="handleSelectionChange" ref="multipleTable">
          <el-table-column type="selection" width="60">
          </el-table-column>
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="roomNo" label="房间号" width="100">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置" width="250">
          </el-table-column>
          <el-table-column prop="buildArea" label="建筑面积（㎡）">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积（㎡）">
          </el-table-column>
          <el-table-column prop="userModeName" label="使用方式">
          </el-table-column>
          <el-table-column prop="useClientStatus" label="房间状态">
            <template slot-scope="scope">
              <span class="z-state" :class="checkStatus(scope.row.useStatus)">{{scope.row.useStatusName || '—'}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="useOrganName" label="使用单位">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="roomDetailInfoClick(scope.row.id)">详情</a>
              <router-link v-show="scope.row.useStatus === 'IDLE'" :to="{path: '/basic-information/room-manage/room-update/edit', query: {id: scope.row.id, storeysId:scope.row.storeysId, roomNo:scope.row.roomNo}}">修改</router-link>
              <a v-show="scope.row.useStatus === 'IDLE'" @click="deleteClick(scope.row.id)">删除</a>
              <a v-show="scope.row.useStatus === 'IDLE'" @click="openAllocatingRoomDialog(scope.row.id, scope.row.roomNo,scope.row.useStatus)">分配</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
          <button class="u-bread-btn" @click="openAllocating()">取消分配</button>
          <button class="u-bread-btn" @click="openAllocatingRoomDialog('multiple')">批量分配</button>
        </div>
        <div class="h-table-pages f-pull-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </section>
    <!-- 分配房间 -->
    <el-dialog title="房屋分配" custom-class="h-dialog-add" :visible.sync="allocatingRoomDialog" width="600px" @close="clearRules">
      <div v-if="roomNameList == ''">
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span> &nbsp;请选择房间！</span>
      </div>
      <el-form v-if="roomNameList != ''" label-position="right" label-width="100px" ref="roomRuleForm" :model="roomRuleForm" :rules="roomRules">
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="roomRuleForm.roomNo" disabled clearable placeholder="请选择房间"></el-input>
        </el-form-item>
        <el-form-item label="使用单位" prop="useOrganName">
          <el-cascader :options="useOrganList" filterable change-on-select @change="handleChange" v-model="roomRuleForm.useOrganName" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="使用方式" prop="useWay">
          <el-select v-model="roomRuleForm.useWay" style="width:100%;" placeholder="请选择使用方式" filterable>
            <el-option v-for="item in userModeDic" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分配时间" prop="allocationDate">
          <el-date-picker v-model="roomRuleForm.allocationDate" type="date" clearable placeholder="选择分配时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="退房时间" prop="checkOutDate" v-if="roomRuleForm.useWay == 'WITHOUT' ? false : true">
          <el-date-picker v-model="roomRuleForm.checkOutDate" type="date" clearable placeholder="选择退房时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocatingRoomDialog = false">取 消</el-button>
        <el-button type="primary" v-if="roomNameList != ''" class="u-submit-btn submit-btn" @click="allocatingRoomClick">确 定</el-button>
        <el-button type="primary" v-if="roomNameList == ''" class="u-submit-btn submit-btn" @click="allocatingNullClick">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 取消分配 -->
    <el-dialog title="取消分配" custom-class="h-dialog-add" :visible.sync="allocating" width="500px">
      <div>
        <span class="f-message-img">
          <img :src="$store.state.imgPath.dialogCavert" />
        </span>
        <span v-if="roomNameList != ''"> &nbsp;确定取消房间{{roomNameList}}的分配吗？</span>
        <span v-if="roomNameList == ''"> &nbsp;请选择房间！</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="allocating = false">取 消</el-button>
        <el-button type="primary" v-if="roomNameList != ''" class="u-submit-btn submit-btn" @click="CancellationAllocatingRoomClick">确 定</el-button>
        <el-button type="primary" v-if="roomNameList == ''" class="u-submit-btn submit-btn" @click="CancellationNullClick">确 定</el-button>
      </span>
    </el-dialog>
    <room-detail ref="roomDetail"></room-detail>
    <!-- 导入 -->
    <room-batch ref="roomBatchExport" @callback='exportBack'></room-batch>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import roomDetail from '@/components/basic-information/room-manage/room-detail'; // 详情弹出框
import roomBatchExport from '@/components/basic-information/room-manage/room-batch-export'; // 导入弹出框
export default {
  components: {
    'room-detail': roomDetail,
    'room-batch': roomBatchExport
  },
  data() {
    return {
      roomIdList: [], // 房间ID
      search: {
        roomNo: '', //房间号
        roomPos: [], // 房间位置
        useStatus: '' // 房屋使用状态
      },
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], //列表集合
      courtyardId: '', // 院落id
      floorId: '', // 楼座id
      storeysId: '', // 楼层id
      deleteYardId: [], //删除id
      useStatus: '', //使用状态
      useStatusList: [], // 房间状态
      roomList: [], // 房间级联下拉选
      ruleForm: {
        name: '',
        buildingname: '',
        floorname1: '',
        floorname2: '',
        usearea: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        buildingname: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        usearea: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        floorname2: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ]
      },
      allocatingRoomDialog: false, // 分配房间弹出框
      roomRuleForm: {
        roomNo: '', // 房间号
        useOrganName: [], // 使用单位
        allocationDate: '', // 分配时间
        checkOutDate: '', // 退房时间
        useWay: '' // 使用方式
      },
      roomRules: {
        roomNo: [
          { required: true, message: '请选择房间', trigger: 'change' }
        ],
        useOrganName: [
          { required: true, message: '使用单位不能为空', trigger: 'change' }
        ],
        allocationDate: [
          { required: true, message: '分配时间不能为空', trigger: 'change' }
        ],
        checkOutDate: [
          { required: true, message: '退房时间不能为空', trigger: 'change' }
        ]
      },
      useOrganList: [], // 使用单位
      organId: '', //使用单位id
      organName: '', //使用单位名称
      userModeDic: [], // 使用方式
      allocating: false,
      multipleSelection: [],
      roomNameList: '',
      roomStatusFiy: '',
    };
  },
  activated() {
    this.search.useStatus = '';
    this.getSearchDate();
    this.getDataRequest();
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    },
  },
  methods: {
    openAllocating() { // 打开房屋分配弹出框
      this.allocating = true;
      let rowRoomId = [];
      let rowDealIds = [];
      this.roomIdList = [];
      if (this.multipleSelection.length >= 1) {
        this.roomStatusFiy = '';
        this.multipleSelection.forEach((item, index) => {
          rowRoomId.push(item.id)
          rowDealIds += '【' + item.roomNo + '】'
          if (item.useStatus != 'INUSE') {
            this.roomStatusFiy = 'YES';
          }
        })
        this.roomNameList = rowDealIds;
        this.roomIdList = rowRoomId;
      } else {
        this.roomIdList = [];
        this.roomNameList = '';
      }
    },
    //产权单位value匹配organId
    handleChange(value) {
      let opt = null, valueId = value[value.length - 1] || '';
      if (valueId) {
        this.useOrganList.forEach((item, index) => {
          let organOpt = this.getOrganOpt(valueId, item);
          organOpt && (opt = organOpt);
        })
      }
      if (opt) {
        this.organId = opt.organId;
        this.organName = opt.organName || '';
      }
    },
    //递归方法筛选最后一层的数据
    getOrganOpt(valueId, organListItem) {
      let organOpt = null;
      if (organListItem && organListItem.value == valueId) {
        organOpt = organListItem;
      } else if (organListItem.children && organListItem.children.length > 0) {
        organListItem.children.forEach((item, index) => {
          let resOpt = this.getOrganOpt(valueId, item);
          if (resOpt) {
            organOpt = resOpt;
          }
        })
      }
      return organOpt;
    },
    clearRules() {
      if (this.$refs.roomRuleForm) {
        this.$refs.roomRuleForm.resetFields()
      }
    },
    checkStatus(value) {
      if (value === 'IDLE') {
        return 's-state-success'
      } else if (value === 'INUSE') {
        return 's-state-prohibited'
      } else if (value === 'REMOVED') {
        return 's-state-fail'
      } else if (value === 'AUCTIONED') {
        return 's-state-fail'
      } else if (value === 'RENTED') {
        return 's-state-fail'
      } else if (value === 'CONVERSIONPURPOSESED') {
        return 's-state-fail'
      } else if (value === 'HANDLEING') {
        return 's-state-caveat'
      } else if (value === 'OFFICEHOUSEAPPLYING') {
        return 's-state-caveat'
      } else {
        return ''
      }
    },
    // 详情
    roomDetailInfoClick(id) {
      this.$refs.roomDetail.openModal(id);
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
    },
    // 删除
    YDeleteClick() {
      let params = [];
      params.push(this.deleteYardId);
      this.$axiosJsonPost(API.room_delete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('办公用房', '基础信息', '房间删除')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    getSearchDate() {
      this.$axiosGet(API.room_getSelect, {}).then(res => {
        this.roomList = res.data.select;
        this.useStatusList = res.data.useStatusList;
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 查询按钮
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    },
    //获取列表信息
    getDataRequest() {
      let params = {
        courtyardId: this.search.roomPos[0] || '',
        floorId: this.search.roomPos[1] || '',
        storeysId: this.search.roomPos[2] || '',
        useStatus: this.search.useStatus || '',
        roomNo: this.search.roomNo || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.room_query, params).then(res => {
        let list = [];
        list = res.data.data || [];
        this.total = res.data.total;
        if (list.length > 0) {
          list.forEach((item, index) => {
            list[index].num = index + 1;
          });
        }
        this.list = list;
      });
    },
    openAllocatingRoomDialog(id, roomNo, type) { // 打开房屋分配弹出框
      this.allocatingRoomDialog = true;
      this.roomRuleForm.allocationDate = new Date();
      this.$axiosGet(API.room_getAssignSelect, {}).then(res => {
        this.useOrganList = res.data.useOrganList; // 使用单位
        this.userModeDic = res.data.userModeDic; // 使用方式
        let indexVal = res.data.userModeDic.find(item => item.dicName === '无偿使用')
        this.roomRuleForm.useWay = indexVal.dicValue;
      })
      this.roomIdList = [];
      if (id == 'multiple') {
        let rowRoomId = [];
        let rowDealIds = [];
        if (this.multipleSelection.length >= 1) {
          this.roomStatusFiy = '';
          this.multipleSelection.forEach((item, index) => {
            rowRoomId.push(item.id)
            if (this.multipleSelection.length == index + 1) {
              rowDealIds += item.roomNo;
            } else {
              rowDealIds += item.roomNo + ',';
            }
            if (item.useStatus != 'IDLE') {
              this.roomStatusFiy = 'YES';
            }
          })
          this.roomRuleForm.roomNo = rowDealIds;
          this.roomNameList = 'YES';
          this.roomIdList = rowRoomId;
        } else {
          this.roomRuleForm.roomNo = '';
          this.roomIdList = [];
          this.roomNameList = '';
        }
      } else {
        if (type == 'IDLE') {
          this.roomStatusFiy = '';
        } else {
          this.roomStatusFiy = 'YES';
        }
        this.roomNameList = 'YES';
        this.roomRuleForm.roomNo = roomNo;
        this.roomIdList.push(id);
      }
    },
    allocatingRoomClick() { // 分配房间提交
      // let organName = '';
      // this.useOrganList.forEach((item, index) => {
      //   if (item.organId == this.roomRuleForm.useOrganName) {
      //     organName = item.organName
      //   }
      // })
      this.$refs.roomRuleForm.validate((valid) => {
        if (valid) {
          let params = {
            roomIdList: this.roomIdList,
            organId: this.organId,
            organName: this.organName,
            dateAssign: FORMATGET.formatGET(this.roomRuleForm.allocationDate).substr(0, 10),
            // dateCheckOut: FORMATGET.formatGET(this.roomRuleForm.checkOutDate).substr(0, 10),
            userMode: this.roomRuleForm.useWay
          }
          if(this.roomRuleForm.useWay == 'WITHOUT'){
            this.$set(params,'dateCheckOut','')
          }else{
            this.$set(params,'dateCheckOut',FORMATGET.formatGET(this.roomRuleForm.checkOutDate).substr(0, 10))
          }
          if (this.roomStatusFiy == 'YES') {
            this.allocatingRoomDialog = false;
            this.YPromptShow = true;
            this.isBol = false;
            this.message = '请选择闲置房间！';
          } else {
            this.$axiosJsonPost(API.room_assign, params).then(res => {
              this.allocatingRoomDialog = false;
              this.YPromptShow = true;
              if (res.result === 'success') {
                this.isBol = true;
                this.$refs.multipleTable.clearSelection();
              } else {
                this.isBol = false;
              }
              this.message = res.message;
            })
          }
        }
      })
    },
    allocatingNullClick() {
      this.allocatingRoomDialog = false;
    },
    CancellationNullClick() {
      this.allocating = false;
    },
    CancellationAllocatingRoomClick() { // 取消分配房间提交
      // let params = {
      //   roomIdList: this.roomIdList,
      // }
      if (this.roomStatusFiy == 'YES') {
        this.allocating = false;
        this.YPromptShow = true;
        this.isBol = false;
        this.message = '请选择已分配房间！';
      } else {
        this.$axiosJsonPost(API.room_cancelAssign, this.roomIdList).then(res => {
          this.allocating = false;
          this.YPromptShow = true;
          if (res.result === 'success') {
            this.isBol = true;
            this.$refs.multipleTable.clearSelection();
          } else {
            this.isBol = false;
          }
          this.message = res.message;
        })
      }
    },
    exportClick() { // 导出
      // let params = {
      let courtyardId = this.search.roomPos[0] || '';
      let floorId = this.search.roomPos[1] || '';
      let storeysId = this.search.roomPos[2] || '';
      let useStatus = this.search.useStatus;
      let roomNo = this.search.roomNo || '';
      let exportFlag = 'YES';
      let currentPage = this.page;
      let pageSize = this.pageSize
      window.open(`${API.room_query}?_token=${this.token}&courtyardId=${courtyardId}&floorId=${floorId}&storeysId=${storeysId}&useStatus=${useStatus}&roomNo=${roomNo}&exportFlag=YES&currentPage=${currentPage}&pageSize=${pageSize}`)
    },
    openImport() {
      this.$refs.roomBatchExport.openModal();
    },
    exportBack(data) {
      if (data) {
        this.getDataRequest();
      }
    },
    //已勾选数据
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
  }
};
</script>

<style lang="scss">
#u-do-room {
  .el-cascader {
    display: block;
  }
  .h-dialog-add-select {
    width: 448px;
  }
  .el-select {
    display: inline-block;
  }
}
</style>
