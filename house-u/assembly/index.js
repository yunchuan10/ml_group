import YBreadcrumbVue from './YBreadcrumb.vue'
import YTipsVue from './YTips.vue'
import YPromptVue from './YPrompt.vue'
import YConfirmVue from './YConfirm.vue'
import vueClientImport from './clientImport.vue'
import vueCustomDeptlist from './vue-custom-deptlist.vue'
import vueListSearchPopover from './vue-listSearch-popover.vue'
import tooltipMessage from './tooltip-message.vue'

// 这里是重点
const assemblyComponents = {
  install(Vue) {
    Vue.component('Y-Breadcrumb', Vue.extend(YBreadcrumbVue)); // 面包屑
    Vue.component('Y-Tips', Vue.extend(YTipsVue)); // 信息提示框
    Vue.component('Y-Prompt', Vue.extend(YPromptVue)); // 操作提示框
    Vue.component('Y-Confirm', Vue.extend(YConfirmVue)); // 删除提示框
    Vue.component('v-clientImport', Vue.extend(vueClientImport)); // 自定义导入控件
    Vue.component('v-deptList', Vue.extend(vueCustomDeptlist)); // 自定义部门控件
    Vue.component('v-searchPopover', Vue.extend(vueListSearchPopover)); // 自定义部门控件
    Vue.component('v-tooltipMessage', Vue.extend(tooltipMessage)); // 自定义部门控件
  }
}

// 导出组件
export default assemblyComponents