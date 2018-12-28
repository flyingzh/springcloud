var _vm = new Vue({
    el: '#receivableTimeBook',
    data () {
        return {
            openTime: '',   //用于控制退出按钮
            startDate:'',//会计期间的第一天
            endDate:'',//会计期间的最后一天
            curDate: (new Date()).format("yyyy-MM-dd"),
            objectTypeIdNext: -1,
            initInfo: {
                pageType: 1,
                pageTitle: '单据序时簿',
                objectTypeId: -1,
                objectTypeList: []
            },
            isContinue: false,
            isContinueList: [],
            isInit: true,
            showFilter: false,
            subjectVisable: false,
            visible_filter: false,
            showOptionVisible: false,
            optionInfo: {
                abnormalDataProcessing: '1',
                abnormalErrorHandling: '4',
                subjectMergerDebit: false,
                subjectMergerLender: false
            },
            columnsDataList: [
                { title: '模板编号', key: 'templateNumber', width: 100 },
                { title: '模板名称', key: 'templateName', width: 100 },
                {
                    title: '创建时间', key: 'createTime', width: 180,
                    render: (h, params) => {
                        return h('div', (new Date(params.row.createTime)).format("yyyy-MM-dd"))
                    }
                },
                { title: '制单人', key: 'createName', width: 100 },
                {
                    title: '默认',
                    key: 'isDefault',
                    render: (h, params) => {
                        return h('div', params.row.isDefault === 1 ? '否' : '是')
                    }, width: 80
                },
                {
                    title: '系统', key: 'isSystem',
                    render: (h, params) => {
                        return h('div', params.row.isSystem === 1 ? '否' : '是')
                    }, width: 80
                },
            ],
            dataList: [],
            showVoucherVisible: false,
            voucherModelTxt: '',
            viewReportVisible: false,
            viewReportTxt: '',
            // 保存主表id
            selectListId: [],
            auditStatus: '',
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            filterBody: {
                objectTypeId: '', //事物类型的id
                timeStart: (new Date()).format("yyyy-MM-dd"),
                timeEnd: (new Date()).format("yyyy-MM-dd"),
                documentType: 1,
                dateScore: '',
                auditStatus: '',
                isVoucher: '',
                documentNumber: '',
                sobId: ''
            },
            //生成凭证所需的参数
            // voucherBody: {
            //     id: '',
            //     sobId: ''
            //     //objectTypeId:'' //事物类型的id
            // },
            detailDate: [
                {
                    label: '全部',
                    value: ''
                },
                {
                    label: '今天',
                    value: 'today'
                },
                {
                    label: '昨天',
                    value: 'yesterday'
                },
                {
                    label: '近7天',
                    value: 'interval7'
                },
                {
                    label: '近30天',
                    value: 'interval30'
                },
                {
                    label: '本月',
                    value: 'thisMon'
                },
                {
                    label: '上月',
                    value: 'lastMon'
                },
                {
                    label: '本季度',
                    value: 'thisQuarter'
                },
                {
                    label: '上季度',
                    value: 'lastQuarter'
                },
                {
                    label: '本年',
                    value: 'thisYear'
                },
                {
                    label: '去年',
                    value: 'lastYear'
                }
            ],
            auditStatusList: [
                {
                    label: '未审核',
                    value: 1
                },
                {
                    label: '已审核',
                    value: 2
                }
            ],
            isVoucherList: [
                {
                    label: '未记账',
                    value: 1
                },
                {
                    label: '已记账',
                    value: 2
                }
            ]
        }
    },
    methods: {
        _ajaxGetData: function () { // 查询初始事物类型
            var that = this;
            var _url = baseURL + 'voucherMenu/getCategorys';
            http.post(_url, '').then((json) => {
                var _txt = '';
                if (json.code === '100100') {
                    that.initInfo.objectTypeList = json.data;
                    that.initInfo.objectTypeId = json.data[0].objectTypeId || -1;
                    that.objectTypeIdNext = json.data[0].objectTypeId || -1;
                    that._getTable(that.initInfo.objectTypeId);

                } else {
                    _txt = json.msg;
                    that.$Message.info({
                        content: _txt,
                        duration: 3
                    });
                }

            }, (json) => { })
        },
        objectTypeChange (val) {
            console.log(this.initInfo);
        },
        _getTable (val) {
            var that = this;
            // var table = document.createElement('table');
            // table.id = 'list';
            // $('#gridContainer').append(table);
            // - 第一类为1-6，分别对应：收款，收款退款，预收款，付款，付款退款，预付款。
            // - 第二类为7-12. 分别对应：预收冲应收，预收冲应付，应收冲应付，应收冲应收，应收转应收，应付转应付。
            // - 第三类为13-16；分别对应：收款结算，付款结算，其它应收，其它应付。
            var _info = {
                _jqGridColNames: [],
                _colModel: [],
                _completeMethod: null,
                _url: ''
            }
            switch (val) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    if (val === 1 || val === 2 || val === 3) {
                        that.initInfo.pageType = 1;
                        that.filterBody.documentType = 1;

                        _info._jqGridColNames = ['审核标志', '日期', '单据号', '源单编号', '结算账号', '折扣科目', '折后金额', '折后金额(本位币)',
                            '凭证字号', '整单折扣(%)', '币别', '汇率', '表头收款金额', '表头收款金额(本位币)', '收款类型', '单据日期', '单据金额',
                            '单据金额(本位币)', '已核销金额', '未核销金额', '本次核销', '本次核销(本位币)', '发票币别', '表体汇率',
                            '摘要', '部门', '主管', '客户', '业务员', '制单人', '审核人', '审核日期', '打印次数', '备注', 'sobId', 'isVoucher', 'voucherId', 'peId'];

                    } else {
                        that.initInfo.pageType = 2;
                        that.filterBody.documentType = 2;

                        _info._jqGridColNames = ['审核标志', '日期', '单据号', '源单编号', '结算账号', '折扣科目', '折后金额', '折后金额(本位币)',
                            '凭证字号', '整单折扣(%)', '币别', '汇率', '表头付款金额', '表头付款金额(本位币)', '付款类型', '单据日期',
                            '单据金额', '单据金额(本位币)', '已核销金额', '未核销金额', '本次核销', '本次核销(本位币)', '发票币别', '表体汇率',
                            '摘要', '部门', '主管', '供应商', '业务员', '制单人', '审核人', '审核日期', '打印次数', '备注', 'sobId', 'isVoucher', 'voucherId', 'peId'];
                    }

                    _info._colModel = [
                        {
                            name: 'paymentReceiptEntity.auditMark', width: 70,

                            formatter: function (value, grid, rows, state) {
                                if (value === '合计') {
                                    return value;
                                } else {
                                    return value === 2 ? "Y" : "N"
                                }
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.orderDate', index: 'orderDate', width: 90,
                            formatter: function (value, grid, rows, state) {
                                return value ? value.slice(0, 10) : '';
                            }
                        },
                        { name: 'paymentReceiptEntity.documentNumber', width: 80, align: "left" },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "left",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                // console.log("value, grid, rows, state",value, grid, rows, state)
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    if (!!val.sourceListNumber && val.sourceListNumber !== 'null'){
                                        str += val.sourceListNumber + "<br>"
                                    }
                                })
                                return str;
                            }
                        },
                        { name: 'paymentReceiptEntity.clearanceAccount', width: 80, align: "left" },
                        { name: 'paymentReceiptEntity.discountSubject', width: 80, align: "right" },
                        {
                            name: 'paymentReceiptEntity.reducedAmountFor', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.reducedAmount', width: 120, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        { name: 'paymentReceiptEntity.voucherSize', width: 80, align: "left" },
                        { name: 'paymentReceiptEntity.bulkDiscount', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.coinStop', width: 80, align: "left" },
                        { name: 'paymentReceiptEntity.exchangeRate', width: 50, align: "right" },
                        {
                            name: 'paymentReceiptEntity.watchPaymentFor', width: 120, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.watchPayment', width: 150, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        { name: 'paymentReceiptEntity.typePaymentReceived', index: 'typePaymentReceived', width: 120, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                switch (value){
                                    case 1:
                                        str = "收款单";
                                        break;
                                    case 2:
                                        str = "付款单";
                                        break;
                                    case 3:
                                        str = "预收款单";
                                        break;
                                    case 4:
                                        str = "预付款单";
                                        break;
                                    case 5:
                                        str = "收款退款单";
                                        break;
                                    case 6:
                                        str = "付款退款单";
                                        break;
                                    default:
                                        str = "";
                                }
                                return str;
                            }
                            },

                        {
                            name: 'financeSourceSingleDataEntities', width: 80, align: "right",
                                formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    if (!!val.documentDate && val.documentDate !== 'null'){
                                        str += val.documentDate.slice(0, 10) + "<br>"
                                    }
                                })
                                return str;
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.documentaryAmountForList', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state)
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.documentaryAmountList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.cancellationAmountList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.notCancellationAmountList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.thisTiemCancellationForList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'paymentReceiptEntity.thisTiemCancellationList', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.invoiceCoinType + "<br>"
                                })
                                return str;
                            }
                        },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.surfaceExchangeRate + "<br>"
                                })
                                return str;
                            }
                        },
                        { name: 'paymentReceiptEntity.summary', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.department', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.director', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.occurrenceObject', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.salesman', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.singlePerson', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.auditorName', width: 80, align: "right" },
                        { name: 'paymentReceiptEntity.auditDate', width: 80, align: "right",formatter: function (value, grid, rows, state) {
                            return value ? value.slice(0, 10) : '';
                        } },
                        { name: 'paymentReceiptEntity.printingTimes', width: 80, align: "right" },
                        {
                            name: 'financeSourceSingleDataEntities', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let str = "";
                                rows.financeSourceSingleDataEntities.map(function (val, index) {
                                    str += val.remark + "<br>"
                                })
                                return str;
                            }
                        },
                        { name: 'paymentReceiptEntity.sobId', hidden: true },
                        { name: 'paymentReceiptEntity.isVoucher', hidden: true },
                        { name: 'paymentReceiptEntity.voucherId', hidden: true },
                        { name: 'paymentReceiptEntity.id', hidden: true ,key: true }
                    ];

                    _info._url = baseURL + 'paymentreceiptController/filtrate?r=' + new Date().getTime();
                    _info._completeMethod = that.completeMethodPaymentReceip;
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                    if (val === 7 || val === 8 || val === 9 || val === 10) {
                        that.initInfo.pageType = 1;
                        that.filterBody.documentType = 1;
                        _info._jqGridColNames = ['日期', '单据编号', '凭证字号', '客户', '供应商', '币别',
                            '实收金额', '部门', '业务员', 'sobId', 'isVoucher', 'voucherId'];
                    } else if (val === 11) {
                        that.initInfo.pageType = 2;
                        that.filterBody.documentType = 2;
                        _info._jqGridColNames = ['日期', '单据编号', '凭证字号', '转出客户', '转入客户', '币别',
                            '实收金额', '部门', '业务员', 'sobId', 'isVoucher', 'voucherId'];
                    } else {
                        that.initInfo.pageType = 3;
                        that.filterBody.documentType = 3;
                        _info._jqGridColNames = ['日期', '单据编号', '凭证字号', '转出供应商', '转入供应商', '币别',
                            '实收金额', '部门', '业务员', 'sobId', 'isVoucher', 'voucherId'];
                    }

                    // _info._jqGridColNames = ['日期', '单据编号', '凭证字号', '客户','供应商','转出客户','转入客户','转出供应商', '转入供应商', '币别','实收金额', '部门', '业务员'];

                    _info._colModel = [

                        {
                            name: 'documentDate', index: 'orderDate', width: 90,
                            formatter: function (value, grid, rows, state) {
                                if (value === '合计') {
                                    return value;
                                } else {
                                    return value ? value.slice(0, 10) : '';
                                }
                            }

                        },
                        { name: 'billNumber', width: 80, align: "left" },
                        { name: 'voucherSize', width: 80, align: "right" },
                        { name: 'occurrenceObjectOne', width: 80, align: "right" },
                        { name: 'occurrenceObjectTwo', width: 80, align: "right" },
                        { name: 'coinStop', width: 80, align: "right" },
                        {
                            name: 'thisTiemCancellation', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2);
                            }
                        },
                        { name: 'department', width: 80, align: "right" },
                        { name: 'salesman', width: 80, align: "right" },
                        { name: 'sobId', hidden: true },
                        { name: 'isVoucher', hidden: true },
                        { name: 'voucherId', hidden: true }
                    ];
                    _info._url = baseURL + 'verificationSheet/querys?r=' + new Date().getTime();
                    _info._completeMethod = that.completeMethod;
                    break;
                case 13:
                case 14:
                case 15:
                case 16:
                    if (val === 13 || val === 15) {
                        that.initInfo.pageType = 1;
                        that.filterBody.documentType = 1;
                        _info._jqGridColNames = ['审核标志', '日期', '单据号', '单据类型',
                            '结算账户', '客户', '币别', '汇率', '收款金额', '收款金额(本位币)', '收款期限', '收入类别 ', '应结算金额',
                            '凭证字号', '摘要', '部门', '经手人', '制单人', '审核人', '审核日期', '打印次数', '备注', 'sobId', 'isVoucher', 'voucherId'];
                    } else {
                        that.initInfo.pageType = 2;
                        that.filterBody.documentType = 2;
                        _info._jqGridColNames = ['审核标志', '日期', '单据号', '单据类型',
                            '结算账户', '供应商', '币别', '汇率', '付款金额', '付款金额(本位币)', '付款期限', '支出类别', '应结算金额',
                            '凭证字号', '摘要', '部门', '经手人', '制单人', '审核人', '审核日期', '打印次数', '备注', 'sobId', 'isVoucher', 'voucherId'];
                    }

                    _info._colModel = [
                        {
                            name: 'auditStatus', width: 70,
                            formatter: function (value, grid, rows, state) {
                                if (value === '合计') {
                                    return value;
                                } else {
                                    return value === 2 ? "Y" : "N"
                                }
                            }
                        },
                        {
                            name: 'documentDate', index: 'orderDate', width: 90,
                            formatter: function (value, grid, rows, state) {
                            return value ? value.slice(0, 10) : '';
                            }
                        },
                        { name: 'documentNumber', width: 80, align: "left" },
                        { name: 'documentTypeName', width: 80, align: "left" },
                        { name: 'clearanceAccount', width: 80, align: "right" },
                        { name: 'occurrenceObject', width: 80, align: "right" },
                        { name: 'coinStop', width: 80, align: "right" },
                        { name: 'exchangeRate', width: 80, align: "right" },
                        { name: 'amountPaymentReceivedFor', width: 80, align: "right" },
                        { name: 'amountPaymentReceived', width: 80, align: "left" },
                        { name: 'receiptPaymentPeriod', width: 80, align: "right",formatter: function (value, grid, rows, state) {
                            return value ? value.slice(0, 10) : '';
                        }},
                        { name: 'incomeCategoryName', width: 80, align: "right" },
                        { name: 'payableAmountFor', width: 80, align: "right" },
                        // { name: 'settledAmount', width: 80, align: "right" },
                        { name: 'voucherSize', width: 80, align: "right" },
                        { name: 'summary', width: 80, align: "right" },
                        { name: 'department', width: 80, align: "right" },
                        { name: 'brokerage', width: 80, align: "right" },
                        { name: 'createName', width: 80, align: "right" },
                        { name: 'auditorName', width: 80, align: "right" },
                        { name: 'auditorDate', width: 80, align: "right" ,formatter: function (value, grid, rows, state) {
                            return value ? value.slice(0, 10) : '';
                        } },
                        { name: 'printingTimes', width: 80, align: "right" },
                        { name: 'remark', width: 80, align: "right" },
                        { name: 'sobId', hidden: true },
                        { name: 'isVoucher', hidden: true },
                        { name: 'voucherId', hidden: true }
                    ];
                    _info._url = baseURL + 'receivablePayableVouche/getOtherFilterNew?r=' + new Date().getTime();
                    _info._completeMethod = that.completeMethodOthPaymentReceip;
                    break;
                default:
                    break;
            }
            //console.log(_info, '====_info=');
            that.pageInit(_info);
        },
        _queryObject: function () {
            var that = this;
            var _url = baseURL + 'generatingCredentialOption/getCredentialOption';
            let _formData = new FormData();

            _formData.append("ownershipSystem",2);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    that.optionInfo = json.data;
                }
            }, (json) => { })

        },
        _queryTypeId: function (type) {
            var that = this;
            var _url = baseURL + 'VoucherTemplate/queryObjectType';
            let _formData = new FormData();
            _formData.append("objectTypeId", type);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    var _data = json.data.filter(function (item) {
                        return item.isDefault === 2;
                    });
                    that.dataList = _data;
                }
            }, (json) => { })

        },
        sortData (value, grid, rows, state) {
            let str = "";
            value.map(function (val, index) {
                if (typeof val === "number") {
                    val = accounting.formatMoney(val, '', 2);
                }
                str += "<div class='sumCol'>" + val + "</div>"
            })
            return str;
        },
        getColSum (name) {
            let rs = $(`td[aria-describedby='list_${name}']`);
            let sum = 0;
            if (rs.children("div.sumCol").length !== 0) {
                rs = $(`td[aria-describedby='list_${name}']`).children("div.sumCol")
            } else {
                rs = $(`td[aria-describedby='list_${name}']:not(:last)`)
            }
            rs.each((i, e) => {
                sum += accounting.unformat($(e).text()) * 1000
            })
            sum /= 1000;
            sum = accounting.formatMoney(sum, '', 2);
            return sum;
        },
        pageInit (info) {

            let that = this;
            // var _url = baseURL + 'paymentreceiptController/filtrate';
            // 处理事物类型的id,因为事务类型id是1-16，跟我们对不上，所以要转换。
            var id = that.initInfo.objectTypeId;
            if (id == 7 || id == 13) {
                that.filterBody.objectTypeId = 1;
            } else if (id == 8 || id == 14) {
                that.filterBody.objectTypeId = 2;
            } else if (id == 9 || id == 15) {
                that.filterBody.objectTypeId = 3;
            } else if (id == 10 || id == 16) {
                that.filterBody.objectTypeId = 4;
            } else if (id == 11) {
                that.filterBody.objectTypeId = 5;
            } else if (id == 12) {
                that.filterBody.objectTypeId = 6;
            } else if (id == 2) {
                that.filterBody.objectTypeId = 5;
            } else if (id == 4) {
                that.filterBody.objectTypeId = 2;
            } else if (id == 5) {
                that.filterBody.objectTypeId = 6;
            } else if (id == 6) {
                that.filterBody.objectTypeId = 4;
            } else {
                that.filterBody.objectTypeId = id;
            }
            that.selectListId = [];
            console.log("that.filterBody",JSON.stringify(that.filterBody))
            jQuery("#list").jqGrid(
                {
                    url: info._url,
                    postData: JSON.stringify(that.filterBody),
                    ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                    datatype: "json",
                    colNames: info._jqGridColNames,
                    colModel: info._colModel,
                    rowNum: 999999999,//一页显示多少条
                    // rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
                    // pager : '#pager',//表格页脚的占位符(一般是div)的id
                    // sortname: 'orderDate',//初始化的时候排序的字段
                    sortorder: "desc",//排序方式,可选desc,asc
                    mtype: "post",//向后台请求数据的ajax的类型。可选post,get
                    jsonReader: {
                        root: "data",
                    },
                    sortable: false,
                    styleUI: 'Bootstrap',
                    height: $(window).height() * 0.7,
                    viewrecords: true,
                    multiselect: true,
                    // caption: that.initInfo.pageTitle,//表格的标题名字
                    footerrow: true,
                    userDataOnFooter: true,
                    gridComplete: info._completeMethod,
                    beforeRequest : function(){
                       that.selectListId = [];
                    },
                    onCellSelect: function (rowid) {
                        let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        // console.log(rowData)
                        // that.selectListId = rowid;
                    },
                    ondblClickRow: function (rowid) {
                        // 双击事件
                        console.log(rowid, '==双击事件222');
                        that._gotoDetails(rowid)
                    },
                    onSortCol: function (index, iCol, sortorder) {  // 当点击排序列但是数据还未进行变化时触发此事件
                        // console.log(index, iCol, sortorder, '===index,iCol,sortorder==');
                    },
                    onSelectAll: function (aRowids, status) {  // 且点击头部的checkbox时才会触发此事件
                        console.log(aRowids, status, '===aRowids,status==');
                        status ? that.selectListId = aRowids : that.selectListId = [];
                    },
                    onSelectRow: function (rowid, status) {  // 当选择行时触发此事件
                        //由于腾腾（objectId=1-6）的数据结构与其它两种不一样，所以这里需要区分
                        if (id>=1 && id<=6){
                            //获取当前行
                            let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                            var entityId = rowData['paymentReceiptEntity.id'];
                            console.log(entityId);
                            if (status) {
                                that.selectListId.push(entityId); //选择行时就把id给存到selectListId数组中了
                            } else {
                                that.selectListId = that.selectListId.filter(v => v !== entityId);
                            }
                        }else{
                            console.log(rowid, status, '===rowid,status==');
                            if (status) {
                                that.selectListId.push(rowid); //选择行时就把id给存到selectListId数组中了
                            } else {
                                that.selectListId = that.selectListId.filter(v => v !== rowid);
                            }

                       }
                        console.log("当前选择的id==="+that.selectListId);
                    },
                })
        },
        completeMethod () {

            var sum_thisTiemCancellation = this.getColSum('thisTiemCancellation')

            $("#list").footerData('set', {
                "documentDate": '合计',
                'thisTiemCancellation': sum_thisTiemCancellation,
            });

        },
        completeMethodPaymentReceip () {

            var sum_reducedAmountFor = this.getColSum('paymentReceiptEntity.reducedAmountFor')
            var sum_reducedAmount = this.getColSum('paymentReceiptEntity.reducedAmount')
            var sum_watchPaymentFor = this.getColSum('paymentReceiptEntity.watchPaymentFor')
            var sum_watchPayment = this.getColSum('paymentReceiptEntity.watchPayment')
            var sum_documentaryAmountForList = this.getColSum('paymentReceiptEntity.documentaryAmountForList')
            var sum_documentaryAmountList = this.getColSum('paymentReceiptEntity.documentaryAmountList')
            var sum_cancellationAmountList = this.getColSum('paymentReceiptEntity.cancellationAmountList')
            var sum_notCancellationAmountList = this.getColSum('paymentReceiptEntity.notCancellationAmountList')
            var sum_thisTiemCancellationForList = this.getColSum('paymentReceiptEntity.thisTiemCancellationForList')
            var sum_thisTiemCancellationList = this.getColSum('paymentReceiptEntity.thisTiemCancellationList')

            $("#list").footerData('set', {
                "paymentReceiptEntity.auditMark": '合计',
                'paymentReceiptEntity.reducedAmountFor': sum_reducedAmountFor,
                'paymentReceiptEntity.reducedAmount': sum_reducedAmount,
                'paymentReceiptEntity.watchPayment': sum_watchPayment,
                'paymentReceiptEntity.watchPaymentFor': sum_watchPaymentFor,
                'paymentReceiptEntity.documentaryAmountForList': [sum_documentaryAmountForList],
                'paymentReceiptEntity.documentaryAmountList': [sum_documentaryAmountList],
                'paymentReceiptEntity.cancellationAmountList': [sum_cancellationAmountList],
                'paymentReceiptEntity.notCancellationAmountList': [sum_notCancellationAmountList],
                'paymentReceiptEntity.thisTiemCancellationForList': [sum_thisTiemCancellationForList],
                'paymentReceiptEntity.thisTiemCancellationList': [sum_thisTiemCancellationList],
            });

        },

        completeMethodOthPaymentReceip () {

            var sum_amountPaymentReceivedFors = this.getColSum('amountPaymentReceivedFor')
            var sum_amountPaymentReceiveds = this.getColSum('amountPaymentReceived')
            var sum_payableAmountFors = this.getColSum('payableAmountFor')
            var sum_settledAmounts = this.getColSum('settledAmount')

            $("#list").footerData('set', {
                "auditStatus": '合计',
                'amountPaymentReceivedFor': sum_amountPaymentReceivedFors,
                'amountPaymentReceived': sum_amountPaymentReceiveds,
                'payableAmountFor': sum_payableAmountFors,
                'settledAmount': sum_settledAmounts,

            });

        },

        handleOpen () {
            this.visible_filter = true;
        },
        detailClick (data) {

        },
        iconPopup (type) {
            this.subjectVisable = true;
        },
        //关闭选择科目弹窗
        subjectClose () {
            this.subjectVisable = false;
        },
        conformCancel () {
            this.confirmConfig.showConfirm = false;
        },
        conformSure () {
            this.confirmConfig.showConfirm = false;
            this.confirmConfig.onlySure = !this.confirmConfig.onlySure;
        },
        //点击保存，获取所选科目id
        subjectDate (value) {
            // this.search.ieSubject = value;
            // console.log(this.search.ieSubject);
        },
        delTable () {
            $("#list").empty();// 清空表格内容
            var parent = $(".jqGrid_wrapper"); // 获得整个表格容器
            parent.empty();
            $(`<table id="list"></table><div id="page"></div>`).appendTo(parent);
        },
        sure (type) {
            var that = this;
            if (type) {
                if (that.objectTypeIdNext === that.initInfo.objectTypeId) {
                    that.selectListId = [];
                    $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
                } else {
                    that.delTable();
                    $('#list').jqGrid("clearGridData");
                    $.jgrid.gridUnload("list");
                    //GridUnload , GridDestroy
                    // $('#list').remove();
                    // $('#gridContainer').empty();
                    that.id = '';
                    that._getTable(that.initInfo.objectTypeId);
                    var _info = Object.assign({}, that.initInfo);
                    that.objectTypeIdNext = _info.objectTypeId;

                }
            } else {

            }
            this.visible_filter = false;
        },

        // addRow () {
        //     // 打开页面方式 是新打开一个标签，待主体框架完善 TODO..  , 目前为模拟打开页面
        //     window.open(`${baseURL}modules/ReceivableWriteofflist/index.html`, '_blank')
        //     // 如果是在主题框架下，跳转页面的方式要换成下面的，-p为申明的对象,里面封装了所需要的ur了，以及其它参数。
        //     //window.activeEvent(_p);
        // },
        //
        // copyRow () {
        //     console.log("复制");
        //     if (this.id === '') {
        //         this.$Message.info({
        //             content: '请选择一条数据',
        //             duration: 3
        //         });
        //     } else {
        //         // 打开页面方式 是新打开一个标签，待主体框架完善 TODO..  , 目前为模拟打开页面
        //         window.open(`${baseURL}modules/ReceivableWriteofflist/index.htm?id=${this.id}`, '_blank')
        //     }
        //
        // },
        _gotoDetails (rowid) {
            var that = this;
            console.log("that.initInfo.objectTypeId",that.initInfo.objectTypeId)
            var _dtype = that.initInfo.objectTypeId;
            var _url = '', name = '';

            var _p = {
                'name': '收款单',
                'url': rcContextPath+'/paymentReceipt/index.html?type=1'
            }
            //获取当前行
            let rowData = jQuery("#list").jqGrid('getRowData', rowid);

            switch (_dtype) {
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                    var _id = rowData['paymentReceiptEntity.id']
                    if (_dtype === 1 || _dtype === 2 || _dtype === 3) {
                        //测试环境的跳转地址（能单独用浏览器跳转到新页面）
                        //_url = `${baseURL}modules/paymentReceipt/index.html?type=1&id=${rowid}&action=query`
                        //主题框架下的跳转地址必须换成下面的，否则无法跳转，并且函数为window.activeEvent(_p);：
                        _url = `${rcContextPath}/finance/paymentReceipt/index.html?type=1&id=${_id}&action=query`
                        name = '收款单'
                    } else {
                        // _url = `${baseURL}modules/paymentReceipt/index.html?type=2&id=${rowid}&action=query`
                        _url = `${rcContextPath}/finance/paymentReceipt/index.html?type=2&id=${_id}&action=query`
                        name = '付款单'
                    }
                    break;
                case 7:
                case 8:
                case 9:
                case 10:
                case 11:
                case 12:
                    name = '核销单';
                    // _url = `${baseURL}modules/ReceivableWriteofflist/index.html?id=${rowid}&sobId=${rowData.sobId}&action=query`
                    _url = `${rcContextPath}/finance/ReceivableWriteofflist/index.html?id=${rowid}&sobId=0&action=query`
                    break;
                case 13:
                case 14:
                case 15:
                case 16:
                    // _url = `${baseURL}modules/other-payment-receipt-time-book/other-payment-receipt-time-book.html?id=${rowid}&sobId=${rowData.sobId}&action=query`
                    if (_dtype === 13 || _dtype === 15) {
                        name = '其它收款单据';

                        _url = `${rcContextPath}/finance/otherReceipts/index.html?otherTypesDocument=1&id=${rowid}&action=query`;
                    } else {
                        name = '其它付款单据'
                        _url = `${rcContextPath}/finance/otherReceipts/index.html?otherTypesDocument=2&id=${rowid}&action=query`;
                    }
                    break;
                default:
                    break;
            }
            // 打开页面方式 是新打开一个标签，待主体框架完善 TODO..  , 目前为模拟打开页面
            //测试环境的跳转地址（能单独用浏览器跳转到新页面）
            // window.open(_url, '_blank')
            _p.name = name;
            _p.url = _url;
            //主题框架打开方式：
            window.parent.activeEvent(_p);

        },
        derivation () {
            console.log("引出")
        },
        print () {
            console.log("打印")
            window.print();
            // printJS('paymentReceiptTimeBook', 'html');
        },
        voucher () {
            console.log("凭证1111111")
        },
        //模板设置
        goPathOption () {
            // 打开页面方式 是新打开一个标签，待主体框架完善 TODO..  , 目前为模拟打开页面
            //window.open(`${baseURL}modules/VoucherTemplates/index.html`, '_blank')
            //主题框架下打开方式：
            var _p = {
                'name': '模板设置',
                'url': rcContextPath+'/finance/VoucherTemplates/index.html'
            }
            window.parent.activeEvent(_p);
        },
        // 按单|汇总 点击事件，点击后就生成凭证。
        selectRowAction (type) {
            var that = this;
            var _url = '';
            console.log(that.selectListId, '==选中的list:that.selectListId');
            //获取事物类型的id
            var oid = that.initInfo.objectTypeId;
            //调用公共方法，根据事务类型的id，进行分类
            var typeOid = that.getObjectType(oid);

            var parame = { "paramVOS": [] }; //无论是按单还是汇总，参数都为集合，装id
            that.selectListId.forEach(item => { //循遍遍历id集合that.selectListId
                var _info = { 'id': item };
                parame.paramVOS.push(_info);
            });
            if (type === 'summary') {   // 汇总

                if (typeOid == '1') {
                    _url = baseURL + 'paymentreceiptController/createVoucherN';
                } else if (typeOid == '2') {
                    // 调用接口
                    _url = baseURL + 'verificationSheet/setPoolVoucher';
                } else {
                    _url = baseURL + 'otherPaymentReceipt/createCollectVoucher';
                };

                http.post(_url, JSON.stringify(parame)).then((json) => {
                    //判断生成凭证是否成功
                    if (json.code === '100100') {
                        if (json.data.gcoe.abnormalErrorHandling === '4') {

                            var _h = `${rcContextPath}/finance/voucher-lrt/index.html?key=${json.data.key}&sys=${json.data.voucherVO.entity.belongSystem}&type=2`;
                            var _p = {
                                'name': '查看凭证',
                                'url': _h
                            }
                            window.parent.activeEvent(_p);
                        }
                        $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
                    }
                    //页面提示操作结果，显示三秒钟
                    that.$Message.info({
                        content: json.msg,
                        duration: 3
                    });
                    //显示提示框
                    // that.showVoucher(true);
                }, (json) => { });

            } else if (type === 'according') { // 按单

                that._ajaxAccording(typeOid, parame);

            } else if (type === 'bill') { // 单据
                console.log("that.selectListId[that.selectListId.length - 1]",that.selectListId[that.selectListId.length - 1])
                that._gotoDetails(that.selectListId[that.selectListId.length - 1]);
            } else if (type === 'voucher') { // 凭证
                let _d = jQuery("#list").jqGrid('getRowData', that.selectListId[that.selectListId.length - 1]);
                var _voucherId = 0;
                if (typeOid == '1') {
                    console.log("_d['paymentReceiptEntity.isVoucher']",_d['paymentReceiptEntity.isVoucher'],_d,that.selectListId)
                    //收付款单
                    if (_d['paymentReceiptEntity.isVoucher'] != '2') {
                        that.$Message.info({
                            content: '最后选取的单据号暂未生成凭证。',
                            duration: 3
                        });
                        return;
                    }
                    _voucherId = _d['paymentReceiptEntity.voucherId'];
                } else if (typeOid == '2') {
                    // 调用接口 核销单
                    console.log("_d",_d.voucherId);
                    if (_d.isVoucher != '2') {
                        that.$Message.info({
                            content: '最后选取的单据号暂未生成凭证。',
                            duration: 3
                        });
                        return;
                    }
                    _voucherId = _d.voucherId;
                } else {
                    //其他收付款
                    console.log("_d",_d.voucherId,_d);
                    if (_d.isVoucher != '2') {
                        that.$Message.info({
                            content: '最后选取的单据号暂未生成凭证。',
                            duration: 3
                        });
                        return;
                    }
                    _voucherId = _d.voucherId;
                };

                var _h = `${rcContextPath}/finance/voucher-lrt/index.html?voucherId=${_voucherId}&sobId=1`;
                var _p = {
                    'name': '查看凭证',
                    'url': _h
                }
                window.parent.activeEvent(_p);
            }
        },
        _ajaxAccording (typeOid, parame) {
            var that = this;
            var _url = '';
            if (typeOid == '1') {
                _url = baseURL + 'paymentreceiptController/createVoucherListX';
            } else if (typeOid == '2') {
                // 调用接口
                _url = baseURL + 'verificationSheet/setVouchers';
            } else {
                _url = baseURL + 'otherPaymentReceipt/createVoucher';
            };

            http.post(_url, JSON.stringify(parame)).then((json) => {
                //判断生成凭证是否成功
                if (json.code === '100100') {
                    if (json.data.gcoe.abnormalErrorHandling === '4') {
                        var _h = `${rcContextPath}/finance/voucher-lrt/index.html?key=${json.data.key}&sys=${json.data.voucherVO.entity.belongSystem}&type=2`;
                        var _p = {
                            'name': '查看凭证',
                            'url': _h
                        }
                        window.parent.activeEvent(_p);
                        that.showVoucher(false);
                        that.showVoucherVisibleClose();
                        return;
                    }
                    // that.voucherModelTxt = '生成凭证成功！'
                    // that.viewReportTxt = `报告内容！`.repeat(30);
                    if (json.data.gcoe.abnormalDataProcessing === '1') {
                        that.isContinue = false;
                    } else if (json.data.gcoe.abnormalDataProcessing === '2') {
                        that.isContinue = false;
                    } else if (json.data.gcoe.abnormalDataProcessing === '3') {

                        if (json.data.vses.length) {
                            that.selectListId = that.selectListId.filter(item => {
                                var _f = json.data.vses.filter(item2 => parseInt(item) === item2.id);
                                return !_f.length
                            });
                        }
                        that.selectListId.shift();
                        that.isContinue = that.selectListId.length ? true : false;
                        console.log(that.selectListId, '===that.selectListId==');
                    }
                    that.voucherModelTxt = json.data.vses.length === parame.paramVOS.length ? '生成凭证成功！' : '生成凭证失败！';
                    var _t = '报告内容：<br/>';
                    json.data.log.forEach((_item) => {
                        _t += `${_item} <br/> `;
                    })
                    that.viewReportTxt = _t;
                } else {
                    that.voucherModelTxt = '生成凭证失败！';
                    that.viewReportTxt = json.msg;
                };
                //显示提示框
                that.showVoucher(true);
            }, (json) => { });
        },
        accordingAction () {
            var that = this;
            if (that.isContinue) {
                //获取事物类型的id
                var oid = that.initInfo.objectTypeId;
                //调用公共方法，根据事务类型的id，进行分类
                var typeOid = that.getObjectType(oid);
                var parame = { "paramVOS": [] }; //无论是按单还是汇总，参数都为集合，装id
                that.selectListId.forEach((item, idx) => { //循遍遍历id集合that.selectListId
                    var _info = { 'id': item };
                    parame.paramVOS.push(_info);
                });

                that._ajaxAccording(typeOid, parame);
            } else {
                that.showVoucher(false);
                that.showVoucherVisibleClose();
            }

        },
        showVoucherVisibleClose () {

            $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
            this.selectListId = [];
            this.isContinue = false;
        },
        showOption () {
            this.showOptionVisible = true;
            this._queryTypeId(this.initInfo.objectTypeId);
        },
        closeOption () {
            this.showOptionVisible = false;
        },
        saveOption () {
            var that = this;
            console.log(that.optionInfo, '===that.optionInfo');
            var _url = baseURL + 'generatingCredentialOption/update';
            let _formData = new FormData();
            _formData.append("abnormalDataProcessing", parseInt(that.optionInfo.abnormalDataProcessing));
            _formData.append("abnormalErrorHandling", parseInt(that.optionInfo.abnormalErrorHandling));
            _formData.append("subjectMergerDebit", that.optionInfo.subjectMergerDebit);
            _formData.append("subjectMergerLender", that.optionInfo.subjectMergerLender);
            _formData.append("ownershipSystem",2);
            http.post(_url, _formData).then((json) => {
                if (json.code === '100100') {
                    // that.dataList = json.data;
                    that.closeOption();
                }
                that.$Message.info({
                    content: json.msg,
                    duration: 3
                });

            }, (json) => { })
        },
        //获取应收应付系统当前会计期间的第一天和最后一天
        _getData(){
            var that = this;
            var _url = baseURL + 'verificationSheet/getData';
            http.post(_url, '').then((json) => {
                if (json.code === '100100') {
                that.filterBody.timeStart = json.data.startDate;
                that.filterBody.timeEnd = json.data.endDate;
                console.log(" that.filterBody", that.filterBody)
                that._ajaxGetData();
            }
        }, (json) => { })
        },
        showVoucher (_bool) {
            this.showVoucherVisible = _bool;
        },
        showViewReport () {
            this.viewReportVisible = !this.viewReportVisible;
        },
        closeWindow: function () {
            //关闭当前页签
            var name = '应收应付生成凭证';
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, 'url': this.openTime, exit: true })
        },

        //抽取共同方法，判断事务类型的分类，简化代码
        getObjectType: function (oid) {
            var type = '';
            if (1 <= oid && oid <= 6) {
                type = '1';
            } else if (7 <= oid && oid <= 12) {
                type = '2';
            } else {
                type = '3';
            }
            return type;
        }
    },
    computed: {

        selectRowDisabled () {
            return (this.selectListId.length === 0);
        },


    },
    mounted () {
        console.log(layui.data('user'));
        this._getData();
        this._queryObject();
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
})