var vm = new Vue({
    el: '#vmDiv',
    data: {
        financeEnabledAccountingYear: {
            id: '',
            value: '0', //方便监听数据库值为''触发watch
            readOnly: '',
            sobId: ''
        },
        financeEnabledAccountingYear_init: '',
        financeEnabledAccountingPeriod: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeEnabledAccountingPeriod_init: '',
        financeCurrentAccountingYear: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeCurrentAccountingYear_init: '',
        financeCurrentAccountingPeriod: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeCurrentAccountingPeriod_init: '',
        financeProfitSubject: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeProfitSubject_init: '',
        financeProfitDistributionSubject: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeProfitDistributionSubject_init: '',
        financeEqualBalance: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeEqualBalance_init: '',
        financeAbstractInherit: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAbstractInherit_init: '',
        financeProfitBalanceFetch: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeProfitBalanceFetch_init: '',
        financeCostBalanceFetch: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeCostBalanceFetch_init: '',
        financeYearAntiSettlement: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeYearAntiSettlement_init: '',
        financeBalanceMerge: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeBalanceMerge_init: '',
        financeAuditCertificatePosting: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAuditCertificatePosting_init: '',
        financeCashierAuditCertificatePosting: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeCashierAuditCertificatePosting_init: '',
        financeAuditCertificateNoCheck: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAuditCertificateNoCheck_init: '',
        financeManualUpdateCertificate: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeManualUpdateCertificate_init: '',
        financeAssignFlowsProject: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAssignFlowsProject_init: '',
        financeAssignFlowsListsProject: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAssignFlowsListsProject_init: '',
        financeUpdateBusinessCertificate: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeUpdateBusinessCertificate_init: '',
        financeInputBillingInformation: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        FinanceInputBillingInformation_init: '',
        financeBatchAudit: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeBatchAudit_init: '',
        financeAuditSameMan: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAuditSameMan_init: '',
        financeAuditCertificateNoSameMan: {
            id: '',
            value: '',
            readOnly: '',
            sobId: ''
        },
        financeAuditCertificateNoSameMan_init: '',
        accountSubject:[],
        canUpdateAccountPeriod: false,
        subjectVisiable: false,
        subjectType: '',
    },
    methods: {
        save: function () {
            if ($('form').valid()) {
                console.log(this.$data);
            }

            var array = [];
            if (vm.financeEnabledAccountingPeriod.value != vm.financeEnabledAccountingPeriod_init) {
                vm.financeEnabledAccountingPeriod.readOnly = 1;
                vm.financeEnabledAccountingYear.readOnly = 1;
                array.push(vm.financeEnabledAccountingYear);
                array.push(vm.financeEnabledAccountingPeriod);
                vm.financeCurrentAccountingYear.value = vm.financeEnabledAccountingYear.value;
                vm.financeCurrentAccountingPeriod.value = vm.financeEnabledAccountingPeriod.value;
                array.push(vm.financeCurrentAccountingYear);
                array.push(vm.financeCurrentAccountingPeriod);
                vm.financeEnabledAccountingPeriod_init = vm.financeEnabledAccountingPeriod.value;
            }
            if (vm.financeProfitSubject.value != vm.financeProfitSubject_init) {
                array.push(vm.financeProfitSubject);
                vm.financeProfitSubject_init = vm.financeProfitSubject.value;
            }
            if (vm.financeProfitDistributionSubject.value != vm.financeProfitDistributionSubject_init) {
                array.push(vm.financeProfitDistributionSubject);
                vm.financeProfitDistributionSubject_init = vm.financeProfitDistributionSubject.value;
            }
            if (vm.financeEqualBalance.value != vm.financeEqualBalance_init) {
                array.push(vm.financeEqualBalance);
                vm.financeEqualBalance_init = vm.financeEqualBalance.value;
            }
            if (vm.financeAbstractInherit.value != vm.financeAbstractInherit_init) {
                array.push(vm.financeAbstractInherit);
                vm.financeAbstractInherit_init = vm.financeAbstractInherit.value;
            }
            if (vm.financeProfitBalanceFetch.value != vm.financeProfitBalanceFetch_init) {
                array.push(vm.financeProfitBalanceFetch);
                vm.financeProfitBalanceFetch_init = vm.financeProfitBalanceFetch.value;
            }
            if (vm.financeCostBalanceFetch.value != vm.financeCostBalanceFetch_init) {
                array.push(vm.financeCostBalanceFetch);
                vm.financeCostBalanceFetch_init = vm.financeCostBalanceFetch.value;
            }
            if (vm.financeYearAntiSettlement.value != vm.financeYearAntiSettlement_init) {
                array.push(vm.financeYearAntiSettlement);
                vm.financeYearAntiSettlement_init = vm.financeYearAntiSettlement.value;
            }
            if (vm.financeBalanceMerge.value != vm.financeBalanceMerge_init) {
                array.push(vm.financeBalanceMerge);
                vm.financeBalanceMerge_init = vm.financeBalanceMerge.value;
            }
            if (vm.financeAuditCertificatePosting.value != vm.financeAuditCertificatePosting_init) {
                array.push(vm.financeAuditCertificatePosting);
                vm.financeAuditCertificatePosting_init = vm.financeAuditCertificatePosting.value;
            }
            if (vm.financeCashierAuditCertificatePosting.value != vm.financeCashierAuditCertificatePosting_init) {
                array.push(vm.financeCashierAuditCertificatePosting);
                vm.financeCashierAuditCertificatePosting_init = vm.financeCashierAuditCertificatePosting.value;
            }
            if (vm.financeAuditCertificateNoCheck.value != vm.financeAuditCertificateNoCheck_init) {
                array.push(vm.financeAuditCertificateNoCheck);
                vm.financeAuditCertificateNoCheck_init = vm.financeAuditCertificateNoCheck.value;
            }
            if (vm.financeManualUpdateCertificate.value != vm.financeManualUpdateCertificate_init) {
                array.push(vm.financeManualUpdateCertificate);
                vm.financeManualUpdateCertificate_init = vm.financeManualUpdateCertificate.value;
            }
            if (vm.financeAssignFlowsProject.value != vm.financeAssignFlowsProject_init) {
                array.push(vm.financeAssignFlowsProject);
                vm.financeAssignFlowsProject_init = vm.financeAssignFlowsProject.value;
            }
            if (vm.financeAssignFlowsListsProject.value != vm.financeAssignFlowsListsProject_init) {
                array.push(vm.financeAssignFlowsListsProject);
                vm.financeAssignFlowsListsProject_init = vm.financeAssignFlowsListsProject.value;
            }
            if (vm.financeUpdateBusinessCertificate.value != vm.financeUpdateBusinessCertificate_init) {
                array.push(vm.financeUpdateBusinessCertificate);
                vm.financeUpdateBusinessCertificate_init = vm.financeUpdateBusinessCertificate.value;
            }
            if (vm.financeInputBillingInformation.value != vm.financeInputBillingInformation_init) {
                array.push(vm.financeInputBillingInformation);
                vm.financeInputBillingInformation_init = vm.financeInputBillingInformation.value;
            }
            if (vm.financeBatchAudit.value != vm.financeBatchAudit_init) {
                array.push(vm.financeBatchAudit);
                vm.financeBatchAudit_init = vm.financeBatchAudit.value;
            }
            if (vm.financeAuditSameMan.value != vm.financeAuditSameMan_init) {
                array.push(vm.financeAuditSameMan);
                vm.financeAuditSameMan_init = vm.financeAuditSameMan.value;
            }
            if (vm.financeAuditCertificateNoSameMan.value != vm.financeAuditCertificateNoSameMan_init) {
                array.push(vm.financeAuditCertificateNoSameMan);
                vm.financeAuditCertificateNoSameMan_init = vm.financeAuditCertificateNoSameMan.value;
            }

            if (htUtilHasValue(array, 'array')) {
                $.ajax({
                    type: 'POST',
                    contentType: 'application/json;charset=utf-8',
                    url: contextPath + '/systemProfileController/updateBatch',
                    //data: JSON.stringify(vm.data),
                    data: JSON.stringify(array),
                    success: function (result) {
                        if (result.data > 0) {
                            alert('更改成功！');
                        } else {
                            alert('更改失败！');
                        }

                    }

                });
            } else {
                alert('暂无数据提交！');
            }
        },
        openModalSubject(type) {
            if (type == 1) {
                vm.subjectType = 1;
            } else {
                vm.subjectType = 2;
            }

            vm.subjectVisiable = true;
        },
        subjectClose() {
            vm.subjectVisiable = false;
        },
        subjectData(res) {
            if (vm.subjectType == 1) {
                vm.financeProfitSubject.value = res.subjectCode;
            } else {
                vm.financeProfitDistributionSubject.value = res.subjectCode;
            }

            console.log(res);
        },
    },
    watch:{
        'financeEnabledAccountingYear.value': function (val,oldVal) {
            if (val=='') {
                //获取会计起始年度
                var getAccountingYearUrl = contextPath + '/systemProfileController/getAccountYear?sobId=1';
                var _this = this;
                $.ajax({
                    type: 'POST',
                    url: getAccountingYearUrl,
                    success: function (result) {
                        _this.financeEnabledAccountingYear.value = result.data;
                    }
                });
            }
        },
    },
    created: function () {
        //1.查询系统信息参数
        var sysUrl = contextPath + '/systemProfileController/queryByType?type=总帐参数&sobId=1'
        $.ajax({
            type: 'POST',
            url: sysUrl,
            success: function (result) {
                var dataObj = result.data;

                if (null != dataObj && typeof(dataObj) != undefined) {
                    for (var i = 0; i < dataObj.length; i++) {
                        if (dataObj[i].name == 'financeEnabledAccountingYear') {
                            vm.financeEnabledAccountingYear = dataObj[i];
                            vm.financeEnabledAccountingYear_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeEnabledAccountingPeriod') {
                            vm.financeEnabledAccountingPeriod = dataObj[i];
                            vm.financeEnabledAccountingPeriod_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeCurrentAccountingYear') {
                            vm.financeCurrentAccountingYear = dataObj[i];
                            vm.financeCurrentAccountingYear_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeCurrentAccountingPeriod') {
                            vm.financeCurrentAccountingPeriod = dataObj[i];
                            vm.financeCurrentAccountingPeriod_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeProfitSubject') {
                            vm.financeProfitSubject = dataObj[i];
                            vm.financeProfitSubject_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeProfitDistributionSubject') {
                            vm.financeProfitDistributionSubject = dataObj[i];
                            vm.financeProfitDistributionSubject_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeEqualBalance') {
                            vm.financeEqualBalance = dataObj[i];
                            vm.financeEqualBalance_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeAbstractInherit') {
                            vm.financeAbstractInherit = dataObj[i];
                            vm.financeAbstractInherit_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeProfitBalanceFetch') {
                            vm.financeProfitBalanceFetch = dataObj[i];
                            vm.financeProfitBalanceFetch_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeCostBalanceFetch') {
                            vm.financeCostBalanceFetch = dataObj[i];
                            vm.financeCostBalanceFetch_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeYearAntiSettlement') {
                            vm.financeYearAntiSettlement = dataObj[i];
                            vm.financeYearAntiSettlement_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeBalanceMerge') {
                            vm.financeBalanceMerge = dataObj[i];
                            vm.financeBalanceMerge_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeAuditCertificatePosting') {
                            vm.financeAuditCertificatePosting = dataObj[i];
                            vm.financeAuditCertificatePosting_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeCashierAuditCertificatePosting') {
                            vm.financeCashierAuditCertificatePosting = dataObj[i];
                            vm.financeCashierAuditCertificatePosting_init = dataObj[i].value;

                        }
                        if (dataObj[i].name == 'financeAuditCertificateNoCheck') {
                            vm.financeAuditCertificateNoCheck = dataObj[i];
                            vm.financeAuditCertificateNoCheck_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeManualUpdateCertificate') {
                            vm.financeManualUpdateCertificate = dataObj[i];
                            vm.financeManualUpdateCertificate_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeAssignFlowsProject') {
                            vm.financeAssignFlowsProject = dataObj[i];
                            vm.financeAssignFlowsProject_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeAssignFlowsListsProject') {
                            vm.financeAssignFlowsListsProject = dataObj[i];
                            vm.financeAssignFlowsListsProject_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeUpdateBusinessCertificate') {
                            vm.financeUpdateBusinessCertificate = dataObj[i];
                            vm.financeUpdateBusinessCertificate_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeInputBillingInformation') {
                            vm.financeInputBillingInformation = dataObj[i];
                            vm.financeInputBillingInformation_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeBatchAudit') {
                            vm.financeBatchAudit = dataObj[i];
                            vm.financeBatchAudit_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeAuditSameMan') {
                            vm.financeAuditSameMan = dataObj[i];
                            vm.financeAuditSameMan_init = dataObj[i].value;
                        }
                        if (dataObj[i].name == 'financeAuditCertificateNoSameMan') {
                            vm.financeAuditCertificateNoSameMan = dataObj[i];
                            vm.financeAuditCertificateNoSameMan_init = dataObj[i].value;

                        }
                    }
                }
            }
        });
        //2.查询会计科目列表
        var accountSubjectUrl = contextPath + '/systemProfileController/queryAccountListAll'
        $.ajax({
            type: 'POST',
            url: accountSubjectUrl,
            success: function (result) {
                //todo 待添加会计科目列表
            }
        });

        // 3.查询会计期间是否可以修改
        var canUpdateAccountPeriodUrl = contextPath + '/systemProfileController/canUpdateAccountPeriod';

        $.ajax({
            type: 'POST',
            url: canUpdateAccountPeriodUrl,
            data: {"serviceType": "financeInitializedState"},
            success: function (result) {
                var canUpdateData = result.data;
                vm.canUpdateAccountPeriod = canUpdateData;
            }
        });
    },
    mounted: function () {
        $('form').validate();
    }
});