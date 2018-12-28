new Vue({
    el: '#receivablesDetail',
    data() {
        return {
            openTime: '',
            formData: {
                startDate: '',
                endDate: '',
                customerStartId: '',
                customerEndId: '',
                customerStartCode: '',
                customerEndCode: '',
                departmentStartId: '',
                departmentStartCode: '',
                departmentEndId: '',
                departmentEndCode: '',
                employeeStartId: '',
                employeeStartCode: '',
                employeeEndId: '',
                employeeEndCode: '',
                currencyId: '',
                currencyName: '',
                checkComeNoInvoice: 1,
                checkAudit: 1,
                checkHierarchicalAggregation: 1,
                checkDisplayCollect: 1,
                checkCashTicket: 1,
                checkOtherReceivable: 1,
                checkPaymentSettle: 1,
                checkBalanceDisplay: 0,
                checkHappenDisplay: 1,
                typePaymentReceived: ''
            },
            forDataInitList: {
                sysCurrencyId: '',
                customers: [],
                departments: [],
                brokerages: [],
                currencys: []
            },
            organisationList: [],
            form: {
                customerScope: '', //客户范围
                departmentScope: '',  //部门范围
                employeeScope: '',  //业务员范围
            },
            filterVisible: false,
            base_config: {
                mtype: 'POST',
                styleUI: 'Bootstrap',
                url: contextPath + '/collectAccountsReceivable/selectDetailFilter',
                ajaxGridOptions: {contentType: 'application/json;charset=utf-8'},
                datatype: 'json',
                jsonReader: {
                    root: "data",
                    // cell: "list",
                    // userdata: "data.userData",
                    // repeatitems: false
                },
                height: $(window).height() - 140,
                viewrecords: true,
                rowNum: 999999999,

            },
            colNames: [],
            colModel: [],
            tableHeaders: [],
            tableSelectId: '',
            lodoPList: [],
            printModal: false,
            printInfo: {},
        }
    },
    mounted() {
        
        let that = this;
        that.initMethod();
        that.openTime = window.parent.params && window.parent.params.openTime;
    },
    methods: {
        //条件change
        onSelected(value, obj, location, arr) {
            let find = this.forDataInitList[arr].find(row => {
                return value === row[obj + 'Id']
            })
            if (!find) return;
            this.formData[obj + location + 'Code'] = find[obj + 'Code'];
            this.formData[obj + location + 'Name'] = find[obj + 'Name']

            console.log("obj", this.formData)
        },
        //导出
        exportExcel() {
            let _param = this.formData;
            let _paramJson = encodeURI(JSON.stringify(_param));
            let _url = contextPath + '/collectAccountsReceivable/executeSummaryExcel?param=' + _paramJson;
            //转码
            window.frames.exportIframe.location.href = _url;
        },
        // 初始值
        initMethod() {
            
            this.delTable();
            this.initFilterPage();
        },
        initFilterPage() {
            
            let that = this;
            let _parame = that.formData;
            let _url = contextPath + '/collectAccountsReceivable/initPage';
            $.ajax({
                type: 'post',
                async: true,
                data: JSON.stringify(_parame),
                url: _url,
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    
                    that.forDataInitList = res.data;
                    let query = getUrlParam('action');
                    if (query != 'query') {
                        that.formData.startDate = res.data.startDate;
                        that.formData.endDate = res.data.endDate;
                        let currrencys = that.forDataInitList.currencys;
                        that.formData.currencyId = res.data.sysCurrencyId;
                        $.each(currrencys, function (index, obj) {
                            if (obj.currencyId == that.formData.currencyId) {
                                that.formData.currencyName = obj.currencyName;
                                return false;
                            }
                        });
                    } else {
                        that.formData = JSON.parse(decodeURI(getUrlParam('data')));
                    }
                    that.setTableHeader();
                }
            })
        },
        setTableHeader() {
            let that = this;
            let currencys = that.forDataInitList.currencys;
            let obj = currencys.find(row => {
                return row.currencyId == that.formData.currencyId;
            })
            !!obj && (that.formData.currencyName = obj.currencyName);

            if (this.forDataInitList.sysCurrencyId === this.formData.currencyId) {
                this.colNames = ['customerId', '日期', '单据类型', '单据编号', '客户代码', '客户名称', '摘要', '凭证号', '部门代码', '部门名称', '业务员代码', '业务员名称', '预收金额', '应收金额', '实收金额', '期末余额', 'system'];
                this.colModel = [
                    {name: 'customerId', width: 30, hidden: true},
                    {
                        name: 'documentDate', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value.slice(0, 10)
                    }
                    },
                    {name: 'documentType', width: 100},
                    {name: 'documentNumber', width: 100},
                    {
                        name: 'customerCode', width: 100, formatter: function (value, options, rowData) {
                        if (value == 'log-subtotal' || value == 'log-period') {
                            return '';
                        }
                        return value;
                    }
                    },
                    {
                        name: 'customerName', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'summary', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'voucherSize', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'departmentCode', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'departmentName', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'employeeCode',
                        width: 100,
                        align: 'center',
                        formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'employeeName',
                        width: 100,
                        align: 'center',
                        formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'depositBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'receivableBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'officialBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'endBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {name: 'system', hidden: true},
                ];
                this.tableHeaders = [];
            } else {
                this.colNames = ['documentId', '日期', '单据类型', '单据编号', '客户代码', '客户名称', '摘要', '凭证号', '部门代码', '部门名称', '业务员代码', '业务员名称',
                    '原币', '本位币', '原币', '本位币', '原币', '本位币', '原币', '本位币', 'system'];
                this.colModel = [
                    {name: 'documentId', width: 30, hidden: true},
                    {name: 'documentDate', width: 100},
                    {name: 'documentType', width: 100},
                    {name: 'documentNumber', width: 100},
                    {
                        name: 'customerCode', width: 100, formatter: function (value, options, rowData) {

                        if (value == 'log-subtotal' || value == 'log-period') {
                            return '';
                        }
                        return value;
                    }
                    },
                    {
                        name: 'customerName', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'summary', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'voucherSize', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'departmentCode', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'departmentName', width: 100, formatter: function (value, options, rowData) {
                        return value == null ? '' : value;
                    }
                    },
                    {
                        name: 'employeeCode',
                        width: 100,
                        align: 'center',
                        formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'employeeName',
                        width: 100,
                        align: 'center',
                        formatter: function (value, options, rowData) {
                            return value == null || value == 0 ? '' : value;
                        }
                    },
                    {
                        name: 'depositBalanceFor', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'depositBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'receivableBalanceFor', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'receivableBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'officialBalanceFor', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'officialBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'endBalanceFor', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {
                        name: 'endBalance', width: 120, formatter: function (value, options, rowData) {
                        return value == null || value == 0 ? '' : accounting.formatNumber(value, 2, '');
                    }
                    },
                    {name: 'system', hidden: true},
                ];
                this.tableHeaders = [
                    {startColumnName: 'depositBalanceFor', numberOfColumns: 2, titleText: '预收金额'},
                    {startColumnName: 'receivableBalanceFor', numberOfColumns: 2, titleText: '应收金额'},
                    {startColumnName: 'officialBalanceFor', numberOfColumns: 2, titleText: '实收金额'},
                    {startColumnName: 'endBalanceFor', numberOfColumns: 2, titleText: '期末余额'}
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
                postData: JSON.stringify(_vm.formData),
                footerrow: true,
                userDataOnFooter: true,
                gridComplete: _vm.completeMethod,
                loadComplete: function (ret) {
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
                    _vm.tableSelectId = Number.parseFloat(data);
                },
                ondblClickRow: function (rowid, iRow, iCol, e) { // 当选择行时触发此事件
                    // 跳转页面
                    console.log(rowid, iRow, iCol, e, "-----rowid,iRow,iCol,e---------");
                    _vm.checkTheDocuments();
                },
            });
            jQuery("#grid").jqGrid(config);
        },
        getColSum(name) {
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
        completeMethod() {
            let that = this;
            let sysCurrencyId = that.forDataInitList.sysCurrencyId;
            var sum_beginBalance = this.getColSum('beginBalance');
            var sum_depositBalance = this.getColSum('depositBalance');
            var sum_receivableBalance = this.getColSum('receivableBalance');
            var sum_officialBalance = this.getColSum('officialBalance');
            var sum_endBalance = this.getColSum('endBalance');

            if (sysCurrencyId == that.formData.currencyId) {
                $("#grid").footerData('set', {
                    "customerCode": '合计',
                    'beginBalance': [0],
                    'depositBalance': [0],
                    'receivableBalance': [0],
                    'officialBalance': [0],
                    'endBalance': [0],
                });
                $("#grid").footerData('set', {
                    "customerCode": '合计',
                    'beginBalance': sum_beginBalance,
                    'depositBalance': sum_depositBalance,
                    'receivableBalance': sum_receivableBalance,
                    'officialBalance': sum_officialBalance,
                    'endBalance': sum_endBalance,
                });
            } else {
                $("#grid").footerData('set', {
                    "customerCode": '合计',
                    'beginBalanceFor': [0],
                    'beginBalance': [0],
                    'depositBalanceFor': [0],
                    'depositBalance': [0],
                    'receivableBalanceFor': [0],
                    'receivableBalance': [0],
                    'officialBalanceFor': [0],
                    'officialBalance': [0],
                    'endBalanceFor': [0],
                    'endBalance': [0],
                });
                var sum_beginBalanceFor = this.getColSum('beginBalanceFor');
                var sum_depositBalanceFor = this.getColSum('depositBalanceFor');
                var sum_receivableBalanceFor = this.getColSum('receivableBalanceFor');
                var sum_officialBalanceFor = this.getColSum('officialBalanceFor');
                var sum_endBalanceFor = this.getColSum('endBalanceFor');
                $("#grid").footerData('set', {
                    "customerCode": '合计',
                    'beginBalanceFor': sum_beginBalanceFor,
                    'beginBalance': sum_beginBalance,
                    'depositBalanceFor': sum_depositBalanceFor,
                    'depositBalance': sum_depositBalance,
                    'receivableBalanceFor': sum_receivableBalanceFor,
                    'receivableBalance': sum_receivableBalance,
                    'officialBalanceFor': sum_officialBalanceFor,
                    'officialBalance': sum_officialBalance,
                    'endBalanceFor': sum_endBalanceFor,
                    'endBalance': sum_endBalance,
                });
            }

        },
        open() {
            this.filterVisible = true;
        },
        refresh() {
            // $("#grid").jqGrid('clearGridData');  //清空表格
            // $("#grid").jqGrid('setGridParam', ).trigger("reloadGrid");
            this.initMethod();
        },
        save() {
            this.filterVisible = false;
            // this.refresh();
            this.delTable();
            this.setTableHeader();
        },
        cancel() {
            this.filterVisible = false;
        },

        checkTheDocuments() {
            var that = this;
            let _type = '';
            let _url = '';
            let _date = that.lodoPList[that.tableSelectId];
            console.log("_date", _date);
            if (_date.customerCode.indexOf("log") == -1) {
                let system = _date.system;
                if (system === 1) {
                    //跳转收款单页面
                    _url = `${rcContextPath}/finance/paymentReceipt/index.html?type=1&id=${_date.documentId}&action=query`
                    _type = '付款单';
                } else if (system === 2) {
                    //跳转其他付款单页面
                    _type = '其它收款单据';
                    _url = `${rcContextPath}/finance/otherReceipts/index.html?otherTypesDocument=1&id=${_date.documentId}&action=query`
                } else if (system === 3 || system === 4) {
                    //跳转核销单页面
                    _url = `${rcContextPath}/finance/ReceivableWriteofflist/index.html?id=${_date.documentId}&action=query`
                    _type = '核销单';
                }
                window.parent.activeEvent({'name': _type, 'url': _url});
            }
        },
        outHtml() {
            window.parent.closeCurrentTab({name: name, openTime: this.openTime, exit: true})
        },
        print() {
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
            //去期初,小计code
            var _d = that.lodoPList;
            $.each(_d, function (index, obj) {
                let code = obj.customerCode;
                if (code == 'log-subtotal' || code == 'log-period') {
                    obj.customerCode = '';
                }
            });

            //打印条件范围
            //客户
            if (that.formData.customerStartCode || that.formData.customerEndCode) {
                that.form.customerScope = (that.formData.customerStartCode ? that.formData.customerStartCode : '') + '--' + (that.formData.customerEndCode ? that.formData.customerEndCode : '');
            }
            if (!that.formData.customerStartCode && !that.formData.customerScope) {
                that.form.customerScope = '所有';
            }
            //部门
            if (that.formData.departmentStartCode || that.formData.departmentEndCode) {
                that.form.departmentScope = (that.formData.departmentStartCode ? that.formData.departmentStartCode : '') + '--' + (that.formData.departmentEndCode ? that.formData.departmentEndCode : '');
            }
            if (!that.formData.departmentStartCode && !that.formData.departmentEndCode) {
                that.form.departmentScope = '所有';
            }
            //业务员
            if (that.formData.employeeStartCode || that.formData.employeeEndCode) {
                that.form.employeeScope = (that.formData.employeeStartCode ? that.formData.employeeStartCode : '') + '--' + (this.formData.employeeEndCode ? this.formData.employeeEndCode : '');
            }
            if (!that.formData.employeeStartCode && !that.formData.employeeEndCode) {
                that.form.employeeScope = '所有';
            }

            if (that.forDataInitList.sysCurrencyId === that.formData.currencyId) {

                // 但表头选择打印
                var _info = {
                    'title': '应收账款明细表',  // 标题
                    'template': 1,  // 模板
                    'titleInfo': [       // title
                        {'name': '起始日期', 'val': (new Date(that.formData.startDate)).format("yyyy-MM-dd")},
                        {'name': '', 'val': ''},
                        {'name': '结束日期', 'val': (new Date(that.formData.endDate)).format("yyyy-MM-dd")},
                        {'name': '客户代码范围', 'val': that.form.customerScope},
                        {'name': '部门代码范围', 'val': that.form.departmentScope},
                        {'name': '业务员代码范围', 'val': that.form.employeeScope},
                        {'name': '币别', 'val': that.formData.currencyName},
                    ],
                    'colNames': [       // 列名与对应字段名
                        {'name': '日期', 'col': 'documentDate'},
                        {'name': '单据类型', 'col': 'documentType'},
                        {'name': '单据编号', 'col': 'documentNumber'},
                        {'name': '客户名称', 'col': 'customerName'},
                        {'name': '摘要', 'col': 'summary'},
                        {'name': '凭证号', 'col': 'voucherSize'},
                        {'name': '部门名称', 'col': 'departmentName'},
                        {'name': '业务员名称', 'col': 'employeeName'},
                        {'name': '预收金额', 'col': 'depositBalance', 'sum': true},
                        {'name': '应收金额', 'col': 'receivableBalance', 'sum': true},
                        {'name': '实收金额', 'col': 'officialBalance', 'sum': true},
                        {'name': '期末余额', 'col': 'endBalance', 'sum': true},
                    ],
                    'styleCss': '',   // 自定义样式 例：  thead{text-align: center;font-size: 14px;font-weight: 100;}
                    'colMaxLenght': 9,  // 显示最大长度， 默认为7
                    'data': _d,  // 打印数据  list
                }
                // 弹窗选择列 模式
                that.printInfo = _info;
                that.printModalShow(true);
            } else {
                // 多表头固定打印

                var _thead = '', _tbody = '', _tfoot = '';
                _thead = `
                    <tr class='thCs'>
                        <th rowspan="2" style="width: 6%">日期</th>
                        <th rowspan="2" style="width: 6%">单据类型</th>
                        <th rowspan="2" style="width: 6%">单据编号</th>
                        <th rowspan="2" style="width: 6%">客户名称</th>
                        <th rowspan="2" style="width: 6%">摘要</th>
                        <th rowspan="2" style="width: 6%">凭证号</th>
                        <th rowspan="2" style="width: 6%">部门</th>
                        <th rowspan="2" style="width: 6%">业务员</th>
                        <th colspan="2" style="width: 12%">预收金额</th>
                        <th colspan="2" style="width: 12%">应收金额</th>
                        <th colspan="2" style="width: 12%">实收金额</th>
                        <th colspan="2" style="width: 12%">期末金额</th>
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
                            <td>${that._nullData(row.depositBalanceFor)}</td>
                            <td>${that._nullData(row.depositBalance)}</td>
                            <td>${that._nullData(row.receivableBalanceFor)}</td>
                            <td>${that._nullData(row.receivableBalance)}</td>
                            <td>${that._nullData(row.officialBalanceFor)}</td>
                            <td>${that._nullData(row.officialBalance)}</td>
                            <td>${that._nullData(row.endBalanceFor)}</td>
                            <td>${that._nullData(row.endBalance)}</td>
                        </tr>
                    `;
                });

                if (_d.length === 0) {
                    _tfoot = `
                        <tr class="ht-foot">
                            <td>合计：</td>
                            ${'<td>/td>'.repeat(15)}
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
                            ${'<td tdata="SubSum" format="#,##0.00" align="right">###</td>'.repeat(10)}
                        </tr>
                        `;
                }

                let data = {
                    title: "应收账款明细表",
                    template: 12,
                    'titleInfo': [       // title
                        {'name': '起始日期', 'val': (new Date(that.formData.startDate)).format("yyyy-MM-dd")},
                        {'name': '', 'val': ''},
                        {'name': '结束日期', 'val': (new Date(that.formData.endDate)).format("yyyy-MM-dd")},
                        {'name': '客户代码范围', 'val': that.form.customerScope},
                        {'name': '部门代码范围', 'val': that.form.departmentScope},
                        {'name': '业务员代码范围', 'val': that.form.employeeScope},
                        {'name': '币别', 'val': that.formData.currencyName},
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
        printModalShow(_t) {
            this.printModal = _t;
        },
        _nullData(_t) {
            if (_t) {
                return _t;
            } else {
                return '';
            }
        }
    },
    computed: {
        currencyName() {
            let find = this.currencyList.find(row => {
                return row.value === this.formData.currencyId;
            })
            if (!find) return;
            return find.label;
        }
    }
})