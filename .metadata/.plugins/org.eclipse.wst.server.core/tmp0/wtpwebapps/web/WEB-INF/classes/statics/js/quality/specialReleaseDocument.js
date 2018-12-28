var specialReleaseDocument = new Vue({
    el: '#SRDocument',
    data() {
        let This = this;
        return {
            //折叠显示隐藏
            isSearchHide: true,
            isTabulationHide: true,
            isHide: true,
            getDocumentTypeList: {}, //源单类型

            //启用多级审核时单据上的操作——审核
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //审批数据绑定
            approvement: {
                receiptsId: '',
                approvalResult: 1,
                approvalInfo: '',
                boeId:'',
            },
            dataValue: [],//单据日期
            //驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
                boeId:'',
            },
            stepData: [
                {
                    currentLevel: 0,
                    subtitle: '开始'
                },
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
            reportDocument: {
                id: '',
                code: '',
                documentStatus: '',
                delStatus: '',
                organizationId: '',
                startTime: '',
                endTime: '',
                qcDocumentCode: '',
                applicantName: '',
                sourceDocumentCode: '',
                documentType: '',
                qcConclusion: '',
                departmentName: '',
                applyReason: '',
                confirmer: '',
                examineVerifyDate: '',
                riskEstimate: ''
            },
            isShow: false,
            isEdit: false,
            reload: false,
            selected: [],
            openTime: "",
            documentStatusList: [],
            applicantNameList: [],
            body: {
                code: '',
                startTime: '',
                endTime: '',
                qcDocumentCode: '',
                applicantName: '',
                sourceDocumentCode: '',
                documentStatus: ''
            },
            data_config: {
                url: contextPath+"/specialReleaseDocument/listByPage",
                colNames: ['单据编号', '单据日期', '单据状态', '源单类型','源单单号',  '送检编号', '检验单号', '检验结论', '申请部门', '申请人', '申请原因', '确认人', '确认日期', '风险评估'],
                colModel: [
                    {name: 'code', index: 'code', width: 180, align: "left",},
                    {
                        name: 'documentTime', index: 'documentTime', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            Date.prototype.Format = function (fmt) { //author: meizz
                                var o = {
                                    "M+": this.getMonth() + 1, //月份
                                    "d+": this.getDate(), //日
                                    "h+": this.getHours(), //小时
                                    "m+": this.getMinutes(), //分
                                    "s+": this.getSeconds(), //秒
                                    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                                    "S": this.getMilliseconds() //毫秒
                                };
                                if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                                for (var k in o)
                                    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                                return fmt;
                            };
                            return new Date(value).Format("yyyy-MM-dd");
                        }
                    },
                    {name: 'documentStatus', index: 'documentStatus', align: "left", width: 100},
                    {
                        name: 'documentType', index: 'documentType', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            return This.getDocumentTypeList[value] || value;
                        }
                    },
                    {name: 'upstreamSourceCode', index: 'upstreamSourceCode', align: "left", width: 180},
                    {name: 'sourceDocumentCode', index: 'sourceDocumentCode', align: "left", width: 180},
                    {
                        name: 'qcDocumentCode', index: 'qcDocumentCode', align: "left", width: 180,
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.documentDetail({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {name: 'qcConclusion', index: 'qcConclusion', width: 100, align: "left"},
                    {name: 'departmentName', index: 'departmentName', width: 100, align: "left"},
                    {name: 'applicantName', index: 'applicantName', align: "left", width: 100},
                    {name: 'applyReason', index: 'applyReason', align: "left", width: 100},
                    {name: 'examineVerifyName', index: 'examineVerifyName', align: "left", width: 100},
                    {name: 'examineVerifyDate', index: 'examineVerifyDate', align: "left", width: 100},
                    {name: 'riskEstimate', index: 'riskEstimate', align: "left", width: 100}
                ],
                shrinkToFit:false
            },
        }
    },
    methods: {
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-') + ' 00:00:00';
            this.body.endTime = value[1].replace(/\//g, '-') + ' 23:59:59';
        },
        search() {
            if(!this.body.applicantName){
                this.body.applicantName = '';
            }
            if(!this.body.documentStatus){
                this.body.documentStatus = '';
            }
            this.reload = !this.reload;
        },
        clear() {
            this.body = {
                code: '',
                startTime: '',
                endTime: '',
                qcDocumentCode: '',
                applicantName: '',
                sourceDocumentCode: '',
                documentStatus: '',
            };
            this.dataValue = [];
            this.$refs.inspect.clearSingleSelect();
        },
        add() {
            //跳转页面
            window.parent.activeEvent({
                name: '新增特别放行单',
                url:contextPath+ '/quality/quality/specialReleaseDocumentInfo.html?type=2'
            });
        },
        //检验单号跳转
        documentDetail(data) {
            let code = data.rows.qcDocumentCode;
            if (code) {
                this.queryDocument1(code, true);
            }
        },
        queryDocument1(code, isEdit) {
            $.ajax({
                type: "POST",
                data: {"documentCode": code},
                url: contextPath+"/testReportDocumentController/findTestDocumentByDocumentCode",
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        console.log(result)
                        var type = result.data.documentType;
                        var code = result.data.documentCode;
                        var testDocument = result.data;
                        var id = result.data.id;
                        //if(type=="库存检验单"||type=="门店检验单"){
                        if (type == "kcjyd" || type == "mdjyd") { //无源单
                            window.parent.activeEvent({
                                name: '查看检验单',
                                url: contextPath+ '/quality/inventory/test-document.html',
                                params: code
                            });
                        } else {  //有源单
                            // window.parent.activeEvent({name: '检验单详情', url: 'test-document/test-document.html', params: code});
                            window.parent.activeEvent({
                                name: '查看检验单',
                                url: contextPath+ '/quality/test-document/test-document.html',
                                params: {code: code, type: 1}
                            });
                        }
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        del() {
            let ids = this.selected;
            if (this.selected.length == 0) {
                // alert('请选择至少一条数据!');
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择至少一条数据'
                })
                return;
            }
            $.ajax({
                url: contextPath+'/specialReleaseDocument/delete',
                method: 'post',
                dataType: "json",
                /*data: JSON.stringify(ids),
                contentType: 'application/json;charset=utf-8',*/
                data: {ids: ids.join(",")},
                success: function (res) {
                    if (res.code === '100100') {
                        specialReleaseDocument.reload = !specialReleaseDocument.reload;
                        // layer.alert(res.msg);
                        specialReleaseDocument.$Modal.success({
                            title:'提示信息',
                            content:res.msg
                        })
                    } else {
                        // layer.alert("服务器出错，请联系技术人员！");
                        specialReleaseDocument.$Modal.info({
                            title:'提示信息',
                            content:'服务器出错，请联系技术人员！'
                        })
                    }
                },
                error: function (e) {
                    specialReleaseDocument.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请联系技术人员！'
                    })
                }
            });
        },
        modify() {
            let id = this.selected[0];
            if (this.selected.length == 0) {
                // layer.alert('请选择一条数据修改!');
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择一条数据修改!'
                })
                return;
            }
            if (this.selected.length > 1) {
                // layer.alert('只能对一条数据修改!');
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能对一条数据修改!'
                })
                return;
            }
            let rowData = jQuery("#myTable").jqGrid("getRowData", id);

            //跳转页面
            window.parent.activeEvent({
                name: '修改特别放行单',
                url: contextPath+ '/quality/quality/specialReleaseDocumentInfo.html?type=3&id=' + id
            });
        },
        view() {
        },
        save() {
            let ids = this.selected;
            if (this.selected.length == 0) {
                // layer.alert('请选择至少一条数据!');
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择至少一条数据!'
                })
                return;
            }
            $.ajax({
                url: contextPath+'/specialReleaseDocument/updateBatchDocumentStatus',
                method: 'post',
                dataType: "json",
                data: {ids: ids.join(",")},
                success: function (res) {
                    if (res.code === '100100') {
                        // layer.alert("提交成功！");
                        specialReleaseDocument.$Modal.success({
                            title:'提示信息',
                            content:'提交成功！'
                        })
                        specialReleaseDocument.reload = !specialReleaseDocument.reload;
                    } else {
                        // layer.alert("请选择单据状态为 暂存的 单据。\n若提交的单据有漏填项，请前往补充，谢谢！");
                        specialReleaseDocument.$Modal.success({
                            title:'提示信息',
                            content:'请选择单据状态为 暂存的 单据。\\n若提交的单据有漏填项，请前往补充，谢谢！'
                        })
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        reloadAgain() {
            specialReleaseDocument.isShow = false;
            specialReleaseDocument.reload = !specialReleaseDocument.reload;
        },
        cancel() {
            window.parent.closeCurrentTab({'name': "特别放行单", 'openTime': this.openTime, 'exit': true})
        },

        //审核
        approval() {
            //发送请求
            let This = this;
            if (this.selected.length == 0) {
                // layer.alert("请选择一条数据!");
                this.$Modal.info({
                    title:'提示信息',
                    content:'请选择一条数据!'
                })
                return false;
            } else if (this.selected.length > 1) {
                // layer.alert("只能选择一条记录!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条记录!'
                })
                return false;
            }

            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            This.reportDocument.documentStatus = rowData.documentStatus;
            This.reportDocument.code = rowData.code;
            This.reportDocument.id = This.selected[0];
            if (This.reportDocument.code === "") {
                // layer.alert("请提交放行单!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'请提交放行单!'
                })
                return false;
            }
            specialReleaseDocument.initApproval(This.reportDocument.code);
            if (This.reportDocument.documentStatus == "暂存") {
                // layer.alert("请先提交放行单!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'请先提交放行单!'
                })
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId: This.reportDocument.code, docTypeCode: "fxd"}),
                dataType: "json",
                success: function (data) {
                    console.log(data.code);
                    if (data.code === "100515") { //未启用多级审核
                        // layer.alert("审核成功");
                        This.$Modal.success({
                            title:'提示信息',
                            content:'审核成功!'
                        })
                        This.reportDocument.documentStatus = "已审核";
                        This.saveMethod();
                        This.reloadAgain();
                    }
                    if (data.code === "100514") { //没权限
                        let msg = data.data === 1 ? "【一级审核】" : data.data === 2 ?
                            "【二级审核】" : data.data === 3 ? "【三级审核】" : data.data === 4 ?
                                "【四级审核】" : data.data === 5 ? "【五级审核】" : data.data === 6 ?
                                    "【六级审核】" : data.msg;
                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的审核权限");
                        This.$Modal.info({
                            title:'提示信息',
                            content:data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的审核权限"
                        })
                    }
                    if (data.code === "100100") { //操作成功
                        if (This.reportDocument.documentStatus === "已审核") {
                            // layer.alert("此单已审核");
                            This.$Modal.info({
                                title:'提示信息',
                                content:'此单已审核!'
                            })
                            return false;
                        }
                        This.approveComment = true;
                    }
                },
                error: function (err) {
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试!'
                    })
                }
            })
        },
        //驳回
        reject() {
            let This = this;
            if (this.selected.length == 0) {
                // layer.alert("请选择一条数据!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'请选择一条数据!'
                })
                return false;
            } else if (this.selected.length > 1) {
                // layer.alert("只能选择一条记录!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条记录!'
                })
                return false;
            }

            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            This.reportDocument.documentStatus = rowData.documentStatus;
            This.reportDocument.code = rowData.code;
            This.reportDocument.id = This.selected[0];
            if (This.reportDocument.code === "") {
                // layer.alert("请提交放行单!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'请提交放行单!'
                })
                return false;
            }
            if (This.reportDocument.documentStatus == "暂存") {
                // layer.alert("请先提交放行单!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'请先提交放行单!'
                })
                return false;
            }
            if (This.reportDocument.documentStatus == "已审核") {
                // layer.alert(" 单据已经审核完成!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'单据已经审核完成!'
                })
                return false;
            }
            //发送请求
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId: This.reportDocument.code, docTypeCode: "fxd"}),
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
                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的驳回权限");
                        This.$Modal.info({
                            title:'提示信息',
                            content:data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!" : "您没有" + msg + "的驳回权限"
                        })
                    }
                    if (data.code === "100515") {
                        // layer.alert("驳回成功");
                        This.$Modal.success({
                            title:'提示信息',
                            content:'驳回成功'
                        })
                        This.reportDocument.documentStatus = "驳回";
                        This.saveMethod();
                        This.reloadAgain();
                    }
                },
                error: function (err) {
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        //审批意见点击确定
        getApproveInfo() {
            let This = this;
            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            This.approvement.receiptsId = rowData.code;
            This.reportDocument.id = This.selected[0];
            This.approvement.boeId=This.selected[0];
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        // layer.alert("审核成功");
                        This.$Modal.success({
                            title:'提示信息',
                            content:'审核成功！'
                        })
                        if (data.data.approvalStatus === 0) {
                            if (This.reportDocument.documentStatus === "审核中") {
                                return false;
                            }
                            This.reportDocument.documentStatus = "审核中";
                        }
                        if (data.data.approvalStatus === 1) {
                            This.reportDocument.documentStatus = "已审核";
                            rowData.documentStatus = "已审核";
                        }
                        This.saveMethod();
                    } else {
                        // layer.alert("审核失败");
                        This.$Modal.info({
                            title:'提示信息',
                            content:'审核失败！'
                        })
                    }
                    This.approvement = {receiptsId: '', approvalResult: 1, approvalInfo: '',boeId:''};
                    specialReleaseDocument.initApproval(This.approvement.receiptsId);
                },
                error: function (err) {
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        //驳回点击确定
        getRejectInfo() {
            let This = this;
            let rowData = jQuery("#myTable").jqGrid("getRowData", This.selected[0]);
            This.rejectement.receiptsId = rowData.code;
            This.reportDocument.id = This.selected[0];
            This.rejectement.boeId=This.selected[0];
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(This.rejectement),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        // layer.alert("驳回成功");
                        This.$Modal.success({
                            title:'提示信息',
                            content:'驳回成功！'
                        })
                        if (data.data.approvalStatus === -2) {
                            This.reportDocument.documentStatus = "暂存";
                            rowData.documentStatus = "暂存";
                        } else {
                            This.reportDocument.documentStatus = "驳回";
                            rowData.documentStatus = "驳回";
                        }
                        This.saveMethod();
                    } else {
                        // layer.alert("驳回失败");
                        This.$Modal.info({
                            title:'提示信息',
                            content:'驳回失败！'
                        })
                    }
                    This.rejectement = {receiptsId: '', approvalResult: '0', approvalInfo: '',boeId:''};
                    specialReleaseDocument.initApproval(This.rejectement.receiptsId);
                },
                error: function (err) {
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        saveMethod() { //改单据状态
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/specialReleaseDocument/updateStatusByApproval",
                contentType: 'application/json',
                data: JSON.stringify(This.reportDocument),
                dataType: "json",
                success: function (data) {
                    console.log("修改成功");
                    This.reloadAgain();
                },
                error: function (err) {
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        initApproval(code) { //获取节点信息
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/specialReleaseDocument/queryProcessInfoByReceiptsId',
                data: JSON.stringify({receiptsId: code}),
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    let process = data.data && data.data.list;
                    if (!process) {
                        return;
                    }

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


                    This.steplist = process;
                    if (process[1].currentLevel === data.data.levelLength) {
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        return false;
                    }
                    let curr = process[1].currentLevel;
                    for (let i = 0; i < This.stepData.length; i++) {
                        if (curr === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i + 1].subtitle;
                            if (This.stepData[i + 1].currentLevel === data.data.levelLength) {
                                This.nextStep = This.stepData[This.stepData.length - 1].subtitle;
                            } else {
                                This.nextStep = This.stepData[i + 2].subtitle;
                            }
                        }
                    }
                },
                error: function () {
                    // alert('服务器出错啦');
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        //折叠显示隐藏
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
        _ajaxgetDocumentType() {
            let This = this;
            let _url = contextPath+'/specialReleaseDocument/getDocumentType?';
            $.ajax({
                type: "post",
                url: _url,
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100') {
                        data.data.map(item => {
                            This.getDocumentTypeList[item.value.toString()] = item.name;
                        });
                    }
                },
                error: function () {

                }
            });
        }
    },
    watch: { //下拉框清空
        'body.applicantName': function (val) {
            if (typeof val == 'undefined') {
                this.body.applicantName = '';
            }
        },
        'body.documentStatus': function (val) {
            if (typeof val == 'undefined') {
                this.body.documentStatus = '';
            }
        }
    },
    created() {
        this._ajaxgetDocumentType();
    },
    mounted() {
        this.openTime = window.parent.params.openTime; //记录页面打开时间戳(用于关闭当前页面)
        //    请求数据字典数据（单据状态）
        $.ajax({
            type: "post",
            url: contextPath+'/specialReleaseDocument/getDocumentStatus',
            dataType: "json",
            success: function (data) {
                specialReleaseDocument.documentStatusList = data.data;
            },
            error: function () {
                // alert('服务器出错啦');
                specialReleaseDocument.$Modal.info({
                    title:'提示信息',
                    content:'服务器出错，请稍后再试！'
                })
            }
        });

        //请求人员信息
        $.ajax({
            type: "post",
            url: contextPath+'/specialReleaseDocument/queryallempbyorganid',
            dataType: "json",
            success: function (data) {
                specialReleaseDocument.applicantNameList = data.data;
                console.log(specialReleaseDocument.applicantNameList);
            },
            error: function () {
                // alert('服务器出错啦');
                specialReleaseDocument.$Modal.info({
                    title:'提示信息',
                    content:'服务器出错，请稍后再试！'
                })
            }
        });
    }
})
