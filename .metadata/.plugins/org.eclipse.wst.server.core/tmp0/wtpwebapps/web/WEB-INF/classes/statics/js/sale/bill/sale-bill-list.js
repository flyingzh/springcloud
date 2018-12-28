var saleBill = new Vue({
    el: '#sale-bill-list',
    data() {
        let This = this;
        return {
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            openName:'',
            isShow: false,
            isEdit: false,
            reload: false,
            openTime: "",
            customerModel: {}, //所选的客户对象
            isHideSearch: true,
            isHideList: true,
            isHide: true,
            selected: [],
            dataValue: [],
            saleBillEntity:{
                documentStatus:'',
                documentNo:'',
            },
            body: {
                documentNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            addBody: {},
            data_config: {
                url: contextPath + "/saleBillController/list",
                colNames: ['id',  '日期','单据编号', '单据状态', '客户', '上单累计应收款', '本单应收款', '累计应收款','备注',],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {
                        name: 'createTime', index: 'createTime', width: 240, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'documentNo', index: 'documentNo', width: 250, align: "left",
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
                            ;
                        }
                    },
                    {name: 'custName', index: 'custName', align: "left", width: 200,},
                    {
                        name: 'lastReceiptAmount', index: 'lastReceiptAmount', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            console.log(value)
                            if (value!==null) {
                                val = value.toFixed(2);
                            }
                            return val;
                        }
                    },
                    {
                        name: 'currentReceiptAmount', index: 'currentReceiptAmount', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val = "";
                            if (value!==null) {
                                val = value.toFixed(2);
                            }
                            return val;
                        }
                    },
                    {
                        name: 'totalReceiptAmount', index: 'totalReceiptAmount', align: "right", width: 200,
                        formatter: function (value, grid, rows, state) {
                            let val = "";
                            if (value!==null) {
                                val = value.toFixed(2);
                            }
                            return val;
                        }
                    },
                    {name: 'remark', index: 'remark', align: "left", width: 240,},
                ],
            },
        }
    },
    methods: {
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            this.reload = !this.reload;
        },
        clear() {
            this.body = {
                documentNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.$refs.customerRef.clear();
            this.dataValue = [];
        },
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        //跳转详情页面
        detailClick(data) {
            let code = data.rows.documentNo;
            console.log(code)
            window.parent.activeEvent({
                name: '销售结算单-查看',
                url: contextPath+'/sale/bill/sale-bill-add.html',
                params: {documentNo:code,type:'update'}
            });
        },
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        //删除
        deleteData() {
            console.log(JSON.stringify(this.selected));
            let This = this;
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请至少选择一条记录进行删除"
                });
                return;
            }
            let documentNos = [];
            var count = 0;
            this.selected.forEach((item)=>{
                if(item.documentStatus === 1){
                    documentNos.push(item.documentNo);
                    count++;
                }
            });
            if(this.selected.length!==count){
                this.$Modal.warning({
                    title: "提示",
                    content: "只有单据状态为暂存的单即可删除!"
                });
                return false;
            }
            this.$Modal.confirm({
                scrollable:true,
                title: '提示信息',
                content: '<p>你确定要删除选中的数据？</p>',
                okText:"确定",
                cancelText:"取消",
                onOk(){
                    $.ajax({
                        type: "POST",
                        url: contextPath + '/saleBillController/deleteBatch',
                        data: JSON.stringify(documentNos),
                        dataType: "json",
                        contentType: 'application/json; charset=utf-8',
                        success: function (data) {
                            if (data.code === "100100") {
                                setTimeout(()=>{
                                    This.$Modal.success({
                                        scrollable:true,
                                        title: "提示",
                                        content: "删除成功!",
                                        onOk(){
                                            This.refresh();
                                        }
                                    })
                                },300);
                            }else {
                                This.$Modal.error({
                                    title: "提示",
                                    content: "删除失败!"
                                });
                            }
                        },
                        error: function (err) {
                            This.$Modal.error({
                                title: "提示",
                                content: "服务器出错"
                            });
                        }
                    })
                },
            })
        },
        //修改
        modify() {
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            let code = this.selected[0].documentNo;
            if (!$.isEmptyObject(code) && code != undefined) {
                window.parent.activeEvent({
                    name: '销售结算单-修改',
                    url: contextPath+'/sale/bill/sale-bill-add.html',
                    params: {documentNo:code,type:'update'}});
            }
        },
        //提交
        submit() {
            console.log(this.selected);
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            if (this.selected[0].documentStatus !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据之前已经提交过了,不能再提交!"
                });
                return false;
            }
            let code = this.selected[0].documentNo;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleBillController/getSaleBillVoInfo",
                data: JSON.stringify({"documentNo": code}),
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    if(data.code=='100100'){
                        //对要提交的数据校验

                        //更新数据
                        data.data.documentStatus = 2;
                        This.updateData(data.data,"提交");
                    }else{
                        This.$Modal.error({
                            title: "提示",
                            content: "提交失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })

        },
        //审批
        approval(value) {
            console.log(this.selected);
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            }
            if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            if (this.selected[0].documentStatus === 4) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据已审核通过!"
                });
                return false;
            }
            if (this.selected[0].documentStatus === 1) {
                This.$Modal.warning({
                    title: "提示",
                    content: "请先提交!"
                });
                return false;
            }
            This.saleBillEntity.documentNo = this.selected[0].documentNo;
            This.saleBillEntity.documentStatus = this.selected[0].documentStatus;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(value) {
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            if (this.selected[0].documentStatus === 4) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据已审核通过,不能驳回"
                });
                return false;
            }
            if (this.selected[0].documentStatus === 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先提交!"
                });
                return false;
            }
            This.saleBillEntity.documentNo = this.selected[0].documentNo;
            This.saleBillEntity.documentStatus = this.selected[0].documentStatus;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            //未开启审批流，直接审核或驳回
            if (res.result.code == '100515') {
                if (this.modalType == 'approve') {
                    this.selected[0].documentStatus=4;
                    this.updateData(this.selected[0],"审核");
                }
                if (this.modalType == 'reject') {
                    this.selected[0].documentStatus=1;
                    this.updateData(this.selected[0],"驳回");
                }
            }
            if (res.result.code === '100100') {
                this.refresh();
            }
        },
        //更新单据数据
        updateData(rowData,msg) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/saleBillController/update",
                contentType: 'application/json',
                data: JSON.stringify(rowData),
                dataType: "json",
                success: function (data) {
                    if(data.code=='100100'){
                        setTimeout(()=>{
                            This.$Modal.success({
                                scrollable:true,
                                title: "提示",
                                content: msg+"成功!",
                                onOk(){
                                    This.refresh();
                                }
                            })
                        },300);
                    }else{
                        This.$Modal.error({
                            title: "提示",
                            content: msg+"失败!"
                        });
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "服务器出错"
                    });
                }
            })
        },
        //匹配单据状态
        transDocStatus(value) {
            return value === "暂存" ? 1 : value === "待审核" ? 2
                : value === "审核中" ? 3 : value === "已审核" ? 4 : 5;
        },
        //退出
        cancel() {
            window.parent.closeCurrentTab({name: this.openName, exit: true, openTime: this.openTime})
        },
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})
