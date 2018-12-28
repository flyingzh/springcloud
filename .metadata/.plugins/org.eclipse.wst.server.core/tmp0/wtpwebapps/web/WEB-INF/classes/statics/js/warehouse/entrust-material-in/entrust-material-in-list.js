var vm = new Vue({
    el: "#entrustMaterialInList",
    data: {
        openTime:"",
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        selectRowData:[],
        selected:'',
        documentTimeArr:[],
        categoryType:[],
        productId:"",
        body: {
            documentNo: "",
            customCode:"",
            goodsTypeName:"",
            startTime:"",
            endTime:"",
            custId:""
        },
        customerModel: {},
        custList:[],
        entrustMaterialIn:{
            id:'',
            documentNo:'',
            documentStatus:''
        },
        //控制弹窗显示
        modalTrigger:false,
        modalType:'',
        //审批进度条
        stepList: [],
        data_config: {
            url: contextPath+"/entrustMaterialInController/list",
            datatype:"json",
            colNames: ['id','组织id','日期', '单据编号','单据状态','客户', '商品类型', '商品总数量', '商品总重量'],
            colModel:[
                {name:'id',index:'id',hidden:true},
                {name:'organizationId',index:'organizationId',hidden:true},
                {
                    name: "documentTime",
                    width: 210,
                    align: "left",
                    formatter: function (value) {
                        if(value){
                            return new Date(value).format("yyyy-MM-dd")
                        }
                        return '';
                    }
                },
                {
                    name: "documentNo",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                            vm.updateDetail({value, grid, rows, state})
                        });
                        let btns = `<a class="updateDetail${value}">${value}</a>`;
                        return btns;
                    },
                    unformat:function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {
                    name: "documentStatus",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        return value === 1 ? "暂存": value === 2 ?
                            "待审核":value === 3 ? "审核中":value === 4 ?
                                "已审核":value === 5 ? "驳回":"";
                    },
                    unformat:function (value, grid, rows) {
                        return value === "暂存" ? 1: value === "待审核" ?
                            2:value === "审核中" ? 3:value === "已审核" ?
                                4:value === "驳回" ? 5:"";
                    }
                },
                {name: "custName", width: 210, align: "left"},
                {name: "goodsTypeName",  align: "left", width: 210},
                {name: "number",  align: "right", width: 210},
                {name: "weight",  align: "right", width: 210}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        refresh() {
            this.clear();
            this.selected = '';
            this.reload = !this.reload;
        },
        clear() {
            console.log("点击了清空");
            this.body.documentNo = "";
            this.body.customCode = "";
            this.body.goodsTypeName ="";
            this.body.startTime = "";
            this.body.endTime = "";
            if(this.documentTimeArr) {
                this.$nextTick(() => {
                    this.documentTimeArr = [];
                })
            }
            if(this.productId){
                this.$nextTick(() => {
                    this.productId = [];
                })
            }

            this.$refs.customerRef.clear();

            this.customerModel = {};
        },
        clearData(val){
            if(val === 'productId'){
                this.body.customCode = "";
                this.$nextTick(() => {
                    this.productId = "";
                })
            }
            if(val === 'date'){
                this.body.startTime = '';
                this.body.endTime = '';
                if(this.documentTimeArr) {
                    this.$nextTick(() => {
                        this.documentTimeArr = [];
                    })
                }
            }
        },
        search(){
            console.log("点击了搜索");
            this.reload = !this.reload;
            this.body.custId = this.customerModel.id ? this.customerModel.id : '';
        },
        approval(value) {
            let This = this;
            console.log(This.selected)
            if (!ht.util.hasValue(This.selected, "array")) {

                // This.$Message.warning("请先选择一条记录!");
                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if (This.selected.length > 1) {

                // This.$Message.warning("只能选择一条记录!");
                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            This.entrustMaterialIn.id = This.selected[0].id;
            This.entrustMaterialIn.documentNo = This.selected[0].documentNo;
            This.entrustMaterialIn.documentStatus = This.selected[0].documentStatus;

            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {

                // This.$Message.warning("请先选择一条记录!");
                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if (This.selected.length > 1) {

                // This.$Message.warning("只能选择一条记录!");
                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            This.entrustMaterialIn.id = This.selected[0].id;
            This.entrustMaterialIn.documentNo = This.selected[0].documentNo;
            This.entrustMaterialIn.documentStatus = This.selected[0].documentStatus;

            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.entrustMaterialIn.documentStatus = parseInt(res.result.data);
                this.refresh();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/entrustMaterialInController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.entrustMaterialIn.documentNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.entrustMaterialIn.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.info({content:res.msg,title:"提示信息"});
                    }
                    this.refresh();
                }
            });
        },
        updateStatus(id,documentStatus,documentNo,type){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/update',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({"id":id,"documentStatus":documentStatus,"documentNo":documentNo}),
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100"){
                        This.entrustMaterialIn.documentStatus = documentStatus;
                        if(type === 1){
                            This.$Modal.success({
                                content:"提交成功!",
                                title:"提示信息"
                            });
                        }
                        This.refresh();
                        return false;
                    }
                    if(type === 1){
                        This.$Modal.warning({
                            content:"提交失败!",
                            title:"提示信息"
                        });
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示"});
                }
            })
        },
        add(){
            window.parent.activeEvent({name: '新增受托加工材料入库单', url: contextPath+'/warehouse/entrust-material-in/entrust-material-in-info.html',params: {type:0}});
        },
        submit(){
            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if (This.selected.length > 1) {

                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            if(This.selected[0].documentStatus !== 1){
                This.$Modal.warning({content:"受托加工材料入库单已提交!",title:"提示信息"});
                return false;
            }

            $.ajax({
                type: "POST",
                url: contextPath+"/entrustMaterialInController/getEntrustMaterialIn",
                data: JSON.stringify({"id":This.selected[0].id}),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function(data) {
                    if(data.code === '100100'){
                        if(!data.data.documentTime || !data.data.customCode || !data.data.custId){
                            This.$Modal.info({content:"请输入必填项!",title:"提示信息"});
                            return false;
                        }

                        let $goodList = data.data.goodList;
                        if(ht.util.hasValue($goodList,'array')){
                            let $goodListArr = $goodList.filter(p => !p.goodsNo || !p.number || !p.weight ||
                                !p.warehouseId /*|| !p.reservoirPositionId*/);
                            if(ht.util.hasValue($goodListArr,'array')){
                                This.$Modal.info({content:"请输入必填项!",title:"提示信息"});
                                return false;
                            }

                            let $barcodeArr = $goodList.filter(p => p.goodlist && p.goodlist.length === 0);
                            if($barcodeArr && $barcodeArr.length > 0){
                                This.$Modal.info({content:"请输入必填项!",title:"提示信息"});
                                return false;
                            }
                        }else{
                            This.$Modal.info({content:"请输入必填项!",title:"提示信息"});
                            return false;
                        }

                        let idList = [];

                        if(data.data.goodList){
                            data.data.goodList
                                .filter(p=> p.collectGoodId)
                                .forEach(item => {
                                    idList.push(item.collectGoodId);
                                });
                            if (ht.util.hasValue(idList, "array")) {
                                This.checkIsSubmit(idList,This.selected);
                                return false;
                            }
                        }
                        This.updateStatus(This.selected[0].id,2,This.selected[0].documentNo,1);
                        return false;
                    }
                    This.$Modal.warning({content:"系统异常!",title:"提示信息"});
                }
            })

        },
        checkIsSubmit(idList,arr){
            let This = this;
            var getResult = $.ajax({
                type: "post",
                url: contextPath + '/entrustMaterialInController/queryStorageStatus',
                data: JSON.stringify(idList),
                contentType: 'application/json',
                dataType: "json",
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});;
                }
            })

            var getResult1 = getResult.then((getResult)=> {
                if (getResult.code === "100100") {

                    if (getResult.data === 0) {
                        This.updateStatus(arr[0].id,2,arr[0].documentNo,1);

                    }else{
                        This.$Modal.warning({
                            content: '商品已提交，请勿重复提交!',
                            title:'提示信息'
                        });
                    }
                }
            });
        },
        update(){

            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if (This.selected.length > 1) {

                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            window.parent.activeEvent({name: '修改受托加工材料入库单', url: contextPath+'/warehouse/entrust-material-in/entrust-material-in-info.html',params: {data:This.selected[0].id,type:1}});
        },
        updateDetail(data){
            console.log(data.value);
            window.parent.activeEvent({name: '查看受托加工材料入库单', url: contextPath+'/warehouse/entrust-material-in/entrust-material-in-info.html',params: {data:data.value,type:2}});
        },
        del(){
            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {

                this.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            }

            this.$Modal.confirm({
                title: '提示信息',
                content:'是否删除该条信息？',
                onOk: () => {
                    let invalidArr = [];
                    let organArr = [];
                    let idArr = [];
                    This.selected.forEach((item)=>{
                        if(item.documentStatus !== 1){
                            invalidArr.push(item.documentNo);
                        }
                        if(item.organazationId !== window.parent.userInfo.organId){
                            organArr.push(item.documentNo);
                        }
                        idArr.push(item.id);
                    });
                    let msg = '';
                    if(invalidArr.length > 0){
                        msg = '单据编号为['+ invalidArr.join(',\n')+']的单据不可删除,已启用审批!';
                        /*This.$Modal.warning({
                            content: msg,
                            duration: 3,
                            closable: true
                        });
                        This.refresh();*/
                        setTimeout(function () {
                            This.$Modal.info({
                                content: msg,
                                duration: 3,
                                closable: true,
                                title:"提示信息",
                                onOk: function () {
                                    This.refresh();
                                }
                            })
                        }, 300);
                        return false;
                    }
                    $.ajax({
                        type: "POST",
                        url: contextPath+'/entrustMaterialInController/delete',
                        data:JSON.stringify(idArr),
                        dataType: "json",
                        contentType:'application/json; charset=utf-8',
                        success: function (data) {
                            console.log(data.data);
                            if(data.code === "100100"){
                                if(data.data > 0){
                                    setTimeout(() => {
                                        This.$Modal.success({
                                            content: '删除成功',
                                            onOk: function () {
                                                This.refresh();
                                            }
                                        })
                                    }, 300)
                                }else{
                                    setTimeout(() => {
                                        This.$Modal.warning({
                                            content: '删除失败',
                                            onOk: function () {
                                                This.refresh();
                                            }
                                        })
                                    }, 300)
                                }
                            }
                        },
                        error: function(err){
                            This.$Modal.warning({content:"服务器出错",title:"提示信息"});
                        }
                    })
                },
                onCancel: () => {
                    console.log("点击了取消");
                }
            });
        },
        exit(){
            window.parent.closeCurrentTab({name:'受托加工材料入库单-列表',exit: true, openTime:this.openTime});
        },
        changeDate(value){
            let startTime = value[0].replace(/\//g, '-') ? value[0].replace(/\//g, '-') + ' 00:00:00' : '';
            let endTime = value[1].replace(/\//g, '-') ? value[1].replace(/\//g, '-') + ' 23:59:59' : '';
            this.body.startTime= startTime;
            this.body.endTime=endTime;
        },
        //获取商品类型
        loadProductType(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryStyleCategory',
                dataType: "json",
                success: function (data) {
                    This.categoryType = This.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        //监听商品类型内容改变,根据商品分类id
        changeproductTypeName(selectedData,arr){
            //获取商品分类名称

            let customCode = arr.length > 0 ? arr[arr.length-1]['value'] : '';
            this.body.customCode = customCode;

        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
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
        }/*,
        //获取客户
        getCust(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/entrustMaterialInController/queryAllCustomer',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("客户",data)
                    This.custList = data.data;
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        }*/
    },
    mounted() {
        this.loadProductType();
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    }
})