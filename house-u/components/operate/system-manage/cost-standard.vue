<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="费用标准" :item="['费用标准']" type="2"></Y-Breadcrumb>

      </div>
      <div class="h-table f-relative">
        <el-table :data="list" stripe style="width: 100%">
          <el-table-column prop="date" type="index" fixed="left" label="序号" width="50">
          </el-table-column>
          <el-table-column prop="name" label="名称">
          </el-table-column>
          <el-table-column prop="describe" label="描述">
          </el-table-column>
          <el-table-column prop="enabled" label="是否启用">
          </el-table-column>
          <el-table-column prop="enabledTime" label="启用/停用时间">
          </el-table-column>
          <el-table-column fixed="right" prop="operation" label="操作">
            <template slot-scope="scope">
              <!-- <a @click="deleteClick(scope.row.storeysId)">停用</a> -->
              <a @click="costRentClick(scope.row.storeysId)">修改</a>
            </template>

          </el-table-column>
        </el-table>
      </div>
      <div class="h-table-bottom f-clearfix">
        <!-- <div class="h-table-btns f-pull-left">
          <button class="el-button-export" @click="exportClick">
            <i class="iconfont icon-daochu"></i>导出</button>
        </div> -->
        <!-- <div class="h-table-pages f-pull-right">
          <div class="block">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="page" :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
          </div>
        </div> -->
      </div>
    </section>
    <!-- 滞纳金弹框 -->
    <!-- <cost-latefee ref="costLatefee" @requestData="getDataRequest"></cost-latefee> -->
    <!-- 租金金弹框 -->
    <cost-rent ref="costRent"></cost-rent>

    <!--删除提示框-->
    <!-- <Y-Confirm v-model="YConfirmShow" :message="message" @click="YDeleteClick"></Y-Confirm> -->
    <!--操作提示框-->
    <!-- <Y-Prompt v-model="YPromptShow" :isBol="isBol" :message="message" @click="YPromptClick"></Y-Prompt> -->

  </div>
</template>

<script>
import costRent from '@/components/operate/system-manage/cost-setup/cost-rent'; // 租金弹出框
// import costLatefee from '@/components/operate/system-manage/cost-setup/cost-latefee'; // 滞纳金弹出框
export default {
  components: {
    'cost-rent': costRent,
    // 'cost-latefee': costLatefee,
  },
  data() {
    return {
      id: '', // 详情id
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      list: [{
        name: '租金设置',
        describe: '对租金收取方式、租金收取时间、租金年增长率等进行设置', //描述
        enabled: '启用', //是否启动
        enabledTime: '2019-08-24', //启动时间
      }], // 列表数据集合
    };
  },
  activated() {
  },
  computed: {
    token() {
      return this.$store.state.mainData.token
    }
  },
  methods: {
    //获取院落名称
    // getCourtyardName(value) {
    //   this.courtySelectList.forEach((item, index) => {
    //     if (value === item.courtyardId) {
    //       this.courtyardName = item.courtyardName;
    //       this.courtyardId = value;
    //     }
    //   })

    // },
    // costLatefeeClick() {
    //   this.$refs.costLatefee.openModal();
    // },

    //租金
    costRentClick() {
      this.$refs.costRent.openModal();
    },
    // 详情
    // buildingInfoClick(id) {
    //   this.$refs.buildingDetail.openModal(id);
    // },



  },

};
</script>

<style lang="scss">
</style>
