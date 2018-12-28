var vem = new Vue({
    el: '#other-payment-receipt-time-book',
    data () {
        return {
            isInit: true,
            showFilter: false,
            subjectVisable: false,
            visible_filter: false,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '这是内容',
                onlySure: true,
                success: true
            },
            dataSum:{
                sumAmountPaymentReceivedFor:'',
                sumAmountPaymentReceived:'',
                sumPayableAmount:''
            },
            filterBody: {
                timeStart: '',
                timeEnd: '',
                dateSource: '',
                auditStatus: '',
                isVoucher: '',
                documentNumber: ''
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
            openTime: "",
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
            // 保存主表id
            id: '',
            auditStatus: '',
            rowData:{},
        }
    },
    methods: {
        addVoucher () {
            //批量传集合
            let _parame = { "paramVOS": [] };
            let _id = { 'id': vem.rowData.id };
            _parame.paramVOS.push(_id);
            let _url = rcContextPath + '/otherPaymentReceipt/createVoucher';
            if (vem.rowData.id != null && vem.rowData.auditStatus == "Y" && vem.rowData.isVoucher==1) {
                $.ajax({
                    type: 'post',
                    async: true,
                    data: JSON.stringify(_parame),
                    url: _url,
                    dataType: 'json',
                    contentType: 'application/json;charset=utf-8',
                    success: function (d) {
                        var _txt = '';
                        if (d.code === '100100') {
                            _txt = '操作失败';
                            let v = d.data.vses.length;
                            if (v != 0) {
                                _txt = d.msg;
                                that.formData = (d.data.vses.length && d.data.vses[0]);
                                that.formData.isVoucher = 2;
                            }
                        } else {
                            _txt = d.msg;
                        }
                        vem.$Message.info({
                            content: _txt,
                            duration: 3
                        });
                    }
                })
            }else if (vem.rowData.auditStatus != "Y"){
                vem.$Message.info({
                    content:'该单据未审核,不能生成凭证',
                    duration:3
                })
            }else if (vem.rowData.isVoucher==2){
                vem.$Message.info({
                    content:'该单据已生成凭证',
                    duration:3
                })
            }
        },
        showVoucher () {
            //获取选择的数据
            let _voucherId = vem.rowData.voucherId;
            let _sobId = vem.rowData.sobId;
            let _name = '记账凭证'
            var _url = rcContextPath +'/finance/voucher-lrt/index.html?voucherId=' + _voucherId + '&sobId=' + _sobId;
            window.parent.activeEvent({ 'name': _name, 'url': _url });
        },
        refreshDisplay () {
            window.location.reload();
        },
        outHtml () {
            window.parent.closeCurrentTab({ name: name, openTime: this.openTime, exit: true })
        },
        print () {
            htPrint();
        },
        getRowData (rowid) {
            console.log(rowid)
        },
        sortData (value, grid, rows, state) {
            let str = "";
            (value || []).map(function (val, index) {
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
        pageInit () {
            let that = this;
            let otherTypesDocument = getUrlParam("otherTypesDocument");
            let initList = [];
            if (otherTypesDocument == 1) {
                initList = ['','','','', '审核标志', '日期', '单据号', '单据类型', '结算账户', '客户', '币别',
                    '汇率', '收款金额', '收款金额(本位币)', '收入类别', '收款期限', '应结算金额',
                    '凭证字号', '摘要', '部门', '经手人', '制单人', '审核人', '审核日期', '打印次数', '备注']
            } else if (otherTypesDocument == 2) {
                initList = ['','','','', '审核标志', '日期', '单据号', '单据类型', '结算账户', '供应商', '币别',
                    '汇率', '付款金额', '付款金额(本位币)', '支出类别', '付款期限', '应结算金额',
                    '凭证字号', '摘要', '部门', '经手人', '制单人', '审核人', '审核日期', '打印次数', '备注']
            }

            jQuery("#list").jqGrid(
                {
                    url: rcContextPath + "/otherPaymentReceipt/getPageByType",
                    postData: { otherTypesDocuments: otherTypesDocument },
                    datatype: "json",
                    // multiselect: true,
                    colNames: initList,
                    colModel: [
                        {
                            name: 'id', width: 70, hidden: true
                        },
                       {
                            name: 'voucherId', width: 70, hidden: true
                        },
                        {
                            name: 'isVoucher', width: 70, hidden: true
                        },
                       {
                            name: 'sobId', width: 70, hidden: true
                        },
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
                                return value.slice(0, 10)
                            }

                        },
                        { name: 'documentNumber', width: 80, align: "left" },
                        {
                            name: 'documentTypeName', width: 100, align: "left",
                        },
                        { name: 'clearanceAccount', width: 80, align: "left" },
                        { name: 'occurrenceObject', width: 80, align: "right" },
                        { name: 'coinStop', width: 80, align: "left" },
                        { name: 'exchangeRate', width: 60, align: "left" },
                        {
                            name: 'amountPaymentReceivedFors', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'amountPaymentReceiveds', width: 110, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'genrePaymentsReceiveds', width: 80, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return that.sortData(value, grid, rows, state);
                            }
                        },
                        {
                            name: 'receiptPaymentPeriod', width: 100, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return value.slice(0, 10)
                            }
                        },
                        {
                            name: 'payableAmount', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                return accounting.formatMoney(value, '', 2)
                            }
                        },
                        // {
                        //     name: 'settledAmount', width: 80, align: "right",
                        //     formatter: function (value, grid, rows, state) {
                        //         return accounting.formatMoney(value, '', 2)
                        //     }
                        // },
                        { name: 'voucherSize', index: 'typePaymentReceived', width: 80, align: "left" },
                        {
                            name: 'summary', width: 100, align: "left",
                        },
                        {
                            name: 'department', width: 80, align: "left",

                        },
                        {
                            name: 'brokerage', width: 100, align: "left",

                        },
                        {
                            name: 'createName', width: 100, align: "left",
                        },
                        {
                            name: 'auditorName', width: 100, align: "left",

                        },
                        {
                            name: 'auditorDate', width: 100, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return (value || '').slice(0, 10)
                            }
                        },
                        { name: 'printingTimes', width: 70, align: "right", },
                        {
                            name: 'remarks', width: 100, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return value=='null' ? '':value;
                            }
                        },

                    ],
                    rowNum: 99999999999,//一页显示多少条
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
                    height: $(window).height() -125,
                    viewrecords: true,
                    // caption: "其他收款单序时簿",//表格的标题名字
                    footerrow: true,
                    userDataOnFooter: true,
                    gridComplete: that.completeMethod,
                    cellEdit: true,
                    onCellSelect: function (rowid) {
                        var rowData = jQuery("#list").jqGrid('getRowData', rowid);
                        console.log(rowData,'=====rowData')
                        // 用于保存主表id 确保后续操作
                        vem.rowData = rowData;
                    },
                    ondblClickRow: function (rowid) {
                        // 双击事件
                        console.log(rowid, '====rowid')
                        let otherTypesDocument = getUrlParam("otherTypesDocument");
                        let _name = '';
                        if (otherTypesDocument == '1') {
                            _name = '其它收款单';
                        } else if (otherTypesDocument == '2') {
                            _name = '其它付款单';
                        }
                        _url = contextPath+'/finance/otherReceipts/index.html?otherTypesDocument=' + otherTypesDocument + '&id=' + rowid + '&action=query';
                        window.parent.activeEvent({ 'name': _name, 'url': _url });
                    }
                })
        },
        completeMethod () {
            $("#list").footerData('set', {
                "auditStatus": '合计',
                'amountPaymentReceivedFors': [0],
                'amountPaymentReceived': [0]
            });
            var sum_payableAmount = this.getColSum('payableAmount')
            // var sum_settledAmount = this.getColSum('settledAmount')
            var sum_amountPaymentReceivedFors = this.getColSum('amountPaymentReceivedFors')
            var sum_amountPaymentReceiveds = this.getColSum('amountPaymentReceiveds')

            vem.dataSum.sumPayableAmount = this.getColSum('payableAmount')
            vem.dataSum.sumAmountPaymentReceivedFor = this.getColSum('amountPaymentReceivedFors')
            vem.dataSum.sumAmountPaymentReceived = this.getColSum('amountPaymentReceiveds')
            $("#list").footerData('set', {
                "auditStatus": '合计',
                'payableAmount': sum_payableAmount,
                // 'settledAmount': sum_settledAmount,
                'amountPaymentReceivedFors': [sum_amountPaymentReceivedFors],
                'amountPaymentReceiveds': [sum_amountPaymentReceiveds],
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
            this.search.ieSubject = value;
            console.log(this.search.ieSubject);
        },
        delRow () {
            console.log(vem.rowData);
            if (vem.rowData.id != null && vem.rowData.auditStatus != "Y") {
                $.ajax({
                    type: 'POST',
                    async: true,
                    data: {
                        id: vem.rowData.id,
                        auditStatus: 1
                    },
                    url: rcContextPath + '/otherPaymentReceipt/deleteById',
                    dataType: 'json',
                    success: function (d) {
                        if (d.code == '100100') {
                            vem.$Message.info({
                                content:'数据删除成功',
                                duration:3
                            })
                            //刷新表格
                            window.location.reload();
                        } else {
                            vem.$Message.info({
                                content:'数据删除失败',
                                duration:3
                            })
                            // layer.alert(d.msg);
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else {
                alert("请选择未审核的数据行")
            }
        },
        sure (type) {
            console.log(vem.filterBody)
            if (type) {
                vem.pageInit();
                jQuery("#list").jqGrid('setGridParam', {
                    url: rcContextPath + '/otherPaymentReceipt/getPageByFilter',
                    postData: vem.filterBody
                }).trigger("reloadGrid");
            }
            this.visible_filter = false;
        },
        addRow () {
            let otherTypesDocument = getUrlParam("otherTypesDocument");
            let _name = '';
            let _url = rcContextPath + '/otherReceipts/index.html?otherTypesDocument=' + otherTypesDocument;

            if (otherTypesDocument == '1') {
                _name = '其他收款单';
            } else if (otherTypesDocument == '2') {
                _name = '其他付款单';
            }
            window.parent.activeEvent({ 'name': _name, 'url': _url });
        },
        copyRow () {
            let otherTypesDocument = getUrlParam("otherTypesDocument");
            let _url = rcContextPath + '/otherReceipts/index.html?otherTypesDocument=' + otherTypesDocument + '&copyOtherTypesDocumentId=' + vem.id;
            // +'otherTypesDocumentId='+vem.id
            let _name = '';
            if (otherTypesDocument == '1') {
                _name = '其他收款单';
            } else if (otherTypesDocument == '2') {
                _name = '其他付款单';
            }
            window.parent.activeEvent({ 'name': _name, 'url': _url });
        },
        review () {
            let that = this;
            if (vem.rowData.id != null && vem.rowData.auditStatus != "Y") {
                $.ajax({
                    type: 'post',
                    async: true,
                    data: { id: vem.rowData.id, auditStatus: 1 },
                    url: rcContextPath + '/otherPaymentReceipt/executeAudit',
                    dataType: 'json',
                    success: function (d) {
                        if (d.code == "100100") {
                            // alert("审核成功！");
                            //刷新表格
                            // window.location.reload();
                            that.$Message.info({
                                content: "审核成功",
                                duration: 3
                            });
                            $("#list").trigger('reloadGrid');
                        } else {
                            that.$Message.info({
                                content: d.msg,
                                duration: 3
                            });
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            } else {
                that.$Message.info({
                    content: "已审核数据不能再进行审核！",
                    duration: 3
                });
            }

        },
        reReview () {
            let that = this;
            var s = vem.rowData.auditStatus;
            if (s == 'Y') {
                s = 2;
            } else{
                s = 1;
            }
            $.ajax({
                type: 'post',
                async: true,
                data: { id: vem.rowData.id, auditStatus: s },
                url: rcContextPath + '/otherPaymentReceipt/reverseAudit',
                dataType: 'json',
                success: function (d) {
                    if (d.code == "100100") {
                        that.$Message.info({
                            content: "反审核成功",
                            duration: 3
                        });
                        $("#list").trigger('reloadGrid');
                    } else {
                        that.$Message.info({
                            content: d.msg,
                            duration: 3
                        });
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        derivation () {
            let otherTypesDocuments = getUrlParam("otherTypesDocument");
            let jsObj= vem.filterBody;
            let sumAmountPaymentReceivedFor = vem.dataSum.sumAmountPaymentReceivedFor;
            let sumAmountPaymentReceived = vem.dataSum.sumAmountPaymentReceived;
            let sumPayableAmount = vem.dataSum.sumPayableAmount;
            window.frames.exportIframe.location.href = contextPath+'/otherPaymentReceipt/exportExcel?otherTypesDocuments='+otherTypesDocuments+
                                                        '&sumAmountPaymentReceivedFor='+sumAmountPaymentReceivedFor+
                                                        '&sumAmountPaymentReceived='+sumAmountPaymentReceived+
                                                        '&sumPayableAmount='+sumPayableAmount+
                                                        '&timeStart='+jsObj.timeStart+
                                                        '&timeEnd'+jsObj.timeEnd+
                                                        '&dateSource'+jsObj.dateScore+
                                                        '&auditStatus'+jsObj.auditStatus+
                                                        '&isVoucher'+jsObj.isVoucher+
                                                        '&documentNumber'+jsObj.documentNumber

        },
        print () {
            console.log("打印")
        }
    },
    mounted () {
        this.pageInit();
        this.openTime = window.parent.params && window.parent.params.openTime;
    }
})