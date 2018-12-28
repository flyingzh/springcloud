var vm = new Vue({
    el: "#sale-order-list",
    data() {
        return {
            isHideSearch: true,
            isHideList: true,
            //客户信息
            selectCustomerObj:null,
            openTime: "",
            modalType: "",
            approveComment: "",
            isSearchHide: true,
            reload: false,
            selected: [],
            modalTrigger: false,
            isTabulationHide: true,
            modalType: '',
            documentNo: '',
            documentStatus: '',
            stepList: [],
            dateArr: "",
            body: {
                searchDepositNo: "",
                searchSaleOrderNo: "",
                searchCustNo: "",
                searchCustName: "",
                searchPayWay: "",
                //开始时间
                searchCreateTime: "",
                searchEndTime: "",
                //结束时间
                page: "",
                limit: "",
            },
            auditParams: {
                approvalResult: "1", /**返回结果 1：同意  0：驳回 */
                approvalInfo: "", /**审批意见*/
                nextLevel: "", /**下一节点*/
                lastNode: "", /**终审节点，1：是，0：否'*/
                docTypeCode: "S_DEPOSIT", /**单据类型**/
                boeId: "", /**单据编号**/
                userId: "63", /** '申请人用户编号ID' **/
                processId: "S_DEPOSIT_123", /** 审批流程ID**/
                receiptsId: "", /** '审批内容实体ID' **/
                currentLevel: "", /** '当前节点级数' **/
                approvalStatus: "" /** '审批状态_1：审批完成  2：审批中' **/
            },
            data_user_list: {
                //列表页数据
                url: contextPath + '/deposit/findSaleDepositEntityList',
                colNames:
                    ['日期', '单据编号', '单据状态', '客户', '应收总定金', '实收总定金', '支付方式'],
                colModel:
                    [
                        {
                            name: 'createTime',
                            index: 'createTime',
                            width: 200,
                            align: "left",
                            formatter :function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {
                            name: 'depositNo', index: 'depositNo', width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    vm.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: 'status', index: 'status', width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    console.log(1)
                                    return "暂存";
                                } else if (value == 2) {
                                    console.log(1)
                                    return "待审核";
                                }
                                else if (value == 3) {
                                    console.log(1)
                                    return "审核中";
                                }
                                else if (value == 4) {
                                    console.log(1)
                                    return "已审核";
                                } else if (value == 5) {
                                    return "驳回";
                                }
                            }
                        },
                        {name: 'customerName', index: 'customerName', width: 200, align: "left"},
                        {
                            name: 'totalReceDepositAmount',
                            index: 'totalReceDepositAmount',
                            width: 200,
                            align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    return value.toFixed(2);
                                } else {
                                    var a = 0;
                                    return a.toFixed(2);
                                }
                            }
                        },
                        {
                            name: 'totalPaidDepositAmount',
                            index: 'totalPaidDepositAmount',
                            width: 200,
                            align: "right",
                            formatter: function (value, grid, rows, state) {
                                if (value != null) {
                                    return value.toFixed(2);
                                } else {
                                    var a = 0;
                                    return a.toFixed(2);
                                }
                            }
                        },
                        {name: "payWay", index: "payWay", width: 200, align: "center"}

                    ],
            }
        }
    },
    methods: {
        /** 点击进入新增页面查看 flag=2 */
        updateDetail({rows}) {
            console.log(rows);
            let allInfo = [];
            var flag = 2;
            allInfo.push(flag)
            allInfo.push(rows.id)
            allInfo.push(rows.status)
            if (rows.id != null) {
                window.parent.activeEvent({
                    name: '销售定金-查看',
                    url: contextPath + '/sale/deposit/sale-order-add.html',
                    params: {allInfo: allInfo, type: 'query'}
                });
            }

        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.searchCustName = this.selectCustomerObj.name;
            }
        },
        /** 清空 */
        clean() {
            this.$refs.payWay.reset();
            this.$nextTick(function(){
                this.body.searchPayWay = "";
            });
            this.body = {
                searchDepositNo: "",
                searchSaleOrderNo: "",
                searchCustName: "",
                searchPayWay: "",
                //开始时间
                searchCreateTime: "",
                //结束时间
                searchEndTime: "",
            }
            this.dateArr=[];
            this.$refs.customerRef.clear();
            vm.reload = !vm.reload;
        },
        //清空按钮
        clearPay(){
            this.$refs.payWay.reset();
            this.$nextTick(function(){
                this.body.searchPayWay = "";
            });
        },
        /** 新增按钮 flag=4 */
        newButton() {
            let allInfo = [];
            var flag = 4;
            allInfo.push(flag);
            window.parent.activeEvent({
                name: '销售定金单-新增',
                url: contextPath + '/sale/deposit/sale-order-add.html',
                params: {allInfo: allInfo, type: 'query'}
            });

        },


        /** 修改 flag=3 */
        update() {
            var rowId = this.selected
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var status = obj.status.replace(/<.*?>+/g, "");
            if (rowId.length != 1) {
                vm.$Modal.info({
                    content: "提交和修改只支持单条记录操作，谢谢合作！"
                })
            } else {
                let allInfo = [];
                var flag = 3;
                allInfo.push(flag)
                allInfo.push(this.selected[0])
                allInfo.push(status)
                console.log(allInfo)
                window.parent.activeEvent({
                    name: '销售定金-修改',
                    url: contextPath + '/sale/deposit/sale-order-add.html',
                    params: {allInfo: allInfo, type: 'query'}
                });
            }
        },


        /** 刷新 */
        refresh() {

            vm.reload = !vm.reload;
        },


        changeDate(value) {
            this.body.searchCreateTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.searchEndTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },

        /** 搜索按钮*/
        search1() {
            this.reload = !this.reload;
        },


        /** 删除 */
        deleteSaleOrder() {
            //获取到选择的所有数据
            let newArr = [];
            let This = this;
            for (var i = 0; i < this.selected.length; i++) {
                var obj = $('#myTable').jqGrid('getRowData', this.selected[i]);
                var status = obj.status.replace(/<.*?>+/g, "");
                var depositNo = obj.depositNo.replace(/<.*?>+/g, "");
                if (status != "暂存") {
                    newArr.push(depositNo);
                }
            }
            if (this.selected.length <= 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择需要删除的销售定金单数据"
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
                            url: contextPath + '/deposit/delete',
                            success: function (d) {
                                if (d.code == "100100") {
                                    setTimeout(()=>{
                                        This.$Modal.success({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: '删除成功'
                                        });
                                        This.reload = !This.reload;
                                    },300)

                                } else {
                                    setTimeout(()=>{
                                        This.$Modal.error({
                                            title: '提示信息',
                                            okText:'确定',
                                            content: '删除失败'
                                        });
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

        /** 提交*/
        submitCheck() {
            var rowId = this.selected
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var status = obj.status.replace(/<.*?>+/g, "");
            if (rowId.length != 1) {
                vm.$Modal.info({
                    content: "提交和修改只支持单条记录操作，谢谢合作！"
                })
            } else if (status !== "暂存") {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据之前已经提交过了，不能再提交!"
                });
                return false;
            } else {
                $.ajax({
                    type: 'post',
                    async: true,
                    traditional: true,
                    data: {id: rowId},
                    url: contextPath + '/deposit/submit',
                    dataType: 'json',
                    success: function (d) {

                        if (d.code == "100100") {
                            vm.$Modal.success({
                                content: "提交成功！"
                            })
                            vm.reload = !vm.reload;
                        } else if (d.code == "-1") {
                            vm.$Modal.warning({
                                content: "审批申请未成功！"
                            })
                            vm.reload = !vm.reload;
                        } else if (d.code == "100101") {
                            if(d.data.CustomerNo!= null){
                                vm.$Modal.warning({
                                    content:d.data.CustomerNo
                                })
                                return;
                            }
                            if (d.data.PayWay != null) {
                                vm.$Modal.warning({
                                    content:d.data.PayWay
                                })
                                return;
                            }
                            if (d.data.DepositDate != null) {
                                vm.$Modal.warning({
                                    content:d.data.DepositDate
                                })
                                return;
                            }
                            if (d.data.TotalPaidDepositAmount != null) {
                                vm.$Modal.warning({
                                    content:d.data.TotalPaidDepositAmount
                                })
                                return;
                            }
                        }

                    },
                    error: function (e) {
                        console.log(e);
                    }
                });

            }
        },

        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let _this = this;
            let rowId = this.selected;
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var depositNo = obj.depositNo.replace(/<.*?>+/g, "");
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.updateStatus(rowId[0], depositNo, 4);
                if (_this.modalType == 'reject') _this.updateStatus(rowId[0], depositNo, 1);
            }
            if (res.result.code == '100100') {
                let approvalStatus = res.result.data.approvalStatus;
                let docStatus = '';
                if (approvalStatus == 0) {
                    docStatus = 3;
                } else if (approvalStatus == 1) {
                    docStatus = 4;
                } else if (approvalStatus == -1) {
                    docStatus = 5;
                } else if (approvalStatus == -2) {
                    docStatus = 1;
                } else {
                    _this.$Modal.warning({
                        content: '审核异常!',
                        title: '警告'
                    });
                    return false;
                }
                if(docStatus==4){
                    _this.updataCustOrder(rowId[0]);
                    _this.saveFinancialData(rowId[0]);
                }
                _this.updateStatus(rowId[0], depositNo, docStatus);

            }
        },
        //修改单据状态
        updateStatus(id, depositNo, documentStatus) {
            $.ajax({
                type: "post",
                url: contextPath + '/deposit/updateStatus',
                data: {id: id, deposit: depositNo, status: documentStatus},
                dataType: "json",
                success: function (data) {
                    vm.reload = !vm.reload;
                }
            });
        },
        updataCustOrder(id) {
            $.ajax({
                type: "post",
                url: contextPath + '/deposit/updataCustOrder',
                data: {id: id},
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        vm.reload = !vm.reload;
                    }
                }
            });
        },
        saveFinancialData(id) {
            $.ajax({
                type: "post",
                url: contextPath + '/deposit/saveFinancialData',
                data: {id: id},
                dataType: "json",
                success: function (data) {
                    if (data.code == "100100") {
                        vm.reload = !vm.reload;
                    }
                }
            });
        },


        /** 审核*/
        audit() {
            //发送请求
            let $This = this;
            let This = this.selected;
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var depositNo = obj.depositNo.replace(/<.*?>+/g, "");
            var status = obj.status.replace(/<.*?>+/g, "");
            if (This.length != 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '只能选择一条数据！'
                });
                return;
            }

            if (obj.status === "暂存") {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请先提交单据！'
                });
                return;
            } else if (obj.status === "已审核") {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '该单已审核,不能重复审核！'
                });
                return;
            }else   if (obj.status === "待审核" ||
                obj.status === "审核中" ||
                obj.status === "驳回") {
                let This = this;
                This.id = obj.id;
                This.documentStatus = status;
                This.documentNo = depositNo;
                This.modalType = 'approve';
                This.modalTrigger = !This.modalTrigger;
            }

        },
        //驳回
        reject() {
            let $This = this;
            let This = this.selected;
            let obj = $('#myTable').jqGrid('getRowData', this.selected[0]);
            var depositNo = obj.depositNo.replace(/<.*?>+/g, "");
            var status = obj.status.replace(/<.*?>+/g, "");
            if (This.length != 1) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '请选择一条数据！'
                });
                return;
            } else {
                if (obj.status === "待审核" ||
                    obj.status === "审核中" ||
                    obj.status === "驳回") {
                    let This = this;
                    This.id = obj.id;
                    This.documentStatus = status;
                    This.documentNo = depositNo;
                    This.modalType = 'reject';
                    This.modalTrigger = !This.modalTrigger;
                } else {
                    $This.$Modal.warning({
                        title: '提示信息',
                        content: '该单状态不能驳回！'
                    });
                }
            }
        },


        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        }

    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})