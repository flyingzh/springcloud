let vm = new Vue({
    el: '#registration-list',
    data() {
        let This = this;
        return {
            selectCustomerObj: null, //所选的客户对象
            productTypeList: [],
            typeValue:"",
            repairRegisterNo:'',
            status: "",
            //控制弹窗显示
            modalTrigger: false,
            modalType: '',
            //审批进度条
            stepList: [],
            approvalTableData: [],
            openTime: '',//
            reload: false,//列表刷新
            selected: [],//列表选中的行
            tempDate: [],
            isHideSearch: true,
            isHideList: true,
            body: { //搜索条件
                goodsType:'',
                repairRegisterNo:'',
                startTime:'',
                endTime:'',
                custNo:''
            },
            statusMap: {
                "1": "暂存",
                "2": "待审核",
                "3": "审核中",
                "4": "已审核",
                "5": "驳回"
            },
            businessStatusMap:{
                "1":"待质检",
                "2":"已质检"
            },
            data_config: {
                url: contextPath + '/tRepairRegister/listPage',
                colNames: ["id", '单据编号', '日期', '单据状态', '业务状态',  '客户', '商品类型', '数量', '总重','登记人'],
                colModel: [
                    {name: 'id', hidden: true},
                    {
                        name: 'repairRegisterNo', index: 'repairRegisterNo', width: 200, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                This.detailClick({value, grid, rows, state})
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        }
                    },
                    {
                        name: 'repairTime', index: 'repairTime', width: 200, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'status', index: 'status', width: 180, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return vm.statusMap[value] === undefined ? "" : vm.statusMap[value];
                        }
                    },
                    {
                        name: 'businessStatus', index: 'businessStatus', width: 180, align: "left", sortable: false,
                        formatter: function (value, grid, rows, state) {
                            return vm.businessStatusMap[value] === undefined ? "" : vm.businessStatusMap[value];
                        }
                    },
                    {name: 'custName', index: 'custName', width: 180, align: "left"},
                    {name: 'goodsTypeName', index: 'goodsTypeName', width: 180, sortable: false, align: "left"},
                    {name: 'num', index: 'num', width: 180, sortable: false, align: "right"},
                    {name: 'totalWeight', index: 'totalWeight', width: 180, sortable: false, align: "right"},
                    {name: 'saleMenName', index: 'remark', width: 180, sortable: false, align: "left"}
                ],
                multiselect: true,
                multiboxonly: true,
            },

        }
    },
    methods: {
        // 格式化商品类型数据
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

        getProductType() {
            let that = this;
            $.ajax({
                type: "post",
                url: contextPath + '/tbasecommoditycategory/listByAll?parentId=0',
                dataType: "json",
                success: function (data) {
                    that.productTypeList = that.initGoodCategory(data.data.cateLists)
                },
                error: function () {
                    layer.alert('服务器出错啦');
                }
            })
        },
        // 级联商品类型
        changeProductType(value, selectedData) {
            let tempType = selectedData[selectedData.length - 1];
            this.body.goodsType = tempType.value;
        },
        detailClick(data) {
            let repairRegisterNo = data.rows.repairRegisterNo;
            window.parent.activeEvent({
                name: '维修登记单-查看',
                url: contextPath + '/repair/registration/registration-form.html',
                params: { type: 'view',repairRegisterNo:repairRegisterNo}
            });
        },
        // 判断有且仅选中一行
        checkRowNum() {
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择一条记录!"
                });
                return false;
            }else if(this.selected.length>1){
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "只能对单条数据操作!"
                });
                return false;
            }else {
                return true;
            }
        },
        // 处理搜索条件日期
        changeDate(value) {
            this.body.startTime = value[0]=="" ? "" : (value[0].replace(/\//g, '-') + ' 00:00:00');
            this.body.endTime = value[1]=="" ? "" : (value[1].replace(/\//g, '-') + ' 23:59:59');
        },
        hideSearch() {
            this.isSearchHide = !this.isSearchHide;
            $(".chevron").css("top", "")
        },
        /***********按钮栏开始*************/
        // 刷新
        refresh() {
            this.reload = !this.reload;
        },
        // 新增
        add() {
            window.parent.activeEvent({
                name: '维修登记单-新增',
                url: contextPath + '/repair/registration/registration-form.html',
                params: { type: 'add' }
            });
        },
        del(){
            if (this.selected.length === 0) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "请选择至少一条记录!"
                });
                return;
            }
            let selected = this.selected;
            let ids = [];
            for (let i = 0; i < selected.length; i++) {
                if(selected[i].status !== 1){
                    vm.$Modal.warning({
                        title: "提示",
                        content: "已提交的订单不能删除!",
                        okText: "确定"
                    });
                    return;
                }
                ids.push(selected[i].id);
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/tRepairRegister/delete",
                contentType: 'application/json',
                data: JSON.stringify(ids),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "删除成功!",
                            okText: "确定",
                            onOk: function () {
                                vm.reload = !vm.reload;
                            }
                        });
                    } else {
                        vm.$Modal.error({
                            title: "提示",
                            content: "删除失败!",
                            okText: "确定"
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })

        },
        // 提交
        submit() {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;

            var selected = this.selected[0];
            // 判断所选行状态
            if (selected.status !== 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "该单据之前已经提交过了,不能再提交!"
                });
                return;
            }
            // 判断所选数据是否通过基本校验
            if (selected.dataStatus === 1) {
                this.$Modal.warning({
                    title: "提示",
                    okText: "确定",
                    content: "订单信息不完整,请修改!"
                });
                return;
            }
            $.ajax({
                type: 'post',
                url: contextPath + "/tRepairRegister/submit",
                contentType: 'application/json',
                data: JSON.stringify(selected),
                dataType: "json",
                success: function (result) {
                    if (result.code === "100100") {
                        vm.$Modal.success({
                            title: "提示",
                            content: "提交成功!",
                            okText: "确定",
                            onOk: function () {
                                vm.reload = !vm.reload;
                            }
                        });
                    } else {
                        this.$Modal.error({
                            title: "提示",
                            content: "提交失败!",
                            okText: "确定"
                        });
                    }
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        // 审核
        approval(value) {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            this.repairRegisterNo = this.selected[0].repairRegisterNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'approve';
            This.modalTrigger = !This.modalTrigger;
        },
        // 驳回
        reject(value) {
            // 判断所选行有且仅有一条
            if (!this.checkRowNum()) return;
            this.repairRegisterNo = this.selected[0].repairRegisterNo;
            this.status = this.selected[0].status;
            let This = this;
            This.modalType = 'reject';
            This.modalTrigger = !This.modalTrigger;
        },
        //审核或者驳回回调
        approvalOrRejectCallBack(res) {
            let This = this;
            if (res.result.code === '100100') {
                this.reload = !this.reload;
            } else {
                this.$Modal.warning({
                    content: res.result.msg,
                    title: '警告'
                })
            }
        },
        // 退出
        exit() {
            window.parent.closeCurrentTab({ exit: true, openTime: this.openTime });
        },
        /***********按钮栏结束*************/
        /***********搜索栏开始***************/
        // 搜索栏搜索
        search() {
            this.reload = !this.reload;
        },
        // 搜索栏清空
        clear() {
            this.tempDate = [];
            this.body = {
                goodsType:'',
                repairRegisterNo:'',
                startTime:'',
                endTime:'',
                custNo:''
            };
            this.typeValue = "";
            this.$refs.customerRef.clear();
        },
        closeCustomer() {
            let rows = this.selectCustomerObj;
            if(rows){
                this.body.custNo = this.selectCustomerObj.code;
            }
            this.showCustomer = false;
        },
        /***********搜索栏结束***************/
    },
    mounted() {
        this.$refs.customerRef.loadCustomerList('', '');
        this.openTime = window.parent.params.openTime;
        this.getProductType();
    }
});