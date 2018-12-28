var vm = new Vue({
    el: "#app",
    data: {
        htHaveChange:false,
        paramType: '',
        openTime: '',
        isShow: false,
        reload: false,
        isSearchHide: true,
        isTabulationHide: true,
        businessType: "",
        isOpened: false,
        approvalTableData: [],
        selectCustomerObj: null, //所选的客户对象
        showSupplier: false,//供应商
        isStampShow: false,
        //正则表达试校验
        inspect:'',
        inspectType:'',
        //控制保存是否重复
        saveStruts: false,
        //组织名称
        organizanizationName: '',
        //编辑状态
        isDisabled: false,
        generaterDisabled: false,
        //选中行的下标
        selectedIndex: null,
        //物流方式
        deliveryType: [],
        //客户列表
        custList: [],
        //供应商列表
        supplierList: [],
        custId:null,
        supplierId:null,
        //供应商模糊搜索
        loading1: false,
        options1: [],
        //客户模糊搜索
        loading2: false,
        options2: [],
        //表格验证
        //    是否禁选客户的input框
        disabledCustomSelect: true,
        //    是否禁选供应商的input框
        disabledSupplierSelect: true,
        //审批类型
        modalType: '',
        //控制弹窗显示
        modalTrigger: false,
        //是否保价
        keepPrice: [
            {
                value: 1,
                name: "是"
            },
            {
                value: 0,
                name: "否"
            }
        ],
        //物流公司
        selectLogisticsCompany: [],
        //审批进度条
        stepList: [],
        selectBusinessType: [
            {
                value: "S_OUT_STOCK",
                label: "销售送货"
            },
            {
                value: "P_APPLY_DELIVER",
                label: "采购送料"
            },
            {
                value: "P_RETURN_STOCK",
                label: "采购退库"
            },
            {
                value: "W_CMATERIAL_OUT_01",
                label: "受托加工送料"
            },
            {
                value: "W_CMATERIAL_OUT_02",
                label: "受托加工退料"
            },
            {
                value: "O_MATERIALS_OUTPUT",
                label: "旧料外发单"
            },
            {
                value: "O_MATERIALS_RETURN",
                label: "旧料退料单"
            },
            {
                value: "O_MATERIALS_REVERT",
                label: "旧料返料单"
            },
            {
                value: "P_CREDENTIAL_OUT",
                label: "证书商品发出单"
            },
            {
                value: "REPAIR_OUTPUT",
                label: "维修商品发出"
            },
            {
                value: "REPAIR_SHIP",
                label: "维修商品发货"
            },
            {
                value: "REPAIR_RETURN",
                label: "维修商品退货"
            },
        ],
        saveData: {
            id: null,
            documentNo: null,
            documentStatus: 1,
            businessType: '',
            custId: null,
            custCode: null,
            supplierId: null,
            supplierCode: null,
            logisticsMode: null,
            documentTime: null,
            logisticsCost: null,
            sendSomeone: null,
            organizationId: '',
            isInsurancePrice: '',
            merchandiseCost: null,
            receiptName: '',
            phone: '',
            coverageForce: '',
            receivingAddress: '',
            isDel: 1,
            createName: '',
            updateName: '',
            createTime: '',
            updateTime: '',
            examineVerifyName: '',
            examineVerifyTime: '',
            logisticsDispatchingDetailList: [{
                id: null,
                logisticsDocumentNo: null,
                logisticsCompany: null,
                logisticsBillNo: null,
                logisticsCost: "",
                logisticsPrice: "",
                logisticsAmountAmount: "",
                firstPrice: "",
                firstAmountAmount: "",
                secondPrice: "",
                secondAmountAmount: "",
                isDel: 1
            }],
            logisticsDispatchingSourceList: [{
                sourceNo: "",
                sourceType: null,
                documentNo: null
            }],
        },
        ruleValidate: {
            businessType: [
                { required: true }
            ],
            documentTime: [
                { required: true}
            ],
            logisticsMode: [
                { required: true}
            ],
            supplierCode: [
                { required: false}
            ],
            custCode: [
                { required:false}
            ]
        },
        data_config1: {
            url: contextPath + "/js/warehouse/logistics-dispatch/logistics-dispatch-info1.json",
            datatype: "json",
            colNames: ['操作类型', '开始级次', '目的级次', '审批人', '审批意见', '审批时间'],
            colModel: [
                {name: "a1", width: 150, align: "left"},
                {name: "a2", width: 150, align: "left"},
                {name: "a3", width: 150, align: "left"},
                {name: "a4", align: "left", width: 150},
                {name: "a5", align: "left", width: 250},
                {name: "a6", align: "left", width: 180}
            ],
            rowNum: 5,//一页显示多少条
            rowList: [10, 20, 30],//可供用户选择一页显示多少条
            mtype: "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords: true
        },/*, data_config2: {
            url:contextPath+"/js/warehouse/logistics-dispatch/logistics-dispatch-info2.json",
            datatype:"json",
            colNames: ['序号','源单类型','源单编号'],
            colModel:[
                {name: "a1", width: 180, align: "left"},
                {name: "a2", width: 180, align: "left"},
                {name: "a3", width:180,  align: "left"},
            ],
            rowNum : 5,//一页显示多少条
            rowList : [ 10, 20, 30 ],//可供用户选择一页显示多少条
            mtype : "post",//向后台请求数据的ajax的类型。可选post,get
            viewrecords : true
        }*/
    },
    methods: {


        changeSelected(code){
            console.log(code,"uuuuuuu")
        },
        // 此处三个方法是附件组件 只需要直接copy即可
        // 附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit: function (isEdit) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type) {
            eventHub.$emit('queryFile', id, type);
        },

        //新增
        add() {
            window.parent.activeEvent({
                name: '新增物流配送单',
                url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-info.html',
                params: {data: 'Y', type: "add"}
            });
        },
        //退出
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({name: '新增物流配送单', openTime: this.openTime, exit: true});
                return;
            }

            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true,name: '新增物流配送单', openTime: this.openTime});
            }
        },
        list() {
            window.parent.activeEvent({
                name: '物流配送单列表',
                url: contextPath + '/warehouse/logistics-dispatch/logistics-dispatch-list.html'
            });
        },
        //保存
        save() {
            let This = this;
            var type
            if (This.saveStruts) {
                This.$Modal.warning({
                    title: '提示信息',
                    content: "单据已经保存！",
                });
                return;
            }
            if(!This.saveData.custId && This.saveData.custCode){
                This.saveData.custId = This.custId;
            }
            if(!This.saveData.supplierId && This.saveData.supplierCode){
                This.saveData.supplierId = This.supplierId;
            }
            if (This.saveData.id == null) {
                url = contextPath + "/logisticsdispatching/save";
            } else {
                url = contextPath + "/logisticsdispatching/update";
            }
            window.top.home.loading('show');
            this.getCodeAndName();
            $.ajax({
                url: url,
                type: "post",
                async:false,
                data: JSON.stringify(This.saveData),
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    window.top.home.loading('hide');
                    this.htHaveChange = false;
                    if ('100100' === data.code) {
                        //供应商增加
                        This.$refs.customerRef.loadCustomerList('', '');
                        This.$refs.supperList.noInitValue();
                        This.$Modal.success({
                            title: '提示信息',
                            content: data.msg,
                        });
                        This.saveData = data.data;
                        This.saveAccess(This.saveData.documentNo, 'W_LOGISTICS');

                        This.getAccess(This.saveData.documentNo, 'W_LOGISTICS');
                        This.isEdit('Y');


                    }
                    if (data.code === '100101') {
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                    }
                },
                error: function (err) {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            });
        },
        //新增行 删除行
        rowClick(type) {
            if (type === 'add') {
                this.saveData.logisticsDispatchingDetailList.push({});
                this.tabValid = true;
            } else if (type === 'copy') {
                if (this.selectedIndex === null) {
                    this.$Modal.info({
                        title: '提示信息',
                        content: "请选择一条数据！",
                    });
                } else {
                    var copyRawList = Object.assign({}, this.saveData.logisticsDispatchingDetailList[this.selectedIndex]);
                    copyRawList.id = null;
                    this.saveData.logisticsDispatchingDetailList.push(copyRawList)
                    this.$forceUpdate();
                    this.selectedIndex = null;
                    this.tabValid = true;
                }

            }
            this.htTestChange()
        },
        //删除行
        action2() {
            // this.action1()
            if (this.selectedIndex === null) {
                this.$Modal.info({
                    title: '提示信息',
                    content: "请选择一条数据！",
                });
            } else {
                this.saveData.logisticsDispatchingDetailList.splice(this.selectedIndex, 1);
                this.$forceUpdate();
                this.selectedIndex = null;
            }
            this.htTestChange()
        },
        //获取选中的下标
        action1(index) {
            this.selectedIndex = index;
        },
        //刷新
        search() {

        },
        //验证表格内容是否为空
        tableValidate(){
            let This = this;
            let validate = {
                logisticsCompany:{
                    name: '物流公司',
                    type: 'string'
                },
                logisticsBillNo:{
                    name: '物流单号',
                    type: 'string',
                },
                logisticsCost:{
                    name: '物流费用',
                    type: 'number',
                    floor:2
                }
            };
            return htValidateRow(This.saveData.logisticsDispatchingDetailList, validate);
        },
        //提交
        submit(name) {
            // this.$refs[name].validate((valid) => {
            //     if (valid) {
            //         this.$Message.success('Success!');
            //     } else {
            //         this.$Message.error('Fail!');
            //     }
            // })
            // let obj = {
            //     "业务类型": this.saveData.businessType,
            //     // "单据编号": this.saveData.documentNo,
            //     "日期": this.saveData.documentTime,
            //     "物流方式": this.saveData.logisticsMode,
            //     // "收货人": this.saveData.receiptName,
            //     // "供应商":this.saveData.supplierCode,
            //     // "客户":this.saveData.custCode
            // };
            // if ($('form').valid() === false) {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '<p>请填写必填项!</p >'
            //     });
            //     return;
            // } else {
            //     if (this.checkForm(obj, true));
            // }

            let isFormPass = ''
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false
                }
            })
            if (!isFormPass || this.tableValidate()) {
                return false;
            }
            let This = this;
            if (This.saveData.documentStatus != 1) {
                This.$Modal.warning({
                    title: '提示信息',
                    content: '物流配送单已提交!',
                });
                return;
            }
            window.top.home.loading('show');
            This.getCodeAndName();
            This.saveData.documentStatus = 2;
            var ajax2 = $.ajax({
                url: contextPath + '/logisticsdispatching/updateApproval',
                type: 'POST',
                data: JSON.stringify(This.saveData),
                contentType: 'application/json;charset=utf-8',
                dataType: "json",
                success:function () {
                    window.top.home.loading('hide');
                    This.htHaveChange = false;
                }
            })

            ajax2.done(function (data) {
                window.top.home.loading('hide');
                if (data.code === '100100') {
                    This.$refs.customerRef.loadCustomerList('', '');
                    This.$refs.supperList.noInitValue();
                    This.isEdit('N');
                    This.saveData = data.data;
                    if (This.saveData.documentStatus != 1) {
                        This.isDisabled = true;
                        This.generaterDisabled = true;
                        This.disabledSupplierSelect = true;
                        This.disabledCustomSelect = true;
                        This.ruleValidate.supplierCode[0].required = false
                        This.ruleValidate.custCode[0].required = false
                    }
                    $(".is-disabled-add").css("pointer-events", "none").css({"color": "#bbbec4"})
                    $(".is-disabled-submit").css("pointer-events", "none").css({"color": "#bbbec4"})
                    This.$Modal.success({
                        title: '提示信息',
                        content: data.msg,
                    });
                    return
                }else if ('-1' === data.code){
                    This.$Modal.warning({
                        title: '提示信息',
                        content: '服务器出错啦!',
                    });
                    return;
                }
                if (data.code === '100101') {
                    This.saveData.documentStatus = 1;
                    This.$Modal.info({
                        title: '提示信息',
                        content: data.msg,
                    });
                    return
                }
            }).fail(function (error) {
                window.top.home.loading('hide');
                This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
            })


        },

        // 校验表单必填项
        checkForm(obj, flag) {
            for (var key in obj) {
                if (!obj[key]) {
                    if (flag) {
                        this.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: key + "不能为空"
                        });
                    }
                    return false;
                }
            }
            return true;
        },
        htprint(){
            htPrint()
        },
        //获取物流方式
        getLogisticMode(value) {
            this.deliveryType = getCodeList("jxc_jxc_wlfs");
            this.saveData.logisticsMode = value;
        },
        //获取物流公司
        getCompany() {
            this.selectLogisticsCompany = getCodeList("jxc_jxc_wlgs");
            this.saveData.logisticsDispatchingDetailList.logisticsCompany = "sfsy";
        },
        //获取组织id和组织name
        getOrgan() {
            let This = this;
            window.top.home.loading('show');
            $.ajax({
                type: "post",
                url: contextPath + '/entrustOut/getOrgName',
                dataType: "json",
                success: function (data) {
                    console.log(data)
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.saveData.organizanizationId = data.data.id;
                        This.organizanizationName = data.data.name;
                    }else if ('-1' === data.code){
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return;
                    }
                    if (data.code === '100101') {
                        This.saveData.documentStatus = 1;
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                        return
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            })
        },
        //根据组织id获取组织name
        getOrganName(id) {
            window.top.home.loading('show');
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/logisticsdispatching/queryOrgByOrganId',
                dataType: "json",
                data:{orgId:id},
                //contentType: 'application/json',
                success: function (data) {
                    window.top.home.loading('hide');
                    if (data.code === "100100") {
                        This.organizanizationName = data.data.orgName;
                    }
                    if ('-1' === data.code){
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return;
                    }
                    if (data.code === '100101') {
                        This.$Modal.info({
                            title: '提示信息',
                            content: data.msg,
                        });
                        return
                    }
                },
                error: function () {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            })
        },
        //回显数据内容
        getUpdateData(value, type) {
            let This = this;
            var datas
            if (type === 'update') {
                this.isDisabled = false;
                this.generaterDisabled = false;
                datas = JSON.stringify({id: value});
            } else if (type === 'query') {
                $(".is-disabled").css("pointer-events", "none").css({"color": "#bbbec4"})
                this.isDisabled = true;
                this.generaterDisabled = true;
                this.disabledSupplierSelect = true;
                this.disabledCustomSelect = true;
                This.ruleValidate.supplierCode[0].required = false
                This.ruleValidate.custCode[0].required = false
                datas = JSON.stringify({documentNo: value});
                this.getAccess(value, 'W_LOGISTICS');
            }
            window.top.home.loading('show');
            $.ajax({
                url: contextPath + "/logisticsdispatching/queryDocumentNo",
                type: "post",
                data: datas,
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    window.top.home.loading('hide');
                    if ('100100' === data.code) {
                        This.saveData = data.data[0];
                        //供应商数据回显
                        This.$refs.customerRef.loadCustomerList(This.saveData.custCode, This.saveData.custCode);
                        This.$refs.supperList.haveInitValue(This.saveData.supplierCode, This.saveData.supplierCode);
                        This.getOrganName(This.saveData.organizationId);
                        This.isDisabledInput(type)
                        if (type == 'update') {
                            This.getAccess(This.saveData.documentNo, 'W_LOGISTICS');
                            This.isEdit('Y');
                        }
                        if (This.saveData.logisticsDispatchingSourceList.length > 0) {
                            This.generaterDisabled = true;
                            This.disabledSupplierSelect = true;
                            This.disabledCustomSelect = true;
                            This.ruleValidate.supplierCode[0].required = false
                            This.ruleValidate.custCode[0].required = false
                        }
                        if (This.saveData.documentStatus != 1) {
                            This.isDisabled = true;
                            This.generaterDisabled = true;
                            This.disabledSupplierSelect = true;
                            This.disabledCustomSelect = true;
                            This.ruleValidate.supplierCode[0].required = false
                            This.ruleValidate.custCode[0].required = false

                        }
                        //设置审核标识
                        if (This.saveData.documentStatus == 4) {
                            This.isStampShow = true;
                        }
                    }else if ('-1' === data.code){
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '服务器出错啦!',
                        });
                        return;
                    }

                    if (data.code === '100101') {
                        This.$Modal.warning({
                            title: '提示信息',
                            content: '数据显示失败!',
                        });
                    }
                },
                error: function (err) {
                    window.top.home.loading('hide');
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            });
        },
        getOne(){
            let This = this;
            $.ajax({
                url: contextPath + "/logisticsdispatching/queryDocumentNo",
                type: "post",
                data: JSON.stringify(This.saveData),
                dataType: "json",
                contentType: 'application/json',
                success: function (data) {
                    if ('100100' === data.code) {
                        console.log( data.data)
                        This.saveData.examineVerifyName = data.data[0].examineVerifyName;
                        This.saveData.examineVerifyTime = data.data[0].examineVerifyTime;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({content:"服务器出错啦！",title:"提示信息"})
                }
            });
        },

        approval(){
            let This = this;

            if(This.saveData.documentStatus === 1 || !This.saveData.documentNo){
                This.$Modal.info({
                    title: "提示信息",
                    content: "请先提交单据!"
                });
                return false;
            }
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;

        },

        reject(){
            let This = this;
            if(This.saveData.documentStatus === 1 || !This.saveData.documentNo){
                This.$Modal.info({
                    title: "提示信息",
                    content: "请先提交单据!"
                });
                return false;
            }
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;

        },
        approvalOrRejectCallBack(res){
            let This = this;

            if(res.result.code == '100100'){
                This.saveData.documentStatus = res.result.data;

                if(This.saveData.documentStatus == 1){
                    //驳回到原点，暂存
                    if (This.saveData.logisticsDispatchingSourceList.length > 0) {
                        This.generaterDisabled = true;
                        This.isDisabled = false;
                        This.disabledSupplierSelect = true;
                        This.disabledCustomSelect = true;
                        This.ruleValidate.supplierCode[0].required = false
                        This.ruleValidate.custCode[0].required = false
                        This.isOpened = false;
                    } else {
                        This.isStampShow = false;
                        This.isDisabled = false;
                        This.generaterDisabled = false;
                        This.isOpened = false;
                        This.isDisabledInput('');
                    }

                    This.isEdit('Y');
                    This.saveData.examineVerifyName = '',
                    This.saveData.examineVerifyTime = '';
                    $(".is-disabled-submit").css({"pointer-events":"auto "}).css({"color": "#495060"})
                    $(".is-disabled-add").css({"pointer-events":"auto "}).css({"color": "#495060"})
                }else if(This.saveData.documentStatus == 2){
                    //待审核
                    This.isStampShow = false;
                    This.isDisabled = true;
                    This.generaterDisabled = true;
                    This.disabledSupplierSelect = true;
                    This.disabledCustomSelect = true;
                    This.ruleValidate.supplierCode[0].required = false
                    This.ruleValidate.custCode[0].required = false
                    This.isOpened = true;
                }else if(This.saveData.documentStatus == 4){
                    //审核完成
                    This.isStampShow = true;
                    This.saveStruts = true;
                    This.getOne();
                }else if(This.saveData.documentStatus == 5){
                    //审核驳回
                    This.isStampShow = false;
                    This.saveData.examineVerifyName = '',
                    This.saveData.examineVerifyTime = '';
                }
                //This.ajaxUpdateDocStatusById(This.body.id,docStatus);
            }

        },

        autoApproveOrReject(result){
            let This = this;
            $.ajax({
                url:contextPath + '/logisticsdispatching/submitapproval?submitType=1',
                method:'post',
                contentType:'application/json;charset=utf-8',
                data:JSON.stringify({
                    receiptsId:This.saveData.documentNo,
                    approvalResult:(This.modalType == 'reject'? 1 : 0),
                }),
                success:function (res) {
                    console.log("add",res)
                    if(res.code === '100100'){
                            //驳回到原点，暂存
                            This.isStampShow = true;
                            This.saveStruts = true;
                            This.isDisabled = true;
                            This.generaterDisabled = true;
                            This.disabledSupplierSelect = true;
                            This.disabledCustomSelect = true;
                            This.ruleValidate.supplierCode[0].required = false
                            This.ruleValidate.custCode[0].required = false
                            This.getOne();
                    }else {
                        This.$Modal.info({content:res.msg,title:"提示信息"});
                    }
                }
            });
        },
        getCodeAndName() {
            let This = this;
            if (This.saveData.supplierId) {
                for (let item in This.supplierList) {
                    if (This.supplierList[item].id === This.saveData.supplierId) {
                        This.saveData.supplierCode = This.supplierList[item].supplierName;
                        break;
                    }
                }
            }
            if (This.saveData.custId) {
                for (let item in This.custList) {
                    if (This.custList[item].id === This.saveData.custId) {
                        This.saveData.custCode = This.custList[item].name;
                        break;
                    }
                }
            }
        },
        //    判断是否禁用客户和供应商的input框
        isDisabledInput(type) {
            if (type == 'query') {
                return;
            }
            //供应商和客户都开放
            var _true = this.saveData.businessType === "W_CMATERIAL_OUT_01" || this.saveData.businessType === "W_CMATERIAL_OUT_02" ||
                this.saveData.businessType === "REPAIR_OUTPUT";
            if (_true) {
                this.disabledSupplierSelect = false;
                this.disabledCustomSelect = false;
                this.ruleValidate.supplierCode[0].required = true
                this.ruleValidate.custCode[0].required = true
                return;
            }

            //供应商和客户都禁用
            if (this.saveData.businessType === "") {
                this.disabledSupplierSelect = true;
                this.disabledCustomSelect = true;
                this.ruleValidate.supplierCode[0].required = false
                this.ruleValidate.custCode[0].required = false
                return;
            }

            _true = this.saveData.businessType === "S_OUT_STOCK" || this.saveData.businessType === "O_MATERIALS_OUTPUT" ||
            this.saveData.businessType === "O_MATERIALS_REVERT" || this.saveData.businessType === "REPAIR_RETURN" ||
            this.saveData.businessType === "O_MATERIALS_RETURN" || this.saveData.businessType === "REPAIR_SHIP";
            //供应商禁用客户开放
            if (_true) {
                this.disabledSupplierSelect = true;
                this.disabledCustomSelect = false;
                this.ruleValidate.supplierCode[0].required = false
                this.ruleValidate.custCode[0].required = true
                this.saveData.supplierCode = null;
                this.saveData.supplierId=null;
                this.$refs.supperList.clear();
            }else {
                //客户禁用供应商开放
                this.disabledSupplierSelect = false;
                this.disabledCustomSelect = true;
                this.ruleValidate.supplierCode[0].required = true
                this.ruleValidate.custCode[0].required = false
                this.saveData.custCode = null;
                this.saveData.custId = null;
                this.$refs.customerRef.clear();
            }
        },
        //表格内输入小数
        clearNoNumber(item,type,floor){
            return htInputNumber(item,type,floor)
        },
        //关闭供应商
        closeSupplier(id, code, name) {
            this.saveData.supplierId = id;
            this.saveData.supplierCode = name;
            this.showSupplier = false;
            if(this.$refs.formValidate) {
                this.$refs.formValidate.validateField('supplierCode')
            }
        },
        closeCustomer() {
            if(this.selectCustomerObj){
                this.saveData.custId = this.selectCustomerObj.id;
                this.saveData.custCode = this.selectCustomerObj.name;
                if(this.$refs.formValidate){
                    this.$refs.formValidate.validateField('custCode')
                }
            }
            this.showCustomer = false;

        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        handlerClose(){
            if(this.paramsType != 'query'){
                if((!this.saveData.documentStatus || this.saveData.documentStatus == 1) && (this.htHaveChange || accessVm.htHaveChange)){
                    this.$nextTick(()=>{
                        this.$refs.closeModalRef.showCloseModal();
                    });

                    return false;
                }
            }

            return true;
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        }
    },

    mounted() {
        this.getCompany();
        this.getLogisticMode('');
        // $("form").validate()
        let params = window.parent.params.params;
        this.paramsType = params.type;
        this.openTime = window.parent.params.openTime;
        query:{
            if (params.type === 'generater') {
                this.isOpened = true;
                this.isEdit('Y');
                this.generaterDisabled = true;
                this.$nextTick(()=>{
                    //this.saveData.documentTime = params.data[0].docTime;
                    this.saveData.documentTime = new Date();

                    //this.saveData.documentNo = params.data[0].docNo;
                    this.getLogisticMode(params.data[0].logisticsMode);
                    this.saveData.custId = params.data[0].custId;
                    this.saveData.custCode = params.data[0].custName;
                    this.saveData.supplierId = params.data[0].supplierId;
                    this.saveData.supplierCode = params.data[0].supplierName;
                    this.$refs.customerRef.loadCustomerList(this.saveData.custCode, this.saveData.custCode);
                    this.$refs.supperList.haveInitValue(this.saveData.supplierCode, this.saveData.supplierCode);
                    this.saveData.organizationId = params.data[0].organizationId;
                    if(params.data[0].docCode == 'W_EMATERIAL_OUT'){
                        this.saveData.businessType = params.data[0].businessType;
                    }else {
                        this.saveData.businessType = params.data[0].docCode;
                    }
                    this.getOrganName(this.saveData.organizationId);
                })
                this.$forceUpdate()
                if (this.saveData.businessType == 'W_EMATERIAL_OUT') {
                    this.saveData.businessType = params.data[0].businessType;
                }
                for (var i = 0; i < params.data.length; i++) {
                    this.saveData.logisticsDispatchingSourceList[i] = {
                        sourceNo: "",
                        sourceType: null,
                        documentNo: null,
                    }
                    this.saveData.logisticsDispatchingSourceList[i].sourceType = params.data[i].docCode;
                    this.saveData.logisticsDispatchingSourceList[i].sourceNo = params.data[i].docNo;
                }
            } else if (params.type === 'update' || params.type === 'query') {
                this.getUpdateData(params.data, params.type);
            } else {
                this.$refs.customerRef.loadCustomerList(this.saveData.custCode, this.saveData.custCode);
                this.isEdit('Y')
                this.saveData.logisticsDispatchingSourceList = [];
                this.getOrgan();
                this.saveData.documentTime = new Date();
            }
        }
        window.handlerClose = this.handlerClose;
    }
})