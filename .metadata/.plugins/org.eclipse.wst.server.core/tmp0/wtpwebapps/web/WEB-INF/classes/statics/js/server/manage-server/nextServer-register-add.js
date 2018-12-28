let vm = new Vue({
    el: "#nextServer-register-add",
    data() {
        return {
            isHideSearch: true,
            isHideList: true,
            htHaveChange: false,
            isSave:false,
            //禁用时间
            optionsDate: {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            },
            ruleValidate: {
                companyName: [
                    {required: true}
                ],
                contact: [
                    {required: true}
                ],
                contactNumber: [
                    {required: true}
                ],
                'serverInfoEntity.globalServerNo': [
                    {required: true}
                ],
                'serverInfoEntity.licenseStartTime': [
                    {required: true}
                ],
                'serverInfoEntity.serverIp': [
                    {required: true}
                ],
                'serverInfoEntity.port': [
                    {required: true}
                ],
                'serverInfoEntity.earlyWarnTime': [
                    {required: true}
                ],
                'serverInfoEntity.serverMac': [
                    {required: true}
                ]
            },
            openTime: '',
            dataInfo: {
                id: "",//主键ID
                companyNo: "",//公司编号
                companyName: "",//公司全称
                companyNameShort: "",//公司简称
                contact: "",//联系人
                contactNumber: "",//联系电话
                corporate: "",//公司法人
                creditCode: "",//社会信用代码
                businessLicenseUrl: "",//营业执照URL
                area: "",//区域
                province: "",//省份
                city: "",//城市
                county: "",//县
                detailAddress: "",//详细地址
                concreteAddress: "",//全地址
                serverInfoEntity: {
                    companyNo: "",//公司编号
                    globalServerNo: "",//服务器编号
                    port:"",//端口号
                    serverIp: "",//服务器IP地址
                    port:"",
                    serverMac: "",//MAC地址
                    serverType: "",//服务器类型（1、 报税 ；2、非报税；3、经营者）
                    serverLevel: "",//本地服务器标识（1、总平台；2、上级；3、本地；4、下级）
                    licenseStartTime: "",//许可开始时间
                    licenseEndTime: "",//许可结束时间
                    earlyWarnTime: "",//预警时间
                    serverLicenseUrl: '',//服务器许可文件
                    ownOrgEntityList: [],
                },

            },
            //日期
            dateValue: [],
            //选中行
            delIndex: "",
            equityList: [],
            //新增行数据
            oneInfo: {
                id: "",
                serverNo: "",//服务器编号
                serverIp: "",//服务器IP地址
                orgCode: "",//所属组织
                orgName: "",//所属组织名字
                orgId: "",//树ID
                temp: false,//是否被选取
                sourceOrgEntityList: []
            },
            rightInfo: {
                id: "",//主键ID
                orgCode: "",//组织编号
                orgName: "",//组织名字
                rootOrgCode: "",//来源组织根组织
                orgId: "",//
            },
            visible: false,
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            oriTemp: false,
            setting: {
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "id",
                        pIdKey: "pId",
                        rootPId: 0
                    }
                },
                check: {
                    enable: true,
                    chkStyle: "radio",
                    radioType: "all",
                    autoCheckTrigger: true
                },
                view: {
                    selectedMulti: false
                },
                callback: {
                    onCheck: this.zTreeOnCheck,
                }
            },
            //选中的数据
            treeInfo: "",
            //选中下标
            clickIndex: ""
        }
    },
    methods: {
        act(){
            console.log(123);
        },
        //校验号码
        clearPhone() {
            if (this.dataInfo.contactNumber !== null && this.dataInfo.contactNumber !== undefined) {
                let val = "";
                val = this.dataInfo.contactNumber.toString().replace(/[^\d]/g, "");  //清除非数字
                this.$nextTick(() => {
                    this.dataInfo.contactNumber = val;
                })
            }
        },
        //校验电话号码
        checkPhone(value){
            if(!(/^1[34578]\d{9}$/.test(value))){
                this.dataInfo.contactNumber = "";
            }
        },
        //检验数据
        checkTwoDecimal(type) {
            if (this.dataInfo.serverInfoEntity[type] !== null && this.dataInfo.serverInfoEntity[type] !== undefined) {
                let val = "";
                val = this.dataInfo.serverInfoEntity[type].toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符
                this.$nextTick(() => {
                    this.dataInfo.serverInfoEntity[type] = val;
                })

            }
        },
        checkMonth(type) {
            if (this.dataInfo.serverInfoEntity[type] !== null && this.dataInfo.serverInfoEntity[type] !== undefined) {
                let val = "";
                val = this.dataInfo.serverInfoEntity[type].toString().replace(/[^\d]/g, "");  //清除“数字"以外的字符
                this.$nextTick(() => {
                    this.dataInfo.serverInfoEntity[type] = val;
                })

            }
        },
        //校验公司名称
        checkName(type, msg) {
            let This = this;
            let info = {
                id: this.dataInfo.id,
                companyName: this.dataInfo.companyName,
                serverIp: this.dataInfo.serverInfoEntity.serverIp,
                globalServerNo: this.dataInfo.serverInfoEntity.globalServerNo,
                serverMac: this.dataInfo.serverInfoEntity.serverMac
            };

            let dataInfo = {
                id: this.dataInfo.id
            }
            for (let key in info) {
                if (key == type) {
                    dataInfo[type] = info[key]
                }
            }
            //请求数据
            $.ajax({
                type: 'post',
                async: false,
                url: contextPath + '/operServerRegisterController/checkValue',
                data: dataInfo,
                success: function (d) {
                    if (d.code == "100100") {
                        console.log(msg + "不能重复");
                    } else if (d.code == "-1") {
                        This.$Modal.warning({
                            scrollable: true,
                            content: msg + "不能重复"
                        });
                        //清空数据
                        if (type == "companyName") {
                            This.dataInfo.companyName = "";
                        } else {
                            This.dataInfo.serverInfoEntity[type] = "";
                        }
                        return;
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });

        },
        //点击树
        zTreeOnCheck(e, treeId, treeNode) {
            console.log(treeNode)
            this.treeInfo = treeNode;
        },
        //新增行
        addRow() {
            //判断上一条是否为空
            //获取数组长度
            let len = this.dataInfo.serverInfoEntity.ownOrgEntityList.length;
            if (len == 0 || this.dataInfo.serverInfoEntity.ownOrgEntityList[len - 1].orgName != "") {
                let info = JSON.parse(JSON.stringify(this.oneInfo));
                this.dataInfo.serverInfoEntity.ownOrgEntityList.push(info);
                this.htTestChange();
            } else {
                this.$Modal.warning({
                    scrollable: true,
                    content: '请先选择组织!'
                })
            }

        },
        //删除行
        delRow() {
            //判断是否选取
            let keepTemp = true;
            $.each(this.dataInfo.serverInfoEntity.ownOrgEntityList, (i, n) => {
                if (n.temp == true) {
                    keepTemp = false;
                    this.dataInfo.serverInfoEntity.ownOrgEntityList.splice(i, 1);
                    //清空右边数据
                    this.equityList = [];
                    this.htTestChange();
                    return false;
                }
            });

            if (keepTemp) {
                this.$Modal.warning({
                    scrollable: true,
                    content: '请选择需要删除组织'
                })
            }
        },
        //组织
        searchOri() {
            //判断选中组织
            let keepTemp = true;
            let index = "";
            let This = this;
            $.each(this.dataInfo.serverInfoEntity.ownOrgEntityList, (i, n) => {
                if (n.temp == true) {
                    keepTemp = false;

                    //判断是否是空数据
                    if (n.orgId == "" || n.orgId == null) {
                        this.$Modal.warning({
                            scrollable: true,
                            content: '请选择其它组织'
                        })
                        return false;
                    }
                    //获取到需要查询的数据  以及需要插入的下标

                    index = i;
                    $.ajax({
                        type: 'post',
                        async: false,
                        url: contextPath + '/organizationController/getEquityOrganInfo',
                        contentType: "application/json",
                        data: JSON.stringify({
                            id: n.orgId,
                            organType: "2"
                        }),
                        dataType: "json",
                        success: function (d) {
                            if (d.code == "100100") {
                                //获取到所有占股组织
                                let arr = [];
                                d.data.map((item) => {
                                    // orgCode: "",//组织编号
                                    //     orgName:"",//组织名字
                                    //     rootOrgCode: "",//来源组织根组织
                                    //     orgId:"",//
                                    let info = JSON.parse(JSON.stringify(This.rightInfo));
                                    info.orgCode = item.orgCode;
                                    info.orgName = item.orgName;
                                    info.rootOrgCode = item.rootOrganCode;
                                    info.orgId = item.id;
                                    arr.push(info);
                                })
                                This.dataInfo.serverInfoEntity.ownOrgEntityList[index].sourceOrgEntityList = [].concat(arr);

                                //铺上显示数据
                                This.equityList = This.dataInfo.serverInfoEntity.ownOrgEntityList[index].sourceOrgEntityList;
                            }
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    });

                    return false;
                }
            })

            if (keepTemp) {
                this.$Modal.warning({
                    scrollable: true,
                    content: '请选择组织'
                })
            }
        },
        onfocus() {
            return;
        },
        //选取组织
        checkStatus(index) {
            //判断是否重复点击
            if (this.dataInfo.serverInfoEntity.ownOrgEntityList[index].temp == false) {
                //给相对应的tr去除背景颜色
                $(".tdInfo").eq(index).removeClass("tr-back")
                this.equityList = [];
                return;
            } else {
                //取消其他行的选中状态
                this.dataInfo.serverInfoEntity.ownOrgEntityList.map((item) => {
                    item.temp = false;
                })
                this.equityList = [];
                this.dataInfo.serverInfoEntity.ownOrgEntityList[index].temp = true;
                //给相对应的tr添加背景颜色
                $(".tdInfo").eq(index).addClass("tr-back").siblings().removeClass("tr-back")
                console.log(this.dataInfo.serverInfoEntity.ownOrgEntityList[index])
                //显示对应的占股组织
                if (this.dataInfo.serverInfoEntity.ownOrgEntityList[index].sourceOrgEntityList.length > 0) {
                    this.equityList = this.dataInfo.serverInfoEntity.ownOrgEntityList[index].sourceOrgEntityList;
                }
                //this.equityList =  this.dataInfo.serverInfoEntity.ownOrgEntityList[index].sourceOrgEntityList;
            }
        },
        //弹框搜索组织
        secOrganization(val) {
            this.oriTemp = true;
            this.clickIndex = val;
            //加载树
            this.initTree();
        },
        //弹框确定
        enteringBarCode() {
            let This = this;
            //获取到选中的数据
            if (this.treeInfo == "" || this.treeInfo == null) {
                this.$Modal.warning({
                    content: '请选择组织'
                });
                this.treeInfo = "";
                this.clickIndex = "";
                return;
            }

            //获取到选择的组织数据   this.treeInfo

            //判断是否是已经选中的数据
            let temp = true;
            $.each(this.dataInfo.serverInfoEntity.ownOrgEntityList, (index, item) => {
                console.log(item)
                if (item.orgCode == this.treeInfo.orgCode) {
                    this.$Modal.warning({
                        content: '请选择其它组织'
                    });
                    this.treeInfo = "";
                    this.clickIndex = "";
                    temp = false;
                    return false;
                }
            })
            if(temp){
                this.dataInfo.serverInfoEntity.ownOrgEntityList[this.clickIndex].orgName = this.treeInfo.name;
                this.dataInfo.serverInfoEntity.ownOrgEntityList[this.clickIndex].orgCode = this.treeInfo.orgCode;
                this.dataInfo.serverInfoEntity.ownOrgEntityList[this.clickIndex].orgId = this.treeInfo.id;

                //查询占股组织
                $.ajax({
                    type: 'post',
                    async: false,
                    url: contextPath + '/organizationController/getEquityOrganInfo',
                    contentType: "application/json",
                    data: JSON.stringify({
                        id: This.treeInfo.id,
                        organType: "2"
                    }),
                    dataType: "json",
                    success: function (d) {
                        if (d.code == "100100") {
                            //获取到所有占股组织
                            let arr = [];
                            d.data.map((item) => {
                                // orgCode: "",//组织编号
                                //     orgName:"",//组织名字
                                //     rootOrgCode: "",//来源组织根组织
                                //     orgId:"",//
                                let info = JSON.parse(JSON.stringify(This.rightInfo));
                                info.orgCode = item.orgCode;
                                info.orgName = item.orgName;
                                info.rootOrgCode = item.rootOrganCode;
                                info.orgId = item.id;
                                arr.push(info);
                            })

                            This.dataInfo.serverInfoEntity.ownOrgEntityList[This.clickIndex].sourceOrgEntityList = [].concat(arr);
                            //
                            // //铺上显示数据
                            This.equityList = This.dataInfo.serverInfoEntity.ownOrgEntityList[This.clickIndex].sourceOrgEntityList;

                            //将数据清空
                            This.treeInfo = "";
                            This.clickIndex = "";
                        }
                    },
                    error: function (e) {
                        console.log(e);
                    }
                });
            }


        },
        //弹框取消
        cancelTree() {
            //将选中的树数据清空
            this.treeInfo = "";
            this.clickIndex = "";
        },
        //选取时间
        changeDate(value) {
            this.dataInfo.serverInfoEntity.licenseStartTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.dataInfo.serverInfoEntity.licenseEndTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');

            this.htTestChange();
        },
        //保存
        save() {
            if(this.isSave){
                return;
            }
            this.isSave =true;
            // 地址必填验证
            let isArea = this.$refs.area.submit();
            let temp = true;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            });
            if (!temp || !isArea){
                this.isSave =false;
                return;
            }
            //校验所属组织
            let orgTemp = true;
            if (this.dataInfo.serverInfoEntity.ownOrgEntityList.length > 0) {
                this.dataInfo.serverInfoEntity.ownOrgEntityList.map((item) => {
                    if (item.orgName == "" || item.orgName == null) {
                        orgTemp = false;
                    }
                })
            } else {
                orgTemp = false;
            }
            if (!orgTemp) {
                this.$Modal.warning({
                    scrollable: true,
                    content: '请选择所属组织'
                });
                this.isSave =false;
                return;
            }
            if (ht.util.hasValue(this.area, 'object')) {
                Object.assign(this.dataInfo, this.area);
                this.dataInfo.detailAddress = this.area.detail;
            }
            let This = this;
            let url = "/operServerRegisterController/save";
            if (this.dataInfo.id) {
                url = "/operServerRegisterController/update";
            }
            $.ajax({
                type: 'post',
                url: contextPath + url,
                contentType: 'application/json',
                data: JSON.stringify(this.dataInfo),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            okText: "确定",
                            content: "保存成功",
                            onOk: function () {
                                let data = result.data;
                                This.renderingData(data);
                            }
                        });
                        This.htHaveChange = false;
                    } else {
                        vm.$Modal.error({
                            title: "提示",
                            okText: "确定",
                            content: "保存失败"
                        });
                    }
                    This.isSave =false;
                },
                error: function (err) {
                    console.log("服务器出错");
                    This.isSave =false;
                },
            });

            //获取到选中了的数据
            console.log(this.dataInfo.serverInfoEntity.ownOrgEntityList)

        },
        //上传图片
        uploadSuccess(response, file, fileList) {
            if (response.code === "100100") {
                this.dataInfo.businessLicenseUrl = response.data.fdUrl;
                this.$Modal.success({
                    title: '提示信息',
                    content: '图片上传成功！'
                });

                //修改数据
                this.htTestChange();
            }
        },
        renderingData(data) {
            this.dataInfo = data;
            let tempAddress = data;
            let arr = [];
            arr.push(data.serverInfoEntity.licenseStartTime);
            arr.push(data.serverInfoEntity.licenseEndTime);
            this.dateValue = JSON.parse(JSON.stringify(arr));
            //this.dateValue = [" 2018-12-17 00:00:00", "2019-11-21 23:59:59 "];
            if (tempAddress.province) {
                this.areaInit = {
                    isInit: true,
                    province: tempAddress.province || '',
                    city: tempAddress.city || '',
                    county: tempAddress.county,
                    detail: tempAddress.detailAddress
                }
            }

        },
        //生成许可文件
        createLicenseFile() {
            let This = this;
            if(this.dataInfo.id==null||this.dataInfo.id==''){
                This.$Modal.warning({
                    title: "提示",
                    content: "请先保存下级经营者服务器登记信息!"
                });
                return false;
            }else {
                //校验数据是否有修改
                if(!this.htHaveChange){
                    //生成许可文件
                    $.ajax({
                        type: "post",
                        async: false,
                        url: contextPath + '/licenseAuth/generateLicByServerNo?serverNo='+This.dataInfo.serverInfoEntity.serverNo,
                        dataType: "json",
                        success(data) {
                            if (data.code === "100100") {
                                This.dataInfo.serverInfoEntity.serverLicenseUrl=data.data;
                                This.$Modal.success({
                                    title: "提示",
                                    content: "生成许可文件成功!"
                                });
                            } else {
                                This.$Modal.error({
                                    title: "提示",
                                    content: "生成许可文件失败!"
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
                }else {
                    This.$Modal.error({
                        title: "提示",
                        content: "请先保存已修改的信息!"
                    });
                }
            }
        },
        //下载许可文件
        downloadLicenseFile() {
            if(this.dataInfo.id==null||this.dataInfo.id==''){
                this.$Modal.warning({
                    title: "提示",
                    content: "请先保存下级经营者服务器登记信息!"
                });
                return;
            }
            if (this.dataInfo.serverInfoEntity.serverLicenseUrl == undefined || !this.dataInfo.serverInfoEntity.serverLicenseUrl) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先生成许可文件!"
                });
                return;
            }
            let url=contextPath + "/licenseAuth/download?licenseUrl="+this.dataInfo.serverInfoEntity.serverLicenseUrl+
                "&companyName="+this.dataInfo.companyName;
            window.location.href= url;
        },
        //退出
        exit(close) {
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose() {
            if (this.htHaveChange) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });
                return false;
            }
            return true;
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(33)
        },
        //关闭页签
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        //初始化组织树
        initTree() {
            let This = this;
            $.ajax({
                type: 'post',
                async: true,
                url: contextPath + '/organizationController/queryAllOrganInfo',
                success: function (d) {
                    if (d.code == "100100") {
                        d.data.map((item) => {
                            item['pId'] = item.parentId;
                            item['name'] = item.orgName;
                        })
                        zTreeObj = $.fn.zTree.init($("#tree"), This.setting, d.data);
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        }
    },
    mounted() {
        let param = window.parent.params.params;
        let id = param.id;
        this.openTime = window.parent.params.openTime;
        let This = this;
        if (id) {
            $.ajax({
                type: "POST",
                url: contextPath + "/operServerRegisterController/info/" + id,
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        let data = result.data;
                        This.renderingData(data);

                    } else {
                        layer.alert(result.msg, {icon: 0});
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });
        }
    },
})