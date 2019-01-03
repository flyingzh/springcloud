var ve = new Vue({
    el: '#bankStatement', //银行对账单
    data() {
        let that = this;
        return {
            seletedIds:[],
            importSelected: [], //获取引入弹框列表列的勾选数组的rowId
            sobId: "",
            openTime: '',
            filterVisible: false,
            subjectVisable: false,
            selectListId: [],
            subjectChangeAjax: '',
            baseData: {
                standardCurrencyId: 0,
                subjectName: '',
                bankAccountNumber: '',
                currencyName: '',
                periodDate: "",
                cnCurrentAccountYear: '',
                cnCurrentAccountPeriod: '',

            },
            openData: {
                sobId: "",
                subjectId: "",
                currencyId: "",
                type: 1,
                startDate: "",
                endDate: "",
                startYear: "",
                startPeriod: "",
                endYear: "",
                endPeriod: "",
                explains: "",
                createId: "", //制单人id
                startDebitFor: "",
                endDebitFor: "",
                startCreditFor: "",
                endCreditFor: "",
                isCheck: -1,
                showInitBalance: true,
                showDetailRecord: true,
                showDaySum: true,
                showPeriodSum: true,
                showYearSum: true,
                showTotalSum: true,
                subjectCode: "",
                subjectName: "",
                relateSubjectId: "",
                openCurrencyList: [],

                isCheckList: [  //
                    {id: -1, name: '全部'},
                    {id: 1, name: '未勾对'},
                    {id: 2, name: '已勾对'}
                ],

            },
            addData: {
                id: "",
                datetime: "",
                accountYear: "",
                accountPeriod: "",
                direction: "",
                subjectId: "",
                subjectCode: "",
                subjectName: "",
                currencyId: "",
                periodDate: '',
                summary: '',
                debitAmountFor: "",
                debitAmountForRate: "",
                debitAmount: "",
                creditAmountFor: "",
                creditAmountForRate: "",
                creditAmount: "",
                exchangeRate: 1,
                isTick: "",
                tickTime: "",
                dataSource: 0,
                isCarryOver: 0,
                remark: '',
                accountNumber: "",
            },
            editData: {
                id: "",
                datetime: "",
                accountYear: "",
                accountPeriod: "",
                direction: "",
                subjectId: "",
                subjectCode: "",
                subjectName: "",
                currencyId: "",
                periodDate: '',
                summary: '',
                debitAmountFor: "",
                debitAmountForRate: "",
                debitAmount: "",
                creditAmountFor: "",
                creditAmountForRate: "",
                creditAmount: "",
                exchangeRate: "",
                remark: '',
                accountNumber: "",
                editCurrencyList: [],
            },
            importData: {
                subjectId: '',
                currencyId: '',
                accountYear: '',
                accountPeriod: '',
                accountNumber: '',
                exchangeRate: '',
                fileList: [],
            },
            ClearImportData: {
                subjectId: '',
                currencyId: '',
                accountYear: '',
                accountPeriod: '',
                accountNumber: '',
                exchangeRate: '',
                fileList: [],
            },
            clearOpenData:{
                explains: "",
                createId: "", //制单人id
                startDebitFor: "",
                endDebitFor: "",
                startCreditFor: "",
                endCreditFor: "",
                isCheck: -1,
            },
            subjectList: [],
            periodList: [],
            periodYear: [],  //会计年度列表
            dataList: [],
            createrList: [],
            lodoPList: [],
            organisationList: [],
            printInfo:{},
            printModal:false,
            importModal: false,
            remarkVisable: false, // 摘要弹窗
            // 摘要列表
            remarklist: [],
            base_config: {
                multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/bankstatementappcontroller/bankStatementDetail',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                jsonReader: {
                    root: "data.resultVOs",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                viewrecords: true,
                rowNum: 999999999,
                beforeRequest: function () {
                    that.selectListId = [];
                },
                onCellSelect: function (rowid) {
                    let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                    console.log(rowData, "选中单行数据---------=>")

                },
                onSelectAll: function (aRowids, status) {  // 且点击头部的checkbox时才会触发此事件
                     that.handleSelectedIds(aRowids, status, "seletedIds");
                },
                onSelectRow: function (rowid, status) {  // 当选择行时触发此事件
                    // that.selectListId = [rowData.id];
                    //let rowData = jQuery("#list").jqGrid('getRowData', rowid); //获得当前行序号?
                    that.handleSelectedIds(rowid, status, "seletedIds");
                    console.log("当前选择的单个id===" + rowid);
                },
                ondblClickRow: function (rowid) {
                },
                gridComplete: function () {
                    $("table[id='list'] tr[id='null'] input").attr('style', 'display:none');
                    $("table[id='list'] tr[id='0'] input").attr('style', 'display:none');
                },
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            addVisible: false,
            addOrUpdateTitle: '',
        }
    },
    methods: {
        getImportId() {
            this.importData.importId = [];
            this.importSelected.map(item => {
                this.importData.importId.push(this.importTableList[item - 1].id)
            })
        },
        // 文摘弹窗
        clickDigest() {
            this.remarkVisable = true;
        },
        onDblclickRemarkRow(remark) {
            let that = this;
            that.openData.explains = remark.content;
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
        // 新增 , 修改  ， 删除
        detailAction(_t) {
            var _vm = this;
            if (_t === 'add') {
                //先清空之前的数据,并根据日期获取期间渲染
                Object.assign(_vm.editData, _vm.addData);
                _vm.bookDateChange(_vm.editData.datetime);

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
                            _vm.editData.editCurrencyList = result.data;
                            _vm.$nextTick(function () {
                                _vm.$refs.editCurrencyIdRef.reset();
                                if (!$.isEmptyObject(_vm.editData.editCurrencyList) && _vm.editData.editCurrencyList.length != 0) {
                                    $.each(_vm.editData.editCurrencyList, function (idx, ele) {
                                        if (_vm.openData.currencyId == ele.currencyId) {
                                            _vm.editData.debitAmountForRate = ele.exchangeRate;
                                            _vm.editData.creditAmountForRate = ele.exchangeRate;
                                            _vm.editData.currencyId = ele.currencyId;
                                            hasSameCurrency = true;
                                        }
                                    });

                                    if(!hasSameCurrency){
                                        console.log(hasSameCurrency,'hasSameCurrency');
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


                _vm.addVisible = true;
                _vm.addOrUpdateTitle = '银行对账单-新增';

            } else if (_t === 'edit') {
                /*点击页面修改按钮*/

                let arrId =_vm.seletedIds.filter(row => !!row);
                if (arrId.length != 1) {
                    _vm.$Message.warning({
                        content: '请只选择一条数据',
                        duration: 3,
                        closable: true
                    });
                    return;
                }

                //先清空之前的数据
                Object.assign(_vm.editData, _vm.addData);

                //发送异步请求,把返回的数据渲染到编辑页面,赋值的同时需要再发个同步请求获取币别列表

                /*                    if (result.code == '100100') {
                                        console.log("点击修改后获取数据----");
                                        console.log(result);
                                        let d = result.data;
                                        _vm.editData.sobId = d.sobId;
                                        _vm.editData.subjectId = d.subjectId;

                                        // _vm.$nextTick(function () {
                                        //     _vm.addSubjectChange(_vm.editData.subjectId);
                                        // });

                                        _vm.editData.accountPeriod = d.accountPeriod;
                                        _vm.editData.remark = d.remark;
                                        _vm.editData.datetime = d.datetime;
                                        _vm.editData.periodDate = d.accountYear +'年' + d.accountPeriod + '期';
                                        _vm.editData.id = d.id;
                                        _vm.editData.currencyId = d.currencyId;
                                        _vm.editData.direction = d.direction;
                                        _vm.editData.creditAmountFor = d.creditAmountFor;
                                        _vm.editData.summary = d.summary;
                                        _vm.editData.isCarryOver = d.isCarryOver;
                                        _vm.editData.accountYear = d.accountYear;
                                        _vm.editData.debitamount = d.debitamount;
                                        _vm.editData.debitAmountFor = d.debitAmountFor;
                                        _vm.editData.creditAmount = d.creditAmount;
                                        _vm.editData.exchangeRate = d.exchangeRate;
                                        //13条数据需要展示
                                        _vm.addVisible = true;
                                        _vm.addOrUpdateTitle = '银行对账单-修改';
                                    } else {
                                        _vm.$Message.error({
                                            content: result.msg,
                                            duration: 3,
                                            closable: true});
                                    }*/

                let tempFun2 = $.ajax({
                    type: 'post',
                    url: contextPath + "/bankstatementappcontroller/getObjectById",
                    data: {'id': arrId[0]},
                    dataType: 'json',
                });
                let d = {};
                let tempFun3 = tempFun2.then(function (result) {
                    console.log("银行对账单查看点击修改按钮返回的data: ---->");
                    console.log(result.data);
                    //在这里写tempFun2的成功函数代码块
                    if (result.code == '100100') {
                        d = result.data;
                        _vm.editData.sobId = d.sobId;
                        _vm.editData.subjectId = d.subjectId;
                    } else {
                        _vm.$Message.error({
                            content: result.msg,
                            duration: 3,
                            closable: true
                        });
                        return;
                    }

                    return $.ajax({
                        type: 'post',
                        url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                        data: {'subjectId': _vm.editData.subjectId}
                    });
                });

                tempFun3.done(function (resultForSubjctChange) {
                    //科目改变之后需要更新币别列表
                    _vm.editData.editCurrencyList = resultForSubjctChange.data;
                    //赋值剩余属性
                    _vm.editData.exchangeRate = d.exchangeRate;
                    _vm.editData.debitAmountForRate = d.exchangeRate;
                    _vm.editData.creditAmountForRate = d.exchangeRate;
                    _vm.editData.accountPeriod = d.accountPeriod;
                    _vm.editData.remark = d.remark;
                    _vm.editData.datetime = d.datetime;
                    _vm.editData.periodDate = d.accountYear + '年' + d.accountPeriod + '期';
                    _vm.editData.id = d.id;
                    _vm.editData.currencyId = d.currencyId;
                    _vm.editData.direction = d.direction;
                    _vm.editData.summary = d.summary;
                    _vm.editData.isCarryOver = d.isCarryOver;
                    _vm.editData.accountYear = d.accountYear;
                    _vm.editData.creditAmount = d.creditAmount;
                    _vm.editData.creditAmountFor = d.creditAmountFor;
                    _vm.editData.debitamount = d.debitamount;
                    _vm.editData.debitAmountFor = d.debitAmountFor;
                    _vm.editData.accountNumber = d.accountNumber;
                    _vm.editData.dataSource = d.dataSource;
                    //13条数据需要展示
                    _vm.addVisible = true;
                    _vm.addOrUpdateTitle = '银行对账单-修改';
                });


            } else if (_t === 'del') {
                /*点击页面删除按钮*/

            }
        },
        closeAddVisible() {
            this.addVisible = false;
        },
        //   引入
        importAction(_t) {
            this.importModal = _t;
        },
        // 科目下拉框
        showSubjectVisable() {
            this.subjectVisable = true;
        },
        subjectClose() {
            this.subjectVisable = false;
        },
        subjectData(treeNode) {
            console.log(treeNode, '====treeNode');
            this.openData.subjectId = treeNode.id;
            this.openData.subjectCode = treeNode.subjectCode;
            this.openData.subjectName = treeNode.subjectName;
            this.subjectClose();
            // vm.row.subjectLabel = treeNode.subjectName;
            // vm.row.subjectValue = treeNode.subjectCode.replace(/\./g, '');
            // vm.row.subject = vm.row.subjectValue + ' ' + vm.row.subjectLabel;
        },
        openSave() {
            let _vm = this;
            //打开操作,用户选定科目和币别之后,页面要展示name
            $.each(_vm.openData.openCurrencyList, function (idx, ele) {
                if (_vm.openData.currencyId === ele.currencyId) {
                    _vm.baseData.currencyName = ele.currencyName;
                    _vm.openData.currencyName = ele.currencyName;
                }
            });

            $.each(_vm.subjectList, function (idx, ele) {
                if (_vm.openData.subjectId === ele.accountId) {
                    _vm.baseData.subjectName = ele.accountName;
                    _vm.openData.subjectName = ele.accountName;
                    _vm.baseData.bankAccountNumber = ele.bankAccount;
                    _vm.openData.bankAccountNumber = ele.bankAccount;
                }
            });
            this.initMethod();
        },
        editSave() {
            //新增或者修改调用此方法
            let _vm = this;
            let data = _vm.editData;

            if (!!data.creditAmountForRate) {
                data.exchangeRate = data.creditAmountForRate;
            } else {
                data.exchangeRate = data.debitAmountForRate;
            }

            if (!data.summary) {
                _vm.$Message.error('摘要不能为空');
                return;
            }

            if (!data.debitAmountFor && !data.creditAmountFor) {
                _vm.$Message.error('请输入借方金额或贷方金额');
                return;
            }

            console.log("新增/修改时准备传回后台的参数 : ");

            console.log(data);
            $.ajax({
                type: 'post',
                url: contextPath + "/bankstatementappcontroller/saveOrUpdate",
                data: JSON.stringify(data),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        ve.$Modal.success({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
                        _vm.addVisible = false;
                        Object.assign(_vm.editData, _vm.addData);
                        _vm.initMethod();
                    } else {
                        ve.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:result.msg,
                        })
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
            this.filterVisible = false;
        },
        cancel(type) {
            switch (type) {
                case 'open':
                    Object.assign(this.openData,this.clearOpenData);
                    this.filterVisible = false;
                    break;
                case 'edit':
                    Object.assign(this.editData, this.addData);
                    this.addVisible = false;
                    break;
                case 'import':
                    Object.assign(this.importData, this.ClearImportData);
                    break;
                case 'voucher':
                    break;
                default:
                    break;
            }
            this.filterVisible = false;
        },
        outHtml() {
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        filterOpen(_type) {     // 打开
            this.filterVisible = _type;
        },
        // pageInit () {
        //     let that = this;
        //     var _url = rcContextPath + '/incomeCategory/queryListPage?r=' + new Date().getTime();
        //     jQuery("#list").jqGrid(
        //         {
        //             url: _url,
        //             postData: JSON.stringify(that.openData),
        //             ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
        //             datatype: "json",
        //             colNames: ['id', '日期', '摘要', '借方金额','贷方金额','余额','勾对','勾对时间','制单人','数据来源','备注'],
        //             height: '250',
        //             colModel: [
        //                 { name: 'id', width: 30, hidden: true },
        //                 { name: 'dateTimeStr', width: 100 },
        //                 { name: 'summary', width: 120, },
        //                 { name: 'debitAmountFor', width: 100, formatter: function (value, options, rowData) {
        //                     return value == null || value == 0 ? '' : value;
        //                 }},
        //                 { name: 'creditAmountFor', width: 100, formatter: function (value, options, rowData) {
        //                     return value == null || value == 0 ? '' : value;
        //                 }},
        //                 { name: 'balanceFor', width: 100,formatter: function (value, options, rowData) {
        //                     return value == null || value == 0 ? '' : value;
        //                 } },
        //                 { name: 'isTick', width: 90, align:'center',formatter:function(value,options,rowData) {
        //                     let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
        //                     return (value != null && value > 1 ) ? icon : '';
        //                 }},
        //                 { name: 'tickTimeStr', width: 90, },
        //                 { name: 'createName', width: 90, },
        //                 { name: 'dataSource', width: 150, formatter:function(value,options,rowData) {
        //                     if(value == 1){
        //                         return '总账引入';
        //                     }else if(value == 2){
        //                         return '手工录入';
        //                     }else if(value == 3){
        //                         return 'Excel导入';
        //                     }else{
        //                         return '';
        //                     }
        //                 }},
        //                 { name: 'remark', width: 90,}
        //             ],
        //             rowNum: 999999999,//一页显示多少条
        //             sortorder: "desc",//排序方式,可选desc,asc
        //             mtype: "post",//向后台请求数据的ajax的类型。可选post,get
        //             jsonReader: {
        //                 root: "data.list",
        //                 total: "data.totalPage",
        //                 records: "data.totalCount",
        //                 cell: "list",
        //             },
        //             sortable: false,
        //             // caption: '银行存款日记账',
        //             // hidegrid: false,
        //             multiselect: true,
        //             // rownumbers: true,
        //             styleUI: 'Bootstrap',
        //             height: $(window).height() - 200,
        //             viewrecords: true,
        //
        //         })
        // },
        //页面初始化
        initPage() {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/bankstatementappcontroller/initPage',
                dataType: 'json',
                data: null,
                success: function (result) {
                    if (result.code != '100100') {
                        let _msg = '页面初始化失败';
                        if (result.hasOwnProperty("data")){
                            _msg  = result.msg;
                        }
                        _vm.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:_msg,
                        })
                        return;
                    }
                    let dataInfo = result.data;
                    console.log(dataInfo);
                    console.log(dataInfo.initCurrencyList);
                    _vm.organisationList = dataInfo.org;
                    _vm.sobId = dataInfo.org[0].value;
                    _vm.baseData.standardCurrencyId = dataInfo.standardCurrencyId;
                    _vm.openData.openCurrencyList = dataInfo.initCurrencyList;
                    _vm.editData.editCurrencyList = dataInfo.initCurrencyList;
                    _vm.remarklist = dataInfo.voucherExpList;
                    _vm.subjectList = dataInfo.subjectList;
                    _vm.periodYear = dataInfo.periodYear;
                    _vm.periodList = dataInfo.monthList;
                    _vm.createrList = dataInfo.createrList;
                    if(!$.isEmptyObject(dataInfo.createrList) && dataInfo.createrList.length !=0){
                        _vm.openData.createId = dataInfo.createrList[0].createId;
                    }
                    _vm.baseData.cnCurrentAccountYear = dataInfo.cnCurrentAccountYear;
                    _vm.baseData.cnCurrentAccountPeriod = dataInfo.cnCurrentAccountPeriod;
                    if (!$.isEmptyObject(dataInfo.subjectList) && dataInfo.subjectList.length != 0) {
                        _vm.addData.subjectId = dataInfo.subjectList[0].accountId;
                        _vm.openData.subjectId = dataInfo.subjectList[0].accountId;
                        _vm.openData.subjectName = dataInfo.subjectList[0].accountName;
                        _vm.baseData.subjectName = dataInfo.subjectList[0].accountName;
                        _vm.baseData.bankAccountNumber = dataInfo.subjectList[0].bankAccount;
                        _vm.editData.accountNumber = dataInfo.subjectList[0].bankAccount;
                    }
                    if (!$.isEmptyObject(dataInfo.initCurrencyList) && dataInfo.initCurrencyList.length != 0) {
                        _vm.addData.currencyId = dataInfo.initCurrencyList[0].currencyId;
                        _vm.editData.currencyId = dataInfo.initCurrencyList[0].currencyId;
                        _vm.openData.currencyId = dataInfo.initCurrencyList[0].currencyId;
                        _vm.addData.debitAmountForRate = dataInfo.initCurrencyList[0].exchangeRate;
                        _vm.addData.creditAmountForRate = dataInfo.initCurrencyList[0].exchangeRate;
                        _vm.baseData.currencyName = dataInfo.initCurrencyList[0].currencyName;
                        _vm.openData.currencyName = dataInfo.initCurrencyList[0].currencyName;
                    }
                    //页面初始化时,要先用 新增时候的数据覆盖修改时的数据
                    Object.assign(_vm.editData, _vm.addData);
                    _vm.openData.startDate = dataInfo.startDate;

                    _vm.openData.endDate = dataInfo.endDate;
                    _vm.editData.datetime = dataInfo.endDate;
                    _vm.addData.datetime = dataInfo.endDate;
                    _vm.editData.periodDate = dataInfo.cnCurrentAccountYear + '年' + dataInfo.cnCurrentAccountPeriod + '期';
                    _vm.baseData.periodDate = dataInfo.cnCurrentAccountYear + '年' + dataInfo.cnCurrentAccountPeriod + '期';
                    _vm.openData.startYear = _vm.periodYear[0].value;
                    _vm.openData.endYear = _vm.periodYear[0].value;

                    //设置新增页面的初始值
                    _vm.editData.accountYear = dataInfo.cnCurrentAccountYear;
                    $.each(_vm.periodList, function (idx, ele) {
                        if (ele.name == dataInfo.cnCurrentAccountPeriod) {
                            _vm.openData.startPeriod = ele.name;
                            _vm.openData.endPeriod = ele.name;
                            _vm.editData.accountPeriod = ele.name;
                        }
                    });

                    //初始化值全部赋值完毕,执行一次查询
                    _vm.initMethod();
                    // _vm.importInit();
                }
            });
        },
        // 初始值
        initMethod() {
            let data = this.openData;
            if(data.type == 2){
                //按照日期筛选 startDate: "",  endDate: "",
                data.startDate = (new Date(data.startDate)).format("yyyy-MM-dd");
                data.startDate = (new Date(data.endDate)).format("yyyy-MM-dd");
            }
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader() {
            if (this.baseData.standardCurrencyId === this.openData.currencyId) {

                this.colNames = ['id', '日期', '摘要', '借方金额', '贷方金额', '余额', '勾对', '勾对时间', '制单人', '数据来源', '备注'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'dateTimeStr', width: 100},
                    {name: 'summary', width: 270,},
                    {
                        name: 'debitAmountFor', width: 120, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'creditAmountFor', width: 120, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'balanceFor', width: 120, formatter: function (value, grid, rows, state) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                    }
                    },
                    {
                        name: 'isTick', width: 90, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value > 1 ) ? icon : '';
                    }
                    },
                    {name: 'tickTime', width: 90,},
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
                    {name: 'remark', width: 140,}
                ],
                    this.tableHeaders = [];
                this.base_config.height = $(window).height() - 120;
            } else {
                this.colNames = ['id', '日期', '摘要', '原币', '本位币', '原币', '本位币', '原币', '本位币', '勾对', '勾对时间', '制单人', '数据来源', '备注'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'dateTimeStr', width: 100},
                    {name: 'summary', width: 180,},
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
                    {
                        name: 'isTick', width: 90, align: 'center', formatter: function (value, options, rowData) {
                        let icon = '<i class="ivu-icon ivu-icon-checkmark-round"></i>';
                        return (value != null && value > 1 ) ? icon : '';
                    }
                    },
                    {name: 'tickTime', width: 90,},
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
                    {name: 'remark', width: 90,}
                ],
                    this.tableHeaders = [
                        {startColumnName: 'debitAmountFor', numberOfColumns: 2, titleText: '借方金额'},
                        {startColumnName: 'creditAmountFor', numberOfColumns: 2, titleText: '贷方金额'},
                        {startColumnName: 'balanceFor', numberOfColumns: 2, titleText: '余额'}
                    ];
                this.base_config.height = $(window).height() - 160;
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        delTable() {
            $("#list").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="list"></table><div id="pager"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit(colNames, colModel, headers) {
            console.log(colNames, colModel, headers);
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.openData),
                loadComplete: function (xhr) {

                    if (xhr.code != '100100') {
                        ve.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:xhr.msg,
                        })
                        return;
                    }

                    _vm.dataList = xhr.data.resultVOs;
                    jQuery("#list").jqGrid('destroyGroupHeader');
                    jQuery("#list").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                    console.log(headers, 111);

                    //获取表格所有行数据
                    // let rows = jQuery("#grid").jqGrid('getRowData');
                    // var allCountID = $("#grid").jqGrid('getDataIDs');
                    //rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    _vm.lodoPList = xhr.data || [];
                    _vm.baseData.periodDate = xhr.data.queryPeriod;
                },
            });
            jQuery("#list").jqGrid(config);
        },
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
                            if(_vm.openData.openCurrencyList){
                                _vm.openData.currencyId = _vm.openData.openCurrencyList[0].currencyId;
                            }
                        });
                    } else {
                        ve.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:"请求错误!",
                        })
                    }
                }
            });
        },
        addSubjectChange(item) {
            let _vm = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/subjectChange',
                data: {'subjectId': item},
                success: function (result) {
                    if (result.code === '100100') {
                        _vm.editData.editCurrencyList = result.data;
                        _vm.$refs.editCurrencyIdRef.reset();
                        _vm.$nextTick(function () {
                            if(_vm.editData.editCurrencyList.length > 0){
                                _vm.editData.currencyId = _vm.editData.editCurrencyList[0].currencyId;
                            }
                        });
                    } else {
                        ve.$Modal.error({
                            title:'提示信息',
                            scrollable:true,
                            content:"请求错误!",
                        })
                    }
                }
            });
            $.each(_vm.subjectList, function (idx, ele) {
                if (item == ele.accountId) {
                    _vm.editData.accountNumber = ele.bankAccount;
                }
            })
        },
        bookDateChange(item) {
            let _vm = this;
            let currentDate = (new Date(item)).format("yyyy-MM-dd");
            let pDate = {'currentDate': currentDate, 'currencyId': _vm.editData.currencyId};
            $.ajax({
                type: 'post',
                url: contextPath + '/cnbankdepositjournalappcontroller/getPeriodByDate',
                data: pDate,
                success: function (result) {
                    if (result.code === '100100') {
                        console.log(result);
                        _vm.editData.periodDate = result.data.year + '年' + result.data.month + '期';
                        _vm.editData.accountYear = result.data.year;
                        _vm.editData.accountPeriod = result.data.month;
                    } else {
                        _vm.$Message.error({
                            content: result.msg,
                            duration: 3,
                            closable: true
                        });
                    }
                }
            });
        },
        currencyChange(item) {
            let _vm = this;
            $.each(_vm.editData.editCurrencyList, function (idx, ele) {
                if (item === ele.currencyId) {
                    _vm.editData.debitAmountForRate = ele.exchangeRate;
                    _vm.editData.creditAmountForRate = ele.exchangeRate;
                    _vm.editData.exchangeRate = ele.exchangeRate;
                } else {
                    _vm.editData.debitAmountForRate = 1;
                    _vm.editData.creditAmountForRate = 1;
                    _vm.editData.exchangeRate = 1;
                }
            });
        },
        deleteBDJ() {
            //删除银行对账单
            let _vm = this;
            let arr = _vm.seletedIds;
            if (arr == null || arr.length == 0) {
                _vm.$Message.error('请选择一条数据!');
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/bankstatementappcontroller/deleteBS",
                data: {'ids': arr},
                success: function (ret) {
                    if (ret.code == '100100') {

                        _vm.$Message.success({
                            content: ret.msg,
                            duration: 3,
                            closable: true
                        });
                        _vm.refresh();
                    } else {
                        _vm.$Message.error({
                            content: ret.msg,
                            duration: 3,
                            closable: true
                        });
                    }
                }
            })
        },
        refresh() {
            //刷新页面
            this.openSave();
        },
        exportExcel() {
            //引出,导出到excel表
            let data = this.openData;
            let bd = this.baseData;
            let _url = contextPath + "/bankstatementappcontroller/exportExcel?sobId=" + data.sobId + "&subjectId=" + data.subjectId +
                "&currencyId=" + data.currencyId +
                "&type=" + data.type +
                "&startDate=" + data.startDate +
                "&endDate=" + data.endDate +
                "&startYear=" + data.startYear +
                "&startPeriod=" + data.startPeriod +
                "&endYear=" + data.endYear +
                "&endPeriod=" + data.endPeriod +
                "&explains=" + data.explains +
                "&createId=" + data.createId +
                "&startDebitFor=" + data.startDebitFor +
                "&endDebitFor=" + data.endDebitFor +
                "&startCreditFor=" + data.startCreditFor +
                "&endCreditFor=" + data.endCreditFor +
                "&isCheck=" + data.isCheck +
                "&showInitBalance=" + data.showInitBalance +
                "&showDetailRecord=" + data.showDetailRecord +
                "&showDaySum=" + data.showDaySum +
                "&showPeriodSum=" + data.showPeriodSum +
                "&showYearSum=" + data.showYearSum +
                "&subjectName=" + bd.subjectName +
                "&bankAccountNumber=" + bd.bankAccountNumber +
                "&currencyName=" + bd.currencyName +
                "&periodDate=" + bd.periodDate +
                "&showTotalSum=" + data.showTotalSum;
            console.log(_url);
            window.open(_url);
        },
        downloadf() {
            //下载 引入格式
            let _url = contextPath + "/bankstatementappcontroller/downLoadFormatter?sobId=" + 0;
            window.open(_url);
        },
        importsave(_info) {
            let _vm = this;
            console.log("点击引入,查看_info:--->");
            console.log(_info);

            $.ajax({
                type: 'post',
                url: contextPath + "/bankstatementappcontroller/importSave",
                data: JSON.stringify(_info),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: function (result) {
                    if (result.code == '100100') {
                        _vm.$Message.success({
                            content: '从excel表引入数据成功!',
                            duration: 3,
                            closable: true
                        });
                        _vm.refresh();
                    } else {
                        _vm.$Message.error({
                            content: result.msg,
                            duration: 3,
                            closable: true
                        });
                    }
                }
            });
            Object.assign(this.importData, this.ClearImportData);
        },
        printV() {
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

            //遍历结果集,把勾对的"√",以及数据源的str形式, 展示出来
            $.each(that.dataList, function (idx, ele) {
                ele.isTick = ele.isTick == 2 ? '√' : '';
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
                    'title': '银行对账单',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        {'name': '科目', 'val': that.baseData.subjectName},
                        {'name': '账号', 'val': that.baseData.bankAccountNumber},
                        {'name': '币别', 'val': that.baseData.currencyName},
                        {'name': '期间', 'val': that.baseData.periodDate}
                    ],
                    'colNames': [       // 列名与对应字段名
                        {'name': '日期', 'col': 'dateTimeStr'},
                        {'name': '摘要', 'col': 'summary'},
                        {'name': '借方金额', 'col': 'debitAmount', 'formatNub': true},
                        {'name': '贷方金额  ', 'col': 'creditAmount', 'formatNub': true},
                        {'name': '余额', 'col': 'balance', 'formatNub': true},
                        {'name': '过账标志', 'col': 'posted'},
                        {'name': '摘要', 'col': 'summary'},
                        {'name': '勾对', 'col': 'isTick'},
                        {'name': '勾对时间', 'col': 'tickTime'},
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
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 12%">摘要</th>
                        <th colspan="2" style="width: 12%">借方金额</th>
                        <th colspan="2" style="width: 12%">贷方金额</th>
                        <th colspan="2" style="width: 12%">余额</th>
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
                            <td>${that._nullData(row.dateTimeStr)}</td>
                            <td>${that._nullData(row.summary)}</td>
                            <td>${that.formartMoney(row.debitAmountFor)}</td>
                            <td>${that.formartMoney(row.debitAmount)}</td>
                            <td>${that.formartMoney(row.creditAmountFor)}</td>
                            <td>${that.formartMoney(row.creditAmount)}</td>
                            <td>${that.formartMoney(row.balanceFor)}</td>
                            <td>${that.formartMoney(row.balance)}</td>
                            <td>${that._nullData(row.isTick)}</td>
                            <td>${that._nullData(row.tickTime)}</td>
                            <td>${that._nullData(row.createName)}</td>
                            <td>${that._nullData(row.dataSource)}</td>
                            <td>${that._nullData(row.remark)}</td>
                        </tr>
                    `;
                });

                let data = {
                    title: "银行对账单",
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
        closeWindow() {
            //退出,关闭当前页签
            var name = '银行对账单';
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        handleSelectedIds(data, status, type) {
            let _vm = this;
            if (typeof data === 'object' && status) {
                _vm[type] = data.filter(row=>{
                    if (row !='null' && row !='0'){
                        return row;
                    }
                });
            }
            if (typeof data === 'object' && !status) {
                _vm[type] = [];
            }
            if (typeof data === 'string') {
                if (status) {
                    let flag = (data !='null' && data !='0');
                    if (flag){
                        (_vm[type].indexOf(data.toString()) > -1) ? null : _vm[type].push(data.toString());
                    }
                } else {
                    let index = _vm[type].indexOf(data.toString());
                    index > -1 ? _vm[type].splice(index, 1) : null;
                }
            }
            console.log("当前选择的idList: seletedIds[] ===");
            console.log(_vm.seletedIds);
        },
    },
    mounted() {
        this.initPage();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    watch: {

        'editData.debitAmountFor': function (oldVal, curValue) {
            this.editData.debitAmount = (this.editData.debitAmountFor * this.editData.debitAmountForRate).toFixed(2);
        },
        'editData.creditAmountFor': function (oldVal, curValue) {
            this.editData.creditAmount = (this.editData.creditAmountFor * this.editData.creditAmountForRate).toFixed(2);
        },
        'editData.debitAmountForRate': function (oldVal, curValue) {
            this.editData.debitAmount = (this.editData.debitAmountFor * this.editData.debitAmountForRate).toFixed(2);
        },
        'editData.creditAmountForRate': function (oldVal, curValue) {
            this.editData.creditAmount = (this.editData.creditAmountFor * this.editData.creditAmountForRate).toFixed(2);
        }
    },
});