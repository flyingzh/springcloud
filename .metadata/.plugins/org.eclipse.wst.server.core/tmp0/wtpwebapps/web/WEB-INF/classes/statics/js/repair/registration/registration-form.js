let vm = new Vue({
    el: '#registration-form',
    data() {
        return {
            htHaveChange:false,
            isSave:false,
            isSaveCheck:false,
            selectCustomerObj: null, //所选的客户对象
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            openTime: '',//
            isDisable: true,//控制页面始终禁用的部分
            isView: false,
            isSearchHide: true,//折叠按钮
            isShowCust: false,//控制客户弹窗组件
            tabName: 'detail',
            customerInfo: null,
            goodType: null,
            modalType: '',//审批驳回类型
            stepList: [], //审批进度条
            approvalTableData: [],
            selectedRow: '',//分录行被选中的下标
            // 基本信息初始化
            employees: [],//登记人下拉选项
            shipTypeList: [],//物流方式下拉选项
            commodityList: [],//分录行商品下拉选项
            goldColor: [],//分录行金料成色下拉选项
            repairTypeList: [],//分录行维修类型下拉选项
            repairWayList: [],//分录行维修方式下拉选项
            certificateType: [],//分录行证书类型下拉选项
            unitMap: {},//分录行单位map
            tmpCheckItem: {},
            checkListData: {//分录行必填选项验证
                goodsCode: {
                    name: '商品编码',
                    type: 'string',
                },
                repairType: {
                    name: '维修类型',
                    type: 'string',
                },
                repairWay: {
                    name: '维修方式',
                    type: 'string',
                },
                goodsNum: {
                    name: '数量',
                    type: 'number',
                    floor: 0,
                },
                totalWeight: {
                    name: '总重',
                    type: 'number',
                    floor: 2
                }
            },
            ruleValidate: {
                shipMethod: [
                    { required: true }
                ],
                repairTime: [
                    { required: true }
                ],
                saleMenId: [
                    { required: true }
                ],
            },
            addBody: {
                id: '',  //   '主键ID',
                repairRegisterNo: '',  //   '单据编号',
                goodsTypeName: '',  //   '商品类型名称',
                goodsType: '',  //   '商品类型',
                groupPath: '',  //   '分类路径',
                goodsMainType: '',  //   '商品主类型',
                organizationName: '',  //   '所属组织名称',
                organizationId: '',  //   '所属组织ID',
                custNo: '',  //   '客户编号',
                custName: '',  //   '客户名称',
                custId: '',  //   '客户名称ID',
                repairTime: '',  //   '日期',
                saleMenId: '',  //   '业务员ID',
                saleMenName: '',  //   '业务人员名称',
                shipMethod: '',  //   '物流要求',
                remark: '',  //   '备注',
                status: 1,  //   '单据状态(1 暂存，2 待审核，3 审核中，4 已审核，5 驳回)',
                businessStatus: '',  //   '业务状态(1 待质检，2 已质检)',
                dataStatus: '',  //   '数据状态(1 不可提交，2 可提交)',
                auditId: '',  //   '审核人',
                auditTime: '',  //   '审核时间',
                auditName: '',  //   '审核人姓名',
                createName: '',  //   '创建人姓名',
                createTime: '',  //   '创建时间',
                updateName: '',  //   '修改人姓名',
                updateTime: '',  //   '修改时间',
                version: '',  //   '版本号',
                num: '',  //   '数量',
                totalWeight: '',  //   '总重',
                repairGoodsList: [],//分录行
                delGoodIds: []
            },
            oneList: {
                id: '',  //   '主键ID',
                goodsLineNo: '',  //   '商品分录行',
                goodsName: '',  //   '商品名称',
                goodsCode: '',  //   '商品编码',
                commodityId: '',  //   '商品编码ID',
                goldColor: '',//金料成色
                goodsNum: '',  //   '商品数量',
                goodsNorm: '',  //   '商品规格',
                custStyleCode: '',  //   '款式类别',
                custStyleName: '',  //   '款式名称',
                styleCategoryId:"",
                goodsMainType:"",
                countingUnitId: "",
                weightUnitId:"",
                countingUnit: '',  //   '计数单位',
                weightUnit: '',  //   '计重单位',
                totalWeight: '',  //   '总重',
                goldWeight: '',  //   '金重',
                mainStoneName: '',  //   '主石名称',
                mainStoneWeight: '',  //   '主石重',
                mainStoneColor: '',  //   '主石颜色',
                mainStoneClarity: '',  //   '主石净度',
                viceStoneName: '',  //   '副石名称',
                viceStoneWeight: '',  //   '副石重',
                viceStoneNum: '',  //   '副石粒数',
                certificateType: '',  //   '证书类型',
                certificateNo: '',  //   '证书编号',
                remark: '',  //   '备注',
                checkStatus: 1,  //   '检验状态',
                checkResult: '',  //   '检验结果',
                repairType: '',  //   '维修类型',
                repairWay: '',  //   '维修方式',
                repairNum: '',  //   '维修次数',
                repairRemark: '',  //   '维修内容及要求',
                preRepairFee: '',  //   '预维修费用',
                repairFee: '',  //   '实际维修费用',
                billFee: '',  //   '结算费用',
                goodsCheckInfo: null,
            },
            comparedInfo: {
                goodsName: '',  //   '商品名称',
                goodsCode: '',  //   '商品编码',
                goldColor: '',//成色
                totalWeight: '',  //   '总重',
                goldWeight: '',  //   '金重',
                mainStoneName: '',  //   '主石名称',
                mainStoneWeight: '',  //   '主石重',
                mainStoneColor: '',  //   '主石颜色',
                mainStoneClarity: '',  //   '主石净度',
                viceStoneName: '',  //   '副石名称',
                viceStoneWeight: '',  //   '副石重',
                viceStoneNum: '',  //   '副石粒数',
            },
            goodsCheckInfo: {
                id: '',  //   '主键ID',
                repairGoodsId: '',  //   '维修商品信息ID',
                goodsLineNo: '',  //   '商品分录行',
                goodsName: '',  //   '商品名称',
                goodsCode: '',  //   '商品编码',
                commodityId: '',  //   '商品编码ID',
                goodsNum: '',  //   '商品数量',
                goodsNorm: '',  //   '商品规格',
                custStyleCode: '',  //   '款式类别',
                custStyleName: '',  //   '款式名称',
                styleCategoryId:"",
                goodsMainType:"", //商品主类型
                countingUnit: '',  //   '计数单位',
                weightUnit: '',  //   '计重单位',
                countingUnitId: "",
                weightUnitId: "",
                goldColor: '',//成色
                totalWeight: '',  //   '总重',
                goldWeight: '',  //   '金重',
                mainStoneName: '',  //   '主石名称',
                mainStoneWeight: '',  //   '主石重',
                mainStoneColor: '',  //   '主石颜色',
                mainStoneClarity: '',  //   '主石净度',
                viceStoneName: '',  //   '副石名称',
                viceStoneWeight: '',  //   '副石重',
                viceStoneNum: '',  //   '副石粒数',
                 certificateType: '',  //   '证书类型',
                 certificateNo: '',  //   '证书编号',
                 repairType: '',  //   '维修类型',
                 repairWay: '',  //   '维修方式',
                 repairNum: '',  //   '维修次数',
                 repairRemark: '',  //   '维修内容及要求',
                 checkType: 1,  //   '检验类型(1 维修前检验 ，2 维修后检验  )',
                // remark: '',  //   '备注',
                // checkStatus: '',  //   '检验状态',
                // checkResult: '',  //   '检验结果',
                // checkType: '',  //   '检验类型(1 维修前检验 ，2 维修后检验  )',
                // checkTime: '',  //   '检验时间'
            }
        }
    },
    methods: {
        hideSearch() {

        },
        // 数字校验
        clearNoNum(item, type, floor) {
            return htInputNumber(item, type, floor);
        },
        // 商品组件下拉框样式
        repositionDropdown() {
            return repositionDropdownOnSroll('testTableWrap', 'goods');
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
        // 计算列合计
        sum(list, key) {
            return list.reduce((total, el) => {
                if (el[key] === '' || el[key] === null || el[key] == undefined) {
                    return 0 + total;
                };
                if (isNaN(el[key])) {
                    this.$Modal.warning({
                        content: '请输入数字'
                    });
                    el[key] = ''
                    return 0 + total;
                }
                return parseFloat(el[key]) + total;
            }, 0)
        },
        /*****************按钮栏开始********************/
        // 保存
        save() {
            this.isSave = true;
            let obj = {
                "客户": this.addBody.custName,
                "日期": this.addBody.repairTime,
                "登记人": this.addBody.saleMenId,
                "商品类型": this.addBody.goodsType,
                "物流方式": this.addBody.shipMethod,
            };
            if ((!this.checkForm(obj, false))) {
                this.addBody.dataStatus = 1
            } else if (htValidateRow(this.addBody.repairGoodsList, this.checkListData, false)) {
                this.addBody.dataStatus = 1
            }else if (this.addBody.repairGoodsList.length === 0) {
                this.addBody.dataStatus = 1
            }  else {
                this.addBody.dataStatus = 2
            }
            console.log(this.addBody.dataStatus);
            let url = "/tRepairRegister/save";
            if (this.addBody.id) {
                url = "/tRepairRegister/update";
            }
            this.submitForm(url);
        },
        submitForm(url) {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + url,
                contentType: 'application/json',
                data: JSON.stringify(this.addBody),
                dataType: "json",
                success: function (result) {
                    if (result.code === '100100' && result.data) {
                        let msg = "保存成功";
                        if(that.addBody.status === 2 ){
                            msg = "提交成功";
                        }
                        that.$Modal.success({
                            title: "提示",
                            okText: "确定",
                            content: msg,
                        });
                        let data = result.data;
                        that.saveAccess(data.id, 'REPAIR_REGISTER');
                        that.addBody = data;
                        that.htHaveChange = false;
                        that.$refs.customerRef.loadCustomerList(that.addBody.custName, that.addBody.custId);
                        if (that.addBody.status !== 1) {
                            that.isView = true;
                            //附件可上传
                            that.isEdit('N');
                        }else {
                            //附件可上传
                            that.isEdit('Y');
                        }
                        if (that.addBody.id) {
                            that.getAccess(that.addBody.id, 'REPAIR_REGISTER');
                        }
                    }else{
                        let msg = "保存失败";
                        if(that.addBody.status === 2 ){
                            msg = "提交失败";
                            that.addBody.status = 1;
                            //附件可上传
                            that.isEdit('Y');
                        }
                        vm.$Modal.error({
                            title: "提示",
                            okText: "确定",
                            content: msg
                        });
                    }
                    that.isSave = false;
                },
                error: function () {
                    that.isSave = false;
                    that.$Modal.error('服务器出错啦');
                }
            })

        },
        // 提交
        submit(name) {
            // let obj = {
            //     "客户": this.addBody.custName,
            //     "日期": this.addBody.repairTime,
            //     "登记人": this.addBody.saleMenId,
            //     "商品类型": this.addBody.goodsType,
            //     "物流方式": this.addBody.shipMethod,
            // };
            // if ($('form').valid() === false) {
            //     this.$Modal.warning({
            //         title: '提示信息',
            //         content: '<p>请填写必填项!</p >'
            //     });
            //     return;
            // } else {
            //     if (!this.checkForm(obj, true)) return;
            // }
            this.isSave = true;
            let isCommodityPass = this.$refs.commodityType.submit();
            let isCustomerPass =  this.$refs.customerRef.submit();
            let isFormPass = '';
            this.$refs[name].validate((valid) => {
                if (valid) {
                    isFormPass = true;
                } else {
                    isFormPass = false;
                }
            });
            if (!isCommodityPass || !isCustomerPass || !isFormPass) {
                this.isSave = false;
                return;
            }
            if (htValidateRow(this.addBody.repairGoodsList, this.checkListData, true)){
                this.isSave = false;
                return;
            }
            if (this.addBody.repairGoodsList.length === 0) {
                this.$Modal.warning({
                    title: '提示信息',
                    content: '<p>分录行不能为空!</p >'
                });
                this.isSave = false;
                return;
            }
            this.addBody.dataStatus = 2;
            this.addBody.status = 2;
            this.addBody.businessStatus = 1;
            let url = "/tRepairRegister/save";
            if (this.addBody.id) {
                url = "/tRepairRegister/update";
            }
            this.submitForm(url);
        },
        check() {
            console.log(this.addBody);
            this.isSaveCheck = true;
            this.addBody.repairGoodsList.map(el => {
                if (el.goodsCheckInfo === null) {
                    el.checkStatus = 1
                } else {
                    let obj = {
                        goldColor: '',//成色
                        totalWeight: '',  //   '总重',
                        goldWeight: '',  //   '金重',
                        mainStoneName: '',  //   '主石名称',
                        mainStoneWeight: '',  //   '主石重',
                        mainStoneColor: '',  //   '主石颜色',
                        mainStoneClarity: '',  //   '主石净度',
                        viceStoneName: '',  //   '副石名称',
                        viceStoneWeight: '',  //   '副石重',
                        viceStoneNum: '',  //   '副石粒数',
                    };
                    for (var key in obj) {
                        for (var i in el.goodsCheckInfo) {
                            if (key === i) {
                                obj[key] = el.goodsCheckInfo[key];
                            }
                        }
                    }
                    console.log(obj)
                    for (var key in obj) {
                        if (!obj[key]) {
                            el.checkStatus = 1;
                            console.log(key)
                            break;
                        }
                        el.checkStatus = 2;
                    }

                }
            });
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + "/tRepairRegister/saveGoodsCheckInfo",
                contentType: 'application/json',
                data: JSON.stringify(that.addBody.repairGoodsList),
                dataType: "json",
                success: function (data) {
                    console.log(data);
                    if (data.code === '100100' && data.data) {
                        that.$Modal.success({
                            title: "提示",
                            okText: "确定",
                            content: "检验信息保存成功!",
                        });
                        that.addBody.repairGoodsList = data.data;
                        that.goodsCheckInfo = data.data[that.selectedRow].goodsCheckInfo;
                    }else{
                        that.$Modal.error({
                            title: "提示",
                            okText: "确定",
                            content: "检验信息保存失败!"
                        });

                        that.goodsCheckInfo = that.addBody.repairGoodsList[that.selectedRow].goodsCheckInfo;
                    }
                    that.isSaveCheck = false;
                },
                error: function () {
                    that.isSaveCheck = false;
                    that.$Modal.error('服务器出错啦');
                }
            })

        },
        // 审核
        approval(value) {
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        // 驳回
        reject(value) {
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },

        /*****************按钮栏结束********************/
        /****************** 基本信息部分开始***************/
        // 商品类型选择时触发
        changeProductType(e) {
            let res = e.value === this.addBody.goodsType;
            if (!res) {
                this.addBody.repairGoodsList = [];
            }
            this.addBody.goodsType = e.value;
            this.addBody.goodsTypeName = e.label;
            this.addBody.groupPath = e.__value.replace(/\,/g, '-');
            //更改分录行默认下拉列表
            this.htTestChange();
            this.getCommodityList();
        },
        // 选取业务员
        getSaleMan(e) {
            this.addBody.saleMenName = e.label;
        },

        closeCustomer() {
            let rows = this.selectCustomerObj;
            if(rows){
                this.addBody.custId = rows.id;
                this.addBody.custNo = rows.code;
                this.addBody.custName = rows.name;
            }
            this.showCustomer = false;
        },

        /****************** 基本信息部分结束***************/
        /*******************审核信息开始***********/
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                let data = res.result.data;
                This.addBody.status = data.status;
                if (This.addBody.status === 1) {
                    This.isView = false;
                    //附件可上传
                    This.isEdit('Y');
                }
                if(This.addBody.status === 4) {
                    This.addBody.auditName = data.auditName;
                    This.addBody.auditId = data.auditId;
                    This.addBody.auditTime = data.auditTime;
                }
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
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
            if((!this.addBody.status || this.addBody.status == 1)&& (this.htHaveChange || accessVm.htHaveChange)){
                this.$nextTick(()=>{
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type){
            if(type === 'yes'){//提交数据
                this.saveClick(1);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        /*******************审核信息结束***********/
        /*******************分录行部分开始*********************/
        // 分录行选中行
        selectedTr(index) {
            this.selectedRow = index;
        },

        // 新增行
        addRow(list, obj) {
            if(this.addBody.status !== 1){
                return;
            }
            if (!this.addBody.goodsType) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择商品类型!"
                });
                return;
            }
            list.push(Object.assign({}, obj, { options: this.commodityList }))
        },
        // 删除行
        delRow(list, selected) {
            if(this.addBody.status !== 1){
                return;
            }
            if (list[selected].id) {
                if(this.addBody.delGoodIds === null){
                    this.addBody.delGoodIds = [];
                }
                this.addBody.delGoodIds.push(list[selected].id);
            }
            list.splice(selected, 1);
            this.htHaveChange = true;
            this.selectedRow = '';
        },
        // 选择商品输入编码
        getInputValue(value, index) {//获取输入框输入的值
            let that = this;
            let params = {
                categoryCustomCode: that.addBody.goodsType,
                field: value, //value, A11  AABc009
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code === '100100' && data.data) {
                        that.$set(that.addBody.repairGoodsList[index], 'options', data.data);
                    }
                },
                error: function () {
                    that.$Modal.error('服务器出错啦');
                }
            })
        },
        getSelectedItem(data, index) {
            let that = this;
            let res = data.data;
            let options = that.addBody.repairGoodsList[index].options;
            let newVal = {};
            Object.assign(newVal, that.oneList, {
                goodsNo: res.code,
                goodsName: res.name,
                goodsCode: res.code,
                commodityId: res.id,
                countingUnitId: res.countUnitId,
                weightUnitId: res.weightUnitId,
                countingUnit:  that.unitMap[res.countUnitId],
                weightUnit: that.unitMap[res.weightUnitId],
                styleCategoryId:res.styleCategoryId,
                custStyleCode: res.styleCustomCode,
                custStyleName:res.styleName,
                goodsMainType: res.mainType,
                options: options
            });
            if (that.addBody.repairGoodsList[index].id) {
                if (that.addBody.delGoodIds == undefined) {
                    that.addBody.delGoodIds = [];
                }
                that.addBody.delGoodIds.push(that.addBody.repairGoodsList[index].id);
            }
            that.$set(that.addBody.repairGoodsList, index, newVal);
        },
        //分录行差异对比跳转页签
        changeTab(item) {
            if (!(this.addBody.status !== 1)) {
                return;
            }
            this.tmpCheckItem = item;
            this.tabName = "difference";
            this.comparedInfo = {
                goodsName: item.goodsName,  //   '商品名称',
                goodsCode: item.goodsCode,  //   '商品编码',
                goldColor: item.goldColor,//成色
                totalWeight: item.totalWeight,  //   '总重',
                goldWeight: item.goldWeight,  //   '金重',
                mainStoneName: item.mainStoneName,  //   '主石名称',
                mainStoneWeight: item.mainStoneWeight,  //   '主石重',
                mainStoneColor: item.mainStoneColor,  //   '主石颜色',
                mainStoneClarity: item.mainStoneClarity,  //   '主石净度',
                viceStoneName: item.viceStoneName,  //   '副石名称',
                viceStoneWeight: item.viceStoneWeight,  //   '副石重',
                viceStoneNum: item.viceStoneNum,  //   '副石粒数',
            };
            if (!item.goodsCheckInfo) {
                this.goodsCheckInfo = {
                    id: '',  //   '主键ID',
                    repairGoodsId: item.id,  //   '维修商品信息ID',
                    goodsLineNo: item.goodsLineNo,  //   '商品分录行',
                    goodsName: item.goodsName,  //   '商品名称',
                    goodsCode: item.goodsCode,  //   '商品编码',
                    commodityId:item.commodityId,  //   '商品编码ID',
                    goodsNum:item.goodsNum,  //   '商品数量',
                    goodsNorm:item.goodsNorm,  //   '商品规格',
                    custStyleCode:item.custStyleCode,  //   '款式类别',
                    custStyleName:item.custStyleName,  //   '款式名称',
                    styleCategoryId:item.styleCategoryId,
                    goodsMainType:item.goodsMainType,
                    countingUnit:item.countingUnit,  //   '计数单位',
                    weightUnit:item.weightUnit,  //   '计重单位',
                    countingUnitId: item.countingUnitId,
                    weightUnitId: item.weightUnitId,
                    goldColor: item.goldColor,//成色
                    totalWeight: item.totalWeight,  //   '总重',
                    goldWeight: item.goldWeight,  //   '金重',
                    mainStoneName: item.mainStoneName,  //   '主石名称',
                    mainStoneWeight: item.mainStoneWeight,  //   '主石重',
                    mainStoneColor: item.mainStoneColor,  //   '主石颜色',
                    mainStoneClarity: item.mainStoneClarity,  //   '主石净度',
                    viceStoneName: item.viceStoneName,  //   '副石名称',
                    viceStoneWeight: item.viceStoneWeight,  //   '副石重',
                    viceStoneNum: item.viceStoneNum,  //   '副石粒数',
                    certificateType: item.certificateType,  //   '证书类型',
                    certificateNo: item.certificateNo,  //   '证书编号',
                    repairType: item.repairType,  //   '维修类型',
                    repairWay: item.repairWay,  //   '维修方式',
                    repairNum: item.repairNum,  //   '维修次数',
                    repairRemark: item.repairRemark,  //   '维修内容及要求',
                    checkType:1
                };
                item.goodsCheckInfo = this.goodsCheckInfo;
            } else {
                this.goodsCheckInfo = item.goodsCheckInfo;
            }
        },
        // 初始化
        //分录行页签跳转
        showTab() {
            if (this.tabName = "difference") {
                this.tabName = "detail";
                this.comparedInfo = {
                    goodsName: '',  //   '商品名称',
                    goodsCode: '',  //   '商品编码',
                    goldColor: '',//成色
                    totalWeight: '',  //   '总重',
                    goldWeight: '',  //   '金重',
                    mainStoneName: '',  //   '主石名称',
                    mainStoneWeight: '',  //   '主石重',
                    mainStoneColor: '',  //   '主石颜色',
                    mainStoneClarity: '',  //   '主石净度',
                    viceStoneName: '',  //   '副石名称',
                    viceStoneWeight: '',  //   '副石重',
                    viceStoneNum: '' //   '副石粒数',
                },
                    this.goodsCheckInfo = {
                        id: '',  //   '主键ID',
                        repairGoodsId: '',  //   '维修商品信息ID',
                        goodsLineNo: '',  //   '商品分录行',
                        goodsName: '',  //   '商品名称',
                        goodsCode: '',  //   '商品编码',
                        goldColor: '',//成色
                        totalWeight: '',  //   '总重',
                        goldWeight: '',  //   '金重',
                        mainStoneName: '',  //   '主石名称',
                        mainStoneWeight: '',  //   '主石重',
                        mainStoneColor: '',  //   '主石颜色',
                        mainStoneClarity: '',  //   '主石净度',
                        viceStoneName: '',  //   '副石名称',
                        viceStoneWeight: '',  //   '副石重',
                        viceStoneNum: '',  //   '副石粒数',
                    }
            }
        },
        getCheckResult() {
            this.addBody.repairGoodsList[this.selectedRow].goodsCheckInfo.checkResult = this.addBody.repairGoodsList[this.selectedRow].checkResult;
        },
        /*******************分录行部分结束*********************/
        /*******************初始化数据开始******************/
        // 获取基本信息登记人
        getEmployees() {
            var This = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    if (r.code === "100100") {
                        This.employees = r.data.employees; //加载当前公司下面所有的员工
                    }
                },
                error: function (err) {
                    This.$Modal.error({
                        context: "系统出现异常,请联系管理人员"
                    });
                },
            })
        },
        // 初始化商品单位
        getUnit() {
            let that = this;
            $.ajax({
                type: 'post',
                url: contextPath + '/tbaseunit/list',
                dataType: 'json',
                success(res) {
                    if (res.code === '100100') {
                        let data = res.data;
                        data.map(item => {
                            let keyStr = item.id;
                            let value = item.name;
                            that.unitMap[keyStr] = value;
                        })
                    }
                },
                error() {
                    that.$Message.warning('服务器报错')
                }
            })
        },
        // 初始化分录行商品下拉的值
        getCommodityList() {
            let This = this;
            let params = {
                categoryCustomCode: This.addBody.goodsType,
                field: '',
                limit: ''
            };
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommodity/findByType',
                data: params,
                dataType: "json",
                success: function (data) {
                    if (data.code !== "100100") {
                        This.$Modal.error({
                            content: data.msg,
                        });
                        return;
                    }
                    This.commodityList = data.data;
                },
                error: function () {
                    this.$Modal.error({
                        content: "网络异常,请联系技术人员！",
                    })
                }
            })
        },
        htTestChange(){
            this.htHaveChange = true;
        }
        /*******************初始化数据结束******************/
    },
    computed: {
        totalNum: function () {
            return this.addBody.num = this.sum(this.addBody.repairGoodsList, 'goodsNum')
        },
        totalWeight: function () {
            return this.addBody.totalWeight = this.sum(this.addBody.repairGoodsList, 'totalWeight')
        },
    },
    filters: {
        result: function (value) {
            if(value===1){
                return 'N'
            }else if( value ===2){
                return "Y"
            }else{
                return ''
            }
        }
    },
    mounted() {
        // $('form').validate();
        this.repositionDropdown();
        window.handlerClose = this.handlerClose;
        this.openTime = window.parent.params.openTime;
        /*******数据初始化开始*****/
        this.getEmployees();//获取基本信息登记人
        this.getUnit();//获取分录行商品单位
        this.repairTypeList = getCodeList("wxdj_repair_type");
        this.repairWayList = getCodeList("wxdj_repair_way");
        this.shipTypeList = getCodeList("jxc_jxc_wlfs");//获取物流方式下拉数据
        this.getCommodityList();//获取分录行商品下拉数据
        this.goldColor = getCodeList('base_Condition');//获取分录行金料成色下拉数据
        this.certificateType = getCodeList('base_certificate_type');//获取分录行证书下拉数据
        /*******数据初始化结束*****/
        let param = window.parent.params.params;
        if (param.type === 'add') {
            this.$refs.customerRef.loadCustomerList('', '');
            this.addBody.organizationName = layui.data('user').currentOrganization.orgName;
            this.isEdit('Y');
            this.addBody.repairTime = new Date().format("yyyy-MM-dd hh:mm:ss");
        }
        let repairRegisterNo = param.repairRegisterNo;
        let This= this;
        if (repairRegisterNo) {
            $.ajax({
                type: "POST",
                url: contextPath + "/tRepairRegister/info/" + repairRegisterNo,
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        This.addBody = result.data;
                        This.$refs.customerRef.loadCustomerList(This.addBody.custName, This.addBody.custId);
                        if (This.addBody.status !== 1) {
                            This.isView = true;
                            //附件可上传
                            vm.isEdit('N');
                        }else {
                            //附件可上传
                            vm.isEdit('Y');
                        }
                        if (vm.addBody.id) {
                            vm.getAccess(vm.addBody.id, 'REPAIR_REGISTER');
                        }
                    } else {
                        layer.alert(result.msg, { icon: 0 });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            });

        }


    }
})