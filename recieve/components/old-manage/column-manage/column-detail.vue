<template>
  <div>
    <el-dialog custom-class="m-detail-dialog m-car-detail" append-to-body :show-close="false" width="950px" :visible.sync="carDetailShow">
      <div class="u-detail-dialog-header" slot="title">
        <span>详情</span>
        <div class="f-detail-dialog-header-close" @click="carDetailShow = false">
          <i class="el-icon-close"></i>
        </div>
      </div>

      <div class="u-detail-dialog-content">
        <div class="detail-top-table h-tab-content">
          <!-- 视察点，山水风光 -->
          <table class="h-table-info" v-if="title == '视察点' || title == '山水风光'">
            <tr>
              <th class="f-text-right">地区</th>
              <td>{{datas.areaName}}</td>
              <th class="f-text-right">详细地址</th>
              <td>{{datas.detailedAddress}}</td>
            </tr>
            <tr>
              <th class="f-text-right">简介</th>
              <td colspan="3">{{datas.briefIntroduction}}</td>
            </tr>
            <tr v-if="title == '视察点'">
              <th class="f-text-right">VR全景</th>
              <td colspan="3">
                <a :href="datas.vrImg" target="_blank">{{datas.vrImg}}</a>
              </td>
            </tr>
            <tr v-if="title == '山水风光'">
              <th class="f-text-right">百度百科</th>
              <td colspan="3">
                <!-- <div v-for="(item, index) in datas.url" :key="index"> -->
                <div>
                  <a :href="datas.url" target="_blank">{{datas.url}}</a>
                </div>
                <!-- <a :href="datas.">{{datas.vrUrl}}</a> -->
              </td>
            </tr>
            <tr>
              <th class="f-text-right">区位图</th>
              <td colspan="3">
                <div>
                  <a :href="datas.areaUrl" target="_blank">{{datas.areaUrl}}</a>
                </div>
                <!-- <img
                  v-for="(item, index) in imgUrl"
                  :key="index"
                  v-show="item"
                  :src="item"
                  style="width:100px;height:100px;margin:5px;"
                > -->
                <!-- <img :src="$store.state.imgPath.comimg" style="width:100px;height:100px;margin:5px;" /> -->
              </td>
            </tr>
            <tr>
              <th class="f-text-right">相关图片</th>
              <td colspan="3">
                <viewer v-for="(item, index) in datas.attachImg" :key="index" class="f-inline-block">
                  <!-- <img :src="item" style="width:100px;height:100px;margin:5px;" /> -->
                  <img :src="item!=''&&item?item:$store.state.imgPath.picDefault" style="width:150px;height:100px;margin:5px;" />

                </viewer>
              </td>
            </tr>
          </table>
          <!-- 风味美食 -->
          <table class="h-table-info" v-if="title == '风味美食'">
            <tr>
              <th class="f-text-right">美食名称</th>
              <td colspan="3">{{foodData.columnFoodName}}</td>
            </tr>
            <tr>
              <th class="f-text-right">简介</th>
              <td colspan="3">{{foodData.briefIntroduction}}</td>
            </tr>
            <tr>
              <th class="f-text-right">原料</th>
              <td colspan="3">{{foodData.rawMateria}}</td>
            </tr>
            <tr>
              <th class="f-text-right">制作方法</th>
              <td colspan="3">{{foodData.foodMake}}</td>
            </tr>
            <tr>
              <th class="f-text-right">推荐餐厅</th>
              <td colspan="3">
                <div v-for="(item, index) in restaurantList" :key="index">
                  <a :href="item.restaurant" target="_blank">{{item.restaurant}}</a>
                </div>
              </td>
            </tr>
            <tr>
              <th class="f-text-right">相关图片</th>
              <td colspan="3">
                <viewer v-for="(item, index) in foodData.attachImg" :key="index" class="f-inline-block">
                  <img :src="item" style="width:150px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>
          </table>

          <table class="h-table-info" v-if="title !== '风味美食' && title !== '视察点' && title !== '山水风光'">
            <tr v-if="title == '自然地理'">
              <th class="f-text-right">城市名称</th>
              <td colspan="3">{{defaultData.geographyName}}</td>
            </tr>
            <tr v-if="title == '自然地理'">
              <th class="f-text-right">城市地理信息</th>
              <td colspan="3">{{defaultData.geographyDetail}}</td>
            </tr>
            <tr v-if="title == '自然地理'">
              <th class="f-text-right">相关图片</th>
              <td colspan="3">
                <viewer v-for="(item, index) in defaultData.geographyImg" :key="index" class="f-inline-block">
                  <img :src="item" style="width:150px;height:100px;margin:5px;" />
                </viewer>
              </td>
            </tr>

            <tr v-if="title !== '自然地理'">
              <th class="f-text-right">名称</th>
              <td colspan="3">{{defaultData.childColumnDetailName}}</td>
            </tr>
            <tr v-if="title !== '自然地理'">
              <th class="f-text-right">内容</th>
              <td colspan="3">{{defaultData.childColumnDetail}}</td>
            </tr>
            <tr v-if="title !== '自然地理'">
              <th class="f-text-right">相关图片</th>
              <td colspan="3">
                <img :src="defaultData.attachImg" style="width:150px;height:100px;margin:5px;" />
              </td>
            </tr>
          </table>
        </div>

      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      typeFlag: '',
      carDetailShow: false, // 弹出框开关
      datas: [], //页面基础数据
      foodData: [], // 风味美食
      defaultData: [],
      restaurantList: []
    };
  },
  activated() { },
  methods: {
    // 初始化弹出框
    openModal(id, type, title) {
      this.getDataRequest(id, type, title);
      this.carDetailShow = true;
      this.typeFlag = type;
      this.title = title;
    },
    // 获取详情信息
    getDataRequest(id, type, title) {
      if (title == '视察点') {
        let params = {
          detailId: id,
          type: 'POINT'
        };
        this.$axiosGet(API.resourceManageFacade_findByDetailInfoId, params).then(res => {
          if (res.result == 'success') {
            this.datas = res.model.detail;
          } else {
            this.datas = '';
          }
        })
      } else if (title == '山水风光' || title == '风味美食' || title == '自然地理') {
        let params = {
          flag: title,
          pId: id
        };
        this.$axiosGet(API.columnManageFacade_findById, params).then(res => {
          if (res.result == 'success') {
            if (title == '山水风光') {
              this.datas = res.model;
            } else if (title == '风味美食') {
              this.foodData = res.model;
              this.restaurantList = eval(res.model.foodRestaurant);
            } else {
              this.defaultData = res.model;
            }
          } else {
            this.datas = [];
            this.foodData = [];
            this.defaultData = [];
          }
        })
      } else {
        let params = {
          childColumnDetailId: id,
        };
        this.$axiosGet(API.columnManageFacade_findByChildColumnDetailId, params).then(res => {
          if (res.result == 'success') {
            this.defaultData = res.model;
          } else {
            this.defaultData = [];
          }
        })
      }
    },
  }
};
</script>

<style lang="scss" scoped>
</style>

