module.exports = {
  cont: '工作台内容',
  sys:{
    name:'系统管理名字'
  },
  label_width:'70',
  searchBtn:'搜索',
  operation:'操作',
  operationLog:'操作日志',
  packageTab:'分包',
  lab:'实验室',
  requestCS:'请求客服',
  BtnList:{
    search:'条件搜索',
    noSearch:'收起搜索',
  },
  Page:{
    total:'共',
    piece:'条'
  },
  resultChange:{
    addSuccess:'添加成功!',
    editSuccess:'编辑成功!',
    deleteSuccess:'删除成功!',
    formError:'表单验证失败!',
    warning:'请选择一条或多条数据！',
    delete:'确定删除该记录?',
    receive:'确定接收',
    Receive:'确定接收该记录?',
    ReceiveSuccess:'接收成功！',
    issue:'确定发放',
    Issue:'确定发放该记录?',
    IssueSuccess:'发放成功!',
    highLight:'确定高亮追踪',
    highLightSuccess:'高亮追踪成功!',
    cancel:'确定取消',
    highLightData:'条记录的高亮显示吗？',
    cancelHighLight:'取消高亮追踪成功!',
    data:'条数据',
    hint:'提示',
  },
  searchCondition:{
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
  input:{
    submitterEmail:'客户邮箱:',
    inputSubmitterEmail:'请输入客户邮箱',
    inputSubmitterName:'请输入或选择客户名称',
    inputSubmitterForName:'请输入或选择买家名称',
    styleNo:'款号',
    inputStyleNo:'请输入款号',
    CustomerService:'客服名称:',
    inputCustomerService:'请输入或选择客服姓名',
    ReasonForRequest:'请求原因:',
    inputReasonForRequest:'请选择请求原因',
    DetailedContent:'详细内容:',
    inputDetailedContent:'请输入详细内容',
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
      {type: 'success', id: '', name: '添加'},
    ],
    pageColumns: [
      {title: '报告编号', key: 'sampleNo'},
      {title: '产品线', key: 'sampleType'},
      {title: '服务类型', key: 'serviceLevel'},
      {title: '客户名', key: 'submitterName'},
      {title: '客户邮箱', key: 'submitterEmail'},
      {title: '买家名称', key: 'submitterForName'},
      {title: '进样日期', key: 'receivedDate', date: true, width: 120},
      {title: '应出报告日期', key: 'reportDueDate', date: true, width: 210},
    ],
    iconMsg: [
      {type: 'compose', id: '', name: '编辑'}
    ],
  },
  ContractEdit:{
    addContract:'添加委托信息',
    editContract:'编辑委托信息',
    get:'获取',
    labelWidth:'90',
    copyHisContract:'复制历史委托',
    copyOnlineContract:'复制在线委托',
    sampleNo:'报告编号或在线委托号',
    footerList: [
      {id: '', name: '取消', type: ''},
      {id: '', name: '保存', type: 'primary'},
    ],
  },
  /*任务分配*/
  TaskAssignIndex:{
    todoTasks:'待办任务',
    historyTasks:'历史任务',
  },
  todoTasks:{
    btn: [
      {type: 'success', id: '', name: '批量接收'},
      {type: 'primary', id: '', name: '批量发放'},
      {type: '', id: '', name: '高亮追踪'},
      {type: '', id: '', name: '取消高亮追踪'},
    ],
    pageColumns: [
      {title: '报告编号', key: 'sampleNo'},
      {title: '委托流程节点', key: 'progress', with: '130'},
      {title: '产品线', key: 'sampleType', with: '100'},
      {title: '服务类型', key: 'serviceLevel', with: '100'},
      {title: 'TA姓名', key: 'taName', with: '100'},
      {title: 'TA接收时间', key: 'taTime', date: true, with: '100'},
      {title: '款号', key: 'styleNo', with: '160'},
      {title: '应出报告日期', key: 'reportDueDate', date: true,},
      {title: '客户名称', key: 'submitterName'},
      {title: '客户邮箱', key: 'submitterEmail'},
      {title: '买家名称', key: 'submitterForName'},
      {title: '检测实验室', key: 'testLabs'},
      {title: '进样日期', key: 'receivedDate'},
      {title: '委托状态', key: 'onHold'},
      {title: '状态变更原因', key: 'onOffHoldReason'},
    ],
    iconMsg: [
      {type: 'log-in', id: '', name: '接收',},
      {type: 'navigate', id: '', name: '发放', disabled: true},
      {type: 'compose', id: '', name: '分配实验室', disabled: true},
      {type: 'ios-person', id: '', name: '请求客服', disabled: true},
      {type: 'ios-clock', id: '', name: '操作日志'},
    ],
    iconMsgDis: [
      {type: 'log-in', id: '', name: '接收', disabled: true},
      {type: 'navigate', id: '', name: '发放',},
      {type: 'compose', id: '', name: '分配实验室'},
      {type: 'ios-person', id: '', name: '请求客服'},
      {type: 'ios-clock', id: '', name: '操作日志'},
    ],
  },
  historyTasks:{
    iconMsg: [
      {type: 'ios-clock', id: '', name: '操作日志'},
    ],
  },
  TaskAssignEditContract:{
    pageColumns: [
      {title: '类别', key: 'type'},
      {title: '实验室', key: 'labName'},
    ],
    footerList: [
      {id: '', name: '关闭', type: ''},
    ],
    iconMsg: [
      {type: 'trash-a', id: '', name: '删除'},
    ],
    btn: [
      {type: 'success', id: '', name: '添加'},
    ],
  },
  /*分包*/
  PackageTab:{
    btn: [
      {type: 'success', id: '', name: '添加'},
    ],
    pageColumns: [
      {title: '实验室名称', key: 'name',width:150,},
      {title: '所在地', key: 'address',width:100,},
    ],
    iconMsg: [
      {type: 'trash-a', id: '', name: '删除'},
    ],
  },
  /*操作日志*/
  ContractRecord:{
    pageColumns: [
      {title: '操作人', key: 'uname', width: 100},
      {title: '操作时间', key: 'ctime', width: 180},
      {title: '原状态', key: 'fromStatus', width: 180},
      {title: '目标状态', key: 'targetStatus', width: 150},
      {title: '备注', key: 'remark', width: 180},
    ],
  },
  //-------
  OutsourceTestLabManage:{ //分包实验室
    btn: [
      {type: 'success', id: '', name: '添加'},
    ],
    iconMsg: [
      {type: 'compose', id: ' env-aptitude-operate-edit', name: '编辑'},
      /* {type: 'ios-plus-outline', id: 'env-aptitude-limit-manage', name: '追加项目'},*/
      {type: 'trash-a', id: '', name: '删除'},
    ],
    pageColumns: [
      {title: '实验室名称', key: 'name',width: 200, },
      {title: '资质', key: 'aptitude',width: 150,},
      {title: '联系人', key: 'linkman',width: 100,},
      {title: '电话', key: 'tel',width: 120,},
      {title: '邮箱', key: 'email',width: 150,},
      {title: '地址', key: 'address'},
      {title: '结算方式', key: 'clearingWay',width: 200,},
      {title: '备注', key: 'remark',},
    ]
  },
  OutsourceTestLabItemEdit:{ //分包实验室新增、编辑
    name:'实验室名称:',
    aptitude:'资质:',
    linkman:'联系人:',
    tel:'电话:',
    email:'邮箱:',
    address:'地址:',
    clearingWay:'结算方式:',
    remark:'备注:',
    footerList: [
      {id: '', name: '取消', type: ''},
      {id: '', name: '保存', type: 'primary'},
    ],
    inputName:'请输入实验室名称',
    inputAptitude:'请选择资质',
    inputLinkman:'请输入联系人',
    inputTel:'请输入电话',
    inputEmail:'请输入邮箱',
    inputAddress:'请输入地址',
    inputClearingWay:'请选择结算方式',
    inputRemark:'请输入备注',
    modalTitleAdd:'分包商管理新增',
    modalTitleEdit:'分包商管理编辑',
    ruleValidateTitle:'实验室名称不能为空'
    //  还有 Selected option选项 alert框
  },
  AptitudeItemManage:{//资质管理 -- 资质项目
    searchWidth:90,
    searchName:'检测项目:',
    searchGroupId:'检测科室:',
    searchGroupAllotted:'已设置科室:',
    inputName:'请输入检测项目',
    inputGroupId:'请选择检测科室',
    inputGroupAllotted:'请选择已设置科室',
    btn: [
      {type: 'success', id: '', name: '添加'},
      {type: 'error', id: '', name: '删除'},
      {id: '', name: '添加检测科室'},
      {id: '', name: '导入'},
      {id: '', name: '导出'},
      {id: '', name: '快速初始化'},
    ],
    pageColumns: [
      {title: '检测项目', key: 'name', width: '160'},
      {title: '科室分类', key: 'groupType', width: '100'},
      {title: '检测实验室', key: 'groupName', width: '100'},
      {title: '称量单模板', key: 'workSheet', width: '100'},
      {title: '备注', key: 'remark', width: '300'},
    ],
    iconMsg: [
      {type: 'compose', id: '', name: '编辑'},
      {type: 'ios-cog-outline', id: '', name: '检测方法'},
      {type: 'navicon', id: '', name: '限值管理'},
      {type: 'map',id: '', name: '分配称量单模板'},
      {type: 'trash-a', id: '', name: '删除'},
    ],
  },
  AptitudeItemManageEdit:{//资质项目 添加、编辑
    editName:'检测项目',
    editGroupName:'检测科室',
    editGroupRemark:'备注',
    inputName:'请输入检测项目',
    inputGroupName:'请选择检测科室',
    inputGroupRemark:'请输入备注',
    ruleValidateName:'项目名称不能为空',
    footerList: [
      {name: '取消', type: ''},
      {name: '保存', type: 'primary'},
    ],
    modalTitleAdd: '添加资质项目表',
    modalTitleEdit: '编辑资质项目表',
  },
  UserGroup:{ //资质项目  添加检测科室
    pageColumnsOne:'组名称',
    pageColumnsTwo:'描述',
    pageColumnsThr:'用户数',
    footerList: [
      {name: '取消', type: ''},
      {name: '确定', type: 'primary'},
    ],
    modalTitleOffice:'选择科室',
    modalTitleUser:'选择用户编组',
  }
};
