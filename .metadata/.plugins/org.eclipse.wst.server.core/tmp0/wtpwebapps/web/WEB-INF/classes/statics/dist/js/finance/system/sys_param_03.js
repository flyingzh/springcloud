"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(n){return typeof n}:function(n){return n&&"function"==typeof Symbol&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},vm=new Vue({el:"#vmDiv",data:{financeEnabledAccountingYear:{id:"",value:"0",readOnly:"",sobId:""},financeEnabledAccountingYear_init:"",financeEnabledAccountingPeriod:{id:"",value:"",readOnly:"",sobId:""},financeEnabledAccountingPeriod_init:"",financeCurrentAccountingYear:{id:"",value:"",readOnly:"",sobId:""},financeCurrentAccountingYear_init:"",financeCurrentAccountingPeriod:{id:"",value:"",readOnly:"",sobId:""},financeCurrentAccountingPeriod_init:"",financeProfitSubject:{id:"",value:"",readOnly:"",sobId:""},financeProfitSubject_init:"",financeProfitDistributionSubject:{id:"",value:"",readOnly:"",sobId:""},financeProfitDistributionSubject_init:"",financeEqualBalance:{id:"",value:"",readOnly:"",sobId:""},financeEqualBalance_init:"",financeAbstractInherit:{id:"",value:"",readOnly:"",sobId:""},financeAbstractInherit_init:"",financeProfitBalanceFetch:{id:"",value:"",readOnly:"",sobId:""},financeProfitBalanceFetch_init:"",financeCostBalanceFetch:{id:"",value:"",readOnly:"",sobId:""},financeCostBalanceFetch_init:"",financeYearAntiSettlement:{id:"",value:"",readOnly:"",sobId:""},financeYearAntiSettlement_init:"",financeBalanceMerge:{id:"",value:"",readOnly:"",sobId:""},financeBalanceMerge_init:"",financeAuditCertificatePosting:{id:"",value:"",readOnly:"",sobId:""},financeAuditCertificatePosting_init:"",financeCashierAuditCertificatePosting:{id:"",value:"",readOnly:"",sobId:""},financeCashierAuditCertificatePosting_init:"",financeAuditCertificateNoCheck:{id:"",value:"",readOnly:"",sobId:""},financeAuditCertificateNoCheck_init:"",financeManualUpdateCertificate:{id:"",value:"",readOnly:"",sobId:""},financeManualUpdateCertificate_init:"",financeAssignFlowsProject:{id:"",value:"",readOnly:"",sobId:""},financeAssignFlowsProject_init:"",financeAssignFlowsListsProject:{id:"",value:"",readOnly:"",sobId:""},financeAssignFlowsListsProject_init:"",financeUpdateBusinessCertificate:{id:"",value:"",readOnly:"",sobId:""},financeUpdateBusinessCertificate_init:"",financeInputBillingInformation:{id:"",value:"",readOnly:"",sobId:""},FinanceInputBillingInformation_init:"",financeBatchAudit:{id:"",value:"",readOnly:"",sobId:""},financeBatchAudit_init:"",financeAuditSameMan:{id:"",value:"",readOnly:"",sobId:""},financeAuditSameMan_init:"",financeAuditCertificateNoSameMan:{id:"",value:"",readOnly:"",sobId:""},financeAuditCertificateNoSameMan_init:"",accountSubject:[],canUpdateAccountPeriod:!1,subjectVisiable:!1,subjectType:""},methods:{save:function(){$("form").valid()&&console.log(this.$data);var n=[];vm.financeEnabledAccountingPeriod.value!=vm.financeEnabledAccountingPeriod_init&&(vm.financeEnabledAccountingPeriod.readOnly=1,vm.financeEnabledAccountingYear.readOnly=1,n.push(vm.financeEnabledAccountingYear),n.push(vm.financeEnabledAccountingPeriod),vm.financeCurrentAccountingYear.value=vm.financeEnabledAccountingYear.value,vm.financeCurrentAccountingPeriod.value=vm.financeEnabledAccountingPeriod.value,n.push(vm.financeCurrentAccountingYear),n.push(vm.financeCurrentAccountingPeriod),vm.financeEnabledAccountingPeriod_init=vm.financeEnabledAccountingPeriod.value),vm.financeProfitSubject.value!=vm.financeProfitSubject_init&&(n.push(vm.financeProfitSubject),vm.financeProfitSubject_init=vm.financeProfitSubject.value),vm.financeProfitDistributionSubject.value!=vm.financeProfitDistributionSubject_init&&(n.push(vm.financeProfitDistributionSubject),vm.financeProfitDistributionSubject_init=vm.financeProfitDistributionSubject.value),vm.financeEqualBalance.value!=vm.financeEqualBalance_init&&(n.push(vm.financeEqualBalance),vm.financeEqualBalance_init=vm.financeEqualBalance.value),vm.financeAbstractInherit.value!=vm.financeAbstractInherit_init&&(n.push(vm.financeAbstractInherit),vm.financeAbstractInherit_init=vm.financeAbstractInherit.value),vm.financeProfitBalanceFetch.value!=vm.financeProfitBalanceFetch_init&&(n.push(vm.financeProfitBalanceFetch),vm.financeProfitBalanceFetch_init=vm.financeProfitBalanceFetch.value),vm.financeCostBalanceFetch.value!=vm.financeCostBalanceFetch_init&&(n.push(vm.financeCostBalanceFetch),vm.financeCostBalanceFetch_init=vm.financeCostBalanceFetch.value),vm.financeYearAntiSettlement.value!=vm.financeYearAntiSettlement_init&&(n.push(vm.financeYearAntiSettlement),vm.financeYearAntiSettlement_init=vm.financeYearAntiSettlement.value),vm.financeBalanceMerge.value!=vm.financeBalanceMerge_init&&(n.push(vm.financeBalanceMerge),vm.financeBalanceMerge_init=vm.financeBalanceMerge.value),vm.financeAuditCertificatePosting.value!=vm.financeAuditCertificatePosting_init&&(n.push(vm.financeAuditCertificatePosting),vm.financeAuditCertificatePosting_init=vm.financeAuditCertificatePosting.value),vm.financeCashierAuditCertificatePosting.value!=vm.financeCashierAuditCertificatePosting_init&&(n.push(vm.financeCashierAuditCertificatePosting),vm.financeCashierAuditCertificatePosting_init=vm.financeCashierAuditCertificatePosting.value),vm.financeAuditCertificateNoCheck.value!=vm.financeAuditCertificateNoCheck_init&&(n.push(vm.financeAuditCertificateNoCheck),vm.financeAuditCertificateNoCheck_init=vm.financeAuditCertificateNoCheck.value),vm.financeManualUpdateCertificate.value!=vm.financeManualUpdateCertificate_init&&(n.push(vm.financeManualUpdateCertificate),vm.financeManualUpdateCertificate_init=vm.financeManualUpdateCertificate.value),vm.financeAssignFlowsProject.value!=vm.financeAssignFlowsProject_init&&(n.push(vm.financeAssignFlowsProject),vm.financeAssignFlowsProject_init=vm.financeAssignFlowsProject.value),vm.financeAssignFlowsListsProject.value!=vm.financeAssignFlowsListsProject_init&&(n.push(vm.financeAssignFlowsListsProject),vm.financeAssignFlowsListsProject_init=vm.financeAssignFlowsListsProject.value),vm.financeUpdateBusinessCertificate.value!=vm.financeUpdateBusinessCertificate_init&&(n.push(vm.financeUpdateBusinessCertificate),vm.financeUpdateBusinessCertificate_init=vm.financeUpdateBusinessCertificate.value),vm.financeInputBillingInformation.value!=vm.financeInputBillingInformation_init&&(n.push(vm.financeInputBillingInformation),vm.financeInputBillingInformation_init=vm.financeInputBillingInformation.value),vm.financeBatchAudit.value!=vm.financeBatchAudit_init&&(n.push(vm.financeBatchAudit),vm.financeBatchAudit_init=vm.financeBatchAudit.value),vm.financeAuditSameMan.value!=vm.financeAuditSameMan_init&&(n.push(vm.financeAuditSameMan),vm.financeAuditSameMan_init=vm.financeAuditSameMan.value),vm.financeAuditCertificateNoSameMan.value!=vm.financeAuditCertificateNoSameMan_init&&(n.push(vm.financeAuditCertificateNoSameMan),vm.financeAuditCertificateNoSameMan_init=vm.financeAuditCertificateNoSameMan.value),htUtilHasValue(n,"array")?$.ajax({type:"POST",contentType:"application/json;charset=utf-8",url:contextPath+"/systemProfileController/updateBatch",data:JSON.stringify(n),success:function(n){0<n.data?alert("更改成功！"):alert("更改失败！")}}):alert("暂无数据提交！")},openModalSubject:function(n){vm.subjectType=1==n?1:2,vm.subjectVisiable=!0},subjectClose:function(){vm.subjectVisiable=!1},subjectData:function(n){1==vm.subjectType?vm.financeProfitSubject.value=n.subjectCode:vm.financeProfitDistributionSubject.value=n.subjectCode,console.log(n)}},watch:{"financeEnabledAccountingYear.value":function(n,e){if(""==n){var i=contextPath+"/systemProfileController/getAccountYear?sobId=1",a=this;$.ajax({type:"POST",url:i,success:function(n){a.financeEnabledAccountingYear.value=n.data}})}}},created:function(){var n=contextPath+"/systemProfileController/queryByType?type=总帐参数&sobId=1";$.ajax({type:"POST",url:n,success:function(n){var e=n.data;if(null!=e&&null!=(void 0===e?"undefined":_typeof(e)))for(var i=0;i<e.length;i++)"financeEnabledAccountingYear"==e[i].name&&(vm.financeEnabledAccountingYear=e[i],vm.financeEnabledAccountingYear_init=e[i].value),"financeEnabledAccountingPeriod"==e[i].name&&(vm.financeEnabledAccountingPeriod=e[i],vm.financeEnabledAccountingPeriod_init=e[i].value),"financeCurrentAccountingYear"==e[i].name&&(vm.financeCurrentAccountingYear=e[i],vm.financeCurrentAccountingYear_init=e[i].value),"financeCurrentAccountingPeriod"==e[i].name&&(vm.financeCurrentAccountingPeriod=e[i],vm.financeCurrentAccountingPeriod_init=e[i].value),"financeProfitSubject"==e[i].name&&(vm.financeProfitSubject=e[i],vm.financeProfitSubject_init=e[i].value),"financeProfitDistributionSubject"==e[i].name&&(vm.financeProfitDistributionSubject=e[i],vm.financeProfitDistributionSubject_init=e[i].value),"financeEqualBalance"==e[i].name&&(vm.financeEqualBalance=e[i],vm.financeEqualBalance_init=e[i].value),"financeAbstractInherit"==e[i].name&&(vm.financeAbstractInherit=e[i],vm.financeAbstractInherit_init=e[i].value),"financeProfitBalanceFetch"==e[i].name&&(vm.financeProfitBalanceFetch=e[i],vm.financeProfitBalanceFetch_init=e[i].value),"financeCostBalanceFetch"==e[i].name&&(vm.financeCostBalanceFetch=e[i],vm.financeCostBalanceFetch_init=e[i].value),"financeYearAntiSettlement"==e[i].name&&(vm.financeYearAntiSettlement=e[i],vm.financeYearAntiSettlement_init=e[i].value),"financeBalanceMerge"==e[i].name&&(vm.financeBalanceMerge=e[i],vm.financeBalanceMerge_init=e[i].value),"financeAuditCertificatePosting"==e[i].name&&(vm.financeAuditCertificatePosting=e[i],vm.financeAuditCertificatePosting_init=e[i].value),"financeCashierAuditCertificatePosting"==e[i].name&&(vm.financeCashierAuditCertificatePosting=e[i],vm.financeCashierAuditCertificatePosting_init=e[i].value),"financeAuditCertificateNoCheck"==e[i].name&&(vm.financeAuditCertificateNoCheck=e[i],vm.financeAuditCertificateNoCheck_init=e[i].value),"financeManualUpdateCertificate"==e[i].name&&(vm.financeManualUpdateCertificate=e[i],vm.financeManualUpdateCertificate_init=e[i].value),"financeAssignFlowsProject"==e[i].name&&(vm.financeAssignFlowsProject=e[i],vm.financeAssignFlowsProject_init=e[i].value),"financeAssignFlowsListsProject"==e[i].name&&(vm.financeAssignFlowsListsProject=e[i],vm.financeAssignFlowsListsProject_init=e[i].value),"financeUpdateBusinessCertificate"==e[i].name&&(vm.financeUpdateBusinessCertificate=e[i],vm.financeUpdateBusinessCertificate_init=e[i].value),"financeInputBillingInformation"==e[i].name&&(vm.financeInputBillingInformation=e[i],vm.financeInputBillingInformation_init=e[i].value),"financeBatchAudit"==e[i].name&&(vm.financeBatchAudit=e[i],vm.financeBatchAudit_init=e[i].value),"financeAuditSameMan"==e[i].name&&(vm.financeAuditSameMan=e[i],vm.financeAuditSameMan_init=e[i].value),"financeAuditCertificateNoSameMan"==e[i].name&&(vm.financeAuditCertificateNoSameMan=e[i],vm.financeAuditCertificateNoSameMan_init=e[i].value)}});var e=contextPath+"/systemProfileController/queryAccountListAll";$.ajax({type:"POST",url:e,success:function(n){}});var i=contextPath+"/systemProfileController/canUpdateAccountPeriod";$.ajax({type:"POST",url:i,data:{serviceType:"financeInitializedState"},success:function(n){var e=n.data;vm.canUpdateAccountPeriod=e}})},mounted:function(){$("form").validate()}});