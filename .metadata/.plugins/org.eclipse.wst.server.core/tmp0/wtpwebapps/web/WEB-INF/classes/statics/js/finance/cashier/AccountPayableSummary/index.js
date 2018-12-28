new Vue({
    el: '#accountPayableSummary',
    data () {
        return {
            openTime: '',
            formData: {
                supplierCodeStart: '所有供应商',//起始供应商编码
                supplierCodeEnd: '所有供应商',  //结束供应商编码
                departmentCodeStart: '所有部门', //起始部门代码
                departmentCodeEnd: '所有部门', //结束部门代码
                salesmanCodeStart: '所有业务员', // 起始业务员代码
                salesmanCodeEnd: '所有业务员', //结束业务员代码
                dateTimeStart: '', // 开始时间
                dateTimeEnd: '',//结束时间
                coinStopId: -1, //币别id
                isAuditing: 1, //包括未审核  1 包括 0 不包括
                isPaymentSettlement: 1,//包括付款结算 1 包括 2不包括
                isOtherPayable: 1, // 包括其他应付 1 包括 2不包括
                showPeriodSum: 0,
                showYearSum: 0,
                otherTypesDocuments: 2, //其他付款单的单据类型
                gather: 1, // 是否汇总 0 否 1 是
                documentType: 2 // 付款单的单据类型
            },
            form:{
                supplier : '', //供应商范围
                department:'',  //部门范围
                salesman : '',  //业务员范围
                coinStopName:'' //币别名称
            },
            formDataInit: {
                'coinStop': [],
                'supplier': [],
                'department': [],
                'salesman': [],
                'dateTimeStart': '',
                'dateTimeEnd': ''
            },
            organisationList: [
                { label: "金大祥", value: 1 },
                { label: "金大祥1", value: 2 },
                { label: "金大祥2", value: 3 },
            ],
            filterVisible: false,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/accountsPayableStatement/payableBreakdown',
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: 'json',
                jsonReader: {//取返回值
                    root: "data",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                height: $(window).height() - 140,
                // viewrecords: true,
                rowNum: 999999999,

            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            tableSelectId: '',
            baseData: {
                standardCurrencyId: 1,
            },
            currencyList: [
                { label: "人民币", value: 1 },
                { label: "美元", value: 2 },
                { label: "欧元", value: 3 },
            ],
            lodoPList: [],
            printModal: false,
            printInfo: {},
        }
    },
    // created: function () {
    //     this._ajaxGetFormData();
    // },
    mounted () {
        this.initMethod();
        this.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        derivation () {
            console.log("引出,导出excel...");
            var _data = '';
            this.formData.dateTimeStart = (new Date(this.formData.dateTimeStart)).format("yyyy-MM-dd");
            this.formData.dateTimeEnd = (new Date(this.formData.dateTimeEnd)).format("yyyy-MM-dd");
            console.log("this.formData",this.formData);
            for (let key in this.formData) {
                _data += `${key}=${this.formData[key]}&`;
            }
            _data = _data.slice(0, _data.length - 1);
            console.log("data====>", _data)
            window.open(contextPath + '/accountsPayableStatement/exportExcel?' + _data);
        },
        _ajaxGetFormData () {
            let that = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/accountsPayableStatement/init',
                dataType: 'json',
                data: null,
                success: function (d) {
                    var _text = '';
                    if (d.code === '100100') {
                        _text = d.msg;
                        console.log(d, "======>")
                        that.formDataInit = d.data;
                        that.formData.dateTimeStart = d.data.dateTimeStart; // 开始时间
                        that.formData.dateTimeEnd = d.data.dateTimeEnd;//结束时间
                        // that.formData.coinStopId = d.data.id;//币别(获取默认本位币id)
                        console.log("that.formData===>", that.formData);
                        that.setTableHeader();
                    } else {
                        _text = d.msg;
                    }
                    that.$Message.info({
                        content: _text,
                        duration: 3
                    });
                },
            });
        },

        // 初始值
        initMethod () {
            this.delTable();

            this._ajaxGetFormData();

        },
        setTableHeader () {

            if (this.baseData.standardCurrencyId === this.formData.coinStopId) {
                this.colNames = ['id', '供应商代码', '供应商名称', '部门代码', '部门名称', '业务员代码', '业务员名称', '期初余额',
                    '预付金额', '应付金额', '实付金额', '期末余额', 'documentId', 'system'];
                this.colModel = [
                    { name: 'id', width: 30, hidden: true },
                    { name: 'customerCode', width: 100 },
                    { name: 'customerName', width: 100 },
                    { name: 'departmentCode', width: 100 },
                    { name: 'departmentName', width: 100 },
                    { name: 'employeeCode', width: 100 },
                    { name: 'employeeName', width: 100 },
                    {
                        name: 'beginBalance', width: 120 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'depositBalance', width: 150,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'receivableBalance', width: 100,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'officialBalance', width: 100,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'endBalance', width: 100,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    { name: 'documentId', hidden: true },// 单据id
                    { name: 'system', hidden: true },//所属系统 1 付款单   2其他付款 3,4 核销单
                ];
                this.tableHeaders = [];
            } else {
                this.colNames = ['id', '供应商代码', '供应商名称', '部门代码', '部门名称', '业务员代码', '业务员名称', '原币', '本位币',
                    '原币', '本位币', '原币', '本位币', '原币', '本位币', '原币', '本位币', 'documentId', 'system'];
                this.colModel = [
                    { name: 'id', width: 30, hidden: true },
                    { name: 'customerCode', width: 100 },
                    { name: 'customerName', width: 100 },
                    { name: 'departmentCode', width: 100 },
                    { name: 'departmentName', width: 100 },
                    { name: 'employeeCode', width: 100 },
                    { name: 'employeeName', width: 100 },
                    {
                        name: 'beginBalanceFor', width: 120 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'beginBalance', width: 120 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'depositBalanceFor', width: 150 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'depositBalance', width: 150 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'receivableBalanceFor', width: 100 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }

                    },
                    {
                        name: 'receivableBalance', width: 100 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'officialBalanceFor', width: 100 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'officialBalance', width: 100 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'endBalanceFor', width: 100 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    {
                        name: 'endBalance', width: 100 ,formatter: function (value, grid, rows, state) {
                            return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, ",");
                        }
                    },
                    { name: 'documentId', hidden: true },// 单据id
                    { name: 'system', hidden: true },//所属系统 1 付款单   2其他付款 3,4 核销单
                ];
                this.tableHeaders = [
                    { startColumnName: 'beginBalanceFor', numberOfColumns: 2, titleText: '期初余额' },
                    { startColumnName: 'depositBalanceFor', numberOfColumns: 2, titleText: '预付金额' },
                    { startColumnName: 'receivableBalanceFor', numberOfColumns: 2, titleText: '应付金额' },
                    { startColumnName: 'officialBalanceFor', numberOfColumns: 2, titleText: '实付金额' },
                    { startColumnName: 'endBalanceFor', numberOfColumns: 2, titleText: '期末余额' },
                ];
            }
            this.jqGridInit(this.colNames, this.colModel, this.tableHeaders);
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
            console.log("_vm.formData=====>>", _vm.formData)
            let config = Object.assign({}, this.base_config, {
                colNames: colNames,
                colModel: colModel,
                postData: JSON.stringify(_vm.formData),
                // footerrow: true,
                userDataOnFooter: true,
                gridComplete: _vm.completeMethod,
                loadComplete: function (ret) {
                    console.log("ret====>>>", ret);
                    _vm.lodoPList = ret.data || [];
                    jQuery("#grid").jqGrid('destroyGroupHeader');
                    jQuery("#grid").jqGrid('setGroupHeaders', {
                        useColSpanStyle: true,
                        groupHeaders: headers
                    });

                    //获取表格所有行数据
                    // let rows = jQuery("#grid").jqGrid('getRowData');
                    // var allCountID = $("#grid").jqGrid('getDataIDs');
                    // rows.push($("#grid").jqGrid('getRowData', allCountID[allCountID.length - 1]));
                    // _vm.tableList = rows;
                    // console.log('tableList', _vm.tableList)
                },
                onSelectRow: function (data, status) { // 当选择行时触发此事件
                    console.log("data---------", data, status);
                    _vm.tableSelectId = data;
                },
                ondblClickRow: function (rowid, iRow, iCol, e) { // 当选择行时触发此事件
                    // 跳转页面
                    console.log(rowid, iRow, iCol, e, "-----rowid,iRow,iCol,e---------");
                    if (_vm.tableSelectId.indexOf("-log-") == -1) {
                        _vm.checkTheDocuments();
                    }
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        getColSum (name) {
            let rs = $(`td[aria-describedby='grid_${name}']`);
            let sum = 0;
            if (rs.children("div.sumCol").length !== 0) {
                rs = $(`td[aria-describedby='grid_${name}']`).children("div.sumCol")
            } else {
                rs = $(`td[aria-describedby='grid_${name}']:not(:last)`)
            }
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000
        })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        completeMethod () {
            $("#grid").footerData('set', {
                "voucherPeriodData": '合计',
                'createName': [0],
            });
            var sum_createName = this.getColSum('createName')

            $("#grid").footerData('set', {
                "voucherPeriodData": '合计',
                'createName': sum_createName,
            });

        },
        open () {
            this.filterVisible = true;
        },
        refresh () {
            // $("#grid").jqGrid('clearGridData');  //清空表格
            // $("#grid").jqGrid('setGridParam', ).trigger("reloadGrid");
            this.delTable();
            this.setTableHeader();
        },
        save () {
            this.filterVisible = false;
            this.refresh();
            // this.setTableHeader ();

        },
        cancel () {
            this.filterVisible = false;
        },
        checkTheDocuments () {
            var that = this;
            var _url = '';
            var _date = {'id':"0"};
            var _type = '';

            if (that.lodoPList.length != 0) {
                for (var i = 0; i < that.lodoPList.length; i++) {
                    if (that.tableSelectId === that.lodoPList[i].id) {
                        _date = that.lodoPList[i];
                    }
                }
            }
            console.log("!_date",_date);
            if (_date.id === "0"){
                console.log("!_date",_date);
                this.$Message.info('请先选中一条数据');
                return;
            }
            console.log("that.lodoPList", that.lodoPList);
            console.log("_date", _date);
            if (_date.id.indexOf("-log-") != -1){
                return;
            }
            if (_date.system === -1) {
                var _json = (JSON.stringify(that.formData)).toString();
                _url = `${rcContextPath}/finance/cashier/AccountPayable/index.html?customerCode=${_date.customerCode}`
                _type = '应付账款明细表';
                var  _url1 = that.http_builder_url(_url,that.formData);
                console.log("_url",_url1);
            }

            window.parent.activeEvent({ 'name': _type, 'url': _url1 });
        },
        http_builder_url(url, data) {
            if (typeof(url) == 'undefined' || url == null || url == '') {
                return '';
            }
            if (typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
                return '';
            }
            url += (url.indexOf("?") != -1) ? "" : "?";
            for (var k in data) {
                url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
                //console.log(url);
            }
            return url;
        },
        outHtml () {
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        print () {
            var that = this;
            console.log(that.lodoPList, '=========that.lodoPList');
            if (!that.lodoPList || !that.lodoPList.length) {
                that.$Message.info({
                    content: '无打印数据',
                    duration: 3
                });
                return;
            }
            // that.lodoPList.forEach(item => {
            //     item.auditStatus = item.auditStatus === 2 ? "Y" : "N";
            // });
            if (this.formData.supplierCodeStart || this.formData.supplierCodeEnd){
                this.form.supplier = (this.formData.supplierCodeStart?this.formData.supplierCodeStart:'')+'--'+ (this.formData.supplierCodeEnd?this.formData.supplierCodeEnd:'');
            }
            if (!this.formData.supplierCodeStart && !this.formData.supplierCodeEnd){
                this.form.supplier = '所有';
            }
            if (this.formData.departmentCodeStart || this.formData.departmentCodeEnd){
                this.form.department = (this.formData.departmentCodeStart?this.formData.departmentCodeStart:'')+'--'+ (this.formData.departmentCodeEnd?this.formData.departmentCodeEnd:'');
            }
            if (!this.formData.departmentCodeStart && !this.formData.departmentCodeEnd){
                this.form.department = '所有';
            }
            if (this.formData.salesmanCodeStart || this.formData.salesmanCodeEnd){
                this.form.salesman = (this.formData.salesmanCodeStart?this.formData.salesmanCodeStart:'')+'--'+ (this.formData.salesmanCodeEnd?this.formData.salesmanCodeEnd:'');
            }
            if (!this.formData.salesmanCodeStart && !this.formData.salesmanCodeEnd){
                this.form.salesman = '所有';
            }
            var coinStop = this.formDataInit.coinStop;
            console.log("coinStop" ,coinStop);
            console.log("this.formData===",this.formData)
            for (var i = 0;i<coinStop.length;i++){
                if (coinStop[i].id === this.formData.coinStopId){
                    this.form.coinStopName = coinStop[i].name;
                }
            }
            if (that.baseData.standardCurrencyId === that.formData.coinStopId) {
                // 但表头选择打印
                var _info = {
                    'title': '应付账款汇总表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        { 'name': '起始日期', 'val': (new Date(this.formData.dateTimeStart)).format("yyyy-MM-dd") },
                        { 'name': '结束日期', 'val': (new Date(this.formData.dateTimeEnd)).format("yyyy-MM-dd") },
                        { 'name': '供应商代码范围', 'val': this.form.supplier},
                        { 'name': '部门代码范围', 'val': this.form.department },
                        { 'name': '业务员代码范围', 'val': this.form.salesman },
                        { 'name': '币别', 'val': this.form.coinStopName },
                    ],
                    'colNames': [       // 列名与对应字段名
                        { 'name': '日期', 'col': 'documentDate' },
                        { 'name': '单据类型', 'col': 'documentType' },
                        { 'name': '单据编号', 'col': 'documentNumber' },
                        { 'name': '供应商名称', 'col': 'customerName' },
                        { 'name': '摘要', 'col': 'summary' },
                        { 'name': '凭证号', 'col': 'voucherSize' },
                        { 'name': '部门', 'col': 'departmentName' },
                        { 'name': '业务员', 'col': 'employeeName' },
                        { 'name': '预付金额', 'col': 'depositBalance' },
                        { 'name': '应付金额', 'col': 'receivableBalance' },
                        { 'name': '实付金额', 'col': 'officialBalance' },
                        { 'name': '期末余额', 'col': 'endBalance' },
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
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
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">单据类型</th>
                        <th rowspan="2" style="width: 6%">单据编号</th>
                        <th rowspan="2" style="width: 6%">供应商名称</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th rowspan="2" style="width: 6%">凭证号</th>
                        <th rowspan="2" style="width: 6%">部门</th>
                        <th rowspan="2" style="width: 6%">业务员</th>
                        <th colspan="2" style="width: 12%">预付金额</th>
                        <th colspan="2" style="width: 12%">应付金额</th>
                        <th colspan="2" style="width: 12%">实付金额</th>
                        <th colspan="2" style="width: 12%">期末余额</th>
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
                            <td>${that._nullData(row.documentDate)}</td>
                            <td>${that._nullData(row.documentType)}</td>
                            <td>${that._nullData(row.documentNumber)}</td>
                            <td>${that._nullData(row.customerName)}</td>
                            <td>${that._nullData(row.summary)}</td>
                            <td>${that._nullData(row.voucherSize)}</td>
                            <td>${that._nullData(row.departmentName)}</td>
                            <td>${that._nullData(row.employeeName)}</td>
                            <td>${that._nullData(row.depositBalance)}</td>  
                            <td>${that._nullData(row.depositBalanceFor)}</td>
                            <td>${that._nullData(row.receivableBalance)}</td>
                            <td>${that._nullData(row.receivableBalanceFor)}</td>
                            <td>${that._nullData(row.officialBalance)}</td>
                            <td>${that._nullData(row.officialBalanceFor)}</td>
                            <td>${that._nullData(row.endBalance)}</td>
                            <td>${that._nullData(row.endBalanceFor)}</td>
                        </tr>
                    `;
            });

                // if (_d.length === 0) {
                //     _tfoot = `
                //         <tr class="ht-foot">
                //             <td>合计：</td>
                //             ${'<td>/td>'.repeat(11)}
                //         </tr>
                //         `;
                // } else {
                //     _tfoot = `
                //         <tr class="ht-foot">
                //             <td>合计：</td>
                //             <td></td>
                //             <td></td>
                //             <td></td>
                //             <td></td>
                //             <td></td>
                //             ${'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(6)}
                //         </tr>
                //         `;
                // }


                let data = {
                    title: "应付账款汇总表",
                    template: 12,
                    'titleInfo': [       // title
                        { 'name': '起始日期', 'val': (new Date(this.formData.dateTimeStart)).format("yyyy-MM-dd") },
                        { 'name': '结束日期', 'val': (new Date(this.formData.dateTimeEnd)).format("yyyy-MM-dd") },
                        { 'name': '供应商代码范围', 'val': this.form.supplier},
                        { 'name': '部门代码范围', 'val': this.form.department },
                        { 'name': '业务员代码范围', 'val': this.form.salesman },
                        { 'name': '币别', 'val': this.form.coinStopName },
                    ],
                    'data': [],
                    'colMaxLenght': 10,
                    'tbodyInfo': {
                        'theadTX': _thead,
                        'tbodyTX': _tbody,
                        'tfootTX': _tfoot
                    }

                }
                htPrint(data);
            }



            //不带值正常打印,带值高级打印
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

    },
    computed: {
        currencyName () {
            let find = this.currencyList.find(row => {
                return row.value === this.formData.currencyId;
        })
            if (!find) return;
            return find.label;
        }
    }
})