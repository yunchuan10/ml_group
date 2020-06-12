<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <Y-Breadcrumb title="配置管理"></Y-Breadcrumb>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
          <a>基本信息
          </a>
        </li>
        <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
          <a>合同正文
          </a>
        </li>
        <li @click="pageSelect = 'remind'" :class="{'active':pageSelect=='remind'}">
          <a>合同到期提醒
          </a>
        </li>
        <li @click="pageSelect = 'rental'" :class="{'active':pageSelect=='rental'}">
          <a>租金入账情况
          </a>
        </li>
        <li @click="pageSelect = 'file'" :class="{'active':pageSelect=='file'}">
          <a>附件
          </a>
        </li>
      </ul>
      <div class="h-table f-relative">

        <div class="h-tab-content" v-show="pageSelect=='basic'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">合同编号</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">合同起止日期</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">合同标的物</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">合同租金</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">出租方</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">承租人</th>
              <td></td>
            </tr>
            <tr>
              <th class="f-text-right">合同状态</th>
              <td></td>
            </tr>
          </table>
        </div>

        <div class="h-tab-content" v-show="pageSelect=='property'">
          <div class="h-tab-content">

          </div>

        </div>

        <div class="h-tab-content" v-show="pageSelect=='remind'">
          <div class="h-table">
            <el-table :data="list" stripe ref="multipleTable" style="width: 100%">
              <el-table-column fixed="left" label="序号" type="index" width="50">
              </el-table-column>
              <el-table-column label="提醒日期" key='3'>
              </el-table-column>
              <el-table-column label="提醒标题">
              </el-table-column>
              <el-table-column label="提醒正文">
              </el-table-column>
              <el-table-column label="提醒人">
              </el-table-column>
              <el-table-column label="提醒方式">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='rental'">
          <div class="h-table f-relative">
            <el-table :data="list" stripe style="width: 100%">
              <el-table-column prop="date" fixed="left" label="序号" width="50">
              </el-table-column>
              <el-table-column label="租金起始日期">
              </el-table-column>
              <el-table-column label="租金日期">
              </el-table-column>
              <el-table-column label="租金时长">
              </el-table-column>
              <el-table-column label="租金金额（元）">
              </el-table-column>
              <el-table-column label="租金入账情况">
              </el-table-column>
              <el-table-column label="未入账原因">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="h-tab-content" v-show="pageSelect=='file'">
          <table class="h-table-info">
            <tr>
              <th class="f-text-right">身份证</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">营业执照</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">相关附件</th>
              <td>
                <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item.url" style="width:100px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
          </table>
        </div>

      </div>
    </section>

  </div>
</template>

<script>
export default {
  components: {

  },
  data() {
    return {
      YPromptShow: false, // 操作成功提示框是否显示
      isBol: false, // 操作成功弹出框的图标
      message: '', // 确认信息
      YConfirmShow: false, // 删除弹出框
      total: 0, // 数据总数
      pageSize: 10, // 数据最大值
      page: 1, // 当前页 
      pageSelect: "",
      imgUrl: [],
      list: [
        {
          lessee: '',
          phone: '183125639',
          nature: '',
          rang: '', //范围
        }
      ], // 列表数据集合
      floorId: '', //楼座id
      courtyardId: '', // 院落ID
      courtyardName: '',//院落名称
      storeysName: '', // 楼层名称
      floorName: '', // 楼座名称
      storeysId: '', //楼层id
      deleteYardId: '', // 删除ID
      storeysPlanImgUrls: '',
      storeysCadImgUrls: '',
      courtySelectList: [] //下拉框院落名称集合
    };
  },
  activated() {
    this.pageSelect = "basic";
    // this.getDataRequest();
    // this.getSelectRequest(); // 获取院落下拉框列表
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
    // 院落名称更改
    getCourtyardName(value) {
      this.courtySelectList.forEach((item, index) => {
        if (value === item.courtyardId) {
          this.courtyardName = item.courtyardName;
        }
      })
    },
    // 详情
    blacklistInfoClick(id) {
      this.$refs.blacklistDetail.openModal(id);
    },
    // floorBatchaddClick() {
    //   this.$refs.floorBatchadd.openModal();
    // },
    deleteClick(id) { // 存储删除参数
      this.deleteYardId = id;
      this.YConfirmShow = true;
      this.message = '删除楼层将会连同该楼层内的房间一并删除，确认删除吗？';
    },
    // 删除
    YDeleteClick() {
      let params = {
        storeysId: this.deleteYardId
      }
      this.$axiosPost(API.storeys_delete, params).then(res => {
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
    YPromptClick() {
      if (this.isBol) {
        this.getDataRequest();
      }
    },


    handleSizeChange(i) { // 切换数据条数
      this.pageSize = i;
      this.getDataRequest();
    },
    handleCurrentChange(i) { // 切换数据页数
      this.page = i;
      this.getDataRequest();
    },
    // 获取院落下拉框
    getSelectRequest() {
      this.$axiosPost(API.courtYard_getCourtySelect, {}).then(res => {
        this.courtySelectList = res.data;
      });
    },
    exportClick() { // 到处
      window.open(`${API.storeys_export}?token=${this.token}`)
      // this.$axiosPost(API.courtYard_export, params).then(res => {
      // });
    }
  }
};
</script>

<style lang="scss">
</style>
