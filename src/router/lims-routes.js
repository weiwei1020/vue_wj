/**
 * 标准查询服务路由
 */
import helloWorld from '../components/HelloWorld.vue' //标准查询
//实验管理
import LmsTestPlan from "../pages/test-manage/lms-test-plan/LmsTestProject.vue"//实验计划
import LmsTestManage from "../pages/test-manage/lms-test-manage/LmsTestManage.vue"//实验管理
import LmsTestSchedule from "../pages/test-manage/lms-test-schedule/LmsTestSchedule.vue"//实验安排
//仪器管理
import LmsEquipClass from "../pages/equip/lms-equip-class/LmsEquipClass.vue"//仪器分类信息
import LmsEquipInfo from "../pages/equip/lms-equip-info/LmsEquipInfo.vue"//仪器资产信息
import LmsEquipOrderTab from "../pages/equip/lms-equip-order/LmsEquipOrderTab.vue"//仪器预约信息
import LmsEquipSchedule from "../pages/equip/lms-equip-schedule/LmsEquipSchedule.vue"//仪器排程查询
import LmsEquipAudit from "../pages/equip/lms-equip-audit/LmsEquipAudit.vue"//仪器预约审批
// 耗材管理
import LmsChemicalCategory from '../pages/chemical/lms-chemical-category/LmsChemicalCategory.vue'//耗材分类管理
import LmsChemicalManage from '../pages/chemical/lms-chemicals-manage/LmsChemicalManage.vue'//耗材台账管理
import LmsChemicalPurchase from '../pages/chemical/lms-chemical-purchase/LmsChemicalPurchase.vue'//耗材采购申请
import LmsChemicalPurchaseOrder from '../pages/chemical/lms-chemical-purchase-audit/LmsChemicalPurchaseOrder.vue'//耗材采购审批
import LmsChemicalApply from '../pages/chemical/lms-chemical-apply/LmsChemicalApply.vue'//耗材领用申请
import LmsChemicalUse from '../pages/chemical/lms-chemical-use/LmsChemicalUse.vue'//耗材领用审批
import LmsChemicalUseHistory from '../pages/chemical/lms-chemical-use-history/LmsChemicalUseHistory.vue'//耗材使用记录
import LmsChemicalUseQuery from '../pages/chemical/lms-chemical-use-query/LmsChemicalUseQuery.vue'//耗材使用查询
import LmsChemicalReturn from '../pages/chemical/lms-chemical-return/LmsChemicalReturn.vue'//耗材归还管理
import LmsChemicalStatistic from '../pages/chemical/lms-chemical-statistic/LmsChemicalStatistic.vue'//耗材采购统计功能
import LmsRoleChemicalCategory from '../pages/chemical/lms-role-chemical-category/LmsRoleChemicalCategory.vue'//耗材金额统计
//个人信息
import personnelManage from '../pages/personnel-manage/personnelManage'
import changePassword from '../pages/personal-center/change-password/passwordEdit.vue'
import userInfo from '../pages/personal-center/user-info/userInfo.vue'

export default [
  {path:'hello_world',component:helloWorld},
  //实验管理
  {path: 'staff_level', component: LmsTestPlan},
  {path: 'staff_manage', component: LmsTestManage},
  {path: 'staff_schedule', component: LmsTestSchedule},
  //仪器管理
  {path: 'equip_class', component: LmsEquipClass},
  {path: 'equip_info', component: LmsEquipInfo},
  {path: 'equip_order', component: LmsEquipOrderTab},
  {path: 'equip_schedule', component: LmsEquipSchedule},
  {path: 'equip_audit', component: LmsEquipAudit},
  // 耗材管理
  {path: 'chemical_category', component: LmsChemicalCategory},//耗材类别管理
  {path: 'chemical_manage', component: LmsChemicalManage},//耗材台账管理
  {path: 'chemical_purchase', component: LmsChemicalPurchase},//耗材采购申请
  {path: 'chemical_purchase_order', component: LmsChemicalPurchaseOrder},//耗材采购单审批
  {path:'chemical_apply',component:LmsChemicalApply},//耗材领用申请
  {path:'chemical_use',component:LmsChemicalUse},//耗材领用审批
  {path:'chemical_ues_history',component:LmsChemicalUseHistory},//耗材使用记录
  {path:'chemical_use_query',component:LmsChemicalUseQuery},//耗材使用查询
  {path:'chemical_return',component:LmsChemicalReturn},//耗材归还管理
  {path:'statistic',component:LmsChemicalStatistic},//耗材采购统计功能
  {path: 'role_chemical_category', component: LmsRoleChemicalCategory},//耗材金额统计
  {path:'personnel_manage',component:personnelManage},  //人员管理
  {path: 'change_password', component:changePassword},//修改密码
  {path: 'user_info', component:userInfo},//基本信息

  // {path: 'customer', component: LmsCustomer},
  // {path: 'supplier', component: LmsSupplier},
  // {path: 'supplier_type', component: LmsSupplierType},
  // {path: 'supplier_chemical', component: LmsSupplierChemical},
  // {path: 'chemical_manage', component: LmsCommonly},
  // {path: 'chemical_classify', component: LmsChemicalClassify},
  // {path: 'chemical_delivery_order', component: LmsChemicalDeliveryOrder},
  // {path: 'chemical_in_storage', component: LmsChemicalInStorage},
  // {path: 'chemical_out_storage', component: LmsChemicalOutStorage},
  // {path: 'chemical_out_storage_apply', component: LmsChemicalOutStorageApply},
  // {path: 'storehouse', component: LmsStorehouse},
  // {path: 'unit', component: LmsUnit},
  // {path: '', component: Labmis},
  // {path: 'chemical_category', component: LmsChemicalCategory},
  // {path: 'chemical_compound', component: LmsChemicalCompound},
  // {path: 'bacterial', component: LmsBacterial},
  // {path: 'customer', component: LmsCustomer},
  // {path:'lims_serveice_type',component:LmsServiceType},
  // {path: 'effluent', component: LmsEffluent},
  // {path: 'supplier', component: LmsSupplier},
  // {path: 'supplier_type', component: LmsSupplierType},
  // {path: 'supplier_chemical', component: LmsSupplierChemical},
  // {path: 'commonly', component: LmsCommonly},
  // {path: 'chemical_manage', component: LmsCommonly},
  // {path: 'chemical_userecord', component: LmsChemicalUserecord},
  // {path: 'standard_titration', component: LmsStandardTitration},
  // {path: 'chemical_classify', component: LmsChemicalClassify},
  // {path: 'chemical_purchase', component: LmsChemicalPurchase},
  // {path: 'chemical_purchase_order', component: LmsChemicalPurchaseOrder},
  // {path: 'chemical_delivery_order', component: LmsChemicalDeliveryOrder},
  // {path: 'chemical_in_storage', component: LmsChemicalInStorage},
  // {path: 'chemical_out_storage', component: LmsChemicalOutStorage},
  // {path: 'chemical_out_storage_apply', component: LmsChemicalOutStorageApply},
  // {path: 'storehouse', component: LmsStorehouse},
  // {path: 'unit', component: LmsUnit},
  // {path: 'lims_product_query', component: LmsProductQuery},
  // {path: 'lms_product_manage', component: LmsProduct},
  // {path: 'product_class_manage', component: LmsProductClass},
  //
  // {path:'statistic',component:LmsChemicalStatistic},//耗材采购统计功能
  // {path:'chemical_apply',component:LmsChemicalApply},//耗材领用申请
  // {path:'chemical_use',component:LmsChemicalUse},//耗材领用审批
  // {path:'chemical_ues_history',component:LmsChemicalUseHistory},//耗材使用记录
  // {path:'chemical_use_query',component:LmsChemicalUseQuery},//耗材使用查询
  // {path:'chemical_return',component:LmsChemicalReturn},//耗材归还管理
  //
  // {path: 'staff_info', component: LmsStaffInfo},
  // {path: 'staff_status', component: LmsStaffStatus},
  // {path: 'staff_task', component: LmsStaffTask},
  // {path: 'staff_train_plan', component: LmsStaffTrainPlan},
  // {path: 'staff_train_record', component: LmsStaffTrainRecord},
  //
  // //环境管理
  // {path: 'env_normal_monitor', component: LmsEnvNormalMonitor},
  // {path: 'env_microbe_monitor', component: LmsEnvMicrobeMonitor},
  //
  // //报告管理
  //
  // {path: 'food_report_template', component: LmsReportTemplate},
  // {path: 'template_classify_manage', component: LmsTemplateClass},
  //
  // //车辆管理
  // {path: 'car_info', component: LmsCarInfo},
  //
  // //订单管理
  // {path:'order_manage',component:LmsOrderManage},
  // {path:'history_record',component:LmsHistoryRecord},
  // {path:'picking_list_manage',component:LmsPickingListManage},
  //
  //
  // //体系管理
  // {path: 'frame_check_manage', component: LmsFrameCheckManage},
  // {path: 'frame_check_plan', component: LmsFrameCheckPlan},
  // {path: 'frame_complaint_manage', component: LmsFrameComplaintManage},
  // {path: 'frame_complaint_register', component: LmsFrameComplaintRegister},
  // {path: 'frame_customer_investigate', component: LmsFrameCustomerInvestigate},
  // {path: 'frame_inner_check_manage', component: LmsFrameInnerCheckManage},
  // {path: 'frame_inner_check_plan', component: LmsFrameInnerCheckPlan},
  // {path: 'frame_unconform_register', component: LmsFrameUnconformRegister},
  // {path: 'uncertainty_judge_plan', component: LmsFrameUncertaintyPlan},
  // {path: 'uncertainty_judge_report', component: LmsFrameUncertaintyReport},
  // {path: 'inner_qc_plan', component: LmsQcMainPlan},
  // {path: 'inner_qc_record', component: LmsQcMainRecord},
  // {path: 'ability_validate_plan', component: LmsAbilityMainPlan},
  // {path: 'ability_validate_record', component: LmsAbilityMainRecord},
  // {path: 'frame_problem_approve', component: LmsFrameProblemApprove},
  // {path: 'frame_customer_investigate_item', component: LmsFrameCustomerInvestigateClass},
  // //字典管理
  // {path: 'base_dict', component: LmsBaseDict},
  //
  //
  //
  // //模块管理
  // {path: 'print_module', component: LmsPrintModule},
  //
  // //模板管理
  // {path: 'print_template', component: LmsPrintTemplate},
  //
  // //用户编组
  // {path: 'marshal_manage', component: LmsMarshalManage},
  //
  // //用户编组
  // {path: 'marshal_manage', component: LmsMarshalManage},
  //
  // //编号管理
  // //{path: 'code_rule', component: LmsCodeRule},
  // {path: 'codeRule', component: LmsCodeRule},



]
