<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="超标预警" :item="['超标预警']" type="1"></Y-Breadcrumb>
        <div class="u-bread-btn-group">
          <button class="f-pull-right u-bread-btn" @click="warningSetupClick">预警设置</button>
        </div>
      </div>
      <div class="m-search">
        <table>
          <tr>
            <td>
              <ul class="f-clearfix" @keydown="$keydown($event, getSearch)">
                <li>
                  <span>单位名称</span>
                  <el-input v-model="search.organName" placeholder="请输入单位名称"></el-input>
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
          <el-table-column label="序号" width="60px">
            <template slot-scope="scope">
              {{$serialUtils(pageSize, page, scope.row.num)}}
            </template>
          </el-table-column>
          <el-table-column label="单位名称" prop="organName"></el-table-column>
          <el-table-column label="编制人数" prop="establishNum"></el-table-column>
          <el-table-column label="实际人数" prop="personNum">
            <!-- <template slot-scope="scope">
              <router-link :to="{path: '/warning-manage/warning-list', query: {organId: scope.row.organId, type: 'user'}}">{{scope.row.personNum}}</router-link>
            </template> -->
          </el-table-column>
          <el-table-column label="核定办公室使用面积（㎡）" prop="standardAreaSum"></el-table-column>
          <el-table-column label="实际办公室使用面积（㎡）" prop="officeAreaSum"></el-table-column>
          <el-table-column label="总超标面积（㎡）" prop="excessiveAreaSum">
            <template slot-scope="scope">
              <router-link :to="{path: '/warning-manage/warning-list', query: {organId: scope.row.organId, type: 'area'}}">{{scope.row.excessiveAreaSum}}</router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div>
      </div>
    </section>
    <!-- 预警设置 -->
    <warning-setup ref="warningSetup" @warningSetCallBack="warningSetCallBack"></warning-setup>
    <!--上传附件-->
    <!-- <v-upload ref="VUpload" :max="maxLength" @vueUpload="fileUploadRequest" accept="img/pdf"></v-upload> -->
    <!--消息提示框-->
    <!-- <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt> -->
  </div>
</template>

<script>
import warningSetup from '@/components/warning-manage/warning-setup'; // 预警设置

export default {
  components: {
    'warning-setup': warningSetup
  },
  data() {
    return {
      page: 1,
      pageSize: 10,
      total: 0,
      message: '',
      isBol: false,
      YPromptShow: false,
      list: [],
      search: {
        organName: ''
      }
    }
  },
  activated() {
    this.getDataRequest();
  },
  methods: {
    getSearch() {
      this.page = 1;
      this.getDataRequest();
    },
    handleSizeChange(i) {
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) {
      this.page = i;
      this.getDataRequest();
    },
    getDataRequest() {
      let params = {
        organName: this.search.organName,
        pageNum: this.page,
        pageSize: this.pageSize
      }
      this.$axiosPost(API.warning_organList, params).then(res => {
        if (res.result === 'success') {
          let list = res.data.data || [];
          if (list) {
            list.forEach((item, index) => {
              list[index].num = index + 1;
            });
          }
          this.list = list;
          this.total = res.data.total;
        } else {
          this.list = [];
          this.total = 0;
        }
      })
    },
    // 预警设置
    warningSetupClick() {
      this.$refs.warningSetup.openModal();
    },
    // 预警设置弹出框回调方法
    warningSetCallBack(data) {
      this.getDataRequest();
    }
  }
}
</script>

<style lang="scss">
</style>
