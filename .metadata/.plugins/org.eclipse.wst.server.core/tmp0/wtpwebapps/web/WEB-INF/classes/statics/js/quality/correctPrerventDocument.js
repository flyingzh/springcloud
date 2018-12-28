var correctPreventDocument = new Vue({
    el: '#correctPreventDocument',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            isEdit: false,
            reload: false,
            selected: [],
            selectDateArr: [],
            DocumentTypeList: [],
            empList: [],
            conclusionList: [],
            documentStatusList: [],
            businessFlowDirectionList: [],
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            statusMap:{
                tmp_save: "temporary_save", await_check: "await_check", checking: "checking", auditing: "auditing", reject: "reject"
            },
            approvalTableData:[],
            canRejectWhenAudit:true,
            modalTrigger: false,
            modalType:'',
            documentCode:'',
            documentStatus:'',
            //审批进度条
            stepList: [],
            body: {
                documentType: '',
                documentCode: '',
                startDocDate: '',
                endDocDate: '',
                documentStatus: '',
                sourceDocumentType: '',
                sourceDocumentCode: '',
                issuePersonId: '',
                followConclusion: '',
            },
            data_config: {
                url: contextPath + '/tQcCorrectPreventDocument/queryCorrectPreventListPage',
                colNames: ['单据编号', 'id', '单据日期', '单据状态', '业务流向', '源单类型', '源单单号', '发出部门', '发出人', '发出日期', '接收部门', '要求回复日期', '分析部门', '分析员', '责任部门', '责任人', '检验部门', '验证员', '验证结果', '跟踪结论'],
                colModel: [
                    {
                        name: 'documentCode', index: 'documentCode', width: 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.testDocumentDetailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden: true},
                    {
                        name: 'documentDate', index: 'documentDate', width: 90, align: "center", align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'documentStatus', index: 'documentStatus', align: "left", width: 75,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'temporary_save') {
                                return '暂存';
                            } else if (value === 'await_check') {
                                return '待审核';
                            } else if (value === 'checking') {
                                return '审核中';
                            } else if (value === 'auditing') {
                                return '已审核';
                            } else if (value === 'reject') {
                                return '驳回';
                            } else {
                                return '';
                            }
                        },
                        unformat: function (value, grid, rows) {
                            if (value === '暂存') {
                                return 'temporary_save';
                            } else if (value === '待审核') {
                                return 'await_check';
                            } else if (value === '审核中') {
                                return 'checking';
                            } else if (value === '已审核') {
                                return 'auditing';
                            } else if (value === '驳回') {
                                return 'reject';
                            } else {
                                return '';
                            }
                        }

                    },
                    {
                        name: 'businessFlowDirection', index: 'businessFlowDirection', align: "left", width: 75,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'wtfb') {
                                return '问题发布';
                            } else if (value === 'wtfx') {
                                return '问题分析';
                            } else if (value === 'csyz') {
                                return '措施验证';
                            }
                            else if (value === 'jzyf') {
                                return '纠正预防';
                            } else if (value === 'yzwc') {
                                return '验证完成';
                            } else {
                                return '';
                            }
                        },
                        unformat: function (value, grid, rows, state) {
                            if (value === '问题发布') {
                                return 'wtfb';
                            } else if (value === '问题分析') {
                                return 'wtfx';
                            } else if (value === '纠正预防') {
                                return 'jzyf';
                            } else if (value === '措施验证') {
                                return 'csyz';
                            } else if (value === '验证完成') {
                                return 'yzwc';
                            }
                        }
                    },
                    {
                        name: 'sourceDocumentType', index: 'sourceDocumentType', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'lljyd') {
                                return '来料检验单';
                            } else if (value === 'kcjyd') {
                                return '库存检验单';
                            } else if (value === 'tbjyd') {
                                return '调拨检验单';
                            } else if (value === 'mdjyd') {
                                return '门店检验单';
                            } else if (value === 'fhjyd') {
                                return '发货检验单';
                            } else {
                                return '';
                            }
                        },
                    },
                    {name: 'sourceDocumentCode', index: 'sourceDocumentCode', align: "left", width: 150},
                    {name: 'issueDepartmentName', index: 'issueDepartmentName', align: "left", width: 90},
                    {name: 'issuePersonName', index: 'issuePersonName', width: 70, align: "left"},
                    {
                        name: 'issueDate', index: 'issueDate', align: "left", width: 95,
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'receiveDepartmentName', index: 'receiveDepartmentName', align: "left", width: 90},
                    {
                        name: 'demandReplyDate', index: 'demandReplyDate', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'analyseDepartmentName', index: 'analyseDepartmentName', align: "left", width: 90},
                    {name: 'analysePersonnelName', index: 'analysePersonnelName', align: "left", width: 70},
                    {name: 'dutyDepartmentName', index: 'dutyDepartmentName', align: "left", width: 95},
                    {name: 'dutyPersonnelName', index: 'dutyPersonnelName', align: "left", width: 70},
                    {name: 'validateDepartmentName', index: 'validateDepartmentName', align: "left", width: 70},
                    {name: 'validatePersonnelName', index: 'validatePersonnelName', align: "left", width: 70},
                    {
                        name: 'validateResult', index: 'validateResult', align: "left", width: 90,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'wx') {
                                return '无效';
                            } else if (value === 'yx') {
                                return '有效';
                            } else {
                                return '';
                            }
                        }
                    },
                    {
                        name: 'followConclusion', index: 'followConclusion', align: "left", width: 70,
                        formatter: function (value, grid, rows, state) {
                            if (value === 'jzhg') {
                                return '合格';
                            } else if (value === 'jzbhg') {
                                return '不合格';
                            } else {
                                return '';
                            }
                        }
                    }
                ],
            },
        }
    },
    methods: {
        handleClearType(value){
            this.$refs[value].reset();
            this.$nextTick(() => {
                if(value === 'sendOut'){
                    this.body.issuePersonId = '';
                }
                if(value === 'docStatus'){
                    this.body.documentStatus = '';
                }
                if(value === 'business'){
                    this.body.businessFlowDirection = '';
                }
                if(value === 'sourceDocType'){
                    this.body.documentType = '';
                }
            });
        },
        hideSearch() {
            correctPreventDocument.isHide = !correctPreventDocument.isHide;
            correctPreventDocument.isSearchHide = !correctPreventDocument.isSearchHide;
            console.log(correctPreventDocument.isTabulationHide);
            $(".chevron").css("top", "")
        },
        hidTabulation() {
            correctPreventDocument.isHide = !correctPreventDocument.isHide;
            correctPreventDocument.isTabulationHide = !correctPreventDocument.isTabulationHide;
            if (!correctPreventDocument.isTabulationHide) {
                $(".chevron").css("top", "83%")
            } else {
                $(".chevron").css("top", "")
            }
        },
        search() {
            console.log(this.body);
            if (this.selectDateArr.length > 0 && this.selectDateArr[0] && this.selectDateArr[1]) {
                correctPreventDocument.body.startDocDate = this.selectDateArr[0].format("yyyy-MM-dd");
                correctPreventDocument.body.endDocDate = this.selectDateArr[1].format("yyyy-MM-dd");
            } else {
                correctPreventDocument.body.startDocDate = '';
                correctPreventDocument.body.endDocDate = '';
            }
            this.reload = !this.reload;
        },
        //根据检验单号查详情
        testDocumentDetailClick(data) {
            let code = data.rows.documentCode;
            if (code) {
                this.queryTestDocumentByQcDocumentCode(code, true);
            }
        },
        queryTestDocumentByQcDocumentCode(code, isEdit) {
            window.parent.activeEvent({
                name: '查看纠正预防单',
                url: contextPath + '/quality/quality/corrective-prevention-sheet--1.html',
                params: {docCode: code, type: 'query'}
            });
        },
        clear() {
                this.body.documentCode = '';
                this.body.documentType = '';
                if(this.body.documentStatus){
                    this.$refs.docStatus.reset();
                    this.$nextTick(() => {
                        this.body.documentStatus = '';
                    });
                }
                if(this.body.sourceDocumentType){
                    this.$refs.sourceDocType.reset();
                    this.$nextTick(() => {
                        this.body.sourceDocumentType = '';
                    });
                }
                this.body.sourceDocumentCode = '';
                if(this.body.businessFlowDirection){
                    this.$refs.business.reset();
                    this.$nextTick(() => {
                        this.body.businessFlowDirection = '';
                    });
                }
                this.body.followConclusion = '';
                this.body.alreadyTest = 2;
                if (this.body.issuePersonId) {
                    this.$refs.sendOut.reset();
                    this.$nextTick(() => {
                        this.body.issuePersonId = '';
                    });
                }
            this.selectDateArr = '';
            console.log(this.body);
        },
        update() {
            let This = this;
            var docoment = this.selected;
            if (docoment.length < 1) {
                This.$Modal.warning({title:'提示',content:'请至少选择一条数据！'});
                // alert("请至少选择一条数据");
                return;
            } else if (docoment.length > 1) {
                This.$Modal.warning({title:'提示',content:'只能选择一条数据！'});
                // alert("只能选择一条数据");
                return;
            } else {
                // console.log("传出的参数：" + docoment[0].id);
                window.parent.activeEvent({
                    name: '修改纠正预防单',
                    url: contextPath + '/quality/quality/corrective-prevention-sheet--1.html',
                    params: {id: docoment[0].id, type: 'update'}
                });
            }
        },
        add() {
            window.parent.activeEvent({
                name: '新增纠正预防单',
                url: contextPath + '/quality/quality/corrective-prevention-sheet--1.html',
                params: {type: 'add'}
            });
        },
        del() {
            let $This = this;
            let document = this.selected;
            if (this.selected.length < 1) {
                $This.$Modal.warning({title:'提示',content:'请至少选择一条数据！'});
                // alert('请选择至少一条数据!');
                return;
            } else if (document.length >= 1) {
                let doc = [];
                document.forEach(item =>{
                   doc.push({id:item.id,documentCode:item.documentCode,documentStatus:item.documentStatus});
                });
                $.ajax({
                    url: contextPath + '/tQcCorrectPreventDocument/updateBatch',
                    method: 'post',
                    dataType: "json",
                    data: JSON.stringify(doc),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        $This.reloadAgain();
                        if (data.code === '100100') {
                            if ($.isEmptyObject(data.data)) {
                                $This.$Modal.success({title:'提示',content:'删除成功！'});
                            } else {
                                let msg = "单据";
                                for (let i = 0; i < data.data.length; i++) {
                                    msg += "[" + data.data[i].documentCode + "]、"
                                    if (i === data.data.length) {
                                        msg += "[" + data.data[i].documentCode + "]"
                                    }
                                }
                                msg += "删除失败（单据已启用审批流，无法删除！）"
                                $This.$Modal.warning({title:'提示',content:msg});
                            }
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }

        },
        modify() {
        },
        view() {
        },
        save(id, status) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/tQcCorrectPreventDocument/update',
                contentType: 'application/json',
                data: JSON.stringify({id: id, documentStatus: status}),
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        This.reloadAgain();
                    }
                },
                error: function (err) {
                    This.$Modal.error({title:'提示',content:'服务器出错了！'})
                }
            })
        },
        reloadAgain() {
            correctPreventDocument.isShow = false;
            this.reload = !this.reload;
        },
        cancel() {
            window.parent.closeCurrentTab({name: '纠正预防单', openTime: this.openTime, exit: true});
        },
        submit() {
            let documents = this.selected;
            let This = this;
            if (documents.length < 1) {
                This.$Modal.warning({title:'提示',content:'至少选择一条数据！'});
                // layer.alert("至少选择一条数据");
            } else {
                $.ajax({
                    url: contextPath + '/tQcCorrectPreventDocument/submitBatch',
                    method: 'post',
                    dataType: "json",
                    data: JSON.stringify(documents),
                    contentType: 'application/json;charset=utf-8',
                    success: function (data) {
                        if (data.code === "100100") {
                            correctPreventDocument.reload = !correctPreventDocument.reload;
                            if ($.isEmptyObject(data.data)) {
                                This.$Modal.success({title:'提示',content:'提交成功！'});
                                // layer.alert("提交成功！")
                            } else {
                                let msg = "单据";
                                for (let i = 0; i < data.data.length; i++) {
                                    msg += "[" + data.data[i].documentCode + "]、"
                                }
                                msg += "提交失败（单据业务流向不为验证完成或者状态不为暂存！）"
                                // layer.alert(msg);
                                This.$Modal.warning({title:'提示',content:msg});
                            }
                        }
                    }
                });
            }
        },
        approvalOrRejectCallBack(res){
            let This = this;
            if(res.result.code == '100100'){
                This.reloadAgain();
            }
        },
        autoSubmitOrReject(result){
            let This = this;
            $.ajax({
                url:contextPath + '/tQcCorrectPreventDocument/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.documentCode,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code != '100100'){
                        This.$Modal.warning({content:res.msg});
                    }
                    This.reloadAgain();
                }
            });
        },
        //审核
        approval() {
            let $This = this;
            let This = this.selected;
            if (This.length > 1) {
                $This.$Modal.warning({title:'提示',content:'只能选择一条数据！'});
                // layer.alert("只能选择一条数据！")
                return;
            }
            if (This.length < 1) {
                $This.$Modal.warning({title:'提示',content:'请至少选一条数据！'});
                // layer.alert("请至少选择一条数据！");
                return;
            }
            if (This[0].documentStatus === "temporary_save") {
                $This.$Modal.warning({title:'提示',content:'请提交纠正预防单！'});
                // layer.alert("请提交纠正预防单！");
                return;
            }
            if (This[0].documentStatus === 'auditing') {
                $This.$Modal.warning({title:'提示',content:'该单已审核完成！不能重复审核！'});
                // layer.alert("该单已审核完成！不能重复审核！");
                return;
            }
            $This.documentCode = This[0].documentCode;
            $This.documentStatus = This[0].documentStatus;
            $This.modalType = 'approve';
            $This.modalTrigger = !$This.modalTrigger;
        },
        //驳回
        reject() {
            let $This = this;
            let This = this.selected;
            if (This.length > 1) {
                $This.$Modal.warning({title:'提示',content:'只能选择一条数据！'});
                // layer.alert("只能选择一条数据！");
                return;
            }
            if (This.length < 1) {
                $This.$Modal.warning({title:'提示',content:'请至少选择一条数据！'});
                // layer.alert("请至少选择一条数据！");
                return;
            }
            if (This[0].documentStatus == 'temporary_save') {
                $This.$Modal.warning({title:'提示',content:'该单状态不能驳回！'});
                // layer.alert("该单状态不能驳回!");
                return;
            }
            $This.documentCode = This[0].documentCode;
            $This.documentStatus = This[0].documentStatus;
            $This.modalType = 'reject';
            $This.modalTrigger = !$This.modalTrigger;

        },
     /*   //审批意见点击确定
        getApproveInfo() {
            let $This = this;
            let This = this.selected[0];
            this.approvement.receiptsId = This.documentCode;
            $.ajax({
                type: "POST",
                url: contextPath + '/tQcCorrectPreventDocument/submitapproval',
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        layer.alert("审核成功");
                        if (data.data.approvalStatus === 0) {
                            if (This.documentStatus === "checking") {
                                $This.approvement = {receiptsId: '', approvalResult: 1, approvalInfo: ''};
                                correctPreventDocument.save(This.id, This.documentStatus);
                                return false;
                            }
                            This.documentStatus = "checking";
                        }
                        if (data.data.approvalStatus === 1) {
                            This.documentStatus = "auditing";
                        }
                    } else {
                        layer.alert("审核失败");
                    }
                    $This.approvement = {receiptsId: '', approvalResult: 1, approvalInfo: ''};
                    correctPreventDocument.initApproval(This.documentCode);
                    correctPreventDocument.save(This.id, This.documentStatus);
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },
        //驳回点击确定
        getRejectInfo() {
            let This = this.selected[0];
            let $This = this;
            correctPreventDocument.rejectement.receiptsId = This.documentCode;
            $.ajax({
                type: "POST",
                url: contextPath + '/tQcCorrectPreventDocument/submitapproval',
                contentType: 'application/json',
                data: JSON.stringify(correctPreventDocument.rejectement),
                dataType: "json",
                success: function (data) {
                    console.log(data.data);
                    if (data.code === "100100") {
                        layer.alert("驳回成功");
                        if (data.data.approvalStatus === -2) {
                            This.documentStatus = "temporary_save";
                        } else {
                            This.documentStatus = "reject";
                        }
                        $This.rejectement = {receiptsId: '', approvalResult: '0', approvalInfo: '',};
                        correctPreventDocument.save(This.id, This.documentStatus);
                    } else {
                        layer.alert("驳回失败");
                    }
                },
                error: function (err) {
                    layer.alert("服务器出错");
                }
            })
        },*/
        //初始化单据状态
        initDocumentStatus() {
            this.documentStatusList = getCodeList("zj_document_status");
            console.log(this.documentStatusList);
        },
        //初始化业务流向
        initBusinessFlowDirection() {
            this.businessFlowDirectionList = getCodeList("zj_jzyfddjzt");
        },
        //初始化源单类型
        initDocumentType() {
            this.DocumentTypeList = getCodeList("zj_jzyfdydlx");
        },
        //初始化跟踪结论
        initconclusionList() {
            this.conclusionList = getCodeList("zj_jzyfdgzjl");
        },
    },
    watch: {
        /*'body.issuePersonId': function (val) {
            if (typeof val == 'undefined') {
                this.body.issuePersonId = '';
            }
        },*/
        'body.businessFlowDirection': function (val) {
            if (typeof val == 'undefined') {
                this.body.businessFlowDirection = '';
            }
        },
        'body.sourceDocumentType': function (val) {
            if (typeof val == 'undefined') {
                this.body.sourceDocumentType = '';
            }
        },
        'body.documentStatus': function (val) {
            if (typeof val == 'undefined') {
                this.body.documentStatus = '';
            }
        },

    },
    mounted() {
        //    请求数据字典数据（单据状态）
        this.openTime = window.parent.params.openTime;
        this.initDocumentStatus();
        /*$.ajax({
            type:"post",
            url:contextPath+'/tQcCorrectPreventDocument/getChildNodesByMark',
            dataType:"json",
            data:{mark:"zj_document_status"},
            success:function(data){
                correctPreventDocument.documentStatusList = data.data;
            },
            error:function(){
                alert('服务器出错啦');
            }
        });*/
        //    请求数据字典数据（业务流向）
        this.initBusinessFlowDirection();
        /* $.ajax({
             type:"post",
             url:contextPath+'/tQcCorrectPreventDocument/getChildNodesByMark',
             dataType:"json",
             data:{mark:"zj_jzyfddjzt"},
             success:function(data){
                 correctPreventDocument.businessFlowDirectionList = data.data;
             },
             error:function(){
                 alert('服务器出错啦');
             }
         });*/
        //请求数据字典数据（源单类型）
        this.initDocumentType();
        /*$.ajax({
            type:"post",
            url:contextPath+'/tQcCorrectPreventDocument/getChildNodesByMark',
            dataType:"json",
            data:{mark:"zj_jzyfdydlx"},
            success:function(data){
                correctPreventDocument.DocumentTypeList = data.data;
            },
            error:function(){
                alert('服务器出错啦');
            }
        });*/
        //    请求数据字典数据（验证结论）
        this.initconclusionList();
        /*$.ajax({
            type:"post",
            url:contextPath+'/tQcCorrectPreventDocument/getChildNodesByMark',
            dataType:"json",
            data:{mark:"zj_jzyfdgzjl"},
            success:function(data){
                correctPreventDocument.conclusionList = data.data;
            },
            error:function(){
                alert('服务器出错啦');
            }
        });*/
        //请求人员信息
        $.ajax({
            type: "post",
            url: contextPath + '/tQcCorrectPreventDocument/queryallempbyorganid',
            dataType: "json",
            success: function (data) {
                correctPreventDocument.empList = data.data;
            },
            error: function () {
                alert('服务器出错啦');
            }
        });
    },
})
