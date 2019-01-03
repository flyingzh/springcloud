var pendingList = new Vue({
    el: '#pendingList',
    data() {
        let This = this;
        return {
            openTime: '',
            isSearchHide: true, //搜索栏
            isTabulationHide: true, // 列表
            isShow: false,
            isHide:true,
            isEdit: false,
            reload: false,
            selected: [],
            categoryType: [],
            commodityCategoty: [],
            empList:[],
            supplierList:[],
            dateArr:[],
            id:'',
            body: {
                goodsTypePath:'',
                certificateType:'',
                supplierId:'',
                orderStatus:'',
                startTime:'',
                endTime:''
            },
            data_config: {
                url: contextPath + '/certificateBackInfo/listPage',
                colNames: ['id','单据编号','日期','供应商', '商品类型', '业务类型', '证书类型','证书数量','单据状态','收货数量','证书费用','总成本'],
                colModel: [
                    {name: 'id', hidden:true},
                    {name: 'orderNo', index: 'orderNo', width: 190, align: "left",
                        formatter: function (value, grid, rows, state) {
                            $(document).off('click',".detail"+ value).on('click',".detail"+ value,function(){
                                pendingList.id = rows.id;
                                pendingList.view();
                            });
                            let myCode =  `<a class="detail${value}">${value}</a>`;
                            return  myCode;
                        },
                        unformat: function (value, grid, rows) {
                            return value.replace(/(<\/?a.*?>)/g, '');
                        }
                    },
                    {name: 'receiptDate', index: 'receiptDate', width: 100, align: "left",
                        formatter:function(value,grid,rows,state){
                            return new Date(value).format("yyyy-MM-dd");
                        }
                    },
                    {name: 'supplier', index: 'supplier', width: 150, align: "center",align:"left"},
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
                    {name: 'certificateNum', index: 'certificateNum', width: 100, align: "right"},
                    {name: 'orderStatus', index: 'orderStatus', width: 100, align: "left",
                        formatter: function (value, grid, rows, state) {
                            if (value == 1) {
                                return '暂存';
                            } else if (value == 2) {
                                return '待审核'
                            } else if (value == 3) {
                                return '审核中'
                            }else if (value == 4) {
                                return '已审核'
                            }else if(value == 5){
                                return '驳回'
                            } else {
                                return '';
                            }
                        }
                    },
                    {name: 'receiptCount', index: 'receiptCount', width: 100, align: "right"},
                    {name: 'certificateCost', index: 'certificateCost', width: 100, align: "right"},
                    {name: 'totalCost', index: 'totalCost', width: 100, align: "right"}

                ],
                shrinkToFit:false,
            },
        }
    },
    methods: {
        closeSupplier(id, code, name){
            console.log(id, code, name);
            this.body.supplierId = id;
        },
        search() {
            if(!this.body.certificateType){
                this.body.certificateType = '';
            }
            if(!this.body.orderStatus){
                this.body.orderStatus = '';
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
        clear() {
            this.$refs.supplier.clear();
            this.body = {
                goodsTypePath:'',
                certificateType:'',
                supplierId:'',
                orderStatus:'',
                startTime:'',
                endTime:''
            }
            let config = {
                postData: {
                    goodsTypePath: '',
                    certificateType: '',
                    supplierId: '',
                    orderStatus: '',
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
        refresh(){
            this.body={
                goodsTypePath:'',
                certificateType:'',
                supplierId:'',
                orderStatus:'',
                startTime:'',
                endTime:''
            },
            this.reload = !this.reload;
        },
        //新增
        add() {
            window.parent.activeEvent({name: '新增证书商品收回单', url: contextPath+'/purchase/certificate-back-report/certificate-back-add.html',
                params: {
                    type:'add'
                }
            });
        },
        //删除
        del(){
            var ids = [];
            for(var i=0;i<this.selected.length;i++){
                ids.push(this.selected[i].id);
            }
            if(ids.length == 0){
                pendingList.$Modal.warning({
                    title:'提示信息',
                    content:'请选择至少一条数据'
                });
                return false;
            }
            this.$Modal.confirm({
                title: '提示信息',
                content: '是否删除信息？',
                onOk: () =>{
                    $.ajax({
                        type: "post",
                        url: contextPath + '/certificateBackInfo/delete',
                        contentType: 'application/json',
                        data: JSON.stringify(ids),
                        dataType: "json",
                        success: function (res) {
                            if (res.code === '100100' && res.data === '' ) {
                                setTimeout(function(){
                                    pendingList.$Modal.success({
                                        title: '提示信息',
                                        content: '删除成功',
                                        onOk:function(){
                                            pendingList.reload = !pendingList.reload;
                                        }
                                    })
                                },300)

                            } else if(res.code === '100100' && res.data != '' ) {
                                setTimeout(function(){
                                    pendingList.$Modal.warning({
                                        title: '提示信息',
                                        content: res.data,
                                        onOk:function(){
                                            pendingList.reload = !pendingList.reload;
                                        }
                                    })
                                },300)
                            }else {
                                pendingList.$Modal.warning({
                                    title: '提示信息',
                                    content: '删除失败',
                                    onOk: () => {
                                        pendingList.reload = ! pendingList.reload
                                    }
                                })
                                pendingList.reload = ! pendingList.reload
                            }
                        },
                        error: function (err) {
                            pendingList.$Modal.warning({
                                title: '提示信息',
                                content: '服务器错误',
                                closable: true
                            })
                        },
                    })
                },
            })
        },
        update(){
            var That = this;
            if (That.selected.length > 1) {
                That.$Modal.info({
                    title:'提示信息',
                    content:'最多选择一条数据！'
                });
                return false;
            }
            if (That.selected.length == 0) {
                That.$Modal.info({
                    title:'提示信息',
                    content:'请选择至少一条数据！'
                });
                return false;
            }
            window.parent.activeEvent({name: '修改证书商品收回单', url: contextPath+'/purchase/certificate-back-report/certificate-back-add.html',
                params:{
                    type:'update',
                    id:That.selected[0].id
                }
            });
        },
        view() {
            var That = this;
            window.parent.activeEvent({
                name: '查看证书商品收回单',
                url: contextPath + '/purchase/certificate-back-report/certificate-back-add.html',
                params: {
                        type: 'update',
                        id: That.id
                }
            });
        },
        print(){

        },
        annex(){

        },
        cancel() {
            window.parent.closeCurrentTab({exit: true, openTime: this.openTime});
        },
        preView(){

        },

    },
    created(){
        this.getSupplierList();
        this.loadProductType();
        // this.loadEmplist();
        // this.loadDocumentStatus();
    },
    watch: {
    
    },
    mounted(){
        this.openTime = window.parent.params.openTime;
    },
})
