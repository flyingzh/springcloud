var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        isHide: true,
        selected:[],
        body: {
            goodsTypeId: '',
            docStatus:'',
            stockNo:'',
            supplierId:'',
        },
        data_config: {
            url: contextPath+"/purchasestock/list",
            datatype:"json",
            colNames: ['id','单据编号','商品类型','日期', '供应商', '单据状态', '入库重量',"入库数量"],
            colModel:[
                {name: "id",width: 210, align: "left",hidden:true},
                {name: "stockNo",width: 210, align: "left",formatter(value,grid,rows){
                    $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                        e.preventDefault();
                        vm.goQuery(rows.stockNo);
                    });
                    let tags = `<a class="detail${value}">${value}</a>`;
                    return tags;
                },
                    unformat:function (val,grid,rows) {
                        return val.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {name: "goodsType",width: 210, align: "left"},
                {name: "stockTime", width: 210, align: "left"},
                {name: "supplierName",width: 210, align: "left"},
                {name: "docStatus", align: "left", width: 210,
                formatter(value){
                    switch (value){
                        case 1:return '暂存';break;
                        case 2:return '待审核';break;
                        case 3:return '审核中';break;
                        case 4:return '已审核';break;
                        case 5:return '驳回';break;
                        default:return '';
                    }
                },
                unformat(value){
                    switch (value){
                        case '暂存'  :return 1;break;
                        case '待审核':return 2;break;
                        case '审核中':return 3;break;
                        case '已审核':return 4;break;
                        case '驳回'  :return 5;break;
                        default:return '';
                    }
                }},
                {name: "totalRecWeight", align: "right", width: 210},
                {name: "totalRecNum", align: "right", width: 210}
            ],
        },
        docStatusArr:[
            {label:'暂存',value:1},
            {label:'待审核',value:2},
            {label:'审核中',value:3},
            {label:'已审核',value:4},
            {label:'驳回',value:5}
            ],
        supplierArr:[],
        goodsTypeArr:[],
        selectDates:[],
        selectedDocStatus:'',
        categoryType:[],
        goodsTypes:[],
        openTime:'',
        modalTrigger:true,
        modalType:'',
        stepList:[],
        curStockNo:'',
        curDocStatus:''

    },
    created(){
        //load data for supplier drop-down lists
        this.loadSuppliers();
        //load data for goods category drop-down lists
        this.loadCategories();
        this.openTime = window.parent.params.openTime;
    },
    methods: {
        print(){
            // call chrome print api
            htPrint();
        },
        closeSupplier(id,code,name){
            this.body.supplierId = id;
        },
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code === '100100'){
                  _this.reload = !_this.reload;
            }
        },
        autoSubmitOrReject(result){
            let _this = this;
            $.ajax({
                url:contextPath + '/purchasestock/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.psiForm.stockNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.reload = !_this.reload;
                    }else {
                        _this.$Modal.warning({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },
        changeGoodsType(a,b){
            let _this = this;
            if(!a.length && !b.length){
                _this.body.goodsTypeId = null;
            }else {
                _this.body.goodsTypeId = b[b.length - 1].value;
            }
        },
        exit(){
            window.parent.closeCurrentTab({name: '采购入库列表', openTime: this.openTime, exit: true});
        },
        //查看
        goQuery(stockNo){
           let _this = this;
           if(!stockNo){
               _this.$Modal.warning({
                   content:'数据异常!',
                   title:"提示信息"
               });
               return false;
           }
            window.parent.activeEvent(
                {name: '查看采购入库单',
                 url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-info.html',
                 params: {'type':'query','stockNo':stockNo}
                }
                );
        },
        add(){
            window.parent.activeEvent(
                {name: '生成采购入库单',
                 url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-info.html',
                 params: {'type':'add'}
                });
        },
        _approval(){
            let _this = this;
            let isTableSelected = _this.isTableSelected();
            if(!isTableSelected){
                return false;
            }
            if(_this.selected.length > 1){
                _this.$Modal.info({
                    content: '只能选择一条数据!',
                    duration: 3,
                    closable: true,
                    title:"提示信息"
                });
                return false;
            }
            _this.curStockNo = _this.selected[0]['stockNo'];
            _this.curDocStatus = _this.selected[0]['docStatus'];
            _this.modalType = 'approve';
            _this.modalTrigger =!_this.modalTrigger;
        },
        _reject(){
            let _this = this;
            let isTableSelected = _this.isTableSelected();
            if(!isTableSelected){
                return false;
            }
            if(_this.selected.length > 1){
                _this.$Modal.info({
                    content: '只能选择一条数据!',
                    duration: 3,
                    closable: true,
                    title:"提示信息"
                });
                return false;
            }
            _this.curStockNo = _this.selected[0]['stockNo'];
            _this.curDocStatus = _this.selected[0]['docStatus'];
            _this.modalType = 'reject';
            _this.modalTrigger =!_this.modalTrigger;
        },
        submit(){
            let _this = this;
            let isTableSelected = _this.isTableSelected();
            if(!isTableSelected){
                return false;
            }

            if(_this.selected.length > 1){
                _this.$Modal.info({
                    content: '只能选择一条数据!',
                    duration: 3,
                    closable: true,
                    title:"提示信息"
                });
                return false;
            }

            let docStatus = _this.selected[0]['docStatus'];
            if(docStatus != 1){
                _this.$Modal.info({
                    content: '选中的单据当前不可提交!',
                    duration: 3,
                    closable: true,
                    title:"提示信息"
                });
                return false;
            }

            _this.$Modal.confirm({
                title: '提示信息',
                content: '确定提交选中的单据吗?',
                onOk    : function () {
                    _this.ajaxSubmit(_this.selected[0]['id']);
                }
            });
        },
        ajaxSubmit(id){
            let _this=this;
            $.ajax({
                url:contextPath+ '/purchasestock/submit',
                method:'POST',
                dataType:'json',
                data:{id:id},
                success:function (data) {
                   if(data.code === '100100'){
                       _this.$Modal.success({
                           content: '提交成功!',
                           title: "提示信息"
                       });
                       _this.refresh();
                   }else {
                       _this.$Modal.info({
                           content: data.msg,
                           duration: 3,
                           closable: true,
                           title:"提示信息"
                       });
                   }
                }
            });
        },
        handleClearSelect(val){
            this.$refs[val].reset();
            if(this.body.docStatus){
                this.$nextTick(()=>{
                    this.body.docStatus = '';
                });
            }
        },
        //clear the search conditions for this table
        clear() {
            let _this = this;
            _this.goodsTypes=[];
            _this.body.goodsTypeId = '';
            _this.body.startTime = '';
            _this.body.endTime = '';
            _this.body.stockNo = '';
            if(_this.body.docStatus){
                _this.$refs.docStatus.reset();
                _this.$nextTick(()=>{
                    _this.body.docStatus ='';
                });
            }
            if(_this.body.supplierId){
                _this.$refs.selectSupplier.clear();
                _this.body.supplierId = '';
            }
            _this.selectDates = [];

        },
        //would be called when the datepicker changed,
        // then add time search conditions for this table
        changeDate(value){
            if(!value[0] && !value[1]){
                this.$nextTick(()=>{
                    this.body.startTime = null;
                    this.body.endTime = null;
                    this.$refs.dType.visible = false;
                });
            }else {
                this.body.startTime=value[0].replace(/\//g, '-') + ' 00:00:00';
                this.body.endTime=value[1].replace(/\//g, '-') + ' 23:59:59';
            }
        },
        //would be called when the search button clicked,
        //and send ajax request to backend  pulling specific data,
        //finanlly,re-render the data
        search(){
            let _this = this;
            _this.reload = !_this.reload;
            _this.selected = [];
        },
        //would be called when binded vue instance created
        loadSuppliers(){
            let _this=this;
            $.ajax({
                url:contextPath+ '/purchasestock/querySuppliers',
                method:'POST',
                dataType:'json',
                data:{},
                success:function (data) {
                    _this.supplierArr = [];
                    if(data.code === '100100'&& data.data.length > 0 ){
                        data.data.forEach((item)=>{
                            _this.supplierArr.push(Object.assign({},{label:item.siShortName,value:item.id,code:item.supplierCode}));
                        });
                    }else{

                    }
                }
            });
        },
        loadCategories(){
            //记载商品分类数据
                let _this = this;
                $.ajax({
                    type: "post",
                    url: contextPath+'/purchasestock/queryCategories',
                    data:{parentId:0},
                    dataType: "json",
                    success: function (data) {
                        if(data.code === '100100'){
                            _this.categoryType = _this.initGoodCategory(data.data.cateLists);
                        }
                    },
                    error: function () {

                    }
                })
        },
        //递归 组装商品类型级联下拉框 数据
        initGoodCategory(type) {
            let _this = this;
            let result = [];
            type.forEach((item) => {
                let {
                    id: value,
                    name: label,
                    cateLists: children
                } = item;
                if (children) {
                    children = _this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result;
        },
        del(){
            let _this = this;
            let isTableSelected = _this.isTableSelected();
            if(!isTableSelected){
                return false;
            }
            _this.$Modal.confirm({
                title  :'提示信息',
                content:'确定删除选中的数据吗?',
                onOk    :function(){
                    let selectRow = _this.selected
                    let invalidArr = [];
                    let rowIds = [];
                    selectRow.forEach((item)=>{
                        if(item.docStatus != 1){
                            invalidArr.push(item.stockNo);
                        }
                        rowIds.push(item.id);
                    });
                    let msg = '';
                    if(invalidArr.length > 0){
                        msg = '单据编号为['+ invalidArr.join(',')+']的单据不可删除!'
                        _this.$Modal.info({
                            content: msg,
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                        $("#myTable").trigger("reloadGrid");
                        return false;
                    }
                    _this.ajaxDel(rowIds);
                },
            });
        },
        //get jqGrid selected rowData
        getSelectRow(){
            let selectRowData=[];
            for(let rowId of this.selected){
                let row = $("#myTable").jqGrid('getRowData',rowId);
                selectRowData.push(row);
            }
            return selectRowData;
        },
        ajaxDel(rows){
            let _this = this;
            $.ajax({
                url:contextPath+ '/purchasestock/delete',
                method:'POST',
                dataType:'json',
                data:{ids:rows.join(',')},
                success:function (data) {
                    if(data.code === '100100' ){
                        _this.$Modal.success({
                            content: '删除成功!',
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                        _this.reload = !_this.reload;
                        _this.selected = [];
                    }else{
                        _this.$Modal.info({
                            content: data.msg,
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                    }
                }
            });
        },
        ajaxSubmitApproval(){
            let _this = this;
            let stockNo = _this.getSelectRow()[0]['stockNo'];

            _this.approval.receiptsId = stockNo;
            $.ajax({
                url:contextPath+ '/purchasestock/submitapproval',
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(_this.approval),
                success:function (data) {
                    if(data.code === '100100' ){
                        _this.$Message.success({
                            content: '审核成功!',
                            duration: 3,
                            closable: true
                        });
                        let approvalStatus = data.data.approvalStatus;
                        let docStatus = '';
                        if(approvalStatus === 0){
                            docStatus = 3;
                        }else if(approvalStatus === 1){
                            docStatus = 4;
                        }else {
                            _this.$Modal.warning({
                                content: '审核异常!',
                                duration: 3,
                                closable: true,
                                title:"提示信息"
                            });
                            return false;
                        }
                        _this.ajaxUpdateDocStatusById(_this.selected[0],docStatus);
                    }else{
                        _this.$Modal.info({
                            content: data.msg,
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                    }
                    _this.approval={receiptsId: '',approvalResult: '1',approvalInfo: ''}
                }
            });

        },
        ajaxSubmitReject(){
            let _this = this;
            let stockNo = _this.getSelectRow()[0]['stockNo'];
            _this.reject.receiptsId = stockNo;
            $.ajax({
                url:contextPath+ '/purchasestock/submitapproval',
                method:'POST',
                dataType:'json',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify(_this.reject),
                success:function (data) {
                    if(data.code === '100100' ){
                        _this.$Modal.success({
                            content: '驳回成功!',
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                        let approvalStatus = data.data.approvalStatus;
                        let docStatus = 5;
                        if(approvalStatus === -2){
                            docStatus = 1;
                        }else if(!approvalStatus){
                            _this.$Modal.warning({
                                content: '驳回异常!',
                                duration: 3,
                                closable: true,
                                title:"提示信息"
                            });
                            return false;
                        }
                        _this.ajaxUpdateDocStatusById(_this.selected[0],docStatus);
                    }else{
                        _this.$Modal.info({
                            content: data.msg,
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                    }
                    _this.reject={receiptsId: '',approvalResult: '0',approvalInfo: ''}
                }
            });

        },
        ajaxUpdateDocStatusById(id,docStatus){
            let _this = this;
            $.ajax({
                url:contextPath + '/purchasestock/updateDocStatusById',
                method:'POST',
                dataType:'json',
                data:{id:id,docStatus:docStatus},
                success:function (data) {
                    if(data.code === '100100' ){
                        _this.reload = !_this.reload;
                        _this.selected = [];
                    }else{
                        _this.$Modal.info({
                            content: data.msg,
                            duration: 3,
                            closable: true,
                            title:"提示信息"
                        });
                    }
                }
            });
        },
        refresh(){
            let _this = this;
            _this.clear();
            _this.reload = !_this.reload;
            _this.selected = [];
        },
        isTableSelected(){
            let _this = this;
            if(_this.selected.length < 1){
                _this.$Modal.info({
                    content: '请先选择一条数据!',
                    duration: 3,
                    closable: true,
                    title:"提示信息"
                });
                return false;
            }else {
                return true;
            }
        },
        goUpdate(){
            let _this = this;
            let _selectedRowData = this.selected;
            if(_selectedRowData.length == 0){
                _this.$Modal.info({
                    content:'请先选择一条数据!',
                    title:"提示信息"
                });
                return false;
            }
            if(_selectedRowData.length > 1){
                _this.$Modal.info({
                    content:'只能选择一条数据!',
                    title:"提示信息"
                });
                return false;
            }
            if(_selectedRowData[0]['docStatus'] !=1){
                _this.$Modal.info({
                    content:'只有暂存的数据才能修改!',
                    title:"提示信息"
                });
                return false;
            }
            window.parent.activeEvent(
                {name: '采购入库单-修改',
                    url: contextPath+'/warehouse/purchase-stock-in/purchase-stock-in-info.html',
                    params: {'type':'update','stockNo':_selectedRowData[0].stockNo}
                }
            );
        },
    },
    mounted(){

    }
});