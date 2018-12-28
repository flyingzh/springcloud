let repairList = new Vue({
    el:"#repair-order-list",
    data(){
        return {
            isHideSearch: true,
            isHideList: true,
            //客户对象
            selectCustomerObj:null,
            reload: false,
            myTable: "myTable",
            selected: [],
            openTime:"",
            typeValue:"",
            repairReturnNo: "",
            status: "",
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            body: {
                searchGoodsType: '',
                searchRepairRegisterNo: "",
                searchCustName: "",
                searchCustNo: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: ""
            },
            productTypeList:[],
            dateArr:"",
            data_user_list: {
                //页表页数据
                url: contextPath + '/repairReturn/repairReturnEntityListPage',
                colNames:
                    [ '单据编号', '日期', '单据状态',  '客户','商品类型', '退货重量', '退货数量', '登记人', '物流方式'],
                colModel:
                    [
                        {
                            name: 'repairReturnNo', index: 'repairReturnNo', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    repairList.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {name: 'createTime', index: 'createTime', width: 220, align: "left",
                            formatter :function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {name: 'status', index: 'status', width: 220, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    return "暂存";
                                } else if (value == 2) {
                                    return "待审核";
                                }
                                else if (value == 3) {
                                    return "审核中";
                                }
                                else if (value == 4) {
                                    return "已审核";
                                } else if (value == 5) {
                                    return "驳回";
                                }
                            }
                        },
                        {name: 'custName', index: 'custName', width: 220, align: "left"},
                        {name: 'goodsTypeName', index: 'goodsTypeName', width: 220, align: "left"},
                        {name: 'totalWeight', index: 'totalWeight', width: 220,  align: "right"},
                        {name: "totalNum", index: "totalNum", width: 220, align: "right"},
                        {name: "saleMenName", index: "saleMenName", width: 220,align: "left"},
                        {name: "shipMethod", index: "shipMethod", width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value =="wlfs_zt") {
                                    return "自提";
                                } else if (value == "wlfs_js") {
                                    return "寄送";
                                }
                                else if (value =="wlfs_shsm") {
                                    return "送货上门";
                                }else if(value == null){
                                    return "";
                                }
                            }
                        }
                    ]
            },
        }
    },
    methods:{

        //改变日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //刷新
        refresh() {
            repairList.reload = !repairList.reload;
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.searchCustName = this.selectCustomerObj.name;
            }
        },
        // 选择商品类型
        changeProductType(e) {
            this.body.searchGoodsType = e.value;
            //this.body.goodsTypeName = e.label;
        },
        //删除
        delBatch(){
            //获取到选择的所有数据
            let newArr = [];
            let This = this;
            for (var i = 0; i < this.selected.length; i++) {
                var obj = $('#myTable').jqGrid('getRowData', this.selected[i]);
                var status = obj.status.replace(/<.*?>+/g, "");
                var repairReturnNo = obj.repairReturnNo.replace(/<.*?>+/g, "");
                if (status != "暂存") {
                    newArr.push(repairReturnNo);
                }
            }
            if (this.selected.length <= 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择需要删除的维修退库单数据"
                });
                return false;
            } else if (newArr.length > 0) {
                console.log(newArr);
                this.$Modal.warning({
                    title: "提示",
                    content: newArr + "单据状态为非暂存，不能删除"
                });
                return false;
            } else {
                var arr = new Array();
                for (var i = 0; i < this.selected.length; i++) {
                    arr[i] = this.selected[i];
                }
                //弹框提示是否删除
                this.$Modal.confirm({
                    title: '提示信息',
                    content:'是否删除',
                    onOk(){
                        $.ajax({
                            type: 'post',
                            async: true,
                            traditional: true,
                            data: {ids: arr},
                            url: contextPath + '/repairReturn/delBatch',
                            success: function (d) {
                                if(d.code=='100100'){
                                    // repairList.reload = !repairList.reload;
                                    // repairList.$Modal.success({
                                    //     content: "删除成功！"
                                    // })
                                    setTimeout(()=>{
                                        This.$Modal.success({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: '删除成功'
                                        });
                                        This.reload = !This.reload
                                    },300)
                                }else {
                                    setTimeout(()=>{
                                        This.$Modal.error({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: '删除失败'
                                        });
                                        This.reload = !This.reload
                                    },300)
                                }
                            },
                            error: function (e) {
                                console.log(e);
                            }
                        });
                    }
                })

            }
        },
        //提交
        info(){
            var rowId = this.selected
            if (this.selected.length !=1 ) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择单条需要操作的维修退库单数据"
                });
                return false;
            }
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var status = obj.status.replace(/<.*?>+/g, "");

            if (status !== "暂存") {
                repairList.$Modal.warning({
                    content: "该单据之前已经提交过了，不能再提交!"
                });
                return false;
            } else {
                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {id: rowId},
                    url: contextPath + '/repairReturn/submit',
                    dataType: 'json',
                    success: function (d) {
                        if(d.code=="100100"){
                            repairList.reload = !repairList.reload;
                            repairList.$Modal.success({
                                content: "提交成功"
                            })
                        }else if(d.code=="100101"){
                            if(d.data.SaleMenName!=null){
                                repairList.$Modal.warning({
                                    content: d.data.SaleMenName
                                })
                            }

                            if(d.data.ShipMethod!=null){
                                repairList.$Modal.warning({
                                    content: d.data.ShipMethod
                                })
                            }
                            if(d.data.RepairTime!=null){
                                repairList.$Modal.warning({
                                    content: d.data.RepairTime
                                })
                            }
                        }else {
                            repairList.$Modal.warning({
                                content:"系统异常，请联系相关技术人员"
                            })
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            }
        },
        approval() {
            if (this.selected.length !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return;
            }

            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var status = obj.status.replace(/<.*?>+/g, "");
            if(status=="暂存"){
                status =1
            }else if(status=="待审核"){
                status =2
            }else if(status=="审核中"){
               status =3
            }else if(status=="已审核"){
                status =4
            }else if(status=="驳回"){
               status =5
            }
            let This = this;
            //获取单据编号
            This.repairReturnNo = obj.repairReturnNo.replace(/<.*?>+/g, "");

            This.status=status;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        reject() {
            if (this.selected.length !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return;
            }
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var status = obj.status.replace(/<.*?>+/g, "");
            if(status=="暂存"){
                status =1
            }else if(status=="待审核"){
                status =2
            }else if(status=="审核中"){
                status =3
            }else if(status=="已审核"){
               status =4
            }else if(status=="驳回"){
                status =5
            }
            let This = this;
            This.repairReturnNo = obj.repairReturnNo.replace(/<.*?>+/g, "");
            This.status=status;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                this.reload = !this.reload;
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },

        //搜索
        search() {
            let config = {
                postData: this.body,
            }
            //根据单号请求数据
            $("#" + this.myTable).jqGrid('setGridParam', config).trigger("reloadGrid");

        }
        ,
        //重置
        clean() {
            this.body = {
                searchGoodsType: '',
                searchRepairRegisterNo: "",
                searchCustName: "",
                searchCustNo: "",
                //开始时间
                startTime: "",
                //结束时间
                endTime: "",
            }
            this.typeValue = ""
            this.dateArr=[];
            this.$refs.customerRef.clear();
            this.$refs.gtype.body.typeValue = '';
            this.reload = !this.reload;
        },

        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        /** 点击进入新增页面查看  */
        updateDetail({rows}) {
            console.log(rows);
            let allInfo = [];
            allInfo.push(2);
            allInfo.push(rows.repairReturnNo)
            allInfo.push(rows.status)
            if (rows.repairReturnNo != null) {
                window.parent.activeEvent({
                    name: '维修退货单-查看',
                    url: contextPath + '/repair/repair-Return/repair-return-add.html',
                    params: {allInfo: allInfo, type: 'query'}
                });
            }
        },
    },
    mounted(){
        //this.loadProductType();
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})