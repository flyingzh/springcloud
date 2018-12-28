var vm = new Vue({
    el: "#returnGoodsList",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        selected:'',
        selectType: [
            {
                value: "W_RETURN_01",
                label: "普通销售退货"
            },
            {
                value: "W_RETURN_02",
                label: "受托加工销售退货"
            }
        ],
        refundGoods:{
            id:'',
            documentNo: '',
            documentStatus:''
        },
        documentTimeArr:[],
        body: {
            businessType:"",
            documentNo: "",
            startTime:"",
            endTime:"",
            custId:""
        },
        customerModel: {},
        custList:[],
        //控制弹窗显示
        modalTrigger:false,
        modalType:'',
        //审批进度条
        stepList: [],
        data_config: {
            url:contextPath+"/refundGoodsController/list",
            datatype:"json",
            colNames: ['id','日期', '单据编号','单据状态','业务类型', '退货客户', '总数量',"总重量","退货原因"],
            colModel:[
                {name:"id",index:"id",hidden:true},
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
                                4:value === "驳回" ? 5:0;
                    }
                },
                {
                    name: "businessType",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        return value === "W_RETURN_01" ? "普通销售退货": value === "W_RETURN_02" ?
                            "受托加工销售退货":"";
                    },
                    unformat:function (value, grid, rows) {
                        return value === "普通销售退货" ? "W_RETURN_01": value === "受托加工销售退货" ?
                            "W_RETURN_02":"";
                    }
                },
                {name: "custName", align: "left", width: 210},
                {name: "number", align: "right", width: 210},
                {name: "weight", align: "right", width: 210},
                {name: "returnReason", align: "left", width: 210}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }
    },
    methods: {
        clear() {
            this.body.documentNo = "";
            this.body.startTime = "";
            this.body.endTime = "";

            if(this.body.businessType){
               this.$refs.businessType.reset();
               this.$nextTick(() => {
                   this.body.businessType = "";

               })
            }
            this.$refs.customerRef.clear();

            this.customerModel = {};

            this.documentTimeArr = [];
        },
        clearData(val){
            if(val === 'businessType'&& this.body.businessType){
                this.$refs.businessType.reset();
                this.$nextTick(() => {
                    this.body.businessType = "";

                })
            }
            if(val === 'date'){
                this.body.startTime = '';
                this.body.endTime = '';
                if(this.createdDate) {
                    this.$nextTick(() => {
                        this.createdDate = [];
                    })
                }
            }
        },
        refresh() {
           this.clear();
           this.reload = !this.reload;
        },
        search() {
            this.reload = !this.reload;
            this.body.custId = this.customerModel.id ? this.customerModel.id : '';
        },
        changeDate(value){
            let startTime = value[0].replace(/\//g, '-') ? value[0].replace(/\//g, '-') + ' 00:00:00' : '';
            let endTime = value[1].replace(/\//g, '-') ? value[1].replace(/\//g, '-') + ' 23:59:59' : '';
            this.body.startTime= startTime;
            this.body.endTime=endTime;
        },
        add(){
            window.parent.activeEvent({name: '新增销售退货单', url: contextPath+'/warehouse/return-goods/return-goods-info.html',params: {type:0}});
        },
        submit(){
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if ($selected.length > 1) {

                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            if($selected[0].documentStatus !== 1){
                This.$Modal.success({content:"销售退货单已提交!",title:"提示信息"});
                return false;
            }

            $.ajax({
                type: "POST",
                url: contextPath+"/refundGoodsController/getRefundGoods",
                data: JSON.stringify({"id":$selected[0].id}),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function(data) {
                    if(data.code === "100100"){
                        if(!data.data.custId || !data.data.documentTime ||
                            !data.data.businessType || !data.data.goodsPath){
                            This.$Modal.info({content:"请输入必填项!",title:"提示信息"});
                            return false;
                        }

                        let $goodList = data.data.goodList;
                        if(ht.util.hasValue($goodList,'array')){
                            let $goodListArr = $goodList.filter(p => !p.goodsNo || !p.num || !p.weight ||
                                !p.warehouseId /*|| !p.reservoirPositionId*/);
                            if(ht.util.hasValue($goodListArr,'array')){
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
                                .filter(p=> p.refunedGoodsId)
                                .forEach(item => {
                                    idList.push(item.refunedGoodsId);
                                });
                            if (ht.util.hasValue(idList, "array")) {
                                This.checkIsSubmit(idList,$selected)
                                return false;
                            }
                        }
                        This.updateStatus($selected[0].id,2,$selected[0].documentNo,1);
                        return false;
                    }
                    This.$Modal.warning({content:"系统异常!",title:"提示信息"});
                },
                error: function(err){
                    This.$Modal.warning({content:"服务器出错",title:"提示信息"});
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
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })

            var getResult1 = getResult.then((getResult)=> {
                if (getResult.code === "100100") {

                    if (getResult.data === 0) {
                        This.updateStatus(arr[0].id,2,arr[0].documentNo,1);
                    }else{
                        This.$Modal.warning({
                            content: '商品已提交，请勿重复提交!',
                            title:'提示'
                        });
                    }
                }
            });
        },
        update(){
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if ($selected.length > 1) {

                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }
            window.parent.activeEvent({name: '修改销售退货单', url: contextPath+'/warehouse/return-goods/return-goods-info.html',params: {data:$selected[0].id,type:1}});
        },
        updateDetail(data){
            console.log(data.value);
            window.parent.activeEvent({name: '查看销售退货单', url: contextPath+'/warehouse/return-goods/return-goods-info.html',params: {data:data.value,type:2}});
        },
        del(){
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                this.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            }

            this.$Modal.confirm({
                title: '提示',
                content:'是否删除该条信息？',
                onOk: () => {
                    let invalidArr = [];
                    let idArr = [];
                    $selected.forEach((item)=>{
                        if(item.documentStatus != 1){
                            invalidArr.push(item.documentNo);
                        }
                        idArr.push(item.id);
                    });
                    let msg = '';
                    if(invalidArr.length > 0){
                        msg = '单据编号为['+ invalidArr.join(',\n')+']的单据不可删除,已启用审批!'
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
                        url: contextPath+'/refundGoodsController/delete',
                        data:JSON.stringify(idArr),
                        dataType: "json",
                        contentType:'application/json; charset=utf-8',
                        success: function (data) {
                            console.log(data.data);
                            if(data.code === "100100"){
                                if(data.data > 0){
                                    setTimeout(function () {
                                        This.$Modal.success({
                                            content: '删除成功',
                                            title:"提示信息",
                                            onOk: function () {
                                                This.refresh();
                                            }
                                        })
                                    }, 300)
                                }else{
                                    setTimeout(function () {
                                        This.$Modal.warning({
                                            content: '删除失败',
                                            title:"提示信息",
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
        approval(value) {
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if ($selected.length > 1) {

                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            This.refundGoods.id = $selected[0].id;
            This.refundGoods.documentNo = $selected[0].documentNo;
            This.refundGoods.documentStatus = $selected[0].documentStatus;

            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(value) {
            let This = this;

            let $selected = this.getSelectedRows();

            if (!ht.util.hasValue($selected, "array")) {

                This.$Modal.info({content:"请先选择一条记录!",title:"提示信息"});
                return false;
            } else if ($selected.length > 1) {

                This.$Modal.info({content:"只能选择一条记录!",title:"提示信息"});
                return false;
            }

            This.refundGoods.id = $selected[0].id;
            This.refundGoods.documentNo = $selected[0].documentNo;
            This.refundGoods.documentStatus = $selected[0].documentStatus;

            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.refundGoods.documentStatus = parseInt(res.result.data);
                _this.refresh();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/refundGoodsController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.refundGoods.documentNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.refundGoods.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.warning({content:res.msg,title:"提示"});
                    }
                    _this.refresh();
                }
            });
        },
        updateStatus(id,documentStatus,documentNo){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/refundGoodsController/update',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({"id":id,"documentStatus":documentStatus,"documentNo":documentNo}),
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100"){
                        This.refundGoods.documentStatus = documentStatus;
                        This.refresh();
                        console.log("修改成功");
                    }
                },
                error: function () {
                    This.$Modal.warning({content:'服务器出错啦',title:"提示信息"});
                }
            })
        },
        exit(){
            window.parent.closeCurrentTab({name:'销售退货单',exit: true, openTime:this.openTime});
        },
        getSelectedRows(){
            let selectRowArr=[];

            for (let rowId of this.selected){
                let selectRow=$("#myTable").jqGrid('getRowData',rowId);
                selectRowArr.push(selectRow);
            }

            return selectRowArr;
        }/*,
        //获取客户
        getCust(){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/refundGoodsController/queryAllCustomer',
                contentType: 'application/json',
                dataType: "json",
                success: function (data) {
                    console.log("客户",data)
                    This.custList = data.data;
                },
                error: function () {
                    This.$Modal.warning({content:"服务器出错啦",title:"提示信息"})
                }
            })
        }*/
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    }
})