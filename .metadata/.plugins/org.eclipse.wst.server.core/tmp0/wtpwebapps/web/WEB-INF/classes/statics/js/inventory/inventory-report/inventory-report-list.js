var vm = new Vue({
    el: "#app",
    data: {
        isShow: false,
        isEdit: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        reload_inventory_list: false,
        selected:[],
        reload: false,
        reportNo:'',
        docStatus:'',
        body: {
            docStatus: "",
            inventoryType: "",
            createdDate: "",
            warehouseId: "",
            documentNo: "",
            reportNo: "",
            documentName: "",
            startTime: '',
            endTime: '',
        },
        dataValue: [],
        //审核
        modalTrigger: false,
        modalType: '',
        approvalTableData: [],
        stepList: [],
        selectInventoryType: [],
        selectWarehouse:[],
        inventoryTypeList:[],
        selectDocStatus: [
            {
                value: '',
                label: "全部"
            },
            {
                value: 1,
                label: "暂存"
            },
            {
                value: 2,
                label: "待审核"
            },
            {
                value: 3,
                label: "审核中"
            },
            {
                value: 4,
                label: "已审核"
            },
            {
                value: 5,
                label: "驳回"
            }
        ],
        data_config_inventory_list: {
            url: contextPath + "/inventoryReport/listPage",
            datatype: "json",
            colNames: ['id','generateStatus','盘点报告编号', '盘点方案编号', '盘点方案名称', '盘点类型', '仓库或柜台', '单据状态', "盘点人", "盘点日期"],
            colModel: [
                {name: "id", index: "id", width: 210, align: "left", hidden: true},
                {name: "generateStatus", index: "generateStatus", width: 210, align: "left", hidden: true},
                {name: "reportNo", index: "reportNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                            vm.reportNoClick({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    },
                    unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }},
                {name: "documentNo", index: "reportNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                            vm.documentNoClick({value, grid, rows, state})
                        });
                        let myCode =  `<a class="detail${value}">${value}</a>`;
                        return  myCode;
                    },
                    unformat: function (value, grid, rows) {
                        return value.replace(/(<\/?a.*?>)/g, '');
                    }},
                {name: "documentName", index: "reportNo", width: 210, align: "left"},
                {name: "inventoryType", index: "reportNo", width: 210, align: "left",
                    formatter: function (value, grid, rows, state) {
                        return vm.formatterInventoryType(value);
                    }, unformat: function (cellvalue, options, rowObject) {
                        return vm.unformatterInventoryType(cellvalue);
                    }
                },
                {name: "warehouseNameArr", width: 210, align: "left"},
                {name: "docStatus", index: "docStatus", align: "left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        if (value == 1) {
                            return '暂存';
                        }
                        if (value == 2) {
                            return '待审核';
                        }
                        if (value == 3) {
                            return '审核中';
                        }
                        if (value == 4) {
                            return '已审核';
                        }
                        if (value == 5) {
                            return '驳回';
                        }
                    },
                    unformat(value, grid, rows, state) {
                        if (value == '暂存') {
                            return 1;
                        }
                        if (value == '待审核') {
                            return 2;
                        }
                        if (value == '审核中') {
                            return 3;
                        }
                        if (value == '已审核') {
                            return 4;
                        }
                        if (value == '驳回') {
                            return 5;
                        }
                    }
                },
                {name: "invertoryUserName", index: "reportNo", align: "left", width: 210},
                {name: "invertoryTime", index: "reportNo", align: "left", width: 210,
                    formatter: function (value, grid, rows, state) {
                        return  new Date(value).format("yyyy-MM-dd");
                    }},
            ],
            rowNum: 5,//一页显示多少条
            rowList: [10, 20, 30],//可供用户选择一页显示多少条
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords: true
        },

    },
    methods: {
        search() {
            let _this = this;
            _this.reload = !_this.reload;

        },
        clear() {
            this.body.inventoryType = "";
            this.body.warehouseId = '';
            this.body.docStatus = '';
            this.body.createdDate = "";
            this.body.documentNo = "";
            this.body.reportNo = "";
            this.body.documentName = "";
            this.body.startTime = '';
            this.body.endTime = '';
            this.dataValue = [];
            this.$nextTick(function(){
                this.body.warehouseId = '';
                this.body.docStatus = '';
                this.body.inventoryType = '';
            });
        },
        handleClearType(value){
            this.$refs[value].reset();
            this.$nextTick(() => {
                if(value === 'inventoryType'){
                    this.body.inventoryType = '';
                }
                else if (value === 'docStatus'){
                    this.body.docStatus = '';
                }
                else if (value === 'warehouseId'){
                    this.body.warehouseId = '';
                }
                else if (value === 'dataValue'){
                    this.dataValue = [];
                }
            });
        },
        //转换搜索栏日期格式
        changeDate(value) {
            this.body.startTime = value[0].replace(/\//g, '-');
            this.body.endTime = value[1].replace(/\//g, '-');
        },

        //刷新
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },

        // 点击退出(退出页面)
        exit() {
            window.parent.closeCurrentTab({openTime: this.openTime, exit: true,});
        },

        approval() {
            //发送请求
            let This = this;
            let datas = this.selected;
            if (datas.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            }
            if (datas[0].docStatus === 2 ||
                datas[0].docStatus === 3 ||
                datas[0].docStatus === 5) {
                This.id = datas[0].id;
                This.docStatus = datas[0].docStatus ;
                This.reportNo  = datas[0].reportNo ;
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
                console.log(datas[0].docStatus , datas[0].documentNo, 77)
            } else if (datas[0].docStatus === 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请提交单据！'
                });
                return;
            } else if (datas[0].docStatus === 4) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '该单已审核,不能重复审核！'
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
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                This.$Modal.info({
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            } else {
                if (datas[0].docStatus === 2 ||
                    datas[0].docStatus === 3 ||
                    datas[0].docStatus === 5) {
                    This.id = datas[0].id;
                    This.docStatus = datas[0].docStatus ;
                    This.reportNo = datas[0].reportNo;
                    This.modalType = 'reject';
                    This.modalTrigger = !This.modalTrigger;
                } else {
                    This.$Modal.info({
                        title: '提示信息',
                        content: '该单状态不能驳回！'
                    });
                }
            }
        },

        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            console.log(res, 9988788)
            if (res.result.code === '100100') {
                this.refresh();
            }
        },

        autoSubmitOrReject(result) {
            let This = this;
            $.ajax({
                url: contextPath + '/inventoryReport/submitapproval?submitType=1',
                method: 'post',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({
                    receiptsId: This.reportNo,
                    approvalResult: (This.modalType == 'reject' ? 1 : 0),
                }),
                success: function (res) {
                    if (res.code === '100100') {

                    } else {
                        This.$Modal.warning({content: res.msg,title:"提示信息"});
                    }
                }
            });
        },

        //获取盘点类型
        getInventroyType(){
            this.selectInventoryType = getCodeList('inventory_inventoryType')
        },

        //获取仓库组
        getWareHouseGroup() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/wareHouse/queryAll',
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.selectWarehouse = data.data;
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦！'
                    });
                }
            })
        },

        getInventoryType(){
            this.inventoryTypeList = getCodeList("inventory_inventoryType")
        },

        formatterInventoryType(value){
            if(!value){
                return '';
            }else if(this.inventoryTypeList.length < 1){
                return value;
            }
            return this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.value; }).indexOf(value)]
                ? this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.value; }).indexOf(value)].name
                : value;
        },
        unformatterInventoryType(){
            if(!value){
                return '';
            }else if(this.inventoryTypeList.length < 1){
                return value;
            }
            return this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.name; }).indexOf(value)]
                ? this.inventoryTypeList[this.inventoryTypeList.map(function(e) { return e.name; }).indexOf(value)].value
                : name;
        },

        //提交
        submit(){
            let document = this.selected;
            console.log('document',document)
            if(document.length < 1){
                this.$Modal.info({
                    title: '提示信息',
                    content: '请选择一条数据！'
                });
                return;
            }else if(document.length > 1){
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！'
                });
                return;
            }else {
                let This = this;
                //提交之前进行校验

                if (document[0].docStatus != 1){
                    this.$Modal.info({
                        title: '提示信息',
                        content: '单据状态不为暂存不能提交！'
                    });
                    return;
                }
                $.ajax({
                    type: "POST",
                    url: contextPath+"/inventoryReport/submit",
                    dataType: "json",
                    data:JSON.stringify(document[0]),
                    contentType: 'application/json;charset=utf-8',
                    success: function(data) {
                        console.log(data)
                        if (data.code === "100100"){
                            document[0].docStatus = 2;

                            This.refresh();
                            This.$Modal.success({
                                title: '提示信息',
                                content: '提交成功！'
                            })
                        }else {
                            document[0].docStatus = 1;
                            This.$Modal.warning({
                                title: '提示信息',
                                content: data.msg
                            })
                        }
                    },
                    error: function(err){
                        This.$Spin.hide();
                        console.log("服务器出错");
                    },
                });
            }
        },

        //生成调整单据
        createAdjust(){

            let This = this;
            let datas = this.selected;
            console.log(datas,888)
            if (datas.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一条数据！'
                });
                return;
            }
            if (datas.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请至少选择一条数据！'
                });
                return;
            }
            if (datas[0].docStatus != 4){
                this.$Modal.info({
                    title: '提示信息',
                    content: '该单据未审核完成，不可生成调整单！'
                });
                return;
            }
            if (datas[0].generateStatus == 1){
                this.$Modal.info({
                    title: '提示信息',
                    content: '该单据已生成调整单，不可再次生成！'
                });
                return;
            }
            $.ajax({
                type: "post",
                url: contextPath + '/inventoryReport/createAdjust',
                contentType: 'application/json',
                data: JSON.stringify(datas[0]),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示信息",
                            content: "操作成功",
                        })
                    }else {
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "操作失败",
                        })
                    }
                    This.refresh()
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示信息",
                        content: "操作失败",
                    })
                }
            })
        },

        //点击单据编号查看详情
        reportNoClick(data){
            window.parent.activeEvent({
                name: "盘点报告单",
                url: contextPath +'/inventory/inventory-report/inventory-report.html',
                params: {reportNo:data.rows.reportNo,type:'query'}
            });
        },

        update(){
            if (this.selected.length < 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '请先选择至少一笔数据！'
                });
                return;
            }
            if (this.selected.length > 1) {
                this.$Modal.info({
                    title: '提示信息',
                    content: '只能选择一笔数据！'
                });
                return;
            }
            window.parent.activeEvent({
                name: "盘点报告单",
                url: contextPath +'/inventory/inventory-report/inventory-report.html',
                params: {reportNo:this.selected[0].reportNo,type:'update'}
            });
        },

        //点击单据编号查看详情
        documentNoClick(data){
            //携带documentNo跳转至新增页
            window.parent.activeEvent({
                name: '查看盘点方案',
                url: contextPath + '/inventory/inventory-plan/add-inventory-plan.html',
                params: {data: data.rows.documentNo, type: 'query'}
            });
        },
    },

    created() {
        this.openTime = window.parent.params.openTime;
        this.getInventroyType();
        this.getWareHouseGroup();
        this.getInventoryType();
    }
})