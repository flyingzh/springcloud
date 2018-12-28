new Vue({
    el: '#paymentReceiptTimeBook',
    data () {
        var that = this;
        return {
            openTime: '',
            curDate: (new Date()).format("yyyy-MM-dd"),
            initInfo: {
                pageType: 1,
                pageTitle: '收款单序时簿'
            },
            isInit: true,
            showFilter: false,
            subjectVisable: false,
            visible_filter: false,
            deleteVisible: false,
            deleteLoading: true,
            // 保存主表id
            id: '',
            sobId: '',
            voucherId: '',
            auditStatus: '',
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            filterBody: {
                timeStart: (new Date()).format("yyyy-MM-dd"),
                timeEnd: (new Date()).format("yyyy-MM-dd"),
                documentType: 0,
                dateScore: '',
                auditStatus: '',
                isVoucher: '',
                documentNumber: '',
                sobId: 0
            },
            detailDate: [
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
            ],
            colNames: [],
            base_config: {
                postData: JSON.stringify(that.filterBody),
                ajaxGridOptions: { contentType: 'application/json;charset=utf-8' },
                datatype: "json",
                colModel: [
                    {
                        name: 'paymentReceiptEntity.auditMark', width: 70,
                        formatter: function (value, grid, rows, state) {
                            return value === 2 ? "Y" : "N"
                        }
                    },
                    {
                        name: 'paymentReceiptEntity.orderDate',
                        index: 'orderDate',
                        sortable: true,
                        sortorder: "asc",
                        width: 90,
                        formatter: function (value, grid, rows, state) {
                            return value.slice(0, 10)
                        }
                    },
                    { name: 'paymentReceiptEntity.documentNumber', width: 80, align: "left" },
                    {
                        name: 'financeSourceSingleDataEntities', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let str = "";
                            rows.financeSourceSingleDataEntities.map(function (val, index) {
                                if (val.sourceListNumber){
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
                    {
                        name: 'paymentReceiptEntity.typePaymentReceived',
                        index: 'typePaymentReceived',
                        width: 120,
                        align: "right",
                        formatter: function (value, grid, rows, state) {
                            let typeStr = '';

                            switch (value) {
                                case 1:
                                    typeStr = '收款单';
                                    break;
                                case 2:
                                    typeStr = '付款单';
                                    break;
                                case 3:
                                    typeStr = '预收款单';
                                    break;
                                case 4:
                                    typeStr = '预付款单';
                                    break;
                                case 5:
                                    typeStr = '收款退款单';
                                    break;
                                case 6:
                                    typeStr = '付款退款单';
                                    break;
                                default:
                                    typeStr = '';
                                    break;
                            }
                            return typeStr;
                        }
                    },
                    {
                        name: 'financeSourceSingleDataEntities', width: 80, align: "right",
                        formatter: function (value, grid, rows, state) {
                            let str = "";
                            rows.financeSourceSingleDataEntities.map(function (val, index) {
                                str += val.documentDate + "<br>"
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
                    { name: 'paymentReceiptEntity.auditDate', width: 80, align: "right" },
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
                    { name: 'paymentReceiptEntity.id', hidden: true },
                    { name: 'paymentReceiptEntity.sobId', hidden: true },
                    { name: 'paymentReceiptEntity.voucherId', hidden: true },
                ],
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
                height: $(window).height() - 120,
                viewrecords: true,
                // caption: that.initInfo.pageTitle,//表格的标题名字
                footerrow: true,
                userDataOnFooter: true,
                gridComplete: that.completeMethod,
                onCellSelect: function (rowid) {
                    let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                    var _id = rowData['paymentReceiptEntity.id'];
                    var _sobId = rowData['paymentReceiptEntity.sobId'];
                    var _voucherId = rowData['paymentReceiptEntity.voucherId'];
                    console.log(rowData);
                    console.log("主表id: " + _id);
                    console.log("账套id: " + _sobId);
                    console.log("凭证id: " + _voucherId);
                    console.log("审核标志: " + rowData['paymentReceiptEntity.auditMark']);
                    // 用于保存主表id 确保后续操作
                    that.id = _id;
                    that.sobId = _sobId;
                    that.voucherId = _voucherId;
                    that.auditStatus = rowData['paymentReceiptEntity.auditMark'] || '';
                },
                ondblClickRow: function (rowid) {
                    // 双击事件
                    // console.log(7574777579757)
                    let rowData = jQuery("#list").jqGrid('getRowData', rowid);
                    var _id = rowData['paymentReceiptEntity.id'];
                    var _url = '';
                    if (that.initInfo.pageType === '1') {
                        _url = `/web/finance/paymentReceipt/index.html?type=1&id=${_id}&action=query`;
                        window.parent.activeEvent({ 'name': '收款单', 'url': _url });
                    } else {
                        _url = _url = `/web/finance/paymentReceipt/index.html?type=2&id=${_id}&action=query`;
                        window.parent.activeEvent({ 'name': '付款单', 'url': _url });
                    }
                }
            }
        }
    },
    methods: {
        // sortData(value, grid, rows, state) {
        //     let str = "";
        //     console.log(value)
        //     value.map(function (val, index) {
        //         str += "<div class='sumCol'>"+val + "</div>"
        //     })
        //     return str;
        // },
        // getColSum(name){
        //     let sum = 0;
        //     $(`td[aria-describedby='list_${name}']`).children("div.sumCol").each((i,e)=>{
        //         sum += parseFloat($(e).text())*1000
        //     })
        //     return sum/1000 ;


        // },
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
        gridInit () {
            var _url = baseURL + 'paymentreceiptController/filtrate';
            let config = Object.assign({}, this.base_config, {
                url: _url,
                colNames: this.colNames,
                postData: JSON.stringify(this.filterBody),
            });
            jQuery("#list").jqGrid(config);
        },
        pageInit () {
            var _type = getUrlParam('type');
            this.initInfo.pageType = _type;
            this.filterBody.documentType = _type;
            if (_type === '1') {
                this.colNames = ['审核标志', '日期', '单据号', '源单编号', '结算账号', '折扣科目', '折后金额', '折后金额本位币',
                    '凭证字号', '整单折扣', '币别', '汇率', '表头收款金额', '表头收款金额本位币', '收款单据类型',
                    '单据日期', '单据金额', '单据金额本位币', '已核销金额', '未核销金额', '本次核销', '本次核销本位币', '发票币别', '表体汇率',
                    '摘要', '部门', '主管', '客户', '业务员', '制单人', '审核人', '审核日期', '打印次数', '备注', 'peId', 'peSobId', 'peVoucherId'];
                this.initInfo.pageTitle = '收款单序时簿';
            } else if (_type === '2') {
                this.colNames = ['审核标志', '日期', '单据号', '源单编号', '结算账号', '折扣科目', '折后金额', '折后金额本位币',
                    '凭证字号', '整单折扣', '币别', '汇率', '表头付款金额', '表头付款金额本位币', '付款单据类型',
                    '单据日期', '单据金额', '单据金额本位币', '已核销金额', '未核销金额', '本次核销', '本次核销本位币', '发票币别', '表体汇率',
                    '摘要', '部门', '主管', '供应商', '业务员', '制单人', '审核人', '审核日期', '打印次数', '备注', 'peId', 'peSobId', 'peVoucherId'];
                this.initInfo.pageTitle = '付款单序时簿';
            }
            this.gridInit();
            // var parame = JSON.stringify({
            //     "objectTypeId": "",
            //     "dateScore": "",
            //     "timeStart": "",
            //     "timeEnd": "",
            //     "currPage": "",
            //     "otherTypesDocuments": "",
            //     "auditStatus": "",
            //     "documentType": "",
            //     "auditMark": "",
            //     "isVoucher": "",
            //     "documentNumber": "",
            // });
            // let that = this;
            // jQuery("#list").jqGrid()
        },
        completeMethod () {
            $("#list").footerData('set', {
                "paymentReceiptEntity.orderDate": '合计',
                'paymentReceiptEntity.documentaryAmountForList': [0],
                'paymentReceiptEntity.documentaryAmountList': [0],
                'paymentReceiptEntity.cancellationAmountList': [0],
                'paymentReceiptEntity.notCancellationAmountList': [0],
                'paymentReceiptEntity.thisTiemCancellationForList': [0],
                'paymentReceiptEntity.thisTiemCancellationList': [0],
            });
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
                "paymentReceiptEntity.orderDate": '合计',
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
        sure (type) {
            console.log(this.filterBody);
            if (type === false) {

            } else {
                $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
            }
            this.visible_filter = false;
        },
        addRow () {
            //新增,跳转至对应单据页面进行新增
            var that = this;
            console.log("add");
            var _url = '';
            if (that.initInfo.pageType === '1') {
                _url = `/web/finance/paymentReceipt/index.html?type=1&id=${this.initInfo.pageType}&action=add`;
                window.parent.activeEvent({ 'name': '收款单', 'url': _url });
            } else {
                _url = _url = `/web/finance/paymentReceipt/index.html?type=2&id=${this.initInfo.pageType}&action=add`;
                window.parent.activeEvent({ 'name': '付款单', 'url': _url });
            }
        },
        delRow () {
            console.log("del")
            if (this.id === '') {
                this.$Message.info({
                    content: '请选择要删除的数据',
                    duration: 3
                });
            } else {
                this.deleteVisible = true;
            }

        },
        // 删除 单据
        deleteOK: function () {
            var that = this;
            var _url = baseURL + 'paymentreceiptController/delete';
            let _formData = new FormData();
            _formData.append('id', that.id);
            http.post(_url, _formData).then((d) => {
                var _txt = '';
                if (d.code === '100100') {
                    $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
                    _txt = d.msg;
                } else {
                    _txt = d.msg;
                    //that.deleteLoading =false;
                }
                that.deleteVisible = false;
                that.id = '';
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });
            }, (d) => {
                //console.log(json, '==处理请求fail');
            })

        },
        copyRow () {
            /*      暂时不做这个功能
                        console.log("进行复制");
                        if (this.id === '') {
                            this.$Message.info({
                                content: '请选择一条数据',
                                duration: 3
                            });
                        } else {
                            //新增,跳转至对应单据页面进行新增
                            var that = this;
                            var _url = '';
                            alert("准备复制: "+that.id);
                            if (that.initInfo.pageType === '1') {
                                _url = `/web/finance/paymentReceipt/index.html?type=1&id=${that.id}&action=doCopy`;
                                window.parent.activeEvent({ 'name': '收款单', 'url': _url });
                            } else {
                                _url = _url = `/web/finance/paymentReceipt/index.html?type=2&id=${that.id}&action=doCopy`;
                                window.parent.activeEvent({ 'name': '付款单', 'url': _url });
                            }
                        }*/

        },
        refresh () {
            //刷新
            console.log("执行刷新...");
            $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
        },
        reviewAction (type) {
            var that = this;
            var _bool = false, _msg = '';

            if (that.id === '') {
                _bool = true;
                _msg = '请选择一条数据';
            } else {
                type === 'review' && that.auditStatus === 'Y' && (_bool = true, _msg = '该单据已审核');
                type === 'reReview' && that.auditStatus === 'N' && (_bool = true, _msg = '该单据未审核');
            }

            if (_bool) {
                that.$Message.info({
                    content: _msg,
                    duration: 3
                });
                return;
            }

            var _url = '';
            if (that.auditStatus === 'N') {
                _url = baseURL + 'paymentreceiptController/audit';
            } else {
                _url = baseURL + 'paymentreceiptController/counterAudit';
            }

            let _formData = new FormData();
            _formData.append('id', that.id);
            http.post(_url, _formData).then((d) => {
                var _txt = '';
                if (d.code === '100100') {
                    //成功后执行一次刷新
                    $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
                    _txt = d.msg;

                } else {
                    _txt = d.msg;
                }
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });
            }, (d) => {
                //TODO 处理请求fail
                //console.log(json, '==处理请求fail');
            })
        },
        reReview () {
            console.log("反审核跟上面的审核使用同一个功能.")
        },
        derivation () {
            console.log("引出,导出excel...");
            var data = '';
            for (let key in this.filterBody) {
                data += `${key}=${this.filterBody[key]}&`;
            }
            data = data.slice(0, data.length - 1);
            window.open(`/web/paymentreceiptController/exportPaymentReceiptTimeBook?${data}`);
        },
        print () {
            console.log("序时簿准备打印.htPrint()");
            htPrint();
            //window.print();
            // printJS('paymentReceiptTimeBook', 'html');
        },
        checkVoucher () {
            //查看凭证
            var that = this;
            console.log("查看凭证前校验: 凭证id为: ===" + that.voucherId + ", 账套id为:===" + that.sobId);
            if (that.voucherId === '0' || that.voucherId === '') {
                that.$Message.info({
                    content: '请选择单据,或者该单据未生成凭证.',
                    duration: 3
                });
                return;
            }

            var _voucherId = that.voucherId;
            var _sobId = that.sobId;
            //var _url = `voucher-lrt/index.html?voucherId=${_voucherId}&sobId=${_sobId}`;
            let _url = contextPath + '/finance/voucher-lrt/index.html?voucherId=' + _voucherId + "&sobId=" + _sobId;
            //let url = 'voucher-lrt/index.html?voucherId='+rowData.voucherId+"&sobId="+rowData.sobId;
            window.parent.activeEvent({ name: '查看凭证', url: _url, params: null });
        },
        createVoucher () {
            //生成凭证
            var that = this;
            var _url = baseURL + 'paymentreceiptController/createVoucher';
            let _formData = new FormData();
            _formData.append('id', that.id);
            http.post(_url, _formData).then((d) => {
                var _txt = '';
                if (d.code === '100100') {
                    //成功后执行一次刷新
                    $('#list').setGridParam({ postData: JSON.stringify(this.filterBody) }).trigger("reloadGrid");
                    _txt = d.msg;

                } else {
                    _txt = d.msg;
                }
                that.$Message.info({
                    content: _txt,
                    duration: 3
                });
            }, (d) => {
                //TODO 处理请求fail
                //console.log(json, '==处理请求fail');
            })
        },
        closeWindow: function () {
            //关闭当前页签
            var that = this;
            var name = '';
            if (that.filterBody.documentType === '1') {
                name = '收款单序时簿';
            } else {
                name = '付款单序时簿';
            }
            window.parent.closeCurrentTab({ 'name': name, 'openTime': this.openTime, exit: true })
        },
    },
    mounted () {
        let _type = getUrlParam('type');
        this.initInfo.pageType = _type;
        this.filterBody.documentType = _type;
        if (_type === '1') {
            this.initInfo.pageTitle = '收款单序时簿';
        } else if (_type === '2') {
            this.initInfo.pageTitle = '付款单序时簿';
        }
        this.pageInit();
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
})