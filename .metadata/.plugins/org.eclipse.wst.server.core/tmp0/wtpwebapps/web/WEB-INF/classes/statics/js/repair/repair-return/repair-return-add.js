let repairOrder = new Vue({
    el: "#repair-order",
    data() {
        return {
            htHaveChange:false,
            ruleValidate: {
                repairTime: [
                    {required: true}
                ],
                goodsType: [
                    {required: true}
                ],
                saleMenId: [
                    {required: true}
                ],
                shipMethod: [
                    {required: true}
                ],
                custName: [
                    {required: true}
                ]
            },
            //维系类型  方式
            repairTypeList:"",
            repairWayList:"",
            //是否锁死
            showTemp: false,
            //质检结果
            checkOrder: "1",
            carList: [],
            //查看数据
            openName: "",
            openTime: "",

            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            addBody: {
                totalNum: "",
                totalWeight: "",
                id: "",
                //单据编号
                repairReturnNo: "",
                //日期
                repairTime: "",
                //商品类型名称
                goodsTypeName: "",
                //商品类型
                goodsType: "",
                //分类路径
                groupPath: "",
                //商品主类型
                goodsMainType: "",
                //所属组织名称
                organizationName: "",
                //所属组织ID
                organizationId: "",
                //客户编号
                custNo: "",
                //客户名称
                custName: "",
                //客户名称ID
                custId: "",
                //业务员ID
                saleMenId: "",
                //业务员名称
                saleMenName: "",
                //物流要求
                shipMethod: "",
                //备注
                remark: "",
                //单据状态(1 暂存，2 待审核，3 审核中，4 已审核，5 驳回)
                status: 1,
                dataStatus: "",//数据状态(1 不可提交，2 可提交)
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
                ids: [], /*明细id数组*/
            },
            productTypeList: [],
            isDisable: true,
            isView: false,
            isHideSearch: true,
            isHideList: true,
            goodsInfos: [],
            temp: 'detail',
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
            //职员
            employees: [],
            //常量信息
            Constant: {
                //单据类型-销售定金单
                docType: 'REPAIR_RETURN'
            }
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
        //获取职员信息
        getData() {
            var This = this;
            $.ajax({
                type: "post",
                async: false,
                url: contextPath + '/tpurchasecollectgoods/data',
                dataType: "json",
                success: function (r) {
                    This.addBody.organizationId = r.data.orgId;//加载当前组织id
                    This.addBody.organizationName = r.data.orgName; //加载当前组织姓名
                    This.employees = r.data.employees; //加载当前公司下面所有的员工
                },
                error: function () {
                    console.log('服务器出错啦');
                }
            })
        },
        //加载商品类型数据
        loadProductType(parentParams) {
            var That = this;
            $.ajax({
                type: 'post',
                async: true,
                traditional: true,
                dataType: 'json',
                data: {ids: parentParams.allInfo[1]},
                url: contextPath + '/repairReturn/finRepairGoods',
                success: function (d) {
                    if (d.code == "100100") {
                        repairOrder.goodsInfos = d.data;
                        //附件可上传
                        That.isEdit('Y');
                        if (!$.isEmptyObject(That.addBody.repairReturnNo) && That.addBody.repairReturnNo != undefined) {
                            That.getAccess(That.addBody.repairReturnNo, That.Constant.docType);
                        }
                    } else {
                        console.log(d.msg);
                    }

                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },

        /*保存*/
        save() {
            let That = this;
            $.ajax({
                type: 'post',
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(this.addBody),
                url: contextPath + '/repairReturn/save',
                success: function (d) {
                    if (d.code == "100100") {
                        //保存附件
                        if (!$.isEmptyObject(That.addBody.repairReturnNo)) {
                            That.saveAccess(That.addBody.repairReturnNo, That.Constant.docType);
                        }

                        That.addBody = d.data;
                        That.htHaveChange = false;
                        repairOrder.$Modal.success({
                            content: "保存成功"
                        })
                    } else {
                        repairOrder.addBody = d.data;
                        repairOrder.$Modal.warning({
                            content: "保存失败"
                        })
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
        },


        /*提交*/
        saveSubmit() {
            /**未保存直接提交或者先保存再提交*/
            var That = this;
            var falg = 1;
            if (this.addBody.repairReturnNo == null) {
                falg = 2;
            }
            let temp = true;
            this.$refs.formValidate.validate((valid) => {
                if (valid == false) {
                    temp = false;
                }
            })
            if (!temp) {
                return;
            }
            $.ajax({
                type: 'post',
                async: false,
                traditional: true,
                dataType: 'json',
                contentType: "application/json;charset=utf-8",
                data: JSON.stringify(this.addBody),
                url: contextPath + '/repairReturn/saveSubmit',
                success: function (d) {
                    if (d.code == "100100") {
                            repairOrder.addBody = d.data;
                            repairOrder.$Modal.success({
                                content: "提交成功！"
                            })
                            if (repairOrder.addBody.status > 1) {
                                //锁死
                                repairOrder.showTemp = true;
                            }
                            //保存附件
                            if (!$.isEmptyObject(That.addBody.repairReturnNo)) {
                                That.saveAccess(That.addBody.repairReturnNo, That.Constant.docType);
                            }
                            That.htHaveChange = false;
                            //是否开启附件
                            That.isEdit(repairOrder.addBody.status == 1 ? 'Y' : 'N');

                    } else if (d.code == "100101") {


                        if (d.data.SaleMenName != null) {
                            repairOrder.$Modal.warning({
                                content: d.data.SaleMenName
                            })
                        }

                        if (d.data.ShipMethod != null) {
                            repairOrder.$Modal.warning({
                                content: d.data.ShipMethod
                            })
                        }

                        if (d.data.RepairTime != null) {
                            repairOrder.$Modal.warning({
                                content: d.data.RepairTime
                            })
                        }
                        repairOrder.$Modal.warning({
                            content: d.data+d.msg
                        })

                    } else {
                        repairOrder.$Modal.warning({
                            content: "系统异常，请联系相关技术人员"
                        })
                    }
                },
                error: function (e) {
                    console.log(e);
                }
            });
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
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                let data = res.result.data;
                This.addBody.status = data.status;
                if (This.addBody.status === 1) {
                    //驳回后信息可编辑
                    This.showTemp = false;
                }
                //是否开启附件
                This.isEdit(repairOrder.addBody.status == 1 ? 'Y' : 'N');
                This.addBody.auditTime = data.auditTime;
                This.addBody.auditName = data.auditName;
                This.addBody.auditId = data.auditId;
            } else if (res.result.code === '100515') {
                if (This.modalType === 'reject') {
                    // 修改订单状态为 1 todo
                } else {
                    // 修改订单状态为 4 todo
                }
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },


        // 登记员
        changeEmp(e) {
            if (e != undefined) {
                this.addBody.saleMenId = e.value;
                var le = e.label;
                this.addBody.saleMenName = le.substring(le.lastIndexOf("-") + 1, le.length);
            }

        },
        /*差异对比*/
        otherInfo(index) {
            this.temp = 'other';
            let arr = [];
            arr.push(this.goodsInfos[index].repairGoodsEntity.id)
            $.ajax({
                type: 'post',
                async: true,
                traditional: true,
                dataType: 'json',
                data: {ids: arr},
                url: contextPath + '/repairReturn/finRepairGoods',
                success: function (d) {
                    console.log(d);
                    if (d.data.length > 0) {
                        for (var i = 0; i < d.data.length; i++) {
                            repairOrder.comparedInfo = d.data[i].repairGoodsEntity;
                            repairOrder.goodsCheckInfo = d.data[i].repairGoodsCheckEntity;
                            repairOrder.checkOrder = d.data[i].repairGoodsCheckEntity.checkResult;
                        }
                    }

                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })

        },
        act(val) {
            //显示分录行
            if (val === 'detail') {
                this.temp = 'detail';
            }
        },


        //计算列合计
        sum(list, key) {
            let sum = 0;
            if (list != null) {
                list.map((item) => {
                    if (item.repairGoodsEntity[key] == undefined) {
                        item.repairGoodsEntity[key] = 0;
                    }
                    sum += parseFloat(item.repairGoodsEntity[key]);
                })
            }

            return sum;
        },
        //生成新增
        view(parentParams) {
            this.addBody.custNo = parentParams.allInfo[2][6];
            this.addBody.custId = parentParams.allInfo[2][4];
            this.addBody.custName = parentParams.allInfo[2][5];
            this.addBody.goodsTypeName = parentParams.allInfo[2][1];
            this.addBody.goodsType = parentParams.allInfo[2][0];
            this.addBody.groupPath = parentParams.allInfo[2][2];
            this.addBody.goodsMainType = parentParams.allInfo[2][3];
            this.addBody.repairTime = new Date().format("yyyy-MM-dd HH:mm:ss");


        },
        /*列表点击单号查看 */
        info(parentParams) {
            let That = this;
            $.ajax({
                type: 'post',
                async: true,
                traditional: true,
                dataType: 'json',
                data: {repaiReturnNo: parentParams.allInfo[1]},
                url: contextPath + '/repairReturn/info',
                success: function (d) {
                    if (d.data.obj != null) {
                        repairOrder.addBody = d.data.obj;
                    }
                    if (d.data.obj != null) {
                        repairOrder.addBody = d.data.obj;
                        //判断单据状态
                        if (repairOrder.addBody.status > 1) {
                            //锁死
                            repairOrder.showTemp = true;
                        }

                        That.isEdit(repairOrder.addBody.status == 1 ? 'Y' : 'N');
                        if (!$.isEmptyObject(That.addBody.repairReturnNo) && That.addBody.repairReturnNo != undefined) {
                            That.getAccess(That.addBody.repairReturnNo, That.Constant.docType);
                        }

                    }
                    if (d.data.repairGoodsVoList.length>0) {
                        repairOrder.goodsInfos = d.data.repairGoodsVoList;
                        repairOrder.checkOrder = d.data.repairGoodsVoList[0].repairGoodsEntity.checkResult;
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        //退出
        exit(close) {
            console.log(close,this.openTime)
            if (close === true) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
                return;
            }
            if (this.handlerClose()) {
                window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
            }
        },
        handlerClose() {
            console.log(this.addBody.status)
            if ((!this.addBody.status || this.addBody.status == 1)&& (this.htHaveChange || accessVm.htHaveChange)) {
                this.$nextTick(() => {
                    this.$refs.closeModalRef.showCloseModal();
                });

                return false;
            }

            return true;
        },
        closeModal(type) {
            console.log(type)
            if (type === 'yes') {//提交数据
                this.save();
                this.exit(true);
            }else if(type === 'no'){//关闭页面
                this.exit(true);
            }
        },
        htTestChange(){
            this.htHaveChange = true;
            console.log(1)
        }
    },
    computed: {
        totalNum: function () {
            return this.addBody.totalNum = parseInt(this.sum(this.goodsInfos, 'goodsNum').toFixed(2));
        },
        totalWeight: function () {
            return this.addBody.totalWeight = this.sum(this.goodsInfos, 'goldWeight').toFixed(2);
        },
        typeValue: function () {
            let temp = this.addBody.goodsType;
            let arr = [];
            console.log(this.productTypeList, arr, temp)
            this.typeInit(this.productTypeList, arr, temp);
            return arr.reverse();
        }
    },
    mounted() {
        this.carList = getCodeList("jxc_jxc_wlfs");
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.repairTypeList = getCodeList("wxdj_repair_type");
        this.repairWayList = getCodeList("wxdj_repair_way");
        console.log(this.repairTypeList,this.repairWayList)
        window.handlerClose = this.handlerClose;
        // this.loadProduct();
        this.getData();
        let parentParams = window.parent.params.params;
        console.log(parentParams)
        if (parentParams.allInfo[0] == 1) {
            this.loadProductType(parentParams);
            this.view(parentParams);
            this.addBody.ids = parentParams.allInfo[1];
        } else if (parentParams.allInfo[0] == 2) {
            this.info(parentParams);
            console.log(parentParams.allInfo)
        }
    }
})