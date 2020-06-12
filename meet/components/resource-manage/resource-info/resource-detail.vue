<template>
  <div>

    <zl-rightDialog v-model="carDetailShow" title="详情" width="950px">
      <div class="detail-top-table h-tab-content">
        <table class="h-table-info">
          <tr>
            <th class="f-text-right">地区</th>
            <td>{{datas.name}}</td>
            <th class="f-text-right">详细地址</th>
            <td>{{datas.detailedAddress}}</td>
          </tr>
          <tr>
            <th class="f-text-right">简介</th>
            <td colspan="3">{{datas.briefIntroduction}}</td>
          </tr>
          <tr>
            <th class="f-text-right">VR全景</th>
            <td colspan="3">
              <a href="">{{datas.vrImg}}</a>
            </td>
          </tr>
          <tr>
            <th class="f-text-right">区位图</th>
            <td colspan="3">
              <!-- <img
                  v-for="(item, index) in imgUrl"
                  :key="index"
                  v-show="item"
                  :src="item"
                  style="width:100px;height:100px;margin:5px;"
                > -->
              <img :src="$store.state.imgPath.comimg" style="width:100px;height:100px;margin:5px;" />
            </td>
          </tr>
          <tr>
            <th class="f-text-right">宾馆图片</th>
            <td colspan="3">
              <viewer>
                <img :src="$store.state.imgPath.comimg" style="width:100px;height:100px;margin:5px;" />
              </viewer>
            </td>
          </tr>
        </table>
      </div>
      <!--  tab切换 -->
      <ul class="house-nav-tab">
        <li @click="pageSelect = 'basic'" :class="{'active':pageSelect=='basic'}">
          <a>客房信息</a>
        </li>
        <li @click="pageSelect = 'property'" :class="{'active':pageSelect=='property'}">
          <a>会议室信息</a>
        </li>
        <li @click="pageSelect = 'houseinfo'" :class="{'active':pageSelect=='houseinfo'}">
          <a>餐厅信息</a>
        </li>
      </ul>

      <!-- 客房描述 -->
      <div class="h-tab-content" v-show="pageSelect=='basic'">
        <table class="h-table-info">
          <tr>
            <th class="f-text-right">客房描述</th>
            <td colspan="3">{{roomDescription}}</td>
          </tr>
          <tr>
            <th class="f-text-right">套房类型</th>
            <td>{{suiteType}}</td>
            <th class="f-text-right">房间数量</th>
            <td>{{roomNum}}</td>
          </tr>
          <tr>
            <th class="f-text-right">价格</th>
            <td>{{roomPrice}}</td>
            <th class="f-text-right">房型描述</th>
            <td>{{roomType}}</td>
          </tr>
          <tr>
            <th class="f-text-right">设施设备</th>
            <td colspan="3">{{roomDevice}}</td>
          </tr>
          <tr>
            <th class="f-text-right">图片</th>
            <td colspan="3">
              <!-- <viewer :images="imgUrl">
                  <img v-for="(item, index) in imgUrl" :key="index" v-show="item" :src="item" style="width:100px;height:100px;margin:5px;" />
                </viewer> -->
              <viewer>
                <img :src="$store.state.imgPath.comimg" style="width:100px;height:100px;margin:5px;" />
              </viewer>
            </td>
          </tr>
        </table>
      </div>

      <div class="h-tab-content" v-show="pageSelect=='property'">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column fixed prop="date" label="序号" width="150"></el-table-column>
          <el-table-column prop="name" label="证号" width="120"></el-table-column>
          <el-table-column prop="province" label="产权名称" width="120"></el-table-column>
          <el-table-column prop="city" label="地址" width="120"></el-table-column>
          <el-table-column prop="address" label="建筑面积" width="300"></el-table-column>
          <el-table-column prop="zip" label="价值（万元）" width="120"></el-table-column>
          <el-table-column prop="state" label="使用状态" width="120"></el-table-column>
          <el-table-column prop="Comdate" label="竣工日期" width="120"></el-table-column>
          <el-table-column prop="way" label="取得方式" width="120"></el-table-column>
          <el-table-column prop="structure" label="建筑结构" width="120"></el-table-column>
          <el-table-column prop="owner" label="所有权人" width="120"></el-table-column>
          <el-table-column prop="certifidate" label="发证日期" width="120"></el-table-column>
          <el-table-column prop="usedate" label="使用日期" width="120"></el-table-column>
          <el-table-column fixed="right" prop="provincestate" label="产权状态" width="120"></el-table-column>
        </el-table>
      </div>
      <div class="h-tab-content" v-show="pageSelect=='houseinfo'">
        <el-table :data="houseinfoData" border style="width: 100%">
          <el-table-column fixed prop="date" label="序号" width="60"></el-table-column>
          <el-table-column prop="name" label="房间号"></el-table-column>
          <el-table-column prop="province" label="楼座名称" width="120"></el-table-column>
          <el-table-column prop="city" label="楼层名称"></el-table-column>
          <el-table-column prop="address" label="建筑面积(㎡)" width="120"></el-table-column>
          <el-table-column prop="zip" label="使用面积(㎡)" width="120"></el-table-column>
          <el-table-column prop="state" label="使用状态" width="100"></el-table-column>
        </el-table>
      </div>
    </zl-rightDialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      carDetailShow: false, // 弹出框开关
      datas: "", //页面基础数据
      pageSelect: "",
      roomDescription: '1', // 客房描述
      suiteType: '2', // 套房类型
      roomNum: '3', // 房间数量
      roomPrice: '4', // 价格
      roomType: '5', // 房型描述
      roomDevice: '6', // 设施设备
      houseinfoData: [],
      tableData: []
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, type) {
      this.getDataRequest(id, type);
      this.carDetailShow = true;
      this.pageSelect = "basic";
    },
    getDataRequest(id, type) {
      let params = {
        detailId: id,
        type: type
      };
      this.$axiosPost(API.receptionFacade_findByDetailInfoId, params).then(res => {
        this.datas = res.model.detail;
      })
    }
  }
};
</script>

<style lang="scss">
</style>

