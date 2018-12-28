var pendingList = new Vue({
    el: '#pendingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isBodyHide: true,
            isTabulationHide: true, // 列表
            isShow: false,
            isHide: true,
            isEdit: false,
            reload: false,
            selected: [],
            categoryType: [],
            empList: [],
            commodityCategoty: [],
            dateArr: [],
            supplierList: [],
            body: {
                goodsTypePath: '',
                certificateType: '',
                supplierId: '',
                orderNo: '',
                startTime: '',
                endTime: ''
            },
            data_config: {
                url: contextPath + '/waitCertiBackInfo/listPage',
                colNames: ['源单类型', '日期','单据编号', 'id', '供应商', '供应商Id', '商品类型', '业务类型', '证书类型', '证书数量',  '发货数量', '发货重量'],
                colModel: [
                    {name: 'sourceType', index: 'sourceType', align: "left", width: 100},
                    {name: 'deliveryDate', index: 'deliveryDate', width: 100, align: "left",
                        formatter:function(value,grid,rows,state){
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {
                        name: 'orderNo', index: 'orderNo', width: 190, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click', ".detail" + value).on('click', ".detail" + value, function () {
                                console.log({value, grid, rows, state});
                            });
                            let myCode = `<a class="detail${value}">${value}</a>`;
                            return myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'id', hidden: true},
                    {name: 'supplier', index: 'supplier', width: 150, align: "center", align: "left"},
                    {name: 'supplierId', hidden: true},
                    {name: 'goodsTypeName', index: 'goodsTypeName', align: "left", width: 100},
                    {
                        name: 'businessType', index: 'businessType', align: "left", width: 100,
                        formatter: function (value, grid, rows, state) {
                            if (value == 'P_CREDENTIAL_OUT_01') {
                                return '标配证书';
                            } else if (value == 'P_CREDENTIAL_OUT_02') {
                                return '特殊证书'
                            } else {
                                return '';
                            }
                        }
                    },
                    {name: 'certificateType', index: 'certificateType', width: 100, align: "left"},
                    {name: 'certificateNumber', index: 'certificateNumber', width: 100, align: "right"},
                    {name: 'deliverGoodsNumber', index: 'deliverGoodsNumber', align: "right", width: 100},
                    {name: 'deliverWeight', index: 'deliverWeight', align: "right", width: 100}
                ],
                // shrinkToFit: false,
            },
        }
    },
    methods: {
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supplierId = id;
        },
        //搜索清空按钮
        search() {
            if(!this.body.certificateType){
                this.body.certificateType = '';
            }
            if (this.commodityCategoty.length > 0) {
                this.body.goodsTypePath = this.commodityCategoty[this.commodityCategoty.length - 1];
            } else {
                this.body.goodsTypePath = "";
            }
            if (this.dateArr.length > 0 && this.dateArr[0] && this.dateArr[1]) {
                this.body.startTime = this.dateArr[0].format("yyyy-MM-dd HH:mm:ss");
                this.body.endTime = this.dateArr[1].format("yyyy-MM-dd HH:mm:ss");
            } else {
                this.body.startTime = '';
                this.body.endTime = '';
            }
            this.reload = !this.reload;
        },
        clear() {
            this.body = {
                goodsTypePath: '',
                certificateType: '',
                supplierId: '',
                orderNo: '',
                startTime: '',
                endTime: ''
            },
            this.$refs.certificateType.reset();
            this.$refs.supplier.clear();
            let config = {
                postData: {
                    goodsTypePath: '',
                    certificateType: '',
                    supplierId: '',
                    orderNo: '',
                    startTime: '',
                    endTime: ''
                }
            }
            this.commodityCategoty = [];
            this.dateArr = [];
            jQuery("#myTable").jqGrid('clearGridData');
            jQuery("#myTable").jqGrid('setGridParam', config).trigger("reloadGrid");
        },
        //顶部菜单栏按/**/钮
        refresh() {
            this.clear();
            this.selected = [];
            this.reload = !this.reload;

        },
        generateReport() {
            var ids = [];
            if (pendingList.selected.length == 0) {
                pendingList.$Modal.info({
                    title: '提示信息',
                    content: '<p>请先勾选单据信息</p>'
                });
                return false;
            }
            var supplierId = pendingList.selected[0].supplierId;
            var goodsTypePath = pendingList.selected[0].goodsTypePath;
            var businessType = pendingList.selected[0].businessType;
            var certificateType = pendingList.selected[0].certificateType;
            for (var i = 1; i < pendingList.selected.length; i++) {
                if (supplierId != pendingList.selected[i].supplierId) {
                    pendingList.$Modal.info({
                        title: '提示信息',
                        content: '<p>请选择相同供应商</p>'
                    });
                    return false;
                }
                if (goodsTypePath != pendingList.selected[i].goodsTypePath) {
                    pendingList.$Modal.info({
                        title: '提示信息',
                        content: '<p>请选择相同的商品类型</p>'
                    });
                    return false;
                }
                if (businessType != pendingList.selected[i].businessType) {
                    pendingList.$Modal.info({
                        title: '提示信息',
                        content: '<p>请选择相同的业务类型</p>'
                    });
                    return false;
                }
                if (certificateType != pendingList.selected[i].certificateType) {
                    pendingList.$Modal.info({
                        title: '提示信息',
                        content: '<p>请选择相同的证书类型</p>'
                    });
                    return false;
                }
            }
            for (var i = 0; i < pendingList.selected.length; i++) {
                ids.push(pendingList.selected[i].id);
            }
            window.parent.activeEvent({
                name: '新增证书商品收回单',
                url: contextPath + '/purchase/certificate-back-report/certificate-back-add.html',
                params:{
                    type:"generate",
                    ids:ids
                }
            });
        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        getSupplierList() {
            $.ajax({
                type: "post",
                url: contextPath + '/waitCertiBackInfo/getSupplierList',
                data: {},
                success: function (res) {
                    if (res.data != '') {
                        for (var i = 0; i < res.data.length; i++) {
                            pendingList.supplierList.push({
                                id: res.data[i].id,
                                supplier: res.data[i].siShortName,
                            });
                        }
                    }
                }
            })
        },
        //加载商品类型
        loadProductType() {
            var That = this;
            $.ajax({
                type: "post",
                url: contextPath + '/documentController/getCategory?parentId=0',
                contentType: 'application/json',
                dataType: "json",
                success: function (res) {
                    That.categoryType = That.initGoodCategory(res.data.cateLists)
                },
                error: function (err) {
                    console.log("服务器出错");
                },
            })
        },
        changeCategory(e) {
            this.body.goodsTypePath = e[e.length - 1];
        },
        initGoodCategory(type) {
            let result = [];
            type.forEach((item) => {
                let {
                    customCode: value,
                    name: label,
                    cateLists: children
                } = item

                if (children) {
                    children = this.initGoodCategory(children)
                }
                result.push({
                    value,
                    label,
                    children
                })
            })
            result.forEach((item) => {
                if (!item.children) {
                    delete item.children;
                }
            })
            return result
        },
        //加载业务员信息
        loadEmplist() {
            $.ajax({
                type: "post",
                // url: contextPath + '',
                url: './empList.json',
                dataType: "json",
                success: function (data) {
                    purchaseOrderList.empList = data.data;
                },
                error: function () {
                    alert('服务器出错啦');
                }
            })
        },
        //加载单据状态
        // loadDocumentStatus(){
        //     $.ajax({
        //         type: "post",
        //         // url: contextPath + '',
        //         url:'./documentStatus.json',
        //         dataType: "json",
        //         success: function (data) {
        //             purchaseOrderList.documentStatusList = data.data;
        //         },
        //         error: function () {
        //             alert('服务器出错啦');
        //         }
        //     })
        // }
    },
    created() {
        this.loadProductType();
        this.getSupplierList();
        // this.loadEmplist();
        // this.loadDocumentStatus();
    },
    watch: {
        'body.certificateType':function(val){
           if(val === '-1'){
               this.body.certificateType = '';
            }
        }
    },
    mounted() {
        this.openTime = window.parent.params.openTime;
    },
})
