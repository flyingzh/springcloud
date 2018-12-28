var vm = new Vue({
    el: '#imcomingReport',
    data() {
        return {
            isLook:true,
            isEdit: false,
            reload: false,
            showSourceModal: false,
            testMessagePane: 'first',
            showHighSearch: false,
            showDepartment: false,
            uploadShow : true,
            resultSelectedIndex: null,
            otherSearch:[],
            styleResultArray: [],
            body:{
                report_type: '',
                report_code: '',
                date_start: '',
                date_end: ''
            },
            testOrgTypeChild:[],
            queryStyleCategoryChild:[],
            testResultChild:[],
            documentStatusChild:'',
            inspectorChild:[],
            //不良原因对象
            badReasonsChild:[],
            productType:'',
            testedOrganizationNameChild: [],
            //商品类型
            commodityCategoty :[],
            productData:[],
            categoryType: [],
            testedOrganizationIdTemp:'',
            productGroupTemp:'',
            //根据抽检方式不同，判断抽检比例及抽检结果是否可编辑
            canInput: true,
            testWayDisabled:false,
            showAll:false,
            showTestedOrganizationId:false,
            showCategoryType:false,

            //单据code
            documentCode:'',
            //退出按钮
            openTime: '',
            //接受页面跳转传输的参数
            params:'',
            treeSetting: {
                callback: {
                    onClick: this.treeClickCallBack,
                    beforeClick: this.treeBeforeClick
                }
            },
            imcoming: {
                tQcTestDocumentEntity:{
                    id:'',
                    testTotalAmount: '',
                    qualifiedPercent: '',
                    documentCode: '',
                    documentType: '',
                    businessType: '',
                    documentTime: (new Date()).format("yyyy-MM-dd") || '',
                    documentStatus: '',
                    qualifiedTotalAmount: '',
                    testResult: '',
                    testedOrganizationName: '',
                    testedOrganizationId: '',
                    testedOrganizationType: '',
                    productTypeName: '',
                    testDepartmentName: '',
                    testDepartmentId: '',
                    inspectorId: '',
                    inspectorName: '',
                    testFinishTime : '',
                    unqualifiedTotalAmount: '',
                    totalTestConclusion: '',
                    supplierOrCustomerCode:'',
                    organizationId:'',
                    //根据这个商品类型去查询检验项目,第二级商品id
                    secondProductTypeId:'',
                    //其他
                    createName:'',
                    createTime :'',
                    updateName:'',
                    updateTime:'',
                    examineVerifyName:'',
                    examineVerifyTime:'',
                    productGroup:[],
                    correctPreventId:'',
                    testReportId:'',
                    sysFile:{
                        fileDetails:[]
                    },
                },
                tqcStyleTestInfoVo:{
                    id:'',
                    index:'',
                    //商品款式id
                    productStyleId:'',
                    //商品类型id
                    productTypeId:'',
                    //商品编码
                    productCode:'',
                    //检验单id
                    testDocumentId:'',
                    //质检状态
                    testStatus:'',
                    //质检方式
                    testWay: '',
                    //合格数
                    qualifiedAmount: '',
                    //检验数量
                    testAmount: '',
                    //合格率
                    qualifiedPercent: '',
                    //不合格数
                    unqualifiedAmount: '',
                    //检验结果
                    testResult: '',
                    //结果描述/建议
                    resultDescribeSuggest: '',
                    hasSourceTestWay:0,
                    name: '',
                    styleTestItems:[]
                },
                styleInput:{}
            },
            testWays:[],
            testStatusArr:[],
            testResultArr:[],

            documentStatusChild: [
                {
                    value: "1",
                    label: "暂存"
                },
                {
                    value: "2",
                    label: "待审核"
                },
                {
                    value: "3",
                    label: "审核中"
                },
                {
                    value: "4",
                    label: "已审核"
                },
                {
                    value: "5",
                    label: "驳回"
                }
            ],
            //审批
            needReload :false,
            //审核图标
            isStampShow:false,
            //必填校验项目（红星）
            ruleValidate:{
                testedOrganizationId: [{required: true}],//被检组织
                inspectorId: [{required: true}],//质检员
                totalTestConclusion: [{required: true}]//整单检验结论
            },
            //审核进度条
            stepList: [],
            modalTrigger:false,
            modalType:'',
            approvalTableData:[],
            treeUrl:contextPath+'/dept/queryDeptByOrganidAll',
            showUpload:false,
        }

    },
    methods: {

        //质检部门回调函数,并获取质检员
        treeClickCallBack(event, treeId, treeNode){
            let This = this;

            //清空质检员下拉框 选中
            This.imcoming.tQcTestDocumentEntity.inspectorId = '';

            if (This.imcoming.tQcTestDocumentEntity.testDepartmentName === treeNode.name) {
                This.imcoming.tQcTestDocumentEntity.testDepartmentName = treeNode.name;
                This.imcoming.tQcTestDocumentEntity.testDepartmentId = treeNode.id;
                This.showDepartment = false;
            }else {
                This.imcoming.tQcTestDocumentEntity.testDepartmentId = treeNode.id;
                This.imcoming.tQcTestDocumentEntity.testDepartmentName = treeNode.name;
                This.inspectorAsk(This.imcoming.tQcTestDocumentEntity.testDepartmentId)
                This.showDepartment = false;
            }
        },
        treeBeforeClick(treeId, treeNode, clickFlag) {
            return !treeNode.isParent && treeNode.depGroupStatus != 0; //当单击父节点，返回false，不让选取
        },
        showDepartmentTree(value){
            if (this.imcoming.tQcTestDocumentEntity.documentStatus != "1" || this.params.activeType === "query"){
                this.showDepartment = true;
            }
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
        //公共的传输数据
        commonTransferData(){
            let This = this;

            if(!This.imcoming.tqcStyleTestInfoVo.styleTestItems){
                return;
            }
            let badReason = {};
            This.badReasonsChild.map((item) =>{
                badReason[item.value.toString()] = item.name;
            });
            This.styleResultArray.map((item, index)=> {
                if (item.styleTestItems) {
                item.styleTestItems.map((data, k) => {
                    data['badReasonName'] = badReason[data.badReasonId];
                    //set 检验项目id
                    let testItemId = data.testItemEntity.id;
                    data['testItemId'] = testItemId;
                })
            }
            });
            //汇总
            for(let i = 0, length = this.styleResultArray.length; i < length; i++){
                let obj = Object.assign({}, {
                    testStatus: "jihua"
                });
                Object.assign(This.styleResultArray[i],{...obj})
            }

            This.productData.map((item, index)=>{
                if (item.id === This.imcoming.tQcTestDocumentEntity.productTypeId){
                    This.imcoming.tQcTestDocumentEntity.productTypeName = item.name;
                }
            });

            //被检组织
            this.testedOrganizationNameChild.map((item,index)=>{
                if(item.id == this.imcoming.tQcTestDocumentEntity.testedOrganizationId){
                    this.imcoming.tQcTestDocumentEntity.testedOrganizationName = item.name;
                }
            });
            //质检员
            this.inspectorChild.forEach((item)=>{
                if(item.id == this.imcoming.tQcTestDocumentEntity.inspectorId){
                    this.imcoming.tQcTestDocumentEntity.inspectorName = item.empName;
                }
            });
        },

        verify(){

            let This = this;
            if (This.imcoming.tQcTestDocumentEntity.documentStatus !== "1") {
                This.$Modal.info({content: "单据状态不为暂存不能进行此操作！", title: "提示", icon: 0})
                return false;
            }
            // if (params === "submit"){
                //非空验证
                // if ($('form').valid() === false){
                //     This.$Modal.info({content: "请输入必填项！", title: "提示", icon: 0})
                //     return false;
                // }

            // }
            //for(let item of This.styleResultArray){
            for (let i = 0; i < This.styleResultArray.length; i++){
                if (!This.styleResultArray[i].testResult){
                    This.$Modal.info({
                        title: '提示信息',
                        content: '款式检测结果汇总列表第 '+ (i + 1) + ' 行的检验结果为空!'
                    })
                    return false;
                }
                if (!This.styleResultArray[i].resultDescribeSuggest){
                    This.$Modal.info({
                        title: '提示信息',
                        content: '款式检测结果汇总列表第 '+ (i + 1) + ' 行的结果描述/建议为空!'
                    })
                    return false;
                }
                if (This.styleResultArray[i].unqualifiedAmount == null || This.styleResultArray[i].unqualifiedAmount == undefined){
                    This.$Modal.info({
                        title: '提示信息',
                        content: '款式检测结果汇总列表第 '+ (i + 1) + ' 行的不合格为空!'
                    })
                    return false;
                }
                if (!This.styleResultArray[i].testWay){
                    This.$Modal.info({
                        title: '提示信息',
                        content: '款式检测结果汇总列表第 '+ (i + 1) + ' 行的质检方式为空!'
                    })
                    return false;
                }
            }
            return true;
        },

        //保存或提交 params：save 保存  params：submit 提交
        save(params){
            let This = this;
            if(params == 'submit'){
                let result;
                this.$refs['formValidate'].validate((valid) => {
                    if (valid) {//验证通过
                        result = true;
                    } else {
                        result = false;
                    }
                })
                if(!result){
                    return;
                }
            }
            //商品编码的数据同步到汇总页签列表中
            if(This.styleResultArray.length>0){//不加判断的话，直接点提交或保存会报错11.23
                if(!This.styleResultArray[parseFloat(This.resultSelectedIndex - 1)].unqualifiedAmount){
                    Object.assign(This.styleResultArray[This.resultSelectedIndex - 1], {...This.imcoming.tqcStyleTestInfoVo});
                    console.log(This.styleResultArray[This.resultSelectedIndex - 1],4341)
                }
                This.reInitStyleResult();
            }
            else{
                this.$Modal.info({
                    title:'提示',
                    content:'该单没有对应的款式检测信息，请重新选择被检组织和商品类型！'
                })
                return;
            }
            //校验
            if (This.verify() === false){
                return false;
            }
            let type = {type: params};
            //单据code为空时新增，不为空则修改
            let data;
            if (!This.imcoming.tQcTestDocumentEntity.id) {
                //设置单据code
                This.imcoming.tQcTestDocumentEntity.documentCode = This.documentCode;
                //设置单据code
                This.receiptsId = This.documentCode;
            }
            //数据转换
            This.commonTransferData();
            data = Object.assign({}, This.imcoming, {tqcStyleTestInfoVo: This.styleResultArray}, type);

            //增加遮罩
            window.top.home.loading('show');
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/save",
                contentType: "application/json;charset=utf-8",
                dataType: "json",
                data: JSON.stringify(data),
                success: function (res) {
                    This.htHaveChange = false;
                    if (res.code == 100100) {
                        //禁止被检组织和商品类型
                        if(This.imcoming.tQcTestDocumentEntity.testedOrganizationName){
                            This.showTestedOrganizationId = true;
                        }
                        if(This.imcoming.tQcTestDocumentEntity.productTypeId) {
                            This.showCategoryType = true;
                        }
                        if(params === "submit") {
                            This.imcoming.tQcTestDocumentEntity.documentStatus = "2";
                            //禁止用户编辑
                            This.BannedClick();
                            This._isEdit('N')
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                        }

                        //回显被检组织类型、单据类型、业务类型 res.data.tQcTestDocumentEntity.documentType
                        This.changeTestOrgType(res.data.tQcTestDocumentEntity.documentType);

                        This.styleResultArray = res.data.tqcStyleTestInfoVo;
                        This.imcoming.tQcTestDocumentEntity = res.data.tQcTestDocumentEntity;

                        This.styleResultArray.map((item)=>{
                            Object.assign(item,{overEdit: true})
                        })
                        console.log(This.styleResultArray,344523)
                        //时间格式化
                        This.imcoming.tQcTestDocumentEntity.documentTime = This.imcoming.tQcTestDocumentEntity.documentTime ? new Date(This.imcoming.tQcTestDocumentEntity.documentTime).format("yyyy-MM-dd"):'';

                        This.changeTestOrgType(res.data.tQcTestDocumentEntity.documentType)
                        This.editTestResult();
                        //保存附件
                        This.saveAccess(This.imcoming.tQcTestDocumentEntity.documentCode,'Q_INVENTORY');
                        This.$forceUpdate();
                        This.$Modal.success({content: "操作成功", title: "提示", icon: 0})
                    }else{
                        This.imcoming.tQcTestDocumentEntity.documentStatus = "1";
                        This.$Modal.warning({content: "操作失败", title: "提示", icon: 0})
                    }

                    window.top.home.loading('hide');
                },
                error: function (err) {
                    This.imcoming.tQcTestDocumentEntity.documentStatus = "1";
                    window.top.home.loading('hide');
                    console.log("服务器出错");
                },
            });
        },

        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        _isEdit:function (isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },

        // 保存附件 保存的时候调用
        saveAccess: function (id,type) {
            eventHub.$emit('saveFile', id,type);
        },

        // 查找附件 查看的时候调用
        getAccess: function (id,type) {
            eventHub.$emit('queryFile', id,type);
        },

        //跳转到基础数据商品页面
        toProductDetail(value){
            window.parent.activeEvent({
                name: '商品',
                url: contextPath +'/base-data/commodity/commodity-info.html',
                params:{id: value.rows.productId, type: 'skip'}
            });
        },

        //跳转到列表页面
        listClick(){
            window.parent.activeEvent({name: this.imcoming.tQcTestDocumentEntity.documentName,
                url: contextPath+'/quality/inventory/test-document-list.html',params: {name:this.imcoming.tQcTestDocumentEntity.documentName}});
        },

        //新增
        add(){
            //跳转新增库存检验单
            window.parent.activeEvent({
                name: "新增"+this.imcoming.tQcTestDocumentEntity.documentName,
                url: contextPath+'/quality/inventory/test-document.html',
                params: {documentType: this.params.documentType, activeType: "add"}
            });
        },

        //根据被检组织类型选项修改单据类型和业务类型
        changeTestOrgType(value){
            console.log("value",value);
            let This = this;
            if(value === "kcjyd"){
                This.imcoming.tQcTestDocumentEntity.testedOrganizationType = "kc";
                This.imcoming.tQcTestDocumentEntity.documentType = "kcjyd";
                This.imcoming.tQcTestDocumentEntity.businessType = "kcjy";

                This.imcoming.tQcTestDocumentEntity.testedOrganizationTypeName = "库存";
                This.imcoming.tQcTestDocumentEntity.documentName = "库存检验单";
                This.imcoming.tQcTestDocumentEntity.businessName = "库存检验";

                return;
            }

            if(value === "mdjyd"){
                This.imcoming.tQcTestDocumentEntity.testedOrganizationType = "md";
                This.imcoming.tQcTestDocumentEntity.documentType = "mdjyd";
                This.imcoming.tQcTestDocumentEntity.businessType = "mdjy";

                This.imcoming.tQcTestDocumentEntity.testedOrganizationTypeName = "门店";
                This.imcoming.tQcTestDocumentEntity.documentName = "门店检验单";
                This.imcoming.tQcTestDocumentEntity.businessName = "门店检验";

                //获取当前组织名称
                $.ajax({
                    type: "POST",
                    url: contextPath+"documentAllController/getOrgName",
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        This.testedOrganizationNameChild = data.data;
                        This.documentCode = data.data[0].documentCode;
                    },
                    error: function (err) {
                        console.log("服务器出错");
                    },
                });
            }
        },

        //根据得到的最后一级商品类型的id去获取第二级id，检验项目需要二级id
        getCommodityTypeId(value){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/queryCategoryIdByInfoId",
                dataType: "json",
                data:{"id":value},
                success: function (res) {
                    This.imcoming.tQcTestDocumentEntity.secondProductTypeId = res.data[0].id;
                    This.resultSelectedIndex = 1;
                    if(This.styleResultArray.length === 0){//没有检验项目的时候需要把页面数据清空还原
                        This.styleResultArray = [];
                        This.reInitStyleResult();
                        This.imcoming.tqcStyleTestInfoVo = {
                            id:'',
                            index:'',
                            //商品款式id
                            productStyleId:'',
                            //商品类型id
                            productTypeId:'',
                            //商品编码
                            productCode:'',
                            //检验单id
                            testDocumentId:'',
                            //质检状态
                            testStatus:'',
                            //质检方式
                            testWay: '',
                            //合格数
                            qualifiedAmount: '',
                            //检验数量
                            testAmount: '',
                            //合格率
                            qualifiedPercent: '',
                            //不合格数
                            unqualifiedAmount: '',
                            //结果描述/建议
                            resultDescribeSuggest: '',
                            hasSourceTestWay:0,
                            name: '',
                            styleTestItems:[]
                        };
                        return;
                    }
                    //生成检验项目
                    This.editTestResult();
                },
                error: function (err) {
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },

        //监听仓库内容改变,根据商品分类id或仓库id查询商品信息（查询仓库）
        changeTestedOrganizationName(){
            let This = this;
            if (!This.testedOrganizationIdTemp) {
                This.testedOrganizationIdTemp = This.imcoming.tQcTestDocumentEntity.testedOrganizationId;
                if (This.imcoming.tQcTestDocumentEntity.productTypeId) {
                    //获取款式检测结果汇总
                    this.getStyleInfoList();
                }
                return false;
            }
            This.$Modal.confirm({
                title: '提示信息',
                content: '修改被检组织会清空下方款式检测信息的所有数据，是否确定修改？',
                onOk: () => {
                    This.testedOrganizationIdTemp = This.imcoming.tQcTestDocumentEntity.testedOrganizationId;
                    if (This.imcoming.tQcTestDocumentEntity.productTypeId) {
                        //获取款式检测结果汇总
                        this.getStyleInfoList();
                    }
                },
                onCancel: () => {
                    This.imcoming.tQcTestDocumentEntity.testedOrganizationId = This.testedOrganizationIdTemp;
                }
            })
        },

        //监听商品类型内容改变,根据商品分类id或仓库id查询商品信息
        changeproductTypeName(selectedData,arr){
            this.htTestChange();
            let This = this;
            if (!This.imcoming.tQcTestDocumentEntity.productTypeId){
                //获取数组id，用于回显
                This.imcoming.tQcTestDocumentEntity.productGroup = selectedData;
                //获取商品id
                This.imcoming.tQcTestDocumentEntity.productTypeId = selectedData[selectedData.length-1];
                //获取商品名称
                This.imcoming.tQcTestDocumentEntity.productTypeName = arr[arr.length-1]['label'];
                This.productGroupTemp = selectedData;
                if (This.imcoming.tQcTestDocumentEntity.testedOrganizationId && This.imcoming.tQcTestDocumentEntity.testedOrganizationId != ""){
                    //获取款式检测结果汇总
                    This.getStyleInfoList();
                }
                return false;
            }
            This.$Modal.confirm({
            title: '提示信息',
            content: '修改被检组织会清空下方款式检测信息的所有数据，是否确定修改？',
            onOk: () => {
                //获取数组id，用于回显
                This.imcoming.tQcTestDocumentEntity.productGroup = selectedData;
                //获取商品id
                This.imcoming.tQcTestDocumentEntity.productTypeId = selectedData[selectedData.length-1];
                //获取商品名称
                This.imcoming.tQcTestDocumentEntity.productTypeName = arr[arr.length-1]['label'];
                This.productGroupTemp = selectedData;
                if (This.imcoming.tQcTestDocumentEntity.testedOrganizationId && This.imcoming.tQcTestDocumentEntity.testedOrganizationId != ""){
                    //获取款式检测结果汇总
                    This.getStyleInfoList();
                }
            },
            onCancel: () => {
                This.imcoming.tQcTestDocumentEntity.productGroup = This.productGroupTemp;
            }
            })
        },

        //获取款式检测结果汇总
        getStyleInfoList(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/queryCollect",
                data:JSON.stringify({"warehouseId":This.imcoming.tQcTestDocumentEntity.testedOrganizationId,"productTypeId":This.imcoming.tQcTestDocumentEntity.productTypeId}),
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    if (res.code == 100100) {
                        This.styleResultArray = res.data;
                        for (let i = 0, length = This.styleResultArray.length; i < length; i++) {
                            let obj = Object.assign({}, {
                                productId : This.styleResultArray[i].productId,
                                productName : This.styleResultArray[i].productName,
                                testWay : This.styleResultArray[i].testWay,
                                countUnit : This.styleResultArray[i].countUnit,
                                weight : This.styleResultArray[i].weight,
                                testAmount : This.styleResultArray[i].testAmount,
                                weightUnit : This.styleResultArray[i].weightUnit,
                                pictureUrl : This.styleResultArray[i].pictureUrl,
                                testResult : 'jyjghg'
                            });
                            //清空商品id
                            This.styleResultArray[i].id = "";
                            Object.assign(This.styleResultArray[i], {...obj})
                        }
                        This.reInitStyleResult();
                        //调用商品类型的第二级id
                        This.getCommodityTypeId(This.imcoming.tQcTestDocumentEntity.productTypeId);
                        This.$forceUpdate();
                    }
                },
                error: function (err) {
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
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
                    _this.badReasonsChild = [];
                    if(res.code === '100100' && res.data.length >0){
                        for(let reason of res.data){
                            _this.badReasonsChild.push({name:reason.name,value:reason.id});
                        }
                    }
                },
                error: function (err) {
                    _this.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },

        initGoodCategory(type) {
            let result = [];

            type.forEach((item) => {
                let {
                    id: value,
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

        //初始化列表加载
        initDetailData(){
            let This = this;
            //This.styleResultArray = res.data.tqcStyleTestInfoVo;
            This.initStyleResult();//生成款式汇总列表
        },

        //单据状态
        documentStatusAsk(){
            //this.documentStatusChild = getCodeList("zj_document_status");
            this.imcoming.tQcTestDocumentEntity.documentStatus = "1"
        },
        //检验结果
        testResultAsk(){

            let data = getCodeList("zj_jyjg")
                for(let reason of data){
                    if(reason.value !== "jyjgtbfx") {
                        console.log("检验结果",data)
                        this.testResultChild.push({name: reason.name, value: reason.value});
                        this.testResultArr.push({name: reason.name, value: reason.value});
                    }
                }
            this.imcoming.tQcTestDocumentEntity.testResult = "jyjghg";
            this.imcoming.tqcStyleTestInfoVo.testResult = 'jyjghg'
        },
        //获取商品类型
        productTypeAsk(value){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/queryStyleCategory?parentId=0",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("商品类型数据：", data)
                        This.productData = data.data.cateLists;
                        This.categoryType = This.initGoodCategory(data.data.cateLists)
                        var arr = new Array();
                        if(value){
                            var val = (value.substring(1,value.length-1)).split(",");
                            for(var index in val){
                                arr.push(Number(val[index]));
                            }
                        }
                        This.$nextTick(()=>{
                            This.imcoming.tQcTestDocumentEntity.productGroup = arr;
                        });
                    }
                },
                error: function (err) {
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        //获取当前组织名称
        getOrgNameAsk(){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/getOrgName",
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log("当前组织",data.data);
                        This.imcoming.tQcTestDocumentEntity.testOrganizationName = data.data[0].name;
                        This.documentCode = data.data[0].documentCode;
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        //质检员
        inspectorAsk(deptId, inspectorId) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/getEmployeesByDeptId?deptId=" + deptId,
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                //This.$nextTick(()=>{
                    This.inspectorChild =  [];
                 // This.inspectorChild = data.data;
                 This.$refs.insp.reset()
                    This.$nextTick(function(){
                        This.inspectorChild = data.data;
                    });
                    //This.imcoming.tQcTestDocumentEntity.inspectorId = inspectorId || '';
                    This.$forceUpdate();
                //})
                    //This.$forceUpdate();
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },
        //仓库
        warehouseAsk(testedOrganizationId){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/listByOrganizationId",
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    This.testedOrganizationNameChild = data.data;
                    console.log("仓库",testedOrganizationId)
                    if (testedOrganizationId) {
                        This.imcoming.tQcTestDocumentEntity.testedOrganizationId = testedOrganizationId;
                    }
                },
                error: function(err){
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        //禁止编辑
        BannedClick(){
            let This = this;
            This.showAll = true;
            This.canInput = false;
            This.showTestedOrganizationId = true;
            This.showCategoryType = true;
            This.testWayDisabled = true;
        },
        //允许编辑
        allowClick(){
            let This = this;
            This.showAll = false;
            This.canInput = true;
            This.showTestedOrganizationId = false;
            This.showCategoryType = false;
            This.testWayDisabled = false;
        },

        //编辑的回调事件
        editTestResult(){
            let temp =this.resultSelectedIndex;
            this.testMessagePane = 'first';

            let selectRow = this.styleResultArray[this.resultSelectedIndex - 1];
            if (!selectRow){
                return false;
            }
            if (selectRow.testWay === 'cj' || selectRow.testWay === 'qj' || selectRow.testWay === 'mj') {
                this.$nextTick(()=>{
                    this.imcoming.tqcStyleTestInfoVo.testWay = selectRow.testWay;
                    this.testWayDisabled = true;
                });
            } else {
                this.testWayDisabled = false;
            }
            this.imcoming.tqcStyleTestInfoVo = Object.assign(this.imcoming.tqcStyleTestInfoVo,{index: temp}, {...this.styleResultArray[this.resultSelectedIndex-1]});
            console.log(this.imcoming.tqcStyleTestInfoVo,11)
            if(this.styleResultArray[this.resultSelectedIndex - 1].overEdit){
                return false;
            }

            let This = this;

            if (This.params.activeType === "add") {
                //查询检验项目列表
                $.ajax({
                    type: "POST",
                    url: contextPath+"/documentAllController/getTestItemByProductId",
                    contentType: 'application/json',
                    dataType: "json",
                    data: JSON.stringify({
                        productId: This.imcoming.tQcTestDocumentEntity.secondProductTypeId,
                        testNum: This.imcoming.tqcStyleTestInfoVo.testAmount
                    }),
                    success: function (data) {
                        if (data.code === '100100') {
                            //当质检方式为抽检时，判断是否有对应的检验项目
                            if(selectRow.testWay === 'cj') {
                                if (data.data.length < 1) {
                                    This.$Modal.warning({content: "请先维护商品编码为 [" + This.imcoming.tqcStyleTestInfoVo.productCode + "] 的对应检验项目", title: "提示", icon: 0})
                                    return;
                                }
                                for (let i = 0; i < data.data.length; i++) {
                                    if (!data.data[i].samplePlanEntity) {
                                        This.$Modal.warning({content: "请先维护 [" + data.data[i].testItemEntity.name + "] 检验项目对应检验数量：" + This.imcoming.tqcStyleTestInfoVo.testAmount + " 的抽检比例 ！", title: "提示", icon: 0})
                                        data.data.showTestTable = false;
                                        return;
                                    }
                                }
                            }
                            data.data.map((item, index) => {
                                let obj = Object.assign({}, {
                                    overEdit: true,
                                    showTestTable: true,
                                    allowNumber: ((item.samplePlanEntity && item.samplePlanEntity.allowNumber) || 0),
                                    randomTestProportion: ((item.samplePlanEntity && item.samplePlanEntity.randomTestProportion) || 0) + "%",
                                    rejectNumber: ((item.samplePlanEntity && item.samplePlanEntity.rejectNumber) || 0),
                                    defaultDomTestProportion: ((item.samplePlanEntity && item.samplePlanEntity.randomTestProportion) || 0) + "%",
                                    sampleAmount: parseInt((Number((item.samplePlanEntity && item.samplePlanEntity.randomTestProportion)) / 100 || 0) * Number(This.imcoming.tqcStyleTestInfoVo.testAmount), 10),
                                    testResult: "jyjghg",
                                    sampleUnqualifiedAmount:0
                                });
                                Object.assign(item, {...obj});
                                //This.$set(Object.assign(This.imcoming.tqcStyleTestInfoVo.styleTestItems[index], {...obj}));
                            });
                            This.imcoming.tqcStyleTestInfoVo.styleTestItems = data.data;

                            Object.assign(This.styleResultArray[This.resultSelectedIndex - 1], {overEdit: true})

                            This.imcoming.tqcStyleTestInfoVo.styleTestItems.map((item)=>{
                                item.testResultTemp = 'jyjghg';
                                item.testValueTemp = item.testValue;
                                item.sampleAmountTemp = item.sampleAmount;
                                item.sampleUnqualifiedAmountTemp = item.sampleUnqualifiedAmount;
                                item.sampleQualifiedAmountTemp = item.sampleQualifiedAmount;
                                item.allowNumberTemp = item.allowNumber;
                                item.rejectNumberTemp = item.rejectNumber;
                            });
                            //将编辑的内容存到款式检测结果汇总表
                            This.styleResultArray[This.resultSelectedIndex - 1] = Object.assign({},This.styleResultArray[This.resultSelectedIndex - 1], {...This.imcoming.tqcStyleTestInfoVo});

                            This.$forceUpdate();
                        }

                    },
                    error: function (err) {
                        This.$Spin.hide();
                        console.log("服务器出错");
                    },
                });
            }
        },

        changeStyleName(name){
            this.testMessagePane = name;
        },
        //点击上一行，下一行，首行，末行
        rowClick(type){
            if(this.resultSelectedIndex === null){
                return;
            }
            this.styleResultArray[this.resultSelectedIndex - 1] = Object.assign({},this.styleResultArray[this.resultSelectedIndex - 1], {...this.imcoming.tqcStyleTestInfoVo});//将编辑的内容存到款式检测结果汇总表
            if(this.styleResultArray.length === 1){
                this.reInitStyleResult();
                //return;
            }
            if(type === 'first'){
                this.resultSelectedIndex = 1;
                /*this.styleResultArray[this.resultSelectedIndex - 1].testWay = this.imcoming.tqcStyleTestInfoVo.testWay;
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);*/
                this.editTestResult();
            }
            else if(type === 'previous'){
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);
                this.styleResultArray[this.resultSelectedIndex - 1].testWay = this.imcoming.tqcStyleTestInfoVo.testWay;
                if(this.resultSelectedIndex == 1){ //当前为首行时直接返回
                    this.resultSelectedIndex = 1;
                    this.$Modal.info({content: "已经是第一条", title: "提示", icon: 0})
                }else {
                    this.resultSelectedIndex--;
                }
                this.editTestResult();
            }
            else if(type === 'next'){
                this.styleResultArray[this.resultSelectedIndex - 1].testWay = this.imcoming.tqcStyleTestInfoVo.testWay;
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);
                if(this.resultSelectedIndex == this.styleResultArray.length){ //当前为末行时直接返回
                    this.resultSelectedIndex = this.styleResultArray.length;
                    this.$Modal.info({content: "已是最后一条", title: "提示", icon: 0})
                }else {
                    this.resultSelectedIndex++;
                }
                this.editTestResult();
                this.$forceUpdate();
            }
            else if(type === 'last'){
                this.resultSelectedIndex = this.styleResultArray.length;
                /*this.styleResultArray[this.resultSelectedIndex - 1].testWay = this.imcoming.tqcStyleTestInfoVo.testWay;
                this.calculateQualifiedAmount(this.resultSelectedIndex - 1);*/
                this.editTestResult();
            }
            this.imcoming.tqcStyleTestInfoVo = Object.assign({}, {...this.styleResultArray[this.resultSelectedIndex - 1]});
            this.reInitStyleResult();
            this.imcoming.tqcStyleTestInfoVo.index = this.resultSelectedIndex;
            this.$forceUpdate();
        },

        //不合格数、合格率
        calculateQualifiedAmount(index){//计算检验数量，计算不合格，合格率
            var regPos = /^[0-9]*$/; // 整数
            if (this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount != '' && this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount != null
                && !regPos.test(this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount)){
                this.$Modal.info({content: "请输入正确的不合格数", title: "提示", icon: 0})
                return false;
            }
            if(Number(this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount) > Number(this.imcoming.tqcStyleTestInfoVo.testAmount)){
                this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount = "";
                this.$Modal.info({content: "不合格数不能大于检验数量", title: "提示", icon: 0})
                return;
            }

            this.imcoming.tqcStyleTestInfoVo.qualifiedAmount = Number(this.imcoming.tqcStyleTestInfoVo.testAmount) - (Number(this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount) ? Number(this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount) : 0);
            this.imcoming.tqcStyleTestInfoVo.qualifiedPercent = ((Number(this.imcoming.tqcStyleTestInfoVo.qualifiedAmount)/Number(this.imcoming.tqcStyleTestInfoVo.testAmount))*100).toFixed(2) + '%';
            let obj = {
                testAmount: this.imcoming.tqcStyleTestInfoVo.testAmount,
                qualifiedAmount: this.imcoming.tqcStyleTestInfoVo.qualifiedAmount,
                unqualifiedAmount: Number(this.imcoming.tqcStyleTestInfoVo.unqualifiedAmount),
                qualifiedPercent: this.imcoming.tqcStyleTestInfoVo.qualifiedPercent
            };
            if(this.styleResultArray[index]){
                this.styleResultArray[index] = Object.assign({},this.styleResultArray[index], {...obj});
                //Object.assign(this.styleResultArray[index], {...obj});
            }
            this.$forceUpdate();
            if(index === 'no'){
                return;
            }
            this.calculateTotal();
        },
        //总数
        calculateTotal(){//统计总数，不合格总数，合格率
            this.imcoming.tQcTestDocumentEntity.testTotalAmount = 0;
            this.imcoming.tQcTestDocumentEntity.unqualifiedTotalAmount = 0;
            let length = this.styleResultArray.length;
            for(let i = 0; i < length; i++){
                console.log(this.styleResultArray[i].testTotalAmount);
                if(!isNaN(Number(this.styleResultArray[i].testAmount))){
                    this.imcoming.tQcTestDocumentEntity.testTotalAmount += Number(this.styleResultArray[i].testAmount);
                }
                if(!isNaN(Number(this.styleResultArray[i].unqualifiedAmount))){
                    this.imcoming.tQcTestDocumentEntity.unqualifiedTotalAmount += Number(this.styleResultArray[i].unqualifiedAmount);
                }
            }
            this.imcoming.tQcTestDocumentEntity.qualifiedTotalAmount = this.imcoming.tQcTestDocumentEntity.testTotalAmount - this.imcoming.tQcTestDocumentEntity.unqualifiedTotalAmount;
            this.imcoming.tQcTestDocumentEntity.qualifiedPercent = (this.imcoming.tQcTestDocumentEntity.qualifiedTotalAmount/this.imcoming.tQcTestDocumentEntity.testTotalAmount*100).toFixed(2) + '%';
        },
        //取样不合格数
        sampleUnqualifiedAmountBlur(data,index){// 取样不合格数输入框失去光标事件
            if(parseInt(data.sampleAmount) <  parseInt(data.sampleUnqualifiedAmount)){
                data.sampleUnqualifiedAmount = '';
                this.$Modal.info({content: "取样不合格数不能大于取样数", title: "提示", icon: 0})
                return false;
            }
            data.sampleQualifiedAmount = parseInt(data.sampleAmount) - parseInt(data.sampleUnqualifiedAmount);
            $('.sampleQualifiedAmount'+ index).html(parseInt(data.sampleAmount) - parseInt(data.sampleUnqualifiedAmount));
            if(parseInt(data.sampleUnqualifiedAmount, 10) <= parseInt(data.allowNumber, 10)){
                data.testResult = "jyjghg";
            }else if(parseInt(data.sampleUnqualifiedAmount, 10) >= parseInt(data.rejectNumber, 10)) {
                data.testResult = "jyjgbhg";
            }
            this.$forceUpdate();
        },

        initStyleResult(){
            let This = this;
            $("#styleResult_table").jqGrid({
                dataType:'local',
                styleUI: 'Bootstrap',
                rownumbers: true,
                multiselect: true,
                colNames : [ '检验结果', '结果描述/建议','图片', '商品编码','商品名称','款式类别','批号','质检方式','检验数量','计数单位','总重','计重单位', '合格数', '不合格数','合格率', '质检状态'],
                colModel : [
                    {name : 'testResult',index : 'testResult',width : 100, align: "center",
                        formatter: function (value, grid, rows, state) {
                            if (value === "jyjghg"){
                                return "合格";
                            }
                            if (value === "jyjgbhg"){
                                return "不合格"
                            }
                            return "";
                        }
                    },
                    {name : 'resultDescribeSuggest',index:'resultDescribeSuggest', width : 120,align : "center"},
                    {name: "pictureUrl", index: "pictureUrl", width: 80, align: "center",
                        formatter: function (ellvalue, options, rowObject) {
                            let random = guid();
                            $(document).on('mouseout', '.can', function () {
                                vm.hideMirror(random)
                            });
                            $(document).on('mouseenter', '.select' + random, function () {
                                vm.showMirror(random)
                            })
                            let url = rowObject.pictureUrl;
                            // let url = 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=774882013,660132957&fm=27&gp=0.jpg';
                            if (url) {
                                return `<div class="select${random} can">
                                    <img height="50px" width="50px" src="${url}"/>
                                    <div class="mirror"><img width="180px" src="${url}"></div>
                                </div>`;
                            } else {
                                return '<div class="select${random}"></div>';
                            }
                        }
                    },
                    {name : 'productCode',width : 80,align : "center",
                        formatter: function (value, grid, rows, state) {
                            $(document).on('click',".detail"+ value,function(){
                                This.toProductDetail({value, grid, rows, state})
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        }},
                    {name : 'productName',width : 80,align : "center"},
                    {name : 'styleName',width : 80,align : "center"},
                    {name : 'batchNumber',width : 200, align: "center"},
                    {name : 'testWay',index : 'id',width : 80, align: "center",
                        formatter: function (value, grid, rows, state) {
                            if (value === "cj"){
                                return "抽检"
                            }
                            if (value === "mj"){
                                return "免检"
                            }
                            if (value === "qj"){
                                return "全检"
                            }
                            return ""
                        }
                    },
                    {name: 'testAmount', width: 80, align: "center"},
                    {name: 'countingUnit', width: 80, align: "center"},
                    {name: 'weight', width: 80, align: "center"},
                    {name: 'weightUnit', width: 80, align: "center"},
                    {name : 'qualifiedAmount',width : 80,align : "center"},
                    {name : 'unqualifiedAmount',width : 80,align : "center"},
                    {name : 'qualifiedPercent',width : 80,align : "center"},
                    {name : 'testStatus',width : 80,align : "center",
                        formatter: function (value, grid, rows, state) {
                            if (value === "jihua"){
                                return "计划"
                            }
                            if (value === "zjwc"){
                                return "质检完成"
                            }
                            return "计划"
                        }
                    }
                ],
                pager: false,
                autoHeight:true,
                onSelectRow: function (index, status) {
                    console.log("index==",index)
                    This.resultSelectedIndex = index;
                },
                beforeSelectRow(){
                    $("#styleResult_table").jqGrid('resetSelection');
                },
                gridComplete(){
                    var myGrid = $("#styleResult_table");
                    $("#cb_"+myGrid[0].id).hide();
                }
            });

            for(let i=0;i<This.styleResultArray.length;i++){
                $("#styleResult_table").jqGrid('addRowData',i+1,This.styleResultArray[i]);
            }
        },
        reInitStyleResult(){
            let This = this;
            $("#styleResult_table").jqGrid('clearGridData');  //清空表格
            $("#styleResult_table").jqGrid('setGridParam',{  // 重新加载数据
                data : This.styleResultArray,   //  重新加载的数据
            }).trigger("reloadGrid");
            this.initStyleResult();
        },

        showMirror(name) {
            let top = $(`.select${name}`).offset().top-$(document).scrollTop()- 65;
            let left = $(`.select${name}`).offset().left + 150;
            $(`.select${name} .mirror`).css('top',top);
            $(`.select${name} .mirror`).css('left',left);
            $(`.select${name} .mirror`).show()
        },
        hideMirror(name) {
            $(`.select${name} .mirror`).hide()
        },

        //检测值
        testValueBlur(data){// 检测值输入框失去光标事件
            //jyjghg jyjgtbfx jyjgbhg => 合格 特别放行 不合格
            let target = data.testItemEntity.goalValueName; //目标值
            let test = data.testValue;//检测值
            let upperLimitValue = parseInt(data.testItemEntity.upperLimitValue);//上限值
            let lowerLimitValue = parseInt(data.testItemEntity.lowerLimitValue);//下限值
            console.log('target: ' +target,'test: ' +test,'upperLimitValue: ' +upperLimitValue,'lowerLimitValue: ' +lowerLimitValue)

            //定性分析   合格/不合格状态：检测值=目标值
            if (data.testItemEntity.analyseMethod === 'dxfx' && data.testItemEntity.compareSymbolName === '='){
                if(target === test){
                    data.testResult =  'jyjghg';
                }else if (target !== test){
                    data.testResult = 'jyjgbhg';
                }
            }
            //定量分析
            if (data.testItemEntity.analyseMethod === 'dlfx') {
                if (data.testItemEntity.compareSymbolName === '==') {
                    if (target === test) {
                        data.testResult = 'jyjghg';
                    } else if (test != target) {
                        data.testResult = 'jyjgbhg';
                    }
                }
                if (data.testItemEntity.compareSymbolName === 'between') { //合格/不合格状态：下限值=<检测值<=上限值；
                    console.log(334552, data.testItemEntity.compareSymbolName)
                    if (test <= upperLimitValue && test >= lowerLimitValue) {
                        data.testResult = 'jyjghg';
                    } else {
                        data.testResult = 'jyjgbhg';
                    }
                }
                if (data.testItemEntity.compareSymbolName === '>=') {
                    if (test >= target) {
                        data.testResult = 'jyjghg';
                    } else if (test <= target) {
                        data.testResult = 'jyjgbhg';
                    }
                }

                if (data.testItemEntity.compareSymbolName === '<=') {
                    if (test <= target) {
                        data.testResult = 'jyjghg';
                    }else if (test <= target){
                        data.testResult = 'jyjgbhg';
                    }
                }
                if (data.testItemEntity.compareSymbolName === '<>') {
                    if (test !== target) {
                        data.testResult = 'jyjghg';
                    } else if (test === target) {
                        data.testResult = 'jyjgbhg';
                    }
                }
                if (data.testItemEntity.compareSymbolName === '>') {
                    if (test > target) {
                        data.testResult = 'jyjghg';
                    } else if (test < target) {
                        data.testResult = 'jyjgbhg';
                    }
                }
                if (data.testItemEntity.compareSymbolName === '<') {
                    if (test < target) {
                        data.testResult = 'jyjghg';
                    } else if (test > target) {
                        data.testResult = 'jyjgbhg';
                    }
                }
            }
            this.$forceUpdate();
        },
        //抽检比例
        randomTestProportionBlur(data){// 抽检比例输入框失去光标事件
            if(parseFloat(data.randomTestProportion) < parseFloat(data.defaultDomTestProportion)){
                this.$Modal.info({content: "抽检比例不能低于默认值", title: "提示", icon: 0})
                data.randomTestProportion = parseFloat(data.defaultDomTestProportion)+"%";
            } else {
                data.sampleAmount = parseInt(parseInt(data.randomTestProportion, 10)* this.imcoming.tqcStyleTestInfoVo.testAmount/100, 10)
            }
            this.$forceUpdate();
        },
        //质检方式
        testWayChange(value){

            if(value === 'qj'){
                this.canInput = true;
                this.imcoming.tqcStyleTestInfoVo.styleTestItems.map((item)=>{
                    item.testResult = 'jyjghg';
                    item.randomTestProportion = '100%';
                    item.testValue = item.testValueTemp;
                    item.sampleAmount = this.imcoming.tqcStyleTestInfoVo.testAmount;
                    item.sampleUnqualifiedAmount = 0;
                    item.sampleQualifiedAmount = this.imcoming.tqcStyleTestInfoVo.testAmount;
                    item.allowNumber = '';
                    item.rejectNumber = '';
                })

            }else if(value === 'mj'){
                this.imcoming.tqcStyleTestInfoVo.styleTestItems.map((item)=>{
                    item.testResult = 'jyjghg';
                    item.randomTestProportion = '100%';
                    item.sampleAmount = this.imcoming.tqcStyleTestInfoVo.testAmount;
                    item.sampleUnqualifiedAmount = 0;
                    item.sampleQualifiedAmount = this.imcoming.tqcStyleTestInfoVo.testAmount;
                    item.allowNumber = '';
                    item.rejectNumber = '';
                })
            }else if(value === 'cj'){
                this.imcoming.tqcStyleTestInfoVo.styleTestItems.map((item)=>{
                    item.testResult = 'jyjghg';
                    item.testValue = item.testValueTemp;
                    item.randomTestProportion = item.defaultDomTestProportion;
                    item.sampleAmount = item.sampleAmountTemp;
                    item.sampleUnqualifiedAmount = 0;
                    item.sampleQualifiedAmount = item.sampleQualifiedAmountTemp;
                    item.allowNumber = item.allowNumberTemp;
                    item.rejectNumber = item.rejectNumberTemp;
                })
                this.canInput = true;
            }

            this.htTestChange();
        },

        //打印
        htPrint(){
            htPrint()
        },

        reGetApprovalMessage(){
            $("#approvalList").jqGrid('clearGridData');
            $("#approvalList").jqGrid('setGridParam',{postData:{receiptsId:this.receiptsId}}).trigger("reloadGrid")
        },
        //生成报告单
        createReport(){
            let This = this;
            if (This.imcoming.tQcTestDocumentEntity.documentStatus !== "4"){
                this.$Modal.info({content: "该单未完成审核，不能生成报告单", title: "提示", icon: 0})
                return;
            }
            window.parent.activeEvent({name: '生成报告单', url: contextPath+'/quality/quality/inspection-report2.html',
                params: {"testDocumentId":This.imcoming.tQcTestDocumentEntity.id,"code":This.imcoming.tQcTestDocumentEntity.documentCode}});
        },

        approval(){
            let This = this;

            if(This.imcoming.tQcTestDocumentEntity.documentStatus == '1' || !This.imcoming.tQcTestDocumentEntity.documentCode){
                This.$Modal.info({
                    title: "提示信息!",
                    content: "请先提交单据!"
                });
                return false;
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;

        },

        reject(){
            let This = this;
            if(This.imcoming.tQcTestDocumentEntity.documentStatus === 1 || !This.imcoming.tQcTestDocumentEntity.documentCode){
                This.$Modal.info({
                    title: "提示信息!",
                    content: "请先提交单据!"
                });
                return false;
            }
            if(This.imcoming.tQcTestDocumentEntity.correctPreventId){
                This.$Modal.info({content: "已生成纠正预防单，不可驳回！", title: "提示", icon: 0})
                return;
            }
            if(This.imcoming.tQcTestDocumentEntity.testReportId){
                This.$Modal.info({content: "已生成检验报告单，不可驳回！", title: "提示", icon: 0})
                return;
            }
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;

        },

        approvalOrRejectCallBack(res){
            let This = this;

            if(res.result.code == '100100'){
                This.imcoming.tQcTestDocumentEntity.documentStatus = res.result.data + '';
                console.log(This.imcoming.tQcTestDocumentEntity.documentStatus,res)
                if(This.imcoming.tQcTestDocumentEntity.documentStatus == 1){
                    //驳回到原点，暂存
                    This.isStampShow = false;
                    This.allowClick();
                    This.imcoming.tQcTestDocumentEntity.examineVerifyName = '';
                    This.imcoming.tQcTestDocumentEntity.examineVerifyTime = '';
                    This._isEdit('Y');
                    $(".is-submit-disabled").css({"pointer-events":"auto "}).css({"color": '#495060'})
                }else if(This.imcoming.tQcTestDocumentEntity.documentStatus == '2'){
                    //待审核

                }else if(This.imcoming.tQcTestDocumentEntity.documentStatus == '3'){
                    //审核中

                }else if(This.imcoming.tQcTestDocumentEntity.documentStatus == '4'){
                    //审核完成
                    This.isStampShow = true;
                    This.imcoming.tQcTestDocumentEntity.testFinishTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                    This.imcoming.tQcTestDocumentEntity.examineVerifyName = layui.data('user').username;
                    This.imcoming.tQcTestDocumentEntity.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                    $(".is-htPrint").css({"pointer-events":"auto "}).css({"color": '#495060'})
                    //当单据状态为已审核，修改质检状态为质检完成
                    for(let i = 0, length = This.styleResultArray.length; i < length; i++){
                        let obj = Object.assign({}, {
                            testStatus: "zjwc"
                        });
                        Object.assign(This.styleResultArray[i],{...obj})
                    }
                    This.reInitStyleResult();
                }else if(This.imcoming.tQcTestDocumentEntity.documentStatus == '5'){
                    //审核驳回
                    This.isStampShow = false;
                    //清空质检完成时间,最后一级审核人，审核完成时间
                    This.imcoming.tQcTestDocumentEntity.testFinishTime = '';
                    This.imcoming.tQcTestDocumentEntity.examineVerifyName = '';
                    This.imcoming.tQcTestDocumentEntity.examineVerifyTime = '';
                    for(let i = 0, length = This.styleResultArray.length; i < length; i++){
                        let obj = Object.assign({}, {
                            testStatus: "jihua"
                        });
                        Object.assign(This.styleResultArray[i],{...obj})
                    }
                    This.reInitStyleResult();
                }else {
                    This.$Modal.warning({
                        content: '审核异常!',
                        title:'警告'
                    });
                    return false;
                }
            }
        },

        autoSubmitOrReject(result){
            let This = this;
            $.ajax({
                url:contextPath + '/entrustOut/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.imcoming.tQcTestDocumentEntity,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        This.imcoming.tQcTestDocumentEntity.documentStatus = parseInt(res.data);
                        if(This.imcoming.tQcTestDocumentEntity.documentStatus == 1){
                            //审核驳回
                            This.isStampShow = false;
                            //清空质检完成时间,最后一级审核人，审核完成时间
                            This.imcoming.tQcTestDocumentEntity.testFinishTime = '';
                            This.imcoming.tQcTestDocumentEntity.examineVerifyName = '';
                            This.imcoming.tQcTestDocumentEntity.examineVerifyTime = '';
                            for(let i = 0, length = This.styleResultArray.length; i < length; i++){
                                let obj = Object.assign({}, {
                                    testStatus: "jihua"
                                });
                                Object.assign(This.styleResultArray[i],{...obj})
                            }
                            This.reInitStyleResult();

                        }else if(This.imcoming.tQcTestDocumentEntity.documentStatus == 4){
                            //审核完成
                            //审核完成
                            This.isStampShow = true;
                            This.imcoming.tQcTestDocumentEntity.testFinishTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                            This.imcoming.tQcTestDocumentEntity.examineVerifyName = layui.data('user').username;
                            This.imcoming.tQcTestDocumentEntity.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                            //当单据状态为已审核，修改质检状态为质检完成
                            for(let i = 0, length = This.styleResultArray.length; i < length; i++){
                                let obj = Object.assign({}, {
                                    testStatus: "zjwc"
                                });
                                Object.assign(This.styleResultArray[i],{...obj})
                            }
                            This.reInitStyleResult();
                        }
                    }else {
                        This.$Modal.warning({content:res.msg});
                    }
                }
            });
        },

        updateStatus(testDocumentId,documentStatus){
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/documentAllController/updateByTestDocumentIdAndStatus",
                data:{"testDocumentId":testDocumentId,"documentStatus":documentStatus},
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100") {
                        This.refresh();
                    }

                },
                error: function (err) {
                    This.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },

        //回显
        echo(path, code){
            let This = this;

            let url = contextPath+"/documentAllController/"+path+"/"+code
            console.log("url" ,url)
            $.ajax({
                type: "POST",
                url: url,
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {

                    if (res.code == 100100) {
                        This.inspectorAsk(res.data.tQcTestDocumentEntity.testDepartmentId, res.data.tQcTestDocumentEntity.inspectorId);

                        This.warehouseAsk(res.data.tQcTestDocumentEntity.testedOrganizationId);
                        //赋值
                        This.imcoming.tQcTestDocumentEntity = res.data.tQcTestDocumentEntity;

                        //调用商品类型
                        This.productTypeAsk(This.imcoming.tQcTestDocumentEntity.productGroup)
                        //回显被检组织类型、单据类型、业务类型 res.data.tQcTestDocumentEntity.documentType
                        This.changeTestOrgType(res.data.tQcTestDocumentEntity.documentType);

                        This.styleResultArray = res.data.tqcStyleTestInfoVo;
                        This.initStyleResult();//生成款式汇总列表,并且默认显示第一条
                        This.imcoming.tqcStyleTestInfoVo = Object.assign({}, This.styleResultArray[0], {index: 1});
                        This.resultSelectedIndex = 1;

                        if(This.params.activeType === "query"){
                            $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This.BannedClick();
                            This._isEdit('N');
                        }
                        if (This.imcoming.tQcTestDocumentEntity.documentStatus != "1") {
                            //禁止用户编辑
                            This.BannedClick();
                            $(".is-submit-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                            This._isEdit('N');
                        }else{
                            $(".is-submit-disabled").css({"pointer-events":"auto "}).css({"color": '#495060'})
                            This._isEdit('Y');
                        }
                        if (This.imcoming.tQcTestDocumentEntity.testedOrganizationName) {
                            This.showTestedOrganizationId = true;
                        }
                        if (This.imcoming.tQcTestDocumentEntity.productTypeId) {
                            This.showCategoryType = true;
                        }
                        //如果已审核，显示印章
                        if (This.imcoming.tQcTestDocumentEntity.documentStatus == "4") {
                            This.isStampShow = true;
                        }
                        //时间格式化
                        This.imcoming.tQcTestDocumentEntity.documentTime = This.imcoming.tQcTestDocumentEntity.documentTime ? new Date(This.imcoming.tQcTestDocumentEntity.documentTime).format("yyyy-MM-dd") : '';
                        //获取附件信息
                        This.getAccess(This.imcoming.tQcTestDocumentEntity.documentCode,'Q_INVENTORY');
                    }else {
                        This.$Modal.warning({
                            title: "提示！",
                            content: "系统异常",
                        })
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        },

        //关闭
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        //关闭新增页面
        handlerClose(){
            if((!this.body.documentStatus || this.body.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save('0');
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
        }
    },


    created(){
        this.openTime = window.parent.params.openTime;
        let This = this;
        //This.documentStatusAsk();
        this.imcoming.tQcTestDocumentEntity.documentStatus = "1"
        $(".is-htPrint").css("pointer-events", "none").css({"color": "#bbbec4"})
        This.testResultAsk();
        This.productTypeAsk();
        This.getOrgNameAsk();
        This.warehouseAsk();
        //请求不良原因
        This.loadBadResons();

        This.resultSelectedIndex = 1;
    },
    mounted() {

        let This = this;
        This.params = window.parent.params.params;
        window.handlerClose = This.handlerClose;

        if (This.params.activeType === "add"){
            This.initDetailData();
            This.changeTestOrgType(This.params.documentType);
        }else if(This.params.activeType === "update"){
            //修改
            This.echo("info",This.params.docCode);
        }else if(This.params.activeType === "query"){
            //查看
            This.echo("infoByDocumentCode",This.params.docCode);
        }
        if (This.imcoming.tQcTestDocumentEntity.documentStatus == "1") {
            //允许点击
            This._isEdit('Y');
            This.allowClick();
        }
    }
});