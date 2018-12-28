function alertMsgMsg(content,icon){
    if(icon === 2){
        testDocumentReport.$Modal.info({content:content});
    } else if (icon === 3){
        testDocumentReport.$Modal.warning({content:content});
    }else{
        testDocumentReport.$Modal.success({content:content});
    }
}
var testDocumentReport = new Vue({
    el: '#testDocumentReport',
    data() {
        let This = this;
        return {
            //启用多级审核时单据上的操作——审核
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //审批数据绑定
            approvement: {
                receiptsId: '',
                approvalResult: '1',
                approvalInfo: '',
            },
            //驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
            },
            //审批进度条
            steplist: [],
            stepData: [
                {
                    currentLevel: 1,
                    subtitle: '一级审批'
                },
                {
                    currentLevel: 2,
                    subtitle: '二级审批'
                },
                {
                    currentLevel: 3,
                    subtitle: '三级审批'
                },
                {
                    currentLevel: 4,
                    subtitle: '四级审批'
                },
                {
                    currentLevel: 5,
                    subtitle: '五级审批'
                },
                {
                    currentLevel: 6,
                    subtitle: '六级审批'
                },
                {
                    currentLevel: 7,
                    subtitle: '结束'
                },
            ],
            currentStep: '',
            nextStep: '',
            isShow: false,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            isTabulationHide: true,
            isHide: true,
            openTime: '',
            selected: [],
            dataValue: [],
            categoryType: [],
            commodityCategoty: [],
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            shopType: [],
            inspector: [],
            businessType: [],
            documentStatus: [],
            body: {
                testDocumentCode: '',
                businessType: '',
                startTime: '',
                endTime: '',
                sourceDocumentCode: '',
                documentStatus: '',
                productType: '',
                inspectorName: ''
            },
            reportDocument: {
                id: '',
                testDocumentId: '',
                documentStatus: '',
                delStatus: '',
                organizationId: ''
            },
            addBody: {
                testDocumentId: '',
                documentCode1: '',
                businessType: '',
                documentTime: '',
                inspectorName: '',
                examineVerifyName: '',
                documentType: '',
                documentCode: '',
                productTypeName: '',
                testTotalAmount: '',
                qualifiedTotalAmount: '',
                unqualifiedTotalAmount: '',
                qualifiedPercent: '',
                testResult1: '',
                documentStatus: '',
                testedOrganizationName: '',
                testWay: '',
                id: ''
            },
            data_config: {
                url: contextPath + '/testReportDocumentController/queryListByPage',
                colNames: ['', '', '报告单号', '检验类型', '单据日期', '被检组织', '质检员', '审批人', '源单类型', '送检编号', '商品类型', '检验总数量', '合格总数', '不合格总数', '合格率', '检验结果',''],
                colModel: [
                    {
                        name: 'testDocumentId',
                        index: 'testDocumentId',
                        width: 180,
                        align: "right",
                        hidden: true,
                        key: true,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.document1Detail({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'documentStatus', index: 'documentStatus', width: 120, align: "left", hidden: true},
                    {
                        name: 'documentCode1', index: 'documentCode1', width: 180, align: "lfet",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.document1Detail({value, grid, rows, state})
                            });
                            return `<a class="detail${value}">${value}</a>`;
                        }
                    },
                    {
                        name: 'businessType', index: 'businessType', width: 120, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return testDocumentReport.formatDict(value);
                        }
                    },
                    {
                        name: 'documentTime', index: 'documentTime', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'testedOrganizationName', index: 'testedOrganizationName', width: 120, align: "left",
                        formatter: function (value, grid, row, state) {
                            if (row.businessType === 'mdjy' || row.businessType === 'kcjy') {
                                return value;
                            } else {
                                return "";
                            }
                        }
                    },
                    {name: 'inspectorName', index: 'inspectorName', width: 100, align: "left"},
                    {
                        name: 'approvalUser', index: 'approvalUser', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value ? value : '';
                        }
                    },
                    {
                        name: 'documentType', index: 'documentType', width: 120, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return testDocumentReport.formatDict(value);
                        }
                    },
                    {name: 'documentCode', index: 'documentCode', width: 180, align: "left"},
                    {name: 'productTypeName', index: 'productTypeName', width: 100, align: "left"},
                    {name: 'testTotalAmount', index: 'testTotalAmount', width: 100, align: "right"},
                    {name: 'qualifiedTotalAmount', index: 'qualifiedTotalAmount', width: 100, align: "right"},
                    {name: 'unqualifiedTotalAmount', index: 'unqualifiedTotalAmount', width: 100, align: "right"},
                    {
                        name: 'qualifiedPercent', index: 'qualifiedPercent', width: 100, align: "right",
                        formatter: function (value, grid, rows, state) {
                            if (value > 1) {
                                return value.toFixed(2) + '%';
                            } else if (!value) {
                                return "";
                            }
                            return value ? (Math.round(value * 10000) / 100).toFixed(2) + '%' : '';
                        }
                    },
                    {
                        name: 'testResult1', index: 'testResult1', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return testDocumentReport.formatDict(value);
                        }
                    },
                    {
                        name: 'reportDocCode', index: 'reportDocCode', width: 100, align: "left",
                        hidden:true,
                    }
                ],
                shrinkToFit: false,
            },
        }
    },
    methods: {
        handleClearSelect(name){
            this.$refs[name].reset();
            this.$nextTick(()=>{
                this.body[name] = '';
            });
        },
        changeDate(value) {
            if(!(value[0] && value[1])){
                this.body.startTime = null;
                this.body.endTime = null;
            }else {
                this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
                this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
            }
        },
        search() {
            if (this.commodityCategoty.length > 0) {
                this.body.productType = this.commodityCategoty[this.commodityCategoty.length - 1];
            } else {
                this.body.productType = "";
            }
            this.reload = !this.reload;
        },
        clear() {
            if (this.body.inspectorName) {
                this.$refs.inspectorName.reset();
                this.$nextTick(() => {
                    this.body.inspectorName = '';
                });
            }
            this.body.testDocumentCode = '';
            this.body.businessType = '';
            this.body.startTime = '';
            this.body.endTime = '';
            this.body.testDocumentCode = '';
            this.body.sourceDocumentCode = '';
            this.body.documentStatus = '';
            this.body.productType = '';
            this.dataValue = [],
            this.commodityCategoty = [];


        },
        del() {
            let ids = this.selected;
            if (this.selected.length === 0) {
                alertMsgMsg('请选择至少一条数据!', 3);
                return;
            }
            $.ajax({
                url: contextPath + '/testReportDocumentController/delete',
                method: 'post',
                dataType: "json",
                data: JSON.stringify(ids),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === '100100' && res.msg.indexOf('删除成功') !== -1) {
                        alertMsgMsg(res.msg ? res.msg.replace(/;/g,"<br/>") : '删除成功!');
                        testDocumentReport.reload = !testDocumentReport.reload;
                    } else {
                        alertMsgMsg(res.msg, 2);
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });

        },
        commit() {
            if (this.selected.length === 0) {
                alertMsgMsg('请选择至少一条数据!',2);
                return;
            }
            let testDocumentId = this.selected;
            $.ajax({
                url: contextPath + '/testReportDocumentController/commit',
                method: 'post',
                dataType: "json",
                data: JSON.stringify(testDocumentId),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === '100100') {
                        alertMsgMsg(res.msg ? res.msg.replace(/;/g,"<br/>") : '提交成功!');
                        testDocumentReport.reload = !testDocumentReport.reload;
                        testDocumentReport.reportDocument.documentStatus = '待审核';
                    } else {
                        alertMsgMsg(res.msg,2);
                    }

                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //检验单详情
        pre() {
            if (this.selected.length === 0) {
                alertMsgMsg('请选择一条数据!', 2);
                return;
            }
            if (this.selected.length > 1) {
                alertMsgMsg('只能选择一条数据!', 2);
                return;
            }
            let codes = [];
            let rowData = jQuery("#myTable").jqGrid("getRowData", this.selected[0]);
            let code = rowData.documentCode1;
            codes = code.split(">");
            let code2 = codes[1].split("<")[0];
            if (code2) {
                this.queryDocument1(code2, true);
            }
        },
        queryDocument1(code2, isEdit) {
            $.ajax({
                type: "POST",
                data: {"documentCode": code2},
                url: contextPath + "/testReportDocumentController/findTestDocumentByDocumentCode",
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        var type = result.data.documentType;
                        var code = result.data.documentCode;
                        if (type == "kcjyd" || type == "mdjyd") { //无源单
                            window.parent.activeEvent({
                                name: '查看检验单',
                                url: contextPath + '/quality/inventory/test-document.html',
                                params: {docCode: code, activeType: 'query'}
                            });
                        } else {  //有源单
                            window.parent.activeEvent({
                                name: '查看检验单',
                                url: contextPath + '/quality/test-document/test-document.html',
                                params: {code: code, type: 1}
                            });
                        }
                    }
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试！",2);
                },
            });
        },

        show() {
        },
        reloadAgain() {
            testDocumentReport.isShow = false;
            testDocumentReport.reload = !testDocumentReport.reload;
        },
        cancel() {
            window.parent.closeCurrentTab({name: '检验报告单', openTime: this.openTime, exit: true})
        },
        //新增检验报告单
        document1Detail(data) {
            let sourceCode = data.rows.documentCode;
            let code = data.rows.documentCode1;
            let testDocumentId = '';
            testDocumentId = data.rows.testDocumentId;
            if (sourceCode) {
                window.parent.activeEvent({
                    name: '检验报告单详情',
                    url: contextPath + '/quality/quality/inspection-report.html',
                    params: {code, testDocumentId}
                });
            } else {
                window.parent.activeEvent({
                    name: '检验报告单详情',
                    url: contextPath + '/quality/quality/inspection-report2.html',
                    params: {code, testDocumentId}
                });
            }

        },

        hideSearch() {
            this.isHide = !this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            this.isHide = !this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if (!this.isTabulationHide) {
                $(".chevron").css("top", "90%")
            } else {
                $(".chevron").css("top", "")
            }
        },

        //获取商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试",2);
                },
            })

        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    name: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },

        //审核
        approval() {
            //发送请求
            let This = this;
            if (This.selected.length == 0) {
                alertMsgMsg("请选择一条数据!", 2);
                return false;
            }
            if (This.selected.length > 1) {
                alertMsgMsg("只能选择一条数据!", 2);
                return false;
            }
            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            if (rowData.documentStatus == "已审核") {
                alertMsgMsg("该单据已审核!",2);
                return false;
            }
            if (rowData.documentStatus == "暂存") {
                alertMsgMsg("请先提交报告单!",2);
                return false;
            }
            This.reportDocument.reportDocCode = rowData.reportDocCode;
            testDocumentReport.initApproval(rowData.reportDocCode);
            This.approvement = {receiptsId: '', approvalResult: '1', approvalInfo: ''};

            $.ajax({
                type: "POST",
                url: contextPath + "/testReportDocumentController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId: rowData.reportDocCode, docTypeCode: "bgd"}),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100515") {
                        alertMsgMsg("审核成功");
                        This.reportDocument.documentStatus = "已审核";
                        This.saveMethod();
                    }
                    if (data.code === "100514") {
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        alertMsgMsg(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的审核权限", 2);
                    }
                    if (data.code === "100100") {
                        if (This.reportDocument.documentStatus === "已审核") {
                            alertMsgMsg("检验报告已审核", 2);
                            return false;
                        }
                        This.approveComment = true;
                    }
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试", 2);
                }
            })
        },
        //驳回
        reject() {
            let This = this;
            if (This.selected.length == 0) {
                alertMsgMsg("请选择一条数据!", 2);
                return false;
            } else if (This.selected.length > 1) {
                alertMsgMsg("只能选择一条数据!", 2);
                return false;
            }
            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            if (rowData.documentStatus == "暂存") {
                alertMsgMsg("请先提交报告单!", 2);
                return false;
            }
            This.approvement = {receiptsId: '', approvalResult: '0', approvalInfo: ''};
            This.reportDocument.reportDocCode = rowData.reportDocCode
            //发送请求
            $.ajax({
                type: "POST",
                url: contextPath + "/testReportDocumentController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId: rowData.reportDocCode, docTypeCode: "bgd"}),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.rejectComment = true;
                    }
                    if (data.code === "100514") {
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        alertMsgMsg(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的驳回权限", 2);
                    }
                    if (data.code === "100515") {
                        alertMsgMsg("驳回成功");
                        This.reportDocument.documentStatus = "驳回";
                        This.saveMethod();
                    }
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试",2);
                }
            })
        },
        //审批意见点击确定
        getApproveInfo() {
            let This = this;
            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            This.approvement.receiptsId = rowData.reportDocCode;
            This.reportDocument.reportDocCode = rowData.reportDocCode;

            $.ajax({
                type: "POST",
                url: contextPath + "/testReportDocumentController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        alertMsgMsg("审核成功");
                        if (data.data.approvalStatus === 0) {
                            if (This.reportDocument.documentStatus === "审核中") {
                                return false;
                            }
                            This.reportDocument.documentStatus = "审核中";
                            rowData.documentStatus = "审核中";
                        }
                        if (data.data.approvalStatus === 1) {
                            This.reportDocument.documentStatus = "已审核";
                            rowData.documentStatus = "已审核";
                        }
                        This.saveMethod();
                    } else {
                        alertMsgMsg("审核失败", 2);
                    }
                    testDocumentReport.initApproval(This.approvement.receiptsId);
                    This.reload = !This.reload;
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试", 2);
                }
            })
        },
        //驳回点击确定
        getRejectInfo() {
            let This = this;
            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            This.rejectement.receiptsId = rowData.reportDocCode;
            This.reportDocument.reportDocCode = rowData.reportDocCode;
            $.ajax({
                type: "POST",
                url: contextPath + "/testReportDocumentController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.rejectement),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        if (data.data.approvalStatus === -1) {
                            This.reportDocument.documentStatus = "驳回";
                            rowData.documentStatus = "驳回";
                        }
                        if (data.data.approvalStatus === -2) {
                            This.reportDocument.documentStatus = "暂存";
                            rowData.documentStatus = "暂存";
                        }
                        alertMsgMsg("驳回成功");
                        This.saveMethod();
                    } else {
                        alertMsgMsg("驳回失败", 2);
                    }
                    This.rejectement = {receiptsId: '', approvalResult: '0', approvalInfo: ''};
                    testDocumentReport.initApproval(This.rejectement.receiptsId);
                    testDocumentReport.reload = !testDocumentReport.reload;
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试", 2);
                }
            })
        },
        saveMethod() {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/testReportDocumentController/updateStatusByApproval",
                contentType: 'application/json',
                data: JSON.stringify(This.reportDocument),
                dataType: "json",
                success: function (data) {
                    console.log("修改成功");
                },
                error: function (err) {
                    alertMsgMsg("服务器出错，请稍后再试", 2);
                }
            })

        },
        initApproval(code) {
            let This = this;
            //This.reportDocument.testDocumentId=This.selected[0];
            $.ajax({
                type: "post",
                url: contextPath + '/testReportDocumentController/queryProcessByReceiptsId',
                data: {receiptsId: code},
                dataType: "json",
                success: function (data) {
                    var process = data.data.list;

                    for (let i = 0; i < process.length; i++) {
                        switch (process[i].processLevel) {
                            case 1:
                                process[i].processLevel = '一级审核';
                                break;
                            case 2:
                                process[i].processLevel = '二级审核';
                                break;
                            case 3:
                                process[i].processLevel = '三级审核';
                                break;
                            case 4:
                                process[i].processLevel = '四级审核';
                                break;
                            case 5:
                                process[i].processLevel = '五级审核';
                                break;
                            case 6:
                                process[i].processLevel = '六级审核';
                                break;
                        }
                    }
                    console.log(process);
                    process.unshift(
                        {
                            processLevel: "开始"
                        }
                    );
                    process.push(
                        {
                            processLevel: "结束"
                        }
                    );

                    if (process[1].currentLevel === data.data.levelLength) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                    }
                    This.steplist = process;

                    var curr = process[1].currentLevel;
                    for (let i = 0; i < This.stepData.length; i++) {
                        if (curr === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i + 1].subtitle;
                            This.nextStep = This.stepData[i + 2].subtitle;
                            if (This.stepData[i + 1].currentLevel === process.length - 2) {
                                This.nextStep = This.stepData[This.stepData.length - 1].subtitle;
                            }
                            break;
                        } else if (curr + 1 === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i].subtitle;
                            This.nextStep = This.stepData[i + 1].subtitle;
                        }
                    }
                },
                error: function () {
                    alertMsg('服务器出错，请稍后再试', 2);
                }
            })
        },

        //数据字典格式化
        formatDict(val) {
            switch (val) {
                case "yllyjy":
                    return "原料领用检验";
                    break;
                case "ptcgjy":
                    return "采购收货检验";
                    break;
                case "zsjy":
                    return "证书检验";
                    break;
                case "tbjy":
                    return "调拨检验";
                    break;
                case "xsthjy":
                    return "销售退货检验";
                    break;
                case "wxjy":
                    return "维修检验";
                    break;
                case "gongyingshangtuiliaojianyan":
                    return "供应商退料检验";
                    break;
                case "chjy":
                    return "出货检验";
                    break;
                case "stjgjy":
                    return "受托加工收货检验";
                    break;
                case "xsjy":
                    return "销售检验";
                    break;
                case "cgtljy":
                    return "采购退料检验";
                    break;
                case "kcjy":
                    return "库存检验";
                    break;
                case "mdjy":
                    return "门店检验";
                    break;
                case "jyjghg":
                    return "合格";
                    break;
                case "jyjgtbfx":
                    return "特别放行";
                    break;
                case "jyjgtbfx":
                    return "特别放行";
                    break;
                case "jyjgbhg":
                    return "不合格";
                    break;
                case "kcjyd":
                    return "库存检验单";
                    break;
                case "fhjyd":
                    return "发货检验单";
                    break;
                case "lljyd":
                    return "来料检验单";
                    break;
                case "tbjyd":
                    return "调拨检验单";
                    break;
                case "dbjyd":
                    return "调拨检验单";
                    break;
                case "mdjyd":
                    return "门店检验单";
                    break;
                case "yllysqd":
                    return "原料领用申请单";
                    break;
                case "cgthtzd":
                    return "采购退货通知单";
                    break;
                case "shd":
                    return "收货单";
                    break;
                case "thtzd":
                    return "退货通知单";
                    break;
                case "wxdd":
                    return "维修订单";
                    break;
                case "khdd":
                    return "客户订单";
                    break;
                case "thtzd":
                    return "退货通知单";
                    break;
                case "wxshd":
                    return "维修收回单";
                    break;
                default:
                    return "";
            }
        },
        initDetailData() {
            let _this = this;
            //获取质检员
            $.ajax({
                type: "GET",
                url: contextPath + "/testReportDocumentController/queryEmp",
                contentType: 'application/json',
                dataType: "json",
                data: {"organId": "1"},
                success: function (res) {
                    if(res.code == '100100'){
                        testDocumentReport.inspector = res.data;
                    }
                },
                error: function (err) {
                    testDocumentReport.$Spin.hide();
                    alertMsg('服务器出错，请稍后再试', 2);
                },
            });

            //检验类型（数据字典）
            let arr = [];
            arr = getCodeList('root_zj_jydywlx').concat(getCodeList('root_zj_wydjyd_ywlx')).filter(i=>i.value!=='mdjy');
            _this.businessType = arr;


            //报告单状态（数据字典）
            let statusArr = [];
            statusArr = getCodeList('zj_rdstatus');
            _this.documentStatus = statusArr;

        },
        clearAddBody() {
            this.addBody = {
                documentCode: '',
                documentType: '',
                documentTime: '',
                inspectorId: '',
                qcDocumentCode: '',
                sendTestTime: '',
                qcFinishTime: '',
                testTotalAmount: '',
                qualifiedAmount: '',
                unqualifiedAmount: '',
                qualifiedPercent: '',
                testResult: ''
            }
        },
    },
    watch: {
        'body.inspectorName': function (val) {
            if (typeof val == 'undefined') {
                this.body.inspectorName = '';
            }
        },
        'body.documentStatus': function (val) {
            if (typeof val == 'undefined') {
                this.body.documentStatus = '';
            }
        },
        'body.businessType': function (val) {
            if (typeof val == 'undefined') {
                this.body.businessType = '';
            }
        }

    },
    mounted() {
        this.initDetailData();
        this.loadProductType();
        this.openTime = window.parent.params.openTime;
    }
})
