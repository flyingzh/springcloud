var correctiveVm = new Vue({
    el: '#corrective',
    data() {
        return {
            param:{},
            canRejectWhenAudit:true,
            modalTrigger: false,
            modalType:'',
            uploadShow : true,
            statusMap:{
                tmp_save: "temporary_save", await_check: "await_check", checking: "checking", auditing: "auditing", reject: "reject"
            },
            approvalTableData:[],
            //按钮是否禁用
            btnShow:false,
            showUpload:false,
            openTime: '',
            id:'',
            //初始化时的自动编码
            initDocCode: '',
            needReload :false,
            //审核图标
            isStampShow:false,
            /*//启用多级审核时单据上的操作——审核
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
            },*/
            showDepartment: true,
            showReceiveDepartment: '',
            showSourceModal: false,
            //控制问题发布是否禁用
            releaseDisable:false,
            //控制问题分析是否禁用
            analyseDisable:true,
            //控制纠正预防是否禁用
            correctiveDisable:true,
            //控制验证结果是否禁用
            validateDisable:true,
            //控制选择部门弹窗
            showDepartmentModal: false,
            department_selected: [],         
            documentStatusList:[],
            businessFlowDirectionList:[],
            DocumentTypeList:[],
            problemSourceList:[],
            resultList:[],
            conclusionList:[],
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            receiveTreeSetting:{
                callback: {
                    onClick: this.receiveClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            analyseTreeSetting:{
                callback: {
                    onClick: this.analyseClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            dutyTreeSetting:{
                callback: {
                    onClick: this.dutyClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            validateTreeSetting:{
                callback: {
                    onClick: this.validateClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            //单据信息绑定
            corrective:{
                id:'',
                documentCode:'',
                businessFlowDirection:'',
                documentDate:(new Date()).format("yyyy-MM-dd") || '',
                documentStatus:'',
            },
            //问题发布绑定
            release:{
                id:'',
                sourceDocumentType:'',
                sourceDocumentId:'',
                sourceDocumentCode:'',
                issueDate:(new Date()).format("yyyy-MM-dd") || '',
                issueDepartmentId:'',
                issueDepartmentName:'',
                issuePerson:'',
                issuePersonId:'',
                issuePersonName:'',
                receiveDepartmentId:'',
                receiveDepartmentName:'',
                demandReplyDate:'',
                problemSourceId:[],
                problemSourceName:[],
                problemDescribe:'',
                analyseDepartmentId:'',
                analyseDepartmentName:'',
                analysePersonnel:'',
                analysePersonnelId:'',
                analysePersonnelName:'',
               },
            //问题分析绑定
            analyse:{
                analyseDate:(new Date()).format("yyyy-MM-dd") || '',
                dutyDepartmentId:'',
                dutyDepartmentName:'',
                dutyPersonnel :'',
                dutyPersonnelId :'',
                dutyPersonnelName:'',
                reasonAnalyse:'',
                id:'',
            },
            //纠正预防绑定
            prevent:{
                correctPreventDate:(new Date()).format("yyyy-MM-dd") || '',
                correctAction:'',
                preventAction:'',
                validateDepartmentId:'',
                validateDepartmentName:'',
                validatePersonnelId:'',
                validatePersonnelName:'',
                id:'',
            },
            //验证结果数据绑定
            validation:{
                validateDate:(new Date()).format("yyyy-MM-dd") || '',
                validateResultDescribe:'',
                validateResult:'',
                followConclusion:'',
                id:'',
            },
            //其他
            other:{
                createName:'',
                createTime :'',
                updateName:'',
                updateTime:'',
                examineVerifyName:'',
                examineVerifyDate:'',
            },
            // 问题发布必填校验项
            releaseValidate:{
                sourceDocumentType:[{required:true}],//源单类型
                sourceDocumentCode:[{required:true}],//源单单号
                issueDate:[{required:true}],//发出日期
                issueDepartmentName:[{required:true}],//发出部门
                issuePersonId:[{required:true}],//发出人
                receiveDepartmentName:[{required:true}],//接收部门
                demandReplyDate:[{required:true}],//要求回复时间
                problemDescribe:[{required:true}],//问题描述
                analyseDepartmentName:[{required:true}],//分析部门
                analysePersonnelId:[{required:true}]//分析人员
            },
            // 问题分析必填校验项
            analyseValidate:{
                dutyDepartmentName:[{required:true}],//责任部门
                dutyPersonnelId:[{required:true}],//责任人
                reasonAnalyse:[{required:true}]//原因分析
            },
            // 纠正预防必填校验项
            preventValidate:{
                correctAction:[{required:true}],//纠正措施
                preventAction:[{required:true}],//预防措施
                validateDepartmentName:[{required:true}],//验证部门
                validatePersonnelId:[{required:true}]//验证员
            },
            // 问题验证必填校验项
            validationValidate:{
                validateDate:[{required:true}]//验证日期
            },
            //员工
            empList: [],
            //页面传参
            receiptsId:'',
            //控制审批流程节点
            currentSteps:3,
            /*data_config_approval:{
                url: '',
                colNames : [ '操作类型', '开始级次','目的级次','审批人','审批意见','审批时间'],
                colModel : [
                    {name : 'approvalResult',index : 'lotSize',width : 200, align : "left",
                            formatter: function (value, grid, rows, state) {
                                return value == 1 ? "审核": "驳回";
                            }},
                    {name : 'currentLevel',index : 'samplingRatio',width : 200, align : "left",
                            formatter: function (value, grid, rows, state) {
                                return value === 0 ? "开始" :value === 1 ? "一级审核": value === 2 ?
                                    "二级审核":value === 3 ? "三级审核":value === 4 ?
                                        "四级审核":value === 5 ? "五级审核":value === 6 ?
                                            "六级审核":"结束";
                            }},
                    {name : 'nextLevel',index : 'acceptance',width : 200, align : "left",
                        formatter: function (value, grid, rows, state) {
                            if(rows.approvalResult === -1 || (rows.approvalResult === 0 && !rows.nextLevel)){
                                return "开始";
                            }
                            return value === "0" ? "开始" : value === "1" ? "一级审核": value === "2" ?
                                "二级审核":value === "3" ? "三级审核":value === "4" ?
                                    "四级审核":value === "5" ? "五级审核":value === "6" ?
                                        "六级审核":"结束";
                        }},
                    {name : 'createName',index : 'rejected asc, invdate',width : 200, align : "left"},
                    {name : 'approvalInfo',index : 'rejected asc, invdate',width : 220, align : "left"},
                    {name : 'createTime',index : 'rejected asc, invdate',width : 250, align : "left"}
                ] ,
                jsonReader:{
                    root:"data"
                },
                multiselect: false
            },*/
            //审批进度条
            stepList: [],
            /*stepData: [
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
            nextStep: '',*/
            //文件列表
            files:{
                sysFile:{
                    fileDetails:[]
                }
                },
        }

    },
    created (){
        //    请求数据字典数据（单据状态）
        this.initDocumentStatus();

        //    请求数据字典数据（业务流向）
        this.initBusinessFlowDirection();

        //请求数据字典数据（源单类型）
        this.initDocumentType();

        //    请求数据字典数据（问题来源）
        $.ajax({
            type:"post",
            url:contextPath+'/baseDataController/listBean?datatypeId=8',
            dataType:"json",
            success:function(data){
                correctiveVm.problemSourceList = data.data;
            },
            error:function(){
                alert('服务器出错啦');
            }
        });
        //    请求数据字典数据（验证结果）
        this.initResult();

        //    请求数据字典数据（验证结论）
        this.initconclusionList();

        //请求人员信息
        $.ajax({
            type:"post",
            url:contextPath+'/tQcCorrectPreventDocument/queryallempbyorganid',
            dataType:"json",
            success:function(data){
                correctiveVm.empList = data.data;
            },
            error:function(){
                correctiveVm.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错啦！'
                });
                // alert('服务器出错啦');
            }
        });

    },
    methods: {
        approval(){
            let This = this;
            if(This.corrective.documentStatus == 'temporary_save' || !This.corrective.documentCode){
                This.$Modal.info({
                    title: "提示信息",
                    content: "请先提交纠正预防单!"
                });
                return false;
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(){
            let This = this;
            if(This.corrective.documentStatus == 'temporary_save' || !This.corrective.documentCode){
                This.$Modal.info({
                    title: "提示信息",
                    content: "请先提交纠正预防单!"
                });
                // layer.alert("请先提交纠正预防单！")
                return false;
            }
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;

        },
        approvalOrRejectCallBack(res){
            let This = this;
            if(res.result.code == '100100'){
                This.corrective.documentStatus = res.result.data;
                if(This.corrective.documentStatus == 'auditing'){
                    This.isStampShow = true;
                    This.queryById(This.corrective.id);
                }else {
                    This.isStampShow = false;
                    This.other.examineVerifyName = '';
                    This.other.examineVerifyDate = '';
                    if(This.corrective.documentStatus == 'temporary_save'){
                        This.validateDisable = false;
                    }
                }
            }
        },
        autoSubmitOrReject(result){
            let This = this;
            $.ajax({
                url:contextPath + '/tQcCorrectPreventDocument/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.corrective.documentCode,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        This.corrective.documentStatus = res.data;
                    }else {
                        This.$Modal.info({content:res.msg});
                    }
                }
            });
        },
        //上传点击确定
        modalOk(){},
        handleSuccess (res, file) {
            let This = this;
            if (res.code == '100100') {
                This.addAttachment(res.data);
            } else {
                This.$Modal.info({
                    title: '提示信息',
                    content: '上传失败！'
                });
                // layer.alert("上传失败");
            }
        },
        addAttachment: function (res) {
            let This = this;
            let attachment = {
                fdName: res.fdName,
                fdSize: parseFloat(res.fdSize).toFixed(2) + "kb",
                uploadTime: res.uploadTime,
                uploadUser: res.uploadUser,
                fdUrl: res.fdUrl,
                fdType: 4,
                del: false
            };
            This.files.sysFile.fileDetails.push(attachment);
        },
        handleMaxSize (file) {
            this.$Notice.warning({
                title: '文件大小超出限制!',
                desc: '【'+file.name + '】的大小超过2M'
            });
        },
        //删除附件
        delFile(item){
            this.$Modal.confirm({
                 content: '是否要删除这条信息！',
                 onOk:()=>{
                     item.del = true;
                 }
                }
                /* function () {
                    //这里先根据数据有没有id 来判断是原有的还是新增的
                    item.del = true;
                    layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                }*/
            );
        },
        //下载附件
        download(item){
            if(!item.fdUrl){
                // layer.alert("文件地址为空!请先上传文件!");
                this.$Modal.info({
                    title: '提示信息',
                    content: '文件地址为空!请先上传文件!'
                });
                return false;
            }
            let paramsArray =[];
            Object.keys(item).forEach(key => paramsArray.push(key + '=' + item[key]));
            let url=contextPath+'/tQcCorrectPreventDocument/download?'+ paramsArray.join('&');
            location.href=encodeURI(url);
        },
        //上传附件
        uploadfile(){
            this.showUpload = true;
        },
        //初始化单据状态
        initDocumentStatus(){
            this.documentStatusList = getCodeList("zj_document_status");
            this.corrective.documentStatus = "temporary_save";
        },
        //初始化业务流向
        initBusinessFlowDirection(){
            this.businessFlowDirectionList = getCodeList("zj_jzyfddjzt");
            this.corrective.businessFlowDirection = "wtfb";
        },
        //初始化源单类型
        initDocumentType(){
            this.DocumentTypeList = getCodeList("zj_jzyfdydlx");
        },
        //初始化验证结果
        initResult(){
            this.resultList = getCodeList("zj_jzyfdyzjg");
            this.validation.validateResult = "yx";
        },
        //初始化跟踪结论
        initconclusionList(){
            this.conclusionList = getCodeList("zj_jzyfdgzjl");
            this.validation.followConclusion = "jzhg";
        },
        treeClickCallBack(event, treeId, treeNode){
            this.release.issueDepartmentName = treeNode.name;
            this.release.issueDepartmentId = treeNode.id;
            this.showDepartment = false;
            this.htTestChange();
        },
        receiveClickCallBack(event, treeId, treeNode){
            this.release.receiveDepartmentName = treeNode.name;
            this.release.receiveDepartmentId = treeNode.id;
            this.showDepartment = false;
            this.htTestChange();
        },
        analyseClickCallBack(event, treeId, treeNode){
            this.release.analyseDepartmentName = treeNode.name;
            this.release.analyseDepartmentId = treeNode.id;
            this.showDepartment = false;
            this.htTestChange();
        },
        dutyClickCallBack(event, treeId, treeNode){
            this.analyse.dutyDepartmentName = treeNode.name;
            this.analyse.dutyDepartmentId = treeNode.id;
            this.showDepartment = false;
            this.htTestChange();
        },
        validateClickCallBack(event, treeId, treeNode){
            this.prevent.validateDepartmentName = treeNode.name;
            this.prevent.validateDepartmentId = treeNode.id;
            this.showDepartment = false;
            this.htTestChange();
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent; //当单击父节点，返回false，不让选取
        },
        showDepartmentTree(name,status){
            console.log(name,status);
            if(status === true){
                return;
            }
            if(this.showDepartment === name){
                this.showDepartment = ''
                return;
            }
            this.showDepartment = name;
        },
        //点击保存
        save(){
            let This = this;
            let obj = null;
            for(var i = 0 ; i < This.empList.length; i++){
                if(This.empList[i].id == This.release.issuePersonId){
                    This.release.issuePersonName = This.empList[i].empName;
                }
                if(This.empList[i].id == This.release.analysePersonnelId){
                    This.release.analysePersonnelName = This.empList[i].empName;
                }
                if(This.empList[i].id == This.analyse.dutyPersonnelId){
                    This.analyse.dutyPersonnelName = This.empList[i].empName;
                }
                if(This.empList[i].id == This.prevent.validatePersonnelId){
                    This.prevent.validatePersonnelName = This.empList[i].empName;
                }
            }
            if(This.corrective.businessFlowDirection === 'wtfb'){
                 obj = Object.assign(this.release,this.corrective);
            }
            if(This.corrective.businessFlowDirection === 'wtfx'){
                 obj = Object.assign(this.analyse,this.corrective);
            }
            if(This.corrective.businessFlowDirection === 'wtfb'){
                 obj = Object.assign(this.release,this.corrective);
            }
            if(This.corrective.businessFlowDirection === 'jzyf'){
                 obj = Object.assign(this.prevent,this.corrective);
            }
            if(This.corrective.businessFlowDirection === 'csyz'){
                 obj = Object.assign(this.validation,this.corrective);
            }
            if(This.files.sysFile.fileDetails.length > 0){
                // obj = Object.assign(this.files,this.corrective);
                this.corrective['sysFile'] = this.files.sysFile
                obj = this.corrective;
            }
            if(This.corrective.businessFlowDirection === 'yzwc'){
                This.$Modal.success({
                    title: '提示信息',
                    content: '以保存！'
                });
                // layer.alert("保存成功");
                return;
            }
                if(This.corrective.id === ''){
                    obj.documentCode = This.initDocCode;
                    $.ajax({
                        type:"post",
                        url:contextPath+'/tQcCorrectPreventDocument/saveCorrectPrevent',
                        dataType:"json",
                        async: false,
                        data:JSON.stringify(obj),
                        contentType: 'application/json;charset=utf-8',
                        success:function(data){
                            This.htHaveChange = false;
                            This.$Modal.success({
                                title: '提示信息',
                                content: '保存成功！'
                            });
                            // layer.alert("保存成功！");
                            This.other = data.data;
                            if(data.data.sysFile && data.data.sysFile.fileDetails
                                && data.data.sysFile.fileDetails.length > 0 ){
                                obj = data.data;
                            }else{
                                obj = Object.assign({
                                    sysFile:{
                                        fileDetails:[]
                                    }
                                },data.data)
                            }
                            if(data.data.businessFlowDirection == 'wtfb'){
                                This.other.createTime = new Date(data.data.documentDate).format("yyyy-MM-dd")
                            }
                            This.corrective.id = data.data.id;
                            This.corrective.documentCode = data.data.documentCode;
                        },
                        error:function(){
                            This.$Modal.info({
                                title: '提示信息',
                                content: '服务器出错，请稍后再试！'
                            });
                            // alert('服务器出错啦');
                        }
                    });
                }else {
                    $.ajax({
                        type:"post",
                        url:contextPath+'/tQcCorrectPreventDocument/update',
                        dataType:"json",
                        data:JSON.stringify(obj),
                        contentType: 'application/json;charset=utf-8',
                        success:function(data){
                            This.$Modal.success({
                                title: '提示信息',
                                content: '保存成功！'
                            });
                            // layer.alert("保存成功！");
                            correctiveVm.corrective.documentCode = data.data.documentCode;
                            correctiveVm.other = data.data;
                            },
                        error:function(){
                            This.$Modal.info({
                                title: '提示信息',
                                content: '服务器出错，请稍后再试！！'
                            });
                            // alert('服务器出错啦');
                        }
                    });
                }
        },
        update(id,status){
            let This = this;
            $.ajax({
                type:"post",
                url:contextPath+'/tQcCorrectPreventDocument/update',
                dataType:"json",
                data:JSON.stringify({id:id,documentStatus:status}),
                contentType: 'application/json;charset=utf-8',
                success:function(data){
                    This.queryById(id);
                   /* This.reGetApprovalMessage();
                    This.initApproval();*/
                },
                error:function(){
                    This.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试！！'
                    });
                    // layer.alert('服务器出错啦');
                }
            });
        },
        // 点击退出(退出页面)
        exit(close){
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose() {
            if ((!this.release.orderStatus || this.release.orderStatus == 1) && (this.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save();
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(3333)
        },
        add(){
            window.parent.activeEvent({name: '新增纠正预防单', url: contextPath+'/quality/quality/corrective-prevention-sheet--1.html',params:{type:'add'}});
        },
        submit(){
            let This = this;
            if(This.corrective.businessFlowDirection != "yzwc"){
                This.$Modal.info({
                    title: '提示信息',
                    content: '只有业务流向为验证完成才能提交！'
                });
                // layer.alert("只有业务流向为验证完成才能提交！")
                return;
            }else if(This.corrective.documentStatus != 'temporary_save'){
                This.$Modal.info({
                    title: '提示信息',
                    content: '单据状态不为暂存或是不为驳回到原点不能提交！'
                });
                // layer.alert("单据状态不为暂存或是不为驳回到原点不能提交！");
                return;
            }else {
                This.corrective.documentStatus = "await_check";
                var obj = Object.assign(This.other,This.files,This.validation,This.corrective);
                $.ajax({
                    type:"post",
                    url:contextPath+'/tQcCorrectPreventDocument/update',
                    dataType:"json",
                    data:JSON.stringify(obj),
                    contentType: 'application/json;charset=utf-8',
                    success:function(data){
                        This.htHaveChange = false;
                        This.$Modal.success({
                            title: '提示信息',
                            content: '提交成功！'
                        });
                        // layer.alert("提交成功！");
                        This.receiptsId = data.data.documentCode;
                        This.uploadShow = false;
                        This.validation = data.data;
                        if(data.data.validateDate != null && data.data.validateDate != ''){
                            This.validation.validateDate = new Date(data.data.validateDate).format("yyyy-MM-dd");
                        }
                        This.corrective.documentStatus = "await_check";
                        This.id = data.data.id;
                        This.validateDisable = true;
                        // This.initApproval(data.data.documentCode);
                    },
                    error:function(){
                        This.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！！'
                        });
                        // layer.alert('服务器出错啦');
                    }
                });
            }
        },
        showlist(){
            window.parent.activeEvent({name: '纠正预防单', url: contextPath+'/quality/quality/correctPreventDocument.html'})
        },
        addattachment(){


        },
        //问题发布
        issueRelease(){
            let isReleasePass;
            this.$refs['release'].validate((valid)=>{
                if(valid){
                    isReleasePass = true;
                } else {
                    isReleasePass = false;
                }
            })
            if(isReleasePass){
                if(correctiveVm.corrective.businessFlowDirection != "wtfb"){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '业务流向不为问题发布！'
                    });
                    // layer.alert("业务流向不为问题发布");
                    return;
                }else {
                    for(var i = 0 ; i < correctiveVm.empList.length; i++){
                        if(correctiveVm.empList[i].id == correctiveVm.release.issuePersonId){
                            correctiveVm.release.issuePersonName = correctiveVm.empList[i].empName;
                        }
                        if(correctiveVm.empList[i].id == correctiveVm.release.analysePersonnelId){
                            correctiveVm.release.analysePersonnelName = correctiveVm.empList[i].empName;
                        }
                    }
                    if(correctiveVm.corrective.documentCode === ''){
                        correctiveVm.corrective.documentCode = correctiveVm.initDocCode;
                    }
                    correctiveVm.corrective.businessFlowDirection = "wtfx"
                    var obj = Object.assign(correctiveVm.other,correctiveVm.files,correctiveVm.release,correctiveVm.corrective);
                    if (correctiveVm.corrective.id === '') {
                        $.ajax({
                            type:"post",
                            url:contextPath+'/tQcCorrectPreventDocument/saveCorrectPrevent',
                            dataType:"json",
                            data:JSON.stringify(obj),
                            contentType: 'application/json;charset=utf-8',
                            success:function(data){
                                correctiveVm.$Modal.success({
                                    title: '提示信息',
                                    content: '问题发布成功！'
                                });
                                // layer.alert("问题发布成功！");
                                correctiveVm.corrective.documentCode = data.data.documentCode;
                                correctiveVm.corrective.id = data.data.id;
                                correctiveVm.other = data.data;
                                correctiveVm.corrective.documentDate = new Date(data.data.documentDate).format("yyyy-MM-dd");
                                correctiveVm.other.createTime = correctiveVm.corrective.documentDate;
                                correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                                correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                                correctiveVm.releaseDisable = true;
                                correctiveVm.analyseDisable = false;
                            },
                            error:function(){
                                correctiveVm.$Modal.info({
                                    title: '提示信息',
                                    content: '服务器出错，请稍后再试！！'
                                });
                                // layer.alert('服务器出错啦');
                            }
                        });
                    } else {
                        $.ajax({
                            type: "post",
                            url: contextPath+'/tQcCorrectPreventDocument/update',
                            dataType: "json",
                            data: JSON.stringify(obj),
                            contentType: 'application/json;charset=utf-8',
                            success: function (data) {
                                correctiveVm.$Modal.success({
                                    title: '提示信息',
                                    content: '问题发布成功！'
                                });
                                // layer.alert("问题发布成功！");
                                correctiveVm.release = data.data;
                                correctiveVm.other = data.data;
                                correctiveVm.corrective.businessFlowDirection = "wtfx";
                                correctiveVm.corrective.id = data.data.id;
                                correctiveVm.corrective.documentCode = data.data.documentCode;
                                correctiveVm.corrective.documentDate = new Date(data.data.documentDate).format("yyyy-MM-dd");
                                correctiveVm.other.createTime = new Date(data.data.createTime).format("yyyy-MM-dd");
                                if(data.data.updateTime != null || data.data.updateTime != ''){
                                    correctiveVm.other.updateTime = new Date(data.data.updateTime).format("yyyy-MM-dd");
                                }
                                correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                                correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                                correctiveVm.releaseDisable = true;
                                correctiveVm.analyseDisable = false;
                            },
                            error: function () {
                                correctiveVm.$Modal.info({
                                    title: '提示信息',
                                    content: '服务器出错，请稍后再试！'
                                });
                                // layer.alert('服务器出错，请稍后再试');
                            }
                        });
                    }
                }
            }else {
                correctiveVm.$Modal.info({
                    title: '提示信息',
                    content:'请输入必填项！'
                });
            }
        },
        //问题分析
        issueAnalysis(){
            let isAnalysePass;
            this.$refs['analyse'].validate((valid)=>{
                if(valid){
                    isAnalysePass = true;
                } else {
                    isAnalysePass = false;
                }
            })
            if(isAnalysePass){
                if(correctiveVm.corrective.businessFlowDirection != "wtfx"){
                    correctiveVm.$Modal.info({
                        title: '提示信息',
                        content: '业务流向不为问题分析！'
                    });
                    // layer.alert("业务流向不为问题分析！");
                    return;
                }else {
                    for(var i = 0 ; i < correctiveVm.empList.length; i++){
                        if(correctiveVm.empList[i].id == correctiveVm.analyse.dutyPersonnelId){
                            correctiveVm.analyse.dutyPersonnelName = correctiveVm.empList[i].empName;
                        }
                    }
                    correctiveVm.corrective.businessFlowDirection = "jzyf";
                    var obj = Object.assign(this.other,this.files,this.analyse,this.corrective);
                    $.ajax({
                        type:"post",
                        url:contextPath+'/tQcCorrectPreventDocument/update',
                        dataType:"json",
                        data:JSON.stringify(obj),
                        contentType: 'application/json;charset=utf-8',
                        success:function(data){
                            correctiveVm.$Modal.success({
                                title: '提示信息',
                                content: '问题分析成功！'
                            });
                            // layer.alert("问题分析成功！");
                            this.analyse = data.data;
                            correctiveVm.corrective.id = data.data.id;
                            correctiveVm.other = data.data;
                            correctiveVm.corrective.documentDate = new Date(data.data.documentDate).format("yyyy-MM-dd");
                            correctiveVm.other.createTime = new Date(data.data.createTime).format("yyyy-MM-dd");
                            correctiveVm.other.updateTime = new Date(data.data.updateTime).format("yyyy-MM-dd");
                            correctiveVm.corrective.businessFlowDirection = "jzyf";
                            correctiveVm.analyseDisable = true;
                            correctiveVm.correctiveDisable = false;
                        },
                        error:function(){
                            correctiveVm.$Modal.info({
                                title: '提示信息',
                                content: '服务器出错，请稍后再试！'
                            });
                            // layer.alert('服务器出错，请稍后再试');
                        }
                    });
                }
            }else {
                correctiveVm.$Modal.info({
                    title: '提示信息',
                    content:'请输入必填项！'
                });
            }
        },
        //纠正预防
        issuePrevent(){
            let isPreventPass;
            this.$refs['prevent'].validate((valid)=>{
                if(valid){
                    isPreventPass = true;
                } else {
                    isPreventPass = false;
                }
            })
            if(isPreventPass){
                if(correctiveVm.corrective.businessFlowDirection != "jzyf"){
                    this.$Modal.info({
                        title: '提示信息',
                        content:'业务流向不为纠正预防！'
                    });
                    // layer.alert("业务流向不为纠正预防！");
                    return;
                }else{
                    for(var i = 0 ; i < correctiveVm.empList.length; i++){
                        if(correctiveVm.empList[i].id === correctiveVm.prevent.validatePersonnelId){
                            correctiveVm.prevent.validatePersonnelName = correctiveVm.empList[i].empName;
                        }
                    }
                    correctiveVm.corrective.businessFlowDirection = "csyz";
                    var obj = Object.assign(correctiveVm.other,correctiveVm.files,correctiveVm.prevent,correctiveVm.corrective);
                    $.ajax({
                        type:"post",
                        url:contextPath+'/tQcCorrectPreventDocument/update',
                        dataType:"json",
                        data:JSON.stringify(obj),
                        contentType: 'application/json;charset=utf-8',
                        success:function(data){
                            correctiveVm.$Modal.success({
                                title: '提示信息',
                                content:'纠正预防成功！'
                            });
                            // layer.alert("纠正预防成功！");
                            correctiveVm.prevent = data.data;
                            correctiveVm.prevent.correctPreventDate = new Date(data.data.correctPreventDate).format("yyyy-MM-dd");
                            correctiveVm.other = data.data;
                            correctiveVm.corrective.id = data.data.id;
                            correctiveVm.corrective.documentDate = new Date(data.data.documentDate).format("yyyy-MM-dd");
                            correctiveVm.other.createTime = new Date(data.data.createTime).format("yyyy-MM-dd");
                            correctiveVm.other.updateTime = new Date(data.data.updateTime).format("yyyy-MM-dd");
                            correctiveVm.corrective.businessFlowDirection = "csyz";
                            correctiveVm.correctiveDisable =true;
                            correctiveVm.validateDisable = false;
                        },
                        error:function(){
                            correctiveVm.$Modal.info({
                                title: '提示信息',
                                content:'服务器出错，请稍后再试！'
                            });
                            // layer.alert('服务器出错，请稍后再试');
                        }
                    });
                }
            } else {
                correctiveVm.$Modal.info({
                    title: '提示信息',
                    content:'请输入必填项！'
                });
            }
        },
        //问题验证
        issueVerify(){
            let isValiResultPass;
            this.$refs['validation'].validate((valid)=>{
                if(valid){
                    isValiResultPass = true;
                } else {
                    isValiResultPass = false;
                }
            })
            if(isValiResultPass){
                if(correctiveVm.corrective.businessFlowDirection != "csyz"){
                    this.$Modal.info({
                        title: '提示信息',
                        content:'业务流向不为措施验证！'
                    });
                    // alert("业务流向不为措施验证！");
                    return;
                }else if(correctiveVm.corrective.documentStatus != 'temporary_save'){
                    this.$Modal.info({
                        title: '提示信息',
                        content:'单据状态不为暂存不能验证！'
                    });
                    // layer.alert("单据状态不为暂存不能验证！");
                    return;
                }else{
                    correctiveVm.corrective.businessFlowDirection = 'yzwc';
                    var obj = Object.assign(correctiveVm.other,correctiveVm.files,correctiveVm.validation,correctiveVm.corrective);
                    $.ajax({
                        type:"post",
                        url:contextPath+'/tQcCorrectPreventDocument/update',
                        dataType:"json",
                        data:JSON.stringify(obj),
                        contentType: 'application/json;charset=utf-8',
                        success:function(data){
                            correctiveVm.$Modal.success({
                                title: '提示信息',
                                content:'问题验证成功！'
                            });
                            // layer.alert("问题验证成功！");
                            obj = data.data;
                            correctiveVm.other = data.data;
                            correctiveVm.other.createTime = new Date(data.data.createTime).format("yyyy-MM-dd");
                            correctiveVm.other.updateTime = new Date(data.data.updateTime).format("yyyy-MM-dd");
                            correctiveVm.corrective.id = data.data.id;
                            // correctiveVm.validation = data.data;
                            correctiveVm.validateDate = new Date(data.data.validateDate).format("yyyy-MM-dd");
                            correctiveVm.validateDisable = true;
                        },
                        error:function(){
                            correctiveVm.$Modal.info({
                                title: '提示信息',
                                content:'服务器出错，请稍后再试！'
                            });
                            // layer.alert('服务器出错，请稍后再试');
                        }
                    });
                }
            }else {
                correctiveVm.$Modal.info({
                    title: '提示信息',
                    content:'请输入必填项！'
                });
            }
        },
        showTypeCode (status) {
            /*if(!this.release.sourceDocumentType){
                layer.alert("请先选择源单类型!");
                return;
            }*/
            if(status === true){
                return;
            }
            this.showSourceModal = !this.showSourceModal;
        },
        departmentOk() {
            this.showDepartmentModal = false;
            this.htTestChange();
        },
        showDepartment() {
            this.showDepartmentModal = true;
        },
        closeSourceModal(){
            this.showSourceModal = false;
            this.htTestChange();
        },
        //根据当前数据的id获取所有信息
        queryByCode(value){
            let This = this;
                $.ajax({
                    type:"post",
                    url:contextPath+'/tQcCorrectPreventDocument/queryCorrectPreventById',
                    dataType:"json",
                    data:{"documentCode":value},
                    success:function(data){
                        This.uploadShow = false;
                        This.receiptsId = value;
                        This.btnShow = true;
                        This.corrective = data.data;
                        This.corrective.documentDate = new Date(data.data.documentDate).format("yyyy-MM-dd");
                        This.other = data.data;
                        This.other.createTime = correctiveVm.corrective.documentDate;
                        if (data.data.sysFile != null && data.data.sysFile.fileDetails != null) {
                            if(data.data.sysFile.fileDetails.length > 0){
                                This.files = data.data;
                            }
                        }
                        if(data.data.updateTime != '' && data.data.updateTime != null){
                            correctiveVm.other.updateTime = new Date(data.data.updateTime).format("yyyy-MM-dd");
                        }
                        if(data.data.examineVerifyDate != '' && data.data.examineVerifyDate != null){
                            correctiveVm.other.examineVerifyDate = new Date(data.data.examineVerifyDate).format("yyyy-MM-dd");
                        }

                        correctiveVm.release = data.data;
                        if(data.data.issueDate != '' && data.data.issueDate != null){
                            correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                        }else {
                            correctiveVm.release.issueDate = new Date().format("yyyy-MM-dd");
                        }
                        if(data.data.demandReplyDate != '' && data.data.demandReplyDate != null){
                            correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                        }else {
                            correctiveVm.release.demandReplyDate = new Date().format("yyyy-MM-dd");
                        }
                        correctiveVm.analyse = data.data;
                        if(data.data.analyseDate != '' && data.data.analyseDate != null){
                            correctiveVm.analyse.analyseDate = new Date(data.data.analyseDate).format("yyyy-MM-dd");
                        }else {
                            correctiveVm.analyse.analyseDate = new Date().format("yyyy-MM-dd");
                        }
                        correctiveVm.prevent = data.data;
                        if(data.data.correctPreventDate != '' && data.data.correctPreventDate != null){
                            correctiveVm.prevent.correctPreventDate = new Date(data.data.correctPreventDate).format("yyyy-MM-dd");
                        }else{
                            correctiveVm.prevent.correctPreventDate = new Date().format("yyyy-MM-dd");
                        }
                        correctiveVm.validation = data.data;
                        if(data.data.validateDate != '' && data.data.validateDate != null){
                            correctiveVm.validation.validateDate = new Date(data.data.validateDate).format("yyyy-MM-dd");
                        }else{
                            correctiveVm.validation.validateDate = new Date().format("yyyy-MM-dd");
                        }
                        correctiveVm.releaseDisable = true;
                        if(data.data.documentStatus != "temporary_save"){
                            /*This.initApproval();
                            This.reGetApprovalMessage();*/
                            if(data.data.documentStatus === "auditing"){
                                This.isStampShow = true;
                            }
                        }
                    },
                    error:function(){
                        correctiveVm.$Modal.info({
                            title: '提示信息',
                            content:'服务器出错，请稍后再试！'
                        });
                        // layer.alert('服务器出错，请稍后再试');
                    }
                });
        },
        queryById(value){
            let This = this;
                $.ajax({
                    type:"post",
                    url:contextPath+'/tQcCorrectPreventDocument/queryCorrectPreventById',
                    dataType:"json",
                    data:{"id":value},
                    success:function(data){
                        This.isStampShow = false;
                        This.receiptsId = data.data.documentCode;
                        This.corrective = data.data;
                        This.corrective.id = value;
                        This.corrective.documentDate = new Date(data.data.documentDate).format("yyyy-MM-dd");
                        This.other = data.data;
                        This.other.createTime = correctiveVm.corrective.documentDate;
                        if (data.data.sysFile != null && data.data.sysFile.fileDetails != null) {
                            if(data.data.sysFile.fileDetails.length > 0){
                                This.files = data.data;
                            }
                        }
                        if(data.data.updateTime != '' && data.data.updateTime != null){
                            correctiveVm.other.updateTime = new Date(data.data.updateTime).format("yyyy-MM-dd");
                        }
                        if(data.data.examineVerifyDate != '' && data.data.examineVerifyDate != null){
                            correctiveVm.other.examineVerifyDate = new Date(data.data.examineVerifyDate).format("yyyy-MM-dd");
                        }
                        if(data.data.businessFlowDirection === "wtfb"){
                            correctiveVm.release = data.data;
                            if(data.data.issueDate != '' && data.data.issueDate != null){
                                correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                            }else {
                                correctiveVm.release.issueDate = new Date().format("yyyy-MM-dd");
                            }
                            if(data.data.demandReplyDate != '' && data.data.demandReplyDate != null){
                                correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                            }else {
                                correctiveVm.release.demandReplyDate = new Date().format("yyyy-MM-dd");
                            }
                            correctiveVm.releaseDisable = false;
                        }
                        if(data.data.businessFlowDirection === "wtfx"){
                            correctiveVm.release = data.data;
                            correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                            correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                            correctiveVm.analyse = data.data;
                            if(data.data.analyseDate != '' && data.data.analyseDate != null){
                                correctiveVm.analyse.analyseDate = new Date(data.data.analyseDate).format("yyyy-MM-dd");
                            }else {
                                correctiveVm.analyse.analyseDate = new Date().format("yyyy-MM-dd");
                            }
                            correctiveVm.releaseDisable = true;
                            correctiveVm.analyseDisable = false;
                        }
                        if(data.data.businessFlowDirection === "jzyf"){
                            correctiveVm.release = data.data;
                            correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                            correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                            correctiveVm.analyse = data.data;
                            correctiveVm.analyse.analyseDate = new Date(data.data.analyseDate).format("yyyy-MM-dd");
                            correctiveVm.prevent = data.data;
                            if(data.data.correctPreventDate != '' && data.data.correctPreventDate != null){
                                correctiveVm.prevent.correctPreventDate = new Date(data.data.correctPreventDate).format("yyyy-MM-dd");
                            }else {
                                correctiveVm.prevent.correctPreventDate = new Date().format("yyyy-MM-dd");
                            }
                            correctiveVm.releaseDisable = true;
                            correctiveVm.correctiveDisable = false;
                        }if(data.data.businessFlowDirection === "csyz"){
                            correctiveVm.release = data.data;
                            correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                            correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                            correctiveVm.analyse = data.data;
                            correctiveVm.analyse.analyseDate = new Date(data.data.analyseDate).format("yyyy-MM-dd");
                            correctiveVm.prevent = data.data;
                            correctiveVm.prevent.correctPreventDate = new Date(data.data.correctPreventDate).format("yyyy-MM-dd");
                            correctiveVm.validation = data.data;
                            if(data.data.validation != '' && data.data.validation != null){
                                correctiveVm.validation.validateDate = new Date(data.data.validation).format("yyyy-MM-dd");
                            }else {
                                correctiveVm.validation.validateDate = new Date().format("yyyy-MM-dd");
                            }
                            correctiveVm.releaseDisable = true;
                            correctiveVm.validateDisable = false;
                        }
                        if(data.data.businessFlowDirection == "yzwc"){
                            correctiveVm.release = data.data;
                            correctiveVm.release.issueDate = new Date(data.data.issueDate).format("yyyy-MM-dd");
                            correctiveVm.release.demandReplyDate = new Date(data.data.demandReplyDate).format("yyyy-MM-dd");
                            correctiveVm.analyse = data.data;
                            correctiveVm.analyse.analyseDate = new Date(data.data.analyseDate).format("yyyy-MM-dd");
                            correctiveVm.prevent = data.data;
                            correctiveVm.prevent.correctPreventDate = new Date(data.data.correctPreventDate).format("yyyy-MM-dd");
                            correctiveVm.validation = data.data;
                            correctiveVm.validation.validateDate = new Date(data.data.validateDate).format("yyyy-MM-dd");
                            correctiveVm.releaseDisable = true;
                        }
                        if(data.data.documentStatus != "temporary_save"){
                            correctiveVm.releaseDisable = true;
                            This.uploadShow = false;
                            /*This.initApproval();
                            This.reGetApprovalMessage();*/
                            if(data.data.documentStatus === "auditing"){
                                This.isStampShow = true;
                            }
                        }
                    },
                    error:function(){
                        correctiveVm.$Modal.info({
                            title: '提示信息',
                            content:'服务器出错，请稍后再试！'
                        });
                        // layer.alert('服务器出错，请稍后再试');
                    }
                });

        },
        //调用自动编码
        getDocType(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+'/tQcCorrectPreventDocument/getDocType',
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    This.initDocCode = data.data;
                },
                error: function(err){
                    correctiveVm.$Modal.info({
                        title: '提示信息',
                        content:'服务器出错，请稍后再试！'
                    });
                    // layer.alert("服务器出错");
                }
            })
        },
        /*reGetApprovalMessage(){
            $("#approvalList").jqGrid('clearGridData');
            $("#approvalList").jqGrid('setGridParam',{postData:{receiptsId:this.receiptsId}}).trigger("reloadGrid")
        }*/
    },
    watch:{

    },
    mounted(){
        let This = this;
        This.param = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
        window.handlerClose = this.handlerClose;
        query:{
            let params = window.parent.params.params;
            if(params.type === 'update'){
                this.queryById(params.id)
            }else if(params.type === 'query'){
                this.receiptsId = params.docCode;
                this.queryByCode(params.docCode)
            }else if(params.type === 'add'){
                this.getDocType();
            }
        }

    }
})