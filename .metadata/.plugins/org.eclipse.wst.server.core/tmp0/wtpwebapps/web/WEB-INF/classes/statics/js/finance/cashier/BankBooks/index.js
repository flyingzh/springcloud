var vm = new Vue({
    el: '#bank-book-test', //银行存款日记账
    data() {
        var that = this;
        return {
            baseData: {
                standardCurrencyId: '',
                subjectName: '',
                bankAccountNumber: '',
                currencyName: '',
                periodDate: ''
            },
            voucherFilter: {
                voucherWordId: 0,//凭证字id
                abnormalDataProcessing: '1',//按单异常处理
                subjectMergerDebit: false, // 借方相同科目合并
                subjectMergerLender: false //贷方相同科目合并
            },
            editData: {
                id: '',
                sobId: '',
                subjectId: '',
                currencyId: '',
                datetime: '',
                operatetime: '',
                periodDate: '',
                serialNumber: '',
                debitAmountFor: '',
                debitAmountForRate: '',
                creditAmountFor: '',
                creditAmountForRate: '',
                creditAmount: '',
                remark: '',
                relativeSubjectId: '',
                relativeSubjectCode: '',
                relativeSubjectName: '',
                relativeSubjectValue: '',
                direction: '',
                exchangeRate: 1,
                accountYear: '',
                accountPeriod: '',
                handleId: '',
                handleName: '',
                isProject: '',
                isCarryOver: '1',
                dataSource: '2',
                summary: '',
                bankAccount: '',
                isTick: '',
                voucherId: ''
            },
            addData: {
                id: '',
                sobId: '',
                subjectId: '',
                currencyId: '',
                datetime: '',
                operatetime: '',
                periodDate: '',
                serialNumber: '',
                debitAmountFor: '',
                debitAmountForRate: '',
                creditAmountFor: '',
                creditAmountForRate: '',
                creditAmount: '',
                remark: '',
                relativeSubjectId: '',
                relativeSubjectCode: '',
                relativeSubjectName: '',
                relativeSubjectValue: '',
                direction: '',
                exchangeRate: '',
                //accountYear: '',
                //accountPeriod: '',
                handleId: '',
                handleName: '',
                isProject: '',
                isCarryOver: '1',
                dataSource: '2',
                summary: '',
                bankAccount: '',
                isTick: '',
                voucherId: ''
            },
            openData: {
                sobId: 0,
                subjectId: "",
                currencyId: "",
                startYear: "",
                endYear: "",
                startPeriod: "",
                endPeriod: "",
                startDate: "",
                endDate: "",
                voucherGroupId: "",
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                explains: "",
                relateSubjectId: "",
                handleId: "",
                prepareId: "",
                showInitBalance: true,
                showDetailRecord: true,
                showDaySum: true,
                showPeriodSum: true,
                showYearSum: true,
                showTotalSum: true,
                type: "1",
                subjectName: '',
                currencyName: '',
                bankAccountNumber: "",
                openCurrencyList: [],
                openMakerList: [],
                openHandManList: []
            },
            importData: {
                startYear: "",
                startPeriod: "",
                voucherGroupId: -1,
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                audited: -1,
                posted: "",
                preparerId: -1,
                importId: []
            },
            clearOpenData: {
                voucherGroupId: "",
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                explains: "",
                relateSubjectId: "",
                handleId: "",
                prepareId: ""
            },
            ClearImportData: {
                startYear: "",
                startPeriod: "",
                voucherGroupId: "",
                startVoucherGroupNumber: "",
                endVoucherGroupNumber: "",
                audited: "",
                posted: "",
                preparerId: "",
                importId: []
            },
            filterVisible: false,
            editVisible: false,
            voucherModelTxt: '',
            viewReportTxt: '',
            showVoucherVisible: false,
            voucherVisible: false,
            importVisible: false,
            isContinue: false,
            viewReportVisible: false,
            base_config: {
                multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/cnbankdepositjournalappcontroller/bankDetail',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                jsonReader: {
                    root: "data.resultVOs",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999999999,
                onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                    that.handlerId(data, status, "selected");
                    // that.getListId(that.selected, that.selectedId, that.tableList)
                },
                onSelectRow: function (data, status) { // 当选择行时触发此事件
                    console.log("data---------", data, status);
                    if (!!data) {
                        that.handlerId(data, status, "selected");
                        console.log(that.selected)
                        // that.getListId(that.selected, that.selectedId, that.tableList)
                    }
                },
                gridComplete: function () {
                    $("table[id='grid'] tr[id='null'] input").attr('style', 'display:none');
                    $("table[id='grid'] tr[id='0'] input").attr('style', 'display:none');
                    window.top.home.loading('hide');
                },

            },
            colNames: [],
            colModel: [],
            printInfo: {},
            printModal: false,
            dataList: [],
            tableHeaders: [],
            organisationList: [
                {label: "金大祥", value: 1},
            ],
            //科目列表
            subjectList: [
                {
                    accountId: 95,
                    accountCode: "1001",
                    accountName: '库存现金'
                }
            ],
            //经手人
            handManList: [],
            //银行存款日记账表的制单人列表
            preparerList: [],
            //凭证表的制单人列表
            voucherMakerList: [],
            //币别列表
            currencyList: [],
            //xx银行-xx币别
            bankCurrencyList: [],
            //摘要列表
            voucherExpList: [],
            //凭证字列表
            voucherDataList: [],
            //凭证字列表
            voucherDataLists: [],
            voucherData: [],
            //会计年度列表
            periodYear: [],
            //会计期间列表
            periodList: [],
            //审核状态
            auditedList: [
                {id: -1, name: '全部'},
                {id: 1, name: '已审核'},
                {id: 2, name: '未审核'}
            ],
            //过账状态
            postedList: [
                {id: -1, name: '全部'},
                {id: 1, name: '已过账'},
                {id: 2, name: '未过账'}
            ],
            editTitle: "",
            subjectVisable: false,
            subjectTpye: "",
            tableList: [],
            selected: [],  // 获取列表列的勾选数组的rowId
            selectedId: [],   // 获取列表列的勾选数组的id
            importSelected: [], //获取引入弹框列表列的勾选数组的rowId
            addSubjectListOpt: [],
            addSubjectListOptShow: false,
            subjectOpts: {},
            optsVal: {},
            remarkVisable: false, // 摘要弹窗
            // 摘要列表
            remarklist: [],
            remarkType: 0,
            openTime: "",//用于控制退出按钮
        }
    },
    mounted() {
        this.initPage();
        this._queryObject();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        //用户选择别科目时
        openSubjectChange(item) {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                data: {'subjectId': item},
                success: function (result) {
                    if (result.code == '100100' && result.data != null) {
                        _vm.openData.openCurrencyList = result.data;
                        _vm.$refs.openCurrencyIdRef.reset();
                        _vm.$nextTick(function () {
                            if (_vm.openData.openCurrencyList.length > 0) {
                                _vm.openData.currencyId = _vm.openData.openCurrencyList[0].currencyId;
                            }
                        });
                    } else {
                        _vm.$Message.error({
                            content: '切换银行科目异常!',
                            duration: 3,
                            closable: true
                        });
                    }
                }
            });
        },
        subjectChange(item) {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                data: {'subjectId': item},
                success: function (result) {
                    if (result.code == '100100' && result.data != null) {
                        _vm.currencyList = result.data;
                        _vm.$refs.editCurrencyIdRef.reset();
                        _vm.$nextTick(function () {
                            _vm.editData.currencyId = _vm.currencyList[0].currencyId;
                        });
                    } else {
                        _vm.$Message.error({
                            content: '切换银行科目异常!',
                            duration: 3,
                            closable: true
                        });
                    }
                }
            });

            $.each(_vm.subjectList, function (idx, ele) {
                if (item == ele.accountId) {
                    _vm.editData.bankAccount = ele.bankAccount;
                }
            })
        },
        currencyChange(item) {
            $.each(vm.currencyList, function (idx, ele) {
                if (item == ele.currencyId) {
                    vm.editData.debitAmountForRate = ele.exchangeRate;
                    vm.editData.creditAmountForRate = ele.exchangeRate;
                    vm.editData.exchangeRate = ele.exchangeRate;
                } else {
                    vm.editData.debitAmountForRate = 1;
                    vm.editData.creditAmountForRate = 1;
                }
            });
        },
        bookDateChange(item) {

            if (!item) {
                vm.$Modal.error({
                    title:'提示信息',
                    scrollable:true,
                    content:"日期不能为空!",
                })
                return;
            }

            let currentDate = (new Date(item)).format("yyyy-MM-dd");
            let pDate = {'currentDate': currentDate, 'currencyId': vm.editData.currencyId};
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/getPeriodByDate',
                data: pDate,
                success: function (result) {
                    if (result.code == '100100' && result.data != null) {
                        vm.editData.periodDate = result.data.year + '年' + result.data.month + '期';
                        vm.editData.serialNumber = result.data.serialNum;
                        vm.editData.accountYear = result.data.year;
                        vm.editData.accountPeriod = result.data.month;

                    } else {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
                    }
                }
            });
        },
        // 文摘弹窗
        clickDigest(_t) {
            this.remarkType = _t;
            this.remarkVisable = true;
        },
        onDblclickRemarkRow(remark) {
            let that = this;
            that.remarkType === 1 ? that.editData.summary = remark.content : that.openData.explains = remark.content;
            //	vm.row.abstract = remark.content;
            // vm.row.explains = remark.content;
            // vm.row.explainsLabel = remark.content;
            // vm.row.explainsValue = remark.id || '';
            that.remarkVisable = false;
        },
        onRemarkModalChange(val) {
            this.remarkVisable = val;
        },
        onRemarkListChange(val) {
            this.remarklist = val;
        },
        //页面初始化
        initPage() {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/initPage',
                dataType: 'json',
                data: null,
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")) {
                            _msg = result.msg;
                        }
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:_msg,
                        })
                        return;
                    }
                    let dataInfo = result.data;
                    _vm.organisationList = dataInfo.org;
                    _vm.baseData.standardCurrencyId = dataInfo.standardCurrencyId;
                    _vm.currencyList = dataInfo.currencyList;
                    _vm.openData.openCurrencyList = dataInfo.currencyList;
                    _vm.bankCurrencyList = dataInfo.bankCurrencyList;
                    _vm.voucherExpList = dataInfo.voucherExpList;
                    _vm.remarklist = dataInfo.voucherExpList;
                    _vm.subjectList = dataInfo.subjectList;
                    _vm.voucherDataList = dataInfo.voucherDataList;
                    _vm.openData.openHandManList = dataInfo.openHandManList;
                    _vm.openData.openMakerList = dataInfo.openMakerList;
                    _vm.voucherDataLists = $.extend(true, [], dataInfo.voucherDataList);
                    _vm.voucherData = _vm.voucherDataLists.slice(1);
                    _vm.periodYear = dataInfo.periodYear;
                    _vm.periodList = dataInfo.monthList;
                    _vm.handManList = dataInfo.projectList[3];
                    _vm.preparerList = dataInfo.listFromPreparer;
                    _vm.voucherMakerList = dataInfo.voucherMakerList;
                    _vm.addData.cnCurrentAccountYear = dataInfo.cnCurrentAccountYear;
                    _vm.addData.cnCurrentAccountPeriod = dataInfo.cnCurrentAccountPeriod;
                    _vm.addData.sobId = dataInfo.org[0].value;
                    if (!$.isEmptyObject(dataInfo.subjectList) && dataInfo.subjectList.length != 0) {
                        _vm.addData.subjectId = dataInfo.subjectList[0].accountId;
                        _vm.openData.subjectId = dataInfo.subjectList[0].accountId;
                        _vm.openData.subjectName = dataInfo.subjectList[0].accountName;
                        $.each(dataInfo.subjectList, function (idx, ele) {
                            if (_vm.addData.subjectId == ele.accountId) {
                                _vm.baseData.subjectName = dataInfo.subjectList[0].accountName;
                                _vm.baseData.bankAccountNumber = dataInfo.subjectList[0].bankAccount;
                            }
                        })
                    }
                    if (!$.isEmptyObject(dataInfo.currencyList) && dataInfo.currencyList.length != 0) {
                        _vm.addData.currencyId = dataInfo.currencyList[0].currencyId;
                        _vm.editData.currencyId = dataInfo.currencyList[0].currencyId;
                        $.each(_vm.currencyList, function (idx, ele) {
                            if (_vm.addData.currencyId == ele.currencyId) {
                                _vm.addData.debitAmountForRate = ele.exchangeRate;
                                _vm.addData.creditAmountForRate = ele.exchangeRate;
                                _vm.baseData.currencyName = ele.currencyName;
                                _vm.openData.currencyName = ele.currencyName;
                            }
                        });
                    }
                    _vm.addData.serialNumber = dataInfo.serialNum;
                    _vm.addData.datetime = dataInfo.endDate;
                    _vm.addData.operatetime = dataInfo.endDate;
                    _vm.addData.periodDate = dataInfo.cnCurrentAccountYear + '年' + dataInfo.cnCurrentAccountPeriod + '期';
                    //设置经手人列表

                    //页面初始化时,要先用 新增时候的数据覆盖修改时的数据
                    Object.assign(_vm.editData, _vm.addData);

                    _vm.openData.startDate = dataInfo.startDate;
                    _vm.openData.endDate = dataInfo.endDate;
                    _vm.editData.datetime = dataInfo.endDate;
                    _vm.editData.operatetime = dataInfo.endDate;
                    _vm.openData.sobId = dataInfo.org[0].value;
                    _vm.openData.currencyId = dataInfo.currencyList[0].currencyId;

                    $.each(dataInfo.periodYear, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountYear) {
                            _vm.openData.startYear = ele.value;
                            _vm.importData.startYear = ele.value;
                            _vm.openData.endYear = ele.value;
                        }
                    });
                    $.each(_vm.periodList, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountPeriod) {
                            _vm.openData.startPeriod = ele.name;
                            _vm.importData.startPeriod = ele.name;
                            _vm.openData.endPeriod = ele.name;
                        }
                    });

                    _vm.importData.startDate = dataInfo.startDate;
                    _vm.importData.endDate = dataInfo.endDate;
                    _vm.subjectOpts = dataInfo.projectOpts;

                    //设置新增页面的初始值
                    _vm.editData.accountYear = dataInfo.cnCurrentAccountYear;
                    _vm.editData.accountPeriod = dataInfo.cnCurrentAccountPeriod;
                    _vm.editData.bankAccount = dataInfo.subjectList[0].bankAccount;


                    //初始化值全部赋值完毕,执行一次查询
                    _vm.initMethod();
                    _vm.importInit();
                }
            });
        },
        // 初始值
        initMethod() {

            let data = this.openData;
            if (data.type == 2) {
                //按照日期筛选 startDate: "",  endDate: "",
                console.log("查看startDate");
                console.log(data.startDate);
                data.startDate = (new Date(data.startDate)).format("yyyy-MM-dd");
                data.endDate = (new Date(data.endDate)).format("yyyy-MM-dd");
            }

            this.delTable();
            this.setTableHeader();
        },
        setTableHeader() {
            console.log(this.baseData.standardCurrencyId, this.openData.currencyId);
            if (this.baseData.standardCurrencyId === this.openData.currencyId) {
                this.colNames = ['id', '业务日期', '日期', '当日序号', '凭证字号', '凭证期间', '凭证审核', '过账标志', '摘要',
                    '对方科目', '借方金额', '贷方金额', '余额', '经手人', '勾对', '勾对期间', '制单人', '数据来源', '备注', 'voucherId', 'sobId'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'operateTimeStr', width: 100},
                    {name: 'dateTimeStr', width: 100},
                    {
                        name: 'serialNumber', width: 100, formatter: function (value, options, rowData) {
                        return (value != null && value > 0 ) ? value : '';
                    }
                    },
                    {name: 'voucherGroupData', width: 100,},
                    {name: 'voucherPeriodData', width: 100},
                    {
                        name: 'audited', width: 100, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value == 1 ) ? icon : '';
                    }
                    },
                    {
                        name: 'posted', width: 100, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value == 1 ) ? icon : '';
                    }
                    },
                    {name: 'summary', width: 120,},
                    {
                        name: 'tbasSubjectName', width: 150, formatter: function (value, options, rowData) {
                        return (value != null) ? value : '';
                    }
                    },
                    {
                        name: 'debitAmount', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'creditAmount', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'balance', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'handleName', width: 90,},
                    {
                        name: 'isTick', width: 90, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value > 1 ) ? icon : '';
                    }
                    },
                    {name: 'tickTimeStr', width: 90,},
                    {name: 'createName', width: 90,},
                    {
                        name: 'dataSource', width: 150, formatter: function (value, options, rowData) {
                        if (value == 1) {
                            return '总账引入';
                        } else if (value == 2) {
                            return '手工录入';
                        } else if (value == 3) {
                            return 'Excel导入';
                        } else {
                            return '';
                        }
                    }
                    },
                    {name: 'remark', width: 90,},
                    {name: 'voucherId', width: 90, hidden: true},
                    {name: 'sobId', width: 90, hidden: true},
                ];
                this.tableHeaders = [];
            } else {
                this.colNames = ['id', '业务日期', '日期', '当日序号', '凭证字号', '凭证期间', '凭证审核', '过账标志', '摘要',
                    '对方科目', '原币', '本位币', '原币', '本位币', '原币', '本位币', '经手人', '勾对', '勾对期间', '制单人', '数据来源', '备注', 'voucherId', 'sobId'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'operateTimeStr', width: 100},
                    {name: 'dateTimeStr', width: 100},
                    {
                        name: 'serialNumber', width: 100, formatter: function (value, options, rowData) {
                        return (value != null && value > 0 ) ? value : '';
                    }
                    },
                    {name: 'voucherGroupData', width: 100,},
                    {name: 'voucherPeriodData', width: 100},
                    {
                        name: 'audited', width: 100, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value == 1 ) ? icon : '';
                    }
                    },
                    {
                        name: 'posted', width: 100, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value == 1 ) ? icon : '';
                    }
                    },
                    {name: 'summary', width: 120,},
                    {
                        name: 'tbasSubjectName', width: 150, formatter: function (value, options, rowData) {
                        return (value != null) ? value : '';
                    }
                    },
                    {
                        name: 'debitAmountFor', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'debitAmount', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'creditAmountFor', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'creditAmount', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'balanceFor', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'balance', width: 100, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {name: 'handleName', width: 90,},
                    {
                        name: 'isTick', width: 90, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value > 1 ) ? icon : '';
                    }
                    },
                    {name: 'tickTimeStr', width: 90,},
                    {name: 'createName', width: 90,},
                    {
                        name: 'dataSource', width: 150, formatter: function (value, options, rowData) {
                        if (value == 1) {
                            return '总账引入';
                        } else if (value == 2) {
                            return '手工录入';
                        } else if (value == 3) {
                            return 'Excel导入';
                        } else {
                            return '';
                        }
                    }
                    },
                    {name: 'remark', width: 90,},
                    {name: 'voucherId', width: 90, hidden: true},
                    {name: 'sobId', width: 90, hidden: true},
                ];
                this.tableHeaders = [
                    {startColumnName: 'debitAmountFor', numberOfColumns: 2, titleText: '借方金额'},
                    {startColumnName: 'creditAmountFor', numberOfColumns: 2, titleText: '贷方金额'},
                    {startColumnName: 'balanceFor', numberOfColumns: 2, titleText: '余额'}
                ];
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        delTable() {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.openData),
                loadComplete: function (ret) {
                    if (ret.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (ret.hasOwnProperty("data")){
                            _msg  = ret.msg;
                        }
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:_msg,
                        })
                        return;
                    }

                    _vm.dataList = ret.data.resultVOs;

                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });

                    //获取引入弹框表格所有行数据
                    let rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    _vm.tableList = rows;
                    _vm.baseData.periodDate = ret.data.queryPeriod;
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        open() {
            this.filterVisible = true;
        },
        refresh() {
            window.top.home.loading('show');

            this.openSave();
            $('#list').setGridParam({postData: JSON.stringify(this.openData)}).trigger("reloadGrid");
            this.selected = [];
            this.isContinue = false;
        },
        addFun() {
            let _vm = this;
            Object.assign(_vm.editData, _vm.addData);
            _vm.editTitle = "银行存款日记账 - 新增";

            //把 打开  功能里面的 科目/币别/币别list 赋值到 新增 功能里面
            _vm.editData.subjectId = _vm.openData.subjectId;
            let hasSameCurrency = false;
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                data: {'subjectId': _vm.editData.subjectId},
                success: function (result) {
                    _vm.$refs.editCurrencyIdRef.reset();
                    if (result.code == '100100' && result.data != null) {
                        _vm.currencyList = result.data;
                        _vm.$nextTick(function () {
                            _vm.$refs.editCurrencyIdRef.reset();
                            if (!$.isEmptyObject(_vm.currencyList) && _vm.currencyList.length != 0) {
                                $.each(_vm.currencyList, function (idx, ele) {
                                    if (_vm.openData.currencyId == ele.currencyId) {
                                        _vm.editData.debitAmountForRate = ele.exchangeRate;
                                        _vm.editData.creditAmountForRate = ele.exchangeRate;
                                        _vm.editData.currencyId = ele.currencyId;
                                        hasSameCurrency = true;
                                    }
                                });

                                if (!hasSameCurrency) {
                                    console.log(hasSameCurrency, 'hasSameCurrency');
                                    _vm.editData.debitAmountForRate = _vm.currencyList[0].exchangeRate;
                                    _vm.editData.creditAmountForRate = _vm.currencyList[0].exchangeRate;
                                    _vm.editData.currencyId = _vm.currencyList[0].currencyId;
                                }

                            }
                        });
                    } else {
                        _vm.$Message.error({
                            content: '该科目未挂币别,请重新选择或者挂币别!',
                            duration: 3,
                            closable: true
                        });
                    }
                }
            });


            _vm.$nextTick(function () {

                //点击新增时,更新当日序号并赋值
                let param = {'accountYear':_vm.editData.accountYear,'accountPeriod':_vm.editData.accountPeriod,'endDate':_vm.editData.datetime};
                $.ajax({
                    type: 'post',
                    url : contextPath + '/cnbankdepositjournalappcontroller/getSerialNum',
                    data : param,
                    success: function (ret) {
                        if(ret.code == '100100' && ret.data != null){
                            _vm.editData.serialNumber = ret.data;
                        }else {
                            _vm.editData.serialNumber = 0;
                        }
                    }
                });

                //点击新增时,把 打开 弹出框里面里面的 科目/币别 赋值到新增弹出框中
                _vm.$refs.editCurrencyIdRef.reset();
                if (!$.isEmptyObject(_vm.currencyList) && _vm.currencyList.length != 0) {
                    $.each(_vm.currencyList, function (idx, ele) {
                        if (_vm.openData.currencyId == ele.currencyId) {
                            console.log(_vm.openData.currencyId, 'opendataCur');
                            console.log(ele.currencyId, 'eleCur');
                            _vm.editData.debitAmountForRate = ele.exchangeRate;
                            _vm.editData.creditAmountForRate = ele.exchangeRate;
                            _vm.editData.currencyId = ele.currencyId;
                            hasSameCurrency = true;
                        }
                    });

                    if (!hasSameCurrency) {
                        console.log(hasSameCurrency, 'hasSameCurrency');
                        _vm.editData.debitAmountForRate = _vm.currencyList[0].exchangeRate;
                        _vm.editData.creditAmountForRate = _vm.currencyList[0].exchangeRate;
                        _vm.editData.currencyId = _vm.currencyList[0].currencyId;
                    }

                }
            });

            _vm.editVisible = true;
        },
        editFun() {
            //点击页面修改按钮时
            let _vm = this;
            let arrId = _vm.selected.filter(row => !!row);
            if (arrId.length != 1) {
                _vm.$Message.warning({
                    content: '请只选择一条数据',
                    duration: 3,
                    closable: true
                });
                return;
            }

            _vm.editTitle = "银行存款日记账 - 编辑";
            _vm.editVisible = true;

            //先清空之前的数据
            Object.assign(_vm.editData, _vm.addData);
            //发送异步请求,把返回的数据渲染到编辑页面,赋值的同时需要再发个同步请求获取币别列表
            let tempFun2 = $.ajax({
                type: 'post',
                url: contextPath + "/cnbankdepositjournalappcontroller/getObjectById",
                data: {'id': arrId[0]},
                dataType: 'json',
            });

            let bank = {};
            let resultData = {};
            let tempFun3 = tempFun2.then(function (result) {
                console.log(result.data);
                if (result.code != '100100') {
                    _vm.editVisible = false;
                    let _msg = '页面初始化失败';
                    if (result.hasOwnProperty("data")){
                        _msg  = result.msg;
                    }
                    vm.$Modal.error({
                        title:'提示信息',
                        scrollable:true,
                        content:_msg,
                    })
                    return;
                }
                //在这里写tempFun2的success回调函数代码:
                bank = result.data.bankDepositJournalEntity;
                resultData = result.data;
                let opts = result.data.opts;
                _vm.optsVal = opts || {};
                _vm.addSubjectListOptClose();
                _vm.editData.subjectId = bank.subjectId;

                return $.ajax({
                    type: 'post',
                    url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                    data: {'subjectId': _vm.editData.subjectId}
                });
            });

            tempFun3.done(function (resultForSubjctChange) {

                if (resultForSubjctChange == null) {
                    _vm.editVisible = false;
                    return;
                }
                //科目改变之后需要更新币别列表
                _vm.currencyList = resultForSubjctChange.data;
                //赋值剩余属性
                _vm.editData.operatetime = bank.operateTime;
                _vm.editData.sobId = bank.sobId;
                _vm.editData.accountPeriod = bank.accountPeriod;
                _vm.editData.remark = bank.remark;
                _vm.editData.isTick = bank.isTick;
                _vm.editData.isProject = bank.isProject;
                _vm.editData.updateId = bank.updateId;
                _vm.editData.datetime = bank.datetime;
                _vm.editData.exchangeRate = bank.exchangeRate;
                _vm.editData.creditAmountForRate = bank.exchangeRate;
                _vm.editData.debitAmountForRate = bank.exchangeRate;
                _vm.editData.voucherId = bank.voucherId;
                _vm.editData.id = bank.id;
                _vm.editData.currencyId = bank.currencyId;
                _vm.editData.creditAmount = bank.creditAmount;
                _vm.editData.creditAmountFor = bank.creditAmountFor;
                _vm.editData.summary = bank.summary;
                _vm.editData.serialNumber = bank.serialNumber;
                _vm.editData.isCarryOver = bank.isCarryOver;
                _vm.editData.handleName = bank.handleName;
                _vm.editData.accountYear = bank.accountYear;
                _vm.editData.debitAmount = bank.debitAmount;
                _vm.editData.debitAmountFor = bank.debitAmountFor;
                _vm.editData.relativeSubjectId = bank.relativeSubjectId;
                _vm.editData.handleId = bank.handleId;
                _vm.editData.dataSource = bank.dataSource;
                _vm.editData.relativeSubjectCode = resultData.relativeSubjectCode;
                _vm.editData.relativeSubjectName = resultData.relativeSubjectName;
                //调用此方法给 对方科目 这栏渲染数据
                _vm.addSubjectBlur();
            });
        },
        importFun() {

            this.importVisible = true;
        },
        creatVoucher() {
            this.voucherVisible = true;
        },
        openSave() {
            let _vm = this;
            _vm.selected = [];
            _vm.selectedId = [];
            _vm.importSelected = [];
            //打开操作,用户选定科目和币别之后,页面要展示name
            $.each(_vm.openData.openCurrencyList, function (idx, ele) {
                if (_vm.openData.currencyId == ele.currencyId) {
                    _vm.baseData.currencyName = ele.currencyName;
                    _vm.openData.currencyName = ele.currencyName;
                }
            });

            $.each(_vm.subjectList, function (idx, ele) {
                if (_vm.openData.subjectId == ele.accountId) {
                    _vm.baseData.subjectName = ele.accountName;
                    _vm.openData.subjectName = ele.accountName;
                    _vm.baseData.bankAccountNumber = ele.bankAccount;
                    _vm.openData.bankAccountNumber = ele.bankAccount;
                }
            });
            this.initMethod();
            this.filterVisible = false;

        },
        editSave() {
            //新增或者修改调用此方法
            let _vm = this;
            let data = _vm.editData;
            console.log("data:  ");
            console.log(data);

            if (data.serialNumber == null || data.serialNumber <= 0) {
                _vm.$Message.error('当日序号不能小于1');
                return;
            }

            if (data.datetime == null || data.datetime == '') {
                _vm.$Message.error('日期不能为空');
                return;
            }

            if (data.summary == null || data.summary == '') {
                _vm.$Message.error('摘要不能为空');
                return;
            }

            if (!data.debitAmountFor && !data.creditAmountFor) {
                _vm.$Message.error('请输入借方金额或贷方金额');
                return;
            }

            $.each(_vm.handManList, function (idx, ele) {
                if (ele.name == data.handleId) {
                    data.handleName = ele.value;
                }
            });

            let param = {'bankDepositJournalEntity': data, 'opts': _vm.optsVal};
            console.log("新增/修改时准备传回后台的参数 : ")
            console.log(param);

            $.ajax({
                type: 'post',
                url: contextPath + "/cnbankdepositjournalappcontroller/saveOrUpdate",
                data: JSON.stringify(param),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        vm.$Modal.success({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
                        _vm.editVisible = false;
                        Object.assign(_vm.editData, _vm.addData);
                        _vm.refresh();
                    } else {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
                    }
                }
            })
            this.editVisible = false;
        },
        importSave() {
            //引入银行存款日记账
            let _vm = this;
            console.log(_vm.importData);
            $.ajax({
                type: 'post',
                url: contextPath + "/cnbankdepositjournalappcontroller/importBankJournal",
                data: JSON.stringify(_vm.importData),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        vm.$Modal.success({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
                        this.importVisible = false;
                        _vm.initMethod();
                    } else {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
                    }
                }
            })


            this.importVisible = false;
        },
        //查询凭证选项
        _queryObject: function () {
            var that = this;
            var _url = baseURL + 'generatingCredentialOption/getCredentialOption';
            let _formData = new FormData();
            _formData.append("ownershipSystem", 32);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    that.voucherFilter = json.data;
                }
            }, (json) => {
            })
        },
        //更新生成凭证选项
        voucherSave() {
            var that = this;
            console.log(that.voucherFilter, '===that.voucherFilter');
            var _url = baseURL + 'generatingCredentialOption/update';
            let _formData = new FormData();
            _formData.append("voucherWordId", parseInt(that.voucherFilter.voucherWordId));
            _formData.append("abnormalDataProcessing", parseInt(that.voucherFilter.abnormalDataProcessing));
            _formData.append("subjectMergerDebit", that.voucherFilter.subjectMergerDebit);
            _formData.append("subjectMergerLender", that.voucherFilter.subjectMergerLender);
            _formData.append("ownershipSystem", 32);//出纳系统
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    // that.dataList = json.data;
                    that.cancel('voucher');
                }
                that.$Message.info({
                    content: json.msg,
                    duration: 3
                });

            }, (json) => {
            })
            this.voucherVisible = false;
        },
        //根据type的值不同分为按单,汇总,查看,删除凭证
        selectRowAction(type) {
            console.log("type", type);
            var that = this;
            var _url = '';
            // var _ids = [3];
            var _parame = that.selected; //无论是按单还是汇总，参数都为集合，装id

            console.log("选中的id数组为====>>", _parame);
            var parame = _parame.filter(function (item, index, array) {
                //元素值，元素的索引，原数组。
                return (item != '0' && item != 'null');
            });
            if (parame.length === 0) {
                that.$Message.info({
                    content: "请选择至少一条单据",
                    duration: 3
                });
                return;
            }
            console.log("id数组为====>>", parame);
            if (type === 'according') {
                //按单生成凭证
                that._ajaxAccording(parame);
            } else if (type === 'summary') {
                //汇总生成凭证
                _url = baseURL + 'cnbankdepositjournalappcontroller/setPoolVoucher';

                $.ajax({
                    type: 'post',
                    async: false,
                    url: _url,
                    data: {'ids': parame},
                    success: function (result) {
                        var _text = '';
                        if (result.code === '100100') {
                            //跳转到编辑凭证页面
                            console.log("result", result);
                            if (result.data.gcoe.abnormalDataProcessing === '1') {
                                var _h = `${rcContextPath}/finance/voucher-lrt/index.html?key=${result.data.key}&sys=32&type=3`;
                                var _p = {
                                    'name': '查看凭证',
                                    'url': _h
                                }
                                window.parent.activeEvent(_p);
                            }
                            _text = result.msg;
                            //刷新页面
                            that.refresh();
                        } else {
                            _text = result.msg;
                        }
                        that.$Message.info({
                            content: _text,
                            duration: 3
                        });
                    }
                });
            } else if (type === 'voucher') {
                //查看凭证
                console.log("that.parame", parame);
                if (parame.length === 0) {
                    that.$Message.info({
                        content: '请选择一个单据。',
                        duration: 3
                    });
                    return;
                }
                ;
                //获取到最后一个id
                var id = parame[parame.length - 1];
                var _d = '';
                for (var i = 0; i < that.tableList.length; i++) {
                    if (that.tableList[i].id == id) {
                        _d = that.tableList[i];
                        break;
                    }
                }
                console.log("_d", _d);
                console.log("_d", _d.voucherId);
                if (_d.voucherGroupData === '' || typeof _d.voucherId === undefined) {
                    that.$Message.info({
                        content: '最后选取的单据暂未生成凭证。',
                        duration: 3
                    });
                    return;
                }
                console.log("parame", parame);

                var _h = `${rcContextPath}/finance/voucher-lrt/index.html?voucherId=${_d.voucherId}&sobId=${_d.sobId}`;
                var _p = {
                    'name': '查看凭证',
                    'url': _h
                }
                window.parent.activeEvent(_p);
            } else if (type === 'delete') {
                //获取选中的id
                //声明数组 存放voucherId
                var _voucherIds = [];
                console.log(parame, "parame")
                for (var i = 0; i < that.tableList.length; i++) {
                    for (var j = 0; j < parame.length; j++) {
                        if (that.tableList[i].id === parame[j]) {
                            _voucherIds.push(that.tableList[i].voucherId);
                        }
                    }
                }
                console.log("_voucherId", _voucherIds);
                //去除重复的voucherId
                var _result = [], i, j, len = _voucherIds.length;
                for (i = 0; i < len; i++) {
                    for (j = i + 1; j < len; j++) {
                        if (_voucherIds[i] === _voucherIds[j]) {
                            j = ++i;
                        }
                    }
                    _result.push(_voucherIds[i]);
                }
                if (_result.length === 0) {
                    that.$Message.info({
                        content: "已选择的单据未生成凭证",
                        duration: 3
                    });
                }
                console.log("_result", _result);
                _url = baseURL + 'voucherController/deleteMechanismVoucherBatch'
                $.ajax({
                    type: 'post',
                    async: false,
                    url: _url,
                    data: {'sobId': 1, 'ids': _result},
                    success: function (json) {
                        var _text = '';
                        if (json.code === '100100') {
                            that.showVoucher(true);
                            that.voucherModelTxt = json.data.resultData;
                            that.viewReportTxt = json.data.detailResult;
                        } else {
                            _text = json.msg;
                            that.$Message.info({
                                content: _text,
                                duration: 3
                            });
                        }

                    }
                });
            }
            ;
        },
        accordingAction() {
            var that = this;
            that.showVoucher(false);
            that.refresh();
        },
        showVoucher(_bool) {
            this.showVoucherVisible = _bool;
        },
        showViewReport(_bool) {
            this.viewReportVisible = !this.viewReportVisible;
        },
        showVoucherVisibleClose() {
            this.refresh();
        },
        _extremely() {

        },
        _ajaxAccording(parame) {
            var that = this;
            var _url = baseURL + 'cnbankdepositjournalappcontroller/setGeneratingCertificate';
            console.log("parame", parame);
            $.ajax({
                type: 'post',
                async: false,
                url: _url,
                data: {'ids': parame},

                success: function (json) {
                    if (json.code === '100100') {
                        if (json.data.gcoe.abnormalDataProcessing === '1') {
                            //编辑凭证
                            var _h = `${rcContextPath}/finance/voucher-lrt/index.html?key=${json.data.key}&sys=32&type=3`;
                            var _p = {
                                'name': '查看凭证',
                                'url': _h
                            }
                            window.parent.activeEvent(_p);
                            that.refresh();
                            return;
                        } else if (json.data.gcoe.abnormalDataProcessing === '2') {
                            that.showVoucher(true);
                            //跳过该凭证
                        } else if (json.data.gcoe.abnormalDataProcessing === '3') {
                            //停止生成凭证
                            that.showVoucher(true);
                            that.isContinue = false;
                        }
                        that.voucherModelTxt = json.data.vses.length === parame.length ? '生成凭证成功！' : '生成凭证失败！';
                        // var _t = '报告内容：';
                        // json.data.log.forEach((_item) => {
                        //     _t += `${_item} , `;
                        // });
                        that.viewReportTxt = json.data.log;
                    } else {
                        that.$Message.info({
                            content: json.msg,
                            duration: 3
                        });
                    }
                }
            })
        },
        save(type) {
            switch (type) {
                case 'open':
                    this.openSave();
                    break;
                case 'edit':
                    this.editSave();
                    break;
                case 'import':
                    this.importSave();
                    break;
                case 'voucher':
                    this.voucherSave();
                    break;
                default:
                    break;
            }

        },
        cancel(type) {
            switch (type) {
                case 'open':
                    this.filterVisible = false;
                    Object.assign(this.openData, this.clearOpenData);
                    break;
                case 'edit':
                    this.editVisible = false;
                    Object.assign(this.editData, this.addData);
                    break;
                case 'import':
                    Object.assign(this.importData, this.ClearImportData);
                    this.importVisible = false;
                    break;
                case 'voucher':
                    this.voucherVisible = false;
                    break;
                default:
                    break;
            }
        },
        // 科目下拉框
        showSubjectVisable(type) {
            this.subjectVisable = true;
            this.subjectTpye = type;
        },
        subjectClose() {
            this.subjectVisable = false;
        },
        subjectData(treeNode) {
            console.log(treeNode, '====treeNode');
            var that = this;
            switch (that.subjectTpye) {
                case 1:
                    //打开的数据
                    that.openData.relateSubjectId = treeNode.id;
                    that.openData.subjectCode = treeNode.subjectCode;
                    that.openData.subjectName = treeNode.subjectName;
                    break;
                case 2:
                    //新增或者编辑的数据
                    that.editData.relativeSubjectId = treeNode.id;
                    that.editData.relativeSubjectCode = treeNode.subjectCode;
                    that.editData.relativeSubjectName = treeNode.subjectName;
                    that.editData.relativeSubjectValue = `${treeNode.subjectCode} ${treeNode.fullName}`;
                    var _url = contextPath + '/voucherController/getListBySubjectId';
                    $.ajax({
                        type: 'POST',
                        data: {id: that.editData.relativeSubjectId},
                        url: _url,
                        success: function (result) {
                            if (result.code != '100100') {
                                let _msg = '页面初始化失败';
                                if (result.hasOwnProperty("data")){
                                    _msg  = result.msg;
                                }
                                vm.$Modal.error({
                                    title:'提示信息',
                                    scrollable:true,
                                    content:_msg,
                                })
                                return;
                            }
                            that.addSubjectListOpt = result.data.opts;

                            if (result.data.opts.length) {
                                var _arr = {};
                                $.each(result.data.opts, function (key, val) {
                                    _arr[val] = '';
                                });
                                that.optsVal = _arr;
                                that.addSubjectListOptShow = true;
                            }
                        },
                        error: function (code) {
                            console.log(code);
                        }
                    });
                    break;
            }
            this.subjectClose();
        },
        importInit() {
            let that = this;
            jQuery("#importGrid").jqGrid(
                {
                    multiselect: true,
                    datatype: "local",
                    colNames: ['id', '科目'],
                    colModel: [
                        {name: 'id', width: 70, align: "center", sortable: false, key: true, hidden: true},
                        {
                            name: 'name', width: 250, align: "left", sortable: false,
                            // formatter: function (value, grid, rows, state) {
                            //     $(document).off("click",".detaila"+rows.id).on("click",".detaila"+rows.id,function(){
                            //         that.detailClick(rows)
                            //     });
                            //     let div =`<a class="detaila${rows.id} ht-link">${rows.subjectCode}</a>`;
                            //     return div
                            // }
                        },
                    ],
                    rownumbers: true,
                    rowNum: 999999999,//一页显示多少条
                    styleUI: 'Bootstrap',
                    height: 210,
                    onSelectAll: function (data, status) { // 且点击头部的checkbox时才会触发此事件
                        that.handlerId(data, status, "importSelected");
                        //that.getListId(that.importSelected, that.importData.importId, that.importTableList)
                        that.getImportId();
                    },
                    onSelectRow: function (data, status) { // 当选择行时触发此事件
                        that.handlerId(data, status, "importSelected");
                        //that.getListId(that.importSelected, that.importData.importId, that.importTableList)
                        that.getImportId();
                    },
                })
            for (var i = 0; i <= that.importTableList.length; i++) {
                jQuery("#importGrid").jqGrid('addRowData', i + 1, that.importTableList[i]);
            }
        },
        handlerId(data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data.filter(row => {
                    if (row != 'null' && row != '0') {
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data != 'null' && data != '0');
                    if (flag) {
                        (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                    }
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
            // console.log(_vm[type],type)
        },
        // oldArr ---旧数组(rowid),newArr---新数组（id）,rootArr---来源数组
        getListId(oldArr, newArr, rootArr) {
            newArr = [];
            oldArr.map(item => {
                newArr.push(rootArr[item - 1].id)
            })
        },
        getImportId() {
            this.importData.importId = [];
            this.importSelected.map(item => {
                this.importData.importId.push(this.importTableList[item - 1].id)
            })
        },
        openAddSubject() {
            console.log(this.addSubjectListOpt, '====this.addSubjectListOpt')
            this.addSubjectListOptShow = true;
        },
        addSubjectEnterd() {
            var that = this;
            // 9901 9902
            var _url = contextPath + '/cashier/getSubjectInfoByCode';
            $.ajax({
                type: 'POST',
                data: {'code': that.editData.relativeSubjectValue},
                url: _url,
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")){
                            _msg  = result.msg;
                        }
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:_msg,
                        })
                        return;
                    }

                    if (!result.data.subjectId) {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:"查无数据",
                        })
                        return;
                    }
                    that.editData.relativeSubjectId = result.data.subjectId;
                    that.editData.relativeSubjectCode = result.data.subjectCode;
                    that.editData.relativeSubjectName = result.data.subjectName;
                    // that.editData.relativeSubjectValue = `${result.data.subjectCode} ${result.data.subjectName}`;

                    that.addSubjectListOpt = result.data.opts;
                    if (result.data.opts.length) {
                        var _arr = {};
                        $.each(result.data.opts, function (key, val) {
                            _arr[val] = '';
                        });
                        that.optsVal = _arr;
                        that.addSubjectListOptShow = true;
                    }
                },
                error: function (code) {
                    console.log(code);
                }
            });
        },
        addSubjectListOptClose() {
            var that = this;
            var _t = ``;
            console.log(that.optsVal, '===that.optsVal');
            $.each(that.optsVal, function (key, val) {
                if (val === '' || val === undefined) return;
                var _info = that.subjectOpts[key];
                var _f = _info.list[val]
                _t += `${_info.label}:${_f.code}-${_f.name};`;
            });
            _t !== '' && (_t = `/${_t}`)
            that.editData.relativeSubjectValue = `${that.editData.relativeSubjectCode} ${that.editData.relativeSubjectName}${_t}`;
        },
        addSubjectFocus() {
            var that = this;
            that.editData.relativeSubjectValue = that.editData.relativeSubjectCode;
        },
        addSubjectBlur() {
            //新增 对方科目 失去焦点事件
            var that = this;
            // that.editData.relativeSubjectValue = `${that.editData.relativeSubjectCode} ${that.editData.relativeSubjectName}`;
            if (that.editData.relativeSubjectValue == null || that.editData.relativeSubjectValue == '') {
                that.editData.relativeSubjectCode = '';
                that.editData.relativeSubjectName = '';
                that.optsVal = {};
                that.editData.relativeSubjectValue = '';
                that.editData.relativeSubjectId = '';
                return;
            }

            var _t = ``;
            $.each(that.optsVal, function (key, val) {
                if (val === '' || val === undefined) return;
                var _info = that.subjectOpts[key];
                var _f = _info.list[val]
                _t += `${_info.label}:${_f.code}-${_f.name};`;
            });
            _t !== '' && (_t = `/${_t}`)
            that.editData.relativeSubjectValue = `${that.editData.relativeSubjectCode} ${that.editData.relativeSubjectName}${_t}`;
        },
        addhandManBlur(query) {
            //新增 经手人 失去焦点事件
            console.log("查看query");
            console.log(query);
            let that = this;
            if (query == null || query == '') {
                that.editData.handleId = '';
            }
        },
        selectOpt() {
        },
        exportExcel() {
            //引出,导出
            let data = vm.openData;
            let bData = vm.baseData;
            let _url = contextPath + "/cnbankdepositjournalappcontroller/exportExcel?sobId=" + data.sobId + "&subjectId=" + data.subjectId +
                "&currencyId=" + data.currencyId + "&startYear=" + data.startYear + "&endYear=" + data.endYear +
                "&startPeriod=" + data.startPeriod + "&endPeriod=" + data.endPeriod + "&startDate=" + data.startDate +
                "&endDate=" + data.endDate + "&voucherGroupId=" + data.voucherGroupId + "&startVoucherGroupNumber=" + data.startVoucherGroupNumber +
                "&endVoucherGroupNumber=" + data.endVoucherGroupNumber + "&explains=" + data.explains + "&relateSubjectId=" + data.relateSubjectId +
                "&handleId=" + data.handleId + "&prepareId=" + data.prepareId + "&showInitBalance=" + data.showInitBalance +
                "&showDetailRecord=" + data.showDetailRecord + "&showDetailRecord=" + data.showDetailRecord +
                "&showDaySum=" + data.showDaySum + "&showPeriodSum=" + data.showPeriodSum + "&showYearSum=" + data.showYearSum +
                "&showTotalSum=" + data.showTotalSum + "&type=" + data.type + "&subjectName=" + data.subjectName + "&currencyName=" + data.currencyName + "&bankAccountNumber=" + bData.bankAccountNumber;
            window.open(_url);
        },
        print() {
            //打印,支持用户自定义表头
            let that = this;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.error({
                    content: '无打印数据!',
                    duration: 3
                });
                return;
            }
            console.log("点击打印,查看that.dataList: ");
            console.log(that.dataList);
            /*
            遍历结果集,把勾对的"√",以及数据源的str形式, 展示出来
            是否审核_ 1 是.2否
            是否过账_ 1 是.2否
            勾对：1 未勾对 2 已勾对
            */
            $.each(that.dataList, function (idx, ele) {
                ele.isTick = ele.isTick == 2 ? '√' : '';
                ele.audited = ele.audited == 1 ? '√' : '';
                ele.posted = ele.posted == 1 ? '√' : '';
                if (ele.dataSource == '1') {
                    ele.dataSource = '总账引入';
                } else if (ele.dataSource == '2') {
                    ele.dataSource = '手工录入';
                } else if (ele.dataSource == '3') {
                    ele.dataSource = 'Excel导入';
                } else {
                    ele.dataSource = '';
                }
            });

            if (that.openData.currencyId === that.baseData.standardCurrencyId) {
                //单行表头
                var _info = {
                    'title': '银行存款日记账',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        {'name': '科目', 'val': that.baseData.subjectName},
                        {'name': '账号', 'val': that.baseData.bankAccountNumber},
                        {'name': '币别', 'val': that.baseData.currencyName},
                        {'name': '期间', 'val': that.baseData.periodDate}
                    ],
                    'colNames': [       // 列名与对应字段名
                        {'name': '业务日期', 'col': 'operateTimeStr'},
                        {'name': '日期', 'col': 'dateTimeStr'},
                        {'name': '当日序号', 'col': 'serialNumber'},
                        {'name': '凭证字号', 'col': 'voucherGroupData'},
                        {'name': '凭证期间  ', 'col': 'voucherPeriodData'},
                        {'name': '凭证审核', 'col': 'audited'},
                        {'name': '过账标志', 'col': 'posted'},
                        {'name': '摘要', 'col': 'summary'},
                        {'name': '对方科目', 'col': 'tbasSubjectName'},
                        {'name': '借方金额', 'col': 'debitAmount', 'formatNub': true},
                        {'name': '贷方金额', 'col': 'creditAmount', 'formatNub': true},
                        {'name': '余额', 'col': 'balance', 'formatNub': true},
                        {'name': '经手人', 'col': 'handleName'},
                        {'name': '勾对', 'col': 'isTick'},
                        {'name': '勾对期间', 'col': 'tickTimeStr'},
                        {'name': '制单人', 'col': 'createName'},
                        {'name': '数据来源', 'col': 'dataSource'},
                        {'name': '备注', 'col': 'remark'},
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                };
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            } else {
                //固定多表头,多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';

                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">业务日期</th>
                        <th rowspan="2" style="width: 12%">日期</th>
                        <th rowspan="2" style="width: 12%">当日序号</th>
                        <th rowspan="2" style="width: 12%">凭证字号</th>
                        <th rowspan="2" style="width: 12%">凭证期间</th>
                        <th rowspan="2" style="width: 12%">凭证审核</th>
                        <th rowspan="2" style="width: 12%">过账标志</th>
                        <th rowspan="2" style="width: 12%">摘要</th>
                        <th rowspan="2" style="width: 12%">对方科目</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th colspan="2" style="width: 12%">余额</th>
                        <th rowspan="2" style="width: 6%">经手人</th>
                        <th rowspan="2" style="width: 6%">勾对</th>
                        <th rowspan="2" style="width: 6%">勾对时间</th>
                        <th rowspan="2" style="width: 6%">制单人</th>
                        <th rowspan="2" style="width: 6%">数据来源</th>
                        <th rowspan="2" style="width: 6%">备注</th>
                    </tr>
                     <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
                    </tr>
                `;

                _d.forEach(row => {
                    _tbody += `
                        <tr>
                            <td>${that._nullData(row.operateTimeStr)}</td>
                            <td>${that._nullData(row.dateTimeStr)}</td>
                            <td>${that._nullData(row.serialNumber)}</td>
                            <td>${that._nullData(row.voucherGroupData)}</td>
                            <td>${that._nullData(row.voucherPeriodData)}</td>
                            <td>${that._nullData(row.audited)}</td>
                            <td>${that._nullData(row.posted)}</td>
                            <td>${that._nullData(row.summary)}</td>
                            <td>${that._nullData(row.tbasSubjectName)}</td>
                            
                            <td>${that.formartMoney(row.debitAmountFor)}</td>
                            <td>${that.formartMoney(row.debitAmount)}</td>
                            <td>${that.formartMoney(row.creditAmountFor)}</td>
                            <td>${that.formartMoney(row.creditAmount)}</td>
                            <td>${that.formartMoney(row.balanceFor)}</td>
                            <td>${that.formartMoney(row.balance)}</td>
                            <td>${that._nullData(row.handleName)}</td>
                            <td>${that._nullData(row.isTick)}</td>
                            <td>${that._nullData(row.tickTimeStr)}</td>
                            <td>${that._nullData(row.createName)}</td>
                            <td>${that._nullData(row.dataSource)}</td>
                            <td>${that._nullData(row.remark)}</td>
                        </tr>
                    `;
                });

                let data = {
                    title: "银行存款日记账",
                    template: 12,
                    'titleInfo': [       // title
                        {'name': '科目', 'val': that.baseData.subjectName},
                        {'name': '账号', 'val': that.baseData.bankAccountNumber},
                        {'name': '币别', 'val': that.baseData.currencyName},
                        {'name': '期间', 'val': that.baseData.periodDate}
                    ],
                    'data': [],
                    'colMaxLenght': 10,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                };
                htPrint(data);
            }
        },

        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },

        formartMoney(value) {
            //格式化金额
            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
        },

        printModalShow(_t) {
            this.printModal = _t;
        },

        exit() {
            //退出,关闭当前页签
            var name = '付款单';
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        deleteBDJ() {
            //删除银行对账单
            let _vm = this;
            let arr = _vm.selected;
            if (arr == null || arr.length == 0) {
                _vm.$Message.error('请选择一条数据!');
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/cnbankdepositjournalappcontroller/deleteBDJ",
                data: {'ids': _vm.selected},
                success: function (ret) {
                    if (ret.code == '100100') {
                        vm.$Modal.success({
                            title:'提示信息',
                            scrollable:true,
                            content:ret.msg,
                        })
                        _vm.refresh();
                    } else {
                        vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:ret.msg,
                        })
                    }
                }
            })
        },
        closeSubjectWin() {
            this.addSubjectListOptClose();            
            this.addSubjectListOptShow = false;
        },
    },
    computed: {
        importTableList: function () {
            let arr = [];
            this.bankCurrencyList.forEach(item => {
                let obj = {
                    id: `${item.accountId}-${item.currencyId}`,
                    name: `${item.accountName} - ${item.currencyName}`
                }
                arr.push(obj)
            })

            return arr
        },
        addSubjectDisabled: function () {
            return this.addSubjectListOpt.length === 0
        },

    },
    watch: {
        'editData.debitAmountFor': function (oldVal, curValue) {
            vm.editData.debitAmount = (vm.editData.debitAmountFor * vm.editData.debitAmountForRate).toFixed(2);
        },
        'editData.creditAmountFor': function (oldVal, curValue) {
            vm.editData.creditAmount = (vm.editData.creditAmountFor * vm.editData.creditAmountForRate).toFixed(2);
        },
        'editData.debitAmountForRate': function (oldVal, curValue) {
            vm.editData.debitAmount = (vm.editData.debitAmountFor * vm.editData.debitAmountForRate).toFixed(2);
        },
        'editData.creditAmountForRate': function (oldVal, curValue) {
            vm.editData.creditAmount = (vm.editData.creditAmountFor * vm.editData.creditAmountForRate).toFixed(2);
        }
    },
})