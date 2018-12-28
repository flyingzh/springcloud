var testDocumentVm = new Vue({
    el: '#imcomingReport',
    data() {
        return {
            parentParams: null,
            examineVerifyName:'',
            examineVerifyTime:'',
            isHide:true,
            isSearchHide: true,
            isTabulationHide: true,
            openTime:'',
            //审核
            isStampShow:false,
            approveComment: false,
            //启用多级审核时单据上的操作—-驳回
            rejectComment: false,
            //审批数据绑定
            approvement: {
                receiptsId: '',

                approvalResult: 1,
                approvalInfo: '',
            },
            //驳回数据绑定
            rejectement: {
                receiptsId: '',
                approvalResult: '0',
                approvalInfo: '',
            },
            receiptsId:'',
            documentStatus:'',
            testDocumentId:'',
            documentCode:'',
            reload:false,
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
            isLook:true,
            isEdit: false,
            reload: false,
            firstLoad: true,//判断是不是第一次加载
            showSourceModal: false,
            testMessagePane: 'first',
            showHighSearch: false,
            resultSelectedIndex: 1,
            showDepartment: false,
            otherSearch:[],
            styleResultArray: [],
            sendTestPeoples:[],
            testEmps:[],
            testWayDisabled:false,
            sourceCodeDisabled:false,
            sendTestDisabled:false,
            generateDisabled:false,
            canInput: true,//根据抽检方式不同，判断抽检比例及抽检结果是否可编辑
            body:{
                report_type: '',
                report_code: '',
                date_start: '',
                date_end: ''
            },
            badResons:[],
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            //显示进销存单号
            upstreamSourceCode:'',
            imcoming: {
                tQcTestDocumentEntity:{
                    id:'',
                    sourceDocumentType: '',//源单类型
                    sourceDocumentCode: '',//源单编号
                    // upstreamSourceCode: '',//进销存单号
                    sourceDepartmentName: '',
                    sendTestName: '',
                    sendTestId: '',
                    sendTestTime: '',
                    testTotalAmount: '',
                    qualifiedPercent: '',
                    documentCode: '',
                    documentType: '',
                    businessType: '',
                    documentTime: '',
                    documentStatus: '',
                    qualifiedTotalAmount: '',
                    testResult: '',
                    testOrganizationId:'',
                    testOrganizationName: '',
                    testDepartmentName: '',
                    testDepartmentId:'',
                    inspectorId: '',
                    testFinishTime : '',
                    unqualifiedTotalAmount: '',
                    totalTestConclusion: '',
                    supplierOrCustomerCode:'',
                    createName:'',
                    createTime:'',
                    updateName:'',
                    updateTime:'',
                    productTypeId:'',
                    sysFile: {
                        fileId: '',
                        fileType: 6,
                        fileDetails: []
                    }
                },
                sourceCodeDisabled:false,
                styleInput:{
                    id:'',
                    sourceDetailId:'',
                    productStyleId:'',
                    productTypeId:'',
                    testWay: '',
                    qualifiedAmount: '',
                    testAmount: '',
                    qualifiedPercent: '',
                    unqualifiedAmount: '',
                    testResult: '',
                    resultDescribeSuggest: '',
                    sourceDocumentProductStyle: {
                        productCode: '',
                        productName: ''
                    },
                    styleTestItems:[]
                }
            },
            ruleValidate:{
                sourceDocumentType: [{required: true}],//源单类型
                sendTestId: [{required: true}],//送检人
                testDepartmentName: [{required: true}],//质检部门
                inspectorId: [{required: true}],//质检员
                totalTestConclusion: [{required: true}]//整单检验结论
            },
            testWays:[],
            testStatusArr:[],
            testResultArr:[],
            sourceTypeArr:[],
            approval_config: {
                url: contextPath+'/testDocument/queryReceiptsById',
                colNames : [ '操作类型', '开始级次','目的级次','审批人','审批意见','审批时间'],
                requestData: {receiptsId:''},
                colModel : [
                    {
                        name : 'approvalResult',
                        index : 'lotSize',
                        width : 215,
                        align : "center",
                        formatter: function (value, grid, rows, state) {
                            return value == 1 ? "审核": "驳回";
                        }
                    },
                    {
                        name : 'currentLevel',
                        index : 'samplingRatio',
                        width : 215,
                        align : "center",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "一级审核": value === 2 ?
                                "二级审核":value === 3 ? "三级审核":value === 4 ?
                                    "四级审核":value === 5 ? "五级审核":value === 6 ?
                                        "六级审核":"";
                        }

                    },
                    {
                        name : 'nextLevel',
                        index : 'acceptance',
                        width : 210,
                        align : "center",
                        formatter: function (value, grid, rows, state) {
                            if(rows.approvalResult === -1 || (rows.approvalResult === 0 && !value)){
                                return '开始';
                            }
                            return value === "1" ? "一级审核": value === "2" ?
                                "二级审核":value === "3" ? "三级审核":value === "4" ?
                                    "四级审核":value === "5" ? "五级审核":value === "6" ?
                                        "六级审核":"结束";
                        }
                    },
                    {name : 'createName',index : 'rejected asc, invdate',width : 215, align : "center"},
                    {name : 'approvalInfo',index : 'rejected asc, invdate',width : 215, align : "center"},
                    {name : 'createTime',index : 'rejected asc, invdate',width : 215, align : "center"}
                ] ,
                jsonReader:{
                    root:"data"
                },
                multiselect: false,
            },
            selectSourceDoc:'',
            showUpload:false
        }

    },
    methods: {
        delFile(item) {
            layer.confirm('是否要删除这条信息!', {
                    btn: ['确定', '取消']
                }, function () {
                    item.del = true;
                    layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                }
            );
        },
        //下载附件
        download(item) {
            if (!item.fdUrl) {
                // layer.alert("文件地址为空!请先上传文件!");
                this.$Modal.info({
                    content: "文件地址为空!请先上传文件!",
                    title: '警告'
                })
                return false;
            }
            let paramsArray = [];
            Object.keys(item).forEach(key => paramsArray.push(key + '=' + item[key]));
            let url = contextPath + '/testDocument/download?' + paramsArray.join('&');
            location.href = encodeURI(url);
        },
        addAttachment: function (file, res) {
            let _this = this;
            let attachment = {
                fdName: file.name,
                fdSize: (file.size / 1024).toFixed(2) + "kb",
                uploadTime: res.uploadTime,
                uploadUser: res.uploadUser,
                fdUrl: res.fdUrl,
                fdType: res.fdType,
                del: false,
            };
            _this.imcoming.tQcTestDocumentEntity.sysFile.fileDetails.push(attachment);
        },
        handleMaxSize(file) {
            this.$Notice.warning({
                title: '文件大小超出限制!',
                desc: '【'+file.name + '】的大小超过2M'
            });
        },
        handleSuccess(res, file) {
            let _this = this;
            if (res.code === '100100') {
                _this.addAttachment(file, res.data);
            } else {
                // layer.alert("上传失败");
                _this.$Modal.info({
                    content: "上传失败",
                    title: '警告'
                })
            }
        },
        //审批意见点击确定
        getApproveInfo() {
            let _this = this;
            _this.approvement.receiptsId = _this.receiptsId;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(_this.approvement),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        // layer.alert("审核成功");
                        _this.$Modal.success({
                            content: "审核成功",
                            title: '提示'
                        })
                        if(data.data.approvalStatus == 0){
                            _this.documentStatus = "checking";
                        }
                        if(data.data.approvalStatus == 1){
                            _this.documentStatus = "auditing";
                        }
                        if(data.data.approvalStatus == -2){
                            _this.documentStatus = "temporary_save";
                        }
                        //审核完之后 根据返回值 保存单据状态
                        _this._ajaxUpdateDocumentStatus(_this.testDocumentId,_this.documentStatus);
                        //将审核信息置空
                        _this.approvement = {receiptsId:'',approvalResult:1,approvalInfo:''};
                        if(_this.documentStatus === "checking")
                        {
                            _this.imcoming.tQcTestDocumentEntity.documentStatusName = "审核中";
                            _this.imcoming.tQcTestDocumentEntity.documentStatus = "checking";
                            _this.sendTestDisabled = true;
                            _this.testWayDisabled = true;
                        }
                        else if(_this.documentStatus === "auditing")
                        {
                            _this.imcoming.tQcTestDocumentEntity.documentStatusName = "已审核";
                            _this.imcoming.tQcTestDocumentEntity.documentStatus = "auditing";
                            _this.imcoming.tQcTestDocumentEntity.testFinishTime = new Date().format("yyyy-MM-dd hh:mm:ss")
                            _this.sendTestDisabled = true;
                            _this.examineVerifyName = layui.data('user').username;
                            _this.examineVerifyTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                            _this.testWayDisabled = true;
                        }
                        else if(_this.documentStatus === "temporary_save")
                        {
                            _this.imcoming.tQcTestDocumentEntity.documentStatusName = "暂存";
                            _this.imcoming.tQcTestDocumentEntity.documentStatus = "temporary_save";
                            _this.imcoming.tQcTestDocumentEntity.testFinishTime = "";
                        }
                        //刷新页面
                        _this.$forceUpdate();
                        _this.reload=!_this.reload;
                        _this.initApproval();
                    }else {
                        // layer.alert("审核失败");
                        _this.$Modal.info({
                            content: "审核失败",
                            title: '警告'
                        })
                    }
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    _this.$Modal.info({
                        content: "服务器出错",
                        title: '警告'
                    })
                }
            })
        },
        approval(){
            let _this=this;

            let invalidArr=[];
            if(_this.documentStatus !='await_check'&&_this.documentStatus !='checking'&&_this.documentStatus !='reject'){
                invalidArr.push(_this.documentCode);
            }
            if(invalidArr.length > 0){
                // layer.alert("编号为"+invalidArr.join(",")+"的单据，当前状态不可以审核!");
                _this.$Modal.info({
                    content: "编号为"+invalidArr.join(",")+"的单据，当前状态不可以审核!",
                    title: '警告'
                })
                return false;
            }
            //发送请求
            if(_this.documentCode === "" || _this.documentStatus === "temporary_save"){
                // layer.alert("请提交检验单!");
                _this.$Modal.info({
                    content: "请提交检验单!",
                    title: '警告'
                })
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:_this.receiptsId,docTypeCode:`${_this.imcoming.tQcTestDocumentEntity.documentType}_code`}),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100515"){
                        // layer.alert("审核成功");
                        _this.$Modal.success({
                            content: "审核成功",
                            title: '提示'
                        })
                        _this._ajaxUpdateDocumentStatus(_this.testDocumentId,"auditing");
                    }
                    if(data.code === "100514"){
                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                    "【六级审核】":data.msg;
                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限");
                        _this.$Modal.info({
                            content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限",
                            title: '警告'
                        })
                    }
                    if(data.code === "100100"){
                        if(status === "auditing"){
                            // layer.alert("检验单已审核");
                            _this.$Modal.info({
                                content: "检验单已审核",
                                title: '提示'
                            })
                            return false;
                        }
                        _this.initApproval();
                        _this.approveComment = true;
                    }
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    _this.$Modal.info({
                        content: "服务器出错",
                        title: '警告'
                    })
                }
            })
        },
        //驳回
        reject() {
            let _this=this;

            let invalidArr = [];
            if(_this.documentStatus =='temporary_save' ||_this.documentStatus === "" || _this.documentStatus === 'auditing'){
                invalidArr.push(_this.documentCode);
            }
            if(invalidArr.length > 0){
                // layer.alert("编号为"+invalidArr.join(",")+"的单据，当前状态不可以驳回!");
                _this.$Modal.info({
                    content: "编号为"+invalidArr.join(",")+"的单据，当前状态不可以驳回!",
                    title: '警告'
                })
                return false;
            }

            if(_this.documentStatus === "" || _this.documentStatus === "temporary_save"){
                // layer.alert("请提交检验单!");
                _this.$Modal.info({
                    content: "请提交检验单!",
                    title: '警告'
                })
                return false;
            }

            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/isReject",
                data: {testDocumentId:_this.imcoming.tQcTestDocumentEntity.id ,testDocumentCode:_this.imcoming.tQcTestDocumentEntity.documentCode},
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100"){
                        let result = data.data
                        if(result)
                        {
                            $.ajax({
                                type: "POST",
                                url: contextPath+"/testDocument/findUserOperation",
                                contentType: 'application/json',
                                data: JSON.stringify({receiptsId:_this.receiptsId,docTypeCode:`${_this.imcoming.tQcTestDocumentEntity.documentType}_code`}),
                                dataType: "json",
                                success: function(data) {
                                    if(data.code === "100100"){
                                        _this.rejectComment = true;
                                    }
                                    if(data.code === "100514"){
                                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                                    "【六级审核】":data.msg;
                                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的驳回权限");
                                        _this.$Modal.info({
                                            content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的驳回权限",
                                            title: '警告'
                                        })
                                    }
                                    if(data.code === "100515"){
                                        // layer.alert("驳回成功");
                                        _this.$Modal.success({
                                            content: "驳回成功",
                                            title: '提示'
                                        })
                                        _this.documentStatus = "reject";
                                        _this._ajaxUpdateDocumentStatus(_this.testDocumentId,_this.documentStatus);
                                        _this.reload=!_this.reload;
                                    }
                                },
                                error: function(err){
                                    // layer.alert("服务器出错");
                                    _this.$Modal.info({
                                        content: "服务器出错",
                                        title: '警告'
                                    })
                                }
                            })
                        }
                        else
                        {
                            // layer.alert("该检验单有生成子单，请勿驳回");
                            _this.$Modal.info({
                                content: "该检验单有生成子单，请勿驳回",
                                title: '警告'
                            })
                        }
                    }
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    _this.$Modal.info({
                        content: "服务器出错",
                        title: '警告'
                    })
                }
            })

            //发送请求

        },
        //驳回点击确定
        getRejectInfo() {
            let _this = this;
            _this.rejectement.receiptsId = _this.receiptsId;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(_this.rejectement),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        // layer.alert("驳回成功");
                        _this.$Modal.success({
                            content: "驳回成功",
                            title: '提示'
                        })
                        _this.documentStatus = "reject";
                        console.log(data.data.approvalStatus)
                        if(data.data.approvalStatus == -1){
                            _this.imcoming.tQcTestDocumentEntity.documentStatusName = "驳回";
                            _this.imcoming.tQcTestDocumentEntity.documentStatus = "reject"
                            _this.imcoming.tQcTestDocumentEntity.testFinishTime = "";
                            _this.examineVerifyName = "";
                            _this.examineVerifyTime = "";
                        }
                        //驳回到原点
                        if(data.data.approvalStatus == -2){
                            _this.imcoming.tQcTestDocumentEntity.documentStatusName = "暂存";
                            _this.imcoming.tQcTestDocumentEntity.documentStatus = "temporary_save";
                            _this.documentStatus =  "temporary_save";
                            _this.imcoming.tQcTestDocumentEntity.testFinishTime = "";
                            _this.sendTestDisabled = false;
                            _this.testWayDisabled = false;
                        }
                        _this._ajaxUpdateDocumentStatus(_this.testDocumentId, _this.documentStatus);
                    }else {
                        // layer.alert("驳回失败");
                        _this.$Modal.info({
                            content: "驳回失败",
                            title: '警告'
                        })
                    }
                    _this.rejectement = {receiptsId:'',approvalResult:'0',approvalInfo:''};
                    _this.$forceUpdate();
                    _this.reload=!this.reload;
                    _this.initApproval();
                },
                error: function(err){
                    layer.alert("服务器出错");
                    _this.$Modal.info({
                        content: "服务器出错",
                        title: '警告'
                    })

                }
            })
        },

        initApproval(){
            let _this = this;
            $.ajax({
                type: "post",
                url: contextPath+'/testDocument/queryProcessByReceiptsId',
                data:{receiptsId:_this.receiptsId},
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
                    process.unshift(
                        {
                            processLevel:"开始"
                        }
                    );
                    process.push(
                        {
                            processLevel:"结束"
                        }
                    );

                    if(process[1].currentLevel === data.data.levelLength){
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                    }
                    _this.steplist = process;

                    var curr = process[1].currentLevel;
                    for (let i = 0; i < _this.stepData.length; i++) {
                        if (curr === _this.stepData[i].currentLevel) {
                            _this.currentStep = _this.stepData[i+1].subtitle;
                            _this.nextStep = _this.stepData[i+2].subtitle;
                            if(_this.stepData[i+1].currentLevel === process.length - 2){
                                _this.nextStep = _this.stepData[_this.stepData.length-1].subtitle;
                            }
                            break;
                        } else if(curr + 1 === _this.stepData[i].currentLevel) {
                            _this.currentStep = _this.stepData[i].subtitle;
                            _this.nextStep = _this.stepData[i+1].subtitle;
                        }
                    }
                    console.log(_this.currentStep,_this.nextStep)
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },
        _ajaxUpdateDocumentStatus(id,status){
            if(!id || !status){
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/updateByTestDocumentIdAndStatus",
                dataType: "json",
                async:false,
                data:{testDocumentId:id,documentStatus:status},
                success: function(res) {

                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        unformatDocumentType(value){
            if(!value){
                return '';
            }else if(this.documentTypeArr.length < 1){
                return value;
            }
            return this.documentTypeArr[this.documentTypeArr.map(function(e) { return e.name; }).indexOf(value)]
                ? this.documentTypeArr[this.documentTypeArr.map(function(e) { return e.name; }).indexOf(value)].value
                : value;
        },
        formatterDocumentType(value){
            if(!value){
                return '';
            }else if(this.documentTypeArr.length < 1){
                return value;
            }
            return this.documentTypeArr[this.documentTypeArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.documentTypeArr[this.documentTypeArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;
        },
        showDepartmentTree(value){
            console.log(this.showSourceModal)
            if(this.showDepartment === true){
                this.showDepartment = false;
                return;
            }
            this.showDepartment = value;
        },
        highSearch(){
            this.showHighSearch = !this.showHighSearch;
        },
        addSearch(){
            this.otherSearch.push({name:'',include:'', key: ''});
        },
        deleteSearch(index){
            this.otherSearch.splice(index,1);
        },
        treeClickCallBack(event, treeId, treeNode){
            this.imcoming.tQcTestDocumentEntity.testDepartmentName = treeNode.name;
            this.imcoming.tQcTestDocumentEntity.testDepartmentId = treeNode.id;
            this.showDepartment = false;
            this.loadTestEmp(treeNode.id)
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        getSendTestPeople(){
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/getCurrentUserOrgEmployees",
                contentType: 'application/json',
                dataType: "json",
                success: function(res) {
                    _this.sendTestPeoples=[];
                    if(res.code === '100100' && res.data.length > 0){
                        for(let emp of res.data){
                            _this.sendTestPeoples.push({label:emp.empName,value:emp.id,code:emp.empCode});
                        }
                    }
                },
                error: function(err){

                },
            });
        },
        fetchOrg(){
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/getCurrentUserOrgInfo",
                contentType: 'application/json',
                dataType: "json",
                success: function(res) {
                },
                error: function(err){

                },
            });
        },
        //新增,修改操作
        save(params){
            if(this.styleResultArray[this.resultSelectedIndex - 1]){
                Object.assign(this.styleResultArray[this.resultSelectedIndex - 1], this.imcoming.styleInput);
            }
            this.reInitStyleResult();

            let This = this;

            if(params === 'submit'){ // 验证必填项，跟其他验证不冲突，所以保留其他验证
                // this.validate();
                // if(!this.submitValidate){
                //     return ;
                // }
                if(!This.varifyRequire()){
                    return false;
                }
            }

            if(This.documentStatus === "await_check" || This.imcoming.tQcTestDocumentEntity.documentStatusName === "待审核")
            {
                // layer.alert("该单在审核中，请勿修改！");
                This.$Modal.info({
                    content: "该单在审核中，请勿修改！",
                    title: '警告'
                })
                return false;
            }
            else if(This.documentStatus === "auditing" || This.imcoming.tQcTestDocumentEntity.documentStatusName === "已审核")
            {
                // layer.alert("该单已审核，请勿修改！");
                This.$Modal.info({
                    content: "该单已审核，请勿修改！",
                    title: '警告'
                })
                return false;
            }

            //送检员
            for(let people of This.sendTestPeoples)
            {
                if(people.value == This.imcoming.tQcTestDocumentEntity.sendTestId)
                {
                    This.imcoming.tQcTestDocumentEntity.sendTestName = people.label
                }
            }
            //质检员
            for(let people of This.testEmps)
            {
                if(people.value == This.imcoming.tQcTestDocumentEntity.inspectorId)
                {
                    This.imcoming.tQcTestDocumentEntity.inspectorName = people.label
                }
            }
            //不良原因
            let styleItemsArr = [];
            for(let s of This.styleResultArray){
                styleItemsArr = styleItemsArr.concat(s.styleTestItems);
            }
            for(let item of styleItemsArr) {
                for(let r of this.badResons){
                    if(item.badReasonId == r.value){
                        item.badReasonName = r.name;
                        break;
                    }
                }
            }
            //来源于按钮的状态，见test-document-add
            let type = {type: params};
            //从列表或者源单带来的状态
            let status =window.parent.params.params;
            if(status === "" || status === undefined)
            {
                status = {type : "save"};
            }


            if(!this.imcoming.styleInput.showStyleItems){
                // layer.alert(`该单没有对应的检验项目，请添加检验项目后再提交！`);
                This.$Modal.info({
                    content: "该单没有对应的检验项目，请添加检验项目后再提交！",
                    title: '警告'
                })
                return false;
            }
            // if(!this.imcoming.styleInput.showStyleItems && type.type==='submit'){
            //     layer.alert(`该单没有对应的检验项目，请添加检验项目后再提交！`);
            //     return false;
            // }

            if(status.type === "update")
            {
                if(This.imcoming.tQcTestDocumentEntity.documentStatusName === "已审核")
                {
                    // layer.alert("单据已审核，不能提交!")
                    This.$Modal.info({
                        content: "单据已审核，不能提交!",
                        title: '警告'
                    })
                    return false;
                }
                else if(This.imcoming.tQcTestDocumentEntity.documentStatusName === "驳回")
                {
                    // layer.alert("单据未驳回到提交人，不能提交修改!")
                    This.$Modal.info({
                        content: "单据未驳回到提交人，不能提交修改!",
                        title: '警告'
                    })
                    return false;
                }

                let data = Object.assign({}, This.imcoming, {tqcStyleTestInfoVo: This.styleResultArray}, type);

                if(params === 'submit') {
                    if(!This.varifyRequire()){
                        return false;
                    }
                    if(This.validaRequired() === false){
                        return false;
                    }
                }
                window.top.home.loading('show');
                $.ajax({
                    type: "POST",
                    url: contextPath+"/testDocument/update",
                    contentType: 'application/json;charset=UTF-8',
                    dataType: "json",
                    data:JSON.stringify(data),
                    success: function(res) {
                        window.top.home.loading('hide');
                        This.htHaveChange = false;
                        if(res.code == -1)
                        {
                            // layer.alert(res.msg)
                            This.$Modal.info({
                                content: res.msg,
                                title: '警告'
                            })

                        }
                        else
                        {
                            if(type.type === 'submit')
                            {
                                This.imcoming.tQcTestDocumentEntity.documentStatusName = "待审核";
                                This.imcoming.tQcTestDocumentEntity.documentStatus = "await_check"
                                This.documentStatus="await_check";
                                This.testDocumentId = res.data;
                                // layer.alert("提交"+res.msg)
                                This.$Modal.success({
                                    content: "提交"+res.msg,
                                    title: '提示'
                                })
                                This.sendTestDisabled = true;
                                This.testWayDisabled = true;
                                This.imcoming.tQcTestDocumentEntity.updateName = layui.data('user').username;
                                This.imcoming.tQcTestDocumentEntity.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                This.$forceUpdate();
                            }
                            else
                            {
                                // layer.alert("暂存"+res.msg)
                                This.$Modal.success({
                                    content: "暂存"+res.msg,
                                    title: '提示'
                                })
                                This.imcoming.tQcTestDocumentEntity.updateName = layui.data('user').username;
                                This.imcoming.tQcTestDocumentEntity.updateTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                This.testDocumentId = res.data;
                            }
                        }
                    },
                    error: function(err){
                        console.log("服务器出错");
                    },
                });
            }
            else
            {
                let data;
                data = Object.assign({}, This.imcoming, {tqcStyleTestInfoVo: This.styleResultArray}, type);
                console.log(data);
                if(params === 'submit') {
                    if(!This.varifyRequire()){
                        return false;
                    }
                    if(This.validaRequired() === false){
                        return false;
                    }
                }
                //save接口，如果是修改返回的是检验单id，如果是暂存或直接提交则返回对象以及id，由type决定
                //情况1，先暂存再提交；情况2，直接提交；情况3，重复暂存；情况4，重复提交
                window.top.home.loading('show');
                $.ajax({
                    type: "POST",
                    url: contextPath+"/testDocument/save",
                    contentType: 'application/json; charset=utf-8',
                    dataType: "json",
                    data:JSON.stringify(data),
                    success: function(res) {
                        window.top.home.loading('hide');
                        if(res.code == -1)
                        {
                            // layer.alert(res.msg)
                            This.$Modal.info({
                                content: res.msg,
                                title: '警告'
                            })
                        }
                        else
                        {
                            if(type.type === 'submit')
                            {
                                This.imcoming.tQcTestDocumentEntity.documentStatusName = "待审核";
                                This.imcoming.tQcTestDocumentEntity.documentStatus = "await_check"
                                This.documentStatus="await_check";
                                if(isNaN(res.data))
                                {
                                    This.testDocumentId = res.data.tQcTestDocumentEntity.id;
                                    This.imcoming.tQcTestDocumentEntity.id = res.data.tQcTestDocumentEntity.id;
                                    This.styleResultArray = res.data.tqcStyleTestInfoVo;
                                    This.imcoming.styleInput = Object.assign({}, This.styleResultArray[This.resultSelectedIndex - 1]);
                                    This.imcoming.tQcTestDocumentEntity.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                }
                                else
                                {
                                    This.testDocumentId = res.data;
                                    This.imcoming.tQcTestDocumentEntity.id = res.data;
                                    This.imcoming.tQcTestDocumentEntity.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                }
                                console.log("提交的id：",This.testDocumentId);
                                // layer.alert("提交"+res.msg)
                                This.$Modal.success({
                                    content: "提交"+res.msg,
                                    title: '提示'
                                })
                                This.sendTestDisabled = true;
                                This.testWayDisabled = true;
                                This.$forceUpdate();
                            }
                            else
                            {
                                if(isNaN(res.data))
                                {
                                    // layer.alert("暂存"+res.msg)
                                    This.$Modal.success({
                                        content: "暂存"+res.msg,
                                        title: '提示'
                                    })
                                    This.styleResultArray = res.data.tqcStyleTestInfoVo;
                                    This.imcoming.tQcTestDocumentEntity.id = res.data.tQcTestDocumentEntity.id;
                                    This.imcoming.tQcTestDocumentEntity.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                    if(This.imcoming.styleInput.showStyleItems){
                                        This.imcoming.styleInput = Object.assign({}, This.styleResultArray[This.resultSelectedIndex - 1]);
                                    }
                                    console.log(This.styleResultArray);
                                }
                                else
                                {
                                    // layer.alert("暂存"+res.msg)
                                    This.$Modal.success({
                                        content: "暂存"+res.msg,
                                        title: '提示'
                                    })
                                    This.imcoming.tQcTestDocumentEntity.id = res.data;
                                    This.testDocumentId = res.data;
                                    This.imcoming.tQcTestDocumentEntity.createTime = new Date().format("yyyy-MM-dd hh:mm:ss");
                                }
                            }
                            This.imcoming.styleInput.showStyleItems  = true;
                            This.parentParams.type = 'update';
                            Object.assign(This.imcoming.styleInput,This.styleResultArray[This.resultSelectedIndex - 1],{index: This.resultSelectedIndex});
                            This.$forceUpdate();
                        }
                    },
                    error: function(err){
                        console.log("服务器出错");
                    },
                });
            }
        },
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        //必填检验，画红星星的
        varifyRequire(){
            let result ;
            this.$refs['formValidate'].validate((valid) => {
                if (valid) {//验证通过
                    result = true;
                } else {
                    result = false;
                }
            })
            return result;
        },
        validaRequired(){
            let length = this.styleResultArray.length;
            for(let i =0; i < length; i++ ){
                if(!this.styleResultArray[i].testWay){
                    this.$Message.info(
                        {
                            content: this.styleResultArray[i].sourceDocumentProductStyle.productName + '检验方式必填',
                            duration: 3,
                        })
                    return false;
                }
                if(isNaN(this.styleResultArray[i].unqualifiedAmount)){
                    this.$Message.info({
                        content: this.styleResultArray[i].sourceDocumentProductStyle.productName + '不合格数必填',
                        duration: 3
                    })

                    return false;
                }
                if(!this.styleResultArray[i].testResult){
                    this.$Message.info({
                        content: this.styleResultArray[i].sourceDocumentProductStyle.productName + '检验结果检验方式必填',
                        duration: 3
                    })
                    return false;
                }
                if(!this.styleResultArray[i].resultDescribeSuggest){
                    this.$Message.info({
                        content :this.styleResultArray[i].sourceDocumentProductStyle.productName + '结果描述/建议检验方式必填',
                        duration: 3
                    })
                    return false;
                }
            }
        },

        doSelectSource(){
            if(!this.sourceCodeDisabled){
                this.showSourceModal = !this.showSourceModal;
            }
        },
        closeSourceModal(){
            this.showSourceModal = false;
            this.loadData('');
            this.htTestChange();
        },
        //修改回显
        loadUpdate(testDocumentId,type) {
            this.generateDisabled = true;
            this.sourceCodeDisabled = true;
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/info/"+ testDocumentId,
                contentType: 'application/json',
                dataType: "json",
                success: function(res) {
                    if(res.code === '100100') {

                        _this.loadTestEmp(res.data.tQcTestDocumentEntity.testDepartmentId);
                        if(!res.data.tQcTestDocumentEntity.sysFile){
                            let emptyFileObj = Object.assign({}, {
                                sysFile: {
                                    fileId: '',
                                    fileType: 6,
                                    fileDetails: []
                                }
                            });
                            _this.imcoming.tQcTestDocumentEntity = Object.assign({},res.data.tQcTestDocumentEntity,emptyFileObj);
                        }else {
                            _this.imcoming.tQcTestDocumentEntity = Object.assign({},res.data.tQcTestDocumentEntity);
                        }
                        //把单据编号,单据状态和单据id独立出来
                        _this.upstreamSourceCode = res.data.tQcTestDocumentEntity.upstreamSourceCode;
                        _this.receiptsId =  _this.imcoming.tQcTestDocumentEntity.documentCode;
                        _this.documentStatus = _this.imcoming.tQcTestDocumentEntity.documentStatus;
                        _this.documentCode = _this.imcoming.tQcTestDocumentEntity.documentCode;
                        _this.testDocumentId = _this.imcoming.tQcTestDocumentEntity.id;
                        _this.styleResultArray = res.data.tqcStyleTestInfoVo;
                        _this.examineVerifyName = res.data.tQcTestDocumentEntity.examineVerifyName;
                        _this.examineVerifyTime = res.data.tQcTestDocumentEntity.examineVerifyTime;
                        _this.imcoming.tQcTestDocumentEntity.documentTime = new Date(_this.imcoming.tQcTestDocumentEntity.documentTime).format("yyyy-MM-dd");
                        _this.initStyleResult();//生成款式汇总列表
                        _this.editTestResult();
                        if(_this.documentStatus != 'temporary_save'){
                            _this.initApproval();
                        }
                        if(_this.imcoming.tQcTestDocumentEntity.documentStatus === 'await_check' || _this.imcoming.tQcTestDocumentEntity.documentStatus === 'auditing' || _this.imcoming.tQcTestDocumentEntity.documentStatus === 'reject')
                        {
                            _this.sendTestDisabled = true;
                            _this.$forceUpdate();
                        }
                    }
                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        loadData(value,id){
            let _this=this;
            let sendData=null;
            console.log(value,id);
            console.log(_this.selectSourceDoc);
            if(value){
                sendData = Object.assign({},{tQcTestDocumentEntity:{
                    sourceDocumentCode:value,
                    productTypeId:id

                }});
                _this.sourceCodeDisabled=true;
                _this.generateDisabled = true;
            }else {

                _this.imcoming.tQcTestDocumentEntity.sourceDocumentCode=_this.selectSourceDoc.documentCode;
                // _this.imcoming.tQcTestDocumentEntity.upstreamSourceCode=_this.selectSourceDoc.upstreamSourceCode;//手动新增页面显示进销存单号
                _this.upstreamSourceCode=_this.selectSourceDoc.upstreamSourceCode;//手动新增页面显示进销存单号
                _this.imcoming.tQcTestDocumentEntity.productTypeId=_this.selectSourceDoc.productTypeId;
                sendData = _this.imcoming;

            }
            console.log(sendData);
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/selectSource",
                contentType: 'application/json',
                dataType: "json",
                data:JSON.stringify( sendData),
                success: function(res) {
                    if(res.code === '100100') {
                        if(!res.data.tQcTestDocumentEntity.sysFile){
                            let emptyFileObj = Object.assign({}, {
                                testDepartmentName:'',
                                totalTestConclusion:'',
                                sysFile: {
                                    fileId: '',
                                    fileType: 6,
                                    fileDetails: []
                                }
                            });
                            _this.imcoming.tQcTestDocumentEntity = Object.assign({},res.data.tQcTestDocumentEntity,emptyFileObj);

                        }else {
                            _this.imcoming.tQcTestDocumentEntity = Object.assign({},res.data.tQcTestDocumentEntity);
                        }
                        //把单据编号,单据状态和单据id独立出来
                        //默认检验结果
                        _this.upstreamSourceCode = res.data.tQcSourceDocumentEntity.upstreamSourceCode;
                        _this.imcoming.tQcTestDocumentEntity.testResult = 'jyjghg';
                        _this.receiptsId =  _this.imcoming.tQcTestDocumentEntity.documentCode;
                        _this.documentStatus = _this.imcoming.tQcTestDocumentEntity.documentStatus;
                        _this.documentCode = _this.imcoming.tQcTestDocumentEntity.documentCode;
                        _this.testDocumentId = _this.imcoming.tQcTestDocumentEntity.id;
                        _this.imcoming.tQcTestDocumentEntity.documentTime = new Date(_this.imcoming.tQcTestDocumentEntity.documentTime).format("yyyy-MM-dd");
                        _this.styleResultArray = res.data.tqcStyleTestInfoVo;
                        if (_this.firstLoad) {
                            _this.initStyleResult();
                            _this.firstLoad = false;
                        } else {
                            _this.reInitStyleResult();
                        }
                        res.data.tqcStyleTestInfoVo.map(item => {
                            item.allTestName = '';
                        item.styleTestItems.map(list => {
                            if(list.testItemEntity){
                            list.sampleAmount = parseInt(((list.testItemEntity.randomTestProportion)/100 || 0)
                                * item.testAmount, 10);
                            list.sampleUnqualifiedAmount =  list.testItemEntity.sampleUnqualifiedAmount;
                            list.sampleQualifiedAmount  =  list.testItemEntity.sampleQualifiedAmount;
                            list.rejectNumber =  list.testItemEntity.rejectNumber;
                            list.allowNumber =  list.testItemEntity.allowNumber;
                            list.randomTestProportion = list.testItemEntity.randomTestProportion ? list.testItemEntity.randomTestProportion : list.defaultDomTestProportion;
                            item.showStyleItems = true;
                        }else {
                            item.showStyleItems = false;
                            item.allTestName += list.testItemName + ' , ';
                        }
                    });
                        if(item.allTestName.length > 0){// 去除最后一个逗号
                            item.allTestName = item.allTestName.substring(0, item.allTestName.length - 2);
                        }
                    });

                        _this.editTestResult();
                        _this.defaultPass();

                        console.log(_this.imcoming.styleInput);

                    }
                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        add(){
            this.isEdit = true;
            this.isLook = false;
        },
        testWayChange(value) {
            setTimeout(()=>{
                if (value === 'qj') {
                this.canInput = true;
                this.imcoming.styleInput.styleTestItems.map((item, index) => {
                    item.testResult = 'jyjghg';
                item.randomTestProportion = '100';
                if(!this.testWayChangeRecordQj){
                    return;
                }
                // item.testResult = this.testWayChangeRecordQj.styleTestItems[index].testResult;
                item.testValue = this.testWayChangeRecordQj.styleTestItems[index].testValue;
                item.sampleAmount = this.testWayChangeRecordQj.testAmount;
                // item.sampleUnqualifiedAmount = this.testWayChangeRecordQj.styleTestItems[index].sampleUnqualifiedAmount;
                item.sampleUnqualifiedAmount = 0;
                item.sampleQualifiedAmount = parseInt(item.sampleAmount, 10) - (parseInt(item.sampleUnqualifiedAmount, 10) || 0) ;
                $('.sampleQualifiedAmount' + index).html(item.sampleQualifiedAmount);
                item.badReasonId = this.testWayChangeRecordQj.styleTestItems[index].badReasonId;
                item.remark = this.testWayChangeRecordQj.styleTestItems[index].remark;
                item.allowNumber = 0;
                item.rejectNumber = 0;
                this.htTestChange();
                this.$forceUpdate();
            })

            } else if (value === 'mj') {
                this.canInput = true;
                this.imcoming.styleInput.styleTestItems.map((item, index) => {
                    item.testResult = 'jyjghg';
                item.randomTestProportion = '100';
                item.sampleUnqualifiedAmount = 0;
                // item.sampleAmount = 0;
                if(!this.testWayChangeRecordMj){
                    return;
                }
                item.allowNumber = 0;
                item.rejectNumber = 0;
                item.testValue = this.testWayChangeRecordMj.styleTestItems[index].testValue;
                item.sampleAmount = this.testWayChangeRecordQj.testAmount;
                item.sampleQualifiedAmount = parseInt(this.testWayChangeRecordMj.testAmount, 10);
                $('.sampleQualifiedAmount' + index).html(item.sampleQualifiedAmount);
                item.badReasonId = '';
                item.remark = this.testWayChangeRecordMj.styleTestItems[index].remark;
            });
            }else if (value === 'cj') {
                this.imcoming.styleInput.styleTestItems.map((item, index) => {
                    if(!this.testWayChangeRecordCj){
                    return;
                }
                item.testResult = 'jyjghg';
                // item.testResult = this.testWayChangeRecordCj.styleTestItems[index].testResult;
                item.testValue = this.testWayChangeRecordCj.styleTestItems[index].testValue;
                item.randomTestProportion = this.testWayChangeRecordCj.styleTestItems[index].randomTestProportion;
                item.sampleAmount = this.testWayChangeRecordCj.styleTestItems[index].sampleAmount;
                item.sampleUnqualifiedAmount = '';
                item.sampleQualifiedAmount = 0;
                //     parseInt(item.sampleAmount, 10) - (parseInt(item.sampleUnqualifiedAmount, 10) || 0) ;
                // $('.sampleQualifiedAmount' + index).html(item.sampleQualifiedAmount);

                item.remark = this.testWayChangeRecordCj.styleTestItems[index].remark;
                item.allowNumber = this.testWayChangeRecordCj.styleTestItems[index].testItemEntity.allowNumber;
                item.rejectNumber = this.testWayChangeRecordCj.styleTestItems[index].testItemEntity.rejectNumber;
            });
                this.canInput = true;
            }
        },30)
        },

        genReportPaper(){
            let _this=this;
            let im =  _this.imcoming.tQcTestDocumentEntity;
            if(null === im.id || undefined === im.id)
            {
                // layer.alert("检验单未审核，请提交审核!");
                this.$Modal.info({
                    content: '检验单未审核，请提交审核!',
                    title: '提示'
                })
                return false;
            }
            window.parent.activeEvent({name: '生成报告单', url: contextPath+'/quality/inspection-report.html', params: {"testDocumentId":im.id,"code":im.sourceDocumentCode}});
        },
        editTestResult() {
            let temp = this.resultSelectedIndex;//记录选中的索引
            this.testMessagePane = 'first';
            let selectRow = this.styleResultArray[this.resultSelectedIndex - 1];
            if (selectRow && (selectRow.testWay === 'cj' || selectRow.testWay === 'qj' || selectRow.testWay === 'mj')) {
                this.testWayDisabled = true;
                if(selectRow.testWay != 'cj'){//如果后台返回的不是抽检，则抽检比例默认100%

                }
            } else {
                this.testWayDisabled = false;
            }
            console.log('editTestResult:',this.styleResultArray[this.resultSelectedIndex - 1]);
            //检验结果录入中的检验结果默认显示合格
            // this.imcoming.styleInput = Object.assign({}, this.imcoming.styleInput, {index: temp}, {...this.styleResultArray[this.resultSelectedIndex - 1]});
            this.imcoming.styleInput = this.styleResultArray[this.resultSelectedIndex - 1];
            this.$set(this.imcoming.styleInput,'index',temp);
            if(!this.imcoming.styleInput.unqualifiedAmount){
                this.$set(this.imcoming.styleInput,'testResult','jyjghg');
            }
            this.notStyleItemsTip();
        },
        defaultPass(){
            //检验列表检验结果默认显示合格
            testDocumentVm.imcoming.styleInput.styleTestItems.map((item,index) => {
                item.testResult = 'jyjghg';
            });
        },
        changeStyleName(name){
            this.testMessagePane = name;

        },
        rowClick(type){//点击上一行，下一行，首行，末行
            console.log(this.styleResultArray[this.resultSelectedIndex - 1].styleTestItems)
            if(this.resultSelectedIndex === null){
                return;
            }
            this.styleResultArray[this.resultSelectedIndex - 1] = JSON.parse(JSON.stringify(Object.assign({},this.styleResultArray[this.resultSelectedIndex - 1], {...this.imcoming.styleInput})));//将编辑的内容存到款式检测结果汇总表
            if(this.styleResultArray.length === 1){
                this.reInitStyleResult();
                if(type === 'previous'){
                    // layer.alert('已是第一条');
                    this.$Modal.info({
                        content: '已是第一条',
                        title: '提示'
                    })
                }
                else if(type === 'next'){
                    // layer.alert('已是最后一条');
                    this.$Modal.info({
                        content: '已是最后一条',
                        title: '提示'
                    })
                }
                return;
            }
            if(type === 'first'){
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);
                this.resultSelectedIndex = 1;
                this.editTestResult();
                this.defaultPass();
            }
            else if(type === 'previous'){
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);
                if(this.resultSelectedIndex == 1){ //当前为首行时直接返回76
                    this.resultSelectedIndex = 1;
                    // layer.alert('已是第一条');
                    this.$Modal.info({
                        content: '已是第一条',
                        title: '提示'
                    })
                }else {
                    this.resultSelectedIndex--;
                }
                this.editTestResult();
                this.defaultPass();
            }
            else if(type === 'next'){
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);
                if(this.resultSelectedIndex == this.styleResultArray.length){ //当前为末行时直接返回
                    this.resultSelectedIndex = this.styleResultArray.length;
                    // layer.alert('已是最后一条');
                    this.$Modal.info({
                        content: '已是最后一条',
                        title: '提示'
                    })
                }else {
                    this.resultSelectedIndex++;
                }
                this.editTestResult();
                console.log(this.imcoming.styleInput);
                this.defaultPass();
            }
            else if(type === 'last'){
                this.calculateQualifiedAmount(this.resultSelectedIndex);
                this.resultSelectedIndex = this.styleResultArray.length;
                this.editTestResult();
                this.defaultPass();
            }
            this.imcoming.styleInput = JSON.parse(JSON.stringify(Object.assign({}, {...this.styleResultArray[this.resultSelectedIndex - 1]})));
            this.notStyleItemsTip();
            this.reInitStyleResult();
            this.imcoming.styleInput.index = this.resultSelectedIndex;
        },
        //检验数量大于批数提示语
        notStyleItemsTip(){
            console.log(this.parentParams);
            if(this.parentParams && this.parentParams.type === 'update'){
                this.imcoming.styleInput.showStyleItems = true;
                return;
            }
            else {
                if(!this.imcoming.styleInput.showStyleItems){
                    if(this.imcoming.styleInput.allTestName.length <= 0){
                        // layer.alert(`该商品类型没有对应的检验项目，请添加检验项目！`);
                        this.$Modal.info({
                            content: '该商品类型没有对应的检验项目，请添加检验项目！',
                            title: '警告'
                        })
                    }else {
                        layer.alert(`请先维护 [ ${this.imcoming.styleInput.allTestName} ] 检验项目对应检验数量：${this.imcoming.styleInput.testAmount} 的抽检比例 ！`);
                        // this.$Modal.info({
                        //     content: '该商品类型没有对应的检验项目，请添加检验项目！',
                        //     title: '警告'
                        // })
                    }
                }
            }
        },
        calculateQualifiedAmount(){//计算检验数量，计算不合格，合格率
            // index==='no' => 不进行总合格数，总合格率的计算；
            this.imcoming.styleInput.unqualifiedAmount = parseInt(this.imcoming.styleInput.unqualifiedAmount, 10) ? parseInt(this.imcoming.styleInput.unqualifiedAmount, 10) : 0;
            this.imcoming.styleInput.qualifiedAmount = parseInt(this.imcoming.styleInput.testAmount, 10) - this.imcoming.styleInput.unqualifiedAmount;
            this.imcoming.styleInput.qualifiedPercent = ((parseInt(this.imcoming.styleInput.qualifiedAmount, 10)/parseInt(this.imcoming.styleInput.testAmount, 10))*100).toFixed(2) + '%';
            let obj = {
                testAmount: parseInt(this.imcoming.styleInput.testAmount, 10),
                qualifiedAmount: this.imcoming.styleInput.qualifiedAmount,
                unqualifiedAmount: parseInt(this.imcoming.styleInput.unqualifiedAmount, 10),
                qualifiedPercent: this.imcoming.styleInput.qualifiedPercent
            };
            if(this.styleResultArray[this.resultSelectedIndex - 1]){
                this.styleResultArray[this.resultSelectedIndex -1] = Object.assign({},this.styleResultArray[this.resultSelectedIndex -1], {...obj});
            }
            this.calculateTotal();
        },
        calculateTotal(){//统计总数，不合格总数，合格率
            this.imcoming.tQcTestDocumentEntity.testTotalAmount = 0;
            this.imcoming.tQcTestDocumentEntity.unqualifiedTotalAmount = 0;
            let length = this.styleResultArray.length;
            for(let i = 0; i < length; i++){
                console.log(this.styleResultArray[i].testTotalAmount);
                if(!isNaN(parseInt(this.styleResultArray[i].testAmount, 10))){
                    this.imcoming.tQcTestDocumentEntity.testTotalAmount += Number(this.styleResultArray[i].testAmount);
                }
                if(!isNaN(parseInt(this.styleResultArray[i].unqualifiedAmount, 10))){
                    this.imcoming.tQcTestDocumentEntity.unqualifiedTotalAmount += Number(this.styleResultArray[i].unqualifiedAmount);
                }
            }
            this.imcoming.tQcTestDocumentEntity.qualifiedTotalAmount = this.imcoming.tQcTestDocumentEntity.testTotalAmount - this.imcoming.tQcTestDocumentEntity.unqualifiedTotalAmount;
            this.imcoming.tQcTestDocumentEntity.qualifiedPercent = (this.imcoming.tQcTestDocumentEntity.qualifiedTotalAmount/this.imcoming.tQcTestDocumentEntity.testTotalAmount*100).toFixed(2) + '%';
        },
        testValueBlur(data){// 检测值输入框失去光标事件
            console.log(data);

            //jyjghg jyjgtbfx jyjgbhg => 合格 特别放行 不合格
            let target;
            let isNaN1 = isNaN(data.testItemEntity.goalValue);
            let isNaN2 = isNaN(data.testItemEntity.goalValueName);
            if(!isNaN1 && isNaN2)
            {
                target = data.testItemEntity.goalValueName;
            } else {
                target = parseInt(data.testItemEntity.goalValue, 10); //目标值
            }

            let test;//检测值
            let testnan = isNaN(data.testValue);
            if(testnan)
            {
                test = data.testValue;
            } else {
                test = parseInt(data.testValue); //目标值
            }
            let upperLimitValue = parseInt(data.testItemEntity.upperLimitValue);//上限值
            let lowerLimitValue = parseInt(data.testItemEntity.lowerLimitValue);//下限值
            console.log('target: ' +target,'test: ' +test,'upperLimitValue: ' +upperLimitValue,'lowerLimitValue: ' +lowerLimitValue)
            if(data.testItemEntity.compareSymbolName === '='){//合格/不合格状态：检测值=目标值
                if(target === test){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            if(data.testItemEntity.compareSymbolName === 'between'){ //合格/不合格状态：下限值=<检测值《=上限值；
                if( test <= upperLimitValue && test >= lowerLimitValue){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            // if(data.testItemEntity.compareSymbolName === '>='){
            if(data.testItemEntity.compareSymbolName === '&gt;='){
                if( test >= target){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            // if(data.testItemEntity.compareSymbolName === '<='){
            if(data.testItemEntity.compareSymbolName === '&lt;='){
                if( test <= target){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            // if(data.testItemEntity.compareSymbolName === '<>'){
            if(data.testItemEntity.compareSymbolName === '&lt;&gt;'){
                if( test !== target){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            // if(data.testItemEntity.compareSymbolName === '>'){
            if(data.testItemEntity.compareSymbolName === '&gt;') {
                if( test > target){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            // if(data.testItemEntity.compareSymbolName === '<'){
            if(data.testItemEntity.compareSymbolName === '&lt;'){
                if( test < target){
                    data.testResult = 'jyjghg';
                }
                else {
                    data.testResult = 'jyjgbhg';
                }
            }
            this.$forceUpdate();
        },
        randomTestProportionBlur(data, i, e){// 抽检比例输入框失去光标事件

            if(parseFloat(data.randomTestProportion) < parseFloat(data.defaultDomTestProportion)){
                // layer.alert('不能低于默认值');
                this.$Modal.info({
                    content: '不能低于默认值',
                    title: '警告'
                })
                data.randomTestProportion = parseFloat(data.defaultDomTestProportion);
            }else if(parseFloat(data.randomTestProportion) > parseFloat(100)){
                // layer.alert('抽检比例不能大于100%');
                this.$Modal.info({
                    content: '抽检比例不能大于100%',
                    title: '警告'
                })

                data.randomTestProportion = parseFloat(data.defaultDomTestProportion);
            }else {

                data.sampleAmount = parseInt(parseInt(data.randomTestProportion, 10)* this.imcoming.styleInput.testAmount/100, 10)
            }
            this.$forceUpdate();
        },
        sampleUnqualifiedAmountBlur(data,index){// 取样不合格数输入框失去光标事件

            if(parseInt(data.sampleAmount) <  parseInt(data.sampleUnqualifiedAmount)){
                this.$Modal.info({
                    content: '取样不合格数不能大于取样数',
                    title: '警告'
                })
                return false;
            }

            Vue.set(data,'sampleQualifiedAmount',parseInt(data.sampleAmount) - parseInt(data.sampleUnqualifiedAmount));
            if(parseInt(data.sampleUnqualifiedAmount, 10) < parseInt(data.allowNumber, 10)){
                data.testResult = "jyjghg";

            }else if(parseInt(data.sampleUnqualifiedAmount, 10) > parseInt(data.rejectNumber, 10)){
                data.testResult = "jyjgbhg";
            }
            this.$forceUpdate();
        },
        hideMirror(name) {
            $(`.select${name} .mirror`).hide()
        },
        showMirror(name) {
            let top = $(`.select${name}`).offset().top-$(document).scrollTop()- 65;
            let left = $(`.select${name}`).offset().left + 150;
            $(`.select${name} .mirror`).css('top',top);
            $(`.select${name} .mirror`).css('left',left);
            $(`.select${name} .mirror`).show()
        },
        initStyleResult(){
            let This = this;
            $("#styleResult_table").jqGrid({
                dataType:'local',
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselect: true,
                colNames : [ '检验结果', '结果描述/建议','图片','商品编码','商品名称','批号','检验数量','计数单位','总重','计重单位','质检方式', '合格数', '不合格数','合格率', '质检状态'],
                colModel : [
                    {name : 'testResult',index : 'testResult',width : 100, align: "center",
                        formatter:function (value, grid, rows, state) {
                            if(value === 'jyjghg'){
                                return '合格';
                            }else if (value === 'jyjgtbfx'){
                                return '特别放行';
                            }else if(value === 'jyjgbhg'){
                                return '不合格';
                            }else {
                                return '';
                            }
                        }},
                    {name : 'resultDescribeSuggest',index:'resultDescribeSuggest', width : 140,align : "center"},
                    {name : 'sourceDocumentProductStyle.pictureUrl',width : 80,align : "center",formatter: function (cellvalue, options, rowObject) {
                        // console.log(cellvalue, options, rowObject);
                        $(document).on('mouseout', '.can', function () {
                            This.hideMirror(parseFloat(options.rowId))
                        });
                        $(document).on('mouseenter', '.select' + parseFloat(options.rowId), function () {
                            console.log(parseFloat(options.rowId));
                            This.showMirror(parseFloat(options.rowId))
                        });
                        let url;
                        if(!cellvalue){
                            url = 'http://'+ window.location.host + contextPath+'/images/no_pic.png';
                        } else {
                            url = cellvalue;
                        }
                        return `<div class="select${parseFloat(options.rowId)} can">
                                    <img width="50px" height="50px" src="${url}"/>
                                    <div class="mirror"><img width="180px" src="${url}"></div>
                                </div>`;
                    }},
                    {name : 'sourceDocumentProductStyle.productCode',width : 80,align : "center", formatter: function (value, grid, rows, state) {
                        $(document).on("click", ".detail" + value, function () {
                            this.toProductDetail({value, grid, rows, state})
                        });
                        let btns = `<a type="primary" class="detail${value}">${value}</a>`;
                        return btns
                    }},
                    {name : 'sourceDocumentProductStyle.productName',width : 100,align : "center"},
                    {name : 'sourceDocumentProductStyle.lotNumber',width : 140, align: "center"},
                    {name : 'testAmount',width : 80,align : "center"},
                    {name : 'sourceDocumentProductStyle.countingUnit',width : 80, align: "center"},
                    {name : 'sourceDocumentProductStyle.weight',width : 80, align: "center"},
                    {name : 'sourceDocumentProductStyle.weightUnit',width : 80, align: "center"},
                    {name : 'testWay',index : 'testWay',width : 80, align: "center", formatter: function (value, grid, rows, state) {
                        return testDocumentVm.formatterTestWay(value);
                    }},
                    {name : 'qualifiedAmount',width : 80,align : "center"},
                    {name : 'unqualifiedAmount',width : 80,align : "center"},
                    {name : 'qualifiedPercent',width : 80,align : "center"},
                    {name : 'testStatus',width : 80,align : "center",formatter: function (value, grid, rows, state) {
                        return testDocumentVm.formatterTestStatus(value);
                    }}
                ],
                pager: false,
                autoHeight:true,
                onSelectRow: function (index, status) {
                    This.resultSelectedIndex = (index === "" || index ==="null") ? 1 : index;
                },
                beforeSelectRow(){
                    $("#styleResult_table").jqGrid('resetSelection');
                },
                gridComplete(){
                    var myGrid = $("#styleResult_table");
                    $("#cb_"+myGrid[0].id).hide();
                    //$("#styleResult_table").jqGrid("setSelection",1, true);
                }
            });
            let length = This.styleResultArray.length;
            for(let i=0;i<length;i++){
                $("#styleResult_table").jqGrid('addRowData',i+1,This.styleResultArray[i]);
            }
        },
        reInitStyleResult(){
            let This = this;
            var parent = $("#jqGrid_wrapper")
            parent.empty();
            let tableId="styleResult_table";
            $(`<table id=${tableId}></table>`).appendTo(parent);
            this.initStyleResult();
        },
        fetchTestWay(){
            let _this = this;
            _this.testWays = getCodeList('zj_zjfs');
        },
        fetchTestStatus(){
            let _this = this;
            _this.testStatusArr = getCodeList('zj_zhijianzhuangtai');
        },
        getSourceType(){
            let This = this;
            $.ajax({
                type: "POST",
                url:contextPath+"/testDocument/querySourceType",
                dataType:"json",
                data:{},
                success:function (data) {
                    This.sourceTypeArr=[];
                    if(data.code === '100100')
                    {
                        for(let result of data.data){
                            This.sourceTypeArr.push({name:result.name,value:result.value});
                        }
                    }
                }
            })
        },
        fetchTestResult(){
            let _this = this;
            _this.testResultArr = getCodeList('zj_jyjg');
        },
        formatterTestWay(value){
            if(!value){
                return '';
            }else if(this.testWays.length < 1){
                return '';
            }
            return this.testWays[this.testWays.map(function(e) { return e.value; }).indexOf(value)]
                ? this.testWays[this.testWays.map(function(e) { return e.value; }).indexOf(value)].name
                : value;
        },
        formatterTestStatus(value){
            if(!value){
                return '';
            }else if(this.testStatusArr.length < 1){
                return '';
            }
            return this.testStatusArr[this.testStatusArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.testStatusArr[this.testStatusArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;
        },
        //加载质检员下拉框
        loadTestEmp(deptId){
            if(!deptId){
                return false;
            }
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/getEmployeesByDeptId",
                dataType: "json",
                data:{deptId:deptId},
                success: function(res) {
                    _this.testEmps=[];
                    // _this.imcoming.tQcTestDocumentEntity.inspectorId='';
                    if(res.code === '100100' && res.data.length > 0){
                        for(let emp of res.data){
                            _this.testEmps.push({label:emp.empName,value:emp.id,code:emp.empCode});
                        }
                    }
                },
                error: function(err){
                },
            });
        },
        createReport(){
            let This = this;
            let status = This.documentStatus;
            console.log(status)
            if(status == 'auditing')
            {
                let sourceDocumentCode = This.imcoming.tQcTestDocumentEntity.documentCode;
                let testDocumentId = This.imcoming.tQcTestDocumentEntity.id
                if(testDocumentId==null||testDocumentId==undefined)
                {
                    testDocumentId = This.testDocumentId
                }
                window.parent.activeEvent({name: '生成报告单', url: contextPath+'/quality/quality/inspection-report.html', params: {"testDocumentId":testDocumentId,"code":sourceDocumentCode}});
            }
            else
            {
                this.$Modal.info({
                    content: '检验单未审核，请审核!',
                    title: '警告'
                })
            }
        },
        //加载不良原因
        loadBadResons(){
            let _this =this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/queryBaseDataList",
                data:JSON.stringify({"datatypeId":5}),
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    _this.badResons=[];
                    if(res.code === '100100' && res.data.length >0){
                        for(let reason of res.data){
                            _this.badResons.push({name:reason.name,value:reason.id});
                        }
                    }
                },
                error: function (err) {

                },
            });
        },
        //新增
        addNew(){
            this.sourceCodeDisabled = false;
            this.sendTestDisabled = false;
            this.generateDisabled = false;
            this.examineVerifyName = '';
                this.examineVerifyTime = '';
                this.documentStatus = '';
                //清空进销存单号
                this.upstreamSourceCode = '';
                this.imcoming = {
                    tQcTestDocumentEntity:{
                        id:'',
                        sourceDocumentType: '',
                        sourceDocumentCode: '',
                        // upstreamSourceCode: '',
                        sourceDepartmentName: '',
                        informerName:'',
                        sendTestName: '',
                        sendTestId: '',
                        sendTestTime: '',
                        testTotalAmount: '',
                        qualifiedPercent: '',
                        documentCode: '',
                        documentType: '',
                        businessType: '',
                        documentTime: '',
                        documentStatus: '',
                        qualifiedTotalAmount: '',
                        testResult: '',
                        testOrganizationId:'',
                        testOrganizationName: '',
                        testDepartmentName: '',
                        inspectorId: '',
                        inspectorName:'',
                        testFinishTime : '',
                        unqualifiedTotalAmount: '',
                        totalTestConclusion: '',
                        supplierOrCustomerCode:'',
                        createName:'',
                        createTime:'',
                        updateName:'',
                        updateTime:'',
                        sysFile : {
                            fileId: '',
                            fileType: 6,
                            fileDetails: []
                        },
                    },
                    styleInput:{
                        productStyleId:'',
                        productTypeId:'',
                        testWay: '',
                        qualifiedAmount: '',
                        testAmount: '',
                        qualifiedPercent: '',
                        unqualifiedAmount: '',
                        testResult: '',
                        resultDescribeSuggest: '',
                        sourceDocumentProductStyle: {
                            productCode: '',
                            productName: ''
                        },
                        styleTestItems:[]
                    }
                };
            this.styleResultArray = [];
            this.reInitStyleResult();
            this.$forceUpdate();
            this.reload=!this.reload;
            $("#approvalList").jqGrid('clearGridData');
            $("#approvalList").jqGrid('setGridParam',{postData:{receiptsId:''}}).trigger("reloadGrid")
        },
        genSpecialRelease(){
            let This = this;
            let specialFlag = [];
            let status = This.documentStatus;

            if(status == 'auditing')
            {
                //取出每个商品的检验结果
                This.styleResultArray.forEach((item) => {
                    if(item.testResult === 'jyjgbhg'){
                        specialFlag.push(item.testResult);
                    }
                })
                if(specialFlag == 0){
                    // layer.alert('没有不合格的商品编码数据，无需生成特别放行单');
                    this.$Modal.info({
                        content: '没有不合格的商品编码数据，无需生成特别放行单！',
                        title: '提示'
                    })
                    return false;
                }

                //判断是否需要反写不合格数
                $.ajax({
                    type: "POST",
                    url: contextPath+"/testDocument/isSpecialOrComfirm",
                    data: {testDocumentId:This.imcoming.tQcTestDocumentEntity.id,type:'spercial' },
                    dataType: "json",
                    success: function (res) {
                        if(res.data === 'specialAcross'){
                            let sourceDocumentCode = This.imcoming.tQcTestDocumentEntity.sourceDocumentCode;
                            window.parent.activeEvent({name: '生成特别放行单',
                                url: contextPath+'/quality/quality/specialReleaseDocumentInfo.html?type=1&code=' + sourceDocumentCode});
                        }else {
                            this.$Modal.info({
                                content: res.data,
                                title: '警告'
                            })
                        }
                    },
                    error: function (err) {
                        this.$Modal.info({
                            content: res.data,
                            title: '警告'
                        })
                    },
                });
            }
            else
            {
                // layer.alert("检验单未审核，请审核!");
                this.$Modal.info({
                    content: '检验单未审核，请审核!',
                    title: '警告'
                })
            }
        },
        confirmResult(){
            let This = this;
            let status = This.documentStatus;
            if(status == 'auditing')
            {
                //判断是否需要反写不合格数
                $.ajax({
                    type: "POST",
                    url: contextPath+"/testDocument/isSpecialOrComfirm",
                    data: {testDocumentId:This.imcoming.tQcTestDocumentEntity.id,type:'comfirm' },
                    dataType: "json",
                    success: function (res) {
                        if(res.data === 'comfirmAcross'){
                            // layer.alert('已确认检验结果');
                            This.$Modal.success({
                                content: '已确认检验结果',
                                title: '警告'
                            })
                        }else {
                            // layer.alert(res.data);
                            This.$Modal.info({
                                content: res.data,
                                title: '警告'
                            })
                        }
                    },
                    error: function (err) {
                        // layer.alert(res.data);
                        This.$Modal.info({
                            content: res.data,
                            title: '警告'
                        })
                    },
                });
            }
            else
            {
                // layer.alert("检验单未审核，请审核!");
                This.$Modal.info({
                    content: "检验单未审核，请审核!",
                    title: '警告'
                })

            }
        },
        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        handlerClose(){
            if((!this.documentStatus || this.documentStatus == "temporary_save") && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save('save');
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        },
        exit(close){
            // window.parent.closeCurrentTab({openTime:this.openTime, exit: true});
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        returnSource()
        {
            let This = this;
            let documentType
            console.log(This.imcoming.tQcTestDocumentEntity.documentTypeName);
            if(This.imcoming.tQcTestDocumentEntity.documentTypeName == "来料检验单")
            {
                documentType = "lljyd";
                window.parent.activeEvent({name: '来料检验单', url: contextPath+`/quality/test-document/test-document-list-lljyd.html?documentType=${documentType}`});
            }
            else if(This.imcoming.tQcTestDocumentEntity.documentTypeName == "调拨检验单")
            {
                documentType = "tbjyd";
                window.parent.activeEvent({name: '调拨检验单', url: contextPath+`/quality/test-document/test-document-list-dbjyd.html?documentType=${documentType}`});
            }
            else
            {
                documentType = "fhjyd";
                window.parent.activeEvent({name: '发货检验单', url: contextPath+`/quality/test-document/test-document-list-fhjyd.html?documentType=${documentType}`});
            }
        },

    },

    watch:{
        "documentCode"(){
            let documentCode = this.documentCode;
            if(documentCode){
                $("#approvalList").jqGrid('clearGridData');
                $("#approvalList").jqGrid('setGridParam',{postData:{receiptsId:documentCode}}).trigger("reloadGrid");
            }
        },
        "documentStatus"(){
            if(this.documentStatus === 'auditing'){
                this.isStampShow=true;
                this.$forceUpdate();
            }else {
                this.isStampShow=false;
                this.$forceUpdate();
            }
        },
        "reload"(){
            let documentCode = this.documentCode;
            if(documentCode){
                $("#approvalList").jqGrid('clearGridData');
                $("#approvalList").jqGrid('setGridParam',{postData:{receiptsId:documentCode}}).trigger("reloadGrid");
            }
        },
        "imcoming.styleInput.testWay"(newValue, oldValue){
            console.log(this.imcoming.styleInput.testWay, oldValue, newValue)
            if(oldValue){
                if(oldValue === 'qj'){
                    this.testWayChangeRecordQj = JSON.parse(JSON.stringify(this.imcoming.styleInput));
                }
                else if(oldValue === 'cj'){
                    this.testWayChangeRecordCj = JSON.parse(JSON.stringify(this.imcoming.styleInput));
                }
                else if(oldValue === 'mj'){
                    this.testWayChangeRecordMj = JSON.parse(JSON.stringify(this.imcoming.styleInput));
                }
            }else {
                this.testWayChangeRecordQj = JSON.parse(JSON.stringify(this.imcoming.styleInput));
                this.testWayChangeRecordCj = JSON.parse(JSON.stringify(this.imcoming.styleInput));
                this.testWayChangeRecordMj = JSON.parse(JSON.stringify(this.imcoming.styleInput));
            }
        }
    },

    filters:{
        formatPercent(val){
            return val ? (Math.round(val * 10000)/100).toFixed(2) + '%' : '';
        }
    },
    created(){
        this.parentParams = window.parent.params.params;
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        this.initStyleResult();
        // this.parentParams = window.parent.params.params;
        console.log('parentParams：',this.parentParams);
        // $('form').validate();
        let user = layui.data('user')
        console.log("user: ",user)
        this.openTime = window.parent.params.openTime;
        this.fetchOrg();
        this.getSendTestPeople();
        this.fetchTestWay();
        this.fetchTestStatus();
        this.fetchTestResult();
        // $('form').validate();
        this.getSourceType();
        this.loadBadResons();
        if(!$.isEmptyObject(this.parentParams)){
            if(!$.isEmptyObject(this.parentParams.type)) {
                console.log('走修改');
                this.loadUpdate(this.parentParams.code,this.parentParams.type);
            } else {
                console.log('走新增');
                if(this.parentParams.ger == 'all' ){
                    this.loadData(this.parentParams.rowData.documentCode,this.parentParams.rowData.productTypeId);
                }
            }
        }
    }
});