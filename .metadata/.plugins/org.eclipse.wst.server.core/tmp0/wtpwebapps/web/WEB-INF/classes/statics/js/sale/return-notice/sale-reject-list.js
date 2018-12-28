var saleReturn = new Vue({
    el: '#sale-reject-list',
    data() {
        let This = this;
        return {
            isShow: false,
            isEdit: false,
            reload: false,
            myTable:"myTable",
            openTime: "",
            isHideSearch: true,
            isHideList: true,
            isHide: true,
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            selected: [],
            customerModel: null,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            dataValue: [],
            businessTypeList:[
                {
                    value:null,
                    label:"全部"
                },
                {
                    value:"S_CUST_ORDER_01",
                    label:"普通销售"
                },
                {
                    value:"S_CUST_ORDER_02",
                    label:"受托加工销售"
                }
            ],
            body: {
                businessType: '',//业务类型
                documentNo: '',//单据编号
                custNo: '',//客户
                custName: '',//客户名称
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            addBody: {
                id: "",
                documentNo: "",
                goodList: [],//商品行信息
                documentStatus: "",//单据状态
                businessStatus: ""//业务状态
            },
            data_config: {
                url: contextPath + "/tSaleReturnNotice/list",
                colNames: ['id', '日期', '单据编号', '单据状态', '业务状态', '业务类型', '退货客户', '退货原因', '总数量', '总重量'],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {
                        name: 'returnDate', index: 'returnDate', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'documentNo', index: 'documentNo', width: 280, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'documentStatus', index: 'documentStatus', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "暂存" : value === 2 ?
                                "待审核" : value === 3 ? "审核中" : value === 4 ?
                                    "已审核" : "驳回";
                        }
                    },
                    {
                        name: 'businessStatus', index: 'businessStatus', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "待质检判定" : value === 2 ? "已质检判定" : "";
                        }
                    },
                    {
                        name: 'businessType', index: 'businessType', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 'S_CUST_ORDER_01' ? "普通销售" : value=== 'S_CUST_ORDER_02'? "受托加工销售":"";
                        }
                    },
                    {name: 'custName', index: 'custName', align: "left", width: 200,},
                    {name: 'reason', index: 'reason', align: "left", width: 240,},
                    {
                        name: 'totalNum', index: 'totalNum', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val = "";
                            if (value) {
                                val = value.toFixed(0);
                            }
                            return val;
                        }
                    },
                    {
                        name: 'totalWeight', index: 'totalWeight', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val = "";
                            if (value) {
                                val = value.toFixed(2);
                            }
                            return val;
                        }
                    },
                ],
            },
        }
    },
    methods: {
        //判断有且仅选中一行
        checkSelect() {
            let selectFlag = true
            console.log(this.selected);
            if (this.selected.length != 1) {
                this.$Modal.warning({
                    content: "请选择一条记录！"
                })
                selectFlag = false
                return
            }
            return selectFlag
        },
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            console.log(this.body)
            this.reload = !this.reload;
        },
        //客户
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        //跳转详情页面
        detailClick(data) {
            let code = data.rows.documentNo;
            let toMsg = data.rows.documentStatus==1?"修改":"查询";
            window.parent.activeEvent({
                name: '销售退货通知单-'+toMsg,
                url: contextPath + '/sale/return-notice/sale-reject-add.html',
                params: {documentNo: code, type: 'query'}
            });
        },
        clear() {
            this.$refs.mType.reset();
            this.$refs.customerRef.clear();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
            this.dataValue = [];
            this.body = {
                businessType: '',//业务类型
                documentNo: '',//单据编号
                custNo: '',//客户
                custName: '',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            console.log(this.body);

        },
        //清空按钮
        clearType(){
            this.$refs.mType.reset();
            this.$nextTick(function () {
                this.body.businessType = '';
            });
        },
        refresh() {
            this.clear();
            this.reload = !this.reload;
        },
        //新增
        add() {
            window.parent.activeEvent({
                name: '销售退货通知单-新增',
                url: contextPath + '/sale/return-notice/sale-reject-add.html',
                params: {type: 'add'}
            });
        },
        //删除
        deleteData() {
            let This = this;
            if (This.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请至少选择一条记录进行删除"
                });
                return;
            }
            console.log(this.selected)
            for (let i = 0; i < this.selected.length ; i++) {
                var rowData = $("#myTable").jqGrid("getRowData", this.selected[i]);
                if (This.transdocstatus(rowData.documentStatus) != 1) {
                    This.$Modal.warning({
                        title: "提示",
                        content: "只有单据状态为暂存的单即可删除!"
                    });
                    return;
                }
            }
            console.log(rowData)

            $.ajax({
                type: "POST",
                url: contextPath + '/tSaleReturnNotice/deleteBatch',
                data: JSON.stringify(This.selected),
                dataType: "json",
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    console.log(data.data);
                    This.$Modal.success({
                        title: "提示",
                        content: "删除成功"
                    });
                    This.reload = !This.reload;
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        //修改
        modify() {
            let This = this;
            //校验选取的行
            let selectFlag = this.checkSelect();
            if (selectFlag) {
                var rowData = $("#myTable").jqGrid("getRowData", This.selected);
                let code = rowData.documentNo;
                let toMsg = rowData.documentStatus == "暂存"? "修改":"查看";
                var arr = code.split('>');
                code = arr[1].split('<')[0];
                if (!$.isEmptyObject(code) && code != undefined) {
                    window.parent.activeEvent({
                        name: '销售退货通知单-'+toMsg,
                        url: contextPath + '/sale/return-notice/sale-reject-add.html',
                        params: {documentNo: code, type: 'query'}
                    });
                }
            }
        },
        //提交
        submit() {
            let This = this;
            //校验选取的行
            let selectFlag = this.checkSelect();
            if(selectFlag){
                var rowData = $("#myTable").jqGrid("getRowData", This.selected);
                if (rowData.documentStatus !== "暂存") {
                    this.$Modal.warning({
                        title: "提示",
                        content: "该单据之前已经提交过了,不能再提交!"
                    });
                    return false;
                }
                var arr = rowData.documentNo.split('>');
                rowData.documentNo = arr[1].split('<')[0];
                This.sendAjax(rowData.documentNo)
            }
        },
        sendAjax(documentNo) {
            let _this = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/tSaleReturnNotice/info',
                data: {documentNo: documentNo},
                dataType: "json",
                success: function (result) {
                    console.log(result)
                    if (result.code == '100100') {
                        var idata = result.data;
                        var flag = false;
                        //对要提交的数据校验
                        if (idata.documentNo == "" || idata.organizationId == "" || idata.businessType == "" ||
                            idata.custNo == "" || idata.returnDate == "" || idata.goodList.length == 0
                        ) {
                            _this.$Modal.warning({
                                content: "提交失败,请输入必填项!"
                            });
                            return false;
                        }
                        if (idata.goodList.length > 0) {
                            idata.goodList.map((item) =>{
                                if (item.reProcessMethod == '' || item.reProcessMethod == null) {
                                    flag = true;
                                    return
                                }
                            });
                        }
                        if (flag) {
                            _this.$Modal.warning({
                                content: "请输入完退货处理方式!"
                            });
                            return false;
                        }

                        _this.addBody.goodList = result.data.goodList;

                        //设置业务状态
                        var isQuality = false;
                        if (idata.goodList.length > 0) {
                            idata.goodList.map((item, index) => {
                                if(item.qualityResult == "" || null == item.qualityResult){
                                    isQuality = true
                                }
                            });
                            if (isQuality) {
                                result.data.businessStatus = 1;//待质检判定
                            }else {
                                result.data.businessStatus = 2;//已质检判定
                            }
                        }
                        //更新数据
                        result.data.documentStatus = 2;
                        console.log(result.data)
                        _this.updateData(result.data, "提交成功!");
                    }
                }
            })
        },
        transdocstatus(value) {
            return value === "暂存" ? 1 : value === "待审核" ? 2
                : value === "审核中" ? 3 : value === "已审核" ? 4 : 5;
        },
        //审批
        approval(value) {
            let This = this;
            //校验选取的行
            let selectFlag = this.checkSelect();
            if(selectFlag){
                var rowData = $("#myTable").jqGrid("getRowData", This.selected)
                if (rowData.businessStatus != '已质检判定') {
                    This.$Modal.warning({
                        content: "请完成质检判定后再审核单据！"
                    })
                } else {
                    var arr = rowData.documentNo.split('>');
                    rowData.documentNo = arr[1].split('<')[0];
                    This.addBody.id = rowData.id;
                    console.log(This.addBody.id)
                    This.addBody.documentNo = rowData.documentNo;
                    This.addBody.documentStatus = This.transdocstatus(rowData.documentStatus);
                    This.modalType = 'approve';
                    This.modalTrigger = !This.modalTrigger;
                }
            }
        },
        //驳回
        reject(value) {
            let This = this;
            //校验选取的行
            let selectFlag = this.checkSelect();
            if(selectFlag){
                var rowData = $("#myTable").jqGrid("getRowData", This.selected);
                var arr = rowData.documentNo.split('>');
                rowData.documentNo = arr[1].split('<')[0];
                This.addBody.id = rowData.id;
                This.addBody.documentNo = rowData.documentNo;
                This.addBody.documentStatus = This.transdocstatus(rowData.documentStatus);
                This.modalType = 'reject';
                This.modalTrigger = !This.modalTrigger;
            }
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            console.log(res)
            let _this = this;
            if (res.result.code == '100515') {
                if (_this.modalType == 'approve') _this.ajaxUpdateDocStatusById(_this.addBody.id, 4);
                if (_this.modalType == 'reject') _this.ajaxUpdateDocStatusById(_this.addBody.id, 1);
            }
            this.reload = !this.reload
        },
        ajaxUpdateDocStatusById(id, status) {
            let _this = this;
            $.ajax({
                url: contextPath + '/tSaleReturnNotice/update',
                method: 'POST',
                dataType: 'json',
                contentType: 'application/json;charset=utf-8',
                data: JSON.stringify({id: id, documentStatus: status}),
                success: function (data) {
                    if (data.code == '100100') {
                        _this.addBody.documentStatus = status;
                    }
                }
            });
        },

        //退出
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime})
        },
        //更新单据数据
        updateData(rowData, msg) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tSaleReturnNotice/update",
                contentType: 'application/json',
                data: JSON.stringify(rowData),
                dataType: "json",
                success: function (data) {
                    This.reload = !This.reload;
                    This.$Modal.success({
                        title: "提示",
                        content: msg
                    });
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('');
    },
})
