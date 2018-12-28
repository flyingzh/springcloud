let waitGoods = new Vue({
    el: "#wait-goods",
    data() {
        return {
            isHideSearch: true,
            selectCustomerObj: null,
            isHideList: true,
            selected: [],
            openTime: '',
            dataValue: [],
            inOrderNoList: [],
            body: {
                inOrderNo: "",
                //开始时间
                starTime: "",
                //结束时间
                endTime: "",
            },
            //列表
            data_user_list: {
                //列表页数据
                url: contextPath + '/repairShipOrder/queryPageList',
                colNames:
                    ['源单类型', '源单编号', '日期', '客户', '商品类型', '商品件数'],
                colModel:
                    [
                        {
                            name: 'sourceType', index: 'sourceType', width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                let btns = `<span type="primary" class="select${rows.id}">维修收回单</span>`;
                                return btns
                            }
                        },
                        {
                            name: 'inOrderNo', index: 'inOrderNo', width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                $(document).off("click", ".updateDetail" + value).on("click", ".updateDetail" + value, function () {
                                    waitGoods.updateDetail({value, grid, rows, state})
                                });
                                let btns = `<a class="updateDetail${value}">${value}</a>`;
                                return btns;
                            }
                        },
                        {
                            name: 'returnTime', index: 'returnTime', width: 200, align: "center",
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
                        {name: "custName", index: "custName", width: 200, align: "center"},
                        {name: 'goodsTypeName', index: 'goodsTypeName', width: 200, align: "center"},
                        {name: "num", index: "num", width: 200, align: "center"}
                    ],
            },
            reload: true,
            selected: [],
            dateArr: "",
        }
    },
    methods: {
        //生成维修发货订单
        produce() {
            let This = this;
            //判断勾选的数据是否一致
            if (this.selected.length < 1) {
                this.$Modal.warning({
                    title: "提示信息",
                    content: "请选择需要生成的单据"
                })
                return;
            }
            if (this.selected.length >= 1) {
                //取一个数据作为基准
                let obj = this.selected[0]
                //循环判断
                console.log(obj)
                for (var i = 0; i < this.selected.length; i++) {
                    if (this.selected[i].custName != obj.custName) {
                        this.$Modal.warning({
                            title: "提示信息",
                            content: "客户不一致"
                        })
                        return;
                    }
                    if (this.selected[i].businessType != obj.businessType) {
                        this.$Modal.warning({
                            title: "提示信息",
                            content: "业务类型不一致"
                        })
                        return;
                    }
                }
            }
            /* let temp =true;
             let This = this;*/
            console.log(this.selected)
            for (let i = 0; i < this.selected.length; i++) {
                var obje = {};
                obje.inOrderNo = this.selected[i].inOrderNo
                //obje.goodsId = this.selected[i].goodsId
                this.inOrderNoList.push(obje);
            }
            console.log(this.inOrderNoList)
            console.log(This.selected[0].inOrderNo)
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + "/repairShipOrder/queryAllRepairInOrderEntity",
                contentType: 'application/json',
                data: JSON.stringify(This.inOrderNoList),
                dataType: "json",
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data)
                        if (data.data.length > 0&&data.data!=null) {
                            window.parent.activeEvent({
                                name: '维修发货单-新增',
                                url: contextPath + '/repair/repair-delivery/repair-delivery-add.html',
                                params: {allInfo: data, type: 'addInfo'}
                            });
                        } else {
                            This.$Modal.error({
                                title: "提示信息",
                                content: "已有单据生成维修发货单了！请刷新页面重新选择！"
                            });
                        }
                    }
                },
                error: function (err) {
                    console.log("服务器出错啦");
                },
            })
        },
        //跳转维修收回单
        updateDetail(data) {
            let inOrderNo = data.rows.inOrderNo;
            console.log(data.rows.inOrderNo);
            window.parent.activeEvent({
                name: '维修收回单-查看',
                url: contextPath + '/repair/recovery/recovery-form.html',
                params: {inOrderNo: inOrderNo, type: 'update'}
            });
        },
        //刷新
        refresh() {
            this.clean();
            this.reload = !this.reload;
            this.selected = []
            this.inOrderNoList = []
        },
        //退出
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //改变日期
        changeDate(value) {
            this.body.startTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //搜索
        search() {
            this.reload = !this.reload
        },
        //客户
        closeCustomer() {
            if(this.selectCustomerObj){
                this.body.custName = this.selectCustomerObj.name;
            }
            console.log(this.selectCustomerObj)
        },
        //重置
        clean() {
            this.body = {
                inOrderNo: '',//单据编号
                custName: '',//客户
                startTime: '',
                endTime: '',//来料时间
            };
            this.dataValue = [];
            this.$refs.customerRef.clear();
        }
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})