<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="无人办公室查询" :item="['无人办公室查询']" type="2"></Y-Breadcrumb>
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
              <a @click="basicInfoClick(scope.row.id)">{{scope.row.roomNo}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="roomTypeNameString" label="房间类型">
          </el-table-column>
          <el-table-column prop="useArea" label="使用面积（㎡）">
          </el-table-column>
          <el-table-column prop="buildArea" label="建筑面积（㎡）">
          </el-table-column>
          <el-table-column prop="roomAddress" label="房间位置">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.id)">详情</a>
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

    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!-- 查看图片 -->
    <v-vuePopupPicture ref="Vpicture"></v-vuePopupPicture>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import basicDetail from '@/components/office-use-manage/view/unmanned-office-detail'; // 详情弹出框
import vuePopupPicture from '@/assembly/vue-popup-picture'; // 图片控件
export default {
  components: {
    'basic-detail': basicDetail,
    "v-vuePopupPicture": vuePopupPicture
  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      rentEntryVisible: false, //闲置原因补录弹框
      loading: false,
      dealId: '',//闲置补录id
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      address: '', //地址
      idlereason: '', //闲置原因英文
      houseStatus: '', //房屋状态
      houseStatusList: [], //房屋状态  
      rules: {
        idleness: [
          { required: true, message: '请选择闲置原因', trigger: 'change' }
        ],
      },
      propertyList: [], //下拉框产权状态集合
      addressId: '', //房间号
      roomLocationList: [], //房间位置下拉
      roomLocation: [], //房间位置


    };
  },
  activated() {
    this.roomLocation = [];
    this.addressId = '';
    this.getDataRequest();
    // this.getSelectRequest(); // 获取院落下拉框列表
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
    resetForm() {
      this.rentEntryVisible = false;
    },
    //闲置原因补录
    idleClick(id) {
      this.rentEntryVisible = true;
      this.dealId = id;
    },
    // 详情
    basicInfoClick(id) {
      this.$refs.basicDetail.openModal(id);
    },
    // floorBatchaddClick() {
    //   this.$refs.floorBatchadd.openModal();
    // },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '你确定要删除吗？';
    },
    //闲置原因补录
    idleReson() {

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
      let params = {
        useOrganId: this.loginOrganId,
        courtyardId: this.roomLocation[0] || '',
        floorId: this.roomLocation[1] || '',
        storeysId: this.roomLocation[2] || '',
        roomNo: this.addressId || '',
        currentPage: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.useManage_unmannedOfficeList, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.data.length;
          this.list = list;
        } else {
          this.list = [];
          this.total = 0;
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

    // 获取房屋位置下拉框
    getHousingLocation() {
      let params = {
        organId: this.loginOrganId,
      }
      this.$axiosGet(API.useManage_useManageSelect, params).then(res => {
        if(res.data && res.data.treeResponseList){
          this.roomLocationList = res.data.treeResponseList || [];
        }       
      })
    },

  }
};
</script>

<style lang="scss">
</style>
