let vm = new Vue({
    el: "#nextServer-register-list",
    data() {
        let This = this;
        return {
            isHideSearch: true,
            isHideList: true,
            openTime: '',
            selected: [],
            areaOptions: [],
            body: {
                companyName: "",//公司全称
                companyNameShort: "",//公司简称
                contact: "",//联系人
                contactNumber: "",//联系电话
                area: "",//区域
                serverType: "",//服务器类型
                serverStatus: ""//服务器状态
            },
            data_user_list: {
                //列表页数据
                url: contextPath + '/operServerRegisterController/list',
                colNames:
                    ['服务器编号', '服务器状态', '剩余天数', '许可期限', '服务器IP地址', 'MAC地址', '公司名称', '简称', '联系人', '联系电话', '所属区域', '地址'],
                colModel:
                    [
                        {
                            name: 'globalServerNo', index: 'globalServerNo', width: 100, align: "left",
                            formatter: function (value, grid, rows, state) {
                                $(document).off('click', ".detail" + grid.rowId).on('click', ".detail" + grid.rowId, function () {
                                    This.detailClick({value, grid, rows, state})
                                });
                                let myCode = `<a class="detail${grid.rowId}">${value}</a>`;
                                return myCode;
                            }
                        },
                        {
                            name: 'serverStatus', index: 'serverStatus', width: 80, align: "left",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    return "正常";
                                } else if (value == 2) {
                                    return "异常";
                                } else if (value == 3) {
                                    return "过期";
                                } else {
                                    return ""
                                }
                            }
                        },
                        {
                            name: 'remainDate', index: 'remainDate', width: 80, align: "right",
                            formatter: function (value, grid, rows, state) {
                                let rangDtae = This.DateDiff(new Date().format("yyyy-MM-dd"), new Date(rows.licenseEndTime).format("yyyy-MM-dd"));
                                return rangDtae;
                            }
                        },
                        {
                            name: 'dateTime', index: 'dateTime', width: 200, align: "left",
                            formatter: function (value, grid, rows, state) {
                                return new Date(rows.licenseStartTime).format("yyyy/MM/dd") + "   -   " + new Date(rows.licenseEndTime).format("yyyy/MM/dd");
                            },
                        },
                        {name: 'serverIp', index: 'serverIp', width: 150, align: "left"},
                        {name: "serverMac", index: "serverMac", width: 100, align: "left"},
                        {name: "companyName", index: "companyName", width: 120, align: "left"},
                        {name: "companyNameShort", index: "companyNameShort", width: 100, align: "left"},
                        {name: "contact", index: "contact", width: 100, align: "left"},
                        {name: "contactNumber", index: "contactNumber", width: 120, align: "left"},
                        {
                            name: "area", index: "area", width: 80, align: "left",
                            formatter: function (value, grid, rows, state) {
                                let address = '';
                                if (This.areaOptions.length > 0) {
                                    $.each(This.areaOptions, (i, n) => {
                                        if (value == n.pcode) {
                                            address = n.pname;
                                            return false;
                                        }
                                    })
                                }
                                return address;
                            }
                        },
                        {name: "concreteAddress", index: "concreteAddress", width: 200, align: "left"}

                    ],
                shrinkToFit:false

            },
            reload: false
        }
    },
    methods: {
        detailClick(data) {
            var id = data.rows.id;
            window.parent.activeEvent({
                name: '下级经营者服务器登记 - 查看',
                url: contextPath + '/server/manage-server/nextServer-register-add.html',
                params: {id: id, type: 'view'}
            });
        },
        //计算两个时间的天数差(Date1和sDate2是2002-12-18格式)
        DateDiff(sDate1, sDate2) {
            var aDate, oDate1, oDate2, iDays;
            aDate = sDate1.split("-");
            //转换为12-18-2002格式
            oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
            aDate = sDate2.split("-");
            oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
            //把相差的毫秒数转换为天数
            console.log(oDate1, oDate2)
            iDays = parseInt((oDate2 - oDate1) / 1000 / 60 / 60 / 24);
            return iDays
        },
        search() {
            this.reload = !this.reload;
        },
        refresh() {
            this.reload = !this.reload;
        },
        clean() {
            this.$refs.mType.reset();
            this.$refs.area.reset();
            this.$nextTick(function () {
                this.body.serverStatus = "";
                this.body.area = "";
            });
            this.body = {
                companyName: "",//公司全称
                companyNameShort: "",//公司简称
                contact: "",//联系人
                contactNumber: "",//联系电话
                area: "",//区域
                serverType: "",//服务器类型
                serverStatus: "",//服务器状态
            }
        },
        view() {
            if (this.selected.length !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择至少一条记录!"
                });
                return;
            }
            window.parent.activeEvent({
                name: '下级经营者服务器登记 - 查看',
                url: contextPath + '/server/manage-server/nextServer-register-add.html',
                params: {id: this.selected[0], type: 'add'}
            });
        },
        add() {
            window.parent.activeEvent({
                name: '下级经营者服务器登记 - 新增',
                url: contextPath + '/server/manage-server/nextServer-register-add.html',
                params: {id: null, type: 'add'}
            });
        },
        del() {
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择至少一条记录!"
                });
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/operServerRegisterController/delete",
                contentType: 'application/json',
                data: JSON.stringify(this.selected),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "删除成功!",
                            okText: "确定",
                            onOk: function () {
                                vm.reload = !vm.reload;
                            }
                        });
                    } else {
                        vm.$Modal.error({
                            title: "提示",
                            content: "删除失败!",
                            okText: "确定"
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        //获取所有区域
        getArea() {
            let That = this;
            $.ajax({
                type: "POST",
                url: contextPath + '/baseaddress/queryAddress',
                contentType: 'application/json',
                async:false,
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        //获得区域信息
                        data.data.map((item) => {
                            let obj = {};
                            obj['pname'] = item.pname;
                            obj['pcode'] = item.pcode;
                            let temp = true;
                            $.each(That.areaOptions, (i, n) => {
                                if (n.pcode == obj.pcode) {
                                    temp = false;
                                    return false;
                                }
                            })
                            if (temp) {
                                //将数据赋值
                                That.areaOptions.push(obj);
                            }

                        })

                    }

                },
                error: function (err) {

                },
            });
        }
    },
    created() {
        this.getArea();
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
    }
});


