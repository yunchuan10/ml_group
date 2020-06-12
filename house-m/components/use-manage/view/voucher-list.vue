<template>
  <div>
    <div class="m-search">
      <table>
        <tr>
          <td>
            <ul class="f-clearfix" @keydown="$keydown($event, searchClick)">
              <li>
                <span>单位名称</span>
                <el-select v-model="organName" filterable clearable placeholder="请选择单位名称">
                  <el-option v-for="item in organNameSelectList" :key="item.organId" :label="item.organName" :value="item.organName">
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
        <el-table-column fixed="left" label="序号" width="50">
          <template slot-scope="scope">
            {{$serialUtils(pageSize, page, scope.row.num)}}
          </template>
        </el-table-column>
        <el-table-column label="单位名称" class="f-relative" prop="organName">
        </el-table-column>
        <el-table-column prop="state" label="使用状态">
          <template slot-scope="scope">
            <span class="z-state" :class="checkStatus(scope.row.grantStatus)">{{scope.row.grantStatus === 'YES' ? '已发放': '未发放' || '—'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="发放时间" prop="grantDate" format='yyyy-MM-dd'>
          <template slot-scope="scope">
            {{scope.row.grantDate ?scope.row.grantDate.substr(0, 10):'—'}}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作">
          <template slot-scope="scope">
            <router-link v-show="scope.row.grantStatus === 'YES'" :to="{path: '/use-manage/use-list/style-list', query: {organId: scope.row.organId, organName: scope.row.organName}}">打印凭证</router-link>
            <a @click="issueVoucherInfoClick(scope.row.organId, scope.row.organName,scope.row.grantDate,scope.row.grantStatus)">发放凭证</a>
            <a v-show="scope.row.grantStatus === 'YES'" @click="voucherDetailInfoClick(scope.row.organId)">详情查看</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="h-table-bottom f-clearfix">
      <!-- <div class="h-table-btns f-pull-left">
        <button class="el-button-export"><i class="iconfont icon-daochu"></i>导出</button>
      </div> -->
      <div class="h-table-pages f-pull-right">
        <div class="block">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </div>
      </div>
    </div>
    <!-- 发放凭证弹出框 -->
    <issue-voucher ref="issuevoucher" @requestData="getDataRequest"></issue-voucher>
    <!-- 详情弹出框 -->
    <voucher-detail ref="voucherDetail"></voucher-detail>
  </div>
</template>

<script>
import issuevoucher from "./issue-voucher"; // 发放凭证弹出框
import voucherDetail from "./voucher-detail"; // 详情弹出框
export default {
  components: {
    "issue-voucher": issuevoucher,
    "voucher-detail": voucherDetail
  },
  data() {
    return {
      organName: '', //单位名称
      deleteYardId: '', // 删除ID
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [], // 列表数据集合
      grantDate: '', //发放时间
      organNameSelectList: [] // 查询院落list集合
    };
  },
  activated() {
    this.organName = '';
    this.$emit("getMsg", '');
    this.getSelect();
    this.getDataRequest();
  },
  computed: {
    organId() {
      return this.$store.state.mainData.loginOrganId;
    },
  },
  methods: {
    checkStatus(value) {
      if (value === 'YES') {
        return 's-state-success'
      } else if (value === 'NO') {
        return 's-state-prohibited'
      } else {
        return ''
      }
    },
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },
    // 发放凭证
    issueVoucherInfoClick(id, name, grantDate, grantStatus) {
      this.$refs.issuevoucher.openModal(id, name, grantDate, grantStatus);
    },
    // 详情
    voucherDetailInfoClick(id) {
      this.$refs.voucherDetail.openModal(id);
    },
    getDataRequest() { // 获取列表数据
      let params = {
        organId: this.organId,
        organName: this.organName || '',
        pageNum: this.page,
        pageSize: this.pageSize
      };
      this.$axiosGet(API.certificateRoom_list, params).then(res => {
        if (res.data) {
          let list = [];
          list = res.data.data;
          this.total = res.data.total;
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
        }
      });
    },
    //打印凭证
    getPrint(id) {
      this.$router.push({ path: '/use-manage/view/style-list' })
    },
    // 获取下拉选单位名称
    getSelect() {
      let params = {
        areaId: this.$store.state.mainData.areaId
      }
      this.$axiosGet(API.certificateRoom_getOrganByOrganId, params).then(res => {
        this.organNameSelectList = res.data;
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
    // 查询
    searchClick() {
      this.page = 1;
      this.getDataRequest()
    }
  }
};
</script>

<style lang="scss">
</style>
