<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="基础信息" :item="['基础信息']" type="2"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <!-- <button class="f-pull-right u-bread-btn">
              批量导入
            </button> -->
          <router-link to='/operate/basic-information/basic-update/add'>
            <button class="f-pull-right u-bread-btn">
              新增经营性房产
            </button>
          </router-link>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
                <li>
                  <span>街道</span>
                  <el-input clearable placeholder="请输入街道" v-model="street"></el-input>
                </li>
                <li>
                  <span>门牌号</span>
                  <el-input clearable placeholder="请输入门牌号" v-model="doorNum"></el-input>
                </li>
                <li>
                  <span>房屋状态</span>
                  <el-select v-model="houseStatus" filterable clearable placeholder="请选择房屋状态">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in houseStatusList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
                </li>
                <li>
                  <span>取得方式</span>
                  <el-select v-model="acquireWay" filterable clearable placeholder="请选择取得方式">
                    <!-- <el-option label="全部" value=""></el-option> -->
                    <el-option v-for="item in acquireWayList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
                    </el-option>
                  </el-select>
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
          <el-table-column prop="street" label="街道">
          </el-table-column>
          <el-table-column prop="houseNo" label="门牌号">
          </el-table-column>
          <el-table-column prop="houseAddress" label="地址坐落">
          </el-table-column>
          <el-table-column prop="area" label="经营面积(㎡)">
          </el-table-column>
          <el-table-column prop="acquisitionModeName" label="取得方式">
          </el-table-column>
          <el-table-column prop="statusName" label="房屋状态">
          </el-table-column>
          <el-table-column prop="picture" label="房间照片">
            <template slot-scope="scope">
              <i :class="scope.row.picture == 'YES'?'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作" width="250px">
            <template slot-scope="scope">
              <a @click="basicInfoClick(scope.row.id)">详情</a>
              <router-link v-show="scope.row.statusName!='出租中'" :to="{path: '/operate/basic-information/basic-update/edit', query:{id: scope.row.id}}">修改</router-link>
              <a @click="deleteClick(scope.row.id)" v-show="scope.row.status ==='DEALIDLE'">删除</a>
              <a @click="idleClick(scope.row.id)" v-show="scope.row.status ==='DEALIDLE'">闲置原因补录</a>
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
    <el-dialog title="闲置原因补录" custom-class="h-dialog-add" :visible.sync="rentEntryVisible" width="630px" :before-close="resetForm">
      <el-form label-width="140px" :model="ruleForm" :rules="rules" ref="ruleForm">
        <el-form-item label="闲置原因" prop="idleness">
          <el-select v-model="ruleForm.idleness" filterable clearable placeholder="请选择闲置原因">
            <el-option v-for="item in ruleForm.idlenessList" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm" class="u-submit-btn cancel-btn">取消</el-button>
        <el-button class="u-submit-btn submit-btn" @click="idleReson" :loading="loading">保存</el-button>
      </div>
    </el-dialog>
    <!-- 弹窗结束 -->

    <!-- 详情 -->
    <basic-detail ref="basicDetail"></basic-detail>
    <!-- 查看图片 -->
    <v-vuePopupPicture ref="Vpicture"></v-vuePopupPicture>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>

  </div>
</template>

<script>
import basicDetail from '@/components/operate/basic-information/basic-detail'; // 详情弹出框
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
      street: '', //街道
      doorNum: '',//门牌号
      idlereason: '', //闲置原因英文
      ruleForm: {
        idleness: '',
        idlenessList: [], //闲置原因集合
      },
      houseStatus: '', //房屋状态
      acquireWay: '', //取得方式
      acquireWayList: [], //取得方式集合
      houseStatusList: [], //房屋状态  
      rules: {
        idleness: [
          { required: true, message: '请选择闲置原因', trigger: 'change' }
        ],
      },
      propertyList: [] //下拉框产权状态集合
    };
  },
  activated() {
    this.acquireWay = '';
    this.clearable = '';
    this.getDataRequest();
    this.getSelectRequest(); // 获取院落下拉框列表
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    }
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
      this.$nextTick(() => {
        this.$refs["ruleForm"].resetFields();
      })
      this.getSelectRequest();
      this.idleDetail(id);
    },
    // 详情
    basicInfoClick(id) {
      this.$refs.basicDetail.openModal(id);
    },
    floorBatchaddClick() {
      this.$refs.floorBatchadd.openModal();
    },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '你确定要删除吗？';
    },
    //闲置原因补录
    idleReson() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let params = {
            houseId: this.dealId,
            idleReason: this.ruleForm.idleness
          }
          this.loading = true;
          this.$axiosPost(API.dealhouse_doUpdateIdleReason, params).then(res => {
            this.YPromptShow = true;
            if (res.result === 'success') {
              this.isBol = true;
              BURYINGPOINT.buryingPoint('经营性房产', '基础信息', '闲置原因补录')
            } else {
              this.isBol = false;
            }
            this.loading = false;
            this.message = res.message;
          })
        }
      })
    },

    //闲置原因详情回显
    idleDetail(id) {
      let params = {
        houseId: id || '',
      }
      this.$axiosGet(API.dealhouse_idleReasonDetail, params).then(res => {
        this.ruleForm.idleness = res.data.idleReason || '';
      })
    },

    // 删除
    YDeleteClick() {
      let params = {
        houseId: this.deleteYardId
      }
      this.$axiosPost(API.dealhouse_doLogicDelete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
          BURYINGPOINT.buryingPoint('经营性房产', '基础信息', '删除')
        } else {
          this.isBol = false;
        }
        this.message = res.message;
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
      let params = {
        street: this.street,
        houseNo: this.doorNum,
        status: this.houseStatus || '',
        acquisitionMode: this.acquireWay || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.dealhouse_list, params).then(res => {
        let list = [];
        if (res.data) {
          list = res.data.data;
          this.total = res.data.total;
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

    // 获取下拉框
    getSelectRequest() {
      this.$axiosGet(API.dealhouse_queryStatusAndAcquisitionList, {}).then(res => {
        this.acquireWayList = res.data.acquisitionModeList;
        this.houseStatusList = res.data.houseStatusList;
        this.ruleForm.idlenessList = res.data.idleReasonList;
      });
    },

  }
};
</script>

<style lang="scss">
</style>
