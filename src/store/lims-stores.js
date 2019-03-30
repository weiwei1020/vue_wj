/**
 * 标准查询管理模块
 */
//实验管理
import LmsTestPlan from "./modules/lims/lms-test-plan";
import LmsTestManage from "./modules/lims/lms-test-manage";
import LmsTestSchedule from "./modules/lims/lms-test-schedule";

export default {
  LmsTestPlan,
  LmsTestManage,
  LmsTestSchedule,
}

/*import LmsChemical from "./modules/lims/lms-chemical";
import LmsChemicalApply from "./modules/lims/lms-chemical-apply";
import LmsChemicalUse from "./modules/lims/lms-chemical-use";
import LmsChemicalUseHistory from "./modules/lims/lms-chemical-use-history";
import LmsChemicalUseQuery from "./modules/lims/lms-chemical-use-query";
import LmsChemicalReturn from "./modules/lims/lms-chemical-return";
import LmsChemicalCategory from "./modules/lims/lms-chemical-category";
import LmsBacterial from "./modules/lims/lms-bacterial";
import LmsCustomerContact from "./modules/lims/lms-customer-contact";
import LmsCustomer from "./modules/lims/lms-customer";
import LmsEffluent from "./modules/lims/lms-effluent";
import LmsSupplier from "./modules/lims/lms-supplier";
import LmsSupplierType from "./modules/lims/lms-supplier-type";
import LmsCompound from "./modules/lims/lms-chemical-compound";
import LmsChemicalStock from "./modules/lims/lms-chemical-stock";
import LmsChemicalUserecord from "./modules/lims/lms-chemical-userecord";
import LmsStandardTitration from "./modules/lims/lms-standard-titration";
import LmsCustomerAttachment from './modules/lims/lms-customer-attachment'

import LmsChemicalClassify from "./modules/lims/lms-chemical-classify";
import LmsChemicalPurchase from "./modules/lims/lms-chemical-purchase";
import LmsChemicalPurchaseOrder from "./modules/lims/lms-chemical-purchase-order";
import LmsChemicalDeliveryOrder from "./modules/lims/lms-chemical-delivery-order";
import LmsChemicalRelDelivery from "./modules/lims/lms-chemical-rel-delivery";
import LmsStorehouse from "./modules/lims/lms-storehouse";
import LmsUnit from "./modules/lims/lms-unit";
import LmsCustomerRecord from './modules/lims/env-customer-record'
import LmsMonitorRecord from './modules/lims/env-monitor-record'
import LmsSupAttachment from './modules/lims/env-supplier-attachment'
import LmsProductManage from './modules/lims/lms-product-manage'
import LmsProducyClass from './modules/lims/lms-product-class'

import LmsTestInfo from "./modules/lims/lms-test-info";
import LmsTestEquip from "./modules/lims/lms-test-equip";
import LmsTestItem from "./modules/lims/lms-test-item";
import LmsTestProfessional from "./modules/lims/lms-test-professional";
import LmsTestStatus from "./modules/lims/lms-test-status";
import LmsTestTask from "./modules/lims/lms-test-task";
import LmsTestTrainPlan from "./modules/lims/lms-test-train-plan";
import LmsTestTrainRecord from "./modules/lims/lms-test-train-record";
import LmsTestCertificate from './modules/lims/lms-test-certificate'
import LmsTestTrainRecordAttachment from './modules/lims/lms-test-train-record-attachment'
import LmsTestTrainRecordPeople from './modules/lims/lms-test-train-record-people'

//环境监测管理
import LmsEnvNormalMonitor from "./modules/lims/lms-env-normal-monitor";
import LmsEnvMicrobeMonitor from "./modules/lims/lms-env-microbe-monitor";

//仪器管理
import LmsEquipCheck from "./modules/lims/lms-equip-check";
import LmsEquipCheckManage from "./modules/lims/lms-equip-check-manage";
import LmsEquipClassRole from "./modules/lims/lms-equip-class-role";
import LmsEquipClass from "./modules/lims/lms-equip-class";
import LmsEquipInfo from "./modules/lims/lms-equip-info";
import LmsEquipMaintain from "./modules/lims/lms-equip-maintain";
import LmsEquipMaintainDetail from "./modules/lims/lms-equip-maintain-detail";
import LmsEquipMaintainManage from "./modules/lims/lms-equip-maintain-manage";
import LmsEquipOrder from "./modules/lims/lms-equip-order";
import LmsEquipProduct from "./modules/lims/lms-equip-product";
import LmsEquipPurchase from "./modules/lims/lms-equip-purchase";
import LmsEquipPurchaseDetail from "./modules/lims/lms-equip-purchase-detail";
import LmsEquipRepair from "./modules/lims/lms-equip-repair";
import LmsEquipRepairDetail from "./modules/lims/lms-equip-repair-detail";
import LmsEquipRepairManage from "./modules/lims/lms-equip-repair-manage";
import LmsEquipSchedule from './modules/lims/lms-equip-schedule';
import LmsEquipScrap from "./modules/lims/lms-equip-scrap";
import LmsEquipScrapDetail from "./modules/lims/lms-equip-scrap-detail";
import LmsEquipScrapManage from "./modules/lims/lms-equip-scrap-manage";
import LmsEquipUseRecord from "./modules/lims/lms-equip-use-record";
import LmsEquipVerify from "./modules/lims/lms-equip-verify";
import LmsEquipLocation from "./modules/lims/lms-equip-location";
import LmsEquipReturnManage from './modules/lims/lms-equip-return-manage';

//订单管理
import LmsOrderManage from './modules/lims/lms-order-manage'

//体系管理
import LmsFrameCheckPlan from "./modules/lims/lms-frame-check-plan";
import LmsFrameCheckManage from "./modules/lims/lms-frame-check-manage";
import LmsFrameInnerCheckPlan from "./modules/lims/lms-frame-inner-check-plan";
import LmsFrameInnerCheckManage from "./modules/lims/lms-frame-inner-check-manage";
import LmsFrameComplaintManage from "./modules/lims/lms-frame-complaint-manage";
import LmsFrameComplaintRegister from "./modules/lims/lms-frame-complaint-register";
import LmsFrameCustomerInvestigate from "./modules/lims/lms-frame-customer-investigate";
import LmsFrameCustomerInvestigateDetail from "./modules/lims/lms-frame-customer-investigate-detail";
import LmsFrameUnconformRegister from "./modules/lims/lms-frame-unconform-register";
import LmsYearPlan from "./modules/lims/lms-year-plan";
import LmsMonthPlan from './modules/lims/lms-month-plan';
import LmsQcMainPlan from './modules/lims/lms-qc-main-plan'
import LmsQcSubPlan from './modules/lims/lms-qc-sub-plan'
import LmsQcSubPlanAttachment from './modules/lims/lms-qc-sub-plan-attachment'
import LmsAbilityMainPlan from './modules/lims/lms-ability-main-plan'
import LmsAbilitySubPlan from './modules/lims/lms-ability-sub-plan'
import LmsAbilitySubPlanAttachment from './modules/lims/lms-ability-sub-plan-attachment'
import LmsAbilityMainPlanRecord from './modules/lims/lms-ability-main-plan-record'
import LmsAbilitySubPlanRecord from './modules/lims/lms-ability-sub-plan-record'
import LmsQcMainPlanRecord from './modules/lims/lms-qc-main-plan-record'
import LmsQcSubPlanRecord from './modules/lims/lms-qc-sub-plan-record'
import LmsFrameProblemApprove from './modules/lims/lms-frame-problem-approve'
import LmsFrameCustomerInvestigateClass from './modules/lims/lms-frame-customer-investigate-class'
//字典管理
import LmsBaseDict from "./modules/lims/lms-base-dict";

//模块管理
import LmsPrintModule from "./modules/lims/lms-print-module";

//模板管理
import LmsPrintTemplate from "./modules/lims/lms-print-template";

//用户编组
import LmsMarshalManage from "./modules/lims/lms-marshal-manage";

//车辆管理
import LmsCarInfo from './modules/lims/lms-car-info';


//编号管理
import LmsCodeRule from './modules/lims/code-rule/lms-code-rule';

//服务类型管理
import LmsServiceType from './modules/lims/lms-service-type';

//组件管理
import LmsComponentFlow from './modules/lims/base/lms-component-flow';


export default {
  // Alias name : Module value
  LmsChemical,
  LmsChemicalApply,
  LmsChemicalUse,
  LmsChemicalUseHistory,
  LmsChemicalUseQuery,
  LmsChemicalReturn,
  LmsChemicalCategory,
  LmsBacterial,
  LmsCustomerContact,
  LmsCustomer,
  LmsEffluent,
  LmsSupplier,
  LmsSupplierType,
  LmsCompound,
  LmsChemicalStock,
  LmsChemicalUserecord,
  LmsStandardTitration,
  LmsChemicalClassify,
  LmsChemicalPurchase,
  LmsChemicalPurchaseOrder,
  LmsChemicalDeliveryOrder,
  LmsChemicalRelDelivery,
  LmsStorehouse,
  LmsUnit,
  LmsCustomerAttachment,
  LmsCustomerRecord,
  LmsMonitorRecord,
  LmsSupAttachment,
  LmsProductManage,
  LmsProducyClass,

  //实验管理

  LmsTestInfo,
  LmsTestEquip,
  LmsTestItem,
  LmsTestProfessional,
  LmsTestSchedule,
  LmsTestStatus,
  LmsTestTask,
  LmsTestTrainPlan,
  LmsTestTrainRecord,
  LmsTestCertificate,
  LmsTestTrainRecordAttachment,
  LmsTestTrainRecordPeople,

  //用户编组
  LmsMarshalManage,

  //环境管理
  LmsEnvNormalMonitor,
  LmsEnvMicrobeMonitor,



  //仪器管理
  LmsEquipCheck,
  LmsEquipCheckManage,
  LmsEquipClassRole,
  LmsEquipClass,
  LmsEquipInfo,
  LmsEquipMaintain,
  LmsEquipMaintainDetail,
  LmsEquipMaintainManage,
  LmsEquipOrder,
  LmsEquipProduct,
  LmsEquipPurchase,
  LmsEquipPurchaseDetail,
  LmsEquipRepair,
  LmsEquipRepairDetail,
  LmsEquipRepairManage,
  LmsEquipSchedule,
  LmsEquipScrap,
  LmsEquipScrapDetail,
  LmsEquipScrapManage,
  LmsEquipUseRecord,
  LmsEquipVerify,
  LmsEquipLocation,
  LmsEquipReturnManage,

  //订单管理
  LmsOrderManage,

  //体系管理
  LmsFrameCheckPlan,
  LmsFrameCheckManage,
  LmsFrameInnerCheckPlan,
  LmsFrameInnerCheckManage,
  LmsFrameComplaintManage,
  LmsFrameComplaintRegister,
  LmsFrameCustomerInvestigate,
  LmsFrameCustomerInvestigateDetail,
  LmsFrameUnconformRegister,
  LmsYearPlan,
  LmsMonthPlan,
  LmsQcMainPlan,
  LmsQcSubPlan,
  LmsQcSubPlanAttachment,
  LmsAbilityMainPlan,
  LmsAbilitySubPlan,
  LmsAbilitySubPlanAttachment,
  LmsAbilityMainPlanRecord,
  LmsAbilitySubPlanRecord,
  LmsQcMainPlanRecord,
  LmsQcSubPlanRecord,
  LmsFrameProblemApprove,
  LmsFrameCustomerInvestigateClass,
  //字典管理
  LmsBaseDict,

  //组件管理
  LmsComponentFlow,

  //模块管理
  LmsPrintModule,

  //模板管理
  LmsPrintTemplate,






  //车辆管理
  LmsCarInfo,


  //编号管理
  LmsCodeRule,

  LmsServiceType,
}*/
