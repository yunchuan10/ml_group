<template>
  <div>
    <section class="m-main" style="height: calc(100% - 35px);box-sizing: border-box;">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="分房调配管理" :item="['分房调配管理']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <router-link :to="{path:'/plane/Sketchpad-department',query:{organId:organId,writeAble:writeAble}}" target="_blank">
            <button class="f-pull-right u-bread-btn">
              打开平面图
            </button>
          </router-link>
        </div>
      </div>

      <div class="m-deploy-section">
        <div class="u-treecontent">
          <el-tree ref="deployTree" :default-expand-all="true" :highlight-current="true" :data="aDeployTree" :props="defaultProps" node-key="id" @node-click="handleDeployNode"></el-tree>
        </div>
        <div class="m-deploy-table">
          <div class="f-clearfix">
            <el-row :gutter="20">
              <el-col :span="8">
                <div class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="是指房间类型为办公室的房间数量。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <i class="iconfont icon-bangongshi1"></i>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>办公室</p>
                      <h2 class="u-query-h2">{{officeNum}}间</h2>
                    </div>
                  </el-col>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="是指当前单位已经分配办公室的人员数量。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <i class="iconfont icon-yonghuduan-tuantiyaoqing"></i>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>人员已分配</p>
                      <h2 class="u-query-h2">{{userNum}}人</h2>
                    </div>
                  </el-col>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="grid-content u-grid-content f-relative f-clearfix">
                  <el-tooltip class="item u-grid-tips" effect="dark" content="是指分配到本单位后还未投入使用的房间。" placement="right-start">
                    <i class="iconfont icon-gantanhao"></i>
                  </el-tooltip>
                  <el-col :span="10">
                    <div class="u-query-icons">
                      <i class="iconfont icon-kongzhiqibaobiao"></i>
                    </div>
                  </el-col>
                  <el-col :span="14">
                    <div class="u-query-txt">
                      <p>空置房间</p>
                      <h2 class="u-query-h2">{{emptyNum}}间</h2>
                    </div>
                  </el-col>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="m-search">
            <table>
              <tr>
                <td>
                  <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                    <li>
                      <span>房间号</span>
                      <el-input clearable placeholder="请输入房间号" v-model="search.roomNo"></el-input>
                    </li>
                    <li>
                      <span>房间位置</span>
                      <el-cascader style="padding-top:0;" placeholder="请选择房间位置" v-model="search.roomPos" clearable :options="roomLocationList" filterable change-on-select></el-cascader>
                    </li>
                    <li>
                      <span>房间类型</span>
                      <el-cascader style="padding-top:0;" :options="roomTypeList" v-model="search.houseType" filterable clearable change-on-select placeholder="请选择房间类型">
                      </el-cascader>
                    </li>
                    <li>
                      <span>使用状态</span>
                      <el-select v-model="search.roomStatus" filterable clearable placeholder="请选择使用状态">
                        <el-option v-for="item in houseUseStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue"></el-option>
                      </el-select>
                    </li>
                  </ul>
                </td>
                <!--搜索按钮-->
                <td class="u-search-but">
                  <el-button class="f-search-but" @click="getSearch">查询</el-button>
                </td>
              </tr>
            </table>
          </div>
          <div class="h-table f-relative">
            <el-table :data="list" stripe style="width: auto" reserve-selection>
              <el-table-column label="序号" prop="xuhao" width="50">
                <template slot-scope="scope">
                  {{$serialUtils(pageSize, page, scope.row.num)}}
                </template>
              </el-table-column>
              <el-table-column prop="roomNo" label="房间号" width="80">
                <template slot-scope="scope">
                  <a @click="roomDetailInfoClick(scope.row.id,scope.row.roomTypeId)">{{scope.row.roomNo}}</a>
                </template>
              </el-table-column>
              <el-table-column prop="roomTypeNameString" label="房间类型">
              </el-table-column>
              <el-table-column prop="name" label="房间名称">
              </el-table-column>
              <el-table-column prop="useArea" label="使用面积（㎡）" width='120px'>
              </el-table-column>
              <el-table-column prop="useClientStatusName" label="使用状态" width='100px'>
                <template slot-scope="scope">
                  <span class="z-state" :class="checkStatus(scope.row.useClientStatusName)">{{scope.row.useClientStatusName || '—'}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="roomAddress" label="房间位置">
              </el-table-column>
              <el-table-column prop="userNum" label="使用人数" width='90px'>
              </el-table-column>
              <el-table-column label="当前使用人">
                <template slot-scope="scope">
                  <span v-for="(item,index) in scope.row.useUserList" :key="index">
                    <span v-show="index > 0">，</span>{{ item.realName||'' }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" prop="operation" label="操作">
                <template slot-scope="scope">
                  <a @click='cancelClick(scope.row.id)' v-show="writeAble == 'YES' && scope.row.useClientStatusName === '在用'">取消分配</a>
                  <a @click="useAllocationClick(scope.row.id, organId, '')" v-show="writeAble == 'YES' && scope.row.useClientStatusName === '空置'">分配</a>
                  <a @click="useAllocationClick(scope.row.id, organId, 'edit')" v-show="writeAble == 'YES' && scope.row.useClientStatusName === '在用'">修改</a>
                  <a @click="roomDetailInfoClick(scope.row.id, '', '', 1)">详情</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="h-table-bottom f-clearfix">
            <div class="h-table-pages f-pull-right">
              <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
            </div>
          </div>
        </div>
      </div>

    </section>
    <!--取消分配确认弹框 -->
    <el-dialog title="提示" custom-class="h-dialog-add el-dialog" :visible.sync="canceldialogVisible" width="30%">
      <span>房间取消分配后将变为空置状态，确定执行该操作吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="canceldialogVisible = false">取 消</el-button>
        <el-button class="u-submit-btn submit-btn" type="primary" @click="getCancel">确定</el-button>
      </span>
    </el-dialog>
    <v-allocation ref="allocation" @requestData="requestData"></v-allocation>
    <!--消息提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
    <v-room-detail ref="roomDetail"></v-room-detail>
  </div>
</template>
<script>
import allocation from '@/components/office-use-manage/view/allocation'; // 使用分配
// import roomDetail from '@/components/office-use-manage/view/room-detail'; // 详情弹出框
import roomDetail from '@/components/general-overview/view/addressnum-sub-detail'; // 详情弹出框
export default {
  components: {
    'v-allocation': allocation,
    'v-room-detail': roomDetail
  },
  data() {
    return {
      // 左边树数据
      aDeployTree: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: 'leaf'
      },
      writeAble: 'YES',
      organId: '',

      path: [],
      deleteYardId: '',
      canceldialogVisible: false, //取消分配弹框
      isBol: false, // 弹出框图形标识
      message: '', //弹出框弹出的信息
      YPromptShow: false,//提示对话框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      iconShowlist: [true, false, false],
      activeName: 'number',
      filterText: '',
      organName: '', //院落名称
      cancelId: '', //取消分配id
      list: [], //表格列表信息
      organList: [], //单位集合
      userId: '', //用户名id
      roomNoteList: [],
      roomLocationList: [], //房间位置
      publiclist: [], //公共数据
      floorAndStoreys: [],
      roomTypeList: [], //房间类型集合
      houseUseStatusList: [], //房间使用状态集合
      roomList: [], // 房间级联下拉选
      useStatusName: '', //房间状态名称
      officeNum: '', //办公室数量
      emptyNum: '', //空置房间数量
      userNum: '', //人员已分配数量
      useStatus: '', //房间状态
      roomTypeNameList: [], //类型名称集合
      search: {
        excessiveStatus: '', //超标情况
        roomStatus: '', //使用状态
        roomPos: [], // 房间位置
        roomNo: '', // 房屋号
        houseType: [], //房间类型
        useOrganName: '' //使用单位
      },
      storeysLabel: '', //楼层名称
      flag: 'area'
    };
  },
  activated() {
    if (sessionStorage.getItem('iconShowlist')) {
      this.iconShowlist = JSON.parse(sessionStorage.getItem('iconShowlist'));
    }
    this.search.roomStatus = '';
    this.getOrganLevelTree(); // 获取左侧tree数据
    
  },
  deactivated() {
    this.iconShowlist = [true, false, false];
    sessionStorage.setItem('iconShowlist', JSON.stringify(this.iconShowlist));

    //  数据初始化重置
    this.aDeployTree = [];
    this.houseUseStatusList = [];
    this.roomTypeList = [];
    this.list = [];
    this.total = 0;
    this.pageSize = 10; // 数据最大值
    this.page = 1;

    this.publiclist = [];
    this.officeNum = '0';
    this.emptyNum = '0';
    this.userNum = '0';
    
    this.roomLocationList = []
    
  },
  computed: {
    areaId() {
      return this.$store.state.mainData.areaId
    },
    loginOrganId() {
      return this.$store.state.mainData.loginOrganId
    }
  },
  watch: {

  },
  methods: {

    // 获取左侧tree数据
    getOrganLevelTree() {
      let params = {
        organId: this.loginOrganId,
      }
      this.$axiosGet(API.useManage_getOrganLevelTree, params).then(res => {
        if (res.data) {
          if( Array.isArray(res.data) ){
            this.aDeployTree = res.data;
          }else{
            this.aDeployTree = [res.data];
          }
        }
        let oDeploy = this.aDeployTree[0] || {};
        if( oDeploy.id ){
          this.organId = oDeploy.id;
          // this.$store.commit('organIdMutations', oDeploy.id);
        }else{
          this.organId = '';
        }
        this.$nextTick(() => {
          this.$refs.deployTree.setCurrentKey(oDeploy.id);
        });
        if( oDeploy.writeAble ) {
          this.writeAble = oDeploy.writeAble;
        }
        this.getTableData();
        this.getPublicData();
        this.getHousingLocation();

      })
    },
    // 左边树点击
    handleDeployNode( data={} ) {
      if( this.organId == data.id ){
        return;
      }
      if( data.id ){
        this.organId = data.id;
        // this.$store.commit('organIdMutations', data.id);
      }else{
        this.organId = '';
      }
      if( data.writeAble ) {
        this.writeAble = data.writeAble;
      }
      this.page = 1;

      // 切换树节点清空搜索数据
      this.search.excessiveStatus = '';
      this.search.roomStatus = '';
      this.search.roomPos = [];
      this.search.roomNo = '';
      this.search.houseType = [];
      this.search.useOrganName = '';
      
      this.getTableData();
      this.getPublicData();
      this.getHousingLocation();
    },
    getSearch() {
      this.page = 1;
      this.getTableData()
    },
    requestData() {
      this.getPublicData();
      this.getTableData();
    },
    useAllocationClick(id, organId, edit) {
      this.$refs.allocation.openModal(id, organId, edit);
    },
    //获取房间位置下拉框
    getHousingLocation() {
      let params = {
        useOrganId: this.organId || '',
      }
      this.$axiosGet(API.useManage_useManageSelect, params).then(res => {
        if (res.data) {
          this.roomLocationList = res.data.treeResponseList;
          this.roomTypeList = res.data.roomTypeList;
          this.houseUseStatusList = res.data.useClientStatusList;
        } else {
          this.roomLocationList = []
          this.roomTypeList = [];
          this.houseUseStatusList = [];
        }
      })
    },
    //使用状态
    checkStatus(value) {
      if (value === '空置') {
        return 's-state-success'
      } else if (value === '在用') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    //房间位置下拉
    getDetail() {
      let params = {
        useOrganId: this.organId,
        courtyardId: this.courtyardId
      }
      this.$axiosGet(API.organSearch2_getFloorAndStoreys, params).then(res => {
        if (res.data) {
          this.roomList = res.data || [];
        } else {
          this.roomList = [];
        }
      })
    },
    //获取列表信息
    getTableData() {
      let roomTypeIds = [];
      if (this.search.houseType.length == 2) {
        roomTypeIds.push(this.search.houseType[1]);
      } else if (this.search.houseType.length == 1) {
        roomTypeIds.push(this.search.houseType[0]);
      } else {
        roomTypeIds = [];
      }
      let roomTypeId = '';
      if( Array.isArray(this.search.houseType) && this.search.houseType[0] ){
        roomTypeId = this.search.houseType[0];
      }

      let params = {
        // organId: this.loginOrganId,
        courtyardId: this.search.roomPos[0] || '',
        useOrganId: this.organId || '',
        floorId: this.search.roomPos[1] || '',
        storeysId: this.search.roomPos[2] || '',
        roomTypeId: roomTypeId || '', //房间使用类型,  转码
        roomNo: this.search.roomNo, //房间号
        useClientStatus: this.search.roomStatus || '', //使用状态
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosGet(API.useManage_roomList, params).then(res => {
        if (res.data.data) {
          let list = [];
          list = res.data.data || [];
          this.total = res.data.total;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        } else {
          this.houseUseStatusList = [];
          this.roomTypeList = [];
          this.list = [];
          this.total = 0;
        }
      })
    },
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) {
          this.getTableData()
        }
      }, 1000)
    },
    //取消分配弹框
    cancelClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.canceldialogVisible = true;
    },

    getPublicData() {
      let params = {
        useOrganId: this.organId || '',
      }
      this.$axiosGet(API.useManage_getPublicData, params).then(res => {
        if (res.data.roomTypeEChartResponses) {
          this.publiclist = res.data.roomTypeEChartResponses;
          this.publiclist.forEach((item, index) => {
            if (item.roomTypeId === 'OFFICEHOUSE') {
              this.officeNum = item.roomNum || '0';
            } else if (item.roomTypeId === 'TYPENULL') {
              this.emptyNum = item.roomNum || '0'; //空置房间
            }
          })
          this.userNum = res.data.userNum || '0'; //人员分配数量
        }
      })
    },
    //取消分配操作
    getCancel() {
      let params = {
        roomId: this.deleteYardId
      }
      this.$axiosPost(API.useManage_cancelAssign, params).then(res => {
        if (res.result === 'success') {
          this.isBol = true;
          this.getPublicData();
        } else {
          this.isBol = false;
        }
        this.message = res.message;
        this.canceldialogVisible = false;
        this.YPromptShow = true;
      })
    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getTableData();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getTableData();
    },
    // 详情
    roomDetailInfoClick(id, type, chao, hasUseStatus) {
      this.$refs.roomDetail.openModal(id, type, chao, hasUseStatus);
    }
  }
};
</script>

<style  lang="scss">
.el-tooltip__popper {
  max-width: 400px;
  line-height: 180%;
}
.el-cascader {
  .el-input__icon {
    margin-right: -15px;
  }
}
.el-dialog {
  border-radius: 10px;
}
</style>

<style lang="scss" scoped>
.f-size {
  font-size: 16px;
}
.u-bread {
  height: 30px;
  line-height: 30px;
}
.router-link-exact-active {
  color: #2f70ff !important;
  p {
    color: #2f70ff !important;
  }
  .u-grid-content {
    border: 1px solid #2f70ff;
  }
}

.u-grid-content {
  border: 1px solid #e4e7eb;
  box-shadow: 2px 2px 5px #d7d7d7;
  padding: 25px 0;
  .u-grid-tips {
    position: absolute;
    right: 10px;
    top: 10px;
  }
  .icon-gantanhao:before {
    color: #c0c4cc;
  }
  .u-query-icons {
    width: 60px;
    height: 64px;
    margin: 5px auto 0;
    .iconfont {
      font-size: 65px;
      color: #606266;
    }
  }
  .u-query-txt {
    float: left;
  }
  .u-query-h2 {
    font-size: 38px;
  }
}
.el-row {
  margin: 20px 0;
  float: left;
  width: 100%;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  a {
    color: #303133;
  }
}
.el-col a p {
  color: #606266;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.m-deploy-section {
  height: calc(100% - 61px);
  display: flex;
  .u-treecontent {
    height: 100%;
    padding: 15px 0;
    overflow: auto;
  }
  .m-deploy-table {
    height: 100%;
    overflow: auto;
    margin: 0px;
    flex: 1 1 0%;
    padding-left: 20px;
  }
}
</style>
