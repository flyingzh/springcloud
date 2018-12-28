new Vue({
    el: '#subordinate-server',
    data() {
        return {
            openTime: '',
            openNmae: '',
            htHaveChange: false,
            //日期
            dateValue: [],
            //跳转页面参数
            inParams: '',
            isView: false,
            isBoxBorder: false,
            menuList: [],//模块list
            isDisable: true,//控制页面始终禁用的部分
            isServerShow: false,//控制服务器选择弹窗
            imgList: [],
            initModel: [],//保留最初的选择数据
            selectedModel: [],//模块数据绑定
            treeTmp: null,
            parentServerName: '',//页面展示所选服务器
            //新增或保存校验数据
            ServerRegisterVo:{
                id :'',
                companyName: '', //公司全称
                companyNameShort: '',//公司简称
                globalServerNo: '',//服务器编号
                serverIp: '',//服务器IP地址
                serverMac: '',//MAC地址
            },
            licenseFile: {
                companyInfo: {
                    id: '',//主键ID
                    companyNo: '',//公司编号
                    companyName: '', //公司全称
                    companyNameShort: '',//公司简称
                    contact: '', //联系人
                    contactNumber: '',//联系电话
                    corporate: '', //公司法人
                    creditCode: '',//社会信用代码
                    businessLicenseUrl: '',//营业执照URL
                    area: '',//区域
                    province: '',//省份
                    city: '',//城市
                    county: '',//县
                    detailAddress: '',//详细地址
                    concreteAddress: '',//全地址
                    isDel: '',//是否删除（1：未删除；0：已删除）
                },//公司信息
                serverInfo: {},//服务器信息
            },
            //地址
            area: {},
            areaInit: {
                isInit: false,
                province: '',
                city: '',
                county: '',
                detail: '',
                disabled: false
            },
            setting: {
                //注意：如果使用如上简单Json数据，以下data.simpleData.enable必须设置为true。
                data: {
                    simpleData: {
                        enable: true,
                        idKey: "serverNo",
                        pIdKey: "parentServerNo",
                    },
                    key: {
                        name: 'companyNameShort'
                    }
                },
                //callback内定义事件和回调函数，更多事件请参考官方文档。
                callback: {
                    onClick: this.clickEvent,
                }
            },
            modulesObj: {
                id: '',//主键ID
                serverNo: '',//服务器编号
                moduleNo: '',//模块编号
                moduleName: '',//模块名称
                authorizeStatus: '',//授权状态
            },
            // 数据必填验证
            ruleValidate: {
                companyName: [{ required: true }],
                contact: [{ required: true }],
                contactNumber: [{ required: true }],
                'serverInfo.port': [{ required: true }],
                'serverInfo.globalServerNo': [{ required: true }],
                'serverInfo.serverIp': [{ required: true }],
                'serverInfo.licenseStartTime': [{ required: true }],
                'serverInfo.earlyWarnTime': [{ required: true }],
                'serverInfo.parentServerNo': [{ required: true }],
            },
            validateTable: {
                branchCompanyNum: false,//分公司数量
                childCompanyNum: false,//子公司数量
                storeNum: false,//门店数量
                branchOnUserNum: false,//分公司在线用户数
                childOnUserNum: false,//子公司在线用户数
                storeOnNum: false,//门店在线用户数
            },
            addBody: {
                id: '',//主键ID
                companyNo: '',//公司编号
                companyName: '', //公司全称
                companyNameShort: '',//公司简称
                contact: '', //联系人
                contactNumber: '',//联系电话
                corporate: '', //公司法人
                creditCode: '',//社会信用代码
                businessLicenseUrl: '',//营业执照URL
                area: '',//区域
                province: '',//省份
                city: '',//城市
                county: '',//县
                detailAddress: '',//详细地址
                concreteAddress: '',//全地址
                isDel: '',//是否删除（1：未删除；0：已删除）
                //服务器信息
                serverInfo: {
                    id: '',//主键ID
                    companyNo: '', //公司编号
                    serverNo: '',//服务器编号
                    globalServerNo: '',//服务器编号
                    serverIp: '',//服务器IP地址
                    serverMac: '',//MAC地址
                    port:"",//端口号
                    serverType: '',//服务器类型（1、 报税 ；2、非报税；3、经营者）
                    serverLevel: '',//本地服务器标识（1、总平台；2、上级；3、本地；4、下级）
                    licenseStartTime: '',//许可开始时间
                    licenseEndTime: '',//许可结束时间
                    earlyWarnTime: '',//预警时间
                    parentServerNo: '',//上级服务器编号
                    parentServerIp: '',//上级服务器地址
                    serverStatus: '',//服务器状态
                    serverRootOrgCode: '',//本服务器根组织
                    parentServerOrgCode: '',//挂靠组织编号
                    serverLicenseUrl: '',//服务器许可文件
                    serverLicenseTime: '',//生成许可文件时间
                    isDel: '',//是否删除（1：未删除；0：已删除）
                    //授权组织/用户数量
                    serverAuthNum: {
                        id: '',//主键ID
                        serverNo: '',//服务器编号
                        branchCompanyNum: '',//分公司数量
                        childCompanyNum: '',//子公司数量
                        storeNum: '',//门店数量
                        branchOnUserNum: '',//分公司在线用户数
                        childOnUserNum: '',//子公司在线用户数
                        storeOnNum: '',//门店在线用户数
                    },
                    //授权模块List
                    serverAuthModuleList: []
                }
            }
        }
    },
    methods: {
        // 树点击事件
        clickEvent(event, treeId, treeNode) {
            console.log(treeNode);
            this.treeTmp = treeNode
        },
        // 打开服务器弹窗
        selectServer() {
            let This = this;
            //获取到已选择数据
            let serverIp = this.addBody.serverInfo.serverIp;
            let serverNo = this.addBody.serverInfo.serverNo;
            let serverType = this.addBody.serverInfo.serverType;
            $.ajax({
                type: 'post',
                async: true,
                url: contextPath + '/serverInfoController/getServerTree?serverType=' + serverType,
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    if (data.code === "100100") {
                        console.log(data);
                        //存储数据
                        This.data = data.data;

                        //将数据过滤
                        let arr = [];
                        data.data.map((item)=>{
                            if((item.serverIp == serverIp && item.serverNo == serverNo)||(item.parentServerIp == serverIp && item.parentServerNo == serverNo)){
                                return;
                            }else{
                                arr.push(item);
                                return true;
                            }
                        })

                        //加载树
                        $.fn.zTree.init($("#tree"), This.setting,arr);

                        This.isServerShow = true;

                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统异常!"
                        });
                    }

                },
                error: function (e) {
                    console.log(e);
                }
            });

            // var treeObj = $.fn.zTree.getZTreeObj("tree");
            // var nodes = treeObj.getNodesByFilter(this.filterInfo); // 查找节点集合
            // //重新加载树
            //     $.fn.zTree.init($("#tree"),that.setting,nodes);

            this.htTestChange();
        },
        // 选择服务器弹窗——确定
        sureTree() {
            this.addBody.serverInfo.parentServerNo = this.treeTmp.serverNo
            this.addBody.serverInfo.parentServerIp = this.treeTmp.serverIp
            this.parentServerName = this.treeTmp.companyNameShort
            this.isServerShow = false;
            console.log(this.addBody)
        },
        cancelTree() {
            this.isServerShow = false;
        },
        //保存
        save(name) {
            // 地址必填验证
            let isArea = this.$refs.area.submit();
            // 表单必填验证
            let isPass = false;
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isPass = true;
                } else {
                    isPass = false;
                }
            })
            // 模块必填验证
            let isModule = false;
            if (this.selectedModel.length > 0) {
                isModule = true;
                this.isBoxBorder = false;
            } else {
                this.isBoxBorder = true;
            }
            // 授权组织必填验证
            let isOrg = true;
            for (key in this.addBody.serverInfo.serverAuthNum) {
                if (!(this.validateTable[key] === undefined)) {
                    if (!this.addBody.serverInfo.serverAuthNum[key]) {
                        this.validateTable[key] = true;
                        isOrg = false;
                    } else {
                        this.validateTable[key] = false;
                    }
                }
            }
            if (!isPass || !isArea || !isModule || !isOrg) return;
            let This = this;
            //设置地址
            this.setAddress();
            if (This.addBody.id != null && This.addBody.id != "") {
                // 模块数据处理
                this.addBody.serverInfo.serverAuthModuleList.map(el => {
                    if (this.selectedModel.indexOf(el.moduleNo) === -1) {
                        el.authorizeStatus = 2;
                    } else {
                        el.authorizeStatus = 1;
                    }
                })
                //更新
                //清空许可文件url和时间
                this.addBody.serverInfo.serverLicenseUrl = '';
                this.addBody.serverInfo.serverLicenseTime = '';
                $.ajax({
                    type: "post",
                    async: false,
                    url: contextPath + '/nextServerRegisterController/update',
                    data: JSON.stringify(This.addBody),
                    contentType: 'application/json;charset=utf-8',
                    dataType: "json",
                    success(data) {
                        if (data.code === "100100") {
                            This.addBody = data.data;
                            This.$Modal.success({
                                title: "提示",
                                content: "保存成功!"
                            });
                            This.htHaveChange = false;
                        } else {
                            This.$Modal.error({
                                title: "提示",
                                content: "保存失败!"
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
            } else {
                // 模块数据处理
                this.menuList.map(el => {
                    let obj = {}
                    obj.id = '';//主键ID
                    obj.serverNo = '';
                    obj.moduleNo = el.moduleNo;
                    obj.moduleName = el.name;
                    obj.authorizeStatus = 1;
                    this.addBody.serverInfo.serverAuthModuleList.push(obj)
                })
                if (this.selectedModel.length > 0) {
                    this.addBody.serverInfo.serverAuthModuleList.map(el => {
                        if (this.selectedModel.indexOf(el.moduleNo) === -1) {
                            el.authorizeStatus = 2;
                        }
                    })
                }
                //新增
                $.ajax({
                    type: "post",
                    async: false,
                    url: contextPath + '/nextServerRegisterController/save',
                    data: JSON.stringify(This.addBody),
                    contentType: 'application/json;charset=utf-8',
                    dataType: "json",
                    success(data) {
                        if (data.code === "100100") {
                            This.addBody = data.data;
                            This.addBody.id = data.data.id;
                            This.addBody.companyNo = data.data.companyNo;
                            This.addBody.serverInfo.serverNo = data.data.serverInfo.serverNo;
                            This.htHaveChange = false;
                            This.$Modal.success({
                                title: "提示",
                                content: "保存成功!"
                            });
                        } else {
                            This.$Modal.error({
                                title: "提示",
                                content: "保存失败!"
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
            }
        },
        setAddress() {
            if (ht.util.hasValue(this.area, 'object')) {
                Object.assign(this.addBody, this.area);
                this.addBody.detailAddress = this.area.detail;
            }
        },
        //校验号码
        clearPhone(){
            if (this.addBody.contactNumber!== null && this.addBody.contactNumber !== undefined) {
                let val = "";
                val = this.addBody.contactNumber.toString().replace(/[^\d]/g,"");  //清除非数字
                this.$nextTick(()=>{
                    this.addBody.contactNumber = val;
                })
            }
        },
        //端口号
        clearOther(){
            if (this.addBody.serverInfo.port!== null && this.addBody.serverInfo.port !== undefined) {
                let val = "";
                val = this.addBody.serverInfo.port.toString().replace(/[^\d]/g,"");  //清除非数字
                this.$nextTick(()=>{
                    this.addBody.serverInfo.port = val;
                })
            }
        },
        //判断重复
        checkName(type,msg){
            let This = this;
            let data = {
                id :this.addBody.id,
                companyName: this.addBody.companyName, //公司全称
                companyNameShort: this.addBody.companyNameShort,//公司简称
                globalServerNo: this.addBody.serverInfo.globalServerNo,//服务器编号
                serverIp: this.addBody.serverInfo.serverIp,//服务器IP地址
                serverMac: this.addBody.serverInfo.serverMac,//MAC地址
            }
            let dataInfo = {
                id:this.addBody.id
            }
            for(var key in data){
                if(key == type){
                    dataInfo[type] = data[key]
                }
            }

            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/nextServerRegisterController/CheckServerRegisterInfo',
                data: JSON.stringify(dataInfo),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        if(data.data!=null){
                            This.$Modal.success({
                                title: "提示",
                                content: msg+"已存在!"
                            });
                            //清空数据
                            if(type == "companyName"){
                                This.addBody.companyName = "";
                            }else if(type == "companyNameShort"){
                                This.addBody.companyNameShort = "";
                            } else {
                                This.addBody.serverInfo[type] = "";
                            }
                            return;
                        }
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
        //新增和保存校验ajax
        check(data){
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/nextServerRegisterController/CheckServerRegisterInfo',
                data: JSON.stringify(data),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        if(data.data!=null){
                            This.$Modal.success({
                                title: "提示",
                                content: "该字段已存在!"
                            });
                        }
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
        //生成许可文件
        createLicenseFile() {
           
            let This = this;
            if (this.addBody.id == null || this.addBody.id == '') {
                This.$Modal.warning({
                    title: "提示",
                    content: "请先保存下级服务器登记信息!"
                });
                return false;
            } else {
                //校验数据是否有修改
                if (!this.htHaveChange) {
                    //生成许可文件
                    // Object.assign(this.licenseFile.companyInfo, this.addBody);
                    // this.licenseFile.serverInfo = this.addBody.serverInfo;
                    $.ajax({
                        type: "post",
                        async: false,
                        url: contextPath + '/licenseAuth/generateLicByServerNo?serverNo='+This.addBody.serverInfo.serverNo,
                        // data: JSON.stringify(This.addBody.serverInfo.serverNo),
                        // contentType: 'application/json;charset=utf-8',
                        dataType: "json",
                        success(data) {
                            console.log(data.data);
                            if (data.code === "100100") {
                                This.addBody.serverInfo.serverLicenseUrl = data.data;
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
                } else {
                    This.$Modal.error({
                        title: "提示",
                        content: "请先保存已修改的信息!"
                    });
                    This.htHaveChange = false;
                }
            }
        },
        //下载许可文件
        downloadLicenseFile() {
            let url = contextPath + "/licenseAuth/download?licenseUrl=" + this.addBody.serverInfo.serverLicenseUrl +
                "&companyName=" + this.addBody.companyName;
            window.location.href = url;
        },
        //退出
        exit(close) {
            if (close === true) {
                window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
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
        htTestChange() {
            this.htHaveChange = true;
            console.log(33)
        },
        //关闭页签
        closeModal(type) {
            if (type === 'yes') {//提交数据
                this.save('formValidate');
                this.exit(true);
            } else if (type === 'no') {//关闭页面
                this.exit(true);
            }
        },
        uploadSuccess(response, file, fileList) {
            if (response.code === "100100") {
                this.addBody.businessLicenseUrl = response.data.fdUrl;
                this.htHaveChange = true;
                this.$Modal.success({
                    title: '提示信息',
                    content: '图片上传成功！'
                })
            }
        },
        //选取时间
        changeDate(value) {
            console.log(value);
            this.addBody.serverInfo.licenseStartTime = value[0] == "" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.addBody.serverInfo.licenseEndTime = value[1] == "" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
            console.log(this.addBody.serverInfo.licenseStartTime + "-" + this.addBody.serverInfo.licenseEndTime)

            this.htTestChange();
        },
        initServerTree(serverType) {
            let This = this;
            $.ajax({
                type: 'post',
                async: true,
                url: contextPath + '/serverInfoController/getServerTree?serverType=' + serverType,
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    if (data.code === "100100") {
                        //存储数据
                        This.data = data.data;
                        //将data存起来
                        if (data.data != null) {
                            //$.fn.zTree.init($("#tree"), This.setting, data.data);
                            if (This.inParams.id) {
                                data.data.map(el => {
                                    if (This.addBody.serverInfo.parentServerNo === el.serverNo) {
                                        This.parentServerName = el.companyNameShort
                                    }
                                })
                            }
                        }

                    } else {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统异常!"
                        });
                    }

                },
                error: function (e) {
                    console.log(e);
                }
            });
        },
        //获取数据
        getInfo() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/nextServerRegisterController/info',
                data: JSON.stringify({ id: This.inParams.id }),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.addBody = data.data;
                        This.dateValue[0] = This.addBody.serverInfo.licenseStartTime;
                        This.dateValue[1] = This.addBody.serverInfo.licenseEndTime;

                        console.log(This.dateValue);
                        This.addBody.serverInfo.serverAuthModuleList.map(el => {
                            if (el.authorizeStatus === 1) {
                                This.selectedModel.push(el.moduleNo);
                            }
                        })
                        This.initModel = [].concat(This.selectedModel);
                        This.getAddress();

                        //加载树数据
                        This.initServerTree(This.addBody.serverInfo.serverType)
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
        //获取模块List
        getModuleList() {
            let This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/menu/queryFirstLevelMenu',
                dataType: "json",
                success(data) {
                    if (data.code === "100100") {
                        This.menuList = data.data;
                        // This.$nextTick(()=>{
                        //     data.data.map(el=>{
                        //         let obj = {}
                        //         obj.moduleNo = el.moduleNo;
                        //         obj.moduleName = el.name;
                        //         This.addBody.serverInfo.serverAuthModuleList.push(obj)
                        //     })
                        // })

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
        //查看或修改时设置地址
        getAddress() {
            let tempAddress = this.addBody;
            if (tempAddress.province) {
                this.areaInit = {
                    isInit: true,
                    province: tempAddress.province || '',
                    city: tempAddress.city || '',
                    county: tempAddress.county,
                    detail: tempAddress.detailAddress,
                    disabled: this.isView
                }
            }
        },
        //获取本服务器类型并获取服务器树
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
                            if (data.data.serverType == 1) {
                                //设置服务器类型
                                This.addBody.serverInfo.serverType = 1;
                                //This.initServerTree(1);
                            } else if (data.data.serverType == 2) {
                                This.addBody.serverInfo.serverType = 2;
                                //This.initServerTree(2);
                            }
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
    watch: {
        selectedModel: function (newValue, oldValue) {
            if (newValue.length > 0) {
                this.isBoxBorder = false;
            } else {
                this.isBoxBorder = true;
            }
        },

    },
    created() {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.inParams = window.parent.params.params;
    },
    mounted() {
        //获取本服务器类型并获取服务器树
        this.getLocalServerInfo();
        //获取模块List
        this.getModuleList();
        if (this.inParams.id) {
            //查看或修改
            this.getInfo();

        } else {
            //新增
        }
    }
})