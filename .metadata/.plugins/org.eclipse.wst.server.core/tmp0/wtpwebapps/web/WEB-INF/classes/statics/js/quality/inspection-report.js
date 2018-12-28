function alertMsg(content,icon){
    if(icon === 2){
       report.$Modal.warning({content:content});
    }else{
       report.$Modal.success({content:content});
    }
}
var report=new Vue({
    el: '#inspection-item',
    data() {
        return {
            //启用多级审核时单据上的操作——审核
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
            //审批进度条
            steplist: [],
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
            saveResult:'',
            currentStep: '',
            nextStep: '',
            isLook: false,
            isLook2: false,
            openTime:'',
            body:{
                code:''
            },
            all:{
                businessType: '',
                documentCode: '',
                documentCode1: '',
                documentTime: '',
                documentType: '',
                examineVerifyName: '',
                inspectorName: '',
                productTypeId: '',
                qualifiedPercent: '',
                qualifiedTotalAmount: '',
                sendTestName: '',
                sendTestTime: '',
                sourceDepartmentName: '',
                styleProductList: [],
                testDepartmentName: '',
                testFinishTime: '',
                testResult1: '',
                testTotalAmount: '',
                testWay: '',
                testedOrganizationName: '',
                totalTestConclusion: '',
                unqualifiedTotalAmount: '',
                documentStatus:'',
                testDocumentId:'',
                reportDocCode:'',
                genType:''
            },
            reportDocument:{
                id:'',
                testDocumentId:'',
                documentStatus:'',
                delStatus:'',
                organizationId:'',
                reportDocCode:''
            },
            list: [],
            curDate:'',
            approvalUser:'',
            approvalTime:'年 月 日',
            isStampShow:false,
            queryParams:'',
            currentOrgName:'',
        }
    },
    created(){
        this.queryParams = window.parent.params.params;
    },
    methods: {

        init() {
            let params= this.queryParams;
            let  testDocumentId=params.testDocumentId;
            $.ajax({
                url: contextPath+'/testReportDocumentController/genReportDocWithSD',
                type: 'post',
                dataType: "json",
                data: {testDocumentId:testDocumentId},
                success:function(data) {
                    if(data.code === '100100'){

                        let percentFormatter = (n) =>{
                            if(!n){return ''}
                            if(n > 1){
                                return n.toFixed(2)+"%";
                            }else if(n <= 1){
                                return (Math.round(n * 10000)/100).toFixed(2)+"%";
                            }else {
                                return '';
                            }
                        };
                        let res = data.data;
                        //页面上只显示 检验不合格的和特别放行的
                        res.styleProductList = res.styleProductList ? res.styleProductList.filter(pro=>
                            pro.productTestResult === 'jyjgbhg'||
                            pro.productTestResult === 'jyjgtbfx' ) : [];
                        //这里对日期做格式化处理 数据字典格式化处理
                        report.all =  Object.assign(res,{
                            testFinishTime: res.testFinishTime ?
                                new Date(res.testFinishTime).format('yyyy-MM-dd HH:mm:ss') : '',
                            sendTestTime: res.sendTestTime ?
                                new Date(res.sendTestTime).format('yyyy-MM-dd HH:mm:ss') : '',
                            documentTime: res.documentTime ?
                                new Date(res.documentTime).format('yyyy-MM-dd') : '',
                            qualifiedPercent:percentFormatter(res.qualifiedPercent),
                            testResult1:report.dictMapping(res.testResult1),
                            businessType:report.dictMapping(res.businessType)
                        });


                        if(report.all && report.all.genType === 1 && report.all.reportDocCode){
                            report.reportDocument.testDocumentId = data.data.testDocumentId;
                            report.reportDocument.documentStatus = data.data.documentStatus;
                            report.reportDocument.reportDocCode = data.data.reportDocCode;
                            report.approvalInfoInit();
                        }
                    }
                },
                error:function() {
                    alertMsg("服务器出错",2)
                }
            })
        },
        save(){
            let _this = this;
            let testDocumentId ='';
            let params= _this.queryParams;
            if(!$.isEmptyObject(params)){
                testDocumentId=params.testDocumentId;
            }
            $.ajax({
                url: contextPath+'/testReportDocumentController/save',
                type: 'post',
                dataType: "json",
                data: {testDocumentId:testDocumentId},
                success(res) {
                    if(res.code === '100100'){
                        _this.all.reportDocCode = res.data.reportDocCode;
                        _this.all.documentStatus = res.data.documentStatus;
                        alertMsg("保存成功!");
                    }else{
                        let msg = res.msg ? res.msg :'保存失败!' ;
                        alertMsg(msg,2);
                    }
                },
                error() {
                    alertMsg("服务器出错",2)
                }
            });
        },
        approvalInfoInit(){
            let _this = this;
            $.ajax({
                url: contextPath+'/testReportDocumentController/getApprovalInfoByReportDocCode',
                type: 'post',
                dataType: "json",
                data: {reportDocCode:this.all.reportDocCode},
                success:function(res) {
                    if(res.code === '100100'){

                        _this.approvalUser = res.data && res.data.approvalUser ? res.data.approvalUser : '';
                        _this.approvalTime = res.data && res.data.approvalTime ? new Date(res.data.approvalTime).format("yyyy年MM月dd日"):'年 月 日';
                    }
                },
                error:function() {
                    alertMsg("服务器出错",2)
                }
            });
        },
        commit(){
            let testDocumentId =[];
            let params = window.parent.params;
            if(!$.isEmptyObject(params)){
                testDocumentId.push(params.params.testDocumentId);
            }else{
                alertMsg("请退出后重试!",2);
                return false;
            }
            if(testDocumentId.length === 0 || isNaN(testDocumentId[0]) ){
                alertMsg("请退出后重试!",2);
                return false;
            }
            window.top.home.loading('show',{text:'提交数据中，请稍后!'});
            $.ajax({
                url: contextPath+'/testReportDocumentController/commit',
                method: 'post',
                dataType: "json",
                data:JSON.stringify(testDocumentId),
                contentType: 'application/json;charset=utf-8',
                success: function (res) {
                    if (res.code === '100100') {
                        alertMsg(res.msg);
                        report.reload = !report.reload;
                        report.all.documentStatus="待审核";
                    } else {
                        alertMsg(res.msg,2);
                    }
                    window.top.home.loading('hide');
                },
                error: function (e) {
                    console.log(e);
                    window.top.home.loading('hide');
                }
            });
        },

        preview() {
            htPrint();
        },
        print() {
            htPrint();
        },
        listTable() {
            window.parent.activeEvent({name: '检验报告单列表',
                url: contextPath+'/quality/quality/testDocumentReport-index.html',

            });
        },
        cancel() {
            window.parent.closeCurrentTab({name:'新增检验报告单',openTime:this.openTime,exit:true})
        },
        //审核
        approval() {
            //发送请求
            let This = this;
            if(This.all.testDocumentId === ''){
                alertMsg("请选择一条数据!",2);
                return false;
            }
            if(This.all.documentStatus ==="暂存"){
                alertMsg("请先提交报告单!",2);
                return false;
            }
            This.reportDocument.testDocumentId=This.all.testDocumentId;
            This.reportDocument.reportDocCode=This.all.reportDocCode;
            report.initApproval(This.all.reportDocCode);
            This.approvement = {receiptsId:'',approvalResult:"1",approvalInfo:''};
            window.top.home.loading('show',{text:'提交数据中，请稍后!'});
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:This.all.reportDocCode,docTypeCode:"bgd"}),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100515"){
                        alertMsg("审核成功");
                        This.reportDocument.documentStatus = "已审核";
                        This.saveMethod();
                    }
                    if(data.code === "100514"){
                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                    "【六级审核】":data.msg;
                        alertMsg(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限",2);
                    }
                    if(data.code === "100100"){
                        if(This.reportDocument.documentStatus === "已审核"){
                            alertMsg("检验报告已审核",2);
                            return false;
                        }
                        This.approveComment = true;
                    }
                },
                error: function(err){
                    alertMsg("服务器出错");
                }
            })
        },
        //驳回
        reject() {
            let This = this;
            if(This.all.testDocumentId === ''){
                alertMsg("请选择一条数据!",2);
                return false;
            }
            if(This.all.documentStatus === "暂存"){
                alertMsg("请先提交报告单!",2);
                return false;
            }
            This.rejectement = {receiptsId:'',approvalResult:'0',approvalInfo:''};
            This.reportDocument.testDocumentId=This.all.testDocumentId;
            This.reportDocument.reportDocCode=This.all.reportDocCode;
            report.initApproval(This.all.reportDocCode);
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:This.all.reportDocCode,docTypeCode:"bgd"}),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100"){
                        This.rejectComment = true;
                    }
                    if(data.code === "100514"){
                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                    "【六级审核】":data.msg;
                        alertMsg(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的驳回权限");
                    }
                    if(data.code === "100515"){
                        alertMsg("驳回成功");
                        This.reportDocument.documentStatus = "驳回";
                        This.saveMethod();
                    }
                },
                error: function(err){
                    alertMsg("服务器出错",2);
                }
            })

        },
        //审批意见点击确定
        getApproveInfo() {
            let This = this;
            This.approvement.receiptsId = This.all.reportDocCode;
            This.reportDocument.testDocumentId=This.all.testDocumentId;
            This.reportDocument.reportDocCode=This.all.reportDocCode;
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        alertMsg("审核成功");
                        if(data.data.approvalStatus === 0){
                            if(This.all.documentStatus === "审核中"){
                                return false;
                            }
                            This.reportDocument.documentStatus = "审核中";
                            This.all.documentStatus= "审核中";
                        }
                        if(data.data.approvalStatus === 1){
                            This.reportDocument.documentStatus = "已审核";
                            This.all.documentStatus= "已审核";
                        }

                        This.saveMethod();
                        This.approvalInfoInit();
                    }else {
                        alertMsg("审核失败",2);
                    }
                },
                error: function(err){
                    alertMsg("服务器出错",2);
                }
            })
        },
        //驳回点击确定
        getRejectInfo() {
            let This = this;
            This.rejectement.receiptsId = This.all.reportDocCode;
            This.reportDocument.testDocumentId=This.all.testDocumentId;
            This.reportDocument.reportDocCode=This.all.reportDocCode;
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(This.rejectement),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        if(data.data.approvalStatus === -1){
                            This.reportDocument.documentStatus = "驳回";
                            This.all.documentStatus= "驳回";
                        }
                        if(data.data.approvalStatus === -2){
                            This.reportDocument.documentStatus = "暂存";
                            This.all.documentStatus= "暂存";
                        }
                        alertMsg("驳回成功");
                        This.saveMethod();
                        This.approvalInfoInit();
                    }else {
                        alertMsg("驳回失败",2);
                    }

                },
                error: function(err){
                    alertMsg("服务器出错",2);
                }
            })
        },
        initApproval(){
            let This = this;
            This.reportDocument.testDocumentId=This.all.testDocumentId;
            This.reportDocument.reportDocCode=This.all.reportDocCode;
            $.ajax({
                type: "post",
                url: contextPath+'/testReportDocumentController/queryProcessByReceiptsId',
                data:{receiptsId:This.reportDocument.reportDocCode},
                dataType: "json",
                success: function (data) {
                    var process = data.data && data.data.list;

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


                    This.steplist = process;
                    if(process[1].currentLevel === data.data.levelLength){
                        for (let i = 0; i < process.length; i++) {
                            process[i].currentLevel = process.length - 1;
                        }
                        return false;
                    }
                    var curr = process[1].currentLevel;
                    for (let i = 0; i < This.stepData.length; i++) {
                        if (curr === This.stepData[i].currentLevel) {
                            This.currentStep = This.stepData[i+1].subtitle;
                            if(This.stepData[i+1].currentLevel === data.data.levelLength){
                                This.nextStep = This.stepData[This.stepData.length-1].subtitle;
                            } else{
                                This.nextStep = This.stepData[i+2].subtitle;
                            }

                        }
                    }
                },
                error: function () {
                    alertMsg('服务器出错啦',2);
                }
            })
        },
        loadCurrentOrg(){
            let _this = this;
            $.post(contextPath+'/testReportDocumentController/getCurrentOrg',{},(res)=>{
                if(res.code === '100100'){
                    _this.currentOrgName = res.data.orgName;
                }
            },'json');
        },
        saveMethod(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/testReportDocumentController/updateStatusByApproval",
                contentType: 'application/json',
                data: JSON.stringify(This.reportDocument),
                dataType: "json",
                success: function(data) {
                    console.log("修改成功");
                },
                error: function(err){
                    alertMsg("服务器出错",2);
                }
            })

        },
        dictMapping(val){
          const DICT = getCodeList('root_zj_jydywlx')
                         .concat(getCodeList('root_zj_wydjyd_ywlx'))
                         .concat(getCodeList('zj_jyjg'));
           let _r = DICT.find(item => item.value === val);
           return  _r === 'undefined' ? '' : _r.name;
        },
    },
    filters:{
        formatResult(val){
            if(val === 'jyjghg'){
                return '合格';
            }
            if(val ===  'jyjgtbfx'){
                return '特别放行';
            }
            if(val === 'jyjgbhg'){
                return '不合格';
            }
            return '';
        }
    },
    mounted() {
        this.init();
        this.openTime = window.parent.params.openTime;
        this.curDate = new Date().format("yyyy年MM月dd日");
        this.loadCurrentOrg();
    },
    computed:{
        title(){
            let _this = this;
            let testDocumentType = _this.all.testDocumentType;
            let _type ='';
            switch (testDocumentType){
                case 'lljyd' : _type = '来料';break;
                case 'fhjyd' : _type = '发货';break;
                case 'tbjyd' : _type = '调拨';break;
                case 'kcjyd' : _type = '库存';break;
                default : _type = '';
            }
            return _type+'检验报告单'
        },
        headerCls(){
            let type = this.queryParams.type;
            if(type === 'view'){
                return 'pd-rg-sm pd-lf-sm is-disabled';
            }else {
                return 'pd-rg-sm pd-lf-sm';
            }
        }
    },
    watch:{

    }
});