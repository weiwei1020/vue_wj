/**
 * 标准查询管理模块
 */
//实验管理
import LmsTestProject from "./modules/lims/lms-test-project";
import LmsTestManage from "./modules/lims/lms-test-manage";
import LmsTestSchedule from "./modules/lims/lms-test-schedule";
//仪器管理
import LmsEquipClass from "./modules/lims/lms-equip-class";
import LmsEquipInfo from "./modules/lims/lms-equip-info";
import LmsEquipOrder from "./modules/lims/lms-equip-order";
import LmsEquipSchedule from './modules/lims/lms-equip-schedule';
import LmsEquipUseRecord from "./modules/lims/lms-equip-use-record";
//耗材管理
import LmsChemicalCategory from "./modules/lims/lms-chemical-category";
import LmsChemicalManage from "./modules/lims/lms-chemical";
import LmsChemicalPurchase from "./modules/lims/lms-chemical-purchase";
import LmsChemicalUse from "./modules/lims/lms-chemical-apply";
import LmsChemicalReturn from "./modules/lims/lms-chemical-return"
//人员
import PersonnelManage from "./modules/lims/personnel-manage.js"

export default {
  //实验
  LmsTestProject,
  LmsTestManage,
  LmsTestSchedule,
  //仪器管理
  LmsEquipClass,
  LmsEquipInfo,
  LmsEquipOrder,
  LmsEquipSchedule,
  LmsEquipUseRecord,
  //耗材管理
  LmsChemicalCategory,
  LmsChemicalManage,
  LmsChemicalPurchase,//采购
  LmsChemicalUse,//使用
  LmsChemicalReturn,//归还
  //人员
  PersonnelManage,
}
