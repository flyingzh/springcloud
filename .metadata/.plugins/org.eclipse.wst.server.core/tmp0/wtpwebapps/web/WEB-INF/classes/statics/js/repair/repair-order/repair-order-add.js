let repair = new Vue({
    el: "#repair-order",
    data() {
        return {
            htHaveChange:false,
            //防止重复操作标识
            doFlag:true,
            totalSearch:"",
            unitListObj: {},
            ruleValidate:{
                businessType: [
                    { required: true}
                ],
                repairTime:[
                    { required: true}
                ],
                goodsType:[
                    { required: true}
                ],
                supplierName:[
                    { required: true}
                ],
                purMenId:[
                    { required: true}
                ],
                totalPreRepairFee:[
                    { required: true}
                ],
                saleMenId:[
                    { required: true}
                ]
            },
            //库存退库
            exitTemp: false,
            //库存退库查看
            goodsReturnTemp: false,
            //所选的客户对象
            selectCustomerObj: null,
            //是否选择商品类型
            isHint: false,
            //校验数据
            paramsMap: "",
            //质检结果
            qualityTemp: "1",
            //查询状态
            searchTemp: false,
            //审核
            modalTrigger: false,
            modalType: '',
            //审批进度条
            steplist: [],
            approvalTableData: [],
            openTime: "",
            //状态
            orderType: "",
            optionList: [],
            repairTypeList: [],//分录行维修类型下拉选项
            repairWayList: [],//分录行维修方式下拉选项
            //金料成色
            goldColor: "",
            //组织
            organ: {
                organizationName: '',
                organizationId: ''
            },
            //删除行下标
            delIndex: "",
            //显示新增删除按钮
            autoTemp: true,
            //查看锁死
            isView: false,
            //职员
            employees: [],
            //商品类型
            productTypeList: [],
            //客户弹框
            showCustomerModal: false,
            //客户信息
            customerInfo: "",
            //供应商弹框
            showSupplierModal: false,
            isDisable: true,
            reload: true,
            custSelected: [],
            isHideSearch: true,
            isHideList: true,
            isShow: false,
            // 客户弹窗搜索
            body: {
                code: "",
                name: ""
            },
            repairOrder: {
                id: '',
                saveFlag: '',//1:普通保存 2:提交保存
                updateFlag: '',//1:普通修改 2:提交修改
                //业务类型
                businessType: "",
                //单据编号
                repairOrderNo: "",
                //日期
                repairTime: "",
                //商品类型
                goodsType: "",
                //商品类型名称
                goodsTypeName: "",
                //分类路径
                groupPath: "",
                //商品主类型
                goodsMainType: "",
                //所属组织名称
                organizationName: "",
                //所属组织ID
                organizationId: "",
                //维修厂家
                supplierName: "",
                //维修厂家Id
                supplierId: "",
                //维修厂家编码
                supplierCode: "",
                //采购人ID
                purMenId: "",
                //采购人名称
                purMenName: "",
                //客户名称
                custName: "",
                //客户编号
                custNo: "",
                //客户名称ID
                custId: "",
                //总预估维修费用
                totalPreRepairFee: "",
                //业务员名称
                saleMenName: "",
                //业务员ID
                saleMenId: "",
                //备注
                remark: "",
                //单据状态(1 暂存，2 待审核，3 审核中，4 已审核，5 驳回)
                status: 1,
                //审核人
                auditId: "",
                //审核时间
                auditTime: "",
                //审核人姓名
                auditName: "",
                //创建人ID
                createId: "",
                //创建人姓名
                createName: "",
                //创建时间
                createTime: "",
                //修改人ID
                updateId: '',
                //修改人姓名
                updateName: '',
                //修改时间
                updateTime: '',
                //是否删除（1：未删除；0：已删除）
                isDel: '',
                //版本号
                version: '',
                //数据状态(1 不可提交，2 可提交)
                dataStatus: '',
                //生成下游数据标志(1 待生成 ；2  已生成)
                genDataMark: '',
                goodsList: [],
            },

            goodsList: [],
            oneInfo: {
                sourceType: '',
                sourceId: '',
                saleReturnGoodsId: '',
                stockReturnGoodsId: '',
                documentNo: '',
                goodsEntity: {
                    //商品名称
                    goodsName: '',
                    //商品编码
                    goodsCode: '',
                    //商品编码ID
                    commodityId: '',
                    //商品数量
                    goodsNum: '',
                    //商品规格
                    goodsNorm: '',
                    //计数单位
                    countingUnit: '',
                    //计重单位
                    weightUnit: '',
                    //总重
                    totalWeight: '',
                    //金重
                    goldWeight: '',
                    //款式类别
                    custStyleCode: '',
                    //款式名称
                    custStyleName: '',
                    //主石名称
                    mainStoneName: '',
                    //主石重
                    mainStoneWeight: '',
                    //主石颜色
                    mainStoneColor: '',
                    //主石净度
                    mainStoneClarity: '',
                    //副石名称
                    viceStoneName: '',
                    //副石重
                    viceStoneWeight: '',
                    //副石粒数
                    viceStoneNum: '',
                    //证书类型
                    certificateType: '',
                    //证书编号
                    certificateNo: '',
                    //备注
                    remark: '',
                    //检验状态
                    checkStatus: '',
                    //检验结果
                    check_result: '',
                    //维修类型
                    repairType: '',
                    //维修方式
                    repairWay: '',
                    //维修次数
                    repairNum: '',
                    //维修内容及要求
                    repairRemark: '',
                    //预维修费用
                    preRepairFee: '',
                    //实际维修费用
                    repairFee: '',
                    //结算费用
                    billFee: '',
                    goodsLineNo: '',
                    countingUnitId: '',
                    weightUnitId: '',
                    styleCategoryId: '',
                    styleCustomCode: '',
                    styleName: '',
                    goodsMainType: '',
                    //金料成色,
                    goldColor: ''
                },
            },
            temp: 'detail',
            comparedInfo: "",
            goodsCheckInfo: "",
            //单据类型-销售定金单
            docType: 'REPAIR_ORDER'
        }
    },
    methods: {
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
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        exit(close) {
            if(close === true){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if(this.handlerClose()){
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        closeCustomer() {
            if (this.selectCustomerObj) {
                // debugger
                this.repairOrder.custId = this.selectCustomerObj.id;
                this.repairOrder.custName = this.selectCustomerObj.name;
            }
            this.showCustomer = false;
        },
        //点击查询
        jumpClick(sourceType, code, sourceId) {

            if (sourceType == 1) {
                //维修订单
                window.parent.activeEvent({
                    name: '维修登记单-查看',
                    url: contextPath + '/repair/registration/registration-form.html',
                    params: {type: 'view', repairRegisterNo: code}
                });
            } else if (sourceType == 2) {
                //销售退货通知单
                console.log("销售退货通知单-查看.......")
                window.parent.activeEvent({
                    name: '销售退货通知单-查看',
                    url: contextPath + '/sale/return-notice/sale-reject-add.html',
                    params: {
                        type: 'other',
                        data: code
                    }
                });
            } else {
                //库存退库单
                this.selectByOrderDetail(sourceId,'W_STOCK_RETURN')
            }
        },
        //查询库存退库单接口
        selectByOrderDetail(id,businessType){
            let This = this;
            $.ajax({
                url:contextPath + '/rurchaseReturnGoods/queryByOrderInfo/'+id+"/"+businessType,
                method:'post',
                dataType:'json',
                success:function(data){
                    if(data.code == '100100'){
                        window.parent.activeEvent({
                            name: '采购退库单详情-查看',
                            url: contextPath + '/purchase/returngoods/returngoods-add.html',
                            params: {type: 'detail',goodsData:data.data,activeType:'detail'}
                        });
                    }else{
                        layer.alert(data.msg, {icon: 0});
                    }
                },
                error:function(){
                    layer.alert('服务器异常，请稍后再试！', {icon: 0});
                }
            });
        },

        //新增行
        addRow() {

            //判断是否是生成数据
            if(this.searchTemp == true ||this.goodsReturnTemp == true ){
                this.$Modal.warning({
                    title: "提示",
                    content:"生成明细不能增减！"
                })
                return;
            }


            //校验数据
            this.paramsMap = {
                "商品类型": this.repairOrder.goodsType,
                "客户": this.repairOrder.custName,
            };
            //  校验
            if (!this.checkData(true)) {
                return;
            }
            //判断
            let obj = {};
            obj = JSON.parse(JSON.stringify(this.oneInfo));
            //obj = $.extend(true,{},obj )
            console.log(obj)
            this.goodsList.push(obj);
        },
        //删除行
        delRow() {
            //判断是否是生成数据
            if(this.searchTemp == true ||this.goodsReturnTemp == true ){
                this.$Modal.warning({
                    title: "提示",
                    content:"生成明细不能增减!"
                })
                return;
            }
            if (this.delIndex === "") {
                this.$Modal.warning({
                    title: "提示",
                    content: "请选择需要删除的下标!"
                })
            } else {
                console.log(this.orderType)
                this.goodsList.splice(this.delIndex, 1)
                Object.assign(this.repairOrder.goodsList, this.goodsList)
                $(".tdInfo").removeClass("tr-back")

                //计算
                this.totalSearch = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
                this.repairOrder.totalPreRepairFee = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
                this.delIndex = '';
                this.htHaveChange = true;
            }
        },
        //获取点击下标
        getIndex(index) {
            if (this.delIndex != index || this.delIndex === "") {
                this.delIndex = index
                //给相对应的tr添加背景颜色
                $(".tdInfo").eq(this.delIndex).addClass("tr-back").siblings().removeClass("tr-back")
            } else {
                //给相对应的tr去除背景颜色
                $(".tdInfo").eq(this.delIndex).removeClass("tr-back")

                this.delIndex = ""
            }

        },
        //计算列合计
        sum(list, key) {
            let sum = 0;
            if (list.length>0) {
                list.map((item) => {
                    console.log(item.goodsEntity[key])
                    if (item.goodsEntity[key] == "" || item.goodsEntity[key] == undefined) {
                        item.goodsEntity[key] = 0;
                    }
                    sum += parseFloat(item.goodsEntity[key]);
                })
            }

            return sum;
        },
        //获取职员信息
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.organ.organizationName = r.data.orgName; //加载当前组织姓名
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        otherInfo(item) {
            console.log(item)
            if (item.sourceType == 1) {
                this.temp = 'other'
                if (this.orderType == "search") {
                    console.log(1111)
                    this.comparedInfo = item.goodsRegisterEntity
                    this.goodsCheckInfo = item.goodsRegisterEntity.goodsCheckInfo
                } else {
                    this.comparedInfo = item.goodsEntity.repairGoodsEntity;
                    this.goodsCheckInfo = item.goodsEntity.repairGoodsEntity.goodsCheckInfo
                }

            }

        },
        act(val) {
            //显示分录行
            if (val === 'detail') {
                this.temp = 'detail'
            }
        },
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
        },
        //处理待维修页面数据
        copyWait(data) {
            console.log(data)
            if (data) {
                data.map((item) => {
                    let obj = {};
                    obj['sourceId'] = item.sourceId
                    obj['sourceType'] = item.sourceType
                    obj['documentNo'] = item.documentNo
                    obj['saleReturnGoodsId'] = item.saleReturnGoodsId
                    obj['stockReturnGoodsId'] = item.stockReturnGoodsId
                    obj['goodsEntity'] = item;
                    obj['goodsRegisterEntity'] = item.repairGoodsEntity;
                    this.goodsList.push(obj);
                })
            }
            console.log(this.goodsList)
            //获取客户信息
            this.goodsList.map((info) => {
                if (info.goodsEntity) {
                    //客户名称
                    this.repairOrder.custName = info.goodsEntity.custName
                    //客户编号
                    this.repairOrder.custNo = info.goodsEntity.custNo
                    //客户名称ID
                    this.repairOrder.custId = info.goodsEntity.custId
                    this.repairOrder.goodsType = info.goodsEntity.goodsType
                    this.repairOrder.goodsTypeName = info.goodsEntity.goodsTypeName
                }
            })
            this.repairOrder.repairTime = new Date().format("yyyy-MM-dd HH:mm:ss");
            //判断关联的单据
            if (this.goodsList) {
                this.goodsList.map((item) => {
                    console.log(item)
                    item.goodsEntity['custStyleCode'] = item.goodsEntity.styleCustomCode
                    item.goodsEntity['custStyleName'] = item.goodsEntity.styleName
                    if (item.sourceType == 1) {
                        this.repairOrder.businessType = '1';
                        console.log(this.repairOrder.businessType)
                        return;
                    } else if (item.sourceType == 2) {
                        this.repairOrder.businessType = '2';
                        return;
                    }else if(item.sourceType == 3){
                        //库存退库不校验客户
                        this.ruleValidate.custName[0].required = false;
                        this.repairOrder.businessType = '2';
                    }



                })
            }
            Object.assign(this.repairOrder.goodsList, this.goodsList)

            //查找附件
            if (!$.isEmptyObject(this.repairOrder.repairOrderNo)) {
                this.getAccess(this.repairOrder.repairOrderNo, this.docType);
            }
            //是否开启附件
            this.isEdit('Y');

            //判断是否为库存退库
            if (this.repairOrder.goodsList[0] && this.repairOrder.goodsList[0].sourceType != "3") {
                this.autoTemp = false;
            } else if (this.repairOrder.goodsList[0] && this.repairOrder.goodsList[0].sourceType == "3") {
                //锁死部分明细
                this.exitTemp = true;
                console.log("执行了")
            }

            this.$refs.supplier.noInitValue();
            this.$refs.customerRef.loadCustomerList(this.repairOrder.custName, this.repairOrder.custId);

        },
        //点击客户按钮
        userInfo() {
            console.log("点击获取客户")
            this.isShow = true;
        },
        selectCustomer(val) {
            console.log(val)
            if (val) {
                return;
            }
            this.showCustomerModal = true;
        },
        closeCustomerModal() {
            this.repairOrder.custId = this.customerInfo.id;
            this.repairOrder.custName = this.customerInfo.name;
            this.showCustomerModal = !this.showCustomerModal
        },
        //获取供应商信息
        selectSupplier(id, code, name) {
            if( id !== ""){
                //维修厂家
                this.repairOrder.supplierName = name;
                //维修厂家Id
                this.repairOrder.supplierId = id;
                //维修厂家编码
                this.repairOrder.supplierCode = code;
                this.$refs.formValidate.validateField('supplierName')
            }
        },
        closeSupplierModal() {
            this.showSupplierModal = false;
        },
        // 级联商品类型
        changeProductType(e) {
            let res = e.value === this.repairOrder.goodsType;
            if (!res) {
                this.repairOrder.goodsList = [];
            }
            this.repairOrder.goodsType = e.value;
            this.repairOrder.goodsTypeName = e.label;
            this.repairOrder.groupPath = e.__value.replace(/\,/g, '-');
            this.$refs.formValidate.validateField('goodsType')
            this.htTestChange();
            this.getInp();
        },
        //审核
        approval() {
            let _this = this;
            _this.isView = true
            console.log(this.body.status)
            _this.modalType = 'approve';
            _this.modalTrigger = !_this.modalTrigger;
        },
        //驳回
        reject() {
            let _this = this;
            _this.modalType = 'reject';
            _this.modalTrigger = !_this.modalTrigger;
        },
        // 采购负责人
        changeEmp(e) {
            if (e != undefined) {
                //采购人ID
                this.repairOrder.purMenId = e.value;
                //采购人名称
                var le = e.label;
                this.repairOrder.purMenName = le.substring(le.lastIndexOf("-") + 1, le.length);
            }
        },
        // 业务员
        changeSaleEmp(e) {
            if (e != undefined) {
                this.repairOrder.saleMenId = e.value;
                var le = e.label;
                this.repairOrder.saleMenName = le.substring(le.lastIndexOf("-") + 1, le.length);
            }
        },
        //保存
        save() {
            let This = this
            if(This.doFlag){
                let order = This.repairOrder
                //判断数据是否填写
                let msg = "";
                if (this.repairOrder.businessType == "") {
                    msg = "请填写业务类型";
                } else if (this.repairOrder.custName == "" && this.goodsList[0] && this.goodsList[0].sourceType != '3') {
                    msg = "请选择客户";
                } else if (this.repairOrder.goodsTypeName == "") {
                    msg = "请选择商品类型";
                }
                else if (this.repairOrder.supplierName == "") {
                    msg = "请选择维修厂家";
                } else if (this.repairOrder.purMenId == "") {
                    msg = "请选择采购负责人";
                } else if (this.repairOrder.saleMenId == "") {
                    msg = "请选择业务员";
                } else if (this.repairOrder.goodsList.length == 0) {
                    msg = "请输入维修订单商品信息";
                }

                if (msg != "") {
                    order.dataStatus == 1
                } else {
                    order.dataStatus == 2
                }
                let url = '';
                let message = '';

                if (This.goodsList.length !== 0) {
                    Object.assign(order.goodsList, This.goodsList)
                }
                if (!order.id) {
                    console.log("进保存新增")
                    order.saveFlag = 1
                    url = contextPath + '/repairOrderController/save'
                    message = "保存"
                } else {
                    console.log("进保存修改")
                    order.updateFlag = 1
                    url = contextPath + '/repairOrderController/update'
                    message = "修改"
                }
                console.log(order)
                //修改方提交标识
                This.doFlag = false;
                $.ajax({
                    url: url,
                    async: false,
                    type: 'POST',
                    data: JSON.stringify(order),
                    contentType: 'application/json;charset=utf-8',
                    success: function (result) {
                        if (result.code == '100100') {
                            This.$Modal.success({
                                title: "提示",
                                content: message + "成功！",
                            });
                            console.log(result)
                            if(result.data.goodsList){
                                result.data.goodsList.map((item)=>{
                                    item.goodsEntity.styleName = item.goodsEntity.custStyleName
                                    item.goodsEntity.styleCustomCode = item.goodsEntity.custStyleCode
                                })
                            }

                            Object.assign(This.repairOrder, result.data)
                            Object.assign(This.goodsList, result.data.goodsList)
                            This.repairOrder.businessType = "" + This.repairOrder.businessType;

                            //保存附件
                            if (!$.isEmptyObject(This.repairOrder.repairOrderNo)) {
                                This.saveAccess(This.repairOrder.repairOrderNo, This.docType);
                            }
                            This.doFlag = true;
                            This.htHaveChange = false;
                        } else {
                            This.$Modal.warning({
                                title: "提示",
                                content: result.msg
                            })
                            This.doFlag = true;
                        }

                    },
                    error: function (err) {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统出现异常,请联系管理人员"
                        });
                        This.doFlag = true;
                    }


                })
            }
            else {
                This.$Modal.warning({
                    title: "提示",
                    content: '请勿重复操作此数据！'
                })
            }


        },
        approvalOrRejectCallBack(res) {
            console.log(res)
            //判断单据状态
            if (res.result.code == "100100") {
                this.repairOrder.status = res.result.data.status
                this.repairOrder.auditTime = res.result.data.auditTime
                this.repairOrder.auditName = res.result.data.auditName
                this.repairOrder.auditId = res.result.data.auditId
                if (this.repairOrder.status > 1) {
                    this.isView = true;
                } else {
                    this.isView = false;
                }
                console.log(this.repairOrder.status)

                //是否开启附件
                this.isEdit(this.repairOrder.status == 1 ? 'Y' : 'N');
            }

        },

        //查询
        findInfoByOrderNo(repairOrderNo) {
            let This = this
            var params = {
                "repairOrderNo": repairOrderNo
            };
            $.ajax({
                url: contextPath + '/repairOrderController/infoByIdOrOrderNo',
                type: 'POST',
                data: params,
                success: function (result) {
                    if (result.code == '100100') {
                        console.log(result)

                        let tmpOrder = result.data
                        if (tmpOrder.goodsList) {
                            tmpOrder.goodsList.map(a => {
                                a.goodsEntity['styleCustomCode'] = a.goodsEntity.custStyleCode
                                a.goodsEntity['styleName'] = a.goodsEntity.custStyleName
                            })

                        }

                        Object.assign(This.repairOrder, tmpOrder)
                        Object.assign(This.goodsList, tmpOrder.goodsList)

                        console.log(This.goodsList)
                        This.orderType = "search"
                        if(This.repairOrder.businessType != "" || This.repairOrder.businessType != null){
                            This.repairOrder.businessType = "" + This.repairOrder.businessType;
                        }
                        //判断是否是暂存状态
                        if (This.repairOrder.status > 1) {
                            This.isView = true;
                            //This.autoTemp = false;
                        }
                        //查找附件
                        if (!$.isEmptyObject(This.repairOrder.repairOrderNo)) {
                            This.getAccess(This.repairOrder.repairOrderNo, This.docType);
                        }

                        //是否开启附件
                        This.isEdit(This.repairOrder.status == 1 ? 'Y' : 'N');
                        //判断是否是生成数据
                        console.log(This.goodsList)
                        if (This.goodsList.length > 0 && This.goodsList[0].documentNo) {
                            //This.isView = true;

                            if (This.goodsList[0].sourceType == "3") {
                                //库存退库
                                This.goodsReturnTemp = true;
                                //库存退库不校验客户
                                This.ruleValidate.custName[0].required = false;
                            } else {
                                This.searchTemp = true;
                            }


                            //计算
                            This.totalSearch = This.sum(This.goodsList, 'preRepairFee').toFixed(2);
                        }
                        if(This.goodsList.length > 0){
                            //计算
                            This.totalSearch = This.sum(This.goodsList, 'preRepairFee').toFixed(2);
                            This.repairOrder.totalPreRepairFee = This.totalSearch
                        }

                        This.$refs.supplier.haveInitValue(This.repairOrder.supplierName, This.repairOrder.supplierId);
                        This.$refs.customerRef.loadCustomerList(This.repairOrder.custName, This.repairOrder.custId);

                    } else {
                        This.$Modal.warning({
                            title: "提示",
                            content: result.msg
                        })
                    }
                },
                error: function (err) {

                }


            })
        },
        // 表单部分数据校验
        checkData(flag) {
            for (var key in this.paramsMap) {
                if (this.paramsMap[key] == undefined || this.paramsMap[key] === "" || this.paramsMap[key] === "null" || this.paramsMap[key].length < 1) {
                    if (flag) {
                        this.$Modal.warning({
                            title: "提示",
                            okText: "确定",
                            content: key + "不能为空!"
                        });
                    }
                    return false;
                }
            }
            return true;
        },
        //提交
        submit() {
            let This = this
            let order = This.repairOrder

            let temp = true;
            let isCustomerPass = false;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })
            isCustomerPass = this.$refs.customerRef.submit();
            if(!temp || !isCustomerPass){
                return;
            }

            //校验数据
            this.paramsMap = {
                '业务类型': this.repairOrder.businessType,
                "日期": this.repairOrder.repairTime,
                "商品类型": this.repairOrder.goodsType,
                "维修厂家": this.repairOrder.supplierName,
                "采购负责人": this.repairOrder.purMenId,
                // "客户":this.repairOrder.custName,
                "维修订单商品信息": this.goodsList,
                "业务员": this.repairOrder.saleMenId
            };
            //  校验
            if (!this.checkData(true)) {
                return;
            }
            if(This.doFlag){

                let order = This.repairOrder
                //校验数据
                this.paramsMap = {
                    '业务类型': this.repairOrder.businessType,
                    "日期": this.repairOrder.repairTime,
                    "商品类型": this.repairOrder.goodsType,
                    "维修厂家": this.repairOrder.supplierName,
                    "采购负责人": this.repairOrder.purMenId,
                    // "客户":this.repairOrder.custName,
                    "维修订单商品信息": this.goodsList,
                    "业务员": this.repairOrder.saleMenId
                };
                //  校验
                if (!this.checkData(true)) {
                    return;
                }

                //判断客户是否存在
                if (this.repairOrder.custName == "" && this.goodsList[0].sourceType != '3') {
                    this.$Modal.warning({
                        title: "提示",
                        content: "请选择客户!"
                    })
                    return;
                }


                for (var i = 0; i < this.goodsList.length; i++) {
                    if (this.goodsList[i].goodsEntity.goodsCode == "" || this.goodsList[i].goodsEntity.goodsCode == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行商品编码!`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.repairType == "" || this.goodsList[i].goodsEntity.repairType == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行维修类型!`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.repairWay == "" || this.goodsList[i].goodsEntity.repairWay == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行维修方式!`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.countingUnit == "" || this.goodsList[i].goodsEntity.countingUnit == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行计数单位`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.goodsNum == "" || this.goodsList[i].goodsEntity.goodsNum == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行数量!`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.weightUnit == "" || this.goodsList[i].goodsEntity.weightUnit == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行计重单位!`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.totalWeight == "" || this.goodsList[i].goodsEntity.totalWeight == null) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行总重!`
                        })
                        return false;
                    }
                    if (this.goodsList[i].goodsEntity.preRepairFee <= 0) {
                        this.$Modal.warning({
                            title: "提示",
                            content: `请输入第${i + 1}行预估维修费用!`
                        })
                        return false;
                    }
                }


                if (This.goodsList.length !== 0) {
                    Object.assign(order.goodsList, This.goodsList)
                }
                if (!order.id) {
                    console.log("进提交新增")
                    order.saveFlag = 2
                    url = contextPath + '/repairOrderController/save'
                } else {
                    console.log("进提交修改")
                    order.updateFlag = 2
                    url = contextPath + '/repairOrderController/update'
                }
                This.doFlag = false
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: JSON.stringify(order),
                    contentType: 'application/json;charset=utf-8',
                    success: function (result) {
                        if (result.code == '100100') {
                            This.$Modal.success({
                                title: "提示",
                                content: "提交成功！",
                            });
                            if(result.data.goodsList){
                                result.data.goodsList.map((item)=>{
                                    item.goodsEntity.styleName = item.goodsEntity.custStyleName
                                    item.goodsEntity.styleCustomCode = item.goodsEntity.custStyleCode
                                })
                            }
                            console.log(result)
                            Object.assign(This.repairOrder, result.data)
                            Object.assign(This.goodsList, result.data.goodsList)
                            This.repairOrder.status = 2
                            This.repairOrder.businessType = "" + This.repairOrder.businessType;

                            This.isView = true;

                            //保存附件
                            if (!$.isEmptyObject(This.repairOrder.repairOrderNo)) {
                                This.saveAccess(This.repairOrder.repairOrderNo, This.docType);
                            }

                            //是否开启附件
                            This.isEdit(This.repairOrder.status == 1 ? 'Y' : 'N');
                            This.doFlag = true
                            This.htHaveChange = false;
                        } else {
                            This.$Modal.warning({
                                title: "提示",
                                content: result.msg
                            })
                            This.doFlag = true
                        }

                    },
                    error: function (err) {
                        This.$Modal.error({
                            title: "提示",
                            content: "系统出现异常,请联系管理人员"
                        });
                        This.doFlag = true
                    }


                })
            }
            else{
                This.$Modal.warning({
                    title: "提示",
                    content: "请问重复操作此数据！"
                })
            }

        },
        //根据商品编码
        getSelectedItem(data, index) {//获取选中的那条数据
            let This = this;
            let res = data.data;
            let obj = JSON.parse(JSON.stringify(This.oneInfo));
            console.log(res)
            Object.assign(obj.goodsEntity, {
                goodsCode: res.code,//商品编码
                goodsName: res.name,//商品名称
                countingUnitId: res.countUnitId,//计数单位
                weightUnitId: res.weightUnitId,//计重单位
                countingUnit: res.countUnitId != '' ? This.unitListObj[res.countUnitId.toString()] : '',
                weightUnit: res.weightUnitId != '' ? This.unitListObj[res.weightUnitId.toString()] : '',
                styleCategoryId: res.styleCategoryId,//
                styleCustomCode: res.styleCustomCode,//
                custStyleCode: res.styleCustomCode,//
                custStyleName: res.styleName,//
                styleName: res.styleName,//
                goodsMainType: res.mainType,//
            });
            This.$set(This.goodsList, index, obj);

            //计算
            this.totalSearch = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
            this.repairOrder.totalPreRepairFee = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
        },
        getInputValue(value, index) {//获取商品编码输入框输入的值
            let This = this;
            let params = {
                categoryCustomCode: This.repairOrder.goodsType,
                field: value,
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    This.optionList = data.data;
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示",
                        content: '服务器出错啦'
                    })
                }
            })
        },
        //不输入值的时候显示全部
        getInp() {
            let This = this;
            let params = {
                categoryCustomCode: This.repairOrder.goodsType,
                field: "",
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    This.optionList = data.data;
                },
                error: function () {
                    This.$Modal.warning({
                        title: "提示",
                        content: '服务器出错啦'
                    })
                }
            })
        },
        typeInit(arr, res, val) {
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value == val) {
                    res.push(arr[i].value);
                    return true;
                }
                if (arr[i].children && arr[i].children.length > 0) {
                    if (this.typeInit(arr[i].children, res, val)) {
                        res.push(arr[i].value);
                        return true;
                    }
                }
            }
        },
        handlerClose(){
            if((!this.repairOrder.status || this.repairOrder.status == 1)&& (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(333)
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        getPreVal() {
            if(this.orderType == 'search'){
                this.totalSearch = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
            }
            this.repairOrder.totalPreRepairFee = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
        },

        //初始化获取单位
        getUnitList() {
            let This = this
            $.ajax({
                type: 'POST',
                url: contextPath + '/tbaseunit/list',
                async: false,
                success: function (result) {
                    console.log(result)
                    This.unitList = result.data;
                    This.unitList.map(item => {
                        This.unitListObj[item.id.toString()] = item.name;
                    })
                },
                error: function (err) {
                    This.$Modal.error({
                        title: "提示",
                        content: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        inInit(val) {
            if (val) {
                this.doFlag = true;
                if (this.jumpParam.type === 'update') {
                    console.log("进入修改状态！");
                } else if (this.jumpParam.type === 'query') {
                    console.log("进入查看状态");
                    let code = this.jumpParam.data
                    this.findInfoByOrderNo(code)

                } else if (this.jumpParam.type === 'add') {
                    console.log('进入新增状态');
                    //是否开启附件
                    this.isEdit('Y');
                    this.repairOrder.repairTime = new Date().format("yyyy-MM-dd HH:mm:ss");
                    this.$refs.supplier.noInitValue();
                    this.$refs.customerRef.loadCustomerList('', '');

                } else if (this.jumpParam.type === 'wait') {
                    console.log('待维修跳转到维修新增页面');
                    console.log(this.jumpParam.data);
                    this.repairOrder.status = 1
                    this.copyWait(this.jumpParam.data)
                } else if (this.jumpParam.type === 'other') {
                }
            }
        }
    },
    computed: {
        'totalPreRepairFee': function () {
            return this.repairOrder.totalPreRepairFee = this.sum(this.goodsList, 'preRepairFee').toFixed(2);
        },
        typeValue: function () {
            let temp = this.repairOrder.goodsType;
            let arr = [];
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        }
    },
    created() {
        this.getUnitList()
        window.handlerClose = this.handlerClose;
    },
    mounted() {
        this.goldColor = getCodeList("base_Condition");//加载金料成色
        this.getData();
        // this.loadProductType();
        this.repositionDropdown();
        this.repairTypeList = getCodeList("wxdj_repair_type");
        this.repairWayList = getCodeList("wxdj_repair_way");
        this.parentPramas = window.parent.params.params;
        this.openTime = window.parent.params.openTime;
        this.jumpParam = window.parent.params.params;
        this.inInit(this.jumpParam)
    }
})