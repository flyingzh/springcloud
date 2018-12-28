new Vue({
    el: '#subordinateServerList',
    data() {
        let This = this;
        return {
            openName:'',
            isShow: false,
            isEdit: false,
            reload: false,
            openTime: "",
            isHideSearch: true,
            isHideList: true,
            isHide: true,
            selected: [],
            //区域
            areaOptions:[],
            body: {
                companyName:'',//公司名称
                companyNameShort:'',//公司简称
                contact:'',//联系人
                area:'',//区域
                serverType:'',//服务器类型（1、 报税 ；2、非报税；3、经营者）
                serverStatus:''//服务器状态
            },
            data_config: {
                url: contextPath + "/nextServerRegisterController/listPage",
                colNames: ['id','服务器状态', '剩余天数', '许可期限','服务器IP地址', 'MAC地址', '服务器类型', '所属上级服务器','公司名称', '简称', '联系人', '联系电话' ,'所属区域','地址'],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {name: 'serverStatus', index: 'serverStatus', width: 80, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "正常" : value === 2 ?
                                "异常" : "已过期";
                        }
                    },
                    {name: 'remain', index: 'remain', width: 80, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let rangDtae = This.DateDiff(new Date().format("yyyy-MM-dd"),new Date(rows.licenseEndTime).format("yyyy-MM-dd"));
                            return rangDtae;
                        },
                    },
                    {
                        name: 'dateTime', index: 'dateTime', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(rows.licenseStartTime).format("yyyy/MM/dd")+"   -   "+
                                new Date(rows.licenseEndTime).format("yyyy/MM/dd");
                        },
                    },
                    {name: 'serverIp', index: 'serverIp', align: "left", width: 200,},
                    {name: 'serverMac', index: 'serverMac', align: "left", width: 200,},
                    {name: 'serverType', index: 'serverType', align: "left", width: 80,
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "报税" : value === 2 ?
                                "非报税" : "经营者";
                        }},
                    {name: 'parentServerName', index: 'parentServerName', align: "left", width: 200,},
                    {name: 'companyName', index: 'companyName', align: "left", width: 200,},
                    {name: 'companyNameShort', index: 'companyNameShort', align: "left", width: 200,},
                    {name: 'contact', index: 'contact', align: "left", width: 80,},
                    {name: 'contactNumber', index: 'contactNumber', align: "left", width: 200,},
                    {name: 'area', index: 'area', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            let address = '';
                            console.log("第二次")
                            if(This.areaOptions!=null){
                                This.areaOptions.forEach(function (item) {
                                    if(value == item.pcode){
                                        address=item.pname;
                                    }
                                })
                            }
                            return address;
                        }
                    },
                    {name: 'concreteAddress', index: 'concreteAddress', align: "left", width: 200,},
                ],
                shrinkToFit:false
            },
        }
    },
    methods: {
        //计算两个时间的天数差(Date1和sDate2是2002-12-18格式)
        DateDiff(sDate1,  sDate2){
            var  aDate,  oDate1,  oDate2,  iDays;
            aDate  =  sDate1.split("-");
            //转换为12-18-2002格式
            oDate1  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
            aDate  =  sDate2.split("-");
            oDate2  =  new  Date(aDate[1]  +  '-'  +  aDate[2]  +  '-'  +  aDate[0]);
            //把相差的毫秒数转换为天数
            iDays  =  parseInt(( oDate2 -  oDate1)  /  1000  /  60  /  60  /24);
            return  iDays
        },
        // 判断有且仅选中一行
        checkRowNum() {
            if (this.selected.length !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return false;
            } else {
                return true;
            }
        },
        search() {
            this.reload = !this.reload;
        },
        clear() {
            this.$refs.areaOperation.reset();
            this.$refs.serverTypeOperation.reset();
            this.$refs.serverStatusOperation.reset();
            this.$nextTick(function(){
                this.body.area = "";
                this.body.serverType = "";
                this.body.serverStatus = "";
            });
            this.body = {
                companyName:'',//公司名称
                companyNameShort:'',//公司简称
                contact:'',//联系人
                area:'',//区域
                serverType:'',//服务器类型（1、 报税 ；2、非报税；3、经营者）
                serverStatus:''//服务器状态
            };
        },
        refresh() {
            this.reload = !this.reload;
            this.selected = [];
        },
        //删除
        deleteData() {
            console.log(this.selected);
            let This = this;
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请至少选择一条记录进行删除"
                });
                return;
            }
            if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "只能选择一条记录进行删除"
                });
                return;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>是否删除信息？</p>',
                onOk: () => {
                    $.ajax({
                        type: "POST",
                        url: contextPath + '/nextServerRegisterController/delete?id='+This.selected[0].id,
                        dataType: "json",
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
                }
            });
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
            let id = this.selected[0].id;
            if (id !=null && id != undefined) {
                window.parent.activeEvent({
                    name: '下级服务器登记-修改',
                    url: contextPath + '/server/total-Server/subordinate-server-add.html',
                    params: {id: id, type: 'update'}
                });
            }
        },
        // 新增
        add(){
            window.parent.activeEvent({
                name: '下级服务器登记-新增',
                url: contextPath + '/server/total-Server/subordinate-server-add.html',
                params: {type: 'add'}
            });
        },
        // 退出
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        //获取所有区域
        getArea(){
            let That = this;
            $.ajax({
                type: "POST",
                async:false,
                url:contextPath + '/baseaddress/queryAddress',
                contentType: 'application/json',
                dataType: "json",
                success: function(data) {
                    if(data.code === '100100'){
                        //获得区域信息
                        data.data.map((item)=>{
                            let obj = {};
                            obj['pname'] = item.pname;
                            obj['pcode'] = item.pcode;
                            let temp = true;
                            $.each(That.areaOptions,(i,n)=>{
                                if(n.pcode == obj.pcode){
                                    temp = false;
                                    return false;
                                }
                            })
                            if(temp){
                                //将数据赋值
                                That.areaOptions.push(obj);
                            }

                        })
                    }

                },
                error: function(err){

                },
            });
        },
        //获取本服务器类型
        getLocalServerInfo() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/serverInfoController/getLocalServerInfo',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        console.log(data.data);
                        if (data.data != null) {
                            //设置服务器类型
                            This.body.serverType = data.data.serverType;
                        }
                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统异常!"
                        });
                    }
                },
                error() {
                    This.$Modal.error({
                        title: "提示",
                        content: '网络错误，请联系技术人员',
                    });
                }
            })
        },
    },
    created() {
        this.getArea();
        //获取本服务器类型
        this.getLocalServerInfo();
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
    }
})