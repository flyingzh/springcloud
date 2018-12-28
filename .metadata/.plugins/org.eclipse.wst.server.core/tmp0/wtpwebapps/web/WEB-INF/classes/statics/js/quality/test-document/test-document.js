var testDocumentVm = new Vue({
    el: '#imcomingReport',
    data() {
        return {
            openTime:'',
            isLook:true,
            isEdit: false,
            reload: false,
            isHide:true,
            isSearchHide: true,
            isTabulationHide: true,
            showSourceModal: false,
            testMessagePane: 'first',
            showHighSearch: false,
            resultSelectedIndex: 1,
            showDepartment: false,
            otherSearch:[],
            styleResultArray: [],
            sendTestPeoples:[],
            testEmps:[],
            //显示进销存单号
            upstreamSourceCode:'',
            testWayDisabled:false,
            canInput: true,//根据抽检方式不同，判断抽检比例及抽检结果是否可编辑
            body:{
                report_type: '',
                report_code: '',
                date_start: '',
                date_end: ''
            },
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            imcoming: {
                tQcTestDocumentEntity:{
                    sourceDocumentType: '',
                    sourceDocumentCode: '',
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
                    // testOrganizationId:'',
                    testOrganizationName: '',
                    testDepartmentName: '',
                    inspectorId: '',
                    testFinishTime : '',
                    unqualifiedTotalAmount: '',
                    totalTestConclusion: '',
                    supplierOrCustomerCode:'',
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
            },
            testWays:[],
            testStatusArr:[],
            testResultArr:[],
            sourceTypeArr:[],
            data_config:{
                url: '',
                colNames : [ '单据编号', '单据类型', '单据日期','单据状态', '质检员','源单类型','源单单号','送检时间', '质检完成时间', '商品类型','检验总数量', '合格数','不合格数','合格率','检验结果'],
                colModel : [
                    {name : 'documentCode',index : 'id',width : 200, align: "center",
                        formatter: function (value, grid, rows, state) {
                            /*let content = '';
                            rows.cell.map((item)=>{
                                content += ('<div>' + item.name + '</div>')
                            });
                            console.log(content)*/
                            return 222;
                        }},
                    {name : 'documentType ',width : 80,align : "center"},
                    {name : 'createTime',width : 80,align : "center"},
                    {name : 'documentStatus',width : 80,align : "center", key: true},
                    {name : 'inspectorName',width : 150,sortable : false},
                    {name : 'sourceDocumentType',width : 80,align : "center"},
                    {name : 'sourceDocumentCode',width : 150,sortable : false, align : "center"},
                    {name : 'sendTestTime',width : 150,sortable : false, align : "center"},
                    {name : 'testFinishTime',width : 150,sortable : false, align : "center"},
                    {name : 'productTypeName',width : 150,sortable : false, align : "center"},
                    {name : 'testTotalAmount',width : 150,sortable : false, align : "center"},
                    {name : 'qualifiedTotalAmount',width : 150,sortable : false, align : "center"},
                    {name : 'unqualifiedTotalAmount',width : 150,sortable : false, align : "center"},
                    {name : 'qualifiedPercent',width : 150,sortable : false, align : "center"},
                    {name : 'testResult',width : 150,sortable : false, align : "center"}
                ]
            },
            data_config_approval: {
                url: contextPath+'/testDocument/queryReceiptsById',
                colNames : [ '流程节点', '开始级次','目的级次','审批人','审批意见','审批时间'],
                colModel : [
                    {
                        name : 'approvalResult',
                        index : 'lotSize',
                        width : 215,
                        align : "center",
                        formatter: function (value, grid, rows, state) {

                            return value == 1 ? "审核通过": "驳回";
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
                // postData:{receiptsId:''},
                multiselect: false,
                shrinkToFit: false,
                mtype : "POST",//向后台请求数据的ajax的类型。可选post,get
                contentType: 'application/json',
                datatype : "json",//请求数据返回的类型。可选json,xml,txt
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
            currentStep: '',
            nextStep: '',
            //页面传参
            documentCode:'',
            //已审核的印章显示
            isStampShow:false,
            fileDetails:[],
        }
    },
    methods: {
        //下载附件
        download(item) {
            if (!item.fdUrl) {
                layer.alert("文件地址为空!请先上传文件!");
                return false;
            }
            let paramsArray = [];
            Object.keys(item).forEach(key => paramsArray.push(key + '=' + item[key]));
            let url = contextPath + '/testDocument/download?' + paramsArray.join('&');
            location.href = encodeURI(url);
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
                    console.log("服务器出错");
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
                 console.log(res)
                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        save(params){
            console.log($("form").valid());
            let type = {type: params};

            let This = this;
            let data;
            data = Object.assign({}, This.imcoming, {tqcStyleTestInfoVo: This.styleResultArray}, type);
            console.log(data)
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/save",
                contentType: 'application/json',
                dataType: "json",
                data:JSON.stringify(data),
                success: function(res) {
                    if(res.code == -1)
                    {
                        alert(res.msg)
                    }
                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        exit(){
            // let This = this;
            // let $param = window.parent.params.params;
            // console.log($.param)
            // if(!$.isEmptyObject($param)){
            //         if($param.type == 1){
            //             window.parent.closeCurrentTab({name:'查看检验单',openTime:this.openTime});
            //         }
            //         if($param.type == 2){
            //             window.parent.closeCurrentTab({name:'修改检验单',openTime:this.openTime});
            //         }

            window.parent.closeCurrentTab({openTime:this.openTime,exit:true});
        },
        doSelectSource(){
            this.showSourceModal = !this.showSourceModal;
        },
        closeSourceModal(){
            this.showSourceModal = false;
            let This = this
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/selectSource",
                contentType: 'application/json',
                dataType: "json",
                data:JSON.stringify( This.imcoming),
                success: function(res) {
                    if(res.code === '100100'){
                        This.imcoming.tQcTestDocumentEntity = res.data.tQcTestDocumentEntity;
                        This.styleResultArray = res.data.tqcStyleTestInfoVo;
                        This.reInitStyleResult();
                    }
                },
                error: function(err){
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        add(){
            this.isEdit = true;
            this.isLook = false;
        },
        testWayChange(value){
            if(value === 'qj'){
                this.canInput = false;
                this.imcoming.styleInput.styleTestItems.map((item)=>{
                    item.randomTestProportion = '100%';
                })

            }else if(value === 'mj'){
                this.canInput = false;
                this.imcoming.styleInput.styleTestItems.map((item)=>{
                    item.testResult = '合格';
                    item.randomTestProportion = '0%';
                    item.sampleAmount = 0;
                    item.sampleUnqualifiedAmount = 0;
                    item.sampleQualifiedAmount = item.testValue;
                })
            }else if(value === 'cj'){
                this.canInput = true;
            }
        },
        refresh(){

        },
        submit(){


        },
        showList(){

        },
        addAttachment(){

        },
        DeleteOneRow(){

        },
        setColumns(){

        },
        toProductDetail(){

        },
        initApproval(code){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/testDocument/queryProcessByReceiptsId',
                data:{receiptsId:code},
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
                    This.documentCode=code;
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },
        initDetailData(){
            let This = this;
            let documentCode = window.parent.params.params.code;
            console.log('upstreamSourceCode',window.parent.params);
            //回显进销存单号
            this.upstreamSourceCode = window.parent.params.params.scode;
            let sendUrl = contextPath+"/testDocument/infoByDocumentCode/"+documentCode
            $.ajax({
                type: "GET",
                url: sendUrl,
                contentType: 'application/json',
                dataType: "json",
                success: function(res) {
                    res.data.tQcTestDocumentEntity.documentTime = new Date(res.data.tQcTestDocumentEntity.documentTime).format("yyyy-MM-dd");
                    This.imcoming.tQcTestDocumentEntity = res.data.tQcTestDocumentEntity;
                    if(!res.data.tQcTestDocumentEntity.sysFile){
                       This.fileDetails = [];
                    }else {
                        This.fileDetails = res.data.tQcTestDocumentEntity.sysFile.fileDetails;
                    }
                    let testResult = This.imcoming.tQcTestDocumentEntity.testResult;
                    switch (testResult){
                        case "jyjghg":This.imcoming.tQcTestDocumentEntity.testResult="合格";break;
                        case "jyjgtbfx":This.imcoming.tQcTestDocumentEntity.testResult="特别放行";break;
                        case "jyjgbhg":This.imcoming.tQcTestDocumentEntity.testResult="不合格";break;
                    }
                    This.styleResultArray = res.data.tqcStyleTestInfoVo;
                    console.log(333,This.styleResultArray);
                    //回显款式检测信息录入(默认回显第一条)
                    This.imcoming.styleInput = JSON.parse(JSON.stringify(Object.assign({}, {...This.styleResultArray[This.resultSelectedIndex - 1]})));
                    This.imcoming.styleInput.index = This.resultSelectedIndex;
                    console.log(This.imcoming.styleInput);
                    This.initStyleResult();//生成款式汇总列表
                    //初始化审批信息进度条
                    if(This.imcoming.tQcTestDocumentEntity.documentStatus != 'temporary_save'){
                        This.initApproval(documentCode);
                    }
                },
                error: function(err){
                    console.log("服务器出错");
                },
            });
        },
        editTestResult(){//点击编辑
            let temp =this.resultSelectedIndex;//获取当前选中行
            this.testMessagePane = 'first';
            let selectRow = this.styleResultArray[this.resultSelectedIndex-1];
            this.imcoming.styleInput = Object.assign({}, this.imcoming.styleInput, {index: temp}, {...this.styleResultArray[this.resultSelectedIndex - 1]});
            // console.log(temp,this.imcoming.styleInput);
        },
        changeStyleName(name){
            this.testMessagePane = name;
        },
        rowClick(type){//点击上一行，下一行，首行，末行
            console.log(typeof(this.resultSelectedIndex), type)
            if(this.resultSelectedIndex === null){
                return;
            }
            if(type === 'first'){//点击首行
                if(this.resultSelectedIndex == 1){
                    layer.alert('已是第一条');
                    return;
                }
                this.resultSelectedIndex = 1;
                Object.assign(this.imcoming.styleInput, {...this.styleResultArray[this.resultSelectedIndex - 1]});
                this.reInitStyleResult();
            }
            else if(type === 'previous'){//点击上一行
                if(this.resultSelectedIndex == 1){
                    layer.alert('已是第一条');
                    return;
                }
                this.resultSelectedIndex--;
                Object.assign(this.imcoming.styleInput, {...this.styleResultArray[this.resultSelectedIndex - 1]});
                this.reInitStyleResult();
            }
            else if(type === 'next'){//点击下一行
                if(this.resultSelectedIndex == this.styleResultArray.length){
                    layer.alert('已是最后一条');
                    return;
                }
                this.resultSelectedIndex++;
                Object.assign(this.imcoming.styleInput, {...this.styleResultArray[this.resultSelectedIndex - 1]});
                this.reInitStyleResult();
            }
            else if(type === 'last'){//点击末行
                if(this.imcoming.styleInput.index == this.styleResultArray.length){
                    layer.alert('已是最后一条');
                    return;
                }
                this.resultSelectedIndex = this.styleResultArray.length;
                Object.assign(this.imcoming.styleInput, {...this.styleResultArray[this.resultSelectedIndex - 1]});
                this.reInitStyleResult();
            }
            this.imcoming.styleInput.index = this.resultSelectedIndex;
            console.log(this.resultSelectedIndex - 1, this.imcoming.styleInput)
            Object.assign(this.styleResultArray[this.resultSelectedIndex - 1], {...this.imcoming.styleInput});//将编辑的内容存到款式检测结果汇总表
        },
        //鼠标移入移出，商品图片显示隐藏
        hideMirror(name) {
            $(`.select${name} .mirror`).hide()
        },
        showMirror(name) {
            let top = $(`.select${name}`).offset().top - $(document).scrollTop() -65 ;
            console.log($(`.select${name}`).offset().top, $(document).scrollTop())
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
                colNames : [ '检验结果', '结果描述/建议', '图片', '商品编码','商品名称','批号','检验数量','计数单位','总重','计重单位','质检方式', '合格数', '不合格数','合格率', '质检状态'],
                colModel : [
                    {name : 'testResult',index : 'testResult',width : 100, align: "center",formatter: function (value, grid, rows, state) {
                        switch (value){
                            case "jyjghg":return "合格";break;
                            case "jyjgtbfx":return "特别放行";break;
                            case "jyjgbhg":return "不合格";break;
                        }
                    },
                    unformat:function (value, grid, rows){
                        switch (value){
                            case "合格":return "jyjghg";break;
                            case "特别放行":return "jyjgtbfx";break;
                            case "不合格":return "jyjgbhg";break;
                        }
                    }},
                    {name : 'resultDescribeSuggest',index:'resultDescribeSuggest', width : 140,align : "center"},
                    {name : 'sourceDocumentProductStyle.pictureUrl',width : 80,align : "center",formatter: function (cellvalue, options, rowObject) {
                        console.log(cellvalue, options, rowObject);
                        $(document).on('mouseout', '.can', function () {
                            This.hideMirror(parseFloat(options.rowId))
                        });
                        $(document).on('mouseenter', '.select' + parseFloat(options.rowId), function () {
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
                                    <div class="mirror"><img width="180px"  src="${url}"></div>
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
                    // 去掉仓库、库位
                    // {name : 'sourceDocumentProductStyle.repertoryName',width : 80,align : "center"},
                    // {name : 'sourceDocumentProductStyle.repertoryPositionName',width : 80,align : "center"},
                    {name : 'testAmount',width : 80,align : "center"},
                    {name : 'sourceDocumentProductStyle.countingUnit',width : 80,align : "center"},
                    {name : 'sourceDocumentProductStyle.weight',width : 80,align : "center"},
                    {name : 'sourceDocumentProductStyle.weightUnit',width : 80,align : "center"},
                    {name : 'testWay',index : 'testWay',width : 80, align: "center", formatter: function (value, grid, rows, state) {
                       return testDocumentVm.formatterTestWay(value);
                    }},
                    {name : 'qualifiedAmount',width : 80,align : "center"},
                    {name : 'unqualifiedAmount',width : 80,align : "center"},
                    {name : 'qualifiedPercent',width : 80,align : "center",formatter: function (value, grid, rows, state){
                        return value ? parseFloat(value).toFixed(2) + '%' : '';
                    }},
                    {name : 'testStatus',width : 80,align : "center",formatter: function (value, grid, rows, state) {
                        return testDocumentVm.formatterTestStatus(value);
                    }}

                ],
                pager: false,
                autoHeight:true,
                onSelectRow: function (index, status) {
                    console.log(index);
                    This.resultSelectedIndex = (index === "" || index ==="null") ? 1 : index;
                },
                beforeSelectRow(){
                    $("#styleResult_table").jqGrid('resetSelection');
                },
                gridComplete(){
                    var myGrid = $("#styleResult_table");
                    $("#cb_"+myGrid[0].id).hide();
                }
            });

            let length = This.styleResultArray.length;
            for(let i=0;i<length;i++){
                $("#styleResult_table").jqGrid('addRowData',i+1,This.styleResultArray[i]);
                console.log(33)
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
            $.ajax({
                type: "POST",
                url: contextPath+"/codeController/getChildNodesByMark",
                dataType: "json",
                data:{mark:'zj_zjfs'},
                success: function(res) {
                    console.log(res)
                    _this.testWays=[];
                    if(res.code === '100100' && res.data.length > 0){
                        for(let testWay of res.data){
                            _this.testWays.push({name:testWay.name,value:testWay.value});
                        }
                    }


                },
                error: function(err){
                    _this.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        fetchTestStatus(){
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/codeController/getChildNodesByMark",
                dataType: "json",
                data:{mark:'zj_zhijianzhuangtai'},
                success: function(res) {
                    console.log(res)
                    _this.testStatusArr=[];
                    if(res.code === '100100' && res.data.length > 0){
                        for(let testStatus of res.data){
                            _this.testStatusArr.push({name:testStatus.name,value:testStatus.value});
                        }
                    }


                },
                error: function(err){
                    _this.$Spin.hide();
                    console.log("服务器出错");
                },
            });
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
                    console.log(data);
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
            $.ajax({
                type: "POST",
                url: contextPath+"/codeController/getChildNodesByMark",
                dataType: "json",
                data:{mark:'zj_jyjg'},
                success: function(res) {
                    console.log(res)
                    _this.testResultArr=[];
                    if(res.code === '100100' && res.data.length > 0){
                        for(let testResult of res.data){
                            _this.testResultArr.push({name:testResult.name,value:testResult.value});
                        }
                    }


                },
                error: function(err){
                    _this.$Spin.hide();
                    console.log("服务器出错");
                },
            });
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
                    _this.imcoming.tQcTestDocumentEntity.inspectorId='';
                    if(res.code === '100100' && res.data.length > 0){
                        for(let emp of res.data){
                            _this.testEmps.push({label:emp.empName,value:emp.id,code:emp.empCode});
                        }
                    }
                },
                error: function(err){
                    _this.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        addNew(){
            this.sourceCodeDisabled = false;
            this.imcoming = {
                tQcTestDocumentEntity:{
                    id:'',
                    sourceDocumentType: '',
                    sourceDocumentCode: '',
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
                    inspectorId: '',
                    inspectorName:'',
                    testFinishTime : '',
                    unqualifiedTotalAmount: '',
                    totalTestConclusion: '',
                    supplierOrCustomerCode:'',
                    createName:'',
                    createTime:'',
                    updateName:'',
                    updateTime:''
                },
                // sourceCodeDisabled:true,
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
                    styleTestItems:[{
                        allowNumber: 0,
                        randomTestProportion: 0,
                        rejectNumber: 0
                    }]
                }
            };
            this.styleResultArray = [];
            this.reInitStyleResult();
        },
    },

    watch:{
        documentCode(){
            let documentCode = this.documentCode;
            console.log(documentCode);
            if(documentCode){
                let config =Object.assign({},this.data_config_approval,{postData:{receiptsId:documentCode}});
                $("#approvalList").jqGrid('clearGridData');
                
                $("#approvalList").jqGrid(config).trigger("reloadGrid");
            }
        },
        "imcoming.tQcTestDocumentEntity.documentStatus"(){
            if(this.imcoming.tQcTestDocumentEntity.documentStatus === 'auditing'){
                this.isStampShow=true;
            }

        }
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.fetchOrg();
        this.getSendTestPeople();
        this.fetchTestWay();
        this.fetchTestStatus();
        this.fetchTestResult();
        // $('form').validate();
        this.initDetailData();
        this.getSourceType();

        // $("#approvalList").jqGrid(this.data_config_approval);
    },
    computed:{
        percent1(){
            return this.imcoming.tQcTestDocumentEntity.qualifiedPercent ?
                parseFloat(this.imcoming.tQcTestDocumentEntity.qualifiedPercent).toFixed(2) + '%' :"";
        },
        percent2(){
            return this.imcoming.styleInput.qualifiedPercent ?
                parseFloat(this.imcoming.styleInput.qualifiedPercent).toFixed(2) + '%' :"";
        }

    },
    filters:{
        formatRes(val){
            switch (val){
                case "jyjghg":return "合格";break;
                case "jyjgtbfx":return "特别放行";break;
                case "jyjgbhg":return "不合格";break;
                default:return "";

            }
        },
        formatAnalysizeMethod(val){
            switch (val){
                case "dxfx":return "定性分析";break;
                case "dlfx":return "定量分析";break;
                case "qtfx":return "其他分析";break;
                default:return "";

            }
        },
        formatPercent(val){
            if(!val){
               return "";
            }else if(val > 1){
                return parseFloat(val).toFixed(2)+ '%';
            }else if(val <= 1){
                return  (Math.round(parseFloat(val) * 10000)/100).toFixed(2) + '%';
            }

        }
    }
});