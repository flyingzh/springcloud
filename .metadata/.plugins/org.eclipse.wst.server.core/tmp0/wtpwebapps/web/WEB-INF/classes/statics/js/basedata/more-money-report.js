function Post(URL, PARAMTERS) {
    //创建form表单
    var temp_form = document.createElement("form");
    temp_form.action = URL;
    //如需打开新窗口，form的target属性要设置为'_blank'
    temp_form.target = "_blank";
    temp_form.method = "post";
    temp_form.style.display = "none";
    //添加参数
    for (var item in PARAMTERS) {
        var opt = document.createElement("textarea");
        opt.name = PARAMTERS[item].name;
        opt.value = PARAMTERS[item].value;
        temp_form.appendChild(opt);
    }
    document.body.appendChild(temp_form);
    //提交数据
    temp_form.submit();
}
var vm = new Vue({
    el: '#more-money-report',
    data() {
        var that = this;
        return {
            standardMoneyId: '',
            beginAccountName: '',
            endAccountName: '',
            isInit1: true,
            isInit2: true,
            showFilter: false,
            subjectVisiable: false,
            visible_filter: false,
            showTable_USD: false,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            currencys: [],
            currency: '',
            subject_period_starts: [],
            subject_period_ends: [],
            subject_period_start: '',
            subject_period_end: '',
            period_starts: '',
            period_ends: '',
            startDefault: '',
            endDefault: '',
            search: {
                beginAccountYear: '',
                endAccountYear: '',
                beginAccountPeriod: '',
                endAccountPeriod: '',
                beginAccountCode: '',
                endAccountCode: '',
                beginAccountRank: 1,
                endAccountRank: 9,
                currencyId: 0,
                showAssistAccount: true,
                notShowWhileBalanceIsZero: '',
                notShowWhileNoHappenAndBalanceIsZero: '',
                unBill: false,

                // subject_start: '',
                // subject_end: '',
                // subject_leave_start: '',
                // subject_leave_end: '',
                // showSupport: '',
                // currency: '',
                // noShow: '',
                // noShowAndHappen: ''
            },




            lodoPList: [],

            openTime: '',
            subjectEnd: false,
            subjectList: [
                {name: '2018第一期', value: 1},
                {name: '2018第二期', value: 2}
            ],
            base_config:{
                treeGrid: true,
                treeGridModel: 'adjacency', //treeGrid模式，跟json元数据有关 ,adjacency/nested
                ExpandColumn: 'accountCode',
                scroll: "true",
                styleUI: 'Bootstrap',
                url: contextPath+'/tfinancebalance/list',


                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                // url: './moreMoneyReport2.json',
                datatype: 'json',
                jsonReader: {
                    root: "data.list",
                    total: "data.totalPage",
                    records: "data.totalCount",
                    cell: "list",
                    repeatitems: false
                },
                treeReader: {
                    level_field: "level",
                    parent_id_field: "accountPid",
                    leaf_field: "leaf",
                    expanded_field: "expanded"
                },
                viewrecords: true,
                // rowNum: 10,
                // rowList: [10, 20, 30, 40],
                // caption: "科目余额表",
                mtype: "POST"
            },

        }
    },
    methods: {
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="my_report"></table><div id="my_pager"></div>`).appendTo(parent);
        },

        // 生成jqGrid
        jqGridInit(colNames,colModel,headers) {
            var that = this;
            let config = Object.assign({}, that.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(that.search),

                loadComplete: function (xhr) {
                    jQuery("#my_report").jqGrid('destroyGroupHeader');
                    jQuery("#my_report").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                    vm.lodoPList = xhr.data.list || [];

                    // //获取表格所有行数据
                    // let rows = jQuery("#grid").jqGrid('getRowData');
                    // var allCountID = $("#grid").jqGrid('getDataIDs');
                    // rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                },
                gridComplete: function () {
                    // if(that.filter.currencyOption == 1) {
                    //     that.currencyTitle = '原币';
                    // }else if (that.filter.currencyOption == 2) {
                    //     that.currencyTitle = '本位币';
                    // }else {
                    //     that.currencyTitle = '原币和本位币';
                    // }
                    // that.dateTitle = (new Date(that.filter.dateStr)).format("yyyy-MM-dd");
                },

            });
            jQuery("#my_report").jqGrid(config);
        },
        setTableHeader() {
            var That = this;

            if(this.search.currencyId == 0 || this.search.currencyId == this.standardMoneyId){
                this.colNames = ['科目编码', '科目名称', '借方', '贷方', '借方', '贷方', '借方', '贷方', '借方', '贷方'];

                this.colModel = [
                    {
                        name: 'accountCode', index: 'accountCode', width: 110, sortable: false,
                        formatter: function (value, grid, rows, state) {
                            var _v =value.replace(/\./g, '');
                            let cssId = "#detail" + _v;
                            $(document).off('click', cssId).on('click', cssId, function () {
                                console.log('tetstes')
                                That.checkDetail({value, grid, rows, state})
                            });
                            let myCode = `<a id="detail${_v}" data-code="${value}">${value}</a>`;
                            console.log("start to log...........");
                            console.log(value, grid, rows, state);
                            return myCode;
                        }
                    },
                    // {
                    //     name: 'accountCode', index: 'accountCode', width: 110, sortable: false,
                    //     formatter: function (value, grid, rows, state) {
                    //         let cssClass = ".detail" + value;
                    //         $(document).off('click', cssClass).on('click', cssClass, function () {
                    //             That.checkDetail({value, grid, rows, state})
                    //         });
                    //         let myCode = `<a class="detail${value}">${value}</a>`;
                    //         console.log("start to log...........");
                    //         console.log(value, grid, rows, state);
                    //         return myCode;
                    //     }
                    // },
                    // {name: 'accountCode', index: 'accountCode', width: 110, sortable: false},
                    {name: 'accountName', index: 'accountName', width: 80, sortable: false},
                    {name: 'beginBalanceDebit', index: 'beginBalanceDebit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.beginBalanceDebit == null ? "" : accounting.formatNumber(rows.beginBalanceDebit,2);
                        }
                    },
                    {name: 'beginBalanceCredit', index: 'beginBalanceCredit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.beginBalanceCredit == null ? "" : accounting.formatNumber(rows.beginBalanceCredit,2);
                        }
                    },
                    {name: 'debit', index: 'debit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'credit', index: 'credit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdDebit', index: 'ytdDebit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdCredit', index: 'ytdCredit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalanceDebit', index: 'endBalanceDebit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.endBalanceDebit == null ? "" : accounting.formatNumber(rows.endBalanceDebit,2);
                        }
                    },
                    {name: 'endBalanceCredit', index: 'endBalanceCredit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.endBalanceCredit == null ? "" : accounting.formatNumber(rows.endBalanceCredit,2);
                        }
                    }
                ];
                this.base_config.height = $(window).height() - 120;
                this.tableHeaders = [
                    { startColumnName: 'beginBalanceDebit', numberOfColumns: 2, titleText: '期初余额'},
                    { startColumnName: 'debit', numberOfColumns: 2, titleText: '本期发生额'},
                    { startColumnName: 'ytdDebit', numberOfColumns: 2, titleText: '本年累计发生额'},
                    { startColumnName: 'endBalanceDebit', numberOfColumns: 2, titleText: '期末余额'}
                ];
            } else {
                this.colNames = ['科目编码', '科目名称', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)','借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)'];
                this.colModel = [
                    {
                        name: 'accountCode', index: 'accountCode', width: 110, sortable: false,
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                That.checkDetail({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            console.log(value, grid, rows, state);
                            return myCode;
                        }
                    },
                    // {name: 'accountCode', index: 'username', width: 110, sortable: false},
                    {name: 'accountName', index: 'accountName', width: 80, sortable: false},
                    {name: 'beginBalanceForDebit', index: 'beginBalanceForDebit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.beginBalanceForDebit == null ? "" : accounting.formatNumber(rows.beginBalanceForDebit,2);
                        }
                    },
                    {name: 'beginBalanceDebit', index: 'beginBalanceDebit', width: 80, formatter: "currency",
                        formatter: function (value, grid, rows, state) {
                            return rows.beginBalanceDebit == null ? "" : accounting.formatNumber(rows.beginBalanceDebit,2);
                        }
                    },
                    {name: 'beginBalanceForCredit', index: 'beginBalanceForCredit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.beginBalanceForCredit == null ? "" : accounting.formatNumber(rows.beginBalanceForCredit,2);
                        }
                    },
                    {name: 'beginBalanceCredit', index: 'beginBalanceCredit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.beginBalanceCredit == null ? "" : accounting.formatNumber(rows.beginBalanceCredit,2);
                        }
                    },
                    {name: 'debitFor', index: 'debitFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'debit', index: 'debit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'creditFor', index: 'creditFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'credit', index: 'credit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdDebitFor', index: 'ytdDebitFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdDebit', index: 'ytdDebit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdCreditFor', index: 'ytdCreditFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdCredit', index: 'ytdCredit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalanceForDebit', index: 'endBalanceForDebit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.endBalanceForDebit == null ? "" : accounting.formatNumber(rows.endBalanceForDebit,2);
                        }
                    },
                    {name: 'endBalanceDebit', index: 'endBalanceDebit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.endBalanceDebit == null ? "" : accounting.formatNumber(rows.endBalanceDebit,2);
                        }
                    },
                    {name: 'endBalanceForCredit', index: 'endBalanceForCredit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.endBalanceForCredit == null ? "" : accounting.formatNumber(rows.endBalanceForCredit,2);
                        }
                    },

                    {name: 'endBalanceCredit', index: 'endBalanceCredit', width: 80,
                        formatter: function (value, grid, rows, state) {
                            return rows.endBalanceCredit == null ? "" : accounting.formatNumber(rows.endBalanceCredit,2);
                        }
                    }
                ];
                this.base_config.height = $(window).height() - 120;
                this.tableHeaders = [
                    { startColumnName: 'beginBalanceForDebit', numberOfColumns: 4, titleText: '期初余额'},
                    { startColumnName: 'debitFor', numberOfColumns: 4, titleText: '本期发生额'},
                    { startColumnName: 'ytdDebitFor', numberOfColumns: 4, titleText: '本年累计发生额'},
                    { startColumnName: 'endBalanceForDebit', numberOfColumns: 4, titleText: '期末余额'}
                ];
            }
            this.jqGridInit(this.colNames,this.colModel,this.tableHeaders);
        },

        getColSum(pre,name) {
            let rs = $(`td[aria-describedby='${pre}_${name}']`);
            let sum = 0;
            // if (rs.children("div.sumCol").length !== 0) {
            //     rs = $(`td[aria-describedby='list_${name}']`).children("div.sumCol")
            // } else {
            //     rs = $(`td[aria-describedby='list_${name}']:not(:last)`)
            // }
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000;
            })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        completeMethod() {
            // $("#list").footerData('set', {
            //     "auditStatus": '合计',
            //     'amountPaymentReceivedFors': [0],
            //     'amountPaymentReceived': [0]
            // });




        },
        jqGridInit1() {
            let That = this;

            let config = Object.assign({},this.base_config,{
                colNames: ['科目编码', '科目名称', '借方', '贷方', '借方', '贷方', '借方', '贷方', '借方', '贷方'],
                colModel: [
                    {
                        name: 'accountCode', index: 'accountCode', width: 110, sortable: false,
                        formatter: function (value, grid, rows, state) {
                            var _v =value.replace(/\./g, '');
                            let cssId = "#detail" + _v;
                            $(document).off('click', cssId).on('click', cssId, function () {
                                console.log('tetstes')
                                That.checkDetail({value, grid, rows, state})
                            });
                            let myCode = `<a id="detail${_v}" data-code="${value}">${value}</a>`;
                            console.log("start to log...........");
                            console.log(value, grid, rows, state);
                            return myCode;
                        }
                    },
                    // {
                    //     name: 'accountCode', index: 'accountCode', width: 110, sortable: false,
                    //     formatter: function (value, grid, rows, state) {
                    //         let cssClass = ".detail" + value;
                    //         $(document).off('click', cssClass).on('click', cssClass, function () {
                    //             That.checkDetail({value, grid, rows, state})
                    //         });
                    //         let myCode = `<a class="detail${value}">${value}</a>`;
                    //         console.log("start to log...........");
                    //         console.log(value, grid, rows, state);
                    //         return myCode;
                    //     }
                    // },
                    // {name: 'accountCode', index: 'accountCode', width: 110, sortable: false},
                    {name: 'accountName', index: 'accountName', width: 80, sortable: false},
                    {name: 'beginBalance', index: 'beginBalance', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.direction === 2) {
                                rows.beginBalance2 = rows.beginBalance;
                                rows.beginBalance = "";
                            }
                            return rows.beginBalance == null ? "" : accounting.formatNumber(rows.beginBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}},
                    {name: 'beginBalance2', index: 'beginBalance', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'debit', index: 'debit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'credit', index: 'credit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdDebit', index: 'ytdDebit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdCredit', index: 'ytdCredit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalance', index: 'endBalance', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.direction === 2) {
                                rows.endBalance2 = rows.endBalance;
                                rows.endBalance = "";
                            }
                            return rows.beginBalance == null ? "" : accounting.formatNumber(rows.beginBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalance2', index: 'endBalance', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}}
                ],
                postData: JSON.stringify(That.search),
                pager: '#my_pager',
                footerrow: false,
                gridComplete() {
                    jQuery("#my_report").jqGrid('destroyGroupHeader');
                    jQuery("#my_report").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: [
                            {startColumnName: 'beginBalance', numberOfColumns: 2, titleText: '期初余额'},
                            {startColumnName: 'debit', numberOfColumns: 2, titleText: '本期发生额'},
                            {startColumnName: 'ytdDebit', numberOfColumns: 2, titleText: '本年累计发生额'},
                            {startColumnName: 'endBalance', numberOfColumns: 2, titleText: '期末余额'}
                        ]
                    });
                    if (That.isInit1) {



                    }else {
                        That.showTable_USD = false;
                    }
                    var total = $("#my_report").jqGrid('getGridParam', 'records');
                    if(total > 0) {

                    }

                    That.isInit1 = false;
                },
                loadComplete (xhr) { // 非表格数据
                    console.log(xhr, '===========xhr=');
                    vm.lodoPList = xhr.data.list || [];

                }
            });
            jQuery("#my_report").jqGrid(config);
        },
        jqGridInit2() {
            let That = this;
            let config = Object.assign({},this.base_config,{
                colNames: ['科目编码', '科目名称', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)','借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)', '借方(原币)', '借方(本位币)', '贷方(原币)', '贷方(本位币)'],
                colModel: [
                    {
                        name: 'accountCode', index: 'accountCode', width: 110, sortable: false,
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                That.checkDetail({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            console.log(value, grid, rows, state);
                            return myCode;
                        }
                    },
                    // {name: 'accountCode', index: 'username', width: 110, sortable: false},
                    {name: 'accountName', index: 'accountName', width: 80, sortable: false},
                    {name: 'beginBalanceFor', index: 'beginBalanceFor', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.direction === 2) {
                                rows.beginBalanceFor2 = rows.beginBalanceFor;
                                rows.beginBalanceFor = "";
                            }
                            return rows.beginBalanceFor == null ? '' : accounting.formatNumber(rows.beginBalanceFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}},
                    {name: 'beginBalanceFor2', index: 'beginBalanceFor2', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'beginBalance', index: 'beginBalance', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.direction === 2) {
                                rows.beginBalance2 = rows.beginBalance;
                                rows.beginBalance = "";
                            }
                            return rows.beginBalance == null ? '' : accounting.formatNumber(rows.beginBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}},
                    {name: 'beginBalance2', index: 'beginBalance2', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'debitFor', index: 'debitFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'debit', index: 'debit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'creditFor', index: 'creditFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'credit', index: 'credit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdDebitFor', index: 'ytdDebitFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdDebit', index: 'ytdDebit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdCreditFor', index: 'ytdCreditFor', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'ytdCredit', index: 'ytdCredit', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalanceFor', index: 'endBalanceFor', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.direction === 2) {
                                rows.endBalanceFor2 = rows.endBalanceFor;
                                rows.endBalanceFor = "";
                            }
                            return rows.endBalanceFor == null ? '' : accounting.formatNumber(rows.endBalanceFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalanceFor2', index: 'endBalanceFor2', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalance', index: 'endBalance', width: 80,
                        formatter: function (value, grid, rows, state) {
                            if (rows.direction === 2) {
                                rows.endBalance2 = rows.endBalance;
                                rows.endBalance = "";
                            }
                            return rows.endBalance == null ? '' : accounting.formatNumber(rows.endBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}},
                    {name: 'endBalance2', index: 'endBalance2', width: 80, formatter: "currency", formatoptions: {decimalSeparator:"."}}
                ],
                postData: JSON.stringify(That.search),
                pager: '#my_pager2',
                footerrow: false,
                userDataOnFooter: true,
                gridComplete() {
                    jQuery("#my_report2").jqGrid('destroyGroupHeader');
                    jQuery("#my_report2").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: [
                            {startColumnName: 'beginBalanceFor', numberOfColumns: 4, titleText: '期初余额'},
                            {startColumnName: 'debitFor', numberOfColumns: 4, titleText: '本期发生额'},
                            {startColumnName: 'ytdDebitFor', numberOfColumns: 4, titleText: '本年累计发生额'},
                            {startColumnName: 'endBalanceFor', numberOfColumns: 4, titleText: '期末余额'}
                        ]
                    });
                    if (That.isInit2) {


                    }else {
                        That.showTable_USD = true;
                    }

                    That.isInit2 = false;

                },
                loadComplete (xhr) { // 非表格数据
                    console.log("服务器已返回数据");
                    console.log(xhr, '===========xhr=');
                    vm.lodoPList = xhr.data.list || [];


                }
            });
            jQuery("#my_report2").jqGrid(config);
        },
        handleOpen() {
            this.visible_filter = true;
        },
        detailClick(data) {

        },
        iconPopup(type) {
            this.subjectEnd = type == true ? true : false;
            this.subjectVisiable = true;
        },
        //关闭选择科目弹窗
        subjectClose() {
            this.subjectVisiable = false;
        },
        confirmCancel() {
            this.confirmConfig.showConfirm = false;
        },
        confirmSure() {
            this.confirmConfig.showConfirm = false;
            this.confirmConfig.onlySure = !this.confirmConfig.onlySure;
        },
        //点击保存，获取所选科目id
        subjectDate(res) {
            if(!res.isEnd){
                this.search.beginAccountCode = res.name.split(' ')[0];
                this.beginAccountName = res.name;
            }else {
                this.search.endAccountCode = res.name.split(' ')[0];
                this.endAccountName = res.name;
            }
            console.log(res);
        },
        sure(type) {
            // alert("开始"+this.search.subject_leave_start);
            // alert("结束"+this.search.subject_leave_end);
            // alert("选择的币别：" + this.currency);
            // alert("选择的开始会计期间："+this.search.subject_period_start);
            // alert("选择的结束会计期间：" + this.search.subject_period_end);
            // alert(this.search.showSupport);
            // alert(this.search.noShow);
            // alert(this.search.noShowAndHappen);
            if(type) {
                var That = this;
                this.search.beginAccountYear = this.startDefault.split(",")[0];
                this.search.beginAccountPeriod = this.startDefault.split(",")[1];
                this.search.endAccountYear = this.endDefault.split(",")[0];
                this.search.endAccountPeriod = this.endDefault.split(",")[1];
                this.search.showAssistAccount = this.search.showAssistAccount || false;

                this.search.notShowWhileBalanceIsZero = this.search.notShowWhileBalanceIsZero || false;
                this.search.notShowWhileNoHappenAndBalanceIsZero = this.search.notShowWhileNoHappenAndBalanceIsZero || false;
                this.search.unBill = this.search.unBill || false;

                // if(!type){
                //     return;
                // }
                this.visible_filter = false;
                //alert("this.search.currency == null:"+(this.search.currency == null));
                //alert("this.search" + this.search);
                this.initMethod();
                // if(this.search.currencyId == null || this.search.currencyId == ''){
                //     $("#my_report1").jqGrid('setGridParam',{ postData: JSON.stringify(That.search)}).trigger("reloadGrid");
                //
                // }else {
                //     this.showTable_USD = !this.showTable_USD;
                //     $("#my_report2").jqGrid('setGridParam',{ postData: JSON.stringify(That.search)}).trigger("reloadGrid");
                //
                // }
            }else {
                this.visible_filter = false;
            }


        },
        listAccountPeriod() {
            let That = this;
            $.ajax({
                url: contextPath+"/tfinancebalance/listaccountperiod",
                type: "POST",
                dataType: "JSON",
                async: false,
                success: function (data) {
                    That.subject_period_starts=data;
                    That.subject_period_ends=data;

                    That.startDefault = data[data.length-1].accountingYear + ',' + data[data.length-1].accountingPeriod;
                    That.endDefault = data[data.length-1].accountingYear + ',' + data[data.length-1].accountingPeriod;

                    That.search.beginAccountYear = data[data.length-1].accountingYear;
                    That.search.endAccountYear = data[data.length-1].accountingYear;
                    That.search.beginAccountPeriod = data[data.length-1].accountingPeriod;
                    That.search.endAccountPeriod = data[data.length-1].accountingPeriod;
                }
            });
        },
        bibie() {
            let That = this;
            $.ajax({
                url: contextPath+"/tfinancebalance/listcurrency",
                type: "POST",
                dataType: "JSON",
                success: function (data) {
                    That.currencys = data.data;
                }
            });
        },

        //获取综合本位币币别id
        getStandardMoneyId() {
            let That = this;
            $.ajax({
                url: contextPath + "/tfinancebalance/getstandardmoneyid",
                type: "post",
                dataType: "json",
                success: function (data) {
                    That.standardMoneyId = data.data;

                }
            });
        },
        refresh() {
            window.location.reload();
            // if(this.showTable_USD){
            //     $('my_report2').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
            // }else{
            //     $('my_report1').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
            // }

        },
        checkDetail(data) {
            console.log(data);
            var subjectCode = data.value;
            // var id = data.rows.id;
            // let lineData = jQuery('#list').jqGrid('getRowData', id);
            // // var id = lineData.id;
            // // vm.repertoryPosition.code = lineData.code;
            // var str = lineData.code;
            //
            // var regex = /<a.*?>(.*?)<\/a>/ig;
            // var result = regex.exec(str);

            var parames = new Array();
            parames.push({ name: "subjectCode", value: subjectCode});

            // Post(contextPath+"/detail-account/detail-account.html", parames);

            let url = contextPath+'/finance/detail-account/detail-account.html?subjectCode='+subjectCode;
            window.parent.activeEvent({name: '查看明细账', url: url, params: null});
            return false;
        },
        exporting(c) {
            // var filters = $("#my_report1").jqGrid("getGridParam", "postData").filters;

            if(c == 0){
                $('#export_form1')[0].submit();
            }else{
                $('#export_form2')[0].submit();
            }


        },
        quit() {

            window.parent.closeCurrentTab({ name: "科目余额表", openTime: this.openTime, exit: true });
        },
        print () {
            // htPrint();
            if (!vm.lodoPList || !vm.lodoPList.length) {
                vm.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            console.log(vm.lodoPList);

            var _d = vm.lodoPList;
            var _thead = '', _tbody = '', _tfoot = '';
            if(this.search.currencyId){
                _thead = `
                <tr class='thCs'>
                    <th rowspan="2" style="width: 10%">科目编码</th>
                    <th rowspan="2" style="width: 18%">科目名称</th>
                    <th colspan="4">期初余额</th>
                    <th colspan="4">本期发生额</th>
                    <th colspan="4">本年累计发生额</th>
                    <th colspan="4">期末余额</th>
                </tr>
                <tr class='thCs'>
                    
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    
                </tr>
            `;

                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.accountCode}</td>
                        <td>${row.accountName}</td>
                        <td>${row.beginBalanceForDebit==null?"":row.beginBalanceForDebit}</td>
                        <td>${row.beginBalanceDebit==null?"":row.beginBalanceDebit}</td>
                        <td>${row.beginBalanceForCredit==null?"":row.beginBalanceForCredit}</td>
                        <td>${row.beginBalanceCredit==null?"":row.beginBalanceCredit}</td>
                        <td>${row.debitFor}</td>
                        <td>${row.debit}</td>
                        <td>${row.creditFor}</td>
                        <td>${row.credit}</td>
                        <td>${row.ytdDebitFor}</td>
                        <td>${row.ytdDebit}</td>
                        <td>${row.ytdCreditFor}</td>
                        <td>${row.ytdCredit}</td>
                        <td>${row.endBalanceForDebit==null?"":row.endBalanceForDebit}</td>
                        <td>${row.endBalanceDebit==null?"":row.endBalanceDebit}</td>
                        <td>${row.endBalanceForCredit==null?"":row.endBalanceForCredit}</td>
                        <td>${row.endBalanceCredit==null?"":row.endBalanceCredit}</td>
                    </tr>
                `;
                });
            }else {
                _thead = `
                <tr class='thCs'>
                    <th rowspan="2" style="width: 10%">科目编码</th>
                    <th rowspan="2" style="width: 18%">科目名称</th>
                    <th colspan="2">期初余额</th>
                    <th colspan="2">本期发生额</th>
                    <th colspan="2">本年累计发生额</th>
                    <th colspan="2">期末余额</th>
                </tr>
                <tr class='thCs'>
                    
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    <th style="width: 9%">借方</th>
                    <th style="width: 9%">贷方</th>
                    
                </tr>
            `;

                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.accountCode}</td>
                        <td>${row.accountName}</td>
                        <td>${row.beginBalanceDebit==null?"":row.beginBalanceDebit}</td>
                        <td>${row.beginBalanceCredit==null?"":row.beginBalanceCredit}</td>
                        <td>${row.debit}</td>
                        <td>${row.credit}</td>
                        <td>${row.ytdDebit}</td>
                        <td>${row.ytdCredit}</td>
                        <td>${row.endBalanceDebit==null?"":row.endBalanceDebit}</td>
                        <td>${row.endBalanceCredit==null?"":row.endBalanceCredit}</td>
                    </tr>
                `;
                });
            }


            if (_d.length === 0) {
                _tfoot = `
                    <tr class="ht-foot">
                        <td></td>
                        <td>合计：</td>
                        ${'<td>/td>'.repeat(6)}
                    </tr>
                    `;
            } else {
                _tfoot = `
                    <tr class="ht-foot">
                        <td></td>
                        <td>合计：</td>
                        ${'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(6)}
                    </tr>
                    `;
            }
            var account_period = vm.startDefault.split(",")[0] + '年' + vm.startDefault.split(",")[1] + '期-' + vm.endDefault.split(",")[0] + '年' + vm.endDefault.split(",")[1] + '期';
            var title = [];
            title.push({
                name: '',
                val: '金大祥集团'
            });
            title.push({
                name: '',
                val: account_period
            });
            title.push({
                name: '单位',
                val: '元'
            });

            let data = {
                title: "科目余额表",
                template: 12,
                'titleInfo': title,
                'data': [],
                'colMaxLenght': 10,
                'tbodyInfo': {
                    'theadTX': _thead,
                    'tbodyTX': _tbody
                    // 'tfootTX': _tfoot
                },
                totalRow: false

            }
            htPrint(data);
        },



    },
    mounted() {
        this.getStandardMoneyId();
        this.listAccountPeriod();
        this.bibie();

        // this.jqGridInit1();
        // this.jqGridInit2();
        this.initMethod();
        this.openTime = window.parent.params && window.parent.params.openTime;

    }
});

