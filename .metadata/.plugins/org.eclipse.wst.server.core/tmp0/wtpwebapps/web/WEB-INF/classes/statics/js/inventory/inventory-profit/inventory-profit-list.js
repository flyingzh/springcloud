var vm = new Vue({
    el: "#inventoryProfit",
    data: {
        openTime:'',
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        body:{
            profitLossNo:'',
            planNo:'',
            planName:'',
            reportNo:'',
            profitLossMark:'',
            documentStatus:'',
            startTime:'',
            endTime:'',
            profitLossMarks:'1,2,3'
        },
        inventoryProfit:{
            id:'',
            profitLossNo:'',
            documentStatus:""
        },
        createdDate:[],
        selected:[],
        //控制弹窗显示
        modalTrigger:false,
        modalType:'',
        //审批进度条
        stepList: [],
        selectDocumentType:[
            {
                value: 1,
                label: "一般性盘盈"
            },
            {
                value: 2,
                label: "称差范围内盘盈"
            },
            {
                value: 3,
                label: "称差范围外盘盈"
            }
        ],
        documentStatusArr:[
            {label:'暂存',value:1},
            {label:'待审核',value:2},
            {label:'审核中',value:3},
            {label:'已审核',value:4},
            {label:'驳回',value:5}
        ],
        data_config_inventory_list: {
            url: contextPath + "/profitLossController/queryProfitLossListByBean",
            datatype:"json",
            colNames: ['盘盈单编号', '盘点方案编号','盘点方案名称','盘点报告编号', '单据类型', '单据状态',"盘点人","盘点日期"],
            colModel:[
                {
                    name: "profitLossNo",
                    index:"profitLossNo",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".viewProfitLossDetail" + value).on("click", ".viewProfitLossDetail" + value, function () {
                            vm.viewProfitLossDetail({value, grid, rows, state})
                        });
                        let btns = `<a class="viewProfitLossDetail${value}">${value}</a>`;
                        return btns;
                    },
                    unformat:function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {
                    name: "planNo",
                    index:"planNo",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".viewPlanDetail" + value).on("click", ".viewPlanDetail" + value, function () {
                            vm.viewPlanDetail({value, grid, rows, state})
                        });
                        let btns = `<a class="viewPlanDetail${value}">${value}</a>`;
                        return btns;
                    },
                    unformat:function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {name: "planName", index: "planName", width: 210, align: "left"},
                {
                    name: "reportNo",
                    index:"reportNo",
                    width: 210,
                    align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".viewReportDetail" + value).on("click", ".viewReportDetail" + value, function () {
                            vm.viewReportDetail({value, grid, rows, state})
                        });
                        let btns = `<a class="viewReportDetail${value}">${value}</a>`;
                        return btns;
                    },
                    unformat:function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }
                },
                {
                    name: "profitLossMark",
                    index: "profitLossMark",
                    align: "left",
                    width: 210,
                    formatter: function (value, grid, rows, state) {
                        switch (value) {
                            case 1:return '一般性盘盈'; break;
                            case 2:return '称差范围内盘盈'; break;
                            case 3:return '称差范围外盘盈'; break;
                            default:return '';
                        }
                    },
                    unformat:function (value, grid, rows) {
                        switch (value) {
                            case '一般性盘盈':return 1; break;
                            case '称差范围内盘盈':return 2; break;
                            case '称差范围外盘盈':return 3; break;
                            default:return '';
                        }
                    }
                },
                {
                    name: "documentStatus",
                    index: "documentStatus",
                    align: "left",
                    width: 210,
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
                { name: "invertoryUserName", index: "invertoryUserName", align: "left", width: 210},
                { name: "invertoryTime", index: "invertoryTime", align: "left", width: 210}
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        },
    },
    methods:{
        refresh(){
            let _this = this;
            _this.reload = !_this.reload;
        },
        search(){
            this.refresh();
        },
        clear(){
            this.body.profitLossNo = '';
            this.body.planNo = '';
            this.body.planName = '';
            this.body.reportNo = '';
            this.body.startTime = '';
            this.body.endTime = '';
            this.body.profitLossMarks = '1,2,3';
            if(this.body.documentStatus){
                this.$refs.documentStatus.reset();
                this.$nextTick(() => {
                    this.body.documentStatus = '';
                })
            }
            if(this.body.profitLossMark){
                this.$refs.profitLossMark.reset();
                this.$nextTick(() => {
                    this.body.profitLossMark = '';
                })
            }
            if(this.createdDate) {
                this.$nextTick(() => {
                    this.createdDate = [];
                })
            }
        },
        clearData(val){
            if(val === 'status'){
                if(this.body.documentStatus){
                    this.$refs.documentStatus.reset();
                    this.$nextTick(() => {
                        this.body.documentStatus = '';
                    })
                }
            }
            if(val === 'type'){
                if(this.body.profitLossMark){
                    this.$refs.profitLossMark.reset();
                    this.$nextTick(() => {
                        this.body.profitLossMark = '';
                    })
                }
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
        changeDate(value){
            let startTime = value[0].replace(/\//g, '-') ? value[0].replace(/\//g, '-') + ' 00:00:00' : '';
            let endTime = value[1].replace(/\//g, '-') ? value[0].replace(/\//g, '-') + ' 00:00:00' : '';
            this.body.startTime= startTime;
            this.body.endTime=endTime;
        },
        submit(){
            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {

                This.$Modal.info({
                    content: '请先选择一条记录!',
                    title:'提示信息'
                });
                return false;
            } else if (This.selected.length > 1) {
                This.$Modal.info({
                    content: '只能选择一条记录!',
                    title:'提示信息'
                });
                return false;
            }

            if(This.selected[0].documentStatus !== 1){
                This.$Modal.info({content:"盘盈单已提交!",title:"提示信息"});
                return false;
            }
            $.ajax({
                type: "POST",
                url: contextPath + "/profitLossController/queryProfitLossByDocumentNo",
                data: JSON.stringify({"id": This.selected[0].id}),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        console.log(data.data);
                        let _data = data.data;
                        let inventoryDataArr = _data.inventoryDataVoList
                            .filter(i => !i.profitLossReason || !i.profitLossMeasure);
                        console.log(inventoryDataArr);
                        if(inventoryDataArr && inventoryDataArr.length > 0){
                            This.$Modal.info({content:"请输入必填项!",title:"提示信息"});
                            return false;
                        }
                        This.updateStatus(This.selected[0].id,This.selected[0].profitLossNo,2,This.selected[0].profitLossMark);
                        return false;
                    }
                    This.$Modal.warning({content:"系统异常!",title:"提示信息"});
                },
                error: function () {
                    console.log("出错了");
                }
            })
        },
        updateStatus(id,profitLossNo,documentStatus,profitLossMark){
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath+'/profitLossController/saveProfitInfo',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({"id":id,"profitLossNo":profitLossNo,"documentStatus":documentStatus,"profitLossMark":profitLossMark}),
                dataType: "json",
                success: function (data) {
                    if(data.code === "100100"){
                        This.inventoryProfit.documentStatus = documentStatus;
                        if(profitLossMark === 2){
                            This.$Modal.success({
                                content:"审核成功!",
                                title:"提示信息"
                            });
                        }else{
                            This.$Modal.success({
                                content:"提交成功!",
                                title:"提示信息"
                            });
                        }
                        This.refresh();
                        return false;
                    }
                    This.$Modal.warning({
                        content:"提交失败!",
                        title:"提示信息"
                    });
                    This.refresh();
                },
                error: function () {
                    This.$Modal.warning({
                        content:"服务器出错啦!",
                        title:"提示信息"
                    });
                }
            })
        },
        approval(){
            let This = this;
            if (!ht.util.hasValue(This.selected, "array")) {
                This.$Modal.info({
                    content:"请先选择一条记录!",
                    title:"提示信息"
                });
                return false;
            } else if (This.selected.length > 1) {
                This.$Modal.info({
                    content:"只能选择一条记录!",
                    title:"提示信息"
                });
                return false;
            }

            This.inventoryProfit.id = This.selected[0].id;
            This.inventoryProfit.profitLossNo = This.selected[0].profitLossNo;
            This.inventoryProfit.documentStatus = This.selected[0].documentStatus;

            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject(){
            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {
                This.$Modal.info({
                    content:"请先选择一条记录!",
                    title:"提示信息"
                });
                return false;
            } else if (This.selected.length > 1) {
                This.$Modal.info({
                    content:"只能选择一条记录!",
                    title:"提示信息"
                });
                return false;
            }

            This.inventoryProfit.id = This.selected[0].id;
            This.inventoryProfit.profitLossNo = This.selected[0].profitLossNo;
            This.inventoryProfit.documentStatus = This.selected[0].documentStatus;

            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res){
            let _this = this;
            if(res.result.code == '100100'){
                _this.inventoryProfit.documentStatus = parseInt(res.result.data);
                this.refresh();
            }
        },
        autoSubmitOrReject(){
            let _this = this;
            $.ajax({
                url: contextPath + '/profitLossController/submitApproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:_this.inventoryProfit.profitLossNo,
                    approvalResult:(_this.modalType === 'reject'? 1 : 0),
                }),
                success:function (res) {
                    if(res.code === '100100'){
                        _this.inventoryProfit.documentStatus = parseInt(res.data);
                    }else {
                        _this.$Modal.warning({content:res.msg});
                    }
                    this.refresh();
                }
            });
        },
        update(){
            let This = this;

            if (!ht.util.hasValue(This.selected, "array")) {
                This.$Modal.info({
                    content:"请先选择一条记录!",
                    title:"提示信息"
                });
                return false;
            } else if (This.selected.length > 1) {
                This.$Modal.info({
                    content:"只能选择一条记录!",
                    title:"提示信息"
                });
                return false;
            }
            window.parent.activeEvent({name: '盘盈单', url: contextPath+'/inventory/inventory-profit/add-inventory-profit.html',params: {data:This.selected[0].profitLossNo}});
        },
        viewProfitLossDetail(data){
            window.parent.activeEvent({name: '盘盈单', url: contextPath+'/inventory/inventory-profit/add-inventory-profit.html',params: {data:data.value}});
        },
        viewPlanDetail(data){
            window.parent.activeEvent({
                name: '查看盘点方案',
                url: contextPath + '/inventory/inventory-plan/add-inventory-plan.html',
                params: {data: data.value, type: 'query'}
            });
        },
        viewReportDetail(data){
            window.parent.activeEvent({
                name: "盘点报告单",
                url: contextPath +'/inventory/inventory-report/inventory-report.html',
                params: {reportNo:data.value}
            });
        },
        exit(){
            window.parent.closeCurrentTab({name:'盘盈单列表',exit: true, openTime:this.openTime});
        }
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
    }
})