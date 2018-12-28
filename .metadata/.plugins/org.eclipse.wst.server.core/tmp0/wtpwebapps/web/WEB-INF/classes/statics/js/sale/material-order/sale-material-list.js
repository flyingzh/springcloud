let customer = new Vue({
    el: "#customer-come",
    data() {
        return {
            isHideSearch: true,
            //所选的客户对象
            selectCustomerObj: null,
            isHideList: true,
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            comeInfo: "",
            openTime: "",
            body: {
                materialOrderNo: "",//单据编号
                customerName: "",//客户
                startTime: '',
                endTime: '',//来料时间
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            TSaleMaterialOrderEntity: {
                materialOrderNo: '',
                documentStatus: ''
            },
            isHide: true,
            confirmConfig: {
                showConfirm: false,
                title: '提示',
                content: '请点击确认',
                onlySure: true,
                success: true
            },
            dataValue: [],
            isSearchHide: true,
            reload: false,
            selected: [],
            data_user_list: {
                //页表页数据
                url: contextPath + "/tsaleMaterialOrder/quarylist",
                colNames:
                    ['id', '日期', '单据编号', '单据状态', '客户', '关联客户订单', '业务员', '备注'],
                colModel:
                    [
                        {name: 'id', index: 'id', hidden: true},
                        {
                            name: 'inTime', index: 'inTime', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if (value) {
                                    Date.prototype.Format = function (fmt) { //author: meizz
                                        var o = {
                                            "M+": this.getMonth() + 1, //月份
                                            "d+": this.getDate(), //日
                                            "h+": this.getHours(), //小时
                                            "m+": this.getMinutes(), //分
                                            "s+": this.getSeconds(), //秒
                                            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                                            "S": this.getMilliseconds() //毫秒
                                        };
                                        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
                                        for (var k in o)
                                            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1,
                                                (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
                                        return fmt;
                                    }
                                    return new Date(value).Format("yyyy-MM-dd");
                                }
                                return "";
                            }
                        },
                        {
                            name: 'materialOrderNo', index: 'materialOrderNo', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {

                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    customer.updateDetailClick({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: 'documentStatus', index: 'documentStatus', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 1 ? "暂存" : value == 2 ?
                                    "待审核" : value == 3 ? "审核中" : value == 4 ?
                                        "已审核" : "驳回";
                            }
                        },
                        {name: 'customerName', index: 'customerName', width: 100, align: "center"},
                        {
                            name: 'saleOrderNo', index: 'saleOrderNo', width: 100, align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".detail" + value).on("click", ".detail" + value, function () {
                                    customer.detail({value, grid, rows, state})
                                });
                                let btns = `<a class="detail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {name: "saleMenName", index: "saleMenName", width: 100, align: "center"},
                        {name: "remark", index: "remark", width: 100, align: "center"}
                    ],
                gridComplete: function () {
                    console.log(11111111)
                },
                /*multiselect:true,
                multiboxonly:true,*/
            }
        }
    },
    methods: {
        //根据单据编号进入新增页面
        updateDetailClick(data) {
            let This = this;
            var materialOrderNo = data.value;
            console.log(materialOrderNo)
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                //dataType:"json",
                data: {"materialOrderNo": materialOrderNo},
                success: function (data) {
                    if(data.data!=null) {
                        console.log(data)
                        window.parent.activeEvent({
                            name: '客户来料单-查看',
                            url: contextPath + '/sale/material-order/sale-material-add.html',
                            params: {allInfo: data, type: 'query'}
                        });
                    }else{
                        This.$Modal.error({
                            title: "提示信息",
                            content: "请求失败！"
                        });
                    }
                },
                error() {
                    console.log("请求失败")
                }
            })
        },
        //跳转客户订单页面
        detail(data) {
            var saleOrderNo = data.value;
            console.log(saleOrderNo)
            window.parent.activeEvent({
                name: '客户订单-查看',
                url: contextPath + '/sale/customer-order/customer-order-add.html',
                params: {type: 'view', saleOrderNo: saleOrderNo}
            });
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.customerName = this.selectCustomerObj.name;
            }
            console.log(this.selectCustomerObj)
        },
        //时间
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //新增
        add() {
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/addTSaleMaterialOrder",
                contentType: 'application/json; charset=utf-8',
                dataType: "json",
                success: function (data) {
                    window.parent.activeEvent({
                        name: '客户来料单-新增',
                        url: contextPath + '/sale/material-order/sale-material-add.html',
                        params: {allInfo: data, type: 'add'}
                    });
                },
                error() {
                    console.log("请求失败")
                }
            })
        },
        //提交
        submit() {
            console.log(this.selected);
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = $("#myTable").jqGrid("getRowData", this.selected);
            console.log(rowData);
            if (rowData.documentStatus !== "暂存") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "该单据已经提交过了,请重新选择！"
                });
                return false;
            }
            console.log(rowData.id)
            let materialOrderNo = rowData.materialOrderNo;
            var arr = materialOrderNo.split('>');
            materialOrderNo = arr[1].split('<')[0];
            console.log(materialOrderNo);
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                data: {"materialOrderNo": materialOrderNo},
                success: function (data) {
                    console.log(data)
                    if(data.data.custNo==""||data.data.saleMenName==""
                        ){
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "提交的单据有漏填项,请前往补充,谢谢!"
                        });
                        return false;
                    }
                    if(data.data.goodList == null){
                        This.$Modal.warning({
                            title: "提示信息",
                            content: "提交的单据有漏填项,请前往补充,谢谢!"
                        });
                        return false;
                    }
                    if(data.data.goodList){
                        console.log(data.data.goodList)
                        for (var i = 0; i < data.data.goodList.length; i++) {
                            //判断是否为空
                            if(data.data.goodList[i].goodsMainType=='attr_ranges_gold') {
                                if (data.data.goodList[i].totalWeight == ""||data.data.goodList[i].totalWeight == null) {
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content: `第${i + 1}行金料总重没填`
                                    })
                                    return false;
                                }
                                if (data.data.goodList[i].processNature == ""||data.data.goodList[i].processNature == null) {
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content: `第${i + 1}行来料性质没填`
                                    })
                                    return false;
                                }
                                if(data.data.goodList[i].num == ""){
                                    data.data.goodList[i].num = 0
                                }
                            }
                            if (data.data.goodList[i].goodsMainType!='attr_ranges_gold'){
                                if(data.data.goodList[i].num == ""||data.data.goodList[i].num == null){
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content:`提交失败,第${i+1}行数量没填！`
                                    })
                                    return false;
                                }
                                if(data.data.goodList[i].totalWeight == ""||data.data.goodList[i].totalWeight == null){
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content:`提交失败,第${i+1}行总重没填！`
                                    })
                                    return false;
                                }
                                if(data.data.goodList[i].totalWeight <=0||data.data.goodList[i].num <=0){
                                    This.$Modal.warning({
                                        title: "提示信息",
                                        content:`提交失败,第${i+1}行总重数量必须大于0！`
                                    })
                                    return ;
                                }
                            }
                        }
                    }
                    //更新数据
                    data.data.documentStatus = 2;
                    data.data.inTime = new Date();
                    This.updateData(data.data, "提交成功!")
                },
                error() {
                    console.log("系统错误")
                }
            })
        },
        //退出
        cancel() {
            window.parent.closeCurrentTab({name: '客户来料单-列表', exit: true, openTime: customer.openTime})
        },
        //模糊查询
        search() {
            console.log(this.body)
            this.reload = !this.reload;
        },
        clear() {
            //this.$refs.mType.reset();
            /*this.$nextTick(function () {
                this.body.materialType = '';
            });*/
            this.body = {
                materialOrderNo: '',//单据编号
                customerName: '',//客户
                startTime: '',
                endTime: '',//来料时间
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.dataValue = [];
            this.$refs.customerRef.clear();
            console.log(this.body)
        },
        //刷新
        refresh() {
            this.clear();
            this.reload = !this.reload;
            this.selected = [];
        },
        //跳转详情页面
        detailClick(data) {
            let code = data.rows.materialOrderNo;
            console.log(code)
        },
        //修改
        modify() {
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = $("#myTable").jqGrid("getRowData", this.selected);
            let This = this;
            let materialOrderNo = rowData.materialOrderNo;
            var arr = materialOrderNo.split('>');
            materialOrderNo = arr[1].split('<')[0];
            if (!$.isEmptyObject(materialOrderNo) && materialOrderNo != undefined) {
                $.ajax({
                    type: "POST",
                    url: contextPath + "/tsaleMaterialOrder/quaryAllInformation",
                    //dataType:"json",
                    data: {"materialOrderNo": materialOrderNo},
                    success: function (data) {
                        if(data.data!=null){
                            console.log(data)
                            window.parent.activeEvent({
                                name: '客户来料单-修改',
                                url: contextPath + '/sale/material-order/sale-material-add.html',
                                params: {allInfo: data, type: 'query'}
                            });
                        }else{
                            This.$Modal.error({
                                title: "提示信息",
                                content: "请求失败！"
                            });
                        }

                    },
                    error() {
                        console.log("请求失败")
                    }
                })
            }
        },
        //批量删除
        remove() {
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示信息",
                    okText: "确定",
                    content: "请选中想要删除的行!"
                });
                return;
            }
            let selected = this.selected;
            let ids = [];
            let tabobj = "";
            let temp = true;
            for (let i = 0; i < selected.length; i++) {
                //只有暂存单据状态才能删除
                tabobj = $('#myTable').jqGrid('getRowData', this.selected[i])
                if (tabobj.documentStatus !== "暂存") {
                    temp = false;
                    this.$Modal.warning({
                        title: "提示信息",
                        content: "单据不是暂存状态不能删除"
                    });
                } else {
                    ids.push(selected[i]);
                }
            }
            if (temp) {
                this.$Modal.confirm({
                    scrollable:true,
                    content:"你确定要删除选中的数据？",
                    okText:"确定",
                    cancelText:"取消",
                    onOk(){
                        $.ajax({
                            type: 'post',
                            url: contextPath + "/tsaleMaterialOrder/delete",
                            contentType: 'application/json',
                            data: JSON.stringify(ids),
                            dataType: "json",
                            success: function (result) {
                                if (result.code === "100100") {
                                    setTimeout(()=>{
                                        customer.$Modal.success({
                                            title: "提示信息",
                                            content: "删除成功",
                                            okText: "确定",
                                            onOk: function () {
                                                customer.reload = !customer.reload;
                                            }
                                        });
                                    },300);
                                } else {
                                    customer.$Modal.error({
                                        content: "删除失败!",
                                        okText: "确定"
                                    });
                                }
                            },
                            error: function (err) {
                                console.log("服务器出错");
                            },
                        })
                    }
                })
            }
        },
        //匹配单据状态
        transDocStatus(value) {
            return value === "暂存" ? 1 : value === "待审核" ? 2
                : value === "审核中" ? 3 : value === "已审核" ? 4 : 5;
        },
        //审批
        approval(value) {
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
                    title: "提示信息",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = $("#myTable").jqGrid("getRowData", this.selected);
            if (rowData.documentStatus === "已审核") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+rowData.materialOrderNo+"的单据,目前状态不可以审核!"
                });
                return false;
            }
            if (rowData.documentStatus === "暂存") {
                This.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+rowData.materialOrderNo+"的单据,目前状态不可以审核!"
                });
                return false;
            }
            var arr = rowData.materialOrderNo.split('>');
            rowData.materialOrderNo = arr[1].split('<')[0];
            This.TSaleMaterialOrderEntity.materialOrderNo = rowData.materialOrderNo;
            This.TSaleMaterialOrderEntity.documentStatus = This.transDocStatus(rowData.documentStatus);
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(value) {
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请先选择一条记录"
                });
                return false;
            } else if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            var rowData = $("#myTable").jqGrid("getRowData", this.selected);
            if (rowData.documentStatus === "已审核") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+rowData.materialOrderNo+"的单据,目前状态不可以驳回!"
                });
                return false;
            }
            if (rowData.documentStatus === "暂存") {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+rowData.materialOrderNo+"的单据,目前状态不可以审核!"
                });
                return false;
            }
            var arr = rowData.materialOrderNo.split('>');
            rowData.materialOrderNo = arr[1].split('<')[0];
            This.TSaleMaterialOrderEntity.materialOrderNo = rowData.materialOrderNo;
            This.TSaleMaterialOrderEntity.inTime = new Date();
            This.TSaleMaterialOrderEntity.documentStatus = This.transDocStatus(rowData.documentStatus);
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            console.log(res)
            let This = this;
            if (res.result.code == '100515') {
                var rowData = $("#myTable").jqGrid("getRowData", This.TSaleMaterialOrderEntity.id);

                if (This.modalType == 'approve') {
                    rowData.documentStatus=4;
                    This.updateData(rowData, "审核");
                }
                if (This.modalType == 'reject') {
                    rowData.documentStatus=1;
                    This.updateData(rowData, "驳回");
                }
            }
            /*//走审核流程,更新单据状态
            if(res.result.code == '100100'){
                This.$Modal.warning({

                    content: '审核成功!',
                    title:'提示'
                });
            }else {
                This.$Modal.warning({
                    content: '审核失败!',
                    title:'提示'
                });
            }*/
            This.refresh();
        },
        //更新来料列表数据
        updateData(rowData, msg) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/tsaleMaterialOrder/update",
                contentType: 'application/json',
                data: JSON.stringify(rowData),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content:"提交失败!"
                        });
                    }
                    This.refresh();
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示信息",
                        content: "服务器出错"
                    });
                }
            })
        },
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})