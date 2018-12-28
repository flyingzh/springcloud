var vm = new Vue({
    el: "#app",
    data: {
        openTime: '',
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        reload_inventory_list: false,
        selectedUnpicked:[],
        approvalTableData: [],
        //审批类型
        modalType: '',
        //审批进度条
        stepList: [],
        //控制弹窗显示
        modalTrigger: false,
        documentNo:null,
        documentStatus:null,
        body:{
            profitLossNo:null,
            planNo:null,
            reportNo:null,
            planName:null,
            profitLossMark:null,
            documentStatus:null,
            invertoryUserName:null,
            documentName:null,
            examineVerifyName:null,
            examineVerifyTime:null,
            type:"INVENTORY_LOSS",
            profitLossMarks:'4,5,6'
        },
        invertoryTime:[],
        selectDocumentType:[
            {
                value: 4,
                name: '一般性盘亏单'
            },{
                value: 5,
                name: '称差范围内的盘亏单'
            },{
                value: 6,
                name: '称差范围外的盘亏单',
            },
        ],
        selectStatus: [
            {
                value: 1,
                name: '暂存'
            },
            {
                value: 2,
                name: '待审核',
            },
            {
                value: 3,
                name: '审核中'
            },
            {
                value: 4,
                name: '审核完成'
            },
            {
                value: 5,
                name: '驳回'
            }
        ],
        selectWarehouseOrCounter:[
            {
                value: "全部",
                label: "全部"
            },
            {
                value: "仓库A",
                label: "仓库A"
            },
            {
                value: "仓库B",
                label: "仓库B"
            },
            {
                value: "仓库C",
                label: "仓库C"
            },
            {
                value: "仓库D",
                label: "仓库D"
            }
        ],
        data_config_inventory_list: {
            url: contextPath + "/profitLossController/queryProfitLossListByBean",
            datatype:"json",
            colNames: ['盘亏单编号', '盘点方案编号','盘点方案名称','盘点报告编号', '单据类型', '单据状态',"盘点人","盘点日期"],
            colModel:[
                {name: "profitLossNo", index:"profitLossNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                            e.preventDefault()
                            vm.formatterProfitLossNo(value);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    }
                },
                {name: "planNo", index:"planNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                            e.preventDefault()
                            vm.formatterPlanNo(value);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    }
                },
                {name: "planName", index: "planName", width: 210, align: "left"},
                {name: "reportNo",index:"reportNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off("click", ".detail" + value).on("click", ".detail" + value, function (e) {
                            e.preventDefault()
                            vm.formatterReportNo(value);
                        });
                        let btns = `<a class="detail${value}">${value}</a>`;
                        return btns
                    }
                },
                {name: "profitLossMark", index: "profitLossMark", align: "left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterProfitLossMark(value);
                    }
                },
                { name: "documentStatus", index: "documentStatus", align: "left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterDocumentStatus(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                    return vm.unformatDocumentStatus(cellvalue);
                }
                },
                { name: "invertoryUserName", index: "invertoryUserName", align: "left", width: 210},
                { name: "invertoryTime", index: "invertoryTime", align: "left", width: 210}
            ],
            rowNum :5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        },

    },
    methods:{
        update(){
            var This = this;
            if (This.selectedUnpicked.length === 0){
                This.$Modal.info({
                    title: '提示信息',
                    content: '请选择盘亏单!'
                });
                return;
            }
            if (This.selectedUnpicked.length !== 1){
                This.$Modal.info({
                    title: '提示信息',
                    content: '只能修改单个盘亏单!'
                });
                return;
            }
            window.parent.activeEvent({
                name: "盘亏单",
                url: contextPath +'/inventory/inventory-shortages/add-inventory-shortages.html',
                params: {profitLossNo:This.selectedUnpicked[0].profitLossNo}
            });
        },
        defaultDocumentType(value){
            let This = this;
            This.$refs[value].reset();
            This.$nextTick(() => {
                if(value === 'mark'){
                    This.body.profitLossMark = null;
                }
                if (value === 'status'){
                    This.body.documentStatus = null;
                }
            });
        },
        formatterPlanNo(value){
            window.parent.activeEvent({
                name: '查看盘点方案',
                url: contextPath + '/inventory/inventory-plan/add-inventory-plan.html',
                params: {data: value, type: 'query'}
            });
        },
        formatterReportNo(value){
            window.parent.activeEvent({
                name: "盘点报告单",
                url: contextPath +'/inventory/inventory-report/inventory-report.html',
                params: {reportNo:value}
            });
        },
        formatterProfitLossNo(value){
            window.parent.activeEvent({
                name: "盘亏单",
                url: contextPath +'/inventory/inventory-shortages/add-inventory-shortages.html',
                params: {profitLossNo:value}
            });

        },
        formatterProfitLossMark(value){
            if (!value) {
                return '';
            } else if (this.selectDocumentType.length < 1) {
                return value;
            }
            if(this.selectDocumentType[0].value === value){
                return this.selectDocumentType[0].name
            }else if(this.selectDocumentType[1].value === value){
                return this.selectDocumentType[1].name
            }else if(this.selectDocumentType[2].value === value){
                return this.selectDocumentType[2].name
            }
        },
        unformatDocumentStatus(value) {
            if (!value) {
                return '';
            } else if (this.selectStatus.length < 1) {
                return value;
            }
            return this.selectStatus[this.selectStatus.map(function (e) {
                return e.name;
            }).indexOf(value)]
                ? this.selectStatus[this.selectStatus.map(function (e) {
                    return e.name;
                }).indexOf(value)].value
                : value;
        },
        formatterDocumentStatus(value) {
            if (!value) {
                return '';
            } else if (this.selectStatus.length < 1) {
                return value;
            }
            return this.selectStatus[this.selectStatus.map(function (e) {
                return e.value;
            }).indexOf(value)]
                ? this.selectStatus[this.selectStatus.map(function (e) {
                    return e.value;
                }).indexOf(value)].name
                : value;

        },
        //搜索
        search(){
            if (this.body.profitLossMark == 0){
                this.body.profitLossMark = null
            }
            if (this.invertoryTime.length > 0 && this.invertoryTime[0] && this.invertoryTime[1]) {
                this.body.startTime = this.invertoryTime[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.invertoryTime[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }

            let This = this;
            This.reload_inventory_list = !This.reload_inventory_list;

        },
        reloads(){
            this.clear();
            let This = this;
            This.reload_inventory_list = !This.reload_inventory_list;
        },
        //清空
        clear() {
            this.body.invertoryUserName = null
            this.body.documentName = null
            this.invertoryTime = []
            this.body.profitLossMarks = "4,5,6"
            this.body.profitLossNo = null
            this.body.planNo = null
            this.body.reportNo = null
            this.body.planName = null
            if (this.body.profitLossMark || this.body.documentStatus){
                this.$refs.mark.reset();
                this.$refs.status.reset();
                this.$nextTick(()=> {
                    this.body.profitLossMark = null;
                    this.body.documentStatus = null
                });
            }

        }
        ,
        //提交
        submit(){
            let This = this;
            if (This.selectedUnpicked.length != 1) {
                This.frameTab = false;
                This.$Modal.info({
                    title: '提示信息',
                    content: '只能提交单个盘亏单!'
                });
                return false;
            }


            window.top.home.loading('show');
            $.ajax({
                url: contextPath + '/profitLossController/submit',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({"documentNo":This.selectedUnpicked[0].profitLossNo,"type":This.body.type}),
                success: function (res) {
                    if (res.code === '100100') {
                        This.$Modal.success({
                            title: '提示信息',
                            content: res.msg,
                        });
                    } else {
                        This.$Modal.warning({content: res.msg, title: '提示信息'});
                    }
                    This.reloads();
                }
            });
            window.top.home.loading('hide');
        },
        //审核
        approval(){
            let This = this;
            this.documentNo=This.selectedUnpicked[0].profitLossNo;
            this.documentStatus=This.selectedUnpicked[0].documentStatus
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;

        },
        //驳回
        reject(){
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;

        },
        autoApproveOrReject(result) {
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                url: contextPath + '/profitLossController/submitApproval?submitType=1',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    receiptsId: This.documentNo,
                    approvalResult: (This.modalType == 'reject' ? 1 : 0),
                }),
                success: function (res) {
                    console.log(res)
                    if (res.code === '100100') {
                        if (parseInt(res.data) === 1) {
                            //驳回到原点，暂存
                        } else if (parseInt(res.data) === 4) {
                            //审核完成
                            This.body.examineVerifyName = layui.data('user').username, This.body.examineVerifyTime = (new Date()).format("yyyy-MM-dd HH:mm:ss") || '';
                        }
                    } else {
                        This.$Modal.warning({content: res.msg, title:"提示信息"});
                    }
                    This.reloads();
                }
            });
            window.top.home.loading('hide');

        },
        approvalOrRejectCallBack(res){
            let This = this;

            if(res.result.code === '100100'){
                This.body.documentStatus = res.result.data;

                if(This.body.documentStatus === 1){
                    //驳回到原点，暂存
                }else if(This.body.documentStatus === 2){
                    //待审核

                }else if(This.body.documentStatus === 4){
                    //审核完成

                }else if(This.body.documentStatus === 5){
                    //审核驳回

                }
                //This.ajaxUpdateDocStatusById(This.body.id,docStatus);
                This.reloads();
            }
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({name: '盘亏单列表', openTime: this.openTime, exit: true});
        },
    },

    created() {
    },
    mounted() {
        console.log("ok")
        this.openTime = window.parent.params.openTime;
    }

})