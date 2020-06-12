<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="权属管理" :item="['权属管理']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="ownershipRegistrationInfoClick('')">权属登记</button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>产权办理情况</span>
                  <el-select v-model="search.ownerShip" clearable placeholder="请选择产权办理情况">
                    <!-- <el-option label="全部" value=''></el-option> -->
                    <el-option v-for="(item, index) in ownerShipList" :key="index" :label="item" :value="item"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>产权单位</span>
                  <el-select clearable v-model="search.ownerShipOrgan" placeholder="请选择产权单位">
                    <el-option v-for="(item, index) in propertyOrganList" :key="index" :label="item.organName" :value="item.organId"></el-option>
                  </el-select>
                </li>
                <li>
                  <span>房屋取得方式</span>
                  <el-select clearable v-model="search.houseAcquisiton" placeholder="请选择房屋取得方式">
                    <el-option v-for="(item, index) in houseAcquisitonList" :key="index" :label="item.dicValue" :value="item.dicValue"></el-option>
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
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" fixed="left" label="序号" width="50">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column prop="name" label="产权办理情况">
            <template slot-scope="scope">
              {{scope.row.warrantSituation}}
            </template>
          </el-table-column>
          <el-table-column prop="address" label="产权单位">
            <template slot-scope="scope">
              {{scope.row.propertyOrganName}}
            </template>
          </el-table-column>
          <el-table-column prop="company" label="房屋地址">
            <template slot-scope="scope">
              {{scope.row.houseLocation}}
            </template>
          </el-table-column>
          <el-table-column prop="houseAcquisitionMode" label="房屋取得方式">
            <template slot-scope="scope">
              {{scope.row.houseAcquisitionMode}}
            </template>
          </el-table-column>
          <el-table-column prop="upfloor" label="房屋面积">
            <template slot-scope="scope">
              {{scope.row.houseArea}}
            </template>
          </el-table-column>
          <el-table-column prop="downfloor" label="宗地面积">
            <template slot-scope="scope">
              {{scope.row.landArea}}
            </template>
          </el-table-column>
          <el-table-column prop="downfloor" label="转移状态">
            <template slot-scope="scope">
              <!-- {{scope.row.transferStatus}} -->
              <i :class="scope.row.transferStatus==='YES'?'icon-dui4':'icon-cuo'" class="iconfont u-upload-icon"></i>
            </template>
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <a @click="ownershipDetailInfoClick(scope.row.ownershipFirstId, scope.row.transferStatus)">详情</a>
              <a @click="ownershipRegistrationInfoClick(scope.row.ownershipFirstId)" v-show="scope.row.transferStatus === 'NO'">修改</a>
              <a @click="getDeleteId(scope.row.ownershipFirstId)">删除</a>
              <a v-show="scope.row.transferStatus === 'NO' && scope.row.houseAcquisitionMode !== '租借' && scope.row.warrantSituation !=='产权未办理' && scope.row.warrantSituation !=='产权待界定'" @click="ownershipTransferInfoClick(scope.row.propertyOrganName, scope.row.ownershipFirstId)">产权转移</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <div class="h-table-pages f-pull-right">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </section>
    <!-- 权属登记弹出框 -->
    <ownership-registration ref="ownershipRegistration" @requestData="getList"></ownership-registration>
    <!-- 详情弹出框 -->
    <ownership-detail ref="ownershipDetail"></ownership-detail>
    <!-- 产权转移弹出框 -->
    <ownership-transfer ref="ownershipTransfer" @requestData="getList"></ownership-transfer>
    <!--删除提示框-->
    <Y-Confirm v-model="YConfirmShow" @click="YDeleteClick"></Y-Confirm>
    <!--操作提示框-->
    <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt>
  </div>
</template>

<script>
import ownershipRegistration from '@/components/basic-information/ownership-manage/ownership-registration'; // 权属登记弹出框
import ownershipDetail from '@/components/basic-information/ownership-manage/ownership-detail'; // 详情弹出框
import ownershipTransfer from '@/components/basic-information/ownership-manage/ownership-transfer'; // 产权转移弹出框
import { setTimeout } from 'timers';
export default {
  components: {
    'ownership-registration': ownershipRegistration,
    'ownership-detail': ownershipDetail,
    'ownership-transfer': ownershipTransfer // 产权转移
  },
  data() {
    return {
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      ownershipFirstId: '', // 权属ID
      search: {
        ownerShip: '',
        ownerShipOrgan: '',
        houseAcquisiton: ''
      },
      list: [],
      ownerShipList: [
        '已办理，且两证合一',
        '已办理，且两证分离',
        '产权未办理',
        '仅办理房产证',
        '仅办理土地证',
        '产权待界定'
      ],
      houseAcquisitonList: [], // 房屋取得方式
      propertyOrganList: [] // 产权单位
    };
  },
  activated() {
    this.search.ownerShip = '';
    this.getList();
    this.getSelectList()
  },
  computed: {
    // searchTableListBol() {
    //   return this.$store.state.searchTableListBol.tableListBol["BULIDING_INFO"];
    // }
  },
  methods: {
    getSelectList() {
      this.$axiosPost(API.ownershipFirst_queryOwnershipFirstSelect, {}).then(res => {
        if (res.result === 'success') {
          this.houseAcquisitonList = res.data.houseAcquisitionMode;
          this.propertyOrganList = res.data.propertyOrgan;
        }
      })
    },
    // 权属登记
    ownershipRegistrationInfoClick(ownershipFirstId) {
      this.$refs.ownershipRegistration.openModal(ownershipFirstId);
    },
    // 权属详情
    ownershipDetailInfoClick(id, transferStatus) {
      this.$refs.ownershipDetail.openModal(id, transferStatus);
    },
    // 权属转移
    ownershipTransferInfoClick(propertyOrganName, id) {
      this.$refs.ownershipTransfer.openModal(propertyOrganName, id);
    },
    getDeleteId(ownershipFirstId) {
      this.ownershipFirstId = ownershipFirstId;
      this.YConfirmShow = true;
    },
    // 删除数据
    YDeleteClick() {
      let params = {
        ownershipFirstId: this.ownershipFirstId
      }
      this.$axiosPost(API.ownershipFirst_doDelete, params).then(res => {
        this.YConfirmShow = false;
        this.YPromptShow = true;
        if (res.result === 'success') {
          this.isBol = true;
        } else {
          this.isBol = false;
        }
        this.message = res.message;
      })
    },
    // 操作成功回调函数
    YPromptClick() {
      setTimeout(() => {
        if (this.isBol) this.getList();
      }, 1000)
    },
    getSearch() {
      this.page = 1;
      this.getList();
    },
    // 获取列表数据
    getList() {
      let params = {
        propertyOrganId: this.search.ownerShipOrgan || '',
        houseAcquisitionMode: this.search.houseAcquisiton || '',
        warrantSituation: this.search.ownerShip || '',
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.ownershipFirst_list, params).then(res => {
        if (res.result === 'success') {
          this.total = res.data.total;
          let list = res.data.data;
          if (list.length > 0) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        }
      })

    },
    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getList();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getList();
    }
  }
};
</script>

<style lang="scss">
</style>
