module.exports = {
  cont: 'Workbench contents',
  sys: {
    name: 'sysName'
  },
  label_width:'120',
  searchBtn:'search',
  operation:'operation',//操作
  operationLog:'Operation Log',//操作日志
  packageTab:'package',
  lab:'lab',
  requestCS:'Request Customer Service',//请求客服
  BtnList:{
    search:'SearchConditions',//条件搜索
    noSearch:'PackUpSearch',//收起搜索
  },
  Page:{
    total:'total',
    piece:'piece'
  },
  resultChange:{
    addSuccess:'Add success!',//添加成功
    editSuccess:'Edit success!',//编辑成功
    deleteSuccess:'Delete success!',//删除成功
    formError:'Form validation failed!',//表单验证失败
    warning:'Please select one or more data！',//请选择一条或多条数据
    delete:'Sure to delete this data?',//确定删除该记录
    receive:'Sure to receive',//确定接收
    Receive:'Sure to receive this data?',//确定接收该记录
    ReceiveSuccess:'Receive success!',//接收成功
    issue:'Sure to issue ',//确定发放
    Issue:'Sure to issue this data?',//确定发放该记录
    IssueSuccess:'Issue success!',//发放成功
    highLight:'Sure to highLight ',//确定高亮追踪
    highLightSuccess:'HighLight success!',//高亮追踪成功
    cancel:'Sure to cancel ',//确定取消
    highLightData:' item data highLight?',//条记录的高亮显示吗？
    cancelHighLight:'Cancel highLight success!',//取消高亮追踪成功
    data:' item data?',//条数据
    hint:'hint',//提示
  },
  searchCondition:{
    ReportNo:'ReportNo:',//报告编号
    ProductLine:'ProductLine:',//产品线
    ServiceLevel:'ServiceLevel:',//服务类型
    Process:'Process:',//委托流程
    receivedDate:'receivedDate:',//进样日期
    LabReceivedDate:'LabReceivedDate:',//实验室进样日期
    ReportDueDate:'ReportDueDate:',//应出日期
    LabReportDueDate:'LabReportDueDate:',//实验室应出报告日期
    submitterName:'submitterForName:',//客户名称
    submitterForName:'submitterForName:',//买家名称

    inputReportNo:'Please input ReportNo',//请输入报告编号
    inputProductLine:'Please select',//请选择
    inputServiceLevel:'Please select',//请选择
    inputProcess:'Please select',//请选择
    inputReceivedDate:'Please select receivedDate',//请选择进样日期
    inputLabReceivedDate:'Please select LabReceivedDate',//请选择实验室进样日期
    inputReportDueDate:'Please select ReportDueDate',//请选择应出报告日期
    inputLabReportDueDate:'Please select LabReportDueDate',//请选择实验室应出报告日期
    inputSubmitterName:'Please input submitterName',//请输入客户名称
    inputSubmitterForName:'Please input submitterForName',//请输入买家名称
  },
  input:{
    submitterEmail:'submitterEmail:',//客户邮箱
    inputSubmitterEmail:'Please input submitterEmail',
    inputSubmitterName:'Please input or select submitterName',
    inputSubmitterForName:'Please input or select submitterForName',
    styleNo:'styleNo',//款号
    inputStyleNo:'Please input styleNo',
    CustomerService:'CustomerService:',//客服名称
    inputCustomerService:'Please input or select CustomerService',//请输入或选择客服姓名
    ReasonForRequest:'ReasonForRequest:',//请求原因
    inputReasonForRequest:'Please select inputReasonForRequest',//请选择请求原因
    DetailedContent:'DetailedContent:',//详细内容
    inputDetailedContent:'Please input inputReasonForRequest',//请输入详细内容
  },
  /*实验室检测*/
  labSearch:{
    ReportNo:'报告编号:',
    ProductLine:'产品线:',
    ServiceLevel:'服务类型:',
    Process:'委托流程:',
    receivedDate:'进样日期:',
    LabReceivedDate:'实验室进样日期:',
    ReportDueDate:'应出报告日期:',
    LabReportDueDate:'实验室应出报告日期:',
    submitterName:'客户名称:',
    submitterForName:'买家名称:',

    inputReportNo:'请输入报告编号',
    inputProductLine:'请选择',
    inputServiceLevel:'请选择',
    inputProcess:'请选择',
    inputReceivedDate:'请选择进样日期',
    inputLabReceivedDate:'请选择实验室进样日期',
    inputReportDueDate:'请选择应出报告日期',
    inputLabReportDueDate:'请选择实验室应出报告日期',
    inputSubmitterName:'请输入客户名称',
    inputSubmitterForName:'请输入买家名称',
  },
  /*进样*/
  sampling:{
  },
  Contract:{
    btn: [
      {type: 'success', id: '', name: 'add'},
    ],
    pageColumns: [
      {title: 'ReportNo', key: 'sampleNo'},//报告编号
      {title: 'ProductLine', key: 'sampleType'},//产品线
      {title: 'ServiceLevel', key: 'serviceLevel'},//服务类型
      {title: 'submitterName', key: 'submitterName'},//客户名
      {title: 'submitterEmail', key: 'submitterEmail'},//客户邮箱
      {title: 'submitterForName', key: 'submitterForName'},//买家名称
      {title: 'receivedDate', key: 'receivedDate', date: true, width: 120},//进样日期
      {title: 'reportDueDate', key: 'reportDueDate', date: true, width: 210},//应出报告日期
    ],
    iconMsg: [
      {type: 'compose', id: '', name: 'edit'}
    ],
  },
  ContractEdit:{
    addContract:'addContract',//添加委托信息
    editContract:'editContract',//编辑委托信息
    get:'get',//获取
    labelWidth:'130',
    copyHisContract:'copyHisContract',
    copyOnlineContract:'copyOnlineContract',
    sampleNo:'ReportNo or onlineContractNo',
    footerList: [
      {id: '', name: 'cancel', type: ''},
      {id: '', name: 'save', type: 'primary'},
    ],
  },
  /*任务分配*/
  TaskAssignIndex:{
    todoTasks:'todoTasks',//待办任务
    historyTasks:'historyTasks',//历史任务
  },
  todoTasks:{
    btn: [
      {type: 'success', id: '', name: 'Bulk accept'},
      {type: 'primary', id: '', name: 'Bulk issue'},
      {type: '', id: '', name: 'Highlight track'},
      {type: '', id: '', name: 'cancel Highlight'},
    ],
    pageColumns: [
      {title: 'ReportNo', key: 'sampleNo'},
      {title: 'Process', key: 'progress', with: '130'},
      {title: 'ProductLine', key: 'sampleType', with: '100'},
      {title: 'ServiceLevel', key: 'serviceLevel', with: '100'},
      {title: 'Test Assigner', key: 'taName', with: '100'},
      {title: 'Assigner Time', key: 'taTime', date: true, with: '100'},
      {title: 'styleNo', key: 'styleNo', with: '160'},
      {title: 'reportDueDate', key: 'reportDueDate', date: true,},
      {title: 'submitterName', key: 'submitterName'},
      {title: 'submitterEmail', key: 'submitterEmail'},
      {title: 'submitterForName', key: 'submitterForName'},
      {title: 'testLabs', key: 'testLabs'},
      {title: 'receivedDate', key: 'receivedDate'},
      {title: 'onHold', key: 'onHold'},
      {title: 'onOffHoldReason', key: 'onOffHoldReason'},
    ],
    iconMsg: [
      {type: 'log-in', id: '', name: 'receive',},
      {type: 'navigate', id: '', name: 'issue', disabled: true},
      {type: 'compose', id: '', name: 'assignLab', disabled: true},
      {type: 'ios-person', id: '', name: 'RequestCS', disabled: true},
      {type: 'ios-clock', id: '', name: 'operationLog'},
    ],
    iconMsgDis: [
      {type: 'log-in', id: '', name: 'receive', disabled: true},
      {type: 'navigate', id: '', name: 'issue',},
      {type: 'compose', id: '', name: 'assignLab'},
      {type: 'ios-person', id: '', name: 'RequestCS'},
      {type: 'ios-clock', id: '', name: 'operationLog'},
    ],
  },
  historyTasks:{
    iconMsg: [
      {type: 'ios-clock', id: '', name: 'operationLog'},
    ],
  },
  TaskAssignEditContract:{
    pageColumns: [
      {title: 'labClass', key: 'type'},
      {title: 'lab', key: 'labName'},
    ],
    footerList: [
      {id: '', name: 'close', type: ''},
    ],
    iconMsg: [
      {type: 'trash-a', id: '', name: 'delete'},
    ],
    btn: [
      {type: 'success', id: '', name: 'add'},
    ],
  },
  /*分包*/
  PackageTab:{
    btn: [
      {type: 'success', id: '', name: 'add'},
    ],
    pageColumns: [
      {title: 'LabName', key: 'name',width:150,},
      {title: 'address', key: 'address',width:100,},
    ],
    iconMsg: [
      {type: 'trash-a', id: '', name: 'delete'},
    ],
  },
  /*操作日志*/
  ContractRecord:{
    pageColumns: [
      {title: 'Operator', key: 'uname', width: 100},
      {title: 'Operating time', key: 'ctime', width: 180},
      {title: 'fromStatus', key: 'fromStatus', width: 180},
      {title: 'targetStatus', key: 'targetStatus', width: 150},
      {title: 'remark', key: 'remark', width: 180},
    ],
  },
  //--------
  OutsourceTestLabManage:{//分包实验室
    btn: [
      {type: 'success', id: '', name: 'Add'},
    ],
    iconMsg: [
      {type: 'compose', id: ' env-aptitude-operate-edit', name: 'Edit'},//编辑
      /* {type: 'ios-plus-outline', id: 'env-aptitude-limit-manage', name: '追加项目'},*/
      {type: 'trash-a', id: '', name: 'Delete'},//删除
    ],
    pageColumns: [
      {title: 'Laboratory Name', key: 'name',width: 200, },//实验室名称
      {title: 'Aptitude', key: 'aptitude',width: 150,},//资质
      {title: 'Linkman', key: 'linkman',width: 100,},//联系人
      {title: 'Phone', key: 'tel',width: 120,},//电话
      {title: 'Mailbox', key: 'email',width: 150,},//邮箱
      {title: 'Address', key: 'address'},//地址
      {title: 'Means Of Payments', key: 'clearingWay',width: 200,},//结算方式
      {title: 'Remark', key: 'remark',},//备注
    ]
  },
  OutsourceTestLabItemEdit:{ //分包实验室新增、编辑
    name:'Laboratory Name:',//实验室名称
    aptitude:'Aptitude:',//资质
    linkman:'Linkman:',//联系人
    tel:'Phone:',//电话
    email:'Mailbox:',//邮箱
    address:'Address:',//地址
    clearingWay:'Means Of Payments:',//结算方式
    remark:'Remark:',//备注
    footerList: [
      {id: '', name: 'Cancel', type: ''},//取消
      {id: '', name: 'Save', type: 'primary'},//保存
    ],
    inputName:'Please enter the laboratory name:',//请输入实验室名称
    inputAptitude:'Please select qualification:',//请选择资质
    inputLinkman:'Please enter the contact person:',//请输入联系人
    inputTel:'Please enter telephone number:',//请输入电话
    inputEmail:'Please enter email address:',//请输入邮箱
    inputAddress:'Please enter the address:',//请输入地址
    inputClearingWay:'Please select the settlement method:',//请选择结算方式
    inputRemark:'Please enter remarks:',//请输入备注
    modalTitleAdd:'Subcontractor management added:',//分包商管理新增
    modalTitleEdit:'Subcontractor management editor:',//分包商管理编辑
    ruleValidateTitle:'The laboratory name cannot be empty:'//实验室名称不能为空
    //  还有 Selected option选项 alert框
  },
  AptitudeItemManage:{
    searchWidth:130,//标签宽度
    searchName:'Test Item:',//检测项目:
    searchGroupId:'Inspection Department:',//检测科室
    searchGroupAllotted:'Departments Have Been Set Up:',//已设置科室
    inputName:'Please enter the test item',//请输入检测项目
    inputGroupId:'Please select the testing section',//请选择检测科室
    inputGroupAllotted:'Please select the section that has been set up',//请选择已设置科室
    btn: [
      {type: 'success', id: '', name: 'Add'},//添加
      {type: 'error', id: '', name: 'Delete'},//删除
      {id: '', name: 'Add Setection Section'},//添加检测科室
      {id: '', name: 'To Lead'},//导入
      {id: '', name: 'Export'},//导出
      {id: '', name: 'Fast Initialization'},//快速初始化
    ],
    pageColumns: [
      {title: 'Test Item', key: 'name', width: '150'},//检测项目
      {title: 'Classification Of Department', key: 'groupType', width: '220'},//科室分类
      {title: 'Testing Laboratory', key: 'groupName', width: '170'},//检测实验室
      {title: 'Weighing Single Template', key: 'workSheet', width: '210'},//称量单模板
      {title: 'Remark', key: 'remark', width: '300'},//备注
    ],
    iconMsg: [
      {type: 'compose', id: '', name: 'Edit'},//编辑
      {type: 'ios-cog-outline', id: '', name: 'Test Method'},//检测方法
      {type: 'navicon', id: '', name: 'Limit Management'},//限值管理
      {type: 'map',id: '', name: 'Assign The Weighing Sheet Template'},//分配称量单模板
      {type: 'trash-a', id: '', name: 'Delete'},//删除
    ],
  },
  AptitudeItemManageEdit:{//资质项目 添加、编辑
    editName:'Test Item',//检测项目
    editGroupName:'Inspection Department',//检测科室
    editGroupRemark:'Remark',//备注
    inputName:'Please enter the test item',//请输入检测项目
    inputGroupName:'Please select the testing section',//请选择检测科室
    inputGroupRemark:'Please enter remarks',//请输入备注
    ruleValidateName:'The project name cannot be empty',//项目名称不能为空
    footerList: [
      {name: 'Cancel', type: ''},//取消
      {name: 'Save', type: 'primary'},//保存
    ],
    modalTitleAdd: 'Add the qualification items table',//添加资质项目表
    modalTitleEdit: 'Edit the qualification list',//编辑资质项目表
  },
  UserGroup: { //资质项目  添加检测科室
    pageColumnsOne:'Group Name',//组名称
    pageColumnsTwo:'Description',//描述
    pageColumnsThr:'Subscriber Number',//用户数
    footerList: [
      {name: 'Cancel', type: ''},//取消
      {name: 'Ok', type: 'primary'},//确定
    ],
    modalTitleOffice:'Choose Department',//选择科室
    modalTitleUser:'Select user groups',//选择用户编组
  }
};
