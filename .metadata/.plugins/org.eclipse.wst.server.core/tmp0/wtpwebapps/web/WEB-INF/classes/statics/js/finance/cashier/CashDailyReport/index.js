new Vue({
    el: '#cash-daily-report',
    data() {
        var that = this;
        return {

            currentYear: 0,     //当前会计期间年
            currentMonth: 0,       //当前会计期间
            currentLastDay: 0,     //当前会计期间的最后一天
            currencyTitle: '原币和本位币',
            dateTitle: '',
            filter: {
                currencyOption: 3,
                dateStr: '',
                showDetail: true,
                showSubtotal: true,
                showTotal: true
            },
            formData: {
                for1: '',
                for2: '3',
                for3: '',
                for4: '',
                for5: '',
                for6: '',
            },
            filterVisible: false,
            base_config: {


                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + "/cashdailyreport/report",
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',


                jsonReader: {
                    root: "data",
                    cell: "data",
                    // userdata: "data.userData",
                    repeatitems: true
                },

                viewrecords: true
                // rowNum: 99999,
            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            organisationList: [
                {label: "金大祥", value: 1},
                {label: "金大祥1", value: 2},
                {label: "金大祥2", value: 3},
            ],
            baseData: {
                standardCurrencyId: 1,
            },

            printModal: false,
            printInfo: {},
            lodoPList: []
        }
    },
    mounted() {

        this.getYear();
        this.getMonth();
        this.lastday();
        this.filter.dateStr = "" + this.currentYear + "-" + (this.currentMonth) + "-" + this.currentLastDay;
        // alert(this.filter.dateStr);
        this.initMethod();
        this.openTime = window.parent.params && window.parent.params.openTime;

    },
    methods: {

        getYear() {
            var that = this;
            $.ajax({
                url: contextPath+'/bankdepositstatement/year',
                type: 'post',
                dataType: 'json',
                async: false,
                success: function (data) {
                    that.currentYear = data.data;
                }
            });
        },

        getMonth() {
            var that = this;
            $.ajax({
                url: contextPath+'/bankdepositstatement/month',
                type: 'post',
                dataType: 'json',
                async: false,
                success: function (data) {
                    that.currentMonth = data.data;
                }
            });
        },
        getLastDay(y, m) {
            var dt = new Date(y, m, 1);
            cdt = new Date(dt.getTime() - 1000 * 60 * 60 * 24);
            // alert(cdt.getFullYear() + "年" + (Number(cdt.getMonth()) + 1) + "月的最后一天是:" + cdt.getDate() + "日");

            return cdt.getDate();
        },
        lastday(){
            var that = this;

            that.currentLastDay = that.getLastDay(that.currentYear, that.currentMonth);
        },
        // 初始值
        initMethod () {
            this.delTable();
            this.setTableHeader();
        },
        setTableHeader() {
            if(this.filter.currencyOption == 1){
                this.colNames = ['id', '科目代码', '科目名称', '币别', '昨日余额', '今日借方', '今日贷方', '今日余额'];
                this.colModel = [
                    {name: 'id', index:'id', width: 30, hidden: true},
                    {name: 'subjectCode', index:'subjectCode', width: 100},
                    {name: 'subjectName', index:'subjectName', width: 150},
                    {name: 'currencyName', index: 'currencyName', width: 80},
                    {name: 'yesterdayBalanceFor', index:'yesterdayBalanceFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.yesterdayBalanceFor == null ? '' : accounting.formatNumber(rows.yesterdayBalanceFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayDebitFor', index:'todayDebitFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayDebitFor == null ? '' : accounting.formatNumber(rows.todayDebitFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayCreditFor', index: 'todayCreditFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayCreditFor == null ? '' : accounting.formatNumber(rows.todayCreditFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayBalanceFor', index:'todayBalanceFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayBalanceFor == null ? '' : accounting.formatNumber(rows.todayBalanceFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    }
                ];
                this.base_config.height = $(window).height() - 120;
                this.tableHeaders = [];
            } else if (this.filter.currencyOption == 2) {
                this.colNames = ['id', '科目代码', '科目名称', '币别', '昨日余额', '今日借方', '今日贷方', '今日余额'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'subjectCode', width: 100},
                    {name: 'subjectName', width: 150},
                    {name: 'currencyName', width: 80},
                    {name: 'yesterdayBalance', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.yesterdayBalance == null ? '' : accounting.formatNumber(rows.yesterdayBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayDebit', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayDebit == null ? '' : accounting.formatNumber(rows.todayDebit,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayCredit', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayCredit == null ? '' : accounting.formatNumber(rows.todayCredit,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayBalance', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayBalance == null ? '' : accounting.formatNumber(rows.todayBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    }
                ];
                this.base_config.height = $(window).height() - 120;
                this.tableHeaders = [];
            } else {
                this.colNames = ['id', '科目代码', '科目名称', '币别', '原币', '本位币', '原币', '本位币', '原币', '本位币', '原币', '本位币'];
                this.colModel = [
                    {name: 'id', width: 30, hidden: true},
                    {name: 'subjectCode', width: 100},
                    {name: 'subjectName', width: 150},
                    {name: 'currencyName', width: 80,},
                    {name: 'yesterdayBalanceFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.yesterdayBalanceFor == null ? '' : accounting.formatNumber(rows.yesterdayBalanceFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'yesterdayBalance', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.yesterdayBalance == null ? '' : accounting.formatNumber(rows.yesterdayBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayDebitFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayDebitFor == null ? '' : accounting.formatNumber(rows.todayDebitFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayDebit', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayDebit == null ? '' : accounting.formatNumber(rows.todayDebit,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayCreditFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayCreditFor == null ? '' : accounting.formatNumber(rows.todayCreditFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayCredit', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayCredit == null ? '' : accounting.formatNumber(rows.todayCredit,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayBalanceFor', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayBalanceFor == null ? '' : accounting.formatNumber(rows.todayBalanceFor,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    },
                    {name: 'todayBalance', width: 120,
                        formatter: function (value, grid, rows, state) {
                            return rows.todayBalance == null ? '' : accounting.formatNumber(rows.todayBalance,2);
                        },
                        formatoptions: {decimalSeparator:"."}
                    }
                ];
                this.tableHeaders = [
                    { startColumnName: 'yesterdayBalanceFor', numberOfColumns: 2, titleText: '昨日余额'},
                    { startColumnName: 'todayDebitFor', numberOfColumns: 2, titleText: '今日借方'},
                    { startColumnName: 'todayCreditFor', numberOfColumns: 2, titleText: '今日贷方'},
                    { startColumnName: 'todayBalanceFor', numberOfColumns: 2, titleText: '今日余额'}
                ];
                this.base_config.height = $(window).height() - 170;
            }
            this.jqGridInit(this.colNames,this.colModel,this.tableHeaders);
        },
        delTable () {
            $("#grid").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="grid"></table><div id="page"></div>`).appendTo(parent);
        },
        // 生成jqGrid
        jqGridInit(colNames,colModel,headers) {
            this.filter.dateStr = (new Date(this.filter.dateStr)).format("yyyy-MM-dd HH:mm:ss");
            var that = this;
            let config = Object.assign({}, this.base_config, {
                rowNum: -1,
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(that.filter),
                loadComplete: function (xhr) {
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });
                    console.log(xhr, '===========xhr=');
                    that.lodoPList = xhr.data || [];

                    // //获取表格所有行数据
                    // let rows = jQuery("#grid").jqGrid('getRowData');
                    // var allCountID = $("#grid").jqGrid('getDataIDs');
                    // rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                },
                gridComplete: function () {
                    if(that.filter.currencyOption == 1) {
                        that.currencyTitle = '原币';
                    }else if (that.filter.currencyOption == 2) {
                        that.currencyTitle = '本位币';
                    }else {
                        that.currencyTitle = '原币和本位币';
                    }
                    that.dateTitle = (new Date(that.filter.dateStr)).format("yyyy-MM-dd");
                },

            });
            jQuery("#grid").jqGrid(config);
        },
        open() {
            this.filterVisible = true;
        },
        refresh() {
            this.initMethod();
        },
        save() {
            this.filterVisible = false;
            this.initMethod();
        },
        cancel() {
            this.filterVisible = false;
        },
        exporting() {
            $('#export_form')[0].submit();
        },
        quit() {
            window.parent.closeCurrentTab({ openTime: this.openTime, exit: true });
        },
        print () {
            var that = this;
            //console.log("打印")
            // window.print();
            // printJS('paymentReceiptTimeBook', 'html');
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }

            var _thead = '', _tbody = '', _tfoot = '';
            var _d = that.lodoPList;
            if(that.filter.currencyOption == 3){
                _thead = `
                <tr class='thCs'>
                    <th rowspan="2" style="width: 10%">科目代码</th>
                    <th rowspan="2" style="width: 18%">科目名称</th>
                    <th rowspan="2" style="width: 18%">币别</th>
                    <th colspan="2">昨日余额</th>
                    <th colspan="2">今日借方</th>
                    <th colspan="2">今日贷方</th>
                    <th colspan="2">今日余额</th>
                </tr>
                <tr class='thCs'>
                    
                    <th style="width: 9%">原币</th>
                    <th style="width: 9%">本位币</th>
                    <th style="width: 9%">原币</th>
                    <th style="width: 9%">本位币</th>
                    <th style="width: 9%">原币</th>
                    <th style="width: 9%">本位币</th>
                    <th style="width: 9%">原币</th>
                    <th style="width: 9%">本位币</th>
                    
                    
                </tr>
            `;

                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.subjectCode}</td>
                        <td>${row.subjectName}</td>
                        <td>${row.currencyName}</td>
                        <td>${row.yesterdayBalanceFor==null?"":row.yesterdayBalanceFor}</td>
                        <td>${row.yesterdayBalance==null?"":row.yesterdayBalance}</td>
                        <td>${row.todayDebitFor==null?"":row.todayDebitFor}</td>
                        <td>${row.todayDebit==null?"":row.todayDebit}</td>
                        <td>${row.todayCreditFor==null?"":row.todayCreditFor}</td>
                        <td>${row.todayCredit==null?"":row.todayCredit}</td>
                        <td>${row.todayBalanceFor==null?"":row.todayBalanceFor}</td>
                        <td>${row.todayBalance==null?"":row.todayBalance}</td>
                        
                        
                    </tr>
                `;
                });
            }else if (that.filter.currencyOption == 1){
                _thead = `
                <tr class='thCs'>
                    <th style="width: 10%">科目代码</th>
                    <th style="width: 18%">科目名称</th>
                    <th style="width: 18%">币别</th>
                    <th>昨日余额</th>
                    <th>今日借方</th>
                    <th>今日贷方</th>
                    <th>今日余额</th>
                </tr>
            `;

                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.subjectCode}</td>
                        <td>${row.subjectName}</td>
                        <td>${row.currencyName}</td>
                        <td>${row.yesterdayBalanceFor==null?"":row.yesterdayBalanceFor}</td>
                        <td>${row.todayDebitFor==null?"":row.todayDebitFor}</td>
                        <td>${row.todayCreditFor==null?"":row.todayCreditFor}</td>
                        <td>${row.todayBalanceFor==null?"":row.todayBalanceFor}</td>
                    </tr>
                `;
                });
            }else {
                _thead = `
                <tr class='thCs'>
                    <th style="width: 10%">科目代码</th>
                    <th style="width: 18%">科目名称</th>
                    <th style="width: 18%">币别</th>
                    <th>昨日余额</th>
                    <th>今日借方</th>
                    <th>今日贷方</th>
                    <th>今日余额</th>
                </tr>
            `;

                _d.forEach(row => {
                    _tbody += `
                    <tr>
                        <td>${row.subjectCode}</td>
                        <td>${row.subjectName}</td>
                        <td>${row.currencyName}</td>
                        <td>${row.yesterdayBalance==null?"":row.yesterdayBalance}</td>
                        <td>${row.todayDebit==null?"":row.todayDebit}</td>
                        <td>${row.todayCredit==null?"":row.todayCredit}</td>
                        <td>${row.todayBalance==null?"":row.todayBalance}</td>
                    </tr>
                `;
                });
            }
            console.log("thead------------");
            console.log(_thead);
            console.log("tbody-------------");
            console.log(_tbody);
            var _info = {
                'title': '现金日报表',  // 标题
                'template': 12,  // 模板
                // 'titleInfo': [       // title
                //     { 'name': '日期', 'val': '2018-07-24' },
                //     { 'name': '单据编号', 'val': 'billNumber' },
                //     { 'name': '凭证字号', 'val': 'voucherSize' },
                //     { 'name': '核销类型', 'val': 'verificationTypeName' }
                // ],
                'titleInfo': [

                    {name:'币别',val:that.currencyTitle},
                    {name:'日期',val:that.dateTitle}

                ],

                // 'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                'colMaxLenght': 9,  // 显示最大长度， 默认为7
                'data': [],  // 打印数据  list
                'totalRow': false,
                'tbodyInfo': {
                    'theadTX': _thead,
                    'tbodyTX': _tbody
                    // 'tfootTX': _tfoot
                },
            };
            // 弹窗选择列 模式
            // that.printInfo = _info;
            // that.printModalShow(true);

            //不带值正常打印,带值高级打印
            // htPrint(_info);
            // htPrint();
            htPrint(_info);
        },
        printModalShow (_t) {
            this.printModal = _t;
        }
    }
})