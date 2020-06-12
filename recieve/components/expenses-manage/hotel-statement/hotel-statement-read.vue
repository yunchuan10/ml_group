<template>
  <div>

      
    <section class="section-content">
      <div class="h-table-title">
        <h2>结算单</h2>
      </div>

      <!-- 写入模块 -->
      <div class="statement-form">

        <div class="h-tab-content" style="padding-bottom: 20px;">
          
          <el-form ref="accommodfo" :model="formData">

            <!-- 住宿费 -->
            <div class="u-left-border-title">
              <h2>住宿费</h2>
            </div>

            <el-table :data="formData.accommodationSettlements" stripe style="width: 100%">
              <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
              <el-table-column prop="subPlanNo" label="子订单号"></el-table-column>

              <el-table-column prop="roomType" label="房间类型">
                <template slot-scope="scope">
                  <el-form-item >
                    <div class="set-form-item">
                      {{scope.row.roomType}}
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="price" label="单价">
                <template slot-scope="scope">
                  <el-form-item >
                    <div class="set-form-item">
                      {{scope.row.price}} 元/天
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="validTime" label="住宿日期">
                <template slot-scope="scope">
                  {{getDate(scope.row.stayStartTime)}}
                  <span style="margin: 0 5px;">-</span>
                  {{getDate(scope.row.stayEndTime)}}
                </template>
              </el-table-column>

              <el-table-column prop="days" label="住宿天数">
                <template slot-scope="scope">
                  <el-form-item >
                    <div class="set-form-item">
                      {{scope.row.days}} 天
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="totalCost" label="总价">
                <template slot-scope="scope">
                  <el-form-item >
                    <div class="set-form-item">
                      {{scope.row.totalCost}}
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

            </el-table>


            <!-- 餐饮费 -->
            <div class="u-left-border-title">
              <h2>餐饮费</h2>
            </div>
            <el-table :data="formData.mealsSettlements" stripe style="width: 100%">
              <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
              <el-table-column prop="subPlanNo" label="子订单号" width="220"></el-table-column>

              <el-table-column prop="mealsType" label="用餐类型">
                <template slot-scope="scope">
                  <el-form-item >
                    <div class="set-form-item">
                      {{scope.row.mealsType}}
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="time" label="费用发生日期">
                <template slot-scope="scope">
                  <el-form-item>
                    {{getDate(scope.row.time)}}
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="totalCost" label="自结">
                <template slot-scope="scope">
                  <el-form-item>
                    <div class="set-form-item">
                      {{scope.row.totalCost}} 元
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
              
            </el-table>


            <!-- 会场费 -->
            <div class="u-left-border-title">
              <h2>会场费</h2>
            </div>
            <el-table :data="formData.meetingSettlements" stripe style="width: 100%">
              <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
              <el-table-column prop="subPlanNo" label="子订单号" width="220"></el-table-column>

              <el-table-column prop="meetingRoom" label="会议室">
                <template slot-scope="scope">
                  <el-form-item>
                    <div class="set-form-item">
                      {{scope.row.meetingRoom}}
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="usedTime" label="使用时长">
                <template slot-scope="scope">
                  <el-form-item>
                    <div class="set-form-item">
                      {{scope.row.usedTime}} 小时
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="time" label="费用发生日期">
                <template slot-scope="scope">
                  <el-form-item>
                    {{getDate(scope.row.time)}}
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="totalCost" label="总价">
                <template slot-scope="scope">
                  <el-form-item>
                    <div class="set-form-item">
                      {{scope.row.totalCost}} 元
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>
            </el-table>


            <!-- 其他费用 -->
            <div class="u-left-border-title">
              <h2>其他费用</h2>
            </div>

            <el-table :data="formData.otherSettlements" stripe style="width: 100%">
              <el-table-column prop="index" label="序号" width="50" type="index"></el-table-column>|
              <el-table-column prop="subPlanNo" label="子订单号" width="220"></el-table-column>

              <el-table-column prop="remark" label="费用说明">
                <template slot-scope="scope">
                  <el-form-item>
                    <div class="set-form-item">
                      {{scope.row.remark}}
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="time" label="费用发生日期">
                <template slot-scope="scope">
                  <el-form-item>
                    {{getDate(scope.row.time)}}
                  </el-form-item>
                </template>
              </el-table-column>

              <el-table-column prop="totalCost" label="总价">
                <template slot-scope="scope">
                  <el-form-item>
                    <div class="set-form-item">
                      {{scope.row.totalCost}} 元
                    </div>
                  </el-form-item>
                </template>
              </el-table-column>

            </el-table>

            <div class="form-cont">
              <div>
                合计： {{totalCost}} 元
              </div>

              <div style="display: flex;align-items: center;">
                <p>折扣率：</p>
                {{totalDiscount}} 
                <span> %</span>
              </div>

              <div>
                折后价： {{discountTotalCost}} 元
              </div>
            </div>

          </el-form>

        </div>
      </div>

    </section>

  </div>

</template>

<script>


export default {
  props: [ 'formData', 'totalCost', 'discountTotalCost', 'totalDiscount' ],
  data() {

    return {
      
    };
  },
  activated() {
    console.log(this.discountTotalCost, 3333);
    
  },
  deactivated(){
    this.$destroy();
  },
  computed: {
    
  },
  methods: {
    getDate(d=''){
      return this.$formatDate(d, 'yyyy-MM-dd');
    }
    
  }
};
</script>

<style lang="scss" scoped>

  .visibility-hidden{
    visibility: hidden;
  }

  .form-cont{
    border: 1px solid #EBEEF5;
    border-top: none;
    display: flex;
    align-items: center;
    padding: 10px 0;
    padding-right: 5px;
    justify-content: flex-end;
    &>div{
      margin-left: 20px;
    }
  }


  .set-form-item{
    .el-input{
      max-width: 200px;
    }
  }

  .statement-form{
    .el-table{
      border: 1px solid #EBEEF5;
      border-bottom: none;
    }
    .el-form-item{
      margin-bottom: 0;
      &.is-error{
        margin-bottom: 20px;
      }
    }
  }

  .statement-form{
    .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 160px;
    }
    .u-left-border-title{
      margin-top: 30px;
      justify-content: space-between;
    }
  }

  .u-bread-btn{
    margin-bottom: 10px;
  }

  
  
  

</style>


<style lang="scss">
  .h-dialog-add{
    .el-form-item__label{
      width: 120px !important;
    }
    .el-form-item__content{
      margin-left: 120px !important;
    }
  }
</style>





