var inspectionItemVm =new Vue({
    el: '#inspection-item',
    data() {
        let that = this;
        return {
            record_url: '',
            openTime:"",
            params:{},
            //控制弹窗显示
            modalTrigger:false,
            modalType:'',
            //审批进度条
            stepList: [],
            approvalTableData:[],
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
            reload:false,
            selected:[],
            //审核图标
            isStampShow:false,
            //显示新增按钮
            showAdd:true,
            //显示保存按钮
            showSave:true,
            //显示提交按钮
            showSubmit:true,
            //显示审核按钮
            showApproval:true,
            //显示驳回按钮
            showReject:true,
            //显示列表按钮
            showList:true,
            //显示附件按钮
            showAttachment:true,
            showBack:true,
            //保存复选框勾选数据
            lotData:[],
            //保存复选框所选下标
            checkindex:[],
            isCheckedAll: false,
            islotDataChecked:false,
            isDxfx:false,
            isQtfx:false,
            isbet:false,
            changeFrame:false,
            showMenu:true,
            upperLimitDisable:false,
            lowerLimitDisable:false,
            upperCommDiffDisable:false,
            lowerCommDiffDisable:false,
            // 必填校验项目
            validate:{
                name:[{required:true}], //检验项目
                productId:[{required:true}], //商品类型
                bugRankId:[{required:true}], //缺陷等级
                analyseMethod:[{required:true}], //分析方法
                qualityStandardStatus:[{required:true}], //状态
                sampleType:[{required:true}], //抽样类型
            },
            //页面数据绑定
            inspectionItem:{
                id:0,
                groupName:'',
                groupId:'',
                name:'',
                importantFlag:false,
                inspectStandard:1,
                testItemStatus:"",
                productId:'',
                productName:'',
                unitId:'',
                unitName:'',
                testMethodId:"",
                testMethodName:'',
                code:'',
                bugRankId:'',
                bugRankName:'',
                testInstrumentId:'',
                testInstrumentName:'',
                testBasisId:'',
                testBasisName:'',
                analyseMethod:'',
                analyseMethodName:'',
                goalValue:'',
                goalValueName:'',
                upperCommonDifference:'',
                qualityStandardStatus:'',
                qualityStandardStatusName:'',
                upperLimitValue:'',
                lowerCommonDifferent:'',
                compareSymbol:'',
                compareSymbolName:'',
                lowerLimitValue:'',
                sampleType:'',
                sampleTypeName:'',
                samplePlanEntities:[],
                createId:'',
                createName:'',
                createTime:'',
                updateId:'',
                updateName:'',
                updateTime:'',
                examineVerifyId:'',
                examineVerifyName:'',
                examineVerifyTime:'',
                sysFileId:'',
                //上传附件
                sysFile:{
                    fileId: '',
                    fileType: 5,
                    fileDetails: []
                }
            },

            //上传弹窗
            showUpload: false,
            //上传按钮
            uploadBtn: true,
            //删除附件按钮
            deleteBtn: true,
            //select options
            itemstatusList:[],
            productList:[],
            unitList:[],
            testMethodList:[],
            bugRankList:[],
            testInstrumentList:[],
            analyseMethodList:[],
            standardList:[],
            statusList:[],
            operatorList:[],
            sampleTypeList:[],
            goalValueList:[],
            approvalUrl:'',
            /*data_config_samlpling:{
                url: contextPath+'/samplePlanController/list',
                colNames : [ '批量', '抽检比例(大于等于)','允收数','拒收数'],
                colModel : [
                    {name : 'amount',index : 'amount',width : 300, align : "center"},
                    {name : 'randomTestProportion',index : 'randomTestProportion',width : 300, align : "center"},
                    {name : 'allowNumber',index : 'allowNumber',width : 300, align : "center"},
                    {name : 'rejectNumber',index : 'rejectNumber asc, invdate',width : 300, align : "center"}
                ]
            },
            data_config_approval:{
                url: contextPath+'/testItemController/queryReceiptsById',
                datatype:'JSON',
                colNames : [ '操作类型', '开始级次','目的级次','审批人','审批意见','审批时间'],
                colModel : [
                    {
                        name : 'approvalResult',
                        index : 'approvalResult',
                        width : 215,
                        align : "left",
                        formatter: function (value, grid, rows, state) {

                            return value == 1 ? "审核": "驳回";
                        }
                    },
                    {
                        name : 'currentLevel',
                        index : 'currentLevel',
                        width : 215,
                        align : "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "一级审核": value === 2 ?
                                "二级审核":value === 3 ? "三级审核":value === 4 ?
                                    "四级审核":value === 5 ? "五级审核":value === 6 ?
                                        "六级审核":"";
                        }

                    },
                    {
                        name : 'nextLevel',
                        index : 'nextLevel',
                        width : 210,
                        align : "left",
                        formatter: function (value, grid, rows, state) {
                            if(rows.approvalResult === -1 || (rows.approvalResult === 0 && !rows.nextLevel)){
                                return "开始";
                            }
                            return value === "1" ? "一级审核": value === "2" ?
                                "二级审核":value === "3" ? "三级审核":value === "4" ?
                                    "四级审核":value === "5" ? "五级审核":value === "6" ?
                                        "六级审核":"结束";
                        }
                    },
                    {name : 'createName',index : 'createName',width : 215, align : "left"},
                    {name : 'approvalInfo',index : 'approvalInfo',width : 215, align : "left"},
                    {name : 'createTime',index : 'createTime',width : 215, align : "left"}
                ] ,
                jsonReader:{
                    root:"data"

                },
                multiselect: false

            },*/
            data_config_changeLog:{
                colNames : [ '变更信息', '变更前','变更后','变更日期','变更人'],
                //ostData:{"code":''},
                colModel : [
                    {name : 'changeInfo',index : 'changeInfo',width : 200, align : "left"},
                    {name : 'operationBefore',index : 'operationBefore',width : 210, align : "left"},
                    {name : 'operationAfter',index : 'operationAfter',width : 210, align : "left"},
                    {name : 'operationTime',index : 'operationTime',width : 220, align : "left"},
                    {name : 'userName',index : 'userName',width : 210, align : "left"}
                ] ,
                multiselect: false
            },/*,
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
            currentStep: '',
            nextStep: '',*/
            statusMap:{
                tmp_save: "zc", await_check: "dsh", checking: "jyshz", auditing: "jyysh", reject: "bh"
            },
            canRejectWhenAudit: true
        }
    },
    methods: {

        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.inspectionItem.testItemStatus = parseInt(res.result.data);
                _this.initItem(2);
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/testItemController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.inspectionItem.code,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.inspectionItem.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.info({content:res.msg});
                    }
                    _this.initItem(2);
                }
            });
        },

        //抽样方案中，点击单行复选框，获取该行数据保存到数组lotData中
        getData(index) {

            if (this.checkindex.indexOf(index) > -1) {
                let i = this.checkindex.indexOf(index);
                this.checkindex.splice(i, 1);
                this.lotData.splice(i, 1);
            } else {
                this.checkindex.push(index);
                this.lotData.push(this.inspectionItem.samplePlanEntities[index]);
            }
            console.log(this.lotData);
            console.log(this.checkindex);
            if (this.checkindex.length === this.inspectionItem.samplePlanEntities.length) {
                this.isCheckedAll = true;

            } else {
                this.isCheckedAll = false;
            }
        },
        checkAll() {
            if (!this.isCheckedAll) {
                this.checkindex = [];
                this.lotData = [];
                this.inspectionItem.samplePlanEntities.forEach((el, i) => {
                    this.checkindex.push(i);
                    this.inspectionItem.samplePlanEntities[i].isChecked = true;
                    this.lotData.push(this.inspectionItem.samplePlanEntities[i]);
                })
            } else {
                this.checkindex = [];
                this.lotData = [];
                this.inspectionItem.samplePlanEntities.forEach((el, i) => {
                    this.inspectionItem.samplePlanEntities[i].isChecked = false;
                })

            }
            console.log(this.checkindex);
            console.log(this.lotData);
        },
        //菜单栏方法
        //新增
        add(){
            window.parent.activeEvent({name: '新增检验项目', url: contextPath+'/quality/quality/inspection-item.html',params: {data:"zc",type:0}})
        },
        //处理数据字典部分数据
        dealDictionary(){
            //设置商品类型name
            if(this.productList) {
                this.productList.forEach((item) => {
                    if (item.id == this.inspectionItem.productId) {
                        this.inspectionItem.productName = item.name;
                    }
                });
            }
            //单位
            if(this.unitList) {
                this.unitList.forEach((item) => {
                    if (item.id == this.inspectionItem.unitId) {
                        this.inspectionItem.unitName = item.name;
                    }
                });
            }

            //缺陷等级
            if(this.bugRankList) {
                this.bugRankList.forEach((item) => {
                    if (item.id == this.inspectionItem.bugRankId) {
                        this.inspectionItem.bugRankName = item.name;
                    }
                });
            }
            //分析方法
            if(this.analyseMethodList) {
                this.analyseMethodList.forEach((item) => {
                    if (item.value == this.inspectionItem.analyseMethod) {
                        this.inspectionItem.analyseMethodName = item.name;
                    }
                });
            }
            //状态
            if(this.statusList) {
                this.statusList.forEach((item) => {
                    if (item.value == this.inspectionItem.qualityStandardStatus) {
                        this.inspectionItem.qualityStandardStatusName = item.name;
                    }
                });
            }
            //比较符
            if(this.operatorList) {
                this.operatorList.forEach((item) => {
                    if (item.value == this.inspectionItem.compareSymbol) {
                        this.inspectionItem.compareSymbolName = item.name;
                    }
                });
            }
            //检验方法
            if(this.testMethodList) {
                this.testMethodList.forEach((item) => {
                    if (item.id == this.inspectionItem.testMethodId) {
                        this.inspectionItem.testMethodName = item.name;
                    }
                });
            }
            //检验仪器
            if(this.testInstrumentList) {
                this.testInstrumentList.forEach((item) => {
                    if (item.id == this.inspectionItem.testInstrumentId) {
                        this.inspectionItem.testInstrumentName = item.name;
                    }
                });
            }
            //检验依据
            if(this.standardList){
                this.standardList.forEach((item)=>{
                    if(item.id==this.inspectionItem.testBasisId){
                        this.inspectionItem.testBasisName = item.name;
                    }
                });
            }
            //目标值
            this.inspectionItem.goalValueName = "";
            if(this.goalValueList){
                this.goalValueList.forEach((item)=>{
                    if(item.id==this.inspectionItem.goalValue){
                        this.inspectionItem.goalValueName = item.name;
                    }
                });
            }
        },
        dealCompareSymbolName(){
            if(this.inspectionItem.compareSymbolName){
                this.inspectionItem.compareSymbolName=this.inspectionItem.compareSymbolName.replace(">", "&gt;");
            }
            if(this.inspectionItem.compareSymbolName){
                this.inspectionItem.compareSymbolName=this.inspectionItem.compareSymbolName.replace("<", "&lt;");
            }

            if(this.inspectionItem.compareSymbolName){
                this.inspectionItem.compareSymbolName=this.inspectionItem.compareSymbolName.replace("<>", "&lt;&gt;");
            }
            if(this.inspectionItem.compareSymbolName){
                this.inspectionItem.compareSymbolName=this.inspectionItem.compareSymbolName.replace(">=", "&gt;=");
            }
            if(this.inspectionItem.compareSymbolName){
                this.inspectionItem.compareSymbolName=this.inspectionItem.compareSymbolName.replace("<=", "&lt;=");
            }
        },
        //保存
        save(){
            let This = this;
            if(this.inspectionItem.testItemStatus === "dsh" || this.inspectionItem.testItemStatus === "jyysh" ||
                this.inspectionItem.testItemStatus === "jyshz"){
                // layer.alert("检验项目已提交");
                this.$Modal.info({
                    title:'提示信息',
                    content:'检验项目已提交！'
                })
                return false;
            }
            if(this.inspectionItem.importantFlag === true){
                this.inspectionItem.importantFlag = 1;
            } else {
                this.inspectionItem.importantFlag = 0;
            }
            this.convertNumber();
            this.dealDictionary();
            this.dealCompareSymbolName();

            This.inspectionItem.testItemStatus = "zc";

            let url = "";
            if(This.inspectionItem.code === ""){
                url = contextPath+"/testItemController/saveToExistCode";
            }else{
                url = contextPath+"/testItemController/updateToExistCode";
            }
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(This.inspectionItem),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        console.log(data.data);
                        This.inspectionItem.code = data.data.code;
                        // layer.alert("保存成功");
                        This.$Modal.success({
                            title:'提示信息',
                            content:'保存成功'
                        });
                        if(data.data.importantFlag === 1){
                            This.inspectionItem.importantFlag = true;
                        } else {
                            This.inspectionItem.importantFlag = false;
                        }
                        This.initItem(3);
                    }else {
                        // layer.alert("保存失败");
                        This.$Modal.info({
                            title:'提示信息',
                            content:'保存失败'
                        });
                    }
                    //刷新变更记录
                    This.$refs.my_log.reload();
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    });
                }
            })
        },
        //提交 ,验证必填 ，还要验证抽样方案中，批量列中是否有重复值
        submititem(){
            let This = this;
            // console.log($('form').valid());
            // if(!($('form').valid())){
            //     layer.alert("请输入必填项");
            //     return false;
            // }
            //**********表单必填校验开始**********************
            let isFormPass;
            this.$refs['inspectionItem'].validate((valid)=>{
                if(valid){
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if(!isFormPass){
                return false;
            }
            //**********表单必填校验结束**********************
            if(This.inspectionItem.analyseMethod === 'dlfx' && (This.inspectionItem.compareSymbol === 'dy' || This.inspectionItem.compareSymbol === 'between')) {
                if (Number(This.inspectionItem.upperLimitValue) < Number(This.inspectionItem.lowerLimitValue)) {
                    // layer.alert("上限值不能小于下限值!");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'上限值不能小于下限值'
                    });
                    return false;
                }
            }

            var lotSize = This.inspectionItem.samplePlanEntities;
            var arr = [];
            var msgOne = 0;
            var msgTwo = 0;
            for (var i = 0; i < lotSize.length; i++) {
                if (Number(lotSize[i].allowNumber) < 0 || Number(lotSize[i].rejectNumber) < 0) {
                    msgOne = 1;
                }
                if (Number(lotSize[i].allowNumber) >= Number(lotSize[i].rejectNumber)) {
                    msgTwo = 1;
                }

                arr.push(lotSize[i].amount);
            }
            if (msgOne === 1 && msgTwo === 1) {
                // layer.alert("允收数和拒收数不能小于0且允收数不能大于或等于拒收数!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'允收数和拒收数不能小于0且允收数不能大于或等于拒收数!'
                });
                return false;
            }
            if (msgOne === 1) {
                // layer.alert("允收数和拒收数不能小于0!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'允收数和拒收数不能小于0!'
                });
                return false;
            }
            if (msgTwo === 1) {
                // layer.alert("允收数不能大于或等于拒收数!");
                This.$Modal.info({
                    title:'提示信息',
                    content:'允收数不能大于或等于拒收数!'
                });
                return false;
            }

            var lotArr = arr.sort();
            for( var j=0;j<lotArr.length;j++){
                if (lotArr[j]==lotArr[j+1]){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '抽样方案批量列中，不能重复设置同一批量！'
                    });
                    return false;
                }
            }

            if(this.inspectionItem.testItemStatus === "dsh" || this.inspectionItem.testItemStatus === "jyysh" ||
                this.inspectionItem.testItemStatus === "jyshz"){
                // layer.alert("检验项目已提交");
                this.$Modal.info({
                    title: '提示信息',
                    content: '检验项目已提交'
                });
                return false;
            }

            if(this.inspectionItem.importantFlag === true){
                this.inspectionItem.importantFlag = 1;
            } else {
                this.inspectionItem.importantFlag = 0;
            }

            this.convertNumber();
            this.dealDictionary();
            this.dealCompareSymbolName();

            This.inspectionItem.testItemStatus = 'dsh';
            let url = "";
            if(This.inspectionItem.code === ""){
                url = contextPath+"/testItemController/saveToExistCode";
            }else{
                url = contextPath+"/testItemController/updateToExistCode";
            }
            //发送请求
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(This.inspectionItem),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100") {
                        This.inspectionItem = data.data;
                        if(data.data.importantFlag === 1){
                            This.inspectionItem.importantFlag = true;
                        } else {
                            This.inspectionItem.importantFlag = false;
                        }
                        if(data.data.analyseMethod === "dxfx"){
                            This.inspectionItem.goalValue = Number(data.data.goalValue);
                        }
                        if(data.data.groupId === window.parent.userInfo.organId){
                            This.inspectionItem.groupName = window.parent.userInfo.orgName;
                            This.inspectionItem.groupId = window.parent.userInfo.organId;
                        }
                        This.changeFrame = true;
                        This.isbet = true;
                        This.upperCommDiffDisable = true;
                        This.upperLimitDisable = true;
                        This.lowerCommDiffDisable = true;
                        This.isQtfx = true;
                        This.lowerLimitDisable = true;
                        This.showMenu = false;
                        This.$Modal.success({
                            title: '提示信息',
                            content: '提交成功!'
                        });
                        // layer.alert("提交成功");
                    }else {
                        // layer.alert("提交失败");
                        This.$Modal.info({
                            title: '提示信息',
                            content: '提交失败!'
                        });
                    }
                    This.initItem(1);
                    //This.initApproval();
                    //刷新变更记录
                    This.$refs.my_log.reload();
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试!'
                    });
                }
            })
        },
        convertNumber(){
            console.log(this.inspectionItem.upperCommonDifference);
            if(this.inspectionItem.upperCommonDifference === 0){
                this.inspectionItem.upperCommonDifference = (Number(this.inspectionItem.upperCommonDifference)).toFixed(2);
            }
            if(this.inspectionItem.lowerCommonDifferent === 0){
                this.inspectionItem.lowerCommonDifferent = (Number(this.inspectionItem.lowerCommonDifferent)).toFixed(2);
            }
            if(this.inspectionItem.upperCommonDifference){
                this.inspectionItem.upperCommonDifference = (Number(this.inspectionItem.upperCommonDifference)).toFixed(2);
            }
            if(this.inspectionItem.lowerCommonDifferent){
                this.inspectionItem.lowerCommonDifferent = (Number(this.inspectionItem.lowerCommonDifferent)).toFixed(2);
            }
            if(this.inspectionItem.samplePlanEntities){
                for (let i = 0; i < this.inspectionItem.samplePlanEntities.length; i++) {
                    this.inspectionItem.samplePlanEntities[i].randomTestProportion = (Number(this.inspectionItem.samplePlanEntities[i].randomTestProportion)).toFixed(2);
                }
            }

        },

        /*//审核
        approval() {
            //发送请求
            let This = this;
            //当未提交或者状态为暂存时则提示
            if(This.inspectionItem.code === "" || This.inspectionItem.testItemStatus === "zc"){
                layer.alert("请提交检验项目!");
                return false;
            }
            this.dealDictionary();
            this.dealCompareSymbolName();
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:This.inspectionItem.code,docTypeCode:"dj5"}),
                dataType: "json",
                success: function(data) {
                    //data:响应数据，This.inspectionItem.testItemStatus：对应状态属性，"jyysh"：已审批对应数据字典value值
                    This.approvalHandler(data,"jyysh");
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        approvalHandler(data,statusValue){
            let This = this;
            if(data.code === "100515"){
                layer.alert("审核成功");
                This.inspectionItem.testItemStatus = statusValue;
                //调用修改方法修改状态
                This.saveMethod();
            }
            if(data.code === "100514"){
                let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                    "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                        "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                            "【六级审核】":data.msg;
                layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限");

            }
            if(data.code === "100100"){
                if(This.inspectionItem.testItemStatus === statusValue){
                    layer.alert("检验项目已审核");
                    return false;
                }
                This.approveComment = true;
            }
        },
        //驳回
        reject() {
            let This = this;
            if(This.inspectionItem.code === "" || This.inspectionItem.testItemStatus === "zc"){
                layer.alert("请提交检验项目!");
                return false;
            }
            this.dealDictionary();
            this.dealCompareSymbolName();
            //发送请求
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:This.inspectionItem.code,docTypeCode:"dj5"}),
                dataType: "json",
                success: function(data) {
                    //data:响应数据，This.inspectionItem.testItemStatus：对应状态属性，"zc"：暂存对应数据字典value值
                    This.rejectHandler(data,"zc");

                    This.$refs.my_log.reload();
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        rejectHandler(data,statusValue){
            let This = this;
            if(data.code === "100100"){
                This.rejectComment = true;
            }
            if(data.code === "100514"){
                let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                    "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                        "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                            "【六级审核】":data.msg;
                layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的驳回权限");
            }
            if(data.code === "100515"){
                layer.alert("驳回成功");
                This.inspectionItem.testItemStatus = statusValue;
                //调用修改方法修改状态
                This.saveMethod();
            }
        },
        //审批意见点击确定
        getApproveInfo() {
            let This = this;
            This.approvement.receiptsId = This.inspectionItem.code;
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(this.approvement),
                dataType: "json",
                success: function(data) {
                    //data:响应数据，This.inspectionItem.testItemStatus：对应状态属性，"jyshz"：审核中对应数据字典value值，"jyysh"：已审核对应数据字典value值
                    This.approvalInfoHandler(data,"jyshz","jyysh");

                    This.$refs.my_log.reload();
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        approvalInfoHandler(data,statusValOne,statusValTwo){
            let This = this;
            if(data.code === "100100") {
                layer.alert("审核成功");
                if(data.data.approvalStatus === 0){
                    if(This.inspectionItem.testItemStatus === statusValOne){
                        This.initItem(2);
                        This.approvement = {receiptsId:'',approvalResult:1,approvalInfo:''};
                        return false;
                    }
                    This.inspectionItem.testItemStatus = statusValOne;
                }
                if(data.data.approvalStatus === 1){
                    This.inspectionItem.testItemStatus = statusValTwo;
                }
                This.convertNumber();
                This.saveMethod();
                This.approvement = {receiptsId:'',approvalResult:1,approvalInfo:''};

            }else {
                layer.alert("审核失败");
            }
        },
        //驳回点击确定
        getRejectInfo() {
            let This = this;
            This.rejectement.receiptsId = This.inspectionItem.code;
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/submitapproval",
                contentType: 'application/json',
                data: JSON.stringify(This.rejectement),
                dataType: "json",
                success: function(data) {
                    //data:响应数据，This.inspectionItem.testItemStatus：对应状态属性，"bh"：驳回对应数据字典value值，"zc"：暂存对应数据字典value值
                    This.rejectInfoHandler(data,"bh","zc");

                    This.$refs.my_log.reload();
                },
                error: function(err){
                    layer.alert("服务器出错");
                }
            })
        },
        rejectInfoHandler(data,statusOne,statusTwo){
            let This = this;
            if(data.code === "100100") {
                layer.alert("驳回成功");
                This.inspectionItem.testItemStatus = statusOne;
                if(data.data.approvalStatus === -2){
                    This.inspectionItem.testItemStatus = statusTwo;
                }
                This.rejectement = {receiptsId:'',approvalResult:'0',approvalInfo:''};
                This.convertNumber();
                This.saveMethod();
            }else {
                layer.alert("驳回失败");
            }
        },*/
        saveMethod(){
            let This = this;
            let url = "";
            if(This.inspectionItem.code === ""){
                url = contextPath+"/testItemController/saveToExistCode";
            }else{
                url = contextPath+"/testItemController/updateToExistCode";
            }
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                data: JSON.stringify(This.inspectionItem),
                dataType: "json",
                success: function(data) {
                    //调用初始化方法
                    This.initItem(2);
                    // console.log("修改成功");
                    This.$Modal.success({
                        title: '提示信息',
                        content: '修改成功!'
                    });
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试!'
                    });
                }
            })
        },
        //列表
        list(){
            window.parent.activeEvent({name: '检验项目', url: contextPath+'/quality/quality/inspection-item-list.html'})
        },
        //附件
        attachment(){

        },
        //返回至列表页
        back(){

            let This = this;
            //let $param = window.parent.params;

            if(!$.isEmptyObject(This.params)){

                if(This.params.params.type === 0){
                    window.parent.closeCurrentTab({name:'新增检验项目',exit: true, openTime:this.openTime});
                }
                if(This.params.params.type === 1){
                    window.parent.closeCurrentTab({name:'修改检验项目',exit: true, openTime:this.openTime});
                }
                if(This.params.params.type === 2){
                    window.parent.closeCurrentTab({name:'查看检验项目',exit: true, openTime:this.openTime});
                }
            }
        },
        //校验抽检比例小于100
        underNumber(val,index){
            if(Number(val)>100){
                this.inspectionItem.samplePlanEntities[index].randomTestProportion = 100;
            }
        },

        //增加行
        addOneRow() {
            if (this.inspectionItem.samplePlanEntities.length < 1) {
                this.inspectionItem.samplePlanEntities.push(
                    { isChecked: false, amount: "", randomTestProportion: "", allowNumber: "", rejectNumber: "" }
                )
            } else {
                var obj = this.inspectionItem.samplePlanEntities[this.inspectionItem.samplePlanEntities.length - 1];
                if(obj.allowNumber ==='' || obj.amount === '' || obj.randomTestProportion === '' || obj.rejectNumber === ''){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '请完善该行所有信息后，再新增行！'
                    });
                    return;
                }
                this.inspectionItem.samplePlanEntities.push(
                    { isChecked: false, amount: "", randomTestProportion: "", allowNumber: "", rejectNumber: "" }
                );
                this.isCheckedAll = false;
            }
        },

        //判断有没有勾选数据、
        isSelected(){
            if (this.lotData.length<1){
                this.$Modal.info({
                    title: '提示信息',
                    content: '当前没有勾选任何数据，请重新选择！'
                });
            }
        },
        //清空勾选数据
        clearlotData(){
            this.lotData = [];
        },
        //复制行
        copyOneRow() {
            //获取该行所选数据
            if (this.lotData.length < 1) {
                //用户没有选数据
                this.$Modal.info({
                    title: '提示信息',
                    content: '当前没有勾选任何数据，请重新选择！'
                });
            } else if (this.lotData.length > 1) {
                //用户选择了多条数据
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据，请重新选择！'
                });

            } else {
                //用户只选了一条数据
                //判断勾选的该数据是否为空
                var object = this.lotData[this.lotData.length - 1];
                console.log(object);
                if(object.allowNumber ==='' || object.amount === '' || object.randomTestProportion === '' || object.rejectNumber === ''){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '请完善该行所有信息后，再复制行'
                    });
                    return;
                }
                //如果勾选的是第一行

                if (this.checkindex[0] === 0){
                    var copyData = Object.assign({}, this.lotData[0]);
                    copyData.isChecked = false;
                    this.isCheckedAll = false;
                    copyData.id = '';
                    inspectionItemVm.inspectionItem.samplePlanEntities.push(copyData);
                }else{
                    var copyData = Object.assign({}, this.lotData[0]);
                    copyData.isChecked = false;
                    copyData.id = '';
                    inspectionItemVm.inspectionItem.samplePlanEntities.push(copyData);
                }
                // console.log(inspectionItemVm.inspectionItem.samplePlanEntities);
                // console.log(this.lotData);
                // console.log(this.checkindex);
            }
        },
        //删除行（新增页面）
        DeleteOneRow() {
            if (this.lotData.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '当前没有勾选任何数据，请重新选择！'
                });
            } else {
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '是否要删除这些记录？',
                    onOk: () => {
                        // console.log('点击了确定');
                        var indexArray = this.checkindex;
                        indexArray.sort();
                        for (var k = indexArray.length - 1; k >= 0; k--) {
                            this.inspectionItem.samplePlanEntities.splice(indexArray[k], 1);
                        }
                        this.checkindex = [];
                        this.lotData = [];
                    },
                    onCancel: () => {
                        // console.log('点击了取消');
                    }
                })
            }
        },
        //设置列
        setColumns(){

        },
        //提交后表单值初始化
        itemListInit(){
            this.inspectionItem = {
                id:0,
                groupId:1,
                name:'',
                importantFlag: false,
                inspectStandard:1,
                testItemStatus:'zc',
                productId:'',
                productName:'',
                unitId:'',
                unitName:'',
                testMethodId:"",
                code:'',
                bugRankId:'',
                bugRankName:'',
                testInstrumentId:'',
                testInstrumentName:'',
                testBasisId:'',
                testBasisName:'',
                analyseMethod:'',
                goalValue:'',
                upperCommonDifference:'',
                qualityStandardStatus:'',
                upperLimitValue:'',
                lowerCommonDifferent:'',
                compareSymbol:'',
                lowerLimitValue:'',
                sampleType:'abfbcy',
                samplePlanEntities:[],
                createId:'',
                createName:'',
                createTime:'',
                updateId:'',
                updateName:'',
                updateTime:'',
                examineVerifyId:'',
                examineVerifyName:'',
                examineVerifyTime:''
            }
        },
        /*//上公差改变  上限值 = 目标值 + 上公差;
        uDiffVali(value){

            if(this.numberOnly(value)){
                console.log(value)
                if (value !=='' && this.inspectionItem.goalValue !==''){
                    this.inspectionItem.upperLimitValue = parseFloat(this.inspectionItem.goalValue) + Number(value);
                    console.log(this.inspectionItem.upperCommonDifference)
                }
            }

        },
        //上限值变化  上公差 = 上限值 - 目标值
        uLimitVali(value){
            if(this.numberOnly(value)){
                console.log(value);

                if (value !=='' && this.inspectionItem.goalValue !=='' ){
                    this.inspectionItem.upperCommonDifference = Number(value) -parseFloat(this.inspectionItem.goalValue);
                }
            }

        },

        //下限值变化  下公差=下限值-目标值
        lLimitVali(value){
            if(this.numberOnly(value)){
                if (value !=='' && this.inspectionItem.goalValue !=='' ){
                    // this.inspectionItem.lowerLimitValue = '';
                    this.inspectionItem.lowerCommonDifferent =Number(value) - parseFloat(this.inspectionItem.goalValue);
                }
            }

        },
        //下公差变化  下限值=下公差+目标值
        lDiffVali(value){
            if(this.numberOnly(value)){
                if (value !=='' && this.inspectionItem.goalValue !==''){
                    // this.inspectionItem.lowerCommonDifferent = '';
                    this.inspectionItem.lowerLimitValue = parseFloat(this.inspectionItem.goalValue) + Number(value);
                }
            }

        },*/
        //只允许输入数字
        numberOnly(v){
            if(this.inspectionItem.analyseMethod === 'dlfx'){
                // if(this.inspectionItem.compareSymbol ==='dy' || this.inspectionItem.compareSymbol === 'between'){
                //只能输入数字
                if(isNaN(v)){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '请输入合法数字！'
                    });
                    if (v === this.inspectionItem.goalValue){
                        this.inspectionItem.goalValue = '';
                    }else if (v === this.inspectionItem.upperLimitValue){
                        this.inspectionItem.upperLimitValue = '';
                    }else if (v === this.inspectionItem.lowerLimitValue){
                        this.inspectionItem.lowerLimitValue = '';
                    }else if(v === this.inspectionItem.upperCommonDifference){
                        this.inspectionItem.upperCommonDifference = '';
                    }else {
                        this.inspectionItem.lowerCommonDifferent = '';
                    }
                    return false;
                }else{
                    return true;
                }
            }
        },
        //上下限，上下公差状态初始化
        statusInit(){
            this.isbet = false;
            this.isDxfx = false;
            this.isQtfx = false;
            this.upperLimitDisable = false;
            this.lowerLimitDisable = false;
            this.upperCommDiffDisable = false;
            this.lowerCommDiffDisable = false;
            this.inspectionItem.goalValue = '';
            this.inspectionItem.upperLimitValue = '';
            this.inspectionItem.lowerLimitValue = '';
            this.inspectionItem.lowerCommonDifferent = '';
            this.inspectionItem.upperCommonDifference = '';
        },
        symboleEdit(val){
            if( typeof(val) == "undefined")  return;

            if(val === 'dy'){
                // console.log('选择了等于');
                this.statusInit();
                this.inspectionItem.compareSymbol = val;
                this.isDxfx = false;
                this.upperLimitDisable = false;
                this.lowerLimitDisable = false;
                this.upperCommDiffDisable = false;
                this.lowerCommDiffDisable = false;

            }else if(val === 'between'){
                // console.log('选择了between');
                this.statusInit();
                this.inspectionItem.compareSymbol = val;
                this.isbet = true;
                this.upperCommDiffDisable = true;
                this.lowerCommDiffDisable = true;
            }else if(!(val === 'dy' && val === 'between')){
                this.statusInit();
                this.inspectionItem.compareSymbol = val;
                this.upperLimitDisable = true;
                this.lowerLimitDisable = true;
                this.upperCommDiffDisable = true;
                this.lowerCommDiffDisable = true;
            }
        },
        editControl(){
            if(this.inspectionItem.analyseMethod === 'dxfx'){
                this.statusInit();
                this.inspectionItem.compareSymbol = 'dy';
                this.isDxfx = true;
                this.isQtfx = true;
                this.upperLimitDisable = true;
                this.lowerLimitDisable = true;
                this.upperCommDiffDisable = true;
                this.lowerCommDiffDisable = true;
            }else if(this.inspectionItem.analyseMethod === 'dlfx'){
                // console.log('定量分析');
                this.statusInit();
                this.symboleEdit();
            }else if(this.inspectionItem.analyseMethod === 'qtfxff'){
                // console.log('其他分析方法');
                this.statusInit();
                this.inspectionItem.compareSymbol = 'dy';
                this.isQtfx = true;
                this.upperCommDiffDisable = true;
                this.lowerCommDiffDisable = true;
            }
        },
        echoCtrl(val){
            if(this.inspectionItem.analyseMethod === 'dxfx'){
                this.inspectionItem.compareSymbol = 'dy';
                this.isDxfx = true;
                this.isQtfx = true;
                this.upperLimitDisable = true;
                this.lowerLimitDisable = true;
                this.upperCommDiffDisable = true;
                this.lowerCommDiffDisable = true;
            }else if(this.inspectionItem.analyseMethod === 'dlfx'){
                // console.log('定量分析');
                if( typeof(val) == "undefined")  return;
                this.isQtfx = false;
                if(val === 'dy'){
                    // console.log('选择了等于');
                    this.inspectionItem.compareSymbol = val;
                    this.isDxfx = false;
                    this.isbet = false;
                    this.upperLimitDisable = false;
                    this.lowerLimitDisable = false;
                    this.upperCommDiffDisable = false;
                    this.lowerCommDiffDisable = false;
                }else if(val === 'between'){
                    // console.log('选择了between');
                    this.inspectionItem.compareSymbol = val;
                    this.isDxfx = false;
                    this.isbet = true;
                    this.upperCommDiffDisable = true;
                    this.lowerCommDiffDisable = true;
                    this.upperLimitDisable = false;
                    this.lowerLimitDisable = false;
                }else if(!(val === 'dy' && val === 'between')){
                    this.inspectionItem.compareSymbol = val;
                    this.isDxfx = false;
                    this.isbet = false;
                    this.upperLimitDisable = true;
                    this.lowerLimitDisable = true;
                    this.upperCommDiffDisable = true;
                    this.lowerCommDiffDisable = true;
                }
            }else if(this.inspectionItem.analyseMethod === 'qtfxff'){
                // console.log('其他分析方法');
                this.inspectionItem.compareSymbol = 'dy';
                this.isQtfx = true;
                this.isDxfx = false;
                this.isbet = false;
                this.upperCommDiffDisable = true;
                this.lowerCommDiffDisable = true;
                this.upperLimitDisable = false;
                this.lowerLimitDisable = false;
            }
        },
        initItem(mark){
            let This = this;
            let $param = This.params;
            let obj = {"ifQueryUser":1};
            if(!$.isEmptyObject($param)){
                if($param.params.type === 0){
                    if($param.params.prop === "copy"){
                        obj = {"id":$param.params.data};
                        if(mark && (mark === 1 || mark === 2 || mark === 3)){
                            obj = {"id":This.inspectionItem.id};
                        }
                    }else{
                        if($param.params.type === 0 && !This.inspectionItem.code){
                            This.getOrgan();
                            return false;
                        }
                        obj = {"code":This.inspectionItem.code};
                        /*obj = {"ifQueryUser":1,"testItemStatus":$param.params.data};
                        if(This.inspectionItem.code){
                            obj = {"code":This.inspectionItem.code};
                        }*/
                    }
                }
                if($param.params.type === 1){
                    obj = {"id":$param.params.data};
                }
                if($param.params.type === 2){
                    obj = {"code":$param.params.data};
                }
            }
            $.ajax({
                type: "POST",
                url: contextPath+"/testItemController/getTestItem",
                data: JSON.stringify(obj),
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    This.$nextTick(()=>{
                        This.initHandler(data,$param,mark);
                    });

                },
                error: function(err){
                    // layer.alert("服务器出错");
                    This.$Modal.info({
                        title:'提示信息',
                        content:'服务器出错，请稍后再试！'
                    })
                }
            })
        },
        initHandler(data,$param,mark){
            let This = this;
            This.getOrgan();
            //This.inspectionItem.groupId = window.parent.userInfo.organId;
            //This.inspectionItem.groupName = window.parent.userInfo.orgName;
            if(data.data && data.data.id){

                if(data.data.importantFlag && data.data.importantFlag === 1){
                    data.data.importantFlag = true;
                } else {
                    data.data.importantFlag = false;
                }
                if($param.params.prop === "copy" && mark !== 1 && mark !== 2 && mark !== 3){
                    data.data.testItemStatus = "zc";
                    data.data.code = "";
                    data.data.id = "";
                    data.data.createName = "";
                    data.data.createTime = "";
                    data.data.updateName = "";
                    data.data.updateTime = "";
                    if(data.data.samplePlanEntities && !data.data.samplePlanEntities[0].id){
                        This.inspectionItem.samplePlanEntities = [];
                    }else {
                        for (let i = 0; i < data.data.samplePlanEntities.length; i++) {
                            data.data.samplePlanEntities[i].id = "";
                        }
                    }
                }
                if(!data.data.sysFile){
                    data.data.sysFile = This.inspectionItem.sysFile;
                }
                if(!data.data.samplePlanEntities){
                    data.data.samplePlanEntities = [];
                }
                This.inspectionItem = data.data;
                if(data.data.sysFile && !data.data.sysFile.fileDetails){
                    This.inspectionItem.sysFile.fileDetails = [];
                }
                This.inspectionItem.sysFile.fileType = 5;

                if($param.params.prop !== "copy" && data.data.samplePlanEntities && !data.data.samplePlanEntities[0].id){
                    This.inspectionItem.samplePlanEntities = [];
                }
                if(data.data.analyseMethod === "dxfx"){
                    This.inspectionItem.goalValue = Number(data.data.goalValue);
                }
                This.echoCtrl(This.inspectionItem.compareSymbol);
                if(data.data.groupId === window.parent.userInfo.organId){
                    This.inspectionItem.groupName = window.parent.userInfo.orgName;
                    This.inspectionItem.groupId = window.parent.userInfo.organId;
                }
                //已审核时显示图标
                if(data.data.testItemStatus === "jyysh"){
                    This.isStampShow = true;
                }else{
                    This.isStampShow = false;
                }
                if(data.data.testItemStatus === "zc"){
                    This.changeFrame = false;
                    //This.isbet = false;
                    This.showMenu = true;
                    This.uploadBtn = true;
                    This.deleteBtn = true;
                }
                if((data.data.testItemStatus && data.data.testItemStatus !== "zc") || $param.params.type === 2){
                    This.changeFrame = true;
                    This.isbet = true;
                    This.upperCommDiffDisable = true;
                    This.upperLimitDisable = true;
                    This.lowerCommDiffDisable = true;
                    This.isQtfx = true;
                    This.lowerLimitDisable = true;
                    This.uploadBtn = false;
                    This.deleteBtn = false;
                    This.showMenu = false;
                }
                if($param.params.type === 2){
                    This.showAdd = false;
                    This.showSave = false;
                    This.showSubmit = false;
                    This.showApproval = false;
                    This.showReject = false;
                    This.showAttachment = false;
                    This.uploadBtn = false;
                    This.deleteBtn = false;
                }
                if($param.params.prop === "copy" && mark !== 1 && mark !== 2 && mark !== 3){
                    return false;
                }
                //This.initApproval();
            }
        },
        /*initApproval(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/testItemController/queryProcessByReceiptsId',
                data:{receiptsId:This.inspectionItem.code},
                dataType: "json",
                success: function (data) {

                    if($.isEmptyObject(data.data)){
                        console.log("没有流程");
                        /!*if(This.inspectionItem.testItemStatus === "bh"){
                            This.changeFrame = false;
                            This.isbet = false;
                            This.upperCommDiffDisable = false;
                            This.upperLimitDisable = false;
                            This.lowerCommDiffDisable = false;
                            This.isQtfx = false;
                            This.lowerLimitDisable = false;
                            This.showMenu = true;
                        }*!/
                        return false;
                    }
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
                    alert('服务器出错啦');
                }
            })
        },*/
        goalValueBlur(event){
            console.log(event.target.value)
            let This = this;
            if(This.numberOnly(event.target.value)){
                This.inspectionItem.goalValue = event.target.value;
            }
        },
        uploadfile() {

            let _this = this;
            this.showUpload = true;

        },
        //下载附件
        download(item) {

            // if (typeof url == 'object' && url instanceof Blob) {
            //     url = URL.createObjectURL(url); // 创建blob地址
            // }
            // var aLink = document.createElement('a');
            // aLink.href = url;
            // aLink.download = ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
            // var event;
            // if (window.MouseEvent) event = new MouseEvent('click');
            // else {
            //     event = document.createEvent('MouseEvents');
            //     event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            // }
            // aLink.dispatchEvent(event);
            // $.ajax({
            //     url:contextPath+'/supplier/download',
            //     method:'post',
            //     data:JSON.stringify(item),
            //     dataType:'json',
            //     contentType:'application/json;charset=utf-8',
            //     success:function (res) {
            //
            //     }
            // });
            if(!item.fdUrl){
                // layer.alert("文件地址为空!请先上传文件!");
                this.$Modal.info({
                    title:'提示信息',
                    content:'文件地址为空!请先上传文件!'
                })
                return false;
            }
            let paramsArray =[];
            Object.keys(item).map(key => {
                if(item[key]){
                    paramsArray.push(key + '=' + item[key]);
                }
            })
            //Object.keys(item).forEach(key => paramsArray.push(key + '=' + item[key]));
            let url=contextPath+'/testItemController/download?'+ paramsArray.join('&');
            console.log(url);
            location.href=encodeURI(url);
        },
        //tab4删除单个文件信息
        delFile(item) {
            // layer.confirm('是否要删除这条信息!', {
            //
            //         btn: ['确定', '取消']
            //     }, function () {
            //         //这里先根据数据有没有id 来判断是原有的还是新增的
            //         item.del = true;
            //         layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
            //     }
            // );
            this.$Modal.confirm({
                title:'提示信息',
                content:'是否要删除这些信息？',
                onOk:()=>{
                        item.del = true;
                    }
            })
        },
        modalOk() {
            this.showUpload = false;
        },
        modalCancel() {

        },
        handleSuccess(res) {
            let This = this;
            if (res.code === "100100") {
                This.addAttachment(res.data[0]);
            } else {
                // layer.alert("上传失败");
                this.$Modal.info({
                    title:'提示信息',
                    content:'上传失败!'
                })
            }
        },
        handleFormatError(file) {
            this.$Notice.info({
                title: '文件格式异常!',
                desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
            });
        },
        handleMaxSize(file) {
            this.$Notice.info({
                title: '文件大小超出限制!',
                desc: '【'+file.name + '】的大小超过2M'
            });
        },
        handleBeforeUpload() {
            // const check = this.uploadList.length < 5;
            // if (!check) {
            //     this.$Notice.warning({
            //         title: 'Up to five pictures can be uploaded.'
            //     });
            // }
            // return check;
        },
        addAttachment: function (res) {
            let This = this;
            var attachment = {
                fdName: res.fdName,
                fdSize: parseFloat(res.fdSize).toFixed(2) + "kb",
                uploadTime: res.uploadTime,
                uploadUser: res.uploadUser,
                fdUrl: res.fdUrl,
                fdType: 5,
                del:false,
            };
            This.inspectionItem.sysFile.fileDetails.push(attachment);
        },
        //获取组织id和组织name
        getOrgan() {
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/testItemController/getOrgName',
                dataType: "json",
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.inspectionItem.groupId = data.data.id;
                        This.inspectionItem.groupName = data.data.name;
                        This.$forceUpdate();
                    }else if ('-1' === data.code){
                        This.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试!',
                        });
                        return false;
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    // alert('服务器出错，请稍后再试！');
                    This.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试!',
                    });
                }
            })
        }
    },
    created() {
        let This = this;
        let $param = window.parent.params;
        This.params = $param;
        if(This.params.params.id!=undefined){
            this.body = {
                id: This.params.params.id
            }
            this.record_url=contextPath+'/testItemController/queryOperationLog?id='+this.body.id
        }
    },
    watch:{
        inspectionItem:{
            handler(){
                if(this.inspectionItem.code){
                    $("#approvalList").jqGrid('clearGridData');
                    $("#approvalList").jqGrid('setGridParam',{postData:{receiptsId:this.inspectionItem.code}}).trigger("reloadGrid");
                }

            },
            deep:true,
        }
    },
    mounted() {
        let This = this;

        //上限值赋值
        $("#upperCommonDifference").blur(function(){
            if(This.numberOnly($("#upperCommonDifference").val())){
                if($("#upperCommonDifference").val().replace(/[^0-9.]/g, '') !== ''){
                    if(($("#upperCommonDifference").val() !== '' && $("#goalValue").val() !== '') && This.inspectionItem.analyseMethod !== "qtfxff"){

                        $("#upperLimitValue").val(
                            Number($("#upperCommonDifference").val()) + Number($("#goalValue").val()));
                        This.inspectionItem.upperLimitValue = $("#upperLimitValue").val();
                    }
                }
            }

        });

        //上公差赋值
        $("#upperLimitValue").blur(function(){
            if(This.numberOnly($("#upperLimitValue").val())) {
                if ($("#upperLimitValue").val().replace(/[^0-9.]/g, '') !== '') {
                    if (($("#upperLimitValue").val() !== '' && $("#goalValue").val() !== '') && This.inspectionItem.analyseMethod !== "qtfxff") {

                        $("#upperCommonDifference").val(
                            Number($("#upperLimitValue").val()) - Number($("#goalValue").val()));
                        This.inspectionItem.upperCommonDifference = $("#upperCommonDifference").val();
                    }
                }
            }
        });

        //下限值赋值
        $("#lowerCommonDifferent").blur(function(){
            if(This.numberOnly($("#lowerCommonDifferent").val())) {
                if (($("#lowerCommonDifferent").val().replace(/[^0-9.]/g, '') !== '') && This.inspectionItem.analyseMethod !== "qtfxff") {
                    if ($("#lowerCommonDifferent").val() !== '' && $("#goalValue").val() !== '') {

                        $("#lowerLimitValue").val(
                            Number($("#lowerCommonDifferent").val()) + Number($("#goalValue").val()));
                        This.inspectionItem.lowerLimitValue = $("#lowerLimitValue").val();
                    }
                }
            }
        });

        //下公差赋值
        $("#lowerLimitValue").blur(function(){
            if(This.numberOnly($("#lowerLimitValue").val())) {
                if (($("#lowerLimitValue").val().replace(/[^0-9.]/g, '') !== '') && This.inspectionItem.analyseMethod !== "qtfxff") {
                    if ($("#lowerLimitValue").val() !== '' && $("#goalValue").val() !== '') {

                        $("#lowerCommonDifferent").val(
                            Number($("#lowerLimitValue").val()) - Number($("#goalValue").val()));
                        This.inspectionItem.lowerCommonDifferent = $("#lowerCommonDifferent").val();
                    }
                }
            }
        });

        this.openTime = window.parent.params.openTime;

        // $('form').validate();

        //检验方法
        $.ajax({
            type: "POST",
            url: contextPath+"/baseDataController/listBean?datatypeId=2",
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                inspectionItemVm.testMethodList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })
        //检验依据
        $.ajax({
            type: "POST",
            url: contextPath+"/baseDataController/listBean?datatypeId=3",
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                inspectionItemVm.standardList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })
        //检验仪器
        $.ajax({
            type: "POST",
            url: contextPath+"/baseDataController/listBean?datatypeId=4",
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                inspectionItemVm.testInstrumentList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })
        //缺陷等级
        $.ajax({
            type: "POST",
            url: contextPath+"/baseDataController/listBean?datatypeId=6",
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                inspectionItemVm.bugRankList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })

        //目标值
        $.ajax({
            type: "POST",
            url: contextPath+"/baseDataController/listBean?datatypeId=7",
            contentType: 'application/json',
            dataType: "json",
            success: function(data) {
                inspectionItemVm.goalValueList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })
        //检验项目状态
        This.itemstatusList = getCodeList("root_zj_jyxm_jyxmzt");

        //分析方法
        This.analyseMethodList = getCodeList("root_zj_jyxm_fxff");

        //状态
        This.statusList = getCodeList("root_zj_jyxm_zt");

        //比较符
        This.operatorList = getCodeList("root_zj_jyxm_bjf");

        //抽样类型
        This.sampleTypeList = getCodeList("root_zj_jyxm_cylx");

        //商品类型
        $.ajax({
            type: "POST",
            url: contextPath+'/testItemController/getProcessType',
            data:{"parentId":1,"isDel":1},
            dataType: "json",
            success: function (data) {
                inspectionItemVm.productList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })

        //单位
        $.ajax({
            type: "POST",
            url: contextPath+'/testItemController/getUnit',
            data:{"groupId":1},
            dataType: "json",
            success: function (data) {
                inspectionItemVm.unitList = data.data;
            },
            error: function(err){
                // layer.alert("服务器出错");
                This.$Modal.info({
                    title: '提示信息',
                    content: '服务器出错，请稍后再试!',
                });
            }
        })
        This.inspectionItem.testItemStatus = 'zc';
        This.inspectionItem.qualityStandardStatus = 'hg';
        This.inspectionItem.sampleType = "abfbcy";
        This.initItem();
    }
})