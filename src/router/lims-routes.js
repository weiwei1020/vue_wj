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
import LmsChemicalUse from '../pages/chemical/lms-chemical-use/LmsChemicalUse.vue'//耗材领用申请
import LmsChemicalUseAudit from '../pages/chemical/lms-chemical-use-audit/LmsChemicalUseAudit.vue'//耗材领用审批
import LmsChemicalUseHistory from '../pages/chemical/lms-chemical-use-history/LmsChemicalUseHistory.vue'//耗材使用记录
import LmsChemicalReturn from '../pages/chemical/lms-chemical-return-audit/LmsChemicalReturn.vue'//耗材归还管理
import LmsChemicalStatistic from '../pages/chemical/lms-chemical-statistic/LmsChemicalStatistic.vue'//耗材采购统计功能
import LmsChemicalAmountOfMoney from '../pages/chemical/lms-chemical-amount-of-money/LmsChemicalAmountOfMoney.vue'//耗材金额统计
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
  {path:'chemical_use',component:LmsChemicalUse},//耗材领用申请
  {path:'chemical_use_audit',component:LmsChemicalUseAudit},//耗材领用审批
  {path:'chemical_ues_history',component:LmsChemicalUseHistory},//耗材使用记录
  {path:'chemical_return',component:LmsChemicalReturn},//耗材归还管理
  {path:'statistic',component:LmsChemicalStatistic},//耗材采购统计功能
  {path: 'chemical-amount-of-money', component: LmsChemicalAmountOfMoney},//耗材金额统计
  {path:'personnel_manage',component:personnelManage},  //人员管理
  {path: 'change_password', component:changePassword},//修改密码
  {path: 'user_info', component:userInfo},//基本信息
]
