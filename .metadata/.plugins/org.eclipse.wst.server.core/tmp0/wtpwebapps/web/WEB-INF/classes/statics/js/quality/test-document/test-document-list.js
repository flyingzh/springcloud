function getQueryString(name) {
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
}
var inventory = new Vue({
    el: '#imcomingReportList',
    data() {
        return {
            openTime:'',
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
            isLook: true,
            isEdit: false,
            reload: false,
            selected: [],
            selectRowData:[],
            showHighSearch: false,
            otherSearch:[],
            documentTypeArr:[],
            selectDateArr:[],
            documentStatusArr:[],
            businessTypeArr:[],
            sourceDocumentTypeArr:[],
            testResultArr:[],
            categoryType:[],
            inspectors:[],
            body:{
                documentType: '',
                documentCode: '',
                documentTimeStart:'',
                documentTimeEnd:'',
                businessType:'',
                documentStatus:'',
                sourceDocumentCode:'',
                inspectorId:'',
                productTypeId:'',

            },
            selectRowData:[],
            commodityCategoty:[],
            tableName:'',
            data_config:{
                shrinkToFit:false,
                url: contextPath+'/testDocument/list',
                colNames : [ 'id', '单据编号','源单单号', '单据日期', '单据类型','单据状态', '质检员','源单类型','送检编号','质检完成时间','商品类型', '检验总数量', '合格数','不合格数','合格率','检验结果'],
                colModel : [
                    {name : 'id',width : 80,align : "center", hidden: true},
                    {name : 'documentCode',index : 'id',width : 180, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off("click", ".detail" + value).on("click", ".detail" + value, function () {
                                inventory.documentCodeClick(rows.documentCode,rows.upstreamSourceCode);
                            });
                            let btns = `<a class="detail${value}">${value}</a>`;
                            return btns
                        },
                        unformat:function (val,grid,rows) {
                            return val.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name : 'upstreamSourceCode',width : 200,align : "left"},
                    {name : 'documentTime',width : 100,align : "center",formatter:function (value, grid, rows, state) {
                        if(value){
                            return new Date(value).format("yyyy-MM-dd");
                        }else {
                            return '';
                        }
                    }},
                    {name : 'documentType',width : 100,align : "left",
                        formatter: function (value, grid, rows, state) {
                          return inventory.formatterDocumentType(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return inventory.unformatDocumentType(cellvalue);
                    }
                    },
                    {name : 'documentStatus',width : 100,align : "left",
                        formatter: function (value, grid, rows, state) {
                        return inventory.formatterDocumentStatus(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return inventory.unformatDocumentStatus(cellvalue);
                    }
                    },
                    {name : 'inspectorName',width : 100,sortable : false,align : "left"},
                    {name : 'sourceDocumentType',width : 150,align : "left",formatter: function (value, grid, rows, state) {
                        return inventory.formatterSourceDocumentType(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return inventory.unformatSourceDocumentType(cellvalue);
                    }
                    },
                    {name : 'sourceDocumentCode',width : 180,align : "left"},
                    {name : 'testFinishTime',width : 180,sortable : false, align : "center",formatter:function (value, grid, rows, state) {
                        if(value){
                            return new Date(value).format("yyyy-MM-dd hh:mm:ss");
                        }else {
                            return '';
                        }
                    }},
                    {name : 'productTypeName',width : 100,sortable : false, align : "left"},
                    {name : 'testTotalAmount',width : 100,sortable : false, align : "right"},
                    {name : 'qualifiedTotalAmount',width : 100,sortable : false, align : "right"},
                    {name : 'unqualifiedTotalAmount',width : 100,sortable : false, align : "right"},
                    {name : 'qualifiedPercent',width : 100,sortable : false, align : "right",formatter: function (value, grid, rows, state) {
                        if(!value){
                            return '';
                        }else if(value <= 1){
                            return (Math.round(value * 10000)/100).toFixed(2) + '%'
                        }else if(value > 1){
                            return value.toFixed(2)+'%';
                        }
                    },unformat:function(val,grid,rows){
                        if(!val){
                            return null;
                        }else if(val.indexOf('%') != -1){
                            return parseFloat(val.replace(/\%/g,'')) /1000*100;
                        }
                    }},
                    {name : 'testResult',width : 100,sortable : false, align : "left",
                        formatter: function (value, grid, rows, state) {
                            return inventory.formatterTestResult(value);
                        },
                        unformat(val,grid,rows){
                            return inventory.unformatTestResult(value);
                    }
                    }
    ]
            },
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide:true,
            receiptsId:'',
            documentStatus:'',
            testDocumentId:'',
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
        }
    },
    created(){
     let docType=getQueryString("documentType");
     this.fetchDocumentType();
     this.body.documentType = docType;
    },
    methods: {
        handleClearSelect(name){
            this.$refs[name].reset();
            this.$nextTick(()=>{
                this.body[name] = '';
            });
        },
        changeDate(val){
            if(!(val[0] && val[1])){
                this.body.documentTimeStart = null;
                this.body.documentTimeEnd = null;
            }
        },
        hideSearchOrShowTable() {
            if(this.isSearchHide === true){
                this.isSearchHide = false;
                return;
            }
            if(this.isTabulationHide === false){
                this.isTabulationHide = true;
                return;
            }
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
                $(".chevron").css("top","84%")
            }else{
                $(".chevron").css("top","")
            }
        },
        search(){
            if(this.selectDateArr.length > 0 && this.selectDateArr[0] && this.selectDateArr[1]){
                this.body.documentTimeStart = this.selectDateArr[0].format("yyyy-MM-dd");
                this.body.documentTimeEnd = this.selectDateArr[1].format("yyyy-MM-dd");
            }else {
                this.body.documentTimeStart = '';
                this.body.documentTimeEnd = '';
            }
            if(this.commodityCategoty.length > 0){
                this.body.productTypeId=this.commodityCategoty[this.commodityCategoty.length-1];
            }else {
                this.body.productTypeId='';
            }
          this.reload=!this.reload;
        },
        clear(){
            if(this.body.inspectorId){
                this.$refs.inspectorId.reset();
                this.$nextTick(()=>{
                    this.body.inspectorId='';
                });
            }
            this.body.upstreamSourceCode = '';
            this.body.documentCode= '';
            this.body.documentTimeStart='';
            this.body.documentTimeEnd='';
            this.body.businessType='';
            this.body.documentStatus='';
            this.body.sourceDocumentCode='';

            this.body.productTypeId='';
            this.commodityCategoty=[];
            this.selectDateArr=[];
            this.reload=!this.reload;
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

        refresh(){

        },
        showList(){

        },
        addAttachment(){

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
                            title: '提示信息'
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
                        //刷新页面
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
        submit(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                // layer.alert("请先选择一条数据!");
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                // layer.alert("只能选择一条数据!");
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let row = rowDatas[0];
            if(row.documentStatus == 'auditing' ||
               row.documentStatus == 'await_check'||
               row.documentStatus == 'checking'
            ){
               // layer.alert("当前单据状态不可提交!");
                _this.$Modal.info({
                    content: "当前单据状态不可提交!",
                    title: '提示信息'
                })
               return false;
            }
            $.ajax({
                url: contextPath+'/testDocument/submit',
                method: 'post',
                dataType: "json",
                data: {"testDocumentId":row.id},
                success: function (res) {
                    if (res.code === '100100') {
                         // layer.alert("提交成功!");
                        _this.$Modal.success({
                            content: "提交成功!",
                            title: '提示信息'
                        })
                        _this.reload = !_this.reload;
                    } else {
                        // layer.alert(res.msg);
                        _this.$Modal.info({
                            content: res.msg,
                            title: '提示信息'
                        })
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        genSpecialRelease(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                // layer.alert("请先选择一条数据!");
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                // layer.alert("只能选择一条数据!");
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let row = rowDatas[0];
            console.log('row:',row)
            let statsus = row.documentStatus;
            console.log(row.unqualifiedTotalAmount)
            let id = row.id;
            let specialFlag = [];
            if(statsus === 'auditing' ){

                if(row.unqualifiedTotalAmount == 0){
                    // layer.alert('没有不合格的商品编码数据，无需生成特别放行单');
                    _this.$Modal.info({
                        content: "没有不合格的商品编码数据，无需生成特别放行单",
                        title: '提示信息'
                    })
                    return false;
                }

                $.ajax({
                    type: "POST",
                    url: contextPath+"/testDocument/isSpecialOrComfirm",
                    data: {testDocumentId:id,type:'spercial' },
                    dataType: "json",
                    success: function (res) {
                        if(res.data === 'specialAcross'){
                            window.parent.activeEvent({name: '生成特别放行单', url: contextPath+'/quality/quality/specialReleaseDocumentInfo.html?type=1&code='+row.sourceDocumentCode});
                          }else {
                            // layer.alert(res.data);
                            _this.$Modal.info({
                                content: res.data,
                                title: '提示信息'
                            })
                        }
                    },
                    error: function (err) {
                        layer.alert(res.data);
                    },
                });
            }else {
                // layer.alert("检验单未审核，请审核!");
                _this.$Modal.info({
                    content: "检验单未审核，请审核!",
                    title: '提示信息'
                })
            }
        },
        confirmResult(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let row = rowDatas[0];
            console.log('row:',row)
            let statsus = row.documentStatus;
            let id = row.id;
            if(statsus === 'auditing')
            {
                //判断是否需要反写不合格数
                $.ajax({
                    type: "POST",
                    url: contextPath+"/testDocument/isSpecialOrComfirm",
                    data: {testDocumentId:id,type:'comfirm' },
                    dataType: "json",
                    success: function (res) {
                        if(res.data === 'comfirmAcross'){
                            // layer.alert('已确认检验结果');
                            _this.$Modal.info({
                                content: "已确认检验结果!",
                                title: '提示信息'
                            })
                        }else {
                            // layer.alert(res.data);
                            _this.$Modal.info({
                                content: res.data,
                                title: '提示信息'
                            })
                        }
                    },
                    error: function (err) {
                        // layer.alert(res.data);
                        _this.$Modal.info({
                            content: res.data,
                            title: '提示信息'
                        })
                    },
                });
            }
            else
            {
                // layer.alert("检验单未审核，请审核!");
                _this.$Modal.info({
                    content: "检验单未审核，请审核!",
                    title: '提示信息'
                })
            }
        },
        getSelectRowData(){
         let selectRowData=[];
            for(let rowId of this.selected){
               let row = $("#jydList").jqGrid('getRowData',rowId);
                selectRowData.push(row);
            }
            return selectRowData;
        },
        genReportPaper(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let row = rowDatas[0];
            if(row.documentStatus !== 'auditing'){
                // layer.alert("选中的所处状态不允许生成报告单!");
                _this.$Modal.info({
                    content: "选中的所处状态不允许生成报告单!",
                    title: '提示信息'
                })
                return false;
            }
            window.parent.activeEvent({name: '生成报告单', url: contextPath+'/quality/quality/inspection-report.html', params: {"testDocumentId":row.id,"code":row.documentCode}});
        },
        upperSearch(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let row = rowDatas[0];
        },
        addNew(){
            let _this = this;
            if(this.body.documentType == 'lljyd'){
                window.parent.activeEvent({name: '新增来料检验单', url: contextPath+'/quality/test-document/test-document-add.html',params:{ger:'ll'}});
            } else if(this.body.documentType == 'tbjyd'){
                window.parent.activeEvent({name: '新增调拨检验单', url: contextPath+'/quality/test-document/test-document-add.html',params:{ger:'db'}});
            } else if(this.body.documentType == 'fhjyd'){
                window.parent.activeEvent({name: '新增发货检验单', url: contextPath+'/quality/test-document/test-document-add.html',params:{ger:'fh'}});
            }
        },
        update(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let code = rowDatas[0].id;
            console.log("rowDatas:=====",rowDatas[0]);
            if(this.body.documentType == 'lljyd'){
                window.parent.activeEvent({name: '修改来料检验单', url: contextPath+'/quality/test-document/test-document-add.html',params:{code:code,type:"update",ger:'ll'}});
            } else if(this.body.documentType == 'tbjyd'){
                window.parent.activeEvent({name: '修改调拨检验单', url: contextPath+'/quality/test-document/test-document-add.html',params:{code:code,type:"update",ger:'db'}});
            } else if(this.body.documentType == 'fhjyd'){
                window.parent.activeEvent({name: '修改发货检验单', url: contextPath+'/quality/test-document/test-document-add.html',params:{code:code,type:"update",ger:'fh'}});
            }


            // window.parent.activeEvent({name: '修改检验单', url: contextPath+'/quality/test-document/test-document-add.html', params: {code:code,type:"update"}});
        },
        documentCodeClick(code,scode){
            window.parent.activeEvent({name: '查看检验单', url: contextPath+'/quality/test-document/test-document.html', params: {code:code,scode:scode,type:1}});
        },
        approval(){
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let invalidArr = [];
            console.log(rowDatas)
            for(let row of rowDatas){
                if(row.documentStatus !='await_check'&&row.documentStatus !='checking'&&row.documentStatus !='reject'){
                   invalidArr.push(row.documentCode);
                }
            }
            if(invalidArr.length > 0){
                // layer.alert("编号为"+invalidArr.join(",")+"的单据，当前状态不可以审核!");
                _this.$Modal.info({
                    content: "编号为"+invalidArr.join(",")+"的单据，当前状态不可以审核!",
                    title: '提示信息'
                })
                return false;
            }
            //发送请求
            if(rowDatas[0].documentCode === "" || rowDatas[0].documentStatus === "temporary_save"){
                // layer.alert("请提交检验单!");
                _this.$Modal.info({
                    content: "请提交检验单!",
                    title: '提示信息'
                })
                return false;
            }
            let id = rowDatas[0].id;
            let status = rowDatas[0].documentStatus;
            _this.testDocumentId = id;
            _this.receiptsId = rowDatas[0].documentCode;
            _this.documentStatus =rowDatas[0].documentStatus;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/findUserOperation",
                contentType: 'application/json',
                data: JSON.stringify({receiptsId:rowDatas[0].documentCode,docTypeCode:`${rowDatas[0].documentType}_code`}),
                dataType: "json",
                success: function(data) {
                    if(data.code === "100515"){
                        // layer.alert("审核成功");
                        _this.$Modal.success({
                            content: "审核成功!",
                            title: '提示信息'
                        })
                        _this._ajaxUpdateDocumentStatus(id,"auditing");
                    }
                    if(data.code === "100514"){
                        let msg = data.data === 1 ? "【一级审核】":data.data === 2 ?
                            "【二级审核】":data.data === 3 ? "【三级审核】":data.data === 4 ?
                                "【四级审核】":data.data === 5 ? "【五级审核】":data.data === 6 ?
                                    "【六级审核】":data.msg;
                        // layer.alert(data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限");
                        _this.$Modal.info({
                            content: data.data === 0 ? "该单据已被驳回到申请人，待申请人提交!":"您没有"+msg+"的审核权限",
                            title: '提示信息'
                        })
                    }
                    if(data.code === "100100"){
                        if(status === "auditing"){
                            // layer.alert("检验单已审核");
                            _this.$Modal.info({
                                content: "检验单已审核!",
                                title: '提示信息'
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
                        content: "服务器出错，请稍后再试!",
                        title: '提示信息'
                    })
                }
            })
        },
        //驳回
        reject() {
            let _this=this;
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                _this.$Modal.info({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }else if(rowDatas.length > 1){
                _this.$Modal.info({
                    content: "只能选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let invalidArr = [];
            for(let row of rowDatas){
                if(row.documentStatus =='temporary_save' ||rowDatas[0].documentStatus === "" || row.documentStatus === 'auditing'){
                    invalidArr.push(row.documentCode);
                }
            }
            if(invalidArr.length > 0){
                // layer.alert("编号为"+invalidArr.join(",")+"的单据，当前状态不可以驳回!");
                _this.$Modal.info({
                    content: "编号为"+invalidArr.join(",")+"的单据，当前状态不可以驳回!",
                    title: '提示信息'
                })
                return false;
            }
            //发送请求
            if(rowDatas[0].documentStatus === "" || rowDatas[0].documentStatus === "temporary_save"){
                // layer.alert("请提交检验单!");
                _this.$Modal.info({
                    content: "请提交检验单!",
                    title: '提示信息'
                })
                return false;
            }
            let id = rowDatas[0].id;
            let status = rowDatas[0].documentStatus;
            _this.testDocumentId = id;
            _this.receiptsId = rowDatas[0].documentCode;
            let testDocumentCode = rowDatas[0].documentCode;
            _this.documentStatus =rowDatas[0].documentStatus;

            if(rowDatas[0].documentCode === "temporary_save"){
                _this.$Modal.info({
                    content: "请提交检验单!",
                    title: '提示信息'
                })
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/isReject",
                data: {testDocumentId:id ,testDocumentCode:testDocumentCode},
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
                                data: JSON.stringify({receiptsId:_this.receiptsId,docTypeCode:"jyd"}),
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
                                        content: "服务器出错，请稍后再试！",
                                        title: '提示信息'
                                    })
                                }
                            })
                        }
                        else
                        {
                            // layer.alert("该检验单有生成子单，请勿驳回");
                            _this.$Modal.info({
                                content: "该检验单有生成子单，请勿驳回！",
                                title: '提示信息'
                            })
                        }
                    }
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    _this.$Modal.info({
                        content: '服务器出错,请稍后再试！',
                        title: '提示信息'
                    })
                }
            })
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
                            title: '提示信息'
                        })
                        _this.documentStatus='reject';
                        if(data.data.approvalStatus == -2){
                            _this.documentStatus = "temporary_save";
                        }
                        _this._ajaxUpdateDocumentStatus(_this.testDocumentId, _this.documentStatus);
                    }else {
                        // layer.alert("驳回失败");
                        _this.$Modal.info({
                            content: "驳回失败",
                            title: '提示信息'
                        })
                    }
                    _this.rejectement = {receiptsId:'',approvalResult:'0',approvalInfo:''};
                    _this.reload=!this.reload;
                    _this.initApproval();
                },
                error: function(err){
                    // layer.alert("服务器出错");
                    _this.$Modal.info({
                        content: "服务器出错，请稍后再试！",
                        title: '提示信息'
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
                    // alert('服务器出错啦');
                    _this.$Modal.info({
                        content: "服务器出错，请稍后再试！",
                        title: '提示信息'
                    })
                }
            })
        },
        DeleteOneRow(){
            let _this=this;
            console.log(_this.selected)
            let rowDatas=_this.getSelectRowData();
            if(rowDatas.length < 1){
                // layer.alert("请先选择一条数据!");
                _this.$Modal.warning({
                    content: "请先选择一条数据!",
                    title: '提示信息'
                })
                return false;
            }
            let sendData=[];

            for(let row of rowDatas){
                sendData.push({id:row.id,documentStatus:row.documentStatus,documentCode:row.documentCode})
            }
            _this.$Modal.confirm({
                content:"确认删除吗?",
                onOk:function (index, layero) {
                    $.ajax({
                        url: contextPath + '/testDocument/delete',
                        method: 'post',
                        dataType: "json",
                        data: JSON.stringify(sendData),
                        contentType: 'application/json;charset=utf-8',
                        success: function (res) {
                            if (res.code === '100100') {
                                // layer.closeAll('dialog');  //加入这个信息点击确定 会关闭这个消息框
                                let msg = res.data;
                                if (msg.indexOf("\r\n") != -1) {
                                    msg = msg.replace(/\r\n/g, '<br/>');
                                }
                                // layer.alert(msg);
                                _this.$Modal.info({
                                    content: msg,
                                    title: '提示信息'
                                })
                                //重新加载表单页
                                _this.reload = !_this.reload;
                            } else {
                                // layer.alert(res.msg);
                                _this.$Modal.info({
                                    content: res.msg,
                                    title: '提示信息'
                                })
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    })
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
                    _this.$Spin.hide();
                    console.log("服务器出错");

                },
            });
        },
        fetchDocumentType(){
            let _this = this;
            _this.documentTypeArr= getCodeList('zj_jzyfdydlx');
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
        fetchDocumentStatus(){
            let _this = this;
            let documentStatusList = getCodeList('zj_document_status');
            _this.documentStatusArr=[];
            documentStatusList.forEach(item=>{
                _this.documentStatusArr.push({name:item.name,value:item.value});
            });
        },
        formatterDocumentStatus(value){
            if(!value){
                return '';
            }else if(this.documentStatusArr.length < 1){
                return value;
            }
            return this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;

        },
        unformatDocumentStatus(value){
            if(!value){
                return '';
            }else if(this.documentStatusArr.length < 1){
                return value;
            }
            return this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.name; }).indexOf(value)]
                ? this.documentStatusArr[this.documentStatusArr.map(function(e) { return e.name; }).indexOf(value)].value
                : value;

        },
        fetchBusinessType(){
            let _this = this;
            let bussinessTypes = getCodeList('root_zj_jydywlx');
            let bizType = getQueryString("documentType");
            switch(bizType){

                case 'lljyd': _this.businessTypeArr = bussinessTypes.filter(item=>(item.value !== 'xsjy'&& item.value !== 'yllyjy')); break;
                case 'fhjyd': _this.businessTypeArr = bussinessTypes.filter(item=>item.value === 'xsjy'); break;
                case 'tbjyd': _this.businessTypeArr = bussinessTypes.filter(item=>(item.value === 'xsjy'||item.value === 'yllyjy')); break;
                default: _this.businessTypeArr = bussinessTypes;

            }
            // _this.businessTypeArr=[];
            // bussinessTypes.forEach(item=>{
            //     _this.businessTypeArr.push({name:item.name,value:item.value});
            // });
        },
        fetchSourceDocumentType(){
            let _this = this;
            let sourceDocumentTypes = getCodeList('root_zj_jydydlx');
            _this.sourceDocumentTypeArr = [];
            sourceDocumentTypes.forEach(item=>{
                _this.sourceDocumentTypeArr.push({name:item.name,value:item.value});
            });
        },
        formatterSourceDocumentType(value){
            if(!value){
                return '';
            }else if(this.sourceDocumentTypeArr.length < 1){
                return value;
            }
            return this.sourceDocumentTypeArr[this.sourceDocumentTypeArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.sourceDocumentTypeArr[this.sourceDocumentTypeArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;

        },
        unformatSourceDocumentType(value){
            if(!value){
                return '';
            }else if(this.sourceDocumentTypeArr.length < 1){
                return value;
            }
            return this.sourceDocumentTypeArr[this.sourceDocumentTypeArr.map(function(e) { return e.name; }).indexOf(value)]
                ? this.sourceDocumentTypeArr[this.sourceDocumentTypeArr.map(function(e) { return e.name; }).indexOf(value)].value
                : value;

        },
        loadProductType(){
            //获取商品类型
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
                        content: '服务器出错,请稍后再试！',
                        title: '警告'
                    })
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
        fetchInspectors(){
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath+"/testDocument/getCurrentUserOrgEmployees",
                contentType: 'application/json',
                dataType: "json",
                success: function(res) {
                    _this.inspectors=[];
                    if(res.code === '100100' && res.data.length > 0){
                        for(let emp of res.data){
                            _this.inspectors.push({label:emp.empName,value:emp.id,code:emp.empCode});
                        }
                    }
                    console.log(res)

                },
                error: function(err){
                    _this.$Spin.hide();
                    console.log("服务器出错");
                },
            });
        },
        fetchTestResult(){
            let _this = this;
            let testResults = getCodeList('zj_jyjg');
            _this.testResultArr =[];
            testResults.forEach(item=>{
                _this.testResultArr.push({name:item.name,value:item.value});
            });
        },
        formatterTestResult(value){
            if(!value){
                return '';
            }else if(this.testResultArr.length < 1){
                return value;
            }
            return this.testResultArr[this.testResultArr.map(function(e) { return e.value; }).indexOf(value)]
                ? this.testResultArr[this.testResultArr.map(function(e) { return e.value; }).indexOf(value)].name
                : value;
        },
        unformatTestResult(value){
            if(!value){
                return '';
            }else if(this.testResultArr.length < 1){
                return value;
            }
            return this.testResultArr[this.testResultArr.map(function(e) { return e.name; }).indexOf(value)]
                ? this.testResultArr[this.testResultArr.map(function(e) { return e.name; }).indexOf(value)].value
                : value;
        },
        setColumns(){

        },
        toProductDetail(){

        },
        exit(){
            window.parent.closeCurrentTab({openTime:this.openTime, exit: true});
        }

    },
    watch:{
        'body.inspectorId': function(val) {
            if (typeof val == 'undefined') {
                this.body.inspectorId = '';
            }
        },
        'body.businessType': function(val) {
            if (typeof val == 'undefined') {
                this.body.businessType = '';
            }
        },
        'body.documentStatus': function(val) {
            if (typeof val == 'undefined') {
                this.body.documentStatus = '';
            }
        }
    },
    mounted() {

        this.openTime = window.parent.params.openTime;
        this.fetchDocumentStatus();
        this.fetchBusinessType();
        this.loadProductType();
        this.fetchInspectors();
        this.fetchSourceDocumentType();
        this.fetchTestResult();
    }
});