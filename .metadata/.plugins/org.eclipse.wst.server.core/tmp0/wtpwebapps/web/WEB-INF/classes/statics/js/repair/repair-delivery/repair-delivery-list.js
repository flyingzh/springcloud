let repairList = new Vue({
    el: "#repair-order-list",
    data() {
        return {
            //控制弹窗显示
            modalTrigger: false,
            selectCustomerObj: null,
            modalType: '',
            //审批进度条
            stepList: [],
            isHideSearch: true,
            isHideList: true,
            reload: true,
            openTime: "",
            repairEntity: {
                status: '',
                shipOrderNo: '',
            },
            body: {
                //单据编号
                shipOrderNo: "",
                //客户名称
                custName: "",
                //开始时间
                starTime: "",
                //结束时间
                endTime: "",
            },
            //列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/repairShipOrder/queryShipOrderEntityPageList',
                colNames:
                    ['单据编号', '日期', '单据状态', '客户', '业务员', '物流方式', '备注'],
                colModel:
                    [
                        {
                            name: 'shipOrderNo', index: 'shipOrderNo', width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    repairList.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: 'repairTime', index: 'repairTime', width: 200, align: "center",
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
                            name: 'status', index: 'status', width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return value == 1 ? "暂存" : value == 2 ?
                                    "待审核" : value == 3 ? "审核中" : value == 4 ?
                                        "已审核" : "驳回";
                            }
                        },
                        {name: 'custName', index: 'custName', width: 200, align: "center"},
                        {name: "saleMenName", index: "saleMenName", width: 200, align: "center"},
                        {name: 'shipMethod', index: 'shipMethod', width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if (value =="wlfs_zt") {
                                    return "自提";
                                } else if (value == "wlfs_js") {
                                    return "寄送";
                                }
                                else if (value =="wlfs_shsm") {
                                    return "送货上门";
                                }else if (value ==null) {
                                    return " ";
                                }
                            }
                        },
                        {name: "remark", index: "remark", width: 200, align: "center"}
                    ],
            },
            reload: true,
            selected: [],
            returnTime: "",
        }
    },
    methods: {
        updateDetail(data) {
            let This = this;
            let code = data.rows.shipOrderNo;

            //查询数据
            $.ajax({
                type: "POST",
                async: false,
                url: contextPath + "/repairShipOrder/queryAllShipOrderEntity",
                dataType: "json",
                data: {"shipOrderNo": code},
                success: function (res) {
                    if (res.code === "100100") {
                        window.parent.activeEvent({
                            name: '维修发货单-查看',
                            url: contextPath + '/repair/repair-delivery/repair-delivery-add.html',
                            params: {allInfo: res.data, type: 'query'}
                        });
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "数据异常!"
                        });
                    }
                }
            })
        },
        //改变日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //搜索
        search() {
            this.reload = !this.reload;
            this.selected = []
        },
        //重置
        clean() {
            this.body = {
                shipOrderNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',//来料时间
            };
            this.$refs.customerRef.clear();
        },
        refresh() {
            this.reload = !this.reload
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            console.log(res.result.data)
            //未开启审批流，直接审核或驳回
            if (res.result.code === '100515') {
                if (this.modalType === 'approve') {
                    this.selected[0].status = 4;
                    this.updateData(this.selected[0], "审核");
                }
                if (this.modalType === 'reject') {
                    this.selected[0].status = 1;
                    this.updateData(this.selected[0], "驳回");
                }
            }
            this.refresh();
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
            if (this.selected[0].status !== 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "该单据已经提交过了,请重新选择！"
                });
                return false;
            }
            // 判断所选数据是否通过基本校验
            if (this.selected[0].dataStatus === 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "提交的单据有漏填项,请前往补充,谢谢！"
                });
                return false;
            }
            if(this.selected[0].saleMenName===""||this.selected[0].shipMethod===""){
                this.$Modal.warning({
                    title: "提示信息",
                    content: "提交的单据有漏填项,请前往补充,谢谢！"
                });
            }
            //更新数据
            this.selected[0].status = 2;
            This.updateData(this.selected[0], "提检验项目已提交!");
        },
        //审核
        approval(value) {
            console.log(this.selected);
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示信息",
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
            if (this.selected[0].status === 4) {
                this.$Modal.warning({
                    title: "提示",
                    content: "单据编号为"+this.selected[0].shipOrderNo+"的单据,目前状态不可以审核!"
                });
                return false;
            }
            if (this.selected[0].status === 1) {
                This.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+this.selected[0].shipOrderNo+"的单据,目前状态不可以审核!"
                });
                return false;
            }
            This.repairEntity.shipOrderNo = this.selected[0].shipOrderNo;
            This.repairEntity.status = this.selected[0].status;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject() {
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
            if (this.selected[0].status === 4) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+this.selected[0].shipOrderNo+"的单据,目前状态不可以驳回!"
                });
                return false;
            }
            if (this.selected[0].status === 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "单据编号为"+this.selected[0].shipOrderNo+"的单据,目前状态不可以驳回!"
                });
                return false;
            }
            This.repairEntity.shipOrderNo = this.selected[0].shipOrderNo;
            This.repairEntity.status = this.selected[0].status;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.custName = this.selectCustomerObj.name;
            }
            console.log(this.selectCustomerObj)
        },
        //修改
        updateData(rowData, msg) {
            console.log(rowData)
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/repairShipOrder/updateRepairShipOrderEntity",
                contentType: 'application/json',
                data: JSON.stringify(rowData),
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        This.$Modal.success({
                            title: "提示信息",
                            content: msg
                        });
                        This.refresh();
                    } else {
                        This.$Modal.error({
                            title: "提示信息",
                            content: "提交失败!"
                        });
                    }
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