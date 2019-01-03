var retrieveReport = new Vue({
    el: '#retrieveReport',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isHide: true,
            selected: [],
            isFromList: false,
            showOrgan: false,
            needReload: false,
            categoryType: [],
            commodityCategoty: [],
            supplierList: [],
            wareHouseList: [],
            locationList: [],
            selectedRowIndex: 0,
            isGenerate: false,
            isView: false,
            isAdd: false,
            employees: {},
            // typeValue: '',
            readDate:false,
            P_CERTIBACK_APPREVAL: 'P_CERTIBACK_APPREVAL',
            //按钮
            isSave: false,
            isSub: false,
            isApprovel: false,
            isReback: false,
            //上层表单校验
            CertiValidate:{
                businessType:[{required: true}],//业务类型
                receiptDate:[{required: true}],//收料日期
                goodsTypePath:[{required: true}],//商品类型
                certificateType:[{required: true}],//证书类型
            },
            //审批相关
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            param: {},
            productDetailList: [],
            productTypeList: [],
            //页面数据绑定
            saveCertiBackVo: {
                id: '',
                businessType: '',
                orderStatus: '',
                orderNo: '',
                receiptDate: '',
                goodsTypeName: '',
                goodsTypePath: '',
                organizationId: '',
                organizationName: '',
                salesmanId: '',
                salesman: '',
                certificateType: '',
                supplierId: '',
                supplier: '',
                remark: '',
                createName: '',
                createTime: '',
                updateName: '',
                updateTime: '',
                auditor: '',
                auditTime: '',
                dataSource: '',
                certificateDetailList: []
            },
            //控制供应商弹窗显示隐藏
            showSupplierModal:false,
        }
    },

    methods: {

        closeSupplier(id,scode,fname){
            console.log(id,scode,fname);
            this.saveCertiBackVo.supplierId = id;
            this.saveCertiBackVo.supplier = fname;
        },
        //审核或驳回组件返回数据回调函数
        approvalOrRejectCallBack(res) {
            if (res.result.code == '100100') {
                let data = res.result.data;
                retrieveReport.saveCertiBackVo.createName = data.createName;
                retrieveReport.saveCertiBackVo.createTime = data.createTime;
                retrieveReport.saveCertiBackVo.updateName = data.updateName;
                retrieveReport.saveCertiBackVo.updateTime = data.updateTime;
                retrieveReport.saveCertiBackVo.auditor = data.auditor;
                retrieveReport.saveCertiBackVo.auditTime = data.auditTime;
                retrieveReport.saveCertiBackVo.dataSource = data.dataSource;
                retrieveReport.saveCertiBackVo.orderStatus = data.orderStatus;
                if(retrieveReport.saveCertiBackVo.orderStatus == 1 ){
                    if(retrieveReport.saveCertiBackVo.dataSource == 2){
                        retrieveReport.isView = false;
                        retrieveReport.isGenerate = true;
                        retrieveReport.isAdd = false;
                        retrieveReport.isSave = false;
                        retrieveReport.isSub = false;
                        retrieveReport.isApprovel = true;
                        retrieveReport.isReback = true;
                    }else{
                        retrieveReport.isView = false;
                        retrieveReport.isGenerate = false;
                        retrieveReport.isAdd = true;
                        retrieveReport.isSave = false;
                        retrieveReport.isSub = false;
                        retrieveReport.isApprovel = true;
                        retrieveReport.isReback = true;
                    }
                    retrieveReport.isEdit("Y");
                }else if(retrieveReport.saveCertiBackVo.orderStatus == 4 ){
                    retrieveReport.isApprovel = true;
                    retrieveReport.isReback = true;
                    retrieveReport.isView = true;
                    retrieveReport.isGenerate = false;
                    retrieveReport.isAdd = false;
                    retrieveReport.isSave = true;
                    retrieveReport.isSub = true;
                }else{
                    retrieveReport.isApprovel = false;
                    retrieveReport.isReback = false;
                    retrieveReport.isView = true;
                    retrieveReport.isGenerate = false;
                    retrieveReport.isAdd = false;
                    retrieveReport.isSave = true;
                    retrieveReport.isSub = true;
                }
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
        //审核
        approval() {
            let _this = this;
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        //驳回
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        changeCategory(e) {
            this.saveCertiBackVo.goodsTypePath = e[e.length - 1];
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            if(value == this.typeValue){
                return false;
            }
            //清空商品分录行
            this.productDetailList = [];
            let tempType = selectedData[selectedData.length - 1];
            if(tempType == undefined || tempType == ''){
                this.saveCertiBackVo.goodsTypeName = '';
                this.saveCertiBackVo.goodsTypePath = '';
                return false;
            }
            this.saveCertiBackVo.goodsTypeName = tempType.label;
            this.saveCertiBackVo.goodsTypePath = tempType.value;
        },

        typeInit(arr,res,val){
            for(let i=0;i<arr.length;i++){
                if(arr[i].value == val){
                    res.push(arr[i].value);
                    return true;
                }
                if(arr[i].children && arr[i].children.length >0){
                    if(this.typeInit(arr[i].children,res,val)){
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        },
        isHintShow(status) {
            if (status && this.typeValue && this.isHint && this.productDetailList && this.productDetailList.length > 0) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '温馨提示：改变商品类型将删除所有商品信息!',
                    onOk: () => {
                        this.isHint = false;
                        console.log('温馨提示：改变商品类型将删除所有商品信息！');
                    }
                })
            }
        },

        getProductType() {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100') {
                        This.productTypeList = This.initGoodCategory(data.data.cateLists)
                    }else {
                        This.$Modal.warning({
                            title:'提示信息',
                            content:data.msg,
                        })
                    }
                },
                error: function () {
                    This.$Modal.warning({
                        title:'提示信息',
                        content:"网络异常,请联系技术人员！",
                    })
                }
            })
        },

        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children,
                    code: code
                } = item;
                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children,
                    code
                })
            });
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            });
            return result
        },

        changeEmp(e) {
            if(this.isView == true){
                return false;
            }
            this.saveCertiBackVo.salesmanId = e.value;
            this.saveCertiBackVo.salesman = e.label.substr(e.label.lastIndexOf("-") + 1, e.label.length);
        },
        //获取业务员
        getSaleMan() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    That.employees = r.data.employees;
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //获取仓库列表
        // getWareHouseList(){
        //     let This = this
        //     $.ajax({
        //         url:contextPath+'/wareHouse/listByTypeAndOrganizationId?type=1',
        //         type: 'POST',
        //         dataType:'json',
        //         success:function (result) {
        //             console.log(result);
        //             This.wareHouseList = result.data;
        //         },
        //         error:function (error) {
        //         }
        //     })
        // },
        // 新增获取仓库下的库位列表
        // getLocationList(e,index){
        //     console.log('进获取库位啦')
        //     console.log(e.target.value);
        //     let This = this
        //     $.ajax({
        //         type: "POST",
        //         url: contextPath + "/tbasecommodity/queryByWareHouse?id=" + e.target.value,
        //         contentType: 'application/json',
        //         dataType: "json",
        //         async: false,
        //         success: function (result) {
        //             console.log(result)
        //             if (result.code === "100100"){
        //                 This.$set(This.locationList,index,result.data)
        //             }else{
        //
        //             }
        //         },
        //     });
        // },

        //新增
        add() {
            window.parent.activeEvent({
                name: '新增证书商品收回单',
                url: contextPath + '/purchase/certificate-back-report/certificate-back-add.html',
                params: {
                    type: "add",
                    organizationId: retrieveReport.saveCertiBackVo.organizationId,
                    organizationName: retrieveReport.saveCertiBackVo.organizationName
                }
            });
        },
        save(param) {
            var This = this;
            This.saveCertiBackVo.orderStatus = 1;
                //如果明细信息为空,提示信息
                // if(This.saveCertiBackVo.certificateDetailList.length == 0){
                //     This.$Modal.warning({
                //         content: '请填写订单明细信息',
                //         duration: 1.5,
                //         closable: true
                //     })
                //     retrieveReport.isSave = false;
                //     return false;
                //
                // }
                $.ajax({
                    type: "post",
                    url: contextPath + '/certiBackDetail/saveOrUpdateCertiBackDetail',
                    contentType: 'application/json',
                    data: JSON.stringify(param),
                    dataType: "json",
                    success: function (res) {
                        if (res.code == '100100') {
                            This.$Modal.success({
                                title:'提示信息',
                                content: '保存成功',
                                duration: 1.5,
                                closable: true
                            })
                            This.saveAccess(res.data.id,This.P_CERTIBACK_APPREVAL);
                            retrieveReport.isSave = false;
                            This.isApprovel = true;
                            This.isReback = true;
                            This.saveCertiBackVo.certificateDetailList = res.data.certificateDetailList;
                            This.saveCertiBackVo.id = res.data.id;
                            This.saveCertiBackVo.businessType = res.data.businessType;
                            This.saveCertiBackVo.orderNo = res.data.orderNo;
                            This.saveCertiBackVo.orderStatus = res.data.orderStatus;
                            This.saveCertiBackVo.receiptDate = res.data.receiptDate;
                            This.saveCertiBackVo.remark = res.data.remark;
                            This.saveCertiBackVo.organizationId = res.data.organizationId;
                            This.saveCertiBackVo.organizationName = res.data.organizationName;
                            This.saveCertiBackVo.supplier = res.data.supplier;
                            This.saveCertiBackVo.supplierId = res.data.supplierId;
                            This.saveCertiBackVo.goodsTypePath = res.data.goodsTypePath;
                            This.saveCertiBackVo.goodsTypeName = res.data.goodsTypeName;
                            This.saveCertiBackVo.salesman = res.data.salesman;
                            This.saveCertiBackVo.salesmanId = res.data.salesmanId;
                            This.saveCertiBackVo.certificateType = res.data.certificateType;
                            This.saveCertiBackVo.createName = res.data.createName;
                            This.saveCertiBackVo.createTime = res.data.createTime;
                            This.saveCertiBackVo.updateName = res.data.updateName;
                            This.saveCertiBackVo.updateTime = res.data.updateTime;
                            This.saveCertiBackVo.auditor = res.data.auditor;
                            This.saveCertiBackVo.auditTime = res.data.auditTime;
                        } else {
                            This.$Modal.warning({
                                title:'提示信息',
                                content: res.msg,
                                duration: 1.5,
                                closable: true
                            });
                            retrieveReport.isSave = false;
                        }
                    },
                    error: function (err) {
                        This.$Modal.warning({
                            title:'提示信息',
                            content: '服务器出错，请稍后再试！',
                            duration: 1.5,
                            closable: true
                        })
                        retrieveReport.isSave = false;
                    },
                })
        },
        changeStatus(orderStatus){
            if(orderStatus == '' || orderStatus == null || orderStatus == 1){
                retrieveReport.isSave = false;
                retrieveReport.isSub = false;
            }else{
                retrieveReport.isSave = true;
                retrieveReport.isSub = true;
            }
        },
        submit(param) {
            var That = this;
            // if ($('form').valid()) {
            if(this.validateForm()){
                let length = 0;
                let certificateDetailList = That.saveCertiBackVo.certificateDetailList;
                length = That.saveCertiBackVo.certificateDetailList.length;
                if(length == 0) {
                    That.$Modal.info({
                        title:'提示信息',
                        content: '请填写订单明细信息',
                        duration: 1.5,
                        closable: true
                    })
                    That.changeStatus(That.saveCertiBackVo.orderStatus);
                    return false;
                }
                for (var i = 0; i < length; i++) {
                    if ((certificateDetailList[i].certificateNumber === '') || (certificateDetailList[i].certificateNumber === undefined) || (certificateDetailList[i].certificateNumber === null) ) {
                        That.$Modal.info({
                            title:'提示信息',
                            content: `请填写第${i+1}行的证书数量`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.saveCertiBackVo.orderStatus);
                        return false;
                    } else if (certificateDetailList[i].certificateCost == '' || certificateDetailList[i].certificateCost == undefined || certificateDetailList[i].certificateCost == null) {
                        That.$Modal.info({
                            title:'提示信息',
                            content: `请填写第${i+1}行的证书费用`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.saveCertiBackVo.orderStatus);
                        return false;
                    } else if ((certificateDetailList[i].receiverWeight == '' || certificateDetailList[i].receiverWeight == null || certificateDetailList[i].receiverWeight == undefined )  && (certificateDetailList[i].receiverGoodsNumber == '' || certificateDetailList[i].receiverGoodsNumber == null || certificateDetailList[i].receiverGoodsNumber == undefined)) {
                        That.$Modal.info({
                            title:'提示信息',
                            content: `第${i+1}行的收货数量和收货重量至少填一个`,
                            duration: 1.5,
                            closable: true
                        })
                        That.changeStatus(That.saveCertiBackVo.orderStatus);
                        return false;
                    }
                }
                That.saveCertiBackVo.orderStatus = 2;
                $.ajax({
                    type: "post",
                    url: contextPath + '/certiBackDetail/saveOrUpdateCertiBackDetail',
                    contentType: 'application/json',
                    data: JSON.stringify(param),
                    dataType: "json",
                    success: function (res) {
                        if (res.code == '100100') {
                            That.$Modal.success({
                                title:'提示信息',
                                content: '提交成功',
                                duration: 1.5,
                                closable: true
                            });
                            That.saveAccess(res.data.id,That.P_CERTIBACK_APPREVAL);
                            That.isApprovel = false;
                            That.isReback = false;
                            That.isView = true;
                            That.isGenerate = false;
                            That.isAdd = false;
                            That.saveCertiBackVo.certificateDetailList = res.data.certificateDetailList;
                            That.saveCertiBackVo.id = res.data.id;
                            That.saveCertiBackVo.businessType = res.data.businessType;
                            That.saveCertiBackVo.orderNo = res.data.orderNo;
                            That.saveCertiBackVo.orderStatus = res.data.orderStatus;
                            That.saveCertiBackVo.receiptDate = res.data.receiptDate;
                            That.saveCertiBackVo.remark = res.data.remark;
                            That.saveCertiBackVo.organizationId = res.data.organizationId;
                            That.saveCertiBackVo.organizationName = res.data.organizationName;
                            That.saveCertiBackVo.supplier = res.data.supplier;
                            That.saveCertiBackVo.supplierId = res.data.supplierId;
                            That.saveCertiBackVo.goodsTypePath = res.data.goodsTypePath;
                            That.saveCertiBackVo.goodsTypeName = res.data.goodsTypeName;
                            That.saveCertiBackVo.salesman = res.data.salesman;
                            That.saveCertiBackVo.salesmanId = res.data.salesmanId;
                            That.saveCertiBackVo.certificateType = res.data.certificateType;
                            That.saveCertiBackVo.createName = res.data.createName;
                            That.saveCertiBackVo.createTime = res.data.createTime;
                            That.saveCertiBackVo.updateName = res.data.updateName;
                            That.saveCertiBackVo.updateTime = res.data.updateTime;
                            That.saveCertiBackVo.auditor = res.data.auditor;
                            That.saveCertiBackVo.auditTime = res.data.auditTime;
                            That.isEdit("N");
                            That.getInitDataById();
                        } else {
                            That.$Modal.warning({
                                title:'提示信息',
                                content: res.msg,
                                duration: 1.5,
                                closable: true
                            })
                            That.isSave = false;
                            That.isSub= false;
                        }
                    },
                    error: function (err) {
                        That.$Modal.warning({
                            title:'提示信息',
                            content: '服务器出错，请稍后再试！',
                            duration: 1.5,
                            closable: true
                        })
                        That.isSave = false;
                        That.isSub= false;
                    },
                })
            }else{
                That.changeStatus(That.saveCertiBackVo.orderStatus);
            }
        },
        //保存,提交
        saveClick(param) {
            var That = this;
            if ('save' == param) {
                // var validator = $("form").validate();
                // validator.resetForm();
                retrieveReport.isSave = true;
                That.save(That.saveCertiBackVo);
            } else if ('submit' == param) {
                That.isSub = true;
                That.isSave = true;
                That.submit(That.saveCertiBackVo);
            }
        },
        validateForm(){
            let isSupplierPass = this.$refs.supplier.submit();//验证供应商
            let isFormPass;
            this.$refs['saveCertiBackVo'].validate((valid)=>{
                if(valid){
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            })
            if(!isSupplierPass  || !isFormPass){
                return false;
            } else {
                return true;
            }
            // let result = true;
            // let basicInfo = {
            //     '业务类型':this.saveCertiBackVo.businessType,
            //     '商品类型':this.saveCertiBackVo.goodsTypePath,
            //     '证书类型':this.saveCertiBackVo.certificateType,
            //     '供应商':this.saveCertiBackVo.supplier,
            // }
            // for(let key in basicInfo) {
            //     if(!basicInfo[key]) {
            //         result = false;
            //         this.$Modal.warning({
            //             content:'您还没有填写' + key
            //         })
            //         break;
            //     }
            // }
            // return result;
        },
        //退出
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose(){
            if(!this.saveCertiBackVo.orderStatus || this.saveCertiBackVo.orderStatus == 1){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save(this.saveCertiBackVo);
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },

        //审批意见点击确定
        getApproveInfo() {
        },
        //驳回点击确定
        getRejectInfo() {
        },
        //分录行新增/删除
        addOrDel(type) {//新增删除行
            if (type === 'add') {
                this.saveCertiBackVo.certificateDetailList.push({
                    sourceType: '',
                    sourceNumber: '',
                    certificateNumber: '',
                    receiverGoodsNumber: '',
                    receiverWeight: '',
                    certificateCost: '',
                    totalCost: '',
                    remark: ''
                });
            } else {
                this.saveCertiBackVo.certificateDetailList.splice(this.selectedRowIndex, 1);
            }
        },
        //选中行
        selectOneRow(index) {
            this.selectedRowIndex = index;
        },
        //展示证书商品收回单的详情信息
        showCertiBackDetail(id) {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/certificateBackInfo/viewCertiBackDetailById',
                data: {id: id},
                success: function (res) {
                    if (res.code == '100100') {
                        if (res.data.orderStatus == 2 || res.data.orderStatus == 3 || res.data.orderStatus == 5 )  {
                            This.isSave = true;
                            This.isSub = true;
                            This.isApprovel = false;
                            This.isReback = false;
                        } else if (res.data.orderStatus == 4) {
                            This.isSave = true;
                            This.isSub = true;
                            This.isApprovel = true;
                            This.isReback = true;
                        }else if(res.data.orderStatus == 1){
                            This.isSave = false;
                            This.isSub = false;
                            This.isApprovel = true;
                            This.isReback = true;
                        }else{
                            This.isSave = false;
                            This.isSub = false;
                            This.isApprovel = false;
                            This.isReback = false;
                        }
                        if (res.data.orderStatus != 1) {
                            This.readDate = true;
                            This.isView = true;
                            This.isGenerate = false;
                            This.isAdd = false;
                        } else if (res.data.dataSource == 1) {
                            This.readDate = false;
                            This.isAdd = true;
                            This.isView = false;
                            This.isGenerate = false;
                        } else {
                            This.readDate = false;
                            This.isGenerate = true;
                            This.isAdd = false;
                            This.isView = false;
                        }
                        This.saveCertiBackVo.certificateDetailList = res.data.certificateDetailList;
                        This.saveCertiBackVo.id = res.data.id;
                        This.saveCertiBackVo.businessType = res.data.businessType.toString();
                        This.saveCertiBackVo.orderNo = res.data.orderNo;
                        This.saveCertiBackVo.dataSource = res.data.dataSource;
                        This.saveCertiBackVo.orderStatus = res.data.orderStatus;
                        This.saveCertiBackVo.receiptDate = res.data.receiptDate;
                        This.saveCertiBackVo.remark = res.data.remark;
                        This.saveCertiBackVo.organizationId = res.data.organizationId;
                        This.saveCertiBackVo.organizationName = res.data.organizationName;
                        This.saveCertiBackVo.supplier = res.data.supplier;
                        This.saveCertiBackVo.supplierId = res.data.supplierId;
                        This.saveCertiBackVo.goodsTypePath = res.data.goodsTypePath;
                        This.saveCertiBackVo.goodsTypeName = res.data.goodsTypeName;
                        This.saveCertiBackVo.salesman = res.data.salesman;
                        This.saveCertiBackVo.salesmanId = res.data.salesmanId;
                        This.saveCertiBackVo.certificateType = res.data.certificateType;
                        This.saveCertiBackVo.createName = res.data.createName;
                        This.saveCertiBackVo.createTime = res.data.createTime;
                        This.saveCertiBackVo.updateName = res.data.updateName;
                        This.saveCertiBackVo.updateTime = res.data.updateTime;
                        This.saveCertiBackVo.auditor = res.data.auditor;
                        This.saveCertiBackVo.auditTime = res.data.auditTime;
                        This.$refs.supplier.haveInitValue(This.saveCertiBackVo.supplier, This.saveCertiBackVo.supplier);
                    } else {
                        This.$Modal.warning({
                            title:'提示信息',
                            content: '显示失败',
                            duration: 1.5,
                            closable: true
                        })
                        return false;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title:'提示信息',
                        content: '服务器出错',
                        duration: 1.5,
                        closable: true
                    })
                },
            })
        },
        getSupplierList() {
            $.ajax({
                type: "post",
                url: contextPath + '/waitCertiBackInfo/getSupplierList',
                data: {},
                success: function (res) {
                    if (res.data != '') {
                        for (var i = 0; i < res.data.length; i++) {
                            retrieveReport.supplierList.push({
                                id: res.data[i].id,
                                supplier: res.data[i].supplierName,
                            });
                        }
                    }
                }
            })
        },
        //生成证书商品收回单
        loadListData(ids) {
            let This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/waitCertiBackInfo/getCerByIds',
                contentType: 'application/json',
                dataType: "json",
                data: JSON.stringify(ids),
                success: function (res) {
                    if (res.code == '100100') {
                        var array = [];
                        //明细信息中的 证书类型，证书数量，证书费用，备注，收货数量 带出
                        for (var i = 0; i < res.data.length; i++) {
                            array.push(Object.assign(res.data[i], {
                                id: '',
                                sourceNumber: res.data[i].orderNo,
                                sourceId: res.data[i].id,
                                certificateType: res.data[i].certificateType,
                                certificateNumber: res.data[i].certificateNumber,
                                certificateCost: res.data[i].certificateCost,
                                remark: res.data[i].remark,
                                receiverGoodsNumber: res.data[i].deliverGoodsNumber,
                                receiverWeight: res.data[i].deliverWeight
                            }));
                        }
                        This.saveCertiBackVo.certificateDetailList = array;
                        //表单信息取了第一条信息进行赋值
                        This.saveCertiBackVo.receiptDate = new Date();
                        This.saveCertiBackVo.goodsTypeName = res.data[0].goodsTypeName;
                        This.saveCertiBackVo.goodsTypePath = res.data[0].goodsTypePath;
                        This.saveCertiBackVo.businessType = res.data[0].businessType.toString();
                        This.saveCertiBackVo.organizationId = res.data[0].organizationId;
                        This.saveCertiBackVo.organizationName = res.data[0].organizationName;
                        // This.saveCertiBackVo.supplier = res.data[0].supplier;
                        This.saveCertiBackVo.supplierId = res.data[0].supplierId;
                        This.saveCertiBackVo.supplier = res.data[0].supplier;
                        This.saveCertiBackVo.certificateType = res.data[0].certificateType;
                        This.saveCertiBackVo.createName = res.data[0].createName;
                        This.saveCertiBackVo.createTime = res.data[0].createTime;
                        This.saveCertiBackVo.updateName = res.data[0].updateName;
                        This.saveCertiBackVo.updateTime = res.data[0].updateTime;
                        This.saveCertiBackVo.auditor = res.data[0].auditor;
                        This.saveCertiBackVo.auditTime = res.data[0].auditTime;
                        console.log(This.saveCertiBackVo.supplier);
                        This.$refs.supplier.haveInitValue(This.saveCertiBackVo.supplier, This.saveCertiBackVo.supplier);
                    } else {
                        This.$Modal.warning({
                            title:'提示信息',
                            content: '生成失败',
                            closable: true
                        })
                        return false;
                    }
                },
                error: function (err) {
                    This.$Modal.warning({
                        title:'提示信息',
                        content: '生成失败',
                        closable: true
                    })
                },
            })
        },
        //附件是编辑还是查看 传入Y表示编辑，传入N表示查看,页面初始化的时候就需要调用这个方法
        isEdit: function (isEdit, on) {
            eventHub.$emit('isEdit', isEdit);
        },
        // 保存附件 保存的时候调用
        saveAccess: function (id, type, on) {
            eventHub.$emit('saveFile', id, type);
        },
        // 查找附件 查看的时候调用
        getAccess: function (id, type, on) {
            eventHub.$emit('queryFile', id, type);
        },
        getInitDataById() { //获取分录行数据列表
            let This = this;
            let id = window.parent.params.params.id; //94;//window.parent.params.params.code;
            if (!id) {
                return;
            }
            $.ajax({
                type: "post",
                url: contextPath + '/certificateBackInfo/viewCertiBackDetailById',
                data: {id: id},
                success: function (data) {
                    if (data.code !== '100100') {
                        This.$Modal.warning({
                            title:'提示信息',
                            content: '服务器出错',
                        });
                        return
                    }
                    This.isEdit(data.data.orderStatus == 1 ? 'Y' : 'N');
                    This.getAccess(data.data.id, This.P_CERTIBACK_APPREVAL);
                },
                error: function () {
                    // layer.alert('服务器出错啦');
                    This.$Modal.warning({
                        title:'提示信息',
                        content: '服务器出错',
                    });
                }
            })
        },
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        // certiNumber(val) {
        //     val.certificateNumber = this.checkNumber(val.certificateNumber);
        // },
        // receiverNumber(val) {
        //     val.receiverGoodsNumber = this.checkNumber(val.receiverGoodsNumber);
        // },
        // receiverWeight(val) {
        //     if ('' == val.receiverWeight) {
        //         return false;
        //     }
        //     if (isNaN(val.receiverWeight)) {
        //         this.$Modal.warning({
        //             content: '请输入数字',
        //         })
        //         val.receiverWeight = ''
        //     }
        // },
        // certificateCost(val) {
        //     if ('' == val.certificateCost) {
        //         return false;
        //     }
        //     if (isNaN(val.certificateCost)) {
        //         this.$Modal.warning({
        //             content: '请输入数字',
        //         })
        //         val.certificateCost = ''
        //     }
        // },
        // totalCost(val) {
        //     if ('' == val.totalCost) {
        //         return false;
        //     }
        //     if (isNaN(val.totalCost)) {
        //         this.$Modal.warning({
        //             content: '请输入数字',
        //         })
        //         val.totalCost = ''
        //     }
        // },
        remarkNumber(val) {
            console.log(val);
            if (val && val.length > 200) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '备注不能操作100个汉字',
                })
                return false;
            }
        },
        //验证字符串是否是数字
        checkNumber(theObj) {
            if (theObj == '') {
                return '';
            }
            var reg = new RegExp(/^\d+$/);
            // var reg = /^[0-9]+.?[0-9]*$/;
            if (!reg.test(theObj)) {
                this.$Modal.info({
                    title:'提示信息',
                    content: '请输入整数',
                })
                theObj = '';
                return '';
            }
            return theObj;
        },
        //计算列合计
        sum(list, key) {
            return list.reduce((sum, el) => {
                if (el[key] === '' || el[key] === null || el[key] === undefined) {
                    return 0 + sum;
                };
                return parseFloat(el[key]) + sum;
            }, 0)
        },
    },

    computed:{
            //计算证书数量，收货数量，收货重量，证书费用，总成本合计
            totalCertificateNumber: function () {
                return this.sum(this.saveCertiBackVo.certificateDetailList, 'certificateNumber');
            },
            totalReceiverGoodsNumber: function () {
                return this.sum(this.saveCertiBackVo.certificateDetailList, 'receiverGoodsNumber');
            },
            totalReceiverWeight: function () {
                return this.sum(this.saveCertiBackVo.certificateDetailList, 'receiverWeight').toFixed(2);
            },
            totalCertificateCost: function () {
                return this.sum(this.saveCertiBackVo.certificateDetailList, 'certificateCost').toFixed(2);
            },
            finalCost: function () {
                return this.sum(this.saveCertiBackVo.certificateDetailList, 'totalCost').toFixed(2);
            },
            typeValue:function () {
                let temp = this.saveCertiBackVo.goodsTypePath;
                let arr =[];
                this.typeInit(this.productTypeList,arr,temp);
                return arr.reverse();
            }
    },
    watch: {
        // typeValue:function () {
        //     let temp = this.saveCertiBackVo.goodsTypePath;
        //     let arr =[];
        //     this.typeInit(this.productTypeList,arr,temp);
        //     return arr.reverse();
        // }
    },
    created() {
        //获取业务员信息
        this.getSaleMan();
        //获取商品类型
        this.getProductType();
        // this.initApproval();
        //接收列表页过来的参数
        this.param = window.parent.params.params;
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        //$("form").validate();
        //获取供应商
        this.getSupplierList();
        //获取仓库
        // this.getWareHouseList();

        this.openTime = window.parent.params.openTime;
        query:{
            let params = window.parent.params.params;
            if (params.type) {
                if (params.type === 'generate') {
                    this.isApprovel = true;
                    this.isReback = true;
                    let ids = [];
                    ids = params.ids;
                    this.isGenerate = true;
                    this.isView = false;
                    this.isAdd = false;
                    this.readDate = false;
                    this.isEdit("Y");
                    this.loadListData(ids);
                } else if (params.type === 'update') {
                    this.getInitDataById();
                    this.showCertiBackDetail(params.id);
                } else if (params.type === 'view') {
                    this.readDate = true;
                    this.isView = true;
                    this.isGenerate = false;
                    this.isAdd = false;
                    this.isEdit("N");
                    this.getInitDataById();
                    this.showCertiBackDetail(params.id);
                } else if (params.type === 'add') {
                    this.saveCertiBackVo.organizationName = layui.data('user').currentOrganization.orgName;
                    this.saveCertiBackVo.dataSource = 1;
                    this.saveCertiBackVo.receiptDate = new Date();
                    this.$refs.supplier.noInitValue();
                    this.isApprovel = true;
                    this.isReback = true;
                    this.readDate = false;
                    this.isView = false;
                    this.isGenerate = false;
                    this.isAdd = true;
                    this.isEdit("Y");
                }
            }
        }
    },
})
