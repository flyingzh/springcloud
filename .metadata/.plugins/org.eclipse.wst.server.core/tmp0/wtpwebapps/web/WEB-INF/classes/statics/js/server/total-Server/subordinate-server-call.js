let vm = new Vue({
    el: "#list",
    data() {
        return {
            body: {
                createTime:"",
                serverStatus: "",
                sourceServerIP:"",
                orgName:"",
                relyServerIP:"",//挂靠服务器
                relyOrganName:"",//挂靠组织
                relyServerNo:"",//code
                starTime:"",
                endTime:"",

            },
            tempDate: [],
            relyServerIP:"",
            relyOrganCode:"",
            relyServerNo:"",
            relyServerNo1:"",
            //当前行ID
            getIndex:"",
            //来源服务器编号
            sourceServerNo:"",
            openTime:"",
            oriTemp: false,
            data_user_list: {
                //列表页数据
                url: contextPath + '/organizationRelyController/list',
                colNames:
                    ['ID','申请日期', '来源服务器','来源服务器编号', '来源服务器类型', '来源组织名称', '组织类型', '挂靠服务器Id', '挂靠组织Id','挂靠组织code', '挂靠服务器', '挂靠组织'],
                colModel:
                    [
                        {name: 'id', index: 'id', width: 200, align: "center",hidden:true},
                        {
                            name: 'createTime', index: 'createTime', width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                return new Date(value).format("yyyy-MM-dd");
                            }
                        },
                        {name: 'sourceServerIP', index: 'sourceServerIP', width: 200, align: "center"},
                        {name: 'sourceServerNo', index: 'sourceServerNo', width: 200, align: "center",hidden:true},
                        {name: "sourceServerType", index: "sourceServerType", width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    return "报税";
                                } else if (value == 2) {
                                    return "非报税";
                                } else if (value == 3) {
                                    return "经营者";
                                } else {
                                    return "";
                                }
                            }
                        },
                        {name: "orgName", index: "orgName", width: 200, align: "center"},
                        {
                            name: "organType", index: "organType", width: 200, align: "center",
                            formatter: function (value, grid, rows, state) {
                                if (value == 1) {
                                    return "总平台";
                                } else if (value == 2) {
                                    return "总公司";
                                } else if (value == 3) {
                                    return "分公司";
                                } else if (value == 4) {
                                    return "子公司";
                                } else if (value == 5) {
                                    return "门店";
                                } else {
                                    return "";
                                }
                            }
                        },
                        {name: "relyServerNo", index: "relyServerNo", width: 200, align: "center", hidden: true},
                        {name: "relyOrgan", index: "relyOrgan", width: 200, align: "center", hidden: true},
                        {name: "relyOrganCode", index: "relyOrganCode", width: 200, align: "center", hidden: true},
                        {
                            name: "relyServerIP", index: "relyServerIP", width: 200, align: "center"
                        },
                        { name: "relyOrganName", index: "relyOrganName", width: 200, align: "center"}

                    ],
                multiselect: false,
                onSelectRow(val) {
                    //请求数据  获取到当前行
                    var tabObj = $("#" + vm.tabId).jqGrid('getRowData', val)
                    //根据ID发起请求
                    let id = tabObj.relyServerNo;
                    vm.relyServerNo1 = tabObj.relyServerNo;
                    vm.getIndex = tabObj.id;
                    vm.sourceServerNo = tabObj.sourceServerNo
                    vm.relyOrganCode = tabObj.relyOrganCode
                    vm.info(tabObj)
                },
            },
            reload: false,
            selected: [],
            tabId: 'myTab',
            //弹框数据
            orgArr:[]
        }
    },
    methods: {
        info(val) {
            let This = this;
            //获取可挂靠组织信息
            $.ajax({
                type: 'POST',
                cache: false,
                data: {
                    "serverNo": val.relyServerNo
                },
                url: contextPath + '/organizationRelyController/queryById',
                success(data) {
                    if (data.code == "organizationEntityList") {
                        // id orgcode orgname
                       if(data.data != null){
                           let arr = [];
                           data.data.map((item) => {
                               let obj = {};
                               obj['id'] = item.id;
                               obj['orgCode'] = item.orgCode;
                               obj['orgName'] = item.orgName;
                               arr.push(obj);
                           })
                           This.orgArr = arr;
                           This.relyServerIP = val.relyServerIP;
                           This.relyOrgCode = vm.relyOrgCode
                           This.oriTemp = true;
                       }else{
                           vm.$Modal.error({
                               title:"提示信息",
                               content:"组织信息错误，请联系管理员！"
                           })
                       }
                    }
                },
                error() {
                    vm.$Modal.warning({
                        title:"提示信息",
                        content:"服务器异常！"
                    })

                }
            })
        },
        enteringBarCode() {
            //orgArr
            //判断是否选择数据
            console.log(this.orgArr)
            if(this.orgArr == "" || this.orgArr == null){
                this.$Modal.warning({
                    title:'提示信息',
                    content:'请选择挂靠组织'
                })
                return;
            };
            if(!this.relyOrganCode){
                this.$Modal.warning({
                    title:'提示信息',
                    content:'请选择挂靠组织'
                })
                return;
            };
            var orgObject;
            $.each(this.orgArr,(i,n)=>{
                if(n.orgCode == this.relyOrganCode){
                    orgObject = n
                }
            });

            $.ajax({
                type: 'POST',
                dataType:'json',
                data: {
                    "id": vm.getIndex,
                    "sourceServerNo":vm.sourceServerNo,
                    "relyServerNo":vm.relyServerNo1,
                    "relyOrgan":orgObject.id,
                    "relyOrganCode":orgObject.orgCode
                },
                url: contextPath + '/organizationRelyController/update',
                success(data) {
                    //修改表格某一行 列数据
                    if(data.code == 100100) {
                        vm.relyOrganCode
                        $("#myTab").jqGrid('setCell',vm.getIndex,"relyOrganName",orgObject.orgName);//setCell 设置单元格
                        $("#myTab").jqGrid('setCell',vm.getIndex,"relyOrganCode",orgObject.orgCode);//setCell 设置单元格
                        vm.$Modal.success({
                            content: "挂靠成功！",
            /*                okText: "确定",
                            onOk() {
                                mrpauto.refresh()
                            }*/
                        })
                    }else {
                        vm.$Modal.error({
                            content:"挂靠失败！"
                        })
                    }
                },
                error() {
                    vm.$Modal.error({
                        content:"服务器异常！"
                    })
                }
            });
        },
        changeDate(value) {
            this.body.starTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        //搜索
        search() {
            this.reload = !this.reload;
        },
        //清空
        clean() {
                    this.body.createTime=""
                    this.body.sourceServerIP=""
                    this.body.orgName=""
                    this.body.relyServerIP=""//挂靠服务器
                    this.body.relyOrganName=""
                    this.body.endTime=""
                    this.body.starTime=""
                    this.tempDate = [];
        },
        refresh(){
            this.body.createTime=""
            this.body.sourceServerIP=""
            this.body.orgName=""
            this.body.relyServerIP=""//挂靠服务器
            this.body.relyOrganName=""
            this.body.endTime=""
            this.body.starTime=""
            this.tempDate = [];
            this.reload = !this.reload;
        },
        exit() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
    },
    watch: {},
    mounted(){
        this.openTime = window.parent.params.openTime}
})