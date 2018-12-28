new Vue({
    el: '#recoveryList',
    data() {
        let This = this;
        return {
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            openName:'',
            isShow: false,
            isEdit: false,
            reload: false,
            customerModel: {}, //所选的客户对象
            openTime: "",
            isHideSearch: true,
            isHideList: true,
            isHide: true,
            selected: [],
            dataValue: [],
            repairInOrderEntity:{
                status:'',
                inOrderNo:'',
            },
            body: {
                inOrderNo: '',//单据编号
                custName: '',//客户
                custId: '',//客户
                businessType:'',//业务类型
                supplierId:'',//维修厂家
                supplierName:'',//维修厂家
                goodsType:'',
                goodsTypeName:'',//商品类型
                groupPath:'',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            },
            data_config: {
                url: contextPath + "/repairInOrderController/list",
                colNames: ['id','数据状态', '单据编号', '日期','商品类型', '单据状态', '业务状态', '业务类型','客户', '维修厂家', '商品件数', '业务员'],
                colModel: [
                    {name: 'id', index: 'id', hidden: true},
                    {name: 'dataStatus', hidden: true},
                    {
                        name: 'inOrderNo', index: 'inOrderNo', width: 250, align: "left",
                        formatter: function (value, grid, rows, state) {
                            let cssClass = ".detail" + value;
                            $(document).off('click', cssClass).on('click', cssClass, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'createTime', index: 'createTime', width: 240, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 200, align: "left",},
                    {
                        name: 'status', index: 'status', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "暂存" : value === 2 ?
                                "待审核" : value === 3 ? "审核中" : value === 4 ?
                                    "已审核" : "驳回";
                            ;
                        }
                    },
                    {name: 'businessStatus', index: 'businessStatus', align: "left", width: 200,
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "待质检" : "已质检";
                        }},
                    {name: 'businessType', index: 'businessType', align: "left", width: 200,
                        formatter: function (value, grid, rows, state) {
                            return value === 1 ? "外部维修" : value === 2 ? "内部维修" : "";
                        }},
                    {name: 'custName', index: 'custName', align: "left", width: 200,},
                    {name: 'supplierName', index: 'supplierName', align: "left", width: 200,},
                    {name: 'num', index: 'num', align: "right", width: 200,},
                    {name: 'saleMenName', index: 'saleMenName', align: "left", width: 200,},
                ],
            },
        }
    },
    methods: {
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
        // 选择商品类型
        changeProductType(e) {
            this.body.goodsType = e.value;
            this.body.goodsTypeName = e.label;
            this.body.groupPath = e.__value.replace(/\,/g, '-');
        },
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        search() {
            this.reload = !this.reload;
        },
        closeCustomer() {
            if(this.customerModel){
                this.body.custName = this.customerModel.name;
            }
        },
        closeSupplier(id,code,name) {
            this.body.supplierName = name;
        },
        clear() {
            this.$refs.shopType.body.typeValue="";
            this.$refs.operationType.reset();
            this.$refs.repairList.clear();
            this.$refs.customerRef.clear();
            this.$nextTick(function(){
                this.body.businessType = "";
            });
            this.body = {
                inOrderNo: '',//单据编号
                custName: '',//客户
                businessType:'',//业务类型
                supplierName:'',//维修厂家
                goodsType:'',
                goodsTypeName:'',//商品类型
                groupPath:'',
                startTime: '',
                endTime: '',
                isDel: 1,//是否删除1-未删除，0-已删除
            };
            this.dataValue = [];
        },
        //跳转详情页面
        detailClick(data) {
            let inOrderNo = data.rows.inOrderNo;
            console.log(data.rows.inOrderNo);
            window.parent.activeEvent({
                name: '维修收回单-查看',
                url: contextPath+'/repair/recovery/recovery-form.html',
                params: {inOrderNo:inOrderNo,type:'update'}
            });
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
            let ids = [];
            var count = 0;
            this.selected.forEach((item)=>{
                if(item.status === 1){
                    ids.push(item.id);
                    count++;
                }
            });
            if(this.selected.length!==count){
                this.$Modal.warning({
                    title: "提示",
                    content: "只有单据状态为暂存的单即可删除!"
                });
                return false;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '<p>是否删除信息？</p>',
                onOk: () => {
                    $.ajax({
                        type: "POST",
                        url: contextPath + '/repairInOrderController/deleteBatch',
                        data: JSON.stringify(ids),
                        dataType: "json",
                        contentType: 'application/json; charset=utf-8',
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
            let code = this.selected[0].inOrderNo;
            if (!$.isEmptyObject(code) && code != undefined) {
                window.parent.activeEvent({
                    name: '销售结算单-修改',
                    url: contextPath + '/sale/bill/sale-bill-add.html',
                    params: {inOrderNo: code, type: 'update'}
                });
            }
        },
        // 新增
        add(){
            window.parent.activeEvent({
                name: '维修收回单-新增',
                url: contextPath + '/repair/recovery/recovery-form.html',
                params: { type: 'add'}
            });
        },
        //提交
        submit() {
            console.log(this.selected);
            let This = this;
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
            if (this.selected[0].status !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据之前已经提交过了,不能再提交!"
                });
                return false;
            }
            // 判断所选数据是否通过基本校验
            if (this.selected[0].dataStatus === 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "单据信息不完整,请保存完整!"
                });
                return false;
            }
            //更新数据
            this.selected[0].status = 2;
            This.updateData(this.selected[0],"提交");
        },
        //审批
        approval(value) {
            console.log(this.selected);
            let This = this;
            if (!ht.util.hasValue(this.selected, "array")) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先选择一条记录"
                });
                return false;
            }
            if (this.selected.length > 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "最多只能选择一条记录"
                });
                return false;
            }
            if (this.selected[0].status === 4) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据已审核通过!"
                });
                return false;
            }
            if (this.selected[0].status === 1) {
                This.$Modal.warning({
                    title: "提示",
                    content: "请先提交!"
                });
                return false;
            }
            This.repairInOrderEntity.inOrderNo = this.selected[0].inOrderNo;
            This.repairInOrderEntity.status = this.selected[0].status;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        //驳回
        reject(value) {
            let This = this;
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
            if (this.selected[0].status === 4) {
                this.$Modal.warning({
                    title: "提示",
                    content: "该单据已审核通过,不能驳回"
                });
                return false;
            }
            if (this.selected[0].status === 1) {
                this.$Modal.warning({
                    title: "提示",
                    content: "请先提交!"
                });
                return false;
            }
            This.repairInOrderEntity.inOrderNo = this.selected[0].inOrderNo;
            This.repairInOrderEntity.status = this.selected[0].status;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            //未开启审批流，直接审核或驳回
            if (res.result.code === '100515') {
                if (this.modalType === 'approve') {
                    this.selected[0].status=4;
                    this.updateData(this.selected[0],"审核");
                }
                if (this.modalType === 'reject') {
                    this.selected[0].status=1;
                    this.updateData(this.selected[0],"驳回");
                }
            }
            if (res.result.code === '100100') {
                this.refresh();
            }
        },
        //更新单据数据
        updateData(rowData,msg) {
            let This = this;
            $.ajax({
                type: "POST",
                url: contextPath + "/repairInOrderController/updateInOrder",
                contentType: 'application/json',
                data: JSON.stringify(rowData),
                dataType: "json",
                success: function (data) {
                    if(data.code==='100100'){
                        setTimeout(()=>{
                            This.$Modal.success({
                                scrollable:true,
                                title: "提示",
                                content: msg+"成功!",
                                onOk(){
                                    This.refresh();
                                }
                            })
                        },300);
                    }else{
                        This.$Modal.error({
                            title: "提示",
                            content: msg+"失败!"
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
        },
        // 退出
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
    },
    created() {
    },
    mounted: function () {
        this.openTime = window.parent.params.openTime;
        this.openName = window.parent.params.name;
        this.$refs.customerRef.loadCustomerList('', '');
    }
})