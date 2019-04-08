/**
 * 标准查询服务路由
 */
import helloWorld from '../components/HelloWorld.vue' //标准查询
//实验管理
import LmsTestPlan from "../pages/test-manage/lms-test-plan/LmsTestPlan.vue"//实验计划
import LmsTestManage from "../pages/test-manage/lms-test-manage/LmsTestManage.vue"//实验管理
import LmsTestSchedule from "../pages/test-manage/lms-test-schedule/LmsTestSchedule.vue"//实验安排
//仪器管理
import LmsEquipClass from "../pages/equip/lms-equip-class/LmsEquipClass.vue"//仪器分类信息
import LmsEquipInfo from "../pages/equip/lms-equip-info/LmsEquipInfo.vue"//仪器资产信息
import LmsEquipOrderTab from "../pages/equip/lms-equip-order/LmsEquipOrderTab.vue"//仪器预约信息
import LmsEquipOrderQuery from "../pages/equip/lms-equip-order-query/LmsEquipOrderQuery.vue"//仪器预约查询
import LmsEquipSchedule from "../pages/equip/lms-equip-schedule/LmsEquipSchedule.vue"//仪器排程查询
import LmsEquipProduct from "../pages/equip/lms-equip-product/LmsEquipProduct.vue"//仪器产品信息
import LmsEquipPurchase from "../pages/equip/lms-equip-purchase/LmsEquipPurchase.vue"//仪器采购订单
import LmsEquipAudit from "../pages/equip/lms-equip-audit/LmsEquipAudit.vue"//仪器预约审批
import LmsEquipReturn from '../pages/equip/lms-equip-return-manage/LmsEquipReturnManage'; // 仪器归还管理
// 耗材管理
import LmsChemicalCategory from '../pages/chemical/lms-chemical-category/LmsChemicalCategory.vue'//耗材分类管理
import LmsChemicalManage from '../pages/chemical/lms-chemicals-manage/LmsChemicalManage.vue'//耗材台账管理
import LmsChemicalPurchase from '../pages/chemical/lms-chemical-purchase/LmsChemicalPurchase.vue'//耗材采购申请
import LmsChemicalPurchaseOrder from '../pages/chemical/lms-chemical-purchase-order/LmsChemicalPurchaseOrder.vue'//耗材采购审批
import LmsChemicalApply from '../pages/chemical/lms-chemical-apply/LmsChemicalApply.vue'//耗材领用申请
import LmsChemicalUse from '../pages/chemical/lms-chemical-use/LmsChemicalUse.vue'//耗材领用审批
import LmsChemicalUseHistory from '../pages/chemical/lms-chemical-use-history/LmsChemicalUseHistory.vue'//耗材使用记录
import LmsChemicalUseQuery from '../pages/chemical/lms-chemical-use-query/LmsChemicalUseQuery.vue'//耗材使用查询
import LmsChemicalReturn from '../pages/chemical/lms-chemical-return/LmsChemicalReturn.vue'//耗材归还管理
import LmsChemicalStatistic from '../pages/chemical/lms-chemical-statistic/LmsChemicalStatistic.vue'//耗材采购统计功能
import LmsRoleChemicalCategory from '../pages/chemical/lms-role-chemical-category/LmsRoleChemicalCategory.vue'//耗材金额统计
// import LmsCustomer from '../pages/chemical/lms-customer/LmsCustomer.vue'// 客户管理
// import LmsSupplier from '../pages/chemical/lms-supplier/LmsSupplier.vue'// 供应商管理
// import LmsSupplierType from '../pages/chemical/lms-supplier-type/LmsSupplierType.vue'// 供应商分类管理
// import LmsSupplierChemical from '../pages/chemical/lms-supplier-chemical/LmsSupplierChemical.vue'// 供应商耗材管理
// import LmsChemicalUserecord from '../pages/chemical/lms-chemical-userecord/LmsChemicalUserecord.vue'// 耗材库存流水
// import LmsChemicalClassify from '../pages/chemical/lms-chemical-classify/LmsChemicalClassify.vue'//耗材库存归类管理
// import LmsChemicalDeliveryOrder from '../pages/chemical/lms-chemical-delivery-order/LmsChemicalDeliveryOrder.vue'//耗材出库单管理
// import LmsChemicalInStorage from '../pages/chemical/lms-chemical-instorage/LmsChemicalInStorage.vue'//耗材入库管理
// import LmsChemicalOutStorage from '../pages/chemical/lms-chemical-outstorage/LmsChemicalOutStorage.vue'//耗材出库管理
// import LmsChemicalOutStorageApply from '../pages/chemical/lms-chemical-outstorage-apply/LmsChemicalOutStorageApply.vue'//耗材出库管理
// import LmsStorehouse from '../pages/chemical/lms-storehouse/LmsStorehouse.vue'//仓库管理
// import LmsUnit from '../pages/chemical/lms-unit/LmsUnit.vue'// 单位管理
//标准管理
//import Labmis from '../pages/lims/Labmis.vue' //标准查询kkkkkkkkk
// 耗材管理
// import LmsChemicalCategory from '../pages/lims/chemical/lms-chemical-category/LmsChemicalCategory.vue'//耗材分类管理
// import LmsRoleChemicalCategory from '../pages/lims/chemical/lms-role-chemical-category/LmsRoleChemicalCategory.vue'//角色耗材分类管理
// import LmsChemicalCompound from '../pages/lims/chemical/lms-chemical-compound/LmsChemicalCompound.vue'//耗材试剂原始值记录
// import LmsBacterial from '../pages/lims/chemical/lms-bacterial/LmsBacterial.vue'// 菌种管理
// import LmsCustomer from '../pages/lims/chemical/lms-customer/LmsCustomer.vue'// 客户管理
// import LmsEffluent from '../pages/lims/chemical/lms-effluent/LmsEffluent.vue'// 废液管理
// import LmsSupplier from '../pages/lims/chemical/lms-supplier/LmsSupplier.vue'// 供应商管理
// import LmsServiceType from '../pages/lims/chemical/lms-service-type/LmsServiceType.vue'//服务类型管理
// import LmsSupplierType from '../pages/lims/chemical/lms-supplier-type/LmsSupplierType.vue'// 供应商分类管理
// import LmsSupplierChemical from '../pages/lims/chemical/lms-supplier-chemical/LmsSupplierChemical.vue'// 供应商耗材管理
// import LmsCommonly from '../pages/lims/chemical/lms-chemicals-manage/LmsChemicalManage.vue'// 一般化学品管理 add by wwd 170901
// import LmsChemicalUserecord from '../pages/lims/chemical/lms-chemical-userecord/LmsChemicalUserecord.vue'// 耗材库存流水
// import LmsStandardTitration from '../pages/lims/chemical/lms-titration/LmsStandardTitration.vue'// 标准滴定液记录 add by wwd 170912
// import LmsChemicalClassify from '../pages/lims/chemical/lms-chemical-classify/LmsChemicalClassify.vue'//耗材库存归类管理
// import LmsChemicalPurchase from '../pages/lims/chemical/lms-chemical-purchase/LmsChemicalPurchase.vue'//耗材采购管理
// import LmsChemicalPurchaseOrder from '../pages/lims/chemical/lms-chemical-purchase-order/LmsChemicalPurchaseOrder.vue'//耗材采购单管理
// import LmsChemicalDeliveryOrder from '../pages/lims/chemical/lms-chemical-delivery-order/LmsChemicalDeliveryOrder.vue'//耗材出库单管理
// import LmsChemicalInStorage from '../pages/lims/chemical/lms-chemical-instorage/LmsChemicalInStorage.vue'//耗材入库管理
// import LmsChemicalOutStorage from '../pages/lims/chemical/lms-chemical-outstorage/LmsChemicalOutStorage.vue'//耗材出库管理
// import LmsChemicalOutStorageApply from '../pages/lims/chemical/lms-chemical-outstorage-apply/LmsChemicalOutStorageApply.vue'//耗材出库管理
// import LmsStorehouse from '../pages/lims/chemical/lms-storehouse/LmsStorehouse.vue'//仓库管理
// import LmsUnit from '../pages/lims/chemical/lms-unit/LmsUnit.vue'// 单位管理
// import LmsChemicalStatistic from '../pages/lims/chemical/lms-chemical-statistic/LmsChemicalStatistic.vue'//耗材采购统计功能
// import LmsChemicalApply from '../pages/lims/chemical/lms-chemical-apply/LmsChemicalApply.vue'
// import LmsChemicalUse from '../pages/lims/chemical/lms-chemical-use/LmsChemicalUse.vue'
// import LmsChemicalUseHistory from '../pages/lims/chemical/lms-chemical-use-history/LmsChemicalUseHistory.vue'
// import LmsChemicalUseQuery from '../pages/lims/chemical/lms-chemical-use-query/LmsChemicalUseQuery.vue'
// import LmsChemicalReturn from '../pages/lims/chemical/lms-chemical-return/LmsChemicalReturn.vue'
// import LmsStaffInfo from "../pages/lims/staff/lms-staff-info/LmsStaffInfo.vue"//人员信息
// import LmsStaffStatus from "../pages/lims/staff/lms-staff-status/LmsStaffStatus.vue"//人员状态
// import LmsStaffTask from "../pages/lims/staff/lms-staff-task/LmsStaffTask.vue"//人员任务
// import LmsStaffTrainPlan from "../pages/lims/staff/lms-staff-train-plan/LmsStaffTrainPlan.vue"//人员培训计划
// import LmsStaffTrainRecord from "../pages/lims/staff/lms-staff-train-record/LmsStaffTrainRecord.vue"//人员培训记录
// //用户编组
// import LmsMarshalManage from "../pages/lims/marshal/lms-marshal-manage/LmsMarshalManage" //用户编组
// //环境管理
// import LmsEnvNormalMonitor from "../pages/lims/env/lms-env-normal-monitor/LmsEnvNormalMonitor.vue"//环境监测管理
// import LmsEnvMicrobeMonitor from "../pages/lims/env/lms-env-microbe-monitor/LmsEnvMicrobeMonitor.vue"//环境监测管理
// //报告管理
// import LmsReportTemplate from '../pages/lims/base/lms-report-template/LmsReportTemplate.vue' //报告模板
// import LmsTemplateClass from '../pages/lims/base/lms-template-classify/LmsTemplateClassify.vue'
// //订单管理
// import LmsOrderManage from "../pages/lims/order-manage/LmsOrderManage.vue"
// import LmsHistoryRecord from "../pages/lims/order-manage/LmsHistoryRecord.vue"
// import LmsPickingListManage from "../pages/lims/order-manage/LmsPickingListManage.vue"
// //车辆管理
// import LmsCarInfo from '../pages/lims/car/lms-car-info/LmsCarInfo.vue'
// //体系管理
// import LmsFrameCheckManage from "../pages/lims/frame/lms-frame-check-manage/LmsFrameCheckManage.vue"
// import LmsFrameCheckPlan from "../pages/lims/frame/lms-frame-check-plan/LmsFrameCheckPlan.vue"
// import LmsFrameComplaintManage from "../pages/lims/frame/lms-frame-complaint-manage/LmsFrameComplaintManage.vue"
// import LmsFrameComplaintRegister from "../pages/lims/frame/lms-frame-complaint-register/LmsFrameComplaintRegister.vue"
// import LmsFrameCustomerInvestigate from "../pages/lims/frame/lms-frame-customer-investigate/LmsFrameCustomerInvestigate.vue"
// import LmsFrameInnerCheckManage from "../pages/lims/frame/lms-frame-inner-check-manage/LmsFrameInnerCheckManage.vue"
// import LmsFrameInnerCheckPlan from "../pages/lims/frame/lms-frame-inner-check-plan/LmsFrameInnerCheckPlan.vue"
// import LmsFrameUnconformRegister from "../pages/lims/frame/lms-frame-unconform-register/LmsFrameUnconformRegister.vue"
// import LmsFrameUncertaintyPlan from "../pages/lims/frame/lms-frame-uncertainty-plan/LmsFrameUncertaintyPlan.vue"
// import LmsFrameUncertaintyReport from "../pages/lims/frame/lms-frame-uncertainty-report/LmsFrameUncertaintyReport.vue"
// import LmsQcMainPlan from '../pages/lims/frame/lms-main-qc-plan/LmsQcMainPlan.vue'
// import LmsQcMainRecord from '../pages/lims/frame/lms-main-qc-record/LmsQcMainRecord.vue'
// import LmsAbilityMainPlan from '../pages/lims/frame/lms-main-ability-plan/LmsAbilityMainPlan.vue'
// import LmsAbilityMainRecord from '../pages/lims/frame/lms-main-ability-record/LmsAbilityMainRecord.vue'
// import LmsFrameProblemApprove from '../pages/lims/frame/lms-frame-problem-approve/LmsFrameProblemApprove.vue'
// import LmsFrameCustomerInvestigateClass from '../pages/lims/frame/lms-frame-customer-investigate-class/LmsFrameCustomerInvestigateClass.vue'
// //字典管理
// import LmsBaseDict from "../pages/lims/base/lms-base-dict/LmsBaseDict.vue"
// //模块管理
// import LmsPrintModule from "../pages/lims/print/lms-print-module/LmsPrintModule.vue"
// //模板管理
// import LmsPrintTemplate from "../pages/lims/print/lms-print-template/LmsPrintTemplate.vue"
// //统计查询
// //编号管理
// import LmsCodeRule from "../pages/lims/code-rule/lims-code-rule/LmsCodeRule.vue"
// //采样部任务
// //客商管理
// import LmsProductQuery from '../pages/lims/chemical/lms-product-query/LmsProductQuery.vue'
// import LmsProduct from '../pages/lims/chemical/lms-product/LmsProduct.vue'
// import LmsProductClass from '../pages/lims/chemical/lms-product-class/LmsProductClass.vue'

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
  {path: 'equip_order_query', component: LmsEquipOrderQuery},
  {path: 'equip_schedule', component: LmsEquipSchedule},
  {path: 'equip_product', component: LmsEquipProduct},
  {path: 'equip_purchase', component: LmsEquipPurchase},
  {path: 'equip_audit', component: LmsEquipAudit},
  {path: 'equip_return', component: LmsEquipReturn},
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
