<template>
  <div>
    <section class="m-main">
      <!--导航-->
      <div class="m-breadcrumb">
        <zl-breadcrumb title="title"></zl-breadcrumb>
      </div>
      <div class="h-table-title">
        <h2>{{申请}}</h2>
        <p class="f-color-red">（*为必填项，请检查后提交！）</p>
      </div>
      <div class="h-tab-content">
        <el-form>
          <table class="h-table-info">
            <tr>
              <th>
                <i class="f-color-red">*</i>院落名称</th>
              <td></td>
            <tr>
              <th>
                <i class="f-color-red">*</i>院落地址</th>
              <td> </td>
            </tr>
            <tr>
              <th>院落航拍图</th>
              <td></td>
            </tr>
          </table>
          <div class="table-bottom-btns f-hidden">
            <el-button class="u-submit-btn cancel-btn">取消</el-button>
            <el-button class="u-submit-btn submit-btn">保存</el-button>
          </div>
        </el-form>
      </div>
    </section>
  </div>
</template>