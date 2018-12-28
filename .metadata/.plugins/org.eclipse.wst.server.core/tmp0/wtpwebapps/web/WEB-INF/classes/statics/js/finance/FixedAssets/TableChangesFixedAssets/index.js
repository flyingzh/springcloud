new Vue({
    el: '#tableChangesFixedAssets',
    data () {
        return {
            currencyType: "",
            formData: {
                currencyType: '2',
                currencyName: '',
                dateStr: '',
                dateType: '1',
                sPeriodYear: '',
                sPeriodMonth: '',
                ePeriodYear: '',
                ePeriodMonth: '',
                sDate: '',
                eDate: '',
                date1: '',
                date2: '',
                isStatus: true,
                isDetailSubject: true,
                isSmallPlan: false,
                isTotal: false,
                openTime: ''
            },
            periodYear: [],
            periodList: [],
            filterVisible: true,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/app/cashPositionTable/list',
                // ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                // postData: JSON.stringify(This.feeScheduleVO),
                jsonReader: {
                    root: "data",
                    cell: "list",
                    // userdata: "data.userData",
                    repeatitems: false
                },
                viewrecords: true,
                rowNum: 99999,
                shrinkToFit: false
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            organisationList: [
                { label: "金大祥", value: 1 },
                { label: "金大祥1", value: 2 },
                { label: "金大祥2", value: 3 },
            ],
            baseData: {
                standardCurrencyId: 1,
            },
            printModal: false,
            printInfo: {},
            dataList: []
        }
    },
    created: function () {
        var _vm = this;
        _vm.openTime = window.parent.params && window.parent.params.openTime;
    },
    mounted () {
        this.initData();
        this.initMethod();
    },
    methods: {
        getLastDay (y, m) {//根据年月获取当月最后一天
            var dt = new Date(y, m, 1);
            var cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            return cdt.getFullYear() + "-" + (Number(cdt.getMonth()) + 1) + "-" + cdt.getDate();
        },
        operateDate (date) {
            return new Date(date).format("yyyy-MM-dd");
        },
        initData () {  //初始化日期数据
            let that = this;
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/app/cashPositionTable/initData',
                success: function (result) {
                    var data = result.data;
                    if (data != null) {
                        that.periodYear = data.yearList;
                        that.periodList = data.monthList;
                        that.formData.sPeriodYear = data.currentYear;   //默认选中当前会计年度
                        that.formData.sPeriodMonth = data.currentMonth;
                        that.formData.ePeriodYear = data.currentYear;
                        that.formData.ePeriodMonth = data.currentMonth;
                        that.formData.date1 = data.currentYear + '-' + data.currentMonth + '-01'; //开始日期
                        that.formData.date2 = that.getLastDay(data.currentYear, data.currentMonth);  //结束日期
                    }
                }
            });
        },

        queryParams () {  //查询参数
            var dateType = this.formData.dateType;
            if (dateType == '1') {
                this.formData.sDate = this.formData.sPeriodYear + '-' + this.formData.sPeriodMonth;
                this.formData.eDate = this.formData.ePeriodYear + '-' + this.formData.ePeriodMonth;
                var sPeriodYear = this.formData.sPeriodYear;
                var ePeriodYear = this.formData.ePeriodYear;
                var sPeriodMonth = this.formData.sPeriodMonth;
                var ePeriodMonth = this.formData.ePeriodMonth;
                var dateStr = sPeriodYear + '年' + sPeriodMonth + '期' + '至' + ePeriodYear + '年' + ePeriodMonth + '期';
                if (sPeriodYear == ePeriodYear && sPeriodMonth == ePeriodMonth) {
                    dateStr = sPeriodYear + '年' + sPeriodMonth + '期';
                }
                this.formData.dateStr = dateStr;
            }
            if (dateType == '2') {
                var sDate = this.operateDate(this.formData.date1);
                var eDate = this.operateDate(this.formData.date2);
                this.formData.sDate = sDate;
                this.formData.eDate = eDate;
                var dateStr = sDate + '至' + eDate;
                if (sDate == eDate) {
                    dateStr = sDate;
                }
                this.formData.dateStr = dateStr;
            }
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader () {
            var currencyType = this.formData.currencyType;
            this.colNames = ['id', '科目代码', '科目名称', '币别', '银行名称', '银行账号', '期初余额', '借方发生额', '贷方发生额', '期末余额', '借方笔数', '贷方笔数', '启用', '科目类别'];
            this.colModel = [
                { name: 'id', width: 30, hidden: true, frozen: true },
                { name: 'accountCode', width: 100, frozen: true },
                { name: 'accountName', width: 150, frozen: true },
                { name: 'currencyName', width: 80, frozen: true },
                { name: 'bankName', width: 150, },
                { name: 'bankAccount', width: 150 },
                { name: 'initBalanceFor', width: 120, },
                { name: 'debitAmountFor', width: 120, },
                { name: 'creditAmountFor', width: 120, },
                { name: 'endBalanceFor', width: 120, },
                { name: 'debitNumber', width: 120, },
                { name: 'creditNumber', width: 120, },
                { name: 'statusName', width: 120 },
                { name: 'isCashName', width: 120 }
            ];
            this.base_config.height = $(window).height() - 100;
            this.tableHeaders = [];
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
            //jQuery("#grid").jqGrid('setFrozenColumns');
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit (colNames, colModel, headers) {
            let _vm = this;
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                loadComplete: function (ret) {
                    _vm.dataList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                },
                gridComplete: function () {
                    //  var rows=$("#grid").jqGrid("getRowData");
                    //  $('#null').find("td").addClass("SelectBG");
                    var rows = jQuery("#grid").jqGrid('getRowData');
                    var allCountID = $("#grid").jqGrid('getDataIDs');
                    rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]))
                    var accountName = '';
                    for (var i = 0; i < rows.length; i++) {
                        accountName = rows[i].accountName;
                        if (accountName == '小计') {
                            $('#' + rows[i].id).find("td").addClass("xjClass");
                        }
                        if (accountName == '总计') {
                            $('#' + rows[i].id).find("td").addClass("totalClass");
                        }
                    }
                    console.log(rows);
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open () {
            this.filterVisible = true;
        },
        refresh () { //刷新
            $("#grid").jqGrid('setGridParam', { postData: this.formData }).trigger("reloadGrid");
        },
        save () {
            this.filterVisible = false;
            this.queryParams();
            this.base_config.url = contextPath + '/app/cashPositionTable/list';
            this.base_config.postData = this.formData;
            this.initMethod();
        },
        cancel () {
            this.filterVisible = false;
        },
        exportExcel () {
            let _this = this;
            window.open(contextPath + '/app/cashPositionTable/exportExcel?currencyType=' + _this.currencyType + '&dateStr=' + _this.formData.dateStr, '数据引出');
        },
        exitPrevent () {
            window.parent.closeCurrentTab({ name: '资金头寸表', openTime: this.openTime, exit: true })
        },
        print () {  //打印
            let that = this;
            var _info;
            if (!that.dataList || !that.dataList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            var currencyType = that.formData.currencyType;
            if (currencyType == '1') {  //原币
                //单行表头
                _info = {
                    'title': '资金头寸表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目代码', 'col': 'accountCode' },
                        { 'name': '科目名称', 'col': 'accountName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '银行名称', 'col': 'bankName' },
                        { 'name': '银行账号', 'col': 'bankAccount' },
                        { 'name': '期初余额', 'col': 'initBalanceFor' },
                        { 'name': '借方发生额', 'col': 'debitAmountFor' },
                        { 'name': '贷方发生额', 'col': 'creditAmountFor' },
                        { 'name': '期末余额', 'col': 'endBalanceFor' },
                        { 'name': '借方笔数', 'col': 'debitNumber' },
                        { 'name': '贷方笔数', 'col': 'creditNumber' },
                        { 'name': '启用', 'col': 'statusName' },
                        { 'name': '科目类别', 'col': 'isCashName' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 13,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                    'totalRow': false
                }
            }

            if (currencyType == '2') {  //本位币
                //单行表头
                _info = {
                    'title': '资金头寸表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '科目代码', 'col': 'accountCode' },
                        { 'name': '科目名称', 'col': 'accountName' },
                        { 'name': '币别', 'col': 'currencyName' },
                        { 'name': '银行名称', 'col': 'bankName' },
                        { 'name': '银行账号', 'col': 'bankAccount' },
                        { 'name': '期初余额', 'col': 'initBalance' },
                        { 'name': '借方发生额', 'col': 'debitAmount' },
                        { 'name': '贷方发生额', 'col': 'creditAmount' },
                        { 'name': '期末余额', 'col': 'endBalance' },
                        { 'name': '借方笔数', 'col': 'debitNumber' },
                        { 'name': '贷方笔数', 'col': 'creditNumber' },
                        { 'name': '启用', 'col': 'statusName' },
                        { 'name': '科目类别', 'col': 'isCashName' }
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 13,  // 显示最大长度， 默认为7
                    'data': that.dataList,  // 打印数据  list
                    'totalRow': false
                }
            }
            if (currencyType == '3') { //原币和本位币
                //固定多表头 // 多表头固定打印
                var _d = that.dataList;
                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">科目代码</th>
                        <th rowspan="2" style="width: 6%">科目名称</th>
                        <th rowspan="2" style="width: 6%">币别</th>
                        <th rowspan="2" style="width: 6%">银行名称</th>
                         <th rowspan="2" style="width: 6%">银行账号</th>
                        <th colspan="2" style="width: 12%">期初余额</th>
                        <th colspan="2" style="width: 12%">借方发生额</th>
                         <th colspan="2" style="width: 12%">贷方发生额</th>
                        <th colspan="2" style="width: 12%">期末余额</th>
                        <th rowspan="2" style="width: 6%">借方笔数</th>
                        <th rowspan="2" style="width: 6%">贷方笔数</th>
                        <th rowspan="2" style="width: 6%">启用</th>
                        <th rowspan="2" style="width: 6%">科目类别</th>
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
                        <td>${that.nullValue(row.accountCode)}</td>
                        <td>${that.nullValue(row.accountName)}</td>
                        <td>${that.nullValue(row.currencyName)}</td>
                        <td>${that.nullValue(row.bankName)}</td>
                        <td>${that.nullValue(row.bankAccount)}</td>
                        <td>${that.nullValue(row.initBalanceFor)}</td>
                         <td>${that.nullValue(row.initBalance)}</td>
                        <td>${that.nullValue(row.debitAmountFor)}</td>
                        <td>${that.nullValue(row.debitAmount)}</td>
                        <td>${that.nullValue(row.creditAmountFor)}</td>
                         <td>${that.nullValue(row.creditAmount)}</td>
                          <td>${that.nullValue(row.endBalanceFor)}</td>
                           <td>${that.nullValue(row.endBalance)}</td>
                            <td>${that.nullValue(row.debitNumber)}</td>
                             <td>${that.nullValue(row.creditNumber)}</td>
                             <td>${that.nullValue(row.statusName)}</td>
                             <td>${that.nullValue(row.isCashName)}</td>
                        </tr>
                    `;
                });
                var data = {
                    title: "资金头寸表",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '币别', 'val': that.formData.currencyName },
                        { 'name': '期间', 'val': that.formData.dateStr }
                    ],
                    'colMaxLenght': 25,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
                return;
            }
            // 弹窗选择列 模式
            that.printInfo = _info;
            that.printModalShow(true);
        },
        printModalShow (_t) {
            this.printModal = _t;
        },
        nullValue (exp) {  //设置空
            if (exp == null || typeof (exp) == "undefined" || exp == 0) {
                return '';
            }
            return exp;
        }
    },
})