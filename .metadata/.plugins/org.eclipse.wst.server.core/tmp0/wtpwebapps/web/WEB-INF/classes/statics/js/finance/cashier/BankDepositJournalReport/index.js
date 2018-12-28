new Vue({
    el: '#bank-depositjournal-report',
    data () {
        return {
            openTime: '',
            displayCurrencyType: '3',
            formData: {
                datePicker: (new Date()).format("yyyy-MM-dd"),
                queryDate: (new Date()).format("yyyy-MM-dd"),
                isDisplayDisabledSubject: false,
                isDisplayDetail: true,
                isDisplayCount: true,
                isDisplayTotal: true
            },
            filterVisible: false,
            base_config: {
                multiselect: true,
                mtype: 'POST',
                styleUI: 'Bootstrap',
                contentType: 'application/json;charset=utf-8',
                url: contextPath + '/bankDepositJournal/getBankDepositJournal',
                datatype: 'json',
                jsonReader: {
                    root: "data",
                    cell: "data",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 99999
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            printModal: false,
            printInfo: {},
        }
    },
    mounted () {
        this.initMethod();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            if (this.displayCurrencyType == '1') {   // 原币
                this.colNames = ["科目代码", "科目名称", "币别", "银行名称", "银行账号", "昨日余额", "今日借方", "今日贷方", "今日余额"];
                this.colModel = [
                    {
                        name: "subjectCode", width: 100,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return value;
                            }
                        }
                    },
                    { name: "subjectName", width: 150 },
                    { name: "currencyName", width: 80 },
                    { name: "bankName", width: 150 },
                    { name: "bankAccount", width: 150 },
                    {
                        name: "yesterdayBalanceFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "debitAmountFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "creditAmountFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "todayBalanceFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    }
                ];
                this.base_config.height = $(window).height() - 120;
                this.tableHeaders = [];
            } else if (this.displayCurrencyType == '2') {   // 本位币
                this.colNames = ["科目代码", "科目名称", "币别", "银行名称", "银行账号", "昨日余额", "今日借方", "今日贷方", "今日余额"];
                this.colModel = [
                    {
                        name: "subjectCode", width: 100,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return value;
                            }
                        }
                    },
                    { name: "subjectName", width: 150 },
                    { name: "currencyName", width: 80 },
                    { name: "bankName", width: 150 },
                    { name: "bankAccount", width: 150 },
                    {
                        name: "yesterdayBalance", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "debitAmount", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "creditAmount", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "todayBalance", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    }
                ];
                this.base_config.height = $(window).height() - 120;
                this.tableHeaders = [];
            } else if (this.displayCurrencyType == '3') {   // 原币和本位币
                this.colNames = ["科目代码", "科目名称", "币别", "银行名称", "银行账号", "原币", "本位币", "原币", "本位币", "原币", "本位币", "原币", "本位币"];
                this.colModel = [
                    {
                        name: "subjectCode", width: 100,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return value;
                            }
                        }
                    },
                    { name: "subjectName", width: 150 },
                    { name: "currencyName", width: 80 },
                    { name: "bankName", width: 150 },
                    { name: "bankAccount", width: 150 },
                    {
                        name: "yesterdayBalanceFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "yesterdayBalance", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "debitAmountFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "debitAmount", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "creditAmountFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "creditAmount", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "todayBalanceFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "todayBalance", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    }
                ];
                this.tableHeaders = [
                    { startColumnName: "yesterdayBalanceFor", numberOfColumns: 2, titleText: "昨日余额" },
                    { startColumnName: "debitAmountFor", numberOfColumns: 2, titleText: "今日借方" },
                    { startColumnName: "creditAmountFor", numberOfColumns: 2, titleText: "今日贷方" },
                    { startColumnName: "todayBalanceFor", numberOfColumns: 2, titleText: "今日余额" }
                ];
                this.base_config.height = $(window).height() - 160;
            } else {
                this.colNames = ["科目代码", "科目名称", "币别", "银行名称", "银行账号", "原币", "本位币", "原币", "本位币", "原币", "本位币", "原币", "本位币"];
                this.colModel = [
                    {
                        name: "subjectCode", width: 100,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return value;
                            }
                        }
                    },
                    { name: "subjectName", width: 150 },
                    { name: "currencyName", width: 80 },
                    { name: "bankName", width: 150 },
                    { name: "bankAccount", width: 150 },
                    {
                        name: "yesterdayBalanceFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "yesterdayBalance", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "debitAmountFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "debitAmount", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "creditAmountFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "creditAmount", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "todayBalanceFor", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    },
                    {
                        name: "todayBalance", width: 120,
                        formatter: function (value, grid, rows, state) {
                            if (value == null || value == 0) {
                                return '';
                            } else {
                                return accounting.formatNumber(value, 2, ",");
                            }
                        }
                    }
                ];
                this.tableHeaders = [
                    { startColumnName: "yesterdayBalanceFor", numberOfColumns: 2, titleText: "昨日余额" },
                    { startColumnName: "debitAmountFor", numberOfColumns: 2, titleText: "今日借方" },
                    { startColumnName: "creditAmountFor", numberOfColumns: 2, titleText: "今日贷方" },
                    { startColumnName: "todayBalanceFor", numberOfColumns: 2, titleText: "今日余额" }
                ];
                this.base_config.height = $(window).height() - 160;
            }

            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            var _vm = this;

            let config = Object.assign({}, _vm.base_config, {
                // postData: JSON.stringify(_vm.formData),
                postData: {
                    "queryDate": _vm.formData.queryDate,
                    "isDisplayDisabledSubject": _vm.formData.isDisplayDisabledSubject,
                    "isDisplayDetail": _vm.formData.isDisplayDetail,
                    "isDisplayCount": _vm.formData.isDisplayCount,
                    "isDisplayTotal": _vm.formData.isDisplayTotal
                },
                colNames: colNames,
                colModel: colModel,
                dataType: 'local',
                pager: '#page',
                loadComplete: function (ret) {
                    if (ret != null && ret.data != null) {
                        for (var index in ret.data) {
                            if (ret.data[index].yesterdayBalanceFor != null && ret.data[index].yesterdayBalanceFor != 0) {
                                ret.data[index].yesterdayBalanceFor = accounting.formatNumber(ret.data[index].yesterdayBalanceFor, 2, ",");
                            }

                            if (ret.data[index].yesterdayBalance != null && ret.data[index].yesterdayBalance != 0) {
                                ret.data[index].yesterdayBalance = accounting.formatNumber(ret.data[index].yesterdayBalance, 2, ",");
                            }

                            if (ret.data[index].debitAmountFor != null && ret.data[index].debitAmountFor != 0) {
                                ret.data[index].debitAmountFor = accounting.formatNumber(ret.data[index].debitAmountFor, 2, ",");
                            }

                            if (ret.data[index].debitAmount != null && ret.data[index].debitAmount != 0) {
                                ret.data[index].debitAmount = accounting.formatNumber(ret.data[index].debitAmount, 2, ",");
                            }

                            if (ret.data[index].creditAmountFor != null && ret.data[index].creditAmountFor != 0) {
                                ret.data[index].creditAmountFor = accounting.formatNumber(ret.data[index].creditAmountFor, 2, ",");
                            }

                            if (ret.data[index].creditAmount != null && ret.data[index].creditAmount != 0) {
                                ret.data[index].creditAmount = accounting.formatNumber(ret.data[index].creditAmount, 2, ",");
                            }

                            if (ret.data[index].todayBalanceFor != null && ret.data[index].todayBalanceFor != 0) {
                                ret.data[index].todayBalanceFor = accounting.formatNumber(ret.data[index].todayBalanceFor, 2, ",");
                            }

                            if (ret.data[index].todayBalance != null && ret.data[index].todayBalance != 0) {
                                ret.data[index].todayBalance = accounting.formatNumber(ret.data[index].todayBalance, 2, ",");
                            }
                        }
                    }

                    _vm.lodoPList = ret.data || [];
                    jQuery("#grid").jqGrid("destroyGroupHeader");
                    jQuery("#grid").jqGrid("setGroupHeaders", {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });

                    // 获取表格所有行数据
                    let rows = jQuery("#grid").jqGrid("getRowData");
                    var allCountID = $("#grid").jqGrid("getDataIDs");
                    rows.push($("#grid").jqGrid("getRowData", allCountID[allCountID.length - 1]));
                },
                gridComplete: function () {

                },
            });

            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () {
            this.query();
        },
        query () {
            if (this.formData.queryDate != null && this.formData.queryDate != '') {
                this.initMethod();
            }

            this.filterVisible = false;
        },
        exportData () {
            let _that = this;
            window.open(contextPath + "/bankDepositJournal/exportBankDepositJournal?queryDate=" + _that.formData.queryDate + "&displayCurrencyType=" + _that.displayCurrencyType + "&isDisplayDisabledSubject=" + _that.formData.isDisplayDisabledSubject + "&isDisplayDetail=" + _that.formData.isDisplayDetail + "&isDisplayCount=" + _that.formData.isDisplayCount + "&isDisplayTotal=" + _that.formData.isDisplayTotal);
        },
        print () {
            let that = this;
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }

            if (that.displayCurrencyType == '1') {
                // 单表头选择打印
                var _info = {
                    'title': '银行存款日报表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '日期', 'val': this.formData.queryDate },
                        { 'name': '币别', 'val': "显示原币" },
                        { 'name': '禁用科目', 'val': this.formData.isDisplayDisabledSubject == true ? "显示" : "不显示" },
                        { 'name': '明细科目', 'val': this.formData.isDisplayDetail == true ? "显示" : "不显示" },
                        { 'name': '币别小计', 'val': this.formData.isDisplayCount == true ? "显示" : "不显示" },
                        { 'name': '总计', 'val': this.formData.isDisplayTotal == true ? "显示" : "不显示" }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目代码', 'col': 'subjectCode' },
                        { 'name': '科目名称', 'col': 'subjectName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '银行名称', 'col': 'bankName' },
                        { 'name': '银行账号', 'col': 'bankAccount' },
                        { 'name': '昨日余额', 'col': 'yesterdayBalanceFor', 'formatNub': true, 'sum': true },
                        { 'name': '今日借方', 'col': 'debitAmountFor', 'formatNub': true, 'sum': true },
                        { 'name': '今日贷方', 'col': 'creditAmountFor', 'formatNub': true, 'sum': true },
                        { 'name': '今日余额', 'col': 'todayBalanceFor', 'formatNub': true, 'sum': true }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'totalRow': false,
                    'data': that.lodoPList,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            } else if (that.displayCurrencyType == '2') {
                // 单表头选择打印
                var _info = {
                    'title': '银行存款日报表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '日期', 'val': this.formData.queryDate },
                        { 'name': '币别', 'val': "显示本位币" },
                        { 'name': '禁用科目', 'val': this.formData.isDisplayDisabledSubject == true ? "显示" : "不显示" },
                        { 'name': '明细科目', 'val': this.formData.isDisplayDetail == true ? "显示" : "不显示" },
                        { 'name': '币别小计', 'val': this.formData.isDisplayCount == true ? "显示" : "不显示" },
                        { 'name': '总计', 'val': this.formData.isDisplayTotal == true ? "显示" : "不显示" }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目代码', 'col': 'subjectCode' },
                        { 'name': '科目名称', 'col': 'subjectName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '银行名称', 'col': 'bankName' },
                        { 'name': '银行账号', 'col': 'bankAccount' },
                        { 'name': '昨日余额', 'col': 'yesterdayBalance', 'formatNub': true, 'sum': true },
                        { 'name': '今日借方', 'col': 'debitAmount', 'formatNub': true, 'sum': true },
                        { 'name': '今日贷方', 'col': 'creditAmount', 'formatNub': true, 'sum': true },
                        { 'name': '今日余额', 'col': 'todayBalance', 'formatNub': true, 'sum': true }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'totalRow': false,
                    'data': that.lodoPList,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            } else {
                // 多表头固定打印
                var _d = that.lodoPList;
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 7%">科目代码</th>
                        <th rowspan="2" style="width: 7%">科目名称</th>
                        <th rowspan="2" style="width: 6%">币别</th>
                        <th rowspan="2" style="width: 7%">银行名称</th>
                        <th rowspan="2" style="width: 7%">银行账号</th>
                        <th colspan="2" style="width: 12%">昨日余额</th>
                        <th colspan="2" style="width: 12%">今日借方</th>
                        <th colspan="2" style="width: 12%">今日贷方</th>
                        <th colspan="2" style="width: 12%">今日余额</th>
                    </tr>
                    <tr class='thCs'>
                        <th style="width: 6%">原币</th>
                        <th style="width: 6%">本位币</th>
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
                            <td>${that._nullData(row.subjectCode)}</td>
                            <td>${that._nullData(row.subjectName)}</td>
                            <td>${that._nullData(row.currencyName)}</td>
                            <td>${that._nullData(row.bankName)}</td>
                            <td>${that._nullData(row.bankAccount)}</td>
                            <td>${that._nullData(row.yesterdayBalanceFor)}</td>
                            <td>${that._nullData(row.yesterdayBalance)}</td>
                            <td>${that._nullData(row.debitAmountFor)}</td>
                            <td>${that._nullData(row.debitAmount)}</td>
                            <td>${that._nullData(row.creditAmountFor)}</td>
                            <td>${that._nullData(row.creditAmount)}</td>
                            <td>${that._nullData(row.todayBalanceFor)}</td>
                            <td>${that._nullData(row.todayBalance)}</td>
                        </tr>
                    `;
                });

                /* if (_d.length === 0) {
                     _tfoot = `
                         <tr class="ht-foot">
                             <td>合计：</td>
                             ${'<td>/td>'.repeat(11)}
                         </tr>
                         `;
                 } else {
                     _tfoot = `
                         <tr class="ht-foot">
                             <td>合计：</td>
                             <td></td>
                             <td></td>
                             <td></td>
                             <td></td>
                             <td></td>
                             ${'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(6)}
                         </tr>
                         `;
                 }*/

                let data = {
                    title: "银行存款日报表",
                    template: 12,
                    'data': [],
                    'colMaxLenght': 12,
                    'titleInfo': [       // title
                        { 'name': '日期', 'val': this.formData.queryDate },
                        { 'name': '币别', 'val': "显示原币和本位币" },
                        { 'name': '禁用科目', 'val': this.formData.isDisplayDisabledSubject == true ? "显示" : "不显示" },
                        { 'name': '明细科目', 'val': this.formData.isDisplayDetail == true ? "显示" : "不显示" },
                        { 'name': '币别小计', 'val': this.formData.isDisplayCount == true ? "显示" : "不显示" },
                        { 'name': '总计', 'val': this.formData.isDisplayTotal == true ? "显示" : "不显示" }
                    ],
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }

                htPrint(data);
            }

            // 不带值正常打印,带值高级打印
            // htPrint(_info);
            // htPrint();
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        _nullData (_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        },
        //退出
        cancel () {
            this.filterVisible = false;

            // 关闭当前页签
            var name = '银行存款日报表';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },
        //打开取消
        cancelFilterVisible () {
            this.filterVisible = false;
        },
        dateChange (val) {
            console.log(val);
            let self = this;
            self.formData.queryDate = val;
        }
    },
})