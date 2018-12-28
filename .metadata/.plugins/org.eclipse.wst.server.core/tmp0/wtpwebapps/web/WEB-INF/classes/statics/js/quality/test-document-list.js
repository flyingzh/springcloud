var inventory = new Vue({
    el: '#imcomingReportList',
    data() {
        let This = this;
        return {
            isLook:true,
            isEdit: false,
            reload: false,
            isSearchHide: true,
            isTabulationHide: true,
            isHide:true,
            selected: [],
            showHighSearch: false,
            otherSearch:[],
            openTime:"",
            organList:[],//被检组织列表
            dataValue:[],
            selectDateArr:[],
            inspectorNameList:[],//质检员列表
            commodityCategoty:[],
            categoryType: [],
            statusList:[],//单据状态列表
            simpleType:"",//单据类型
            params:'',
            body:{
                documentType:'',
                testedOrganizationName:'',//被检组织
                documentCode:'',//单据编号
                documentStatus:'',//单据状态
                productTypeName:'',//商品类型
                startTime:'',
                endTime:'',
                inspectorName:'',
                productTypeId:''
            },
            documentCode:'',
            documentStatus:'',
            //审核
            modalTrigger:false,
            modalType:'',
            approvalTableData:[],
            stepList: [],

            data_config:{
                url: contextPath+'/documentAllController/list',
                colNames : [ 'testReportId','correctPreventId','id', '单据编号', '单据类型', '单据日期','单据状态', '质检员','被检组织','质检完成时间','商品类型', '检验总数量', '合格数','不合格数','合格率','检验结果'],
                colModel : [
                    {name : 'testReportId',width : 80,align : "center", hidden: true},
                    {name : 'correctPreventId',width : 80,align : "center", hidden: true},
                    {name : 'id',width : 80,align : "center", hidden: true},
                    {name : 'documentCode',index : 'id',width : 160, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).on('click',".detail"+ value,function(){
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name : 'documentType',width : 100,align : "left",
                        formatter: function (value, grid, rows, state) {
                            if (value === "kcjyd"){
                                return "库存检验单"
                            }
                            if (value === "mdjyd"){
                                return "门店检验单"
                            }else{
                                return ""
                            }
                        }},
                    {name : 'createTime',width : 100,align : "left",
                        formatter: function (value, grid, rows, state) {
                            return  new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name : 'documentStatus',width : 80,align : "left",
                        formatter: function (value, grid, rows, state) {
                            if(value == 1){
                                return '暂存';
                            }
                            if(value == 2){
                                return '待审核';
                            }
                            if(value == 3){
                                return '审核中';
                            }
                            if(value == 4){
                                return '已审核';
                            }
                            if(value == 5){
                                return '驳回';
                            }
                            return '';
                        },
                        unformat(value, grid, rows, state){
                            if(value == '暂存'){
                                return 1;
                            }
                            if(value == '待审核'){
                                return 2;
                            }
                            if(value == '审核中'){
                                return 3;
                            }
                            if(value == '已审核'){
                                return 4;
                            }
                            if(value == '驳回'){
                                return 5;
                            }
                        }},
                    {name : 'inspectorName',width : 80,sortable : false,align:"left"},
                    {name : 'testedOrganizationName',width : 90,align : "left"},
                    {name : 'testFinishTime',width : 150,sortable : false, align : "left"/*,
                        formatter: function (value, grid, rows, state) {
                            if(value){
                                return  new Date(value).format("yyyy/MM/dd");
                            }
                            return "";
                        }*/
                    },
                    {name : 'productTypeName',width : 100,sortable : false, align : "left"},
                    {name : 'testTotalAmount',width : 80,sortable : false, align : "right"},
                    {name : 'qualifiedTotalAmount',width : 80,sortable : false, align : "right"},
                    {name : 'unqualifiedTotalAmount',width : 80,sortable : false, align : "right"},
                    {name : 'qualifiedPercent',width : 80,sortable : false, align : "right"},
                    {name : 'testResult',width : 80,sortable : false, align : "left",
                        formatter: function (value, grid, rows, state) {
                            if(value === "jyjghg"){
                                return  "合格";
                            }
                            if(value === "jyjgbhg"){
                                return  "不合格";
                            }
                            return "";
                        }
                    }
                ]
            }
        }
    },
    created(){
        if(window.parent.params.name=="门店检验单"){
            this.simpleType="mdjyd";
            this.body.documentType=this.simpleType;
        }
        if(window.parent.params.name=="库存检验单"){
            this.simpleType="kcjyd";
            this.body.documentType=this.simpleType;
        }
    },
    methods: {
        //转换搜索栏日期格式
        changeDate(value){
            this.body.startTime=value[0].replace(/\//g, '-');
            this.body.endTime=value[1].replace(/\//g, '-');
        },
        //搜索
        search(){
            if(!this.body.inspectorName){
                this.body.inspectorName = '';
            }
            if(!this.body.testedOrganizationName){
                this.body.testedOrganizationName = '';
            }
            if(!this.body.documentStatus){
                this.body.documentStatus = '';
            }
            this.reload=!this.reload;
        },
        //清空
        clear(){
            this.commodityCategoty=[];
            //this.$refs.inspect.reset();
            this.$nextTick(function(){
                this.body.inspectorName='';
            });
            this.body={
                testedOrganizationName:'',//被检组织
                documentCode:'',//单据编号
                documentStatus:'',//单据状态
                productTypeName:'',//商品类型
                startTime:'',
                endTime:'',
                inspectorName:'',
                productTypeId :'',
                documentType:this.simpleType
            }
            this.dataValue=[];
        },

        handleClearType(value) {
            this.$refs[value].reset();
            this.$nextTick(() => {
                if (value === 'dType') {
                    this.body.businessType = '';
                }else if (value === 'testedOrganizationName') {
                    this.body.testedOrganizationName = '';
                }else if (value === 'inspet') {
                    this.body.inspet = '';
                }else if (value === 'documentStatus') {
                    this.body.documentStatus = '';
                }
            });
        },

        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            console.log(selectedData[selectedData.length-1],selectedData,999,arr)
            if (selectedData.length <= 0) {
                this.body.productTypeId = '';
            }else {
                //获取商品分类名称
                this.body.productTypeId = selectedData[selectedData.length-1];
            }
        },

        //根据单据code查询单据信息
        detailClick(data){

            let code = data.rows.documentCode;
            if (code) {
                window.parent.activeEvent({name: '查看'+this.params, url: contextPath+'/quality/inventory/test-document.html',params: {docCode:code,activeType:'query'}});
            }
        },
        //刷新
        refresh(){
            this.clear();

            this.reload = !this.reload;
        },
        //新增
        add(){
            //跳转新增库存检验单
            window.parent.activeEvent({
                name: "新增"+this.params,
                url: contextPath+'/quality/inventory/test-document.html',
                params: {documentType: this.simpleType, activeType: "add"}
            });
        },
        //提交
        submit(){
            var document = this.selected;
            console.log("submit",document)
            if(document.length < 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据!'
                })
                return;
            }else if(document.length > 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据!'
                })
                return;
            }else {
                let This = this;
                //提交之前进行校验
                if (document[0].documentStatus != "1"){
                    this.$Modal.info({
                        title:'提示信息',
                        content:'单据状态不为暂存不能提交!'
                    })
                    return;
                }

                $.ajax({
                    type: "POST",
                    url: contextPath+"/documentAllController/submit",
                    dataType: "json",
                    data:{"testDocumentId":document[0].id},
                    success: function(data) {
                        console.log(data)
                        if (data.code === "100100"){
                            document[0].documentStatus = "2"
                            This.updateStatus(document[0].id,"2")
                            This.refresh();
                            This.$Modal.success({
                                title:'提示信息',
                                content:'提交成功!'
                            })
                        }else {
                            document[0].documentStatus = "temporary_save";
                            This.$Modal.success({
                                title:'提示信息',
                                content:data.msg
                            })
                        }
                    },
                    error: function(err){
                        This.$Spin.hide();
                        // console.log("服务器出错");
                        This.$Modal.success({
                            title:'提示信息',
                            content:'服务器出错，请稍后再试！'
                        })
                    },
                });

            }
        },

        //生成报告单
        createReport(){
            let This = this;
            var document = This.selected
            console.log("document",document)
            if(document.length > 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据!'
                })
                return;
            }
            if(document.length < 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据!'
                })
                return;
            }
            if (document[0].documentStatus != "4"){
                this.$Modal.info({
                    title:'提示信息',
                    content:'该单未完成审核，不能生成报告单!'
                })
                return;
            }
            window.parent.activeEvent({name: '生成报告单', url: contextPath+'/quality/quality/inspection-report2.html',
                params: {"testDocumentId":document[0].id,"code":document[0].documentCode}});
        },

        //修改
        update(){
            let This= this;
            var docoment = This.selected;
            if(docoment.length < 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据!'
                })
                return;
            }else if(docoment.length > 1){
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据!'
                })
                return;
            }else {
                //跳转新增库存检验单
                window.parent.activeEvent({
                    name: "修改"+this.params,
                    url: contextPath+'/quality/inventory/test-document.html',
                    params: {docCode: docoment[0].id, documentType: This.simpleType, activeType: "update"}
                });
            }
        },
        //删除
        DeleteOneRow(){
            let This = this;
            if(inventory.selected.length < 1 ){
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                });
            }else{
                this.$Modal.confirm({
                    title: '提示信息',
                    content: '是否要删除这条信息？',
                    onOk: () => {
                        $.ajax({
                            type:"POST",
                            url: contextPath+"/documentAllController/deleteBatch",
                            contentType: 'application/json',
                            data:JSON.stringify(inventory.selected),
                            dataType:"json",
                            success: function(data) {
                                console.log(data)
                                if (data.code == "100100") {
                                    inventory.selected.length=0;
                                    inventory.refresh();

                                    if($.isEmptyObject(data.data)){
                                        This.$Modal.success({
                                            title: '提示信息',
                                            content: '删除成功！'
                                        });
                                    }else {
                                        let msg = "单据";
                                        for (let i = 0; i < data.data.length; i++) {
                                            msg += "["+data.data[i].documentCode+"]、"
                                            console.log(data.data[i].documentCode,data.data,11009)
                                        }
                                        msg+="删除失败（单据已启用审批流，无法删除！）"
                                        This.$Modal.info({
                                            title: '提示信息',
                                            content: msg
                                        });
                                    }
                                }

                            },
                            error: function(err){
                                This.$Modal.info({
                                    title: '提示信息',
                                    content: err
                                });
                            },
                        })
                    },
                    onCancel: () => {
                    }
                });
            }
        },
        //生成报告单
        addReport(){

        },
        //设置列
        setRows(){

        },
        //附件
        attachment(){

        },
        //退出
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime,exit:true})
        },

        hideSearch() {
            this.isHide=!this.isHide;
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top","")
        },
        hidTabulation() {
            this.isHide=!this.isHide;
            this.isTabulationHide = !this.isTabulationHide;
            if(!this.isTabulationHide){
                $(".chevron").css("top","90%")
            }else{
                $(".chevron").css("top","")
            }
        },
        //获取被检组织
        loadTestedOrganizationName(name){
            console.log("name===",name)
            let This = this;
            if (name == "库存检验单") {
                $.ajax({
                    type: "POST",
                    url: contextPath+"/documentAllController/listByOrganizationId",
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        This.organList = data.data;
                    },
                    error: function (err) {
                        This.$Spin.hide();
                        // console.log("服务器出错");
                        This.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                });
            }else if(name == "门店检验单"){
                //获取当前组织名称
                $.ajax({
                    type: "POST",
                    url: contextPath+"/documentAllController/getOrgName",
                    contentType: 'application/json',
                    dataType: "json",
                    success: function (data) {
                        This.organList = data.data;
                    },
                    error: function (err) {
                        // console.log("服务器出错");
                        This.$Modal.info({
                            title: '提示信息',
                            content: '服务器出错，请稍后再试！'
                        });
                    },
                });
            }
        },
        //获取单据状态（数据字典）
        loadCodeType(){
            this.statusList = getCodeList("zj_document_status");
        },
        //获取商品类型
        loadProductType(){
            let That = this;
            $.ajax({
                type: "post",
                url: contextPath+'/documentController/getCategory?parentId=0',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    That.categoryType = That.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    // alert('服务器出错啦');
                    That.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试！'
                    });
                }
            })
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
        //获取组织下所有员工
        loadInspectorName(){
            $.ajax({
                type: "post",
                url: contextPath+'/documentController/queryAllEmpByOrganId',
                data:{"organId":window.parent.userInfo.organId},
                dataType: "json",
                success: function (data) {
                    inventory.inspectorNameList=data.data;
                },
                error: function () {
                    // alert('服务器出错啦');
                    inventory.$Modal.info({
                        title: '提示信息',
                        content: '服务器出错，请稍后再试！'
                    });
                }
            })
        },
        updateStatus(id,status){
            let This = this;
            $.ajax({
                type: "post",
                dataType: "json",
                url: contextPath+'/documentAllController/updateByTestDocumentIdAndStatus',
                data: {"testDocumentId":id,"documentStatus":status},
                success:function (data) {
                    This.refresh();
                }
            })
        },

        approval() {

            //发送请求
            let This = this;
            let datas = this.selected;
            console.log(345464642,datas)
            if (datas.length > 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'只能选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            if (datas[0].documentStatus == 2 ||
                datas[0].documentStatus == 3 ||
                datas[0].documentStatus == 5) {
                This.id = datas[0].id;
                This.documentStatus = datas[0].documentStatus;
                This.documentCode = datas[0].documentCode;
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
                console.log(datas[0].documentStatus,datas[0].documentCode,77)
            } else if (datas[0].documentStatus == 1) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'请提交单据！'
                });
                return;
            } else if (datas[0].documentStatus == 4) {
                this.$Modal.info({
                    title:'提示信息',
                    content:'该单已审核,不能重复审核！'
                });
                return;
            }

        },
        //驳回
        reject() {
            let This = this;
            let datas = this.selected;
            if (datas.length > 1) {
                This.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                This.$Modal.info({
                    title:'提示信息',
                    content:'请至少选择一条数据！'
                });
                return;
            }
            if (datas[0].testReportId){
                console.log("This[0].testReportId==",datas[0].testReportId)
                This.$Modal.info({
                    title:'提示信息',
                    content:'已生成检验报告单，不可驳回！'
                });
                return;
            }
            if (datas[0].correctPreventId){
                console.log("This[0].correctPreventId==",datas[0].correctPreventId)
                This.$Modal.info({
                    title:'提示信息',
                    content:'已生成纠正预防单，不可驳回！'
                });
                return;
            }else {
                if (datas[0].documentStatus == 2 ||
                    datas[0].documentStatus == 3 ||
                    datas[0].documentStatus == 5) {
                    This.id = datas[0].id;
                    This.documentStatus = datas[0].documentStatus;
                    This.documentCode = datas[0].documentCode;
                    This.modalType = 'reject';
                    This.modalTrigger = !This.modalTrigger;
                } else {
                    This.$Modal.info({
                        title:'提示信息',
                        content:'该单状态不能驳回！'
                    });
                }
            }
        },

        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            console.log(res,9988788)
            if(res.result.code === '100100') {
                this.refresh();
            }
        },

        autoSubmitOrReject(result){
            let This = this;
            $.ajax({
                url:contextPath + '/entrustOut/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.documentCode,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    console.log(322222,res)
                    if(res.code === '100100'){

                    }else {
                        This.$Modal.info({content:res.msg});
                    }
                }
            });
        },
    },

    watch:{
        'body.inspectorName': function (val) {
            if (typeof val == 'undefined') {
                this.body.inspectorName = '';
            }
        },
    },

    mounted() {
        this.openTime = window.parent.params.openTime;
        this.params = window.parent.params.name;
        this.loadProductType();
        this.loadCodeType();
        this.loadInspectorName();
        //获取被检组织
        //var name = window.parent.params.name;
        this.loadTestedOrganizationName(this.params);
    }
});